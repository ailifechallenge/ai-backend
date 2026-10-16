export type AlertStatus = 'active' | 'expired' | 'cancelled' | 'incomplete'

/** 행동지침 카드 (/api/guidance). official = 경보 원문의 공식 행동지시(영문 그대로), general = 일반 안전수칙 */
export interface GuidanceCard {
  category: 'official' | 'general'
  title: string
  text: string
  agency: string
  url: string
  condition: string
  checkedAt: string
}

export interface GuidanceResult {
  cards: GuidanceCard[]
  provenance: string
  limitations: string[]
}

export interface GlossaryEntry {
  term: string
  meaning: string
}

/** AI 번역 결과 (/api/translate) */
export interface AlertTranslation {
  translation: string
  /** 재난 유형 설명 한 문장 */
  hazardExplanation: string
  glossary: GlossaryEntry[]
  summary: string[]
  /** 공식 행동지시(instruction)의 한국어 번역 */
  instructionKo: string | null
}

export type VerifyStatus = '불일치 미탐지' | '오류 의심' | '불일치 탐지' | '검증 불가'

export type IssueKind =
  | 'hazard'
  | 'area'
  | 'issued_time'
  | 'message_expiration'
  | 'start_time'
  | 'end_time'
  | 'level'
  | 'audience'
  | 'required_action'
  | 'recommended_action'
  | 'prohibition'
  | 'number_unit'
  | 'negation'
  | 'condition'

export type DisplayField = 'translation' | 'summary' | 'hazard_explanation' | 'instruction_translation_ko' | 'glossary'

export interface VerificationIssue {
  field: DisplayField
  kind: IssueKind
  severity: 'critical' | 'minor'
  sourceQuote: string | null
  translationQuote: string | null
  reason: string
  method: 'rule' | 'ai'
}

/** 번역 검증 결과 (/api/verify) */
export interface Verification {
  status: VerifyStatus
  issues: VerificationIssue[]
  /** 확인하지 못한 항목 */
  unresolved: string[]
  checkedFields: DisplayField[]
}

export type ShelterStatus = 'operating_confirmed' | 'designated_unconfirmed' | 'suitability_check' | 'no_route'

export interface Shelter {
  id: string
  marker: string
  name: string
  address?: string
  distanceLabel: string
  /** 역할 (예: 공식 대피 시설) */
  operator: string
  /** 서버 status_label 그대로 (프론트가 더 강한 표현으로 바꾸지 않는다) */
  statusLabel: string
  /** 서버 status === 'open' */
  open: boolean
  typeLabel?: string
  /** 해당 재난 적합성 확인 필요 (hazard_compatibility === 'unknown') */
  suitabilityUnknown: boolean
  /** SVG 약도 좌표 (0~100) */
  mapX: number
  mapY: number
}

export interface ShelterSearchResult {
  shelters: Shelter[]
  /** 조회 원점(내 위치)의 SVG 약도 좌표 */
  origin: { x: number; y: number }
  warnings: string[]
  note: string
  checkedAt: string
  source: string
  truncated: boolean
}

export interface AlertChange {
  atLocalLabel: string
  textKo: string
}

export interface Alert {
  /** live: NWS 경보 URL (슬래시·콜론 포함). 라우트 링크는 encodeURIComponent로 만든다 */
  id: string
  nameEn: string
  /** 확실한 이름 사전에 있을 때만 한국어, 없으면 영문 그대로 (번역을 지어내지 않는다) */
  nameKo: string
  areaLabel: string
  /** mock 전용 (evaluateOverlap). live 겹침 판정은 서버가 한다 */
  areaCodes?: string[]
  severity?: string
  /** 발표 (sent) */
  sentAtUtc: string | null
  /** 시작 (onset ?? effective) */
  startsAtUtc: string | null
  /** 종료 예정 (ends) */
  endsAtUtc: string | null
  /** 메시지 만료 (expires) — 재난 종료가 아니다 */
  messageExpiresAtUtc: string | null
  cancelledAtUtc?: string | null
  /** 서버가 공식 경보를 조회한 시각 (checked_at) */
  checkedAtUtc: string
  /** 발표 기관 (sender) */
  source: string
  sourceUrl: string | null
  status: AlertStatus
  /** 공식 행동지시 영문 원문 (instruction, 없으면 빈 문자열) */
  instructionEn: string
  /**
   * required: 대피 이동 지시 여부. basis: mock 데이터 값 / rule = lib/evacuation.ts 임시 규칙
   * (서버에 구조화 필드가 없음 — 규칙에 안 맞는다고 대피 불필요를 뜻하지 않는다)
   */
  evacuation: { required: boolean; basis: 'mock' | 'rule' }
  /** 공식 원문 (백엔드 alert.text) — translate·verify·guidance 등에 그대로 보낸다 */
  originalTextEn: string
  /** mock 전용: "받은 문자 확인" 시연 문구 */
  receivedSmsText?: string
  /** live에서는 서버가 주지 않으므로 비어 있다 */
  changes: AlertChange[]
}

export type ScheduleKind = 'stay' | 'move' | 'visit'

export interface ScheduleItem {
  id: string
  kind: ScheduleKind
  title: string
  startUtc: string
  endUtc?: string
  address?: string
  /** mock 전용 (evaluateOverlap) */
  areaCode?: string
  /** 아래는 live 겹침 판정용. 예전에 저장된 일정에는 없을 수 있다 */
  latitude?: number
  longitude?: number
  /** IANA 시간대 (예: America/Chicago) */
  timezone?: string
  country?: 'US' | 'JP'
}

export type OverlapStatus = 'confirmed' | 'possible' | 'unconfirmed' | 'expired' | 'undeterminable'

export interface OverlapResult {
  status: OverlapStatus
  evidenceKo: string
  source?: string
  /** 종료 시각이 없어 3시간으로 가정해 비교했는지 */
  assumedEnd?: boolean
}

export interface ChatSource {
  title: string
  quote: string
  url?: string
}

/** 서버 답변 방식 (backend ChatAnswer.mode) */
export type ChatMode = 'evidence' | 'rule' | 'unavailable' | 'live' | 'scope' | 'clarify'

/** 서버가 분류한 질문 의도 (backend ChatIntent) — 다음 질문의 previous_intent로 돌려보낸다 */
export type ChatIntent =
  | 'alerts'
  | 'shelters'
  | 'navigation'
  | 'analysis'
  | 'urgency'
  | 'guidance'
  | 'itinerary'
  | 'notifications'
  | 'japan_disasters'
  | 'app_help'
  | 'alert_question'
  | 'scope'
  | 'greeting'
  | 'clarify'

/** 답변에 붙은 실제 조회 결과 (경보·대피시설·정보) */
export interface ChatItem {
  kind: 'alert' | 'shelter' | 'info'
  title: string
  detail: string
  status: string
  distanceLabel?: string
}

/** 답변에서 이어지는 앱 화면 (이 앱에 있는 화면으로 바꾼 경로만) */
export interface ChatAction {
  label: string
  path: string
}

/** 사진 속 문자 읽기 결과 카드 */
export type OcrCard =
  | { state: 'reading' }
  | { state: 'done'; text: string; note: string; matched: boolean | null; matchText: string }
  | { state: 'error'; message: string }

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  overlapStatus?: OverlapStatus
  /** 봇 답변의 출처·확인 시각 메타 (봇 메시지는 항상 포함) */
  meta?: string
  /** live 답변 방식: 근거 기반 AI / 규칙 계산 / AI 연결 불가 */
  mode?: ChatMode
  intent?: ChatIntent
  sources?: ChatSource[]
  items?: ChatItem[]
  actions?: ChatAction[]
  /** 조회 범위 안내 (예: 등록한 위치 기준 · 직선거리 순) */
  scopeNote?: string
  /** 실제 조회 결과 설명 등에 AI가 쓰였는지 */
  aiUsed?: boolean
  /** 화면 전용 말풍선(인사말·오류) — 서버 history에 보내지 않는다 */
  local?: boolean
  /** 오류 말풍선의 다시 시도용 질문 */
  retryQuestion?: string
  /** 사용자가 첨부한 사진 (브라우저 object URL) */
  imageUrl?: string
  /** 사진 속 문자 읽기 처리 상태·결과 */
  ocr?: OcrCard
}

export type Scenario = 'flood' | 'tornado' | 'unknown' | 'expired'

/* ── 대응 4단계 (/api/urgency) — 앱 참고 척도이며 공식 경보 등급이 아니다 ── */

export type UrgencyLevel = 1 | 2 | 3 | 4

export type UrgencyActionKind = 'monitor' | 'caution' | 'prepare' | 'protect' | 'shelter' | 'higher_ground' | 'evacuate' | 'unknown'

export interface UrgencyAssessment {
  /** null = 확인 필요 (임의로 낮은 단계에 넣지 않는다) */
  level: UrgencyLevel | null
  label: '정보' | '주의' | '대비' | '대피' | '확인 필요'
  actionKind: UrgencyActionKind
  headline: string
  meaning: string
  actions: string[]
  evidence: { quote: string; explanation: string }[]
  sources: { title: string; url: string }[]
  provenance: 'official' | 'input' | 'example'
  applicability: string
  notice: string
  /** 취소·만료·시험 메시지 — 현재 단계로 강조하지 않는다 */
  inactive: boolean
  method: 'rules' | 'ai' | 'rules_fallback'
  methodNote: string
}

/** 판정 진행 단계: 규칙 판정 중 → AI 해석 중 → 완료 / AI 실패(기본 판정 유지) */
export type UrgencyPhase = 'rules' | 'ai' | 'done' | 'ai_failed'
