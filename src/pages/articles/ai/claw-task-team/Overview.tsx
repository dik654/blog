import TaskPacketViz from './viz/TaskPacketViz';
import ConstraintKindViz from './viz/ConstraintKindViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TaskPacket 구조화된 작업 명세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TaskPacketViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">TaskPacket이란</h3>
        <p>
          TaskPacket: claw-code가 처리하는 <strong>작업의 표준 명세</strong><br />
          LLM이 처리할 task + 메타데이터를 묶은 구조체<br />
          Task 도구 호출, PolicyEngine Lane 생성, 크론 잡 등에서 공통 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TaskPacket 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TaskPacket {
    pub id: TaskId,
    pub title: String,
    pub description: String,
    pub priority: Priority,
    pub tags: Vec<String>,

    // 목표·조건
    pub goals: Vec<Goal>,                    // 완료 조건
    pub constraints: Vec<Constraint>,        // 제약 사항
    pub acceptance_criteria: Vec<String>,   // 수용 기준

    // 할당
    pub assigned_team: Option<TeamId>,
    pub assigned_worker: Option<WorkerId>,

    // 의존성
    pub depends_on: Vec<TaskId>,
    pub blocks: Vec<TaskId>,

    // 메타데이터
    pub created_by: String,
    pub created_at: DateTime<Utc>,
    pub deadline: Option<DateTime<Utc>>,
    pub estimated_duration: Option<Duration>,
}

pub enum Priority {
    Critical, High, Medium, Low,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Goal 과 Constraint</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Goal {
    pub description: String,
    pub measurable: bool,        // 측정 가능한 목표?
    pub completion_check: Option<String>,  // 자동 완료 확인 명령
}

pub struct Constraint {
    pub kind: ConstraintKind,
    pub description: String,
}

pub enum ConstraintKind { /* 5 variants — 아래 Viz 참조 */ }`}</pre>
        <ConstraintKindViz />
        <p>
          <strong>Goal</strong>: 달성해야 할 목표 (예: "테스트 커버리지 80% 달성")<br />
          <strong>Constraint</strong>: 절대 넘지 말아야 할 선 (예: "auth 모듈 건드리지 마")<br />
          LLM이 Goal로 동기부여되고 Constraint로 범위 제한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 직렬화 예시</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "id": "task_abc123",
  "title": "User auth 리팩토링",
  "description": "JWT 검증 로직을 미들웨어로 추출",
  "priority": "High",
  "tags": ["refactoring", "auth"],
  "goals": [{
    "description": "인증 로직이 재사용 가능한 미들웨어로 분리됨",
    "measurable": true,
    "completion_check": "grep -r 'fn verify_jwt' src/middleware/"
  }],
  "constraints": [{
    "kind": {"no_touch_files": ["src/config/secrets.rs"]},
    "description": "secrets 모듈 수정 금지"
  }],
  "acceptance_criteria": [
    "기존 API가 동일하게 동작",
    "모든 기존 테스트 통과",
    "새 미들웨어 unit test 추가"
  ],
  "assigned_team": "backend",
  "depends_on": [],
  "created_by": "alice",
  "created_at": "2026-04-05T10:00:00Z"
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TaskCreate 도구 호출</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// LLM이 Task 도구로 subagent 생성 시
tool_use {
  name: "TaskCreate",
  input: {
    title: "Fix failing tests in user module",
    description: "5 tests failing in src/user/tests/",
    priority: "High",
    goals: [{"description": "All user tests passing"}],
    assigned_worker: null  // 자동 할당
  }
}

// claw-code 처리
async fn handle_task_create(input: Value) -> Result<ToolOutput> {
    let packet: TaskPacket = serde_json::from_value(input)?;

    // 검증
    packet.validate()?;

    // 레지스트리 등록
    let task_id = global_task_registry().insert(packet.clone()).await;

    // 자동 worker spawn (설정 활성 시)
    if config.auto_spawn_workers && packet.assigned_worker.is_none() {
        let worker_id = spawn_worker(packet.clone()).await?;
        global_task_registry().assign(&task_id, worker_id).await?;
    }

    Ok(ToolOutput::text(format!("Task created: {}", task_id)))
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Task 생명주기</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum TaskStatus {
    Pending,       // 생성됨, 할당 대기
    Assigned,      // Worker/Team에 할당됨
    InProgress,    // 작업 중
    Review,        // 완료 주장, 검증 필요
    Completed,     // 완료·수용됨
    Rejected,      // 수용 기준 미달 — 재작업 필요
    Cancelled,     // 취소됨
}

// 전이:
// Pending → Assigned → InProgress → Review → Completed
//                                        ↘ Rejected → InProgress`}</pre>
        <p>
          <strong>7가지 상태</strong>: Pending → Completed 선형 + Review→Rejected 역류<br />
          Review 단계: 자동 수용 기준 체크 + 사람 승인 (선택)<br />
          Rejected 시 InProgress로 복귀 — LLM이 rejected reason 보고 재작업
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 구조화 명세의 가치</p>
          <p>
            자유 형식 자연어 task 설명:<br />
            "유저 auth 리팩토링 해줘" → LLM이 범위 오해 위험
          </p>
          <p className="mt-2">
            TaskPacket의 구조화:<br />
            ✓ <strong>Goal</strong>: 무엇을 달성할지 명확<br />
            ✓ <strong>Constraint</strong>: 하지 말아야 할 것 명확<br />
            ✓ <strong>Acceptance Criteria</strong>: 완료 판정 기준<br />
            ✓ <strong>Dependencies</strong>: 순서·병렬 가능성 표현
          </p>
          <p className="mt-2">
            <strong>효과</strong>:<br />
            - LLM이 "스코프 크리프" 덜 발생 — constraint가 가드레일<br />
            - 완료 판정 자동화 가능 — completion_check 스크립트<br />
            - 여러 task 간 의존 관리 — PolicyEngine과 결합
          </p>
          <p className="mt-2">
            구조화는 <strong>자유도를 희생하지 않음</strong> — description 필드에 자연어 자유 기술 가능<br />
            구조는 "뼈대", 자연어는 "살" — 둘 다 필요
          </p>
        </div>

      </div>
    </section>
  );
}
