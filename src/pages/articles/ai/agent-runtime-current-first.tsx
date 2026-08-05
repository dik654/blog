import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  ActionSurfaceLab,
  AgentRouteChooserLab,
  AgentRuntimeStackLab,
  ProtocolBoundaryLab,
} from './agent-current-first/viz/AgentCurrentLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: Array<[string, string]>;
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function ContractRow({
  index,
  owner,
  question,
  evidence,
}: {
  index: string;
  owner: string;
  question: string;
  evidence: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_8rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{owner}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{question}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>완료 증거:</strong> {evidence}</p>
      </div>
    </div>
  );
}

const checkpointExample = `type DurableCheckpoint = {
  runId: string;
  taskRevision: string;
  status: "running" | "waiting" | "blocked" | "completed";
  environmentManifest: { image: string; workspaceRevision: string };
  grants: CapabilityGrantRef[];       // 실제 credential은 넣지 않는다
  pendingAction?: ActionProposalRef;
  correlationKeys: Record<string, string>; // proposal과 receipt를 같은 logical action으로 연결
  lastVerifiedEvent: EventRef;
  effects: EffectReceipt[];
  artifacts: ArtifactRef[];           // URI + hash + producer + verifier
  tests: VerificationResult[];
  remainingBudget: Budget;
};`;

export default function AgentRuntimeCurrentFirstArticle() {
  return (
    <>
      <NlpSection
        id="runtime-stack"
        marker="01"
        tone="teal"
        question="AI가 답을 제안하는 일과 시스템이 실제 일을 끝내는 일을 나눈다"
        title="오래 일하는 에이전트에는 모델 밖의 실행 시스템이 필요하다"
      >
        <BeginnerOpening
          title="AI 에이전트는 답만 쓰는 모델에 작업 도구와 실행 기록을 붙인 시스템이다"
          description={<>여기서 <strong>모델</strong>은 현재 지시와 자료를 읽어 다음 말이나 행동 후보를 제안하는 부분이다. <strong>프롬프트</strong>는 모델에게 건네는 지시와 문맥이고, <strong>도구</strong>는 파일·브라우저·API처럼 바깥세계를 실제로 읽거나 바꾸는 기능이다.</>}
          familiarScene={<>직원에게 “자료를 조사해 보고서를 완성해 주세요”라고 말했다고 하자. 지시를 이해하는 능력만으로는 부족하다. 자료에 접근할 권한, 작업할 책상, 중간 저장, 실패 뒤 재개 방법과 제출물이 맞는지 확인하는 절차가 함께 있어야 오래 일할 수 있다.</>}
          steps={[
            { label: '다음 행동을 제안한다', detail: '모델이 현재 상태를 보고 검색, 파일 수정이나 답변 후보를 만든다.' },
            { label: '규칙 안에서 실행한다', detail: '실행 제어부가 권한, 예산과 재시도 규칙을 확인하고 도구를 호출한다.' },
            { label: '결과를 확인하고 남긴다', detail: '실제 변화의 증거와 중간 상태를 저장해 다음 행동과 재시작에 사용한다.' },
          ]}
        />
        <QuestionLead
          question="같은 모델과 같은 지시를 쓰는데, 왜 어떤 에이전트는 몇 시간 일하고 어떤 에이전트는 도구 오류 한 번에 무너질까?"
          answer="차이는 model의 지식보다 바깥 실행 계약에서 생긴다. Model은 다음 행동 후보를 제안한다. Harness는 상태·정책·예산을 관리하고, executor는 격리된 환경에서 행동하며, reducer는 관찰된 결과만 다음 상태로 반영한다. 오래 실행하려면 이 상태와 산출물이 model context 밖에도 남아야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Model', meaning: '현재 context를 읽고 답변이나 다음 action proposal을 생성한다.', why: '말을 잘 만드는 능력과 실제 권한을 분리해야 한다.' },
          { term: 'Harness', meaning: 'Turn, tool dispatch, policy, retry, budget, checkpoint와 trace를 소유하는 실행 제어부다.', why: '확률적인 제안을 결정적인 규칙과 증거로 감싼다.' },
          { term: 'Workspace · Sandbox', meaning: '파일, process, browser와 network가 실제로 존재하는 격리된 계산 환경이다.', why: 'Model context와 실행 환경의 상태는 서로 다르다.' },
          { term: 'Durable state', meaning: 'Process와 context가 사라져도 다시 읽을 수 있는 versioned task state다.', why: '장기 작업을 transcript의 기억력에 맡기지 않는다.' },
          { term: 'Grant', meaning: '특정 identity가 특정 resource에서 허용받은 action의 범위와 만료 조건을 가리키는 권한 참조다.', why: '도구가 존재한다는 사실과 이번 task에서 실제로 실행할 권한이 있다는 사실을 분리한다.' },
          { term: 'Idempotency key', meaning: '같은 논리적 action을 다시 보낸 요청임을 server에 알리는 식별자다.', why: 'Timeout 뒤 재시도가 결제·환불·commit을 두 번 일으키지 않도록 effect receipt와 연결한다.' },
          { term: 'Effect receipt', meaning: 'API 응답 ID, file hash, transaction ID처럼 외부 변화가 실제 일어났음을 가리키는 증거다.', why: '“실행했다”는 문장과 환경의 변화를 구분한다.' },
        ]} />
        <AgentRuntimeStackLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>한 번의 설명은 model만으로도 끝날 수 있다. 하지만 환불 API를 호출하는 순간 identity, permission, schema, timeout과 중복 지급이 등장한다. GUI를 조작하면 화면 revision, 좌표 이동과 overlay가 더해지고, 여러 시간 코드를 수정하면 sandbox가 사라진 뒤 무엇에서 재개할지도 필요하다. 따라서 “agent인가 아닌가”보다 <strong>이 작업에 어떤 실행 층과 완료 증거가 필요한가</strong>를 먼저 묻는 편이 정확하다.</p>
          <p>2026년의 agent SDK와 computer environment 연구가 강조하는 방향도 같다. Model이 shell이나 tool call을 제안하더라도 실제 process 실행, workspace, output 제한과 session lifecycle은 외부 runtime이 맡는다. 강한 model은 이 계약 안에서 더 좋은 선택을 할 수 있지만 계약 자체를 대신하지 않는다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContractRow index="01" owner="Goal" question="무엇을 완료해야 하며 어떤 결과는 금지되는가?" evidence="성공 조건, 금지 조건과 release owner" />
          <ContractRow index="02" owner="Proposal" question="Model이 지금 어떤 행동과 기대 결과를 제안했는가?" evidence="Typed arguments, 근거 source와 proposal hash" />
          <ContractRow index="03" owner="Gate" question="현재 사용자·task·resource 범위에서 이 행동을 허용할 수 있는가?" evidence="Policy rule, grant, budget와 필요한 approval" />
          <ContractRow index="04" owner="Execution" question="어떤 환경과 credential 경계에서 행동이 수행됐는가?" evidence="Tool span, environment revision과 bounded output" />
          <ContractRow index="05" owner="Verification" question="환경의 목표 상태가 실제로 만들어졌는가?" evidence="Effect receipt, read-after-write, artifact hash와 test" />
        </div>
        <Misconception>
          Tool 목록을 system prompt에 넣었다고 production agent가 되지는 않는다. Tool schema는 model이 만들 수 있는 제안의 형식을 좁힐 뿐, authorization·execution·effect verification을 자동으로 제공하지 않는다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="action-surface"
        marker="02"
        tone="blue"
        question="행동 능력보다 관찰과 검증이 쉬운 경계를 먼저 고른다"
        title="Typed API, shell, GUI와 remote agent는 같은 tool이 아니다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>행동 표면은 agent가 환경과 만나는 인터페이스다. 같은 “고객 상태를 바꾼다”도 typed API라면 request와 response를 구조화할 수 있고 idempotency key를 붙일 수 있다. Shell은 파일 diff와 exit code를 얻지만 넓은 filesystem·network 권한을 가질 수 있다. GUI는 사람이 보는 화면과 같아 범용적이지만 좌표와 실제 업무 객체의 연결이 약하다. Remote agent는 내부 도구조차 보이지 않으므로 task lifecycle과 artifact 계약으로 검증해야 한다.</p>
          <p>PDF와 문서는 별도의 action surface가 아니라 비정형 <strong>관찰 입력</strong>이다. Parser나 OCR로 추출한 claim에는 page·region·source hash를 붙이고, 금액·날짜처럼 commit에 쓰일 값은 원문 좌표나 다른 system of record와 다시 대조한다. 문서를 읽었다는 사실이 그 안의 instruction을 실행할 권한을 만들지는 않는다.</p>
          <p>선택 원칙은 간단하다. <strong>목표를 달성하는 경계 중 가장 좁고, 관찰 가능하며, 재시도 규칙이 명확한 것</strong>을 고른다. API가 있는데 GUI를 택하면 편의성은 늘지 않고 grounding과 중복 commit 위험만 커진다. 반대로 API가 없는 legacy system에서는 GUI가 필요하지만, 그때는 screenshot만이 아니라 DOM·접근성 tree·URL·backend 조회를 조합해 약한 관찰을 보강한다.</p>
        </div>
        <ActionSurfaceLab />
        <Takeaway>
          “무엇을 할 수 있는가?” 다음에는 반드시 “실제 effect를 무엇으로 증명하는가?”가 와야 한다. Timeout 뒤에는 같은 correlation·idempotency key의 receipt와 새 환경 상태를 먼저 조회하고, effect가 없을 때만 같은 logical action으로 재시도한다. 이 규칙을 쓸 수 없으면 action surface가 아직 runtime 계약으로 닫히지 않았다.
        </Takeaway>
        <StopRule>
          고정된 단계와 typed API만으로 충분한 업무라면 autonomous loop를 추가하지 않는다. 예외 경로를 model이 선택해야 할 때만 agent loop를 열고, GUI는 더 좁은 경계가 없을 때 사용한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="durable-run"
        marker="03"
        tone="violet"
        question="Context와 sandbox가 사라져도 증거에서 다시 시작한다"
        title="Transcript가 아니라 verified event로 다음 상태를 만든다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>대화 transcript는 model이 왜 행동을 골랐는지 조사하는 trace에는 유용하다. 그러나 “환불이 이미 처리됐는가”, “어느 file이 최종본인가”, “어떤 test가 통과했는가”를 자연어 요약에서 추측하면 안 된다. 이 값은 machine-readable state, artifact와 effect receipt에 저장해야 한다.</p>
          <p>Reducer는 현재 상태와 검증된 event를 받아 다음 상태를 만드는 함수다. Model의 “완료” 출력은 proposal event일 뿐이다. Executor의 성공 응답, backend 재조회, file hash와 독립 test가 연결돼야 completed state로 전이한다. 같은 입력에서 같은 상태가 나와야 replay, recovery와 회귀 분석이 가능하다.</p>
          <p><strong>아래 reducer 식과 checkpoint JSON은 특정 protocol의 wire format이 아니라, 이 글이 durable runtime 원칙을 시험하기 위해 만든 저자 재구성 계약이다.</strong></p>
        </div>
        <Formula
          latex={String.raw`\underbrace{S_{t+1}}_{\text{다음의 재개 가능한 상태}}=\underbrace{\mathcal R}_{\text{결정적 reducer}}\!\left(\underbrace{S_t}_{\text{직전 checkpoint}},\underbrace{e_t}_{\text{검증된 event와 receipt}}\right)`}
          meaning="다음 상태는 대화 요약을 다시 해석해 만드는 것이 아니라, 직전의 versioned checkpoint와 검증된 한 event를 reducer에 넣어 만든다. 같은 상태와 event가 같은 결과를 내야 새 process가 replay하고 실패 지점을 재현할 수 있다."
          symbols={[
            [String.raw`S_t`, 'task status, budget, grant, artifact와 pending action을 담은 현재 checkpoint'],
            [String.raw`e_t`, 'model proposal, policy decision, tool result, effect receipt 또는 verifier result'],
            [String.raw`\mathcal R`, '허용된 event만 반영하고 invariant를 검사하는 결정적 전이 규칙'],
            [String.raw`S_{t+1}`, '새 context나 sandbox가 그대로 다시 읽어 재개할 수 있는 다음 상태'],
          ]}
        />
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-6 sm:text-sm"><code>{checkpointExample}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Checkpoint에는 raw credential을 넣지 않는다. 어떤 grant를 사용했는지 가리키는 reference와 범위만 남기고, 재개 시 identity와 policy를 다시 확인한다. Artifact는 파일 경로만이 아니라 hash, producer, source lineage와 verifier를 가진다. Sandbox snapshot은 편리하지만 image version과 workspace revision이 없으면 다른 환경에서 같은 결과를 재현할 수 없다.</p>
          <p>긴 coding task의 구체적인 reducer·budget·checkpoint 설계는 <InternalLink slug="llm-harness" learningPathId="ai-agent-system-core">LLM Harness</InternalLink>에서 이어진다. 여러 worker가 artifact를 나눠 만들 때 lease와 merge owner를 정하는 법은 <InternalLink slug="multi-agent-implementation" learningPathId="ai-agent-system-core">멀티 에이전트 런타임</InternalLink>에서 확장한다.</p>
        </div>
      </NlpSection>

      <NlpSection
        id="protocol-boundary"
        marker="04"
        tone="amber"
        question="Capability 호출과 독립 agent 위임을 서로 다른 계약으로 읽는다"
        title="MCP는 도구 경계이고 A2A는 task lifecycle 경계다"
      >
        <ConceptPrimer items={[
          { term: 'Capability', meaning: 'Tool 호출, resource 읽기처럼 상대가 제공한다고 선언한 한 가지 기능이다.', why: '연결된 기능의 목록과 현재 작업에 실제로 허용된 권한을 구분한다.' },
          { term: 'Discovery', meaning: '상대가 어떤 capability와 입력 schema를 제공하는지 먼저 조회하는 절차다.', why: '이름을 추측해 호출하지 않고 현재 계약을 확인한다.' },
          { term: 'Request metadata · _meta', meaning: '요청 본문에 붙는 version, client 정보와 capability 조건이다.', why: '이전 연결의 기억에 기대지 않고 요청 하나만으로 호환성을 검사한다.' },
          { term: 'RPC · Binding', meaning: 'RPC는 다른 process의 기능을 message로 호출하는 방식이고, binding은 그 message를 HTTP·gRPC·JSON-RPC 중 무엇으로 운반할지 정한 규칙이다.', why: '업무 의미와 전송 방식을 한 덩어리로 오해하지 않게 한다.' },
          { term: 'Agent Card', meaning: 'A2A agent가 자신의 identity, endpoint와 지원 기능을 알리는 서명 가능한 소개 문서다.', why: '독립 agent에게 일을 넘기기 전에 누구이며 무엇을 지원하는지 확인한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>MCP 2026-07-28 core에서는 이전의 <code>initialize/initialized</code> session 절차가 빠지고, 각 request가 스스로 이해 가능한 stateless message가 된다. Streamable HTTP transport의 body는 여전히 JSON-RPC request이고, gateway가 body를 풀어보지 않아도 route와 policy를 적용할 수 있도록 일부 필드를 HTTP header에도 비춘다. 모든 request에는 <code>Mcp-Method</code>가 필요하고, <code>Mcp-Name</code>은 이름이나 URI를 직접 가리키는 <code>tools/call</code>·<code>resources/read</code>·<code>prompts/get</code>에서만 덧붙인다. <code>_meta</code>에는 version과 capability 조건을 넣고, 필요하면 <code>server/discover</code>로 제공 기능을 찾는다. 오래 이어지는 작업 상태는 암묵적 session이 아니라 handle이나 Tasks extension처럼 명시적인 계약으로 둔다.</p>
          <p>2025 규격과 구현은 session 시작 시 protocol version과 capability를 협상한 뒤 tool, resource와 prompt를 발견했다. 이 흐름은 기존 client/server를 읽는 delta로 남겨야 하지만 현재 core 계약으로 설명하면 안 된다. 두 버전 모두 server가 task 전체의 목표 분해와 최종 release 책임을 자동으로 가져가는 것은 아니며, host가 agent loop와 권한을 소유한다.</p>
          <p>A2A 1.0에서는 상대가 자체 model, memory, tool과 policy를 가진 독립 agent application이다. Client는 signed Agent Card로 identity와 capability를 확인하고, version과 HTTP·gRPC·JSON-RPC binding을 협상한 뒤 <code>SendMessage</code>로 message를 전달한다. 내부 reasoning을 볼 수 없으므로 task와 artifact를 더 강하게 검증하고, delegated agent가 권한을 다시 위임할 수 있는지도 envelope에서 제한한다.</p>
        </div>
        <ProtocolBoundaryLab />
        <Takeaway>
          MCP와 A2A는 경쟁하는 제품 목록이 아니다. 전자는 내 host가 외부 capability를 호출하는 경계를, 후자는 독립 실행 주체 사이에서 장기 task와 artifact를 교환하는 경계를 설명한다. 한 시스템이 둘을 함께 사용할 수 있다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="route"
        marker="05"
        tone="green"
        question="용어 목록 대신 지금 깨지는 계약에서 다음 글을 고른다"
        title="실패 증상이 학습 경로의 시작점이다"
      >
        <AgentRouteChooserLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 경로는 과거 논문을 끝없이 거슬러 올라가지 않는다. 현재 agent system의 실패를 먼저 찾고, 그 실패를 설명하는 최소 기반까지만 내려간다. 클릭과 commit이 문제면 Computer Use에서 시작한다. 작업이 끊기면 durable harness, worker가 충돌하면 coordination, 권한이 새면 source-to-sink safety, 개선 여부를 모르면 evaluation으로 간다. Evaluation에서 실패를 찾은 뒤에는 결정 기록으로 변경 이유를 고정하고, telemetry로 새 실행을 관찰한 다음 bounded recovery나 escalation 결과까지 닫는다.</p>
          <p>MCP schema가 막힐 때만 tool protocol로 내려가고, 매 turn에 무엇을 넣어야 할지 막힐 때만 context engineering을 읽는다. Workflow와 agent loop의 차이가 불분명할 때 ReAct 기반까지 내려가면 된다. 제품 사례와 framework 이름은 이 공통 계약을 이해한 뒤 검산용으로 읽는다.</p>
        </div>
        <CapabilityCheck items={[
          'Model output을 action proposal과 실제 authorization·execution으로 분리한다.',
          '작업 복잡도에 따라 model, harness, workspace와 durable state가 필요한지 판정한다.',
          'API, shell, GUI와 remote agent의 observation·effect proof·retry 계약을 구분한다.',
          'Transcript와 checkpoint, model의 완료 문장과 effect receipt를 구분한다.',
          'Reducer가 verified event만 다음 runtime state에 반영해야 하는 이유를 설명한다.',
          'MCP capability invocation과 A2A agent task lifecycle의 소유 경계를 구분한다.',
          '실패 증상에서 Computer Use, harness, coordination, safety 또는 eval branch를 고른다.',
          '평가에서 발견한 실패를 결정 기록, telemetry와 bounded recovery evidence까지 연결한다.',
          '더 단순한 workflow가 충분한 경우 autonomous agent를 추가하지 않는다.',
        ]} />
        <SourceNotes sources={[
          { label: 'OpenAI · The next evolution of the Agents SDK', href: 'https://openai.com/index/the-next-evolution-of-the-agents-sdk/', note: 'Memory, sandbox-aware orchestration, MCP, skills, snapshot·rehydration과 harness/compute 분리의 2026 공식 설명.' },
          { label: 'OpenAI · Equipping the Responses API with a computer environment', href: 'https://openai.com/index/equip-responses-api-computer-environment/', note: 'Model proposal, shell execution, workspace, 병렬 session과 bounded result의 2026 공식 실행 경계.' },
          { label: 'Anthropic · Effective harnesses for long-running agents', href: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents', note: 'Initializer, incremental worker, progress artifact와 context-window handoff를 다루는 장기 작업 실무 근거.' },
          { label: 'MCP Streamable HTTP · 2026-07-28', href: 'https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http#standard-request-headers', note: 'JSON-RPC body에서 HTTP header로 mirror하는 Mcp-Method·Mcp-Name의 정확한 적용 범위와 현재 transport 계약.' },
          { label: 'MCP 2026-07-28 release notes', href: 'https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/', note: 'Initialize·session 제거와 2025 sessionful flow에서 바뀐 protocol delta.' },
          { label: 'A2A Protocol · 1.0', href: 'https://a2a-protocol.org/latest/announcing-1.0/', note: 'SendMessage, multi-protocol binding, version negotiation과 signed Agent Card의 안정 규격.' },
          { label: 'Yao et al. · ReAct', href: 'https://arxiv.org/abs/2210.03629', note: 'Reasoning과 environment action·observation을 교차하는 agent loop의 최소 연구 기반.' },
        ]} />
      </NlpSection>
    </>
  );
}
