import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiGet, apiPost, FORMAT_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE, TIMEOUT_ERROR_MESSAGE } from './http'

function respond(status: number, body: string) {
  return vi.fn().mockResolvedValue(new Response(body, { status }))
}

async function catchError(p: Promise<unknown>): Promise<ApiError> {
  try {
    await p
  } catch (e) {
    return e as ApiError
  }
  throw new Error('expected rejection')
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('http', () => {
  it('성공 응답을 반환하고 /api 경로로 호출', async () => {
    const fetchMock = respond(200, JSON.stringify({ alerts: [], checked_at: '2026-10-16T00:00:00Z' }))
    vi.stubGlobal('fetch', fetchMock)
    const data = await apiGet<{ alerts: unknown[] }>('alerts?area=TX')
    expect(data.alerts).toEqual([])
    expect(fetchMock.mock.calls[0][0]).toBe('/api/alerts?area=TX')
  })

  it('문자열 detail은 그대로 메시지로', async () => {
    vi.stubGlobal('fetch', respond(409, JSON.stringify({ detail: '공식 경보 연결이 만료되었거나 원문이 변경되었습니다. 다시 조회하세요.' })))
    const e = await catchError(apiPost('translate', { text: 'x' }))
    expect(e).toBeInstanceOf(ApiError)
    expect(e.status).toBe(409)
    expect(e.message).toContain('공식 경보 연결이 만료')
  })

  it('배열 detail(422 검증 실패)은 일반 문구로', async () => {
    vi.stubGlobal('fetch', respond(422, JSON.stringify({ detail: [{ loc: ['body', 'x'], msg: 'extra' }] })))
    const e = await catchError(apiPost('conflict', { text: 'x' }))
    expect(e.status).toBe(422)
    expect(e.message).toBe('입력값을 확인해 주세요.')
  })

  it('비JSON 오류 응답은 상태코드 문구로', async () => {
    vi.stubGlobal('fetch', respond(502, '<html>Bad Gateway</html>'))
    const e = await catchError(apiGet('alerts?area=TX'))
    expect(e.status).toBe(502)
    expect(e.message).toContain('서버')
  })

  it('비JSON 성공 응답은 형식 오류', async () => {
    vi.stubGlobal('fetch', respond(200, 'not json'))
    const e = await catchError(apiGet('health'))
    expect(e.kind).toBe('format')
    expect(e.message).toBe(FORMAT_ERROR_MESSAGE)
  })

  it('필수 배열 필드가 없으면 형식 오류', async () => {
    vi.stubGlobal('fetch', respond(200, JSON.stringify({ checked_at: 'x' })))
    const e = await catchError(apiGet('alerts?area=TX'))
    expect(e.kind).toBe('format')
  })

  it('네트워크 실패', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const e = await catchError(apiGet('health'))
    expect(e.kind).toBe('network')
    expect(e.message).toBe(NETWORK_ERROR_MESSAGE)
  })

  it('타임아웃 (45초)', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
        }),
      ),
    )
    const pending = catchError(apiGet('health'))
    await vi.advanceTimersByTimeAsync(45_000)
    const e = await pending
    expect(e.kind).toBe('timeout')
    expect(e.message).toBe(TIMEOUT_ERROR_MESSAGE)
  })

  it('같은 요청이 진행 중이면 한 번만 호출', async () => {
    const fetchMock = respond(200, JSON.stringify({ answer: 'a', sources: [] }))
    vi.stubGlobal('fetch', fetchMock)
    const body = { text: 'x', question: 'q' }
    await Promise.all([apiPost('chat', body), apiPost('chat', body)])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
