"""F4 tests use fictional shelters, never presented as live records."""
import asyncio
import httpx
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend.main import app
import backend.main as main
from backend.adapters.shelters import Shelters, distance_bearing, parse, parse_nyc, LAYER, NYC_SOURCE
from backend.adapters.walking import Walking, parse as parse_route
from backend.models.shelters import Origin

ORIGIN = Origin(lat=38.9, lon=-77.04)
CHECKED = '2026-10-14T00:00:00+00:00'


def feature(sid=1, lon=-77.03, lat=38.9, status='OPEN', **extra):
    return {'attributes': {'shelter_id':sid,'shelter_name':f'FICTIONAL shelter {sid}','shelter_status_code':status,'address_1':'Test street','city':'Test city','facility_type':'School',**extra}, 'geometry':{'x':lon,'y':lat}}


def test_distance_and_compass():
    d, angle, cardinal = distance_bearing(0,0,0,1)
    assert d == pytest.approx(111195.1, abs=1)
    assert angle == 90 and cardinal == '동'
    assert distance_bearing(0,179.99,0,-179.99)[0] < 2300
    assert distance_bearing(1,1,1,1)[0] == 0


def test_status_radius_dedup_and_ranking():
    rows = [feature(2,lon=-77.02),feature(),feature(),feature(3,status='CLOSED'),feature(4,status=''),feature(5,lat=0,lon=0),feature(6,lat=40),feature(7,lon=float('nan')),feature(8,shelter_closed_date=123),feature(9,wheelchair_accessible='YES')]
    result = parse({'features':rows}, ORIGIN, 10, CHECKED)
    assert [s.id for s in result] == ['1','9','2']
    assert result[0].source == LAYER and result[0].source_updated_at is None
    assert result[1].wheelchair_accessible == '가능(출처 표기)'
    assert all(s.status == 'open' for s in result)


def test_empty_and_invalid_response_are_different():
    assert parse({'features':[]},ORIGIN,10,CHECKED) == []
    with pytest.raises(ValueError): parse({'error':{}},ORIGIN,10,CHECKED)


def test_official_facility_types_are_deterministic():
    result = parse({'features':[
        feature(1, facility_type='School Gym'),
        feature(2, facility_type='Tornado Safe Room'),
        feature(3, facility_type='Community Center'),
        feature(4, facility_type='Public shelter')
    ]}, ORIGIN, 10, CHECKED)
    assert {s.name: s.shelter_type for s in result} == {'FICTIONAL shelter 1':'school','FICTIONAL shelter 2':'safe_room','FICTIONAL shelter 3':'community','FICTIONAL shelter 4':'other'}
    assert next(s for s in result if s.name.endswith('1')).type_label == '학교·교육시설'


def test_nyc_intake_centers_are_not_reported_as_open_shelters():
    payload = {'features':[{'type':'Feature','properties':{'bldg_name':'FICTIONAL NYC School','bldg_add':'1 Test Rd','city':'New York','state':'NY','zip_code':'10001','accessible':'Y','bin':'1234567'},'geometry':{'type':'Point','coordinates':[-73.98,40.75]}}]}
    rows = parse_nyc(payload, Origin(lat=40.75,lon=-73.99), 10, CHECKED)
    assert len(rows) == 1 and rows[0].status == 'planned'
    assert rows[0].shelter_type == 'school' and rows[0].role_label == '허리케인 대피 접수센터'
    assert rows[0].source == NYC_SOURCE and '현장 개방 확인' in rows[0].status_label


def test_nyc_feed_only_used_for_hurricane_searches():
    calls=[]
    async def handler(request):
        calls.append(request.url.host)
        if request.url.host == 'data.cityofnewyork.us':
            return httpx.Response(200,json={'type':'FeatureCollection','features':[]})
        return httpx.Response(200,json={'features':[]})
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:
            s=Shelters(c)
            normal=await s.search(40.75,-73.99,10,'tornado')
            assert normal.disaster == 'tornado' and NYC_SOURCE not in normal.sources
            nyc=await s.search(40.75,-73.99,10,'hurricane')
            assert nyc.disaster == 'hurricane' and NYC_SOURCE in nyc.sources
    asyncio.run(run())
    assert calls.count('data.cityofnewyork.us') == 1


def test_query_pagination_cache_and_expiration():
    calls = []
    async def handler(request):
        calls.append(request)
        assert request.url.params['outSR'] == '4326'
        assert request.url.params['units'] == 'esriSRUnit_Meter'
        assert float(request.url.params['distance']) == 10000
        assert str(request.url).startswith(LAYER + '/query')
        if request.url.params['resultOffset'] == '0': return httpx.Response(200,json={'features':[feature()],'exceededTransferLimit':True})
        return httpx.Response(200,json={'features':[feature(2,lon=-77.02)]})
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:
            s=Shelters(c); a=await s.search(38.9,-77.04,10); b=await s.search(38.9,-77.04,10)
            assert a == b and len(a.shelters) == 2
            assert s.linked('1').id == '1'
            s.records.items.clear()
            with pytest.raises(HTTPException) as e: s.linked('1')
            assert e.value.status_code == 409
    asyncio.run(run()); assert len(calls) == 2


@pytest.mark.parametrize('kind,status',[('timeout',504),('error',502),('arcgis',502),('invalid',502)])
def test_provider_failures(kind,status):
    async def handler(request):
        if kind == 'timeout': raise httpx.ReadTimeout('test')
        if kind == 'error': return httpx.Response(503)
        if kind == 'arcgis': return httpx.Response(200,json={'error':{'code':500}})
        return httpx.Response(200,json={'foo':[]})
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:
            with pytest.raises(HTTPException) as e: await Shelters(c).search(38.9,-77.04,10)
            assert e.value.status_code == status
    asyncio.run(run())


def route_payload():
    return {'code':'Ok','routes':[{'distance':1000,'duration':720,'geometry':{'coordinates':[[-77.04,38.9],[-77.035,38.901],[-77.03,38.9]]},'legs':[{'steps':[{'distance':500,'name':'Test road','maneuver':{'type':'depart'}},{'distance':500,'name':'Test road','maneuver':{'type':'turn','modifier':'left'}},{'distance':0,'maneuver':{'type':'arrive'}}]}]}]}


def test_foot_profile_and_cache():
    calls=[]
    async def handler(request):
        calls.append(request)
        assert request.url.host == 'routing.openstreetmap.de' and '/routed-foot/' in request.url.path
        assert request.url.params['radiuses'] == '250;250'
        return httpx.Response(200,json=route_payload())
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:
            w=Walking(c); s=parse({'features':[feature()]},ORIGIN,10,CHECKED)[0]
            a=await w.route(ORIGIN,s); b=await w.route(ORIGIN,s)
            assert a == b and a.distance_m == 1000
            assert a.steps[1].instruction == '왼쪽으로 · Test road'
            assert '통제' in a.note
    asyncio.run(run()); assert len(calls) == 1


@pytest.mark.parametrize('payload',[{'code':'NoRoute'},{'code':'NoSegment'}])
def test_no_route(payload):
    s=parse({'features':[feature()]},ORIGIN,10,CHECKED)[0]
    with pytest.raises(HTTPException) as e: parse_route(payload,ORIGIN,s)
    assert e.value.status_code == 404


def test_far_snap_rejected():
    p=route_payload(); p['routes'][0]['geometry']['coordinates'][-1]=[-76,39]
    s=parse({'features':[feature()]},ORIGIN,10,CHECKED)[0]
    with pytest.raises(HTTPException) as e: parse_route(p,ORIGIN,s)
    assert e.value.status_code == 422


def test_api_validation_and_unknown_shelter(monkeypatch):
    monkeypatch.setattr(main,'shelters',Shelters()); client=TestClient(app)
    for query in ['', '?lat=nan&lon=0','?lat=91&lon=0','?lat=0&lon=0&radius_km=51']:
        assert client.get('/api/shelters'+query).status_code == 422
    assert client.post('/api/shelters/route',json={'lat':38.9,'lon':-77.04,'shelter_id':'invented'}).status_code == 409


def test_search_to_selected_route_integration(monkeypatch):
    async def sh(request): return httpx.Response(200,json={'features':[feature()]})
    async def rh(request): return httpx.Response(200,json=route_payload())
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(sh)) as sc, httpx.AsyncClient(transport=httpx.MockTransport(rh)) as rc:
            monkeypatch.setattr(main,'shelters',Shelters(sc)); monkeypatch.setattr(main,'walking',Walking(rc))
            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),base_url='http://test') as client:
                r=await client.get('/api/shelters?lat=38.9&lon=-77.04&radius_km=10')
                assert r.status_code == 200 and r.json()['shelters'][0]['id'] == '1'
                r=await client.post('/api/shelters/route',json={'lat':38.9,'lon':-77.04,'shelter_id':'1'})
                assert r.status_code == 200 and r.json()['distance_m'] == 1000
    asyncio.run(run())


def test_screenshot_latitude_typo_returns_actionable_error_before_network():
    calls=[]
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(lambda req: calls.append(req))) as c:
            with pytest.raises(HTTPException) as e:
                await Shelters(c).search(4.758,-73.9855,50,'hurricane')
            assert e.value.status_code == 422 and '40.7580' in e.value.detail
    asyncio.run(run())
    assert not calls
