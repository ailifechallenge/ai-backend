"""Foot profile on the FOSSGIS OSRM server (worldwide).
The 'driving' path token is OSRM's protocol placeholder. routed-foot selects
its actual walking graph. Never use the car demo server as a fallback.
"""
import asyncio
import math
import time
import httpx
from fastapi import HTTPException
from backend.core.cache import Cache
from backend.models.shelters import Origin, WalkingRoute, RouteStep
from backend.adapters.shelters import now, distance_bearing

BASE = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving'
MODIFIERS = {'left': '왼쪽으로', 'right': '오른쪽으로', 'slight left': '완만하게 왼쪽으로', 'slight right': '완만하게 오른쪽으로', 'sharp left': '크게 왼쪽으로', 'sharp right': '크게 오른쪽으로', 'straight': '직진', 'uturn': '되돌아'}


def instruction(step):
    m = step.get('maneuver') or {}
    kind, modifier = m.get('type'), m.get('modifier')
    if kind == 'depart':
        action = '출발'
    elif kind == 'arrive':
        action = '목적지 부근 도착'
    elif kind in {'roundabout', 'rotary', 'roundabout turn', 'exit roundabout', 'exit rotary'}:
        action = '회전교차로 이동' + (f" · {m['exit']}번 출구" if m.get('exit') else '')
    elif kind in {'turn', 'end of road', 'fork', 'merge', 'on ramp', 'off ramp', 'continue', 'new name', 'notification'}:
        action = MODIFIERS.get(modifier, '경로를 따라 이동')
    else:
        action = '경로를 따라 이동'
    name = str(step.get('name') or '').strip()
    return action + (f' · {name}' if name else '')


def parse(payload, origin, shelter):
    if not isinstance(payload, dict):
        raise ValueError('routing response')
    if payload.get('code') in {'NoRoute', 'NoSegment'}:
        raise HTTPException(404, '이 위치에서 연결되는 경로를 찾지 못했습니다. 직선거리만 확인할 수 있습니다.')
    if payload.get('code') != 'Ok' or not isinstance(payload.get('routes'), list) or not payload['routes']:
        raise ValueError('routing response')
    valid, failures = [], []
    for candidate in payload['routes'][:10]:
        try:
            valid.append(parse_candidate(candidate, origin, shelter))
        except (ValueError, KeyError, TypeError, AttributeError, IndexError, HTTPException) as exc:
            failures.append(exc)
    if not valid:
        raise failures[0]
    # Efficiency means minimum returned walking time, breaking ties by distance.
    best = min(valid, key=lambda r:(r.duration_s, r.distance_m))
    best.alternatives_evaluated = len(valid)
    return best


def parse_candidate(route, origin, shelter):
    coords = route['geometry']['coordinates']
    distance, duration = float(route['distance']), float(route['duration'])
    if not all(math.isfinite(n) and n >= 0 for n in (distance, duration)) or not isinstance(coords, list) or not 2 <= len(coords) <= 100000:
        raise ValueError('routing geometry')
    for point in coords:
        if not isinstance(point, list) or len(point) != 2 or not all(isinstance(n, (float, int)) and math.isfinite(n) for n in point) or not (-180 <= point[0] <= 180 and -90 <= point[1] <= 90):
            raise ValueError('routing point')
    # An engine can snap to a very distant road. Do not silently route there.
    for point, target in [(coords[0], origin), (coords[-1], shelter)]:
        if distance_bearing(target.lat, target.lon, point[1], point[0])[0] > 250:
            raise HTTPException(422, '출발지 또는 대피소에서 도로망까지 250m 이상 떨어져 경로를 표시하지 않습니다.')
    steps = []
    for leg in route.get('legs', []):
        for s in leg.get('steps', []):
            d = float(s.get('distance', 0))
            if not math.isfinite(d) or d < 0:
                raise ValueError('routing step')
            shape=(s.get('geometry') or {}).get('coordinates',[])
            if not isinstance(shape,list) or any(not isinstance(p,list) or len(p)!=2 or not all(isinstance(v,(int,float)) and math.isfinite(v) for v in p) or abs(p[0])>180 or abs(p[1])>90 for p in shape):
                raise ValueError('step geometry')
            steps.append(RouteStep(instruction=instruction(s), distance_m=d, coordinates=shape))
    return WalkingRoute(shelter_id=shelter.id, origin=origin, distance_m=distance, duration_s=duration, coordinates=coords, steps=steps, checked_at=now())


class Walking:
    def __init__(self, client=None):
        self.client = client
        self.cache = Cache(ttl=600, limit=64)
        self.lock = asyncio.Lock()
        self.last_call = 0.0

    async def route(self, origin, shelter, mode='WALK'):
        if mode not in {'WALK','DRIVE'}:raise HTTPException(422,'이동 수단을 확인하십시오.')
        limit=50000 if mode=='WALK' else 500000
        if distance_bearing(origin.lat, origin.lon, shelter.lat, shelter.lon)[0] > limit:
            raise HTTPException(422, '도보는 50km, 자동차는 500km 이내의 경로만 지원합니다.')
        key = (mode, origin.lat, origin.lon, shelter.id, shelter.lat, shelter.lon)
        async with self.lock:
            cached = self.cache.get(key)
            if cached is not None:
                return cached
            # Process-wide single instance; comply with the public server's 1 request/s.
            delay = 1.05 - (time.monotonic() - self.last_call)
            if delay > 0:
                await asyncio.sleep(delay)
            self.last_call = time.monotonic()
            base=BASE if mode=='WALK' else BASE.replace('routed-foot','routed-car')
            url = f'{base}/{origin.lon},{origin.lat};{shelter.lon},{shelter.lat}'
            try:
                async def fetch(c):
                    return await c.get(url, params={'overview': 'full', 'geometries': 'geojson', 'steps': 'true', 'alternatives': 'true', 'radiuses': '250;250'}, headers={'User-Agent': 'ActionGuardTravel/2.7 (US-JP route planner)', 'Accept': 'application/json'})
                if self.client:
                    r = await fetch(self.client)
                else:
                    async with httpx.AsyncClient(timeout=25) as c:
                        r = await fetch(c)
                if r.status_code == 400 and r.json().get('code') in {'NoRoute', 'NoSegment'}:
                    raise HTTPException(404, '이 이동 수단으로 연결되는 경로가 없습니다. 지도에서 출발지·도착지의 접근 가능한 입구를 확인하십시오.')
                r.raise_for_status()
                result = parse(r.json(), origin, shelter)
                result.routing_criterion='반환된 후보 중 예상시간 최소, 동률이면 거리 최소'
                result.note='일반 경로이며 재난·통제·실시간 교통과 현장 안전을 반영하지 않습니다.'
            except httpx.TimeoutException:
                raise HTTPException(504, '경로 조회 시간이 초과되었습니다. 잠시 후 다시 조회하십시오.') from None
            except (httpx.HTTPError, ValueError, KeyError, TypeError, AttributeError, IndexError):
                raise HTTPException(502, '경로 서비스를 사용할 수 없습니다. 직선거리를 실제 이동 거리로 대체하지 않습니다.') from None
            return self.cache.put(key, result)
