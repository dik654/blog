import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ServingMemoryAdmissionAndPreemptionViz from "./serving-memory-admission-and-preemption/viz/ServingMemoryAdmissionAndPreemptionViz";

/**
 * KV admission은 watermark 아래서만 받고 부족하면 recompute·swap으로 비웁니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "요청을 언제 받아들이고, memory가 모자라면 누구를 어떻게 내보내는가" 하나만 소유한다.
 * Block allocator·fragmentation·prefix sharing은 vllm-paged-attention이, queue 순서와 token budget은 vllm-scheduler가 맡는다.
 */
export default function ServingMemoryAdmissionAndPreemptionArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Serving의 memory 문제는 지금 받을지와 누구를 내보낼지 두 결정으로 줄어듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM serving에서 GPU memory 가운데 크기가 계속 변하는 항목은 KV cache입니다. 요청마다 길이가 다르고 decode가 진행될수록 자라기 때문에
            scheduler는 매 step 두 가지를 정합니다. 대기 중인 요청을 지금 받아들여도 되는지가 admission입니다. 다음 token을 저장할 block이 없을 때 실행
            중인 요청 가운데 누구를 내보낼지가 preemption입니다.
          </p>
          <p>
            이 글은 그 두 결정만 다룹니다. Block을 어떻게 나누고 fragmentation을 어떻게
            줄이는지는 <Link to="/ai/vllm-paged-attention#block-pool">PagedAttention 글</Link>이,
            RUNNING·WAITING 순서와 token budget은{" "}
            <Link to="/ai/vllm-scheduler#running-waiting-order">scheduler 글</Link>이 설명합니다.
          </p>
          <p>
            읽는 순서는 요청 하나의 memory footprint를 세는 식에서 출발해 watermark를 둔
            admission 판정, memory pressure에서의 preemption, recompute와 swap의 비용
            비교, 마지막으로 hybrid model의 고정 state가 admission을 어떻게 바꾸는지로
            이어집니다.
          </p>
        </div>
        <ServingMemoryAdmissionAndPreemptionViz />
        <ContentBoundary article="serving-memory-admission-and-preemption" />
      </section>

      <section id="footprint" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          요청 footprint는 token 수를 block으로 올림한 뒤 block당 byte를 곱한 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청 하나가 GPU에서 차지할 KV memory는 세 숫자로 정해집니다. Block 하나가 담는 token 수, block 하나의 byte, 그리고 그 요청이 최종적으로 갖게
            될 token 수입니다. Token 수는 prompt 길이에 생성 상한을 더한 값입니다. Block 경계에서 올림하므로 마지막 block은 일부가 비어 있습니다.
          </p>
          <p>
            Block당 byte는 model 구조에서 나옵니다. Layer마다 key와 value를 각각 저장하므로
            token 하나가 layer 하나에서 2 × KV head 수 × head dim × dtype byte를 씁니다.
            32 layer, KV head 8개, head dim 128, FP16이면 token당 4 KiB × 32 = 128 KiB이고,
            16-token block 하나는 2 MiB입니다.
          </p>
          <p>
            그러면 prompt 1,000 token에 최대 500 token을 생성하는 요청의 최종 footprint는
            ceil(1,500 / 16) = 94 block, 188 MiB입니다. 다만 paged 방식에서는 이 전부를
            admission 시점에 잡지 않습니다. Prefill이 필요로 하는 63 block만 먼저 확보하고
            나머지는 decode가 진행될 때 한 block씩 추가합니다.
          </p>
          <p>
            이렇게 token 수를 따라 자라는 sequence-length-dependent allocation이 admission 계산을 두 층으로 나눕니다. 지금 당장 필요한
            block과 끝까지 갔을 때 필요한 block이 다릅니다. Scheduler는 앞의 것으로 받아들인 뒤 뒤의 것을 감당하지 못하면 preemption으로 되돌립니다.
          </p>
          <p>
            같은 계산을 model 크기와 나란히 놓으면 왜 memory가 모자라는지 보입니다. vLLM 논문은 OPT-13B의 token당 KV를 800 KB로 계산했고 40 GB
            A100에서 weight가 약 65%, 동적 state가 약 30%를 차지한다고 적었습니다. 그 30% 안에서 요청 수백 개의 footprint가 경쟁합니다.
          </p>
        </div>
        <ExplainedFormula
          question="요청 하나가 끝까지 갔을 때 GPU KV pool에서 차지하는 byte는 얼마인가요?"
          idea="Token 수를 block 단위로 올림해 block 수를 얻고, model 구조가 정하는 block당 byte를 곱합니다. 마지막 block의 빈자리도 이 요청의 몫입니다."
          formula={String.raw`F_r=\left\lceil \frac{L_p+L_g}{B}\right\rceil\cdot B\cdot 2\,n_{layer}\,n_{kv}\,d_h\,s`}
          annotatedFormula={String.raw`F_r=\underbrace{\left\lceil \frac{L_p+L_g}{B}\right\rceil}_{\text{필요 block 수}}\cdot\underbrace{B\cdot\underbrace{2\,n_{layer}\,n_{kv}\,d_h\,s}_{\text{token당 byte}}}_{\text{block당 byte}}`}
          operations={[
            { expression: String.raw`\left\lceil \frac{L_p+L_g}{B}\right\rceil`, annotation: ["prompt와 생성 상한을 더해 block 크기로 올림해", "마지막 block의 빈자리까지 포함한 block 수 계산"] },
            { expression: String.raw`2\,n_{layer}\,n_{kv}\,d_h\,s`, annotation: ["key와 value를 layer·head·dim·dtype로 곱해", "token 하나의 byte 결정"] },
            { expression: String.raw`B\cdot 2\,n_{layer}\,n_{kv}\,d_h\,s`, annotation: ["token당 byte에 block의 token 수를 곱해", "할당 단위 하나의 byte 확정"] },
          ]}
          terms={[
            { symbol: "L_p", name: "Prompt 길이", description: "Prefill에서 한 번에 처리하는 입력 token 수입니다." },
            { symbol: "L_g", name: "생성 상한", description: "max_tokens처럼 요청이 만들 수 있는 최대 출력 token 수입니다." },
            { symbol: "B", name: "Block당 token 수", description: "vLLM 기본값은 16이며 allocator의 최소 단위입니다." },
            { symbol: String.raw`n_{layer}`, name: "KV를 저장하는 layer 수", description: "Full attention layer만 셉니다." },
            { symbol: String.raw`n_{kv}`, name: "KV head 수", description: "GQA에서는 query head보다 적습니다." },
            { symbol: "d_h", name: "Head dim", description: "Head 하나의 key 또는 value 차원입니다." },
            { symbol: "s", name: "Dtype byte", description: "FP16·BF16은 2, FP8은 1입니다." },
          ]}
          assumptions={["Full attention layer만 계산합니다. Sliding-window·MLA·quantized KV는 token당 byte가 달라집니다.", "Prefix cache hit은 0으로 두었습니다. Hit이 있으면 그만큼 block을 공유합니다."]}
          interpretation="이 값은 요청이 끝까지 갈 때의 상한이며 admission 시점에 잡는 양은 prefill 몫입니다. 상한을 전부 미리 예약하면 논문이 지적한 20.4~38.2%의 KV memory 활용률로 돌아갑니다."
        />
      </section>

      <section id="watermark-admission" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Admission은 free block에서 watermark를 뺀 여유가 남을 때만 통과합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청을 받아들이는 판정은 세 관문을 차례로 지납니다. 동시 sequence 수 상한인
            max_num_seqs, 한 step의 token 예산인 max_num_batched_tokens, 그리고 KV
            memory입니다. 앞의 둘은{" "}
            <Link to="/ai/vllm-scheduler#scheduler-knobs">scheduler 글</Link>이 다뤘고, 이
            세 관문을 합친 것이 request admission control입니다. 이 글은 세 번째 관문인
            memory admission control을 봅니다.
          </p>
          <p>
            Memory 관문은 요청의 prefill block 수를 free block에서 뺀 나머지가 watermark
            이상일 때만 통과시킵니다. Watermark는 pool의 일부를 새 admission이 쓰지 못하게
            남겨 두는 하한선입니다. vLLM V0 block manager는 기본값 0.01, 즉 전체 block의
            1%를 남겼고 그 이유를 잦은 cache eviction을 피하기 위해서라고 적었습니다.
          </p>
          <p>
            왜 100%까지 채우지 않는지는 decode의 성질 때문입니다. 이미 실행 중인 요청은
            step마다 token을 하나씩 더하고 16 token마다 새 block을 요구합니다. Free block을
            0까지 새 요청에 내주면 바로 다음 step에 실행 중인 요청들이 block을 못 받아
            preemption이 시작됩니다. Watermark는 그 성장분을 미리 남겨 두는 예약입니다.
          </p>
          <p>
            수치로 보면 이렇습니다. 80 GiB GPU에 gpu_memory_utilization 0.9를 주면 72 GiB가 engine 몫이고 여기서 weight 16 GiB와
            profiling에서 잰 activation 최대치 2 GiB를 빼면 KV pool은 54 GiB, 2 MiB block 27,648개입니다. Watermark 1%는 276
            block입니다.
          </p>
          <p>
            Free block이 300개일 때 63 block짜리 요청은 300 − 63 = 237이 276보다 작으므로 LATER로 대기하고 350개면 287이 276 이상이므로 OK로
            들어갑니다. 전체 pool에서 watermark를 뺀 것보다 큰 요청은 언제 와도 못 받으므로 NEVER로 거절합니다. NEVER를 LATER로 다루면 그 요청이 queue
            앞에서 영원히 다른 요청을 막습니다.
          </p>
          <p>
            Free block이 watermark 아래로 내려가 실행 중인 요청의 다음 step 수요조차 못
            채우는 상태가 memory pressure입니다. gpu_memory_utilization이 정하는 것은 pool의
            크기이지 pressure의 유무가 아니며, 같은 pool이라도 긴 생성이 몰리면 pressure에
            들어갑니다.
          </p>
          <p>
            다른 engine도 같은 여유를 다른 이름으로 조절합니다. SGLang은 mem-fraction-static으로 weight와 KV pool의 비율을, schedule-
            conservativeness로 받아들이는 보수성을 정합니다. 요청이 자주 retract되면 후자를 키우라고 안내합니다.
          </p>
        </div>
        <ExplainedFormula
          question="새 요청을 지금 받아들여도 되는지는 어떤 부등식으로 정하나요?"
          idea="Admission 뒤에 남을 free block이 watermark 예약분 이상이어야 합니다. Pool 전체로도 못 채우는 요청은 기다려도 소용없으므로 따로 거절합니다."
          formula={String.raw`\begin{aligned}\text{OK}&\iff N_{free}-\left\lceil L_p/B\right\rceil\ge W\\\text{NEVER}&\iff N_{total}-\left\lceil L_p/B\right\rceil<W\\W&=\lfloor w\,N_{total}\rfloor\end{aligned}`}
          annotatedFormula={String.raw`\underbrace{N_{free}-\left\lceil L_p/B\right\rceil}_{\text{admission 뒤 남는 free block}}\ \ge\ \underbrace{\lfloor w\,N_{total}\rfloor}_{\text{watermark 예약 block}},\qquad \underbrace{N_{total}-\left\lceil L_p/B\right\rceil<W}_{\text{pool 전체로도 불가능하면 NEVER}}`}
          operations={[
            { expression: String.raw`\left\lceil L_p/B\right\rceil`, annotation: ["prefill에 당장 필요한 block만 세어", "생성 상한은 admission 조건에서 제외"] },
            { expression: String.raw`N_{free}-\left\lceil L_p/B\right\rceil`, annotation: ["현재 free에서 이 요청 몫을 빼", "받아들인 직후의 여유 계산"] },
            { expression: String.raw`\lfloor w\,N_{total}\rfloor`, annotation: ["비율 w를 전체 block 수에 곱해", "실행 중 요청의 성장분 예약"] },
            { expression: String.raw`N_{total}-\left\lceil L_p/B\right\rceil<W`, annotation: ["pool 전체로도 못 채우는 요청을 걸러", "LATER가 아닌 NEVER로 거절"] },
          ]}
          terms={[
            { symbol: String.raw`N_{free}`, name: "현재 free block 수", description: "이번 step 시작 시점에 어느 요청도 소유하지 않은 GPU block입니다." },
            { symbol: String.raw`N_{total}`, name: "전체 GPU block 수", description: "Profiling으로 잰 KV pool byte를 block당 byte로 나눈 값입니다." },
            { symbol: "W", name: "Watermark block 수", description: "새 admission이 건드리지 못하는 예약분입니다." },
            { symbol: "w", name: "Watermark 비율", description: "vLLM V0 BlockSpaceManagerV1의 기본값은 0.01입니다." },
          ]}
          assumptions={["vLLM V0 BlockSpaceManagerV1.can_allocate의 OK·LATER·NEVER 조건을 옮긴 것입니다.", "다른 engine은 비율 대신 절대 block 수나 token 수로 같은 예약을 표현합니다."]}
          interpretation="Watermark는 throughput을 조금 포기해 preemption 빈도를 낮추는 장치입니다. w를 0으로 두면 pool을 다 쓰지만 pressure에 더 빨리 들어갑니다."
        />
      </section>

      <section id="preemption-modes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Preemption은 victim의 KV를 버리고 다시 계산하거나 CPU로 옮겼다가 되가져옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Memory pressure에 들어가면 scheduler는 실행 중인 요청 하나를 victim으로 고릅니다. vLLM 논문은 FCFS 순서에서 가장 늦게 온 요청부터 내보내고
            한 요청의 block은 전부 내보내거나 하나도 내보내지 않는 all-or-nothing을 택했습니다. 한 요청의 block은 함께 읽히므로 일부만 남겨서는 얻는 것이 없기
            때문입니다.
          </p>
          <p>
            내보낸 뒤 KV를 어떻게 할지가 recompute와 swap의 갈림길입니다. Recompute
            preemption은 block을 pool에 돌려주고 요청을 WAITING queue 앞에 되돌립니다.
            재개 때는 prompt와 그때까지 생성한 token을 이어 붙여 하나의 prompt처럼
            prefill하므로, 원래 decode로 하나씩 만들던 시간보다 훨씬 짧게 복구됩니다.
          </p>
          <p>
            Swap preemption은 block 내용을 CPU memory의 swap 영역으로 복사하고 요청을 SWAPPED 상태로 둡니다. 재개는 free block이
            watermark를 넘길 만큼 남았을 때 다시 GPU로 복사하는 swap-in입니다. vLLM V0은 swap_space로 GPU당 CPU swap 크기를 잡았고 기본값은 4
            GiB입니다. CPU로 나간 block 수는 GPU 전체 block 수를 넘지 않습니다.
          </p>
          <p>
            두 비용을 앞의 예시 요청으로 비교해 보겠습니다. 1,500 token을 계산한 뒤 내보내진 요청을 recompute로 복구하면 8B model 기준 prefill 연산이 2
            × 8 × 10⁹ × 1,500 ≈ 24 TFLOP입니다. 유효 400 TFLOP/s로 잡으면 약 60 ms입니다. Swap은 188 MiB를 PCIe로 내보내고 되가져오므로
            25 GB/s라면 왕복 약 16 ms입니다.
          </p>
          <p>
            숫자만 보면 swap이 유리해 보이지만 전제가 있습니다. 188 MiB는 layer마다 key와 value가 따로 놓인 32 KiB짜리 조각 6,016개로 흩어져 있습니다.
            Block이 작을수록 전송 횟수가 늘고 유효 PCIe 대역폭이 떨어집니다. 논문은 block 16~64에서 두 방식이 비슷하고 그보다 작은 block에서는 swap이 뚜렷이
            불리하며 recompute 비용은 block 크기와 무관하다고 보고했습니다.
          </p>
          <p>
            현재 vLLM V1 문서는 기본 preemption mode를 RECOMPUTE로 두며 V1 구조에서
            recompute의 overhead가 더 낮다고 설명합니다. Prefix cache가 있으면 재개 시
            prompt 부분을 hit해 recompute 비용이 더 줄어드는데, 그 계산은{" "}
            <Link to="/ai/vllm-scheduler#preemption">scheduler 글의 recomputation cost 식</Link>이
            맡습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Memory pressure에서 victim을 내보내고 재개하는 scheduler step"
          input={["실행 중 요청 R (도착순)", "대기 queue Q", "free block 수 N_free", "watermark W", "preemption mode ∈ {recompute, swap}"]}
          steps={[
            { code: "for r in R: need[r] ← (len(r) + 1 > B · blocks(r)) ? 1 : 0", note: "이번 step에 새 block이 필요한 실행 중 요청을 셉니다. 16 token마다 하나씩 생깁니다." },
            { code: "while Σ need > N_free:", note: "실행 중 요청의 성장분조차 못 채우면 memory pressure입니다." },
            { code: "  v ← R.pop_last()", note: "FCFS에서 가장 늦게 온 요청이 victim이고, 그 block은 전부 내보냅니다." },
            { code: "  if mode = recompute: free(blocks(v)); v.computed ← 0; Q.push_front(v)", note: "Block을 pool에 즉시 돌려주고, 재개 시 prompt와 생성분을 한 번의 prefill로 다시 만듭니다." },
            { code: "  else: copy_out(blocks(v) → cpu); v.state ← SWAPPED", note: "CPU swap에 자리가 있을 때만 가능하고, 없으면 recompute로 떨어집니다." },
            { code: "  N_free ← N_free + |blocks(v)|", note: "돌려받은 block으로 남은 실행 요청의 성장분을 채웁니다." },
            { code: "for r in R: allocate(need[r])", note: "실행 중 요청의 이번 step block을 먼저 배정합니다. 여기에는 watermark 조건이 없습니다." },
            { code: "while Q and N_free − blocks(Q.head.prefill) ≥ W: admit(Q.pop_front())", note: "Swap-in 후보와 새 요청 모두 같은 watermark 조건으로 들어옵니다." },
          ]}
          repeatUntil="매 scheduler step마다 반복합니다."
          output="이번 step의 실행 집합 R, 갱신된 Q, N_free"
        />
        <TermBreakdown
          title="Recompute와 swap이 각각 무엇을 소비하는지"
          items={[
            { term: "Recompute preemption", description: "Victim의 block을 pool에 돌려주고 재개 시 prompt와 생성분을 한 번에 prefill합니다.", example: "1,500 token 요청을 8B model에서 되살리면 약 24 TFLOP, 유효 400 TFLOP/s에서 약 60 ms입니다.", boundary: "GPU 연산을 소비하므로 재개 prefill이 다른 요청의 decode step을 밀어냅니다." },
            { term: "Swap preemption", description: "Victim의 block을 CPU swap으로 복사해 두고 free block이 watermark를 넘기면 되가져옵니다.", example: "188 MiB를 25 GB/s로 왕복하면 약 16 ms이지만 32 KiB 조각 6,016개로 나뉘어 있습니다.", boundary: "CPU RAM과 PCIe 대역폭을 소비하고, swap_space를 넘으면 쓸 수 없으며 작은 block에서 불리합니다." },
            { term: "Memory pressure", description: "Free block이 실행 중 요청의 다음 step 수요보다 적은 상태입니다.", example: "실행 중 세 요청이 각각 block 하나를 요구하는데 free가 1개면 둘은 못 받습니다.", boundary: "Pool과 workload의 관계에서 생기므로 같은 설정에서도 시간에 따라 드나듭니다." },
            { term: "Memory watermark", description: "새 admission이 쓰지 못하도록 pool에 남겨 두는 free block 하한입니다.", example: "27,648 block의 1%면 276 block, 552 MiB입니다.", boundary: "실행 중 요청의 block 추가에는 적용되지 않으므로 pressure 자체를 막지는 못합니다." },
          ]}
        />
        <ProgressiveDetail
          title="누구를 victim으로 고를지는 recompute·swap과 별개의 선택입니다"
          preview="논문의 기본은 FCFS에서 가장 늦게 온 요청이지만, 우선순위 scheduling이 켜지면 우선순위가 낮은 요청이 먼저 나갑니다. Victim 정책과 KV 처리 방식은 독립적으로 바꿀 수 있습니다."
        >
          <p>
            FCFS 최후 도착 규칙은 starvation을 막는 대신 긴 생성이 먼저 들어와 있으면 짧은 요청이 계속 밀려나는 head-of-line blocking을 감수합니다.
            FastServe처럼 output token 경계에서 선점하는 MLFQ를 쓰면 victim 정책이 바뀌지만 그 state를 GPU에 두는지 host로 내리는지는 여전히 이 글의
            recompute·swap 축에서 따로 정합니다.
          </p>
          <p>
            Swap을 고르면 한 가지 조건이 더 붙습니다. CPU swap에 victim의 block 수만큼
            자리가 있어야 하며, 없으면 engine은 그 요청을 recompute로 내보냅니다. 기본
            4 GiB swap은 2 MiB block 2,048개이므로 앞의 예시 요청 약 21개 분량입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="hybrid-fixed-state" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hybrid model은 길이와 무관한 고정 state를 admission 시점에 통째로 잡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention과 recurrent layer를 섞은 hybrid model에서는 요청 footprint가 두 항으로 갈라집니다. Attention layer의 KV는
            token 수에 비례해 block 단위로 자랍니다. DeltaNet·Mamba 계열 recurrent layer의 state는 요청당 shape가 고정입니다. 이 고정 항을
            따로 잡는 것이 fixed recurrent-state allocation입니다.
          </p>
          <p>
            고정 state는 자라지 않는 대신 처음부터 전부 있어야 합니다. Token을 하나
            처리하려면 모든 recurrent layer의 state가 갱신 가능해야 하므로 admission 시점에
            그 전체를 확보합니다. Prefill 몫만 먼저 잡고 나머지를 decode 중에 늘리던 KV와
            달리 고정 항은 나중으로 미룰 수 없습니다.
          </p>
          <p>
            수치로 보면 비중이 뒤집힙니다. Recurrent layer 48개가 각각 48 head × 128 × 128
            FP16 state를 가지면 layer당 1.5 MiB, 요청당 72 MiB입니다. Attention layer가
            16개면 token당 64 KiB, block당 1 MiB이므로 100 token 요청은 KV 7 MiB에 state
            72 MiB, 1,500 token 요청은 KV 94 MiB에 state 72 MiB입니다.
          </p>
          <p>
            Admission 조건의 필요 block은 prefill block에 고정 state block을 더한 값이 됩니다. 고정 state를 같은 pool의 block으로 환산하면
            1 MiB block 기준 72개입니다. 짧은 요청 하나가 긴 요청과 비슷한 block을 즉시 요구하고 동시 요청 수 상한이 곧 memory 상한이 됩니다.
          </p>
          <p>
            Layer 종류별 block을 한 pool에 놓는 방법은{" "}
            <Link to="/ai/vllm-paged-attention#hybrid-cache-groups">PagedAttention 글의 cache group 절</Link>이
            설명합니다. 이 글은 그 환산이 끝났다고 보고 admission 부등식만 다룹니다.
          </p>
          <p>
            Preemption도 달라집니다. 고정 state를 내보내면 길이와 무관하게 72 MiB가 돌아옵니다. Swap이라면 layer당 하나씩 48번의 큰 복사이므로 KV의 32
            KiB 조각보다 PCIe를 잘 씁니다. 반면 recompute는 prompt 전체를 다시 훑어야만 recurrent state를 복원하므로 긴 요청에서는 KV와 같은 속도로
            비용이 늘어납니다.
          </p>
        </div>
        <ExplainedFormula
          question="Hybrid model에서 admission이 즉시 확보해야 하는 block은 어떻게 바뀌나요?"
          idea="길이에 비례하는 prefill block에 요청당 고정인 recurrent state block을 더합니다. 고정 항은 요청 수에만 곱해집니다."
          formula={String.raw`N_{need}(r)=\left\lceil \frac{L_p}{B}\right\rceil+\left\lceil \frac{n_{rec}\,S_{rec}}{\beta}\right\rceil`}
          annotatedFormula={String.raw`N_{need}(r)=\underbrace{\left\lceil \frac{L_p}{B}\right\rceil}_{\text{길이 비례 prefill block}}+\underbrace{\left\lceil \frac{n_{rec}\,S_{rec}}{\beta}\right\rceil}_{\text{요청당 고정 state block}}`}
          operations={[
            { expression: String.raw`\left\lceil \frac{L_p}{B}\right\rceil`, annotation: ["attention layer가 있는 model의 prefill 몫을", "block으로 올림"] },
            { expression: String.raw`n_{rec}\,S_{rec}`, annotation: ["recurrent layer 수에 layer당 state byte를 곱해", "요청 하나의 고정 byte 계산"] },
            { expression: String.raw`\left\lceil \frac{n_{rec}\,S_{rec}}{\beta}\right\rceil`, annotation: ["고정 byte를 block당 byte로 나눠 올림해", "같은 pool의 block 수로 환산"] },
          ]}
          terms={[
            { symbol: String.raw`n_{rec}`, name: "Recurrent layer 수", description: "예시에서는 48입니다." },
            { symbol: String.raw`S_{rec}`, name: "Layer당 state byte", description: "48 × 128 × 128 × 2 B = 1.5 MiB입니다." },
            { symbol: String.raw`\beta`, name: "Block당 byte", description: "예시에서는 attention 16 layer 기준 1 MiB입니다." },
          ]}
          assumptions={["Recurrent state를 KV와 같은 pool의 block으로 환산할 수 있다고 가정합니다. 실제 engine은 page 크기를 맞추는 cache group을 씁니다.", "Convolution history 같은 작은 고정 항은 생략했습니다."]}
          interpretation="고정 항이 있으면 짧은 요청도 즉시 큰 block을 요구하므로 동시 요청 수가 admission의 실질적 한계가 되고, decode 중 성장은 attention 몫에서만 일어납니다."
        />
      </section>

      <section id="paper-vllm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 vLLM 논문의 preemption 절과 각 engine의 memory 설정 문서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            vLLM 논문은 preemption을 FCFS와 all-or-nothing eviction으로 정의하고 recompute와
            swap을 block 크기별로 비교했습니다. 그 결과는 OPT 계열 model과 A100, 논문이
            시험한 block 크기 범위의 저자 자기보고입니다. 이 글의 60 ms·16 ms 같은 수치는
            논문 값이 아니라 위 예시 구성으로 직접 계산한 것입니다.
          </p>
          <p>
            설정값의 기본치는 각 engine 문서에서 가져왔습니다. Watermark 0.01은 vLLM V0 block manager code의 기본 인자이고 V1 문서는 기본
            mode를 RECOMPUTE로 적었습니다. SGLang과 TensorRT-LLM은 같은 문제를 다른 이름의 설정으로 다루므로 수치는 각 engine 범위 안에서만 읽어야
            합니다.
          </p>
        </div>
        <CitationBlock
          source="Kwon et al. · Efficient Memory Management for Large Language Model Serving with PagedAttention (SOSP 2023)"
          citeKey={1}
          href="https://arxiv.org/abs/2309.06180"
        >
          4.5절은 FCFS, all-or-nothing eviction, CPU swap과 recompute를 정의하고 7.3절은 block
          16~64에서 두 방식의 성능이 비슷하며 작은 block에서 swap이 PCIe 소전송 때문에
          불리하다고 보고합니다. OPT-13B token당 800 KB, 기존 system의 KV 활용률 20.4~38.2%도
          이 논문의 수치입니다.
        </CitationBlock>
        <div id="paper-vllm-docs" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM 문서 · Optimization and Tuning — Preemption"
            citeKey={2}
            href="https://docs.vllm.ai/en/latest/configuration/optimization.html"
            type="code"
          >
            V1의 기본 preemption mode가 RECOMPUTE이며 recompute overhead가 더 낮다고
            적습니다. Preemption을 줄이는 조정으로 gpu_memory_utilization 증가,
            max_num_seqs·max_num_batched_tokens 감소, tensor parallel 확대를 듭니다. V0 engine
            인자 문서는 swap_space 기본 4 GiB와 preemption_mode 선택을 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-sglang-scheduler" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="SGLang 문서 · Server Arguments"
            citeKey={3}
            href="https://docs.sglang.io/advanced_features/server_arguments.html"
            type="code"
          >
            mem-fraction-static이 weight와 KV pool의 정적 할당 비율을, max-total-tokens가 pool의
            token 수를 정합니다. schedule-conservativeness는 클수록 보수적으로 받아들이며,
            요청이 자주 retract되면 값을 키우라고 안내합니다.
          </CitationBlock>
        </div>
        <div id="paper-trtllm-kvcache" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="TensorRT-LLM 문서 · KV Cache System"
            citeKey={4}
            href="https://nvidia.github.io/TensorRT-LLM/features/kvcache.html"
            type="code"
          >
            free_gpu_memory_fraction 기본 0.9와 max_tokens 가운데 작은 쪽으로 pool을 잡고,
            block eviction 전에 host memory로 내리는 secondary offload를 host_cache_size로
            켭니다. 요청 단위 preemption 정책은 이 페이지가 다루지 않으므로 여기서 주장하지
            않습니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 읽기는 이 판정을 replica 수와 배포 용량으로 올리는{" "}
            <Link to="/ai/llm-serving-capacity#capacity-admission">serving capacity 글</Link>과,
            weight·KV·workspace를 한 장부로 계산하는{" "}
            <Link to="/ai/model-vram-budgeting#runtime-state">VRAM budgeting 글</Link>입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
