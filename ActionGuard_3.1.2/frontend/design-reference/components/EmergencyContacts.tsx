import { CONSULAR_CALL_CENTER, LOCAL_EMERGENCY, OFFICIAL_LINKS } from '@/config/contacts'
import { SectionTitle } from './Card'
import { ExternalIcon, PhoneIcon } from './Icons'
import styles from './EmergencyContacts.module.css'

/** 홈 스크롤 맨 마지막 섹션: 긴급 전화 + 공식 링크 */
export function EmergencyContacts() {
  return (
    <section className={styles.section} aria-labelledby="emergency-contacts-title">
      <div id="emergency-contacts-title">
        <SectionTitle>긴급 연락 · 공식 링크</SectionTitle>
      </div>

      <div className={styles.calls}>
        <a className={styles.call} href={`tel:${CONSULAR_CALL_CENTER.tel}`}>
          <span className={styles.text}>
            <span className={styles.label}>
              <PhoneIcon className={styles.icon} />
              {CONSULAR_CALL_CENTER.label}
            </span>
            <span className={styles.number}>{CONSULAR_CALL_CENTER.display}</span>
          </span>
        </a>
        <a className={`${styles.call} ${styles.local}`} href={`tel:${LOCAL_EMERGENCY.tel}`}>
          <span className={styles.text}>
            <span className={styles.label}>
              <PhoneIcon className={styles.icon} />
              {LOCAL_EMERGENCY.label}
            </span>
            <span className={styles.number}>{LOCAL_EMERGENCY.display}</span>
          </span>
        </a>
      </div>

      <div className={styles.links}>
        {OFFICIAL_LINKS.map((l) => (
          <a key={l.url} className={styles.link} href={l.url} target="_blank" rel="noopener noreferrer">
            <span className={styles.linkLabel}>{l.label}</span>
            <ExternalIcon className={styles.linkIcon} />
          </a>
        ))}
      </div>
    </section>
  )
}
