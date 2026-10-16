import type { Alert, Scenario } from '@/types'

// 시연용 예시 — 실제 NWS 경보가 아님. 시각은 config/demo.ts의 DEMO_NOW_UTC(현지 14:20) 기준.

/** 최신 확인 14:18 (현지) */
const CHECKED_AT = '2026-10-15T19:18:00Z'

export const FLOOD_INSTRUCTION = `Move to higher ground now. Act quickly to protect your life.
Turn around, don't drown when encountering flooded roads.
Stay tuned to local media or NOAA Weather Radio for updates.`

// TODO: 토네이도 행동 문구는 mock이며 실제 NWS Tornado Warning 안내와 대조 필요
export const TORNADO_INSTRUCTION = `TAKE COVER NOW! Move to a basement or an interior room on the lowest floor of a sturdy building.
Avoid windows. Protect your head and neck.`

const FLOOD_ORIGINAL = `BULLETIN - EAS ACTIVATION REQUESTED
Flash Flood Warning
National Weather Service Houston/Galveston TX

The National Weather Service in Houston/Galveston has issued a
* Flash Flood Warning for...
  Harris County in southeastern Texas...
* Until 630 PM CDT.
* At 145 PM CDT, Doppler radar indicated thunderstorms producing heavy rain.
  Flash flooding is ongoing or expected to begin shortly.

PRECAUTIONARY/PREPAREDNESS ACTIONS...
${FLOOD_INSTRUCTION}`

const flood: Alert = {
  id: 'nws-ffw-harris-001',
  nameEn: 'Flash Flood Warning',
  nameKo: '돌발홍수 경보',
  areaLabel: 'Harris County',
  areaCodes: ['TXC201'],
  sentAtUtc: '2026-10-15T18:45:00Z',
  startsAtUtc: '2026-10-15T18:45:00Z',
  endsAtUtc: '2026-10-15T23:30:00Z',
  messageExpiresAtUtc: '2026-10-15T23:30:00Z',
  checkedAtUtc: CHECKED_AT,
  source: 'NWS',
  sourceUrl: 'https://www.weather.gov/hgx/',
  status: 'active',
  instructionEn: FLOOD_INSTRUCTION,
  evacuation: { required: true, basis: 'mock' },
  originalTextEn: FLOOD_ORIGINAL,
  receivedSmsText: 'Flash Flood Warning this area til 6:30 PM CDT. Avoid flooded areas. Check local media. -NWS',
  changes: [
    { atLocalLabel: '12:10', textKo: 'Flash Flood Watch 발표 (Harris County 포함)' },
    { atLocalLabel: '13:45', textKo: 'Watch → Flash Flood Warning으로 격상' },
    { atLocalLabel: '14:18', textKo: '대상 지역·만료 시각 변동 없음 (최신 확인)' },
  ],
}

const tornado: Alert = {
  id: 'nws-tor-harris-001',
  nameEn: 'Tornado Warning',
  nameKo: '토네이도 경보',
  areaLabel: 'Harris County',
  areaCodes: ['TXC201'],
  sentAtUtc: '2026-10-15T19:10:00Z',
  startsAtUtc: '2026-10-15T19:10:00Z',
  endsAtUtc: '2026-10-15T20:00:00Z',
  messageExpiresAtUtc: '2026-10-15T20:00:00Z',
  checkedAtUtc: CHECKED_AT,
  source: 'NWS',
  sourceUrl: 'https://www.weather.gov/hgx/',
  status: 'active',
  instructionEn: TORNADO_INSTRUCTION,
  evacuation: { required: false, basis: 'mock' },
  originalTextEn: `Tornado Warning
National Weather Service Houston/Galveston TX

* Tornado Warning for...
  Harris County in southeastern Texas...
* Until 300 PM CDT.
* At 210 PM CDT, a severe thunderstorm capable of producing a tornado was located near Houston.

${TORNADO_INSTRUCTION}`,
  changes: [{ atLocalLabel: '14:10', textKo: 'Tornado Warning 발표' }],
}

const unknown: Alert = {
  id: 'nws-unknown-001',
  nameEn: 'Special Weather Statement',
  nameKo: '특별 기상 정보',
  areaLabel: '대상 지역 미확인',
  areaCodes: [],
  sentAtUtc: null,
  startsAtUtc: null,
  endsAtUtc: null,
  messageExpiresAtUtc: null,
  checkedAtUtc: CHECKED_AT,
  source: 'NWS',
  sourceUrl: 'https://www.weather.gov/hgx/',
  status: 'incomplete',
  instructionEn: '',
  evacuation: { required: false, basis: 'mock' },
  originalTextEn: `Special Weather Statement
National Weather Service

(Message body unavailable — partial data received.)`,
  changes: [],
}

const expired: Alert = {
  ...flood,
  id: 'nws-ffw-harris-000',
  sentAtUtc: '2026-10-15T14:00:00Z',
  startsAtUtc: '2026-10-15T14:00:00Z',
  endsAtUtc: '2026-10-15T18:00:00Z',
  messageExpiresAtUtc: '2026-10-15T18:00:00Z',
  status: 'expired',
  evacuation: { required: false, basis: 'mock' },
  changes: [
    { atLocalLabel: '09:00', textKo: 'Flash Flood Warning 발표' },
    { atLocalLabel: '13:00', textKo: '경보 만료 (연장 없음)' },
  ],
}

export const MOCK_ALERTS: Record<Scenario, Alert> = { flood, tornado, unknown, expired }
