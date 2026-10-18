import asyncio
from datetime import datetime,timezone,timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock
import httpx,pytest
from fastapi import FastAPI,HTTPException
from fastapi.testclient import TestClient
from backend.api.places import Places,create_router
from backend.models.contracts import ChatLocation,Alert,Alerts

def run(value):return asyncio.run(value)
def alert(**changes):
    data=dict(id='https://api.weather.gov/alerts/test',event='Flood Warning',headline='Flood',area='Example County',severity='Severe',sender='NWS',sent=None,effective=None,expires=None,instruction='Avoid flooded roads.',source='https://www.weather.gov/',text='Flood Warning',checked_at=datetime.now(timezone.utc).isoformat())
    return Alert(**{**data,**changes})

def test_place_timezone_uses_nws_not_an_assumed_coast():
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json={'properties':{'timeZone':'America/Detroit'}}))) as c:
            return await Places(c).metadata(ChatLocation(country='US',lat=42.3,lon=-83.0))
    assert run(call())['timezone']=='America/Detroit'

def test_timezone_failure_does_not_guess_los_angeles():
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(503))) as c:
            return await Places(c).metadata(ChatLocation(country='US',lat=40.7,lon=-74))
    result=run(call());assert result['timezone'] is None and result['warning']

def test_japan_timezone_needs_no_model_or_network():
    service=Places();assert run(service.metadata(ChatLocation(country='JP',lat=35.68,lon=139.76)))['timezone']=='Asia/Tokyo'

def test_wrong_country_coordinate_is_rejected():
    with pytest.raises(HTTPException):run(Places().metadata(ChatLocation(country='US',lat=35.68,lon=139.76)))

def test_broad_state_requires_a_city():
    with pytest.raises(HTTPException) as exc:run(Places().search('캘리포니아','US'))
    assert exc.value.status_code==422

def make_app(rows,linked=None,scope='JP:130000:1310100'):
    nws=SimpleNamespace(alerts=AsyncMock(return_value=Alerts(alerts=rows,checked_at=datetime.now(timezone.utc).isoformat())))
    jma=SimpleNamespace(alerts=AsyncMock(return_value=Alerts(alerts=rows,checked_at=datetime.now(timezone.utc).isoformat())),_get=AsyncMock(return_value={'class20s':{'1310100':{'name':'千代田区'}}}))
    local=SimpleNamespace(japan_scope=AsyncMock(return_value=scope));app=FastAPI();app.include_router(create_router(nws,jma,local,lambda body:linked))
    return TestClient(app)

def test_nearby_only_returns_current_actual_messages():
    now=datetime.now(timezone.utc)
    rows=[alert(),alert(id='expired',expires=(now-timedelta(hours=1)).isoformat()),alert(id='cancel',message_type='Cancel'),alert(id='test',status='Test')]
    with make_app(rows) as client:r=client.post('/api/places/alerts',json={'country':'US','lat':40.7,'lon':-74})
    assert r.status_code==200 and len(r.json()['alerts'])==1

def test_japan_nearby_excludes_other_municipalities():
    with make_app([alert(id='jma:130000:04:x',area='千代田区'),alert(id='jma:130000:03:x',area='新宿区')]) as client:
        r=client.post('/api/places/alerts',json={'country':'JP','lat':35.68,'lon':139.76})
    assert [a['area'] for a in r.json()['alerts']]==['千代田区']

def test_nearby_failure_is_not_reported_as_no_alerts():
    with make_app([]) as client:
        # Unsupported location is a failure, never a successful empty result.
        r=client.post('/api/places/alerts',json={'country':'JP','lat':0,'lon':0})
    assert r.status_code==422

def test_unlinked_paste_never_claims_location_applicability():
    with make_app([]) as client:r=client.post('/api/places/applicability',json={'text':'Evacuate','country':'US','location':{'country':'US','lat':40.7,'lon':-74}})
    assert r.json()['state']=='unknown'

def test_unlisted_alert_without_a_polygon_is_unknown_not_outside():
    a=alert()
    with make_app([],a) as client:r=client.post('/api/places/applicability',json={'text':a.text,'alert_id':a.id,'country':'US','location':{'country':'US','lat':40.7,'lon':-74}})
    assert r.json()['state']=='unknown'

def test_stale_alert_must_be_refreshed_before_checking_location():
    a=alert(checked_at=(datetime.now(timezone.utc)-timedelta(minutes=5)).isoformat())
    with make_app([a],a) as client:r=client.post('/api/places/applicability',json={'text':a.text,'alert_id':a.id,'country':'US','location':{'country':'US','lat':40.7,'lon':-74}})
    assert r.json()['state']=='unknown' and '오래' in r.json()['detail']


def test_english_new_york_is_a_city_query():
    service=Places();service.searcher.search=AsyncMock(return_value=[])
    run(service.search('New York','US'))
    assert service.searcher.search.call_args.args[0].query=='New York City'

def test_timezone_rounds_point_and_follows_nws_redirect():
    def respond(request):
        assert request.url.path=='/points/40.7143,-74.0060'
        return httpx.Response(200,json={'properties':{'timeZone':'America/New_York'}})
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as c:
            return await Places(c).metadata(ChatLocation(country='US',lat=40.71427,lon=-74.00597))
    assert run(call())['timezone']=='America/New_York'


def test_place_metadata_includes_the_verified_guam_territory_name():
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json={'properties':{'timeZone':'Pacific/Guam','relativeLocation':{'properties':{'state':'GU'}}}}))) as c:
            return await Places(c).metadata(ChatLocation(country='US',lat=13.46,lon=144.74))
    result=run(call());assert result['region_code']=='GU' and result['region_name']=='괌'


def test_address_fallback_uses_second_index_and_rejects_unrelated_hotel_matches():
    requests=[]
    def respond(req):
        requests.append(req)
        if 'open-meteo' in req.url.host:return httpx.Response(200,json={})
        if 'photon' in req.url.host:
            assert req.url.params['countrycode']=='US'
            return httpx.Response(200,json={'features':[{'geometry':{'coordinates':[-74,40.7]},'properties':{'name':'Midtown Pharmacy','countrycode':'US'}}]})
        assert req.url.params['countrycodes']=='us'
        return httpx.Response(200,json=[])
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as c:return await Places(c).search('Arlo Midtown','US')
    assert run(call())['candidates']==[]
    assert len(requests)==3

def test_address_fallback_returns_verified_point_with_a_readable_address():
    def respond(req):
        if 'nominatim' not in req.url.host:return httpx.Response(200,json={'features':[]})
        return httpx.Response(200,json=[{'lat':'40.7557','lon':'-73.9938','display_name':'351 West 38th Street, New York','addresstype':'house','address':{'country_code':'us'}}])
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as c:return await Places(c).search('351 West 38th Street, New York','US')
    rows=run(call())['candidates'];assert rows[0]['label']=='351 West 38th Street, New York';assert rows[0]['location']['lat']==40.7557

def test_verified_hotel_name_resolves_its_published_address_without_user_retyping():
    requests=[]
    def respond(req):
        requests.append(req)
        assert '351 West 38th Street' in str(req.url.params.get('q') or req.url.params.get('name'))
        if 'open-meteo' in req.url.host:return httpx.Response(200,json={})
        return httpx.Response(200,json={'features':[{'geometry':{'coordinates':[-73.9938593,40.7557635]},'properties':{'housenumber':'351','street':'West 38th Street','city':'New York','countrycode':'US','type':'house'}}]})
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as c:return await Places(c).search('Arlo Midtown','US')
    rows=run(call())['candidates'];assert rows[0]['label'].startswith('Arlo Midtown · 351 West 38th Street');assert rows[0]['source']=='https://arlohotels.com/about/contact-us/';assert not rows[0]['approximate']

def test_verified_hotel_does_not_use_a_city_or_wrong_building_as_the_hotel():
    def respond(req):
        if 'open-meteo' in req.url.host:return httpx.Response(200,json={})
        if 'nominatim' in req.url.host:return httpx.Response(200,json=[])
        return httpx.Response(200,json={'features':[{'geometry':{'coordinates':[-74,40.7]},'properties':{'name':'New York','countrycode':'US','type':'city'}}]})
    async def call():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as c:return await Places(c).search('Arlo Midtown','US')
    assert run(call())['candidates']==[]
