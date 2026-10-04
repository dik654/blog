import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ChunkedPrefillViz from "./viz/ChunkedPrefillViz";
const CHUNK_TERMS = [
  {
    symbol: "P",
    name: "남은 prompt token",
    description: "아직 prefill하지 않은 prompt 구간의 길이입니다.",
  },
  {
    symbol: "c",
    name: "Prefill chunk 상한",
    description:
      "긴 prefill 요청 하나에 한 iteration에서 배정할 최대 token 수입니다.",
  },
  {
    symbol: "C",
    name: "필요한 chunk 수",
    description:
      "남은 prompt를 c 이하의 조각으로 처리하는 데 필요한 iteration 수의 하한입니다.",
  },
  {
    symbol: "t_{launch+sched}",
    name: "조각마다 드는 고정 비용",
    description:
      "Scheduling·batch 준비·kernel launch처럼 chunk가 늘 때 반복되는 비용입니다.",
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

export default function PrefillDecode({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="space-y-16">
      <section
        id="prefill-decode"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 상한 4여도 12개 입력에 실제로 네 번이 필요합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            P=12를 c=4로 나눈 올림은 3입니다. 이는 최소 조각 수이며 실제로 늘
            4개를 받았을 때 달성합니다. 두 decode가 매번 예산 2개를 먼저 쓰는 이
            사례에서는 P가 3개씩 네 번을 받습니다. 각 조각의 합은 12이고 모든
            조각이 상한 4 이하입니다. (가정)
          </p>
          <p>
            작은 조각 사이에는 기존 답이 진행할 기회가 생기지만 선택·준비·실행
            시작 비용도 반복됩니다. 아래 총비용 식은 P에 배분한 계산과 준비
            비용의 분해입니다. 다른 요청의 계산·대기와 겹침을 포함한 실제 첫
            출력 시간은 별도로 측정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="입력 12 token의 chunk 상한이 4인데 매번 3만 배정되면 몇 번이 필요할까요?"
          idea={
            <>
              Chunk 수의 하한은 prompt 길이를 chunk 상한으로 나눈 올림입니다. 각
              조각 사이에 decode를 배치할 기회가 생기지만, scheduler와 batch
              준비 같은 고정 비용도 C번 반복됩니다.
            </>
          }
          formula={String.raw`\begin{aligned}
C &\ge \left\lceil \frac{P}{c} \right\rceil \\
T_{prefill,total} &\approx \sum_{j=1}^{C}T_{model}(c_j)
 + C\,t_{launch+sched}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
C &\ge \underbrace{\left\lceil \frac{P}{c} \right\rceil}_{\text{최소 필요한 조각 수}} \\
T_{prefill,total} &\approx \sum_{j=1}^{C}T_{model}(c_j)
 + C\,t_{launch+sched}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\left\lceil \frac{P}{c} \right\rceil`,
              annotation: [
                "입력을 상한으로 나누고 나머지가 있으면 한 조각을 더 셉니다.",
                "Chunk 수는 prompt 길이를 chunk 상한으로 나눈",
                "올림입니다.",
              ],
            },
          ]}
          terms={CHUNK_TERMS}
          assumptions={[
            "각 chunk 크기 c_j는 c 이하이고 전체 합이 P입니다.",
            "두 번째 식은 비용을 이해하기 위한 분해이며 kernel overlap·CUDA Graph·batch composition은 별도 측정합니다.",
            "Chunk 사이에 decode가 실제로 배정되는지는 arrival·priority·token/KV budget에 달려 있습니다.",
          ]}
          interpretation="P=12, c=4이면 최소 3개 chunk가 필요합니다. 두 decode가 계속 예산을 2개씩 쓰면 P는 매번 3개만 처리해 실제 4개 chunk가 됩니다. 최소 횟수와 실제 횟수를 구분합니다. (가정)"
          title="Chunk 수와 반복 overhead의 맞바꿈"
        />
        <ChunkedPrefillViz />
        <div id="paper-sarathi" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Sarathi-Serve — chunked prefills and stall-free scheduling"
            citeKey={1}
            href="https://arxiv.org/abs/2403.02310"
          >
            <q>stall-free</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Sarathi-Serve는 진행 중인 decode를 먼저 배치하고 남은 양에 prefill
              조각을 맞춥니다. 사례의 5개 예산에서 2개를 먼저 쓰고 P에 3개를
              주는 구성을 이 관점으로 읽을 수 있습니다. 논문의
              시스템·장비·부하에서 얻은 개선을 현재 설정 하나의 보장값으로
              옮기지는 않습니다.
            </p>
          </div>
        </div>
      </section>
      <section
        id="priority-order"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <span id="hol-blocking" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          10. 작은 priority가 앞서도 공간 검사는 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Priority 정책에서 P의 값이 1이고 Q가 2이면 P가 나중에 왔어도 먼저
            검토합니다. 값이 같으면 먼저 도착한 요청을 봅니다. Request.__lt__
            원문은 이 두 값도 같을 때 request_id, 객체 id를 차례로 비교합니다.
            (가정)
          </p>
          <p>
            Request queue 원문의 FCFS는 새 요청을 뒤에 추가하고 선점한 요청의
            prepend는 앞에 넣습니다. Priority queue의 prepend는 이름과 달리 같은
            heap 정렬 규칙으로 다시 넣습니다. 선점한 요청은 언제나 맨 앞이라는
            설명은 priority 정책에 맞지 않습니다.
          </p>
          <p>
            빈 KV 블록이 200개인데 앞 요청이 500개를 필요로 하고 뒤 요청은
            20개면 앞의 할당 실패에서 순회가 멈추는 경로에서는 둘 다 기다립니다.
            다른 상태를 건너뛰는 분기도 있으므로 V1의 모든 대기 원인이 같은
            break라고 일반화하지 않습니다. (가정)
          </p>
        </div>
        <ExplainedFormula
          question="Priority scheduling에서 두 요청의 우선순위가 같다면 무엇으로 순서를 정할까요?"
          idea={
            <>
              현재 공식 설정은 작은 priority 값을 먼저 보고, 같은 값이면 arrival
              time이 이른 요청을 먼저 보는 lexicographic order를 사용합니다.
              동률의 추가 조건은 원문에서 확인합니다. FCFS의 새 요청은 대기열
              뒤에 추가되며 선점된 요청의 재삽입은 별도 연산입니다.
            </>
          }
          formula={String.raw`r_i \prec_{p,a} r_j
\quad\Longleftrightarrow\quad
(p_i,a_i)<_{\mathrm{lex}}(p_j,a_j)`}
          annotatedFormula={String.raw`r_i \prec_{p,a} r_j
\quad\Longleftrightarrow\quad
(p_i,a_i)<\underbrace{_{\mathrm{lex}}(p_j,a_j)}_{\text{오른쪽 항으로 결과 계산}}`}
          operations={[
            {
              expression: String.raw`_{\mathrm{lex}}(p_j,a_j)`,
              annotation: [
                "왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.",
                "현재 공식 설정은 작은 priority 값을 먼저 보고, 같은",
                "값이면 arrival time이 이른 요청을 먼저 보는",
                "lexicographic order를 사용합니다.",
              ],
            },
          ]}
          terms={PRIORITY_TERMS}
          assumptions={[
            "식은 priority와 arrival이라는 주요 두 키의 부분 순서를 나타냅니다. 두 키가 같으면 원문은 request_id와 객체 id를 추가로 비교합니다.",
            "작은 priority 숫자가 더 높은 우선순위라는 vLLM 계약을 따릅니다.",
            "우선순위는 admission 순서를 조절할 뿐 token·KV hard constraint를 무시하지 못합니다.",
          ]}
          interpretation="priority=1인 늦은 P와 priority=2인 이른 Q를 비교하면 P가 앞섭니다. 둘의 priority와 arrival이 모두 같으면 원문은 request_id와 객체 id까지 비교합니다. 이 두 값 식은 주요 비교 축만 나타냅니다. (가정)"
          title="Priority policy의 정렬 기준"
        />
        <CodeViewButton
          label="Request의 실제 비교 순서"
          onClick={() =>
            onCodeRef("priority-ordering", codeRefs["priority-ordering"])
          }
        />
        <CodeViewButton
          label="FCFS와 priority 재삽입 원문"
          onClick={() =>
            onCodeRef("priority-queue", codeRefs["priority-queue"])
          }
        />
      </section>
      <section
        id="scheduler-fairness"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          11. 요청 두 개와 입력 세 개가 같은 서비스를 뜻하지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            R1·R2가 사용자 X의 요청이고 P가 사용자 Y의 요청이라고 합시다. 입력
            token 비용은 1, 출력 token 비용은 2로 정합니다. 한 실행에서 X가 출력
            2개를 받고 Y가 입력 3개를 처리하면 서비스는 X=4, Y=3 단위입니다.
            요청 개수 2 대 1만으로 받은 계산 서비스를 비교할 수 없습니다. (가정)
          </p>
          <p>
            기존 비교처럼 4,000 token 요청 100개와 200 token 요청 100개를 합하면
            400,000 대 20,000 token입니다. 큰 쪽 비중은 약 95.2%이지만 이것은
            token 비중입니다. 입력·출력·묶음 모양이 다른 상황에서 GPU 시간도
            95.2%라고 단정할 수 없습니다. (가정)
          </p>
          <p>
            VTC는 사용자별 서비스 counter를 갱신하고 덜 받은 사용자를 먼저
            검토합니다. 새로 대기열에 들어온 사용자의 counter를 조정해 오래
            쉬었다는 이유로 무한한 우선권을 얻지 않게 합니다. 가능한 작업이
            있는데 공정성만을 이유로 자원을 비우지 않는 조건도 함께 다룹니다.
          </p>
        </div>
        <div id="paper-vtc" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Fairness in Serving Large Language Models — Theorem 4.4"
            citeKey={1}
            href="https://arxiv.org/pdf/2401.00588"
          >
            <q>backlogged</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              정리 4.4는 비교 구간 내내 두 사용자가 대기 요청을 보유한 조건에서
              서비스의 절대 차이에 상한을 둡니다. 논문의 2×는 이 상한과 관련
              하한의 관계이며 두 사용자의 GPU 시간이나 서비스 비율을 뜻하지
              않습니다. 고정한 vLLM 코드의 priority 비교가 곧 VTC 구현인 것도
              아닙니다.
            </p>
          </div>
        </div>
        <ExplainedFormula
          title="VTC 정리 4.4의 서비스 차이 상한"
          question="두 사용자가 받은 서비스 차이에 붙은 2는 무엇을 두 배로 하나요?"
          idea="입력과 출력의 단위 비용, 최대 입력 길이, 실행 묶음의 token 용량으로 서비스 단위의 상한을 만듭니다. 두 사용자의 서비스 비율이 두 배 이내라는 명제가 아닙니다."
          formula={String.raw`|W_f-W_g|\le 2\max(w_p L_{input},w_q M)`}
          annotatedFormula={String.raw`|W_f-W_g|\le \underbrace{2\max(w_p L_{input},w_q M)}_{\text{서비스 단위의 절대 차이 상한}}`}
          operations={[
            {
              expression: String.raw`2\max(w_p L_{input},w_q M)`,
              annotation: [
                "입력 비용 상한과 실행 묶음의 출력 비용 상한 중 큰 것을 고릅니다.",
                "그 값의 두 배가 서비스 차이의 상한입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "W_f,W_g",
              name: "두 사용자의 누적 서비스",
              description:
                "같은 시간 구간에 받은 입력·출력 token 비용을 합친 값입니다.",
            },
            {
              symbol: "w_p,w_q",
              name: "입력·출력 단위 비용",
              description:
                "정한 서비스 함수에서 각 token에 부여한 가중치입니다.",
            },
            {
              symbol: "L_{input}",
              name: "최대 입력 길이",
              description: "정리에서 제한한 한 요청의 입력 token 상한입니다.",
            },
            {
              symbol: "M",
              name: "실행 묶음의 token 용량",
              description:
                "논문의 메모리 용량 모델에서 실행 묶음이 보유할 수 있는 token 수입니다.",
            },
          ]}
          assumptions={[
            "두 사용자가 비교 구간 내내 대기 요청을 보유하는 backlogged 조건입니다.",
            "논문 Algorithm 2와 서비스 함수·메모리 모델을 따릅니다. 이 정리는 임의의 선점 정책을 포함하지 않습니다.",
            "실제 GPU 시간이나 개별 응답 지연의 비율을 보장하는 식이 아닙니다.",
          ]}
          interpretation="w_p=1, w_q=2, L_input=12, M=20이면 2×max(12,40)=80 서비스 단위입니다. 앞 사례의 한 실행에서 X가 4, Y가 3을 받았다는 값은 차이 1을 보여 줄 뿐 전체 구간의 공정성을 증명하지 않습니다. (가정)"
        />
      </section>
    </div>
  );
}
