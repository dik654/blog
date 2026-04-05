import SoftmaxDerivViz from './viz/SoftmaxDerivViz';

export default function SoftmaxCEGradient() {
  return (
    <section id="softmax-ce-gradient" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Softmax + CE 미분</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Softmax + Cross-Entropy 조합의 역전파 미분 = ŷ_j - y_j.<br />
        예측에서 정답을 빼기만 하면 기울기 완성 — 이것이 표준 조합인 이유.
      </p>
      <SoftmaxDerivViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">완전한 수학적 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 설정
// h = (h_1, h_2, ..., h_n): logits (raw scores)
// ŷ = softmax(h): predicted probabilities
// y = one-hot true label
// L = CE(y, ŷ) = -Σ_i y_i · log(ŷ_i)

// 목표: dL/dh_k 계산

// Step 1: L을 h로 직접 표현
// ŷ_i = exp(h_i) / Σ_j exp(h_j)
// log(ŷ_i) = h_i - log(Σ_j exp(h_j))

// L = -Σ_i y_i · (h_i - log(Σ_j exp(h_j)))
//   = -Σ_i y_i · h_i + (Σ_i y_i) · log(Σ_j exp(h_j))
//   = -Σ_i y_i · h_i + log(Σ_j exp(h_j))     [since Σy_i = 1]

// Step 2: h_k로 미분
// dL/dh_k = -y_k + d/dh_k [log(Σ_j exp(h_j))]
//         = -y_k + [exp(h_k) / Σ_j exp(h_j)]
//         = -y_k + ŷ_k
//         = ŷ_k - y_k

// 결론: dL/dh = ŷ - y
// Vector form, element-wise, O(n) 연산`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 이렇게 간단한가 (직관)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 분리 계산 시 복잡도

// 1) Softmax Jacobian (C x C 행렬)
// J_ij = ∂ŷ_i/∂h_j = ŷ_i · (δ_ij - ŷ_j)
// 여기서 δ는 Kronecker delta

// 2) Cross-entropy gradient (C vector)
// ∂L/∂ŷ_i = -y_i / ŷ_i

// 3) Chain rule (matrix-vector multiply)
// ∂L/∂h_k = Σ_i (∂L/∂ŷ_i) · (∂ŷ_i/∂h_k)
//         = Σ_i (-y_i/ŷ_i) · ŷ_i · (δ_ik - ŷ_k)
//         = -y_k + ŷ_k · Σ_i y_i
//         = ŷ_k - y_k   (since Σy_i = 1)

// 메커니즘
// - Softmax의 -ŷ_i·ŷ_j 항과 CE의 -1/ŷ_i가 상쇄
// - 결과는 매우 단순한 차이
// - 수학적 우연 아님: softmax와 CE는 서로 "보완" 설계
// - Exponential family와 자연 parametrization의 수학적 귀결`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Element-wise 해석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ∂L/∂h_k = ŷ_k - y_k 상세 해석

// Case 1: Correct class (y_k = 1)
// ∂L/∂h_k = ŷ_k - 1
// - ŷ_k = 1 (perfect): gradient = 0 (만족)
// - ŷ_k = 0.5: gradient = -0.5 (h_k 증가시켜야)
// - ŷ_k = 0 (wrong): gradient = -1 (크게 증가)

// Case 2: Wrong class (y_k = 0)
// ∂L/∂h_k = ŷ_k - 0 = ŷ_k
// - ŷ_k = 0 (perfect): gradient = 0 (만족)
// - ŷ_k = 0.5: gradient = 0.5 (h_k 감소시켜야)
// - ŷ_k = 1 (severely wrong): gradient = 1

// 학습 dynamics
// - 확신하고 맞았을 때: gradient 작음 (fine tuning)
// - 확신하고 틀렸을 때: gradient 큼 (strong correction)
// - 불확실할 때: gradient 중간 (steady progress)

// 자연스러운 학습률 조정 효과
// 별도 weighting 없이도 sample difficulty에 맞춰 동작`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 자동 미분</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn as nn
import torch.nn.functional as F

# Manual gradient 계산
def manual_grad():
    logits = torch.tensor([2.0, 1.0, 0.1], requires_grad=True)
    target = torch.tensor(0)  # class 0 is correct

    # Forward
    probs = F.softmax(logits, dim=-1)
    loss = -torch.log(probs[target])

    # Our formula: grad = probs - one_hot_target
    one_hot = F.one_hot(target, num_classes=3).float()
    expected_grad = probs - one_hot
    print("Expected:", expected_grad.data)

    # PyTorch autograd
    loss.backward()
    print("Autograd:", logits.grad)

    # Should match!

manual_grad()

# nn.CrossEntropyLoss의 효율적 구현
# - 내부적으로 log_softmax + NLL_loss
# - gradient는 (softmax(h) - y_one_hot) 형태
# - Fused CUDA kernel로 최적화

# 벤치마크: batch=32, C=1000
# CE loss: ~0.15 ms
# Manual (softmax + log + NLL): ~0.5 ms
# → 3배 이상 빠름 (kernel fusion + simpler gradient)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">일반화: Sigmoid + BCE</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Binary case (같은 원리)
// h: single logit
// ŷ = sigmoid(h) = 1/(1+e^(-h))
// y ∈ {0, 1}
// L = -[y·log(ŷ) + (1-y)·log(1-ŷ)]

// dL/dh = ?

// Sigmoid derivative: dŷ/dh = ŷ(1-ŷ)
// BCE derivative: dL/dŷ = -y/ŷ + (1-y)/(1-ŷ) = (ŷ-y)/[ŷ(1-ŷ)]

// Chain rule
// dL/dh = (dL/dŷ)(dŷ/dh)
//       = (ŷ-y)/[ŷ(1-ŷ)] · ŷ(1-ŷ)
//       = ŷ - y

// 놀랍게도 같은 결과!

// 이는 우연이 아닌 수학적 구조
// Softmax와 Sigmoid가 같은 exponential family
// CE가 natural log-likelihood

// 일반화
// Exponential family + negative log-likelihood
// → Gradient는 (expected - observed) 형태`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 깊은 수학적 이유</p>
          <p>
            <strong>Exponential Family</strong>:<br />
            - p(y|η) = h(y) exp(η^T · T(y) - A(η))<br />
            - Natural parameter: η<br />
            - Sufficient statistic: T(y)<br />
            - Log partition: A(η)
          </p>
          <p className="mt-2">
            <strong>핵심 결과</strong>:<br />
            ∇ log p(y|η) = T(y) - E[T(y)]<br />
            - Softmax: natural param = logits, E = predicted probs<br />
            - Sigmoid: natural param = logit, E = predicted prob<br />
            - 모두 "observed - expected" 형태
          </p>
          <p className="mt-2">
            <strong>실무 의미</strong>:<br />
            ✓ 단순한 gradient → 빠른 구현<br />
            ✓ 수치 안정 (log-space 연산)<br />
            ✓ 이론적 우아함 (MLE와 동치)<br />
            ✓ 일반화 가능 (다양한 loss로 확장)
          </p>
        </div>

      </div>
    </section>
  );
}
