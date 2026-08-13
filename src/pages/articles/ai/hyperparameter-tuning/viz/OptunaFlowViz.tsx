const flow = [
  ["01", "Study", "direction · space v3", "비교할 optimization task"],
  ["02", "Sampler", "history → λₜ₊₁", "다음 configuration 제안"],
  ["03", "Objective", "fixed fold · budget", "학습하고 metric 반환"],
  ["04", "Pruner", "step r · intermediate y", "자원 계속 배정 여부"],
  ["05", "Storage", "COMPLETE · PRUNED · FAIL", "lineage와 재개 상태"],
];

export default function OptunaFlowViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Optuna execution trace</p>
      <h3 className="mt-1 text-lg font-semibold">Study 안에서 제안·실행·중단·저장을 서로 다른 책임으로 둡니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        {flow.map(([number, role, state, responsibility]) => (
          <div key={role} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[2.25rem_6rem_1fr_1.2fr] sm:items-center sm:gap-4 sm:py-3">
            <p className="text-xs font-semibold text-muted-foreground">{number}</p>
            <p className="text-sm font-semibold">{role}</p>
            <p className="break-words font-mono text-xs text-foreground/80">{state}</p>
            <p className="text-xs leading-5 text-muted-foreground">{responsibility}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Storage의 trial state를 삭제하지 않아야 sampler가 본 history와 실패 경계를 다시 구성할 수 있습니다.</p>
    </div>
  );
}
