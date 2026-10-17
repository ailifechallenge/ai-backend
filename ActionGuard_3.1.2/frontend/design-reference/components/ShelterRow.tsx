import { SHELTER_LABELS, shelterStatusTone } from '@/lib/labels'
import type { Shelter } from '@/types'
import { StatusBadge } from './StatusBadge'
import styles from './ShelterRow.module.css'

export function ShelterRow({ shelter }: { shelter: Shelter }) {
  const suitability = SHELTER_LABELS.suitability_check
  return (
    <li className={styles.row}>
      <span className={styles.marker} aria-label={`마커 ${shelter.marker}`}>
        {shelter.marker}
      </span>
      <div className={styles.body}>
        <p className={styles.name}>
          {shelter.name} <span className={styles.distance}>· {shelter.distanceLabel}</span>
        </p>
        <p className={styles.operator}>{shelter.operator}</p>
        {shelter.address && <p className={styles.operator}>{shelter.address}</p>}
        <div className={styles.badge}>
          {/* 상태 문구는 서버 status_label 그대로 */}
          <StatusBadge label={shelter.statusLabel} tone={shelterStatusTone(shelter.open)} />
          {shelter.typeLabel && <StatusBadge label={shelter.typeLabel} tone="muted" />}
          {shelter.suitabilityUnknown && <StatusBadge label={suitability.label} tone={suitability.tone} />}
        </div>
      </div>
    </li>
  )
}
