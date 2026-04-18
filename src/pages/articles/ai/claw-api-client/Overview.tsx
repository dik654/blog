import ProviderViz from './viz/ProviderViz';
import ChunkEnumViz from './viz/ChunkEnumViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProviderClient 추상화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ProviderViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">멀티 프로바이더 지원 배경</h3>
        <p>
          claw-code는 3개 LLM 프로바이더 지원:<br />
          - <strong>Anthropic</strong>: Claude 모델 (기본)<br />
          - <strong>OpenAI</strong>: GPT 모델<br />
          - <strong>xAI</strong>: Grok 모델 (OpenAI 호환)<br />
          사용자는 설정으로 프로바이더 전환 — 같은 코드베이스에서 여러 모델 실험
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ProviderClient 트레이트</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            ProviderClient — 4개 핵심 메서드
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            <div className="bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-1">스트리밍 전송</div>
              <code className="text-sm">send_message(&self, req) → BoxStream&lt;Chunk&gt;</code>
              <p className="text-xs text-muted-foreground mt-1">비동기 스트림 반환 — 각 청크가 SSE 프레임 하나</p>
            </div>
            <div className="bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-1">토큰 카운트</div>
              <code className="text-sm">count_tokens(&self, text) → usize</code>
              <p className="text-xs text-muted-foreground mt-1">입력 텍스트의 토큰 수 근사 계산</p>
            </div>
            <div className="bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-1">모델 정보</div>
              <code className="text-sm">model_info(&self) → ModelInfo</code>
              <p className="text-xs text-muted-foreground mt-1">context_window, max_output, supports_vision, pricing</p>
            </div>
            <div className="bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-1">비용 계산</div>
              <code className="text-sm">estimate_cost(&self, usage) → f64</code>
              <p className="text-xs text-muted-foreground mt-1">TokenUsage 기반 동기 비용 계산</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            트레이트 바운드 <code>Send + Sync</code> — 멀티스레드 안전, Arc로 공유 가능
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현체 2개</h3>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-violet-100 dark:bg-violet-950/40 px-4 py-2 border-b border-border font-semibold text-sm">
              AnthropicClient — Messages API 전용
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div><code className="text-xs">api_key: Option&lt;String&gt;</code> <span className="text-muted-foreground text-xs">— API 키 인증</span></div>
              <div><code className="text-xs">oauth_token: Option&lt;String&gt;</code> <span className="text-muted-foreground text-xs">— OAuth Bearer 인증</span></div>
              <div><code className="text-xs">base_url: Url</code> <span className="text-muted-foreground text-xs">— api.anthropic.com</span></div>
              <div><code className="text-xs">http: reqwest::Client</code></div>
              <div><code className="text-xs">model: String</code></div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-emerald-100 dark:bg-emerald-950/40 px-4 py-2 border-b border-border font-semibold text-sm">
              OpenAICompatClient — 호환 API 공용
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div><code className="text-xs">api_key: String</code></div>
              <div><code className="text-xs">base_url: Url</code> <span className="text-muted-foreground text-xs">— OpenAI / xAI / Azure URL</span></div>
              <div><code className="text-xs">http: reqwest::Client</code></div>
              <div><code className="text-xs">model: String</code></div>
              <div><code className="text-xs">provider_kind: OpenAIKind</code> <span className="text-muted-foreground text-xs">— OpenAI | Azure | xAI</span></div>
            </div>
          </div>
        </div>
        <p>
          <strong>2개만 구현</strong>: Anthropic vs OpenAI 호환<br />
          xAI, Azure, 자체 호스팅 LLM 모두 OpenAICompatClient 재사용<br />
          <code>base_url</code>만 바꾸면 다른 프로바이더 — 확장 비용 최소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MessageRequest 통합 구조</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            MessageRequest — 프로바이더 중립 요청 구조
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">model</code><div className="text-xs text-muted-foreground">String</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">messages</code><div className="text-xs text-muted-foreground">Vec&lt;Message&gt;</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">system</code><div className="text-xs text-muted-foreground">Option&lt;String&gt;</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">tools</code><div className="text-xs text-muted-foreground">Option&lt;Vec&lt;ToolSpec&gt;&gt;</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">max_tokens</code><div className="text-xs text-muted-foreground">usize</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">temperature</code><div className="text-xs text-muted-foreground">Option&lt;f32&gt;</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">stream</code><div className="text-xs text-muted-foreground">bool</div></div>
          </div>
          <div className="border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
              <div className="bg-card p-4">
                <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">Anthropic 변환</div>
                <p className="text-xs text-muted-foreground">
                  <code>system</code> 필드를 별도 최상위 키로 전달<br />
                  <code>to_anthropic()</code>로 메시지 직렬화
                </p>
              </div>
              <div className="bg-card p-4">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">OpenAI 변환</div>
                <p className="text-xs text-muted-foreground">
                  <code>system</code>을 messages 배열 첫 요소로 이동<br />
                  <code>to_openai()</code>로 메시지 직렬화
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>내부 표현은 Anthropic 스타일</strong>: system 필드 분리<br />
          OpenAI로 변환 시 system을 messages 배열 첫 요소로 이동<br />
          포맷 차이를 <strong>클라이언트 내부에서만 처리</strong> — 호출자는 neutral 포맷 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스트리밍 차이 흡수</h3>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Anthropic SSE</div>
            <div className="text-xs font-mono text-muted-foreground space-y-1">
              <div><code>event: content_block_delta</code></div>
              <div><code>data: {`{"type":"text_delta","text":"hello"}`}</code></div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">OpenAI SSE</div>
            <div className="text-xs font-mono text-muted-foreground">
              <code>data: {`{"choices":[{"delta":{"content":"hello"}}]}`}</code>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">두 포맷 모두 아래 Chunk enum으로 통합</p>
        <ChunkEnumViz />
        <p>
          <strong>Chunk enum은 Anthropic SSE 구조를 따름</strong> — OpenAI는 클라이언트가 변환<br />
          OpenAI는 단일 delta 스트림 — Anthropic의 block 개념 없음<br />
          변환 레이어가 "가상 block" 만들어서 일관성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">클라이언트 선택 흐름</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            create_client(config) → Box&lt;dyn ProviderClient&gt;
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 items-center">
              <span className="text-xs font-semibold bg-violet-100 dark:bg-violet-950/40 rounded px-2 py-1 text-center">"anthropic"</span>
              <div className="text-sm">
                <code className="text-xs">AnthropicClient::new(api_key, model)</code>
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 items-center">
              <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 rounded px-2 py-1 text-center">"openai"</span>
              <div className="text-sm">
                <code className="text-xs">OpenAICompatClient::new(key, "api.openai.com/v1", model, OpenAI)</code>
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 items-center">
              <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-950/40 rounded px-2 py-1 text-center">"xai"</span>
              <div className="text-sm">
                <code className="text-xs">OpenAICompatClient::new(key, "api.x.ai/v1", model, XAI)</code>
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 items-center">
              <span className="text-xs font-semibold bg-orange-100 dark:bg-orange-950/40 rounded px-2 py-1 text-center">"azure"</span>
              <div className="text-sm">
                <code className="text-xs">OpenAICompatClient::new(key, "{`{resource}.openai.azure.com/...`}", model, Azure)</code>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            반환: <code>Box&lt;dyn ProviderClient&gt;</code> — 트레이트 객체로 동적 디스패치
          </div>
        </div>
        <p>
          <strong>4개 프로바이더 팩토리</strong>: anthropic, openai, xai, azure<br />
          Azure는 base_url이 복잡 — resource + deployment 조합
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 추상화의 경제성</p>
          <p>
            4개 프로바이더 지원에 <strong>2개 클라이언트 구현</strong> — OpenAI 호환 덕분<br />
            만약 각 프로바이더마다 별도 구현:<br />
            - 4배 코드<br />
            - 4배 테스트<br />
            - 4배 유지보수 비용
          </p>
          <p className="mt-2">
            OpenAI가 사실상 표준 API 형식 — xAI, Groq, 많은 오픈소스 모델이 따름<br />
            <strong>"OpenAI 호환"이 LLM API 생태계의 HTTP 1.1</strong> — 사실상 프로토콜<br />
            claw-code는 이 사실상 표준을 활용하여 최소 코드로 최대 호환성 달성
          </p>
          <p className="mt-2">
            트레이드오프: Anthropic 전용 기능(prompt caching, computer use) 사용 시 Anthropic 전용 경로 필요<br />
            하지만 이는 <strong>OpenAICompatClient 확장 없이 AnthropicClient에만 추가</strong> — 격리 유지
          </p>
        </div>

      </div>
    </section>
  );
}
