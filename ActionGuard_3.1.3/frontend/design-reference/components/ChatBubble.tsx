import { Link } from 'react-router-dom'
import { CHAT_MODE_LABELS, OVERLAP_LABELS } from '@/lib/labels'
import type { ChatMessage, OcrCard } from '@/types'
import { AiBadge } from './AiBadge'
import { Button } from './Button'
import { ExternalIcon } from './Icons'
import { StatusBadge } from './StatusBadge'
import styles from './ChatBubble.module.css'

export function ChatBubble({ message, onRetry }: { message: ChatMessage; onRetry?: (question: string) => void }) {
  const isUser = message.role === 'user'
  const label = message.overlapStatus ? OVERLAP_LABELS[message.overlapStatus] : null

  if (message.ocr) return <OcrResultCard ocr={message.ocr} />

  return (
    <div className={`${styles.row} ${isUser ? styles.user : styles.bot}`}>
      <div className={`${styles.bubble} ${message.imageUrl ? styles.withImage : ''}`}>
        {message.imageUrl && <img src={message.imageUrl} alt="첨부한 사진" className={styles.image} />}
        {(label || message.mode) && (
          <div className={styles.badge}>
            {label && <StatusBadge label={label.label} tone={label.tone} />}
            {message.mode &&
              (message.mode === 'evidence' ? (
                <AiBadge label={CHAT_MODE_LABELS.evidence} />
              ) : (
                <span className={styles.mode}>{CHAT_MODE_LABELS[message.mode]}</span>
              ))}
            {message.aiUsed && message.mode !== 'evidence' && <AiBadge label="AI 설명 포함" />}
          </div>
        )}
        {message.text && <p className={styles.text}>{message.text}</p>}
        {message.items && message.items.length > 0 && (
          <ul className={styles.items} aria-label="조회 결과">
            {message.items.map((item, i) => (
              <li key={i} className={styles.item}>
                <p className={styles.itemTitle}>
                  {item.title}
                  {item.distanceLabel && <span className={styles.itemDistance}> · {item.distanceLabel}</span>}
                </p>
                {item.detail && <p className={styles.itemDetail}>{item.detail}</p>}
                {/* 상태 문구는 서버 문구 그대로 */}
                <p className={styles.itemStatus}>{item.status}</p>
              </li>
            ))}
          </ul>
        )}
        {message.scopeNote && <p className={styles.scopeNote}>{message.scopeNote}</p>}
        {message.actions && message.actions.length > 0 && (
          <div className={styles.actions}>
            {message.actions.map((a) => (
              <Link key={a.path} to={a.path} className={styles.action}>
                {a.label} &gt;
              </Link>
            ))}
          </div>
        )}
        {message.retryQuestion && onRetry && (
          <div className={styles.retry}>
            <Button variant="secondary" onClick={() => onRetry(message.retryQuestion!)}>
              다시 시도
            </Button>
          </div>
        )}
        {!isUser && message.sources && message.sources.length > 0 && (
          <ul className={styles.sources} aria-label="출처">
            {message.sources.map((s, i) => (
              <li key={i}>
                <p className={styles.sourceTitle}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.title} <ExternalIcon />
                    </a>
                  ) : (
                    s.title
                  )}
                </p>
                <p className={styles.sourceQuote}>“{s.quote}”</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** 사진 속 문자 읽기: 처리 중 → 결과 카드 (AI 아님 · 서버 OCR) */
function OcrResultCard({ ocr }: { ocr: OcrCard }) {
  if (ocr.state === 'reading') {
    return (
      <div className={`${styles.row} ${styles.bot}`}>
        <p className={styles.ocrReading} role="status">
          사진 속 문자를 읽는 중이에요…
        </p>
      </div>
    )
  }

  return (
    <div className={`${styles.row} ${styles.bot}`}>
      <div className={`${styles.bubble} ${styles.ocrCard}`}>
        <p className={styles.ocrTitle}>사진 속 문자 확인</p>
        {ocr.state === 'error' ? (
          <p className={styles.text}>
            사진 속 문자를 읽지 못했어요 · {ocr.message}
            {'\n'}받은 문자를 직접 입력하거나 홈의 "받은 문자 확인"에 붙여넣어 주세요.
          </p>
        ) : (
          <>
            <p className={styles.ocrLabel}>읽은 문자</p>
            <p className={styles.ocrText} lang="en">
              {ocr.text}
            </p>
            <p className={`${styles.ocrMatch} ${ocr.matched ? styles.matched : ''}`}>{ocr.matchText}</p>
            <p className={styles.ocrNote}>{ocr.note}</p>
          </>
        )}
      </div>
    </div>
  )
}
