import type { Lodging, Origin, Snapshot } from './types';
import { distance, timestamp } from './types';
export const SNAPSHOT_KEY = 'actionguard.f4.snapshot.v1';
const LODGING_KEY = 'actionguard.f4.lodging.v1';
export function validOrigin(p: unknown): p is Origin {
  const x = p as Origin | null;
  return !!x && Number.isFinite(x.lat) && Number.isFinite(x.lon) && Math.abs(x.lat) <= 90 && Math.abs(x.lon) <= 180;
}
export function readLodging(): Lodging | null {
  try {
    const v = JSON.parse(localStorage.getItem(LODGING_KEY) || 'null');
    return validOrigin(v) && typeof (v as Lodging).name === 'string' ? v as Lodging : null;
  } catch { return null; }
}
export function saveLodging(v: Lodging) { localStorage.setItem(LODGING_KEY, JSON.stringify(v)); }
export function deleteLodging() { localStorage.removeItem(LODGING_KEY); }
export function readSnapshot(): Snapshot | null {
  try {
    const v = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || 'null');
    if (!v || v.version !== 1 || !validOrigin(v.result?.origin) || !Array.isArray(v.result.shelters)
      || !Number.isFinite(Date.parse(v.saved_at)) || !Number.isFinite(Date.parse(v.result.checked_at))
      || typeof v.origin_label !== 'string' || !Number.isFinite(v.result.radius_km)
      || v.result.shelters.length > 10000
      || !v.result.shelters.every((s: unknown) => {
        const row = s as Record<string, unknown>;
        return validOrigin(s) && ['id','name','address','direction','checked_at','source','pets','wheelchair_accessible'].every(k => typeof row[k] === 'string')
          && Number.isFinite(row.distance_m) && Number.isFinite(row.bearing_deg) && ['open','planned','registered'].includes(String(row.status));
      }) || !v.result.shelters.some((s: {id: string}) => s.id === v.selected_id)) return null;
    if (v.route) {
      const r = v.route;
      if (r.shelter_id !== v.selected_id || !validOrigin(r.origin) || r.origin.lat !== v.result.origin.lat || r.origin.lon !== v.result.origin.lon
        || !Number.isFinite(r.distance_m) || !Number.isFinite(r.duration_s) || !Number.isFinite(Date.parse(r.checked_at))
        || !Array.isArray(r.coordinates) || r.coordinates.length < 2 || r.coordinates.length > 100000
        || !r.coordinates.every((p: number[]) => Array.isArray(p) && p.length === 2 && validOrigin({lat:p[1],lon:p[0]}))
        || !Array.isArray(r.steps) || !r.steps.every((s: {instruction: string; distance_m: number}) => typeof s.instruction === 'string' && Number.isFinite(s.distance_m))) return null;
    }
    // Migrate saved v1 records from the earlier single-feed format in place.
    v.result.disaster ||= 'hurricane'; v.result.sources ||= [v.result.source]; v.result.warnings ||= [];
    for (const shelter of v.result.shelters) {
      shelter.shelter_type ||= 'other'; shelter.type_label ||= '공식 데이터 유형 확인 필요';
      shelter.incident_name ??= null; shelter.status_label ||= '저장 당시 공식 목록 표기';
      shelter.role_label ||= shelter.status === 'planned' ? '허리케인 대피 접수센터' : '공식 운영 중 대피소';
      if (shelter.shelter_type === 'evacuation_center' && /school|college|campus|university|j\.?h\.?s|p\.?s\.?\s*\d|m\.?s\.?\s*\d|\bhs\b/i.test(shelter.name)) {
        shelter.shelter_type = 'school'; shelter.type_label = '학교·교육시설';
      }
    }
    return v;
  } catch { return null; }
}
export function saveSnapshot(v: Snapshot) { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(v)); }
export function deleteSnapshot() { localStorage.removeItem(SNAPSHOT_KEY); }
export const escapeHtml = (s: unknown) => String(s).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]!));

// Local equirectangular projection. No tile/network requests, north up.
export function sketch(snapshot: Snapshot): string {
  const { result, route, selected_id } = snapshot;
  const center = result.origin;
  const project = ([lon, lat]: number[]) => [(((lon - center.lon + 540) % 360) - 180) * Math.cos(center.lat * Math.PI / 180), lat - center.lat];
  const rows = result.shelters.map(s => ({ s, p: project([s.lon, s.lat]) }));
  const path = route?.coordinates.map(project) || [];
  const points = [[0, 0], ...rows.map(x => x.p), ...path];
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const scale = Math.min(560 / Math.max(xmax - xmin, .001), 340 / Math.max(ymax - ymin, .001));
  const px = ([x, y]: number[]) => [320 + (x - (xmin + xmax) / 2) * scale, 220 - (y - (ymin + ymax) / 2) * scale];
  const [ox, oy] = px([0, 0]);
  const colors: Record<string,string> = {school:'#2563eb',assembly:'#0e7490',safe_room:'#7c3aed',community:'#16805d',religious:'#b45309',temporary:'#ea7a18',lodging:'#be185d',camp:'#a16207',warehouse:'#475569',evacuation_center:'#ea7a18',other:'#64748b'};
  const metersPerPixel = 111195.08 / scale;
  const magnitude = 10 ** Math.floor(Math.log10(metersPerPixel * 100));
  const barMeters = [1,2,5,10].map(v=>v*magnitude).filter(v=>v<=metersPerPixel*100).pop() || magnitude;
  const barWidth = barMeters / metersPerPixel;
  const scaleBar = `<g><rect x="10" y="363" width="150" height="44" rx="4" fill="white"/><path d="M18 382v8h${barWidth}v-8" fill="none" stroke="#173b30" stroke-width="2"/><text x="18" y="377" fill="#173b30" font-size="11">약 ${distance(barMeters)}</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" role="img" aria-label="저장된 대피소와 경로 약도: 위쪽이 북쪽"><rect width="640" height="440" rx="12" fill="#eef4ef"/><text x="590" y="32" fill="#214d3d">↑ 북</text>${path.length ? `<polyline points="${path.map(p => px(p).join(',')).join(' ')}" fill="none" stroke="#2563eb" stroke-width="4"/>` : ''}${rows.map(({s, p}, i) => { const [x, y] = px(p); return `<g><title>${escapeHtml(s.name)} · ${escapeHtml(s.type_label)}</title><circle cx="${x}" cy="${y}" r="${s.id === selected_id ? 12 : 8}" fill="${colors[s.shelter_type] || colors.other}"/><text x="${x + 14}" y="${y + 5}" font-size="13" fill="#173c2d">${i + 1}</text></g>`; }).join('')}<circle cx="${ox}" cy="${oy}" r="8" fill="#2265cc" stroke="white" stroke-width="3"/><text x="${ox + 12}" y="${oy - 12}" font-size="12" fill="#214d3d">출발지</text>${scaleBar}<text x="18" y="420" fill="#4c6255" font-size="12">도로 배경 없는 약도 · 저장된 정보 · 현장 안전 미검증</text></svg>`;
}
export function offlineHtml(v: Snapshot): string {
  const s = v.result.shelters.find(x => x.id === v.selected_id)!;
  return `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ActionGuard 저장된 대피소 안내</title><style>body{font:16px/1.8 system-ui,sans-serif;max-width:850px;margin:32px auto;padding:20px;color:#243331}h1{line-height:1.4}.notice{padding:16px;background:#fff2dc;border-radius:8px}svg{width:100%}a{color:#126d55}li{margin:10px 0}small{color:#52665a}dt{font-weight:bold}</style><h1>ActionGuard · 저장된 대피소 안내</h1><div class="notice">저장본입니다. 현재 운영 여부·입소 가능 여부는 확인되지 않았습니다. 경로는 재난·침수·통제를 반영하지 않습니다. 현지 당국 지시를 확인하세요.</div><p>저장: ${escapeHtml(timestamp(v.saved_at))}<br>공식 데이터 조회: ${escapeHtml(timestamp(v.result.checked_at))}<br>출발지: ${escapeHtml(v.origin_label)} (${v.result.origin.lat}, ${v.result.origin.lon})</p><h2>${escapeHtml(s.name)}</h2><p>국가: ${v.result.country === 'JP' ? '일본' : '미국'}<br>지정 재난: ${escapeHtml((s.supported_hazards || []).join(' · ') || '자료 없음 · 적합 여부 확인 필요')}<br>참고: ${escapeHtml(s.remarks || '없음')}</p><p>${escapeHtml(s.address)}<br>건물 유형: ${escapeHtml(s.type_label)}<br>대피 역할: ${escapeHtml(s.role_label || (s.status === 'planned' ? '허리케인 대피 접수센터' : '공식 대피 시설'))}<br>상태 표기: ${escapeHtml(s.status_label)}<br>좌표: ${s.lat}, ${s.lon}<br>직선거리 ${distance(s.distance_m)} · ${s.direction}쪽 (${s.bearing_deg}°)</p>${v.route ? `<p>도보 경로 ${distance(v.route.distance_m)} · 약 ${Math.ceil(v.route.duration_s / 60)}분<br>경로 조회: ${escapeHtml(timestamp(v.route.checked_at))}</p>` : '<p>도보 경로 저장 없음. 직선거리는 실제 도보 거리가 아닙니다.</p>'}${sketch(v)}${v.route ? `<h2>저장된 도보 안내</h2><ol>${v.route.steps.map(s => `<li>${escapeHtml(s.instruction)} · ${distance(s.distance_m)}</li>`).join('')}</ol>` : ''}<h2>주변 대피 관련 시설</h2><ol>${v.result.shelters.map(s => `<li>${escapeHtml(s.name)} · ${escapeHtml(s.type_label)} · ${escapeHtml(s.status_label)} · ${escapeHtml(s.address)} · 직선 ${distance(s.distance_m)} · ${s.direction}</li>`).join('')}</ol><p>대피소 출처: ${v.result.country === 'JP' ? '<a href="https://www.gsi.go.jp/bousaichiri/hinanbasho.html">일본 국토지리원·시정촌</a> · 긴급대피장소는 재난별 지정 장소, 일반 피난소는 일시 체류 시설입니다. 현재 개방·최신 상태는 해당 시정촌에 확인하세요.' : '<a href="https://gis.fema.gov/arcgis/rest/services/NSS/FEMA_NSS/MapServer/0">FEMA</a> · 뉴욕 허리케인 접수센터는 현장 개방 여부 확인이 필요합니다.'}<br>경로: FOSSGIS / OSRM · © OpenStreetMap contributors (ODbL)</p><small>이 파일은 인터넷 없이 열 수 있습니다. 외부 링크를 방문하려면 인터넷이 필요합니다. 위치 정보가 포함되므로 공유에 주의하세요.</small></html>`;
}
export function downloadSnapshot(v: Snapshot) {
  const url = URL.createObjectURL(new Blob([offlineHtml(v)], { type: 'text/html;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'ActionGuard-shelter-offline.html'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
