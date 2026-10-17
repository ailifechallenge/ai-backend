import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { StatusBadge } from '../components/StatusBadge'
const OVERLAP_LABELS = {confirmed:{label:'겹침 확인',tone:'info' as const},unconfirmed:{label:'겹침 미확인',tone:'neutral' as const}}
import styles from './Onboarding.module.css'

const SWIPE_THRESHOLD = 50

interface Slide {
  frame: string
  title: string
  desc: string
  note?: string
  preview: ReactNode
}

const confirmed = OVERLAP_LABELS.confirmed
const unconfirmed = OVERLAP_LABELS.unconfirmed

const SLIDES: Slide[] = [
  {
    frame: '온보딩 1',
    title: '번역을 한 번 더 검증해요',
    desc: '시각·장소·금지사항이 바뀌거나 빠지지 않았는지 원문과 대조해 알려드려요.',
    preview: (
      <div className={styles.mini}>
        <div className={styles.miniHead}>
          <span className={styles.miniLabel}>원문</span>
          <span className={styles.cautionBadge}>불일치 1건 탐지</span>
        </div>
        <p className={styles.miniEn} lang="en">
          Flash Flood Warning until 6:30 PM CDT
        </p>
        <span className={styles.miniLabel}>번역</span>
        <p className={styles.miniKo}>
          돌발홍수 경보 <mark className={styles.missing}>18:30까지 누락</mark>
        </p>
      </div>
    ),
  },
  {
    frame: '온보딩 2',
    title: '내 일정과 겹치는지 확인해요',
    desc: '경보 지역·시간과 숙소·이동·방문지를 비교하고, 선택한 경보와 내 일정이 겹치는지 확인해요.',
    preview: (
      <div className={styles.mini}>
        <div className={`${styles.miniRow} ${styles.rowConfirmed}`}>
          <span className={styles.miniTitle}>시내 호텔 · 숙박</span>
          <StatusBadge label={confirmed.label} tone={confirmed.tone} />
        </div>
        <div className={styles.miniRow}>
          <span className={styles.miniTitle}>공항 이동</span>
          <StatusBadge label={unconfirmed.label} tone={unconfirmed.tone} />
        </div>
        <p className={styles.miniMeta}>14:18 경보 변경 · Watch → Warning</p>
      </div>
    ),
  },
  {
    frame: '온보딩 3',
    title: '근거가 있는 답만 드려요',
    desc: '조회·분석한 자료의 출처와 확인 시각을 함께 확인해요. 이 앱은 공식 재난문자를 대체하지 않아요.',
    note: '현재 지원: 미국 · 일본',
    preview: (
      <div className={styles.mini}>
        <p className={styles.userBubble}>내일 아침 공항 이동은 괜찮아?</p>
        <div className={styles.botCard}>
          <StatusBadge label={unconfirmed.label} tone={unconfirmed.tone} />
          <p className={styles.botText}>현재 확인된 경보 기준으로는 겹치는 부분이 없어요. 안전하다는 뜻은 아니에요.</p>
          <p className={styles.botMeta}>출처 NWS · 최신 확인 14:18</p>
        </div>
      </div>
    ),
  },
]

export default function Welcome({onStart}:{onStart:()=>void}) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const last = SLIDES.length - 1

  const finish = () => {
    onStart()
  }
  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)))

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (dx <= -SWIPE_THRESHOLD) go(index + 1)
    else if (dx >= SWIPE_THRESHOLD) go(index - 1)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <button type="button" className={styles.skip} onClick={finish}>
          건너뛰기
        </button>
      </div>

      <div
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="앱 소개"
      >
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {SLIDES.map((s, i) => (
            <section
              key={s.frame}
              className={styles.slide}
              aria-roledescription="slide"
              aria-label={`${s.frame} (${i + 1}/${SLIDES.length})`}
              aria-hidden={i !== index}
            >
              <div className={styles.previewCard}>
                <span className={styles.demoLabel}>시연용 예시</span>
                {s.preview}
              </div>
              <h1 className={styles.title}>{s.title}</h1>
              <p className={styles.desc}>{s.desc}</p>
              {s.note && <p className={styles.note}>{s.note}</p>}
            </section>
          ))}
        </div>
      </div>

      <div className={styles.spacer} aria-hidden />
      <div className={styles.bottom}>
        <div className={styles.dots} aria-label={`${index + 1} / ${SLIDES.length} 페이지`} role="img">
          {SLIDES.map((s, i) => (
            <span key={s.frame} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>
        <Button block className={styles.cta} onClick={() => (index === last ? finish() : go(index + 1))}>
          {index === last ? '시작하기' : '다음'}
        </Button>
      </div>
    </div>
  )
}
