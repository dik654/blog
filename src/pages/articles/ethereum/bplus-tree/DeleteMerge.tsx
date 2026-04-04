import DeleteMergeViz from './viz/DeleteMergeViz';

export default function DeleteMerge() {
  return (
    <section id="delete-merge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">삭제와 병합/재분배</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          삭제는 leaf에서 키를 제거하는 것으로 시작한다.<br />
          키 개수가 최소 기준 미만이 되면 언더플로우가 발생한다.<br />
          형제에 여유가 있으면 재분배(redistribution)로 키를 빌려온다.<br />
          형제도 최소면 두 노드를 병합(merge)하고, 부모 키를 제거하여 재귀 전파한다.
        </p>
      </div>
      <div className="not-prose"><DeleteMergeViz /></div>
    </section>
  );
}
