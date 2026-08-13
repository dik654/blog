const checks = [
  ["01", "Boundary", "entity·time overlap", "split manifest"],
  ["02", "Pipeline", "transform·metric parity", "batch replay"],
  ["03", "Noise·shift", "label·source slices", "audited errors"],
  ["04", "Capacity", "fit vs gap", "one-axis ablation"],
];

export default function OverfittingDiagnosisViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300">Diagnosis before treatment</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Gap을 발견한 순서와 regularizer를 고르는 순서는 같지 않습니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <ol className="divide-y divide-border border-y border-border">
          {checks.map(([index, boundary, question, evidence]) => (
            <li key={index} className="grid grid-cols-[2rem_1fr] gap-3 py-4 text-sm sm:grid-cols-[2rem_7rem_minmax(0,1fr)_8rem] sm:gap-5">
              <span className="font-mono text-xs text-rose-700 dark:text-rose-300">{index}</span>
              <span className="font-semibold">{boundary}</span>
              <span className="text-muted-foreground">{question}</span>
              <span className="col-start-2 text-xs text-foreground sm:col-start-auto sm:text-sm">{evidence}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <p><b>Baseline</b><br/><span className="text-muted-foreground">오류 원인 고정</span></p><span className="hidden text-muted-foreground sm:block">→</span>
          <p><b>One change</b><br/><span className="text-muted-foreground">한 경계만 제한</span></p><span className="hidden text-muted-foreground sm:block">→</span>
          <p><b>Decision</b><br/><span className="text-muted-foreground">gain·fit·slice·cost</span></p>
        </div>
      </div>
    </figure>
  );
}
