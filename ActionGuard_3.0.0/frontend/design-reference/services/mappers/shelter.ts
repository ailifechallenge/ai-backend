import type { Shelter, ShelterSearchResult } from '@/types'

/** 백엔드 /api/shelters 응답 (backend/models/shelters.py) */
export interface ApiShelter {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  status: 'open' | 'planned' | 'registered'
  status_label: string
  shelter_type: string
  type_label: string
  role_label: string
  navigable: boolean
  hazard_compatibility: 'designated' | 'unknown'
  supported_hazards: string[]
  distance_m: number
  bearing_deg: number
  direction: string
  wheelchair_accessible: string
  pets: string
  remarks: string
  source: string
  checked_at: string
  source_updated_at: string | null
  operating_status: string | null
  incident_name: string | null
}

export interface ApiShelterSearch {
  country: string
  origin: { lat: number; lon: number }
  radius_km: number
  disaster: string
  shelters: ApiShelter[]
  checked_at: string
  source: string
  sources: string[]
  warnings: string[]
  excluded_count: number
  truncated: boolean
  note: string
}

export function distanceLabel(meters: number): string {
  if (meters < 1000) return `약 ${Math.max(10, Math.round(meters / 10) * 10)}m`
  return `약 ${(meters / 1000).toFixed(1)}km`
}

const MARKERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** 원점과 시설 좌표를 SVG 약도용 0~100 좌표로 정규화 (여백 10) */
export function normalizePoints(points: { lat: number; lon: number }[]): { x: number; y: number }[] {
  const lats = points.map((p) => p.lat)
  const lons = points.map((p) => p.lon)
  const [minLat, maxLat, minLon, maxLon] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)]
  const span = Math.max(maxLat - minLat, maxLon - minLon)
  const scale = (v: number, min: number) => (span === 0 ? 50 : 10 + ((v - min) / span) * 80)
  return points.map((p) => ({ x: scale(p.lon, minLon), y: span === 0 ? 50 : 100 - scale(p.lat, minLat) }))
}

export function mapShelterSearch(api: ApiShelterSearch): ShelterSearchResult {
  const shown = api.shelters.slice(0, MARKERS.length)
  const coords = normalizePoints([api.origin, ...shown.map((s) => ({ lat: s.lat, lon: s.lon }))])
  const shelters: Shelter[] = shown.map((s, i) => ({
    id: s.id,
    marker: MARKERS[i],
    name: s.name,
    address: s.address,
    distanceLabel: distanceLabel(s.distance_m),
    operator: s.role_label,
    // 서버 문구를 그대로 쓴다 (더 강한 표현으로 바꾸지 않는다)
    statusLabel: s.status_label,
    open: s.status === 'open',
    typeLabel: s.type_label,
    suitabilityUnknown: s.hazard_compatibility === 'unknown',
    mapX: coords[i + 1].x,
    mapY: coords[i + 1].y,
  }))
  return {
    shelters,
    origin: coords[0],
    warnings: api.warnings,
    note: api.note,
    checkedAt: api.checked_at,
    source: api.source,
    truncated: api.truncated || api.shelters.length > shown.length,
  }
}
