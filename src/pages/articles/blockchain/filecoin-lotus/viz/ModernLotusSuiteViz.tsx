const STEPS = [
  { owner: "lotus daemon", action: "tipset 검증·실행", output: "head · state/receipt roots" },
  { owner: "Boost", action: "deal·retrieval 입구", output: "proposal · PieceCID" },
  { owner: "provider scheduler", action: "sector·proof 작업 배치", output: "job generation · lease" },
  { owner: "worker", action: "seal·PoSt 계산", output: "CommD/CommR · proof" },
] as const;

export default function ModernLotusSuiteViz() {
  return <div data-viz="lotus-suite-responsibility" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">owner → action → versioned artifact</p>
    <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-4">
      {STEPS.map((step, index) => <article key={step.owner} className="min-w-0 rounded-lg border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-primary">0{index + 1}</span><span className="text-[11px] text-muted-foreground">failure domain</span></div>
        <h3 className="mt-3 break-words font-semibold">{step.owner}</h3>
        <p className="mt-2 text-sm leading-6 text-foreground/80">{step.action}</p>
        <p className="mt-3 break-words border-t border-border pt-3 font-mono text-xs leading-5 text-muted-foreground">{step.output}</p>
      </article>)}
    </div>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">프로세스 health가 모두 정상이어도 artifact generation·network profile·chain receipt가 이어지지 않으면 전체 작업은 완료되지 않습니다.</p>
  </div>;
}
