const BLOCKS = [
  ["H₀", "system · policy", "parent = seed"],
  ["H₁", "few-shot examples", "parent = H₀"],
  ["H₂", "shared document", "parent = H₁"],
  ["MISS", "new user suffix", "새 prefill"],
] as const;

export default function PrefixHashViz() {
  return (
    <figure data-viz="prefix-cache-hash-chain" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7"><p className="text-xs font-bold text-primary">CHAINED BLOCK HASH</p><h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Parent hash가 앞선 token 순서를 cache key에 이어 붙입니다</h3></figcaption>
      <ol className="grid gap-3 p-5 sm:p-7 md:grid-cols-4">{BLOCKS.map(([hash,content,parent],index)=><li key={hash} className={`min-w-0 rounded-lg border p-5 ${hash==="MISS"?"border-amber-500/40 bg-amber-500/[0.05]":"bg-background"}`}><div className="flex items-center justify-between gap-3"><span className={`font-mono text-sm font-bold ${hash==="MISS"?"text-amber-700 dark:text-amber-300":"text-primary"}`}>{hash}</span>{index<BLOCKS.length-1&&<span className="hidden text-muted-foreground md:block">→</span>}</div><p className="mt-4 text-sm font-bold leading-6">{content}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{parent}</p></li>)}</ol>
    </figure>
  );
}
