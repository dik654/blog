import M from "@/components/ui/math";
import ExplainedFormula from "@/components/ui/explained-formula";
import LSTMGateViz from "./viz/LSTMGateViz";
import TanhViz from "./viz/TanhViz";

export default function Tanh() {
  return (
    <section id="tanh" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Tanh: 부호를 보존하는 포화 함수</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          tanh는 입력을 <M>{"(-1,1)"}</M>로 압축하고 0을 중심으로 대칭인 출력을
          만든다. sigmoid보다 hidden state의 양수·음수 방향을 표현하기 쉽지만,
          절댓값이 큰 영역에서 derivative가 0에 가까워지는 saturation 문제는 남는다.
        </p>
      </div>
      <ExplainedFormula
        question="0을 중심으로 양수와 음수 신호를 모두 표현하면서 출력 범위를 제한하려면?"
        idea={<>Sigmoid를 이동하고 scale해 −1과 1 사이의 signed output을 만듭니다. 0 근처에서는 기울기 1을 갖지만 양 끝에서는 sigmoid처럼 포화합니다.</>}
        formula={String.raw`\tanh(x)=2\sigma(2x)-1,\qquad \frac{d}{dx}\tanh(x)=1-\tanh^2(x)`}
        terms={[
          { symbol: String.raw`\tanh(x)`, name: "signed bounded output", description: "음수와 양수 방향을 유지하면서 범위를 −1과 1 사이로 제한합니다." },
          { symbol: String.raw`1-\tanh^2(x)`, name: "local derivative", description: "x=0에서 1이고 출력 절댓값이 1에 가까울수록 0에 접근합니다." },
          { symbol: String.raw`2\sigma(2x)-1`, name: "sigmoid relation", description: "Sigmoid와 범위·중심은 다르지만 같은 포화 구조를 가짐을 보여 줍니다." },
        ]}
        assumptions={["Derivative의 최댓값 하나만으로 전체 network의 gradient 크기를 정할 수 없습니다.", "Recurrent state에서의 효과는 gate·weight Jacobian과 함께 봐야 합니다."]}
        interpretation="x=0에서는 output 0과 derivative 1이라 작은 signed signal을 잘 전달하지만, |x|가 커지면 output이 ±1에 붙고 derivative가 작아집니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          tanh의 derivative는 0에서 1이고 sigmoid는 0에서 0.25지만 이것만으로 tanh가 모든 네트워크에서 네 배 더 잘 학습된다고 말할 수는 없다. 입력 분포와
          초기화, normalization, 전체 Jacobian이 함께 gradient 크기를 결정한다.
        </p>
        <h3>recurrent gate 안에서의 역할</h3>
        <p>
          LSTM과 GRU에서는 sigmoid가 정보를 얼마나 통과시킬지 0~1의 gate를 만들고 tanh가 cell에 더할 signed candidate를 만든다. 두 함수는 경쟁
          관계라기보다 서로 다른 범위와 의미를 이용해 역할을 나눈다.
        </p>
      </div>
      <div className="not-prose my-8"><TanhViz /></div>
      <LSTMGateViz />
    </section>
  );
}
