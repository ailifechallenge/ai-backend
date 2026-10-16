import { describe, expect, it } from 'vitest'
import { evaluateOverlap } from './evaluateOverlap'
import type { Alert, ScheduleItem } from '@/types'

const NOW = new Date('2026-10-15T19:20:00Z')

const baseAlert: Alert = {
  id: 'a1',
  nameEn: 'Flash Flood Warning',
  nameKo: '돌발홍수 경보',
  areaLabel: 'Harris County',
  areaCodes: ['TXC201'],
  sentAtUtc: '2026-10-15T18:45:00Z',
  startsAtUtc: '2026-10-15T18:45:00Z',
  endsAtUtc: '2026-10-15T23:30:00Z',
  messageExpiresAtUtc: '2026-10-15T23:30:00Z',
  checkedAtUtc: '2026-10-15T19:18:00Z',
  source: 'NWS',
  sourceUrl: null,
  status: 'active',
  instructionEn: '',
  evacuation: { required: false, basis: 'mock' },
  originalTextEn: '',
  changes: [],
}

const item = (over: Partial<ScheduleItem>): ScheduleItem => ({
  id: 'i1',
  kind: 'visit',
  title: 't',
  startUtc: '2026-10-15T20:00:00Z',
  endUtc: '2026-10-15T21:00:00Z',
  address: 'Houston, TX',
  areaCode: 'TXC201',
  ...over,
})

describe('evaluateOverlap', () => {
  it('cancelled → expired, 해제 시각과 출처 포함', () => {
    const r = evaluateOverlap({ ...baseAlert, status: 'cancelled', cancelledAtUtc: '2026-10-15T18:05:00Z' }, item({}), NOW)
    expect(r.status).toBe('expired')
    expect(r.evidenceKo).toContain('13:05')
    expect(r.evidenceKo).toContain('NWS')
  })

  it('now > expiresAtUtc → expired, 만료 시각과 출처 포함', () => {
    const r = evaluateOverlap(baseAlert, item({}), new Date('2026-10-16T00:00:00Z'))
    expect(r.status).toBe('expired')
    expect(r.evidenceKo).toContain('18:30')
    expect(r.evidenceKo).toContain('NWS')
  })

  it('expired 판정이 incomplete보다 먼저', () => {
    const r = evaluateOverlap({ ...baseAlert, status: 'cancelled' }, item({ areaCode: undefined }), NOW)
    expect(r.status).toBe('expired')
  })

  it('incomplete 경보 → undeterminable', () => {
    const r = evaluateOverlap({ ...baseAlert, status: 'incomplete', endsAtUtc: null, messageExpiresAtUtc: null }, item({}), NOW)
    expect(r.status).toBe('undeterminable')
    expect(r.evidenceKo).toContain('확인 불가 — 공식 경보 확인 필요')
  })

  it('주소·지역 코드 없음 → undeterminable', () => {
    const r = evaluateOverlap(baseAlert, item({ address: undefined, areaCode: undefined }), NOW)
    expect(r.status).toBe('undeterminable')
    expect(r.evidenceKo).toContain('주소를 확인해 주세요')
  })

  it('주소는 있지만 지역 코드를 못 찾음 → undeterminable', () => {
    const r = evaluateOverlap(baseAlert, item({ address: 'somewhere', areaCode: undefined }), NOW)
    expect(r.status).toBe('undeterminable')
  })

  it('지역 일치 + 일정이 유효 시간 안 → confirmed', () => {
    const r = evaluateOverlap(baseAlert, item({}), NOW)
    expect(r.status).toBe('confirmed')
    expect(r.evidenceKo).toBe('지역 코드 일치, 유효 시간 내 · 출처 NWS')
  })

  it('지역 일치 + 숙박이 유효 시간 전체를 덮음 → confirmed', () => {
    const r = evaluateOverlap(
      baseAlert,
      item({ kind: 'stay', startUtc: '2026-10-14T23:00:00Z', endUtc: '2026-10-17T16:00:00Z' }),
      NOW,
    )
    expect(r.status).toBe('confirmed')
  })

  it('지역 일치 + 시간 일부 겹침 → possible', () => {
    const r = evaluateOverlap(baseAlert, item({ startUtc: '2026-10-15T23:00:00Z', endUtc: '2026-10-16T01:00:00Z' }), NOW)
    expect(r.status).toBe('possible')
  })

  it('지역 일치 + 종료 시각 없음(유효 시간 내 시작) → possible', () => {
    const r = evaluateOverlap(baseAlert, item({ startUtc: '2026-10-15T21:00:00Z', endUtc: undefined }), NOW)
    expect(r.status).toBe('possible')
  })

  it('지역 불일치 → unconfirmed, 안전 아님 문구 병기', () => {
    const r = evaluateOverlap(baseAlert, item({ areaCode: 'TXC167' }), NOW)
    expect(r.status).toBe('unconfirmed')
    expect(r.evidenceKo).toContain('안전하다는 뜻은 아니에요')
  })

  it('시간 겹침 없음 → unconfirmed', () => {
    const r = evaluateOverlap(baseAlert, item({ startUtc: '2026-10-16T14:00:00Z', endUtc: undefined }), NOW)
    expect(r.status).toBe('unconfirmed')
    expect(r.evidenceKo).toContain('안전하다는 뜻은 아니에요')
  })

  it('항상 evidenceKo를 포함', () => {
    const cases = [
      evaluateOverlap(baseAlert, item({}), NOW),
      evaluateOverlap(baseAlert, item({ areaCode: undefined }), NOW),
      evaluateOverlap({ ...baseAlert, status: 'cancelled' }, item({}), NOW),
    ]
    for (const r of cases) expect(r.evidenceKo.length).toBeGreaterThan(0)
  })
})
