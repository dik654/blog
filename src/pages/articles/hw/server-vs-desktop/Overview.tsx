import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 부품이 다른가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 서버와 데스크톱의 CPU, 메인보드, 안정성 차이를 비교하고,<br />
          블록체인 인프라(Filecoin 마이닝 등)에서 서버 부품이 필수인 이유를 정리합니다.
        </p>
      </div>
    </section>
  );
}
