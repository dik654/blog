const frame =
  "rounded-xl border border-border/80 bg-background p-4 sm:p-5";

const steps = [
  {
    owner: "CometBFT",
    title: "proposal height 101",
    detail: "Proposer·vote·commit과 ABCI callback 순서를 소유",
  },
  {
    owner: "Halo / Octane",
    title: "ABCI ↔ Engine adapter",
    detail: "Payload message·vote extensions·application state를 연결",
  },
  {
    owner: "Execution client",
    title: "EVM payload P101",
    detail: "Build·execute·payload validity·EVM state를 소유",
  },
] as const;

export function OctaneBoundaryViz() {
  return (
    <figure data-viz="octane-authority-boundary" className="my-8 min-w-0">
      <figcaption className="mb-3 text-sm font-semibold text-foreground">
        한 블록의 책임 경계: 합의, adapter, EVM 실행은 같은 상태가 아니다
      </figcaption>
      <div data-viz-canvas className={`${frame} grid min-w-0 gap-4 lg:grid-cols-3`}>
        {steps.map((step, index) => (
          <div key={step.owner} className="min-w-0 border-l border-primary/60 pl-4">
            <p className="text-xs font-bold text-primary">0{index + 1} · {step.owner}</p>
            <p className="mt-2 font-semibold leading-6">{step.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.detail}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

const lifecycle = [
  ["build", "FCU V3 + attributes", "payloadId"],
  ["retrieve", "getPayload V3", "candidate P101"],
  ["validate", "invariants + newPayload V3", "typed status"],
  ["finalize", "FCU head=safe=finalized", "committed head"],
] as const;

export function OctanePayloadLifecycleViz() {
  return (
    <figure data-viz="octane-payload-lifecycle" className="my-8 min-w-0">
      <figcaption className="mb-3 text-sm font-semibold text-foreground">
        Candidate payload가 committed execution head가 되기까지
      </figcaption>
      <div data-viz-canvas className={`${frame} min-w-0`}>
        <ol className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lifecycle.map(([phase, action, receipt], index) => (
            <li key={phase} className="min-w-0 rounded-lg border border-border/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  {phase}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">{index + 1}/4</span>
              </div>
              <p className="mt-3 break-words text-sm font-semibold leading-6">{action}</p>
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
                receipt · {receipt}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-border/80 pt-4 text-xs leading-5 text-muted-foreground">
          INVALID는 candidate rejection이고, network retry·SYNCING·unknown payload는 별도 liveness 경로다.
          CometBFT commit 전의 payload와 durable application effect를 같은 성공으로 세지 않는다.
        </p>
      </div>
    </figure>
  );
}
