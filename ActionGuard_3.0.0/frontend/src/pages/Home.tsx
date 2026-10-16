import {Link} from 'react-router-dom'
import {Bell, Activity, Waves, MapPin, ChevronRight, MessageSquareText} from 'lucide-react'
import {Card, PageBody, Note} from '../components/Card'
import {ButtonLink, ButtonRow} from '../components/Button'
import {PageHeader} from '../components/PageHeader'
import {StatusBadge} from '../components/StatusBadge'
import {useWorkspace} from '../integrated/hooks/workspace'
import JourneyPlace from '../integrated/components/JourneyPlace'
import styles from './Home.module.css'
import alertStyles from '../components/AlertCard.module.css'
import contacts from '../components/EmergencyContacts.module.css'

export default function Home({ocrAvailable}:{ocrAvailable?:boolean}){
 const ws=useWorkspace(); const a=ws.alert;const country=ws.place?.country??(ws.messageCountry==='JP'?'JP':'US')
 return <><PageHeader title="ActionGuard" right={<Link to="/notifications" aria-label="알림 설정"><Bell size={22}/></Link>}/><PageBody className={styles.body}>
 <details className="team-location"><summary className={styles.locationBox}><MapPin className={styles.locationIcon}/><span className={styles.locationText}>{ws.place?ws.place.name:'조회 위치를 선택해 주세요'}<small className={styles.checked}>{ws.place?(country==='JP'?'일본':'미국'):'미국 · 일본의 지역 정보를 확인해요'}</small></span><ChevronRight size={18}/></summary><div className="integrated-feature app"><JourneyPlace/></div></details>
 <Card as="article"><div className={alertStyles.top}><h2 className={alertStyles.nameKo}>{ws.translation?'지금 확인할 경보예요':'받은 재난문자를 확인해요'}</h2><StatusBadge label={ws.demo?'시연용 예시':a?'공식 경보':'원문 입력'} tone={ws.demo?'neutral':a?'caution':'info'}/></div>{a&&<><p className={alertStyles.nameEn}>{a.event}</p><p className={alertStyles.meta}>{a.area}</p></>}<p className="team-home-intro">{ws.translation?.hazard_explanation||'영어·일본어 원문을 넣으면 한국어 번역과 필요한 행동을 확인할 수 있어요.'}</p><div className={alertStyles.actions}><ButtonRow><ButtonLink to="/analyze">{ws.translation?'번역·검증 보기':'문자 해석하기'}</ButtonLink><ButtonLink variant="secondary" to="/analyze?mode=alerts">공식 경보 찾기</ButtonLink></ButtonRow>{ws.text&&<ButtonLink variant="ghost" to="/analyze">받은 문자 · 공식 원문 확인</ButtonLink>}</div><Note>{ocrAvailable?'원문 입력과 사진 인식을 지원해요.':'사진 인식이 준비되지 않았다면 원문을 붙여넣어 주세요.'}</Note></Card>
 {ws.translation?.instruction_translation_ko&&<Card title="이 경보에서 해야 할 행동" aside={<Link to="/analyze">전체 보기</Link>}><p className="team-instruction">{ws.translation.instruction_translation_ko}</p><Note>현지 당국의 최신 공식 지시를 먼저 따르세요.</Note></Card>}
 <div className="home-shortcuts" aria-label="자주 쓰는 기능"><Link to="/chat"><MessageSquareText size={22}/><strong>AI 도우미</strong><small>문자·지역·앱 사용 질문</small></Link><Link to={`/shelters?country=${country}`}><MapPin size={22}/><strong>대피 지도 보기</strong><small>주변 시설 · 길찾기</small></Link></div>
 <Card title="내 일정과의 겹침" aside={<Link className={styles.more} to="/itinerary">일정 확인</Link>}><p className={styles.empty}>{ws.stay?.name||'숙소 · 방문 장소를 등록해 주세요'}</p><Note>{a?'선택한 경보의 지역·유효시간과 비교해요.':'공식 경보를 연결하면 지역·시간을 비교할 수 있어요.'}</Note></Card>
 <Card title="일본 지진 · 쓰나미"><div className="team-feature-links"><Link to="/japan-disasters?tab=earthquake"><Activity size={19}/>진앙 · 관측 진도 지도<ChevronRight size={16}/></Link><Link to="/japan-disasters?tab=tsunami"><Waves size={19}/>해안별 쓰나미 경보<ChevronRight size={16}/></Link></div></Card>
 <details className="home-more"><summary>알림 설정 · 앱 사용 안내</summary><Card><div className="team-feature-links"><Link to="/notifications">관심 지역 · 알림 설정<ChevronRight size={16}/></Link><Link to="/welcome">앱 사용 안내 다시 보기<ChevronRight size={16}/></Link></div></Card></details>
 <section className={contacts.section} aria-label="긴급 연락"><h2 className="team-section-title">긴급 연락</h2><div className={contacts.calls}><a className={contacts.call} href="tel:+82232100404"><span className={contacts.text}><span className={contacts.label}>영사안전콜센터 · 24시간</span><strong className={contacts.number}>+82-2-3210-0404</strong></span></a><a className={`${contacts.call} ${contacts.local}`} href={country==='JP'?'tel:119':'tel:911'}><span className={contacts.text}><span className={contacts.label}>{country==='JP'?'일본 구급 · 소방':'미국 현지 응급'}</span><strong className={contacts.number}>{country==='JP'?'119':'911'}</strong></span></a></div></section>
 </PageBody></>
}
