const STAGES = [
  ["candidate", "peer head", "untrusted"],
  ["headers", "ancestor range", "ancestry"],
  ["messages", "BLS · secp", "message root"],
  ["replay", "parent state", "state · receipts"],
  ["adopt", "weight · fence", "head change"],
] as const;

export default function ModernChainSyncViz() {
  return <div data-viz="lotus-chainsync-pipeline" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">candidate → verified local head</p>
    <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {STAGES.map(([title, input, check], index) => <article key={title} className="min-w-0 rounded-lg border border-border bg-muted/20 p-4">
        <p className="font-mono text-xs text-primary">0{index + 1}</p><h3 className="mt-2 font-semibold">{title}</h3>
        <p className="mt-2 break-words text-sm text-foreground/80">{input}</p><p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">검사 · {check}</p>
      </article>)}
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"><p className="rounded-lg border border-border p-3 text-sm"><strong>실패:</strong> 기존 head를 유지하고 candidate generation을 폐기합니다.</p><p className="rounded-lg border border-border p-3 text-sm"><strong>성공:</strong> common ancestor 기준 revert/apply를 알립니다.</p></div>
  </div>;
}
