import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MegakernelDesignTradeoffsViz from "./megakernel-design-tradeoffs/viz/MegakernelDesignTradeoffsViz";

const MPK = "https://arxiv.org/abs/2512.22219";
const HAZY = "https://hazyresearch.stanford.edu/blog/2025-05-27-no-bubbles";
const FA3 = "https://arxiv.org/abs/2407.08608";
const GUIDE = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const VOLTA = "https://arxiv.org/abs/1804.06826";

/**
 * Megakernel 은 launch 와 tail 을 지우는 대신 자원 공유 비용을 냅니다
 *
 * Forward 전체를 kernel 하나에 넣었을 때 scheduling 단위가 어떻게 바뀌고,
 * 지워진 kernel 경계 대신 무엇이 의존을 표현하며, 합쳐진 operator 가 register·
 * shared memory·instruction cache 를 어떻게 나눠 쓰는지의 mechanism 을 소유한다.
 * Persistent kernel 의 queue·종료 계약은 /gpu/cuda-persistent-kernels,
 * fusion 의 ROI 장부는 /gpu/cuda-kernel-fusion, CUDA graph 의 capture·replay 는
 * /ai/cuda-graph-capture 가 소유한다.
 */
export default function MegakernelDesignTradeoffsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Batch-1 decode 에서는 kernel 경계가 시간의 큰 몫을 차지합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Decode 한 step 은 token 하나를 만들려고 layer 마다 kernel 을 여러 개 띄웁니다.
            Batch 가 1 이면 kernel 하나가 하는 일은 수 µs 에서 수십 µs 로 작고, kernel
            사이의 launch 와 tail 이 그 일과 같은 크기로 남습니다. Megakernel 은 이 경계를
            없애려고 forward 전체를 kernel 하나에 넣는 설계입니다.
          </p>
          <p>
            숫자로 보면 이렇습니다. Hazy Research 는 Llama-1B 의 forward 가 kernel 약
            100개로 나뉘고, H100 에서 stream launch 비용이 약 2.1 µs, CUDA graph 로 줄여도
            약 1.3 µs 라고 적습니다. Forward 전체가 1 ms 안팎이니 launch 만으로 10~20% 가
            사라집니다.
          </p>
          <p>
            Tail 은 launch 와 다른 비용입니다. Kernel 의 마지막 wave 에서 block 수가 SM 수의
            배수로 떨어지지 않으면 일부 SM 이 놀고, 다음 kernel 의 block 은 앞 kernel 이
            완전히 끝날 때까지 SM 에 올라오지 못합니다. 이 빈 시간은{" "}
            <Link to="/gpu/cutlass-collectives-and-tile-schedulers#tile-scheduler">wave quantization</Link>
            과 같은 식으로 셉니다.
          </p>
          <p>
            Batch 가 크면 같은 kernel 이 수 ms 를 돌아 launch 와 tail 이 비율로 사라집니다.
            Batch 1 은 반대여서, MPK 논문은 Qwen3-8B 가 token 하나에 kernel 293개를
            띄운다고 적고 Hazy Research 는 기존 시스템이 H100 memory bandwidth 의 50%
            이하만 쓴다고 적습니다. 이 설정을 이 글은 batch-1 megakernel optimization
            이라고 부릅니다.
          </p>
          <p>
            이 글의 순서는 이렇습니다. 먼저 kernel 경계를 지우면 무엇이 전역으로 바뀌는지,
            다음으로 지워진 경계 대신 무엇이 의존을 표현하는지, 그리고 합쳐진 operator 가
            register 와 shared memory 와 instruction cache 를 어떻게 나눠 쓰는지 봅니다.
            마지막에 CUDA graph 와 비교합니다.
          </p>
        </div>
        <MegakernelDesignTradeoffsViz />
        <ContentBoundary article="megakernel-design-tradeoffs" />
      </section>

      <section id="global-scheduling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Kernel 경계를 지우면 scheduling 단위가 operator 에서 task 로 바뀝니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Megakernel 의 이득은 launch 를 아끼는 데서 끝나지 않습니다. Kernel 경계가 있을
            때 하드웨어는 operator 하나의 block 만 볼 수 있어 그 operator 안에서만 배치를
            정하고, 경계를 지우면 device 쪽 scheduler 가 forward 전체의 task 를 보고 어느
            SM 에 무엇을 놓을지 정합니다. 이것이 global scheduling 입니다.
          </p>
          <p>
            Operator 하나만 보고 고른 최적이 local optimum 입니다. GEMM 하나를 SM 132개에
            가장 고르게 나눈 tile 크기가, 그 뒤의 attention 이 같은 SM 에서 이어받기에는
            나쁜 크기일 수 있습니다. Global optimum 은 앞 operator 의 tail 에 뒤 operator
            의 task 를 채우는 것처럼 경계를 넘는 배치까지 후보에 넣습니다.
          </p>
          <p>
            MPK 는 이 배치를 SM 단위 task graph 로 만듭니다. Operator 293개를 task
            13,867개로 쪼개고(operator 당 평균 32~47개), H100 SM 132개 가운데 128개를
            worker 로, 나머지 4개에 scheduler warp 16개를 둡니다. Worker 마다 자기 queue
            가 있어 중앙 lock 없이 task 를 꺼냅니다.
          </p>
          <p>
            이득을 식으로 쓰면 없앤 경계마다 launch 와 tail 을 더하고, 대신 생긴 device
            쪽 동기화 비용과 자원 공유 비용을 뺀 값입니다. MPK 는 Qwen3-8B 의 A100 token
            당 latency 를 14.5 ms 에서 12.5 ms 로 줄였다고 자기보고하며, vLLM·SGLang 대비
            1.0~1.7배로 적습니다. 뺄셈 쪽 항이 얼마나 큰지가 이 글의 나머지입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Megakernel 로 바꾸면 얼마나 빨라지는지 어떤 항으로 셉니까?"
          idea="없앤 kernel 경계마다 launch 와 tail 을 더한 것이 이득이고, 경계 대신 kernel 안에 넣은 동기화 대기와 register·shared memory·code 를 나눠 쓰며 생긴 손실이 비용입니다. 계산 자체는 같다고 두고 두 합의 차만 봅니다."
          formula={String.raw`\Delta T = \sum_{k=1}^{N_K}\left(t_{\mathrm{launch},k} + t_{\mathrm{tail},k}\right) - \sum_{j=1}^{N_S} t_{\mathrm{sync},j} - t_{\mathrm{res}}`}
          annotatedFormula={String.raw`\Delta T = \underbrace{\sum_{k=1}^{N_K}\left(t_{\mathrm{launch},k} + t_{\mathrm{tail},k}\right)}_{\text{없앤 kernel 경계 } N_K \text{ 개의 launch 와 tail}} - \underbrace{\sum_{j=1}^{N_S} t_{\mathrm{sync},j}}_{\text{counter 대기 } N_S \text{ 회}} - \underbrace{t_{\mathrm{res}}}_{\text{occupancy·spill·i-cache 손실}}`}
          operations={[
            { expression: String.raw`\sum_{k=1}^{N_K}\left(t_{\mathrm{launch},k} + t_{\mathrm{tail},k}\right)`, annotation: ["없앤 kernel 경계마다", "launch 비용과 마지막 wave 의 빈 시간을 더해 이득을 구함"] },
            { expression: String.raw`\sum_{j=1}^{N_S} t_{\mathrm{sync},j}`, annotation: ["Kernel 안으로 들어온 의존마다", "counter 가 목표에 닿을 때까지 SM 이 기다린 시간을 더함"] },
            { expression: String.raw`t_{\mathrm{res}}`, annotation: ["Register 상한·shared memory·code 크기를 함께 쓰며", "느려진 task 시간을 하나의 항으로 뺌"] },
          ]}
          terms={[
            { symbol: String.raw`N_K`, name: "없앤 kernel 경계 수", description: "Kernel-per-operator 실행에서 kernel 수 빼기 1 입니다. Llama-1B 는 약 100, Qwen3-8B 는 293 입니다." },
            { symbol: String.raw`t_{\mathrm{launch},k}`, name: "Kernel k 의 launch 비용", description: "CPU 가 launch 를 내고 GPU 가 첫 block 을 올리기까지의 시간으로 H100 stream 약 2.1 µs, CUDA graph 약 1.3 µs 입니다." },
            { symbol: String.raw`t_{\mathrm{tail},k}`, name: "Kernel k 의 tail", description: "마지막 wave 에서 일부 SM 만 일하는 시간과 다음 kernel 이 올라오기까지의 빈 시간입니다." },
            { symbol: String.raw`t_{\mathrm{sync},j}`, name: "의존 j 의 counter 대기", description: "Task 가 필요한 event counter 를 polling 하며 SM 을 붙잡고 있는 시간입니다." },
            { symbol: String.raw`t_{\mathrm{res}}`, name: "자원 공유 손실", description: "가장 무거운 task 의 register 로 occupancy 가 줄고, spill 과 instruction cache miss 가 늘어 각 task 가 느려진 합입니다." },
          ]}
          assumptions={[
            "Task 안의 계산 시간은 두 실행에서 같다고 둔 근사입니다. Cross-operator pipelining 으로 계산이 겹치면 이득이 더 커집니다.",
            "t_res 는 측정으로만 얻습니다. Occupancy 손실은 latency hiding 이 부족한 task 에서만 시간으로 나타납니다.",
            "CPU 가 launch 를 GPU 보다 늦게 내는 구간에서는 t_launch 에 CPU 대기가 포함되어 이득이 커집니다.",
          ]}
          interpretation="Llama-1B 에서 N_K≈100, t_launch≈2.1 µs 면 launch 항만 약 210 µs 로 1 ms 안팎의 forward 에서 20% 안팎입니다. 여기에 tail 을 더한 값보다 sync 대기와 자원 손실의 합이 작을 때만 ΔT 가 양수이며, kernel 하나가 수백 µs 씩 도는 큰 batch 에서는 이득 항이 비율로 작아져 부호가 뒤집힐 수 있습니다."
        />
      </section>

      <section id="task-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Kernel 경계 대신 counter 와 barrier 가 의존을 표현합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Kernel 경계는 공짜 동기화였습니다. 같은 stream 의 다음 kernel 은 앞 kernel 의
            모든 block 이 끝나고 그 쓰기가 보일 때 시작하므로, 프로그래머는 아무것도 쓰지
            않아도 operator 사이의 의존이 지켜졌습니다. 이것이 inter-kernel synchronization
            이고 그 범위는 <Link to="/gpu/cuda-sync-streams#streams">stream ordering</Link> 이 정합니다.
          </p>
          <p>
            경계를 지우면 그 의존을 kernel 안에서 직접 표현해야 합니다. Hazy Research 는
            global memory 에 counter 배열을 두고 instruction 이 끝나면 counter 를 올리며,
            다음 instruction 은 시작 전에 필요한 counter 를 확인합니다. MPK 는 같은 것을
            event 라고 부르고 task 마다 기다리는 event 하나와 올리는 event 하나로 정규화합니다.
          </p>
          <p>
            이 counter 대기가 intra-kernel synchronization 이고 비용은 세 가지입니다.
            Counter 를 올리는 atomic 과 그 memory ordering, 기다리는 SM 이 polling 으로
            쓰는 issue slot, 그리고 의존이 통째로 풀릴 때까지 기다리는 대신 chunk 단위로
            풀리도록 task 를 잘게 나누는 설계 비용입니다.
          </p>
          <p>
            잘게 나누면 kernel 경계보다 일찍 시작할 수 있습니다. Hazy Research 의 예에서
            down-projection 은 hidden state 전체가 아니라 자기 input chunk 만 끝나면
            시작합니다. Kernel 경계였다면 앞 operator 의 마지막 block 까지 기다렸을 시간이
            겹치고, 이것이 cross-operator pipelining 입니다.
          </p>
          <p>
            Block 안의 동기화는 다른 층입니다. FlashAttention-3 는 한 block 안에서
            producer warpgroup 이 TMA 로 data 를 나르고 consumer warpgroup 둘이 GEMM 과
            softmax 를 번갈아 하도록 named barrier 로 순서를 강제합니다. 이 warp
            specialization 은{" "}
            <Link to="/gpu/gpu-arch-hopper#tma">Hopper 의 producer–consumer pipeline</Link> 을
            재사용합니다.
          </p>
          <p>
            Grid 전체를 한 지점에 세우는 grid.sync() 도 있습니다. Cooperative launch 로
            모든 block 이 동시에 resident 여야 하고, 이 조건이{" "}
            <Link to="/gpu/cuda-persistent-kernels#worker-residency">persistent kernel 이 grid 를 SM 수에 맞추는 이유</Link>
            입니다. 다만 operator 경계마다 grid.sync() 를 부르면 지운 kernel 경계를 다시
            만든 셈이라, megakernel 은 task 단위 counter 를 씁니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Worker SM 의 device-side task loop"
          input={[
            "queue[w]: worker w 의 task queue (scheduler 가 후속 task 를 채움)",
            "task: {op, tile, wait_event, trigger_event, smem_pages}",
            "counter[e]: event e 의 완료 수, target[e]: 그 event 가 풀리는 목표값",
          ]}
          steps={[
            { code: "task = dequeue(queue[w])  // 비어 있으면 종료 flag 를 확인하며 polling", note: "Queue 는 worker 마다 하나라 dequeue 에 SM 사이 lock 이 없습니다." },
            { code: "while load_acquire(counter[task.wait_event]) < target[task.wait_event]: spin", note: "Intra-kernel synchronization. 이 spin 이 식의 t_sync 이며 SM 의 issue slot 을 씁니다." },
            { code: "pages = acquire_smem(task.smem_pages)  // 공용 shared memory page 를 빌림", note: "Shared memory 는 kernel 수명 동안 page 로 나눠 task 사이에서 재사용합니다." },
            { code: "switch (task.op): GEMM_tile | ATTN_tile | NORM | ALLREDUCE ...", note: "모든 operator 의 code 가 한 kernel 에 있으므로 이 분기가 instruction cache 의 working set 을 바꿉니다." },
            { code: "__syncthreads(); release_smem(pages)", note: "Block 안의 barrier 로 tile 결과가 global memory 에 다 쓰였음을 보장합니다." },
            { code: "atomic_add_release(counter[task.trigger_event], 1)", note: "완료 신호. Scheduler 가 이 counter 를 보고 풀린 후속 task 를 어느 worker 의 queue 에 넣을지 정합니다." },
          ]}
          repeatUntil="종료 flag 가 세워지고 queue[w] 가 빌 때까지 반복합니다."
          output="각 task 의 결과 tile 이 global memory 에, 완료 수가 counter 에 쌓이고 마지막 task 의 trigger 가 forward 종료를 뜻합니다"
        />
      </section>

      <section id="resource-sharing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          합쳐진 operator 는 register 상한과 shared memory 를 한 예산에서 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Kernel 은 launch 순간에 thread 당 register 수와 block 당 shared memory 를
            정하고, 그 값은 kernel 이 끝날 때까지 바뀌지 않습니다. 이것이 kernel resource
            lifetime 이고, megakernel 에서는 그 lifetime 이 forward 전체라서 가장 무거운
            task 의 요구가 모든 task 의 예산이 됩니다.
          </p>
          <p>
            Register 부터 봅니다. Task 가 switch 로 갈라져 live range 가 서로 겹치지 않으면
            kernel 의 register 수는 task 별 요구의 최대값입니다. MPK 는 per-thread register
            usage 를 task type 전체의 최대값으로 고정한다고 적습니다. GEMM 128, attention
            96, norm 40 이면 kernel 은 128 이고 norm task 도 thread 당 128 을 잡습니다.
          </p>
          <p>
            Occupancy 로 바꾸면 이렇습니다. SM 의 register file 65,536개에서 thread 당 128
            이면 warp 당 4,096 이라 warp 16개, 40 이면 warp 당 1,280 이라 warp 51개까지
            올라갑니다. Norm task 가 도는 동안 latency 를 숨길 warp 가 51개가 아니라 16개인
            것이 cross-operator register pressure 입니다.
          </p>
          <p>
            두 operator 를 task 로 나누지 않고 한 task 안에 이어 붙이면 앞 operator 의
            결과가 뒤 operator 가 도는 동안 register 에 살아 있어 요구가 더해집니다. 96 과
            64 를 붙이면 160 이고, 128 짜리 셋째 stage 를 더 붙이면 288 로 thread 당 상한
            255 를 넘어 spill 이 납니다. 그 경로는{" "}
            <Link to="/gpu/cuda-register-pressure#spill-path">register spill</Link> 글이 다룹니다.
          </p>
          <p>
            Shared memory 는 반대로 시간에 따라 나눠 쓸 수 있습니다. Hazy Research 는 H100
            의 213 kB 를 16 KiB page 13개로, MPK 는 32 KB page 로 나눠(H100 에서 7개) task
            가 필요한 만큼 빌리고 돌려줍니다. 이것이 cross-operator shared-memory reuse
            이고, 앞 task 가 남긴 page 에 다음 task 의 weight 를 미리 올리는 데도 씁니다.
          </p>
          <p>
            Register 는 왜 page 처럼 못 나누는지가 두 자원의 차이입니다. Register 배정은
            컴파일 시점에 code 에 박히고 하드웨어가 warp 를 올릴 때 한 번에 잡지만, shared
            memory 는 주소만 있으면 kernel 안에서 어느 task 가 쓰든 상관없습니다. Hopper 의
            setmaxnreg 가 warpgroup 사이에서 register 를 옮기는 유일한 예외입니다.
          </p>
        </div>
      </section>

      <section id="code-footprint" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Operator 가 모이면 code 크기가 instruction cache 를 넘습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Kernel 하나에 operator 가 모두 들어가면 code 도 모두 들어갑니다. SM 은
            instruction 을 register 처럼 미리 잡지 않고 cache 에서 읽으므로, task 가 GEMM
            에서 attention 으로 바뀔 때마다 다른 code 영역을 읽어야 하고 그 영역이 cache
            보다 크면 miss 가 납니다. 이것이 instruction cache pressure 입니다.
          </p>
          <p>
            크기를 보면 이렇습니다. Volta V100 microbenchmark 는 scheduler 마다 L0
            instruction cache 약 12 KiB, SM 당 L1 instruction cache 128 KiB 를 측정했습니다.
            SASS instruction 하나가 16 byte 이니 L0 는 instruction 약 768개, L1 은 약
            8,192개입니다. Hopper 의 값은 NVIDIA 가 공개하지 않아 이 글은 Volta 수치로 셉니다.
          </p>
          <p>
            GEMM mainloop 하나가 unroll 뒤 수천 instruction 이면 그 하나로 L0 를 넘고,
            operator 열 개면 L1 도 넘습니다. Task 마다 hot loop 는 L0 에 맞아야 miss 없이
            돌며, task 가 바뀌는 순간의 miss 는 L1 에서 채우면 수십 clock, L2 까지 가면
            수백 clock 입니다. 같은 종류의 task 를 한 SM 에 이어 붙이면 이 miss 가 줄어듭니다.
          </p>
          <p>
            Control-flow complexity 는 같은 원인의 다른 얼굴입니다. Task 종류를 고르는
            switch, page 를 빌리는 분기, counter 를 기다리는 loop 이 모든 task 의 경로에
            붙습니다. 이 분기는 warp 전체가 같은 쪽으로 가므로 divergence 는 아니지만,
            컴파일러가 분기 너머로 instruction 을 옮기지 못해 각 task 의 code 가 독립
            kernel 이었을 때보다 느슨해질 수 있습니다.
          </p>
          <p>
            Megakernel 이 정적 code 를 줄이는 방법이 interpreter 구조입니다. Hazy Research
            는 SM 마다 instruction 열을 주고 공통 CUDA template 이 그것을 해석하게 했습니다.
            Operator 마다 kernel 을 새로 짜는 대신 instruction 종류 수만큼의 code 만 kernel
            에 남고, 배치는 Python 쪽에서 미리 계산해 수백 번의 forward 에 재사용합니다.
          </p>
        </div>
        <TermBreakdown
          title="Megakernel 안에서 operator 가 나눠 쓰는 세 자원"
          description="같은 kernel 에 들어온 순간 세 자원의 예산이 하나로 합쳐집니다. 나누는 방식이 자원마다 달라 비용의 모양도 다릅니다."
          items={[
            { term: "Register", description: "Thread 당 배정이 launch 때 고정되므로 kernel 값은 task 별 요구의 최대값입니다.", example: "GEMM 128·norm 40 이면 kernel 128 로 norm task 의 warp 가 51개에서 16개로 줍니다.", boundary: "한 task 안에 stage 를 이어 붙이면 최대값이 아니라 합이 되어 255 를 넘길 수 있습니다." },
            { term: "Shared memory", description: "주소만 있으면 어느 task 가 써도 되므로 page 로 나눠 시간에 따라 재사용합니다.", example: "H100 213 kB 를 16 KiB page 13개(Hazy) 또는 32 KB page 7개(MPK)로 나눕니다.", boundary: "Page 를 다 쓴 task 는 다른 task 가 돌려줄 때까지 기다리며 이 대기도 t_sync 에 들어갑니다." },
            { term: "Instruction cache", description: "모든 operator 의 code 가 한 kernel 에 있어 task 가 바뀔 때 working set 이 바뀝니다.", example: "L0 약 12 KiB 는 instruction 768개이며 unroll 된 GEMM mainloop 하나로 넘습니다.", boundary: "Miss 비용은 task 전환 빈도에 비례하므로 같은 종류의 task 를 SM 에 이어 붙이면 줄어듭니다." },
            { term: "Issue slot", description: "Counter 를 기다리는 polling 과 task dispatch 의 분기가 계산과 같은 scheduler 를 씁니다.", example: "Worker 가 counter 를 spin 하는 동안 그 SM 의 issue slot 은 계산에 쓰이지 않습니다.", boundary: "Scheduler 를 별도 SM 에 두는 MPK 구조는 이 비용을 worker 에서 떼어 낸 대신 SM 4개를 계산에서 뺍니다." },
          ]}
        />
      </section>

      <section id="graph-vs-megakernel" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CUDA graph 는 launch 비용만 지우고 megakernel 은 경계를 지웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <Link to="/ai/cuda-graph-capture#mechanics">CUDA graph</Link> 는 launch 열을 한 번
            capture 해 재생하므로 CPU 가 kernel 마다 API 를 부르는 비용이 사라집니다. 그러나
            graph 의 node 는 여전히 kernel 이라 kernel 경계, 경계마다의 tail, 경계를 넘는
            overlap 불가는 그대로입니다. Hazy Research 의 수치에서 graph 는 launch 를 2.1 µs
            에서 1.3 µs 로 줄일 뿐 0 으로 만들지 못합니다.
          </p>
          <p>
            Megakernel 은 반대쪽에서 옵니다. Kernel 이 하나라 launch 는 forward 당 한 번이고,
            tail 은 마지막 task 에만 남으며, operator 사이 overlap 은 counter 가 허용하는
            만큼 가능합니다. 대신 device 쪽 scheduler, counter 동기화, 자원 공유와 code
            크기라는 이 글의 비용을 전부 떠안습니다.
          </p>
          <p>
            선택 기준은 kernel 당 일의 크기입니다. Kernel 하나가 수백 µs 이상 돌면 graph 로
            launch 만 지워도 tail 과 sync 는 비율로 사라져 megakernel 의 추가 이득이 작고,
            batch-1 decode 처럼 kernel 하나가 수 µs 면 경계 자체가 시간이라 megakernel 이
            이깁니다. Llama-1B 는 H100 에서 1 ms 안팎, memory bandwidth 78% 로 baseline 의
            50% 이하와 대비됩니다.
          </p>
          <p>
            둘은 배타적이지 않습니다. Megakernel 도 launch 는 하므로 graph 안의 node 하나로
            넣을 수 있고, MPK 는 multi-GPU 의 allreduce 를 task 로 넣어 계산과 통신을 kernel
            안에서 겹칩니다. Graph 가 못 하는 것은 kernel 경계를 넘는 overlap 이고,
            megakernel 이 못 하는 것은 operator 마다 다른 launch configuration 입니다.
          </p>
          <p>
            Fusion 글의{" "}
            <Link to="/gpu/cuda-kernel-fusion#megakernel">megakernel resource trade-off</Link> 는
            이 글의 비용 항을 launch 절감과 같은 장부에 놓고 채택 여부를 정하는 판단이고,
            이 글은 그 비용이 어디서 생기는지의 mechanism 을 소유합니다. Launch overhead 의
            CPU 쪽 증상은 launch overhead 와 CPU–GPU 동기화 글이 다룹니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Persistent kernel 과 megakernel 은 같은 것인가요?"
          preview="아닙니다. Persistent kernel 은 block 이 grid 수명 동안 상주하며 queue 를 소비하는 실행 모델이고, megakernel 은 그 모델 위에 forward 전체의 operator 를 올린 결과물입니다. Megakernel 은 거의 언제나 persistent 하지만 persistent kernel 이 여러 operator 를 담는 것은 아닙니다."
        >
          <p>
            CUTLASS 의 persistent GEMM 은 grid 를 SM 수에 맞추고 각 block 이 tile 을 여러 개
            돌지만 operator 는 GEMM 하나입니다. Register 상한도 shared memory 도 그 GEMM
            에 맞춰져 있어 이 글의 자원 공유 비용이 없습니다. 그 loop 의 queue·종료 계약은{" "}
            <Link to="/gpu/cuda-persistent-kernels#queue-progress">persistent kernel 글</Link> 이 소유합니다.
          </p>
          <p>
            MPK 와 Hazy Research 의 megakernel 은 둘 다 persistent 하게 worker 를 띄우고
            그 위에 GEMM·attention·norm·통신 task 를 섞어 올립니다. 이 글이 다루는 register
            최대값, shared memory page, instruction cache, counter 대기는 모두 서로 다른
            operator 가 한 kernel 의 예산을 나눌 때 생기는 비용이며, 단일 operator 의
            persistent kernel 에는 나타나지 않습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          MPK 논문과 Hazy Research 블로그가 수치의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Kernel 293개, task 13,867개, worker 128개와 scheduler warp 16개, register 를
            task type 최대값으로 고정한다는 서술, 32 KB shared memory page 와 Qwen3-8B 의
            14.5 ms 에서 12.5 ms 로의 latency 는 MPK 논문의 자기보고입니다. 독립 재현은 이
            글이 확인하지 못했습니다.
          </p>
          <p>
            Launch 2.1 µs 와 1.3 µs, Llama-1B kernel 약 100개, 213 kB 를 16 KiB page 13개로
            나눈 구조, counter 배열과 instruction interpreter, memory bandwidth 78% 대 50%
            이하는 Hazy Research 블로그의 자기보고입니다.
          </p>
          <p>
            L0 instruction cache 약 12 KiB 와 L1 128 KiB 는 Volta V100 을 microbenchmark 한
            논문의 측정값이며 Hopper 의 값이 아닙니다. Warp specialization 과 named barrier
            는 FlashAttention-3 논문, grid.sync() 의 co-residency 조건은 CUDA Programming
            Guide 의 서술입니다.
          </p>
          <p>
            이 글의 register 예(128·96·40, 96+64+128) 와 Viz 의 시간 축은 계산을 보여 주기
            위한 가정값입니다. 실제 megakernel 의 register 수와 occupancy 는 ptxas 의 -v
            출력과 Nsight Compute 로 자기 kernel 에서 읽어야 합니다.
          </p>
        </div>
        <div id="paper-mpk-megakernel-compiler" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Cheng, Zhang, Zhou et al. · MPK: A Compiler and Runtime for Mega-Kernelizing Tensor Programs (arXiv 2512.22219, 2025)"
            citeKey={1}
            href={MPK}
            type="paper"
          >
            Tensor program 을 SM 단위 task graph 로 낮추고 persistent megakernel 안의
            in-kernel runtime 이 worker 별 queue 와 event 로 decentralized scheduling 을
            한다는 설계, register 를 task type 최대값으로 고정하고 shared memory 를 page 로
            나눈다는 서술, Qwen3-8B 의 kernel 293개와 latency 수치가 여기 있습니다. 1.0~1.7배
            는 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="paper-hazy-no-bubbles" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Hazy Research · Look Ma, No Bubbles! Designing a Low-Latency Megakernel for Llama-1B (2025)"
            citeKey={2}
            href={HAZY}
          >
            Batch-1 Llama-1B forward 를 kernel 약 100개에서 megakernel 하나로 바꾼 기록으로,
            launch 2.1 µs 와 CUDA graph 1.3 µs, instruction interpreter 와 counter 배열,
            16 KiB page 13개의 shared memory paging, H100 에서 1 ms 미만과 bandwidth 78%
            가 이 글의 근거입니다. 수치는 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="paper-flashattention-3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Shah, Bhattacharya, Dao et al. · FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision (2024)"
            citeKey={3}
            href={FA3}
            type="paper"
          >
            Producer warpgroup 과 consumer warpgroup 의 warp specialization, setmaxnreg 로
            register 를 warpgroup 사이에서 옮기는 방법, named barrier 로 두 consumer 의
            GEMM 과 softmax 를 번갈아 세우는 pingpong scheduling 이 이 글의 block 내부
            동기화 근거입니다. H100 FP16 75% 이용률은 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="paper-cuda-cooperative-groups" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Programming Guide 12.8.1 · Cooperative Groups, Grid Synchronization"
            citeKey={4}
            href={GUIDE}
            type="code"
          >
            grid.sync() 가 모든 block 의 co-residency 를 요구하고 cudaLaunchCooperativeKernel
            과 cudaOccupancyMaxActiveBlocksPerMultiprocessor 로 grid 를 맞춰야 한다는 조건,
            그리고 kernel 경계가 같은 stream 안에서 순서와 가시성을 보장한다는 실행 모델이
            이 글의 inter-kernel synchronization 정의입니다.
          </CitationBlock>
        </div>
        <div id="paper-dissecting-volta" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Jia, Maggioni, Staiger, Scarpazza · Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking (2018)"
            citeKey={5}
            href={VOLTA}
            type="paper"
          >
            Scheduler 당 L0 instruction cache 약 12 KiB, SM 당 L1 instruction cache 128 KiB,
            L2 6,144 KiB 를 FFMA 열의 길이를 늘려 가며 측정한 결과입니다. Volta 의 값이며
            이후 세대의 크기는 이 글이 확인하지 못했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/cuda-persistent-kernels#queue-progress">persistent kernel 의 queue 와 종료</Link>,
          그리고 <Link to="/gpu/cuda-kernel-fusion#release-gate">fusion 의 ROI 장부</Link>.
        </p>
      </section>
    </div>
  );
}
