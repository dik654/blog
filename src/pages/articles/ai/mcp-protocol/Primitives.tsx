import { CitationBlock } from "@/components/ui/citation";
import PrimitivesViz from "./viz/PrimitivesViz";
import PrimitivesDetailViz from "./viz/PrimitivesDetailViz";

export default function Primitives() {
  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Tool·Resource·Prompt는 control과 수명이 서로 다른 primitive다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MCP server가 제공하는 항목을 모두 “model이 호출하는 함수”로 이해하면
          설계가 곧 흐려집니다. <strong>Tool</strong>은 model이 호출을 제안할 수 있는
          계산·조회·변경 동작이고, <strong>Resource</strong>는 URI로 식별해 application이
          읽거나 구독하는 context입니다. <strong>Prompt</strong>는 사용자가 선택해
          시작하는 재사용 message template입니다. 같은 정보 조회라도 검색어와
          pagination이 필요한 계산은 read-only Tool이 될 수 있으므로 이름보다
          실제 control model과 lifecycle을 봐야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <PrimitivesViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Tool contract는 입력뿐 아니라 결과와 실패도 정의한다</h3>
        <p>
          Tool의 <code>inputSchema</code>와 선택적 <code>outputSchema</code>는 별도
          <code>$schema</code>가 없으면 JSON Schema 2020-12를 사용합니다. Server는
          outputSchema가 있을 때 <code>structuredContent</code>를 그 schema에 맞춰야
          하고 client도 이를 검증하는 편이 좋습니다. Structured content는 object만이
          아니라 array·string·number·boolean·null을 포함한 임의의 JSON value일 수
          있으며, model의 schema-constrained generation을 뜻하는 “structured
          output”과는 다른 개념입니다.
        </p>
        <pre className="whitespace-pre-wrap break-words"><code>{`{
  "name": "search_issues",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "integer", "minimum": 1, "maximum": 50 }
    },
    "required": ["query"],
    "additionalProperties": false
  },
  "outputSchema": {
    "type": "array",
    "items": {
      "type": "object",
      "required": ["id", "title"]
    }
  }
}`}</code></pre>
        <p>
          완료된 tool result는 <code>resultType: "complete"</code>를 가지며
          실행 가능한 업무 오류는 <code>isError: true</code>와 model이 고칠 수 있는
          설명으로 돌려줍니다. 반면 존재하지 않는 tool이나 malformed request처럼
          protocol 자체가 성립하지 않는 오류는 JSON-RPC error로 반환합니다. 둘을
          나누면 model은 날짜 형식 같은 업무 오류는 수정해 재시도하면서도 protocol
          bug를 무한 반복하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <PrimitivesDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>목록 cache와 호출 권한은 다른 시점의 판단이다</h3>
        <p>
          <code>tools/list</code> 같은 목록 응답은 <code>ttlMs</code>와
          <code>cacheScope</code>를 제공할 수 있고, underlying set이 같을 때 server는
          deterministic order로 반환해야 합니다. 그래야 client cache와 model prompt
          cache가 불필요하게 흔들리지 않습니다. 다만 목록이 cache됐다는 이유로
          호출 권한까지 고정되는 것은 아닙니다. Cache key에는 server version,
          tenant, user·role scope를 포함하고 실제 <code>tools/call</code>에서는 현재
          credential과 resource ACL을 다시 검사해야 합니다.
        </p>

        <div id="paper-mcp-tools" className="not-prose scroll-mt-24">
          <CitationBlock
            source="MCP 2026-07-28 — Tools"
            citeKey={3}
            href="https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
          >
            현행 Tool 명세는 model-controlled discovery, JSON Schema 입력·출력,
            structuredContent, complete/input_required result, list cache와 explicit
            state handle을 정의합니다. Schema와 annotation은 untrusted input으로
            취급해야 하며, human confirmation과 server-side authorization을 대신하지
            않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
