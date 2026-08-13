const events = [
  { time: "08:10", event: "view", available: "08:10", state: "입력" },
  { time: "08:26", event: "cart", available: "08:26", state: "입력" },
  { time: "08:40", event: "payment", available: "09:07", state: "제외" },
  { time: "09:18", event: "purchase", available: "09:18", state: "target" },
];

export default function OverviewViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">Forecast-origin ledger</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Event time이 과거여도 cutoff에 도착하지 않았다면 입력이 아닙니다</h3>
        <p className="mt-1 text-sm text-muted-foreground">entity=user_42 · cutoff=09:00 · target horizon=(09:00, 다음 날 09:00]</p>
      </figcaption>

      <div className="px-4 py-5 sm:px-6">
        <div className="hidden grid-cols-[5rem_1fr_7rem_5rem] border-y border-border text-sm sm:grid">
          <div className="px-3 py-2 font-medium text-muted-foreground">발생 시각</div>
          <div className="px-3 py-2 font-medium text-muted-foreground">event</div>
          <div className="px-3 py-2 font-medium text-muted-foreground">available</div>
          <div className="px-3 py-2 font-medium text-muted-foreground">역할</div>
        </div>
        <div className="divide-y divide-border border-b border-border">
          {events.map((item) => (
            <div key={`${item.time}-${item.event}`} className="grid gap-1 py-3 text-sm sm:grid-cols-[5rem_1fr_7rem_5rem] sm:gap-0 sm:py-0">
              <div className="font-mono sm:px-3 sm:py-3">{item.time}</div>
              <div className="font-medium sm:px-3 sm:py-3">{item.event}</div>
              <div className="text-muted-foreground sm:px-3 sm:py-3"><span className="sm:hidden">available · </span>{item.available}</div>
              <div className={`sm:px-3 sm:py-3 ${item.state === "입력" ? "text-emerald-700 dark:text-emerald-300" : item.state === "target" ? "text-violet-700 dark:text-violet-300" : "text-amber-700 dark:text-amber-300"}`}>{item.state}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <p className="border-l border-emerald-500 pl-3"><span className="font-semibold">Sᵢ,𝚌</span> = view → cart</p>
          <span className="hidden text-muted-foreground sm:block">cutoff 09:00</span>
          <p className="border-l border-violet-500 pl-3"><span className="font-semibold">label</span> = horizon 안 purchase 여부</p>
        </div>
      </div>
    </figure>
  );
}
