const layers = [
  { label: "Ranking", output: "score order", asks: "Positive를 먼저 세우나", metrics: "ROC-AUC · PR-AUC" },
  { label: "Probability", output: "p ∈ [0,1]", asks: "0.8이 실제 80%인가", metrics: "log loss · Brier" },
  { label: "Decision", output: "action 0 / 1", asks: "선택한 threshold가 비용에 맞나", metrics: "precision · recall · cost" },
];

export default function ClassificationMetricsViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Three evaluation layers</p>
      <h3 className="mt-1 text-lg font-semibold">같은 score를 평가해도 질문과 출력 단위가 서로 다릅니다</h3>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {layers.map((layer, index) => (
          <div key={layer.label} className="min-w-0 rounded-lg border border-border/60 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{layer.label}</p>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="mt-3 break-words font-mono text-xs text-foreground/80">{layer.output}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{layer.asks}</p>
            <p className="mt-4 border-t border-border/50 pt-3 text-xs font-medium">{layer.metrics}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">AUC가 좋아져도 probability와 특정 threshold의 action이 좋아졌다고 결론 내리지 않습니다.</p>
    </div>
  );
}
