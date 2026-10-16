import { ALERT_AREA } from '@/config/api'
import { OFFICIAL_LINKS } from '@/config/contacts'
import { DEMO_LOCATION_LABEL } from '@/config/demo'
import type { AlertLoad } from '@/context/AlertContext'
import { UNDETERMINABLE_TEXT } from '@/lib/evaluateOverlap'
import { formatLocalTime } from '@/lib/time'
import { Button } from './Button'
import { Card } from './Card'
import { ExternalIcon } from './Icons'
import styles from './AlertStateView.module.css'

const NWS_LINK = OFFICIAL_LINKS[0]

export const NO_ALERT_TEXT = '현재 조회된 공식 경보가 없어요 · 안전하다는 뜻은 아니에요'

function queryLabel(): string {
  return ALERT_AREA ? `조회 지역: ${ALERT_AREA}` : `조회 위치: ${DEMO_LOCATION_LABEL} (예시 위치)`
}

/**
 * 경보 조회가 끝나지 않았거나(로딩) 실패했거나 0건일 때의 화면.
 * 실패를 "경보 없음"으로, 0건을 "안전"으로 보여 주지 않는다.
 */
export function AlertStateView({ load, onRetry }: { load: Exclude<AlertLoad, { status: 'ready' }>; onRetry: () => void }) {
  if (load.status === 'loading') {
    return (
      <Card>
        <p className={styles.strong} role="status">
          공식 경보를 불러오는 중이에요
        </p>
        <p className={styles.sub}>{queryLabel()}</p>
      </Card>
    )
  }

  if (load.status === 'error') {
    return (
      <Card variant="dashed">
        <p className={styles.strong} role="alert">
          {UNDETERMINABLE_TEXT}
        </p>
        <p className={styles.sub}>공식 경보를 불러오지 못했어요. {load.message}</p>
        <div className={styles.actions}>
          <Button onClick={onRetry}>다시 시도</Button>
          <a className={styles.link} href={NWS_LINK.url} target="_blank" rel="noopener noreferrer">
            {NWS_LINK.label} <ExternalIcon />
          </a>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <p className={styles.strong}>{NO_ALERT_TEXT}</p>
      <p className={styles.sub}>
        {queryLabel()} · 확인 {formatLocalTime(load.checkedAtUtc)}
      </p>
      <p className={styles.sub}>다른 지역의 경보나 조회 이후 새로 발표된 경보는 포함되지 않아요.</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onRetry}>
          다시 조회
        </Button>
        <a className={styles.link} href={NWS_LINK.url} target="_blank" rel="noopener noreferrer">
          {NWS_LINK.label} <ExternalIcon />
        </a>
      </div>
    </Card>
  )
}
