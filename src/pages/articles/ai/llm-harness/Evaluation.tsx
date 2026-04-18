import EvaluationViz from './viz/EvaluationViz';
import EvaluationDetailViz from './viz/EvaluationDetailViz';

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">평가 &amp; 테스트</h2>
      <div className="not-prose mb-8"><EvaluationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">LLM Harness 평가 방법</h3>
        <div className="not-prose mb-6"><EvaluationDetailViz /></div>
        <p className="leading-7">
          Evaluation: <strong>metrics + LLM-as-judge + unit tests + A/B</strong>.<br />
          frameworks: OpenAI Evals, DeepEval, Ragas (RAG).<br />
          production metrics: latency + cost + safety + retention.
        </p>
      </div>
    </section>
  );
}
