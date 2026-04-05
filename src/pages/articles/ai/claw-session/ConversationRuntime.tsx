import TurnLoopViz from './viz/TurnLoopViz';
import AgentLoopDetailViz from './viz/AgentLoopDetailViz';

export default function ConversationRuntime() {
  return (
    <section id="conversation-runtime" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ConversationRuntime 오케스트레이션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TurnLoopViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">에이전트 루프의 중심</h3>
        <p>
          <code>ConversationRuntime</code>은 LLM 대화 루프의 오케스트레이터<br />
          역할: 사용자 입력 → API 호출 → 응답 파싱 → 도구 실행 → 반복<br />
          다른 모든 runtime 서브시스템(enforcer, hooks, compact)을 소유하고 조율
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct ConversationRuntime {
    pub session: Session,                   // 현재 세션 상태
    pub client: Box<dyn ProviderClient>,    // API 클라이언트 (Anthropic/OpenAI/xAI)
    pub enforcer: PermissionEnforcer,       // 권한 게이트
    pub hooks: HookRunner,                  // Pre/Post 훅
    pub compact_config: CompactionConfig,   // 압축 설정
    pub event_tx: Sender<RuntimeEvent>,     // UI 이벤트 채널
}`}</pre>
        <p>
          <code>Box&lt;dyn ProviderClient&gt;</code>로 API 클라이언트를 추상화 — 런타임에 프로바이더 교체 가능<br />
          <code>event_tx</code>는 mpsc 채널 — 비동기 UI 이벤트 전송 (토큰 청크, 도구 시작/종료 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">run_turn() — 단일 턴 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn run_turn(&mut self, user_input: String) -> Result<()> {
    // 1) 사용자 메시지 추가
    self.session.messages.push(Message::user(user_input));

    // 2) 컨텍스트 적합성 확인 (토큰 초과 시 압축)
    self.ensure_context_fits().await?;

    loop {
        // 3) API 호출 (스트리밍)
        let mut stream = self.client.send_message(self.build_request()).await?;

        // 4) 스트림 수신 & 파싱
        let response = self.consume_stream(&mut stream).await?;

        // 5) 응답 메시지 추가
        self.session.messages.push(Message::assistant(response.content.clone()));
        self.session.token_usage.accumulate(&response.usage);

        // 6) tool_use 블록 있으면 실행, 없으면 종료
        let tool_uses: Vec<_> = response.content.iter()
            .filter_map(|b| if let ContentBlock::ToolUse{..} = b { Some(b.clone()) } else { None })
            .collect();

        if tool_uses.is_empty() {
            break;  // assistant 턴 종료
        }

        // 7) 도구들 병렬 실행
        let results = self.handle_tool_uses_parallel(tool_uses).await;

        // 8) tool_result 메시지 추가 후 다시 루프
        self.session.messages.push(Message::tool_results(results));
    }

    Ok(())
}`}</pre>
        <p>
          <strong>8단계 턴 루프</strong>:<br />
          1. 사용자 메시지 추가<br />
          2. 컨텍스트 적합성 검사 (압축 트리거)<br />
          3. API 호출<br />
          4. 스트림 파싱<br />
          5. 응답 기록<br />
          6. tool_use 추출<br />
          7. 병렬 실행<br />
          8. tool_result 추가 → 루프 (LLM이 후속 도구 호출을 요청할 수 있음)
        </p>
        <p>
          <strong>루프 종료 조건</strong>: LLM 응답에 <code>tool_use</code>가 없을 때<br />
          최대 도구 호출 체인 길이: 기본 25 (무한 루프 방지) — 설정 가능
        </p>

      </div>
      <AgentLoopDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">consume_stream() — SSE 파서</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn consume_stream(
    &mut self,
    stream: &mut Stream<Chunk>,
) -> Result<AssistantResponse> {
    let mut builder = ResponseBuilder::new();

    while let Some(chunk) = stream.next().await {
        match chunk? {
            Chunk::MessageStart { id } => builder.set_id(id),
            Chunk::ContentBlockStart { index, block } => builder.open_block(index, block),
            Chunk::ContentBlockDelta { index, delta } => {
                builder.apply_delta(index, delta.clone());
                // UI에 실시간 토큰 이벤트 방출
                self.event_tx.send(RuntimeEvent::Delta { index, delta }).await.ok();
            }
            Chunk::ContentBlockStop { index } => builder.close_block(index),
            Chunk::MessageDelta { stop_reason, usage } => builder.set_usage(usage, stop_reason),
            Chunk::MessageStop => break,
        }
    }

    builder.finalize()
}`}</pre>
        <p>
          <strong>SSE 상태 머신</strong>: MessageStart → (ContentBlockStart → Delta* → ContentBlockStop)* → MessageDelta → MessageStop<br />
          <code>ResponseBuilder</code>는 청크를 누적하여 완전한 메시지를 조립<br />
          각 <code>ContentBlockDelta</code>는 UI에 즉시 전파 — 사용자에게 스트리밍 경험 제공
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">build_request() — API 요청 조립</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn build_request(&self) -> MessageRequest {
    MessageRequest {
        model: self.config.model.clone(),
        system: Some(self.build_system_prompt()),
        messages: self.session.messages.iter()
            .filter(|m| !matches!(m.role, Role::System))  // system은 별도 필드
            .map(|m| m.to_api_format())
            .collect(),
        tools: Some(self.registry.list_tools_for_api()),
        max_tokens: self.config.max_output_tokens,
        temperature: Some(self.config.temperature),
        stream: true,
    }
}`}</pre>
        <p>
          <strong>API 요청 구성</strong>: system 프롬프트 + messages + tools + 생성 파라미터<br />
          System 메시지는 배열에서 필터링되어 별도 <code>system</code> 필드로 이동 — Anthropic API 규격<br />
          <code>list_tools_for_api()</code>는 GlobalToolRegistry의 40+ 도구를 Anthropic 형식으로 직렬화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">에러 처리 & 재시도</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn call_with_retry(&mut self) -> Result<AssistantResponse> {
    let mut attempt = 0;
    loop {
        match self.client.send_message(self.build_request()).await {
            Ok(mut s) => return self.consume_stream(&mut s).await,
            Err(e) if attempt < MAX_RETRIES && e.is_retryable() => {
                let backoff = Duration::from_millis(250 * 2u64.pow(attempt));
                tokio::time::sleep(backoff).await;
                attempt += 1;
            }
            Err(e) if e.is_context_length_exceeded() => {
                // 즉시 압축 후 재시도
                self.force_compact().await?;
                attempt += 1;
            }
            Err(e) => return Err(e),
        }
    }
}`}</pre>
        <p>
          <strong>3가지 에러 처리 전략</strong>:<br />
          1. <strong>재시도 가능 오류</strong>(5xx, 429): 지수 백오프로 재시도<br />
          2. <strong>컨텍스트 초과</strong>: 즉시 압축 후 재시도 — 사용자 개입 없음<br />
          3. <strong>기타 오류</strong>: 즉시 전파 — 사용자가 처리
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 도구 루프의 무한 실행 방지</p>
          <p>
            LLM이 도구 호출을 반복하며 무한 루프에 빠질 수 있음 — 같은 도구 계속 호출, 진전 없는 상태<br />
            claw-code의 방어책:<br />
            - <strong>최대 체인 길이 25</strong>: 기본값, 설정으로 조정<br />
            - <strong>반복 패턴 감지</strong>: 같은 도구를 같은 입력으로 3회 연속 호출 시 경고<br />
            - <strong>토큰 예산 체크</strong>: 매 턴 시작 시 ensure_context_fits() — 초과 시 압축
          </p>
          <p className="mt-2">
            트레이드오프: 25가 너무 작으면 복잡한 태스크 실패, 너무 크면 비용 폭증<br />
            경험적 관찰: 대부분의 코딩 태스크는 10-15턴 내 완료
          </p>
        </div>

      </div>
    </section>
  );
}
