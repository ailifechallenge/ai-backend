import type { ScheduleItem } from '@/types'

// 시연용 예시 일정. 시각은 UTC (현지 CDT = UTC-5)
export const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: 'mock-stay',
    kind: 'stay',
    title: '시내 호텔 숙박',
    startUtc: '2026-10-14T20:00:00Z',
    endUtc: '2026-10-16T16:00:00Z',
    address: '1600 Smith St, Houston, TX',
    areaCode: 'TXC201',
    latitude: 29.7604,
    longitude: -95.3698,
    timezone: 'America/Chicago',
    country: 'US',
  },
  {
    id: 'mock-museum',
    kind: 'visit',
    title: '박물관 방문',
    startUtc: '2026-10-15T21:00:00Z',
    address: '5555 Hermann Park Dr, Houston, TX',
    areaCode: 'TXC201',
    latitude: 29.7604,
    longitude: -95.3698,
    timezone: 'America/Chicago',
    country: 'US',
  },
  {
    id: 'mock-airport',
    kind: 'move',
    title: '공항 이동',
    startUtc: '2026-10-16T14:00:00Z',
    address: '2800 N Terminal Rd, Houston, TX',
    areaCode: 'TXC201',
    latitude: 29.7604,
    longitude: -95.3698,
    timezone: 'America/Chicago',
    country: 'US',
  },
  {
    id: 'mock-outoftown',
    kind: 'visit',
    title: '시외 방문',
    startUtc: '2026-10-17T16:00:00Z',
  },
]

export interface GeocodeEntry {
  keyword: string
  /** mock 겹침 판정용 지역 코드 */
  areaCode: string
  latitude: number
  longitude: number
  timezone: string
  country: 'US' | 'JP'
}

/**
 * 임시 지오코딩 표 — 백엔드에 주소→좌표 API가 없어 알려진 키워드가 들어간 주소만 위치를 찾는다.
 * 좌표는 도시 중심점이라 실제 숙소 위치와 다를 수 있다.
 */
export const MOCK_GEOCODE: GeocodeEntry[] = [
  { keyword: 'houston', areaCode: 'TXC201', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago', country: 'US' },
  { keyword: 'galveston', areaCode: 'TXC167', latitude: 29.3013, longitude: -94.7977, timezone: 'America/Chicago', country: 'US' },
]
