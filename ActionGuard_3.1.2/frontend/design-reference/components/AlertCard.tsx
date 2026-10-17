import { getNow } from '@/config/demo'
import { validityLine } from '@/lib/alertTime'
import { ALERT_STATUS_LABELS } from '@/lib/labels'
import { alertPath } from '@/lib/routes'
import type { Alert } from '@/types'
import { Button, ButtonLink, ButtonRow } from './Button'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'
import styles from './AlertCard.module.css'

interface Props {
  alert: Alert
  onCheckText: () => void
  onShowOriginal: () => void
}

export function AlertCard({ alert, onCheckText, onShowOriginal }: Props) {
  const status = ALERT_STATUS_LABELS[alert.status]

  return (
    <Card as="article">
      <div className={styles.top}>
        <p className={styles.nameKo}>{alert.nameKo}</p>
        <StatusBadge label={status.label} tone={status.tone} />
      </div>
      {/* 경보 원래 영문명은 항상 함께 보여 준다 (사전에 없으면 위 한국어 자리도 영문) */}
      {alert.nameKo !== alert.nameEn && (
        <p className={styles.nameEn} lang="en">
          {alert.nameEn}
        </p>
      )}
      <p className={styles.meta}>
        {alert.areaLabel} · {validityLine(alert, getNow())}
      </p>
      <div className={styles.actions}>
        <ButtonRow>
          <ButtonLink to={alertPath(alert.id)}>번역·검증 보기</ButtonLink>
          <Button variant="secondary" onClick={onCheckText}>
            받은 문자 확인
          </Button>
        </ButtonRow>
        <Button variant="ghost" onClick={onShowOriginal} className={styles.link}>
          공식 원문(영문) 보기
        </Button>
      </div>
    </Card>
  )
}
