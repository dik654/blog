import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SpecialistEntry,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import TaskControlPlaneLab from './TaskControlPlaneLab';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

const packetFields = [
  ['objective', '무엇을 끝낼지'],
  ['scope', 'workspace, module, single file, custom 중 어디를 만질지 적는 model-facing 값'],
  ['repo', '대상 저장소를 가리키는 문자열'],
  ['branch_policy', '허용할 branch 규칙을 문자열로 기록'],
  ['acceptance_tests', '완료 전 실행해야 한다고 선언한 명령 목록'],
  ['commit_policy', 'commit을 남기는 방식'],
  ['reporting_contract', '결과 보고에 포함할 증거'],
  ['escalation_policy', '모호하거나 실패했을 때 멈출 조건'],
] as const;

const productionHandoff = [
  ['01', 'Schema를 실행과 맞춘다', 'TeamCreate가 task_id를 받을지, prompt로 task를 만들지 한 계약으로 결정한다.'],
  ['02', 'Executor를 연결한다', 'Created record를 worker process·session과 연결하고 Running 전이를 한 소유자가 수행한다.'],
  ['03', 'Receipt로 닫는다', 'exit code, artifact hash, test 결과를 확인한 뒤에만 Completed로 줄인다.'],
  ['04', '상태를 durable하게 만든다', 'process restart 뒤 task·team·cron을 복원하고 중복 실행을 막을 idempotency key를 둔다.'],
  ['05', 'Scheduler를 별도 구현한다', 'cron parse, clock, lease, missed-run policy, task spawn과 record_run을 잇는다.'],
] as const;

function CodeExcerpt({ label, children }: { label: string; children: string }) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-md border border-border bg-muted/15">
      <div className="border-b border-border px-4 py-2 font-mono text-xs font-bold text-muted-foreground">
        {label}
      </div>
      <pre className="m-0 overflow-x-auto p-4 text-xs leading-6"><code>{children}</code></pre>
    </div>
  );
}

export default function ClawTaskTeamArticle() {
  return (
    <>
      <SpecialistEntry
        eyebrow="코드베이스 원문 경로 · 다중 작업 운영"
        title="Task record를 읽기 전에 tool 호출과 worker 실행이 어디서 갈리는지 확인한다"
        description="이 글은 여러 Agent를 처음 소개하는 글이 아니라 Claw Code의 Task·Team·Cron record가 실제 실행기와 어느 지점까지 연결됐는지 검산한다. Schema가 존재하는 것, registry에 Created가 기록되는 것, worker가 실행되고 증거로 완료되는 것을 별도 사건으로 읽는다."
        prerequisites={[
          'Tool schema를 검증하는 일과 executor가 외부 side effect를 수행하는 일의 차이',
          'Worker lifecycle에서 Running·Completed 상태를 독립 evidence로 확인해야 한다는 점',
        ]}
        links={[
          { slug: 'claw-tool-system', learningPathId: 'ai-claw-core', title: '선행 · Tool schema와 executor dispatch', reason: 'RunTaskPacket 호출이 registry 함수까지 가는 입구를 먼저 읽는다.' },
          { slug: 'claw-worker-boot', learningPathId: 'ai-claw-lifecycle', title: '선행 · Worker 상태와 실제 process', reason: 'Control-plane 상태가 transport·process 실행을 자동으로 증명하지 않는 이유를 잡는다.' },
        ]}
      />
      <QuestionLead
        question="RunTaskPacket이 status: created를 반환하면 worker가 이미 일을 시작한 걸까?"
        answer={<>아니다. 이 revision에서 확인되는 일은 packet 검증과 인메모리 <code>HashMap</code> 삽입까지다. worker spawn, acceptance test 실행, terminal receipt는 별도 실행 경로가 필요하다. Team과 Cron도 현재는 실행기보다 control record에 가깝다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'control record', meaning: '무엇을 실행해야 하는지와 현재 상태를 적은 레코드.', why: '레코드 생성과 실제 외부 효과를 구분한다.' },
          { term: 'execution owner', meaning: 'worker를 시작하고 종료 상태를 관찰하는 단일 책임자.', why: '누가 Created를 Running과 Completed로 바꾸는지 고정한다.' },
          { term: 'terminal receipt', meaning: 'exit code, 테스트 결과, artifact hash처럼 완료를 다시 확인할 증거.', why: '모델이나 worker의 완료 문장만 믿지 않게 한다.' },
          { term: 'scheduler lease', meaning: '같은 예약 작업을 한 실행자만 가져가도록 하는 소유권 기록.', why: '재시작과 여러 프로세스에서 중복 실행을 막는다.' },
        ]}
      />
      <Misconception>
        현재 <code>TaskPacket</code>에는 Goal, Constraint, dependency, deadline, tag,
        completion callback이 없다. <code>CronRegistry</code>도 cron 표현식을 해석하거나 시계를
        돌리지 않는다. 아래에서는 pinned source가 실제로 보장하는 레코드와 호출 경로만 다룬다.
      </Misconception>

      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>먼저 레코드 생성과 실행을 떼어 놓는다</h2>
          <p>
            에이전트가 “테스트를 실행하고 결과를 보고하라”는 작업을 받으면 적어도 세 단계가 필요하다.
            첫째, 요청을 typed packet으로 만든다. 둘째, 실제 worker가 side effect를 수행한다.
            셋째, 독립 증거를 읽어 terminal state를 판정한다. 현재 Task·Team·Cron 구현은 첫 단계의
            일부와 상태 보관을 제공하지만 이 세 단계를 자동으로 닫지는 않는다.
          </p>
          <p>
            아래 lab에서 탭을 바꾸면 각 API가 무엇을 증명하고 무엇을 남겨 두는지 달라진다.
            특히 JSON 응답에 id와 status가 있다는 이유만으로 process가 실행됐다고 해석하면 안 된다.
          </p>
        </div>
        <TaskControlPlaneLab />
      </section>

      <section id="packet-path" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Packet은 실행 명령이 아니라 검증할 작업 계약이다</h2>
          <p>
            <code>RunTaskPacket</code>의 model-facing JSON schema는 필수 필드를 제한하고,
            executor는 JSON을 <code>TaskPacket</code>으로 역직렬화한다. 이어
            <code>validate_packet</code>이 빈 문자열과 scope별 path를 검사한다. 성공하면
            <code>ValidatedPacket</code> wrapper를 거쳐 registry에 들어간다.
          </p>
          <p>
            이 revision에는 그 두 계약 사이의 결함이 있다. Rust <code>TaskPacket</code>은
            <code> scope_path</code>와 <code>worktree</code>를 받을 수 있지만 model-facing schema는
            두 필드를 노출하지 않고 추가 필드도 금지한다. 그런데 validator는 module, single file,
            custom scope에 <code>scope_path</code>를 요구한다. 따라서 모델의 정상 tool call로 검증을
            통과할 수 있는 scope는 현재 <strong>workspace뿐</strong>이다. 아래 필드 표는 model-facing
            schema에 실제로 공개된 값만 보여 준다.
          </p>
        </div>
        <dl className="not-prose my-6 divide-y divide-border border-y border-border">
          {packetFields.map(([field, role]) => (
            <div key={field} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
              <dt className="break-words font-mono text-xs font-bold [overflow-wrap:anywhere]">{field}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">{role}</dd>
            </div>
          ))}
        </dl>
        <CodeExcerpt label="task_packet.rs · 실제 validation 범위">{`required strings
  objective, repo, branch_policy,
  commit_policy, reporting_contract, escalation_policy

scope_path required
  module | single_file | custom

schema gap
  model-facing properties에는 scope_path와 worktree가 없음
  → 정상 tool call에서 workspace 외 scope는 검증 통과 불가

acceptance_tests
  각 문자열이 비어 있지 않은지만 검사`}</CodeExcerpt>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            여기서 <code>branch_policy</code>나 <code>commit_policy</code>는 아직 문자열이다.
            validation은 정책을 해석해 git을 제한하지 않는다. <code>acceptance_tests</code>도
            명령을 실행하거나 안전성을 판정하지 않는다. “무엇을 검사하겠다고 기록했는가”와
            “그 검사가 실제로 수행됐는가”를 분리해야 한다.
          </p>
        </div>
      </section>

      <section id="task-registry" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>RunTaskPacket의 현재 종착지는 Created 레코드다</h2>
          <p>
            호출 경로는 <code>execute_tool_with_enforcer</code>의 이름별 match에서 시작해
            <code>run_task_packet</code>, <code>TaskRegistry::create_from_packet</code>,
            <code>create_task</code>로 이어진다. 마지막 함수는
            <code>Arc&lt;Mutex&lt;HashMap&lt;String, Task&gt;&gt;&gt;</code>에 새 Task를 넣고
            status를 <code>Created</code>로 설정한다.
          </p>
        </div>
        <CodeExcerpt label="tools → runtime · 실제 호출 순서">{`RunTaskPacket JSON
  → serde_json::from_value::<TaskPacket>
  → validate_packet
  → TaskRegistry::create_from_packet
  → HashMap::insert(status = Created)
  → { task_id, status, task_packet, created_at }`}</CodeExcerpt>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Registry는 get/list, user message append, output 문자열 append, team id 할당을 제공한다.
            <code>stop</code>은 Completed·Failed·Stopped 같은 terminal state를 다시 멈추는 것만
            거부한다. 반면 <code>set_status</code>는 전이 표를 검사하지 않고 임의 status를 대입한다.
            따라서 Created에서 곧바로 Completed로 바꿔도 type 수준에서는 막히지 않는다.
          </p>
          <p>
            더 중요한 경계는 process lifetime이다. 이 registry에는 파일이나 데이터베이스 persistence가
            없다. 프로세스가 끝나면 Task, message, output, status가 함께 사라진다. unit test가
            create/get과 JSON round-trip을 통과한 사실은 이 인메모리 계약을 검증하지만, background
            실행이나 재시작 복원을 증명하지 않는다.
          </p>
        </div>
      </section>

      <section id="team-cron-gap" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Team과 Cron은 현재 배선 결손을 드러내는 좋은 사례다</h2>
          <h3>TeamCreate는 schema와 executor가 다른 필드를 본다</h3>
          <p>
            model-facing schema의 <code>tasks</code> 항목은 <code>prompt</code>와 선택적
            <code>description</code>을 문서화한다. <code>additionalProperties: false</code>는
            task item이 아니라 <code>{'{ name, tasks }'}</code> 최상위 객체에만 붙는다. 따라서
            item에 <code>task_id</code>를 더 넣는 것 자체는 JSON Schema상 허용되지만 model-facing
            properties에는 나타나지 않는다. 반면 <code>run_team_create</code>는 각 item에서 오직
            <code>task_id</code>만 찾는다. 문서화된 prompt·description만 보낸 일반 호출에서는
            <code>filter_map</code>이 모든 항목을 버리고 빈 team을 만든다.
          </p>
        </div>
        <CodeExcerpt label="TeamCreate · model surface와 executor 소비 필드">{`schema item: { prompt, description? }
                         └─ additionalProperties 생략
                            (task_id 추가는 허용되지만 문서화되지 않음)

schema root: { name, tasks }
                         └─ additionalProperties: false

executor: task.get("task_id")
                         │
                         └─ 문서화된 item에는 없음

result for prompt-only items: Team { task_ids: [] }`}</CodeExcerpt>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            해결은 둘 중 하나를 명시적으로 고르는 것이다. 기존 Task id를 묶는 API라면 schema가
            <code>task_id</code>를 받아야 한다. 새 prompt마다 task를 만드는 API라면 executor가 먼저
            <code>TaskRegistry::create</code>를 호출해야 한다. 현재 구현은 어느 쪽도 완성하지 않는다.
          </p>
          <h3>CronCreate는 schedule을 저장하지만 시간이 흐르지는 않는다</h3>
          <p>
            <code>CronRegistry::create</code>는 schedule과 prompt를 문자열로 저장하고
            <code>enabled = true</code>, <code>run_count = 0</code>인 레코드를 만든다.
            registry에는 <code>record_run</code> 메서드가 있지만 public Cron tool은 create, delete,
            list만 노출한다. 별도로 agent가 성공적으로 끝나면 <code>disable_matching_crons</code>가
            manifest·result에서 뽑은 키워드와 prompt·description을 비교해 일치하는 항목을
            <code>disable</code>한다. 그러나 이것은 완료 뒤 record를 끄는 경로이지 schedule을
            소비하는 시계가 아니다. 이 범위에는 parser, next-run 계산, clock loop, task spawn,
            lease와 <code>record_run</code> 호출이 없다.
          </p>
          <p>
            따라서 <code>*/5 * * * *</code>가 저장됐다는 사실은 5분마다 실행된다는 증거가 아니다.
            “예약 표현을 보관한다”와 “예약을 소비해 effect를 만든다” 사이에 scheduler가 필요하다.
          </p>
        </div>
      </section>

      <section id="production-handoff" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Production 경로는 다섯 소유권을 더 연결해야 한다</h2>
          <p>
            현재 코드는 typed record를 시작점으로 제공한다. 이를 실제 multi-worker runtime으로
            확장할 때 필요한 것은 필드를 더 많이 넣는 것이 아니라, 각 상태 전이에 실행 증거를
            연결하는 일이다.
          </p>
        </div>
        <ol className="not-prose my-6 divide-y divide-border border-y border-border">
          {productionHandoff.map(([number, title, detail]) => (
            <li key={number} className="grid gap-2 py-4 sm:grid-cols-[3rem_12rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xl font-black text-muted-foreground/45">{number}</span>
              <strong className="text-sm">{title}</strong>
              <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
            </li>
          ))}
        </ol>
        <StopRule>
          분산 scheduler 전체 역사로 내려가지 않는다. packet 검증, control record 생성, worker 실행,
          terminal receipt가 서로 다른 계약임을 설명하고 Team/Cron의 현재 배선 결손을 코드에서 찾을 수
          있으면 다음 글로 이동한다.
        </StopRule>
      </section>

      <CapabilityCheck
        items={[
          'TaskPacket의 실제 열 필드와 존재하지 않는 필드를 구분한다.',
          'RunTaskPacket이 Created 레코드까지만 만드는 호출 순서를 설명한다.',
          'set_status가 상태 전이 규칙을 강제하지 않는 결과를 예측한다.',
          'schema-valid TeamCreate가 빈 task_ids를 만드는 이유를 찾는다.',
          'CronRegistry와 실행 가능한 scheduler 사이의 빠진 소유권을 나열한다.',
          'unit test 통과가 worker 실행과 durable persistence를 증명하지 않는 이유를 말한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-tool-system" learningPathId="ai-claw-core">도구 호출의 네 계약</InternalLink></span>
        <span>다음: <InternalLink slug="claw-subagent-orchestration" learningPathId="ai-claw-ops">실제 worker 실행 계약</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw task_packet.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/task_packet.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 실제 packet 필드와 validation 규칙.` },
          { label: 'Claw task_registry.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/task_registry.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 인메모리 Task 상태, output, team assignment와 전이 경계.` },
          { label: 'Claw team_cron_registry.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/team_cron_registry.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. Team·Cron 레코드와 process-lifetime registry.` },
          { label: 'Claw tools/src/lib.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/tools/src/lib.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. ToolSpec schema, dispatch, TeamCreate field mismatch와 Cron tool wiring.` },
        ]}
      />
    </>
  );
}
