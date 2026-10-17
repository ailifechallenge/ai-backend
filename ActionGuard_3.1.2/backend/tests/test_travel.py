import asyncio
from datetime import datetime,timezone,timedelta
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend.core.conflict import conflict, polygon_contains, stay_interval
from backend.core.chat import answer_chat
from backend.models.contracts import Alert,Stay,ChatInput,ChatDraft,ChatCitation,ChatReview
import backend.main as main

NOW=datetime(2026,10,15,12,tzinfo=timezone.utc)
SQUARE={'type':'Polygon','coordinates':[[[-120,30],[-110,30],[-110,40],[-120,40],[-120,30]]]}

def alert(**changes):
    data=dict(id='https://api.weather.gov/alerts/example',event='Flood Warning',headline='test',area='Example County',severity='Severe',sender='NWS',sent='2026-10-15T08:00:00Z',effective='2026-10-15T08:00:00Z',onset='2026-10-15T13:00:00Z',ends='2026-10-15T18:00:00Z',expires='2026-10-16T00:00:00Z',instruction='Do not drive through flooded roads.',source='https://www.weather.gov/',text='Flood Warning. Do not drive through flooded roads.',checked_at=NOW.isoformat(),geometry=SQUARE)
    return Alert(**{**data,**changes})

def stay(**changes):
    data=dict(name='Example hotel',country='US',latitude=35,longitude=-115,timezone='America/Los_Angeles',start='2026-10-15T07:00',end='2026-10-15T09:00')
    return Stay(**{**data,**changes})

@pytest.mark.parametrize('changes,status',[
 ({},'겹침 확인'),({'onset':None},'겹칠 가능성'),({'ends':None},'겹칠 가능성'),
 ({'message_type':'Cancel'},'해제'),({'expires':'2026-10-15T11:00:00Z'},'메시지 만료'),
 ({'geometry':None},'판정 불가'),({'checked_at':(NOW-timedelta(minutes=16)).isoformat()},'판정 불가')])
def test_conflict_states(changes,status):
    assert conflict(stay(),alert(**changes),now=NOW).status==status


def test_outside_and_nonoverlap_not_safe():
    a=conflict(stay(longitude=-105),alert(),now=NOW)
    b=conflict(stay(start='2026-10-15T11:00',end='2026-10-15T12:00'),alert(),now=NOW)
    assert a.status==b.status=='현재 확인된 겹침 없음'
    assert '안전' in a.reasons[-1] and '뜻하지' in a.reasons[-1]


def test_japanese_municipality_only_possible_and_no_name_guessing():
    a=alert(id='jma:130000:05:version',area='千代田区、中央区',geometry=None,onset=None,ends=None)
    assert conflict(stay(country='JP',timezone='Asia/Tokyo',municipality='千代田区'),a,now=NOW).status=='겹칠 가능성'
    assert conflict(stay(country='JP',timezone='Asia/Tokyo',municipality='千代田'),a,now=NOW).status=='판정 불가'

@pytest.mark.parametrize('start,end',[
 ('2026-03-08T02:30','2026-03-08T04:00'),('2026-11-01T01:30','2026-11-01T03:00'),
 ('2026-10-15T09:00','2026-10-15T08:00')])
def test_dst_and_order_rejected(start,end):
    with pytest.raises(HTTPException):stay_interval(stay(start=start,end=end))


def test_holes_boundaries_and_antimeridian():
    assert polygon_contains(SQUARE,35,-115) is True
    assert polygon_contains(SQUARE,30,-115) is None
    hole={'type':'Polygon','coordinates':SQUARE['coordinates']+[[[-116,34],[-114,34],[-114,36],[-116,36],[-116,34]]]}
    assert polygon_contains(hole,35,-115) is False
    assert polygon_contains({'type':'MultiPolygon','coordinates':[hole['coordinates']]},35,-115) is False
    assert polygon_contains({'type':'Polygon','coordinates':[[[170,30],[-170,30],[-170,40],[170,40],[170,30]]]},35,179) is None

class Fake:
    def __init__(self,draft=None):self.calls=0;self.draft=draft
    async def structured(self,*args):
        self.calls+=1
        return ChatReview(supported=True,reason="grounded") if args[0] is ChatReview else self.draft


def test_chat_rejects_invented_citation():
    body=ChatInput(text='Flood Warning',question='무슨 뜻인가요?')
    gem=Fake(ChatDraft(answer='밖으로 나가세요.',citations=[ChatCitation(evidence_id='made-up',quote='safe')]))
    answer=asyncio.run(answer_chat(body,None,gem))
    assert answer.mode=='unavailable' and '밖으로 나가세요' not in answer.answer


def test_chat_uses_server_sources_not_model_urls():
    a=alert();gem=Fake(ChatDraft(answer='침수 도로를 운전하지 마세요.',citations=[ChatCitation(evidence_id='alert',quote='Do not drive through flooded roads.')]))
    answer=asyncio.run(answer_chat(ChatInput(text=a.text,question='행동 설명'),a,gem))
    assert answer.sources[0].url==a.source and gem.calls==2


def test_time_and_itinerary_answer_need_no_model():
    a=alert();gem=Fake()
    time=asyncio.run(answer_chat(ChatInput(text=a.text,question='언제 끝나나요?'),a,gem))
    overlap=conflict(stay(),a,now=NOW)
    reply=asyncio.run(answer_chat(ChatInput(text=a.text,question='숙소 일정'),a,gem,overlap))
    assert '종료:' in time.answer and overlap.status in reply.answer and gem.calls==0


def test_conflict_endpoint_rejects_forged_official_link():
    with TestClient(main.app) as client:
        r=client.post('/api/conflict',json={'text':'fake','alert_id':'invented','stay':stay().model_dump()})
        assert r.status_code==409
        r=client.post('/api/conflict',json={'text':'unlinked','stay':stay().model_dump()})
        assert r.status_code==200 and r.json()['status']=='판정 불가'


def test_grounded_quote_cannot_bypass_answer_review():
    class Unsupported(Fake):
        async def structured(self,*args):
            if args[0] is ChatReview:return ChatReview(supported=False,reason='unsupported safety assertion')
            return self.draft
    gem=Unsupported(ChatDraft(answer='안전합니다.',citations=[ChatCitation(evidence_id='alert',quote='Flood Warning')]))
    r=asyncio.run(answer_chat(ChatInput(text='Flood Warning',question='설명해 주세요'),None,gem))
    assert r.mode=='unavailable' and '안전합니다' not in r.answer

@pytest.mark.parametrize('question', ['호텔에 있는데 창문을 열어도 돼?', '안전하게 운전하려면?', '내일 이동할 때 주의할 점은?', '그럼 차는?'])
def test_practical_questions_are_not_blocked_by_keywords(question):
    a=alert()
    gem=Fake(ChatDraft(answer='침수 도로로 운전하지 마세요.',citations=[ChatCitation(evidence_id='alert',quote='Do not drive through flooded roads.')]))
    result=asyncio.run(answer_chat(ChatInput(text=a.text,question=question),a,gem))
    assert result.mode=='evidence' and gem.calls==2


def test_citationless_clarification_is_reviewed_and_preserved():
    gem=Fake(ChatDraft(answer='어느 문장의 뜻이 궁금한가요?',citations=[]))
    result=asyncio.run(answer_chat(ChatInput(text='Warning',question='그게 뭐야?'),None,gem))
    assert result.answer=='어느 문장의 뜻이 궁금한가요?' and gem.calls==2


def test_service_failure_still_provides_labeled_general_guidance():
    class Offline:
        async def structured(self,*args):raise HTTPException(429,'quota')
    result=asyncio.run(answer_chat(ChatInput(text='Flood Warning',country='US',question='뭐 해야 해?'),None,Offline()))
    assert result.mode=='unavailable' and '한도' in result.answer
    assert '침수된 도로' in result.answer and result.sources


def test_overlap_intent_is_narrow():
    from backend.core.chat import wants_overlap
    assert wants_overlap('내 숙소 일정이 겹치나요?')
    assert wants_overlap('호텔이 경보에 해당하나요?')
    assert not wants_overlap('호텔에서 강풍에 대비하려면?')
    assert not wants_overlap('내일 운전할 때 주의할 점?')


def test_followup_history_is_supplied_to_model():
    class Recording(Fake):
        async def structured(self,*args):
            if args[0] is ChatDraft:
                import json
                payload=json.loads(args[2])
                assert payload['history'][0]['text']=='운전은요?'
                assert payload['question']=='좀 더 쉽게 설명해줘'
            return await super().structured(*args)
    gem=Recording(ChatDraft(answer='침수 도로로 운전하지 마세요.',citations=[ChatCitation(evidence_id='alert',quote='Do not drive through flooded roads.')]))
    a=alert()
    result=asyncio.run(answer_chat(ChatInput(text=a.text,question='좀 더 쉽게 설명해줘',history=[{'role':'user','text':'운전은요?'}]),a,gem))
    assert result.mode=='evidence'


def test_chat_repairs_unsupported_answer_once():
    class Repair:
        def __init__(self):self.drafts=0;self.reviews=0
        async def structured(self,model,prompt,payload):
            if model is ChatReview:
                self.reviews+=1
                return ChatReview(supported=self.reviews>1,reason='preserve conditions')
            self.drafts+=1
            if self.drafts==2:
                import json
                assert 'revision_request' in json.loads(payload)
            return ChatDraft(answer='침수 도로로 운전하지 마세요.',citations=[ChatCitation(evidence_id='alert',quote='Do not drive through flooded roads.')])
    a=alert();gem=Repair()
    result=asyncio.run(answer_chat(ChatInput(text=a.text,question='운전은?'),a,gem))
    assert result.mode=='evidence' and gem.drafts==gem.reviews==2


def test_no_tsunami_concern_does_not_cancel_evacuation():
    gem=Fake(ChatDraft(answer='쓰나미 대피는 필요하지 않습니다.',citations=[ChatCitation(evidence_id='alert',quote='津波の心配はありません。')]))
    result=asyncio.run(answer_chat(ChatInput(text='地震情報。津波の心配はありません。',country='JP',question='대피해야 해?'),None,gem))
    assert '대피는 필요하지' not in result.answer
    assert result.mode=='unavailable' and gem.calls==4
