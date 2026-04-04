import PlanExecuteViz from './viz/PlanExecuteViz';

export default function PlanExecute() {
  return (
    <section id="plan-execute" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plan-and-Execute & Reflection</h2>
      <div className="not-prose mb-8"><PlanExecuteViz /></div>
    </section>
  );
}
