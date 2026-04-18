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
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">프레임 구성: <code>event:</code> + <code>data:</code> + <code>id:</code> + 빈 줄</p>
          <div className="space-y-2">
            <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs font-mono">
              <span className="text-blue-600 dark:text-blue-400">event:</span><span>message_start</span>
              <span className="text-emerald-600 dark:text-emerald-400">data:</span><span>{`{"type":"message_start","message":{...}}`}</span>
              <span className="text-amber-600 dark:text-amber-400">id:</span><span>1</span>
            </div>
            <div className="text-center text-xs text-muted-foreground">--- 빈 줄 (<code>\n\n</code>) = 이벤트 경계 ---</div>
            <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs font-mono">
              <span className="text-blue-600 dark:text-blue-400">event:</span><span>content_block_delta</span>
              <span className="text-emerald-600 dark:text-emerald-400">data:</span><span>{`{"type":"text_delta","text":"hello"}`}</span>
              <span className="text-amber-600 dark:text-amber-400">id:</span><span>2</span>
            </div>
            <div className="text-center text-xs text-muted-foreground">--- 빈 줄 ---</div>
            <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs font-mono">
              <span className="text-blue-600 dark:text-blue-400">event:</span><span>message_stop</span>
              <span className="text-emerald-600 dark:text-emerald-400">data:</span><span>{'{}'}</span>
              <span className="text-amber-600 dark:text-amber-400">id:</span><span>3</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">각 필드는 독립 라인 — newline이 구분자</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SseParser 구현</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">SseParser 구조</p>
              <div className="space-y-2">
                <div className="bg-muted/50 rounded-lg p-3">
                  <code className="text-xs font-mono text-blue-600 dark:text-blue-400">buffer: String</code>
                  <p className="text-xs text-muted-foreground">청크 누적 버퍼</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <code className="text-xs font-mono text-blue-600 dark:text-blue-400">current_event: Option&lt;SseEvent&gt;</code>
                  <p className="text-xs text-muted-foreground">파싱 중인 이벤트</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3 mb-2">SseEvent 필드</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs"><code className="font-mono">event_type: Option&lt;String&gt;</code></p>
                <p className="text-xs"><code className="font-mono">data: String</code></p>
                <p className="text-xs"><code className="font-mono">id: Option&lt;String&gt;</code></p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">feed(chunk) 흐름</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
                  <p className="text-xs"><code>buffer.push_str(chunk)</code> — 누적</p>
                </div>
                <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
                  <p className="text-xs"><code>buffer.find("\n\n")</code> — 경계 검색</p>
                </div>
                <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">3</span>
                  <p className="text-xs"><code>parse_sse_block</code> — prefix별 파싱</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-3 mb-2">parse_sse_block 규칙</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-xs">
                <p><code>"event: "</code> → <code>event_type</code></p>
                <p><code>"data: "</code> → <code>data</code> (multi-line: <code>\n</code> 결합)</p>
                <p><code>"id: "</code> → <code>id</code></p>
                <p className="text-muted-foreground">data 없으면 None 반환</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 — AnthropicClient 통합</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">stream_messages() — 3단계 변환 파이프라인</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">HTTP 바이트 스트림</p>
                <p className="text-xs text-muted-foreground"><code>response.bytes_stream()</code> → <code>futures::pin_mut!</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">SSE 이벤트 파싱</p>
                <p className="text-xs text-muted-foreground"><code>str::from_utf8(bytes)</code> → <code>parser.feed(text)</code> → <code>Vec&lt;SseEvent&gt;</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-medium">Chunk 변환 + yield</p>
                <p className="text-xs text-muted-foreground"><code>convert_event_to_chunk(&event)</code> → <code>yield Ok(chunk)</code></p>
                <p className="text-xs text-muted-foreground"><code>async_stream::stream!</code> 매크로로 async generator 구현</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">각 계층이 단일 책임 — 변환과 필터링 분리</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">OpenAI SSE 차이점</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">Anthropic vs OpenAI SSE 비교</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Anthropic</p>
              <div className="space-y-1 text-xs">
                <p><code className="font-mono">event:</code> + <code className="font-mono">data:</code> 쌍</p>
                <p className="text-muted-foreground">event 필드로 타입 구분</p>
                <p className="font-mono text-muted-foreground mt-2">event: content_block_delta</p>
                <p className="font-mono text-muted-foreground">data: {`{"type":"text_delta",...}`}</p>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">OpenAI</p>
              <div className="space-y-1 text-xs">
                <p><code className="font-mono">data:</code>만 사용, event 필드 없음</p>
                <p className="text-muted-foreground">data 내부 JSON으로 타입 구분</p>
                <p className="font-mono text-muted-foreground mt-2">data: {`{"choices":[{"delta":...}]}`}</p>
                <p className="font-mono text-muted-foreground">data: [DONE] ← 종료 sentinel</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 mt-3">
            <p className="text-xs"><code>OpenAICompatClient</code>가 둘 다 처리 — <code>event_type</code>이 <code>None</code>일 때 OpenAI 경로로 분기, <code>[DONE]</code>이면 <code>Chunk::MessageStop</code></p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">에러 처리 — 불완전 프레임</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">flush() — 스트림 종료 시 잔여 버퍼 처리</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">버퍼 비어있으면 None</p>
                <p className="text-xs text-muted-foreground"><code>buffer.is_empty()</code> → 즉시 반환</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">마지막 프레임 강제 파싱</p>
                <p className="text-xs text-muted-foreground"><code>mem::take(&mut buffer)</code> → <code>parse_sse_block</code> — <code>\n\n</code> 없이도 시도</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 mt-3 text-xs text-muted-foreground">
            정상 서버는 항상 <code>\n\n</code>으로 끝냄 — flush는 비정상 상황 대비<br />
            불완전 프레임은 파싱 실패 가능 → <code>None</code> 반환하여 graceful 처리
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">재연결 처리 (Last-Event-ID)</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">SSE 표준 재연결 메커니즘</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">마지막 ID 기록</p>
                <p className="text-xs text-muted-foreground"><code>parser.last_id()</code> → <code>last_event_id.as_deref()</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">재연결 시 헤더 전송</p>
                <p className="text-xs text-muted-foreground"><code>req.header("Last-Event-ID", id)</code> — 서버가 그 이후 이벤트부터 재생</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 mt-3 text-xs">
            <strong className="text-red-700 dark:text-red-300">Anthropic API는 현재 미지원</strong>
            <span className="text-muted-foreground"> — claw-code는 재시작으로 처리</span>
          </div>
        </div>

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
