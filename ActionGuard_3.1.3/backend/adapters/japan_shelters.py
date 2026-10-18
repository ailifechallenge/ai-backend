"""GSI designated places, not live-open shelters. Fetch only nearby z10 tiles."""
import asyncio
import hashlib
import math
import re
import httpx
from fastapi import HTTPException
from backend.core.cache import Cache
from backend.models.shelters import Origin, Shelter, ShelterSearch
from backend.adapters.shelters import distance_bearing, now

SOURCE='https://www.gsi.go.jp/bousaichiri/hinanbasho.html'
TILES='https://cyberjapandata.gsi.go.jp/xyz'
HAZARDS={'flood':1,'landslide':2,'storm_surge':3,'earthquake':4,'tsunami':5,'fire':6,'inland_flood':7,'volcano':8}
LABELS={1:'홍수',2:'산사태',3:'폭풍해일',4:'지진',5:'쓰나미',6:'대규모 화재',7:'내수 범람',8:'화산'}

def in_japan(p):
    # Approximate data coverage, not a determination of national boundaries.
    return any(a<=p.lat<=b and c<=p.lon<=d for a,b,c,d in [(30,46,128,146),(23.5,30.5,122.5,132),(20,30,136,154)])

def tile_xy(lat,lon):
    return int((lon+180)/360*1024),int((1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*1024)

def nearby_tiles(origin,radius):
    dy=radius/110.5;dx=radius/(110.5*math.cos(math.radians(origin.lat+dy)))
    left,bottom=tile_xy(origin.lat-dy,origin.lon-dx);right,top=tile_xy(origin.lat+dy,origin.lon+dx)
    return [(x,y) for x in range(left,right+1) for y in range(top,bottom+1)]

def parse_tile(payload,origin,radius,layer,hazard,stamp):
    if not isinstance(payload,dict) or payload.get('type')!='FeatureCollection' or not isinstance(payload.get('features'),list):
        raise ValueError('GSI schema')
    rows=[]
    for feature in payload['features']:
        try:
            p=feature['properties'];g=feature['geometry']
            if g['type']!='Point':continue
            lon,lat=g['coordinates'][:2];loc=Origin(lat=lat,lon=lon)
            if not in_japan(loc):continue
            d,b,direction=distance_bearing(origin.lat,origin.lon,lat,lon)
            name=str(p.get('name') or '').strip();address=str(p.get('address') or '')
            if not name or d>radius*1000:continue
            emergency=layer.startswith('skhb')
            if emergency and str(p.get(f'disaster{HAZARDS[hazard]}',''))!='1':continue
            hazards=[LABELS[n] for n in LABELS if str(p.get(f'disaster{n}',''))=='1']
            remarks=str(p.get('remarks') or '')
            closed=bool(re.search(r'閉鎖|廃止|使用不可|利用不可|休止',name+' '+remarks))
            identity=f'{layer}|{name}|{address}|{lat}|{lon}'
            rows.append(Shelter(id='gsi:'+hashlib.sha256(identity.encode()).hexdigest()[:24],name=name,address=address,lat=lat,lon=lon,
                country='JP',status='registered' if closed else 'planned',navigable=not closed,
                status_label='폐쇄·사용 제한 표기 · 목적지 제외' if closed else '지정 시설 · 현재 개방 미확인',
                operating_status='RESTRICTED' if closed else 'UNKNOWN',
                shelter_type='evacuation_center' if emergency else 'community',
                type_label='긴급대피장소' if emergency else '일반 피난소',
                role_label='재난 위험을 피하는 지정 장소' if emergency else '일시 체류를 위한 지정 피난소',
                facility_kind='emergency_place' if emergency else 'shelter',supported_hazards=hazards,
                hazard_compatibility='designated' if emergency else 'unknown',remarks=remarks,
                distance_m=d,bearing_deg=b,direction=direction,source=SOURCE,checked_at=stamp,
                wheelchair_accessible='확인되지 않음',pets='확인되지 않음'))
        except (ValueError,TypeError,KeyError,IndexError,AttributeError):continue
    return rows

class JapanShelters:
    def __init__(self,client=None):
        self.client=client;self.tiles=Cache(ttl=300,limit=96);self.results=Cache(ttl=120,limit=32);self.lock=asyncio.Lock()
    async def search(self,lat,lon,radius_km,disaster='general',include_registered=False):
        origin=Origin(lat=lat,lon=lon)
        if not in_japan(origin) or not .5<=radius_km<=10:raise HTTPException(422,'일본 좌표와 0.5~10km 검색 반경을 선택하십시오.')
        if disaster not in {'general',*HAZARDS}:raise HTTPException(422,'일본 자료에서 지원하는 재난 유형을 선택하십시오.')
        key=(lat,lon,radius_km,disaster,include_registered)
        async with self.lock:
            if (cached:=self.results.get(key)) is not None:return cached
            layers=['sih'] if disaster=='general' else [f'skhb{HAZARDS[disaster]:02d}']
            # Specific-hazard search excludes shelters with unknown hazard suitability.
            jobs=[(layer,x,y) for layer in layers for x,y in nearby_tiles(origin,radius_km)]
            if len(jobs)>16:raise HTTPException(422,'검색 반경을 줄여 주십시오.')
            sem=asyncio.Semaphore(3);stamp=now()
            async def fetch(client,job):
                if (cached:=self.tiles.get(job)) is not None:return cached
                layer,x,y=job
                async with sem:
                    r=await client.get(f'{TILES}/{layer}/10/{x}/{y}.geojson',headers={'User-Agent':'ActionGuardTravel/2.7 (nearby official evacuation data)'})
                    if r.status_code==404:return self.tiles.put(job,{'type':'FeatureCollection','features':[]})
                    r.raise_for_status();data=r.json()
                    if not isinstance(data,dict) or data.get('type')!='FeatureCollection' or not isinstance(data.get('features'),list):raise ValueError('GSI schema')
                    return self.tiles.put(job,data)
            async def collect(client):
                return await asyncio.gather(*(fetch(client,j) for j in jobs),return_exceptions=True)
            if self.client:payloads=await collect(self.client)
            else:
                async with httpx.AsyncClient(timeout=20) as client:payloads=await collect(client)
            failed=0;rows={}
            for job,data in zip(jobs,payloads):
                if isinstance(data,Exception):failed+=1;continue
                for row in parse_tile(data,origin,radius_km,job[0],disaster,stamp):
                    if include_registered or row.status!='registered':rows[row.id]=row
            if failed==len(jobs):raise HTTPException(502,'일본 국토지리원 시설 자료를 가져오지 못했습니다. 잠시 후 다시 조회하십시오.')
            warnings=([f'주변 자료 {len(jobs)}개 구역 중 {failed}개를 읽지 못했습니다. 목록이 불완전할 수 있습니다.'] if failed else [])
            if not rows:warnings.append('이 반경에서 자료를 찾지 못했습니다. 시설이 없다는 뜻이 아니며, 미등재·미갱신 가능성이 있습니다.')
            result=ShelterSearch(country='JP',origin=origin,radius_km=radius_km,disaster=disaster,shelters=sorted(rows.values(),key=lambda r:(r.distance_m,r.id)),checked_at=stamp,source=SOURCE,sources=[SOURCE],warnings=warnings,
                note='출처: 일본 국토지리원(GSI)·시정촌. 긴급대피장소는 재난별 지정 장소이고, 일반 피난소는 일시 체류 시설입니다. 일반 피난소의 재난별 적합 여부는 미확인입니다. 자료는 수시 변경되며 현재 개방·최신 상태는 해당 시정촌에 확인하십시오. 거리 순은 안전 순위가 아닙니다.')
            return self.results.put(key,result)
