import ECComparisonViz from './viz/ECComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        RS vs Fountain vs LDPC 비교
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          MDS(최적) vs Rateless vs Near-MDS &mdash; 코드 유형별 트레이드오프 비교.
        </p>
      </div>
      <div className="not-prose"><ECComparisonViz /></div>
    </section>
  );
}
