const stages = [
  { step: "01", title: "Decision unit", question: "누구에게 무엇을 결정하나", artifact: "query · patient · order" },
  { step: "02", title: "Prediction → action", question: "점수를 어떻게 행동으로 바꾸나", artifact: "threshold · top-k · quantity" },
  { step: "03", title: "Error cost", question: "어느 실수가 얼마나 비싼가", artifact: "FP/FN · residual · missed gain" },
  { step: "04", title: "Metric receipt", question: "어떤 순서와 weight로 집계하나", artifact: "unit → slice → global" },
];

export default function MetricMattersViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Metric design contract</p>
      <h3 className="mt-1 max-w-3xl text-lg font-semibold">Metric 이름을 고르기 전에 네 개의 빈칸을 먼저 채웁니다</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {stages.map((stage) => (
          <div key={stage.step} className="min-w-0 rounded-lg border border-border/60 bg-background px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs font-semibold text-muted-foreground">{stage.step}</p>
              <p className="break-words text-right font-mono text-[11px] text-muted-foreground">{stage.artifact}</p>
            </div>
            <p className="mt-3 text-sm font-semibold">{stage.title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{stage.question}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">
        같은 prediction 파일도 이 계약이 달라지면 정답 metric과 model 순위가 달라질 수 있습니다.
      </div>
    </div>
  );
}
