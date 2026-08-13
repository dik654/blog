const REQUESTS = [
  ["Request A", "3,072 cached", "1,024 prefill", "500 decode"],
  ["Request B", "3,072 cached", "256 prefill", "80 decode"],
] as const;

export default function PrefixScopeViz() {
  return (
    <figure data-viz="prefix-cache-scope" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7"><p className="text-xs font-bold text-primary">WHAT APC SAVES</p><h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">공유 prefix의 prefill은 줄지만 각 요청의 suffix와 output decode는 남습니다</h3></figcaption>
      <div className="grid gap-3 p-5 sm:p-7">{REQUESTS.map(([name,hit,miss,decode])=><article key={name} className="grid min-w-0 gap-3 rounded-lg border bg-background p-4 sm:grid-cols-[7rem_1.3fr_1fr_1fr] sm:items-center"><strong>{name}</strong><span className="rounded-md border border-primary/30 bg-primary/[0.05] px-3 py-3 text-center text-xs font-semibold">{hit}</span><span className="rounded-md border px-3 py-3 text-center text-xs font-semibold">{miss}</span><span className="rounded-md border border-amber-500/35 bg-amber-500/[0.05] px-3 py-3 text-center text-xs font-semibold">{decode}</span></article>)}</div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t bg-muted/15 px-5 py-4 text-xs text-muted-foreground sm:px-7"><span><strong className="text-primary">cached</strong> · 건너뛴 prefill</span><span><strong className="text-foreground">prefill</strong> · 새 suffix</span><span><strong className="text-amber-700 dark:text-amber-300">decode</strong> · 그대로 반복</span></div>
    </figure>
  );
}
