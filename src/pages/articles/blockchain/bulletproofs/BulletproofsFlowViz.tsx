const steps = [
  ["01", "Commit", "V=wG+rH"],
  ["02", "Bit relation", "w=0·1+0·2+1·4"],
  ["03", "IPA fold", "8 → 4 → 2 → 1"],
  ["04", "Verify", "range + same V"],
];

export default function BulletproofsFlowViz() {
  return <figure data-viz="bulletproofs-range-flow" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
    <figcaption><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Commitment → range relation → IPA</p><p className="mt-2 text-sm leading-6 text-muted-foreground">같은 hidden w가 commitment와 bit relation 양쪽에 들어가고, 긴 relation만 logarithmic rounds로 접습니다.</p></figcaption>
    <div className="mt-5 grid gap-3 md:grid-cols-4">{steps.map(([n,name,value],i)=><div key={n} className="relative min-w-0 rounded-lg border border-border/80 bg-background p-4"><p className="text-xs font-bold text-primary">{n}</p><p className="mt-2 text-sm font-semibold">{name}</p><p className="mt-3 break-words font-mono text-xs">{value}</p>{i<3&&<span aria-hidden className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted-foreground md:block">→</span>}</div>)}</div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3"><p className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs"><strong>Hiding</strong><br/><span className="text-muted-foreground">Random blinding r</span></p><p className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs"><strong>Binding</strong><br/><span className="text-muted-foreground">DLP·independent generators</span></p><p className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs"><strong>Soundness</strong><br/><span className="text-muted-foreground">Commit-first transcript</span></p></div>
  </figure>;
}
