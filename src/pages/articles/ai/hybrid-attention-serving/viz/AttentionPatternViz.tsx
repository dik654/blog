const MODELS = [
  {
    name: "Muse Glimmer 30B",
    pattern: ["L", "L", "L", "G"],
    repeat: "× 13 = 52 layers",
    local: "Local window 2,048",
    global: "13 global layers",
    tone: "violet",
  },
  {
    name: "Gemma 4 31B",
    pattern: ["L", "L", "L", "L", "L", "G"],
    repeat: "× 10 = 60 layers",
    local: "Local window 1,024",
    global: "10 global layers · final layer global",
    tone: "blue",
  },
] as const;

export default function AttentionPatternViz() {
  return (
    <figure
      data-viz="hybrid-attention-pattern"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">Attention topology</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          두 모델 모두 local에서 비용을 줄이고 global에서 문맥을 다시 섞는다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          차이는 local/global 비율과 window 크기, KV head 구성입니다. 이 차이가
          context가 길어질 때 cache 증가율을 바꿉니다.
        </p>
      </figcaption>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2">
        {MODELS.map((model) => (
          <article
            key={model.name}
            className="min-w-0 rounded-xl border bg-background p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-sm">{model.name}</strong>
              <span className="font-mono text-xs text-muted-foreground">
                {model.repeat}
              </span>
            </div>
            <div
              className="mt-4 flex flex-wrap gap-2"
              aria-label={`${model.name} layer pattern`}
            >
              {model.pattern.map((kind, index) => (
                <span
                  key={`${kind}-${index}`}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 font-mono text-sm font-black ${
                    kind === "G"
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-300"
                      : model.tone === "violet"
                        ? "border-violet-400/30 bg-violet-400/10 text-violet-700 dark:text-violet-300"
                        : "border-blue-400/30 bg-blue-400/10 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {kind}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs leading-5 text-muted-foreground">
                <strong className="text-foreground">L</strong> · {model.local}
              </p>
              <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs leading-5 text-muted-foreground">
                <strong className="text-foreground">G</strong> · {model.global}
              </p>
            </div>
          </article>
        ))}
      </div>
    </figure>
  );
}
