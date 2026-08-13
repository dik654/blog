import { CitationBlock } from "@/components/ui/citation";
import DispatchViz from "./viz/DispatchViz";
import Pipeline5StepViz from "./viz/Pipeline5StepViz";

const CALL_ENVELOPE = [
  ["Identity", "turn ID · call ID · attempt · tool name · source version/instance"],
  ["Contract", "schema dialect/version · schema digest · registry generation"],
  ["Context", "actor · session · canonical workspace · permission mode"],
  ["Budget", "deadline · output limit · cancellation token · idempotency key"],
] as const;

const RESULT_ENVELOPE = [
  ["Succeeded", "typed content · artifact refs · observed effect · test receipt"],
  ["Rejected", "unknown_tool · invalid_input · domain_error · permission_denied"],
  ["Interrupted", "timeout · cancelled · source_restarted · retryable 여부"],
  ["Partial", "이미 생긴 effect · 남은 diff · cleanup/rollback 상태 · needs-review"],
] as const;

export default function Dispatch() {
  return (
    <section id="dispatch" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Dispatch는 이름 조회부터 결과 receipt까지 한 실행 계약으로 묶습니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          로그인 오류 사례에서 모델이 <code>read_file</code>을 제안했다고 해서
          host가 같은 이름의 Rust function을 바로 부르면 안 됩니다. 어느
          source의 어느 schema를 보고 만든 call인지 먼저 고정하고, 구조·의미·권한
          검사를 차례로 통과시킨 뒤에만 executor를 호출해야 합니다. 이 공통
          진입점이 dispatch입니다.
        </p>
        <p>
          Dispatch가 필요한 이유는 built-in, plugin과 MCP마다 검사 순서가 달라지는
          것을 막기 위해서입니다. Tool implementation은 domain logic을 알지만
          session owner가 아니며, permission engine은 policy를 알지만 JSON을
          임의로 고치는 parser가 아닙니다. Call envelope가 이 component들을 같은
          identity로 연결합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <DispatchViz />
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CALL_ENVELOPE.map(([title, body]) => (
          <article key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>구문·schema·domain validation은 서로 다른 질문입니다</h3>
        <p>
          먼저 JSON parser는 문자열이 object로 해석되는지 확인합니다. 그다음 JSON
          Schema validator는 <code>path</code>가 required string인지, mode가 허용된
          enum인지, 미지원 field가 있는지를 registry snapshot의 schema로 검사합니다.
          이 단계는 입력의 모양을 다룰 뿐, <code>../secrets</code>가 workspace 밖을
          가리키는지나 login test command가 state를 바꾸는지는 알지 못합니다.
        </p>
        <p>
          Domain validation에서는 path를 canonicalize하고 file 존재 여부, edit의
          before hash, command와 working directory 같은 application 조건을
          검사합니다. 이어 effect descriptor가 filesystem read/write, process,
          network와 credential 접근 가능성을 arguments에서 계산합니다. Schema를
          통과했더라도 domain 또는 effect 검사가 실패하면 permission layer까지
          보내지 않고 typed error로 끝냅니다.
        </p>
        <p>
          모델 편의를 이유로 unknown field를 버리거나 문자열을 숫자로 몰래
          바꾸면 어떤 contract가 실행됐는지 모호해집니다. 오류에는 secret을
          제외한 instance path, 실패한 keyword, 기대 type과 schema digest를 넣고,
          수정된 call은 새 attempt로 다시 검증합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <Pipeline5StepViz />
      </div>

      <div
        id="paper-json-schema"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · JSON Schema Validation</p>
        <CitationBlock
          source="JSON Schema Draft 2020-12 — Validation vocabulary"
          citeKey={2}
          href="https://json-schema.org/draft/2020-12/json-schema-validation"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> JSON instance가 tool input contract의 type·required·enum·길이·object 제약을 만족하는지 구현 언어와 분리해 표현할 방법이 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Validation vocabulary는 instance 구조에 assertion을 적용하고 어느 위치가 어떤 keyword를 위반했는지 표현하는 공통 규칙을 정의합니다.</p>
            <p><strong>전제·조건:</strong> 선택한 dialect와 vocabulary 지원 범위를 고정해야 하며, <code>format</code>은 구성에 따라 annotation일 뿐 assertion이 아닐 수 있습니다.</p>
            <p><strong>근거 범위:</strong> 이 절에서 schema validation을 JSON 구조 제약으로 설명하고 domain·permission validation과 분리하는 근거입니다.</p>
            <p><strong>비주장:</strong> Schema 통과가 path 안전성, 사용자 권한, command 무해성, tool implementation correctness를 보장하거나 Claw snapshot이 모든 Draft 2020-12 keyword를 지원한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Result는 model text가 아니라 실행 evidence를 담는 envelope입니다</h3>
        <p>
          Read 결과라면 content와 truncation 여부, source artifact digest를 남기고,
          edit 결과라면 target, before/after digest와 diff reference를 남깁니다.
          Login test는 command, canonical cwd, exit code, 제한된 stdout/stderr와
          duration을 receipt로 돌려줘야 runtime이 “완료”를 evidence로 판정할 수
          있습니다. Exit code가 실패면 patch가 이미 적용됐더라도
          <code>verification_failed</code>이지 완료가 아닙니다. 큰 output과 secret은 artifact storage로 분리하고 model
          context에는 redacted summary와 reference만 넣습니다.
        </p>
        <p>
          아래 envelope는 견고한 구현과 평가를 위해 이 글이 요구하는 contract이며,
          pinned Claw source가 모든 field와 error taxonomy를 그대로 구현했다고
          주장하지 않습니다. 특히 retryable, partial effect, artifact provenance를
          분리하지 않으면 실패 뒤 같은 call을 안전하게 반복하기 어렵습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {RESULT_ENVELOPE.map(([title, body]) => (
          <article key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Timeout·cancel·retry는 이미 생긴 effect부터 확인합니다</h3>
        <p>
          Read가 timeout된 경우에는 같은 snapshot에서 bounded retry할 수 있지만,
          edit가 timeout됐다고 무조건 반복하면 patch가 두 번 적용될 수 있습니다.
          Executor는 cancellation을 child process에 전달하고 종료를 기다리되,
          deadline 뒤 늦게 온 result도 attempt와 generation을 확인한 뒤 받아들입니다.
          완료 여부가 모호하면 같은 idempotency key와 effect receipt로 기존 operation을
          조회한 뒤에만 retry합니다.
          File이 일부만 쓰였다면 <code>partial_effect</code>와 남은 diff를 먼저
          기록하고 rollback 또는 사람 검토가 끝날 때까지 success로 commit하지
          않습니다.
        </p>

        <h3>병렬화는 tool 이름이 아니라 dependency DAG로 결정합니다</h3>
        <p>
          고정 사례를 DAG로 쓰면 <code>read_file(auth.ts)</code>와
          <code>grep_search(401)</code>은 같은 immutable workspace snapshot을 보므로
          병렬 후보이고, <code>edit_file</code>은 두 결과를 모두 dependency로
          받습니다. Login test는 edit receipt 뒤에만 시작합니다. 같은 file을 쓰는
          두 edit는 충돌 가능성이 있어 직렬화해야 합니다.
        </p>
        <p>
          병렬 group은 original call order, shared deadline, cancellation 전파와
          각 call의 effect receipt를 유지해야 합니다. 하나가 실패했을 때 이미
          끝난 read 결과와 side effect를 숨기지 않고, dependent call은
          <code>blocked_by_dependency</code>로 끝냅니다. Partial write가 있었다면
          compensation·rollback 또는 사람 review를 별도 node로 만들고 test를
          실행하지 않습니다. Pinned OpenAI-compatible
          adapter의 test에는 <code>parallel_tool_calls=false</code>가 명시돼 있으므로,
          이 설계를 현재 project 전체의 generic parallel support로 읽어서는 안
          됩니다.
        </p>
      </div>
    </section>
  );
}
