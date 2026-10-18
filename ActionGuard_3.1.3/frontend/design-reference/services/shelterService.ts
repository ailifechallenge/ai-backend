import { isMock } from '@/config/api'
import { DEMO_COORDS } from '@/config/demo'
import { disasterFromEvent } from '@/lib/evacuation'
import { MOCK_SHELTER_SEARCH } from '@/mocks/shelters'
import type { Alert, ShelterSearchResult } from '@/types'
import { apiGet } from './http'
import { mapShelterSearch, type ApiShelterSearch } from './mappers/shelter'

export const SHELTER_RADIUS_KM = 10

/**
 * 가까운 지정 대피시설 (/api/shelters). 원점은 예시 위치(데모 좌표).
 * 빈 배열은 "시설이 없다"는 뜻이 아니다 (FEMA 운영 중 시설이 없는 지역이 많다).
 */
export async function getShelters(alert: Alert): Promise<ShelterSearchResult> {
  if (isMock()) return MOCK_SHELTER_SEARCH
  const params = new URLSearchParams({
    lat: String(DEMO_COORDS.lat),
    lon: String(DEMO_COORDS.lon),
    radius_km: String(SHELTER_RADIUS_KM),
    disaster: disasterFromEvent(alert.nameEn),
    country: 'US',
  })
  return mapShelterSearch(await apiGet<ApiShelterSearch>(`shelters?${params.toString()}`))
}
