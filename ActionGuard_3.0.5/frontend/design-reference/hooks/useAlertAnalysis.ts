import { useCallback, useEffect, useState } from 'react'
import { AI_UNAVAILABLE_TEXT, useHealth } from '@/context/HealthContext'
import { getGuidance, translateAlert, verifyTranslation } from '@/services/analysisService'
import { errorMessage, isApiError } from '@/services/http'
import type { Alert, AlertTranslation, GuidanceResult, Verification } from '@/types'

export type Step<T> =
  | { state: 'idle' }
  /** 앞 단계(번역)가 끝나기를 기다리는 중 */
  | { state: 'waiting' }
  | { state: 'loading' }
  | { state: 'done'; data: T }
  /** AI를 쓸 수 없음(설정 없음·일일 한도) — 오류가 아니라 기능 제한 */
  | { state: 'unavailable'; message: string }
  | { state: 'error'; message: string }

export const AI_LIMIT_TEXT = 'AI 일일 한도에 도달했어요 · 오늘은 AI 번역·검증을 더 쓸 수 없어요. 공식 영문 지시와 행동지침은 그대로 확인할 수 있어요.'

function toFailure(e: unknown): Step<never> {
  if (isApiError(e) && e.status === 503) return { state: 'unavailable', message: AI_UNAVAILABLE_TEXT }
  if (isApiError(e) && e.status === 429) return { state: 'unavailable', message: AI_LIMIT_TEXT }
  return { state: 'error', message: errorMessage(e) }
}

/** key가 바뀔 때만 run을 다시 실행한다. key가 null이면 실행하지 않는다 */
function useStep<T>(key: string | null, run: () => Promise<T>, blocked?: Step<T>) {
  const [step, setStep] = useState<Step<T>>({ state: 'idle' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (blocked) {
      setStep(blocked)
      return
    }
    if (key === null) {
      setStep({ state: 'idle' })
      return
    }
    let alive = true
    setStep({ state: 'loading' })
    run().then(
      (data) => alive && setStep({ state: 'done', data }),
      (e: unknown) => alive && setStep(toFailure(e)),
    )
    return () => {
      alive = false
    }
    // run은 key로 식별한다 (같은 key면 같은 요청)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt, blocked?.state])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { step, retry }
}

const alertKey = (alert: Alert | undefined) => (alert ? `${alert.id}|${alert.originalTextEn.length}|${alert.checkedAtUtc}` : null)

/** 행동지침 — AI 불필요, 경보를 확보하면 항상 호출 */
export function useGuidance(alert: Alert | undefined) {
  return useStep<GuidanceResult>(alertKey(alert), () => getGuidance(alert!))
}

/** AI 번역 — 경보당 1회(캐시). 서버에 AI 설정이 없으면 호출하지 않는다 */
export function useTranslation(alert: Alert | undefined) {
  const { aiConfigured, loading } = useHealth()
  // health 확인 전에는 호출하지 않는다 (AI 설정이 없는 서버에 503 요청을 보내지 않도록)
  let blocked: Step<AlertTranslation> | undefined
  if (loading) blocked = { state: 'waiting' }
  else if (aiConfigured === false) blocked = { state: 'unavailable', message: AI_UNAVAILABLE_TEXT }
  return useStep<AlertTranslation>(alertKey(alert), () => translateAlert(alert!), blocked)
}

/** 번역 검증 — 번역이 끝난 뒤, enabled일 때만(상세 화면 진입 시) 1회(캐시) */
export function useVerification(alert: Alert | undefined, translation: Step<AlertTranslation>, enabled: boolean) {
  let blocked: Step<Verification> | undefined
  if (translation.state === 'unavailable') blocked = { state: 'unavailable', message: translation.message }
  else if (translation.state === 'error') blocked = { state: 'error', message: '번역을 받지 못해 검증하지 못했어요.' }
  else if (translation.state !== 'done') blocked = { state: 'waiting' }

  const key = enabled && alert && translation.state === 'done' ? `${alertKey(alert)}|${translation.data.translation.length}` : null
  return useStep<Verification>(key, () => verifyTranslation(alert!, (translation as { data: AlertTranslation }).data), blocked)
}
