import CellStateViz from './viz/CellStateViz';

export default function CellState() {
  return (
    <section id="cell-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">셀 상태와 정보 흐름</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        셀 상태(Cell State) — 컨베이어 벨트처럼 직선으로 흐르는 LSTM의 핵심 통로.<br />
        C_t = f_t * C_(t-1) + i_t * C̃_t — 덧셈 구조가 기울기 소실을 방지한다.
      </p>
      <CellStateViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cell State 수식</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cell State Update:
// C_t = f_t ⊙ C_(t-1) + i_t ⊙ C̃_t

// 왜 addition이 중요한가:
//
// Vanilla RNN:
// h_t = tanh(W · [h_(t-1), x_t] + b)
// gradient involves repeated × W
// → vanishing
//
// LSTM:
// C_t = f_t ⊙ C_(t-1) + new_info
// gradient: ∂C_t/∂C_(t-1) ≈ f_t
// → addition preserves gradient
// → "gradient highway"

// Gradient flow:
// ∂C_t/∂C_0 = ∏ f_t
// - f_t ∈ [0, 1]
// - selective preservation
// - forget gate controls flow

// Interpretation:
// - cell state = memory
// - 시간축으로 지속
// - 필요시 read/write
// - scratchpad

// LSTM Cell implementation:
// class LSTMCell:
//     def forward(self, x, h_prev, c_prev):
//         concat = [h_prev, x]
//         f = sigmoid(concat @ W_f)
//         i = sigmoid(concat @ W_i)
//         c_tilde = tanh(concat @ W_c)
//         o = sigmoid(concat @ W_o)
//
//         c_new = f * c_prev + i * c_tilde
//         h_new = o * tanh(c_new)
//         return h_new, c_new`}
        </pre>
        <p className="leading-7">
          Cell state: <strong>additive update → gradient highway</strong>.<br />
          C_t = f_t ⊙ C_(t-1) + i_t ⊙ C̃_t.<br />
          vanishing gradient 완화의 수학적 기반.
        </p>
      </div>
    </section>
  );
}
