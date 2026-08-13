const rows = [
  ["작은 오차", "r = 1", "|r| = 1", "r² = 1", "비슷한 기여"],
  ["큰 오차", "r = 9", "|r| = 9", "r² = 81", "RMSE 쪽에서 강하게 확대"],
  ["Point target", "한 수", "조건부 중앙값", "조건부 평균", "목표 중심도 달라짐"],
  ["Interval", "[L, U]", "coverage", "width", "두 축을 함께 보고"],
];

export default function RegressionMetricsViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Regression loss geometry</p>
      <h3 className="mt-1 text-lg font-semibold">Residual에 적용하는 곡선이 model의 목표와 큰 오류의 비중을 바꿉니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="hidden grid-cols-[1fr_.8fr_1fr_1fr_1.45fr] gap-4 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>상황</span><span>입력</span><span>Absolute</span><span>Squared</span><span>판단</span>
        </div>
        {rows.map(([scene, input, absolute, squared, note]) => (
          <div key={scene} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_.8fr_1fr_1fr_1.45fr] md:items-center md:gap-4 md:py-3">
            <p className="text-sm font-semibold">{scene}</p>
            <p className="font-mono text-xs">{input}</p>
            <p className="text-xs text-foreground/80">{absolute}</p>
            <p className="text-xs text-foreground/80">{squared}</p>
            <p className="text-xs leading-5 text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
