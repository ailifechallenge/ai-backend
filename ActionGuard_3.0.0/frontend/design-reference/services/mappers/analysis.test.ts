import { describe, expect, it } from 'vitest'
import type { AlertTranslation } from '@/types'
import { mapAlert } from './alert'
import { alertLinkBody, mapGuidance, mapTranslation, mapVerification, toVerifyBody } from './analysis'
import { API_ALERT } from './fixtures'

const alert = mapAlert(API_ALERT, new Date('2026-10-15T19:20:00Z'))

const translation: AlertTranslation = {
  translation: '번역문',
  hazardExplanation: '설명 한 문장',
  glossary: [
    { term: 'Warning', meaning: '경보' },
    { term: 'Flash Flood', meaning: '돌발홍수' },
  ],
  summary: ['요약1', '요약2'],
  instructionKo: '높은 곳으로 이동하세요.',
}

describe('alertLinkBody', () => {
  it('원문 text와 alert_id만 보낸다 (country 없음)', () => {
    expect(alertLinkBody(alert)).toEqual({ text: API_ALERT.text, alert_id: API_ALERT.id })
  })
})

describe('toVerifyBody', () => {
  it('displayed는 문자열만, 배열은 줄바꿈으로 합치고 translation 키는 넣지 않는다', () => {
    const body = toVerifyBody(alert, translation)
    expect(body.translation).toBe('번역문')
    expect(body.alert_id).toBe(API_ALERT.id)
    expect(body.text).toBe(API_ALERT.text)
    expect(body.displayed).toEqual({
      summary: '요약1\n요약2',
      hazard_explanation: '설명 한 문장',
      instruction_translation_ko: '높은 곳으로 이동하세요.',
      glossary: 'Warning: 경보\nFlash Flood: 돌발홍수',
    })
    expect('translation' in body.displayed).toBe(false)
    expect(Object.keys(body.displayed).length).toBeLessThanOrEqual(4)
    expect(Object.keys(body).sort()).toEqual(['alert_id', 'displayed', 'text', 'translation'])
  })

  it('비어 있는 항목·null 번역은 보내지 않는다', () => {
    const body = toVerifyBody(alert, { ...translation, summary: [], glossary: [], instructionKo: null, hazardExplanation: ' ' })
    expect(body.displayed).toEqual({})
  })
})

describe('mapGuidance', () => {
  it('카드 필드 매핑', () => {
    const g = mapGuidance({
      cards: [
        { title: 'T', text: 'Move to higher ground now.', category: 'official', agency: 'NWS', url: 'u', condition: 'c', checked_at: 'x' },
      ],
      provenance: 'NWS API 원문 일치',
      limitations: ['l'],
    })
    expect(g.cards[0]).toEqual({
      category: 'official',
      title: 'T',
      text: 'Move to higher ground now.',
      agency: 'NWS',
      url: 'u',
      condition: 'c',
      checkedAt: 'x',
    })
    expect(g.limitations).toEqual(['l'])
  })
})

describe('mapTranslation', () => {
  it('instruction_translation_ko가 없으면 null', () => {
    const t = mapTranslation({ translation: 't', hazard_explanation: 'h', glossary: [], summary: [] })
    expect(t.instructionKo).toBeNull()
    expect(t.hazardExplanation).toBe('h')
  })
})

describe('mapVerification', () => {
  it('issue 필드 매핑과 기본값', () => {
    const v = mapVerification({
      status: '불일치 탐지',
      issues: [{ kind: 'end_time', severity: 'critical', source_quote: 'Until 630 PM', translation_quote: null, reason: 'r' }],
      unresolved: ['u'],
    })
    expect(v.status).toBe('불일치 탐지')
    expect(v.issues[0]).toEqual({
      field: 'translation',
      kind: 'end_time',
      severity: 'critical',
      sourceQuote: 'Until 630 PM',
      translationQuote: null,
      reason: 'r',
      method: 'ai',
    })
    expect(v.unresolved).toEqual(['u'])
    expect(v.checkedFields).toEqual([])
  })
})
