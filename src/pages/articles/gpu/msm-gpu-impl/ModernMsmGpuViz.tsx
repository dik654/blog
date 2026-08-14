const steps = [
  ["signed digits", "scalar → window별 digit"],
  ["sort · index", "같은 bucket 작업을 묶기"],
  ["accumulate", "bucket마다 point 누적"],
  ["integrate", "running sum → window 결과"],
];

export function ModernMsmGpuViz() {
  return (
    <figure className="not-prose rounded-xl border border-border bg-card p-5" aria-labelledby="msm-viz-title">
      <figcaption id="msm-viz-title" className="text-sm font-bold">한 scalar-point 입력이 sppark의 MSM 작업표를 통과하는 경로</figcaption>
      <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-4">
        {steps.map(([title, description], index) => (
          <div key={title} className="relative min-w-0 rounded-lg border border-border bg-muted/20 p-4">
            <span className="text-[11px] font-semibold text-primary">0{index + 1}</span>
            <p className="mt-1 break-words text-sm font-bold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{description}</p>
            {index < steps.length - 1 ? <span aria-hidden className="absolute -right-2 top-1/2 hidden h-px w-2 bg-border md:block" /> : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">점 덧셈 수와 workspace는 window 폭·scalar 분포·구현 revision에 따라 달라집니다. 이 그림은 고정 speedup이 아니라 pinned source의 dataflow만 나타냅니다.</p>
    </figure>
  );
}
