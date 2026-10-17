import {officialLevel} from '../../components/official-level';
import {useId} from 'react';
import {ResponseBadge} from '../../components/AlertIdentity';
import {Link} from 'react-router-dom';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { UrgencyAssessment } from '../types';
import './UrgencyCard.css';

export default function UrgencyCard({assessment: a, aiPending=false,embedded=false,evidenceOnly=false,event,country='US'}: {evidenceOnly?:boolean;event?:string;country?:'US'|'JP';assessment: UrgencyAssessment; aiPending?:boolean;embedded?:boolean}) {
  const headingId=useId();
  const current = a.inactive ? null : a.level;
  const primaryIndex = a.action_kind === 'higher_ground' && a.actions.length > 1 ? 1 : 0;
  const origin = {official: '공식 원문 연결', input: '입력문 해석 · 발령 미확인', example: '가상 예시 · 실제 경보 아님'}[a.provenance];
  const evidence = <div>
        <p>{a.notice}</p><Link className="design-text-link" to="/response-guide">대응 단계 안내 보기 →</Link>
        <p>{a.applicability}</p>
        {current && <><p>{a.meaning}</p><ul>{a.actions.filter((_,i)=>i!==primaryIndex).map(item=><li key={item}>{item}</li>)}</ul></>}
        {a.evidence.map((e,i)=><div key={i}><blockquote>{e.quote}</blockquote><p>{e.explanation}</p></div>)}
        {!a.evidence.length && <p>단계를 정할 충분한 원문 근거를 확인하지 못했습니다.</p>}
        <p>표시된 공식 경보 유형·레벨은 발표 기관의 명칭에 따릅니다. AI는 원문에 근거한 행동 설명을 보조하며 공식 등급을 변경하지 않습니다. 경보 명칭만으로 현재 위치의 대피 여부를 확정하지 않습니다.</p>
        {a.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink size={13} aria-hidden="true" /></a>)}
      </div>;
  if(evidenceOnly)return <details className="response-evidence disclosure-row"><summary className="disclosure-summary"><span>AI 판단 근거 · 공식 등급 안내</span><ChevronDown size={18} aria-hidden="true"/></summary><div className="disclosure-body"><p className="urgency-origin">{origin}</p><p className="urgency-method" role="status">{aiPending?'AI 원문 해석 중 · 기본 판정을 먼저 보여드려요':a.method_note??'원문 표현을 기준으로 판단했어요.'}</p>{evidence}</div></details>;
  return <article className={`${embedded?'urgency-inline':'urgency-card'} urgency-${current ?? 'unknown'}`}  aria-labelledby={headingId}>
    {!embedded&&<div className="urgency-single-header"><strong>대응 행동 <small>원문 해석</small></strong><ResponseBadge event={event} country={country} assessment={a}/></div>}
    <p className="urgency-origin">{origin}</p>
    {event&&<p className="official-action">{officialLevel(event,country).action}</p>}
    <h2 id={headingId}>{!current && aiPending?'AI가 원문에서 대응 행동을 확인하고 있어요':a.headline}</h2>
    {current && a.actions[primaryIndex] ? <p className="urgency-primary-action">{a.actions[primaryIndex]}</p> : !aiPending && <p className="urgency-primary-action">{a.meaning}</p>}
    <p className="urgency-method" role="status">{aiPending?'AI 원문 해석 중 · 기본 판정을 먼저 보여드려요':a.method_note??'원문 표현을 기준으로 판단했어요.'}</p>
    <details className="urgency-details">
      <summary>판단 근거와 척도 안내 <ChevronDown size={15} aria-hidden="true" /></summary>
      {evidence}
    </details>
  </article>;
}
