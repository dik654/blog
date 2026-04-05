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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Lane: 병렬 작업의 단위
  - 하나의 branch + workspace + task
  - 여러 Lane이 독립적으로 진행

Rule: Lane 상태 전이 규칙
  - 조건(condition) + 동작(action)
  - 조건 충족 시 동작 수행

Example:
  조건: "build 성공 && test 성공"
  동작: "merge to main, create next Lane"`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PolicyEngine 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PolicyEngine {
    rules: Vec<PolicyRule>,
    lanes: HashMap<LaneId, Lane>,
    green_contract: GreenContract,
    event_log: Vec<PolicyEvent>,
}

pub struct Lane {
    pub id: LaneId,
    pub branch: String,
    pub status: LaneStatus,
    pub task_packet: TaskPacket,
    pub context: LaneContext,
    pub created_at: DateTime<Utc>,
}

pub enum LaneStatus { /* ... 7 variants ... */ }`}</pre>
        <LanePolicyActionsViz />
        <p>
          <strong>7개 LaneStatus</strong>: 작업 수명의 모든 단계 —
          Initialized → InProgress → Testing → ReadyToMerge → Merged (또는 Blocked/Abandoned)<br />
          Blocked는 이유 포함 — 빌드 실패, 테스트 실패, 의존성 대기 등<br />
          <strong>6개 PolicyAction</strong>: 상태 전이, Lane 관리, VCS 조작, 외부 통합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">evaluate_lane() — 상태 전이 평가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PolicyEngine {
    pub async fn evaluate_lane(&mut self, lane_id: &LaneId) -> Result<()> {
        let lane = self.lanes.get(lane_id).ok_or(...)?;

        // 현재 Lane 컨텍스트 수집
        let ctx = self.build_context(lane).await?;

        // 각 규칙 평가
        for rule in &self.rules {
            if !rule.condition.matches_lane_status(&lane.status) { continue; }

            if rule.condition.evaluate(&ctx).await? {
                // 동작 실행
                self.apply_action(lane_id, &rule.action).await?;

                // 이벤트 로그
                self.event_log.push(PolicyEvent {
                    lane: lane_id.clone(),
                    rule: rule.name.clone(),
                    timestamp: Utc::now(),
                });

                break;  // 첫 매칭 규칙만 적용
            }
        }
        Ok(())
    }
}`}</pre>
        <p>
          <strong>first-match 정책</strong>: 첫 매칭 규칙만 실행 — 다음 루프에서 재평가<br />
          각 평가마다 컨텍스트 재수집 — 최신 상태 반영<br />
          이벤트 로그: 어떤 규칙이 언제 발동됐는지 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 평가 루프</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn policy_engine_loop(engine: Arc<Mutex<PolicyEngine>>) {
    loop {
        tokio::time::sleep(Duration::from_secs(30)).await;

        let lane_ids: Vec<_> = {
            let engine = engine.lock().await;
            engine.lanes.keys().cloned().collect()
        };

        for lane_id in lane_ids {
            let mut engine = engine.lock().await;
            if let Err(e) = engine.evaluate_lane(&lane_id).await {
                log::warn!("evaluate_lane failed: {}", e);
            }
        }
    }
}`}</pre>
        <p>
          <strong>30초 주기</strong>: 너무 빈번하면 CI 부하, 너무 느리면 반응 지연<br />
          각 Lane 순차 평가 — 병렬화는 향후 최적화<br />
          에러는 경고만 — 한 Lane 실패가 전체 중단으로 이어지지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PolicyRule 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PolicyRule {
    pub name: String,
    pub priority: u32,
    pub condition: PolicyCondition,
    pub action: PolicyAction,
}

pub enum PolicyAction { /* 6 variants — 위 Viz 참조 */ }`}</pre>
        <p>
          <strong>6종 액션</strong>: 상태 전이, Lane 관리, VCS 조작, 외부 통합<br />
          <code>RunCommand</code>는 탈출구 — 정의된 액션으로 표현 안 될 때<br />
          액션은 <strong>비가역적</strong> — Merged 후 되돌리기 어려움
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 시나리오</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오: 야간 자동 버그 수정 파이프라인
//
// Lane 생성 → LLM이 수정 시도 → 빌드/테스트 →
//   성공 → merge to staging → 알림
//   실패 → 다시 시도 (3회) → 그래도 실패 → Abandoned + 알림

rules:
  - name: "Testing 완료 후 머지"
    condition: "status == Testing && build_green && tests_pass"
    action: MergeBranch

  - name: "테스트 실패 재시도"
    condition: "status == Blocked && failure_count < 3"
    action: Transition(InProgress)

  - name: "3회 실패 시 폐기"
    condition: "status == Blocked && failure_count >= 3"
    action: AbandonLane("max retries exceeded")

  - name: "Merged 후 다음 이슈 픽업"
    condition: "status == Merged && queue_has_pending"
    action: SpawnLane(next_from_queue())`}</pre>

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
