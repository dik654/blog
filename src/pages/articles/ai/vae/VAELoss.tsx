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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">KL Divergence 폐형해 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// KL Divergence of two Gaussians
//
// 일반적 정의:
//   KL(q || p) = ∫ q(x) · log[q(x) / p(x)] dx
//
// q = N(μ_1, σ_1²), p = N(μ_2, σ_2²) 두 Gaussian의 KL:
//
//   KL(q || p) = log(σ_2/σ_1) + (σ_1² + (μ_1 - μ_2)²) / (2σ_2²) - 0.5
//
// VAE의 특수 경우: p = N(0, 1)
//   μ_2 = 0, σ_2 = 1
//
//   KL(N(μ, σ²) || N(0, 1))
//   = log(1/σ) + (σ² + μ²)/2 - 0.5
//   = -log σ + σ²/2 + μ²/2 - 0.5
//   = -0.5·log σ² + 0.5·σ² + 0.5·μ² - 0.5
//   = -0.5·(1 + log σ² - σ² - μ²)
//
// 다차원 (d개 독립 차원):
//   KL = -0.5 · Σ_i (1 + log σ_i² - σ_i² - μ_i²)
//
// PyTorch 구현:
//   kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())

// 각 항 해석:
//   -1:        상수 (정규화)
//   -log σ²:   분산 축소 억제 (σ가 너무 작아지지 않음)
//   +σ²:       분산이 크면 페널티
//   +μ²:       평균이 0에서 멀면 페널티
//
// 균형점:
//   최적: μ = 0, σ² = 1 → KL = 0
//   → prior와 정확히 일치
//   → 하지만 이러면 재구성 불가
//   → 재구성 loss와 경쟁 관계`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Loss 균형과 β-VAE</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Loss 간 균형의 딜레마
//
// L = L_recon + L_KL
//
// 극단 1: L_KL = 0
//   → μ=0, σ=1 (완전 prior)
//   → 모든 입력이 같은 분포로 인코딩
//   → 정보 손실 완전, 재구성 불가
//
// 극단 2: L_recon = 0
//   → 완벽 재구성
//   → 잠재 공간 매우 분산
//   → 샘플링 불가능 (KL 매우 큼)
//
// 적절한 균형 필요 → β-VAE 등장

// β-VAE (Higgins et al. 2017):
//
//   L = L_recon + β · L_KL
//
// β 조정의 효과:
//   β = 0: 일반 AE (KL 무시)
//   β = 1: 표준 VAE
//   β > 1: Disentanglement 강화
//   β < 1: 재구성 품질 향상
//
// β > 1일 때:
//   - 각 latent 차원이 독립적 factor 포착
//   - 예: 차원 1=회전, 차원 2=크기, 차원 3=색상
//   - 해석 가능한 표현
//
// 단점:
//   - β 너무 크면 재구성 품질 저하
//   - β=4~10 일반적

// 다른 변형:
//   - β-TCVAE: Total Correlation 분해
//   - FactorVAE: discriminator로 독립성 강화
//   - InfoVAE: MMD로 KL 대체`}
        </pre>
        <p className="leading-7">
          요약 1: KL(N(μ,σ²)‖N(0,1))은 <strong>해석적 폐형해</strong> — Monte Carlo 불필요.<br />
          요약 2: VAE loss는 <strong>재구성-KL 경쟁</strong> — 균형이 핵심.<br />
          요약 3: <strong>β-VAE</strong>는 β로 균형 조정 — disentanglement 제어.
        </p>
      </div>
    </section>
  );
}
