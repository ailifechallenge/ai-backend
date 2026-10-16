import asyncio, json
import httpx, pytest
from fastapi.testclient import TestClient
from fastapi import HTTPException
import backend.main as main
from backend.adapters.nws import NWS, parse
from backend.adapters.jma import JMA, parse as parse_jma
from backend.core.gemini import Gemini
from backend.core.cache import Cache
from backend.models.contracts import *
from backend.core.verification import assess
from backend.core.guidance import guidance
from backend.core.translator import add_celsius_equivalents, PROMPT


def feature():
    return {
        "features": [
            {
                "id": "https://api.weather.gov/alerts/test",
                "properties": {
                    "event": "Flash Flood Warning",
                    "headline": "Test only",
                    "areaDesc": "Demo County",
                    "severity": "Severe",
                    "senderName": "NWS Test",
                    "sent": "2026-10-14T10:00:00Z",
                    "effective": "2026-10-14T10:00:00Z",
                    "expires": "2026-10-14T15:00:00Z",
                    "description": "Move to higher ground until 6 PM.",
                    "instruction": "Do not drive through flooded roads.",
                },
            }
        ]
    }


def facts(kind="required_action", quote="Stay inside"):
    return Facts(facts=[Fact(kind=kind, value="실내 대기", quote=quote)])


def judge():
    return Judgment(issues=[], unresolved=[])


def run(c):
    return asyncio.run(c)


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr(main, "nws", NWS())
    monkeypatch.setattr(main, "results", Cache())
    monkeypatch.setattr(main, "analysis_lock", asyncio.Lock())
    with TestClient(main.app) as c:
        yield c


def test_parse_dedup_and_empty():
    p = feature()
    p["features"] *= 2
    assert len(parse(p, "now")) == 1
    assert parse({"features": []}, "now") == []
    assert parse(p, "now")[0].sender == "NWS Test"


@pytest.mark.parametrize("status", [403, 500, 429])
def test_nws_errors(status):
    async def task():
        async with httpx.AsyncClient(
            transport=httpx.MockTransport(lambda r: httpx.Response(status))
        ) as c:
            with pytest.raises(HTTPException) as e:
                await NWS(c).alerts({"area": "CA"})
            assert e.value.status_code == 502

    run(task())


def test_nws_timeout():
    def fail(r):
        raise httpx.ReadTimeout("timeout")

    async def task():
        async with httpx.AsyncClient(transport=httpx.MockTransport(fail)) as c:
            with pytest.raises(HTTPException) as e:
                await NWS(c).alerts({"area": "CA"})
            assert e.value.status_code == 504

    run(task())


def test_nws_headers_and_cache():
    calls = []

    def reply(r):
        calls.append(r)
        assert "ActionGuard" in r.headers["user-agent"]
        return httpx.Response(200, json={"features": []})

    async def task():
        async with httpx.AsyncClient(transport=httpx.MockTransport(reply)) as c:
            n = NWS(c)
            await n.alerts({"area": "CA"})
            await n.alerts({"area": "CA"})

    run(task())
    assert len(calls) == 1


def test_time_change():
    v = assess(
        "Stay inside until 6 PM",
        "오후 8시까지 실내에 계세요",
        facts(),
        facts(quote="실내에 계세요"),
        judge(),
    )
    assert v.status == "불일치 탐지" and any(i.method == "rule" for i in v.issues)


def test_repeated_alert_times_with_minutes_do_not_create_false_issue():
    source = (
        "Alert issued October 13 at 11:21AM PDT until October 17 at 8:00PM PDT. "
        "From 10 AM Thursday to 8 PM PDT Saturday."
    )
    target = (
        "10월 13일 오전 11:21 PDT부터 10월 17일 오후 8:00 PDT까지. "
        "목요일 오전 10시부터 토요일 오후 8시까지."
    )
    result = assess(source, target, facts(), facts(quote=target), judge())
    assert not any(issue.kind in {"start_time", "end_time"} for issue in result.issues)


def test_us_weather_temperature_keeps_fahrenheit_and_adds_celsius():
    source = "Temperatures up to 95 expected."
    translated = "기온은 최고 95도까지 오를 것으로 예상됩니다."
    assert add_celsius_equivalents(source, translated, us_weather=True) == (
        "기온은 최고 95°F (약 35°C)까지 오를 것으로 예상됩니다."
    )


def test_translation_prompt_accepts_japanese_and_preserves_celsius():
    assert "English or Japanese" in PROMPT
    assert "preserve those values" in PROMPT


def test_wind_speed_conversion_does_not_change_dates_to_temperature():
    source = "High Wind Warning issued October 14. Gusts from 60 to 70 mph expected."
    translated = "10월 14일 강풍 경보. 돌풍은 60~70 mph로 예상됩니다."
    assert add_celsius_equivalents(source, translated) == (
        "10월 14일 강풍 경보. 돌풍은 60~70 mph (약 97~113 km/h)로 예상됩니다."
    )


def test_negation_inversion():
    v = assess(
        "Do not drive through flooded roads.",
        "침수 도로를 운전해도 됩니다.",
        facts("prohibition", "Do not drive through flooded roads"),
        facts("required_action", "운전해도 됩니다"),
        judge(),
    )
    assert v.status == "불일치 탐지"


def test_missing_action():
    j = Judgment(
        issues=[
            Issue(
                kind="required_action",
                severity="critical",
                source_quote="Stay inside",
                translation_quote=None,
                reason="필수 행동 누락",
            )
        ],
        unresolved=[],
    )
    v = assess(
        "Stay inside. Flood Warning.",
        "홍수 Warning",
        facts(),
        facts("hazard", "홍수"),
        j,
    )
    assert v.status == "불일치 탐지"


def test_fabricated_evidence():
    j = Judgment(
        issues=[
            Issue(
                kind="area",
                severity="critical",
                source_quote="Fake County",
                translation_quote=None,
                reason="누락",
            )
        ],
        unresolved=[],
    )
    v = assess("Stay inside", "실내에 계세요", facts(), facts(quote="실내에 계세요"), j)
    assert v.status == "검증 불가" and not v.issues


def test_empty_facts_unverifiable():
    v = assess(
        "Stay inside", "실내에 계세요", Facts(facts=[]), Facts(facts=[]), judge()
    )
    assert v.status == "검증 불가"


def test_no_mismatch():
    assert (
        assess(
            "Stay inside",
            "실내에 계세요",
            facts(),
            facts(quote="실내에 계세요"),
            judge(),
        ).status
        == "불일치 미탐지"
    )


def test_number_unit_and_date():
    v = assess(
        "Wind 60 mph on 2026-10-14",
        "바람 30 mph",
        facts("number_unit", "60 mph"),
        facts("number_unit", "30 mph"),
        judge(),
    )
    assert any(i.kind == "number_unit" for i in v.issues) and v.unresolved


@pytest.mark.parametrize(
    "event", ["Flood", "Tornado", "Heat", "Winter Storm", "Hurricane", "Red Flag", "High Wind Warning"]
)
def test_guides(event):
    g = guidance(event, country="US")
    assert len(g.cards) == 1
    assert g.cards[0].url.startswith("https://www.weather.gov/safety/")
    assert g.cards[0].category == "general"
    if event == "High Wind Warning":
        assert "창문" in g.cards[0].text and "끊어진 전선" in g.cards[0].text


def test_official_and_unknown():
    a = parse(feature(), "now")[0]
    g = guidance(a.text, a)
    assert g.cards[0].text == a.instruction and g.cards[0].category == "official"
    fallback = guidance("Something unknown").cards
    assert len(fallback) == 1 and fallback[0].title == "지금 할 일"


def test_jma_warnings_use_municipality_names_and_ignore_cancellations():
    areas = {
        "class20s": {
            "1310100": {"name": "千代田区"},
            "1310200": {"name": "中央区"},
        }
    }
    reports = [
        {
            "reportDatetime": "2026-10-14T10:00:00+09:00",
            "warning": {
                "class20Items": [
                    {"areaCode": "1310100", "kinds": [{"code": "05", "status": "発表"}]},
                    {"areaCode": "1310200", "kinds": [{"code": "05", "status": "継続"}]},
                ]
            },
        },
        {
            "reportDatetime": "2026-10-14T11:00:00+09:00",
            "warning": {
                "class20Items": [
                    {"areaCode": "1310100", "kinds": [{"code": "05", "status": "解除"}]}
                ]
            },
        },
    ]
    alerts = parse_jma("130000", reports, areas, "checked")
    assert len(alerts) == 1
    assert alerts[0].event.startswith("High Wind Warning")
    assert alerts[0].area == "中央区"
    assert alerts[0].id.startswith("jma:130000:05:")
    assert alerts[0].effective is None
    assert alerts[0].sender == "JMA · 気象庁"


def test_japanese_guidance_uses_local_wind_safety_advice():
    cards = guidance("暴風警報、強風に注意してください", country="JP").cards
    assert cards[0].title == "강풍·태풍 행동요령"
    assert "창문" in cards[0].text and "바람이 강해지기 전에" in cards[0].text
    assert cards[0].agency.startswith("ActionGuard")


def test_input_and_provenance(client):
    assert client.get("/api/alerts?lat=200&lon=0").status_code == 422
    assert client.get("/api/alerts?area=ZZ").status_code == 422
    assert client.get("/api/alerts?area=CA&lat=0&lon=0").status_code == 422
    assert client.post("/api/translate", json={"text": "  "}).status_code == 422
    assert (
        client.post(
            "/api/guidance", json={"text": "Flood", "alert_id": "invented"}
        ).status_code
        == 409
    )
    a = parse(feature(), "now")[0]
    main.nws.records.put(a.id, a)
    assert (
        client.post(
            "/api/guidance", json={"text": "edited", "alert_id": a.id}
        ).status_code
        == 409
    )


def test_missing_key_and_ocr(client, monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    assert (
        client.post("/api/translate", json={"text": "Stay inside"}).status_code == 503
    )
    monkeypatch.setattr(main.shutil, "which", lambda _: None)
    assert (
        client.post(
            "/api/ocr", files={"file": ("x.png", b"bad", "image/png")}
        ).status_code
        == 503
    )
    assert "GEMINI_API_KEY" not in client.get("/api/health").text


@pytest.mark.parametrize(
    "payload,status",
    [
        ({}, 502),
        ({"candidates": []}, 502),
        ({"candidates": [{"finishReason": "MAX_TOKENS"}]}, 502),
        (
            {
                "candidates": [
                    {"finishReason": "STOP", "content": {"parts": [{"text": "{}"}]}}
                ]
            },
            502,
        ),
    ],
)
def test_gemini_invalid(monkeypatch, payload, status):
    monkeypatch.setenv("GEMINI_API_KEY", "secret")
    monkeypatch.setenv("GEMINI_FREE_TIER_CONFIRMED", "true")

    async def task():
        async with httpx.AsyncClient(
            transport=httpx.MockTransport(lambda r: httpx.Response(200, json=payload))
        ) as c:
            with pytest.raises(HTTPException) as e:
                await Gemini(c).structured(Translation, "system", "test")
            assert e.value.status_code == status and "secret" not in str(e.value)

    run(task())


def test_gemini_quota_no_retry(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "secret")
    monkeypatch.setenv("GEMINI_FREE_TIER_CONFIRMED", "true")
    calls = []

    def reply(r):
        calls.append(r)
        return httpx.Response(429, json={"secret": "secret"})

    async def task():
        async with httpx.AsyncClient(transport=httpx.MockTransport(reply)) as c:
            with pytest.raises(HTTPException) as e:
                await Gemini(c).structured(Translation, "system", "test")
            assert e.value.status_code == 429 and "secret" not in str(e.value)

    run(task())
    assert len(calls) == 1


def test_full_mock_http_flow(client, monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "fake")
    monkeypatch.setenv("GEMINI_FREE_TIER_CONFIRMED", "true")
    outputs = [
        {
            "translation": "Demo County Flash Flood Warning. 오후 6시까지 높은 곳으로 이동하세요. 침수 도로를 운전하지 마세요.",
            "hazard_explanation": "홍수",
            "glossary": [],
            "summary": ["높은 곳으로 이동"],
        },
        facts("required_action", "Move to higher ground").model_dump(),
        facts("required_action", "높은 곳으로 이동하세요").model_dump(),
        judge().model_dump(),
    ]
    calls = []

    def model_reply(r):
        assert r.headers["x-goog-api-key"] == "fake"
        assert "responseMimeType" in json.loads(r.content)["generationConfig"]
        assert json.loads(r.content)["generationConfig"]["responseJsonSchema"]["type"] == "object"
        calls.append(r)
        return httpx.Response(
            200,
            json={
                "candidates": [
                    {
                        "finishReason": "STOP",
                        "content": {"parts": [{"text": json.dumps(outputs.pop(0))}]},
                    }
                ]
            },
        )

    main.nws = NWS(
        httpx.AsyncClient(
            transport=httpx.MockTransport(lambda r: httpx.Response(200, json=feature()))
        )
    )
    main.gemini = Gemini(httpx.AsyncClient(transport=httpx.MockTransport(model_reply)))
    a = client.get("/api/alerts?area=CA").json()["alerts"][0]
    body = {"text": a["text"], "alert_id": a["id"]}
    t = client.post("/api/translate", json=body)
    assert t.status_code == 200
    assert client.post("/api/translate", json=body).json() == t.json()
    v = client.post(
        "/api/verify", json={**body, "translation": t.json()["translation"]}
    )
    assert v.status_code == 200
    assert v.json()["official_fields"]["area"] == "Demo County"
    g = client.post("/api/guidance", json=body)
    assert g.status_code == 200 and g.json()["cards"][0]["category"] == "official"
    assert len(calls) == 4


def test_official_facts_take_precedence():
    a = parse(feature(), "now")[0]
    sf = facts("area", "Demo County")
    sf.facts[0].value = "Invented County"
    result = assess(a.text, "Demo County", sf, facts("area", "Demo County"), judge(), a)
    assert (
        next(f.value for f in result.source_facts if f.kind == "area") == "Demo County"
    )
    assert result.official_fields["severity"] == "Severe"


def test_minor_status_and_addition_evidence():
    j = Judgment(
        issues=[
            Issue(
                kind="recommended_action",
                severity="minor",
                source_quote=None,
                translation_quote="외출하세요",
                reason="원문에 없는 권고 추가",
            )
        ],
        unresolved=[],
    )
    v = assess(
        "Stay inside",
        "실내에 계세요. 외출하세요",
        facts(),
        facts(quote="실내에 계세요"),
        j,
    )
    assert v.status == "오류 의심"
    j.issues[0].translation_quote = "거짓 인용"
    assert (
        assess(
            "Stay inside", "실내에 계세요", facts(), facts(quote="실내에 계세요"), j
        ).status
        == "검증 불가"
    )


def test_ocr_input_rejection(client, monkeypatch):
    monkeypatch.setattr(main.shutil, "which", lambda _: "/fake/tesseract")
    assert (
        client.post(
            "/api/ocr", files={"file": ("x.pdf", b"invalid", "application/pdf")}
        ).status_code
        == 415
    )
    assert (
        client.post(
            "/api/ocr", files={"file": ("x.png", b"invalid", "image/png")}
        ).status_code
        == 422
    )


def test_cache_expiration(monkeypatch):
    import backend.core.cache as module

    clock = [1.0]
    monkeypatch.setattr(module.time, "monotonic", lambda: clock[0])
    c = Cache(ttl=10, limit=1)
    c.put("a", 1)
    c.put("b", 2)
    assert c.get("a") is None and c.get("b") == 2
    clock[0] = 12.0
    assert c.get("b") is None


def test_temperature_conversion_never_rewrites_dates_or_untyped_numbers():
    source = "Temperatures up to 14 expected on October 14."
    target = "10월 14일, 14명에게 안내. 기온 14도."
    assert add_celsius_equivalents(source, target, us_weather=True) == (
        "10월 14일, 14명에게 안내. 기온 14°F (약 -10°C)."
    )


def test_unknown_country_does_not_assume_fahrenheit():
    assert add_celsius_equivalents("Temperatures up to 35", "기온 35도") == "기온 35도"
    assert add_celsius_equivalents("気温35度", "기온 35도") == "기온 35도"


@pytest.mark.parametrize("speed", ["60 mph", "60~70 mph"])
def test_speed_conversion_is_idempotent_and_preserves_plain_numbers(speed):
    text = "10월 14일 60명. 풍속 " + speed
    first = add_celsius_equivalents(speed, text)
    assert "10월 14일 60명" in first
    assert first.count("km/h") == 1
    assert add_celsius_equivalents(speed, first) == first


def test_temperature_cue_does_not_capture_a_later_date():
    source = "Temperatures expected October 14 with strong winds."
    target = "10월 14일 강풍 예상"
    assert add_celsius_equivalents(source, target, us_weather=True) == target


def test_fallback_guidance_contains_actions_without_assuming_us():
    result = guidance("Unrecognized alert")
    assert "현재 위치" in result.cards[0].text
    assert "위험 지역" in result.cards[0].text
    assert "911" not in result.cards[0].text


@pytest.mark.parametrize("payload", [[], [{}], [{"reportDatetime": "now", "warning": {}}]])
def test_invalid_jma_payload_is_not_reported_as_no_alerts(payload):
    with pytest.raises(ValueError):
        parse_jma("130000", payload, {"class20s": {}}, "checked")


def test_jma_preserves_every_area_for_filtering_and_verification():
    areas = {"class20s": {str(n): {"name": f"地域{n}"} for n in range(6)}}
    reports = [{"reportDatetime": "2026-10-14T10:00:00+09:00", "warning": {
        "class20Items": [{"areaCode": str(n), "kinds": [{"code": "05", "status": "発表"}]} for n in range(6)]
    }}]
    alert = parse_jma("130000", reports, areas, "checked")[0]
    assert "地域5" in alert.area and "地域5" in alert.text
    assert "외 2개" in alert.headline


def test_translation_cache_separates_pasted_and_official_context(client, monkeypatch):
    a = parse(feature(), "now")[0]
    main.nws.records.put(a.id, a)
    calls = []

    async def fake_translate(text, gemini, official_instruction=None, us_weather=False):
        calls.append((official_instruction, us_weather))
        return Translation(translation="번역", hazard_explanation="설명", glossary=[], summary=[],
                           instruction_translation_ko="공식 지시 번역" if official_instruction else None)

    monkeypatch.setattr(main, "translate", fake_translate)
    pasted = client.post("/api/translate", json={"text": a.text})
    linked = client.post("/api/translate", json={"text": a.text, "alert_id": a.id})
    assert pasted.status_code == linked.status_code == 200
    assert pasted.json()["instruction_translation_ko"] is None
    assert linked.json()["instruction_translation_ko"] == "공식 지시 번역"
    assert len(calls) == 2 and calls[1][1] is True


def test_unit_repair_does_not_match_fragments_of_signed_or_decimal_numbers():
    assert add_celsius_equivalents("14°F", "-14°F, 0.14°F") == "-14°F, 0.14°F"
    assert add_celsius_equivalents("60 mph", "0.60 mph, -60 mph") == "0.60 mph, -60 mph"


def test_unit_repair_does_not_overwrite_explicit_celsius_labels():
    target = "섭씨 14도, 14°C, 14도C"
    assert add_celsius_equivalents("14°F", target) == target


def test_summary_error_is_checked_even_when_translation_is_correct():
    j = Judgment(issues=[Issue(field="summary", kind="prohibition", severity="critical",
        source_quote="Do not drive through flooded roads", translation_quote="침수 도로를 운전해도 됩니다",
        reason="금지가 허용으로 변경됨")], unresolved=[])
    v = assess("Do not drive through flooded roads", "침수 도로를 운전하지 마세요",
        facts("prohibition", "Do not drive through flooded roads"), facts("prohibition", "운전하지 마세요"),
        j, displayed={"summary": "침수 도로를 운전해도 됩니다"})
    assert v.status == "불일치 탐지"
    assert v.issues[0].field == "summary"
    assert v.checked_fields == ["translation", "summary"]


def test_issue_evidence_must_belong_to_named_display_field():
    j = Judgment(issues=[Issue(field="summary", kind="required_action", severity="critical",
        source_quote="Stay inside", translation_quote="실내에 계세요", reason="오류")], unresolved=[])
    v = assess("Stay inside", "실내에 계세요", facts(), facts(quote="실내에 계세요"), j,
        displayed={"summary": "날씨 안내"})
    assert not v.issues and v.unresolved


def test_displayed_content_is_sent_to_reviewer():
    from backend.core.extractor import extract_compare
    calls = []
    class Fake:
        async def structured(self, model, prompt, text):
            calls.append((prompt, text))
            return judge() if model is Judgment else facts()
    run(extract_compare("Stay inside", "실내에 계세요", Fake(), {"summary": "밖으로 나가세요"}))
    assert json.loads(calls[-1][1])["displayed"]["summary"] == "밖으로 나가세요"
    assert "Summary and explanation may omit details" in calls[-1][0]


def test_timezone_conversion_is_not_clock_set_error():
    v = assess("Stay inside until 6 PM PDT", "오전 10시 KST까지 실내에 계세요",
        facts(), facts(quote="실내에 계세요"), judge())
    assert not any(i.method == "rule" and i.severity == "critical" for i in v.issues)


@pytest.mark.parametrize("text,country", [("津波の心配はありません", "JP"),
    ("High Wind Warning cancelled", "US"), ("Wind chill advisory", "US"),
    ("暴風警報", "unknown")])
def test_ambiguous_or_unknown_country_does_not_pick_hazard_guide(text, country):
    result = guidance(text, country=country)
    assert all(c.title == "지금 할 일" for c in result.cards)


def test_verify_cannot_override_translation_with_displayed(client):
    response = client.post("/api/verify", json={"text": "Stay inside", "translation": "실내",
        "displayed": {"translation": "다른 번역"}})
    assert response.status_code == 422
