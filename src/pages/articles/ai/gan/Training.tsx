import ExplainedFormula from "@/components/ui/explained-formula";
import AlternatingGameViz from "./viz/AlternatingGameViz";
import FailureDiagnosisViz from "./viz/FailureDiagnosisViz";

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GAN 학습은 하나의 loss를 내리는 과정이 아니라 움직이는 상대를 추적하는
        game이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Discriminator와 generator는 서로 다른 optimizer와 mini-batch
          gradient를 가진다. D step에서는 <code>G(z).detach()</code>로 generator
          graph를 끊어 D만 update하고, G step에서는 D parameter update를 막되{" "}
          <code>D(G(z))</code>를 통과하는 input gradient는 유지한다. D 출력
          전체를 detach하면 generator가 배울 signal도 사라진다.
        </p>
        <p>
          Batch 64, latent dimension 128, RGB 64×64 설정이라면
          <code>z</code>는 64×128이고 <code>G(z)</code>는 64×3×64×64입니다.
          Discriminator가 sample마다 logit 하나를 내면 output은 64 또는
          64×1입니다. D step에서 generated tensor만 detach하며, G step에서 D의
          weight update를 막더라도 generated input까지 이어지는 gradient는
          남겨야 합니다.
        </p>
        <p>
          Update ratio·두 learning rate·optimizer momentum·regularization은 저마다 떨어진 “팁”처럼 보이지만 실은 같은 dynamical
          system의 시간 scale을 함께 정한다. TTUR 연구는 G와 D에 다른 learning rate를 두는 조건을 분석했다. 다만 그 수렴 정리를 finite deep GAN의
          모든 설정에 자동으로 적용되는 recipe로 읽을 수는 없다.
        </p>
        <p>
          TTUR의 stochastic-approximation 해석은 두 step-size sequence의 합은
          무한, 제곱합은 유한이고 두 time scale의 비율이 0으로 가며, noise와
          iterate가 제어되고 limiting ODE의 local equilibrium이 안정적이라는
          전제를 둡니다. 고정 learning rate의 finite Adam run은 이 조건을 자동
          만족하지 않습니다. 가장 단순한 bilinear game
          <code>minₓ maxᵧ xy</code>에서도 simultaneous gradient update는 원점으로
          곧장 내려가지 않고 회전하거나 step size에 따라 발산할 수 있으므로,
          한 player의 loss 감소를 고정 scalar objective의 수렴으로 읽지 않습니다.
        </p>
      </div>
      <AlternatingGameViz />
      <ExplainedFormula
        question="Generator parameter는 discriminator가 만든 data-space 방향을 어떻게 전달받을까?"
        idea={
          <>
            Chain rule을 펼치면 discriminator loss가 generated image를 어느
            방향으로 바꾸고 싶은지 먼저 계산하고, generator Jacobian이 그 방향을
            parameter update로 옮깁니다.
          </>
        }
        formula={String.raw`\begin{aligned}\widetilde x&=G_\theta(z)\\\nabla_\theta\mathcal L_G&=\mathbb E_z\!\left[J_{G_\theta}(z)^\top\nabla_{\widetilde x}\ell_D(\widetilde x)\right]\end{aligned}`}
        terms={[
          {
            symbol: "J_{G_\\theta}(z)",
            name: "generator Jacobian",
            description:
              "θ의 작은 변화가 generated sample 각 성분을 어떻게 바꾸는지 나타냅니다.",
          },
          {
            symbol: "\\nabla_{\\widetilde x}\\ell_D",
            name: "data-space signal",
            description:
              "현재 discriminator가 fake sample을 어느 방향으로 옮기면 loss가 줄어드는지 주는 vector입니다.",
          },
          {
            symbol: "J^\\top v",
            name: "vector-Jacobian product",
            description:
              "Data-space signal을 parameter space gradient로 pull back합니다.",
          },
        ]}
        assumptions={[
          "G와 D가 해당 step에서 differentiable하며 stochastic gradient expectation을 mini-batch로 근사합니다.",
          "D가 data manifold 사이에서 의미 없는 sharp boundary를 만들면 generator가 받는 방향도 유용하지 않을 수 있습니다.",
        ]}
        interpretation="Discriminator의 역할은 최종 classifier를 제공하는 것이 아니라 generator가 직접 계산할 수 없는 distribution discrepancy의 학습 방향을 만드는 것입니다. 그래서 D의 capacity와 smoothness가 G의 학습 신호 품질에 직결됩니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>
          Mode collapse는 낮은 다양성만이 아니라 game의 feedback failure다
        </h3>
        <p>
          Mode collapse에서는 서로 다른 latent가 비슷한 몇 종류의 sample로 mapping된다. 현재 discriminator가 높은 score를 주는 좁은 영역으로
          많은 z가 몰려도 한동안은 generator loss가 좋아질 수 있다. D가 이를 잡으면 다시 다른 mode로 이동하며 oscillation하기도 한다. Average
          loss만으로 quality·coverage·stability를 동시에 진단할 수 없는 이유다.
        </p>
        <p>
          같은 크기의 target mode가 8개인데 generated sample 10,000개의 95%가 2개 mode에 몰렸다면 몇 장이 선명하더라도 먼저 낮은 coverage를
          의심해야 합니다. Mode별 sample count와 generative recall, 서로 다른 latent를 넣었을 때 출력이 달라지는지를 함께 봅니다. 중복 sample 한
          쌍이나 흔들리는 loss 하나만으로 collapse를 확정하지는 않습니다.
        </p>
      </div>
      <FailureDiagnosisViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>WGAN은 sigmoid classifier를 1-Lipschitz critic으로 바꾼다</h3>
        <p>
          Real과 generated distribution이 낮은 차원 manifold에 놓여 support가 거의 겹치지 않으면 JS 계열 signal이 포화될 수 있다. WGAN은
          scalar critic이 만드는 expectation 차이로 Wasserstein-1 distance의 Kantorovich–Rubinstein dual을 근사한다. 이때
          critic 출력은 probability가 아니다. 핵심 전제는 function이 1-Lipschitz family에 머무는 것이다.
        </p>
        <p>
          1-Lipschitz는 모든 두 입력에 대해
          <code>|f(x)−f(y)|≤||x−y||₂</code>라는 뜻입니다. 두 점의 거리가 0.2인데
          score 차이가 0.3이면 조건을 위반합니다. 반면 WGAN-GP는 real과 fake를
          이은 선분에서 뽑은 일부 지점의 gradient만 검사하므로, 그 penalty가
          작아도 전체 입력 공간에서 같은 부등식이 성립한다고 보장할 수는
          없습니다.
        </p>
      </div>
      <ExplainedFormula
        question="WGAN critic은 두 distribution 사이의 어떤 차이를 최대화할까?"
        idea={
          <>
            모든 1-Lipschitz 함수 가운데 real에서는 높고 fake에서는 낮은
            expectation 차이를 가장 크게 만드는 함수를 찾습니다. Generator는 이
            차이를 줄이는 반대 방향으로 움직입니다.
          </>
        }
        formula={String.raw`\begin{aligned}\Delta_f&=\mathbb E_{x\sim p_r}f(x)-\mathbb E_{\widetilde x\sim p_g}f(\widetilde x)\\W_1(p_r,p_g)&=\sup_{\lVert f\rVert_L\le1}\Delta_f\end{aligned}`}
        terms={[
          {
            symbol: "W_1",
            name: "Wasserstein-1 distance",
            description:
              "Mass를 옮기는 cost로 정의되는 distribution distance입니다.",
          },
          {
            symbol: "\\Delta_f",
            name: "critic expectation gap",
            description:
              "한 critic이 real과 generated distribution에 부여한 평균 score 차이입니다.",
          },
          {
            symbol: "f",
            name: "critic",
            description:
              "Real-valued score를 출력하며 sigmoid probability가 아닙니다.",
          },
          {
            symbol: "\\lVert f\\rVert_L\\le1",
            name: "Lipschitz constraint",
            description:
              "입력 거리에 비해 critic 출력이 너무 빠르게 변하지 않도록 제한합니다.",
          },
          {
            symbol: "\\sup",
            name: "best critic",
            description:
              "허용된 function family에서 expectation gap의 상한을 찾습니다.",
          },
        ]}
        assumptions={[
          "Kantorovich–Rubinstein dual이 성립하는 공간·moment 조건과 이상적인 1-Lipschitz function family를 전제합니다.",
          "Neural critic과 regularizer는 이 supremum과 constraint를 근사할 뿐입니다.",
        ]}
        interpretation="WGAN의 장점은 이름을 바꾸는 데 있지 않고 distribution support가 떨어져도 generator parameter에 대해 더 연속적인 signal을 기대할 수 있다는 데 있습니다. Critic constraint가 깨지면 distance 해석도 함께 약해집니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          1차원 point mass <code>δ₀</code>와 <code>δ₂</code>는 질량 1을 거리 2만큼
          옮겨야 하므로 primal transport cost가 2입니다. Dual에서도
          <code>f(x)=−x</code>는 1-Lipschitz이고
          <code>Eδ₀[f]−Eδ₂[f]=2</code>에 도달합니다. Lipschitz 제약이 없다면
          <code>cf</code>로 scale을 계속 키워 expectation gap을 무한히 만들 수
          있어 distance로 해석할 수 없습니다.
        </p>
      </div>
      <div
        id="paper-wgan"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Wasserstein critic
        </p>
        <p className="mt-2 text-sm font-semibold">Wasserstein GAN</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Distribution support가 떨어진 상황에서 divergence topology와 generator continuity를 분석하고 1-Lipschitz critic의
          expectation gap을 사용합니다. Neural critic과 weight clipping은 어디까지나 이상적인 Wasserstein distance의 근사입니다. 논문이
          보고한 안정성 관찰만으로 mode collapse가 보편적으로 사라졌다고 읽을 수는 없습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1701.07875"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 distance·정리·algorithm 보기
        </a>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>
          Gradient penalty와 spectral normalization은 서로 다른 constraint다
        </h3>
        <p>
          Original WGAN의 weight clipping은 parameter를 좁은 상자에 넣어 function family를 거칠게 제한하며 capacity loss와
          vanishing/exploding gradient를 만들 수 있다. WGAN-GP는 real과 fake 사이 interpolation에서 input-gradient norm을
          1에 가깝게 penalty한다. Spectral normalization은 각 linear weight의 가장 큰 singular value로 weight를 나눠 layer
          operator norm을 제한한다. 둘은 적용 위치와 보장 범위가 다르므로 이름만 보고 교체하지 않는다.
        </p>
      </div>
      <ExplainedFormula
        question="WGAN-GP는 sampled path에서 critic의 기울기를 어떻게 제한할까?"
        idea={
          <>
            Real x와 fake x̃를 이은 선분 위에서 x̂를 뽑고, 그 지점의
            input-gradient norm이 1에서 벗어난 만큼 제곱 penalty를 줍니다.
          </>
        }
        formula={String.raw`\mathcal L_{\mathrm{GP}}=\lambda\,\mathbb E_{\widehat x}\left(\lVert\nabla_{\widehat x}f(\widehat x)\rVert_2-1\right)^2`}
        terms={[
          {
            symbol: "\\widehat x",
            name: "interpolated sample",
            description:
              "Real과 generated sample 사이에서 뽑은 critic 입력입니다.",
          },
          {
            symbol: "\\nabla_{\\widehat x}f",
            name: "input gradient",
            description:
              "그 위치에서 critic output이 input 변화에 반응하는 속도입니다.",
          },
          {
            symbol: "\\lambda",
            name: "penalty weight",
            description:
              "Adversarial objective와 gradient constraint 사이의 상대 강도입니다.",
          },
        ]}
        assumptions={[
          "선분 위 sampled point에서만 penalty를 측정하며 전체 input space에서 정확한 1-Lipschitz를 증명하지 않습니다.",
          "WGAN-GP recipe에서는 critic architecture와 normalization 선택도 원 논문 조건을 확인해야 합니다.",
        ]}
        interpretation="Gradient norm을 1로 만드는 penalty는 local sampled constraint입니다. 모든 GAN에 무조건 붙이는 안정성 보증서가 아니며 λ·critic steps·batch와 함께 검증합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sampled point에서 gradient norm이 1.5이고 <code>λ=10</code>이라면 해당
          penalty는 <code>10(1.5−1)²=2.5</code>입니다. 이 계산은 input과 추가
          backward가 필요한 local penalty이며, 아래 spectral normalization처럼
          weight를 한 번 rescale하는 방식과 비용 구조가 다릅니다.
        </p>
      </div>
      <div
        id="paper-wgan-gp"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Sampled gradient constraint
        </p>
        <p className="mt-2 text-sm font-semibold">
          Improved Training of Wasserstein GANs
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Weight clipping이 critic capacity와 gradient에 만드는 문제를 분석하고 real–fake interpolation의 input-gradient
          norm penalty를 제안합니다. 이 penalty는 sample한 path 위에서만 걸리는 근사 제약입니다. 전체 input space의 정확한 1-Lipschitz
          보증까지는 가지 못합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1704.00028"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 clipping 분석·penalty·실험 보기
        </a>
      </div>
      <ExplainedFormula
        question="Spectral normalization은 linear layer가 vector를 확대하는 최대 비율을 어떻게 제한할까?"
        idea={
          <>
            Weight matrix의 largest singular value로 전체 matrix를 나누면 해당
            layer의 operator norm을 설정한 scale에 맞출 수 있습니다.
          </>
        }
        formula={String.raw`\overline W=\frac{W}{\sigma_{\max}(W)}`}
        terms={[
          {
            symbol: "W",
            name: "weight matrix",
            description:
              "Convolution도 적절한 linear operator 형태로 보는 layer parameter입니다.",
          },
          {
            symbol: "\\sigma_{\\max}(W)",
            name: "largest singular value",
            description:
              "L2 기준으로 input vector를 가장 크게 확대하는 비율입니다.",
          },
          {
            symbol: "\\overline W",
            name: "normalized weight",
            description:
              "Operator norm이 1이 되도록 rescale한 effective weight입니다.",
          },
        ]}
        assumptions={[
          "실제 구현은 power iteration으로 singular value를 근사할 수 있습니다.",
          "Layer별 norm 제한이 전체 critic의 정확한 optimal 1-Lipschitz 함수나 좋은 generator를 보장하지 않습니다.",
        ]}
        interpretation="Spectral normalization은 data point마다 gradient penalty를 계산하지 않고 weight의 global scale을 제어합니다. GP와 계산 비용·function constraint 방식이 다릅니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          예를 들어 <code>W=diag(3,1)</code>의 largest singular value는 3이므로
          normalized weight는 <code>diag(1,1/3)</code>입니다. 한 linear layer의
          L2 operator norm은 1이 되지만, bias·activation·skip addition과 여러
          branch까지 합친 전체 critic의 tight Lipschitz constant가 자동으로
          1이 되는 것은 아닙니다.
        </p>
      </div>
      <div
        id="paper-spectral-normalization"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Weight operator constraint
        </p>
        <p className="mt-2 text-sm font-semibold">
          Spectral Normalization for Generative Adversarial Networks
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Discriminator weight의 spectral norm을 가볍게 제한하는 normalization과 CIFAR-10·STL-10·ImageNet 실험을 제시합니다. 다만
          layer별 operator norm 제한이 닿는 범위는 거기까지입니다. 전체 game의 global convergence나 optimal critic까지 보장하지는 못합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1802.05957"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 normalization·분석·평가 보기
        </a>
      </div>
    </section>
  );
}
