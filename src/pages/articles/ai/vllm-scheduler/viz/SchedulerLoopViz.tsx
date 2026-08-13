const STEPS = [
  ["01", "RUNNING", "진행 중인 요청의 남은 token과 KV slot을 먼저 검토"],
  ["02", "WAITING", "남은 request slot·budget으로 새 요청 또는 재개 요청 admission"],
  ["03", "MODEL", "Scheduler output을 worker batch로 실행"],
  ["04", "UPDATE", "생성·수락·완료 결과로 counter와 queue·cache 갱신"],
] as const;

export default function SchedulerLoopViz() {
  return (
    <figure data-viz="scheduler-closed-loop" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">ONE ENGINE ITERATION</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">실행 결과가 state를 바꾸고 다음 scheduling의 입력이 됩니다</h3>
      </figcaption>
      <ol className="grid gap-3 p-5 sm:p-7 md:grid-cols-4">
        {STEPS.map(([number, title, body], index) => (
          <li key={number} className="relative min-w-0 rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold text-primary">{number}</span>
              {index < STEPS.length - 1 && <span className="hidden text-muted-foreground md:block">→</span>}
            </div>
            <p className="mt-4 font-bold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <p className="border-t bg-muted/15 px-5 py-4 text-center text-sm leading-6 text-muted-foreground sm:px-7">UPDATE → 다음 iteration의 RUNNING·WAITING snapshot</p>
    </figure>
  );
}
