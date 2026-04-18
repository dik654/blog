import PlanExecuteViz from './viz/PlanExecuteViz';
import PlanExecuteDetailViz from './viz/PlanExecuteDetailViz';

export default function PlanExecute() {
  return (
    <section id="plan-execute" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plan-and-Execute &amp; Reflection</h2>
      <div className="not-prose mb-8"><PlanExecuteViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Plan-and-Execute — <strong>planning + execution 분리</strong>.<br />
          Reflection — 실행 결과 자가 비평 + 수정.<br />
          ReAct의 verbose 문제 해결 + 복잡한 작업 처리.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Plan-and-Execute 패턴</h3>
        <div className="not-prose mb-6"><PlanExecuteDetailViz /></div>
        <p className="leading-7">
          Plan-Execute: <strong>plan once, execute many</strong> — less LLM calls.<br />
          Reflection: actor → critic → refiner loop.<br />
          combined: plan + execute + reflect → highest quality.
        </p>
      </div>
    </section>
  );
}
