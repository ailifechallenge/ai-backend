import {BrandMark} from '../components/BrandMark'
import {CategoryExplanation} from '../components/CategoryExplanation'
import {useEffect} from 'react'
import {usePlaceRegion} from '../integrated/hooks/place-region'
import {useAlertAssessment} from '../integrated/hooks/alert-assessment'
import {AlertRegion,InstructionPreview} from '../components/ReadableAlert'
import {alertName,ResponseBadge} from '../components/AlertIdentity'
import NearbyAlertCard from '../components/NearbyAlertCard'
import {Link} from 'react-router-dom'
import {Activity, Waves, Mountain, MapPin, ChevronRight, MessageSquareText} from 'lucide-react'
import {Card, PageBody, Note} from '../components/Card'
import {ButtonLink} from '../components/Button'
import {HeaderActions} from '../components/CountrySwitch'
import {PageHeader} from '../components/PageHeader'
import {StatusBadge} from '../components/StatusBadge'
import {useWorkspace} from '../integrated/hooks/workspace'
import SharedLocationCard from '../components/SharedLocationCard'
import styles from './Home.module.css'
import alertStyles from '../components/AlertCard.module.css'
import contacts from '../components/EmergencyContacts.module.css'
export default function Home(_props:{ocrAvailable?:boolean}){
 usePlaceRegion();const ws=useWorkspace(),a=ws.alert,assessment=useAlertAssessment(a,ws.urgency?.method!=='ai'),country=ws.country
 const currentAssessment=ws.urgency?.method==='ai'?ws.urgency:assessment.data??ws.urgency;
 useEffect(()=>{if(a&&assessment.data&&ws.urgency?.method!=='ai'&&ws.urgency!==assessment.data)ws.setUrgency(assessment.data,ws.revision)},[a?.id,a?.text,assessment.data,ws.urgency]);
 return <><PageHeader title={<span className="home-brand"><BrandMark/><span>ActionGuard</span></span>} right={<HeaderActions/>}/><PageBody className={styles.body}>
 <SharedLocationCard/>
 <Card as="article" className={styles.hero}><div className={alertStyles.top}><div><h2 className={alertStyles.nameKo}>{a?alertName(a.event):ws.translation?'받은 문자 해석':'받은 경보를 한국어로'}</h2>{a&&<p className={alertStyles.nameEn}>{a.event}</p>}</div><div className="alert-badges">{(a||ws.demo)&&<StatusBadge label={ws.demo?'시연용 예시':a?'공식 경보':'원문 입력'} tone={ws.demo?'neutral':a?'caution':'info'}/>}{ws.text&&<ResponseBadge event={a?.event} country={a?.id.startsWith('jma:')?'JP':'US'} assessment={currentAssessment} pending={assessment.isFetching&&ws.urgency?.method!=='ai'}/>}</div></div>{a&&ws.place&&(a.id.startsWith('jma:')?'JP':'US')!==ws.place.country&&<p className="home-country-note">지금 연 경보는 {a.id.startsWith('jma:')?'일본':'미국'} 경보입니다. 등록 위치 {ws.place.name}의 경보와 구분해 확인하십시오.</p>}<p className={`team-home-intro ${a?'selected-alert-summary':''}`}>{ws.translation?.hazard_explanation||`${country==='JP'?'일본어':'영어'} 원문을 넣으면 핵심 내용과 필요한 행동을 정리합니다.`}</p>{a&&<AlertRegion area={a.area} collapsed/>}<CategoryExplanation compact source={ws.text} translation={ws.translation?.hazard_explanation??''}/><div className={alertStyles.actions}><div className={styles.heroActions}><ButtonLink block to="/analyze">{ws.translation?'번역·검증 보기':'문자 해석하기'}</ButtonLink><Link className={styles.secondaryAction} to="/analyze?mode=alerts">공식 경보 찾기<ChevronRight size={16}/></Link></div></div>{ws.text&&<div className="assessment-feedback">{currentAssessment?.method&&<p className="assessment-note">{currentAssessment.method==='ai'?'AI가 경보 원문과 행동 지시를 근거로 판단했습니다.':currentAssessment.method==='rules_fallback'?currentAssessment.method_note:'원문 기준의 기본 판정입니다.'}</p>}{a&&currentAssessment?.method!=='ai'&&(assessment.isError||currentAssessment?.method==='rules_fallback')&&<button className="assessment-retry" disabled={assessment.isFetching} onClick={()=>void assessment.refetch()}>AI 다시 확인</button>}</div>}</Card>
 {ws.translation?.instruction_translation_ko&&<Card title="공식 행동지침" aside={<Link to="/analyze">전체 보기</Link>}><InstructionPreview text={ws.translation.instruction_translation_ko}/><Note>현지 당국의 최신 공식 지시를 먼저 따르십시오.</Note></Card>}
 {ws.text&&<details className="nearby-home"><summary>등록 위치의 최신 공식 기상 경보 확인</summary><NearbyAlertCard/></details>}
 {!ws.text&&<NearbyAlertCard/>}
 <nav className={styles.quickLinks} aria-label="자주 쓰는 기능">
 <Link to={`/shelters?country=${country}`}><MapPin size={20}/><span><strong>주변 대피시설</strong><small>시설 정보와 길찾기</small></span><ChevronRight size={16}/></Link>
 <Link to="/chat"><MessageSquareText size={20}/><span><strong>AI에게 질문</strong><small>경보 내용과 필요한 행동을 물어보십시오</small></span><ChevronRight size={16}/></Link>
 </nav>
 {country==='JP'&&<Card title="일본 지진 · 쓰나미 · 화산"><div className="team-feature-links"><Link to="/japan-disasters?tab=earthquake"><Activity size={19}/>진앙 · 관측 진도 지도<ChevronRight size={16}/></Link><Link to="/japan-disasters?tab=tsunami"><Waves size={19}/>해안별 쓰나미 경보<ChevronRight size={16}/></Link><Link to="/japan-volcano"><Mountain size={19}/>화산 분화 경보 · 규제 지역<ChevronRight size={16}/></Link></div></Card>}
 <details className="home-more"><summary>알림 설정 · 앱 사용 안내</summary><Card><div className="team-feature-links"><Link to="/notifications">관심 지역 · 알림 설정<ChevronRight size={16}/></Link><Link to="/welcome">앱 사용 안내 다시 보기<ChevronRight size={16}/></Link></div></Card></details>
 <section className={contacts.section} aria-label="긴급 연락"><h2 className="team-section-title">긴급 연락</h2><div className={contacts.calls}><a className={contacts.call} href="tel:+82232100404"><span className={contacts.text}><span className={contacts.label}>영사안전콜센터 · 24시간</span><strong className={contacts.number}>+82-2-3210-0404</strong></span></a><a className={`${contacts.call} ${contacts.local}`} href={country==='JP'?'tel:119':'tel:911'}><span className={contacts.text}><span className={contacts.label}>{country==='JP'?'일본 구급 · 소방':'미국 현지 응급'}</span><strong className={contacts.number}>{country==='JP'?'119':'911'}</strong></span></a></div></section>
 </PageBody></>
}
