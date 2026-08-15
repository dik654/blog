import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { WorkspaceHarnessViz } from "./viz/ModernClaudeCodeViz";

export default function ClaudeCodeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Claude Code는 model을 workspace에 연결하는 harness입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Claude model은 다음 행동을 <strong>제안</strong>합니다. Claude
            Code는 project context를 모으고, permission을 적용하고, tool을
            실행하고, observation을 다시 model에 돌려주는 제품 runtime입니다.
            둘을 같은 주체로 보면 prompt와 실제 file effect의 경계가 사라집니다.
          </p>
        </div>
        <TermBreakdown
          title="한 workspace 작업에 등장하는 네 주체"
          items={[
            {
              term: "Prompt",
              description: "원하는 결과와 제약을 시작 state에 넣습니다.",
              example: "로그인 실패를 재현하고 최소 수정한 뒤 test합니다.",
              boundary: "막연한 요청만으로 완료 조건이 생기지는 않습니다.",
            },
            {
              term: "Model",
              description: "현재 state에서 다음 context와 action을 고릅니다.",
              example: "오류 문구를 검색하고 auth file을 읽자고 제안합니다.",
              boundary: "제안은 file write 권한이나 성공 receipt가 아닙니다.",
            },
            {
              term: "Harness",
              description: "Context·tool·permission·session을 연결합니다.",
              example: "검색을 실행하고 결과와 exit status를 돌려줍니다.",
              boundary: "Model reasoning의 정확성을 자동 보장하지 않습니다.",
            },
            {
              term: "Verifier",
              description:
                "Artifact와 실제 state가 완료 조건을 만족하는지 봅니다.",
              example: "재현 test와 regression test를 다시 실행합니다.",
              boundary: "Model의 완료 문장과 독립된 증거가 필요합니다.",
            },
          ]}
        />
        <WorkspaceHarnessViz />
        <ContentBoundary article="claude-code" />
      </section>

      <section id="agent-loop" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Gather context → act → verify가 observation마다 반복됩니다
        </h2>
        <ExplainedFormula
          question="Model의 제안이 어떻게 다음 workspace state가 되나요?"
          idea={
            <p>
              Proposal, runtime gate·execution, observation 반영을 서로 다른
              연산으로 둡니다.
            </p>
          }
          formula={String.raw`a_t=P(s_t),\quad o_t=E(G(a_t)),\quad s_{t+1}=U(s_t,o_t)`}
          annotatedFormula={String.raw`\begin{aligned}a_t&=\underbrace{P(s_t)}_{\text{현재 state에서 action 제안}}\\o_t&=\underbrace{E(G(a_t))}_{\text{gate 통과 뒤 실행·관측}}\\s_{t+1}&=\underbrace{U(s_t,o_t)}_{\text{관측을 다음 state에 반영}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`P(s_t)`,
              annotation: ["현재 evidence에서", "다음 action만 제안"],
            },
            {
              expression: String.raw`E(G(a_t))`,
              annotation: ["Runtime gate 뒤 실행해", "typed observation 생성"],
            },
            {
              expression: String.raw`U(s_t,o_t)`,
              annotation: ["기존 state와 관측을 합쳐", "다음 판단 근거 생성"],
            },
          ]}
          terms={[
            {
              symbol: "s_t",
              name: "Run state",
              description: "시점 t의 요청·context·artifact·receipt입니다.",
            },
            {
              symbol: "a_t",
              name: "Action proposal",
              description: "Model이 제안한 tool name과 input입니다.",
            },
            {
              symbol: "G",
              name: "Runtime gate",
              description: "Identity·scope·approval을 판정합니다.",
            },
            {
              symbol: "E",
              name: "Executor",
              description: "허용된 tool call을 실제 환경에 적용합니다.",
            },
            {
              symbol: "o_t",
              name: "Observation",
              description: "Status·payload·effect receipt·error입니다.",
            },
            {
              symbol: "U",
              name: "State update",
              description: "Observation을 다음 run state에 반영합니다.",
            },
          ]}
          assumptions={[
            "Action proposal과 executor가 서로 다른 runtime 책임입니다.",
            "Tool result는 source·status·identity가 있는 observation으로 돌아옵니다.",
            "완료는 별도 verifier가 판정합니다.",
          ]}
          interpretation="Model이 Edit를 제안해도 G가 거부하면 E는 실행되지 않고, 거부 observation만 다음 state에 들어갑니다."
        />
      </section>

      <section id="tool-effect" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Tool 목록보다 observation과 effect receipt를 먼저 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            File operation, search, shell execution, web, code intelligence는
            서로 다른 effect를 냅니다. 이름을 외우는 대신 read-only observation,
            workspace mutation, process·network effect, delegation으로 나눠
            permission과 rollback 요구를 정합니다. Context가 어디서 오는지는
            <a href="/ai/claude-code-instructions-memory">
              {" "}
              instruction·memory 글
            </a>
            , effect를 허용하는 순서는
            <a href="/ai/claude-code-permissions"> permission 글</a>에서
            이어집니다.
          </p>
        </div>
      </section>

      <section id="paper-how-claude-code-works" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — How Claude Code works"
            citeKey={1}
            href="https://code.claude.com/docs/en/how-claude-code-works"
          >
            문제: language model을 repository의
            context·tool·session·verification에 연결하는 제품 경계를 설명해야
            합니다. 기여: 공식 문서는 gather context·take action·verify의
            agentic loop와 model·tool 역할을 공개합니다. 전제: 현재 Claude Code
            client와 선택한 execution environment입니다. 근거 범위: 공개된 제품
            interface와 동작입니다. 하지 않는 주장: model 판단이나 생성 코드가
            항상 정확하고 모든 외부 effect가 자동 복구된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
