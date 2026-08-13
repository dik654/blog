const evaluations = [
  ["01", ".42", "best", "save"],
  ["02", ".38", "best", "save j*"],
  ["03", ".39", "wait 1", "keep j*"],
  ["04", ".40", "wait 2", "keep j*"],
  ["05", ".41", "stop", "load j*"],
];

export default function EarlyStoppingViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Checkpoint selection</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Stop event와 반환할 best snapshot은 서로 다른 위치입니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="overflow-hidden border-y border-border">
          <div className="hidden grid-cols-[5rem_5rem_1fr_1fr] bg-muted/30 text-xs font-semibold text-muted-foreground sm:grid">
            {['eval','val loss','counter','artifact'].map(item => <span key={item} className="px-3 py-3">{item}</span>)}
          </div>
          <ol className="divide-y divide-border">
            {evaluations.map(([step, loss, state, artifact]) => (
              <li key={step} className={`grid grid-cols-[3rem_4rem_1fr] gap-2 border-l px-0 py-3 text-sm sm:grid-cols-[5rem_5rem_1fr_1fr] sm:px-3 ${step === "02" ? "border-l-emerald-500" : step === "05" ? "border-l-amber-500" : "border-l-transparent"}`}>
                <span className="font-mono text-xs">{step}</span><span className="font-mono font-semibold">{loss}</span><span>{state}</span><span className="col-start-2 text-xs text-muted-foreground sm:col-start-auto sm:text-sm">{artifact}</span>
              </li>
            ))}
          </ol>
        </div>
        <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
          <div><dt className="font-semibold">Monitor</dt><dd className="mt-1 text-muted-foreground">val_loss</dd></div>
          <div><dt className="font-semibold">Direction</dt><dd className="mt-1 text-muted-foreground">min</dd></div>
          <div><dt className="font-semibold">Threshold</dt><dd className="mt-1 text-muted-foreground">min_delta</dd></div>
          <div><dt className="font-semibold">Patience</dt><dd className="mt-1 text-muted-foreground">evaluation events</dd></div>
        </dl>
      </div>
    </figure>
  );
}
