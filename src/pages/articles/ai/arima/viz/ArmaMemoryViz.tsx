const paths = [
  ["AR(p)", "과거 값 Y′", "관성·mean reversion", "φ"],
  ["MA(q)", "과거 innovation ε", "충격의 잔여 효과", "θ"],
] as const;

export default function ArmaMemoryViz() {
  return (
    <figure data-viz="arma-memory" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">AR과 MA는 서로 다른 과거를 읽는다</p></figcaption>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
        {paths.map(([name,input,meaning,coef])=><div key={name} className="rounded-lg border border-border/70 bg-background p-4"><div className="flex items-center justify-between gap-3"><p className="font-mono text-sm font-black text-primary">{name}</p><span className="rounded-md border border-border/70 px-2 py-1 font-mono text-xs">{coef}</span></div><div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs"><span className="rounded-md bg-muted/35 p-3 text-center">{input}</span><span className="text-muted-foreground">→</span><span className="rounded-md border border-primary/25 bg-primary/[0.04] p-3 text-center">{meaning}</span></div></div>)}
      </div>
    </figure>
  );
}
