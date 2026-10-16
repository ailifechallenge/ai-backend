import type { Step } from '@/hooks/useAlertAnalysis'
import { UNDETERMINABLE_TEXT } from '@/lib/evaluateOverlap'
import { unwrapNwsText } from '@/lib/nwsText'
import type { Alert, AlertTranslation, GuidanceCard, GuidanceResult } from '@/types'
import { AiBadge } from './AiBadge'
import { Button } from './Button'
import { Card } from './Card'
import { ExternalIcon, InfoIcon } from './Icons'
import styles from './ActionSteps.module.css'

export const NO_ACTION_GUIDE_TEXT = '공식 행동 안내를 확인할 수 없어요 — 현지 공식 안내를 확인하세요'

interface Props {
  alert: Alert
  title: string
  guidance: Step<GuidanceResult>
  translation: Step<AlertTranslation>
  onRetry: () => void
  /** 위에 긴급 지시 카드로 같은 원문을 이미 보여 줄 때 공식 지시 본문을 접어 둔다 */
  collapseOfficial?: boolean
  /** 홈: 제목 옆 출처와 적용 조건 표시를 숨긴다 (상세 화면에서는 보여 준다) */
  hideMeta?: boolean
}

/**
 * 행동지침.
 * - 공식 행동지시(official): 서버가 경보 원문과 연결했을 때만 생긴다. 영문 원문 그대로 + 가능하면 AI 번역.
 * - 일반 안전수칙(general): 공식 지시가 아님을 밝히고 적용 조건을 함께 보여 준다.
 * 경보가 유효(active)하지 않으면 일반 수칙을 "지금 하라"처럼 보여 주지 않는다.
 */
export function ActionSteps({ alert, title, guidance, translation, onRetry, collapseOfficial, hideMeta }: Props) {
  if (alert.status !== 'active') return <UnknownNotice title={title} alert={alert} />

  if (guidance.state !== 'done') {
    const failed = guidance.state === 'error' || guidance.state === 'unavailable'
    return (
      <Card title={title} variant={failed ? 'dashed' : 'default'}>
        {failed ? (
          <>
            <p className={styles.unknownStrong}>{NO_ACTION_GUIDE_TEXT}</p>
            <p className={styles.unknownText}>행동지침을 불러오지 못했어요. {guidance.message}</p>
            <div className={styles.retry}>
              <Button variant="secondary" onClick={onRetry}>
                다시 시도
              </Button>
            </div>
          </>
        ) : (
          <p className={styles.unknownText} role="status">
            공식 행동지침을 불러오는 중이에요
          </p>
        )}
      </Card>
    )
  }

  const official = guidance.data.cards.filter((c) => c.category === 'official')
  const general = guidance.data.cards.filter((c) => c.category === 'general')

  return (
    <>
      <Card title={title} aside={hideMeta ? undefined : <span className={styles.source}>출처 {official[0]?.agency ?? alert.source}</span>}>
        {official.length === 0 ? (
          <div className={styles.unknown}>
            <InfoIcon className={styles.unknownIcon} />
            <div className={styles.body}>
              <p className={styles.unknownStrong}>{NO_ACTION_GUIDE_TEXT}</p>
              <p className={styles.unknownText}>이 경보 원문에는 공식 행동지시(instruction)가 없어요.</p>
            </div>
          </div>
        ) : (
          official.map((card, i) => (
            <OfficialCard key={i} card={card} translation={translation} collapsed={collapseOfficial} hideCondition={hideMeta} />
          ))
        )}
      </Card>

      {general.length > 0 && (
        <Card title="일반 안전수칙 · 공식 지시 아님">
          <ul className={styles.generalList}>
            {general.map((card, i) => (
              <li key={i} className={styles.general}>
                <p className={styles.generalTitle}>{card.title}</p>
                <p className={styles.generalText}>{card.text}</p>
                {!hideMeta && <p className={styles.condition}>적용 조건: {card.condition}</p>}
                <a className={styles.cardLink} href={card.url} target="_blank" rel="noopener noreferrer">
                  {card.agency} <ExternalIcon />
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}

function OfficialCard({
  card,
  translation,
  collapsed,
  hideCondition,
}: {
  card: GuidanceCard
  translation: Step<AlertTranslation>
  collapsed?: boolean
  hideCondition?: boolean
}) {
  const original = (
    <p className={styles.officialText} lang="en">
      {unwrapNwsText(card.text)}
    </p>
  )
  return (
    <div className={styles.official}>
      <p className={styles.officialLabel}>공식 행동지시 · 원문 그대로(영문)</p>
      {collapsed ? (
        <details className={styles.details}>
          <summary>위 긴급 지시와 같은 원문 · 펼쳐 보기</summary>
          {original}
        </details>
      ) : (
        <>
          {original}
          <InstructionTranslation translation={translation} />
        </>
      )}
      {!hideCondition && <p className={styles.condition}>적용 조건: {card.condition}</p>}
      <a className={styles.cardLink} href={card.url} target="_blank" rel="noopener noreferrer">
        공식 출처 · {card.agency} <ExternalIcon />
      </a>
    </div>
  )
}

/** 공식 지시의 한국어 번역 (AI). 번역 전·불가 상태를 숨기지 않는다 */
export function InstructionTranslation({ translation }: { translation: Step<AlertTranslation> }) {
  if (translation.state === 'done') {
    if (!translation.data.instructionKo) return <p className={styles.trState}>공식 지시의 한국어 번역이 없어요 · 영문 원문을 확인하세요.</p>
    return (
      <div className={styles.ko}>
        <AiBadge />
        <p className={styles.koText}>{translation.data.instructionKo}</p>
      </div>
    )
  }
  if (translation.state === 'unavailable' || translation.state === 'error') {
    return <p className={styles.trState}>한국어 번역 불가 · {translation.message}</p>
  }
  return (
    <p className={styles.trState} role="status">
      한국어 번역 중… (AI)
    </p>
  )
}

/** 정보 부족·만료·해제 시 행동 카드 대신 표시 */
export function UnknownNotice({ title, alert }: { title?: string; alert: Alert }) {
  const ended = alert.status === 'expired' || alert.status === 'cancelled'
  return (
    <Card variant="dashed" title={title}>
      <div className={styles.unknown}>
        <InfoIcon className={styles.unknownIcon} />
        <div className={styles.body}>
          <p className={styles.unknownStrong}>
            {ended ? `이 경보는 ${alert.status === 'cancelled' ? '해제' : '만료'}되었어요` : UNDETERMINABLE_TEXT}
          </p>
          <p className={styles.unknownText}>{NO_ACTION_GUIDE_TEXT}</p>
        </div>
      </div>
    </Card>
  )
}
