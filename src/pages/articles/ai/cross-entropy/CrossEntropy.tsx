import CrossEntropyViz from './viz/CrossEntropyViz';

export default function CrossEntropy({ title }: { title?: string }) {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '크로스 엔트로피: 두 분포의 괴리'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        H(P,Q) = -Σ P(x)·log Q(x) — P의 확률로 Q의 놀라움을 계산.<br />
        P ≠ Q일수록 CE는 엔트로피보다 항상 큼 (Gibbs 부등식).
      </p>
      <CrossEntropyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Entropy 수학적 의미</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Cross-Entropy 정의
// H(P, Q) = -Σ P(x) · log Q(x) = E_(x~P)[-log Q(x)]

// 해석
// "P로부터 샘플을 추출한 뒤, Q로 인코딩할 때 평균 bits"
// P = 실제 분포 (ground truth)
// Q = 모델 예측 분포

// 관계
// H(P, Q) = H(P) + KL(P || Q)
// - H(P): P의 고유한 entropy (모델이 통제 불가)
// - KL(P || Q): P와 Q의 거리 (우리가 줄이려는 것)

// Gibbs 부등식
// H(P, Q) >= H(P)
// 등호 성립: P = Q일 때만

// 증명 (Jensen's inequality 활용)
// KL(P || Q) = Σ P(x) · log(P(x)/Q(x))
//            = -E_P[log(Q(x)/P(x))]
//            >= -log(E_P[Q(x)/P(x)])   (Jensen, log concave)
//            = -log(Σ Q(x)) = -log(1) = 0
// ∴ H(P, Q) - H(P) = KL(P||Q) >= 0`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">분류에서 CE Loss</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Multi-class classification
// Classes: C개, labels: one-hot encoded
// True: P = [0, 0, 1, 0, 0]   (class 2가 정답)
// Predicted: Q = [0.1, 0.15, 0.5, 0.15, 0.1]  (softmax output)

// Cross-entropy
// H(P, Q) = -(0·log(0.1) + 0·log(0.15) + 1·log(0.5) + 0·log(0.15) + 0·log(0.1))
//         = -log(0.5) ≈ 0.693

// 중요: one-hot이면 H(P) = 0
// → H(P, Q) = KL(P||Q) = -log(Q_correct)
// → 정답 class의 확률만 중요

// Loss 최소화 = Q_correct → 1

// 다양한 Q에 대한 loss
// Q_correct = 1.0: L = 0
// Q_correct = 0.9: L = -log(0.9) ≈ 0.105
// Q_correct = 0.5: L = -log(0.5) ≈ 0.693
// Q_correct = 0.1: L = -log(0.1) ≈ 2.303
// Q_correct = 0.01: L = -log(0.01) ≈ 4.605
// Q_correct → 0: L → ∞

// 특성
// - 예측이 맞으면 loss 작음
// - 예측이 틀릴수록 급격히 증가 (log)
// - 자연스러운 gradient scaling`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 구현 예</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn as nn
import torch.nn.functional as F

# Method 1: nn.CrossEntropyLoss (권장)
criterion = nn.CrossEntropyLoss()
logits = torch.tensor([[2.0, 1.0, 0.1]])  # raw scores, not probs
target = torch.tensor([0])  # class index
loss = criterion(logits, target)
# 내부적으로 softmax + log + NLL 수행 (수치 안정)

# Method 2: 단계별 (학습 목적)
probs = F.softmax(logits, dim=-1)
log_probs = torch.log(probs)
loss_manual = -log_probs[0, target[0]]
# 수치 안정성 낮음: log(very_small) = -inf

# Method 3: log_softmax + nll_loss
log_probs = F.log_softmax(logits, dim=-1)  # 수치 안정
loss_mixed = F.nll_loss(log_probs, target)
# CrossEntropyLoss와 동일

# Method 4: Functional
loss_func = F.cross_entropy(logits, target)

# 모두 같은 결과 (수치 정밀도 차이)
print(loss)        # ~0.417
print(loss_func)   # ~0.417`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Binary Cross-Entropy</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Binary Cross-Entropy (BCE)
// 2-class classification 또는 multi-label

// BCE formula
// L(y, ŷ) = -[y · log(ŷ) + (1-y) · log(1-ŷ)]
// y ∈ {0, 1}, ŷ ∈ [0, 1]

// Gradient
// dL/dŷ = -y/ŷ + (1-y)/(1-ŷ)
// Sigmoid와 결합 시: dL/dz = ŷ - y (단순!)

// PyTorch
# Binary classification
criterion = nn.BCELoss()  # sigmoid 적용 후 입력
# 또는
criterion = nn.BCEWithLogitsLoss()  # raw logits 입력 (수치 안정)

# Multi-label
# Each class independent → sigmoid + BCE per class
logits = model(x)  # shape: (batch, num_classes)
loss = F.binary_cross_entropy_with_logits(logits, multi_hot_targets)

// Multi-class vs Multi-label
// - Multi-class: 각 sample은 정확히 1개 class
//   → softmax + CE
// - Multi-label: 각 sample이 여러 class 가능
//   → sigmoid + BCE (per class)

// 예: 영화 장르 분류
// Multi-class: 액션 OR 코미디 OR 로맨스
// Multi-label: 액션 AND 코미디 AND 로맨스 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Perplexity — LM의 CE 해석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Language Modeling에서 CE의 해석
// Perplexity (PPL) = exp(cross_entropy)

// PPL = exp(-1/N · Σ log P(x_i))
// 직관: "모델이 다음 단어 선택 시 몇 개 후보 중에서 고민"

// 예시 (GPT-2 on Wikipedia)
// CE ≈ 3.5 nats
// PPL = exp(3.5) ≈ 33

// → "33개 단어 중에서 고르는 것처럼 불확실"

// 과거 성능 참고
// GPT-2 small (2019): PPL ≈ 30
// GPT-3 (2020): PPL ≈ 20
// GPT-4 (2023): PPL ≈ 10 (추정)
// Human-level: PPL ≈ 6-7 (추정)

// Theoretical lower bound
// = true language entropy
// = Shannon의 English text: ~1 bit per character

// Language model 평가
# 평균 NLL 계산
total_loss = 0
total_tokens = 0
for batch in eval_loader:
    logits = model(batch.input)
    loss = F.cross_entropy(logits, batch.target, reduction='sum')
    total_loss += loss.item()
    total_tokens += batch.target.numel()

avg_nll = total_loss / total_tokens
perplexity = math.exp(avg_nll)
print(f"Perplexity: {perplexity:.2f}")`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CE와 MLE의 관계</p>
          <p>
            <strong>Maximum Likelihood Estimation</strong>:<br />
            - θ* = argmax Π P(x_i | θ)<br />
            - Log likelihood: ℓ(θ) = Σ log P(x_i | θ)<br />
            - Maximize ℓ = minimize -ℓ = minimize CE
          </p>
          <p className="mt-2">
            <strong>동치 관계</strong>:<br />
            - Cross-entropy 최소화 ≡ MLE<br />
            - 훈련 데이터 empirical distribution = P<br />
            - 모델이 θ로 parameterize한 Q<br />
            - Minimize H(P, Q_θ) = MLE
          </p>
          <p className="mt-2">
            <strong>실무 의미</strong>:<br />
            - CE는 단순한 "거리" 이상<br />
            - 통계적으로 최적 (asymptotically consistent estimator)<br />
            - Bayesian 해석 가능 (MAP with uniform prior)<br />
            - Model fitting의 표준 objective
          </p>
        </div>

      </div>
    </section>
  );
}
