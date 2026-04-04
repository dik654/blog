import ContextViz from './viz/ContextViz';
import SMRModelViz from './viz/SMRModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 머신 복제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인은 SMR의 구현체 — 트랜잭션=명령, 블록=배치, 합의=순서 결정.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><SMRModelViz /></div>
    </section>
  );
}
