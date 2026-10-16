import type { AlertStatus, ChatMode, DisplayField, IssueKind, OverlapStatus, ScheduleKind, ShelterStatus, VerifyStatus } from '@/types'

/** 상태 라벨·톤의 단일 출처. 톤은 StatusBadge의 CSS 클래스와 1:1. 초록·체크 등 "안전" 암시 톤은 두지 않는다. */
export type Tone = 'info' | 'caution' | 'neutral' | 'muted' | 'unknown'

export const OVERLAP_LABELS: Record<OverlapStatus, { label: string; tone: Tone }> = {
  confirmed: { label: '겹침 확인', tone: 'info' },
  possible: { label: '겹칠 가능성', tone: 'caution' },
  unconfirmed: { label: '겹침 미확인', tone: 'neutral' },
  expired: { label: '만료·해제', tone: 'muted' },
  undeterminable: { label: '판정 불가', tone: 'unknown' },
}

/** 서버 판정을 기다리는 중 */
export const OVERLAP_PENDING_LABEL: { label: string; tone: Tone } = { label: '확인 중', tone: 'unknown' }
/** 판정할 공식 경보가 없거나 불러오지 못함 — "겹침 없음"이 아니다 */
export const OVERLAP_NONE_LABEL: { label: string; tone: Tone } = { label: '판정 없음', tone: 'unknown' }

export const SHELTER_LABELS: Record<ShelterStatus, { label: string; tone: Tone }> = {
  operating_confirmed: { label: '운영 여부 확인됨', tone: 'info' },
  designated_unconfirmed: { label: '지정시설 · 현재 운영 미확인', tone: 'neutral' },
  suitability_check: { label: '해당 재난 적합성 확인 필요', tone: 'caution' },
  no_route: { label: '안전 경로 추천 불가', tone: 'unknown' },
}

/** 대피시설 상태 톤: 서버 status가 open일 때만 info, 그 외(planned·registered)는 neutral. 라벨은 서버 문구 그대로 */
export function shelterStatusTone(open: boolean): Tone {
  return open ? 'info' : 'neutral'
}

/** 번역 검증 상태 (서버 status 4종 그대로). "불일치 미탐지"도 안전·정확성 보증이 아니므로 neutral */
export const VERIFY_STATUS_LABELS: Record<VerifyStatus, { label: string; tone: Tone }> = {
  '불일치 미탐지': { label: '불일치 미탐지', tone: 'neutral' },
  '오류 의심': { label: '오류 의심', tone: 'caution' },
  '불일치 탐지': { label: '불일치 탐지', tone: 'caution' },
  '검증 불가': { label: '검증 불가', tone: 'unknown' },
}

/** 검증을 아직 못 했거나 할 수 없을 때 — "불일치 없음"으로 보이면 안 된다 */
export const NOT_VERIFIED_LABEL: { label: string; tone: Tone } = { label: '검증 안 됨', tone: 'unknown' }

export const ISSUE_KIND_LABELS: Record<IssueKind, string> = {
  hazard: '재난 유형',
  area: '지역',
  issued_time: '발표 시각',
  message_expiration: '메시지 만료',
  start_time: '시작 시각',
  end_time: '종료 시각',
  level: '등급',
  audience: '대상',
  required_action: '필수 행동',
  recommended_action: '권고 행동',
  prohibition: '금지사항',
  number_unit: '수치·단위',
  negation: '부정 표현',
  condition: '조건',
}

export const DISPLAY_FIELD_LABELS: Record<DisplayField, string> = {
  translation: '번역',
  summary: '요약',
  hazard_explanation: '설명',
  instruction_translation_ko: '행동지시 번역',
  glossary: '용어 풀이',
}

export const ISSUE_SEVERITY_LABELS: Record<'critical' | 'minor', { label: string; tone: Tone }> = {
  critical: { label: '중요', tone: 'caution' },
  minor: { label: '경미', tone: 'neutral' },
}

export const ISSUE_METHOD_LABELS: Record<'rule' | 'ai', string> = {
  rule: '규칙 검사',
  ai: 'AI 검사',
}

export const CHAT_MODE_LABELS: Record<ChatMode, string> = {
  evidence: '공식 경보·안내 근거 기반 AI 답변',
  rule: '규칙으로 계산한 결과',
  // 오류가 아니라 일부 조회·분석이 실패한 정상 응답 (실패를 "없음"으로 보지 않는다)
  unavailable: '일부 조회·분석 실패 · 확인된 내용만 안내',
  live: '공식 자료 실시간 조회 결과',
  scope: '앱 지원 범위 밖 질문',
  clarify: '추가 정보가 필요해요',
}

export const ALERT_STATUS_LABELS: Record<AlertStatus, { label: string; tone: Tone }> = {
  active: { label: '공식 경보', tone: 'info' },
  expired: { label: '만료됨', tone: 'muted' },
  cancelled: { label: '해제됨', tone: 'muted' },
  incomplete: { label: '정보 부족', tone: 'unknown' },
}

export const SCHEDULE_KIND_LABELS: Record<ScheduleKind, string> = {
  stay: '숙박',
  move: '이동',
  visit: '방문',
}
