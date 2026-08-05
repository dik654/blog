import {
  BeginnerOpening,
  CapabilityCheck,
  ComparisonTable,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { RuntimeEvidenceLedger, RuntimeRequestPath } from './serving-runtime-viz';

const routeExample = `routed = route(
    "agent.result_outcome",
    also_requires=["agent.tool_loop_injection"],
    needs_tools=True,
    invocation="deterministic",
)

# agent 코드는 URL이나 qwen36-27b-fp8을 직접 고르지 않는다.
# 필요한 행동 계약을 말하고, fleet이 그 계약을 통과한 가장 싼 route를 고른다.`;

const outputExample = `def for_route(routed: Routed, output_type: type[BaseModel]):
    if routed.supports_native_output:
        return NativeOutput(output_type)   # response_format + guided JSON
    return PromptedOutput(output_type)     # schema를 instruction에 포함

# PydanticAI 기본 Tool Output은 이 프로젝트의 구조화 결과에는 쓰지 않는다.
# JSON 결과를 얻으려고 불필요한 tool round trip을 만들기 때문이다.`;

const boundedLoopExample = `class BoundedToolAgent(Agent[None, str]):
    # 2026-08-06 코드 스냅샷의 기본값
    request_limit = 8
    tool_calls_limit = 6
    tool_timeout_seconds = 30

# 별도 모델 호출 timeout 기본값: 120초
# 각 제한은 서로 다른 정지 실패를 다룬다.`;

const evaluationEnvelope = `{
  "snapshot": "git SHA + fleet manifest digest",
  "caseSuite": "고정된 acceptance case 집합",
  "arm": "baseline | candidate",
  "route": {
    "requestedCapabilities": ["..."],
    "actualModel": "...",
    "invocationProfile": "...",
    "outputMode": "native | prompted"
  },
  "servingManifest": "vLLM flags와 served context",
  "trials": 0,
  "acceptance": { "passed": 0, "failed": 0 },
  "forbiddenEffects": [],
  "latencyAndUsage": { "seconds": [], "tokens": [], "wireCalls": [] },
  "failureOwner": "model | adapter | route | tool | policy | evaluator",
  "artifacts": ["trace", "stderr", "output hash"],
  "openDefects": []
}`;

function SnapshotBand() {
  const items = [
    ['Framework', 'PydanticAI', 'typed agent·tool·output 계약'],
    ['Escalation model', 'Qwen3.6-27B FP8', '현재 local fleet의 가장 높은 비용 순위'],
    ['Serving path', 'OpenAI-compatible', 'vLLM endpoint 뒤 실제 served model 확인'],
    ['Execution', 'native loop + staged graph', '업무 의존성에 따라 두 runtime을 선택'],
  ];

  return (
    <div className="not-prose my-8 grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2" data-article-viz>
      {items.map(([label, value, note]) => (
        <div className="min-w-0 bg-background p-4" key={label}>
          <p className="text-xs font-bold text-muted-foreground">{label}</p>
          <p className="mt-1 break-words text-base font-bold [overflow-wrap:anywhere]">{value}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="not-prose my-6 min-w-0 overflow-hidden rounded-md border border-border">
      <p className="border-b border-border bg-muted/25 px-4 py-2 text-xs font-bold text-muted-foreground">{title}</p>
      <pre className="max-w-full overflow-x-auto p-4 text-xs leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

export default function PydanticAiQwen36AgentSystemArticle() {
  return (
    <>
      <NlpSection
        id="overview"
        marker="01"
        tone="teal"
        question="PydanticAI에 Qwen3.6 URL만 연결하면 agent가 완성될까요?"
        title="모델 연결은 시작일 뿐, 실행 계약이 agent를 만듭니다"
      >
        <BeginnerOpening
          title="이 사례는 local Qwen 모델을 실제 업무 도구로 바꾸면서 생긴 경계를 코드로 고정한 기록입니다"
          description={<>여기서 다루는 구현은 <strong>PydanticAI agent</strong>가 local Qwen fleet에 요청하고, 도구를 호출하며, 결과가 실제 업무 목표를 만족했는지 판정하는 시스템입니다. 단순 대화 데모가 아니라 routing, schema, timeout, retry, side effect와 실행 증거가 연결된 형태를 봅니다.</>}
          familiarScene={<>콜센터를 떠올리면 쉽습니다. Qwen은 다음 답이나 행동을 제안하는 상담원, vLLM은 통화 회선, PydanticAI는 상담 양식과 업무 진행 절차입니다. Fleet manifest는 어떤 상담원이 어떤 업무 시험을 통과했는지 적은 배정표이고, application policy는 환불이나 파일 변경이 정말 끝났는지 확인하는 관리자입니다.</>}
          steps={[
            { label: '모델을 연결합니다', detail: 'OpenAI-compatible endpoint 뒤의 Qwen을 PydanticAI model interface에 맞춥니다.' },
            { label: '행동을 제한합니다', detail: '검증된 capability, typed tool, request·tool·time budget 안에서만 실행합니다.' },
            { label: '업무 결과를 판정합니다', detail: '답변 종료가 아니라 acceptance와 실제 side effect evidence로 성공을 정합니다.' },
          ]}
        />
        <QuestionLead
          question="Qwen이 답을 끝냈고 agent loop도 종료됐다면 업무가 성공한 것 아닌가요?"
          answer="아닙니다. 모델 응답 종료, runtime 종료, 외부 효과 반영, 원래 목표 충족은 서로 다른 사건입니다. 무한 반복을 limit으로 끊은 실행은 bounded failure일 수는 있어도 성공은 아닙니다. 이 구현은 종료 코드, 단계 실패, 실제 도구 결과와 acceptance를 분리해 그 차이를 보존합니다."
        />
        <ConceptPrimer items={[
          { term: 'Qwen3.6', meaning: '다음 token, 답변 또는 tool call을 제안하는 local model입니다.', why: '모델은 제안자이지 권한 집행자나 업무 완료 판정자가 아닙니다.' },
          { term: 'vLLM gateway', meaning: 'Qwen을 OpenAI-compatible HTTP API로 제공하고 tool parser와 guided decoding 같은 serving 기능을 노출합니다.', why: '모델 자체 능력과 실제 endpoint가 운반할 수 있는 request shape를 분리합니다.' },
          { term: 'PydanticAI', meaning: 'Python type을 이용해 model input, tool argument, structured output과 agent loop를 구성하는 framework입니다.', why: '자유로운 문장을 프로그램이 검증할 수 있는 계약으로 바꿉니다.' },
          { term: 'Fleet manifest', meaning: '배포된 model, 비용 순위, context와 검증된 capability를 기록한 현재 배정표입니다.', why: 'agent 코드가 특정 model URL에 굳어지지 않게 합니다.' },
          { term: 'Acceptance', meaning: '원래 요청의 결과·금지 효과·산출물이 모두 조건을 만족하는지 확인하는 판정입니다.', why: 'loop가 멈춘 것과 문제가 해결된 것을 분리합니다.' },
        ]} />
        <SnapshotBand />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현재 구현의 중심 모델 ID는 <code>qwen36-27b-fp8</code>이고, local serving contract에는
            65,536 token context로 기록되어 있습니다. Qwen 공식 모델 소개의 최대 context와 local 배포가
            실제로 허용하는 길이는 같은 값이 아닐 수 있습니다. 따라서 application은 model card 숫자가 아니라
            현재 fleet manifest의 <em>served context</em>를 사용합니다.
          </p>
          <p>
            더 중요한 점은 모든 요청을 27B에 고정하지 않았다는 것입니다. 4B·9B·27B가 섞인 fleet에서
            각 요청이 요구하는 capability를 만족하는 가장 낮은 비용 순위의 모델을 선택하고, 더 작은 모델이
            해당 시험을 통과하지 못한 업무에만 27B를 사용합니다. 여기서 rank는 품질 점수가 아니라 운영 비용
            순서입니다.
          </p>
        </div>
        <Misconception>
          “Qwen3.6 agent를 만들었다”는 말을 “27B 모델이 모든 계획과 실행을 혼자 맡는다”로 이해하면 안 됩니다.
          실제 시스템의 전문성은 모델 이름보다 model·serving·framework·tool·policy 사이의 책임을 나눈 데 있습니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="responsibility-stack"
        marker="02"
        tone="blue"
        question="한 요청이 지나가는 다섯 층은 각각 무엇을 보장할까요?"
        title="모델, 서빙, framework와 application 책임을 겹치지 않게 나눕니다"
      >
        <RuntimeRequestPath stages={[
          { label: '업무 요청', owner: 'CLI·application profile', evidence: 'goal, workspace, permission, pinned value' },
          { label: 'Capability route', owner: 'ojs model edge', evidence: 'requested capability, profile, manifest digest' },
          { label: 'Typed agent loop', owner: 'PydanticAI·pydantic_graph', evidence: 'model turn, tool call, validation error, usage' },
          { label: 'Local inference', owner: 'vLLM + Qwen fleet', evidence: 'actual model, finish reason, latency, token usage' },
          { label: 'Effect와 판정', owner: 'tool·application policy', evidence: 'ToolResult, artifact, state observation, exit code' },
        ]} />
        <ComparisonTable
          headers={['층', '맡는 일', '맡지 않는 일', '확인할 증거']}
          rows={[
            ['Qwen3.6', '문맥에서 다음 text·tool proposal 생성', '도구 권한 집행과 실제 성공 판정', 'response model·finish reason·usage'],
            ['vLLM serving', 'model load, batching, OpenAI-compatible wire, parser·guided decoding', '업무 capability 인증', 'server flags·served model·HTTP response'],
            ['PydanticAI', 'typed tool schema, output validation, turn 진행, usage 수집', '회사별 위험 정책과 외부 상태 의미', 'message history·validation·tool call trace'],
            ['ojs routing·adapter', 'single system adaptation, capability floor, profile knob, timeout·recovery', '도구가 만든 효과의 진실', 'fleet digest·route decision·provider metadata'],
            ['Application tool·policy', 'workspace, allowlist, side effect, acceptance, undo', '다음 token 선택', 'ToolResult·journal·output hash·exit code'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 HTTP 200은 회선이 응답했다는 뜻입니다. Pydantic schema validation 통과는 결과 형식이
            맞다는 뜻이고, tool result의 <code>failed=false</code>는 도구가 자체 계약상 성공했다는 뜻입니다.
            그러나 “계약서의 이율을 6%에서 8%로 바꾸고 지정 이름으로 저장”이라는 목표의 성공은 새 파일 존재,
            정확한 값, 파일명, 원본 보존을 함께 검사해야 합니다. 각 층의 성공 신호를 하나로 접으면 운영 보고가
            낙관적으로 왜곡됩니다.
          </p>
          <p>
            Framework 선택 기준부터 더 깊게 보려면
            {' '}<InternalLink slug="agent-frameworks" learningPathId="ai-agent-runtime-cases">Agent Frameworks의 runtime 소유권</InternalLink>을,
            serving 계층의 실제 옵션은
            {' '}<InternalLink slug="vllm-production-agent-serving" learningPathId="ai-llm-serving-engine">vLLM agent serving</InternalLink>을 먼저 읽으면 연결이 쉽습니다.
          </p>
        </div>
        <StopRule>
          모델이 tool call JSON을 만들 수 있다는 사실과 현재 vLLM endpoint가 그 형식을 parsing하도록 기동됐다는
          사실은 다릅니다. 이 구현은 model capability뿐 아니라 path와 deployed modality를 wire 요청 전에 함께 확인합니다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="model-adapter"
        marker="03"
        tone="violet"
        question="OpenAI-compatible이면 그대로 연결해도 될까요?"
        title="호환 API의 미세한 차이를 model edge에서 흡수합니다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Single system message</h3>
          <p>
            PydanticAI는 여러 source에서 system instruction part를 만들 수 있지만 현재 Qwen chat template은 선두
            system message 하나를 전제로 합니다. <code>SingleSystemChatModel</code>은 선두 instruction part를 하나로
            합친 뒤 <code>OpenAIChatModel</code>과 custom <code>OpenAIProvider(base_url=...)</code>에 전달합니다. 이
            변환을 agent마다 복사하지 않고 model boundary 하나에 둬야 모든 unary agent와 tool loop가 같은 wire
            contract를 사용합니다.
          </p>
          <h3>Structured output mode</h3>
          <p>
            PydanticAI는 schema를 tool처럼 전달하는 Tool Output, provider의 native JSON schema 기능을 쓰는 Native
            Output, instruction에 schema를 넣는 Prompted Output을 제공합니다. 이 구현의 <code>for_route()</code>는
            취향으로 하나를 고르지 않습니다. 경로가 <code>response_format</code>과 guided decoding을 보존하면 Native,
            그렇지 않으면 Prompted를 선택합니다. 단순 구조화 결과를 받으려고 tool round trip을 한 번 더 만드는
            Tool Output은 사용하지 않습니다.
          </p>
        </div>
        <CodeBlock title="Route가 운반할 수 있는 가장 강한 output mode를 선택" code={outputExample} />
        <ComparisonTable
          headers={['Mode', 'Schema가 놓이는 곳', '장점', '이 사례의 판단']}
          rows={[
            ['Tool Output', 'tools array와 tool call', 'provider 호환성이 넓고 validation retry 가능', '구조화 결과 하나에 tool turn을 추가하며 governed path와 충돌하므로 제외'],
            ['Native Output', 'response_format JSON schema', 'guided decoding이 잘못된 문법을 생성 단계에서 제한', 'path가 field를 실제 보존할 때 우선'],
            ['Prompted Output', 'system instruction의 schema text', '특수 serving 기능이 없어도 전송 가능', 'native field가 사라지는 path의 명시적 fallback'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Model card와 serving contract</h3>
          <p>
            Qwen3.6-27B 공식 소개는 모델 자체의 긴 context와 multimodal reasoning을 설명합니다. 하지만 FP8로 올린
            local endpoint의 context limit, image part 허용 여부, reasoning parser, tool parser는 기동 구성에 따라
            달라집니다. 현재 agent가 사용 가능한 값은 fleet의 65,536 token이고, 공식 최대치가 자동으로 local
            endpoint에 상속된다고 가정하지 않습니다.
          </p>
          <p>
            공식 문서가 agentic multi-turn에서 thinking 보존을 권장하더라도 local API의
            <code>enable_thinking</code>과 동일한 동작이라고 단정할 수 없습니다. 이전 reasoning을 어느 message field에
            넣고 다음 turn에 어떻게 되돌리는지는 별도 wire test로 확인해야 합니다.
          </p>
        </div>
        <Misconception>
          OpenAI-compatible은 endpoint 모양이 비슷하다는 뜻이지 모든 field, finish reason, reasoning trace와 tool
          parser 의미가 동일하다는 보증이 아닙니다. Adapter 뒤에서도 실제 response의 model identity를 확인합니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="capability-routing"
        marker="04"
        tone="amber"
        question="왜 agent 코드가 model ID 대신 capability를 요청할까요?"
        title="검증된 행동과 호출 조건을 함께 routing contract로 만듭니다"
      >
        <CodeBlock title="구현의 routing 의도" code={routeExample} />
        <ComparisonTable
          headers={['Manifest 정보', '뜻', '말할 수 없는 것', 'Routing 사용']}
          rows={[
            ['probed', 'text·vision·stream·reasoning separation·guided JSON·tool call 같은 request shape가 통과함', '복잡한 업무를 잘 해결함', 'endpoint·model modality를 wire 전에 거름'],
            ['capabilities', '고정 scenario를 특정 조건에서 통과한 행동 grant', '비슷한 모든 업무의 보편적 능력', '요청한 capability를 가진 후보만 남김'],
            ['capabilities_by_profile', 'temperature·max token·thinking 같은 invocation profile에 묶인 grant', '다른 sampling 설정에서 같은 결과', '해당 profile과 knob hash가 맞는 후보만 남김'],
            ['rank', '운영자가 정한 비용 순서', '절대 품질 점수나 benchmark 순위', '조건을 만족한 후보 중 가장 싼 모델 선택'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Capability는 이름표가 아니라 제한된 증거입니다</h3>
          <p>
            <code>agent.tool_select</code>를 한 번 통과했다고 세 번의 의존 tool call도 된다고 확대 해석하지 않습니다.
            Tool 결과를 다음 인자로 이어야 하면 <code>agent.tool_loop_chain3</code>처럼 더 어려운 capability를 요청합니다.
            Confusable tool 이름, untrusted tool output, recoverable error 같은 hazard도 명시적인 capability conjunction으로
            추가합니다. 모르는 hazard 이름은 추정하지 않고 거부합니다.
          </p>
          <h3>Invocation profile도 증거의 일부입니다</h3>
          <p>
            같은 model이라도 temperature 0의 최초 시도와 temperature 0.7의 수정 재시도는 다른 실험입니다. 현재
            구현은 deterministic, deliberate, retry 등의 profile과 <code>temperature</code>, <code>max_tokens</code>,
            thinking flag를 함께 기록합니다. 한 설정에서 받은 grant를 다른 설정의 호출에 붙이지 않습니다.
          </p>
          <h3>Direct와 governed path</h3>
          <p>
            Direct path는 선택한 model을 직접 부르고 tool·stream·image 같은 기능을 운반합니다. Governed path는
            <code>capability:</code> selector와 <code>required_capabilities</code>로 server-side floor를 강제하지만, 현재
            운반하지 못하는 request shape가 있습니다. 지원되지 않는 shape를 몰래 text completion으로 낮추지 않고
            요청 전에 거부합니다. Modality 조건을 selector로 정확히 표현할 수 없을 때는 model을 pin하고 그 사실을
            <code>floor_routed=false</code>로 남깁니다.
          </p>
        </div>
        <RuntimeEvidenceLedger rows={[
          { symptom: '작은 모델이 복잡한 chain을 맡아 답은 냈지만 값이 틀림', check: 'agent가 가장 쉬운 tool_select만 요청했는지, 실제 hazard conjunction이 빠졌는지', decision: '가장 어려운 실제 행동을 capability로 선언하고 재인증' },
          { symptom: 'thinking 요청의 독백이 최종 답에 섞임', check: 'model의 추론 가능 여부가 아니라 path의 separates_reasoning과 parser 설정', decision: '분리 가능한 route만 선택하고 없으면 wire 전에 거부' },
          { symptom: 'governed route가 예상과 다른 모델을 반환', check: 'selector·invocation profile·required capabilities와 response model', decision: 'actual model verification 실패로 처리하고 응답을 성공으로 소비하지 않음' },
        ]} />
        <StopRule title="Fail closed">
          Capability 후보가 없거나 path가 tool·image·stream·thinking을 운반하지 못하면 큰 모델로 눈먼 fallback을 하지
          않습니다. 거부는 기능 부족이 아니라 “검증하지 않은 실행을 성공처럼 보이지 않게 하는” 운영 정책입니다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="loop-designs"
        marker="05"
        tone="green"
        question="모든 작업을 하나의 자율 tool loop로 풀어야 할까요?"
        title="Typed unary, native loop와 staged graph를 업무 의존성에 맞춰 선택합니다"
      >
        <ComparisonTable
          headers={['실행 형태', '적합한 작업', '장점', '위험과 선택 기준']}
          rows={[
            ['Typed unary agent', '분류·추출·판정처럼 model 호출 한 번과 typed output으로 끝나는 일', '가장 짧고 실패 위치가 선명함', '도구 의존성이 없는데 loop를 만들지 않음'],
            ['Native PydanticAI tool loop', '모델이 다음 tool과 종료를 유연하게 골라도 되는 짧은 chain', 'Framework의 자연스러운 tool result 왕복을 활용', '상태·재시도 근거가 model context 안에 숨기 쉬움'],
            ['Staged pydantic_graph', '계획, 인자 추출, 관찰, 재계획과 단계별 증거가 필요한 업무', 'node·state lifetime과 전이를 코드에서 확인 가능', '노드와 schema가 늘므로 필요한 복잡성일 때만 사용'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>현재 staged loop의 다섯 논리 단계</h3>
          <ol>
            <li><strong>tool_abstain</strong>: 도구가 필요 없는 요청인지 먼저 판정합니다.</li>
            <li><strong>plan_decompose</strong>: 목표를 실행 가능한 step으로 나눕니다.</li>
            <li><strong>tool_select_or_none</strong>: 현재 step에 필요한 이름 붙은 tool 또는 종료를 고릅니다.</li>
            <li><strong>arg_extract</strong>: 선택된 tool schema에 맞춰 인자를 구조화합니다.</li>
            <li><strong>result_outcome</strong>: 실행 결과를 관찰하고 다음 step·재시도·종료를 판정합니다.</li>
          </ol>
          <p>
            Graph state에는 trace, call, fact, source material, failed step과 원래 계획을 둡니다. 한 번의 복구에만
            필요한 값은 node-local field로 제한합니다. 장기 state와 임시 retry state를 섞지 않으면 재개할 때
            무엇을 복원해야 하는지 명확해집니다.
          </p>
          <h3>Fact와 material을 따로 둡니다</h3>
          <p>
            “매출 합계는 120” 같은 fact만 보존하면 다음 tool이 원문 표의 행을 필요로 할 때 값을 재구성할 수 없습니다.
            반대로 모든 원문을 매 turn에 넣으면 context가 빠르게 커집니다. 이 구현은 요약 fact와 다음 단계가 실제로
            참조할 source material을 분리하고, material이 현재 상한을 넘으면 조용히 자르지 않고 거부합니다.
          </p>
          <h3>호출자가 아는 값은 schema에서 뺍니다</h3>
          <p>
            사용자가 정확한 출력 파일명을 지정했다면 model에게 다시 생성하게 하지 않습니다. Pinned value는 model이
            채우는 argument schema에서 제거한 뒤 application이 주입합니다. 사후에 잘못된 이름을 덮어쓰는 방식보다
            model이 변형할 기회 자체를 없애는 편이 계약에 가깝습니다.
          </p>
        </div>
        <Misconception>
          Graph를 썼다는 사실만으로 durable execution이 생기지는 않습니다. 이 사례의 staged graph는 상태와 전이를
          명시하지만, process를 넘는 checkpoint 저장·중복 효과 방지·외부 transaction 복구는 별도 application 계약입니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="tools-safety"
        marker="06"
        tone="teal"
        question="Model이 올바른 tool을 골라도 왜 실제 실행은 위험할까요?"
        title="도구 이름, 인자, 권한과 side effect 결과를 각각 검증합니다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>문자열 명령보다 이름 붙은 조작</h3>
          <p>
            운영 수리에서 <code>execute_approved_change(commands=[...])</code> 같은 범용 shell 도구를 주지 않습니다.
            <code>make_executable</code>, <code>restart_unit</code>처럼 허용 의미가 코드에 박힌 조작만 노출합니다. 모델은
            어떤 조작이 필요한지 제안하지만, 허용 path·unit·변경 스위치는 application이 검사합니다.
          </p>
          <h3>ToolResult가 재시도 가능성을 말합니다</h3>
          <p>
            도구 결과는 text 하나가 아니라 <code>failed</code>, <code>argument_error</code>,
            <code>side_effect_uncertain</code>를 함께 운반합니다. 인자 오류라면 고쳐 다시 시도할 수 있지만, timeout 뒤
            변경이 반영됐는지 모르면 같은 쓰기 호출을 반복해서는 안 됩니다. 먼저 외부 상태를 reconcile하거나 사람이
            판단해야 합니다.
          </p>
          <h3>Hazard는 prompt에서 추측하지 않습니다</h3>
          <p>
            비슷한 tool 이름, 외부 문서의 prompt injection, 여러 hop의 인자 연결, recoverable error처럼 loop를 어렵게
            만드는 조건을 명시적으로 선언합니다. Tool description의 자연어만 보고 “이 정도는 안전하다”고 분류하면
            거짓 문서가 정책을 뒤집을 수 있습니다. 정적 allowlist와 code-level permission이 description보다 우선합니다.
          </p>
        </div>
        <ComparisonTable
          headers={['결과 상태', '안전한 다음 행동', '하면 안 되는 행동']}
          rows={[
            ['argument_error=true', 'schema·오류 메시지를 근거로 인자를 한 번 수정', '같은 인자를 그대로 무한 반복'],
            ['failed=true, side effect 없음', '실패 원인을 분류하고 budget 안에서 재계획', '실패한 tool result를 fact로 채택'],
            ['side_effect_uncertain=true', '대상 시스템을 읽어 실제 상태 reconcile', '쓰기 요청을 즉시 재전송'],
            ['success + artifact', '파일·상태·hash를 acceptance와 대조', '도구가 success라 했다는 이유만으로 전체 업무 성공 처리'],
          ]}
        />
        <Takeaway>
          Agent 안전성은 “모델에게 조심하라고 말함”이 아니라 모델이 바꿀 수 없는 권한 경계, typed argument,
          실행 전 journal, 실행 후 observation과 retry 금지 조건으로 구성됩니다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="bounds-recovery"
        marker="07"
        tone="blue"
        question="무한 반복을 끊으면서도 원래 문제를 끝까지 해결하려면 무엇을 나눠야 할까요?"
        title="정지, 복구와 업무 성공을 독립된 상태로 다룹니다"
      >
        <CodeBlock title="현재 코드 스냅샷의 독립 budget" code={boundedLoopExample} />
        <ComparisonTable
          headers={['경계', '잡는 실패', '한계에 닿았을 때 의미', '후속 처리']}
          rows={[
            ['max_tokens', '한 model turn의 끝없는 생성', '답변이 잘린 generation failure', 'finish reason을 보고 원 요청을 새로 복구'],
            ['model timeout', '응답이 끝나지 않거나 stream이 멎음', '전송·생성 결과 불명', '외부 효과 전이라면 fresh retry 후보'],
            ['request_limit', 'model↔tool turn 반복', 'bounded loop failure', 'trace로 반복 원인을 고치고 acceptance는 실패'],
            ['tool_calls_limit', '유효한 tool을 계속 호출하는 runaway', '업무 미완료', '중복 호출과 tool outcome을 조사'],
            ['tool timeout', '외부 command·API 대기', 'side effect가 불확실할 수 있음', '읽기 기반 reconciliation 후 재시도 결정'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Finish reason을 성공 판정에 포함합니다</h3>
          <p>
            응답 text가 존재해도 <code>finish_reason=length</code> 또는 종료 이유가 없으면 완결된 답으로 소비하지 않습니다.
            Whole-call timeout에는 stream 소비 시간도 포함합니다. 첫 호출이 외부 효과를 만들기 전 실패했다면 원래 요청을
            새 context로 한 번 재시도하고, 버린 호출의 token과 wire request도 provider metadata에 기록합니다.
          </p>
          <h3>Streaming recovery는 transaction처럼 다룹니다</h3>
          <p>
            일반 streaming은 이미 사용자에게 내보낸 실패 prefix를 되돌릴 수 없습니다. 그래서 복구 가능 경로에서는
            첫 시도의 chunk를 임시 buffer에 모으고 완료가 확인된 뒤 commit하는 transactional mode를 둡니다. 낮은
            첫-token latency와 실패 prefix 비노출은 동시에 공짜로 얻을 수 없으므로 caller가 trade-off를 선택합니다.
          </p>
          <h3>네 가지 완료 상태</h3>
          <p>
            실행은 <strong>completed</strong>, <strong>bounded failure</strong>, <strong>refused</strong>,
            <strong>not applicable</strong>로 구분합니다. CLI는 정상 0, 일부 단계가 실패했지만 그 실패 없이 답을 만든
            partial 1, 시작 전 거부 2, 답이 없는 crash 3으로 기계가 읽을 수 있게 냅니다. Process가 다시 올라왔다는
            사실은 recovery evidence이고, 원래 업무가 completed라는 증거는 아닙니다.
          </p>
        </div>
        <RuntimeEvidenceLedger rows={[
          { symptom: '같은 reasoning 또는 tool call이 계속 반복됨', check: 'finish reason, request·tool count, 동일 input과 invocation profile, 마지막으로 달라진 observation', decision: 'limit으로 bounded failure를 만들고 retry profile 또는 loop state 설계를 수정' },
          { symptom: '서버 재기동 뒤 답변은 돌아왔지만 파일이 없음', check: 'model recovery가 아니라 output artifact와 original acceptance', decision: '업무 실패로 유지하고 안전한 step부터 재개' },
          { symptom: '쓰기 tool timeout 뒤 재시도하면 가끔 중복 변경', check: 'side_effect_uncertain와 외부 시스템의 현재 revision·idempotency key', decision: 'blind retry 금지, 먼저 reconcile' },
          { symptom: '긴 작업이 limit에 자주 걸림', check: '정상 task의 call distribution과 runaway trace를 같은 값으로 섞었는지', decision: 'limit만 늘리지 말고 단계 분해·관찰 품질·acceptance를 함께 재측정' },
        ]} />
        <StopRule title="중요한 성공 조건">
          Watchdog 없이 process 안에서 반복을 제한하는 것은 필요하지만 충분하지 않습니다. 원래 자동화가 끝나려면
          실패한 turn을 복구하고 남은 step을 실행한 뒤, 산출물과 금지 효과를 acceptance가 통과해야 합니다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="evaluation-handoff"
        marker="08"
        tone="violet"
        question="현재 글과 후속 결함·측정 보고서는 무엇을 각각 소유할까요?"
        title="구현 설명과 평가 결론을 분리해 나중에도 다시 검증할 수 있게 합니다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글이 확정하는 것은 현재 코드의 구조와 의도입니다. 어떤 adapter·route·loop·limit·outcome contract가
            존재하는지, 왜 그 경계를 택했는지를 설명합니다. 반면 “무한 반복이 몇 회 중 몇 회 발생하지 않았다”,
            “27B가 어떤 case를 몇 % 통과했다”, “수정 후 latency가 얼마나 변했다”는 실행 환경과 commit에 종속된
            평가 결과입니다.
          </p>
          <p>
            다른 Codex 세션에서 진행 중인 결함 분석과 측정이 끝나면, 그 결과는 독립된 포트폴리오용 평가 문서에
            기록합니다. 이 글은 아직 확정되지 않은 숫자를 미리 채우지 않습니다. 평가 문서는 아래 envelope를 채우고,
            이 글에서는 해당 문서와 snapshot을 연결하는 방식으로 합칩니다.
          </p>
        </div>
        <CodeBlock title="후속 평가 문서가 채워야 할 최소 record" code={evaluationEnvelope} />
        <ComparisonTable
          headers={['현재 이 글이 말하는 것', '후속 평가 문서가 말할 것', '합칠 때 지킬 조건']}
          rows={[
            ['현재 source의 architecture와 safety contract', '실제 case별 pass·fail과 열린 결함', '같은 git SHA·fleet digest를 명시'],
            ['왜 capability·profile·output mode를 분리했는지', '각 조합의 trial 수·분산·failure owner', 'n=1을 일반 결론처럼 쓰지 않음'],
            ['limit과 recovery가 의도하는 상태 전이', '강제 반복·정상 장기 작업·side effect test 결과', '중단을 성공으로 세지 않고 acceptance를 별도 계산'],
            ['수집해야 할 trace와 artifact', 'latency·token·wire call·실제 output hash', '평균만이 아니라 원시 receipt 위치를 남김'],
          ]}
        />
        <CapabilityCheck title="평가 결과를 합치기 전 확인할 수 있어야 합니다" items={[
          '어느 commit과 fleet manifest를 실행했는지 말할 수 있습니다.',
          'Model 품질 실패와 serving·adapter·tool 실패를 분리할 수 있습니다.',
          'Baseline과 candidate가 같은 case와 acceptance를 썼는지 확인할 수 있습니다.',
          'Loop 종료율이 아니라 실제 task acceptance를 최종 지표로 읽을 수 있습니다.',
          '실패한 side effect가 재시도 가능한지 trace에서 판정할 수 있습니다.',
          '표의 숫자에서 원시 log·artifact receipt로 내려갈 수 있습니다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Trace 기반 평가 설계는
            {' '}<InternalLink slug="agent-evaluation-trace" learningPathId="ai-agent-system-core">Agent Evaluation과 실행 추적</InternalLink>에서
            case, judge와 failure owner를 더 자세히 다룹니다. 이 사례의 후속 보고서도 같은 원칙으로 baseline과
            candidate를 paired rerun해야 합니다.
          </p>
        </div>
      </NlpSection>

      <NlpSection
        id="interview-portfolio"
        marker="09"
        tone="green"
        question="면접에서 ‘PydanticAI로 Qwen agent를 만들었다’를 어떻게 전문가답게 설명할까요?"
        title="기술 이름보다 문제, 경계, 실패와 증거의 순서로 답합니다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>90초 답변 골격</h3>
          <blockquote>
            Local Qwen fleet를 PydanticAI에 연결해 문서 처리와 운영 진단 agent를 만들었습니다. 단순히 OpenAI-compatible
            URL을 붙인 것이 아니라, Qwen chat template의 single-system 제약을 model adapter에서 흡수하고, endpoint가
            지원하는 기능에 따라 NativeOutput과 PromptedOutput을 선택했습니다. Agent 코드는 model ID가 아니라 검증된
            capability와 invocation profile을 요청하며, fleet가 조건을 만족하는 가장 낮은 비용 모델을 고릅니다.
            짧은 작업은 typed agent, 유연한 chain은 bounded native tool loop, 단계별 증거가 필요한 작업은
            pydantic_graph 기반 staged loop로 분리했습니다. Request·tool·timeout 제한은 runaway를 bounded failure로
            만들 뿐 성공으로 보지 않고, ToolResult와 artifact acceptance로 실제 완료를 판정했습니다. 최종 성능 주장은
            commit·manifest·case·trial을 고정한 평가 보고서의 측정값으로 제시합니다.
          </blockquote>
          <h3>이어질 질문과 답의 핵심</h3>
          <h4>왜 PydanticAI였나요?</h4>
          <p>
            Python type을 tool argument와 output validation에 그대로 연결하고, model provider를 교체하면서도 agent contract를
            유지할 수 있었기 때문입니다. 다만 framework가 permission·idempotency·업무 acceptance까지 주는 것은 아니므로
            그 책임은 application layer에 남겼다고 답합니다.
          </p>
          <h4>왜 27B에 모든 요청을 보내지 않았나요?</h4>
          <p>
            모델 크기는 필요조건이 아니라 비용 변수입니다. 고정 scenario와 invocation setting에서 얻은 capability grant로
            후보를 좁힌 뒤 가장 싼 모델을 고르고, 작은 모델이 통과하지 못한 chain·hazard·reasoning 작업만 escalation합니다.
            실제 응답 model도 검증해 control plane의 잘못된 route를 탐지합니다.
          </p>
          <h4>무한 loop는 어떻게 해결했나요?</h4>
          <p>
            Model token cap, whole-call timeout, PydanticAI request·tool-call limit, tool timeout을 독립적으로 걸었습니다. 같은
            입력을 temperature 0으로 다시 부르는 fixed point는 별도 retry profile의 문제로 취급합니다. Limit 도달은
            bounded failure로 기록하고, fresh retry나 staged recovery 뒤 원래 task acceptance를 다시 통과해야 성공입니다.
          </p>
          <h4>가장 중요한 실무 교훈은 무엇인가요?</h4>
          <p>
            “모델이 할 수 있음”, “serving path가 그 형식을 운반함”, “framework가 형식을 검증함”, “도구가 실제 효과를 냄”,
            “업무 목표가 충족됨”을 한 success flag로 합치지 않은 것입니다. 이 구분 덕분에 결함의 owner와 다음 실험을
            정할 수 있었습니다.
          </p>
          <h3>포트폴리오에 넣을 때</h3>
          <p>
            Architecture diagram 옆에는 model 이름보다 책임 경계를 쓰고, decision 항목에는 rejected alternative와 이유를
            적습니다. Result 표에는 예쁜 평균 하나보다 trial 수, baseline, acceptance, forbidden effect, 실패 taxonomy와
            artifact link를 둡니다. 아직 측정 중인 수치는 “검증 완료”로 쓰지 않고 pending으로 남기는 편이 신뢰를 높입니다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Qwen·vLLM·PydanticAI·application의 책임을 한 문장씩 분리해 설명할 수 있습니다.',
          'Model card context와 local served context가 왜 다른지 설명할 수 있습니다.',
          'Probed modality와 behavior capability grant의 차이를 설명할 수 있습니다.',
          'Native loop와 staged graph를 어떤 업무에서 고르는지 설명할 수 있습니다.',
          'Timeout·limit·restart가 task success가 아닌 이유를 설명할 수 있습니다.',
          '후속 평가표에서 snapshot·trial·acceptance·failure owner를 확인할 수 있습니다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ojs-agents source', href: 'https://github.com/dik654/ojs-agents', note: '이 글의 adapter, fleet routing, staged loop, tool safety와 CLI outcome contract의 구현 근거입니다.' },
          { label: 'PydanticAI Agents', href: 'https://pydantic.dev/docs/ai/core-concepts/agent/', note: 'Agent 실행과 UsageLimits의 공식 계약입니다.' },
          { label: 'PydanticAI Outputs', href: 'https://pydantic.dev/docs/ai/core-concepts/output/', note: 'Tool, Native, Prompted structured output mode의 공식 설명입니다.' },
          { label: 'Pydantic Graph', href: 'https://pydantic.dev/docs/ai/graph/graph/', note: 'Typed node와 graph state를 이용한 실행 모델의 공식 문서입니다.' },
          { label: 'PydanticAI OpenAI-compatible models', href: 'https://pydantic.dev/docs/ai/models/openai/', note: 'Custom OpenAI provider와 호환 endpoint 연결의 공식 기준입니다.' },
          { label: 'Qwen3.6-27B', href: 'https://qwen.ai/blog?id=qwen3.6-27b', note: '모델 자체의 dense 27B, multimodal reasoning과 공식 context 설명입니다. Local serving 값과 구분해 읽습니다.' },
          { label: 'vLLM Tool Calling', href: 'https://docs.vllm.ai/en/latest/features/tool_calling/', note: 'Tool parser와 automatic calling이 serving 설정이라는 점을 확인하는 공식 문서입니다.' },
        ]} />
        <Takeaway>
          이 사례에서 PydanticAI는 typed runtime, Qwen3.6은 행동 제안 모델, vLLM은 serving plane입니다.
          실제 agent 시스템은 capability routing, 안전한 tool effect, bounded recovery와 acceptance evidence가 이 셋을
          연결할 때 완성됩니다.
        </Takeaway>
      </NlpSection>
    </>
  );
}
