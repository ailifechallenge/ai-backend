import type { Alert } from '@/types'
import { formatLocalDayTime, formatLocalTime } from './time'

/**
 * 경보 시각 라벨. 발표(sent)·시작(onset)·종료 예정(ends)·메시지 만료(expires)를 섞지 않는다.
 * 메시지 만료는 재난 종료가 아니다.
 */

const local = (iso: string, now: Date) => `${formatLocalDayTime(iso, now)}(현지)`

export function checkedLabel(alert: Alert): string {
  return formatLocalTime(alert.checkedAtUtc)
}

/** 카드 한 줄 요약: 종료 예정 우선, 없으면 메시지 만료 */
export function validityLine(alert: Alert, now: Date): string {
  if (alert.status === 'cancelled') return alert.cancelledAtUtc ? `해제 ${local(alert.cancelledAtUtc, now)}` : '해제됨'
  if (alert.status === 'incomplete') return '유효 시간 확인 불가'
  if (alert.status === 'expired') {
    const at = alert.endsAtUtc ?? alert.messageExpiresAtUtc
    return at ? `${local(at, now)} 지남` : '만료됨'
  }
  if (alert.endsAtUtc) return `종료 예정 ${local(alert.endsAtUtc, now)}`
  if (alert.messageExpiresAtUtc) return `메시지 만료 ${local(alert.messageExpiresAtUtc, now)} · 종료 예정 미발표`
  return '종료 예정 미발표'
}

export interface TimeRow {
  label: string
  value: string
}

/** 상세 화면용 시각 목록 (있는 것만) */
export function timeRows(alert: Alert, now: Date): TimeRow[] {
  const rows: TimeRow[] = []
  if (alert.sentAtUtc) rows.push({ label: '발표', value: local(alert.sentAtUtc, now) })
  if (alert.startsAtUtc) rows.push({ label: '시작', value: local(alert.startsAtUtc, now) })
  rows.push({ label: '종료 예정', value: alert.endsAtUtc ? local(alert.endsAtUtc, now) : '미발표' })
  if (alert.messageExpiresAtUtc) rows.push({ label: '메시지 만료', value: local(alert.messageExpiresAtUtc, now) })
  return rows
}
