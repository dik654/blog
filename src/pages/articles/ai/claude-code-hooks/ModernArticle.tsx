import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { HookLifecycleViz } from "../claude-code/viz/ModernClaudeCodeViz";

export default function ClaudeCodeHooksArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="event-contract" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Hook은 lifecycle event에 연결된 typed handler입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            “자동화 script”라고만 부르면 언제 실행되고 무엇을 보고 어떤
            decision을 낼지 알 수 없습니다. Event·matcher·optional argument
            filter·handler·input/output·timeout·log를 한 계약으로 읽습니다.
          </p>
        </div>
        <TermBreakdown
          title="Hook 한 개를 구성하는 네 층"
          items={[
            {
              term: "Event",
              description: "Session·turn·tool call의 어느 시점인지 정합니다.",
              example: "PreToolUse는 tool 실행 전에 발생합니다.",
              boundary: "Event마다 blocking 가능 여부가 다릅니다.",
            },
            {
              term: "Matcher",
              description:
                "Event 중 어떤 tool·agent·trigger를 고를지 정합니다.",
              example: "Bash tool만 선택합니다.",
              boundary:
                "Argument까지 좁히려면 handler if가 필요할 수 있습니다.",
            },
            {
              term: "Handler",
              description:
                "Command·HTTP·MCP·prompt·agent 중 실제 실행 주체입니다.",
              example: "JSON stdin을 읽는 local script를 실행합니다.",
              boundary:
                "사용자 code이므로 secret·timeout·failure 위험이 있습니다.",
            },
            {
              term: "Output",
              description:
                "Decision·추가 context·audit result를 runtime에 돌려줍니다.",
              example: "permissionDecision=deny와 이유를 반환합니다.",
              boundary: "Exit 0 무출력은 approve가 아니라 no decision입니다.",
            },
          ]}
        />
        <HookLifecycleViz />
        <ContentBoundary article="claude-code-hooks" />
      </section>
      <section id="resolution" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Event·matcher·if가 모두 맞을 때 handler를 실행합니다
        </h2>
        <ExplainedFormula
          question="Concrete event input x가 hook handler까지 도달하는 조건은 무엇인가요?"
          idea={
            <p>
              Lifecycle event, matcher field, optional argument filter를 독립
              gate로 두고 모두 참일 때만 handler를 부릅니다.
            </p>
          }
          formula={String.raw`F(x)=I_E(x)\land I_M(x)\land I_Q(x),\quad y=H(x)`}
          annotatedFormula={String.raw`\begin{aligned}F(x)&=\underbrace{I_E(x)}_{\text{event 시점 일치}}\land\underbrace{I_M(x)}_{\text{matcher 일치}}\\&\quad\land\underbrace{I_Q(x)}_{\text{optional if 일치}}\\y&=\underbrace{H(x)}_{\text{matched input만 handler 실행}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`I_E(x)\land I_M(x)`,
              annotation: ["언제와 어떤 대상을", "둘 다 먼저 좁힘"],
            },
            {
              expression: String.raw`\land I_Q(x)`,
              annotation: [
                "Concrete argument 조건까지",
                "optional filter로 확인",
              ],
            },
            {
              expression: String.raw`H(x)`,
              annotation: ["모든 gate가 참일 때만", "handler에 JSON 전달"],
            },
          ]}
          terms={[
            {
              symbol: "x",
              name: "Hook input",
              description: "Session·tool·agent identity와 event payload입니다.",
            },
            {
              symbol: "I_E",
              name: "Event gate",
              description: "설정한 lifecycle event이면 1입니다.",
            },
            {
              symbol: "I_M",
              name: "Matcher gate",
              description: "Event의 match field가 맞으면 1입니다.",
            },
            {
              symbol: "I_Q",
              name: "Argument filter",
              description: "Optional if condition이 맞거나 없으면 1입니다.",
            },
            {
              symbol: "H",
              name: "Handler",
              description: "Command·HTTP·MCP·prompt·agent handler입니다.",
            },
            {
              symbol: "y",
              name: "Hook output",
              description: "Decision·context·audit output입니다.",
            },
          ]}
          assumptions={[
            "현재 client가 해당 event와 handler type을 지원합니다.",
            "Matcher syntax와 input schema는 version과 함께 고정합니다.",
            "Handler timeout·secret·failure mode를 명시합니다.",
          ]}
          interpretation="PreToolUse event여도 matcher가 Bash와 맞지 않으면 F=0이라 handler process를 만들지 않습니다."
        />
      </section>
      <section id="security" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Hook 자체도 신뢰 경계 안의 실행 code입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Workspace가 바꿀 수 있는 script를 조직 credential로 실행하면 hook이
            새로운 공격 경로가 됩니다. Handler
            path·revision·environment·timeout·allowed URL·log retention을
            고정하고, 실패할 때 fail-open인지 fail-closed인지 event별로
            시험합니다. Event 이름과 matcher syntax는 제품 version에 따라
            바뀌므로 고정 목록을 암기하지 않고 현재 schema를 확인합니다.
          </p>
        </div>
      </section>
      <section id="paper-claude-hooks" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — Hooks reference"
            citeKey={1}
            href="https://code.claude.com/docs/en/hooks"
          >
            문제: Lifecycle 자동화가 언제 실행되고 무엇을 입력받아 어떤 결정을
            반환하는지 명시해야 합니다. 기여: 공식 reference는
            event·matcher·handler·JSON I/O·exit code·timeout과 security
            boundary를 설명합니다. 전제: 현재 Claude Code version과 hook
            location입니다. 근거 범위: 공개된 hook runtime contract입니다. 하지
            않는 주장: hook이 permission을 우회하거나 사용자 script가 본질적으로
            신뢰 가능하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
