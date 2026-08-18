import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { diffusionModelsTree } from "./fileTree";
import {
  EvidenceFields,
  LearningHeader,
  LearningTerm,
} from "../diffusion-shared";
import DiffusionTrainingViz from "./DiffusionTrainingViz";

export default function DiffusionFoundationsArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
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
        <LearningTerm
          name="Schedule 모양 선택 - linear vs cosine"
          shape="linear: beta_t가 t에 비례해 균등 증가 / cosine: 누적 signal이 cos^2 곡선을 따름"
          meaning="beta_t의 절대값이 아니라 모양이 학습 난이도 분포를 정합니다. Original DDPM의 linear schedule은 마지막 몇 step에서 신호를 너무 빨리 없애 그 구간의 학습 신호를 낭비합니다."
          example="Linear schedule은 t가 T의 20%만 지나도 누적 signal이 이미 크게 떨어지지만, cosine schedule은 앞뒤 구간에서 더 완만하게 줄어 모든 noise level이 고르게 학습됩니다."
          boundary="Cosine schedule은 작은 offset을 둬 t가 0에 가까울 때 beta_t가 0에 너무 붙는 것도 막습니다. Nichol과 Dhariwal(Improved DDPM)의 실험 결과이며 모든 데이터/해상도에 최적이라는 보장은 아닙니다."
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

      <section id="loss-derivation" className="space-y-6">
        <LearningHeader
          n="03"
          kicker="L_simple이 어디서 나오는지 되짚기"
          title="Noise-prediction loss는 evidence lower bound를 재가중한 결과다"
        />
        <p className="text-lg leading-8">
          앞 section의 <code>L_ε</code>는 직관으로 고른 objective가 아닙니다.
          Log-likelihood를 직접 최적화할 수 없어 evidence lower bound(ELBO)를
          대신 최소화하고, 그 bound를 reverse step마다의 Gaussian
          mean-matching 문제로 바꾼 뒤 model이 mean 대신 noise를 예측하도록
          reparameterize한 결과가 바로 <code>L_ε</code>입니다.
        </p>
        <ExplainedFormula
          question="log p_θ(x₀)를 직접 최적화하지 못하면 어떤 대안을 쓰나요?"
          idea="고정된 forward q를 importance distribution으로 써서 log p_θ(x₀)의 lower bound를 만듭니다. Bayes rule로 q(xₜ|x_{t-1})을 q(x_{t-1}|xₜ,x₀)로 바꿔치면 곱이 telescoping되어 T개의 독립 항으로 쪼개집니다."
          formula={String.raw`L_{\mathrm{vlb}}=D_{\mathrm{KL}}(q(x_T\mid x_0)\Vert p(x_T))+\sum_{t=2}^{T}D_{\mathrm{KL}}(q(x_{t-1}\mid x_t,x_0)\Vert p_\theta(x_{t-1}\mid x_t))-\log p_\theta(x_0\mid x_1)`}
          annotatedFormula={String.raw`\begin{aligned}
L_T&=\underbrace{D_{\mathrm{KL}}(q(x_T\mid x_0)\Vert p(x_T))}_{\text{학습 parameter가 없는 prior-matching 항}}\\
L_{t-1}&=\underbrace{D_{\mathrm{KL}}(q(x_{t-1}\mid x_t,x_0)\Vert p_\theta(x_{t-1}\mid x_t))}_{\text{각 reverse step에서 정답 posterior와 model을 맞추는 항}}\\
L_0&=\underbrace{-\log p_\theta(x_0\mid x_1)}_{\text{마지막 discrete reconstruction 항}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`D_{\mathrm{KL}}(q(x_T\mid x_0)\Vert p(x_T))`,
              annotation: [
                "T가 크면 q(x_T|x0)가 사실상 N(0,I)라",
                "이 항은 학습과 거의 무관",
              ],
            },
            {
              expression: String.raw`D_{\mathrm{KL}}(q(x_{t-1}\mid x_t,x_0)\Vert p_\theta(x_{t-1}\mid x_t))`,
              annotation: [
                "각 reverse step에서 정답 posterior와",
                "model의 예측을 비교",
              ],
            },
            {
              expression: String.raw`-\log p_\theta(x_0\mid x_1)`,
              annotation: [
                "마지막 continuous→discrete 복원을",
                "별도 reconstruction 항으로 처리",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`q(x_{t-1}\mid x_t,x_0)`,
              name: "True reverse posterior",
              description:
                "Forward chain과 x₀를 알 때 계산 가능한 정답 reverse 분포입니다.",
            },
            {
              symbol: String.raw`p_\theta(x_{t-1}\mid x_t)`,
              name: "Learned reverse step",
              description: "Network가 근사하는 reverse 분포입니다.",
            },
            {
              symbol: "T",
              name: "Total forward steps",
              description: "Forward chain의 길이이자 reverse 합의 범위입니다.",
            },
          ]}
          assumptions={[
            "Forward q는 학습 parameter가 없는 고정 Gaussian Markov chain입니다.",
            "T가 충분히 크면 q(x_T|x0)는 사실상 N(0,I)라 L_T는 상수에 가깝습니다.",
          ]}
          interpretation="실제 학습은 L_T가 아니라 t=2..T의 L_{t-1} 항들에서 일어납니다. 각 항은 한 reverse step에서 정답 posterior와 model을 얼마나 잘 맞추는지를 잽니다."
        />
        <LearningTerm
          name="Closed-form reverse posterior"
          shape="q(x_{t-1}|xₜ,x₀) = N(x_{t-1}; μ̃ₜ(xₜ,x₀), β̃ₜI)"
          meaning="Forward chain 전체가 Gaussian이므로 Bayes rule로 이 posterior를 정확한 닫힌 형태로 계산할 수 있습니다 — 두 Gaussian의 곱은 다시 Gaussian이기 때문입니다."
          example="μ̃ₜ = (√ᾱ_{t-1}βₜ)/(1−ᾱₜ)·x₀ + (√αₜ(1−ᾱ_{t-1}))/(1−ᾱₜ)·xₜ, β̃ₜ = (1−ᾱ_{t-1})/(1−ᾱₜ)·βₜ"
          boundary="이 닫힌 형태는 forward process가 정확히 Gaussian Markov chain일 때만 성립합니다."
        />
        <ExplainedFormula
          question="왜 model이 mean μ_θ 대신 noise ε_θ를 예측하도록 바꿔 쓰나요?"
          idea="q(x_{t-1}|xₜ,x₀)와 p_θ(x_{t-1}|xₜ)를 같은 분산의 Gaussian으로 두면 KL은 평균 차이의 제곱과 같습니다. Closed-form posterior mean을 xₜ와 ε만의 식으로 바꾸고 model도 같은 형태로 재구성하면, 남는 항이 정확히 noise-prediction squared error입니다."
          formula={String.raw`D_{\mathrm{KL}}=\frac{1}{2\sigma_t^2}\lVert\tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\rVert^2`}
          annotatedFormula={String.raw`\begin{aligned}
D_{\mathrm{KL}}&=\underbrace{\frac{1}{2\sigma_t^2}\lVert\tilde\mu_t-\mu_\theta\rVert^2}_{\text{같은 분산의 두 Gaussian KL은 평균차 제곱}}\\
\mu_\theta(x_t,t)&=\underbrace{\frac{1}{\sqrt{\alpha_t}}\Big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\epsilon_\theta(x_t,t)\Big)}_{\text{model이 mean 대신 노이즈 }\epsilon_\theta\text{를 내도록 재구성}}\\
L_{t-1}&=\underbrace{w_t\,\mathbb E\big[\lVert\epsilon-\epsilon_\theta(x_t,t)\rVert^2\big]}_{\text{대입 후 남는 항 — }w_t=1\text{로 두면 }L_\varepsilon}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\frac{1}{2\sigma_t^2}\lVert\tilde\mu_t-\mu_\theta\rVert^2`,
              annotation: [
                "같은 분산의 두 Gaussian KL을",
                "평균 차이의 제곱으로 정리",
              ],
            },
            {
              expression: String.raw`x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\epsilon_\theta(x_t,t)`,
              annotation: [
                "model output을 mean이 아니라",
                "noise 예측값으로 재구성",
              ],
            },
            {
              expression: String.raw`w_t\,\lVert\epsilon-\epsilon_\theta(x_t,t)\rVert^2`,
              annotation: [
                "대입 후 남는 weighted term에서",
                "weight를 1로 두면 noise-prediction loss",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\tilde\mu_t`,
              name: "Closed-form posterior mean",
              description:
                "Bayes rule로 얻은 q(x_{t-1}|xₜ,x₀)의 평균이며, xₜ와 ε만의 식으로 다시 쓸 수 있습니다.",
            },
            {
              symbol: String.raw`\sigma_t^2`,
              name: "Reverse step variance",
              description:
                "p_θ(x_{t-1}|xₜ)에 고정한 분산이며 보통 β̃ₜ 또는 βₜ를 씁니다.",
            },
            {
              symbol: "w_t",
              name: "Per-t loss weight",
              description:
                "치환 뒤 남는 βₜ²/(2σₜ²αₜ(1−ᾱₜ)) 형태의 계수입니다.",
            },
          ]}
          assumptions={[
            "p_θ(x_{t-1}|xₜ)의 분산을 학습하지 않고 상수로 고정합니다.",
            "x₀=(xₜ−√(1−ᾱₜ)ε)/√ᾱₜ로 posterior mean 안의 x₀를 xₜ,ε로 치환합니다.",
          ]}
          interpretation="L_ε(=L_simple)은 이 유도에서 자동으로 나온 결과가 아니라 w_t를 전부 1로 둔 재가중치 버전입니다. Ho et al.은 이 재가중이 낮은 noise level의 기여를 늘려 sample quality를 실제로 개선한다는 것을 실험으로 보였습니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          여기까지가 "왜 이 loss가 맞는가"입니다. 아래 두 알고리즘은 지금까지의
          식을 그대로 코드로 옮긴 것입니다 — 위에서 이미 정의한 기호(x₀,
          ᾱₜ, ε, ε_θ) 그대로 씁니다.
        </p>
        <AlgorithmBlock
          title="Training — 한 gradient step (수렴할 때까지 반복)"
          input={["x₀ ~ 학습 데이터", "T, {β₁,…,β_T} (고정 noise schedule)"]}
          steps={[
            {
              code: "t ~ Uniform({1, …, T})",
              note: "이번 step에서 학습할 noise level을 무작위로 고릅니다.",
            },
            {
              code: "ε ~ N(0, I)",
              note: "x₀와 같은 shape의 표준 Gaussian noise를 샘플링합니다.",
            },
            {
              code: "ᾱ_t = ∏ˢ₌₁ᵗ(1−β_s)",
              note: "미리 계산해 둔 lookup table에서 t번째 값을 읽으면 됩니다.",
            },
            {
              code: "x_t = √ᾱ_t · x₀ + √(1−ᾱ_t) · ε",
              note: "forward loop를 t번 실행하지 않고 closed form으로 바로 계산합니다.",
            },
            {
              code: "loss = ‖ε − ε_θ(x_t, t)‖²",
              note: "network가 예측한 noise와 실제로 주입한 noise의 MSE입니다.",
            },
            {
              code: "θ ← θ − η · ∇_θ loss",
              note: "일반적인 gradient step으로 network parameter를 갱신합니다.",
            },
            {
              code: "θ_ema ← m · θ_ema + (1−m) · θ",
              note: "θ_ema는 θ와 별도 buffer입니다. m=0.999~0.9999가 흔한 값이며, sampling에는 θ가 아니라 θ_ema를 씁니다 — 매 step의 잡음 많은 θ보다 여러 step을 평균한 θ_ema가 더 안정적인 sample을 만듭니다.",
            },
          ]}
          output="학습된 θ_ema (sampling에 사용할 최종 weight)"
          repeatUntil="Loss가 수렴하거나 정해진 step 수에 도달할 때까지 1~7을 반복합니다."
        />
        <CodeViewButton
          onClick={() => sidebar.open("add-noise", codeRefs["add-noise"])}
        />
        <AlgorithmBlock
          title="Sampling — xT에서 x0까지 T번 반복"
          input={[
            "학습된 ε_θ, T, {β₁,…,β_T}",
            "x_T ~ N(0, I)",
          ]}
          steps={[
            {
              code: "for t = T, T−1, …, 1:",
              note: "Terminal noise에서 시작해 역순으로 반복합니다.",
            },
            {
              code: "  z ~ N(0, I)   (t=1이면 z=0)",
              note: "마지막 step에서는 추가 noise를 넣지 않아야 x₀가 결정론적으로 남습니다.",
            },
            {
              code: "  x_{t-1} = (1/√α_t)·(x_t − (β_t/√(1−ᾱ_t))·ε_θ(x_t,t)) + σ_t·z",
              note: "위 μ_θ 식으로 mean을 계산한 뒤, posterior 분산만큼 noise를 다시 더합니다.",
            },
          ]}
          output="x₀ — 생성된 sample"
          repeatUntil="t=T부터 t=1까지 매 step 위 세 줄을 순서대로 실행합니다."
        />
        <CodeViewButton
          onClick={() => sidebar.open("reverse-step", codeRefs["reverse-step"])}
        />
      </section>

      <section id="score" className="space-y-6">
        <LearningHeader
          n="04"
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
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ diffusers: diffusionModelsTree }}
        projectMetas={{
          diffusers: {
            id: "diffusers",
            label: "HuggingFace diffusers · Python",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </>
  );
}
