import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { api } from "../services/api";
import { useWorkspace } from "../hooks/workspace";
import type { Verification } from "../types";
import {
  Panel,
  ErrorBox,
  Loading,
  Empty,
  Highlight,
} from "../components/Common";
import { Button } from "../components/ui/button";
export default function Verify() {
  const ws = useWorkspace();
  const target = ws.verifyText;
  const setTarget = ws.setVerifyText;
  const mutation = useMutation({
    mutationFn: () => {
      const rev = ws.revision;
      return api<Verification>("verify", {
        text: ws.text,
        translation: target,
        alert_id: ws.alert?.id,
      }).then((data) => ({ data, rev }));
    },
    onSuccess: ({ data, rev }) => ws.setVerification(data, rev),
  });
  const v = ws.verification;
  return (
    <>
      <div className="eyebrow">F2 · ACTIONGUARD ENGINE</div>
      <h1>번역을 넘어, 근거까지.</h1>
      <p className="lead">독립 정보추출 + 규칙 검사 + AI 의미 비교</p>
      {!ws.text ? (
        <Empty>
          <Link to="/translate">먼저 원문을 입력하세요 →</Link>
        </Empty>
      ) : (
        <>
          <div className="columns">
            <Panel>
              <h2>영문 원문</h2>
              <Highlight
                text={ws.text}
                quotes={v?.issues.map((i) => i.source_quote) ?? []}
              />
            </Panel>
            <Panel>
              <h2>검증할 한국어 번역</h2>
              <label className="sr-only" htmlFor="target">
                검증할 번역문
              </label>
              <textarea
                id="target"
                value={target}
                disabled={mutation.isPending}
                onChange={(e) => {
                  setTarget(e.target.value);
                  ws.setVerification(null);
                }}
                placeholder="직접 번역문을 입력하거나 F1 번역을 사용하세요"
              />
              {v && (
                <Highlight
                  text={target}
                  quotes={v.issues.map((i) => i.translation_quote)}
                />
              )}
            </Panel>
          </div>
          <Button
            disabled={!target.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            <ShieldCheck size={18} />
            {mutation.isPending ? "근거 검증 중…" : "번역 검증 실행"}
          </Button>
          <ErrorBox error={mutation.error} />
          {mutation.isPending && <Loading />}
          {v && (
            <>
              <Panel className="verification">
                <div className="eyebrow">검증 결과</div>
                <h2>{v.status}</h2>
                <p>
                  ‘불일치 미탐지’는 검사 범위 내 결과이며 번역의 정확성·안전성을
                  보장하지 않습니다.
                </p>
                {v.checks.map((c) => (
                  <p className="muted" key={c}>
                    ✓ {c}
                  </p>
                ))}
              </Panel>
              <div className="alert-grid">
                {v.issues.map((i, n) => (
                  <Panel key={n}>
                    <span className="badge">
                      {i.method === "rule" ? "규칙 검사" : "AI 의미 검사"} ·{" "}
                      {i.kind}
                    </span>
                    <h3>{i.reason}</h3>
                    <p>원문 근거</p>
                    <blockquote>
                      {i.source_quote || "원문에 대응 근거 없는 추가 내용"}
                    </blockquote>
                    <p>번역문 근거</p>
                    <blockquote>
                      {i.translation_quote || "대응 문구 없음 (누락)"}
                    </blockquote>
                  </Panel>
                ))}
              </div>
              {v.unresolved.length > 0 && (
                <Panel>
                  <h2>검증되지 않은 항목</h2>
                  {v.unresolved.map((u, i) => (
                    <p key={i}>• {u}</p>
                  ))}
                </Panel>
              )}
              <Panel>
                <h2>공식 정형 필드 · NWS 우선</h2>
                {Object.keys(v.official_fields).length ? (
                  Object.entries(v.official_fields).map(([k, val]) => (
                    <p key={k}>
                      <strong>{k}</strong> {val}
                    </p>
                  ))
                ) : (
                  <p>공식 API에 연결된 정형 필드 없음</p>
                )}
              </Panel>
              <div className="columns">
                {[
                  ["원문 핵심정보", v.source_facts],
                  ["번역문 핵심정보", v.translated_facts],
                ].map(([name, facts]) => (
                  <Panel key={String(name)}>
                    <h2>{String(name)}</h2>
                    {(facts as Verification["source_facts"]).map((f, i) => (
                      <div className="fact" key={i}>
                        <span className="badge">{f.kind}</span>
                        <p>{f.value}</p>
                        <blockquote>{f.quote}</blockquote>
                      </div>
                    ))}
                  </Panel>
                ))}
              </div>
              <Button asChild>
                <Link to="/guidance">F3 공식 행동지침 확인 →</Link>
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
