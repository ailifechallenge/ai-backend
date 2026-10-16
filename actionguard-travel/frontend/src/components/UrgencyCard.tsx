import { ChevronDown, ExternalLink } from 'lucide-react';
import type { UrgencyAssessment } from '../types';
import './UrgencyCard.css';

const STEPS = ['정보', '주의', '대비', '대피'];
export default function UrgencyCard({assessment: a, aiPending=false}: {assessment: UrgencyAssessment; aiPending?:boolean}) {
  const current = a.inactive ? null : a.level;
  const primaryIndex = a.action_kind === 'higher_ground' && a.actions.length > 1 ? 1 : 0;
  const origin = {official: '공식 원문 연결', input: '입력문 해석 · 발령 미확인', example: '가상 예시 · 실제 경보 아님'}[a.provenance];
  const action = {shelter: '실내 대피', higher_ground: '높은 곳으로 이동', evacuate: '지시된 구역에서 대피', protect: '지금 보호행동', prepare: '지금 준비', caution: '활동 조정', monitor: '후속 안내 확인', unknown: '원문 확인'}[a.action_kind];
  return <article className={`urgency-card urgency-${current ?? 'unknown'}`} aria-labelledby="urgency-heading">
    <div className="urgency-topline"><span>대응 4단계 <small>참고용</small></span><span className="urgency-origin">{origin}</span></div>
    <ol className="urgency-scale" aria-label="앱 행동 척도: 정보, 주의, 대비, 대피">
      {STEPS.map((label,i)=><li key={label} className={current===i+1?'is-current':''} aria-current={current===i+1?'step':undefined}><span>{i+1}</span> {label}</li>)}
    </ol>
    <div className="urgency-current">{current ? <><strong>{a.label}</strong><span>{action}</span></> : <strong>{a.inactive?'현재 단계 미표시':aiPending?'판단 중':'확인 필요'}</strong>}</div>
    <h2 id="urgency-heading">{!current && aiPending?'AI가 원문에서 대응 행동을 확인하고 있어요':a.headline}</h2>
    {current && a.actions[primaryIndex] ? <p className="urgency-primary-action">{a.actions[primaryIndex]}</p> : !aiPending && <p className="urgency-primary-action">{a.meaning}</p>}
    <p className="urgency-method" role="status">{aiPending?'AI 원문 해석 중 · 기본 판정을 먼저 보여드려요':a.method_note??'원문 표현을 기준으로 판단했어요.'}</p>
    <p className="urgency-notice">{a.notice}</p>
    <details className="urgency-details">
      <summary>판단 근거와 척도 안내 <ChevronDown size={15} aria-hidden="true" /></summary>
      <div>
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
