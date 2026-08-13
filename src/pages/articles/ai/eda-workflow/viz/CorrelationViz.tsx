export default function CorrelationViz() {
  const rows = [
    ["Pearson", "선형 관계", "곡선 관계와 집단 차이를 놓칠 수 있음"],
    ["Spearman", "단조 관계", "비단조 패턴과 동률이 많은 값에 주의"],
    ["Slice plot", "시간 · group별 안정성", "표본 수와 confounder를 함께 확인"],
  ];
  return (
    <div data-viz className="rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">Association, not causation</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">하나의 상관계수로 관계를 확정하지 않습니다</h3>
      <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
        {rows.map(([method, sees, limit], index) => (
          <div key={method} className={"grid gap-2 p-4 sm:grid-cols-[0.7fr_1fr_1.5fr] " + (index ? "border-t border-border/60" : "")}>
            <p className="font-semibold text-foreground">{method}</p>
            <p className="text-sm text-muted-foreground">{sees}</p>
            <p className="text-sm leading-5 text-muted-foreground">{limit}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {["scatter로 모양 확인", "split마다 재계산", "누출 · 공통 원인 점검"].map((item) => (
          <p key={item} className="rounded-lg bg-violet-500/[0.06] px-3 py-2 text-center text-sm text-violet-800 dark:text-violet-200">{item}</p>
        ))}
      </div>
    </div>
  );
}
