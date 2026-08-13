const paths = [
  ["Adam + L2", "g + λw", "moment·variance", "Pₜ(g+λw)", "penalty도 precondition"],
  ["AdamW", "g", "moment·variance", "Pₜg  +  λw", "decay는 별도 경로"],
];

export default function WeightDecayViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Update-path comparison</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">차이는 λw가 adaptive preconditioner를 통과하는지입니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          {paths.map(([name, input, state, output, meaning]) => (
            <div key={name} className="py-5">
              <div className="grid gap-2 text-sm sm:grid-cols-[7rem_7rem_auto_9rem_auto_minmax(0,1fr)] sm:items-center sm:gap-3">
                <span className="font-semibold text-cyan-800 dark:text-cyan-200">{name}</span>
                <code>{input}</code><span className="hidden text-muted-foreground sm:block">→</span>
                <span>{state}</span><span className="hidden text-muted-foreground sm:block">→</span>
                <code>{output}</code>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 border-l border-cyan-600 pl-4 text-sm leading-6 text-muted-foreground">Decay/no-decay groups의 합집합은 trainable parameters 전체이고 교집합은 비어 있어야 합니다.</p>
      </div>
    </figure>
  );
}
