import BackpropViz from './viz/BackpropViz';

export default function LossAndBackprop() {
  return (
    <section id="loss-backprop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 + 역전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        MSE로 복원 오차를 측정, 체인룰로 디코더→인코더 순서로 기울기 전파.<br />
        w_new = w_old - η·gradient. 반복하면 출력이 입력에 수렴.
      </p>
      <BackpropViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">손실 함수 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 오토인코더 손실 함수 옵션
//
// 1. MSE (Mean Squared Error) — 가장 일반적
//    L_MSE = (1/n) Σ (xᵢ - x̂ᵢ)²
//    - 실수값 데이터 (이미지, 임베딩)
//    - Gaussian 가정과 동등
//    - 이상치에 민감
//
// 2. MAE (Mean Absolute Error)
//    L_MAE = (1/n) Σ |xᵢ - x̂ᵢ|
//    - 이상치에 강인
//    - 0 근처에서 미분 불연속
//
// 3. Binary Cross-Entropy (BCE)
//    L_BCE = -Σ [x·log(x̂) + (1-x)·log(1-x̂)]
//    - 픽셀값 ∈ [0,1] 데이터
//    - sigmoid 출력과 궁합 최상
//    - MNIST 등 이진/연속 이미지
//
// 4. Perceptual Loss
//    L_perc = ||VGG(x) - VGG(x̂)||²
//    - 사전학습된 특징 공간에서 비교
//    - 픽셀 수준 MSE보다 시각적 품질 우수
//    - Super-resolution, 스타일 전환
//
// 5. SSIM (Structural Similarity)
//    - 인간 시각 시스템에 맞춘 측정
//    - 지역적 패턴 보존 중시

// 선택 기준:
//   픽셀값 [0,1]          → BCE
//   실수 범위             → MSE
//   이미지 품질 중요      → Perceptual / SSIM
//   이상치 포함 데이터    → MAE / Huber`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">역전파 수식 전개</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 오토인코더 역전파 체인룰
//
// Forward:
//   z = σ(W₁x + b₁)          # encoder
//   x̂ = σ(W₂z + b₂)          # decoder
//   L = (1/2)||x - x̂||²      # MSE
//
// Backward (chain rule):
//
// 1. 출력 오차
//   dL/dx̂ = x̂ - x
//
// 2. 디코더 pre-activation 기울기
//   dL/d(W₂z+b₂) = (x̂ - x) ⊙ σ'(W₂z+b₂)
//                = (x̂ - x) ⊙ x̂ ⊙ (1-x̂)
//   call this δ_dec
//
// 3. 디코더 가중치 업데이트
//   dL/dW₂ = δ_dec · z^T
//   dL/db₂ = δ_dec
//
// 4. 잠재 공간 기울기
//   dL/dz = W₂^T · δ_dec
//
// 5. 인코더 pre-activation 기울기
//   dL/d(W₁x+b₁) = (dL/dz) ⊙ z ⊙ (1-z)
//   call this δ_enc
//
// 6. 인코더 가중치 업데이트
//   dL/dW₁ = δ_enc · x^T
//   dL/db₁ = δ_enc
//
// 7. 파라미터 업데이트 (학습률 η)
//   W₁ ← W₁ - η · dL/dW₁
//   W₂ ← W₂ - η · dL/dW₂
//   b₁ ← b₁ - η · dL/db₁
//   b₂ ← b₂ - η · dL/db₂

// 실무 주의사항:
//   - 기울기 초기화: Xavier / He
//   - Optimizer: Adam (lr=1e-3) 표준
//   - Early stopping: val_loss 기준
//   - Batch size: 64~256`}
        </pre>
        <p className="leading-7">
          요약 1: 손실 함수는 <strong>데이터 범위와 분포</strong>에 맞춰 선택 — MSE, BCE, Perceptual 등.<br />
          요약 2: 역전파는 <strong>디코더 → 인코더</strong> 순서로 체인룰 적용 — 4개 파라미터 동시 업데이트.<br />
          요약 3: sigmoid의 포화 영역에서 기울기 소실 — ReLU/GELU 권장.
        </p>
      </div>
    </section>
  );
}
