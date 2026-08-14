const columns = [
  { head: "a", values: ["3", "4", "12"] },
  { head: "b", values: ["4", "1", "1"] },
  { head: "c", values: ["12", "4", "12"] },
] as const;

export default function PLONKPipelineViz() {
  return (
    <figure data-viz="plonk-table-pipeline" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-semibold text-foreground">Witness table을 gate·copy·opening 세 층으로 검사한다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Gate는 각 row의 산술, permutation은 cell 사이의 같은 값, PCS는 challenge point의 polynomial claim을 결속합니다.</p></figcaption>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        <div className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold text-primary">Witness columns</p><div className="mt-3 grid grid-cols-3 gap-2">{columns.map((column) => <div key={column.head} className="min-w-0 text-center"><p className="rounded-md border border-border bg-muted/40 py-1 font-mono text-xs font-semibold">{column.head}</p><div className="mt-1 grid gap-0.5 font-mono text-[11px] leading-4 text-muted-foreground">{column.values.map((value, index) => <span key={`${column.head}-${index}`}>{value}</span>)}</div></div>)}</div></div>
        <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span>
        <div className="rounded-lg border border-border bg-violet-400/5 p-4"><p className="text-xs font-semibold text-primary">Polynomial IOP</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Gate identity<br/>Permutation grand product<br/>Quotient over H</p></div>
        <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span>
        <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-4"><p className="text-xs font-semibold text-primary">PCS + transcript</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Commit first<br/>derive β, γ, α, ζ<br/>batch open → verify</p></div>
      </div>
    </figure>
  );
}
