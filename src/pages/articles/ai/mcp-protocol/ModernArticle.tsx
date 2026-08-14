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
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">먼저 MCP가 해결하는 한 문제만 봅니다</p>
          <h2 className="text-3xl font-bold tracking-tight">MCP는 model에 권한을 주는 장치가 아니라, AI host와 외부 기능이 대화하는 공통 규약입니다</h2>
        </header>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">AI 애플리케이션이 파일·issue tracker·database를 쓰려면 기능을 찾고, 인자를 보내고, 결과를 되돌려 받아야 합니다. 서비스마다 서로 다른 adapter를 만들면 host와 service 조합이 늘 때 연결 코드도 빠르게 늘어납니다.</p>
          <p className="leading-8"><strong>Model Context Protocol(MCP)</strong>은 이 연결에서 반복되는 message 형태를 맞춥니다. 기능의 업무 의미, 실제 권한, 사용자 승인과 sandbox까지 대신 결정하지는 않습니다. 먼저 “통신 규약”과 “보안 정책”을 분리해 두어야 뒤의 개념이 섞이지 않습니다.</p>
        </div>
        <McpLearningFlowViz mode="core" />
        <ContentBoundary article="mcp-protocol" />
      </section>

      <section id="roles" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Host·client·server를 한 문장에 넣지 않고 하나씩 봅니다</h2>
          <p className="leading-8">이 셋은 process 이름이 아니라 책임 이름입니다. Local/remote 여부는 그 다음에 붙는 배포 선택입니다.</p>
        </div>
        <TermBreakdown
          title="MCP 연결을 이루는 세 역할"
          items={[
            { term: "Host", description: "사용자가 실제로 쓰는 AI application입니다. Model, 대화 state, 연결 목록, 승인 UI와 credential 사용 정책을 소유합니다.", example: "Desktop assistant가 어떤 tool을 model에게 보여 줄지 고릅니다.", boundary: "Host가 tool을 보여 줬다는 사실만으로 server 실행 권한이 생기지는 않습니다." },
            { term: "Client", description: "Host 안에서 보통 한 server와 MCP message를 교환하는 protocol component입니다.", example: "Filesystem server용 client와 issue server용 client를 별도로 둡니다.", boundary: "Client를 독립 사용자나 별도 보안 주체로 오해하지 않습니다." },
            { term: "Server", description: "Filesystem·ticket·database처럼 좁은 domain capability를 실제로 제공합니다.", example: "Issue server가 search_issue와 create_issue를 노출합니다.", boundary: "별도 process라는 사실만으로 sandbox가 생기지 않습니다." },
          ]}
        />
        <ExplainedFormula
          question="Host H개와 service S개를 모두 전용 adapter로 연결할 때와 공통 protocol을 쓸 때 연결 종류는 어떻게 달라지는가?"
          idea={<>전용 방식은 모든 host·service 쌍마다 새 연결을 만들지만, 공통 protocol은 각 host와 service가 한 번씩 protocol 경계에 맞춥니다. 이는 구현량의 직관이지 보안 비용이 사라진다는 보장은 아닙니다.</>}
          formula={String.raw`C_{pair}=HS,\qquad C_{protocol}=H+S`}
          annotatedFormula={String.raw`\begin{aligned}C_{pair}&=\underbrace{H\times S}_{\text{전용 연결 쌍}}\\[3pt]C_{protocol}&=\underbrace{H}_{\text{host 연결}}+\underbrace{S}_{\text{service 연결}}\end{aligned}`}
          operations={[
            { expression: String.raw`H\times S`, annotation: ["각 host가 모든 service와 직접 연결되어", "가능한 쌍의 수를 계산"] },
            { expression: String.raw`H+S`, annotation: ["양쪽이 공통 protocol에 한 번씩 맞춰", "구현 경계 수를 더함"] },
          ]}
          terms={[
            { symbol: "H", name: "Host 수", description: "외부 기능을 사용하는 AI application의 수입니다." },
            { symbol: "S", name: "Service 수", description: "연결하려는 filesystem·database·SaaS 등의 수입니다." },
            { symbol: "C", name: "연결 종류", description: "유지해야 할 adapter 또는 protocol integration 종류의 단순화한 수입니다." },
          ]}
          assumptions={["모든 host가 모든 service를 사용한다고 단순화합니다.", "각 integration의 난이도와 보안 정책 비용은 같다고 가정하지 않습니다.", "MCP 호환이 domain correctness를 보장하지 않습니다."]}
          interpretation="MCP가 줄이는 것은 반복되는 wire integration입니다. Authorization·quality·sandbox는 H+S 식 밖에서 여전히 각각 검증해야 합니다."
        />
      </section>

      <section id="request-envelope" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Stateless는 “기억이 없다”가 아니라 “숨은 session에 기대지 않는다”는 뜻입니다</h2>
          <p className="leading-8">2026-07-28 core에서는 이전의 initialize session 대신 요청이 자신을 설명합니다. 요청마다 protocol version·client information·capability를 함께 보내므로, 다른 worker가 받아도 이전 connection memory 없이 해석할 수 있습니다.</p>
        </div>
        <TermBreakdown
          title="Self-describing request의 형태"
          items={[
            { term: "Protocol version", description: "이 request를 어떤 규칙으로 해석할지 고정합니다.", example: "2026-07-28을 지원하지 않으면 명시적으로 mismatch를 반환합니다.", boundary: "Version 문자열은 caller identity가 아닙니다." },
            { term: "Client information", description: "Host/client 구현 이름과 revision을 진단·호환성 판단에 전달합니다.", example: "example-host 1.4.0을 trace에 남깁니다.", boundary: "Self-reported metadata이므로 authentication을 대신하지 않습니다." },
            { term: "Capabilities", description: "이 요청에서 client가 이해하는 선택 기능을 알립니다.", example: "지원하지 않는 extension은 협상 결과에서 제외합니다.", boundary: "광고한 기능이 올바르게 구현됐다는 증명은 아닙니다." },
            { term: "Explicit handle", description: "호출 사이에 이어야 할 application state를 인자로 전달하는 opaque 식별자입니다.", example: "20분 export job의 jobHandle을 status/cancel 요청에 다시 넣습니다.", boundary: "Handle 보유만으로 권한이 생기지 않으며 caller·scope·expiry를 매번 확인합니다." },
          ]}
        />
      </section>

      <section id="next-map" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>이제 protocol 위에 무엇을 싣는지 순서대로 확장합니다</h2>
          <p className="leading-8"><Link to="/ai/mcp-primitives">MCP primitives</Link>에서는 Tool·Resource·Prompt를 하나씩 정의합니다. <Link to="/ai/mcp-transports">MCP transports</Link>에서는 그 message가 local pipe와 remote HTTP를 지나는 모습을 봅니다. <Link to="/ai/mcp-server-operations">MCP server 운영</Link>에서는 authorization·retry·receipt를 조합합니다.</p>
        </div>
        <div id="paper-mcp-2026-spec" className="scroll-mt-20"><CitationBlock source="Model Context Protocol · 2026-07-28 specification" citeKey={1} href="https://modelcontextprotocol.io/specification/2026-07-28">
          <p><strong>문제:</strong> AI host와 외부 기능이 구현체에 종속되지 않는 message contract로 상호 운용해야 합니다.</p><p><strong>핵심 기여:</strong> Stateless request core와 host·client·server architecture를 규정합니다.</p><p><strong>전제:</strong> Client와 server가 2026-07-28 revision을 명시적으로 지원합니다.</p><p><strong>근거 범위:</strong> Protocol 역할·message 의미와 normative requirement에 한정합니다.</p><p><strong>비주장:</strong> 특정 server의 안전성·정확성·성능을 인증하지 않습니다.</p>
        </CitationBlock></div>
        <div id="paper-mcp-2026-release" className="scroll-mt-20"><CitationBlock source="MCP · 2026-07-28 release notes" citeKey={2} href="https://blog.modelcontextprotocol.io/posts/2026-07-28/">
          <p><strong>문제:</strong> Session 중심의 이전 설명에서 stateless core로 바뀐 이유와 migration 범위를 알려야 합니다.</p><p><strong>핵심 기여:</strong> Handshake 제거, self-describing request, discovery와 extension 변화를 요약합니다.</p><p><strong>전제:</strong> Release note와 최종 specification revision을 함께 확인합니다.</p><p><strong>근거 범위:</strong> 해당 release의 변경 의도와 공개된 생태계 지원 범위입니다.</p><p><strong>비주장:</strong> 모든 SDK·server가 같은 날 자동으로 새 revision을 사용한다는 뜻은 아닙니다.</p>
        </CitationBlock></div>
      </section>
    </article>
  );
}
