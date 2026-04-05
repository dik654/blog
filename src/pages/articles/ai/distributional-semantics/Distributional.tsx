import CooccurrenceViz from './viz/CooccurrenceViz';

export default function Distributional() {
  return (
    <section id="distributional" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분포 가설과 동시발생</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        분포 가설 — "비슷한 맥락에 등장하는 단어는 비슷한 의미."<br />
        코퍼스를 윈도우로 훑어 동시발생 횟수를 행렬로 기록한다.
      </p>
      <CooccurrenceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">분포 가설 &amp; 동시발생</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Distributional Hypothesis (Harris, 1954):
// "You shall know a word by the company it keeps"
// - Firth (1957)
//
// Meaning: similar contexts → similar meanings
// - "the cat sat on the mat"
// - "the dog sat on the rug"
// - cat and dog share context (sat on)
// - → semantically similar

// Co-occurrence Matrix:
// Build V×V matrix where:
// - rows: target words
// - cols: context words
// - values: co-occurrence counts

// Window-based:
// - slide window over corpus
// - count word pairs in window
// - window size: typically 2-10

// Example:
// Corpus: "I love cats. Cats are cute."
// Window=1:
//            I  love  cats  are  cute
// I          0   1    0    0    0
// love       1   0    1    0    0
// cats       0   1    0    1    0
// are        0   0    1    0    1
// cute       0   0    0    1    0

// PPMI (Positive Pointwise Mutual Information):
// - raw counts biased to frequent words
// - PPMI normalizes
// - PMI(w,c) = log(P(w,c) / (P(w)·P(c)))
// - PPMI = max(PMI, 0)
// - better similarity metric

// Limitations of raw co-occurrence:
// - very sparse (V×V, mostly zeros)
// - large memory (V=100K → 10^10 entries)
// - no generalization
// - synonym handling poor

// Cosine similarity:
// sim(w1, w2) = (w1 · w2) / (|w1| × |w2|)
// - measures angle between vectors
// - ignores magnitude
// - range: [-1, 1]
// - 1: identical, 0: orthogonal

// Classical methods:
// - Term-Document matrix (TF-IDF)
// - Word-Context matrix
// - PPMI + SVD
// - LSA (Latent Semantic Analysis)

// Neural methods replaced these:
// - Word2Vec (2013)
// - GloVe (2014)
// - FastText (2016)
// - contextual: BERT, GPT

// But concepts persist:
// - distributional hypothesis
// - context matters
// - similarity via proximity
// - compositional semantics`}
        </pre>
        <p className="leading-7">
          분포 가설: <strong>"같은 context = 같은 의미" (Harris 1954)</strong>.<br />
          co-occurrence matrix, PPMI normalize, cosine similarity.<br />
          classical (LSA, SVD) → neural (Word2Vec, GloVe, BERT).
        </p>
      </div>
    </section>
  );
}
