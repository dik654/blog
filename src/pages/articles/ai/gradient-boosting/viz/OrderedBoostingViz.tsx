const rows = ["A", "C", "B", "D"];

export default function OrderedBoostingViz() {
  return (
    <figure data-viz="catboost-ordered-gradient" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Ordered boosting</p>
        <p className="mt-2 text-lg font-semibold">현재 row의 gradient는 그 row보다 앞선 prefix model에서 계산합니다</p>
      </figcaption>
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">Permutation σ</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {rows.map((row, index) => (
              <div key={row} className={`min-w-0 rounded-md border px-2 py-3 text-center ${row === "B" ? "border-primary/40 text-primary" : "border-border"}`}>
                <p className="text-[10px] text-muted-foreground">{index + 1}</p>
                <p className="mt-1 font-semibold">{row}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">B의 위치는 3입니다. A와 C만 B의 prefix에 속합니다.</p>
        </div>
        <div className="min-w-0 border-l border-border/70 pl-5">
          <p className="text-xs font-semibold text-muted-foreground">Row B의 update target</p>
          <div className="mt-3 space-y-3 text-sm">
            <p className="border-l border-primary/50 pl-3"><strong>fit</strong> · A, C로 F⁽&lt;B⁾ 구성</p>
            <p className="border-l border-primary/50 pl-3"><strong>predict</strong> · F⁽&lt;B⁾(xᴮ)</p>
            <p className="border-l border-primary/50 pl-3"><strong>differentiate</strong> · −∂ℓ(yᴮ,z)/∂z</p>
          </div>
          <p className="mt-4 rounded-md border border-primary/25 px-3 py-2 text-xs text-primary">B의 label은 prefix model fit에 사용되지 않음</p>
        </div>
      </div>
    </figure>
  );
}
