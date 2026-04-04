import TraceTableViz from './viz/TraceTableViz';

export default function ExecutionTrace() {
  return (
    <section id="execution-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 추적 (Execution Trace)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          계산을 테이블로 표현 &mdash; 행=스텝, 열=레지스터. 각 열을 다항식으로 보간.
        </p>
      </div>
      <div className="not-prose"><TraceTableViz /></div>
    </section>
  );
}
