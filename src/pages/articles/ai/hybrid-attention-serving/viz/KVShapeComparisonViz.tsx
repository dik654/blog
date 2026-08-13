const MODELS = [
  {
    name: "Qwen 27B 배포본",
    detail: "qwen36-27b-fp8 · 프로젝트 runtime label",
    layers: 64,
    kvHeads: 4,
    headDim: 256,
    units: "65,536",
    factor: "1.00×",
    bytes: "256 KiB",
    width: 27,
    tone: "bg-sky-500",
  },
  {
    name: "Gemma 4 31B",
    detail: "실측 allocator를 설명하는 uniform proxy",
    layers: 60,
    kvHeads: 16,
    headDim: 256,
    units: "245,760",
    factor: "3.75×",
    bytes: "960 KiB",
    width: 100,
    tone: "bg-violet-500",
  },
  {
    name: "Muse Glimmer 30B",
    detail: "공식 text config",
    layers: 52,
    kvHeads: 2,
    headDim: 128,
    units: "13,312",
    factor: "0.203×",
    bytes: "52 KiB",
    width: 6,
    tone: "bg-emerald-500",
  },
] as const;

export default function KVShapeComparisonViz() {
  return (
    <figure
      data-viz="kv-shape-comparison"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">Dense-allocation proxy</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          같은 cache dtype이라면 층·KV head·head_dim이 토큰당 비용의 순서를
          결정합니다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          K와 V를 별도 BF16 tensor로 저장한다고 가정했습니다. 막대는 Gemma
          proxy를 100으로 둔 상대 크기이며, weight가 FP8인지 4-bit인지는 이
          계산에 들어가지 않습니다.
        </p>
      </figcaption>

      <div className="space-y-6 p-5 sm:p-7">
        {MODELS.map((model) => (
          <article
            key={model.name}
            className="rounded-lg border bg-background p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <strong className="text-sm">{model.name}</strong>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {model.detail}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-muted px-2.5 py-1 font-mono text-xs">
                  {model.factor}
                </span>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-black text-primary">
                  {model.bytes}/token
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.9fr)] md:items-center">
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full min-w-1.5 rounded-full ${model.tone}`}
                  style={{ width: `${model.width}%` }}
                />
              </div>
              <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-1.5 text-center font-mono text-[10px] sm:text-xs">
                <span className="rounded-lg bg-muted/60 px-1.5 py-2">
                  L {model.layers}
                </span>
                <span className="rounded-lg bg-muted/60 px-1.5 py-2">
                  Hkv {model.kvHeads}
                </span>
                <span className="rounded-lg bg-muted/60 px-1.5 py-2">
                  D {model.headDim}
                </span>
                <span className="px-1 text-muted-foreground">
                  = {model.units}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-px border-t bg-border sm:grid-cols-3">
        <div className="bg-muted/20 px-5 py-4">
          <p className="text-xs font-bold">Gemma / Qwen</p>
          <p className="mt-1 font-mono text-sm font-black">
            245,760 ÷ 65,536 = 3.75×
          </p>
        </div>
        <div className="bg-muted/20 px-5 py-4">
          <p className="text-xs font-bold">Muse / Qwen</p>
          <p className="mt-1 font-mono text-sm font-black">
            13,312 ÷ 65,536 = 0.203×
          </p>
        </div>
        <div className="bg-muted/20 px-5 py-4">
          <p className="text-xs font-bold">Capacity 방향</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            KV byte/token이 작을수록 같은 KV 예산에 더 많은 token이 들어갑니다.
          </p>
        </div>
      </div>
    </figure>
  );
}
