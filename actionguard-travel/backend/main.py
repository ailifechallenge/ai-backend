import os, shutil, io, logging, asyncio, hashlib, json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))
from fastapi import FastAPI, HTTPException, UploadFile, File, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.exception_handlers import request_validation_exception_handler
from backend.push.api import router as push_router
from backend.models.contracts import *
from backend.adapters.nws import NWS
from backend.adapters.jma import JMA
from backend.adapters.seismic import Seismic
from backend.adapters.shelters import Shelters
from backend.adapters.japan_shelters import JapanShelters
from backend.adapters.walking import Walking
from backend.adapters.navigation import Navigation, NavigationInput
from backend.models.shelters import ShelterSearch, RouteInput, WalkingRoute, Origin
from backend.core.gemini import Gemini
from backend.core.cache import Cache
from backend.core.translator import translate
from backend.core.extractor import extract_compare
from backend.core.verification import assess
from backend.core.guidance import guidance
from backend.core.urgency import assess_urgency
from backend.core.urgency_ai import interpret_urgency
from backend.local_runtime import runtime_identity

LOCAL_RUNTIME = {**runtime_identity(), 'kind': 'backend'}

app = FastAPI(title="ActionGuard Travel 2.9", version="2.9.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,capacitor://localhost,https://localhost,http://localhost"
    ).split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)
app.include_router(push_router)

@app.get('/api/local-runtime', include_in_schema=False)
async def local_runtime():
    return LOCAL_RUNTIME

@app.exception_handler(RequestValidationError)
async def invalid_request(request, exc):
    if request.url.path.startswith("/api/push/"):
        return JSONResponse(status_code=422,content={"detail":"기기 연결 정보와 구독 지역을 확인해 주세요."})
    return await request_validation_exception_handler(request,exc)

nws = NWS()
jma = JMA()
seismic = Seismic()
shelters = Shelters()
japan_shelters = JapanShelters()
walking = Walking()
navigation = Navigation(walking)
gemini = Gemini()
results = Cache(ttl=600, limit=64)
analysis_lock = asyncio.Lock()


@app.exception_handler(HTTPException)
async def expected(request, exc):
    if exc.status_code >= 500:
        logging.getLogger("actionguard").warning(
            "API failure path=%s status=%s", request.url.path, exc.status_code
        )
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def unexpected(request, exc):
    logging.getLogger("actionguard").error(
        "Unexpected error path=%s type=%s", request.url.path, type(exc).__name__
    )
    return JSONResponse(
        status_code=500, content={"detail": "서버 처리 오류입니다. 다시 시도하세요."}
    )


@app.get("/api/health", response_model=Health)
async def health():
    return Health(
        status="ok",
        ai_configured=bool(os.getenv("GEMINI_API_KEY"))
        and os.getenv("GEMINI_FREE_TIER_CONFIRMED") == "true",
        model=os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite"),
        ocr_available=bool(shutil.which("tesseract")),
    )


@app.get("/api/alerts", response_model=Alerts)
async def alerts(
    area: str | None = Query(None, pattern="^[A-Za-z]{2}$"),
    lat: float | None = Query(None, ge=-90, le=90),
    lon: float | None = Query(None, ge=-180, le=180),
):
    if area and (lat is not None or lon is not None):
        raise HTTPException(422, "주 코드 또는 좌표 중 하나만 선택하세요.")
    if not area and (lat is None or lon is None):
        raise HTTPException(422, "주 코드 또는 위도·경도가 필요합니다.")
    valid = "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC AS GU MP PR VI"
    if area and area.upper() not in valid.split():
        raise HTTPException(422, "미국 주/영토 코드를 확인하세요.")
    return await nws.alerts(
        {"area": area.upper()} if area else {"point": f"{lat},{lon}"}
    )


@app.get("/api/japan/areas")
async def japan_areas():
    return await jma.areas()


@app.get("/api/japan/alerts", response_model=Alerts)
async def japan_alerts(office: str = Query(..., pattern="^\\d{6}$")):
    return await jma.alerts(office)


def linked_alert(body):
    if body.alert_id and body.alert_id.startswith("jma:"):
        return jma.linked(body)
    return nws.linked(body)


async def cached(key, fn):
    digest = hashlib.sha256(key.encode()).hexdigest()
    async with analysis_lock:
        hit = results.get(digest)
        if hit is not None:
            return hit
        return results.put(digest, await fn())


@app.post("/api/translate", response_model=Translation)
async def translation(body: Input):
    official = linked_alert(body)
    instruction = official.instruction if official else None
    us_weather = bool(official and not body.alert_id.startswith("jma:"))
    cache_key = json.dumps({
        "text": body.text, "instruction": instruction, "us_weather": us_weather,
        "model": os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite"),
    }, ensure_ascii=False, sort_keys=True)
    return await cached(
        "t" + cache_key,
        lambda: translate(
            body.text, gemini, instruction, us_weather=us_weather
        ),
    )


@app.post("/api/verify", response_model=Verification)
async def verification(body: VerifyInput):
    official = linked_alert(body)

    async def run():
        sf, tf, j = await extract_compare(body.text, body.translation, gemini, body.displayed)
        return assess(body.text, body.translation, sf, tf, j, official, body.displayed)

    return await cached("v" + body.model_dump_json(), run)


@app.post("/api/guidance", response_model=Guidance)
async def guide(body: Input):
    return guidance(body.text, linked_alert(body), body.country)


@app.post('/api/urgency', response_model=UrgencyAssessment)
async def urgency(body: UrgencyInput):
    official = linked_alert(body)
    if not body.use_ai:
        return assess_urgency(body.text, official, body.country)
    return await interpret_urgency(body.text, gemini, official, body.country)


@app.post("/api/ocr", response_model=OCR)
async def ocr(file: UploadFile = File(...)):
    if not shutil.which("tesseract"):
        raise HTTPException(
            503,
            "무료 OCR 엔진 Tesseract가 설치되지 않았습니다. 텍스트 입력 또는 NWS 조회를 사용하세요.",
        )
    if file.content_type not in ["image/png", "image/jpeg", "image/webp"]:
        raise HTTPException(415, "PNG/JPEG/WEBP만 지원합니다.")
    data = await file.read(6 * 1024 * 1024 + 1)
    if len(data) > 6 * 1024 * 1024:
        raise HTTPException(413, "이미지는 6MB 이하로 업로드하세요.")

    def recognize():
        from PIL import Image
        import pytesseract

        Image.MAX_IMAGE_PIXELS = 12000000
        try:
            im = Image.open(io.BytesIO(data))
            if im.width * im.height > 12000000:
                raise ValueError()
            im.load()
            text = pytesseract.image_to_string(im, lang="eng", timeout=30).strip()
            if not text or len(text) > 16000:
                raise ValueError()
            return OCR(
                text=text,
                note="로컬 OCR 결과입니다. 숫자·시간·지명을 확인하고 수정한 뒤 번역하세요.",
            )
        except Exception:
            raise HTTPException(
                422,
                "이미지를 읽을 수 없거나 OCR 처리에 실패했습니다. 원문을 직접 입력하세요.",
            ) from None

    return await asyncio.to_thread(recognize)


async def check_stay(body, official):
    from backend.core.conflict import conflict
    initial = conflict(body.stay, official)
    # NWS point lookup supplements absent geometry; it is not treated as a
    # precise polygon and absence is not proof of no overlap (updates may differ).
    if official and body.stay.country == 'US' and not official.geometry and initial.status == '판정 불가' and body.stay.latitude is not None:
        if not initial.reasons[0].startswith('장소:'):
            return initial
        rows = await nws.alerts({'point': f'{body.stay.latitude},{body.stay.longitude}'})
        matching = next((a for a in rows.alerts if a.id == official.id and a.text == official.text), None)
        return conflict(body.stay, matching or official, point_membership=matching is not None)
    return initial


@app.post('/api/conflict', response_model=Conflict)
async def check_conflict(body: ConflictInput):
    return await check_stay(body, linked_alert(body))


@app.post('/api/chat', response_model=ChatAnswer)
async def chat(body: ChatInput):
    return await app_assistant.answer(body)


from backend.adapters.local_information import LocalInformation
from backend.core.app_assistant import AppAssistant
from backend.push.api import weather as assistant_weather, status as notification_status

async def assistant_verify(data, translated):
    return await verification(VerifyInput(**data.model_dump(), translation=translated.translation,
        displayed={'summary':'\n'.join(translated.summary),'hazard_explanation':translated.hazard_explanation}))

app_assistant=AppAssistant(
    LocalInformation(nws,jma,assistant_weather,shelters,japan_shelters),gemini,linked_alert,
    {'translate':translation,'urgency':lambda data:urgency(UrgencyInput(**data.model_dump())),
     'verify':assistant_verify,'conflict':check_stay,'notification_status':notification_status,
     'record':lambda identity:nws.records.get(identity) or jma.records.get(identity)},seismic)


@app.get("/api/shelters", response_model=ShelterSearch)
async def nearby_shelters(
    lat: float = Query(..., ge=-90, le=90, allow_inf_nan=False),
    lon: float = Query(..., ge=-180, le=180, allow_inf_nan=False),
    radius_km: float = Query(10, ge=0.5, le=50, allow_inf_nan=False),
    disaster: str = Query('general'),
    country: str = Query('US',pattern='^(US|JP)$'),
    include_registered: bool = Query(False),
):
    adapter=japan_shelters if country=='JP' else shelters
    return await adapter.search(lat, lon, radius_km, disaster, include_registered)


@app.post("/api/shelters/route", response_model=WalkingRoute)
async def walking_route(body: RouteInput):
    # Destinations come only from recent server-side official records.
    shelter = shelters.linked(body.shelter_id)
    return await walking.route(Origin(lat=body.lat, lon=body.lon), shelter)


@app.get('/api/navigation/config')
async def navigation_config():
    return {'provider':'osrm','api_key_required':False,'countries':['US','JP'],'modes':['WALK','DRIVE'],'version':'2.9'}


@app.post('/api/navigation/route')
async def navigation_route(body: NavigationInput):
    return await navigation.route(body)



@app.post('/api/journey/context')
async def journey_context(body: Input):
    from backend.core.hazard_state import classify_hazard
    official=linked_alert(body)
    source=official.text if official else body.text
    tokens={'flood':['flood','洪水'],'earthquake':['earthquake','地震'],'tsunami':['tsunami','津波'],
            'landslide':['landslide','土砂災害'],'storm_surge':['storm surge','高潮'],
            'volcano':['volcano','噴火'],'hurricane':['hurricane'],'tornado':['tornado'],'wildfire':['wildfire','山火事']}
    return {'hazards':[name for name,words in tokens.items() if classify_hazard(source,words).state=='mentioned']}


@app.get("/api/japan/earthquakes")
async def japan_earthquakes():
    return await seismic.earthquakes()

@app.get("/api/japan/earthquakes/{filename}")
async def japan_earthquake(filename: str):
    return await seismic.earthquake(filename)

@app.get("/api/japan/tsunami")
async def japan_tsunami():
    return await seismic.tsunami()

@app.get("/api/japan/tsunami-coasts")
async def japan_tsunami_coasts():
    return await seismic.coasts()
