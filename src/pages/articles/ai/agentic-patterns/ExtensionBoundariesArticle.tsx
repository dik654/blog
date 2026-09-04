import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { ExtensionAuthorityViz } from "./viz/ModernAgentPatternViz";

export default function ExtensionBoundariesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Hook·Skill·Guardrail·Verifier는 같은 확장 기능이 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">네 기능을 모두 “agent를 더 잘하게 하는 plugin”으로 부르면 실패를 누가 막아야 하는지 흐려집니다. 먼저 실행 시점, 제공 정보, 정책 결정, 결과 합격의 네 질문으로 분리합니다.</p>
        </div>
        <TermBreakdown title="이름 하나마다 decision owner를 붙입니다" description="정의와 경계를 먼저 익힌 뒤 아래 도형에서 한 run에 조합합니다." items={[
          { term: "Hook", description: "Tool 전후·session 종료 같은 runtime event에 자동 실행되는 deterministic callback입니다.", example: "Pre-hook이 secret pattern을 redact합니다.", boundary: "새 tool capability나 사용자 권한을 발급하지 않습니다." },
          { term: "Skill", description: "특정 작업에 필요할 때 읽는 instruction·reference·script 묶음입니다.", example: "DB migration 순서와 검증 command를 제공합니다.", boundary: "지식 묶음이지 실행 authorization이 아닙니다." },
          { term: "Guardrail", description: "Input·output·action이 policy를 위반하면 deny·redact·approval로 막습니다.", example: "Production write를 fresh approval 상태로 보냅니다.", boundary: "Artifact가 기능적으로 맞는지는 판정하지 않습니다." },
          { term: "Verifier", description: "생성된 artifact가 schema·test·invariant·rubric을 충족하는지 평가합니다.", example: "Migration 뒤 row-count invariant와 rollback test를 검사합니다.", boundary: "Policy authorization이나 capability 부여를 대신하지 않습니다." },
        ]} />
        <ExtensionAuthorityViz />
        <ContentBoundary article="agent-extension-boundaries" />
      </section>

      <section id="hook" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Hook은 event에 붙지만 authority를 넓히지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Pre-hook</strong><br />입력을 정규화하거나 redact하고, 기존 policy보다 더 제한적인 deny·approval을 적용합니다.</p>
          <p><strong>Post-hook</strong><br />Effect receipt·telemetry·sanitized result를 남깁니다.</p>
          <p>Hook이 policy를 우회해 새 resource를 열거나 실패한 write를 성공으로 바꾸면 callback이 authorization owner를 침범합니다.</p>
        </div>
      </section>

      <section id="skill-guardrail" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Skill은 절차를 제공하고 Guardrail은 허용 범위를 줄입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Skill은 name·description으로 먼저 발견하고 선택된 뒤에 본문과 필요한 reference만 읽는 progressive disclosure를 따릅니다. 모든
            skill을 항상 system context에 넣으면 관련 없는 지침 충돌과 token 비용이 커집니다.
          </p>
          <p>Guardrail은 skill의 설명을 신뢰해 권한을 넓히지 않습니다. 실제 identity·resource·operation과 approval을 runtime policy로 다시 판정합니다. 작성 형식은 <Link to="/ai/skills-anatomy">Skills anatomy</Link>에서 이어집니다.</p>
        </div>
      </section>

      <section id="verifier" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Verifier는 final answer뿐 아니라 artifact·trajectory·effect를 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Artifact verifier</strong><br />Schema·compiler·test·state invariant를 검사합니다.</p>
          <p><strong>Trajectory verifier</strong><br />Tool call·permission decision·retry·cost가 허용 경로를 따랐는지 확인합니다.</p>
          <p><strong>Effect verifier</strong><br />외부 상태 변경의 receipt와 rollback·idempotency를 확인합니다.</p>
          <p>
            Open-ended quality는 model grader와 human review를 보조로 쓸 수 있지만 judge score 하나가 결정적 side-effect 검사를
            대신하지 않습니다.
          </p>
        </div>
        <div id="paper-anthropic-agent-evals" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock source="Anthropic — Demystifying evals for AI agents" citeKey={5} href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents">Final outcome과 observable trajectory를 나누고 code-based·model-based·human grader를 조합하는 기준을 설명합니다. Judge score 하나가 모든 production failure와 side-effect 안전성을 보장한다는 뜻은 아닙니다.</CitationBlock>
        </div>
      </section>
    </div>
  );
}
