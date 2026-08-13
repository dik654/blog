const cases = [
  {
    title: "Global memory",
    question: "32 lanes의 주소가 몇 segment에 걸치는가?",
    good: "연속 float 32개 → 4 × 32 B transaction",
    bad: "큰 stride → 더 많은 transaction과 버린 byte",
  },
  {
    title: "Shared memory",
    question: "서로 다른 주소가 몇 bank에 겹치는가?",
    good: "stride 1 word → 32 banks 병렬 접근",
    bad: "stride 32 words → 같은 bank로 몰려 직렬화",
  },
] as const;

export default function MemoryAccessViz() {
  return (
    <figure
      className="not-prose my-8 rounded-xl border border-border bg-background p-4 sm:p-6"
      aria-labelledby="cuda-memory-access-viz-title"
    >
      <figcaption id="cuda-memory-access-viz-title">
        <p className="text-sm font-bold">
          같은 warp 주소라도 확인할 병목은 두 가지입니다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Coalescing은 off-chip transaction 수, bank conflict는 on-chip
          shared-memory 서비스 횟수를 묻습니다.
        </p>
      </figcaption>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        {cases.map((item) => (
          <section
            key={item.title}
            className="min-w-0 rounded-lg border border-border/80 p-4"
          >
            <h3 className="text-sm font-bold">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.question}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-600/30 p-3">
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  효율적인 접근
                </p>
                <p className="mt-2 text-xs leading-5">{item.good}</p>
              </div>
              <div className="rounded-lg border border-amber-600/30 p-3">
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  낭비가 생기는 접근
                </p>
                <p className="mt-2 text-xs leading-5">{item.bad}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        Shared memory를 추가했다고 자동으로 빨라지지는 않습니다. Global
        transaction을 줄이면서 reuse가 생기고, bank conflict와 barrier 비용까지
        감당할 때만 이득입니다.
      </p>
    </figure>
  );
}
