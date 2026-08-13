const LOGICAL = ["L0 · 0–15", "L1 · 16–31", "L2 · 32–47"];
const PHYSICAL = ["P7", "P2", "P9"];

export default function BlockAddressViz() {
  return (
    <figure data-viz="paged-kv-address-translation" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">BLOCK TABLE LOOKUP</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Token 37 → logical L2 → physical P9의 offset 5</h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-[1fr_3rem_1fr_3rem_1fr] lg:items-center">
        <article className="rounded-lg border bg-background p-5"><p className="text-xs font-bold text-muted-foreground">LOGICAL POSITION</p><p className="mt-3 font-mono text-2xl font-bold">j = 37</p><p className="mt-2 text-sm text-muted-foreground">floor(37/16)=2<br/>37 mod 16=5</p></article>
        <p className="text-center text-muted-foreground"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></p>
        <article className="rounded-lg border bg-background p-5"><p className="text-xs font-bold text-muted-foreground">REQUEST BLOCK TABLE</p><div className="mt-3 grid gap-2">{LOGICAL.map((item,index)=><p key={item} className={`rounded-md border px-3 py-2 text-xs font-semibold ${index===2?"border-primary/40 bg-primary/[0.06]":"bg-muted/20"}`}>{item} → {PHYSICAL[index]}</p>)}</div></article>
        <p className="text-center text-muted-foreground"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></p>
        <article className="rounded-lg border border-primary/35 bg-primary/[0.04] p-5"><p className="text-xs font-bold text-primary">PHYSICAL READ</p><p className="mt-3 font-mono text-2xl font-bold">P9[5]</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Physical ID 순서와 logical sequence 순서는 독립입니다.</p></article>
      </div>
    </figure>
  );
}
