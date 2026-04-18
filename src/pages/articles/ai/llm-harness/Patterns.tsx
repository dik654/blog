import PatternsViz from './viz/PatternsViz';
import PatternsDetailViz from './viz/PatternsDetailViz';

export default function Patterns() {
  return (
    <section id="patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 패턴</h2>
      <div className="not-prose mb-8"><PatternsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Harness Patterns</h3>
        <div className="not-prose mb-6"><PatternsDetailViz /></div>
        <p className="leading-7">
          10 patterns: <strong>RAG, Agent, Guarded Chain, Consensus, Critic, Few-shot, Structured, Streaming, Tool-use, HITL</strong>.<br />
          pattern selection depends on task characteristics.<br />
          RAG + Agent + Structured 결합 (production grade).
        </p>
      </div>
    </section>
  );
}
