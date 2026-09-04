import ExplainedFormula from "@/components/ui/explained-formula";

export default function Smoothness() {
  return (
    <section id="smoothness" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Smoothness와 curvature: local slope가 얼마나 빠르게 바뀌는가
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Learning rate를 안전하게 고르려면 gradient가 공간에서 얼마나 빠르게 변하는지 알아야 합니다. L-smooth는 두 점의 gradient 차이가 두 점 사이 거리의
          L배를 넘지 않는다는 조건을 말합니다. L이 크면 곡률이 큰 방향이 있습니다. 그만큼 step을 작게 잡아야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="L-smooth 조건은 한 step 뒤 objective를 어떻게 제한할까요?"
        idea={
          <>
            Gradient가 너무 빠르게 변하지 않는다면 1차 근사 오차를 거리 제곱
            항으로 위에서 제한할 수 있습니다. 이를 descent lemma라고 부릅니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          g_x&=\nabla f(x) \\
          g_y&=\nabla f(y),\quad d=y-x \\
          \|g_x-g_y\|&\le L\|d\| \\
          f(y)&\le f(x)+g_x^\top d+\frac L2\|d\|^2
        \end{aligned}`}
        terms={[
          { symbol: "L", name: "smoothness constant", description: "Gradient 변화 속도의 전역 상한입니다." },
          { symbol: "g_x^\\top d", name: "first-order change", description: "gₓ=∇f(x)와 d=y−x의 내적으로, 현재 gradient가 예측하는 local linear 변화입니다." },
          { symbol: "L\\|d\\|^2/2", name: "curvature allowance", description: "직선 근사에서 벗어나는 정도의 상한입니다." },
        ]}
        assumptions={[
          "관심 domain에서 gradient가 L-Lipschitz여야 합니다.",
          "Smoothness는 convexity와 다른 조건이며 nonconvex 함수도 smooth할 수 있습니다.",
        ]}
        interpretation="Quadratic f(x)=ax²/2의 gradient는 ax이므로 L=a입니다. a가 클수록 같은 이동에서 slope가 더 빠르게 변합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 1/L step이 한 번의 감소를 보장할까요?</h3>
        <p>
          Descent lemma에 <code>d=y−x=−∇f(x)/L</code>을 대입하면
          linear 항은 <code>−‖∇f(x)‖²/L</code>, curvature allowance는
          <code>‖∇f(x)‖²/(2L)</code>가 됩니다. 둘을 합치면
          <code>f(y)≤f(x)−‖∇f(x)‖²/(2L)</code>이므로 gradient가 0이 아닌
          한 objective가 줄어듭니다. 이 결론은 관심 domain의 L-smoothness가
          없거나 step을 더 크게 쓰면 그대로 적용할 수 없습니다.
        </p>
      </div>
    </section>
  );
}
