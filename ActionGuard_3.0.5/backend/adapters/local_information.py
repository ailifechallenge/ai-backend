"""Official local lookups. Coordinates never go to the language model."""
import re
from datetime import datetime, timezone
import httpx
from fastapi import HTTPException
from backend.core.cache import Cache
from backend.adapters.shelters import in_us_coverage
from backend.adapters.japan_shelters import in_japan
from backend.models.shelters import Origin
from backend.adapters.seismic import timestamp


class LocalInformation:
    def __init__(self, nws, jma, weather, us_shelters, jp_shelters, client=None):
        self.nws=nws;self.jma=jma;self.weather=weather
        self.us_shelters=us_shelters;self.jp_shelters=jp_shelters
        self.client=client;self.city_cache=Cache(ttl=600,limit=128)

    def validate(self, location):
        point=Origin(lat=location.lat,lon=location.lon)
        if not (in_japan(point) if location.country=='JP' else in_us_coverage(point)):
            raise HTTPException(422,'선택한 국가 안의 위치를 지도에서 확인해 주세요. 현재는 미국·일본 자료를 지원해요.')

    async def japan_scope(self, location):
        self.validate(location)
        key=(location.lat,location.lon)
        hit=self.city_cache.get(key)
        if hit:return hit
        url='https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress'
        params={'lat':location.lat,'lon':location.lon}
        if self.client:r=await self.client.get(url,params=params)
        else:
            async with httpx.AsyncClient(timeout=15) as client:r=await client.get(url,params=params)
        r.raise_for_status()
        code=str((r.json().get('results') or {}).get('muniCd',''))
        if not re.fullmatch(r'\d{5}',code):raise ValueError('Municipality unavailable')
        areas=await self.jma._get('https://www.jma.go.jp/bosai/common/const/area.json')
        candidates=[(k,v) for k,v in areas['class20s'].items() if k.startswith(code)]
        # Some municipalities have multiple warning areas; do not guess a subdivision.
        if len(candidates)!=1:raise HTTPException(422,'이 위치는 기상 경보 구역을 하나로 정할 수 없어요. 알림에서 시·구·정·촌 구역을 선택해 주세요.')
        city,meta=candidates[0]
        class15=areas['class15s'][meta['parent']]
        office=areas['class10s'][class15['parent']]['parent']
        if office not in areas['offices']:raise ValueError('Unknown office')
        return self.city_cache.put(key,f'JP:{office}:{city}')

    async def alerts(self, location=None, scope=None):
        if scope:
            snapshot=await self.weather.snapshot(scope)
            rows=[dict(row) for row in snapshot['rows'].values()]
            if scope.startswith('JP:'):
                try:
                    originals=await self.jma.alerts(scope.split(':')[1])
                    for row in rows:
                        found=next((a for a in originals.alerts if row['event'] in a.event and snapshot['area_name'] in a.area.split('、')),None)
                        if found and len(found.text)<=16000:row['official_alert']=found.model_dump()
                except (HTTPException,httpx.HTTPError,ValueError,KeyError):
                    pass
            stamp=snapshot['checked_at'];label=snapshot['area_name'];country=snapshot['country']
        elif location:
            self.validate(location)
            if location.country=='JP':
                resolved=await self.japan_scope(location)
                return await self.alerts(scope=resolved)
            result=await self.nws.alerts({'point':f'{location.lat},{location.lon}','status':'actual'})
            rows=[{**a.model_dump(),'status':'active' if (a.status or 'Actual')=='Actual' and (a.message_type or 'Alert')!='Cancel' else 'inactive'} for a in result.alerts]
            stamp=result.checked_at;label='등록한 좌표에 대한 NWS 조회';country='US'
        else:raise HTTPException(422,'경보를 조회할 위치나 지역이 필요해요.')
        checked=timestamp(stamp)
        if checked is None or not -30 <= (datetime.now(timezone.utc)-checked).total_seconds() <= 180:raise ValueError('Stale lookup timestamp')
        current=[];now=datetime.now(timezone.utc)
        for row in rows:
            if row.get('status')!='active':continue
            expires=timestamp(row.get('expires'))
            ends=timestamp(row.get('ends'))
            if row.get('expires') and expires is None:raise ValueError('Invalid expiry')
            if (expires and expires<=now) or (ends and ends<=now):continue
            current.append(row)
        return {'rows':current,'checked_at':stamp,'label':label,'country':country,'scope':scope}

    async def shelters(self, location, disaster='general'):
        self.validate(location)
        adapter=self.jp_shelters if location.country=='JP' else self.us_shelters
        result=await adapter.search(location.lat,location.lon,10,disaster,False)
        checked=timestamp(result.checked_at)
        if checked is None or not -30 <= (datetime.now(timezone.utc)-checked).total_seconds() <= 180:raise ValueError('Stale lookup timestamp')
        # Only actual destination candidates, never closed/restricted or review-only buildings.
        rows=sorted((s for s in result.shelters if s.navigable and s.status!='registered'),key=lambda s:s.distance_m)
        return result,rows
