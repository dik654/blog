const rows = [
  ["Covariate", "P(x)", "sensor·style·device", "normalization·coverage·reweight 후보"],
  ["Label", "P(y)", "class prevalence", "prior estimate·calibration 후보"],
  ["Concept", "P(y|x)", "정책·정답 의미", "target labels·relabel·model update"],
];

export default function DomainShiftViz() {
  return <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
    <figcaption className="border-b border-border px-4 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">Shift decision table</p><h3 className="mt-1 text-base font-semibold sm:text-lg">무엇이 달라졌는지 모르면 alignment도 calibration도 근거가 없습니다</h3></figcaption>
    <div className="px-4 py-5 sm:px-6"><div className="divide-y divide-border border-y border-border">{rows.map(([name,relation,example,response])=><div key={name} className="grid gap-1 py-4 text-sm sm:grid-cols-[7rem_5rem_minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-4"><span className="font-semibold text-orange-800 dark:text-orange-200">{name}</span><span className="font-mono">{relation}</span><span className="text-muted-foreground">{example}</span><span>{response}</span></div>)}</div>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"><p><b>Deployment holdout</b><br/><span className="text-muted-foreground">실제 축으로 진단</span></p><span className="hidden sm:block">→</span><p><b>Simple baseline</b><br/><span className="text-muted-foreground">fixed·partial·full</span></p><span className="hidden sm:block">→</span><p><b>Adapt + rollback</b><br/><span className="text-muted-foreground">target evidence 요구</span></p></div>
    </div>
  </figure>;
}
