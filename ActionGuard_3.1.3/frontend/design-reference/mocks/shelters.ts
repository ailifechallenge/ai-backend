import type { ShelterSearchResult } from '@/types'

// 시연용 예시 — 실제 지정 대피시설 데이터가 아님 (백엔드 /api/shelters 결과와 같은 모양)
export const MOCK_SHELTER_SEARCH: ShelterSearchResult = {
  shelters: [
    {
      id: 'shelter-a',
      marker: 'A',
      name: '학교 체육관',
      address: 'High School Gymnasium (예시)',
      distanceLabel: '약 1.2km',
      operator: '운영기관: Harris County OEM (예시)',
      statusLabel: '지정시설 · 현재 운영 미확인',
      open: false,
      typeLabel: '지정 대피시설',
      suitabilityUnknown: false,
      mapX: 68,
      mapY: 28,
    },
    {
      id: 'shelter-b',
      marker: 'B',
      name: '커뮤니티센터',
      address: 'Community Center (예시)',
      distanceLabel: '약 1.9km',
      operator: '운영기관: City of Houston (예시)',
      statusLabel: '지정시설 · 현재 운영 미확인',
      open: false,
      typeLabel: '지정 대피시설',
      suitabilityUnknown: true,
      mapX: 24,
      mapY: 70,
    },
  ],
  origin: { x: 48, y: 52 },
  warnings: [],
  note: '시연용 예시 시설이에요. 공식 데이터의 운영 표시는 현장 입소 가능 여부를 보장하지 않습니다.',
  checkedAt: '2026-10-15T19:18:00Z',
  source: '시연용 예시',
  truncated: false,
}
