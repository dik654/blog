import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationFamilyFlowViz from "./viz/ActivationFamilyFlowViz";

export default function GatedActivationsArticle() {
  return <article>
    <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">먼저 값과 통과 비율을 분리합니다</p><h2 className="text-3xl font-bold tracking-tight">Smooth self-gate에서 두 projection을 곱하는 gated FFN으로 확장한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">GELU와 SiLU는 scalar input 하나가 자기 통과 비율을 정하는 smooth self-gate입니다. SwiGLU는 여기서 한 단계 더 나아가 같은 hidden state를 gate branch와 value branch로 따로 projection한 뒤 element-wise로 곱습니다. 이름을 나열하기 전에 무엇이 값이고 무엇이 문인지부터 봅니다.</p>
      <ActivationFamilyFlowViz mode="gates" />
      <ContentBoundary article="gated-activations" />
    </section>

    <section id="gelu-silu" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · smooth self-gate</p><h2 className="mt-2 text-2xl font-bold">GELU와 SiLU는 input을 버리거나 살리는 대신 연속적인 비율로 통과시킨다</h2></header>
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
      <div id="paper-swish"><CitationBlock source="Ramachandran et al. — Searching for Activation Functions" citeKey={2} type="paper" href="https://arxiv.org/abs/1710.05941"><p><strong>문제:</strong> 제한된 수작업 activation 밖에서 유용한 함수를 찾습니다.</p><p><strong>기여:</strong> 자동 탐색으로 Swish 계열을 발견하고 vision architecture에서 비교합니다.</p><p><strong>전제:</strong> 논문의 search space·proxy task·compute 조건입니다.</p><p><strong>근거 범위:</strong> Activation search와 선택된 benchmark입니다.</p><p><strong>말하지 않는 것:</strong> 다른 domain·hardware에서도 자동 최적이라는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="gated-ffn" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · gate와 value branch</p><h2 className="mt-2 text-2xl font-bold">SwiGLU는 scalar activation이 아니라 서로 다른 두 projection을 결합하는 FFN 구조다</h2></header>
      <p>
            Hidden state x는 gate projection Wg와 value projection Wv로 갈라집니다. Gate branch에는 SiLU를 적용하고 value
            branch와 coordinate-wise로 곱은 뒤 Wo로 model dimension에 되돌립니다. 곱셈은 두 branch가 같은 feature 위치에서 모두 동의한 크기만
            통과시키는 결합입니다.
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
      <div id="paper-swiglu"><CitationBlock source="Shazeer — GLU Variants Improve Transformer" citeKey={3} type="paper" href="https://arxiv.org/abs/2002.05202"><p><strong>문제:</strong> Transformer FFN의 activation과 multiplicative gating을 공정한 parameter budget에서 비교합니다.</p><p><strong>기여:</strong> ReGLU·GEGLU·SwiGLU를 T5 계열 pretraining에서 비교합니다.</p><p><strong>전제:</strong> Gated width를 조정한 parameter matching과 논문 recipe입니다.</p><p><strong>근거 범위:</strong> Transformer FFN의 GLU variant 실험입니다.</p><p><strong>말하지 않는 것:</strong> SwiGLU가 scalar activation 하나이거나 모든 architecture의 자동 최적점이라는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="parameter-budget" className="mb-16 scroll-mt-20 space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · fair budget</p><h2 className="mt-2 text-2xl font-bold">Projection이 하나 늘었으므로 같은 width 비교는 공정하지 않다</h2></header>
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
      />
    </section>

    <section id="comparison" className="mb-16 scroll-mt-20 space-y-5">
      <header><p className="text-sm font-semibold text-primary">04 · 선택 경계</p><h2 className="mt-2 text-2xl font-bold">함수 이름보다 branch 구조·parameter·kernel budget을 함께 고정한다</h2></header>
      <p>GELU와 SiLU는 scalar curve 비교이고 SwiGLU는 FFN architecture 비교입니다. 같은 이름표 아래 섞지 말고 model dimension, intermediate width, parameter 수, training tokens, fused-kernel 여부와 end-to-end latency를 같은 artifact에 기록해야 합니다.</p>
      <p>Hard threshold와 saturation의 기초는 <a href="/ai/activation-functions" className="text-primary hover:underline">활성화 함수 기초</a>에서, ReLU의 dead path와 negative slope는 <a href="/ai/rectifier-activations" className="text-primary hover:underline">rectifier 글</a>에서 연결됩니다.</p>
    </section>
  </article>;
}
