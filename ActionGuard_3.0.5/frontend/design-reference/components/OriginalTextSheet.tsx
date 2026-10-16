import { checkedLabel } from '@/lib/alertTime'
import type { Alert } from '@/types'
import { BottomSheet } from './BottomSheet'
import styles from './Sheets.module.css'

export function OriginalTextSheet({ alert, open, onClose }: { alert: Alert; open: boolean; onClose: () => void }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="공식 원문 (영문)">
      <pre className={styles.original} lang="en">
        {alert.originalTextEn}
      </pre>
      <p className={styles.meta}>
        출처 {alert.source} · 최신 확인 {checkedLabel(alert)}
        {alert.sourceUrl && (
          <>
            {' · '}
            <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer">
              공식 출처 열기
            </a>
          </>
        )}
      </p>
    </BottomSheet>
  )
}
