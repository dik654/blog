import ProviderContractViz from './viz/ProviderContractViz';

const streamEvents = [
  ['01', 'MessageStart', '응답 id·model·초기 usage가 생긴다.'],
  ['02', 'ContentBlockStart', 'text 또는 tool-use block의 index와 초기 상태를 연다.'],
  ['03', 'ContentBlockDelta', 'text·JSON·thinking·signature 조각을 열린 block에 붙인다.'],
  ['04', 'ContentBlockStop', '해당 index의 block 조립을 닫는다.'],
  ['05', 'MessageDelta', 'stop reason과 누적 usage 같은 message 수준 변경을 보낸다.'],
  ['06', 'MessageStop', '한 응답 stream의 종료를 알린다.'],
] as const;

const cacheRules = [
  ['로컬 completion 재사용', '같은 전체 request hash의 비스트리밍 응답을 기본 30초 동안 파일에서 다시 읽는다.'],
  ['fingerprint 관측', 'model·system·tools·messages hash와 cache_read_input_tokens를 session state에 기록한다.'],
  ['의미 있는 감소', '이전보다 cache read token이 2,000 이상 줄었을 때만 cache break 후보가 된다.'],
  ['예상된 변경', 'fingerprint가 달라졌다면 model·system·tools·messages 중 변한 이유를 남긴다.'],
  ['TTL 가능성', 'fingerprint가 같아도 5분이 넘었다면 prompt cache TTL 만료 가능성으로 분류한다.'],
  ['예상 밖 break', 'fingerprint가 같고 5분 이내인데 2,000 이상 줄면 unexpected로 센다.'],
] as const;

const completionRules = [
  ['Provider EOF', 'OpenAI-compatible parser는 열린 block을 닫고, message가 시작됐다면 기본 end_turn·usage 0을 포함한 MessageDelta와 MessageStop을 합성한다.'],
  ['CLI 보정', 'provider가 stop을 주지 않았어도 text 또는 ToolUse가 하나라도 있으면 CLI adapter가 AssistantEvent::MessageStop을 추가한다.'],
  ['빈 stream fallback', 'stop도 content도 없으면 같은 요청을 non-streaming으로 다시 보낸다. 첫 요청이 과금됐는지는 이 코드가 증명하지 못하므로 중복 비용 가능성을 관측해야 한다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>같은 질문을 보내도 서비스마다 길이 다르다</h2>
          <p>
            runtime은 먼저 model alias를 canonical name으로 바꾸고 metadata로
            <code> ProviderKind</code>를 찾는다. top-level <code>ProviderClient</code>는 이 결과를
            <code> Anthropic</code>, <code>Xai</code>, <code>OpenAi</code> 중 하나로 보관하고,
            <code>send_message()</code>와 <code>stream_message()</code>에서 enum match로 concrete
            client에 위임한다.
          </p>
          <p>
            여기서 <code>OpenAi</code>는 회사 이름만 뜻하지 않는다. Qwen과 Kimi는 Alibaba
            DashScope가 제공하는 OpenAI-compatible wire를 쓰기 때문에 같은 variant로 들어간다.
            그러나 metadata의 <code>auth_env</code>를 다시 확인해 OpenAI config 대신 DashScope
            config를 고른다. 아래 모델을 바꾸며 세 분류가 어떻게 갈라지는지 확인하라.
          </p>
        </div>
        <ProviderContractViz />
      </section>

      <section id="provider-routing" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>회사, wire protocol, enum variant는 같은 축이 아니다</h2>
          <p>
            xAI·OpenAI·DashScope는 같은 <code>OpenAiCompatClient</code> 코드를 재사용하지만 config는
            각각 API key 환경 변수, base URL, 요청 body 상한을 바꾼다. 상한은 xAI 50 MiB,
            OpenAI 100 MiB, DashScope 6 MiB다. 따라서 “OpenAI 호환이면 URL만 바꾸면 끝”이 아니라,
            endpoint가 받아들이는 크기와 model별 예외까지 config와 변환 함수가 흡수한다.
          </p>
          <p>
            이름을 모르는 custom model은 더 조심해야 한다. model metadata가 없으면
            <code>detect_provider_kind()</code>는 환경을 sniff한다. 우선순위는
            <strong> OPENAI_BASE_URL+OpenAI key → Anthropic auth → OpenAI key → XAI key →
            OPENAI_BASE_URL만 존재 → Anthropic 기본값</strong>이다. 같은 model 문자열도 실행
            환경에 따라 다른 provider kind로 갈 수 있다. 마지막 두 fallback은 kind 선택일 뿐이며,
            concrete client 생성에 필요한 credential이 없으면 그 다음 단계에서 실패한다.
          </p>
          <p>
            Anthropic 인증도 API key와 OAuth 중 하나를 우선 선택하지 않는다.
            <code>AuthSource::ApiKeyAndBearer</code>면 request에 <code>x-api-key</code>와
            <code>Authorization: Bearer</code>를 모두 붙인다. 저장된 OAuth를 읽는 startup helper는
            별도로 있지만 <code>AuthSource::from_env_or_saved()</code> 이름만 보고 자동 파일 로드를
            가정해서는 안 된다. 이 revision의 해당 함수는 환경 변수 경로만 사용한다.
          </p>
          <h3>API key와 base URL은 같은 방식으로 .env를 읽지 않는다</h3>
          <p>
            Anthropic·OpenAI-compatible API key helper는 process environment가 비었을 때 현재
            디렉터리의 <code>.env</code> 값을 보조로 읽는다. 반면
            <code>ANTHROPIC_BASE_URL</code>·<code>OPENAI_BASE_URL</code> 같은 endpoint override는
            process environment만 읽고 없으면 built-in URL로 돌아간다. “.env를 지원한다”는 한
            문장으로 key와 URL을 함께 설명하면 실제 배포 결과가 달라질 수 있다.
          </p>
        </div>
      </section>

      <section id="wire-normalization" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>공통 메시지가 provider의 문법으로 번역된다</h2>
          <p>
            <code>MessageRequest</code>는 system, messages, tools, tool choice, sampling과 reasoning
            옵션을 한 타입에 담는다. OpenAI-compatible 변환은 system을 첫 system message로 옮기고,
            assistant의 text는 content로, <code>ToolUse</code>는
            <code>tool_calls[].function.arguments</code> JSON 문자열로 바꾼다. user의
            <code>ToolResult</code>는 별도 <code>role: tool</code> message가 된다.
          </p>
          <p>
            model 이름도 wire 직전에 보정한다. <code>openai/gpt-5</code> 같은 routing prefix를
            제거하고 GPT-5에는 <code>max_tokens</code> 대신
            <code>max_completion_tokens</code>를 보낸다. reasoning model은 거부하는 sampling
            parameter를 빼고, Kimi tool result는 400을 피하려 <code>is_error</code>를 생략한다.
            tool schema는 object properties와 <code>additionalProperties: false</code> 규칙으로
            정규화된다.
          </p>
          <p>
            마지막 sanitizer는 모든 낯선 tool result를 공격적으로 버리지 않는다. 가까운 이전
            non-tool message가 assistant일 때만 그 <code>tool_calls</code>에 같은 id가 없으면
            orphan으로 제거한다. 이전 role이 user나 system이면 변환 산물일 가능성을 남겨 두고
            통과시킨다.
          </p>
        </div>
      </section>

      <section id="stream-contract" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>서로 다른 SSE는 여섯 사건으로 수렴한다</h2>
          <p>
            Anthropic stream과 OpenAI-compatible stream은 별도 parser를 쓰지만
            <code>MessageStream::next_event()</code> 밖으로는 같은 <code>StreamEvent</code>만
            내보낸다. OpenAI 쪽 state machine은 delta를 받으며 가상의 block 시작과 종료를 만들고,
            tool-call argument 조각도 index별로 조립한다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {streamEvents.map(([index, name, detail]) => (
            <div key={name} className="grid gap-1 py-3 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{index}</span>
              <code className="text-xs font-bold">{name}</code>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            순번은 모든 stream이 반드시 이 표의 한 줄씩 정확히 한 번 나온다는 뜻이 아니다.
            content block은 여러 개일 수 있고 delta는 반복된다. 안정된 계약은
            <strong> 사건의 종류와 block index를 통한 조립 규칙</strong>이다.
          </p>
          <h3>그 index 계약은 provider parser 다음 CLI 경계에서 약해진다</h3>
          <p>
            OpenAI-compatible parser는 tool call을 provider index별
            <code>BTreeMap</code>에 두고 공통 <code>ContentBlock*</code> event에도 block index를
            넣는다. 그러나 CLI adapter의 <code>push_output_block()</code>은 index를 받지 않고
            <code>pending_tool: Option</code> 하나만 유지한다. interleaved tool block 두 개가
            들어오면 뒤 start가 앞 pending tool을 덮을 수 있다. 또한 CLI는
            <code>MessageStart</code>의 id·model·request metadata를 session event로 보존하지 않고,
            <code>MessageDelta</code>에서는 stop reason 대신 usage만 옮긴다. “공통 event로
            정규화됐다”와 “downstream이 모든 계약을 보존한다”는 다른 주장이다.
          </p>
        </div>

        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {completionRules.map(([label, detail], index) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            따라서 stream 완료를 판단할 때는 HTTP EOF, provider의 명시적 finish reason, 공통
            <code>MessageStop</code>, CLI가 만든 synthetic stop, 빈 stream 뒤 두 번째 요청을
            구분해야 한다. 사용자 화면에 “완료”가 보인다는 사실만으로 upstream이 정상 종료했다고
            판정할 수 없다.
          </p>
        </div>
      </section>

      <section id="prompt-cache" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>PromptCache에는 서로 다른 두 시간이 있다</h2>
          <p>
            첫 시간은 <strong>30초 completion TTL</strong>이다. Anthropic 비스트리밍 요청은 전체
            request hash가 같은 저장 응답을 짧게 재사용하고, miss나 expiry면 실제 API 응답을 기록한다.
            streaming은 완성 응답을 replay하지 않고 <code>MessageStop</code>까지 관측한 usage만
            기록한다. top-level <code>with_prompt_cache()</code>도 Anthropic variant에만 붙는다.
          </p>
          <p>
            둘째 시간은 <strong>5분 prompt 관측 TTL</strong>이다. 이것은 응답을 5분 캐시한다는
            뜻이 아니다. provider가 보고한 <code>cache_read_input_tokens</code>가 크게 줄었을 때
            동일 prompt가 오래돼 만료됐을 가능성과 예상 밖 break를 가르는 휴리스틱이다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {cacheRules.map(([label, detail], index) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-sm font-bold">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            예를 들어 이전 cache read가 12,000이고 현재가 9,500이면 감소량은 2,500이다.
            fingerprint가 바뀌었다면 expected invalidation, 같고 301초가 지났다면 possible TTL
            expiry, 같고 120초만 지났다면 unexpected cache break다. 감소가 1,999라면 세 경우
            모두 break event 자체를 만들지 않는다.
          </p>
        </div>
      </section>
    </>
  );
}
