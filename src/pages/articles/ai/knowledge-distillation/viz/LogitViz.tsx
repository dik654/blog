const distributions = [
  ["Teacher, T=1", [0.93, 0.06, 0.01]],
  ["Teacher, T=3", [0.62, 0.25, 0.13]],
  ["Student target", [0.62, 0.25, 0.13]],
] as const;

export default function LogitViz() {
  return <figure data-viz className="overflow-hidden rounded-xl border border-border bg-card">
    <figcaption className="border-b border-border px-4 py-4 sm:px-5"><p className="text-xs font-semibold text-muted-foreground">Soft-target trace</p><h3 className="mt-1 text-base font-semibold">Temperature는 순서를 유지하면서 class 사이의 관계를 드러냅니다</h3></figcaption>
    <div className="grid gap-px bg-border md:grid-cols-[1.25fr_.85fr]">
      <section className="bg-card p-4 sm:p-5">
        <div className="grid grid-cols-[1.2fr_repeat(3,.55fr)] border-b border-border pb-2 text-xs font-medium text-muted-foreground"><span>분포</span><span>고양이</span><span>여우</span><span>자동차</span></div>
        {distributions.map(([label, values])=><div key={label} className="grid grid-cols-[1.2fr_repeat(3,.55fr)] border-b border-border/70 py-3 text-sm last:border-b-0"><strong>{label}</strong>{values.map((v,i)=><span key={i} className="font-mono text-muted-foreground">{v.toFixed(2)}</span>)}</div>)}
      </section>
      <section className="bg-card p-4 sm:p-5"><p className="text-sm font-semibold">Combined objective</p><div className="mt-4 space-y-3 text-sm"><div className="border-l border-foreground/30 pl-3"><p className="font-medium">Hard label CE</p><p className="mt-1 text-xs leading-5 text-muted-foreground">실제 정답 anchor</p></div><div className="border-l border-foreground/30 pl-3"><p className="font-medium">T² · KL</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Teacher relation과 gradient scale</p></div><div className="border-t border-border pt-3 text-xs leading-5 text-muted-foreground">Alpha·T는 같은 validation split에서 함께 선택합니다.</div></div></section>
    </div>
  </figure>;
}
