import VizFrame from "@/components/viz/VizFrame";

export default function HybridAttentionViz() {
  return (
    <VizFrame
      eyebrow="Layer schedule"
      title="23개의 3×KDA + 1×MLA block 뒤에 마지막 MLA를 하나 더 둔다"
      description="3:1이라는 비율만 외우면 93개 layer 합계가 맞지 않습니다. 반복 block과 마지막 global layer를 분리해야 69 KDA와 24 Gated MLA가 됩니다."
    >
      <div className="grid gap-7 lg:grid-cols-[1fr_auto_0.42fr] lg:items-stretch">
        <section className="min-w-0 rounded-lg border border-border bg-background p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
            <p className="text-sm font-bold text-foreground">Hybrid block × 23</p>
            <span className="font-mono text-xs text-muted-foreground">4 layers / block</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
            {["KDA", "KDA", "KDA", "Gated MLA"].map((label, index) => (
              <div
                key={`${label}-${index}`}
                className={label === "KDA" ? "rounded-md border border-border bg-muted/25 px-2 py-4 text-center" : "rounded-md border border-primary/50 bg-primary/5 px-2 py-4 text-center"}
              >
                <p className="text-[11px] font-bold leading-4 text-foreground sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/70 pt-4 text-xs">
            <div><span className="text-muted-foreground">KDA</span><strong className="mt-1 block font-mono text-foreground">3 × 23 = 69</strong></div>
            <div><span className="text-muted-foreground">MLA</span><strong className="mt-1 block font-mono text-foreground">1 × 23 = 23</strong></div>
          </div>
        </section>
        <span aria-hidden className="hidden self-center text-muted-foreground lg:block">+</span>
        <section className="rounded-lg border border-primary/50 bg-primary/5 p-5">
          <p className="text-xs font-bold text-primary">Final layer</p>
          <p className="mt-3 text-sm font-bold text-foreground">Gated MLA</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">마지막 global interaction</p>
          <p className="mt-5 border-t border-primary/20 pt-4 font-mono text-xs font-bold text-foreground">23 + 1 = 24 MLA</p>
        </section>
      </div>
    </VizFrame>
  );
}
