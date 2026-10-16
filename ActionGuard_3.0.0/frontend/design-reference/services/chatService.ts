import { isMock } from '@/config/api'
import { checkedLabel, validityLine } from '@/lib/alertTime'
import { evaluateOverlap, UNDETERMINABLE_TEXT } from '@/lib/evaluateOverlap'
import { formatLocalDayTime } from '@/lib/time'
import { DEMO_COORDS, DEMO_LOCATION_LABEL } from '@/config/demo'
import type { Alert, ChatIntent, ChatMessage, ChatMode, ScheduleItem } from '@/types'
import { cachedTranslation, withRelink } from './analysisService'
import { apiPost } from './http'
import { alertLinkBody } from './mappers/analysis'
import { toStayPayload, type StayPayload } from './mappers/conflict'
import { distanceLabel } from './mappers/shelter'

// 챗봇은 기획 F1~F8 밖의 기능이라 이 파일과 pages/Chat에만 격리한다.
// live: 백엔드 /api/chat (AI 호출 최대 4회의 비싼 엔드포인트 — 사용자가 보낼 때만 호출)
// mock: 현재 경보·일정 mock + evaluateOverlap 결과로만 답한다.

let seq = 0
const nextId = () => `bot-${Date.now()}-${seq++}`

export const CHAT_QUESTION_MAX = 1000
const HISTORY_MAX = 8
const HISTORY_TEXT_MAX = 1800

export function buildMeta(alert: Alert, now: Date): string {
  return `출처: ${alert.source} · 최신 확인 ${checkedLabel(alert)} · ${validityLine(alert, now)}`
}

/* ── live ── */

interface ApiChatItem {
  kind: 'alert' | 'shelter' | 'info'
  title: string
  detail: string
  status: string
  source: string
  path?: string | null
  distance_m?: number | null
}

/** backend ChatAnswer (2026-10-16 앱 전체 AI 도우미) */
export interface ApiChatAnswer {
  answer: string
  sources: { title: string; quote: string; url?: string | null }[]
  checked_at: string
  mode: ChatMode
  intent?: ChatIntent
  needs_location?: boolean
  items?: ApiChatItem[]
  actions?: { label: string; path: string }[]
  scope_note?: string | null
  ai_used?: boolean
}

interface ChatBody {
  text: string
  alert_id: string
  question: string
  history: { role: 'user' | 'assistant'; text: string }[]
  stay?: StayPayload
  location: { country: 'US' | 'JP'; lat: number; lon: number; name: string }
  previous_intent?: ChatIntent
}

/**
 * 서버가 주는 화면 경로는 백엔드 팀 앱 기준이라, 이 앱에 같은 역할의 화면이 있는 것만 바꿔 쓴다.
 * 없는 화면(/shelters, /notifications, /japan-disasters, /weather-alert, /chat)은 링크로 만들지 않는다.
 */
const PATH_MAP: Record<string, string> = { '/': '/home', '/itinerary': '/schedule' }

export function mapChatPath(path: string): string | null {
  const bare = path.split('?')[0]
  return PATH_MAP[bare] ?? null
}

export function mapChatAnswer(res: ApiChatAnswer): Omit<ChatMessage, 'id' | 'role' | 'meta'> {
  const actions = (res.actions ?? [])
    .map((a) => ({ label: a.label, path: mapChatPath(a.path) }))
    .filter((a): a is { label: string; path: string } => a.path !== null)
  return {
    text: res.answer,
    mode: res.mode,
    intent: res.intent,
    sources: res.sources.map((s) => ({ title: s.title, quote: s.quote, url: s.url ?? undefined })),
    items: (res.items ?? []).map((i) => ({
      kind: i.kind,
      title: i.title,
      detail: i.detail,
      status: i.status,
      distanceLabel: typeof i.distance_m === 'number' ? distanceLabel(i.distance_m) : undefined,
    })),
    actions: [...new Map(actions.map((a) => [a.path, a])).values()],
    scopeNote: res.scope_note ?? undefined,
    aiUsed: Boolean(res.ai_used),
  }
}

/** 서버 history: 인사말·오류 말풍선 제외, bot→assistant, 최근 8개, 1800자 */
export function toHistory(messages: ChatMessage[]): ChatBody['history'] {
  return messages
    .filter((m) => !m.local && m.text.trim())
    .map((m) => ({ role: m.role === 'bot' ? ('assistant' as const) : ('user' as const), text: m.text.trim().slice(0, HISTORY_TEXT_MAX) }))
    .slice(-HISTORY_MAX)
}

/** 겹침을 묻는 질문이면 관련 일정을 골라 stay로 함께 보낸다 (공항/내일/이동 → 이동, 호텔/숙소 → 숙박) */
export function pickStayItem(question: string, items: ScheduleItem[]): ScheduleItem | undefined {
  const q = question.replace(/\s/g, '')
  if (/공항|내일|이동/.test(q)) return items.find((i) => i.kind === 'move') ?? items.find((i) => i.title.includes('공항'))
  if (/호텔|숙소|숙박/.test(q)) return items.find((i) => i.kind === 'stay') ?? items.find((i) => /호텔|숙소|hotel/i.test(i.title))
  return undefined
}

export function buildChatBody(question: string, alert: Alert, items: ScheduleItem[], history: ChatMessage[]): ChatBody {
  const body: ChatBody = {
    ...alertLinkBody(alert),
    question: question.trim().slice(0, CHAT_QUESTION_MAX),
    history: toHistory(history),
    // 예시 위치(앱의 경보·대피시설 조회 기준과 같음). 서버는 좌표를 AI 모델에 보내지 않는다
    location: { country: 'US', lat: DEMO_COORDS.lat, lon: DEMO_COORDS.lon, name: DEMO_LOCATION_LABEL },
  }
  const item = pickStayItem(question, items)
  if (item) body.stay = toStayPayload(item).stay
  // 후속 질문("그럼 더 멀리는?")을 이어 가도록 직전 답변의 의도를 돌려보낸다
  const previous = [...history].reverse().find((m) => m.role === 'bot' && m.intent)?.intent
  if (previous) body.previous_intent = previous
  return body
}

async function askLive(question: string, alert: Alert, items: ScheduleItem[], history: ChatMessage[]): Promise<ChatMessage> {
  const res = await withRelink(alert, (a) => apiPost<ApiChatAnswer>('chat', buildChatBody(question, a, items, history)))
  return { id: nextId(), role: 'bot', ...mapChatAnswer(res) }
}

/* ── mock ── */

/** 받침 유무에 따라 '과/와' */
function withGwa(word: string): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  const hasFinal = code >= 0 && code <= 11171 && code % 28 !== 0
  return `${word}${hasFinal ? '과' : '와'}`
}

const NO_BASIS = `현재 확인된 경보 근거로는 답할 수 없어요. ${UNDETERMINABLE_TEXT}.`

function answerForItem(alert: Alert, item: ScheduleItem | undefined, now: Date): Omit<ChatMessage, 'id' | 'role' | 'meta'> {
  if (!item) return { text: NO_BASIS }
  const r = evaluateOverlap(alert, item, now)
  const when = formatLocalDayTime(item.startUtc, now)
  switch (r.status) {
    case 'confirmed':
      return {
        overlapStatus: r.status,
        text: `${when} ${item.title} 일정이 경보 지역·유효 시간과 겹쳐요. 공식 행동 안내를 먼저 확인하세요.`,
      }
    case 'possible':
      return {
        overlapStatus: r.status,
        text: `${when} ${item.title} 일정이 경보와 겹칠 가능성이 있어요. 근거: ${r.evidenceKo}.`,
      }
    case 'unconfirmed':
      return {
        overlapStatus: r.status,
        text: `현재 확인된 경보 기준으로는 ${when} ${withGwa(item.title)} 겹치는 부분이 없어요. 다만 경보는 바뀔 수 있고, 안전하다는 뜻은 아니에요.`,
      }
    case 'expired':
      return { overlapStatus: r.status, text: `이 경보는 만료·해제되었어요. ${r.evidenceKo}. 새 경보는 공식 안내를 확인하세요.` }
    case 'undeterminable':
      return { overlapStatus: r.status, text: `${item.title}: ${r.evidenceKo}.` }
  }
}

function askMock(question: string, alert: Alert, items: ScheduleItem[], now: Date): ChatMessage {
  const q = question.replace(/\s/g, '')
  let body: Omit<ChatMessage, 'id' | 'role' | 'meta'>

  if (/공항|내일/.test(q)) {
    body = answerForItem(alert, items.find((i) => i.kind === 'move') ?? items.find((i) => i.title.includes('공항')), now)
  } else if (/호텔|숙소|숙박/.test(q)) {
    body = answerForItem(alert, items.find((i) => i.kind === 'stay'), now)
  } else if (/행동|어떻게/.test(q)) {
    // 공식 행동지시(영문 원문 기반)가 있을 때만 그 번역을 보여 준다
    const ko = alert.status === 'active' && alert.instructionEn.trim() ? cachedTranslation(alert)?.instructionKo : null
    body = ko
      ? { text: `공식 행동지시(AI 번역):\n${ko}` }
      : { text: `공식 행동 안내를 확인할 수 없어요 — 현지 공식 안내를 확인하세요. ${UNDETERMINABLE_TEXT}.` }
  } else {
    body = { text: NO_BASIS }
  }
  return { id: nextId(), role: 'bot', meta: buildMeta(alert, now), ...body }
}

export function askChat(
  question: string,
  alert: Alert,
  items: ScheduleItem[],
  now: Date,
  history: ChatMessage[] = [],
): Promise<ChatMessage> {
  if (isMock()) return Promise.resolve(askMock(question, alert, items, now))
  return askLive(question, alert, items, history)
}
