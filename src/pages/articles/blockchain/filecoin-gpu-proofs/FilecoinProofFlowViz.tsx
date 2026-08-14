const stages = [
  ["입력 세대", "sector · ticket · pieces"],
  ["PreCommit 1", "replica · tree cache"],
  ["PreCommit 2", "CommR · CommD"],
  ["Commit 1", "vanilla proof · public inputs"],
  ["Commit 2", "Groth16 proof artifact"],
] as const;

export function FilecoinProofFlowViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold text-foreground">한 sector job의 artifact chain</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">화살표는 단순 실행 순서가 아니라, 다음 단계가 검증해야 할 producer artifact를 뜻합니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-5">
        {stages.map(([title, detail], index) => (
          <div key={title} className="relative min-w-0 rounded-lg border border-border bg-muted/20 p-3 md:min-h-28">
            <span className="text-[11px] font-semibold text-primary">0{index}</span>
            <p className="mt-2 break-words text-sm font-semibold leading-5">{title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
            {index < stages.length - 1 && <span aria-hidden className="absolute -bottom-3 left-1/2 h-3 border-l border-border md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:h-auto md:w-3 md:border-b md:border-l-0" />}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-3 text-xs leading-5"><strong>GPU 후보</strong><br /><span className="text-muted-foreground">Field/hash · FFT · MSM처럼 병렬 frontier가 큰 연산</span></div>
        <div className="rounded-lg border border-border bg-background p-3 text-xs leading-5"><strong>항상 남는 gate</strong><br /><span className="text-muted-foreground">Cache identity · 단계별 검증 · 독립 proof verification</span></div>
      </div>
    </figure>
  );
}
