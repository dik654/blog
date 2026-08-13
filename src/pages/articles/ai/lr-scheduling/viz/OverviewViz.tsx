const phases = [
  { index: "01", name: "Warmup", range: "0 → W", question: "초기 update를 얼마나 늦출까?", width: "22%" },
  { index: "02", name: "Main schedule", range: "W → T", question: "남은 budget을 어떤 곡선으로 쓸까?", width: "53%" },
  { index: "03", name: "Finish", range: "t = T", question: "어떤 LR와 checkpoint로 끝낼까?", width: "25%" },
];

export default function OverviewViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">Schedule contract</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">한 줄의 LR trace를 update budget·state·evidence와 함께 읽습니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="hidden h-1 overflow-hidden rounded-full bg-muted sm:flex" aria-hidden="true">
          {phases.map((phase, index) => <span key={phase.name} className={index === 0 ? "bg-blue-600" : index === 1 ? "bg-blue-400" : "bg-blue-200 dark:bg-blue-700"} style={{ width: phase.width }} />)}
        </div>
        <ol className="mt-0 divide-y divide-border border-y border-border sm:mt-5 sm:grid sm:grid-cols-[0.8fr_1.7fr_0.9fr] sm:divide-x sm:divide-y-0">
          {phases.map((phase) => (
            <li key={phase.name} className="grid grid-cols-[2rem_1fr] gap-3 py-4 sm:block sm:px-4 sm:first:pl-0 sm:last:pr-0">
              <span className="font-mono text-xs text-blue-700 dark:text-blue-300">{phase.index}</span>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{phase.name}</p>
                  <code className="text-xs text-muted-foreground">{phase.range}</code>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{phase.question}</p>
              </div>
            </li>
          ))}
        </ol>
        <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
          <div><dt className="font-semibold">Clock</dt><dd className="mt-1 text-muted-foreground">global optimizer update</dd></div>
          <div><dt className="font-semibold">State</dt><dd className="mt-1 text-muted-foreground">optimizer + scheduler + cursor</dd></div>
          <div><dt className="font-semibold">Evidence</dt><dd className="mt-1 text-muted-foreground">LR·loss·update norm·validation</dd></div>
        </dl>
      </div>
    </figure>
  );
}
