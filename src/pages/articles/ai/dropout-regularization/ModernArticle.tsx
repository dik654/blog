import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DropoutMechanismViz } from "../regularization-practice/viz/ModernRegularizationViz";

export default function DropoutRegularizationArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dropout은 activation을 지우는 학습 시점의 확률 연산입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">
            activation 하나, 0/1 mask, 살아남은 값을 보정하는 scaling을 차례로 봅니다. 이 세 물체를 이해한 뒤에야 여러 stochastic subnetwork라는
            조합 해석으로 넘어갑니다.
          </p></div>
      <TermBreakdown title="Dropout을 이루는 세 물체" items={[
        { term: "Activation h", description: "Dropout 직전 layer가 만든 feature 값입니다.", example: "한 coordinate h=2를 추적합니다." },
        { term: "Keep mask m", description: "통로를 남기면 1, 끄면 0인 Bernoulli random variable입니다.", example: "p=.25이면 keep probability q=.75입니다.", boundary: "Channel dropout은 여러 좌표가 같은 mask를 공유합니다." },
        { term: "Inverted scale 1/q", description: "남은 값의 평균 크기를 train과 eval 사이에서 맞추는 배율입니다.", example: "남으면 2/.75=8/3, 꺼지면 0입니다.", boundary: "한 번의 output을 원본과 같게 만드는 배율이 아닙니다." },
      ]} />
      <DropoutMechanismViz />
      <ContentBoundary article="dropout-regularization" />
    </section>
    <section id="mask" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Inverted scaling은 평균을 보존하고 분산을 추가합니다</h2>
      <ExplainedFormula question="왜 mask를 곱하고 다시 q로 나눌까요?" idea={<p>
            mask를 곱하면 일부 경로가 사라집니다. 평균이 q배 작아지므로 q로 나눠 평균만 원래 h로 되돌립니다. 대신 어떤 forward는 0이 되고 어떤 forward는 큰 값이
            되어 noise가 생깁니다.
          </p>} formula={String.raw`\widetilde h=(m/q)h`} annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{1-p}_{\text{keep 확률}}\\m&\sim\underbrace{\operatorname{Bernoulli}(q)}_{\text{통로 선택}}\\\widetilde h&=\underbrace{m h}_{\text{꺼진 값은 0}}\;\underbrace{q^{-1}}_{\text{평균 보정}}\\\mathbb E[\widetilde h]&=\underbrace{h}_{\text{원래 평균}}\\\operatorname{Var}(\widetilde h)&=\underbrace{\frac{p}{q}h^2}_{\text{추가 noise}}\end{aligned}`} operations={[
        { expression: String.raw`m h`, annotation: ["Bernoulli 선택을 activation에 적용해", "이번 forward의 경로를 켜거나 끔"] },
        { expression: String.raw`\frac{m h}{q}`, annotation: ["keep 확률만큼 줄어든 평균을", "q로 나누어 복원"] },
        { expression: String.raw`\frac pq h^2`, annotation: ["drop 강도와 activation 크기로", "추가 noise variance를 계산"] },
      ]} terms={[
        { symbol: "p,q", name: "Drop·keep probability", description: "p는 끌 확률, q=1−p는 남길 확률입니다." },
        { symbol: "m", name: "Keep mask", description: "매 train forward에서 sampling하는 0/1 변수입니다." },
        { symbol: "h̃", name: "Dropped activation", description: "Mask와 inverted scaling 뒤 다음 layer로 보내는 값입니다." },
      ]} assumptions={["Mask와 h를 조건부로 분리해 expectation을 계산합니다.", "Element dropout 식이며 shared mask에서는 covariance가 달라집니다."]} interpretation="h=2,p=.25이면 h̃는 확률 .75로 8/3, 확률 .25로 0입니다. 평균은 2지만 분산은 4/3입니다." />
    </section>
    <section id="mode" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Train과 eval은 서로 다른 module state 계약입니다</h2>
      <TermBreakdown title="Mode별 동작" items={[
        { term: "train()", description: "매 forward에서 새 mask를 sampling하고 1/q scaling을 적용합니다.", example: "같은 input을 두 번 넣어도 output이 다를 수 있습니다." },
        { term: "eval()", description: "Mask를 sampling하지 않고 모든 activation을 그대로 사용합니다.", example: "같은 input·state면 deterministic output을 기대합니다." },
        { term: "MC dropout", description: "추론에서도 일부러 dropout을 켜 여러 prediction을 모읍니다.", boundary: "일반 eval 실수와 구분해 sample count·aggregation·calibration을 명시합니다." },
      ]} />
    </section>
    <section id="boundary" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">평균 보존이 nonlinear network의 출력 보존을 뜻하지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Dropout 뒤 ReLU·normalization·attention이 있으면 <code>E[f(h̃)]</code>와 <code>f(E[h̃])</code>는 일반적으로 다릅니다. 이미 underfit인 모델, normalization과 강하게 결합된 위치, pretrained fine-tuning에서는 p를 낮추거나 쓰지 않는 후보도 같은 budget으로 비교합니다.</p></div>
      <div id="paper-dropout" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Srivastava et al. — Dropout" citeKey={1} type="paper" href="https://www.jmlr.org/papers/v15/srivastava14a.html">Training-time random unit removal과 test-time scaled-network 근사를 제안합니다. 논문의 supervised benchmark가 모든 modern architecture와 training recipe의 개선을 보장하지는 않습니다.</CitationBlock></div>
    </section>
  </div>;
}
