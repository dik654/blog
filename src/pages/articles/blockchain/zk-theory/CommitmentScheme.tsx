import CommitmentViz from './viz/CommitmentViz';

export default function CommitmentScheme() {
  return (
    <section id="commitment-scheme" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pedersen 커밋먼트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          값을 확정하되 공개하지 않는 &ldquo;봉인된 봉투&rdquo; &mdash; Bulletproofs, PLONK의 기반 빌딩 블록.
        </p>
      </div>
      <div className="not-prose"><CommitmentViz /></div>
    </section>
  );
}
