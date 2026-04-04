import MVCCViz from './viz/MVCCViz';

export default function MVCC() {
  return (
    <section id="mvcc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MVCC 동시성 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          MVCC(Multi-Version Concurrency Control)는
          같은 데이터의 여러 버전을 동시에 유지하는 동시성 제어 기법입니다.<br />
          읽기 트랜잭션은 시작 시점의 스냅샷을 보므로, 쓰기와 충돌하지 않습니다
        </p>
        <p className="leading-7">
          MDBX는 쓰기 트랜잭션을 동시에 1개만 허용합니다(Single Writer).<br />
          WAL(Write-Ahead Log) 없이 단일 쓰기 직렬화로 일관성을 보장하며,
          GC(Garbage Collection)가 오래된 페이지를 freelist로 반환합니다
        </p>
      </div>
      <div className="not-prose">
        <MVCCViz />
      </div>
    </section>
  );
}
