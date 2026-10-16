import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isMock } from '@/config/api'
import { getCurrentAlert } from '@/services/alertService'
import { errorMessage } from '@/services/http'
import type { Alert } from '@/types'
import { useScenario } from './ScenarioContext'

/** 경보가 이 시간보다 오래되면 화면 진입·판정 전에 다시 조회한다 (서버 보관 15분보다 여유 있게) */
export const ALERT_REFRESH_AFTER_MS = 10 * 60_000

export type AlertLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  /** 조회 성공 · 공식 경보 0건 (실패와 다른 상태) */
  | { status: 'empty'; checkedAtUtc: string }
  | { status: 'ready'; alert: Alert; otherCount: number }

interface AlertContextValue {
  load: AlertLoad
  retry: () => void
  /** 경보가 오래됐으면 다시 조회하고, 사용할 경보(없으면 null)를 돌려준다 */
  ensureFresh: () => Promise<Alert | null>
}

const AlertContext = createContext<AlertContextValue | null>(null)

function isStale(load: AlertLoad): boolean {
  if (isMock()) return false
  const checked = load.status === 'ready' ? load.alert.checkedAtUtc : load.status === 'empty' ? load.checkedAtUtc : null
  return checked !== null && Date.now() - Date.parse(checked) > ALERT_REFRESH_AFTER_MS
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const scenario = useScenario()
  const [load, setLoad] = useState<AlertLoad>({ status: 'loading' })
  const loadRef = useRef(load)
  const pending = useRef<Promise<Alert | null> | null>(null)

  const update = useCallback((next: AlertLoad) => {
    loadRef.current = next
    setLoad(next)
  }, [])

  const fetchNow = useCallback((): Promise<Alert | null> => {
    if (pending.current) return pending.current
    // 이미 표시 중인 경보가 있으면 갱신하는 동안 그대로 둔다 (깜빡임 방지)
    if (loadRef.current.status !== 'ready') update({ status: 'loading' })
    const run = getCurrentAlert(scenario)
      .then((r) => {
        update(r.alert ? { status: 'ready', alert: r.alert, otherCount: r.otherCount } : { status: 'empty', checkedAtUtc: r.checkedAtUtc })
        return r.alert
      })
      .catch((e: unknown) => {
        update({ status: 'error', message: errorMessage(e) })
        throw e
      })
      .finally(() => {
        pending.current = null
      })
    pending.current = run
    return run
  }, [scenario, update])

  useEffect(() => {
    fetchNow().catch(() => {
      /* 오류는 load 상태로 화면에 표시된다 */
    })
  }, [fetchNow])

  const ensureFresh = useCallback(async (): Promise<Alert | null> => {
    if (pending.current) return pending.current
    const current = loadRef.current
    if (current.status === 'error' || isStale(current)) return fetchNow()
    return current.status === 'ready' ? current.alert : null
  }, [fetchNow])

  const retry = useCallback(() => {
    fetchNow().catch(() => {
      /* 오류는 load 상태로 화면에 표시된다 */
    })
  }, [fetchNow])

  const value = useMemo(() => ({ load, retry, ensureFresh }), [load, retry, ensureFresh])
  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlertContext(): AlertContextValue {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('AlertProvider가 필요합니다')
  return ctx
}
