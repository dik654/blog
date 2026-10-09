import ExplainedFormula from "@/components/ui/explained-formula";
import EngineBoundaryViz from "./viz/EngineBoundaryViz";
import ParallelLayoutViz from "./viz/ParallelLayoutViz";
const LATENCY_TERMS = [
  {
    symbol: "t_{queue}",
    name: "Queue time",
    description:
      "요청이 engine에 들어온 뒤 처음 scheduling될 때까지 기다린 시간입니다.",
  },
  {
    symbol: "t_{prefill}",
    name: "Prefill time",
    description:
      "Prompt token을 처리하고 첫 output token을 낼 준비를 마치는 시간입니다.",
  },
  {
    symbol: "TTFT",
    name: "Time to first token",
    description:
      "Client가 요청을 보낸 뒤 첫 output token을 받을 때까지의 시간입니다.",
  },
  {
    symbol: "ITL_j",
    name: "Inter-token latency",
    description: "j번째 output token과 다음 output token 사이의 시간입니다.",
  },
  {
    symbol: "N_{out}",
    name: "Output token 수",
    description: "요청이 완료될 때까지 실제 생성해 stream한 token 수입니다.",
  },
  {
    symbol: "t_{front}",
    name: "입출력 전달 시간",
    description:
      "이 예에서 대기·초기 계산과 중복 없이 별도로 센 접수·전달 시간입니다.",
  },
  {
    symbol: "T_{E2E}",
    name: "마지막 token 수신까지의 시간",
    description: "같은 client 시계로 첫 요청부터 마지막 출력까지 잽니다.",
  },
  {
    symbol: "TPOT",
    name: "첫 출력 이후 평균 간격",
    description: "출력이 둘 이상일 때 그 사이 간격을 평균냅니다.",
  },
] as const;

const PARALLEL_TERMS = [
  {
    symbol: "G",
    name: "총 worker GPU 수",
    description:
      "같은 deployment의 regular model-worker layout에 참여하는 GPU 수입니다.",
  },
  {
    symbol: "D_P",
    name: "Data-parallel replica 수",
    description:
      "독립 request batch와 KV pool을 가진 model replica의 개수입니다.",
  },
  {
    symbol: "T_P",
    name: "Tensor-parallel size",
    description: "각 layer의 weight와 계산을 함께 나누는 GPU 수입니다.",
  },
  {
    symbol: "P_P",
    name: "Pipeline-parallel size",
    description: "연속 layer 묶음을 서로 다른 stage에 배치한 개수입니다.",
  },
] as const;

const GOODPUT_TERMS = [
  {
    symbol: "y_r",
    name: "요청 r의 output token",
    description: "측정 구간에 완료된 요청 r이 생성한 token 수입니다.",
  },
  {
    symbol: String.raw`\mathbf{1}[SLO_r]`,
    name: "SLO 통과 indicator",
    description:
      "요청 r이 정한 TTFT·ITL·E2E·오류율 기준을 모두 통과하면 1입니다.",
  },
  {
    symbol: String.raw`\Delta t`,
    name: "측정 시간",
    description:
      "Warm-up과 종료 drain 규칙을 고정한 workload replay 구간입니다.",
  },
] as const;

export default function ServingArchitecture() {
  return (
    <div className="space-y-16">
      <section
        id="latency-accounting"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. A의 첫 출력 45ms와 전체 65ms를 나눠 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A가 대기한 시간은 10ms, 입력을 처리한 시간은 30ms, 접수·전달에 든
            나머지 시간은 5ms라고 합시다. 서로 겹치지 않게 센 값이며 첫 출력까지
            합계 45ms입니다. 앞에서 말한 네 번의 계산 횟수만으로 이 시간을
            추정한 것은 아닙니다. (가정)
          </p>
          <p>
            A의 출력은 3개입니다. 첫 출력 뒤 다음 두 간격이 8ms와 12ms라면
            마지막 출력은 65ms에 도착합니다. 평균 간격은 10ms지만 두 번째 간격은
            평균보다 깁니다. 첫 출력과 이후 진행을 따로 보는 이유입니다. (가정)
          </p>
          <p>
            일반적인 낮은 묶음 크기의 decode에서는 매번 가중치·KV를 읽는 비용이
            두드러질 수 있고 긴 prefill은 큰 행렬 계산을 만들 수 있습니다. 실제
            병목은 모델·묶음 크기·장비·연산 구현으로 확인하며 단계 이름만으로
            고정하지 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="사용자가 느낀 지연을 queue·prefill·decode 중 어디에서 잃었는지 어떻게 나눌까요?"
          idea={
            <>
              첫 token까지의 시간과 그 뒤 token 사이의 시간을 나눕니다. TTFT가
              나빠졌다면 queue나 prefill을 먼저 보고, 첫 token은 빠른데 답
              전체가 느리다면 decode iteration의 ITL 분포를 확인합니다.
            </>
          }
          formula={String.raw`\begin{aligned}
TTFT &\approx t_{queue}+t_{prefill}+t_{front} \\
T_{E2E} &= TTFT+\sum_{j=1}^{N_{out}-1}ITL_j \\
TPOT &= \frac{T_{E2E}-TTFT}{(N_{out}-1)}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
TTFT &\approx \underbrace{t_{queue}+t_{prefill}+t_{front}}_{\text{첫 token 전에 쓴 세 구간}} \\
T_{E2E} &= TTFT+\underbrace{\sum_{j=1}^{N_{out}-1}ITL_j}_{\text{decode 간격의 합}} \\
TPOT &= \underbrace{\frac{T_{E2E}-TTFT}{(N_{out}-1)}}_{\text{token당 평균 decode 간격}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`t_{queue}+t_{prefill}+t_{front}`,
              annotation: [
                "첫 token이 나오기 전 scheduler 대기, prompt",
                "prefill, frontend 왕복을 더합니다.",
                "사례 A: 10+30+5=45ms. 나빠지면 queue·prefill부터",
              ],
            },
            {
              expression: String.raw`TTFT+\sum_{j=1}^{N_{out}-1}ITL_j`,
              annotation: [
                "첫 token 시각에 그 뒤 token 사이 간격 ITL을",
                "N_out−1개 더하면 답 전체 시간입니다.",
                "사례 A: 45+8+12=65ms",
              ],
            },
            {
              expression: String.raw`\frac{T_{E2E}-TTFT}{(N_{out}-1)}`,
              annotation: [
                "E2E에서 TTFT를 뺀 decode 구간을 간격 수로",
                "나눈 평균 ITL입니다. (65−45)/(3−1)=10ms인데",
                "실제 8ms와 12ms의 spike 차이는 가려집니다",
              ],
            },
          ]}
          terms={LATENCY_TERMS}
          assumptions={[
            "Client·gateway·frontend 시간을 t_front에 포함하거나 별도 span으로 측정한다고 먼저 정합니다.",
            "Streaming response에서 token timestamp가 있고 tokenizer·stop 처리 기준이 동일합니다.",
            "TPOT는 N_out > 1일 때의 평균 간격입니다. 출력이 하나면 간격 평균은 정의되지 않습니다. TPOT는 p95 ITL spike나 burst 전송을 숨길 수 있어 ITL histogram도 함께 봅니다.",
          ]}
          interpretation="사례 A에서 TTFT=10+30+5=45ms, E2E=45+8+12=65ms, TPOT=(65−45)/(3−1)=10ms입니다. 평균 10ms는 실제 8ms와 12ms의 차이를 숨깁니다. (가정)"
          title="온라인 generation latency의 분해"
        />
      </section>
      <section
        id="serving-architecture"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <span id="v1-boundary" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          10. GPU 배치와 조건을 지킨 처리량을 따로 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 요청 주소 뒤에도 frontend·engine core·executor·worker가
            있습니다. 연결이 느린지 대기열이 긴지 작업자 간 통신이나 실제 계산이
            느린지 관측 위치를 나눕니다. 요청 식별자와 token 수, KV 소유자,
            결과가 오가는 메시지를 같은 실행 기록으로 연결합니다.
          </p>
          <p>
            복제본 2개에 각각 한 모델을 GPU 4개로 나누고 층 묶음은 1개라면 전체
            GPU는 2×4×1=8개입니다. A·B·C를 다른 복제본으로 보내면 대기열과 KV
            저장 공간도 달라집니다. GPU 수를 늘린다는 말만으로 이 배치를 설명할
            수 없습니다. (가정)
          </p>
        </div>
        <EngineBoundaryViz />
        <div id="parallel-layout" className="scroll-mt-20">
          <ParallelLayoutViz />
          <ExplainedFormula
            question="Regular deployment에서 data·tensor·pipeline parallelism은 GPU 수와 어떻게 연결될까요?"
            idea={
              <>
                한 replica의 model을 TP×PP GPU에 놓고, 그 replica를 DP개
                복제한다고 보면 총 GPU 수는 세 축의 곱입니다. 무엇을 늘렸는지에
                따라 request routing·collective traffic·pipeline bubble·KV
                locality가 다르게 변합니다.
              </>
            }
            formula={String.raw`G=D_P\times T_P\times P_P`}
            annotatedFormula={String.raw`G=\underbrace{D_P}_{\text{독립 replica 수}}\times\underbrace{T_P\times P_P}_{\text{replica 하나가 차지한 GPU}}`}
            operations={[
              {
                expression: String.raw`T_P\times P_P`,
                annotation: [
                  "model 하나를 layer 안에서 TP개로 쪼개고",
                  "layer 구간을 PP개로 나눠 놓은 replica 한 벌의",
                  "GPU 수입니다. TP=4, PP=1이면 4 GPU",
                ],
              },
              {
                expression: String.raw`D_P\times T_P\times P_P`,
                annotation: [
                  "그 replica를 DP개 복제하면 총 GPU 수입니다.",
                  "DP=2, TP=4, PP=1이면 8 GPU. TP를 늘리면",
                  "collective가, DP를 늘리면 queue·KV pool이 늡니다",
                ],
              },
            ]}
            terms={PARALLEL_TERMS}
            assumptions={[
              "모든 replica가 같은 TP·PP 크기를 쓰는 regular homogeneous layout입니다.",
              "Expert parallel·context parallel·standby rank·disaggregated prefill 같은 추가 축은 표시하지 않았습니다.",
              "GPU 수가 식에 맞는다는 사실은 model memory 적합성이나 interconnect latency가 충분하다는 보장이 아닙니다.",
            ]}
            interpretation="예를 들어 DP=2, TP=4, PP=1이면 4-GPU model replica가 두 개이고 총 8 GPU입니다. TP를 늘리면 한 request의 layer마다 collective가 늘고, DP를 늘리면 독립 queue·KV pool이 늘어 routing이 중요해집니다."
            title="Regular model-worker topology"
          />
        </div>
        <div id="serving-goodput" className="scroll-mt-20">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              측정 구간 1초에 A·B·C가 출력 3·2·1 token을 완료하고 B만 미리 정한
              지연 조건을 어겼다고 합시다. 총 6 token/s 중 조건을 지킨 양은 A와
              C의 합계 4 token/s입니다. 여기서는 token 단위 goodput을 정의하며
              요청 수를 분자로 쓰는 지표와 구분합니다. (가정)
            </p>
          </div>
          <ExplainedFormula
            question="처리량이 높아도 사용자 latency 기준을 어긴 결과를 어떻게 제외할까요?"
            idea={
              <>
                측정 구간의 모든 output token을 더하는 대신, 사전에 정한 SLO를
                통과한 요청의 token에만 1을 곱합니다. SLO에는 workload에 맞는
                TTFT·ITL·E2E와 오류 조건을 함께 고정합니다.
              </>
            }
            formula={String.raw`\mathrm{Goodput}_{SLO}
=\frac{\sum_r y_r\,\mathbf{1}[SLO_r]}{\Delta t}`}
            annotatedFormula={String.raw`\mathrm{Goodput}_{SLO}
=\frac{\sum_r \underbrace{y_r}_{\text{요청 r의 token}}\,\underbrace{\mathbf{1}[SLO_r]}_{\text{SLO 통과면 1}}}{\underbrace{\Delta t}_{\text{측정 구간}}}`}
            operations={[
              {
                expression: String.raw`\sum_r y_r\,\mathbf{1}[SLO_r]`,
                annotation: [
                  "요청마다 output token 수에 SLO 통과 여부",
                  "(TTFT·ITL·E2E·오류 조건) 0/1을 곱해 더합니다.",
                  "A·B·C가 3·2·1 token이고 B가 어기면 3+0+1=4",
                ],
              },
              {
                expression: String.raw`\frac{\sum_r y_r\,\mathbf{1}[SLO_r]}{\Delta t}`,
                annotation: [
                  "통과한 token만 측정 구간 길이로 나눕니다.",
                  "1초 구간이면 goodput 4 token/s, raw",
                  "throughput 6 token/s와 따로 봅니다",
                ],
              },
            ]}
            terms={GOODPUT_TERMS}
            assumptions={[
              "SLO threshold와 workload distribution을 tuning 전에 고정합니다.",
              "완료·취소·timeout·오류 요청의 포함 규칙과 output-token counting 기준을 명시합니다.",
              "Quality regression·비용·energy·운영 안정성은 goodput 밖의 별도 guardrail입니다.",
            ]}
            interpretation="A·B·C가 1초 동안 각각 3·2·1 token을 만들고 B만 미리 정한 지연 조건을 어겼다면 raw throughput은 6 token/s, 여기서 정의한 token goodput은 (3+1)/1=4 token/s입니다. 요청/s 단위 지표와 섞지 않습니다. (가정)"
            title="SLO를 만족한 serving goodput"
          />
        </div>
      </section>
      <section
        id="serving-limits"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          11. 가능한 배치가 좋은 지연을 보장하지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Token budget을 늘리면 긴 prefill이 더 많이 들어와 전체 처리량은
            높아져도 이미 답을 받는 요청의 ITL이 나빠질 수 있습니다. 반대로 작은
            조각은 준비와 반복 비용을 늘릴 수 있습니다. 실제 입력·출력 길이와
            도착 간격을 고정한 비교에서 TTFT·ITL 분포를 확인해야 합니다.
          </p>
          <p>
            KV가 부족하면 preemption과 재계산 때문에 처리량이 떨어질 수
            있습니다. 입력 재사용이나 후보 검증, 다른 종류의 기억을 쓰는 모델을
            켜면 사례의 수량 계산도 달라집니다. 버전과 설정, 중단·시간 초과의
            집계 규칙을 함께 기록합니다.
          </p>
          <p>
            지연 기준은 조정 전에 정합니다. 요청별 임계값과 전체 집단의 p95
            목표는 다른 정의이며 여기의 goodput 식에는 어떤 조건을 요청별로
            적용했는지 밝혀야 합니다. 품질·비용·전력·복구 가능성도 이 처리량
            식이 대신 판정하지 않습니다.
          </p>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실행 선택은 <a href="/cs/ai/vllm-scheduler">Scheduler</a>, KV 할당은{" "}
            <a href="/cs/ai/vllm-paged-attention">PagedAttention</a>, 후보
            검증은 <a href="/cs/ai/vllm-spec-decode">Speculative Decoding</a>
            에서 이어집니다.{" "}
            <a href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              vLLM V1 공식 가이드
            </a>
            의 최신 기능 범위는 배포 버전과 함께 확인합니다.
          </p>
        </div>
      </section>
      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          12. 상한과 관측값을 바꾸면 무엇이 달라질까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 번째 실행에서 A가 2 token을 쓰고 전체 예산이 4라면 B에 남은
            예산은 얼마인가요? 이 숫자만으로 B의 실행을 확정할 수 있나요? (답:
            7절)
          </p>
          <p>
            A의 출력이 3개이고 TTFT=45ms, 뒤 간격이 8ms·12ms라면 전체 시간과
            평균 간격은 얼마인가요? (답: 9절)
          </p>
          <p>
            메모리 부족 시 항상 마지막 요청을 뺀다는 설명은 고정한 원문의 어떤
            경우에 맞지 않나요? (답: 8절)
          </p>
        </div>
      </section>
    </div>
  );
}
