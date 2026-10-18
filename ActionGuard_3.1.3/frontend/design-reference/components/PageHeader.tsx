import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackIcon } from './Icons'
import styles from './PageHeader.module.css'

interface Props {
  title: string
  subtitle?: ReactNode
  right?: ReactNode
  /** 뒤로가기 버튼. 히스토리가 없으면 fallback 경로로 이동 */
  backTo?: string
}

/** "A · B · C" 문자열은 짧은 조각 단위로만 줄바꿈되게 한다 (예: "오늘 / 18:30까지" 분리 방지) */
function renderSubtitle(subtitle: ReactNode): ReactNode {
  if (typeof subtitle !== 'string') return subtitle
  const parts = subtitle.split(' · ')
  return parts.map((part, i) => (
    <span key={i}>
      <span className={part.length <= 18 ? styles.nowrap : undefined}>{part}</span>
      {i < parts.length - 1 && ' · '}
    </span>
  ))
}

export function PageHeader({ title, subtitle, right, backTo }: Props) {
  const navigate = useNavigate()
  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(backTo ?? '/home')
  }

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {backTo && (
          <button type="button" className={styles.back} onClick={goBack} aria-label="뒤로 가기">
            <BackIcon />
          </button>
        )}
        <div className={styles.titles}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{renderSubtitle(subtitle)}</p>}
        </div>
        {right && <div className={styles.right}>{right}</div>}
      </div>
    </header>
  )
}
