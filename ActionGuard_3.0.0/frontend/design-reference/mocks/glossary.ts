import type { GlossaryEntry } from '@/types'

// 시연용 예시 설명 (mock 번역의 glossary) — 최종 문구는 NWS 용어 정의와 대조 필요
export const GLOSSARY = {
  warning: { term: 'Warning', meaning: '경보 — 위험 현상이 발생 중이거나 곧 발생할 것으로 보여, 지금 행동해야 한다는 뜻이에요.' },
  watch: { term: 'Watch', meaning: '감시 — 위험 현상이 발생할 수 있는 조건이 갖춰졌다는 뜻이에요. 계획을 점검하고 갱신 정보를 확인하세요.' },
  statement: { term: 'Statement', meaning: '기상 정보 — 기상 상황에 대한 공식 설명이에요. 세부 지시는 원문과 후속 경보를 확인하세요.' },
  flashFlood: { term: 'Flash Flood', meaning: '돌발홍수 — 짧은 시간 폭우로 물이 빠르게 불어나는 홍수예요. 도로·저지대가 몇 분 만에 잠길 수 있어요.' },
  shelterInPlace: { term: 'shelter in place', meaning: '현재 위치 실내 대피 — 밖으로 나가지 말고 지금 있는 건물 안에서 대피하라는 지시예요.' },
  higherGround: { term: 'higher ground', meaning: '높은 곳 — 물이 차오르지 않을 높은 지대나 건물의 위층을 뜻해요.' },
  takeCover: { term: 'Take cover', meaning: '즉시 몸을 피하세요 — 지금 바로 튼튼한 실내 공간으로 들어가 몸을 보호하라는 지시예요.' },
} satisfies Record<string, GlossaryEntry>
