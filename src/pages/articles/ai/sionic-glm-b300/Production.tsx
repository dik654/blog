const productionChecks = [
  ["품질", "golden prompts·logit drift·acceptance length·task score"],
  ["지연", "TTFT·inter-token latency·p50/p95/p99·request length"],
  ["처리량", "batch/concurrency별 accepted tok/s와 generated tok/s 분리"],
  ["메모리", "weight·KV cache·CUDA Graph pool·fragmentation"],
  ["라우팅", "prefix/KV cache hit, session affinity, prefill/decode split"],
  ["복구", "custom kernel fallback, numerical guard, upstream regression"],
] as const;

export default function Production() {
  return (
    <section id="production" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        한 노드의 최고 속도에서 service SLO로
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 작업의 정확한 표현은 “한 GPU 전용”이 아니라{" "}
          <strong>B300 8-GPU TP8 노드에서 GLM-5.2에 맞춘 최적화</strong>다.
          production에서는 여러 session, KV cache hit, concurrent request,
          prefill/decode 간섭과 failure recovery가 추가된다.
        </p>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {productionChecks.map(([name, checks]) => (
            <div key={name} className="rounded-xl border bg-card p-4">
              <strong className="text-sm">{name}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {checks}
              </p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          최적화의 순서는 재사용 가능하다. 먼저 traffic roofline으로 기대치를 세우고 profile로 underutilization을 찾는다. kernel·runtime을 고친
          뒤 MTP acceptance를 quality와 함께 튜닝한다. 특정 µs 숫자보다 이 측정 순서와 evidence ledger가 다음 model·GPU로 이전 가능한 자산이다.
        </p>
      </div>
    </section>
  );
}
