import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import {
  EvidenceFields,
  LearningHeader,
  LearningTerm,
} from "../diffusion-shared";
import DiffusionTrainingViz from "./DiffusionTrainingViz";

export default function DiffusionFoundationsArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section id="corruption" className="space-y-6">
        <LearningHeader
          n="00"
          kicker="먼저 두 과정을 분리하기"
          title="Diffusion training은 원본을 끝까지 망가뜨리는 loop가 아니다"
        />
        <p className="text-lg leading-8">
          먼저 <strong>training pair</strong> 하나만 봅니다. 원본{" "}
          <code>x₀</code>, noise level <code>t</code>, Gaussian noise{" "}
          <code>ε</code>를 뽑아 noisy input <code>xₜ</code>를 만듭니다.
          Network는 이 한 장에서 target을 예측합니다. 반면 생성할 때는 noise에서
          시작해 같은 network를 여러 번 부릅니다.
        </p>
        <LearningTerm
          name="Diffusion training–sampling contract"
          shape="training: (x₀,t,ε)→xₜ→target · sampling: xT→…→x₀"
          meaning="학습용 noisy pair 생성과 inference의 iterative reverse update를 서로 다른 algorithm으로 기록하는 경계입니다."
          example="Training batch에서는 t=700인 xₜ를 한 번에 만들지만, sampling에서는 30개의 solver step을 순서대로 실행할 수 있습니다."
          boundary="논문의 forward step 수 T, sampler step 수, 실제 network 호출 수 NFE는 서로 같은 숫자라고 가정하지 않습니다."
        />
        <DiffusionTrainingViz />
        <LearningTerm
          name="Gaussian forward diffusion"
          shape="이전 signal을 조금 줄이고 independent Gaussian noise를 더함"
          meaning="Data sample을 단계별로 simple Gaussian prior 쪽에 보내도록 학습 전에 고정하는 corruption process입니다."
          example="βₜ=0.01이면 이전 state의 scale은 √0.99, 새 noise variance는 0.01입니다."
          boundary="실제 camera noise를 관측한 물리 model이 아니라 생성 학습을 위해 설계한 Markov process일 수 있습니다."
        />
        <ExplainedFormula
          question="한 forward step에서 왜 이전 state에는 √(1−βₜ), noise에는 √βₜ를 곱할까요?"
          idea="두 independent 항의 variance가 각각 1−βₜ와 βₜ가 되게 만들어 전체 scale을 보존하면서 signal을 조금 줄이고 noise를 조금 늘립니다."
          formula={String.raw`x_t=\sqrt{1-\beta_t}\,x_{t-1}+\sqrt{\beta_t}\,\epsilon_t`}
          annotatedFormula={String.raw`\begin{aligned}
s_t&=\underbrace{\sqrt{1-\beta_t}\,x_{t-1}}_{\substack{\text{이전 signal을}\text{남긴 항}}}\\
n_t&=\underbrace{\sqrt{\beta_t}\,\epsilon_t}_{\substack{\text{새 Gaussian}\text{noise 항}}}\\
x_t&=\underbrace{s_t+n_t}_{\text{두 contribution을 합성}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sqrt{1-\beta_t}\,x_{t-1}`,
              annotation: [
                "이전 state에 남길 variance를 정해",
                "signal contribution 계산",
              ],
            },
            {
              expression: String.raw`\sqrt{\beta_t}\,\epsilon_t`,
              annotation: [
                "standard Gaussian을 noise scale로 늘려",
                "이번 step의 independent corruption 생성",
              ],
            },
            {
              expression: String.raw`\text{signal}+\text{noise}`,
              annotation: ["독립인 두 항을 더해", "다음 noisy state 구성"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\beta_t`,
              name: "Noise variance increment",
              description: "Timestep t에서 새로 넣는 noise variance입니다.",
            },
            {
              symbol: String.raw`\epsilon_t`,
              name: "Standard Gaussian noise",
              description: "평균 0, variance 1인 independent sample입니다.",
            },
          ]}
          assumptions={[
            "εₜ는 xₜ₋₁과 independent한 standard Gaussian입니다.",
            "0<βₜ<1이며 isotropic scalar schedule을 사용합니다.",
          ]}
          interpretation="βₜ는 denoiser가 학습하는 weight가 아니라 training pair의 난이도를 정하는 schedule입니다."
        />
      </section>

      <section id="schedule" className="space-y-6">
        <LearningHeader
          n="01"
          kicker="여러 step을 한 식으로 접기"
          title="Cumulative schedule은 임의 noise level을 한 번에 만든다"
        />
        <LearningTerm
          name="Cumulative noise schedule"
          shape="αₜ=1−βₜ · ᾱₜ=∏ₛ₌₁ᵗαₛ"
          meaning="각 step에서 남긴 signal variance 비율을 곱해, 원본 signal이 timestep t까지 얼마나 남았는지 나타냅니다."
          example="β₁=0.1, β₂=0.2면 ᾱ₂=0.9×0.8=0.72이고 noise variance는 0.28입니다."
          boundary="Gaussian family가 합성에 닫혀 있기 때문에 가능한 closed form입니다. 임의의 corruption에서 같은 식이 나오지 않습니다."
        />
        <ExplainedFormula
          question="왜 α를 여러 번 곱하고, 마지막 noise scale에는 √(1−ᾱₜ)를 쓸까요?"
          idea="매 step 남는 signal variance 비율을 모두 곱하면 원본이 남긴 총 variance가 됩니다. 전체 unit variance에서 그 몫을 빼면 누적 noise variance가 됩니다."
          formula={String.raw`\bar\alpha_t=\prod_{s=1}^{t}(1-\beta_s),\qquad x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon`}
          annotatedFormula={String.raw`\begin{aligned}
\bar\alpha_t&=\underbrace{\prod_{s=1}^{t}(1-\beta_s)}_{\substack{\text{signal retention}\text{누적 곱}}}\\
s_t&=\underbrace{\sqrt{\bar\alpha_t}x_0}_{\text{원본 signal 항}}\\
n_t&=\underbrace{\sqrt{1-\bar\alpha_t}\epsilon}_{\text{누적 noise 항}}\\
x_t&=\underbrace{s_t+n_t}_{\text{두 항을 합성}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\prod_{s=1}^{t}(1-\beta_s)`,
              annotation: [
                "각 step의 signal retention을 곱해",
                "t까지 남은 총 signal variance 계산",
              ],
            },
            {
              expression: String.raw`1-\bar\alpha_t`,
              annotation: [
                "unit total variance에서 signal 몫을 빼",
                "누적 noise variance 계산",
              ],
            },
            {
              expression: String.raw`\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon`,
              annotation: [
                "signal과 noise의 standard deviation-scaled 항을 더해",
                "중간 transition 없이 noisy state 직접 sampling",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\bar\alpha_t`,
              name: "Cumulative signal variance",
              description: "원본 variance가 timestep t까지 남는 비율입니다.",
            },
            {
              symbol: String.raw`x_t`,
              name: "Noisy state",
              description: "선택한 noise level에서 network가 받는 input입니다.",
            },
          ]}
          assumptions={[
            "Forward transition이 independent isotropic Gaussian입니다.",
            "x₀와 ε를 독립으로 sampling합니다.",
          ]}
          interpretation="ᾱₜ=0.64이면 signal scale은 0.8, noise scale은 0.6입니다. x₀=2, ε=−1이면 xₜ=1.0입니다."
        />
      </section>

      <section id="target" className="space-y-6">
        <LearningHeader
          n="02"
          kicker="Network가 맞힐 양을 고르기"
          title="같은 noisy state라도 prediction target이 optimization을 바꾼다"
        />
        <LearningTerm
          name="Diffusion prediction target"
          shape="ε prediction · x₀ prediction · v prediction · score prediction"
          meaning="Network output이 어떤 물리량을 직접 근사할지와 noise level별 loss weighting을 함께 고정하는 training contract입니다."
          example="ε̂를 얻으면 x̂₀=(xₜ−σₜε̂)/αₜ로 바꿀 수 있지만 αₜ가 작으면 prediction error도 1/αₜ만큼 증폭됩니다."
          boundary="두 target이 algebraically convertible해도 finite precision, weighting, network capacity에서 같은 학습 문제가 되지는 않습니다."
        />
        <LearningTerm
          name="Diffusion backbone contract"
          shape="(noisy tensor, time, optional condition) → same-shaped target"
          meaning="U-Net·DiT 같은 backbone 이름보다 먼저 고정해야 하는 tensor interface입니다."
          example="B×4×64×64 latent와 timestep B, text B×L×D를 받아 B×4×64×64 ε̂를 냅니다."
          boundary="모든 diffusion이 U-Net이나 cross-attention을 쓰지 않습니다. Architecture는 contract 구현 중 하나입니다."
        />
        <ExplainedFormula
          question="왜 prediction error를 data·time·noise 전체에서 평균할까요?"
          idea="Network는 특정 image나 한 noise level만 복원하는 함수가 아니라, data distribution과 모든 sampled difficulty에서 재사용되는 denoiser여야 합니다."
          formula={String.raw`\mathcal L_\epsilon(\theta)=\mathbb E_{x_0,t,\epsilon}\left[\left\|\epsilon-\epsilon_\theta(x_t,t)\right\|_2^2\right]`}
          annotatedFormula={String.raw`\begin{aligned}
r&=\underbrace{\epsilon-\epsilon_\theta(x_t,t)}_{\text{정답과 prediction의 residual}}\\
e&=\underbrace{\lVert r\rVert_2^2}_{\text{residual square magnitude}}\\
\mathcal L_\epsilon(\theta)&=\underbrace{\mathbb E_{x_0,t,\epsilon}[e]}_{\substack{\text{data·time·noise를}\text{sampling해 평균}}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\epsilon-\epsilon_\theta(x_t,t)`,
              annotation: [
                "주입한 정답 noise에서 prediction을 빼",
                "sample별 residual 생성",
              ],
            },
            {
              expression: String.raw`\|\epsilon-\widehat\epsilon\|_2^2`,
              annotation: [
                "residual 성분을 제곱·합해",
                "방향 없는 positive error 계산",
              ],
            },
            {
              expression: String.raw`\mathbb E_{x_0,t,\epsilon}[\cdot]`,
              annotation: [
                "data·time·noise에 걸쳐 평균해",
                "전체 training objective 정의",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\epsilon_\theta`,
              name: "Noise predictor",
              description:
                "Noisy input과 time을 읽어 added noise를 예측합니다.",
            },
            {
              symbol: String.raw`t`,
              name: "Noise level",
              description: "Schedule에서 sampling한 복원 난이도입니다.",
            },
          ]}
          assumptions={[
            "Training에서 실제 ε를 알고 있습니다.",
            "Sampling distribution과 loss weighting을 명시합니다.",
          ]}
          interpretation="Loss가 낮다는 사실은 특정 sampler·NFE에서 sample quality가 자동으로 좋다는 뜻이 아닙니다."
        />
      </section>

      <section id="score" className="space-y-6">
        <LearningHeader
          n="03"
          kicker="Noise prediction을 방향장으로 읽기"
          title="Gaussian score는 현재 point를 conditional center 쪽으로 가리킨다"
        />
        <LearningTerm
          name="Gaussian noise–score identity"
          shape="conditional score = −ε / noise standard deviation"
          meaning="Gaussian log density를 noisy coordinate로 미분하면 현재 point가 conditional center에서 벗어난 방향의 반대쪽 화살표를 얻습니다."
          example="σₜ=0.5, ε=2이면 conditional score는 −4입니다."
          boundary="Marginal score는 xₜ가 주어졌을 때 가능한 x₀들의 posterior average이며 한 pair의 conditional score와 같지 않습니다."
        />
        <ExplainedFormula
          question="왜 score에서 added noise에 minus를 붙이고 σₜ로 나눌까요?"
          idea="Gaussian log density는 center에서 멀수록 quadratic하게 작아집니다. 미분하면 center에서 벗어난 displacement의 반대 방향이 나오고, variance로 나눠 noise level에 맞는 크기로 정규화됩니다."
          formula={String.raw`\nabla_{x_t}\log q(x_t\mid x_0)=-\frac{x_t-\alpha_t x_0}{\sigma_t^2}=-\frac{\epsilon}{\sigma_t}`}
          annotatedFormula={String.raw`\begin{aligned}
d_t&=\underbrace{x_t-\alpha_t x_0}_{\text{center에서 벗어난 displacement}}\\
s_t&=\underbrace{-\frac{d_t}{\sigma_t^2}}_{\substack{\text{방향을 뒤집고}\text{variance로 정규화}}}\\
&=\underbrace{-\frac{\epsilon}{\sigma_t}}_{\text{noise-scale score}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`x_t-\alpha_t x_0`,
              annotation: [
                "noisy point에서 conditional center를 빼",
                "현재 displacement 계산",
              ],
            },
            {
              expression: String.raw`-(x_t-\alpha_t x_0)`,
              annotation: [
                "displacement 방향을 뒤집어",
                "density가 커지는 center 방향 생성",
              ],
            },
            {
              expression: String.raw`-\epsilon/\sigma_t`,
              annotation: [
                "displacement를 noise standard deviation으로 나눠",
                "noise level에 맞춘 score scale 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`q(x_t\mid x_0)`,
              name: "Conditional perturbation density",
              description:
                "한 clean sample에서 noisy state가 나올 density입니다.",
            },
            {
              symbol: String.raw`\nabla_{x_t}\log q`,
              name: "Conditional score",
              description:
                "Noisy coordinate에서 log density가 가장 빨리 증가하는 방향입니다.",
            },
          ]}
          assumptions={[
            "Conditional perturbation이 Gaussian입니다.",
            "σₜ>0이며 x₀를 조건으로 고정합니다.",
          ]}
          interpretation="Noise predictor는 known scale 변환을 통해 score field를 제공하지만, finite network error와 marginal averaging은 별도입니다."
        />
        <div id="paper-ddpm">
          <CitationBlock
            source="Ho et al. · Denoising Diffusion Probabilistic Models"
            citeKey={1}
            href="https://arxiv.org/abs/2006.11239"
          >
            <EvidenceFields
              problem="Tractable forward noising과 learned reverse process로 sample을 생성하는 문제"
              contribution="Gaussian chain·variational bound·denoising score matching과 simplified noise prediction 연결"
              assumptions="논문의 Gaussian schedule·parameterization·U-Net·sampling setup"
              scope="CIFAR-10·LSUN likelihood·FID와 reported sample 범위"
              notClaim="모든 diffusion이 1,000 step·동일 U-Net·동일 target을 사용한다는 뜻이 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-unet">
          <CitationBlock
            source="Ronneberger et al. · U-Net"
            citeKey={2}
            href="https://arxiv.org/abs/1505.04597"
          >
            <EvidenceFields
              problem="Context와 precise localization을 함께 얻는 segmentation 문제"
              contribution="Contracting·expanding path와 same-scale long skip"
              assumptions="원 biomedical segmentation architecture"
              scope="논문의 microscopy datasets와 reported segmentation"
              notClaim="원 U-Net이 timestep·attention을 포함한 diffusion backbone과 동일하지 않음"
            />
          </CitationBlock>
        </div>
        <div data-viz="diffusion-foundation-concepts">
          <ConceptLadderViz
            title="Discrete diffusion의 최소 개념 사다리"
            description="두 process를 분리하고, Gaussian pair를 만든 뒤 target과 score를 연결합니다."
            steps={[
              {
                label: "Contract",
                detail: "training pair와 sampling loop 분리",
              },
              { label: "Corrupt", detail: "Gaussian signal·noise 합성" },
              { label: "Predict", detail: "ε·x₀·v target 선택" },
              { label: "Direction", detail: "noise를 score로 변환" },
            ]}
          />
        </div>
        <p className="leading-7">
          이제 score를 연속시간 dynamics로 옮기는 일은{" "}
          <a
            className="font-semibold text-primary underline"
            href="/ai/diffusion-continuous-time"
          >
            continuous-time diffusion
          </a>
          이 소유합니다.
        </p>
        <ContentBoundary article="diffusion-models" />
      </section>
    </article>
  );
}
