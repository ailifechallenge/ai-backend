import { OFFICIAL_EVACUATION_URL } from '@/config/contacts'
import { evacuationPath } from '@/lib/routes'
import type { Alert } from '@/types'
import { ButtonLink } from './Button'
import { MapPinIcon } from './Icons'
import styles from './EvacuationBanner.module.css'

/** 대피 이동 지시가 있는 경보에서만 렌더. 지도는 자동으로 열지 않고 이 버튼으로만 연다. */
export function EvacuationBanner({ alert }: { alert: Alert }) {
  if (alert.status !== 'active') return null
  if (!alert.evacuation.required) {
    // live 임시 규칙에 안 맞았다고 "대피 불필요"로 단정하지 않는다 → 지도 버튼만 숨기고 공식 안내로 연결
    if (alert.evacuation.basis !== 'rule') return null
    return (
      <p className={styles.unclear}>
        원문 행동지시에서 대피 이동 지시를 찾지 못했어요 · 대피 여부는{' '}
        <a href={OFFICIAL_EVACUATION_URL} target="_blank" rel="noopener noreferrer">
          공식 대피 안내
        </a>
        를 확인하세요
      </p>
    )
  }
  return (
    <section className={styles.banner} aria-label="대피 이동 지시">
      <div className={styles.text}>
        <MapPinIcon className={styles.icon} />
        <div className={styles.body}>
          <p className={styles.title}>대피 이동 지시가 있어요</p>
          <p className={styles.sub}>이 경보에서만 표시돼요</p>
        </div>
      </div>
      <ButtonLink to={evacuationPath(alert.id)} variant="caution">
        대피 지도 열기
      </ButtonLink>
    </section>
  )
}
