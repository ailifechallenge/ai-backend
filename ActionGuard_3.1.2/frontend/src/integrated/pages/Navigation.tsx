import RouteCoach from '../features/shelters/RouteCoach';
import {useEffect,useRef,useState} from 'react';
import {Link,useLocation,useSearchParams} from 'react-router-dom';
import {api} from '../services/api';
import {ErrorBox,Panel} from '../components/Common';
import NavigationMap from '../features/shelters/NavigationMap';
import type {NavigationResult} from '../features/shelters/NavigationMap';
import type {Origin} from '../features/shelters/types';
import {distance,timestamp} from '../features/shelters/types';
import {useWorkspace} from '../hooks/workspace';
import {readHandoff} from '../features/seismic/journey';
import {NYC_EXAMPLE,TOKYO_EXAMPLE} from '../features/shelters/coverage';
function coordinate(value:string):Origin|null{const parts=value.split(',').map(x=>Number(x.trim()));return parts.length===2&&value.split(',').every(x=>x.trim())&&parts.every(Number.isFinite)&&Math.abs(parts[0])<=90&&Math.abs(parts[1])<=180?{lat:parts[0],lon:parts[1]}:null;}
export default function Navigation(){
 const ws=useWorkspace();const [params]=useSearchParams();const location=useLocation();const handoff=readHandoff(location.state);const base=ws.place||(params.get('country')==='JP'?TOKYO_EXAMPLE:NYC_EXAMPLE);
 const [from,setFrom]=useState(params.get('from')||`${base.lat},${base.lon}`),[to,setTo]=useState(params.get('to')||'');
 const [mode,setMode]=useState<'WALK'|'DRIVE'>('WALK'),[data,setData]=useState<NavigationResult|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState<unknown>(null),[pick,setPick]=useState<'from'|'to'>('to');
 const guideRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(data)guideRef.current?.scrollIntoView?.({behavior:'smooth',block:'start'});},[data]);
 const [position,setPosition]=useState<Origin|null>(null);
 const generation=useRef(0);useEffect(()=>()=>{generation.current++;},[]);
 function clear(){generation.current++;setData(null);setPosition(null);setError(null);setBusy(false);}
 async function search(){clear();if(!coordinate(from)||!coordinate(to)){setError(new Error('지도에서 출발지·도착지를 선택하거나 좌표를 입력하세요.'));return;}const id=generation.current;setBusy(true);try{const result=await api<NavigationResult>('navigation/route',{origin:from.trim(),destination:to.trim(),mode});if(id===generation.current)setData(result);}catch(e){if(id===generation.current)setError(e);}finally{if(id===generation.current)setBusy(false);}}
 function locate(){clear();if(!navigator.geolocation){setError(new Error('현재 위치를 지원하지 않습니다.'));return;}const id=generation.current;navigator.geolocation.getCurrentPosition(p=>{if(id===generation.current)setFrom(`${p.coords.latitude},${p.coords.longitude}`);},()=>{if(id===generation.current)setError(new Error('위치 권한을 허용하거나 지도를 선택하세요.'));},{timeout:10000,maximumAge:0});}
 return <><div className="eyebrow">내 위치 → 선택한 목적지</div><h1>선택한 시설까지 이동</h1><p className="lead">도착지와 경로를 확인한 뒤, 내 위치 안내를 시작하세요.</p><div className="toolbar"><Link state={handoff?{seismicHandoff:handoff}:undefined} to={handoff?.returnTo??"/analyze"}>{handoff?"← 지진·쓰나미 정보":"← 문자·행동지침"}</Link><Link state={handoff?{seismicHandoff:handoff}:undefined} to={`/shelters?country=${params.get('country')==='JP'||ws.place?.country==='JP'?'JP':'US'}${handoff?'&disaster='+handoff.hazard:''}`}>← 시설 목록으로</Link></div>
 {params.get('name')&&<p className="notice">선택한 시설: {params.get('name')} · 현장 개방·입소 가능 여부를 확인하고 이동하세요.</p>}
 <Panel><details open={!data}><summary>출발·도착지와 이동 수단</summary><form onSubmit={e=>{e.preventDefault();void search();}}><div className="nav-grid"><label>출발지<input value={from} maxLength={240} onChange={e=>{clear();setFrom(e.target.value);}} placeholder="위도, 경도"/></label><label>도착지<input value={to} maxLength={240} onChange={e=>{clear();setTo(e.target.value);}} placeholder="지도에서 목적지 선택"/></label></div>
 {!ws.place&&!params.get('from')&&<p>출발지는 예시 좌표입니다. 현재 위치를 확인한 뒤 사용하세요.</p>}
 <div className="toolbar"><button type="button" className="button outline" onClick={locate}>현재 위치를 출발지로</button>{ws.place&&<button type="button" className="button outline" onClick={()=>{clear();setFrom(`${ws.place!.lat},${ws.place!.lon}`);}}>공통 위치 {ws.place.name} 사용</button>}<button type="button" className="button outline" onClick={()=>{clear();setFrom(to);setTo(from);}}>출발·도착 바꾸기</button><label>이동 수단<select value={mode} onChange={e=>{clear();setMode(e.target.value as 'WALK'|'DRIVE');}}><option value="WALK">도보</option><option value="DRIVE">자동차 · 실시간 교통 미반영</option></select></label><button className="button primary" disabled={busy||!to.trim()}>{busy?'경로 조회 중…':'경로 찾기'}</button></div></form></details></Panel><ErrorBox error={error}/>
 <div ref={guideRef} className="route-anchor"/><Panel className="route-map-panel">{data&&<RouteCoach key={data.route.checked_at} route={data.route} onPosition={setPosition}/>}<h2>길찾기 지도</h2><label>지도 클릭으로 설정<select value={pick} onChange={e=>setPick(e.target.value as 'from'|'to')}><option value="from">출발지 A</option><option value="to">도착지 B</option></select></label><NavigationMap position={position} start={coordinate(from)||base} end={coordinate(to)||coordinate(from)||base} data={data} onPick={p=>{clear();(pick==='from'?setFrom:setTo)(`${p.lat},${p.lon}`);}}/><p className="muted">A는 출발지, B는 도착지입니다. 지도에서 선택한 건물의 실제 출입구와 통행 가능 여부는 확인되지 않습니다.</p></Panel>
 {data&&<Panel><h2>{data.mode==='WALK'?'도보':'자동차'} {distance(data.route.distance_m)} · 약 {Math.ceil(data.route.duration_s/60)}분</h2><p>{data.route.alternatives_evaluated||1}개 후보 중 예상시간 최소 · {timestamp(data.route.checked_at)}</p>{data.warnings.map((w,i)=><p className="notice" key={i}>{w}</p>)}<small>{data.route.attribution}</small></Panel>}
 <p className="notice">일반 도로 경로입니다. 재난·침수·통제 회피나 안전한 대피 경로를 보장하지 않습니다. 현지 당국의 이동 제한과 지시를 우선하세요.</p><p className="muted">경로 조회 시 출발·도착 좌표를 FOSSGIS로 전송합니다. 위치 안내는 이 화면이 열려 있는 동안만 작동하며 백그라운드 내비게이션은 지원하지 않습니다. <a href="https://routing.openstreetmap.de/about.html" target="_blank" rel="noreferrer">경로 출처·이용 안내</a> · <a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noreferrer">지도 오류 알리기</a></p></>;
}
