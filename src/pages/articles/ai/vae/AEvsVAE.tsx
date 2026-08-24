import ExplainedFormula from "@/components/ui/explained-formula";

export default function AEvsVAE() {
  return (
    <section id="ae-vs-vae" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Autoencoder와 VAE는 latent code에 묻는 질문이 다르다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          일반 autoencoder는 입력을 결정론적 code <code>z=f(x)</code>로 압축하고
          reconstruction error를 줄인다. 이 목적만으로는 training code 사이의
          빈 영역에서 decoder가 어떤 출력을 내야 하는지 정해지지 않으므로,
          prior에서 random sample을 뽑아 생성하는 모델이 자동으로 되지는 않는다.
        </p>
        <p>
          VAE encoder는 한 점 대신 distribution <code>qφ(z|x)</code>의 parameter를
          내고, 그 posterior가 prior <code>p(z)</code>에서 지나치게 멀어지지 않도록
          KL term을 둔다. 이 제약은 prior sample을 decoder에 넣을 수 있는 조건을
          만든다. 다만 latent space가 반드시 “구멍 없이 완전히 채워지거나” 각
          dimension이 사람에게 해석 가능한 요인으로 나뉜다고 보장하지는 않는다.
        </p>
      </div>

      <ExplainedFormula
        question="같은 encoder–decoder 모양이어도 AE와 VAE의 latent contract는 어떻게 다를까?"
        idea={<>AE는 input마다 code 한 점을 정하지만, VAE는 input마다 latent distribution의 parameter를 정합니다. 후자는 prior와 비교할 수 있어 generative sampling objective를 구성할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
          \text{AE: }z&=f_\phi(x) \\
          \text{VAE: }q_\phi(z\mid x)
          &=\mathcal N\!\left(\mu_\phi(x),\Sigma_\phi(x)\right) \\
          \Sigma_\phi(x)&=\operatorname{diag}\!\left(\sigma_\phi^2(x)\right)
        \end{aligned}`}
        terms={[
          { symbol: "f_\\phi(x)", name: "deterministic code", description: "같은 input은 같은 latent point로 갑니다." },
          { symbol: "q_\\phi(z\\mid x)", name: "approximate posterior", description: "true posterior pθ(z|x)를 encoder가 근사합니다." },
          { symbol: String.raw`\Sigma_\phi(x)`, name: "diagonal covariance", description: "diag(σ²)로 두어 latent dimension 사이 posterior covariance를 0으로 만드는 tractable한 선택입니다." },
        ]}
        assumptions={["기본 Gaussian VAE와 deterministic autoencoder를 비교합니다.", "VAE라는 이름이 모든 stochastic autoencoder 변형을 뜻하지는 않습니다."]}
        interpretation="distribution을 출력한다는 사실만으로 latent가 disentangle되거나 빈틈 없이 채워지지는 않습니다. 그 효과는 ELBO의 KL, decoder likelihood와 model capacity에 함께 달려 있습니다."
      />

      <figure className="not-prose my-8 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 sm:p-6">
        <div className="rounded-xl border bg-sky-500/5 p-4">
          <p className="font-semibold text-sky-700 dark:text-sky-300">Autoencoder</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">입력별 code와 reconstruction에 집중한다. Representation learning과 compression에 직접적이다.</p>
        </div>
        <div className="rounded-xl border bg-violet-500/5 p-4">
          <p className="font-semibold text-violet-700 dark:text-violet-300">Variational autoencoder</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Posterior distribution과 prior를 함께 다뤄 sampling 가능한 generative model을 학습한다.</p>
        </div>
      </figure>
    </section>
  );
}
