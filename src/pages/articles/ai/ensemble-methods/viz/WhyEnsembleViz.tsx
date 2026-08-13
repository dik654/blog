const rows = [
  ["row 017", "+0.8", "+0.7", "같이 과대 예측 · 상쇄 작음"],
  ["row 042", "+0.6", "−0.5", "반대 방향 · 평균에서 상쇄"],
  ["row 118", "−0.4", "+0.3", "반대 방향 · 평균에서 상쇄"],
  ["row 203", "−0.7", "−0.8", "공통 failure slice 조사"],
];

export default function WhyEnsembleViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Row-aligned error ledger</p>
      <h3 className="mt-1 text-lg font-semibold">모델 이름이 아니라 같은 OOF 행에서 error 방향을 나란히 봅니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="grid gap-2 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground sm:grid-cols-[.8fr_.65fr_.65fr_1.5fr] sm:gap-5">
          <span>OOF row</span><span>error A</span><span>error B</span><span>결합 해석</span>
        </div>
        {rows.map(([row, a, b, note]) => (
          <div key={row} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[.8fr_.65fr_.65fr_1.5fr] sm:gap-5 sm:py-3">
            <p className="font-mono text-xs font-semibold">{row}</p><p className="font-mono text-sm">{a}</p><p className="font-mono text-sm">{b}</p><p className="text-xs leading-5 text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">같은 방향의 큰 error가 반복되는 group·time·class slice는 앙상블보다 data·feature·label 문제를 먼저 조사합니다.</p>
    </div>
  );
}
