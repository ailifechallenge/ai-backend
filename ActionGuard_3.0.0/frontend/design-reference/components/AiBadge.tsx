import styles from './AiBadge.module.css'

/** AI가 작성한 내용 표시 (공식 데이터와 구분) */
export function AiBadge({ label = 'AI 번역' }: { label?: string }) {
  return <span className={styles.badge}>{label}</span>
}
