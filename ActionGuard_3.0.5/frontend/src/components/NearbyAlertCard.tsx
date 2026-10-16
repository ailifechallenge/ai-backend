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
 return <Card title="등록 위치의 공식 기상 경보" aside={<Button variant="ghost" disabled={result.isFetching} onClick={()=>void result.refetch()}>{result.isFetching?'확인 중…':'새로 확인'}</Button>}>
 {result.isPending&&<p role="status">공식 경보를 조회하고 있어요…</p>}
 {result.isError?<div role="alert"><p>최신 경보를 확인하지 못했어요.</p><Note>이전에 보던 내용이 있어도 현재 발령 상태로 판단하지 마세요.</Note><ButtonLink variant="secondary" to="/analyze?mode=alerts">공식 경보 직접 찾기</ButtonLink></div>:<>
 {unlisted&&<p className="notice">앞서 선택한 경보가 현재 조회 목록에서 일치하지 않아요. 변경·만료 여부는 공식 자료에서 확인하세요.</p>}
 {result.data&&!rows.length&&<p>이 위치의 조회된 기상 경보가 없어요. 안전하다는 뜻은 아닙니다.</p>}
 {primary&&<div className="nearby-primary"><div className="nearby-alert-heading"><strong>{alertName(primary.event)}</strong><ResponseBadge assessment={assessment.data} pending={assessment.isFetching}/></div><small>{primary.event}</small><div className="assessment-feedback">{assessment.data?.method&&<p className="assessment-note" title={assessment.data.method_note}>{assessment.data.method==='ai'?'AI 원문 판정':'기본 판정 · AI 미확인'}</p>}{(assessment.isError||assessment.data?.method==='rules_fallback')&&<button className="assessment-retry" disabled={assessment.isFetching} onClick={()=>void assessment.refetch()}>AI 다시 확인</button>}</div><AlertRegion area={primary.area} collapsed/><Button block onClick={()=>choose(primary)}>이 경보의 상황·행동 확인</Button></div>}
 {rows.length>1&&<details className="nearby-other"><summary>다른 공식 경보 {rows.length-1}건</summary>{others.map(a=><button key={a.id} type="button" onClick={()=>choose(a)}><strong>{alertName(a.event)}</strong><small>{a.area}</small></button>)}</details>}
 </>}
 {result.data&&<Note>마지막 공식 조회 {new Date(result.data.checked_at).toLocaleString('ko-KR')}{result.isFetching?' · 새 상태 확인 중':''}</Note>}
 <Note>기상 경보·주의보 조회입니다.{ws.place.country==='JP'?' 지진·쓰나미는 전용 지도에서 별도로 확인하세요.':''}</Note>
 </Card>
}
