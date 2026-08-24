import ExplainedFormula from "@/components/ui/explained-formula";

const steps = [
  ["기울기 측정", "k₁=f(xₙ,tₙ)", "현재 위치의 순간 변화율을 계산합니다."],
  [
    "직선으로 전진",
    "Δx=h·k₁",
    "그 기울기가 한 step 동안 유지된다고 근사합니다.",
  ],
  ["새 위치", "xₙ₊₁=xₙ+Δx", "새 위치에서 다음 기울기를 다시 계산합니다."],
] as const;

export default function EulerMethod() {
  return (
    <section id="euler-method" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Euler method는 곡선을 짧은 접선 조각으로 근사합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          복잡한 ODE는 해를 닫힌 식으로 구하기 어렵습니다. 컴퓨터는 현재
          derivative를 한 번 계산하고 짧은 시간 <code>h</code>만큼 직선으로
          이동하는 과정을 반복합니다. 이것이 가장 단순한 explicit Euler
          method입니다.
        </p>
      </div>

      <figure
        data-viz="euler-step"
        className="not-prose my-8 rounded-xl border border-border bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-5 text-sm font-semibold">
          한 step에서 실제로 일어나는 계산
        </figcaption>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(([title, equation, body], index) => (
            <div key={title} className="min-w-0 border-l border-border pl-4">
              <p className="text-xs font-medium text-muted-foreground">
                STEP {index + 1}
              </p>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-2 break-words font-mono text-sm text-primary">
                {equation}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <ExplainedFormula
        question="현재 derivative만 알고 다음 state를 어떻게 근사할까요?"
        idea={
          <>
            미분의 local linearity를 이용해 짧은 구간에서는 변화량을
            derivative×시간으로 근사합니다. Step을 반복할 때마다 derivative를
            새로 평가합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          t_{n+1}&=t_n+h \\
          x_{n+1}&=x_n+h f(x_n,t_n)
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          t_{n+1}&=\underbrace{t_n+h}_{\text{step size 계산}} \\
          x_{n+1}&=\underbrace{x_n+h f(x_n,t_n)}_{\text{estimated change 계산}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`t_n+h`, annotation: ["step size이(가) 식의 결과에 기여하는 방식을","계산합니다.","미분의 local linearity를 이용해 짧은 구간에서는","변화량을 derivative×시간으로 근사합니다."] },
          { expression: String.raw`x_n+h f(x_n,t_n)`, annotation: ["estimated change이(가) 식의 결과에 기여하는","방식을 계산합니다.","미분의 local linearity를 이용해 짧은 구간에서는","변화량을 derivative×시간으로 근사합니다."] },
        ]}
        terms={[
          {
            symbol: "h",
            name: "step size",
            description: "한 번에 전진하는 시간 간격입니다.",
          },
          {
            symbol: "f(x_n,t_n)",
            name: "local slope",
            description: "현재 위치에서 한 번 평가한 vector field입니다.",
          },
          {
            symbol: "h f(x_n,t_n)",
            name: "estimated change",
            description:
              "한 step 동안 누적될 것으로 근사한 state 변화량입니다.",
          },
        ]}
        assumptions={[
          "한 step 안에서 vector field가 크게 휘지 않을 만큼 h가 작다고 봅니다.",
          "Explicit Euler이며 다음 시점의 미지수를 식 오른쪽에 쓰는 implicit Euler와 구분합니다.",
        ]}
        interpretation="x′=−x, x₀=1, h=0.25이면 x₁=0.75입니다. 정확한 e⁻⁰·²⁵≈0.779와의 한-step 차이가 local discretization error입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Local error와 global error를 구분합니다</h3>
        <p>
          Exact state에서 한 step을 시작했을 때의 local truncation error는
          smooth한 문제에서 대략 <code>O(h²)</code>이지만, <code>T/h</code>번
          반복하면 이전 오차가 다음 step으로 전달됩니다. 따라서 고정된 전체 시간
          구간에서 Euler method의 global error는 보통 <code>O(h)</code>입니다.
          Step size를 절반으로 줄이면 계산 횟수는 약 두 배가 되고 global error는
          대략 절반이 되는 1차 방법이라는 뜻입니다.
        </p>
      </div>
    </section>
  );
}
