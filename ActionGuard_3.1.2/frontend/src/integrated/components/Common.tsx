import type { ReactNode } from "react";
export function Panel({
  children,
  className = "",
  hidden,
}: {
  children: ReactNode;
  className?: string;
  hidden?: boolean;
}) {
  return <section hidden={hidden} className={"panel " + className}>{children}</section>;
}
export function ErrorBox({ error }: { error: unknown }) {
  return error ? (
    <div role="alert" className="error">
      {error instanceof Error ? error.message : String(error)}
    </div>
  ) : null;
}
export function Loading() {
  return (
    <div role="status" aria-label="불러오는 중" className="skeleton">
      <div />
      <div />
      <div />
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
export function Highlight({
  text,
  quotes,
}: {
  text: string;
  quotes: (string | null)[];
}) {
  const ranges = quotes
    .filter((q): q is string => !!q && text.includes(q))
    .map((q) => ({ start: text.indexOf(q), end: text.indexOf(q) + q.length }))
    .sort((a, b) => a.start - b.start);
  const parts: ReactNode[] = [];
  let p = 0;
  for (const r of ranges) {
    if (r.start < p) continue;
    parts.push(
      text.slice(p, r.start),
      <mark key={r.start}>{text.slice(r.start, r.end)}</mark>,
    );
    p = r.end;
  }
  parts.push(text.slice(p));
  return <div className="original">{parts}</div>;
}
export function Time({ value }: { value: string | null }) {
  return (
    <>
      {value
        ? new Date(value).toLocaleString("ko-KR", { timeZoneName: "short" })
        : "확인되지 않음"}
    </>
  );
}
