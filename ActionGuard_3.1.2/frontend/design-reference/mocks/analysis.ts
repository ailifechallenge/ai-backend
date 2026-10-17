import type { AlertTranslation, GuidanceResult, Verification } from '@/types'
import { FLOOD_INSTRUCTION, TORNADO_INSTRUCTION } from './alerts'
import { GLOSSARY } from './glossary'

// 시연용 예시 — 행동지침·AI 번역·검증 결과 (백엔드 응답과 같은 모양). 키는 mock 경보 id.

const CHECKED_AT = '2026-10-15T19:18:00Z'
const REVIEWED = '2026-10-15 (자료 검토일; 실시간 확인 아님)'

const LIMITATIONS = [
  '현지 당국의 공식 지시가 AI 설명보다 우선합니다.',
  '대피소 운영·안전 경로·시설 폐쇄 여부는 확인되지 않음.',
  '일반 수칙은 개인별 대피 명령이 아닙니다.',
]

const official = (text: string) => ({
  category: 'official' as const,
  title: '경보 원문의 공식 행동지시',
  text,
  agency: 'NWS',
  url: 'https://www.weather.gov/hgx/',
  condition: '해당 경보의 지역·대상·유효시간에만 적용',
  checkedAt: CHECKED_AT,
})

const floodGeneral = {
  category: 'general' as const,
  title: '홍수 일반 안전수칙',
  text: '물에 잠긴 도로는 걷거나 운전해서 건너지 마세요.\n물살이 약해 보여도 15cm 깊이의 흐르는 물에 넘어질 수 있어요.\n하천·배수로 주변에서 떨어져 있으세요.',
  agency: 'ActionGuard · NWS 자료 기반 일반 안내',
  url: 'https://www.weather.gov/safety/flood',
  condition: '홍수 관련 경보가 발효 중인 지역에 있을 때',
  checkedAt: REVIEWED,
}

const tornadoGeneral = {
  category: 'general' as const,
  title: '토네이도 일반 안전수칙',
  text: '튼튼한 건물의 가장 낮은 층, 창문 없는 안쪽 방으로 이동하세요.\n차 안이나 이동식 주택은 피난처가 되지 않아요.',
  agency: 'ActionGuard · NWS 자료 기반 일반 안내',
  url: 'https://www.weather.gov/safety/tornado',
  condition: '토네이도 경보가 발효 중인 지역에 있을 때',
  checkedAt: REVIEWED,
}

export const MOCK_GUIDANCE: Record<string, GuidanceResult> = {
  'nws-ffw-harris-001': { cards: [official(FLOOD_INSTRUCTION), floodGeneral], provenance: 'NWS API 원문 일치', limitations: LIMITATIONS },
  'nws-ffw-harris-000': { cards: [official(FLOOD_INSTRUCTION), floodGeneral], provenance: 'NWS API 원문 일치', limitations: LIMITATIONS },
  'nws-tor-harris-001': { cards: [official(TORNADO_INSTRUCTION), tornadoGeneral], provenance: 'NWS API 원문 일치', limitations: LIMITATIONS },
  'nws-unknown-001': {
    cards: [
      {
        category: 'general',
        title: '지금 할 일',
        text: '경보가 현재 위치와 시간에 적용되는지 확인하세요. 현지 당국의 최신 안내를 따르고, 위험 지역에 접근하지 마세요. 생명이나 신체에 즉각적인 위험이 있으면 현지 긴급전화에 연락하세요.',
        agency: 'ActionGuard · 일반 안전안내',
        url: 'https://www.ready.gov/alerts',
        condition: '공식 행동지시나 재난 유형별 안전수칙을 확인할 수 없을 때의 기본 안내',
        checkedAt: REVIEWED,
      },
    ],
    provenance: 'NWS API 원문 일치',
    limitations: LIMITATIONS,
  },
}

const floodTranslation: AlertTranslation = {
  translation:
    '돌발홍수 경보 · 미국 국립기상청 휴스턴/갤버스턴\n해리스 카운티(텍사스 남동부)에 돌발홍수 경보가 발표되었습니다.\n오후 1시 45분(CDT) 레이더에 폭우를 동반한 뇌우가 탐지되었습니다. 돌발홍수가 진행 중이거나 곧 시작될 것으로 보입니다.\n지금 높은 곳으로 이동하세요. 생명을 지키기 위해 빠르게 행동하세요.',
  hazardExplanation: '홍수가 발생 중이거나 임박했다는 공식 경보예요.',
  glossary: [GLOSSARY.warning, GLOSSARY.watch, GLOSSARY.flashFlood, GLOSSARY.shelterInPlace, GLOSSARY.higherGround],
  summary: ['해리스 카운티에 돌발홍수 경보', '폭우로 돌발홍수가 진행 중이거나 임박', '지금 높은 곳으로 이동'],
  instructionKo:
    '지금 높은 곳으로 이동하세요. 생명을 지키기 위해 빠르게 행동하세요.\n물에 잠긴 도로를 만나면 건너지 말고 돌아가세요.\n현지 방송이나 NOAA 기상 라디오로 갱신 정보를 확인하세요.',
}

export const MOCK_TRANSLATION: Record<string, AlertTranslation> = {
  'nws-ffw-harris-001': floodTranslation,
  'nws-ffw-harris-000': floodTranslation,
  'nws-tor-harris-001': {
    translation:
      '토네이도 경보 · 미국 국립기상청 휴스턴/갤버스턴\n해리스 카운티에 오후 3시(CDT)까지 토네이도 경보가 발표되었습니다.\n지금 몸을 피하세요! 튼튼한 건물의 지하나 가장 낮은 층의 안쪽 방으로 이동하세요.',
    hazardExplanation: '토네이도가 관측되었거나 레이더로 탐지되어 즉시 몸을 피해야 한다는 공식 경보예요.',
    glossary: [GLOSSARY.warning, GLOSSARY.watch, GLOSSARY.takeCover, GLOSSARY.shelterInPlace],
    summary: ['해리스 카운티에 오후 3시까지 토네이도 경보', '지금 실내 가장 낮은 층 안쪽 방으로 이동'],
    instructionKo:
      '지금 몸을 피하세요! 튼튼한 건물의 지하나 가장 낮은 층의 안쪽 방으로 이동하세요.\n창문을 피하고 머리와 목을 보호하세요.',
  },
  'nws-unknown-001': {
    translation: '특별 기상 정보 · 미국 국립기상청\n(메시지 본문을 받지 못했습니다 — 일부 데이터만 수신)',
    hazardExplanation: '경보 세부 정보(대상 지역·시간·지시)를 공식 데이터에서 확인하지 못했어요.',
    glossary: [GLOSSARY.statement, GLOSSARY.warning, GLOSSARY.watch],
    summary: ['본문이 없어 내용을 확인할 수 없음'],
    instructionKo: null,
  },
}

const noMismatch: Verification = {
  status: '불일치 미탐지',
  issues: [],
  unresolved: [],
  checkedFields: ['translation', 'summary', 'hazard_explanation', 'instruction_translation_ko'],
}

export const MOCK_VERIFICATION: Record<string, Verification> = {
  'nws-ffw-harris-001': {
    status: '불일치 탐지',
    issues: [
      {
        field: 'translation',
        kind: 'end_time',
        severity: 'critical',
        sourceQuote: 'Until 630 PM CDT.',
        translationQuote: null,
        reason: '시각 누락 — 원문의 “until 6:30 PM”이 일반 번역에서 빠졌어요.',
        method: 'rule',
      },
    ],
    unresolved: [],
    checkedFields: ['translation', 'summary', 'hazard_explanation', 'instruction_translation_ko'],
  },
  'nws-ffw-harris-000': noMismatch,
  'nws-tor-harris-001': noMismatch,
  'nws-unknown-001': {
    status: '검증 불가',
    issues: [],
    unresolved: ['원문 본문이 없어 시각·지역·지시를 대조하지 못했어요.'],
    checkedFields: [],
  },
}
