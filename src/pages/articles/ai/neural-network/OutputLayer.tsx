import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import PredictionContractViz from "./viz/PredictionContractViz";

export default function OutputLayer() {
  return (
    <section id="output-layer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">출력층은 target의 통계적 의미를 parameterize한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Hidden layer는 표현을 만들지만 output layer는 모델이 무엇을 예측한다고 주장하는지
          정한다. 값의 범위, class가 서로 배타적인지, label마다 독립적인 사건인지, noise를
          어떤 분포로 가정할지를 먼저 정해야 output dimension과 activation, loss가 함께
          결정된다. 모든 분류에 softmax를 붙이거나 모든 회귀에 MSE를 쓰는 규칙은 없다.
        </p>
      </div>

      <PredictionContractViz />

      <ExplainedFormula
        question="서로 배타적인 K개 class의 raw score를 하나의 확률 분포로 어떻게 바꿀까?"
        idea={<>각 logit을 exponentiate해 양수로 만든 뒤 전체 합으로 나눕니다. 학습 loss는 이 계산을 log-sum-exp와 결합해 정답 class의 negative log-likelihood로 안정적으로 계산합니다.</>}
        formula={String.raw`\begin{aligned}p_k&=p(y=k\mid x;\theta)\\&=\frac{e^{z_k}}{\sum_{j=1}^{K}e^{z_j}}\\[3pt]\mathcal L(x,y)&=-\log p_y\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}p_k&=\underbrace{p(y=k\mid x;\theta)}_{\text{categorical probability 계산}}\\&=\underbrace{\frac{e^{z_k}}{\sum_{j=1}^{K}e^{z_j}}}_{\text{기준량당 비율}}\\[3pt]\mathcal L(x,y)&=\underbrace{-\log p_y}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`p(y=k\mid x;\theta)`, annotation: ["categorical probability이(가) 식의 결과에","기여하는 방식을 계산합니다.","각 logit을 exponentiate해 양수로 만든 뒤 전체","합으로 나눕니다."] },
          { expression: String.raw`\frac{e^{z_k}}{\sum_{j=1}^{K}e^{z_j}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 logit을 exponentiate해 양수로 만든 뒤 전체","합으로 나눕니다."] },
          { expression: String.raw`-\log p_y`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","각 logit을 exponentiate해 양수로 만든 뒤 전체","합으로 나눕니다."] },
        ]}
        terms={[
          { symbol: "z_k", name: "class logit", description: "확률로 정규화하기 전의 제한 없는 relative score입니다." },
          { symbol: "K", name: "class count", description: "한 사건에서 서로 경쟁하는 class 수입니다." },
          { symbol: "p(y=k\\mid x;\\theta)", name: "categorical probability", description: "한 sample에서 합이 1인 조건부 확률입니다." },
          { symbol: "\\mathcal L", name: "negative log-likelihood", description: "정답 class에 준 확률이 작을수록 커지는 scalar objective입니다." },
        ]}
        assumptions={["한 sample의 target이 K개 중 하나인 categorical task입니다.", "Multi-label task는 class별 Bernoulli logit을 사용하므로 softmax가 아니라 BCE-with-logits 경로가 맞습니다."]}
        interpretation="Softmax 확률을 먼저 만들어 일반 log에 넣기보다 framework의 fused cross-entropy에 raw logits를 전달합니다. 그 이유와 gradient p−y의 유도는 cross-entropy 글에서 이어집니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>정확도, ranking과 calibration은 같은 평가가 아니다</h3>
        <p>
          Argmax accuracy가 같아도 confidence가 실제 정답률과 맞지 않을 수 있다. 서비스가
          threshold, rejection, expected cost를 사용한다면 calibration과 class별 error를
          별도로 측정해야 한다. Class imbalance는 sampling이나 weighted objective를 검토하되,
          evaluation distribution까지 바꾸지 않도록 split과 metric 정의를 고정한다.
        </p>
        <p>
          Likelihood에서 MSE·BCE·categorical cross-entropy가 나오는 과정과 stable
          implementation은 <Link to="/ai/cross-entropy">cross-entropy 정본 글</Link>에서
          확인할 수 있다. PyTorch의 <a href="https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html" target="_blank" rel="noreferrer">공식 CrossEntropyLoss 문서</a>도
          입력이 확률이 아니라 unnormalized logits임을 명시한다.
        </p>
      </div>
    </section>
  );
}
