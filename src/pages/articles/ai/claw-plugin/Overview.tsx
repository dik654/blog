import PluginKindViz from './viz/PluginKindViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PluginKind &amp; 매니페스트 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PluginKindViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">플러그인 시스템이란</h3>
        <p>
          플러그인은 claw-code를 <strong>서브프로세스 격리 방식으로 확장</strong>하는 메커니즘<br />
          역할:<br />
          - 커스텀 도구 추가 (회사 전용 린터, 배포 스크립트)<br />
          - 훅 프로바이더 (복잡한 검증 로직)<br />
          - 컨텍스트 프로바이더 (시스템 프롬프트에 정보 주입)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PluginKind 3종</h3>
        <p>
          <code>PluginKind</code> enum은 플러그인 역할을 3가지로 구분:
          <code>ToolProvider</code>(커스텀 도구 제공), <code>HookProvider</code>(Pre/Post 훅 제공), <code>ContextProvider</code>(컨텍스트 동적 주입)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-2"><code className="text-xs bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">ToolProvider</code></div>
            <p className="text-sm text-muted-foreground mb-1"><strong>실행 시점</strong>: LLM이 도구 호출 시</p>
            <p className="text-sm text-muted-foreground"><strong>출력</strong>: ToolOutput (stdout / stderr / exit_code)</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-2"><code className="text-xs bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">HookProvider</code></div>
            <p className="text-sm text-muted-foreground mb-1"><strong>실행 시점</strong>: 도구 호출 전/후</p>
            <p className="text-sm text-muted-foreground"><strong>출력</strong>: HookResponse (allow / deny / prompt / skip)</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-2"><code className="text-xs bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded">ContextProvider</code></div>
            <p className="text-sm text-muted-foreground mb-1"><strong>실행 시점</strong>: 세션 시작, 매 턴 시작</p>
            <p className="text-sm text-muted-foreground"><strong>출력</strong>: 시스템 프롬프트 삽입 텍스트</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PluginManifest 전체 스키마</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">plugin-manifest.json 구조</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">필수 필드</p>
              <div className="space-y-1 text-sm">
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">name</code> — 플러그인 고유 이름</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">version</code> — semver (예: <code className="text-xs">0.2.1</code>)</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">kind</code> — <code className="text-xs">tool-provider</code> | <code className="text-xs">hook-provider</code> | <code className="text-xs">context-provider</code></div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">entrypoint</code> — 실행 바이너리 경로 (예: <code className="text-xs">./bin/plugin-exe</code>)</div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">Kind별 추가 필드</p>
              <div className="space-y-1 text-sm">
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">tools</code> — ToolProvider 전용 도구 배열</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">hooks</code> — HookProvider 전용 훅 배열</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">context_hints</code> — ContextProvider 전용 힌트 배열</div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">permissions</p>
              <div className="space-y-1 text-sm">
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">required_mode</code> — 실행에 필요한 모드 (<code className="text-xs">ReadOnly</code> 등)</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">network_access</code> — 네트워크 필요 여부</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">workspace_write</code> — 워크스페이스 쓰기 필요 여부</div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">resource_limits</p>
              <div className="space-y-1 text-sm">
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">timeout_ms</code> — 실행 타임아웃 (기본 30000)</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">max_memory_mb</code> — 메모리 상한 (기본 128)</div>
                <div><code className="text-xs bg-muted px-1 py-0.5 rounded">max_cpu_seconds</code> — CPU 시간 상한 (기본 10)</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>kind</code>에 따라 추가 필드 요구 — ToolProvider는 tools, HookProvider는 hooks<br />
          <code>permissions</code>·<code>resource_limits</code>: 플러그인이 사용할 자원 상한 선언
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">매니페스트 로딩</h3>
        <p>
          <code>load_from_dir()</code>는 4단계 검증을 통해 플러그인 매니페스트를 안전하게 로드.
          실패 시 즉시 에러 — 불완전한 플러그인은 등록 거부.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">1. JSON 파싱</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">plugin-manifest.json</code> 읽기 후 <code className="text-xs">serde_json::from_str</code>로 역직렬화</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">2. 버전 검증</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">Version::parse</code>로 semver 형식 강제 (<code className="text-xs">0.2.1</code>, <code className="text-xs">1.0.0-beta.1</code> 등)</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">3. entrypoint 존재 확인</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">plugin_dir.join(entrypoint)</code> 경로에 파일이 실제로 존재하는지 확인</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">4. 실행 권한 확인 (Unix)</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">PermissionsExt::mode() & 0o111</code>로 실행 비트 검사 — 없으면 에러</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ToolProvider 매니페스트 예시</h3>
        <p>
          한 플러그인이 여러 도구 제공 가능 — <code>tools</code> 배열.
          각 도구는 고유 name과 JSON Schema 보유.
        </p>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">company-linter (v0.5.0) — <code className="text-xs">tool-provider</code></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-semibold">lint_check</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">ReadOnly</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">회사 표준 린터 실행</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div><code className="bg-muted px-1 py-0.5 rounded">path</code>: <code>string</code> (필수)</div>
                <div><code className="bg-muted px-1 py-0.5 rounded">strict</code>: <code>boolean</code> (기본 false)</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-sm font-semibold">lint_fix</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">WorkspaceWrite</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">린터 자동 수정</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div><code className="bg-muted px-1 py-0.5 rounded">path</code>: <code>string</code> (필수)</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>required_permission</code>: 도구별 권한 — lint_check는 ReadOnly, lint_fix는 WorkspaceWrite
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ContextProvider 매니페스트 예시</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">project-context (v0.1.0) — <code className="text-xs">context-provider</code></div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
              <span className="inline-block mt-0.5 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono whitespace-nowrap">session_start</span>
              <div>
                <p className="text-sm font-medium">프로젝트 개요 주입</p>
                <p className="text-xs text-muted-foreground">세션 시작 시 1회 실행</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
              <span className="inline-block mt-0.5 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono whitespace-nowrap">every_turn</span>
              <div>
                <p className="text-sm font-medium">현재 git 브랜치 정보</p>
                <p className="text-xs text-muted-foreground">매 턴마다 실행, <code className="text-xs bg-muted px-1 py-0.5 rounded">max_tokens: 100</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>max_tokens</code>: ContextProvider 출력 상한 — 시스템 프롬프트 비대 방지<br />
          출력은 시스템 프롬프트의 특정 섹션에 삽입 — 예: <code>## Project Context</code> 아래
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 플러그인 vs 훅 vs MCP — 3자 비교</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-1 text-left">특징</th>
                  <th className="border border-border px-2 py-1 text-left">훅</th>
                  <th className="border border-border px-2 py-1 text-left">플러그인</th>
                  <th className="border border-border px-2 py-1 text-left">MCP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-2 py-1">수명</td>
                  <td className="border border-border px-2 py-1">호출당</td>
                  <td className="border border-border px-2 py-1">호출당</td>
                  <td className="border border-border px-2 py-1">세션 전체</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1">상태 유지</td>
                  <td className="border border-border px-2 py-1">없음</td>
                  <td className="border border-border px-2 py-1">없음</td>
                  <td className="border border-border px-2 py-1">있음 (연결 유지)</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1">프로토콜</td>
                  <td className="border border-border px-2 py-1">JSON stdin/stdout</td>
                  <td className="border border-border px-2 py-1">JSON stdin/stdout</td>
                  <td className="border border-border px-2 py-1">JSON-RPC over stdio</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1">제공</td>
                  <td className="border border-border px-2 py-1">검증만</td>
                  <td className="border border-border px-2 py-1">도구/훅/컨텍스트</td>
                  <td className="border border-border px-2 py-1">도구/리소스</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            <strong>선택 가이드</strong>:<br />
            - 단순 검증·로깅 → 훅<br />
            - 커스텀 도구/컨텍스트, 프로젝트 로컬 → 플러그인<br />
            - 외부 서비스 통합, 장기 세션 → MCP
          </p>
        </div>

      </div>
    </section>
  );
}
