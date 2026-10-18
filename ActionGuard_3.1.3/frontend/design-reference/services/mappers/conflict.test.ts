import { describe, expect, it } from 'vitest'
import type { ScheduleItem } from '@/types'
import { mapConflict, toStayPayload, utcToWallTime, type ApiConflict } from './conflict'

const base: ScheduleItem = {
  id: 'i1',
  kind: 'stay',
  title: '시내 호텔 숙박',
  startUtc: '2026-10-15T21:00:00Z',
  endUtc: '2026-10-16T16:00:00Z',
  address: '1600 Smith St, Houston, TX',
  latitude: 29.7604,
  longitude: -95.3698,
  timezone: 'America/Chicago',
  country: 'US',
}

describe('utcToWallTime', () => {
  it('CDT(UTC-5) 벽시계', () => {
    expect(utcToWallTime('2026-10-15T21:00:00Z', 'America/Chicago')).toBe('2026-10-15T16:00')
  })
  it('CST(UTC-6) 벽시계', () => {
    expect(utcToWallTime('2026-12-01T18:30:00Z', 'America/Chicago')).toBe('2026-12-01T12:30')
  })
  it('서머타임 시작 직후 (02:00이 03:00으로 건너뜀)', () => {
    // 2026-03-08 08:00Z = 03:00 CDT (02:xx 벽시계는 존재하지 않음)
    expect(utcToWallTime('2026-03-08T07:59:00Z', 'America/Chicago')).toBe('2026-03-08T01:59')
    expect(utcToWallTime('2026-03-08T08:00:00Z', 'America/Chicago')).toBe('2026-03-08T03:00')
  })
  it('서머타임 종료 (01:xx가 두 번) — 두 시각이 같은 벽시계가 된다', () => {
    expect(utcToWallTime('2026-11-01T06:30:00Z', 'America/Chicago')).toBe('2026-11-01T01:30')
    expect(utcToWallTime('2026-11-01T07:30:00Z', 'America/Chicago')).toBe('2026-11-01T01:30')
  })
  it('도쿄', () => {
    expect(utcToWallTime('2026-10-15T21:00:00Z', 'Asia/Tokyo')).toBe('2026-10-16T06:00')
  })
})

describe('toStayPayload', () => {
  it('정의된 필드만, 오프셋 없는 현지 벽시계', () => {
    const { stay, assumedEnd } = toStayPayload(base)
    expect(stay).toEqual({
      name: '시내 호텔 숙박',
      country: 'US',
      latitude: 29.7604,
      longitude: -95.3698,
      timezone: 'America/Chicago',
      start: '2026-10-15T16:00',
      end: '2026-10-16T11:00',
    })
    expect(assumedEnd).toBe(false)
    expect(stay.start).not.toMatch(/Z|[+-]\d{2}:\d{2}$/)
  })

  it('종료 없음 → 시작 + 3시간 가정', () => {
    const { stay, assumedEnd } = toStayPayload({ ...base, endUtc: undefined })
    expect(assumedEnd).toBe(true)
    expect(stay.end).toBe('2026-10-15T19:00')
  })

  it('종료가 시작과 같으면 3시간 가정 (서버 422 방지)', () => {
    const { stay, assumedEnd } = toStayPayload({ ...base, endUtc: base.startUtc })
    expect(assumedEnd).toBe(true)
    expect(stay.end).toBe('2026-10-15T19:00')
  })

  it('3시간 가정이 서머타임 종료를 건너도 UTC 기준 3시간', () => {
    // 00:30 CDT + 3h = 02:30 CST
    const { stay } = toStayPayload({ ...base, startUtc: '2026-11-01T05:30:00Z', endUtc: undefined })
    expect(stay.start).toBe('2026-11-01T00:30')
    expect(stay.end).toBe('2026-11-01T02:30')
  })

  it('좌표가 없으면 좌표 키 자체를 보내지 않는다', () => {
    const { stay } = toStayPayload({ ...base, latitude: undefined, longitude: undefined })
    expect('latitude' in stay).toBe(false)
    expect('longitude' in stay).toBe(false)
  })

  it('좌표가 하나만 있으면 둘 다 보내지 않는다', () => {
    const { stay } = toStayPayload({ ...base, longitude: undefined })
    expect('latitude' in stay).toBe(false)
  })

  it('예전에 저장된 일정(시간대·국가 없음)은 기본값 사용', () => {
    const { stay } = toStayPayload({ id: 'old', kind: 'visit', title: 't', startUtc: '2026-10-15T21:00:00Z', areaCode: 'TXC201' })
    expect(stay.timezone).toBe('America/Chicago')
    expect(stay.country).toBe('US')
  })

  it('제목은 120자로 자른다', () => {
    expect(toStayPayload({ ...base, title: 'a'.repeat(200) }).stay.name).toHaveLength(120)
  })
})

describe('mapConflict', () => {
  const api = (status: ApiConflict['status']): ApiConflict => ({
    status,
    reasons: ['장소: 경계 안.', '체류 시간과 경보 시작·종료: 겹침.'],
    spatial: '경계 안',
    temporal: '겹침',
    checked_at: 'x',
    source: 'https://api.weather.gov/alerts/x',
    interval_utc: [],
  })
  it.each([
    ['겹침 확인', 'confirmed'],
    ['겹칠 가능성', 'possible'],
    ['현재 확인된 겹침 없음', 'unconfirmed'],
    ['메시지 만료', 'expired'],
    ['해제', 'expired'],
    ['판정 불가', 'undeterminable'],
  ] as const)('%s → %s', (status, expected) => {
    expect(mapConflict(api(status)).status).toBe(expected)
  })
  it('근거는 reasons를 이어 붙이고 출처를 유지', () => {
    const r = mapConflict(api('겹침 확인'), true)
    expect(r.evidenceKo).toBe('장소: 경계 안. 체류 시간과 경보 시작·종료: 겹침.')
    expect(r.source).toBe('https://api.weather.gov/alerts/x')
    expect(r.assumedEnd).toBe(true)
  })
})
