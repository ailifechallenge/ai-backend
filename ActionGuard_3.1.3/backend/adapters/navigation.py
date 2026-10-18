"""Keyless OSM routing for explicitly chosen US/JP coordinates."""
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict
from fastapi import HTTPException
from types import SimpleNamespace
from backend.models.shelters import Origin
from backend.adapters.shelters import in_us_coverage
from backend.adapters.japan_shelters import in_japan
from backend.adapters.walking import Walking

class NavigationInput(BaseModel):
    model_config=ConfigDict(extra='forbid')
    origin: str = Field(min_length=1,max_length=240)
    destination: str = Field(min_length=1,max_length=240)
    mode: Literal['WALK','DRIVE']='WALK'

def coordinates(value):
    try:
        parts=value.strip().split(',')
        if len(parts)!=2 or not all(p.strip() for p in parts):raise ValueError()
        p=Origin(lat=float(parts[0]),lon=float(parts[1]))
        if not (in_us_coverage(p) or in_japan(p)):raise ValueError()
        return p
    except (ValueError,TypeError):
        raise HTTPException(422,'미국·일본 지도에서 위치를 선택하거나 올바른 위도, 경도를 입력하십시오.') from None

class Navigation:
    def __init__(self,walking=None,client=None):
        self.walking=walking or Walking(client)
    async def route(self,body):
        start,end=coordinates(body.origin),coordinates(body.destination)
        if in_japan(start)!=in_japan(end):raise HTTPException(422,'출발지와 도착지는 같은 국가 안에서 선택하십시오.')
        route=await self.walking.route(start,SimpleNamespace(id='navigation',lat=end.lat,lon=end.lon),mode=body.mode)
        return {'provider':'osrm','mode':body.mode,'route':route.model_dump(),
                'destination':{'lat':end.lat,'lon':end.lon},
                'traffic_verified':False,'warnings':['일반 도로 경로입니다. 재난·침수·통제·현장 안전과 실시간 교통은 반영하지 않습니다.'],
                'api_key_required':False}
