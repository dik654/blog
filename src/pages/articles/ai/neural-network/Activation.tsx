import ActivationFnViz from './viz/ActivationFnViz';
import ActivationZooViz from './viz/ActivationZooViz';
import LayerActivationMapViz from './viz/LayerActivationMapViz';

export default function Activation() {
  return (
    <section id="activation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활성화 함수</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        활성화 함수 없이 층을 쌓으면 하나의 선형 변환과 동일.<br />
        비선형 함수를 끼워야 층마다 새로운 표현을 학습 가능.
      </p>
      <ActivationFnViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">비선형성이 필요한 수학적 이유</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 활성화 함수 없는 신경망
// Layer 1: y1 = W1·x + b1
// Layer 2: y2 = W2·y1 + b2
// Layer 3: y3 = W3·y2 + b3

// 전개하면
// y3 = W3·(W2·(W1·x + b1) + b2) + b3
//    = W3·W2·W1·x + W3·W2·b1 + W3·b2 + b3
//    = W_eff·x + b_eff
// where W_eff = W3·W2·W1, b_eff = ...

// 결론: 선형 변환의 조합 = 단일 선형 변환
// 아무리 깊이 쌓아도 단일 layer와 동일한 표현력

// 활성화 함수 추가
// y1 = σ(W1·x + b1)    (σ = 비선형 함수)
// y2 = σ(W2·y1 + b2)
// y3 = W3·y2 + b3 (output layer)

// 이제 y = f(x)는 어떤 선형 변환으로도 표현 불가
// → Universal approximation theorem

// Universal Approximation (Cybenko 1989)
// 충분히 많은 hidden units + 비선형 activation
// → 임의의 연속 함수 근사 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 활성화 함수 — 진화 계보</h3>
        <p>
          Sigmoid/Tanh(2000년대) → ReLU(2010~, 주류) → LeakyReLU/ELU(dying 개선) → GELU/Swish/Mish(smooth 계열)
        </p>
      </div>
      <ActivationZooViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Layer Position별 활성화 선택</h3>
        <p>
          Hidden·Output·Gating·Attention — 위치마다 역할이 달라서 활성화 선택도 달라짐
        </p>
      </div>
      <LayerActivationMapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 사용 예</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn as nn
import torch.nn.functional as F

# Module 형태
relu = nn.ReLU()
sigmoid = nn.Sigmoid()
tanh = nn.Tanh()
gelu = nn.GELU()
silu = nn.SiLU()  # = Swish(β=1)

# 함수 형태
F.relu(x)
F.sigmoid(x)
F.gelu(x)

# Typical 3-layer MLP
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 10)

    def forward(self, x):
        x = F.relu(self.fc1(x))  # hidden activation
        x = F.relu(self.fc2(x))  # hidden activation
        x = self.fc3(x)          # output: raw logits
        return x                 # softmax는 loss function이 적용

# Custom activation
class Swish(nn.Module):
    def forward(self, x):
        return x * torch.sigmoid(x)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 활성화 함수는 모델의 "상상력"</p>
          <p>
            <strong>직관적 해석</strong>:<br />
            - 선형 layer = "정보의 혼합"<br />
            - 활성화 함수 = "의미 있는 신호 선택"<br />
            - 비선형성 = "복잡한 패턴 표현"
          </p>
          <p className="mt-2">
            <strong>생물학적 영감</strong>:<br />
            - 실제 뉴런: threshold 넘어야 firing<br />
            - ReLU ≈ 단순화된 뉴런 모델<br />
            - Sigmoid ≈ firing rate (continuous)
          </p>
          <p className="mt-2">
            <strong>현대 연구 방향</strong>:<br />
            - Learnable activation (PReLU, FReLU)<br />
            - Architecture-specific (SwiGLU for LLM)<br />
            - Hardware-friendly (ReLU6 for mobile)<br />
            - "One size fits all"은 옛말
          </p>
        </div>

      </div>
    </section>
  );
}
