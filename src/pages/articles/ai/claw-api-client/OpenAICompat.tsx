import FormatConversionViz from './viz/FormatConversionViz';
import ProviderCompatMatrixViz from './viz/ProviderCompatMatrixViz';

export default function OpenAICompat() {
  return (
    <section id="openai-compat" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OpenAI 호환 클라이언트 &amp; 포맷 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FormatConversionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">3개 프로바이더 공유 클라이언트</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            OpenAICompatClient 구조
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">api_key</code><div className="text-xs text-muted-foreground">String</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">base_url</code><div className="text-xs text-muted-foreground">Url</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">http</code><div className="text-xs text-muted-foreground">reqwest::Client</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">model</code><div className="text-xs text-muted-foreground">String</div></div>
            <div className="bg-muted/40 rounded-lg p-2"><code className="text-xs">provider_kind</code><div className="text-xs text-muted-foreground">OpenAIKind</div></div>
          </div>
          <div className="border-t border-border">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
              <div className="bg-card p-3 text-center">
                <div className="text-xs font-semibold">OpenAI</div>
                <div className="text-xs text-muted-foreground mt-1">api.openai.com</div>
              </div>
              <div className="bg-card p-3 text-center">
                <div className="text-xs font-semibold">xAI</div>
                <div className="text-xs text-muted-foreground mt-1">api.x.ai</div>
              </div>
              <div className="bg-card p-3 text-center">
                <div className="text-xs font-semibold">Azure</div>
                <div className="text-xs text-muted-foreground mt-1">{`{resource}`}.openai.azure.com</div>
              </div>
              <div className="bg-card p-3 text-center">
                <div className="text-xs font-semibold">Custom</div>
                <div className="text-xs text-muted-foreground mt-1">Ollama, vLLM, LocalAI</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4종 지원</strong>: OpenAI, xAI, Azure, Custom(자체 호스팅)<br />
          Custom 옵션으로 Ollama/vLLM 같은 로컬 LLM도 claw-code에서 실행 가능<br />
          <code>provider_kind</code>는 프로바이더별 quirk 처리에 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메시지 포맷 변환 — Anthropic → OpenAI</h3>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-card overflow-hidden">
            <div className="bg-violet-100 dark:bg-violet-950/40 px-4 py-2 border-b border-violet-200 dark:border-violet-800 font-semibold text-sm">
              Anthropic 형식
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div><code>role</code>: <code>"assistant"</code></div>
              <div>
                <code>content</code>: <span className="text-muted-foreground">배열</span>
                <div className="mt-1 ml-3 space-y-1">
                  <div className="bg-muted/40 rounded px-2 py-1"><code>{`{type: "text", text: "Let me check."}`}</code></div>
                  <div className="bg-muted/40 rounded px-2 py-1"><code>{`{type: "tool_use", name: "read_file", input: {path: "x.rs"}}`}</code></div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-card overflow-hidden">
            <div className="bg-emerald-100 dark:bg-emerald-950/40 px-4 py-2 border-b border-emerald-200 dark:border-emerald-800 font-semibold text-sm">
              OpenAI 형식
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div><code>content</code>: <code>"Let me check."</code> <span className="text-muted-foreground">문자열</span></div>
              <div>
                <code>tool_calls</code>: <span className="text-muted-foreground">별도 필드</span>
                <div className="mt-1 ml-3">
                  <div className="bg-muted/40 rounded px-2 py-1"><code>{`{type: "function", function: {name: "read_file", arguments: "{\\"path\\":\\"x.rs\\"}"}}`}</code></div>
                </div>
              </div>
              <div className="text-muted-foreground mt-2">arguments는 문자열로 직렬화된 JSON (이중 파싱 필요)</div>
            </div>
          </div>
        </div>
        <p>
          <strong>차이점</strong>: Anthropic은 content 배열에 텍스트+도구 혼재 / OpenAI는 content 문자열 + tool_calls 분리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">변환 함수 — to_openai()</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            ContentBlock 매칭 → OpenAI JSON 변환
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[100px_1fr] p-3 items-start">
              <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-950/40 rounded px-2 py-1 text-center">Text</span>
              <div className="text-xs text-muted-foreground">
                <code>text_parts</code>에 수집 → <code>join("\n")</code>으로 합쳐서 <code>msg["content"]</code>에 문자열로 삽입
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr] p-3 items-start">
              <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-950/40 rounded px-2 py-1 text-center">ToolUse</span>
              <div className="text-xs text-muted-foreground">
                <code>tool_calls</code> 배열에 수집 → <code>{`{type: "function", function: {name, arguments}}`}</code><br />
                <code>input.to_string()</code>으로 JSON을 문자열로 직렬화
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr] p-3 items-start">
              <span className="text-xs font-semibold bg-rose-100 dark:bg-rose-950/40 rounded px-2 py-1 text-center">ToolResult</span>
              <div className="text-xs text-muted-foreground">
                <strong>별도 메시지</strong>로 분리: <code>{`{role: "tool", tool_call_id, content}`}</code><br />
                Anthropic 1개 메시지 = OpenAI 2개 이상 가능
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            Role 매핑: User → "user" / Assistant → "assistant" / System → "system" / Tool → "tool"
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">도구 스키마 변환</h3>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-card overflow-hidden">
            <div className="bg-violet-100 dark:bg-violet-950/40 px-4 py-2 border-b border-violet-200 dark:border-violet-800 font-semibold text-sm">
              Anthropic 도구 포맷
            </div>
            <div className="p-4 space-y-1 text-xs">
              <div><code>name</code>: <code>"read_file"</code></div>
              <div><code>description</code>: <code>"..."</code></div>
              <div><code>input_schema</code>: <span className="text-muted-foreground">JSON Schema</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-card overflow-hidden">
            <div className="bg-emerald-100 dark:bg-emerald-950/40 px-4 py-2 border-b border-emerald-200 dark:border-emerald-800 font-semibold text-sm">
              OpenAI 도구 포맷 (function calling)
            </div>
            <div className="p-4 space-y-1 text-xs">
              <div><code>type</code>: <code>"function"</code> <span className="text-muted-foreground">← 래퍼 추가</span></div>
              <div><code>function.name</code>: <code>"read_file"</code></div>
              <div><code>function.description</code>: <code>"..."</code></div>
              <div><code>function.parameters</code>: <span className="text-muted-foreground">JSON Schema (input_schema 리네이밍)</span></div>
            </div>
          </div>
        </div>
        <p>
          <strong>구조 차이</strong>: OpenAI는 <code>function</code> 래퍼 + <code>parameters</code> 필드명<br />
          JSON Schema 내용은 동일 — Anthropic과 OpenAI 모두 JSON Schema 표준 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 응답 파싱</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            openai_delta_to_chunks — OpenAI SSE → Anthropic Chunk 변환
          </div>
          <div className="p-4">
            <div className="rounded-lg border border-border p-3 mb-3">
              <div className="text-xs font-semibold text-muted-foreground mb-2">OpenAI SSE 프레임 구조</div>
              <div className="space-y-1 text-xs font-mono text-muted-foreground">
                <div className="bg-muted/40 rounded px-2 py-1"><code>data: {`{"choices":[{"delta":{"content":"hi"}}]}`}</code> <span className="text-muted-foreground">← 텍스트</span></div>
                <div className="bg-muted/40 rounded px-2 py-1"><code>data: {`{"choices":[{"delta":{"tool_calls":[...]}}]}`}</code> <span className="text-muted-foreground">← 도구 호출</span></div>
                <div className="bg-muted/40 rounded px-2 py-1"><code>data: [DONE]</code> <span className="text-muted-foreground">← 스트림 종료 sentinel</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold mb-1">content delta 처리</div>
                <p className="text-xs text-muted-foreground">
                  <code>delta.content</code> → <code>Chunk::ContentBlockDelta</code><br />
                  <code>Delta::TextDelta</code>로 래핑, index 0
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold mb-1">tool_calls delta 처리</div>
                <p className="text-xs text-muted-foreground">
                  <code>delta.tool_calls[].function.arguments</code> →<br />
                  <code>Delta::InputJsonDelta</code>로 변환 (가상 content block)
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>OpenAI SSE는 더 단순</strong>: event 필드 없음, data만 존재<br />
          변환 레이어가 <strong>가상 content block</strong> 생성 — Anthropic Chunk과 일관성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Azure OpenAI 특수 처리</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-orange-100 dark:bg-orange-950/40 px-4 py-2 border-b border-border font-semibold text-sm">
            Azure quirk — OpenAI 호환이지만 차이 있음
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            <div className="bg-card p-4">
              <div className="text-xs font-semibold mb-2">인증 헤더</div>
              <div className="space-y-2 text-xs">
                <div className="bg-muted/40 rounded p-2">
                  <span className="font-semibold">Azure:</span> <code>api-key: {`{key}`}</code>
                </div>
                <div className="bg-muted/40 rounded p-2">
                  <span className="font-semibold">기타:</span> <code>Authorization: Bearer {`{key}`}</code>
                </div>
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-xs font-semibold mb-2">URL 파라미터</div>
              <div className="space-y-2 text-xs">
                <div className="bg-muted/40 rounded p-2">
                  <span className="font-semibold">Azure 전용:</span> <code>?api-version=2024-08-01-preview</code>
                </div>
                <div className="bg-muted/40 rounded p-2">
                  <span className="font-semibold">기타:</span> 추가 파라미터 없음
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            <code>provider_kind</code> 분기로 처리 — 기본 경로는 모든 프로바이더 공유
          </div>
        </div>
        <p>
          사용자 관점에서는 차이 없음 — 설정만 바꾸면 작동
        </p>

        <ProviderCompatMatrixViz />
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 포맷 변환의 숨은 비용</p>
          <p>
            Anthropic ↔ OpenAI 변환은 <strong>완전 무손실이 아님</strong> — 위 매트릭스의 부분/미지원 셀이 그 증거
          </p>
          <p className="mt-2">
            claw-code는 <strong>"최대공약수" 기능만 사용</strong> — 프로바이더 전환 시 기본 작동 보장<br />
            고급 기능 필요 시 AnthropicClient 강제 — 사용자가 설정으로 선택<br />
            추상화는 비용이 있지만, 유연성이 더 가치 있다는 판단
          </p>
        </div>

      </div>
    </section>
  );
}
