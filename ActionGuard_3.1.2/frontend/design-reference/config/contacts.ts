// TODO: 외교부 공식 안내로 최신 번호 확인
export const CONSULAR_CALL_CENTER = {
  label: '영사안전콜센터 · 24시간',
  display: '+82-2-3210-0404',
  tel: '+82232100404',
} as const

// TODO: 외교부 공식 안내로 최신 번호 확인
export const LOCAL_EMERGENCY = {
  label: '미국 현지 응급',
  display: '911',
  tel: '911',
} as const

/** 홈 "긴급 연락 · 공식 링크" 섹션의 공식 링크 */
export const OFFICIAL_LINKS = [
  { label: 'NWS 공식 경보 보기', url: 'https://www.weather.gov/alerts' },
  { label: 'FEMA · Ready.gov 대비 안내', url: 'https://www.ready.gov/' },
  { label: '외교부 해외안전여행', url: 'https://www.0404.go.kr/' },
] as const

/** 공식 대피 안내 외부 링크 (placeholder) */
export const OFFICIAL_EVACUATION_URL = 'https://www.readyharris.org/'
