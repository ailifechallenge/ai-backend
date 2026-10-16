import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowUpRight, Radio, Search } from "lucide-react";
import { api } from "../services/api";
import { useWorkspace } from "../hooks/workspace";
import type { Alert } from "../types";
import { Panel, ErrorBox, Loading, Empty, Time } from "../components/Common";
import { Button } from "../components/ui/button";
export default function Dashboard() {
  const [mode, setMode] = useState("area"),
    [area, setArea] = useState("CA"),
    [lat, setLat] = useState("38.9"),
    [lon, setLon] = useState("-77.04"),
    [query, setQuery] = useState("");
  const nav = useNavigate();
  const ws = useWorkspace();
  const result = useQuery({
    queryKey: ["alerts", query],
    queryFn: () =>
      api<{ alerts: Alert[]; checked_at: string }>("alerts?" + query),
    enabled: !!query,
    retry: false,
    staleTime: 120000,
  });
  return (
    <>
      <div className="eyebrow">OFFICIAL ALERTS · UNITED STATES</div>
      <h1>
        여행의 모든 순간,
        <br />
        정보는 정확하게.
      </h1>
      <p className="lead">
        미국 공식 재난경보를 읽고, 한국어로 이해하고, 근거를 확인하세요.
      </p>
      <div className="stats">
        <Panel>
          <Radio />
          <span>공식 데이터</span>
          <strong>National Weather Service</strong>
        </Panel>
        <Panel>
          <span>조회된 활성 경보</span>
          <strong>
            {result.data?.alerts.length ?? "—"} <small>건</small>
          </strong>
        </Panel>
        <Panel>
          <span>분석 과정</span>
          <strong>번역 → 검증 → 행동지침</strong>
        </Panel>
      </div>
      <Panel>
        <div className="section-head">
          <h2>
            <MapPin size={20} /> 지역 경보 조회
          </h2>
          <span className="badge">NWS 공식 API</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q =
              mode === "area"
                ? "area=" + encodeURIComponent(area)
                : new URLSearchParams({ lat, lon }).toString();
            if (q === query) void result.refetch();
            else setQuery(q);
          }}
          className="search-form"
        >
          <label>
            조회 방식
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="area">미국 주 / 영토</option>
              <option value="point">위도 · 경도</option>
            </select>
          </label>
          {mode === "area" ? (
            <label>
              주 코드
              <input
                value={area}
                maxLength={2}
                required
                placeholder="CA, NY, FL…"
                onChange={(e) => setArea(e.target.value.toUpperCase())}
              />
            </label>
          ) : (
            <>
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
          <Button disabled={result.isFetching}>
            <Search size={16} /> {result.isFetching ? "조회 중" : "경보 조회"}
          </Button>
        </form>
        <p className="muted">
          경보가 없다는 것이 안전을 의미하지는 않습니다. 조회 결과는 최대 2분간
          캐시됩니다.
        </p>
      </Panel>
      <div className="section-head">
        <h2>현재 활성 경보</h2>
        {result.data && (
          <span className="muted">
            조회 <Time value={result.data.checked_at} />
          </span>
        )}
      </div>
      <ErrorBox error={result.error} />
      {result.isFetching ? (
        <Loading />
      ) : result.data?.alerts.length ? (
        <div className="alert-grid">
          {result.data.alerts.map((a) => (
            <Panel key={a.id}>
              <div className="section-head">
                <span className={"severity " + a.severity}>{a.severity}</span>
                <span className="muted">{a.sender}</span>
              </div>
              <h3>{a.event}</h3>
              <p>{a.area}</p>
              <p className="muted">
                발령 <Time value={a.sent} />
                <br />
                메시지 만료 <Time value={a.expires} />
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  ws.update(a.text, a);
                  nav("/translate");
                }}
              >
                경보 상세 · 번역 <ArrowUpRight size={16} />
              </Button>
            </Panel>
          ))}
        </div>
      ) : (
        <Empty>
          {query
            ? "조회된 활성 경보가 없습니다."
            : "지역을 선택하고 공식 경보를 조회하세요."}
        </Empty>
      )}
      {ws.alert && (
        <Panel>
          <h3>선택한 경보</h3>
          <p>{ws.alert.headline}</p>
          <Button onClick={() => nav("/translate")}>분석 이어가기</Button>
        </Panel>
      )}
    </>
  );
}
