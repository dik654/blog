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
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">기능 하나의 control 방식부터 봅니다</p><h2 className="text-3xl font-bold tracking-tight">Tool·Resource·Prompt는 이름이 아니라 누가 시작하고 무엇이 남는지로 구분합니다</h2></header>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8"><Link to="/ai/mcp-protocol">MCP core</Link>가 통신의 바깥 틀이라면 <strong>primitive</strong>는 그 안에서 교환하는 기능의 종류입니다. 모든 항목을 “model이 부르는 함수”로 뭉치면 승인·cache·side effect의 경계가 사라집니다.</p><p className="leading-8">먼저 Tool 하나를 정의하고, 그다음 Resource와 Prompt를 대조합니다. 마지막에 schema·result·cache를 붙여 완전한 호출 contract로 조합합니다.</p></div>
        <McpLearningFlowViz mode="primitives" />
        <ContentBoundary article="mcp-primitives" />
      </section>

      <section id="three-primitives" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>세 primitive를 한 줄씩 분리합니다</h2><p className="leading-8">같은 “조회”라는 말보다 control 주체와 식별 방식을 먼저 봅니다.</p></div>
        <TermBreakdown title="Tool · Resource · Prompt의 형태" items={[
          { term: "Tool", description: "Model이 호출을 제안할 수 있는 계산·조회·변경 동작입니다.", example: "search_issues(query, limit)는 검색 계산과 pagination을 수행합니다.", boundary: "Read-only Tool도 Resource는 아닐 수 있고, write Tool은 사용자 승인과 server authorization이 필요합니다." },
          { term: "Resource", description: "URI로 식별하며 application이 읽거나 구독하는 context입니다.", example: "db://schema/users는 같은 주소로 다시 읽을 수 있는 schema document입니다.", boundary: "URI가 있다고 내용의 신뢰성·최신성·접근 권한이 자동 보장되지는 않습니다." },
          { term: "Prompt", description: "사용자가 선택해 시작하는 재사용 message template입니다.", example: "review_code prompt가 파일과 review 관점을 받아 message 묶음을 만듭니다.", boundary: "Prompt는 system policy나 강제 실행 command가 아닙니다." },
        ]} />
      </section>

      <section id="tool-contract" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Tool은 이름보다 입력·결과·오류의 모양이 중요합니다</h2><p className="leading-8"><code>inputSchema</code>는 호출 전에 인자를 검사하고, <code>outputSchema</code>는 성공 결과의 구조를 고정합니다. Schema를 통과했다는 사실은 JSON 형태가 맞다는 뜻이지, ticket 생성 권한이나 입력 내용의 사실성을 증명하지는 않습니다.</p></div>
        <TermBreakdown title="search_issues 호출이 끝날 수 있는 네 상태" items={[
          { term: "Protocol error", description: "JSON-RPC message 자체를 해석할 수 없는 상태입니다.", example: "존재하지 않는 method 또는 malformed JSON입니다.", boundary: "업무상 검색 결과가 0건인 경우와 다릅니다." },
          { term: "Complete · success", description: "호출이 끝났고 structuredContent가 결과 schema를 만족합니다.", example: "items 배열과 cursor를 반환합니다.", boundary: "Schema-valid 결과가 사실이라는 보장은 아닙니다." },
          { term: "Complete · tool error", description: "Tool은 실행됐지만 model이 수정할 수 있는 업무 오류가 생겼습니다.", example: "허용되지 않은 project나 잘못된 date range를 설명합니다.", boundary: "Authorization 실패를 단순 validation 문구로 숨기지 않습니다." },
          { term: "Input required", description: "작업을 이어가기 위해 사용자의 추가 입력이 필요합니다.", example: "예약 날짜 선택 schema와 requestState를 돌려줍니다.", boundary: "Model이 민감한 답을 추정하거나 재호출이 이전 effect를 반복해서는 안 됩니다." },
        ]} />
      </section>

      <section id="list-cache" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>목록을 잠깐 저장하는 일과 지금 실행해도 되는지는 별개입니다</h2><p className="leading-8"><code>tools/list</code>는 안정된 순서와 TTL을 제공해 prompt cache를 덜 흔들 수 있습니다. 하지만 cache는 “이 사용자가 지금도 이 tool을 실행할 수 있다”는 권한 영수증이 아닙니다. Tenant·user·role·server revision을 cache key에 넣고 call 시점에 다시 검사합니다.</p></div>
        <ExplainedFormula
          question="Cache가 언제 만료되는지와 call-time authorization을 어떻게 분리하는가?"
          idea={<>목록은 받은 시각에 TTL을 더해 재조회 시점을 정합니다. 실행 가능 여부는 그 식에 넣지 않고 매 call의 현재 policy로 별도 판정합니다.</>}
          formula={String.raw`t_{refresh}=t_{listed}+TTL`}
          annotatedFormula={String.raw`\begin{aligned}t_0&=\underbrace{t_{listed}}_{\text{목록 수신 시각}}\\[3pt]t_{refresh}&=\underbrace{t_0+TTL}_{\text{cache 수명만큼 이동}}\end{aligned}`}
          operations={[{ expression: String.raw`t_{listed}+TTL`, annotation: ["목록을 받은 시각에서", "허용된 cache 수명만큼 앞으로 이동"] }]}
          terms={[
            { symbol: "t_{listed}", name: "목록 수신 시각", description: "이 tenant·user·role·server revision 조합으로 list를 받은 시각입니다." },
            { symbol: "TTL", name: "목록 cache 수명", description: "목록을 다시 조회하기 전까지 재사용할 수 있는 시간입니다." },
            { symbol: "t_{refresh}", name: "재조회 시각", description: "이 시각 이후 목록을 새로 받아야 합니다." },
          ]}
          assumptions={["Server가 deterministic order와 cache hint를 제공합니다.", "Permission change notification이 오면 TTL 전에도 무효화합니다.", "Authorization은 이 식과 별도로 tools/call마다 다시 검사합니다."]}
          interpretation="TTL은 catalog freshness만 다룹니다. 실행 권한까지 cache하면 role 변경 뒤에도 오래된 권한으로 호출하는 결함이 생깁니다."
        />
        <div id="paper-mcp-tools" className="scroll-mt-20"><CitationBlock source="MCP 2026-07-28 · Tools" citeKey={1} href="https://modelcontextprotocol.io/specification/2026-07-28/server/tools"><p><strong>문제:</strong> Model이 발견·호출하는 action의 입력과 결과를 상호 운용 가능한 형태로 표현해야 합니다.</p><p><strong>핵심 기여:</strong> Tool list/call, JSON Schema, structured content, result type, MRTR와 cache semantics를 규정합니다.</p><p><strong>전제:</strong> Client와 server가 해당 revision의 Tool capability를 지원합니다.</p><p><strong>근거 범위:</strong> Primitive의 protocol contract에 한정합니다.</p><p><strong>비주장:</strong> Schema가 authorization·사용자 동의·effect safety를 보장한다는 뜻은 아닙니다.</p></CitationBlock></div>
        <div id="paper-json-schema" className="scroll-mt-20"><CitationBlock source="JSON Schema · 2020-12 core" citeKey={2} href="https://json-schema.org/draft/2020-12/json-schema-core"><p><strong>문제:</strong> JSON instance의 구조와 제약을 구현체 간 동일하게 기술해야 합니다.</p><p><strong>핵심 기여:</strong> Schema vocabulary와 evaluation model을 정의합니다.</p><p><strong>전제:</strong> MCP revision이 별도 <code>$schema</code>가 없을 때 지정한 dialect를 사용합니다.</p><p><strong>근거 범위:</strong> 구조 검증 semantics에 한정합니다.</p><p><strong>비주장:</strong> Domain correctness·사실성·권한을 검증하지 않습니다.</p></CitationBlock></div>
      </section>
    </article>
  );
}
