import ForwardExampleViz from './viz/ForwardExampleViz';

export default function ForwardExample() {
  return (
    <section id="forward-example" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파 예시 (구체적 숫자)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>모델 설정</h3>
        <p>
          가장 단순한 오토인코더: 입력 2차원, 잠재 1차원, 출력 2차원.<br />
          활성화 함수: sigmoid(x) = 1 / (1 + e⁻ˣ).
        </p>

        <h3>초기값</h3>
        <ul>
          <li>입력: x = [0.8, 0.4]</li>
          <li>인코더 가중치: w_enc = [0.5, 0.3]</li>
          <li>디코더 가중치: w_dec = [0.6, 0.7]</li>
        </ul>

        <h3>계산 과정</h3>
        <p>
          <strong>인코더:</strong> z = sigmoid(0.5 x 0.8 + 0.3 x 0.4) = sigmoid(0.52) = <strong>0.627</strong><br />
          <strong>디코더:</strong><br />
          x&#770;₁ = sigmoid(0.6 x 0.627) = sigmoid(0.376) = <strong>0.593</strong><br />
          x&#770;₂ = sigmoid(0.7 x 0.627) = sigmoid(0.439) = <strong>0.608</strong>
        </p>

        <h3>결과 비교</h3>
        <p>
          입력 [0.8, 0.4] vs 출력 [0.593, 0.608].<br />
          아직 부정확하다 — 학습(역전파)을 통해 가중치를 조정해야 한다.
        </p>
      </div>
      <div className="not-prose mt-8">
        <ForwardExampleViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">sigmoid 함수 특성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// sigmoid(x) = 1 / (1 + e^(-x))
//
// 주요 값:
//   sigmoid(-∞) = 0
//   sigmoid(-2) ≈ 0.119
//   sigmoid(-1) ≈ 0.269
//   sigmoid( 0) = 0.5
//   sigmoid( 1) ≈ 0.731
//   sigmoid( 2) ≈ 0.881
//   sigmoid( ∞) = 1
//
// 미분:
//   sigmoid'(x) = sigmoid(x) × (1 - sigmoid(x))
//   최대값 = 0.25 (at x=0)
//
// 특성:
//   1. 출력 범위 [0, 1] → 확률/비율로 해석 가능
//   2. smooth, 미분 가능
//   3. 미분값 ≤ 0.25 → 기울기 소실 원인
//   4. 포화 영역 (|x| > 5)에서 기울기 ≈ 0
//
// 오토인코더에서의 역할:
//   - 출력층: 픽셀값 0~1 정규화 맞춤
//   - 은닉층: 비선형성 도입 (요즘은 ReLU 선호)
//
// 현대 오토인코더 권장 설정:
//   - 은닉층: ReLU / LeakyReLU / GELU
//   - 출력층: Sigmoid (이미지), Linear (회귀)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">순전파 전체 계산 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 본문 예시의 계산을 텐서 연산으로 일반화
//
// 입력:  x ∈ R^n          (n=2, x=[0.8, 0.4])
// 가중치: W_enc ∈ R^{k×n}, W_dec ∈ R^{n×k}
// 편향:  b_enc ∈ R^k, b_dec ∈ R^n
//
// 인코더:
//   pre_activation_enc = W_enc @ x + b_enc    # shape (k,)
//   z = sigmoid(pre_activation_enc)           # latent code
//
// 디코더:
//   pre_activation_dec = W_dec @ z + b_dec    # shape (n,)
//   x̂ = sigmoid(pre_activation_dec)          # 복원값
//
// 손실:
//   L = (1/n) Σᵢ (xᵢ - x̂ᵢ)²                 # MSE
//
// 본문 예시 재확인 (k=1, n=2, bias=0):
//   z = sigmoid(0.5·0.8 + 0.3·0.4)
//     = sigmoid(0.4 + 0.12)
//     = sigmoid(0.52)
//     = 1/(1+e^(-0.52))
//     = 0.6271  ✓
//
//   x̂₁ = sigmoid(0.6 · 0.6271) = sigmoid(0.3763) = 0.5930  ✓
//   x̂₂ = sigmoid(0.7 · 0.6271) = sigmoid(0.4390) = 0.6080  ✓
//
//   L = (1/2)·((0.8-0.593)² + (0.4-0.608)²)
//     = (1/2)·(0.0428 + 0.0433)
//     = 0.0431`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>sigmoid</strong>는 0~1 출력과 부드러운 미분 덕에 초기 오토인코더의 표준 선택.<br />
          요약 2: 순전파는 <strong>W @ x + b → activation</strong> 2단계 반복.<br />
          요약 3: 초기 손실 0.043 → 학습 반복으로 0에 가까워지면 입력을 거의 완벽히 복원.
        </p>
      </div>
    </section>
  );
}
