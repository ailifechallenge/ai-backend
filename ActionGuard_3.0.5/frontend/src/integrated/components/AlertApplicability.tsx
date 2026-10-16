import {useQuery} from '@tanstack/react-query'
import {Link} from 'react-router-dom'
import {useWorkspace} from '../hooks/workspace'
import {useNearbyAlerts} from '../hooks/nearby-alerts'
import {api} from '../services/api'
import JourneyPlace from './JourneyPlace'
type Check={state:'inside'|'outside'|'unknown';label:string;detail:string;checked_at:string}
export default function AlertApplicability(){
 const ws=useWorkspace(),p=ws.place,a=ws.alert,nearby=useNearbyAlerts()
 const result=useQuery({queryKey:['alert-applicability',a?.id,a?.text,a?.checked_at,p?.lat,p?.lon,p?.country],queryFn:()=>api<Check>('places/applicability',{text:a!.text,alert_id:a!.id,country:a!.id.startsWith('jma:')?'JP':'US',location:{name:p!.name,lat:p!.lat,lon:p!.lon,country:p!.country}}),enabled:!!a&&!!p,staleTime:60000,retry:false})
 const expired=!!a&&[a.expires,a.ends].some(raw=>!!raw&&Number.isFinite(Date.parse(raw))&&Date.parse(raw)<=Date.now())
 const missing=!!a&&!!nearby.data&&!nearby.data.alerts.some(row=>row.id===a.id&&row.text===a.text)
 const differentCountry=!!a&&!!p&&(a.id.startsWith('jma:')?'JP':'US')!==p.country
 const unconfirmed=expired||missing||nearby.isError
 return <article className="focus-card applicability-card"><span className="focus-step">02 · 적용 범위</span><h2>등록한 위치에 해당하나요?</h2>
 {!p?<><p>아직 기준 위치가 없어요. 현재 위치나 숙소를 등록하면 대조할 수 있어요.</p><details><summary>도시·숙소 검색해서 등록</summary><JourneyPlace/></details></>:<><p className="scope-place">{p.name}{p.approximate?' · 도시·지역 대표점':' · 등록한 기준점'}</p>
 {!a?<p>입력한 문자만으로 위치 적용 여부를 확정하지 않아요. 공식 경보를 연결해야 해요.</p>:differentCountry?<p className="notice">이 경보는 {a.id.startsWith('jma:')?'일본':'미국'} 경보로, 등록 위치의 국가와 다릅니다. 등록 위치의 최신 경보를 별도로 확인하세요.</p>:unconfirmed?<div className="notice"><strong>최신 발령 상태를 다시 확인하세요</strong><p>{expired?'메시지 유효시간이 지났어요. 재난 종료를 뜻하지 않아요.':nearby.isError?'최신 기상 경보를 조회하지 못했어요.':'선택한 경보와 현재 조회 목록이 일치하지 않아요. 변경·만료·범위 차이가 있을 수 있어요.'}</p><Link to="/">최신 경보 목록 확인 →</Link></div>:result.isPending?<p role="status">공식 적용 범위를 대조하고 있어요…</p>:result.isError?<p role="status">적용 여부를 확인하지 못했어요. 공식 경보를 다시 선택해 주세요.</p>:result.data&&<><strong className={`scope-state scope-${result.data.state}`}>{result.data.label}</strong><p className="small-note">{result.data.detail}</p></>}
 <p className="small-note">현재 GPS 위치·이동 경로 전체의 안전 판정이 아닙니다.</p></>}
 </article>
}
