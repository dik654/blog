import { CitationBlock } from "@/components/ui/citation";
import FrameworkArchViz from "./viz/FrameworkArchViz";
import LangGraphDetailViz from "./viz/LangGraphDetailViz";

export default function LangChain() {
  return (
    <section id="langchain" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        LangChain과 LangGraph는 서로 다른 층을 맡습니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          2026년 8월 공식 문서의 현재 계층에서 LangChain은 model·tool integration과 일반적인
          agent loop를 제공하는 상위 framework입니다. 현재 <code>create_agent</code>는
          LangGraph runtime 위에서 동작합니다.
        </p>
        <p>
          LangGraph는 prompt나 agent architecture를 대신 정하지 않습니다. 낮은 수준의 orchestration runtime으로서 long-running
          stateful workflow에 persistence, durable execution, streaming과 human-in-the-loop를 제공합니다.
        </p>
        <p>
          따라서 두 이름을 경쟁 제품처럼 놓기보다 같은 stack에서 서로 다른 책임을 맡는 계층으로 읽는 편이 정확합니다.
        </p>
        <p>
          환불 요청에서 model·tool 연결과 짧은 loop만 필요하면 LangChain agent로 시작할 수 있습니다. 주문 조회 뒤 담당자 승인을 오래 기다리거나 장애 후 같은
          위치에서 재개해야 한다면 LangGraph를 검토합니다.
        </p>
        <p>
          이때 state machine을 명시하는 Graph API와 기존 if·for·function 구조를 유지하는
          Functional API 중 필요한 방식을 고릅니다. LangGraph는 LangChain 없이도 쓸 수 있으므로
          integration layer와 runtime을 반드시 함께 채택할 필요는 없습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <FrameworkArchViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>State·Node·Edge가 workflow를 나눕니다</h3>
        <p>
          <strong>State</strong>는 현재 application snapshot입니다. 환불 예에서는
          <code>phase</code>, order, policy decision, approval, refund operation과 receipt를
          포함합니다.
        </p>
        <p>
          <strong>Node</strong>는 주문 조회, 정책 판정, 승인 interrupt, 환불 API, receipt 검증처럼
          한 책임을 수행하는 함수입니다. <strong>Edge</strong>는 state를 보고 다음 node를 정하는
          고정 또는 조건부 transition입니다.
        </p>
        <p>
          Graph가 업무 흐름의 정답을 발견하는 것은 아닙니다. 개발자가 정의한 state machine을 실행하고 전이 상태를 추적할 뿐입니다.
        </p>
        <p>
          Node는 state 전체를 마음대로 고치기보다 update를 반환합니다. 같은 field에 update가
          들어오면 <strong>reducer</strong>가 기존 값과 새 값을 어떻게 합칠지 정합니다. 예를
          들어 <code>phase</code>는 새 값으로 덮어쓰고, <code>audit_events</code>는 기존 list 뒤에
          새 event를 붙일 수 있습니다.
        </p>
        <p>
          Single workflow에서도 reducer를 잘못 정하면 retry 때 event가 사라지거나 중복됩니다. 여러 node의 병렬 충돌과 안전한 merge는 multi-
          agent 정본에 맡기고 여기서는 한 transition의 update semantics까지만 확인합니다.
        </p>

        <div id="paper-langgraph-runtime" className="not-prose scroll-mt-24">
          <CitationBlock
            source="LangGraph official documentation — Overview and Graph API"
            citeKey={2}
            href="https://docs.langchain.com/oss/python/langgraph/overview"
          >
            문제: long-running agent가 state, pause, streaming과 failure recovery를 application
            code마다 다시 구현해야 합니다. 기여: 현재 공식 문서는 LangGraph를 State·Node·Edge와
            persistence를 중심으로 한 low-level orchestration framework/runtime으로 정의하고,
            LangChain agent와의 계층을 설명합니다. 전제: 해당 문서 revision과 지원되는 LangGraph
            API·checkpointer입니다. 근거 범위: 제품의 현재 책임과 공개 execution model입니다.
            하지 않는 주장: LangGraph가 prompt·workflow를 자동으로 올바르게 설계하거나 모든
            workload에서 direct code보다 단순하고 빠르며 다른 runtime만으로는 durable execution을
            구현할 수 없다는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <h3>Checkpoint는 복원 가능한 상태 사본입니다</h3>
        <p>
          <strong>Checkpoint</strong>는 “다음 줄 번호”만 저장하지 않습니다. LangGraph의
          persistence는 thread별 graph state values, 다음에 실행할 node·task와 metadata를
          남겨 interrupt, fault recovery와 replay에 사용합니다. Thread ID는 어느 실행의
          checkpoint history를 읽을지 가리킵니다.
        </p>
        <p>
          <strong>Checkpointer</strong>는 이 graph state를 저장합니다. 여러 thread가 공유하는
          사용자 profile 같은 cross-thread application data를 보관하는 <strong>store</strong>와는
          책임이 다릅니다.
        </p>
        <p>
          환불 workflow가 승인 대기에서 멈출 때 checkpoint에는 request ID, order와 policy
          evidence, approval payload, 현재 phase와 다음 node가 복원 가능한 형태로 들어 있어야
          합니다.
        </p>
        <p>
          File handle, open database transaction, live HTTP response 같은 process-local object는 다른 worker가 복원하기
          어렵습니다. 대신 stable ID와 필요한 data를 저장하고 connection 같은 dependency는 runtime context에서 다시 주입합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <LangGraphDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Replay가 가능하면 side effect는 idempotent해야 한다</h3>
        <p>
          과거 checkpoint에서 replay하면 이전 node 결과는 건너뛸 수 있지만 checkpoint 뒤의
          LLM call, API request와 interrupt는 다시 실행될 수 있습니다. 특히 interrupt가 있는
          node는 resume할 때 node 시작부터 다시 실행될 수 있습니다.
        </p>
        <p>
          따라서 interrupt 앞의 side effect도 반복될 가능성을 고려해야 합니다.
          <strong> Idempotency</strong>는 같은 operation을 여러 번 요청해도 효과가 한 번 수행한
          것과 같게 만드는 성질입니다.
        </p>
        <p>
          환불 API에는 <code>{"refund:{request_id}:{order_id}"}</code>처럼 workflow에서
          안정적으로 재생성할 수 있는 idempotency key를 보내고, provider가 반환한 operation ID와
          receipt를 state에 기록합니다.
        </p>
        <p>
          API 성공 직후 checkpoint write 전에 worker가 죽어도 같은 key로 재시도하면 새 환불을
          만들지 않고 기존 결과를 조회해야 합니다. “이 node는 대개 한 번 실행된다”는 기대나
          in-memory flag는 장애 경계를 넘지 못합니다.
        </p>
        <p>
          Human approval은 interrupt payload를 JSON-serializable data로 내보내고 durable
          checkpointer에 state를 저장한 뒤 중단합니다. Resume input은 승인 여부와 reviewer ID,
          policy version을 검증한 다음 state update로 남깁니다.
        </p>
        <p>
          승인 전에 tool call을 실행하거나 오래된 approval을 최신 policy에 그대로 적용해서는 안
          됩니다. Timeout, 취소와 거절도 정상적인 terminal state로 설계해야 합니다.
        </p>

        <div
          id="paper-langgraph-durable-execution"
          className="not-prose scroll-mt-24"
        >
          <CitationBlock
            source="LangGraph official documentation — Persistence, Replay and Interrupts"
            citeKey={3}
            href="https://docs.langchain.com/oss/python/langgraph/persistence"
          >
            문제: stateful run이 실패하거나 외부 승인을 기다릴 때 진행 상태를 잃고 side effect를
            중복할 수 있습니다. 기여: 공식 문서는 thread checkpoint, state history, pending writes,
            replay·fork·update와 interrupt/resume 규칙을 설명하며 idempotent task를 요구합니다.
            전제: durable checkpointer, serializable state, stable thread identity와 해당 API semantics를
            따르는 workflow입니다. 근거 범위: LangGraph persistence와 resume 동작입니다. 하지 않는
            주장: checkpoint가 외부 API를 transaction으로 만들거나 exactly-once delivery·업무
            correctness를 자동으로 보장하고, cross-thread store와 graph checkpoint가 같은 저장소
            의미를 가진다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
