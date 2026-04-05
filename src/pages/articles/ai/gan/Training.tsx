import CodePanel from '@/components/ui/code-panel';
import GANTrainingViz from './viz/GANTrainingViz';

const trainCode = `# GAN 학습 루프 (PyTorch 스타일)
for epoch in range(epochs):
    # 1) Discriminator 학습
    real_labels = torch.ones(batch)
    fake_labels = torch.zeros(batch)

    z = torch.randn(batch, latent_dim)
    fake = generator(z).detach()

    d_loss = BCE(disc(real), real_labels) \\
           + BCE(disc(fake), fake_labels)
    d_loss.backward()
    opt_d.step()

    # 2) Generator 학습
    z = torch.randn(batch, latent_dim)
    g_loss = BCE(disc(generator(z)), real_labels)
    g_loss.backward()
    opt_g.step()`;

const annotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: 'D 학습: 진짜=1, 가짜=0' },
  { lines: [10, 14] as [number, number], color: 'emerald' as const, note: 'D 손실: BCE 합산' },
  { lines: [16, 20] as [number, number], color: 'amber' as const, note: 'G 학습: D를 속이도록' },
];

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 역학 & 안정성</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        D와 G를 교대 학습. Mode Collapse, 학습 불안정이 주요 과제.<br />
        WGAN — Earth Mover's Distance로 안정적 학습.
      </p>
      <GANTrainingViz />
      <div className="mt-6">
        <CodePanel title="GAN 학습 루프" code={trainCode} annotations={annotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">GAN 학습의 주요 실패 모드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Mode Collapse (모드 붕괴)
//    증상: G가 소수의 샘플만 생성 (다양성 상실)
//    예: MNIST에서 "6"만 생성
//
//    원인: G가 D를 속이는 "쉬운 해답" 찾으면 거기만 반복
//          G의 출력 다양성을 유지하는 메커니즘 부재
//
//    해결책:
//      - Unrolled GAN (D의 업데이트를 여러 스텝 미리 고려)
//      - Mini-batch Discrimination (배치 내 다양성 측정)
//      - PacGAN (여러 샘플을 묶어서 판별)
//      - WGAN / WGAN-GP (Wasserstein distance)
//
// 2. Non-convergence (학습 발산)
//    증상: G와 D의 손실이 진동, 학습 불안정
//    원인: min-max 게임의 불안정성, Nash 균형 도달 어려움
//
//    해결책:
//      - 학습률 조정 (G와 D 다르게)
//      - Label Smoothing (1.0 대신 0.9 사용)
//      - Gradient Penalty
//      - TTUR (Two Time-scale Update Rule)
//
// 3. Vanishing Gradient (기울기 소실)
//    증상: D가 너무 강해져 log(1-D(G(z))) → log(0) = -∞ 근처
//    D(G(z)) ≈ 0이면 G의 기울기가 사라짐
//
//    해결책:
//      - Non-saturating loss: max log D(G(z)) (원 논문부터 권장)
//      - WGAN loss: -E[D(x)] + E[D(G(z))]
//      - LSGAN (MSE 기반)
//
// 4. Over-powerful Discriminator
//    증상: D가 거의 완벽히 구별 (acc=100%)
//    원인: G 학습이 뒤쳐짐
//
//    해결책:
//      - D:G = 1:1 또는 1:k 업데이트 비율 조정
//      - D에 Dropout, noise 추가
//      - D의 용량(capacity) 제한`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">WGAN과 Wasserstein Distance</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WGAN (Arjovsky 2017) - Earth Mover's Distance
//
// 문제 인식:
//   - JSD는 분포가 겹치지 않을 때 정보 없음 (상수)
//   - KL은 비대칭, mode collapse 유발
//
// 해결: Wasserstein-1 (Earth Mover's Distance)
//   W(p_r, p_g) = inf_{γ∈Π} E[||x-y||]
//
//   직관: 한 분포를 다른 분포로 "옮기는" 최소 비용
//   분포가 겹치지 않아도 의미 있는 거리 제공
//
// Kantorovich-Rubinstein duality:
//   W(p_r, p_g) = sup_{||f||_L ≤ 1} E_p_r[f(x)] - E_p_g[f(x)]
//
// 여기서 f는 1-Lipschitz 함수
// → D를 1-Lipschitz로 제약하면 Wasserstein distance 추정 가능

// 구현:
// WGAN: weight clipping (|w| ≤ 0.01)  [원논문]
// WGAN-GP: gradient penalty (Gulrajani 2017)
//   L_D = E[D(G(z))] - E[D(x)] + λ·E[(||∇D(x̂)||_2 - 1)²]
//   여기서 x̂ = εx + (1-ε)G(z), ε ~ U(0,1)
//
// 장점:
//   - 훨씬 안정적인 학습
//   - Mode collapse 감소
//   - 손실 값이 품질과 상관 (모니터링 용이)
//
// 단점:
//   - WGAN-GP는 계산 비용 2~3배
//   - BatchNorm 사용 어려움 (LayerNorm 권장)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Mode Collapse·Non-convergence</strong>가 GAN 학습의 양대 고질병.<br />
          요약 2: <strong>WGAN-GP</strong>는 Wasserstein 거리로 안정성 확보 — 현대 GAN의 표준.<br />
          요약 3: 학습률·업데이트 비율·Lipschitz 제약 조정이 실무 튜닝의 핵심.
        </p>
      </div>
    </section>
  );
}
