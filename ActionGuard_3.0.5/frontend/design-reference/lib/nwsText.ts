/**
 * NWS 원문은 약 70자마다 줄을 끊어 보낸다. 화면 표시용으로 한 줄 바꿈은 공백으로 잇고, 빈 줄(문단)은 유지한다.
 * 서버로 보내는 원문(alert_id 연결용)에는 쓰지 않는다.
 */
export function unwrapNwsText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n')
}
