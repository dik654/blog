const LEDGER = [
  ["Workload", "QPS·prompt/output 길이·sampler·structured output을 production 분포로 고정"],
  ["Proposal", "방법·depth K·dynamic policy·draft time과 temporary memory 기록"],
  ["Acceptance", "A와 Y의 정의·평균·p95·위치별 tail probability 기록"],
  ["Serving", "TTFT·ITL·E2E·tokens/s·KV usage·preemption을 target-only와 비교"],
  ["Correctness", "Target distribution 계약·task quality·failure mode·artifact revision 확인"],
] as const;

export default function ServingBreakEvenViz() {
  return (
    <figure
      data-viz="speculative-serving-break-even"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">PRODUCTION DECISION</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          Acceptance rate 하나가 아니라 cycle 전체 비용과 SLA를 비교합니다
        </h3>
      </figcaption>
      <div className="grid gap-3 p-5 sm:p-7">
        {LEDGER.map(([title, body], index) => (
          <div key={title} className="grid min-w-0 gap-2 rounded-lg border bg-background p-4 sm:grid-cols-[2.5rem_7rem_1fr] sm:items-start sm:gap-4">
            <span className="font-mono text-xs font-black text-primary">0{index + 1}</span>
            <strong className="text-sm">{title}</strong>
            <p className="text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <div className="grid border-t bg-muted/20 sm:grid-cols-2">
        <div className="border-b px-5 py-4 sm:border-b-0 sm:border-r sm:px-7">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">켜는 구간</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">낮은 batch·memory-bound target·높은 committed length·저렴한 proposer</p>
        </div>
        <div className="px-5 py-4 sm:px-7">
          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">줄이거나 끄는 구간</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">높은 QPS·이미 찬 batch·낮은 acceptance tail·큰 draft/runtime overhead</p>
        </div>
      </div>
    </figure>
  );
}
