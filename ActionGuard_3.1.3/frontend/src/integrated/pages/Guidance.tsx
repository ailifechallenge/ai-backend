import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { api } from "../services/api";
import { useWorkspace } from "../hooks/workspace";
import type { Guidance as Result } from "../types";
import { Panel, ErrorBox, Loading, Empty } from "../components/Common";
export default function Guidance() {
  const ws = useWorkspace();
  const q = useQuery({
    queryKey: ["guidance", ws.text, ws.alert?.id],
    queryFn: () =>
      api<Result>("guidance", { text: ws.text, alert_id: ws.alert?.id }),
    enabled: !!ws.text,
    retry: false,
  });
  return (
    <>
      <div className="eyebrow">F3 · OFFICIAL GUIDANCE</div>
      <h1>행동의 기준은, 공식 지시.</h1>
      <p className="lead">
        경보 원문의 지시를 먼저, 일반 안전수칙은 구분해서 확인하십시오.
      </p>
      <div className="notice">
        현지 당국의 공식 지시가 AI 설명보다 우선합니다.
      </div>
      {!ws.text ? (
        <Empty>
          <Link to="/translate">분석할 원문을 먼저 선택하십시오 →</Link>
        </Empty>
      ) : q.isPending ? (
        <Loading />
      ) : (
        <>
          <ErrorBox error={q.error} />
          {q.data && (
            <>
              <p className="muted">{q.data.provenance}</p>
              {!q.data.cards.some((c) => c.category === "official") && (
                <Panel>
                  <h2>확인된 공식 행동지시 없음</h2>
                  <p>
                    원문의 공식 지시를 확인할 수 없습니다. 입력된 문장을 공식
                    대피 명령으로 간주하지 마십시오.
                  </p>
                </Panel>
              )}
              <div className="alert-grid">
                {q.data.cards.map((c, i) => (
                  <Panel
                    key={i}
                    className={c.category === "official" ? "official" : ""}
                  >
                    <span className="badge">
                      {c.category === "official"
                        ? "공식 경보 지시 · 원문"
                        : "일반 안전수칙 · 한국어 요약"}
                    </span>
                    <h2>{c.title}</h2>
                    <p className="original">{c.text}</p>
                    <p className="muted">적용 조건: {c.condition}</p>
                    <a href={c.url} target="_blank" rel="noreferrer">
                      {c.agency} <ExternalLink size={14} />
                    </a>
                    <p className="muted">확인: {c.checked_at}</p>
                  </Panel>
                ))}
              </div>
              {!q.data.cards.length && (
                <Empty>
                  이 재난 유형에 대해 준비된 공식 안전자료가 없습니다.
                </Empty>
              )}
              <Panel>
                <h2>적용 범위와 한계</h2>
                {q.data.limitations.map((l) => (
                  <p key={l}>• {l}</p>
                ))}
              </Panel>
            </>
          )}
        </>
      )}
    </>
  );
}
