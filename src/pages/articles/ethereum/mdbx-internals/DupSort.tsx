import DupSortViz from './viz/DupSortViz';

export default function DupSort() {
  return (
    <section id="dupsort" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DupSort와 멀티밸류</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          일반 B+tree는 하나의 key에 하나의 value만 저장합니다.<br />
          MDBX의 DupSort 모드는 하나의 key에 여러 value를 정렬된 상태로 저장할 수 있습니다
        </p>
        <p className="leading-7">
          블록체인에서는 하나의 주소(Address)에 여러 StorageSlot이 매핑됩니다.<br />
          DupSort를 사용하면 leaf 노드 안에 sub-B+tree를 만들어
          value별 O(log m) 검색과 범위 순회가 가능합니다
        </p>
      </div>
      <div className="not-prose">
        <DupSortViz />
      </div>
    </section>
  );
}
