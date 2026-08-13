const EVENTS = [
  ["RUNNING", "8,000 token 계산", "KV block 소유"],
  ["PRESSURE", "새 block 할당 실패", "victim 선택"],
  ["PREEMPT", "block 해제·counter reset", "WAITING 앞쪽으로 이동"],
  ["RESUME", "prefix hit 확인", "나머지 token 재계산"],
] as const;

export default function PreemptionTraceViz() {
  return (
    <figure data-viz="kv-preemption-recompute-trace" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">KV PRESSURE TRACE</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Memory를 즉시 돌려받는 대신 이후 계산과 queue 시간을 더 지불합니다</h3>
      </figcaption>
      <ol className="grid gap-3 p-5 sm:p-7 md:grid-cols-4">
        {EVENTS.map(([title, action, state], index) => (
          <li key={title} className="min-w-0 rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>{index < EVENTS.length - 1 && <span className="hidden text-muted-foreground md:block">→</span>}</div>
            <p className="mt-4 font-bold">{title}</p>
            <p className="mt-2 text-sm font-semibold leading-6">{action}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{state}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 border-t bg-muted/15 p-5 text-sm sm:grid-cols-2 sm:p-7">
        <p className="rounded-md border bg-background px-4 py-3"><strong className="text-primary">즉시 얻는 것</strong><br/><span className="mt-1 inline-block text-muted-foreground">다른 요청에 배정할 free KV block</span></p>
        <p className="rounded-md border bg-background px-4 py-3"><strong className="text-amber-700 dark:text-amber-300">나중에 치르는 것</strong><br/><span className="mt-1 inline-block text-muted-foreground">requeue + prefix 복구 + recomputation</span></p>
      </div>
    </figure>
  );
}
