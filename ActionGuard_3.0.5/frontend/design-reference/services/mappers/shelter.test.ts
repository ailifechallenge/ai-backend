import { describe, expect, it } from 'vitest'
import { distanceLabel, mapShelterSearch, normalizePoints, type ApiShelter, type ApiShelterSearch } from './shelter'

const shelter = (over: Partial<ApiShelter>): ApiShelter => ({
  id: 's1',
  name: 'George R. Brown Convention Center',
  address: '1001 Avenida De Las Americas, Houston, TX',
  lat: 29.752,
  lon: -95.358,
  status: 'open',
  status_label: 'FEMA 데이터상 현재 운영 중',
  shelter_type: 'general',
  type_label: '일반 대피소',
  role_label: '공식 대피 시설',
  navigable: true,
  hazard_compatibility: 'designated',
  supported_hazards: ['flood'],
  distance_m: 1234,
  bearing_deg: 120,
  direction: '남동',
  wheelchair_accessible: '확인되지 않음',
  pets: '확인되지 않음',
  remarks: '',
  source: 'https://gis.fema.gov',
  checked_at: '2026-10-15T19:18:00Z',
  source_updated_at: null,
  operating_status: null,
  incident_name: null,
  ...over,
})

const search = (shelters: ApiShelter[]): ApiShelterSearch => ({
  country: 'US',
  origin: { lat: 29.7604, lon: -95.3698 },
  radius_km: 10,
  disaster: 'flood',
  shelters,
  checked_at: '2026-10-15T19:18:00Z',
  source: 'FEMA',
  sources: [],
  warnings: ['현장 개방 확인 필요'],
  excluded_count: 0,
  truncated: false,
  note: '직선거리 순입니다.',
})

describe('distanceLabel', () => {
  it('km / m', () => {
    expect(distanceLabel(1234)).toBe('약 1.2km')
    expect(distanceLabel(1950)).toBe('약 1.9km')
    expect(distanceLabel(456)).toBe('약 460m')
  })
})

describe('normalizePoints', () => {
  it('0~100 안에 들어가고 북쪽이 위(y 작음)', () => {
    const [a, b] = normalizePoints([
      { lat: 29.7, lon: -95.4 },
      { lat: 29.8, lon: -95.3 },
    ])
    for (const p of [a, b]) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(100)
    }
    expect(b.y).toBeLessThan(a.y)
    expect(b.x).toBeGreaterThan(a.x)
  })
  it('점이 하나뿐이면 가운데', () => {
    expect(normalizePoints([{ lat: 1, lon: 1 }])).toEqual([{ x: 50, y: 50 }])
  })
})

describe('mapShelterSearch', () => {
  it('서버 상태 문구를 그대로, open이 아니면 open=false', () => {
    const r = mapShelterSearch(
      search([
        shelter({}),
        shelter({ id: 's2', status: 'planned', status_label: '현장 개방 확인 필요', hazard_compatibility: 'unknown' }),
      ]),
    )
    expect(r.shelters[0]).toMatchObject({ marker: 'A', statusLabel: 'FEMA 데이터상 현재 운영 중', open: true, operator: '공식 대피 시설', distanceLabel: '약 1.2km', suitabilityUnknown: false })
    expect(r.shelters[1]).toMatchObject({ marker: 'B', statusLabel: '현장 개방 확인 필요', open: false, suitabilityUnknown: true })
    expect(r.warnings).toEqual(['현장 개방 확인 필요'])
    expect(r.note).toBe('직선거리 순입니다.')
  })
  it('빈 배열도 정상 결과', () => {
    const r = mapShelterSearch(search([]))
    expect(r.shelters).toEqual([])
    expect(r.origin).toEqual({ x: 50, y: 50 })
  })
})
