import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import GenerationContractViz from "./viz/GenerationContractViz";
import DensityRatioViz from "./viz/DensityRatioViz";
import GradientSignalViz from "./viz/GradientSignalViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GAN은 density를 계산하는 대신 분포를 구별하는 함수를 학습한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Generative adversarial network(GAN)은 단순한 latent prior에서 뽑은{" "}
          <code>z</code>를 generator에 넣어 data-space sample을 만들고,
          discriminator가 real sample과 generated sample을 구별하도록 두
          network를 함께 학습합니다. Generator는 normalized likelihood를
          반환하지 않는 implicit generative model이지만, sampling은 한 번의
          forward pass로 수행할 수 있습니다.
        </p>
        <p>
          <Link to="/ai/generative-theory">생성 모델 전체 지도</Link>는
          GAN·VAE·flow·diffusion의 tractability 선택을 비교합니다. 이 글에서는
          GAN 고유의 density-ratio game, generator gradient, two-player
          dynamics와 평가 경계를 따라갑니다. 기본 GAN에는 encoder가 없으므로
          주어진 sample의 latent code나 likelihood가 자동으로 제공된다고
          생각하면 안 됩니다.
        </p>
      </div>
      <ContentBoundary article="gan" />

      <div
        id="paper-original-gan"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Adversarial framework
        </p>
        <p className="mt-2 text-sm font-semibold">
          Generative Adversarial Nets
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Generator와 discriminator의 minimax game, 고정 generator에서의 optimal
          discriminator와 global equilibrium을 제시합니다. Arbitrary function
          capacity와 ideal optimization을 전제로 한 정리를 finite neural
          network의 alternating SGD 수렴 보장으로 읽어서는 안 됩니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1406.2661"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 minimax 정리·algorithm·실험 보기
        </a>
      </div>
      <GenerationContractViz />
      <ExplainedFormula
        question="Latent prior를 통과한 generator가 만드는 distribution은 무엇인가?"
        idea={
          <>
            Generator가 latent sample을 data space로 옮기면, 그 출력들의 분포가{" "}
            <code>p_g</code>가 됩니다. Density formula를 직접 쓸 수 없어도
            sample에 대한 expectation은 Monte Carlo로 계산할 수 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}z&\sim p_z\\\widetilde x&=G_\theta(z)\\\widetilde x&\sim p_g=(G_\theta)_\#p_z\end{aligned}`}
        terms={[
          {
            symbol: "p_z",
            name: "latent prior",
            description:
              "Gaussian·uniform처럼 쉽게 sampling할 수 있는 입력 분포입니다.",
          },
          {
            symbol: "G_\\theta",
            name: "generator",
            description:
              "Parameter θ로 latent space를 data space에 mapping하는 differentiable network입니다.",
          },
          {
            symbol: "(G_\\theta)_\\#p_z",
            name: "pushforward distribution",
            description:
              "p_z의 sample을 Gθ로 보냈을 때 data space에 유도되는 distribution입니다.",
          },
          {
            symbol: "\\widetilde x",
            name: "generated sample",
            description:
              "Real data x와 같은 tensor contract를 가져 discriminator에 입력됩니다.",
          },
        ]}
        assumptions={[
          "Deterministic generator를 적었으며 condition·internal noise는 생략했습니다.",
          "Latent dimension이 data dimension보다 작으면 generated distribution이 낮은 차원 manifold에 놓일 수 있습니다.",
        ]}
        interpretation="GAN은 p_g(x)를 수치로 조회하는 API보다 z→x̃ sampling mechanism을 학습합니다. 이것이 빠른 sampling의 장점인 동시에 likelihood 기반 평가·inference가 바로 나오지 않는 이유입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Discriminator는 고정된 generator에 대한 density ratio를 배운다</h3>
        <p>
          Original GAN은 real을 label 1, fake를 label 0으로 둔 binary
          classification 문제와 generator 문제를 결합한다. Generator가 고정되어
          있고 discriminator가 어떤 함수든 표현하며 최적으로 학습된다는 이상적
          조건에서는, 한 위치의 real density가 generated density보다 얼마나
          큰지가 최적 출력으로 나타난다.
        </p>
      </div>
      <ExplainedFormula
        question="Generator가 고정됐을 때 가장 잘 구분하는 discriminator는 무엇을 출력할까?"
        idea={
          <>
            각 x에서 real sample과 fake sample이 올 상대적 가능성을 비교합니다.
            두 class를 같은 비율로 sampling하면 Bayes posterior가 두 density의
            비율로 정리됩니다.
          </>
        }
        formula={String.raw`D^*(x)=\frac{p_{\mathrm{data}}(x)}{p_{\mathrm{data}}(x)+p_g(x)}`}
        terms={[
          {
            symbol: "D^*(x)",
            name: "optimal discriminator",
            description:
              "현재 generator에 대해 BCE를 최대로 만드는 이상적 discriminator 출력입니다.",
          },
          {
            symbol: "p_{\\mathrm{data}}(x)",
            name: "real density",
            description:
              "실제 data distribution이 x 근처에 두는 density입니다.",
          },
          {
            symbol: "p_g(x)",
            name: "generated density",
            description:
              "현재 generator output distribution이 x 근처에 두는 density입니다.",
          },
        ]}
        assumptions={[
          "Real과 fake를 같은 prior probability로 분류기에 제시합니다.",
          "Discriminator가 충분한 capacity를 갖고 현재 G에 대해 optimum에 도달했다고 놓은 pointwise 이론입니다.",
        ]}
        interpretation="D*(x)=1/2는 개별 sample이 ‘50% 진짜’라는 calibration 설명보다 두 density가 그 위치에서 같다는 뜻입니다. 실제 finite discriminator의 logit을 이 식의 정확한 density ratio로 취급하면 안 됩니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          예를 들어 한 위치에서 <code>pdata=0.6</code>, <code>pg=0.2</code>라면
          ideal output은 <code>0.6/(0.6+0.2)=0.75</code>입니다. 이 계산은 현재
          generator가 고정되고 discriminator가 충분한 capacity로 optimum에
          도달했다는 조건에서만 density ratio로 읽을 수 있습니다. 실제
          discriminator가 1/2를 냈더라도, 상수 1/2밖에 표현하지 못하거나 아직
          underfit한 network라면 두 distribution이 같다는 결론은 나오지
          않습니다.
        </p>
      </div>
      <DensityRatioViz />
      <ExplainedFormula
        question="Original GAN의 두 player는 어떤 하나의 value function을 반대 방향으로 움직일까?"
        idea={
          <>
            Discriminator는 real의 log D와 fake의 log(1−D)를 크게 만들고,
            minimax generator는 두 번째 항을 작게 만들어 fake를 real 쪽으로
            옮깁니다.
          </>
        }
        formula={String.raw`\begin{aligned}V_r&=\mathbb E_x[\log D(x)]\\V_g&=\mathbb E_z[\log(1-D(G(z)))]\\V(D,G)&=V_r+V_g,\qquad \min_G\max_D V\end{aligned}`}
        terms={[
          {
            symbol: "V(D,G)",
            name: "value function",
            description:
              "D는 maximize하고 G는 minimize하는 two-player objective입니다.",
          },
          {
            symbol: "V_r,V_g",
            name: "real and fake terms",
            description:
              "같은 value function을 real batch와 generated batch expectation으로 나눈 두 항입니다.",
          },
          {
            symbol: "D(x)",
            name: "real score",
            description:
              "Original logistic GAN에서 x를 real로 분류할 sigmoid probability입니다.",
          },
          {
            symbol: "D(G(z))",
            name: "fake score",
            description:
              "Generated sample을 discriminator가 real로 보는 정도입니다.",
          },
          {
            symbol: "\\mathbb E",
            name: "population expectation",
            description:
              "실제 학습에서는 real·latent mini-batch 평균으로 근사합니다.",
          },
        ]}
        assumptions={[
          "Original logistic minimax formulation이며 WGAN critic에는 sigmoid·이 식을 사용하지 않습니다.",
          "D와 G가 동시에 optimum으로 가는 일반적인 scalar minimization 문제가 아닙니다.",
        ]}
        interpretation="Optimal D를 대입하면 −log4+2·JS(pdata∥pg)가 되지만, 이는 idealized value의 성질입니다. Finite alternating SGD가 JS divergence를 정확히 계산하거나 global equilibrium에 수렴한다는 보장이 아닙니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실전 generator는 같은 equilibrium을 더 강한 gradient로 겨냥한다</h3>
        <p>
          Minimax generator의 <code>log(1−D(G(z)))</code>는 학습 초기에
          discriminator가 fake를 쉽게 구분하면 sigmoid가 포화되어 gradient가
          약해질 수 있다. Original paper는 이를 해결하기 위해 “D가 틀리게
          만들기”를 <code>−log D(G(z))</code>로 최적화하는 non-saturating
          heuristic을 제안했다. 목표 equilibrium은 유지하면서 현재 parameter에서
          받는 gradient의 크기와 방향을 바꾸는 선택이다.
        </p>
      </div>
      <ExplainedFormula
        question="Non-saturating generator loss는 discriminator를 통해 어떤 signal을 받는가?"
        idea={
          <>
            Generated sample의 discriminator score가 작을 때 negative log가 큰
            penalty를 주며, chain rule이 data-space gradient를 generator
            parameter까지 전달합니다.
          </>
        }
        formula={String.raw`\mathcal L_G^{\mathrm{NS}}=-\mathbb E_{z\sim p_z}\log D(G_\theta(z))`}
        terms={[
          {
            symbol: "\\mathcal L_G^{\\mathrm{NS}}",
            name: "non-saturating loss",
            description:
              "Generator가 minimize하는 practical logistic objective입니다.",
          },
          {
            symbol: "D(G_\\theta(z))",
            name: "critic feedback",
            description:
              "Generated sample을 real로 분류한 discriminator probability입니다.",
          },
          {
            symbol: "\\theta",
            name: "generator parameters",
            description:
              "D weight는 고정하지만 D를 지나는 input gradient로 update됩니다.",
          },
        ]}
        assumptions={[
          "Generator step에서 discriminator가 differentiable하고 parameter snapshot이 고정되어 있습니다.",
          "좋은 per-step gradient가 전체 game의 안정성이나 mode coverage를 보장하지는 않습니다.",
        ]}
        interpretation="Non-saturating은 minimax value를 그대로 minimize하는 식은 아니지만 같은 pdata=pg equilibrium을 겨냥합니다. 논문·code를 비교할 때 discriminator loss와 generator loss를 따로 적어야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>D=σ(a)</code>인 logit <code>a</code>로 미분하면 saturating
          minimax 항의 gradient 크기는 <code>D</code>, non-saturating 항의
          gradient는 <code>|D−1|</code>입니다. 학습 초기에 <code>D=0.01</code>이면
          각각 약 0.01과 0.99이므로 후자가 훨씬 강한 signal을 줍니다. 이는 한
          step의 optimization을 돕는 차이일 뿐, global convergence나 mode
          coverage를 보장하지는 않습니다.
        </p>
      </div>
      <GradientSignalViz />
    </section>
  );
}
