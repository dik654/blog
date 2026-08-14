export function ProofPipelineDagViz() {
  const stages = [
    ["witness", "CPU / dependency-bound"], ["polynomials", "field buffers"], ["NTT / INTT", "stage barriers"], ["MSM", "points + scalars"], ["assemble", "proof bytes"], ["verify", "independent gate"],
  ];
  return (
    <figure className="rounded-xl border border-border bg-card p-4 sm:p-6" aria-labelledby="proof-pipeline-viz-title">
      <figcaption id="proof-pipeline-viz-title"><p className="text-sm font-semibold text-primary">증명은 kernel 목록이 아니라 dependency DAG다</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Transcript challenge와 buffer 생산·소비 순서가 허용하는 구간에서만 transfer와 compute를 겹칩니다.</p></figcaption>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map(([title, detail], index) => <li key={title} className="min-w-0 rounded-lg border border-border bg-background p-4"><div className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/45 bg-primary/5 text-xs font-semibold text-primary">{index + 1}</span><strong className="break-words">{title}</strong></div><p className="mt-2 break-words text-sm text-muted-foreground">{detail}</p></li>)}
      </ol>
      <div className="mt-5 rounded-lg border border-primary/45 bg-primary/5 p-4 text-sm"><strong>같은 workload receipt</strong><p className="mt-1 leading-6 text-muted-foreground">circuit · SRS · transcript · backend SHA · input seed · warm-up · synchronization boundary · verifier result</p></div>
    </figure>
  );
}
