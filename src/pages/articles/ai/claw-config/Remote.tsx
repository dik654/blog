import RemoteViz from './viz/RemoteViz';
import WsProtocolViz from './viz/WsProtocolViz';

export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 세션 &amp; 업스트림 프록시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RemoteViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">원격 세션이란</h3>
        <p>
          claw-code를 <strong>원격 서버에서 실행</strong>하되 로컬 CLI로 제어하는 모드<br />
          사용 사례:<br />
          - 회사 서버에서 claw-code 실행, 로컬 터미널로 접근<br />
          - GPU 서버에서 에이전트 실행<br />
          - 팀원과 세션 공유 (한 세션을 여러 명이 관찰)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">아키텍처</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`로컬 CLI (claw --remote server.example.com)
    ↓ WebSocket
원격 프록시 (wss://server.example.com:8443)
    ↓ IPC
원격 claw-code 프로세스
    ↓ stdio
MCP 서버 / 플러그인 / 파일 시스템 (원격)`}</pre>
        <p>
          <strong>3계층 구조</strong>: 로컬 CLI → 원격 프록시 → 원격 claw-code<br />
          WebSocket으로 양방향 통신 — 메시지, 스트리밍, 도구 호출 모두 투과<br />
          원격 claw-code는 자체 워크스페이스 보유 — 로컬과 독립
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">설정</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "remote": {
    "enabled": true,
    "url": "wss://server.example.com:8443",
    "auth_token": "...",
    "reconnect_on_disconnect": true,
    "heartbeat_interval_ms": 30000
  }
}`}</pre>
        <p>
          <strong>주요 필드</strong>:<br />
          - <code>url</code>: WebSocket Secure 필수 (암호화)<br />
          - <code>auth_token</code>: Bearer 토큰 — 서버 인증<br />
          - <code>heartbeat_interval_ms</code>: 30초마다 ping
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RemoteProxy 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct RemoteProxy {
    ws: WebSocketStream<TcpStream>,
    pending_requests: HashMap<u64, oneshot::Sender<Value>>,
    next_req_id: AtomicU64,
}

impl RemoteProxy {
    pub async fn connect(config: &RemoteConfig) -> Result<Self> {
        let (ws, _) = tokio_tungstenite::connect_async(
            format!("{}/session", config.url)
        ).await?;

        // 인증 메시지 전송
        ws.send(WsMessage::Text(json!({
            "type": "auth",
            "token": config.auth_token,
        }).to_string())).await?;

        // 인증 응답 확인
        let auth_resp = ws.next().await.ok_or(anyhow!("no auth response"))??;
        if !auth_resp.is_authenticated() {
            return Err(anyhow!("auth failed"));
        }

        Ok(Self {
            ws,
            pending_requests: HashMap::new(),
            next_req_id: AtomicU64::new(1),
        })
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">메시지 프로토콜</h3>
        <WsProtocolViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// assistant_delta 예시
{"type":"assistant_delta","id":1,"payload":{"delta":{"text":"hello"}}}

// tool_event 예시 (도구 호출·결과 전달)
{"type":"tool_event","payload":{"name":"bash","status":"started"}}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">스트리밍 투과</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 원격 claw-code가 LLM 스트림을 수신하면
// 각 청크를 즉시 WebSocket으로 로컬에 전달

async fn forward_stream_to_remote(
    proxy: &mut RemoteProxy,
    mut stream: BoxStream<'_, Result<Chunk>>,
) -> Result<()> {
    let req_id = proxy.next_req_id.fetch_add(1, Ordering::SeqCst);

    while let Some(chunk) = stream.next().await {
        let msg = json!({
            "type": "assistant_delta",
            "id": req_id,
            "payload": chunk?,
        });
        proxy.ws.send(WsMessage::Text(msg.to_string())).await?;
    }

    // 종료 시그널
    proxy.ws.send(WsMessage::Text(json!({
        "type": "assistant_complete", "id": req_id,
    }).to_string())).await?;

    Ok(())
}`}</pre>
        <p>
          <strong>청크 단위 전달</strong>: LLM 응답 수신 즉시 로컬로 전송<br />
          로컬 CLI는 동일한 렌더링 경험 — 원격/로컬 차이 없음<br />
          WebSocket 지연(~20-100ms) 추가되지만 사용자 체감 거의 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">권한 Prompt 원격 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 원격 세션: bash 호출 시 Prompt 필요
// 원격 서버에서는 사용자 stdin 없음 → 로컬에 위임

// 원격 → 로컬
{
  "type": "permission_prompt",
  "id": 1,
  "payload": {
    "message": "Run: rm -rf cache?",
    "tool": "bash"
  }
}

// 로컬 CLI가 사용자에게 Y/N 물음

// 로컬 → 원격
{
  "type": "permission_response",
  "id": 1,
  "payload": {"answer": "yes"}
}`}</pre>
        <p>
          <strong>Prompt는 로컬 사용자에게 위임</strong>: 원격 서버가 직접 물을 수 없음<br />
          WebSocket 양방향 통신으로 왕복 — 타임아웃 60초<br />
          타임아웃 초과 시 "no" 응답 취급 — 안전 편향
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">재연결 로직</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl RemoteProxy {
    pub async fn run_with_reconnect(&mut self) -> Result<()> {
        let mut backoff = Duration::from_secs(1);

        loop {
            match self.run_session().await {
                Ok(()) => break,  // 정상 종료
                Err(e) if self.config.reconnect_on_disconnect => {
                    log::warn!("disconnect: {}, reconnecting in {:?}", e, backoff);
                    tokio::time::sleep(backoff).await;

                    // 재연결 시도
                    match RemoteProxy::connect(&self.config).await {
                        Ok(new) => {
                            *self = new;
                            backoff = Duration::from_secs(1);  // 리셋
                        }
                        Err(_) => {
                            backoff = (backoff * 2).min(Duration::from_secs(60));
                        }
                    }
                }
                Err(e) => return Err(e),
            }
        }
        Ok(())
    }
}`}</pre>
        <p>
          <strong>지수 백오프</strong>: 1s → 2s → 4s → ... → 60s<br />
          재연결 성공 시 백오프 리셋 — 다음 끊김에 빠르게 대응<br />
          <strong>세션 상태는 원격에 보존</strong> — 재연결해도 이전 대화 이어감
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 원격 세션의 활용 시나리오</p>
          <p>
            1. <strong>리소스 격리</strong>: 대규모 프로젝트를 서버에서 실행 (로컬 노트북은 가벼움 유지)<br />
            2. <strong>지속 실행</strong>: 로컬 꺼도 서버는 계속 작동 — 오래 걸리는 작업<br />
            3. <strong>팀 공유</strong>: 한 서버 세션을 여러 팀원이 관찰 (read-only 모드)<br />
            4. <strong>보안</strong>: 민감 코드는 서버에만 두고 로컬에 다운로드 안 함
          </p>
          <p className="mt-2">
            <strong>주의사항</strong>:<br />
            - 원격 서버는 <strong>trusted environment</strong>여야 함<br />
            - 네트워크 끊김 = 권한 Prompt 응답 불가 → 도구 실행 대기<br />
            - WebSocket 대역폭 제한 시 LLM 스트리밍 지연
          </p>
          <p className="mt-2">
            claw-code 원격 세션은 <strong>"로컬 경험 + 서버 파워"</strong> 조합<br />
            기존 tmux/ssh 방식 대비: 권한 관리, 로그 표시 등 UI 품질 우수
          </p>
        </div>

      </div>
    </section>
  );
}
