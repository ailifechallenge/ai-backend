import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getHealth } from '@/services/healthService'

export interface HealthState {
  /** true: AI 사용 가능 · false: 서버에 AI 설정 없음 · null: 확인 중이거나 확인 실패 */
  aiConfigured: boolean | null
  loading: boolean
}

const HealthContext = createContext<HealthState>({ aiConfigured: null, loading: true })

export const AI_UNAVAILABLE_TEXT = 'AI 번역을 쓸 수 없어요 (서버에 AI 설정 없음)'

/** 앱 시작 시 /api/health를 한 번 확인해 AI 사용 가능 여부를 모든 화면에 공유한다 */
export function HealthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HealthState>({ aiConfigured: null, loading: true })

  useEffect(() => {
    let alive = true
    getHealth()
      .then((h) => alive && setState({ aiConfigured: h.ai_configured, loading: false }))
      // health 실패는 "AI 없음"으로 단정하지 않는다 → 번역 호출 시 실제 오류를 보여 준다
      .catch(() => alive && setState({ aiConfigured: null, loading: false }))
    return () => {
      alive = false
    }
  }, [])

  return <HealthContext.Provider value={state}>{children}</HealthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHealth(): HealthState {
  return useContext(HealthContext)
}
