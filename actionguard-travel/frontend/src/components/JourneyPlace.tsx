import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {useWorkspace} from '../hooks/workspace';
import {inUSCoverage,inJapanCoverage} from '../features/shelters/coverage';
export default function JourneyPlace(){
 const ws=useWorkspace();
 const preferred=ws.alert?(ws.alert.id.startsWith('jma:')?'JP':'US'):(ws.messageCountry==='JP'?'JP':'US');
 const [name,setName]=useState(ws.place?.name||'');const [country,setCountry]=useState<'US'|'JP'>(ws.place?.country||preferred);
 const [lat,setLat]=useState(ws.place?String(ws.place.lat):'');const [lon,setLon]=useState(ws.place?String(ws.place.lon):'');const [error,setError]=useState('');
 const revision=useRef(0);useEffect(()=>()=>{revision.current++;},[]);
 useEffect(()=>{revision.current++;setName(ws.place?.name||'');setLat(ws.place?String(ws.place.lat):'');setLon(ws.place?String(ws.place.lon):'');setCountry(ws.place?.country||preferred);},[ws.place,preferred]);
 function save(){const p={lat:Number(lat),lon:Number(lon)};if(!lat.trim()||!lon.trim()||!(country==='JP'?inJapanCoverage(p):inUSCoverage(p))){setError('선택한 국가 안의 위치를 지도에서 선택하거나 올바른 좌표를 입력해 주세요.');return;}ws.setPlace({...p,name:name.trim()||'등록한 위치',country});setError('');}
 function locate(){const current=++revision.current;if(!navigator.geolocation){setError('현재 위치를 지원하지 않습니다.');return;}navigator.geolocation.getCurrentPosition(p=>{if(current!==revision.current)return;setLat(String(p.coords.latitude));setLon(String(p.coords.longitude));setName('현재 위치');},()=>{if(current===revision.current)setError('위치 권한을 확인하거나 지도에서 직접 선택하세요.');},{timeout:10000,maximumAge:0});}
 return <section className="panel journey-place" aria-label="공통 위치 등록"><h2>내 위치를 한 번 등록하세요</h2><p>이 위치를 일정·챗봇·주변 시설·길찾기에 함께 사용합니다. 현재 위치와 숙소 위치는 다를 수 있어요.</p>
 {ws.place&&<p className="notice">사용 중: <strong>{ws.place.name}</strong> · {ws.place.country==='JP'?'일본':'미국'} <button onClick={()=>ws.setPlace(null)}>공통 위치 삭제</button></p>}
 <details open={!ws.place}><summary>위치 등록·변경</summary>
 <div className="nav-grid" onChange={()=>{revision.current++;}}><label>위치 국가<select value={country} onChange={e=>setCountry(e.target.value as 'US'|'JP')}><option value="US">미국</option><option value="JP">일본</option></select></label><label>위치 이름<input value={name} maxLength={120} onChange={e=>setName(e.target.value)} placeholder="현재 위치 또는 숙소 이름"/></label></div>
 <div className="toolbar"><button className="button outline" onClick={locate}>현재 위치 불러오기</button><Link className="button outline" to={`/shelters?country=${country}&choose=1`}>지도에서 위치 선택</Link></div>
 <details><summary>좌표 확인·직접 입력</summary><div className="nav-grid"><label>공통 위치 위도<input value={lat} onChange={e=>{revision.current++;setLat(e.target.value);}} type="number" step="any"/></label><label>공통 위치 경도<input value={lon} onChange={e=>{revision.current++;setLon(e.target.value);}} type="number" step="any"/></label></div></details>
 <button className="button primary" onClick={save}>이 위치를 함께 사용</button>{error&&<p role="alert">{error}</p>}</details><p className="muted">이 화면을 새로고침하면 공통 위치·일정이 지워집니다. 저장한 위치를 바꾸면 기존 일정 판정은 초기화됩니다.</p></section>;
}
