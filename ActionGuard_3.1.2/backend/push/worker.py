"""Run independently: python -m backend.push.worker --once (disabled by default)."""
import argparse
import asyncio
import hashlib
import json
import os
import time
from datetime import datetime,timezone
from backend.adapters.seismic import Seismic,timestamp
from backend.push.store import Store
from backend.push.providers import Sender,Outcome

RANK={s:i for i,s in enumerate(('1','2','3','4','5-','5+','6-','6+','7'))}

def mode():
    value=os.getenv('PUSH_MODE','disabled')
    if value not in ('disabled','dry_run','live'):raise ValueError('PUSH_MODE must be disabled, dry_run, or live')
    return value

def db_path():return os.getenv('PUSH_DATABASE',str(__import__('pathlib').Path(__file__).resolve().parents[1]/'var'/'push.sqlite3'))

def quake_match(event,prefs):
    threshold=RANK.get(prefs.get('minimum_intensity','3'),2)
    return 'earthquake' in prefs.get('seismic_hazards',['earthquake','tsunami']) and any(r.get('prefecture_code') in prefs['prefectures'] and RANK.get(r.get('intensity'),-1)>=threshold for r in event.get('observations',[]))

def tsunami_match(regions,prefs):return any(r['code'] in prefs['tsunami_regions'] for r in regions)

def device_scope(device,prefix):
    # Changing opt-in regions must not carry previous-region correction subscriptions forward.
    return prefix+hashlib.sha256(json.dumps(json.loads(device['preferences']),sort_keys=True).encode()).hexdigest()+':'

def coast_state(bulletin,current,prefs):
    if not bulletin or not current:return {'cause':None,'valid_until':None,'regions':[]}
    regions=sorted([r for r in bulletin['regions'] if 'tsunami' in prefs.get('seismic_hazards',['earthquake','tsunami']) and r['code'] in prefs['tsunami_regions']],key=lambda r:r['code'])
    return {'cause':bulletin['id'].split('_')[1] if len(bulletin['id'].split('_'))>1 else bulletin['id'],'valid_until':bulletin.get('valid_until'),'regions':regions}

def make_payload(kind,event,issued,cleared=False):
    return {'title':'쓰나미 정보 변경' if kind=='tsunami' else '일본 지진 관측 정보 갱신',
            'body':'선택한 해안의 발표가 변경되었습니다. 최신 공식 상태를 확인하세요.' if kind=='tsunami' else '선택한 관측 지역의 진도 기준에 해당하는 발표입니다. 진앙과 관측 진도를 확인하세요.',
            'data':{'kind':kind,'issued_at':issued,**({'event':event} if event else {})}}

class Worker:
    def __init__(self,store,seismic=None,sender=None,run_mode=None,weather=None):
        self.store=store;self.seismic=seismic or Seismic();self.sender=sender or Sender();self.mode=run_mode or mode()
        from backend.push.weather import WeatherChanges
        self.weather=WeatherChanges(store,weather)
    async def run_once(self):
        if self.mode=='disabled':return {'status':'disabled','accepted':0,'previewed':0}
        owner=self.store.start_run()
        if not owner:return {'status':'worker_busy','accepted':0,'previewed':0}
        try:return await self.scan(owner)
        except Exception:
            self.store.set_meta('worker_failure',{'at':datetime.now(timezone.utc).isoformat(),'reason':'source_or_worker_failed'})
            raise
        finally:self.store.end_run(owner)
    async def scan(self,owner):
        # If either source fails, preserve baseline and queue; do not announce all-clear or send stale jobs.
        active_devices=self.store.devices()
        need_seismic=not active_devices or any((lambda p: bool(p.get('prefectures') or p.get('tsunami_regions')))(json.loads(d['preferences'])) for d in active_devices)
        if need_seismic:quakes,tsunami=await asyncio.gather(self.seismic.earthquakes(),self.seismic.tsunami())
        else:
            stamp=datetime.now(timezone.utc).isoformat()
            quakes={'events':[],'checked_at':stamp};tsunami={'bulletin':None,'checked_at':stamp}
        now=time.time();checked=timestamp(tsunami.get('checked_at'))
        q_checked=timestamp(quakes.get('checked_at'))
        if not checked or not q_checked or any(now-d.timestamp()>120 or d.timestamp()-now>30 for d in (checked,q_checked)):raise ValueError('Official snapshot is stale')
        if not self.store.renew_run(owner):raise RuntimeError('Worker lease lost')
        self.store.cleanup()
        events=quakes['events']+quakes.get('cancelled_events',[]);prior=self.store.get_meta('quake_seen');seen=dict(prior or {})
        devices=self.store.devices();current_ids={e['id'] for e in events}
        bulletin=tsunami.get('bulletin');is_current=bool(bulletin and bulletin.get('current') and not bulletin.get('cancelled') and (not bulletin.get('valid_until') or timestamp(bulletin['valid_until']) and timestamp(bulletin['valid_until']).timestamp()>now))
        regions=bulletin['regions'] if is_current else []
        previous=self.store.get_meta('tsunami_snapshot')
        prefix='preview:' if self.mode=='dry_run' else 'live:'
        weather_keys,weather_checked,weather_scopes=await self.weather.prepare(devices,prefix,lambda:self.store.renew_run(owner))
        from backend.push.volcano import prepare_volcano
        volcano_keys,volcano_ok=await prepare_volcano(self.store,devices,prefix)
        for event in events:
            key=event.get('event_id') or event['id'];issued=timestamp(event.get('issued_at'))
            changed=prior is not None and seen.get(key)!=event['id']
            if changed and issued and 0<=now-issued.timestamp()<=900:
                for device in devices:
                    previous_notice=bool(seen.get(key) and self.store.previously_notified(device['id'],device_scope(device,prefix)+'quake:'+seen[key]))
                    if (not event.get('cancelled') and quake_match(event,json.loads(device['preferences']))) or previous_notice:
                        payload=make_payload('earthquake',event['id'],event['issued_at'])
                        if event.get('cancelled'):
                            payload['title']='일본 지진 발표 취소';payload['body']='이전에 알려드린 지진 발표가 취소되었습니다. 공식 정보를 확인하세요.'
                        elif previous_notice:payload['body']='이전에 알려드린 지진 정보가 갱신되었습니다. 최신 관측 발표를 확인하세요.'
                        self.store.enqueue(device['id'],device_scope(device,prefix)+'quake:'+event['id'],payload,min(now+600,issued.timestamp()+900))
            seen[key]=event['id']
        signatures={}
        for device in devices:
            prefs=json.loads(device['preferences'])
            state=coast_state(bulletin,is_current,prefs)
            before=coast_state(previous.get('bulletin'),previous.get('current'),prefs) if previous else None
            signature=hashlib.sha256(json.dumps(state,sort_keys=True).encode()).hexdigest()
            signatures[device['id']]=device_scope(device,prefix)+'tsunami:'+signature
            relevant=any(r['level'] in ('major','warning','advisory') for r in state['regions'])
            previously_relevant=before and any(r['level'] in ('major','warning','advisory') for r in before['regions'])
            if relevant or previously_relevant and before!=state:
                issued=bulletin.get('issued_at') if is_current else tsunami['checked_at']
                payload=make_payload('tsunami',bulletin['id'] if bulletin else None,issued)
                levels={'major':3,'warning':2,'advisory':1}
                was={r['code']:levels.get(r['level'],0) for r in (before or {}).get('regions',[])}
                after={r['code']:levels.get(r['level'],0) for r in state['regions']}
                clear_at=timestamp(tsunami.get('clear_at'))
                previous_issued=timestamp((previous or {}).get('bulletin',{}).get('issued_at')) if (previous or {}).get('bulletin') else None
                explicit_clear=bool(clear_at and previous_issued and clear_at>=previous_issued) or bool(state['regions'] and all(r['level'] in ('cleared','none','forecast') for r in state['regions']))
                expired=bool(bulletin and bulletin.get('valid_until') and timestamp(bulletin['valid_until']) and timestamp(bulletin['valid_until']).timestamp()<=now)
                change=('cleared' if explicit_clear else 'expired' if expired else 'changed') if not relevant else 'current' if before is None else 'new' if not previously_relevant else 'escalated' if any(v>was.get(k,0) for k,v in after.items()) else 'changed'
                payload['data']['change']=change
                payload['title']={'current':'현재 유효한 쓰나미 경보','new':'새 쓰나미 경보','escalated':'쓰나미 경보 격상','changed':'쓰나미 정보 변경 · 최신 상태 확인','expired':'쓰나미 발표 유효시간 종료 · 공식 상태 확인','cleared':'선택 해안의 쓰나미 경보 해제'}[change]
                if change=='cleared':payload['body']='선택한 해안의 경보·주의보가 해제된 공식 상태입니다. 다른 해안과 현지 당국 안내도 확인하세요.'
                self.store.enqueue(device['id'],signatures[device['id']],payload,now+600)
        if need_seismic:
            self.store.set_meta('quake_seen',{k:v for k,v in list(seen.items())[-300:]})
            self.store.set_meta('tsunami_snapshot',{'bulletin':bulletin,'current':is_current})
        counts={'accepted':0,'previewed':0,'expired':0,'failed':0,'pending':0,'cancelled':0}
        # The claim transaction gives each job one owner across overlapping worker processes.
        for _ in range(100):
            if time.time()-min(checked.timestamp(),q_checked.timestamp(),weather_checked)>120:break
            if not self.store.renew_run(owner):raise RuntimeError('Worker lease lost')
            item=self.store.claim()
            if not item:break
            payload=json.loads(item['payload']);kind=payload['data']['kind']
            if kind=='volcano' and not volcano_ok:
                self.store.defer(item,'volcano_source_unavailable');counts['pending']+=1;continue
            if kind=='weather':
                data=payload['data'];scope=':'.join(data[k] for k in ('country','region','area'))
                if scope not in weather_scopes:
                    self.store.defer(item,'weather_source_unavailable');counts['pending']+=1;continue
            valid=(item['event_key'] in volcano_keys if kind=='volcano' else item['event_key'] in weather_keys if kind=='weather' else item['event_key']==signatures.get(item['device_id']) if kind=='tsunami' else payload['data']['event'] in current_ids)
            if not valid:
                self.store.finish(item,'cancelled','official_state_changed');counts['cancelled']+=1;continue
            if self.mode=='dry_run':outcome=Outcome('previewed','dry_run_no_network_send')
            else:
                try:outcome=await asyncio.wait_for(self.sender.send({**item,'payload':payload}),timeout=30)
                except TimeoutError:outcome=Outcome('retry','provider_timeout')
            if outcome.state=='invalid':self.store.disable(item['device_id']);counts['cancelled']+=1;continue
            state=outcome.state
            if state=='retry':state='failed' if item['attempts']>=5 else 'pending'
            self.store.finish(item,state,outcome.reason,max(outcome.retry_after,min(3600,60*2**(item['attempts']-1))))
            counts[state]=counts.get(state,0)+1
        self.store.set_meta('worker_failure',None)
        self.store.set_meta('heartbeat',{'checked_at':min(checked,q_checked).isoformat(),'mode':self.mode})
        return {'status':self.mode,**counts}

async def main(args):
    store=Store(db_path())
    if args.enroll:
        print(store.enrollment(args.enroll));return
    worker=Worker(store)
    while True:
        failed=False
        try:print(json.dumps(await worker.run_once()))
        except Exception:
            failed=True;print(json.dumps({'status':'source_or_worker_failed','accepted':0}))
        if args.once:
            if failed:raise SystemExit(1)
            return
        await asyncio.sleep(60)

if __name__=='__main__':
    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(Path(__file__).resolve().parents[1]/'.env')
    p=argparse.ArgumentParser();p.add_argument('--once',action='store_true');p.add_argument('--enroll',choices=['apns','fcm']);asyncio.run(main(p.parse_args()))
