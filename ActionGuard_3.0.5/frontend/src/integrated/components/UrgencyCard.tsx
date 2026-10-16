import {useId} from 'react';
import {ResponseBadge} from '../../components/AlertIdentity';
import {Link} from 'react-router-dom';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { UrgencyAssessment } from '../types';
import './UrgencyCard.css';

export default function UrgencyCard({assessment: a, aiPending=false,embedded=false}: {assessment: UrgencyAssessment; aiPending?:boolean;embedded?:boolean}) {
  const headingId=useId();
  const current = a.inactive ? null : a.level;
  const primaryIndex = a.action_kind === 'higher_ground' && a.actions.length > 1 ? 1 : 0;
  const origin = {official: '공식 원문 연결', input: '입력문 해석 · 발령 미확인', example: '가상 예시 · 실제 경보 아님'}[a.provenance];
  return <article className={`${embedded?'urgency-inline':'urgency-card'} urgency-${current ?? 'unknown'}`}  aria-labelledby={headingId}>
    {!embedded&&<div className="urgency-single-header"><strong>대응 행동 <small>앱 참고</small></strong><ResponseBadge assessment={a}/></div>}
    <p className="urgency-origin">{origin}</p>
    <h2 id={headingId}>{!current && aiPending?'AI가 원문에서 대응 행동을 확인하고 있어요':a.headline}</h2>
    {current && a.actions[primaryIndex] ? <p className="urgency-primary-action">{a.actions[primaryIndex]}</p> : !aiPending && <p className="urgency-primary-action">{a.meaning}</p>}
    <p className="urgency-method" role="status">{aiPending?'AI 원문 해석 중 · 기본 판정을 먼저 보여드려요':a.method_note??'원문 표현을 기준으로 판단했어요.'}</p>
    <details className="urgency-details">
      <summary>판단 근거와 척도 안내 <ChevronDown size={15} aria-hidden="true" /></summary>
      <div>
        <p>{a.notice}</p><Link className="design-text-link" to="/response-guide">대응 단계 안내 보기 →</Link>
        <p>{a.applicability}</p>
        {current && <><p>{a.meaning}</p><ul>{a.actions.filter((_,i)=>i!==primaryIndex).map(item=><li key={item}>{item}</li>)}</ul></>}
        {a.evidence.map((e,i)=><div key={i}><blockquote>{e.quote}</blockquote><p>{e.explanation}</p></div>)}
        {!a.evidence.length && <p>단계를 정할 충분한 원문 근거를 확인하지 못했습니다.</p>}
        <p>앱이 행동의 시급함을 정리한 참고 척도이며 한국·미국·일본의 공식 경보 등급은 아닙니다. ‘대비’에도 지금 실행할 보호행동이 포함됩니다. ‘대피’는 재난에 따라 실내 대피 또는 높은 곳으로 이동 등 방식이 다르므로 위의 구체적인 행동을 확인하세요.</p>
        <p>미국·일본 경보의 원문과 행동 지시를 AI가 해석하고 근거 문장·부정·조건·취소 여부를 확인합니다. AI 연결이 안 되거나 근거가 부족하면 원문 기준의 기본 판정을 유지합니다. 일본의 공식 5단계 경계 레벨과 이 앱의 참고용 4단계는 다릅니다.</p>
        {a.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink size={13} aria-hidden="true" /></a>)}
      </div>
    </details>
  </article>;
}
