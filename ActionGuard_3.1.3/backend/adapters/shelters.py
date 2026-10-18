"""Official open shelter and NYC hurricane center feeds.
Selection, category and proximity are deterministic; no LLM decides safety.
"""
import asyncio
import math
from datetime import datetime, timezone
import httpx
from fastapi import HTTPException
from backend.core.cache import Cache
from backend.models.shelters import Origin, Shelter, ShelterSearch
from backend.adapters.facility_types import categorize
from backend.adapters.building_review import BuildingReview

LAYER = 'https://gis.fema.gov/arcgis/rest/services/NSS/FEMA_NSS/MapServer/0'
NYC_SOURCE = 'https://data.cityofnewyork.us/resource/p5md-weyf.geojson'
CATALOG_LAYER = LAYER.rsplit('/', 1)[0] + '/5'
FIELDS = 'shelter_id,shelter_name,address_1,city,state,zip,shelter_status_code,shelter_closed_date,latitude,longitude,wheelchair_accessible,pet_accommodations_desc,facility_type,subfacility_code,incident_name,objectid'
HAZARDS = {'general','hurricane', 'tornado', 'flood', 'wildfire'}
NYC_BOX = (-74.4, 40.4, -73.5, 41.0)


def in_us_coverage(origin):
    # Approximate coverage boxes, not an assertion of political boundaries.
    boxes = [(24, 50, -125, -66), (51, 72, -180, -129), (51, 72, 170, 180),
             (18, 23, -161, -154), (17, 19, -68, -64), (13, 21, 144, 146),
             (-15, -10, -172, -168)]
    return any(south <= origin.lat <= north and west <= origin.lon <= east
               for south, north, west, east in boxes)


def now():
    return datetime.now(timezone.utc).isoformat()


def distance_bearing(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    distance = 6371008.8 * 2 * math.atan2(math.sqrt(a), math.sqrt(max(0, 1 - a)))
    bearing = math.degrees(math.atan2(math.sin(dl) * math.cos(p2), math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl))) % 360
    direction = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'][int((bearing + 22.5) // 45) % 8]
    return round(distance, 1), round(bearing, 1), direction


def parse(payload, origin, radius_km, checked, include_registered=False):
    if not isinstance(payload, dict) or not isinstance(payload.get('features'), list) or payload.get('error'):
        raise ValueError('FEMA response schema')
    rows = {}
    for feature in payload['features']:
        try:
            p = {k.lower(): v for k, v in feature['attributes'].items()}
            raw_status = str(p.get('shelter_status_code') or '').strip().upper()
            is_open = raw_status in {'OPEN', 'OPN'} and p.get('shelter_closed_date') is None
            if not include_registered and not is_open:
                continue
            g = feature.get('geometry') or {}
            lat, lon = float(g.get('y', p.get('latitude'))), float(g.get('x', p.get('longitude')))
            if not math.isfinite(lat) or not math.isfinite(lon) or not (-90 <= lat <= 90 and -180 <= lon <= 180) or (lat == 0 and lon == 0):
                continue
            d, b, direction = distance_bearing(origin.lat, origin.lon, lat, lon)
            if d > radius_km * 1000:
                continue
            sid = p.get('shelter_id')
            if sid is None or not p.get('shelter_name'):
                continue
            sid = str(sid)
            if sid in rows:
                continue
            accessible = {'YES': '가능(출처 표기)', 'Y': '가능(출처 표기)', 'NO': '불가(출처 표기)', 'N': '불가(출처 표기)'}.get(str(p.get('wheelchair_accessible') or '').upper(), '확인되지 않음')
            category, label = categorize(p.get('facility_type'), p.get('subfacility_code'), p.get('shelter_name'))
            rows[sid] = Shelter(id=sid, name=p['shelter_name'], address=', '.join(str(p[k]) for k in ['address_1', 'city', 'state', 'zip'] if p.get(k)), lat=lat, lon=lon,
                status='open' if is_open else 'registered', navigable=is_open, operating_status=raw_status or 'UNKNOWN',
                status_label='FEMA 데이터상 현재 운영 중' if is_open else f'등록 이력 · {raw_status or "운영 미확인"} · 입소 목적지 제외', shelter_type=category, type_label=label, role_label='공식 운영 중 대피소' if is_open else 'FEMA 등록 위치(운영 중 아님)',
                distance_m=d, bearing_deg=b, direction=direction, wheelchair_accessible=accessible,
                pets=p.get('pet_accommodations_desc') or '확인되지 않음', source=CATALOG_LAYER if include_registered else LAYER, checked_at=checked,
                source_updated_at=None, incident_name=p.get('incident_name'))
        except (KeyError, TypeError, ValueError):
            continue
    return sorted(rows.values(), key=lambda s:(s.distance_m, s.shelter_type, s.id))


def parse_nyc(payload, origin, radius_km, checked):
    if not isinstance(payload, dict) or not isinstance(payload.get('features'), list):
        raise ValueError('NYC response schema')
    rows = {}
    for feature in payload['features']:
        try:
            p = feature.get('properties') or {}
            coords = (feature.get('geometry') or {}).get('coordinates')
            if not isinstance(coords, list) or len(coords) < 2:
                continue
            lon, lat = float(coords[0]), float(coords[1])
            if not math.isfinite(lat) or not math.isfinite(lon) or not (-90 <= lat <= 90 and -180 <= lon <= 180):
                continue
            d, b, direction = distance_bearing(origin.lat, origin.lon, lat, lon)
            if d > radius_km * 1000:
                continue
            name = p.get('bldg_name') or p.get('ec_name')
            if not name:
                continue
            sid = f"nyc-hurricane:{p.get('bin') or p.get('bbl') or name}"
            accessible = str(p.get('accessible') or '').upper()
            category, label = categorize(name)
            rows[sid] = Shelter(id=sid, name=name, address=', '.join(str(p[k]) for k in ['bldg_add', 'city', 'state', 'zip_code'] if p.get(k)), lat=lat, lon=lon,
                status='planned', status_label='현장 개방 확인 필요',
                shelter_type=category, type_label=label, role_label='허리케인 대피 접수센터',
                distance_m=d, bearing_deg=b, direction=direction,
                wheelchair_accessible={'Y':'가능(시설 자체 보고)','YES':'가능(시설 자체 보고)','N':'불가(시설 자체 보고)','NO':'불가(시설 자체 보고)'}.get(accessible, '확인되지 않음'),
                pets='확인되지 않음', source=NYC_SOURCE, checked_at=checked, source_updated_at=None,
                incident_name='허리케인·해안폭풍 전용', facility_kind='hurricane_intake', supported_hazards=['hurricane'], hazard_compatibility='designated')
        except (KeyError, TypeError, ValueError):
            continue
    return sorted(rows.values(), key=lambda s:(s.distance_m, s.shelter_type, s.id))


class Shelters:
    def __init__(self, client=None, reviewer=None):
        self.client = client
        self.reviewer = reviewer or BuildingReview(client,key='')
        self.cache = Cache(ttl=120, limit=128)
        self.records = Cache(ttl=600, limit=4000)
        self.lock = asyncio.Lock()

    @staticmethod
    def is_nyc(origin):
        xmin, ymin, xmax, ymax = NYC_BOX
        return xmin <= origin.lon <= xmax and ymin <= origin.lat <= ymax

    async def search(self, lat, lon, radius_km, disaster='hurricane', include_registered=False):
        if disaster not in HAZARDS:
            raise HTTPException(422, '지원하는 재난 유형을 선택하십시오.')
        origin = Origin(lat=lat, lon=lon)
        if not in_us_coverage(origin):
            raise HTTPException(422, '입력 좌표가 미국 자료 조회 범위 밖입니다. 뉴욕 예시: 위도 40.7580, 경도 -73.9855. 위도 4.758은 뉴욕이 아닙니다.')
        show_nyc = disaster in ('general','hurricane') and self.is_nyc(origin)
        key = (lat, lon, radius_km, disaster, include_registered)
        async with self.lock:
            cached = self.cache.get(key)
            if cached is not None:
                return cached
            params = dict(f='json', where='1=1', geometry=f'{lon},{lat}', geometryType='esriGeometryPoint', inSR=4326,
                spatialRel='esriSpatialRelIntersects', distance=radius_km * 1000, units='esriSRUnit_Meter',
                outFields=FIELDS, outSR=4326, returnGeometry='true', resultRecordCount=1000, orderByFields='objectid ASC')
            warnings, rows, truncated, errors, sources, timeouts = [], [], False, [], [], 0
            checked = now()
            fema_layer = CATALOG_LAYER if include_registered else LAYER
            async def fetch_fema(client):
                all_rows, offset = [], 0
                for _ in range(10):
                    r = await client.get(fema_layer + '/query', params={**params, 'resultOffset': offset}, headers={'User-Agent':'ActionGuardTravel/2.1 (shelter lookup)','Accept':'application/json'})
                    r.raise_for_status(); data = r.json()
                    if not isinstance(data, dict) or not isinstance(data.get('features'), list) or data.get('error'):
                        raise ValueError('FEMA response schema')
                    all_rows.extend(data['features'])
                    if not data.get('exceededTransferLimit'):
                        return {'features':all_rows}, False
                    if not data['features']:
                        raise ValueError('FEMA pagination did not advance')
                    offset += len(data['features'])
                return {'features':all_rows}, True
            async def fetch_nyc(client):
                r = await client.get(NYC_SOURCE, params={'$limit':'100','$order':'bldg_name'}, headers={'User-Agent':'ActionGuardTravel/2.1 (NYC shelter lookup)','Accept':'application/geo+json'})
                r.raise_for_status(); data = r.json()
                if isinstance(data, list):
                    # Some Socrata JSON settings return raw objects; geometry is WKT there.
                    feats=[]
                    for row in data:
                        geom=row.get('the_geom') or row.get('location')
                        if isinstance(geom,dict) and geom.get('coordinates'):
                            feats.append({'properties':row,'geometry':geom})
                    data={'features':feats}
                return data
            try:
                if self.client:
                    fema_payload, truncated = await fetch_fema(self.client)
                else:
                    async with httpx.AsyncClient(timeout=20) as c: fema_payload, truncated = await fetch_fema(c)
                rows.extend(parse(fema_payload, origin, radius_km, checked, include_registered))
                sources.append(fema_layer)
            except httpx.TimeoutException:
                timeouts += 1
                errors.append('FEMA 시설 조회 시간이 초과되었습니다.')
            except (httpx.HTTPError, ValueError, TypeError, AttributeError):
                errors.append('FEMA 시설 자료를 가져오지 못했습니다.')
            if show_nyc:
                try:
                    if self.client:
                        nyc_payload = await fetch_nyc(self.client)
                    else:
                        async with httpx.AsyncClient(timeout=20) as c: nyc_payload = await fetch_nyc(c)
                    centers=parse_nyc(nyc_payload, origin, radius_km, checked)
                    if disaster=='general':
                        centers=[s.model_copy(update={'id':'ref:'+s.id,'reference_only':True,'navigable':False,'hazard_compatibility':'unknown','status_label':'허리케인 지정 · 개방 미확인','remarks':'허리케인·해안폭풍 대비 지정 접수센터의 위치 참고자료입니다. 일반 대피소나 다른 재난에 적합한 시설로 확인된 것은 아닙니다.'}) for s in centers]
                    rows.extend(centers)
                    sources.append(NYC_SOURCE)
                except httpx.TimeoutException:
                    timeouts += 1
                    errors.append('NYC 허리케인 대피 접수센터 자료 조회 시간이 초과되었습니다.')
                except (httpx.HTTPError, ValueError, TypeError, AttributeError):
                    errors.append('NYC 허리케인 대피 접수센터 자료를 가져오지 못했습니다.')
            if len(errors) == (2 if show_nyc else 1):
                raise HTTPException(504 if timeouts == len(errors) else 502, ' · '.join(errors) + ' 다시 시도하십시오.')
            warnings.extend(errors)
            for row in rows:
                if not row.navigable: self.records.put(row.id, row)
            rows, pending, excluded = await self.reviewer.review(rows)
            rows.sort(key=lambda s:(s.distance_m, s.shelter_type, s.id))
            for row in rows:
                if row.navigable: self.records.put(row.id, row)
            note = '직선거리 순. FEMA의 운영 중 표시는 현장 입소 가능 여부를 보장하지 않습니다.'
            if include_registered:
                note += ' 등록 이력 레이어에는 CLOSED·FULL·운영 미확인 시설도 포함됩니다. 이 시설은 입소 목적지로 연결하지 않습니다.'
            if show_nyc:
                note += ' NYC 접수센터는 허리케인 전용이며 대피소로 이동을 연결하는 장소입니다. 현재 개방 여부를 NYC 공식 지침/311로 확인하십시오.'
                if disaster=='general':note += ' 일반 검색에서는 지정시설 참고자료로 함께 표시하며, 운영 중 일반 대피소나 즉시 이동 목적지로 연결하지 않습니다.'
            if disaster != 'hurricane' and not include_registered:
                note += ' FEMA 원본은 현재 열린 시설만 수록하며, 선택한 재난 유형에 대한 건물별 안전 인증을 뜻하지 않습니다.'
            result = ShelterSearch(origin=origin, radius_km=radius_km, disaster=disaster, shelters=rows, checked_at=checked,
                source=LAYER, sources=sources, warnings=warnings, truncated=truncated, note=note,
                pending_review=pending, excluded_count=excluded, building_search_enabled=bool(self.reviewer.key))
            return self.cache.put(key, result)

    def linked(self, shelter_id):
        row = self.records.get(shelter_id)
        if row is None or not row.navigable or row.status == 'registered':
            raise HTTPException(409, '대피소 조회 정보가 만료되었습니다. 공식 목록을 다시 조회한 뒤 선택하십시오.')
        return row
