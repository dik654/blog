const stages = [
  ["01", "계약 검사", "cutoff · source · 상수 · 중복"],
  ["02", "후보 진단", "permutation · grouped ablation"],
  ["03", "재학습", "같은 fold · seed · tuning budget"],
  ["04", "배포 판정", "quality · latency · parity · drift"],
];

export default function SelectionViz() {
  return (
    <figure data-viz="feature-selection-evidence-loop" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Selection evidence loop</p>
        <p className="mt-2 text-lg font-semibold">중요도는 제거 후보를 만들고, 재학습 결과가 결정을 내립니다</p>
      </figcaption>

      <ol className="mt-6 grid min-w-0 gap-5 md:grid-cols-4">
        {stages.map(([number, title, detail], index) => (
          <li key={number} className="relative min-w-0 border-t border-primary/45 pt-4">
            <p className="text-xs font-bold text-primary/70">{number}</p>
            <p className="mt-2 font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            {index < stages.length - 1 ? <span className="absolute -right-3 top-3 hidden text-xs text-muted-foreground md:block" aria-hidden="true">→</span> : null}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid min-w-0 gap-4 border-t border-border/70 pt-5 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">개별 permutation이 낮아도</p>
          <p className="mt-2 text-sm leading-6">상관된 두 피처가 서로 대체하면 둘을 함께 제거했을 때만 성능이 떨어질 수 있습니다.</p>
        </div>
        <div className="min-w-0 sm:border-l sm:border-border/70 sm:pl-4">
          <p className="text-xs font-semibold text-muted-foreground">승인 조건</p>
          <p className="mt-2 text-sm leading-6">품질 열화 허용치 안에서 serving 비용과 장애 범위가 실제로 줄었는지 확인합니다.</p>
        </div>
      </div>
    </figure>
  );
}
