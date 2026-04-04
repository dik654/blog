import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CCA 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ARM CCA(Confidential Compute Architecture)는 TrustZone의 2분법을 넘어섭니다.<br />
          Realm이라는 새로운 보안 세계를 추가하여 VM별 독립 격리를 제공합니다.<br />
          하이퍼바이저도 Realm 메모리에 접근할 수 없습니다.
        </p>
      </div>
    </section>
  );
}
