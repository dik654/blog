const flow = [
  ["FP checkpoint", "module·shape·outlier audit", "base hash"],
  ["Calibration", "representative input으로 observer 실행", "range snapshot"],
  ["Scale policy", "tensor·channel·group별 codebook", "quant config"],
  ["Conversion", "packed weight와 target operator 생성", "deploy graph"],
  ["Validation", "fallback·saturation·quality·latency", "run receipt"],
];

export default function PTQProcessViz() {
  return <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-300">PTQ artifact lineage</p>
    <h3 className="mt-1 text-lg font-semibold">각 단계가 다음 단계가 재현할 artifact를 남깁니다</h3>
    <div className="mt-5 overflow-x-auto">
      <div className="min-w-[48rem] border-y border-border/70">
        <div className="grid grid-cols-[3rem_9rem_1fr_9rem] gap-4 py-2.5 text-xs font-semibold text-muted-foreground"><span>Step</span><span>Stage</span><span>Decision</span><span>Output</span></div>
        {flow.map(([stage, decision, output], index) => <div key={stage} className="grid grid-cols-[3rem_9rem_1fr_9rem] gap-4 border-t border-border/60 py-3 text-sm">
          <span className="tabular-nums text-muted-foreground">0{index + 1}</span><strong>{stage}</strong><span>{decision}</span><span className="font-mono text-xs text-muted-foreground">{output}</span>
        </div>)}
      </div>
    </div>
  </div>;
}
