import LsmVsBtreeViz from './viz/LsmVsBtreeViz';

export default function LsmVsBtree() {
  return (
    <section id="lsm-vs-btree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSM-tree vs B+tree 트레이드오프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          LSM-tree와 B+tree는 정반대의 트레이드오프를 가진다.<br />
          LSM은 쓰기에 최적화되고, B+tree는 읽기에 최적화된 자료구조다.
        </p>
        <p className="leading-7">
          쓰기: LSM-tree는 순차 쓰기로 변환하여 높은 처리량을 제공한다.<br />
          B+tree는 페이지 분할(split)과 Copy-on-Write가 필요하여 쓰기마다 여러 페이지를 갱신한다.
        </p>
        <p className="leading-7">
          읽기: B+tree는 O(log n)으로 3~4번의 페이지 접근만으로 찾는다.<br />
          LSM-tree는 여러 레벨을 순회해야 하므로 디스크 I/O 횟수가 불확실하다.
        </p>
        <p className="leading-7">
          블록체인 노드에서는 읽기가 쓰기보다 압도적으로 많다.<br />
          EVM 실행 시 SLOAD(상태 읽기)가 핵심 병목이므로 읽기 지연의 예측성이 중요하다.<br />
          이것이 Reth와 Erigon이 LSM(LevelDB/RocksDB) 대신 B+tree(MDBX)를 선택한 이유다.
        </p>
      </div>
      <div className="not-prose"><LsmVsBtreeViz /></div>
    </section>
  );
}
