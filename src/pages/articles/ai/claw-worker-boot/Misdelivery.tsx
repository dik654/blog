import MisdeliveryViz from './viz/MisdeliveryViz';

export default function Misdelivery() {
  return (
    <section id="misdelivery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프롬프트 미스딜리버리 탐지 &amp; 복구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MisdeliveryViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Misdelivery란</h3>
        <p>
          claw-code가 Worker에게 프롬프트를 보냈지만 <strong>Worker가 받지 못한 상황</strong><br />
          원인:<br />
          - pty 버퍼 오버플로 (드물게)<br />
          - Worker가 대기 상태가 아니었음 (race condition)<br />
          - Worker 프로세스가 크래시 직전이었음<br />
          - 터미널 크기 불일치로 프롬프트가 잘림
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">탐지 방법 — 에코백 확인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn send_with_verification(
    worker: &mut Worker,
    prompt: &str,
) -> Result<()> {
    // 1) 프롬프트 전송
    worker.terminal.as_mut().unwrap().write_input(prompt).await?;

    // 2) 에코백 대기 (타임아웃 2초)
    let deadline = Instant::now() + Duration::from_secs(2);
    loop {
        if Instant::now() > deadline {
            return Err(anyhow!("prompt not echoed back"));
        }

        let screen = worker.terminal.as_ref().unwrap().get_screen_text();
        if screen.contains(prompt.trim()) {
            return Ok(());  // 에코백 확인 성공
        }

        tokio::time::sleep(Duration::from_millis(100)).await;
    }
}`}</pre>
        <p>
          <strong>에코백(echo-back) 확인</strong>: Worker의 터미널이 입력을 다시 화면에 표시하는 기본 동작<br />
          100ms마다 화면을 확인, 프롬프트 문자열 포함 여부 체크<br />
          2초 내 에코백 없으면 delivery 실패로 판단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">복구 전략 4단계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn recover_from_misdelivery(worker: &mut Worker, prompt: &str) -> Result<()> {
    // 1) 재전송 시도 (지수 백오프)
    for attempt in 0..3 {
        tokio::time::sleep(Duration::from_millis(500 * (attempt + 1))).await;
        if send_with_verification(worker, prompt).await.is_ok() {
            return Ok(());
        }
    }

    // 2) Enter 키 전송 — Worker 상태 흔들기
    worker.terminal.as_mut().unwrap().write_input("\\n").await?;
    tokio::time::sleep(Duration::from_millis(500)).await;

    // 3) 다시 재전송
    if send_with_verification(worker, prompt).await.is_ok() {
        return Ok(());
    }

    // 4) Worker 재시작
    log::warn!("prompt misdelivery unrecoverable, restarting worker");
    restart_worker(worker).await?;

    // 재시작 후 재전송
    send_with_verification(worker, prompt).await
}`}</pre>
        <p>
          <strong>4단계 복구</strong>: 재시도 → Enter 키 → 재시도 → Worker 재시작<br />
          <strong>지수 백오프</strong>: 500ms, 1000ms, 1500ms — 과부하 회피<br />
          Worker 재시작은 마지막 수단 — 작업 진행 상태 손실 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Enter 키 전송의 의미</h3>
        <p>
          Worker가 <strong>대화형 Prompt 대기</strong> 상태에 걸린 경우 Enter가 풀어줌<br />
          예: <code>rm: remove 'file.txt'? </code>같은 y/n Prompt<br />
          Enter는 기본값 수락(또는 거부) — 대화 계속 진행<br />
          주의: Enter가 의도치 않은 동작 유발 가능 — 다음 Prompt에서 감지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">restart_worker() — 워커 재시작</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn restart_worker(worker: &mut Worker) -> Result<()> {
    // 1) 기존 프로세스 종료
    if let Some(pid) = worker.pid {
        let _ = kill(Pid::from_raw(pid as i32), Signal::SIGTERM);
        tokio::time::sleep(Duration::from_millis(500)).await;
        let _ = kill(Pid::from_raw(pid as i32), Signal::SIGKILL);  // 강제
    }

    // 2) 터미널 핸들 해제
    worker.terminal = None;

    // 3) 상태 초기화
    worker.status = WorkerStatus::Idle;

    // 4) 재시작
    worker.transition(WorkerStatus::Launching)?;
    let (terminal, pid) = launch_process(&worker.task_config).await?;
    worker.terminal = Some(terminal);
    worker.pid = Some(pid);

    // 5) Trust 재결정 (이미 캐시되어 있으면 빠름)
    worker.transition(WorkerStatus::TrustResolving)?;
    worker.trust = Some(TrustResolver::resolve(&worker.workspace).await?);
    worker.transition(WorkerStatus::Ready)?;

    Ok(())
}`}</pre>
        <p>
          <strong>SIGTERM → SIGKILL</strong>: graceful → forceful 종료<br />
          SIGTERM 500ms 대기 후 응답 없으면 SIGKILL — 좀비 프로세스 방지<br />
          재시작은 <strong>Worker 수명의 종료-시작을 빠르게 반복</strong> — 상태 전이 흐름 재사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Misdelivery 통계 수집</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 텔레메트리에 기록
pub struct MisdeliveryStats {
    total_sends: u64,
    misdelivery_count: u64,
    recovery_success: u64,
    recovery_restart: u64,
}

impl MisdeliveryStats {
    pub fn rate(&self) -> f64 {
        self.misdelivery_count as f64 / self.total_sends.max(1) as f64
    }
}

// 주기적 체크 (매 100회 send마다)
if stats.total_sends % 100 == 0 {
    let rate = stats.rate();
    if rate > 0.05 {
        log::warn!("misdelivery rate {:.1}% — investigate", rate * 100.0);
    }
}`}</pre>
        <p>
          <strong>5% 이상 발생 시 경고</strong> — 시스템 문제 의심<br />
          정상 환경에서는 misdelivery rate가 1% 미만<br />
          높은 rate는 <strong>환경 문제</strong>(tty 드라이버, 버퍼 크기) 시그널
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">디버깅 지원 — 화면 덤프</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// misdelivery 발생 시 화면 덤프
if attempt >= 3 {
    let dump_path = workspace_root()
        .join(".claw/debug")
        .join(format!("misdelivery-{}-{}.txt", worker.id, Utc::now().timestamp()));

    let screen = worker.terminal.as_ref().unwrap().get_screen_text();
    tokio::fs::write(&dump_path, format!(
        "=== prompt ===\\n{}\\n\\n=== screen ===\\n{}",
        prompt, screen
    )).await?;

    log::info!("screen dumped to {:?}", dump_path);
}`}</pre>
        <p>
          <strong>화면 덤프 파일</strong>: <code>.claw/debug/misdelivery-*.txt</code><br />
          사용자·지원팀이 나중에 분석 — "왜 프롬프트가 전달 안 됐는지" 추적<br />
          덤프 파일 주기적 정리(7일 이상) — 디스크 오염 방지
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: pty 기반 자동화의 근본 한계</p>
          <p>
            pty 기반 Worker 제어는 <strong>"사람처럼 터미널을 사용"</strong>하는 접근<br />
            장점: 기존 CLI 도구 재사용, 프로토콜 정의 불필요<br />
            단점: race condition, 타이밍 의존, 화면 출력 형식에 결합
          </p>
          <p className="mt-2">
            misdelivery는 이 한계의 <strong>필연적 증상</strong>:<br />
            - pty는 스트림 기반 — 프롬프트와 응답 경계가 애매<br />
            - 화면은 크기 가변 — 텍스트가 잘리거나 스크롤됨<br />
            - 전송·수신이 비동기 — 타이밍 이슈 내재
          </p>
          <p className="mt-2">
            claw-code의 해법: <strong>"실패 전제, 복구 자동화"</strong><br />
            - 에코백 확인으로 실패 감지<br />
            - 4단계 복구 전략으로 자동 회복<br />
            - 통계 수집으로 체계 문제 조기 포착<br />
            결과적으로 <strong>완벽한 전달은 불가능하지만 안정적 동작은 가능</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
