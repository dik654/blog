import VizFrame from "@/components/viz/VizFrame";

const lanes = [
  ["Training", "정답 prefix y*<t", "각 target position의 NLL", "분기하지 않는 한 경로"],
  ["Inference", "model prefix ŷ<t", "greedy·beam·sampling", "선택이 다음 조건을 바꿈"],
];

export default function TrainInferenceGapViz() {
  return (
    <VizFrame
      eyebrow="Teacher forcing boundary"
      title="같은 decoder라도 training과 inference에서는 prefix를 가져오는 곳이 다릅니다"
      description="이 차이를 exposure bias라고 부르지만, 모든 오류가 시간에 따라 반드시 폭발한다는 일반 법칙은 아닙니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {lanes.map(([name, prefix, objective, consequence]) => (
          <article key={name} className="rounded-lg border border-border/70 bg-background p-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <dl className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-5">
              <dt className="text-muted-foreground">Prefix</dt><dd className="font-mono text-primary">{prefix}</dd>
              <dt className="text-muted-foreground">계산</dt><dd>{objective}</dd>
              <dt className="text-muted-foreground">결과</dt><dd>{consequence}</dd>
            </dl>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
