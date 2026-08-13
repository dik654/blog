import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import AgentStateViz from "./viz/AgentStateViz";
import PatternChoiceViz from "./viz/PatternChoiceViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        에이전트의 최소 단위는 답변이 아니라 관찰 가능한 상태를 바꾸는 실행
        loop다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          일반적인 LLM 호출은 입력에서 출력을 한 번 만듭니다. Agent runtime은
          model이 현재 상태를 보고 action을 선택하게 하고, tool이나 환경이
          반환한 observation을 다음 판단에 다시 넣습니다. Model이 workflow
          실행을 동적으로 지휘한다는 점이 핵심이며, 미리 정한 code path에서
          LLM을 호출하는 workflow와 구분할 수 있습니다.
        </p>
        <p className="leading-8">
          이 차이는 자율성의 홍보 문구가 아니라 실패 경계를 바꿉니다. 잘못된
          답변은 text로 끝나지만 잘못된 action은 파일·DB·결제·외부 메시지를 바꿀
          수 있습니다. 따라서 state schema, tool capability, permission,
          observation provenance, exit condition이 model prompt와 같은 수준의
          설계 입력이 됩니다.
        </p>
      </div>

      <ContentBoundary article="agentic-patterns" />
      <AgentStateViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          패턴은 제품 계급이 아니라 불확실성과 검증 비용에 맞춘 control flow다
        </h3>
        <p className="leading-8">
          ReAct·plan-execute·reflection·multi-agent는 서로 배타적인 제품이
          아닙니다. 한 run의 상위 plan 안에서 각 task를 ReAct로 수행하고,
          deterministic verifier가 실패하면 reflection을 생성해 재계획하며, 독립
          task만 sub-agent에 위임할 수 있습니다. 먼저 single-agent loop로
          시작하고 실제 failure trace가 요구할 때 구조를 추가해야 평가와 복구가
          단순합니다.
        </p>
      </div>

      <PatternChoiceViz />

      <div
        id="paper-anthropic-effective-agents-patterns"
        className="not-prose mt-6 scroll-mt-24"
      >
        <CitationBlock
          source="Anthropic — Building effective agents"
          citeKey={3}
          href="https://www.anthropic.com/engineering/building-effective-agents"
        >
          미리 정한 code path를 따르는 workflow와 model이 process·tool use를
          지휘하는 agent를 구분하고, routing·parallelization·orchestrator-worker·
          evaluator-optimizer 패턴을 설명합니다. 이를 고정된 성숙도 순서나 모든
          task에 필요한 architecture 목록으로 해석하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
