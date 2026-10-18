import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { Scenario } from '@/types'

const SCENARIOS: Scenario[] = ['flood', 'tornado', 'unknown', 'expired']
const STORAGE_KEY = 'ag.scenario'

const ScenarioContext = createContext<Scenario>('flood')

function isScenario(v: string | null): v is Scenario {
  return v !== null && (SCENARIOS as string[]).includes(v)
}

/** ?scenario= 쿼리로 mock 경보를 바꾼다. 페이지 이동 후에도 유지되도록 sessionStorage에 기억한다. */
export function ScenarioProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation()

  const scenario = useMemo<Scenario>(() => {
    const fromQuery = new URLSearchParams(search).get('scenario')
    if (isScenario(fromQuery)) return fromQuery
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (isScenario(stored)) return stored
    } catch {
      /* 저장소 접근 불가 시 기본값 */
    }
    return 'flood'
  }, [search])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, scenario)
    } catch {
      /* 무시 */
    }
  }, [scenario])

  return <ScenarioContext.Provider value={scenario}>{children}</ScenarioContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScenario(): Scenario {
  return useContext(ScenarioContext)
}
