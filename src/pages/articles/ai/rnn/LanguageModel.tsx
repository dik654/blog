import LanguageModelViz from './viz/LanguageModelViz';

export default function LanguageModel() {
  return (
    <section id="language-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">언어 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        P(w_t | w_1...w_(t-1)) — 다음 단어 예측이 핵심 과제.<br />
        n-gram은 직전 n-1개만 참조. RNN 은닉 상태는 이론적으로 무한 맥락 압축.
      </p>
      <LanguageModelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">RNN Language Model</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Language Modeling:

// Task:
// P(w_t | w_1, w_2, ..., w_(t-1))
// "next word prediction"

// Joint probability:
// P(sentence) = ∏_t P(w_t | history)

// Approaches:

// 1. n-gram models:
// P(w_t | w_(t-n+1), ..., w_(t-1))
// - 단순
// - 한정된 context (n-1 words)
// - sparsity issue
// - smoothing 필요

// 2. Neural LM (Bengio 2003):
// - feed-forward network
// - word embeddings
// - fixed context size

// 3. RNN LM (Mikolov 2010):
// - unlimited context theoretically
// - hidden state = compressed history
// - better perplexity

// Training:
// - teacher forcing
// - cross-entropy loss
// - softmax over vocabulary
// - perplexity metric

// Loss function:
// L = -Σ log P(w_t | history)
// - negative log likelihood
// - equivalent to cross-entropy

// Perplexity:
// PP = exp(L)
// - lower is better
// - 1.0 = perfect
// - random guess: vocab size
// - typical: 50-200

// Generation (inference):
// 1. feed seed tokens
// 2. predict next word
// 3. sample/argmax
// 4. feed back as input
// 5. repeat

// Sampling strategies:
// - greedy: argmax
// - random sampling: P(w)
// - top-k sampling: top k probs
// - top-p (nucleus): cumulative prob
// - temperature: soften distribution

// Temperature:
// P'(w) = P(w)^(1/T) / Z
// T=1: original
// T<1: sharper (deterministic)
// T>1: flatter (creative)

// Applications:
// - text completion
// - machine translation
// - speech recognition
// - dialog systems
// - code generation

// RNN LM limitations:
// - sequential (no parallelization)
// - limited long-range dependency
// - slower training
// - worse quality than Transformer

// Replaced by Transformer (2017):
// - parallel training
// - unlimited attention
// - better quality
// - scales to GPT-4+ level

// Legacy:
// - concepts still relevant
// - embeddings (Word2Vec)
// - teacher forcing
// - perplexity metric
// - beam search`}
        </pre>
        <p className="leading-7">
          RNN LM: <strong>P(w_t | history), cross-entropy loss, perplexity metric</strong>.<br />
          generation: greedy, random, top-k, top-p, temperature.<br />
          Transformer(2017)에 대부분 대체되었으나 concepts는 유효.
        </p>
      </div>
    </section>
  );
}
