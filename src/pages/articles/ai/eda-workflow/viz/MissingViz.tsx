export default function MissingViz() {
  const mechanisms = [
    ["MCAR", "관측값·결측값과 무관", "수집 장애 가설을 확인"],
    ["MAR", "관측된 다른 변수로 설명", "group-aware imputation 후보"],
    ["MNAR", "관측되지 않은 값과 연결", "indicator와 수집 과정 검토"],
  ];
  return (
    <div data-viz data-viz-canvas className="min-w-0 rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Missingness workflow</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">비율 → 패턴 → 수집 원인 → 처리 실험</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {mechanisms.map(([name, meaning, action]) => (
          <article key={name} className="min-w-0 rounded-lg border border-border/70 p-4">
            <p className="font-mono text-sm font-bold text-primary">{name}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{meaning}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{action}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border/70 p-4">
        <p className="text-sm font-semibold text-foreground">Fold 안에서 비교할 baseline</p>
        <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-4">
          {["NaN 유지", "단순 대체", "모델 기반 대체", "missing indicator"].map((item) => (
            <span key={item} className="rounded border border-border/70 px-3 py-2 text-center">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
