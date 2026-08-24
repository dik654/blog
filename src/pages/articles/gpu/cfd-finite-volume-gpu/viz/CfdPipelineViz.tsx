const stages = [
  ["Cell state", "ρ · ρu · ρE", "보존량"],
  ["Face flux", "convective + diffusive", "이웃 교환"],
  ["Residual", "Σ face flux + source", "cell balance"],
  ["Update", "Uⁿ → Uⁿ⁺¹", "CFL 제한"],
] as const;

export function FiniteVolumePipelineViz() {
  return (
    <figure
      data-viz="cfd-finite-volume-pipeline"
      className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card"
    >
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">
          보존량 → face 교환 → 다음 상태
        </p>
        <p className="mt-1 text-base font-bold">
          Finite volume은 미분식을 cell 경계의 flux 장부로 바꾼다
        </p>
      </figcaption>
      <div
        data-viz-canvas
        className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"
      >
        {stages.map(([title, detail, receipt], index) => (
          <section
            key={title}
            className="relative min-w-0 rounded-lg border border-border bg-background p-4"
          >
            <p className="text-[11px] font-bold text-primary">0{index + 1}</p>
            <p className="mt-2 text-sm font-bold">{title}</p>
            <p className="mt-2 break-words font-mono text-xs text-foreground/80">
              {detail}
            </p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {receipt}
            </p>
            {index < stages.length - 1 ? (
              <span
                aria-hidden
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-card px-1 text-muted-foreground lg:block"
              >
                →
              </span>
            ) : null}
          </section>
        ))}
      </div>
    </figure>
  );
}

const mappings = [
  ["Cell-centered field", "연속 index · coalesced read/write", "SoA 후보"],
  ["Face connectivity", "owner/neighbour gather", "indirect access"],
  ["Halo state", "partition boundary exchange", "communication"],
  ["Linear solve", "SpMV·reduction·preconditioner", "global coupling"],
] as const;

export function CfdGpuMappingViz() {
  return (
    <figure
      data-viz="cfd-gpu-mapping"
      className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card"
    >
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">
          Mesh topology가 memory traffic을 만든다
        </p>
        <p className="mt-1 text-base font-bold">
          “GPU로 옮긴다”는 네 종류의 data path를 따로 최적화하는 일이다
        </p>
      </figcaption>
      <div data-viz-canvas className="grid gap-3 p-5 sm:p-6">
        {mappings.map(([field, path, bottleneck], index) => (
          <div
            key={field}
            className="grid min-w-0 gap-2 rounded-lg border border-border bg-background p-4 md:grid-cols-[2rem_10rem_1fr_8rem] md:items-center"
          >
            <span className="text-xs font-bold text-primary">0{index + 1}</span>
            <strong className="text-sm">{field}</strong>
            <span className="break-words text-xs leading-5 text-muted-foreground">
              {path}
            </span>
            <span className="font-mono text-xs text-foreground/75">
              {bottleneck}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
