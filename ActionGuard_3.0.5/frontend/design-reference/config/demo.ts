import { isMock } from './api'

/**
 * mock 모드의 고정 시계. mock 경보·일정이 이 시각 기준으로 작성되어 있다.
 * 2026-10-15 14:20 (Houston, CDT = UTC-5)
 */
export const DEMO_NOW_UTC = '2026-10-15T19:20:00Z'

/** 예시 위치 — 실제 위치 권한을 쓰지 않고 이 좌표로 경보·대피시설을 조회한다 */
export const DEMO_LOCATION_LABEL = 'Houston, TX'
export const DEMO_COORDS = { lat: 29.7604, lon: -95.3698 } as const

export const LOCAL_TIME_ZONE = 'America/Chicago'

/** mock: 고정 시계, live: 현재 시각 */
export function getNow(): Date {
  return isMock() ? new Date(DEMO_NOW_UTC) : new Date()
}
