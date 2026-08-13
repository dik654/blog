const rows = [
  ["G0", "ground-truth baseline", "A₀ · slice errors"],
  ["G1", "G0 soft signal + labels", "ΔA · Δagreement"],
  ["G2", "only after independent gain", "same frozen holdout"],
  ["Stop", "R>0 drift or no marginal gain", "retain best generation"],
] as const;

export default function SelfDistillViz() {
  return (
    <figure data-viz data-viz-canvas className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Generation audit</p>
        <h3 className="mt-1 text-base font-semibold">Teacher를 더 닮는 것과 정답에 가까워지는 것을 분리합니다</h3>
      </figcaption>
      <div className="hidden grid-cols-[.65fr_1.45fr_1.15fr] border-b border-border bg-muted/25 px-5 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
        <span>세대</span><span>training signal</span><span>승인 evidence</span>
      </div>
      {rows.map((row) => (
        <section key={row[0]} className="border-b border-border/70 px-4 py-4 last:border-b-0 sm:grid sm:grid-cols-[.65fr_1.45fr_1.15fr] sm:px-5 sm:py-3">
          <strong className="text-sm">{row[0]}</strong>
          <div className="mt-3 min-w-0 text-sm sm:mt-0 sm:pr-3">
            <span className="block text-xs text-muted-foreground sm:hidden">training signal</span>
            <span className="mt-1 block break-words text-muted-foreground sm:mt-0">{row[1]}</span>
          </div>
          <div className="mt-3 min-w-0 text-sm sm:mt-0">
            <span className="block text-xs text-muted-foreground sm:hidden">승인 evidence</span>
            <span className="mt-1 block break-words text-muted-foreground sm:mt-0">{row[2]}</span>
          </div>
        </section>
      ))}
    </figure>
  );
}
