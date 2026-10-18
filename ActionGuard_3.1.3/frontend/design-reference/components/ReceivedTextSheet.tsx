import { useState, type FormEvent } from 'react'
import { checkReceivedText, type ReceivedTextCheck } from '@/services/alertService'
import type { Alert } from '@/types'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'
import { CameraIcon } from './Icons'
import styles from './Sheets.module.css'

/** 사용자가 받은 문자를 직접 붙여넣어 공식 경보와 대조한다 (앱이 문자를 자동으로 읽지 않음) */
export function ReceivedTextSheet({ alert, open, onClose }: { alert: Alert; open: boolean; onClose: () => void }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ReceivedTextCheck | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setResult(await checkReceivedText(text, alert))
  }

  const close = () => {
    setResult(null)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={close} title="받은 문자 확인">
      <form onSubmit={submit} style={{ display: 'contents' }}>
        <label className={styles.label} htmlFor="received-text">
          받은 경보 문자를 복사해 붙여넣어 주세요
        </label>
        <textarea
          id="received-text"
          className={styles.textarea}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setResult(null)
          }}
          placeholder="예: Flash Flood Warning this area til 6:30 PM CDT…"
        />
        {alert.receivedSmsText && (
          <Button variant="ghost" onClick={() => setText(alert.receivedSmsText!)}>
            시연용 문구 넣기
          </Button>
        )}
        <div className={styles.photo}>
          <Button variant="secondary" disabled aria-describedby="photo-hint">
            <CameraIcon width={18} height={18} /> 사진 첨부
          </Button>
          <span id="photo-hint" className={styles.photoHint}>
            준비 중
          </span>
        </div>
        <Button type="submit" block disabled={!text.trim()}>
          공식 경보와 대조
        </Button>
      </form>
      {result && (
        <p role="status" className={`${styles.result} ${result.matched ? styles.resultMatched : styles.resultUnmatched}`}>
          {result.messageKo}
        </p>
      )}
      <p className={styles.meta}>붙여넣은 문자는 대조에만 쓰고 저장하지 않아요 · 시연용 예시</p>
    </BottomSheet>
  )
}
