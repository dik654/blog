const stages = [
  {
    title: "학습 범위",
    body: "Checkpoint가 실제로 본 sequence length와 RoPE 설정을 확인한다.",
  },
  {
    title: "위치 확장",
    body: "Position 또는 frequency를 조정해 학습 범위 밖의 회전을 완화한다.",
  },
  {
    title: "Long-context adaptation",
    body: "필요하면 긴 sequence로 continued training이나 fine-tuning을 수행한다.",
  },
  {
    title: "동작 검증",
    body: "Perplexity뿐 아니라 retrieval·reasoning·짧은 입력 regression을 함께 본다.",
  },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Context window를 늘리는 것과 긴 문맥을 잘 쓰는 것은 다르다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          LLM 설정에서 최대 길이만 크게 바꾸면 더 많은 token을 메모리에 올릴 수는 있지만 모델이 그 위치를 올바르게 해석한다는 보장은 없다. pretraining에서 보지 못한
          위치로 RoPE 각도가 확장되면 attention pattern이 달라질 수 있기 때문이다. YaRN은 기존 checkpoint의 RoPE frequency를 조정하고 적은
          long-context data로 adaptation해 이 간극을 줄이는 방법이다.
        </p>
        <p>
          이 글은 먼저 RoPE가 상대 위치를 어떻게 만드는지 살펴본 뒤 Position Interpolation(PI)과 NTK-aware scaling을 거쳐 YaRN이 어떤 문제를
          보완했는지 설명한다. 마지막에는 현재 라이브러리 설정을 그대로 복사하기 전에 확인해야 할 항목을 정리한다.
        </p>
      </div>

      <figure data-viz="context-extension-checklist" className="not-prose my-9 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption className="mb-4 text-sm font-semibold">
          긴 문맥 지원을 판단하는 네 단계
        </figcaption>
        <div className="grid gap-3 md:grid-cols-4">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className="relative min-w-0 rounded-lg border border-border/70 bg-background p-4"
            >
              <p className="text-xs font-bold text-primary/70">
                0{index + 1}
              </p>
              <p className="mt-2 font-semibold">{stage.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {stage.body}
              </p>
              {index < stages.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border/70 bg-card px-1.5 py-0.5 text-xs md:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>지원 길이는 capability claim이지 품질 보증서가 아니다</h3>
        <p>
          예를 들어 128K 입력을 받아도 앞부분과 끝부분만 활용하고 가운데 근거를
          놓칠 수 있다. 이 현상은 보통 <em>lost in the middle</em>이라고 부른다.
          따라서 최대 길이까지 실행되는지만 확인하지 말고, needle-in-a-haystack
          retrieval, 여러 근거를 합치는 task, 실제 prompt 분포와 짧은 입력의
          품질을 함께 평가해야 한다.
        </p>
        <p>
          full attention의 계산량은 sequence length에 따라 빠르게 늘고 KV cache도 길이에 비례해 커진다. RoPE scaling은 위치 표현을 바꾸는 기술이지
          attention 계산량이나 KV cache를 줄이는 기술은 아니므로 serving capacity는 별도로 설계해야 한다.
        </p>

        <h3>먼저 세 가지를 분리해야 한다</h3>
        <p>
          <strong>입력 가능 길이</strong>는 runtime이 받아들이는 token 수이고,
          <strong>위치 일반화</strong>는 학습 범위 밖의 상대 거리를 모델이 해석하는
          능력이며, <strong>실제 task 성능</strong>은 그 문맥에서 근거를 찾아 답에
          사용하는 능력이다. YaRN은 두 번째 문제를 다루고 adaptation으로 세 번째를
          회복하려는 방법이지, 세 항목을 한 번에 보장하는 스위치가 아니다.
        </p>
      </div>
    </section>
  );
}
