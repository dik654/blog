export default function HybridKvCaseViz() {
  return (
    <figure
      data-viz="hybrid-kv-case"
      className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">T=4,096 · W=1,024 · 8 layers</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          같은 local attention도 block을 돌려줄 때만 14,336 layer-token이 됩니다
        </h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="space-y-3 rounded-xl border bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">HYBRID ALLOCATOR ON</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="rounded-lg bg-amber-500/10 p-3 font-mono text-sm">
              2G × 4,096 = <strong>8,192</strong>
            </p>
            <p className="rounded-lg bg-primary/10 p-3 font-mono text-sm">
              6L × 1,024 = <strong>6,144</strong>
            </p>
          </div>
          <p className="border-t pt-3 font-mono text-sm font-bold">
            합계 14,336 layer-token
          </p>
        </div>
        <span className="text-center text-xs font-bold text-muted-foreground">대비</span>
        <div className="space-y-3 rounded-xl border bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">LOCAL BLOCK RECLAIM OFF</p>
          <p className="rounded-lg bg-rose-500/10 p-3 font-mono text-sm">
            8 layers × 4,096 = <strong>32,768</strong>
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Kernel은 최근 1,024개만 읽어도 allocator가 오래된 block을 붙잡고 있으면
            physical pool은 줄지 않습니다.
          </p>
        </div>
      </div>
    </figure>
  );
}
