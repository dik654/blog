import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import SignalSamplingViz from "./viz/SignalSamplingViz";

export default function Implicit() {
  return (
    <section id="implicit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Density를 직접 계산하지 않아도 comparison과 score로 학습할 수 있다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GAN은 normalized pθ(x)를 계산하는 대신 real sample과 generated
          sample을 discriminator가 구분하는 game을 만든다. Discriminator는 두
          distribution의 density ratio에 관한 signal을 제공하고 generator는 그
          구분을 어렵게 만든다. Arbitrary function과 global optimum이라는 이상적
          조건에서는 generated distribution이 data distribution과 같아지지만,
          finite network의 alternating optimization에서는 non-convergence와 mode
          collapse가 생긴다.
        </p>
      </div>

      <ExplainedFormula
        question="Generator density를 계산하지 않고 real과 generated distribution을 어떻게 같아지게 학습할까?"
        idea={
          <>
            Discriminator D는 real에는 1, generated sample에는 0을 주도록
            학습하고 G는 그 분류를 어렵게 만듭니다. 고정된 G에서 optimal
            discriminator를 대입하면 original minimax value는 Jensen–Shannon
            divergence와 연결됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}\ell_r(x)&=\log D(x)\\\ell_g(z)&=\log(1-D(G(z)))\\V_r&=\mathbb E_{p_{data}}[\ell_r(x)]\\V_g&=\mathbb E_{p(z)}[\ell_g(z)]\\\min_G\max_D\;V&=V_r+V_g\end{aligned}`}
        terms={[
          {
            symbol: "G(z)",
            name: "generator sample",
            description: "Tractable prior z를 data-shaped sample로 바꿉니다.",
          },
          {
            symbol: "D(x)",
            name: "discriminator output",
            description:
              "Input이 data distribution에서 왔을 probability를 추정합니다.",
          },
          {
            symbol: "p(z)",
            name: "latent prior",
            description: "Density가 쉬운 noise source입니다.",
          },
        ]}
        assumptions={[
          "Original theorem은 충분한 capacity와 각 step의 optimal discriminator를 전제로 합니다.",
          "실전에서는 non-saturating generator loss 등 다른 update objective를 자주 사용합니다.",
        ]}
        interpretation="GAN은 likelihood 계산을 피하고 빠른 generator sampling을 얻지만 density coverage를 직접 점검하기 어렵습니다. 이론적 equilibrium이 실제 alternating training의 수렴 보장은 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Original minimax와 non-saturating loss, Wasserstein 계열과
          stabilization은
          <Link to="/ai/gan">GAN 글</Link>이 소유한다. 여기서는 sample-level
          comparison이라는 tractability 선택만 유지한다.
        </p>

        <h3>Score는 density 값 대신 log-density의 방향을 학습한다</h3>
        <p>
          Score s(x)=∇x log p(x)는 현재 x에서 density가 증가하는 방향을
          가리킨다. Data distribution이 low-dimensional manifold에 집중되면 원
          data score를 직접 추정하기 어려워 여러 noise level에서 perturbed
          distribution pt의 score를 학습한다. Sampling은 noise에서 시작해
          reverse SDE, Langevin dynamics나 probability-flow ODE solver를
          따라간다.
        </p>
      </div>

      <ExplainedFormula
        question="여러 noise level에서 denoiser가 학습하는 방향을 score와 어떻게 연결할까?"
        idea={
          <>
            Clean x0에 Gaussian noise를 더해 xt를 만들면 conditional score는
            noise ε에 비례합니다. Noise predictor εθ를 MSE로 맞추는 DDPM
            parameterization은 time-dependent score를 scale만 바꿔 추정하는 것과
            연결됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}x_t&=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon\\s_\theta(x_t,t)&\approx\nabla_{x_t}\log p_t(x_t)\\s_\theta(x_t,t)&=-\frac{\varepsilon_\theta(x_t,t)}{\sqrt{1-\bar\alpha_t}}\end{aligned}`}
        terms={[
          {
            symbol: "\bar\alpha_t",
            name: "signal schedule",
            description:
              "Noise level t에 남아 있는 clean signal의 누적 비율입니다.",
          },
          {
            symbol: "\varepsilon",
            name: "injected noise",
            description:
              "Forward perturbation에 사용한 standard Gaussian sample입니다.",
          },
          {
            symbol: "s_\theta",
            name: "score model",
            description:
              "Noisy marginal pt의 log-density gradient를 근사합니다.",
          },
          {
            symbol: "\varepsilon_\theta",
            name: "noise predictor",
            description:
              "DDPM에서 같은 정보를 다른 scale로 parameterize합니다.",
          },
        ]}
        assumptions={[
          "표시한 관계는 variance-preserving Gaussian forward process와 ε-prediction convention을 사용합니다.",
          "Loss weighting, v-prediction과 solver discretization은 생략되어 있습니다.",
        ]}
        interpretation="Diffusion은 단순한 ‘implicit generator’ 한 칸으로 끝나지 않습니다. Score, variational bound, reverse stochastic process와 ODE 해석이 연결되며 실제 latency는 network evaluation 횟수와 solver에 달려 있습니다."
      />

      <SignalSamplingViz />

      <div
        id="paper-gan-map"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Adversarial objective
        </p>
        <p className="mt-2 text-sm font-semibold">
          Generative Adversarial Nets
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Generator density를 직접 계산하지 않고 discriminator와의 minimax
          game으로 data distribution을 맞추는 방법을 제시합니다. Optimal
          discriminator와 충분한 capacity를 전제로 한 equilibrium 분석이 실제
          alternating training의 수렴이나 mode coverage를 보장하는 것은
          아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1406.2661"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 minimax objective·정리 보기
        </a>
      </div>

      <div
        id="paper-ddpm-map"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Denoising diffusion
        </p>
        <p className="mt-2 text-sm font-semibold">
          Denoising Diffusion Probabilistic Models
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          고정된 Gaussian forward process와 학습한 reverse process를 variational
          bound 및 denoising score matching 관점으로 연결합니다. 보고된 image
          quality는 논문의 schedule·architecture·sampling step 범위이며, 모든
          diffusion sampler가 같은 계산비를 가진다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2006.11239"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 forward·reverse process와 objective 보기
        </a>
      </div>

      <div
        id="paper-ncsn-map"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Noise-conditioned score
        </p>
        <p className="mt-2 text-sm font-semibold">
          Generative Modeling by Estimating Gradients of the Data Distribution
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Data manifold 주변의 score estimation 문제를 여러 noise level의
          perturbed distribution과 annealed Langevin dynamics로 다룹니다.
          Noise를 추가하는 이유와 sampling dynamics를 연결하지만, finite-step
          sample이 exact data distribution이라는 보장은 별도 조건이 필요합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1907.05600"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 score matching·sampling 보기
        </a>
      </div>

      <div
        id="paper-score-sde-map"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · SDE와 ODE 통합
        </p>
        <p className="mt-2 text-sm font-semibold">
          Score-Based Generative Modeling through Stochastic Differential
          Equations
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          여러 discrete noise process를 forward SDE, reverse-time SDE와 같은
          marginals를 갖는 probability-flow ODE로 묶습니다. 연속시간 이론과 실제
          solver의 step 수·수치 오차·latency는 구분해서 읽어야 합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2011.13456"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 reverse SDE·probability-flow ODE 보기
        </a>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Forward noising, reverse process, SDE·ODE·flow matching과 latent
          diffusion은
          <Link to="/ai/diffusion-models">Diffusion Models 글</Link>에서
          단계별로 이어집니다. Score-SDE 논문은 reverse-time SDE와 같은
          marginals를 갖는 probability-flow ODE를 함께 제시하므로, stochastic
          sampling과 ODE likelihood path를 같은 model family 안에서 비교할
          근거가 됩니다.
        </p>
      </div>
    </section>
  );
}
