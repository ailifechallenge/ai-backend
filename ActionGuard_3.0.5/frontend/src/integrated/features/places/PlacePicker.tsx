import {lazy,Suspense,useEffect,useRef,useState} from 'react'
import type {JourneyPlace} from '../../hooks/journey'
import {api} from '../../services/api'
import {timezoneLabel} from './timezone'
import {inUSCoverage,inJapanCoverage} from '../shelters/coverage'
const Map=lazy(()=>import('../shelters/ShelterMap'))
const EMPTY:never[]=[]
type Candidate={location:JourneyPlace;label:string;approximate:boolean;source:string}
type Metadata={region_code?:string|null;region_name?:string|null;timezone:string|null;source:string|null;warning:string|null}
export default function PlacePicker({initialCountry='US',onChoose}:{initialCountry?:'US'|'JP';onChoose:(p:JourneyPlace)=>void}){
 const [country,setCountry]=useState(initialCountry),[q,setQ]=useState(''),[rows,setRows]=useState<Candidate[]>([]),[picked,setPicked]=useState<Candidate|null>(null),[meta,setMeta]=useState<Metadata|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[locating,setLocating]=useState(false)
 const generation=useRef(0);useEffect(()=>()=>{generation.current++},[])
 async function metadata(candidate:Candidate){const n=++generation.current;setPicked(candidate);setMeta(null);setError('');setBusy(true);try{const value=await api<Metadata>('places/metadata',candidate.location);if(n===generation.current)setMeta(value)}catch(e){if(n===generation.current){setMeta(null);setError(e instanceof Error?e.message:'위치를 확인하지 못했어요. 다시 선택해 주세요.')}}finally{if(n===generation.current)setBusy(false)}}
 async function search(){const n=++generation.current;setBusy(true);setError('');setPicked(null);setRows([]);try{const data=await api<{candidates:Candidate[]}>(`places/search?${new URLSearchParams({country,q:q.trim()})}`);if(n!==generation.current)return;setRows(data.candidates);if(!data.candidates.length)setError('찾은 장소가 없어요. 도시명과 숙소 이름을 함께 입력하거나 영문·일본어 이름으로 검색해 주세요.')}catch(e){if(n===generation.current)setError(e instanceof Error?e.message:String(e))}finally{if(n===generation.current)setBusy(false)}}
 function current(){if(!navigator.geolocation){setError('현재 위치를 지원하지 않아요. 장소 이름으로 검색하세요.');return}const n=++generation.current;setLocating(true);setError('');navigator.geolocation.getCurrentPosition(p=>{if(n!==generation.current)return;setLocating(false);const point={lat:p.coords.latitude,lon:p.coords.longitude};const actual=inJapanCoverage(point)?'JP':inUSCoverage(point)?'US':null;if(!actual){setError('현재는 미국·일본 위치만 지원해요. 도시나 숙소 이름을 검색하세요.');return}setCountry(actual);void metadata({location:{country:actual,name:'현재 위치',...point},label:'기기에서 확인한 현재 위치',approximate:false,source:'기기 위치 서비스'})},()=>{if(n===generation.current){setLocating(false);setError('위치 권한을 확인하거나 장소 이름으로 검색하세요.')}},{timeout:12000,maximumAge:0})}
 return <section className="place-picker" aria-label="장소 이름으로 등록">
 <div className="place-search-country"><label>조회 국가<select value={country} disabled={busy||locating} onChange={e=>{generation.current++;setCountry(e.target.value as 'US'|'JP');setRows([]);setPicked(null);setMeta(null);setError('')}}><option value="US">미국</option><option value="JP">일본</option></select></label><button type="button" className="button outline" disabled={busy||locating} onClick={current}>{locating?'위치 확인 중…':'현재 위치 사용'}</button></div>
 <form onSubmit={e=>{e.preventDefault();if(q.trim().length>=2)void search()}}><label>도시·숙소·장소 이름<input value={q} maxLength={120} disabled={locating} onChange={e=>{generation.current++;setBusy(false);setQ(e.target.value);setRows([]);setPicked(null);setMeta(null)}} placeholder={country==='JP'?'예: 도쿄역, 신주쿠 호텔 이름':'예: 뉴욕, 시카고 호텔 이름'}/></label><button className="button primary" disabled={busy||locating||q.trim().length<2}>{busy?'확인 중…':'장소 검색'}</button></form>
 <p className="small-note">검색어는 지도 검색 서비스에 전송됩니다. 이름·방 번호 같은 개인정보는 적지 마세요.</p>
 {error&&<p role="alert" className="error">{error}</p>}
 {!!rows.length&&!picked&&<div className="place-candidates" aria-label="검색된 장소">{rows.map((row,i)=><button type="button" key={i} onClick={()=>void metadata(row)}><strong>{row.label}</strong><small>{row.approximate?'도시·지역 대표점 · 지도에서 확인':'장소 위치 · 지도에서 확인'} →</small></button>)}</div>}
 {picked&&<div className="place-confirm"><h3>이 위치가 맞나요?</h3><p>{picked.label}</p>{picked.approximate&&<p className="notice">도시·지역의 대표점이에요. 정확한 숙소 위치가 아닐 수 있어요. 지도를 눌러 기준점을 수정할 수 있어요.</p>}
 <Suspense fallback={<p role="status">지도를 준비하고 있어요…</p>}><Map origin={picked.location} shelters={EMPTY} selected="" route={null} disaster="general" onSelect={()=>{}} onOrigin={point=>void metadata({...picked,location:{...picked.location,...point},label:picked.label,approximate:false})}/></Suspense>
 <p className="small-note">지도에서 선택한 기준점이며 현재 GPS 위치를 뜻하지 않아요. 지도 배경: OpenStreetMap.</p>
 {busy?<p role="status">좌표와 현지 시간대를 확인하고 있어요…</p>:meta?.warning?<p role="status">{meta.warning}</p>:meta?.timezone&&<p className="small-note">현지 시간대 자동 확인 · {timezoneLabel(meta.timezone)}</p>}
 <button type="button" className="button primary" disabled={busy||!meta} onClick={()=>onChoose({...picked.location,approximate:picked.approximate,source:picked.source,timezone:meta?.timezone??null,...(meta?.region_code&&meta?.region_name?{regionCode:meta.region_code,regionName:meta.region_name}:{})})}>이 위치 등록하기</button><button type="button" className="button outline" onClick={()=>{generation.current++;setBusy(false);setPicked(null);setMeta(null)}}>다른 장소 선택</button>
 </div>}
 </section>
}
