import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import QuantileBalancingViz from "./viz/QuantileBalancingViz";
import StableLatentMoeViz from "./viz/StableLatentMoeViz";

export default function StableLatentMoe() {
  return (
    <section id="stable-latent-moe" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Width: shared path는 full width를 유지하고 routed expert만 latent width로 내린다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Conventional MoE에서는 선택된 expert마다 model hidden 전체를 처리하므로 active expert 수를 늘릴수록 expert weight traffic과 dispatch payload도 커집니다. LatentMoE는 모든 token이 쓰는 shared expert를 7,168 full width에 남기고, routed path만 3,584 latent width로 내립니다. K3는 이 작은 공간에서 896개 routed expert 가운데 16개를 선택한 뒤 결과를 다시 full width로 올립니다.
        </p>
        <p className="leading-8">
          Expert·router·Top-k와 total/active parameter의 일반적인 계산은 <Link to="/ai/mixture-of-experts">Mixture-of-Experts 정본</Link>에서 다룹니다. 여기서 중요한 K3 고유 설계는 routed width를 절반으로 줄인 경로, 그 경로의 scale variation을 잡는 RMSNorm, activation outlier를 제한하는 SiTU-GLU, 896개 expert의 load를 맞추는 Quantile Balancing입니다.
        </p>
      </div>

      <StableLatentMoeViz />

      <ExplainedFormula
        question="Full-width shared expert와 latent-width routed expert의 결과를 어떻게 같은 hidden space에서 합치는가?"
        idea={<>Shared expert는 x를 직접 처리하고, routed path는 Wdown으로 latent에 내린 뒤 Top-k expert 출력을 합칩니다. Routed aggregate를 RMSNorm으로 정리하고 Wup으로 full width에 복원해 두 경로를 더합니다.</>}
        formula={String.raw`\begin{aligned}
u&=\sum_{i\in T_k(x)}p_iE_i^{\mathrm{routed}}(W_{\downarrow}x)\\
y&=\sum_{j=1}^{N_s}E_j^{\mathrm{shared}}(x)+W_{\uparrow}\operatorname{RMSNorm}(u)
\end{aligned}`}
        terms={[
          { symbol: String.raw`x\in\mathbb R^d`, name: "full-width token state", description: "K3에서는 d=7,168인 model hidden vector입니다." },
          { symbol: String.raw`W_{\downarrow},W_{\uparrow}`, name: "down·up projection", description: "Full width d와 routed latent width ℓ=3,584 사이를 오갑니다." },
          { symbol: String.raw`E_i^{\mathrm{routed}}`, name: "routed expert", description: "Latent space에서 동작하며 896개 중 k=16개가 선택됩니다." },
          { symbol: String.raw`E_j^{\mathrm{shared}}`, name: "shared expert", description: "Full width에서 모든 token이 계산하는 Ns=2개 expert입니다." },
          { symbol: "u,y", name: "latent aggregate·layer output", description: "선택된 routed result의 합과 full-width shared+routed 최종 output입니다." },
        ]}
        assumptions={[
          "Router weight p와 Top-k selection의 일반 정의는 MoE 정본을 따릅니다.",
          "각 routed expert 내부 hidden dimension 3,072와 SiTU-GLU branch 세부는 이 축약식에서 생략했습니다.",
          "RMSNorm은 u의 scale을 정리하지만 expert 선택 오류나 load imbalance를 해결하지는 않습니다.",
        ]}
        interpretation="Routed communication과 expert input width는 full hidden의 절반으로 줄지만, shared expert와 down/up projection이 새 비용으로 남습니다. 따라서 latent ratio만으로 end-to-end latency를 결정할 수 없습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Stable이라는 이름은 압축 자체보다 압축 뒤의 세 실패 지점을 가리킨다</h3>
        <p className="leading-8">
          Routed branch는 down projection, gated expert의 여러 projection, up projection이 연속되는 긴 matrix chain입니다. 2.8T scale과 low-precision training에서는 selected expert와 routing weight에 따라 내부 scale이 크게 흔들리고 activation outlier가 커질 수 있습니다. K3는 routed aggregate 뒤 RMSNorm을 넣고, SwiGLU의 두 unbounded factor를 soft cap한 SiTU-GLU를 사용합니다.
        </p>
      </div>

      <ExplainedFormula
        question="SwiGLU와 비슷한 0 근처 모양을 유지하면서 큰 activation product를 어떻게 제한하는가?"
        idea={<>Gate branch와 up branch의 linear factor에 각각 scaled tanh soft cap을 적용합니다. Sigmoid gate는 유지하므로 작은 값에서는 SwiGLU와 비슷하게 움직이고 큰 값에서는 두 factor가 β1·β2 안에 머뭅니다.</>}
        formula={String.raw`\operatorname{SiTU\!\text{-}GLU}(x)=\left[\beta_1\tanh\!\left(\frac{W_gx}{\beta_1}\right)\odot\sigma(W_gx)\right]\odot\left[\beta_2\tanh\!\left(\frac{W_ux}{\beta_2}\right)\right]`}
        terms={[
          { symbol: "W_gx", name: "gate branch preactivation", description: "Sigmoid gate와 첫 soft-capped linear factor를 함께 만듭니다." },
          { symbol: "W_ux", name: "up branch preactivation", description: "두 번째 soft-capped value factor입니다." },
          { symbol: String.raw`\beta_1=4`, name: "gate soft cap", description: "Gate branch linear factor의 최대 절댓값 scale입니다." },
          { symbol: String.raw`\beta_2=25`, name: "up soft cap", description: "Up branch factor의 최대 절댓값 scale입니다." },
          { symbol: String.raw`\odot`, name: "element-wise product", description: "같은 coordinate끼리 gate와 value factor를 곱합니다." },
        ]}
        assumptions={[
          "각 coordinate의 scalar response를 element-wise로 확장한 식입니다.",
          "Scaled tanh는 0 근처에서 거의 linear하지만 큰 절댓값에서는 포화합니다.",
          "β1β2=100 bound는 activation coordinate의 구조적 상한이며 전체 vector norm이나 training stability의 충분조건은 아닙니다.",
        ]}
        interpretation="SwiGLU의 양수 방향 성장 특성을 작은 값에서 근사하면서 큰 coordinate의 곱은 절댓값 100 이내로 제한합니다. 그 대가로 포화 영역의 gradient와 표현 범위가 달라집니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Quantile Balancing은 router loss가 아니라 다음 batch의 dispatch bias를 계산한다</h3>
        <p className="leading-8">
          K3 router는 sigmoid score에 expert별 bias를 더해 Top-k index를 고릅니다. 그러나 선택된 expert의 mixture weight는 bias를 뺀 원 score만으로 정규화합니다. 따라서 bias는 어느 expert가 cutoff를 넘는지만 조절하고, language-model loss가 학습하는 router score와 output mixture를 직접 왜곡하지 않도록 분리됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="Dispatch를 균형 있게 고치면서 expert output의 mixture weight에서 bias를 제외하려면 어떻게 계산하는가?"
        idea={<>Top-k index는 score+bias로 고르되, 선택 뒤 weight는 raw sigmoid score만 다시 정규화합니다. Bias는 줄을 배정하는 신호이고 expert 결과의 기여도는 아닙니다.</>}
        formula={String.raw`s_i=\sigma(W_rx_i),\qquad T_i=\operatorname{argtopk}(s_i+b),\qquad p_{i,j}=\frac{s_{i,j}}{\sum_{r\in T_i}s_{i,r}}\;(j\in T_i)`}
        terms={[
          { symbol: "s_i", name: "raw router score", description: "Token i에 대해 sigmoid로 만든 expert별 0과 1 사이 score입니다." },
          { symbol: "b", name: "dispatch bias", description: "Expert load를 조절하기 위해 Top-k 순위에만 더하는 expert별 값입니다." },
          { symbol: "T_i", name: "selected expert set", description: "Biased score가 큰 16개 routed expert index입니다." },
          { symbol: "p_{i,j}", name: "mixture weight", description: "선택된 raw score만 합이 1이 되게 정규화한 output weight입니다." },
        ]}
        assumptions={[
          "K3의 auxiliary-loss-free sigmoid routing rule이며 softmax router와 동일하지 않습니다.",
          "Bias는 training step 사이에 갱신되고 inference에서는 최종 값을 고정합니다.",
          "Score tie와 distributed histogram approximation의 세부 처리는 다음 quantile 식에서 별도입니다.",
        ]}
        interpretation="Bias가 커져 expert가 더 자주 선택돼도 같은 token에서 raw score가 낮다면 mixture 기여가 자동으로 커지지는 않습니다. Selection과 weighting을 분리한 설계입니다."
      />

      <QuantileBalancingViz />

      <ExplainedFormula
        question="Expert마다 다음 batch에서 목표 load q=mk/n개가 cutoff를 넘도록 bias를 한 번에 어떻게 정하는가?"
        idea={<>현재 biased Top-(k+1)의 마지막 score를 token별 cutoff α로 잡습니다. Expert j의 raw score와 cutoff 차이인 margin 분포에서 상위 q개만 양수가 되도록 (1−k/n) quantile의 음수를 다음 bias로 두고, 공통 offset은 평균을 빼 제거합니다.</>}
        formula={String.raw`\begin{aligned}
q&=\frac{mk}{n}\\
\widehat b_j^{(t+1)}&=-\operatorname{Quantile}_{1-k/n}\!\left(s_{:,j}-\alpha^{(t)}\right)\\
b^{(t+1)}&=\widehat b^{(t+1)}-\operatorname{mean}\!\left(\widehat b^{(t+1)}\right)\mathbf 1
\end{aligned}`}
        terms={[
          { symbol: "m,n,k", name: "batch·expert·Top-k", description: "Batch token 수, routed expert 수와 token당 선택 수입니다." },
          { symbol: "q", name: "target load", description: "균등할 때 expert 하나가 받아야 하는 token assignment 수입니다." },
          { symbol: String.raw`\alpha_i^{(t)}`, name: "token cutoff", description: "현재 biased Top-(k+1)에서 token i의 (k+1)번째 score입니다." },
          { symbol: String.raw`s_{:,j}-\alpha^{(t)}`, name: "expert margin sample", description: "Expert j가 각 token의 현재 cutoff를 얼마나 넘는지 모은 값입니다." },
          { symbol: String.raw`\widehat b,b`, name: "raw·centered next bias", description: "Quantile로 구한 bias와 expert 공통 offset을 제거한 실제 다음-step bias입니다." },
        ]}
        assumptions={[
          "Score tie가 없다는 유도 가정에서 정확히 q개 margin이 threshold를 넘습니다.",
          "현재 batch에서 계산한 bias는 causal하게 다음 training step부터 사용하며 자기 batch routing을 다시 쓰지 않습니다.",
          "Global batch의 exact quantile 대신 실제 K3 training은 expert별 margin histogram과 all-reduce로 근사합니다.",
        ]}
        interpretation="고정 step으로 bias를 조금씩 움직이는 대신 현재 margin 분포에서 목표 quantile을 직접 추정합니다. Histogram bin width와 다음 batch의 distribution shift 때문에 실제 load가 매번 정확히 q가 된다는 보장은 없습니다."
      />
    </section>
  );
}
