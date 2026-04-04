import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 메모리 선택이 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 DDR4/DDR5 대역폭 차이, ECC의 필요성,<br />
          RDIMM/LRDIMM으로 대용량 구성하는 방법을 정리합니다.
        </p>
      </div>
    </section>
  );
}
