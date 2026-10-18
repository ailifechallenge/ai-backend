import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TabBar } from './TabBar'
import styles from './AppShell.module.css'

const TAB_ROUTES = ['/home', '/schedule', '/chat', '/prepare']
/** 로딩·온보딩: 탭바·하단 여백 없는 전체 화면 */
const BARE_ROUTES = ['/', '/onboarding']

/** 공통 레이아웃: 콘텐츠 + 탭 화면에서만 하단 고정 탭바 */
export function AppShell() {
  const { pathname } = useLocation()
  const showTabs = TAB_ROUTES.includes(pathname)
  const bare = BARE_ROUTES.includes(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <main className={[styles.main, showTabs && styles.withTabs, bare && styles.bare].filter(Boolean).join(' ')}>
        <Outlet />
      </main>
      {showTabs && <TabBar />}
    </>
  )
}
