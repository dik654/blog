const ledger = [
  ["warmup", "W updates", "start → peak"],
  ["main", "T−W updates", "S(t−W; T−W)"],
  ["resume", "global update", "scheduler state + cursor"],
];

export default function WarmupViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Chained schedule</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Warmup과 main schedule은 경계값과 local clock을 공유합니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="relative h-36 border-b border-l border-border" aria-label="linear warmup connected to cosine decay">
          <div className="absolute inset-y-0 left-[22%] border-l border-dashed border-emerald-600/60" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="0,91 22,9" fill="none" className="stroke-emerald-600 dark:stroke-emerald-300" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
            <polyline points="22,9 28,10 36,14 44,21 52,31 60,44 68,59 76,74 84,87 92,96 100,100" fill="none" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="absolute left-[22%] top-1 -translate-x-1/2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">peak</span>
        </div>
        <div className="mt-2 grid grid-cols-[22%_78%] text-xs text-muted-foreground"><span>0 → W</span><span className="text-right">local clock: t−W · length: T−W</span></div>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {ledger.map(([phase, clock, state]) => (
            <div key={phase} className="grid gap-1 py-3 text-sm sm:grid-cols-[6rem_8rem_minmax(0,1fr)] sm:gap-5">
              <span className="font-semibold">{phase}</span><code className="text-xs text-muted-foreground sm:text-sm">{clock}</code><span className="text-muted-foreground">{state}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 border-l border-emerald-600 pl-4 text-sm leading-6 text-muted-foreground">경계에서 LR jump가 없는지, resume 전후 global update·LR trace가 같은지 test합니다.</p>
      </div>
    </figure>
  );
}
