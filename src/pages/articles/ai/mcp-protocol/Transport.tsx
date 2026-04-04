import TransportViz from './viz/TransportViz';

export default function Transport() {
  return (
    <section id="transport" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">전송 계층: stdio · SSE · Streamable HTTP</h2>
      <div className="not-prose mb-8"><TransportViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MCP는 JSON-RPC 2.0 기반 — 전송 방식만 바꾸면 로컬↔원격 모두 대응<br />
          stdio(로컬), HTTP SSE(원격 스트리밍), Streamable HTTP(클라우드 최적화) 3가지 선택지
        </p>
      </div>
    </section>
  );
}
