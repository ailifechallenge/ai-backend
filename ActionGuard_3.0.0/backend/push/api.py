import os
import re
import time
from fastapi import APIRouter,HTTPException,Header,Query
from backend.adapters.seismic import timestamp
from backend.push.store import Store
from backend.push.models import Registration,Update
from backend.push.providers import configured
from backend.push.worker import mode,db_path

router=APIRouter(prefix='/api/push',tags=['push'])
_store=None

def store():
    global _store
    if mode()=='disabled':raise HTTPException(503,'서버 알림 연결은 아직 비활성화되어 있습니다.')
    if _store is None or _store.path!=db_path():_store=Store(db_path())
    return _store

def key(value):
    if not value or not re.fullmatch(r'Bearer [A-Za-z0-9_-]{32,128}',value):raise HTTPException(401,'기기 연결 인증이 필요합니다.')
    return value[7:]

@router.get('/status')
async def status():
    current=mode();last=None
    if current!='disabled':last=store().get_meta('heartbeat')
    checked=timestamp(last.get('checked_at')) if last else None
    failure=store().get_meta('worker_failure') if current!='disabled' else None
    healthy=bool(not failure and checked and 0<=time.time()-checked.timestamp()<=180 and last.get('mode')==current)
    return {'mode':current,'provider_configured':configured(),'registration_available':current!='disabled',
            'worker_recent':healthy,'worker_checked_at':last.get('checked_at') if last else None,
            'delivery_confirmed':False,'countries':['US','JP'],'hazards':['earthquake','tsunami','weather'],'weather_health':store().get_meta('weather_health') if current!='disabled' else None}

@router.post('/devices')
async def register(body:Registration):
    await validate_regions(body.preferences)
    return store().register(body.enrollment_code,body.provider,body.token,body.preferences.model_dump())

@router.post('/devices/{device_id}/update')
async def update(device_id:str,body:Update,authorization:str|None=Header(default=None)):
    s=store();auth=key(authorization)
    with s.db() as db:s.authenticate(db,device_id,auth)
    await validate_regions(body.preferences)
    if body.token:
        with s.db() as db:r=s.authenticate(db,device_id,auth)
        if r['provider']=='apns' and not re.fullmatch(r'[A-Fa-f0-9]{64,256}',body.token):raise HTTPException(422,'APNs 기기 토큰 형식이 올바르지 않습니다.')
    return s.update(device_id,auth,body.token,body.preferences.model_dump())

@router.post('/devices/{device_id}/revoke')
async def revoke(device_id:str,authorization:str|None=Header(default=None)):
    return store().revoke(device_id,key(authorization))

@router.get('/devices/{device_id}/status')
async def device_status(device_id:str,authorization:str|None=Header(default=None)):
    return store().report(device_id,key(authorization))


from backend.push.weather import Weather,HAZARDS
weather=Weather()

async def validate_regions(preferences):
    try:
        for scope in preferences.weather_regions:
            country,region,area=scope.split(':')
            choices=await weather.areas(country,region)
            if area not in {r['code'] for r in choices['areas']}:raise ValueError('Invalid selected area')
    except Exception:
        raise HTTPException(422,'공식 지역 목록에서 구역을 다시 선택하세요. 조회 실패 시 잠시 후 다시 시도하세요.') from None

@router.get('/regions')
async def regions(country:str=Query(...,pattern='^(US|JP)$'),region:str=Query(...,pattern='^(?:[A-Z]{2}|[0-9]{6})$')):
    try:return await weather.areas(country,region)
    except Exception:raise HTTPException(502,'공식 지역 목록을 가져오지 못했습니다. 지역을 확인하고 다시 시도하세요.') from None

@router.get('/hazards')
async def hazards():return {'hazards':[{'code':k,'name':v} for k,v in HAZARDS.items()]}

@router.get('/weather')
async def current_weather(scope:str=Query(...,pattern='^(?:US:[A-Z]{2}:[A-Z]{2}[CZ][0-9]{3}|JP:[0-9]{6}:[0-9]{7})$')):
    try:
        snap=await weather.snapshot(scope)
        return {**snap,'scope':scope}
    except Exception:raise HTTPException(502,'최신 공식 경보를 확인하지 못했습니다. 해제로 판단하지 말고 다시 조회하세요.') from None
