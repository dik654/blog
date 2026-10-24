import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReservationPoolViz from "./tensorrt-llm-kv-cache-and-kernels/viz/ReservationPoolViz";
import PoolLayoutViz from "./tensorrt-llm-kv-cache-and-kernels/viz/PoolLayoutViz";
import PartialReuseCopyViz from "./tensorrt-llm-kv-cache-and-kernels/viz/PartialReuseCopyViz";
import RetentionTierViz from "./tensorrt-llm-kv-cache-and-kernels/viz/RetentionTierViz";
import XqaGroupViz from "./tensorrt-llm-kv-cache-and-kernels/viz/XqaGroupViz";
import { codeRefs } from "./tensorrt-llm-kv-cache-and-kernels/codeRefs";
import { engineTrees } from "./tensorrt-llm-kv-cache-and-kernels/fileTree";
import { ExecutionKernelMapReturn, ExecutionKernelSeriesLocator } from "./shared/ExecutionKernelSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function TensorrtLlmKvCacheAndKernelsArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <ExecutionKernelSeriesLocator current="trtllm" />
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 같은 KV pool인데 한쪽은 4개, 다른 쪽은 10개를 받습니다</h2>
          <ReservationPoolViz />
          <div className={prose}>
            <p>
              GPU 한 장에 KV cache로 쓸 자리가 5,120 token만큼 있다고 해 봅시다. 요청은 모두 프롬프트 200 token에 출력 한도 1,000 token을 달고
              오지만 실제로는 300 token을 만들고 끝납니다. (가정) TensorRT-LLM을 기본 설정으로 띄우면 이 요청을 동시에 4개 받습니다. vLLM은 같은 자리에 끝난
              시점 기준으로 10개를 담습니다.
            </p>
            <p>
              두 엔진 모두 KV를 고정 크기 block으로 쪼개는 paged KV를 씁니다. 그런데도 수가 다른 이유는 block을 언제, 얼마나,
              어떤 모양으로 떼어 두느냐가 다르기 때문입니다. 이 글의 답을 먼저 한 문장으로 적겠습니다.
            </p>
            <p>
              TensorRT-LLM은 block 하나에 모든 층의 K와 V를 묶습니다. 요청을 받을 때 출력 한도까지 쓸 block을 미리 예약하고,
              다 쓴 block은 우선순위에 따라 GPU와 호스트 메모리 두 단에 남깁니다. attention은 RoPE와 KV 쓰기, 양자화까지 합친
              자체 kernel로 실행합니다.</p>
            <p>
              vLLM은 층마다 따로 tensor를 두고 필요한 만큼만 받았다가 모자라면 요청을 내보냅니다. 다 쓴 block은 한 줄 LRU로 남기고 attention은 외부
              kernel에 맡긴 채 KV 쓰기를 따로 붙입니다.
            </p>
            <p>
              이 네 가지 차이가 각각 무엇을 얻고 무엇을 내주는지를 같은 요청 하나로 따라갑니다. 마지막에는 kernel이 엔진 사이에 점점 공유되고 있어서 오래 남는 차이는 메모리와
              스케줄링 정책 쪽이라는 점도 확인합니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 엔진은 매 step 같은 네 가지를 정합니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 두 엔진은 같은 상자입니다. 요청이 들어오면 한 step마다 GPU에서 모델을 한 번 돌리고 요청마다 token을 하나씩 내보냅니다. 이 상자가 step마다
              내리는 결정은 네 가지로 나눌 수 있습니다.
            </p>
            <p>
              첫째는 이번 step에 누구를 태울지입니다. 이미 생성 중인 요청과 새로 들어온 요청이 같은 batch에 섞입니다. 둘째는
              태운 요청의 KV를 메모리 어디에 둘지입니다. 셋째는 끝난 요청이 남긴 KV를 언제까지 남겨 둘지입니다. 넷째는 attention
              계산을 어떤 kernel로 할지입니다.
            </p>
            <p>
              앞의 셋은 메모리 관리자와 scheduler가, 마지막 하나는 attention 구현이 맡습니다. 두 엔진의 이름이 다른 부품들은 결국
              이 네 질문에 다른 답을 냈다고 보면 됩니다. 출력 token의 값 자체는 같은 모델과 같은 sampling이라면 엔진과 무관하게
              같아야 하므로, 이 글은 값이 아니라 자리와 순서와 실행 방식을 비교합니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 프롬프트 200, 한도 1,000, 실제 300인 요청을 셉니다</h2>
          <div className={prose}>
            <p>
              pool은 5,120 token 자리입니다. TensorRT-LLM의 기본 block은 32 token이라 160 block이고 vLLM의 기본 block은 16
              token이라 320 block입니다. 두 엔진이 가진 byte는 같고 칸을 자르는 크기만 다릅니다. (가정)
            </p>
            <p>
              요청 하나가 출력 한도까지 간다면 200+1,000=1,200 token입니다. 32 token block으로 나누면 37.5라서 올림해
              38 block입니다. 실제로 300 token에서 멈추면 500 token이므로 ⌈500÷32⌉=16 block만 씁니다.
            </p>
            <p>
              vLLM의 16 token block으로는 프롬프트 200 token에 ⌈200÷16⌉=13 block이 필요하고 마지막 block에는 8칸이 빕니다. 끝난 시점의 500
              token은 ⌈500÷16⌉=32 block입니다. 320 block pool이면 끝난 시점 기준으로 32 block짜리 요청 10개가 꼭 맞게 들어갑니다.
            </p>
            <p>
              이제 두 질문이 남습니다. 요청을 받는 순간 38 block을 떼어 두면 몇 개를 받을 수 있을까요? 떼어 두지 않고 받으면 그
              대가는 무엇일까요? 다음 절의 그림이 두 답을 칸 수로 보여 줍니다.
            </p>
          </div>
        </section>

        <section id="picture" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 미리 떼어 두면 칸이 남고, 나중에 받으면 내보낼 일이 생깁니다</h2>
          <div className={prose}>
            <p>
              첫 장면은 받을 때 끝까지 쓸 칸을 떼어 두는 방식입니다. 38칸씩 4개가 152칸을 차지하고 8칸이 남습니다. 다섯째
              요청은 38칸이 필요한데 8칸뿐이라 기다립니다. 이때 실제로 KV가 적힌 칸은 프롬프트 몫인 ⌈200÷32⌉=7칸씩, 모두 28칸입니다.
            </p>
            <p>
              둘째 장면은 네 요청이 모두 300 token에서 멈춘 순간입니다. 실제로 쓴 칸은 16칸씩 64칸이고 예약만 하고 끝까지 비어
              있던 칸이 4×(38−16)=88칸입니다. 출력 한도를 실제 길이보다 크게 잡을수록 이 빈칸이 커집니다.
            </p>
            <p>
              셋째 장면은 다음 step에 필요한 칸만 받는 방식입니다. 같은 pool에 10개가 들어갑니다. 넷째 장면은 그 대가입니다. 칸이
              모두 찼는데 누군가 다음 칸을 원하면, 가장 늦게 들어온 요청을 내보내 그 칸을 돌려받아야 합니다.
            </p>
          </div>
        </section>

        <section id="why" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 내보낸 요청은 지금까지의 KV를 다시 계산합니다</h2>
          <div className={prose}>
            <p>
              내보낸 요청의 KV는 사라집니다. 150 token을 만든 뒤 내보낸 요청이 다시 들어오면 프롬프트 200과 생성분 150을 합친 350 token의 KV를 처음부터 다시
              만들어야 합니다. 그동안 이 요청은 token을 내지 못하고 다시 계산하는 GPU 시간은 다른 요청에게서 빌려 옵니다.
            </p>
            <p>
              끝까지 예약하면 이 일이 아예 일어나지 않습니다. 받은 요청은 출력 한도까지 칸이 보장되므로 중간에 쫓겨나지 않고 token 사이 간격도 예측하기 쉽습니다. 대가는 3절에서
              센 88칸입니다. 실제 출력이 한도에 가까운 작업이라면 빈칸은 작아지고 짧게 끝나는 대화라면 커집니다.
            </p>
            <p>
              그래서 선택 기준은 출력 길이 분포입니다. 출력 한도와 실제 길이가 비슷하면 예약이 거의 손해가 없고 재계산도 없습니다. 한도가 실제보다 훨씬 크면 그때그때 받는 쪽이 동시
              요청 수를 크게 늘리지만 pool이 차는 순간마다 재계산이 생깁니다.
            </p>
            <p>
              내보낸 요청의 앞부분 KV가 다른 재사용 장치에 남아 있다면 350 token을 전부 다시 계산하지 않을 수도 있습니다. 이 경로는
              뒤의 10절과 <a href="/cs/ai/serving-memory-admission-and-preemption#recovery-cost">선점 복구 비용</a>에서
              다룹니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 끝까지 예약하는 정책을 GUARANTEED_NO_EVICT라고 부릅니다</h2>
          <div className={prose}>
            <p>
              TensorRT-LLM의 scheduler 가운데 KV 자리를 보고 요청 수를 정하는 부품이 capacity scheduler입니다. 받을 때 끝까지 예약하는 정책 이름은
              GUARANTEED_NO_EVICT이고 LLM API의 기본값입니다. 다음 step 몫만 예약하다가 모자라면 요청을 멈추는 정책은 MAX_UTILIZATION입니다. 이
              정책이 요청을 멈추는 일을 pause라고 부릅니다.
            </p>
            <p>
              vLLM에서 같은 일을 하는 동작은 선점(preemption)입니다. 현재 V1 scheduler는 내보낸 요청의 KV를 버리고 다시 계산하는
              방식 하나만 씁니다. 동작 방식은 TensorRT-LLM의 MAX_UTILIZATION과 같은 방향입니다. 차이는 vLLM에는
              GUARANTEED_NO_EVICT에 해당하는 끝까지 예약 모드가 없다는 점입니다.
            </p>
            <p>
              block 하나가 담는 token 수는 TensorRT-LLM에서 tokens_per_block이라고 부르고 기본값이 32입니다. vLLM에서는
              같은 값을 block_size라고 부르며 기본값이 16입니다. 끝난 요청을 빼고 새 요청을 매 step 다시 넣는 batching은 TensorRT-LLM 문서에서 in-flight batching,
              vLLM에서 continuous batching이라고 부르는 같은 개념입니다. 기본 원리는{" "}
              <a href="/cs/ai/continuous-batching-step-anatomy#step-unit">continuous batching의 step 단위</a>에서 봅니다.
            </p>
            <p>
              TensorRT-LLM의 in-flight batching에는 규칙이 하나 더 있습니다. 입력 tensor 안에서 프롬프트를 처리하는 context 단계
              token이 생성 단계 token보다 앞에 와야 합니다. 요청 S0·S2가 context, S1이 생성이라면 S0과 S2의 token을 먼저 놓고
              S1의 token을 뒤에 붙입니다. 한 step의 token 합은 max_num_tokens(기본 8,192)를 넘지 못합니다.
            </p>
          </div>
          <div id="paper-trtllm-ifb" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="TensorRT-LLM · Paged Attention, IFB, and Request Scheduling (2026-10-14 확인)" citeKey={1} href="https://nvidia.github.io/TensorRT-LLM/features/paged-attention-ifb-scheduler.html">
              문서는 context 단계 sequence가 생성 단계 sequence보다 입력 tensor에서 앞에 와야 한다고 적고, max_num_tokens 기본값을
              8,192로 둡니다. 장난감 예제는 max batch size 4, max num tokens 12에서 프롬프트 5 token 요청 둘을 받으면 2 token만
              남아 셋째 요청을 받지 못한다고 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 다섯째 요청이 기다리는 이유를 한 step 안에서 따라갑니다</h2>
          <div className={prose}>
            <p>
              네 요청이 생성 중이고 다섯째가 대기열에 있는 step을 따라가 보겠습니다. GUARANTEED_NO_EVICT는 먼저 실행 중인 요청을
              훑습니다. 각 요청의 남은 몫을 떼어 둔 뒤에야 새 요청을 봅니다. 순서가 거꾸로면 새 요청이 기존 요청의 몫을 가져가
              보장이 깨집니다.
            </p>
            <p>
              네 요청은 각각 38 block을 이미 받았거나 받을 몫이 정해져 있으므로 152 block이 묶입니다. 다섯째 요청의 남은 몫은
              아직 하나도 할당되지 않았으니 38 block 전부입니다. 남은 8 block으로는 부족하므로 이 요청에서 반복을 멈춥니다. 다음
              요청들도 이번 step에는 보지 않습니다.
            </p>
            <p>
              어느 요청 하나가 300 token에서 끝나면 그 요청의 block이 돌아옵니다. 다음 step에서는 남은 몫 계산이 다시 이뤄지고 빈 block이 46개가 되므로 다섯째
              요청이 들어옵니다. 실제 사용은 16 block이었지만 돌아오는 양은 그 요청에 걸려 있던 전체이므로 38 block이 풀립니다.
            </p>
          </div>
          <AlgorithmBlock
            title="GUARANTEED_NO_EVICT의 한 step 수용 판단 (의사코드)"
            input={["running: 생성 중인 요청 4개", "waiting: 대기 요청 [R5, R6]", "free: 160 block"]}
            steps={[
              { code: "for r in running: free -= remaining_blocks(r)", note: "네 요청이 38씩, free = 160 − 152 = 8" },
              { code: "for r in waiting:", note: "R5부터 도착 순서대로 봅니다" },
              { code: "  need = ceil((prompt + max_new) / 32) - allocated(r)", note: "R5는 ceil(1,200 ÷ 32) − 0 = 38" },
              { code: "  if need > free: break", note: "38 > 8이므로 멈춥니다. R6은 이번 step에 보지 않습니다" },
              { code: "  free -= need; schedule(r)", note: "통과한 요청만 몫을 떼고 실행 목록에 넣습니다" },
            ]}
            output="이번 step 실행: 생성 중 4개, 새 요청 0개"
            repeatUntil="매 step 반복합니다. 요청이 끝나면 그 몫 38 block이 free로 돌아옵니다."
          />
        </section>

        <section id="reservation-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 실제 코드도 출력 한도까지 더해서 셉니다</h2>
          <div className={prose}>
            <p>
              고정한 TensorRT-LLM commit 681cff1의 capacityScheduler.cpp 222–451행이 GUARANTEED_NO_EVICT의 구현입니다.
              283–296행은 생성 중인 요청마다 enoughAvailableBlocks와 commitBlocks를 불러 남은 몫을 먼저 뺍니다. 407–447행은 새 요청에 같은
              검사를 하고 실패하면 445행의 break로 반복을 끝냅니다. 7절의 의사코드와 같은 순서입니다.
            </p>
            <p>
              남은 몫은 kvCacheManager.cpp 3492행의 getRemainingBlocksToCompletion이 셉니다. 3530행은 프롬프트 block을
              min(200, window)÷32로 내려 6으로 만들고, 3532행은 프롬프트와 max_new_tokens의 합을 올림해 38로 만듭니다. 아직
              할당한 block이 없으면 3596–3600행이 6+32=38을 돌려줍니다. 실제 출력이 300에서 끝날지는 이 계산에 들어가지 않습니다.
            </p>
            <p>
              MAX_UTILIZATION은 같은 파일 3403행의 getNeededBlocksOneStep으로 이번 step 몫만 셉니다. 생성 중인 요청은 다음 token이
              32 token 경계를 넘을 때만 1 block을 요구합니다.</p>
            <p>
              자리가 모자라면 capacityScheduler.cpp 598–610행이 가장 늦게 시작한
              요청을 골라 pause합니다. llmRequest.h 793–799행의 pause는 beam이 1일 때 프롬프트 길이를 200+150=350처럼 생성분까지
              늘려 다시 context 단계로 돌립니다.
            </p>
            <p>
              vLLM v0.27.1 commit 6e448d0의 scheduler.py 575–630행은 allocate_slots로 이번 step의 새 token 수만큼만 자리를 구합니다.
              실패하면 FCFS 정책에서 615행의 running.pop()으로 가장 늦게 들어온 요청을 내보냅니다. 1290–1294행의 _preempt_request는
              그 요청의 block을 반납하고 num_computed_tokens를 0으로 되돌립니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("trt-no-evict", "GUARANTEED_NO_EVICT 수용 판단")}
            {code("trt-remaining-blocks", "끝까지 필요한 block 수")}
            {code("trt-defaults", "LLM API 기본 정책")}
            {code("trt-one-step", "MAX_UTILIZATION의 한 step 몫")}
            {code("trt-pause", "자리가 모자랄 때 pause")}
            {code("trt-pause-recompute", "pause 뒤 다시 계산할 길이")}
            {code("vllm-preempt", "vLLM allocate_slots와 선점")}
            {code("vllm-preempt-reset", "vLLM 선점 시 계산량 초기화")}
          </div>
        </section>

        <section id="pool-layout" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. block 하나가 모든 층을 담는지에 따라 복사 횟수가 달라집니다</h2>
          <div className={prose}>
            <p>
              이번에는 칸의 모양을 봅니다. 설명용 모델은 80층, 층마다 KV head 8개, head 하나 128차원, FP16입니다. (가정) token
              하나의 KV는 층 하나에서 K와 V 두 개 × head 8개 × 128차원 × 2 byte = 4,096 byte, 곧 4 KiB입니다. 80층을 합하면
              token 하나에 320 KiB입니다.
            </p>
            <p>
              TensorRT-LLM의 pool tensor는 첫 축이 block 번호입니다. kvCacheManager.cpp 1091–1093행이 만드는 shape는{" "}
              {"{numBlocks, numLayers, kvFactor, blockSize}"}입니다. 그래서 block 하나를 고르면 1층부터 80층까지의 K와 V가 이어진
              한 덩어리가 나옵니다. kvCacheManager.h 816행의 blockSize는 KV head 수 × head 차원 × block token 수로, 8×128×32를
              곱한 32,768개 원소입니다.
            </p>
            <p>
              vLLM의 FlashAttention backend는 층 하나의 shape만 정합니다. flash_attn.py 134–144행의 shape는 (num_blocks,
              num_kv_heads, block_size, 2×head_size)이고 층마다 이런 tensor가 하나씩 있습니다. block 번호 5는 80개 tensor 각각에 따로
              있습니다.
            </p>
            <p>
              모든 층을 block 단위로 붙이는 배치는 KV connector가 그 배치를 원하고 다른 두 조건도 맞을 때만 고릅니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="32 token의 KV를 호스트로 옮길 때의 조각 수"
            question="같은 요청의 32 token KV를 GPU 밖으로 옮기면 몇 번 복사하고 한 번에 몇 byte를 옮기나요?"
            scope="KV 본체만 셉니다. FP8 scale, block 번호표, 복사 명령의 고정 지연은 넣지 않았습니다."
            steps={[
              { label: "token·층당 KV", expression: "2 × 8 × 128 × 2 B", result: "4,096 B = 4 KiB", reason: "K와 V 두 개, KV head 8개, head 차원 128, FP16 2 byte입니다." },
              { label: "TensorRT-LLM block의 층 하나·K 또는 V", expression: "8 × 128 × 32 × 2 B", result: "64 KiB", reason: "blockSize가 KV head × 차원 × 32 token이고 원소 하나가 2 byte입니다." },
              { label: "TensorRT-LLM block 하나 전체", expression: "80층 × 2(K·V) × 64 KiB", result: "10,240 KiB = 10 MiB, 1조각", reason: "pool 첫 축이 block이라 80층이 한 block 안에 이어져 있습니다." },
              { label: "vLLM page 하나·층 하나", expression: "16 × 8 × (2 × 128) × 2 B", result: "65,536 B = 64 KiB", reason: "16 token block, K와 V를 마지막 축에 함께 둡니다." },
              { label: "vLLM으로 32 token", expression: "2 page × 80층", result: "160조각, 합계 10 MiB", reason: "같은 block 번호가 층마다 다른 tensor에 있으므로 층마다 따로 집습니다." },
            ]}
            conclusion="옮기는 byte는 10 MiB로 같고, TensorRT-LLM은 복사 한 번, vLLM 기본 배치는 64 KiB 조각 160번입니다."
            caveats={["vLLM도 KV connector가 cross-layer 배치를 원하면 block마다 모든 층을 이어 둡니다.", "TensorRT-LLM도 sliding window 층처럼 window나 head 수가 다른 층은 다른 pool에 둡니다."]}
          />
          <PoolLayoutViz />
          <div className={prose}>
            <p>
              이 차이는 GPU 안에서 attention을 계산할 때보다 block을 통째로 옮길 때 드러납니다. 11절의 호스트 offload, 분리 서빙의 KV 전송이 그런
              경우입니다. 반대로 층마다 tensor가 따로 있으면 층별로 다른 head 수나 dtype을 다루기 쉽습니다. TensorRT-LLM 문서도 window 크기나 head
              수가 다른 층은 별도 pool로 나누고 pool 사이의 메모리 비율을 처음에 고정한다고 적습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("trt-pool-shape", "block 우선 pool shape")}
            {code("trt-pool-meta", "pool 메타데이터와 blockSize")}
            {code("vllm-kv-shape", "vLLM 층별 cache shape")}
            {code("vllm-uniform-layout", "vLLM cross-layer 배치 조건")}
            {code("vllm-block-size", "vLLM 기본 block 크기")}
          </div>
        </section>

        <section id="reuse" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 32칸 중 20칸만 같아도 복사해서 이어 씁니다</h2>
          <div className={prose}>
            <p>
              끝난 요청의 KV를 다음 요청이 다시 쓰는 일은 두 엔진 모두 합니다. TensorRT-LLM은 다 찬 block을 radix tree에 등록하고,
              새 요청이 오면 tree를 따라 같은 앞부분을 찾습니다. vLLM은 block마다 앞 block의 hash와 현재 token을 묶은 hash를
              만들어 표에서 찾습니다. 같은 앞부분을 찾는다는 목적은 같고 색인 구조가 다릅니다. 두 구조의 기본 비교는{" "}
              <a href="/cs/ai/prefix-caching-radix-attention#block-hash">프리픽스 캐시의 block hash 절</a>에 있습니다.
            </p>
            <p>
              차이가 큰 곳은 block 안의 일부만 같을 때입니다. 새 요청의 앞 52 token이 이전 요청과 같다고 해 봅시다. 32 token block으로 보면 첫 block
              32 token은 그대로 같고 둘째 block은 32칸 중 앞 20칸만 같습니다. (가정)
            </p>
            <p>
              TensorRT-LLM의 findMatchingBlock은 정확히 같은 block을 먼저 찾고 없으면 앞부분만 같은 block을 긴 순서로 찾습니다. 둘째 block이 부분
              일치하면 그 block을 다른 요청이 쓰는 중이어도 20칸을 새 block에 복사해 이어 씁니다. 이 동작은 enable_partial_reuse와
              copy_on_partial_reuse로 정하며 고정 원문의 기본값은 둘 다 켜짐입니다. 결과적으로 52 token을 모두 재사용합니다.
            </p>
            <p>
              vLLM 기본 경로는 다 찬 16 token block만 hash로 찾습니다. 52 token이 같으면 16·32·48까지 세 block, 48 token을 재사용하고
              나머지 4 token은 다시 계산합니다. 차이는 4 token이지만 이 차이는 block이 클수록 커집니다. block이 32라면 부분 재사용이 없을 때 32까지만
              재사용했을 것입니다.
            </p>
          </div>
          <PartialReuseCopyViz />
          <div className="flex flex-wrap gap-2">
            {code("trt-partial-match", "정확·부분 일치 block 찾기")}
            {code("trt-partial-defaults", "부분 재사용 기본값")}
          </div>
        </section>

        <section id="retention" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 오래된 system prompt도 우선순위가 높으면 남습니다</h2>
          <div className={prose}>
            <p>
              재사용할 block을 남겨 두다 보면 결국 빈칸이 필요해져 무언가를 지워야 합니다. vLLM은 free queue 한 줄에서 가장 오래전에 쓴 block부터 꺼냅니다.
              TensorRT-LLM은 block마다 0부터 100까지의 우선순위를 붙이고 가장 낮은 우선순위의 block을 모두 지운 뒤에야 다음 우선순위로 넘어갑니다. 같은 우선순위
              안에서는 오래된 순서입니다.
            </p>
            <p>
              기본 우선순위는 35이고 요청은 retention 설정으로 token 구간마다 다른 값을 줄 수 있습니다. system prompt 구간에 90을, 생성 구간에 10을
              주었다고 해 봅시다. (가정) 그림에서 system prompt A는 가장 오래됐지만 마지막까지 남습니다. vLLM의 한 줄 LRU였다면 같은 두 칸 요청에서 A가 가장
              먼저 지워집니다.
            </p>
            <p>
              GPU에서 꺼낸 block을 바로 버리지 않고 호스트 메모리로 내리는 단계도 있습니다. host_cache_size를 정하면 꺼낸 block의 KV가 호스트로 복사되고
              tree에 그대로 남아 다음 요청이 찾으면 GPU로 다시 올라옵니다. 9절의 block 우선 배치 덕분에 이 복사는 block마다 한 번입니다. 호스트 쪽 자리가 차면 같은
              우선순위 규칙으로 호스트에서도 지웁니다.
            </p>
            <p>
              모든 block을 내리면 GPU와 호스트 사이 대역폭을 낭비하므로 우선순위 하한이 있습니다. 하한보다 낮은 block은 내리지 않고 바로 지웁니다. 그림의 생성 구간
              D·E가 그렇게 지워집니다. 또 tree에서 자식이 없는 leaf block만 지울 수 있다는 제약이 있어 공통 앞부분은 그 뒤의 가지가 먼저 지워져야 지울 수 있습니다.
            </p>
          </div>
          <RetentionTierViz />
          <div className={prose}>
            <p>
              하한의 기본값에는 문서와 코드의 차이가 있습니다. 공식 문서는 기본값이 35이고 35보다 낮으면 내리지 않는다고 적습니다. 고정 원문의 evictionPolicy.cpp
              34행은 C++ 기본값을 30으로 두고 155–156행은 우선순위가 하한 이상이면 내릴 수 있다고 판정합니다. Python 설정 설명은 하한보다 커야 한다고 적습니다.
            </p>
            <p>
              기본 우선순위 35인 block은 세 표현 어디에서나 내려가므로
              기본 설정에서는 차이가 드러나지 않습니다. 우선순위를 30~34로 직접 준 block만 버전에 따라 결과가 달라질 수 있습니다.
            </p>
          </div>
          <div id="paper-trtllm-kvcache" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="TensorRT-LLM · KV Cache System (2026-10-14 확인)" citeKey={2} href="https://nvidia.github.io/TensorRT-LLM/features/kvcache.html">
              문서는 block을 다 채우는 즉시 radix search tree에 넣고, 우선순위 0~100의 prioritized LRU로 지우며, 기본 우선순위는 35라고
              설명합니다. 호스트 offload는 host_cache_size(기본 0)로 켜고, secondary_offload_min_priority의 기본값을 35로 적습니다.
              현재 코드는 leaf block만 지울 수 있다는 제약도 같은 문서에 있습니다.
            </CitationBlock>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("trt-priority-evict", "우선순위 queue에서 꺼내기")}
            {code("trt-offload-default", "C++ offload 하한 30")}
          </div>
        </section>

        <section id="attention-op" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. RoPE와 KV 쓰기를 attention 앞의 한 kernel에 합칩니다</h2>
          <div className={prose}>
            <p>
              이제 attention 계산으로 넘어갑니다. 층 하나의 attention은 Q·K·V를 받아 위치 정보를 넣는 RoPE를 적용하고, 새 K·V를
              cache에 쓰고, cache 전체와 attention을 계산합니다. FP8 KV를 쓰면 쓰기 전에 양자화도 합니다. 문제는 이 일을 몇 번의
              kernel 호출로 나누느냐입니다.
            </p>
            <p>
              TensorRT-LLM의 attention op는 이 일을 하나의 custom op 안에 둡니다. context 단계에서는 attentionOp.cpp 1832–1898행이
              bias, RoPE 계수, KV cache 버퍼, 양자화 출력 버퍼를 한 parameter 묶음에 담아 invokeQKVPreprocessing 한 번으로 넘깁니다.
              그 뒤 fused multi-head attention kernel이 attention을 계산합니다.
            </p>
            <p>
              vLLM에서는 RoPE를 모델 층이 먼저 적용하고 FlashAttention backend의 do_kv_cache_update가 reshape_and_cache_flash로
              K·V를 slot 위치에 따로 씁니다. attention은 외부 FlashAttention의 flash_attn_varlen_func에 block_table을 넘겨
              계산합니다.
            </p>
            <p>
              backend를 바꿔 FlashInfer나 Triton을 쓸 수도 있습니다. backend 선택 방식은{" "}
              <a href="/cs/ai/attention-kernel-anatomy-and-backends#backend-source">attention kernel의 backend 선택</a>에서 봅니다.
            </p>
            <p>
              합치면 Q·K·V를 GPU 메모리에서 읽고 쓰는 왕복이 줄어듭니다. 대신 kernel 하나가 맡는 조합이 많아져, 모델 구조나 dtype이
              바뀔 때마다 그 kernel 쪽에 지원을 넣어야 합니다. FP8·INT8 KV는 TensorRT-LLM 문서 기준으로 tensor 하나에 scale 하나를
              쓰고, 쓸 때 값에 1/scale을 곱하고 읽을 때 scale을 곱합니다. 양자화 방식 자체의 선택과 오차는{" "}
              <a href="/cs/ai/kv-cache-quantization">KV cache 양자화</a> 글이 다룹니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("trt-fused-preprocess", "context 전처리 한 번에 묶기")}
            {code("vllm-kv-write", "vLLM의 별도 KV 쓰기")}
            {code("vllm-fa-call", "vLLM의 FlashAttention 호출")}
          </div>
        </section>

        <section id="xqa" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 생성 단계는 KV head 하나를 query 8개가 함께 읽습니다</h2>
          <div className={prose}>
            <p>
              생성 단계에서는 요청마다 새 query가 token 하나뿐입니다. 계산은 적고 cache를 읽는 양이 큽니다. 설명용 모델이 query head
              64개와 KV head 8개를 쓰면 KV head 하나를 query head 8개가 공유합니다. 이 공유 구조는{" "}
              <a href="/cs/ai/kv-cache-fundamentals#kv-shape-sharing">GQA의 KV head 공유</a>에서 설명했습니다.
            </p>
            <p>
              TensorRT-LLM은 생성 단계에서 먼저 XQA kernel을 시도합니다. attentionOp.cpp 2607–2611행에서 shouldUse가 이 모델의
              head 묶음·dtype·page 크기를 지원한다고 판정하면 XQA를 실행하고, 아니면 2642–2646행을 지나 masked MHA kernel로
              내려갑니다.</p>
            <p>
              masked MHA는 batch와 head 수가 작아 GPU가 놀 때 sequence를 여러 CTA에 나누는 multi-block 모드를 씁니다.
            </p>
            <p>
              XQA의 핵심은 KV head 하나를 맡은 CTA가 그 head를 공유하는 query 8개를 한 tile의 행으로 모으는 데 있습니다. mha.cu 74행의 유효 행 수는
              묶음 크기 × beam 폭이라 8×1=8이고 76행의 warpTile.y는 이를 16의 배수로 올려 16입니다. KV 조각을 shared memory로 한 번 가져와 8행에
              함께 곱하므로 같은 KV를 query마다 다시 요청하지 않습니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="decode step 하나에서 층 하나의 KV 요청량"
            question="문맥 500 token인 요청 하나가 층 하나에서 KV를 몇 KiB 요청하나요?"
            scope="KV 본체 요청만 셉니다. Q 읽기, 출력 쓰기, L2 cache가 흡수하는 재요청은 넣지 않았습니다."
            steps={[
              { label: "KV head 하나", expression: "500 × 128 × 2(K·V) × 2 B", result: "256,000 B = 250 KiB", reason: "token 500개, head 차원 128, K와 V, FP16입니다." },
              { label: "묶음 크기", expression: "64 ÷ 8", result: "query head 8개", reason: "query head 64개가 KV head 8개를 나눠 씁니다." },
              { label: "head마다 따로 요청", expression: "64 × 250 KiB", result: "16,000 KiB", reason: "query head 하나가 자기 KV head 전체를 따로 요청한다고 셉니다." },
              { label: "묶음으로 한 번 요청", expression: "8 × 250 KiB", result: "2,000 KiB", reason: "KV head 하나당 한 번만 가져와 8행에 곱합니다." },
              { label: "tile 행 활용", expression: "8 ÷ roundUp(8, 16)", result: "8/16 = 50%", reason: "tensor core 행 단위가 16이라 나머지 8행은 빈 계산입니다." },
            ]}
            conclusion="같은 층에서 KV 요청이 16,000 KiB에서 2,000 KiB로 줄고, 대가로 곱셈 행의 절반을 비웁니다."
            caveats={["따로 요청한 16,000 KiB가 모두 DRAM까지 가는 것은 아닙니다. L2가 일부를 받아 줄 수 있어 이 수는 요청량입니다.", "실제 kernel은 KV를 여러 tile로 나눠 반복해 읽습니다."]}
          />
          <XqaGroupViz />
          <div className={prose}>
            <p>
              이 발상은 TensorRT-LLM만의 것은 아닙니다. FlashAttention 3 인터페이스에도 GQA query를 묶는 pack_gqa 인자가 있고 FlashInfer도
              GQA decode를 지원합니다. TensorRT-LLM의 특징은 XQA가 head 묶음 크기와 page 크기를 compile time 상수로 고정한 kernel이라는
              점입니다.
            </p>
            <p>
              defines.h는 HEAD_GRP_SIZE 기본 8, TOKENS_PER_PAGE 기본 32를 두고 조합마다 미리 만든 kernel을 고릅니다. 지원 조합 밖의 모델은
              masked MHA로 내려가므로 같은 엔진이라도 모델마다 생성 단계 kernel이 다를 수 있습니다.
            </p>
          </div>
          <div id="paper-trtllm-attention" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="TensorRT-LLM · Multi-Head, Multi-Query, and Group-Query Attention (2026-10-14 확인)" citeKey={3} href="https://nvidia.github.io/TensorRT-LLM/features/attention.html">
              문서는 기본 TrtllmAttention backend가 context 단계에서 짧은 sequence는 기본 구현을, 긴 sequence는 FlashAttention 계열
              알고리즘을 쓰는 단일 kernel을 실행한다고 설명합니다. 생성 단계는 masked MHA kernel과 XQA로 처리하며, XQA는 FP16·BF16
              계산, FP16·BF16·FP8·INT8 KV, page당 8~128 token을 지원하고 heuristic으로 masked MHA와 고른다고 적습니다.
            </CitationBlock>
            <CitationBlock source="TensorRT-LLM blog · XQA kernel (2026-10-14 확인)" citeKey={4} href="https://nvidia.github.io/TensorRT-LLM/blogs/XQA-kernel.html">
              v0.8 당시 Llama-70B H200 1장, 입력 128·출력 2,048에서 XQA 없이 1,227, 있을 때 2,941 tokens/s/GPU라는 NVIDIA 자체 측정을
              실었습니다. 예비 측정이라고 표시돼 있어 현재 버전이나 다른 모델의 차이로 옮기지 않습니다.
            </CitationBlock>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("trt-generation-dispatch", "XQA 먼저, 아니면 masked MHA")}
            {code("trt-xqa-tile", "query 묶음을 tile 행으로")}
            {code("trt-xqa-defines", "compile time head 묶음")}
          </div>
        </section>

        <section id="shared-kernels" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. kernel은 서로 빌려 쓰고 정책은 엔진에 남습니다</h2>
          <div className={prose}>
            <p>
              kernel의 경계는 생각보다 열려 있습니다. XQA defines.h 105–110행은 PAGED_KV_CACHE_LAYOUT=1이면 vLLM·SGLang 식의
              분리된 K·V pool 배치를 읽는다고 적습니다.</p>
            <p>
              SGLang은 attention backend 목록에 trtllm_mha를 두고 TensorRT-LLM의 PyTorch backend는 attn_backend로
              FlashInfer를 고를 수 있습니다. 같은 GPU kernel이 여러 엔진에서 돌 수 있다는 뜻입니다.
            </p>
            <p>
              그래서 오래 남는 차이는 kernel보다 그 앞의 정책입니다. 출력 한도까지 예약할지, block에 층을 묶을지, 재사용 block을
              어떤 순서로 지우고 어디로 내릴지, attention 앞의 일을 몇 번의 호출로 나눌지는 엔진의 메모리 관리자와 scheduler가
              정합니다. 같은 kernel을 써도 3절의 요청 수 4와 10은 이 정책에서 나옵니다.
            </p>
            <p>
              선택 규칙을 정리하면 이렇습니다. 출력 길이가 한도에 가깝고 지연 변동을 줄여야 하면 GUARANTEED_NO_EVICT가 맞습니다.
              한도가 실제보다 훨씬 크면 MAX_UTILIZATION이나 vLLM처럼 그때그때 받는 쪽이 동시 요청을 늘리지만 재계산 비용을 감수해야
              합니다. block을 GPU 밖으로 자주 옮기는 offload·분리 서빙에서는 block 우선 배치의 복사 횟수가 의미가 있습니다.
            </p>
            <p>
              이 글은 성능을 측정하지 않았습니다. 고정한 두 commit의 원문과 공식 문서만 근거로 삼았고 처리량 비교 수치는 XQA 블로그의
              자체 측정 하나만 인용했습니다. 두 엔진 모두 빠르게 바뀌므로 버전을 올리면 기본값과 지원 조건을 다시 확인해야 합니다.
              sliding window 층의 KV 회수는{" "}
              <a href="/cs/ai/sliding-window-kv-and-attention-sinks">sliding window KV와 attention sink</a> 글이 다룹니다.
            </p>
          </div>
          <div id="paper-sglang-backends" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="SGLang · Server Arguments · --attention-backend (2026-10-14 확인)" citeKey={5} href="https://docs.sglang.io/docs/advanced_features/server_arguments">
              attention backend 선택지에 triton, fa3, fa4, flashinfer, flashmla와 함께 trtllm_mha, trtllm_mla를 둡니다. 같은 문서에서
              --page-size 기본값은 1입니다.
            </CitationBlock>
            <CitationBlock source="Kwon 외 · Efficient Memory Management for LLM Serving with PagedAttention (SOSP 2023)" citeKey={6} href="https://arxiv.org/abs/2309.06180">
              KV를 고정 크기 block으로 나누고 요청마다 block table로 연결하는 vLLM의 원래 설계입니다. 논문의 처리량 수치는 당시
              구현과 workload 기준이며 현재 V1 scheduler의 재계산 전용 선점과는 범위가 다릅니다.
            </CitationBlock>
          </div>
          <ContentBoundary article="tensorrt-llm-kv-cache-and-kernels" />
        </section>

        <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">15. 같은 요청에서 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>출력 한도를 1,000에서 400으로 줄이면 GUARANTEED_NO_EVICT는 160 block pool에 요청을 몇 개 받을까요? (답: 3절, 7절)</p>
            <p>150 token을 만든 뒤 pause된 요청이 다시 들어오면 몇 token의 KV를 다시 만들어야 하나요? 앞부분이 재사용 tree에 남아 있다면 어떻게 달라질까요? (답: 5절, 8절)</p>
            <p>query head 32개, KV head 8개인 모델에서 XQA tile의 유효 행 비율은 얼마일까요? (답: 13절)</p>
          </div>
        </section>
      </div>
      <ExecutionKernelMapReturn current="trtllm" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={engineTrees}
        projectMetas={{
          trtllm: { id: "trtllm", label: "TensorRT-LLM 고정 원문", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
          vllm: { id: "vllm", label: "vLLM v0.27.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
