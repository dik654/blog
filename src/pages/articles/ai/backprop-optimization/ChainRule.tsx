import ExplainedFormula from "@/components/ui/explained-formula";
import ReverseModeTraceViz from "./viz/ReverseModeTraceViz";

export default function ChainRule() {
  return (
    <section id="chain-rule" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reverse mode는 local derivative를 VJP로 연결한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          합성 함수의 derivative는 각 단계의 local derivative를 연결해 구한다.
          Vector 함수에서 Jacobian 전체를 명시적으로 만들면 불필요하게 큰 matrix가
          생기므로, reverse mode는 뒤에서 전달된 cotangent와 local Jacobian의
          vector–Jacobian product(VJP)만 계산한다. 같은 value가 여러 branch에 쓰이면
          각 branch의 gradient contribution을 합한다.
        </p>
      </div>

      <ExplainedFormula
        question="scalar loss에서 한 operation의 input gradient를 local 정보만으로 어떻게 계산할까?"
        idea={<>뒤쪽 graph가 전달한 upstream cotangent ȳ에 현재 operation y=f(x)의 local Jacobian을 곱합니다. 한 x가 여러 downstream branch에 쓰였다면 branch별 contribution을 더합니다.</>}
        formula={String.raw`\begin{aligned}\bar y&=\frac{\partial L}{\partial y}\\[3pt]\bar x&=\bar y\,J_f(x)\\[3pt]\bar x_{\rm total}&=\sum_{p\in\operatorname{children}(x)}\bar x^{(p)}\end{aligned}`}
        terms={[
          { symbol: "\\bar y", name: "upstream gradient", description: "loss가 operation output y에 얼마나 민감한지 나타냅니다." },
          { symbol: "J_f(x)", name: "local Jacobian", description: "현재 primitive operation만의 derivative입니다." },
          { symbol: "\\bar yJ_f", name: "VJP", description: "Jacobian 전체를 만들지 않고 필요한 product만 계산합니다." },
          { symbol: "\\sum_p", name: "fan-out accumulation", description: "같은 value가 여러 경로로 쓰였을 때 contribution을 모두 합칩니다." },
        ]}
        assumptions={["row-vector cotangent 표기입니다. Column convention에서는 transpose 위치가 바뀝니다.", "최종 output L은 scalar입니다."]}
        interpretation="reverse mode는 output 수가 작고 input parameter가 매우 많을 때 유리합니다. Scalar loss 하나로 수많은 parameter gradient를 구하는 neural network에 맞는 이유입니다."
      />

      <ReverseModeTraceViz />

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
