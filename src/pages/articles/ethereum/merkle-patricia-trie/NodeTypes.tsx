import NodeTypesViz from './viz/NodeTypesViz';

export default function NodeTypes() {
  return (
    <section id="node-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">노드 유형: Branch, Extension, Leaf</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          MPT는 세 종류의 노드로 구성. 각 노드의 RLP 인코딩 결과를 Keccak-256으로 해시하여 부모가 참조
        </p>
      </div>
      <div className="not-prose"><NodeTypesViz /></div>
    </section>
  );
}
