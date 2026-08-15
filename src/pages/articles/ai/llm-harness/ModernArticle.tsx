import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { HarnessBoundaryViz } from "./viz/ModernHarnessViz";

export default function LlmHarnessArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LLM harness는 model 바깥의 실행 시스템입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Model은 다음 action을 <strong>제안</strong>할 수 있습니다. 그러나
            어떤 identity가 어느 resource를 바꿔도 되는지, effect가 실제로
            일어났는지, 언제 run을 끝낼지는 runtime이 강제해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 action을 실행 결과로 바꾸는 네 주체"
          items={[
            {
              term: "Model",
              description:
                "현재 context에서 다음 action과 argument를 제안합니다.",
              example: "deploy(project=A)를 출력합니다.",
              boundary: "제안은 authority나 실행 완료 receipt가 아닙니다.",
            },
            {
              term: "Runtime",
              description:
                "Identity·target·operation·approval을 policy와 비교합니다.",
              example:
                "workspace-write는 허용하지만 production deploy는 승인 전 거절합니다.",
            },
            {
              term: "Executor",
              description:
                "허용된 action을 실제 tool·filesystem·API에 적용합니다.",
              example:
                "Stable operation key로 deployment API를 한 번 호출합니다.",
            },
            {
              term: "Observation",
              description:
                "Result·error·effect receipt·verifier 판정을 다음 step에 돌려줍니다.",
              example:
                "Deployment ID와 target revision, health result를 반환합니다.",
            },
          ]}
        />
        <HarnessBoundaryViz />
        <ContentBoundary article="llm-harness" />
      </section>
      <section id="proposal-runtime" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Tool schema를 말할 수 있는 능력과 실행 권한은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prompt의 “삭제하지 마라”나 typed function argument는 authorization이
            아닙니다. Runtime은 current identity와 resource scope를 다시
            검사하고, 외부 write에는 stable operation key와 receipt를 요구해야
            합니다.
          </p>
        </div>
      </section>
      <section id="feedback-loop" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          결과는 문자열보다 typed observation으로 돌아옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “성공한 것 같다” 대신 exit status, created resource identity,
            checksum, verifier result와 retry classification을 돌려줘야 다음
            action과 종료를 구분할 수 있습니다. 이 loop를 실제 작업 단위로 묶는
            방법은 <a href="/ai/agent-run-contract">run contract 글</a>에서
            이어집니다.
          </p>
        </div>
      </section>
      <section id="paper-effective-agents" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — Building effective agents"
            citeKey={1}
            href="https://www.anthropic.com/engineering/building-effective-agents"
          >
            Workflow와 agent를 구분하고 단순한 구조에서 관측된 필요에 따라
            routing·parallelization·evaluation을 추가합니다. 모든 agent
            architecture의 표준 분류나 보편 성능 보장은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
