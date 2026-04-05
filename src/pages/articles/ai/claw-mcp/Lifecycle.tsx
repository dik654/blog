import McpLifecycleViz from './viz/McpLifecycleViz';

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">McpLifecycleValidator — 11단계 상태 전이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <McpLifecycleViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">11단계 상태 enum</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum McpState {
    Uninitialized,        // 1. 초기 상태
    Spawning,             // 2. 프로세스 시작 중
    Spawned,              // 3. 프로세스 시작됨
    Initializing,         // 4. initialize 요청 전송 중
    Initialized,          // 5. initialize 응답 수신
    CapabilityListing,    // 6. tools/list, resources/list 조회 중
    Ready,                // 7. 사용 가능 상태
    Degraded,             // 8. 일부 기능 실패, 계속 작동
    Disconnecting,        // 9. 연결 종료 중
    Disconnected,         // 10. 연결 종료 완료
    Failed,               // 11. 복구 불가 오류
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">각 단계 실행 로직</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpLifecycleValidator {
    pub async fn advance(&mut self) -> Result<()> {
        match self.state {
            McpState::Uninitialized => self.state = McpState::Spawning,

            McpState::Spawning => {
                // 서브프로세스 생성
                self.process = Some(McpStdioProcess::spawn(&self.config).await?);
                self.state = McpState::Spawned;
            }

            McpState::Spawned => {
                // initialize 요청 전송
                let req = json!({
                    "jsonrpc": "2.0", "id": 1, "method": "initialize",
                    "params": {"protocolVersion": "2024-11-05"}
                });
                self.process.as_ref().unwrap().send(req).await?;
                self.state = McpState::Initializing;
            }

            McpState::Initializing => {
                // 응답 대기 (타임아웃 10초)
                let resp = tokio::time::timeout(
                    Duration::from_secs(10),
                    self.process.as_ref().unwrap().receive(),
                ).await??;
                self.capabilities = parse_capabilities(resp)?;
                self.state = McpState::Initialized;
            }

            McpState::Initialized => self.state = McpState::CapabilityListing,

            McpState::CapabilityListing => {
                self.tools = self.fetch_tools().await?;
                self.resources = self.fetch_resources().await.unwrap_or_default();
                self.state = McpState::Ready;
            }

            McpState::Ready | McpState::Degraded => {}  // 정상 작동

            // ... 종료 전이 로직
            _ => {}
        }
        Ok(())
    }
}`}</pre>
        <p>
          <strong>상태별 진입 동작</strong>: 각 상태 도달 시 자동으로 다음 단계 작업 수행<br />
          initialize는 MCP 프로토콜 필수 첫 메시지 — 서버 능력 협상<br />
          CapabilityListing 실패 시 Degraded — 일부만 작동해도 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Degraded 모드 — 부분 실패 대응</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CapabilityListing에서 일부 실패
impl McpLifecycleValidator {
    async fn fetch_resources(&self) -> Result<Vec<McpResource>> {
        match self.call("resources/list", json!({})).await {
            Ok(resp) => Ok(parse_resources(resp)?),
            Err(e) => {
                log::warn!("resources/list failed: {}", e);
                // Degraded로 전이
                self.state = McpState::Degraded;
                Err(e)
            }
        }
    }
}

// Degraded 상태에서도 사용 가능한 기능:
// - 성공한 tools/list의 도구들은 호출 가능
// - 실패한 resources/list는 리소스 기능 없음
// - 클라이언트는 "resources 지원 안 함" 취급`}</pre>
        <p>
          <strong>graceful degradation</strong>: 전체 실패 대신 부분 기능으로 계속<br />
          MCP 서버가 리소스 지원 안 할 수도 있음 — 정상적인 Degraded<br />
          Ready와 Degraded 모두에서 <strong>도구 호출 가능</strong> — 실패한 기능만 비활성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">timeout &amp; 재시도 로직</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 타임아웃별 설정
const SPAWN_TIMEOUT: Duration = Duration::from_secs(5);        // 프로세스 시작
const INIT_TIMEOUT: Duration = Duration::from_secs(10);        // initialize 응답
const CAPABILITY_TIMEOUT: Duration = Duration::from_secs(5);   // list 응답
const CALL_TIMEOUT: Duration = Duration::from_secs(30);        // 일반 도구 호출

// 재시도 전략
impl McpLifecycleValidator {
    async fn advance_with_retry(&mut self) -> Result<()> {
        let max_attempts = 3;
        for attempt in 0..max_attempts {
            match self.advance().await {
                Ok(()) => return Ok(()),
                Err(e) if attempt < max_attempts - 1 => {
                    log::warn!("advance failed ({}), retrying: {}", attempt, e);
                    tokio::time::sleep(Duration::from_millis(500 * (attempt as u64 + 1))).await;
                }
                Err(e) => {
                    self.state = McpState::Failed;
                    return Err(e);
                }
            }
        }
        Ok(())
    }
}`}</pre>
        <p>
          <strong>타임아웃 4개</strong>: Spawn(5s), Init(10s), Capability(5s), Call(30s)<br />
          재시도 3회 — 500ms, 1000ms, 1500ms 지수 백오프<br />
          최종 실패 시 Failed — 자동 복구 없음, 사용자 개입 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">종료 흐름 — shutdown()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpLifecycleValidator {
    pub async fn shutdown(&mut self) -> Result<()> {
        if self.state == McpState::Disconnected { return Ok(()); }

        self.state = McpState::Disconnecting;

        // 1) 진행 중인 요청 완료 대기 (최대 5초)
        tokio::time::timeout(
            Duration::from_secs(5),
            self.wait_pending_requests(),
        ).await.ok();

        // 2) shutdown 메시지 전송
        if let Some(proc) = &self.process {
            let _ = proc.send(json!({
                "jsonrpc": "2.0", "method": "shutdown"
            })).await;
        }

        // 3) 프로세스 종료
        if let Some(mut proc) = self.process.take() {
            proc.kill().await?;
        }

        self.state = McpState::Disconnected;
        Ok(())
    }
}`}</pre>
        <p>
          <strong>graceful shutdown 3단계</strong>: 요청 완료 대기 → shutdown 메시지 → 프로세스 종료<br />
          5초 대기는 진행 중 요청이 끝날 기회 부여 — 중간에 잘라내면 데이터 손실<br />
          shutdown 메시지는 MCP 표준 — 서버가 리소스 정리 후 종료 기대
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 11단계는 과한가?</p>
          <p>
            단순하게는 Connected/Disconnected 2단계로도 가능<br />
            11단계로 세분화한 이유:
          </p>
          <p className="mt-2">
            1. <strong>오류 격리</strong>: 어느 단계에서 실패했는지 명확 (Spawning vs Initializing)<br />
            2. <strong>부분 기능 지원</strong>: Degraded 상태 존재 — 일부만 작동해도 사용<br />
            3. <strong>디버깅</strong>: 로그에서 "어느 상태에서 멈췄는지" 추적 가능<br />
            4. <strong>UI 피드백</strong>: "연결 중..." "도구 목록 조회 중..." 등 사용자 인지 가능
          </p>
          <p className="mt-2">
            트레이드오프: 상태 머신 복잡도 ↑, 하지만 디버깅·관측성이 이를 상쇄<br />
            MCP 서버 연결 실패는 <strong>흔한 운영 이슈</strong> — 세분화된 상태가 진단에 필수
          </p>
        </div>

      </div>
    </section>
  );
}
