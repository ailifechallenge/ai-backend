import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ActionSteps } from '@/components/ActionSteps'
import { AiBadge } from '@/components/AiBadge'
import { AlertStateView } from '@/components/AlertStateView'
import { BottomCta } from '@/components/BottomCta'
import { Button, ButtonLink, ButtonRow } from '@/components/Button'
import { Card, Note, PageBody } from '@/components/Card'
import { GlossarySheet } from '@/components/GlossarySheet'
import { OriginalTextSheet } from '@/components/OriginalTextSheet'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { TranslationCheckCard } from '@/components/TranslationCheckCard'
import { UrgencyCard } from '@/components/UrgencyCard'
import { UrgentInstruction } from '@/components/UrgentInstruction'
import { isMock } from '@/config/api'
import { getNow } from '@/config/demo'
import { useGuidance, useTranslation, useVerification, type Step } from '@/hooks/useAlertAnalysis'
import { useAsync } from '@/hooks/useAsync'
import { useCurrentAlert } from '@/hooks/useCurrentAlert'
import { useUrgency } from '@/hooks/useUrgency'
import { checkedLabel, timeRows } from '@/lib/alertTime'
import { UNDETERMINABLE_TEXT } from '@/lib/evaluateOverlap'
import { ALERT_STATUS_LABELS } from '@/lib/labels'
import { getAlert } from '@/services/alertService'
import type { AlertTranslation, GlossaryEntry } from '@/types'
import styles from './AlertDetail.module.css'

function translationStateText(step: Step<AlertTranslation>): string {
  if (step.state === 'unavailable' || step.state === 'error') return `AI 설명 불가 · ${step.message}`
  return 'AI 설명을 만드는 중이에요…'
}

export default function AlertDetail() {
  const { id = '' } = useParams()
  const { alert: current } = useCurrentAlert()
  // 대표 경보면 이미 받은 것을 쓰고, 아니면 보관한 목록(15분)·재조회에서 찾는다
  const { data: found, loading, error, reload } = useAsync(
    () => (current && current.id === id ? Promise.resolve(current) : getAlert(id)),
    [id, current],
  )
  const alert = found ?? undefined
  const { step: translation } = useTranslation(alert)
  const { step: guidance, retry: retryGuidance } = useGuidance(alert)
  // AI 호출 예산: 검증은 상세 화면 진입 시 1회(캐시)
  const { step: verification, retry: retryVerification } = useVerification(alert, translation, true)
  // 대응 4단계: 규칙 판정을 먼저 보여 주고 AI 보조 판정을 이어서 반영한다
  const urgency = useUrgency(alert)
  const [entry, setEntry] = useState<GlossaryEntry | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const now = getNow()

  if (error) {
    return (
      <>
        <PageHeader title="경보 해석" backTo="/home" />
        <PageBody>
          <AlertStateView load={{ status: 'error', message: error }} onRetry={reload} />
        </PageBody>
      </>
    )
  }

  if (loading && !alert) return <PageHeader title="경보 해석" backTo="/home" />

  if (!alert) {
    return (
      <>
        <PageHeader title="경보 해석" backTo="/home" />
        <PageBody>
          <Card variant="dashed">
            <p className={styles.strong}>{UNDETERMINABLE_TEXT}</p>
            <p className={styles.sub}>이 경보를 공식 데이터에서 찾을 수 없어요. 만료됐거나 목록에서 빠졌을 수 있어요.</p>
          </Card>
        </PageBody>
      </>
    )
  }

  const status = ALERT_STATUS_LABELS[alert.status]
  const tr = translation.state === 'done' ? translation.data : null

  return (
    <>
      <PageHeader title="경보 해석" subtitle="공식 원문을 한국어로 풀어 보여 드려요" backTo="/home" />
      <PageBody>
        <UrgentInstruction alert={alert} translation={translation} />

        <Card as="article">
          <p className={styles.label}>원래 경보명</p>
          <div className={styles.nameRow}>
            <p className={styles.nameEn} lang="en">
              {alert.nameEn}
            </p>
            <StatusBadge label={status.label} tone={status.tone} />
          </div>

          <p className={styles.label}>한국어 의미</p>
          <p className={styles.meaning}>
            <strong>{alert.nameKo}</strong>
            {tr?.hazardExplanation ? ` — ${tr.hazardExplanation}` : ''}
          </p>
          {tr ? (
            tr.hazardExplanation && <AiBadge label="AI 설명" />
          ) : (
            <p className={styles.hint}>{translationStateText(translation)}</p>
          )}
          {tr && tr.glossary.length > 0 && (
            <div className={styles.chips} aria-label="용어 풀이">
              {tr.glossary.map((g) => (
                <button key={g.term} type="button" className={styles.chip} lang="en" onClick={() => setEntry(g)}>
                  {g.term}
                </button>
              ))}
            </div>
          )}

          <p className={styles.label}>대상 지역</p>
          <p className={styles.areaTime}>{alert.areaLabel.trim() ? alert.areaLabel : `대상 지역 ${UNDETERMINABLE_TEXT}`}</p>

          <p className={styles.label}>시각 (현지 · America/Chicago 기준)</p>
          {alert.status === 'incomplete' && !alert.startsAtUtc && !alert.endsAtUtc && !alert.messageExpiresAtUtc ? (
            <p className={styles.areaTime}>유효 시간 {UNDETERMINABLE_TEXT}</p>
          ) : (
            <dl className={styles.times}>
              {timeRows(alert, now).map((row) => (
                <div key={row.label} className={styles.timeRow}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className={styles.hint}>메시지 만료는 재난 종료를 뜻하지 않아요.</p>
        </Card>

        <UrgencyCard
          assessment={urgency.current}
          aiPending={urgency.phase === 'ai'}
          error={urgency.error}
          onRetry={urgency.retry}
        />

        {tr && (
          <Card title="AI 번역 요약" aside={<AiBadge />}>
            {tr.summary.length > 0 && (
              <ul className={styles.summary}>
                {tr.summary.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
            <details className={styles.fullTranslation}>
              <summary>번역 전문 보기</summary>
              <p>{tr.translation}</p>
            </details>
            <p className={styles.hint}>AI 번역은 공식 원문을 대신하지 않아요. 아래 검증 결과와 함께 확인하세요.</p>
          </Card>
        )}

        <ActionSteps
          alert={alert}
          title="필요한 행동 (원문 근거)"
          guidance={guidance}
          translation={translation}
          onRetry={retryGuidance}
        />

        <TranslationCheckCard translation={translation} verification={verification} onRetry={retryVerification} />

        <Note>
          AI 번역 · 출처 {alert.source} · 최신 확인 {checkedLabel(alert)}
          {isMock() ? ' (예시)' : ''}
        </Note>

        {alert.changes.length > 0 && (
          <details className={styles.changes}>
            <summary className={styles.summaryToggle}>경보 변경 내역</summary>
            <ol className={styles.timeline}>
              {alert.changes.map((c, i) => (
                <li key={i}>
                  <span className={styles.time}>{c.atLocalLabel}</span>
                  <span className={styles.changeText}>{c.textKo}</span>
                </li>
              ))}
            </ol>
            <p className={styles.sub}>경보가 바뀌면 영향받는 일정을 다시 확인해요.</p>
          </details>
        )}
      </PageBody>

      <BottomCta>
        <ButtonRow>
          <Button variant="secondary" onClick={() => setShowOriginal(true)}>
            원문 보기
          </Button>
          <ButtonLink to="/schedule">내 일정 확인</ButtonLink>
        </ButtonRow>
      </BottomCta>

      <GlossarySheet entry={entry} onClose={() => setEntry(null)} />
      <OriginalTextSheet alert={alert} open={showOriginal} onClose={() => setShowOriginal(false)} />
    </>
  )
}
