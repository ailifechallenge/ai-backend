import UrgencyCard from './UrgencyCard'
import {Link} from 'react-router-dom'
import {ArrowRight,MapPin,MessageCircle,CalendarDays} from 'lucide-react'
import {alertName,ResponseBadge} from '../../components/AlertIdentity'
import type {Translation,Guidance,Verification,UrgencyAssessment} from '../types'
import {useWorkspace} from '../hooks/workspace'
import AlertApplicability from './AlertApplicability'
function AdviceText({text}:{text:string}){const lines=text.split(/\n+|(?<=[.!?。])\s+/u).map(s=>s.trim()).filter(Boolean);return <><p>{lines[0]}</p>{lines.length>1&&<details className="extra-advice"><summary>추가 행동 {lines.length-1}개 보기</summary>{lines.slice(1).map((line,i)=><p key={i}>{line}</p>)}</details>}</>}
export default function MessageOverview({translation,guidance,verification,busy,urgency,aiPending=false}:{aiPending?:boolean;translation:Translation|null;guidance:Guidance|null;verification:Verification|null;busy:boolean;urgency?:UrgencyAssessment|null}){
 const ws=useWorkspace(),assessment=urgency??ws.urgency,issues=verification?.issues.filter(i=>i.severity==='critical')||[],cards=guidance?.cards||[]
 return <section className="message-overview" aria-label="문자 핵심 결과">
 <div className="overview-meta">{ws.demo?'가상 예시 · 실제 경보가 아니에요':ws.alert?'선택한 공식 경보 한 건':'직접 입력한 문자 · 발령 여부 미확인'}</div>
 <h1>경보와 필요한 행동</h1>
 <article className="focus-card"><span className="focus-step">01 · 상황</span><div className="situation-heading"><h2>{ws.alert?alertName(ws.alert.event):'받은 문자 내용'}</h2><ResponseBadge assessment={assessment} pending={aiPending}/></div>{translation?<><p className="focus-hazard">{translation.hazard_explanation||'원문의 핵심 내용이에요'}</p><details className="situation-facts"><summary>시간·지역 등 핵심 정보</summary><ul>{translation.summary.slice(0,3).map((line,i)=><li key={i}>{line}</li>)}</ul></details></>:<p>{busy?'한국어로 내용을 정리하고 있어요. 아래 행동지침을 먼저 확인하세요.':'한국어 상세 내용을 아직 확인하지 못했어요. 아래 지침과 공식 원문을 확인하세요.'}</p>}
 {(issues.length>0||!verification||verification.status==='검증 불가')&&<p className="small-note">{issues.length?`번역에서 확인할 내용 ${issues.length}건이 있어요.`:!verification?(busy?'원문과 대조 중이에요.':'원문 대조를 완료하지 못했어요.'):'일부 내용을 원문과 대조하지 못했어요.'}</p>}
 {!!issues.length&&<div className="overview-issues" role="alert">{issues.slice(0,2).map((issue,i)=><p key={i}>{issue.reason.split(/(?<=[.!?。])\s+/u)[0]}</p>)}</div>}
 {assessment&&<UrgencyCard assessment={assessment} aiPending={aiPending} embedded/>}</article><AlertApplicability/>
 <article className="focus-card action-focus"><span className="focus-step">03 · 행동</span><h2>지금 무엇을 해야 하나요?</h2>
 {cards.length?cards.slice(0,2).map((c,i)=>{const text=c.category==='official'?translation?.instruction_translation_ko:c.text;return <div className="action-row" key={i}><span className="action-dot">{i+1}</span><div><strong>{c.category==='official'?'경보 원문의 공식 지시':'일반 행동요령 · 공식 개별 지시 아님'}</strong>{text?<AdviceText text={text}/>:<><p>한국어 지시를 확인하지 못했어요.</p><details><summary>공식 원문 확인</summary><p>{c.text}</p></details></>}<details className="action-source"><summary>근거 · 적용 조건</summary><p>{c.condition}</p><a href={c.url} target="_blank" rel="noreferrer">{c.agency} 공식 자료 ↗</a></details></div></div>}):<p>{busy?'행동지침을 확인하고 있어요…':'행동지침을 확인하지 못했어요. 현지 당국의 공식 원문과 최신 지시를 확인하세요.'}</p>}
 <p className="small-note">대피·실내 대기 등 행동은 재난마다 달라요. 현지 당국의 최신 지시를 우선하세요.</p></article>
 <div className="next-choices"><Link to="/itinerary"><CalendarDays/><div><strong>내 일정과 비교</strong><span>{ws.stay?ws.stay.name:'저장한 숙소·방문 시간과 대조'}</span></div><ArrowRight/></Link><Link to="/chat"><MessageCircle/><div><strong>이 경보에 질문</strong><span>지금 본 원문을 이어서 사용해요</span></div><ArrowRight/></Link><Link to={`/shelters?country=${ws.place?.country||(ws.messageCountry==='JP'||ws.alert?.id.startsWith('jma:')?'JP':'US')}`}><MapPin/><div><strong>이동이 필요하다면 시설 확인</strong><span>개방·재난 적합성은 따로 확인해야 해요</span></div><ArrowRight/></Link></div>
 </section>
}
