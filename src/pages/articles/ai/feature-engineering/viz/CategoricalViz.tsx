const rows = [
  { id: "A", category: "red", target: 1, fold: 1 },
  { id: "B", category: "red", target: 0, fold: 2 },
  { id: "C", category: "blue", target: 1, fold: 3 },
];

export default function CategoricalViz() {
  return (
    <figure data-viz="categorical-cross-fitting" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Cross-fitted target encoding</p>
        <p className="mt-2 text-lg font-semibold">각 row의 label을 가린 상태에서 category 통계를 만듭니다</p>
      </figcaption>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="min-w-0 overflow-hidden rounded-lg border border-border/70">
          <div className="grid grid-cols-4 bg-muted/35 px-3 py-2 text-xs font-semibold text-muted-foreground">
            <span>row</span><span>category</span><span>y</span><span>fold</span>
          </div>
          {rows.map((row, index) => (
            <div key={row.id} className={`grid grid-cols-4 px-3 py-3 text-sm ${index ? "border-t border-border/60" : ""}`}>
              <span>{row.id}</span><span>{row.category}</span><span>{row.target}</span><span>F{row.fold}</span>
            </div>
          ))}
        </div>

        <div className="hidden h-16 w-px bg-border lg:block" aria-hidden="true" />

        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">Row A를 변환할 때</p>
          <ol className="mt-3 space-y-3 text-sm">
            <li className="border-l border-primary/50 pl-3"><strong>1.</strong> A가 속한 F1 전체를 통계에서 제외</li>
            <li className="border-l border-primary/50 pl-3"><strong>2.</strong> 남은 fold의 red target만 집계</li>
            <li className="border-l border-primary/50 pl-3"><strong>3.</strong> count가 작으면 전체 평균으로 smoothing</li>
          </ol>
          <div className="mt-4 flex min-w-0 items-center justify-between gap-3 rounded-lg border border-primary/25 px-3 py-2">
            <span className="min-w-0 text-sm text-muted-foreground">A의 encoding</span>
            <span className="shrink-0 font-mono text-sm font-bold text-primary">TE⁽⁻F1⁾(red)</span>
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">Validation·test에는 training mapping만 사용하고, 처음 보는 category에는 미리 정한 fallback을 적용합니다.</p>
    </figure>
  );
}
