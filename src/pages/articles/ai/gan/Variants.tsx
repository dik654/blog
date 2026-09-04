import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import DesignAxisViz from "./viz/DesignAxisViz";

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GAN 변형은 condition·architecture·discrepancy·constraint 중 무엇을
        바꿨는지로 읽는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Conditional GAN은 label·text·source image를 G와 D에 제공해{" "}
          <code>p(x|c)</code>를 목표로 삼는다. DCGAN은 convolutional
          architecture와 training guideline을 정리했고, Pix2Pix는 paired
          translation에 adversarial loss와 reconstruction을 결합했다. CycleGAN은
          unpaired domain에 cycle consistency를 추가했지만 내용이 반드시
          보존된다는 보장은 아니며, StyleGAN은 mapping network와 layer-wise
          style modulation으로 control과 high-resolution synthesis를 발전시켰다.
        </p>
        <p>
          이들이 하나의 직선 계보를 이루지는 않는다. WGAN loss에 StyleGAN generator를 쓸 수도 있고 condition과 spectral normalization을
          함께 넣을 수도 있다. Dataset 크기·condition fidelity·resolution·latency·license·재현 가능한 checkpoint를 먼저 정한 뒤 필요한
          축만 선택한다.
        </p>
      </div>
      <DesignAxisViz />
      <div
        id="paper-conditional-gan"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Conditional distribution
        </p>
        <p className="mt-2 text-sm font-semibold">
          Conditional Generative Adversarial Nets
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Label y를 generator와 discriminator 모두에 제공해 adversarial game을 conditional distribution으로 확장하고 MNIST와
          image tagging 예를 제시합니다. Condition을 입력했다는 사실만으로 모델이 그 조건을 정확히 따른다고 볼 수는 없습니다. Train 밖의 조합으로 일반화한다는
          보장도 마찬가지입니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1411.1784"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 conditional objective·실험 보기
        </a>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>
          FID 하나로 sample quality와 mode coverage를 모두 확정할 수는 없다
        </h3>
        <p>
          FID는 fixed feature extractor에서 real과 generated feature를 각각 Gaussian으로 근사해 평균과 covariance 차이를 계산한다.
          낮을수록 두 feature distribution이 가깝다. 다만 encoder·preprocessing·sample count·real reference split에 민감하다.
          Memorization·condition consistency·rare mode coverage·human utility는 별도 metric과 nearest-neighbor
          audit가 필요하다.
        </p>
      </div>
      <ExplainedFormula
        question="FID는 real과 generated feature distribution의 어떤 두 통계를 비교할까?"
        idea={
          <>
            Pretrained Inception feature를 뽑아 각 집합을 Gaussian으로 근사하고,
            평균 위치 차이와 covariance shape 차이를 더합니다.
          </>
        }
        formula={String.raw`\begin{aligned}\operatorname{FID}&=\lVert\mu_r-\mu_g\rVert_2^2\\&\quad+\operatorname{Tr}\!\left(C_r+C_g-2(C_rC_g)^{1/2}\right)\end{aligned}`}
        terms={[
          {
            symbol: "\\mu_r,\\mu_g",
            name: "feature means",
            description:
              "Real·generated sample의 fixed encoder feature 평균입니다.",
          },
          {
            symbol: "C_r,C_g",
            name: "feature covariances",
            description:
              "두 sample 집합의 feature 방향별 spread와 correlation입니다.",
          },
          {
            symbol: "\\operatorname{Tr}",
            name: "trace",
            description: "Covariance discrepancy의 diagonal sum을 취합니다.",
          },
          {
            symbol: "(C_rC_g)^{1/2}",
            name: "matrix square root term",
            description: "두 covariance geometry가 겹치는 정도를 반영합니다.",
          },
        ]}
        assumptions={[
          "Feature distribution을 Gaussian의 1·2차 moment로 요약하고 fixed compatible Inception pipeline을 사용합니다.",
          "Finite-sample estimator에는 bias가 있으며 서로 다른 sample 수·preprocessing의 점수를 직접 비교하지 않습니다.",
        ]}
        interpretation="FID가 낮다는 것은 선택한 feature space에서 두 집합의 평균과 covariance가 가깝다는 뜻입니다. 개별 image의 사실성, condition 정답률, 모든 mode의 coverage나 training-data memorization을 단독으로 증명하지 않습니다."
      />
      <div
        id="paper-ttur-fid"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · TTUR와 FID</p>
        <p className="mt-2 text-sm font-semibold">
          GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash
          Equilibrium
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Two-time-scale stochastic approximation 조건 아래 local stationary Nash equilibrium 수렴을 분석하고 FID를 소개합니다.
          정리의 step-size·regularity 가정은 임의의 finite deep GAN recipe에 자동으로 적용되지 않습니다. FID 역시 선택한 feature·sample
          estimator에 딸린 metric입니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1706.08500"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 수렴 전제·FID 정의·실험 보기
        </a>
      </div>

      <div
        id="paper-generative-pr"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Quality와 coverage 분리
        </p>
        <p className="mt-2 text-sm font-semibold">
          Assessing Generative Models via Precision and Recall
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Scalar divergence 하나로 구분하기 어려운 sample quality와 target-mode coverage를 precision·recall 두 축으로 나눕니다. 다만
          특정 feature representation과 finite sample algorithm에 의존합니다. 모든 의미적 다양성을 완전히 재는 보편 지표로 쓸 수는 없습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1806.00035"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 정의·algorithm·failure 비교 보기
        </a>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Diffusion과는 품질 순위보다 system contract로 비교한다</h3>
        <p>
          GAN generator는 보통 한 번의 forward로 sample을 만들어 sampling latency가 낮은 것이 강점이다. 대신 adversarial game과
          coverage를 관리해야 한다. Diffusion은 여러 denoising step 때문에 network evaluation 수가 늘어나는 대신 objective와
          coverage가 다루기 쉬운 경우가 많다. 같은 resolution·condition·data·compute에서 FID뿐 아니라 precision/recall, condition
          metric, latency·memory·energy, 사용자 평가를 함께 본다.
        </p>
        <p>
          Forward·reverse process와 sampling step, latent diffusion의 계산은{" "}
          <Link to="/ai/diffusion-models">Diffusion Models 정본 글</Link>에서
          이어진다.
        </p>
      </div>
    </section>
  );
}
