import {RefreshCw} from 'lucide-react'
import {useAlertAssessment} from '../integrated/hooks/alert-assessment'
import {AlertRegion} from './ReadableAlert'
import {alertName,ResponseBadge} from './AlertIdentity'
import {useNavigate} from 'react-router-dom'
import {Card,Note} from './Card'
import {Button,ButtonLink} from './Button'
import {useNearbyAlerts} from '../integrated/hooks/nearby-alerts'
import {useWorkspace} from '../integrated/hooks/workspace'
import type {Alert} from '../integrated/types'
export default function NearbyAlertCard(){
 const ws=useWorkspace(),result=useNearbyAlerts(),navigate=useNavigate()
 const rows=result.data?.alerts??[]
 function choose(a:Alert){ws.update(a.text,a);if(a.id===primary?.id&&assessment.data)ws.setUrgency(assessment.data);ws.setMessageCountry(a.id.startsWith('jma:')?'JP':'US');navigate('/analyze?mode=result')}
 const primary=rows.find(a=>a.id===ws.alert?.id)??rows[0]
 const assessment=useAlertAssessment(primary,!result.isError)
 if(!ws.place)return null
 const others=rows.filter(a=>a.id!==primary?.id)
 const unlisted=!!ws.alert&&!!result.data&&!rows.some(a=>a.id===ws.alert?.id&&a.text===ws.alert?.text)
 return <Card className="nearby-alert-card" title="등록 위치의 공식 기상 경보" aside={<Button variant="ghost" className="nearby-refresh" aria-label={result.isFetching?'공식 경보 확인 중':'공식 경보 새로고침'} title="공식 경보 새로고침" aria-busy={result.isFetching} disabled={result.isFetching} onClick={()=>void result.refetch()}><RefreshCw size={20} aria-hidden="true"/></Button>}>
 {result.isPending&&<p role="status">공식 경보를 조회하고 있습니다…</p>}
 {result.isError?<div role="alert"><p>최신 경보를 확인하지 못했습니다.</p><Note>이전에 보던 내용이 있어도 현재 발령 상태로 판단하지 마십시오.</Note><ButtonLink variant="secondary" to="/analyze?mode=alerts">공식 경보 직접 찾기</ButtonLink></div>:<>
 {unlisted&&<p className="notice">앞서 선택한 경보가 현재 조회 목록에서 일치하지 않습니다. 변경·만료 여부는 공식 자료에서 확인하십시오.</p>}
 {result.data&&!rows.length&&<p>이 위치의 조회된 기상 경보가 없습니다. 안전하다는 뜻은 아닙니다.</p>}
 {primary&&<div className="nearby-primary"><div className="nearby-alert-heading"><strong>{alertName(primary.event)}</strong><ResponseBadge event={primary.event} country={primary.id.startsWith('jma:')?'JP':'US'} assessment={assessment.data} pending={assessment.isFetching}/></div><small>{primary.event}</small><div className="assessment-feedback">{assessment.data?.method&&<p className="assessment-note" title={assessment.data.method_note}>{assessment.data.method==='ai'?'AI 원문 판정':'기본 판정 · AI 미확인'}</p>}{(assessment.isError||assessment.data?.method==='rules_fallback')&&<button className="assessment-retry" disabled={assessment.isFetching} onClick={()=>void assessment.refetch()}>AI 다시 확인</button>}</div><AlertRegion area={primary.area} collapsed/><Button block onClick={()=>choose(primary)}>이 경보의 상황·행동 확인</Button></div>}
 {rows.length>1&&<details className="nearby-other"><summary>다른 공식 경보 {rows.length-1}건</summary>{others.map(a=><button key={a.id} type="button" onClick={()=>choose(a)}><strong>{alertName(a.event)}</strong><small>{a.area}</small></button>)}</details>}
 </>}
 <div className="nearby-alert-meta">
 {result.data&&<Note>공식 확인 {new Intl.DateTimeFormat('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(result.data.checked_at))} · 기기 시간{result.isFetching?' · 새 상태 확인 중':''}</Note>}
 <Note>{ws.country==='JP'?'일본 기상 경보·주의보 조회입니다. 지진·쓰나미·화산은 일본 전용 화면에서 확인하십시오.':'NWS 기상 경보·주의보 조회입니다.'}</Note>
 </div>
 </Card>
}
