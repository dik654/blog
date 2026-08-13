const rows = [
  ["GAN", "real ↔ fake comparison", "G(z)", "Mode coverage"],
  ["Score", "∇x log pₜ(x)", "SDE · ODE", "Solver calls"],
  ["DDPM", "ε at noise level t", "reverse denoise", "Step budget"],
] as const;

export default function SignalSamplingViz() {
  return (
    <figure
      data-viz="signal-sampling"
      className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">
          학습 신호와 sampling algorithm을 함께 비교합니다
        </p>
      </figcaption>
      <div className="grid gap-3 p-4 sm:p-6 md:grid-cols-3">
        {rows.map(([family, signal, sampling, bottleneck]) => (
          <section
            key={family}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="font-mono text-sm font-black text-primary">
              {family}
            </p>
            <dl className="mt-4 grid min-w-0 grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-5">
              <dt className="font-semibold text-foreground/75">학습 신호</dt>
              <dd className="min-w-0 break-words text-muted-foreground">
                {signal}
              </dd>
              <dt className="font-semibold text-foreground/75">Sampling</dt>
              <dd className="min-w-0 break-words text-muted-foreground">
                {sampling}
              </dd>
              <dt className="font-semibold text-foreground/75">주요 병목</dt>
              <dd className="min-w-0 break-words text-muted-foreground">
                {bottleneck}
              </dd>
            </dl>
          </section>
        ))}
      </div>
    </figure>
  );
}
