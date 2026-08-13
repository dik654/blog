const curve = [
  ["run A", "update 1,000", "1.0M tokens", "loss .31"],
  ["run B", "update 1,000", "4.0M tokens", "loss .24"],
  ["run B", "update 250", "1.0M tokens", "loss .35"],
];

export default function WandBFlowViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Metric axis · artifact version</p>
      <h3 className="mt-1 text-lg font-semibold">Chart의 같은 x좌표가 같은 학습 자원을 뜻하는지 확인합니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="hidden grid-cols-[.8fr_1fr_1fr_1fr] gap-4 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground sm:grid">
          <span>Run</span><span>Update</span><span>Seen data</span><span>Metric</span>
        </div>
        {curve.map((row, index) => (
          <div key={`${row[0]}-${row[1]}-${index}`} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[.8fr_1fr_1fr_1fr] sm:gap-4 sm:py-3">
            {row.map((value, cell) => <p key={`${value}-${cell}`} className={cell === 0 ? "text-sm font-semibold" : "font-mono text-xs text-muted-foreground"}>{value}</p>)}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-lg border border-border/60 bg-background px-4 py-3"><p className="font-mono text-xs font-semibold">model:v17</p><p className="mt-1 text-xs text-muted-foreground">immutable · digest 91ca…</p></div>
        <p className="text-center font-mono text-[11px] text-muted-foreground">candidate alias →</p>
        <div className="rounded-lg border border-border/60 bg-background px-4 py-3"><p className="font-mono text-xs font-semibold">resolve at approval</p><p className="mt-1 text-xs text-muted-foreground">receipt pins v17</p></div>
      </div>
    </div>
  );
}
