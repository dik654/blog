import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 GPU를 비교해야 하는가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 컨슈머(RTX 4090/5090)와 데이터센터(A100/H100) GPU를 비교하고,<br />
          블록체인 워크로드별 최적 선택 기준을 정리합니다.
        </p>
      </div>
    </section>
  );
}
