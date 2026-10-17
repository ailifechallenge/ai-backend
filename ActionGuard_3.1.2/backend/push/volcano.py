import json,hashlib,time
from backend.adapters.volcano import Volcano
async def prepare_volcano(store,devices,prefix,source=None):
    selected={c for d in devices for c in json.loads(d['preferences']).get('volcanoes',[])}
    if not selected:return set(),True
    try:snap=await (source or Volcano()).current()
    except Exception:return set(),False
    from backend.adapters.seismic import timestamp
    checked=timestamp(snap.get('checked_at'))
    if not checked or not -30<=time.time()-checked.timestamp()<=120:return set(),False
    current={v['code']:v for v in snap['volcanoes']};valid=set()
    for d in devices:
        prefs=json.loads(d['preferences']);scope=hashlib.sha256(json.dumps(prefs,sort_keys=True).encode()).hexdigest()
        for code in prefs.get('volcanoes',[]):
            row=current.get(code)
            if not row:continue # disappearance is never an all-clear
            signature=hashlib.sha256(json.dumps({k:row[k] for k in ('code','kind_code','issued_at')},sort_keys=True).encode()).hexdigest()
            key=prefix+scope+':volcano:'+signature;valid.add(key)
            payload={'title':'일본 분화 경보 · '+row['name'],'body':row['official_name']+' · 공식 규제 구역과 지자체 안내를 확인하세요.','data':{'kind':'volcano','event':code,'issued_at':row['issued_at']}}
            store.enqueue(d['id'],key,payload,time.time()+600)
    return valid,True
