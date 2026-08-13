import { EUREKA_ABLATIONS, EUREKA_EVIDENCE } from "@/content/sionic-eureka";

const fmt = (value: number | null) =>
  value === null ? "미실험" : value.toFixed(4);

export default function Ablation() {
  return (
    <section id="ablation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Loss ablation: 관측된 순위와 원인 해석을 분리한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          student·teacher·learning rate를 고정하고 loss만 바꾼 내부 실험에서는
          네 데이터 모두 KL-div(τ=0.05)가 가장 높았다. 아래 표는 그 관측을
          그대로 보존하지만, 다른 model·candidate set·teacher calibration에서도
          같은 순위가 나온다는 뜻은 아니다.
        </p>
        <div
          data-viz="eureka-loss-ablation-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[1fr_repeat(4,minmax(0,0.9fr))] gap-3 border-b bg-muted/25 px-4 py-3 text-right text-xs font-semibold text-muted-foreground md:grid">
            <span className="text-left">학습 데이터</span>
            <span>KL τ=.05</span>
            <span>KL τ=1.0</span>
            <span>Margin-MSE</span>
            <span>Cosine distill.</span>
          </div>
          <div className="divide-y divide-border/70">
            {EUREKA_ABLATIONS.map((row) => (
              <article
                key={row.dataset}
                className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[1fr_repeat(4,minmax(0,0.9fr))] md:items-center md:text-right"
              >
                <p className="text-sm font-semibold md:text-left">{row.dataset}</p>
                {([
                  ["KL τ=.05", fmt(row.kl005), true],
                  ["KL τ=1.0", fmt(row.kl10), false],
                  ["Margin-MSE", fmt(row.marginMse), false],
                  ["Cosine distill.", fmt(row.cosine), false],
                ] as const).map(([label, value, winner]) => (
                  <div key={label} className="flex items-baseline justify-between gap-3 md:block">
                    <span className="text-[11px] font-semibold text-muted-foreground md:hidden">{label}</span>
                    <span className={`text-sm tabular-nums ${winner ? "font-semibold text-emerald-700 dark:text-emerald-400" : "text-foreground/80"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {EUREKA_EVIDENCE.internalExperiment}
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">말할 수 있는 것</h3>
        <ul>
          <li>
            이 후보 구성에서는 낮은 τ의 listwise KL이 teacher의 top ranking을 더
            강하게 전달했다.
          </li>
          <li>
            τ=1.0의 낮은 점수는 이 설정에서 평탄한 target이 약한
            supervision이었을 가능성과 일치한다.
          </li>
          <li>
            Margin-MSE는 pairwise score gap을, cosine distillation은
            representation alignment를 직접 최적화하므로 KL과 전달 단위가
            다르다.
          </li>
        </ul>
        <h3 className="mt-6 mb-3 text-xl font-semibold">
          아직 말할 수 없는 것
        </h3>
        <ul>
          <li>
            cosine distillation은 데이터 A 한 번뿐이라 일관된 열세를 입증하지
            못한다.
          </li>
          <li>
            “기존 embedding space가 흐트러져 하락했다”는 설명은 representation
            drift 측정이 없는 한 가설이다.
          </li>
          <li>
            Margin-MSE는 embedding 자체의 절대 좌표를 맞추는 loss가 아니라
            teacher의 pairwise margin을 맞춘다. scale에 민감할 수 있지만 cosine
            정렬과 같은 방식은 아니다.
          </li>
        </ul>
      </div>
    </section>
  );
}
