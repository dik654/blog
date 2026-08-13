const lanes = [
  ["Data", "snapshot · split · sample IDs · transform artifact", "batch"],
  ["State", "model · optimizer · scheduler · RNG · sampler cursor", "update"],
  ["Evidence", "metric totals · throughput · config · checkpoint", "report"],
];

export default function OverviewViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">Run anatomy</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">같은 update를 설명하려면 data·state·evidence 세 줄이 함께 움직여야 합니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          {lanes.map(([label, contents, output]) => (
            <div key={label} className="grid gap-2 py-4 text-sm sm:grid-cols-[5rem_minmax(0,1fr)_5rem] sm:items-center">
              <p className="font-semibold text-blue-800 dark:text-blue-200">{label}</p>
              <p className="break-words font-mono text-xs text-muted-foreground sm:text-sm">{contents}</p>
              <p className="border-l border-border pl-3 font-medium">{output}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <p><span className="font-semibold">입력 계약</span><br /><span className="text-muted-foreground">무엇을 읽는가</span></p>
          <span className="hidden text-muted-foreground sm:block">→</span>
          <p><span className="font-semibold">실행·복구</span><br /><span className="text-muted-foreground">무엇이 바뀌는가</span></p>
          <span className="hidden text-muted-foreground sm:block">→</span>
          <p><span className="font-semibold">선택 근거</span><br /><span className="text-muted-foreground">왜 이 artifact인가</span></p>
        </div>
      </div>
    </figure>
  );
}
