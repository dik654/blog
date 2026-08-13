import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BackpropShapeViz from "./viz/BackpropShapeViz";

export default function BackpropDerivation() {
  return (
    <section id="backprop-derivation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Fused output gradient를 linear layer까지 전파한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Multi-class classification에서 softmax와 cross-entropy를 따로 미분하면
          softmax Jacobian의 diagonal과 off-diagonal 항이 보이지만, 두 operation을
          합치면 logit gradient는 prediction에서 target distribution을 뺀 값으로
          정리된다. 실제 library가 raw logits를 받는 fused cross-entropy를 제공하는
          이유는 이 경로를 수치적으로 안정되게 계산할 수 있기 때문이다.
        </p>
      </div>

      <ExplainedFormula
        question="softmax와 cross-entropy를 연달아 미분하면 logit별 gradient가 왜 prediction−label이 될까?"
        idea={<>softmax Jacobian과 negative log-likelihood derivative를 chain rule로 합치면 공통 항이 소거됩니다. Target class에는 확률을 올리는 방향, 나머지에는 내리는 방향의 gradient가 남습니다.</>}
        formula={String.raw`\begin{aligned}\hat y&=\operatorname{softmax}(z)\\L&=-\sum_c y_c\log\hat y_c\\\frac{\partial L}{\partial z}&=\hat y-y\end{aligned}`}
        terms={[
          { symbol: "z", name: "logits", description: "softmax 전의 unconstrained class score입니다." },
          { symbol: "\\hat y", name: "predicted distribution", description: "softmax로 얻은 class probability입니다." },
          { symbol: "y", name: "target distribution", description: "one-hot 또는 soft label이며 합이 1입니다." },
          { symbol: "\\hat y-y", name: "logit gradient", description: "과대 예측한 class는 양수, 과소 예측한 target은 음수 contribution을 갖습니다." },
        ]}
        assumptions={["sample loss의 sum 표기입니다. Batch mean reduction이면 gradient 전체에 1/B가 곱해집니다."]}
        interpretation="이 간결한 gradient는 softmax와 cross-entropy를 함께 미분했을 때의 결과입니다. Softmax 단독의 Jacobian이 identity라는 뜻은 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cross-entropy의 정보이론·maximum likelihood·KL 관계는 이 글에서 다시
          유도하지 않고 <Link to="/ai/cross-entropy">canonical Cross-entropy 글</Link>이
          소유한다. 여기서는 그 scalar objective가 linear classifier에 보내는
          upstream gradient만 사용한다.
        </p>
      </div>

      <ExplainedFormula
        question="logit gradient G를 weight·bias·input gradient로 어떻게 나눌까?"
        idea={<>forward Z=XW+1bᵀ의 differential dZ=dXW+XdW+1dbᵀ에서 각 variable의 coefficient를 모으면 shape가 맞는 세 gradient가 나옵니다.</>}
        formula={String.raw`\begin{aligned}G&=\frac{\partial L}{\partial Z}\\\frac{\partial L}{\partial W}&=X^\top G\\\frac{\partial L}{\partial b}&=\sum_{r=1}^{B}G_{r,:}\\\frac{\partial L}{\partial X}&=GW^\top\end{aligned}`}
        terms={[
          { symbol: "G", name: "upstream matrix", description: "각 sample·output feature에 대한 loss derivative입니다." },
          { symbol: "X^\\top G", name: "weight gradient", description: "batch sample의 input–error outer product를 합친 결과입니다." },
          { symbol: "\\sum_rG_{r,:}", name: "bias gradient", description: "broadcast된 bias가 모든 sample에서 받은 contribution을 합칩니다." },
          { symbol: "GW^\\top", name: "input gradient", description: "앞 layer로 보내기 위해 output feature 축을 input feature 축으로 되돌립니다." },
        ]}
        assumptions={["Z=XW+b인 row-batch convention입니다."]}
        interpretation="transpose 위치는 암기 항목이 아니라 결과 shape가 원래 variable shape와 같아야 한다는 조건에서 정해집니다."
      />

      <BackpropShapeViz />
    </section>
  );
}
