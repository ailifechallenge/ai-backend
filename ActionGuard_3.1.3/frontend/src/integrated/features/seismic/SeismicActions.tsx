import {Link} from 'react-router-dom';
import {actionCopy,buildHandoff,GUIDANCE_SOURCES} from './journey';
import type {Point} from './model';
export default function SeismicActions({hazard,eventId,position,level,archive=false,onLocate,locating=false}:{hazard:'earthquake'|'tsunami';eventId:string|null;position:(Point&{example?:boolean;at?:number})|null;level?:string;archive?:boolean;onLocate:()=>void;locating?:boolean}){
 const copy=actionCopy(hazard,archive?undefined:level);
 const handoff=buildHandoff(hazard,eventId,position);
 return <section className="seismic-card seismic-action-card" aria-label="행동요령과 대피시설 연결">
  <span className="seismic-muted">JMA 일반 행동요령 · 한국어 요약</span><h2>{copy.title}</h2>
  <ol>{copy.steps.map(step=><li key={step}>{step}</li>)}</ol><p className="seismic-muted">{copy.condition}{archive?' 과거 발표를 보고 있습니다. 현재 경보에 따른 대피 안내가 아닙니다.':''}</p>
  <a target="_blank" rel="noreferrer" href={GUIDANCE_SOURCES[hazard]}>행동요령 공식 근거 ↗</a>
  <div className="seismic-next"><h3>필요할 때, 대피장소까지</h3><p>{handoff.origin?(handoff.origin.example?'도쿄역 예시 위치로 시설을 찾습니다. 실제 내 위치가 아닙니다.':'확인한 위치와 재난 유형을 시설 지도에 전달합니다.'):'시설 지도에서 조회 위치를 먼저 확인하십시오. 진앙을 내 위치로 사용하지 않습니다.'}</p>
   <div className="seismic-actions"><Link className="seismic-cta" to={`/shelters?country=JP&disaster=${hazard}`} state={{seismicHandoff:handoff}}>{hazard==='tsunami'?'쓰나미 지정 대피장소 찾기':'지진 지정 대피장소 찾기'} →</Link>{!handoff.origin&&<button disabled={locating} onClick={onLocate}>{locating?'위치 확인 중…':'내 위치 먼저 확인'}</button>}</div>
   <p className="seismic-muted">지정 여부와 지금 개방 여부는 다릅니다. 시설 검색 결과는 현지 대피 지시나 안전한 이동 경로를 의미하지 않습니다.</p>
  </div>
 </section>;
}
