import asyncio
import copy
import json
from datetime import datetime,timezone,timedelta
import httpx
import pytest
from pydantic import ValidationError
from backend.push.models import Preferences
from backend.push.store import Store
from backend.push.weather import Weather,WeatherChanges
from backend.push.worker import Worker
from backend.tests.test_push import Feed,Delivery,device,run

def now(offset=0):return (datetime.now(timezone.utc)+timedelta(seconds=offset)).isoformat()
PREF={'prefectures':[],'tsunami_regions':[],'seismic_hazards':[], 'weather_regions':['US:CA:CAZ522'],'weather_hazards':['wind']}
def row(**kwargs):
 return {'id':'https://api.weather.gov/alerts/urn:oid:1','event':'Wind Advisory','area':'Test area','hazard':'wind','level':[1,2],'severity':'Moderate','status':'active','sent':now(),'expires':now(3600),'ends':now(1800),'instruction':'Stay inside.',**kwargs}
class WeatherFeed:
 def __init__(self):self.rows={'a':row()};self.fail=False;self.country='US';self.reported=now()
 async def snapshot(self,scope):
  if self.fail:raise ValueError('failure')
  return {'checked_at':now(),'rows':copy.deepcopy(self.rows),'country':self.country,**({'reported_at':self.reported} if self.country=='JP' else {})}
@pytest.fixture
def store(tmp_path):return Store(tmp_path/'push.sqlite3')
def test_preferences_require_region_and_type_and_validate_region_shape():
 assert Preferences(**PREF).weather_regions==['US:CA:CAZ522']
 for changes in [{'weather_hazards':[]},{'weather_regions':['US:NY:CAZ522']},{'weather_regions':['JP:130000:../../x']},{'weather_hazards':['made-up']},{'weather_regions':[]}, {'weather_regions':['US:XX:XXZ001']}]:
  with pytest.raises(ValidationError):Preferences(**{**PREF,**changes})
 with pytest.raises(ValidationError):Preferences(prefectures=['13'],seismic_hazards=[])

def test_new_escalation_material_change_clear_no_timestamp_spam(store):
 d=device(store,prefs=PREF);f=WeatherFeed();w=Worker(store,Feed(),Delivery(),'dry_run',f)
 assert run(w)['previewed']==1
 f.rows['a']['sent']=now(1);assert run(w)['previewed']==0
 f.rows['a'].update(event='High Wind Warning',level=[3,3],severity='Severe');assert run(w)['previewed']==1
 f.rows['a']['ends']=now(7200);assert run(w)['previewed']==1
 f.rows['a']['instruction']='Avoid travel.';assert run(w)['previewed']==1
 f.rows['a']['status']='cleared';assert run(w)['previewed']==1
 assert run(w)['previewed']==0
 with store.db() as db:changes=[json.loads(r['payload'])['data']['change'] for r in db.execute('SELECT payload FROM delivery ORDER BY rowid')]
 assert changes==['current','escalated','changed','changed','cleared']
 assert store.report(d['device_id'],d['management_key'])['counts']['previewed']==5

def test_type_mismatch_and_other_region_do_not_send(store):
 device(store,prefs={**PREF,'weather_hazards':['heat']});f=WeatherFeed()
 assert run(Worker(store,Feed(),Delivery(),'dry_run',f))['previewed']==0

def test_missing_nws_record_is_not_clear_and_expiry_is_distinct(store):
 device(store,prefs=PREF);f=WeatherFeed();w=Worker(store,Feed(),Delivery(),'dry_run',f);run(w)
 f.rows={};assert run(w)['previewed']==0
 with store.db() as db:r=db.execute("SELECT key,value FROM meta WHERE key LIKE '%weather:US:%'").fetchone()
 old=json.loads(r['value']);old['rows']['a']['expires']=now(-1);store.set_meta(r['key'],old)
 assert run(w)['previewed']==1
 with store.db() as db:last=json.loads(db.execute('SELECT payload FROM delivery ORDER BY rowid DESC LIMIT 1').fetchone()['payload'])
 assert last['data']['change']=='expired'
 assert run(w)['previewed']==0

def test_jp_city_complete_snapshot_can_clear_and_reject_rollback(store):
 prefs={**PREF,'weather_regions':['JP:130000:1310100']};device(store,prefs=prefs);f=WeatherFeed();f.country='JP';w=Worker(store,Feed(),Delivery(),'dry_run',f);run(w)
 f.rows={};f.reported=now(-100);assert run(w)['previewed']==0
 assert store.get_meta('weather_health')['failed_regions']==1
 f.reported=now();assert run(w)['previewed']==1
 assert run(w)['previewed']==0

def test_failed_weather_source_preserves_baseline_and_retries_queue_without_send(store):
 device(store,prefs=PREF);f=WeatherFeed();sender=Delivery();w=Worker(store,Feed(),sender,'live',f)
 sender.outcome=__import__('backend.push.providers',fromlist=['Outcome']).Outcome('retry','temporary')
 assert run(w)['pending']==1
 with store.db() as db:db.execute("UPDATE delivery SET due=0")
 f.fail=True;assert run(w)['pending']==1 and len(sender.calls)==1
 f.fail=False
 with store.db() as db:db.execute("UPDATE delivery SET due=0")
 sender.outcome=__import__('backend.push.providers',fromlist=['Outcome']).Outcome('accepted','ok')
 assert run(w)['accepted']==1

def test_subscription_change_cancels_old_jobs_and_filters_new_types(store):
 d=device(store,prefs=PREF);f=WeatherFeed();sender=Delivery(__import__('backend.push.providers',fromlist=['Outcome']).Outcome('retry','temporary'));w=Worker(store,Feed(),sender,'live',f);run(w)
 store.update(d['device_id'],d['management_key'],None,{**PREF,'weather_hazards':['heat']})
 assert run(w)['accepted']==0 and len(sender.calls)==1

def feature(identifier='1',**kwargs):
 return {'id':'https://api.weather.gov/alerts/urn:oid:'+identifier,'properties':{'id':'urn:oid:'+identifier,'status':'Actual','messageType':'Alert','sent':now(),'expires':now(3600),'event':'Wind Advisory','severity':'Moderate','geocode':{'UGC':['CAZ522']},**kwargs}}
def test_nws_parser_links_urn_references_and_skips_training_other_zones():
 a=feature();b=feature('2',messageType='Update',references=[{'identifier':'urn:oid:1'}],event='High Wind Warning');c=feature('3',status='Test');d=feature('4',geocode={'UGC':['NYZ001']})
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json={'features':[a,b,c,d]}))) as client:return await Weather(client).us('CAZ522')
 rows=asyncio.run(call())['rows'];assert len(rows)==1;assert next(iter(rows.values()))['event']=='High Wind Warning'

def test_nws_pagination_scope_change_is_rejected():
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json={'features':[],'pagination':{'next':'https://evil.test/alerts?zone=CAZ522'}}))) as client:return await Weather(client).us('CAZ522')
 with pytest.raises(ValueError):asyncio.run(call())

def test_jp_unknown_city_or_status_cannot_be_clear():
 data=[{'reportDatetime':now(),'warning':{'class20Items':[{'areaCode':'1310100','kinds':[{'status':'謎','code':'15'}]}]}}]
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json=data))) as client:return await Weather(client).jp('130000','1310100')
 with pytest.raises(ValueError):asyncio.run(call())

def test_jma_danger_to_emergency_is_an_escalation():
 async def call(code):
  data=[{'infoType':'発表','reportDatetime':now(),'warning':{'class20Items':[{'areaCode':'1310100','kinds':[{'status':'発表','code':code}]}]}}]
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json=data))) as client:return await Weather(client).jp('130000','1310100')
 danger=asyncio.run(call('43'))['rows']['rain'];emergency=asyncio.run(call('33'))['rows']['rain']
 assert emergency['level']>danger['level']

def test_region_catalog_filters_japanese_cities_to_office():
 data={'offices':{'130000':{},'140000':{}},'class10s':{'130010':{'parent':'130000'},'140010':{'parent':'140000'}},'class15s':{'130011':{'parent':'130010'},'140011':{'parent':'140010'}},'class20s':{'1310100':{'parent':'130011','name':'千代田区'},'1410000':{'parent':'140011','name':'横浜市'}}}
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json=data))) as client:return await Weather(client).areas('JP','130000')
 assert [r['code'] for r in asyncio.run(call())['areas']]==['1310100']

def test_missing_selected_city_fails_instead_of_all_clear():
 data=[{'infoType':'発表','reportDatetime':now(),'warning':{'class20Items':[{'areaCode':'1410000','kinds':[{'status':'発表警報・注意報はなし'}]}]}}]
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json=data))) as client:return await Weather(client).jp('130000','1310100')
 with pytest.raises(ValueError,match='Selected city'):asyncio.run(call())

def test_official_array_encoded_pagination_retains_zone_filter():
 calls=[]
 def handler(request):
  calls.append(request)
  if len(calls)==1:return httpx.Response(200,json={'features':[feature('1')],'pagination':{'next':'https://api.weather.gov/alerts?zone%5B0%5D=CAZ522&limit=500&cursor=abc'}})
  assert request.url.params['zone']=='CAZ522' and request.url.params['cursor']=='abc'
  return httpx.Response(200,json={'features':[feature('2',references=[{'identifier':'urn:oid:1'}],messageType='Cancel')]})
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:return await Weather(client).us('CAZ522')
 assert next(iter(asyncio.run(call())['rows'].values()))['status']=='cleared'

def test_jma_duplicate_codes_at_distinct_hierarchy_levels_do_not_recurse():
 data={'offices':{'130000':{}},'class10s':{'130010':{'parent':'130000'}},'class15s':{'130010':{'parent':'130010'}},'class20s':{'1310100':{'parent':'130010','name':'千代田区'}}}
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,json=data))) as client:return await Weather(client).areas('JP','130000')
 assert len(asyncio.run(call())['areas'])==1

def test_tsunami_expiration_is_not_announced_as_official_clear(store):
 from backend.tests.test_push import tsunami
 d=device(store);f=Feed();f.bulletin=tsunami();w=Worker(store,f,Delivery(),'dry_run');run(w)
 f.bulletin={**f.bulletin,'valid_until':now(-1),'current':False};assert run(w)['previewed']==1
 with store.db() as db:last=json.loads(db.execute('SELECT payload FROM delivery ORDER BY rowid DESC LIMIT 1').fetchone()['payload'])
 assert last['data']['change']=='expired' and '해제' not in last['title']
