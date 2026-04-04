import BestPracticesViz from './viz/BestPracticesViz';

export default function BestPractices() {
  return (
    <section id="best-practices" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 가이드</h2>
      <div className="not-prose mb-8"><BestPracticesViz /></div>
    </section>
  );
}
