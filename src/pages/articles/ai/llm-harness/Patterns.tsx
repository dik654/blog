import PatternsViz from './viz/PatternsViz';

export default function Patterns() {
  return (
    <section id="patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 패턴</h2>
      <div className="not-prose mb-8"><PatternsViz /></div>
    </section>
  );
}
