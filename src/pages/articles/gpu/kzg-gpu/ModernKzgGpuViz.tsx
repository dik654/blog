export function ModernKzgGpuViz() {
  return (
    <figure className="not-prose rounded-xl border border-border bg-card p-5" aria-labelledby="kzg-viz-title">
      <figcaption id="kzg-viz-title" className="text-sm font-bold">Polynomial proof workload: 입력부터 verifier receipt까지</figcaption>
      <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-4">
        {[
          ["polynomial", "form·domain·degree receipt"],
          ["SRS prefix", "curve·digest·subgroup 확인"],
          ["GPU MSM", "commitment 또는 quotient proof"],
          ["artifact", "독립 verifier 승인·backend SHA"],
        ].map(([title, description], index) => (
          <div key={title} className="relative min-w-0 rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-[11px] font-semibold text-primary">0{index + 1}</p><p className="mt-1 break-words text-sm font-bold">{title}</p><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{description}</p>
            {index < 3 ? <span aria-hidden className="absolute -right-2 top-1/2 hidden h-px w-2 bg-border md:block" /> : null}
          </div>
        ))}
      </div>
    </figure>
  );
}
