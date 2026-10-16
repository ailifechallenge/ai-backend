import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

type Variant = 'default' | 'caution' | 'urgent' | 'dashed' | 'info'

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  variant?: Variant
  title?: ReactNode
  aside?: ReactNode
  as?: 'section' | 'div' | 'article'
}

export function Card({ variant = 'default', title, aside, as: Tag = 'section', className, children, ...rest }: Props) {
  return (
    <Tag className={[styles.card, styles[variant], className].filter(Boolean).join(' ')} {...rest}>
      {(title || aside) && (
        <div className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
      )}
      {children}
    </Tag>
  )
}

/** 페이지 본문 래퍼 (카드 사이 간격·좌우 여백) */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[styles.body, className].filter(Boolean).join(' ')}>{children}</div>
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{children}</h2>
      {aside && <span className={styles.sectionAside}>{aside}</span>}
    </div>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>
}
