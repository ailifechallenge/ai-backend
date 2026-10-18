import { useState, type FormEvent } from 'react'
import { SCHEDULE_KIND_LABELS } from '@/lib/labels'
import { localInputToUtc } from '@/lib/time'
import type { ScheduleItem, ScheduleKind } from '@/types'
import { Button } from './Button'
import styles from './ScheduleForm.module.css'

type Draft = Omit<ScheduleItem, 'id' | 'areaCode'>

interface Props {
  defaultStartLocal: string
  onSubmit: (draft: Draft) => void
}

const KINDS: ScheduleKind[] = ['stay', 'move', 'visit']

export function ScheduleForm({ defaultStartLocal, onSubmit }: Props) {
  const [kind, setKind] = useState<ScheduleKind>('visit')
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [start, setStart] = useState(defaultStartLocal)
  const [end, setEnd] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !start) {
      setError('제목과 시작 일시를 입력해 주세요.')
      return
    }
    if (end && end <= start) {
      setError('종료 일시는 시작 일시보다 늦어야 해요.')
      return
    }
    onSubmit({
      kind,
      title: title.trim(),
      address: address.trim() || undefined,
      startUtc: localInputToUtc(start),
      endUtc: end ? localInputToUtc(end) : undefined,
    })
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>종류</legend>
        <div className={styles.segment}>
          {KINDS.map((k) => (
            <label key={k} className={`${styles.segItem} ${kind === k ? styles.segActive : ''}`}>
              <input
                type="radio"
                name="kind"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
                className="visually-hidden"
              />
              {SCHEDULE_KIND_LABELS[k]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.field}>
        <span className={styles.label}>제목</span>
        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 저녁 식사" />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>주소</span>
        <input
          className={styles.input}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="예: 1001 Avenida De Las Americas, Houston, TX"
        />
        <span className={styles.hint}>
          임시 위치 찾기: Houston·Galveston이 들어간 주소만 위치를 찾아요(도시 중심 좌표). 그 외 주소는 위치를 찾지 못해 판정 불가일 수 있어요.
        </span>
      </label>

      <div className={styles.dates}>
        <label className={styles.field}>
          <span className={styles.label}>시작 (현지)</span>
          <input type="datetime-local" className={styles.input} value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>종료 (현지, 선택)</span>
          <input type="datetime-local" className={styles.input} value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Button type="submit" block>
        저장
      </Button>
      <p className={styles.hint}>일정은 이 기기(localStorage)에만 저장돼요.</p>
    </form>
  )
}
