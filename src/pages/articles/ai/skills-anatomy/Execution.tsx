import ExecutionViz from './viz/ExecutionViz';

export default function Execution() {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 파이프라인</h2>
      <div className="not-prose"><ExecutionViz /></div>
    </section>
  );
}
