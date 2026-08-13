const rows = [
  ["GPTQ", "Method", "calibration X와 approximate second order", "남은 weight column을 순차 보정"],
  ["AWQ", "Method", "activation 크기로 salient channel 탐색", "equivalent scaling으로 W4 resolution 보호"],
  ["GGUF", "Container", "tensor encoding과 typed metadata", "file load·mmap·runtime 해석"],
];

export default function GPTQvsAWQViz() {
  return <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">Method · format boundary</p>
    <h3 className="mt-1 text-lg font-semibold">관측하는 것과 바꾸는 것이 서로 다릅니다</h3>
    <div className="mt-5 grid gap-3 md:hidden">
      {rows.map(([name, layer, observes, changes]) => <div key={name} className="rounded-lg border border-border/70 p-4">
        <div className="flex items-baseline justify-between gap-3"><strong>{name}</strong><span className="text-xs font-medium text-muted-foreground">{layer}</span></div>
        <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-muted-foreground">관측</dt><dd>{observes}</dd>
          <dt className="text-muted-foreground">변경·저장</dt><dd>{changes}</dd>
        </dl>
      </div>)}
    </div>
    <div className="mt-5 hidden overflow-x-auto md:block">
      <div className="min-w-[50rem] border-y border-border/70">
        <div className="grid grid-cols-[7rem_7rem_1fr_1.15fr] gap-4 py-2.5 text-xs font-semibold text-muted-foreground"><span>Name</span><span>Layer</span><span>Observes</span><span>Changes / stores</span></div>
        {rows.map(([name, layer, observes, changes]) => <div key={name} className="grid grid-cols-[7rem_7rem_1fr_1.15fr] gap-4 border-t border-border/60 py-3 text-sm"><strong>{name}</strong><span>{layer}</span><span>{observes}</span><span className="text-muted-foreground">{changes}</span></div>)}
      </div>
    </div>
  </div>;
}
