import ObserveViz from './viz/ObserveViz';

export default function Observe() {
  return (
    <section id="observe" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">observe() — 화면 텍스트 기반 상태 추론</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ObserveViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 화면 관찰인가</h3>
        <p>
          Worker는 독립 프로세스 — 내부 상태를 직접 조회 불가<br />
          claw-code는 <strong>pty 기반 가상 터미널</strong>로 Worker 화면을 캡처<br />
          캡처된 텍스트를 패턴 매칭하여 "지금 무엇을 하고 있는가" 추론
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">observe() 함수 시그니처</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn observe(worker: &Worker) -> Observation {
    // 1) 가상 터미널에서 화면 텍스트 추출
    let screen = worker.terminal.as_ref()
        .map(|t| t.get_screen_text())
        .unwrap_or_default();

    // 2) 패턴 매칭으로 상태 추론
    let inferred_status = infer_status(&screen);

    // 3) 추출된 정보
    Observation {
        status: inferred_status,
        last_line: screen.lines().last().unwrap_or("").to_string(),
        contains_prompt: has_prompt(&screen),
        contains_error: has_error(&screen),
        screen_snapshot: screen,
    }
}`}</pre>
        <p>
          <code>Observation</code> 구조체: 화면에서 추출한 "상태 스냅샷"<br />
          <code>status</code>는 추론된 상태 — Worker의 실제 status와 비교하여 일치 검증<br />
          불일치 시 <strong>misdelivery</strong> 또는 <strong>crash</strong> 의심
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">패턴 매칭 기반 추론</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn infer_status(screen: &str) -> InferredStatus {
    let last_lines = screen.lines().rev().take(10).collect::<Vec<_>>();
    let tail = last_lines.join("\\n");

    // 완료 패턴
    if tail.contains("Task completed") || tail.contains("✓ Done") {
        return InferredStatus::Completed;
    }

    // 에러 패턴
    if tail.contains("Error:") || tail.contains("Failed to") || tail.contains("panic:") {
        return InferredStatus::Failed;
    }

    // 입력 대기 패턴
    if tail.contains("Continue? (y/n)")
        || tail.contains("Enter your choice")
        || tail.ends_with("$ ")
        || tail.ends_with("> ") {
        return InferredStatus::WaitingInput;
    }

    // 진행 중 패턴
    if tail.contains("Running") || tail.contains("Processing") || tail.contains("...") {
        return InferredStatus::Working;
    }

    // 기본값
    InferredStatus::Unknown
}`}</pre>
        <p>
          <strong>4가지 상태 패턴</strong>: Completed, Failed, WaitingInput, Working<br />
          <strong>마지막 10줄만 분석</strong>: 이전 히스토리 노이즈 제거 — 현재 상태에 집중<br />
          Unknown은 폴백 — 매칭 실패 시 외부 개입 불필요 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">pty 화면 캡처 — TerminalHandle</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TerminalHandle {
    master: OwnedFd,              // pty 마스터 디스크립터
    buffer: VecDeque<u8>,         // 최근 출력 버퍼 (circular)
    size: (u16, u16),             // (rows, cols)
}

impl TerminalHandle {
    pub fn get_screen_text(&self) -> String {
        // 버퍼의 ANSI 이스케이프 시퀀스 제거
        let raw = String::from_utf8_lossy(self.buffer.as_slices().0);
        strip_ansi_escapes(&raw)
    }

    pub async fn write_input(&mut self, input: &str) -> Result<()> {
        // Worker의 stdin으로 입력 전송
        use std::io::Write;
        let mut master = unsafe { File::from_raw_fd(self.master.as_raw_fd()) };
        master.write_all(input.as_bytes())?;
        Ok(())
    }
}`}</pre>
        <p>
          <strong>pty(pseudo-terminal)</strong>: Unix의 가상 터미널 메커니즘<br />
          마스터/슬레이브 쌍 — 슬레이브는 Worker에 할당, 마스터는 claw-code가 소유<br />
          <code>strip_ansi_escapes()</code>: 색상 코드 등 제거 — 순수 텍스트만 남김
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 관찰 루프</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn observation_loop(worker_id: WorkerId) {
    loop {
        tokio::time::sleep(Duration::from_millis(500)).await;

        let worker = global_worker_registry().get(&worker_id);
        let Some(worker) = worker else { break; };

        // 최종 상태 도달 시 루프 종료
        if matches!(worker.status,
            WorkerStatus::Completed | WorkerStatus::Failed) {
            break;
        }

        // 관찰 & 상태 업데이트
        let obs = observe(&worker).await;

        // 추론 상태와 현재 상태 비교
        if obs.status != worker.status.into() {
            log::warn!(
                "worker {:?}: expected {:?}, observed {:?}",
                worker_id, worker.status, obs.status
            );
        }

        // 전이 가능한 상태면 자동 전이
        match obs.status {
            InferredStatus::Completed => {
                let _ = worker.transition(WorkerStatus::Completed);
            }
            InferredStatus::Failed => {
                let _ = worker.transition(WorkerStatus::Failed);
            }
            _ => {}
        }
    }
}`}</pre>
        <p>
          <strong>500ms 주기</strong>: 사람이 화면 변화를 인지할 수 있는 속도<br />
          너무 빈번하면 CPU 낭비, 너무 느리면 상태 전이 지연<br />
          Worker 수가 많으면 <strong>공유 observer 태스크</strong>로 리팩토링 (현재는 worker당 1개)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">관찰 불일치 감지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Worker 상태는 Working인데 화면에는 "$ " 프롬프트가 보임
if worker.status == WorkerStatus::Working
    && obs.contains_prompt
    && !obs.contains_error {
    // Worker가 예상보다 일찍 작업 종료
    log::info!("worker finished earlier than expected");
    worker.transition(WorkerStatus::Completed)?;
}

// Worker 상태는 Ready인데 화면에는 에러 메시지
if worker.status == WorkerStatus::Ready && obs.contains_error {
    // 시작 직후 크래시
    log::error!("worker crashed: {}", obs.last_line);
    worker.transition(WorkerStatus::Failed)?;
}`}</pre>
        <p>
          <strong>불일치는 정보</strong>: claw-code의 예상과 실제 행동이 다름 → 조정 필요<br />
          로그 기록 + 상태 보정 — 자동 복구 메커니즘의 일부<br />
          사람이 보는 화면과 내부 상태를 일치시키는 <strong>자동 동기화 루프</strong>
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 블랙박스 프로세스 관찰의 필요성</p>
          <p>
            Worker는 claw-code가 제어할 수 없는 <strong>블랙박스</strong>:<br />
            - 내부 상태 API 없음 — 직접 조회 불가<br />
            - 예외 종료 가능 — 코어 덤프·SIGKILL 등<br />
            - 사용자 입력 대기 — 언제까지 기다려야 할지 모름
          </p>
          <p className="mt-2">
            observe()는 이 블랙박스를 <strong>화면 텍스트로 간접 관찰</strong><br />
            - 완벽하지 않음 (패턴 매칭 오탐 가능)<br />
            - 하지만 유일한 실용적 방법
          </p>
          <p className="mt-2">
            더 강한 대안: <strong>프로토콜 기반 관찰</strong> (예: Worker가 JSON 상태 보고)<br />
            claw-code가 이를 채택하지 않은 이유: <strong>Worker 수정 불필요</strong> — 임의 CLI 도구를 Worker로 사용 가능<br />
            화면 관찰은 "제로 통합"의 장점 — Vim, tmux, 기존 에이전트 모두 Worker로 활용 가능
          </p>
        </div>

      </div>
    </section>
  );
}
