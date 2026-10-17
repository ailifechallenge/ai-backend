import { describe, expect, it } from 'vitest'
import { deriveAlertStatus, mapAlert, pickRepresentative } from './alert'
import { API_ALERT } from './fixtures'

const NOW = new Date('2026-10-15T19:20:00Z') // 14:20 CDT

describe('deriveAlertStatus', () => {
  it('유효 → active', () => {
    expect(deriveAlertStatus(API_ALERT, NOW)).toBe('active')
  })
  it('Cancel 메시지 → cancelled (만료보다 우선)', () => {
    expect(deriveAlertStatus({ ...API_ALERT, message_type: 'Cancel', expires: '2026-10-15T10:00:00Z' }, NOW)).toBe('cancelled')
  })
  it('메시지 만료가 지남 → expired', () => {
    expect(deriveAlertStatus({ ...API_ALERT, expires: '2026-10-15T19:00:00Z' }, NOW)).toBe('expired')
  })
  it('종료 예정이 지남 → expired', () => {
    expect(deriveAlertStatus({ ...API_ALERT, ends: '2026-10-15T19:00:00Z' }, NOW)).toBe('expired')
  })
  it('지역 없음 → incomplete', () => {
    expect(deriveAlertStatus({ ...API_ALERT, area: '  ' }, NOW)).toBe('incomplete')
  })
  it('시각 정보 전혀 없음 → incomplete', () => {
    expect(deriveAlertStatus({ ...API_ALERT, onset: null, effective: null, ends: null, expires: null }, NOW)).toBe('incomplete')
  })
})

describe('mapAlert', () => {
  it('필드 매핑과 시각 역할 분리', () => {
    const a = mapAlert(API_ALERT, NOW)
    expect(a.id).toBe(API_ALERT.id)
    expect(a.nameEn).toBe('Flash Flood Warning')
    expect(a.nameKo).toBe('돌발홍수 경보')
    expect(a.areaLabel).toBe('Harris, TX')
    expect(a.startsAtUtc).toBe(API_ALERT.onset)
    expect(a.endsAtUtc).toBe(API_ALERT.ends)
    expect(a.messageExpiresAtUtc).toBe(API_ALERT.expires)
    expect(a.sentAtUtc).toBe(API_ALERT.sent)
    expect(a.checkedAtUtc).toBe(API_ALERT.checked_at)
    expect(a.source).toBe('NWS Houston/Galveston TX')
    expect(a.sourceUrl).toBe(API_ALERT.source)
    expect(a.originalTextEn).toBe(API_ALERT.text)
    expect(a.changes).toEqual([])
  })
  it('onset이 없으면 effective를 시작으로', () => {
    expect(mapAlert({ ...API_ALERT, onset: null }, NOW).startsAtUtc).toBe(API_ALERT.effective)
  })
  it('ends가 없으면 종료 예정은 null (메시지 만료로 대체하지 않음)', () => {
    const a = mapAlert({ ...API_ALERT, ends: null }, NOW)
    expect(a.endsAtUtc).toBeNull()
    expect(a.messageExpiresAtUtc).toBe(API_ALERT.expires)
  })
  it('사전에 없는 이벤트는 영문 그대로', () => {
    expect(mapAlert({ ...API_ALERT, event: 'Beach Hazards Statement' }, NOW).nameKo).toBe('Beach Hazards Statement')
  })
})

describe('pickRepresentative', () => {
  it('0건 → null', () => {
    expect(pickRepresentative([])).toBeNull()
  })
  it('severity 높은 것 우선, 같으면 최신 발표', () => {
    const minor = { ...API_ALERT, id: 'minor', severity: 'Minor', sent: '2026-10-15T19:00:00Z' }
    const severeOld = { ...API_ALERT, id: 'severe-old', severity: 'Severe', sent: '2026-10-15T10:00:00Z' }
    const severeNew = { ...API_ALERT, id: 'severe-new', severity: 'Severe', sent: '2026-10-15T12:00:00Z' }
    expect(pickRepresentative([minor, severeOld, severeNew])?.id).toBe('severe-new')
  })
})
