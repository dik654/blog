import LagrangeFormulaViz from './viz/LagrangeFormulaViz';

export default function Formula() {
  return (
    <section id="formula" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lagrange 보간 공식</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          각 점에서만 1이고 나머지에서 0인 &ldquo;선택 함수&rdquo;를 만들어 가중합.
        </p>
      </div>
      <div className="not-prose"><LagrangeFormulaViz /></div>
    </section>
  );
}
