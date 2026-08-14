import ExplainedFormula from "@/components/ui/explained-formula";

export default function ChainRule() {
  return (
    <section id="reverse-mode" className="mb-16 scroll-mt-20">
      <p className="mb-3 text-sm font-bold text-primary">용어 3 · reverse-mode autodiff</p>
      <h2 className="mb-6 text-3xl font-bold">loss의 책임을 graph 반대 방향으로 보낸다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Reverse mode</strong>는 scalar loss의 derivative를 1로 놓고
          forward graph를 반대로 순회하는 자동미분 방식입니다. 각 operation은 자기
          주변의 local derivative만 알고, 뒤에서 받은 책임을 입력 쪽으로 보냅니다.
          이 정의를 이해한 다음에야 VJP와 fan-out을 붙입니다.
        </p>
      </div>

      <ExplainedFormula
        question="scalar loss에서 한 operation의 input gradient를 local 정보만으로 어떻게 계산할까?"
        idea={<>뒤쪽 graph가 전달한 upstream cotangent ȳ에 현재 operation y=f(x)의 local Jacobian을 곱합니다. 한 x가 여러 downstream branch에 쓰였다면 branch별 contribution을 더합니다.</>}
        formula={String.raw`\begin{aligned}\bar y&=\frac{\partial L}{\partial y}\\[3pt]\bar x&=\bar y\,J_f(x)\\[3pt]\bar x_{\rm total}&=\sum_{p\in\operatorname{children}(x)}\bar x^{(p)}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\bar y&=\underbrace{\frac{\partial L}{\partial y}}_{\substack{\text{뒤에서 온}\text{loss 책임}}}\\[7pt]\bar x&=\underbrace{\bar y\,J_f(x)}_{\substack{\text{local rule로}\text{입력 책임 생성}}}\\[7pt]\bar x_{\rm total}&=\underbrace{\sum_{p\in\operatorname{children}(x)}\bar x^{(p)}}_{\substack{\text{모든 branch}\text{책임을 합침}}}\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{\partial L}{\partial y}`, annotation: ["현재 output y가", "최종 loss에 미친 책임을 받음"] },
          { expression: String.raw`\bar yJ_f(x)`, annotation: ["upstream 책임을 local Jacobian에 곱해", "input x의 책임으로 변환"] },
          { expression: String.raw`\sum_p\bar x^{(p)}`, annotation: ["여러 사용처에서 돌아온 기여를", "같은 x의 gradient에 누적"] },
        ]}
        terms={[
          { symbol: "\\bar y", name: "upstream gradient", description: "loss가 operation output y에 얼마나 민감한지 나타냅니다." },
          { symbol: "J_f(x)", name: "local Jacobian", description: "현재 primitive operation만의 derivative입니다." },
          { symbol: "\\bar yJ_f", name: "VJP", description: "Jacobian 전체를 만들지 않고 필요한 product만 계산합니다." },
          { symbol: "\\sum_p", name: "fan-out accumulation", description: "같은 value가 여러 경로로 쓰였을 때 contribution을 모두 합칩니다." },
        ]}
        assumptions={["row-vector cotangent 표기입니다. Column convention에서는 transpose 위치가 바뀝니다.", "최종 output L은 scalar입니다."]}
        interpretation="reverse mode는 output 수가 작고 input parameter가 매우 많을 때 유리합니다. Scalar loss 하나로 수많은 parameter gradient를 구하는 neural network에 맞는 이유입니다."
      />

      <div id="save-recompute" className="prose prose-neutral dark:prose-invert max-w-none scroll-mt-20">
        <h3>Save·recompute 경계</h3>
        <p>
          앞의 graph Viz에서 본 것처럼 tape는 backward에 필요한 값을 저장합니다.
          Checkpointing은 그중 일부를 버리고 다시 계산합니다. 같은 derivative를
          유지하면서 memory를 줄이지만 compute와 random-state 재현 비용은 늘어납니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Gradient가 누적되는 이유도 graph에서 나온다</h3>
        <p>
          Parameter 하나가 여러 sample과 여러 operation에서 재사용되면 모든 경로의
          partial derivative를 더해야 전체 derivative가 된다. Framework가
          <code>.grad</code>에 값을 누적하는 동작은 편의상의 우연이 아니라 이
          sum-of-paths 규칙을 구현한 것이다. 여러 micro-batch를 의도적으로 누적할
          수도 있지만, 그렇지 않다면 step 사이에 gradient buffer를 초기화한다.
        </p>
      </div>
    </section>
  );
}
