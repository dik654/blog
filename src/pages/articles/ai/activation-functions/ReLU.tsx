import ReLUViz from './viz/ReLUViz';
import DyingReLUViz from './viz/DyingReLUViz';

export default function ReLU() {
  return (
    <section id="relu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU (Rectified Linear Unit)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        f(x) = max(0, x) — 양수 기울기 1 고정으로 Vanishing Gradient 해결.<br />
        문제: 음수 입력 → 기울기 0 → 영구 비활성(Dying ReLU).
      </p>
      <ReLUViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU 정의 & 역사</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ReLU (Rectified Linear Unit, 2010)
// f(x) = max(0, x) = {x if x > 0, 0 otherwise}

// 미분
// f'(x) = {1 if x > 0, 0 otherwise}
// x=0에서 미분 불가 → 실무에선 0 또는 1 선택

// 역사
// - 1960년대: linear threshold (step function)
// - 1980-90년대: sigmoid, tanh 주류
// - 2010: Nair & Hinton "Rectified Linear Units Improve RBMs"
// - 2012: AlexNet + ReLU → ImageNet 혁명
// - 현재: 대부분 CNN/MLP 기본값

// 왜 혁명적이었나
// 이전 (sigmoid/tanh):
//   - Gradient < 1 → 깊은 네트워크에서 vanish
//   - exp 계산 → 느림
//   - Saturation → 학습 정체
// ReLU:
//   - Gradient = 1 → 깊은 네트워크 가능
//   - 단순 비교 연산 → 빠름
//   - Sparsity 유도 → 효율적`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ReLU 장점</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Computationally efficient
// max(0, x) = ~1 instruction
// 비교: sigmoid = exp + div ~10 instructions
// GPU에서 10x 이상 빠름

// 2. No vanishing gradient (양수 구간)
// f'(x) = 1 for all x > 0
// Deep network에서도 gradient 보존
// (단, 음수 구간은 gradient = 0 → Dying ReLU)

// 3. Sparse activation
// ~50% of activations = 0 (random input)
// Neural representations이 sparse해짐
// 생물학적 뉴런과 유사 (selective firing)

// 4. Biologically plausible
// 실제 뉴런: threshold 넘어야 firing
// Sigmoid보다 ReLU가 더 현실적

// 5. No saturation for positive inputs
// Large x → large output
// Strong gradient propagation`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Dying ReLU 문제</h3>
        <p>
          5단계 죽음의 사이클: weight 음수 → 입력 항상 음수 → 출력 0 → gradient 0 → 영구 dead<br />
          방지책: He init, LeakyReLU, 낮은 lr, BatchNorm, gradient clipping
        </p>
      </div>
      <DyingReLUViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn as nn
import torch.nn.functional as F

# 기본 사용
x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])
y = F.relu(x)
print(y)  # tensor([0., 0., 0., 1., 2.])

# Module 형태
relu = nn.ReLU()  # 또는 nn.ReLU(inplace=True) 메모리 절약

# 모델에서 사용
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 64, 3, padding=1)
        self.conv2 = nn.Conv2d(64, 128, 3, padding=1)
        self.pool = nn.MaxPool2d(2)
        self.fc = nn.Linear(128 * 16 * 16, 10)

    def forward(self, x):
        x = F.relu(self.conv1(x))   # ReLU after conv
        x = self.pool(x)
        x = F.relu(self.conv2(x))
        x = self.pool(x)
        x = x.flatten(1)
        x = self.fc(x)
        return x

# He initialization (ReLU 전용)
for m in model.modules():
    if isinstance(m, nn.Conv2d) or isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
        if m.bias is not None:
            nn.init.constant_(m.bias, 0)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ReLU가 딥러닝을 가능하게 한 이유</p>
          <p>
            <strong>2012 ImageNet의 비밀</strong>:<br />
            - AlexNet이 16.4% → 15.3% error<br />
            - 주된 변경: sigmoid → ReLU<br />
            - 학습 6x 빠름, 깊이 증가 가능<br />
            - Deep learning 혁명의 기폭제
          </p>
          <p className="mt-2">
            <strong>수학적 우아함</strong>:<br />
            - Non-linearity 가장 단순한 형태<br />
            - Piecewise linear → universal approximator<br />
            - Gradient 분석 쉬움<br />
            - Extensions 풍부 (Leaky, PReLU, ELU 등)
          </p>
          <p className="mt-2">
            <strong>한계 인식</strong>:<br />
            - Dying ReLU 여전히 이슈<br />
            - 음수 정보 손실<br />
            - x=0에서 비미분<br />
            → 대안들(GELU, Swish)이 등장한 이유
          </p>
        </div>

      </div>
    </section>
  );
}
