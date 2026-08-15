import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { SubagentHandoffViz } from "../claude-code/viz/ModernClaudeCodeViz";

export default function ClaudeCodeSubagentsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="handoff" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Subagent는 별도 context를 가진 위임 대상입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Main conversation을 복제하는 기능이 아닙니다. Objective·input
            snapshot·tool scope·artifact·verification을 넘기고, 별도 context에서
            나온 summary를 main이 다시 검증하는 handoff입니다.
          </p>
        </div>
        <TermBreakdown
          title="Handoff에서 먼저 고정할 네 소유권"
          items={[
            {
              term: "Input",
              description: "질문과 읽을 source snapshot을 고정합니다.",
              example: "실패 log·auth directory·test ID를 전달합니다.",
              boundary: "Main의 모든 대화를 자동 공유하지 않습니다.",
            },
            {
              term: "Capability",
              description: "허용 tool과 mutation 범위를 좁힙니다.",
              example: "Read·Grep만 허용하고 source edit를 금지합니다.",
              boundary: "Prompt 금지 문구만으로 권한을 막지 않습니다.",
            },
            {
              term: "Artifact",
              description:
                "반환할 source·line·command·uncertainty schema를 정합니다.",
              example: "원인 후보와 재현 command를 JSON receipt로 돌려줍니다.",
              boundary: "자유로운 완료 문장은 검증 receipt가 아닙니다.",
            },
            {
              term: "Verifier",
              description: "Main이 원자료와 결과를 독립 확인합니다.",
              example: "인용 file을 다시 읽고 재현 test를 실행합니다.",
              boundary: "Agent 수가 사실성을 자동 합산하지 않습니다.",
            },
          ]}
        />
        <SubagentHandoffViz />
        <ContentBoundary article="claude-code-subagents" />
      </section>
      <section id="handoff-contract" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          필수 항목이 빠지면 delegation을 시작하지 않습니다
        </h2>
        <ExplainedFormula
          question="검증 가능한 subagent handoff가 완전한지 어떻게 판정하나요?"
          idea={
            <p>
              Objective·input·capability·artifact·verifier를 평균내지 않고 모두
              존재해야 하는 admission gate로 둡니다.
            </p>
          }
          formula={String.raw`H=I_O\land I_X\land I_C\land I_A\land I_V`}
          annotatedFormula={String.raw`\begin{aligned}H&=\underbrace{I_O\land I_X}_{\text{질문·input snapshot}}\\&\quad\land\underbrace{I_C\land I_A}_{\text{권한·반환 artifact}}\\&\quad\land\underbrace{I_V}_{\text{main verifier}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`I_O\land I_X`,
              annotation: ["목표와 읽을 snapshot을", "같은 handoff에 binding"],
            },
            {
              expression: String.raw`I_C\land I_A`,
              annotation: ["실행 범위와 반환 schema를", "서로 분리해 요구"],
            },
            {
              expression: String.raw`\land I_V`,
              annotation: ["Main의 독립 검증 없이는", "delegation 완료 거절"],
            },
          ]}
          terms={[
            {
              symbol: "H",
              name: "Handoff admission",
              description: "필수 contract가 완전하면 1입니다.",
            },
            {
              symbol: "I_O",
              name: "Objective check",
              description: "구체적인 조사 질문이 있으면 1입니다.",
            },
            {
              symbol: "I_X",
              name: "Input check",
              description: "Versioned input snapshot이 있으면 1입니다.",
            },
            {
              symbol: "I_C",
              name: "Capability check",
              description: "Tool·resource·mutation scope가 있으면 1입니다.",
            },
            {
              symbol: "I_A",
              name: "Artifact check",
              description: "반환 schema와 owner가 있으면 1입니다.",
            },
            {
              symbol: "I_V",
              name: "Verifier check",
              description: "Main의 재검증 방법이 있으면 1입니다.",
            },
          ]}
          assumptions={[
            "Subagent는 main과 별도 context에서 실행됩니다.",
            "Shared source writer와 merge owner가 하나로 정해집니다.",
            "반환 artifact에는 source identity가 있습니다.",
          ]}
          interpretation="Read-only 조사라도 main verifier가 없으면 H=0이며 결과를 곧바로 source 변경 근거로 쓰지 않습니다."
        />
      </section>
      <section id="merge-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          병렬화는 input과 output이 독립일 때만 이득입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            UI 오류 경로 조사와 server log 조사는 read-only로 나눌 수 있습니다.
            두 subagent가 같은 file을 동시에 편집하면 writer·merge·verification
            owner가 모호해집니다. Main은 반환 summary가 아니라 실제 source와
            command receipt를 읽은 뒤 최소 diff를 한 writer에게 맡깁니다.
          </p>
        </div>
      </section>
      <section id="paper-claude-subagents" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — Create custom subagents"
            citeKey={1}
            href="https://code.claude.com/docs/en/sub-agents"
          >
            문제: 긴 작업에서 context와 도구 권한·책임을 분리해야 합니다. 기여:
            공식 문서는 subagent별 context·system prompt·tool·permission과 상위
            대화로의 결과 반환을 설명합니다. 전제: 현재 Claude Code subagent
            configuration입니다. 근거 범위: 공개된 delegation interface입니다.
            하지 않는 주장: agent 수가 품질을 자동 높이거나 같은 file의 안전한
            병렬 merge를 보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
