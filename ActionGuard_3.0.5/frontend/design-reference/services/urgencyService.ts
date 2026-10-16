import { isMock } from '@/config/api'
import { MOCK_URGENCY } from '@/mocks/urgency'
import type { Alert, UrgencyAssessment } from '@/types'
import { withRelink } from './analysisService'
import { ApiError, apiPost } from './http'
import { alertLinkBody } from './mappers/analysis'

/** backend UrgencyAssessment */
interface ApiUrgency {
  level: 1 | 2 | 3 | 4 | null
  label: UrgencyAssessment['label']
  action_kind: UrgencyAssessment['actionKind']
  headline: string
  meaning: string
  actions: string[]
  evidence: { quote: string; explanation: string }[]
  sources: { title: string; url: string }[]
  provenance: UrgencyAssessment['provenance']
  applicability: string
  notice: string
  inactive?: boolean
  method?: UrgencyAssessment['method']
  method_note?: string
}

function mapUrgency(api: ApiUrgency): UrgencyAssessment {
  return {
    level: api.level,
    label: api.label,
    actionKind: api.action_kind,
    headline: api.headline,
    meaning: api.meaning,
    actions: api.actions,
    evidence: api.evidence,
    sources: api.sources,
    provenance: api.provenance,
    applicability: api.applicability,
    notice: api.notice,
    inactive: Boolean(api.inactive),
    method: api.method ?? 'rules',
    methodNote: api.method_note ?? '원문 표현을 기준으로 판단했어요.',
  }
}

/** AI 해석 결과는 경보(원문)당 1회만 요청하도록 메모리에 둔다 (AI 일일 한도) */
const aiCache = new Map<string, UrgencyAssessment>()
const cacheKey = (alert: Alert) => `${alert.id}|${alert.originalTextEn.length}`

/**
 * 대응 4단계 판정. useAi=false: 원문 규칙 판정(즉시, AI 없음) · true: Gemini 보조 판정(최대 약 25초)
 */
export async function assessUrgency(alert: Alert, useAi: boolean): Promise<UrgencyAssessment> {
  if (isMock()) {
    const mock = MOCK_URGENCY[alert.id]
    if (!mock) throw new ApiError('시연용 대응 단계 데이터가 없어요.', 404, 'http')
    if (!useAi) return mock.rules
    await new Promise((r) => setTimeout(r, 2500))
    return mock.ai
  }
  if (useAi) {
    const hit = aiCache.get(cacheKey(alert))
    if (hit) return hit
  }
  const res = await withRelink(alert, (a) => apiPost<ApiUrgency>('urgency', { ...alertLinkBody(a), use_ai: useAi }))
  const mapped = mapUrgency(res)
  if (useAi) aiCache.set(cacheKey(alert), mapped)
  return mapped
}
