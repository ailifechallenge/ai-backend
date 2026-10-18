import { isMock } from '@/config/api'
import type { Alert } from '@/types'
import { apiUpload } from './http'

// 사용자가 직접 찍거나 고른 사진에서 문자를 읽는다 (/api/ocr, 서버의 무료 OCR 엔진 Tesseract).
// 앱이 휴대폰 재난문자를 자동으로 읽는 것이 아니라, 사용자가 올린 사진만 처리한다.

export const OCR_MAX_BYTES = 6 * 1024 * 1024
export const OCR_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export interface OcrResult {
  text: string
  note: string
}

/** 서버로 보내기 전 확인. 문제가 없으면 null */
export function validateImage(file: { type: string; size: number }): string | null {
  if (!OCR_TYPES.includes(file.type)) return 'PNG·JPEG·WEBP 사진만 올릴 수 있어요.'
  if (file.size > OCR_MAX_BYTES) return '사진은 6MB 이하로 올려 주세요.'
  return null
}

const MOCK_TEXT = 'Flash Flood Warning this area til 6:30 PM CDT. Avoid flooded areas. Check local media. -NWS'

export async function readImageText(file: File, alert?: Alert): Promise<OcrResult> {
  if (isMock()) {
    await new Promise((r) => setTimeout(r, 1200))
    return {
      text: alert?.receivedSmsText ?? MOCK_TEXT,
      note: '시연용 예시 결과예요. 실제 사진 내용과 관계없이 예시 문구를 보여 줘요.',
    }
  }
  const form = new FormData()
  form.append('file', file)
  return apiUpload<OcrResult>('ocr', form)
}
