import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationFamilyFlowViz from "./viz/ActivationFamilyFlowViz";


import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ActivationCurve from "./viz/ActivationCurve";

export default function ActivationFoundationsArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 앞으로 보낼 값과 뒤로 보낼 변화율을 함께 고릅니다</h2>
<p className="leading-8">한 계산이 2라는 값을 만들었습니다. 다음 계산에는 0과 1 사이의 비율이 필요해서 이 값을 약 0.880797로 바꾸기로 했다고 합시다 (가정). 값을 바꾸는 것은 여기서 끝나지 않습니다. 나중에 답이 틀렸을 때 앞의 2를 조금 움직이면 최종 오차가 얼마나 달라질지도 알아야 합니다.</p><p className="leading-8">같은 2를 1로 잘라 보내는 규칙과 0.880797로 부드럽게 바꾸는 규칙은 결과의 범위가 비슷해 보여도, 앞 계산을 고치는 과정에는 다른 정보를 줍니다. 이 글에서는 하나의 숫자를 앞으로 보내고, 그 숫자에 대한 변화율을 뒤로 돌려보내는 두 방향을 같은 곡선으로 읽습니다.</p><p className="leading-8">계속 쓸 입력은 2이고, 뒤 계산에서 전달된 오차의 변화율은 3으로 두겠습니다 (가정). 함수의 이름보다 먼저, 왜 값과 기울기가 한 쌍이어야 하는지 확인합니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 숫자를 바꾸는 상자를 양쪽 방향으로 읽습니다</h2>
<p className="leading-8">앞 방향에서는 2를 받아 정해진 곡선의 높이를 다음 계산에 전달합니다. 뒤 방향에서는 다음 계산이 보낸 변화율 3을 받아, 지금 곡선의 기울기를 곱해 앞 계산에 돌려보냅니다. 같은 곡선의 높이와 기울기가 서로 다른 일을 합니다.</p><NumericPath title="같은 위치에서 앞 출력과 뒤 변화율을 계산합니다" steps={[{label:"현재 입력",value:"2"},{label:"곡선의 높이",value:"0.880797"},{label:"곡선의 기울기",value:"0.104994"},{label:"뒤의 3을 곱하기",value:"0.314981"}]} /><p className="leading-8">이 수치는 뒤에서 정의할 부드러운 0–1 곡선의 계산값입니다. 입력 2가 어느 지점에서 어떤 비율로 바뀌는지 한 단계씩 열어 보겠습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 입력을 조금 움직였을 때 출력이 얼마나 움직이는지 봅니다</h2>
<p className="leading-8">선택한 변환은 입력의 부호를 반대로 한 값에 지수를 취한 뒤, 그 결과에 1을 더하고 역수를 구합니다. 입력 2에서는 e^(−2)≈0.135335, 1을 더하면 1.135335, 역수는 약 0.880797입니다. 이 변환은 입력이 커질수록 출력이 1에 가까워지지만 1을 넘지 않습니다.</p><p className="leading-8">입력을 2에서 아주 조금 움직일 때 출력이 변하는 비율은 약 0.104994입니다. 뒤 계산의 오차가 출력 한 단위에 3만큼 반응한다면 입력 쪽 반응은 3×0.104994≈0.314981입니다. 이 곱셈은 두 연속 변화의 비율을 연결하는 계산입니다.</p><p className="leading-8">앞 방향의 값 0.880797과 뒤 방향에 곱할 0.104994를 혼동하지 않는 것이 첫 계산 목표입니다. 상자 안에는 무엇을 저장하거나 다시 계산할지가 남아 있습니다.</p>
<p className="leading-8">입력 2의 출력 0.880797은 다음 계산에 전달할 값입니다. 반면 기울기 0.104994는 입력을 아주 조금 바꿨을 때 출력이 얼마나 바뀌는지 나타냅니다. 출력이 크다고 변화도 반드시 큰 것은 아닙니다. 이 두 숫자를 뒤바꾸면 앞쪽으로 전달할 변화율도 달라집니다.</p><p className="leading-8">같은 곡선의 입력을 0으로 옮기면 출력은 0.5, 기울기는 0.25입니다. 입력 10에서는 출력이 약 0.999955까지 커지지만 기울기는 약 0.000045로 작아집니다 (가정). 곡선의 높이와 그 자리의 기울기를 따로 보는 이유입니다.</p></section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 출력을 만드는 규칙과 기울기를 읽는 규칙을 구분합니다</h2>
<p className="leading-8">상자를 열면 입력을 받는 곳, 곡선을 적용해 출력을 만드는 곳, 그 위치의 기울기를 읽는 곳이 있습니다. 입력 2를 앞으로 보낼 때 얻은 0.880797을 보관하면 뒤 계산에서는 이 값과 1에서 뺀 값을 곱해 기울기를 구할 수 있습니다.</p><p className="leading-8">같은 변환을 여러 숫자에 각각 적용한다면 위치마다 이 정보가 필요합니다. 어떤 칸은 2처럼 1에 가깝고, 다른 칸은 0처럼 가운데에 있을 수 있기 때문입니다. 배열 전체에 한 기울기를 곱하면 각 위치의 반응을 구분하지 못합니다.</p><p className="leading-8">무엇을 계산하고 무엇을 다시 쓰는지가 보였습니다. 곡선 없이 곱셈과 덧셈만 쌓거나, 곡선을 계단으로 만들었을 때 생기는 한계를 보겠습니다.</p>
</section>
<section id="why-curve" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 단순한 합성과 딱 잘라 내는 규칙은 다른 한계를 가집니다</h2>
<p className="leading-8">곱하고 더하는 계산을 여러 번 이어도 결국 한 번 곱하고 더하는 계산으로 합칠 수 있습니다. 입력 구간에 따라 다른 규칙을 만들려면 이 관계를 꺾거나 구부리는 변화가 필요합니다. 두 스위치의 예는 <a href="/cs/ai/deep-learning-overview#why-parts" className="text-primary underline">딥러닝의 출발점</a>에서 직접 확인할 수 있습니다.</p><p className="leading-8">그렇다고 0보다 크면 무조건 1을 내도록 만들면 입력 2와 2.001에서 출력이 모두 1입니다. 이 구간의 기울기는 0이어서 뒤 변화율 3에 곱해도 앞에는 0만 전달됩니다. 최종 판정을 내리는 용도와, 중간 계산을 미분으로 학습하는 용도는 이 지점에서 요구가 달라집니다.</p><p className="leading-8">부드러운 곡선은 중간 기울기를 남기지만 양 끝에서 너무 평평해질 수 있습니다. 이 역할과 경계에 이름을 붙여 세 규칙을 같은 입력으로 비교합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 활성함수의 이름은 출력의 의미와 연결해 읽습니다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>먼저 본 역할</th><th>이름</th><th>이번 사례</th></tr></thead><tbody><tr><td>층 사이에서 값을 비선형으로 바꾸는 함수</td><td>Activation function · 활성함수</td><td>2를 다른 값으로 바꿈</td></tr><tr><td>활성함수에 넣기 전 입력</td><td>Pre-activation z</td><td>2</td></tr><tr><td>뒤 변화율에 곱할 현재 기울기</td><td>Local derivative</td><td>0.104994</td></tr><tr><td>부호를 보고 0 또는 1을 고름</td><td>Step function · 계단 함수</td><td>2→1</td></tr><tr><td>0–1 사이의 비율로 부드럽게 바꿈</td><td>Sigmoid</td><td>2→0.880797</td></tr><tr><td>−1–1 범위에서 부호를 남김</td><td>Tanh</td><td>2→0.964028</td></tr></tbody></table></div><ActivationFamilyFlowViz mode="foundations" /><p className="leading-8">이 이름을 붙인 뒤에도 높이와 기울기를 같은 입력 위치에서 읽는 원칙은 같습니다. 다음 절은 입력 2가 만들어지는 곳부터 뒤 변화율까지 한 번에 연결합니다.</p>
</section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7. 입력 2의 앞 계산과 뒤 계산을 이어 봅니다</h2>
<p className="leading-8">입력 x=2에 가중치 W=1과 이동량 b=0을 적용하면 z=2가 됩니다 (가정). Sigmoid로 a≈0.880797을 다음 계산에 전달합니다. 뒤에서 dL/da=3을 받으면 da/dz≈0.104994를 곱해 dL/dz≈0.314981을 얻습니다.</p><ExplainedFormula
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
      /><p className="leading-8">이 예에서는 z=xW+b이므로 W에 대한 변화율에는 입력 x=2를 한 번 더 곱합니다. dL/dW≈0.629962이며 b의 변화율은 약 0.314981입니다. 아직 W나 b를 갱신하지 않았습니다. 이 값으로 실제 숫자를 바꾸는 규칙은 <a href="/cs/ai/optimizers" className="text-primary underline">optimizer</a>가 맡습니다.</p><AlgorithmBlock title="Sigmoid 한 칸의 앞·뒤 계산 (의사코드)" input={["x=2, W=1, b=0, 뒤 변화율 u=3 (가정)"]} steps={[{code:"z ← xW + b; a ← 1 / (1 + exp(−z))"},{code:"기울기 s ← a × (1 − a)"},{code:"dz ← u × s; dW ← dz × x; db ← dz"}]} output="a≈.880797, dz≈.314981, dW≈.629962, db≈.314981" /><p className="leading-8">한 위치의 계산을 끝까지 따라갔습니다. 이제 실제 정의를 확인하며 곡선을 바꿀 때 같은 입력의 값과 변화율이 어떻게 달라지는지 봅니다.</p>
</section>
<section id="step-function" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">8. 계단 함수에서는 작은 입력 변화가 앞쪽 학습으로 이어지지 않습니다</h2>
<p>
            Step activation은 score가 기준을 넘었는지만 보고 0 또는 1을 냅니다. 형태는 스위치처럼 명확하지만 threshold를 제외한 모든 구간에서 score를 조금
            움직여도 출력이 변하지 않습니다. 따라서 forward decision과 standard backpropagation용 hidden activation을 구분해야 합니다.
          </p>
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
      /><p className="leading-8">NumPy의 heaviside 공식 정의는 x₁이 음수면 0, 양수면 1, 정확히 0이면 두 번째 인수 x₂입니다. 이 글의 H(z)=1[z≥0]는 x₂=1을 고른 경우입니다. 입력 2에서는 1, 입력 −2에서는 0이고 두 위치의 국소 기울기는 0입니다. 뒤 변화율 3은 모두 0으로 돌아갑니다.</p><p><a href="https://numpy.org/doc/stable/reference/generated/numpy.heaviside.html" className="text-primary underline">원문: NumPy heaviside의 piecewise 정의, 2026-10-04 확인</a></p><p className="leading-8">정확히 0에서 값을 1로 정했다고 미분이 생기지는 않습니다. 불연속점의 함수값과 미분 존재 여부는 서로 다른 질문입니다. 다음에는 같은 2에서 기울기가 남는 곡선을 봅니다.</p>
</section>
<section id="sigmoid" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9. 공식 정의에 입력 2를 넣으면 값과 기울기를 다시 얻습니다</h2>
<p>
            Sigmoid activation은 범위가 없는 logit을 0과 1 사이로 압축합니다. Bernoulli probability나 gate 비율처럼 0–1 의미가 필요한 곳에
            맞지만 큰 양수·음수에서는 출력이 상한·하한에 붙습니다. 이 평평한 구간을 activation saturation이라 부릅니다.
          </p>
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
      /><p className="leading-8">PyTorch Sigmoid 공식 문서의 정의는 σ(x)=1/(1+exp(−x))입니다. 같은 입력 2를 넣으면 약 0.880797입니다. 이를 미분하면 exp(−x)/(1+exp(−x))²이고, 앞 결과 p를 재사용하면 p(1−p)가 됩니다. 따라서 기울기는 약 0.104994, 뒤 변화율은 3배인 약 0.314981입니다.</p><p><a href="https://docs.pytorch.org/docs/2.14/generated/torch.nn.Sigmoid.html" className="text-primary underline">원문: PyTorch 2.14 Sigmoid의 정의</a></p><p className="leading-8">입력 0에서는 기울기 0.25, 입력 10에서는 약 0.0000454입니다. 출력이 상한에 붙을수록 입력을 조금 바꾸어도 결과가 거의 움직이지 않는 상태를 saturation, 포화라고 부릅니다. 부호를 보존하는 곡선에서도 이 문제가 남는지 비교하겠습니다.</p>
</section>
<section id="tanh" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">10. 부호를 남기는 곡선에서도 양 끝의 기울기는 작아집니다</h2>
<p>
            Tanh activation은 실수 입력을 -1과 1 사이로 압축합니다. 0 근처에서는 기울기가 1이라 signed candidate state를 비교적 그대로 전달하고
            recurrent cell의 candidate처럼 방향을 보존해야 하는 곳에 쓰입니다. 하지만 큰 절댓값에서는 sigmoid와 마찬가지로 평평해집니다.
          </p>
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
      /><p className="leading-8">PyTorch Tanh 공식 정의는 tanh(x)=(exp(x)−exp(−x))/(exp(x)+exp(−x))입니다. 같은 입력 2를 넣으면 약 0.964028이고, 몫을 미분해 정리하면 기울기 1−tanh²(x)≈0.070651입니다. 뒤 변화율 3을 곱하면 약 0.211952입니다.</p><p><a href="https://docs.pytorch.org/docs/2.14/generated/torch.nn.Tanh.html" className="text-primary underline">원문: PyTorch 2.14 Tanh의 정의</a></p><p className="leading-8">입력 0에서는 값 0과 기울기 1이 나오지만 큰 입력에서는 기울기가 작아집니다. 0을 중심으로 양쪽 부호를 갖는다는 성질이 모든 위치에서 큰 변화율을 보장하지는 않습니다. 아래 곡선에서 입력 위치를 움직여 두 양을 함께 확인해 보세요.</p><ActivationCurve mode="foundations" />
</section>
<section id="comparison" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">11. 출력의 의미와 학습 경로를 함께 고릅니다</h2>
<div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Step", "Hard decision", "Hidden backprop의 slope가 0"],
          ["Sigmoid", "0–1 probability·gate", "양 끝 saturation·비영중심"],
          ["Tanh", "-1–1 signed state", "큰 |z|의 saturation"],
        ].map(([name, meaning, boundary]) => <div key={name} className="rounded-xl border border-border p-4"><p className="font-bold">{name}</p><p className="mt-2 text-sm leading-6">{meaning}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">경계 — {boundary}</p></div>)}
      </div>
      <p>Hidden feed-forward layer의 rectifier 계열은 <a href="/cs/ai/rectifier-activations" className="text-primary hover:underline">ReLU·rectifier 글</a>에서, Transformer의 GELU·SiLU·SwiGLU는 <a href="/cs/ai/gated-activations" className="text-primary hover:underline">smooth·gated activation 글</a>에서 이어집니다.</p>
      <div id="paper-efficient-backprop"><CitationBlock source="LeCun et al. — Efficient BackProp" citeKey={1} type="paper" href="http://yann.lecun.com/exdb/publis/pdf/lecun-98b.pdf"><p><strong>문제:</strong> Gradient 기반 network의 학습을 input·target scaling과 activation 선택까지 포함해 안정화합니다.</p><p><strong>기여:</strong> Centering·normalization·sigmoid family와 curvature 관점의 실용적 학습 원칙을 정리합니다.</p><p><strong>전제:</strong> 당시 feed-forward architecture와 gradient optimization 분석 범위입니다.</p><p><strong>근거 범위:</strong> Sigmoid·tanh의 scale과 saturation을 읽는 기반입니다.</p><p><strong>말하지 않는 것:</strong> 특정 activation이 현대 모든 architecture에서 최적이라는 결과가 아닙니다.</p></CitationBlock></div>
      <div id="paper-glorot-saturation"><CitationBlock source="Glorot & Bengio — Understanding the Difficulty of Training Deep Feedforward Neural Networks" citeKey={2} type="paper" href="https://proceedings.mlr.press/v9/glorot10a.html"><p><strong>문제:</strong> 깊은 network에서 activation과 gradient가 layer를 지날 때 saturation·scale이 무너지는 원인을 분석합니다.</p><p><strong>기여:</strong> Activation statistics와 Jacobian singular value, fan-in·fan-out initialization을 연결합니다.</p><p><strong>전제:</strong> 논문의 sigmoid·tanh network와 dataset·optimizer 조건입니다.</p><p><strong>근거 범위:</strong> Saturation과 initialization scale의 상호작용입니다.</p><p><strong>말하지 않는 것:</strong> Xavier initialization 하나가 모든 activation·normalization 조합에 최적이라는 뜻은 아닙니다.</p></CitationBlock></div><p className="leading-8">뒤의 변화율 3을 받는 동일 입력 2에서도 step은 0, sigmoid는 약 0.314981, tanh는 약 0.211952를 앞으로 돌려보냈습니다. 하나의 활성함수만 보고 전체 학습의 안정성을 판정하지 않고, 앞뒤 가중치와 여러 경로가 함께 만드는 변화율도 확인합니다.</p><ContentBoundary article="activation-functions" /><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>Sigmoid 입력 2에서 출력 0.880797과 뒤로 곱할 0.104994는 각각 어디에 쓰일까요? (답: 7절)</li><li>계단 함수에서 입력 2를 2.001로 바꾸면 뒤 변화율 3은 어떻게 전달될까요? (답: 8절)</li><li>Tanh의 출력이 0을 중심으로 한다는 사실이 포화를 없애 줄까요? (답: 10절)</li></ol>
</section>
</article>;}
