const stages = [
  ["Fixed feature", "head", "data·label·metric baseline"],
  ["Partial", "upper blocks + head", "target 가까운 표현만 조정"],
  ["Full", "all parameters", "전체 자유도의 이득 검증"],
];

export default function OverviewViz() {
  return <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
    <figcaption className="border-b border-border px-4 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">Adaptation ladder</p><h3 className="mt-1 text-base font-semibold sm:text-lg">검증 이득이 생길 때만 trainable scope를 넓힙니다</h3></figcaption>
    <div className="px-4 py-5 sm:px-6">
      <ol className="divide-y divide-border border-y border-border">
        {stages.map(([name, scope, evidence], i) => <li key={name} className="grid gap-1 py-4 text-sm sm:grid-cols-[2rem_8rem_minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-4"><span className="font-mono text-xs text-violet-700 dark:text-violet-300">0{i+1}</span><span className="font-semibold">{name}</span><span className="font-mono text-xs sm:text-sm">{scope}</span><span className="text-muted-foreground">{evidence}</span></li>)}
      </ol>
      <p className="mt-5 border-l border-violet-500 pl-4 text-sm text-muted-foreground">같은 checkpoint·preprocessing·split·metric·search budget에서 gain·seed variance·memory·wall time을 비교합니다.</p>
    </div>
  </figure>;
}
