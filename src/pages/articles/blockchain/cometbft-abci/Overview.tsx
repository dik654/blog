import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI 인터페이스 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI(Application BlockChain Interface)는 합의 엔진과 앱 로직을 분리하는 경계입니다.<br />
          이 아티클에서는 4개 연결, Application 인터페이스, localClient의 코드를 추적합니다.
        </p>
      </div>
    </section>
  );
}
