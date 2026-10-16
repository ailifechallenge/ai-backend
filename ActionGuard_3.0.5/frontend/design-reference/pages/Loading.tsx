import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldLogo } from '@/components/Icons'
import { isOnboarded } from '@/lib/onboarding'
import styles from './Loading.module.css'

const DURATION_MS = 2000
const FADE_MS = 300

/** 로딩 → 2초 후 온보딩 1로 페이드 이동. 온보딩을 마친 사용자는 홈으로 (/?intro 로 온보딩 다시 보기) */
export default function Loading() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const showIntro = new URLSearchParams(search).has('intro') || !isOnboarded()
    const fade = setTimeout(() => setLeaving(true), DURATION_MS - FADE_MS)
    const go = setTimeout(() => navigate({ pathname: showIntro ? '/onboarding' : '/home', search }, { replace: true }), DURATION_MS)
    return () => {
      clearTimeout(fade)
      clearTimeout(go)
    }
  }, [navigate, search])

  return (
    <div className={`${styles.page} ${leaving ? styles.leaving : ''}`} aria-label="로딩">
      <div className={styles.brand}>
        <ShieldLogo width={72} height={72} className={styles.logo} />
        <h1 className={styles.name}>ActionGuard</h1>
        <p className={styles.tagline}>미국 재난 경보, 한국어로 정확하게</p>
      </div>

      <div className={styles.progressArea} role="status">
        <div className={styles.track} aria-hidden>
          <div className={styles.fill} />
        </div>
        <p className={styles.loadingText}>경보 정보를 불러오는 중이에요</p>
      </div>
    </div>
  )
}
