const Arrow = () => (
  <span aria-hidden className="text-center text-sm text-muted-foreground">
    <span className="md:hidden">↓</span>
    <span className="hidden md:inline">→</span>
  </span>
);

function JobLane({
  label,
  steps,
}: {
  label: string;
  steps: readonly (readonly [string, string])[];
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="mb-3 text-xs font-bold text-primary">{label}</p>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {steps.map(([title, detail], index) => (
          <div className="contents" key={title}>
            <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
            {index < steps.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModernKzgGpuViz() {
  return (
    <figure data-viz="kzg-gpu-job-path" className="not-prose overflow-hidden rounded-xl border border-border bg-card" aria-labelledby="kzg-viz-title">
      <figcaption id="kzg-viz-title" className="border-b border-border px-5 py-4">
        <p className="text-xs font-semibold text-primary">한 opening 요청을 따라가기</p>
        <p className="mt-1 font-bold">GPU MSM은 commitment와 proof에서 쓰이고, 그 사이에는 exact quotient가 있다</p>
      </figcaption>

      <div data-viz-canvas className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs font-bold text-primary">Polynomial artifact</p>
            <p className="mt-2 text-sm font-semibold">a₀ … a₇ · coefficient form</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">field · degree · generation digest</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs font-bold text-primary">SRS artifact</p>
            <p className="mt-2 text-sm font-semibold">[τ⁰]G … [τ⁷]G</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">curve · basis · prefix · digest</p>
          </div>
        </div>

        <div aria-hidden className="text-center text-sm text-muted-foreground">↓</div>

        <JobLane label="Commitment job" steps={[["같은 index로 결합", "aᵢ ↔ [τⁱ]G"], ["GPU MSM", "Σ aᵢ[τⁱ]G"], ["Commitment C", "validated group encoding"]]} />

        <JobLane label="Opening job" steps={[["Claim", "z와 y=f(z)"], ["Exact quotient", "q=(f−y)/(X−z), remainder=0"], ["GPU MSM → π", "qᵢ ↔ [τⁱ]G"]]} />

        <div aria-hidden className="text-center text-sm text-muted-foreground">↓</div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Independent verifier</p>
          <p className="mt-1 text-sm font-semibold">C · z · y · π · 같은 SRS → pairing 검증 → receipt</p>
        </div>
      </div>
    </figure>
  );
}
