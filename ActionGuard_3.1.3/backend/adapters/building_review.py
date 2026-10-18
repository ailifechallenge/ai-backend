"""Optional Google web search via SerpApi. It classifies buildings, not safety.

Only identical names AND street addresses in .gov/.edu organic results can
enrich a type. Unresolved or adverse matches are held out of navigation.
Reviewed exclusions require a sourced local registry entry; absence from a
Google search is never evidence that a shelter is unsafe.
"""
import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode, urlsplit
import httpx
from backend.core.cache import Cache
from backend.adapters.facility_types import categorize, normalized, LABELS

REGISTRY = Path(__file__).resolve().parents[2] / 'data' / 'facility_reviews.json'

def search_url(row):
    return 'https://www.google.com/search?' + urlencode({'q': f'"{row.name}" "{row.address}"'})

def trusted_source(url):
    parsed = urlsplit(str(url or ''))
    return parsed.scheme == 'https' and bool(parsed.hostname) and parsed.hostname.endswith(('.gov', '.edu'))

def match_result(row, payload):
    """Return (type, evidence URL); never classify from a different building."""
    if not isinstance(payload, dict) or payload.get('error'):
        return None
    results = payload.get('organic_results') or []
    if not isinstance(results, list):
        return None
    name, street = normalized(row.name), normalized(row.address.split(',')[0])
    if not name or not street:
        return None
    for result in results:
        if not isinstance(result, dict) or not trusted_source(result.get('link')):
            continue
        text = normalized(str(result.get('title') or '') + ' ' + str(result.get('snippet') or ''))
        if name not in text or street not in text:
            continue
        if any(x in text for x in ('permanently closed', 'demolished', 'no longer an evacuation center', 'not an evacuation center')):
            return ('hold', result['link'])
        title = normalized(result.get('title'))
        kind, _ = categorize(title) if name in title else ('other', '')
        if kind == 'other':
            # Require an explicit identity statement; a nearby school mentioned
            # elsewhere on the page must not turn this building into a school.
            statements = [name + ' is a ', name + ' is an ', name + ' is the ']
            statement = next((x for x in statements if x in text), None)
            if not statement:
                continue
            description = text.split(statement, 1)[1].split(' at ', 1)[0]
            kind, _ = categorize(description)
        if kind != 'other':
            return kind, result['link']
    return None

class BuildingReview:
    def __init__(self, client=None, key=None, registry=None):
        self.client = client
        self.key = os.getenv('SERPAPI_API_KEY', '').strip() if key is None else key
        self.cache = Cache(ttl=600, limit=1000)
        self.semaphore = asyncio.Semaphore(3)
        self.day = None
        self.calls = 0
        if registry is not None:
            self.registry = registry
        else:
            self.registry = json.loads(REGISTRY.read_text(encoding='utf-8'))

    async def lookup(self, row):
        cache_key = (row.id, row.name, row.address)
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached or None
        async with self.semaphore:
            today = datetime.now(timezone.utc).date()
            if self.day != today:
                self.day, self.calls = today, 0
            if not self.key or self.calls >= 40:
                return None
            self.calls += 1
            try:
                params = {'engine':'google', 'q':f'"{row.name}" "{row.address}"', 'num':5, 'hl':'en', 'gl':'us', 'api_key':self.key}
                async def fetch(client):
                    response = await client.get('https://serpapi.com/search.json', params=params)
                    response.raise_for_status()
                    return match_result(row, response.json())
                if self.client:
                    result = await fetch(self.client)
                else:
                    async with httpx.AsyncClient(timeout=8) as client:
                        result = await fetch(client)
            except (httpx.HTTPError, ValueError, TypeError, ImportError):
                result = None
            self.cache.put(cache_key, result or False)
            return result

    async def review(self, rows):
        kept, pending, excluded, unresolved = [], [], 0, []
        for row in rows:
            override = self.registry.get(row.id)
            if override and normalized(override.get('name')) == normalized(row.name) and normalized(override.get('street')) == normalized(row.address.split(',')[0]) and trusted_source(override.get('source')):
                if override.get('excluded') is True and override.get('reason') and override.get('reviewed_at'):
                    excluded += 1
                    continue
                kind = override.get('type')
                if kind in LABELS and kind != 'other':
                    row.shelter_type, row.type_label = kind, LABELS[kind]
                    row.classification_source = override['source']
            if row.shelter_type == 'other':
                unresolved.append(row)
            else:
                kept.append(row)
        # At most six lookups per request and forty per process/day, no retries.
        candidates = unresolved[:6] if self.key else []
        findings = await asyncio.gather(*(self.lookup(row) for row in candidates))
        for i, row in enumerate(unresolved):
            finding = findings[i] if i < len(findings) else None
            if finding and finding[0] in LABELS and finding[0] != 'other':
                row.shelter_type, row.type_label = finding[0], LABELS[finding[0]]
                row.classification_source = finding[1]
                kept.append(row)
            else:
                if not finding:
                    # Building type is not proof of shelter operation or suitability.
                    # Retain the official record even if its building type is unknown.
                    kept.append(row)
                pending.append({'name':row.name, 'address':row.address, 'google_search_url':search_url(row)})
        return kept, pending, excluded
