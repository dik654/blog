import { CitationBlock } from "@/components/ui/citation";
import CompactPipelineViz from "./viz/CompactPipelineViz";
import PhaseTransitionViz from "./viz/PhaseTransitionViz";

const ACTUAL_STEPS = [
  [
    "1 · 조건 확인",
    "should_compact",
    "첫 system message가 기존 compact summary라면 계산에서 빼고, 줄일 수 있는 message 수와 거친 token 추정치가 config를 넘는지 확인합니다.",
  ],
  [
    "2 · 최근 구간 계산",
    "preserve_recent_messages",
    "기본 snapshot은 최근 4개 message를 남기지만, ToolResult부터 시작하면 대응하는 ToolUse가 함께 남도록 경계를 뒤로 옮깁니다.",
  ],
  [
    "3 · 규칙 기반 추출",
    "summarize_messages",
    "role별 개수, tool 이름, 최근 user request 3개, pending keyword 문장, file candidate, current work와 message별 160자 timeline을 만듭니다.",
  ],
  [
    "4 · 이어 붙이기",
    "merge + continuation",
    "기존 summary의 highlight와 새 highlight를 평평하게 합치고, 새 timeline만 넣은 synthetic system message 뒤에 recent tail을 붙입니다.",
  ],
  [
    "5 · 기록",
    "record_compaction",
    "새 Session clone의 compaction count를 1씩 늘리고 removed count·summary를 기록합니다. Caller가 이 결과를 채택해야 실제 runtime state가 바뀝니다.",
  ],
] as const;

const TRIGGERS = [
  [
    "Manual · /compact",
    "사용자가 명시적으로 실행",
    "CompactionConfig 기본값(최근 4개, 거친 추정 10,000 token)을 사용합니다. 줄일 message가 최근 보존 개수보다 많아야 실행됩니다.",
  ],
  [
    "Auto · conversation loop",
    "누적 provider input usage가 threshold 이상",
    "환경변수로 읽은 threshold를 쓰며 snapshot 기본값은 100,000입니다. max_estimated_tokens=0으로 compact_session을 호출하고 최근 4개를 보존합니다.",
  ],
  [
    "Recovery · CLI retry",
    "오류 문자열을 context overflow 계열로 분류",
    "4→2→1→0개를 남기는 최대 4 round를 시도합니다. 오류가 알려 준 window가 있으면 70%를 이후 threshold로 쓰지만, 이는 provider별 output reserve를 계산한 보편 공식이 아닙니다.",
  ],
] as const;

const LOGIN_PROJECTION = [
  ["Goal", "로그인 401 재현 → 최소 수정 → 같은 test로 검증"],
  ["Evidence", "401 log와 auth config의 artifact URI·content digest·관찰 시각"],
  ["Permission", "auth.ts edit 허용, credential read 거부, 대기 중 action"],
  ["Receipt", "edit operation ID·before/after digest, test command·cwd·exit code"],
  ["Unresolved", "수정 뒤에도 남은 401, 기각되지 않은 가설, 다음 action"],
] as const;

export default function CompactPipeline() {
  return (
    <section id="compact-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        실제 compact_session을 message 경계부터 따라가기
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          먼저 pinned source가 실제로 하는 일을 그대로 따라가 보겠습니다.
          <code>compact_session</code>은 별도 model을 호출해 의미를 다시 쓰는
          compressor가 아니라, 오래된 message를 deterministic heuristic으로
          훑고 짧은 continuation message를 만드는 함수입니다. 따라서 같은
          입력에는 같은 결과를 내기 쉽지만, 규칙에 이름이 없는 상태를 알아서
          보존해 주지는 않습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <CompactPipelineViz />
      </div>

      <div className="not-prose my-8 divide-y divide-border rounded-lg border border-border">
        {ACTUAL_STEPS.map(([step, operation, detail]) => (
          <div
            key={step}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[8.5rem_10rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-xs font-bold text-primary">{step}</p>
            <code className="break-words text-xs font-semibold">{operation}</code>
            <p className="break-words text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Token 추정과 summary 생성은 정밀한 의미 분석이 아닙니다</h3>
        <p>
          Local estimator는 text byte 길이를 대략 4로 나누는 방식이며 실제
          tokenizer와 일치한다고 보장하지 않습니다. Summary도 role별 message 수와
          tool 이름을 세고, 마지막 user text 몇 개를 잘라 담습니다. Pending
          work는 <code>todo</code>, <code>next</code>, <code>pending</code>,
          <code>follow up</code>, <code>remaining</code> 같은 영문 keyword를 포함한
          text에서 찾고, file은 slash와 특정 확장자를 가진 token에서 최대 8개를
          고릅니다. Timeline의 각 block은 160자로 잘리며 current work는 마지막
          비어 있지 않은 text를 200자로 제한한 값입니다.
        </p>
        <p>
          그러므로 한국어로 “아직 인증 scope 확인이 남음”이라고 적힌 permission
          denial이나 긴 test output 끝의 실패 원인은 이 규칙에서 빠질 수 있습니다.
          이 구현을 “typed fact compressor”라고 부르면 실제 보장보다 강한 인상을
          주게 됩니다. 정확한 표현은 <strong>형식이 있는 문자열 heuristic</strong>
          이며, typed login state는 그 위에 추가할 hardening입니다.
        </p>
      </div>

      <div
        id="paper-claw-compaction-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Pinned compact_session source
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — compact.rs at b71afdd…"
          citeKey={2}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/compact.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Session이 커졌을 때 어떤 message를 줄이고 어떤 recent tail을 원문으로 남길지 재현 가능한 규칙이 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Source는 조건 검사, 기존 summary 제외, tool pair 경계 보정, 규칙 기반 문자열 summary, synthetic system message와 compaction record를 하나의 pure-style 변환으로 묶습니다.</p>
            <p><strong>전제·조건:</strong> 링크된 commit의 message role·ContentBlock 구조, byte 기반 rough token estimator와 default config에 한정한 snapshot입니다.</p>
            <p><strong>근거 범위:</strong> 실제로 추출하는 role/tool/request/pending/file/current-work/timeline 항목과 recent tail 계산을 확인할 수 있습니다.</p>
            <p><strong>비주장:</strong> LLM semantic summary, typed permission·effect receipt 보존, 실제 tokenizer와의 일치, summary fidelity 검증을 구현했다는 근거는 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>ToolUse와 ToolResult는 둘을 한 쌍으로 보존합니다</h3>
        <p>
          Message 배열을 최근 N개에서 기계적으로 자르면 경계 첫 message가
          <code>ToolResult</code>일 수 있습니다. 그러면 provider는 앞선 assistant
          <code>ToolUse</code>가 없는 orphan result를 받아 요청을 거부합니다. Pinned
          함수는 첫 preserved message가 ToolResult인지 보고, 바로 앞에 ToolUse가
          있으면 경계를 한 칸 뒤로 물려 두 message를 함께 남깁니다. 이미 orphan인
          배열이라면 더 뒤로 걸어가 안전한 시작점을 찾습니다.
        </p>
        <p>
          다만 이 guard는 형식적 adjacency를 지키는 장치입니다. tool ID가 정말 일치하는지, edit result에 operation digest가 있는지, 여러 tool
          call이 섞였을 때 모두 완전한지는 별도 검증이 필요합니다. provider 400을 피하는 최소 경계일 뿐, effect reconciliation까지 완성하는 규칙은
          아닙니다.
        </p>
        <pre className="overflow-x-auto text-xs">
          {`[assistant] ToolUse(id="edit-7", name="write_file")
----------- raw keep boundary -----------
[tool]      ToolResult(id="edit-7", output="written")
[assistant] "이제 login test를 실행하겠습니다"

guard 결과: boundary를 한 칸 앞당겨 ToolUse부터 보존`}
        </pre>
        <p>
          현재 guard가 보는 범위는 preserved 첫 message의 첫 block과 바로 앞
          message입니다. 위 예에서는 provider orphan error를 피하지만, session
          전체에서 <code>edit-7</code>이 유일한지와 모든 call/result ID가 정확히
          대응하는지는 전역 correlation validator가 따로 확인해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <PhaseTransitionViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>수동·auto·recovery는 같은 이름 아래 다른 trigger입니다</h3>
        <p>
          세 경로를 하나로 뭉뚱그리면 threshold와 retry의 성격을 오해하기 쉽습니다. 아래 값은 이 commit의 default snapshot이지 모든 model에 맞는
          권장값이 아닙니다. 특히 manual은 local rough estimate를 보고, auto는 provider가 보고한 누적 input usage를 봅니다. recovery는
          정상적인 budget check가 아니라 실패 문자열을 보고 시작합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {TRIGGERS.map(([trigger, signal, behavior]) => (
          <div
            key={trigger}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[11rem_13rem_minmax(0,1fr)] md:gap-5"
          >
            <p className="break-words text-sm font-bold">{trigger}</p>
            <p className="break-words text-sm text-primary">{signal}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{behavior}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Recovery retry는 줄어드는 payload와 같은 요청 identity를 함께 지켜야 합니다</h3>
        <p>
          CLI recovery는 <code>context_window</code>, “no parseable body”, decode
          failure 같은 문자열도 context overflow 후보로 분류합니다. 그 뒤 최근
          message 보존량을 4, 2, 1, 0 순서로 줄이며 최대 네 번 다시 실행합니다.
          Source는 두 번째 round 이후 제거할 message가 0이면 멈춥니다. 더 안전한
          구현은 어느 round에서든 removed count가 0이면 추가 compaction이 payload를
          바꾸지 못한다고 보고 즉시 중단해야 합니다.
        </p>
        <p>
          문자열 분류는 provider가 같은 문장을 다른 장애에 사용하면 잘못 retry할 수 있습니다. structured error code가 있으면 그쪽을 우선하고, context
          문제가 아닌 인증·rate limit·permission 실패는 반복하지 않습니다. 분류 규칙과 provider adapter version을 receipt에 남겨야 오분류를
          재현할 수 있습니다. retry할 때는 원 user request와 session branch를 그대로 유지합니다. write effect의 operation
          ID·idempotency key를 먼저 조회하고 permission 범위를 넓히지 않은 채 다시 평가합니다. 전체 recovery에는 token·latency budget을
          두며, 네 번 모두 실패하면 마지막 오류와 시도한 preserve schedule을 숨기지 않고 사용자에게 반환합니다.
        </p>
      </div>

      <div
        id="paper-claw-compaction-recovery"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Pinned CLI recovery loop
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — rusty-claude-cli main.rs at b71afdd…"
          citeKey={3}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/main.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Provider request가 context limit에서 실패했을 때 한 번의 compaction으로 충분하지 않을 수 있습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> CLI는 error string을 분류하고, server window를 파싱하면 70% threshold를 설정하며, recent tail 4→2→1→0의 bounded retry를 수행합니다.</p>
            <p><strong>전제·조건:</strong> Pinned CLI와 지원 backend가 반환하는 알려진 오류 문자열, Trident+summary compaction 경로와 최대 4 round에 한정됩니다.</p>
            <p><strong>근거 범위:</strong> Recovery 진입 조건, preserve schedule, partially compacted runtime 채택과 최종 오류 반환 흐름을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 모든 decode failure가 context overflow라는 뜻도, 70%가 모든 tokenizer·output budget에 최적이라는 뜻도, retry가 이미 발생한 tool effect를 rollback한다는 뜻도 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>로그인 401에는 이 projection이 최소 안전선입니다</h3>
        <p>
          actual heuristic을 설명한 뒤에야 무엇을 보강해야 하는지 분명해집니다. 로그인 사례에서는 아래 다섯 field를 versioned schema로 저장하고,
          summary text는 사람이 읽는 projection으로 만드는 편이 안전합니다. parse나 invariant check가 실패하면 기존 context를 유지하는 fail-
          closed 정책을 적용합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {LOGIN_PROJECTION.map(([field, value]) => (
          <div
            key={field}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
          >
            <code className="break-words text-xs font-bold text-primary">{field}</code>
            <p className="break-words text-sm leading-6 text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
