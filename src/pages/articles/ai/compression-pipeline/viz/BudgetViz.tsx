const REQUEST_SLOTS = Array.from({ length: 8 }, (_, index) => index + 1);

export default function BudgetViz() {
  return (
    <figure
      data-viz
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">
          메모리 구조 · 설명용 24GB device
        </p>
        <h3 className="mt-1 text-base font-semibold">
          고정 16GB를 뺀 8GB만 요청 state에 쓸 수 있습니다
        </h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-5">
        <div
          className="grid min-h-24 grid-cols-[12fr_2fr_2fr_8fr] border border-border"
          aria-label="24GB 중 weight 12GB, workspace 2GB, headroom 2GB, 요청 state 8GB"
        >
          <div className="flex min-w-0 flex-col justify-between bg-muted/60 p-2 sm:p-3">
            <strong className="break-keep text-xs">Weights</strong>
            <span className="font-mono text-sm font-bold">12GB</span>
          </div>
          <div className="flex min-w-0 items-center justify-center border-l border-border bg-muted/35 p-1 [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb] sm:flex-col sm:p-2">
            <span className="hidden break-keep text-[9px] sm:block">Workspace</span>
            <strong className="font-mono text-xs">2GB</strong>
          </div>
          <div className="flex min-w-0 items-center justify-center border-l border-border bg-muted/20 p-1 [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb] sm:flex-col sm:p-2">
            <span className="hidden break-keep text-[9px] sm:block">Headroom</span>
            <strong className="font-mono text-xs">2GB</strong>
          </div>
          <div className="flex min-w-0 flex-col justify-between border-l-2 border-primary bg-primary/5 p-2 sm:p-3">
            <strong className="break-keep text-xs text-primary">요청 state</strong>
            <span className="font-mono text-sm font-bold">8GB</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">8GB</span>
          <span aria-hidden>÷</span>
          <span className="font-mono">요청당 1GB</span>
          <span aria-hidden>=</span>
          <strong className="text-foreground">최대 8개</strong>
        </div>
        <div className="mt-3 grid grid-cols-8 gap-1" aria-label="각 1GB인 요청 state 여덟 개">
          {REQUEST_SLOTS.map((slot) => (
            <div
              key={slot}
              className="flex aspect-square min-w-0 items-center justify-center border border-primary/45 bg-primary/5 font-mono text-[10px] font-bold text-primary"
              aria-label={`요청 ${slot}, 1GB`}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        이 값은 OOM 기준의 1차 상한입니다. 실제 허용 동시 요청 수는 p95와
        sustained load를 측정한 뒤 낮아질 수 있습니다.
      </p>
    </figure>
  );
}
