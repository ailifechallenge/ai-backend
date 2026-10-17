import UrgencyCard from './UrgencyCard'
import {Link} from 'react-router-dom'
import {ArrowRight,MapPin,MessageCircle,CalendarDays,ChevronDown} from 'lucide-react'
import {CategoryExplanation} from '../../components/CategoryExplanation'
import {alertName,ResponseBadge} from '../../components/AlertIdentity'
import type {Translation,Guidance,Verification,UrgencyAssessment} from '../types'
import {useWorkspace} from '../hooks/workspace'
import AlertApplicability from './AlertApplicability'
function AdviceText({text}:{text:string}){const lines=text.split(/\n+|(?<=[.!?。])\s+/u).map(s=>s.trim()).filter(Boolean);return <>{lines.slice(0,3).map((line,i)=><p key={i}>{line}</p>)}{lines.length>3&&<details className="extra-advice"><summary>추가 행동 {lines.length-3}개 보기</summary>{lines.slice(3).map((line,i)=><p key={i}>{line}</p>)}</details>}</>}

export default function MessageOverview({translation,guidance,verification,busy,urgency,aiPending=false}:{aiPending?:boolean;translation:Translation|null;guidance:Guidance|null;verification:Verification|null;busy:boolean;urgency?:UrgencyAssessment|null}){
 const ws=useWorkspace(),assessment=urgency??ws.urgency,issues=verification?.issues.filter(i=>i.severity==='critical')||[],cards=[...(guidance?.cards||[])].sort((a,b)=>Number(b.category==='official')-Number(a.category==='official'))
 return <section className="message-overview" aria-label="문자 핵심 결과">
 <div className="overview-meta">{ws.demo?'가상 예시 · 실제 경보가 아니에요':ws.alert?'선택한 공식 경보 한 건':'직접 입력한 문자 · 발령 여부 미확인'}</div>
 <h1>경보와 필요한 행동</h1>
 <article className="focus-card" aria-label="경보 상황"><span className="focus-step">01 · 상황</span><div className="situation-heading"><h2>{ws.alert?alertName(ws.alert.event):'받은 문자 내용'}</h2><ResponseBadge event={ws.alert?.event} country={ws.alert?.id.startsWith('jma:')?'JP':'US'} assessment={assessment} pending={aiPending}/></div>{translation?<><p className="focus-hazard">{translation.hazard_explanation||'원문의 핵심 내용이에요'}</p><section className="situation-facts" aria-label="시간·지역 등 핵심 정보"><h3>시간·지역 등 핵심 정보</h3>{translation.summary.length?<ul>{translation.summary.map((line,i)=><li key={i}>{line}</li>)}</ul>:<p>원문에서 시간·지역을 확인하지 못했어요. 공식 원문을 확인하세요.</p>}</section></>:<p>{busy?'한국어로 내용을 정리하고 있어요. 아래 행동지침을 먼저 확인하세요.':'한국어 상세 내용을 아직 확인하지 못했어요. 아래 지침과 공식 원문을 확인하세요.'}</p>}
 {(issues.length>0||!verification||verification.status==='검증 불가')&&<p className="small-note">{issues.length?`번역에서 확인할 내용 ${issues.length}건이 있어요.`:!verification?(busy?'원문과 대조 중이에요.':'원문 대조를 완료하지 못했어요.'):'일부 내용을 원문과 대조하지 못했어요.'}</p>}
 <CategoryExplanation source={ws.text} translation={translation?.hazard_explanation??''}/>
 {!!issues.length&&<div className="overview-issues" role="alert">{issues.slice(0,2).map((issue,i)=><p key={i}>{issue.reason.split(/(?<=[.!?。])\s+/u)[0]}</p>)}</div>}
 </article>
 <article className="focus-card action-focus" aria-label="지금 할 행동"><span className="focus-step">02 · 행동</span><h2>지금 이렇게 행동하세요</h2><p className="action-context">아래 지시는 이 경보의 대상 지역에 있는 경우를 기준으로 해요.</p>
 {cards.length?cards.slice(0,2).map((c,i)=>{const text=c.category==='official'?translation?.instruction_translation_ko:c.text;return <div className="action-row" key={i}><span className="action-dot">{i+1}</span><div><strong>{c.category==='official'?'경보 원문의 공식 지시':'일반 행동요령 · 공식 개별 지시 아님'}</strong>{text?<AdviceText text={text}/>:<><p>한국어 지시를 확인하지 못했어요.</p><details><summary>공식 원문 확인</summary><p>{c.text}</p></details></>}<details className="action-source"><summary><span>근거 · 적용 조건</span><ChevronDown size={16} aria-hidden="true"/></summary><p>{c.condition}</p><a href={c.url} target="_blank" rel="noreferrer">{c.agency} 공식 자료 ↗</a></details></div></div>}):translation?.instruction_translation_ko?<div className="action-row"><span className="action-dot">1</span><div><strong>경보 원문의 공식 지시</strong><AdviceText text={translation.instruction_translation_ko}/></div></div>:assessment?.actions.length&&!assessment.inactive?<div className="action-row"><span className="action-dot">1</span><div><strong>원문 기반 행동 해석</strong><AdviceText text={assessment.actions.join('\n')}/><p className="small-note" role="status">{aiPending?'AI 원문 해석 중 · 기본 판정을 먼저 보여드려요':assessment.method_note??'상세 행동지침을 확인하지 못해 원문 기반 판정을 보여드려요.'}</p></div></div>:<p>{busy?'행동지침을 확인하고 있어요…':'행동지침을 확인하지 못했어요. 현지 당국의 공식 원문과 최신 지시를 확인하세요.'}</p>}
 <p className="small-note">현지 당국의 최신 지시를 먼저 따르세요.</p></article>
 <AlertApplicability/>
 {assessment&&<UrgencyCard event={ws.alert?.event} country={ws.alert?.id.startsWith('jma:')?'JP':'US'} assessment={assessment} aiPending={aiPending} evidenceOnly/>}
 <div className="next-choices"><Link to="/itinerary"><CalendarDays/><div><strong>내 일정과 비교</strong><span>{ws.stay?ws.stay.name:'저장한 숙소·방문 시간과 대조'}</span></div><ArrowRight/></Link><Link to="/chat"><MessageCircle/><div><strong>이 경보에 질문</strong><span>지금 본 원문을 이어서 사용해요</span></div><ArrowRight/></Link><Link to={`/shelters?country=${ws.place?.country||(ws.messageCountry==='JP'||ws.alert?.id.startsWith('jma:')?'JP':'US')}`}><MapPin/><div><strong>이동이 필요하다면 시설 확인</strong><span>개방·재난 적합성은 따로 확인해야 해요</span></div><ArrowRight/></Link></div>
 </section>
}
