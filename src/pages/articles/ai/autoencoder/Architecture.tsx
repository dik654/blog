import AutoFlowViz from './viz/AutoFlowViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">구조 상세</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        인코더(n→k)로 차원 축소, 디코더(k→n)로 복원.<br />
        잠재 공간 크기가 핵심 — 너무 작으면 정보 손실, 너무 크면 단순 복사.
      </p>
      <AutoFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">인코더/디코더 구조 설계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 표준 MLP 기반 오토인코더 (MNIST 예시)
//
// Encoder:
//   Input: 784        (28×28 이미지 flatten)
//     Dense(256) + ReLU
//     Dense(128) + ReLU
//     Dense(64) + ReLU
//     Dense(32)        # bottleneck / latent code z
//
// Decoder:
//   Dense(64) + ReLU
//   Dense(128) + ReLU
//   Dense(256) + ReLU
//   Dense(784) + Sigmoid  # 픽셀값 0~1 정규화 맞춤
//
// 대칭 구조 이유:
//   - 복원 경로의 역함수 역할
//   - 파라미터 공유 가능 (tied weights)
//   - 학습 안정성

// CNN 기반 Convolutional Autoencoder (이미지용)
//
// Encoder:
//   Conv(32, 3×3, stride=2) + ReLU   → 14×14×32
//   Conv(64, 3×3, stride=2) + ReLU   → 7×7×64
//   Flatten → Dense(latent_dim)
//
// Decoder:
//   Dense(7×7×64) → Reshape(7,7,64)
//   ConvT(64, 3×3, stride=2) + ReLU  → 14×14×64
//   ConvT(1, 3×3, stride=2) + Sigmoid → 28×28×1
//
// Upsampling 방식:
//   - ConvTranspose (학습 가능, 체크보드 아티팩트 주의)
//   - Upsample + Conv (간단, 안정적)
//   - PixelShuffle (SR에서 인기)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bottleneck 크기 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 잠재 차원 k 결정 가이드
//
// k 너무 작음 (k << 본질 차원):
//   - 정보 손실 심함
//   - 복원 품질 저하
//   - underfitting
//
// k 너무 큼 (k ≥ n):
//   - identity 함수 학습 가능
//   - 압축 효과 없음 (overcomplete)
//   - Sparse AE로 완화 가능
//
// 적정 k 찾기:
//   - Reconstruction loss 곡선 관찰
//   - k를 늘려도 손실 감소 미미한 지점 = 본질 차원
//   - MNIST: k=10~30 권장
//   - 일반 이미지: k=64~256
//
// 데이터셋별 권장:
//   MNIST (28×28):      k = 10~32
//   CIFAR-10 (32×32×3): k = 64~128
//   ImageNet (224×224): k = 256~1024
//   시계열 (100-dim):   k = 8~20
//   텍스트 임베딩:      k = 50~100

// 경험 법칙:
//   k ≈ sqrt(n) × 2    # MNIST: sqrt(784)×2 ≈ 56
//   k ≈ intrinsic_dim  # PCA로 추정 가능`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>대칭 구조(인코더 ↔ 디코더)</strong>가 표준 — 복원 경로의 역함수 역할.<br />
          요약 2: <strong>Bottleneck 크기</strong>가 학습 성패 결정 — underfitting vs overcomplete 균형.<br />
          요약 3: 이미지는 CNN, 텍스트/시계열은 MLP/RNN/Transformer 인코더 사용.
        </p>
      </div>
    </section>
  );
}
