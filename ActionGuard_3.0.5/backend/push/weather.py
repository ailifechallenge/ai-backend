"""Subscription-scoped official weather snapshots. No model-generated alert decisions."""
import asyncio
import hashlib
import json
import os
import re
import time
from datetime import datetime, timezone
import httpx
from backend.adapters.jma import JMA, KINDS, parse as parse_jma
from backend.adapters.nws import parse as parse_nws
from backend.adapters.seismic import timestamp
from backend.core.cache import Cache
from backend.core.region_labels import japanese_region

HAZARDS = {'rain':'호우', 'flood':'홍수', 'wind':'강풍', 'storm':'뇌우·토네이도',
           'snow':'눈·눈보라', 'heat':'폭염', 'cold':'한파·서리', 'coastal':'파랑·해일',
           'landslide':'산사태', 'fire':'산불 위험', 'fog':'안개', 'other':'기타 기상경보'}
STATES=set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC AS GU MP PR VI'.split())
JP_HAZARDS={**dict.fromkeys(['33','43','03','10'],'rain'),**dict.fromkeys(['34','44','04','18'],'flood'),
 **dict.fromkeys(['35','05','15'],'wind'),**dict.fromkeys(['32','36','02','06','12','13','17','25','26'],'snow'),
 **dict.fromkeys(['37','38','48','07','08','16','19'],'coastal'),**dict.fromkeys(['39','49','09','29'],'landslide'),
 '14':'storm','20':'fog','21':'fire','22':'snow','23':'cold','24':'cold'}
SEVERITY={'Unknown':0,'Minor':1,'Moderate':2,'Severe':3,'Extreme':4}
LABELS={'current':'현재 유효한 경보','new':'새 경보','escalated':'경보 격상','changed':'중요 내용 변경','cleared':'공식 해제','expired':'유효시간 종료'}

def nws_hazard(event):
    s=event.lower()
    for words,hazard in [(['tsunami'],'coastal'),(['tornado','thunderstorm'],'storm'),(['flood'],'flood'),
        (['rain'],'rain'),(['heat'],'heat'),(['cold','freeze','frost','wind chill'],'cold'),
        (['snow','blizzard','winter','ice','avalanche'],'snow'),(['fire','red flag'],'fire'),
        (['surf','wave','coastal','storm surge','rip current'],'coastal'),
        (['wind','hurricane','typhoon','tropical storm'],'wind'),(['fog'],'fog')]:
        if any(w in s for w in words):return hazard
    return 'other'

def rank(event,severity):
    # Watch -> Warning is a level change even when CAP severity is unchanged.
    label=event.lower()
    stage=3 if 'warning' in label else 2 if 'watch' in label else 1
    return [stage,SEVERITY.get(severity,0)]

def signature(value):return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False).encode()).hexdigest()

def significant(row):
    return {k:row.get(k) for k in ('event','severity','area','effective','onset','ends','expires','instruction','description','geometry','level','status')}

class Weather:
    def __init__(self,client=None):self.client=client;self.cache=Cache(ttl=60,limit=200);self.jma=JMA(client)
    async def get(self,path,params=None):
        # Paths are constructed here, never supplied by notification payloads.
        if self.client:r=await self.client.get('https://api.weather.gov'+path,params=params,headers={'User-Agent':os.getenv('NWS_USER_AGENT','ActionGuardTravel/2.9 (regional alert pilot)'),'Accept':'application/geo+json'})
        else:
            async with httpx.AsyncClient(timeout=20) as c:r=await c.get('https://api.weather.gov'+path,params=params,headers={'User-Agent':os.getenv('NWS_USER_AGENT','ActionGuardTravel/2.9 (regional alert pilot)'),'Accept':'application/geo+json'})
        r.raise_for_status();return r.json()
    async def areas(self,country,region):
        key=('areas',country,region);hit=self.cache.get(key)
        if hit is not None:return hit
        if country=='US':
            if region not in STATES:raise ValueError('Invalid state')
            rows=[]
            for kind in ('county','forecast'):
                data=await self.get('/zones/'+kind,{'area':region})
                if not isinstance(data.get('features'),list) or data.get('pagination',{}).get('next'):raise ValueError('Incomplete zones')
                for f in data['features']:
                    p=f['properties'];code=p['id']
                    if re.fullmatch(r'[A-Z]{2}[CZ]\d{3}',code):rows.append({'code':code,'name':p['name'],'type':kind})
        else:
            areas=await self.jma._get('https://www.jma.go.jp/bosai/common/const/area.json')
            if region not in areas.get('offices',{}):raise ValueError('Invalid office')
            def office(parent):
                # Codes can repeat at different hierarchy levels (including self-parent codes).
                level15=areas.get('class15s',{}).get(parent,{})
                level10=areas.get('class10s',{}).get(level15.get('parent'),{})
                return level10.get('parent')
            rows=[{'code':code,'name':p['name'],'type':'city',**japanese_region(code,p['name'],p.get('enName',''))} for code,p in areas.get('class20s',{}).items() if office(p['parent'])==region]
        if not rows:raise ValueError('No selectable regions')
        return self.cache.put(key,{'areas':sorted(rows,key=lambda x:x['name'])})
    async def snapshot(self,scope):
        key=('snapshot',scope);hit=self.cache.get(key)
        if hit is not None:return hit
        country,region,area=scope.split(':')
        allowed=await self.areas(country,region)
        if area not in {r['code'] for r in allowed['areas']}:raise ValueError('Area is not in selected region')
        if country=='US':result=await self.us(area)
        else:result=await self.jp(region,area)
        result['area_name']=next(r['name'] for r in allowed['areas'] if r['code']==area)
        if country=='JP':
            for row in result['rows'].values():row['area']=result['area_name']
        return self.cache.put(key,result)
    async def us(self,zone):
        features=[];params={'zone':zone,'limit':500};path='/alerts'
        for _ in range(10):
            data=await self.get(path,params)
            if not isinstance(data.get('features'),list):raise ValueError('Incomplete NWS alerts')
            features.extend(data['features'])
            nxt=data.get('pagination',{}).get('next')
            if not nxt:break
            # Pagination links cannot redirect requests outside the fixed official host.
            from urllib.parse import urlsplit,parse_qs
            u=urlsplit(nxt)
            if u.scheme!='https' or u.netloc!='api.weather.gov' or u.path!='/alerts':raise ValueError('Unsafe pagination')
            q=parse_qs(u.query)
            if 'zone[0]' in q:
                if 'zone' in q:raise ValueError('Ambiguous pagination scope')
                q['zone']=q.pop('zone[0]')
            if 'zone' in q and q['zone']!=[zone]:raise ValueError('Pagination scope changed')
            if set(q)-{'zone','limit','cursor'}:raise ValueError('Unexpected pagination filter')
            params={**{k:v[0] for k,v in q.items()},'zone':zone}
        else:raise ValueError('Truncated NWS history')
        checked=datetime.now(timezone.utc).isoformat();rows={};aliases={}
        for f in sorted(features,key=lambda x:x.get('properties',{}).get('sent') or ''):
            p=f.get('properties') or {}
            if p.get('status')!='Actual':continue
            if zone not in (p.get('geocode') or {}).get('UGC',[]):continue
            if p.get('messageType') not in ('Alert','Update','Cancel'):raise ValueError('Unknown NWS message type')
            sent=timestamp(p.get('sent'))
            if not sent or sent.timestamp()>time.time()+30:raise ValueError('Invalid NWS time')
            alerts=parse_nws({'features':[f]},checked)
            if not alerts:raise ValueError('Missing NWS alert')
            a=alerts[0];refs=p.get('references') or []
            roots={aliases[r.get('identifier')] for r in refs if isinstance(r,dict) and r.get('identifier') in aliases}
            # VTEC tracking also links upgrades that don't retain a previous message ID.
            vtecs=(p.get('parameters') or {}).get('VTEC',[])
            tracks=[]
            for v in vtecs:
                m=re.search(r'/[A-Z]\.([A-Z]{3})\.([A-Z0-9]{4})\.([A-Z]{2})\.[A-Z]\.([0-9]{4})\.([0-9]{2})',v)
                if m:tracks.append(':'.join(m.group(i) for i in (2,3,4,5)))
            identity=sorted(roots)[0] if roots else ('vtec:'+':'.join(sorted(tracks)) if tracks else a.id)
            aliases[a.id]=identity
            if p.get('id'):aliases[p['id']]=identity
            for old in roots:rows.pop(old,None)
            row=a.model_dump();row.update(description=p.get('description') or '',hazard=nws_hazard(a.event),level=rank(a.event,a.severity),status='cleared' if p['messageType']=='Cancel' else 'active')
            if not timestamp(row['expires']):raise ValueError('Missing NWS expiration')
            rows[identity]=row
        return {'checked_at':checked,'rows':rows,'country':'US'}
    async def jp(self,office,city):
        data=await self.jma._get(f'https://www.jma.go.jp/bosai/warning/data/r8/{office}.json')
        # Reuse the strict public adapter to reject unknown codes/status/schema.
        parse_jma(office,data,{},datetime.now(timezone.utc).isoformat())
        reports=[]
        for report in data:
            if report.get('infoType') not in ('発表','訂正') or report.get('isTest'):raise ValueError('Non-operational JMA report')
            for item in report['warning']['class20Items']:
                if item['areaCode']==city:reports.append((report['reportDatetime'],item['kinds']))
        if not reports:raise ValueError('Selected city missing; cannot infer clearance')
        when,kinds=max(reports,key=lambda x:timestamp(x[0]));rows={}
        if not timestamp(when) or timestamp(when).timestamp()>time.time()+30:raise ValueError('Invalid JMA report time')
        for k in kinds:
            code=k.get('code');status=k['status']
            if status in ('解除','発表警報・注意報はなし'):continue
            event,japanese,severity=KINDS[code];hazard=JP_HAZARDS[code]
            row={'id':f'jma:{office}:{city}:{code}', 'event':japanese,'severity':severity,'hazard':hazard,
                'level':[5 if 'Emergency' in event else 4 if 'Danger' in event else 3 if 'Warning' in event else 2],'status':'active','sent':when,'area':city,'source':'https://www.jma.go.jp/bosai/map.html?area_type=japan',
                'effective':None,'onset':None,'ends':None,'expires':None,'instruction':'','description':'','geometry':None}
            if hazard not in rows or row['level']>rows[hazard]['level']:rows[hazard]=row
        return {'checked_at':datetime.now(timezone.utc).isoformat(),'reported_at':when,'rows':rows,'country':'JP'}

class WeatherChanges:
    def __init__(self,store,source=None):self.store=store;self.source=source or Weather()
    async def prepare(self,devices,prefix,renew=None):
        from backend.push.worker import device_scope
        scopes={s for d in devices for s in json.loads(d['preferences']).get('weather_regions',[])}
        snapshots={};failures=[]
        # Fetch each selected region only once; failure in one region does not clear another.
        for scope in sorted(scopes):
            if renew and not renew():raise RuntimeError('Worker lease lost')
            try:
                snap=await self.source.snapshot(scope);checked=timestamp(snap.get('checked_at'))
                if not checked or not -30<=time.time()-checked.timestamp()<=120:raise ValueError('Stale weather snapshot')
                snapshots[scope]=snap
            except Exception:failures.append(scope)
        if renew and not renew():raise RuntimeError('Worker lease lost')
        valid=set();oldest=time.time()
        for device in devices:
            prefs=json.loads(device['preferences']);selected=prefs.get('weather_hazards',[])
            for scope in prefs.get('weather_regions',[]):
                if scope not in snapshots:continue
                snap=snapshots[scope];oldest=min(oldest,timestamp(snap['checked_at']).timestamp())
                base=device_scope(device,prefix)+'weather:'+scope
                previous=self.store.get_meta(base)
                if previous and snap.get('reported_at') and timestamp(snap['reported_at'])<timestamp(previous['reported_at']):
                    failures.append(scope);continue
                current={k:v for k,v in snap['rows'].items() if v['hazard'] in selected}
                before=previous['rows'] if previous else {}
                for identity in set(current)|set(before):
                    row=current.get(identity);old=before.get(identity);change=None
                    if row:
                        if row['status']=='cleared':
                            if old and old['status']=='active':change='cleared'
                        elif row.get('expires') and timestamp(row['expires']).timestamp()<=time.time():
                            row={**row,'status':'expired'};current[identity]=row
                            if old and old['status']=='active':change='expired'
                        elif not old or old['status']!='active':change='current' if previous is None else 'new'
                        elif row['level']>old['level']:change='escalated'
                        elif significant(row)!=significant(old):change='changed'
                    elif old:
                        if snap['country']=='JP':row={**old,'status':'cleared','sent':snap['reported_at']};change='cleared' if old['status']=='active' else None;current[identity]=row
                        elif old.get('expires') and timestamp(old['expires']).timestamp()<=time.time():
                            row={**old,'status':'expired'};change='expired' if old['status']=='active' else None;current[identity]=row
                        else:
                            # Absence from an API list is not an official all-clear.
                            current[identity]=old;continue
                    if not row:continue
                    if not old and row['status']!='active':
                        current.pop(identity,None);continue
                    version=signature(significant(row))
                    # Include original issue time only on new state, not routine continuation.
                    event_key=base+':'+signature({'identity':identity,'version':version,'sent':row.get('sent')})
                    if change:
                        country,region,area=scope.split(':');issued=snap['checked_at']
                        payload={'title':f"{LABELS[change]} · {HAZARDS[row['hazard']]}",
                            'body':f"등록한 {snap.get('area_name',area)} 지역의 공식 상태를 확인하세요. {'유효시간 종료는 공식 해제와 다릅니다. ' if change=='expired' else ''}최신 내용을 확인하세요.",
                            'data':{'kind':'weather','country':country,'region':region,'area':area,'hazard':row['hazard'],'change':change,'event':row['id'],'issued_at':issued}}
                        self.store.enqueue(device['id'],event_key,payload,time.time()+600)
                        row={**row,'notice_key':event_key};current[identity]=row
                    elif old and old.get('notice_key'):
                        row={**row,'notice_key':old['notice_key']};current[identity]=row
                    if row.get('notice_key'):valid.add(row['notice_key'])
                self.store.set_meta(base,{**snap,'rows':current})
        self.store.set_meta('weather_health',{'checked_at':datetime.now(timezone.utc).isoformat(),'regions':len(scopes),'failed_regions':len(set(failures))})
        return valid,oldest,set(snapshots)-set(failures)
