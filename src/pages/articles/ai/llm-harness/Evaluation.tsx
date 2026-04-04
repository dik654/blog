import EvaluationViz from './viz/EvaluationViz';

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">평가 & 테스트</h2>
      <div className="not-prose mb-8"><EvaluationViz /></div>
    </section>
  );
}
