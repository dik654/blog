import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MDBX가 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          블록체인 노드는 수십억 개의 key-value 쌍을 저장하고 빠르게 조회해야 합니다.<br />
          DB 엔진 선택이 동기화 속도와 쿼리 지연에 직접적 영향을 줍니다
        </p>
        <p className="leading-7">
          LSM-tree(LevelDB, RocksDB)는 쓰기에 최적화되었지만,
          compaction 간섭으로 읽기 지연이 불안정합니다.<br />
          B+tree(LMDB, MDBX)는 읽기 O(log n)이 보장되어 예측 가능한 성능을 제공합니다
        </p>
        <p className="leading-7">
          MDBX는 Leonid Yuriev가 LMDB를 포크하여 만든 개선판입니다.<br />
          Reth가 이 엔진을 채택한 이유를 이해하려면 MDBX 내부 동작을 알아야 합니다
        </p>
      </div>
      <div className="not-prose">
        <OverviewViz />
      </div>
    </section>
  );
}
