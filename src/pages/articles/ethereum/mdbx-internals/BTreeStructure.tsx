import BTreeViz from './viz/BTreeViz';

export default function BTreeStructure() {
  return (
    <section id="btree-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">B+tree 페이지 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          MDBX는 OS의 가상 메모리 페이지(보통 4KB)를 저장 단위로 사용합니다.<br />
          모든 데이터가 페이지 안에 들어가므로 디스크 I/O가 페이지 단위로 정렬됩니다
        </p>
        <p className="leading-7">
          Internal 노드는 key와 자식 페이지 번호(pgno) 쌍을 보관합니다.<br />
          Leaf 노드에 실제 key-value 데이터가 저장되며,
          값이 4KB를 초과하면 별도 Overflow 페이지를 사용합니다
        </p>
      </div>
      <div className="not-prose">
        <BTreeViz />
      </div>
    </section>
  );
}
