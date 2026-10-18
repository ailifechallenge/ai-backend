import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiUpload } from './http'
import { OCR_MAX_BYTES, validateImage } from './ocrService'

afterEach(() => vi.unstubAllGlobals())

describe('validateImage', () => {
  it('허용 형식·크기', () => {
    expect(validateImage({ type: 'image/jpeg', size: 1000 })).toBeNull()
    expect(validateImage({ type: 'image/png', size: OCR_MAX_BYTES })).toBeNull()
  })
  it('형식 거부', () => {
    expect(validateImage({ type: 'image/gif', size: 10 })).toContain('PNG')
  })
  it('크기 거부', () => {
    expect(validateImage({ type: 'image/webp', size: OCR_MAX_BYTES + 1 })).toContain('6MB')
  })
})

describe('apiUpload', () => {
  it('multipart로 보내고 Content-Type을 직접 넣지 않는다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ text: 'Flash Flood Warning', note: 'n' }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const form = new FormData()
    form.append('file', new Blob(['x'], { type: 'image/png' }), 'a.png')
    const r = await apiUpload<{ text: string }>('ocr', form)
    expect(r.text).toBe('Flash Flood Warning')
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(fetchMock.mock.calls[0][0]).toBe('/api/ocr')
    expect(init.body).toBe(form)
    expect(init.headers).toBeUndefined()
  })
  it('OCR 엔진이 없으면(503) 서버 문구를 그대로', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: '무료 OCR 엔진 Tesseract가 설치되지 않았습니다.' }), { status: 503 })),
    )
    await expect(apiUpload('ocr', new FormData())).rejects.toMatchObject({ status: 503, message: '무료 OCR 엔진 Tesseract가 설치되지 않았습니다.' })
  })
})
