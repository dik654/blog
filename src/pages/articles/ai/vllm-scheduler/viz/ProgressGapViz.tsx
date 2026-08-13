const REQUESTS = [
  { id: "A", phase: "prefill", computed: "1,024", target: "3,024", need: "2,000" },
  { id: "B", phase: "decode", computed: "640", target: "641", need: "1" },
  { id: "C", phase: "spec verify", computed: "380", target: "385", need: "5" },
] as const;

export default function ProgressGapViz() {
  return (
    <figure data-viz="scheduler-progress-gap" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">COMMON TOKEN UNIT</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">단계 이름은 달라도 scheduler는 목표와 현재 위치의 차이를 봅니다</h3>
      </figcaption>
      <div className="grid gap-3 p-5 sm:p-7 md:grid-cols-3">
        {REQUESTS.map((request) => (
          <article key={request.id} className="min-w-0 rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <strong className="font-mono text-primary">Request {request.id}</strong>
              <span className="rounded-md border px-2 py-1 text-xs font-semibold text-muted-foreground">{request.phase}</span>
            </div>
            <dl className="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">computed</dt><dd className="font-mono font-semibold">{request.computed}</dd>
              <dt className="text-muted-foreground">target</dt><dd className="font-mono font-semibold">{request.target}</dd>
              <dt className="border-t pt-3 font-semibold">need</dt><dd className="border-t pt-3 font-mono font-bold text-primary">{request.need}</dd>
            </dl>
          </article>
        ))}
      </div>
    </figure>
  );
}
