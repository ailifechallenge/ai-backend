/**
 * 백엔드(/api) 호출 래퍼.
 * - 엔드포인트별 타임아웃 (verify 300초, translate·chat 120초, 나머지 45초)
 * - 실패는 항상 ApiError로 던진다 (빈 결과로 바꾸지 않는다)
 * - 응답의 필수 배열·문자열 필드를 확인한다
 * - 같은 요청이 진행 중이면 그 Promise를 재사용한다 (StrictMode 이중 실행 등)
 */

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'format'

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind

  constructor(message: string, status: number, kind: ApiErrorKind) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
  }
}

export const API_BASE = '/api'

const TIMEOUT_MS: Record<string, number> = { verify: 300_000, translate: 120_000, chat: 120_000, ocr: 120_000 }
const DEFAULT_TIMEOUT_MS = 45_000

/** 응답에 반드시 배열이어야 하는 필드 */
const REQUIRED_ARRAYS: Record<string, string[]> = {
  alerts: ['alerts'],
  guidance: ['cards', 'limitations'],
  translate: ['glossary', 'summary'],
  verify: ['issues', 'unresolved', 'checks'],
  conflict: ['reasons'],
  chat: ['sources'],
  shelters: ['shelters', 'warnings'],
  urgency: ['actions', 'evidence', 'sources'],
}

/** 응답에 반드시 문자열이어야 하는 필드 */
const REQUIRED_STRINGS: Record<string, string[]> = {
  alerts: ['checked_at'],
  translate: ['translation'],
  verify: ['status'],
  conflict: ['status'],
  chat: ['answer'],
  ocr: ['text', 'note'],
  urgency: ['label', 'headline'],
}

export const FORMAT_ERROR_MESSAGE = '서버 응답 형식이 올바르지 않아요. 다시 시도해 주세요.'
export const NETWORK_ERROR_MESSAGE = '서버에 연결하지 못했어요. 백엔드 실행 상태와 인터넷 연결을 확인해 주세요.'
export const TIMEOUT_ERROR_MESSAGE = '응답 시간이 초과됐어요. 잠시 후 다시 시도해 주세요.'

export function statusMessage(status: number): string {
  if (status >= 500) return '서버에 연결할 수 없거나 서버 처리에 실패했어요. 잠시 후 다시 시도해 주세요.'
  if (status === 404) return '요청한 기능을 찾을 수 없어요. 서버 주소와 버전을 확인해 주세요.'
  if (status === 429) return '요청 한도에 도달했어요. 잠시 후 다시 시도해 주세요.'
  if (status === 422) return '입력값을 확인해 주세요.'
  return '요청을 처리하지 못했어요. 다시 시도해 주세요.'
}

/** "translate?x=1" → "translate", "alerts" → "alerts" */
function endpointOf(path: string): string {
  return path.replace(/^\/+/, '').split('?')[0]
}

function validateShape(endpoint: string, data: unknown): void {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new ApiError(FORMAT_ERROR_MESSAGE, 200, 'format')
  }
  const obj = data as Record<string, unknown>
  const badArray = (REQUIRED_ARRAYS[endpoint] ?? []).some((key) => !Array.isArray(obj[key]))
  const badString = (REQUIRED_STRINGS[endpoint] ?? []).some((key) => typeof obj[key] !== 'string')
  if (badArray || badString) throw new ApiError(FORMAT_ERROR_MESSAGE, 200, 'format')
}

async function readJson(response: Response): Promise<unknown> {
  const raw = await response.text()
  try {
    return JSON.parse(raw) as unknown
  } catch {
    if (response.ok) throw new ApiError(FORMAT_ERROR_MESSAGE, response.status, 'format')
    throw new ApiError(statusMessage(response.status), response.status, 'http')
  }
}

async function send<T>(path: string, init: RequestInit): Promise<T> {
  const endpoint = endpointOf(path)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS[endpoint] ?? DEFAULT_TIMEOUT_MS)

  try {
    let response: Response
    try {
      response = await fetch(`${API_BASE}/${path.replace(/^\/+/, '')}`, { ...init, signal: controller.signal })
    } catch {
      if (controller.signal.aborted) throw new ApiError(TIMEOUT_ERROR_MESSAGE, 0, 'timeout')
      throw new ApiError(NETWORK_ERROR_MESSAGE, 0, 'network')
    }

    let data: unknown
    try {
      data = await readJson(response)
    } catch (error) {
      if (controller.signal.aborted) throw new ApiError(TIMEOUT_ERROR_MESSAGE, 0, 'timeout')
      throw error
    }

    if (!response.ok) {
      // HTTPException: detail 문자열(한국어) / 입력 검증 실패: detail 배열·객체
      const detail = data && typeof data === 'object' && 'detail' in data ? (data as { detail: unknown }).detail : undefined
      const message = typeof detail === 'string' && detail.trim() ? detail : statusMessage(response.status)
      throw new ApiError(message, response.status, 'http')
    }

    validateShape(endpoint, data)
    return data as T
  } finally {
    clearTimeout(timer)
  }
}

const inFlight = new Map<string, Promise<unknown>>()

function dedupe<T>(key: string, run: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key)
  if (existing) return existing as Promise<T>
  const promise = run().finally(() => inFlight.delete(key))
  inFlight.set(key, promise)
  return promise
}

export function apiGet<T>(path: string): Promise<T> {
  return dedupe(`GET ${path}`, () => send<T>(path, { method: 'GET' }))
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  const json = JSON.stringify(body)
  return dedupe(`POST ${path} ${json}`, () =>
    send<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json }),
  )
}

/** 파일 업로드 (multipart). Content-Type은 브라우저가 boundary와 함께 정한다. 파일 요청은 중복 제거하지 않는다 */
export function apiUpload<T>(path: string, form: FormData): Promise<T> {
  return send<T>(path, { method: 'POST', body: form })
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/** 화면에 보여 줄 에러 문구 */
export function errorMessage(error: unknown): string {
  return isApiError(error) ? error.message : '알 수 없는 오류가 발생했어요. 다시 시도해 주세요.'
}
