const STATES = [
  ["IN USE", "ref > 0", "한 개 이상의 block table이 참조", "eviction 불가"],
  ["CACHED · FREE", "ref = 0 + hash", "free queue에 있으나 cache hit 가능", "필요하면 eviction"],
  ["REALLOCATED", "old hash 제거", "새 request의 token에 재사용", "새 identity 기록"],
] as const;

export default function BlockLifecycleViz() {
  return (
    <figure data-viz="physical-block-lifecycle" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">BLOCK OWNERSHIP</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Reference가 사라져도 cached content는 eviction될 때까지 남을 수 있습니다</h3>
      </figcaption>
      <ol className="grid gap-3 p-5 sm:p-7 md:grid-cols-3">
        {STATES.map(([title, state, body, next], index) => <li key={title} className="min-w-0 rounded-lg border bg-background p-5"><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-bold text-primary">0{index+1}</span>{index<STATES.length-1&&<span className="hidden text-muted-foreground md:block">→</span>}</div><p className="mt-4 font-bold">{title}</p><code className="mt-2 inline-block text-xs text-primary">{state}</code><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p><p className="mt-3 border-t pt-3 text-xs font-semibold">{next}</p></li>)}
      </ol>
    </figure>
  );
}
