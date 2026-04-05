import DimReduceViz from './viz/DimReduceViz';

export default function Dimensionality() {
  return (
    <section id="dimensionality" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">차원 축소</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          동시발생 행렬은 V x V 크기의 희소 행렬이다.
          <br />
          대부분의 정보는 소수의 주요 축에 집중 — SVD로 핵심만 추출할 수 있다.
        </p>
      </div>
      <div className="not-prose"><DimReduceViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">차원 축소 기법</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Dimensionality Reduction:

// Why reduce dimensions?
// - V×V matrix 너무 큼 (V=100K → 10GB)
// - sparse (대부분 0)
// - noise in raw counts
// - need compact representation

// SVD (Singular Value Decomposition):
// M = U · Σ · V^T
// - M: V×V matrix
// - U: V×k left singular vectors
// - Σ: k×k diagonal (singular values)
// - V^T: k×V right singular vectors
// - k: reduced dimensions (k << V)

// Truncated SVD:
// M_k = U_k · Σ_k · V_k^T
// - keep top k singular values
// - U_k: word embeddings (V×k)
// - best rank-k approximation

// LSA (Latent Semantic Analysis):
// - apply SVD to term-doc matrix
// - dimensions k=100-300
// - captures "latent" semantics
// - foundational NLP technique

// Word similarity from LSA:
// - each word: k-dim vector
// - cosine sim on reduced vectors
// - captures synonymy
// - generalizes beyond raw counts

// Example:
// Input: V=50000, 300-dim reduction
// SVD: U (50K × 300), Σ (300×300), V^T (300 × 50K)
// Output: each word → 300-dim vector

// Complexity:
// - SVD of V×V: O(V³) naive
// - sparse SVD: O(V² · k)
// - still expensive for large V
// - Lanczos, randomized SVD faster

// Alternatives:
// - PCA: principal component analysis
// - NMF: non-negative matrix factorization
// - Autoencoders: neural dim reduction
// - t-SNE, UMAP: visualization only

// Why k=300?
// - too small: loses info
// - too large: sparse, overfit
// - empirical sweet spot
// - Word2Vec also uses ~300

// Statistical methods vs neural:
// SVD/LSA:
// - one-shot computation
// - global statistics
// - deterministic
// - interpretable
//
// Word2Vec:
// - iterative (SGD)
// - local context
// - stochastic
// - task-specific

// GloVe (bridge):
// - uses co-occurrence + SGD
// - combines both approaches
// - often best for classical tasks

// Modern shift:
// - static embeddings (Word2Vec, GloVe) →
// - contextual (BERT, GPT)
// - same word has context-dependent vector
// - even more powerful`}
        </pre>
        <p className="leading-7">
          SVD: <strong>M = U·Σ·V^T, truncated rank-k</strong>.<br />
          LSA: k=100-300 dim, captures latent semantics.<br />
          PCA, NMF, Autoencoders 대안 기법들.
        </p>
      </div>
    </section>
  );
}
