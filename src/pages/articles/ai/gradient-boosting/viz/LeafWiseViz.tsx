type NodeProps = { label: string; active?: boolean };
function Node({ label, active = false }: NodeProps) {
  return <span className={`inline-flex min-w-0 items-center justify-center rounded-md border px-2 py-1 text-xs ${active ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>{label}</span>;
}

export default function LeafWiseViz() {
  return (
    <figure data-viz="lightgbm-growth-allocation" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Tree growth allocation</p>
        <p className="mt-2 text-lg font-semibold">같은 두 번의 추가 split을 어느 leaf에 배분할지가 다릅니다</p>
      </figcaption>
      <div className="mt-6 grid min-w-0 gap-6 sm:grid-cols-2">
        <section className="min-w-0 border-t border-border/80 pt-4">
          <p className="font-semibold">Level-wise</p>
          <p className="mt-1 text-xs text-muted-foreground">같은 depth의 양쪽 leaf를 확장</p>
          <div className="mt-5 flex flex-col items-center gap-3">
            <Node label="root" />
            <div className="h-3 w-px bg-border" />
            <div className="grid w-full grid-cols-2 gap-4 text-center"><Node label="L split" active/><Node label="R split" active/></div>
            <div className="grid w-full grid-cols-4 gap-2 text-center"><Node label="L₁"/><Node label="L₂"/><Node label="R₁"/><Node label="R₂"/></div>
          </div>
        </section>
        <section className="min-w-0 border-t border-primary/45 pt-4">
          <p className="font-semibold">Leaf-wise</p>
          <p className="mt-1 text-xs text-muted-foreground">현재 gain이 가장 큰 branch를 다시 확장</p>
          <div className="mt-5 flex flex-col items-center gap-3">
            <Node label="root" />
            <div className="h-3 w-px bg-border" />
            <div className="grid w-full grid-cols-2 gap-4 text-center"><Node label="L"/><Node label="R split" active/></div>
            <div className="grid w-full grid-cols-[1fr_1fr_1fr] gap-2 text-center"><span/><Node label="R₁"/><Node label="R₂ split" active/></div>
          </div>
        </section>
      </div>
      <p className="mt-6 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">Leaf-wise는 training gain을 집중하지만 branch depth가 빠르게 커질 수 있어 num_leaves와 minimum leaf sample이 함께 필요합니다.</p>
    </figure>
  );
}
