"""JMA public earthquake observations and tsunami bulletins (not EEW delivery)."""
import asyncio
import math
import re
from datetime import datetime, timezone, timedelta
import httpx
from fastapi import HTTPException
from backend.core.cache import Cache

BASE = 'https://www.jma.go.jp/bosai/'
JST = timezone(timedelta(hours=9))
INTENSITIES = {'1','2','3','4','5-','5+','6-','6+','7'}
LEVELS = {'00':'none','50':'cleared','60':'cleared','51':'warning','52':'major','53':'major','62':'advisory','71':'forecast','72':'forecast','73':'forecast'}

def timestamp(value):
    if not isinstance(value, str): return None
    try:
        d = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return d if d.tzinfo else d.replace(tzinfo=JST)
    except ValueError: return None

def number(value):
    try:
        x = float(value)
        return x if math.isfinite(x) else None
    except (ValueError, TypeError): return None

def coordinates(value):
    m = re.fullmatch(r'([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)?/', str(value))
    if not m: return None
    lat, lon = float(m[1]), float(m[2])
    if not (-90 <= lat <= 90 and -180 <= lon <= 180): return None
    return {'lat':lat, 'lon':lon, 'depth_km':-float(m[3])/1000 if m[3] and float(m[3]) <= 0 else None}

def intensity(value): return value if value in INTENSITIES else None

def normal_detail(data):
    return data.get('Control', {}).get('Status') == '通常'

def latest_rows(rows):
    """Keep corrections/cancellations: never resurrect an older event bulletin."""
    result = {}
    for r in sorted(rows, key=lambda r:str(r.get('ctt', '')), reverse=True):
        filename = str(r.get('json',''))
        if '_K' in filename or not timestamp(r.get('rdt')): continue
        if not re.fullmatch(r'\d{14}_\d{14}_[A-Za-z0-9]+_\d+\.json', filename): continue
        result.setdefault(str(r.get('eid')), r)
    return list(result.values())

def quake_summary(r):
    return {'id':r['json'], 'event_id':r.get('eid'), 'issued_at':r.get('rdt'), 'occurred_at':r.get('at'),
            'place':r.get('anm') or '진앙 지역 미확인', 'place_en':r.get('en_anm'),
            'magnitude':number(r.get('mag')), 'max_intensity':intensity(r.get('maxi')),
            'epicenter':coordinates(r.get('cod')), 'cancelled':r.get('ift')=='取消', 'observations':[{'prefecture_code':str(p.get('code')),'intensity':intensity(p.get('maxi'))} for p in (r.get('int') or []) if isinstance(p,dict)]}

def parse_quake(data, filename):
    head, body = data['Head'], data.get('Body') or {}
    eq = body.get('Earthquake') or {}
    if isinstance(eq, list): eq = eq[0] if eq else {}
    area = (eq.get('Hypocenter') or {}).get('Area') or {}
    obs = (body.get('Intensity') or {}).get('Observation') or {}
    stations = []
    for pref in obs.get('Pref', []):
        for region in pref.get('Area', []):
            for city in region.get('City', []):
                for station in city.get('IntensityStation', []):
                    coord = station.get('latlon') or {}
                    lat, lon = number(coord.get('lat')), number(coord.get('lon'))
                    level = intensity(station.get('Int'))
                    if lat is not None and lon is not None and -90<=lat<=90 and -180<=lon<=180 and level:
                        stations.append({'id':str(station.get('Code')), 'name':station.get('Name'), 'city':city.get('Name'), 'lat':lat, 'lon':lon, 'intensity':level})
    return {'id':filename, 'event_id':head.get('EventID'), 'issued_at':head.get('ReportDateTime'),
            'occurred_at':eq.get('OriginTime'), 'place':area.get('Name') or '진앙 지역 미확인', 'place_en':area.get('enName'),
            'magnitude':number(eq.get('Magnitude')), 'max_intensity':intensity(obs.get('MaxInt')),
            'epicenter':coordinates(area.get('Coordinate')), 'stations':stations,
            'cancelled':head.get('InfoType')=='取消', 'source_url':BASE+'quake/data/'+filename,
            'tsunami_comment':((body.get('Comments') or {}).get('ForecastComment') or {}).get('Text')}

def parse_tsunami(data, filename, clear, now):
    head = data['Head']
    issued, valid = timestamp(head.get('ReportDateTime')), timestamp(head.get('ValidDateTime'))
    if head.get('ValidDateTime') and valid is None:raise ValueError('Invalid validity timestamp')
    cleared_at = timestamp(clear.get('w'))
    if not issued or not cleared_at: raise ValueError('Missing bulletin/current-state timestamp')
    current = normal_detail(data) and head.get('InfoType')!='取消' and issued > cleared_at and (valid is None or valid > now)
    regions = []
    forecast = ((data.get('Body') or {}).get('Tsunami') or {}).get('Forecast') or {}
    for item in forecast.get('Item', []):
        area, category = item.get('Area') or {}, item.get('Category') or {}
        code = str((category.get('Kind') or {}).get('Code', ''))
        first = item.get('FirstHeight') or {}
        maximum = item.get('MaxHeight') or {}
        regions.append({'code':str(area.get('Code')), 'name':area.get('Name'), 'name_en':area.get('enName'),
                        'level':LEVELS.get(code, 'unknown'), 'kind_code':code,
                        'height':maximum.get('TsunamiHeight'), 'height_description':maximum.get('Description'),
                        'arrival_at':first.get('ArrivalTime'), 'arrival_condition':first.get('Condition')})
    if current and not regions:raise ValueError('Current tsunami bulletin has no forecast regions')
    eq = (data.get('Body') or {}).get('Earthquake') or {}
    if isinstance(eq, list): eq = eq[0] if eq else {}
    area = (eq.get('Hypocenter') or {}).get('Area') or {}
    return {'id':filename, 'issued_at':head.get('ReportDateTime'), 'valid_until':head.get('ValidDateTime'),
            'current':current, 'cancelled':head.get('InfoType')=='取消', 'regions':regions,
            'epicenter':coordinates(area.get('Coordinate')), 'source_url':BASE+'tsunami/data/'+filename}

class Seismic:
    def __init__(self, client=None):
        self.client = client
        self.cache = Cache(ttl=30, limit=100)
        self.geometry_cache = Cache(ttl=86400, limit=1)
        self.lock = asyncio.Lock()

    async def get(self, path, expected):
        cache = self.geometry_cache if 'geojson/' in path else self.cache
        found = cache.get(path)
        if found is not None: return found
        async with self.lock:
            found = cache.get(path)
            if found is not None: return found
            try:
                if self.client:
                    response = await self.client.get(BASE+path)
                else:
                    async with httpx.AsyncClient(timeout=20) as client:
                        response = await client.get(BASE+path)
                response.raise_for_status()
                value = response.json()
                if not isinstance(value, expected): raise ValueError('shape')
                if expected is list and any(not isinstance(x,dict) for x in value): raise ValueError('row shape')
                return cache.put(path, value)
            except (httpx.HTTPError, ValueError, TypeError):
                raise HTTPException(502, '일본 기상청 정보를 확인하지 못했어요. 잠시 뒤 다시 확인하거나 공식 페이지를 열어 주세요.')

    async def earthquakes(self):
        rows = latest_rows(await self.get('quake/data/list.json', list))
        return {'events':[quake_summary(r) for r in rows if r.get('ift')!='取消'][:30], 'cancelled_events':[quake_summary(r) for r in rows if r.get('ift')=='取消'][:30], 'checked_at':datetime.now(timezone.utc).isoformat()}

    async def earthquake(self, filename):
        rows = latest_rows(await self.get('quake/data/list.json', list))
        row = next((r for r in rows if r['json']==filename), None)
        if not row: raise HTTPException(404, '정보가 갱신되었거나 제공 기간이 지났어요. 목록을 새로고침해 주세요.')
        data = await self.get('quake/data/'+filename, dict)
        try:
            if not normal_detail(data): raise ValueError('Not an actual observation')
            result = parse_quake(data, filename)
            if row.get('ift')=='取消' or result['cancelled']: raise HTTPException(410, '취소된 지진 발표입니다. 목록을 새로고침해 주세요.')
            return result
        except (KeyError, TypeError, ValueError, AttributeError): raise HTTPException(502, '지진 자료 형식을 확인하지 못했어요. 공식 정보를 확인해 주세요.')

    async def tsunami(self):
        rows, clear = await asyncio.gather(self.get('tsunami/data/list.json', list), self.get('tsunami/data/clearweb.json', dict))
        if not timestamp(clear.get('w')): raise HTTPException(502, '쓰나미 경보의 현재 상태를 확인하지 못했어요.')
        rows = sorted(latest_rows([r for r in rows if '_VTSE41_' in str(r.get('json',''))]), key=lambda r:r['ctt'], reverse=True)
        now = datetime.now(timezone.utc)
        bulletin = None
        if rows:
            r = rows[0]
            data = await self.get('tsunami/data/'+r['json'], dict)
            try:
                if not normal_detail(data): raise ValueError('Not normal bulletin')
                bulletin = parse_tsunami(data, r['json'], clear, now)
            except (KeyError, TypeError, ValueError, AttributeError): raise HTTPException(502, '쓰나미 자료 형식을 확인하지 못했어요. 공식 정보를 확인해 주세요.')
        return {'bulletin':bulletin, 'checked_at':now.isoformat(), 'clear_at':clear['w'],
                'status':'current' if bulletin and bulletin['current'] else 'no_current_bulletin'}

    async def coasts(self):
        data = await self.get('common/const/geojson/tsunami.json', dict)
        if data.get('type')!='FeatureCollection' or not isinstance(data.get('features'),list): raise HTTPException(502,'해안 지도를 불러오지 못했어요.')
        return data
