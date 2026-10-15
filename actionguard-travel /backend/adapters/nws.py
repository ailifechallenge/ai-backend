import os, asyncio
from datetime import datetime, timezone
import httpx
from fastapi import HTTPException
from backend.models.contracts import Alert, Alerts
from backend.core.cache import Cache


def now():
    return datetime.now(timezone.utc).isoformat()


def parse(payload, checked):
    if not isinstance(payload, dict) or not isinstance(payload.get("features"), list):
        raise ValueError("features")
    out = {}
    for f in payload["features"]:
        p = f.get("properties") or {}
        id = f.get("id") or p.get("id")
        if not id or not p:
            continue
        url = (
            id
            if str(id).startswith("https://api.weather.gov/alerts/")
            else "https://www.weather.gov/"
        )
        fields = {
            "Alert": p.get("headline") or p.get("event"),
            "Event": p.get("event"),
            "Area": p.get("areaDesc"),
            "Issued": p.get("sent"),
            "Effective": p.get("effective"),
            "Onset": p.get("onset"),
            "Ends": p.get("ends"),
            "Message expires": p.get("expires"),
            "Details": p.get("description"),
            "Official instruction": p.get("instruction"),
        }
        text = "\n".join(f"{k}: {v}" for k, v in fields.items() if v)
        out[id] = Alert(
            id=id,
            geometry=f.get("geometry"),
            message_type=p.get("messageType"),
            event=p.get("event") or "Unknown",
            headline=p.get("headline") or p.get("event") or "경보",
            area=p.get("areaDesc") or "",
            severity=p.get("severity") or "Unknown",
            sender=p.get("senderName") or "NWS",
            sent=p.get("sent"),
            effective=p.get("effective"),
            expires=p.get("expires"),
            onset=p.get("onset"),
            ends=p.get("ends"),
            instruction=p.get("instruction") or "",
            source=url,
            text=text,
            checked_at=checked,
        )
    return list(out.values())


class NWS:
    def __init__(self, client=None):
        self.client = client
        self.cache = Cache()
        self.records = Cache(ttl=900, limit=2000)
        self.lock = asyncio.Lock()

    async def alerts(self, params):
        key = tuple(sorted(params.items()))
        async with self.lock:
            hit = self.cache.get(key)
            if hit is not None:
                return hit
            try:

                async def call(c):
                    return await c.get(
                        "https://api.weather.gov/alerts/active",
                        params=params,
                        headers={
                            "User-Agent": os.getenv(
                                "NWS_USER_AGENT",
                                "ActionGuardTravel/2.0 (local prototype)",
                            ),
                            "Accept": "application/geo+json",
                        },
                    )

                if self.client:
                    r = await call(self.client)
                else:
                    async with httpx.AsyncClient(timeout=20) as c:
                        r = await call(c)
                r.raise_for_status()
                checked = now()
                rows = parse(r.json(), checked)
            except httpx.TimeoutException:
                raise HTTPException(504, "NWS 조회 시간이 초과되었습니다.") from None
            except (httpx.HTTPError, ValueError, TypeError, AttributeError):
                raise HTTPException(
                    502, "NWS 경보를 가져오지 못했습니다. 잠시 후 재조회하세요."
                ) from None
            for a in rows:
                self.records.put(a.id, a)
            return self.cache.put(key, Alerts(alerts=rows, checked_at=checked))

    def linked(self, request):
        if not request.alert_id:
            return None
        a = self.records.get(request.alert_id)
        if not a or a.text != request.text:
            raise HTTPException(
                409,
                "공식 경보 연결이 만료되었거나 원문이 변경되었습니다. 다시 조회하세요.",
            )
        return a
