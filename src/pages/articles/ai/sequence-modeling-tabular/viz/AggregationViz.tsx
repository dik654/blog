const rows = [
  { label: "Sequence 1", sequence: ["A", "B", "A", "C", "A"], question: "B를 먼저 거친 경로" },
  { label: "Sequence 2", sequence: ["A", "C", "A", "B", "A"], question: "C를 먼저 거친 경로" },
];

export default function AggregationViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Summary collision</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Event count와 bigram이 같아도 전체 순서는 다를 수 있습니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-3 py-4 sm:grid-cols-[6rem_minmax(0,1fr)_9rem] sm:items-center">
              <p className="text-sm font-semibold">{row.label}</p>
              <div className="grid grid-cols-5 gap-1 font-mono text-sm sm:gap-2">
                {row.sequence.map((event, index) => (
                  <span key={`${row.label}-${index}`} className="border-b border-emerald-500/70 py-2 text-center">{event}</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{row.question}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="border-l border-border pl-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">동일한 unigram</p>
            <p className="mt-2 font-mono text-sm">A: 3 · B: 1 · C: 1</p>
          </div>
          <div className="border-l border-border pl-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">동일한 bigram</p>
            <p className="mt-2 font-mono text-sm">AB: 1 · BA: 1 · AC: 1 · CA: 1</p>
          </div>
        </div>
        <p className="mt-5 border-l border-amber-500 pl-4 text-sm text-muted-foreground">
          두 summary vector는 같지만 “B가 C보다 먼저인가?”에는 서로 다른 답을 냅니다.
        </p>
      </div>
    </figure>
  );
}
