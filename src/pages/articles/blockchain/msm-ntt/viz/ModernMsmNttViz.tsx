const cells = [
  { title: "MSM", input: "points + scalars", work: "window → buckets → reduction", sync: "bucket conflicts · final reduction", accent: "border-sky-500/45 bg-sky-500/5" },
  { title: "NTT", input: "field coefficients", work: "log₂N butterfly stages", sync: "stage boundary · twiddle order", accent: "border-emerald-500/45 bg-emerald-500/5" },
];

export function MsmNttWorkloadViz() {
  return (
    <figure className="rounded-xl border border-border bg-card p-4 sm:p-6" aria-labelledby="msm-ntt-viz-title">
      <figcaption id="msm-ntt-viz-title" className="mb-5">
        <p className="text-sm font-semibold text-primary">같은 GPU, 다른 dependency</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">두 연산을 같은 “대규모 병렬 계산”으로 묶지 않고 입력·병렬 단위·동기화 경계를 나란히 봅니다.</p>
      </figcaption>
      <div className="grid gap-4 lg:grid-cols-2">
        {cells.map((cell) => (
          <div key={cell.title} className={`rounded-lg border p-4 ${cell.accent}`}>
            <div className="flex items-center justify-between gap-3"><strong>{cell.title}</strong><span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">fixed workload</span></div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">입력</dt><dd className="mt-1 break-words">{cell.input}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">계산</dt><dd className="mt-1 break-words">{cell.work}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">기다림</dt><dd className="mt-1 break-words">{cell.sync}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="rounded-lg border border-border bg-background p-4 text-sm"><strong>correctness receipt</strong><p className="mt-1 text-muted-foreground">CPU reference와 exact field/point parity</p></div>
        <span className="hidden text-muted-foreground md:block" aria-hidden="true">→</span>
        <div className="rounded-lg border border-primary/45 bg-primary/5 p-4 text-sm"><strong>routing decision</strong><p className="mt-1 text-muted-foreground">resident bytes · kernel timeline · end-to-end</p></div>
      </div>
    </figure>
  );
}
