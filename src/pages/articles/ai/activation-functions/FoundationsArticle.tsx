import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationFamilyFlowViz from "./viz/ActivationFamilyFlowViz";

export default function ActivationFoundationsArticle() {
  return <article>
    <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">먼저 숫자 하나가 layer 사이를 지나는 장면부터 봅니다</p><h2 className="text-3xl font-bold tracking-tight">Activation은 forward 값과 backward 기울기를 함께 정하는 response curve다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Affine layer는 입력을 섞어 제한 없는 score <em>z</em>를 만듭니다. Activation은 이 score를 다음 layer가 읽을 값 <em>a</em>로 바꾸며, 동시에 backward 때 곱할 local slope를 정합니다. 그래서 함수 모양과 gradient 경로를 따로 외우지 않고 같은 곡선의 두 면으로 읽습니다.</p>
      <ActivationFamilyFlowViz mode="foundations" />
      <ExplainedFormula
        question="Affine layer 뒤에 activation을 둔 한 단계는 무엇을 계산하는가?"
        idea={<>먼저 입력 feature를 weight와 bias로 섞어 pre-activation을 만들고, nonlinear response curve를 적용해 다음 layer의 표현을 만듭니다.</>}
        formula={String.raw`z=xW+b,\qquad a=f(z)`}
        annotatedFormula={String.raw`\begin{aligned}z&=\underbrace{xW+b}_{\text{feature를 affine하게 섞음}}\\[4pt]a&=\underbrace{f(z)}_{\text{구간별 nonlinear response 적용}}\end{aligned}`}
        operations={[
          { expression: String.raw`xW+b`, annotation: ["입력 좌표를 weight로 섞고 bias를 더해", "activation이 읽을 pre-activation 생성"] },
          { expression: String.raw`f(z)`, annotation: ["같은 response curve를 coordinate마다 적용해", "깊은 affine chain의 단순 collapse를 차단"] },
        ]}
        terms={[
          { symbol: "x", name: "input features", description: "현재 layer가 받는 feature vector입니다." },
          { symbol: "W,b", name: "weight and bias", description: "학습되는 affine transform의 parameter입니다." },
          { symbol: "z", name: "pre-activation", description: "Activation을 적용하기 전의 제한 없는 score입니다." },
          { symbol: "f", name: "activation function", description: "Forward response와 local derivative를 함께 정하는 함수입니다." },
          { symbol: "a", name: "activation value", description: "다음 layer로 전달되는 출력 표현입니다." },
        ]}
        assumptions={["예시는 row-vector 표기이며 framework에 따라 transpose 위치가 달라질 수 있습니다.", "f는 각 coordinate에 독립적으로 적용하는 scalar activation입니다.", "Nonlinearity만으로 optimization이나 generalization이 보장되지는 않습니다."]}
        interpretation="Activation이 없으면 연속한 affine layer는 effective weight와 bias 하나로 합칠 수 있습니다. f가 입력 구간별 response를 바꾸면 다음 layer가 영역마다 다른 affine map을 만들 수 있습니다."
      />
      <ContentBoundary article="activation-functions" />
    </section>

    <section id="step-function" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · hard threshold</p><h2 className="mt-2 text-2xl font-bold">Step function은 결정을 만들지만 gradient 학습 경로는 만들지 못한다</h2></header>
      <p>Step activation은 score가 기준을 넘었는지만 보고 0 또는 1을 냅니다. 형태는 스위치처럼 명확하지만, threshold를 제외한 모든 구간에서 score를 조금 움직여도 출력이 변하지 않습니다. 따라서 forward decision과 standard backpropagation용 hidden activation을 구분해야 합니다.</p>
      <ExplainedFormula
        question="Step function이 hidden layer의 표준 gradient 학습에 맞지 않는 이유는 무엇인가?"
        idea={<>Threshold 통과 여부를 indicator로 만들면 forward 값은 분명하지만, 각 평평한 구간의 derivative가 0이라 upstream gradient가 parameter까지 이어지지 않습니다.</>}
        formula={String.raw`H(z)=\mathbf 1[z\ge0],\qquad H'(z)=0\;(z\ne0)`}
        annotatedFormula={String.raw`\begin{aligned}H(z)&=\underbrace{\mathbf 1[z\ge0]}_{\text{threshold 통과면 1}}\\[4pt]H'(z)&=\underbrace{0}_{\text{평평한 구간은 변화 없음}}\quad(z\ne0)\end{aligned}`}
        operations={[
          { expression: String.raw`\mathbf 1[z\ge0]`, annotation: ["연속 score를 threshold와 비교해", "hard class indicator로 바꿈"] },
          { expression: String.raw`H'(z)=0`, annotation: ["threshold 밖에서는 output 변화가 없으므로", "backward local slope도 0"] },
        ]}
        terms={[
          { symbol: "z", name: "score", description: "Threshold와 비교할 pre-activation입니다." },
          { symbol: "H(z)", name: "hard output", description: "기준을 통과하면 1, 아니면 0입니다." },
          { symbol: "H'(z)", name: "local derivative", description: "Output이 score 변화에 반응하는 국소 기울기입니다." },
          { symbol: "\\mathbf 1", name: "indicator", description: "괄호 안 조건이 참이면 1, 거짓이면 0을 내는 연산입니다." },
        ]}
        assumptions={["Threshold z=0에서는 불연속이라 표준 derivative가 없습니다.", "Surrogate-gradient 방식은 forward와 backward 규칙을 다르게 둔 별도 계약입니다.", "출력 후처리의 hard decision에는 여전히 사용할 수 있습니다."]}
        interpretation="z=-0.01과 z=-10은 모두 0을 냅니다. 같은 구간 안에서 weight를 조금 바꿔도 output이 그대로라 standard chain rule이 학습 방향을 전달하지 못합니다."
      />
    </section>

    <section id="sigmoid" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · probability와 saturation</p><h2 className="mt-2 text-2xl font-bold">Sigmoid는 logit을 0–1 비율로 바꾸고, 양 끝에서는 스스로 기울기를 줄인다</h2></header>
      <p>Sigmoid activation은 범위가 없는 logit을 0과 1 사이로 압축합니다. Bernoulli probability나 gate 비율처럼 0–1 의미가 필요한 곳에 맞지만, 큰 양수·음수에서는 출력이 상한·하한에 붙습니다. 이 평평한 구간을 activation saturation이라 부릅니다.</p>
      <ExplainedFormula
        question="Sigmoid의 출력과 local slope를 한 번에 어떻게 읽는가?"
        idea={<>지수로 logit의 부호와 크기를 양수 비율로 바꾼 뒤 1을 포함한 합으로 정규화합니다. Derivative는 출력 p와 남은 여유 1-p를 곱해 구합니다.</>}
        formula={String.raw`p=\sigma(z)=\frac1{1+e^{-z}},\qquad \sigma'(z)=p(1-p)`}
        annotatedFormula={String.raw`\begin{aligned}p&=\underbrace{\frac1{1+e^{-z}}}_{\text{logit을 0--1로 압축}}\\[4pt]s&=\underbrace{p(1-p)}_{\text{현재 출력의 local slope}}\end{aligned}`}
        operations={[
          { expression: String.raw`e^{-z}`, annotation: ["logit의 방향과 크기를 양수 scale로 바꿔", "0과 1 사이 비율의 분모를 구성"] },
          { expression: String.raw`1/(1+e^{-z})`, annotation: ["positive scale을 1과 함께 정규화해", "Bernoulli probability 또는 gate 비율 생성"] },
          { expression: String.raw`p(1-p)`, annotation: ["현재 출력과 상한까지 남은 여유를 곱해", "backward에서 사용할 local slope 계산"] },
        ]}
        terms={[
          { symbol: "z", name: "logit", description: "확률로 바꾸기 전의 제한 없는 score입니다." },
          { symbol: "p", name: "sigmoid output", description: "0과 1 사이의 probability 또는 gate 비율입니다." },
          { symbol: "s", name: "local slope", description: "Backward signal에 곱하는 sigmoid derivative입니다." },
          { symbol: "e", name: "exponential base", description: "Logit 차이를 multiplicative scale로 바꾸는 자연상수입니다." },
        ]}
        assumptions={["Probability로 해석할 때 target과 loss는 Bernoulli 계약을 사용합니다.", "Hidden layer의 여러 Jacobian과 residual path는 이 local slope 밖의 별도 요인입니다.", "FP dtype과 fused loss 구현에 따라 수치 안정화 방식이 달라집니다."]}
        interpretation="z=0이면 p=0.5, slope=0.25입니다. z=10이면 p가 거의 1이라 p(1-p)가 거의 0이 되고, 이 지점에서 sigmoid는 입력 변화를 거의 전달하지 않습니다."
      />
    </section>

    <section id="tanh" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · signed bounded state</p><h2 className="mt-2 text-2xl font-bold">Tanh는 0을 중심으로 음수·양수 방향을 보존하지만 saturation은 남는다</h2></header>
      <p>Tanh activation은 실수 입력을 -1과 1 사이로 압축합니다. 0 근처에서는 기울기가 1이라 signed candidate state를 비교적 그대로 전달하고, recurrent cell의 candidate처럼 방향을 보존해야 하는 곳에 쓰입니다. 하지만 큰 절댓값에서는 sigmoid와 마찬가지로 평평해집니다.</p>
      <ExplainedFormula
        question="Tanh가 0 근처에서는 신호를 살리고 큰 입력에서는 포화하는 이유는 무엇인가?"
        idea={<>Forward output h를 -1과 1 사이에 둔 뒤 derivative를 1-h²로 계산합니다. h가 0이면 기울기 1, ±1에 가까우면 기울기 0입니다.</>}
        formula={String.raw`h=\tanh(z),\qquad \frac{dh}{dz}=1-h^2`}
        annotatedFormula={String.raw`\begin{aligned}h&=\underbrace{\tanh(z)}_{\text{signed 값을 -1에서 1로 압축}}\\[4pt]s&=\underbrace{1-h^2}_{\text{경계에 가까울수록 slope 감소}}\end{aligned}`}
        operations={[
          { expression: String.raw`\tanh(z)`, annotation: ["입력의 음수·양수 방향을 보존하면서", "bounded signed state로 변환"] },
          { expression: String.raw`1-h^2`, annotation: ["현재 output 크기의 제곱을 1에서 빼", "0 중심에서 크고 경계에서 작은 slope 생성"] },
        ]}
        terms={[
          { symbol: "z", name: "pre-activation", description: "Tanh가 읽는 제한 없는 input입니다." },
          { symbol: "h", name: "signed activation", description: "-1과 1 사이의 output state입니다." },
          { symbol: "s", name: "local slope", description: "Backward signal에 곱할 tanh derivative입니다." },
        ]}
        assumptions={["Scalar coordinate 하나의 식이며 vector에는 element-wise 적용합니다.", "0-centered output이 saturation이나 전체-network gradient 문제를 없애지는 않습니다.", "Recurrent gate의 sigmoid와 candidate의 tanh는 서로 다른 의미를 가집니다."]}
        interpretation="z=0이면 h=0, slope=1입니다. |z|가 커져 h≈±1이 되면 1-h²≈0이므로 signed output은 유지해도 작은 입력 차이는 거의 사라집니다."
      />
    </section>

    <section id="comparison" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · 선택 경계</p><h2 className="mt-2 text-2xl font-bold">먼저 output 의미와 실패 구간을 고르고, architecture 안에서 검증한다</h2></header>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Step", "Hard decision", "Hidden backprop의 slope가 0"],
          ["Sigmoid", "0–1 probability·gate", "양 끝 saturation·비영중심"],
          ["Tanh", "-1–1 signed state", "큰 |z|의 saturation"],
        ].map(([name, meaning, boundary]) => <div key={name} className="rounded-xl border border-border p-4"><p className="font-bold">{name}</p><p className="mt-2 text-sm leading-6">{meaning}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">경계 — {boundary}</p></div>)}
      </div>
      <p>Hidden feed-forward layer의 rectifier 계열은 <a href="/ai/rectifier-activations" className="text-primary hover:underline">ReLU·rectifier 글</a>에서, Transformer의 GELU·SiLU·SwiGLU는 <a href="/ai/gated-activations" className="text-primary hover:underline">smooth·gated activation 글</a>에서 이어집니다.</p>
      <div id="paper-efficient-backprop"><CitationBlock source="LeCun et al. — Efficient BackProp" citeKey={1} type="paper" href="http://yann.lecun.com/exdb/publis/pdf/lecun-98b.pdf"><p><strong>문제:</strong> Gradient 기반 network의 학습을 input·target scaling과 activation 선택까지 포함해 안정화합니다.</p><p><strong>기여:</strong> Centering·normalization·sigmoid family와 curvature 관점의 실용적 학습 원칙을 정리합니다.</p><p><strong>전제:</strong> 당시 feed-forward architecture와 gradient optimization 분석 범위입니다.</p><p><strong>근거 범위:</strong> Sigmoid·tanh의 scale과 saturation을 읽는 기반입니다.</p><p><strong>말하지 않는 것:</strong> 특정 activation이 현대 모든 architecture에서 최적이라는 결과가 아닙니다.</p></CitationBlock></div>
      <div id="paper-glorot-saturation"><CitationBlock source="Glorot & Bengio — Understanding the Difficulty of Training Deep Feedforward Neural Networks" citeKey={2} type="paper" href="https://proceedings.mlr.press/v9/glorot10a.html"><p><strong>문제:</strong> 깊은 network에서 activation과 gradient가 layer를 지날 때 saturation·scale이 무너지는 원인을 분석합니다.</p><p><strong>기여:</strong> Activation statistics와 Jacobian singular value, fan-in·fan-out initialization을 연결합니다.</p><p><strong>전제:</strong> 논문의 sigmoid·tanh network와 dataset·optimizer 조건입니다.</p><p><strong>근거 범위:</strong> Saturation과 initialization scale의 상호작용입니다.</p><p><strong>말하지 않는 것:</strong> Xavier initialization 하나가 모든 activation·normalization 조합에 최적이라는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>
  </article>;
}
