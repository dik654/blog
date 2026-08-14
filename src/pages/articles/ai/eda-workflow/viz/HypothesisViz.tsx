export default function HypothesisViz() {
  const flow = [
    ["Observation", "특정 시간대에 지연이 큼"],
    ["Hypothesis", "주문량을 통제해도 인력 부족과 연결되는가?"],
    ["Test", "group·time split에서 slice와 ablation 비교"],
    ["Decision", "효과·반례·불확실성을 실험 기록에 연결"],
  ];
  return (
    <div data-viz data-viz-canvas className="min-w-0 rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">From chart to experiment</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">차트의 인상을 검증 가능한 질문으로 바꿉니다</h3>
      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        {flow.map(([title, body], index) => (
          <article key={title} className="min-w-0 rounded-lg border border-border/70 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <p className="font-semibold text-foreground">{title}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 border-l border-border pl-4 text-sm text-muted-foreground">
        data version · slice · 집계 코드 · metric을 함께 남겨야 다음 실험에서 같은 가설을 재현할 수 있습니다.
      </p>
    </div>
  );
}
