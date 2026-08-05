import CascadeViz from './viz/CascadeViz';

const phases = [
  ['진입·관측', 'CliEntry', 'FastPathVersion', 'StartupProfiler'],
  ['빠른 분기', 'SystemPromptFastPath', 'ChromeMcpFastPath', 'DaemonWorkerFastPath', 'BridgeFastPath', 'DaemonFastPath', 'BackgroundSessionFastPath', 'TemplateFastPath', 'EnvironmentRunnerFastPath'],
  ['본 실행', 'MainRuntime'],
] as const;

const projections = [
  ['model', '문자열 하나를 선택한다.'],
  ['hooks', 'PreToolUse·PostToolUse·PostToolUseFailure 명령 배열로 읽는다.'],
  ['plugins', '활성 플러그인·외부 디렉터리·설치 경로 등으로 읽는다.'],
  ['permission', 'mode 별칭과 allow·deny·ask 규칙을 분리해 읽는다.'],
  ['sandbox', 'filesystem mode와 격리 옵션을 타입으로 검증한다.'],
  ['provider fallbacks', 'primary와 순서 있는 fallback 모델 목록을 읽는다.'],
  ['trusted roots', '신뢰 경로 문자열 목록을 읽는다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>최종 값과 읽힌 파일은 보이지만, 모든 key의 출처가 남는 것은 아니다</h2>
          <p>
            <code>ConfigLoader</code>는 “시스템·사용자·프로젝트”라는 추상적인 세 칸을 읽지 않는다.
            실제로는 <strong>user 2개, project 2개, local 1개</strong>의 정확한 경로를 앞에서
            뒤로 순회한다. 파일이 없으면 건너뛰고, 읽힌 파일은 먼저 형식과 schema, hook 구조를
            검증한 뒤 병합한다.
          </p>
          <p>
            반환값에는 최종 <code>merged</code> object와 <code>loaded_entries</code>가 있다.
            따라서 어떤 파일을 읽었는지는 알 수 있지만, 일반 key 하나가 어느 파일에서 이겼는지
            알려 주는 per-key provenance map은 없다. 예외는 MCP server다. 같은 이름을 덮어쓸 때
            server 설정과 <code>ConfigSource</code>를 함께 저장한다.
          </p>
          <p>
            아래 실험은 원문 test fixture를 학습용으로 옮긴 것이다. local을 빼거나, legacy와 current
            파일을 각각 망가뜨려 보라. 같은 “잘못된 JSON”도 호환용 <code>.claw.json</code>과
            현재 <code>settings.json</code>에서 결과가 다른 이유가 보인다.
          </p>
        </div>
        <CascadeViz />
      </section>

      <section id="merge-projection" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>먼저 JSON을 합치고, 그다음 runtime 타입으로 읽는다</h2>
          <p>
            <code>deep_merge_objects()</code>의 분기는 둘뿐이다. 양쪽 값이 모두 object면 같은
            key 아래로 재귀 진입한다. 하나라도 object가 아니면 뒤 파일의 값으로 통째로 교체한다.
            따라서 <code>env.A</code>와 <code>env.B</code>는 함께 남지만, 뒤 파일이
            <code>plugins: [...]</code>를 다시 쓰면 앞 배열에 append하지 않는다.
          </p>
          <p>
            여기서 <code>env</code>는 deep merge를 보여 주는 <strong>raw JSON 예시</strong>다.
            <code>RuntimeFeatureConfig</code>가 process environment로 투영하는 필드가 아니다.
            provider API key는 process environment를 먼저 읽고 일부 key만 현재 디렉터리의
            <code>.env</code>를 보조 경로로 사용한다. 설정 JSON 병합과 provider 환경 변수 해석은
            서로 다른 단계다.
          </p>
          <p>
            각 파일에서 MCP server는 별도 map에도 넣는다. 같은 이름이 뒤에서 다시 나오면 server
            설정과 <code>ConfigSource</code>가 함께 교체된다. 이 추가 경로 덕분에 최종 연결 설정뿐
            아니라 user·project·local 중 누가 정의했는지도 남는다.
          </p>
        </div>

        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {projections.map(([label, detail], index) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                {label}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>permission 문자열은 runtime 의미로 정규화된다</h3>
          <p>
            <code>default</code>·<code>plan</code>·<code>read-only</code>는
            <code> ReadOnly</code>, <code>acceptEdits</code>·<code>auto</code>·
            <code>workspace-write</code>는 <code>WorkspaceWrite</code>,
            <code> dontAsk</code>·<code>danger-full-access</code>는
            <code> DangerFullAccess</code>가 된다. 최상위 <code>permissionMode</code>가 있으면
            중첩된 <code>permissions.defaultMode</code>보다 먼저 선택된다.
          </p>
          <p>
            중요한 실행 순서는 <strong>파일별 검증 → 파일별 MCP scope merge → 범용 deep merge →
            최종 typed projection</strong>이다. current settings 하나라도 validation error가 나면
            부분 결과를 반환하지 않고 load 전체가 실패한다.
          </p>
          <h3>다만 load 실패를 처리하는 방식은 호출자마다 다르다</h3>
          <p>
            <code>ConfigLoader::load()</code> 자체와 본 runtime 조립 경로는 오류를 반환해 시작을
            중단한다. 반면 alias·model·permission을 편의상 읽는 일부 CLI helper는
            <code>load().ok()?</code>로 오류를 “설정 없음”처럼 바꾼다. 특히 기본 permission helper는
            환경 변수와 config가 모두 선택되지 않으면 <code>DangerFullAccess</code>로 fallback한다.
            그러므로 “잘못된 current config는 언제나 같은 방식으로 안전하게 실패한다”라고 일반화할
            수 없다. 어떤 호출자가 읽었는지까지 확인해야 한다.
          </p>
        </div>
      </section>

      <section id="bootstrap-plan" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>12개 이름은 실행 로그가 아니라 시작 경로의 지도다</h2>
          <p>
            <code>BootstrapPlan::claude_code_default()</code>는 아래 phase를 순서대로 담는다.
            <code>from_phases()</code>는 같은 phase가 다시 나오면 처음 위치만 남긴다. 현재 파일에는
            phase를 실행하거나 시간을 재거나 실패 상태로 전이하는 코드가 없다.
          </p>
        </div>

        <div className="not-prose my-7 space-y-5 border-y border-border py-5">
          {phases.map(([group, ...items], groupIndex) => (
            <div key={group} className="grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground">0{groupIndex + 1}</p>
                <p className="mt-1 text-sm font-bold">{group}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <code key={item} className="max-w-full break-all rounded border border-border bg-muted/40 px-2 py-1 text-[11px]">
                    {item}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            따라서 이 파일만 보고 “MCP가 시작의 병목이다”, “OAuth가 10번째에 실행된다” 같은
            시간·실행 인과를 만들 수 없다. 답할 수 있는 것은 <strong>어떤 분기 이름을 어떤 순서로
            모델링했고 중복을 어떻게 제거하는가</strong>까지다.
          </p>
          <h3>실제 CLI 조립 순서는 main.rs에서 따로 읽어야 한다</h3>
          <p>
            실제 경로는 config load 뒤 plugin registry와 plugin hook을 합치고, MCP tool을 발견해
            runtime definition을 만든 다음 <code>GlobalToolRegistry</code>를 조립한다. 그 뒤
            permission policy, provider client, tool executor를 <code>ConversationRuntime</code>에
            주입한다. REPL의 매 turn은 기존 session을 복제해 이 runtime을 다시 만들고, 성공하면
            새 runtime으로 교체하며 실패하면 새 plugin runtime을 종료한다. 즉
            <code>BootstrapPlan</code>의 이름 목록과 production bootstrap의 실제 소유권은 다른
            source에서 검증해야 한다.
          </p>
        </div>
      </section>

      <section id="oauth-boundary" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>OAuth 파일은 완성된 로그인 UI가 아니라 조립 가능한 부품이다</h2>
          <p>
            helper는 <code>/dev/urandom</code>에서 PKCE verifier와 state를 만들고, S256
            challenge를 계산한다. authorization URL, code exchange form, refresh form을 만들며
            <code>/callback</code> query를 구조체로 파싱한다. 이는 흐름의 데이터 계약이지,
            브라우저를 열거나 callback HTTP server를 띄운다는 증거가 아니다.
          </p>
          <p>
            token set은 <code>CLAW_CONFIG_HOME</code> 또는 <code>~/.claw</code> 아래
            <code> credentials.json</code>의 <code>oauth</code> key에 저장된다. 저장할 때 다른
            최상위 key는 유지하고 임시 파일을 쓴 뒤 rename한다. 이 파일만으로 자동 refresh loop,
            OS keychain, 파일 mode 보장을 주장할 수는 없다.
          </p>
        </div>
      </section>

      <section id="remote-boundary" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>remote는 터미널 원격 제어가 아니라 Anthropic outbound 경로 준비다</h2>
          <p>
            활성화에는 네 조건이 모두 필요하다. <code>CLAUDE_CODE_REMOTE</code>,
            <code>CCR_UPSTREAM_PROXY_ENABLED</code>, 비어 있지 않은 remote session ID, 읽을 수 있는
            session token이다. 하나라도 없으면 <code>should_enable()</code>은 false이고 일반 직접
            경로를 막지 않는다. 원문 test 이름도 이를 <strong>fails open</strong>으로 고정한다.
          </p>
          <p>
            조건이 맞으면 WebSocket 목적지는 Anthropic base URL의
            <code>/v1/code/upstreamproxy/ws</code>로 변환되고, local proxy port가 정해진 뒤
            subprocess에 <code>HTTPS_PROXY</code>, CA bundle과 <code>NO_PROXY</code> 계열
            환경을 만든다. 로컬 CLI input과 remote runtime event를 주고받는 별도 프로토콜은 이
            소스에 없다.
          </p>
        </div>

        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-4">
            <p className="text-xs font-semibold text-muted-foreground">ENABLE CONTRACT</p>
            <p className="mt-2 text-sm font-bold">remote ∧ proxy ∧ session_id ∧ token</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">네 조건이 모두 참일 때만 local upstream proxy 환경을 구성한다.</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs font-semibold text-muted-foreground">MISSING INPUT</p>
            <p className="mt-2 text-sm font-bold">disabled state · empty subprocess env</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">인증 실패로 전체 runtime을 중단하는 보안 gateway가 아니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
