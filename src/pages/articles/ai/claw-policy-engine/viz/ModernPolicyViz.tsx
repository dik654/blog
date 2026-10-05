export function PolicyEvaluationViz() {
  const stages = [
    ["01 · SNAPSHOT", "lane-17", "green=2 · scoped · reviewed · fresh · retry=0"],
    ["02 · P10", "Retry match", "retry_count < retry_limit가 true이므로 Retry를 첫 후보로 넣습니다."],
    ["03 · P20", "Merge match", "green ∧ scoped ∧ reviewed가 true이므로 MergeToDev도 남습니다."],
    ["04 · P20", "Notify match", "같은 priority에서는 입력 순서를 stable하게 유지해 Notify가 뒤에 옵니다."],
    ["05 · RESULT", "세 action 모두 emit", "[Retry, MergeToDev, Notify]이며 conflict 해결은 별도 enforcer의 책임입니다."],
  ] as const;
  return (
    <figure data-viz="claw-policy-evaluation" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-semibold">lane-17에서는 Retry가 먼저 나와도 Merge와 Notify가 함께 남습니다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Priority는 후보 순서를 정합니다. 서로 충돌하는 action 가운데 하나를 자동으로 선택하는 승패 규칙은 아닙니다.</p></figcaption>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{stages.map(([label, title, detail]) => <section key={label} className="min-w-0 rounded-lg border border-border bg-background p-3 last:col-span-2 sm:p-4 md:last:col-span-1"><span className="break-words text-[10px] font-semibold tracking-wide text-primary">{label}</span><p className="mt-2 break-words text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p></section>)}</div>
      <p className="mt-4 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">Boolean field가 true라는 사실과 그 값을 만든 test·review evidence의 provenance는 별도입니다. Executor는 context와 artifact generation을 다시 묶어야 합니다.</p>
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
