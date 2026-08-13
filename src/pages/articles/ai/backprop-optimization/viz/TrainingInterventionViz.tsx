const rows = [
  ["Objective", "loss·label smoothing·penalty", "어떤 해를 좋은 해로 볼지 바꿉니다."],
  ["Gradient", "clipping·scaling", "계산된 update signal의 크기나 수치 범위를 바꿉니다."],
  ["Optimizer", "momentum·Adam·AdamW", "gradient history와 parameter update rule을 바꿉니다."],
  ["Activation", "dropout·stochastic depth", "training graph에 noise 또는 경로 제거를 넣습니다."],
  ["Data", "augmentation·sampling", "모델이 보게 될 input distribution을 바꿉니다."],
  ["Stopping", "early stopping", "어느 checkpoint를 최종 해로 선택할지 바꿉니다."],
];

export default function TrainingInterventionViz() {
  return (
    <figure data-viz="training-intervention-map" className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Intervention map</p>
        <p className="mt-1 font-semibold">이름보다 training loop의 어디에 개입하는지 먼저 봅니다</p>
      </figcaption>
      <div className="grid gap-px bg-border/60 sm:grid-cols-2">
        {rows.map(([where, examples, effect]) => (
          <div key={where} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{where}</p>
              <p className="text-xs text-primary">{examples}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{effect}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
