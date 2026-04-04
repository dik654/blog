import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 폼팩터가 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 NVMe 스토리지의 세 가지 폼팩터(M.2, U.2, E1.S)를 비교하고,<br />
          서버 환경과 블록체인 워크로드에서의 선택 기준을 정리합니다.
        </p>
      </div>
    </section>
  );
}
