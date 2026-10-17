import type { GlossaryEntry } from '@/types'
import { AiBadge } from './AiBadge'
import { BottomSheet } from './BottomSheet'
import styles from './Sheets.module.css'

/** 용어 풀이 — AI 번역 결과의 glossary를 그대로 보여 준다 */
export function GlossarySheet({ entry, onClose }: { entry: GlossaryEntry | null; onClose: () => void }) {
  return (
    <BottomSheet open={entry !== null} onClose={onClose} title="용어 풀이">
      <p className={styles.term} lang="en">
        {entry?.term}
      </p>
      <p className={styles.desc}>{entry?.meaning}</p>
      <p className={styles.meta}>
        <AiBadge label="AI 설명" /> 최종 의미는 공식 원문 기준
      </p>
    </BottomSheet>
  )
}
