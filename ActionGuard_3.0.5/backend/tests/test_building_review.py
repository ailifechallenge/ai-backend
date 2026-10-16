import asyncio
from copy import deepcopy
import httpx
from backend.adapters.building_review import BuildingReview, match_result
from backend.adapters.shelters import parse_nyc
from backend.models.shelters import Origin
from backend.adapters.walking import parse as parse_route
from backend.tests.test_shelters import feature, parse, ORIGIN, CHECKED, route_payload

def candidate():
    return parse({'features':[feature(3,facility_type='',shelter_name='FICTIONAL Maple Hall',address_1='123 Test Street')]},ORIGIN,10,CHECKED)[0]

def response(link='https://city.example.gov/facilities/maple', street='123 Test Street'):
    return {'organic_results':[{'link':link,'title':'FICTIONAL Maple Hall','snippet':f'FICTIONAL Maple Hall is a community center at {street}.'}]}

def test_google_match_requires_official_domain_and_same_street():
    row=candidate()
    assert match_result(row,response())[0] == 'community'
    assert match_result(row,response(link='https://ad.example.com/maple')) is None
    assert match_result(row,response(street='789 Different Street')) is None

def test_unknown_building_type_does_not_hide_official_shelter():
    reviewer=BuildingReview(key='',registry={})
    kept,pending,excluded=asyncio.run(reviewer.review([candidate()]))
    assert len(kept) == 1 and kept[0].shelter_type == 'other' and len(pending) == 1 and excluded == 0
    assert pending[0]['google_search_url'].startswith('https://www.google.com/search?')

def test_google_enrichment_preserves_official_shelter_role_and_cache():
    calls=[]
    async def handler(request):
        calls.append(request)
        assert request.url.params['engine'] == 'google'
        assert 'FICTIONAL Maple Hall' in request.url.params['q']
        return httpx.Response(200,json=response())
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            reviewer=BuildingReview(client,key='test-only-key',registry={})
            kept,pending,excluded=await reviewer.review([candidate()])
            assert len(kept) == 1 and not pending and not excluded
            assert kept[0].shelter_type == 'community'
            assert kept[0].role_label == '공식 운영 중 대피소'
            assert kept[0].classification_source == response()['organic_results'][0]['link']
            await reviewer.review([candidate()])
    asyncio.run(run())
    assert len(calls) == 1

def test_search_failure_holds_candidate_without_leaking_provider_error():
    async def handler(request): return httpx.Response(429,json={'error':'test-only-key sensitive provider message'})
    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            return await BuildingReview(client,key='test-only-key',registry={}).review([candidate()])
    kept,pending,excluded=asyncio.run(run())
    assert len(kept)==1 and len(pending)==1 and excluded==0
    assert 'sensitive' not in str(pending)

def test_confirmed_exclusion_requires_identity_and_sourced_review():
    row=candidate()
    entry={'name':row.name,'street':'123 Test Street','excluded':True,'reason':'Official demolition notice','reviewed_at':'2026-10-14','source':'https://city.example.gov/demolition'}
    kept,pending,excluded=asyncio.run(BuildingReview(key='',registry={row.id:entry}).review([row]))
    assert not kept and not pending and excluded==1
    entry['street']='999 Another Street'
    assert asyncio.run(BuildingReview(key='',registry={row.id:entry}).review([candidate()]))[2]==0

def test_russell_sage_is_school_building_with_hurricane_intake_role():
    payload={'features':[{'properties':{'bldg_name':'J.H.S.190 Russell Sage','bldg_add':'68-17 Austin Street','city':'Forest Hills','state':'NY','bin':'4075214'},'geometry':{'type':'Point','coordinates':[-73.8517543,40.7232421]}}]}
    row=parse_nyc(payload,Origin(lat=40.723,lon=-73.852),3,CHECKED)[0]
    assert row.shelter_type=='school' and row.type_label=='학교·교육시설'
    assert row.role_label=='허리케인 대피 접수센터'
    kept,pending,_=asyncio.run(BuildingReview(key='').review([row]))
    assert not pending and kept[0].classification_source=='https://www.schools.nyc.gov/schools/Q190'

def test_route_chooses_minimum_walking_time_then_distance():
    payload=route_payload()
    faster=deepcopy(payload['routes'][0]); faster.update(duration=500,distance=1100)
    tie=deepcopy(faster); tie['distance']=900
    payload['routes'] += [faster,tie]
    row=parse({'features':[feature()]},ORIGIN,10,CHECKED)[0]
    route=parse_route(payload,ORIGIN,row)
    assert route.duration_s==500 and route.distance_m==900
    assert route.alternatives_evaluated==3
