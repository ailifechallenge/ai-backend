import type { ApiAlert } from './alert'

/** 매퍼 테스트용 백엔드 응답 픽스처 (NWS 응답을 backend/adapters/nws.py parse() 형태로 옮긴 예시) */
export const API_ALERT: ApiAlert = {
  id: 'https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.abc.001.1',
  event: 'Flash Flood Warning',
  headline: 'Flash Flood Warning issued October 15 at 1:45PM CDT until October 15 at 6:30PM CDT by NWS Houston/Galveston TX',
  area: 'Harris, TX',
  severity: 'Severe',
  sender: 'NWS Houston/Galveston TX',
  sent: '2026-10-15T13:45:00-05:00',
  effective: '2026-10-15T13:45:00-05:00',
  onset: '2026-10-15T13:45:00-05:00',
  expires: '2026-10-15T18:30:00-05:00',
  ends: '2026-10-15T18:30:00-05:00',
  instruction: 'Move to higher ground now. Act quickly to protect your life.',
  source: 'https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.abc.001.1',
  text: 'Alert: Flash Flood Warning\nEvent: Flash Flood Warning\nArea: Harris, TX\nOfficial instruction: Move to higher ground now. Act quickly to protect your life.',
  checked_at: '2026-10-15T19:18:00+00:00',
  message_type: 'Alert',
  geometry: null,
}
