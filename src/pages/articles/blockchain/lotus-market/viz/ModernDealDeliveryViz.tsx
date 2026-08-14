const DEAL = ["proposal", "piece 검증", "chain publish", "sector activation"] as const;
const RETRIEVAL = ["discover", "negotiate", "transfer", "verify bytes"] as const;

function Lane({ title, steps, accent }: { title: string; steps: readonly string[]; accent: string }) {
  return <section className="min-w-0 rounded-lg border border-border p-4"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${accent}`} /><h3 className="font-semibold">{title}</h3></div><ol className="mt-4 grid min-w-0 gap-2 sm:grid-cols-4">{steps.map((step, index) => <li key={step} className="min-w-0 rounded-lg bg-muted/30 p-3"><p className="font-mono text-xs text-primary">0{index + 1}</p><p className="mt-2 break-words text-sm font-medium">{step}</p></li>)}</ol></section>;
}

export default function ModernDealDeliveryViz() {
  return <div data-viz="filecoin-deal-retrieval-separation" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">같은 content · 서로 다른 completion contract</p><div className="mt-4 grid gap-4"><Lane title="Storage deal" steps={DEAL} accent="bg-sky-500" /><Lane title="Retrieval delivery" steps={RETRIEVAL} accent="bg-emerald-500" /></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Sector proof가 valid하더라도 provider endpoint·index·unseal·transport가 실패하면 retrieval은 완료되지 않습니다.</p></div>;
}
