import LagrangeConceptViz from './viz/LagrangeConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lagrange 보간이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n개 점이 주어지면 그 점들을 모두 지나는 유일한 n-1차 다항식 복원.
          <br />
          INTT의 핵심 원리.
        </p>
      </div>
      <div className="not-prose"><LagrangeConceptViz /></div>
    </section>
  );
}
