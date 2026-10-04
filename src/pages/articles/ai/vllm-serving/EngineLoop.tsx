import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import RequestLifecycleViz from "./viz/RequestLifecycleViz";
import PrefillDecodeViz from "./viz/PrefillDecodeViz";
import ContinuousBatchViz from "./viz/ContinuousBatchViz";
import ResourceGateViz from "./viz/ResourceGateViz";
const FEASIBILITY_TERMS = [
  {
    symbol: "n_{tok}",
    name: "이번 iteration의 scheduled token",
    description:
      "Prefill chunk와 decode token을 합쳐 이번 model execution에 넣은 token 수입니다.",
  },
  {
    symbol: "B_{tok}",
    name: "Token budget",
    description:
      "한 scheduling iteration에 허용한 최대 batched token 수입니다.",
  },
  {
    symbol: "n_{seq}",
    name: "진행할 sequence 수",
    description:
      "이번 iteration에서 token을 하나 이상 처리하는 active sequence 수입니다.",
  },
  {
    symbol: "B_{seq}",
    name: "Sequence cap",
    description: "동시에 batch에 포함하도록 허용한 sequence 수의 상한입니다.",
  },
  {
    symbol: "M_{KV}^{need}",
    name: "추가 KV block 수요",
    description:
      "선택한 token을 처리하고 state를 보존하는 데 새로 필요한 KV memory입니다.",
  },
  {
    symbol: "M_{KV}^{free}",
    name: "사용 가능한 KV pool",
    description:
      "현재 free block과 회수 가능한 block을 allocator 계약에 맞춰 센 memory입니다.",
  },
] as const;

export default function EngineLoop({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="space-y-16">
      <section id="engine-loop" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 요청 교체와 기록 저장을 서로 다른 역할로 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여기까지 본 문장 조각을 token이라고 부릅니다. 입력을 처리하는 단계와
            그 뒤 출력을 이어 가는 단계의 이름, 실행 담당자의 이름을 아래에서
            같은 역할에 연결합니다. vLLM은 이 흐름을 구현하는 추론 서빙
            시스템입니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Token",
              description: "모델이 읽고 생성하는 정수 단위입니다.",
              boundary: "한 글자나 한 단어와 항상 일치하지 않습니다.",
            },
            {
              term: "Prefill / decode",
              description:
                "입력을 처리해 첫 출력을 준비하는 단계와 이후 출력을 이어 가는 단계입니다.",
              boundary:
                "일반적인 순차 생성의 구분이며 후보 검증을 쓰면 한 실행에서 여러 출력이 확정될 수 있습니다.",
            },
            {
              term: "KV cache",
              description:
                "이미 처리한 위치에서 계산한 key와 value를 다음 attention에 재사용하는 기록입니다.",
              boundary: "이 기록 외에도 가중치와 실행용 메모리가 필요합니다.",
            },
            {
              term: "Continuous batching",
              description:
                "한 계산이 끝날 때마다 다음 계산에 들어갈 요청을 다시 고르는 방식입니다.",
              boundary: "항상 최대 크기를 채운다는 뜻은 아닙니다.",
            },
            {
              term: "Static batching",
              description:
                "함께 시작한 묶음의 완료를 기다린 뒤 다음 묶음을 시작하는 방식입니다.",
              boundary: "구현에 따라 패딩·마스킹 비용과 효율이 달라집니다.",
            },
            {
              term: "Scheduler / token budget",
              description:
                "이번 계산에 넣을 요청·양을 고르는 부분과 그 총량 상한입니다.",
              boundary: "Token 상한은 시간이나 KV 메모리 상한과 같지 않습니다.",
            },
            {
              term: "Frontend / engine core",
              description:
                "입력 검증·변환·전송을 맡는 입구와 요청 상태·계획을 맡는 실행 중심입니다.",
              boundary: "구체적인 프로세스 배치는 버전·설정에 따라 확인합니다.",
            },
            {
              term: "Executor / worker",
              description:
                "작업자 실행을 조정하는 부분과 실제 모델 계산을 수행하는 부분입니다.",
              boundary: "하나의 주소로 호출해도 내부 실패 위치는 다릅니다.",
            },
            {
              term: "Preemption",
              description:
                "진행 중인 요청을 잠시 빼 자원을 확보하는 동작입니다.",
              boundary: "재개에 필요한 재계산이나 전송 비용을 별도로 봅니다.",
            },
            {
              term: "TTFT / ITL / TPOT",
              description:
                "첫 출력까지 시간·연속 출력 사이 간격·그 간격의 평균입니다.",
              boundary:
                "측정 위치와 출력 개수 기준을 같게 정해야 비교할 수 있습니다.",
            },
            {
              term: "DP / TP / PP",
              description:
                "복제본·한 층의 계산·여러 층의 묶음을 나누는 배치 축입니다.",
              boundary: "GPU 수가 같아도 통신과 메모리 소유 구조는 다릅니다.",
            },
            {
              term: "SLO / goodput",
              description:
                "미리 정한 서비스 조건과 그 조건을 지킨 결과의 처리량입니다.",
              boundary: "요청/s와 token/s 정의를 섞지 않습니다.",
            },
          ]}
        />
        <RequestLifecycleViz />
        <div id="prefill-decode" className="scroll-mt-20">
          <PrefillDecodeViz />
        </div>
      </section>
      <section id="request-trace" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. B가 끝난 자리에 C가 들어옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 실행은 A의 prefill 4 token입니다. A는 4/6을 읽었고 출력은 아직
            없습니다. 두 번째 실행은 A의 남은 2와 B의 2로 token budget 4를 모두
            씁니다. 두 요청의 prefill이 끝나 각각 첫 token을 얻습니다. (가정)
          </p>
          <p>
            세 번째 실행은 A와 B의 decode 입력을 하나씩 처리합니다. 각 요청이 두
            번째 output token을 얻고 B는 설정한 2개에 도달해 완료됩니다. 사용한
            token budget은 2이며 요청 자리가 하나 비었습니다. (가정)
          </p>
          <p>
            네 번째 실행에는 A의 decode 1 token과 새 C의 prefill 3 token을
            넣습니다. 합계 4이고 요청 수는 2입니다. A는 세 번째 출력, C는 첫
            출력을 얻어 각각 완료합니다. 완료와 다음 요청의 수용은 실제 실행
            결과와 KV 할당 가능성을 확인한 뒤 결정합니다. (가정)
          </p>
          <p>
            아래 세 조건은 이번 실행에 들어갈 수 있는지 판정합니다. 부등식을
            통과했다는 사실만으로 사용자 지연이 짧다고 결론내릴 수는 없습니다.
          </p>
        </div>
        <ContinuousBatchViz />
        <div id="resource-feasibility" className="scroll-mt-20">
          <ResourceGateViz />
          <ExplainedFormula
            question="Scheduler가 고른 요청 집합이 실제로 한 GPU iteration에 들어갈 수 있는 조건은 무엇일까요?"
            idea={
              <>
                계산할 token 수, 동시에 진행할 sequence 수, 새 state를 남길 KV
                memory를 각각 상한과 비교합니다. 세 조건 가운데 하나라도
                실패하면 waiting을 유지하거나 chunk를 줄이고, 경우에 따라
                running request를 preempt해야 합니다.
              </>
            }
            formula={String.raw`\begin{aligned}
n_{tok} &\le B_{tok} \\
n_{seq} &\le B_{seq} \\
M_{KV}^{need} &\le M_{KV}^{free}
\end{aligned}`}
            annotatedFormula={String.raw`\begin{aligned}
n_{tok} &\le \underbrace{B_{tok}}_{\text{동시에 만족할 상한}} \\
n_{seq} &\le \underbrace{B_{seq}}_{\text{동시에 만족할 상한}} \\
M_{KV}^{need} &\le \underbrace{M_{KV}^{free}}_{\text{동시에 만족할 상한}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`B_{tok}`,
                annotation: [
                  "이번 선택량이 상한 이하여야 합니다.",
                  "계산할 token 수, 동시에 진행할 sequence 수, 새",
                  "state를 남길 KV memory를 각각 상한과 비교합니다.",
                ],
              },
              {
                expression: String.raw`B_{seq}`,
                annotation: [
                  "이번 선택량이 상한 이하여야 합니다.",
                  "계산할 token 수, 동시에 진행할 sequence 수, 새",
                  "state를 남길 KV memory를 각각 상한과 비교합니다.",
                ],
              },
              {
                expression: String.raw`M_{KV}^{free}`,
                annotation: [
                  "이번 선택량이 상한 이하여야 합니다.",
                  "계산할 token 수, 동시에 진행할 sequence 수, 새",
                  "state를 남길 KV memory를 각각 상한과 비교합니다.",
                ],
              },
            ]}
            terms={FEASIBILITY_TERMS}
            assumptions={[
              "B_tok와 B_seq는 해당 vLLM version의 effective SchedulerConfig 값입니다.",
              "KV 수요는 block rounding·prefix hit·local/global layer·speculative branch까지 runtime allocator 기준으로 계산합니다.",
              "세 부등식은 실행 가능성만 나타내며 TTFT·ITL·throughput이 좋은지는 별도 load test로 판단합니다.",
            ]}
            interpretation="두 번째 실행은 token 2+2=4≤4, 요청 2≤2이며 추가 KV 공간도 확보해야 합니다. Token budget을 8로 높여도 요청 상한 2와 KV 여유가 그대로면 C가 들어온다는 보장은 없습니다. (가정)"
            title="Iteration-level scheduling의 hard feasibility"
          />
        </div>
      </section>
      <section
        id="scheduler-source"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 원문에서 남은 양을 자르고 저장 공간을 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            vLLM v0.27.1의 고정 commit
            6e448d0ea9bf3d88d898b65449ca6dc2aec170ac을 확인했습니다. 코드 패널은
            scheduler.py 전체 원문이며 설명을 위해 주석이나 조건을 바꾸지
            않았습니다. 516–523행에서 아직 계산하지 않은 token 수를 구하고 남은
            token_budget으로 제한합니다.
          </p>
          <p>
            사례의 두 번째 실행에서 A는 num_tokens_with_spec=6,
            num_computed_tokens=4, num_output_placeholders=0입니다. 차이는 2이고
            남은 예산 4와 min을 취해 2를 고릅니다. 추가 조건이 모두 통과한다면
            637행에서 예산이 2로 줄어 B에 남은 2를 쓸 수 있습니다. (가정)
          </p>
          <p>
            578–586행의 allocate_slots가 실패하면 590행부터 정책에 따라 다른
            요청을 빼고 재시도합니다. 우선순위 정책은 priority와 도착 시각으로
            고르고 다른 정책에서는 running의 뒤에서 꺼냅니다. 항상 마지막 요청만
            뺀다는 설명으로 통합하면 원문과 달라집니다.
          </p>
          <p>
            683행 이후는 기다리는 요청을 검토하고 689–692행은 진행 요청 수
            상한을 검사합니다. 실제 구현에는 비동기 진행·입력 인코더·후보 token
            등의 조건도 있으므로 네 번의 가정 사례가 모든 설정에서 그대로
            실행된다는 뜻은 아닙니다.
          </p>
        </div>
        <CodeViewButton
          label="고정 commit의 scheduler.py 원문"
          onClick={() =>
            onCodeRef(
              "schedule-resource-feasibility",
              codeRefs["schedule-resource-feasibility"],
            )
          }
        />
        <div id="paper-orca" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Orca — OSDI 2022, iteration-level scheduling"
            citeKey={1}
            href="https://www.usenix.org/conference/osdi22/presentation/yu"
          >
            <q>iteration-level scheduling</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Orca는 요청 전체 대신 한 번의 모델 계산을 기준으로 다음 묶음을
              정하는 선행 시스템입니다. 사례에서 B가 세 번째 실행에 끝나면 C가
              네 번째에 들어오는 자리를 이 관점으로 이해합니다. Orca의 selective
              batching은 당시 attention을 요청별로, 다른 연산을 함께 처리한 구현
              선택이며 현재 vLLM의 내부 모듈명이 아닙니다.
            </p>
          </div>
        </div>
        <div id="paper-vllm" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="vLLM / PagedAttention — §4"
            citeKey={1}
            href="https://arxiv.org/abs/2309.06180"
          >
            <q>non-contiguous</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              vLLM의 원 논문은 각 요청의 KV 기록을 반드시 연속된 큰 메모리에 둘
              필요가 없도록 블록으로 연결합니다. A·B·C의 길이가 다를 때 필요한
              만큼 할당하고 재사용할 여지를 만드는 접근입니다. 원 논문의
              모델·장비·부하에서 측정한 처리량을 현재 배포의 보장값으로
              가져오지는 않습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
