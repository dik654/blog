export default function LoraMatrixViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Shape trace · d=4096, r=8</p><p className="mt-1 font-semibold">작은 중간 폭이 update의 parameter 수와 rank 상한을 함께 정합니다</p></figcaption>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="border-y border-border py-4"><p className="text-xs font-semibold text-muted-foreground">Base branch · frozen</p><p className="mt-2 font-mono text-sm">x[4096] → W[4096×4096] → y₀[4096]</p><p className="mt-2 text-xs text-muted-foreground">16,777,216 base scalars</p></div>
        <span className="hidden text-muted-foreground lg:block" aria-hidden="true">＋</span>
        <div className="border-y border-border py-4"><p className="text-xs font-semibold text-primary">Adapter branch · trainable</p><p className="mt-2 font-mono text-sm">x[4096] → A[8×4096] → z[8] → B[4096×8] → Δy[4096]</p><p className="mt-2 text-xs text-muted-foreground">65,536 scalars · full matrix의 약 0.39%</p></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="border-l border-primary pl-3"><p className="text-xs font-semibold">Rank</p><p className="mt-1 text-sm">update 독립 방향 ≤ 8</p></div><div className="border-l border-border pl-3"><p className="text-xs font-semibold">Scale</p><p className="mt-1 text-sm">α/r convention 고정</p></div><div className="border-l border-border pl-3"><p className="text-xs font-semibold">Target</p><p className="mt-1 text-sm">실제 module path 확인</p></div></div>
    </figure>
  );
}
