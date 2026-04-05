import CodePanel from '@/components/ui/code-panel';
import ForwardPassViz from './viz/ForwardPassViz';

const matrixCode = `# 입력 데이터: 3개 도시의 경도 (3×1 행렬)
X = np.array([[2.35],    # 파리
              [-3.70],   # 마드리드
              [13.40]])  # 베를린

# 가중치 행렬 W (1×3) — 뉴런 3개, 입력 1개
W1 = np.random.randn(1, 3)  # 랜덤 초기화
b1 = np.zeros((1, 3))       # 바이어스 0 초기화

# 순전파: Z = X × W + b
Z = X.dot(W1) + b1          # (3×1)·(1×3) → (3×3)

# 활성화: A = sigmoid(Z)
A = 1 / (1 + np.exp(-Z))    # element-wise 적용`;

const matrixAnn = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: 'X(3×1) — 3개 예시를 행렬로 한번에 통과' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: 'W(1×3) — 뉴런 3개의 가중치' },
  { lines: [10, 11] as [number, number], color: 'amber' as const, note: 'Z = X·W → (3×3) 행렬곱 한 줄' },
  { lines: [13, 14] as [number, number], color: 'violet' as const, note: 'sigmoid 원소별 적용 → 확률값' },
];

export default function ForwardPass() {
  return (
    <section id="forward-pass" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파: 뉴런의 선형 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        h = m·x + b — 뉴런 하나의 계산은 직선 방정식과 동일.<br />
        행렬 곱 Z = X × W + b로 모든 뉴런의 출력을 동시 계산.
      </p>
      <ForwardPassViz />
      <div className="mt-6">
        <CodePanel title="Python 구현: 행렬 기반 순전파" code={matrixCode}
          lang="python" annotations={matrixAnn} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">순전파 수학적 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 단일 뉴런 (Perceptron 모델)
//
// 입력: x = [x_1, x_2, ..., x_n]
// 가중치: w = [w_1, w_2, ..., w_n]
// 편향: b
//
// 선형 조합:
//   z = w · x + b
//     = w_1·x_1 + w_2·x_2 + ... + w_n·x_n + b
//
// 활성화:
//   a = f(z)  (sigmoid, ReLU, etc.)
//
// 직선 방정식 해석:
//   2D 예: z = w·x + b = mx + b (기울기-절편)
//   w = 기울기, b = 절편
//   뉴런 = 학습 가능한 직선

// 다층 신경망 (Multi-Layer Perceptron)
//
// Layer 1:
//   z^(1) = W^(1) · x + b^(1)
//   a^(1) = f(z^(1))
//
// Layer 2:
//   z^(2) = W^(2) · a^(1) + b^(2)
//   a^(2) = f(z^(2))
//
// ...
//
// Output:
//   ŷ = softmax(z^(L))  (classification)
//   또는
//   ŷ = z^(L)  (regression)

// 행렬 크기 예시:
//   입력: x ∈ R^784 (MNIST 28×28 flatten)
//   Layer 1: 128 뉴런
//     W^(1) ∈ R^{128×784}
//     b^(1) ∈ R^128
//     z^(1), a^(1) ∈ R^128
//   Layer 2: 10 뉴런 (클래스 수)
//     W^(2) ∈ R^{10×128}
//     b^(2) ∈ R^10
//     z^(2), a^(2) ∈ R^10
//
// 총 파라미터: 784×128 + 128 + 128×10 + 10 = 101,770`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">배치 처리와 벡터화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Batch Forward Pass
//
// 여러 입력을 동시에 처리 → GPU 활용도 최대화
//
// 단일 입력:
//   x ∈ R^d → z ∈ R^h → a ∈ R^h
//
// 배치 입력 (B개):
//   X ∈ R^{B×d}
//   Z = X · W^T + b  (B×d × d×h = B×h)
//   A = f(Z)  (element-wise)
//
// 실제 계산 예:
//   X.shape = (32, 784)    # batch=32, MNIST
//   W.shape = (128, 784)
//   Z = X @ W.T + b        # (32, 128)
//   A = relu(Z)            # (32, 128)
//
// 벡터화의 이점:
//   - GPU 병렬화 (수천 코어)
//   - Cache 효율성
//   - BLAS 라이브러리 최적화
//   - 100배 이상 속도 향상

// NumPy vs PyTorch:
//
// NumPy (CPU):
//   import numpy as np
//   X = np.random.randn(32, 784)
//   W = np.random.randn(128, 784)
//   Z = X @ W.T + b
//
// PyTorch (GPU):
//   import torch
//   X = torch.randn(32, 784, device='cuda')
//   W = torch.randn(128, 784, device='cuda')
//   Z = X @ W.T + b  # 동일 문법, 수천 배 빠름

// 메모리 활용:
//   Forward pass에서 중간 값 저장
//   → backward에 사용
//   → GPU 메모리 병목 주요 원인
//   → gradient checkpointing으로 절약 가능`}
        </pre>
        <p className="leading-7">
          요약 1: 뉴런 = <strong>학습 가능한 직선</strong> (z = w·x + b).<br />
          요약 2: 다층 NN = <strong>순차적 선형변환 + 비선형성</strong>.<br />
          요약 3: <strong>배치 처리 + GPU</strong>가 실용적 학습 속도 확보.
        </p>
      </div>
    </section>
  );
}
