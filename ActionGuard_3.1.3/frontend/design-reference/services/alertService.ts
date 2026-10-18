import { ALERT_AREA, isMock } from '@/config/api'
import { DEMO_COORDS, getNow } from '@/config/demo'
import { checkedLabel } from '@/lib/alertTime'
import { MOCK_ALERTS } from '@/mocks/alerts'
import type { Alert, Scenario } from '@/types'
import { apiGet } from './http'
import { mapAlert, pickRepresentative, type ApiAlerts } from './mappers/alert'

/** 백엔드는 조회한 경보를 15분만 보관한다 (그 뒤 alert_id 연결 시 409) */
export const ALERT_RECORD_TTL_MS = 15 * 60_000

export interface CurrentAlertResult {
  /** null = 조회 성공, 공식 경보 0건 (조회 실패는 throw) */
  alert: Alert | null
  /** 대표 경보 외에 조회된 경보 수 */
  otherCount: number
  checkedAtUtc: string
}

const LIST_KEY = 'ag.alerts.list'

interface StoredList {
  savedAt: number
  data: ApiAlerts
}

function saveList(data: ApiAlerts): void {
  try {
    sessionStorage.setItem(LIST_KEY, JSON.stringify({ savedAt: Date.now(), data } satisfies StoredList))
  } catch {
    // 저장 실패 시에도 이번 화면에서는 방금 받은 결과를 쓴다 (getAlert는 재조회)
  }
}

function readList(): StoredList | null {
  try {
    const raw = sessionStorage.getItem(LIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredList
    return Array.isArray(parsed?.data?.alerts) ? parsed : null
  } catch {
    return null
  }
}

function alertsQuery(): string {
  return ALERT_AREA ? `alerts?area=${ALERT_AREA}` : `alerts?lat=${DEMO_COORDS.lat}&lon=${DEMO_COORDS.lon}`
}

async function fetchList(): Promise<ApiAlerts> {
  const data = await apiGet<ApiAlerts>(alertsQuery())
  saveList(data)
  return data
}

/** 대표 경보 1건 조회. 0건은 { alert: null }, 실패는 ApiError를 던진다 */
export async function getCurrentAlert(scenario: Scenario): Promise<CurrentAlertResult> {
  if (isMock()) {
    const alert = MOCK_ALERTS[scenario]
    return { alert, otherCount: 0, checkedAtUtc: alert.checkedAtUtc }
  }
  const data = await fetchList()
  const rep = pickRepresentative(data.alerts)
  return {
    alert: rep ? mapAlert(rep, getNow()) : null,
    otherCount: Math.max(0, data.alerts.length - 1),
    checkedAtUtc: data.checked_at,
  }
}

/** id로 경보 찾기. 보관한 목록이 15분 넘었거나 없으면 다시 조회한다 */
export async function getAlert(id: string): Promise<Alert | null> {
  if (isMock()) return Object.values(MOCK_ALERTS).find((a) => a.id === id) ?? null
  const stored = readList()
  const fresh = stored && Date.now() - stored.savedAt < ALERT_RECORD_TTL_MS
  const data = fresh ? stored.data : await fetchList()
  const found = data.alerts.find((a) => a.id === id)
  return found ? mapAlert(found, getNow()) : null
}

/** 강제로 목록을 다시 받아 같은 id의 경보를 돌려준다 (409 재연결용) */
export async function refetchAlert(id: string): Promise<Alert | null> {
  if (isMock()) return getAlert(id)
  const data = await fetchList()
  const found = data.alerts.find((a) => a.id === id)
  return found ? mapAlert(found, getNow()) : null
}

export interface ReceivedTextCheck {
  matched: boolean
  messageKo: string
}

/**
 * 사용자가 붙여넣은 문자를 공식 경보와 대조.
 * 서버에 문자 대조 API가 없어 클라이언트에서 경보 영문명 포함 여부만 확인하는 임시 방식이다.
 */
export function checkReceivedText(text: string, alert: Alert): Promise<ReceivedTextCheck> {
  const matched = alert.status !== 'incomplete' && text.toLowerCase().includes(alert.nameEn.toLowerCase())
  const expiredNote = alert.status === 'active' ? '' : ' · 이 경보는 만료·해제되었어요'
  const tempNote = isMock() ? '' : ' (임시 · 서버 대조 미연결)'
  return Promise.resolve(
    matched
      ? {
          matched,
          messageKo: `공식 경보 이름과 일치해요 · 출처 ${alert.source} · 확인 ${checkedLabel(alert)}${expiredNote}${tempNote}`,
        }
      : { matched, messageKo: `지원 대상이 아니거나 공식 데이터와 직접 대조할 수 없어요. 공식 안내를 확인하세요.${tempNote}` },
  )
}
