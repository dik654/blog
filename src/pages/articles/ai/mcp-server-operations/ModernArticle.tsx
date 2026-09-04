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
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">호출 성공이 아니라 effect의 끝을 봅니다</p><h2 className="text-3xl font-bold tracking-tight">Production MCP server는 model proposal을 검증된 domain effect와 영수증으로 바꿉니다</h2></header>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8"><Link to="/ai/mcp-primitives">Tool schema</Link>와 <Link to="/ai/mcp-transports">transport</Link>가 준비돼도 production 운영은 끝나지 않습니다. Model의 tool call은 실행 후보이고, description은 설명 data이며, timeout은 미실행 증명이 아닙니다.</p><p className="leading-8">이 글은 authorization gate 하나에서 시작해 실제 side effect와 receipt를 붙입니다. 마지막에 retry·extension·deprecation을 배포 lifecycle로 조합합니다.</p></div>
        <McpLearningFlowViz mode="operations" />
        <ContentBoundary article="mcp-server-operations" />
      </section>

      <section id="authorization" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Discovery·proposal·consent·authorization은 서로 다른 문입니다</h2><p className="leading-8">
            Tool이 목록에 보인다는 사실은 존재를 알 뿐입니다. Model이 호출을 제안하면 host가 현재 사용자와 위험도에 맞춰 노출·확인을 판단하고 server는 token과 실제
            resource ACL을 다시 검사합니다.
          </p></div>
        <TermBreakdown title="create_ticket이 effect에 도달하기 전 네 판단" items={[
          { term: "Discovery", description: "Server가 제공한다고 광고한 tool과 schema를 host가 읽습니다.", boundary: "Server self-description은 trust proof가 아닙니다." },
          { term: "Model proposal", description: "현재 문맥에서 이 tool과 argument를 쓰자는 후보입니다.", boundary: "Model reasoning은 authorization decision이 아닙니다." },
          { term: "User consent · host policy", description: "사용자 의도와 위험 수준에 맞는지 host가 확인합니다.", example: "Read는 자동 허용하고 delete는 확인 dialog를 요구할 수 있습니다.", boundary: "Host 승인이 server-side ACL을 대신하지 않습니다." },
          { term: "Server authorization", description: "Issuer·audience·scope·tenant와 대상 resource 권한을 실행 직전에 검사합니다.", boundary: "Bearer token을 prompt나 tool argument, 일반 log에 복사하지 않습니다." },
        ]} />
      </section>

      <section id="retry-receipt" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Timeout은 “실행되지 않음”이 아니라 “결과를 모름”입니다</h2><p className="leading-8">
            Client가 response를 못 받았어도 server는 ticket을 이미 만들었을 수 있습니다. 같은 요청을 새 identity로 다시 보내면 ticket이 두 개
            생깁니다. Write tool은 stable operation ID를 받고 effect receipt를 저장하며 retry에서는 먼저 기존 receipt를 조회해야 합니다.
          </p></div>
        <TermBreakdown title="안전한 retry가 보존하는 형태" items={[
          { term: "Operation ID", description: "논리적으로 같은 작업임을 여러 network attempt 사이에 고정합니다.", example: "create-ticket:tenant7:request42를 retry에도 그대로 보냅니다.", boundary: "JSON-RPC request id와 동일한 수명이라고 가정하지 않습니다." },
          { term: "Attempt", description: "같은 operation을 전송한 각 network 시도를 구분합니다.", example: "attempt 1은 timeout, attempt 2는 기존 receipt 조회입니다.", boundary: "Attempt가 늘어도 effect 수가 늘어서는 안 됩니다." },
          { term: "Effect receipt", description: "외부 변경의 identity·상태·revision을 기록한 검증 가능한 결과입니다.", example: "ticketId=91, createdAt, policyRevision, terminalStatus를 남깁니다.", boundary: "단순 성공 문자열이나 transport 200만으로 대체하지 않습니다." },
          { term: "Status lookup", description: "응답 유실 뒤 새 effect를 만들기 전에 기존 operation 결과를 확인합니다.", boundary: "Lookup 자체의 authorization과 retention 기간도 정의합니다." },
        ]} />
        <ExplainedFormula
          question="Retry가 여러 번 일어나도 같은 operation의 외부 effect를 하나 이하로 제한하려면 무엇을 검사하는가?"
          idea={<>Network attempt 수와 effect 수를 분리합니다. Server는 operation ID로 기존 receipt를 먼저 찾아, 이미 끝났다면 같은 결과를 돌려주고 새 effect를 만들지 않습니다.</>}
          formula={String.raw`E(o)=\sum_{a=1}^{A(o)}\mathbf 1[\text{attempt }a\text{ creates effect}]\le 1`}
          annotatedFormula={String.raw`\begin{aligned}I_a&=\underbrace{\mathbf 1[\text{attempt }a\text{ creates effect}]}_{\substack{\text{새 effect면 1}\text{receipt 재사용이면 0}}}\\[3pt]E(o)&=\underbrace{\sum_{a=1}^{A(o)}I_a}_{\text{effect 횟수만 누적}}\\[3pt]E(o)&\le\underbrace{1}_{\text{operation당 최대 하나}}\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{a=1}^{A(o)}\mathbf 1[\cdots]`, annotation: ["동일 operation의 모든 전송 시도에서", "실제 effect가 생긴 횟수만 누적"] },
            { expression: String.raw`E(o)\le 1`, annotation: ["Retry 횟수와 무관하게", "외부 변경을 하나 이하로 제한"] },
          ]}
          terms={[
            { symbol: "o", name: "Operation ID", description: "Retry 사이에도 바뀌지 않는 논리 작업 identity입니다." },
            { symbol: "A(o)", name: "Attempt 수", description: "Operation o를 network로 전송한 총 시도 수입니다." },
            { symbol: String.raw`\mathbf 1[\cdot]`, name: "Effect indicator", description: "해당 attempt가 새 외부 변경을 만들었으면 1, 아니면 0입니다." },
            { symbol: "E(o)", name: "Effect 수", description: "같은 operation 때문에 실제로 만들어진 외부 변경의 합입니다." },
          ]}
          assumptions={["Server가 operation ID와 receipt를 원자적으로 기록합니다.", "Receipt retention이 client의 retry window보다 깁니다.", "Status lookup에도 caller·tenant authorization을 적용합니다.", "외부 system이 별도 idempotency key를 지원하면 같은 identity를 전달합니다."]}
          interpretation="Retry가 성공했는지가 아니라 effect가 중복되지 않았는지를 release gate로 둡니다. Ambiguous completion을 정상 상태로 모델링해야 이 조건을 시험할 수 있습니다."
        />
      </section>

      <section id="release" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Core·extension·legacy 경로를 분리한 뒤 failure fixture로 배포합니다</h2><p className="leading-8">작은 core 위의 Tasks 같은 extension은 capability와 revision을 trace에 기록합니다. Deprecated path는 신규 기본 경로에 섞지 않고 compatibility adapter에 가둡니다. Partial frame·wrong version·schema mismatch·timeout·late response·process crash·권한 변경·중복 retry를 고정 fixture로 주입합니다.</p></div>
        <TermBreakdown title="Release receipt에 한 줄씩 남길 것" items={[
          { term: "Pinned revisions", description: "Protocol·SDK·server·schema revision을 함께 기록합니다.", boundary: "문서 최신판과 실제 배포 binary가 같다고 추정하지 않습니다." },
          { term: "Failure matrix", description: "정상 경로뿐 아니라 timeout·late response·cancel·권한 변경을 재현합니다.", boundary: "한 번의 demo 성공을 production evidence로 쓰지 않습니다." },
          { term: "Effect invariant", description: "Write retry fixture에서 duplicate effect가 0인지 확인합니다.", boundary: "Read tool의 retry 성공률만으로 write safety를 추론하지 않습니다." },
          { term: "Rollback trigger", description: "오류율·receipt 누락·legacy 사용량 등 되돌릴 수치를 미리 정합니다.", boundary: "Deprecated가 곧 제거됐다는 뜻은 아닙니다." },
        ]} />
        <div id="paper-mcp-authorization" className="scroll-mt-20"><CitationBlock source="MCP 2026-07-28 · Authorization" citeKey={1} href="https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization"><p><strong>문제:</strong> Remote MCP에서 OAuth metadata와 token을 올바른 issuer·resource에 묶어야 합니다.</p><p><strong>핵심 기여:</strong> Authorization discovery·issuer validation·resource indicator 경계를 규정합니다.</p><p><strong>전제:</strong> Remote HTTP deployment와 해당 revision의 authorization profile을 사용합니다.</p><p><strong>근거 범위:</strong> Protocol authorization flow에 한정합니다.</p><p><strong>비주장:</strong> Domain ACL·user consent·tool effect safety까지 대신하지 않습니다.</p></CitationBlock></div>
        <div id="paper-mcp-changelog" className="scroll-mt-20"><CitationBlock source="MCP 2026-07-28 · Changelog" citeKey={2} href="https://modelcontextprotocol.io/specification/2026-07-28/changelog"><p><strong>문제:</strong> Core·extension·deprecated feature의 migration 범위를 revision별로 구분해야 합니다.</p><p><strong>핵심 기여:</strong> Breaking change, extension framework와 deprecation policy를 기록합니다.</p><p><strong>전제:</strong> 실제 SDK 지원 matrix와 함께 읽습니다.</p><p><strong>근거 범위:</strong> 2026-07-28 변화와 lifecycle policy입니다.</p><p><strong>비주장:</strong> Deprecated feature가 즉시 동작하지 않거나 영구 지원된다는 뜻은 아닙니다.</p></CitationBlock></div>
      </section>
    </article>
  );
}
