export function PolicyEvaluationViz() {
  const stages = [["Snapshot", "lane-17의 현재 field"], ["Match", "각 condition은 true/false"], ["Order", "priority 오름차순·stable tie"], ["Expand", "Chain을 여러 action으로 펼침"], ["Emit", "모든 matching action 반환"]] as const;
  return (
    <figure data-viz="claw-policy-evaluation" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-semibold">Policy engine은 충돌을 판정하지 않고 일치한 action을 순서대로 반환한다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Block과 Merge가 함께 match하면 현재 snapshot만으로는 둘 중 하나가 자동 승리하지 않습니다.</p></figcaption>
      <div className="grid gap-3 md:grid-cols-5">{stages.map(([title, detail], index) => <div key={title} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-[11px] font-semibold text-primary">0{index + 1}</span><p className="mt-2 text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p></div>)}</div>
    </figure>
  );
}

export function GreenContractViz() {
  const checks = [["Level", "workspace 이상"], ["Test", "command + exit 0"], ["Base", "fresh = true"], ["Recovery", "context recorded"], ["Flake", "blocking 항목 없음"]] as const;
  return (
    <figure data-viz="claw-green-contract" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6"><p className="text-sm font-semibold">Green은 색 하나가 아니라 evidence의 conjunction이다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">다섯 조건 가운데 하나라도 빠지면 merge-ready contract는 만족하지 않습니다.</p></figcaption>
      <div className="grid gap-px bg-border/70 sm:grid-cols-5">{checks.map(([label, detail]) => <div key={label} className="min-w-0 bg-background p-4"><p className="text-xs font-semibold text-primary">{label}</p><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{detail}</p></div>)}</div>
    </figure>
  );
}
