import PolicyArchViz from './viz/PolicyArchViz';
import LanePolicyActionsViz from './viz/LanePolicyActionsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PolicyEngine 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PolicyArchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PolicyEngine이란</h3>
        <p>
          PolicyEngine은 claw-code의 <strong>자율 코딩 자동화 엔진</strong><br />
          역할: 코딩 작업의 상태를 감시하고 규칙에 따라 자동 전이<br />
          사용 사례: CI/CD 파이프라인 에이전트, 야간 자동 수정, 대규모 리팩토링
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 개념 — Lane &amp; Rule</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Lane — 병렬 작업의 단위</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>하나의 <code className="text-xs bg-muted px-1 rounded">branch</code> + <code className="text-xs bg-muted px-1 rounded">workspace</code> + <code className="text-xs bg-muted px-1 rounded">task</code></li>
              <li>여러 Lane이 독립적으로 진행</li>
            </ul>
          </div>
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Rule — Lane 상태 전이 규칙</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><code className="text-xs bg-muted px-1 rounded">condition</code>(조건) + <code className="text-xs bg-muted px-1 rounded">action</code>(동작)</li>
              <li>조건 충족 시 동작 수행</li>
            </ul>
          </div>
          <div className="md:col-span-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Example</p>
            <p className="text-sm text-muted-foreground">
              조건: <code className="text-xs bg-muted px-1 rounded">"build 성공 &amp;&amp; test 성공"</code><br />
              동작: <code className="text-xs bg-muted px-1 rounded">"merge to main, create next Lane"</code>
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PolicyEngine 구조</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 rounded">PolicyEngine</code></p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-muted px-1 rounded">rules: Vec&lt;PolicyRule&gt;</code> — 상태 전이 규칙 목록</li>
              <li><code className="text-xs bg-muted px-1 rounded">lanes: HashMap&lt;LaneId, Lane&gt;</code> — 활성 Lane 맵</li>
              <li><code className="text-xs bg-muted px-1 rounded">green_contract: GreenContract</code> — 품질 게이트</li>
              <li><code className="text-xs bg-muted px-1 rounded">event_log: Vec&lt;PolicyEvent&gt;</code> — 발동 이력</li>
            </ul>
          </div>
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 rounded">Lane</code></p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-muted px-1 rounded">id: LaneId</code> — 고유 식별자</li>
              <li><code className="text-xs bg-muted px-1 rounded">branch: String</code> — 작업 브랜치</li>
              <li><code className="text-xs bg-muted px-1 rounded">status: LaneStatus</code> — 현재 상태 (7 variants)</li>
              <li><code className="text-xs bg-muted px-1 rounded">task_packet: TaskPacket</code> — 작업 명세</li>
              <li><code className="text-xs bg-muted px-1 rounded">context: LaneContext</code> — 평가 컨텍스트</li>
              <li><code className="text-xs bg-muted px-1 rounded">created_at: DateTime&lt;Utc&gt;</code> — 생성 시각</li>
            </ul>
          </div>
        </div>
        <LanePolicyActionsViz />
        <p>
          <strong>7개 LaneStatus</strong>: 작업 수명의 모든 단계 —
          Initialized → InProgress → Testing → ReadyToMerge → Merged (또는 Blocked/Abandoned)<br />
          Blocked는 이유 포함 — 빌드 실패, 테스트 실패, 의존성 대기 등<br />
          <strong>6개 PolicyAction</strong>: 상태 전이, Lane 관리, VCS 조작, 외부 통합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">evaluate_lane() — 상태 전이 평가</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">evaluate_lane(&mut self, lane_id: &LaneId) → Result&lt;()&gt;</code></p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground">Lane 조회 후 <code className="text-xs bg-muted px-1 rounded">build_context(lane)</code>로 현재 컨텍스트 수집</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground">각 규칙 순회 — <code className="text-xs bg-muted px-1 rounded">matches_lane_status()</code>로 해당 상태인지 사전 필터</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">rule.condition.evaluate(&ctx)</code> 통과 시 <code className="text-xs bg-muted px-1 rounded">apply_action()</code> 실행</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">event_log</code>에 발동 기록 후 <code className="text-xs bg-muted px-1 rounded">break</code> — 첫 매칭 규칙만 적용</p>
            </div>
          </div>
        </div>
        <p>
          <strong>first-match 정책</strong>: 첫 매칭 규칙만 실행 — 다음 루프에서 재평가<br />
          각 평가마다 컨텍스트 재수집 — 최신 상태 반영<br />
          이벤트 로그: 어떤 규칙이 언제 발동됐는지 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 평가 루프</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">policy_engine_loop(engine: Arc&lt;Mutex&lt;PolicyEngine&gt;&gt;)</code></p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">∞</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">loop</code> — 30초 간격으로 무한 반복 (<code className="text-xs bg-muted px-1 rounded">tokio::time::sleep</code>)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground">Mutex lock → 전체 <code className="text-xs bg-muted px-1 rounded">lane_ids</code> 복사 후 즉시 해제</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground">각 Lane 순차 평가 — 에러는 <code className="text-xs bg-muted px-1 rounded">log::warn!</code>만, 전체 중단 없음</p>
            </div>
          </div>
        </div>
        <p>
          <strong>30초 주기</strong>: 너무 빈번하면 CI 부하, 너무 느리면 반응 지연<br />
          각 Lane 순차 평가 — 병렬화는 향후 최적화<br />
          에러는 경고만 — 한 Lane 실패가 전체 중단으로 이어지지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PolicyRule 구조</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 rounded">PolicyRule</code></p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><code className="text-xs bg-muted px-1 rounded">name: String</code> — 규칙 이름 (로그·디버깅용)</li>
            <li><code className="text-xs bg-muted px-1 rounded">priority: u32</code> — 우선순위 (높을수록 먼저 평가)</li>
            <li><code className="text-xs bg-muted px-1 rounded">condition: PolicyCondition</code> — 발동 조건</li>
            <li><code className="text-xs bg-muted px-1 rounded">action: PolicyAction</code> — 실행할 동작 (6 variants)</li>
          </ul>
        </div>
        <p>
          <strong>6종 액션</strong>: 상태 전이, Lane 관리, VCS 조작, 외부 통합<br />
          <code>RunCommand</code>는 탈출구 — 정의된 액션으로 표현 안 될 때<br />
          액션은 <strong>비가역적</strong> — Merged 후 되돌리기 어려움
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 시나리오</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-1">야간 자동 버그 수정 파이프라인</p>
          <p className="text-xs text-muted-foreground mb-3">Lane 생성 → LLM 수정 시도 → 빌드/테스트 → 성공이면 merge, 실패면 재시도(3회) → 그래도 실패면 Abandoned</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Testing 완료 후 머지</p>
              <p className="text-xs text-muted-foreground">조건: <code className="text-xs bg-muted px-1 rounded">Testing &amp;&amp; build_green &amp;&amp; tests_pass</code></p>
              <p className="text-xs text-muted-foreground">동작: <code className="text-xs bg-muted px-1 rounded">MergeBranch</code></p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">테스트 실패 재시도</p>
              <p className="text-xs text-muted-foreground">조건: <code className="text-xs bg-muted px-1 rounded">Blocked &amp;&amp; failure_count &lt; 3</code></p>
              <p className="text-xs text-muted-foreground">동작: <code className="text-xs bg-muted px-1 rounded">Transition(InProgress)</code></p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">3회 실패 시 폐기</p>
              <p className="text-xs text-muted-foreground">조건: <code className="text-xs bg-muted px-1 rounded">Blocked &amp;&amp; failure_count &gt;= 3</code></p>
              <p className="text-xs text-muted-foreground">동작: <code className="text-xs bg-muted px-1 rounded">AbandonLane("max retries")</code></p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Merged 후 다음 이슈 픽업</p>
              <p className="text-xs text-muted-foreground">조건: <code className="text-xs bg-muted px-1 rounded">Merged &amp;&amp; queue_has_pending</code></p>
              <p className="text-xs text-muted-foreground">동작: <code className="text-xs bg-muted px-1 rounded">SpawnLane(next_from_queue())</code></p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 자율 코딩의 경계</p>
          <p>
            PolicyEngine은 <strong>완전 자동화</strong>를 가능하게 하지만 주의 필요<br />
            claw-code는 <strong>"safety guard rails"</strong> 제공:
          </p>
          <p className="mt-2">
            ✓ GreenContract: 머지 전 품질 게이트 (다음 섹션)<br />
            ✓ StaleBranch: 오래된 브랜치 자동 폐기<br />
            ✓ Notification: 중요 이벤트는 사람에게 알림<br />
            ✓ Abandoned 상태: 복구 불가 케이스 격리
          </p>
          <p className="mt-2">
            <strong>적절한 사용 사례</strong>: 반복적이고 검증 가능한 작업<br />
            - dependency 업그레이드<br />
            - 린트 경고 일괄 수정<br />
            - 테스트 커버리지 보강<br />
            - 문서 업데이트
          </p>
          <p className="mt-2">
            <strong>부적절한 사용 사례</strong>: 창의성·판단 필요 작업<br />
            - 아키텍처 설계<br />
            - 보안 수정<br />
            - 성능 최적화
          </p>
        </div>

      </div>
    </section>
  );
}
