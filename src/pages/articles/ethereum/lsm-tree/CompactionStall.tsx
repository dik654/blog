import CompactionStallViz from './viz/CompactionStallViz';

export default function CompactionStall() {
  return (
    <section id="compaction-stall" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Compaction 간섭 문제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Compaction은 백그라운드에서 조용히 돌아야 하지만, 현실은 그렇지 않다.<br />
          대량의 디스크 I/O를 발생시켜 읽기/쓰기 성능에 직접적인 간섭을 일으킨다.
        </p>
        <p className="leading-7">
          첫 번째 문제는 디스크 대역폭 경쟁이다.<br />
          Compaction이 순차 I/O를 대량 발생시키면, 일반 읽기/쓰기의 대역폭이 줄어든다.<br />
          결과적으로 p99 지연(latency)에 스파이크가 나타난다.
        </p>
        <p className="leading-7">
          두 번째 문제는 L0 파일 누적이다.<br />
          L0→L1 compaction이 밀리면 L0 파일이 계속 쌓이고, 읽기 성능이 급격히 악화된다.
        </p>
        <p className="leading-7">
          세 번째 문제는 Write Stall이다.<br />
          L0 파일 수가 한도(RocksDB 기본값 12개)를 초과하면 쓰기를 일시 중단한다.<br />
          블록체인 노드에서는 12초마다 블록을 실행해야 하므로 이런 스파이크는 치명적이다.
        </p>
      </div>
      <div className="not-prose"><CompactionStallViz /></div>
    </section>
  );
}
