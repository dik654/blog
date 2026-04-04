import ProofFlowViz from './viz/ProofFlowViz';

export default function ProofPipeline() {
  return (
    <section id="proof-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK 증명 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Trace Commit &rarr; Constraint Composition &rarr; FRI &rarr; Query &rarr; Verify. 5단계 파이프라인.
        </p>
      </div>
      <div className="not-prose"><ProofFlowViz /></div>
    </section>
  );
}
