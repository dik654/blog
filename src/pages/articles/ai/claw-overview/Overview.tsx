import ArchitectureBoundaryViz from './viz/ArchitectureBoundaryViz';

const crates = [
  ['plugins', '독립 manifest·discovery 기반'],
  ['telemetry', '독립 usage·event 기반'],
  ['runtime', 'plugins·telemetry 사용'],
  ['api', 'runtime·telemetry 사용'],
  ['commands', 'plugins·runtime 사용'],
  ['tools', 'api·commands·plugins·runtime 사용'],
  ['compat-harness', 'commands·tools·runtime 사용'],
  ['mock-anthropic-service', 'api와 Tokio로 로컬 HTTP service 제공'],
  ['rusty-claude-cli', 'api·commands·compat·runtime·plugins·tools를 조립'],
] as const;

const scenarios = [
  ['stream', 'streaming_text'],
  ['file read/search', 'read_file_roundtrip · grep_chunk_assembly'],
  ['file write policy', 'write_file_allowed · write_file_denied'],
  ['multi tool', 'multi_tool_turn_roundtrip'],
  ['bash', 'bash_stdout_roundtrip'],
  ['permission', 'bash_permission_prompt_approved · bash_permission_prompt_denied'],
  ['plugin', 'plugin_tool_roundtrip'],
  ['state & usage', 'auto_compact_triggered · token_cost_reporting'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>먼저 실행 코드와 검증 코드를 떼어 놓는다</h2>
          <p>
            이 저장소는 한 덩어리의 “Claude Code clone”이 아니다. 사용자가 실행하는 Rust CLI 경로,
            이식 작업을 작게 모델링한 Python workspace, upstream TypeScript의 표면을 읽는
            <code>compat-harness</code>, 실제 CLI를 deterministic API에 연결하는 mock parity
            E2E가 함께 있다. 같은 개념을 다루지만 증거 수준과 실행 책임이 다르다.
          </p>
          <p>
            아래에서 층을 바꾸면 입력·핵심 객체·출력·보장하지 않는 것이 함께 바뀐다. 아키텍처를 읽을
            때 가장 먼저 해야 할 일은 “이 파일이 실제 요청을 실행하는가, 표면을 세는가, test fixture를
            만드는가”를 정하는 것이다.
          </p>
        </div>
        <ArchitectureBoundaryViz />
      </section>

      <section id="rust-workspace" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Rust 9개 crate는 의존 방향으로 읽는다</h2>
          <p>
            루트 <code>rust/Cargo.toml</code>은 <code>crates/*</code>를 workspace member로 잡고,
            각 crate의 Cargo manifest가 실제 의존 edge를 만든다. 예를 들어 runtime이 tools를
            소유하는 것이 아니라 <strong>tools가 runtime과 api·commands를 의존</strong>한다.
            최상위 CLI는 이 crate들을 조립해 binary <code>claw</code>를 만든다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {crates.map(([name, detail], index) => (
            <div key={name} className="grid gap-1 py-3 sm:grid-cols-[3rem_12rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <code className="break-words text-xs font-bold">{name}</code>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            workspace lint는 각 workspace crate에서 <code>unsafe_code = &quot;forbid&quot;</code>를
            적용한다. 이는 이 저장소 코드의 unsafe 사용을 컴파일 단계에서 막는 규칙이다. 외부
            dependency가 내부적으로 unsafe를 전혀 쓰지 않는다는 보증으로 확대하면 안 된다.
          </p>
          <h3>실제 한 turn은 crate 목록이 아니라 객체 조립과 두 번의 모델 호출로 읽는다</h3>
          <p>
            CLI는 plugin·runtime tool을 합쳐 registry를 만들고, permission policy·provider client·tool
            executor를 <code>ConversationRuntime</code>에 주입한다. 사용자가 prompt를 보내면
            <code>run_turn</code>이 User message를 Session에 넣고 첫 <code>ApiRequest</code>를 만든다.
            assistant가 <code>ToolUse</code>를 내면 runtime은 hook·permission·executor 경계를 거쳐
            결과를 <code>ToolResult</code> observation으로 Session에 추가한 뒤, 그 observation을 포함한
            두 번째 <code>ApiRequest</code>를 보낸다.
          </p>
          <p>
            이 spine이 중요한 이유는 ownership이 바뀌는 지점이 보이기 때문이다. provider stream은
            제안을 만들고, permission은 authorization을 결정하며, executor만 외부 effect를 시도한다.
            Session은 결과 observation을 보존하지만 effect truth를 소유하지 않는다. 이후 core 경로는
            이 한 turn을 Session, compaction, tool dispatch로 나눠 확대한다.
          </p>
          <p>
            그래서 오류를 찾을 때도 “도구가 안 됐다”에서 멈추지 않는다. model에 definition이
            보였는지, permission에서 거부됐는지, executor가 호출됐는지, 반환 observation이 다음
            request에 포함됐는지를 차례로 확인한다. permission denial은 executor 호출 없이도
            ToolResult를 만들 수 있고, manifest에 tool 이름이 있다는 사실은 dispatch 성공을
            증명하지 않는다. 이 반례 둘을 설명할 수 있어야 실제 실행 경로와 검증 표면을 구분한 것이다.
          </p>
        </div>
      </section>

      <section id="python-port" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Python은 path query engine이 아니라 작은 turn simulator다</h2>
          <p>
            <code>PortRuntime.route_prompt()</code>는 prompt를 단어 집합으로 만들고 ported command와
            tool의 name·source hint·responsibility에 포함되는 단어 수를 score로 쓴다. command와
            tool에서 최고 후보를 하나씩 먼저 고른 뒤, 남은 후보를 score·kind·name 순으로 채워
            기본 다섯 개까지 반환한다.
          </p>
          <p>
            <code>bootstrap_session()</code>은 context와 setup을 만들고, 선택된 registry entry의
            작은 execute 결과를 모은다. 이름에 bash가 들어간 tool은 Python port에서 permission
            denial로 표시한다. 이어 <code>QueryEnginePort</code>로 stream event와 turn result를
            만들고 session을 저장한다. 실제 provider API나 Rust <code>tool_dispatch</code>를
            호출하는 연결은 이 클래스에 없다.
          </p>
          <p>
            <code>QueryEnginePort</code>의 상태는 manifest, session id, mutable message,
            permission denial, usage, transcript다. <code>submit_message()</code>는 max turn을 먼저
            검사하고 출력·usage를 계산한 뒤 message와 transcript를 갱신한다. budget을 넘으면
            <code>max_budget_reached</code>, message가 기준보다 많으면 최근
            <code>compact_after_turns</code>개만 남긴다. 이것이 실제 필드와 method로 확인되는 경계다.
          </p>
        </div>
      </section>

      <section id="parity-evidence" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>표면 추출과 실행 패리티는 다른 질문에 답한다</h2>
          <p>
            <code>compat-harness</code>는 upstream의 <code>commands.ts</code>,
            <code>tools.ts</code>, <code>entrypoints/cli.tsx</code> 문자열을 읽는다. import·feature
            pattern으로 command와 tool manifest를 추출하고, 특정 flag 문자열의 존재로
            <code>BootstrapPlan</code> phase를 구성한다. 이는 “표면이 발견되는가”에는 답하지만
            command가 올바르게 실행되는지는 검증하지 않는다.
          </p>
          <p>
            실행 증거는 <code>mock-anthropic-service</code>와
            <code>mock_parity_harness.rs</code>에서 나온다. mock은 prompt 안의
            <code>PARITY_SCENARIO:</code> marker를 읽고 12개 중 하나의 JSON 또는 SSE 응답을
            결정적으로 돌려준다. CLI test는 깨끗한 환경에서 실제 <code>claw</code> binary를 그
            endpoint에 연결하고 파일·permission·tool roundtrip·compaction·usage 결과를 검사한다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {scenarios.map(([group, names], index) => (
            <div key={group} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-sm font-bold">{group}</p>
              <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-muted-foreground">{names}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            이 12개는 전체 Claude Code 행동의 완전한 증명이 아니다. 대신 어떤 input, filesystem
            fixture, permission 응답, mock usage를 주었을 때 CLI 전체 경로가 무엇을 출력해야 하는지
            재현 가능한 계약으로 고정한다. 새 기능은 먼저 어느 층의 증거가 필요한지 정한 뒤,
            manifest check와 E2E scenario를 구분해 추가해야 한다.
          </p>
        </div>
      </section>
    </>
  );
}
