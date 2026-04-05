import LaneContextViz from './viz/LaneContextViz';

export default function LaneContext() {
  return (
    <section id="lane-context" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LaneContext — 레인 상태 평가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LaneContextViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">LaneContext 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct LaneContext {
    pub lane_id: LaneId,
    pub lane_status: LaneStatus,
    pub status_changed_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,

    // 빌드 & 테스트
    pub last_build_status: Option<BuildStatus>,
    pub last_test_status: Option<TestStatus>,
    pub test_coverage: Option<f32>,
    pub lint_warnings: Option<usize>,

    // 재시도
    pub failure_count: u32,
    pub retry_count: u32,

    // 활동
    pub last_activity: DateTime<Utc>,
    pub commits: Vec<CommitRef>,

    // 의존성
    pub blocked_by: Vec<LaneId>,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">컨텍스트 빌더 — build_context()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PolicyEngine {
    pub async fn build_context(&self, lane: &Lane) -> Result<LaneContext> {
        // 기본 필드
        let mut ctx = LaneContext {
            lane_id: lane.id.clone(),
            lane_status: lane.status.clone(),
            status_changed_at: lane.status_changed_at,
            created_at: lane.created_at,
            failure_count: lane.failure_count,
            retry_count: lane.retry_count,
            last_activity: lane.last_activity,
            ..Default::default()
        };

        // 빌드 상태 조회 (CI 시스템)
        if let Ok(build) = ci_client::fetch_latest_build(&lane.branch).await {
            ctx.last_build_status = Some(build.status);
        }

        // 테스트 결과 조회
        if let Ok(tests) = ci_client::fetch_latest_tests(&lane.branch).await {
            ctx.last_test_status = Some(tests.status);
            ctx.test_coverage = tests.coverage;
        }

        // 린트 결과
        if let Ok(lint) = ci_client::fetch_lint_warnings(&lane.branch).await {
            ctx.lint_warnings = Some(lint.warning_count);
        }

        // git log
        if let Ok(commits) = git_client::log_branch(&lane.branch).await {
            ctx.commits = commits;
        }

        // 의존성
        ctx.blocked_by = lane.task_packet.depends_on.clone();

        Ok(ctx)
    }
}`}</pre>
        <p>
          <strong>컨텍스트 구축 단계</strong>: 기본 필드 → CI 조회 → git 조회 → 의존성<br />
          각 외부 조회는 실패 허용 — 일부 정보 없어도 평가 가능<br />
          매 <code>evaluate_lane()</code> 호출마다 재구축 — 항상 최신 상태
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TimeRef — 시간 참조점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum TimeRef {
    LaneCreated,           // Lane 생성 시각
    StatusChanged,         // 현재 상태 진입 시각
    LastActivity,          // 마지막 활동 시각
    LastBuild,             // 마지막 빌드 시각
    FirstFailure,          // 첫 실패 시각
}

impl LaneContext {
    pub fn elapsed_since(&self, since: TimeRef) -> Duration {
        let ref_time = match since {
            TimeRef::LaneCreated    => self.created_at,
            TimeRef::StatusChanged  => self.status_changed_at,
            TimeRef::LastActivity   => self.last_activity,
            TimeRef::LastBuild      => self.last_build_time.unwrap_or(Utc::now()),
            TimeRef::FirstFailure   => self.first_failure_at.unwrap_or(Utc::now()),
        };
        Utc::now() - ref_time
    }
}`}</pre>
        <p>
          <strong>5개 시간 참조</strong>: 상황별 기준 시각<br />
          "1시간 동안 InProgress면 blocked 체크" → <code>StatusChanged</code> 사용<br />
          "24시간 활동 없으면 stale" → <code>LastActivity</code> 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">의존성 체크 — blocked_by</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Lane A가 Lane B의 merge를 기다리는 상황
pub struct TaskPacket {
    pub depends_on: Vec<LaneId>,
    // ...
}

impl LaneContext {
    pub async fn blocking_lanes(&self, engine: &PolicyEngine) -> Vec<LaneId> {
        let mut blocking = Vec::new();
        for dep_id in &self.blocked_by {
            if let Some(dep_lane) = engine.lanes.get(dep_id) {
                // 머지됐거나 폐기됐으면 더 이상 차단 안 함
                if !matches!(dep_lane.status,
                    LaneStatus::Merged | LaneStatus::Abandoned) {
                    blocking.push(dep_id.clone());
                }
            }
        }
        blocking
    }
}

// 의존성 기반 규칙 예시 (YAML)
- name: "의존성 해결 대기"
  condition:
    and:
      - status_is: Initialized
      - has_blocking_lanes: true
  action: transition(Blocked(WaitingForDependency))`}</pre>
        <p>
          <strong>의존성 그래프</strong>: Lane 간 DAG 구성 가능<br />
          예: refactor Lane → migration Lane → cleanup Lane<br />
          순환 의존 방지 — Lane 생성 시 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CI 통합 — ci_client</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub trait CiClient: Send + Sync {
    async fn fetch_latest_build(&self, branch: &str) -> Result<BuildResult>;
    async fn fetch_latest_tests(&self, branch: &str) -> Result<TestResult>;
    async fn fetch_lint_warnings(&self, branch: &str) -> Result<LintResult>;
}

// 구현체 예: GitHubActionsClient
pub struct GitHubActionsClient {
    repo: String,
    token: String,
}

#[async_trait]
impl CiClient for GitHubActionsClient {
    async fn fetch_latest_build(&self, branch: &str) -> Result<BuildResult> {
        let url = format!(
            "https://api.github.com/repos/{}/actions/runs?branch={}",
            self.repo, branch
        );
        // REST API 호출 → 최신 워크플로우 실행 조회
        // ...
    }
}`}</pre>
        <p>
          <strong>CiClient 트레이트</strong>: CI 시스템 추상화<br />
          구현체: GitHubActions, GitLabCI, CircleCI, Jenkins<br />
          claw-code는 기본 GitHubActionsClient 제공 — 사용자가 트레이트 구현으로 확장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 전략 — 과도한 API 호출 방지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct CachedCiClient {
    inner: Box<dyn CiClient>,
    cache: Arc<Mutex<HashMap<String, (DateTime<Utc>, BuildResult)>>>,
    ttl: Duration,
}

#[async_trait]
impl CiClient for CachedCiClient {
    async fn fetch_latest_build(&self, branch: &str) -> Result<BuildResult> {
        let mut cache = self.cache.lock().await;

        // 캐시 확인
        if let Some((cached_at, result)) = cache.get(branch) {
            if Utc::now() - *cached_at < self.ttl {
                return Ok(result.clone());
            }
        }

        // 실제 호출
        let result = self.inner.fetch_latest_build(branch).await?;
        cache.insert(branch.into(), (Utc::now(), result.clone()));
        Ok(result)
    }
}`}</pre>
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
