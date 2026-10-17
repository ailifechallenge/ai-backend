import type { UrgencyAssessment } from '@/types'

// 시연용 예시 — 대응 4단계 기본 판정(rules)과 AI 보조 판정(ai). 키는 mock 경보 id.

const NOTICE = '앱이 행동의 시급함을 정리한 참고 척도예요. 공식 경보 등급이 아니에요.'
const SOURCE = [{ title: 'NWS 일반 경보 의미', url: 'https://www.weather.gov/sjt/WatchWarningAdvisoryExplained' }]

const base = {
  sources: SOURCE,
  provenance: 'example' as const,
  applicability: '선택한 경보의 지역·대상·유효시간에만 적용돼요. 현재 위치의 대피 명령 판정이 아니에요.',
  notice: NOTICE,
}

const floodRules: UrgencyAssessment = {
  ...base,
  level: 3,
  label: '대비',
  actionKind: 'prepare',
  headline: '돌발홍수 경보 — 지금 보호행동을 준비해요',
  meaning: '홍수가 발생 중이거나 임박했다는 경보예요.',
  actions: ['저지대·하천 주변을 피하고 높은 곳으로 이동할 준비를 하세요.', '물에 잠긴 도로를 건너지 마세요.'],
  evidence: [{ quote: 'Flash Flood Warning', explanation: '경보명 기준의 기본 판정이에요.' }],
  inactive: false,
  method: 'rules',
  methodNote: '원문 표현을 기준으로 판단했어요.',
}

const floodAi: UrgencyAssessment = {
  ...floodRules,
  level: 4,
  label: '대피',
  actionKind: 'higher_ground',
  headline: '돌발홍수 경보 — 높은 곳으로 이동하라는 지시가 있어요',
  actions: ['지금 높은 곳으로 이동하세요.', '물에 잠긴 도로는 건너지 말고 돌아가세요.'],
  evidence: [
    { quote: 'Move to higher ground now.', explanation: '원문 행동지시에 즉시 높은 곳으로 이동하라는 표현이 있어요.' },
    { quote: 'Flash Flood Warning', explanation: '경보명이에요.' },
  ],
  method: 'ai',
  methodNote: 'AI가 원문을 해석하고 근거·행동 조건을 확인했어요.',
}

const tornado: UrgencyAssessment = {
  ...base,
  level: 4,
  label: '대피',
  actionKind: 'shelter',
  headline: '토네이도 경보 — 지금 실내 안쪽으로 몸을 피해요',
  meaning: '토네이도가 관측됐거나 레이더로 탐지됐다는 경보예요.',
  actions: ['튼튼한 건물의 가장 낮은 층, 창문 없는 안쪽 방으로 이동하세요.', '머리와 목을 보호하세요.'],
  evidence: [{ quote: 'TAKE COVER NOW!', explanation: '원문에 즉시 몸을 피하라는 지시가 있어요.' }],
  inactive: false,
  method: 'rules',
  methodNote: '원문 표현을 기준으로 판단했어요.',
}

const unknown: UrgencyAssessment = {
  ...base,
  level: null,
  label: '확인 필요',
  actionKind: 'unknown',
  headline: '원문 정보가 부족해 대응 단계를 정하지 못했어요',
  meaning: '공식 원문을 직접 확인해 주세요.',
  actions: [],
  evidence: [],
  inactive: false,
  method: 'rules',
  methodNote: '원문 표현을 기준으로 판단했어요.',
}

const expired: UrgencyAssessment = {
  ...floodRules,
  level: null,
  label: '확인 필요',
  headline: '만료된 경보예요 — 현재 단계를 표시하지 않아요',
  inactive: true,
  methodNote: '취소·만료·훈련 상태를 우선 확인했어요.',
}

export const MOCK_URGENCY: Record<string, { rules: UrgencyAssessment; ai: UrgencyAssessment }> = {
  'nws-ffw-harris-001': { rules: floodRules, ai: floodAi },
  'nws-tor-harris-001': { rules: tornado, ai: { ...tornado, method: 'ai', methodNote: 'AI가 원문을 해석하고 근거·행동 조건을 확인했어요.' } },
  'nws-unknown-001': {
    rules: unknown,
    ai: { ...unknown, method: 'rules_fallback', methodNote: 'AI 근거가 부족해 기본 판정을 유지했어요.' },
  },
  'nws-ffw-harris-000': { rules: expired, ai: expired },
}
