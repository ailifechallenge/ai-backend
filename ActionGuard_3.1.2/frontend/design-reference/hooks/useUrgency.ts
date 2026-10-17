import { useCallback, useEffect, useRef, useState } from 'react'
import { errorMessage } from '@/services/http'
import { assessUrgency } from '@/services/urgencyService'
import type { Alert, UrgencyAssessment, UrgencyPhase } from '@/types'

export interface UrgencyState {
  phase: UrgencyPhase
  /** 1차(규칙) 판정 결과 */
  base: UrgencyAssessment | null
  /** 화면에 보여 줄 현재 판정 (AI 반영 전에는 base와 같다) */
  current: UrgencyAssessment | null
  /** 1차 판정 자체가 실패한 경우만 (AI 실패와 구분) */
  error: string | null
}

const INITIAL: UrgencyState = { phase: 'rules', base: null, current: null, error: null }

/**
 * 대응 4단계 판정을 두 번에 나눠 받는다.
 * 1) 규칙 판정(use_ai:false) → 즉시 표시  2) AI 보조 판정(use_ai:true) → 반영 또는 기본 판정 유지
 * 경보(원문)가 바뀌면 상태를 즉시 초기화하고, 늦게 도착한 이전 응답은 요청 번호로 버린다.
 */
export function useUrgency(alert: Alert | undefined) {
  const [state, setState] = useState<UrgencyState>(INITIAL)
  const [attempt, setAttempt] = useState(0)
  const requestId = useRef(0)
  const key = alert ? `${alert.id}|${alert.originalTextEn}` : null

  useEffect(() => {
    const id = ++requestId.current
    setState(INITIAL)
    if (!alert) return
    const current = () => requestId.current === id

    void (async () => {
      let base: UrgencyAssessment
      try {
        base = await assessUrgency(alert, false)
      } catch (e) {
        if (current()) setState({ ...INITIAL, error: errorMessage(e) })
        return
      }
      if (!current()) return
      // 취소·만료·시험 메시지는 AI 단계를 건너뛴다
      if (base.inactive) {
        setState({ phase: 'done', base, current: base, error: null })
        return
      }
      setState({ phase: 'ai', base, current: base, error: null })
      try {
        const refined = await assessUrgency(alert, true)
        if (!current()) return
        if (base.level !== null && refined.level !== null && refined.level < base.level) {
          // 규칙으로 확정된 단계는 서버가 낮추지 않는다 — 나오면 기본 판정을 유지하고 경고만 남긴다
          console.warn('[urgency] AI 판정이 기본 판정보다 낮게 왔어요. 기본 판정을 유지해요.')
          setState({ phase: 'done', base, current: { ...refined, level: base.level, label: base.label }, error: null })
          return
        }
        setState({ phase: 'done', base, current: refined, error: null })
      } catch {
        // 네트워크 오류 등 — 기본 판정은 정상이므로 그대로 둔다
        if (current())
          setState({
            phase: 'ai_failed',
            base,
            current: { ...base, method: 'rules_fallback', methodNote: 'AI 연결을 완료하지 못해 기본 판정을 유지했어요.' },
            error: null,
          })
      }
    })()
    // key가 경보·원문을 대표한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}
