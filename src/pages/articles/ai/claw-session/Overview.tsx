import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import SessionStructViz from "./viz/SessionStructViz";

const SCENARIO_TRACE = [
  [
    "PINNED RECORD",
    "1 · Session",
    "session_id와 workspace_root가 작업의 바깥 identity를 이룹니다.",
  ],
  [
    "PINNED RECORD",
    "2 · User",
    "401 수정 요청을 typed user message로 저장합니다.",
  ],
  [
    "PINNED RECORD",
    "3 · Assistant",
    "read/search·edit·test 제안을 ToolUse block과 call id로 저장합니다.",
  ],
  [
    "PINNED LOOP",
    "4 · Permission·effect",
    "Host가 권한을 판정하고 허용된 tool을 실행합니다. 결정 actor는 message schema에 없습니다.",
  ],
  [
    "PINNED RECORD",
    "5 · ToolResult",
    "tool_use_id로 결과와 원래 call을 연결합니다.",
  ],
  [
    "HARDENING",
    "6 · Test receipt",
    "Command·cwd·exit code·artifact digest를 검증 evidence로 남겨야 합니다.",
  ],
  [
    "PINNED RECORD",
    "7 · Final response",
    "더는 ToolUse가 없는 assistant message로 결과를 설명합니다.",
  ],
] as const;

const RECORD_TERMS = [
  [
    "Session",
    "여러 turn을 같은 작업으로 이어 주는 durable identity와 저장 record",
  ],
  [
    "Turn",
    "사용자 입력 하나에서 최종 assistant 응답까지 이어지는 한 번의 처리",
  ],
  ["Attempt", "한 turn 안의 개별 model request 또는 tool 실행 시도"],
  ["Effect", "파일 수정·process 실행처럼 workspace나 외부 세계를 바꾸는 결과"],
] as const;

const MESSAGE_BLOCKS = [
  ["System · User · Assistant · Tool", "누가 만든 message인지 구분하는 role"],
  ["Text", "사용자 입력과 최종 설명처럼 일반 text를 담는 block"],
  ["ToolUse", "call id·tool name·input을 묶어 실행 제안을 식별하는 block"],
  [
    "ToolResult",
    "tool_use_id로 원래 call과 연결하고 output·오류 여부를 담는 block",
  ],
  [
    "Thinking",
    "provider가 제공하고 runtime이 저장하기로 한 경우의 typed block",
  ],
] as const;

const SCHEMA_BOUNDARY = [
  [
    "저장됨 · session_meta",
    "version · session_id · timestamps · fork · workspace_root · model",
  ],
  [
    "저장됨 · message",
    "role · typed blocks · optional usage · tool call/result correlation",
  ],
  ["저장됨 · compaction", "count · removed_message_count · summary"],
  ["저장됨 · history", "timestamp가 있는 prompt history record"],
  [
    "확인되지 않음",
    "attempt revision · policy actor/decision · effect receipt · artifact bytes",
  ],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        세션은 모델의 기억이 아니라 작업을 다시 찾는 durable record입니다
      </h2>

      <ContentBoundary article="claw-session" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사용자가 로그인 401 오류 수정을 요청했다고 해 보겠습니다. 모델이 원인을 설명하는 것만으로는 작업이 끝나지 않습니다. Runtime은 어떤 요청에서 시작했는지, 어느
          workspace를 읽었는지, 어떤 tool call이 허용됐고 실제로 무엇을 바꿨는지, 마지막 test가 통과했는지를 서로 연결해야 합니다. process가 종료된 뒤에도 이
          연결을 찾게 해 주는 단위가 session입니다.
        </p>
        <p>
          여기서 session은 모델 내부의 장기 기억도, 현재 model context도
          아닙니다. Context는 다음 model request에 넣을 입력이고, session은 그
          context를 다시 만들 때 참고하는 저장 record입니다. 어떤 정보를
          context에 선택하고 compaction하는지는{" "}
          <a href="/ai/context-engineering">context engineering</a>이 소유하며,
          이 글은 저장된 대화와 실행이 어디까지 같은 작업인지 식별하는 경계를
          다룹니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SCENARIO_TRACE.map(([status, step, detail]) => (
          <article
            key={step}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="break-words text-[0.65rem] font-bold tracking-wide text-muted-foreground">
              {status}
            </p>
            <p className="mt-1 break-words text-xs font-bold text-primary">
              {step}
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {detail}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 session·turn·attempt·effect를 구분합니다</h3>
        <p>
          이 네 단어를 모두 “대화”라고 부르면 crash가 났을 때 무엇을 다시 실행해도 되는지 판단할 수 없습니다. Session은 여러 turn의 바깥 identity이고 한 turn
          안에는 provider retry나 여러 tool attempt가 들어갈 수 있습니다. Effect는 attempt와도 다릅니다. Edit attempt가 timeout됐더라도
          파일은 이미 바뀌었을 수 있기 때문입니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {RECORD_TERMS.map(([term, meaning]) => (
          <div
            key={term}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
          >
            <code className="break-words text-xs font-bold text-primary">
              {term}
            </code>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {meaning}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 그림은 pinned 구조체를 그대로 옮긴 class diagram이 아니라, 실제
          typed record와 운영에 필요한 effect·authority·attempt 경계를 함께 놓은
          <strong> 목표 architecture</strong>입니다. Pinned source에서 확인된
          범위는 이어지는 source block과 schema ledger에서 따로 표시합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <SessionStructViz />
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {SCHEMA_BOUNDARY.map(([scope, fields]) => (
          <div
            key={scope}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
          >
            <p className="break-words text-sm font-semibold">{scope}</p>
            <code className="break-words text-xs leading-6 text-primary">
              {fields}
            </code>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned snapshot이 실제로 저장하는 범위부터 확인합니다</h3>
        <p>
          분석 대상 commit의 <code>Session</code>에는 session identity,
          생성·수정 시각, typed message, compaction metadata, fork metadata,
          workspace root, prompt history와 model 정보가 있습니다. Message는
          하나의 문자열이 아니라 role과 content block 배열입니다. 따라서
          assistant가 text와 tool call을 함께 반환하더라도 구조를 잃지 않고,{" "}
          <code>ToolResult.tool_use_id</code>로 어느 호출의 결과인지 다시 찾을
          수 있습니다.
        </p>
        <p>
          <code>Thinking</code> block이 type으로 존재한다는 사실은 제품이 숨겨진
          chain-of-thought를 사용자에게 공개해야 한다는 뜻이 아닙니다.
          Provider가 반환하고 저장 정책이 허용한 block을 구분할 수 있다는 schema
          사실일 뿐이며, 민감한 reasoning·secret·대용량 output의 보존 여부는
          별도 정책이 결정해야 합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MESSAGE_BLOCKS.map(([type, meaning]) => (
          <article
            key={type}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <code className="break-words text-xs font-bold text-primary">
              {type}
            </code>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {meaning}
            </p>
          </article>
        ))}
      </div>

      <div
        id="paper-claw-session-record-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Claw Code session record
        </p>
        <CitationBlock
          source="Claw Code pinned session.rs"
          citeKey={1}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/session.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 대화와 tool call을 process 종료 뒤에도 같은
              session으로 복원하려면 안정적인 record type과 저장 형식이
              필요합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned source는 role·content
              block·compaction·fork provenance를 typed 구조로 두고 JSONL
              record와 snapshot으로 직렬화합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 링크된 commit SHA의 Rust source를 읽은
              결과이며 이후 schema·field·저장 동작은 바뀔 수 있습니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 이 절의 실제 <code>Session</code>,{" "}
              <code>ConversationMessage</code>, <code>ContentBlock</code>, fork
              metadata와 JSONL 형식을 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> 이 구조가 Claude Code·Codex의 내부
              schema이거나, full effect receipt·revisioned event
              store·multi-writer transaction까지 구현한다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>JSONL record와 event sourcing은 같은 말이 아닙니다</h3>
        <p>
          Pinned 구현은 metadata와 message를 JSONL record로 저장하고 일부 write는 뒤에 append합니다. 그렇다고 모든 model attempt와
          permission decision, 외부 effect, lifecycle transition을 immutable event로 보존해 임의의 revision view를 재구성할 수
          있는 것은 아닙니다. “한 줄씩 저장한다”는 파일 형식과 “모든 상태 변화를 event가 소유한다”는 event-sourcing architecture를 구분해야 합니다.
        </p>
        <p>
          더 강한 운영 계약에서는 원본 event와 현재 view를 분리하고 snapshot이 어느 event revision에서 파생됐는지 기록합니다. 복원할 때는 snapshot 뒤의
          event만 replay합니다. 같은 base revision을 동시에 update하는 경우는 optimistic concurrency로 검출합니다. 이 방식은 감사에 유리하지만
          event schema version과 migration, ordering, secret redaction, storage 비용도 함께 설계해야 합니다. 아래 문서는 이 일반
          pattern의 근거이며 Claw snapshot의 구현 사실을 늘려 주는 근거가 아닙니다.
        </p>
      </div>

      <div
        id="paper-azure-event-sourcing"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Event Sourcing pattern
        </p>
        <CitationBlock
          source="Microsoft Azure Architecture Center — Event Sourcing pattern"
          citeKey={2}
          href="https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 현재 state만 덮어쓰면 어떤 변경 순서와
              이유로 그 상태가 됐는지 복원하거나 감사하기 어렵습니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> 상태 변경을 append-only
              event로 저장하고 현재 state는 event를 replay하거나 snapshot에서
              이어 계산합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> Event order·versioning·projection
              consistency·snapshot과 개인정보 삭제 전략을 함께 운영해야 합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 원본 event와 derived view, snapshot의
              역할을 구분하는 일반 설계 근거입니다.
            </p>
            <p>
              <strong>비주장:</strong> JSONL 파일을 사용하면 자동으로 event
              sourcing이 되거나 pinned Claw source가 revision
              replay·projection을 완성했다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이제 한 turn의 실제 순서를 따라갑니다</h3>
        <p>
          다음 절에서는 401 사례의 user message가 저장된 뒤 provider stream과 assistant tool call, permission, edit, test
          result가 어떤 순서로 session에 붙는지 살펴봅니다. 이 순서를 알아야 저장됐다는 사실과 외부 effect가 완료됐다는 사실 사이의 빈틈을 찾을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
