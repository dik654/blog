import ImplementationViz from './viz/ImplementationViz';
import ImplementationDetailViz from './viz/ImplementationDetailViz';

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MCP 서버 구현 예시</h2>
      <div className="not-prose mb-8"><ImplementationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TypeScript SDK 기준 — 서버 초기화 → 도구 등록 → 핸들링 → 리소스 등록 4단계<br />
          각 도구는 이름 + JSON Schema 파라미터 + async 핸들러로 구성 — LLM이 스키마를 읽고 자동 호출
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">MCP Server Implementation</h3>
        <div className="not-prose mb-6"><ImplementationDetailViz /></div>
        <p className="leading-7">
          Implementation: <strong>Server create + handlers (list/call tools, resources) + transport</strong>.<br />
          TypeScript + Python SDKs 공식 지원.<br />
          Claude Desktop에 config로 등록 → 즉시 사용.
        </p>
      </div>
    </section>
  );
}
