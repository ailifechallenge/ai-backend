import { useCallback, useEffect, useState, type DependencyList } from 'react'
import { errorMessage } from '@/services/http'

interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  /** 실패 메시지 (실패를 빈 결과로 바꾸지 않는다) */
  error: string | null
}

/** Promise를 반환하는 서비스 호출을 상태로 감싼다 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ data: s.data, loading: true, error: null }))
    fn().then(
      (data) => alive && setState({ data, loading: false, error: null }),
      (e: unknown) => alive && setState({ data: undefined, loading: false, error: errorMessage(e) }),
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  return { ...state, reload }
}
