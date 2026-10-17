"""Current JMA volcano warning snapshot. Old issuance dates may still be in force."""
import asyncio
from datetime import datetime,timezone
import httpx
from fastapi import HTTPException
from backend.core.cache import Cache
BASE='https://www.jma.go.jp/bosai/volcano/'
SOURCE='https://www.jma.go.jp/bosai/map.html#contents=volcano'
ACTIONS={1:'활화산임에 유의하고 현지 출입 규제를 확인하세요.',2:'화구 주변의 규제 구역에 접근하지 마세요.',3:'입산 규제 구역에 들어가지 말고 지자체 안내를 확인하세요.',4:'위험한 거주 지역의 고령자 등은 대피하고 다른 주민은 준비하세요.',5:'위험한 거주 지역에서는 지자체 지시에 따라 대피하세요.'}
def parse_volcano(reports,catalog):
    if not isinstance(reports,list) or not isinstance(catalog,list) or not catalog:raise ValueError('Volcano schema')
    names={str(v['code']):v for v in catalog};rows={}
    for r in reports:
        issued=r['reportDatetime'];d=datetime.fromisoformat(issued)
        if not d.tzinfo:raise ValueError('Volcano time')
        code=str(r['eventId'])
        if code not in names:raise ValueError('Unknown volcano')
        target=next((i for i in r['volcanoInfos'] if i['type']=='噴火警報・予報（対象火山）'),None)
        if not target or len(target['items'])!=1:raise ValueError('Volcano target')
        item=target['items'][0];kind=str(item['code']);level=int(kind[1]) if kind in {'11','12','13','14','15'} else None
        if kind not in {'11','12','13','14','15','21','22','23','35','36'}:raise ValueError('Unknown volcano kind')
        cities=[a['name'] for i in r['volcanoInfos'] if i['type']=='噴火警報・予報（対象市町村等）' for x in i['items'] for a in x['areas']]
        meta=names[code];point=meta.get('latlon',[])
        row={'code':code,'name':meta['name_jp'],'name_en':meta.get('name_en',''),'level':level,'kind_code':kind,'official_name':item['name'],'issued_at':issued,'municipalities':cities,'area_codes':r.get('areas',[]),'lat':float(point[0]) if len(point)==2 else None,'lon':float(point[1]) if len(point)==2 else None,'action':ACTIONS.get(level,'이 화산은 숫자 레벨로 환산하지 않아요. 공식 경계 범위·출입 규제를 확인하세요.'),'source_url':SOURCE}
        if code not in rows or d>datetime.fromisoformat(rows[code]['issued_at']):rows[code]=row
    return sorted(rows.values(),key=lambda v:(-(v['level'] or 0),v['code']))
class Volcano:
    def __init__(self,client=None):self.client=client;self.cache=Cache(ttl=60,limit=2);self.lock=asyncio.Lock()
    async def current(self):
        async with self.lock:
            hit=self.cache.get('current')
            if hit is not None:return hit
            async def fetch(client):
                a,b=await asyncio.gather(client.get(BASE+'data/warning.json'),client.get(BASE+'const/volcano_list.json'))
                a.raise_for_status();b.raise_for_status();return parse_volcano(a.json(),b.json())
            try:
                if self.client:rows=await fetch(self.client)
                else:
                    async with httpx.AsyncClient(timeout=20) as client:rows=await fetch(client)
                return self.cache.put('current',{'volcanoes':rows,'checked_at':datetime.now(timezone.utc).isoformat(),'source_url':SOURCE,'note':'일본 전국의 현재 발표 목록입니다. 내 위치 적용 여부와 다릅니다. 레벨 1도 안전을 보장하지 않습니다.'})
            except (httpx.HTTPError,ValueError,KeyError,TypeError,IndexError,StopIteration):raise HTTPException(502,'현재 분화 경보를 확인하지 못했어요. 경보가 없거나 해제됐다는 뜻이 아닙니다.') from None
