const rows = [
  ["Logit", "같은 class / vocab", "probability relation", "KL + hard-label CE"],
  ["Feature", "mapped hidden positions", "intermediate representation", "projection + feature loss"],
  ["Sequence", "shared text semantics", "selected teacher behavior", "student-tokenized NLL"],
  ["On-policy", "shared token distribution", "student-visited prefix", "student rollout + teacher KL"],
  ["Self teacher", "same task interface", "previous generation signal", "independent gain audit"],
] as const;

const labels = ["필요한 대응", "전달하는 대상", "학습 경로"] as const;

export default function OverviewViz() {
  return (
    <figure data-viz data-viz-canvas className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Teacher signal contract</p>
        <h3 className="mt-1 text-base font-semibold">공유할 수 있는 interface가 distillation loss를 정합니다</h3>
      </figcaption>
      <div className="hidden grid-cols-[.85fr_1.15fr_1.35fr_1.35fr] border-b border-border bg-muted/25 px-5 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
        <span>신호</span><span>필요한 대응</span><span>전달하는 대상</span><span>학습 경로</span>
      </div>
      {rows.map((row) => (
        <section key={row[0]} className="border-b border-border/70 px-4 py-4 last:border-b-0 sm:grid sm:grid-cols-[.85fr_1.15fr_1.35fr_1.35fr] sm:px-5 sm:py-3">
          <strong className="text-sm">{row[0]}</strong>
          {row.slice(1).map((cell, index) => (
            <div key={cell} className="mt-3 min-w-0 text-sm sm:mt-0 sm:pr-3">
              <span className="block text-xs text-muted-foreground sm:hidden">{labels[index]}</span>
              <span className="mt-1 block break-words text-muted-foreground sm:mt-0">{cell}</span>
            </div>
          ))}
        </section>
      ))}
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        Teacher agreement는 중간 진단이고, 최종 열은 항상 ground truth·OOD·student-only runtime입니다.
      </p>
    </figure>
  );
}
