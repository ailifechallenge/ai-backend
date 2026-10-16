import asyncio
import httpx,pytest
from fastapi import HTTPException
from backend.adapters.japan_shelters import JapanShelters,parse_tile,nearby_tiles
from backend.models.shelters import Origin
P=Origin(lat=35.6812,lon=139.7671)
def feature(name='テスト避難場所',**props):
 return {'type':'Feature','geometry':{'type':'Point','coordinates':[139.7671,35.6812]},'properties':{'name':name,'address':'東京都テスト区','disaster4':1,**props}}
def payload(*rows):return {'type':'FeatureCollection','features':list(rows)}
def test_hazard_specific_and_unknown_suitability_are_distinct():
 a=parse_tile(payload(feature()),P,3,'skhb04','earthquake','now')[0]
 b=parse_tile(payload(feature()),P,3,'sih','general','now')[0]
 assert a.hazard_compatibility=='designated' and a.supported_hazards==['지진']
 assert b.hazard_compatibility=='unknown' and b.facility_kind=='shelter'
 assert not parse_tile(payload(feature()),P,3,'skhb05','tsunami','now')
def test_restricted_facility_and_malformed_records():
 rows=parse_tile(payload(feature('閉鎖中 テスト'),{'properties':None,'geometry':{}},feature('普通')),P,3,'sih','general','now')
 assert len(rows)==2 and not rows[0].navigable and rows[0].status=='registered'
def test_nearby_tiles_cover_boundary_and_are_bounded():
 assert 1<=len(nearby_tiles(P,10))<=16
async def search_response(handler,**kwargs):
 async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:return await JapanShelters(c).search(P.lat,P.lon,3,**kwargs)
def test_closed_excluded_and_duplicate_tiles_collapsed():
 def handler(req):return httpx.Response(200,json=payload(feature(),feature('閉鎖中')))
 r=asyncio.run(search_response(handler,disaster='earthquake'))
 assert len(r.shelters)==1 and r.country=='JP'
 r=asyncio.run(search_response(handler,disaster='earthquake',include_registered=True))
 assert len(r.shelters)==2
@pytest.mark.parametrize('status',[500,429])
def test_total_feed_failure_is_not_empty_success(status):
 with pytest.raises(HTTPException):asyncio.run(search_response(lambda req:httpx.Response(status)))
def test_missing_tiles_are_qualified_not_no_shelters_claim():
 r=asyncio.run(search_response(lambda req:httpx.Response(404)))
 assert not r.shelters and r.warnings

def test_context_does_not_turn_no_tsunami_into_tsunami_recommendation():
 from fastapi.testclient import TestClient
 from backend.main import app
 r=TestClient(app).post('/api/journey/context',json={'text':'地震情報。この地震による津波の心配はありません。','country':'JP'})
 assert r.status_code==200 and 'earthquake' in r.json()['hazards'] and 'tsunami' not in r.json()['hazards']
