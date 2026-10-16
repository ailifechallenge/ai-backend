import { evacuationInstructed } from '@/lib/evacuation'
import { eventNameKo } from '@/lib/eventNames'
import type { Alert, AlertStatus } from '@/types'

/** 백엔드 /api/alerts 응답의 Alert (backend/models/contracts.py) */
export interface ApiAlert {
  id: string
  event: string
  headline: string
  area: string
  severity: string
  sender: string
  sent: string | null
  effective: string | null
  expires: string | null
  onset?: string | null
  ends?: string | null
  instruction: string
  source: string
  text: string
  checked_at: string
  message_type?: string | null
  /** NWS 메시지 상태 (Actual / Exercise / System / Test / Draft) — 2026-10-16 추가 */
  status?: string | null
  geometry?: unknown
}

export interface ApiAlerts {
  alerts: ApiAlert[]
  checked_at: string
}

const before = (iso: string | null | undefined, now: Date) => {
  if (!iso) return false
  const t = Date.parse(iso)
  return !Number.isNaN(t) && t <= now.getTime()
}

/**
 * 경보 상태 판정 (한 곳에서만):
 * Cancel 메시지 → cancelled · 메시지 만료/종료 예정이 지남 → expired · 지역·시각 정보 부족 → incomplete · 그 외 active
 */
export function deriveAlertStatus(api: ApiAlert, now: Date): AlertStatus {
  if (api.message_type === 'Cancel') return 'cancelled'
  if (before(api.expires, now) || before(api.ends, now)) return 'expired'
  const hasTime = Boolean(api.onset || api.effective || api.ends || api.expires)
  if (!api.area?.trim() || !hasTime) return 'incomplete'
  return 'active'
}

export function mapAlert(api: ApiAlert, now: Date): Alert {
  const status = deriveAlertStatus(api, now)
  return {
    id: api.id,
    nameEn: api.event,
    nameKo: eventNameKo(api.event),
    areaLabel: api.area,
    severity: api.severity,
    sentAtUtc: api.sent,
    startsAtUtc: api.onset ?? api.effective,
    endsAtUtc: api.ends ?? null,
    messageExpiresAtUtc: api.expires,
    cancelledAtUtc: status === 'cancelled' ? api.sent : null,
    checkedAtUtc: api.checked_at,
    source: api.sender || 'NWS',
    sourceUrl: api.source || null,
    status,
    instructionEn: api.instruction ?? '',
    evacuation: { required: evacuationInstructed(api.instruction), basis: 'rule' },
    originalTextEn: api.text,
    changes: [],
  }
}

const SEVERITY_RANK: Record<string, number> = { Extreme: 4, Severe: 3, Moderate: 2, Minor: 1, Unknown: 0 }

/** 대표 경보 1건: severity(Extreme>Severe>Moderate>Minor>Unknown) → 발표(sent) 최신순 */
export function pickRepresentative(alerts: ApiAlert[]): ApiAlert | null {
  if (alerts.length === 0) return null
  return [...alerts].sort((a, b) => {
    const bySeverity = (SEVERITY_RANK[b.severity] ?? 0) - (SEVERITY_RANK[a.severity] ?? 0)
    if (bySeverity !== 0) return bySeverity
    return (Date.parse(b.sent ?? '') || 0) - (Date.parse(a.sent ?? '') || 0)
  })[0]
}
