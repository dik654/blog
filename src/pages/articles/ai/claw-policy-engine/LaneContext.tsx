import LaneContextViz from './viz/LaneContextViz';

export default function LaneContext() {
  return (
    <section id="lane-context" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LaneContext — 레인 상태 평가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LaneContextViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">LaneContext 구조</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">LaneContext</code> — 평가 시점의 스냅샷</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">식별 · 상태</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">lane_id: LaneId</code></li>
                <li><code className="bg-muted px-1 rounded">lane_status: LaneStatus</code></li>
                <li><code className="bg-muted px-1 rounded">status_changed_at: DateTime&lt;Utc&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">created_at: DateTime&lt;Utc&gt;</code></li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">빌드 · 테스트</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">last_build_status: Option&lt;BuildStatus&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">last_test_status: Option&lt;TestStatus&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">test_coverage: Option&lt;f32&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">lint_warnings: Option&lt;usize&gt;</code></li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">재시도</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">failure_count: u32</code></li>
                <li><code className="bg-muted px-1 rounded">retry_count: u32</code></li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">활동 · 의존성</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">last_activity: DateTime&lt;Utc&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">commits: Vec&lt;CommitRef&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">blocked_by: Vec&lt;LaneId&gt;</code></li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">컨텍스트 빌더 — build_context()</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">build_context(&self, lane: &Lane) → Result&lt;LaneContext&gt;</code></p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground">기본 필드 복사 — <code className="text-xs bg-muted px-1 rounded">lane_id</code>, <code className="text-xs bg-muted px-1 rounded">status</code>, <code className="text-xs bg-muted px-1 rounded">failure_count</code>, <code className="text-xs bg-muted px-1 rounded">retry_count</code>, <code className="text-xs bg-muted px-1 rounded">last_activity</code></p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">ci_client::fetch_latest_build()</code> — 빌드 상태 조회 (실패 허용)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">ci_client::fetch_latest_tests()</code> — 테스트 결과 + 커버리지 (실패 허용)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">ci_client::fetch_lint_warnings()</code> — 린트 경고 수 (실패 허용)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">5</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">git_client::log_branch()</code> — 커밋 이력 + <code className="text-xs bg-muted px-1 rounded">task_packet.depends_on</code> 의존성</p>
            </div>
          </div>
        </div>
        <p>
          <strong>컨텍스트 구축 단계</strong>: 기본 필드 → CI 조회 → git 조회 → 의존성<br />
          각 외부 조회는 실패 허용 — 일부 정보 없어도 평가 가능<br />
          매 <code>evaluate_lane()</code> 호출마다 재구축 — 항상 최신 상태
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TimeRef — 시간 참조점</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">TimeRef</code> enum + <code className="text-xs bg-muted px-1 rounded">elapsed_since()</code></p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-background border rounded px-2 py-0.5 w-28 text-center">LaneCreated</span>
              <p className="text-sm text-muted-foreground">Lane 생성 시각</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-background border rounded px-2 py-0.5 w-28 text-center">StatusChanged</span>
              <p className="text-sm text-muted-foreground">현재 상태 진입 시각</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-background border rounded px-2 py-0.5 w-28 text-center">LastActivity</span>
              <p className="text-sm text-muted-foreground">마지막 활동 시각</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-background border rounded px-2 py-0.5 w-28 text-center">LastBuild</span>
              <p className="text-sm text-muted-foreground">마지막 빌드 시각 (없으면 <code className="text-xs bg-muted px-1 rounded">Utc::now()</code>)</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-background border rounded px-2 py-0.5 w-28 text-center">FirstFailure</span>
              <p className="text-sm text-muted-foreground">첫 실패 시각 (없으면 <code className="text-xs bg-muted px-1 rounded">Utc::now()</code>)</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3"><code className="bg-muted px-1 rounded">elapsed_since()</code>: <code className="bg-muted px-1 rounded">Utc::now() - ref_time</code> 반환</p>
        </div>
        <p>
          <strong>5개 시간 참조</strong>: 상황별 기준 시각<br />
          "1시간 동안 InProgress면 blocked 체크" → <code>StatusChanged</code> 사용<br />
          "24시간 활동 없으면 stale" → <code>LastActivity</code> 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">의존성 체크 — blocked_by</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1"><code className="bg-muted px-1 rounded">TaskPacket</code></p>
              <p className="text-xs text-muted-foreground"><code className="bg-muted px-1 rounded">depends_on: Vec&lt;LaneId&gt;</code> — Lane A가 Lane B의 merge를 기다리는 상황</p>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1"><code className="bg-muted px-1 rounded">blocking_lanes()</code></p>
              <p className="text-xs text-muted-foreground"><code className="bg-muted px-1 rounded">blocked_by</code> 순회 → <code className="bg-muted px-1 rounded">Merged</code> / <code className="bg-muted px-1 rounded">Abandoned</code>가 아닌 것만 반환</p>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">YAML 규칙 예시 — 의존성 해결 대기</p>
            <p className="text-xs text-muted-foreground">
              조건: <code className="bg-muted px-1 rounded">Initialized &amp;&amp; has_blocking_lanes</code> → <code className="bg-muted px-1 rounded">transition(Blocked(WaitingForDependency))</code>
            </p>
          </div>
        </div>
        <p>
          <strong>의존성 그래프</strong>: Lane 간 DAG 구성 가능<br />
          예: refactor Lane → migration Lane → cleanup Lane<br />
          순환 의존 방지 — Lane 생성 시 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CI 통합 — ci_client</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">CiClient</code> 트레이트 — CI 시스템 추상화</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">트레이트 메서드 (3개)</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">fetch_latest_build(branch) → BuildResult</code></li>
                <li><code className="bg-muted px-1 rounded">fetch_latest_tests(branch) → TestResult</code></li>
                <li><code className="bg-muted px-1 rounded">fetch_lint_warnings(branch) → LintResult</code></li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1"><code className="bg-muted px-1 rounded">GitHubActionsClient</code> 구현체</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">repo: String</code> — 대상 리포</li>
                <li><code className="bg-muted px-1 rounded">token: String</code> — API 인증</li>
                <li>GitHub Actions REST API로 최신 워크플로우 실행 조회</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>CiClient 트레이트</strong>: CI 시스템 추상화<br />
          구현체: GitHubActions, GitLabCI, CircleCI, Jenkins<br />
          claw-code는 기본 GitHubActionsClient 제공 — 사용자가 트레이트 구현으로 확장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 전략 — 과도한 API 호출 방지</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">CachedCiClient</code> — TTL 기반 캐시 데코레이터</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">필드</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">inner</code> — 실제 CiClient</li>
                <li><code className="bg-muted px-1 rounded">cache</code> — branch별 결과 맵</li>
                <li><code className="bg-muted px-1 rounded">ttl</code> — 캐시 유효 시간</li>
              </ul>
            </div>
            <div className="sm:col-span-2 bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">동작 흐름</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li>1. Mutex lock → 캐시에서 branch 조회</li>
                <li>2. TTL 이내면 캐시 결과 반환 (API 호출 생략)</li>
                <li>3. 만료/미적중이면 <code className="bg-muted px-1 rounded">inner.fetch_latest_build()</code> 호출 후 캐시 갱신</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>30초 TTL 캐시</strong>: 같은 Lane 평가 내 중복 호출 제거<br />
          GitHub API는 시간당 5000회 제한 — 캐시 필수<br />
          여러 Lane이 같은 브랜치 체크할 때도 재활용
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: LaneContext의 "관찰 가능성" 역할</p>
          <p>
            LaneContext는 단순 데이터 구조가 아닌 <strong>관찰 가능성 레이어</strong><br />
            PolicyEngine의 모든 판단은 이 구조체를 통해
          </p>
          <p className="mt-2">
            관찰 가능성의 가치:<br />
            ✓ <strong>디버깅</strong>: "왜 이 규칙이 발동 안 했지?" → ctx 직렬화 후 수동 평가<br />
            ✓ <strong>감사</strong>: 모든 판단의 근거가 로그로 남음<br />
            ✓ <strong>테스트</strong>: LaneContext를 수동 생성하여 규칙 테스트
          </p>
          <p className="mt-2">
            <strong>안티패턴</strong>: 규칙이 전역 상태·외부 API를 직접 조회<br />
            - 재현 불가 (상황이 계속 변함)<br />
            - 네트워크 장애에 취약<br />
            - 테스트 작성 어려움
          </p>
          <p className="mt-2">
            LaneContext 중간 레이어가 <strong>"Pure Function" 평가</strong>를 가능하게 함 — 함수형 설계 원칙
          </p>
        </div>

      </div>
    </section>
  );
}
