/**
 * 임시 규칙 · 서버 필드 필요.
 * 백엔드에 "대피 이동 지시" 구조화 필드가 없어, 공식 행동지시(instruction 영문 원문)에
 * 아래 표현이 있을 때만 대피 이동 지시로 본다. 설명문(description)·AI 번역은 보지 않는다.
 * 표현이 없다고 "대피 불필요"로 단정하지 않는다 → 화면은 지도 버튼만 숨기고 공식 안내 링크를 둔다.
 */
const EVACUATION_PATTERNS = [/evacuat/i, /move to higher ground/i, /leave immediately/i]

export function evacuationInstructed(instruction: string | null | undefined): boolean {
  if (!instruction) return false
  return EVACUATION_PATTERNS.some((p) => p.test(instruction))
}

export type Disaster =
  | 'general'
  | 'hurricane'
  | 'tornado'
  | 'flood'
  | 'wildfire'
  | 'landslide'
  | 'storm_surge'
  | 'earthquake'
  | 'tsunami'
  | 'fire'
  | 'inland_flood'
  | 'volcano'

/** NWS 이벤트명 → /api/shelters disaster. 확실한 것만, 나머지는 general */
export function disasterFromEvent(event: string): Disaster {
  const e = event.toLowerCase()
  if (e.includes('storm surge')) return 'storm_surge'
  if (e.includes('tsunami')) return 'tsunami'
  if (e.includes('hurricane')) return 'hurricane'
  if (e.includes('tornado')) return 'tornado'
  if (e.includes('flood')) return 'flood'
  if (e.includes('earthquake')) return 'earthquake'
  return 'general'
}
