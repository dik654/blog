import ExplainedFormula from "@/components/ui/explained-formula";

export default function HeunRungeKutta() {
  return (
    <section id="heun-runge-kutta" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Heun method는 출발점과 예상 도착점의 기울기를 함께 봅니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Euler method는 출발점의 기울기 하나만 사용합니다. Heun method는 먼저
          Euler로 도착점을 예측한 뒤, 그곳의 기울기를 한 번 더 계산해 두
          기울기의 평균으로 이동합니다. 한 step에 function evaluation을 두 번
          쓰는 대신 smooth한 문제에서 global error를 <code>O(h²)</code>로 낮추는
          2차 Runge–Kutta method입니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 step 안에서 기울기가 바뀌는 효과를 어떻게 보정할까요?"
        idea={
          <>
            현재 기울기로 provisional endpoint를 만든 뒤 그 끝의 기울기를 다시
            측정합니다. 두 slope의 trapezoid average를 사용하면 곡률의 첫 효과를
            반영할 수 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          k_1&=f(x_n,t_n) \\
          \widetilde x&=x_n+h k_1 \\
          k_2&=f(\widetilde x,t_n+h) \\
          x_{n+1}&=x_n+\frac h2(k_1+k_2)
        \end{aligned}`}
        terms={[
          {
            symbol: "k_1",
            name: "starting slope",
            description: "현재 state에서의 vector-field evaluation입니다.",
          },
          {
            symbol: String.raw`\widetilde x`,
            name: "Euler predictor",
            description: "끝점 기울기를 평가하기 위한 임시 state입니다.",
          },
          {
            symbol: "k_2",
            name: "predicted-end slope",
            description: "예상 도착점에서 다시 계산한 변화율입니다.",
          },
        ]}
        assumptions={[
          "Vector field가 필요한 차수만큼 smooth한 non-stiff problem을 기준으로 order를 설명합니다.",
          "한 solver step에 network를 두 번 부르면 step 수는 1이지만 NFE는 2입니다.",
        ]}
        interpretation="더 높은 order가 언제나 더 빠르다는 뜻은 아닙니다. 같은 오차 목표에서 허용되는 큰 step과 step당 NFE, memory, vector-field 비용을 함께 비교해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Adaptive solver는 오차를 보고 다음 step을 조절합니다</h3>
        <p>
          서로 다른 order의 근삿값을 같은 step에서 계산하면 둘의 차이를 local
          error estimate로 사용할 수 있습니다. 오차가 tolerance보다 크면 step을
          거절하고 더 작은 <code>h</code>로 다시 계산하며, 충분히 작으면 다음
          step을 키웁니다. 이때 tolerance를 낮추면 보통 NFE가 늘지만 model
          approximation error까지 사라지는 것은 아닙니다.
        </p>
      </div>
    </section>
  );
}
