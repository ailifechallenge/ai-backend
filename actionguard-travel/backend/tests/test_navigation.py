import asyncio,json
import httpx,pytest
from fastapi import HTTPException
from pydantic import ValidationError
from backend.adapters.navigation import Navigation,NavigationInput,coordinates
from backend.adapters.walking import Walking
from backend.models.shelters import Origin,WalkingRoute
from backend.tests.test_shelters import route_payload,CHECKED
class FakeWalking:
 async def route(self,start,end,mode='WALK'):
  return WalkingRoute(shelter_id=end.id,origin=start,distance_m=1000,duration_s=600,coordinates=[[start.lon,start.lat],[end.lon,end.lat]],steps=[],checked_at=CHECKED)
@pytest.mark.parametrize('points',[('40.758,-73.9855','40.7527,-73.9772'),('35.6812,139.7671','35.685,139.77')])
@pytest.mark.parametrize('mode',['WALK','DRIVE'])
def test_keyless_routing_in_both_countries(points,mode,monkeypatch):
 monkeypatch.setenv('GOOGLE_MAPS_API_KEY','must-not-be-used')
 r=asyncio.run(Navigation(FakeWalking()).route(NavigationInput(origin=points[0],destination=points[1],mode=mode)))
 assert r['provider']=='osrm' and r['mode']==mode and not r['api_key_required'] and not r['traffic_verified']
 assert 'google' not in json.dumps(r).lower()
@pytest.mark.parametrize('value',['Tokyo Station','nan,139','91,139','35,999','37,127',','])
def test_bad_or_unsupported_coordinates(value):
 with pytest.raises(HTTPException):coordinates(value)
def test_no_cross_country_route():
 with pytest.raises(HTTPException):asyncio.run(Navigation(FakeWalking()).route(NavigationInput(origin='40.758,-73.9855',destination='35.68,139.76')))
def test_old_google_key_parameters_are_rejected():
 with pytest.raises(ValidationError):NavigationInput(origin='35,139',destination='35.01,139',google_api_key='do-not-send')
def test_car_uses_car_profile_not_foot():
 async def run():
  async def handler(req):
   assert '/routed-car/' in str(req.url)
   return httpx.Response(200,json=route_payload())
  async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
   return await Navigation(Walking(client)).route(NavigationInput(origin='40.758,-73.9855',destination='40.75,-73.98',mode='DRIVE'))
 # Fixture route endpoints belong to a different origin; the snap guard must reject.
 with pytest.raises(HTTPException):asyncio.run(run())

def test_no_car_connection_is_not_reported_as_service_failure():
 async def run():
  async def handler(req):return httpx.Response(400,json={'code':'NoRoute','message':'Impossible route between points'})
  async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
   return await Navigation(Walking(client)).route(NavigationInput(origin='35.6812,139.7671',destination='35.685,139.77',mode='DRIVE'))
 with pytest.raises(HTTPException) as exc:asyncio.run(run())
 assert exc.value.status_code==404
 assert '이동 수단' in exc.value.detail

def test_route_retains_valid_step_geometry_for_progress():
 from backend.adapters.walking import parse
 from types import SimpleNamespace
 payload=route_payload()
 coords=payload['routes'][0]['geometry']['coordinates']
 payload['routes'][0]['legs']=[{'steps':[{'distance':10,'maneuver':{'type':'depart'},'geometry':{'coordinates':coords}}]}]
 route=parse(payload,Origin(lat=coords[0][1],lon=coords[0][0]),SimpleNamespace(id='test',lat=coords[-1][1],lon=coords[-1][0]))
 assert route.steps[0].coordinates==coords
 payload['routes'][0]['legs'][0]['steps'][0]['geometry']['coordinates']=[[float('nan'),35],[139,35]]
 with pytest.raises(ValueError):parse(payload,route.origin,SimpleNamespace(id='test',lat=coords[-1][1],lon=coords[-1][0]))
