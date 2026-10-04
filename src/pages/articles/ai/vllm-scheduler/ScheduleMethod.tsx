import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
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
      "스케줄러가 관리하는 계산 진행 위치입니다. 비동기 실행이나 계획 단계의 갱신에서는 실제 GPU 완료 시점과 구분해야 합니다.",
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
    description:
      "Priority가 같을 때 먼저 도착한 요청을 앞세우는 tie-break 값입니다.",
  },
] as const;

export default function ScheduleMethod({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="space-y-16">
      <section
        id="schedule-method"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <span id="running-waiting-order" className="scroll-mt-20" />
        <span id="closed-loop-update" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          7. 5개 예산을 1·1·3으로 쓰고 결과로 위치를 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            R1의 남은 양은 9−8=1입니다. R2도 1을 배정받아 전체 예산 5 중 3이
            남습니다. P는 남은 입력 12, 요청별 상한 4, 전체 잔여 3의 조건을 받아
            3을 배정받습니다. 합계 1+1+3=5이고 요청 수는 3입니다. (가정)
          </p>
          <p>
            계산이 끝나 R1·R2가 각각 다음 출력을 얻고 P는 입력 3개를 처리했다고
            합시다. P의 위치는 3, 남은 입력은 9입니다. 같은 조건이 이어지면 P의
            위치는 3→6→9→12로 바뀝니다. 마지막 입력까지 처리한 뒤 첫 출력을
            고릅니다. (가정)
          </p>
          <p>
            기본 흐름은 RUNNING을 먼저 검토한 뒤 선점이 없고 예산과 요청 자리가
            남으면 WAITING을 검토합니다. 이 순서 자체가 모든 RUNNING의 실행이나
            모든 WAITING의 공정한 대기를 보장하지는 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Prompt·decode·speculative verification을 한 scheduler가 같은 단위로 배정하려면 어떻게 표현해야 할까요?"
          idea={
            <>
              요청마다 목표 위치와 이미 계산한 위치의 차이를 구한 뒤, 남은
              budget과 다른 hard constraint 안에서 이번 배정량을 자릅니다. 아래
              식은 개념 모델이며 실제 V1 코드는 model length·encoder budget·KV
              block alignment와 speculative token 수를 추가로 조정합니다.
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
            {
              expression: String.raw`\max\!\left(0,\;n_r^{target}-n_r^{computed}\right)`,
              annotation: [
                "목표 위치에서 계산한 위치를 빼고 음수이면 0으로 제한합니다.",
                "이번 사례에서 R1과 R2는 각각 1이고 P는 3입니다.",
              ],
            },
            {
              expression: String.raw`n_r^{need}`,
              annotation: [
                "선택한 모든 요청의 배정량 합이 예산을 넘지 않아야 합니다.",
                "이번 사례에서 R1과 R2는 각각 1이고 P는 3입니다.",
              ],
            },
            {
              expression: String.raw`B_{tok}`,
              annotation: [
                "선택한 모든 요청의 배정량 합이 예산을 넘지 않아야 합니다.",
                "이번 사례에서 R1과 R2는 각각 1이고 P는 3입니다.",
              ],
            },
          ]}
          terms={GAP_TERMS}
          assumptions={[
            "각 request의 target·computed counter가 같은 tokenizer와 position 기준을 사용합니다.",
            "집합 S에는 이번 iteration에서 token을 하나 이상 배정받은 request만 포함합니다.",
            "이 부등식은 token budget만 나타냅니다. sequence cap과 KV·encoder memory가 부족하면 더 줄어듭니다.",
          ]}
          interpretation="R1과 R2에 각 1 token을 배정하면 예산 5 중 3이 남습니다. P의 남은 12를 chunk 상한 4로 줄여도 실제 배정은 남은 예산 3을 넘을 수 없습니다. 합계 1+1+3=5입니다. (가정)"
          title="Request progress gap과 token-budget 보존"
        />
        <ProgressGapViz />
        <SchedulerLoopViz />
      </section>
      <section
        id="scheduler-source"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 원문에서 12를 4로, 다시 3으로 줄이는 자리를 찾습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            코드 패널의 세 파일은 v0.27.1 commit
            6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 원문입니다. scheduler.py
            516–523행은 남은 양과 요청별 상한, 전체 잔여 예산을 순서대로
            적용합니다. P가 다음 실행부터 RUNNING에 있다면 9를 상한 4로, 잔여
            3으로 줄입니다. 처음 WAITING 수용도 별도 경로에서 잔여 예산을
            검사합니다.
          </p>
          <p>
            계획한 양은 631–638행에서 num_scheduled_tokens에 기록되고 전체
            예산에서 빠집니다. 요청이 나중에 선점되면 이미 배정한 양을 되돌리는
            분기도 있습니다. 결과 반영과 비동기 진행을 포함하면 counter가 언제
            앞서 갱신되는지도 함께 확인해야 하므로 num_computed_tokens를 항상
            GPU 완료의 증명으로 쓰지 않습니다.
          </p>
          <p>
            실제 상태에는 후보 token·출력 placeholder·인코더 입력·최대 길이·블록
            정렬이 추가됩니다. 이 사례는 해당 추가 조건이 작동하지 않는 설정을
            가정했습니다. 계산식과 코드의 차이를 숨기지 않고 이 경계에서 확장해
            읽습니다.
          </p>
        </div>
        <CodeViewButton
          label="실제 token 배정 조건"
          onClick={() => onCodeRef("preempt-chunk", codeRefs["preempt-chunk"])}
        />
      </section>
    </div>
  );
}
