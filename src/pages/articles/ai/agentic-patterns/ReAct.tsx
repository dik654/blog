import ObservationLoopViz from "./viz/ObservationLoopViz";
import ToolBoundaryViz from "./viz/ToolBoundaryViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function ReAct() {
  return (
    <section id="react" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ReAct는 reasoning을 늘리는 기법보다 action 뒤의 외부 관찰로 판단을
        갱신하는 패턴이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          ReAct 논문은 reasoning trace와 task-specific action을 번갈아 생성해,
          reasoning이 plan과 예외를 관리하고 action이 knowledge base나
          environment에서 새 정보를 가져오게 했습니다. Production runtime에서는
          내부 reasoning 전체를 노출하는 것보다 tool name, validated arguments,
          observation, approval과 state change처럼 다시 검사할 수 있는 event를
          기록하는 편이 중요합니다.
        </p>
        <ExplainedFormula
          question="Agent loop에서 model의 제안, runtime의 실행, 다음 판단에 들어갈 state는 어떻게 이어질까요?"
          idea={
            <p>
              Model은 현재 observable state에서 action을 제안합니다. Runtime은
              authorization을 먼저 적용한 뒤 tool을 실행하거나 거부하고, typed
              observation과 action receipt를 사용해 다음 state를 갱신합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            a_t&\sim\pi_\theta(\cdot\mid s_t)\\
            o_t&=\mathcal E\!\left(\mathcal A(a_t)\right)\\
            s_{t+1}&=\mathcal U(s_t,a_t,o_t)
          \end{aligned}`}
          terms={[
            { symbol: String.raw`s_t`, name: "observable run state", description: "현재 objective·plan·artifact reference·최근 typed observation처럼 다음 decision에 허용된 상태입니다." },
            { symbol: String.raw`\pi_\theta`, name: "model policy", description: "State를 읽고 tool call·response·plan update 같은 다음 action 후보를 제안합니다." },
            { symbol: String.raw`\mathcal A`, name: "authorization", description: "Identity·resource·operation·approval·budget을 검사해 action을 허용하거나 명시적으로 거부합니다." },
            { symbol: String.raw`\mathcal E`, name: "executor", description: "허용된 action을 tool·environment에서 실행하고 status·payload·receipt를 만듭니다." },
            { symbol: String.raw`o_t`, name: "typed observation", description: "Success/error·source·timestamp·truncation·effect identity를 담은 다음 판단의 입력입니다." },
            { symbol: String.raw`\mathcal U`, name: "state update", description: "Action과 observation으로 plan status·artifact·budget·exit state를 갱신합니다." },
          ]}
          assumptions={[
            "Model proposal과 runtime authorization·execution이 같은 권한으로 합쳐져 있지 않습니다.",
            "Denied·timeout·empty result·partial effect가 서로 다른 typed observation으로 표현됩니다.",
            "각 iteration 뒤 verifier·budget·fatal error·approval wait를 확인하는 exit-state machine이 있습니다.",
          ]}
          interpretation="이 식은 model이 외부 세계를 직접 바꾸는 것이 아니라 proposal→authorization→execution→observation→state update를 거친다는 실행 계약입니다. 확률 모델의 정확도나 action 성공 확률을 계산하는 식은 아닙니다."
        />
      </div>

      <ObservationLoopViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Observation은 문자열 답변이 아니라 다음 decision의 입력 계약이다
        </h3>
        <p className="leading-8">
          Tool error를 정상 결과처럼 반환하거나 빈 결과와 timeout을 같은 값으로
          합치면 model은 잘못된 세계 상태를 가정합니다. Observation에는
          success/error status, typed payload, source, timestamp와 truncation
          여부를 담고, 큰 결과는 handle이나 artifact로 저장한 뒤 필요한 부분만
          context에 넣습니다. 같은 action을 재시도할 수 있다면 idempotency key와
          side-effect receipt도 필요합니다.
        </p>
      </div>

      <ToolBoundaryViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Exit condition은 “모델이 끝났다고 말함”보다 넓다</h3>
        <p className="leading-8">
          Final-output schema 충족, verifier pass, maximum turn·time·cost, 반복
          action 감지, fatal tool error와 human escalation을 별도 종료 상태로
          둡니다. Read-only search와 irreversible payment를 같은 permission
          path에 두지 않고 risk가 큰 action은 실행 직전에 fresh authorization을
          확인합니다. 이 경계가 없으면 grounded loop가 아니라 비용이 계속 늘거나
          side effect를 반복하는 loop가 됩니다.
        </p>
        <div id="paper-react" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="ReAct: Synergizing Reasoning and Acting in Language Models"
            citeKey={1}
            href="https://arxiv.org/abs/2210.03629"
          >
            Reasoning trace와 task-specific action을 번갈아 생성해 외부
            observation으로 계획과 지식을 갱신하는 패턴을 제안합니다. 논문의
            QA·interactive decision task 결과가 production authorization,
            exactly-once effect, private reasoning 공개를 보장하는 것은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
