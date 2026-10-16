import json
from pathlib import Path
import pytest
from backend.core.times import readable_times
from backend.core.hazard_state import classify_hazard
from backend.core.guidance import guidance
from backend.core.verification import assess
from backend.models.contracts import Facts, Fact, Judgment
from backend.adapters.jma import parse

@pytest.mark.parametrize('source,expected',[
 ('2026-10-14T16:20:00+09:00','2026년 10월 14일 오후 4시 20분 (UTC+09:00)'),
 ('2026-10-15T00:00:00Z','2026년 10월 15일 오전 12시 00분 (UTC+00:00)'),
 ('2026-11-01T01:30:00-08:00','2026년 11월 1일 오전 1시 30분 (UTC-08:00)'),
 ('2026-10-14T16:20:30.12+09:00','2026년 10월 14일 오후 4시 20분 30.12초 (UTC+09:00)'),
 ('2026-02-30T16:20:00+09:00','2026-02-30T16:20:00+09:00'),
 ('October 14 at midnight','October 14 at midnight')])
def test_time_preserves_offset_and_date(source,expected):
    assert readable_times(source)==expected
    assert readable_times(expected)==expected


def test_readable_timestamp_not_marked_unresolved():
    source='2026-10-14T16:20:00+09:00'
    target=readable_times(source)
    v=assess(source,target,Facts(facts=[Fact(kind='start_time',value=source,quote=source)]),
        Facts(facts=[Fact(kind='start_time',value=target,quote=target)]),Judgment(issues=[],unresolved=[]))
    assert not v.unresolved


def test_prohibition_does_not_suppress_flood_advice():
    assert any('홍수' in c.title for c in guidance('Flash Flood Warning. Do not drive through flooded roads.',country='US').cards)


def test_negation_is_scoped_to_tsunami_not_earthquake():
    text='地震がありました。この地震による津波の心配はありません。'
    assert classify_hazard(text,['地震']).state == 'mentioned'
    assert classify_hazard(text,['津波']).state == 'negated'
    cards=guidance(text,country='JP').cards
    assert any('지진' in c.title for c in cards)
    assert not any('쓰나미' in c.title for c in cards)


def test_cancelled_wind_does_not_suppress_active_flood():
    cards=guidance('High Wind Warning cancelled. Flash Flood Warning remains in effect.',country='US').cards
    assert any('홍수' in c.title for c in cards)
    assert not any('강풍' in c.title for c in cards)


def test_jma_new_area_snapshot_removes_old_warning():
    def report(time,kinds):
        return dict(reportDatetime=time,warning=dict(class20Items=[dict(areaCode='1',kinds=kinds)]))
    old=report('2026-10-14T16:20:00+09:00',[dict(code='05',status='発表')])
    clear=report('2026-10-14T17:20:00+09:00',[dict(status='発表警報・注意報はなし')])
    assert parse('130000',[clear,old],{'class20s':{}},'checked') == []
    a=parse('130000',[old],{'class20s':{}},'checked')[0]
    newer=report('2026-10-14T17:20:00+09:00',[dict(code='05',status='継続')])
    b=parse('130000',[newer],{'class20s':{}},'checked')[0]
    assert a.id != b.id and a.effective is None and b.onset is None


def test_dataset_has_ground_truth_provenance_and_both_countries():
    cases=json.loads((Path(__file__).resolve().parents[2]/'evaluation/cases.json').read_text())
    assert {c['country'] for c in cases}=={'US','JP'}
    assert len({c['id'] for c in cases})==len(cases)
    for c in cases:
        assert c['gold'] and c['privacy']
        if c['origin']!='synthetic_regression': assert c['source_url'].startswith('https://')
        cards=guidance(c['text'],country=c['country']).cards
        for term in c['gold'].get('guidance_include',[]): assert any(term in v.title for v in cards)
        for term in c['gold'].get('guidance_exclude',[]): assert not any(term in v.title for v in cards)

@pytest.mark.parametrize('zone',['UTC+9','+09:00','UTC+09:00','GMT+0900'])
def test_equivalent_korean_zone_forms(zone):
    from backend.core.times import equivalent_timestamp_present
    assert equivalent_timestamp_present('2026-10-14T16:20:00+09:00',f'2026년 10월 14일 오후 4시 20분({zone})')
    assert not equivalent_timestamp_present('2026-10-14T16:20:00-07:00',f'2026년 10월 14일 오후 4시 20분({zone})')


def test_generation_schema_keeps_enum_and_required_fields():
    from backend.core.gemini import response_schema
    from backend.models.contracts import Translation, Judgment
    schema=response_schema(Translation)
    assert 'translation' in schema['required']
    assert schema['additionalProperties'] is False
    assert 'minLength' not in schema['properties']['translation']
    issue=response_schema(Judgment)['$defs']['Issue']
    assert 'issued_time' in issue['properties']['kind']['enum']
    assert issue['properties']['field']['enum']

@pytest.mark.parametrize('text,tokens',[('This is not a drill. Tornado warning.',['tornado']),('訓練ではありません。地震が発生しました。',['地震'])])
def test_negated_drill_does_not_suppress_real_hazard(text,tokens):
    assert classify_hazard(text,tokens).state=='mentioned'

def test_actual_drill_still_suppresses_action_recommendations():
    assert classify_hazard('This is a drill. Tornado warning.',['tornado']).state=='test'
