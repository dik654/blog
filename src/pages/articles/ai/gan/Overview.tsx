import GANTrainingViz from './viz/GANTrainingViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GAN 핵심 아이디어</h2>
      <div className="not-prose mb-8"><GANTrainingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>GAN</strong>(Generative Adversarial Network) — 2014년 Ian Goodfellow가 제안한 생성 모델<br />
          두 신경망 &mdash; <strong>Generator(G)</strong>와 <strong>Discriminator(D)</strong> &mdash; 이 서로 경쟁하며 학습<br />
          <strong>적대적 학습(adversarial training)</strong> 패러다임이 핵심
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">위조 작가 vs 감별사</h3>
        <p>
          <strong>Generator(위조 작가)</strong> — 처음엔 형편없는 위작을 그리지만, 연습을 거듭하며 진품에 가까워짐<br />
          <strong>Discriminator(감별사)</strong> — 처음엔 구별 못하지만, 경험이 쌓이며 미세한 차이도 구별<br />
          위조 작가가 정교해질수록 감별사도 성장, 감별사가 정확해질수록 위조 작가도 성장 — <strong>적대적 공진화</strong>
        </p>
        <p>
          G — 랜덤 노이즈 z를 받아 가짜 데이터 생성<br />
          D — 입력이 진짜(1)인지 가짜(0)인지 판별<br />
          반복하면 G의 출력이 실제 데이터 분포 p<sub>data</sub>에 수렴
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">목적 함수</h3>
        <p>
          GAN의 원래 목적 함수 — <strong>min-max 게임</strong>으로 정의:
        </p>
        <pre className="text-sm">
{`min_G max_D  V(D,G) = E[log D(x)] + E[log(1 - D(G(z)))]`}
        </pre>
        <p>
          D는 V를 최대화 — 진짜에는 높은 확률, 가짜에는 낮은 확률 부여<br />
          G는 V를 최소화 — D가 가짜를 진짜로 착각하게 만듦<br />
          손실 함수 = <strong>Binary Cross-Entropy</strong> — 이진 분류(진짜/가짜) + CE의 빠른 수렴 특성<br />
          Nash 균형(양쪽 모두 전략을 바꿀 유인이 없는 상태)에서 D(x) = 0.5
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">수학적 최적해 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GAN의 최적해 수학적 증명 (Goodfellow 2014 Thm 1)
//
// 목적 함수:
//   V(D,G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 - D(G(z)))]
//          = ∫ p_data(x)·log D(x) dx + ∫ p_g(x)·log(1-D(x)) dx
//
// G 고정 시 D의 최적해:
//   dV/dD = p_data(x)/D(x) - p_g(x)/(1-D(x)) = 0
//
//   풀면:  D*(x) = p_data(x) / (p_data(x) + p_g(x))
//
// 직관: 진짜와 가짜가 같은 비율로 섞여 있으면 D(x)=0.5
//
// D*를 V에 대입 후 G 관점에서 최소화:
//   V(G) = -log(4) + 2·JSD(p_data || p_g)
//
//   여기서 JSD = Jensen-Shannon Divergence (대칭 KL)
//
// JSD ≥ 0이고 JSD=0 iff p_data = p_g
// → V의 전역 최솟값 = -log(4) ≈ -1.386
// → 이때 p_g = p_data (완벽한 생성 분포)
//
// 결론: 이론적으로 GAN은 올바른 확률 분포를 학습할 수 있음
// 단, 실제 학습에서는 다양한 실패 모드 존재 (mode collapse 등)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Generator / Discriminator 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Generator (생성자)
//
// 입력: z ~ N(0, I)          # 랜덤 잠재 벡터 (보통 100~512차원)
// 출력: G(z) ~ p_g            # 가짜 데이터 (이미지, 텍스트, 오디오)
//
// 아키텍처 (이미지 생성의 경우):
//   z (100) → Dense(1024) → Reshape(4x4x64)
//     → ConvTranspose(stride=2) → 8x8x32
//     → ConvTranspose(stride=2) → 16x16x16
//     → ConvTranspose(stride=2) → 32x32x3  # 출력 이미지
//
// 핵심:
//   - BatchNorm 권장 (DCGAN 가이드라인)
//   - 활성화: ReLU (중간층), tanh (출력층, -1~1 정규화)
//   - Dropout은 일반적으로 사용 안 함

// Discriminator (판별자)
//
// 입력: x (실제 또는 G(z))
// 출력: D(x) ∈ [0, 1]         # x가 진짜일 확률
//
// 아키텍처:
//   32x32x3 → Conv(stride=2) → 16x16x16
//     → Conv(stride=2) → 8x8x32
//     → Conv(stride=2) → 4x4x64
//     → Flatten → Dense(1) → Sigmoid
//
// 핵심:
//   - 활성화: LeakyReLU (0.2 slope) — dying gradient 방지
//   - BatchNorm 주의 (실제/가짜 배치 분리 필요)
//   - Spectral Norm으로 Lipschitz 제약 (WGAN-GP 이후)`}
        </pre>
        <p className="leading-7">
          요약 1: GAN의 최적해는 <strong>JSD 최소화</strong> — p_g = p_data일 때 전역 최솟값.<br />
          요약 2: <strong>Generator</strong>는 랜덤 노이즈를 데이터 공간으로 매핑하는 역함수 역할.<br />
          요약 3: DCGAN 이전엔 불안정, 이후 CNN 기반 설계 가이드라인으로 대중화.
        </p>
      </div>
    </section>
  );
}
