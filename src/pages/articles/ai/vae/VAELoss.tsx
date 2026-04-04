import VAELossViz from './viz/VAELossViz';

export default function VAELoss() {
  return (
    <section id="vae-loss" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 함수: 재구성 + KL Divergence</h2>
      <div className="not-prose mb-8"><VAELossViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <h3 className="text-xl font-semibold mt-6 mb-3">1. 재구성 손실 (MSE)</h3>
        <p>
          원본 x와 복원 x̂의 차이를 측정한다.
        </p>
        <ul>
          <li>(0.80 - 0.73)² = 0.0049</li>
          <li>(0.40 - 0.45)² = 0.0025</li>
          <li>(0.60 - 0.52)² = 0.0064</li>
        </ul>
        <p>
          <strong>MSE = (0.0049 + 0.0025 + 0.0064) / 3 = 0.0046</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2. KL Divergence</h3>
        <p>
          학습된 분포 q(z|x) = N(μ, σ²)를 표준 정규분포 N(0, 1)에 가깝게 만드는 항이다.<br />
          너무 자유로운 분포를 정규화하여 잠재 공간을 매끄럽게 유지한다.
        </p>
        <p>
          공식: <strong>KL = -0.5 × Σ(1 + log σ² - μ² - σ²)</strong>
        </p>
        <ul>
          <li>dim 1: σ² = exp(-0.8) = 0.449, μ² = 0.1225</li>
          <li>→ -(1 + (-0.8) - 0.1225 - 0.449) = 0.372</li>
          <li>dim 2: σ² = exp(-1.2) = 0.301, μ² = 0.0144</li>
          <li>→ -(1 + (-1.2) - 0.0144 - 0.301) = 0.516</li>
        </ul>
        <p>
          <strong>KL = 0.5 × (0.372 + 0.516) = 0.444</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3. 총 손실</h3>
        <p>
          <strong>Loss = MSE + KL = 0.0046 + 0.444 = 0.449</strong><br />
          이 값을 역전파하여 인코더와 디코더의 가중치를 동시에 업데이트한다.<br />
          재구성을 잘 하면서도 잠재 공간이 정규분포에 가까워지도록 균형을 맞춘다.
        </p>
      </div>
    </section>
  );
}
