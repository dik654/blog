import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InferenceRuntimeAnatomyViz from "./inference-runtime-anatomy/viz/InferenceRuntimeAnatomyViz";

/**
 * Inference runtime 은 첫 요청 전에 process 를 나누고 GPU memory 지도를 확정합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "요청이 들어오기 전에 runtime 이 무엇을 준비해 두고 process 가 어떻게 나뉘는가"만 소유한다.
 * scheduler 의 step 로직은 vllm-scheduler, KV block allocator 는 vllm-paged-attention 이 소유한다.
 */
export default function InferenceRuntimeAnatomyArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="process-anatomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Runtime 은 요청을 받는 process 와 GPU 를 쥔 process 로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Inference runtime 은 model 을 GPU 에 올리고 들어온 요청을 실행 가능한 batch 로 바꿔
            돌리는 프로그램 전체를 가리키며, vLLM 과 SGLang 같은 model serving engine 이 그
            구현입니다. 첫 요청이 오기 전에 runtime 은 process 를 나누고, weight 를 나눠 싣고,
            GPU memory 지도를 확정하고, kernel 을 한 번 미리 돌려 둡니다. 이 글은 그 준비
            단계만 다룹니다.
          </p>
          <p>
            가장 바깥에는 HTTP 요청을 받아 tokenize 하는 frontend process 가 있고, 그 안쪽에
            scheduler 와 KV state 를 쥔 driver process 가 있습니다. vLLM V1 에서는 이 driver 가
            <code>EngineCore</code> 라는 별도 process 로 돌고, frontend 와는 ZMQ socket 으로
            token id 만 주고받습니다.
          </p>
          <p>
            GPU 하나마다 worker process 가 하나 붙습니다. worker 안에는 model runner 객체가
            있어 weight 적재와 forward 실행을 맡고, driver 쪽의 model executor 는 여러 worker 에
            같은 명령을 보내고 결과를 모읍니다. vLLM 문서는 이 원칙을 process 하나가 accelerator
            하나를 제어한다고 적습니다.
          </p>
          <p>
            이렇게 나누는 이유는 Python 의 GIL 과 CUDA context 때문입니다. tokenize 와
            detokenize 는 CPU 를 오래 잡는데, 같은 process 에서 돌면 GPU 에 다음 batch 를 보내는
            loop 가 그만큼 멈춥니다. process 를 나누면 frontend 가 바쁜 동안에도 driver 의 busy
            loop 는 GPU 를 계속 채웁니다.
          </p>
          <p>
            SGLang 도 같은 해부 구조를 씁니다. <code>TokenizerManager</code> 가 frontend,
            <code>Scheduler</code> 가 driver, TpModelWorker 안의 ModelRunner 가 worker 역할이고
            이들 역시 ZMQ 로 연결됩니다. 이름은 다르지만 요청을 받는 쪽과 GPU 를 쥔 쪽을
            분리한다는 원칙은 같습니다.
          </p>
          <p>
            scheduler 가 한 step 에서 무엇을 고르는지는{" "}
            <Link to="/ai/vllm-scheduler">vLLM Scheduler</Link> 글이, 요청 lifecycle 과 latency
            분해는 <Link to="/ai/vllm-serving#serving-architecture">vLLM 입문</Link> 글이
            다룹니다. 여기서는 그 scheduler 가 돌기 전에 무엇이 준비돼야 하는지만 봅니다.
          </p>
        </div>
        <InferenceRuntimeAnatomyViz />
        <ContentBoundary article="inference-runtime-anatomy" />
        <div id="paper-vllm-arch" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM project · Architecture Overview (design docs)"
            citeKey={1}
            href="https://docs.vllm.ai/en/latest/design/arch_overview.html"
            type="code"
          >
            vLLM 공식 설계 문서는 API server, engine core, GPU worker, DP coordinator 의 process
            종류와 ZMQ 연결, worker 하나가 accelerator 하나를 맡고 그 안에 model runner 가 하나
            있다는 구조를 적습니다. 이 글의 driver·worker·executor·model runner 명칭은 그 문서와
            <code>vllm/v1</code> 코드의 class 이름을 따랐으며, 다른 engine 의 내부 이름까지
            같다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="loading" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Weight loading 시간은 shard byte 를 가장 느린 대역폭으로 나눈 값이 하한입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Model loading 은 checkpoint file 을 열어 각 tensor 를 GPU 로 옮기고 module 의
            parameter 자리에 끼우는 절차입니다. 그중 byte 를 실제로 옮기는 weight loading 이
            시간의 대부분을 차지하고, 어느 GPU 가 어느 조각을 받을지 정하는 것이 weight
            sharding 입니다.
          </p>
          <p>
            70B parameter model 을 FP16 으로 저장하면 parameter 하나가 2 byte 이므로 140 GB
            입니다. 80 GB GPU 한 장에는 들어가지 않으니 tensor parallel 8 로 나누면 GPU 당 17.5 GB
            가 됩니다. 각 worker 는 자기 rank 에 해당하는 행 또는 열 조각만 읽고, 나머지 byte 는
            disk 에서 아예 읽지 않습니다.
          </p>
          <p>
            시간은 대역폭이 정합니다. 140 GB 를 2 GB/s 로 읽으면 70 초이고, worker 8 개가 각자
            local NVMe 에서 17.5 GB 씩 병렬로 읽으면 9 초 남짓입니다. 반대로 8 개가 1 GB/s 짜리
            network file system 하나를 나눠 쓰면 140 초로 늘어납니다. 어느 link 가 공유되는지가
            hardware 사양표보다 중요합니다.
          </p>
          <p>
            safetensors 형식은 header 에 tensor 별 offset 이 있어 mmap 으로 필요한 조각만 읽을 수
            있고, vLLM 과 SGLang 의 <code>load-format</code> 기본값 auto 는 이 형식을 먼저
            찾습니다. pickle 기반 .pt 는 전체를 CPU 에 풀어야 해서 sharded load 에 불리합니다.
          </p>
          <p>
            Sharding 축은 layer 종류마다 다릅니다. attention 의 Q·K·V projection 은 head 단위로
            열을 나누고, 그 뒤의 output projection 은 행을 나눠 all-reduce 한 번으로 합칩니다.
            어느 축으로 나누는지는 <Link to="/ai/vllm-serving#parallel-layout">DP·TP·PP layout</Link>{" "}
            규칙을 따르며, loader 는 그 규칙대로 checkpoint 를 잘라 넣습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Weight loading 은 아무리 빨라도 얼마나 걸리나요?"
          idea="전송은 두 병목 중 느린 쪽에 묶입니다. 모든 worker 가 나눠 쓰는 공유 link 로 전체 byte 를 옮기는 시간과, worker 하나가 자기 조각을 자기 link 로 옮기는 시간 중 큰 값이 하한입니다."
          formula={String.raw`T_{\text{load}} \ge \max\!\left(\frac{B_{\text{total}}}{\beta_{\text{shared}}},\ \frac{B_{\text{shard}}}{\beta_{\text{local}}}\right)`}
          annotatedFormula={String.raw`T_{\text{load}} \ge \max\!\left(\underbrace{\frac{B_{\text{total}}}{\beta_{\text{shared}}}}_{\text{공유 link 가 전체 byte 를 옮기는 시간}},\ \underbrace{\frac{B_{\text{shard}}}{\beta_{\text{local}}}}_{\text{worker 하나가 자기 shard 를 옮기는 시간}}\right)`}
          operations={[
            { expression: String.raw`\frac{B_{\text{total}}}{\beta_{\text{shared}}}`, annotation: ["checkpoint 전체 byte 를 공유 대역폭으로 나눠", "storage 나 network 가 병목일 때의 시간"] },
            { expression: String.raw`\frac{B_{\text{shard}}}{\beta_{\text{local}}}`, annotation: ["GPU 하나의 shard byte 를 그 GPU 의 link 대역폭으로 나눠", "PCIe 나 local disk 가 병목일 때의 시간"] },
            { expression: String.raw`\max(\cdot,\cdot)`, annotation: ["두 시간 중 큰 값을 골라", "실제 loading 의 하한 확정"] },
          ]}
          terms={[
            { symbol: String.raw`B_{\text{total}}`, name: "Checkpoint 전체 byte", description: "parameter 수 × dtype byte 폭입니다. 70B FP16 이면 140 GB 입니다." },
            { symbol: String.raw`B_{\text{shard}}`, name: "GPU 당 shard byte", description: "tensor parallel 로 나눈 뒤 한 worker 가 실제로 읽는 byte 입니다. TP 8 이면 17.5 GB 입니다." },
            { symbol: String.raw`\beta_{\text{shared}}`, name: "공유 대역폭", description: "모든 worker 가 함께 쓰는 storage 나 network 의 초당 byte 입니다." },
            { symbol: String.raw`\beta_{\text{local}}`, name: "Worker 별 대역폭", description: "worker 하나가 독점하는 link 의 초당 byte 입니다." },
          ]}
          assumptions={["file 을 읽으면서 동시에 GPU 로 복사한다고 가정하며, CPU 에 전체를 먼저 풀어야 하는 형식은 추가 시간이 붙습니다.", "dtype 변환·quantization 해제 같은 CPU 계산은 포함하지 않습니다."]}
          interpretation="140 GB 를 2 GB/s 공유 link 로 읽으면 70 초가 하한이고, 8 개 worker 가 각자 2 GB/s local NVMe 를 쓰면 9 초 남짓입니다. 이 값보다 훨씬 오래 걸린다면 병목은 대역폭이 아니라 CPU 쪽 변환입니다."
        />
      </section>

      <section id="memory-plan" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          KV pool 은 utilization 예산에서 weight 와 peak 를 뺀 나머지입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Runtime memory manager 는 GPU memory 를 요청이 올 때마다 새로 빌리지 않고, 기동
            때 큰 덩어리를 미리 잡아 두고 그 안에서 나눠 씁니다. 미리 잡아 둔 덩어리가 memory
            pool 이고, pool 을 하나의 연속 주소 공간으로 두고 앞에서부터 잘라 주는 관리 방식을
            memory arena 라고 부릅니다.
          </p>
          <p>
            이유는 <code>cudaMalloc</code> 과 <code>cudaFree</code> 가 device synchronization 을
            동반해 느리기 때문입니다. PyTorch 의 caching allocator 는 free 된 block 을 driver 에
            돌려주지 않고 보관했다가 다음 요청에 재사용합니다. 그래서 memory_allocated 는 tensor 가
            실제 쓰는 byte, memory_reserved 는 allocator 가 쥐고 있는 byte 로 두 값이 다릅니다.
          </p>
          <p>
            Dynamic memory allocation 만으로 serving 하면 두 가지 문제가 생깁니다. 첫째, 크기가
            제각각인 요청이 오가며 pool 이 조각나 큰 block 을 못 찾는 fragmentation 이 생깁니다.
            둘째, 요청이 몰릴 때 KV cache 가 얼마나 더 들어갈지 미리 알 수 없어 admission 을
            판단할 수 없습니다.
          </p>
          <p>
            그래서 serving runtime 은 static memory planning 을 씁니다. weight 처럼 기동 뒤
            변하지 않는 것, activation 처럼 step 마다 잠깐 커졌다 사라지는 것, KV cache 처럼
            요청 수에 비례해 자라는 것을 구분하고, 마지막 것에 줄 크기를 기동 시점에 한 번
            정합니다. vLLM 의 <code>gpu_memory_utilization</code> 과 SGLang 의 mem-fraction-static
            이 그 예산의 상한입니다.
          </p>
          <p>
            Workspace memory 는 kernel 이 계산 도중 잠깐 쓰는 scratch 영역입니다. attention 의
            partial softmax buffer, GEMM 의 split-K 누적 buffer, sampling 의 logits 정렬 buffer 가
            여기에 들어갑니다. 크기가 batch 와 sequence 길이의 최대값에서 정해지므로, runtime 은
            최대 shape 로 한 번 돌려 본 peak 를 workspace 예약분으로 잡습니다.
          </p>
          <p>
            Memory reuse 는 그 peak 를 작게 유지하는 방법입니다. layer 1 의 activation 은 layer 2
            가 끝나면 필요 없으므로 같은 주소를 layer 3 이 다시 씁니다. caching allocator 가 이를
            자동으로 해 주지만 크기가 조금씩 다르면 block 이 쪼개지므로, vLLM 은 warmup 에서 큰
            shape 를 먼저 돌려 큰 block 이 먼저 잡히게 순서를 정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="KV pool 에 줄 수 있는 byte 는 어떻게 정해지나요?"
          idea="GPU capacity 에 utilization 비율을 곱한 예산에서, 기동 뒤 변하지 않는 weight, profile run 에서 잰 non-KV peak, CUDA graph 가 쥐는 byte 를 빼면 남는 것이 KV pool 입니다. vLLM Worker 의 determine_available_memory 가 이 뺄셈을 그대로 수행합니다."
          formula={String.raw`M_{\text{KV}} = u\,C - \left(W + A_{\text{peak}} + G\right)`}
          annotatedFormula={String.raw`\underbrace{M_{\text{KV}}}_{\text{KV pool byte}} = \underbrace{u\,C}_{\text{utilization 예산}} - \Big(\underbrace{W}_{\text{weight}} + \underbrace{A_{\text{peak}}}_{\text{activation + workspace peak}} + \underbrace{G}_{\text{CUDA graph}}\Big)`}
          operations={[
            { expression: String.raw`u\,C`, annotation: ["capacity 에 utilization 을 곱해", "runtime 이 쓸 수 있는 상한 결정"] },
            { expression: String.raw`W + A_{\text{peak}} + G`, annotation: ["변하지 않는 weight, profile 로 잰 peak, graph byte 를 더해", "KV 가 아닌 곳에 예약할 byte 합산"] },
            { expression: String.raw`u\,C - (\cdots)`, annotation: ["예산에서 예약분을 빼", "KV block 수로 바꿀 나머지 확정"] },
          ]}
          terms={[
            { symbol: "C", name: "GPU capacity", description: "한 GPU 의 전체 memory byte 입니다. H100 80 GB 급이면 80 GB 입니다." },
            { symbol: "u", name: "Utilization 비율", description: "vLLM gpu_memory_utilization, SGLang mem-fraction-static 에 해당하는 0 과 1 사이의 값입니다." },
            { symbol: "W", name: "Weight byte", description: "이 GPU 에 올라간 shard 의 byte 입니다. 70B FP16 을 TP 8 로 나누면 17.5 GB 입니다." },
            { symbol: String.raw`A_{\text{peak}}`, name: "Non-KV peak", description: "최대 shape dummy batch 를 돌릴 때 activation 과 kernel workspace 가 함께 도달한 최고 byte 입니다." },
            { symbol: "G", name: "Graph byte", description: "CUDA graph capture 가 shape 마다 쥐는 static buffer 의 합입니다." },
          ]}
          assumptions={["같은 GPU 를 다른 process 가 쓰지 않는다고 가정합니다. 다른 process 가 있으면 C 가 아니라 free memory 에서 시작해야 합니다.", "NCCL buffer 처럼 torch allocator 밖에서 잡히는 byte 는 vLLM 이 non-torch allocation 으로 따로 셉니다."]}
          interpretation="u=0.9, C=80 GB, W=17.5 GB, A_peak=4.5 GB, G=1 GB 이면 KV pool 은 49 GB 입니다. 70B GQA model 의 token 당 KV 가 GPU 당 40 KB 라면 약 120 만 token 이 들어가며, 이 수가 scheduler 가 받는 하드 예산입니다. u 를 올리면 KV 가 늘지만 A_peak 가 잘못 재였을 때의 여유도 같이 사라집니다."
        />
        <TermBreakdown
          title="GPU memory 지도의 네 구역"
          description="기동이 끝난 뒤 한 GPU 의 memory 는 이렇게 나뉘고, 요청이 오가도 경계는 움직이지 않습니다."
          items={[
            { term: "Weight", description: "checkpoint shard 가 그대로 올라간 구역입니다.", example: "70B FP16, TP 8 이면 17.5 GB", boundary: "weight update 나 model swap 이 없으면 기동 뒤 변하지 않습니다." },
            { term: "Workspace · activation", description: "kernel scratch 와 layer 사이 activation 이 step 마다 쓰고 비우는 구역입니다.", example: "profile run peak 4.5 GB 를 예약", boundary: "max_num_seqs 나 max_model_len 을 키우면 같이 커집니다." },
            { term: "KV pool", description: "static planning 이 확정한 나머지로, KV block allocator 가 요청마다 잘라 줍니다.", example: "49 GB ≈ 120 만 token", boundary: "block 단위 할당·해제 규칙은 PagedAttention 글이 소유합니다." },
            { term: "Headroom", description: "utilization 밖의 미사용 구역으로 driver context 와 잘못 잰 peak 의 완충입니다.", example: "u=0.9 이면 8 GB", boundary: "0 으로 줄이면 첫 긴 요청에서 OOM 이 납니다." },
          ]}
        />
        <div id="paper-pytorch-allocator" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="PyTorch · CUDA semantics: Memory management"
            citeKey={2}
            href="https://docs.pytorch.org/docs/stable/notes/cuda.html#memory-management"
            type="code"
          >
            PyTorch 공식 문서는 caching allocator 가 device synchronization 없이 빠른 해제를
            위해 free block 을 보관한다는 점, memory_allocated 와 memory_reserved 의 차이,
            max_split_size_mb 와 expandable_segments 로 fragmentation 을 다루는 방법을 적습니다.
            이 글의 pool·arena·reuse 설명은 그 문서 범위이며 allocator 내부 알고리즘의 세부까지
            보증하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="startup-procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          기동은 config 에서 ready 까지 한 방향으로만 진행되고 되돌아가지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기동 순서가 고정된 이유는 각 단계가 앞 단계의 측정값을 입력으로 쓰기 때문입니다. KV
            pool 크기는 weight 를 실제로 올리고 profile run 을 돌려 봐야 알 수 있고, CUDA graph
            는 KV pool 주소가 확정된 뒤에야 capture 할 수 있습니다. 순서를 바꾸면 주소가 바뀌어
            graph 가 무효가 됩니다.
          </p>
          <p>
            아래 절차는 vLLM V1 의 <code>EngineCore</code> 와 <code>Worker</code> 가 실제로
            부르는 method 이름을 따랐습니다. SGLang 의 ModelRunner 는 load_model,
            alloc_memory_pool, init_cuda_graphs 순서로 같은 일을 하며 단계 이름만 다릅니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Inference runtime 기동 절차 (vLLM V1 method 이름 기준)"
          input={["model path 와 dtype", "tensor_parallel_size, distributed_executor_backend (mp 또는 ray)", "gpu_memory_utilization u, max_num_seqs, max_model_len", "enforce_eager 와 cudagraph capture sizes"]}
          steps={[
            { code: "driver: executor ← executor_class(config); executor 가 GPU 마다 worker process spawn", note: "CUDA 가 이미 초기화된 process 에서는 fork 가 깨지므로 spawn 을 강제합니다." },
            { code: "worker[i]: init_device()  — device 선택, NCCL group 초기화, model runner 생성", note: "여기서 rank 와 물리 GPU 의 대응이 고정됩니다." },
            { code: "worker[i]: load_model()  — 자기 shard 만 읽어 GPU 에 배치, W 기록", note: "weight 구역이 확정되고 이후 변하지 않습니다." },
            { code: "worker[i]: A_peak ← determine_available_memory()  — profile_run() 뒤 peak 측정", note: "max_num_seqs × max_model_len 의 dummy batch 로 non-KV peak 를 잽니다." },
            { code: "driver: M_KV ← min_i(u·C − W_i − A_peak,i − G_i); kv_cache_config ← block 수", note: "worker 마다 값이 다르면 가장 작은 값을 모두에 적용해 TP rank 간 block 수를 맞춥니다." },
            { code: "worker[i]: initialize_from_config(kv_cache_config)  — KV pool tensor 할당", note: "이 시점부터 KV block 의 주소가 고정되어 graph capture 의 static address 조건을 만족합니다." },
            { code: "worker[i]: compile_or_warm_up_model()  — capture size 마다 _dummy_run, capture_model, sampler warmup", note: "enforce_eager 이면 capture 를 건너뛰고 dummy run 만 합니다." },
            { code: "driver: scheduler ← Scheduler(block 수); ZMQ input socket 열고 busy loop 시작", note: "frontend 는 이때부터 요청을 넘길 수 있습니다." },
          ]}
          output="weight·workspace·KV pool·graph 구역이 확정된 GPU memory 지도와 요청을 받을 준비가 된 driver busy loop"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Profile run 이 재는 것은 이 config 에서 가능한 최대 batch 를 한 번 돌렸을 때의 non-KV
            peak 입니다. max_num_seqs 와 max_model_len 을 키우면 peak 가 커져 KV pool 이
            줄어듭니다. 그 trade-off 를 token 수와 동시 요청 수로 환산하는 일은{" "}
            <Link to="/ai/llm-serving-capacity#capacity">serving capacity</Link> 글이 맡습니다.
          </p>
          <p>
            vLLM 은 이 절차가 끝나면 profile, KV cache 생성, warmup 에 걸린 시간을 한 줄로
            log 에 남깁니다. 기동이 느릴 때 어느 단계가 지배했는지는 그 log 의 항목별 시간에서
            바로 읽을 수 있습니다.
          </p>
        </div>
      </section>

      <section id="warmup" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cold start 는 weight 전송과 graph capture 가 지배합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Cold start 는 process 가 없는 상태에서 첫 응답을 낼 수 있을 때까지의 시간이고, 그
            안에서 runtime 이 자기 준비에 쓰는 부분이 model initialization latency 입니다. 앞
            절의 예시로는 weight 전송 9 초에서 140 초, profile run 몇 초, graph capture 수십 초가
            더해집니다. 어느 항이 지배하는지는 hardware 마다 다릅니다.
          </p>
          <p>
            Runtime warmup 은 첫 요청에서 처음 마주칠 일을 미리 겪게 하는 단계입니다. CUDA kernel
            은 첫 호출에서 module 을 load 하고, Triton kernel 은 shape 마다 JIT compile 을 하며,
            torch.compile 은 graph 를 trace 합니다. 이 비용이 사용자 요청 latency 에 섞이지 않도록
            dummy batch 로 먼저 밟아 둡니다.
          </p>
          <p>
            vLLM 의 <code>compile_or_warm_up_model</code> 은 capture size 목록을 큰 것부터 돌며
            dummy run 을 하고, enforce_eager 가 아니면 capture_model 로 graph 를 기록합니다.
            capture 는 batch shape 하나마다 forward 한 번이므로 size 목록의 길이가 곧 warmup
            시간입니다. graph 의 동작 원리는{" "}
            <Link to="/ai/cuda-graph-capture#mechanics">CUDA graph</Link> 글이 소유합니다.
          </p>
          <p>
            Eager initialization 은 이 모든 준비를 ready 신호 전에 끝내는 방식이고, lazy
            initialization 은 실제로 그 shape 나 kernel 이 필요해질 때 준비하는 방식입니다. eager
            는 cold start 가 길지만 첫 요청부터 latency 가 균일하고, lazy 는 ready 가 빠르지만 초기
            요청 몇 개가 compile 시간을 떠안습니다.
          </p>
          <p>
            선택 기준은 누가 그 비용을 내느냐입니다. 항상 켜 두는 production replica 는 eager 가
            맞습니다. replica 를 자주 띄우는 autoscaling 환경에서는 capture size 를 줄이거나 일부를
            lazy 로 두어 ready 를 앞당기며, SGLang 의 <code>skip-server-warmup</code> 은 그
            극단입니다.
          </p>
          <p>
            Cold start 를 줄이는 방법도 지배 항에 따라 다릅니다. 전송이 지배하면 local NVMe cache
            나 GPU 간 P2P 복사로 대역폭을 늘리고, capture 가 지배하면 size 목록을 실제 batch
            분포에 맞게 줄입니다. 둘 다 아닌데 느리다면 대개 CPU 쪽 checkpoint 변환이나 tokenizer
            초기화가 숨어 있습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="gpu_memory_utilization 을 0.98 로 올렸는데 왜 첫 긴 요청에서 OOM 이 나나요?"
          preview="Profile run 은 torch allocator 안의 peak 만 재고, NCCL buffer 와 graph 의 일부는 그 뒤에 잡히므로 headroom 이 사라지면 실제 peak 가 예산을 넘습니다."
        >
          <p>
            A_peak 는 dummy batch 한 번의 측정값이고, 실제 요청은 prefix 길이·sampling 옵션·
            multimodal 입력에 따라 다른 kernel 경로를 탑니다. 그 경로의 workspace 가 dummy 보다
            크면 headroom 이 그 차이를 흡수해야 합니다.
          </p>
          <p>
            vLLM 은 non-torch allocation 과 graph 추정치를 따로 빼지만 추정은 추정입니다. 같은
            GPU 에 다른 process 가 있으면 C 자체가 줄어듭니다. 0.9 안팎을 기본으로 두고,
            KV 가 부족하면 max_model_len 이나 capture size 를 줄이는 쪽이 u 를 올리는 것보다
            안전합니다.
          </p>
        </ProgressiveDetail>
        <div id="paper-sglang-args" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="SGLang project · Server Arguments (mem-fraction-static, cuda-graph-max-bs, skip-server-warmup)"
            citeKey={3}
            href="https://docs.sglang.io/advanced_features/server_arguments.html"
            type="code"
          >
            SGLang 공식 문서는 mem-fraction-static 을 model weight 와 KV cache memory pool 에
            쓰는 static allocation 비율로 정의하고, cuda-graph-max-bs 와 skip-server-warmup 으로
            capture 범위와 warmup 여부를 조절한다고 적습니다. 이 글은 이를 static planning 과
            eager·lazy 초기화의 구현 예시로만 인용하며 두 engine 의 성능 비교 근거로 쓰지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="backend" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Backend 층은 hardware 와 kernel 차이를 model 코드 밖에 둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Runtime backend 는 같은 model 정의를 특정 hardware 에서 실제로 실행하는 층입니다.
            NVIDIA 의 CUDA, AMD 의 ROCm, Intel XPU, TPU, CPU 는 memory 모델과 kernel library 가
            다르므로 worker 와 model runner 가 backend 마다 따로 있습니다. vLLM 이 platform 별
            Worker class 를 두는 이유입니다.
          </p>
          <p>
            같은 GPU 안에서도 attention kernel 은 여러 개입니다. FlashAttention, FlashInfer, Triton
            구현은 지원 dtype 과 head size, sliding window 가 다르고, 어느 것이 빠른지는 GPU 세대와
            shape 에 따라 갈립니다. runtime compatibility layer 는 model 코드가 이 차이를 모르도록
            하나의 attention 호출 뒤에서 backend 를 고르는 층입니다.
          </p>
          <p>
            Compatibility layer 가 없으면 model 마다 hardware 조합 수만큼 코드가 늘어납니다.
            있으면 기동 때 한 번 이 GPU 와 dtype, head size 에서 쓸 수 있는 kernel 목록을 만들고
            우선순위대로 고릅니다. 대신 fallback 이 조용히 느린 kernel 로 떨어질 수 있어, 기동
            log 에서 선택된 backend 이름을 확인하는 것이 운영의 첫 점검입니다.
          </p>
          <p>
            Memory planning 도 backend 마다 다릅니다. ROCm 에서는 profile 중 free memory 가
            늘어나는 경우가 있어 vLLM 이 별도 fallback 을 두고, CPU backend 는 KV pool 을 host
            memory 에 잡습니다. 한 backend 에서 잰 KV pool 크기와 warmup 시간을 다른 backend 로
            옮겨 적으면 안 되는 이유입니다.
          </p>
          <p>
            다음 읽기는 확정된 KV pool 이 요청마다 어떻게 잘려 나가는지 다루는{" "}
            <Link to="/ai/vllm-paged-attention">PagedAttention</Link> 글과, 그 pool 이 몇 개의
            동시 요청을 감당하는지 계산하는{" "}
            <Link to="/ai/model-vram-budgeting#known-floor">VRAM budgeting</Link> 글입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
