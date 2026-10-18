import type { UrgencyAssessment } from '@/types'
import { Button } from './Button'
import styles from './UrgencyCard.module.css'

const STEPS = ['정보', '주의', '대비', '대피'] as const

const ACTION_LABELS: Record<UrgencyAssessment['actionKind'], string> = {
  shelter: '실내 대피',
  higher_ground: '높은 곳으로 이동',
  evacuate: '지시된 구역에서 대피',
  protect: '지금 보호행동',
  prepare: '지금 준비',
  caution: '활동 조정',
  monitor: '후속 안내 확인',
  unknown: '원문 확인',
}

/** 공식 원문이 아닌 경우에만 출처를 반드시 밝힌다 */
const ORIGIN_LABELS: Partial<Record<UrgencyAssessment['provenance'], string>> = {
  input: '입력문 해석 · 발령 미확인',
  example: '가상 예시 · 실제 경보 아님',
}

interface Props {
  assessment: UrgencyAssessment | null
  /** AI 보조 판정을 기다리는 중 (기본 판정을 먼저 보여 준다) */
  aiPending: boolean
  error: string | null
  onRetry: () => void
}

/** 대응 4단계(정보·주의·대비·대피) — 앱 참고 척도이며 공식 경보 등급이 아니다 */
export function UrgencyCard({ assessment: a, aiPending, error, onRetry }: Props) {
  const level = a && !a.inactive ? a.level : null
  const origin = a ? ORIGIN_LABELS[a.provenance] : undefined

  return (
    <article className={`${styles.card} ${styles[`level${level ?? 'Unknown'}`]}`} aria-labelledby="urgency-heading">
      <div className={styles.topline}>
        <span className={styles.title}>대응 4단계</span>
        {origin && <span className={styles.origin}>{origin}</span>}
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <p className={styles.headline}>대응 단계를 판정하지 못했어요</p>
          <p className={styles.method}>{error} 공식 원문과 행동지시를 직접 확인하세요.</p>
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          <ol className={styles.scale} aria-label="앱 행동 척도: 정보, 주의, 대비, 대피">
            {STEPS.map((label, i) => (
              <li key={label} className={level === i + 1 ? styles.isCurrent : ''} aria-current={level === i + 1 ? 'step' : undefined}>
                <span className={styles.num}>{i + 1}</span> {label}
              </li>
            ))}
          </ol>

          <div className={styles.current}>
            {!a ? (
              <strong>판정 중</strong>
            ) : level ? (
              <>
                <strong>{a.label}</strong>
                <span>{ACTION_LABELS[a.actionKind]}</span>
              </>
            ) : (
              <strong>{a.inactive ? '현재 단계 미표시' : '확인 필요'}</strong>
            )}
          </div>

          {a && (
            <>
              <h2 id="urgency-heading" className={styles.headline}>
                {a.headline}
              </h2>
              <p className={styles.primary}>{(level && a.actions[0]) || a.meaning}</p>
            </>
          )}
          <p className={styles.method} role="status">
            {aiPending ? 'AI 원문 해석 중 · 기본 판정을 먼저 보여드려요' : (a?.methodNote ?? '원문을 확인하고 있어요.')}
          </p>
          {a && <p className={styles.notice}>{a.notice}</p>}
        </>
      )}
    </article>
  )
}
