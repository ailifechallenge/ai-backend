import styles from './SosCard.module.css'

export type SosKey = 'emergency' | 'interpreter' | 'address'

/** 고정 문장 상수 — 편집·AI 번역 기능 없음 */
export const SOS_PHRASES: Record<SosKey, { chip: string; en: string; ko: string }> = {
  emergency: {
    chip: '① 긴급 신고 요청',
    en: 'I need emergency help. Please call 911.',
    ko: '긴급 도움이 필요해요. 911에 신고해 주세요.',
  },
  interpreter: {
    chip: '② 통역 요청',
    en: 'I need a Korean interpreter, please.',
    ko: '한국어 통역사가 필요해요.',
  },
  address: {
    chip: '③ 현재 위치·숙소 주소',
    en: 'My hotel address is: [주소]',
    ko: '제 숙소 주소는 다음과 같아요.',
  },
}

export function SosCard({ phrase, address, label }: { phrase: SosKey; address: string; label?: string }) {
  const p = SOS_PHRASES[phrase]
  const en = phrase === 'address' ? p.en.replace('[주소]', address.trim() || '[사용자 입력]') : p.en
  return (
    <article className={styles.card} aria-label="현지인에게 보여 줄 SOS 카드">
      {label && <p className={styles.label}>{label}</p>}
      <p className={styles.en} lang="en">
        {en}
      </p>
      <p className={styles.ko}>{p.ko}</p>
    </article>
  )
}
