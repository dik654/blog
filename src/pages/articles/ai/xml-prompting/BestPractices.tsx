import BestPracticesViz from './viz/BestPracticesViz';
import BestPracticesDetailViz from './viz/BestPracticesDetailViz';

export default function BestPractices() {
  return (
    <section id="best-practices" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 가이드</h2>
      <div className="not-prose mb-8"><BestPracticesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">XML Prompting Best Practices</h3>
        <div className="not-prose mb-6"><BestPracticesDetailViz /></div>
        <p className="leading-7">
          Best practices: <strong>consistent + explicit + examples + validation</strong>.<br />
          production patterns: QA, extraction, classification, multi-turn, tool use.<br />
          XML overhead 10-20% tokens, but worth for reliability.
        </p>
      </div>
    </section>
  );
}
