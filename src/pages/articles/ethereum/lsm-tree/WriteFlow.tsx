import WriteFlowViz from './viz/WriteFlowViz';

export default function WriteFlow() {
  return (
    <section id="write-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">쓰기 경로: Memtable에서 SSTable까지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          LSM-tree의 쓰기는 4단계 파이프라인을 거친다.<br />
          모든 쓰기가 먼저 메모리에서 처리되므로 디스크 I/O 없이 빠르게 완료된다.
        </p>
        <p className="leading-7">
          WAL(Write-Ahead Log)은 crash recovery를 위한 안전장치다.<br />
          프로세스가 죽어도 WAL을 replay하면 Memtable을 복구할 수 있다.
        </p>
        <p className="leading-7">
          Memtable은 보통 Skip List 또는 Red-Black tree로 구현한다.<br />
          삽입 시 O(log n) 연산으로 정렬 상태를 유지하므로, flush 시 이미 정렬되어 있다.
        </p>
        <p className="leading-7">
          SSTable(Sorted String Table)은 정렬된 key-value 쌍을 담은 불변 파일이다.<br />
          데이터 블록, 블룸 필터(Bloom Filter), 인덱스 블록의 세 부분으로 구성된다.
        </p>
      </div>
      <div className="not-prose"><WriteFlowViz /></div>
    </section>
  );
}
