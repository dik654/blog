import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { ControlBoundaryViz } from "../llm-harness/viz/ModernHarnessViz";

export default function AgentControlBoundariesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="workflow-agent" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Workflow와 agent는 등급이 아니라 경로 선택 주체의 차이입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            다음 단계가 고정된 구간은 workflow가, observation을 보고 의미적으로
            탐색할 구간은 agent loop가 잘 맞습니다. 되돌리기 어려운 state
            transition 앞에는 어느 쪽이 오더라도 deterministic checkpoint를
            둡니다.
          </p>
        </div>
        <TermBreakdown
          title="작업 구간마다 고르는 세 제어 형태"
          items={[
            {
              term: "Workflow",
              description: "개발자가 미리 고정한 순서와 branch를 실행합니다.",
              example: "Build→test→package입니다.",
            },
            {
              term: "Agent loop",
              description: "Model이 observation을 보고 다음 action을 고릅니다.",
              example: "Unknown codebase에서 원인 파일을 탐색합니다.",
            },
            {
              term: "Checkpoint",
              description: "위험 effect 앞의 deterministic gate와 승인입니다.",
              example:
                "Deploy 전 target diff·approval·rollback plan을 확인합니다.",
            },
          ]}
        />
        <ControlBoundaryViz />
        <ContentBoundary article="agent-control-boundaries" />
      </section>
      <section id="selection" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          경로 불확실성과 effect 위험을 다른 축으로 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li>낮은 불확실성·낮은 위험: 단순 workflow로 충분합니다.</li>
            <li>
              높은 불확실성·낮은 위험: bounded agent exploration을 허용합니다.
            </li>
            <li>
              낮거나 높은 불확실성·높은 위험: 승인 checkpoint와 receipt를
              강제합니다.
            </li>
          </ul>
        </div>
        <span id="blast-radius" className="scroll-mt-20" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Checkpoint를 어디에 둘지는 그 action이 실패했을 때 번지는 범위인{" "}
            <strong>blast radius</strong>로 정합니다. 한 action의 blast
            radius를 미리 제한해 두면, checkpoint를 놓친 예외 상황에서도
            피해가 그 범위 밖으로 넘어가지 않습니다.
          </p>
          <p>
            Least privilege는 이 blast radius를 만드는 실제 방법입니다. 이번
            action이 필요한 자원과 권한만 미리 부여해 두면, agent가 잘못된
            경로를 골라도 실패의 반경이 그 권한 범위로 저절로 좁혀집니다.
          </p>
          <p>
            가령 배포 agent에게 project 전체 write 권한 대신 이번 release
            하나의 target·revision만 write 가능한 scoped credential을 주면,
            같은 실수라도 번지는 범위가 project 전체에서 release 1건으로
            줄어듭니다. Least privilege가 애초에 커질 수 있는 반경 자체를
            줄여 주는 셈입니다.
          </p>
          <p>
            다만 least privilege만으로 blast radius가 0이 되지는 않습니다.
            그 좁은 권한 안에서 일어난 effect도 checkpoint의 receipt와
            rollback 경로가 없으면 되돌릴 수 없습니다.
          </p>
        </div>
      </section>
      <section id="loop-authority" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Run 내부 loop와 harness 개선 loop의 권한을 분리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Agent action loop는 한 run의 budget과 capability 안에서 움직입니다.
            Production trace를 보고 prompt·skill·policy를 바꾸는 개선 loop는
            여러 run의 표본, review, canary와 rollback을 거칩니다. 한 judge
            feedback이 global harness를 즉시 바꾸게 하지 않습니다.
          </p>
        </div>
      </section>
      <section id="paper-loop-control" className="scroll-mt-20">
        <div className="not-prose space-y-4">
          <CitationBlock
            source="Anthropic — Building effective agents"
            citeKey={1}
            href="https://www.anthropic.com/engineering/building-effective-agents"
          >
            Workflow와 agent를 구분하고 필요한 복잡성만 추가하는 기준을
            설명합니다. Workflow·agent가 성숙도 순서라는 뜻은 아닙니다.
          </CitationBlock>
          <CitationBlock
            source="LangChain — The Art of Loop Engineering"
            citeKey={2}
            href="https://www.langchain.com/blog/the-art-of-loop-engineering"
          >
            Agent·verification·event-driven·hill-climbing loop를 서로 다른 운영
            주기로 나눈 최근 vocabulary입니다. 합의된 표준 taxonomy로 읽지는
            않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
