import BPTTViz from './viz/BPTTViz';

export default function BPTT() {
  return (
    <section id="bptt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시간 역전파 (BPTT)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        BPTT — 순환 구조를 시간축으로 펼쳐 일반 역전파를 적용하는 학습 알고리즘.
      </p>
      <BPTTViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BPTT 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Backpropagation Through Time (BPTT):

// Concept:
// - RNN은 재귀적 구조
// - 시간축으로 펼쳐서(unroll) DAG 만듦
// - 일반 backprop 적용
// - gradient가 시간 거슬러 흐름

// Forward pass:
// for t in 1..T:
//     h_t = f(W, h_(t-1), x_t)
//     y_t = g(V, h_t)
//     loss_t = L(y_t, target_t)
// total_loss = sum(loss_t)

// Backward pass (BPTT):
// for t in T..1:
//     grad_V += dL_t/dV
//     grad_W += dL_t/dW (via chain rule through time)
// update: V -= lr * grad_V, W -= lr * grad_W

// Gradient flow:
// dL/dW_t includes contributions from
// all losses at time t, t+1, ..., T
// through the chain: h_t → h_(t+1) → ... → h_T

// Mathematical form:
// dh_t/dh_(t-1) = W_hh · diag(tanh'(pre_t))
// dh_t/dh_(t-k) = ∏_{j=1}^{k} dh_(t-j+1)/dh_(t-j)
// - product of Jacobians
// - each contains W_hh

// Vanishing gradient:
// ||∏ Jacobian|| ≤ (||W_hh||)^k
// if ||W_hh|| < 1: exponential decay
// gradient → 0 for long sequences

// Exploding gradient:
// if ||W_hh|| > 1: exponential growth
// gradient → inf
// unstable training

// Truncated BPTT:
// - process sequences in chunks
// - backprop only K steps back
// - not full backprop
// - reduces memory
// - approximates full BPTT

// k=20 typical:
// sequence: 1000 tokens
// truncate every 20 tokens
// backprop 20 steps back
// forward: next chunk

// Gradient Clipping:
// if ||grad|| > threshold:
//     grad = grad * threshold / ||grad||
// - prevents explosion
// - simple + effective
// - threshold: typically 5-10

// Memory complexity:
// Full BPTT: O(T) memory (store all h_t)
// Truncated: O(K) memory (K steps)
// Reversible RNN: O(log T)

// Teacher forcing:
// - use true targets as input (not predictions)
// - during training only
// - inference uses own predictions
// - can cause distribution mismatch

// Optimizations:
// - mini-batch BPTT
// - CUDA kernels (cuDNN)
// - gradient checkpointing
// - mixed precision (FP16)

// Stability tips:
// - small learning rate
// - orthogonal initialization
// - layer normalization
// - dropout between time steps

// Alternative to BPTT:
// - Real-time Recurrent Learning (RTRL)
// - expensive: O(H^4)
// - online learning
// - rarely used`}
        </pre>
        <p className="leading-7">
          BPTT: <strong>unroll + standard backprop</strong>.<br />
          vanishing/exploding gradient (W_hh repeated multiply).<br />
          Truncated BPTT (K steps) + gradient clipping 실무 필수.
        </p>
      </div>
    </section>
  );
}
