import WhyDatabaseViz from './viz/WhyDatabaseViz';

export default function WhyDatabase() {
  return (
    <section id="why-database" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터베이스에서 B+tree를 쓰는 이유</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          B+tree는 디스크 I/O에 최적화된 자료구조다.<br />
          한 노드가 한 페이지(4KB)에 맞아 fan-out이 높고 높이가 낮다.<br />
          leaf 연결 리스트 덕분에 범위 쿼리가 O(k)로 빠르다.<br />
          MDBX, InnoDB, PostgreSQL, 파일시스템(APFS, ext4) 등 대부분의 저장 엔진이 사용한다.
        </p>
      </div>
      <div className="not-prose"><WhyDatabaseViz /></div>
    </section>
  );
}
