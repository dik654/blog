import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ApplyBlock 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BlockExecutor.ApplyBlock()은 합의 결과를 실제 상태 전이에 반영하는 유일한 진입점입니다.<br />
          이 아티클에서는 ValidateBlock → FinalizeBlock → Commit → SaveState 전체 호출 체인을 추적합니다.
        </p>
      </div>
    </section>
  );
}
