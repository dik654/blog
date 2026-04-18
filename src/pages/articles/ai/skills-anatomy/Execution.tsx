import ExecutionViz from './viz/ExecutionViz';
import ExecutionDetailViz from './viz/ExecutionDetailViz';

export default function Execution() {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 파이프라인</h2>
      <div className="not-prose"><ExecutionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill 실행 파이프라인</h3>
        <div className="not-prose mb-6"><ExecutionDetailViz /></div>
        <p className="leading-7">
          Execution: <strong>Selection → Loading → Preparation → Execution → Integration</strong>.<br />
          simple: 1-3 calls, complex: 10+ tool invocations.<br />
          permissions, logging, versioning 지원.
        </p>
      </div>
    </section>
  );
}
