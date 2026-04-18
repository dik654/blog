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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">식별 / 기본</p>
            <p className="text-sm"><code>id: TaskId</code> — 고유 식별자</p>
            <p className="text-sm"><code>title: String</code> — 작업 제목</p>
            <p className="text-sm"><code>description: String</code> — 상세 설명</p>
            <p className="text-sm"><code>priority: Priority</code> — Critical / High / Medium / Low</p>
            <p className="text-sm"><code>tags: Vec&lt;String&gt;</code> — 분류 태그</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">목표 / 조건</p>
            <p className="text-sm"><code>goals: Vec&lt;Goal&gt;</code> — 완료 조건</p>
            <p className="text-sm"><code>constraints: Vec&lt;Constraint&gt;</code> — 제약 사항</p>
            <p className="text-sm"><code>acceptance_criteria: Vec&lt;String&gt;</code> — 수용 기준</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">할당</p>
            <p className="text-sm"><code>assigned_team: Option&lt;TeamId&gt;</code> — 담당 팀</p>
            <p className="text-sm"><code>assigned_worker: Option&lt;WorkerId&gt;</code> — 담당 워커</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">의존성 / 메타</p>
            <p className="text-sm"><code>depends_on: Vec&lt;TaskId&gt;</code> — 선행 task</p>
            <p className="text-sm"><code>blocks: Vec&lt;TaskId&gt;</code> — 차단 task</p>
            <p className="text-sm"><code>created_by</code> / <code>created_at</code> / <code>deadline</code> / <code>estimated_duration</code></p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Goal 과 Constraint</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Goal 구조체</p>
            <p className="text-sm"><code>description: String</code> — 목표 설명</p>
            <p className="text-sm"><code>measurable: bool</code> — 측정 가능한 목표인지</p>
            <p className="text-sm"><code>completion_check: Option&lt;String&gt;</code> — 자동 완료 확인 명령</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Constraint 구조체</p>
            <p className="text-sm"><code>kind: ConstraintKind</code> — 5가지 변형 (아래 Viz 참조)</p>
            <p className="text-sm"><code>description: String</code> — 제약 설명</p>
          </div>
        </div>
        <ConstraintKindViz />
        <p>
          <strong>Goal</strong>: 달성해야 할 목표 (예: "테스트 커버리지 80% 달성")<br />
          <strong>Constraint</strong>: 절대 넘지 말아야 할 선 (예: "auth 모듈 건드리지 마")<br />
          LLM이 Goal로 동기부여되고 Constraint로 범위 제한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 직렬화 예시</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border divide-y divide-border">
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">id</span>
            <span><code>"task_abc123"</code></span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">title</span>
            <span><code>"User auth 리팩토링"</code></span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">priority</span>
            <span><code>"High"</code> / tags: <code>["refactoring", "auth"]</code></span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">goals</span>
            <span>"인증 로직이 재사용 가능한 미들웨어로 분리됨" — <code>completion_check</code>: <code>grep -r 'fn verify_jwt' src/middleware/</code></span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">constraints</span>
            <span><code>no_touch_files</code>: <code>["src/config/secrets.rs"]</code> — secrets 모듈 수정 금지</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">acceptance</span>
            <span>기존 API 동일 동작 / 기존 테스트 통과 / 새 미들웨어 unit test 추가</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">assigned</span>
            <span>team: <code>"backend"</code> / created_by: <code>"alice"</code></span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TaskCreate 도구 호출</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">도구 호출 입력</p>
            <p className="text-sm">도구명: <code>TaskCreate</code></p>
            <p className="text-sm"><code>title</code>: "Fix failing tests in user module" / <code>priority</code>: High</p>
            <p className="text-sm"><code>goals</code>: "All user tests passing" / <code>assigned_worker</code>: null (자동 할당)</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">handle_task_create 처리 흐름</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono shrink-0">1.</span>
                <span><code>serde_json::from_value(input)</code> — JSON → TaskPacket 역직렬화</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono shrink-0">2.</span>
                <span><code>packet.validate()</code> — 필수 필드·일관성 검증</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono shrink-0">3.</span>
                <span><code>global_task_registry().insert()</code> — 레지스트리 등록</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono shrink-0">4.</span>
                <span><code>spawn_worker()</code> — 자동 worker spawn (설정 활성 시, 미할당일 때)</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Task 생명주기</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">TaskStatus — 7가지 상태</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-4">
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>Pending</code>
              <p className="text-xs text-muted-foreground mt-1">생성됨, 할당 대기</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>Assigned</code>
              <p className="text-xs text-muted-foreground mt-1">Worker/Team 할당됨</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>InProgress</code>
              <p className="text-xs text-muted-foreground mt-1">작업 중</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>Review</code>
              <p className="text-xs text-muted-foreground mt-1">완료 주장, 검증 필요</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>Completed</code>
              <p className="text-xs text-muted-foreground mt-1">완료·수용됨</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>Rejected</code>
              <p className="text-xs text-muted-foreground mt-1">수용 기준 미달</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-center">
              <code>Cancelled</code>
              <p className="text-xs text-muted-foreground mt-1">취소됨</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            전이: Pending → Assigned → InProgress → Review → Completed / Review → Rejected → InProgress (역류)
          </p>
        </div>
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
