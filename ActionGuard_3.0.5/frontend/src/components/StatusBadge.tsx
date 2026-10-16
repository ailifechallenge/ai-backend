type Tone = 'info' | 'caution' | 'neutral' | 'muted' | 'unknown'
import styles from './StatusBadge.module.css'

/** 상태 배지. 색과 함께 항상 텍스트 라벨을 보여 준다. 톤·라벨은 lib/labels.ts에서만 가져온다. */
export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>
}

/** 정보성 pill ("시연용 예시", "공식 경보" 등) */
export function Pill({ children, variant = 'outline' }: { children: string; variant?: 'outline' | 'solid' | 'dark' }) {
  return <span className={`${styles.badge} ${styles[`pill_${variant}`]}`}>{children}</span>
}
