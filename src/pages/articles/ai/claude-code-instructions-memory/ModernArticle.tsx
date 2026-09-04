import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { InstructionMemoryViz } from "../claude-code/viz/ModernClaudeCodeViz";

export default function ClaudeCodeInstructionsMemoryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="instruction-order" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          CLAUDE.md와 auto memory는 context source입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Instruction은 model이 현재 판단에 참고하는 글입니다. Permission이나 sandbox처럼 action을 강제하는 설정이 아닙니다. 먼저 누가 썼고 어느
            scope에 있고 언제 load되는지를 분리합니다.
          </p>
        </div>
        <TermBreakdown
          title="서로 owner가 다른 context source"
          items={[
            {
              term: "CLAUDE.md",
              description: "사용자·팀·조직이 반복해서 지킬 규칙을 씁니다.",
              example: "Build command와 repository convention을 적습니다.",
              boundary: "Runtime permission이 아닙니다.",
            },
            {
              term: "Path rule",
              description:
                "특정 subtree나 file pattern에만 필요한 instruction입니다.",
              example: "auth path를 열 때 security rule을 추가합니다.",
              boundary:
                "관련 path가 발견되기 전에는 load되지 않을 수 있습니다.",
            },
            {
              term: "Auto memory",
              description:
                "Claude가 correction·pattern에서 저장한 repository별 note입니다.",
              example: "자주 쓰는 test command를 기억합니다.",
              boundary: "사용자가 검토한 정본과 동일하지 않습니다.",
            },
            {
              term: "Compaction",
              description:
                "긴 conversation의 오래된 detail을 줄여 context를 확보합니다.",
              example: "Tool output을 비우고 conversation을 요약합니다.",
              boundary:
                "초기 대화의 세부 instruction이 보존된다는 보장은 없습니다.",
            },
          ]}
        />
        <InstructionMemoryViz />
        <ContentBoundary article="claude-code-instructions-memory" />
      </section>
      <section id="load-order" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Broad scope에서 path-specific source로 context를 조립합니다
        </h2>
        <ExplainedFormula
          question="현재 file을 읽을 때 어떤 instruction이 context에 합쳐지나요?"
          idea={
            <p>
              전역·개인·project source를 먼저 잇고 현재 file에 맞는 nested rule과 repository memory를 뒤에 연결합니다.
            </p>
          }
          formula={String.raw`X=M\mathbin{\Vert}U\mathbin{\Vert}P\mathbin{\Vert}N_f\mathbin{\Vert}A`}
          annotatedFormula={String.raw`\begin{aligned}X&=\underbrace{M\mathbin{\Vert}U}_{\text{조직·개인 scope}}\\&\quad\mathbin{\Vert}\underbrace{P\mathbin{\Vert}N_f}_{\text{project·현재 path}}\\&\quad\mathbin{\Vert}\underbrace{A}_{\text{repository auto memory}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M\mathbin{\Vert}U`,
              annotation: ["넓은 scope의 source를", "load order대로 연결"],
            },
            {
              expression: String.raw`P\mathbin{\Vert}N_f`,
              annotation: [
                "Project 규칙과 현재 file의",
                "path rule을 이어 붙임",
              ],
            },
            {
              expression: String.raw`\mathbin{\Vert}A`,
              annotation: ["Claude가 저장한 memory를", "별도 source로 추가"],
            },
          ]}
          terms={[
            {
              symbol: "X",
              name: "Current context",
              description:
                "이번 model call이 실제로 읽는 instruction context입니다.",
            },
            {
              symbol: "M",
              name: "Managed source",
              description: "조직 관리자가 배포한 instruction입니다.",
            },
            {
              symbol: "U",
              name: "User source",
              description: "개인 범위의 instruction입니다.",
            },
            {
              symbol: "P",
              name: "Project source",
              description: "Repository가 공유하는 instruction입니다.",
            },
            {
              symbol: "N_f",
              name: "Nested source",
              description: "현재 file f에 해당하는 path-specific rule입니다.",
            },
            {
              symbol: "A",
              name: "Auto memory",
              description: "Repository별로 Claude가 기록한 note입니다.",
            },
          ]}
          assumptions={[
            "각 source의 owner와 scope를 식별할 수 있습니다.",
            "기호 ∥는 overwrite가 아니라 ordered context concatenation입니다.",
            "실제 load 여부는 /context나 InstructionsLoaded event로 확인합니다.",
          ]}
          interpretation="X에 금지 문장이 있어도 tool 실행을 차단하려면 별도 permission·hook·credential boundary가 필요합니다."
        />
      </section>
      <section id="memory-compaction" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          항상 지킬 규칙과 Claude가 배운 note를 같은 저장소로 보지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현재 문서상 CLAUDE.md는 사용자가 작성하고 auto memory는 Claude가
            작성합니다. 두 source 모두 conversation 시작에 context로 들어가지만
            owner와 audit 방법이 다릅니다. Auto memory는 첫 200줄 또는
            25KB까지만 load되므로 중요한 조직 정책을 밀어 넣는 저장소가
            아닙니다. Compaction 뒤에도 필요한 규칙은 짧고 구체적인
            instruction으로 유지하고 실제 context를 점검합니다.
          </p>
        </div>
      </section>
      <section id="paper-claude-memory" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — How Claude remembers your project"
            citeKey={1}
            href="https://code.claude.com/docs/en/memory"
          >
            문제: session 사이 persistent instruction과 Claude가 발견한 note를
            구분해야 합니다. 기여: 공식 문서는 CLAUDE.md·path rule·auto memory의
            owner·scope·load behavior를 설명합니다. 전제: 현재 client와 settings
            scope입니다. 근거 범위: 공개된 context loading 계약입니다. 하지 않는
            주장: instruction이 permission을 강제하거나 auto memory가 검토된
            project 정본이라는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
