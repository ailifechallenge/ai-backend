import type { Alert, OverlapResult, ScheduleItem } from '@/types'
import { formatLocalDayTime } from './time'

export const UNDETERMINABLE_TEXT = '확인 불가 — 공식 경보 확인 필요'
export const NO_OVERLAP_TEXT = '현재 확인된 겹침 없음 · 안전하다는 뜻은 아니에요'

/**
 * 경보와 일정의 겹침을 규칙으로 판정한다. (AI 판단 없음, 순수 함수)
 * mock 모드 전용 — live 모드는 백엔드 /api/conflict 결과를 쓴다.
 * 유효 시간 끝 = 종료 예정(ends), 없으면 메시지 만료(expires).
 *
 * 1. 경보 해제(cancelled) 또는 now > 만료 → expired
 * 2. 경보 정보 불완전(incomplete) 또는 일정에 지역 코드 없음 → undeterminable
 * 3. 지역 코드 일치 + 일정 시간이 유효 시간과 완전히 겹침 → confirmed
 *    (일정이 유효 시간 안에 있거나, 숙박처럼 일정이 유효 시간 전체를 덮는 경우)
 * 4. 지역 코드 일치 + 시간이 일부만 겹치거나 불명확(종료 시각 없음 등) → possible
 * 5. 그 외 → unconfirmed
 */
export function evaluateOverlap(alert: Alert, item: ScheduleItem, now: Date): OverlapResult {
  const source = alert.source
  const windowEnd = alert.endsAtUtc ?? alert.messageExpiresAtUtc
  const localLabel = (iso: string) => `${formatLocalDayTime(iso, now)}(현지)`

  if (alert.status === 'cancelled') {
    const at = alert.cancelledAtUtc ? ` ${localLabel(alert.cancelledAtUtc)}` : ''
    return { status: 'expired', evidenceKo: `경보 해제됨 · 해제 시각${at} · 출처 ${source}`, source }
  }
  if (alert.status === 'expired' || (windowEnd && now.getTime() > Date.parse(windowEnd))) {
    const at = windowEnd ? ` ${localLabel(windowEnd)}` : ''
    return { status: 'expired', evidenceKo: `경보 만료됨 · 만료${at} · 출처 ${source}`, source }
  }

  if (alert.status === 'incomplete' || !alert.startsAtUtc || !windowEnd) {
    return { status: 'undeterminable', evidenceKo: `${UNDETERMINABLE_TEXT} · 경보 정보가 부족해요` }
  }
  if (!item.areaCode) {
    const reason = item.address ? '주소로 지역을 찾지 못했어요' : '주소를 확인해 주세요'
    return { status: 'undeterminable', evidenceKo: `${UNDETERMINABLE_TEXT} · ${reason}` }
  }

  if (!(alert.areaCodes ?? []).includes(item.areaCode)) {
    return { status: 'unconfirmed', evidenceKo: `지역 코드 불일치 · ${NO_OVERLAP_TEXT}`, source }
  }

  const aStart = Date.parse(alert.startsAtUtc)
  const aEnd = Date.parse(windowEnd)
  const iStart = Date.parse(item.startUtc)

  if (!item.endUtc) {
    if (iStart > aEnd) {
      return { status: 'unconfirmed', evidenceKo: `유효 시간 이후 일정 · ${NO_OVERLAP_TEXT}`, source }
    }
    const reason = iStart >= aStart ? '유효 시간 내 시작, 종료 시각 미정' : '시작 시각이 유효 시간 전, 종료 시각 미정'
    return { status: 'possible', evidenceKo: `지역 코드 일치, ${reason} · 출처 ${source}`, source }
  }

  const iEnd = Date.parse(item.endUtc)
  if (iEnd < aStart || iStart > aEnd) {
    return { status: 'unconfirmed', evidenceKo: `유효 시간과 겹치지 않음 · ${NO_OVERLAP_TEXT}`, source }
  }
  const itemInsideAlert = iStart >= aStart && iEnd <= aEnd
  const alertInsideItem = aStart >= iStart && aEnd <= iEnd
  if (itemInsideAlert || alertInsideItem) {
    return { status: 'confirmed', evidenceKo: `지역 코드 일치, 유효 시간 내 · 출처 ${source}`, source }
  }
  return { status: 'possible', evidenceKo: `지역 코드 일치, 시간 일부 겹침 · 출처 ${source}`, source }
}
