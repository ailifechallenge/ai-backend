import type { Step } from '@/hooks/useAlertAnalysis'
import { unwrapNwsText } from '@/lib/nwsText'
import type { Alert, AlertTranslation } from '@/types'
import { AlertTriangleIcon } from './Icons'
import styles from './UrgentInstruction.module.css'

/**
 * 공식 행동지시(instruction)가 있으면 화면 맨 위에 별도 강조.
 * 영문 원문은 항상 보여 주고, 한국어는 AI 번역이 있을 때만(표시와 함께) 보여 준다.
 */
export function UrgentInstruction({ alert, translation }: { alert: Alert; translation: Step<AlertTranslation> }) {
  if (alert.status !== 'active' || !alert.instructionEn.trim()) return null
  const ko = translation.state === 'done' ? translation.data.instructionKo : null

  let koState: string | null = null
  if (!ko) {
    if (translation.state === 'unavailable' || translation.state === 'error') koState = '한국어 번역 불가 · 영문 원문을 확인하세요'
    else if (translation.state === 'done') koState = '한국어 번역 없음 · 영문 원문을 확인하세요'
    else koState = '한국어 번역 중… (AI)'
  }

  return (
    <section className={styles.box} role="alert" aria-label="긴급 지시">
      <div className={styles.head}>
        <AlertTriangleIcon className={styles.icon} />
        <span>공식 경보의 행동지시</span>
      </div>
      {ko ? (
        <>
          <p className={styles.text}>{ko}</p>
          <p className={styles.aiNote}>AI 번역 · 아래 영문 원문이 공식 지시예요</p>
        </>
      ) : (
        <p className={styles.aiNote}>{koState}</p>
      )}
      <p className={styles.quote}>
        원문: <q lang="en">{unwrapNwsText(alert.instructionEn)}</q>
      </p>
    </section>
  )
}
