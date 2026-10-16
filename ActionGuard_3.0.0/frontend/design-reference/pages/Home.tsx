import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ActionSteps } from '@/components/ActionSteps'
import { AlertCard } from '@/components/AlertCard'
import { AlertStateView } from '@/components/AlertStateView'
import { Card, PageBody } from '@/components/Card'
import { EmergencyContacts } from '@/components/EmergencyContacts'
import { EvacuationBanner } from '@/components/EvacuationBanner'
import { OriginalTextSheet } from '@/components/OriginalTextSheet'
import { PageHeader } from '@/components/PageHeader'
import { MapPinIcon } from '@/components/Icons'
import { ReceivedTextSheet } from '@/components/ReceivedTextSheet'
import { ScheduleItem } from '@/components/ScheduleItem'
import { Pill } from '@/components/StatusBadge'
import { UrgentInstruction } from '@/components/UrgentInstruction'
import { isMock } from '@/config/api'
import { DEMO_LOCATION_LABEL } from '@/config/demo'
import { useGuidance, useTranslation } from '@/hooks/useAlertAnalysis'
import { useCurrentAlert } from '@/hooks/useCurrentAlert'
import { useScheduleOverlaps } from '@/hooks/useScheduleOverlaps'
import { NO_OVERLAP_TEXT, UNDETERMINABLE_TEXT } from '@/lib/evaluateOverlap'
import styles from './Home.module.css'

export default function Home() {
  const { load, alert, retry } = useCurrentAlert()
  const { evaluated, now } = useScheduleOverlaps(alert)
  // AI 호출 예산: 번역은 대표 경보 1회(캐시). 행동지침은 AI 불필요
  const { step: translation } = useTranslation(alert)
  const { step: guidance, retry: retryGuidance } = useGuidance(alert)
  const [sheet, setSheet] = useState<'text' | 'original' | null>(null)

  const locationBox = (
    <div className={styles.locationBox}>
      <MapPinIcon className={styles.locationIcon} />
      <span className={styles.nowrap}>현재 위치 · {DEMO_LOCATION_LABEL}</span>
    </div>
  )

  const top = evaluated.filter((e) => e.result?.status === 'confirmed' || e.result?.status === 'possible').slice(0, 2)
  const checking = evaluated.some((e) => e.pending)

  let emptyText = NO_OVERLAP_TEXT
  if (alert?.status === 'incomplete') emptyText = UNDETERMINABLE_TEXT
  if (alert?.status === 'expired' || alert?.status === 'cancelled') emptyText = '경보가 만료·해제되어 겹침을 판정하지 않아요'

  return (
    <>
      <PageHeader title="ActionGuard" right={isMock() ? <Pill>시연용 예시</Pill> : undefined} />
      {load.status !== 'ready' && (
        <PageBody className={styles.body}>
          {locationBox}
          <AlertStateView load={load} onRetry={retry} />
          <EmergencyContacts />
        </PageBody>
      )}
      {alert && load.status === 'ready' && (
        <PageBody className={styles.body}>
          {locationBox}
          <UrgentInstruction alert={alert} translation={translation} />
          <AlertCard alert={alert} onCheckText={() => setSheet('text')} onShowOriginal={() => setSheet('original')} />
          {load.otherCount > 0 && (
            <Card className={styles.noteCard}>
              <p className={styles.others}>
                조회 범위에 다른 공식 경보 {load.otherCount}건이 더 있어요 · 심각도가 가장 높은 최신 경보를 먼저 보여 드려요
              </p>
            </Card>
          )}
          <EvacuationBanner alert={alert} />
          <ActionSteps
            alert={alert}
            title="이 경보에서 해야 할 행동"
            guidance={guidance}
            translation={translation}
            onRetry={retryGuidance}
            collapseOfficial
            hideMeta
          />

          <Card
            title="내 일정과의 겹침"
            aside={
              <Link to="/schedule" className={styles.more}>
                전체 일정
              </Link>
            }
          >
            {top.length > 0 ? (
              <div className={styles.list}>
                {top.map(({ item, result }) => (
                  <ScheduleItem key={item.id} item={item} result={result} now={now} compact />
                ))}
              </div>
            ) : (
              <p className={styles.empty}>{checking ? '일정과 경보를 대조하는 중이에요' : evaluated.length === 0 ? '등록된 일정이 없어요 · 일정 탭에서 추가해 보세요' : emptyText}</p>
            )}
          </Card>

          <EmergencyContacts />

          <ReceivedTextSheet alert={alert} open={sheet === 'text'} onClose={() => setSheet(null)} />
          <OriginalTextSheet alert={alert} open={sheet === 'original'} onClose={() => setSheet(null)} />
        </PageBody>
      )}
    </>
  )
}
