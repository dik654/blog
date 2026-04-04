import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 엔진 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT 합의의 핵심은 receiveRoutine 하나의 goroutine입니다.<br />
          이 아티클에서는 for-select 루프부터 enterCommit까지 전체 코드를 추적합니다.
        </p>
      </div>
    </section>
  );
}
