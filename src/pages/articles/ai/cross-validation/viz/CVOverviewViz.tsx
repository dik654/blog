const rows = [
  ["새 행", "같은 모집단의 독립 행", "K-fold · stratified", "같은 entity·시간 의존성이 없음"],
  ["새 entity", "처음 보는 환자·사용자·장비", "Group split", "모든 파생 행을 group 한쪽에 둠"],
  ["미래", "다음 기간의 예측 origin", "Walk-forward", "과거 학습→미래 평가·label 지연 반영"],
  ["새 site + 미래", "새 병원·공장의 다음 기간", "Group × time", "두 경계를 동시에 만족"],
];

export default function CVOverviewViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Deployment question → split</p>
      <h3 className="mt-1 text-lg font-semibold">Split 이름보다 배포에서 무엇이 새로 나타나는지를 먼저 고릅니다</h3>
      <div className="mt-5 divide-y divide-border/60 rounded-lg border border-border/60">
        {rows.map(([novelty, unit, split, invariant]) => (
          <div key={novelty} className="grid gap-2 px-4 py-4 md:grid-cols-[0.7fr_1.15fr_0.8fr_1.35fr] md:gap-5">
            <p className="text-sm font-semibold">{novelty}</p>
            <p className="text-sm">{unit}</p>
            <p className="text-xs font-semibold text-foreground">{split}</p>
            <p className="text-xs leading-5 text-muted-foreground">검사 · {invariant}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
