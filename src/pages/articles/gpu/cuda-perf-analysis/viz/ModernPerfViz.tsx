const loop = [
  ["Locate", "전체 timeline의 병목"],
  ["Bound", "상한·전체 이득 계산"],
  ["Explain", "Traffic·stall counter"],
  ["Change", "변수 하나만 변경"],
  ["Verify", "정확도·paired 재측정"],
] as const;

export function PerfLoopViz() {
  return (
    <figure data-viz="cuda-perf-loop" className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-5 py-4 sm:px-6"><p className="text-xs font-semibold text-primary">Profile-driven optimization</p><p className="mt-1 text-base font-bold">Counter를 모으는 것이 아니라 가설을 반증하는 순서다</p></figcaption>
      <div data-viz-canvas className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-5">
        {loop.map(([title, body], index) => <section key={title} className="relative min-w-0 rounded-lg border border-border bg-background p-4"><p className="text-[11px] font-bold text-primary">0{index + 1}</p><p className="mt-2 text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>{index < loop.length - 1 ? <span aria-hidden className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-card px-1 text-muted-foreground lg:block">→</span> : null}</section>)}
      </div>
    </figure>
  );
}

export function MetricBoundaryViz() {
  const rows = [
    ["CPU wall time", "요청→결과", "launch·copy·wait 포함"],
    ["GPU event time", "한 stream 구간", "kernel 또는 device 단계"],
    ["Achieved GB/s", "defined/actual bytes ÷ time", "memory 활용"],
    ["Achieved FLOP/s", "defined FLOPs ÷ time", "compute 활용"],
    ["Occupancy/stalls", "resident·issue 관찰", "느린 이유의 단서"],
  ] as const;
  return <figure data-viz="cuda-metric-boundaries" className="not-prose my-9 rounded-xl border border-border bg-card p-5 sm:p-6"><figcaption><p className="text-xs font-semibold text-primary">서로 다른 질문, 서로 다른 측정 경계</p><p className="mt-1 text-base font-bold">Kernel time과 사용자가 기다린 시간을 섞지 않는다</p></figcaption><div data-viz-canvas className="mt-5 grid gap-3">{rows.map(([metric,boundary,meaning])=><div key={metric} className="grid min-w-0 gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-[9rem_11rem_1fr]"><strong className="text-sm">{metric}</strong><span className="text-xs text-primary">{boundary}</span><span className="min-w-0 break-words text-xs text-muted-foreground">{meaning}</span></div>)}</div></figure>;
}
