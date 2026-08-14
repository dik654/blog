export function RapidsnarkBoundaryViz() {
  return (
    <div data-viz="rapidsnark-current-vs-gpu-boundary" className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">pinned implementation vs proposed adapter</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="font-semibold">현재 rapidsnark · CPU</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[["WTNS + zkey", "header admission"], ["thread pool", "coefficients · FFT"], ["CPU MSM", "proof JSON"]].map(([title, detail]) => <div key={title} className="min-w-0 rounded-md border border-border bg-background p-3"><p className="break-words text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p></div>)}
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-primary/50 bg-primary/[0.03] p-4">
          <p className="font-semibold">별도 구현이 필요한 GPU adapter</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[["profile digest", "field · order · lengths"], ["NTT/MSM offload", "residency · completion"], ["parity receipt", "CPU fallback · rollback"]].map(([title, detail]) => <div key={title} className="min-w-0 rounded-md border border-border bg-background p-3"><p className="break-words text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
