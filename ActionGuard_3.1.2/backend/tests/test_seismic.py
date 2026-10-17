import asyncio
import httpx
import pytest
from fastapi import HTTPException
from backend.adapters.seismic import Seismic, coordinates, latest_rows, parse_quake, parse_tsunami, timestamp
Q='20261015141311_20261015141019_VXSE5k_1.json'
T='20261015141311_20261015141019_VTSE41_1.json'
def row(filename=Q):return dict(json=filename,eid='20261015141019',ctt='20261015141311',rdt='2026-10-15T14:13:00+09:00',ift='発表')
def tsunami(code='53'):
 return {'Control':{'Status':'通常'},'Head':{'InfoType':'発表','ReportDateTime':'2026-10-15T14:13:00+09:00','ValidDateTime':'2026-10-16T00:00:00+09:00'},'Body':{'Tsunami':{'Forecast':{'Item':[{'Area':{'Code':'100','Name':'北海道太平洋沿岸東部'},'Category':{'Kind':{'Code':code}},'MaxHeight':{'TsunamiHeight':'10'},'FirstHeight':{'ArrivalTime':'2026-10-15T15:00:00+09:00'}}]}}}}
NOW=timestamp('2026-10-15T15:00:00+09:00')
CLEAR={'w':'2026-10-14T01:00:00'}
@pytest.mark.parametrize('raw,expected', [('+35.6+140.1-70000/',{'lat':35.6,'lon':140.1,'depth_km':70}),('+07.5-080.8/',{'lat':7.5,'lon':-80.8,'depth_km':None}),('+35+140-0/',{'lat':35.,'lon':140.,'depth_km':0}),('35,140',None),('+999+140/',None),('',None)])
def test_coordinates(raw,expected):assert coordinates(raw)==expected

def test_latest_cancellation_does_not_resurrect_older_bulletin():
 old=row();new={**row(), 'ctt':'20261015150000','json':'20261015150000_20261015141019_VXSE5k_2.json','ift':'取消'}
 assert latest_rows([old,new])==[new]
 assert not latest_rows([{**old,'json':'../../file.json'},{**old,'json':'20261015141311_20261015141019_VXSE5k_K1.json'}])

@pytest.mark.parametrize('code,level',[('53','major'),('52','major'),('51','warning'),('62','advisory'),('71','forecast'),('72','forecast'),('73','forecast'),('50','cleared'),('00','none'),('99','unknown')])
def test_tsunami_codes(code,level):
 r=parse_tsunami(tsunami(code),T,CLEAR,NOW)
 assert r['current'] and r['regions'][0]['level']==level
 assert r['regions'][0]['arrival_at'].endswith('+09:00')

def test_expiry_clear_timestamp_and_cancellation():
 data=tsunami()
 assert not parse_tsunami(data,T,{'w':'2026-10-15T14:13:01'},NOW)['current']
 assert not parse_tsunami(data,T,CLEAR,timestamp('2026-10-16T00:00:00+09:00'))['current']
 data['Head']['InfoType']='取消'
 assert not parse_tsunami(data,T,CLEAR,NOW)['current']
 data['Head']['InfoType']='発表';data['Control']['Status']='訓練'
 assert not parse_tsunami(data,T,CLEAR,NOW)['current']
 with pytest.raises(ValueError):parse_tsunami(tsunami(),T,{},NOW)

def test_quake_preserves_strength_and_missing_observations():
 d={'Head':{},'Body':{'Earthquake':{'Magnitude':'6.5','Hypocenter':{'Area':{'Coordinate':'+35+139-10000/'}}},'Intensity':{'Observation':{'MaxInt':'5+','Pref':[{'Area':[{'City':[{'Name':'test','IntensityStation':[{'Code':'1','Int':'5-','latlon':{'lat':35,'lon':139}},{'Code':'2','Int':'6+','latlon':{'lat':None,'lon':139}}]}]}]}]}}}}
 r=parse_quake(d,Q);assert r['max_intensity']=='5+' and r['stations'][0]['intensity']=='5-' and len(r['stations'])==1
 assert parse_quake({'Head':{}},Q)['max_intensity'] is None
 assert parse_quake({'Head':{}},Q)['stations']==[]

async def with_adapter(handler,action):
 async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:return await action(Seismic(c))

def test_network_failure_is_not_no_alerts():
 with pytest.raises(HTTPException) as err:asyncio.run(with_adapter(lambda req:httpx.Response(503),lambda s:s.tsunami()))
 assert err.value.status_code==502

def test_missing_current_state_is_failure():
 def handler(req):return httpx.Response(200,json=[] if str(req.url).endswith('list.json') else {})
 with pytest.raises(HTTPException):asyncio.run(with_adapter(handler,lambda s:s.tsunami()))

def test_tsunami_observation_does_not_hide_warning():
 obs={**row('20261015150000_20261015141019_VTSE51_2.json'),'ctt':'20261015150000'}
 def handler(req):
  path=str(req.url)
  return httpx.Response(200,json=[row(T),obs] if path.endswith('list.json') else CLEAR if path.endswith('clearweb.json') else tsunami())
 result=asyncio.run(with_adapter(handler,lambda s:s.tsunami()))
 assert result['bulletin']['id']==T and result['bulletin']['regions'][0]['level']=='major'

def test_arbitrary_detail_path_is_not_fetched():
 requested=[]
 def handler(req):requested.append(str(req.url));return httpx.Response(200,json=[row()])
 with pytest.raises(HTTPException) as e:asyncio.run(with_adapter(handler,lambda s:s.earthquake('https://evil.test/file')))
 assert e.value.status_code==404 and len(requested)==1

def test_cancelled_event_not_in_list():
 def handler(req):return httpx.Response(200,json=[{**row(),'ift':'取消'}])
 r=asyncio.run(with_adapter(handler,lambda s:s.earthquakes()))
 assert r['events']==[]

def test_invalid_tsunami_validity_does_not_become_no_expiry():
 d=tsunami();d['Head']['ValidDateTime']='not-a-date'
 with pytest.raises(ValueError):parse_tsunami(d,T,CLEAR,NOW)
