import {Link} from 'react-router-dom';
import {ArrowRight,MapPin,MessageCircle,CalendarDays} from 'lucide-react';
import type {Translation,Guidance,Verification} from '../types';
import {useWorkspace} from '../hooks/workspace';
function AdviceText({text}:{text:string}){const lines=text.split('\n').map(s=>s.trim()).filter(Boolean);return <><p>{lines[0]}</p>{lines.length>1&&<details className="extra-advice"><summary>추가 행동 {lines.length-1}개 보기</summary>{lines.slice(1).map((line,i)=><p key={i}>{line}</p>)}</details>}</>;}
export default function MessageOverview({translation,guidance,verification,busy}:{translation:Translation|null;guidance:Guidance|null;verification:Verification|null;busy:boolean}){
 const ws=useWorkspace();const issues=verification?.issues.filter(i=>i.severity==='critical')||[];
 const cards=guidance?.cards||[];
 return <section className="message-overview" aria-label="문자 핵심 결과">
 <div className="overview-meta">{ws.demo?'가상 예시 · 실제 경보가 아니에요':ws.alert?'공식 경보에서 가져왔어요':'직접 입력한 문자 · 발령 여부 미확인'}</div>
 <h1>{translation?'이 문자, 이렇게 이해하세요':'먼저 행동지침을 확인하세요'}</h1>
 {translation&&<article className="focus-card"><h2>{translation.hazard_explanation||'원문의 핵심 내용이에요'}</h2><ul>{translation.summary.slice(0,3).map((s,i)=><li key={i}>{s}</li>)}</ul><div className={'review-line '+(issues.length?'review-warning':'')}>{issues.length?`번역에서 확인할 내용 ${issues.length}건이 있어요. 아래 상세 결과를 확인하세요.`:!verification?(busy?'원문과 대조 중이에요.':'원문 대조를 완료하지 못했어요.'):verification.status==='검증 불가'?'일부 내용을 원문과 대조하지 못했어요. 상세에서 확인해 주세요.':'원문 대조 결과는 상세에서 확인할 수 있어요.'}</div></article>}
 {!!issues.length&&<article className="focus-card overview-issues" role="alert"><h2>이 부분은 원문을 확인하세요</h2>{issues.slice(0,2).map((issue,i)=><p key={i}>{issue.reason.split(/(?<=[.!?。])\s+/u)[0]}</p>)}</article>}
 {!!cards.length&&<article className="focus-card action-focus"><div className="card-heading"><h2>어떻게 행동해야 할까요?</h2><span>원문·안전수칙 근거</span></div>{cards.slice(0,2).map((c,i)=>{const text=c.category==='official'?translation?.instruction_translation_ko:c.text;return <div className="action-row" key={i}><span className="action-dot">{i+1}</span><div><strong>{c.category==='official'?'경보의 공식 지시':c.title}</strong>{text?<AdviceText text={text}/>:<p>한국어 번역을 준비하지 못했어요. 상세에서 공식 원문을 확인하세요.</p>}<a href={c.url} target="_blank" rel="noreferrer">{c.agency} 근거 보기</a></div></div>})}<p className="small-note">현지 당국의 최신 지시가 우선이에요.</p></article>}
 <div className="next-choices"><Link to="/itinerary"><CalendarDays/><div><strong>내 일정과 겹칠까요?</strong><span>{ws.stay?ws.stay.name:'숙소·방문 시간을 비교해요'}</span></div><ArrowRight/></Link><Link to="/chat"><MessageCircle/><div><strong>이 문자에 대해 물어보기</strong><span>지금 확인한 내용으로 이어서 질문해요</span></div><ArrowRight/></Link><Link to={`/shelters?country=${ws.place?.country|| (ws.messageCountry==='JP'||ws.alert?.id.startsWith('jma:')?'JP':'US')}`}><MapPin/><div><strong>주변 대피시설 확인</strong><span>이동이 필요할 때 장소와 경로를 확인해요</span></div><ArrowRight/></Link></div>
 </section>;
}
