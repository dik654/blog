const BEFORE = [
  ["A", "decode", "계속 진행"],
  ["B", "decode", "이번 step 완료"],
  ["C", "waiting", "아직 대기"],
] as const;
const AFTER = [
  ["A", "decode", "다음 token"],
  ["B", "done", "batch에서 제거"],
  ["C", "prefill", "빈 자리에 합류"],
] as const;

function BatchColumn({ title, rows }: { title: string; rows: typeof BEFORE | typeof AFTER }) {
  return (
    <article className="min-w-0 rounded-lg border bg-background p-5">
      <h4 className="text-sm font-bold">{title}</h4>
      <div className="mt-4 grid gap-2">
        {rows.map(([id, phase, state]) => (
          <div key={id} className="grid min-w-0 grid-cols-[2rem_4.5rem_1fr] items-center gap-2 rounded-md border bg-muted/20 px-3 py-3 text-xs">
            <strong className="font-mono text-primary">{id}</strong><span className="font-semibold">{phase}</span><span className="min-w-0 text-right leading-5 text-muted-foreground">{state}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function ContinuousBatchViz() {
  return (
    <figure data-viz="continuous-batching-iteration" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">ITERATION-LEVEL BATCHING</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">완료된 B의 자리를 기다리던 C가 다음 GPU iteration에 사용합니다</h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-[1fr_2rem_1fr] md:items-center">
        <BatchColumn title="Iteration N" rows={BEFORE} />
        <div className="text-center text-muted-foreground"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></div>
        <BatchColumn title="Iteration N + 1" rows={AFTER} />
      </div>
    </figure>
  );
}
