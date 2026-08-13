import ExplainedFormula from "@/components/ui/explained-formula";

export default function VAELoss() {
  return (
    <section id="vae-loss" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ELBO는 data fit과 posterior regularization을 한 식에 묶는다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Evidence lower bound(ELBO)는 계산하기 어려운 <code>log pθ(x)</code>의
          lower bound다. 첫 항은 sampled <code>z</code>에서 관측값을 잘 설명하도록
          decoder를 학습하고, 두 번째 KL은 approximate posterior가 prior에서
          얼마나 멀어졌는지 측정한다. 학습 code에서는 ELBO를 최대화하거나 그
          음수를 loss로 최소화한다.
        </p>
        <p>
          Reconstruction “loss”는 독립된 임의의 거리 함수가 아니라
          <code>−log pθ(x|z)</code>다. Gaussian likelihood의 variance를 고정하면
          scaled MSE 형태가 되고, Bernoulli likelihood에서는 binary cross-entropy
          형태가 된다. Sum과 mean reduction, image dimension, variance 설정에 따라
          KL과의 상대 scale도 달라지므로 서로 다른 구현의 숫자를 그대로 비교하면
          안 된다.
        </p>

        <h3>Diagonal Gaussian의 KL은 closed form으로 계산한다</h3>
        <p>
          Prior가 <code>N(0,I)</code>이고 encoder posterior가 diagonal Gaussian이면
          KL term은 sampling 없이 직접 계산할 수 있다. Reconstruction expectation만
          reparameterized sample로 근사한다.
        </p>
      </div>

      <ExplainedFormula
        question="계산하기 어려운 log evidence를 어떤 objective로 낮춰 학습할까?"
        idea={<>approximate posterior q를 도입해 Jensen inequality를 적용하면, decoder의 data fit과 posterior–prior KL로 계산 가능한 lower bound가 나옵니다.</>}
        formula={String.raw`\log p_\theta(x)\ge \mathcal L(x)=\mathbb E_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)]-\operatorname{KL}\!\left(q_\phi(z\mid x)\,\|\,p(z)\right)`}
        terms={[
          { symbol: "\log p_\theta(x)", name: "log evidence", description: "latent를 적분한 data likelihood이며 직접 계산이 어려울 수 있습니다." },
          { symbol: "\mathbb E_q[\log p_\theta(x\mid z)]", name: "data-fit term", description: "sampled latent가 관측값을 설명하도록 decoder를 학습합니다." },
          { symbol: "\operatorname{KL}(q\|p)", name: "rate / regularizer", description: "input별 posterior가 prior와 달라지는 정보 비용입니다." },
        ]}
        assumptions={["qφ의 support가 posterior 계산에 필요한 영역을 덮고 Jensen inequality를 적용합니다.", "training code가 loss를 최소화한다면 보통 −ELBO를 구현합니다."]}
        interpretation="ELBO와 log evidence의 차이는 KL(qφ(z|x)‖pθ(z|x))입니다. 따라서 encoder family가 true posterior를 잘 근사할수록 bound가 tight해집니다."
      />
      <ExplainedFormula
        question="standard normal prior와 diagonal Gaussian posterior의 KL을 sampling 없이 어떻게 계산할까?"
        idea={<>두 Gaussian의 KL 공식을 dimension별로 적용하면 mean displacement, variance와 log-volume 차이의 합으로 정리됩니다.</>}
        formula={String.raw`\operatorname{KL}(q\|p)=-\frac12\sum_j\left(1+\log\sigma_j^2-\mu_j^2-\sigma_j^2\right)`}
        terms={[
          { symbol: "j", name: "latent dimension", description: "diagonal covariance이므로 dimension별 기여를 더합니다." },
          { symbol: "\mu_j^2", name: "mean penalty", description: "posterior 중심이 prior mean 0에서 멀어지는 비용입니다." },
          { symbol: "\sigma_j^2-\log\sigma_j^2-1", name: "scale penalty", description: "posterior variance가 prior variance 1과 달라지는 비용입니다." },
        ]}
        assumptions={["p(z)=N(0,I), q(z|x)=N(μ,diag(σ²))입니다."]}
        interpretation="μ=0이고 σ²=1인 dimension의 KL contribution은 0입니다. 모든 dimension이 그렇게 되면 latent가 input 정보를 담지 않는 posterior collapse와 연결될 수 있지만, KL=0 하나만으로 원인을 확정하지는 않습니다."
      />

      <figure className="not-prose my-8 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 sm:p-6">
        <div className="rounded-xl border bg-emerald-500/5 p-4">
          <p className="font-semibold">Data fit가 너무 강하면</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">입력별 posterior가 prior에서 멀어져 reconstruction은 좋아져도 prior sampling이 어려워질 수 있다.</p>
        </div>
        <div className="rounded-xl border bg-amber-500/5 p-4">
          <p className="font-semibold">KL이 너무 강하면</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">q(z|x)가 p(z)에 가까워지며 z가 x의 정보를 거의 담지 않는 posterior collapse가 생길 수 있다.</p>
        </div>
      </figure>
    </section>
  );
}
