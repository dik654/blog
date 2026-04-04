import CompareViz from './viz/CompareViz';

export default function MdbxVsAlternatives() {
  return (
    <section id="vs-alternatives" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MDBX vs 대안 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          LMDB 대비 MDBX는 DB 크기 자동 조절(geometry),
          LIFO 페이지 회수, 안전한 reader 등록을 추가했습니다.<br />
          실무에서 발견된 안정성 문제들을 체계적으로 수정한 것이 핵심 차별점입니다
        </p>
        <p className="leading-7">
          RocksDB와 LevelDB는 LSM-tree 기반으로 쓰기에 강하지만,
          compaction이 읽기 지연을 불안정하게 만듭니다.<br />
          블록체인 노드처럼 읽기 비중이 높은 워크로드에서는
          B+tree 기반 MDBX가 더 적합합니다
        </p>
      </div>
      <div className="not-prose">
        <CompareViz />
      </div>
    </section>
  );
}
