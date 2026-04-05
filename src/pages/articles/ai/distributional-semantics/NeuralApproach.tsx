import NeuralViz from './viz/NeuralViz';

export default function NeuralApproach() {
  return (
    <section id="neural-approach" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">신경망 기반 접근</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          통계 기반 방법의 근본 한계를 넘기 위해 추론 기반(prediction-based) 방법이 등장했다.
          <br />
          주변 단어로 중심 단어를 "예측"하는 과정에서 임베딩을 학습한다.
        </p>
      </div>
      <div className="not-prose"><NeuralViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Neural Word Embeddings</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Neural Word Embeddings:

// Motivation:
// - statistical: global counts, one-shot
// - neural: predict, iteratively learn
// - scales better
// - task-aware

// Word2Vec (Mikolov 2013):
// Two architectures:

// 1. CBOW (Continuous Bag of Words):
// - predict target from context
// - input: surrounding words
// - output: center word probability
// - faster training

// 2. Skip-gram:
// - predict context from target
// - input: center word
// - output: surrounding words
// - better for rare words

// CBOW example:
// context: "the", "sat", "on", "mat"
// target: "cat"
// model: avg(context_vectors) → predict "cat"

// Skip-gram example:
// input: "cat"
// targets: "the", "sat", "on", "mat"
// model: cat_vector → predict each

// Loss function (softmax):
// L = -log P(target | context)
// P(w | c) = exp(v_w · v_c) / Σ exp(v_w' · v_c)

// Computational challenge:
// - softmax over V vocabulary
// - V=100K → expensive
// - solution: negative sampling

// Negative Sampling:
// - instead of full softmax
// - sample k negative words
// - binary classification
// - much faster

// L = log σ(v_w · v_c) + Σ log σ(-v_neg · v_c)
// - maximize positive pair similarity
// - minimize negative pair similarity

// GloVe (Pennington 2014):
// - hybrid: co-occurrence + neural
// - explicit loss on ratios
// - J = Σ f(X_ij) · (w_i · w_j + b_i + b_j - log X_ij)²
// - often better than Word2Vec

// FastText (2016):
// - subword information
// - character n-grams
// - handles OOV words
// - morphologically rich languages

// Training tips:
// - large corpus (billions of words)
// - high dimension (200-300)
// - window size (5-10)
// - negative samples (5-20)
// - SGD with momentum

// Properties of embeddings:
// - analogies: king - man + woman ≈ queen
// - clustering: similar words close
// - arithmetic: vector operations meaningful
// - compositional

// Applications:
// - search
// - classification
// - sentiment analysis
// - machine translation (pre-Transformer)
// - word similarity

// 2013-2017: word embeddings era
// 2018+: contextual embeddings dominate
// - BERT, ELMo
// - context-aware
// - same word, different vectors

// Legacy concepts:
// - distributed representation
// - negative sampling
// - subword tokenization
// - evaluation benchmarks`}
        </pre>
        <p className="leading-7">
          Word2Vec: <strong>CBOW + Skip-gram, negative sampling</strong>.<br />
          GloVe: co-occurrence + neural hybrid.<br />
          FastText: subword, OOV handling.
        </p>
      </div>
    </section>
  );
}
