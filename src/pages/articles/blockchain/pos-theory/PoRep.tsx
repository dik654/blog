import PoRepFlowViz from './viz/PoRepFlowViz';

export default function PoRep() {
  return (
    <section id="porep" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Replication (PoRep)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          원본 데이터의 고유하고 독립적인 물리적 복제본을 생성했음을 증명.<br />
          Sybil 공격(하나의 복제본으로 여러 저장을 주장)을 방지
        </p>
      </div>
      <div className="not-prose"><PoRepFlowViz /></div>
    </section>
  );
}
