import { Link } from 'react-router-dom'
import { preparePath } from '@/lib/routes'
import { OVERLAP_LABELS, OVERLAP_NONE_LABEL, OVERLAP_PENDING_LABEL, SCHEDULE_KIND_LABELS } from '@/lib/labels'
import { ASSUMED_END_TEXT } from '@/services/mappers/conflict'
import { formatLocalDayTime } from '@/lib/time'
import type { OverlapResult, ScheduleItem as Item } from '@/types'
import { StatusBadge } from './StatusBadge'
import styles from './ScheduleItem.module.css'

interface Props {
  item: Item
  /** 없으면 판정 중(pending)이거나 판정할 경보가 없음 */
  result?: OverlapResult
  pending?: boolean
  now: Date
  compact?: boolean
  /** 겹침 확인·겹칠 가능성일 때 "대비 방법 보기 >" 링크 (일정 화면) */
  showPrepareLink?: boolean
}

export function ScheduleItem({ item, result, pending, now, compact, showPrepareLink }: Props) {
  const overlaps = result?.status === 'confirmed' || result?.status === 'possible'
  const label = result ? OVERLAP_LABELS[result.status] : pending ? OVERLAP_PENDING_LABEL : OVERLAP_NONE_LABEL
  const evidence = result
    ? result.evidenceKo
    : pending
      ? '서버에서 경보와 겹치는지 확인하는 중이에요'
      : '판정할 공식 경보가 없거나 불러오지 못했어요 · 위 경보 안내를 확인하세요'
  const when = item.endUtc
    ? `${formatLocalDayTime(item.startUtc, now)} ~ ${formatLocalDayTime(item.endUtc, now)}`
    : formatLocalDayTime(item.startUtc, now)

  return (
    <article className={`${styles.card} ${styles[result?.status ?? 'undeterminable']} ${compact ? styles.compact : ''}`}>
      <div className={styles.top}>
        <span className={styles.kind}>{SCHEDULE_KIND_LABELS[item.kind]}</span>
        <div className={styles.main}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.when}>{when} (현지)</p>
          {!compact && <p className={styles.address}>{item.address ?? '주소 없음'}</p>}
        </div>
        <div className={styles.badge}>
          <StatusBadge label={label.label} tone={label.tone} />
        </div>
      </div>
      <p className={styles.evidence}>
        <span className={styles.evidenceLabel}>근거:</span> {evidence}
      </p>
      {result?.assumedEnd && <p className={styles.assumed}>{ASSUMED_END_TEXT}</p>}
      {showPrepareLink && overlaps && (
        <Link to={preparePath(item.id)} className={styles.prepareLink}>
          대비 방법 보기 &gt;
        </Link>
      )}
    </article>
  )
}
