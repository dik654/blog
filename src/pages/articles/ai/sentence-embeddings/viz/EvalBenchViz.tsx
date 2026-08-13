const rows = [
  ["Retrieval", "Recall@k · NDCG@k · MRR", "query style · doc length · language"],
  ["STS", "Spearman · Pearson", "domain pair · score distribution"],
  ["Classification / clustering", "accuracy · F1 · V-measure", "class balance · subgroup"],
  ["Serving", "p95 latency · throughput · index size", "hardware · batch · precision"],
];

export default function EvalBenchViz() {
  return <div data-viz className="rounded-xl border border-border/70 bg-card/70 p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-300">Evaluation matrix</p>
    <h3 className="mt-1 text-lg font-semibold">Task metric, failure slice와 serving cost를 함께 봅니다</h3>

    <div className="mt-5 grid gap-3 md:hidden">
      {rows.map(([task, metric, slice]) => <div key={task} className="rounded-lg border border-border/70 p-4">
        <p className="font-semibold">{task}</p>
        <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Metric</dt><dd>{metric}</dd>
          <dt className="text-muted-foreground">Slice</dt><dd>{slice}</dd>
        </dl>
      </div>)}
    </div>

    <div className="mt-5 hidden overflow-x-auto rounded-lg border border-border/70 md:block">
      <div className="min-w-[46rem] grid grid-cols-[1fr_1.4fr_1.7fr] bg-muted/50 px-4 py-2.5 text-xs font-semibold"><span>Task</span><span>Metric</span><span>Slice / condition</span></div>
      {rows.map(([task, metric, slice]) => <div key={task} className="min-w-[46rem] grid grid-cols-[1fr_1.4fr_1.7fr] border-t border-border/60 px-4 py-3 text-sm"><span className="font-semibold">{task}</span><span>{metric}</span><span className="text-muted-foreground">{slice}</span></div>)}
    </div>
  </div>;
}
