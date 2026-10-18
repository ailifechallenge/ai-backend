import US_ZONES from '../features/places/us-timezones.json';
import {timezoneLabel} from '../features/places/timezone';
import SharedLocationCard from '../../components/SharedLocationCard';
import chatStyles from '../../pages/Chat.module.css';
import bubbleStyles from '../../components/ChatBubble.module.css';
import {SendIcon} from '../../components/Icons';
import { useEffect, useRef, useState } from 'react';
import JourneyPlace from './JourneyPlace';
import {savedRegionLabel} from '../features/regions/labels';
import {useWorkspace} from '../hooks/workspace';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import UrgencyCard from './UrgencyCard';
import {inJapanCoverage,inUSCoverage} from '../features/shelters/coverage';
import './TravelAssistant.css';
import type {JourneyPlace as Place,Stay} from '../hooks/journey';
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
  const assistantCountry=ws.country;
  useEffect(()=>{const saved=savedRegions().filter(r=>r.scope.startsWith(ws.country+':'));setRegions(saved);setWeatherScope(old=>saved.some(r=>r.scope===old)?old:'');},[page.pathname,ws.country]);
  const {stay,setStay}=ws;
  const [editing,setEditing]=useState(false);
  const [name,setName]=useState(stay?.name??'');
  const placeCountry=ws.country;
  const [lat,setLat]=useState(stay?.latitude!=null?String(stay.latitude):''); const [lon,setLon]=useState(stay?.longitude!=null?String(stay.longitude):'');
  const [municipality,setMunicipality]=useState(stay?.municipality??'');
  const [zone,setZone]=useState(stay?.timezone??ws.place?.timezone??(country==='JP'?'Asia/Tokyo':''));
  const [start,setStart]=useState(stay?.start??''); const [end,setEnd]=useState(stay?.end??'');
  const [result,setResult]=useState<Conflict|null>(null);
  const [question,setQuestion]=useState('');
  const [pending,setPending]=useState('');
  const conversationEnd=useRef<HTMLDivElement>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  useEffect(()=>{if(page.pathname==='/chat'&&(messages.length||pending))conversationEnd.current?.scrollIntoView?.({behavior:'smooth',block:'nearest'});},[messages,pending,page.pathname]);
  const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const locationRevision=useRef(0);
  const sourceSignature = `${text}\0${alert?.id ?? ''}\0${country}`;
  const signature = sourceSignature + JSON.stringify([ws.place&&{name:ws.place.name,country:ws.place.country,lat:ws.place.lat,lon:ws.place.lon},stay,weatherScope,assistantCountry]);
  const activeContext = useRef(signature);
  activeContext.current = signature;
  useEffect(() => { setMessages([]); setPending(''); setResult(null); setError(''); setBusy(false); locationRevision.current++; }, [sourceSignature]);
  useEffect(() => { setBusy(false); setPending(''); setMessages([]); }, [signature]);
  useEffect(() => () => { activeContext.current = ''; locationRevision.current++; }, []);
  const independentPlace=useRef(false);
  const itineraryPlaceEditor=useRef<HTMLDetailsElement>(null);
  const lastSharedPlace=useRef(ws.place);
  useEffect(()=>{setMessages([]);setResult(null);if(stay||independentPlace.current)return;if(!ws.place&&lastSharedPlace.current&&!stay){setName('');setLat('');setLon('');setStart('');setEnd('');setResult(null);}lastSharedPlace.current=ws.place;if(ws.place){setName(ws.place.name);setLat(String(ws.place.lat));setLon(String(ws.place.lon));setZone(ws.place.timezone??(ws.place.country==='JP'?'Asia/Tokyo':''));setMunicipality('');setResult(null);setStart('');setEnd('');}},[ws.place?.country,ws.place?.lat,ws.place?.lon,ws.place?.name,ws.place?.timezone]);
  useEffect(()=>{independentPlace.current=false;locationRevision.current++;setWeatherScope('');setResult(null);const p=ws.place?.country===ws.country?ws.place:null;const saved=ws.stay?.country===ws.country?ws.stay:null;setName(saved?.name??p?.name??'');setLat(saved?.latitude!=null?String(saved.latitude):p?String(p.lat):'');setLon(saved?.longitude!=null?String(saved.longitude):p?String(p.lon):'');setMunicipality(saved?.municipality??'');setZone(saved?.timezone??p?.timezone??(ws.country==='JP'?'Asia/Tokyo':''));setStart(saved?.start??'');setEnd(saved?.end??'');setEditing(!!ws.stay&&!saved)},[ws.country]);
  const context={text,alert_id:alert?.id,country:ws.country};
  function useCurrentLocation(){
    if(!navigator.geolocation){setError('현재 위치를 지원하지 않는 기기입니다. 지도에서 위치를 선택해 주십시오.');return;}
    const revision=++locationRevision.current;setError('');
    navigator.geolocation.getCurrentPosition(p=>{if(revision!==locationRevision.current)return;const point={lat:p.coords.latitude,lon:p.coords.longitude};const c=inJapanCoverage(point)?'JP':inUSCoverage(point)?'US':null;if(!c){setError('현재는 미국·일본 위치를 지원합니다. 지도에서 조회할 위치를 선택해 주십시오.');return;}if(c!==ws.country){setError('현재 위치가 선택한 국가 밖입니다. 상단 국가를 변경하거나 선택 국가의 장소를 검색하십시오.');return;}if(p.coords.accuracy>2000){setError('위치 오차가 큽니다. 지도에서 정확한 위치를 확인해 주십시오.');return;}ws.setPlace({...point,name:'현재 위치에서 확인한 장소',country:c});setWeatherScope('');setShowLocation(false);},()=>{if(revision===locationRevision.current)setError('위치 권한을 허용하거나 지도에서 위치를 선택해 주십시오.');},{enableHighAccuracy:true,timeout:12000,maximumAge:0});
  }
  function invalidate() { locationRevision.current++; setEditing(true);setResult(null);setMessages([]); }
  function chooseItineraryPlace(p:Place){
    invalidate();independentPlace.current=true;
    setName(p.name);setLat(String(p.lat));setLon(String(p.lon));setMunicipality('');
    const nextZone=p.timezone??(p.country==='JP'?'Asia/Tokyo':'');
    setZone(nextZone);if(zone!==nextZone){setStart('');setEnd('');}
    if(itineraryPlaceEditor.current)itineraryPlaceEditor.current.open=false;
  }
  async function saveAndCheck() {
    locationRevision.current++;
    setError('');setResult(null);
    if(!name.trim()||!zone||!start||!end||((!lat||!lon)&&!municipality)) {setError('장소와 현지 시간대, 체류 시작·종료를 확인해 주십시오.');return;}
    if((lat&&!lon)||(!lat&&lon)){setError('위도와 경도를 함께 입력해 주십시오.');return;}
    const value:Stay={name:name.trim(),country:placeCountry,latitude:lat?Number(lat):null,longitude:lon?Number(lon):null,municipality:municipality||null,timezone:zone,start,end};
    if(!Number.isFinite(Date.parse(start))||!Number.isFinite(Date.parse(end))||end<=start){setError('체류 종료는 시작 시간보다 뒤로 입력해 주십시오.');return;}
    if(value.latitude!==null&&value.longitude!==null&&!(placeCountry==='JP'?inJapanCoverage({lat:value.latitude,lon:value.longitude}):inUSCoverage({lat:value.latitude,lon:value.longitude}))){setError('선택한 국가 안의 장소 좌표를 확인해 주십시오.');return;}
    if(placeCountry==='JP'?zone!=='Asia/Tokyo':!US_ZONES.includes(zone)){setError('선택한 국가의 현지 시간대를 확인해 주십시오.');return;}
    if(!text.trim()){setStay(value);setEditing(false);return;}
    const requestContext=signature;
    setBusy(true);
    try { const r=await api<Conflict>('conflict',{...context,stay:value});if(activeContext.current===requestContext){setStay(value);setEditing(false);setResult(r);} }
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
      const response=await api<Answer>('chat',{...context,country:text?country:(lookupLocation?.country??assistantCountry),question:value,history,stay:editing?null:stay,location:lookupLocation?{name:lookupLocation.name,country:lookupLocation.country,lat:lookupLocation.lat,lon:lookupLocation.lon,...(lookupLocation.approximate===undefined?{}:{approximate:lookupLocation.approximate})}:null,place_selection:selection,weather_scope:weatherScope||undefined,previous_intent:messages.at(-1)?.response.intent,related_alert_ids:related});
      if(activeContext.current!==requestContext)return;
      setMessages(prev=>[...prev.slice(-9),{question:value,response}]);setQuestion(response.needs_location?value:'');setShowLocation(Boolean(response.needs_location));
    }catch(e){if(activeContext.current===requestContext){setQuestion(value);setError(e instanceof Error?e.message:String(e));}}finally{if(activeContext.current===requestContext){setBusy(false);setPending('');}}
  }

  return <section className="travel-assistant" aria-label="일정과 경보 질문">
    {page.pathname==='/itinerary'&&<SharedLocationCard/>}
    <Panel className="chat-panel" hidden={page.pathname==='/itinerary'}>
      <div className="assistant-heading"><span>ActionGuard AI · 앱 전체 안전 도우미</span><h2 id="travel-chat">무엇이 궁금하십니까?</h2><p>경보가 없어도 지역·문자·대피시설을 물어보십시오.</p></div>
      <details className="assistant-context"><summary><strong>{ws.place?'조회 위치: '+ws.place.name:'조회 위치를 아직 등록하지 않았습니다'}</strong><span>설정</span></summary><div><button type="button" disabled={busy} onClick={useCurrentLocation}>현재 위치 사용</button><button type="button" disabled={busy} onClick={()=>setShowLocation(v=>!v)}>위치 등록·변경</button></div>{!!regions.length&&<label>기상경보 조회 지역<select value={weatherScope} disabled={busy} onChange={e=>setWeatherScope(e.target.value)}><option value="">등록한 좌표로 조회</option>{regions.map(r=><option key={r.scope} value={r.scope}>{savedRegionLabel(r)}</option>)}</select></label>}</details>
      {showLocation&&<JourneyPlace/>}

      {!!messages.length&&<button disabled={busy} onClick={()=>{setMessages([]);setError('');}}>대화 새로 시작</button>}
      <div className="chat-messages" aria-live="polite">{messages.map((m,i)=><article key={i}><p className={bubbleStyles.bubble}>{m.question}</p><div className={`assistant-reply ${bubbleStyles.bubble}`}><p className="chat-answer">{m.response.answer.split(/(https:\/\/[^\s]+)/g).map((part,n)=>part.startsWith('https://')?<a key={n} href={part} target="_blank" rel="noreferrer">공식 경보 확인 ↗</a>:part)}</p>{m.response.mode==='unavailable'&&<small>조회·분석을 완료하지 못한 부분이 있습니다.</small>}{m.response.mode==='evidence'&&<small>AI가 근거 자료를 바탕으로 설명한 답변입니다.</small>} {!!m.response.place_candidates?.length&&<div className="assistant-places"><p>검색된 장소 중 하나를 선택하십시오.</p>{m.response.place_candidates.map((p,n)=><button type="button" disabled={busy} key={n} onClick={()=>void ask(m.question,p.location)}><strong>{p.label}</strong><small>{p.approximate?'도시·지역 대표 지점':'지도에서 찾은 장소'}</small></button>)}</div>}{m.response.scope_note&&<p className="assistant-scope">{m.response.scope_note}</p>}{!!m.response.tools_used?.length&&<div className="assistant-tools">{m.response.tools_used.map(tool=><span key={tool}>{tool}</span>)}</div>}{m.response.urgency&&<UrgencyCard assessment={m.response.urgency}/>} {!!m.response.items?.length&&<div className="assistant-results">{m.response.items.map((item,n)=><section className="assistant-result" key={n}><strong>{item.kind==='shelter'?`${n+1}. `:''}{item.title}</strong><p>{item.detail}</p>{item.distance_m!=null&&<b>직선거리 {item.distance_m<1000?Math.round(item.distance_m)+'m':(item.distance_m/1000).toFixed(1)+'km'}</b>}<small>{item.status}</small><div>{item.alert?<button type="button" onClick={()=>{ws.update(item.alert!.text,item.alert!);ws.setMessageCountry(item.alert!.id.startsWith('jma:')?'JP':'US');navigate('/analyze');}}>이 경보로 번역·행동 확인</button>:item.path&&<Link to={item.path}>{item.kind==='shelter'?'지도·일반 경로 보기':'상세 보기'}</Link>}<a href={item.source} target="_blank" rel="noreferrer">공식 자료</a></div></section>)}</div>}{m.response.translation&&<details><summary>전체 한국어 번역</summary><p className="chat-answer">{m.response.translation.translation}</p></details>}{!!m.response.actions?.length&&<nav className="assistant-actions" aria-label="관련 앱 기능">{m.response.actions.map(a=><Link key={a.path} to={a.path==="/"?"/analyze":a.path}>{a.label} →</Link>)}</nav>}{m.response.needs_location&&<button type="button" onClick={()=>setShowLocation(true)}>조회 위치 설정</button>}{m.response.mode==='live'&&<small>조회 {new Date(m.response.checked_at).toLocaleString('ko-KR')} · 기기 시간</small>} {!!m.response.sources.length&&<details><summary>답변 근거 보기</summary>{m.response.sources.map((s,n)=><div key={n}><strong>{s.title}</strong><blockquote>{s.quote}</blockquote>{s.url&&<a href={s.url} target="_blank" rel="noreferrer">출처 확인</a>}</div>)}</details>}</div></article>)}</div>
      {pending&&<div role="status"><p>{pending}</p><p>필요한 앱 기능과 공식 자료를 확인하고 있습니다…</p></div>}
      <div ref={conversationEnd}/>
      <div className={`chat-suggestions ${chatStyles.chips}`}>{(text?['지금 무엇부터 해야 합니까?','차로 이동할 때 주의할 점은?','이 경보 상황이 언제 끝나나요?']:['내 지역에 활성화된 경보가 있습니까?','가장 가까운 대피소를 알려주십시오','이 경보 상황이 언제 끝나나요?']).map(q=><button key={q} disabled={busy} onClick={()=>void ask(q)}>{q}</button>)}</div>
      <form className={chatStyles.form} onSubmit={e=>{e.preventDefault();void ask();}}><label>AI 도우미에게 질문<textarea className={chatStyles.input} value={question} disabled={busy} maxLength={1000} onChange={e=>setQuestion(e.target.value)} placeholder="메시지를 입력하십시오"/></label><button className={chatStyles.send} aria-label={busy?'확인 중…':'질문 보내기'} disabled={busy||!question.trim()}><SendIcon/></button></form>
      <details className="chat-privacy"><summary>AI 이용 · 개인정보 안내</summary><p className="muted">질문·최근 대화·연결한 원문은 Gemini에 전송될 수 있습니다. 질문에서 검색할 장소명은 지도 검색 서비스로 전송됩니다. 등록 좌표와 체류 시간은 AI에 보내지 않고 공식 조회·거리·일정 비교에 사용합니다. 질문에 주소나 개인정보를 직접 적지 마십시오.</p></details>
    </Panel>
    <details hidden={page.pathname==='/chat'} id="travel-stay" className="itinerary-details" open={!!ws.place||page.pathname==='/itinerary'}><summary>숙소·방문 일정 등록 및 경보 겹침 확인</summary>
    <Panel>
      <h2>{text?'내 숙소·방문지와 겹칩니까?':stay&&!editing?'저장한 일정 확인':'어디에, 언제 머무릅니까?'}</h2>{stay&&stay.country!==ws.country&&<p className="notice">현재 선택 국가는 {ws.country==='JP'?'일본':'미국'}, 저장한 일정은 {stay.country==='JP'?'일본':'미국'}의 {stay.name}입니다. 일정 장소를 바꾸려면 아래 ‘장소 변경’을 눌러 주십시오.</p>}
      <p className="muted">장소를 선택하고 현지 시간으로 입력하십시오. 공식 경보를 연결하면 일정과의 겹침을 확인합니다.</p>
      <fieldset disabled={busy} className="stay-form" onChange={invalidate}>
        <details className="stay-location-details" ref={itineraryPlaceEditor}><summary>{name?`${name} · 일정 장소 변경`:'일정 장소 선택'}</summary>
          <p className="small-note">미래의 숙소·방문지를 선택하십시오. 홈의 등록 위치는 바뀌지 않습니다.</p>
          {ws.place&&<button type="button" className="button outline manual-map-select" onClick={()=>chooseItineraryPlace(ws.place!)}>상단에 등록한 위치 사용</button>}
          <JourneyPlace value={name&&lat&&lon?{name,lat:Number(lat),lon:Number(lon),country:ws.country,timezone:zone}:null} onChoose={chooseItineraryPlace}/>
        </details>
        <label>장소의 현지 시간대<select value={zone} onChange={e=>setZone(e.target.value)}><option value="">현지 시간대를 선택하십시오</option>{Array.from(new Set([zone,...zones])).filter(z=>!!z&&(ws.country==='JP'?z==='Asia/Tokyo':z!=='Asia/Tokyo')).map(z=><option key={z} value={z}>{timezoneLabel(z)} · {z}</option>)}</select></label>
        {name&&<p className="stay-selected">선택한 장소: <strong>{name}</strong>{zone&&<small>입력 기준: {timezoneLabel(zone)}</small>}</p>}

        <label>체류 시작<input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></label>
        <label>체류 종료<input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></label>
        <button className="button primary stay-submit" type="button" onClick={()=>void saveAndCheck()}>{text?'장소 등록하고 겹침 확인':'일정 등록하기'}</button>
      </fieldset>
      {stay&&editing&&<p className="small-note">수정 중입니다. 새로 등록하기 전까지 기존 일정은 기기에 유지됩니다.</p>}
      {stay&&!editing&&!text&&<p className="itinerary-saved" role="status">일정을 등록했습니다. <Link to="/analyze?mode=alerts">공식 경보 연결하기 →</Link></p>}
      {stay&&!editing&&<p><button className="button outline" disabled={busy} onClick={()=>{invalidate();setStay(null);setEditing(false);setName('');setLat('');setLon('');setStart('');setEnd('');setMunicipality('');}}>일정 삭제</button></p>}
      {result&&<div className="overlap-result" role="status"><h3>{result.status}</h3>{result.reasons.map((r,i)=><p key={i}>{r}</p>)}<small>확인: {new Date(result.checked_at).toLocaleString('ko-KR')}</small>{result.source&&<p><a href={result.source} target="_blank" rel="noreferrer">공식 경보 보기</a></p>}</div>}
    </Panel>
    </details>
    <ErrorBox error={error}/>
  </section>;
}
