import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSM-tree가 뭔가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          디스크에 데이터를 기록할 때, 랜덤 위치에 쓰는 것과 순차적으로 쓰는 것은 성능 차이가 100배 이상 난다.<br />
          HDD는 헤드 탐색(seek)에 ~10ms가 걸리고, SSD도 랜덤 쓰기 시 write amplification이 발생한다.
        </p>
        <p className="leading-7">
          LSM-tree(Log-Structured Merge-tree)의 핵심 아이디어는 단순하다.<br />
          쓰기를 메모리에 모았다가, 가득 차면 정렬된 파일로 디스크에 순차 기록한다.<br />
          즉, 랜덤 쓰기를 순차 쓰기로 변환하는 자료구조다.
        </p>
        <p className="leading-7">
          LSM = Log-Structured Merge tree.<br />
          메모리 버퍼(Memtable)와 디스크 레벨(SSTable)의 두 계층으로 구성된다.<br />
          LevelDB(Google), RocksDB(Facebook), Cassandra, HBase 등이 대표적인 구현체다.
        </p>
        <p className="leading-7">
          Geth(이더리움 Go 클라이언트)가 LevelDB를 사용하는 이유는 쓰기 처리량이 높고 Go 바인딩이 존재하기 때문이다.<br />
          하지만 LSM-tree에는 읽기 성능이라는 근본적 약점이 있다.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}
