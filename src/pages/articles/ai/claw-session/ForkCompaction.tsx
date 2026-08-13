import { CitationBlock } from "@/components/ui/citation";
import ForkRewindFlowViz from "./viz/ForkRewindFlowViz";

const ACTUAL_FORK_FIELDS = [
  ["새로 생성", "session_id · created_at_ms · updated_at_ms"],
  ["provenance 추가", "parent_session_id · optional branch_name"],
  ["복제", "messages · compaction · prompt history · model · health metadata"],
  ["상속", "workspace_root"],
  ["초기화", "persistence path — 새 managed path를 받은 뒤 별도로 저장"],
] as const;

const DESIRED_BRANCH_FIELDS = [
  [
    "common base",
    "부모 session만이 아니라 정확한 base revision·workspace tree hash",
  ],
  [
    "isolated workspace",
    "candidate별 worktree·snapshot·artifact namespace와 capability",
  ],
  [
    "evidence",
    "diff digest·test command·exit code·bounded log·artifact provenance",
  ],
  [
    "merge record",
    "선택 authority·conflict·approval·post-merge test·새 merged revision",
  ],
] as const;

const CANDIDATE_PROTOCOL = [
  [
    "Prepare",
    "같은 base hash와 deterministic login fixture를 A·B에 고정합니다.",
  ],
  [
    "Run",
    "A는 null guard, B는 token refresh를 별도 session·workspace에서 실행합니다.",
  ],
  [
    "Compare",
    "Diff·test receipt·비용·오류와 요구사항 적합성을 같은 rubric으로 비교합니다.",
  ],
  [
    "Select",
    "사람 또는 명시된 policy가 채택할 artifact와 버릴 artifact를 결정합니다.",
  ],
  [
    "Integrate",
    "Common base를 기준으로 three-way merge하고 충돌을 해결한 뒤 다시 승인·test합니다.",
  ],
  [
    "Record",
    "새 merge event, 최종 diff/test receipt와 양쪽 lineage·retention 상태를 남깁니다.",
  ],
] as const;

export default function ForkCompaction() {
  return (
    <section id="fork-compaction" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Session fork와 workspace branch는 같은 기능이 아닙니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          로그인 401을 고치는 방법으로 “null token이면 즉시 거부하는 작은
          guard”와 “만료 token을 refresh하는 수정”을 비교하고 싶다고 해
          보겠습니다. 대화 session만 둘로 나누면 assistant가 서로 다른 제안을
          만들 수는 있지만, 두 후보가 같은 <code>auth.ts</code>를 수정하는 순간
          결과가 섞일 수 있습니다. 따라서 conversation provenance와 workspace
          isolation을 별도로 설계해야 합니다.
        </p>
        <p>
          아래 그림은 안전한 branch·merge를 위해 추가해야 할{" "}
          <strong>hardening target</strong>을 보여 줍니다. Pinned source가 base
          revision, 별도 worktree, rewind와 three-way merge를 이미 제공한다는
          뜻은 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <ForkRewindFlowViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned fork가 실제로 하는 일은 message-copy fork입니다</h3>
        <p>
          <code>Session::fork</code>는 새 session ID와 시각을 만들고, 원래
          session의 messages, compaction, prompt history, model과 workspace
          root를 복제합니다. 여기에 <code>parent_session_id</code>와 선택적인
          branch name을 provenance로 붙입니다. 원본 session은 바뀌지 않으며
          fork된 session은 새 persistence path에 저장됩니다.
        </p>
        <p>
          이 정보는 “어느 session에서 갈라졌는가”를 설명하지만 “부모의 어느
          immutable revision을 공통 base로 삼았는가”를 가리키는 pointer는
          아닙니다. 복제한 messages 이후에 양쪽이 바뀌어도 shared event
          history나 copy-on-write storage가 관리되는 구조가 아니며, workspace
          root를 상속한다고 별도 worktree가 생기는 것도 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">
          근거 읽기 · SessionFork source 범위
        </p>
        <CitationBlock
          source="Claw Code pinned Session::fork implementation"
          citeKey={7}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/session.rs#L339-L360"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 원본 session을 바꾸지 않고 같은
              conversation state에서 대안 조사를 시작하면서 출처를 잃지 않아야
              합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned <code>fork</code>는 새
              session identity를 만들고 messages·compaction·prompt history와
              workspace root를 복제하며 parent ID·branch name을 기록합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 링크된 commit의 in-memory copy와
              managed save 경로를 함께 읽으며 field 복제가 workspace clone을
              의미하지 않는다고 구분합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 이 절의 실제 copied field, 새
              identity와 fork provenance를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Immutable base revision, event sharing,
              rewind, 별도 worktree, artifact merge와 conflict resolution이
              구현됐다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {ACTUAL_FORK_FIELDS.map(([kind, fields]) => (
          <div
            key={kind}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
          >
            <p className="break-words text-sm font-semibold">{kind}</p>
            <code className="break-words text-xs leading-6 text-primary">
              {fields}
            </code>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Rewind도 현재 구현 사실과 목표 설계를 나눠 읽습니다</h3>
        <p>
          일반적인 rewind는 과거 checkpoint를 삭제하는 동작이 아니라 그 지점에서
          새 미래를 시작하는 동작입니다. 그러나 pinned fork metadata만으로 임의
          revision을 선택해 rewind하거나, 과거 effect를 되돌리거나, 새 head를
          만든다고 주장할 수는 없습니다. 이러한 기능을 추가하려면 immutable
          base, event order, workspace state와 이미 발생한 외부 effect의 처리
          규칙이 먼저 필요합니다.
        </p>
        <p>
          특히 대화를 과거로 돌렸다고 파일이 과거 상태로 돌아가지는 않습니다.
          Candidate별 workspace를 분리하지 않았다면 다른 session의 transcript가
          가리키는 코드와 실제 filesystem이 달라질 수 있습니다. 안전한 branch
          contract에는 아래 정보가 추가돼야 합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {DESIRED_BRANCH_FIELDS.map(([field, meaning]) => (
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
        <h3>Merge는 transcript를 이어 붙이는 일이 아닙니다</h3>
        <p>
          Candidate A의 assistant message 뒤에 B의 message를 붙여도 두 patch가
          합쳐지지 않습니다. Merge 대상은 conversation text가 아니라 common base
          대비 artifact diff입니다. 두 후보가 같은 줄을 고쳤다면 conflict를
          해결해야 하고, permission과 deterministic login test도 merged
          workspace에서 다시 수행해야 합니다. 이전 branch에서 통과한 test
          receipt는 새로운 조합의 정답을 보장하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {CANDIDATE_PROTOCOL.map(([stage, action]) => (
          <div
            key={stage}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
          >
            <p className="break-words text-sm font-semibold">{stage}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {action}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Checkpoint·replay framework는 비교 자료이지 Claw 구현 근거가 아닙니다
        </h3>
        <p>
          Long-running workflow framework는 thread별 checkpoint, replay와 state
          fork의 의미를 명시합니다. 이 비교는 Claw fork에서 무엇이 빠졌는지 설계
          질문을 만드는 데 유용하지만, framework의 checkpointer가 filesystem
          edit의 idempotency나 artifact merge를 대신 해결하지는 않습니다.
        </p>
      </div>

      <div
        id="paper-langgraph-persistence"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · LangGraph persistence
        </p>
        <CitationBlock
          source="LangGraph — Persistence"
          citeKey={5}
          href="https://docs.langchain.com/oss/python/langgraph/persistence"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Long-running graph를 thread별 checkpoint로
              보존하고 interrupt나 failure 뒤 특정 실행 지점에서 replay·fork할
              필요가 있습니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Thread, checkpoint,
              super-step, pending writes와 state history를 구분하고
              checkpoint에서 replay 또는 state update를 시작하는 semantics를
              정의합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 해당 framework의
              checkpointer·serializer·thread identity를 사용하며 node의 external
              side effect는 application이 idempotent하게 설계해야 합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Checkpoint·replay·fork를 구분하는 일반
              비교 자료이며 안전한 time-travel에 필요한 질문을 제공합니다.
            </p>
            <p>
              <strong>비주장:</strong> Claw SessionStore가 LangGraph
              checkpointer와 같거나 framework persistence가 permission·effect
              reconciliation·workspace merge를 보장한다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Compaction은 branch와 다른 축입니다</h3>
        <p>
          Fork는 같은 과거에서 대안을 만드는 기능이고, compaction은 한 session의
          긴 context를 줄이는 기능입니다. Pinned session은 compaction count,
          제거된 message 수와 summary를 저장하고 fork할 때 이를 복제합니다.
          그러나 summary는 원본 evidence, immutable base revision이나 artifact
          lineage를 대신할 수 없습니다. 요약 품질과 연속 compaction은
          <a href="/ai/claw-compaction"> compaction 전용 글</a>에서 이어집니다.
        </p>
        <p>
          Branch를 정리할 때도 transcript만 삭제해서는 안 됩니다. Candidate의
          diff와 test receipt를 최종 결과가 참조하고 있다면 retention 기간 동안
          lineage를 유지하고, 민감 데이터 삭제는 원본 record·summary·artifact의
          파생 관계를 함께 추적해야 합니다. 이 retention·garbage collection 역시
          pinned fork source의 구현 사실이 아니라 운영 계약입니다.
        </p>
      </div>
    </section>
  );
}
