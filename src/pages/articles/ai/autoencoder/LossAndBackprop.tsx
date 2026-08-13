import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BackpropViz from "./viz/BackpropViz";

export default function LossAndBackprop() {
  return (
    <section id="loss-backprop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reconstruction loss는 output distribution에 대한 가정입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          연속값에 MSE를 쓰면 decoder가 fixed-variance Gaussian의 mean을 예측한다고
          해석할 수 있고, binary value에 BCE를 쓰면 coordinate별 Bernoulli
          probability를 예측한다고 볼 수 있습니다. Loss 선택은 단순한 취향이
          아니라 관측값을 어떤 확률 model로 설명할지 정하는 일입니다. 이 연결은{" "}
          <Link to="/ai/cross-entropy">likelihood·cross-entropy 글</Link>에서
          더 자세히 다룹니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 batch의 reconstruction error를 어떤 scalar objective로 만들까?"
        idea={<>각 sample과 coordinate의 차이를 제곱한 뒤 평균합니다. 큰 오차에 더 큰 penalty가 생기며, Gaussian likelihood의 variance를 고정하면 negative log-likelihood와 상수·scale 차이만 남습니다.</>}
        formula={String.raw`\begin{aligned}
\hat{x}^{(b)}&=g_{\phi}(f_{\theta}(x^{(b)}))\\
\mathcal{L}_{\rm MSE}
&=\frac{1}{Bn}\sum_{b=1}^{B}
\left\lVert x^{(b)}-\hat{x}^{(b)}\right\rVert_2^2
\end{aligned}`}
        terms={[
          { symbol: "B", name: "batch size", description: "한 update에서 함께 계산하는 sample 수입니다." },
          { symbol: "n", name: "input dimension", description: "Sample 하나의 coordinate 수이며 reduction 방식을 명시해야 합니다." },
          { symbol: "\\lVert\\cdot\\rVert_2^2", name: "squared Euclidean error", description: "같은 위치 coordinate 차이의 제곱을 모두 더합니다." },
          { symbol: "θ,φ", name: "trainable parameters", description: "Encoder와 decoder의 parameter로 loss gradient를 받습니다." },
        ]}
        assumptions={["Coordinate별 Gaussian observation noise와 fixed variance를 가정하는 MSE 해석입니다.", "입력 scale과 coordinate importance가 비교 가능하도록 preprocessing과 reduction을 고정합니다."]}
        interpretation="MSE가 작다는 것은 선택한 coordinate scale에서 reconstruction이 가깝다는 뜻입니다. 사람이 느끼는 유사성이나 downstream usefulness까지 자동으로 보장하지는 않습니다."
      />

      <ExplainedFormula
        question="Decoder에서 측정한 오차가 encoder parameter까지 어떻게 도달할까?"
        idea={<>전체 model이 gφ∘fθ라는 합성 함수이므로 chain rule을 적용합니다. Decoder가 latent 변화에 얼마나 민감한지와 encoder가 θ 변화에 얼마나 민감한지를 경로 순서대로 곱합니다.</>}
        formula={String.raw`\frac{\partial\mathcal{L}}{\partial\theta}
=\underbrace{\frac{\partial\mathcal{L}}{\partial\hat{x}}}_{\text{복원 오차}}
\underbrace{\frac{\partial\hat{x}}{\partial z}}_{\text{decoder Jacobian}}
\underbrace{\frac{\partial z}{\partial\theta}}_{\text{encoder Jacobian}}`}
        terms={[
          { symbol: "∂L/∂x̂", name: "output sensitivity", description: "복원이 변할 때 loss가 얼마나 변하는지 나타냅니다." },
          { symbol: "∂x̂/∂z", name: "decoder Jacobian", description: "Latent coordinate 변화가 output에 전달되는 local linear map입니다." },
          { symbol: "∂z/∂θ", name: "encoder parameter Jacobian", description: "Encoder parameter 변화가 latent representation에 미치는 영향입니다." },
        ]}
        assumptions={["Forward path의 연산들이 해당 지점에서 미분 가능합니다.", "표현은 계산 경로를 강조한 것이며 실제 구현은 VJP를 사용해 전체 Jacobian을 만들지 않습니다."]}
        interpretation="Decoder가 latent 변화를 무시하거나 activation이 saturation되면 encoder로 가는 gradient가 작아질 수 있습니다. Optimizer는 이 gradient를 받아 θ와 φ를 함께 update합니다."
      />

      <BackpropViz />
    </section>
  );
}
