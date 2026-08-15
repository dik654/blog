import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { DelegationOwnershipViz } from "./viz/ModernAgentPatternViz";

export default function DelegationContractsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Multi-agent의 이점은 지능 합산이 아니라 경계 분리에서 나옵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">같은 model을 여러 번 호출한다고 판단력이 자동으로 더해지지 않습니다. 독립 탐색을 병렬화하고, writer와 verifier의 context를 분리하며, specialist마다 capability를 좁힐 때 이점이 생깁니다. 이 조건이 없으면 token·latency·merge conflict만 늘어납니다.</p>
        </div>
        <TermBreakdown title="위임 전에 네 소유권을 한 줄씩 정합니다" description="누가 일하고, 무엇을 쓰며, 누가 합치고, 누가 사용자 상태를 보존하는지 분리합니다." items={[
          { term: "Input owner", description: "Delegate에게 전달할 immutable source snapshot과 objective를 고정합니다.", example: "docs@commit-a와 question-v2만 read합니다.", boundary: "여러 worker가 움직이는 최신 tree를 제각각 읽게 두지 않습니다." },
          { term: "Artifact writer", description: "공유 결과물의 유일 writer 또는 transaction 범위를 정합니다.", example: "Researcher는 evidence JSON만, implementer는 source tree만 씁니다.", boundary: "자유로운 동시 write와 last-write-wins를 기본값으로 두지 않습니다." },
          { term: "Merge owner", description: "Schema·checksum·validator를 확인하고 결과를 채택하거나 충돌을 되돌리는 주체입니다.", example: "Coordinator가 두 evidence receipt를 검증합니다.", boundary: "Sub-agent의 완료 문장을 그대로 merge하지 않습니다." },
          { term: "Conversation-state owner", description: "Pending effect·user history·final response를 계속 소유할 agent입니다.", example: "Manager call은 manager가, handoff는 specialist가 소유합니다.", boundary: "Tool call과 handoff를 같은 delegation으로 부르지 않습니다." },
        ]} />
        <DelegationOwnershipViz />
        <ContentBoundary article="agent-delegation-contracts" />
      </section>

      <section id="delegation-contract" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Delegation은 prompt 전달이 아니라 typed contract입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Delegate record에는 항목을 줄바꿈해 명시합니다.</p>
          <ul>
            <li><strong>Objective</strong><br />어떤 판단 또는 artifact를 제출해야 하는가</li>
            <li><strong>Input snapshot</strong><br />읽을 source revision·artifact checksum</li>
            <li><strong>Capability</strong><br />허용 tool·resource·write scope</li>
            <li><strong>Output contract</strong><br />schema·destination·deadline</li>
            <li><strong>Acceptance</strong><br />validator·review owner·failure return</li>
          </ul>
          <p>이 중 하나라도 없으면 worker 수를 늘려도 어떤 결과가 신뢰 가능한지 판단하기 어렵습니다.</p>
        </div>
      </section>

      <section id="manager-handoff" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Manager call과 handoff는 사용자 상태의 owner가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Manager call</strong><br />중앙 agent가 specialist를 tool처럼 호출합니다. Specialist는 typed result를 돌려주고 manager가 unresolved state·final synthesis·다음 user turn을 계속 소유합니다.</p>
          <p><strong>Handoff</strong><br />Specialist가 conversation identity·pending effect·approval state·return condition을 인수합니다. 이 payload가 없으면 이전 담당자가 알고 있던 미완료 상태가 사라집니다.</p>
        </div>
      </section>

      <section id="parallel-merge" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Parallel fan-out은 독립성과 merge algebra가 있을 때만 안전합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>서로 다른 문서를 읽어 evidence record를 만드는 작업은 병렬화하기 쉽습니다. 같은 file section을 고치는 작업은 독립적이지 않습니다. 결과 순서가 달라도 같은 값이 되는 commutative merge, 같은 receipt를 두 번 적용해도 한 번과 같은 idempotency, 또는 conflict detector가 없다면 coordinator가 serial writer가 되어야 합니다.</p>
          <p>Checkpoint·context isolation·merge 구현은 <Link to="/ai/multi-agent-implementation">Multi-agent 구현</Link> 글에서 이어집니다.</p>
        </div>
        <div id="paper-openai-agent-guide" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock source="OpenAI — A practical guide to building agents" citeKey={4} href="https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/">Single-agent에서 시작해 manager·handoff orchestration, guardrail, human intervention과 exit 조건을 추가하는 실무 기준을 설명합니다. 특정 vendor 구성이나 multi-agent의 보편적 성능 우위를 입증하는 benchmark로 확대하지 않습니다.</CitationBlock>
        </div>
      </section>
    </div>
  );
}
