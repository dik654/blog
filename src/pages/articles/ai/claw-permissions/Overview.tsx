import ModeLayersViz from './viz/ModeLayersViz';
import GatingPipelineViz from './viz/GatingPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PermissionMode &amp; 권한 계층</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ModeLayersViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">권한 모델 개요</h3>
        <p>
          Claw-code의 권한 시스템은 <strong>3단계 모드 + 다층 게이팅</strong> 구조<br />
          목표: LLM이 파일 시스템·셸을 조작할 때 <em>사용자 의도 밖의 작업</em>을 방지<br />
          반대 극: "무제한 실행" 에이전트 — 빠르지만 사고 위험 (rm -rf, .env 유출 등)
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-muted/60 rounded-lg p-4 border border-border">
            <div className="font-semibold text-sm mb-1"><code className="text-xs bg-background px-1.5 py-0.5 rounded">PermissionMode</code></div>
            <p className="text-sm text-muted-foreground">ReadOnly | WorkspaceWrite | DangerFullAccess 3단계 모드</p>
          </div>
          <div className="bg-muted/60 rounded-lg p-4 border border-border">
            <div className="font-semibold text-sm mb-1"><code className="text-xs bg-background px-1.5 py-0.5 rounded">PermissionPolicy</code></div>
            <p className="text-sm text-muted-foreground">규칙 리스트로 allow/deny/prompt 매칭 판정</p>
          </div>
          <div className="bg-muted/60 rounded-lg p-4 border border-border">
            <div className="font-semibold text-sm mb-1"><code className="text-xs bg-background px-1.5 py-0.5 rounded">PermissionEnforcer</code></div>
            <p className="text-sm text-muted-foreground">런타임 게이트 — <code className="text-xs">execute_tool()</code> 진입 시 호출</p>
          </div>
          <div className="bg-muted/60 rounded-lg p-4 border border-border">
            <div className="font-semibold text-sm mb-1"><code className="text-xs bg-background px-1.5 py-0.5 rounded">ContextOverride</code></div>
            <p className="text-sm text-muted-foreground">일시적 모드 변경 (특정 도구만, 1회 한정 등)</p>
          </div>
          <div className="bg-muted/60 rounded-lg p-4 border border-border sm:col-span-2">
            <div className="font-semibold text-sm mb-1"><code className="text-xs bg-background px-1.5 py-0.5 rounded">HookRunner</code></div>
            <p className="text-sm text-muted-foreground">사용자 정의 Pre/Post 훅 (JSON 프로토콜)</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">3단계 PermissionMode</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">모드</th>
                <th className="border border-border px-3 py-2 text-left">읽기</th>
                <th className="border border-border px-3 py-2 text-left">쓰기</th>
                <th className="border border-border px-3 py-2 text-left">실행</th>
                <th className="border border-border px-3 py-2 text-left">사용처</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>ReadOnly</code></td>
                <td className="border border-border px-3 py-2 text-green-600">Allow</td>
                <td className="border border-border px-3 py-2 text-red-600">Deny</td>
                <td className="border border-border px-3 py-2 text-red-600">Deny</td>
                <td className="border border-border px-3 py-2">코드베이스 탐색·리뷰</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>WorkspaceWrite</code></td>
                <td className="border border-border px-3 py-2 text-green-600">Allow</td>
                <td className="border border-border px-3 py-2 text-green-600">Allow*</td>
                <td className="border border-border px-3 py-2 text-amber-600">Prompt</td>
                <td className="border border-border px-3 py-2">일반 개발 (기본값)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>DangerFullAccess</code></td>
                <td className="border border-border px-3 py-2 text-green-600">Allow</td>
                <td className="border border-border px-3 py-2 text-green-600">Allow</td>
                <td className="border border-border px-3 py-2 text-green-600">Allow</td>
                <td className="border border-border px-3 py-2">CI/자동화</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">* WorkspaceWrite의 쓰기는 워크스페이스 경계 내부로 한정</p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PermissionMode 타입 정의</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3">PermissionMode enum</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <div className="bg-background rounded px-3 py-2 text-sm border border-border">
              <code className="text-xs font-mono">ReadOnly = 0</code>
              <p className="text-xs text-muted-foreground mt-1">읽기 전용, 가장 낮은 권한</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-sm border border-border">
              <code className="text-xs font-mono">WorkspaceWrite = 1</code>
              <p className="text-xs text-muted-foreground mt-1">워크스페이스 내 쓰기 허용 (기본값)</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-sm border border-border">
              <code className="text-xs font-mono">DangerFullAccess = 2</code>
              <p className="text-xs text-muted-foreground mt-1">모든 작업 허용, CI/자동화 전용</p>
            </div>
          </div>
          <div className="text-sm">
            <span className="font-medium">CLI 플래그 → 모드 결정</span>
            <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
              <span><code className="bg-background px-1 py-0.5 rounded">--dangerously-skip-permissions</code> → DangerFullAccess</span>
              <span><code className="bg-background px-1 py-0.5 rounded">--read-only</code> → ReadOnly</span>
              <span>플래그 없음 → WorkspaceWrite (기본값)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3"><code className="bg-background px-1 py-0.5 rounded">PartialOrd</code> derive로 <code className="bg-background px-1 py-0.5 rounded">current &gt;= required</code> 비교 — 수치 순서가 판정 기준</p>
        </div>
        <p>
          <strong>PartialOrd 구현</strong>: <code>ReadOnly &lt; WorkspaceWrite &lt; DangerFullAccess</code> 순서<br />
          <code>current &gt;= required</code> 비교로 권한 판정 — 수치 순서가 모든 것<br />
          CLI 플래그 우선순위: <code>--dangerously-skip-permissions</code> &gt; <code>--read-only</code> &gt; 기본값
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">각 모드의 실제 동작 예시</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">ReadOnly 모드</div>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-muted-foreground">User:</span> "main.rs를 읽고 내용 요약해줘"</p>
              <p><code className="text-xs bg-background px-1.5 py-0.5 rounded">read_file(main.rs)</code> → <span className="text-green-600 font-medium">Allow</span> → 읽기 성공</p>
              <p><span className="text-muted-foreground">User:</span> "이 파일에 println 추가해줘"</p>
              <p><code className="text-xs bg-background px-1.5 py-0.5 rounded">edit_file(main.rs)</code> → <span className="text-red-600 font-medium">Deny</span> → "권한 부족, 모드 변경 필요"</p>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2 text-amber-600 dark:text-amber-400">WorkspaceWrite 모드</div>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-muted-foreground">User:</span> "main.rs에 println 추가"</p>
              <p><code className="text-xs bg-background px-1.5 py-0.5 rounded">edit_file(main.rs)</code> → <span className="text-green-600 font-medium">Allow</span> (workspace 내부) → 성공</p>
              <p><span className="text-muted-foreground">User:</span> "cargo test 실행"</p>
              <p><code className="text-xs bg-background px-1.5 py-0.5 rounded">bash("cargo test")</code> → <span className="text-amber-600 font-medium">Prompt</span> → 사용자 확인 후 실행</p>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">DangerFullAccess 모드</div>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-muted-foreground">User:</span> "cargo test 실행"</p>
              <p><code className="text-xs bg-background px-1.5 py-0.5 rounded">bash("cargo test")</code> → <span className="text-green-600 font-medium">Allow</span> → 즉시 실행 (Prompt 없음)</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 3단계인가 (2도 5도 아닌)</h3>
        <p>
          <strong>2단계로 부족한 이유</strong>: Safe/Unsafe만으론 실사용 케이스 부족<br />
          - 코드 리뷰 시: 읽기만 필요 → Safe로 충분<br />
          - 개발 중: 워크스페이스 파일 편집 필요 → Safe 벗어남<br />
          - 하지만 <code>rm -rf /</code>를 실행할 필요는 없음 → Unsafe는 과도<br />
          중간 단계 없이는 개발자가 항상 Unsafe 사용 → 원래 의도 무력화
        </p>
        <p>
          <strong>5단계로 과도한 이유</strong>: 세분화해도 사용자가 구분 못함<br />
          - ReadOnly / ReadExec / WorkspaceRead / WorkspaceWrite / Full — 구별 어려움<br />
          - 매번 어느 모드인지 기억해야 함 → 인지 부하<br />
          - 세밀한 차이는 <code>PermissionPolicy</code>로 처리 가능 (그게 3계층의 정책 층)
        </p>
        <p>
          3단계는 <strong>"의도를 이름 하나로 표현"</strong> 가능한 최대치:<br />
          "나는 탐색만 할거야" / "나는 개발 중이야" / "나는 자동화 실행 중이야"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">다층 게이팅 순서</h3>
        <GatingPipelineViz />
        <p>
          <strong>조기 종료 패턴</strong>: 한 단계라도 Deny면 이후 단계 스킵<br />
          Pre-hook이 마지막 게이트 — 사용자 커스텀 로직으로 모든 게이트 오버라이드 가능<br />
          Post-hook은 차단 불가 — 이미 도구 실행됨, 경고·로깅만 수행
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 모드-정책-훅의 역할 분리</p>
          <p>
            <strong>모드</strong> = 거친 권한 수준 (누가 무엇을 할 수 있는가)<br />
            <strong>정책</strong> = 세밀한 규칙 (특정 경로 차단, 특정 명령 허용 등)<br />
            <strong>훅</strong> = 사용자 확장 (프로젝트별 커스텀 검증)
          </p>
          <p className="mt-2">
            이 3계층 구조는 <strong>구성 가능성과 안전성의 균형</strong><br />
            - 모드만 있으면 너무 거침 — 프로젝트별 차이 반영 불가<br />
            - 정책만 있으면 진입장벽 높음 — 기본 사용자에게 부담<br />
            - 훅만 있으면 일관성 없음 — 프로젝트마다 보안 수준 제각각
          </p>
          <p className="mt-2">
            3계층이 모두 있으면 <strong>"기본값은 안전, 필요하면 확장"</strong>이라는 원칙 실현
          </p>
        </div>

      </div>
    </section>
  );
}
