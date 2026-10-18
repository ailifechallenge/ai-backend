import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertStateView } from '@/components/AlertStateView'
import { BottomSheet } from '@/components/BottomSheet'
import { CameraCapture } from '@/components/CameraCapture'
import { ChatBubble } from '@/components/ChatBubble'
import { CameraIcon, PlusIcon, SendIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { isMock } from '@/config/api'
import { useCurrentAlert } from '@/hooks/useCurrentAlert'
import { useScheduleOverlaps } from '@/hooks/useScheduleOverlaps'
import { CHAT_GREETING, CHAT_SEED_QUESTION, CHAT_SUGGESTIONS } from '@/mocks/chat'
import { askChat, CHAT_QUESTION_MAX } from '@/services/chatService'
import { checkReceivedText } from '@/services/alertService'
import { errorMessage } from '@/services/http'
import { readImageText, validateImage } from '@/services/ocrService'
import type { ChatMessage } from '@/types'
import styles from './Chat.module.css'

// 챗봇은 기획 F1~F8 밖의 기능 — 제거 시 이 파일, chatService, mocks/chat, ChatBubble, 라우트/탭만 지우면 된다.

export default function Chat() {
  const { load, alert, retry } = useCurrentAlert()
  const { items, loading, now } = useScheduleOverlaps(alert)
  const [messages, setMessages] = useState<ChatMessage[]>([CHAT_GREETING])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [photoSheet, setPhotoSheet] = useState(false)
  const [attachment, setAttachment] = useState<{ file: File; url: string } | null>(null)
  const [attachError, setAttachError] = useState<string | null>(null)
  const cameraInput = useRef<HTMLInputElement>(null)
  const albumInput = useRef<HTMLInputElement>(null)
  const objectUrls = useRef<string[]>([])
  const seeded = useRef<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // mock 데모 대화 시드. live에서는 AI 한도 때문에 자동 호출하지 않고 추천 질문 칩으로 둔다.
  useEffect(() => {
    if (!isMock() || !alert || loading || seeded.current === alert.id) return
    seeded.current = alert.id
    askChat(CHAT_SEED_QUESTION, alert, items, now).then((answer) => {
      setMessages([CHAT_GREETING, { id: 'seed-q', role: 'user', text: CHAT_SEED_QUESTION }, answer])
    })
  }, [alert, items, loading, now])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, pending])

  // 화면을 떠날 때 사진 미리보기 URL 정리
  useEffect(() => {
    const urls = objectUrls.current
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  const attachFile = (file: File) => {
    const problem = validateImage(file)
    if (problem) {
      setAttachError(problem)
      return
    }
    const url = URL.createObjectURL(file)
    objectUrls.current.push(url)
    setAttachError(null)
    setAttachment({ file, url })
  }

  const pickPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    setPhotoSheet(false)
    if (file) attachFile(file)
  }

  /** 카메라로 촬영: 카메라 API가 있으면 앱 안에서 카메라를 열고, 없으면 휴대폰 기본 카메라 입력으로 연다 */
  const openCamera = () => {
    setPhotoSheet(false)
    if (typeof navigator.mediaDevices?.getUserMedia === 'function') setCameraOpen(true)
    else cameraInput.current?.click()
  }

  const cameraUnavailable = useCallback((reason: string) => {
    setCameraOpen(false)
    setAttachError(`${reason} "앨범에서 선택"으로 사진을 올릴 수 있어요.`)
  }, [])

  /** 사진 전송: 내 말풍선에 사진 → "읽는 중" → 결과 카드 */
  const sendPhoto = async (photo: { file: File; url: string }, text: string) => {
    const resultId = `ocr-${Date.now()}`
    setMessages((m) => [
      ...m,
      { id: `user-${Date.now()}`, role: 'user', text, imageUrl: photo.url, local: !text },
      { id: resultId, role: 'bot', text: '', local: true, ocr: { state: 'reading' } },
    ])
    let ocr: ChatMessage['ocr']
    try {
      const r = await readImageText(photo.file, alert)
      const check = alert ? await checkReceivedText(r.text, alert) : null
      ocr = {
        state: 'done',
        text: r.text,
        note: r.note,
        matched: check ? check.matched : null,
        matchText: check ? check.messageKo : '공식 경보를 불러오지 못해 대조하지 못했어요 · 공식 경보 확인 필요',
      }
    } catch (e) {
      ocr = { state: 'error', message: errorMessage(e) }
    }
    setMessages((m) => m.map((x) => (x.id === resultId ? { ...x, ocr } : x)))
  }

  const ask = async (question: string, addUserBubble = true) => {
    const text = question.trim().slice(0, CHAT_QUESTION_MAX)
    if (!text || !alert || pending) return
    const history = messages
    if (addUserBubble) setMessages((m) => [...m, { id: `user-${Date.now()}`, role: 'user', text }])
    setPending(true)
    try {
      const answer = await askChat(text, alert, items, now, history)
      setMessages((m) => [...m, answer])
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: 'bot',
          local: true,
          text: `답변을 가져오지 못했어요 · ${errorMessage(e)}`,
          retryQuestion: text,
        },
      ])
    } finally {
      setPending(false)
    }
  }

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    setInput('')
    if (attachment) {
      const photo = attachment
      setAttachment(null)
      await sendPhoto(photo, text)
      // 사진과 함께 쓴 질문은 문자 확인 뒤에 이어서 보낸다 (말풍선은 이미 사진과 함께 표시됨)
      if (text && alert) await ask(text, false)
      return
    }
    void ask(text)
  }

  const retryFrom = (question: string) => {
    // 오류 말풍선을 지우고 같은 질문을 다시 보낸다
    setMessages((m) => m.filter((x) => x.retryQuestion !== question))
    void ask(question, false)
  }

  const disabledReason = !alert ? '공식 경보를 확인한 뒤에 질문할 수 있어요.' : pending ? '답변을 기다리는 중이에요.' : null

  return (
    <>
      <PageHeader title="ActionGuard 도우미" />
      {load.status !== 'ready' && (
        <div className={styles.state}>
          <AlertStateView load={load} onRetry={retry} />
        </div>
      )}
      <div className={styles.thread} aria-live="polite">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} onRetry={retryFrom} />
        ))}
        {pending && (
          <p className={styles.pending} role="status">
            답변을 만드는 중이에요… (최대 2분)
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className={styles.composer}>
        {alert && (
          <div className={styles.chips} aria-label="추천 질문">
            {CHAT_SUGGESTIONS.map((q) => (
              <button key={q} type="button" className={styles.chip} onClick={() => void ask(q)} disabled={pending}>
                {q}
              </button>
            ))}
          </div>
        )}
        {attachment && (
          <div className={styles.preview}>
            <img src={attachment.url} alt="첨부할 사진 미리보기" className={styles.thumb} />
            <button type="button" className={styles.removeThumb} aria-label="첨부 사진 삭제" onClick={() => setAttachment(null)}>
              ✕
            </button>
          </div>
        )}
        {attachError && (
          <p className={styles.attachError} role="alert">
            {attachError}
          </p>
        )}
        <form className={styles.form} onSubmit={send}>
          <button type="button" className={styles.attach} aria-label="사진 첨부" onClick={() => setPhotoSheet(true)} disabled={pending}>
            <PlusIcon width={22} height={22} />
          </button>
          <label htmlFor="chat-input" className="visually-hidden">
            질문 입력
          </label>
          <input
            id="chat-input"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={alert ? '예: 호텔 숙박은 경보와 겹쳐?' : '공식 경보를 확인한 뒤 질문할 수 있어요'}
            autoComplete="off"
            maxLength={CHAT_QUESTION_MAX}
            disabled={!alert}
          />
          <button
            type="submit"
            className={styles.send}
            aria-label="전송"
            disabled={pending || (attachment ? false : !input.trim() || Boolean(disabledReason))}
          >
            <SendIcon width={20} height={20} />
          </button>
        </form>
        {!alert && <p className={styles.disabledReason}>{disabledReason}</p>}
      </div>

      <BottomSheet open={photoSheet} onClose={() => setPhotoSheet(false)} title="사진 첨부">
        <p className={styles.sheetHint}>받은 경보 문자를 찍은 사진을 올리면 사진 속 문자를 읽어 공식 경보와 대조해요.</p>
        <button type="button" className={styles.sheetOption} onClick={openCamera}>
          <CameraIcon width={20} height={20} /> 카메라로 촬영
        </button>
        <button type="button" className={styles.sheetOption} onClick={() => albumInput.current?.click()}>
          <PlusIcon width={20} height={20} /> 앨범에서 선택
        </button>
        <button type="button" className={`${styles.sheetOption} ${styles.sheetCancel}`} onClick={() => setPhotoSheet(false)}>
          취소
        </button>
      </BottomSheet>
      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(file) => {
          setCameraOpen(false)
          attachFile(file)
        }}
        onUnavailable={cameraUnavailable}
      />
      <input ref={cameraInput} type="file" accept="image/png,image/jpeg,image/webp" capture="environment" hidden onChange={pickPhoto} />
      <input ref={albumInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pickPhoto} />
    </>
  )
}
