import StepFunctionViz from './viz/StepFunctionViz';

export default function StepFunction() {
  return (
    <section id="step-function" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계단 함수 (Step Function)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          역사적 출발점 — 1943년 McCulloch-Pitts 뉴런 모델<br />
          입력의 가중합이 임계값(threshold)을 넘으면 1, 아니면 0<br />
          이진 분류(binary classification)의 가장 단순한 형태
        </p>
        <div className="rounded-lg border p-3 font-mono text-sm mb-4">
          f(x) = 1 (x &ge; 0), 0 (x &lt; 0)
        </div>
        <p>
          <strong>치명적 문제</strong> — 미분값이 전 구간에서 0<br />
          불연속점(x=0)에서는 미분 자체가 정의되지 않는다<br />
          경사 하강법(gradient descent)은 미분값으로 가중치를 업데이트<br />
          미분 = 0이면 학습 신호가 전달되지 않아 학습 자체가 불가능
        </p>
      </div>
      <div className="not-prose my-8">
        <StepFunctionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Step Function의 역사적 중요성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// McCulloch-Pitts Neuron (1943)
//
// 최초의 인공 뉴런 모델:
//   input: x_1, x_2, ..., x_n (binary 0 or 1)
//   weights: w_1, w_2, ..., w_n
//   threshold: θ
//
//   z = Σ w_i · x_i
//   output = step(z - θ) = {1 if z ≥ θ, 0 otherwise}
//
// 구현 가능 논리:
//   AND: w=(1,1), θ=1.5
//   OR:  w=(1,1), θ=0.5
//   NOT: w=(-1), θ=-0.5
//
// 한계:
//   XOR 구현 불가 (Minsky & Papert 1969)
//   → 단일 뉴런의 선형 분리 불가능
//   → 이로 인해 AI 겨울 촉발

// Rosenblatt's Perceptron (1958)
//   McCulloch-Pitts + 학습 알고리즘
//   - 가중치 업데이트 규칙
//   - 하지만 step function이라 gradient descent 불가
//   - Perceptron Learning Rule 별도 사용

// 학습 규칙:
//   if prediction wrong:
//     w_i ← w_i + η · (y - ŷ) · x_i
//
//   수렴 보장: 선형 분리 가능한 경우만 (Novikoff)

// 현대 Step Function 변형:
//
// 1. Hard Sigmoid (모바일 최적화):
//    f(x) = max(0, min(1, (x+1)/2))
//    - Step의 부드러운 버전
//    - 양자화 친화적
//
// 2. Straight-Through Estimator (STE):
//    Forward: step function
//    Backward: identity 미분 사용
//    - 이산 latent (VQ-VAE, binary NN)
//    - "gradient 있는 척" 근사
//
// 3. Heaviside + Gumbel softmax:
//    - 확률적 이산 선택
//    - 학습 가능`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">미분 불가능성의 해결</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Step Function이 직접 학습 불가능한 이유:
//
// f'(x) = 0 for x ≠ 0
// f'(0) = undefined
//
// Backprop:
//   dL/dw = dL/df · df/dz · dz/dw
//         = dL/df · 0 · x
//         = 0
//
// → 모든 weight update가 0
// → 학습 불가

// 해결 방법:
//
// Approach 1: Smooth approximation
//   Sigmoid: 1/(1+e^(-kx))
//   k 크면 step에 근사, k=1이면 일반 sigmoid
//   - 미분 가능
//   - 현재 표준 접근
//
// Approach 2: Relaxation
//   학습 시 smooth, 추론 시 hard
//   예: Gumbel-Softmax → argmax
//
// Approach 3: Gradient Estimators
//   STE: step 사용하지만 gradient는 identity
//   → 정확하지 않지만 실용적
//
// Approach 4: Reparameterization
//   결정론적 함수 + randomness
//   → VAE, 양자화 모델
//
// 현대 의의:
//   - 직접 학습은 불가
//   - 하지만 이진 뉴런, 양자화, 스파이킹 NN 등 응용
//   - 하드웨어 효율에서 여전히 가치`}
        </pre>
        <p className="leading-7">
          요약 1: Step function은 <strong>학습 불가</strong>지만 역사적 출발점.<br />
          요약 2: <strong>Sigmoid가 smooth 버전</strong>으로 대체 — backprop 가능.<br />
          요약 3: 현대에도 <strong>양자화·스파이킹 NN</strong> 등에서 응용.
        </p>
      </div>
    </section>
  );
}
