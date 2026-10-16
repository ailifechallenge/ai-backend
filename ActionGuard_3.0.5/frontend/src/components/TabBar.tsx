import {MapPin} from 'lucide-react'
import {useWorkspace} from '../integrated/hooks/workspace'
import { NavLink } from 'react-router-dom'
import { BackpackIcon, CalendarIcon, ChatIcon, HomeIcon } from './Icons'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/', label: '홈', Icon: HomeIcon },
  { to: '/itinerary', label: '일정', Icon: CalendarIcon },
  { to: '/chat', label: '챗봇', Icon: ChatIcon },
  { to: '/shelters', label: '지도', Icon: MapPin },
  { to: '/prepare', label: '대비', Icon: BackpackIcon },
]

export function TabBar() {
  const {place}=useWorkspace()
  return (
    <nav className={styles.bar} aria-label="하단 메뉴">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink end={to==='/'} key={to} to={to==='/shelters'?`/shelters?country=${place?.country??'US'}`:to} className={({ isActive }) => `${styles.tab} ${to==='/chat'?styles.chat:''} ${isActive ? styles.active : ''}`}>
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
