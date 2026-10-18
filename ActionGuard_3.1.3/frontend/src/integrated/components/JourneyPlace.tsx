import {lazy,Suspense,useEffect,useState} from 'react';
import PlacePicker from '../features/places/PlacePicker';
import type {JourneyPlace as Place} from '../hooks/journey';
import {useWorkspace} from '../hooks/workspace';
import {inUSCoverage,inJapanCoverage} from '../features/shelters/coverage';
const LocationMap=lazy(()=>import('../features/shelters/ShelterMap'));
export default function JourneyPlace({value,onChoose}:{value?:Place|null;onChoose?:(p:Place)=>void}={}){
 const ws=useWorkspace();
 const current=onChoose?value:ws.place;const choose=onChoose??ws.setPlace;
 const country=ws.country;const [mapOpen,setMapOpen]=useState(false);

 const [lat,setLat]=useState(current?String(current.lat):'');const [lon,setLon]=useState(current?String(current.lon):'');const [error,setError]=useState('');
 const mapPoint=lat.trim()&&lon.trim()&&Number.isFinite(Number(lat))&&Number.isFinite(Number(lon))?{lat:Number(lat),lon:Number(lon)}:null;
 useEffect(()=>{setLat(current?String(current.lat):'');setLon(current?String(current.lon):'');},[current?.lat,current?.lon,country]);
 function save(){const p={lat:Number(lat),lon:Number(lon)};if(!lat.trim()||!lon.trim()||!(country==='JP'?inJapanCoverage(p):inUSCoverage(p))){setError('선택한 국가 안의 위치를 지도에서 선택하거나 올바른 좌표를 입력해 주십시오.');return;}choose({...p,name:current?.lat===p.lat&&current?.lon===p.lon?current.name:'지도에서 선택한 위치',country});setError('');}
 return <section className="panel journey-place" aria-label={onChoose?"일정 장소 등록":"공통 위치 등록"}>
 <PlacePicker onChoose={choose}/><details className="manual-place"><summary>좌표로 직접 등록 (고급)</summary>
 <button type="button" className="button outline manual-map-select" onClick={()=>setMapOpen(v=>!v)}>{mapOpen?'지도 접기':'지도에서 위치 선택'}</button>
 {mapOpen&&<><p className="small-note">지도를 눌러 위치를 선택한 뒤 등록하십시오.</p><Suspense fallback={<p role="status">지도를 준비하고 있습니다…</p>}><LocationMap origin={mapPoint??(country==='JP'?{lat:35.6812,lon:139.7671}:{lat:40.758,lon:-73.9855})} shelters={[]} selected="" route={null} disaster="general" onSelect={()=>{}} onOrigin={p=>{setLat(String(p.lat));setLon(String(p.lon));setError('');}}/></Suspense></>}
 <div className="manual-coordinate-fields"><label>위도<input aria-label={onChoose?"일정 장소 위도":"공통 위치 위도"} value={lat} onChange={e=>setLat(e.target.value)} type="number" step="any" inputMode="decimal"/></label><label>경도<input aria-label={onChoose?"일정 장소 경도":"공통 위치 경도"} value={lon} onChange={e=>setLon(e.target.value)} type="number" step="any" inputMode="decimal"/></label></div>
 <button type="button" className="button outline manual-save" onClick={save}>이 위치 등록하기</button>{error&&<p role="alert">{error}</p>}</details>
 {!onChoose&&ws.place&&<button type="button" className="button ghost shared-location-remove" onClick={()=>ws.setPlace(null)}>등록한 위치 삭제</button>}</section>;
}
