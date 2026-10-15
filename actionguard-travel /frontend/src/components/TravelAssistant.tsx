import { useEffect, useRef, useState } from 'react';
import JourneyPlace from './JourneyPlace';
import {useWorkspace} from '../hooks/workspace';
import {Link,useLocation} from 'react-router-dom';
import type {Stay} from '../hooks/journey';
import { api } from '../services/api';
import type { Alert } from '../types';
import { Panel, ErrorBox } from './Common';

type Conflict = { status: string; reasons: string[]; checked_at: string; source: string|null; interval_utc: string[] };
type Answer = { answer: string; sources: {title:string; quote:string; url:string|null}[]; checked_at:string; mode:string };
type Message = { question: string; response: Answer };
const zones = ['Asia/Tokyo','America/New_York','America/Chicago','America/Denver','America/Phoenix','America/Los_Angeles','America/Anchorage','Pacific/Honolulu'];

export default function TravelAssistant({ text, alert, country }: { text: string; alert: Alert|null; country:'US'|'JP'|'unknown' }) {
  const ws=useWorkspace();const page=useLocation();
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
  const signature = sourceSignature + JSON.stringify([ws.place,stay]);
  const activeContext = useRef(signature);
  activeContext.current = signature;
  useEffect(() => { setMessages([]); setPending(''); setResult(null); setError(''); setBusy(false); locationRevision.current++; }, [sourceSignature]);
  useEffect(() => { setBusy(false); setPending(''); setMessages([]); }, [signature]);
  useEffect(() => () => { activeContext.current = ''; locationRevision.current++; }, []);
  const lastSharedPlace=useRef(ws.place);
  useEffect(()=>{setMessages([]);if(!ws.place&&lastSharedPlace.current){setName('');setLat('');setLon('');setStart('');setEnd('');setResult(null);}lastSharedPlace.current=ws.place;if(ws.place&&stay&&stay.latitude===ws.place.lat&&stay.longitude===ws.place.lon&&stay.country===ws.place.country&&stay.name===ws.place.name)return;if(ws.place){setName(ws.place.name);setPlaceCountry(ws.place.country);setLat(String(ws.place.lat));setLon(String(ws.place.lon));setZone(ws.place.country==='JP'?'Asia/Tokyo':'America/Los_Angeles');setMunicipality('');setResult(null);setStart('');setEnd('');}},[ws.place]);
  const context={text,alert_id:alert?.id,country};
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
  async function ask(value=question) {
    if(!value.trim()||busy)return;
    const requestContext=signature;
    setBusy(true);setPending(value);setError('');
    try {
      const history=messages.slice(-4).flatMap(m=>[{role:'user',text:m.question},{role:'assistant',text:m.response.answer.slice(0,1800)}]);
      const response=await api<Answer>('chat',{...context,question:value,history,stay});
      if(activeContext.current!==requestContext)return;
      setMessages(prev=>[...prev.slice(-9),{question:value,response}]);setQuestion('');
    }catch(e){if(activeContext.current===requestContext){setQuestion(value);setError(e instanceof Error?e.message:String(e));}}finally{if(activeContext.current===requestContext){setBusy(false);setPending('');}}
  }
  if(!text.trim()&&['/chat','/itinerary'].includes(page.pathname))return <section className="travel-assistant"><div className="empty-task"><h1>{page.pathname==='/chat'?'무엇이 궁금하세요?':'내 일정도 확인해 볼까요?'}</h1><p>홈에서 받은 문자를 먼저 입력해 주세요. 같은 문자를 기준으로 이어서 확인할 수 있어요.</p><Link className="button primary" to="/">문자 확인하러 가기</Link></div></section>;
  return <section className="travel-assistant" aria-label="일정과 경보 질문">
    {page.pathname==='/itinerary'&&<JourneyPlace/>}
    <Panel className="chat-panel">
      <h2 id="travel-chat">여행 안전 도우미</h2>
      {ws.place&&<p>공통 위치: {ws.place.name} · {stay?'체류 일정 연결됨':'시간 비교에는 체류 일정 추가가 필요해요'} <Link to={`/shelters?country=${ws.place.country}`}>주변 시설 보기</Link></p>}
      <p>받은 문자에 대해 편하게 물어보세요. 앞선 대화에 이어서 질문할 수 있어요.</p>
      {!!messages.length&&<button disabled={busy} onClick={()=>{setMessages([]);setError('');}}>대화 새로 시작</button>}
      <p className="muted">{alert?.headline||'입력한 문자 · 공식 발령 여부 미확인'}</p>
      <div className="chat-suggestions">{['지금 무엇부터 해야 하나요?','차로 이동할 때 주의할 점은?','언제 끝나나요?','내 숙소 일정이 겹치나요?'].map(q=><button key={q} disabled={busy||!text.trim()} onClick={()=>void ask(q)}>{q}</button>)}</div>
      <div className="chat-messages" aria-live="polite">{messages.map((m,i)=><article key={i}><p><strong>질문</strong> {m.question}</p><p className="chat-answer">{m.response.answer}</p>{m.response.mode==='unavailable'&&<small>맞춤 답변 대신 참고할 일반 안내를 표시했습니다.</small>}{m.response.mode==='evidence'&&<small>AI가 근거 자료를 바탕으로 설명한 답변입니다.</small>} {!!m.response.sources.length&&<details><summary>답변 근거 보기</summary>{m.response.sources.map((s,n)=><div key={n}><strong>{s.title}</strong><blockquote>{s.quote}</blockquote>{s.url&&<a href={s.url} target="_blank" rel="noreferrer">출처 확인</a>}</div>)}</details>}</article>)}</div>
      {pending&&<div role="status"><p><strong>질문</strong> {pending}</p><p>경보와 안전수칙에서 근거를 확인하고 있어요…</p></div>}
      <div ref={conversationEnd}/>
      <form onSubmit={e=>{e.preventDefault();void ask();}}><label>경보에 대한 질문<textarea value={question} disabled={busy} maxLength={1000} onChange={e=>setQuestion(e.target.value)} placeholder="예: 지금 호텔에 있는데, 차로 나가도 될까요?"/></label><button disabled={busy||!question.trim()||!text.trim()}>{busy?'확인 중…':'질문 보내기'}</button></form>
      <p className="muted">자유 질문과 최근 대화·경보 원문은 Gemini에 전송됩니다. 일정 위치와 시간의 겹침은 서버 규칙으로 계산하며 Gemini에 전달하지 않습니다.</p>
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
        {placeCountry==='JP'&&alert?.id.startsWith('jma:')&&<label>또는 해당 시정촌 선택<select value={municipality} onChange={e=>{setMunicipality(e.target.value);setLat('');setLon('');}}><option value="">직접 확인한 지역을 선택하세요</option>{alert.area.split('、').map(a=><option key={a}>{a}</option>)}</select></label>}
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
