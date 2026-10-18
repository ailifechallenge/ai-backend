import {useQuery} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import {useWorkspace} from '../hooks/workspace';
import {disasterLabels,disastersFor} from '../hooks/journey';
import {api} from '../services/api';
import JourneyPlace from './JourneyPlace';
export default function JourneyNext({ready}:{ready:boolean}){
 const ws=useWorkspace();const country=ws.alert?(ws.alert.id.startsWith('jma:')?'JP':'US'):ws.messageCountry;
 const context=useQuery({queryKey:['journey-context',ws.text,ws.alert?.id,country],enabled:ready&&!!ws.text,retry:false,queryFn:()=>api<{hazards:string[]}>('journey/context',{text:ws.text,alert_id:ws.alert?.id,country})});
 const choices=(context.data?.hazards||[]).filter(h=>disastersFor(ws.place?.country||country).includes(h));
 const filter=choices.length===1?choices[0]:'general';
 return <><JourneyPlace/>{ready&&<section className="panel journey-next"><h2>이제 내 상황에 맞춰 확인하십시오</h2><p>행동지침을 먼저 확인하고, 이동이나 대피가 필요할 때 시설을 찾아보십시오. 시설 목록이 대피 명령을 의미하지 않습니다.</p>
 {!!choices.length&&<p>원문에 언급된 위험: {choices.map(h=>disasterLabels[h]).join(' · ')}{choices.length>1?' · 여러 위험이 함께 있으므로 지도에서 유형별로 확인하십시오.':''}</p>}
 <div className="toolbar"><Link className="button outline" to="/chat">이 문자에 이어 질문하기</Link><Link className="button outline" to="/itinerary">등록한 위치에 일정 추가</Link><Link className="button primary" to={`/shelters?country=${ws.place?.country|| (country==='JP'?'JP':'US')}&disaster=${filter}`}>{ws.place?`${ws.place.name} 주변 시설 확인`:'위치 선택하고 주변 시설 확인'}</Link></div>
 {context.isError&&<p>재난 유형을 연결하지 못했습니다. 지도에서 직접 선택해 주십시오.</p>}</section>}</>;
}
