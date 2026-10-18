import asyncio,copy,json
from datetime import datetime,timezone
import pytest
from fastapi import HTTPException
from backend.adapters.volcano import parse_volcano,Volcano
from backend.push.volcano import prepare_volcano
from backend.push.models import Preferences,COASTS
from backend.push.store import Store
from pathlib import Path
CAT=[{'code':'506','name_jp':'桜島','name_en':'Sakurajima','latlon':['31.59','130.66']}]
def report(kind='13',date='2022-07-27T20:00:00+09:00'):
 return {'reportDatetime':date,'eventId':'506','areas':['4620100'],'volcanoInfos':[{'type':'噴火警報・予報（対象火山）','items':[{'code':kind,'name':'公式表記','areas':[{'code':'506','name':'桜島'}]}]}]}
def test_current_snapshot_keeps_old_but_still_effective_warning():
 r=parse_volcano([report()],CAT)[0];assert r['level']==3;assert '入山' not in r['action'];assert '입산' in r['action'];assert r['issued_at'].startswith('2022')
def test_unknown_or_malformed_warning_does_not_become_no_warning():
 for reports in ([report('99')],{},[report(date='broken')]):
  with pytest.raises((ValueError,KeyError)):parse_volcano(reports,CAT)
def test_non_numeric_warning_does_not_invent_level():
 assert parse_volcano([report('22')],CAT)[0]['level'] is None
 assert '숫자 레벨' in parse_volcano([report('22')],CAT)[0]['action']
def test_latest_snapshot_wins_without_resurrecting_high_level():
 r=parse_volcano([report('15'),report('12','2026-10-17T10:00:00+09:00')],CAT);assert r[0]['level']==2
def test_coast_options_match_supported_official_codes():
 d=json.loads((Path(__file__).resolve().parents[2]/'data/jma-tsunami-regions.json').read_text());assert {r['code'] for r in d['regions']}==COASTS
def test_volcano_subscription_deduplicates_and_source_failure_preserves_queue(tmp_path):
 asyncio.run(check_subscription(tmp_path))
async def check_subscription(tmp_path):
 s=Store(tmp_path/'push.db');p=Preferences(volcanoes=['506']).model_dump();device=s.register(s.enrollment('fcm'),'fcm','test-device-token-12345',p)
 class Source:
  fail=False
  async def current(self):
   if self.fail:raise ValueError('offline')
   return {'volcanoes':parse_volcano([report()],CAT),'checked_at':datetime.now(timezone.utc).isoformat()}
 source=Source();a,ok=await prepare_volcano(s,s.devices(),'live:',source);b,ok=await prepare_volcano(s,s.devices(),'live:',source);assert ok and a==b
 assert len(a)==1
 with s.db() as db:assert db.execute('select count(*) from delivery').fetchone()[0]==1
 source.fail=True;assert await prepare_volcano(s,s.devices(),'live:',source)==(set(),False)
 s.update(device['device_id'],device['management_key'],None,Preferences(volcanoes=['506'],prefectures=['13']).model_dump())
 with s.db() as db:assert db.execute('select state from delivery').fetchone()[0]=='cancelled'
