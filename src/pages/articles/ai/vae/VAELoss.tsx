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
      </div>

      <ExplainedFormula
        question="관측값의 종류를 정하면 reconstruction NLL은 어떤 모양이 될까?"
        idea={<>Binary 관측은 각 위치의 Bernoulli log probability를, fixed-variance continuous 관측은 Gaussian log probability를 더합니다. 따라서 BCE와 scaled MSE는 임의로 붙인 loss가 아니라 decoder likelihood에서 나옵니다.</>}
        formula={String.raw`\begin{aligned}
          \ell_{\mathrm B}
          &=-\sum_i x_i\log\pi_i \\
          &\quad-\sum_i(1-x_i)\log(1-\pi_i) \\
          \ell_{\mathrm G}
          &=\sum_i\frac{(x_i-\mu_i)^2}{2s^2}+C
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          \ell_{\mathrm B}
          &=\underbrace{-\sum_i x_i\log\pi_i}_{\text{로그 비용 변환}} \\
          &\quad-\sum_i(1-x_i)\log(1-\pi_i) \\
          \ell_{\mathrm G}
          &=\underbrace{\sum_i\frac{(x_i-\mu_i)^2}{2s^2}+C}_{\text{기준량당 비율}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`-\sum_i x_i\log\pi_i`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Binary 관측은 각 위치의 Bernoulli log","probability를, fixed-variance","continuous 관측은 Gaussian log"] },
          { expression: String.raw`\sum_i\frac{(x_i-\mu_i)^2}{2s^2}+C`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Binary 관측은 각 위치의 Bernoulli log","probability를, fixed-variance","continuous 관측은 Gaussian log"] },
        ]}
        terms={[
          { symbol: "x_i", name: "observation", description: "Bernoulli에서는 0 또는 1, Gaussian에서는 연속값입니다." },
          { symbol: String.raw`\pi_i`, name: "Bernoulli probability", description: "Decoder sigmoid가 예측한 binary event probability입니다." },
          { symbol: String.raw`\mu_i,s^2`, name: "Gaussian parameters", description: "Decoder mean과 이 식에서 고정한 observation variance입니다." },
          { symbol: "C", name: "constant term", description: "s가 고정됐을 때 parameter gradient에 영향을 주지 않는 normalizing term입니다." },
        ]}
        assumptions={["관측 dimension은 conditionally independent하다고 두고 위치별 log probability를 더합니다.", "Categorical 관측에는 class logits의 cross-entropy NLL을 쓰며 위 Bernoulli 식을 그대로 쓰지 않습니다."]}
        interpretation="Gaussian variance s²가 작아지면 같은 squared error의 계수 1/(2s²)가 커집니다. 또한 pixel sum을 mean으로 바꾸면 reconstruction과 KL의 상대 scale이 달라지므로 likelihood·reduction·차원을 함께 기록해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Diagonal Gaussian의 KL은 closed form으로 계산한다</h3>
        <p>
          Prior가 <code>N(0,I)</code>이고 encoder posterior가 diagonal Gaussian이면
          KL term은 sampling 없이 직접 계산할 수 있다. Reconstruction expectation만
          reparameterized sample로 근사한다. 유도할 때는
          <code>Eq[log q(z|x)−log p(z)]</code>를 dimension별로 전개한 뒤
          <code>Eq[(z−μ)²]=σ²</code>와 <code>Eq[z²]=μ²+σ²</code>를 대입하면
          아래 식을 얻습니다. Posterior가 mixture이거나 full covariance라면 이
          dimension별 전개를 그대로 적용할 수 없습니다.
        </p>
      </div>

      <ExplainedFormula
        question="계산하기 어려운 log evidence를 어떤 objective로 낮춰 학습할까?"
        idea={<>approximate posterior q를 도입해 Jensen inequality를 적용하면, decoder의 data fit과 posterior–prior KL로 계산 가능한 lower bound가 나옵니다.</>}
        formula={String.raw`\begin{aligned}
          D(x)&=\mathbb E_{q_\phi(z\mid x)}
          [\log p_\theta(x\mid z)] \\
          R(x)&=\operatorname{KL}\!\left(q_\phi(z\mid x)\,\|\,p(z)\right) \\
          \mathcal L(x)&=D(x)-R(x) \\
          \log p_\theta(x)&\ge\mathcal L(x)
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          D(x)&=\underbrace{\mathbb E_{q_\phi(z\mid x)}
          [\log p_\theta(x\mid z)]}_{\text{확률 가중 평균}} \\
          R(x)&=\underbrace{\operatorname{KL}\!\left(q_\phi(z\mid x)\,\|\,p(z)\right)}_{\text{허용 경계 판정}} \\
          \mathcal L(x)&=\underbrace{D(x)-R(x)}_{\text{data-fit term 계산}} \\
          \log p_\theta(x)&\ge\mathcal L(x)
        \end{aligned}`}
        operations={[
          { expression: String.raw`\mathbb E_{q_\phi(z\mid x)}
          [\log p_\theta(x\mid z)]`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","approximate posterior q를 도입해","Jensen inequality를 적용하면, decoder의","data fit과 posterior–prior KL로 계산"] },
          { expression: String.raw`\operatorname{KL}\!\left(q_\phi(z\mid x)\,\|\,p(z)\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","approximate posterior q를 도입해","Jensen inequality를 적용하면, decoder의","data fit과 posterior–prior KL로 계산"] },
          { expression: String.raw`D(x)-R(x)`, annotation: ["data-fit term이(가) 식의 결과에 기여하는 방식을","계산합니다.","approximate posterior q를 도입해","Jensen inequality를 적용하면, decoder의"] },
        ]}
        terms={[
          { symbol: String.raw`\log p_\theta(x)`, name: "log evidence", description: "latent를 적분한 data likelihood이며 직접 계산이 어려울 수 있습니다." },
          { symbol: "D(x)", name: "data-fit term", description: "sampled latent가 관측값을 설명하도록 decoder를 학습하는 log-likelihood expectation입니다." },
          { symbol: "R(x)", name: "rate / regularizer", description: "input별 posterior가 prior와 달라지는 KL 정보 비용입니다." },
        ]}
        assumptions={["qφ의 support가 posterior 계산에 필요한 영역을 덮고 Jensen inequality를 적용합니다.", "training code가 loss를 최소화한다면 보통 −ELBO를 구현합니다."]}
        interpretation="ELBO와 log evidence의 차이는 KL(qφ(z|x)‖pθ(z|x))입니다. 따라서 encoder family가 true posterior를 잘 근사할수록 bound가 tight해집니다."
      />
      <ExplainedFormula
        question="standard normal prior와 diagonal Gaussian posterior의 KL을 sampling 없이 어떻게 계산할까?"
        idea={<>두 Gaussian의 KL 공식을 dimension별로 적용하면 mean displacement, variance와 log-volume 차이의 합으로 정리됩니다.</>}
        formula={String.raw`\begin{aligned}
          \operatorname{KL}(q\|p)&=\sum_j K_j \\
          K_j&=-\frac12\left(
          1+\log\sigma_j^2-\mu_j^2-\sigma_j^2
          \right)
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          \operatorname{KL}(q\|p)&=\underbrace{\sum_j K_j}_{\text{dimension contribution 계산}} \\
          K_j&=\underbrace{-\frac12\left(
          1+\log\sigma_j^2-\mu_j^2-\sigma_j^2
          \right)}_{\text{로그 비용 변환}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`\sum_j K_j`, annotation: ["dimension contribution이(가) 식의 결과에","기여하는 방식을 계산합니다.","두 Gaussian의 KL 공식을 dimension별로","적용하면 mean displacement, variance와"] },
          { expression: String.raw`-\frac12\left(
          1+\log\sigma_j^2-\mu_j^2-\sigma_j^2
          \right)`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","두 Gaussian의 KL 공식을 dimension별로","적용하면 mean displacement, variance와","log-volume 차이의 합으로 정리됩니다."] },
        ]}
        terms={[
          { symbol: "j", name: "latent dimension", description: "diagonal covariance이므로 dimension별 기여를 더합니다." },
          { symbol: "K_j", name: "dimension contribution", description: "j번째 posterior 축이 standard normal prior에서 벗어난 KL 비용입니다." },
          { symbol: String.raw`\mu_j^2`, name: "mean penalty", description: "posterior 중심이 prior mean 0에서 멀어지는 비용입니다." },
          { symbol: String.raw`\sigma_j^2-\log\sigma_j^2-1`, name: "scale penalty", description: "posterior variance가 prior variance 1과 달라지는 비용입니다." },
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
