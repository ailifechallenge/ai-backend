"""App-wide tool routing, privacy boundaries and official lookup failure cases."""
import asyncio
import json
from datetime import datetime, timezone, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock
import httpx
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend.core.app_assistant import AppAssistant, quick_plan
from backend.adapters.local_information import LocalInformation
from backend.models.contracts import ChatInput, ChatLocation, ChatRouting, ChatDraft, ChatCitation, ChatReview, ChatAction
from backend.models.shelters import Shelter, ShelterSearch
import backend.main as main


def now():return datetime.now(timezone.utc).isoformat()
def body(question,**kwargs):return ChatInput(question=question,**kwargs)
POINT={'country':'JP','lat':35.6812,'lon':139.7671,'name':'PRIVATE_HOTEL'}
class Offline:
    async def structured(self,*args):raise HTTPException(503,'offline')
def assistant(local=None,gem=None,callbacks=None):
    return AppAssistant(local,gem or Offline(),lambda b:None,callbacks or {},None)
def run(coro):return asyncio.run(coro)

@pytest.mark.parametrize('question,intents',[
 ('내 지역에 활성화된 경보가 있어?',['alerts']),
 ('가장 가까운 대피소 알려줘',['shelters']),
 ('대피소까지 가는 법 알려줘',['navigation']),
 ('현재 경보와 가까운 대피소도 찾아줘',['shelters','alerts']),
 ('내 지역 경보 확인하고 홍수 대비 방법도 알려줘',['alerts','guidance']),
 ('문자 번역해 줘: 強風注意報',['analysis']),
 ('대응 몇 단계야?',['urgency']),
 ('알림을 켜 줘',['notifications']),
 ('숙소 일정 겹쳐?',['itinerary']),
 ('일본 최근 지진 지도',['japan_disasters']),
 ('주식 추천해 줘',['scope']),
])
def test_routes(question,intents):assert quick_plan(body(question))==intents

def test_pre_alert_help_and_missing_location_no_model():
    a=assistant()
    help=run(a.answer(body('이 앱으로 뭘 할 수 있어?')))
    assert len(help.actions)>=5
    missing=run(a.answer(body('가장 가까운 대피소 알려줘')))
    assert missing.needs_location and missing.mode=='clarify'

def test_real_api_accepts_question_without_source():
    with TestClient(main.app) as client:
        r=client.post('/api/chat',json={'question':'안녕하세요'})
        assert r.status_code==200 and r.json()['actions']
        assert client.post('/api/chat',json={'question':' '}).status_code==422


def test_notification_status_does_not_claim_device_subscribed():
    status=AsyncMock(return_value={'mode':'dry_run'})
    result=run(assistant(callbacks={'notification_status':status}).answer(body('알림 켜 줘')))
    assert '모의 발송' in result.answer and '것은 아니' in result.answer
    assert result.actions[0].path=='/notifications'

def test_multiple_tools_and_failure_are_not_no_alert():
    local=SimpleNamespace(alerts=AsyncMock(side_effect=HTTPException(503,'offline')))
    result=run(assistant(local).answer(body('내 지역 현재 경보 있어?',location=POINT)))
    assert result.mode=='unavailable' and '해제됐다는 뜻은 아니' in result.answer
    mismatch=run(assistant(local).answer(body('미국 현재 경보 있어?',location=POINT)))
    assert mismatch.needs_location and local.alerts.await_count==1


def test_ai_plan_receives_no_registered_location_or_stay():
    class Router:
        async def structured(self,model,prompt,payload):
            assert model is ChatRouting
            assert 'PRIVATE_HOTEL' not in payload and '139.7671' not in payload
            return ChatRouting(intents=['app_help'])
    result=run(assistant(gem=Router()).answer(body('어떤 걸 도와줄래?',location=POINT)))
    assert result.intent=='app_help'


def test_live_results_use_actual_data_ai_gets_only_aggregates():
    local=SimpleNamespace(alerts=AsyncMock(return_value={'rows':[{'event':'Wind Advisory','area':'PRIVATE_REGION','source':'https://www.weather.gov/','status':'active'}],'checked_at':now(),'label':'PRIVATE_REGION','country':'JP','scope':'JP:130000:1310100'}))
    class Explainer:
        async def structured(self,model,prompt,payload):
            assert 'PRIVATE_REGION' not in payload and 'PRIVATE_HOTEL' not in payload and '139.7671' not in payload
            if model is ChatReview:return ChatReview(supported=True,reason='supported')
            return ChatDraft(answer='기상경보 1건을 확인했어요.',citations=[ChatCitation(evidence_id='lookup',quote='유효한 기상경보 1건입니다.')])
    result=run(assistant(local,Explainer()).answer(body('내 지역 현재 경보 있어?',location=POINT)))
    assert result.ai_used and result.items[0].title=='강풍 주의보' and result.items[0].detail=='PRIVATE_REGION'


def test_unsupported_ai_explanation_is_removed():
    class Unsafe:
        async def structured(self,model,*args):
            if model is ChatReview:return ChatReview(supported=False,reason='invented safety')
            return ChatDraft(answer='안전합니다.',citations=[ChatCitation(evidence_id='lookup',quote='공식 조회 성공')])
    a=assistant(gem=Unsafe());r=a.reply('조회 결과','alerts')
    result=run(a.explain_lookup(r,'공식 조회 성공'))
    assert result.answer=='조회 결과' and not result.ai_used


def test_general_guidance_without_selected_alert_has_sources():
    result=run(assistant().answer(body('일본 지진 대비 방법 알려줘')))
    assert result.sources and '일반 안전수칙' in result.answer


def test_explicit_new_translation_does_not_reuse_old_alert():
    from backend.models.contracts import Translation
    translate=AsyncMock(return_value=Translation(translation='강풍주의보',summary=['강풍주의보'],hazard_explanation='강풍에 주의하세요.',glossary=[]))
    result=run(assistant(callbacks={'translate':translate}).answer(body('번역: 強風注意報',text='OLD',country='JP')))
    assert translate.await_args.args[0].text=='強風注意報' and result.translation


def test_internal_actions_cannot_redirect_external():
    for path in ['https://evil.example/','//evil.example/','/unknown']:
        with pytest.raises(ValueError):ChatAction(label='x',path=path)


def test_japan_municipality_resolution_and_ambiguous_subdivision():
    areas={'class20s':{'1310100':{'parent':'p'}},'class15s':{'p':{'parent':'r'}},'class10s':{'r':{'parent':'130000'}},'offices':{'130000':{}}}
    client=httpx.AsyncClient(transport=httpx.MockTransport(lambda req:httpx.Response(200,json={'results':{'muniCd':'13101'}})))
    jma=SimpleNamespace(_get=AsyncMock(return_value=areas))
    local=LocalInformation(None,jma,None,None,None,client)
    assert run(local.japan_scope(ChatLocation(**POINT)))=='JP:130000:1310100'
    areas['class20s']['1310101']={'parent':'p'}
    other=ChatLocation(**{**POINT,'lat':35.682})
    with pytest.raises(HTTPException):run(local.japan_scope(other))


def test_stale_failed_and_expired_alerts_do_not_look_current():
    rows={'a':{'event':'Wind Advisory','status':'active','expires':(datetime.now(timezone.utc)-timedelta(hours=1)).isoformat()}}
    weather=SimpleNamespace(snapshot=AsyncMock(return_value={'rows':rows,'checked_at':now(),'area_name':'NY','country':'US'}))
    local=LocalInformation(None,None,weather,None,None)
    assert run(local.alerts(scope='US:NY:NYZ072'))['rows']==[]
    weather.snapshot.return_value['checked_at']='2020-01-01T00:00:00Z'
    with pytest.raises(ValueError):run(local.alerts(scope='US:NY:NYZ072'))


def test_nearest_filters_non_navigable_and_orders_actual_distances():
    def facility(name,distance,**kw):return Shelter(id=name,name=name,address='official address',lat=35.68,lon=139.77,distance_m=distance,bearing_deg=0,direction='북',source='https://www.gsi.go.jp/',checked_at=now(),country='JP',**kw)
    data=ShelterSearch(country='JP',origin={'lat':35.68,'lon':139.76},radius_km=10,disaster='general',shelters=[facility('far',500),facility('near',100),facility('restricted',10,navigable=False),facility('review',20,status='registered')],checked_at=now(),source='https://www.gsi.go.jp/')
    adapter=SimpleNamespace(search=AsyncMock(return_value=data))
    local=LocalInformation(None,None,None,None,adapter)
    _,rows=run(local.shelters(ChatLocation(**POINT)))
    assert [r.name for r in rows]==['near','far']
    answer=run(assistant(local).answer(body('가장 가까운 대피소 알려줘',location=POINT)))
    assert answer.items[0].distance_m==100 and 'view=route' in answer.items[0].path
    assert '안전' in answer.scope_note

def test_raw_alert_and_followup_reuse_only_prior_user_source():
    from backend.models.contracts import Translation
    translate=AsyncMock(return_value=Translation(translation='강풍 경보',summary=['강풍 경보'],hazard_explanation='강풍에 주의하세요.',glossary=[]))
    a=assistant(callbacks={'translate':translate})
    assert quick_plan(body('High Wind Warning. Gusts up to 60 mph.'))==['analysis']
    run(a.answer(body('다시 번역해 줘',history=[{'role':'user','text':'번역: 強風注意報'},{'role':'assistant','text':'WRONG SOURCE'}])))
    assert translate.await_args.args[0].text=='強風注意報'
