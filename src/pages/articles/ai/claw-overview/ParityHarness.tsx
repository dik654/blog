import { CitationBlock } from "@/components/ui/citation";
import ParityHarnessViz from "./viz/ParityHarnessViz";
import SseFlowViz from "./viz/SseFlowViz";
import ParityPipelineViz from "./viz/ParityPipelineViz";

const LOGIN_FIXTURE = [
  ["Arrange", "고정 workspace에 failing login test, source file과 before hash를 준비합니다."],
  ["Script", "mock provider가 read→edit→test tool call과 마지막 설명을 정해진 SSE frame으로 보냅니다."],
  ["Enforce", "registry와 permission decision을 기록하고 denied case에서는 executor가 호출되지 않았음을 확인합니다."],
  ["Assert effect", "허용 case의 diff가 예상 범위인지, test exit code와 receipt가 완료 조건을 만족하는지 검사합니다."],
  ["Assert state", "tool result·test evidence·final response가 올바른 순서로 session에 commit됐는지 확인합니다."],
] as const;

const TEST_LAYERS = [
  {
    layer: "Parser / unit",
    proves: "frame 조립, JSON parse, permission function 같은 작은 invariant",
    misses: "실제 CLI composition과 file/process side effect",
    cadence: "모든 commit에서 빠르게 실행",
  },
  {
    layer: "Deterministic parity",
    proves: "고정 fixture에서 request·trace·decision·effect의 재현 가능한 equivalence",
    misses: "새로운 login variant와 실제 provider·OS 차이",
    cadence: "모든 pull request에서 paired run",
  },
  {
    layer: "Provider contract",
    proves: "실제 provider의 인증, request schema, SSE·error·rate-limit protocol, proxy와 cancellation 경로",
    misses: "workspace permission과 patch의 의미적 정답",
    cadence: "격리한 credential로 scheduled test·release canary",
  },
  {
    layer: "Sandbox / OS integration",
    proves: "실제 filesystem permission, symlink, process signal과 sandbox enforcement",
    misses: "live provider drift와 여러 사용자 요청에 대한 일반화",
    cadence: "지원 OS별 integration run·release candidate",
  },
  {
    layer: "Semantic / E2E evaluation",
    proves: "실제 request부터 verified response까지와 unseen login case에서 patch의 의미·부작용",
    misses: "host permission invariant와 모든 장기 code quality를 단독 보장",
    cadence: "사전 등록한 slice로 release 전·canary 후 비교",
  },
] as const;

const FAILURE_INJECTIONS = [
  {
    fault: "SSE가 block 종료 전에 끊김",
    result: "incomplete_stream",
    invariant: "미완성 assistant/tool message를 commit하지 않고 executor를 호출하지 않음",
    exit: "retryable 또는 failed",
  },
  {
    fault: "완성된 tool input이 malformed JSON",
    result: "invalid_tool_input",
    invariant: "executor·workspace mutation이 0이고 invalid input을 session tool call로 확정하지 않음",
    exit: "failed",
  },
  {
    fault: "edit 또는 test permission 거부",
    result: "permission_denied",
    invariant: "process·file handle을 열지 않고 before hash를 유지함",
    exit: "denied 또는 approval-required",
  },
  {
    fault: "file write가 중간에 실패",
    result: "partial_write",
    invariant: "원본 보존·rollback 여부와 남은 diff를 기록하고 완료로 표시하지 않음",
    exit: "failed 또는 needs-review",
  },
  {
    fault: "수정 뒤 login regression test 실패",
    result: "verification_failed",
    invariant: "diff·test log를 보존하되 완료 response와 success state를 만들지 않음",
    exit: "needs-review",
  },
] as const;

export default function ParityHarness() {
  return (
    <section id="parity-harness" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Deterministic parity는 실행 계약을 고정하지만 답의 품질 전체를 증명하지는 않습니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Deterministic harness는 같은 input에 같은 provider frame, 같은 tool result, 같은 clock·ID를 공급합니다. 실행할 때마다 같은
          관찰이 나오는 test 환경입니다. Network와 live model의 변동을 제거하므로 provider stream parser, tool roundtrip,
          permission, session transition의 회귀를 정확히 재현할 수 있습니다.
        </p>
        <p>
          하지만 “두 실행 trace가 같다”와 “login bug를 올바르게 고쳤다”는 다른 질문입니다. 전자는 정해 둔 contract의 deterministic
          equivalence이고 후자는 unseen login condition, 보안, 유지보수성, user intent까지 보는 semantic quality입니다. Harness가
          scripted patch 하나만 기대한다면 엉뚱한 hard-coded fix도 parity를 통과할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <ParityHarnessViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>로그인 버그를 하나의 acceptance fixture로 고정합니다</h3>
        <p>
          아래는 현재 repository에 동일한 이름으로 들어 있다고 주장하는 기존 scenario가 아니라 공개 mock harness의 메커니즘으로 고정 사례를 검증할 때 추가할
          설계입니다. Fixture는 model이 낼 법한 답을 흉내 내는 데서 끝나지 않고 host가 지켜야 할 precondition과 artifact를 포함해야 합니다.
        </p>
      </div>

      <ol className="not-prose my-7 min-w-0 space-y-3">
        {LOGIN_FIXTURE.map(([title, body], index) => (
          <li key={title} className="grid min-w-0 gap-3 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[2rem_7rem_minmax(0,1fr)]">
            <span className="text-xs font-semibold tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="min-w-0 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          성공 case만 두면 permission과 rollback 경계를 검증할 수 없습니다. 같은
          fixture를 <code>workspace-write</code> 허용과 read-only 거부로 나누고,
          거부 case에서는 file hash, process start count와 session exit state가
          변하지 않았는지 검사합니다. Test가 실패하는 variant에서는 edit가
          있었더라도 final response가 “완료”가 아니라 failed 또는 needs-review로
          끝나야 합니다. Write 도중 일부 byte만 반영되는 partial-write variant도
          넣어 원본 보존 또는 명시적 rollback 상태를 검사합니다.
        </p>

        <h3>SSE는 token 문자열이 아니라 순서가 있는 protocol입니다</h3>
        <p>
          Server-Sent Events(SSE)는 server가 HTTP connection 위로 여러 event를
          순서대로 밀어 보내는 형식입니다. Text response라면 message와 content
          block의 시작·delta·종료를 조립하고, tool call이라면 여러
          <code>input_json_delta</code> 조각을 모은 뒤 block이 완성됐을 때 한 번만
          JSON으로 parse해야 합니다. 중간 조각을 곧바로 실행하면 incomplete input이
          side effect로 이어질 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <SseFlowViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Failure fixture에는 block 종료 전 disconnect, 잘못된 JSON, 뒤섞인 block index, provider error, tool call 뒤
          text-only 종료를 포함합니다. Parser는 이를 정상 final answer로 꾸미지 말고 typed error와 incomplete state를 반환해야 합니다.
          executor 호출 수가 0인지도 함께 확인합니다. 완성되지 않은 tool input을 정상 assistant tool-call message로 session에 commit해서도
          안 됩니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {FAILURE_INJECTIONS.map((item) => (
          <article
            key={item.fault}
            className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.7fr)_minmax(0,1.35fr)_minmax(0,.65fr)]"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">주입한 실패</p>
              <h3 className="mt-1 break-words text-sm font-semibold">{item.fault}</h3>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Typed result</p>
              <p className="mt-1 break-words font-mono text-xs text-primary">{item.result}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">지켜야 할 state·effect</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.invariant}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">종료 상태</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.exit}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Typed error와 다음 행동은 같은 개념이 아닙니다. 예를 들어 일시적인
          disconnect는 bounded retry 대상일 수 있지만 malformed input을 같은
          내용으로 반복해서는 안 됩니다. <code>approval-required</code>는 사용자
          결정 전까지 side effect를 멈추는 상태이고, <code>fatal</code>은 자동
          retry 없이 실패 evidence를 반환하는 상태입니다. Retry 가능 여부·최대
          횟수·backoff는 error type과 별도의 host policy로 고정합니다.
        </p>

        <h3>Byte equality와 semantic trace equality를 구분합니다</h3>
        <p>
          Wire protocol 자체를 검사할 때는 frame byte가 중요할 수 있습니다. 그러나 UUID, timestamp, temp path, map iteration
          order, 자연어 문장까지 byte로 비교하면 의미 없는 실패가 늘어납니다. Login fixture의 semantic trace에는 tool name·canonical
          arguments, permission result, edit target, diff digest, test exit code, turn exit state를 남깁니다. 비결정적
          field는 사전에 정의한 normalizer로 바꿉니다.
        </p>
        <p>
          자연어 final response는 필수 evidence를 포함하는지와 성공·실패를 정확히 표현하는지 구조적으로 검사할 수 있지만 단어 순서가 같다고 patch 품질이 좋아지는
          것은 아닙니다. 문장이 다르더라도 동일 diff와 test evidence를 정확히 보고하면 deterministic host contract는 지킬 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {TEST_LAYERS.map((item) => (
          <article key={item.layer} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{item.layer}</h3>
            <p className="mt-1 break-words text-[11px] leading-5 text-primary">{item.cadence}</p>
            <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-300">말할 수 있는 것</dt>
                <dd className="mt-1 break-words text-muted-foreground">{item.proves}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-rose-700 dark:text-rose-300">남는 사각지대</dt>
                <dd className="mt-1 break-words text-muted-foreground">{item.misses}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="not-prose my-8 min-w-0">
        <ParityPipelineViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Semantic quality는 fixture 밖의 반례로 검사합니다</h3>
        <p>
          Login patch가 정말 유효한지 보려면 expired token, malformed response,
          concurrent refresh, network timeout처럼 scripted happy path에 없던 case를
          추가하고 기존 인증 test 전체를 실행해야 합니다. Patch가 authentication
          check를 통째로 우회했다면 한 fixture의 401은 사라져도 보안 품질은
          악화됩니다. 그래서 deterministic parity receipt와 semantic evaluation
          report를 별도 artifact로 남깁니다.
        </p>
        <p>
          Release decision은 두 결과를 함께 봅니다. Host contract mismatch는 regression이므로 먼저 고칩니다. semantic slice가 나빠졌다면
          원인과 영향 범위를 조사합니다. Live provider canary에서는 protocol drift와 latency를 관찰하되 secret을 fixture에 복사하지 않습니다.
          실패 시 pinned binary와 permission·runtime config, fixture·normalizer를 한 묶음으로 rollback할 수 있어야 합니다.
        </p>
        <p>
          이관이나 큰 refactor 전후에는 base와 candidate의 Rust·Python full commit SHA, fixture·normalizer version,
          workspace digest, 동일 request와 permission config를 고정한 paired run을 남깁니다. 의도된 차이는 단순 snapshot 갱신이 아니라
          ADR이나 compatibility note에 이유를 기록하고 양쪽 fixture의 expected result를 review한 뒤 함께 바꿉니다. Canary가 실제
          provider contract, deny path 또는 사전 등록한 semantic slice의 acceptance threshold를 벗어나면 이전
          binary·config·fixture·normalizer 조합으로 rollback합니다. 두 run의 request·trace·diff·test receipt와 artifact
          digest는 release provenance로 보존합니다.
        </p>
      </div>

      <div
        id="paper-claw-parity-harness"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Mock parity harness</p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned mock_parity_harness.rs"
          citeKey={5}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/tests/mock_parity_harness.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Live provider와 real network만으로는 streaming·tool·permission 실패를 같은 조건에서 반복하기 어려워 port regression의 원인을 분리하기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Clean environment의 CLI를 scripted provider service에 연결하고 tool roundtrip, allow·deny와 captured request를 scenario별 assertion으로 검사합니다.</p>
            <p><strong>전제·조건:</strong> 지정한 commit의 fixture와 assertion이 표현하는 behavior만 검증하며 mock service·workspace·permission mode·normalization을 고정해야 합니다.</p>
            <p><strong>근거 범위:</strong> 이 절의 deterministic provider, clean workspace, permission branch와 structured report 패턴을 실제 test code로 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 이 글의 login fixture가 현재 file에 이미 존재하거나, scenario 통과가 Claude Code·Codex 전체 parity, 실제 provider compatibility, patch의 semantic correctness와 보안을 증명한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
