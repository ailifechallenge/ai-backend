import { isMock } from '@/config/api'
import { MOCK_GEOCODE, MOCK_SCHEDULE, type GeocodeEntry } from '@/mocks/schedule'
import type { Alert, OverlapResult, ScheduleItem } from '@/types'
import { withRelink } from './analysisService'
import { apiPost, isApiError } from './http'
import { alertLinkBody } from './mappers/analysis'
import { mapConflict, toStayPayload, type ApiConflict } from './mappers/conflict'

// 일정은 이 기기의 localStorage에만 저장한다. mock 모드에서는 시연용 일정 4건을 함께 보여 준다.

const STORAGE_KEY = 'ag.schedule.user'

/** 임시 지오코딩 (주소 키워드 표). 백엔드에 주소→좌표 API가 생기면 이 함수만 교체한다 */
export function geocodeAddress(address: string): GeocodeEntry | undefined {
  const lower = address.toLowerCase()
  return MOCK_GEOCODE.find((g) => lower.includes(g.keyword))
}

/** 예전에 저장된 일정(좌표·시간대 없음)도 읽히도록 주소로 보완한다 */
function normalize(item: ScheduleItem): ScheduleItem {
  if (typeof item.latitude === 'number' || !item.address) return item
  const g = geocodeAddress(item.address)
  return g ? { ...item, latitude: g.latitude, longitude: g.longitude, timezone: item.timezone ?? g.timezone, country: item.country ?? g.country } : item
}

function readUserItems(): ScheduleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? (parsed as ScheduleItem[]).map(normalize) : []
  } catch {
    return []
  }
}

export function listSchedule(): Promise<ScheduleItem[]> {
  const items = [...(isMock() ? MOCK_SCHEDULE : []), ...readUserItems()]
  items.sort((a, b) => Date.parse(a.startUtc) - Date.parse(b.startUtc))
  return Promise.resolve(items)
}

export function addScheduleItem(input: Omit<ScheduleItem, 'id' | 'areaCode' | 'latitude' | 'longitude' | 'timezone' | 'country'>): Promise<ScheduleItem> {
  const g = input.address ? geocodeAddress(input.address) : undefined
  const item: ScheduleItem = {
    ...input,
    id: `user-${Date.now()}`,
    areaCode: g?.areaCode,
    latitude: g?.latitude,
    longitude: g?.longitude,
    timezone: g?.timezone,
    country: g?.country ?? 'US',
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readUserItems(), item]))
  } catch {
    /* 저장 실패 시 이번 세션에서만 표시 */
  }
  return Promise.resolve(item)
}

export const CONFLICT_FAILED_TEXT = '서버 연결 실패 · 공식 경보 확인 필요'

/** 일정 1건의 겹침 판정 (/api/conflict). 409면 경보를 다시 조회해 한 번 재시도한다 */
export async function checkConflict(alert: Alert, item: ScheduleItem): Promise<OverlapResult> {
  const { stay, assumedEnd } = toStayPayload(item)
  const result = await withRelink(alert, (a) => apiPost<ApiConflict>('conflict', { ...alertLinkBody(a), stay }))
  return mapConflict(result, assumedEnd)
}

/**
 * 일정 전체 판정. 일정마다 1회 호출(병렬)하고, 실패한 일정만 판정 불가로 둔다.
 */
export async function checkConflicts(alert: Alert, items: ScheduleItem[]): Promise<Record<string, OverlapResult>> {
  const settled = await Promise.allSettled(items.map((item) => checkConflict(alert, item)))
  const out: Record<string, OverlapResult> = {}
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      out[items[i].id] = r.value
      return
    }
    const e = r.reason
    // 4xx 문자열 detail(예: 서머타임 전환 시각)은 그대로 보여 준다
    const detail = isApiError(e) && e.kind === 'http' && e.status < 500 ? ` · ${e.message}` : ''
    out[items[i].id] = { status: 'undeterminable', evidenceKo: `${CONFLICT_FAILED_TEXT}${detail}` }
  })
  return out
}
