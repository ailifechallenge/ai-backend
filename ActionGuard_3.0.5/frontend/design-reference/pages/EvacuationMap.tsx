import { Navigate, useParams } from 'react-router-dom'
import { AlertStateView } from '@/components/AlertStateView'
import { BottomCta } from '@/components/BottomCta'
import { Button, ButtonAnchor } from '@/components/Button'
import { Card, Note, PageBody } from '@/components/Card'
import { ExternalIcon } from '@/components/Icons'
import { MapPlaceholder } from '@/components/MapPlaceholder'
import { PageHeader } from '@/components/PageHeader'
import { ShelterRow } from '@/components/ShelterRow'
import { StatusBadge } from '@/components/StatusBadge'
import { OFFICIAL_EVACUATION_URL } from '@/config/contacts'
import { DEMO_LOCATION_LABEL } from '@/config/demo'
import { useAsync } from '@/hooks/useAsync'
import { SHELTER_LABELS } from '@/lib/labels'
import { alertPath } from '@/lib/routes'
import { formatLocalTime } from '@/lib/time'
import { getAlert } from '@/services/alertService'
import { getShelters, SHELTER_RADIUS_KM } from '@/services/shelterService'
import styles from './EvacuationMap.module.css'

export default function EvacuationMap() {
  const { id = '' } = useParams()
  // 경보 확인 실패와 시설 조회 실패를 나눠서 보여 준다
  const alertQuery = useAsync(() => getAlert(id), [id])
  const alert = alertQuery.data
  const allowed = Boolean(alert && alert.status === 'active' && alert.evacuation.required)
  const shelterQuery = useAsync(() => (alert && allowed ? getShelters(alert) : Promise.resolve(null)), [alert, allowed])

  if (alertQuery.error) {
    return (
      <>
        <PageHeader title="대피 지도" backTo={alertPath(id)} />
        <PageBody>
          <AlertStateView load={{ status: 'error', message: alertQuery.error }} onRetry={alertQuery.reload} />
        </PageBody>
      </>
    )
  }

  if (alertQuery.loading) return <PageHeader title="대피 지도" backTo={alertPath(id)} />

  // 대피 이동 지시가 있는 유효한 경보에서만 진입 가능
  if (!allowed) return <Navigate to={alertPath(id)} replace />

  const noRoute = SHELTER_LABELS.no_route
  const result = shelterQuery.data

  return (
    <>
      <PageHeader title="대피 지도" subtitle="공식 경보가 이동을 지시한 경우에만 열려요" backTo="/home" />
      <PageBody>
        {result && <MapPlaceholder shelters={result.shelters} origin={result.origin} />}

        <Card title="가까운 지정 대피시설">
          {shelterQuery.loading && (
            <p className={styles.state} role="status">
              공식 대피시설 정보를 불러오는 중이에요
            </p>
          )}
          {shelterQuery.error && (
            <div className={styles.stateBox}>
              <p className={styles.stateStrong}>대피시설 정보를 불러오지 못했어요 · 공식 대피 안내를 확인하세요</p>
              <p className={styles.state}>{shelterQuery.error}</p>
              <Button variant="secondary" onClick={shelterQuery.reload}>
                다시 시도
              </Button>
            </div>
          )}
          {result && result.shelters.length === 0 && (
            <p className={styles.stateStrong}>조회된 지정 시설이 없어요 · 시설이 없다는 뜻은 아니에요 · 공식 대피 안내를 확인하세요</p>
          )}
          {result && result.shelters.length > 0 && (
            <ul className={styles.list}>
              {result.shelters.map((s) => (
                <ShelterRow key={s.id} shelter={s} />
              ))}
            </ul>
          )}
          {result && (
            <>
              {result.warnings.length > 0 && (
                <ul className={styles.warnings}>
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              )}
              <Note>
                {result.note} · 기준: {DEMO_LOCATION_LABEL} 예시 위치 반경 {SHELTER_RADIUS_KM}km · 출처 {result.source} · 확인{' '}
                {formatLocalTime(result.checkedAt)}
                {result.truncated ? ' · 일부만 표시' : ''}
              </Note>
            </>
          )}
        </Card>

        <Card variant="caution">
          <div className={styles.noticeHead}>
            <StatusBadge label={noRoute.label} tone={noRoute.tone} />
          </div>
          <p className={styles.notice}>
            안전한 이동 경로는 제공하지 않아요. 침수·도로 상황과 개방 여부는 현지 공식 안내를 따르세요.
          </p>
        </Card>
      </PageBody>

      <BottomCta>
        <ButtonAnchor href={OFFICIAL_EVACUATION_URL} target="_blank" rel="noopener noreferrer" block>
          공식 대피 안내 보기 <ExternalIcon />
        </ButtonAnchor>
      </BottomCta>
    </>
  )
}
