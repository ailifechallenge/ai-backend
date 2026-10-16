/**
 * NWS 이벤트명 → 한국어. 확실한 것만 넣는다. 없으면 영문 그대로 보여 준다(번역을 지어내지 않는다).
 * Watch·Advisory는 한국 특보 체계와 1:1로 맞지 않아 영문을 괄호로 함께 둔다.
 */
export const EVENT_KO: Record<string, string> = {
  'Flash Flood Warning': '돌발홍수 경보',
  'Flash Flood Watch': '돌발홍수 감시(Watch)',
  'Flood Warning': '홍수 경보',
  'Flood Watch': '홍수 감시(Watch)',
  'Flood Advisory': '홍수 주의(Advisory)',
  'Tornado Warning': '토네이도 경보',
  'Tornado Watch': '토네이도 감시(Watch)',
  'Severe Thunderstorm Warning': '강한 뇌우 경보',
  'Severe Thunderstorm Watch': '강한 뇌우 감시(Watch)',
  'Hurricane Warning': '허리케인 경보',
  'Hurricane Watch': '허리케인 감시(Watch)',
  'Tropical Storm Warning': '열대폭풍 경보',
  'Tropical Storm Watch': '열대폭풍 감시(Watch)',
  'Storm Surge Warning': '폭풍해일 경보',
  'Storm Surge Watch': '폭풍해일 감시(Watch)',
  'Tsunami Warning': '쓰나미 경보',
  'Winter Storm Warning': '겨울 폭풍 경보',
  'Blizzard Warning': '눈보라 경보',
  'High Wind Warning': '강풍 경보',
  'Wind Advisory': '강풍 주의(Advisory)',
  'Excessive Heat Warning': '폭염 경보',
  'Heat Advisory': '더위 주의(Advisory)',
  'Dense Fog Advisory': '짙은 안개 주의(Advisory)',
  'Special Weather Statement': '특별 기상 정보',
}

export function eventNameKo(event: string): string {
  return EVENT_KO[event.trim()] ?? event
}
