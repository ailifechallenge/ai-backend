import {alertName} from '../../components/AlertIdentity';
import {Link,useLocation} from "react-router-dom";
import {US_STATES,stateLabel,japanRegionLabel,japaneseAreaLabel,type RegionChoice} from "../features/regions/labels";
import "./JapanDisasters.css";
import { useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  FileImage,
  LoaderCircle,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import MessageOverview from "../components/MessageOverview";
import TravelAssistant from "../components/TravelAssistant";
import { api, upload } from "../services/api";
import { useWorkspace } from "../hooks/workspace";
import type { Alert, Guidance, Translation, Verification, UrgencyAssessment } from "../types";
import { ErrorBox, Panel, Time } from "../components/Common";
import { Button } from "../components/ui/button";

const SAMPLE = `DEMO ONLY — FICTIONAL ALERT. NOT ACTIVE.\nFlash Flood Warning for Example County until 6 PM.\nResidents near the Example River should move to higher ground immediately.\nDo not drive through flooded roads. Avoid low-water crossings.`;
const PHASES = ["원문 확인", "한국어 번역", "내용 정리", "행동지침"] as const;
type Phase = 0 | 1 | 2 | 3 | 4;

function issueSummary(kind: string, reason: string) {
  const summaries: Record<string, string> = {
    issued_time: "발표 시각이 원문과 다르게 번역됐어요.",
    message_expiration: "메시지 만료 시각이 원문과 다르게 번역됐어요.",
    start_time: "시작 시각 또는 시간대가 원문과 다르게 번역됐어요.",
    end_time: "종료 시각 또는 시간대가 원문과 다르게 번역됐어요.",
    level: "경보 단계가 원문과 다르게 번역됐어요.",
    area: "경보 적용 지역이 원문과 다르게 번역됐어요.",
    required_action: "필수 행동이 원문과 다르게 번역됐어요.",
    recommended_action: "권고 행동이 원문과 다르게 번역됐어요.",
    prohibition: "금지 행동의 의미가 원문과 다르게 번역됐어요.",
    number_unit: "숫자나 단위가 원문과 다르게 번역됐어요.",
    negation: "부정 표현이 원문과 반대로 번역됐어요.",
    condition: "행동이 적용되는 조건이 원문과 다르게 번역됐어요.",
    audience: "경보 대상이 원문과 다르게 번역됐어요.",
    hazard: "재난 종류가 원문과 다르게 번역됐어요.",
  };
  return summaries[kind] ?? reason.split(/(?<=[.!?。])\s*/u)[0] ?? reason;
}

export default function Flow() {
  const ws = useWorkspace();
  const capabilities=useQuery({queryKey:['health'],queryFn:()=>api<{ocr_available?:boolean}>('health'),staleTime:30000,retry:false});
  const ocrUnavailable=capabilities.data?.ocr_available===false;
  const flowLocation = useLocation();
  useEffect(() => { if(flowLocation.pathname === "/analyze") setSourceTab(new URLSearchParams(flowLocation.search).get("mode")==="alerts"?"nws":"paste"); },[flowLocation.pathname,flowLocation.search]);
  useEffect(() => {if(ws.place){setCountry(ws.place.country);setLat(String(ws.place.lat));setLon(String(ws.place.lon));}setQuery('');setAlertFilter('');},[ws.place?.country,ws.place?.lat,ws.place?.lon]);
  const revisionRef = useRef(ws.revision);
  revisionRef.current = ws.revision;
  const [sourceTab, setSourceTab] = useState<"paste" | "nws">(new URLSearchParams(window.location.search).get("mode")==="alerts"?"nws":"paste");
  const {messageCountry,setMessageCountry}=ws;
  const [country, setCountry] = useState<"US" | "JP">(ws.place?.country ?? "US");
  const [office, setOffice] = useState("130000");
  const [regionMode, setRegionMode] = useState<"area" | "point">("point");
  const [area, setArea] = useState("CA");
  const [lat, setLat] = useState(ws.place?String(ws.place.lat):"");
  const [lon, setLon] = useState(ws.place?String(ws.place.lon):"");
  const [alertFilter, setAlertFilter] = useState("");
  const [locationNote, setLocationNote] = useState("");
  const [query, setQuery] = useState("");
  useEffect(()=>{setQuery("");},[country,regionMode,area,office,lat,lon]);
  const [phase, setPhase] = useState<Phase>(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState<Translation | null>(ws.translation);
  const [verification, setVerification] = useState<Verification | null>(ws.verification);
  const [guidance, setGuidance] = useState<Guidance | null>(ws.guidance);
  const assessmentClient=useQueryClient();
  const [urgency, setUrgency] = useState<UrgencyAssessment | null>(ws.urgency);
  useEffect(()=>{setUrgency(ws.urgency)},[ws.urgency]);
  const [urgencyError, setUrgencyError] = useState("");
  const [urgencyAiPending, setUrgencyAiPending] = useState(false);
  const [ocrNote, setOcrNote] = useState("");
  const result = useQuery({
    queryKey: ["alerts", query],
    queryFn: () => api<{ alerts: Alert[]; checked_at: string }>(query),
    enabled: !!query,
    retry: false,
    staleTime: 120000,
  });
  const japanAreas = useQuery({
    queryKey: ["japan-areas"],
    queryFn: () => api<{ areas: RegionChoice[] }>("japan/areas"),
    enabled: sourceTab === "nws" && country === "JP",
    retry: false,
    staleTime: 3600000,
  });

  function resetResults() {
    setPhase(0);
    setTranslation(null);
    setVerification(null);
    setGuidance(null);
    setUrgency(null);
    setUrgencyError("");
    setUrgencyAiPending(false);
    setError("");
    setOcrNote("");
  }
  // External notification handoffs change the workspace without using this input.
  useEffect(() => { resetResults();setTranslation(ws.translation);setVerification(ws.verification);setGuidance(ws.guidance);setUrgency(ws.urgency);setBusy(false); }, [ws.revision]);
  function changeText(value: string) {
    ws.update(value);
    resetResults();
  }
  async function analyze() {
    const source = ws.text;
    if (!source.trim() || busy) return;
    const revision = revisionRef.current;
    const alertId = ws.alert?.id;
    const inputCountry = ws.alert ? (alertId?.startsWith("jma:") ? "JP" : "US") : messageCountry;
    setBusy(true);
    setError("");
    setTranslation(null);
    setVerification(null);
    setGuidance(null);
    setUrgency(null);
    setUrgencyError("");
    setUrgencyAiPending(false);
    setPhase(1);
    let analysisComplete = false;
    const urgencyBody = {text:source, alert_id:alertId, country:inputCountry};
    const urgencyReady = api<UrgencyAssessment>("urgency", {...urgencyBody, use_ai:false})
      .then(async value => {
        if (revisionRef.current !== revision) return;
        setUrgency(value);ws.setUrgency(value,revision);
        if (value.inactive) return;
        setUrgencyAiPending(true);
        try {
          const key=['alert-ai-assessment',alertId,source,inputCountry];
          const refined = await assessmentClient.fetchQuery({queryKey:key,queryFn:()=>api<UrgencyAssessment>("urgency", {...urgencyBody, use_ai:true}),staleTime:assessmentClient.getQueryData<UrgencyAssessment>(key)?.method==='ai'?300000:0});
          if (revisionRef.current === revision) {setUrgency(refined);ws.setUrgency(refined,revision);}
        } catch {
          if (revisionRef.current === revision) setUrgency({...value, method:'rules_fallback', method_note:'AI 연결을 완료하지 못해 기본 판정을 유지했어요.'});
        } finally {
          if (revisionRef.current === revision) setUrgencyAiPending(false);
        }
      })
      .catch(() => { if (revisionRef.current === revision) setUrgencyError("대응 단계를 확인하지 못했어요. 원문의 행동 지시를 확인하세요."); });
    // General guidance must remain available even when AI is unavailable.
    const advice = api<Guidance>("guidance", { text: source, alert_id: alertId, country: inputCountry })
      .then((advised) => {
        if (revisionRef.current === revision) {setGuidance(advised);ws.setGuidance(advised,revision);}
        return true;
      })
      .catch((e: unknown) => {
        if (revisionRef.current === revision)
          setError((previous) => [previous, `행동지침: ${e instanceof Error ? e.message : String(e)}`].filter(Boolean).join(" "));
        return false;
      });
    try {
      const translated = await api<Translation>("translate", {
        text: source,
        alert_id: alertId,
        country: inputCountry,
      });
      if (revisionRef.current !== revision) return;
      setTranslation(translated);
      ws.setTranslation(translated, revision);
      setPhase(2);
      const verified = await api<Verification>("verify", {
        text: source,
        translation: translated.translation,
        displayed: {
          summary: translated.summary.join("\n"),
          hazard_explanation: translated.hazard_explanation,
          instruction_translation_ko: translated.instruction_translation_ko ?? "",
          glossary: translated.glossary.map(g => `${g.term}: ${g.meaning}`).join("\n"),
        },
        alert_id: alertId,
        country: inputCountry,
      });
      if (revisionRef.current !== revision) return;
      setVerification(verified);
      ws.setVerification(verified, revision);
      setPhase(3);
      analysisComplete = true;
    } catch (e) {
      if (revisionRef.current === revision)
        setError((previous) => [previous, e instanceof Error ? e.message : String(e)].filter(Boolean).join(" "));
    } finally {
      await urgencyReady;
      const adviceReady = await advice;
      if (revisionRef.current === revision && analysisComplete && adviceReady) setPhase(4);
      if (revisionRef.current === revision) setBusy(false);
    }
  }
  const automaticAnalysis=useRef<number|null>(null);
  useEffect(()=>{
    if(flowLocation.pathname!=='/analyze'||new URLSearchParams(flowLocation.search).get('mode')!=='result'||!ws.alert||!ws.text||ws.translation||busy||automaticAnalysis.current===ws.revision)return;
    automaticAnalysis.current=ws.revision;
    void analyze();
  },[flowLocation.pathname,flowLocation.search,ws.revision,busy]);
  async function readImage(file?: File) {
    if (!file) return;
    const revision = revisionRef.current;
    resetResults();
    setBusy(true);
    try {
      const response = await upload(file);
      if (revisionRef.current !== revision) return;
      changeText(response.text);
      setOcrNote(response.note);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (revisionRef.current === revision) setBusy(false);
    }
  }
  function searchAlerts(e: React.FormEvent) {
    e.preventDefault();
    const nextQuery = country === "JP"
      ? `japan/alerts?office=${encodeURIComponent(office)}`
      : "alerts?" + (regionMode === "area"
        ? `area=${encodeURIComponent(area)}`
        : new URLSearchParams({ lat, lon }).toString());
    if (nextQuery === query) void result.refetch();
    else setQuery(nextQuery);
  }

  function useMyLocation() {
    setLocationNote("");
    if (!navigator.geolocation) {
      setLocationNote("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude.toFixed(4));
        setLon(coords.longitude.toFixed(4));
        setLocationNote("현재 좌표를 입력했어요. 경보 찾기를 눌러 확인하세요.");
      },
      () => setLocationNote("위치를 가져오지 못했어요. 브라우저 권한을 확인하거나 좌표를 직접 입력하세요."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }
  const visibleAlerts = (result.data?.alerts ?? []).filter((alert) =>
    `${alertName(alert.event)} ${alert.event} ${alert.headline} ${alert.area} ${country==="JP"?japaneseAreaLabel(alert.area):""}`
      .toLocaleLowerCase()
      .includes(alertFilter.trim().toLocaleLowerCase()),
  );
  const confirmedIssues = verification?.issues.filter((issue) => issue.severity === "critical") ?? [];
  const hasFindings = confirmedIssues.length > 0;
  const sourceLabel = ws.demo
    ? "가상 예시 · 실제 발령 경보 아님"
    : ws.alert
      ? ws.alert.sender.includes("JMA") ? "일본 기상청 공식 경보" : "NWS API 공식 경보"
      : "직접 입력 · 발령 여부 미확인";

  return (
    <div className="flow-page">
      <Link to="/japan-disasters" className="seismic-home-entry"><span>일본 지진 · 쓰나미 지도<small>진앙, 관측 진도와 해안별 경보 · AI 키 없이 확인</small></span><span aria-hidden="true">→</span></Link>
      <div className="input-intro" hidden={!!translation||!!guidance}><div className="flow-intro">
        <span className="flow-mark">
          <Shield size={21} />
        </span>
        <span className="eyebrow">ACTIONGUARD · 미국·일본 여행 안전</span>
      </div>
      <h1>
        경보를 이해하고,
        <br className="mobile-break" /> 다음 행동까지.
      </h1>
      <p className="lead">
        영어·일본어 문자에서 지금 필요한 내용만 확인하세요.
      </p>

      </div>
      <div hidden={!busy} className="flow-steps" aria-label="분석 진행 상태">
        {PHASES.map((label, index) => {
          const n = index + 1;
          const done = [phase > 0, !!translation, !!verification, !!guidance][index];
          const active = busy && !done && (n === 2 || (n === 3 && !!translation) || n === 4);
          return (
            <div
              className={`flow-step ${done ? "done" : ""} ${active ? "active" : ""}`}
              key={label}
            >
              <span className="step-icon">
                {done ? (
                  <Check size={14} />
                ) : active ? (
                  <LoaderCircle size={14} className="spin" />
                ) : (
                  n
                )}
              </span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {urgencyError && <p className="urgency-load-error" role="status">{urgencyError}</p>}
      {(translation||guidance||urgency)&&<MessageOverview aiPending={urgencyAiPending} urgency={urgency} translation={translation} guidance={guidance} verification={verification} busy={busy}/>}
      <details className="input-disclosure" open={!translation&&!guidance}><summary>받은 문자 확인·다시 분석</summary>
      <Panel className="source-panel">
        <div className="source-heading">
          <div>
            <span className="step-kicker">STEP 01</span>
            <h2>{sourceTab==="nws"?"공식 경보를 찾아보세요":"받은 문자를 붙여넣어 주세요"}</h2>
          </div>
          <span className={`source-badge ${ws.alert ? "official" : ""}`}>
            {sourceLabel}
          </span>
        </div>
        <div className="segmented" role="tablist" aria-label="경보 입력 방법">
          <button
            role="tab"
            aria-selected={sourceTab === "paste"}
            className={sourceTab === "paste" ? "selected" : ""}
            onClick={() => setSourceTab("paste")}
          >
            문자 붙여넣기
          </button>
          <button
            role="tab"
            aria-selected={sourceTab === "nws"}
            className={sourceTab === "nws" ? "selected" : ""}
            onClick={() => setSourceTab("nws")}
          >
            공식 경보 찾기
          </button>
        </div>

        {sourceTab === "nws" && (
          <div className="nws-picker">
            <label className="country-select">
              여행 국가
              <select value={country} disabled={busy} onChange={(e) => {
                const next = e.target.value as "US" | "JP";
                setCountry(next);
                setQuery("");
                setAlertFilter("");
                ws.update("");
                resetResults();
                setError("");
              }}>
                <option value="US">미국</option>
                <option value="JP">일본</option>
              </select>
            </label>
            <form onSubmit={searchAlerts} className="search-form">
              {country === "JP" ? (
                <label>
                  일본 기상청 관할 지역
                  <select value={office} onChange={(e) => setOffice(e.target.value)} required>
                    {(japanAreas.data?.areas ?? []).map((a) => (
                      <option value={a.code} key={a.code}>{japanRegionLabel(a)}</option>
                    ))}
                  </select>
                </label>
              ) : <>
              <label>
                조회 방식
                <select
                  value={regionMode}
                  onChange={(e) =>
                    setRegionMode(e.target.value as "area" | "point")
                  }
                >
                  <option value="point">위도 · 경도</option>
                  <option value="area">미국 주 전체</option>
                </select>
              </label>
              {regionMode === "area" ? (
                <label>
                  미국 주·특별구·영토
                  <select value={area} required onChange={e=>setArea(e.target.value)}>{US_STATES.map(s=><option key={s.code} value={s.code}>{stateLabel(s.code)}</option>)}</select>
                </label>
              ) : (
                <>
                  <div className="location-tools">
                    <Button type="button" variant="outline" onClick={useMyLocation}>
                      현재 위치 사용
                    </Button>
                    <span>좌표에 적용되는 NWS 경보를 찾아요. 반경 검색은 지원하지 않습니다.</span>
                  </div>
                  <label>
                    위도
                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                    />
                  </label>
                  <label>
                    경도
                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      required
                      value={lon}
                      onChange={(e) => setLon(e.target.value)}
                    />
                  </label>
                </>
              )}
              </>}
              <Button disabled={result.isFetching}>
                <Search size={16} />
                {result.isFetching ? "조회 중" : "경보 찾기"}
              </Button>
            </form>
            {country === "JP" && <p className="location-note">일본 기상청 관할 지역의 기상 경보·주의보를 조회합니다. 표시 지역은 시정촌 단위이며, 지진·쓰나미 실시간 경보는 이 조회에 포함되지 않습니다.</p>}
            {country === "JP" && japanAreas.isError && <ErrorBox error={japanAreas.error} />}
            {locationNote && <p className="location-note" role="status">{locationNote}</p>}
            {country === "US" && regionMode === "area" && (
              <p className="location-note">주 전체 경보를 조회합니다. 내 주변 경보만 보려면 위도·경도를 사용하세요.</p>
            )}
            <ErrorBox error={result.error} />
            {result.data && (
              <div className="nws-results">
                <div className="section-head">
                  <strong>조회 결과 {result.data.alerts.length}건</strong>
                  <span className="muted">
                    조회 <Time value={result.data.checked_at} />
                  </span>
                </div>
                {result.data.alerts.length > 3 && (
                  <label className="alert-filter">
                    경보 좁혀보기
                    <input value={alertFilter} onChange={(e) => setAlertFilter(e.target.value)} placeholder="예: Flood, County" />
                  </label>
                )}
                {result.data.alerts.length ? (
                  visibleAlerts.map((a) => (
                    <button
                      className={`alert-option ${ws.alert?.id === a.id ? "chosen" : ""}`}
                      key={a.id}
                      disabled={busy}
                      onClick={() => {
                        ws.update(a.text, a);
                        resetResults();
                      }}
                    >
                      <span className="alert-option-main">
                        <strong>{alertName(a.event)}</strong><small>{a.event}</small>
                        <small>
                          {country==='JP'?japaneseAreaLabel(a.area):a.area}
                        </small>
                      </span>
                      <span className={`severity ${a.severity}`}>
                        {({ Extreme: "매우 심각", Severe: "심각", Moderate: "보통", Minor: "낮음", Unknown: "주의" } as Record<string, string>)[a.severity] || a.severity}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="muted">
                    활성 경보가 없습니다. 위험이 없다는 뜻은 아닙니다.
                  </p>
                )}
                {result.data.alerts.length > 0 && visibleAlerts.length === 0 && (
                  <p className="muted">검색어와 일치하는 경보가 없습니다.</p>
                )}
                {country === "US" && regionMode === "point" && visibleAlerts.length > 0 && (
                  <p className="location-note">입력한 좌표에 적용되는 경보 결과입니다. 경보별 적용 지역도 함께 확인하세요.</p>
                )}
              </div>
            )}
          </div>
        )}

        {ws.alert && (
          <div className="selected-alert">
            <div>
              <strong>{ws.alert.headline}</strong>
              <p>
                {ws.alert.sender} · {ws.alert.severity} · {ws.alert.id.startsWith('jma:')?japaneseAreaLabel(ws.alert.area):ws.alert.area}
              </p>
              <p className="muted">
                발효 <Time value={ws.alert.effective} /> · 메시지 만료{" "}
                <Time value={ws.alert.expires} />
              </p>
            </div>
            <a
              href={ws.alert.source}
              target="_blank"
              rel="noreferrer"
              aria-label="공식 경보 원문 열기"
            >
              <ExternalLink size={17} />
            </a>
          </div>
        )}
        <label htmlFor="flow-source" className="sr-only">
          경보 원문
        </label>
        {!ws.alert && <label className="country-select">문자를 받은 국가
          <select value={messageCountry} disabled={busy} onChange={e => { setMessageCountry(e.target.value as typeof messageCountry); resetResults(); }}>
            <option value="unknown">모르겠어요</option><option value="US">미국</option><option value="JP">일본</option>
          </select>
        </label>}
        <textarea
          id="flow-source"
          className="source-textarea"
          value={ws.text}
          maxLength={16000}
          disabled={busy}
          onChange={(e) => changeText(e.target.value)}
          placeholder="받은 경보 문자를 여기에 붙여넣어 주세요. 영어·일본어 원문을 그대로 입력하면 더 정확하게 확인할 수 있어요."
        />
        <div className="source-meta">
          <span>{ws.text.length.toLocaleString()} / 16,000</span>
          <span>전화번호 등 개인정보는 가린 뒤 입력하세요.</span>
        </div>
        {ocrNote && (
          <p className="ocr-note" role="status">
            {ocrNote}
          </p>
        )}
        {!translation&&!guidance&&<ErrorBox error={error} />}
        <div className="source-actions">
          <label
            className={`button outline upload-action ${busy||ocrUnavailable ? "disabled" : ""}`}
          >
            <FileImage size={16} /> 캡처 첨부
            <input
              className="file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={busy||ocrUnavailable}
              onChange={(e) => {
                void readImage(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              ws.update(SAMPLE, null, true);
              resetResults();
            }}
          >
            가상 예시 문자로 체험
          </Button>
        </div>
        {ocrUnavailable&&<p className="small-note">사진 인식은 현재 사용할 수 없어요. 문자 내용을 복사해 붙여넣어 주세요.</p>}
        <Button
          className="analyze-button"
          disabled={!ws.text.trim() || busy}
          onClick={() => void analyze()}
        >
          <Sparkles size={17} />
          {busy
            ? "경보를 꼼꼼히 확인하고 있어요…"
            : phase === 4
              ? "다시 분석하기"
              : "문자 이해하기"}
          <ArrowRight size={17} />
        </Button>
        <p className="privacy-note">
          <ShieldCheck size={15} /> 원문·국가·공식 지시는 번역과 대응 단계 판단을 위해 Google Gemini에 전송됩니다.
          이미지는 로컬 OCR로만 처리됩니다.
        </p>
      </Panel>

      </details>
      {error&&(translation||guidance)&&<ErrorBox error={error}/>}
      {busy && (
        <div role="status" aria-live="polite">
        <Panel className="progress-panel">
          <span className="progress-spark">
            <Sparkles size={22} />
          </span>
          <div>
            <strong>{PHASES[Math.min(phase, 3)]} 중입니다</strong>
            <p>원문과 근거를 차례로 확인하고 있어요.</p>
          </div>
          <LoaderCircle className="spin progress-loader" />
        </Panel>
        </div>
      )}

      {(translation||guidance)&&<details className="analysis-detail"><summary>전체 번역·검증·행동지침 근거 보기</summary>
      {translation && (
        <section className="result-section" aria-labelledby="translation-title">
          <div className="result-title">
            <span className="result-number">01</span>
            <div>
              <span className="step-kicker">F1 · KOREAN TRANSLATION</span>
              <h2 id="translation-title">한국어 번역과 해설</h2>
            </div>
            <span className="result-done">
              <Check size={15} /> 번역 생성
            </span>
          </div>
          <Panel>
            <h3>지금 알아둘 내용</h3>
            {translation.hazard_explanation && <p className="quick-explanation">{translation.hazard_explanation}</p>}
            <div className="quick-summary">
              {translation.summary.slice(0, 3).map((s, i) => (
                <p className="summary-item" key={i}><Check size={14} />{s}</p>
              ))}
            </div>
            <p className="ai-note" role="status">{!verification
              ? busy ? "요약과 번역을 원문과 대조하고 있어요." : "내용 대조를 완료하지 못했어요. 시간·장소·행동은 원문을 확인하세요."
              : hasFindings ? "아래 표시된 내용에 오류가 있어 원문 확인이 필요해요."
              : verification.status === "검증 불가" ? "일부 내용은 원문과 일치하는지 확인하지 못했어요."
              : "원문 대조에서 중대한 불일치를 찾지 못했어요. 현재 위치에 적용되는지는 별도 확인이 필요해요."}</p>
          </Panel>
          <details className="more-translation">
            <summary>전체 번역과 용어 풀이 <ChevronDown size={16} /></summary>
            <div className="more-translation-body">
              <h3>전체 번역</h3>
              <div className="original translated-text">{translation.translation}</div>
              {!!translation.glossary.length && <>
                <h3>경보 용어 풀이</h3>
                {translation.glossary.slice(0, 3).map((g, i) => <p className="glossary-item" key={i}><strong>{g.term}</strong><br />{g.meaning}</p>)}
              </>}
            </div>
          </details>
        </section>
      )}

      {hasFindings && verification && (
        <section className="result-section" aria-labelledby="verify-title">
          <div className="result-title">
            <span className="result-number warning-number"><AlertTriangle size={17} /></span>
            <div>
              <span className="step-kicker">확인 필요</span>
              <h2 id="verify-title">번역에서 확인할 점</h2>
            </div>
          </div>
          <Panel className="verification">
            {confirmedIssues.length > 0 && (
              confirmedIssues.slice(0, 2).map((issue, i) => (
                <div className="issue-card" key={i}>
                  <p>{({summary: "요약", hazard_explanation: "해설", instruction_translation_ko: "행동지시", glossary: "용어 풀이"} as Record<string, string>)[issue.field ?? ""] ?? "번역"}: {issueSummary(issue.kind, issue.reason)}</p>
                </div>
              ))
            )}
          </Panel>
        </section>
      )}

      {guidance && (
        <section className="result-section" aria-labelledby="guidance-title">
          <div className="result-title">
            <span className="result-number">03</span>
            <div>
              <span className="step-kicker">F3 · OFFICIAL GUIDANCE</span>
              <h2 id="guidance-title">지금 확인할 행동지침</h2>
            </div>
            <span className="result-done">
              <Check size={15} /> 완료
            </span>
          </div>
          <p className="guidance-priority">
            <ShieldCheck size={17} /> 현지 당국의 공식 지시가 AI 설명보다
            우선합니다.
          </p>
          <p className="muted">출처: {guidance.provenance}</p>
          {!guidance.cards.some((c) => c.category === "official") && (
            <Panel className="no-official">
              <strong>공식 출처와 연결된 행동지시를 확인하지 못했어요.</strong>
              <p>아래 재난 유형별 안전수칙을 우선 참고하고, 현지 당국의 최신 안내를 확인하세요. 이 안내만으로 대피 여부를 판단하지 마세요.</p>
            </Panel>
          )}
          <div className="guidance-cards">
            {guidance.cards.map((card, i) => (
              <Panel
                className={
                  card.category === "official"
                    ? "official guidance-card"
                    : "guidance-card"
                }
                key={i}
              >
                <span
                  className={`badge ${card.category === "official" ? "official-badge" : ""}`}
                >
                  {card.category === "official"
                    ? "경보 원문의 공식 지시"
                    : card.agency.includes("National Weather Service")
                      ? "NWS 추가 안전수칙"
                      : "일반 안전수칙"}
                </span>
                <h3>{card.title}</h3>
                {card.category === "official" ? (
                  <div className="official-instruction-translation">
                    <strong>한국어 행동지침</strong>
                    <p>{translation?.instruction_translation_ko || "한국어 번역을 준비하지 못했어요. 아래 영문 원문을 확인하고, 이어지는 일반 안전수칙도 참고하세요."}</p>
                    <details>
                      <summary>공식 영문 원문 보기 <ChevronDown size={15} /></summary>
                      <p className="original">{card.text}</p>
                    </details>
                  </div>
                ) : (
                  <p className="original">{card.text}</p>
                )}
                <p className="muted">적용 조건: {card.condition}</p>
                <a href={card.url} target="_blank" rel="noreferrer">
                  {card.agency} 자료 확인 <ExternalLink size={14} />
                </a>
                <p className="checked-at">확인: {card.checked_at}</p>
              </Panel>
            ))}
          </div>
          {!guidance.cards.length && (
            <Panel className="no-official">
              <strong>이 재난 유형의 안전자료를 확인하지 못했습니다.</strong>
              <p>추가 행동요령은 생성하지 않았습니다.</p>
            </Panel>
          )}
          <Panel className="limits">
            <h3>안내 범위</h3>
            {guidance.limitations.map((item, i) => (
              <p key={i}>· {item}</p>
            ))}
          </Panel>
        </section>
      )}
      </details>}
      {<TravelAssistant text={ws.text} alert={ws.alert} country={ws.alert ? (ws.alert.id.startsWith('jma:')?'JP':'US') : messageCountry}/>}
    </div>
  );
}
