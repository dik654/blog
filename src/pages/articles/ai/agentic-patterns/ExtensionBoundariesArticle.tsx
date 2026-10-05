import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import CodePanel from "@/components/ui/code-panel";
import { CitationBlock } from "@/components/ui/citation";
import { ExtensionAuthorityViz } from "./viz/ModernAgentPatternViz";
import modelSource from "./extensionBoundaryModel.ts?raw";
import { runExtensionBoundary } from "./extensionBoundaryModel";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

const accepted = runExtensionBoundary({
  resource: " PROD/CUSTOMERS ",
  approval: "APR-42",
  expectedRows: 1200,
  observedRows: 1200,
  rollbackPassed: true,
});
const denied = runExtensionBoundary({
  resource: " PROD/CUSTOMERS ",
  approval: null,
  expectedRows: 1200,
  observedRows: 1200,
  rollbackPassed: true,
});
const rejected = runExtensionBoundary({
  resource: " PROD/CUSTOMERS ",
  approval: "APR-42",
  expectedRows: 1200,
  observedRows: 1199,
  rollbackPassed: true,
});

export default function ExtensionBoundariesArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">1. 운영 DB의 열 하나를 바꾸는 요청부터 봅니다</h2>
        <div className={prose}>
          <p>고객 표의 <code>status</code> 열을 운영 DB에 추가해 달라는 요청이 들어왔다고 합시다. 작업 설명에는 백업하고, migration을 실행하고, 1,200행을 확인한 뒤 rollback도 시험하라고 적혀 있습니다. 승인 번호는 <code>APR-42</code>입니다.</p>
          <p>에이전트가 이 절차를 정확히 읽었다고 해서 운영 DB를 바꿀 권한까지 얻은 것은 아닙니다. 승인이 유효해도 실행 뒤 1,199행만 남았다면 결과가 맞는 것도 아닙니다. 요청 전후에 자동으로 기록을 남겼다고 해서 이 두 판정이 대신 끝난 것도 아닙니다.</p>
          <p>이 한 요청을 끝까지 따라가며 네 책임을 분리합니다. Hook은 정해진 사건에 반응하고, Skill은 작업 방법을 알려 주며, Guardrail은 실행을 허용하거나 막고, Verifier는 생긴 결과를 받아들일지 판정합니다.</p>
        </div>
      </section>

      <section id="predict" data-teach-level="B" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">2. 실행 전에 세 결과를 예측합니다</h2>
        <div className={prose}>
          <ol>
            <li><strong>승인 번호가 없다면</strong> migration 실행 기록이 생겨야 할까요?</li>
            <li><strong>승인은 맞지만 1,199행만 남았다면</strong> 정책 통과와 결과 합격 중 무엇이 실패할까요?</li>
            <li><strong>Skill에 “운영 쓰기를 허용한다”라고 적혀 있다면</strong> 그 문장만으로 권한이 생길까요?</li>
          </ol>
          <p>답은 각각 실행 전 거부, 실행 뒤 결과 불합격, 권한 변화 없음입니다. 뒤의 실제 코드와 실패 표에서 같은 답이 나오는지 확인합니다.</p>
        </div>
      </section>

      <section id="map" data-teach-level="0" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">3. 네 장치는 서로 다른 질문에 답합니다</h2>
        <div className={prose}>
          <p>Hook의 질문은 “어느 사건 전후에 자동으로 무엇을 할까”입니다. Skill은 “이 일을 어떤 순서와 자료로 할까”, Guardrail은 “이 identity가 이 resource에 이 operation을 해도 되는가”, Verifier는 “실제 결과가 합격 조건을 만족했는가”를 묻습니다.</p>
          <p>네 장치는 한 run에서 이어질 수 있지만 서로의 답을 대신하지 않습니다. 아래 그림은 실행 순서를 단순화한 지도입니다. 실제 제품에서는 Hook이 여러 시점에 다시 등장할 수 있고 Guardrail도 입력·tool·출력 경계마다 있을 수 있습니다.</p>
        </div>
        <ExtensionAuthorityViz />
      </section>

      <section id="hook" data-teach-level="1" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">4. Hook은 사건에 붙는 자동 반응입니다</h2>
        <div className={prose}>
          <p>사례의 첫 Hook은 resource 문자열의 앞뒤 공백을 없애고 소문자로 맞춥니다. tool 실행 뒤 Hook은 receipt를 감사 기록에 남길 수 있습니다. 같은 입력에 같은 변환을 적용하는 작은 함수로 만들면 재현하기 쉽지만, Hook이라는 이름 자체가 결정성을 보장하지는 않습니다. 임의 코드·네트워크·시각을 읽는 Hook은 흔들릴 수 있습니다.</p>
          <p>Hook이 할 수 있다는 사실과 해도 된다는 사실도 다릅니다. Hook이 숨겨진 credential을 붙여 원래 없던 권한을 만들면 event callback이 authorization 경계를 침범합니다. Hook의 실행 계정과 접근 범위는 runtime policy가 따로 제한해야 합니다.</p>
        </div>
      </section>

      <section id="skill" data-teach-level="2" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">5. Skill은 절차와 참고 자료를 필요할 때 펼칩니다</h2>
        <div className={prose}>
          <p>이 사례의 Skill은 <code>backup → migrate → count → rollback-test</code> 순서를 제공합니다. 이름과 설명으로 후보를 찾고, 선택됐을 때 본문을 읽으며, 필요한 경우에만 schema나 script를 더 읽는 progressive disclosure를 쓰면 관련 없는 자료가 매 요청의 context를 차지하지 않습니다.</p>
          <p>Skill은 잘못된 절차를 담을 수 있고 저장소에서 바뀔 수도 있습니다. 그러므로 version과 출처를 고정하고, 외부에서 받은 Skill은 실행 가능한 공급망 입력으로 검토해야 합니다. “운영 쓰기를 허용한다”라는 문장이 들어 있어도 실제 identity·resource·approval 판정을 바꾸지는 못합니다.</p>
        </div>
      </section>

      <section id="guardrail" data-teach-level="3" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">6. Guardrail은 실행 전후의 정책 경계를 소유합니다</h2>
        <div className={prose}>
          <p>사례의 tool input Guardrail은 정규화된 resource가 <code>prod/customers</code>이고 approval이 <code>APR-42</code>인지 확인합니다. 둘 중 하나라도 다르면 executor를 부르기 전에 거부합니다. 승인 없는 실행에서 <code>effectStarted</code>가 false여야 하는 이유입니다.</p>
          <p>검사를 agent와 동시에 돌리면 지연은 줄 수 있지만 거부가 나오기 전에 model이 token을 쓰거나 tool이 시작될 수 있습니다. 부작용을 절대로 먼저 시작하면 안 되는 경계라면 blocking 검사가 필요합니다. 어느 시점의 어떤 Guardrail인지가 “Guardrail이 있다”는 말보다 중요합니다.</p>
        </div>
      </section>

      <section id="verifier" data-teach-level="4" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">7. Verifier는 말이 아니라 결과 상태를 확인합니다</h2>
        <div className={prose}>
          <p>승인이 통과하면 executor가 migration을 실행하고 effect receipt <code>fx-9001</code>을 남깁니다. 그다음 Verifier가 실제 행 수 1,200과 rollback 시험을 확인합니다. 행 수가 1,199이면 action은 authorized였지만 artifact는 rejected입니다.</p>
          <p>최종 답에 “성공했다”가 적혀 있는지만 보는 model judge로 이 검사를 바꾸면 외부 상태의 거짓 완료를 놓칠 수 있습니다. Schema·compiler·test·DB invariant처럼 결정적으로 검사할 수 있는 항목은 코드 기반 검사를 우선하고, 열린 품질은 model grader와 사람 검토를 보조로 조합합니다.</p>
        </div>
      </section>

      <section id="trace" data-teach-level="4" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">8. 같은 요청의 세 경로를 한 표에서 추적합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border/60">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead><tr className="border-b border-border/60"><th className="p-3">입력</th><th className="p-3">마지막 단계</th><th className="p-3">effect</th><th className="p-3">결과</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/40"><td className="p-3">APR-42 · 1,200행</td><td className="p-3">{accepted.trace.at(-1)?.stage}: {accepted.trace.at(-1)?.decision}</td><td className="p-3">시작</td><td className="p-3 font-semibold">accepted</td></tr>
              <tr className="border-b border-border/40"><td className="p-3">승인 없음 · 1,200행</td><td className="p-3">{denied.trace.at(-1)?.stage}: {denied.trace.at(-1)?.decision}</td><td className="p-3">시작 안 함</td><td className="p-3 font-semibold">denied</td></tr>
              <tr><td className="p-3">APR-42 · 1,199행</td><td className="p-3">{rejected.trace.at(-1)?.stage}: {rejected.trace.at(-1)?.decision}</td><td className="p-3">시작</td><td className="p-3 font-semibold">rejected</td></tr>
            </tbody>
          </table>
        </div>
        <div className={prose}>
          <p>거부와 불합격은 같은 실패가 아닙니다. denied는 effect 전에 멈췄고, rejected는 effect 뒤 결과가 기준을 통과하지 못했습니다. 후자는 rollback·격리·사람 escalation 같은 복구 상태를 추가로 가져야 합니다.</p>
        </div>
      </section>

      <section id="code" data-teach-level="5" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">9. 실제 TypeScript에서 decision owner를 분리합니다</h2>
        <div className={prose}>
          <p>아래 파일은 이 글이 직접 실행한 작은 reference model입니다. Hook은 문자열만 정규화하고, Skill은 절차를 trace에 넣고, Guardrail은 executor 앞에서 return하며, Verifier는 effect receipt 뒤의 상태를 판정합니다. 각 단계가 하나의 status를 몰래 덮어쓰지 않습니다.</p>
        </div>
        <CodePanel title="extensionBoundaryModel.ts · 실행한 전체 원문" code={modelSource} defaultOpen />
        <div className={prose}>
          <p>Node 24.13.0에서 정상·승인 누락·행 수 불일치 세 fixture를 실행했습니다. 결과는 각각 accepted·denied·rejected였고, 승인 누락 경로는 세 단계에서 끝나 executor와 verifier가 trace에 생기지 않았습니다. 이 model은 설명용 정책이며 실제 DB·credential·approval service를 호출한 검증은 아닙니다.</p>
        </div>
      </section>

      <section id="failure-matrix" data-teach-level="5" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">10. 네 책임을 섞으면 실패 위치가 사라집니다</h2>
        <TermBreakdown title="이름보다 소유한 판정을 확인합니다" description="같은 migration 사례에서 각 장치가 할 일과 넘지 말아야 할 경계입니다." items={[
          { term: "Hook · 사건 반응", description: "tool 전후나 session 종료 같은 event에 자동 실행됩니다.", example: "resource 정규화·receipt 기록", boundary: "credential을 붙여 capability를 넓히지 않습니다." },
          { term: "Skill · 작업 지식", description: "필요할 때 읽는 instruction·reference·script 묶음입니다.", example: "backup→migrate→count→rollback-test", boundary: "지침 문장이 authorization을 만들지 않습니다." },
          { term: "Guardrail · 정책 판정", description: "identity·resource·operation·approval을 보고 deny·redact·allow를 결정합니다.", example: "APR-42와 prod/customers를 executor 전에 확인", boundary: "허용된 실행의 결과가 옳다는 뜻은 아닙니다." },
          { term: "Verifier · 합격 판정", description: "artifact·trajectory·effect receipt가 success criterion을 만족하는지 봅니다.", example: "1,200행과 rollback 시험", boundary: "정책 권한이나 새 capability를 부여하지 않습니다." },
        ]} />
        <div className={prose}>
          <p>하나의 callback이 네 일을 모두 하면 “성공” 한 단어가 승인·실행·검증 중 무엇을 뜻하는지 알 수 없습니다. 단계별 입력, 판정, receipt를 분리하면 최소 권한을 적용하고 실패 뒤 재시작 위치도 찾을 수 있습니다.</p>
        </div>
      </section>

      <section id="sources" data-teach-level="6" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">11. 제품 문서의 실제 경계를 사례에 대입합니다</h2>
        <div id="paper-agent-skills" className="not-prose scroll-mt-24">
          <CitationBlock source="Anthropic — Agent Skills" citeKey={1} href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">Skill이 metadata, 지침, 필요한 resource 순으로 펼쳐지는 구조와 신뢰할 수 없는 Skill의 위험을 확인했습니다. 이 설명은 모든 agent 제품이 같은 파일 형식과 로딩 시점을 쓴다는 뜻은 아닙니다.</CitationBlock>
        </div>
        <div id="paper-openai-guardrails" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock source="OpenAI Agents SDK — Guardrails" citeKey={2} href="https://openai.github.io/openai-agents-python/guardrails/">Input·output·tool guardrail의 실행 시점과 parallel·blocking 실행의 차이를 확인했습니다. 이 글의 APR-42 정책은 문서에 있는 예제가 아니라 그 경계를 설명하기 위한 자체 fixture입니다.</CitationBlock>
        </div>
        <div id="paper-anthropic-agent-evals" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock source="Anthropic — Demystifying evals for AI agents" citeKey={3} href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents">Transcript와 environment outcome을 나누고 code·model·human grader를 조합하는 기준을 확인했습니다. 1,200행 검사는 이 원칙을 작은 DB invariant에 적용한 자체 사례입니다.</CitationBlock>
        </div>
      </section>

      <section id="limits" data-teach-level="7" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">12. 이 분류가 보장하지 않는 것을 남깁니다</h2>
        <div className={prose}>
          <p>제품마다 Hook과 Guardrail의 이름과 실행 시점이 다릅니다. Hosted tool·handoff·MCP tool이 같은 pipeline을 거친다고 가정하면 안 됩니다. 공식 문서와 실제 runtime trace에서 어느 호출에 어느 검사가 붙는지 확인해야 합니다.</p>
          <p>이 글은 정책 자체가 올바른지, approval 발급자가 믿을 만한지, verifier가 모든 손상을 잡는지 증명하지 않습니다. TOCTOU, partial effect, 재시도 중복, credential 유출, 악성 Skill 공급망은 별도의 threat model과 복구 계약이 필요합니다.</p>
          <p>Skill 작성 형식은 <Link to="/cs/ai/skills-anatomy">Skills anatomy</Link>, 전체 실행 통제는 <Link to="/cs/ai/llm-harness">LLM harness</Link>, artifact·trajectory·effect 검증은 <Link to="/cs/ai/agent-verification">Agent verification</Link>에서 이어집니다.</p>
        </div>
        <ContentBoundary article="agent-extension-boundaries" />
      </section>

      <section id="prediction-review" data-teach-level="7" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold">13. 처음의 세 예측을 상태 이름으로 다시 답합니다</h2>
        <div className={prose}>
          <p>승인 번호가 없으면 Guardrail에서 denied가 되어 effect를 시작하지 않습니다. 승인은 맞지만 1,199행이면 정책은 통과했어도 Verifier에서 rejected입니다. Skill에 권한을 주장하는 문장이 있어도 runtime capability는 넓어지지 않습니다.</p>
          <p>새 확장 기능을 만났을 때 이름부터 외우지 말고 네 칸을 적어 보세요. 언제 실행되는가, 어떤 정보를 제공하는가, 누가 action을 허용하는가, 어떤 evidence로 결과를 합격시키는가입니다. 한 칸의 답이 다른 칸까지 대신하고 있다면 경계가 섞였을 가능성이 큽니다.</p>
        </div>
      </section>
    </article>
  );
}
