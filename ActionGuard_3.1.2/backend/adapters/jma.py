import asyncio
import hashlib
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException

from backend.core.cache import Cache
from backend.core.region_labels import japanese_region
from backend.models.contracts import Alert, Alerts

BASE = "https://www.jma.go.jp/bosai"
MAP_URL = "https://www.jma.go.jp/bosai/map.html?area_type=japan"

# JMA's current warning codes and labels introduced with its 2026 system.
KINDS = {
    "32": ("Snowstorm Emergency Warning", "暴風雪特別警報", "Extreme"),
    "33": ("Heavy Rain Emergency Warning", "大雨特別警報", "Extreme"),
    "34": ("Flood Emergency Warning", "氾濫特別警報", "Extreme"),
    "35": ("Storm Emergency Warning", "暴風特別警報", "Extreme"),
    "36": ("Heavy Snow Emergency Warning", "大雪特別警報", "Extreme"),
    "37": ("High Wave Emergency Warning", "波浪特別警報", "Extreme"),
    "38": ("Storm Surge Emergency Warning", "高潮特別警報", "Extreme"),
    "39": ("Landslide Emergency Warning", "土砂災害特別警報", "Extreme"),
    "43": ("Heavy Rain Danger Warning", "大雨危険警報", "Extreme"),
    "44": ("Flood Danger Warning", "氾濫危険警報", "Extreme"),
    "48": ("Storm Surge Danger Warning", "高潮危険警報", "Extreme"),
    "49": ("Landslide Danger Warning", "土砂災害危険警報", "Extreme"),
    "03": ("Heavy Rain Warning", "大雨警報", "Severe"),
    "04": ("Flood Warning", "氾濫警報", "Severe"),
    "05": ("High Wind Warning", "暴風警報", "Severe"),
    "06": ("Heavy Snow Warning", "大雪警報", "Severe"),
    "07": ("High Wave Warning", "波浪警報", "Severe"),
    "08": ("Storm Surge Warning", "高潮警報", "Severe"),
    "09": ("Landslide Warning", "土砂災害警報", "Severe"),
    "10": ("Heavy Rain Advisory", "大雨注意報", "Moderate"),
    "12": ("Snow Advisory", "大雪注意報", "Moderate"),
    "13": ("Snowstorm Advisory", "風雪注意報", "Moderate"),
    "14": ("Thunderstorm Advisory", "雷注意報", "Moderate"),
    "15": ("Wind Advisory", "強風注意報", "Moderate"),
    "16": ("High Wave Advisory", "波浪注意報", "Moderate"),
    "17": ("Snowmelt Advisory", "融雪注意報", "Moderate"),
    "18": ("Flood Advisory", "氾濫注意報", "Moderate"),
    "19": ("Storm Surge Advisory", "高潮注意報", "Moderate"),
    "20": ("Dense Fog Advisory", "濃霧注意報", "Minor"),
    "21": ("Dry Air Advisory", "乾燥注意報", "Minor"),
    "22": ("Avalanche Advisory", "なだれ注意報", "Minor"),
    "23": ("Low Temperature Advisory", "低温注意報", "Minor"),
    "24": ("Frost Advisory", "霜注意報", "Minor"),
    "25": ("Ice Accretion Advisory", "着氷注意報", "Minor"),
    "26": ("Heavy Snow Accretion Advisory", "着雪注意報", "Minor"),
    "29": ("Landslide Advisory", "土砂災害注意報", "Moderate"),
    "02": ("Snowstorm Warning", "暴風雪警報", "Severe"),
}


def now():
    return datetime.now(timezone.utc).isoformat()


def active(status):
    return bool(status) and status not in {"解除", "発表警報・注意報はなし"}


def parse(office, reports, areas, checked):
    """Convert JMA's area-by-kind status reports to the shared alert contract."""
    if not isinstance(reports, list) or not reports:
        raise ValueError("JMA reports missing; cannot conclude no active warnings")
    class20s = areas.get("class20s", {})
    latest = {}
    area_snapshots = {}
    for report in reports:
        when = report.get("reportDatetime") or ""
        warning = report.get("warning") or {}
        items = warning.get("class20Items")
        if not when or not isinstance(items, list):
            raise ValueError("JMA report schema changed")
        for item in items:
            area_code = str(item.get("areaCode", ""))
            kinds = item.get("kinds")
            if not area_code or not isinstance(kinds, list):
                raise ValueError("JMA area schema changed")
            stamp = datetime.fromisoformat(when.replace("Z", "+00:00"))
            if stamp.tzinfo is None:
                raise ValueError("JMA report timezone missing")
            if area_code not in area_snapshots or stamp >= area_snapshots[area_code][0]:
                area_snapshots[area_code] = (stamp, when, kinds)
    for area_code, (_, when, kinds) in area_snapshots.items():
        for kind in kinds:
            status = kind.get("status", "")
            if status in {"解除", "発表警報・注意報はなし"} and not kind.get("code"):
                continue
            code = str(kind.get("code", ""))
            if status not in {"発表", "継続", "解除", "発表警報・注意報はなし"} or code not in KINDS:
                raise ValueError("Unknown JMA warning; do not silently discard")
            latest[(area_code, code)] = (when, status)

    groups = {}
    for (area_code, code), (when, status) in latest.items():
        if not active(status):
            continue
        meta = class20s.get(area_code, {})
        name = meta.get("name") or area_code
        groups.setdefault(code, []).append((name, when, status))

    checked_at = checked or now()
    alerts = []
    for code, rows in groups.items():
        english, japanese, severity = KINDS[code]
        rows.sort(key=lambda row: row[0])
        names = [row[0] for row in rows]
        area_summary = "、".join(names[:4])
        if len(names) > 4:
            area_summary += f" 외 {len(names) - 4}개 시정촌"
        latest_time = max((row[1] for row in rows), key=lambda value: datetime.fromisoformat(value.replace("Z", "+00:00"))) or None
        status = sorted({row[2] for row in rows if row[2]})
        headline = f"{japanese} · {area_summary}"
        text = (
            f"気象庁 発表: {japanese}（{english}）\n"
            f"対象地域: {'、'.join(names)}\n"
            f"状況: {'、'.join(status)}\n"
            f"最新の発表時刻（警報開始時刻ではありません）: {latest_time or '記載なし'}\n"
            + "\n".join(f"{name}: 発表 {when} / {state}" for name, when, state in rows) + "\n"
            "開始時刻・終了時刻: このデータには記載なし。\n"
            "公式の個別行動指示はこの警報データに含まれていません。"
        )
        alerts.append(Alert(
            id=f"jma:{office}:{code}:{hashlib.sha256(text.encode()).hexdigest()[:12]}", event=f"{english} / {japanese}",
            headline=headline, area="、".join(names), severity=severity,
            sender="JMA · 気象庁", sent=latest_time, effective=None,
            expires=None, instruction="", source=MAP_URL, text=text,
            checked_at=checked_at,
        ))
    return alerts


class JMA:
    def __init__(self, client=None):
        self.client = client
        self.cache = Cache(ttl=3600, limit=2)
        self.alert_cache = Cache(ttl=120, limit=100)
        self.records = Cache(ttl=900, limit=2000)
        self.lock = asyncio.Lock()

    async def _get(self, url):
        if self.client:
            response = await self.client.get(url, headers={"Accept": "application/json"})
            response.raise_for_status()
            return response.json()
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(url, headers={"Accept": "application/json"})
            response.raise_for_status()
            return response.json()

    async def areas(self):
        async with self.lock:
            hit = self.cache.get("areas")
            if hit is not None:
                return hit
            try:
                data = await self._get(f"{BASE}/common/const/area.json")
                offices = data.get("offices", {})
                rows = [
                    {"code": code, "name": item.get("name", code), **japanese_region(code,item.get("name",code),item.get("enName",""))}
                    for code, item in offices.items()
                ]
                rows.sort(key=lambda row: int(row["code"]))
                if not rows:
                    raise ValueError("offices")
                payload = {"areas": rows, "checked_at": now()}
                return self.cache.put("areas", payload)
            except httpx.TimeoutException:
                raise HTTPException(504, "일본 기상청 지역 정보를 가져오는 시간이 초과되었습니다.") from None
            except (httpx.HTTPError, ValueError, TypeError, AttributeError):
                raise HTTPException(502, "일본 기상청 지역 정보를 가져오지 못했습니다.") from None

    async def alerts(self, office):
        key = str(office)
        async with self.lock:
            hit = self.alert_cache.get(key)
            if hit is not None:
                return hit
            try:
                areas = self.cache.get("area-data")
                if areas is None:
                    areas = await self._get(f"{BASE}/common/const/area.json")
                    self.cache.put("area-data", areas)
                if key not in areas.get("offices", {}):
                    raise HTTPException(422, "일본 기상청 관할 지역 코드를 확인하세요.")
                reports = await self._get(f"{BASE}/warning/data/r8/{key}.json")
                if not isinstance(reports, list):
                    raise ValueError("reports")
                checked = now()
                rows = parse(key, reports, areas, checked)
            except HTTPException:
                raise
            except httpx.TimeoutException:
                raise HTTPException(504, "일본 기상청 경보 조회 시간이 초과되었습니다.") from None
            except (httpx.HTTPError, ValueError, TypeError, AttributeError):
                raise HTTPException(502, "일본 기상청 경보를 가져오지 못했습니다. 잠시 후 다시 조회하세요.") from None
            for alert in rows:
                self.records.put(alert.id, alert)
            return self.alert_cache.put(key, Alerts(alerts=rows, checked_at=checked))

    def linked(self, request):
        if not request.alert_id:
            return None
        alert = self.records.get(request.alert_id)
        if not request.alert_id.startswith("jma:"):
            return None
        if not alert or alert.text != request.text:
            raise HTTPException(409, "일본 기상청 경보 연결이 만료되었거나 원문이 변경되었습니다. 다시 조회하세요.")
        return alert
