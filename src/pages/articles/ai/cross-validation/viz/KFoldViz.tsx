const rows = [
  ["Fold 1", "01 02 03 04", "05", "loss .21"],
  ["Fold 2", "01 02 03 05", "04", "loss .18"],
  ["Fold 3", "01 02 04 05", "03", "loss .27"],
  ["Fold 4", "01 03 04 05", "02", "loss .22"],
  ["Fold 5", "02 03 04 05", "01", "loss .17"],
];

export default function KFoldViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">OOF rotation</p>
      <h3 className="mt-1 text-lg font-semibold">각 행은 자신을 학습하지 않은 model에서 prediction을 한 번 받습니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="hidden grid-cols-[0.7fr_1.3fr_0.7fr_0.7fr] gap-4 border-b border-border/60 bg-muted/35 px-4 py-2 text-xs font-semibold text-muted-foreground sm:grid">
          <span>실행</span><span>train partition</span><span>valid</span><span>receipt</span>
        </div>
        {rows.map(([fold, train, valid, receipt]) => <div key={fold} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[0.7fr_1.3fr_0.7fr_0.7fr] sm:gap-4 sm:py-3"><span className="text-sm font-semibold">{fold}</span><span className="font-mono text-xs text-muted-foreground">{train}</span><span className="font-mono text-xs font-semibold">{valid}</span><span className="text-xs text-muted-foreground">{receipt}</span></div>)}
      </div>
    </div>
  );
}
