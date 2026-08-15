import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { PermissionDecisionViz } from "../claude-code/viz/ModernClaudeCodeViz";

export default function ClaudeCodePermissionsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="decision-order" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Tool registry와 permission decision은 다른 층입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Model이 tool 이름과 schema를 볼 수 있다는 사실은 그 concrete call이
            허용됐다는 뜻이 아닙니다. Current identity·resource·operation에 맞는
            deny·ask·allow rule과 hook decision을 runtime이 적용합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 call을 판단하는 네 대상"
          items={[
            {
              term: "Registry",
              description:
                "Model이 제안할 수 있는 tool name과 input shape입니다.",
              example: "Bash command schema를 보여줍니다.",
              boundary: "실행 permission이 아닙니다.",
            },
            {
              term: "Deny",
              description: "Matching call을 먼저 차단하는 rule category입니다.",
              example: "Production credential read를 거부합니다.",
              boundary:
                "더 구체적인 allow가 넓은 deny를 자동으로 뒤집지 않습니다.",
            },
            {
              term: "Ask",
              description: "사용자의 fresh decision을 기다리는 경계입니다.",
              example: "Source edit 전에 target diff 승인을 요청합니다.",
              boundary: "과거 승인을 다른 target에 재사용하면 안 됩니다.",
            },
            {
              term: "Allow",
              description: "Rule상 자동 실행 가능한 concrete call입니다.",
              example: "정해진 test command를 허용합니다.",
              boundary: "명령의 정확성·안전성을 보장하지 않습니다.",
            },
          ]}
        />
        <PermissionDecisionViz />
        <ContentBoundary article="claude-code-permissions" />
      </section>
      <section id="precedence" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Deny → ask → allow를 순서 있는 판정으로 읽습니다
        </h2>
        <ExplainedFormula
          question="한 tool call c의 permission 결과는 어떤 순서로 정해지나요?"
          idea={
            <p>
              Deny match를 먼저 보고, 없을 때 ask, 그마저 없을 때 allow를
              적용하며 어느 것도 맞지 않으면 기본 decision으로 보냅니다.
            </p>
          }
          formula={String.raw`D(c)=\begin{cases}\mathrm{deny}&m_d(c)\\\mathrm{ask}&\neg m_d(c)\land m_q(c)\\\mathrm{allow}&\neg m_d(c)\land\neg m_q(c)\land m_a(c)\end{cases}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{m_d(c)}_{\text{먼저 검사}}&\Rightarrow\mathrm{deny}\\\underbrace{\neg m_d(c)}_{\text{deny 없음}}\land m_q(c)&\Rightarrow\mathrm{ask}\\\neg m_d(c)\land\neg m_q(c)&\Rightarrow\text{allow 검사}\\\underbrace{m_a(c)}_{\text{allow match}}&\Rightarrow\mathrm{allow}\end{aligned}`}
          operations={[
            {
              expression: String.raw`m_d(c)`,
              annotation: [
                "Concrete call이 deny와 맞으면",
                "후속 allow를 보지 않고 차단",
              ],
            },
            {
              expression: String.raw`\neg m_d(c)\land m_q(c)`,
              annotation: [
                "Deny가 없고 ask가 맞을 때",
                "fresh user decision 대기",
              ],
            },
            {
              expression: String.raw`\neg m_d(c)\land\neg m_q(c)\land m_a(c)`,
              annotation: ["상위 category가 없을 때만", "allow rule 적용"],
            },
          ]}
          terms={[
            {
              symbol: "c",
              name: "Concrete call",
              description:
                "Tool name·argument·target을 포함한 현재 요청입니다.",
            },
            {
              symbol: "D(c)",
              name: "Permission decision",
              description: "현재 call의 deny·ask·allow 결과입니다.",
            },
            {
              symbol: "m_d",
              name: "Deny match",
              description: "Deny category에 맞으면 1입니다.",
            },
            {
              symbol: "m_q",
              name: "Ask match",
              description: "Approval이 필요한 ask category에 맞으면 1입니다.",
            },
            {
              symbol: "m_a",
              name: "Allow match",
              description: "Allow category에 맞으면 1입니다.",
            },
          ]}
          assumptions={[
            "Rule category precedence는 현재 공식 문서를 기준으로 합니다.",
            "Current identity와 managed policy가 이미 선택돼 있습니다.",
            "Permission allow 뒤에도 blocking hook과 executor failure가 남습니다.",
          ]}
          interpretation="Bash(*) deny와 Bash(npm test:*) allow가 동시에 맞으면 첫 행이 선택되어 test도 deny됩니다."
        />
      </section>
      <section id="sandbox-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Permission은 OS·container·network sandbox 전체가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            File tool rule만으로 Bash subprocess의 모든 file 접근을 막았다고 볼
            수 없습니다. Credential scope·filesystem sandbox·network
            policy·external service authorization을 별도 층으로 둡니다.
            PreToolUse hook가 allow를 반환해도 matching deny·ask를 우회하지
            못하며, blocking hook는 permission상 허용된 call도 막을 수 있습니다.
          </p>
        </div>
      </section>
      <section id="paper-claude-permissions" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — Configure permissions"
            citeKey={1}
            href="https://code.claude.com/docs/en/permissions"
          >
            문제: model이 제안한 action을 조직·project policy에 따라
            차단·승인·허용해야 합니다. 기여: 공식 문서는 rule matching·category
            precedence·permission mode·hook 관계를 설명합니다. 전제: 현재
            client와 settings·managed policy입니다. 근거 범위: Claude Code
            host가 적용하는 permission decision입니다. 하지 않는 주장: allow가
            command의 안전성을 보증하거나 permission만으로 OS·network 격리가
            완성된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
