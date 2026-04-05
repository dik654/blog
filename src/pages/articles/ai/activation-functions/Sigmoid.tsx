import SigmoidViz from './viz/SigmoidViz';
import VanishingGradientViz from './viz/VanishingGradientViz';
import SigmoidUsageViz from './viz/SigmoidUsageViz';

export default function Sigmoid() {
  return (
    <section id="sigmoid" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시그모이드 (Sigmoid)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        σ(x) = 1/(1+e^-x) — 매끄러운 S자 곡선, 출력 0~1.<br />
        문제: Vanishing Gradient(σ&apos; 최대 0.25) + 비영점 중심 출력.
      </p>
      <SigmoidViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sigmoid 정의 & 역사</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Sigmoid (Logistic) function
// σ(x) = 1 / (1 + e^(-x))

// 범위
// σ(x) ∈ (0, 1) for all x ∈ R
// σ(-∞) = 0, σ(0) = 0.5, σ(+∞) = 1

// 미분
// σ'(x) = σ(x) · (1 - σ(x))
// 최대값: σ'(0) = 0.25

// 역사
// - 1800년대: logistic regression (통계학)
// - 1958: Rosenblatt의 Perceptron (continuous 버전)
// - 1980-90년대: 신경망 표준 activation
// - 2010년대: ReLU로 대체 (hidden layer)
// - 현재: output layer만 (binary classification)

// 왜 쓰였나
// - Smooth, differentiable
// - Probabilistic interpretation (0~1)
// - Biological 영감 (neural firing rate)
// - Gradient 계산 단순 (σ·(1-σ))`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Vanishing Gradient 문제</h3>
        <p>
          σ'(x) 최대값 0.25 → N층 쌓으면 gradient ∝ 0.25ᴺ로 지수적 감쇠<br />
          20층이면 1e-12 수준, 학습 한계(1e-6) 훨씬 아래
        </p>
      </div>
      <VanishingGradientViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">비영점 중심 출력 문제</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Sigmoid 출력은 항상 > 0
// E[σ(x)] ≠ 0

// 문제: Weight update가 zig-zag
// Forward: y = σ(wx + b) 모두 양수
// Backward: dL/dw = dL/dy · y · (1-y) · x
// → gradient 부호가 모두 같음 (x에 의해서만 결정)

// Zig-zag 예시
// Weights를 모두 증가시키거나 모두 감소시킴
// → Efficient updating 어려움
// → Slower convergence

// Tanh는 이 문제 일부 해결
// tanh(x) ∈ (-1, 1), E[tanh(x)] ≈ 0
// 음수/양수 gradient 균형

// Batch Normalization도 해결
// Input을 0 mean, unit variance로 정규화
// Sigmoid 쓰더라도 중심이 0에 가깝게`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sigmoid 현대 사용</h3>
        <p>
          Hidden layer에선 ReLU/GELU에 자리 내줌 — 하지만 Output/Gating에선 여전히 필수
        </p>
      </div>
      <SigmoidUsageViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 사용법</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn as nn
import torch.nn.functional as F

# 함수형
x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])
y = torch.sigmoid(x)
# tensor([0.119, 0.269, 0.500, 0.731, 0.881])

# Module 형태
sigmoid = nn.Sigmoid()

# Binary classification model
class BinaryClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(100, 1)

    def forward(self, x):
        return torch.sigmoid(self.fc(x))

# Logit 출력 (수치 안정)
class BinaryClassifierLogit(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(100, 1)

    def forward(self, x):
        return self.fc(x)  # raw logit

model = BinaryClassifierLogit()
criterion = nn.BCEWithLogitsLoss()  # 내부 sigmoid + BCE
logits = model(x)
loss = criterion(logits, target)

# inference 시
probs = torch.sigmoid(logits)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sigmoid의 생명력</p>
          <p>
            <strong>Hidden layer 사용 종료 이유</strong>:<br />
            - Vanishing gradient (지수적 감소)<br />
            - Saturation 시 학습 정체<br />
            - exp 계산 비용<br />
            - Non-zero-centered output
          </p>
          <p className="mt-2">
            <strong>하지만 여전히 필수</strong>:<br />
            ✓ Binary classification output<br />
            ✓ LSTM/GRU gates<br />
            ✓ Attention gating<br />
            ✓ Probability calibration<br />
            ✓ Multi-label classification
          </p>
          <p className="mt-2">
            <strong>현대적 교훈</strong>:<br />
            - Activation 선택은 위치 의존<br />
            - "Output layer" vs "Hidden layer" 역할 다름<br />
            - Sigmoid는 probabilistic interpretation이 필요한 곳<br />
            - "Old is gold" 일부 구조에선 여전히 최적
          </p>
        </div>

      </div>
    </section>
  );
}
