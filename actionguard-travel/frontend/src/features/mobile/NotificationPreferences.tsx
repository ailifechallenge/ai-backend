import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import {api} from '../../services/api';
import {US_STATES,stateLabel,japanRegionLabel,savedRegionLabel,type RegionChoice} from '../regions/labels';
type Choice=RegionChoice;
type Draft={regions:{scope:string;name:string}[];hazards:string[]};
const KEY='actionguard-notification-draft-v1';
function load():Draft{try{const value=JSON.parse(localStorage.getItem(KEY)??'null');if(value&&Array.isArray(value.regions)&&value.regions.length<=10&&value.regions.every((r:unknown)=>!!r&&typeof r==='object'&&'scope' in r&&typeof r.scope==='string'&&/^(US|JP):/.test(r.scope)&&'name' in r&&typeof r.name==='string')&&Array.isArray(value.hazards)&&value.hazards.every((h:unknown)=>typeof h==='string'))return value;}catch{/* Storage may be disabled. */}return {regions:[],hazards:[]};}
export default function NotificationPreferences(){
 const [draft,setDraft]=useState<Draft>(load);const [country,setCountry]=useState('JP');const [region,setRegion]=useState('130000');const [area,setArea]=useState('');const [note,setNote]=useState('');
 const offices=useQuery({queryKey:['japan-areas'],queryFn:()=>api<{areas:Choice[]}>('japan/areas'),enabled:country==='JP',staleTime:3600000,retry:false});
 const validRegion=country==='US'?/^[A-Z]{2}$/.test(region):/^\d{6}$/.test(region);
 const choices=useQuery({queryKey:['push-regions',country,region],queryFn:()=>api<{areas:(Choice&{type:string})[]}>('push/regions?'+new URLSearchParams({country,region})),enabled:validRegion,retry:false,staleTime:3600000});
 const hazards=useQuery({queryKey:['push-hazards'],queryFn:()=>api<{hazards:Choice[]}>('push/hazards'),retry:false,staleTime:3600000});
 function add(){const choice=choices.data?.areas?.find(r=>r.code===area);if(!choice)return;const scope=`${country}:${region}:${area}`;if(draft.regions.some(r=>r.scope===scope))return;if(draft.regions.length>=10){setNote('최대 10개 지역까지 선택할 수 있어요.');return;}setDraft({...draft,regions:[...draft.regions,{scope,name:choice.name}]});setNote('');}
 function save(){if(!draft.regions.length||!draft.hazards.length){setNote('지역과 재난 유형을 하나 이상 선택해 주세요.');return;}try{localStorage.setItem(KEY,JSON.stringify(draft));setNote('이 브라우저에 선택을 저장했어요. 휴대폰 푸시 구독 연결은 아직 완료되지 않았어요.');}catch{setNote('저장 공간을 사용할 수 없어요. 브라우저 설정을 확인하세요.');}}
 return <section className="seismic-card notification-preferences"><h2>어디의 어떤 경보를 볼까요?</h2><p>새 경보·격상·중요 변경·공식 해제를 확인할 지역과 유형을 선택하세요.</p><p className="seismic-muted">현재는 이 브라우저에 선택을 저장하는 단계예요. 서버의 휴대폰 구독을 활성화하는 설정은 아닙니다.</p>
 <label>국가<select value={country} onChange={e=>{setCountry(e.target.value);setRegion(e.target.value==='JP'?'130000':'CA');setArea('');}}><option value="JP">일본</option><option value="US">미국</option></select></label>
 {country==='JP'?<label>도도부현·관할 지역<select value={region} onChange={e=>{setRegion(e.target.value);setArea('');}}>{(offices.data?.areas??[{code:'130000',name:'東京都'}]).map(r=><option key={r.code} value={r.code}>{japanRegionLabel(r)}</option>)}</select></label>:<label>미국 주·특별구·영토<select value={region} onChange={e=>{setRegion(e.target.value);setArea('');}}>{US_STATES.map(s=><option key={s.code} value={s.code}>{stateLabel(s.code)}</option>)}</select></label>}
 <label>{country==='JP'?'시·구·정·촌':'카운티·기상 예보 구역'}<select value={area} onChange={e=>setArea(e.target.value)} disabled={!choices.data||choices.isFetching}><option value="">지역을 선택하세요</option>{choices.data?.areas?.map(r=><option key={r.code} value={r.code}>{country==='JP'?japanRegionLabel(r):r.name} · {r.code}{country==='US'?(r.type==='county'?' (카운티)':' (기상 구역)'):''}</option>)}</select></label>
 {choices.isFetching&&<p role="status">공식 지역 목록을 가져오고 있어요…</p>}{(choices.isError||offices.isError)&&<p role="alert">지역 목록을 가져오지 못했어요. 입력한 지역과 연결을 확인하세요.</p>}{country==='US'&&<p className="seismic-muted">경보 종류에 따라 카운티와 기상 구역이 달라요. 머무는 곳에 해당하는 두 구역을 함께 등록하면 누락을 줄일 수 있어요. 구역 내 모든 위치에 위험이 동일하다는 뜻은 아닙니다.</p>}
 {country==='JP'&&<p className="seismic-muted">한국어는 지명을 읽기 위한 보조 표기예요. 현지 표지와 대조할 수 있도록 일본어 원문을 함께 표시합니다.</p>}
 <button disabled={!area||choices.isFetching} onClick={add}>선택 지역 추가</button>
 <ul className="seismic-region-list">{draft.regions.map(r=><li key={r.scope}><div><Link to={'/weather-alert?'+new URLSearchParams({scope:r.scope})}>{savedRegionLabel(r)} · 현재 경보 보기</Link><button aria-label={r.name+' 삭제'} onClick={()=>setDraft({...draft,regions:draft.regions.filter(x=>x.scope!==r.scope)})}>삭제</button></div></li>)}</ul>
 <fieldset><legend>확인할 기상 재난</legend><div className="notification-hazards">{hazards.data?.hazards?.map(h=><label key={h.code}><input type="checkbox" checked={draft.hazards.includes(h.code)} onChange={e=>setDraft({...draft,hazards:e.target.checked?[...draft.hazards,h.code]:draft.hazards.filter(x=>x!==h.code)})}/>{h.name}</label>)}</div></fieldset>{hazards.isError&&<p role="alert">재난 유형 목록을 가져오지 못했어요.</p>}
 <p className="seismic-muted">일본 지진은 관측 진도 지역·기준 진도, 쓰나미는 해안 예보구를 별도 기준으로 사용합니다.</p><button className="primary" onClick={save}>이 브라우저에 선택 저장</button>{note&&<p role="status">{note}</p>}</section>;
}
