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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[async_trait]
pub trait ProviderClient: Send + Sync {
    // 메시지 전송 (스트리밍)
    async fn send_message(
        &self,
        request: MessageRequest,
    ) -> Result<BoxStream<'static, Result<Chunk>>>;

    // 토큰 카운트
    fn count_tokens(&self, text: &str) -> usize;

    // 모델 정보
    fn model_info(&self) -> ModelInfo;

    // 동기 비용 계산
    fn estimate_cost(&self, usage: &TokenUsage) -> f64;
}

pub struct ModelInfo {
    pub name: String,
    pub context_window: usize,    // 200_000
    pub max_output: usize,        // 8_192
    pub supports_vision: bool,
    pub pricing: Pricing,
}`}</pre>
        <p>
          <strong>4개 핵심 메서드</strong>: send_message, count_tokens, model_info, estimate_cost<br />
          <code>BoxStream</code>: 비동기 스트림 — 각 청크가 SSE 프레임 하나<br />
          <code>Send + Sync</code>: 멀티스레드 안전 — Arc로 공유
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현체 2개</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 1. AnthropicClient — Anthropic Messages API 전용
pub struct AnthropicClient {
    api_key: Option<String>,
    oauth_token: Option<String>,
    base_url: Url,
    http: reqwest::Client,
    model: String,
}

// 2. OpenAICompatClient — OpenAI 호환 API 공용
pub struct OpenAICompatClient {
    api_key: String,
    base_url: Url,              // OpenAI: https://api.openai.com/v1
                                // xAI:    https://api.x.ai/v1
                                // Azure:  https://{resource}.openai.azure.com/...
    http: reqwest::Client,
    model: String,
    provider_kind: OpenAIKind,  // OpenAI | Azure | xAI
}`}</pre>
        <p>
          <strong>2개만 구현</strong>: Anthropic vs OpenAI 호환<br />
          xAI, Azure, 자체 호스팅 LLM 모두 OpenAICompatClient 재사용<br />
          base_url만 바꾸면 다른 프로바이더 — 확장 비용 최소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MessageRequest 통합 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct MessageRequest {
    pub model: String,
    pub messages: Vec<Message>,
    pub system: Option<String>,
    pub tools: Option<Vec<ToolSpec>>,
    pub max_tokens: usize,
    pub temperature: Option<f32>,
    pub stream: bool,
}

// 프로바이더별 변환
impl AnthropicClient {
    fn to_api_body(&self, req: &MessageRequest) -> serde_json::Value {
        json!({
            "model": req.model,
            "messages": req.messages.iter().map(|m| m.to_anthropic()).collect::<Vec<_>>(),
            "system": req.system,
            "tools": req.tools.as_ref().map(convert_tools),
            "max_tokens": req.max_tokens,
            "temperature": req.temperature,
            "stream": true,
        })
    }
}

impl OpenAICompatClient {
    fn to_api_body(&self, req: &MessageRequest) -> serde_json::Value {
        // system은 messages 배열의 첫 요소로 이동
        let mut all_msgs = vec![];
        if let Some(sys) = &req.system {
            all_msgs.push(json!({"role": "system", "content": sys}));
        }
        all_msgs.extend(req.messages.iter().map(|m| m.to_openai()));

        json!({
            "model": req.model,
            "messages": all_msgs,
            "tools": req.tools.as_ref().map(convert_tools_openai),
            "max_tokens": req.max_tokens,
            "temperature": req.temperature,
            "stream": true,
        })
    }
}`}</pre>
        <p>
          <strong>내부 표현은 Anthropic 스타일</strong>: system 필드 분리<br />
          OpenAI로 변환 시 system을 messages 배열 첫 요소로 이동<br />
          포맷 차이를 <strong>클라이언트 내부에서만 처리</strong> — 호출자는 neutral 포맷 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스트리밍 차이 흡수</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic SSE: event: content_block_delta · data: {"type":"text_delta","text":"hello"}
// OpenAI SSE:    data: {"choices":[{"delta":{"content":"hello"}}]}
// 두 포맷 모두 아래 Chunk enum으로 통합`}</pre>
        <ChunkEnumViz />
        <p>
          <strong>Chunk enum은 Anthropic SSE 구조를 따름</strong> — OpenAI는 클라이언트가 변환<br />
          OpenAI는 단일 delta 스트림 — Anthropic의 block 개념 없음<br />
          변환 레이어가 "가상 block" 만들어서 일관성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">클라이언트 선택 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// config에서 provider 문자열 읽어 생성
pub fn create_client(config: &AppConfig) -> Result<Box<dyn ProviderClient>> {
    match config.provider.as_str() {
        "anthropic" => Ok(Box::new(AnthropicClient::new(
            config.api_key.clone(),
            config.model.clone(),
        )?)),

        "openai" => Ok(Box::new(OpenAICompatClient::new(
            config.api_key.clone().ok_or(anyhow!("API key required"))?,
            "https://api.openai.com/v1".parse()?,
            config.model.clone(),
            OpenAIKind::OpenAI,
        )?)),

        "xai" => Ok(Box::new(OpenAICompatClient::new(
            config.api_key.clone().unwrap(),
            "https://api.x.ai/v1".parse()?,
            config.model.clone(),
            OpenAIKind::XAI,
        )?)),

        "azure" => Ok(Box::new(OpenAICompatClient::new(
            config.api_key.clone().unwrap(),
            format!("https://{}.openai.azure.com/openai/deployments/{}",
                config.azure_resource.as_ref().unwrap(),
                config.azure_deployment.as_ref().unwrap()).parse()?,
            config.model.clone(),
            OpenAIKind::Azure,
        )?)),

        _ => Err(anyhow!("unknown provider: {}", config.provider)),
    }
}`}</pre>
        <p>
          <strong>4개 프로바이더 팩토리</strong>: anthropic, openai, xai, azure<br />
          Azure는 base_url이 복잡 — resource + deployment 조합<br />
          <code>Box&lt;dyn ProviderClient&gt;</code> 반환 — 트레이트 객체로 동적 디스패치
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
