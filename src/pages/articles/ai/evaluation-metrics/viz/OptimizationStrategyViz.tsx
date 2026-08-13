const stages = [
  { title: "Train", data: "training folds", chooses: "model parameters θ", measure: "surrogate loss" },
  { title: "Select", data: "validation / OOF", chooses: "config λ · policy τ", measure: "primary + guardrails" },
  { title: "Report", data: "untouched outer test", chooses: "아무것도 다시 고르지 않음", measure: "frozen metric receipt" },
];

export default function OptimizationStrategyViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Information boundary</p>
      <h3 className="mt-1 text-lg font-semibold">한 model을 완성하는 세 단계가 서로 다른 값을 결정합니다</h3>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <div key={stage.title} className="min-w-0 rounded-lg border border-border/60 bg-background p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">{stage.title}</p>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <dl className="mt-4 space-y-3 text-xs">
              <div><dt className="text-muted-foreground">Data</dt><dd className="mt-1 break-words font-medium">{stage.data}</dd></div>
              <div><dt className="text-muted-foreground">결정</dt><dd className="mt-1 break-words font-medium">{stage.chooses}</dd></div>
              <div><dt className="text-muted-foreground">관찰</dt><dd className="mt-1 break-words font-medium">{stage.measure}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">Outer test를 본 뒤 config나 threshold를 바꾸는 순간 그 test는 Select 단계의 data가 됩니다.</p>
    </div>
  );
}
