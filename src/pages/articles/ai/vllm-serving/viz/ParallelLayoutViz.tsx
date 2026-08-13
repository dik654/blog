const MODES = [
  ["Data parallel", "Replica 전체", "독립 request queue와 KV pool을 늘림", "Routing·load balance·prefix locality"],
  ["Tensor parallel", "한 layer의 tensor", "한 model을 여러 GPU memory/compute에 분할", "매 layer collective와 interconnect"],
  ["Pipeline parallel", "연속 layer stage", "아주 큰 model을 stage별 GPU에 배치", "Pipeline bubble·stage imbalance"],
] as const;

export default function ParallelLayoutViz() {
  return (
    <figure data-viz="vllm-parallel-layout" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">PARALLEL AXES</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">무엇을 나누는지에 따라 늘어나는 capacity와 새 병목이 달라집니다</h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-3">
        {MODES.map(([mode, split, effect, cost]) => (
          <article key={mode} className="min-w-0 rounded-lg border bg-background p-5">
            <h4 className="font-bold">{mode}</h4>
            <dl className="mt-5 grid gap-4 text-sm">
              <div><dt className="text-xs font-bold text-muted-foreground">나누는 단위</dt><dd className="mt-1.5 leading-6">{split}</dd></div>
              <div><dt className="text-xs font-bold text-muted-foreground">얻는 것</dt><dd className="mt-1.5 leading-6">{effect}</dd></div>
              <div><dt className="text-xs font-bold text-muted-foreground">새로 확인할 비용</dt><dd className="mt-1.5 leading-6">{cost}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </figure>
  );
}
