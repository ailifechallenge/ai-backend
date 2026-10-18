import { useCallback, useEffect, useMemo, useState } from 'react'
import { isMock } from '@/config/api'
import { getNow } from '@/config/demo'
import { ALERT_REFRESH_AFTER_MS, useAlertContext } from '@/context/AlertContext'
import { evaluateOverlap } from '@/lib/evaluateOverlap'
import { checkConflicts, listSchedule } from '@/services/scheduleService'
import type { Alert, OverlapResult, ScheduleItem } from '@/types'
import { useAsync } from './useAsync'

export interface EvaluatedItem {
  item: ScheduleItem
  /** 판정 결과. 아직 판정 중이거나 판정할 경보가 없으면 undefined */
  result?: OverlapResult
  pending: boolean
}

/**
 * 일정 목록 + 현재 경보 기준 겹침 판정.
 * - mock: lib/evaluateOverlap (규칙, 즉시)
 * - live: 백엔드 /api/conflict를 일정마다 1회. 경보·일정이 바뀔 때만 다시 호출한다.
 *   경보가 오래됐으면(서버 15분 제한) 먼저 경보를 다시 조회한 뒤 판정한다.
 */
export function useScheduleOverlaps(alert: Alert | undefined) {
  const { ensureFresh } = useAlertContext()
  const { data: items, loading, reload } = useAsync(listSchedule, [])
  const now = useMemo(getNow, [])
  const [live, setLive] = useState<{ key: string; results: Record<string, OverlapResult> } | null>(null)

  const liveKey = alert && items && !isMock() ? `${alert.id}|${alert.checkedAtUtc}|${items.map((i) => i.id).join(',')}` : null

  useEffect(() => {
    if (!liveKey || !alert || !items) return
    if (items.length === 0) {
      setLive({ key: liveKey, results: {} })
      return
    }
    if (Date.now() - Date.parse(alert.checkedAtUtc) > ALERT_REFRESH_AFTER_MS) {
      // 새 경보가 오면 liveKey가 바뀌어 다시 실행된다
      ensureFresh().catch(() => {
        /* 경보 조회 오류는 화면 상단 경보 상태로 표시된다 */
      })
      return
    }
    let alive = true
    checkConflicts(alert, items).then((results) => alive && setLive({ key: liveKey, results }))
    return () => {
      alive = false
    }
    // liveKey가 alert·items를 대표한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveKey, ensureFresh])

  const evaluated = useMemo<EvaluatedItem[]>(() => {
    if (!items) return []
    if (isMock()) {
      return items.map((item) => ({ item, result: alert ? evaluateOverlap(alert, item, now) : undefined, pending: false }))
    }
    const results = live && live.key === liveKey ? live.results : null
    return items.map((item) => ({ item, result: results?.[item.id], pending: Boolean(alert) && !results }))
  }, [items, alert, now, live, liveKey])

  const reloadItems = useCallback(() => reload(), [reload])

  return { items: items ?? [], evaluated, loading, now, reload: reloadItems }
}
