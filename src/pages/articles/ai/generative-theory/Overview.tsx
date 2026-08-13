import ContentBoundary from "@/components/articles/content-boundary";
import DistributionTargetViz from "./viz/DistributionTargetViz";
import TractabilityMapViz from "./viz/TractabilityMapViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        생성 모델은 무엇을 생성하느냐보다 확률분포를 어떻게 다루느냐에서
        갈립니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          얼굴 사진 dataset에서 새로운 얼굴을 만들거나 prompt에 맞는 이미지를
          생성하려면, 관측한 sample을 외우는 대신 그 뒤에 있는 data
          distribution을 근사해야 합니다. 조건이 없는 모델은 p(x), 조건을 받는
          모델은 p(x|c)에서 새 sample을 만들지만, density를 계산하는 능력과 좋은
          sample을 빠르게 만드는 능력은 서로 다른 요구입니다.
        </p>
        <p className="leading-8">
          <strong>Likelihood</strong>는 주어진 관측 x에 model이 부여한 probability
          또는 density를 parameter의 함수로 읽은 값입니다. 여기서
          <strong> tractable</strong>하다는 말은 “수학적으로 존재한다”가 아니라,
          학습이나 평가에 필요한 likelihood·posterior·sample을 유한한 계산량으로
          실제 구할 수 있다는 뜻입니다. Latent는 관측되지 않은 생성 원인 z,
          adversarial signal은 real과 generated sample을 구분하는 비교 신호,
          score는 log-density가 가장 빨리 증가하는 입력 방향입니다.
        </p>
        <p>
          따라서 VAE·GAN·normalizing flow·diffusion을 시간순 진화나 하나의 성능
          순위로 외우면 선택 기준을 놓치기 쉽습니다. 어떤 family는 exact
          log-likelihood를 얻기 위해 sequential order나 invertibility를
          받아들이고, 다른 family는 normalized density를 직접 계산하는 대신
          discriminator의 비교 신호나 score를 학습합니다. 이 글은 각 모델의 세부
          유도를 반복하지 않고 distribution representation, tractable objective,
          sampling path와 evaluation이라는 공통 비교 축을 정리합니다.
        </p>
      </div>

      <ContentBoundary article="generative-theory" />

      <DistributionTargetViz />
      <TractabilityMapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Explicit와 implicit이라는 한 줄 분류만으로는 부족하다</h3>
        <p>
          “Explicit model은 density를 정의하고 implicit model은 sample만
          만든다”는 구분은 출발점으로 쓸 수 있지만, diffusion처럼 variational
          bound, denoising score matching과 probability-flow ODE 해석이 겹치는
          family를 한 칸에 가두기는 어렵습니다. Density가 수학적으로
          존재하는지만 묻기보다 실제로 normalized likelihood를 계산할 수 있는지,
          어떤 surrogate를 직접 최적화하는지, sample 하나에 몇 번의 network
          evaluation이 필요한지를 함께 적어야 정확합니다.
        </p>
        <p>
          Evaluation도 같은 이유로 하나의 숫자로 합치지 않습니다. Held-out
          likelihood는 density assignment를, FID 같은 feature statistic은 sample
          set의 일부 geometry를, precision·recall은 quality와 coverage를 서로
          다른 방식으로 봅니다. Conditional generation이라면 condition
          adherence와 diversity도 따로 측정해야 합니다.
        </p>
        <h3>모델 family는 필요한 연산에서 고른다</h3>
        <p className="leading-8">
          Token likelihood와 prefix 제어가 중요하면 autoregressive factorization이
          자연스럽지만 sample 길이만큼 순차 실행해야 합니다. Exact density와
          양방향 변환이 필요하면 flow가 후보지만 같은 차원의 가역 구조를
          받아들여야 합니다. 한 번의 generator forward가 중요하고 normalized
          density가 필요 없다면 GAN을 검토할 수 있으며, 여러 network evaluation을
          감수하면서 score 기반의 유연한 생성 경로가 필요하면 diffusion 계열을
          봅니다. 어느 경우든 likelihood·quality·coverage·condition 충실도·실제
          latency를 같은 data와 hardware에서 따로 측정해야 합니다.
        </p>
      </div>
    </section>
  );
}
