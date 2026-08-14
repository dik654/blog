const stages = [
  ["Global A·B", "필요한 tile을 협력 load"],
  ["Shared tiles", "block 안에서 값을 재사용"],
  ["Thread accumulators", "K축 곱을 register에 누산"],
  ["Global C", "유효한 output만 store"],
] as const;

export function GemmDataflowViz() {
  return (
    <figure data-viz="gemm-dataflow" className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">같은 계산, 다른 traffic</p>
        <p className="mt-1 text-base font-bold">타일링은 곱셈 수가 아니라 global memory에서 다시 읽는 횟수를 줄인다</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {stages.map(([title, body], index) => (
          <section key={title} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-[11px] font-bold text-primary">0{index + 1}</p>
            <p className="mt-2 break-words text-sm font-bold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
            {index < stages.length - 1 ? <span aria-hidden className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-card px-1 text-muted-foreground lg:block">→</span> : null}
          </section>
        ))}
      </div>
    </figure>
  );
}

const tileSteps = [
  ["Load", "A 4×4 + B 4×4", "32 values"],
  ["Reuse", "각 value를 4 outputs에", "4× reuse"],
  ["Compute", "16 outputs × 4 MAC", "64 MAC"],
] as const;

export function TileReuseViz() {
  return (
    <figure data-viz="gemm-tile-reuse" className="not-prose my-9 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption>
        <p className="text-xs font-semibold text-primary">4×4 교육용 tile · FP32</p>
        <p className="mt-1 text-base font-bold">한 번 stage한 값을 여러 output 계산이 나눠 쓴다</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-4 md:grid-cols-3">
        {tileSteps.map(([title, body, metric]) => (
          <section key={title} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-bold">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            <p className="mt-3 font-mono text-sm font-semibold text-primary">{metric}</p>
          </section>
        ))}
      </div>
    </figure>
  );
}

export function GemmMeasurementViz() {
  const rows = [
    ["정확도", "CPU/library reference · odd M/N/K"],
    ["Kernel", "warm-up 뒤 CUDA events · median/p95"],
    ["Traffic", "requested/actual bytes · achieved GB/s"],
    ["Compute", "defined FLOPs/time · achieved FLOP/s"],
    ["Resources", "register · shared bytes · occupancy · stalls"],
  ] as const;
  return (
    <figure data-viz="gemm-measurement" className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">Correctness → timing → explanation</p>
        <p className="mt-1 text-base font-bold">빠른 숫자 하나가 아니라 재현 가능한 측정 묶음으로 채택한다</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-3 p-5 sm:p-6">
        {rows.map(([label, detail], index) => (
          <div key={label} className="grid min-w-0 gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-[2rem_7rem_1fr] sm:items-center">
            <span className="text-xs font-bold text-primary">0{index + 1}</span>
            <strong className="text-sm">{label}</strong>
            <span className="min-w-0 break-words text-xs leading-5 text-muted-foreground">{detail}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
