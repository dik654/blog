import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationFamilyFlowViz from "./viz/ActivationFamilyFlowViz";


import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ActivationCurve from "./viz/ActivationCurve";

export default function GatedActivationsArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 전달할 값과 그 값을 조절할 신호를 따로 만듭니다</h2>
<p className="leading-8">입력 두 칸에 1과 −1이 들어왔다고 합시다. 한 계산은 보낼 내용을 (2,−3)으로 만들고, 다른 계산은 조절값을 약 (0.731059,−0.268941)로 만듭니다. 같은 위치끼리 곱하면 결과는 약 (1.462118,0.806824)입니다 (가정). 두 음수가 곱해진 둘째 칸은 양수가 됩니다.</p><p className="leading-8">하나의 숫자를 곡선으로 바꾸는 방법에서 시작해, 입력을 두 경로로 보내 서로 다른 계산 결과를 곱하는 구조로 확장해 보겠습니다. 조절값이 항상 0과 1 사이의 확률이라고 생각하면 위 음수 사례를 설명할 수 없습니다. 어느 단계의 값이 비율이고 어느 단계에서 원래 값과 이미 곱해졌는지를 구분해야 합니다.</p><p className="leading-8">끝까지 사용할 입력은 (1,−1)입니다. 두 경로의 결과를 같은 칸끼리 곱한 뒤, 첫 출력에는 두 값을 합하고 둘째 출력에는 0을 내도록 마지막 계산을 정하겠습니다 (가정). 최종 출력은 약 (2.268941,0)이 됩니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 두 경로가 만나는 곱셈을 전체 흐름에서 찾습니다</h2>
<p className="leading-8">입력은 두 계산으로 갈라집니다. 하나는 전달할 내용의 크기를 만들고, 다른 하나는 그 내용을 조절할 값을 만듭니다. 두 경로를 같은 위치끼리 곱한 뒤 마지막 계산이 원하는 출력 크기로 다시 섞습니다. 갈라지는 곳, 곱하는 곳, 다시 섞는 곳의 역할을 구분하면 됩니다.</p><NumericPath title="같은 입력을 두 역할로 계산해 결합합니다" steps={[{label:"입력",value:"(1, −1)"},{label:"내용 / 조절값",value:"두 경로"},{label:"같은 칸끼리 곱",value:"(1.4621, .8068)"},{label:"다시 섞은 출력",value:"(2.2689, 0)"}]} /><p className="leading-8">조절값을 만드는 방법은 아직 큰 상자로 두었습니다. 먼저 숫자 한 칸에서 비율과 값이 어떻게 구분되는지 열어 보겠습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 0–1 비율에 원래 값을 곱하면 결과는 음수일 수 있습니다</h2>
<p className="leading-8">입력 −1을 비율로 바꾸는 첫 계산은 1/(1+exp(1))≈0.268941입니다. 이 비율에 원래 값 −1을 곱하면 −0.268941이 됩니다. 0–1 범위에 있는 것은 비율 0.268941이며, 곱한 뒤의 결과가 아닙니다.</p><p className="leading-8">입력 1에서는 비율이 약 0.731059이고 원래 값과 곱해도 0.731059입니다. 두 칸을 함께 처리하면 조절 경로의 출력 (0.731059,−0.268941)이 됩니다. 내용 경로의 (2,−3)에 이를 곱하면 둘째 칸에서 부호가 다시 양수로 바뀝니다.</p><p className="leading-8">이 곱셈은 정보를 확률적으로 통과시키는 추첨이 아닙니다. 정해진 입력으로 정해진 숫자를 계산하는 과정입니다. 두 경로 안에서 어떤 변환이 각각 학습되는지 살펴봅니다.</p>
<p className="leading-8">조절값을 문이 열린 비율이라고만 부르면 이 예의 음수를 설명하기 어렵습니다. −1에서 비율 자체는 약 0.268941이지만, 원래 값 −1까지 곱한 결과는 −0.268941입니다. 여기에 내용 −3을 다시 곱하므로 최종 기여는 양수 0.806824가 됩니다.</p><p className="leading-8">입력의 순서를 바꿔 (−1,1)을 같은 표에 넣으면 조절 경로는 약 (−0.268941,0.731059), 내용 경로는 (−2,3)입니다. 위치별 곱은 약 (0.537883,2.193176), 마지막 합은 약 2.731059입니다 (가정). 원래 입력의 합은 두 경우 모두 0이지만 출력은 2.268941과 2.731059로 달라집니다.</p><p className="leading-8">즉 마지막에 단순히 더하더라도, 그 전에 서로 다른 경로에서 만들고 곱한 값이 입력의 구성을 구별합니다. 이번 표의 숫자는 이해를 위해 정한 값이므로 실제 학습이 언제나 이 표를 찾는다고 주장하지는 않습니다.</p></section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 두 변환을 따로 배우기 때문에 같은 입력에서 다른 역할이 나옵니다</h2>
<p className="leading-8">조절 경로에서는 입력 (1,−1)을 그대로 두도록 첫 숫자 표를 정했습니다. 내용 경로에서는 첫 칸을 2배, 둘째 칸을 3배 하도록 다른 숫자 표를 정했습니다 (가정). 두 표가 같아야 할 이유는 없습니다. 앞 경로는 어떤 조건에 반응할지, 뒤 경로는 무엇을 전달할지 따로 바꿀 수 있습니다.</p><p className="leading-8">곱하는 위치의 두 배열은 칸 수가 같아야 합니다. 한쪽이 두 칸, 다른 쪽이 세 칸이면 어느 값과 곱할지 추가 규칙이 필요해집니다. 마지막 숫자 표는 결합된 두 값을 다시 원래 출력 두 칸으로 보냅니다.</p><p className="leading-8">같은 입력에서 서로 다른 표를 쓰는 이유가 드러났습니다. 곡선 하나를 바꾸는 경우와 이 두 경로를 새로 만드는 경우에는 비용 차이도 생깁니다.</p>
</section>
<section id="why-two-paths" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 구조를 바꾸면 늘어난 계산도 함께 비교해야 합니다</h2>
<p className="leading-8">숫자 한 칸의 변환 곡선만 바꾸는 선택은 그 칸을 계산하는 규칙을 바꿉니다. 입력을 두 경로로 따로 보내는 선택은 새로 배울 숫자 표와 계산을 하나 더 만듭니다. 같은 중간 칸 수를 유지하면 표가 두 개에서 세 개가 되므로 숫자 수도 늘어납니다.</p><p className="leading-8">이 예에서 입력과 출력은 각각 두 칸입니다. 중간이 세 칸인 두 표는 2×3+3×2=12개의 숫자를 가집니다. 중간을 두 칸으로 줄인 세 표는 2×2+2×2+2×2=12개입니다 (가정). 중간 폭을 조절하면 배울 숫자 수를 같은 기준으로 맞출 수 있습니다.</p><p className="leading-8">숫자 수가 같아도 곱셈과 메모리 접근, 하드웨어 실행 시간까지 같다고 보장되지는 않습니다. 이름을 붙인 뒤 이 구조와 비용을 원문과 연결합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 곡선 하나와 두 경로를 결합하는 구조를 나누어 부릅니다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>먼저 본 역할</th><th>이름</th><th>이번 사례</th></tr></thead><tbody><tr><td>원래 값에 sigmoid 비율을 곱함</td><td>SiLU</td><td>−1→−.268941</td></tr><tr><td>원래 값에 정규분포의 누적 비율을 곱함</td><td>GELU</td><td>−1→−.158655</td></tr><tr><td>숫자 한 칸에 곡선을 적용함</td><td>Scalar activation</td><td>SiLU·GELU의 비교</td></tr><tr><td>행렬로 입력을 다른 좌표로 섞음</td><td>Projection</td><td>(1,−1)을 두 경로로 보냄</td></tr><tr><td>두 경로 중 하나에 SiLU를 적용해 위치별로 곱함</td><td>SwiGLU</td><td>음수 조절값도 가능</td></tr><tr><td>결합한 값을 마지막 행렬로 출력 폭에 돌려놓음</td><td>FFN · feed-forward network</td><td>출력 (2.268941,0)</td></tr></tbody></table></div><p className="leading-8">SiLU의 0–1 비율과 최종 출력 xσ(x)를 구분합니다. 최종 출력은 음수일 수도, 1보다 클 수도 있습니다.</p><ActivationFamilyFlowViz mode="gates" /><p className="leading-8">GELU와 SiLU의 곡선 비교, SwiGLU를 포함한 FFN 구조 비교를 구분할 이름이 생겼습니다. 같은 입력 (1,−1)을 실제 행렬 숫자와 함께 추적하겠습니다.</p>
</section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7. 세 행렬에 같은 입력을 넣어 (2.268941,0)을 만듭니다</h2>
<p className="leading-8">행 벡터 x=(1,−1)을 쓰겠습니다. 조절 행렬 Wg는 두 칸을 그대로 두는 단위행렬입니다. 내용 행렬 Wv는 대각 원소 2와 3, 나머지 원소 0입니다. 출력 행렬 Wo의 두 행은 모두 (1,0)입니다 (가정).</p><p className="leading-8">xWg=(1,−1)에 SiLU를 적용하면 g≈(0.731059,−0.268941)입니다. xWv=(2,−3)이 내용 v입니다. 같은 칸끼리 곱한 g⊙v≈(1.462118,0.806824)에 Wo를 곱하면 첫 출력은 두 값의 합 약 2.268941, 둘째 출력은 0이 됩니다.</p><AlgorithmBlock title="두 경로의 같은 칸을 곱하는 FFN (의사코드)" input={["x=(1,−1), Wg=[[1,0],[0,1]], Wv=[[2,0],[0,3]], Wo=[[1,0],[1,0]] (가정)"]} steps={[{code:"z ← xWg; v ← xWv"},{code:"각 칸의 gᵢ ← zᵢ / (1 + exp(−zᵢ))"},{code:"각 칸의 mᵢ ← gᵢ × vᵢ"},{code:"y ← mWo"}]} output="z=(1,−1), v=(2,−3), m≈(1.462118,.806824), y≈(2.268941,0)" /><p className="leading-8">곱하는 두 값은 확률이 아니라 부호가 있는 학습된 신호입니다. 이 구분을 유지하면서 원문의 한 칸 함수부터 전체 구조까지 대조해 보겠습니다.</p>
</section>
<section id="gelu-silu" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">8. 원문의 한 칸 정의에 −1을 직접 넣습니다</h2>
<p>
            두 함수 모두 원래 값 x에 0–1 gate를 곱합니다. GELU는 Gaussian CDF Φ(x)를, SiLU는 sigmoid σ(x)를 통과 비율로 사용합니다. 그래서
            ReLU의 hard hinge보다 부드럽지만 gate 계산 비용과 수치 구현까지 포함해 비교해야 합니다.
          </p>
      <ExplainedFormula
        question="GELU와 SiLU에서 곱셈은 왜 필요한가?"
        idea={<>Φ(x)와 σ(x)는 input 크기에 따라 얼마나 통과시킬지를 정하는 gate입니다. 이 비율을 원래 값 x에 곱해야 부호와 크기를 가진 signal이 실제로 선택됩니다.</>}
        formula={String.raw`g_{\mathrm{GELU}}(x)=x\Phi(x),\qquad g_{\mathrm{SiLU}}(x)=x\sigma(x)`}
        annotatedFormula={String.raw`\begin{aligned}p_G&=\underbrace{\Phi(x)}_{\text{Gaussian 통과 비율}}\\[4pt]g_G(x)&=\underbrace{x\,p_G}_{\text{값과 비율을 곱해 선택}}\\[4pt]p_S&=\underbrace{\sigma(x)}_{\text{sigmoid 통과 비율}}\\[4pt]g_S(x)&=\underbrace{x\,p_S}_{\text{값과 비율을 곱해 선택}}\end{aligned}`}
        operations={[
          { expression: String.raw`\Phi(x)`, annotation: ["표준 Gaussian에서 x 이하의 누적 비율을 구해", "GELU의 smooth gate 생성"] },
          { expression: String.raw`x\Phi(x)`, annotation: ["원래 signed value에 gate를 곱해", "크기에 따른 연속적 통과량 결정"] },
          { expression: String.raw`\sigma(x)`, annotation: ["input을 0과 1 사이 비율로 압축해", "SiLU의 smooth gate 생성"] },
          { expression: String.raw`x\sigma(x)`, annotation: ["원래 value와 sigmoid gate를 결합해", "작은 음수도 일부 남기는 response 생성"] },
        ]}
        terms={[
          { symbol: "x", name: "input value", description: "부호와 크기를 보존한 채 gate를 통과할 scalar입니다." },
          { symbol: "\\Phi", name: "Gaussian CDF", description: "표준 Gaussian에서 x 이하일 누적확률입니다." },
          { symbol: "\\sigma", name: "sigmoid gate", description: "x를 0과 1 사이 통과 비율로 바꿉니다." },
          { symbol: "p_G,p_S", name: "pass ratios", description: "GELU와 SiLU가 각각 계산한 통과 비율입니다." },
        ]}
        assumptions={["Scalar 식이며 tensor에는 element-wise 적용합니다.", "GELU는 exact CDF 또는 tanh approximation 구현을 구분합니다.", "Activation latency는 fused kernel과 dtype까지 같은 조건에서 비교합니다."]}
        interpretation="x가 큰 양수면 gate가 1에 가까워 원래 값이 거의 그대로 지나갑니다. 큰 음수면 gate가 0에 가까워 억제되며, 0 근처에서는 hard cutoff 없이 통과량이 연속적으로 변합니다."
      />
      <div id="paper-gelu"><CitationBlock source="Hendrycks & Gimpel — Gaussian Error Linear Units" citeKey={1} type="paper" href="https://arxiv.org/abs/1606.08415"><p><strong>문제:</strong> 입력 부호를 hard하게 자르지 않고 크기에 따라 연속적으로 gate합니다.</p><p><strong>기여:</strong> xΦ(x) 형태의 GELU와 stochastic regularization 관점을 제안합니다.</p><p><strong>전제:</strong> Gaussian CDF 또는 명시한 근사와 논문 실험 조건입니다.</p><p><strong>근거 범위:</strong> GELU의 정의·해석과 당시 benchmark입니다.</p><p><strong>말하지 않는 것:</strong> 모든 architecture에서 ReLU보다 우수하다는 증명은 아닙니다.</p></CitationBlock></div>
      <div id="paper-swish"><CitationBlock source="Ramachandran et al. — Searching for Activation Functions" citeKey={2} type="paper" href="https://arxiv.org/abs/1710.05941"><p><strong>문제:</strong> 제한된 수작업 activation 밖에서 유용한 함수를 찾습니다.</p><p><strong>기여:</strong> 자동 탐색으로 Swish 계열을 발견하고 vision architecture에서 비교합니다.</p><p><strong>전제:</strong> 논문의 search space·proxy task·compute 조건입니다.</p><p><strong>근거 범위:</strong> Activation search와 선택된 benchmark입니다.</p><p><strong>말하지 않는 것:</strong> 다른 domain·hardware에서도 자동 최적이라는 뜻은 아닙니다.</p></CitationBlock></div><p className="leading-8">Gaussian Error Linear Units 원문의 정의 GELU(x)=xΦ(x)에 같은 두 칸 중 −1을 넣으면, Φ(−1)≈0.158655이므로 출력은 약 −0.158655입니다. Searching for Activation Functions의 Swish 정의 xσ(βx)에서 β=1로 두면 SiLU와 같아져 −1×0.268941≈−0.268941입니다.</p><p className="leading-8">같은 음수 −1을 넣었지만 서로 다른 비율 함수를 쓰므로 두 값은 다릅니다. GELU의 tanh 근사를 쓰는 구현도 있으므로 수치 대조에서는 정확한 누적분포 정의인지 근사인지 고정합니다. 이 예에서는 정확한 정의를 사용했습니다.</p><ActivationCurve mode="gates" /><p className="leading-8">한 칸 계산이 확인됐습니다. 다음 절은 이 함수의 출력을 내용 경로와 곱하는 원문의 전체 구조입니다.</p>
</section>
<section id="gated-ffn" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9. 원문 식 (6)의 세 행렬에 같은 숫자를 대응합니다</h2>
<p>
            Hidden state x는 gate projection Wg와 value projection Wv로 갈라집니다. Gate branch에는 SiLU를 적용하고 value
            branch와 coordinate-wise로 곱은 뒤 Wo로 model dimension에 되돌립니다. 곱셈은 같은 feature 위치의 두 부호 있는 값을 결합합니다. Gate branch의 SiLU 출력 자체는 0–1 확률이 아닙니다.
          </p>
      <ExplainedFormula
        question="SwiGLU의 세 projection과 element-wise 곱은 각각 무슨 역할인가?"
        idea={<>Wg는 통과량을, Wv는 전달할 내용을 따로 만듭니다. 두 결과를 같은 coordinate끼리 곱해 조건부 feature를 만들고 Wo가 residual stream 차원으로 되돌립니다.</>}
        formula={String.raw`g=\operatorname{SiLU}(xW_g),\quad v=xW_v,\quad y=(g\odot v)W_o`}
        annotatedFormula={String.raw`\begin{aligned}g&=\underbrace{\operatorname{SiLU}(xW_g)}_{\text{feature별 통과량 생성}}\\[4pt]v&=\underbrace{xW_v}_{\text{전달할 value feature 생성}}\\[4pt]m&=\underbrace{g\odot v}_{\text{같은 위치의 gate와 value 결합}}\\[4pt]y&=\underbrace{mW_o}_{\text{residual stream 차원으로 복귀}}\end{aligned}`}
        operations={[
          { expression: String.raw`xW_g`, annotation: ["hidden state를 gate 전용 basis로 projection해", "feature별 선택 score 생성"] },
          { expression: String.raw`\operatorname{SiLU}(xW_g)`, annotation: ["gate score를 smooth self-gate로 바꿔", "연속적인 통과량 생성"] },
          { expression: String.raw`xW_v`, annotation: ["같은 input을 별도 value basis로 projection해", "실제로 전달할 feature 생성"] },
          { expression: String.raw`g\odot v`, annotation: ["동일 coordinate의 gate와 value를 곱해", "조건을 통과한 feature만 남김"] },
          { expression: String.raw`mW_o`, annotation: ["gated intermediate를 output projection으로 섞어", "model residual dimension에 복귀"] },
        ]}
        terms={[
          { symbol: "x", name: "hidden state", description: "FFN에 들어오는 model-dimension vector입니다." },
          { symbol: "W_g", name: "gate projection", description: "Feature별 통과량을 만들기 위한 weight입니다." },
          { symbol: "W_v", name: "value projection", description: "전달할 내용을 만들기 위한 별도 weight입니다." },
          { symbol: "W_o", name: "output projection", description: "Intermediate를 residual stream 차원으로 되돌립니다." },
          { symbol: "\\odot", name: "element-wise product", description: "같은 coordinate의 gate와 value를 곱합니다." },
        ]}
        assumptions={["Wg와 Wv의 output shape가 같아야 element-wise product가 가능합니다.", "Bias 사용 여부는 model 구현 계약에 따릅니다.", "Kernel fusion 여부는 수학 정의와 별개지만 latency에 영향을 줍니다."]}
        interpretation="Plain activation은 projection 하나의 각 coordinate를 바꿉니다. SwiGLU는 gate와 value가 서로 다른 projection에서 나와 feature selection 자체를 학습하는 구조입니다."
      />
      <div id="paper-swiglu"><CitationBlock source="Shazeer — GLU Variants Improve Transformer" citeKey={3} type="paper" href="https://arxiv.org/abs/2002.05202"><p><strong>문제:</strong> Transformer FFN의 activation과 multiplicative gating을 공정한 parameter budget에서 비교합니다.</p><p><strong>기여:</strong> ReGLU·GEGLU·SwiGLU를 T5 계열 pretraining에서 비교합니다.</p><p><strong>전제:</strong> Gated width를 조정한 parameter matching과 논문 recipe입니다.</p><p><strong>근거 범위:</strong> Transformer FFN의 GLU variant 실험입니다.</p><p><strong>말하지 않는 것:</strong> SwiGLU가 scalar activation 하나이거나 모든 architecture의 자동 최적점이라는 뜻은 아닙니다.</p></CitationBlock></div><p className="leading-8">GLU Variants Improve Transformer 2절 식 (6)의 실제 표기는 FFN_SwiGLU(x,W,V,W₂)=(Swish₁(xW)⊗xV)W₂입니다. 원문의 W,V,W₂는 이 글의 Wg,Wv,Wo에 각각 대응하고, ⊗는 이 식에서 같은 칸끼리 곱하는 연산입니다. Bias를 생략한 원문 조건도 이번 예와 같습니다.</p><p className="leading-8">W에 단위행렬, V에 대각 (2,3), W₂의 두 행에 (1,0)을 대입하면 7절의 중간값과 같은 (2.268941,0)을 얻습니다. SiLU(−1)이 음수이므로 −3과 곱해 양수를 만들었습니다. 따라서 gate 경로의 출력을 항상 0–1 확률로 해석하거나 두 경로가 모두 양수일 때만 통과한다고 설명하면 이 원문 계산과 맞지 않습니다.</p><p className="leading-8">이것은 원문 식을 작은 행렬로 계산한 예입니다. 논문의 실제 모델이 이 가중치나 입력을 사용했다는 뜻은 아닙니다. 다음 절에서 원문이 늘어난 행렬 수를 어떻게 비교했는지 확인합니다.</p>
</section>
<section id="parameter-budget" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">10. 같은 숫자 수를 맞출 때 중간 폭은 3에서 2로 줄어듭니다</h2>
<p>
            Bias를 제외한 plain FFN은 up·down projection 두 개, gated FFN은 gate·value·output projection 세 개를 씁니다. 같은
            parameter budget을 맞추려면 gated intermediate width를 plain width의 약 2/3로 줄여야 합니다.
          </p>
      <ExplainedFormula
        question="Plain FFN과 gated FFN의 parameter 수를 같게 만들려면 width를 어떻게 조정하는가?"
        idea={<>Model dimension d와 plain width m을 고정하면 plain은 두 matrix, gated는 세 matrix가 필요합니다. 두 예산을 같다고 놓고 gated width를 풉니다.</>}
        formula={String.raw`P_{\mathrm{plain}}=2dm,\quad P_{\mathrm{gate}}=3dm_g,\quad m_g=\frac23m`}
        annotatedFormula={String.raw`\begin{aligned}P_{\rm up}&=\underbrace{dm}_{\text{plain 입력 projection}}\\[4pt]P_{\rm down}&=\underbrace{md}_{\text{plain 출력 projection}}\\[4pt]P_{\rm plain}&=P_{\rm up}+P_{\rm down}=2dm\\[6pt]P_g&=\underbrace{dm_g}_{\text{gate projection}}\\[4pt]P_v&=\underbrace{dm_g}_{\text{value projection}}\\[4pt]P_o&=\underbrace{m_gd}_{\text{output projection}}\\[4pt]P_{\rm gate}&=P_g+P_v+P_o=3dm_g\\[6pt]m_g&=\underbrace{\frac{2dm}{3d}}_{\text{같은 예산으로 풀기}}=\frac23m\end{aligned}`}
        operations={[
          { expression: String.raw`dm+md`, annotation: ["plain FFN의 up·down matrix 원소를 더해", "두 projection parameter 예산 계산"] },
          { expression: String.raw`dm_g+dm_g+m_gd`, annotation: ["gated FFN의 gate·value·output matrix를 더해", "세 projection parameter 예산 계산"] },
          { expression: String.raw`2dm=3dm_g`, annotation: ["두 모델의 weight 예산을 같게 놓아", "activation 이름이 아닌 공정한 구조 비교 기준 설정"] },
          { expression: String.raw`m_g=2m/3`, annotation: ["공통 model dimension d를 약분해", "gated intermediate width의 parity 값 계산"] },
        ]}
        terms={[
          { symbol: "d", name: "model dimension", description: "Residual stream의 feature 수입니다." },
          { symbol: "m", name: "plain width", description: "일반 두-projection FFN의 intermediate width입니다." },
          { symbol: "m_g", name: "gated width", description: "세-projection gated FFN의 intermediate width입니다." },
          { symbol: "P", name: "weight count", description: "Bias를 제외한 projection matrix 원소 수입니다." },
        ]}
        assumptions={["Bias와 normalization parameter는 제외합니다.", "Parameter parity가 FLOP·memory traffic·latency parity를 보장하지 않습니다.", "Hardware 비교에는 fused kernel과 dtype을 같은 조건으로 둡니다."]}
        interpretation="d=512, m=2048이면 plain은 2,097,152 weights입니다. Gated width를 2048로 그대로 두면 3,145,728 weights이며, parity width는 약 1365입니다."
      /><p className="leading-8">원문 2절은 행렬이 두 개에서 세 개가 되므로 중간 폭을 2/3배 한다고 설명합니다. 첫 예의 d=2, plain 폭 m=3을 넣으면 2dm=12입니다. Gated 폭 mg=2를 넣으면 3dmg=12로 같습니다. 같은 폭 3을 유지하면 18개가 되어 50% 늘어납니다 (가정).</p><p className="leading-8">원문의 실험은 dmodel=768에서 폭 3,072와 2,048을 비교합니다. 이 수치는 저자가 맞춘 조건이며, 위의 두 칸 계산은 같은 비율을 이해하기 위한 가정 예입니다. 폭 1,365처럼 정수로 반올림하거나 하드웨어 배수에 맞출 때는 parameter 수가 정확히 같지 않을 수 있으므로 최종 정수 폭으로 다시 셉니다.</p><p className="leading-8">같은 표의 원소 수는 비교 조건 하나입니다. 실제로는 활성함수 계산, 중간값 저장, 여러 연산을 묶는 kernel, 자료형이 실행 시간에 영향을 줍니다.</p>
</section>
<section id="comparison" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">11. 조절값의 뜻과 실제 실험 조건을 함께 남깁니다</h2>
<p>GELU와 SiLU는 scalar curve 비교이고 SwiGLU는 FFN architecture 비교입니다. 같은 이름표 아래 섞지 말고 model dimension, intermediate width, parameter 수, training tokens, fused-kernel 여부와 end-to-end latency를 같은 artifact에 기록해야 합니다.</p>
      <p>Hard threshold와 saturation의 기초는 <a href="/cs/ai/activation-functions" className="text-primary hover:underline">활성화 함수 기초</a>에서, ReLU의 dead path와 negative slope는 <a href="/cs/ai/rectifier-activations" className="text-primary hover:underline">rectifier 글</a>에서 연결됩니다.</p><p className="leading-8">이번 작은 계산은 특정 곡선이나 구조가 모든 과제에 더 좋다는 실험이 아닙니다. 논문은 정해진 Transformer 학습과 평가에서 비교했고, 다른 입력 분포나 하드웨어에서는 결과가 달라질 수 있습니다. 비율 함수, 조절 경로의 출력, 내용 경로의 출력을 구분하면 어떤 변형을 비교하는지부터 명확해집니다.</p><ContentBoundary article="gated-activations" /><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>입력 −1의 SiLU 출력은 왜 0–1 비율이 아니라 음수일까요? (답: 3절)</li><li>내용 −3과 조절값 −0.268941을 곱하면 어떤 부호의 값이 나올까요? (답: 7절)</li><li>입력 폭 2, plain 중간 폭 3과 같은 12개 가중치를 쓰려면 gated 폭을 얼마로 골라야 할까요? (답: 10절)</li></ol>
</section>
</article>;}
