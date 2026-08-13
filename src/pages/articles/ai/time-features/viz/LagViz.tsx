const events = [
  ["07-20", "12", "07-20", "사용"],
  ["07-27", "18", "08-05", "제외"],
  ["07-30", "15", "07-31", "사용"],
  ["08-01", "?", "—", "target"],
];

export default function LagViz() {
  return (
    <figure data-viz="point-in-time-lag-ledger" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Cutoff · 08-01 00:00</p>
        <p className="mt-2 text-lg font-semibold">Event는 과거여도 cutoff 뒤에 도착했다면 lag 후보가 아닙니다</p>
      </figcaption>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
        <div className="grid grid-cols-[1fr_.7fr_1fr_.65fr] gap-3 bg-muted/35 px-3 py-3 text-xs font-semibold text-muted-foreground sm:px-4">
          <span>event time</span><span>value</span><span>available time</span><span>판정</span>
        </div>
        {events.map(([event, value, available, verdict]) => (
          <div key={`${event}-${available}`} className="grid grid-cols-[1fr_.7fr_1fr_.65fr] gap-3 border-t border-border/60 px-3 py-4 text-sm sm:px-4">
            <span className="font-mono">{event}</span><span>{value}</span><span className="font-mono text-muted-foreground">{available}</span>
            <span className={verdict === "제외" ? "text-rose-600 dark:text-rose-300" : "text-foreground/80"}>{verdict}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">이 예에서 07-30 value 15가 latest available lag입니다. 07-27 value 18은 더 오래된 event가 아니라 늦게 도착한 미래 정보로 처리합니다.</p>
    </figure>
  );
}
