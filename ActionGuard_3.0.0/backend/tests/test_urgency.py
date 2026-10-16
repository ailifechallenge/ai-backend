from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from backend.core.urgency import assess_urgency
from backend.models.contracts import Alert
import backend.main as main

NOW = datetime(2026, 10, 15, tzinfo=timezone.utc)


def official(**kwargs):
    values = dict(id='https://api.weather.gov/alerts/urgency-test', event='Tornado Warning',
        headline='Tornado Warning for Example County', area='Example County', severity='Severe',
        sender='NWS', sent=None, effective=None, expires='2026-10-16T00:00:00Z',
        instruction='', source='https://api.weather.gov/alerts/urgency-test',
        text='Event: Tornado Warning\nArea: Example County', checked_at='2026-10-15T00:00:00Z')
    return Alert(**{**values, **kwargs})


@pytest.mark.parametrize('text,level,kind', [
    ('Special Weather Statement', 1, 'monitor'),
    ('Heat Advisory', 2, 'caution'),
    ('Winter Weather Advisory', 2, 'caution'),
    ('Tornado Watch', 3, 'prepare'),
    ('Flood Watch', 3, 'prepare'),
    ('Hurricane Watch', 3, 'prepare'),
    ('Tornado Warning', 4, 'shelter'),
    ('Tornado Emergency', 4, 'shelter'),
    ('Severe Thunderstorm Warning', 4, 'shelter'),
    ('Extreme Wind Warning', 4, 'shelter'),
    ('Flash Flood Warning', 4, 'higher_ground'),
    ('Flash Flood Emergency', 4, 'higher_ground'),
    ('Tsunami Warning', 4, 'higher_ground'),
    ('Tsunami Advisory', 3, 'protect'),
    ('Hurricane Warning. Evacuate immediately if ordered.', 3, 'protect'),
    ('Storm Surge Warning. If officials order evacuation, leave immediately.', 3, 'protect'),
    ('Excessive Heat Warning', 3, 'protect'),
    ('Red Flag Warning', 3, 'protect'),
    ('Winter Storm Warning', 3, 'protect'),
    ('Shelter In Place Warning', 4, 'shelter'),
    ('Evacuation Immediate', 4, 'evacuate'),
    ('SAME: TOR', 4, 'shelter'),
    ('Event code: FFW', 4, 'higher_ground'),
    ('TOA', 3, 'prepare'),
    ('Evacuate now. Follow local officials.', 4, 'evacuate'),
    ('Residents in Zone A must evacuate immediately.', 4, 'evacuate'),
    ('Move to higher ground immediately.', 4, 'higher_ground'),
    ('Take shelter immediately.', 4, 'shelter'),
    ('Shelter in place now.', 4, 'shelter'),
    ('Hurricane Warning. A mandatory evacuation order is in effect for Zone A.', 4, 'evacuate'),
    ('NWS has issued a Tornado Warning for Example County', 4, 'shelter'),
    ('TORNADO WARNING for Example County until 5 PM', 4, 'shelter'),
])
def test_event_and_action_meanings(text, level, kind):
    result = assess_urgency(text, country='US', now=NOW)
    assert (result.level, result.action_kind) == (level, kind)
    assert result.provenance == 'input'
    assert '미확인' not in result.headline
    assert result.evidence
    for evidence in result.evidence:
        assert evidence.quote in text


@pytest.mark.parametrize('text', [
    'If a Tornado Warning is issued, seek shelter immediately.',
    'If ordered, evacuate now.',
    'Evacuate immediately if ordered.',
    'Do not evacuate now.',
    'No mandatory evacuation order is in effect.',
    'Prepare to evacuate immediately if conditions worsen.',
    'The meaning of a Tornado Warning is take action.',
    'What is a Tornado Warning?',
    'TOR appears in the word MOTOR',
    'Tornado Warning is not in effect.',
    'Tornado Warning has not been issued.',
    'Something worrying but unrecognized',
    'Alien Invasion Warning',
    'Tornado Advisory',
    'Tornado Warning means take action.',
    'Tornado Warning may be issued later.',
    'Someone said "evacuate now" yesterday.',
    'Officials may say take shelter immediately.',
])
def test_not_enough_evidence_does_not_become_low_risk_or_evacuation(text):
    assert assess_urgency(text, country='US', now=NOW).level is None


@pytest.mark.parametrize('text', [
    'This is a test. Tornado Warning. Take shelter immediately.',
    'TEST ONLY. Flash Flood Warning. Move to higher ground immediately.',
    'Tornado Warning has been cancelled.',
    'Tornado Warning expired. Take shelter immediately.',
    'Cancelled: Flash Flood Warning. Move to higher ground immediately.',
])
def test_test_and_cancelled_messages_do_not_reactivate_old_instructions(text):
    result = assess_urgency(text, country='US', now=NOW)
    assert result.level == 1
    assert result.inactive


def test_mixed_event_cancellation_keeps_active_hazard():
    result = assess_urgency('Tornado Warning cancelled. Severe Thunderstorm Warning in effect.', country='US', now=NOW)
    assert result.level == 4
    assert result.action_kind == 'shelter'
    assert 'Severe Thunderstorm Warning' in result.evidence[0].quote


def test_strongest_of_multiple_active_events():
    result = assess_urgency('Heat Advisory. Tornado Watch. Flash Flood Warning.', now=NOW)
    assert result.action_kind == 'higher_ground'


def test_official_event_ignores_conditional_other_hazards_in_description():
    alert = official(event='Hurricane Warning', text='Hurricane Warning. If a Tornado Warning is issued, take shelter immediately.')
    result = assess_urgency(alert.text, alert, now=NOW)
    assert result.level == 3
    assert result.provenance == 'official'
    assert result.applicability.endswith('Example County')


@pytest.mark.parametrize('kwargs', [
    {'message_type': 'Cancel'}, {'status': 'Test'}, {'status': 'Exercise'},
    {'expires': '2026-10-14T00:00:00Z'}, {'ends': '2026-10-14T00:00:00Z'},
])
def test_trusted_inactive_metadata_overrides_warning_and_instructions(kwargs):
    alert = official(instruction='Take shelter immediately.', **kwargs)
    result = assess_urgency(alert.text, alert, now=NOW)
    assert result.level == 1
    assert result.inactive


def test_message_expiry_is_not_described_as_end_of_danger():
    alert = official(expires='2026-10-14T00:00:00Z')
    result = assess_urgency(alert.text, alert, now=NOW)
    assert '위험이 끝났다는 뜻은 아니' in result.meaning


def test_unknown_event_severity_alone_is_not_an_evacuation_order():
    alert = official(event='Unknown', severity='Extreme', text='Unknown event')
    assert assess_urgency(alert.text, alert, now=NOW).level is None


def test_explicit_order_overrides_general_hurricane_warning():
    alert = official(event='Hurricane Warning', instruction='Residents in Zone A must evacuate now.')
    result = assess_urgency(alert.text, alert, now=NOW)
    assert result.action_kind == 'evacuate'
    assert 'Zone A' in result.evidence[0].quote


def test_current_tornado_warning_does_not_inherit_cancelled_flood_description():
    alert = official(text='Event: Tornado Warning\nDetails: Earlier Flood Warning cancelled.')
    assert assess_urgency(alert.text, alert, now=NOW).level == 4


def test_demo_shows_meaning_but_not_real_emergency():
    text = 'DEMO ONLY — FICTIONAL ALERT. NOT ACTIVE.\nFlash Flood Warning for Example County.'
    result = assess_urgency(text, now=NOW)
    assert result.level == 4
    assert result.provenance == 'example'
    assert '실제 발령 경보' in result.notice


def test_japanese_uses_its_own_event_meanings_and_unknown_input_stays_unknown():
    assert assess_urgency('暴風警報', country='JP', now=NOW).level == 3
    assert assess_urgency('Tornado Warning', country='JP', now=NOW).level is None
    assert assess_urgency('Unrecognized', now=NOW).level is None


def test_endpoint_works_without_ai_and_requires_authentic_official_link(monkeypatch):
    monkeypatch.delenv('GEMINI_API_KEY', raising=False)
    with TestClient(main.app) as client:
        response = client.post('/api/urgency', json={'text': 'Flash Flood Warning', 'country': 'US', 'use_ai':False})
        assert response.status_code == 200
        assert response.json()['level'] == 4
        assert client.post('/api/urgency', json={'text': 'Tornado Warning', 'alert_id': 'made-up'}).status_code == 409
        assert client.post('/api/urgency', json={'text': ' '}).status_code == 422


def test_pasted_explicit_expiry_and_mixed_hazards():
    result = assess_urgency('Flash Flood Warning\nMessage expires: 2026-10-14T00:00:00Z', now=NOW)
    assert result.level == 1 and result.inactive
    mixed = assess_urgency('Tornado Warning cancelled but Flash Flood Warning in effect.', now=NOW)
    assert mixed.level == 4 and mixed.action_kind == 'higher_ground'
