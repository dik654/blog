const leaves = [
  ["parent", "G=−6 · H=8", "G²/(H+λ)"],
  ["left", "Gᴸ=−5 · Hᴸ=3", "Gᴸ²/(Hᴸ+λ)"],
  ["right", "Gᴿ=−1 · Hᴿ=5", "Gᴿ²/(Hᴿ+λ)"],
];

export default function XGBoostSplitViz() {
  return (
    <figure data-viz="xgboost-split-statistics" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">XGBoost split statistics</p>
        <p className="mt-2 text-lg font-semibold">Split은 child의 2차 개선 합이 parent와 비용을 넘는지 묻습니다</p>
      </figcaption>
      <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="min-w-0">
          <div className="mx-auto max-w-52 border-b border-border/70 pb-4 text-center">
            <p className="text-xs text-muted-foreground">candidate threshold</p>
            <p className="mt-2 font-mono text-sm">feature ≤ 4.5</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-border/70 pr-4"><p className="text-xs text-muted-foreground">left</p><p className="mt-1 font-mono text-sm">Gᴸ, Hᴸ</p></div>
            <div><p className="text-xs text-muted-foreground">right</p><p className="mt-1 font-mono text-sm">Gᴿ, Hᴿ</p></div>
          </div>
        </div>
        <div className="min-w-0 divide-y divide-border/60 border-y border-border/70">
          {leaves.map(([name, values, term]) => (
            <div key={name} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[3.5rem_1fr_1fr] sm:gap-4">
              <p className="text-xs font-bold text-primary">{name}</p>
              <p className="font-mono text-xs text-muted-foreground">{values}</p>
              <p className="min-w-0 break-words font-mono text-xs">{term}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">Histogram builder는 row별 G·H를 feature bin에 누적해 같은 gain 후보를 더 적은 threshold로 평가합니다.</p>
    </figure>
  );
}
