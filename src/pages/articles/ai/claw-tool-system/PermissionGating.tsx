import PermissionMatrixViz from './viz/PermissionMatrixViz';
import PermissionDecisionViz from './viz/PermissionDecisionViz';

export default function PermissionGating() {
  return (
    <section id="permission-gating" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도구별 권한 게이팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PermissionMatrixViz />

        {/* ── PermissionMode 3단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PermissionMode — 3단계 권한 모드</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">ReadOnly</p>
            <p className="text-xs text-muted-foreground mt-1">읽기만 허용 — 파일 변경 및 실행 불가</p>
            <p className="text-xs font-mono mt-2 text-blue-600 dark:text-blue-400">--read-only</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">WorkspaceWrite</p>
            <p className="text-xs text-muted-foreground mt-1">워크스페이스 내 쓰기 허용 — 임의 명령은 Prompt</p>
            <p className="text-xs font-mono mt-2 text-amber-600 dark:text-amber-400">기본값</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">DangerFullAccess</p>
            <p className="text-xs text-muted-foreground mt-1">모든 작업 허용 — Prompt 없이 즉시 실행</p>
            <p className="text-xs font-mono mt-2 text-red-600 dark:text-red-400">--dangerously-skip-permissions</p>
          </div>
        </div>
        <p>
          <strong>ReadOnly</strong>: 탐색·이해 단계 — 사용자가 코드베이스를 읽기만 원할 때<br />
          <strong>WorkspaceWrite</strong>: 일반 작업 모드 — 파일 편집 허용, 임의 명령은 사용자 확인<br />
          <strong>DangerFullAccess</strong>: CI/자동화 모드 — 모든 확인 스킵, 신뢰된 환경 전제
        </p>
        <p>
          기본 모드는 <strong>WorkspaceWrite</strong> — 대부분의 개발 워크플로우에 적합<br />
          CLI 플래그 <code>--dangerously-skip-permissions</code>로 <strong>DangerFullAccess</strong> 전환<br />
          <code>--read-only</code> 플래그로 <strong>ReadOnly</strong> 전환
        </p>

        {/* ── 도구-모드 매트릭스 ── */}
      </div>
      <PermissionDecisionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">도구 × 모드 매트릭스</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">도구</th>
                <th className="border border-border px-3 py-2 text-center">ReadOnly</th>
                <th className="border border-border px-3 py-2 text-center">WorkspaceWrite</th>
                <th className="border border-border px-3 py-2 text-center">DangerFullAccess</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>read_file</code>, <code>glob_search</code>, <code>grep_search</code></td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>write_file</code>, <code>edit_file</code></td>
                <td className="border border-border px-3 py-2 text-center text-red-600">Deny</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>bash</code>, <code>PowerShell</code></td>
                <td className="border border-border px-3 py-2 text-center text-red-600">Deny</td>
                <td className="border border-border px-3 py-2 text-center text-amber-600">Prompt</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>WebFetch</code>, <code>WebSearch</code></td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TaskCreate</code>, <code>TaskStop</code></td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>MCP</code>, <code>McpAuth</code></td>
                <td className="border border-border px-3 py-2 text-center text-amber-600">Prompt*</td>
                <td className="border border-border px-3 py-2 text-center text-amber-600">Prompt*</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          * MCP 서버가 "trusted" 리스트에 있으면 Prompt 생략 — <code>settings.json</code>의 <code>trusted_mcp_servers</code>로 설정
        </p>

        {/* ── 게이트 판정 로직 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PermissionEnforcer::check() 내부</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">PermissionEnforcer::check() 판정 흐름</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-semibold">도구 스펙 조회</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">registry.get_spec(tool_name)</code> — 도구의 <code className="text-xs">required_permission</code> 획득</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-semibold">모드-권한 비교</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">current &gt;= required</code> 이면 즉시 <strong>Allow</strong> &mdash; PartialOrd 기반 비교</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-semibold">차액 판정 &mdash; Prompt 승격</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">can_prompt()</code> 가능 + DangerFullAccess 요구 시 &rarr; <strong>Prompt</strong> (<code className="text-xs">"Run: {cmd}?"</code>)</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="text-sm font-semibold">차액 거부</p>
                <p className="text-xs text-muted-foreground">승격 불가 시 <strong>Deny</strong> &mdash; <code className="text-xs">"{tool} requires {required} mode (current: {current})"</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>비교 연산자</strong>: <code>PermissionMode</code>에 <code>PartialOrd</code> 구현 —
          ReadOnly &lt; WorkspaceWrite &lt; DangerFullAccess<br />
          <code>current &gt;= required</code>가 참이면 즉시 Allow<br />
          차이가 있으면 Prompt 가능 여부 판단 — 사용자 승인으로 임시 승격 허용
        </p>

        {/* ── 경로 기반 게이팅 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">경로 기반 세밀 게이팅 — 파일 I/O 전용</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">check_file_path() &mdash; 3단계 경로 검증</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                <p className="text-sm font-semibold">워크스페이스 경계</p>
              </div>
              <p className="text-xs text-muted-foreground"><code className="text-xs">path.starts_with(workspace_root)</code></p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">실패 시: <code className="text-xs">"path outside workspace"</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">2</span>
                <p className="text-sm font-semibold">블랙리스트 매칭</p>
              </div>
              <p className="text-xs text-muted-foreground"><code className="text-xs">blacklist.matches(path)</code></p>
              <p className="text-xs text-muted-foreground mt-1">대상: <code className="text-xs">.env</code>, <code className="text-xs">.git/</code>, <code className="text-xs">*.pem</code>, <code className="text-xs">*.key</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">3</span>
                <p className="text-sm font-semibold">심링크 이스케이프</p>
              </div>
              <p className="text-xs text-muted-foreground"><code className="text-xs">path.canonicalize()</code></p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">실패 시: <code className="text-xs">"symlink escape detected"</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>3단계 경로 검증</strong>: 워크스페이스 경계 → 블랙리스트 → 심링크 이스케이프<br />
          <code>canonicalize()</code>는 심링크를 실제 경로로 해석 — 공격자가 <code>workspace/link → /etc/passwd</code> 심링크로 우회 시도를 차단<br />
          블랙리스트 기본값: <code>.env</code>, <code>.git/</code>, <code>node_modules/</code>, <code>*.pem</code>, <code>*.key</code>
        </p>

        {/* ── bash 명령 의도 분류 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">bash 명령 의도 분류 — CommandIntent</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">CommandIntent &mdash; 8가지 bash 명령 의도 분류 (첫 단어 매칭)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-xs font-bold text-green-700 dark:text-green-300">Read</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">ls</code> <code className="text-xs">cat</code> <code className="text-xs">grep</code> <code className="text-xs">find</code></p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Write</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">mv</code> <code className="text-xs">cp</code> <code className="text-xs">mkdir</code> <code className="text-xs">touch</code></p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-xs font-bold text-red-700 dark:text-red-300">Destructive</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">rm</code> <code className="text-xs">shred</code> <code className="text-xs">dd</code> <code className="text-xs">mkfs</code></p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <p className="text-xs font-bold text-purple-700 dark:text-purple-300">Network</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">curl</code> <code className="text-xs">wget</code> <code className="text-xs">ssh</code> <code className="text-xs">nc</code></p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Execute</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">./script.sh</code> <code className="text-xs">python</code> <code className="text-xs">node</code></p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3">
              <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Package</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">apt</code> <code className="text-xs">pip</code> <code className="text-xs">npm</code> <code className="text-xs">cargo</code></p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">System</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">systemctl</code> <code className="text-xs">reboot</code> <code className="text-xs">sudo</code></p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 border-dashed">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Unknown</p>
              <p className="text-xs text-muted-foreground mt-1">분류 불가 &mdash; 파이프 체인 등</p>
            </div>
          </div>
        </div>
        <p>
          <strong>8가지 의도 분류</strong>: Read, Write, Destructive, Network, Execute, Package, System, Unknown<br />
          분류 기준은 <strong>첫 단어 매칭</strong> — 간단하고 빠름, 복잡한 파이프 체인은 Unknown으로 분류<br />
          Destructive 분류 시 <strong>이중 Prompt</strong>: 사용자에게 한 번 더 확인 요구 — <code>rm -rf /</code> 같은 사고 방지
        </p>

        {/* ── 훅 오버라이드 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">훅 기반 권한 오버라이드</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">settings.json 훅 설정</p>
              <p className="text-sm font-mono mb-1"><code className="text-xs bg-muted px-1 py-0.5 rounded">PreToolUse</code></p>
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground"><code className="text-xs">command</code>: 실행할 검증 스크립트 경로</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">matcher.tool</code>: 대상 도구 필터 (예: <code className="text-xs">"bash"</code>)</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">훅 응답 JSON 프로토콜</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                  <p className="text-xs"><code className="text-xs">{'{"permission": "allow"}'}</code></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <p className="text-xs"><code className="text-xs">{'{"permission": "deny", "reason": "..."}'}</code></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <p className="text-xs"><code className="text-xs">{'{"permission": "prompt", "message": "..."}'}</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          사용자는 <code>settings.json</code>의 hooks 설정으로 도구 실행 전 자체 검증 삽입 가능<br />
          훅은 JSON 프로토콜로 <code>permission</code> 필드를 반환 — allow/deny/prompt 3중 하나<br />
          <strong>기본 Enforcer 판정 &gt; 훅 판정</strong> 순서 — Enforcer가 먼저 Deny하면 훅 호출 안 됨
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 3단계 모드인가 — 이항/5단계 대안과 비교</p>
          <p>
            <strong>이항(Allow/Deny)의 문제</strong>:<br />
            - "읽기는 허용하되 쓰기는 확인"이라는 중간 상태 표현 불가<br />
            - 개발 워크플로우에서 가장 흔한 경우가 바로 이 중간 상태<br />
            - 결과: Prompt 없이 모든 작업 허용하거나, 매번 모든 작업에 Prompt 표시 → 사용자 피로도 ↑
          </p>
          <p className="mt-2">
            <strong>5단계(예: ReadOnly/SafeWrite/FullWrite/Shell/Root)의 문제</strong>:<br />
            - 사용자가 매번 "어떤 모드인지" 기억해야 함 → 인지 부담 ↑<br />
            - 모드 간 차이가 미묘 → 실수로 과잉 권한 부여 위험<br />
            - 구현 복잡도 ↑ — 도구마다 5개 모드와의 매트릭스 유지
          </p>
          <p className="mt-2">
            <strong>3단계 모드가 최적점</strong>:<br />
            탐색(ReadOnly) → 개발(WorkspaceWrite) → 자동화(DangerFullAccess)<br />
            → 사용자의 멘탈 모델과 정확히 일치<br />
            WorkspaceWrite + Prompt 승격이 "세밀 제어"를 동시에 제공 — 단순성과 유연성의 균형
          </p>
        </div>

      </div>
    </section>
  );
}
