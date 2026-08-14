export default function ProofSQLFlowViz() {
  const items = [["Snapshot", "schema · rows · version"], ["SQL relation", "filter · aggregate"], ["Sumcheck/opening", "random point"], ["Transcript verify", "query · root · result"]];
  return <figure data-viz="proof-sql-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-semibold text-primary">PROOF OF SQL PIPELINE</p><p className="mt-1 text-sm text-muted-foreground">SELECT의 의미와 committed data opening을 마지막 challenge까지 연결합니다.</p></figcaption>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map(([a,b],i) => <div key={a} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-xs font-bold text-primary">0{i+1}</span><p className="mt-2 text-sm font-semibold">{a}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{b}</p></div>)}</div>
  </figure>;
}
