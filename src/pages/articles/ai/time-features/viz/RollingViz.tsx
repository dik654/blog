const days = [
  ["c−8", 4, "outside"], ["c−7", 8, "inside"], ["c−5", 12, "inside"], ["c−2", 10, "inside"], ["c", 20, "cutoff"],
];

export default function RollingViz() {
  return (
    <figure data-viz="rolling-boundary-trace" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Half-open window [c−7d, c)</p>
        <p className="mt-2 text-lg font-semibold">양끝 포함 규칙이 어떤 관측을 평균에 넣는지 결정합니다</p>
      </figcaption>
      <div className="mt-7 overflow-x-auto pb-2">
        <div className="min-w-[610px]">
          <div className="relative mx-8 h-px bg-border">
            <div className="absolute left-[25%] right-[10%] top-0 h-px bg-primary/70" />
          </div>
          <div className="mt-[-7px] grid grid-cols-5 gap-5">
            {days.map(([time, value, state]) => (
              <div key={time} className="text-center">
                <span className={`mx-auto block h-3 w-3 rounded-full border ${state === "inside" ? "border-primary bg-primary" : state === "cutoff" ? "border-rose-500 bg-background" : "border-border bg-background"}`} />
                <p className="mt-3 font-mono text-xs font-semibold">{time}</p>
                <p className="mt-1 text-sm text-muted-foreground">value {value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{state === "inside" ? "포함" : state === "cutoff" ? "오른쪽 제외" : "window 밖"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-4 border-t border-border/70 pt-4 sm:grid-cols-3">
        <p className="text-sm"><span className="font-semibold">count</span><br/><span className="text-muted-foreground">3 observations</span></p>
        <p className="text-sm"><span className="font-semibold">mean</span><br/><span className="text-muted-foreground">(8+12+10)/3 = 10</span></p>
        <p className="text-sm"><span className="font-semibold">freshness</span><br/><span className="text-muted-foreground">last event = c−2</span></p>
      </div>
    </figure>
  );
}
