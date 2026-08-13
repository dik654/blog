const rows = [
  ["Origin 1", "Jan–Mar", "Apr", "May", "Jun"],
  ["Origin 2", "Jan–Jun", "Jul", "Aug", "Sep"],
  ["Origin 3", "Jan–Sep", "Oct", "Nov", "Dec"],
];

export default function TimeSeriesSplitViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Walk-forward ledger</p>
      <h3 className="mt-1 text-lg font-semibold">Label이 확정되지 않은 구간을 비운 뒤 미래를 평가합니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        {rows.map(([origin, train, labelDelay, gap, valid]) => (
          <div key={origin} className="grid gap-3 border-b border-border/50 px-4 py-4 last:border-b-0 lg:grid-cols-[0.8fr_1.4fr_0.8fr_0.8fr_0.8fr]">
            <p className="text-sm font-semibold">{origin}</p>
            <p className="text-xs"><span className="font-semibold">Train</span> · {train}</p>
            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Label delay</span> · {labelDelay}</p>
            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Gap</span> · {gap}</p>
            <p className="text-xs"><span className="font-semibold">Validate</span> · {valid}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
