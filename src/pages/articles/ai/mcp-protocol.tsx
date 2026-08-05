import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { McpRoundTripLab } from './agent-system-core/viz/AgentSystemLabs';

function ProtocolLane({
  index,
  owner,
  sends,
  mustKeep,
}: {
  index: string;
  owner: string;
  sends: string;
  mustKeep: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_8rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{owner}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{sends}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>보존할 경계:</strong> {mustKeep}</p>
      </div>
    </div>
  );
}

const toolContract = `{
  "name": "lookup_order",
  "description": "주문 상태와 금액을 조회한다. 상태 변경은 하지 않는다.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string", "pattern": "^ORD-[0-9]+$" }
    },
    "required": ["orderId"],
    "additionalProperties": false
  }
}`;

const serverLoop = `request가 Mcp-Method와 _meta를 함께 기술
tools/call·resources/read·prompts/get만 Mcp-Name도 함께 기술
request마다 protocol version·capability 합의
server/discover → host가 허용된 schema만 context에 배치
model proposal → host policy gate → tools/call
result 또는 execution error → context packet → 다음 agent turn`;

export default function McpProtocolArticle() {
  return (
    <>
      <NlpSection
        id="overview"
        marker="01"
        tone="teal"
        question="Context에 들어갈 tool과 observation을 host–server 경계에서 교환한다"
        title="MCP는 agent runtime 전체가 아니라 typed context exchange protocol이다"
      >
        <QuestionLead
          question="MCP server를 연결하면 model이 그 도구를 안전하고 올바르게 사용할 수 있다는 뜻일까?"
          answer="아니다. MCP는 discovery, schema, message와 result envelope를 표준화한다. 어떤 tool을 model에게 보여 줄지, 사용자 권한으로 실제 실행해도 되는지, 결과를 다음 context에 얼마나 넣을지는 host와 harness가 결정한다. Protocol 연결과 authorization, task 성공은 서로 다른 증거다."
        />
        <ConceptPrimer items={[
          { term: 'Host', meaning: 'AI application 전체를 조정하고 사용자 동의, client lifecycle과 model context를 소유한다.', why: 'Server description을 곧바로 권한으로 승격하지 않게 한다.' },
          { term: 'Client', meaning: 'Host 안에서 특정 MCP server로 self-contained request를 보내는 protocol peer다.', why: '여러 server의 version, capability와 result를 섞지 않는다.' },
          { term: 'Server', meaning: 'Tool, resource와 prompt 같은 capability를 제공하는 local process 또는 remote service다.', why: '실행 환경과 data owner를 protocol 바깥의 실제 보안 경계와 연결한다.' },
          { term: 'Per-request negotiation', meaning: '2026-07-28 core에서 각 request가 _meta로 version과 필요한 capability를 협상하는 절차다.', why: '이전 session의 암묵적 상태를 믿지 않고 요청 하나를 독립적으로 검증한다.' },
        ]} />
        <McpRoundTripLab />
        <Misconception>
          “LLM의 USB”는 통합 목적을 기억하는 비유일 뿐 실행 계약이 아니다. MCP는 model provider를 추상화하거나 agent loop, memory, permission policy와 eval을 자동 제공하지 않는다. 또한 server process가 분리됐다는 사실만으로 sandbox나 least privilege가 보장되지 않는다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="architecture"
        marker="02"
        tone="blue"
        question="Data layer와 transport layer, application과 protocol 책임을 분리한다"
        title="Host가 server별 경계를 유지하되 core request는 stateless하게 만든다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Host는 여러 MCP client를 둘 수 있고 각 client는 한 server의 capability와 trust boundary를 추적한다. Local stdio server는 보통 client가 subprocess를 소유하고, remote HTTP server는 여러 client request를 받을 수 있다. 다만 2026-07-28 core request는 이전 connection의 initialize state에 의존하지 않고 그 자체로 이해 가능해야 한다.</p>
          <p>MCP에는 data 의미와 transport 책임이 있다. HTTP request는 모든 요청에 <code>Mcp-Method</code>를 싣고, 이름이나 URI를 직접 가리키는 <code>tools/call</code>·<code>resources/read</code>·<code>prompts/get</code>에만 <code>Mcp-Name</code>도 싣는다. Body의 <code>_meta</code>에는 protocol version과 client capability가 들어간다. Transport는 stdio 또는 HTTP에서 framing, 연결과 authorization을 처리한다. 같은 capability call도 두 transport에서 의미는 같지만 process lifetime과 credential 경계는 다르다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProtocolLane index="01" owner="Host" sends="사용자 목표, model turn, approval과 어떤 capability를 context에 노출할지 관리한다." mustKeep="Server metadata를 untrusted input으로 다루고 실제 권한을 별도 검증한다." />
          <ProtocolLane index="02" owner="Client" sends="각 request의 method, 필요한 경우 name, protocol version과 capability metadata를 한 server 경계에 맞춰 보낸다." mustKeep="이전 request의 암묵적 session state나 다른 server response를 섞지 않는다." />
          <ProtocolLane index="03" owner="Server" sends="합의된 primitive를 list/read/call하고 typed result 또는 error를 반환한다." mustKeep="Schema validation과 실제 resource authorization을 실행 지점에서 다시 한다." />
          <ProtocolLane index="04" owner="Transport" sends="Self-contained request, response와 stream event의 byte framing·authorization을 운반한다." mustKeep="Transport 성공을 tool 성공으로 해석하지 않는다." />
        </div>
        <Takeaway>
          2025의 <code>initialize/initialized</code> session flow는 legacy delta다. 2026-07-28에서는 각 request의 version·capability를 먼저 검증하고, <code>server/discover</code>와 execution으로 넘어간다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="primitives"
        marker="03"
        tone="violet"
        question="이름 목록이 아니라 누가 발견·선택·실행을 통제하는지 읽는다"
        title="현재 server 기능과 호환성 기능을 먼저 분리한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Server가 제공하는 세 primitive는 같은 함수 목록이 아니다. <strong>Prompts</strong>는 사용자가 명시적으로 고르는 재사용 template, <strong>Resources</strong>는 application이 context로 선택하는 URI 기반 data, <strong>Tools</strong>는 model이 다음 행동으로 제안할 수 있는 실행 capability다. “Model-controlled”은 model proposal을 뜻하며 실제 authorization까지 모델이 가진다는 뜻은 아니다.</p>
          <p>Server가 작업 도중 사용자 입력을 더 받아야 할 때는 <strong>elicitation</strong>을 사용한다. 2026 HTTP 흐름에서는 server가 별도 JSON-RPC 요청을 밀어 넣지 않는다. 대신 원래 요청의 응답으로 <code>InputRequiredResult</code>를 돌려주고, client가 입력을 모은 뒤 <code>inputResponses</code>를 붙여 원래 요청을 다시 보낸다. 이 여러 번의 왕복을 <strong>MRTR</strong>(Multi Round-Trip Requests)이라고 한다.</p>
          <p><strong>Sampling</strong>과 <strong>Roots</strong>는 2026 revision에서 deprecated compatibility feature다. 기존 구현을 읽기 위해 의미는 알아야 하지만 새 설계의 기본 선택으로 삼지 않는다. 새 server가 LLM 호출이 필요하면 provider API나 명시적 tool을 사용하고, 작업 경계가 필요하면 server configuration이나 resource로 표현한다. 오래 이어지는 작업 상태도 core session에 숨기지 않고 Tasks extension이나 application handle처럼 명시적 계약으로 분리한다.</p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Prompt', '사용자', '목적에 맞는 template을 명시적으로 선택한다.'],
            ['Resource', 'Application', 'URI, MIME type과 source를 보고 context에 붙인다.'],
            ['Tool', 'Model proposal + Host gate', 'Typed argument로 행동을 제안하고 policy 뒤 실행한다.'],
            ['Elicitation', '현재 · MRTR 입력 요청', 'InputRequiredResult로 사용자 입력을 요구하고 원래 요청을 재시도한다.'],
            ['Sampling', 'Deprecated · 호환성', '기존 server가 host model generation을 요구하던 기능이다. 새 구현은 직접 provider API 또는 명시적 tool을 쓴다.'],
            ['Roots', 'Deprecated · 호환성', '기존 client가 작업 가능한 URI 경계를 제공하던 기능이다. 새 구현은 configuration 또는 resource로 경계를 명시한다.'],
          ].map(([name, owner, description]) => (
            <div key={name} className="min-w-0 bg-background p-4">
              <p className="text-xs font-bold text-muted-foreground">{owner}</p>
              <h3 className="mt-1 text-sm font-bold">{name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-all rounded-md border border-border bg-muted/20 p-4 font-mono text-[11px] leading-5 sm:text-xs"><code>{toolContract}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Schema는 model에게 argument 구조를 알려 주고 server가 입력을 검증하게 한다. 그러나 description은 trusted policy가 아니다. Read-only 여부, idempotence, side effect와 authorization은 실제 구현과 policy에서 확인해야 하며 annotation만 믿고 고위험 도구를 자동 실행하지 않는다.</p>
        </div>
      </NlpSection>

      <NlpSection
        id="transport"
        marker="04"
        tone="amber"
        question="Legacy HTTP+SSE와 현재 Streamable HTTP를 같은 선택지로 나열하지 않는다"
        title="현재 표준 transport는 stdio와 Streamable HTTP 두 가지다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>stdio</strong>에서는 client가 server subprocess를 시작하고 stdin으로 MCP message를 보내며 stdout에서 MCP message만 읽는다. Log는 stderr로 분리한다. 이 방식은 같은 machine의 local integration에 단순하지만, subprocess에 상속할 environment·filesystem·credential과 종료 처리를 host가 통제해야 한다.</p>
          <p><strong>HTTP</strong>에서는 client가 self-contained request를 보내고 server는 response 또는 stream을 반환할 수 있다. 장기 작업의 continuity가 필요하면 core session을 복원하는 대신 명시적 task·handle과 idempotency 계약을 사용한다. Legacy HTTP+SSE와 2025 Streamable HTTP의 session 동작을 2026 core 의무처럼 가르치지 않는다.</p>
          <p>Remote transport에는 TLS만으로 충분하지 않다. Protected resource metadata, authorization server discovery, OAuth resource indicator, audience·scope 검증과 least privilege가 필요하다. Server는 <code>Origin</code>을 검증해 DNS rebinding을 막고, application handle을 credential이나 authorization 근거로 사용하지 않는다.</p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="min-w-0 bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">stdio</p>
            <p className="mt-2 text-sm font-semibold">Local child process · newline-framed JSON-RPC</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Process ownership, inherited secrets, stdout purity와 shutdown을 검사한다.</p>
          </div>
          <div className="min-w-0 bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">Streamable HTTP</p>
            <p className="mt-2 text-sm font-semibold">Remote endpoint · POST + optional SSE</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Auth, Origin, self-contained request, explicit handle과 multi-client isolation을 검사한다.</p>
          </div>
        </div>
        <Misconception>
          SSE는 별도 MCP semantic layer가 아니다. Streamable HTTP가 response를 여러 server message로 흘려보낼 때 사용할 수 있는 transport mechanism이다. HTTP status, JSON-RPC error와 tool execution error도 각각 다른 층에서 읽어야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="implementation"
        marker="05"
        tone="green"
        question="Hello-world handler보다 lifecycle, 오류와 replay 가능한 증거를 먼저 고정한다"
        title="최소 구현은 self-contained request에서 result envelope까지 닫는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>SDK의 decorator 몇 줄보다 먼저 protocol trace를 만든다. Request마다 client와 server version, capability metadata, method·name, validated arguments, auth context, result·error class, latency와 cancellation을 기록한다. 원문 payload에 secret이나 개인 정보가 있으면 저장 전에 redact하고 retention을 정한다.</p>
          <p>Tool input validation 실패는 model이 argument를 고쳐 다시 시도할 수 있도록 tool execution error로 돌려줄 수 있다. 존재하지 않는 method, malformed JSON-RPC와 version/lifecycle 위반은 protocol error다. 두 오류를 하나의 exception으로 삼키면 agent가 schema를 고쳐야 할지 연결을 끊어야 할지 판단할 수 없다.</p>
        </div>
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-6 sm:text-sm"><code>{serverLoop}</code></pre>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProtocolLane index="01" owner="Describe" sends="Mcp-Method와 _meta에 method, version과 필요한 capability를 넣고, name·URI를 직접 가리키는 세 method에만 Mcp-Name을 덧붙인다." mustKeep="요청만 읽어도 실행 의도와 협상 조건을 복원할 수 있어야 한다." />
          <ProtocolLane index="02" owner="Discover" sends="server/discover로 현재 capability와 schema를 읽는다." mustKeep="Registry revision과 source server를 추적한다." />
          <ProtocolLane index="03" owner="Select" sends="Host가 task에 필요한 capability만 model context에 넣는다." mustKeep="Global catalog와 task grant를 분리한다." />
          <ProtocolLane index="04" owner="Call" sends="Schema validation과 policy를 통과한 typed argument를 request ID와 함께 보낸다." mustKeep="Timeout, cancellation과 idempotency를 tool별로 정한다." />
          <ProtocolLane index="05" owner="Observe" sends="Structured content, isError와 state diff를 다음 context packet으로 변환한다." mustKeep="Tool 오류를 성공 text로 오인하거나 source lineage를 잃지 않는다." />
        </div>
        <StopRule>
          MCP server를 추가하기 전에 단순 in-process function contract로 충분한지 확인한다. 별도 process·team·service 경계에서 capability discovery와 표준 exchange가 실제로 필요하고, describe → negotiate → discover → call → result와 auth·error test가 재현될 때까지만 protocol 층을 확장한다.
        </StopRule>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>다음 글인 <InternalLink slug="llm-harness">Harness Engineering</InternalLink>은 MCP call 하나를 agent의 retry, timeout, permission, checkpoint와 trace state machine 안에 넣는다. 고위험 source와 sink의 세부 policy는 <InternalLink slug="prompt-injection-defense">Prompt Injection 방어</InternalLink>가 소유한다.</p>
          <p>개념을 실제 process lifecycle과 JSON-RPC bridge에 대입하려면 <InternalLink slug="claw-mcp" learningPathId="ai-claw-infra">Claw MCP 구현</InternalLink>으로 내려간다. 이 링크는 MCP의 새 표준을 설명하는 글이 아니라, 위 계약이 한 Rust runtime에서 어디에 구현됐는지 검산하는 코드 경로다.</p>
        </div>
        <CapabilityCheck items={[
          'Host, client, server와 transport의 책임을 분리할 수 있다.',
          '2026의 self-contained request·요청별 negotiation·server/discover와 2025 initialize session의 차이를 설명할 수 있다.',
          'Prompt, resource, tool과 MRTR elicitation을 구분하고 sampling·roots가 2026 deprecated 기능임을 설명할 수 있다.',
          'stdio와 Streamable HTTP의 process, framing, authorization과 reconnect 차이를 설명할 수 있다.',
          'Protocol error와 tool execution error를 다른 recovery 경로로 보낼 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'MCP Specification · 2026-07-28', href: 'https://modelcontextprotocol.io/specification/2026-07-28', note: 'Stateless self-contained request, per-request capability negotiation, server/discover와 extension 경계.' },
          { label: 'MCP Streamable HTTP · 2026-07-28', href: 'https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http', note: 'Mcp-Method·Mcp-Name 적용 범위, request별 POST, MRTR와 InputRequiredResult의 현재 transport 규칙.' },
          { label: 'SEP-2577 · Deprecate Roots, Sampling, and Logging', href: 'https://modelcontextprotocol.io/seps/2577-deprecate-roots-sampling-and-logging', note: 'Roots와 sampling을 새 구현의 기본 기능에서 제외하는 2026 lifecycle 근거.' },
          { label: 'MCP 2026-07-28 release notes', href: 'https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/', note: 'Initialize·session 제거와 2025 규격에서 바뀐 delta.' },
          { label: 'MCP Architecture overview', href: 'https://modelcontextprotocol.io/docs/learn/architecture', note: 'Host–client–server 관계, data layer와 transport layer의 현재 설명.' },
          { label: 'MCP Specification · 2025-11-25 legacy', href: 'https://modelcontextprotocol.io/specification/2025-11-25', note: '기존 initialize·initialized와 sessionful implementation을 읽기 위한 호환성 기준.' },
        ]} />
      </NlpSection>
    </>
  );
}
