import TermBreakdown from "@/components/articles/term-breakdown";
import { PromptRegressionViz } from "./viz/PromptContractViz";

export default function AntiPatterns() {
  return (
    <section id="anti-patterns" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        안티패턴은 문장 취향이 아니라 재현 가능한 실패 유형으로 분류한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          긴 prompt가 항상 나쁜 것은 아닙니다. 실제 문제는 objective가 모호하거나
          우선순위가 충돌하고, 같은 규칙이 다른 표현으로 반복되며, evidence와
          instruction이 섞이고, 완료·거부 조건이 빠진 상태입니다. “전문가처럼
          행동하라”는 role 문장도 관점을 좁힐 수는 있지만 model에 없는 지식이나
          permission을 만들지는 못합니다.
        </p>
        <p>
          부정형 지시를 모두 없애야 한다는 규칙도 과합니다. 보안·정책 경계에는
          명시적 금지가 필요하지만, 금지 뒤에 허용되는 대안과 typed refusal을 함께
          적어 다음 행동을 분명히 해야 합니다. 예를 들어 PII를 출력하지 말라는
          규칙과 함께 aggregate만 반환하고 원문이 필요하면 승인을 요청하게 합니다.
        </p>
      </div>

      <TermBreakdown
        title="실패를 문장 취향이 아니라 고칠 계층으로 분류합니다"
        description="분류가 끝나야 prompt를 고칠지, evidence·decoder·runtime을 고칠지 결정할 수 있습니다."
        items={[
          {
            term: "Instruction failure",
            description: "목표·우선순위·완료 조건이 모호하거나 서로 충돌한 상태입니다.",
            example: "'짧고 빠짐없이 자세히'처럼 동시에 만족할 기준이 없는 요청입니다.",
            boundary: "필요한 사실 자체가 없으면 instruction을 길게 써도 해결되지 않습니다.",
          },
          {
            term: "Evidence failure",
            description: "판정에 필요한 source가 request에 없거나 신뢰 범위가 표시되지 않은 상태입니다.",
            example: "최신 주문 상태가 필요한데 주문 API 결과 없이 답을 요구합니다.",
            boundary: "이 경우 RAG·tool·database lookup이 필요하며 role prompt는 지식을 만들지 못합니다.",
          },
          {
            term: "Enforcement failure",
            description: "형식·권한·외부 effect를 자연어 instruction만으로 막으려는 상태입니다.",
            example: "'고객 정보를 보내지 마'라고 쓰고 send tool에는 실제 authorization을 두지 않습니다.",
            boundary: "Schema는 형식을, runtime policy는 권한과 egress를 각각 강제해야 합니다.",
          },
        ]}
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실패 원인에 맞는 계층을 고친다</h3>
        <p>
          Vague instruction은 objective와 completion criteria를 고치고, 근거 부족은
          RAG나 tool을 붙이며, syntax 실패는 schema와 constrained decoding을
          적용합니다. 권한 오류나 data exfiltration 위험은 prompt 문장을 늘리는
          대신 runtime policy에서 차단해야 합니다. 원인이 다른데 prompt만 계속
          길게 만들면 context pollution과 충돌이 늘어납니다.
        </p>
      </div>

      <div className="not-prose my-8"><PromptRegressionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Prompt·model·template·decoding을 함께 versioning한다</h3>
        <p>
          Failure trace를 versioned eval case로 저장하고 prompt 한 요소만 바꿔 paired
          comparison을 수행합니다. Trace에는 prompt hash뿐 아니라 model snapshot,
          system message, chat template, tool schema, temperature·top-p·max token을
          기록합니다. 새 model로 옮길 때는 같은 regression suite와 production canary를
          통과한 뒤 traffic을 늘리고, quality·constraint violation·p95 latency·token
          cost 중 하나라도 guardrail을 넘으면 rollback합니다.
        </p>
        <p>
          이 과정을 거치면 prompt engineering은 모델과 말씨를 맞추는 개인 기술이
          아니라 input contract와 evaluator를 함께 관리하는 engineering loop가
          됩니다. 단 한 번의 좋은 demo는 아이디어를 보여 줄 뿐이고, 완료 판정은
          실패 case가 포함된 반복 가능한 evaluation이 맡아야 합니다.
        </p>
      </div>
    </section>
  );
}
