const stateGroups = [
  {
    label: "시작",
    states: "Spawning",
    detail: "프로세스를 띄우고 화면 신호를 관찰",
  },
  {
    label: "게이트",
    states: "Trust / tool approval",
    detail: "승인 prompt를 task input과 분리",
  },
  {
    label: "전달",
    states: "ReadyForPrompt → Running",
    detail: "Ready일 때만 prompt를 보내고 수락을 관찰",
  },
  {
    label: "종료",
    states: "Finished · Failed",
    detail: "결과 또는 실패 evidence를 남김",
  },
] as const;

export function WorkerBootPathViz() {
  return (
    <figure
      data-viz="worker-boot-path"
      className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card"
    >
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">실제 pinned state machine</p>
        <p className="mt-1 text-base font-bold">프로세스 생성과 작업 전달 사이의 네 경계</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-4 p-5 sm:p-6 lg:grid-cols-4">
        {stateGroups.map((group, index) => (
          <section key={group.label} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-[11px] font-bold tracking-wide text-primary">0{index + 1} · {group.label}</p>
            <p className="mt-2 break-words text-sm font-bold leading-6">{group.states}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{group.detail}</p>
            {index < stateGroups.length - 1 ? (
              <span aria-hidden className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-card px-1 text-muted-foreground lg:block">→</span>
            ) : null}
          </section>
        ))}
      </div>
      <p className="border-t border-border bg-muted/25 px-5 py-3 text-xs leading-5 text-muted-foreground sm:px-6">
        ReadyForPrompt는 화면에 문자가 보였다는 뜻이 아니라, 구현이 정한 ready cue를 관찰했다는 상태입니다.
      </p>
    </figure>
  );
}

const signals = [
  ["Process", "프로세스 종료 여부와 lifecycle state"],
  ["Structured event", "state·event seq·task receipt"],
  ["Terminal cue", "trust·tool prompt와 ready 문구"],
  ["Timeout bundle", "마지막 state와 관찰 시각을 묶은 진단 자료"],
] as const;

export function WorkerEvidenceViz() {
  return (
    <figure
      data-viz="worker-evidence-priority"
      className="not-prose my-9 rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <figcaption>
        <p className="text-xs font-semibold text-primary">관찰 → 판정 → 다음 행동</p>
        <p className="mt-1 text-base font-bold">한 줄의 terminal text보다 evidence 묶음으로 판단한다</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="grid gap-3 sm:grid-cols-2">
          {signals.map(([title, body], index) => (
            <section key={title} className="min-w-0 rounded-lg border border-border bg-background p-4">
              <p className="text-[11px] font-bold text-primary">SIGNAL {index + 1}</p>
              <p className="mt-1 text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>
        <div className="hidden items-center px-1 text-muted-foreground lg:flex" aria-hidden>→</div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <section className="rounded-lg border border-amber-500/35 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold">승인 대기</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Prompt를 보내지 않고 trust·tool gate를 해결합니다.</p>
          </section>
          <section className="rounded-lg border border-emerald-500/35 bg-emerald-500/5 p-4">
            <p className="text-sm font-semibold">전달 허용</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Ready 상태에서 task receipt와 prompt를 함께 보냅니다.</p>
          </section>
          <section className="rounded-lg border border-rose-500/35 bg-rose-500/5 p-4">
            <p className="text-sm font-semibold">실패·재조사</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">근거가 부족하면 StartupNoEvidence로 남기고 자동 성공 처리하지 않습니다.</p>
          </section>
        </div>
      </div>
    </figure>
  );
}
