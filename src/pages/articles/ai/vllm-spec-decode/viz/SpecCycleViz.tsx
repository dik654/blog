const STEPS = [
  ["01", "Propose", "빠른 proposer가 현재 확정 prefix에서 미래 후보 K개를 만듭니다."],
  ["02", "Verify", "Target이 후보 위치의 probability를 한 번에 계산합니다."],
  ["03", "Accept", "왼쪽부터 연속으로 통과한 prefix와 correction을 확정합니다."],
  ["04", "Commit", "Scheduler·KV cache가 같은 새 prefix에서 다음 cycle을 시작합니다."],
] as const;

export default function SpecCycleViz() {
  return (
    <figure
      data-viz="speculative-draft-verify-cycle"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">DRAFT → VERIFY → COMMIT</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          품질을 결정하는 target은 그대로 두고, serial target step만 줄입니다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Proposer의 출력은 아직 확정 token이 아닙니다. Target 검증과 state
          commit을 통과해야 다음 prefix의 일부가 됩니다.
        </p>
      </figcaption>
      <ol className="grid gap-5 p-5 sm:p-7 lg:grid-cols-4">
        {STEPS.map(([number, title, body], index) => (
          <li key={title} className="relative min-w-0 rounded-lg border bg-background p-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-primary">{number}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="mt-4 font-bold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            {index < STEPS.length - 1 ? (
              <>
                <span aria-hidden="true" className="absolute -bottom-4 left-1/2 flex h-4 w-4 items-center justify-center text-sm text-muted-foreground lg:hidden">↓</span>
              </>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="border-t bg-muted/20 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-7">
        Cycle이 끝날 때 확정되는 것은 proposal 전체가 아니라 target 규칙을 통과한
        연속 prefix입니다.
      </div>
    </figure>
  );
}
