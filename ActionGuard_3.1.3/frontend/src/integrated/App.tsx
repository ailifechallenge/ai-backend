import { lazy, Suspense, useState, useEffect } from "react";
import { NavLink, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Moon, Shield, Sun, MapPin } from "lucide-react";
const WeatherAlert=lazy(()=>import('./pages/WeatherAlert'));
const Notifications = lazy(() => import("./pages/Notifications"));
const JapanDisasters = lazy(() => import("./pages/JapanDisasters"));
const Shelters = lazy(() => import("./pages/Shelters"));

import Flow from "./pages/Flow";
import {useMobile} from "./features/mobile/MobileRuntime";
import { api } from "./services/api";

export default function App() {
  const location=useLocation();const mobile=useMobile();
  useEffect(()=>{window.scrollTo?.({top:0,behavior:"instant"});},[location.pathname]);
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => api<{ ai_configured: boolean }>("health"),
    retry: false,
  });
  return (
    <div className={"app " + (dark ? "dark" : "")}>
      <a href="#main" className="skip">
        본문 바로가기
      </a>
      <aside>
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Shield />
          </span>
          <span>
            ActionGuard<small>TRAVEL / 2.9</small>
          </span>
        </Link>
        <span className="nav-label">WORKSPACE</span>
        <nav>
          <NavLink to="/" end>
            <Shield size={19} /> 홈
          </NavLink>
          <NavLink to="/japan-disasters">지진 · 쓰나미</NavLink><NavLink to="/itinerary">일정</NavLink><NavLink to="/chat">챗봇</NavLink><NavLink to="/shelters"><MapPin size={19} /> 대피 · 지도</NavLink>
        </nav>
        <div className="side-bottom">
          <div className="mini-shield">
            <Shield size={26} />
          </div>
          <strong>공식 근거에서 시작합니다.</strong>
          <p>
            공식 경보 원문과 AI 설명을
            <br />
            항상 구분해 확인하십시오.
          </p>
          <a href="https://www.weather.gov/" target="_blank" rel="noreferrer">
            NWS · 미국 기상청 <ArrowUpRight size={14} />
          </a>
          <a href="https://www.jma.go.jp/bosai/map.html?area_type=japan" target="_blank" rel="noreferrer">
            JMA · 일본 기상청 <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
      <div className="main-shell">
        <header>
          <span>미국·일본 여행 안전 워크스페이스</span>
          <div>
            <Link className="notification-link" to="/notifications">알림{mobile?.rows.length?` ${mobile.rows.length}`:""}</Link>
            <span className="connection">
              ●{" "}
              {health.isPending
                ? "서버 연결 중"
                : health.isError
                  ? "서버 연결 필요"
                  : health.data?.ai_configured
                    ? "AI 연결 설정 완료"
                    : "AI 키 설정 필요"}
            </span>
            <button
              className="theme"
              aria-label="테마 전환"
              onClick={() =>
                setDark((v) => {
                  localStorage.setItem("theme", v ? "light" : "dark");
                  return !v;
                })
              }
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>
        <main id="main">
          <div className={location.pathname==='/chat'?'view-chat':location.pathname==='/itinerary'?'view-itinerary':'view-home'} hidden={!["/","/chat","/itinerary"].includes(location.pathname)}><Flow /></div>
          <Suspense fallback={<p role="status">지도를 불러오고 있습니다…</p>}>
          <Routes>
            <Route path="/" element={null} />
            <Route path="/weather-alert" element={<WeatherAlert />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/japan-disasters" element={<JapanDisasters />} />
            <Route path="/shelters" element={<Shelters />} />
            <Route path="/navigation" element={<Navigate to={"/shelters?view=route&"+location.search.slice(1)} replace />} /><Route path="/chat" element={null}/><Route path="/itinerary" element={null}/>
            <Route path="/analyze" element={<Navigate to="/" replace />} />
            <Route path="/translate" element={<Navigate to="/" replace />} />
            <Route path="/verify" element={<Navigate to="/" replace />} />
            <Route path="/guidance" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
          <footer>
            ActionGuard Travel · 비공식 정보 지원 서비스
            <br />
            실시간 긴급재난 통보를 대체하지 않습니다. 현지 당국의 최신 지시를
            따르십시오.
          </footer>
        </main>
      </div>
    </div>
  );
}
