import { CitationBlock } from "@/components/ui/citation";
import TransportViz from "./viz/TransportViz";
import TransportDetailViz from "./viz/TransportDetailViz";

export default function Transport() {
  return (
    <section id="transport" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        stdio와 Streamable HTTP는 같은 protocol을 다른 배포 경계에서 운반한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>stdio</strong>는 host가 시작한 local subprocess와 stdin/stdout으로
          JSON-RPC message를 교환합니다. Process 수명과 OS identity가 분명해 local
          developer tool에 단순하지만, stdout에는 protocol message만 써야 하고
          diagnostic log는 stderr로 분리해야 합니다. <strong>Streamable HTTP</strong>
          는 remote MCP endpoint에 요청마다 POST하고 JSON 또는 그 요청 범위의 SSE
          stream으로 응답받습니다. 공유 service에서는 TLS, OAuth, rate limit,
          Origin 검증과 tenant isolation을 함께 운영할 수 있습니다.
        </p>
        <p>
          여기서 SSE라는 단어만 보고 과거의 HTTP+SSE transport와 혼동하면 안 됩니다. 현행 Streamable HTTP는 POST-only request와 request-
          scoped SSE를 사용합니다. 별도 GET session과 resumable SSE를 전제로 한 legacy HTTP+SSE는 deprecated입니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <TransportViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>HTTP header는 gateway routing을 돕고 body와 반드시 일치해야 한다</h3>
        <p>
          Streamable HTTP request에는 <code>MCP-Protocol-Version</code>,
          <code>Mcp-Method</code>, 그리고 named operation이면 <code>Mcp-Name</code>
          header가 필요합니다. Gateway는 body 전체를 읽기 전에 이 값을 이용해
          route·authorization·rate-limit policy를 고를 수 있습니다. 대신 server는
          header와 JSON-RPC body의 method·name이 일치하는지 검사하고 다르면
          <code>HeaderMismatch</code>로 거부해야 합니다. Header는 빠른 routing용
          index이지 authentication이나 schema validation의 대체물이 아닙니다.
        </p>
        <h3>추가 입력·취소·구독은 서로 다른 수명을 가진다</h3>
        <p>
          Tool이 실행 도중 사용자에게 정보를 더 받아야 한다면 실패로 끝내는 대신
          <code>resultType: "input_required"</code>, <code>inputRequests</code>, 선택적
          <code>requestState</code>를 반환합니다. Host가 사용자에게 form을 보여 주고
          답을 받은 뒤, 새 JSON-RPC id와 <code>inputResponses</code>를 포함해 같은
          논리 작업을 다시 호출합니다. 이를 multi round-trip request(MRTR)라고
          하며, server는 재호출이 이미 끝난 side effect를 반복하지 않도록 checkpoint
          또는 operation identity를 유지해야 합니다.
        </p>
        <p>
          Cancellation은 진행 중인 한 요청을 멈추는 신호이고 subscription은 앞으로
          생길 여러 event를 받는 장기 channel입니다. HTTP에서는 request-scoped SSE
          stream을 닫아 cancellation을 알릴 수 있으며, 목록·resource 변경 event는
          별도의 <code>subscriptions/listen</code> stream으로 받습니다. Connection을
          닫았다고 이미 외부 시스템에 반영된 변경이 rollback되는 것은 아니므로
          cleanup과 effect 확인은 application contract에 남겨야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <TransportDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-mcp-streamable-http" className="not-prose scroll-mt-24">
          <CitationBlock
            source="MCP 2026-07-28 — Streamable HTTP"
            citeKey={4}
            href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http"
          >
            현행 transport 문서는 POST-only endpoint, JSON 또는 request-scoped SSE,
            required routing headers와 body consistency, Origin validation,
            cancellation과 subscriptions/listen을 규정합니다. 이 transport가 durable
            queue나 distributed transaction을 제공한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
