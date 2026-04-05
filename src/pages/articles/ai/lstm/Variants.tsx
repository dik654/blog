import VariantsViz from './viz/VariantsViz';

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSTM 변형과 GRU</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        LSTM 이후 다양한 변형이 등장. GRU는 게이트를 줄여 효율을 높였다.
      </p>
      <VariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 변형 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LSTM 변형들:

// 1. GRU (Cho 2014):
// - 2 gates (reset + update)
// - no separate cell state
// - simpler, faster
// r_t = σ(W_r · [h_(t-1), x_t])
// z_t = σ(W_z · [h_(t-1), x_t])
// h̃_t = tanh(W · [r_t ⊙ h_(t-1), x_t])
// h_t = (1-z_t) ⊙ h_(t-1) + z_t ⊙ h̃_t
// vs LSTM: ~75% params, similar perf

// 2. Peephole LSTM:
// - gates see cell state
// - marginal improvement

// 3. Coupled Input/Forget:
// - i_t = 1 - f_t
// - slightly simpler

// 4. Bidirectional LSTM:
// - forward + backward
// - past + future context
// - 2x params
// - NER, tagging 표준

// 5. Stacked LSTM:
// - multiple layers
// - 2-4 layers common
// - deeper representations

// 6. LSTM + Attention:
// - pre-Transformer era
// - seq2seq models

// 7. ConvLSTM:
// - spatial + temporal
// - video, weather

// 8. Tree LSTM:
// - tree-structured
// - syntax parsing

// Applications:
// LSTM: long sequences, text
// GRU: efficient, mobile
// Bi-LSTM: NER, POS tagging

// 2024 state:
// - Transformer dominant
// - LSTM/GRU niche use
// - time series, RL
// - edge devices

// Modern hybrids:
// - Mamba (SSM, 2023)
// - RWKV (RNN-Transformer)
// - RetNet (2023)
// - linear attention`}
        </pre>
        <p className="leading-7">
          Variants: <strong>GRU, Peephole, Bi-LSTM, Stacked, ConvLSTM</strong>.<br />
          GRU: 2 gates, simpler, often preferred.<br />
          2024 state: Mamba, RWKV new hybrid 부상.
        </p>
      </div>
    </section>
  );
}
