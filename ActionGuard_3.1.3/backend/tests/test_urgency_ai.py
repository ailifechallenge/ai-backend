import asyncio
from datetime import datetime, timezone
import json
import pytest
from fastapi import HTTPException
from backend.core.urgency import assess_urgency
from backend.core.urgency_ai import CACHE, interpret_urgency
from backend.models.contracts import UrgencyInterpretation


class Model:
    def __init__(self, level=2, kind='caution', quote='Wind Advisory', failure=None):
        self.answer=UrgencyInterpretation(level=level,action_kind=kind,evidence=[quote],reason_ko='원문에 해당 경보와 행동이 명시되어 있습니다.')
        self.failure=failure
        self.calls=0
        self.payload=None
    async def structured(self, schema, prompt, text):
        self.calls+=1
        self.payload=json.loads(text)
        if self.failure:raise self.failure
        return self.answer


@pytest.fixture(autouse=True)
def model_settings(monkeypatch):
    monkeypatch.setenv('GEMINI_API_KEY','test-placeholder-not-a-key')
    monkeypatch.setenv('GEMINI_FREE_TIER_CONFIRMED','true')
    CACHE.items.clear()


def run(text, model, country='US'):
    return asyncio.run(interpret_urgency(text,model,country=country))


@pytest.mark.parametrize('text,country,level,kind',[
    ('Wind Advisory','US',2,'caution'),('Lake Wind Advisory','US',2,'caution'),
    ('High Wind Warning','US',4,'shelter'),('強風注意報','JP',2,'caution'),
    ('暴風警報','JP',3,'protect'),('波浪注意報','JP',2,'caution'),('大雨警報','JP',3,'protect'),
    ('津波注意報','JP',3,'protect'),('津波警報','JP',4,'higher_ground'),
    ('大津波警報','JP',4,'higher_ground'),('避難指示','JP',4,'evacuate'),
    ('緊急地震速報','JP',4,'shelter'),('緊急安全確保','JP',4,'protect'),
    ('大雨危険警報','JP',4,'protect'),('大雨特別警報','JP',4,'protect'),
])
def test_us_and_japanese_basic_meanings(text,country,level,kind):
    result=assess_urgency(text,country=country)
    assert (result.level,result.action_kind)==(level,kind)
    if country=='JP':assert all(s.title.startswith('JMA') for s in result.sources)


@pytest.mark.parametrize('text',['津波警報は発表されていません。','津波警報は出ていません。','避難指示は発令されていません。','津波警報が発表された場合、高台へ避難してください。'])
def test_japanese_negated_and_conditional_titles_stay_unknown(text):
    assert assess_urgency(text,country='JP').level is None


@pytest.mark.parametrize('text',['津波警報を解除しました。','状況: 解除\n津波警報','訓練です。津波警報。高台へ避難してください。'])
def test_japanese_cancellation_and_training_skip_model(text):
    model=Model(4,'higher_ground','津波警報')
    result=run(text,model,'JP')
    assert result.inactive and model.calls==0


def test_japanese_model_confirmation_and_source_label():
    result=run('強風注意報',Model(quote='強風注意報'),'JP')
    assert result.level==2 and result.method=='ai'


def test_model_interprets_free_form_japanese_instruction():
    text='海岸にいる皆さん、今すぐ高台へ避難してください。'
    result=run(text,Model(4,'higher_ground',text),'JP')
    assert result.level==4 and result.action_kind=='higher_ground' and result.method=='ai'


def test_unknown_country_japanese_instruction_uses_jma_source():
    text='海岸にいる皆さん、今すぐ高台へ避難してください。'
    model=Model(4,'higher_ground',text)
    result=run(text,model,'unknown')
    assert result.level==4 and result.sources[0].title.startswith('JMA')
    assert model.payload['country']=='JP'


def test_named_demo_county_does_not_block_semantic_ai_confirmation():
    text='DEMO ONLY — FICTIONAL ALERT. NOT ACTIVE.\nFlash Flood Warning for Example County.'
    result=run(text,Model(4,'higher_ground','Flash Flood Warning'))
    assert result.provenance=='example' and result.method=='ai'


def test_missing_us_heading_can_be_interpreted_from_full_sentence():
    text='Local officials advise caution due to strong wind gusts; secure loose items.'
    result=run(text,Model(quote='Local officials advise caution due to strong wind gusts'))
    assert result.level==2 and result.method=='ai'


@pytest.mark.parametrize('text,level,kind,quote',[
    ('Wind Advisory. Gusts up to 60 mph.',4,'evacuate','Gusts up to 60 mph'),
    ('If ordered, evacuate now.',4,'evacuate','evacuate now'),
    ('Do not evacuate now.',4,'evacuate','evacuate now'),
    ('津波警報は出ていません。',4,'higher_ground','津波警報'),
    ('Tornado Warning',1,'monitor','Tornado Warning'),
    ('Wind Advisory',4,'shelter','Take shelter now'),
])
def test_unproven_evacuation_negation_clipped_conditions_and_downgrades_rejected(text,level,kind,quote):
    country='JP' if '津波' in text else 'US'
    base=assess_urgency(text,country=country)
    result=run(text,Model(level,kind,quote),country)
    assert (result.level,result.action_kind)==(base.level,base.action_kind)
    assert result.method=='rules_fallback'


def test_model_failure_keeps_wind_result():
    result=run('Wind Advisory',Model(failure=HTTPException(429,'quota')))
    assert result.level==2 and result.method=='rules_fallback'


def test_no_key_keeps_japanese_result_without_model_call(monkeypatch):
    monkeypatch.delenv('GEMINI_API_KEY')
    model=Model(quote='強風注意報')
    result=run('強風注意報',model,'JP')
    assert result.level==2 and model.calls==0 and result.method=='rules_fallback'


def test_repeated_same_message_uses_cache():
    model=Model()
    first=run('Wind Advisory',model)
    second=run('Wind Advisory',model)
    assert first.method==second.method=='ai' and model.calls==1
    assert set(model.payload)=={'country','original','trusted_event','trusted_instruction'}


def test_expiry_precedes_cached_ai():
    from backend.models.contracts import Alert
    alert=Alert(id='test',event='Wind Advisory',headline='Wind Advisory',area='test',severity='Moderate',sender='NWS',sent=None,effective=None,
        expires='2000-01-01T00:00:00Z',instruction='',source='https://www.weather.gov/',text='Wind Advisory',checked_at='2000-01-01T00:00:00Z')
    model=Model()
    result=asyncio.run(interpret_urgency(alert.text,model,alert,'US'))
    assert result.inactive and model.calls==0


def test_wrapped_typhoon_preparations_are_ai_assessed_with_exact_source_evidence():
    text='Typhoon Warning\n\nMake the final preparations to protect life and property. Rush\nto completion the hardening of your home or business by closing\nshutters and bracing garage doors.\n\nIf evacuating, leave as soon as possible.'
    model=Model(3,'prepare','Rush to completion the hardening of your home or business by closing shutters and bracing garage doors.')
    result=run(text,model)
    assert (result.level,result.action_kind,result.method)==(3,'prepare','ai')
    assert result.evidence[0].quote in text and '\n' in result.evidence[0].quote

def test_wrapped_conditional_evacuation_cannot_be_clipped_into_an_order():
    text='If ordered,\nevacuate now.'
    result=run(text,Model(4,'evacuate','evacuate now.'))
    assert result.method=='rules_fallback' and result.level is None

def test_non_whitespace_edits_to_evidence_remain_rejected():
    text='Make final preparations to protect life and property.'
    result=run(text,Model(4,'evacuate','Evacuate immediately to protect life and property.'))
    assert result.method=='rules_fallback'


def test_model_quota_failure_is_distinguished_from_missing_source_evidence():
    result=run('Typhoon Warning',Model(failure=HTTPException(429,'quota')))
    assert result.method=='rules_fallback' and result.level==3 and '한도' in result.method_note
