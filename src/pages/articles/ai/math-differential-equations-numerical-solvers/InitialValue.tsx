import ExplainedFormula from "@/components/ui/explained-formula";

export default function InitialValue() {
  return (
    <section id="initial-value" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        변화 법칙만으로는 부족하고 출발점을 함께 정해야 합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>dx/dt=f(x,t)</code>에서 <code>x</code>는 시간에 따라 달라지는
          state이고, <code>f</code>는 각 위치와 시간에서 이동 방향을 돌려주는
          vector field입니다. 같은 법칙을 따르더라도 출발점이 다르면 다른 경로를
          그리므로
          <code>x(t₀)=x₀</code>라는 initial condition을 함께 줘야 하나의 초기값
          문제(initial value problem)가 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 양에 비례해 줄어드는 시스템의 정확한 경로는 무엇일까요?"
        idea={
          <>
            매 순간 양의 일정 비율이 사라진다면 변화율은 현재 값에 음의 상수를
            곱한 값입니다. 지수함수는 미분해도 같은 모양이 남으므로 이 규칙을
            정확히 만족합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          \frac{dx}{dt}&=-\lambda x, & x(0)&=x_0 \\
          x(t)&=x_0e^{-\lambda t}
        \end{aligned}`}
        terms={[
          {
            symbol: "x(t)",
            name: "state trajectory",
            description: "시간 t에서 관측할 상태와 전체 변화 경로입니다.",
          },
          {
            symbol: String.raw`\lambda>0`,
            name: "decay rate",
            description: "시간의 역수 단위를 가지며 감소 속도를 정합니다.",
          },
          {
            symbol: "x_0",
            name: "initial condition",
            description: "t=0에서 시작할 상태로, 가능한 해 하나를 고릅니다.",
          },
        ]}
        assumptions={[
          "λ가 시간에 따라 바뀌지 않는 1차 autonomous ODE입니다.",
          "State와 vector field가 해의 존재·유일성에 필요한 regularity를 갖는다고 둡니다.",
        ]}
        interpretation="λ=2 s⁻¹, x₀=1이면 0.5초 뒤 값은 e⁻¹≈0.368입니다. λ의 단위를 빼면 지수의 입력이 무차원이어야 한다는 조건을 놓치게 됩니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Vector field와 trajectory는 서로 다릅니다</h3>
        <p>
          <code>f</code>는 모든 가능한 위치에서의 화살표를 정한 법칙이고,
          <code>x(t)</code>는 특정 출발점에서 그 화살표를 따라간 한 경로입니다.
          Neural ODE나 flow model이 학습하는 것은 보통 개별 sample 경로가 아니라
          여러 경로를 만들어 내는 parameterized vector field입니다.
        </p>
      </div>
    </section>
  );
}
