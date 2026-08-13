const PATTERNS = [
  {
    name: "MHA",
    fullName: "Multi-Head Attention",
    kvHeads: 8,
    groupSize: 1,
    summary: "Q head마다 K/V head를 하나씩 둡니다.",
    cache: "KV 8개",
    tone: "violet",
  },
  {
    name: "GQA",
    fullName: "Grouped-Query Attention",
    kvHeads: 2,
    groupSize: 4,
    summary: "Q head 여러 개가 같은 K/V head를 공유합니다.",
    cache: "KV 2개",
    tone: "cyan",
  },
  {
    name: "MQA",
    fullName: "Multi-Query Attention",
    kvHeads: 1,
    groupSize: 8,
    summary: "모든 Q head가 K/V head 하나를 공유합니다.",
    cache: "KV 1개",
    tone: "amber",
  },
] as const;

const TONES = {
  violet: {
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    query:
      "border-violet-400/25 bg-violet-500/[0.07] text-violet-700 dark:text-violet-300",
    kv: "border-violet-400/35 bg-violet-500/10 text-violet-800 dark:text-violet-200",
  },
  cyan: {
    badge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    query:
      "border-cyan-400/25 bg-cyan-500/[0.07] text-cyan-700 dark:text-cyan-300",
    kv: "border-cyan-400/35 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    query:
      "border-amber-400/25 bg-amber-500/[0.07] text-amber-700 dark:text-amber-300",
    kv: "border-amber-400/35 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  },
} as const;

export default function KVHeadSharingViz() {
  return (
    <figure
      data-viz="kv-head-sharing"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">MHA → GQA → MQA</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          줄어드는 것은 Q가 아니라, 과거 token마다 보관할 K/V의 사본 수입니다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          아래는 Q head가 8개인 같은 attention layer입니다. Q는 현재 token을
          계산할 때 만들고, K/V만 다음 decode step을 위해 cache에 남깁니다.
        </p>
      </figcaption>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-3">
        {PATTERNS.map((pattern) => {
          const tone = TONES[pattern.tone];
          return (
            <article
              key={pattern.name}
              className="min-w-0 rounded-lg border bg-background p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-black ${tone.badge}`}
                  >
                    {pattern.name}
                  </span>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    {pattern.fullName}
                  </p>
                </div>
                <span className="rounded-lg border bg-card px-2.5 py-1 font-mono text-xs font-bold">
                  {pattern.cache}
                </span>
              </div>

              <div
                className="mt-5 grid grid-cols-8 gap-1"
                aria-label={`${pattern.name}의 query head 8개`}
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <span
                    key={index}
                    className={`flex h-8 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${tone.query}`}
                  >
                    Q{index}
                  </span>
                ))}
              </div>
              <div className="my-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {pattern.groupSize}:1 공유
                <span className="h-px flex-1 bg-border" />
              </div>
              <div
                className="grid grid-cols-8 gap-1"
                aria-label={`${pattern.name}의 key-value head ${pattern.kvHeads}개`}
              >
                {Array.from({ length: pattern.kvHeads }, (_, index) => (
                  <span
                    key={index}
                    className={`flex h-10 items-center justify-center rounded-lg border font-mono text-xs font-black ${tone.kv}`}
                    style={{
                      gridColumn: `span ${pattern.groupSize} / span ${pattern.groupSize}`,
                    }}
                  >
                    KV{index}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                {pattern.summary}
              </p>
            </article>
          );
        })}
      </div>

      <div className="border-t bg-muted/20 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-6">
        Q head 수가 같아도{" "}
        <strong className="text-foreground">KV head가 8 → 2 → 1</strong>로 줄면
        cache의 head 축도 같은 비율로 줄어듭니다. GQA는 MHA의 표현력과 MQA의
        decode 효율 사이에서 가장 많이 쓰이는 절충안입니다.
      </div>
    </figure>
  );
}
