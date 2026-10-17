import { useState } from 'react'
import { AlertStateView } from '@/components/AlertStateView'
import { BottomSheet } from '@/components/BottomSheet'
import { Button } from '@/components/Button'
import { Card, Note, PageBody } from '@/components/Card'
import { PlusIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { ScheduleForm } from '@/components/ScheduleForm'
import { ScheduleItem } from '@/components/ScheduleItem'
import { useCurrentAlert } from '@/hooks/useCurrentAlert'
import { useScheduleOverlaps } from '@/hooks/useScheduleOverlaps'
import { utcToLocalInput } from '@/lib/time'
import { addScheduleItem } from '@/services/scheduleService'
import styles from './Schedule.module.css'

export default function Schedule() {
  const { load, alert, retry } = useCurrentAlert()
  const { evaluated, now, reload } = useScheduleOverlaps(alert)
  const [formOpen, setFormOpen] = useState(false)

  return (
    <>
      <PageHeader title="내 일정과 경보 확인" />
      <PageBody>
        {load.status !== 'ready' && <AlertStateView load={load} onRetry={retry} />}
        <div className={styles.list}>
          {evaluated.map(({ item, result, pending }) => (
            <ScheduleItem key={item.id} item={item} result={result} pending={pending} now={now} showPrepareLink />
          ))}
          {evaluated.length === 0 && (
            <Card>
              <p className={styles.notice}>등록된 일정이 없어요</p>
              <Note>숙소·이동·방문 일정을 추가하면 공식 경보 지역·시간과 겹치는지 서버 규칙으로 확인해요.</Note>
            </Card>
          )}
        </div>

        <Button variant="secondary" block onClick={() => setFormOpen(true)}>
          <PlusIcon width={18} height={18} /> 일정 추가
        </Button>

        <Card variant="info">
          <p className={styles.notice}>
            경보가 바뀌면 영향받는 일정을 다시 확인해요. 최종 판단은 현지 공식 안내를 따르세요.
          </p>
        </Card>
      </PageBody>

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="일정 추가">
        <ScheduleForm
          defaultStartLocal={utcToLocalInput(now.toISOString())}
          onSubmit={async (draft) => {
            await addScheduleItem(draft)
            setFormOpen(false)
            reload()
          }}
        />
      </BottomSheet>
    </>
  )
}
