const classes = ["c₁", "c₂ · target", "c₃", "c₄"];
const hard = [0, 1, 0, 0];
const smooth = [0.025, 0.925, 0.025, 0.025];

function DistributionRow({ label, values, accent }: { label: string; values: readonly number[]; accent?: boolean }) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:gap-5">
      <p className="font-semibold">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {values.map((value, index) => (
          <div key={classes[index]} className="min-w-0 text-center">
            <div className="relative h-20 border-b border-border">
              <span className={`absolute inset-x-1 bottom-0 ${accent ? "bg-emerald-500/25" : "bg-slate-500/20"}`} style={{ height: `${Math.max(value * 100, 3)}%` }} />
              <span className="absolute inset-x-0 top-0 font-mono text-[11px]">{value}</span>
            </div>
            <span className="mt-2 block truncate text-[11px] text-muted-foreground sm:text-xs">{classes[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LabelSmoothingViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Target distribution</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">ε=0.1을 버리는 것이 아니라 K classes의 uniform prior로 나눕니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          <DistributionRow label="One-hot" values={hard} />
          <DistributionRow label="Smoothed" values={smooth} accent />
        </div>
        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <p><span className="font-semibold">Target class</span><span className="text-muted-foreground"> · 1−ε+ε/K = .925</span></p>
          <p><span className="font-semibold">Other classes</span><span className="text-muted-foreground"> · ε/K = .025 each</span></p>
        </div>
        <p className="mt-5 border-l border-emerald-600 pl-4 text-sm leading-6 text-muted-foreground">Mixup·CutMix와 함께 쓰면 최종 target distribution을 직접 계산해 entropy와 class별 성능을 확인합니다.</p>
      </div>
    </figure>
  );
}
