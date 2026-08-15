import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import AgentReActViz from "./viz/AgentReActViz";
import TimelineDetailViz from "./viz/TimelineDetailViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Framework는 model 지능을 높이는 제품이 아니라 실행 state·recovery·policy를 소유하는 runtime 선택이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          고객이 “주문 A-104를 환불해 주세요”라고 요청했다고 생각해 봅시다. System은
          고객과 주문을 조회하고, 당시 정책을 확인한 다음, 금액이 크면 담당자의 승인을
          기다려야 합니다. 승인을 받은 뒤 환불 API를 한 번만 호출하고, 마지막으로 receipt가
          실제 환불 건과 일치하는지 확인해야 완료됩니다. Model은 다음 행동을 제안할 수 있지만,
          어느 단계까지 끝났는지 저장하고 실패 후 어디서 재개할지 결정하는 일은 model 자체의
          능력이 아닙니다.
        </p>
        <p>
          <strong>Agent framework</strong>는 이 실행 문제를 반복해서 풀 수 있도록 model·tool
          adapter, state transition, retry, checkpoint, interrupt와 trace를 묶어 제공하는
          library입니다. 더 정확한 답을 만들어 주는 새 model이 아니라, application이 직접
          구현하던 실행 책임 가운데 일부를 가져가는 runtime이라는 뜻입니다. 따라서 먼저 물어야
          할 질문은 “어느 framework가 가장 똑똑한가?”가 아니라 “state와 recovery를 누가
          소유해야 하는가?”입니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <AgentReActViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>작은 tool loop는 provider SDK와 application code만으로도 충분하다</h3>
        <p>
          환불 workflow의 최소 state는 대화 전체가 아니라 다음 단계를 판정하는 데 필요한
          값입니다. 예를 들면 <code>request_id</code>, <code>phase</code>, customer·order
          record, 적용한 policy version, approval status, refund idempotency key, receipt,
          attempt와 error를 둡니다. Application은 이 state를 model에 필요한 만큼만 보여 주고,
          model이 직접 답하거나 tool call을 제안하면 schema와 권한을 검증한 뒤 실행 결과를
          다시 state에 기록할 수 있습니다.
        </p>
        <pre className="whitespace-pre-wrap break-words">
          <code>{`while state.phase != "completed":
    proposal = model.decide(public_view(state), tools)
    action = validate_proposal(proposal, policy, caller)
    observation = execute_or_pause(action)
    state = verify_and_transition(state, action, observation)
    save_trace(state)`}</code>
        </pre>
        <p>
          요청 한 건 안에서 짧게 끝나고, process가 죽으면 처음부터 안전하게 다시 실행할 수
          있으며, 사람 승인을 며칠 기다리지 않는다면 이 정도가 오히려 이해하고 시험하기
          쉽습니다. Framework를 쓰지 않는다고 agent가 아니거나 production에 부적합한 것도
          아닙니다. 다만 state 저장·재시도·승인 대기·timeout·trace를 application 곳곳에서
          중복 구현하기 시작하면 runtime을 도입할 이유가 생깁니다.
        </p>

        <h3>ReAct를 숨은 추론 공개가 아니라 네 개의 state transition으로 읽는다</h3>
        <p>
          <strong>ReAct</strong>(Reasoning and Acting)는 language model이 판단과 행동을
          번갈아 수행하고 환경의 observation을 다음 판단에 반영하는 패턴입니다. 운영
          runtime에서는 이를 <strong>Decide→Act→Observe→Verify</strong>로 구체화할 수
          있습니다. Decide는 다음 tool 또는 종료 candidate를 만들고, Act는 권한 검사를
          통과한 tool만 실행하며, Observe는 raw tool result를 typed state로 바꿉니다.
          Verify는 결과가 evidence·업무 불변식·완료 조건을 만족하는지 확인하고 다음 phase,
          retry 또는 human escalation을 정합니다.
        </p>
        <p>
          이 구조는 model의 private chain-of-thought를 저장하거나 사용자에게 공개하라는 요구가
          아닙니다. Runtime에 필요한 것은 선택한 action, tool input/output, validator verdict,
          state diff와 다음 transition처럼 외부에서 검증할 수 있는 trace입니다. ReAct의 방법과
          tool proposal 자체는
          <Link to="/ai/agent-loop-foundations"> Agent loop 정본</Link>에서 다루고, 여기서는
          그 loop를 어떤 runtime이 지속시키고 복구하는지만 다룹니다.
        </p>

        <div id="paper-react-agent-loop" className="not-prose scroll-mt-24">
          <CitationBlock
            source="ReAct: Synergizing Reasoning and Acting in Language Models"
            citeKey={1}
            href="https://arxiv.org/abs/2210.03629"
          >
            문제: reasoning만 생성하거나 action만 선택하는 방식은 외부 환경의 새 정보를
            서로 충분히 보완하지 못할 수 있습니다. 기여: 이 논문은 reasoning trace와
            environment action·observation을 interleave하는 ReAct prompt와 agent 결과를
            제시했습니다. 전제: 논문에 사용된 model, prompt, benchmark와 interactive
            environment 조건입니다. 근거 범위: 해당 QA·decision task에서 보고된 방법과
            실험입니다. 하지 않는 주장: 모든 production agent에 같은 loop가 최적이거나,
            공개된 reasoning text가 model 내부 계산의 충실한 설명이고 checkpoint·권한·복구까지
            제공한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-8">
        <TimelineDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Framework가 필요해지는 지점은 loop가 길어질 때가 아니라 복구 계약이 생길 때다</h3>
        <p>
          Tool을 열 번 호출한다고 곧바로 framework가 필요한 것은 아닙니다. Process restart
          뒤에도 같은 request를 이어야 하는지, 승인 대기 중 state를 inspect·수정해야 하는지,
          이미 성공한 환불 API를 replay할 가능성이 있는지, 과거 transition을 동일한 입력으로
          재현해야 하는지가 판단 기준입니다. 이 요구가 생기면 durable checkpoint,
          interrupt/resume, idempotency, versioned state schema와 observability가 하나의 실행
          계약이 됩니다.
        </p>
        <p>
          반대로 framework는 tool의 권한을 저절로 최소화하거나 verifier를 만들어 주지
          않습니다. Capability, 검증과 recovery policy의 일반 원리는
          <Link to="/ai/llm-harness"> harness 정본</Link>이 소유하며, 여러 agent의 parallel
          update와 reducer 문제는
          <Link to="/ai/multi-agent-implementation"> multi-agent 구현 정본</Link>에서
          확장합니다. 이 글은 한 환불 workflow를 기준으로 runtime 선택만 비교합니다.
        </p>
        <ContentBoundary article="agent-frameworks" />
      </div>
    </section>
  );
}
