import PoStFlowViz from './viz/PoStFlowViz';

export default function PoSt() {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Spacetime (PoSt)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          합의된 기간 동안 지속적으로 데이터를 저장하고 있음을 증명.<br />
          주기적 챌린지를 통해 "시간 축"을 따라 저장 지속성을 검증
        </p>
      </div>
      <div className="not-prose"><PoStFlowViz /></div>
    </section>
  );
}
