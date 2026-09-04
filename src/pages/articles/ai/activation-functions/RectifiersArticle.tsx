import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationFamilyFlowViz from "./viz/ActivationFamilyFlowViz";

export default function RectifierActivationsArticle() {
  return <article>
    <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">먼저 0에서 꺾이는 선 하나를 봅니다</p><h2 className="text-3xl font-bold tracking-tight">Rectifier는 양수 신호를 살리는 대신 음수 gradient 경로를 어떻게 다룰지 선택한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">
            ReLU는 음수를 0으로 자르고 양수를 그대로 통과시킵니다. 이 단순한 hinge 덕분에 양수 구간의 local derivative는 1이지만 뉴런이 계속 음수에 머물면
            update 경로가 끊깁니다. ReLU의 형태부터 고정하고 dying state, negative slope, self-normalizing recipe를 한 단계씩
            보강합니다.
          </p>
      <ActivationFamilyFlowViz mode="rectifiers" />
      <ContentBoundary article="rectifier-activations" />
    </section>

    <section id="relu" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · ReLU hinge</p><h2 className="mt-2 text-2xl font-bold">ReLU는 양수 구간의 값과 gradient를 그대로 통과시킨다</h2></header>
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
      <div id="paper-relu"><CitationBlock source="Nair & Hinton — Rectified Linear Units Improve Restricted Boltzmann Machines" citeKey={1} type="paper" href="https://www.cs.toronto.edu/~fritz/absps/reluICML.pdf"><p><strong>문제:</strong> Binary stochastic hidden unit보다 풍부하면서 학습 가능한 representation을 만듭니다.</p><p><strong>기여:</strong> Rectified unit을 noisy replicated binary unit 관점으로 설명하고 RBM에서 평가합니다.</p><p><strong>전제:</strong> 논문의 RBM architecture·training·dataset 조건입니다.</p><p><strong>근거 범위:</strong> 2010년 rectified unit의 초기 해석과 실험입니다.</p><p><strong>말하지 않는 것:</strong> ReLU가 모든 deep architecture에서 항상 최적이라는 증명은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="dying-relu" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · failure state</p><h2 className="mt-2 text-2xl font-bold">Dying ReLU는 한 번 0이 나온 장면이 아니라 여러 batch에서 닫힌 update 경로다</h2></header>
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
      />
    </section>

    <section id="negative-slope" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · negative path</p><h2 className="mt-2 text-2xl font-bold">Leaky ReLU와 PReLU는 음수 구간에 작은 직선 통로를 남긴다</h2></header>
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
      <div id="paper-elu"><CitationBlock source="Clevert et al. — Fast and Accurate Deep Network Learning by ELUs" citeKey={3} type="paper" href="https://arxiv.org/abs/1511.07289"><p><strong>문제:</strong> Rectifier network의 positive mean shift와 학습 속도를 개선합니다.</p><p><strong>기여:</strong> 음수 포화 구간을 가진 ELU를 제안하고 당시 vision benchmark에서 비교합니다.</p><p><strong>전제:</strong> 논문의 architecture·initialization·optimizer 조건입니다.</p><p><strong>근거 범위:</strong> ELU의 negative saturation과 당시 실험입니다.</p><p><strong>말하지 않는 것:</strong> Negative saturation이 모든 vanishing gradient를 막는다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="self-normalization" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · distribution recipe</p><h2 className="mt-2 text-2xl font-bold">SELU의 self-normalization은 함수 하나가 아니라 상수·초기화·dropout 조건의 조합이다</h2></header>
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
      <div id="paper-selu"><CitationBlock source="Klambauer et al. — Self-Normalizing Neural Networks" citeKey={4} type="paper" href="https://arxiv.org/abs/1706.02515"><p><strong>문제:</strong> Normalization layer 없이 깊은 feed-forward network의 activation mean·variance를 안정화합니다.</p><p><strong>기여:</strong> SELU fixed point와 contraction 조건, AlphaDropout recipe를 제안합니다.</p><p><strong>전제:</strong> 독립에 가까운 입력·fan-in·LeCun initialization과 논문 network 조건입니다.</p><p><strong>근거 범위:</strong> Self-normalization의 수학 조건과 논문 benchmark입니다.</p><p><strong>말하지 않는 것:</strong> SELU 함수만 넣으면 임의의 CNN·RNN·Transformer가 자동 정규화된다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="comparison" className="mb-16 scroll-mt-20 space-y-5">
      <header><p className="text-sm font-semibold text-primary">05 · release gate</p><h2 className="mt-2 text-2xl font-bold">Activation 이름보다 pre-activation 분포·dead rate·end-to-end 비용을 비교한다</h2></header>
      <p>같은 seed·initialization·optimizer에서 activation histogram, dead-unit rate, gradient norm과 validation metric을 함께 기록합니다. Smooth self-gate와 Transformer gated FFN은 <a href="/ai/gated-activations" className="text-primary hover:underline">다음 글</a>에서 parameter·kernel budget까지 분리합니다.</p>
    </section>
  </article>;
}
