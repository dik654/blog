const rows = [
  ["Quality", "loss sum/count · task metric · slice metric", "model 선택"],
  ["Optimization", "LR · gradient norm · AMP scale · skipped update", "수치 진단"],
  ["System", "wait/compute · samples/s · tokens/s · memory", "병목 진단"],
  ["Provenance", "code · data · split · config · environment", "재현·감사"],
];

export default function LoggingViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300">Run index</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">한 metric에서 계산 원인과 생성 artifact까지 역추적합니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          {rows.map(([group, values, purpose]) => (
            <div key={group} className="grid gap-1 py-3 text-sm sm:grid-cols-[7rem_minmax(0,1fr)_6rem] sm:gap-4">
              <p className="font-semibold text-rose-800 dark:text-rose-200">{group}</p>
              <p className="break-words font-mono text-xs text-muted-foreground sm:text-sm">{values}</p>
              <p className="text-muted-foreground">{purpose}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 border-l border-rose-500 pl-4 text-sm">
          <p className="font-semibold">run ID → resolved config → checkpoint digest → evaluation report</p>
          <p className="mt-1 text-muted-foreground">사람이 읽는 별칭과 바뀌지 않는 ID를 함께 사용합니다.</p>
        </div>
      </div>
    </figure>
  );
}
