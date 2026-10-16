/**
 * API 모드 단일 지점.
 * - live (기본): FastAPI 백엔드 호출. 실패해도 mock으로 몰래 전환하지 않는다.
 * - mock: src/mocks 시연 데이터 (?scenario= 사용)
 */
export type ApiMode = 'live' | 'mock'

export function resolveApiMode(raw: string | undefined): ApiMode {
  return raw?.trim().toLowerCase() === 'mock' ? 'mock' : 'live'
}

export const API_MODE: ApiMode = resolveApiMode(import.meta.env.VITE_API_MODE)

export function isMock(): boolean {
  return API_MODE === 'mock'
}

/** 경보 조회 지역 (미국 주·영토 2글자). 비어 있으면 데모 좌표로 조회 */
export function resolveAlertArea(raw: string | undefined): string | null {
  const value = raw?.trim().toUpperCase()
  return value && /^[A-Z]{2}$/.test(value) ? value : null
}

export const ALERT_AREA = resolveAlertArea(import.meta.env.VITE_ALERT_AREA)
