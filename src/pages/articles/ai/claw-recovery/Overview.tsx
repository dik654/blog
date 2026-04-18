import RecoveryFlowViz from './viz/RecoveryFlowViz';
import FailureClassesViz from './viz/FailureClassesViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">복구 시스템 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RecoveryFlowViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">복구가 필요한 상황</h3>
        <p>
          자율 코딩 Lane에서 발생 가능한 문제:<br />
          - 빌드 실패<br />
          - 테스트 실패<br />
          - merge conflict<br />
          - 무한 루프 (같은 시도 반복)<br />
          - stale branch (활동 없이 오래됨)<br />
          각 상황에 맞는 <strong>복구 레시피</strong>가 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Recovery 모듈 구성</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">runtime/recovery.rs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>RecoveryRecipe</code></p>
              <p className="text-xs text-muted-foreground mt-1">복구 절차 정의</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>RecoveryEngine</code></p>
              <p className="text-xs text-muted-foreground mt-1">레시피 선택 · 실행</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>RecoveryPolicy</code></p>
              <p className="text-xs text-muted-foreground mt-1">재시도 한계 · 에스컬레이션</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>StaleBranch</code></p>
              <p className="text-xs text-muted-foreground mt-1">브랜치 신선도 관리</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RecoveryEngine 구조</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">RecoveryEngine</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>recipes</code></p>
                <p className="text-xs text-muted-foreground mt-1">Vec&lt;RecoveryRecipe&gt; -- 사용 가능한 복구 절차 목록</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>policy</code></p>
                <p className="text-xs text-muted-foreground mt-1">RecoveryPolicy -- 재시도 한계 · 에스컬레이션 규칙</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>history</code></p>
                <p className="text-xs text-muted-foreground mt-1">Vec&lt;RecoveryAttempt&gt; -- 과거 복구 시도 이력</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">RecoveryAttempt</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>lane_id</code></p>
                <p className="text-[11px] text-muted-foreground">LaneId</p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>recipe</code></p>
                <p className="text-[11px] text-muted-foreground">String</p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>timestamp</code></p>
                <p className="text-[11px] text-muted-foreground">DateTime&lt;Utc&gt;</p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>outcome</code></p>
                <p className="text-[11px] text-muted-foreground">RecoveryOutcome</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">RecoveryOutcome</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-md font-mono">Succeeded</span>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-md font-mono">Failed(String)</span>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-md font-mono">PartiallyRecovered</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-md font-mono">Escalated</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">recover() — 진입점</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">RecoveryEngine::recover(&mut self, lane, failure) → Result&lt;RecoveryOutcome&gt;</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">실패 상황 분류</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>classify_failure(failure)</code> -- FailureInfo를 FailureClass로 변환</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">매칭 레시피 찾기</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>recipes.find(|r| r.matches(&classification))</code> -- 없으면 에러 반환</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">재시도 한계 확인</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>exceeded_retry_limit(lane, recipe.name)</code> -- 초과 시 <code>escalate()</code> 호출</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="font-semibold text-sm">레시피 실행</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>recipe.execute(lane).await</code> -- 선택된 복구 절차 수행</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">5</span>
              <div>
                <p className="font-semibold text-sm">이력 기록</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>history.push(RecoveryAttempt {'{'} lane_id, recipe, timestamp, outcome {'}'})</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 흐름</strong>: 분류 → 레시피 선택 → 한계 체크 → 실행 → 기록<br />
          매칭 레시피 없으면 에러 — 알려지지 않은 실패 상황 감지<br />
          재시도 한계 초과 시 에스컬레이션 (사용자 개입 요청)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 분류 — classify_failure()</h3>
        <FailureClassesViz />
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">classify_failure(info: &FailureInfo) → FailureClass -- 로그 시그니처 매칭</p>
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded font-mono">BuildFailed</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>build_log</code>에서 <code>"error[E"</code> 또는 <code>"error:"</code> 패턴 매칭 → 컴파일러 에러 추출</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-2 py-0.5 rounded font-mono">TestFailed</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>test_log</code>에서 <code>"FAILED"</code> 또는 <code>"test result: FAILED"</code> 패턴 → 실패 테스트 목록 추출</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded font-mono">Stalled</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>no_activity_duration</code> &gt; 3600초 (1시간) -- 활동 없음 판정</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs px-2 py-0.5 rounded font-mono">Unknown</span>
              </div>
              <p className="text-xs text-muted-foreground">위 조건 모두 불일치 시 -- 사용자 개입 필요</p>
            </div>
          </div>
        </div>
        <p>
          <strong>9가지 실패 분류</strong>: 원인별로 세분화<br />
          로그 패턴 매칭으로 분류 — 언어별 에러 형식 인식<br />
          Unknown으로 분류되면 사용자 개입 — 신규 케이스 학습 기회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RecoveryPolicy — 재시도 한계</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">RecoveryPolicy</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>max_attempts_per_recipe</code></p>
                <p className="text-xs text-muted-foreground mt-1">u32 -- 레시피별 최대 시도 횟수 (기본 3)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>max_attempts_per_lane</code></p>
                <p className="text-xs text-muted-foreground mt-1">u32 -- Lane 전체 최대 시도 횟수 (기본 10)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>escalation_target</code></p>
                <p className="text-xs text-muted-foreground mt-1">EscalationTarget -- 한계 도달 시 전달 대상</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>cooldown_after_failure</code></p>
                <p className="text-xs text-muted-foreground mt-1">Duration -- 실패 후 대기 시간 (기본 60초)</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">EscalationTarget</p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-mono font-semibold">HumanUser</p>
                <p className="text-[11px] text-muted-foreground">사용자에게 알림</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-mono font-semibold">Webhook(Url)</p>
                <p className="text-[11px] text-muted-foreground">Slack, Discord 등</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-mono font-semibold">CreateIssue</p>
                <p className="text-[11px] text-muted-foreground">GitHub/GitLab 이슈 생성</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-mono font-semibold">AbandonLane</p>
                <p className="text-[11px] text-muted-foreground">레인 폐기</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>2가지 한계</strong>: 레시피별 3회 + Lane 전체 10회<br />
          한계 도달 시 에스컬레이션 — 자동 복구 포기<br />
          <code>cooldown</code>: 실패 후 바로 재시도하지 않음 — 플레이크 대응
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이력 기반 결정 — history 활용</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-3">
          <div className="bg-background rounded-md border p-3">
            <p className="font-semibold text-sm mb-1"><code>exceeded_retry_limit(lane, recipe_name)</code> → bool</p>
            <p className="text-xs text-muted-foreground">
              <code>history</code>에서 동일 Lane + 동일 레시피 조합 필터 → 성공 이력 제외 → 실패 횟수가 <code>max_attempts_per_recipe</code> 이상이면 <code>true</code>
            </p>
          </div>
          <div className="bg-background rounded-md border p-3">
            <p className="font-semibold text-sm mb-1"><code>recent_outcomes(lane)</code> → Vec&lt;&RecoveryOutcome&gt;</p>
            <p className="text-xs text-muted-foreground">
              해당 Lane의 이력을 역순 정렬 → 최근 5건의 <code>outcome</code>만 반환 -- 현재 상태 요약에 활용
            </p>
          </div>
        </div>
        <p>
          <strong>결합 카운팅</strong>: "이 Lane에서 이 레시피 N회 실패했나?"<br />
          같은 실패에 같은 접근 반복 방지 — 다른 레시피로 전환 유도<br />
          성공 이력은 카운트에서 제외 — 과거 성공한 레시피는 계속 시도 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "복구 vs 포기"의 경계</p>
          <p>
            자율 시스템에서 <strong>복구 시도 횟수는 중요한 설계 결정</strong><br />
            너무 적으면: 일시적 장애에도 사용자 호출 → 자동화 가치 없음<br />
            너무 많으면: 무한 루프, 자원 낭비, 악화 가능성
          </p>
          <p className="mt-2">
            claw-code의 기본값:<br />
            - 레시피별 3회 — 플레이크 테스트·네트워크 일시 장애 대응<br />
            - Lane별 10회 — 전체 복구 시도 상한<br />
            - 쿨다운 60초 — 빠른 연속 재시도 방지
          </p>
          <p className="mt-2">
            이 값들은 <strong>경험칙</strong> — 정답 없음<br />
            사용자 환경에 맞게 조정 권장: CI 느린 환경은 쿨다운 ↑, 안정적 환경은 재시도 ↓<br />
            <strong>"실패를 정상 상황으로 가정"</strong>하는 설계 철학 — 외부 세계는 불안정
          </p>
        </div>

      </div>
    </section>
  );
}
