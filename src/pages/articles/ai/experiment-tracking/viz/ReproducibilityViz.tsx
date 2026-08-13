const levels = [
  ["Bitwise", "artifact digest exact", "같은 bytes가 필수인 audit"],
  ["Numerical", "abs + relative tolerance", "kernel order 차이를 허용"],
  ["Statistical", "seed mean · spread", "stochastic training claim"],
  ["Behavioral", "metric + critical slices", "운영 승인과 rollback"],
];

export default function ReproducibilityViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Reproduction acceptance ladder</p>
      <h3 className="mt-1 text-lg font-semibold">필요한 같음의 수준을 먼저 정하고 아래 단계부터 순서대로 검사합니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        {levels.map(([level, test, use], index) => (
          <div key={level} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 md:grid-cols-[.7fr_1.1fr_1.6fr] md:items-center md:gap-5 md:py-3">
            <div className="flex items-center gap-3"><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span><p className="text-sm font-semibold">{level}</p></div>
            <p className="font-mono text-xs">{test}</p>
            <p className="text-xs leading-5 text-muted-foreground">{use}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border/60 bg-background px-4 py-3">
        <p className="text-xs font-semibold">Clean-room receipt</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">input digest → environment/image → command → first divergence → artifact/metric verdict</p>
      </div>
    </div>
  );
}
