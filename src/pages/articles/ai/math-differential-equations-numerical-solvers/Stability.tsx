import ExplainedFormula from "@/components/ui/explained-formula";

const regimes = [
  [
    "0 < hλ < 1",
    "같은 부호로 감소",
    "안정적이지만 h가 크면 정확도는 낮을 수 있습니다.",
  ],
  ["1 < hλ < 2", "부호를 바꾸며 감소", "진동하지만 크기는 줄어듭니다."],
  [
    "hλ = 2",
    "크기가 그대로",
    "정확한 해는 줄어드는데 근삿값은 수렴하지 않습니다.",
  ],
  ["hλ > 2", "진동하며 증가", "물리계가 안정적이어도 수치해는 발산합니다."],
] as const;

export default function Stability() {
  return (
    <section id="stability" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Step이 너무 크면 안정적인 시스템도 계산에서는 폭주합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          정확한 해가 잘 줄어든다는 사실과 numerical method가 그 성질을
          보존한다는 사실은 다릅니다. <code>x′=−λx</code>에 Euler method를
          적용하면 매 step 값에 <code>1−hλ</code>를 곱합니다. 이 amplification
          factor의 절댓값이 1보다 작아야 근삿값도 줄어듭니다.
        </p>
      </div>

      <ExplainedFormula
        question="Decay ODE를 Euler method로 풀 때 어떤 step size가 안정적일까요?"
        idea={
          <>
            한 번의 update를 이전 값에 곱하는 배율로 정리합니다. 반복해도 크기가
            줄려면 그 배율의 절댓값이 1보다 작아야 합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          x_{n+1}&=(1-h\lambda)x_n \\
          |1-h\lambda|&<1 \\
          0&<h\lambda<2
        \end{aligned}`}
        terms={[
          {
            symbol: "1-h\\lambda",
            name: "amplification factor",
            description: "한 step 뒤 state 크기와 부호를 정하는 배율입니다.",
          },
          {
            symbol: "h\\lambda",
            name: "dimensionless step",
            description:
              "Solver step과 system time scale을 비교한 무차원 값입니다.",
          },
          {
            symbol: "|1-h\\lambda|<1",
            name: "stability condition",
            description: "반복할수록 numerical state가 줄어드는 조건입니다.",
          },
        ]}
        assumptions={[
          "Scalar linear test equation과 explicit Euler를 분석합니다.",
          "안정성은 정확도를 보장하지 않습니다. 안정 영역 안에서도 h가 크면 phase·amplitude error가 큽니다.",
        ]}
        interpretation="λ=10 s⁻¹이면 h<0.2 s여야 합니다. h=0.25 s에서는 정확한 해가 감소해도 factor가 −1.5가 되어 근삿값의 부호와 크기가 번갈아 폭주합니다."
      />

      <figure
        data-viz="euler-stability-regimes"
        className="not-prose my-8 rounded-xl border border-border bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-5 text-sm font-semibold">
          hλ가 바꾸는 Euler 반복의 모양
        </figcaption>
        <div className="grid gap-4 sm:grid-cols-2">
          {regimes.map(([range, behavior, note]) => (
            <div key={range} className="min-w-0 border-t border-border pt-4">
              <p className="break-words font-mono text-sm text-primary">
                {range}
              </p>
              <p className="mt-2 font-semibold">{behavior}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}
