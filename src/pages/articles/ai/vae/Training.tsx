import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";

const loop = [
  ["Forward", "μ·log σ² → z sample → decoder likelihood parameter"],
  ["Objective", "Monte Carlo reconstruction term + analytic KL"],
  ["Backward", "Reparameterized path로 encoder와 decoder를 함께 update"],
  [
    "Evaluate",
    "Likelihood bound·reconstruction·sample·latent usage를 분리 확인",
  ],
];

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        학습이 수렴해도 latent variable을 실제로 쓰는지 확인한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ELBO가 개선된다는 사실만으로 원하는 representation과 sample이 생겼다고
          판단할 수는 없습니다. 강한 autoregressive decoder는 <code>z</code>{" "}
          없이도
          <code>x</code>를 잘 설명해 KL을 0에 가깝게 만들 수 있고, 단순한
          Gaussian likelihood는 pixel 평균을 선호해 sample이 흐릿해 보일 수
          있다. 두 현상은 원인이 다르므로 같은 해결책으로 묶지 않습니다.
        </p>
      </div>

      <figure
        data-viz="vae-training-loop"
        className="not-prose my-8 grid gap-4 rounded-xl border border-border/75 bg-card p-4 sm:grid-cols-2 sm:p-6"
      >
        {loop.map(([title, body], index) => (
          <div key={title} className="rounded-xl border bg-background p-4">
            <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
            <p className="mt-2 font-semibold">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </figure>

      <AlgorithmBlock
        title="VAE — 한 gradient step (수렴할 때까지 반복)"
        input={["x ~ 학습 데이터", "Encoder φ, Decoder θ (무작위 초기화)"]}
        steps={[
          {
            code: "(μ, log σ²) = Encoder_φ(x)",
            note: "Encoder가 x를 직접 z로 매핑하지 않고, q(z|x)의 평균·분산 parameter를 냅니다.",
          },
          {
            code: "ε ~ N(0, I)",
            note: "z와 같은 shape의 표준 Gaussian noise를 샘플링합니다.",
          },
          {
            code: "z = μ + σ ⊙ ε",
            note: "Reparameterization trick — z를 직접 샘플링하지 않고 결정론적 함수로 만들어, encoder까지 gradient가 흐르게 합니다.",
          },
          {
            code: "x̂_params = Decoder_θ(z)",
            note: "Decoder가 z에서 x의 조건부 분포 parameter를 냅니다(연속값이면 평균, 이진값이면 Bernoulli 확률).",
          },
          {
            code: "L_recon = −log p_θ(x | z)",
            note: "연속 x는 보통 MSE(Gaussian likelihood), 이진 x는 BCE(Bernoulli likelihood)로 계산합니다.",
          },
          {
            code: "L_KL = −½ Σ(1 + log σ² − μ² − σ²)",
            note: "q(z|x)=N(μ,σ²)와 표준정규 prior 사이 KL의 closed-form입니다 — 두 Gaussian이라 적분 없이 바로 계산됩니다.",
          },
          {
            code: "(φ, θ) ← (φ, θ) − η·∇_(φ,θ) (L_recon + L_KL)",
            note: "reparameterization 덕분에 z가 φ의 미분가능한 함수라, encoder와 decoder를 한 번에 backprop할 수 있습니다.",
          },
        ]}
        output="학습된 Encoder φ, Decoder θ"
        repeatUntil="Validation ELBO가 더 개선되지 않거나 정해진 step 수에 도달할 때까지 반복합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Posterior collapse를 진단한다</h3>
        <p>
          평균 KL만 보지 말고 dimension별 KL, active unit 수, encoder를 제거했을
          때 reconstruction이 얼마나 변하는지 확인합니다. KL warm-up, free bits,
          decoder capacity 조절은 collapse를 완화할 수 있지만 각 방법이 ELBO와
          representation에 주는 trade-off를 validation해야 합니다.
        </p>
        <p>
          예를 들어 두 latent dimension의 KL이 <code>(0.40, 0.30)</code>인
          checkpoint A와 <code>(0.001, 0.002)</code>인 checkpoint B를 비교해
          봅시다. B에서 encoder의 <code>z</code>를 prior sample로 바꿔도 validation
          reconstruction이 거의 변하지 않는다면 collapse를 먼저 의심할 근거가
          됩니다. 다만 작은 rate만으로 충분한 task나 일부 dimension만 사용하는
          경우도 있으므로, 평균 KL 하나가 아니라 dimension별 값과 latent 교체
          전후의 성능 변화를 함께 봐야 합니다.
        </p>

        <div
          id="paper-posterior-collapse"
          className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            논문 읽기 · Collapse의 training dynamics
          </p>
          <p className="mt-2 text-sm font-semibold">
            Lagging Inference Networks and Posterior Collapse in Variational
            Autoencoders
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            초기 학습에서 inference network가 계속 움직이는 true posterior를
            따라가지 못하는 현상을 관찰하고, inference update를 더 수행하는
            방법을 평가합니다. 이는 collapse의 한 메커니즘과 완화법이지 모든
            decoder·dataset에서의 유일한 원인이나 보편적 해결책은 아닙니다.
          </p>
          <a
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            href="https://arxiv.org/abs/1901.05534"
            target="_blank"
            rel="noreferrer"
          >
            원 논문의 dynamics·진단·실험 보기
          </a>
        </div>

        <h3>평가 질문을 분리한다</h3>
        <p>
          Density model로서는 held-out ELBO나 importance-weighted likelihood
          estimate를 보고, reconstruction model로서는 데이터에 맞는
          distortion을, generator로서는 sample quality와 coverage를 본다. Latent
          traversal은 representation을 이해하는 보조 도구이지 disentanglement의
          정량적 증거는 아닙니다. Anomaly detection에 reconstruction error를 쓸
          때도 정상 데이터의 복원 편향과 threshold drift를 별도로 검증해야
          합니다.
        </p>

        <h3>
          더 tight한 likelihood bound가 필요하면 importance sample을 늘립니다
        </h3>
        <p>
          IWAE는 같은 encoder에서 latent를 여러 번 뽑고, joint-to-proposal
          importance weight의 평균으로 lower bound를 구성합니다. K가 커질수록
          bound는 일반적으로 더 tight해지지만, 계산량과 encoder gradient의
          signal-to-noise 특성도 달라지므로 숫자 하나만 보고 기본 ELBO보다 항상
          낫다고 판단하지 않습니다.
        </p>
        <p>
          각 weight를 <code>w=pθ(x,z)/qφ(z|x)</code>로 두면 q 아래의 기대값은
          <code>Eq[w]=pθ(x)</code>입니다. K개 weight 평균도 evidence의 unbiased
          estimator이고, concave한 log에 Jensen inequality를 적용하면 그 평균의
          log 기대값이 <code>log pθ(x)</code>보다 작거나 같아집니다. K=1에서는
          바로 ELBO가 되지만, q가 posterior의 어떤 영역에 probability 0을 두면
          sample 수를 늘려도 그 support gap을 복구할 수 없습니다.
        </p>

        <ExplainedFormula
          question="여러 latent sample로 single-sample ELBO보다 더 tight한 lower bound를 어떻게 만들까요?"
          idea={
            <>
              각 sample이 model joint p(x,z)를 proposal q(z|x)가 얼마나
              과소·과대 대표했는지 importance weight로 보정한 뒤, 그 평균의
              log를 취합니다. K=1이면 기본 ELBO와 같습니다.
            </>
          }
          formula={String.raw`\begin{aligned}
            w_k&=\frac{p_\theta(x,z_k)}{q_\phi(z_k\mid x)} \\
            \overline w_K&=\frac1K\sum_{k=1}^{K}w_k \\
            \mathcal L_K(x)&=\mathbb E[\log\overline w_K] \\
            \mathcal L_K(x)&\le\log p_\theta(x)
          \end{aligned}`}
          terms={[
            {
              symbol: "K",
              name: "importance sample count",
              description:
                "한 observation에서 encoder가 뽑는 latent sample 수입니다.",
            },
            {
              symbol: "p_\theta(x,z_k)/q_\phi(z_k\mid x)",
              name: "importance weight",
              description:
                "Proposal sample을 model joint 기준으로 다시 가중합니다.",
            },
            {
              symbol: String.raw`\mathcal L_K`,
              name: "IWAE bound",
              description:
                "K=1에서는 ELBO이며 적절한 조건에서 K가 늘면 더 tight해집니다.",
            },
          ]}
          assumptions={[
            "Importance weight가 정의되도록 q의 support가 model posterior의 필요한 영역을 덮습니다.",
            "표본은 같은 qφ(z|x)에서 뽑고 finite Monte Carlo objective를 최적화합니다.",
          ]}
          interpretation="더 tight한 bound는 likelihood estimation 관점의 이점입니다. 같은 compute에서 sample quality·representation·encoder gradient가 반드시 더 좋아진다는 보장은 아닙니다."
        />

        <div
          id="paper-iwae"
          className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            논문 읽기 · 더 tight한 bound
          </p>
          <p className="mt-2 text-sm font-semibold">
            Importance Weighted Autoencoders
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            여러 posterior sample의 importance weight를 사용해 single-sample
            ELBO보다 더 tight한 lower bound를 구성합니다. Sample 수를 늘리는
            것은 objective와 estimator의 trade-off를 바꾸며, latent
            representation이나 finite-sample gradient가 언제나 더 좋아진다고
            단정할 수는 없습니다.
          </p>
          <a
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            href="https://arxiv.org/abs/1509.00519"
            target="_blank"
            rel="noreferrer"
          >
            원 논문의 bound·estimator·평가 보기
          </a>
        </div>
      </div>
    </section>
  );
}
