import AnthropicSseViz from './viz/AnthropicSseViz';

export default function Anthropic() {
  return (
    <section id="anthropic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AnthropicClient — OAuth &amp; 스트리밍</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <AnthropicSseViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">인증 방식 2가지</h3>
        <p>
          AnthropicClient는 두 가지 인증 방식 지원:<br />
          1. <strong>API Key</strong>: <code>ANTHROPIC_API_KEY</code> 환경 변수<br />
          2. <strong>OAuth Bearer Token</strong>: Claude.ai 계정 기반 인증 (Pro/Team 사용자)
        </p>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            AnthropicClient 필드 + 인증 우선순위
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">api_key</code><div className="text-xs text-muted-foreground">Option&lt;String&gt;</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">oauth_token</code><div className="text-xs text-muted-foreground">Option&lt;String&gt;</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">base_url</code><div className="text-xs text-muted-foreground">Url</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">http</code><div className="text-xs text-muted-foreground">reqwest::Client</div></div>
          </div>
          <div className="border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
              <div className="bg-card p-4">
                <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">1순위: OAuth Bearer</div>
                <p className="text-xs text-muted-foreground">
                  헤더 <code>Authorization: Bearer {`{token}`}</code><br />
                  Claude.ai 계정 구독 혜택 활용
                </p>
              </div>
              <div className="bg-card p-4">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">2순위: API Key</div>
                <p className="text-xs text-muted-foreground">
                  헤더 <code>x-api-key: {`{key}`}</code><br />
                  Anthropic 전용 헤더 (OpenAI와 다름)
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>OAuth 우선</strong>: 둘 다 있으면 OAuth 사용 (사용자 의도 추정)<br />
          OAuth 토큰은 Claude.ai 계정 구독 혜택 활용 — API 키 없이도 사용 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">send_message() 구현</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            send_message 4단계 흐름
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[40px_1fr] p-3 items-start">
              <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/40 rounded-full w-6 h-6 flex items-center justify-center">1</span>
              <div>
                <div className="text-sm font-semibold">API 요청 바디 조립</div>
                <p className="text-xs text-muted-foreground mt-1"><code>to_api_body(&request)</code> — MessageRequest를 Anthropic JSON으로 변환</p>
              </div>
            </div>
            <div className="grid grid-cols-[40px_1fr] p-3 items-start">
              <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/40 rounded-full w-6 h-6 flex items-center justify-center">2</span>
              <div>
                <div className="text-sm font-semibold">HTTP POST 전송</div>
                <p className="text-xs text-muted-foreground mt-1">
                  엔드포인트 <code>/messages</code> + 3개 필수 헤더
                </p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-muted/40 rounded p-2 text-xs"><code>auth_header</code><br /><span className="text-muted-foreground">인증 (OAuth/API Key)</span></div>
                  <div className="bg-muted/40 rounded p-2 text-xs"><code>anthropic-version</code><br /><span className="text-muted-foreground">2023-06-01 고정</span></div>
                  <div className="bg-muted/40 rounded p-2 text-xs"><code>anthropic-beta</code><br /><span className="text-muted-foreground">prompt-caching opt-in</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[40px_1fr] p-3 items-start">
              <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/40 rounded-full w-6 h-6 flex items-center justify-center">3</span>
              <div>
                <div className="text-sm font-semibold">에러 체크</div>
                <p className="text-xs text-muted-foreground mt-1">비성공 상태 시 응답 본문을 에러 메시지로 반환</p>
              </div>
            </div>
            <div className="grid grid-cols-[40px_1fr] p-3 items-start">
              <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/40 rounded-full w-6 h-6 flex items-center justify-center">4</span>
              <div>
                <div className="text-sm font-semibold">SSE 스트림 파싱</div>
                <p className="text-xs text-muted-foreground mt-1"><code>parse_sse_stream(response.bytes_stream())</code> → <code>Box::pin(stream)</code> 반환</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 스트림 파서</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            parse_sse_stream — 바이트 → Chunk 변환
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs font-semibold text-muted-foreground mb-2">SSE 프로토콜 구조</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-muted/40 rounded p-2"><code>event: NAME</code></div>
                <div className="bg-muted/40 rounded p-2"><code>data: JSON</code></div>
                <div className="bg-muted/40 rounded p-2"><code>\n\n</code> <span className="text-muted-foreground">(경계)</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold mb-1">parse_sse_stream</div>
                <p className="text-xs text-muted-foreground">
                  <code>BytesMut</code> 버퍼에 바이트 누적 → <code>\n\n</code> 발견 시 이벤트 추출<br />
                  부분 수신 시 버퍼에 유지 — <code>flat_map</code>으로 다수 청크 생성
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold mb-1">parse_sse_event</div>
                <p className="text-xs text-muted-foreground">
                  <code>event:</code> 라인에서 이벤트명, <code>data:</code> 라인에서 JSON 추출<br />
                  <code>convert_anthropic_event(name, data)</code>로 Chunk 변환
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">프롬프트 캐시 통합</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-amber-100 dark:bg-amber-950/40 px-4 py-2 border-b border-border font-semibold text-sm">
            to_api_body — cache_control 삽입 지점
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[120px_1fr] p-3 items-start">
              <span className="text-xs font-semibold">system 프롬프트</span>
              <div className="text-xs text-muted-foreground">
                <code>{`cache_control: {"type": "ephemeral"}`}</code> 부착 — 항상 캐시<br />
                system을 배열 형식으로 감싸서 마지막 블록에 마크
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] p-3 items-start">
              <span className="text-xs font-semibold">도구 목록</span>
              <div className="text-xs text-muted-foreground">
                마지막 도구 항목에 <code>cache_control</code> 마크 → 전체 배열 캐시<br />
                <code>tools_json.last_mut()</code>에 삽입
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            비용: 생성 1.25x / 적중 0.1x / TTL 5분 — 평균 70% 절감
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 카운트</h3>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
              근사 카운트 (동기)
            </div>
            <div className="p-4">
              <code className="text-sm">text.len() / 4</code>
              <p className="text-xs text-muted-foreground mt-2">
                Claude tokenizer 비공개 — 영어 기준 문자/4 근사<br />
                네트워크 비용 없음 — 컴팩션 판정에 충분
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
              정확 카운트 (비동기 API)
            </div>
            <div className="p-4">
              <code className="text-sm">/messages/count_tokens</code>
              <p className="text-xs text-muted-foreground mt-2">
                모델명 + 메시지 전송 → <code>input_tokens</code> 반환<br />
                네트워크 왕복 필요 — 정밀 계산 시에만 사용
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: prompt caching의 실제 효과</p>
          <p>
            시스템 프롬프트 20K 토큰 + 도구 목록 5K 토큰 = 25K 토큰을 5분간 캐시<br />
            연속 10턴 대화 가정:
          </p>
          <p className="mt-2">
            <strong>캐시 없이</strong>:<br />
            25K × 10 = 250K input 토큰 × $3/M = $0.75
          </p>
          <p className="mt-2">
            <strong>캐시 사용</strong>:<br />
            1턴: 25K × 1.25 = 31.25K (생성 비용)<br />
            2~10턴: 25K × 0.1 × 9 = 22.5K (적중 비용)<br />
            합계: 53.75K × $3/M = $0.16
          </p>
          <p className="mt-2">
            <strong>79% 절감</strong> — 실제 측정값과 일치<br />
            긴 시스템 프롬프트를 가진 에이전트에 특히 효과적<br />
            claw-code는 기본 활성화 — 사용자는 비활성화할 수 있지만 거의 없음
          </p>
        </div>

      </div>
    </section>
  );
}
