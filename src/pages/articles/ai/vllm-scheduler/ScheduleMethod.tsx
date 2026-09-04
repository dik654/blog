import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ProgressGapViz from "./viz/ProgressGapViz";
import SchedulerLoopViz from "./viz/SchedulerLoopViz";

const GAP_TERMS = [
  {
    symbol: "n_r^{target}",
    name: "현재 목표 위치",
    description:
      "요청 r이 현재 시점에 계산을 마쳐야 하는 token 위치입니다. Prompt·output placeholder·speculative 후보 때문에 단순 prompt 길이와 항상 같지는 않습니다.",
  },
  {
    symbol: "n_r^{computed}",
    name: "이미 계산한 token 수",
    description:
      "현재 request state가 model forward를 완료했다고 기록한 token 수입니다.",
  },
  {
    symbol: "n_r^{need}",
    name: "남은 계산량",
    description:
      "목표와 현재 진행량의 차이입니다. 음수가 되지 않도록 0에서 자릅니다.",
  },
  {
    symbol: "n_r^{sched}",
    name: "이번 iteration 배정량",
    description:
      "남은 계산량 가운데 token budget·model length·encoder·KV 조건을 통과해 실제 배정한 token 수입니다.",
  },
  {
    symbol: "B_{tok}",
    name: "Iteration token budget",
    description:
      "이번 model execution에 넣을 수 있는 scheduled token의 전체 상한입니다.",
  },
] as const;

const PRIORITY_TERMS = [
  {
    symbol: "p_r",
    name: "Request priority",
    description: "vLLM priority policy에서는 값이 작을수록 먼저 고려됩니다.",
  },
  {
    symbol: "a_r",
    name: "Arrival time",
    description: "Priority가 같을 때 먼저 도착한 요청을 앞세우는 tie-break 값입니다.",
  },
] as const;

export default function ScheduleMethod({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="schedule-method" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        진행률을 token 차이로 바꾸면 prefill과 decode가 같은 budget에 섭니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Prompt를 처음 읽는 prefill은 한 번에 수백 token이 남을 수 있지만 일반적인 decode는 다음 token 하나만 필요합니다. Speculative
          decoding에서는 검증할 후보가 여러 개 생길 수 있습니다. V1 scheduler는 이 서로 다른 일을 “현재 목표 위치까지 아직 계산하지 않은 token 수”로 바꾸어 같은
          token budget에서 비교합니다.
        </p>
      </div>

      <ProgressGapViz />

      <ExplainedFormula
        question="Prompt·decode·speculative verification을 한 scheduler가 같은 단위로 배정하려면 어떻게 표현해야 할까요?"
        idea={
          <>
            요청마다 목표 위치와 이미 계산한 위치의 차이를 구한 뒤, 남은 budget과
            다른 hard constraint 안에서 이번 배정량을 자릅니다. 아래 식은 개념
            모델이며 실제 V1 코드는 model length·encoder budget·KV block alignment와
            speculative token 수를 추가로 조정합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
n_r^{need} &= \max\!\left(0,\;n_r^{target}-n_r^{computed}\right) \\
0 \le n_r^{sched} &\le n_r^{need} \\
\sum_{r\in\mathcal S} n_r^{sched} &\le B_{tok}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\underbrace{n_r^{need}}_{\text{허용 경계 판정}} &= \underbrace{\max\!\left(0,\;n_r^{target}-n_r^{computed}\right)}_{\text{경계 후보 선택}} \\
0 \le n_r^{sched} &\le n_r^{need} \\
\sum_{r\in\mathcal S} n_r^{sched} &\le \underbrace{B_{tok}}_{\text{오른쪽 항으로 결과 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\max\!\left(0,\;n_r^{target}-n_r^{computed}\right)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","요청마다"] },
          { expression: String.raw`n_r^{need}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","요청마다"] },
          { expression: String.raw`B_{tok}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","요청마다"] },
        ]}
        terms={GAP_TERMS}
        assumptions={[
          "각 request의 target·computed counter가 같은 tokenizer와 position 기준을 사용합니다.",
          "집합 S에는 이번 iteration에서 token을 하나 이상 배정받은 request만 포함합니다.",
          "이 부등식은 token budget만 나타냅니다. sequence cap과 KV·encoder memory가 부족하면 더 줄어듭니다.",
        ]}
        interpretation="2,000-token prefill이 남은 A와 decode 1 token이 필요한 B가 있을 때 B=1,024라면 둘을 합쳐 2,001 token을 그대로 넣을 수 없습니다. B에 1 token을 주고 A를 최대 1,023-token chunk로 자르는 식의 정책 결정이 필요합니다."
        title="Request progress gap과 token-budget 보존"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="running-waiting-order" className="scroll-mt-20">
          현재 V1은 RUNNING을 검토한 뒤 남은 자리로 WAITING을 받습니다
        </h3>
        <p className="leading-8">
          이미 답을 stream하는 RUNNING 요청을 오래 멈추면 token 사이의 간격인 ITL이 바로 나빠집니다. 현재 V1의 기본 흐름은 RUNNING queue를 먼저 순회하며
          token과 KV slot을 배정하고 preemption이 발생하지 않았으며 request slot과 budget이 남아 있을 때 WAITING queue의 요청을 받습니다.
        </p>
        <p className="leading-8">
          RUNNING이라고 언제나 실행되는 것은 아닙니다. Budget·KV·model length 같은 조건을 통과하는 요청부터 진행합니다.
        </p>
      </div>

      <SchedulerLoopViz />

      <ExplainedFormula
        question="Priority scheduling에서 두 요청의 우선순위가 같다면 무엇으로 순서를 정할까요?"
        idea={
          <>
            현재 공식 설정은 작은 priority 값을 먼저 보고, 같은 값이면 arrival
            time이 이른 요청을 먼저 보는 lexicographic order를 사용합니다. FCFS는
            arrival time만으로 정렬합니다.
          </>
        }
        formula={String.raw`r_i \prec r_j
\quad\Longleftrightarrow\quad
(p_i,a_i)<_{\mathrm{lex}}(p_j,a_j)`}
        annotatedFormula={String.raw`r_i \prec r_j
\quad\Longleftrightarrow\quad
(p_i,a_i)<\underbrace{_{\mathrm{lex}}(p_j,a_j)}_{\text{오른쪽 항으로 결과 계산}}`}
        operations={[
          { expression: String.raw`_{\mathrm{lex}}(p_j,a_j)`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","현재 공식 설정은 작은 priority 값을 먼저 보고, 같은","값이면 arrival time이 이른 요청을 먼저 보는","lexicographic order를 사용합니다."] },
        ]}
        terms={PRIORITY_TERMS}
        assumptions={[
          "priority policy가 활성화되어 있고 client가 의미가 일관된 priority 값을 보냅니다.",
          "작은 priority 숫자가 더 높은 우선순위라는 vLLM 계약을 따릅니다.",
          "우선순위는 admission 순서를 조절할 뿐 token·KV hard constraint를 무시하지 못합니다.",
        ]}
        interpretation="priority=0 요청은 priority=5 요청보다 나중에 들어와도 먼저 고려될 수 있습니다. 높은 우선순위 요청이 계속 도착하면 낮은 우선순위 요청이 오래 기다릴 수 있으므로 queue age와 starvation을 별도 SLO로 둬야 합니다."
        title="Priority policy의 정렬 기준"
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("priority-ordering", codeRefs["priority-ordering"])
        }
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="closed-loop-update" className="scroll-mt-20">
          Scheduler는 output이 다음 입력이 되는 closed-loop입니다
        </h3>
        <p className="leading-8">
          Worker가 model forward를 마치면 실제로 계산한 token, sampling 결과,
          speculative acceptance, stop·cancel 상태를 engine에 돌려줍니다. Engine은
          <code>num_computed_tokens</code>와 output state를 갱신하고 완료 요청의
          resource를 반환합니다.
        </p>
        <p className="leading-8">
          갱신 없이 다음 schedule을 만들면 이미 처리한 token을 다시 넣거나 끝난 요청이 KV block을 계속 점유할 수 있습니다. Schedule과 output update는
          두 함수가 아니라 하나의 상태 전이 루프로 이해해야 합니다.
        </p>
        <p className="leading-8">
          전체 engine 경계와 timestamp는 <Link to="/ai/vllm-serving#v1-boundary">vLLM
          serving architecture</Link>, speculative acceptance가 state commit에 미치는
          영향은 <Link to="/ai/vllm-spec-decode#draft-verify">Speculative Decoding</Link>에서
          이어집니다.
        </p>
      </div>
    </section>
  );
}
