import DimReduceViz from './viz/DimReduceViz';
import DimDeepViz from './viz/DimDeepViz';

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
        <div className="not-prose"><DimDeepViz /></div>
        <p className="leading-7">
          SVD: <strong>M = U·Σ·V^T, truncated rank-k</strong>.<br />
          LSA: k=100-300 dim, captures latent semantics.<br />
          PCA, NMF, Autoencoders 대안 기법들.
        </p>
      </div>
    </section>
  );
}
