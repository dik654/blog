const rungs = [
  ["r", "27", "같은 update에서 27개 비교", "상위 9개"],
  ["3r", "9", "resource를 3배 늘려 재평가", "상위 3개"],
  ["9r", "3", "후보별 충분한 fidelity 확인", "상위 1개"],
  ["full", "1 + backups", "pruning 없이 multi-seed 재실행", "outer gate"],
];

export default function PruningViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Successive-halving resource ledger · η = 3</p>
      <h3 className="mt-1 text-lg font-semibold">후보 수를 줄이는 대신 살아남은 후보의 관측 깊이를 늘립니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        {rungs.map(([resource, trials, action, next], index) => (
          <div key={resource} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[3rem_4rem_1.5fr_1fr] sm:items-center sm:gap-4 sm:py-3">
            <p className="font-mono text-sm font-semibold">{resource}</p>
            <p className="text-sm">{trials}</p>
            <p className="text-xs leading-5 text-foreground/80">{action}</p>
            <p className="text-xs leading-5 text-muted-foreground">{index < 3 ? `다음 · ${next}` : next}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <p className="rounded-md border border-border/50 px-3 py-2">전제 · early rank ↔ final rank</p>
        <p className="rounded-md border border-border/50 px-3 py-2">단위 · update / token / sample</p>
        <p className="rounded-md border border-border/50 px-3 py-2">보정 · final full-budget rerun</p>
      </div>
    </div>
  );
}
