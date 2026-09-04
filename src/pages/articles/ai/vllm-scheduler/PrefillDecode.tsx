import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ChunkedPrefillViz from "./viz/ChunkedPrefillViz";
import SchedulerKnobViz from "./viz/SchedulerKnobViz";

const CHUNK_TERMS = [
  {
    symbol: "P",
    name: "남은 prompt token",
    description: "아직 prefill하지 않은 prompt 구간의 길이입니다.",
  },
  {
    symbol: "c",
    name: "Prefill chunk 상한",
    description: "긴 prefill 요청 하나에 한 iteration에서 배정할 최대 token 수입니다.",
  },
  {
    symbol: "C",
    name: "필요한 chunk 수",
    description: "남은 prompt를 c 이하의 조각으로 처리하는 데 필요한 iteration 수의 하한입니다.",
  },
  {
    symbol: "t_{launch+sched}",
    name: "조각마다 드는 고정 비용",
    description: "Scheduling·batch 준비·kernel launch처럼 chunk가 늘 때 반복되는 비용입니다.",
  },
] as const;

const KNOBS = [
  {
    name: "max_num_batched_tokens",
    controls: "한 iteration의 전체 token budget",
    watch: "GPU utilization · step time · ITL p95",
  },
  {
    name: "max_num_seqs",
    controls: "한 번에 진행할 request 상한",
    watch: "KV pressure · queue · CPU scheduling",
  },
  {
    name: "long_prefill_token_threshold",
    controls: "긴 prefill 요청의 한-step token 상한",
    watch: "Prefill chunk 수 · TTFT · decode stall",
  },
  {
    name: "scheduling_policy",
    controls: "FCFS 또는 priority queue ordering",
    watch: "Queue age · starvation · tenant SLO",
  },
] as const;

export default function PrefillDecode({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="prefill-decode" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        통합 token budget은 단위를 맞출 뿐 prefill·decode 충돌은 남깁니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          긴 prefill은 여러 prompt token을 병렬 처리해 큰 GEMM을 만들기 좋지만 한 iteration을 오래 차지할 수 있습니다. Decode는 active
          request마다 보통 한 token만 계산하므로 개별 연산은 작지만 이미 stream을 시작한 사용자에게 규칙적으로 돌아와야 합니다. 둘을 같은 token budget으로
          표현해도 큰 prefill이 budget과 step time을 독점하면 decode ITL이 튈 수 있습니다.
        </p>
        <p className="leading-8">
          Chunked prefill은 긴 prompt를 여러 iteration으로 나누고 그 사이에 decode를 섞어 이 충돌을 조절합니다. Chunk가 작을수록 decode가 끼어들
          기회는 늘어나지만 prompt 하나를 끝내기 위한 iteration과 고정 overhead도 늘어납니다. 그러니 “작을수록 좋다”가 아니라 workload의 prompt 길이와
          ITL SLO가 만나는 지점을 측정해야 합니다.
        </p>
      </div>

      <ChunkedPrefillViz />

      <ExplainedFormula
        question="4,096-token prompt를 512-token chunk로 나누면 무엇을 얻고 무엇을 더 지불할까요?"
        idea={
          <>
            Chunk 수는 prompt 길이를 chunk 상한으로 나눈 올림입니다. 각 조각 사이에
            decode를 배치할 기회가 생기지만, scheduler와 batch 준비 같은 고정 비용도
            C번 반복됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
C &= \left\lceil \frac{P}{c} \right\rceil \\
T_{prefill,total} &\approx \sum_{j=1}^{C}T_{model}(c_j)
 + C\,t_{launch+sched}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
C &= \underbrace{\left\lceil \frac{P}{c} \right\rceil}_{\text{기준량당 비율}} \\
T_{prefill,total} &\approx \sum_{j=1}^{C}T_{model}(c_j)
 + C\,t_{launch+sched}
\end{aligned}`}
        operations={[
          { expression: String.raw`\left\lceil \frac{P}{c} \right\rceil`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Chunk 수는 prompt 길이를 chunk 상한으로 나눈","올림입니다."] },
        ]}
        terms={CHUNK_TERMS}
        assumptions={[
          "각 chunk 크기 c_j는 c 이하이고 전체 합이 P입니다.",
          "두 번째 식은 비용을 이해하기 위한 분해이며 kernel overlap·CUDA Graph·batch composition은 별도 측정합니다.",
          "Chunk 사이에 decode가 실제로 배정되는지는 arrival·priority·token/KV budget에 달려 있습니다.",
        ]}
        interpretation="P=4,096, c=512이면 최소 8개 chunk가 필요합니다. Decode가 최대 한 번의 긴 full-prefill 동안 멈추는 대신 더 짧은 경계마다 다시 고려될 수 있지만, prompt 완료 시간과 총 연산 효율이 자동으로 좋아지는 것은 아닙니다."
        title="Chunk 수와 반복 overhead의 맞바꿈"
      />
      <CodeViewButton
        onClick={() => onCodeRef("preempt-chunk", codeRefs["preempt-chunk"])}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-sarathi" className="scroll-mt-20">
          Sarathi-Serve는 decode를 멈추지 않도록 prefill을 남는 예산에 맞춥니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2403.02310">
            Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve
          </a>
          는 full prefill이 ongoing decode를 오래 멈추게 하는 generation stall을 문제로
          삼았습니다. 논문은 prompt를 비슷한 크기의 chunk로 나누고, 먼저 decode
          token을 배치한 뒤 남은 token budget에 prefill chunk를 함께 넣는
          stall-free schedule을 제안합니다.
        </p>
        <p className="leading-8">
          Pipeline parallel 환경에서는 iteration의 token 수를 더 균일하게 만들어
          pipeline bubble도 줄이려 했습니다. 배워야 할 것은 특정 성능 배수가 아니라{" "}
          <strong>prefill 효율과 decode tail latency를 같은 batch composition 문제로
          다룬다</strong>는 아이디어입니다.
        </p>
        <p className="leading-8">
          논문의 2.6×, 3.7×, 5.6× 결과는 명시된 model과 A100, pipeline 구성, workload, latency constraint에서 나온 system 결과이며
          최신 vLLM에 옵션을 하나 켜면 그대로 재현된다는 뜻이 아닙니다.
        </p>

        <h3 id="scheduler-knobs" className="scroll-mt-20">
          설정값은 단독 knob가 아니라 관측 지표와 한 쌍으로 관리합니다
        </h3>
      </div>

      <SchedulerKnobViz items={KNOBS} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="workload-replay" className="scroll-mt-20">
          평균 길이가 아니라 prompt·output·arrival의 분포를 보존해 replay합니다
        </h3>
        <p className="leading-8">
          평균 prompt가 1,000 token인 두 traffic도 전부 1,000 token인 경우와 99%가
          짧고 1%가 수만 token인 경우는 scheduler에 주는 압력이 다릅니다. 후자는
          긴 prompt가 들어온 순간 TTFT·ITL tail과 KV pressure가 함께 튈 수 있습니다.
        </p>
        <p className="leading-8">
          Production trace에서 prompt/output histogram과 arrival burst, priority·tenant
          mix를 보존해야 합니다. 비교 지표는 p50만이 아니라 p95·p99 TTFT와 ITL,
          queue age, preemption, SLO goodput을 같은 run에서 함께 봅니다.
        </p>
        <p className="leading-8">
          Priority가 높은 요청이 계속 들어오면 낮은 priority 요청은 hard constraint를
          모두 통과할 수 있어도 오랫동안 선택되지 않는 starvation이 생길 수
          있습니다. Queue age 상한이나 tenant별 SLO를 두지 않은 priority policy는
          “중요 요청이 빠르다”는 장점만 보고 다른 사용자의 무기한 대기를 숨길 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
