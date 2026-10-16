import { isMock } from '@/config/api'
import { MOCK_GUIDANCE, MOCK_TRANSLATION, MOCK_VERIFICATION } from '@/mocks/analysis'
import type { Alert, AlertTranslation, GuidanceResult, Verification } from '@/types'
import { refetchAlert } from './alertService'
import { ApiError, apiPost, isApiError } from './http'
import {
  alertLinkBody,
  mapGuidance,
  mapTranslation,
  mapVerification,
  toVerifyBody,
  type ApiGuidance,
  type ApiTranslation,
  type ApiVerification,
} from './mappers/analysis'

/*
 * 행동지침(AI 불필요) · 번역 · 검증.
 * AI 호출 예산(서버 전체 하루 40회)을 지키려고 번역·검증 결과는 경보 id + 원문 해시로 캐시해
 * 같은 경보에서 다시 호출하지 않는다 (모듈 메모리 + sessionStorage).
 */

const memory = new Map<string, unknown>()

/** FNV-1a 32bit — 캐시 키용 원문 해시 */
export function hashText(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

function cacheKey(kind: string, alert: Alert): string {
  return `ag.${kind}.${alert.id}.${hashText(alert.originalTextEn)}`
}

function readCache<T>(key: string): T | undefined {
  if (memory.has(key)) return memory.get(key) as T
  try {
    const raw = sessionStorage.getItem(key)
    if (raw) {
      const value = JSON.parse(raw) as T
      memory.set(key, value)
      return value
    }
  } catch {
    // 저장소를 못 쓰면 메모리 캐시만 쓴다
  }
  return undefined
}

function writeCache<T>(key: string, value: T, persist: boolean): T {
  memory.set(key, value)
  if (persist) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 저장 실패 시 메모리 캐시만 쓴다
    }
  }
  return value
}

export const RELINK_FAILED_MESSAGE = '공식 경보 연결이 만료됐고, 다시 조회한 목록에서 이 경보를 찾지 못했어요. 홈에서 경보를 다시 확인하세요.'

/**
 * 409(공식 경보 연결 만료·원문 변경)면 경보를 다시 조회해 한 번만 재시도한다. 무한 재시도하지 않는다.
 */
export async function withRelink<T>(alert: Alert, call: (a: Alert) => Promise<T>, refetch = refetchAlert): Promise<T> {
  try {
    return await call(alert)
  } catch (e) {
    if (!isApiError(e) || e.status !== 409) throw e
    const fresh = await refetch(alert.id)
    if (!fresh) throw new ApiError(RELINK_FAILED_MESSAGE, 409, 'http')
    return call(fresh)
  }
}

const FALLBACK_GUIDANCE: GuidanceResult = { cards: [], provenance: '', limitations: [] }

export async function getGuidance(alert: Alert): Promise<GuidanceResult> {
  if (isMock()) return MOCK_GUIDANCE[alert.id] ?? FALLBACK_GUIDANCE
  const key = cacheKey('guidance', alert)
  const hit = readCache<GuidanceResult>(key)
  if (hit) return hit
  const result = await withRelink(alert, (a) => apiPost<ApiGuidance>('guidance', alertLinkBody(a)))
  return writeCache(key, mapGuidance(result), false)
}

export async function translateAlert(alert: Alert): Promise<AlertTranslation> {
  if (isMock()) {
    const mock = MOCK_TRANSLATION[alert.id]
    if (!mock) throw new ApiError('시연용 번역 데이터가 없어요.', 404, 'http')
    return mock
  }
  const key = cacheKey('translate', alert)
  const hit = readCache<AlertTranslation>(key)
  if (hit) return hit
  const result = await withRelink(alert, (a) => apiPost<ApiTranslation>('translate', alertLinkBody(a)))
  return writeCache(key, mapTranslation(result), true)
}

export async function verifyTranslation(alert: Alert, translation: AlertTranslation): Promise<Verification> {
  if (isMock()) {
    const mock = MOCK_VERIFICATION[alert.id]
    if (!mock) throw new ApiError('시연용 검증 데이터가 없어요.', 404, 'http')
    return mock
  }
  const key = `${cacheKey('verify', alert)}.${hashText(translation.translation)}`
  const hit = readCache<Verification>(key)
  if (hit) return hit
  const result = await withRelink(alert, (a) => apiPost<ApiVerification>('verify', toVerifyBody(a, translation)))
  return writeCache(key, mapVerification(result), true)
}

/** 이미 받은 번역이 있으면 돌려준다 (다른 화면에서 호출 없이 재사용) */
export function cachedTranslation(alert: Alert): AlertTranslation | undefined {
  if (isMock()) return MOCK_TRANSLATION[alert.id]
  return readCache<AlertTranslation>(cacheKey('translate', alert))
}
