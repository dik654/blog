import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장군 문제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lamport(1982) — 일부 노드가 악의적일 때 정직 노드가 합의에 도달하는 조건.
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}
