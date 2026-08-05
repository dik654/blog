import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import type { ReactNode } from 'react';
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
  RuntimeExecutionViz,
  RuntimeOwnershipLab,
} from './agent-frameworks/viz/RuntimeOwnershipLab';

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
        <MathFormula display className="my-0 text-[13px] sm:text-base">
          {latex}
        </MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function OwnershipRow({
  index,
  boundary,
  runtime,
  application,
  evidence,
}: {
  index: string;
  boundary: string;
  runtime: string;
  application: string;
  evidence: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_9rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{boundary}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p><strong className="text-foreground">Runtime 후보:</strong> {runtime}</p>
        <p className="mt-1"><strong className="text-foreground">Application 책임:</strong> {application}</p>
        <p className="mt-1 text-xs text-foreground"><strong>검증 증거:</strong> {evidence}</p>
      </div>
    </div>
  );
}

function RuntimeFamily({
  marker,
  title,
  owns,
  remains,
  stop,
  children,
}: {
  marker: string;
  title: string;
  owns: string;
  remains: string;
  stop: string;
  children: ReactNode;
}) {
  return (
    <section className="not-prose border-t border-border py-5 first:border-t-0">
      <div className="grid min-w-0 gap-3 sm:grid-cols-[3rem_minmax(0,1fr)]">
        <span className="font-mono text-xs font-black text-muted-foreground">{marker}</span>
        <div className="min-w-0">
          <h3 className="text-base font-bold">{title}</h3>
          <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="min-w-0 border-l-2 border-blue-500/50 pl-3">
              <dt className="text-xs font-bold text-muted-foreground">맡기는 책임</dt>
              <dd className="mt-1 leading-relaxed">{owns}</dd>
            </div>
            <div className="min-w-0 border-l-2 border-amber-500/50 pl-3">
              <dt className="text-xs font-bold text-muted-foreground">남는 책임</dt>
              <dd className="mt-1 leading-relaxed">{remains}</dd>
            </div>
            <div className="min-w-0 border-l-2 border-emerald-500/50 pl-3">
              <dt className="text-xs font-bold text-muted-foreground">여기서 멈춤</dt>
              <dd className="mt-1 leading-relaxed">{stop}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

const pendingActionType = `type PendingAction = {
  runId: string;
  stateRevision: string;
  tool: "issue_refund";
  argumentsHash: string;
  idempotencyKey: string;
  expectedEffect: { orderId: string; status: "refunded" };
  approval?: {
    actor: string;
    scope: string;
    approvedRevision: string;
    expiresAt: string;
  };
  commit?: {
    requestedAt: string;
    transportResult?: "ok" | "timeout" | "error";
  };
  reconciliation?: { observedStatus: string; verifiedAt: string };
};`;

export default function AgentFrameworksArticle() {
  return (
    <>
      <NlpSection
        id="ownership"
        marker="01"
        tone="teal"
        question="제품 이름보다 먼저 중단과 복구 책임을 묻는다"
        title="프레임워크 선택은 누가 실행 상태를 책임지는지 정하는 일이다"
      >
        <BeginnerOpening
          title="프레임워크는 반복 작업의 틀을 빌려주지만 업무 책임까지 대신 알지는 못한다"
          description={<>여기서 <strong>에이전트 프레임워크</strong>는 모델 호출, 도구 실행, 중간 저장과 재개처럼 여러 제품에서 반복되는 코드를 묶어 둔 도구다. 어떤 틀을 고를지는 기능 개수보다 “중단됐을 때 어느 상태를 누가 복구하는가”로 판단해야 한다.</>}
          familiarScene={<>택배 회사가 배송 관리 프로그램을 산다고 하자. 프로그램이 경로와 상태표를 제공해도 “한 주문을 두 번 환불하지 않는다” 같은 회사 규칙은 스스로 알 수 없다. 전송 결과를 받지 못했을 때 이미 처리됐는지 확인하는 책임도 남는다.</>}
          steps={[
            { label: '반복 실행 틀을 정한다', detail: '모델 호출, 도구 결과 반환과 다음 단계를 어떤 runtime이 맡을지 고른다.' },
            { label: '중단과 승인을 저장한다', detail: '프로세스가 꺼져도 같은 작업과 승인 범위를 복원할 수 있게 한다.' },
            { label: '업무 규칙은 제품이 검증한다', detail: '중복 환불 방지와 실제 외부 상태 확인은 application 계약으로 남긴다.' },
          ]}
        />
        <QuestionLead
          question="환불 에이전트가 결제 요청의 응답을 받지 못한 채 꺼졌고, 사용자가 두 시간 뒤 승인했다. 어떤 프레임워크를 쓰면 안전할까?"
          answer="제품 이름만으로는 답할 수 없다. 재시작 뒤 어느 run을 복원하는지, 승인이 정확히 어떤 action revision을 허용했는지, timeout 전에 환불이 실제 반영됐는지, 재시도해도 중복 환불이 나지 않는지를 먼저 정해야 한다. Framework는 이 책임 중 일부를 대신 소유할 뿐, 업무 의미 전체를 알지 못한다."
        />
        <ConceptPrimer items={[
          {
            term: 'Model API',
            meaning: '입력과 tool schema를 보내 model output 또는 tool proposal을 받는 경계다.',
            why: '모델 호출 성공과 전체 업무 실행 성공을 분리한다.',
          },
          {
            term: 'Agent SDK',
            meaning: 'Model turn, tool result 반환, handoff와 session 같은 반복 실행을 관리하는 얇은 runtime이다.',
            why: '같은 loop boilerplate를 줄이되 application 책임을 숨기지 않는다.',
          },
          {
            term: 'Orchestration runtime',
            meaning: 'Step, state transition, interrupt, checkpoint와 resume를 명시적으로 소유한다.',
            why: '한 process와 context window를 넘는 작업을 재현 가능하게 만든다.',
          },
          {
            term: 'Application contract',
            meaning: '업무 권한, idempotency, 외부 상태 invariant와 성공 판정을 제품 코드가 정한 것이다.',
            why: '어떤 범용 framework도 환불·배포·삭제의 실제 의미를 자동으로 알 수 없다.',
          },
          {
            term: 'Idempotency',
            meaning: '같은 업무 요청을 다시 보내도 환불·배포·삭제 같은 실제 효과가 한 번만 일어나게 만드는 성질이다.',
            why: '응답을 잃은 timeout과 process restart 뒤의 재시도를 중복 효과 없이 처리한다.',
          },
          {
            term: 'Invariant',
            meaning: '재시작과 재시도 중에도 반드시 유지되어야 하는 업무 조건이다. 예를 들면 주문 한 건은 한 번만 환불된다.',
            why: 'HTTP 응답 대신 실제 외부 상태를 읽어 성공과 실패를 판정하게 한다.',
          },
        ]} />
        <RuntimeExecutionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 run에는 서로 다른 주체가 등장한다. 모델은 다음 행동을 <em>제안</em>하고, runtime은 turn과
            state transition을 진행하며, application은 권한과 업무 규칙을 판정한다. 외부 API는 실제
            세계를 바꾸고, evaluator는 마지막 상태와 trace가 성공 계약을 만족했는지 읽는다.
          </p>
          <p>
            따라서 “LangChain이 메모리를 해 준다”처럼 한 문장으로 끝내면 부족하다. 어느 상태를 어떤
            key로 저장하는지, process restart 뒤 무엇을 재개하는지, 실제 업무 DB와 runtime checkpoint가
            어떻게 연결되는지까지 owner를 배정해야 한다. 이 구분의 바닥은
            {' '}<InternalLink slug="agentic-patterns" learningPathId="ai-agent-system-core">Agent Loop</InternalLink>와
            {' '}<InternalLink slug="llm-harness" learningPathId="ai-agent-system-core">Durable Harness</InternalLink>에서
            이미 만들었다. 이 글은 그 계약을 어떤 runtime family에 맡길지 결정한다.
          </p>
        </div>
        <Misconception>
          Framework를 사용하면 코드가 줄 수는 있지만 책임이 사라지지는 않는다. 반대로 직접 loop를
          작성하면 control은 커지지만 checkpoint, approval, retry, trace와 migration 책임도 application이
          모두 떠안는다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="boundaries"
        marker="02"
        tone="blue"
        question="여섯 경계마다 owner와 증거를 한 명씩 배정한다"
        title="좋은 선택은 제공 기능의 수가 아니라 책임 빈칸이 없는 선택이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Framework 문서에는 memory, guardrail, persistence, human-in-the-loop와 tracing이 자주
            등장한다. 같은 단어라도 보장 범위는 다르다. Session history는 업무 state가 아니고,
            graph checkpoint는 외부 결제 상태가 아니며, input guardrail은 authorization 전체가 아니다.
            그래서 이름 대신 아래 여섯 경계의 입력, 산출물과 증거를 확인한다.
          </p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <OwnershipRow
            index="01"
            boundary="Turn loop"
            runtime="tool proposal을 실행하고 observation을 다시 model에 넣는 반복"
            application="task admission, 종료 조건과 최대 turn·비용"
            evidence="turn ID, model·prompt version, terminal reason"
          />
          <OwnershipRow
            index="02"
            boundary="Dispatch · policy"
            runtime="typed argument parse, tool lookup, middleware·guardrail hook"
            application="사용자·resource·task 범위의 실제 authorization"
            evidence="argument hash, rule ID, allow·deny와 grant"
          />
          <OwnershipRow
            index="03"
            boundary="Checkpoint · resume"
            runtime="step state와 interrupt position의 저장·복원"
            application="stable run identity, schema migration과 retention"
            evidence="state revision, checkpoint ID, resume owner"
          />
          <OwnershipRow
            index="04"
            boundary="Approval · commit"
            runtime="실행을 멈추고 사람 입력을 받아 같은 run을 재개"
            application="승인 대상 action을 구체적으로 묶고 변경되면 무효화"
            evidence="actor, scope, approved revision과 expiry"
          />
          <OwnershipRow
            index="05"
            boundary="Effect verification"
            runtime="tool result와 error를 event로 전달"
            application="timeout 뒤 외부 상태 조회, idempotency와 invariant 판정"
            evidence="request key, external receipt, before·after state"
          />
          <OwnershipRow
            index="06"
            boundary="Trace · replay"
            runtime="model, tool, handoff와 state transition span"
            application="민감정보 처리, fixture, grader와 release gate"
            evidence="trace lineage, environment snapshot, verdict"
          />
        </div>
        <Formula
          latex={String.raw`\underbrace{G}_{\text{남은 책임 빈칸}}=\sum_{\underbrace{b\in B}_{\text{실행 경계}}}\sum_{\underbrace{o\in O}_{\text{두 책임 주체}}}\underbrace{\mathbf{1}\!\left[\operatorname{owner}(b,o)=\varnothing\right]}_{\text{이 주체가 비었으면 1}}`}
          meaning="Framework의 우열 점수를 만드는 식이 아니다. 먼저 필요한 실행 경계 B를 적고, 각 경계마다 runtime과 application 두 책임 주체 O를 따로 검사한다. 둘 중 하나라도 실제 owner가 없으면 1을 더하므로 G가 0이 될 때까지 설계를 닫는다. Framework가 기능을 제공한다는 설명만 있고 저장 key, 정책 주체, 효과 증거가 없다면 owner를 배정한 것으로 세지 않는다."
          symbols={[
            [String.raw`B`, '현재 업무에 필요한 turn, policy, resume, approval, effect, replay 경계의 집합'],
            [String.raw`b`, '집합 B 안의 한 실행 경계'],
            [String.raw`O=\{R,A\}`, '각 경계에서 따로 확인할 runtime(R)과 application(A) 책임 주체의 집합'],
            [String.raw`o`, '집합 O 안의 한 책임 주체'],
            [String.raw`\operatorname{owner}(b,o)`, '경계 b에서 주체 o의 state, 실패와 증거를 최종 책임지는 component 또는 팀'],
            [String.raw`\varnothing`, '책임자가 정해지지 않은 상태'],
            [String.raw`\mathbf{1}[\cdot]`, '괄호 안 조건이 참이면 1, 거짓이면 0을 만드는 지시 함수'],
            [String.raw`\sum_{b\in B}\sum_{o\in O}`, '모든 실행 경계에서 runtime과 application 책임 빈칸을 각각 더하는 두 번의 합'],
            [String.raw`G`, '설계에 남은 책임 공백의 개수이며 목표는 0'],
          ]}
        />
        <Takeaway>
          “Persistence 지원”을 확인한 뒤에는 무엇을, 언제, 어떤 ID로 저장하고 외부 effect와 어떻게
          reconcile하는지를 다시 묻는다. 이 두 번째 질문이 framework demo와 production runtime을 가른다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="families"
        marker="03"
        tone="violet"
        question="직접 호출에서 durable coordination까지 필요한 만큼만 올린다"
        title="2026년의 framework를 제품명이 아니라 실행 family로 읽는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아래 순서는 순위가 아니라 책임의 양이다. 짧고 read-only인 요청에 durable graph를 넣는다고
            품질이 자동으로 오르지 않는다. 반대로 여러 시간 기다리거나 외부 상태를 바꾸는 작업을
            stateless loop 하나로 처리하면 중단과 재시도에서 증거를 잃는다. 필요한 보장을 먼저 고르고
            가장 작은 충분한 family에서 시작한다.
          </p>
        </div>
        <RuntimeOwnershipLab />
        <div className="not-prose my-8 border-y border-border">
          <RuntimeFamily
            marker="01"
            title="직접 model API: loop를 application이 소유한다"
            owns="요청 형식, model response와 낮은 수준의 tool proposal."
            remains="Turn 반복, state, dispatch, retry, approval와 trace 전체."
            stop="한두 번 호출하고 read-only typed output을 반환하면 충분하다."
          >
            OpenAI Agents SDK 공식 문서는 Responses API를 직접 쓸 조건으로 application이 loop,
            tool dispatch와 state handling을 직접 소유하려는 경우를 명시한다. 이 방식은 가장 투명하지만
            runtime을 직접 구현한다는 뜻이다. 단순 호출에 agent abstraction을 얹지 않아도 되는
            출발점이다.
          </RuntimeFamily>
          <RuntimeFamily
            marker="02"
            title="Agent SDK: 반복 실행의 공통 기계를 맡긴다"
            owns="Turn loop, function tool 호출, handoff, session, interrupt와 기본 trace."
            remains="업무 authorization, idempotency, effect verification와 release 판단."
            stop="짧거나 중간 길이의 tool task가 SDK run 안에서 끝나고 app-specific graph가 필요 없다."
          >
            OpenAI Agents SDK는 built-in loop가 tool 결과를 다시 모델에 보내 완료까지 진행하며,
            sessions, human-in-the-loop, tracing과 sandbox session을 제공한다. 중요한 차이는 model
            성능이 아니라 누가 turn과 tool execution을 진행하는가다. SDK guardrail이 있다는 이유로
            결제 권한이나 데이터 접근 정책까지 위임한 것으로 보아서는 안 된다.
          </RuntimeFamily>
          <RuntimeFamily
            marker="03"
            title="LangChain · LangGraph: component 층과 durable runtime 층을 나눈다"
            owns="LangChain은 model·tool과 prebuilt loop, LangGraph는 graph state, interrupt, persistence와 resume."
            remains="Graph state schema, 업무 DB, 정책 의미, effect reconciliation와 eval."
            stop="Deterministic step과 model step을 섞고 checkpoint에서 정확히 재개할 필요가 있다."
          >
            현재 공식 문서는 LangChain을 agent framework, LangGraph를 낮은 수준의 orchestration
            runtime, Deep Agents를 그 위의 harness, LangSmith를 trace·evaluation platform으로 구분한다.
            LangGraph checkpointer는 한 thread의 graph snapshot을, store는 thread 밖의 application data를
            보존한다. RAM checkpointer는 process restart를 견디지 못하므로 “checkpointer를 붙였다”는
            사실만으로 durable하다고 결론 내리지 않는다.
          </RuntimeFamily>
          <RuntimeFamily
            marker="04"
            title="LlamaIndex Workflows: 자료와 event가 실행의 중심일 때"
            owns="Event type으로 연결된 step, branch·loop·concurrency, shared state와 durable workflow 선택지."
            remains="Source 권위, retrieval acceptance, citation, 업무 side effect와 release quality."
            stop="Retrieval·document processing과 agent step이 같은 event flow 안에서 주요 상태를 만든다."
          >
            LlamaIndex의 현재 Workflow 문서는 workflow를 event-driven, step-based 실행으로 정의한다.
            Step은 event를 받고 새 event를 반환하며, 일반 Python의 조건문과 event type으로 branch와 loop를
            만든다. 공식 문서는 workflow context checkpoint와 restart 뒤 resume를 별도 durable 경로로
            다룬다. “RAG 특화”라는 한 문장보다 자료 처리 event와 state가 실제 runtime의 중심인지가
            선택 기준이다.
          </RuntimeFamily>
          <RuntimeFamily
            marker="05"
            title="CrewAI Crews · Flows: 역할과 제어 흐름을 분리한다"
            owns="Crew의 agent·task 협업과 실행 process, Flow의 event routing, structured state와 선택적 persistence."
            remains="Worker 독립성, 권한 격리, artifact verifier, merge owner와 전체 비용."
            stop="병렬 worker가 서로 다른 artifact를 만들고 독립 검증 뒤 병합할 수 있다."
          >
            CrewAI 공식 문서는 Crew를 여러 agent가 정해진 task 집합을 함께 수행하는 group으로 설명하고,
            sequential 또는 hierarchical process와 manager delegation으로 실행을 조정한다. Flow는
            event routing과 structured state를 중심으로 더 명시적인 제어 흐름을 만든다. Flow의
            <code>@persist</code>는 state를 저장하고 같은 ID의 resume와 새 ID의 fork를 나눈다. 다만 역할
            이름을 여러 개 붙인다고 독립적인 증거나 병렬성이 생기지는 않는다. 분리 가능한 task contract와
            verifier가 없으면 단일 agent 또는 일반 workflow가 더 작고 명확하다.
          </RuntimeFamily>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>AutoGen을 현재 기본값처럼 놓지 않는다</h3>
          <p>
            기존 글은 AutoGen을 LangChain·CrewAI와 나란히 놓았다. 2026년 Microsoft 공식 문서는
            <strong> Microsoft Agent Framework를 AutoGen과 Semantic Kernel의 direct successor</strong>로
            설명하며, agent, harness, typed graph workflow를 한 계보로 합친다. 기존 AutoGen system을
            유지하거나 논문 재현을 위해 읽을 수는 있지만, 새 선택을 설명할 때는 Agent Framework와 공식
            migration guide를 현재 기준으로 확인해야 한다.
          </p>
          <p>
            이 역시 “새 framework가 항상 낫다”는 뜻은 아니다. 공식 문서는 현재 기능 차이와 아직 옮겨오지
            않은 기능을 함께 적고 있다. Migration은 이름 교체가 아니라 현재 run state, tool behavior와
            observability가 보존되는지 검증하는 작업이다.
          </p>
        </div>
        <StopRule>
          고정 함수나 짧은 직접 호출로 task를 닫을 수 있으면 agent framework를 추가하지 않는다. Agent
          SDK로 필요한 상태와 중단을 설명할 수 있으면 graph를 추가하지 않는다. Multi-agent는 worker의
          입력·산출물·권한과 verifier가 실제로 분리될 때만 연다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="effect-test"
        marker="04"
        tone="amber"
        question="Timeout과 process restart를 넣어 framework 밖의 책임을 드러낸다"
        title="환불 한 건을 prepare → approve → commit → reconcile로 검증한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이제 첫 질문을 실행 가능한 test로 바꾼다. 모델은 “주문 42를 환불한다”는 proposal만 만든다.
            Application은 현재 주문 상태, 금액 상한과 사용자 권한을 읽어 <strong>pending action</strong>을
            준비한다. 이때 tool 이름과 인자 hash, state revision, idempotency key와 기대 effect를 함께
            저장한다.
          </p>
          <p>
            Runtime은 이 checkpoint에서 멈추고 승인 요청을 낸다. 두 시간 뒤 돌아온 승인은 사람이 본
            action revision과 같고 승인 만료 시각을 지나지 않았을 때만 유효하다. 그 사이 금액이나
            수취인이 바뀌었거나 승인이 만료됐다면 새 action을 만들고 다시 승인받아야 한다. “approve”라는
            문자열만 history에 추가해서는 이 결합을 증명할 수 없다.
          </p>
          <p>
            앞의 여섯 경계는 전체 설계의 점검표였다. 여기서는 그중 checkpoint·resume,
            approval·commit과 effect verification을 실제 실행 순서인 Prepare, Interrupt, Approve,
            Commit, Reconcile 다섯 단계로 펼친다. 아래 type에서 state revision은 “무엇을 승인했는가”,
            idempotency key는 “같은 효과를 어떻게 한 번으로 묶는가”, expected effect와 reconciliation은
            “외부 시스템에서 무엇을 다시 확인하는가”에 각각 답한다.
          </p>
        </div>
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-6 sm:text-sm">
          <code>{pendingActionType}</code>
        </pre>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <OwnershipRow
            index="01"
            boundary="Prepare"
            runtime="proposal을 typed pending action event로 보존"
            application="주문 상태, 권한, 금액과 기대 effect를 검증"
            evidence="arguments hash, state revision, idempotency key"
          />
          <OwnershipRow
            index="02"
            boundary="Interrupt"
            runtime="checkpoint와 resume token을 저장하고 실행을 중단"
            application="승인 UI에 실제 대상·금액·위험·만료를 표시"
            evidence="checkpoint ID, approval request와 concrete diff"
          />
          <OwnershipRow
            index="03"
            boundary="Approve"
            runtime="사람 입력을 같은 run과 pending step에 전달"
            application="actor, scope, approved revision과 expiresAt이 현재 action·시각에 유효한지 검사"
            evidence="만료 시각이 포함된 signed approval record 또는 감사 가능한 approval event"
          />
          <OwnershipRow
            index="04"
            boundary="Commit"
            runtime="tool 호출과 timeout을 event로 기록"
            application="동일 idempotency key로 단 한 번의 효과를 요구하고 provider 미지원 시 local operation ledger·lock으로 중복을 막음"
            evidence="request ID, transport outcome, provider receipt"
          />
          <OwnershipRow
            index="05"
            boundary="Reconcile"
            runtime="새 observation을 다음 state transition에 전달"
            application="pending commit이 남은 채 재개되면 timeout 기록 유무와 무관하게 blind retry 전에 주문 상태를 다시 조회"
            evidence="observed external state, invariant verdict, terminal reason"
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
	            이 test는 어떤 framework에서도 동일하게 실행해야 한다. Process를 approval 직전, commit
	            요청을 보낸 직후 응답을 받기 전, timeout 직후에 각각 죽이고 같은 run이 중복 환불 없이
	            끝나는지 확인한다. 재개된 state에 pending commit이 있으면 명시적 timeout event가 없어도 먼저
	            외부 주문 상태를 reconcile한다. Runtime이 checkpoint를 제공해도 application이 idempotency와
	            external state 조회를 구현하지 않았다면 이 test는 실패한다.
          </p>
          <p>
            Tool schema와 protocol 경계는
            {' '}<InternalLink slug="mcp-protocol" learningPathId="ai-agent-system-core">MCP</InternalLink>,
            고위험 source와 sink의 권한은
            {' '}<InternalLink slug="prompt-injection-defense" learningPathId="ai-agent-system-core">Prompt Injection 방어</InternalLink>,
            이 test를 반복 release gate로 만드는 방법은
            {' '}<InternalLink slug="agent-evaluation-trace" learningPathId="ai-agent-system-core">Agent Evaluation & Trace</InternalLink>가
            이어받는다.
          </p>
        </div>
        <Misconception>
          HTTP 200은 업무 성공의 충분조건이 아니고 timeout은 업무 실패의 충분조건도 아니다. 외부
          시스템이 요청을 반영한 뒤 응답만 잃었을 수 있으므로 실제 state를 다시 읽어야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="migration"
        marker="05"
        tone="green"
        question="Framework를 바꿔도 보존되어야 할 contract를 먼저 고정한다"
        title="Migration은 API 번역이 아니라 같은 실패를 재현하는 paired replay다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Framework를 선택하거나 교체하기 전에 application-owned data structure를 고정한다. 최소한
            run ID와 state revision, typed tool envelope, approval record, idempotency key, effect receipt,
            terminal reason과 versioned trace event가 framework object 밖에서도 의미를 가져야 한다.
            그래야 특정 memory class나 graph serializer가 바뀌어도 업무 이력을 옮길 수 있다.
          </p>
          <ol>
            <li><strong>기준 run을 고정한다.</strong> 정상, tool error, timeout, restart, stale approval과 cancel fixture를 만든다.</li>
            <li><strong>Old runtime을 기록한다.</strong> State transition, tool call, effect와 terminal reason을 trace로 남긴다.</li>
            <li><strong>Adapter를 좁게 만든다.</strong> Model, tool, state store와 trace exporter를 한꺼번에 바꾸지 않는다.</li>
            <li><strong>Paired replay한다.</strong> 같은 environment snapshot에서 old/new runtime의 end state와 forbidden effect를 비교한다.</li>
            <li><strong>운영 조건까지 본다.</strong> 평균 답변 품질뿐 아니라 recovery, latency, cost, retention과 on-call debugging을 확인한다.</li>
          </ol>
          <p>
            다음 사례 경로에서는 먼저
            {' '}<InternalLink slug="claude-code" learningPathId="ai-agent-runtime-cases">Claude Code</InternalLink>가
            실제 코딩 제품에서 loop, tool과 permission을 어떻게 묶는지 읽고,
            {' '}<InternalLink slug="openclaw-assistant" learningPathId="ai-agent-runtime-cases">OpenClaw</InternalLink>에서
            channel·session·skill의 제품 경계를 비교한다. 특정 Rust 구현으로 내려가려면
            {' '}<InternalLink slug="claw-overview" learningPathId="ai-claw-core">Claw Code 전체 구조</InternalLink>에서
            crate ownership과 parity evidence를 검산한다.
          </p>
          <p>
            이 글의 결론은 “A 대신 B를 써라”가 아니다. 현재 업무에 필요한 책임 집합을 적고,
            framework가 소유하는 부분과 application이 끝까지 소유할 부분을 분리한 뒤, 실패 fixture로
            그 경계를 증명하라는 것이다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Model API, Agent SDK, orchestration runtime과 application contract의 책임을 구분할 수 있다.',
          'Turn, policy, resume, approval, effect와 replay의 여섯 경계에 owner와 증거를 배정할 수 있다.',
          '직접 API, SDK, graph, data workflow와 crew runtime 중 최소 충분한 family를 고를 수 있다.',
          'LangChain·LangGraph의 현재 층 구분과 checkpointer·store·업무 DB의 차이를 설명할 수 있다.',
          'LlamaIndex Workflow와 CrewAI Flow를 event·state·resume·coordination 책임으로 읽을 수 있다.',
          'AutoGen과 Microsoft Agent Framework의 현재 승계 관계를 공식 문서 범위에서 설명할 수 있다.',
          'Timeout 뒤 blind retry하지 않고 idempotency와 external state reconciliation으로 effect를 닫을 수 있다.',
          'Framework migration을 같은 fixture의 paired replay와 release evidence로 검증할 수 있다.',
        ]} />
        <SourceNotes sources={[
          {
            label: 'OpenAI Agents SDK · 공식 문서',
            href: 'https://openai.github.io/openai-agents-python/',
            note: 'Responses API 직접 사용과 SDK runtime의 loop·tool·session·HITL·tracing 책임 구분.',
          },
          {
            label: 'LangGraph · Overview',
            href: 'https://docs.langchain.com/oss/python/langgraph/overview',
            note: 'LangChain, LangGraph, Deep Agents, LangSmith의 현재 층과 durable orchestration 범위.',
          },
          {
            label: 'LangGraph · Persistence',
            href: 'https://docs.langchain.com/oss/python/langgraph/persistence',
            note: 'Thread checkpoint와 cross-thread store, restart를 견디지 못하는 in-memory saver의 경계.',
          },
          {
            label: 'LlamaIndex · Workflows',
            href: 'https://developers.llamaindex.ai/python/llamaagents/workflows/',
            note: 'Event-driven step, branch·loop·concurrency와 durable workflow 경로.',
          },
          {
            label: 'CrewAI · 공식 문서',
            href: 'https://docs.crewai.com/index',
            note: 'Crews와 Flows의 현재 제품 문서 구조와 상세 개념 페이지 진입점.',
          },
          {
            label: 'CrewAI · Crews',
            href: 'https://docs.crewai.com/concepts/crews',
            note: 'Agent·task 협업 group, sequential·hierarchical process와 manager delegation의 공식 정의.',
          },
          {
            label: 'CrewAI · Flow persistence',
            href: 'https://docs.crewai.com/concepts/flows',
            note: 'Structured state, @persist, resume와 fork의 구체적 현재 동작.',
          },
          {
            label: 'Microsoft Agent Framework · Overview',
            href: 'https://learn.microsoft.com/en-us/agent-framework/overview/',
            note: 'Agent와 workflow의 선택 기준, AutoGen·Semantic Kernel의 direct successor라는 공식 현재 설명.',
          },
          {
            label: 'Microsoft · AutoGen migration guide',
            href: 'https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/',
            note: 'AutoGen과 Agent Framework의 orchestration, tool, state와 observability 차이.',
          },
        ]} />
      </NlpSection>
    </>
  );
}
