import WorkerStateViz from './viz/WorkerStateViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WorkerStatus 상태 머신</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <WorkerStateViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Worker란 무엇인가</h3>
        <p>
          Worker = claw-code가 관리하는 <strong>외부 LLM 에이전트 세션</strong><br />
          예: 서브에이전트(Task 도구로 생성), 병렬 작업 프로세스<br />
          각 Worker는 자체 터미널·프로세스·상태를 가진 독립 단위
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">WorkerStatus — 8단계 상태</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum WorkerStatus {
    Idle,          // 유휴 — 작업 대기
    Launching,     // 프로세스 시작 중
    TrustResolving,// 신뢰 결정 중 (TrustResolver)
    Ready,         // 작업 가능
    Working,       // 작업 수행 중
    WaitingInput,  // 사용자 입력 대기
    Completed,     // 작업 완료
    Failed,        // 실패
}`}</pre>
        <p>
          <strong>8단계 선형 흐름</strong>: Idle → Launching → TrustResolving → Ready → Working → {`(WaitingInput ↔ Working)`} → Completed/Failed<br />
          각 상태는 명확한 전이 규칙 — 임의 전이 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">상태 전이 강제</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Worker {
    pub fn transition(&mut self, next: WorkerStatus) -> Result<()> {
        let allowed = matches!(
            (&self.status, &next),
            (WorkerStatus::Idle,           WorkerStatus::Launching)
            | (WorkerStatus::Launching,    WorkerStatus::TrustResolving)
            | (WorkerStatus::Launching,    WorkerStatus::Failed)
            | (WorkerStatus::TrustResolving, WorkerStatus::Ready)
            | (WorkerStatus::TrustResolving, WorkerStatus::Failed)
            | (WorkerStatus::Ready,        WorkerStatus::Working)
            | (WorkerStatus::Working,      WorkerStatus::WaitingInput)
            | (WorkerStatus::WaitingInput, WorkerStatus::Working)
            | (WorkerStatus::Working,      WorkerStatus::Completed)
            | (WorkerStatus::Working,      WorkerStatus::Failed)
        );

        if !allowed {
            return Err(anyhow!(
                "invalid transition: {:?} → {:?}",
                self.status, next
            ));
        }

        self.status = next;
        self.emit_event(WorkerEvent::StatusChange);
        Ok(())
    }
}`}</pre>
        <p>
          <strong>10개 허용 전이</strong>만 정의 — 나머지는 거부<br />
          Ready → Failed는 불가 — 작업 시작 전 실패는 TrustResolving 단계에서 발생<br />
          Completed, Failed는 최종 상태 — 이후 전이 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 구조체</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Worker {
    pub id: WorkerId,
    pub status: WorkerStatus,
    pub pid: Option<u32>,
    pub terminal: Option<TerminalHandle>,  // 가상 터미널 (pty)
    pub trust: Option<TrustDecision>,
    pub current_task: Option<Task>,
    pub started_at: DateTime<Utc>,
    pub event_log: Vec<WorkerEvent>,
}`}</pre>
        <p>
          <code>pid</code>: Launching 상태부터 채워짐<br />
          <code>terminal</code>: pty 기반 가상 터미널 — 화면 출력 캡처·입력 전송 가능<br />
          <code>event_log</code>: 상태 전이·오류·사용자 입력 이력
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 생성 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn spawn_worker(task: Task) -> Result<WorkerId> {
    let mut worker = Worker::new();

    // 1) Launching 전이
    worker.transition(WorkerStatus::Launching)?;

    // 2) pty 생성 및 프로세스 시작
    let (terminal, pid) = launch_process(&task.config).await?;
    worker.terminal = Some(terminal);
    worker.pid = Some(pid);

    // 3) TrustResolving 전이
    worker.transition(WorkerStatus::TrustResolving)?;

    // 4) TrustResolver 호출 (다음 섹션)
    let trust = TrustResolver::resolve(&task.workspace).await?;
    if !trust.is_trusted() {
        worker.transition(WorkerStatus::Failed)?;
        return Err(anyhow!("worker not trusted"));
    }

    worker.trust = Some(trust);

    // 5) Ready 전이
    worker.transition(WorkerStatus::Ready)?;

    // 6) 레지스트리 등록
    global_worker_registry().insert(worker.id.clone(), worker);

    Ok(worker.id)
}`}</pre>
        <p>
          <strong>6단계 생성 흐름</strong>: Launching → 프로세스 시작 → TrustResolving → 신뢰 결정 → Ready → 등록<br />
          각 단계 실패 시 Failed로 전이 — 정리 코드가 Drop에서 자동 실행<br />
          Ready 도달까지 약 100-500ms (프로세스 시작 오버헤드 포함)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 명시적 상태 머신의 디버깅 가치</p>
          <p>
            Worker 같은 외부 프로세스 관리는 <strong>암묵적 상태</strong>가 흔함<br />
            - 프로세스가 "시작 중"인지 "대기 중"인지 애매<br />
            - 실패했는데 정리 안 된 상태로 남음<br />
            - "좀비 프로세스" 발생
          </p>
          <p className="mt-2">
            명시적 WorkerStatus enum으로 이 모호성 제거:<br />
            - 모든 상태에 이름 부여 → 로그 추적 가능<br />
            - 허용 전이 강제 → 불가능한 상태 방지<br />
            - 이벤트 발생 → UI 실시간 업데이트
          </p>
          <p className="mt-2">
            8개 상태는 최소 — 더 많이 만들면 복잡, 더 적게 만들면 애매<br />
            경험적 최적점이 8개 — worker 수명의 <strong>각 "관찰 가능한 단계"</strong>를 표현
          </p>
        </div>

      </div>
    </section>
  );
}
