import { LOCAL_TIME_ZONE } from '@/config/demo'
import type { OverlapResult, OverlapStatus, ScheduleItem } from '@/types'

/** 종료 시각이 없는 일정은 시작 + 3시간으로 가정해 서버에 보낸다 (화면에 가정 표시) */
export const ASSUMED_DURATION_MS = 3 * 60 * 60_000
export const ASSUMED_END_TEXT = '종료 시각 미정 · 3시간으로 가정해 비교'

/** 백엔드 Stay (extra="forbid") — 정의된 필드만 */
export interface StayPayload {
  name: string
  country: 'US' | 'JP'
  latitude?: number
  longitude?: number
  timezone: string
  /** 해당 시간대의 현지 벽시계 "YYYY-MM-DDTHH:mm" (오프셋 없음) */
  start: string
  end: string
}

export interface ApiConflict {
  status: '겹침 확인' | '겹칠 가능성' | '현재 확인된 겹침 없음' | '메시지 만료' | '해제' | '판정 불가'
  reasons: string[]
  spatial: string
  temporal: string
  checked_at: string
  source: string | null
  interval_utc: string[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/** UTC 시각 → 주어진 시간대의 현지 벽시계 "YYYY-MM-DDTHH:mm" (Intl만 사용) */
export function utcToWallTime(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso))
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return `${get('year')}-${pad(get('month'))}-${pad(get('day'))}T${pad(get('hour'))}:${pad(get('minute'))}`
}

export function toStayPayload(item: ScheduleItem): { stay: StayPayload; assumedEnd: boolean } {
  const timezone = item.timezone ?? LOCAL_TIME_ZONE
  const startMs = Date.parse(item.startUtc)
  const endMs = item.endUtc ? Date.parse(item.endUtc) : NaN
  // 종료가 없거나 시작보다 늦지 않으면(분 단위) 3시간으로 가정
  const assumedEnd = !(endMs - startMs >= 60_000)
  const endIso = assumedEnd ? new Date(startMs + ASSUMED_DURATION_MS).toISOString() : (item.endUtc as string)

  const stay: StayPayload = {
    name: item.title.trim().slice(0, 120) || '일정',
    country: item.country ?? 'US',
    timezone,
    start: utcToWallTime(item.startUtc, timezone),
    end: utcToWallTime(endIso, timezone),
  }
  // 좌표는 둘 다 있거나 둘 다 없어야 한다
  if (typeof item.latitude === 'number' && typeof item.longitude === 'number') {
    stay.latitude = item.latitude
    stay.longitude = item.longitude
  }
  return { stay, assumedEnd }
}

const STATUS_MAP: Record<ApiConflict['status'], OverlapStatus> = {
  '겹침 확인': 'confirmed',
  '겹칠 가능성': 'possible',
  '현재 확인된 겹침 없음': 'unconfirmed',
  '메시지 만료': 'expired',
  해제: 'expired',
  '판정 불가': 'undeterminable',
}

export function mapConflict(api: ApiConflict, assumedEnd = false): OverlapResult {
  return {
    status: STATUS_MAP[api.status] ?? 'undeterminable',
    evidenceKo: api.reasons.join(' ') || api.status,
    source: api.source ?? undefined,
    assumedEnd,
  }
}
