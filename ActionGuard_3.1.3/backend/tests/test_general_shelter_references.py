"""General US lookup should expose designated references without claiming operation."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock
import httpx
import pytest
from fastapi import HTTPException
from backend.adapters.shelters import Shelters, NYC_SOURCE
from backend.adapters.local_information import LocalInformation
from backend.core.app_assistant import AppAssistant
from backend.models.contracts import ChatInput
from backend.models.shelters import Shelter, ShelterSearch
from datetime import datetime, timezone

def now():return datetime.now(timezone.utc).isoformat()
def run(task):return asyncio.run(task)
class Offline:
    async def structured(self,*args):raise HTTPException(503,'offline')

NYC={'features':[{'properties':{'bldg_name':'FICTIONAL Designated Center','bin':'123','bldg_add':'1 Test Street'},'geometry':{'coordinates':[-73.98,40.75]}}]}

def test_general_search_includes_nyc_designated_reference_without_enabling_entry_route():
    async def handler(request):return httpx.Response(200,json=NYC if request.url.host=='data.cityofnewyork.us' else {'features':[]})
    async def check():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            adapter=Shelters(client)
            general=await adapter.search(40.75,-73.99,10,'general')
            reference=general.shelters[0]
            assert NYC_SOURCE in general.sources and reference.reference_only
            assert reference.status=='planned' and not reference.navigable
            assert reference.supported_hazards==['hurricane'] and reference.hazard_compatibility=='unknown'
            with pytest.raises(HTTPException):adapter.linked(reference.id)
            hurricane=await adapter.search(40.75,-73.99,10,'hurricane')
            designated=hurricane.shelters[0]
            assert not designated.reference_only and designated.navigable
            assert designated.id!=reference.id and adapter.linked(designated.id).id==designated.id
            with pytest.raises(HTTPException):adapter.linked(reference.id)
    run(check())

def test_general_references_are_not_injected_into_a_tornado_search():
    calls=[]
    async def handler(request):
        calls.append(request.url.host)
        return httpx.Response(200,json={'features':[]})
    async def check():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            await Shelters(client).search(40.75,-73.99,10,'tornado')
    run(check())
    assert 'data.cityofnewyork.us' not in calls

def reference_result(warnings=None):
    reference=Shelter(id='ref:nyc-hurricane:123',name='FICTIONAL Center',address='Test address',lat=40.75,lon=-73.98,status='planned',status_label='허리케인 지정 · 개방 미확인',reference_only=True,navigable=False,role_label='허리케인 대피 접수센터',supported_hazards=['hurricane'],distance_m=1000,bearing_deg=0,direction='동',source=NYC_SOURCE,checked_at=now())
    return ShelterSearch(origin={'lat':40.75,'lon':-73.99},radius_km=10,disaster='general',shelters=[reference],checked_at=now(),source=NYC_SOURCE,warnings=warnings or [])

def test_chat_lists_designated_reference_without_calling_it_an_open_general_shelter():
    data=reference_result();adapter=SimpleNamespace(search=AsyncMock(return_value=data))
    local=LocalInformation(None,None,None,adapter,None)
    app=AppAssistant(local,Offline(),lambda body:None,{},None)
    result=run(app.answer(ChatInput(question='가까운 대피소 알려줘',location={'name':'뉴욕','country':'US','lat':40.75,'lon':-73.99})))
    assert result.mode=='live' and result.items[0].kind=='info'
    assert 'FICTIONAL Center' in result.answer and '개방·입소 가능 여부는 미확인' in result.answer
    assert '일반 대피소라는 뜻은 아닙니다' in result.answer
    assert 'view=route' not in result.items[0].path
    assert result.items[0].source==NYC_SOURCE and '개방 미확인' in result.items[0].status

def test_partial_fema_failure_is_not_reported_as_zero_open_shelters():
    data=reference_result(['FEMA 시설 자료를 가져오지 못했습니다.'])
    app=AppAssistant(SimpleNamespace(shelters=AsyncMock(return_value=(data,[]))),Offline(),lambda body:None,{},None)
    result=run(app.answer(ChatInput(question='가까운 대피소 알려줘',location={'name':'뉴욕','country':'US','lat':40.75,'lon':-73.99})))
    assert '운영정보를 확인하지 못했습니다' in result.answer
    assert '운영 중으로 조회된 일반 대피소는 없습니다' not in result.answer
