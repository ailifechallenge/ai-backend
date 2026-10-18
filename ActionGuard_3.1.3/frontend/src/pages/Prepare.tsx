import SupplyShops from '../components/SupplyShops'
import {useState} from 'react'
import {ButtonLink} from '../components/Button'
import styles from './Prepare.module.css'
import {Card,PageBody} from '../components/Card'
import {HeaderActions} from '../components/CountrySwitch'
import {PageHeader} from '../components/PageHeader'
import {useWorkspace} from '../integrated/hooks/workspace'

const supplies=['물','보조배터리','상비약','손전등','여권 사본','비상 연락처']
const localSupplies:Record<string,string[]>={US:['Drinking water','Portable charger','Personal medication','Flashlight','Passport copy','Emergency contacts'],JP:['飲料水','モバイルバッテリー','常備薬','懐中電灯','パスポートのコピー','緊急連絡先']}
const legacySupplies:Record<string,string[]>={'물 · Bottled water · 飲料水':['물'],'보조배터리 · Portable charger · モバイルバッテリー':['보조배터리'],'상비약 · 개인 복용약':['상비약'],'손전등 · 여권 사본 · 비상 연락처':['손전등','여권 사본','비상 연락처']}

export default function Prepare(){
 const ws=useWorkspace();const [tab,setTab]=useState('supplies');const country=ws.country
 const [checked,setChecked]=useState<string[]>(()=>{try{const value:unknown=JSON.parse(localStorage.getItem('ag-team-supplies')||'[]');return Array.isArray(value)?[...new Set(value.flatMap(item=>typeof item==='string'?(legacySupplies[item]??(supplies.includes(item)?[item]:[])):[]))]:[]}catch{return []}})
 const toggle=(name:string)=>{const next=checked.includes(name)?checked.filter(x=>x!==name):[...checked,name];setChecked(next);try{localStorage.setItem('ag-team-supplies',JSON.stringify(next))}catch{/* Checklist remains usable in memory. */}}
 return <><PageHeader title="대비" right={<HeaderActions/>}/><PageBody><div className={styles.segment} role="tablist" aria-label="대비 메뉴">{[['supplies','사전 대비 물품'],['sos','SOS 카드'],['official','행동지침']].map(([key,label])=><button className={`${styles.segItem} ${tab===key?styles.segActive:''}`} key={key} role="tab" aria-selected={tab===key} onClick={()=>setTab(key)}>{label}</button>)}</div>
 {tab==='official'?<Card title="공식 행동 카드"><ul className="official-action-summary"><li>현재 위치에 해당하는 공식 경보를 선택하십시오.</li><li>경보의 대상 지역과 유효시간을 확인하십시오.</li><li>원문의 행동지시와 현지 당국의 최신 안내를 따르십시오.</li></ul><ButtonLink block to="/analyze">공식 행동지침 확인하기</ButtonLink></Card>:tab==='supplies'?<><Card title="사전 대비 물품"><p className="supply-progress" role="status">{checked.length} / {supplies.length}개 준비 완료</p><progress className="supply-progress-bar" value={checked.length} max={supplies.length} aria-label="비상 준비물 준비 현황"/><div className="supplies-list">{supplies.map((name,i)=><label key={name}><input type="checkbox" aria-label={name} checked={checked.includes(name)} onChange={()=>toggle(name)}/><span className={styles.supplyText}><strong className={styles.supplyKo}>{name}</strong><small className={styles.supplyEn} lang={country==='JP'?'ja':'en'}>{localSupplies[country][i]}</small></span></label>)}</div><SupplyShops/></Card><Card variant="info" title="SOS 카드 미리보기"><p lang={country==='JP'?'ja':'en'}>{country==='JP'?'助けてください。救急車を呼んでください。':'I need emergency help. Please call 911.'}</p><p className="small-muted">긴급한 도움이 필요합니다. 응급 도움을 요청해 주십시오.</p><button className="design-text-link sos-open" onClick={()=>setTab('sos')}>SOS 카드 크게 보기 →</button></Card></>:<><Card title="현지어로 도움 요청"><p className="sos-phrase" lang={country==='JP'?'ja':'en'}>{country==='JP'?'助けてください。救急車を呼んでください。':'I need emergency help. Please call 911.'}</p><p>긴급한 도움이 필요합니다. 응급 도움을 요청해 주십시오.</p></Card><Card title="긴급 연락"><div className="sos-contact-actions">{country==='JP'?<><a href="tel:119">일본 구급·소방 119</a><a href="tel:110">일본 경찰 110</a></>:<a href="tel:911">미국 긴급 911</a>}<a href="tel:+82232100404">영사안전콜센터</a></div></Card></>}
 </PageBody></>
}
