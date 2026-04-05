import SseParserViz from './viz/SseParserViz';

export default function Sse() {
  return (
    <section id="sse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSE 파서 — 서버 전송 이벤트 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SseParserViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">SSE(Server-Sent Events)란</h3>
        <p>
          SSE: HTTP 기반 <strong>단방향 서버 → 클라이언트 스트리밍</strong> 프로토콜<br />
          WebSocket과 비교: 단순, HTTP 호환, 재연결 자동<br />
          LLM API 응답 스트리밍의 표준 — Anthropic, OpenAI, xAI 모두 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 프레임 형식</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`event: message_start
data: {"type":"message_start","message":{...}}
id: 1

event: content_block_delta
data: {"type":"text_delta","text":"hello"}
id: 2

(빈 줄 = 이벤트 경계)

event: message_stop
data: {}
id: 3`}</pre>
        <p>
          <strong>프레임 구성</strong>: <code>event:</code> + <code>data:</code> + <code>id:</code> + 빈 줄<br />
          각 필드는 독립 라인 — newline이 구분자<br />
          빈 줄(<code>\n\n</code>)이 <strong>이벤트 경계</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SseParser 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct SseParser {
    buffer: String,
    current_event: Option<SseEvent>,
}

pub struct SseEvent {
    pub event_type: Option<String>,
    pub data: String,
    pub id: Option<String>,
}

impl SseParser {
    pub fn feed(&mut self, chunk: &str) -> Vec<SseEvent> {
        self.buffer.push_str(chunk);
        let mut events = Vec::new();

        while let Some(boundary) = self.buffer.find("\\n\\n") {
            let raw_event = self.buffer[..boundary].to_string();
            self.buffer.drain(..boundary + 2);

            if let Some(event) = parse_sse_block(&raw_event) {
                events.push(event);
            }
        }

        events
    }
}

fn parse_sse_block(text: &str) -> Option<SseEvent> {
    let mut event = SseEvent {
        event_type: None,
        data: String::new(),
        id: None,
    };

    for line in text.lines() {
        if let Some(rest) = line.strip_prefix("event: ") {
            event.event_type = Some(rest.to_string());
        } else if let Some(rest) = line.strip_prefix("data: ") {
            if !event.data.is_empty() { event.data.push('\\n'); }
            event.data.push_str(rest);
        } else if let Some(rest) = line.strip_prefix("id: ") {
            event.id = Some(rest.to_string());
        }
        // 다른 prefix는 무시
    }

    if event.data.is_empty() { None } else { Some(event) }
}`}</pre>
        <p>
          <strong>스트리밍 파서</strong>: <code>feed()</code>를 청크마다 호출<br />
          버퍼에 누적, 완전한 프레임(<code>\n\n</code>)만 추출<br />
          multi-line <code>data:</code> 지원 — 여러 줄이면 <code>\n</code>으로 결합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 — AnthropicClient 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl AnthropicClient {
    async fn stream_messages(
        &self,
        response: Response,
    ) -> impl Stream<Item = Result<Chunk>> {
        let mut parser = SseParser::new();
        let bytes_stream = response.bytes_stream();

        async_stream::stream! {
            futures::pin_mut!(bytes_stream);
            while let Some(bytes_result) = bytes_stream.next().await {
                let bytes = bytes_result?;
                let text = std::str::from_utf8(&bytes)?;

                for event in parser.feed(text) {
                    // SSE 이벤트 → Chunk 변환
                    if let Some(chunk) = convert_event_to_chunk(&event)? {
                        yield Ok(chunk);
                    }
                }
            }
        }
    }
}`}</pre>
        <p>
          <strong>async_stream</strong>: async generator 매크로 — yield 가능<br />
          HTTP 응답 바이트 스트림 → SSE 이벤트 → Chunk 스트림<br />
          각 계층이 단일 책임 — 변환·필터링 분리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">OpenAI SSE 차이점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic 형식: event + data 쌍
event: content_block_delta
data: {"type":"text_delta","text":"hello"}

// OpenAI 형식: data만 사용, event 필드 없음
data: {"choices":[{"delta":{"content":"hello"}}]}

// OpenAI 스트림 종료 sentinel
data: [DONE]

// OpenAICompatClient에서 처리
fn convert_openai_event(event: &SseEvent) -> Option<Chunk> {
    if event.data == "[DONE]" {
        return Some(Chunk::MessageStop);
    }
    let parsed: Value = serde_json::from_str(&event.data).ok()?;
    // ... 표준 Chunk로 변환
}`}</pre>
        <p>
          <strong>OpenAI는 event 필드 없음</strong>: data 내부로 타입 구분<br />
          <code>[DONE]</code> sentinel: 스트림 종료 표시<br />
          OpenAICompatClient가 둘 다 처리 — event_type이 None일 때 OpenAI 처리 경로
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">에러 처리 — 불완전 프레임</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl SseParser {
    pub fn flush(&mut self) -> Option<SseEvent> {
        // 연결 종료 시 남은 버퍼 처리
        if self.buffer.is_empty() { return None; }

        // \\n\\n 없어도 마지막 프레임 시도
        let text = std::mem::take(&mut self.buffer);
        parse_sse_block(&text)
    }
}

// 사용
let events = parser.feed(chunk);
// ... 스트림 종료 ...
if let Some(last) = parser.flush() {
    // 마지막 이벤트 처리
}`}</pre>
        <p>
          <strong>flush()</strong>: 스트림 종료 시 잔여 버퍼 강제 파싱<br />
          정상 서버는 항상 <code>\n\n</code>로 끝냄 — flush는 비정상 상황<br />
          불완전 프레임은 파싱 실패 가능 — None 반환하여 graceful 처리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">재연결 처리 (Last-Event-ID)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SSE 표준: 재연결 시 마지막 받은 id 전송
impl SseParser {
    pub fn last_id(&self) -> Option<&str> {
        self.last_event_id.as_deref()
    }
}

// 재연결 시
let last_id = parser.last_id();
let mut req = client.get(&url);
if let Some(id) = last_id {
    req = req.header("Last-Event-ID", id);
}
let resp = req.send().await?;
// 서버가 id 이후 이벤트부터 재생`}</pre>
        <p>
          <strong>Last-Event-ID 헤더</strong>: SSE 표준 재연결 메커니즘<br />
          클라이언트가 마지막 id 전송 → 서버가 그 이후 이벤트 재생<br />
          <strong>Anthropic API는 현재 미지원</strong> — claw-code는 재시작으로 처리
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: SSE vs WebSocket 선택</p>
          <p>
            LLM API가 WebSocket 대신 <strong>SSE를 선택한 이유</strong>:
          </p>
          <p className="mt-2">
            ✓ <strong>단방향 스트리밍 충분</strong>: 클라이언트 → 서버는 HTTP POST로 이미 완료<br />
            ✓ <strong>HTTP 호환</strong>: 기존 프록시·로드밸런서·인증 재사용<br />
            ✓ <strong>자동 재연결</strong>: 브라우저 기본 지원 (EventSource API)<br />
            ✓ <strong>단순함</strong>: 프레이밍·handshake 복잡도 낮음
          </p>
          <p className="mt-2">
            <strong>WebSocket 더 나은 경우</strong>:<br />
            - 양방향 실시간 통신 (채팅, 게임)<br />
            - 바이너리 데이터<br />
            - 낮은 지연시간 필수
          </p>
          <p className="mt-2">
            LLM 스트리밍은 <strong>텍스트 + 단방향</strong> — SSE가 최적<br />
            claw-code는 SSE만 지원 — WebSocket 필요 시 별도 통합 레이어 추가
          </p>
        </div>

      </div>
    </section>
  );
}
