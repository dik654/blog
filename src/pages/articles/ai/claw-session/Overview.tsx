import SessionStateLab from './SessionStateLab';

const sessionFields = [
  ['identity', 'version · session_id · created_at_ms · updated_at_ms', '파일 형식과 대화의 정체성을 복원한다.'],
  ['conversation', 'messages', 'role, content block, 선택적 token usage를 순서대로 보존한다.'],
  ['compression', 'compaction', '몇 번 압축했고 몇 메시지를 제거했는지, 최신 summary가 무엇인지 남긴다.'],
  ['lineage', 'fork', '부모 session id와 선택적 branch name을 기록한다.'],
  ['boundary', 'workspace_root', '다른 worktree의 세션을 잘못 여는 일을 차단하는 기준이다.'],
  ['history', 'prompt_history · model · last_health_check_ms', '입력 이력과 실행 맥락 일부를 보존한다.'],
] as const;

const ownershipRows = [
  ['Turn', 'messages · usage', '모델 호출과 stop reason을 포함한 전체 turn 제어는 ConversationRuntime의 책임이다.'],
  ['Dispatch / policy', 'ToolUse · ToolResult 증거', '도구 등록, 권한 판정, 실제 실행은 Session이 소유하지 않는다.'],
  ['Checkpoint / resume', 'JSONL save · load', '영속 상태는 제공하지만 재시작 정책과 migration은 SessionStore를 포함한 애플리케이션 책임이다.'],
  ['Approval / commit', '저장 필드 없음', '사람 승인과 commit protocol은 별도 소유자가 필요하다.'],
  ['External effect', 'ToolResult는 관측 기록', '파일·API side effect의 idempotency나 reconciliation을 증명하지 않는다.'],
  ['Replay / evaluation', 'message · compaction · lineage 증거', 'grader, release gate, 결정론적 replay는 별도 시스템이 완성해야 한다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="text-2xl font-bold">Session은 무엇을 저장하는가</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
          Session은 에이전트 전체가 아니라 <strong className="text-foreground">대화를 다시 읽기 위한
          영속 상태</strong>다. 메시지와 계보를 보존하지만 권한, 승인, 외부 side effect의 최종
          진실까지 소유하지는 않는다.
        </p>
        <SessionStateLab />

        <div className="not-prose my-7 overflow-hidden rounded-md border border-border" data-session-field-map>
          <div className="border-b border-border bg-muted/20 px-4 py-3">
            <code className="text-xs font-bold">pub struct Session</code>
          </div>
          <dl className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {sessionFields.map(([owner, fields, purpose]) => (
              <div key={owner} className="min-w-0 bg-background p-4">
                <dt className="text-[10px] font-bold uppercase text-muted-foreground">{owner}</dt>
                <dd className="mt-1 break-words font-mono text-xs font-bold [overflow-wrap:anywhere]">{fields}</dd>
                <dd className="mt-2 text-xs leading-5 text-muted-foreground">{purpose}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>메시지 안에는 세 종류의 block만 있다</h3>
          <p>
            <code>ConversationMessage</code>는 네 role(System, User, Assistant, Tool), block 배열,
            선택적 <code>TokenUsage</code>를 가진다. 현재 <code>ContentBlock</code>은
            <code>Text</code>, <code>ToolUse</code>, <code>ToolResult</code> 세 종류다.
            이미지, PDF, permission log는 이 타입에 없다.
          </p>
          <p>
            따라서 ToolResult를 보았다는 사실과 도구가 안전하게 실행됐다는 사실은 다르다.
            Session은 결과 문자열과 오류 여부를 기억할 뿐, 그 요청을 허용한 policy나 외부 시스템의
            실제 상태를 재검증하지 않는다.
          </p>
        </div>
      </section>

      <section id="persistence" className="mb-16 scroll-mt-20">
        <h2 className="text-2xl font-bold">메모리 상태가 JSONL 기록이 되는 순서</h2>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {[
            ['01', 'meta', 'version, id, timestamp, fork, workspace, model'],
            ['02', 'compaction', '최신 압축 횟수·summary'],
            ['03', 'prompt history', 'timestamp가 붙은 사용자 prompt'],
            ['04', 'messages', 'role·blocks·usage를 순서대로 append'],
          ].map(([number, label, detail]) => (
            <div key={number} className="min-w-0 bg-background p-4">
              <span className="text-2xl font-black tabular-nums text-muted-foreground/35">{number}</span>
              <strong className="mt-2 block text-sm">{label}</strong>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            첫 기록은 snapshot을 원자적으로 쓰고, 이후 메시지와 prompt entry는 JSONL 한 줄로
            append한다. 256 KiB 회전 검사는 매 append가 아니라 다음 <code>save_to_path</code> snapshot
            시점에 수행되며 최대 세 개의 rotated file을 유지한다.
            <code>SessionStore</code>는 canonical workspace path의 fingerprint로 저장 디렉터리를
            나누고, load할 때 <code>workspace_root</code>가 현재 worktree와 같은지 검사한다.
          </p>
          <h3>ToolResult가 있어도 executor가 실행됐다고 단정할 수 없다</h3>
          <p>
            assistant가 tool을 요청한 뒤 permission이 거부되면 runtime은 executor를 호출하지 않고도
            <code>is_error: true</code>인 ToolResult를 만들어 Session에 넣는다. 반대로 executor가 외부
            effect를 성공시킨 직후 ToolResult append 전에 process가 죽으면 파일이나 API 상태는
            바뀌었지만 Session에는 결과가 없다. 같은 타입이 “실행 전 거부”와 “실행 뒤 관찰”을 모두
            표현하므로, call count와 effect receipt는 별도 owner가 남겨야 한다.
          </p>
          <p>
            <code>push_message</code>는 append가 실패하면 방금 넣은 in-memory message를 pop하지만 이미
            일어난 외부 effect를 되돌리지 않는다. 재시작 뒤 결과가 없다고 같은 tool을 무조건 다시
            실행하면 중복 effect가 날 수 있다. 따라서 side-effecting tool에는 stable operation id,
            idempotency key와 외부 상태 reconciliation이 Session보다 앞선 안전 계약으로 필요하다.
          </p>
          <h3>재시작 안전성은 어느 줄까지 썼는지가 아니라 effect와 기록의 순서를 함께 본다</h3>
          <p>
            crash가 permission 판정 전에 나면 외부 effect도 ToolResult도 없다. executor 호출 뒤
            effect가 성공했지만 append 전에 죽으면 외부 상태만 바뀐다. append까지 끝난 뒤 snapshot
            save 전에 죽으면 메모리와 append log의 상태가 다를 수 있다. 세 경우는 화면상 모두 “마지막
            응답이 안 보임”처럼 보이지만 재시도 안전성은 완전히 다르다.
          </p>
          <p>
            load 함수는 남아 있는 JSONL을 다시 읽어 대화를 복원할 뿐, 외부 API나 filesystem을 조회해
            미기록 effect를 찾아내지 않는다. 따라서 resume coordinator는 operation id로 외부 상태를
            먼저 조회하고, 완료 receipt가 있으면 observation을 복구하며, 상태를 알 수 없으면
            <strong>UNKNOWN</strong>으로 멈춰야 한다. Session persistence만으로 exactly-once 실행을
            주장할 수 없는 이유가 여기에 있다.
          </p>
        </div>
      </section>

      <section id="fork-compaction" className="mb-16 scroll-mt-20">
        <h2 className="text-2xl font-bold">Fork와 checkpoint를 구분한다</h2>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-5">
            <span className="text-xs font-bold text-muted-foreground">FORK · 다른 미래</span>
            <p className="mt-2 text-sm leading-6">
              새 session id를 만들고 messages, compaction, workspace, prompt history, model을 복제한다.
              부모 id와 branch name을 남기고 persistence path는 비운다.
            </p>
          </div>
          <div className="bg-background p-5">
            <span className="text-xs font-bold text-muted-foreground">CHECKPOINT · 같은 실행의 재개점</span>
            <p className="mt-2 text-sm leading-6">
              durable state, schema version, 재시작 위치와 외부 effect 정합성을 함께 보존해야 한다.
              현재 fork 자체는 이 계약을 제공하지 않는다.
            </p>
          </div>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          <code>SessionStore::fork_session</code>은 복제한 session에 새 파일 경로를 연결해 즉시 저장한다.
          이것은 분기 기록을 durable하게 만들지만, 두 분기의 자동 merge나 side effect rollback을
          구현한다는 뜻은 아니다.
        </p>
      </section>

      <section id="ownership-map" className="mb-16 scroll-mt-20" data-session-owner-map>
        <h2 className="text-2xl font-bold">공통 하네스의 여섯 소유권에 다시 연결하기</h2>
        <div className="not-prose mt-6 overflow-hidden rounded-md border border-border">
          <dl className="divide-y divide-border">
            {ownershipRows.map(([owner, evidence, boundary]) => (
              <div key={owner} className="grid gap-2 px-4 py-4 sm:grid-cols-[9rem_12rem_minmax(0,1fr)] sm:gap-4">
                <dt className="text-sm font-bold">{owner}</dt>
                <dd><code className="break-words text-xs [overflow-wrap:anywhere]">{evidence}</code></dd>
                <dd className="text-xs leading-5 text-muted-foreground">{boundary}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
