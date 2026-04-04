import StorageProofOverviewViz from './viz/StorageProofOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: 저장 증명 분류</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          저장 증명(Proof of Storage) — 분산 저장소에서 데이터가 실제로 보관 중임을 암호학적으로 보장하는 프로토콜.<br />
          PoR, PoRep, PoSt 세 가지로 분류되며 각각 다른 보안 속성을 보장
        </p>
      </div>
      <div className="not-prose"><StorageProofOverviewViz /></div>
    </section>
  );
}
