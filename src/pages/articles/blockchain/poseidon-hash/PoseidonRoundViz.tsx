export default function PoseidonRoundViz() {
  const items = [["Add constants", "xᵢ ← xᵢ+cᵢ"], ["Power S-box", "xᵢ ← xᵢᵅ"], ["MDS mixing", "x ← Mx"], ["Repeat profile", "R_F · R_P"]];
  return <figure data-viz="poseidon-round" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-semibold text-primary">ONE HADES ROUND</p><p className="mt-1 text-sm text-muted-foreground">
            표현 방식은 같은 flow이고 full/partial round는 S-box 적용 word 수만 다릅니다.
          </p></figcaption>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map(([a,b],i) => <div className="min-w-0 rounded-lg border border-border bg-background p-4" key={a}><span className="text-xs font-semibold text-primary">0{i+1}</span><p className="mt-2 text-sm font-semibold">{a}</p><p className="mt-1 break-words font-mono text-xs text-muted-foreground">{b}</p></div>)}</div>
  </figure>;
}
