import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜별 특성</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 SATA, NVMe, SAS 스토리지 프로토콜의 핵심 차이를 비교하고,<br />
          엔터프라이즈 SSD의 내구성 지표와 블록체인 노드 선택 기준을 정리합니다.
        </p>
      </div>
    </section>
  );
}
