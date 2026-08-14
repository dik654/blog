const Step = ({ n, title, body }: { n: string; title: string; body: string }) => (
  <div className="min-w-0 rounded-lg border border-border bg-card p-4">
    <p className="text-xs font-semibold text-primary">{n}</p>
    <p className="mt-1 font-semibold text-foreground">{title}</p>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
  </div>
);

export function AvalancheTraceViz() {
  return <figure data-viz="avalanche-trace" className="not-prose min-w-0 rounded-xl border border-border bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-4 text-sm font-semibold">Alice→Bob transfer가 local decision이 되기까지</figcaption>
    <div className="grid min-w-0 gap-3 md:grid-cols-4">
      <Step n="01" title="conflict" body="Transfer를 담은 block A와 double-spend block B를 분리합니다." />
      <Step n="02" title="sample" body="매 poll마다 k validators를 뽑고 응답 수를 셉니다." />
      <Step n="03" title="state" body="Snowflake streak와 Snowball strength를 별도로 갱신합니다." />
      <Step n="04" title="release" body="Beta 결정 뒤에도 parameter·sampler·fault 조건을 기록합니다." />
    </div>
  </figure>;
}

export function AvalancheStateViz() {
  const rows = [
    ["A 성공", "A: 1", "A: 1 · B: 0", "계속"],
    ["A 성공", "A: 2", "A: 2 · B: 0", "계속"],
    ["실패", "0으로 reset", "그대로", "계속"],
    ["A 성공", "A: 1", "A: 3 · B: 0", "beta=3 미달"],
  ];
  return <figure data-viz="avalanche-state" className="not-prose min-w-0 overflow-hidden rounded-xl border border-border bg-card">
    <figcaption className="border-b border-border px-4 py-3 text-sm font-semibold">같은 poll 기록, 서로 다른 두 기억</figcaption>
    <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-muted/40 text-muted-foreground"><tr>{["poll", "Snowflake streak", "Snowball strength", "decision"].map(x => <th key={x} className="px-4 py-3 font-medium">{x}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i} className="border-t border-border/70">{r.map((x, j) => <td key={j} className="px-4 py-3 align-top">{x}</td>)}</tr>)}</tbody></table></div>
  </figure>;
}
