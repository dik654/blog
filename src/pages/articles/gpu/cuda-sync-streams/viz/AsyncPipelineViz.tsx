const rows = [
  { name: "Stream A", slots: ["H2D A", "Kernel A", "D2H A", ""] },
  { name: "Stream B", slots: ["", "H2D B", "Kernel B", "D2H B"] },
] as const;

export default function AsyncPipelineViz() {
  return (
    <figure
      className="not-prose my-8 rounded-xl border border-border bg-background p-4 sm:p-6"
      aria-labelledby="cuda-async-pipeline-viz-title"
    >
      <figcaption id="cuda-async-pipeline-viz-title">
        <p className="text-sm font-bold">
          Stream은 순서를 보장하고, hardware engine이 겹침을 결정합니다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          같은 행은 순서가 고정되고, 다른 행의 독립 작업은 copy engine·compute
          engine과 자원이 허용할 때 겹칠 수 있습니다.
        </p>
      </figcaption>
      <div className="mt-5 overflow-x-auto rounded-lg border border-border/80">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[96px_repeat(4,minmax(112px,1fr))] bg-muted/40 text-[11px] font-semibold text-muted-foreground">
            <span className="p-3">queue</span>
            {["t₀", "t₁", "t₂", "t₃"].map((time) => (
              <span
                key={time}
                className="border-l border-border/70 p-3 text-center"
              >
                {time}
              </span>
            ))}
          </div>
          {rows.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[96px_repeat(4,minmax(112px,1fr))] border-t border-border/70 text-xs"
            >
              <span className="p-3 font-semibold">{row.name}</span>
              {row.slots.map((slot, index) => (
                <span
                  key={`${row.name}-${index}`}
                  className="min-h-12 border-l border-border/70 p-3 text-center leading-5"
                >
                  {slot || (
                    <span className="text-muted-foreground/50">idle</span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto pb-1" aria-label="가로 스크롤 안내">
        <p className="min-w-[620px] text-xs leading-5 text-muted-foreground">
          Event를 A의 Kernel 뒤에 기록하고 B에서 기다리면 필요한 edge만 추가할
          수 있습니다. Device 전체 barrier는 이 독립성을 모두 없앱니다.
        </p>
      </div>
    </figure>
  );
}
