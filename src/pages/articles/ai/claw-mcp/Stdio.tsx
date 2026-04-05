import JsonRpcViz from './viz/JsonRpcViz';

export default function Stdio() {
  return (
    <section id="stdio" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">McpStdioProcess — 프로세스 관리 &amp; JSON-RPC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <JsonRpcViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">McpStdioProcess 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct McpStdioProcess {
    child: tokio::process::Child,
    stdin_writer: Arc<Mutex<ChildStdin>>,
    stdout_reader: Arc<Mutex<BufReader<ChildStdout>>>,
    pending_requests: Arc<Mutex<HashMap<u64, oneshot::Sender<Value>>>>,
    next_request_id: AtomicU64,
    reader_task: JoinHandle<()>,
}`}</pre>
        <p>
          <strong>구성 요소</strong>:<br />
          - <code>child</code>: 서브프로세스 핸들<br />
          - stdin/stdout: JSON-RPC 입출력 채널<br />
          - <code>pending_requests</code>: id → 응답 채널 매핑<br />
          - <code>reader_task</code>: stdout 백그라운드 읽기 태스크
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">spawn() — 서브프로세스 시작</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpStdioProcess {
    pub async fn spawn(config: &McpServerConfig) -> Result<Self> {
        let mut cmd = tokio::process::Command::new(&config.command);
        cmd.args(&config.args)
           .envs(&config.env)
           .stdin(Stdio::piped())
           .stdout(Stdio::piped())
           .stderr(Stdio::piped());

        if let Some(cwd) = &config.cwd {
            cmd.current_dir(cwd);
        }

        let mut child = cmd.spawn()?;
        let stdin = child.stdin.take().unwrap();
        let stdout = child.stdout.take().unwrap();
        let stderr = child.stderr.take().unwrap();

        // stderr는 로그로 별도 처리
        tokio::spawn(Self::drain_stderr(stderr));

        let pending = Arc::new(Mutex::new(HashMap::new()));

        // stdout 리더 백그라운드 태스크 시작
        let reader_task = tokio::spawn(Self::reader_loop(
            stdout, Arc::clone(&pending)
        ));

        Ok(Self {
            child,
            stdin_writer: Arc::new(Mutex::new(stdin)),
            stdout_reader: Arc::new(Mutex::new(BufReader::new(...))),
            pending_requests: pending,
            next_request_id: AtomicU64::new(1),
            reader_task,
        })
    }
}`}</pre>
        <p>
          <strong>3개 스트림 확보</strong>: stdin(요청), stdout(응답), stderr(로그)<br />
          stdout 리더는 <strong>독립 태스크</strong> — 응답 수신을 비동기로 처리<br />
          stderr는 별도 태스크가 drain — 버퍼 오버플로 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">reader_loop — 백그라운드 응답 수신</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpStdioProcess {
    async fn reader_loop(
        stdout: ChildStdout,
        pending: Arc<Mutex<HashMap<u64, oneshot::Sender<Value>>>>,
    ) {
        let mut reader = BufReader::new(stdout).lines();

        while let Ok(Some(line)) = reader.next_line().await {
            // 각 줄이 하나의 JSON-RPC 메시지
            let msg: Value = match serde_json::from_str(&line) {
                Ok(v) => v,
                Err(e) => {
                    log::warn!("MCP parse error: {}", e);
                    continue;
                }
            };

            // id 추출 (요청/응답 매칭)
            if let Some(id) = msg.get("id").and_then(|v| v.as_u64()) {
                let mut pending = pending.lock().await;
                if let Some(sender) = pending.remove(&id) {
                    let _ = sender.send(msg);  // 응답 전달
                }
            } else {
                // 알림(notification) 처리
                handle_notification(msg).await;
            }
        }
    }
}`}</pre>
        <p>
          <strong>JSON-RPC 프레이밍</strong>: 한 줄 = 한 메시지 (line-delimited JSON)<br />
          <code>id</code> 매칭으로 요청-응답 쌍 짝지음 — <code>pending_requests</code> 맵에서 찾아 전달<br />
          id 없는 메시지는 알림 — 별도 처리 (progress, log 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">send() — 요청 전송</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpStdioProcess {
    pub async fn send(&self, method: &str, params: Value) -> Result<Value> {
        // 1) 고유 ID 생성
        let id = self.next_request_id.fetch_add(1, Ordering::SeqCst);

        // 2) oneshot 채널 등록
        let (tx, rx) = oneshot::channel();
        {
            let mut pending = self.pending_requests.lock().await;
            pending.insert(id, tx);
        }

        // 3) JSON-RPC 요청 조립
        let request = json!({
            "jsonrpc": "2.0",
            "id": id,
            "method": method,
            "params": params,
        });

        // 4) stdin으로 전송 (줄바꿈 포함)
        {
            let mut writer = self.stdin_writer.lock().await;
            writer.write_all(request.to_string().as_bytes()).await?;
            writer.write_all(b"\\n").await?;
            writer.flush().await?;
        }

        // 5) 응답 대기
        let response = rx.await?;

        // 6) 에러 체크
        if let Some(err) = response.get("error") {
            return Err(anyhow!("MCP error: {}", err));
        }

        Ok(response.get("result").cloned().unwrap_or(Value::Null))
    }
}`}</pre>
        <p>
          <strong>6단계 전송</strong>: ID 생성 → 채널 등록 → 요청 조립 → 전송 → 응답 대기 → 결과 반환<br />
          <code>oneshot</code> 채널: 1회용 비동기 채널 — 요청-응답 쌍에 적합<br />
          ID는 <code>AtomicU64</code>로 동시성 안전 증가 — 여러 태스크에서 동시 요청 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">알림 처리 — handle_notification()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn handle_notification(msg: Value) {
    let method = msg.get("method").and_then(|v| v.as_str()).unwrap_or("");
    let params = msg.get("params").cloned().unwrap_or(Value::Null);

    match method {
        "notifications/progress" => {
            // 진행률 업데이트 — UI에 표시
            emit_event(RuntimeEvent::McpProgress {
                server: current_server(),
                params,
            });
        }
        "notifications/message" => {
            // 서버 로그 메시지
            log::info!("MCP log: {}", params);
        }
        "notifications/cancelled" => {
            // 취소 알림
            log::info!("MCP operation cancelled");
        }
        _ => log::debug!("unknown MCP notification: {}", method),
    }
}`}</pre>
        <p>
          <strong>3종 표준 알림</strong>: progress, message, cancelled<br />
          progress 알림은 장시간 실행 도구(예: DB 쿼리)에서 유용 — 사용자에게 진행 표시<br />
          알려지지 않은 알림은 debug 로그로만 — 호환성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">stderr drain — 무한 대기 방지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn drain_stderr(stderr: ChildStderr) {
    let mut reader = BufReader::new(stderr).lines();
    while let Ok(Some(line)) = reader.next_line().await {
        log::debug!("MCP stderr: {}", line);
    }
}`}</pre>
        <p>
          <strong>stderr를 읽지 않으면 버퍼 가득 찰 수 있음</strong> → MCP 서버 block<br />
          별도 태스크로 지속적으로 drain — MCP 서버가 계속 로그 쓸 수 있게<br />
          서버 로그는 <code>log::debug!</code>로 기록 — 조사 필요 시 확인
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">kill() — 프로세스 강제 종료</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpStdioProcess {
    pub async fn kill(&mut self) -> Result<()> {
        // 1) 리더 태스크 취소
        self.reader_task.abort();

        // 2) 대기 중인 모든 요청 실패 처리
        let mut pending = self.pending_requests.lock().await;
        for (_, sender) in pending.drain() {
            let _ = sender.send(json!({"error": "process killed"}));
        }

        // 3) SIGTERM
        let _ = self.child.start_kill();
        tokio::time::sleep(Duration::from_millis(500)).await;

        // 4) SIGKILL if still alive
        if let Ok(None) = self.child.try_wait() {
            let _ = self.child.kill().await;
        }

        Ok(())
    }
}`}</pre>
        <p>
          <strong>4단계 종료</strong>: 리더 취소 → 대기 요청 정리 → SIGTERM → SIGKILL<br />
          대기 요청을 "process killed" 에러로 완료 — deadlock 방지<br />
          SIGTERM → 500ms 대기 → SIGKILL — graceful 먼저, 안 되면 강제
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 stdio인가 — HTTP와 비교</p>
          <p>
            MCP는 stdio 외에도 HTTP SSE, WebSocket 등 전송 방식 가능<br />
            <strong>stdio의 장점</strong>:
          </p>
          <p className="mt-2">
            ✓ <strong>프로세스 수명 = 연결 수명</strong>: 프로세스 죽으면 연결 끊김 (명확)<br />
            ✓ <strong>보안</strong>: 로컬 IPC만 — 네트워크 노출 없음<br />
            ✓ <strong>권한 격리</strong>: 서브프로세스 권한은 부모가 제어<br />
            ✓ <strong>포트 충돌 없음</strong>: 여러 MCP 서버 동시 실행 용이
          </p>
          <p className="mt-2">
            <strong>stdio의 단점</strong>:<br />
            ✗ 원격 서버 불가 — 같은 머신에서만<br />
            ✗ 다중 클라이언트 불가 — 1:1 연결만
          </p>
          <p className="mt-2">
            claw-code는 <strong>로컬 도구 확장</strong>이 주 사용 사례 — stdio가 최적<br />
            원격 MCP 필요 시 HTTP 서버를 stdio 서브프로세스가 프록시하는 패턴 사용
          </p>
        </div>

      </div>
    </section>
  );
}
