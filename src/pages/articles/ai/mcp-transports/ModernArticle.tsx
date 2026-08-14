import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import McpLearningFlowViz from "../mcp-learning/viz/McpLearningFlowViz";

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">Message와 운반 경로를 분리합니다</p><h2 className="text-3xl font-bold tracking-tight">MCP transport는 같은 protocol message를 local process 또는 remote service까지 옮기는 방법입니다</h2></header>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8"><Link to="/ai/mcp-protocol">MCP core</Link>에서 만든 JSON-RPC request가 실제 byte로 이동하려면 transport가 필요합니다. <strong>stdio</strong>와 <strong>Streamable HTTP</strong>는 같은 primitive 의미를 운반하지만, process 수명·identity·관측·실패 경계는 다릅니다.</p><p className="leading-8">먼저 local pipe 하나를 보고, 다음에 remote endpoint를 봅니다. 마지막에 response stream·cancel·subscription을 수명 기준으로 조합합니다.</p></div>
        <McpLearningFlowViz mode="transport" />
        <ContentBoundary article="mcp-transports" />
      </section>

      <section id="stdio" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>stdio는 host가 시작한 child process와 두 pipe로 대화합니다</h2><p className="leading-8">Host가 command를 실행하고 child의 stdin으로 request를 쓰며 stdout에서 response를 읽습니다. Protocol byte와 diagnostic text가 섞이면 framing이 깨지므로 log는 stderr로 보냅니다. Child가 local이라는 사실은 낮은 latency를 설명할 수 있지만 안전한 sandbox를 의미하지는 않습니다.</p></div>
        <TermBreakdown title="Local stdio 연결의 형태" items={[
          { term: "Child process", description: "Host가 시작하고 종료를 관찰하는 server process입니다.", example: "IDE가 formatter MCP server를 workspace마다 시작합니다.", boundary: "같은 machine에 있어도 filesystem·network 권한을 제한해야 합니다." },
          { term: "stdin", description: "Host client가 server에 protocol message를 쓰는 입력 pipe입니다.", example: "tools/call JSON-RPC message를 frame 단위로 씁니다.", boundary: "Shell command 문자열이나 secret을 무심코 합치지 않습니다." },
          { term: "stdout", description: "Server가 protocol response를 쓰는 출력 pipe입니다.", example: "동일 request id의 result 또는 error를 반환합니다.", boundary: "Debug log를 stdout에 쓰면 parser가 protocol message로 오해할 수 있습니다." },
          { term: "stderr", description: "사람과 운영 system을 위한 diagnostic stream입니다.", example: "Crash reason과 stack trace를 request identity와 함께 남깁니다.", boundary: "Credential·PII·전체 payload는 기본 log에 남기지 않습니다." },
        ]} />
      </section>

      <section id="streamable-http" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Streamable HTTP는 요청마다 POST하고 JSON 또는 그 요청 범위의 SSE를 받습니다</h2><p className="leading-8">Remote endpoint에서는 TLS·OAuth·Origin·tenant isolation과 gateway 정책이 추가됩니다. <code>MCP-Protocol-Version</code>, <code>Mcp-Method</code>, named operation의 <code>Mcp-Name</code>은 body를 전부 읽기 전에 route를 고르게 돕습니다. Server는 header와 JSON-RPC body가 같은 method·name을 말하는지 다시 검사합니다.</p></div>
        <TermBreakdown title="HTTP request에서 따로 확인할 네 층" items={[
          { term: "Connection", description: "TLS endpoint와 Origin이 예상한 배포 경계인지 확인합니다.", boundary: "암호화된 연결만으로 caller 권한이 증명되지는 않습니다." },
          { term: "Authorization", description: "Token issuer·audience·scope와 resource ACL을 확인합니다.", boundary: "Tool description이나 serverInfo는 credential이 아닙니다." },
          { term: "Routing headers", description: "Gateway가 method와 named operation에 맞는 policy로 보냅니다.", example: "Mcp-Method=tools/call, Mcp-Name=search를 route key로 씁니다.", boundary: "Header와 body가 다르면 HeaderMismatch로 거부합니다." },
          { term: "Body", description: "JSON-RPC id·method·params와 request metadata를 schema에 맞게 해석합니다.", boundary: "Header 검사가 body schema validation을 대신하지 않습니다." },
        ]} />
      </section>

      <section id="lifetimes" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Response·cancel·subscription은 연결이 아니라 논리 수명으로 나눕니다</h2><p className="leading-8">Request-scoped SSE는 한 request의 여러 response event를 운반합니다. 그 stream을 닫아 cancellation 의사를 알릴 수 있지만, 이미 외부 system에 생긴 effect까지 되돌리지는 않습니다. Resource update를 계속 받는 subscription은 별도 장기 channel이며 request response와 같은 수명으로 묶지 않습니다.</p></div>
        <ExplainedFormula
          question="Remote call의 전체 deadline을 어느 단계가 소비했는지 어떻게 보존하는가?"
          idea={<>DNS/TLS·authorization·server work·stream delivery를 순서대로 합칩니다. 합계만 남기지 않고 각 항을 trace에 보존해야 timeout 원인을 구분할 수 있습니다.</>}
          formula={String.raw`T_{end}=T_{connect}+T_{auth}+T_{work}+T_{stream}`}
          annotatedFormula={String.raw`\begin{aligned}T_0&=\underbrace{T_{connect}}_{\text{endpoint 연결}}\\[3pt]T_1&=T_0+\underbrace{T_{auth}}_{\text{권한 검사}}\\[3pt]T_2&=T_1+\underbrace{T_{work}}_{\text{domain 작업}}\\[3pt]T_{end}&=T_2+\underbrace{T_{stream}}_{\text{결과 전달}}\end{aligned}`}
          operations={[
            { expression: String.raw`T_{connect}+T_{auth}`, annotation: ["업무 실행 전에 필요한", "network·trust 준비 시간을 누적"] },
            { expression: String.raw`T_{work}+T_{stream}`, annotation: ["실제 업무 시간과", "결과를 전달하는 시간을 분리해 누적"] },
          ]}
          terms={[
            { symbol: "T_{connect}", name: "연결 시간", description: "DNS·TCP·TLS가 끝날 때까지의 시간입니다." },
            { symbol: "T_{auth}", name: "권한 검사 시간", description: "Issuer·audience·scope와 policy를 확인하는 시간입니다." },
            { symbol: "T_{work}", name: "Server 작업 시간", description: "Domain operation이 terminal state에 도달하는 시간입니다." },
            { symbol: "T_{stream}", name: "응답 전달 시간", description: "JSON 또는 request-scoped SSE의 마지막 event가 도착하는 시간입니다." },
          ]}
          assumptions={["네 단계가 critical path에서 순차로 측정됩니다.", "Retry는 새 attempt로 기록하고 전체 deadline 안에 포함합니다.", "Cancel 신호와 effect rollback은 별도 contract입니다."]}
          interpretation="어느 항이 deadline을 소진했는지 알아야 연결 재시도·권한 cache·server 최적화·stream backpressure 중 맞는 대응을 고를 수 있습니다."
        />
        <div id="paper-mcp-transports" className="scroll-mt-20"><CitationBlock source="MCP 2026-07-28 · Transports" citeKey={1} href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports"><p><strong>문제:</strong> MCP message를 local process와 remote HTTP에서 일관되게 운반해야 합니다.</p><p><strong>핵심 기여:</strong> stdio와 Streamable HTTP의 wire·lifecycle·security requirement를 규정합니다.</p><p><strong>전제:</strong> Client와 server가 같은 protocol revision과 transport profile을 사용합니다.</p><p><strong>근거 범위:</strong> 표준 transport behavior에 한정합니다.</p><p><strong>비주장:</strong> 특정 runtime의 framing이나 운영 안전성을 자동 인증하지 않습니다.</p></CitationBlock></div>
        <div id="paper-mcp-http" className="scroll-mt-20"><CitationBlock source="MCP 2026-07-28 · Streamable HTTP" citeKey={2} href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http"><p><strong>문제:</strong> Stateless HTTP infrastructure에서 routing·streaming·cancel·subscription을 구분해야 합니다.</p><p><strong>핵심 기여:</strong> POST request, JSON/request-scoped SSE, routing header와 consistency check를 정의합니다.</p><p><strong>전제:</strong> Gateway와 intermediary가 header를 보존·검증하도록 구성됩니다.</p><p><strong>근거 범위:</strong> Streamable HTTP wire semantics입니다.</p><p><strong>비주장:</strong> SSE가 durable queue이거나 connection close가 transaction rollback이라는 뜻은 아닙니다.</p></CitationBlock></div>
      </section>
    </article>
  );
}
