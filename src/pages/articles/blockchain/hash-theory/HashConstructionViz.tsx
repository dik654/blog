const steps = [
  ["01", "Canonical bytes", "type · length · order"],
  ["02", "Compression / sponge", "blocks 또는 rate"],
  ["03", "Domain-separated digest", "algorithm · suffix · n bits"],
  ["04", "Protocol use", "Merkle · transcript · KDF"],
];

export default function HashConstructionViz() {
  return <figure data-viz="hash-construction" className="not-prose overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-semibold text-primary">HASH CONTRACT</p><p className="mt-1 text-sm text-muted-foreground">의미가 digest가 되기까지 어느 경계도 암묵적으로 두지 않습니다.</p></figcaption>
    <div className="grid gap-3 lg:grid-cols-4">{steps.map(([n,title,sub],i)=><div key={n} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary">{n}</span><strong className="min-w-0 text-sm">{title}</strong></div>
      <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{sub}</p>{i<steps.length-1&&<span className="absolute -bottom-3 left-1/2 hidden h-px w-0 bg-border lg:-right-3 lg:bottom-auto lg:left-auto lg:top-1/2 lg:block lg:w-3"/>}
    </div>)}</div>
  </figure>;
}
