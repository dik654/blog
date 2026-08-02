import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-api-client/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawApiClientArticle() {
  return (
    <>
      <QuestionLead
        question="qwen-plus는 Alibaba 모델인데 왜 ProviderClient::OpenAi로 들어가고, OPENAI_API_KEY가 아니라 DASHSCOPE_API_KEY를 읽을까?"
        answer={<>회사와 wire protocol은 다른 분류이기 때문이다. Qwen은 DashScope의 OpenAI-compatible endpoint를 사용하므로 enum variant는 <code>OpenAi</code>지만, model metadata가 DashScope config를 선택해 별도 URL·키·6 MiB 요청 제한을 적용한다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'provider routing', meaning: 'model 이름과 metadata로 실제 client variant와 endpoint 설정을 고르는 단계.', why: '회사 이름, API 형식, enum variant를 한 개념으로 합치면 Qwen·Kimi 경로를 설명할 수 없다.' },
          { term: 'wire normalization', meaning: '공통 MessageRequest를 각 서비스가 받는 JSON과 SSE 형식으로 바꾸는 경계.', why: 'runtime은 서비스별 tool-call 차이를 몰라도 같은 응답 타입을 소비할 수 있다.' },
          { term: 'stream state', meaning: '서로 다른 SSE 조각을 message와 content block의 시작·delta·종료 사건으로 조립하는 상태.', why: '텍스트와 tool call이 여러 frame으로 잘려 와도 실행 순서를 보존한다.' },
          { term: 'request fingerprint', meaning: 'model·system·tools·messages를 각각 hash한 요청 정체성.', why: 'cache read token이 줄었을 때 입력 변경인지 예상 밖 cache break인지 구분한다.' },
        ]}
      />
      <Misconception>
        top-level <code>ProviderClient</code>는 trait object가 아니라 세 variant를 가진 enum이다.
        이 revision에는 Azure variant도 없다. <code>PromptCache</code>는 Anthropic payload에
        cache breakpoint를 골라 넣는 최적화기가 아니라, 짧은 로컬 응답 재사용과 cache usage
        변화를 기록하는 계층이다.
      </Misconception>
      <Overview />
      <StopRule>
        provider SDK 일반론까지 넓히지 않는다. model alias가 concrete enum과 endpoint config를
        선택하는 과정, 공통 request가 wire payload와 여섯 stream event로 바뀌는 과정,
        PromptCache의 30초 completion TTL과 5분 관측 TTL을 원문에서 구분할 수 있으면 멈춘다.
      </StopRule>
      <CapabilityCheck
        items={[
          'opus·grok-mini·qwen-plus·kimi·openai/gpt-5가 어떤 enum variant와 config를 선택하는지 설명한다.',
          '알 수 없는 model이 환경 변수 조합에 따라 다른 provider로 가는 우선순위를 계산한다.',
          'API key의 .env fallback과 base URL의 process-env-only 규칙을 구분한다.',
          'Anthropic API key와 bearer token이 함께 있을 때 둘 중 하나를 버린다는 주장이 왜 틀렸는지 설명한다.',
          'assistant ToolUse와 user ToolResult가 OpenAI-compatible message로 어떻게 분리되는지 추적한다.',
          'gpt-5와 Kimi에만 적용되는 wire 보정 한 가지씩을 찾는다.',
          '여섯 StreamEvent를 message 수준과 content-block 수준으로 나누고 CLI가 버리는 metadata를 찾는다.',
          '두 tool block이 interleave될 때 provider index map과 CLI pending_tool 하나가 만드는 차이를 설명한다.',
          '정상 stop, synthetic stop, 빈 stream의 non-streaming 재요청을 서로 구분한다.',
          '동일 fingerprint의 cache read token이 2,000 이상 줄었을 때 5분 전후 판정이 어떻게 달라지는지 계산한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-config" learningPathId="ai-claw-infra">설정에서 model을 고르는 법</InternalLink></span>
        <span>다음: <InternalLink slug="claw-mcp" learningPathId="ai-claw-infra">model이 호출할 외부 도구 연결</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw api/client.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/api/src/client.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. ProviderClient enum dispatch, DashScope 선택, MessageStream wrapper 원문.` },
          { label: 'Claw api/providers/mod.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/api/src/providers/mod.rs`, note: 'model alias·metadata·ProviderKind 탐지와 concrete Provider trait 구현의 경계.' },
          { label: 'Claw api/providers/anthropic.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/api/src/providers/anthropic.rs`, note: 'AuthSource, Anthropic request, SSE parsing과 prompt-cache 연결 원문.' },
          { label: 'Claw api/providers/openai_compat.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/api/src/providers/openai_compat.rs`, note: '세 endpoint config, message·tool schema 변환, model별 보정, stream assembly 원문.' },
          { label: 'Claw api/prompt_cache.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/api/src/prompt_cache.rs`, note: 'completion cache, request fingerprint, cache-break 관측의 실제 TTL과 판정 규칙.' },
          { label: 'Claw api/types.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/api/src/types.rs`, note: '공통 MessageRequest·MessageResponse와 여섯 StreamEvent 계약.' },
          { label: 'Claw CLI main.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/main.rs`, note: '공통 StreamEvent를 AssistantEvent로 옮기는 adapter, 단일 pending_tool, synthetic stop과 non-streaming fallback.' },
        ]}
      />
    </>
  );
}
