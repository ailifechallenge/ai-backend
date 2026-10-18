import {useState} from 'react'
import {useWorkspace} from '../integrated/hooks/workspace'
export function shopUrl(query:string,point?:{name?:string;country?:string}|null){
 const name=point?.name?.trim();const country=point?.country==='JP'?'Japan':'United States';
 return 'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:name?`${query} near ${name}, ${country}`:`${query} near me`}).toString()
}
export default function SupplyShops(){const ws=useWorkspace();const candidate=ws.place?.country===ws.country?ws.place:null;const point=candidate&&!/^(현재 위치|지도에서 선택한 위치|조회 위치)$/.test(candidate.name)?candidate:null;const [mode,setMode]=useState(point?'saved':'current');const selected=mode==='saved'?point:null;const jp=selected?.country==='JP';
 return <section className="supply-shops"><h3>물품 구매처 찾기</h3><label className="plain-field">검색 기준<select value={selected?'saved':'current'} onChange={e=>setMode(e.target.value)}><option value="current">현재 위치 · Google Maps 기준</option>{point&&<option value="saved">{point.name} 주변</option>}</select></label><div>{[[jp?'スーパー':'supermarket','마트'],[jp?'薬局':'pharmacy','약국'],[jp?'コンビニ':'convenience store','편의점']].map(([q,n])=><a key={q} href={shopUrl(q,selected)} target="_blank" rel="noreferrer">{n} 찾기 ↗</a>)}</div></section>
}
