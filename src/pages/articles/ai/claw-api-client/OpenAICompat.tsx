import FormatConversionViz from './viz/FormatConversionViz';
import ProviderCompatMatrixViz from './viz/ProviderCompatMatrixViz';

export default function OpenAICompat() {
  return (
    <section id="openai-compat" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OpenAI 호환 클라이언트 &amp; 포맷 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FormatConversionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">3개 프로바이더 공유 클라이언트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum OpenAIKind {
    OpenAI,   // api.openai.com
    XAI,      // api.x.ai
    Azure,    // {resource}.openai.azure.com
    Custom,   // 자체 호스팅 (Ollama, vLLM, LocalAI)
}

pub struct OpenAICompatClient {
    api_key: String,
    base_url: Url,
    http: reqwest::Client,
    model: String,
    provider_kind: OpenAIKind,
}`}</pre>
        <p>
          <strong>4종 지원</strong>: OpenAI, xAI, Azure, Custom(자체 호스팅)<br />
          Custom 옵션으로 Ollama/vLLM 같은 로컬 LLM도 claw-code에서 실행 가능<br />
          <code>provider_kind</code>는 프로바이더별 quirk 처리에 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메시지 포맷 변환 — Anthropic → OpenAI</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic 형식
{
  "role": "assistant",
  "content": [
    {"type": "text", "text": "Let me check."},
    {"type": "tool_use", "id": "toolu_1", "name": "read_file",
     "input": {"path": "x.rs"}}
  ]
}

// OpenAI 형식으로 변환
{
  "role": "assistant",
  "content": "Let me check.",
  "tool_calls": [{
    "id": "toolu_1",
    "type": "function",
    "function": {
      "name": "read_file",
      "arguments": "{\\"path\\":\\"x.rs\\"}"
    }
  }]
}`}</pre>
        <p>
          <strong>차이점</strong>:<br />
          - Anthropic: content가 배열 (텍스트 + 도구 호출 혼재)<br />
          - OpenAI: content는 문자열, tool_calls 별도 필드<br />
          - OpenAI arguments는 <strong>문자열로 직렬화된 JSON</strong> (이중 파싱 필요)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">변환 함수</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Message {
    pub fn to_openai(&self) -> Value {
        let role_str = match self.role {
            Role::User => "user",
            Role::Assistant => "assistant",
            Role::System => "system",
            Role::Tool => "tool",
        };

        let mut msg = json!({"role": role_str});
        let mut text_parts = Vec::new();
        let mut tool_calls = Vec::new();
        let mut tool_results = Vec::new();

        for block in &self.content {
            match block {
                ContentBlock::Text(t) => text_parts.push(t.clone()),
                ContentBlock::ToolUse { id, name, input } => {
                    tool_calls.push(json!({
                        "id": id, "type": "function",
                        "function": {
                            "name": name,
                            "arguments": input.to_string(),  // JSON string
                        }
                    }));
                }
                ContentBlock::ToolResult { tool_use_id, output, is_error } => {
                    // OpenAI는 tool_result를 별도 role:tool 메시지로 분리
                    tool_results.push(json!({
                        "role": "tool",
                        "tool_call_id": tool_use_id,
                        "content": output,
                    }));
                }
                _ => {}
            }
        }

        if !text_parts.is_empty() {
            msg["content"] = text_parts.join("\\n").into();
        }
        if !tool_calls.is_empty() {
            msg["tool_calls"] = tool_calls.into();
        }

        msg
    }
}`}</pre>
        <p>
          <strong>주의사항</strong>: OpenAI는 <code>tool_result</code>를 별도 메시지로 분리<br />
          Anthropic은 user 메시지 내에 tool_result 포함 — 변환 시 펼쳐야 함<br />
          결과: Anthropic 메시지 1개 = OpenAI 메시지 2개(이상) 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">도구 스키마 변환</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic tool format
{"name": "read_file", "description": "...", "input_schema": {...}}

// OpenAI tool format (function calling)
{
  "type": "function",
  "function": {
    "name": "read_file",
    "description": "...",
    "parameters": {...}   // input_schema → parameters
  }
}

fn convert_tools_openai(tools: &[ToolSpec]) -> Value {
    tools.iter().map(|t| json!({
        "type": "function",
        "function": {
            "name": t.name,
            "description": t.description,
            "parameters": t.input_schema.clone(),
        }
    })).collect::<Vec<_>>().into()
}`}</pre>
        <p>
          <strong>구조 차이</strong>: OpenAI는 <code>function</code> 래퍼 + <code>parameters</code> 필드명<br />
          Anthropic의 <code>input_schema</code>가 <code>parameters</code>로 단순 리네이밍<br />
          JSON Schema 내용은 동일 — Anthropic과 OpenAI 모두 JSON Schema 표준 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 응답 파싱</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// OpenAI SSE 프레임
data: {"id":"chatcmpl-...","choices":[{"delta":{"content":"hi"},"index":0}]}
data: {"id":"chatcmpl-...","choices":[{"delta":{"tool_calls":[{"index":0,"id":"call_1","function":{"name":"read_file"}}]}}]}
data: {"id":"chatcmpl-...","choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"{\\"path\\":\\"x.rs\\"}"}}]}}]}
data: [DONE]

// Anthropic Chunk로 변환
fn openai_delta_to_chunks(delta: &Value, block_idx: &mut usize) -> Vec<Chunk> {
    let mut out = Vec::new();

    if let Some(content) = delta.get("content").and_then(|v| v.as_str()) {
        out.push(Chunk::ContentBlockDelta {
            index: 0,
            delta: Delta::TextDelta { text: content.into() },
        });
    }

    if let Some(tool_calls) = delta.get("tool_calls").and_then(|v| v.as_array()) {
        for tc in tool_calls {
            // 각 tool_call의 arguments를 input_json_delta로 변환
            if let Some(args) = tc.get("function").and_then(|f| f.get("arguments")) {
                out.push(Chunk::ContentBlockDelta {
                    index: *block_idx,
                    delta: Delta::InputJsonDelta {
                        partial_json: args.as_str().unwrap_or("").into(),
                    },
                });
            }
        }
    }

    out
}`}</pre>
        <p>
          <strong>OpenAI SSE는 더 단순</strong>: event 필드 없음, data만 존재<br />
          <code>[DONE]</code> sentinel로 스트림 종료 표시<br />
          변환 레이어가 <strong>가상 content block</strong> 생성 — 일관성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Azure OpenAI 특수 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Azure는 api-key 헤더 사용 (Authorization Bearer 아님)
// 그리고 api-version 쿼리 파라미터 필수

impl OpenAICompatClient {
    fn request_url(&self, endpoint: &str) -> Url {
        let mut url = self.base_url.join(endpoint).unwrap();

        if self.provider_kind == OpenAIKind::Azure {
            url.query_pairs_mut()
                .append_pair("api-version", "2024-08-01-preview");
        }

        url
    }

    fn auth_header(&self) -> (String, String) {
        match self.provider_kind {
            OpenAIKind::Azure => ("api-key".into(), self.api_key.clone()),
            _ => ("Authorization".into(), format!("Bearer {}", self.api_key)),
        }
    }
}`}</pre>
        <p>
          Azure는 <strong>OpenAI 호환이지만 quirk 있음</strong>: 헤더·버전 파라미터 다름<br />
          <code>provider_kind</code> 분기로 처리 — 기본 경로는 모든 프로바이더 공유<br />
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
