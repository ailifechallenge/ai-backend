import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { TabBar } from './components/TabBar'
import { api } from './integrated/services/api'
import Flow from './integrated/pages/Flow'
import Home from './pages/Home'
import Prepare from './pages/Prepare'
import Welcome from './pages/Welcome'
import ResponseGuide from './pages/ResponseGuide'
import {PageHeader} from './components/PageHeader'

const Shelters=lazy(()=>import('./integrated/pages/Shelters'))
const JapanDisasters=lazy(()=>import('./integrated/pages/JapanDisasters'))
const Notifications=lazy(()=>import('./integrated/pages/Notifications'))
const WeatherAlert=lazy(()=>import('./integrated/pages/WeatherAlert'))

export default function App(){
 const location=useLocation()
 const navigate=useNavigate()
 const [started,setStarted]=useState(()=>{try{return localStorage.getItem('ag-design-started')==='yes'}catch{return false}})
 const finishWelcome=()=>{setStarted(true);try{localStorage.setItem('ag-design-started','yes')}catch{/* In-memory fallback. */}}
 const welcome=location.pathname==='/welcome'||(location.pathname==='/'&&!started)
 const health=useQuery({queryKey:['health'],queryFn:()=>api<{ai_configured:boolean;ocr_available:boolean}>('health'),staleTime:30000})
 useEffect(()=>{window.scrollTo?.({top:0,behavior:'instant'})},[location.pathname])
 const task=['/analyze','/chat','/itinerary'].includes(location.pathname)
 const view=location.pathname==='/chat'?'view-chat':location.pathname==='/itinerary'?'view-itinerary':'view-home'
 return <div className={`team-app team-original ${welcome?'is-welcome':''}`}>
  <a href="#main" className="visually-hidden skip-link">본문 바로가기</a>
  {!welcome&&!['/response-guide'].includes(location.pathname)&&!['/','/home','/prepare'].includes(location.pathname)&&<PageHeader backTo={!['/chat','/itinerary'].includes(location.pathname)?'/':undefined} title={location.pathname==='/chat'?'AI 도우미':location.pathname==='/itinerary'?'내 일정과 경보 확인':location.pathname==='/shelters'?'대피 지도':location.pathname==='/notifications'?'관심 지역 · 알림':location.pathname==='/japan-disasters'?'일본 지진 · 쓰나미':'경보 번역 · 행동 확인'} right={<Link to="/notifications" aria-label="알림 설정"><Bell size={20}/></Link>}/> }
  {health.isError&&<div className="connection-note" role="alert">서버에 연결하지 못했어요. <button onClick={()=>void health.refetch()}>다시 연결</button></div>}
  <main id="main">
   <div className={`integrated-feature app ${view}`} hidden={!task}><Flow /></div>
   <Suspense fallback={<p className="page-loading" role="status">화면을 준비하고 있어요…</p>}>
    <Routes>
     <Route path="/" element={welcome?<Welcome onStart={finishWelcome}/>:<Home ocrAvailable={health.data?.ocr_available}/>}/><Route path="/home" element={<Navigate to="/" replace/>}/>
     <Route path="/welcome" element={<Welcome onStart={()=>{finishWelcome();navigate('/')}}/>}/>
     <Route path="/response-guide" element={<ResponseGuide/>}/>
     <Route path="/analyze" element={null}/><Route path="/translate" element={<Navigate to="/analyze" replace/>}/><Route path="/verify" element={<Navigate to="/analyze" replace/>}/><Route path="/guidance" element={<Navigate to="/analyze" replace/>}/>
     <Route path="/chat" element={null}/><Route path="/itinerary" element={null}/><Route path="/schedule" element={<Navigate to="/itinerary" replace/>}/>
     <Route path="/shelters" element={<div className="integrated-feature app map-feature"><Shelters/></div>}/>
     <Route path="/navigation" element={<Navigate to={'/shelters?view=route&'+location.search.slice(1)} replace/>}/>
     <Route path="/japan-disasters" element={<div className="integrated-feature app"><JapanDisasters/></div>}/>
     <Route path="/notifications" element={<div className="integrated-feature app"><Notifications/></div>}/>
     <Route path="/weather-alert" element={<div className="integrated-feature app"><WeatherAlert/></div>}/>
     <Route path="/prepare" element={<Prepare/>}/><Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
   </Suspense>
  </main>
  <p className="app-disclaimer">현지 당국의 최신 지시를 먼저 따르세요.<br/>공식 긴급재난 통보를 대신하지 않습니다.</p>
  {!welcome&&<TabBar/>}
 </div>
}
