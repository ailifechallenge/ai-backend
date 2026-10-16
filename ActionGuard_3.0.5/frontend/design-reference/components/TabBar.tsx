import { NavLink } from 'react-router-dom'
import { BackpackIcon, CalendarIcon, ChatIcon, HomeIcon } from './Icons'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/home', label: '홈', Icon: HomeIcon },
  { to: '/schedule', label: '일정', Icon: CalendarIcon },
  { to: '/chat', label: '챗봇', Icon: ChatIcon },
  { to: '/prepare', label: '대비', Icon: BackpackIcon },
]

export function TabBar() {
  return (
    <nav className={styles.bar} aria-label="하단 메뉴">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
