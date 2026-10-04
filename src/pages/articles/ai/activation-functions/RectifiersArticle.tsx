import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationFamilyFlowViz from "./viz/ActivationFamilyFlowViz";


import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ActivationCurve from "./viz/ActivationCurve";

export default function RectifierActivationsArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 음수 값을 지우면 학습에 돌아갈 신호도 지워집니다</h2>
<p className="leading-8">숫자 −2와 3을 받은 두 칸에서 음수만 0으로 바꾸기로 했다고 합시다 (가정). 앞 방향의 결과는 0과 3입니다. 계산이 단순하고 양수 크기는 그대로 보존되지만, 나중에 앞의 −2를 고치고 싶을 때 작은 변화가 출력에 전혀 나타나지 않는 문제가 생깁니다.</p><p className="leading-8">이 글에서는 같은 두 값에 음수 구간을 자르는 규칙, 조금 남기는 규칙, 부드럽게 눌러 남기는 규칙을 적용합니다. 각 규칙이 앞으로 어떤 값을 보내는지와 뒤의 학습 신호를 얼마나 돌려보내는지를 함께 보겠습니다. 숫자 하나의 동작과 여러 층 전체의 안정성도 구분합니다.</p><p className="leading-8">계속 사용할 입력은 (−2,3), 뒤에서 각 칸에 온 변화율은 (4,4)입니다 (가정). 같은 조건으로 비교해야 음수를 남기는 선택이 실제로 무엇을 바꾸는지 드러납니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 앞 방향의 통과 여부를 뒤 방향에서도 다시 씁니다</h2>
<p className="leading-8">전체 계산은 입력의 부호를 확인하고, 부호에 맞는 값 변환을 적용하고, 그 구간의 기울기를 뒤 변화율에 곱하는 세 부분입니다. 음수 값을 0으로 지운 구간에서는 출력이 평평하므로 기울기도 0입니다. 양수 값을 그대로 통과시키는 구간의 기울기는 1입니다.</p><NumericPath title="앞으로 0을 내는 칸은 뒤의 변화율도 0이 됩니다" steps={[{label:"두 입력",value:"−2, 3"},{label:"앞으로 보낸 값",value:"0, 3"},{label:"그 위치의 기울기",value:"0, 1"},{label:"뒤의 4를 곱하기",value:"0, 4"}]} /><p className="leading-8">앞의 값을 지우는 것과 뒤의 변화율을 지우는 것이 같은 선택에서 나옵니다. 이 연결을 작은 숫자로 확인한 뒤 오래 닫힌 칸을 구별하겠습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. −2를 조금 움직여도 0이면 뒤 변화율은 없습니다</h2>
<p className="leading-8">−2를 −1.999로 조금 올려도 결과는 0입니다. 이 구간의 변화율은 0이므로 뒤에서 받은 4를 곱해도 0입니다. 반대로 3을 3.001로 올리면 출력도 0.001만큼 움직입니다. 기울기 1에 뒤의 4를 곱하면 4가 앞 계산으로 전달됩니다.</p><p className="leading-8">여기서 앞 계산의 변화율을 구한 것이지, 실제 가중치를 고친 것은 아닙니다. 뒤에 같은 4가 들어와도 현재 입력이 어느 구간에 있는지에 따라 고칠 방향의 정보가 다릅니다. 정확히 0에서 두 직선이 만나는 문제는 뒤에서 따로 다룹니다.</p><p className="leading-8">한 번 음수가 나온 것과 계속 음수에 머무는 것은 다릅니다. 그 차이를 보기 위해 어느 칸의 값을 어느 시간 범위에서 관측하는지 먼저 정합니다.</p>
</section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 부호 판단과 관측 기록을 다른 일로 둡니다</h2>
<p className="leading-8">값을 바꾸는 부분은 현재 입력 −2가 음수인지 판단합니다. 기울기를 보내는 부분은 이 판단을 이용해 뒤의 4에 0을 곱합니다. 학습 상태를 진단하는 부분은 같은 칸이 다음 자료에서도 음수였는지를 기록합니다. 이번 한 번의 결과로 미래의 모든 입력을 알 수는 없습니다.</p><p className="leading-8">예를 들어 다음 두 묶음에서 같은 칸의 값이 −1과 0.5였다면 마지막에는 다시 열립니다 (가정). 반대로 관측한 모든 값이 −2,−1,−0.5처럼 음수였다면 그 범위에서는 계속 닫혀 있었다고 말할 수 있습니다. 기록 범위와 앞으로 절대 열리지 않는다는 주장은 구별합니다.</p><p className="leading-8">진단 대상이 정해졌습니다. 이제 음수 기울기를 아주 조금 남기면 현재 사례가 어떻게 달라지는지 보겠습니다.</p>
<p className="leading-8">음수 경로 하나가 닫혔다고 앞의 학습 값이 항상 멈추는 것은 아닙니다. 두 입력이 같은 곱셈 값 하나를 공유한다고 합시다. 그 값이 1, 더하는 값이 0이면 입력 −2와 3은 그대로 −2와 3이 됩니다. 출력 뒤에서 각각 변화율 4가 오고, 두 기여를 더해 학습한다고 정합니다 (가정).</p><p className="leading-8">음수 입력의 길은 닫혀서 공유 값에 대한 기여가 0입니다. 양수 입력의 길은 열려서 공유 값에 대한 기여가 4×3=12입니다. 따라서 합은 12입니다. 이동 크기를 0.1로 정해 이 공유 값을 고치면 1−0.1×12=−0.2가 됩니다 (가정). 한 입력의 닫힌 길 밖에도 같은 값을 바꾸는 길이 있었기 때문입니다.</p><p className="leading-8">같은 두 입력을 다시 넣으면 −2×(−0.2)=0.4, 3×(−0.2)=−0.6입니다. 아까 닫혔던 입력의 길이 열리고 열렸던 길이 닫힙니다. 이 큰 이동이 좋은 학습을 만든다는 뜻은 아닙니다. 한 입력의 출력 0만 보고 학습 값이 영원히 바뀌지 않는다고 판단할 수 없음을 보이는 계산입니다.</p><p className="leading-8">반대로 관찰한 모든 자료가 같은 길을 닫고 다른 경로의 기여나 이전 기록도 없다면, 그 값은 이 계산만으로 움직이기 어렵습니다. 따라서 한 번의 출력, 여러 자료에서 열린 비율, 실제 학습 값의 변화량을 따로 관찰해야 합니다.</p><p className="leading-8">입력의 부호와 돌아오는 변화율의 부호도 따로 봅니다. 양수 입력은 길을 열지만 뒤에서 온 변화율이 음수라면 그 음수가 그대로 돌아갑니다. 열린 길이라는 말은 학습 값을 항상 늘리라는 지시가 아니라 이번 변화율을 통과시키라는 뜻입니다.</p></section>
<section id="why-negative-path" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 음수를 조금 남기면 변화율에도 작은 통로가 생깁니다</h2>
<p className="leading-8">음수 입력을 0으로 만들지 않고 0.01배 해 보겠습니다 (가정). −2는 −0.02가 되고, 이 직선의 기울기는 0.01입니다. 뒤 변화율 4를 곱하면 0.04가 앞 계산으로 전달됩니다. 양수 3은 이전과 같이 3이고 뒤 변화율도 4입니다.</p><p className="leading-8">작은 통로는 완전히 끊긴 국소 변화율을 남겨 줍니다. 하지만 0.04는 원래 4의 100분의 1입니다. 여러 층을 거치며 작아지는 문제나 잘못된 학습 속도까지 이 한 선택으로 해결되지는 않습니다. 음수 통로를 고정할지 학습으로 조절할지도 별도 선택입니다.</p><p className="leading-8">음수 처리에 따라 값과 변화율이 함께 달라졌습니다. 다음 이름은 바로 이 선택들을 구분합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 음수를 다루는 선택에 따라 이름이 달라집니다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>먼저 본 역할</th><th>이름</th><th>이번 사례</th></tr></thead><tbody><tr><td>음수를 0으로, 양수는 그대로 보냄</td><td>ReLU</td><td>(−2,3)→(0,3)</td></tr><tr><td>여러 묶음에서 계속 음수여서 경로가 닫힘</td><td>Dying ReLU</td><td>한 번의 0과 구별</td></tr><tr><td>음수 기울기를 작은 고정값으로 남김</td><td>Leaky ReLU</td><td>−2×.01=−.02</td></tr><tr><td>음수 기울기를 학습 값으로 가짐</td><td>PReLU</td><td>a의 gradient도 계산</td></tr><tr><td>음수에서 지수 곡선의 하한으로 접근</td><td>ELU</td><td>음수 끝은 다시 평평해짐</td></tr><tr><td>정해진 상수와 초기화 조건으로 분포를 안정시킴</td><td>SELU</td><td>평균·분산의 조건부 분석</td></tr></tbody></table></div><ActivationFamilyFlowViz mode="rectifiers" /><p className="leading-8">같은 이름 계열에 있어도 음수 기울기와 전체 분포를 다루는 목표는 다릅니다. 우선 한 입력의 경로를 그대로 대조하고 원문 조건을 확인합니다.</p>
</section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7. 같은 (−2,3)을 두 규칙으로 끝까지 보냅니다</h2>
<p className="leading-8">ReLU 경로는 (−2,3)→(0,3), 국소 기울기 (0,1), 뒤 변화율 (4,4)와의 곱 (0,4)입니다. 음수 기울기 0.01을 둔 경로는 (−2,3)→(−0.02,3), 기울기 (0.01,1), 뒤로 가는 값 (0.04,4)입니다. 같은 입력과 같은 뒤 변화율에서 음수 칸만 달라졌습니다.</p><AlgorithmBlock title="음수 기울기를 둔 두 구간 함수 (의사코드)" input={["각 칸의 입력 z, 뒤 변화율 u, 음수 기울기 a", "사례 z=(−2,3), u=(4,4), a=0 또는 .01 (가정)"]} steps={[{code:"z > 0이면: 출력 ← z; 앞 변화율 ← u"},{code:"z < 0이면: 출력 ← a × z; 앞 변화율 ← a × u"},{code:"z = 0이면: 구현에서 고른 미분 규칙을 별도로 적용"}]} output="a=0이면 출력(0,3), 변화율(0,4); a=.01이면 출력(−.02,3), 변화율(.04,4)" /><p className="leading-8">두 값과 두 변화율이 모두 연결됐습니다. 아래 원문의 정의에 이 숫자를 다시 넣어, 설명한 구간 조건이 실제 정의와 같은지 확인합니다.</p>
</section>
<section id="relu" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">8. 원문의 음수 기울기를 0으로 놓으면 ReLU가 됩니다</h2>
<p>
            ReLU activation은 pre-activation z가 음수이면 0, 양수이면 z를 그대로 냅니다. Forward에서는 sparse activation을 만들고
            backward에서는 양수인 coordinate만 gradient를 통과시키는 binary mask처럼 동작합니다.
          </p>
      <ExplainedFormula
        question="ReLU의 forward와 backward mask는 어떻게 연결되는가?"
        idea={<>Forward에서 0과 z 중 큰 값을 고르고, backward에서는 forward 때 z가 양수였던 위치만 1로 열어 upstream gradient를 통과시킵니다.</>}
        formula={String.raw`a=\max(0,z),\qquad \frac{da}{dz}=\mathbf 1[z>0]`}
        annotatedFormula={String.raw`\begin{aligned}a&=\underbrace{\max(0,z)}_{\text{음수는 자르고 양수는 통과}}\\[4pt]m&=\underbrace{\mathbf 1[z>0]}_{\text{양수였던 위치만 gradient 통과}}\end{aligned}`}
        operations={[
          { expression: String.raw`\max(0,z)`, annotation: ["0과 pre-activation을 비교해", "음수 response는 제거하고 양수 값은 보존"] },
          { expression: String.raw`\mathbf 1[z>0]`, annotation: ["forward에서 열린 양수 위치를 기록해", "backward upstream gradient의 통과 mask 생성"] },
        ]}
        terms={[
          { symbol: "z", name: "pre-activation", description: "ReLU가 읽는 affine score입니다." },
          { symbol: "a", name: "ReLU output", description: "0 이상으로 rectified된 activation입니다." },
          { symbol: "m", name: "backward mask", description: "양수 위치는 1, 음수 위치는 0인 local derivative입니다." },
          { symbol: "\\mathbf 1", name: "indicator", description: "조건이 참인 위치만 1로 여는 연산입니다." },
        ]}
        assumptions={["z=0에는 표준 derivative가 없으며 예시는 0을 선택하는 일반적 convention을 씁니다.", "Vector input에는 coordinate-wise 적용합니다.", "Local derivative 1이 전체 network의 gradient 보존을 보장하지 않습니다."]}
        interpretation="z=-2이면 a=0, mask=0입니다. z=3이면 a=3, mask=1입니다. ReLU의 장점과 실패는 같은 mask의 어느 쪽에 오래 머무는지에서 함께 나옵니다."
      />
      <div id="paper-relu"><CitationBlock source="Nair & Hinton — Rectified Linear Units Improve Restricted Boltzmann Machines" citeKey={1} type="paper" href="https://www.cs.toronto.edu/~fritz/absps/reluICML.pdf"><p><strong>문제:</strong> Binary stochastic hidden unit보다 풍부하면서 학습 가능한 representation을 만듭니다.</p><p><strong>기여:</strong> Rectified unit을 noisy replicated binary unit 관점으로 설명하고 RBM에서 평가합니다.</p><p><strong>전제:</strong> 논문의 RBM architecture·training·dataset 조건입니다.</p><p><strong>근거 범위:</strong> 2010년 rectified unit의 초기 해석과 실험입니다.</p><p><strong>말하지 않는 것:</strong> ReLU가 모든 deep architecture에서 항상 최적이라는 증명은 아닙니다.</p></CitationBlock></div><p className="leading-8">He 등, Delving Deep into Rectifiers 2쪽 식 (1)의 실제 정의는 양수 yᵢ를 그대로 두고, 0 이하에서는 aᵢyᵢ를 냅니다. 원문은 aᵢ=0이면 ReLU가 된다고 설명합니다. 처음의 y=(−2,3)에 a=0을 대입하면 (0,3)이며, 두 열린 구간의 미분은 (0,1)입니다.</p><p className="leading-8">입력 0에서는 양쪽 기울기가 다르므로 표준 미분은 없습니다. 프로그램이 0을 반환하도록 정하는 것은 그 지점의 계산 규약입니다. 이제 a를 0이 아닌 값으로 둔 경우와 학습하는 경우를 비교합니다.</p>
</section>
<section id="negative-slope" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9. 학습하는 음수 기울기는 입력과 뒤 변화율로 갱신됩니다</h2>
<p>
            Negative-slope rectifier는 음수 입력을 0으로 만들지 않고 a배로 줄여 통과시킵니다. Leaky ReLU는 a를 hyperparameter로 고정하고
            PReLU는 a를 parameter로 학습합니다. 이 선택은 끊긴 local gradient를 복구하지만 learning rate나 잘못된 initialization 같은 원인
            전체를 없애지는 않습니다.
          </p>
      <ExplainedFormula
        question="음수 slope a는 forward 값과 backward gradient를 어떻게 바꾸는가?"
        idea={<>양수 구간은 identity를 유지하고 음수 구간에서 z에 a를 곱합니다. 같은 a가 backward local slope가 되어 upstream gradient의 작은 통로를 남깁니다.</>}
        formula={String.raw`f_a(z)=\max(az,z),\qquad f_a'(z)=a\;(z<0)`}
        annotatedFormula={String.raw`\begin{aligned}y_-&=\underbrace{az}_{\text{음수 값을 a배로 보존}}\\[4pt]f_a(z)&=\underbrace{\max(y_-,z)}_{\text{음수 slope와 identity 중 선택}}\\[4pt]f_a'(z)&=\underbrace{a}_{\text{음수 gradient 통로}}\quad(z<0)\end{aligned}`}
        operations={[
          { expression: String.raw`az`, annotation: ["음수 input을 작은 slope로 축소해", "forward sign과 일부 크기를 남김"] },
          { expression: String.raw`\max(az,z)`, annotation: ["음수면 leaky, 양수면 identity를 골라", "ReLU와 같은 hinge 유지"] },
          { expression: String.raw`f_a'(z)=a`, annotation: ["음수 branch의 직선 기울기를 그대로 사용해", "upstream gradient가 완전히 0이 되는 것을 방지"] },
        ]}
        terms={[
          { symbol: "a", name: "negative slope", description: "Leaky ReLU에서는 고정하고 PReLU에서는 학습하는 작은 기울기입니다." },
          { symbol: "z", name: "pre-activation", description: "Rectifier에 들어오는 affine score입니다." },
          { symbol: "y_-", name: "negative branch value", description: "음수 구간에서 a배로 축소한 후보 값입니다." },
          { symbol: "f_a'(z)", name: "local slope", description: "Backward upstream gradient에 곱하는 음수 branch 기울기입니다." },
        ]}
        assumptions={["0<a<1인 전형적 leaky setting을 사용합니다.", "PReLU parameter의 scope는 channel-wise 또는 shared인지 명시합니다.", "같은 initialization·optimizer·parameter budget에서 baseline과 비교합니다."]}
        interpretation="z=-2, a=0.01이면 output은 -0.02이고 local slope는 0.01입니다. Gradient는 작아지지만 0은 아니며, 이 차이가 dead path를 완화합니다."
      />
      <div id="paper-prelu"><CitationBlock source="He et al. — Delving Deep into Rectifiers" citeKey={2} type="paper" href="https://arxiv.org/abs/1502.01852"><p><strong>문제:</strong> Rectifier의 음수 구간과 깊은 network 초기 signal scale을 함께 개선합니다.</p><p><strong>기여:</strong> PReLU와 rectifier-aware initialization을 제안하고 ImageNet에서 평가합니다.</p><p><strong>전제:</strong> 논문의 CNN·training·parameterization 조건입니다.</p><p><strong>근거 범위:</strong> PReLU와 초기화를 결합한 vision 실험입니다.</p><p><strong>말하지 않는 것:</strong> 학습 slope 하나가 모든 dead unit이나 optimization 실패를 해결한다는 뜻은 아닙니다.</p></CitationBlock></div>
      <div id="paper-elu"><CitationBlock source="Clevert et al. — Fast and Accurate Deep Network Learning by ELUs" citeKey={3} type="paper" href="https://arxiv.org/abs/1511.07289"><p><strong>문제:</strong> Rectifier network의 positive mean shift와 학습 속도를 개선합니다.</p><p><strong>기여:</strong> 음수 포화 구간을 가진 ELU를 제안하고 당시 vision benchmark에서 비교합니다.</p><p><strong>전제:</strong> 논문의 architecture·initialization·optimizer 조건입니다.</p><p><strong>근거 범위:</strong> ELU의 negative saturation과 당시 실험입니다.</p><p><strong>말하지 않는 것:</strong> Negative saturation이 모든 vanishing gradient를 막는다는 뜻은 아닙니다.</p></CitationBlock></div><p className="leading-8">같은 원문 식 (1)에 a=0.01과 y=−2를 넣으면 −0.02입니다. 식 (3)은 음수 구간에서 출력의 a에 대한 변화율이 y 자체라고 씁니다. 뒤 변화율 4를 받으면 a의 gradient는 4×(−2)=−8입니다. 양수 입력 3은 a를 쓰지 않으므로 이 경로의 기여는 0입니다 (가정).</p><p className="leading-8">이 계산은 입력을 향해 돌아간 0.04와 다릅니다. 0.04는 z를 고칠 때의 변화율이고, −8은 a를 고칠 때의 변화율입니다. 기울기를 공유한다면 해당 칸들의 a에 대한 기여를 합합니다. 원문은 a의 범위를 강제로 제한하지 않으며 초기값 0.25를 사용합니다. 위 max(az,z) 표현은 명시한 0&lt;a&lt;1 범위의 설명이고, 임의로 학습된 a에는 원문의 부호별 정의를 적용해야 합니다.</p><p className="leading-8">음수 입력에 지수 곡선을 쓰는 ELU에서 α=1이면 −2의 출력은 exp(−2)−1≈−0.864665입니다 (가정). 이처럼 음수 통로가 있다고 해도 하한에 가까운 구간은 다시 평평해질 수 있습니다. 다음 절은 그 곡선과 전체 분포 조건을 함께 선택한 방법입니다.</p>
</section>
<section id="self-normalization" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">10. SELU의 식에 같은 값을 넣어도 두 값이 자동으로 표준화되지는 않습니다</h2>
<p>Self-normalizing activation은 layer를 지날 때 activation 평균과 분산이 안정된 fixed point 근처로 돌아오게 하려는 설계입니다. SELU의 α·λ, LeCun normal initialization, feed-forward 조건과 AlphaDropout을 함께 사용해야 논문의 수축 논리를 적용할 수 있습니다.</p>
      <ExplainedFormula
        question="SELU가 ordinary ELU와 다른 fixed-point recipe를 어떻게 표현하는가?"
        idea={<>음수에는 α(e^z-1), 양수에는 z를 쓰고 전체에 λ를 곱합니다. 이 두 상수는 입력 mean·variance mapping이 목표 fixed point 근처로 돌아오도록 함께 선택됩니다.</>}
        formula={String.raw`\operatorname{selu}(z)=\lambda\begin{cases}z&z>0\\\alpha(e^z-1)&z\le0\end{cases}`}
        annotatedFormula={String.raw`\begin{aligned}u_-&=\underbrace{\alpha(e^z-1)}_{\text{음수 값을 유한 하한으로 압축}}\\[4pt]u&=\underbrace{\begin{cases}z&z>0\\u_-&z\le0\end{cases}}_{\text{양수 identity와 음수 branch 선택}}\\[4pt]y&=\underbrace{\lambda u}_{\text{목표 mean·variance scale로 조정}}\end{aligned}`}
        operations={[
          { expression: String.raw`\alpha(e^z-1)`, annotation: ["음수 input을 exponential tail로 눌러", "output mean을 낮추고 finite lower bound 생성"] },
          { expression: String.raw`\begin{cases}z&z>0\\u_-&z\le0\end{cases}`, annotation: ["부호에 따라 identity와 saturating branch를 골라", "비대칭 response 구성"] },
          { expression: String.raw`\lambda u`, annotation: ["두 branch의 output을 fixed scale로 확대해", "논문이 분석한 mean·variance mapping에 맞춤"] },
        ]}
        terms={[
          { symbol: "z", name: "pre-activation", description: "SELU에 들어오는 score입니다." },
          { symbol: "\\alpha", name: "negative saturation constant", description: "음수 branch의 하한과 shape를 정하는 고정 상수입니다." },
          { symbol: "\\lambda", name: "output scale constant", description: "전체 output의 scale을 조정하는 고정 상수입니다." },
          { symbol: "u_-", name: "negative branch", description: "음수 input을 exponential하게 압축한 값입니다." },
          { symbol: "y", name: "SELU output", description: "Branch 선택과 λ scaling을 마친 activation입니다." },
        ]}
        assumptions={["논문의 α≈1.6733, λ≈1.0507 값을 사용합니다.", "LeCun normal initialization과 feed-forward independence 근사를 함께 둡니다.", "Dropout이 필요하면 ordinary dropout이 아니라 AlphaDropout 조건을 검토합니다.", "Residual·normalization·convolution 구조에 자동 일반화하지 않습니다."]}
        interpretation="SELU는 ELU 이름만 바꾼 것이 아닙니다. 함수·상수·초기 분포·architecture가 함께 mean 0, variance 1 부근의 mapping을 만들 때 self-normalizing 주장을 평가할 수 있습니다."
      />
      <div id="paper-selu"><CitationBlock source="Klambauer et al. — Self-Normalizing Neural Networks" citeKey={4} type="paper" href="https://arxiv.org/abs/1706.02515"><p><strong>문제:</strong> Normalization layer 없이 깊은 feed-forward network의 activation mean·variance를 안정화합니다.</p><p><strong>기여:</strong> SELU fixed point와 contraction 조건, AlphaDropout recipe를 제안합니다.</p><p><strong>전제:</strong> 독립에 가까운 입력·fan-in·LeCun initialization과 논문 network 조건입니다.</p><p><strong>근거 범위:</strong> Self-normalization의 수학 조건과 논문 benchmark입니다.</p><p><strong>말하지 않는 것:</strong> SELU 함수만 넣으면 임의의 CNN·RNN·Transformer가 자동 정규화된다는 뜻은 아닙니다.</p></CitationBlock></div><p className="leading-8">Self-Normalizing Neural Networks 3쪽 식 (2)의 실제 정의에 입력 −2와 3을 넣겠습니다. 원문의 α≈1.673263, λ≈1.050701을 쓰면 출력은 약 −1.520166과 3.152103입니다. 음수 기울기는 λαexp(−2)≈0.237933, 양수 기울기는 λ≈1.050701이므로 뒤 변화율 4는 각각 약 0.951731과 4.202804가 됩니다.</p><p className="leading-8">이 두 출력의 평균은 약 0.815968로 0이 아닙니다. SELU가 매 묶음을 강제로 평균 0으로 바꾸는 함수라는 해석은 이 작은 예에서도 틀립니다. 원문은 정해진 분포와 초기화 조건에서 여러 층의 평균·분산 변환이 고정점 가까이 돌아오는지를 분석합니다. 함수값 하나와 분포에 관한 정리를 구분해야 합니다.</p><ActivationCurve mode="rectifiers" />
</section>
<section id="dying-relu" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">11. 여러 자료에서 닫힌 경로와 다른 갱신 경로를 구분합니다</h2>
<p>한 sample에서 activation이 0인 것은 정상적인 sparsity일 수 있습니다. Dying ReLU는 특정 unit의 pre-activation이 여러 batch와 step에서 계속 음수라 output과 local derivative가 모두 0인 상태입니다. Activation rate, pre-activation histogram, weight update norm을 같은 unit 기준으로 추적해야 합니다.</p>
      <ExplainedFormula
        question="Unit이 실제로 dying state인지 어떤 관측 조건으로 구분하는가?"
        idea={<>관측 window의 모든 sample에서 pre-activation이 0 이하이고, 그 때문에 local mask와 parameter update가 계속 0인지를 함께 봅니다.</>}
        formula={String.raw`D_j=\mathbf 1[\max_{x\in\mathcal B_{1:K}}z_j(x)\le0]`}
        annotatedFormula={String.raw`\begin{aligned}z_j^{\max}&=\underbrace{\max_{x\in\mathcal B_{1:K}}z_j(x)}_{\text{여러 batch에서 가장 큰 pre-activation}}\\[4pt]D_j&=\underbrace{\mathbf 1[z_j^{\max}\le0]}_{\text{한 번도 열리지 않으면 dead 후보}}\end{aligned}`}
        operations={[
          { expression: String.raw`\max_{x\in\mathcal B_{1:K}}z_j(x)`, annotation: ["한 batch의 우연한 0과 구분하도록", "K개 batch 전체에서 가장 열린 순간을 찾음"] },
          { expression: String.raw`\mathbf 1[z_j^{\max}\le0]`, annotation: ["관측 window 내 최대값도 음수인지 판정해", "계속 닫힌 unit을 dead 후보로 표시"] },
        ]}
        terms={[
          { symbol: "j", name: "unit index", description: "추적하는 hidden unit의 번호입니다." },
          { symbol: "\\mathcal B_{1:K}", name: "observation batches", description: "연속 K개 training batch의 sample 집합입니다." },
          { symbol: "z_j(x)", name: "unit pre-activation", description: "Sample x에서 unit j가 ReLU 전에 만든 score입니다." },
          { symbol: "D_j", name: "dead candidate flag", description: "관측 window에서 한 번도 양수가 아니면 1입니다." },
        ]}
        assumptions={["K와 dataset coverage를 run artifact에 기록합니다.", "Flag만으로 영구 사망을 증명하지 않고 update norm과 이후 window를 함께 봅니다.", "Large learning rate·bias drift·initialization·data shift를 가능한 원인으로 분리합니다."]}
        interpretation="한 batch에서 0 activation rate가 높아도 다음 batch에서 양수가 나오면 D_j=0입니다. 여러 window에서 D_j=1이고 update norm도 0이면 gradient path가 실제로 닫힌 강한 증거입니다."
      /><p className="leading-8">3절에서 본 단 한 번의 −2는 지속된 사망 상태의 증거가 아닙니다. 관측 범위에 0.5가 한 번이라도 들어오면 그 구간의 최대값은 양수이므로 위 표시는 0이 됩니다. 계속 음수여도 weight decay, momentum에 남은 과거 방향, 공유 parameter의 다른 경로가 실제 숫자를 바꿀 수 있습니다. 이 국소 미분이 0이라는 사실과 parameter 전체 갱신이 반드시 0이라는 주장을 구분합니다.</p><p className="leading-8">관찰 규칙의 예로 연속 10개 묶음에서 한 번도 열리지 않은 단위를 후보로 기록하고, 다음 두 관찰 구간에서 열린 비율이 1% 이상으로 돌아오면 회복 표시를 할 수 있습니다 (가정). 10과 1%는 보편 기준이 아니므로 자료 범위와 기준의 버전을 함께 기록합니다. 실제 update norm도 확인해야 다른 경로의 이동과 이 경로의 회복을 구분할 수 있습니다.</p>
</section>
<section id="comparison" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">12. 같은 계산 조건에서 값의 분포와 비용까지 비교합니다</h2>
<p>같은 seed·initialization·optimizer에서 activation histogram, dead-unit rate, gradient norm과 validation metric을 함께 기록합니다. Smooth self-gate와 Transformer gated FFN은 <a href="/cs/ai/gated-activations" className="text-primary hover:underline">다음 글</a>에서 parameter·kernel budget까지 분리합니다.</p><p className="leading-8">속도도 비교한다면 같은 입력 크기·정밀도·장치에서 준비 실행을 거친 뒤 실제 경과 시간을 기록합니다. 음수 경로를 연 효과와 계산 비용, 검증 자료의 품질 변화가 함께 남아야 함수 이름만 바꾼 결론을 피할 수 있습니다.</p><ContentBoundary article="rectifier-activations" /><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>입력 −2, 뒤 변화율 4에서 음수 기울기 .01을 남기면 앞 변화율은 얼마일까요? (답: 7절)</li><li>같은 사례에서 학습하는 음수 기울기 a의 gradient가 .04가 아닌 −8인 이유는 무엇일까요? (답: 9절)</li><li>SELU 출력 두 개의 평균이 0이 아니어도 원문의 조건부 주장이 바로 틀린 것은 아닌 이유는 무엇일까요? (답: 10절)</li></ol>
</section>
</article>;}
