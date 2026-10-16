import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Alert, ScheduleItem } from '@/types'
import { checkConflicts, CONFLICT_FAILED_TEXT, geocodeAddress } from './scheduleService'

const alert = { id: 'https://api.weather.gov/alerts/x', originalTextEn: 'text' } as Alert
const item = (id: string): ScheduleItem => ({
  id,
  kind: 'visit',
  title: id,
  startUtc: '2026-10-15T21:00:00Z',
  latitude: 29.76,
  longitude: -95.37,
  timezone: 'America/Chicago',
  country: 'US',
})

afterEach(() => vi.unstubAllGlobals())

describe('geocodeAddress (임시 표)', () => {
  it('알려진 키워드 → 좌표·시간대', () => {
    expect(geocodeAddress('1600 Smith St, Houston, TX')).toMatchObject({ latitude: 29.7604, timezone: 'America/Chicago' })
  })
  it('모르는 주소 → undefined', () => {
    expect(geocodeAddress('123 Main St, Austin, TX')).toBeUndefined()
  })
})

describe('checkConflicts', () => {
  it('한 일정 실패는 그 일정만 판정 불가, 나머지는 정상', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) => {
        const body = JSON.parse(String(init.body)) as { stay: { name: string } }
        if (body.stay.name === 'bad') return Promise.reject(new TypeError('Failed to fetch'))
        return Promise.resolve(
          new Response(
            JSON.stringify({ status: '겹침 확인', reasons: ['장소: 경계 안.'], spatial: '경계 안', temporal: '겹침', checked_at: 'x', source: 's', interval_utc: [] }),
            { status: 200 },
          ),
        )
      }),
    )
    const out = await checkConflicts(alert, [item('ok'), item('bad')])
    expect(out.ok.status).toBe('confirmed')
    expect(out.ok.assumedEnd).toBe(true)
    expect(out.bad.status).toBe('undeterminable')
    expect(out.bad.evidenceKo).toBe(CONFLICT_FAILED_TEXT)
  })

  it('요청 body에는 text·alert_id·stay만', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: '판정 불가', reasons: ['r'], spatial: '', temporal: '', checked_at: 'x', source: null, interval_utc: [] }), {
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    await checkConflicts(alert, [item('a')])
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)) as Record<string, unknown>
    expect(Object.keys(body).sort()).toEqual(['alert_id', 'stay', 'text'])
  })
})
