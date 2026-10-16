import type { ReactNode } from 'react'
import styles from './BottomCta.module.css'

/** 탭바 없는 상세 화면의 주요 버튼을 화면 맨 아래에 고정한다 (좌우·하단 16px). 콘텐츠가 가려지지 않게 같은 높이의 여백을 함께 둔다. */
export function BottomCta({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.spacer} aria-hidden />
      <div className={styles.bar}>{children}</div>
    </>
  )
}
