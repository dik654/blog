import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import {
  EvidenceFields,
  LearningHeader,
  LearningTerm,
} from "../diffusion-shared";
import ContinuousTransportViz from "./ContinuousTransportViz";

export default function ContinuousDiffusionArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section id="reverse-sde" className="space-y-6">
        <LearningHeader
          n="00"
          kicker="먼저 random path를 정의하기"
          title="Reverse-time SDE에는 time reversal뿐 아니라 density 방향이 필요하다"
        />
        <p className="text-lg leading-8">
          <strong>SDE</strong>는 현재 state를 움직이는 평균 방향인 drift와, 매
          순간 새로 들어오는 Brownian randomness를 함께 적는 변화 법칙입니다.
          Forward diffusion이 probability mass를 퍼뜨렸다면, 거꾸로 모으려면
          지금 density가 많은 쪽을 가리키는 score가 필요합니다.
        </p>
        <LearningTerm
          name="Reverse-time SDE"
          shape="forward drift − diffusion²×score + reverse Brownian increment"
          meaning="Terminal noise에서 data distribution 쪽으로 돌아오도록 forward drift를 score로 교정한 stochastic dynamics입니다."
          example="f=0, g=1, score=−2라면 reverse drift correction은 +2 방향입니다."
          boundary="True score와 continuous integration의 이론입니다. Neural score와 finite steps에서는 exact sample 보장이 사라집니다."
        />
        <ContinuousTransportViz />
        <ExplainedFormula
          question="왜 reverse drift에서 score에 g(t)²을 곱해 빼야 할까요?"
          idea="Forward diffusion이 g² scale로 density를 퍼뜨린 만큼, reverse process는 현재 density gradient를 같은 variance rate로 사용해 probability current를 되돌려야 합니다."
          formula={String.raw`d x_t=\left[f(x_t,t)-g(t)^2\nabla_x\log p_t(x_t)\right]dt+g(t)d\bar W_t`}
          annotatedFormula={String.raw`\begin{aligned}
b_{\rm rev}&=\underbrace{f-g^2\nabla_x\log p_t}_{\substack{\text{forward drift에서}\text{score correction을 뺌}}}\\
n_t&=\underbrace{g\,d\bar W_t}_{\text{reverse random increment}}\\
d x_t&=\underbrace{b_{\rm rev}dt+n_t}_{\text{drift와 randomness를 합성}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`g(t)^2\nabla_x\log p_t(x_t)`,
              annotation: [
                "density 상승 방향을 diffusion variance rate로 scale해",
                "forward spreading을 되돌릴 correction 생성",
              ],
            },
            {
              expression: String.raw`f-g^2\nabla\log p_t`,
              annotation: [
                "forward drift에서 score correction을 빼",
                "reverse probability current 구성",
              ],
            },
            {
              expression: String.raw`g(t)d\bar W_t`,
              annotation: [
                "reverse time에도 Brownian increment를 더해",
                "한 marginal 안의 stochastic path sampling",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`f`,
              name: "Forward drift",
              description: "Forward SDE의 deterministic velocity입니다.",
            },
            {
              symbol: String.raw`g`,
              name: "Diffusion coefficient",
              description: "Brownian noise의 instantaneous scale입니다.",
            },
            {
              symbol: String.raw`p_t`,
              name: "Perturbed marginal",
              description:
                "Time t에서 모든 data origin을 평균한 density입니다.",
            },
          ]}
          assumptions={[
            "SDE와 density가 reverse-time theorem의 regularity를 만족합니다.",
            "Sampling은 terminal prior에서 t=T→0 방향으로 수행합니다.",
          ]}
          interpretation="Score를 0으로 두면 퍼진 mass를 modes로 모을 정보가 없어 forward drift의 부호만 바꾸는 것으로는 부족합니다."
        />
      </section>

      <section id="probability-flow" className="space-y-6">
        <LearningHeader
          n="01"
          kicker="Randomness를 velocity로 옮기기"
          title="Probability-flow ODE는 같은 marginal을 deterministic path로 운반한다"
        />
        <LearningTerm
          name="Probability-flow ODE"
          shape="drift = f − ½g² score · Brownian term 없음"
          meaning="SDE의 diffusion effect를 deterministic velocity에 옮겨 각 time의 density evolution을 맞춘 ODE입니다."
          example="Reverse SDE의 score coefficient가 −g²이면 probability-flow ODE는 −g²/2입니다."
          boundary="같은 것은 time marginal입니다. 같은 initial noise에서 particle trajectory와 finite-step sample이 같은 것은 아닙니다."
        />
        <ExplainedFormula
          question="왜 ODE에서는 score correction이 절반이고 Brownian term이 사라질까요?"
          idea="SDE의 density 변화에는 drift가 운반하는 항과 diffusion이 퍼뜨리는 항이 함께 있습니다. Deterministic continuity equation 하나로 같은 density 변화를 만들려면 diffusion contribution의 절반을 score velocity로 옮깁니다."
          formula={String.raw`\frac{d x_t}{dt}=f(x_t,t)-\frac{1}{2}g(t)^2\nabla_x\log p_t(x_t)`}
          annotatedFormula={String.raw`\begin{aligned}
c_t&=\underbrace{\frac12 g(t)^2\nabla_x\log p_t}_{\substack{\text{diffusion effect를}\text{score velocity로 변환}}}\\
v_t&=\underbrace{f(x_t,t)-c_t}_{\text{deterministic flow field}}\\
\frac{d x_t}{dt}&=\underbrace{v_t}_{\text{Brownian term 없는 path}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\frac12 g(t)^2\nabla_x\log p_t`,
              annotation: [
                "diffusion variance가 만든 density flux를",
                "ODE velocity에 필요한 절반 score correction으로 변환",
              ],
            },
            {
              expression: String.raw`f-\frac12g^2\nabla\log p_t`,
              annotation: [
                "두 deterministic velocity를 합쳐",
                "같은 time marginal을 운반할 field 정의",
              ],
            },
            {
              expression: String.raw`dx_t/dt`,
              annotation: [
                "Brownian increment 없이 derivative만 적어",
                "initial state가 정해지면 deterministic한 path 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`dx_t/dt`,
              name: "Probability-flow velocity",
              description:
                "한 particle을 deterministic하게 움직이는 instantaneous velocity입니다.",
            },
          ]}
          assumptions={[
            "Score와 density가 continuity·Fokker–Planck 변환에 충분히 regular합니다.",
            "Exact continuous dynamics의 marginal equality와 finite solver를 구분합니다.",
          ]}
          interpretation="SDE와 ODE는 분포 snapshot을 공유할 수 있지만, SDE에는 계속 randomness가 들어오므로 pathwise equality는 없습니다."
        />
        <LearningTerm
          name="DDIM = probability-flow ODE의 discrete Euler step"
          shape="x_{t-1} = sqrt(a_{t-1}) * x0_hat(x_t) + sqrt(1-a_{t-1}) * eps_theta(x_t,t)"
          meaning="DDPM 논문 이후 나온 DDIM(Song et al. 2020)은 위 probability-flow ODE를 유한 step으로 discretize한 deterministic sampler입니다. 매 step 같은 noise z를 다시 뽑지 않고, x0를 먼저 추정한 뒤 그 추정치를 다음 noise level로 다시 옮깁니다."
          example="x0_hat(x_t) = (x_t - sqrt(1-a_t) * eps_theta(x_t,t)) / sqrt(a_t)로 x0를 먼저 복원하고, 그 값을 t-1 시점의 forward 식에 다시 대입해 x_{t-1}을 만듭니다."
          boundary="DDPM의 확률적 sampling(위 Sampling 알고리즘)은 매 step 새 noise z를 더하지만, DDIM은 z=0인 극한이라 같은 x_T에서 항상 같은 x0가 나옵니다 - 그래서 step 수를 크게 줄여도(T=1000 대신 50) 품질이 덜 떨어집니다."
        />
      </section>

      <section id="flow-matching" className="space-y-6">
        <LearningHeader
          n="02"
          kicker="Score 대신 velocity를 직접 가르치기"
          title="Flow matching은 선택한 probability path의 움직임을 regression한다"
        />
        <LearningTerm
          name="Conditional flow-matching objective"
          shape="endpoint pair → conditional path xₜ → target velocity uₜ"
          meaning="계산하기 쉬운 conditional path의 velocity를 target으로 주고, network가 같은 location에서 가능한 velocity의 conditional mean을 배우게 하는 방법입니다."
          example="직선 path xₜ=(1−t)x₀+tx₁의 target velocity는 u=x₁−x₀입니다."
          boundary="Path와 endpoint coupling은 설계 선택입니다. Score-SDE objective와 자동으로 같은 식이나 같은 trajectory가 아닙니다."
        />
        <ExplainedFormula
          question="왜 endpoint를 직선으로 보간하면 target velocity가 x₁−x₀가 될까요?"
          idea="Time t의 coefficient만 미분합니다. x₀의 coefficient는 −1, x₁의 coefficient는 +1이므로 두 endpoint의 displacement가 일정한 velocity가 됩니다."
          formula={String.raw`x_t=(1-t)x_0+t x_1,\qquad u_t=\frac{d x_t}{dt}=x_1-x_0`}
          annotatedFormula={String.raw`\begin{aligned}
a_t&=\underbrace{(1-t)x_0}_{\text{출발점 비중을 줄임}}\\
b_t&=\underbrace{t x_1}_{\text{도착점 비중을 늘림}}\\
x_t&=\underbrace{a_t+b_t}_{\text{직선 위 중간 state}}\\
u_t&=\underbrace{\frac{d x_t}{dt}=x_1-x_0}_{\text{일정한 endpoint displacement}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`(1-t)x_0+t x_1`,
              annotation: [
                "두 endpoint에 합이 1인 비중을 줘",
                "중간 state를 직선 위에 배치",
              ],
            },
            {
              expression: String.raw`d x_t/dt`,
              annotation: [
                "path의 time 변화율을 구해",
                "network가 맞힐 instantaneous velocity 생성",
              ],
            },
            {
              expression: String.raw`x_1-x_0`,
              annotation: [
                "도착점에서 출발점을 빼",
                "직선 전체에서 일정한 이동 방향 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_0,x_1`,
              name: "Coupled endpoints",
              description: "선택한 source와 target sample pair입니다.",
            },
            {
              symbol: String.raw`u_t`,
              name: "Conditional velocity",
              description:
                "그 endpoint pair의 path를 움직이는 target field입니다.",
            },
          ]}
          assumptions={[
            "Endpoint coupling과 interpolation path를 명시합니다.",
            "Path가 differentiable하고 target velocity를 계산할 수 있습니다.",
          ]}
          interpretation="Squared-error optimum은 E[uₜ|xₜ,t]입니다. 따라서 여러 endpoint pair가 같은 xₜ를 지날 때 velocity가 posterior-average됩니다."
        />
      </section>

      <section id="solver-budget" className="space-y-6">
        <LearningHeader
          n="03"
          kicker="Continuous field를 finite compute로 실행하기"
          title="Learned field와 solver는 서로 다른 error와 비용을 소유한다"
        />
        <LearningTerm
          name="Learned-field solver contract"
          shape="trained field + time grid + update rule + tolerance → finite sample"
          meaning="Continuous dynamics를 실제 tensor update로 바꾸는 time grid·solver·precision·error budget의 실행 계약입니다."
          example="Euler 20 step은 보통 20 NFE, Heun 10 step은 predictor·corrector로 20 NFE가 됩니다."
          boundary="Higher-order solver가 learned-field approximation error까지 제거하지 않으며, 같은 NFE가 같은 wall-clock을 뜻하지 않습니다."
        />
        <LearningTerm
          name="Network function evaluations (NFE)"
          shape="비싼 denoiser·score·velocity network의 실제 호출 횟수"
          meaning="Sampler step이라는 이름 대신 learned field를 몇 번 평가했는지 세는 model-call budget입니다."
          example="Heun 4 step은 보통 8 NFE입니다. CFG 두 branch를 따로 실행하면 실제 compute ledger를 추가로 적어야 합니다."
          boundary="Network size·resolution·batch·precision·kernel이 다르면 NFE만으로 latency를 비교할 수 없습니다."
        />
        <ExplainedFormula
          question="왜 sample error를 solver error 하나로 부르지 않고 field·discretization·compute 항으로 나눌까요?"
          idea="더 작은 step은 numerical approximation을 개선하지만 잘못 학습한 velocity를 고치지 않습니다. 반대로 정확한 field도 너무 거친 solver에서는 trajectory를 놓칩니다."
          formula={String.raw`E_{\rm sample}\ \lesssim\ E_{\rm field}+E_{\rm discretization}(h,p),\qquad C_{\rm model}=\mathrm{NFE}\times C_{\rm call}`}
          annotatedFormula={String.raw`\begin{aligned}
e_f&=\underbrace{E_{\rm field}}_{\text{learned direction error}}\\
e_h&=\underbrace{E_{\rm discretization}(h,p)}_{\text{finite solver error}}\\
E_{\rm sample}&\lesssim\underbrace{e_f+e_h}_{\text{두 error source를 분리 합산}}\\
C_{\rm model}&=\underbrace{\mathrm{NFE}\times C_{\rm call}}_{\text{호출 수와 호출당 비용을 곱함}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`E_{\rm field}+E_{\rm discretization}`,
              annotation: [
                "학습 오차와 적분 오차를 더해",
                "sample mismatch의 서로 다른 원인을 분리",
              ],
            },
            {
              expression: String.raw`E_{\rm discretization}(h,p)`,
              annotation: [
                "step size와 solver order를 넣어",
                "finite integration error의 조건 기록",
              ],
            },
            {
              expression: String.raw`\mathrm{NFE}\times C_{\rm call}`,
              annotation: [
                "호출 횟수에 호출당 비용을 곱해",
                "model evaluation compute ledger 구성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`h`,
              name: "Step size",
              description: "Time grid의 한 update 간격입니다.",
            },
            {
              symbol: String.raw`p`,
              name: "Solver order",
              description:
                "Smooth exact field에서 local approximation이 좋아지는 차수입니다.",
            },
          ]}
          assumptions={[
            "Error bound의 norm·regularity·time interval을 명시합니다.",
            "NFE 외 memory movement와 scheduler overhead는 별도로 측정합니다.",
          ]}
          interpretation="20-step Euler와 10-step Heun이 둘 다 20 NFE여도 trajectory error와 wall-clock은 같다고 결론 낼 수 없습니다."
        />
        <div id="paper-score-sde">
          <CitationBlock
            source="Song et al. · Score-Based Generative Modeling through SDEs"
            citeKey={1}
            href="https://arxiv.org/abs/2011.13456"
          >
            <EvidenceFields
              problem="Discrete score model을 continuous dynamics와 solver로 통합하는 문제"
              contribution="Forward·reverse SDE, predictor-corrector와 probability-flow ODE"
              assumptions="SDE regularity·true score와 neural approximation·finite solver 구분"
              scope="논문의 image generation·likelihood·inverse-problem experiments"
              notClaim="SDE·ODE path가 같거나 finite NFE에서 exact sample을 보장하지 않음"
            />
          </CitationBlock>
        </div>
        <div id="paper-flow-matching">
          <CitationBlock
            source="Lipman et al. · Flow Matching for Generative Modeling"
            citeKey={2}
            href="https://arxiv.org/abs/2210.02747"
          >
            <EvidenceFields
              problem="Continuous normalizing flow를 ODE simulation 없이 학습하는 문제"
              contribution="Conditional path velocity regression과 marginal vector-field 연결"
              assumptions="Tractable path·velocity·coupling과 논문의 setup"
              scope="Diffusion·OT path likelihood와 sample comparison"
              notClaim="임의 path가 같은 straightness·quality·NFE를 보장하지 않음"
            />
          </CitationBlock>
        </div>
        <div data-viz="continuous-diffusion-concepts">
          <ConceptLadderViz
            title="Continuous generation의 개념 조합"
            description="먼저 dynamics를 분리하고, 마지막에 finite solver 비용을 붙입니다."
            steps={[
              { label: "Random", detail: "reverse SDE와 score correction" },
              {
                label: "Deterministic",
                detail: "same-marginal probability-flow ODE",
              },
              {
                label: "Direct field",
                detail: "conditional velocity regression",
              },
              { label: "Execute", detail: "solver error와 NFE ledger" },
            ]}
          />
        </div>
        <ContentBoundary article="diffusion-continuous-time" />
      </section>
    </article>
  );
}
