import ExplainedFormula from "@/components/ui/explained-formula";

const contracts = [
  ["Encoder", "x → μ, log σ²", "분산을 양수로 만들기 쉽고 numerical range를 다루기 위해 log-variance를 출력한다."],
  ["Sampler", "ε → z", "Randomness를 parameter와 분리해 μ와 σ에 pathwise gradient를 보낸다."],
  ["Decoder", "z → pθ(x|z)", "관측값 자체가 아니라 선택한 likelihood의 parameter를 출력한다."],
];

export default function ReparamTrick() {
  return (
    <section id="reparam-trick" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Reparameterization은 sampling의 randomness를 입력 noise로 옮긴다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          “확률적 연산은 미분할 수 없다”는 설명은 너무 넓다. 문제는
          <code>z∼qφ(z|x)</code>라고 쓴 sampling node를 그대로 두면 sample이
          parameter에 어떻게 변하는지 ordinary backpropagation path가 드러나지
          않는다는 데 있다. Gaussian posterior에서는 parameter와 무관한
          <code>ε∼N(0,I)</code>를 먼저 뽑고 결정론적 변환으로 <code>z</code>를 만들 수
          있다.
        </p>
        <p>
          한 번 뽑힌 <code>ε</code>를 forward pass 안에서는 입력 상수처럼 다루면
          <code>z</code>에서 <code>μ</code>와 <code>σ</code>로 gradient가 흐른다. 이
          estimator는 Monte Carlo sample을 사용하므로 gradient에 noise가 남지만,
          score-function estimator보다 낮은 variance를 얻는 것이 일반적인 장점이다.
        </p>
      </div>

      <ExplainedFormula
        question="posterior sample을 유지하면서 encoder parameter까지 ordinary backpropagation을 어떻게 연결할까?"
        idea={<>randomness를 parameterized distribution 안에 숨기지 않고, parameter와 독립인 standard Gaussian input으로 분리합니다. 그러면 sample z는 μ와 σ의 결정론적 함수가 됩니다.</>}
        formula={String.raw`\begin{aligned}
          \ell_\phi(x)&=\log\sigma_\phi^2(x) \\
          \sigma_\phi(x)&=\exp\!\left(\tfrac12\ell_\phi(x)\right) \\
          \epsilon&\sim\mathcal N(0,I) \\
          z&=\mu_\phi(x)+\sigma_\phi(x)\odot\epsilon
        \end{aligned}`}
        terms={[
          { symbol: String.raw`\mu_\phi(x)`, name: "posterior mean", description: "encoder가 input별 latent 중심을 예측합니다." },
          { symbol: String.raw`\ell_\phi(x)`, name: "log variance", description: "양수 제약 없는 값을 출력한 뒤 exponentiation으로 variance를 만듭니다." },
          { symbol: String.raw`\epsilon`, name: "base noise", description: "encoder parameter와 독립적으로 뽑는 standard Gaussian sample입니다." },
          { symbol: String.raw`\odot`, name: "element-wise scale", description: "latent dimension마다 noise를 해당 standard deviation으로 늘립니다." },
        ]}
        assumptions={["qφ(z|x)가 diagonal Gaussian인 기본 VAE입니다.", "한 forward sample에서 ε는 backpropagation이 미분하지 않는 external random input으로 다룹니다."]}
        interpretation="z에서 μ와 σ로 pathwise gradient가 흐릅니다. Monte Carlo noise가 없어지는 것은 아니며, discrete latent에는 이 Gaussian reparameterization을 그대로 적용할 수 없습니다."
      />

      <figure data-viz="vae-reparameterization" className="not-prose my-8 grid gap-4 rounded-xl border border-border/75 bg-card p-4 md:grid-cols-3 md:p-6">
        {contracts.map(([title, value, body]) => (
          <div key={title} className="min-w-0 rounded-xl border bg-background p-4">
            <p className="font-semibold">{title}</p>
            <p className="mt-2 break-all font-mono text-xs text-primary">{value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Decoder output은 data distribution과 맞아야 한다</h3>
        <p>
          Binary data에는 Bernoulli probability, real-valued data에는 Gaussian의
          mean과 variance, category에는 categorical logits처럼
          <code>pθ(x|z)</code>를 정한다. Sigmoid와 MSE를 모든 이미지에 고정하는
          recipe가 아니라, 관측값을 어떤 확률 모델로 설명할지 결정하는 단계다.
        </p>
      </div>
    </section>
  );
}
