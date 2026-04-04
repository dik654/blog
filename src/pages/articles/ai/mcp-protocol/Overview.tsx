import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MCP가 왜 필요한가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM과 외부 도구를 연결할 때 — 각 조합마다 별도 통합 코드를 작성하면 N×M 폭발<br />
          MCP는 이 문제를 N+M으로 축소하는 표준 프로토콜 — LLM 세계의 USB
        </p>
      </div>
    </section>
  );
}
