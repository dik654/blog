import InsertSplitViz from './viz/InsertSplitViz';

export default function InsertSplit() {
  return (
    <section id="insert-split" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">삽입과 노드 분할</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          삽입은 먼저 적절한 leaf를 찾아 키-값을 추가한다.<br />
          leaf가 가득 차면 분할(split)이 발생한다.<br />
          중간 키를 부모로 올리고 leaf를 반으로 나누는 과정이다.<br />
          부모도 가득 차면 재귀적으로 분할이 전파되며, root 분할 시 높이가 1 증가한다.
        </p>
      </div>
      <div className="not-prose"><InsertSplitViz /></div>
    </section>
  );
}
