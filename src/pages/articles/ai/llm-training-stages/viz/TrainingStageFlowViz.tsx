function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 18" className="h-5 w-7 shrink-0 rotate-90 text-primary md:rotate-0">
      <path d="M1 9 H24 M19 4 L24 9 L19 14" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const stages = [
  ["Pretraining", "Corpus의 next-token pattern", "언어·지식·code·latent representation"],
  ["Continued / mid", "새 domain·길이·분포", "기반 capability의 노출 범위 조정"],
  ["Post-training", "Demonstration·preference·reward·teacher", "원하는 response policy와 복구 행동"],
  ["Agent harness", "Tool·environment·memory·verifier", "여러 turn의 실제 task completion"],
] as const;

export default function TrainingStageFlowViz() {
  return (
    <figure
      data-viz="llm-training-stage-flow"
      data-viz-canvas="llm-training-stage-flow-canvas"
      className="not-prose min-w-0 overflow-hidden rounded-lg border border-border bg-background"
    >
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <h3 className="font-black">모델 weight와 실행 환경이 바뀌는 지점을 분리합니다</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">뒤 단계가 앞 단계를 대체하지 않습니다. 서로 다른 input과 평가 단위를 추가합니다.</p>
      </figcaption>
      <div className="flex min-w-0 flex-col items-center gap-3 p-5 md:flex-row md:items-stretch md:p-6">
        {stages.map(([name, input, output], index) => (
          <div key={name} className="contents">
            <div className="w-full min-w-0 flex-1 rounded-lg border border-border p-4">
              <p className="text-xs font-black text-primary">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-black">{name}</p>
              <dl className="mt-4 space-y-3 text-sm leading-6">
                <div><dt className="text-xs font-bold text-muted-foreground">학습·실행 입력</dt><dd>{input}</dd></div>
                <div><dt className="text-xs font-bold text-muted-foreground">주로 바꾸는 것</dt><dd>{output}</dd></div>
              </dl>
            </div>
            {index < stages.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
    </figure>
  );
}
