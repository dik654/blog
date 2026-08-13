export default function BlendingViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Holdout blending · α = .20</p>
      <h3 className="mt-1 text-lg font-semibold">한 번의 분할이 base capacity와 meta evidence를 동시에 정합니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="grid sm:grid-cols-[4fr_1fr]">
          <div className="border-b border-border/50 px-4 py-5 sm:border-b-0 sm:border-r"><p className="text-sm font-semibold">Base fit · 8,000 rows</p><p className="mt-2 text-xs leading-5 text-muted-foreground">전처리와 모든 base parameters를 학습합니다. Blend rows는 보지 않습니다.</p></div>
          <div className="px-4 py-5"><p className="text-sm font-semibold">Meta fit · 2,000</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Unseen predictions로 combiner를 학습합니다.</p></div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <p className="rounded-md border border-border/50 px-3 py-2">얻음 · 구현 단순성</p><p className="rounded-md border border-border/50 px-3 py-2">지불 · base data 20%</p><p className="rounded-md border border-border/50 px-3 py-2">위험 · holdout 분산</p>
      </div>
    </div>
  );
}
