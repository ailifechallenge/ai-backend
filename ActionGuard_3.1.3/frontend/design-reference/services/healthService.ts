import { isMock } from '@/config/api'
import { apiGet } from './http'

export interface ApiHealth {
  status: string
  ai_configured: boolean
  model: string
  ocr_available: boolean
}

/** mock 모드에서는 AI 기능이 있는 것처럼 동작한다 (mock 번역·검증 데이터 사용) */
export function getHealth(): Promise<ApiHealth> {
  if (isMock()) return Promise.resolve({ status: 'ok', ai_configured: true, model: 'mock', ocr_available: false })
  return apiGet<ApiHealth>('health')
}
