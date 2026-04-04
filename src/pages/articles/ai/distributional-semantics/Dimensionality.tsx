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
    </section>
  );
}
