import RNNUnrollViz from './viz/RNNUnrollViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN 구조</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        은닉 상태(h_t)가 시간축으로 순환 — 이전 출력이 현재 입력과 합쳐진다.<br />
        모든 시간 단계에서 동일한 가중치를 공유하여 가변 길이 시퀀스 처리 가능.
      </p>
      <RNNUnrollViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">RNN 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RNN Architecture:

// Forward pass (at time t):
// h_t = tanh(W_hh · h_(t-1) + W_xh · x_t + b_h)
// y_t = W_hy · h_t + b_y
//
// Parameters:
// W_xh: input-to-hidden (I × H)
// W_hh: hidden-to-hidden (H × H)
// W_hy: hidden-to-output (H × O)
// b_h, b_y: biases

// Unrolled view:
// t=1:  x_1 → h_1
// t=2:  x_2 + h_1 → h_2
// t=3:  x_3 + h_2 → h_3
// ...
// t=T:  x_T + h_(T-1) → h_T

// Initial state:
// h_0 = zeros (typical)
// or learned parameter
// or provided externally

// Activation function:
// tanh: standard, [-1, 1] range
// ReLU: rare for RNN (exploding)
// sigmoid: used in gates

// Weight sharing:
// - same W_xh, W_hh across all t
// - parameter count: O(I·H + H²)
// - independent of sequence length

// Computational complexity:
// - time: O(T · H²) per sequence
// - space: O(T · H) for activations
// - memory can be large

// Memory & context:
// - theoretically infinite context
// - practically limited by vanishing gradient
// - effective context: ~10-20 steps
// - LSTM/GRU: ~100-200 steps
// - Transformer: thousands

// Deep RNNs (stacked):
// h_t^(1) = f(h_(t-1)^(1), x_t)
// h_t^(2) = f(h_(t-1)^(2), h_t^(1))
// h_t^(3) = f(h_(t-1)^(3), h_t^(2))
// - deeper representations
// - more parameters

// Bidirectional RNN:
// forward h_t: ← past context
// backward h'_t: → future context
// output: concat(h_t, h'_t)
// - sees past + future
// - not for online prediction

// RNN variants hierarchy:
// Elman → LSTM → GRU → Transformer
// each addresses previous limitations

// Training tricks:
// - gradient clipping
// - truncated BPTT
// - proper initialization
// - teacher forcing
// - scheduled sampling

// PyTorch example:
// rnn = nn.RNN(input_size=100, hidden_size=128, batch_first=True)
// out, h_n = rnn(x)
// # x: (batch, seq, input)
// # out: (batch, seq, hidden)
// # h_n: (1, batch, hidden)`}
        </pre>
        <p className="leading-7">
          RNN: <strong>h_t = tanh(W_hh·h_(t-1) + W_xh·x_t)</strong>.<br />
          weight sharing across time, O(T·H²) computation.<br />
          effective context ~10-20 steps (vanishing gradient).
        </p>
      </div>
    </section>
  );
}
