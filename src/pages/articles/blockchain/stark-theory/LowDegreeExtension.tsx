import LDEViz from './viz/LDEViz';

export default function LowDegreeExtension() {
  return (
    <section id="low-degree-extension" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저차 확장 (Low-Degree Extension)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          유효한 trace = 저차 다항식, 잘못된 trace = 고차 &mdash; Reed-Solomon LDE로 차이 증폭.
        </p>
      </div>
      <div className="not-prose"><LDEViz /></div>
    </section>
  );
}
