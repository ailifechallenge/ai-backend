"""User-initiated place lookup and official point checks; never model coordinates."""
import asyncio
from datetime import datetime, timezone
from pathlib import Path
import json
from zoneinfo import ZoneInfo
import httpx
from fastapi import APIRouter, HTTPException, Query
from backend.adapters.assistant_places import AssistantPlaces, ALIASES, STATE_ALIASES, broad_region
from backend.adapters.shelters import in_us_coverage
from backend.adapters.japan_shelters import in_japan
from backend.core.cache import Cache
from backend.core.conflict import polygon_contains
from backend.models.contracts import ChatLocation, ChatPlaceQuery, Input, Alerts

US_REGIONS = {row['code']:row for row in json.loads((Path(__file__).resolve().parents[2]/'data/us-states-ko.json').read_text())}
US_ZONES = frozenset(json.loads((Path(__file__).resolve().parents[2]/'data/us-timezones.json').read_text()))

def validate_location(p):
    if not (in_japan(p) if p.country=='JP' else in_us_coverage(p)):
        raise HTTPException(422,'선택한 국가 안의 위치를 확인해 주십시오.')

def active_alert(a):
    if a.message_type=='Cancel' or a.status not in (None,'Actual'):return False
    now=datetime.now(timezone.utc)
    for raw in (a.expires,a.ends):
        if raw:
            try:
                when=datetime.fromisoformat(raw.replace('Z','+00:00'))
                if when.tzinfo is None or when<=now:return False
            except ValueError:return False
    return True

class PlaceChecks(Input):
    location: ChatLocation

class Places:
    def __init__(self,client=None):
        self.searcher=AssistantPlaces(None,client);self.client=client;self.metadata_cache=Cache(ttl=86400,limit=256)
    async def search(self,q,country):
        normalized=next((name for alias,name,c in ALIASES+STATE_ALIASES if c==country and alias.casefold()==q.casefold()),q)
        request=ChatPlaceQuery(mention=q,query=normalized,country=country)
        if broad_region(request):raise HTTPException(422,'주 전체 대신 도시나 숙소 이름을 입력해 주십시오.')
        rows=await self.searcher.search(request)
        return {'candidates':[r.model_dump() for r in rows],'note':'도시 대표점과 실제 숙소는 다를 수 있습니다. 지도를 확인한 뒤 등록하십시오.'}
    async def metadata(self,p):
        validate_location(p)
        if p.country=='JP':return {'timezone':'Asia/Tokyo','source':'일본 표준시','warning':None}
        key=(p.country,round(p.lat,5),round(p.lon,5));hit=self.metadata_cache.get(key)
        if hit:return hit
        url=f'https://api.weather.gov/points/{p.lat:.4f},{p.lon:.4f}'
        try:
            if self.client:r=await self.client.get(url,follow_redirects=True,headers={'User-Agent':'ActionGuardTravel/3.0 (place timezone lookup)'})
            else:
                async with httpx.AsyncClient(timeout=12) as client:r=await client.get(url,follow_redirects=True,headers={'User-Agent':'ActionGuardTravel/3.0 (place timezone lookup)'})
            r.raise_for_status();props=r.json()['properties'];zone=props['timeZone']
            state=((props.get('relativeLocation') or {}).get('properties') or {}).get('state')
            region=US_REGIONS.get(state)
            if zone not in US_ZONES:raise ValueError('Unsupported zone')
            ZoneInfo(zone)
            return self.metadata_cache.put(key,{'timezone':zone,'source':'NWS 좌표 정보','warning':None,'region_code':state if region else None,'region_name':region['ko_name'] if region else None})
        except (httpx.HTTPError,KeyError,TypeError,ValueError):
            return {'timezone':None,'source':None,'warning':'시간대를 자동 확인하지 못했습니다. 일정 등록 시 현지 시간대를 직접 선택해 주십시오.'}

def create_router(nws,jma,local,linked):
    router=APIRouter(prefix='/api/places',tags=['places']);service=Places()
    @router.get('/search')
    async def search(q:str=Query(min_length=2,max_length=120),country:str=Query(pattern='^(US|JP)$')):
        if not q.strip():raise HTTPException(422,'도시나 숙소 이름을 입력하십시오.')
        return await service.search(q.strip(),country)
    @router.post('/metadata')
    async def metadata(p:ChatLocation):return await service.metadata(p)
    @router.post('/alerts',response_model=Alerts)
    async def nearby(p:ChatLocation):
        validate_location(p)
        if p.country=='US':data=await nws.alerts({'point':f'{p.lat},{p.lon}','status':'actual'})
        else:
            try:
                scope=await asyncio.wait_for(local.japan_scope(p),timeout=15)
                _,office,city=scope.split(':')
                areas=await jma._get('https://www.jma.go.jp/bosai/common/const/area.json')
                city_name=areas['class20s'][city]['name']
                found=await jma.alerts(office)
                data=Alerts(alerts=[a for a in found.alerts if city_name in a.area.split('、')],checked_at=found.checked_at)
            except HTTPException:raise
            except (httpx.HTTPError,asyncio.TimeoutError,KeyError,TypeError,ValueError):
                raise HTTPException(502,'이 위치의 일본 기상 경보 구역을 확인하지 못했습니다. 공식 경보 찾기에서 관할 지역을 선택해 주십시오.') from None
        levels={'Extreme':0,'Severe':1,'Moderate':2,'Minor':3,'Unknown':4}
        return Alerts(alerts=sorted((a for a in data.alerts if active_alert(a)),key=lambda a:(levels.get(a.severity,4),a.event)),checked_at=data.checked_at)
    @router.post('/push-regions')
    async def push_regions(p:ChatLocation):
        validate_location(p)
        try:
            if p.country=='JP':
                scope=await local.japan_scope(p);_,office,city=scope.split(':')
                data=await jma._get('https://www.jma.go.jp/bosai/common/const/area.json')
                return {'regions':[{'scope':scope,'name':data['class20s'][city]['name']}],'prefectures':[city[:2]],'country':'JP'}
            async with httpx.AsyncClient(timeout=15) as client:
                r=await client.get(f'https://api.weather.gov/points/{p.lat:.4f},{p.lon:.4f}',headers={'User-Agent':'ActionGuardTravel/3.1'},follow_redirects=True)
            r.raise_for_status();props=r.json()['properties'];regions=[]
            import re
            for name in ('forecastZone','county'):
                value=props.get(name,'');m=re.fullmatch(r'https://api\.weather\.gov/zones/(?:forecast|county)/([A-Z]{2}[CZ][0-9]{3})',value)
                if m:
                    zone=m[1];regions.append({'scope':f'US:{zone[:2]}:{zone}','name':zone})
            if not regions:raise ValueError('No official regions')
            return {'regions':regions,'prefectures':[],'country':'US'}
        except HTTPException:raise
        except (httpx.HTTPError,ValueError,KeyError,TypeError):raise HTTPException(502,'등록 위치의 공식 구역을 확인하지 못했습니다. 관심 지역에서 직접 선택해 주십시오.') from None

    @router.post('/applicability')
    async def applicability(body:PlaceChecks):
        validate_location(body.location);a=linked(body)
        base={'state':'unknown','label':'위치 적용 여부 미확인','detail':'공식 경보와 현재 조회 위치의 적용 범위를 확인하지 못했습니다.','checked_at':datetime.now(timezone.utc).isoformat()}
        if not a:return {**base,'detail':'직접 입력한 문자만으로 적용 범위를 확정하지 않습니다. 공식 경보를 연결하십시오.'}
        if ('JP' if a.id.startswith('jma:') else 'US')!=body.location.country:return {**base,'state':'outside','label':'등록 위치와 경보 국가가 다릅니다','detail':'이 결과는 다른 경보의 부재나 안전을 의미하지 않습니다.'}
        checked=datetime.fromisoformat(a.checked_at.replace('Z','+00:00'))
        if checked.tzinfo is None or not -30<=(datetime.now(timezone.utc)-checked).total_seconds()<=180:return {**base,'detail':'공식 경보 조회가 오래되었습니다. 최신 상태를 다시 조회하십시오.'}
        if not active_alert(a):return {**base,'detail':'경보 메시지가 만료되었거나 비활성 상태입니다. 최신 경보를 다시 조회하십시오.'}
        if body.location.country=='US':
            inside=polygon_contains(a.geometry,body.location.lat,body.location.lon)
            if inside is None:
                fresh=await nws.alerts({'point':f'{body.location.lat},{body.location.lon}','status':'actual'})
                inside=True if any(row.id==a.id and active_alert(row) for row in fresh.alerts) else None
        else:
            scope=await local.japan_scope(body.location);_,office,city=scope.split(':')
            areas=await jma._get('https://www.jma.go.jp/bosai/common/const/area.json')
            inside=office==a.id.split(':')[1] and areas['class20s'][city]['name'] in a.area.split('、')
        if inside is None:return base
        return {**base,'state':'inside' if inside else 'outside','label':'등록 위치가 경보 지역에 포함됩니다' if inside else '등록 위치는 이 경보 지역 밖입니다','detail':'등록한 한 지점에 대한 확인입니다. 이동 경로·숙소 일정 전체나 안전을 판정한 것은 아닙니다.','source':a.source}
    return router
