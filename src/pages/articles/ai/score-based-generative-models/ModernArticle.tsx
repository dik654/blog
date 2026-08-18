import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ScoreDiffusionViz } from "../generative-theory/viz/ModernGenerativeTheoryViz";

export default function ScoreBasedGenerativeModelsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="score-field" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Score는 density 값이 아니라 더 높은 density로 가는 화살표입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Score function</strong>은 각 위치 x에서 log density가 가장
            빠르게 증가하는 방향 ∇ₓ log p(x)입니다. Normalization constant는
            미분하면 사라지므로 density 값을 직접 계산하지 않고 local
            direction을 배울 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="Score field를 읽는 세 단계"
          items={[
            {
              term: "Density p(x)",
              description:
                "현재 위치 부근에 probability mass가 얼마나 모였는지 나타냅니다.",
              example: "Gaussian은 중심 근처가 높습니다.",
              boundary: "Continuous density 값은 점의 probability가 아닙니다.",
            },
            {
              term: "Log density log p(x)",
              description:
                "곱 구조를 합으로 바꾸고 gradient scale을 다루기 쉽게 만듭니다.",
              example: "Gaussian에서는 constant−x²/2입니다.",
              boundary: "값 자체보다 coordinate derivative를 사용합니다.",
            },
            {
              term: "Score ∇ₓ log p(x)",
              description:
                "현재 점에서 log density가 가장 빨리 커지는 vector입니다.",
              example: "x=2의 standard Gaussian score는 −2입니다.",
              boundary:
                "Global mode label이나 normalized density를 직접 주지 않습니다.",
            },
          ]}
        />
        <ScoreDiffusionViz />
        <ContentBoundary article="score-based-generative-models" />
      </section>

      <section id="gaussian-score" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Gaussian score의 minus는 중심 반대편이 아니라 중심 쪽을 가리킵니다
        </h2>
        <ExplainedFormula
          question="Standard Gaussian에서 score가 왜 −x가 되나요?"
          idea={
            <p>
              Log density의 −x²/2를 x로 미분하면 현재 좌표 x의 부호를 뒤집은
              방향이 남습니다. 양수 위치에서는 왼쪽, 음수 위치에서는 오른쪽을
              가리킵니다.
            </p>
          }
          formula={String.raw`\begin{aligned}s(x)&=\nabla_x\log p(x)\\s(x)&=-x\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}c&=\underbrace{C}_{\text{미분하면 0}}\\e(x)&=\underbrace{-x^2/2}_{\text{중심 이탈 penalty}}\\\log p(x)&=c+e(x)\\s(x)&=\underbrace{\frac{\partial}{\partial x}\log p(x)}_{\text{density 증가 방향}}\\s(x)&=\underbrace{-x}_{\text{좌표 부호를 바꿔 중심 쪽}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\log p(x)`,
              annotation: [
                "density에 log를 취해",
                "normalization constant와 곱 구조를 단순화",
              ],
            },
            {
              expression: String.raw`\partial/\partial x`,
              annotation: [
                "현재 coordinate로 미분해",
                "local ascent direction 계산",
              ],
            },
            {
              expression: String.raw`-x`,
              annotation: [
                "좌표 부호를 뒤집어",
                "Gaussian 중심인 0 쪽을 가리킴",
              ],
            },
          ]}
          terms={[
            {
              symbol: "C",
              name: "Normalization constant",
              description: "x와 무관해 gradient에서 사라지는 값입니다.",
            },
            {
              symbol: "x",
              name: "Current coordinate",
              description: "Score를 평가하는 noisy 또는 data point입니다.",
            },
            {
              symbol: "s(x)",
              name: "Score",
              description: "Log density의 local gradient입니다.",
            },
          ]}
          assumptions={[
            "1차원 mean 0, variance 1 Gaussian입니다.",
            "Gradient는 x coordinate에 대해 계산합니다.",
            "Score를 따라가는 finite step의 안정성은 step size에 의존합니다.",
          ]}
          interpretation="x=2이면 score=−2라 왼쪽을, x=−1이면 score=1이라 오른쪽을 가리킵니다. 둘 다 density peak인 0 쪽입니다."
        />
      </section>

      <section id="noise-score" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Network는 계산 불가능한 marginal score 대신 계산 가능한 conditional score를 맞추도록 학습합니다
        </h2>
        <ExplainedFormula
          question="왜 (계산 불가능한) marginal score 대신 x0 하나에 조건부인 score를 맞추는 것으로 충분한가요?"
          idea={
            <p>
              진짜 목표인 marginal density p(x)의 score는 알 수 없습니다.
              하지만 data 하나 x0에 Gaussian noise를 더한 조건부 분포
              q_sigma(x|x0)의 score는 정확한 closed form으로 계산할 수 있습니다.
              Denoising score matching(Vincent, 2011)은 이 계산 가능한
              target을 맞추는 것이 실제로는 원하는 marginal score를 학습하는
              것과(theta에 무관한 상수 차이를 빼면) 같은 objective임을 보였습니다.
            </p>
          }
          formula={String.raw`\mathcal L_{\rm DSM}(\theta)=\mathbb E_{x_0,\,x\sim q_\sigma(x\mid x_0)}\big[\lVert s_\theta(x)-\nabla_x\log q_\sigma(x\mid x_0)\rVert^2\big]`}
          annotatedFormula={String.raw`\begin{aligned}
q_\sigma(x\mid x_0)&=\underbrace{N(x_0,\sigma^2 I)}_{\text{x0 주변에 Gaussian noise를 더한 조건부 분포}}\\
\nabla_x\log q_\sigma(x\mid x_0)&=\underbrace{-\frac{x-x_0}{\sigma^2}}_{\text{계산 가능한 conditional score - closed form}}\\
\mathcal L_{\rm DSM}&=\underbrace{\mathbb E\big[\lVert s_\theta(x)-\nabla_x\log q_\sigma(x\mid x_0)\rVert^2\big]}_{\text{network가 이 tractable target을 맞추도록 학습}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`N(x_0,\sigma^2 I)`,
              annotation: [
                "x0에 표준편차만큼 Gaussian noise를 더해",
                "같은 x0에서 여러 noisy sample 생성",
              ],
            },
            {
              expression: String.raw`-\frac{x-x_0}{\sigma^2}`,
              annotation: [
                "Gaussian log density를 미분해",
                "x0로 되돌아가는 방향을 closed form으로 계산",
              ],
            },
            {
              expression: String.raw`\lVert s_\theta(x)-\nabla_x\log q_\sigma(x\mid x_0)\rVert^2`,
              annotation: [
                "network 예측과 계산 가능한 target의 차이를 제곱해",
                "regression loss로 최적화",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`q_\sigma(x\mid x_0)`,
              name: "Perturbation kernel",
              description: "x0에 Gaussian noise를 씌운 조건부 분포입니다.",
            },
            {
              symbol: String.raw`s_\theta(x)`,
              name: "Score network",
              description: "x0을 모르는 채로 x만 보고 score를 예측합니다.",
            },
          ]}
          assumptions={[
            "노이즈 크기는 고정한 noise level입니다.",
            "x0는 data distribution에서 독립적으로 샘플링합니다.",
          ]}
          interpretation="Diffusion의 노이즈 예측은 이 objective를 diffusion의 noise scale로 재매개변수화한 특수한 경우입니다. 아래 식이 그 구체적인 변환을 보여줍니다."
        />

        <h2 className="mb-5 text-2xl font-bold">
          Diffusion에서는 예측한 noise를 뒤집고 noise scale로 나눕니다
        </h2>
        <ExplainedFormula
          question="왜 sθ=−εθ/√(1−ᾱₜ)에서 minus와 나눗셈이 모두 필요한가요?"
          idea={
            <p>
              εθ는 clean data에서 noisy point로 밀어낸 방향을 예측합니다.
              Score는 noisy point에서 높은 density 쪽으로 돌아가는 방향이므로
              부호를 뒤집고, 서로 다른 t의 noise 크기를 같은 coordinate gradient
              단위로 맞추기 위해 standard deviation으로 나눕니다.
            </p>
          }
          formula={String.raw`\begin{aligned}d_t&=-\varepsilon_\theta(x_t,t)\\\sigma_t&=\sqrt{1-\bar\alpha_t}\\s_\theta(x_t,t)&=d_t/\sigma_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}c_t&=\underbrace{\sqrt{\bar\alpha_t}x_0}_{\text{남은 clean signal}}\\n_t&=\underbrace{\sqrt{1-\bar\alpha_t}\,\varepsilon}_{\text{scale을 맞춘 noise}}\\x_t&=c_t+n_t\\d_t&=\underbrace{-\varepsilon_\theta(x_t,t)}_{\text{noise의 반대 방향}}\\\sigma_t&=\sqrt{1-\bar\alpha_t}\\s_\theta(x_t,t)&=\underbrace{d_t/\sigma_t}_{\text{noise scale로 나눠 정규화}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sqrt{\bar\alpha_t}x_0`,
              annotation: [
                "clean sample에 signal scale을 곱해",
                "t에서 남길 정보량 결정",
              ],
            },
            {
              expression: String.raw`\sqrt{1-\bar\alpha_t}\,\varepsilon`,
              annotation: [
                "standard Gaussian에 noise scale을 곱해",
                "t의 corruption 크기 결정",
              ],
            },
            {
              expression: String.raw`-\varepsilon_\theta`,
              annotation: [
                "예측한 corruption 방향을 뒤집어",
                "clean/high-density 쪽 복원 방향 생성",
              ],
            },
            {
              expression: String.raw`/\sqrt{1-\bar\alpha_t}`,
              annotation: [
                "t별 noise 표준편차로 나눠",
                "coordinate log-density gradient scale로 변환",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_0`,
              name: "Clean sample",
              description: "Forward corruption 전 data sample입니다.",
            },
            {
              symbol: String.raw`x_t`,
              name: "Noisy sample",
              description: "Noise level t에서 관측한 state입니다.",
            },
            {
              symbol: String.raw`\bar\alpha_t`,
              name: "Cumulative signal ratio",
              description: "t까지 남긴 clean signal 비율입니다.",
            },
            {
              symbol: String.raw`\varepsilon_\theta`,
              name: "Predicted noise",
              description:
                "Network가 xₜ에서 추정한 injected Gaussian noise입니다.",
            },
          ]}
          assumptions={[
            "Variance-preserving Gaussian forward process입니다.",
            "ε-prediction parameterization을 사용합니다.",
            "v-prediction·VE process·solver discretization에서는 변환식이 달라집니다.",
          ]}
          interpretation="Noise standard deviation이 .5이고 εθ=.8이면 score는 −1.6입니다. Minus는 복원 방향을, .5로 나누기는 noise level에 맞춘 gradient 크기를 만듭니다."
        />
      </section>

      <section id="papers-score" className="scroll-mt-20 space-y-5">
        <CitationBlock
          source="Generative Modeling by Estimating Gradients of the Data Distribution"
          citeKey={1}
          href="https://arxiv.org/abs/1907.05600"
        >
          <strong>문제:</strong> data manifold 주변의 score estimation과
          sampling. <strong>기여:</strong> noise-conditioned score와 annealed
          Langevin dynamics. <strong>전제:</strong> perturbation과 finite
          schedule. <strong>근거 범위:</strong> 논문의 score objective와 image
          실험. <strong>과장 금지:</strong> finite sample이 exact
          distribution이라는 보장은 아닙니다.
        </CitationBlock>
        <CitationBlock
          source="Denoising Diffusion Probabilistic Models"
          citeKey={2}
          href="https://arxiv.org/abs/2006.11239"
        >
          <strong>문제:</strong> Gaussian noising의 reverse process 학습.{" "}
          <strong>기여:</strong> variational bound와 noise-prediction objective
          연결. <strong>전제:</strong> 논문의 VP schedule·parameterization.{" "}
          <strong>근거 범위:</strong> 해당 likelihood·FID·sample 결과.{" "}
          <strong>과장 금지:</strong> 모든 sampler가 같은 step·latency를
          갖는다는 뜻은 아닙니다.
        </CitationBlock>
      </section>
    </div>
  );
}
