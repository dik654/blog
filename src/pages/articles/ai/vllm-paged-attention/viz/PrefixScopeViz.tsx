const REQUESTS = [
  ["A · 첫 계산", "0 cached", "35 prefill", "답 생성은 별도"],
  ["B · 이후 hit", "32 cached", "3 prefill", "답 생성은 별도"],
] as const;

export default function PrefixScopeViz() {
  return (
    <figure data-viz="prefix-cache-scope" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7"><p className="text-xs font-bold text-primary">WHAT APC SAVES</p><h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">공유 prefix의 prefill은 줄지만 각 요청의 suffix와 output decode는 남습니다</h3></figcaption>
      <div className="grid gap-3 p-5 sm:p-7">{REQUESTS.map(([name,hit,miss,decode])=><article key={name} className="grid min-w-0 gap-3 rounded-lg border bg-background p-4 grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))]"><strong>{name}</strong><span className="rounded-md border border-primary/30 bg-primary/[0.05] px-3 py-3 text-center text-xs font-semibold">{hit}</span><span className="rounded-md border px-3 py-3 text-center text-xs font-semibold">{miss}</span><span className="rounded-md border border-amber-500/35 bg-amber-500/[0.05] px-3 py-3 text-center text-xs font-semibold">{decode}</span></article>)}</div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t bg-muted/15 px-5 py-4 text-xs text-muted-foreground sm:px-7"><span><strong className="text-primary">cached</strong> · 건너뛴 prefill</span><span><strong className="text-foreground">prefill</strong> · 새 suffix</span><span><strong className="text-amber-700 dark:text-amber-300">output</strong> · 새 답은 계속 생성</span></div>
    </figure>
  );
}
