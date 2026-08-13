type Knob = { readonly name: string; readonly controls: string; readonly watch: string };

export default function SchedulerKnobViz({ items }: { items: readonly Knob[] }) {
  return (
    <figure data-viz="scheduler-knob-ledger" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">KNOB → METRIC LEDGER</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">값을 바꿀 때 직접 제한한 자원과 회귀 지표를 함께 기록합니다</h3>
      </figcaption>
      <div className="grid gap-3 p-5 sm:p-7 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.name} className="min-w-0 rounded-lg border bg-background p-5">
            <code className="break-all text-xs font-bold text-primary">{item.name}</code>
            <p className="mt-3 text-sm font-semibold leading-6">{item.controls}</p>
            <div className="mt-4 border-t pt-4">
              <p className="text-xs font-bold text-muted-foreground">같이 볼 지표</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.watch}</p>
            </div>
          </article>
        ))}
      </div>
    </figure>
  );
}
