const ROWS = [
  {
    model: "Muse Glimmer 30B",
    formula: "39 × min(T, 2,048) + 13 × T",
    maxContext: "T = 131,072",
    hybrid: "1.78M layer-token",
    allGlobal: "6.82M",
    ratio: 26,
    note: "KV head 2 · head_dim 128을 곱하기 전의 topology-only 지표",
  },
  {
    model: "Gemma 4 31B",
    formula: "50 × min(T, 1,024) + 10 × T",
    maxContext: "T = 262,144",
    hybrid: "2.67M layer-token",
    allGlobal: "15.73M",
    ratio: 17,
    note: "공식 config의 local/global KV shape가 달라 byte 식은 layer별 합산",
  },
] as const;

export default function KVCapacityViz() {
  return (
    <figure
      data-viz="hybrid-kv-growth"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          KV growth proxy
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          아래 곡선은 allocator가 local block을 실제로 회수할 때의 이론값입니다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Attention topology만 비교하는 layer-token 지표이며 실측 capacity가
          아닙니다. 실제 VRAM은 layer별 KV shape와 cache dtype을 곱하고, hybrid
          allocator의 활성 여부까지 확인해야 합니다.
        </p>
      </figcaption>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2">
        {ROWS.map((row) => (
          <article
            key={row.model}
            className="min-w-0 rounded-xl border bg-background p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <strong className="text-sm">{row.model}</strong>
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                {row.maxContext}
              </span>
            </div>
            <p className="mt-3 break-words rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs leading-5">
              {row.formula}
            </p>
            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-muted"
              aria-label={`all-global 대비 ${row.ratio}%`}
            >
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${row.ratio}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
              <span>Hybrid {row.hybrid}</span>
              <span>All-global {row.allGlobal}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {row.note}
            </p>
          </article>
        ))}
      </div>
    </figure>
  );
}
