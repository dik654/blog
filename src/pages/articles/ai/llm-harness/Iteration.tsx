import IterationViz from './viz/IterationViz';

export default function Iteration() {
  return (
    <section id="iteration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">반복 개선 루프</h2>
      <div className="not-prose mb-8"><IterationViz /></div>
    </section>
  );
}
