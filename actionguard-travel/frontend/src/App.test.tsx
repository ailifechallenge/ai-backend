import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { Workspace, useWorkspace } from "./hooks/workspace";

const japanAlert = {
  id: "jma:130000:05",
  event: "High Wind Warning / 暴風警報",
  headline: "暴風警報 · 千代田区",
  area: "千代田区",
  severity: "Severe",
  sender: "JMA · 気象庁",
  sent: "2026-10-14T10:00:00+09:00",
  effective: "2026-10-14T10:00:00+09:00",
  expires: null,
  instruction: "",
  source: "https://www.jma.go.jp/bosai/map.html?area_type=japan",
  text: "気象庁 発表: 暴風警報（High Wind Warning）\n対象地域: 千代田区\n",
  checked_at: "2026-10-14T01:00:00Z",
};

function mount() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <Workspace><App /></Workspace>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    let data: unknown = { ai_configured: false };
    if (url.includes("japan/areas")) {
      data = { areas: [{ code: "130000", name: "東京都", en_name: "Tokyo" }] };
    } else if (url.includes("japan/alerts")) {
      data = { alerts: [japanAlert], checked_at: "2026-10-14T01:00:00Z" };
    } else if (url.endsWith("/translate")) {
      data = { translation: "강풍 경보입니다.", hazard_explanation: "강풍", glossary: [], summary: [] };
    } else if (url.endsWith("/verify")) {
      data = { status: "불일치 미탐지", issues: [], unresolved: [], source_facts: [], translated_facts: [], official_fields: {}, checks: [] };
    } else if (url.endsWith("/guidance")) {
      data = { cards: [{ title: "강풍·태풍 행동요령", text: "창문을 닫고 날아갈 물건을 고정하세요.", category: "general", agency: "ActionGuard · 일본 일반 안전안내", url: "https://www.jma.go.jp/", condition: "강풍 경보 동안", checked_at: "2026-10-14" }], provenance: "JMA · 일본 기상청 경보 자료", limitations: [] };
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }));
});

describe("unified travel alert workflow", () => {
  it("shows the one-screen F1–F3 workflow and supports Japanese official alerts", async () => {
    mount();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("경보를 이해하고");
    fireEvent.click(screen.getByRole("tab", { name: "공식 경보 찾기" }));
    fireEvent.change(screen.getByLabelText("여행 국가"), { target: { value: "JP" } });
    expect(await screen.findByRole("option", { name: "東京都 · Tokyo" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "경보 찾기" }));
    expect(await screen.findByRole("button", { name: /暴風警報/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /暴風警報/ }));
    expect(screen.getByText("일본 기상청 공식 경보")).toBeInTheDocument();
    expect(screen.getByLabelText("경보 원문")).toHaveValue(japanAlert.text);
  });

  it("runs Japanese text through translation and gives wind safety guidance", async () => {
    mount();
    fireEvent.change(screen.getByLabelText("경보 원문"), { target: { value: "暴風警報。強風に注意してください。" } });
    fireEvent.click(screen.getByRole("button", { name: "문자 이해하기" }));
    expect(await screen.findByText("강풍 경보입니다.")).toBeInTheDocument();
    expect((await screen.findAllByText("강풍·태풍 행동요령")).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/창문을 닫고/).length).toBeGreaterThan(0);
  });
});


it("shows guidance even if the AI translation request fails", async () => {
  const previousFetch = globalThis.fetch;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith("/translate"))
      return new Response(JSON.stringify({ detail: "AI 사용량 초과" }), { status: 429 });
    return previousFetch(url, init);
  }));
  mount();
  fireEvent.change(screen.getByLabelText("경보 원문"), { target: { value: "暴風警報" } });
  fireEvent.click(screen.getByRole("button", { name: "문자 이해하기" }));
  expect((await screen.findAllByText("강풍·태풍 행동요령")).length).toBeGreaterThan(0);
  expect(await screen.findByRole("alert")).toHaveTextContent("AI 사용량 초과");
});

it("requests the same area again when the user searches again", async () => {
  mount();
  fireEvent.click(screen.getByRole("tab", { name: "공식 경보 찾기" }));
  fireEvent.change(screen.getByLabelText("여행 국가"), { target: { value: "JP" } });
  await screen.findByRole("option", { name: "東京都 · Tokyo" });
  fireEvent.click(screen.getByRole("button", { name: "경보 찾기" }));
  await screen.findByRole("button", { name: /暴風警報/ });
  fireEvent.click(screen.getByRole("button", { name: "경보 찾기" }));
  await waitFor(() => expect(vi.mocked(fetch).mock.calls.filter(([url]) =>
    String(url).includes("japan/alerts?office=130000"))).toHaveLength(2));
});


it("preserves the exact selected official text including trailing whitespace", async () => {
  mount();
  fireEvent.click(screen.getByRole("tab", { name: "공식 경보 찾기" }));
  fireEvent.change(screen.getByLabelText("여행 국가"), { target: { value: "JP" } });
  await screen.findByRole("option", { name: "東京都 · Tokyo" });
  fireEvent.click(screen.getByRole("button", { name: "경보 찾기" }));
  fireEvent.click(await screen.findByRole("button", { name: /暴風警報/ }));
  fireEvent.click(screen.getByRole("button", { name: "문자 이해하기" }));
  await screen.findByText("강풍 경보입니다.");
  const request = vi.mocked(fetch).mock.calls.find(([url]) => String(url).endsWith("/translate"));
  expect(JSON.parse(String(request?.[1]?.body)).text).toBe(japanAlert.text);
});

it("sends country and every generated display field for review", async () => {
  mount();
  fireEvent.change(screen.getByLabelText("문자를 받은 국가"), { target: { value: "JP" } });
  fireEvent.change(screen.getByLabelText("경보 원문"), { target: { value: "暴風警報" } });
  fireEvent.click(screen.getByRole("button", { name: "문자 이해하기" }));
  await screen.findByText(/원문 대조에서 중대한 불일치/);
  const request = vi.mocked(fetch).mock.calls.find(([url]) => String(url).endsWith("/verify"));
  expect(JSON.parse(String(request?.[1]?.body))).toMatchObject({ country: "JP",
    displayed: { summary: "", hazard_explanation: "강풍", instruction_translation_ko: "", glossary: "" } });
});

it("does not present failed verification as completed review", async () => {
  const previousFetch = globalThis.fetch;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith("/verify")) return new Response(JSON.stringify({ detail: "대조 실패" }), { status: 503 });
    return previousFetch(url, init);
  }));
  mount();
  fireEvent.change(screen.getByLabelText("경보 원문"), { target: { value: "High Wind Warning" } });
  fireEvent.click(screen.getByRole("button", { name: "문자 이해하기" }));
  expect(await screen.findByText(/내용 대조를 완료하지 못했어요/)).toBeInTheDocument();
  expect(screen.queryByText(/원문 대조에서 중대한 불일치/)).not.toBeInTheDocument();
});

it('keeps analysis available when switching to chat and back',async()=>{
 mount();fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:'暴風警報'}});
 fireEvent.click(screen.getByRole('button',{name:'문자 이해하기'}));
 await screen.findByRole('region',{name:'문자 핵심 결과'});
 fireEvent.click(screen.getByRole('link',{name:'챗봇'}));
 expect(screen.getByRole('heading',{name:'앱에서 필요한 일, 편하게 물어보세요.'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('link',{name:'홈'}));
 expect(screen.getByRole('region',{name:'문자 핵심 결과'})).toBeInTheDocument();
 expect(screen.getByLabelText('경보 원문')).toHaveValue('暴風警報');
});
it('gives a clear first action on chat with no message',()=>{
 mount();fireEvent.click(screen.getByRole('link',{name:'챗봇'}));
 expect(screen.getByLabelText('AI 도우미에게 질문')).toBeInTheDocument();
 expect(screen.getByRole('button',{name:'가장 가까운 대피소를 알려줘'})).toBeEnabled();
});


it('clears the old analysis when a notification replaces the workspace message',async()=>{
 function Handoff(){const ws=useWorkspace();return <button onClick={()=>{ws.update('NEW flood message');ws.setMessageCountry('US');}}>알림에서 새 경보 열기</button>;}
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><Handoff/><App/></Workspace></MemoryRouter></QueryClientProvider>);
 fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:'暴風警報'}});fireEvent.click(screen.getByRole('button',{name:'문자 이해하기'}));
 await screen.findByRole('region',{name:'문자 핵심 결과'});
 fireEvent.click(screen.getByRole('button',{name:'알림에서 새 경보 열기'}));
 expect(screen.queryByRole('region',{name:'문자 핵심 결과'})).not.toBeInTheDocument();expect(screen.getByLabelText('경보 원문')).toHaveValue('NEW flood message');
});
