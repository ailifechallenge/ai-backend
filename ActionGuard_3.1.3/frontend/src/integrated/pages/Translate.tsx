import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Languages, Upload, ArrowRight } from "lucide-react";
import { api, upload } from "../services/api";
import { useWorkspace } from "../hooks/workspace";
import type { Translation } from "../types";
import { Panel, ErrorBox, Loading, Time } from "../components/Common";
import { Button } from "../components/ui/button";
const sample =
  "DEMO ONLY — FICTIONAL ALERT. NOT ACTIVE.\nFlash Flood Warning for Example County until 6 PM.\nResidents should move to higher ground. Do not drive through flooded roads.";
export default function Translate() {
  const ws = useWorkspace(),
    revision = useRef(ws.revision);
  revision.current = ws.revision;
  const [notice, setNotice] = useState("");
  const mutation = useMutation({
    mutationFn: () => {
      const rev = ws.revision;
      return api<Translation>("translate", {
        text: ws.text,
        alert_id: ws.alert?.id,
      }).then((data) => ({ data, rev }));
    },
    onSuccess: ({ data, rev }) => {
      if (revision.current === rev) {
        ws.setTranslation(data, rev);
      }
    },
  });
  const ocr = useMutation({
    mutationFn: (file: File) => {
      const rev = ws.revision;
      return upload(file).then((data) => ({ data, rev }));
    },
    onSuccess: ({ data, rev }) => {
      ws.update(data.text, null, false, rev);
      setNotice(data.note);
    },
  });
  return (
    <>
      <div className="eyebrow">F1 · TRANSLATE</div>
      <h1>원문 그대로, 한국어로.</h1>
      <p className="lead">공식 용어와 중요한 행동정보를 보존하는 AI 번역</p>
      <div className="toolbar">
        <Button variant="outline" asChild>
          <Link to="/">NWS 경보 선택</Link>
        </Button>
        <Button variant="ghost" onClick={() => ws.update(sample, null, true)}>
          가상 예시 입력
        </Button>
        <label className="button outline">
          <Upload size={16} /> 이미지 OCR
          <input
            className="file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={ocr.isPending || mutation.isPending}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) ocr.mutate(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="notice">
        {ws.demo
          ? "가상 예시 · 실제 발령된 경보가 아닙니다."
          : ws.alert
            ? "NWS API 조회 원문 · 편집 시 공식 연결 해제"
            : "직접 입력 · 공식 발령 여부 확인되지 않음"}
      </div>
      {ws.alert && (
        <Panel>
          <h3>{ws.alert.headline}</h3>
          <p>
            {ws.alert.sender} · {ws.alert.severity} · {ws.alert.area}
          </p>
          <p>
            발효 <Time value={ws.alert.effective} />
            <br />
            현상 시작 <Time value={ws.alert.onset ?? null} /> · 현상 종료{" "}
            <Time value={ws.alert.ends ?? null} />
            <br />
            메시지 만료 <Time value={ws.alert.expires} />
          </p>
          <a href={ws.alert.source} target="_blank" rel="noreferrer">
            공식 원문 열기 ↗
          </a>
        </Panel>
      )}
      <ErrorBox error={mutation.error || ocr.error} />
      {notice && <p role="status">{notice}</p>}
      <div className="columns">
        <Panel>
          <h2>
            영문 원문 <span className="badge">SOURCE</span>
          </h2>
          <label className="sr-only" htmlFor="source">
            영문 경보 원문
          </label>
          <textarea
            id="source"
            value={ws.text}
            disabled={mutation.isPending || ocr.isPending}
            onChange={(e) => {
              ws.update(e.target.value);
              mutation.reset();
            }}
            maxLength={16000}
            placeholder="영문 경보문을 붙여넣으십시오…"
          />
          <span className="muted">
            {ws.text.length.toLocaleString()} / 16,000자
          </span>
        </Panel>
        <Panel>
          <h2>
            한국어 번역 <span className="badge">AI GENERATED</span>
          </h2>
          {mutation.isPending || ocr.isPending ? (
            <Loading />
          ) : ws.translation ? (
            <div className="original">{ws.translation.translation}</div>
          ) : (
            <div className="empty">번역 결과가 여기에 표시됩니다.</div>
          )}
        </Panel>
      </div>
      <div className="toolbar">
        <Button
          disabled={!ws.text.trim() || mutation.isPending || ocr.isPending}
          onClick={() => mutation.mutate()}
        >
          <Languages size={18} />
          {mutation.isPending ? "번역 중…" : "한국어로 번역"}
        </Button>
        {ws.translation && (
          <Button variant="outline" asChild>
            <Link to="/verify">
              F2 검증하기 <ArrowRight size={16} />
            </Link>
          </Button>
        )}
      </div>
      <p className="muted">
        텍스트는 서버를 통해 Gemini로 전송됩니다. 이미지 OCR은 로컬 서버에서
        처리합니다. 원문 숫자·지명을 확인하십시오.
      </p>
      {ws.translation && (
        <div className="columns">
          <Panel>
            <h2>핵심 요약 · AI 해설</h2>
            <p>{ws.translation.hazard_explanation}</p>
            {ws.translation.summary.map((s, i) => (
              <p key={i}>• {s}</p>
            ))}
          </Panel>
          <Panel>
            <h2>미국 경보 용어</h2>
            {ws.translation.glossary.map((g, i) => (
              <p key={i}>
                <strong>{g.term}</strong>
                <br />
                {g.meaning}
              </p>
            ))}
          </Panel>
        </div>
      )}
    </>
  );
}
