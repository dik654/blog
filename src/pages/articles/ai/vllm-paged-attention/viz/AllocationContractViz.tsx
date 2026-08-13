const STEPS = [
  ["LOOKUP", "cache hit와 existing blocks"],
  ["DEMAND", "new token + lookahead slots"],
  ["ALLOCATE", "free pool에서 부족분 확보"],
  ["RETURN", "new block IDs 또는 실패"],
] as const;

export default function AllocationContractViz() {
  return (
    <figure data-viz="kv-manager-allocation-contract" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7"><p className="text-xs font-bold text-primary">SCHEDULER → KV MANAGER</p><h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Token 계획을 cache lookup·slot demand·physical allocation으로 낮춥니다</h3></figcaption>
      <ol className="grid gap-3 p-5 sm:p-7 md:grid-cols-4">{STEPS.map(([title,body],index)=><li key={title} className="min-w-0 rounded-lg border bg-background p-5"><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-bold text-primary">0{index+1}</span>{index<STEPS.length-1&&<span className="hidden text-muted-foreground md:block">→</span>}</div><p className="mt-4 font-bold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></li>)}</ol>
      <div className="grid gap-3 border-t bg-muted/15 p-5 text-sm sm:grid-cols-2 sm:p-7"><p className="rounded-md border bg-background px-4 py-3"><strong className="text-primary">성공</strong><br/><span className="text-muted-foreground">block table 확장 후 worker 실행</span></p><p className="rounded-md border bg-background px-4 py-3"><strong className="text-amber-700 dark:text-amber-300">실패</strong><br/><span className="text-muted-foreground">scheduler가 batch 축소·preemption 판단</span></p></div>
    </figure>
  );
}
