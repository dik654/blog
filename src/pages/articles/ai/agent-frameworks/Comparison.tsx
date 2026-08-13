import { CitationBlock } from "@/components/ui/citation";
import ComparisonDetailViz from "./viz/ComparisonDetailViz";

const RUNTIME_BOUNDARIES = [
  {
    name: "Provider SDK + direct code",
    owns: "Application이 loop·state DB·retry·interrupt·trace를 모두 소유",
    constraint: "짧고 단일한 workflow에는 명확하지만 durable recovery를 직접 구현해야 함",
  },
  {
    name: "LangChain · LangGraph",
    owns: "상위 agent integration과 낮은 수준의 thread state·checkpoint orchestration을 분리",
    constraint: "State schema·node boundary·replay 가능한 side effect를 명시해야 함",
  },
  {
    name: "LlamaIndex",
    owns: "Tool loop와 workflow를 retrieval·index·query engine 등 data layer 가까이에서 구성",
    constraint: "Data/RAG integration이 핵심이 아니라면 채택 범위가 불필요하게 넓어질 수 있음",
  },
  {
    name: "AutoGen",
    owns: "AgentChat의 상위 agents·teams와 Core의 event-driven message runtime을 구분",
    constraint: "단일 업무 workflow보다 message-based multi-agent 요구가 실제로 있는지 확인",
  },
  {
    name: "CrewAI",
    owns: "Crews의 role·task process와 Flows의 event-driven state·persistence를 구분·조합",
    constraint: "Crew autonomy와 결정적인 Flow transition을 어디서 나눌지 먼저 정의",
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        제품 목록이 아니라 runtime이 소유할 state scope와 실패 경계를 비교한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Framework 비교표는 흔히 tool 수, memory, multi-agent 지원 여부에 check mark를
          붙이지만, 이런 기능은 version마다 빠르게 바뀌고 같은 이름도 보장 수준이 다릅니다.
          “Persistence 지원”이 in-memory chat history인지 durable database checkpoint인지,
          resume할 때 completed task를 재실행하는지, 외부 side effect의 idempotency를 누가
          책임지는지를 확인해야 실제 선택에 도움이 됩니다.
        </p>
        <p>
          아래 표는 2026년 8월 13일 공식 문서에서 읽을 수 있는 현재 계층을 runtime ownership
          관점으로 요약한 snapshot입니다. Stable API도 이후 바뀔 수 있으며, managed platform
          기능과 open-source library의 보장을 섞어 읽어서는 안 됩니다. 특히 durable execution은
          LangGraph만의 개념이 아닙니다. CrewAI Flows도 persistence·resume·fork를 제공하고,
          다른 general-purpose workflow engine이나 application code로도 구현할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[820px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3 font-semibold">선택지</th>
              <th className="border-b border-border px-4 py-3 font-semibold">소유하는 실행 경계</th>
              <th className="border-b border-border px-4 py-3 font-semibold">채택 전에 확인할 제약</th>
            </tr>
          </thead>
          <tbody>
            {RUNTIME_BOUNDARIES.map((item) => (
              <tr key={item.name} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">{item.name}</th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.owns}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.constraint}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>LlamaIndex는 data/RAG 계층과 tool workflow가 가까울 때 비교한다</h3>
        <p>
          LlamaIndex의 현재 agent 문서는 LLM, memory와 tools를 묶는 agent를 설명하며,
          <code>FunctionAgent</code>가 message history와 tool schema를 model에 보내고 tool
          result를 다시 history에 넣는 loop를 보여 줍니다. Retriever, query engine, index와
          document processing이 이미 LlamaIndex에 있다면 환불 정책 검색을 agent tool로 연결하는
          비용이 작습니다. 반대로 환불 API orchestration이 핵심이고 retrieval은 단순 HTTP call
          하나라면 data framework 전체를 runtime 기준으로 삼을 이유는 줄어듭니다.
        </p>
        <p>
          공식 문서가 직접 LLM call과 manual tool loop도 함께 보여 준다는 점은 중요합니다.
          Framework abstraction을 채택하기 전에 direct baseline을 만들 수 있고, 필요한 memory,
          context, event와 persistence만 단계적으로 가져올 수 있기 때문입니다. 이름이 agent
          framework라고 해서 모든 loop를 한 abstraction에 넣어야 하는 것은 아닙니다.
        </p>

        <div id="paper-llamaindex-agents" className="not-prose scroll-mt-24">
          <CitationBlock
            source="LlamaIndex official documentation — Agents"
            citeKey={4}
            href="https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/"
          >
            문제: LLM이 application data와 tools를 반복 호출하면서 memory와 result를 유지해야
            합니다. 기여: 현재 공식 문서는 FunctionAgent를 포함한 agent loop, tool, memory와
            LlamaIndex data component의 연결 방식을 설명하고 direct/manual loop와 abstraction을
            함께 제시합니다. 전제: 해당 LlamaIndex version, provider tool-calling capability와
            선택한 workflow·storage 구성입니다. 근거 범위: 현재 공개 agent API와 data integration
            계층입니다. 하지 않는 주장: LlamaIndex가 모든 RAG 결과를 정확하게 만들거나 모든
            workflow에 durable exactly-once execution을 보장하고, data layer가 없는 application에도
            가장 작은 선택이라는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <h3>AutoGen은 AgentChat과 Core runtime 중 필요한 계층을 구분한다</h3>
        <p>
          AutoGen의 현재 문서에서 AgentChat은 agents와 teams에 기본 pattern을 제공하는 상위
          API이고, <code>autogen-core</code>는 message, agent lifecycle과 event-driven execution을
          더 직접 다루는 낮은 수준의 runtime입니다. 여러 agent가 typed message를 주고받고 local
          또는 distributed runtime으로 확장해야 한다면 Core의 ownership이 비교 대상이 됩니다.
          하지만 환불 조회→승인→API처럼 한 state machine으로 분명한 작업에 여러 역할을 배치하면
          상태와 책임만 늘 수 있으므로 direct workflow와 먼저 비교해야 합니다.
        </p>

        <div id="paper-autogen-agentchat" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Microsoft AutoGen official documentation — AgentChat and Core runtime"
            citeKey={5}
            href="https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/index.html"
          >
            문제: multi-agent application이 agent behavior, team pattern, message routing과 runtime
            lifecycle을 서로 다른 수준에서 제어해야 합니다. 기여: 현재 공식 문서는 초심자용
            AgentChat이 Core 위에 놓이며, advanced use case에는 event-driven Core API를 사용할 수
            있다고 구분합니다. 전제: stable documentation에 대응하는 package version과 message
            serialization·runtime configuration입니다. 근거 범위: AutoGen의 현재 계층과 API
            책임입니다. 하지 않는 주장: agent 수를 늘리면 품질이 오르거나 AgentChat이 durable
            business workflow의 모든 checkpoint·idempotency·authorization을 자동으로 해결한다는
            뜻은 아닙니다.
          </CitationBlock>
        </div>

        <h3>CrewAI에서는 Crew의 collaboration과 Flow의 execution state를 분리한다</h3>
        <p>
          CrewAI의 <strong>Crew</strong>는 role, goal, tool을 가진 agent와 task·process를 묶는
          collaboration abstraction입니다. 연구·작성처럼 역할별 자율성이 실제로 필요한 subtask에
          맞습니다. <strong>Flow</strong>는 start·listen·router 같은 event-driven transition과
          state를 중심으로 control flow를 명시하며 Crew를 한 step 안에서 호출할 수도 있습니다.
          환불 승인과 API 호출처럼 audit 가능한 순서가 중요한 부분은 Flow나 일반 workflow로
          두고, 해석이 필요한 좁은 단계에만 Crew를 넣는 식으로 책임을 나눌 수 있습니다.
        </p>
        <p>
          Current CrewAI documentation에는 Crew execution checkpoint와 Flow의 persistence,
          resume·fork가 포함되어 있으므로 “CrewAI는 collaboration만 하고 durable state는 없다”라고
          비교해서는 안 됩니다. 대신 어느 state가 저장되는지, 재개 때 어떤 listener·side effect가
          다시 실행되는지, storage와 serializer를 누가 운영하는지, version upgrade에서 기존 run을
          읽을 수 있는지를 실제 candidate version으로 검증합니다.
        </p>

        <div id="paper-crewai-crews" className="not-prose scroll-mt-24">
          <CitationBlock
            source="CrewAI official documentation — Crews"
            citeKey={6}
            href="https://docs.crewai.com/en/concepts/crews"
          >
            문제: 역할이 다른 agents와 tasks를 하나의 process로 구성하고 실행 결과를 관리해야
            합니다. 기여: CrewAI 문서는 Crew, Agent, Task와 sequential·hierarchical process,
            execution 및 checkpoint 관련 현재 API를 설명합니다. 전제: 문서에 표시된 CrewAI version,
            구성한 process·storage·tool behavior입니다. 근거 범위: Crew abstraction과 현재 실행
            기능입니다. 하지 않는 주장: 조직 역할을 흉내 내는 것이 항상 single agent보다 정확하고
            저렴하거나, Crew checkpoint가 외부 side effect의 idempotency와 업무 correctness를
            자동 보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <div id="paper-crewai-flows" className="not-prose scroll-mt-24">
          <CitationBlock
            source="CrewAI official documentation — Flows"
            citeKey={7}
            href="https://docs.crewai.com/en/concepts/flows"
          >
            문제: agentic subtask를 조건·event·state가 있는 auditable workflow 안에서 실행하고
            중단된 run을 이어야 합니다. 기여: 현재 공식 문서는 Flow state, routing, persistence,
            resume와 fork 및 Crew integration을 설명합니다. 전제: 해당 CrewAI version과
            <code>@persist</code>·storage configuration, serializable state와 application의
            idempotent side effect입니다. 근거 범위: Flow가 공개한 orchestration semantics입니다.
            하지 않는 주장: Flow가 모든 failure에서 exactly once를 보장하거나 LangGraph와 API·state
            scope가 동일하고, framework 선택만으로 policy와 evaluation이 완성된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-8">
        <ComparisonDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>환불 기준 workflow를 동일하게 구현해 paired evaluation한다</h3>
        <p>
          Candidate를 두세 개로 줄였다면 같은 model snapshot, prompt, tool schema, policy와 test
          data로 direct implementation과 framework implementation을 만듭니다. 정상 환불뿐 아니라
          주문 없음, 정책 evidence 누락, 승인 거절, timeout, API 429·500, API 성공 직후 process
          crash, receipt 불일치와 duplicate resume를 주입합니다. 각 input의 결과를 짝지어 비교해야
          framework 변경과 model variance가 섞이지 않습니다.
        </p>
        <p>
          측정값은 최종 성공률만으로 부족합니다. 올바른 state transition 비율, unauthorized tool
          call과 duplicate refund가 0인지, crash 뒤 resume 위치, checkpoint write 수와 state 크기,
          trace completeness, human wait를 제외한 p50·p95 latency, model token, storage·network cost를
          봅니다. 개발 측면에서는 failure를 재현하는 데 걸린 시간, 새 field 추가량, custom retry와
          migration code의 크기도 기록합니다. Direct code가 이 기준을 더 단순하게 만족한다면
          framework를 도입하지 않는 것이 합리적인 결론입니다.
        </p>

        <h3>Version pinning은 package뿐 아니라 실행 계약 전체를 묶는다</h3>
        <p>
          Package lockfile에 framework version을 pin하되 model snapshot, prompt, tool schema,
          state/checkpoint schema version, serializer, database migration과 retry policy도 같은 release
          manifest에 기록합니다. 새 code가 오래된 checkpoint를 읽을 수 있는지 fixture를 만들고,
          incompatible field는 명시적인 migration function으로 변환합니다. 실행 중인 run을 새 graph로
          무조건 replay하거나 기존 checkpoint를 조용히 무시해서는 안 됩니다.
        </p>
        <p>
          Upgrade는 release note만 읽고 끝내지 않고 golden trace replay, injected-failure suite와
          canary traffic으로 검증합니다. Acceptance gate에는 duplicate side effect 0, state migration
          success, policy verdict 동일성, 품질·latency·cost budget을 포함하고, 위반 시 package·graph·
          prompt·state reader를 함께 rollback할 수 있어야 합니다. 이렇게 보면 framework 선택은 예제
          코드가 짧은지를 고르는 일이 아니라, 수년간 유지할 실행 state와 recovery contract의
          owner를 정하는 일이라는 결론에 도달합니다.
        </p>
      </div>
    </section>
  );
}
