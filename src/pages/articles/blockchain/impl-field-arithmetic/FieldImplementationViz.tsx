export function FieldImplementationViz() {
  const steps = [
    ["parameter artifact", "p · limb order · R² · inv"],
    ["internal value", "little-endian limbs · Montgomery domain"],
    ["arithmetic profile", "adc · sbb · mac · reduction"],
    ["public bytes", "canonical 0 ≤ x < p"],
  ];
  return (
    <div data-viz="field-implementation-pipeline" className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">field value lifecycle</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map(([title, detail], index) => (
          <div key={title} className="relative min-w-0 rounded-lg border border-border bg-muted/20 p-4">
            <span className="text-xs font-semibold text-primary">0{index + 1}</span>
            <p className="mt-2 break-words font-semibold">{title}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{detail}</p>
            {index < steps.length - 1 ? <span aria-hidden className="absolute -right-2 top-1/2 hidden h-px w-2 bg-border md:block" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
