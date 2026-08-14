const steps = [
  { n: "01", title: "사용자 요청", detail: "L2 트랜잭션·L1 deposit" },
  { n: "02", title: "L1 데이터", detail: "batch·blob·inbox event" },
  { n: "03", title: "결정적 derivation", detail: "같은 입력 → 같은 payload" },
  { n: "04", title: "L2 실행", detail: "state root·receipt 계산" },
  { n: "05", title: "정산", detail: "fault 또는 validity proof" },
] as const;

export function RollupPipelineViz() {
  return (
    <figure data-viz="rollup-derivation-flow" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">Rollup의 세 경계를 한 흐름으로 보기</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">데이터를 올리는 일, 그 데이터로 L2를 재현하는 일, 결과를 정산하는 일은 서로 다른 책임입니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.n} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-primary">{step.n}</span>
            <p className="mt-2 break-keep text-sm font-semibold text-foreground">{step.title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{step.detail}</p>
            {index < steps.length - 1 && <span aria-hidden className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2">→</span>}
          </div>
        ))}
      </div>
    </figure>
  );
}

const rows = [
  ["기본 가정", "출력은 일단 유효", "출력은 proof가 검증되면 유효"],
  ["오류를 막는 장치", "challenge + fault proof", "validity proof verifier"],
  ["결과 확정 지연", "challenge window 영향", "proof 생성·L1 포함 영향"],
  ["반드시 별도로 필요한 것", "입력 데이터의 availability", "입력 데이터의 availability"],
] as const;

export function ProofComparisonViz() {
  return (
    <figure data-viz="rollup-proof-comparison" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">Optimistic와 validity rollup을 같은 축에서 비교</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">둘의 차이는 실행 위치가 아니라 잘못된 state transition을 L1이 배제하는 증거 방식입니다.</p>
      </figcaption>
      <div className="overflow-x-auto p-4 sm:p-6">
        <div className="min-w-[660px] overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-muted/50 text-xs font-semibold text-foreground">
            <div className="p-3">비교 축</div><div className="border-l border-border p-3">Optimistic</div><div className="border-l border-border p-3">Validity</div>
          </div>
          {rows.map(([axis, optimistic, validity]) => (
            <div key={axis} className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-border text-xs leading-5">
              <div className="p-3 font-medium text-foreground">{axis}</div><div className="border-l border-border p-3 text-muted-foreground">{optimistic}</div><div className="border-l border-border p-3 text-muted-foreground">{validity}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
