import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import GpuMemoryHierarchyAndRooflineViz from "./gpu-memory-hierarchy-and-roofline/viz/GpuMemoryHierarchyAndRooflineViz";
import RooflineRidgeChart from "./gpu-memory-hierarchy-and-roofline/viz/RooflineRidgeChart";

const BEST_PRACTICES = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const NSIGHT = "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html";
const ROOFLINE = "https://escholarship.org/uc/item/3qf383m0";
const HOPPER = "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/";

/**
 * GPU memory hierarchy 와 roofline: kernel 은 네 가지 bound 중 하나에 묶입니다
 *
 * L1·L2·local·constant 의 위치와 32-byte sector transaction, latency 와 bandwidth 의
 * 구분, 그리고 compute·memory·latency·launch-bound 네 부류의 판정을 소유한다.
 * Roofline 의 peak/achieved 분리는 /gpu/gpu-architecture, coalescing 설계는
 * /gpu/cuda-shared-memory, ready warp 와 MLP 는 /gpu/sm-warp-scheduling-and-issue 가 소유한다.
 */
export default function GpuMemoryHierarchyAndRooflineArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="hierarchy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Byte 는 register 에서 HBM 까지 다섯 계층을 지나며 비싸집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Kernel 이 읽는 byte 하나는 register, shared memory 와 L1, L2, HBM 가운데 어디서 오느냐에 따라 시간과 대역폭이 열 배 단위로 달라집니다.
            이 글은 그 계층을 숫자로 놓고 warp 의 요청이 transaction 으로 바뀌는 규칙과 latency·bandwidth 의 구분을 거쳐 kernel 이 네 가지 bound
            가운데 어디에 묶였는지 판정하는 데까지 갑니다.
          </p>
          <p>
            H100 SXM5 를 예로 두면 SM 하나에 register file 256 KB, shared memory 와 합쳐 쓰는 L1 data cache 256 KB 가 있고
            chip 전체가 공유하는 L2 는 50 MB, 그 바깥의 HBM3 는 80 GB 를 3.35 TB/s 로 읽습니다. 위로 갈수록 작고 가까우며 아래로 갈수록 크고 멉니다.
          </p>
          <p>
            L1 cache 는 SM 안에 있어 그 SM 의 warp 만 쓰고 global load 가 L1 을 거칠지는 compiler 와 instruction 종류가 정합니다. L2
            cache 는 모든 SM 이 공유하는 마지막 on-chip 계층이라 HBM 에서 온 byte 는 반드시 여기를 지나고 다른 SM 이 방금 읽은 줄을 다시 읽으면 HBM 까지
            가지 않습니다.
          </p>
          <p>
            CUDA local memory 는 이름과 달리 가까운 곳이 아닙니다. Thread 하나만 보는 주소
            공간이지만 실제 저장소는 HBM 이고 L1·L2 에 cache 됩니다. Register 가 모자라
            spill 된 값과 동적 index 로 접근하는 thread 배열이 여기로 가며, 그 경로는{" "}
            <Link to="/gpu/cuda-register-pressure#spill-path">register spill 경로</Link> 에 있습니다.
          </p>
          <p>
            Constant memory 는 64 KB 짜리 읽기 전용 공간으로 SM 마다 constant cache 를 거칩니다. Warp 의 32 lane 이 같은 주소를 읽으면 한 번
            읽어 broadcast 하지만 서로 다른 주소를 읽으면 주소 수만큼 직렬화됩니다. Kernel 인자와 모든 thread 가 같은 값을 보는 계수표에 맞는 자리입니다.
          </p>
          <p>
            이 다섯 계층의 scope 와 traffic 경로는{" "}
            <Link to="/gpu/gpu-architecture#gpu-memory-traffic-hierarchy">GPU memory traffic hierarchy</Link> 가
            먼저 그렸습니다. 이 글은 그 위에 각 계층의 크기와 요청이 옮겨지는 단위를 얹습니다.
          </p>
        </div>
        <GpuMemoryHierarchyAndRooflineViz />
        <ContentBoundary article="gpu-memory-hierarchy-and-roofline" />
      </section>

      <section id="transactions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Warp 의 요청은 32-byte sector 수만큼 transaction 이 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Memory 는 byte 하나씩 오지 않습니다. Warp 의 load instruction 하나가 낸 32개 주소를 하드웨어가 32-byte sector 로 묶고 걸린
            sector 하나가 memory transaction 하나가 됩니다. Best Practices Guide 는 compute capability 6.0 이상에서 warp 의
            접근이 필요한 32-byte transaction 수만큼으로 합쳐진다고 적습니다.
          </p>
          <p>
            Lane 32개가 float 32개를 이어서 읽고 시작 주소가 128 B 에 맞으면 sector 4개,
            transaction 4개이고 옮긴 128 B 가 전부 쓰입니다. 시작이 4 B 어긋나면 sector
            5개가 되어 160 B 를 옮기고 128 B 만 쓰니 효율 80% 입니다.
          </p>
          <p>
            Lane 이 float 하나씩 건너뛰면(stride 2) sector 8개에 256 B, 효율 50% 이고,
            lane 마다 32 B 씩 떨어지면(stride 8) lane 하나가 sector 하나를 통째로 불러
            transaction 32개에 1024 B 를 옮기고 128 B 만 씁니다. 효율 12.5% 인 이 상태가
            uncoalesced access 입니다.
          </p>
          <p>
            Uncoalesced access 의 비용은 두 겹입니다. 같은 useful byte 를 위해 HBM 대역폭을 여덟 배 쓰고 transaction 이 여덟 배 많아 load
            하나의 latency 도 길어집니다. Nsight Compute 는 이 둘을 requested byte 와 실제 옮긴 sector 수의 비율로 보여 줍니다.
          </p>
          <p>
            접근 pattern 을 바꿔 sector 수를 줄이는 설계가{" "}
            <Link to="/gpu/cuda-shared-memory#coalescing">coalescing</Link> 이고, 어쩔 수 없이
            흩어진 접근은 <Link to="/gpu/cuda-shared-memory#overview">shared memory</Link> 에
            한 번 정렬해 올린 뒤 읽습니다. 이 글은 transaction 이 어떻게 세어지는지까지만
            다룹니다.
          </p>
        </div>
      </section>

      <section id="latency-bandwidth" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Latency 는 한 요청의 시간, bandwidth 는 초당 byte 이며 서로 대신하지 못합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Memory latency 는 요청 하나를 내고 첫 byte 가 돌아오기까지의 시간이고, memory bandwidth 는 충분히 많은 요청이 겹칠 때 초당 옮겨지는 byte
            입니다. HBM 의 latency 는 수백 clock, bandwidth 는 3.35 TB/s 처럼 단위부터 다르며 요청이 하나뿐이면 bandwidth 가 아무리 커도
            latency 만큼 기다립니다.
          </p>
          <p>
            둘을 잇는 것이 Little's law 입니다. 대역폭을 다 쓰려면 latency 동안 옮겨질 만큼의
            byte 가 항상 요청 중이어야 합니다. Latency 를 가정값 600 ns 로 두면
            3.35 TB/s × 600 ns ≈ 2 MB 가 늘 비행 중이어야 하고, SM 132개로 나누면 SM 당
            약 15 KB, 즉 128 B 짜리 warp load 약 120개가 동시에 떠 있어야 합니다.
          </p>
          <p>
            SM 에 warp 64개가 있어도 warp 마다 load 두 개 가까이를 결과가 오기 전에 더
            내야 한다는 뜻입니다. 이것이 앞 글의{" "}
            <Link to="/gpu/sm-warp-scheduling-and-issue#latency-hiding">memory-level parallelism</Link> 이
            bandwidth 와 만나는 지점이고, load 뒤에 바로 그 값을 쓰는 코드가 대역폭을
            못 채우는 이유입니다.
          </p>
          <p>
            Effective bandwidth 는 kernel 이 실제로 낸 성적입니다. Best Practices Guide 의 식대로 읽은 byte 와 쓴 byte 를 더해 시간으로
            나눕니다. 1 GB 를 읽고 1 GB 를 쓰는 kernel 이 0.8 ms 걸렸으면 2 GB / 0.8 ms = 2.5 TB/s 이고 3.35 TB/s 의 약 75% 입니다.
          </p>
          <p>
            이 식의 byte 는 kernel 이 필요로 한 useful byte 입니다. Uncoalesced access 로 실제 옮긴 byte 는 그보다 클 수 있으므로
            effective bandwidth 가 낮은 kernel 은 HBM 이 놀고 있는 것일 수도, 쓸모없는 byte 를 나르느라 꽉 차 있는 것일 수도 있습니다. 둘을 가르는 것이
            profiler 의 실제 sector 수입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Kernel 이 대역폭을 얼마나 썼는지와, 그 대역폭을 채우려면 얼마나 많은 요청이 떠 있어야 하는지를 어떻게 계산하나요?"
          idea="Effective bandwidth 는 kernel 이 필요로 한 byte 를 시간으로 나눈 성적이고, in-flight byte 는 그 대역폭이 latency 동안 옮길 수 있는 양이므로 이만큼이 항상 요청 중이어야 대역폭이 채워집니다."
          formula={String.raw`\begin{aligned}
BW_{\mathrm{eff}} &= \frac{B_r + B_w}{t} \\
B_{\mathrm{flight}} &= BW_{\mathrm{peak}} \cdot L_{\mathrm{mem}}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
BW_{\mathrm{eff}} &= \underbrace{\frac{B_r + B_w}{t}}_{\text{읽고 쓴 useful byte 를 kernel 시간으로 나눔}} \\
B_{\mathrm{flight}} &= \underbrace{BW_{\mathrm{peak}} \cdot L_{\mathrm{mem}}}_{\text{latency 동안 옮겨질 byte = 항상 요청 중이어야 하는 양}}
\end{aligned}`}
          operations={[
            { expression: String.raw`B_r + B_w`, annotation: ["읽은 byte 와 쓴 byte 를 더해", "kernel 이 필요로 한 총 traffic 을 만듦"] },
            { expression: String.raw`\frac{B_r + B_w}{t}`, annotation: ["그 byte 를 kernel 시간으로 나눠", "초당 byte 인 effective bandwidth 를 얻음"] },
            { expression: String.raw`BW_{\mathrm{peak}} \cdot L_{\mathrm{mem}}`, annotation: ["Peak bandwidth 에 latency 를 곱해", "Little's law 로 필요한 in-flight byte 를 얻음"] },
          ]}
          terms={[
            { symbol: String.raw`B_r,\ B_w`, name: "읽은 byte · 쓴 byte", description: "Kernel 이 필요로 한 useful byte 입니다. Uncoalesced access 로 실제 옮긴 byte 는 더 클 수 있습니다." },
            { symbol: String.raw`t`, name: "Kernel 시간", description: "같은 stream 의 CUDA event 로 잰 device 구간의 초 단위 시간입니다." },
            { symbol: String.raw`BW_{\mathrm{peak}}`, name: "Peak memory bandwidth", description: "HBM 의 이론 대역폭으로 H100 SXM5 는 3.35 TB/s 입니다." },
            { symbol: String.raw`L_{\mathrm{mem}}`, name: "Memory latency", description: "요청 하나가 돌아오기까지의 시간입니다. 이 글은 가정값 600 ns 를 씁니다." },
          ]}
          assumptions={["Effective bandwidth 의 byte 는 useful byte 기준입니다. 실제 옮긴 byte 로 계산하면 achieved DRAM throughput 이 되며 둘은 다른 질문에 답합니다.", "Little's law 식은 장기 평균이며 kernel 의 시작과 끝, cache hit 으로 latency 가 짧아지는 경우는 따로 봅니다.", "Latency 600 ns 는 가정값입니다. 세대와 hit 여부에 따라 수백 ns 범위에서 움직입니다."]}
          interpretation="2 GB / 0.8 ms = 2.5 TB/s 는 peak 의 75% 이고, 3.35 TB/s × 600 ns ≈ 2 MB 는 SM 당 약 15 KB, warp load 약 120개가 늘 떠 있어야 한다는 뜻입니다. Effective bandwidth 가 낮으면 요청이 부족한지 쓸모없는 byte 가 많은지를 sector 수로 갈라야 합니다."
        />
      </section>

      <section id="roofline-bound" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Ridge point 아래는 memory-bound, 위는 compute-bound 입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Roofline 은 kernel 의 FLOP/byte 인 arithmetic intensity 를 x 축에 놓고 도달 가능한 FLOP/s 를 min(peak compute,
            bandwidth × intensity) 로 긋는 그림입니다. 두 지붕이 만나는 x 가 ridge point 이고 kernel 의 intensity 가 그보다 작으면
            memory-bound, 크면 compute-bound 입니다.
          </p>
          <p>
            H100 SXM5 의 FP16 Tensor Core dense peak 989 TFLOPS 를 3.35 TB/s 로 나누면
            ridge point 는 약 295 FLOP/byte 입니다. FP32 CUDA core 67 TFLOPS 로 계산하면
            약 20 FLOP/byte 로, 같은 GPU 라도 어느 pipe 를 쓰느냐에 따라 지붕과 ridge 가
            다릅니다.
          </p>
          <p>
            Decode 의 GEMV 는 FP16 weight 2 byte 마다 FLOP 2개를 하니 intensity 가 약 1
            이고, 7B model 의 14 GB weight 를 한 token 마다 읽으면 3.35 TB/s 로 4.2 ms 가
            하한입니다. 4096³ FP16 GEMM 은 137 GFLOP 에 100 MB 를 읽어 intensity 약 1,365
            로 compute-bound 이며 989 TFLOPS 기준 0.14 ms 가 하한입니다.
          </p>
          <p>
            Compute-bound 의 증거는 pipe utilization 입니다. Nsight Compute 는 FMA·ALU 같은 CUDA core pipe 와 Tensor pipe
            가 전체 cycle 가운데 바쁜 비율을 따로 보여 주고 Tensor pipe 가 80% 넘게 바쁘면 그 kernel 은 지붕에 닿은 것입니다. ALU utilization 이
            높은데 Tensor utilization 이 0 이면 Tensor Core 를 안 쓰는 compute-bound 입니다.
          </p>
          <p>
            Memory-bound 의 증거는 DRAM throughput 이 peak 에 가깝고 pipe utilization 은
            낮은 상태입니다. 처방은 정반대여서, compute-bound 는 pipe 를 바꾸거나 연산을
            줄이고 memory-bound 는 byte 를 줄입니다. Tile 로 재사용을 늘려 intensity 를
            올리는 것이 <Link to="/gpu/cuda-matrix-multiply#tiled">shared-memory tiling</Link> 입니다.
          </p>
          <p>
            Roofline 의 peak 와 achieved 를 분리하는 규칙은{" "}
            <Link to="/gpu/gpu-architecture#gpu-peak-achieved-boundary">peak/achieved boundary</Link> 가
            소유합니다. 이 글은 그 지붕 위에 bound 부류의 이름과 판정 증거를 얹습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Kernel 이 도달할 수 있는 FLOP/s 의 상한과 ridge point 는 어떻게 계산하나요?"
          idea="연산이 memory 를 기다리지 않으면 compute peak 가, byte 가 모자라면 bandwidth × intensity 가 상한이므로 둘 중 작은 쪽이 지붕이고, 두 지붕이 같아지는 intensity 가 ridge point 입니다."
          formula={String.raw`\begin{aligned}
I &= \frac{F}{Q} \\
P_{\mathrm{attain}} &= \min\!\left(P_{\mathrm{peak}},\; BW_{\mathrm{peak}} \cdot I\right) \\
I_{\mathrm{ridge}} &= \frac{P_{\mathrm{peak}}}{BW_{\mathrm{peak}}}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
I &= \underbrace{\frac{F}{Q}}_{\text{FLOP 을 HBM byte 로 나눈 intensity}} \\
P_{\mathrm{attain}} &= \min\!\left(\underbrace{P_{\mathrm{peak}}}_{\text{compute 지붕}},\; \underbrace{BW_{\mathrm{peak}} \cdot I}_{\text{bandwidth 지붕}}\right) \\
I_{\mathrm{ridge}} &= \underbrace{\frac{P_{\mathrm{peak}}}{BW_{\mathrm{peak}}}}_{\text{두 지붕이 만나는 intensity}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\frac{F}{Q}`, annotation: ["Kernel 의 FLOP 을 HBM 에서 옮긴 byte 로 나눠", "byte 당 연산량인 arithmetic intensity 를 얻음"] },
            { expression: String.raw`BW_{\mathrm{peak}} \cdot I`, annotation: ["Bandwidth 에 intensity 를 곱해", "byte 공급 속도가 허용하는 FLOP/s 상한을 만듦"] },
            { expression: String.raw`\min\!\left(P_{\mathrm{peak}},\; BW_{\mathrm{peak}} \cdot I\right)`, annotation: ["두 상한 중 작은 쪽을 택해", "이 kernel 이 도달할 수 있는 지붕을 정함"] },
            { expression: String.raw`\frac{P_{\mathrm{peak}}}{BW_{\mathrm{peak}}}`, annotation: ["Compute peak 를 bandwidth 로 나눠", "두 지붕이 같아지는 ridge point 를 얻음"] },
          ]}
          terms={[
            { symbol: String.raw`F`, name: "Kernel 의 FLOP 수", description: "정의한 convention(FMA 를 2 로 셈)에 따른 useful 연산 수입니다." },
            { symbol: String.raw`Q`, name: "HBM traffic byte", description: "분석 경계에서 HBM 과 주고받은 byte 입니다. L2 hit 은 여기 들어가지 않습니다." },
            { symbol: String.raw`P_{\mathrm{peak}}`, name: "Compute peak", description: "쓰는 pipe 와 precision 의 peak 로, H100 FP16 Tensor dense 989 TFLOPS, FP32 67 TFLOPS 입니다." },
            { symbol: String.raw`BW_{\mathrm{peak}}`, name: "Peak memory bandwidth", description: "H100 SXM5 HBM3 의 3.35 TB/s 입니다." },
            { symbol: String.raw`I_{\mathrm{ridge}}`, name: "Ridge point", description: "989/3.35 ≈ 295 FLOP/B, FP32 는 67/3.35 ≈ 20 FLOP/B 입니다." },
          ]}
          assumptions={["Peak 는 NVIDIA 자기보고 값이며 clock·SKU·sparsity 조건에 묶입니다. Dense 값을 썼습니다.", "Q 를 HBM byte 로 잡은 HBM roofline 입니다. L2 나 shared memory 를 경계로 잡으면 다른 지붕이 나옵니다.", "지붕은 상한일 뿐이며 latency-bound 나 launch-bound kernel 은 지붕에 못 미친 채 어느 쪽에도 묶이지 않습니다."]}
          interpretation="Intensity 1 인 GEMV 는 3.35 TFLOPS 가 상한이라 Tensor Core 가 놀고, intensity 1,365 인 GEMM 은 989 TFLOPS 가 상한이라 HBM 이 놉니다. 지붕과 실측의 차이가 latency·launch 의 몫입니다."
        />
        <RooflineRidgeChart />
      </section>

      <section id="latency-launch-bound" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          지붕에 못 닿은 kernel 은 latency-bound 나 launch-bound 입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Roofline 은 상한만 그립니다. DRAM throughput 도 pipe utilization 도 낮은 kernel
            은 어느 지붕에도 닿지 않은 것이고, 원인은 두 가지 가운데 하나입니다. 요청이
            충분히 겹치지 않아 latency 를 기다리는 latency-bound 이거나, kernel 이 너무 짧아
            launch 자체가 시간을 먹는 launch-bound 입니다.
          </p>
          <p>
            Latency-bound 는 Nsight Compute 에서 eligible warp 가 scheduler 당 평균 1개
            미만이고 stall 이 long scoreboard 에 몰린 모습으로 나타납니다. DRAM 은 30%,
            pipe 는 15% 만 바쁘면서 issue slot 은 대부분 비어 있습니다. 처방은 byte 도 FLOP
            도 아닌 parallelism 이며 occupancy 를 올리거나 warp 당 outstanding load 를
            늘립니다.
          </p>
          <p>
            Launch-bound 는 kernel 하나의 일이 launch overhead 보다 짧을 때 생깁니다.
            Launch overhead 를 경험 범위인 수 µs, 계산 예로 4 µs 라고 두면 1 MB 를 옮기는
            kernel 의 일은 3.35 TB/s 에서 0.3 µs 라 시간의 90% 이상이 launch 입니다.
            이런 kernel 1,000개는 일 0.3 ms 에 overhead 4 ms 입니다.
          </p>
          <p>
            Launch-bound 의 처방은 kernel 수를 줄이는 것이고, 그 방법이{" "}
            <Link to="/gpu/cuda-kernel-fusion">kernel fusion</Link> 과{" "}
            <Link to="/ai/cuda-graph-capture#mechanics">CUDA graph</Link> 입니다. Profiler 의
            timeline 에서 kernel 사이 빈틈이 kernel 자체보다 길면 이 부류입니다.
          </p>
          <p>
            네 부류는 서로 배타가 아닙니다. Uncoalesced access 는 memory-bound 처럼 DRAM 을 채우면서 useful byte 로는 latency-bound
            처럼 보이고 decode 는 step 이 짧아 memory-bound 와 launch-bound 를 함께 앓습니다. 판정은 아래 순서로 한 번에 하나씩 좁힙니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Kernel 의 bound 부류 판정"
          input={["Nsight Systems timeline 의 kernel 시간과 kernel 사이 빈틈", "F: kernel 의 useful FLOP, Q: HBM byte(profiler 의 실제 sector 수 기준)", "peak: 쓰는 pipe 의 P_peak 와 BW_peak", "Nsight Compute 의 DRAM throughput, pipe utilization, eligible warps, stall 분포"]}
          steps={[
            { code: "if 빈틈 ≥ kernel 시간 or kernel 시간 < 수 µs: launch-bound → fusion·graph 로 kernel 수를 줄임", note: "Kernel 안을 보기 전에 kernel 밖을 먼저 봅니다. 여기서 끝나면 roofline 은 필요 없습니다." },
            { code: "I = F / Q;  I_ridge = P_peak / BW_peak", note: "Q 는 requested 가 아니라 실제 옮긴 byte 로 잡아야 uncoalesced access 가 드러납니다." },
            { code: "if DRAM throughput ≥ ~80% peak: memory-bound → byte 를 줄임(coalescing·tiling·낮은 precision)", note: "I < I_ridge 이면서 DRAM 이 차 있는 상태입니다. Useful byte 가 적은데 DRAM 이 차 있으면 먼저 sector 효율을 봅니다." },
            { code: "elif pipe utilization ≥ ~80%: compute-bound → 연산을 줄이거나 Tensor pipe 로 옮김", note: "ALU 만 높고 Tensor 가 0 이면 pipe 선택의 문제입니다." },
            { code: "else: latency-bound → eligible warps·stall 분포로 원인 확인 후 occupancy·MLP·ILP 를 올림", note: "둘 다 낮으면 자원이 아니라 겹침이 부족한 것입니다." },
            { code: "변경 하나를 적용하고 같은 경계에서 F/Q·시간을 다시 재어 부류가 바뀌었는지 확인", note: "Memory-bound 를 풀면 다음 병목은 compute 나 latency 로 옮겨 갑니다." },
          ]}
          repeatUntil="Kernel 시간이 목표 안에 들거나 지붕에 닿아 다음 개선이 다른 kernel 로 넘어갈 때까지 반복합니다."
          output="이 kernel 의 bound 부류 하나와 그 부류에 맞는 다음 변경 하나"
        />
        <TermBreakdown
          title="네 가지 bound 의 증거와 처방"
          description="같은 kernel 이 어느 부류에 있는지는 profiler 의 어느 숫자가 높은지로 가릅니다. 처방은 부류마다 다르고 잘못 고르면 시간이 줄지 않습니다."
          items={[
            { term: "Compute-bound", description: "Intensity 가 ridge 보다 크고 쓰는 pipe 의 utilization 이 peak 근처입니다.", example: "4096³ FP16 GEMM, Tensor pipe 80% 이상.", boundary: "ALU 만 높고 Tensor 가 0 이면 pipe 를 바꾸는 것이 처방입니다." },
            { term: "Memory-bound", description: "Intensity 가 ridge 보다 작고 DRAM throughput 이 peak 근처입니다.", example: "Decode GEMV, intensity 1, DRAM 85%.", boundary: "Useful byte 는 적은데 DRAM 이 차 있으면 uncoalesced access 를 먼저 봅니다." },
            { term: "Latency-bound", description: "DRAM 도 pipe 도 낮고 eligible warp 가 scheduler 당 1개 미만입니다.", example: "Load 뒤 바로 값을 쓰는 pointer chasing, DRAM 30%·pipe 15%.", boundary: "Byte 나 FLOP 을 줄여도 안 빨라지고 parallelism 을 늘려야 합니다." },
            { term: "Launch-bound", description: "Kernel 의 일이 launch overhead 보다 짧아 timeline 의 빈틈이 kernel 보다 깁니다.", example: "1 MB 짜리 elementwise kernel 1,000개, 일 0.3 ms 에 overhead 4 ms.", boundary: "Kernel 안을 최적화해도 시간이 줄지 않으며 kernel 수를 줄여야 합니다." },
          ]}
        />
        <ProgressiveDetail
          title="HBM roofline 말고 L2 나 shared memory 를 경계로 잡으면 무엇이 달라지나요?"
          preview="지붕이 계층마다 따로 생깁니다. L2 bandwidth 는 HBM 보다 높아 ridge 가 오른쪽으로 가고, HBM 기준으로 compute-bound 인 kernel 이 L2 기준으로는 memory-bound 일 수 있습니다."
        >
          <p>
            Q 를 HBM byte 로 잡은 roofline 은 HBM 이 병목일 때만 맞습니다. L2 hit 이 많은 kernel 은 HBM byte 가 적어 intensity 가 커
            보이지만 실제로는 L2 bandwidth 에 묶여 있을 수 있습니다. Nsight Compute 의 roofline chart 는 계층별 지붕을 함께 그려 이 경우를 가립니다.
          </p>
          <p>
            같은 이유로 shared memory 를 많이 쓰는 tiled GEMM 은 HBM roofline 으로는 여유가 있어도 shared memory bandwidth 나 bank
            conflict 에 묶일 수 있습니다. 어느 경계의 지붕에 닿았는지를 먼저 정하고 그 경계의 byte 로 intensity 를 다시 계산해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Best Practices Guide, Nsight Compute, Roofline 논문이 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            32-byte transaction 으로 합쳐진다는 규칙, 어긋난 접근이 sector 5개를 부른다는
            예, effective bandwidth 의 식, local memory 가 off-chip 이라는 표는 NVIDIA CUDA
            C++ Best Practices Guide 12.8.1 의 것입니다. Pipe utilization 과 DRAM
            throughput, eligible warp 의 정의는 Nsight Compute Profiling Guide 에서
            가져왔습니다.
          </p>
          <p>
            Roofline 은 Williams, Waterman, Patterson 이 2009년에 multicore 를 위해 제안한
            model 이며 GPU 에 그대로 적용됩니다. H100 SXM5 의 SM 132개, L2 50 MB, SM 당
            L1·shared 256 KB 는 NVIDIA Hopper 소개 글에서, 3.35 TB/s 와 67 TFLOPS 는
            H100 제품 명세에서 읽었습니다.
          </p>
          <p>
            Memory latency 600 ns 와 launch overhead 4 µs 는 문서 수치가 아니라 계산 예를 위한 가정값입니다. Bound 판정의 80% 같은 문턱도
            관행이지 규격이 아니므로 자기 kernel 의 값은 같은 GPU 에서 profiler 로 직접 읽어야 합니다.
          </p>
        </div>
        <div id="paper-cuda-best-practices-memory" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Best Practices Guide 12.8.1 · Coalesced Access, Effective Bandwidth Calculation, Device Memory Spaces"
            citeKey={1}
            href={BEST_PRACTICES}
            type="code"
          >
            Compute capability 6.0 이상에서 warp 의 접근이 필요한 32-byte transaction 수로
            합쳐진다는 규칙과 misaligned·strided 예, effective bandwidth = ((Br+Bw)/10⁹)/time
            식, local·constant memory 의 위치와 cache 여부를 적은 표가 이 문서에 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-nsight-compute-roofline" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · Nsight Compute Profiling Guide · Speed Of Light, Roofline Charts, Memory Chart, Scheduler Statistics"
            citeKey={2}
            href={NSIGHT}
            type="code"
          >
            Compute·memory throughput 의 Speed Of Light 요약, 계층별 roofline chart, pipe
            utilization 과 DRAM throughput, active·eligible·issued warp 의 정의가 여기에
            있습니다. 이 글의 bound 판정 증거는 이 metric 들의 조합입니다.
          </CitationBlock>
        </div>
        <div id="paper-roofline-williams" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Williams, Waterman, Patterson · Roofline: An Insightful Visual Performance Model for Multicore Architectures (CACM 2009)"
            citeKey={3}
            href={ROOFLINE}
          >
            Operational intensity 를 x 축에, min(peak FLOP/s, bandwidth × intensity) 를
            지붕으로 그려 kernel 이 어느 자원에 먼저 묶이는지 보이는 model 을 제안했습니다.
            원 논문은 multicore CPU 가 대상이며 GPU 적용은 같은 식을 다른 peak 에 넣은 것입니다.
          </CitationBlock>
        </div>
        <div id="paper-hopper-h100-memory" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA Developer Blog · NVIDIA Hopper Architecture In-Depth"
            citeKey={4}
            href={HOPPER}
          >
            H100 SXM5 의 SM 132개, L2 50 MB, SM 당 L1·shared memory 256 KB, HBM3 3 TB/s
            이상이라는 구성을 읽었습니다. Peak FLOPS 와 3.35 TB/s 는 NVIDIA 자기보고이며
            SKU·clock 조건에 묶입니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/cuda-perf-analysis#throughput-ledger">Achieved FLOP/s·bandwidth ledger</Link>,
          그리고 <Link to="/gpu/cuda-matrix-multiply#tiled">Tile 로 intensity 를 올리는 GEMM</Link>.
        </p>
      </section>
    </div>
  );
}
