import type {
  Alert,
  AlertTranslation,
  DisplayField,
  GuidanceResult,
  IssueKind,
  Verification,
  VerificationIssue,
  VerifyStatus,
} from '@/types'

/* ── 백엔드 응답 (backend/models/contracts.py) ── */

export interface ApiCard {
  title: string
  text: string
  category: 'official' | 'general'
  agency: string
  url: string
  condition: string
  checked_at: string
}

export interface ApiGuidance {
  cards: ApiCard[]
  provenance: string
  limitations: string[]
}

export interface ApiTranslation {
  translation: string
  hazard_explanation: string
  glossary: { term: string; meaning: string }[]
  summary: string[]
  instruction_translation_ko?: string | null
}

export interface ApiIssue {
  field?: DisplayField
  kind: IssueKind
  severity: 'critical' | 'minor'
  source_quote: string | null
  translation_quote: string | null
  reason: string
  method?: 'rule' | 'ai'
}

export interface ApiVerification {
  checked_fields?: DisplayField[]
  status: VerifyStatus
  issues: ApiIssue[]
  unresolved: string[]
}

/* ── 요청 body (extra="forbid": 정의된 필드만 보낸다) ── */

export interface AlertLinkBody {
  text: string
  alert_id: string
}

export interface VerifyBody extends AlertLinkBody {
  translation: string
  displayed: Partial<Record<Exclude<DisplayField, 'translation'>, string>>
}

/** 경보와 연결된 요청 body. country는 서버가 연결된 경보로 정한다 */
export function alertLinkBody(alert: Alert): AlertLinkBody {
  return { text: alert.originalTextEn, alert_id: alert.id }
}

/**
 * /api/verify body. displayed에는 문자열만(최대 4개), translation 키는 넣지 않는다(넣으면 422).
 * summary는 줄바꿈으로, glossary는 "term: meaning" 줄로 합친다.
 */
export function toVerifyBody(alert: Alert, t: AlertTranslation): VerifyBody {
  const displayed: VerifyBody['displayed'] = {}
  if (t.summary.length) displayed.summary = t.summary.join('\n')
  if (t.hazardExplanation.trim()) displayed.hazard_explanation = t.hazardExplanation
  if (t.instructionKo?.trim()) displayed.instruction_translation_ko = t.instructionKo
  if (t.glossary.length) displayed.glossary = t.glossary.map((g) => `${g.term}: ${g.meaning}`).join('\n')
  return { ...alertLinkBody(alert), translation: t.translation, displayed }
}

export function mapGuidance(api: ApiGuidance): GuidanceResult {
  return {
    cards: api.cards.map((c) => ({
      category: c.category,
      title: c.title,
      text: c.text,
      agency: c.agency,
      url: c.url,
      condition: c.condition,
      checkedAt: c.checked_at,
    })),
    provenance: api.provenance,
    limitations: api.limitations,
  }
}

export function mapTranslation(api: ApiTranslation): AlertTranslation {
  return {
    translation: api.translation,
    hazardExplanation: api.hazard_explanation,
    glossary: api.glossary.map((g) => ({ term: g.term, meaning: g.meaning })),
    summary: api.summary,
    instructionKo: api.instruction_translation_ko ?? null,
  }
}

function mapIssue(api: ApiIssue): VerificationIssue {
  return {
    field: api.field ?? 'translation',
    kind: api.kind,
    severity: api.severity,
    sourceQuote: api.source_quote,
    translationQuote: api.translation_quote,
    reason: api.reason,
    method: api.method ?? 'ai',
  }
}

export function mapVerification(api: ApiVerification): Verification {
  return {
    status: api.status,
    issues: api.issues.map(mapIssue),
    unresolved: api.unresolved,
    checkedFields: api.checked_fields ?? [],
  }
}
