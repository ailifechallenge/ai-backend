import { useEffect, useRef, useState } from 'react';
import JourneyPlace from './JourneyPlace';
import {japaneseAreaLabel,savedRegionLabel} from '../features/regions/labels';
import {useWorkspace} from '../hooks/workspace';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import UrgencyCard from './UrgencyCard';
import {inJapanCoverage,inUSCoverage} from '../features/shelters/coverage';
import './TravelAssistant.css';
import type {Stay} from '../hooks/journey';
import { api } from '../services/api';
import type { Alert, UrgencyAssessment, Translation } from '../types';
import { Panel, ErrorBox } from './Common';

type Conflict = { status: string; reasons: string[]; checked_at: string; source: string|null; interval_utc: string[] };
type QueryLocation={name:string;country:"US"|"JP";lat:number;lon:number;approximate?:boolean};
type Answer = { query_location?:QueryLocation|null; place_candidates?:{location:QueryLocation;label:string;approximate:boolean;source:string}[]; answer: string; sources: {title:string; quote:string; url:string|null}[]; checked_at:string; mode:string; intent?:string; needs_location?:boolean; ai_used?:boolean; scope_note?:string; tools_used?:string[]; actions?:{label:string;path:string}[]; urgency?:UrgencyAssessment|null; translation?:Translation|null; items?:{kind:'alert'|'shelter'|'info';title:string;detail:string;status:string;source:string;path:string|null;distance_m:number|null;alert?:Alert|null}[] };
type Region={scope:string;name:string};
function savedRegions():Region[]{try{const data=JSON.parse(localStorage.getItem('actionguard-notification-draft-v1')||'null');return (data?.regions||[]).filter((r:Region)=>typeof r.name==='string'&&/^(US:[A-Z]{2}:[A-Z]{2}[CZ][0-9]{3}|JP:[0-9]{6}:[0-9]{7})$/.test(r.scope)).slice(0,10);}catch{return [];}}
type Message = { question: string; response: Answer };
const zones = ['Asia/Tokyo','America/New_York','America/Chicago','America/Denver','America/Phoenix','America/Los_Angeles','America/Anchorage','Pacific/Honolulu'];

export default function TravelAssistant({ text, alert, country }: { text: string; alert: Alert|null; country:'US'|'JP'|'unknown' }) {
  const ws=useWorkspace();const page=useLocation();const navigate=useNavigate();
  const [showLocation,setShowLocation]=useState(false);
  const [regions,setRegions]=useState<Region[]>(savedRegions);
  const [weatherScope,setWeatherScope]=useState('');
  const [assistantCountry,setAssistantCountry]=useState(country);
  useEffect(()=>{setAssistantCountry(country);},[country]);
  useEffect(()=>{const saved=savedRegions();setRegions(saved);setWeatherScope(old=>saved.some(r=>r.scope===old)?old:'');},[page.pathname]);
  const {stay,setStay}=ws;
  const [name,setName]=useState('');
  const [placeCountry,setPlaceCountry]=useState<'US'|'JP'>(country==='JP'?'JP':'US');
  const [lat,setLat]=useState(''); const [lon,setLon]=useState('');
  const [municipality,setMunicipality]=useState('');
  const [zone,setZone]=useState(country==='JP'?'Asia/Tokyo':'America/Los_Angeles');
  const [start,setStart]=useState(''); const [end,setEnd]=useState('');
  const [result,setResult]=useState<Conflict|null>(null);
  const [question,setQuestion]=useState('');
  const [pending,setPending]=useState('');
  const conversationEnd=useRef<HTMLDivElement>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  useEffect(()=>{conversationEnd.current?.scrollIntoView?.({behavior:'smooth',block:'nearest'});},[messages,pending]);
  const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const locationRevision=useRef(0);
  const sourceSignature = `${text}\0${alert?.id ?? ''}\0${country}`;
  const signature = sourceSignature + JSON.stringify([ws.place,stay,weatherScope,assistantCountry]);
  const activeContext = useRef(signature);
  activeContext.current = signature;
  useEffect(() => { setMessages([]); setPending(''); setResult(null); setError(''); setBusy(false); locationRevision.current++; }, [sourceSignature]);
  useEffect(() => { setBusy(false); setPending(''); setMessages([]); }, [signature]);
  useEffect(() => () => { activeContext.current = ''; locationRevision.current++; }, []);
  const lastSharedPlace=useRef(ws.place);
  useEffect(()=>{setMessages([]);if(!ws.place&&lastSharedPlace.current){setName('');setLat('');setLon('');setStart('');setEnd('');setResult(null);}lastSharedPlace.current=ws.place;if(ws.place&&stay&&stay.latitude===ws.place.lat&&stay.longitude===ws.place.lon&&stay.country===ws.place.country&&stay.name===ws.place.name)return;if(ws.place){setName(ws.place.name);setPlaceCountry(ws.place.country);setLat(String(ws.place.lat));setLon(String(ws.place.lon));setZone(ws.place.country==='JP'?'Asia/Tokyo':'America/Los_Angeles');setMunicipality('');setResult(null);setStart('');setEnd('');}},[ws.place]);
  const context={text,alert_id:alert?.id,country};
  function useCurrentLocation(){
    if(!navigator.geolocation){setError('현재 위치를 지원하지 않는 기기예요. 지도에서 위치를 선택해 주세요.');return;}
    const revision=++locationRevision.current;setError('');
    navigator.geolocation.getCurrentPosition(p=>{if(revision!==locationRevision.current)return;const point={lat:p.coords.latitude,lon:p.coords.longitude};const c=inJapanCoverage(point)?'JP':inUSCoverage(point)?'US':null;if(!c){setError('현재는 미국·일본 위치를 지원해요. 지도에서 조회할 위치를 선택해 주세요.');return;}if(p.coords.accuracy>2000){setError('위치 오차가 커요. 지도에서 정확한 위치를 확인해 주세요.');return;}ws.setPlace({...point,name:'현재 위치에서 확인한 장소',country:c});setWeatherScope('');setShowLocation(false);},()=>{if(revision===locationRevision.current)setError('위치 권한을 허용하거나 지도에서 위치를 선택해 주세요.');},{enableHighAccuracy:true,timeout:12000,maximumAge:0});
  }
  function invalidate() { locationRevision.current++; setStay(null); setResult(null); setMessages([]); }
  function locate() {
    if (!navigator.geolocation) {setError('현재 위치를 지원하지 않는 브라우저입니다.'); return;}
    const revision=++locationRevision.current;
    navigator.geolocation.getCurrentPosition(p=>{
      if(revision!==locationRevision.current)return;
      setLat(String(p.coords.latitude));setLon(String(p.coords.longitude));setStay(null);setResult(null);
    },()=>{if(revision===locationRevision.current)setError('위치 권한을 확인하거나 좌표를 직접 입력해 주세요.');},{timeout:10000,maximumAge:0});
  }
  async function saveAndCheck() {
    locationRevision.current++;
    setError('');setResult(null);
    if(!name.trim()||!start||!end||((!lat||!lon)&&!municipality)) {setError('장소 이름, 위치와 체류 시간을 입력해 주세요.');return;}
    if((lat&&!lon)||(!lat&&lon)){setError('위도와 경도를 함께 입력해 주세요.');return;}
    const value:Stay={name:name.trim(),country:placeCountry,latitude:lat?Number(lat):null,longitude:lon?Number(lon):null,municipality:municipality||null,timezone:zone,start,end};
    const requestContext=signature;
    setBusy(true);
    try { const r=await api<Conflict>('conflict',{...context,stay:value});if(activeContext.current===requestContext){if(value.latitude!==null&&value.longitude!==null&&(!ws.place||ws.place.lat!==value.latitude||ws.place.lon!==value.longitude||ws.place.country!==value.country||ws.place.name!==value.name)){ws.setPlace({name:value.name,country:value.country,lat:value.latitude,lon:value.longitude});}setStay(value);setResult(r);} }
    catch(e){if(activeContext.current===requestContext)setError(e instanceof Error?e.message:String(e));}finally{if(activeContext.current===requestContext)setBusy(false);}
  }
  async function ask(value=question,selection?:QueryLocation) {
    if(!value.trim()||busy)return;
    const requestContext=signature;
    setBusy(true);setPending(value);setError('');
    try {
      const history=messages.slice(-4).flatMap(m=>[{role:'user',text:m.question},{role:'assistant',text:m.response.answer.slice(0,1800)}]);
      const related=([...messages].reverse().find(m=>m.response.items?.some(item=>item.alert))?.response.items??[]).flatMap(item=>item.alert?[item.alert.id]:[]).slice(0,5);
      const lookupLocation=selection??[...messages].reverse().find(m=>m.response.query_location)?.response.query_location??ws.place;
      const response=await api<Answer>('chat',{...context,country:text?country:(lookupLocation?.country??assistantCountry),question:value,history,stay,location:lookupLocation,place_selection:selection,weather_scope:weatherScope||undefined,previous_intent:messages.at(-1)?.response.intent,related_alert_ids:related});
      if(activeContext.current!==requestContext)return;
      setMessages(prev=>[...prev.slice(-9),{question:value,response}]);setQuestion(response.needs_location?value:'');if(response.needs_location)setShowLocation(true);
    }catch(e){if(activeContext.current===requestContext){setQuestion(value);setError(e instanceof Error?e.message:String(e));}}finally{if(activeContext.current===requestContext){setBusy(false);setPending('');}}
  }
  if(!text.trim()&&page.pathname==='/itinerary')return <section className="travel-assistant"><div className="empty-task"><h1>내 일정도 확인해 볼까요?</h1><p>홈에서 받은 문자를 먼저 입력해 주세요. 같은 문자를 기준으로 이어서 확인할 수 있어요.</p><Link className="button primary" to="/">문자 확인하러 가기</Link></div></section>;
  return <section className="travel-assistant" aria-label="일정과 경보 질문">
    {page.pathname==='/itinerary'&&<JourneyPlace/>}
    <Panel className="chat-panel">
      <div className="assistant-heading"><span>ActionGuard AI</span><h2 id="travel-chat">앱에서 필요한 일,<br/>편하게 물어보세요.</h2><p>문자 해석부터 경보·대피시설·길찾기·일정·알림까지 도와드려요.</p></div>
      <div className="assistant-context"><strong>{ws.place?'조회 위치: '+ws.place.name:'조회 위치를 아직 등록하지 않았어요'}</strong><div><button type="button" disabled={busy} onClick={useCurrentLocation}>현재 위치 사용</button><button type="button" disabled={busy} onClick={()=>setShowLocation(v=>!v)}>위치 등록·변경</button></div>{!ws.place&&!text&&<label>일반 안전 안내 국가<select value={assistantCountry} onChange={e=>setAssistantCountry(e.target.value as typeof country)} disabled={busy}><option value="unknown">선택해 주세요</option><option value="US">미국</option><option value="JP">일본</option></select></label>}{!!regions.length&&<label>기상경보 조회 지역<select value={weatherScope} disabled={busy} onChange={e=>setWeatherScope(e.target.value)}><option value="">등록한 좌표로 조회</option>{regions.map(r=><option key={r.scope} value={r.scope}>{savedRegionLabel(r)}</option>)}</select></label>}</div>
      {showLocation&&<JourneyPlace/>}
      {ws.place&&<p>공통 위치: {ws.place.name} · {stay?'체류 일정 연결됨':'시간 비교에는 체류 일정 추가가 필요해요'} <Link to={`/shelters?country=${ws.place.country}`}>주변 시설 보기</Link></p>}
      <p className="muted">경보 입력 전에도 사용할 수 있어요. 필요한 위치나 원문이 없으면 먼저 확인할게요.</p>
      {!!messages.length&&<button disabled={busy} onClick={()=>{setMessages([]);setError('');}}>대화 새로 시작</button>}
      {!!text&&<p className="muted">연결한 문자: {alert?.headline||'직접 입력 · 발령 여부 미확인'}</p>}
      <div className="chat-suggestions">{(text?['지금 무엇부터 해야 하나요?','차로 이동할 때 주의할 점은?','언제 끝나나요?','내 숙소 일정이 겹치나요?']:['내 지역에 활성화된 경보가 있어?','가장 가까운 대피소를 알려줘','이 앱으로 무엇을 할 수 있어?','알림 설정을 도와줘']).map(q=><button key={q} disabled={busy} onClick={()=>void ask(q)}>{q}</button>)}</div>
      <div className="chat-messages" aria-live="polite">{messages.map((m,i)=><article key={i}><p>{m.question}</p><p className="chat-answer">{m.response.answer}</p>{m.response.mode==='unavailable'&&<small>조회·분석을 완료하지 못한 부분이 있어요.</small>}{m.response.mode==='evidence'&&<small>AI가 근거 자료를 바탕으로 설명한 답변입니다.</small>} {!!m.response.place_candidates?.length&&<div className="assistant-places"><p>검색된 장소 중 하나를 선택하세요.</p>{m.response.place_candidates.map((p,n)=><button type="button" disabled={busy} key={n} onClick={()=>void ask(m.question,p.location)}><strong>{p.label}</strong><small>{p.approximate?'도시·지역 대표 지점':'지도에서 찾은 장소'}</small></button>)}</div>}{m.response.scope_note&&<p className="assistant-scope">{m.response.scope_note}</p>}{!!m.response.tools_used?.length&&<div className="assistant-tools">{m.response.tools_used.map(tool=><span key={tool}>{tool}</span>)}</div>}{m.response.urgency&&<UrgencyCard assessment={m.response.urgency}/>} {!!m.response.items?.length&&<div className="assistant-results">{m.response.items.map((item,n)=><section className="assistant-result" key={n}><strong>{item.kind==='shelter'?`${n+1}. `:''}{item.title}</strong><p>{item.detail}</p>{item.distance_m!=null&&<b>직선거리 {item.distance_m<1000?Math.round(item.distance_m)+'m':(item.distance_m/1000).toFixed(1)+'km'}</b>}<small>{item.status}</small><div>{item.alert?<button type="button" onClick={()=>{ws.update(item.alert!.text,item.alert!);ws.setMessageCountry(item.alert!.id.startsWith('jma:')?'JP':'US');navigate('/');}}>이 경보로 번역·행동 확인</button>:item.path&&<Link to={item.path}>{item.kind==='shelter'?'지도·일반 경로 보기':'상세 보기'}</Link>}<a href={item.source} target="_blank" rel="noreferrer">공식 자료</a></div></section>)}</div>}{m.response.translation&&<details><summary>전체 한국어 번역</summary><p className="chat-answer">{m.response.translation.translation}</p></details>}{!!m.response.actions?.length&&<nav className="assistant-actions" aria-label="관련 앱 기능">{m.response.actions.map(a=><Link key={a.path} to={a.path}>{a.label} →</Link>)}</nav>}{m.response.needs_location&&<button type="button" onClick={()=>setShowLocation(true)}>조회 위치 설정</button>}{m.response.mode==='live'&&<small>조회 {new Date(m.response.checked_at).toLocaleString('ko-KR')} · 기기 시간</small>} {!!m.response.sources.length&&<details><summary>답변 근거 보기</summary>{m.response.sources.map((s,n)=><div key={n}><strong>{s.title}</strong><blockquote>{s.quote}</blockquote>{s.url&&<a href={s.url} target="_blank" rel="noreferrer">출처 확인</a>}</div>)}</details>}</article>)}</div>
      {pending&&<div role="status"><p>{pending}</p><p>필요한 앱 기능과 공식 자료를 확인하고 있어요…</p></div>}
      <div ref={conversationEnd}/>
      <form onSubmit={e=>{e.preventDefault();void ask();}}><label>AI 도우미에게 질문<textarea value={question} disabled={busy} maxLength={1000} onChange={e=>setQuestion(e.target.value)} placeholder="예: 내 지역 경보를 확인하고 가까운 대피소도 찾아줘"/></label><button disabled={busy||!question.trim()}>{busy?'확인 중…':'질문 보내기'}</button></form>
      <p className="muted">질문·최근 대화·연결한 원문은 Gemini에 전송될 수 있어요. 질문에서 검색할 장소명은 지도 검색 서비스로 전송됩니다. 등록 좌표와 체류 시간은 AI에 보내지 않고 공식 조회·거리·일정 비교에 사용해요. 질문에 주소나 개인정보를 직접 적지 마세요.</p>
    </Panel>
    <details id="travel-stay" className="itinerary-details" open={!!ws.place||page.pathname==='/itinerary'}><summary>숙소·방문 일정 등록 및 경보 겹침 확인</summary>
    <Panel>
      <h2>내 숙소·방문지와 겹칠까요?</h2>
      <p className="muted">장소 한 곳의 체류 시간과 선택한 경보를 비교합니다. 공통 위치가 자동으로 채워집니다. 체류 시간은 장소의 현지 시간으로 입력하세요.</p>
      {!alert&&<p>공식 경보 찾기에서 경보를 선택하면 위치·시간을 대조할 수 있어요.</p>}
      <fieldset disabled={busy} className="stay-form" onChange={invalidate}>
        <details className="stay-location-details" open={!ws.place}><summary>{ws.place?`${ws.place.name} · 위치 수정`:'장소 직접 입력'}</summary><div className="stay-form">
        <label>장소 이름<input value={name} maxLength={120} onChange={e=>setName(e.target.value)} placeholder="숙소 또는 방문 장소"/></label>
        <label>일정 국가<select value={placeCountry} onChange={e=>{const v=e.target.value as 'US'|'JP';setPlaceCountry(v);setZone(v==='JP'?'Asia/Tokyo':'America/Los_Angeles');setMunicipality('');}}><option value="US">미국</option><option value="JP">일본</option></select></label>
        <label>위도<input type="number" min={-90} max={90} step="any" value={lat} onChange={e=>{setLat(e.target.value);setMunicipality('');}} placeholder="예: 34.05"/></label>
        <label>경도<input type="number" min={-180} max={180} step="any" value={lon} onChange={e=>{setLon(e.target.value);setMunicipality('');}} placeholder="예: -118.24"/></label>
        <button type="button" onClick={locate}>현재 위치로 채우기</button>
        {placeCountry==='JP'&&alert?.id.startsWith('jma:')&&<label>또는 해당 시정촌 선택<select value={municipality} onChange={e=>{setMunicipality(e.target.value);setLat('');setLon('');}}><option value="">직접 확인한 지역을 선택하세요</option>{alert.area.split('、').map(a=><option key={a} value={a}>{japaneseAreaLabel(a)}</option>)}</select></label>}
        <label>장소의 현지 시간대<select value={zone} onChange={e=>setZone(e.target.value)}>{zones.map(z=><option key={z}>{z}</option>)}</select></label>
        </div></details>
        <label>체류 시작<input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></label>
        <label>체류 종료<input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></label>
        <button type="button" disabled={!text.trim()} onClick={()=>void saveAndCheck()}>장소 등록하고 겹침 확인</button>
      </fieldset>
      <p className="muted">현재 위치는 지금 있는 장소입니다. 다른 숙소는 지도에서 확인한 좌표를 입력하세요. 일정은 이 화면에서만 유지되며 판정 요청 시 서버로 전송됩니다.</p>
      {stay&&<p>등록한 장소: <strong>{stay.name}</strong> · {stay.timezone} <button disabled={busy} onClick={()=>{invalidate();setName('');setLat('');setLon('');setStart('');setEnd('');setMunicipality('');}}>일정 삭제</button></p>}
      {result&&<div className="overlap-result" role="status"><h3>{result.status}</h3>{result.reasons.map((r,i)=><p key={i}>{r}</p>)}<small>확인: {new Date(result.checked_at).toLocaleString('ko-KR')}</small>{result.source&&<p><a href={result.source} target="_blank" rel="noreferrer">공식 경보 보기</a></p>}</div>}
    </Panel>
    </details>
    <ErrorBox error={error}/>
  </section>;
}
