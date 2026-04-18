import PluginArchViz from './viz/PluginArchViz';
import PluginSubprocessViz from './viz/PluginSubprocessViz';
import RegisterFlowViz from './viz/RegisterFlowViz';
import PluginVsMcpViz from './viz/PluginVsMcpViz';

export default function PluginTools() {
  return (
    <section id="plugin-tools" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">플러그인 도구 통합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PluginArchViz />

        {/* ── 플러그인 vs 빌트인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">플러그인 도구의 위치</h3>
        <p>
          <code>GlobalToolRegistry</code>는 3계층 구조 — <strong>빌트인 + 플러그인 + MCP(런타임)</strong><br />
          플러그인은 정적 확장 계층 — 프로세스 시작 시 <code>settings.json</code> 파싱 후 고정<br />
          MCP는 동적 확장 계층 — 런타임 중에 서버 추가/제거 가능
        </p>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">GlobalToolRegistry 내부 상태</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">builtin</p>
              <p className="text-xs text-muted-foreground"><code className="text-xs">Vec&lt;ToolSpec&gt;</code> &mdash; 고정 40개 (<code className="text-xs">mvp_tool_specs()</code>)</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">plugin_tools</p>
              <p className="text-xs text-muted-foreground"><code className="text-xs">Vec&lt;PluginTool&gt;</code> &mdash; 정적 확장 (<code className="text-xs">settings.json</code>)</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">runtime_tools</p>
              <p className="text-xs text-muted-foreground"><code className="text-xs">Vec&lt;RuntimeToolDefinition&gt;</code> &mdash; 동적 확장 (MCP)</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-sm font-semibold">enforcer</p>
              <p className="text-xs text-muted-foreground"><code className="text-xs">Option&lt;PermissionEnforcer&gt;</code> &mdash; 권한 검증 담당</p>
            </div>
          </div>
        </div>
        <p>
          세 계층의 <strong>수명 차이</strong>가 핵심:<br />
          - 빌트인: 컴파일 타임 결정, 프로세스 종료까지 불변<br />
          - 플러그인: 설정 파싱 시점에 결정, 재시작 전까지 불변<br />
          - MCP: 런타임 이벤트(서버 연결/해제)에 따라 동적 변경
        </p>
      </div>
      <PluginSubprocessViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── PluginManifest ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PluginManifest 구조</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* JSON 매니페스트 */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-xs font-mono text-muted-foreground mb-3">plugin-manifest.json 예시</p>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <code className="text-xs font-mono">name</code>
                  <span className="text-xs text-muted-foreground"><code className="text-xs">"my-linter"</code></span>
                </div>
                <div className="flex justify-between items-baseline">
                  <code className="text-xs font-mono">version</code>
                  <span className="text-xs text-muted-foreground"><code className="text-xs">"0.1.0"</code></span>
                </div>
                <div className="flex justify-between items-baseline">
                  <code className="text-xs font-mono">kind</code>
                  <span className="text-xs text-muted-foreground"><code className="text-xs">"tool-provider"</code></span>
                </div>
                <div className="flex justify-between items-baseline">
                  <code className="text-xs font-mono">entrypoint</code>
                  <span className="text-xs text-muted-foreground"><code className="text-xs">"./bin/my-linter"</code></span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <p className="text-xs font-semibold mb-1">tools[0]</p>
                  <p className="text-xs text-muted-foreground"><code className="text-xs">name: "lint_check"</code>, <code className="text-xs">permission: ReadOnly</code></p>
                  <p className="text-xs text-muted-foreground"><code className="text-xs">input_schema</code>: <code className="text-xs">path</code> (string, required)</p>
                </div>
              </div>
            </div>
            {/* Rust struct */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-xs font-mono text-muted-foreground mb-3">Rust struct 매핑</p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">name: String</code>
                  <span className="text-xs text-muted-foreground">플러그인 이름</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">kind: PluginKind</code>
                  <span className="text-xs text-muted-foreground">유형 enum</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">entrypoint: PathBuf</code>
                  <span className="text-xs text-muted-foreground">실행 파일 경로</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">tools: Vec&lt;ToolSpec&gt;</code>
                  <span className="text-xs text-muted-foreground">제공 도구 목록</span>
                </div>
              </div>
              <div className="border-t border-border pt-2">
                <p className="text-xs font-semibold mb-1">PluginKind enum</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">ToolProvider</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">HookProvider</span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">ContextProvider</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>PluginKind</code>로 플러그인 유형을 명시 — ToolProvider만 도구 레지스트리에 등록<br />
          <code>entrypoint</code>는 서브프로세스로 실행되는 실행 파일 경로 — 언어 무관(Rust, Python, Go, Node.js 등)<br />
          <code>tools</code> 배열이 해당 플러그인이 제공하는 도구 목록
        </p>

        {/* ── 등록 플로우 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PluginRegistry 등록 플로우</h3>
      </div>
      <RegisterFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">PluginRegistry::register() &mdash; 등록 검증</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-semibold">이름 충돌 검사</p>
                <p className="text-xs text-muted-foreground">빌트인/다른 플러그인 도구명과 비교 &mdash; 중복 시 <code className="text-xs">Err("duplicate tool name")</code></p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-semibold">entrypoint 파일 존재 검증</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">manifest.entrypoint.is_file()</code> &mdash; 경로에 실행 파일이 없으면 거부</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-semibold">실행 권한 검증 (Unix)</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">permissions().mode() &amp; 0o111</code> &mdash; Windows는 <code className="text-xs">.exe</code> 확장자만 확인</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="text-sm font-semibold">전역 레지스트리 추가</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">plugins.push(Plugin::new(manifest))</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>3단계 검증</strong>: 이름 충돌 → 파일 존재 → 실행 권한<br />
          이름 충돌은 <strong>빌트인/다른 플러그인 도구명과 비교</strong> — 모든 도구명이 유일해야 함<br />
          실행 권한 검증은 Unix 한정 — Windows는 <code>.exe</code> 확장자만 확인
        </p>

        {/* ── 서브프로세스 실행 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 도구 호출 — 서브프로세스 통신</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">execute_plugin_tool() &mdash; 서브프로세스 통신 5단계</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-semibold">서브프로세스 spawn</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">Command::new(plugin.entrypoint).arg("--tool").arg(tool_name)</code> &mdash; stdin/stdout/stderr 파이프</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-semibold">stdin으로 JSON 입력 전송</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">stdin.write_all(json)</code> + <code className="text-xs">shutdown()</code>으로 EOF 전송</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-semibold">stdout에서 결과 수신</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">tokio::time::timeout(30s, child.wait_with_output())</code> &mdash; MCP(120초)보다 짧은 타임아웃</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="text-sm font-semibold">종료 코드 검증</p>
                <p className="text-xs text-muted-foreground">비정상 종료 시 stderr 내용을 에러 메시지에 포함</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">5</span>
              <div>
                <p className="text-sm font-semibold">JSON 파싱</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">serde_json::from_slice::&lt;ToolOutput&gt;(&output.stdout)</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>stdin/stdout JSON 프로토콜</strong>: 요청은 stdin, 응답은 stdout<br />
          stderr는 에러/로그 전용 — 종료 코드 비정상 시 stderr 내용을 에러 메시지에 포함<br />
          <strong>타임아웃 30초</strong>: MCP(기본 120초)보다 짧음 — 플러그인은 경량 연산 가정
        </p>

        {/* ── 격리 보장 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">서브프로세스 격리 보장</h3>
        <p>
          플러그인은 <strong>별도 프로세스</strong>로 실행되어 claw-code 메인 프로세스와 메모리/파일 디스크립터 격리<br />
          플러그인 크래시해도 메인 프로세스 영향 없음 — <code>execute_plugin_tool()</code>이 에러 반환 후 계속 실행<br />
          <strong>자원 제한</strong>: Unix에서는 <code>setrlimit</code>으로 CPU·메모리 한계 설정 가능 (선택)
        </p>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">Unix rlimit 적용 (선택 기능)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-sm font-semibold">CPU 시간 제한</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">libc::setrlimit(RLIMIT_CPU, limits.cpu_secs)</code></p>
              <p className="text-xs text-muted-foreground">무한 루프 방지</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-sm font-semibold">메모리 제한</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">libc::setrlimit(RLIMIT_AS, limits.mem_bytes)</code></p>
              <p className="text-xs text-muted-foreground">메모리 누수 방지</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2"><code className="text-xs">pre_exec</code> 클로저: fork 후 exec 전 실행 &mdash; 자식 프로세스에만 적용, <code className="text-xs">unsafe</code> 블록 필수 (libc 직접 호출)</p>
        </div>
        <p>
          <code>pre_exec</code>는 fork 후 exec 전에 실행되는 클로저 — 자식 프로세스에만 rlimit 적용<br />
          <code>unsafe</code> 블록: libc 직접 호출 필요 — Rust 표준 라이브러리에 setrlimit 래퍼 없음<br />
          플러그인이 무한 루프·메모리 누수 상황에도 메인 프로세스 보호
        </p>

        {/* ── 플러그인 권한 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 도구의 권한 처리</h3>
        <p>
          플러그인 도구도 <strong>PermissionMode</strong> 체계를 따름 — 매니페스트의 <code>required_permission</code> 필드가 최소 권한 지정<br />
          플러그인이 <code>DangerFullAccess</code>를 요구하면 Prompt 모드에서 사용자 확인 필수<br />
          <strong>신뢰된 플러그인</strong>: <code>settings.json</code>의 <code>trusted_plugins</code> 리스트에 등재 시 Prompt 생략
        </p>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">settings.json &mdash; 플러그인 신뢰 설정</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
              <div>
                <p className="text-sm font-mono"><code className="text-xs">/opt/claw/plugins/my-linter</code></p>
                <p className="text-xs text-green-700 dark:text-green-300">trusted: true &mdash; Prompt 생략</p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <div>
                <p className="text-sm font-mono"><code className="text-xs">/opt/claw/plugins/risky-tool</code></p>
                <p className="text-xs text-red-700 dark:text-red-300">trusted: false &mdash; Prompt 필수</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 인사이트 ── */}
      </div>
      <PluginVsMcpViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 플러그인 vs MCP — 언제 무엇을 쓰나</p>
          <p>
            <strong>플러그인이 유리한 경우</strong>:<br />
            - 프로젝트 전용 커스텀 도구 (예: 사내 린터, 배포 스크립트)<br />
            - 수명이 짧은 도구 — 호출당 1회 실행 후 종료<br />
            - 언어 중립 — 실행 파일만 있으면 됨 (Bash 스크립트도 가능)
          </p>
          <p className="mt-2">
            <strong>MCP가 유리한 경우</strong>:<br />
            - 장수명 서버 — DB 연결, API 인증 세션 등 상태 유지<br />
            - 여러 도구를 한 서버에서 제공 — 리소스 공유<br />
            - 표준화된 프로토콜 필요 — 외부 공개/공유 도구
          </p>
          <p className="mt-2">
            <strong>구분 기준</strong>: "호출당 stateless → 플러그인, 연결당 stateful → MCP"<br />
            claw-code는 이 이중 확장 구조로 <strong>간단한 확장(플러그인)과 복잡한 통합(MCP)</strong>을 모두 커버
          </p>
        </div>

      </div>
    </section>
  );
}
