import { Link } from "react-router-dom";
import ExtensionBoundaryViz from "./viz/ExtensionBoundaryViz";
import EvaluationStackViz from "./viz/EvaluationStackViz";
import { CitationBlock } from "@/components/ui/citation";

export default function HooksSkills() {
  return (
    <section id="hooks-skills" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Hook·Skill·Guardrail·Verifier는 서로 다른 시점과 결정 권한을 가진다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Hook은 tool 전후·session 종료처럼 runtime event에 반드시 실행되는
          deterministic callback입니다. Skill은 model이 특정 작업에 필요할 때
          읽는 지침·reference·script 묶음입니다. Guardrail은
          input·output·action의 정책 위반을 차단하거나 escalate하고, verifier는
          생성된 artifact가 task requirement를 충족했는지 판정합니다. 모두
          “agent를 잘하게 하는 기능”으로 묶으면 어떤 실패를 누가 막는지 알 수
          없습니다.
        </p>
      </div>

      <ExtensionBoundaryViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Policy hook은 권한을 넓히지 않고 기존 capability를 더 제한한다</h3>
        <p className="leading-8">
          Model이 제안한 action은 authentication·authorization·schema
          validation을 통과해야 하며, hook이 policy를 우회해 새 권한을 부여하면
          안 됩니다. Pre-hook은 deny·redact·require approval처럼 tighten-only로
          동작하게 하고, post-hook은 receipt·telemetry·sanitization을
          담당합니다. 외부 side effect의 최종 권한은 runtime이 소유해야 합니다.
        </p>

        <h3>Skill은 progressive disclosure와 독립 평가가 필요하다</h3>
        <p className="leading-8">
          모든 skill 본문을 항상 system context에 넣으면 관련 없는 지침이
          충돌하고 context 비용이 커집니다. 이름·설명으로 발견한 뒤 필요한
          reference만 읽고, skill을 쓴 run과 쓰지 않은 run을 같은 task set에서
          비교해야 합니다. 파일 구조와 loading 방식은
          <Link to="/ai/skills-anatomy"> Skills 정본 글</Link>,
          목표·권한·복구·평가를 묶는 상위 구조는{" "}
          <Link to="/ai/llm-harness"> LLM 하네스 정본 글</Link>에서 다룹니다.
        </p>
      </div>

      <EvaluationStackViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          평가는 final answer뿐 아니라 trajectory와 side effect를 함께 본다
        </h3>
        <p className="leading-8">
          Code-based grader는 schema·test·state invariant를, model-based
          grader는 open-ended quality rubric을, human review는 고위험·주관적
          판단을 맡길 수 있습니다. Tool call trace, permission decision,
          artifact diff와 비용을 함께 남겨야 같은 정답을 우연히 낸 run과
          안전하고 재현 가능하게 해결한 run을 구분할 수 있습니다.
        </p>
        <div id="paper-anthropic-agent-evals" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="Anthropic — Demystifying evals for AI agents"
            citeKey={5}
            href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
          >
            Agent evaluation에서 final outcome과 observable trajectory를 나누고
            code-based·model-based·human grader를 조합하는 기준을 설명합니다.
            Judge score 하나가 side effect 안전성이나 모든 production failure를
            대신 검증한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
