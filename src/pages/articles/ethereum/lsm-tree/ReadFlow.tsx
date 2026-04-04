import ReadFlowViz from './viz/ReadFlowViz';

export default function ReadFlow() {
  return (
    <section id="read-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">읽기 경로와 Read Amplification</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          LSM-tree의 읽기는 가장 최근 데이터가 있는 곳부터 순서대로 검색한다.<br />
          Memtable → Immutable Memtable → L0 SSTables → L1 → L2 → ... 순서다.
        </p>
        <p className="leading-7">
          L0의 문제가 핵심이다.<br />
          L0 SSTables는 Memtable이 flush된 순서대로 쌓이므로, 키 범위가 서로 겹칠 수 있다.<br />
          최악의 경우 L0의 모든 파일을 검색해야 한다.
        </p>
        <p className="leading-7">
          블룸 필터(Bloom Filter)는 이 문제를 완화한다.<br />
          각 SSTable에 블룸 필터가 있어, 해당 키가 확실히 없는 파일은 건너뛸 수 있다.<br />
          false positive만 실제로 디스크를 읽으므로 I/O를 대폭 줄인다.
        </p>
        <p className="leading-7">
          그래도 존재하지 않는 키를 조회하면 모든 레벨을 다 뒤져야 한다.<br />
          이것이 Read Amplification — 하나의 읽기가 여러 번의 디스크 I/O를 유발하는 현상이다.
        </p>
      </div>
      <div className="not-prose"><ReadFlowViz /></div>
    </section>
  );
}
