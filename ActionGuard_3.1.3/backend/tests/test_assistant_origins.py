"""User-reported origin phrases must not collapse into a generic location wall."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi import HTTPException

from backend.adapters.assistant_places import AssistantPlaces, broad_region
from backend.core.app_assistant import AppAssistant, quick_plan
from backend.models.contracts import ChatInput, ChatPlaceQuery


class Offline:
    async def structured(self, *args):
        raise HTTPException(503, 'model unavailable')


def run(task):
    return asyncio.run(task)


@pytest.mark.parametrize('question,query', [
    ('자유의 여신상에 있는데 가까운 대피소 알려줘', 'Statue of Liberty, New York'),
    ('자유여신상에 있어. 가까운 대피소 알려줘', 'Statue of Liberty, New York'),
    ('뉴욕 자유의 여신상에 있는데 대피소 알려줘', 'Statue of Liberty, New York'),
    ('캘리포니아에 있는데 가까운 대피소 알려줘', 'California'),
    ('캘리포니아주 근처 대피소 알려줘', 'California'),
    ('I am in California, find a shelter', 'California'),
])
def test_named_origins_are_recognized_even_when_model_is_offline(question, query):
    found = run(AssistantPlaces(Offline()).extract(question))
    assert found.query == query and found.mention in question and found.country == 'US'


def test_unlisted_explicit_origin_survives_model_failure_without_inventing_coordinates():
    found = run(AssistantPlaces(Offline()).extract('우에노공원에 있는데 가까운 대피소 알려줘'))
    assert found.mention == found.query == '우에노공원'
    assert 'lat' not in found.model_dump() and 'lon' not in found.model_dump()


@pytest.mark.parametrize('question', ['내가 있는 곳 근처 대피소', '어떤 호텔 주변 대피소', '내 위치에서 가까운 대피소', '여기에 있는데 대피소'])
def test_unnamed_self_references_are_not_sent_to_map_search_as_place_names(question):
    assert run(AssistantPlaces(Offline()).extract(question)) is None


def test_state_requires_city_instead_of_searching_an_arbitrary_centroid():
    places = AssistantPlaces(Offline())
    places.search = AsyncMock(side_effect=AssertionError('must not geocode a state centroid'))
    local = SimpleNamespace(shelters=AsyncMock(side_effect=AssertionError('must not search facilities')))
    app = AppAssistant(local, Offline(), lambda b: None, {}, None, places=places)
    response = run(app.answer(ChatInput(question='캘리포니아에 있는데 가까운 대피소 알려줘')))
    assert response.mode == 'clarify' and response.intent == 'shelters'
    assert '캘리포니아주' in response.answer and '도시' in response.answer
    assert '어느 위치를 기준' not in response.answer
    assert not response.needs_location and response.query_location is None
    places.search.assert_not_called()
    local.shelters.assert_not_called()


def test_city_only_answer_continues_the_pending_facility_question_without_model_routing():
    assert quick_plan(ChatInput(question='샌프란시스코', previous_intent='shelters')) == ['shelters']
    assert quick_plan(ChatInput(question='시카고', previous_intent='alerts')) == ['alerts']


def test_landmarks_use_real_poi_search_instead_of_city_name_fuzzy_matches():
    requests = []
    def transport(req):
        requests.append(req)
        return httpx.Response(200, json={'features': [{
            'geometry': {'coordinates': [-74.0445, 40.6892]},
            'properties': {'name': 'Statue of Liberty', 'countrycode': 'us', 'city': 'New York', 'osm_value': 'monument'},
        },{
            'geometry': {'coordinates': [-74.0169,40.7035]},
            'properties': {'name':'Statue of Liberty Tickets','countrycode':'us','city':'New York','osm_value':'ticket_office'},
        }]})
    places = AssistantPlaces(Offline(), httpx.AsyncClient(transport=httpx.MockTransport(transport)))
    found = run(places.search(ChatPlaceQuery(mention='자유의 여신상', query='Statue of Liberty, New York', country='US')))
    assert len(requests) == 1 and 'photon' in requests[0].url.host
    assert len(found) == 1 and found[0].location.country == 'US'
    assert not found[0].approximate


def test_lookup_failure_keeps_the_recognized_landmark_and_never_uses_old_location():
    places = AssistantPlaces(Offline())
    places.search = AsyncMock(side_effect=HTTPException(502, 'map unavailable'))
    local = SimpleNamespace(shelters=AsyncMock())
    app = AppAssistant(local, Offline(), lambda b: None, {}, None, places=places)
    response = run(app.answer(ChatInput(question='자유의 여신상에 있는데 가까운 대피소 알려줘', location={'country':'JP','lat':35.68,'lon':139.76,'name':'old location'})))
    assert response.mode == 'unavailable' and '자유의 여신상' in response.answer
    assert '지도 검색' in response.answer and not response.needs_location
    local.shelters.assert_not_called()


def test_retry_reuses_the_users_explicit_origin_when_the_previous_map_search_failed():
    places = AssistantPlaces(Offline())
    places.search = AsyncMock(return_value=[])
    app = AppAssistant(None, Offline(), lambda b: None, {}, None, places=places)
    response = run(app.answer(ChatInput(question='다시 찾아줘', previous_intent='shelters', history=[{'role':'user','text':'자유의 여신상에 있는데 가까운 대피소 알려줘'}])))
    assert places.search.await_args.args[0].query == 'Statue of Liberty, New York'
    assert response.mode == 'clarify' and not response.needs_location
