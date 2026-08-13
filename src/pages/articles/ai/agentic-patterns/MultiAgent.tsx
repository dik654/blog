import { Link } from "react-router-dom";
import DelegationContractViz from "./viz/DelegationContractViz";
import OrchestrationChoiceViz from "./viz/OrchestrationChoiceViz";
import { CitationBlock } from "@/components/ui/citation";

export default function MultiAgent() {
  return (
    <section id="multi-agent" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Multi-agent는 지능을 합치는 방식이 아니라 context·권한·artifact 소유권을
        분리하는 방식이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Agent 수를 늘린다고 같은 model의 판단력이 자동으로 더해지지는
          않습니다. 이점은 서로 독립적인 탐색을 병렬화하거나, 작성자와
          verifier의 context를 분리하고, specialist마다 tool capability를 제한할
          때 생깁니다. 반대로 같은 자료를 여러 agent가 반복해 읽고 자유 형식
          대화를 이어가면 token·latency·merge conflict만 늘어납니다.
        </p>
      </div>

      <DelegationContractViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Delegation은 prompt 전달이 아니라 typed contract다</h3>
        <p className="leading-8">
          Delegate에는 objective, input artifact, 읽기·쓰기 범위, 허용 tool,
          output schema, verification과 deadline을 줍니다. Sub-agent의
          “끝냈다”는 문장을 믿지 않고 artifact와 evidence를 확인합니다. 공유
          파일이나 plan state는 writer를 하나로 두거나 transaction과 merge
          rule을 정의해 last-write-wins 손실을 막습니다.
        </p>
      </div>

      <OrchestrationChoiceViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Manager와 handoff는 user-facing state 소유권이 다르다</h3>
        <p className="leading-8">
          Manager pattern은 중앙 agent가 specialist를 tool처럼 호출하고 최종
          응답과 대화 state를 계속 소유합니다. Decentralized handoff는 다음
          specialist에게 실행과 user interaction을 넘깁니다. Parallel fan-out은
          task가 독립이고 merge function이 있을 때만 안전합니다. 실제 context
          isolation·checkpoint·merge 구현은
          <Link to="/ai/multi-agent-implementation">
            {" "}
            Multi-agent 구현 정본 글
          </Link>
          에서 이어집니다.
        </p>
        <div id="paper-openai-agent-guide" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="OpenAI — A practical guide to building agents"
            citeKey={4}
            href="https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/"
          >
            Single-agent에서 시작해 manager·handoff orchestration, guardrail,
            human intervention과 run exit를 설계하는 실무 기준을 설명합니다.
            OpenAI 제품 예시와 guide의 권고가 multi-agent의 보편적 성능 우위를
            입증하는 benchmark는 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
