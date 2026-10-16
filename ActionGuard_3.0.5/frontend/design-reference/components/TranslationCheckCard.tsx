import type { Step } from '@/hooks/useAlertAnalysis'
import {
  DISPLAY_FIELD_LABELS,
  ISSUE_KIND_LABELS,
  ISSUE_METHOD_LABELS,
  ISSUE_SEVERITY_LABELS,
  NOT_VERIFIED_LABEL,
  VERIFY_STATUS_LABELS,
} from '@/lib/labels'
import type { AlertTranslation, Verification } from '@/types'
import { Button } from './Button'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'
import styles from './TranslationCheckCard.module.css'

export const NOT_A_GUARANTEE_TEXT = '‘불일치 미탐지’는 번역이 정확하다는 보증이나 안전 인증이 아니에요. 공식 원문과 함께 확인하세요.'

interface Props {
  translation: Step<AlertTranslation>
  verification: Step<Verification>
  onRetry: () => void
}

function progressText(translation: Step<AlertTranslation>, verification: Step<Verification>): string {
  if (translation.state === 'loading' || translation.state === 'idle') return '번역 중 → 검증 대기'
  if (verification.state === 'loading') return '번역 완료 → 검증 중 (몇 분 걸릴 수 있어요)'
  if (verification.state === 'done') return '번역 완료 → 검증 결과 확인'
  return '번역 → 검증'
}

/** EvidenceGuard 번역 검증 결과. 검증하지 못한 상태를 "불일치 없음"처럼 보이게 하지 않는다 */
export function TranslationCheckCard({ translation, verification, onRetry }: Props) {
  const header = verification.state === 'done' ? VERIFY_STATUS_LABELS[verification.data.status] : NOT_VERIFIED_LABEL

  return (
    <Card variant="caution" title="번역 검증" aside={<StatusBadge label={header.label} tone={header.tone} />}>
      <p className={styles.progress}>{progressText(translation, verification)}</p>

      {(verification.state === 'unavailable' || verification.state === 'error') && (
        <div className={styles.state}>
          <p className={styles.desc}>검증하지 못했어요. {verification.message}</p>
          {verification.state === 'error' && (
            <Button variant="secondary" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </div>
      )}

      {verification.state === 'done' && <Result data={verification.data} />}

      <p className={styles.fixed}>{NOT_A_GUARANTEE_TEXT}</p>
    </Card>
  )
}

function Result({ data }: { data: Verification }) {
  return (
    <>
      {data.issues.length > 0 ? (
        <ul className={styles.list}>
          {data.issues.map((issue, i) => {
            const severity = ISSUE_SEVERITY_LABELS[issue.severity]
            return (
              <li key={i} className={`${styles.item} ${issue.severity === 'critical' ? styles.critical : ''}`}>
                <div className={styles.tags}>
                  <span className={styles.type}>{ISSUE_KIND_LABELS[issue.kind]}</span>
                  <StatusBadge label={severity.label} tone={severity.tone} />
                  <span className={styles.meta}>
                    {DISPLAY_FIELD_LABELS[issue.field]} · {ISSUE_METHOD_LABELS[issue.method]}
                  </span>
                </div>
                <p className={styles.desc}>{issue.reason}</p>
                {issue.sourceQuote && (
                  <p className={styles.quote} lang="en">
                    원문: {issue.sourceQuote}
                  </p>
                )}
                {issue.translationQuote && <p className={styles.quote}>번역: {issue.translationQuote}</p>}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className={styles.desc}>규칙·AI 검사에서 탐지된 불일치가 없어요.</p>
      )}

      {data.unresolved.length > 0 && (
        <div className={styles.unresolved}>
          <p className={styles.unresolvedTitle}>확인하지 못한 항목</p>
          <ul>
            {data.unresolved.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
