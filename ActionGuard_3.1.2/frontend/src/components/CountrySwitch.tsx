import {useEffect,useRef,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ChevronDown,Check,Globe2,Bell} from 'lucide-react'
import {Link} from 'react-router-dom'
import {useWorkspace} from '../integrated/hooks/workspace'
const COUNTRIES=[{code:'US',name:'미국',agency:'NWS 공식 경보'},{code:'JP',name:'일본',agency:'JMA 기상 · 지진 · 화산'}] as const
export function CountrySwitch(){const ws=useWorkspace(),navigate=useNavigate();const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null),button=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(!ref.current?.contains(e.target as Node))setOpen(false)};const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}};document.addEventListener('pointerdown',close);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',key)}},[open]);
 const current=COUNTRIES.find(c=>c.code===ws.country)!;
 return <div className="country-picker" ref={ref}><button ref={button} className="country-trigger" type="button" aria-label={`서비스 국가 선택 · 현재 ${current.name}`} aria-expanded={open} aria-controls="service-country-options" onClick={()=>setOpen(!open)}><Globe2 size={16}/><span>{current.name}</span><ChevronDown size={13}/></button>{open&&<div className="country-options" id="service-country-options" role="group" aria-label="서비스 국가 선택"><strong>어느 나라의 정보를 볼까요?</strong>{COUNTRIES.map(c=><button key={c.code} type="button" aria-pressed={ws.country===c.code} onClick={()=>{setOpen(false);button.current?.focus();if(ws.country!==c.code){ws.setCountry(c.code);navigate('/')}}}><span>{c.name}<small>{c.agency}</small></span>{ws.country===c.code&&<Check size={18}/>}</button>)}<p>선택한 국가에 맞는 공식 정보를 보여드려요.</p></div>}</div>
}
export function HeaderActions(){return <div className="header-actions"><CountrySwitch/><Link className="header-bell" to="/notifications" aria-label="알림 설정"><Bell size={22}/></Link></div>}
