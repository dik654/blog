import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 전력/냉각이 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 GPU별 TDP, 블로워/오픈에어 냉각 차이,<br />
          랙마운트 설계와 전력 분배 구조를 정리합니다.
        </p>
      </div>
    </section>
  );
}
