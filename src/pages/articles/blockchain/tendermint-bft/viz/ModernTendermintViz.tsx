const steps = [
  ["Propose", "Proposer가 block과 validRound evidence를 보낸다"],
  ["Prevote", "Lock과 proposal validity에 따라 block 또는 nil에 투표"],
  ["Precommit", "+2/3 prevote를 보면 lock을 갱신하고 투표"],
  ["Commit", "같은 round block에 +2/3 precommit이면 결정"],
] as const;

export function TendermintRoundViz() {
  return (
    <figure
      data-viz="tendermint-round-flow"
      className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          한 height 안에서 round를 반복하는 상태 machine
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Timeout은 다음 step·round로 이동시키고, certificate와 lock이 안전한
          vote 범위를 제한합니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid min-w-0 gap-3 md:grid-cols-4">
        {steps.map(([title, detail], index) => (
          <div
            key={title}
            className="relative min-w-0 rounded-lg border border-border bg-background p-4"
          >
            <span className="text-[11px] font-semibold text-primary">
              0{index + 1}
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {title}
            </p>
            <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
            {index < 3 && (
              <span
                aria-hidden
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">Round 실패:</strong> proposal
        누락·invalid 또는 block/nil precommit이 +2/3에 못 미치면 timeout 뒤
        r+1로 이동합니다. Lock은 지워지지 않습니다.
      </p>
    </figure>
  );
}

export function TendermintLockTraceViz() {
  const rows = [
    ["r0", "A 제안", "+2/3 prevote(A)", "A에 lock · precommit(A)"],
    ["r1", "B 제안", "A lock과 충돌 · higher PoLC 없음", "prevote(A), B 거절"],
    [
      "r2",
      "B + validRound=2",
      "+2/3 prevote(B)",
      "higher evidence로 B에 relock",
    ],
  ] as const;
  return (
    <figure
      data-viz="tendermint-lock-trace"
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">
          Lock은 timeout이 아니라 더 높은 round evidence로만 바뀐다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          같은 height에서 stale proposal이 이전 safety state를 지우지 못하게
          합니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid min-w-0 gap-3 p-4 sm:p-6">
        {rows.map(([round, proposal, evidence, action]) => (
          <section key={round} className="grid min-w-0 gap-3 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[5rem_0.8fr_1.2fr_1.2fr] md:items-start">
            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-[10px] font-bold text-muted-foreground">ROUND</span>
              <p className="font-mono text-sm font-black text-primary">{round}</p>
            </div>
            {[["Proposal", proposal], ["관찰한 evidence", evidence], ["Honest validator 동작", action]].map(([label, value], cellIndex) => (
              <div key={label} className={`min-w-0 ${cellIndex ? "border-t border-border/60 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0" : ""}`}>
                <p className="text-[10px] font-bold text-primary">{label}</p>
                <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{value}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    </figure>
  );
}
