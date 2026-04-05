import SoftmaxViz from './viz/SoftmaxViz';
import SoftmaxExamplesViz from './viz/SoftmaxExamplesViz';
import TemperatureViz from './viz/TemperatureViz';

export default function Softmax() {
  return (
    <section id="softmax" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소프트맥스: 숫자를 확률로</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        h값의 범위가 자유로움 → 0~1 확률로 변환 필요.<br />
        Softmax: y_i = e^h_i / Σe^h_j — 큰 값은 확대, 작은 값은 축소.
      </p>
      <SoftmaxViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax 수학적 정의 & 예시</h3>
        <p>
          <code>p_i = exp(x_i) / Σ exp(x_j)</code> — 입력 크기 차이에 따라 증폭 정도가 극단적으로 달라짐<br />
          속성: Monotonic (순서 보존), Translation invariant (<code>softmax(x+c)=softmax(x)</code>), Not scale invariant (큰 스케일에선 극단값만 남음)
        </p>
      </div>
      <SoftmaxExamplesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Temperature Scaling — 분포 조절</h3>
        <p>
          <code>softmax(x/T)</code> — T→0이면 argmax에 수렴, T→∞면 uniform으로 수렴<br />
          T=1은 표준, 작을수록 sharp, 클수록 flat
        </p>
      </div>
      <TemperatureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">수치 안정 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 문제: exp overflow
// exp(1000) = inf (float overflow)

// Translation invariance 활용
// softmax(x) = softmax(x - c) for any constant c

// Stable implementation
def stable_softmax(x):
    x_max = x.max()              // 최대값 찾기
    exp_x = np.exp(x - x_max)    // 최대값 빼기 (0 <= exp_x <= 1)
    return exp_x / exp_x.sum()

// 증명
// softmax(x_i) = exp(x_i) / Σ exp(x_j)
//              = [exp(x_i - c) · exp(c)] / [Σ exp(x_j - c) · exp(c)]
//              = exp(x_i - c) / Σ exp(x_j - c)

// c = max(x) 선택 시
// - 가장 큰 원소가 0이 됨
// - 다른 원소는 음수 → exp <= 1
// - overflow 원천 차단

// GPU 구현 (CUDA)
// Online softmax: 한 번의 pass로 계산 (FlashAttention)
// 1) 첫 pass: max와 sum 동시 계산
// 2) 두 번째 pass: 결과 계산
// 메모리 접근 최소화`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">대안: LogSoftmax</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Softmax의 로그
// log_softmax(x) = x - logsumexp(x)
//
// logsumexp(x) = log(Σ exp(x_i))
//             = x_max + log(Σ exp(x_i - x_max))

// 왜 log_softmax?
// 1) 수치 안정 (log(0) 문제 회피)
// 2) Cross-entropy loss가 log(softmax)이므로 직접 사용
// 3) NLL loss와 결합: log_softmax + NLLLoss = CrossEntropyLoss

// PyTorch
// Method 1: 함수
log_probs = F.log_softmax(logits, dim=-1)
loss = F.nll_loss(log_probs, targets)

// Method 2: 결합 (자동 안정)
loss = F.cross_entropy(logits, targets)  # 내부적으로 log_softmax 사용

// 성능
// - log_softmax가 softmax보다 수치 안정
// - Loss 계산 시 log 불필요 (이미 log 형태)
// - Gradient 더 stable`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Softmax 변형들</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Sparsemax (Martins & Astudillo 2016)
// - Output이 sparse (많은 값이 정확히 0)
// - Attention에서 interpretability 향상
// - Softmax의 L2 regularized 버전

// 2. Gumbel-Softmax (Jang et al. 2017)
// - Discrete sampling을 differentiable하게
// - VAE with discrete latent
// - Reinforcement learning policy

// 3. Mixture of Softmaxes (MoS, Yang et al. 2017)
// - K개 softmax의 weighted combination
// - 언어 모델의 표현력 증가
// - "Softmax bottleneck" 해결

// 4. Hierarchical Softmax
// - 큰 vocabulary 처리 (수백만 클래스)
// - Tree-based decomposition
// - 복잡도 O(V) → O(log V)

// 5. Scaled Softmax (attention)
// - softmax(QK^T / √d_k)
// - Scale로 gradient 안정화
// - Transformer 필수

// 6. Softmax with temperature (앞서 다룸)
// 7. Taylor Softmax / Exponential family variants`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Softmax의 기원과 의미</p>
          <p>
            <strong>Boltzmann Distribution</strong>: Statistical mechanics에서 유래<br />
            p(state) ∝ exp(-E / kT)<br />
            - Softmax = -x가 energy인 Boltzmann<br />
            - Temperature가 유사한 역할<br />
            - Physical intuition
          </p>
          <p className="mt-2">
            <strong>왜 exp인가?</strong>:<br />
            - Maximum entropy under constraint → exponential family<br />
            - Non-negative 보장<br />
            - Scale-invariant 성질 (translation)<br />
            - Gradient가 깔끔 (ŷ - y with CE)
          </p>
          <p className="mt-2">
            <strong>대안 가능?</strong>:<br />
            - sigmoid/n: 간단하지만 확률 아님<br />
            - squaring: 음수 문제<br />
            - argmax: differentiable 아님<br />
            → Softmax가 여러 측면에서 최적
          </p>
        </div>

      </div>
    </section>
  );
}
