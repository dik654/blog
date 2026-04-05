import { CitationBlock } from '@/components/ui/citation';
import SAEStructureViz from './viz/SAEStructureViz';

export default function SAEArchitecture() {
  return (
    <section id="sae-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        SAE 구조: 희소 인코딩과 복원
      </h2>
      <div className="not-prose mb-8"><SAEStructureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          목표: 뉴런 출력을 적절히 조합하여 특정 개념에만 반응하는 <strong>"특징"</strong>을 추출<br />
          핵심 아이디어: 넓은 공간으로 확장한 뒤, 희소성 제약으로 소수만 활성화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인코더</h3>
        <p>
          뉴런 출력(d=2304) × 가중치 행렬(2304×16K) → 특징 벡터(d=16K)<br />
          ReLU 활성화 함수 적용 → 대부분의 값이 0이 됨(희소성)<br />
          활성화된 소수의 특징만이 의미 있는 개념에 대응
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">디코더</h3>
        <p>
          특징 벡터(16K) × 복원 행렬(16K×2304) → 원래 뉴런 출력 복원<br />
          훈련 목표: <strong>복원 손실</strong>(reconstruction loss) 최소화 + <strong>L1 희소성 페널티</strong>
        </p>

        <CitationBlock
          source="Bricken et al., Anthropic 2023 — Towards Monosemanticity §2"
          citeKey={4} type="paper"
          href="https://transformer-circuits.pub/2023/monosemantic-features"
        >
          <p className="italic">
            "We train sparse autoencoders on MLP activations... The L1 penalty
            encourages the hidden layer to be sparse, so that each unit
            corresponds to a single interpretable concept."
          </p>
          <p className="mt-2 text-xs">
            L1 페널티가 희소성을 강제 → 각 유닛이 단일 해석 가능 개념에 대응
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 희소성이 핵심인가</h3>
        <p>
          희소성 없이 학습하면 각 특징이 여러 개념에 반응(= 다의성 재발)<br />
          L1 페널티가 불필요한 활성화를 억제 → 하나의 특징 = 하나의 개념<br />
          이것이 SAE의 "Sparse"가 의미하는 바
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SAE 수식과 학습</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sparse Autoencoder 수학적 정의
//
// 입력: x ∈ R^d (residual stream activation)
//   예: Gemma 2B, d = 2304
//
// Encoder:
//   f = ReLU(W_enc · x + b_enc)
//   f ∈ R^D, D >> d (예: D = 16,384)
//
// Decoder:
//   x̂ = W_dec · f + b_dec
//   x̂ ∈ R^d (복원)
//
// Loss Function:
//   L = ||x - x̂||² + λ · ||f||_1
//
//   첫 항: reconstruction loss
//   둘째 항: L1 sparsity penalty
//   λ: sparsity coefficient (0.1~10)

// 핵심 제약:
//
// 1. Expansion: D > d (보통 8~64배)
//    - 더 많은 "공간" 마련
//    - 개념 분리 가능
//
// 2. Sparsity: ~L0 = 50~200 (16K 중)
//    - 활성화된 특징 개수
//    - 과잉 희소 → 정보 손실
//    - 부족 희소 → 다의성 유지
//
// 3. Dictionary Learning 관점:
//    x ≈ Σ f_i · d_i
//    f: 희소 coefficients
//    d: dictionary atoms (features)

// Top-K SAE (OpenAI 2024):
//   L1 대신 Top-K 선택
//   f = TopK(W_enc · x + b_enc, k=32)
//   - 정확히 k개 활성화 보장
//   - 더 안정적 학습

// Gated SAE (Anthropic 2024):
//   Binary gate로 활성화 제어
//   - 더 나은 reconstruction
//   - dead features 감소`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">학습 과정 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SAE 학습 파이프라인
//
// Step 1: Activation 수집
//   - 대규모 데이터로 base LLM 실행
//   - 특정 layer의 residual stream 저장
//   - 예: 100M tokens × d_model
//
// Step 2: SAE 초기화
//   - W_enc: random
//   - W_dec: W_enc.T (tied weights)
//   - 또는 W_dec: normalized random
//
// Step 3: 학습
//   for batch in activations:
//       x = batch
//       f = ReLU(W_enc @ x + b_enc)
//       x_hat = W_dec @ f + b_dec
//
//       recon_loss = (x - x_hat).pow(2).mean()
//       sparsity_loss = f.abs().mean()
//
//       loss = recon_loss + λ · sparsity_loss
//       loss.backward()
//       optimizer.step()
//
// Step 4: 평가
//   - L0 (avg non-zero per sample)
//   - Reconstruction error
//   - Feature interpretability
//   - Alive ratio (dead features)

// 주요 문제:
//
// 1. Dead Features:
//    일부 features가 학습 중 절대 활성화 안 됨
//    해결: resampling, auxiliary loss
//
// 2. Shrinkage:
//    L1이 모든 activation을 0쪽으로 당김
//    해결: decoder norm constraint
//
// 3. Feature Absorption:
//    작은 feature가 큰 feature에 흡수됨
//    해결: orthogonality regularization

// 성공 기준:
//   - Reconstruction L2 < 0.1
//   - L0 ≈ 50~200 (SAE dim 16K 기준)
//   - Alive features > 90%
//   - Interpretable features > 70% (수동 평가)`}
        </pre>
        <p className="leading-7">
          요약 1: SAE는 <strong>wide linear encoder + ReLU + decoder</strong> 구조.<br />
          요약 2: <strong>Reconstruction + L1 sparsity</strong> 양립이 핵심 균형.<br />
          요약 3: Top-K, Gated SAE 등 <strong>변형 활발</strong> — 2024 연구 핫토픽.
        </p>
      </div>
    </section>
  );
}
