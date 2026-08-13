const samples = [
  { y: 3.0, f0: 4.0, r: -1.0, h: -0.8, f1: 3.84 },
  { y: 5.0, f0: 4.0, r: 1.0, h: 0.8, f1: 4.16 },
  { y: 7.0, f0: 4.0, r: 3.0, h: 2.4, f1: 4.48 },
];

export default function ResidualLearningViz() {
  return (
    <figure data-viz="gradient-boosting-round" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">One boosting round · squared loss · η=.2</p>
        <p className="mt-2 text-lg font-semibold">현재 오차 방향을 tree가 근사하고 score에 조금 더합니다</p>
      </figcaption>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
        <div className="grid grid-cols-5 bg-muted/35 px-3 py-2 text-center text-[11px] font-semibold text-muted-foreground">
          <span>y</span><span>F₀</span><span>r=y−F₀</span><span>h₁</span><span>F₁</span>
        </div>
        {samples.map((sample, index) => (
          <div key={sample.y} className={`grid grid-cols-5 px-3 py-3 text-center font-mono text-sm ${index ? "border-t border-border/60" : ""}`}>
            <span>{sample.y.toFixed(1)}</span><span>{sample.f0.toFixed(1)}</span><span className="text-primary">{sample.r.toFixed(1)}</span><span>{sample.h.toFixed(1)}</span><span className="font-bold">{sample.f1.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid min-w-0 gap-4 border-t border-border/70 pt-4 sm:grid-cols-3">
        <p className="text-sm"><strong>Derivative target</strong><br/><span className="text-muted-foreground">squared loss에서만 residual과 일치</span></p>
        <p className="text-sm"><strong>Tree approximation</strong><br/><span className="text-muted-foreground">leaf 구간별로 r을 근사</span></p>
        <p className="text-sm"><strong>Shrinkage update</strong><br/><span className="text-muted-foreground">F₁=F₀+0.2h₁</span></p>
      </div>
    </figure>
  );
}
