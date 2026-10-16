import { useEffect } from 'react'
import { useAlertContext } from '@/context/AlertContext'

/**
 * 대표 경보와 조회 상태(loading / error / empty / ready).
 * 화면 진입 시 경보가 10분 넘게 지났으면 다시 조회한다.
 */
export function useCurrentAlert() {
  const { load, retry, ensureFresh } = useAlertContext()

  useEffect(() => {
    ensureFresh().catch(() => {
      /* 오류는 load 상태로 화면에 표시된다 */
    })
  }, [ensureFresh])

  return {
    load,
    alert: load.status === 'ready' ? load.alert : undefined,
    retry,
    ensureFresh,
  }
}
