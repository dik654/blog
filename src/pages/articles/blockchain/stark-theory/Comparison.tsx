import ComparisonViz from './viz/ComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK vs STARK</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SNARK = 작은 proof + 타원곡선 의존. STARK = 큰 proof + 양자 내성 + 투명 셋업.
        </p>
      </div>
      <div className="not-prose"><ComparisonViz /></div>
    </section>
  );
}
