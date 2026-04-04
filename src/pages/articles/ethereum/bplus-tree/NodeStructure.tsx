import NodeStructureViz from './viz/NodeStructureViz';

export default function NodeStructure() {
  return (
    <section id="node-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">노드 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          B+tree의 노드는 두 종류로 나뉜다.<br />
          Internal node는 키와 자식 포인터만 저장하여 경로 안내 역할을 한다.<br />
          Leaf node는 실제 데이터를 담고, 다음 리프로의 포인터로 서로 연결된다.<br />
          차수(order) m이 100이면 높이 3만으로 100만 개 키를 저장할 수 있다.
        </p>
      </div>
      <div className="not-prose"><NodeStructureViz /></div>
    </section>
  );
}
