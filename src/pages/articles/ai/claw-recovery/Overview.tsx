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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`runtime/recovery.rs
  ↓
RecoveryRecipe          복구 절차 정의
RecoveryEngine          레시피 선택·실행
RecoveryPolicy          재시도 한계·에스컬레이션
StaleBranch             브랜치 신선도 관리`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RecoveryEngine 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct RecoveryEngine {
    recipes: Vec<RecoveryRecipe>,
    policy: RecoveryPolicy,
    history: Vec<RecoveryAttempt>,
}

pub struct RecoveryAttempt {
    pub lane_id: LaneId,
    pub recipe: String,
    pub timestamp: DateTime<Utc>,
    pub outcome: RecoveryOutcome,
}

pub enum RecoveryOutcome {
    Succeeded,
    Failed(String),
    PartiallyRecovered,
    Escalated,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">recover() — 진입점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl RecoveryEngine {
    pub async fn recover(&mut self, lane: &Lane, failure: &FailureInfo) -> Result<RecoveryOutcome> {
        // 1) 실패 상황 분류
        let classification = self.classify_failure(failure);

        // 2) 매칭 레시피 찾기
        let recipe = self.recipes.iter()
            .find(|r| r.matches(&classification))
            .ok_or(anyhow!("no recipe for {:?}", classification))?;

        // 3) 재시도 한계 확인
        if self.exceeded_retry_limit(lane, &recipe.name) {
            return Ok(self.escalate(lane, &classification).await?);
        }

        // 4) 레시피 실행
        let outcome = recipe.execute(lane).await?;

        // 5) 이력 기록
        self.history.push(RecoveryAttempt {
            lane_id: lane.id.clone(),
            recipe: recipe.name.clone(),
            timestamp: Utc::now(),
            outcome: outcome.clone(),
        });

        Ok(outcome)
    }
}`}</pre>
        <p>
          <strong>5단계 흐름</strong>: 분류 → 레시피 선택 → 한계 체크 → 실행 → 기록<br />
          매칭 레시피 없으면 에러 — 알려지지 않은 실패 상황 감지<br />
          재시도 한계 초과 시 에스컬레이션 (사용자 개입 요청)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 분류 — classify_failure()</h3>
        <FailureClassesViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 분류 로직 (log signature 매칭)

impl RecoveryEngine {
    fn classify_failure(&self, info: &FailureInfo) -> FailureClass {
        // 빌드 로그에서 에러 추출
        if let Some(log) = &info.build_log {
            if log.contains("error[E") || log.contains("error:") {
                return FailureClass::BuildFailed {
                    compiler_errors: extract_errors(log),
                };
            }
        }

        // 테스트 로그 분석
        if let Some(log) = &info.test_log {
            if log.contains("FAILED") || log.contains("test result: FAILED") {
                return FailureClass::TestFailed {
                    failing_tests: extract_failing_tests(log),
                };
            }
        }

        // 시간 체크
        if info.no_activity_duration > Duration::from_secs(3600) {
            return FailureClass::Stalled {
                no_activity_for: info.no_activity_duration,
            };
        }

        FailureClass::Unknown
    }
}`}</pre>
        <p>
          <strong>9가지 실패 분류</strong>: 원인별로 세분화<br />
          로그 패턴 매칭으로 분류 — 언어별 에러 형식 인식<br />
          Unknown으로 분류되면 사용자 개입 — 신규 케이스 학습 기회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RecoveryPolicy — 재시도 한계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct RecoveryPolicy {
    pub max_attempts_per_recipe: u32,     // 기본 3
    pub max_attempts_per_lane: u32,       // 기본 10
    pub escalation_target: EscalationTarget,
    pub cooldown_after_failure: Duration, // 기본 60초
}

pub enum EscalationTarget {
    HumanUser,                           // 사용자에게 알림
    Webhook(Url),                        // Slack, Discord 등
    CreateIssue { repo: String },        // GitHub/GitLab 이슈 생성
    AbandonLane,                         // 레인 폐기
}`}</pre>
        <p>
          <strong>2가지 한계</strong>: 레시피별 3회 + Lane 전체 10회<br />
          한계 도달 시 에스컬레이션 — 자동 복구 포기<br />
          <code>cooldown</code>: 실패 후 바로 재시도하지 않음 — 플레이크 대응
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이력 기반 결정 — history 활용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl RecoveryEngine {
    fn exceeded_retry_limit(&self, lane: &Lane, recipe_name: &str) -> bool {
        // 이 레인 + 이 레시피 조합 이력 조회
        let attempts = self.history.iter()
            .filter(|a| &a.lane_id == &lane.id && a.recipe == recipe_name)
            .filter(|a| !matches!(a.outcome, RecoveryOutcome::Succeeded))
            .count();

        attempts >= self.policy.max_attempts_per_recipe as usize
    }

    pub fn recent_outcomes(&self, lane: &LaneId) -> Vec<&RecoveryOutcome> {
        self.history.iter()
            .filter(|a| &a.lane_id == lane)
            .rev()
            .take(5)
            .map(|a| &a.outcome)
            .collect()
    }
}`}</pre>
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
