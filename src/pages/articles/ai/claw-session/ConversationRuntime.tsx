import { CitationBlock } from "@/components/ui/citation";
import TurnLoopViz from "./viz/TurnLoopViz";

const PINNED_LOOP = [
  [
    "User record",
    "입력을 typed user message로 session에 먼저 추가",
    "로그인 401 요청의 시작점",
  ],
  [
    "Provider stream",
    "현재 messages를 보내고 stream event를 assistant message로 조립",
    "model attempt 자체의 durable ID는 별도 확인되지 않음",
  ],
  [
    "Assistant record",
    "Text·ToolUse block을 session에 추가",
    "call id·name·input이 남음",
  ],
  [
    "Permission·effect",
    "hook과 permission을 거쳐 허용된 tool만 실행",
    "permission actor·결정 record는 message schema 밖",
  ],
  [
    "ToolResult record",
    "output·is_error와 tool_use_id를 session에 추가",
    "다음 provider request가 결과를 읽음",
  ],
  [
    "Repeat or finish",
    "ToolUse가 더 있으면 반복하고 없으면 TurnSummary 반환",
    "max iteration과 오류가 loop를 끝낼 수 있음",
  ],
] as const;

const CRASH_CUTS = [
  [
    "User append 전",
    "Session에는 요청이 없습니다.",
    "Client request ID가 없다면 사용자가 재전송했는지 구분하기 어렵습니다.",
  ],
  [
    "User append 후 · Assistant append 전",
    "요청은 있지만 provider attempt의 완료 여부가 불명확합니다.",
    "새 attempt로 처리하되 이전 stream을 섞지 않고 duplicate response를 막습니다.",
  ],
  [
    "Assistant ToolUse append 후 · effect 전",
    "Call 제안은 남았지만 실행은 시작되지 않았습니다.",
    "현재 policy로 다시 승인하고 precondition이 맞을 때만 실행합니다.",
  ],
  [
    "Effect 후 · ToolResult append 전",
    "파일은 바뀌었을 수 있지만 성공 record가 없습니다.",
    "가장 위험한 ambiguous completion이므로 digest/status 조회 없이 재실행하지 않습니다.",
  ],
  [
    "ToolResult append 후",
    "Call과 결과의 대응은 복원할 수 있습니다.",
    "다음 model attempt부터 이어가되 result가 충분한 receipt인지 다시 확인합니다.",
  ],
] as const;

const HARDENING_SNAPSHOT = [
  [
    "base revision",
    "동시에 열린 두 client가 같은 session view를 덮어쓰지 않도록 CAS 또는 single writer로 검증",
  ],
  [
    "workspace identity",
    "repository revision·target file digest·canonical cwd를 turn 시작 시 고정",
  ],
  [
    "runtime generation",
    "model·tool schema·plugin·policy version이 turn 중 조용히 바뀌지 않게 pin",
  ],
  [
    "attempt identity",
    "provider retry와 tool retry를 각각 새 attempt로 남기고 관측된 output을 섞지 않음",
  ],
] as const;

export default function ConversationRuntime() {
  return (
    <section id="conversation-runtime" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        한 turn은 model 호출이 아니라 record와 effect가 번갈아 생기는 loop입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          401 원인을 찾는 동안 runtime은 <code>read_file</code>과 search 결과를
          model에 돌려주고, model이 제안한 edit를 승인받아 적용한 뒤 login
          test를 실행합니다. 이 과정에서 model은 다음 action을 제안하지만, 실제
          permission 판정과 tool 실행, session 저장 순서는 host runtime이
          소유합니다. Provider adapter의 자세한 stream parsing은
          <a href="/ai/claw-api-client"> API client 글</a>, tool schema와
          dispatch는
          <a href="/ai/claw-tool-system"> tool system 글</a>에서 이어집니다.
        </p>
        <p>
          아래 그림은 crash-safe runtime에 필요한 intent·effect·verification
          commit을 한눈에 보여 주는 <strong>hardening target</strong>입니다.
          Pinned source에서 실제로 확인되는 것은 그림의 모든 ledger field가
          아니라, 이어지는 절에 정리한 user·assistant·tool-result append와
          permission·execution 순서입니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <TurnLoopViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned loop의 순서는 source에서 직접 확인할 수 있습니다</h3>
        <p>
          <code>ConversationRuntime::run_turn</code>은 user message를 먼저
          session에 추가합니다. 그다음 provider stream을 typed assistant
          message로 조립해 저장하고, 그 안에 ToolUse가 있으면 hook과
          permission을 거쳐 tool을 실행합니다. 실행 결과는 ToolResult message로
          저장되며, 다음 iteration의 provider request는 이 결과까지 포함한
          messages를 받습니다. 하나의 “turn transaction”으로 한 번에 commit하는
          구조가 아니라 순차적인 append와 effect의 조합이라는 점이 중요합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {PINNED_LOOP.map(([phase, action, evidence]) => (
          <div
            key={phase}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-5"
          >
            <p className="break-words text-sm font-semibold">{phase}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {action}
            </p>
            <p className="break-words text-xs leading-5 text-muted-foreground">
              {evidence}
            </p>
          </div>
        ))}
      </div>

      <div
        id="paper-claw-conversation-runtime-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Claw Code ConversationRuntime
        </p>
        <CitationBlock
          source="Claw Code pinned conversation.rs"
          citeKey={3}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/conversation.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 한 user turn에서 provider stream, assistant
              block, permission, tool execution과 result가 어떤 순서로 session에
              반영되는지 확인해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned source는{" "}
              <code>run_turn</code> loop, provider event 조립, typed
              ToolUse·ToolResult, hook·permission과 iteration 종료 조건을
              구현합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 같은 commit의 session·permission·tool
              source와 함께 읽어야 하며 CLI나 adapter가 더하는 동작을 이
              파일만으로 추론하지 않습니다.
            </p>
            <p>
              <strong>근거 범위:</strong> User→assistant→permission/effect→tool
              result의 실제 append 순서와 그 사이에 생기는 crash cut을
              뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Base revision CAS, runtime generation
              snapshot, durable outbox·effect receipt, dependency-aware parallel
              executor가 이미 있다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Crash는 “turn 중간”이 아니라 정확한 cut에서 분석합니다</h3>
        <p>
          같은 crash라도 edit 전과 edit 후의 재개 규칙은 정반대입니다. Effect
          전에는 precondition과 permission을 다시 확인한 뒤 재시도할 수 있지만,
          effect 뒤에는 이미 적용됐을 가능성이 있으므로 blind retry가
          위험합니다. 아래 cut을 failure-injection test로 각각 재현해야 partial
          final state를 숨기지 않을 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 lg:grid-cols-2">
        {CRASH_CUTS.map(([cut, known, resume]) => (
          <article
            key={cut}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{cut}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              <strong className="text-foreground/80">남은 사실:</strong> {known}
            </p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              <strong className="text-foreground/80">재개 규칙:</strong>{" "}
              {resume}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Effect 뒤 result 저장 전의 빈틈에는 reconciliation이 필요합니다</h3>
        <p>
          <code>edit_file</code>이 <code>auth.ts</code>를 바꾼 직후 process가
          종료됐다고 해 보겠습니다. 견고한 runtime은 실행 전에 stable
          <code>operation_id</code>, tool call ID, target path, expected before
          digest, patch 또는 expected after digest와 승인된 policy binding을
          durable planned record로 남깁니다. Executor는 같은 operation
          identity로 effect를 시도하고, 가능한 경우 status 조회나 before/after
          digest를 포함한 receipt를 돌려줍니다.
        </p>
        <p>
          Resume 시 after digest가 일치하면 <strong>completed</strong>로 판정해
          기존 effect에 result를 연결하고 다시 수정하지 않습니다. Before
          digest가 그대로이고 executor가 실패를 확정했다면{" "}
          <strong>failed</strong>로 기록한 뒤 같은 precondition에서 새 attempt를
          허용할 수 있습니다. 어느 쪽도 확인할 수 없는
          <strong>unknown</strong> 상태라면 자동 재실행을 막고 status probe,
          compensation 또는 사람 검토로 보냅니다. 이 protocol은 중복을 줄이지만
          모든 filesystem·process·remote API에 exactly-once를 만들어 주지는
          않습니다.
        </p>
      </div>

      <div
        id="paper-aws-transactional-outbox"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Transactional outbox와 dual-write gap
        </p>
        <CitationBlock
          source="AWS Prescriptive Guidance — Transactional outbox pattern"
          citeKey={4}
          href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Local durable state와 외부 message 또는
              effect를 따로 쓰면 한쪽만 성공하는 dual-write failure가 생깁니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Business update와 outbox
              record를 같은 local transaction에 저장하고 relay가 stable
              identity·ordering·deduplication 규칙으로 외부 전달을 재개합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> Transactional local store, stable
              operation ID, relay monitoring과 consumer의 idempotency 또는
              duplicate 처리 능력이 필요합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Planned operation과 external effect
              사이 crash gap을 분리하고 reconciliation을 설계하는 일반 원리의
              근거입니다.
            </p>
            <p>
              <strong>비주장:</strong> Filesystem edit나 child process가
              자동으로 database transaction에 들어가거나 pinned Claw가
              outbox·exactly-once를 구현했다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Turn snapshot과 revision은 필요한 hardening이지 현재 source claim이
          아닙니다
        </h3>
        <p>
          긴 작업에서는 turn이 시작할 때 본 session과 workspace가 실행 끝까지
          같은 의미를 유지해야 합니다. 그래서 아래 field를 묶은 snapshot과 base
          revision 검사를 추가하는 것이 유용합니다. 다만 pinned source에서 이
          generation pin과 optimistic concurrency가 확인된 것은 아니므로, 구현
          기능이 아니라 설계·평가 요구사항으로 읽어야 합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {HARDENING_SNAPSHOT.map(([field, meaning]) => (
          <article
            key={field}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <code className="break-words text-xs font-bold text-primary">
              {field}
            </code>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {meaning}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Read/search와 edit/test의 dependency도 명시합니다</h3>
        <p>
          서로 다른 파일을 읽고 검색하는 작업은 독립성이 확인되면 병렬 후보가 될
          수 있지만, edit는 그 evidence에 의존하고 login test는 edit receipt에
          의존합니다. Pinned loop는 pending tool call을 순서대로 실행하므로 이
          dependency-aware parallel graph를 구현했다는 주장은 하지 않습니다.
          이를 추가한다면 하나가 실패했을 때 취소 범위, 늦게 도착한 결과의
          attempt ID, model에 돌려줄 안정적인 result order까지 함께 정의해야
          합니다.
        </p>
        <p>
          마지막으로 deadline, iteration, token·cost, 같은 action 반복과 사용자
          cancel을 서로 다른 budget으로 추적해야 합니다. Budget이 끝났거나
          test가 실패했다면 완료한 것처럼 응답하지 말고, 적용된 diff, 아직
          불명확한 effect, 실패한 test receipt와 안전한 다음 행동을 partial
          outcome으로 남깁니다.
        </p>
      </div>
    </section>
  );
}
