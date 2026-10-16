import { LOCAL_TIME_ZONE } from '@/config/demo'

function localParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: LOCAL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** 현지 시각 "HH:mm" */
export function formatLocalTime(iso: string): string {
  const p = localParts(new Date(iso))
  return `${pad(p.hour)}:${pad(p.minute)}`
}

/** UTC 시각 "HH:mm" */
export function formatUtcTime(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}

/** 현지 날짜 기준 오늘/내일/모레/M월 D일 */
export function formatLocalDay(iso: string, now: Date): string {
  const a = localParts(new Date(iso))
  const b = localParts(now)
  const diff = Math.round((Date.UTC(a.year, a.month - 1, a.day) - Date.UTC(b.year, b.month - 1, b.day)) / 86_400_000)
  if (diff === 0) return '오늘'
  if (diff === 1) return '내일'
  if (diff === 2) return '모레'
  if (diff === -1) return '어제'
  return `${a.month}월 ${a.day}일`
}

/** "오늘 16:00" */
export function formatLocalDayTime(iso: string, now: Date): string {
  return `${formatLocalDay(iso, now)} ${formatLocalTime(iso)}`
}

/** 현지 벽시계 "YYYY-MM-DDTHH:mm" → UTC ISO */
export function localInputToUtc(value: string): string {
  const [date, time] = value.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const guess = Date.UTC(y, m - 1, d, hh, mm)
  const p = localParts(new Date(guess))
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - guess
  return new Date(guess - offset).toISOString()
}

/** UTC ISO → 현지 "YYYY-MM-DDTHH:mm" (datetime-local 기본값용) */
export function utcToLocalInput(iso: string): string {
  const p = localParts(new Date(iso))
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`
}
