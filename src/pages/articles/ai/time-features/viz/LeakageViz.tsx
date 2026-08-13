const folds = [
  ["Fold 1", "Jan–Mar", "Apr", "May"],
  ["Fold 2", "Jan–Apr", "May", "Jun"],
  ["Fold 3", "Jan–May", "Jun", "Jul"],
];

export default function LeakageViz() {
  return (
    <figure data-viz="rolling-origin-folds" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Rolling-origin backtest</p>
        <p className="mt-2 text-lg font-semibold">각 fold는 과거로 fit하고 다음 origin의 미래만 평가합니다</p>
      </figcaption>
      <div className="mt-6 min-w-0 rounded-lg border border-border/70">
        <div className="min-w-0">
          <div className="grid min-w-0 grid-cols-[3.5rem_1.35fr_.65fr_.8fr] gap-2 bg-muted/35 px-3 py-3 text-[11px] font-semibold text-muted-foreground sm:grid-cols-[5rem_1.5fr_.65fr_.8fr] sm:gap-3 sm:px-4 sm:text-xs">
            <span /><span>Train</span><span>Gap</span><span>Validate</span>
          </div>
          {folds.map(([name, train, gap, validation]) => (
            <div key={name} className="grid min-w-0 grid-cols-[3.5rem_1.35fr_.65fr_.8fr] gap-2 border-t border-border/60 px-3 py-4 text-xs sm:grid-cols-[5rem_1.5fr_.65fr_.8fr] sm:gap-3 sm:px-4 sm:text-sm">
              <p className="font-semibold">{name}</p>
              <p className="border-b border-sky-500/45 pb-2">{train}</p>
              <p className="border-b border-border pb-2 text-muted-foreground">{gap}</p>
              <p className="border-b border-amber-500/55 pb-2">{validation}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">최종 test period는 fold 선택·feature ablation·hyperparameter tuning이 끝날 때까지 열지 않습니다.</p>
    </figure>
  );
}
