import ReLUVariantsViz from './viz/ReLUVariantsViz';
import ReLUFamilyViz from './viz/ReLUFamilyViz';

export default function ReLUVariants() {
  return (
    <section id="relu-variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU 변형들</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Dying ReLU 해결 — 음수 영역에 작은 기울기 또는 부드러운 곡선 부여.<br />
        Leaky ReLU, GELU(Transformer), SwiGLU(LLaMA) 등.
      </p>
      <ReLUVariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU 가족 전체 지도</h3>
      </div>
      <ReLUFamilyViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Leaky ReLU & PReLU</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Leaky ReLU (Maas et al. 2013)
// f(x) = {x if x > 0, αx otherwise}
// - α = 0.01 (fixed small slope)
// - Dying ReLU 방지
// - 음수 gradient 보존

// PReLU (Parametric ReLU, He et al. 2015)
// f(x) = {x if x > 0, a_i·x otherwise}
// - a_i는 학습 가능 parameter
// - 각 channel마다 별도 slope
// - ResNet original paper에서 사용

// 비교
// x < 0일 때 gradient
// ReLU: 0 (dead)
// Leaky ReLU: α = 0.01
// PReLU: a (learned, typically 0.1~0.3)

// 실전 성능 (ImageNet)
// ReLU: baseline
// Leaky ReLU: +0.1~0.2% (미미)
// PReLU: +0.3~0.5% (약간 향상)

// 단점
// - 추가 hyperparameter (α)
// - Bias 수정 필요 (분포 비대칭)
// - 실전에서는 ReLU가 여전히 선호 (단순함)

// PyTorch
import torch.nn as nn
nn.LeakyReLU(negative_slope=0.01)
nn.PReLU(num_parameters=1)   # shared 또는 per-channel`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ELU & SELU</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ELU (Exponential Linear Unit, Clevert et al. 2015)
// f(x) = {x if x > 0, α(e^x - 1) otherwise}
// - 음수 구간: smooth, saturating
// - Mean activation이 0에 가까움 (batch norm 효과)
// - x → -∞: f(x) → -α

// SELU (Scaled ELU, Klambauer et al. 2017)
// f(x) = λ · {x if x > 0, α(e^x - 1) otherwise}
// α ≈ 1.6733, λ ≈ 1.0507 (고정값)
// - Self-normalizing property
// - Batch norm 없이도 normalized activations
// - FC network에서만 잘 작동 (CNN/RNN은 제한)

// 장점
// ✓ Smooth → gradient flow 개선
// ✓ Dead neuron 없음
// ✓ Mean activation ≈ 0

// 단점
// ✗ exp 계산 (느림)
// ✗ Scale sensitive
// ✗ CNN에서 ReLU만큼 효과 없음

// 사용 사례
// - 작은 FC network
// - Regression tasks
// - 실전 인기 낮음

// PyTorch
nn.ELU(alpha=1.0)
nn.SELU()`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">GELU — Transformer 표준</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// GELU (Gaussian Error Linear Unit, Hendrycks & Gimpel 2016)
// f(x) = x · Φ(x)
// where Φ(x) = P(X <= x) for X ~ N(0,1)

// Approximation (빠른 계산)
// GELU(x) ≈ 0.5 · x · (1 + tanh(√(2/π) · (x + 0.044715·x³)))

// 또는 sigmoid approx
// GELU(x) ≈ x · sigmoid(1.702 · x)

// 특성
// - Smooth approximation of ReLU
// - Probabilistic interpretation:
//   "x·mask" where mask = Bernoulli(Φ(x))
// - x가 클수록 "통과할 확률" 높음
// - 음수 구간: 작지만 non-zero

// 왜 Transformer에 쓰이나
// - BERT, GPT-2/3, T5, ViT 모두 GELU
// - Empirical 성능 우수
// - 부드러운 non-linearity
// - Dropout과 결합 효과 ("stochastic regularization")

// PyTorch
nn.GELU()   # exact
nn.GELU(approximate='tanh')   # tanh 근사 (빠름)

// 비용
// - ReLU보다 느림 (exp/tanh 필요)
// - 하지만 Transformer 내 작은 부분 (attention이 주 비용)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Swish & SiLU</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Swish (Ramachandran et al. 2017)
// f(x) = x · sigmoid(βx)
// β = 1 (fixed) or learnable

// SiLU (Sigmoid-weighted Linear Unit, same as β=1 Swish)
// f(x) = x · σ(x) = x / (1 + e^-x)

// 특성
// - Smooth, non-monotonic
// - GELU와 매우 유사 (GELU ≈ SiLU)
// - Unbounded above, bounded below

// 미분
// f'(x) = σ(x) + x·σ(x)·(1-σ(x))
//       = σ(x)·(1 + x·(1-σ(x)))

// 사용 예
// - EfficientNet: Swish
// - MobileNetV3: hard-swish (approximation)
// - LLaMA: SwiGLU (Swish + GLU gating)

// PyTorch
nn.SiLU()   # = Swish with β=1

// Hard Swish (efficient)
// h-swish(x) = x · ReLU6(x+3)/6
// - Mobile inference에 빠름`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">GLU & SwiGLU — LLM 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// GLU (Gated Linear Unit, Dauphin et al. 2017)
// GLU(x) = (x · W₁) ⊙ σ(x · W₂)
// - 두 개의 linear projection
// - 하나는 gate로 작동 (sigmoid)
// - Element-wise multiplication

// 변형들
// ReGLU: ReLU gate 대신 sigmoid
// GEGLU: GELU gate
// SwiGLU: Swish gate (LLaMA, PaLM)

// SwiGLU (Shazeer 2020, LLaMA 사용)
// SwiGLU(x) = (x · W₁) ⊙ Swish(x · W₂)

// Transformer FFN에서
// 기본: FFN(x) = W₂ · ReLU(W₁·x)
// SwiGLU: FFN(x) = W₃ · (W₁·x ⊙ SwiGLU(W₂·x))
// - Parameters 1.5x 증가 (3 matrices)
// - 하지만 d_ff 줄여서 compensate

// 실전 성능
// - LLaMA paper: SwiGLU > ReLU, GELU
// - PaLM, Mixtral도 사용
// - LLM 2022+ 표준

// PyTorch
class SwiGLU(nn.Module):
    def __init__(self, d_model, d_ff):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff)
        self.w2 = nn.Linear(d_model, d_ff)
        self.w3 = nn.Linear(d_ff, d_model)

    def forward(self, x):
        return self.w3(F.silu(self.w1(x)) * self.w2(x))`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 가이드 (2024)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">아키텍처</th>
                <th className="border border-border px-3 py-2 text-left">권장 Activation</th>
                <th className="border border-border px-3 py-2 text-left">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">CNN (일반)</td>
                <td className="border border-border px-3 py-2">ReLU</td>
                <td className="border border-border px-3 py-2">빠름, 검증됨</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">CNN (mobile)</td>
                <td className="border border-border px-3 py-2">Hard Swish</td>
                <td className="border border-border px-3 py-2">ReLU보다 성능↑, 여전히 빠름</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Transformer (NLP)</td>
                <td className="border border-border px-3 py-2">GELU</td>
                <td className="border border-border px-3 py-2">BERT, GPT 표준</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">LLM (decoder)</td>
                <td className="border border-border px-3 py-2">SwiGLU</td>
                <td className="border border-border px-3 py-2">LLaMA 이후 표준</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">RNN/LSTM</td>
                <td className="border border-border px-3 py-2">Tanh (gate), Sigmoid</td>
                <td className="border border-border px-3 py-2">Gating 메커니즘</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Regression</td>
                <td className="border border-border px-3 py-2">ReLU / ELU</td>
                <td className="border border-border px-3 py-2">Output 앞에는 identity</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Activation 진화의 패턴</p>
          <p>
            <strong>Empirical 발견</strong>:<br />
            - ReLU: 단순성 + 속도<br />
            - GELU: 부드러움 + probabilistic<br />
            - SwiGLU: gating + modern LLM
          </p>
          <p className="mt-2">
            <strong>공통 속성</strong>:<br />
            ✓ Non-linearity (universal approximation)<br />
            ✓ Unbounded above (no saturation for large x)<br />
            ✓ Differentiable (또는 거의)<br />
            ✓ Gradient가 0에 가깝지 않음 (non-zero mostly)
          </p>
          <p className="mt-2">
            <strong>2024 트렌드</strong>:<br />
            - Gating mechanism 중요 (SwiGLU, GLU)<br />
            - Non-monotonic 허용 (Swish)<br />
            - Simple is often better (ReLU 여전히 경쟁력)<br />
            - Architecture-specific optimization
          </p>
        </div>

      </div>
    </section>
  );
}
