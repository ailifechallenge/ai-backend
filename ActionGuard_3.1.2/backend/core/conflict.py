"""Point/stay overlap only. No route safety or evacuation decision."""
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from pathlib import Path
import json
US_ZONES=frozenset(json.loads((Path(__file__).resolve().parents[2]/'data/us-timezones.json').read_text()))
from fastapi import HTTPException
from backend.models.contracts import Conflict


def instant(value):
    try:
        d=datetime.fromisoformat(value.replace('Z','+00:00'))
        return d.astimezone(timezone.utc) if d.tzinfo else None
    except (ValueError, AttributeError):
        return None


def stay_interval(stay):
    try:

        if stay.timezone not in (US_ZONES if stay.country=='US' else {'Asia/Tokyo'}):
            raise ValueError('Country/timezone mismatch')
        zone=ZoneInfo(stay.timezone)
        dates=[]
        for value in (stay.start,stay.end):
            local=datetime.fromisoformat(value)
            if local.tzinfo is not None: raise ValueError('Use local wall time')
            candidates=set()
            for fold in (0,1):
                utc=local.replace(tzinfo=zone,fold=fold).astimezone(timezone.utc)
                if utc.astimezone(zone).replace(tzinfo=None)==local: candidates.add(utc)
            if len(candidates)!=1:
                raise ValueError('Ambiguous/nonexistent DST time')
            dates.append(candidates.pop())
        if dates[1]<=dates[0]: raise ValueError('Order')
        if (stay.latitude is None)!=(stay.longitude is None): raise ValueError('Point pair')
        return dates
    except (ValueError, ZoneInfoNotFoundError):
        raise HTTPException(422,'장소의 시간대와 시작·종료를 확인하세요. 서머타임 전환으로 없거나 두 번 나타나는 시각은 다른 시각을 선택하세요.') from None


def polygon_contains(geometry, lat, lon):
    """Validated linear lon/lat polygons. Unsupported geometry returns unknown.
    Antimeridian and polar geometry are deliberately not approximated.
    """
    if not geometry or lat is None or lon is None: return None
    try:
        typ=geometry['type']; coords=geometry['coordinates']
        polygons=[coords] if typ=='Polygon' else coords if typ=='MultiPolygon' else []
        if not polygons: return None
        checks=[]
        for polygon in polygons:
            if not polygon: return None
            rings=[]
            for ring in polygon:
                if len(ring)<4 or ring[0]!=ring[-1]: return None
                inside=False; boundary=False
                for a,b in zip(ring,ring[1:]):
                    x1,y1=a[:2];x2,y2=b[:2]
                    if not all(isinstance(v,(int,float)) for v in (x1,y1,x2,y2)):return None
                    if not (-180<=x1<=180 and -180<=x2<=180 and -85<y1<85 and -85<y2<85) or abs(x2-x1)>180:return None
                    cross=(lon-x1)*(y2-y1)-(lat-y1)*(x2-x1)
                    if abs(cross)<1e-10 and min(x1,x2)<=lon<=max(x1,x2) and min(y1,y2)<=lat<=max(y1,y2): boundary=True
                    if (y1>lat)!=(y2>lat) and lon<(x2-x1)*(lat-y1)/(y2-y1)+x1:inside=not inside
                rings.append((inside,boundary))
            if any(boundary for _,boundary in rings):return None
            checks.append(rings[0][0] and not any(v[0] for v in rings[1:]))
        return any(checks)
    except (KeyError,TypeError,ValueError,IndexError,OverflowError):return None


def conflict(stay, alert=None, *, now=None, point_membership=False):
    begin,end=stay_interval(stay)
    now=now or datetime.now(timezone.utc)
    def result(status,reasons,spatial='미확인',temporal='미확인'):
        return Conflict(status=status,reasons=reasons,spatial=spatial,temporal=temporal,
            checked_at=now.isoformat(),source=alert.source if alert else None,
            interval_utc=[begin.isoformat(),end.isoformat()])
    if not alert:return result('판정 불가',['공식 경보를 선택해야 위치·시간을 대조할 수 있습니다. 붙여넣은 문자만으로 적용 범위를 추측하지 않습니다.'])
    if ('JP' if alert.id.startswith('jma:') else 'US')!=stay.country:return result('판정 불가',['경보 국가와 일정 국가가 다릅니다.'])
    checked=instant(alert.checked_at)
    if not checked or now-checked>timedelta(minutes=15) or checked-now>timedelta(minutes=1):
        return result('판정 불가',['경보 조회 정보가 오래됐거나 확인 시각이 잘못됐습니다. 공식 경보를 다시 조회하세요.'])
    if alert.message_type=='Cancel':return result('해제',['공식 취소 메시지입니다. 다른 경보의 해제를 의미하지는 않습니다.'])
    expires=instant(alert.expires)
    if expires and expires<=now:return result('메시지 만료',['메시지 유효기간이 지났습니다. 재난 종료나 안전을 뜻하지 않으므로 최신 경보를 조회하세요.'])
    start,finish=instant(alert.onset),instant(alert.ends)
    if start and finish and finish<=start:return result('판정 불가',['경보의 시작·종료 정보가 서로 맞지 않습니다.'])
    temporal='겹침' if start and finish and begin<finish and end>start else '미확인'
    if (start and end<=start) or (finish and begin>=finish): temporal='겹치지 않음'
    spatial='미확인'
    inside=polygon_contains(alert.geometry,stay.latitude,stay.longitude)
    if inside is not None:spatial='경계 안' if inside else '경계 밖'
    elif stay.country=='JP' and stay.municipality and stay.municipality in alert.area.split('、'):spatial='시정촌 일치'
    elif point_membership:spatial='공식 좌표 조회에 포함'
    reasons=[f'장소: {spatial}.',f'체류 시간과 경보 시작·종료: {temporal}.']
    if spatial=='경계 밖' or temporal=='겹치지 않음':
        return result('현재 확인된 겹침 없음',reasons+['선택한 경보와 일정 한 건의 비교이며 안전이나 다른 경보의 부재를 뜻하지 않습니다.'],spatial,temporal)
    if spatial=='경계 안' and temporal=='겹침':return result('겹침 확인',reasons,spatial,temporal)
    if spatial in ('경계 안','시정촌 일치','공식 좌표 조회에 포함'):return result('겹칠 가능성',reasons+['정확한 적용 경계 또는 시작·종료 시각을 모두 확인하지 못했습니다.'],spatial,temporal)
    return result('판정 불가',reasons+['장소 좌표와 공식 적용 경계를 확인할 수 없습니다.'],spatial,temporal)
