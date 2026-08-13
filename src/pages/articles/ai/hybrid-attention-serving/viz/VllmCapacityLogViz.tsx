const RUNS = [
  {
    model: "Qwen 27B 배포본",
    cache: "97,216",
    concurrency: "5.17×",
    direct: "1.48×",
    status: "단위 불일치",
    tone: "border-amber-400/40 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200",
  },
  {
    model: "Gemma 4 31B",
    cache: "88,824",
    concurrency: "1.36×",
    direct: "1.36×",
    status: "직접 검산 일치",
    tone: "border-violet-400/35 bg-violet-500/[0.06] text-violet-800 dark:text-violet-200",
  },
  {
    model: "Muse Glimmer 30B",
    cache: "352,736",
    concurrency: "5.38×",
    direct: "5.38×",
    status: "직접 검산 일치",
    tone: "border-emerald-400/35 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-200",
  },
] as const;

export default function VllmCapacityLogViz() {
  return (
    <figure
      data-viz="vllm-capacity-log"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">
          Project measurements · max_model_len 65,536
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          Gemma와 Muse는 나눗셈이 맞고, Qwen 로그만 다른 단위를 사용합니다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          같은 이름의 “token”도 hybrid cache group과 logging path에 따라 의미가
          달라질 수 있습니다. 그래서 각 행에서 먼저{" "}
          <span className="font-mono">GPU KV cache size ÷ 65,536</span>을
          검산합니다.
        </p>
      </figcaption>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-3">
        {RUNS.map((run) => (
          <article
            key={run.model}
            className={`min-w-0 rounded-lg border p-4 sm:p-5 ${run.tone}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <strong className="text-sm text-foreground">{run.model}</strong>
              <span className="rounded-md bg-background/80 px-2 py-1 text-[10px] font-bold">
                {run.status}
              </span>
            </div>
            <dl className="mt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">GPU KV cache size</dt>
                <dd className="font-mono font-black">{run.cache}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">단순 나눗셈</dt>
                <dd className="font-mono font-black">{run.direct}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-current/10 pt-3">
                <dt className="font-semibold text-foreground">
                  Runtime concurrency
                </dt>
                <dd className="font-mono text-base font-black">
                  {run.concurrency}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="grid gap-px border-t bg-border md:grid-cols-2">
        <div className="bg-muted/20 px-5 py-4 sm:px-6">
          <p className="text-xs font-bold text-foreground">일치하는 경우</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            해당 로그의 cache token을 max-length request가 공유하는 단순
            capacity로 읽을 수 있습니다.
          </p>
        </div>
        <div className="bg-muted/20 px-5 py-4 sm:px-6">
          <p className="text-xs font-bold text-foreground">
            일치하지 않는 경우
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            표시 token과 concurrency가 서로 다른 cache group 또는
            token-equivalent 기준입니다. 두 값을 억지로 한 표준 단위처럼
            비교하지 않습니다.
          </p>
        </div>
      </div>
    </figure>
  );
}
