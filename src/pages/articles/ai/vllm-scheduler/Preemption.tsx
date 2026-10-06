import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import PreemptionTraceViz from "./viz/PreemptionTraceViz";
import BatchingGenerationsViz from "./viz/BatchingGenerationsViz";
import SchedulerKnobViz from "./viz/SchedulerKnobViz";
const WASTE_TERMS = [
  {
    symbol: "n_r^{before}",
    name: "Preemption 전 계산량",
    description:
      "요청 r이 중단되기 직전까지 model forward를 마친 token 수입니다.",
  },
  {
    symbol: "n_r^{hit}",
    name: "재개 시 다시 쓸 수 있는 prefix",
    description:
      "다시 admission될 때 prefix cache 등으로 계산을 생략할 수 있는 token 수입니다. Hit가 없으면 0입니다.",
  },
  {
    symbol: "W_r^{recompute}",
    name: "반복 계산 token",
    description:
      "이전에 계산했지만 재개 과정에서 다시 prefill해야 하는 token 수입니다.",
  },
  {
    symbol: "C_{preempt}",
    name: "전체 preemption 비용",
    description:
      "반복 model compute와 queue·scheduler·cache 복구 시간을 합친 비용입니다.",
  },
] as const;

const OVERHEAD_TERMS = [
  {
    symbol: "t_{sched}",
    name: "Scheduling CPU 시간",
    description:
      "한 step 의 running 순회·admission·SchedulerOutput 직렬화에 드는 CPU 시간입니다. Running 수에 비례해 자랍니다.",
  },
  {
    symbol: "t_{gpu}",
    name: "GPU step 시간",
    description:
      "그 step 의 forward 가 GPU 에서 도는 시간입니다. Batch 의 token 수와 KV 읽기량이 정합니다.",
  },
  {
    symbol: "T_{sync}",
    name: "동기 step 주기",
    description:
      "Scheduling 이 끝나야 forward 를 시작하는 구조에서 step 하나가 차지하는 시간입니다.",
  },
  {
    symbol: "T_{async}",
    name: "비동기 step 주기",
    description:
      "다음 step 의 scheduling 을 이번 forward 와 겹치는 구조에서의 주기입니다.",
  },
  {
    symbol: "U",
    name: "GPU 작업 시간 비율",
    description: "Step 주기 가운데 GPU 가 실제로 일하는 비율입니다.",
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

export default function Preemption({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="space-y-16">
      <section id="preemption" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          12. 기록을 비운 뒤에는 실제 재사용한 양만 빼고 다시 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            P가 입력 8 token을 처리한 다른 시점에 저장 공간이 부족해 잠시
            빠졌다고 합시다. 재개 시 유효하게 재사용할 수 있는 기록이 3
            token이면 이전 계산 중 8−3=5 token을 다시 처리해야 합니다. 아직
            처리하지 않았던 입력은 이 반복량에 따로 더해집니다. (가정)
          </p>
          <p>
            원문의 _preempt_request는 저장 공간을 해제하고 상태를 PREEMPTED로
            바꾸며 계산 위치를 0으로 재설정합니다. 이후
            waiting.prepend_request를 호출하지만 앞 절에서 본 것처럼 실제 위치는
            queue 정책에 달려 있습니다. 재개 시 재사용량은 그때의 조회 결과로
            확인합니다.
          </p>
          <p>
            이 전환은 메모리 압박에 대응하는 절차이지만 무료가 아닙니다. 같은
            선점 1회라도 중단 위치와 재사용한 기록이 다르면 비용이 달라집니다.
            횟수만 보지 말고 반복 계산·대기·복원 시간을 같은 요청 기록에
            남깁니다.
          </p>
        </div>
        <ExplainedFormula
          question="Preemption 한 번이 실제로 반복시킨 계산량을 어떻게 추적할까요?"
          idea={
            <>
              중단 전에 계산한 token 가운데 재개 시 prefix cache로 다시 쓸 수
              있는 부분을 빼면 최소 반복 계산량을 얻습니다. 여기에 WAITING queue
              체류와 cache lookup·allocation 시간을 더해야 사용자가 체감한 전체
              비용이 됩니다.
            </>
          }
          formula={String.raw`\begin{aligned}
W_r^{recompute} &= \max\!\left(0,\;n_r^{before}-n_r^{hit}\right) \\
C_{preempt} &\approx T_{model}\!\left(W_r^{recompute}\right)
 + t_{requeue}+t_{restore}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
W_r^{recompute} &= \underbrace{\max\!\left(0,\;n_r^{before}-n_r^{hit}\right)}_{\text{중복 계산한 부분}} \\
C_{preempt} &\approx T_{model}\!\left(W_r^{recompute}\right)
 + t_{requeue}+t_{restore}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\max\!\left(0,\;n_r^{before}-n_r^{hit}\right)`,
              annotation: [
                "이전에 계산한 양에서 실제 재사용한 양을 빼고 0 미만은 자릅니다.",
                "중단 전에 계산한 token 가운데 재개 시 prefix",
                "cache로 다시 쓸 수 있는 부분을 빼면 최소 반복 계산량을",
                "얻습니다.",
              ],
            },
          ]}
          terms={WASTE_TERMS}
          assumptions={[
            "n_hit은 재개 시 실제 cache lookup 결과이며 preemption 전 cached token 수와 같다고 가정하지 않습니다.",
            "T_model은 반복 token 수에 완전히 선형이지 않을 수 있으므로 trace의 model execution time으로 검증합니다.",
            "한 요청이 여러 번 preempt되면 각 episode의 반복 계산과 queue 시간을 따로 기록한 뒤 합칩니다.",
          ]}
          interpretation="P가 8 token을 계산한 뒤 중단됐고 재개 시 3 token의 유효한 기록만 재사용하면 이전 계산 5 token을 다시 처리합니다. 새로 처리할 입력은 이 반복량과 별개이며 저장·대기·재시도 비용도 더 확인합니다. (가정)"
          title="Recomputation waste와 사용자 지연"
        />
        <PreemptionTraceViz />
        <CodeViewButton
          label="실제 선점과 재삽입 원문"
          onClick={() =>
            onCodeRef("preempt-request", codeRefs["preempt-request"])
          }
        />
        <div id="paper-fastserve" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="FastServe — output-token preemption"
            citeKey={1}
            href="https://arxiv.org/abs/2305.05920"
          >
            <q>skip-join</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              FastServe는 출력 token 경계의 선점과 여러 우선순위 대기열,
              GPU·호스트 사이 상태 이동을 결합합니다. 누가 자리를 양보하는지와
              그 기록을 저장·이동·재계산하는 방식은 별개의 설계 선택입니다. 이
              논문을 현재 vLLM의 기본 경로가 같다는 근거로 쓰지는 않습니다.
            </p>
          </div>
        </div>
      </section>
      <section
        id="scheduler-overhead"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          13. 겹친 5ms도 CPU 자원은 사용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            선택과 준비에 CPU 5ms, 실제 계산에 GPU 20ms가 든다고 합시다. 직렬
            실행 주기는 25ms이고 GPU가 일한 비율은 20/25=80%입니다. 두 자원이
            다음 실행을 완전히 겹칠 수 있는 이상적 정상 상태라면 주기는 20ms가
            됩니다. 실제 측정값을 보고한 것은 아닙니다. (가정)
          </p>
          <p>
            실제 겹침에는 결과 의존성·전달·동기화 비용이 있습니다. 앞 출력이
            끝났는지 모르는 상태에서 다음 계산을 계획하면 취소·정지·후보 거부를
            반영하는 절차도 필요합니다. 식의 max가 모든 설정에서 관측되는
            지연이라고 읽지 않습니다.
          </p>
          <p>
            묶음 고정의 빈 자리는 별도 비교로 볼 수 있습니다. 출력 길이
            40·120·200·400에 모든 자리의 비용을 같게 두면 4×400=1,600자리 중
            실제 출력은 760개이고 빈 비중은 52.5%입니다. 이는 자리 수 기반
            모형이지 실제 GPU 이용률 측정값은 아닙니다. 짧은 도착 대기 구간으로
            묶는 방식도 구현에 따라 묶음 내부 길이 차이는 남습니다. (가정)
          </p>
        </div>
        <ExplainedFormula
          question="Scheduling 시간이 step 주기와 GPU 점유율에 얼마나 남나요?"
          idea="동기 구조에서는 scheduling 과 forward 가 직렬이라 두 시간이 더해지고, 비동기 구조에서는 둘이 완전히 겹치는 정상 상태의 이상적인 주기는 큰 쪽 시간입니다. 이 식의 GPU 비율은 주기 가운데 forward가 차지하는 시간 비율이며 실제 하드웨어 이용률 지표와는 구분합니다."
          formula={String.raw`\begin{aligned}
T_{sync} &= t_{sched} + t_{gpu}, \qquad T_{async} = \max\!\left(t_{sched},\; t_{gpu}\right) \\
U &= \frac{t_{gpu}}{T}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
T_{sync} &= \underbrace{t_{sched} + t_{gpu}}_{\text{직렬이라 더해짐}}, \qquad T_{async} = \underbrace{\max\!\left(t_{sched},\; t_{gpu}\right)}_{\text{겹쳐서 큰 쪽만 남음}} \\
U &= \underbrace{\frac{t_{gpu}}{T}}_{\text{주기 중 GPU 가 일하는 비율}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`t_{sched} + t_{gpu}`,
              annotation: [
                "Scheduling 이 끝나야 forward 가 시작하므로",
                "두 시간을 그대로 더합니다",
              ],
            },
            {
              expression: String.raw`\max\!\left(t_{sched},\; t_{gpu}\right)`,
              annotation: [
                "다음 step 의 scheduling 을 이번 forward 와 겹치면",
                "둘 중 긴 쪽이 주기가 됩니다",
              ],
            },
            {
              expression: String.raw`\frac{t_{gpu}}{T}`,
              annotation: [
                "Forward 시간을 주기로 나눠",
                "GPU가 일하는 비율을 읽습니다",
              ],
            },
          ]}
          terms={OVERHEAD_TERMS}
          assumptions={[
            "Scheduling 과 forward 가 서로 다른 자원(CPU 와 GPU)을 쓰므로 겹칠 수 있습니다.",
            "Worker 로의 전송과 output 수신 시간은 t_sched 에 포함했고 sampling 은 t_gpu 에 포함했습니다.",
            "비동기 식은 완전한 겹침과 충분한 파이프라인을 가정한 이상적 정상 상태입니다. 의존성과 통신·동기화·시작·종료 비용이 추가될 수 있습니다.",
          ]}
          interpretation="t_sched=5 ms, t_gpu=20 ms 이면 동기 주기 25 ms 에 U=80%, 비동기 주기 20 ms 에 U=100% 입니다. t_gpu 가 8 ms 로 줄면 동기 U는 8/13≈61.5%로 떨어지고, t_sched 가 t_gpu 를 넘는 순간 비동기 주기도 CPU 시간이 정하므로 running 수를 늘려 t_sched 를 키우는 설정은 GPU 를 키우는 설정이 아닙니다."
          title="동기·비동기 scheduling 의 step 주기"
        />
        <BatchingGenerationsViz />
        <div id="paper-orca" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Orca — iteration-level scheduling"
            citeKey={1}
            href="https://www.usenix.org/conference/osdi22/presentation/yu"
          >
            <q>iteration-level scheduling</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Orca는 한 묶음 전체 완료를 기다릴 때 생기는 지연을 줄이도록 실행
              경계마다 구성을 바꿉니다. 원문은 GPT-3 175B와 FasterTransformer
              비교에서 같은 지연 수준의 36.9× 처리량을 보고했으며 이 실험 조건을
              일반적인 현재 성능으로 확대하지 않습니다.
            </p>
          </div>
        </div>
      </section>
      <section
        id="scheduler-limits"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <span id="scheduler-knobs" className="scroll-mt-20" />
        <span id="workload-replay" className="scroll-mt-20" />
        <span id="preemption-diagnosis" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          14. 평균 길이와 선점 횟수만으로 설정을 고르지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 평균 입력 길이여도 긴 입력이 몰리는 경우에는 지연과 저장 공간
            압박이 달라집니다. 입력·출력 길이 분포, 도착 간격, 사용자와 우선순위
            구성을 보존하고 같은 부하로 비교합니다. CPU 시간이 요청 수에 언제나
            정확히 비례하는 것도 아니므로 실제 선택·할당·조회 시간을 잽니다.
          </p>
          <p>
            우선순위가 낮은 요청이 자원 조건을 충족해도 높은 요청이 계속
            들어오면 오래 기다릴 수 있습니다. 전체 처리량뿐 아니라 사용자별 대기
            시간과 오래된 요청을 함께 확인해야 합니다. Queue age는 맨 앞 한
            요청의 나이뿐 아니라 정책상 뒤에 밀린 요청의 분포도 봅니다.
          </p>
          <p>
            예산·요청 수·입력 조각 상한·순서 정책을 바꿀 때 첫 출력과 이후
            간격의 분포, KV 사용량, 재계산, CPU 비용을 함께 기록합니다. 선점한
            요청이 다시 필요로 하는 실제 KV 양과 재사용 범위는 할당기 설정에
            따라 검증합니다.
          </p>
        </div>
        <SchedulerKnobViz items={KNOBS} />
      </section>
      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          15. 남은 양과 시간의 의미를 먼저 예상해 보세요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            전체 예산 5 중 R1·R2가 1개씩 쓰면 입력 12개인 P에 얼마를 줄 수
            있나요? 요청별 상한 4는 실제 배정량인가요? (답: 7절)
          </p>
          <p>
            P가 8개를 계산한 뒤 선점되고 재개 시 3개를 재사용하면 이전 계산 중
            얼마를 반복하나요? (답: 12절)
          </p>
          <p>
            VTC의 서비스 차이 상한에 붙은 2를 두 사용자의 GPU 시간 비율로 읽어도
            될까요? (답: 11절)
          </p>
        </div>
      </section>
    </div>
  );
}
