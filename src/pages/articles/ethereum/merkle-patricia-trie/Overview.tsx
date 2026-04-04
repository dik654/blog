import MPTOverviewViz from './viz/MPTOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: 왜 MPT인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움의 전체 상태(World State)는 주소 → 계정 매핑으로 구성된 거대한 key-value 저장소.<br />
          효율적 조회, 무결성 증명(Merkle Proof), 경로 압축을 동시에 충족해야 함
        </p>
      </div>
      <div className="not-prose"><MPTOverviewViz /></div>
    </section>
  );
}
