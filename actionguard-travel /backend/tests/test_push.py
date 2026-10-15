import asyncio
from datetime import datetime,timezone,timedelta
from types import SimpleNamespace
import json
import httpx
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend.main import app
from backend.push.store import Store
from backend.push.worker import Worker
from backend.push.providers import Outcome,Sender

PREF={'prefectures':['13'],'tsunami_regions':['320'],'minimum_intensity':'3'}
def now():return datetime.now(timezone.utc).isoformat()
def device(store,provider='fcm',prefs=None,token='test-device-token-12345'):
 return store.register(store.enrollment(provider),provider,token,prefs or PREF)
@pytest.fixture
def store(tmp_path):return Store(tmp_path/'private'/'push.sqlite3')
class Feed:
 def __init__(self):self.events=[];self.cancelled=[];self.bulletin=None;self.fail=False
 async def earthquakes(self):
  if self.fail:raise RuntimeError('private upstream failure')
  return {'events':self.events,'cancelled_events':self.cancelled,'checked_at':now()}
 async def tsunami(self):return {'bulletin':self.bulletin,'checked_at':now()}
class Delivery:
 def __init__(self,outcome=None):self.calls=[];self.outcome=outcome or Outcome('accepted','provider_accepted')
 async def send(self,item):self.calls.append(item);return self.outcome

def quake(suffix='1',pref='13',level='4'):
 return {'id':f'20261015141311_20261015141019_VXSE5k_{suffix}.json','event_id':'20261015141019','issued_at':now(),'observations':[{'prefecture_code':pref,'intensity':level}]}
def tsunami(level='warning',code='320',suffix='1'):
 return {'id':f'20261015141311_20261015141019_VTSE41_{suffix}.json','issued_at':now(),'current':True,'cancelled':False,'valid_until':None,'regions':[{'code':code,'level':level,'height':'3'}]}
def run(worker):return asyncio.run(worker.run_once())

def test_one_use_expiring_provider_bound_enrollment(store):
 c=store.enrollment('fcm')
 with pytest.raises(HTTPException):store.register(c,'apns','a'*64,PREF)
 r=store.register(c,'fcm','token'*10,PREF)
 with pytest.raises(HTTPException):store.register(c,'fcm','other'*10,PREF)
 expired=store.enrollment('fcm',ttl=-1)
 with pytest.raises(HTTPException):store.register(expired,'fcm','third'*10,PREF)
 assert r['management_key'] not in store.path

def test_unauthorized_update_or_revocation_cannot_manage_another_device(store):
 a=device(store);b=device(store,token='different-device-token')
 with pytest.raises(HTTPException):store.revoke(a['device_id'],b['management_key'])
 assert len(store.devices())==2
 store.update(a['device_id'],a['management_key'],None,PREF)
 store.revoke(a['device_id'],a['management_key']);assert len(store.devices())==1

def test_duplicate_token_does_not_consume_valid_enrollment(store):
 device(store);c=store.enrollment('fcm')
 with pytest.raises(HTTPException):store.register(c,'fcm','test-device-token-12345',PREF)
 assert store.register(c,'fcm','another-device-token-12345',PREF)

def test_baseline_does_not_replay_old_quakes_and_dry_run_never_sends(store):
 d=device(store);f=Feed();f.events=[quake()];sender=Delivery();w=Worker(store,f,sender,'dry_run')
 assert run(w)['previewed']==0
 f.events=[quake('2')];assert run(w)['previewed']==1
 assert run(w)['previewed']==0 and sender.calls==[]
 assert store.report(d['device_id'],d['management_key'])['counts']=={'previewed':1}

def test_region_intensity_not_global_max_and_missing_not_zero(store):
 device(store);f=Feed();w=Worker(store,f,Delivery(),'dry_run');run(w)
 for event in [quake('1','12','7'),quake('2','13','2'),{**quake('3'),'observations':[]}]:
  f.events=[event];assert run(w)['previewed']==0
 f.events=[quake('4','13','3')];assert run(w)['previewed']==1

def test_old_newly_seen_quake_not_replayed(store):
 device(store);f=Feed();w=Worker(store,f,Delivery(),'dry_run');run(w)
 f.events=[{**quake(),'issued_at':(datetime.now(timezone.utc)-timedelta(hours=2)).isoformat()}]
 assert run(w)['previewed']==0

def test_current_warning_once_and_unrelated_coast_update_is_not_spam(store):
 device(store);f=Feed();f.bulletin=tsunami();w=Worker(store,f,Delivery(),'dry_run')
 assert run(w)['previewed']==1
 f.bulletin={**tsunami(suffix='2'),'regions':tsunami()['regions']+[{'code':'100','level':'major','height':'10'}]}
 assert run(w)['previewed']==0
 f.bulletin=tsunami('advisory',suffix='3');assert run(w)['previewed']==1
 f.bulletin=None;assert run(w)['previewed']==1
 assert run(w)['previewed']==0

def test_forecast_only_is_not_a_warning_and_provider_disabled_is_no_work(store):
 device(store);f=Feed();f.bulletin=tsunami('forecast');sender=Delivery()
 assert run(Worker(store,f,sender,'disabled'))['status']=='disabled'
 assert run(Worker(store,f,sender,'dry_run'))['previewed']==0
 assert sender.calls==[]

def test_live_after_preview_can_send_current_tsunami_without_replaying_quakes(store):
 device(store);f=Feed();f.bulletin=tsunami();f.events=[quake()]
 run(Worker(store,f,Delivery(),'dry_run'));sender=Delivery()
 assert run(Worker(store,f,sender,'live'))['accepted']==1
 assert len(sender.calls)==1

def test_failed_source_does_not_advance_baseline_or_send(store):
 device(store);f=Feed();sender=Delivery();w=Worker(store,f,sender,'live');run(w)
 old=store.get_meta('quake_seen');f.events=[quake()];f.fail=True
 with pytest.raises(RuntimeError):run(w)
 assert store.get_meta('quake_seen')==old and sender.calls==[]

def test_retry_has_backoff_and_cancelled_source_not_retried(store):
 d=device(store);f=Feed();sender=Delivery(Outcome('retry','temporary'));w=Worker(store,f,sender,'live');run(w)
 f.events=[quake()];assert run(w)['pending']==1
 assert run(w)['pending']==0 and len(sender.calls)==1
 with store.db() as db:db.execute('UPDATE delivery SET due=0')
 f.events=[];assert run(w)['cancelled']==1 and len(sender.calls)==1

def test_lease_exclusive_and_old_owner_cannot_overwrite(store):
 d=device(store);store.enqueue(d['device_id'],'x',{},__import__('time').time()+600)
 a=store.claim();assert a and store.claim() is None
 with store.db() as db:db.execute('UPDATE delivery SET lease=0')
 b=store.claim();store.finish(a,'accepted','stale_owner')
 with store.db() as db:assert db.execute('SELECT state FROM delivery').fetchone()[0]=='processing'
 store.finish(b,'accepted','provider_accepted')

def test_expiry_invalid_device_and_unsubscribe_cancel_jobs(store):
 d=device(store);store.enqueue(d['device_id'],'expired',{},0);assert store.claim() is None
 f=Feed();f.bulletin=tsunami();w=Worker(store,f,Delivery(Outcome('invalid','invalid_device')),'live');run(w)
 assert store.devices()==[]

@pytest.mark.parametrize('operation',['update','revoke'])
def test_pending_jobs_stop_on_preference_change_or_unsubscribe(store,operation):
 d=device(store);store.enqueue(d['device_id'],'x',{},__import__('time').time()+600)
 if operation=='update':store.update(d['device_id'],d['management_key'],None,{**PREF,'prefectures':['12']})
 else:store.revoke(d['device_id'],d['management_key'])
 assert store.claim() is None

def test_api_disabled_by_default_and_validation_does_not_echo_tokens(monkeypatch,tmp_path):
 monkeypatch.setenv('PUSH_MODE','disabled');monkeypatch.setenv('PUSH_DATABASE',str(tmp_path/'api.sqlite3'))
 c=TestClient(app)
 assert c.get('/api/push/status').json()['mode']=='disabled'
 bad=c.post('/api/push/devices',json={'token':'PRIVATE-DEVICE-TOKEN'})
 assert bad.status_code==422 and 'PRIVATE-DEVICE-TOKEN' not in bad.text
 valid={'enrollment_code':'x'*32,'provider':'fcm','token':'test-token-long-enough','preferences':PREF}
 assert c.post('/api/push/devices',json=valid).status_code==503

def test_api_scoped_registration_and_status(monkeypatch,tmp_path):
 path=tmp_path/'api.sqlite3';monkeypatch.setenv('PUSH_DATABASE',str(path));monkeypatch.setenv('PUSH_MODE','dry_run')
 local=Store(path);code=local.enrollment('fcm');c=TestClient(app)
 r=c.post('/api/push/devices',json={'enrollment_code':code,'provider':'fcm','token':'test-token-long-enough','preferences':PREF});assert r.status_code==200
 d=r.json();url='/api/push/devices/'+d['device_id']
 assert c.get(url+'/status').status_code==401
 assert c.get(url+'/status',headers={'Authorization':'Bearer '+d['management_key']}).json()=={'counts':{}}
 assert c.post(url+'/revoke',headers={'Authorization':'Bearer '+d['management_key']}).status_code==200
 assert c.get(url+'/status',headers={'Authorization':'Bearer '+d['management_key']}).status_code==401

@pytest.mark.parametrize('provider,status,body,expected',[
 ('fcm',200,{'name':'projects/test/messages/id'},'accepted'),
 ('fcm',404,{'error':{'details':[{'@type':'type.googleapis.com/google.firebase.fcm.v1.FcmError','errorCode':'UNREGISTERED'}]}},'invalid'),
 ('fcm',404,{'error':{'status':'NOT_FOUND'}},'failed'),
 ('apns',410,{'reason':'Unregistered'},'invalid'),('apns',400,{'reason':'BadDeviceToken'},'failed'),('apns',429,{},'retry'),('apns',200,{},'accepted')])
def test_provider_responses_are_acceptance_not_delivery(monkeypatch,provider,status,body,expected):
 for k in ['PUSH_FCM_PROJECT_ID','PUSH_FCM_SERVICE_ACCOUNT_FILE','PUSH_APNS_TEAM_ID','PUSH_APNS_KEY_ID','PUSH_APNS_TOPIC','PUSH_APNS_KEY_FILE']:monkeypatch.setenv(k,'test')
 async def call():
  async with httpx.AsyncClient(transport=httpx.MockTransport(lambda req:httpx.Response(status,json=body,headers={'Retry-After':'120'}))) as client:
   sender=Sender(client)
   async def auth(_):return 'fake-test-credential'
   sender.authorization=auth
   return await sender.send({'provider':provider,'payload':{'title':'test','body':'test','data':{'kind':'tsunami','issued_at':now()}},'token':'a'*64,'expires':__import__('time').time()+600,'id':'a'*64})
 result=asyncio.run(call());assert result.state==expected
 if expected=='retry':assert result.retry_after==120

def test_overlapping_workers_do_not_compare_different_snapshots(store):
 owner=store.start_run();assert owner
 f=Feed();sender=Delivery();assert run(Worker(store,f,sender,'live'))['status']=='worker_busy'
 assert not store.renew_run('wrong-owner')
 store.end_run('wrong-owner');assert store.start_run() is None
 store.end_run(owner);assert run(Worker(store,f,sender,'dry_run'))['status']=='dry_run'

def test_worker_releases_lock_on_source_failure(store):
 f=Feed();f.fail=True;w=Worker(store,f,Delivery(),'dry_run')
 with pytest.raises(RuntimeError):run(w)
 f.fail=False;assert run(w)['status']=='dry_run'

def test_expired_tsunami_is_not_sent_and_new_subscriber_gets_current_not_history(store):
 f=Feed();f.bulletin=tsunami();f.bulletin['valid_until']=(datetime.now(timezone.utc)-timedelta(seconds=1)).isoformat()
 device(store);assert run(Worker(store,f,Delivery(),'dry_run'))['previewed']==0
 f.bulletin=tsunami();w=Worker(store,f,Delivery(),'dry_run');assert run(w)['previewed']==1
 device(store,token='another-device-token');assert run(w)['previewed']==1

def test_retry_limit_and_expired_snapshot(store):
 device(store);f=Feed();sender=Delivery(Outcome('retry','temporary'));w=Worker(store,f,sender,'live');run(w)
 f.events=[quake()];assert run(w)['pending']==1
 for attempt in range(4):
  with store.db() as db:db.execute('UPDATE delivery SET due=0')
  result=run(w)
 assert result['failed']==1 and len(sender.calls)==5

@pytest.mark.parametrize('prefs',[{**PREF,'prefectures':['99']},{**PREF,'tsunami_regions':['999']},{'prefectures':[],'tsunami_regions':[]}])
def test_invalid_regions_rejected_without_echoing_registration_secret(monkeypatch,tmp_path,prefs):
 monkeypatch.setenv('PUSH_MODE','dry_run');monkeypatch.setenv('PUSH_DATABASE',str(tmp_path/'api.sqlite3'))
 r=TestClient(app).post('/api/push/devices',json={'enrollment_code':'SECRET-DO-NOT-ECHO-ENROLLMENT','provider':'fcm','token':'PRIVATE-DEVICE-TOKEN-SECRET','preferences':prefs})
 assert r.status_code==422 and 'SECRET' not in r.text


def test_delivered_quake_correction_below_threshold_and_cancellation_are_forwarded(store):
 device(store);f=Feed();sender=Delivery();w=Worker(store,f,sender,'live');run(w)
 f.events=[quake()];assert run(w)['accepted']==1
 f.events=[quake('2',level='1')];assert run(w)['accepted']==1
 assert '갱신' in sender.calls[-1]['payload']['body']
 f.events=[];f.cancelled=[{**quake('3'),'cancelled':True}];assert run(w)['accepted']==1
 assert '취소' in sender.calls[-1]['payload']['title']
 assert run(w)['accepted']==0

def test_changing_regions_stops_correction_alerts_for_previous_region(store):
 d=device(store);f=Feed();w=Worker(store,f,Delivery(),'live');run(w);f.events=[quake()];run(w)
 store.update(d['device_id'],d['management_key'],None,{**PREF,'prefectures':['12']})
 f.events=[quake('2',level='1')];assert run(w)['accepted']==0

def test_token_rotation_does_not_cancel_valid_pending_work(store):
 d=device(store);store.enqueue(d['device_id'],'x',{},__import__('time').time()+600)
 store.update(d['device_id'],d['management_key'],'new-device-token-long-enough',PREF)
 item=store.claim();assert item and item['token']=='new-device-token-long-enough'

def test_recent_success_is_not_reported_healthy_after_a_source_failure(monkeypatch,tmp_path):
 path=tmp_path/'api.sqlite3';monkeypatch.setenv('PUSH_DATABASE',str(path));monkeypatch.setenv('PUSH_MODE','dry_run')
 s=Store(path);f=Feed();w=Worker(s,f,Delivery(),'dry_run');run(w);c=TestClient(app)
 assert c.get('/api/push/status').json()['worker_recent'] is True
 f.fail=True
 with pytest.raises(RuntimeError):run(w)
 assert c.get('/api/push/status').json()['worker_recent'] is False
 f.fail=False;run(w);assert c.get('/api/push/status').json()['worker_recent'] is True
