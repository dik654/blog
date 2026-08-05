import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection } from './nlp-shared';
import FormulaPair from './practical-training/FormulaPair';
import {
  AgentSplitGateLab,
  AgentTraceEvalLab,
  ExecutionSafetyLab,
  ReducerTraceLab,
} from './practical-llm/viz/AdaptationAgentDecisionLabs';

const remoteTaskEnvelope = `type RemoteAgentTask = {
  taskId: string;
  goal: string;
  successPredicates: Predicate[];
  inputArtifacts: ArtifactRef[];
  allowedModalities: ("text" | "file" | "structured-data")[];
  delegatedGrants: CapabilityGrantRef[];
  forbiddenEffects: EffectRule[];
  deadline: string;
  budget: { turns: number; costUsd: number };
  expectedOutput: OutputSchemaRef;
  verifier: VerifierRef;
};

type RemoteTaskResult = {
  taskId: string;
  status: "completed" | "failed" | "canceled";
  artifacts: ArtifactRef[];       // URI + hash + provenance
  claims: ClaimRef[];
  receipts: EffectReceipt[];
  unresolved: string[];
};`;

export default function MultiAgentImplementationArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="split-gate"
        marker="00"
        tone="blue"
        question="Agent를 여러 명으로 나누면 언제 실제로 더 좋아질까?"
        title="역할극보다 단일 에이전트 기준선과 작업 그래프가 먼저다"
      >
        <QuestionLead
          question="검색, 분석, 검토 역할을 세 agent에게 주면 한 agent보다 자동으로 정확해질까?"
          answer="아니다. 순차 의존성이 강하면 같은 context를 세 번 전달하고 오류를 handoff할 뿐이다. 독립적으로 병렬화할 수 있고 context를 격리할 수 있으며 같은 budget의 기준선보다 측정 이득이 있을 때만 분리가 정당화된다."
        />
        <ConceptPrimer items={[
          { term: 'Agent', meaning: 'Model이 state를 읽고 다음 action·tool·handoff를 선택하는 runtime unit', why: 'Persona 문구가 아니라 입력·출력·권한·종료 계약으로 구현한다.' },
          { term: 'Workflow', meaning: '순서와 조건이 코드로 고정된 deterministic 실행 경로', why: '불확실한 routing이 필요 없는 단계는 agent보다 싸고 검증하기 쉽다.' },
          { term: 'Handoff', meaning: '한 실행 unit이 다른 unit에 typed task와 state 일부를 넘기는 경계', why: '누가 무엇을 소유하고 언제 완료했는지 추적한다.' },
          { term: 'Shared state', meaning: 'Node 사이에 전달되는 typed facts, evidence, budget와 status', why: '대화 transcript가 아니라 복구·평가 가능한 실행 계약이 된다.' },
          { term: 'Termination', meaning: 'Success, failure, budget, recursion과 no-progress로 실행을 끝내는 규칙', why: 'LLM의 “충분하다” 판단만으로 무한 loop와 runaway cost를 막을 수 없다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 한 agent에 같은 model·tool·prompt budget을 주고 end-to-end success, latency,
            token·tool cost, safety violation과 실패 유형을 측정한다. 다음 비교군은 routing을
            코드로 고정한 workflow다. 이 둘보다 manager-worker 또는 peer graph가 개선해야
            “멀티 에이전트라서 좋아졌다”는 claim을 할 수 있다.
          </p>
          <p>
            분리가 유리한 대표 구조는 서로 다른 source를 동시에 탐색하거나 서로 격리된 긴 context를
            처리한 뒤 typed result만 합치는 경우다. Anthropic의 research system 글도
            orchestrator-worker 병렬 탐색이라는 특정 research workload의 engineering evidence다.
            모든 task에서 agent 수를 늘리라는 보편 법칙은 아니다.
          </p>
        </div>
        <AgentSplitGateLab />
        <StopRule>
          “연구자·분석가·검토자” 같은 역할 이름만 있고 각자의 input schema, tool allowlist,
          output schema, owner metric과 stop condition이 없으면 아직 architecture가 아니다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="state-reducers"
        marker="01"
        tone="violet"
        question="여러 node가 같은 state를 바꾸면 어떤 값이 남을까?"
        title="State field마다 owner·reducer·commit 의미를 정의한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            State를 하나의 거대한 conversation list로 시작하지 않는다. <code>request</code>,
            <code>plan</code>, <code>evidence</code>, <code>draft</code>, <code>risk</code>,
            <code>budget</code>, <code>status</code>처럼 실행 의미가 다른 field를 분리한다.
            각 field에는 writer, validation, reducer, size limit와 redaction policy가 필요하다.
          </p>
          <p>
            LangGraph의 state update는 기본적으로 key 값을 덮어쓴다. List라고 자동으로 append되지
            않는다. 여러 worker의 evidence를 누적하려면 <code>Annotated</code> reducer를
            명시한다. Message에는 단순 <code>operator.add</code>보다 message ID를 이해하는
            <code>add_messages</code>가 필요한 경우가 있다. 반대로 status나 final answer는
            여러 writer가 동시에 쓰지 않도록 단일 owner를 두는 편이 안전하다.
          </p>
          <p>
            Reducer는 merge 정책이지 사실 검증기가 아니다. 두 worker가 같은 출처를 다른 결론으로
            해석하면 append는 모순을 보존할 뿐이다. Evidence ID, source, retrieval time,
            claim, confidence와 conflict status를 typed item으로 만들고 별도 reconcile node가
            충돌을 처리한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\underbrace{s_{t+1}[k]}_{\text{다음 state의 key}}
          =\underbrace{R_k}_{\text{key별 reducer}}
          \left(\underbrace{s_t[k]}_{\text{기존 값}},
          \underbrace{u_t[k]}_{\text{node update}}\right)`}
          meaning="Node가 state 전체를 교체하는 것이 아니라 key별 update를 내고, runtime이 해당 key의 reducer로 기존 값과 합친다. Reducer가 없으면 overwrite semantics를 명시적으로 예상한다."
          symbols={[
            [String.raw`s_t[k]`, '실행 시점 t에서 key k가 가진 기존 값'],
            [String.raw`u_t[k]`, '현재 node가 반환한 부분 update'],
            [String.raw`R_k`, 'Overwrite, append, message merge 등 key별 결합 규칙'],
            [String.raw`s_{t+1}[k]`, 'Validation과 reducer 뒤 checkpoint에 commit할 값'],
          ]}
        />
        <ReducerTraceLab />
        <div className="not-prose my-6 overflow-hidden rounded-md border border-border">
          <div className="border-b border-border bg-muted/20 px-4 py-2 text-xs font-semibold text-muted-foreground">
            Reducer를 schema에 보이게 만드는 최소 형태
          </div>
          <pre className="max-w-full overflow-x-auto p-4 text-xs leading-relaxed"><code>{`from operator import add
from typing import Annotated
from typing_extensions import TypedDict

class Evidence(TypedDict):
    source_id: str
    claim: str

class State(TypedDict):
    request: str                 # 새 update가 이전 값을 대체
    evidence: Annotated[list[Evidence], add]
    status: str                  # coordinator 한 명만 기록
    remaining_steps: int`}</code></pre>
        </div>
      </NlpSection>

      <NlpSection
        id="routing-termination"
        marker="02"
        tone="teal"
        question="Router가 다음 agent를 계속 고르게 두면 언제 끝날까?"
        title="Routing과 종료를 model 판단 밖의 명시적 계약으로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Node는 state를 읽고 partial update를 반환하며, edge나 <code>Command</code>가 다음
            node를 고른다. Routing result는 자유 문장이 아니라 허용된 node ID, 이유,
            expected input, budget charge와 correlation ID를 가진 typed decision이어야 한다.
            Tool이 state update와 route를 함께 반환할 때 static edge까지 중복 실행되지 않는지
            graph contract를 확인한다.
          </p>
          <p>
            Business 종료는 네 갈래다. Required evidence와 validator를 통과한 success, recover할 수
            없는 failure, step·token·time·cost budget 소진, 같은 state가 반복되는 no-progress다.
            Graph recursion 한계는 이 네 조건이 잘못 닫혔을 때 runaway loop를 끊는 별도 runtime
            안전망이지 business completion rule이 아니다. Limit에 닿기 전에 왜 진전이 없었는지 trace에 남겨야 한다.
          </p>
          <p>
            Manager가 모든 worker output을 다시 읽으면 fan-out은 병렬이어도 fan-in이 context와
            latency 병목이 된다. Worker가 full transcript 대신 task packet과 typed result만
            받고, deterministic reducer가 합칠 수 있는 field는 model manager를 거치지 않는다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
          \underbrace{\mathrm{stop}(s_t)}_{\text{실행 종료}}
          &=\underbrace{\mathrm{success}(s_t)}_{\text{품질 계약 통과}}
          \lor\underbrace{\mathrm{fatal}(s_t)}_{\text{복구 불가}}\\
          &\quad\lor\underbrace{(b_t\le 0)}_{\text{예산 소진}}
          \lor\underbrace{\mathrm{stalled}(s_t)}_{\text{진전 없음}}
          \end{aligned}`}
          meaning="종료는 model의 자연어 자신감 하나가 아니라 검증 가능한 success·failure·budget·no-progress predicate의 합이다. Runtime recursion limit은 이 계약 밖의 최종 guardrail로 둔다."
          symbols={[
            [String.raw`s_t`, '현재 checkpoint의 typed execution state'],
            [String.raw`b_t`, '남은 step·token·time·cost budget 묶음'],
            [String.raw`\mathrm{success}`, '필수 evidence, schema와 quality gate 통과'],
            [String.raw`\mathrm{stalled}`, 'State digest나 primary metric이 정한 window 동안 개선되지 않음'],
          ]}
        />
        <Misconception>
          “Critic이 만족할 때까지 반복”은 종료 조건이 아니다. Critic도 같은 model family와 context
          편향을 공유할 수 있다. 최대 시도, 개선량, 독립 validator와 failure status를 코드로 둔다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="a2a-handoff"
        marker="03"
        tone="blue"
        question="상대 agent의 내부 tool과 memory가 보이지 않을 때 무엇을 계약할까?"
        title="원격 agent에는 persona가 아니라 bounded task와 artifact를 넘긴다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 graph process 안의 node와 네트워크 너머의 독립 agent application은 다르다.
            원격 agent는 자체 model, memory, tool, policy와 배포 주기를 가질 수 있다. Client가
            내부 reasoning을 통제할 수 없으므로 “당신은 보안 전문가다” 같은 역할 prompt보다
            task ID, 성공 predicate, 입력 artifact, 출력 schema, deadline, budget과 금지 effect를
            task envelope로 고정해야 한다.
          </p>
          <p>
            A2A 1.0의 signed Agent Card는 상대 identity, capability와 input·output modality를 발견하는
            시작점이다. 발견했다고 곧 신뢰하는 것은 아니다. Signature와 allowlist를 확인하고,
            지원 version과 HTTP·gRPC·JSON-RPC binding을 협상한 뒤 필요한 grant만 준다. Remote task가 <code>input-required</code>로
            멈추면 사람이 전체 대화를 다시 읽게 하지 않고, 어떤 field와 근거가 부족한지
            structured request로 돌려받는다.
          </p>
        </div>
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-6 sm:text-sm"><code>{remoteTaskEnvelope}</code></pre>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          {[
            ['01', 'Discover', 'Signed Agent Card의 capability·modality·identity를 확인한다.', '이름이 같은 agent를 곧 신뢰하거나 지원하지 않는 output을 요구하지 않는다.'],
            ['02', 'Negotiate', '공통 protocol version과 HTTP·gRPC·JSON-RPC binding을 고른다.', '상대가 선언하지 않은 version·binding을 추측하지 않는다.'],
            ['03', 'SendMessage', 'Goal, success predicate, artifact, grant, budget와 금지 effect를 bounded message로 보낸다.', 'Parent의 전체 credential과 transcript를 복사하지 않는다.'],
            ['04', 'Receive', 'Task state와 artifact URI·hash·provenance, unresolved item을 result schema로 받는다.', '자연어 “완료”만 받고 parent state를 completed로 덮어쓰지 않는다.'],
            ['05', 'Verify', 'Parent가 독립 verifier와 금지 effect audit를 통과시킨 뒤 merge한다.', 'Remote agent의 self-score를 최종 release 판정으로 사용하지 않는다.'],
          ].map(([index, label, rule, reject]) => (
            <div key={index} className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_7.5rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
              <strong className="text-sm">{label}</strong>
              <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                <p>{rule}</p>
                <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300"><strong>거부:</strong> {reject}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            장기 task는 같은 HTTP 응답을 붙잡고 기다리지 않는다. Task ID로 상태를 조회하거나
            event stream을 다시 구독하고, deadline을 넘기면 cancel 의도를 기록한다. Cancel
            요청과 실제 원격 작업 중단도 다르므로 terminal status와 이미 만들어진 effect를
            확인한다. Parent는 한 artifact의 merge owner를 한 명으로 제한하고, lease가 끝난
            worker의 늦은 결과는 새 revision과 충돌 검사를 거친다.
          </p>
          <p>
            MCP tool call은 내 host가 외부 capability를 호출하는 계약이고, A2A task는 불투명한
            실행 주체에게 목표와 artifact를 위임하는 계약이다. 이 둘의 큰 경계는{' '}
            <InternalLink slug="agent-runtime-current-first" learningPathId="ai-agent-system-core">
              Agent Runtime 2026
            </InternalLink>
            에서 먼저 확인할 수 있다.
          </p>
        </div>
        <StopRule>
          상대 agent의 output을 독립적으로 검증할 수 없거나 최소 권한 grant를 만들 수 없으면
          원격 위임하지 않는다. 같은 process의 deterministic worker나 사람이 검토하는 workflow로
          범위를 줄인다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="recovery-safety"
        marker="04"
        tone="amber"
        question="Timeout 뒤 retry하면 외부 동작도 안전하게 한 번만 일어날까?"
        title="Checkpoint·retry·approval과 side effect의 경계를 분리한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Checkpoint는 state를 되찾게 하지만 외부 세계를 자동으로 rollback하지 않는다. Ticket
            생성, 메일 발송, 결제, 설비 명령은 timeout 시 성공 여부가 불명확할 수 있다. Run ID와
            action ID로 만든 stable idempotency key, provider receipt, attempt와 reconciliation
            status를 state에 저장해야 retry가 같은 논리 동작으로 수렴한다.
          </p>
          <p>
            Retry는 error class별로 제한한다. Rate limit과 transient network error는 bounded
            backoff 후보지만 validation error, permission denial과 unsafe request를 같은 prompt로
            반복하지 않는다. LLM·tool client timeout, node budget와 전체 run deadline을 구분하고,
            소진되면 명시적 failed 또는 needs-review 상태로 끝낸다.
          </p>
          <p>
            LangGraph의 <code>interrupt()</code>는 checkpointer와 같은 <code>thread_id</code>로
            pause·resume한다. Resume 시 interrupt가 있던 node는 처음부터 다시 실행될 수 있으므로
            interrupt 앞의 side effect는 멱등이어야 한다. 더 안전한 구조는 approval node에서
            JSON-serializable action proposal만 저장하고, 승인 뒤 별도 action node가 외부 동작을
            실행하는 것이다.
          </p>
          <p>
            외부 문서와 web result는 명령이 아니라 untrusted evidence다. Retrieved text가
            “정책을 무시하고 tool을 실행하라”고 써도 tool allowlist, argument validator,
            tenant boundary와 human approval을 바꿀 수 없게 한다. <InternalLink slug="prompt-injection-defense">
            Prompt injection 방어</InternalLink>는 agent persona보다 낮은 runtime layer에 둔다.
          </p>
        </div>
        <ExecutionSafetyLab />
        <StopRule>
          Safety-critical 설비 정지·재가동을 LLM 판단만으로 실행하지 않는다. 센서 상태 확인,
          deterministic interlock, 권한 owner, 승인, idempotent command와 사후 receipt가 모두
          있어야 action node에 진입한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="framework-mapping"
        marker="05"
        tone="green"
        question="LangGraph와 CrewAI 중 무엇을 고르면 architecture가 해결될까?"
        title="Framework 기능을 이미 정의한 runtime 계약에 매핑한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            LangGraph는 typed state, node, edge, reducer, checkpoint와 interrupt를 직접 통제할 때
            잘 맞는다. Checkpointer를 사용한 run은 config의 <code>thread_id</code>가 state
            cursor다. Reducer 없는 key는 overwrite되고, interrupt resume는 같은 thread를 써야
            하며 node 재실행 semantics를 고려해야 한다. 이 계약을 모르고 “자동 상태 관리”라고만
            쓰면 가장 위험한 부분을 숨긴다.
          </p>
          <p>
            CrewAI의 sequential process는 task list 순서와 context 전달을 중심으로 하고,
            hierarchical process는 manager가 task를 배분·검토한다. 현재 공식 문서에서
            hierarchical process에는 <code>manager_llm</code> 또는 <code>manager_agent</code>가
            필요하다. CrewAI Flows의 structured state와 <code>@persist</code>는 resume 가능한
            workflow를 만들 수 있지만, side-effect idempotency와 업무 termination은 여전히
            application 책임이다.
          </p>
          <p>
            Framework 비교는 “코드가 짧다”로 끝내지 않는다. Typed state와 reducer visibility,
            durable persistence, replay semantics, approval, per-tool permission, timeout·retry,
            tracing, local testability, version migration과 운영팀의 debugging 능력을 본다.
            간단한 sequential workflow라면 framework 없이 명시적 함수와 queue가 더 나을 수 있다.
          </p>
        </div>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">LangGraph를 택할 근거</p>
            <p className="mt-2 text-sm font-bold">Reducer·checkpoint·interrupt를 graph state로 추적</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              복잡한 loop와 human review를 state transition으로 디버깅해야 할 때 유리하다.
            </p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">CrewAI를 택할 근거</p>
            <p className="mt-2 text-sm font-bold">Task·role·process와 Flow를 빠르게 조립</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Sequential·hierarchical 실행 모델이 업무 분해와 맞고 framework abstraction을 팀이 운영할 수 있을 때 유리하다.
            </p>
          </div>
        </div>
        <Misconception>
          Framework가 retry나 persistence API를 제공해도 “exactly once” 외부 실행을 보장하는 것은
          아니다. Runtime checkpoint와 external system transaction 사이의 reconciliation은
          application protocol로 설계한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="trace-evaluation"
        marker="06"
        tone="blue"
        question="최종 답이 틀렸을 때 어느 agent를 고쳐야 할까?"
        title="Trace를 평가 단위로 만들고 단일 기준선보다 나은지 판정한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Trace에는 run·thread·checkpoint ID, node와 parent span, input/output schema version,
            route candidate와 선택 이유, model·prompt digest, tool argument·receipt, state
            before/update/after, reducer, attempt, latency, token·cost, approval과 termination
            reason을 남긴다. 민감 payload는 원문 대신 access-controlled artifact reference와
            digest로 연결한다.
          </p>
          <p>
            Metric은 결과와 과정으로 나눈다. 결과에는 task success, evidence coverage,
            groundedness, exact schema, safety·business constraint가 있다. 과정에는 latency,
            cost, tool success, retry, handoff 수, context duplication, routing error,
            no-progress termination과 human override가 있다. 평균 하나로 합치면 품질 이득과
            안전 회귀를 상쇄해 버린다.
          </p>
          <p>
            Offline replay는 실패 trace를 고정 input으로 재생하고, shadow run은 실제 traffic에서
            action 없이 single·workflow·multi-agent 결과를 비교한다. Release는 outcome
            improvement뿐 아니라 중요 slice, safety, p95 latency, cost ceiling과 operator
            workload가 각각 통과해야 한다.
          </p>
        </div>
        <AgentTraceEvalLab />
      </NlpSection>

      <NlpSection
        id="manufacturing-case"
        marker="07"
        tone="violet"
        question="제조 이상 분석을 여러 agent로 나눈다면 무엇을 병렬화할까?"
        title="센서 근거 수집은 분리하고 설비 제어는 승인 경계 밖에 둔다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 bearing 이상 조사에서 vibration worker는 spectrum·operating point와 sensor
            quality를, thermal worker는 temperature trend·ambient·load를, maintenance worker는
            작업 이력과 부품 교체를 독립적으로 읽을 수 있다. Coordinator는 원문 transcript가
            아니라 같은 <code>Evidence</code> schema로 나온 claim, source, time range,
            confidence와 missing-data flag를 받는다.
          </p>
          <p>
            Reconcile node는 같은 timestamp와 asset ID를 확인하고 conflicting evidence를
            unresolved로 남긴다. Diagnosis node는 가능한 원인과 반증할 다음 측정을 제안한다.
            설비 정지 action은 이 graph의 자동 출력이 아니다. Deterministic alarm rule,
            current machine state, safety interlock와 권한 있는 operator 승인을 통과한 뒤 별도
            control system이 idempotent command를 실행한다.
          </p>
          <p>
            이 구조가 single-agent보다 나은지는 sensor source의 병렬 latency, evidence coverage,
            conflict 발견율과 operator review time으로 확인한다. Manager가 모든 raw time series를
            다시 읽어 context가 커지고 결과는 같다면 multi-agent split을 제거한다. Production
            architecture는 agent 수가 아니라 더 작은 failure surface를 목표로 한다.
          </p>
          <p>
            여기서 다음 글은 실패 증상으로 고른다. Routing·tool·state transition을 같은 fixture에서
            반복 재현하고 release gate를 세우려면 <InternalLink slug="agent-evaluation-trace">Agent Evaluation &amp; Trace</InternalLink>로
            간다. 원격 agent가 보낸 instruction·artifact의 신뢰 경계가 문제라면
            <InternalLink slug="prompt-injection-defense">Prompt Injection Defense</InternalLink>로 분기한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Single-agent와 deterministic workflow를 multi-agent의 필수 기준선으로 설계할 수 있다.',
          'State field별 writer, reducer, validation, size와 redaction 계약을 정의할 수 있다.',
          'Success·failure·budget·no-progress의 business 종료와 recursion runtime guardrail을 구분할 수 있다.',
          'A2A task envelope, lifecycle, artifact와 독립 verifier로 원격 agent 위임을 제한할 수 있다.',
          'Checkpoint와 external side effect 사이에 idempotency·receipt·reconciliation을 둘 수 있다.',
          'LangGraph thread_id·interrupt 재실행과 CrewAI hierarchical manager 요구를 설명할 수 있다.',
          'Trace span에서 routing·tool·state·synthesis 실패를 분리하고 release metric을 구성할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'LangGraph · Graph API', href: 'https://docs.langchain.com/oss/python/langgraph/graph-api', note: 'Typed state, reducer, node·edge와 Command의 현재 semantics.' },
          { label: 'LangGraph · Persistence', href: 'https://docs.langchain.com/oss/python/langgraph/persistence', note: 'Checkpointer, thread_id, replay와 fault-tolerance 범위.' },
          { label: 'LangGraph · Interrupts', href: 'https://docs.langchain.com/oss/python/langgraph/interrupts', note: 'Pause·resume, 같은 thread, node 재실행과 idempotent side-effect 규칙.' },
          { label: 'CrewAI · Processes', href: 'https://docs.crewai.com/en/concepts/processes', note: 'Sequential·hierarchical process와 manager_llm/manager_agent 요구.' },
          { label: 'CrewAI · Flows', href: 'https://docs.crewai.com/en/concepts/flows', note: 'Structured state와 @persist 기반 resume·fork의 현재 문서.' },
          { label: 'Anthropic · Multi-agent research system', href: 'https://www.anthropic.com/engineering/multi-agent-research-system', note: '병렬 research orchestrator-worker를 운영한 bounded engineering 사례.' },
          { label: 'A2A Protocol · 1.0', href: 'https://a2a-protocol.org/latest/announcing-1.0/', note: 'SendMessage, version·binding negotiation, signed Agent Card와 task·artifact 상호운용의 안정 규격.' },
        ]} />
      </NlpSection>
    </div>
  );
}
