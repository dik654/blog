import CompactionViz from './viz/CompactionViz';

export default function Compaction() {
  return (
    <section id="compaction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Compaction과 Write Amplification</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          SSTable 파일이 쌓이면 읽기 성능이 저하된다.<br />
          Compaction은 여러 SSTable을 병합 정리하여 파일 수를 줄이는 백그라운드 작업이다.
        </p>
        <p className="leading-7">
          LevelDB와 RocksDB는 Leveled Compaction 방식을 사용한다.<br />
          L(n)의 SSTable을 L(n+1)의 겹치는 범위 파일들과 머지 소트(merge sort)하여 새 파일을 만든다.
        </p>
        <p className="leading-7">
          L0→L1 compaction은 가장 까다롭다.<br />
          L0 파일들의 키 범위가 겹치므로, L1의 여러 파일과 동시에 합쳐야 한다.<br />
          L1→L2는 L1 크기가 한도(예: 10MB)를 초과할 때, 선택된 SSTable을 L2와 머지한다.
        </p>
        <p className="leading-7">
          Write Amplification은 이 과정의 대가다.<br />
          데이터가 레벨을 옮길 때마다 다시 쓰여지므로, 원본 1바이트가 실제로는 10~30바이트의 디스크 쓰기를 유발한다.
        </p>
      </div>
      <div className="not-prose"><CompactionViz /></div>
    </section>
  );
}
