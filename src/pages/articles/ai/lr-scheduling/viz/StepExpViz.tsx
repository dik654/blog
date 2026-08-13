const schedules = [
  { name: "Step", trigger: "K updates", points: "0,7 20,7 20,18 42,18 42,31 64,31 64,43 100,43" },
  { name: "Exponential", trigger: "every update", points: "0,7 14,13 28,19 42,25 57,31 71,36 85,40 100,43" },
  { name: "Plateau", trigger: "validation event", points: "0,7 48,7 48,25 78,25 78,42 100,42" },
];

export default function StepExpViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Decay trigger</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">곡선 모양보다 먼저 “무엇이 시간을 전진시키는가”를 구분합니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          {schedules.map((schedule) => (
            <div key={schedule.name} className="grid gap-3 py-5 sm:grid-cols-[7rem_minmax(0,1fr)_8rem] sm:items-center sm:gap-5">
              <div><p className="font-semibold">{schedule.name}</p><p className="mt-1 text-xs text-muted-foreground sm:hidden">{schedule.trigger}</p></div>
              <div className="relative h-14 border-b border-l border-border" aria-label={`${schedule.name} learning-rate curve`}>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
                  <polyline points={schedule.points} fill="none" className="stroke-cyan-600 dark:stroke-cyan-300" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <p className="hidden text-sm text-muted-foreground sm:block">{schedule.trigger}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="font-semibold">Open-loop</span><span className="text-muted-foreground"> · Step·exponential은 update index로 재생</span></p>
          <p><span className="font-semibold">Metric-driven</span><span className="text-muted-foreground"> · Plateau는 evaluation state까지 복원</span></p>
        </div>
      </div>
    </figure>
  );
}
