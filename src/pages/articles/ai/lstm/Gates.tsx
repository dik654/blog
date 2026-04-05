import GateViz from './viz/GateViz';

export default function Gates() {
  return (
    <section id="gates" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게이트 메커니즘</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        LSTM의 3개 게이트 — 각각 시그모이드(σ) 출력 [0,1]로 정보 흐름을 제어.<br />
        0 = 완전 차단, 1 = 완전 통과.
      </p>
      <GateViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">3 게이트 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LSTM 3 Gates:

// 1. Forget Gate (f_t):
// f_t = σ(W_f · [h_(t-1), x_t] + b_f)
// Role: "과거 정보 중 얼마나 버릴까?"
// 0: 완전히 잊음, 1: 완전히 보존

// 2. Input Gate (i_t):
// i_t = σ(W_i · [h_(t-1), x_t] + b_i)
// C̃_t = tanh(W_c · [h_(t-1), x_t] + b_c)
// Role: "새 정보 중 얼마나 저장?"
// i_t * C̃_t 만큼 추가

// 3. Output Gate (o_t):
// o_t = σ(W_o · [h_(t-1), x_t] + b_o)
// h_t = o_t ⊙ tanh(C_t)
// Role: "cell state 중 얼마나 출력?"

// Gate activations:
// σ (sigmoid) → [0, 1]: filter/gate
// tanh → [-1, 1]: normalized values
// ⊙: element-wise multiplication

// Parameter count:
// 4 × H × (H + I + 1)
// - H=512, I=300: ~1.6M/layer
// - 4x vanilla RNN

// Training:
// - forget gate bias 초기화 1
//   (start by remembering)
// - gradient through cell state
// - slower than vanilla RNN

// 직관적 해석:
// forget: 메모리에서 지울 것
// input: 메모리에 쓸 것
// output: 메모리에서 읽을 것
// cell state: 메모리 자체

// PyTorch:
// lstm = nn.LSTM(input_size=300,
//                hidden_size=512,
//                num_layers=2)
// output, (h_n, c_n) = lstm(x)`}
        </pre>
        <p className="leading-7">
          3 gates: <strong>forget (잊기) + input (쓰기) + output (읽기)</strong>.<br />
          sigmoid로 filter, tanh로 normalized.<br />
          4 weight matrices — 4x vanilla RNN params.
        </p>
      </div>
    </section>
  );
}
