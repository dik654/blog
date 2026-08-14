export default function DistributionViz() {
  const items = [
    ["관찰", "꼬리 · 절단 · 반올림 · 집단 혼합", "분포가 만들어진 이유를 먼저 찾습니다."],
    ["후보", "원본 · log1p · robust transform", "변환은 자동 규칙이 아니라 비교할 가설입니다."],
    ["판정", "같은 split · 원래 단위 metric", "residual과 slice 성능까지 확인합니다."],
  ];
  return (
    <div data-viz data-viz-canvas className="min-w-0 rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Distribution diagnosis</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">분포를 본 뒤 곧바로 변환하지 않습니다</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map(([step, title, body], index) => (
          <article key={step} className="min-w-0 rounded-lg border border-border/70 p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded border border-border/70 text-sm font-bold">{index + 1}</span>
              <p className="text-sm font-semibold text-primary">{step}</p>
            </div>
            <p className="mt-3 font-medium text-foreground">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 border-l border-border pl-4 text-sm leading-6 text-muted-foreground">
        이상값도 같은 흐름을 따릅니다. 데이터 계약 위반인지 드문 정상 사례인지 확인한 뒤 처리 전후를 비교합니다.
      </p>
    </div>
  );
}
