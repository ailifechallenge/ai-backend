import {useEffect,useRef} from 'react'
import {MapPin,ChevronRight} from 'lucide-react'
import {useWorkspace} from '../integrated/hooks/workspace'
import {placeDisplay,placeCountry} from '../integrated/hooks/place-region'
import JourneyPlace from '../integrated/components/JourneyPlace'
import styles from '../pages/Home.module.css'

export default function SharedLocationCard(){
 const ws=useWorkspace(),ref=useRef<HTMLDetailsElement>(null)
 useEffect(()=>{if(ref.current)ref.current.open=false},[ws.place])
 return <details ref={ref} className="team-location shared-location-card"><summary className={styles.locationBox}><MapPin className={styles.locationIcon}/><span className={styles.locationText}>{ws.place?placeDisplay(ws.place):'머무는 곳을 등록하십시오'}<small className={styles.checked}>{ws.place?placeCountry(ws.place)+(ws.place.approximate?' · 대표점 기준':' · 기기에 저장됨'):`${ws.country==='JP'?'일본':'미국'}의 도시·숙소를 등록합니다`}</small></span><ChevronRight size={18}/></summary><div className="integrated-feature app"><JourneyPlace/></div></details>
}
