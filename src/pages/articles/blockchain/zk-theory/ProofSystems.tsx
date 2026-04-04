import ProofSystemsViz from './viz/ProofSystemsViz';

export default function ProofSystems() {
  return (
    <section id="proof-systems" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARKs vs STARKs vs IOP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          증명 크기, 검증 속도, 셋업, 양자 내성 &mdash; 시스템별 트레이드오프 비교.
        </p>
      </div>
      <div className="not-prose"><ProofSystemsViz /></div>
    </section>
  );
}
