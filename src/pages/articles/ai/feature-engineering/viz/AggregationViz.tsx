const events = [
  { day: "D−36", amount: "18", inWindow: false },
  { day: "D−21", amount: "42", inWindow: true },
  { day: "D−8", amount: "27", inWindow: true },
  { day: "D−2", amount: "51", inWindow: true },
  { day: "D+1", amount: "33", inWindow: false, future: true },
];

export default function AggregationViz() {
  return (
    <figure data-viz="point-in-time-aggregation" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Point-in-time aggregation</p>
        <p className="mt-2 text-lg font-semibold">각 prediction row는 서로 다른 과거 window를 가집니다</p>
      </figcaption>

      <div className="mt-6 min-w-0">
        <div className="grid grid-cols-5 gap-2">
          {events.map((event) => (
            <div key={event.day} className="min-w-0 text-center">
              <div className={`mx-auto h-3 w-3 rounded-full border ${event.future ? "border-rose-500 bg-background" : event.inWindow ? "border-primary bg-primary" : "border-border bg-muted"}`} />
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{event.day}</p>
              <p className={`mt-1 text-xs font-semibold ${event.future ? "text-rose-700 line-through dark:text-rose-300" : event.inWindow ? "text-foreground" : "text-muted-foreground"}`}>{event.amount}k</p>
            </div>
          ))}
        </div>
        <div className="relative mt-3 h-6">
          <div className="absolute left-[20%] right-[20%] top-2 h-px bg-primary" />
          <span className="absolute left-[20%] top-0 h-4 w-px bg-primary" />
          <span className="absolute right-[20%] top-0 h-4 w-px bg-primary" />
          <p className="absolute inset-x-0 top-3 text-center text-[11px] text-primary">30일 window · cutoff 포함</p>
        </div>
      </div>

      <div className="mt-6 grid min-w-0 gap-4 border-t border-border/70 pt-4 sm:grid-cols-3">
        <div><p className="text-xs text-muted-foreground">count₃₀d</p><p className="mt-1 text-xl font-semibold">3</p></div>
        <div><p className="text-xs text-muted-foreground">mean_amount₃₀d</p><p className="mt-1 text-xl font-semibold">40k</p></div>
        <div><p className="text-xs text-muted-foreground">days_since_last</p><p className="mt-1 text-xl font-semibold">2</p></div>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">D+1 event와 D−36 event는 서로 다른 이유로 제외됩니다. 하나는 미래이고, 다른 하나는 window 밖입니다.</p>
    </figure>
  );
}
