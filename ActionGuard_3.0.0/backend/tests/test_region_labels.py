import asyncio,json,re
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock
from backend.core.region_labels import japanese_region,catalog
from backend.push.weather import Weather,STATES
from backend.adapters.jma import JMA

ROOT=Path(__file__).resolve().parents[2]

def test_full_catalog_has_korean_and_keeps_originals_for_every_region():
    data=catalog()
    assert len(data['offices'])==58 and len(data['municipalities'])==1805
    for group in ('offices','municipalities'):
        for code,row in data[group].items():
            display=japanese_region(code,row['name'],row['en_name'])
            assert re.search('[가-힣]',display['ko_name'])
            assert row['name'] in display['display_name']
    assert japanese_region('130000','東京都')['display_name']=='도쿄도 (東京都)'
    assert japanese_region('1310100','千代田区')['display_name']=='지요다구 (千代田区)'
    assert '북부' in japanese_region('1410011','横浜市北部')['ko_name']


def test_changed_official_name_does_not_get_stale_translation():
    row=japanese_region('1310100','NEW_OFFICIAL_NAME')
    assert row['ko_name'] is None and row['display_name']=='NEW_OFFICIAL_NAME'
    assert row['label_method']=='original'


def test_state_list_exactly_matches_supported_backend_codes():
    states=json.loads((ROOT/'data/us-states-ko.json').read_text())
    assert {s['code'] for s in states}==STATES
    assert len(states)==len(STATES)==56
    assert next(s for s in states if s['code']=='CA')['ko_name']=='캘리포니아주'
    assert next(s for s in states if s['code']=='DC')['ko_name'].endswith('특별구')


def test_display_index_is_derived_from_full_catalog_not_independent_translation():
    index=json.loads((ROOT/'data/japan-region-display.json').read_text())
    for group in ('offices','municipalities'):
        assert index[group]=={code:{'name':row['name'],'ko_name':row['ko_name']} for code,row in catalog()[group].items()}


def test_jma_office_api_adds_display_fields_without_changing_identity():
    a=JMA();a._get=AsyncMock(return_value={'offices':{'130000':{'name':'東京都','enName':'Tokyo'}}})
    result=asyncio.run(a.areas())['areas'][0]
    assert result['code']=='130000' and result['name']=='東京都'
    assert result['ko_name']=='도쿄도' and result['display_name']=='도쿄도 (東京都)'


def test_municipality_api_returns_raw_identity_and_display_label():
    data={'offices':{'130000':{}},'class10s':{'130010':{'parent':'130000'}},'class15s':{'130011':{'parent':'130010'}},'class20s':{'1310100':{'name':'千代田区','enName':'Chiyoda City','parent':'130011'}}}
    weather=Weather();weather.jma=SimpleNamespace(_get=AsyncMock(return_value=data))
    result=asyncio.run(weather.areas('JP','130000'))['areas'][0]
    assert result['code']=='1310100' and result['name']=='千代田区'
    assert result['ko_name']=='지요다구'
