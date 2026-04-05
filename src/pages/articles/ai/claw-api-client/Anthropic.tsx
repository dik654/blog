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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct AnthropicClient {
    api_key: Option<String>,
    oauth_token: Option<String>,
    base_url: Url,
    http: reqwest::Client,
}

impl AnthropicClient {
    fn auth_header(&self) -> (String, String) {
        if let Some(token) = &self.oauth_token {
            ("Authorization".into(), format!("Bearer {}", token))
        } else if let Some(key) = &self.api_key {
            ("x-api-key".into(), key.clone())
        } else {
            panic!("no authentication configured");
        }
    }
}`}</pre>
        <p>
          <strong>OAuth 우선</strong>: 둘 다 있으면 OAuth 사용 (사용자 의도 추정)<br />
          OAuth 토큰은 Claude.ai 계정 구독 혜택 활용 — API 키 없이도 사용 가능<br />
          <code>x-api-key</code>는 Anthropic 전용 헤더 — OpenAI는 <code>Authorization: Bearer</code> 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">send_message() 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[async_trait]
impl ProviderClient for AnthropicClient {
    async fn send_message(
        &self,
        request: MessageRequest,
    ) -> Result<BoxStream<'static, Result<Chunk>>> {
        // 1) API 요청 바디 조립
        let body = self.to_api_body(&request);

        // 2) HTTP 요청 전송
        let (auth_header, auth_value) = self.auth_header();
        let response = self.http
            .post(self.base_url.join("messages")?)
            .header(auth_header, auth_value)
            .header("anthropic-version", "2023-06-01")
            .header("anthropic-beta", "prompt-caching-2024-07-31")
            .json(&body)
            .send()
            .await?;

        // 3) 에러 체크
        if !response.status().is_success() {
            let err_body = response.text().await?;
            return Err(anyhow!("API error: {}", err_body));
        }

        // 4) SSE 스트림 파싱
        let stream = parse_sse_stream(response.bytes_stream());

        Ok(Box::pin(stream))
    }
}`}</pre>
        <p>
          <strong>3개 필수 헤더</strong>: 인증, anthropic-version, anthropic-beta<br />
          <code>anthropic-version</code>: API 버전 고정 — 하위호환성 보장<br />
          <code>anthropic-beta</code>: 실험 기능 opt-in — prompt caching 활성화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 스트림 파서</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn parse_sse_stream(
    byte_stream: impl Stream<Item = reqwest::Result<Bytes>> + Unpin + Send + 'static,
) -> impl Stream<Item = Result<Chunk>> + Send + 'static {
    let mut buffer = BytesMut::new();

    byte_stream.flat_map(move |bytes_result| {
        let mut chunks = Vec::new();

        if let Ok(bytes) = bytes_result {
            buffer.extend_from_slice(&bytes);

            // 완전한 이벤트 추출 (\\n\\n으로 구분)
            while let Some(pos) = find_double_newline(&buffer) {
                let event_bytes = buffer.split_to(pos + 2);
                let event_str = String::from_utf8_lossy(&event_bytes[..event_bytes.len() - 2]);

                if let Some(chunk) = parse_sse_event(&event_str) {
                    chunks.push(Ok(chunk));
                }
            }
        }

        futures::stream::iter(chunks)
    })
}

fn parse_sse_event(text: &str) -> Option<Chunk> {
    let mut event_name = "";
    let mut data_str = "";
    for line in text.lines() {
        if let Some(rest) = line.strip_prefix("event: ") { event_name = rest; }
        else if let Some(rest) = line.strip_prefix("data: ") { data_str = rest; }
    }
    let data: Value = serde_json::from_str(data_str).ok()?;
    convert_anthropic_event(event_name, data)
}`}</pre>
        <p>
          <strong>SSE 프로토콜</strong>: <code>event: NAME\ndata: JSON\n\n</code> 3줄 한 이벤트<br />
          빈 줄(<code>\n\n</code>)이 이벤트 경계 — 부분 수신 시 버퍼에 유지<br />
          <code>BytesMut</code>: 효율적인 버퍼 — 다수 바이트 덩어리 누적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">프롬프트 캐시 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic prompt caching: 시스템 프롬프트·도구 목록·긴 대화 캐시
fn to_api_body(&self, req: &MessageRequest) -> Value {
    let mut body = json!({...});

    // cache_control 삽입 — system 끝에 캐시 마크
    if let Some(system) = &req.system {
        body["system"] = json!([{
            "type": "text",
            "text": system,
            "cache_control": {"type": "ephemeral"}  // 5분 캐시
        }]);
    }

    // 도구 목록 캐시
    if let Some(tools) = &req.tools {
        let mut tools_json = convert_tools(tools);
        if let Some(last) = tools_json.as_array_mut().unwrap().last_mut() {
            last["cache_control"] = json!({"type": "ephemeral"});
        }
        body["tools"] = tools_json;
    }

    body
}`}</pre>
        <p>
          <strong>프롬프트 캐시 단가</strong>: 생성 1.25×, 적중 0.1× — 평균 70% 비용 절감<br />
          <code>cache_control: ephemeral</code>: 5분 TTL — 연속 호출에서 재사용<br />
          system 프롬프트는 항상 캐시, tools는 마지막 도구에 마크 (전체 배열 캐시)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 카운트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl ProviderClient for AnthropicClient {
    fn count_tokens(&self, text: &str) -> usize {
        // Claude tokenizer는 공식 공개 안 됨
        // 근사: 문자 수 / 4 (영어 기준)
        // 더 정확: tiktoken-rs (GPT용, 유사)
        text.len() / 4
    }
}

// 정확한 토큰 카운트가 필요하면 Anthropic의 tokenization API 호출
async fn count_tokens_exact(&self, text: &str) -> Result<usize> {
    let resp = self.http
        .post(self.base_url.join("messages/count_tokens")?)
        .json(&json!({
            "model": self.model,
            "messages": [{"role": "user", "content": text}]
        }))
        .send()
        .await?
        .json::<Value>()
        .await?;
    Ok(resp["input_tokens"].as_u64().unwrap() as usize)
}`}</pre>
        <p>
          <strong>근사 카운트</strong>: <code>len() / 4</code> — 대부분 경우 충분<br />
          정확한 카운트 필요 시 <code>/messages/count_tokens</code> API 호출<br />
          정확 카운트는 네트워크 비용 — 컴팩션 판정엔 근사로 충분
        </p>

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
