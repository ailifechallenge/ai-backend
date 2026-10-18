"""AMBER is a public-safety alert, not a weather or general vehicle question."""
import asyncio
from unittest.mock import AsyncMock
import pytest
from backend.core.app_assistant import AppAssistant, pasted_alert, quick_plan
from backend.core.translator import translate, compact_amber
from backend.models.contracts import ChatInput, Translation

SOURCE = 'Warner Robins, GA AMBER Alert: CSX5096; (GA) 2003; Jeep; Liberty; SUV'

@pytest.mark.parametrize('suffix', ['', ' 문자 해석해줘', ' 번역해주세요'])
def test_pasted_amber_routes_to_analysis_with_vehicle_data_intact(suffix):
    question = SOURCE + suffix
    assert quick_plan(ChatInput(question=question)) == ['analysis']
    assert pasted_alert(question) == SOURCE


def test_compact_amber_preserves_plate_state_year_and_vehicle_without_model_call():
    gemini = AsyncMock()
    result = asyncio.run(translate(SOURCE, gemini))
    gemini.structured.assert_not_called()
    assert '아동' in result.hazard_explanation and '납치' in result.hazard_explanation
    for token in ('Warner Robins, GA', 'CSX5096', '(GA)', '2003', 'Jeep', 'Liberty', 'SUV'):
        assert token in result.translation
    assert result.instruction_translation_ko is None
    assert '현재 발령·해제 상태는 확인할 수 없습니다' in result.summary[-1]


def test_noncompact_amber_keeps_full_model_translation_and_explicit_alert_identity():
    gemini = AsyncMock()
    gemini.structured.return_value = Translation(translation='경찰이 발령한 아동 납치 긴급 경보. 원문에 명시된 신고 지시.', hazard_explanation='차량 정보입니다.', summary=['경찰 신고 지시'], glossary=[])
    result = asyncio.run(translate('Child Abduction Emergency: follow police instructions', gemini))
    assert compact_amber('2003 Jeep Liberty SUV') is None
    assert '아동' in result.hazard_explanation
    assert result.translation.startswith('경찰이 발령한')
    assert 'CHILD ABDUCTION' in gemini.structured.await_args.args[1]


def test_chat_uses_complete_pasted_amber_instead_of_old_selected_weather():
    callback = AsyncMock(return_value=compact_amber(SOURCE))
    assistant = AppAssistant(None, None, lambda _: None, {'translate': callback}, None)
    result = asyncio.run(assistant.answer(ChatInput(question=SOURCE+' 문자 해석해줘', text='Old Flood Warning', country='US')))
    assert callback.await_args.args[0].text == SOURCE
    assert '납치' in result.answer and 'CSX5096' in result.answer
