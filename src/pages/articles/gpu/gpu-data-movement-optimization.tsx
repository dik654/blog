import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import GpuDataMovementOptimizationViz from "./gpu-data-movement-optimization/viz/GpuDataMovementOptimizationViz";

/**
 * Data movement 최적화: global→shared→register 경로와 overlap
 *
 * Global memory → shared memory → register 세 층 사이의 byte 이동을 단계별로 세고,
 * staging·fragment load·round trip 제거·prefetching·overlap 으로 그 byte 와 시간을 줄이는
 * mechanism 을 소유한다. Stage ring 과 barrier 손잡이는 /gpu/warp-specialization-and-async-pipelines 가,
 * cache·transaction·roofline 의 정의는 /gpu/gpu-memory-hierarchy-and-roofline 이,
 * fusion 의 범위 판단은 /gpu/cuda-kernel-fusion 이 소유한다.
 */
export default function GpuDataMovementOptimizationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="data-movement" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Data movement 최적화는 세 층 사이의 byte 를 줄이고 겹칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GPU kernel 의 데이터는 global memory 에서 shared memory 로, 다시 register 로 내려와
            계산되고 같은 길을 되돌아 올라갑니다. Data movement 최적화는 이 세 층 사이에서 오가는
            byte 를 세어 줄이고, 줄이지 못하는 이동은 계산과 같은 시간에 겹치게 하는 일입니다.
            계산량을 바꾸지 않고 시간을 줄이는 두 손잡이가 byte 와 overlap 입니다.
          </p>
          <p>
            층마다 대역폭이 크게 다르기 때문입니다. H100 의 HBM3 는 3.35 TB/s 이고 shared memory 는 SM 마다 clock 당 128 B 를 내므로 SM
            132개에 1.7 GHz 를 곱하면 약 28.7 TB/s 로 HBM 의 8.6배입니다. Register 는 그 위에서 명령마다 읽히므로 다시 한 자릿수 이상 빠릅니다.
          </p>
          <p>
            같은 tile 을 세 층에서 따라가 봅니다. 128×32 fp16 tile 은 8 KB 이고 global 에서 shared memory 로 한 번, shared memory
            에서 register 로 warp 마다 한 번 내려옵니다. HBM 에서 SM 하나의 몫 25 GB/s 로 8 KB 를 받는 데 0.32 µs 가 걸리지만 shared
            memory 가 같은 8 KB 를 쓰는 데는 37 ns 입니다.
          </p>
          <p>
            그래서 최적화의 순서가 정해집니다. 먼저 가장 느린 global 층의 byte 를 줄이고, 다음으로
            shared memory 의 명령 수를 줄이며, 마지막으로 남은 global 이동을 계산 뒤에 숨깁니다.
            어느 층이 병목인지 판정하는 arithmetic intensity 와 ridge point 는{" "}
            <Link to="/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">roofline 글</Link> 이
            소유합니다.
          </p>
          <p>
            이 글은 그 순서대로 갑니다. Global→shared staging, shared→register fragment load,
            global round trip 을 없애는 register-resident dataflow, prefetching, 그리고 load·compute·
            store 를 겹치는 pipeline 입니다. 마지막 절의 식이 overlap 의 이득을 max 와 합의 차이로
            적습니다.
          </p>
        </div>
        <TermBreakdown
          title="세 층 사이 이동의 단위와 비용 (128×32 fp16 tile, 8 KB)"
          description="한 tile 이 내려오는 길을 층마다 명령 수와 시간으로 셉니다. 시간은 H100 공개 사양으로 계산한 산수입니다."
          items={[
            { term: "Global → shared", description: "Threadblock 전체가 한 번 옮기고 모든 warp 가 다시 읽는 층입니다.", example: "cp.async 16 B 로 128 thread 가 내면 thread 당 4번, TMA 면 명령 1개. SM 몫 25 GB/s 로 0.32 µs.", boundary: "HBM 3.35 TB/s 가 chip 전체의 상한이라 SM 이 늘어도 SM 당 몫은 줄어듭니다." },
            { term: "Shared → register", description: "Warp 마다 자기 fragment 만 올리는 층입니다.", example: "Warp 의 64×32 조각 4 KB 는 ldmatrix.x4 8번. SM 당 128 B/clk 로 8 KB 쓰기는 37 ns.", boundary: "Bank conflict 가 나면 명령 하나가 여러 clock 에 걸쳐 실행됩니다." },
            { term: "Register → register", description: "층을 내려가지 않고 같은 thread 의 register 안에서 다음 연산으로 넘기는 경로입니다.", example: "wgmma 의 accumulator 에 bias 와 GELU 를 그대로 적용하고 한 번만 store 합니다.", boundary: "Register 는 thread 당 255개가 상한이며 넘치면 local memory 로 spill 됩니다." },
          ]}
        />
        <ContentBoundary article="gpu-data-movement-optimization" />
      </section>

      <section id="global-to-shared" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Global→shared staging 은 한 번 읽은 tile 을 block 전체가 다시 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Shared-memory staging 은 global memory 의 조각을 shared memory 에 한 번 내려놓고 여러 warp 가 여러 번 읽게 하는 방식입니다. 각
            warp 가 필요한 값을 global 에서 직접 읽으면 같은 값이 warp 수만큼 HBM 을 오가지만 staging 을 거치면 HBM 은 한 번만 읽습니다.
          </p>
          <p>
            GEMM 에서 세어 봅니다. Threadblock tile 128×128 을 warp 4개가 2×2 로 나누면 A 의 한 행 조각을 N 방향의 warp 2개가, B 의 한 열
            조각을 M 방향의 warp 2개가 씁니다. Staging 없이 읽으면 A·B 가 각각 두 번 HBM 을 오가고 staging 을 하면 한 번입니다. K 를 32 씩 도는
            반복마다 8 KB 두 벌이 16 KB 대신 32 KB 가 되는 차이입니다.
          </p>
          <p>
            둘째 이득은 접근 순서의 재배열입니다. Global 은 warp 의 32 lane 이 연속한 128 B 를 읽을
            때 transaction 이 가장 적고, 계산이 원하는 순서는 그와 다를 때가 많습니다. Staging 은
            global 을 연속 순서로 읽고 shared memory 에서 계산 순서로 다시 읽어 둘을 분리합니다.
            연속 접근의 정의는{" "}
            <Link to="/gpu/cuda-shared-memory#coalescing">coalescing</Link> 에 있습니다.
          </p>
          <p>
            이동 자체는 register 를 거치지 않는 asynchronous copy 가 맡습니다. 8 KB tile 을{" "}
            <code>cp.async</code> 16 B 로 옮기면 128 thread 가 thread 당 4번 내고, Hopper 의 TMA 는
            32×128 box 를 명령 하나로 옮깁니다. 두 명령의 발행·완료 방식은{" "}
            <Link to="/gpu/warp-specialization-and-async-pipelines#async-copy">앞 글의 asynchronous copy</Link> 가
            소유합니다.
          </p>
          <p>
            비용은 shared memory 용량과 barrier 입니다. Tile 을 내려놓은 뒤 모든 warp 가 읽을 수 있으려면 도착을 알리는 동기화가 필요하고 stage 를 여러
            벌 두면 그만큼 용량을 먹습니다. 용량이 곧 SM 에 함께 머무는 threadblock 수를 정하므로 staging 의 이득은 재사용 횟수가 barrier 와 occupancy
            손실을 넘을 때만 남습니다.
          </p>
        </div>
      </section>

      <section id="shared-to-register" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Shared→register 는 ldmatrix 로 fragment 를 명령 8번에 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Shared memory 에서 register 로 내려오는 단위는 warp 하나가 tensor core 명령에 넣을 fragment 입니다. 이 층의 병목은 byte 가 아니라
            명령 수와 bank conflict 입니다. Shared memory 는 충분히 빠르지만 warp 가 내는 load 명령 하나하나가 issue slot 을 쓰기 때문에 같은
            byte 를 더 적은 명령으로 올리는 것이 목표가 됩니다.
          </p>
          <p>
            <code>ldmatrix</code> 가 그 명령입니다. Warp 의 32 lane 이 8개 행의 주소를 나눠 주면
            8×8 fp16 행렬 하나를 lane 마다 2개씩 register 에 나눠 담고, <code>.x4</code> 는 그런 행렬
            4개, 곧 512 B 를 한 명령에 올립니다. 결과 배치는 <code>mma.sync</code> 가 원하는 fragment
            모양과 같아 다시 섞을 필요가 없습니다.
          </p>
          <p>
            Warp 하나가 맡는 A 의 64×32 fp16 조각은 4 KB 입니다. <code>ld.shared.b32</code> 로 lane
            마다 4 B 씩 올리면 4 KB / (32 × 4 B) = 32번이지만 <code>ldmatrix.x4</code> 로는 8번입니다.
            Lane 하나가 결국 드는 값은 어느 쪽이든 64 halves, register 32개로 같습니다.
          </p>
          <p>
            Hopper 의 <code>wgmma</code> 는 이 층을 건너뜁니다. A·B 를 shared memory descriptor 로
            직접 읽으므로 register 로 올리는 명령 자체가 없고, accumulator 만 register 에 남습니다.
            그 대신 shared memory 의 배치가 descriptor 의 swizzle 과 맞아야 하며, 그 규칙은{" "}
            <Link to="/gpu/cutlass-gemm-hierarchy-and-cute-layouts#swizzle">swizzled layout</Link> 이
            소유합니다.
          </p>
          <p>
            Bank conflict 는 이 층의 숨은 비용입니다. ldmatrix 가 읽는 8개 행이 같은 bank 에
            놓이면 명령 하나가 8 clock 에 걸쳐 실행되어 명령 수를 줄인 이득이 사라집니다. Bank
            의 정의는 <Link to="/gpu/cuda-shared-memory#bank-conflict">shared memory bank conflict</Link> 에
            있습니다.
          </p>
        </div>
      </section>

      <section id="round-trip" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Global round trip 을 없애면 traffic 이 160 MB 에서 32 MB 로 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Global memory round trip 은 한 kernel 이 결과를 HBM 에 쓰고 다음 kernel 이 그것을 다시 읽는 왕복입니다. 중간 결과가 register 나
            shared memory 에 있는 동안 다음 연산을 이어 붙이면 이 왕복이 사라지며 이것을 memory traffic elimination 이라 부릅니다. 계산은 그대로이고
            byte 만 줄어듭니다.
          </p>
          <p>
            GEMM 뒤에 bias 와 GELU 가 오는 경우를 셉니다. M = N = K = 4096, bf16 이면 출력 C 는
            32 MB 입니다. 세 kernel 로 나누면 GEMM 이 C 를 쓰고(32), bias kernel 이 읽고 쓰고(64),
            GELU kernel 이 읽고 쓰므로(64) 출력 쪽 traffic 만 160 MB 입니다.
          </p>
          <p>
            Epilogue 에 bias 와 GELU 를 넣으면 accumulator 가 register 에 있는 동안 두 연산이 적용되고 store 는 한 번, 32 MB 입니다. HBM
            3.35 TB/s 로 160 MB 는 48 µs, 32 MB 는 9.5 µs 입니다. GEMM 자체의 137 GFLOP 이 989 TFLOP/s 로 139 µs 이므로 없앤
            38 µs 는 GEMM 시간의 4분의 1이 넘습니다.
          </p>
          <p>
            중간값이 register 에서 다음 연산으로 바로 넘어가는 경로를 register-to-register dataflow 라 부릅니다. Fragment 하나에 bias 를 더하고
            GELU 를 계산해 같은 register 에 두는 것이며 Hopper 의 wgmma 는 accumulator 를 register 에 두므로 epilogue 가 그 위에서 바로
            돕니다.
          </p>
          <p>
            한계는 register 와 fusion 범위입니다. 이어 붙일 연산이 이웃 원소를 필요로 하면
            register 만으로는 안 되고 shared memory 를 거쳐야 하며, reduction 이 끼면 block 경계
            에서 다시 global 을 써야 합니다. 어디까지 붙일지의 판정은{" "}
            <Link to="/gpu/cuda-kernel-fusion#small-fusion">kernel fusion 의 IO 경계</Link> 와{" "}
            <Link to="/gpu/cuda-kernel-fusion#release-gate">fusion ROI 경계</Link> 가 소유합니다.
          </p>
        </div>
        <TermBreakdown
          title="GEMM + bias + GELU 의 출력 traffic (M = N = K = 4096, bf16, C 32 MB)"
          description="A·B 읽기 64 MB 는 두 경우 모두 같으므로 출력 쪽만 셉니다."
          items={[
            { term: "세 kernel", description: "GEMM store, bias load·store, GELU load·store.", example: "32 + 64 + 64 = 160 MB, 3.35 TB/s 로 48 µs.", boundary: "Kernel 사이의 launch 간격과 L2 에 남는 부분은 이 산수에 없습니다." },
            { term: "Epilogue fusion", description: "Accumulator register 에 bias·GELU 를 적용하고 한 번 store.", example: "32 MB, 9.5 µs. GEMM 139 µs 대비 38 µs 절감.", boundary: "GELU 의 exp 가 epilogue 의 계산 시간을 늘리며 그 pipe 가 병목이 될 수 있습니다." },
          ]}
        />
      </section>

      <section id="prefetching" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Prefetching 은 쓰기 전에 미리 요청해 지연을 앞당깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefetching 은 데이터가 필요해지기 전에 요청을 내서 실제로 쓰는 시점에는 이미 가까운 층에 와 있게 하는 기법입니다. Byte 를 줄이지는 않고 지연이 드러나는
            시점을 앞으로 옮깁니다. 요청을 program 이 내면 software prefetching, hardware 가 내면 hardware prefetching 입니다.
          </p>
          <p>
            Software prefetching 의 GPU 형태는 다음 tile 의 load 를 현재 tile 의 계산보다 먼저
            내는 것입니다. Tile 하나의 계산 C 동안 load L 을 숨기려면 ⌈L/C⌉ 개 tile 앞서 요청해야
            하며, 그 요청을 register 에 받는 것이 Ampere 의 fragment double buffering, shared
            memory 에 받는 것이{" "}
            <Link to="/gpu/warp-specialization-and-async-pipelines#stage-pipeline">multi-stage pipeline</Link> 입니다.
          </p>
          <p>
            Hardware prefetching 은 목적지 register 나 shared memory 없이 cache 에만 올려 두는
            요청입니다. PTX 의 <code>prefetch.global.L2</code> 는 한 line 을 L2 로 가져오고, Hopper 의{" "}
            <code>cp.async.bulk.prefetch.tensor</code> 는 tensor map 의 box 하나를 L2 로 가져옵니다.
            Tensor map 의 L2 promotion 은 TMA 가 읽을 때 64·128·256 B 단위로 더 넓게 가져오게 합니다.
          </p>
          <p>
            CPU 와 다른 점을 분명히 해야 합니다. CUDA 문서가 규정하는 hardware prefetch 는 모두
            program 이 내는 명시적 hint 이며, CPU 의 stride prefetcher 처럼 접근 패턴을 보고
            스스로 앞서 읽는 장치는 문서에 없습니다. GPU 는 그 대신 많은 warp 의 요청을 동시에
            띄워 지연을 숨기며, 그 원리는{" "}
            <Link to="/gpu/sm-warp-scheduling-and-issue#latency-hiding">TLP·ILP·MLP</Link> 에 있습니다.
          </p>
          <p>
            Prefetch 거리가 너무 길면 가져온 데이터가 쓰이기 전에 cache 에서 밀려나고 너무 짧으면 지연이 그대로 드러납니다. L2 50 MB 를 SM 132개가 나눠 쓰므로
            SM 당 몫은 400 KB 남짓입니다. 그보다 앞서 prefetch 한 tile 은 남아 있다는 보장이 없습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Prefetch 거리와 stage 수는 같은 값인가요?"
          preview="Shared memory 로 받는 software prefetch 에서는 stage 수 S 가 곧 prefetch 거리 + 1 이고, L2 로만 올리는 hardware prefetch 는 stage 를 먹지 않는 대신 도착을 보장하지 않습니다."
        >
          <p>
            Stage ring 에서 producer 가 consumer 보다 S−1 tile 앞서 가므로 prefetch 거리는 S−1 이며,
            S ≥ ⌈L/C⌉ + 1 은 거리가 ⌈L/C⌉ 이상이어야 한다는 같은 말입니다. 거리를 늘리는 비용이
            stage 당 tile 한 벌의 shared memory 입니다.
          </p>
          <p>
            L2 prefetch 는 shared memory 를 쓰지 않으므로 거리를 더 길게 잡을 수 있지만 도착을 알리는 barrier 가 없어 실제 load 때 L2 hit 을
            기대할 뿐입니다. 그래서 CUTLASS 는 다음 tile 의 TMA 를 내기 전에 그 다음 tile 의 tensor 를 L2 로 prefetch 하는 식으로 둘을 겹쳐 씁니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="overlap" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Overlap 이 되면 시간은 합이 아니라 max 로 줄어듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Memory pipeline overlap 은 한 tile 의 load 와 다른 tile 의 계산, 또 다른 tile 의 store 가 같은 시간에 진행되는 상태입니다. 겹침이
            없으면 시간은 이동 시간과 계산 시간의 합이고 완전히 겹치면 둘 중 큰 쪽입니다. 이 차이가 data movement 최적화의 둘째 손잡이입니다.
          </p>
          <p>
            Tile 하나의 load 가 1.2 µs, 계산이 0.8 µs 라 합시다. 순서대로 하면 tile 당 2.0 µs 이고
            100 tile 에 200 µs 입니다. 겹치면 첫 tile 의 load 1.2 µs 뒤로는 tile 마다 max(1.2, 0.8)
            = 1.2 µs 씩 가서 약 121 µs 입니다. 남은 병목은 load 이므로 다음 손잡이는 byte 를 줄이는
            앞 절들입니다.
          </p>
          <p>
            같은 식을 kernel 전체에 적용하면 roofline 이 됩니다. 앞 절의 GEMM 은 출력 traffic 160 MB 가 48 µs, 계산이 139 µs 이므로 겹치면
            139 µs 이고 겹치지 않으면 187 µs 입니다. Fusion 으로 traffic 을 32 MB 로 줄이면 합도 148 µs 로 내려오지만 겹친 경우는 여전히 139 µs
            로 compute-bound 입니다.
          </p>
          <p>
            Compute–communication overlap 이라는 이름은 같은 원리를 GPU 사이의 이동에 쓴 것입니다.
            NCCL 의 all-reduce 를 다음 layer 의 계산과 겹치는 것이 그 예이며, kernel 안의 tile
            load 를 계산과 겹치는 것과 식이 같습니다. Stream 수준에서 copy engine 과 kernel 을
            겹치는 규칙은 <Link to="/gpu/cuda-sync-streams#streams">CUDA stream ordering</Link> 이
            소유합니다.
          </p>
          <p>
            Overlap 이 성립하려면 이동과 계산이 서로 다른 자원을 써야 합니다. TMA 와 tensor core, copy engine 과 SM 은 다른 자원이라 겹치지만 일반
            load 명령은 warp 의 issue slot 을 계산과 나눠 쓰므로 그만큼 덜 겹칩니다. 아래 Viz 는 세 층 사이를 tile 이 흐르며 겹침이 생기는 순서를 보여
            줍니다.
          </p>
        </div>
        <GpuDataMovementOptimizationViz />
        <ExplainedFormula
          question="이동과 계산이 겹칠 때와 겹치지 않을 때 kernel 시간은 어떻게 다른가요?"
          idea="이동은 bytes 를 대역폭으로 나눈 시간, 계산은 FLOP 을 peak 으로 나눈 시간입니다. 서로 다른 자원이 동시에 일하면 시간은 큰 쪽에 수렴하고, 한 자원이 차례로 하면 두 시간의 합입니다."
          formula={String.raw`\begin{aligned}
T_{\text{serial}} &= \frac{B}{\mathrm{BW}} + \frac{F}{P} \\
T_{\text{overlap}} &\approx \max\!\left(\frac{B}{\mathrm{BW}},\ \frac{F}{P}\right) + T_{\text{fill}}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
T_{\text{serial}} &= \underbrace{\frac{B}{\mathrm{BW}}}_{\text{이동 시간}} + \underbrace{\frac{F}{P}}_{\text{계산 시간}} \\
T_{\text{overlap}} &\approx \underbrace{\max\!\left(\frac{B}{\mathrm{BW}},\ \frac{F}{P}\right)}_{\text{둘 중 긴 쪽이 지배}} + \underbrace{T_{\text{fill}}}_{\text{첫 tile 의 load}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\frac{B}{\mathrm{BW}}`, annotation: ["옮길 bytes 를 대역폭으로 나눠", "160 MB / 3.35 TB/s = 48 µs"] },
            { expression: String.raw`\frac{F}{P}`, annotation: ["FLOP 을 peak 으로 나눠", "137 GFLOP / 989 TFLOP/s = 139 µs"] },
            { expression: String.raw`\max(\cdot,\cdot)`, annotation: ["겹치면 긴 쪽만 남아", "max(48, 139) = 139 µs, 합이면 187 µs"] },
            { expression: String.raw`T_{\text{fill}}`, annotation: ["Pipeline 이 차기 전 첫 tile 의 load 는 숨길 수 없어", "tile 당 1.2 µs 면 1.2 µs 가 더해집니다"] },
          ]}
          terms={[
            { symbol: "B", name: "Bytes moved", description: "Kernel 이 global memory 와 주고받는 총 bytes 입니다. Fusion 과 staging 이 줄이는 값입니다." },
            { symbol: String.raw`\mathrm{BW}`, name: "Bandwidth", description: "그 층의 실효 대역폭입니다. HBM 3.35 TB/s 는 상한이며 접근 패턴에 따라 낮아집니다." },
            { symbol: "F", name: "FLOP", description: "Kernel 의 총 부동소수점 연산 수입니다. 2MNK 가 GEMM 의 값입니다." },
            { symbol: "P", name: "Peak throughput", description: "그 dtype 의 tensor core peak 입니다. H100 dense bf16 989 TFLOP/s." },
            { symbol: String.raw`T_{\text{fill}}`, name: "Fill time", description: "첫 tile 이 도착할 때까지의 시간입니다. Tile 수 T 가 크면 전체에서 무시할 만합니다." },
          ]}
          assumptions={["이동과 계산이 서로 다른 hardware 자원을 쓰고 한쪽이 다른 쪽의 issue slot 을 빼앗지 않는다고 가정합니다.", "BW 와 P 는 상한이며 achieved 값은 profiler 로 따로 재야 합니다. 이 식은 어느 쪽이 병목인지의 방향만 줍니다."]}
          interpretation="겹침이 완전하면 시간은 roofline 의 max 로 내려오고, 그 뒤로는 max 안에서 큰 항을 줄여야 합니다. B/BW 가 크면 byte 를 줄이고 F/P 가 크면 계산이 병목이므로, 같은 kernel 에서 두 손잡이 중 어느 쪽을 당길지가 이 식에서 정해집니다."
        />
        <AlgorithmBlock
          title="Load–compute–store software pipeline (tile T 개, stage S, register accumulator)"
          input={["tiles[0..T): global memory 의 입력 tile 열", "smem[S]: 입력 tile 을 받는 shared memory ring 과 stage 마다 full·empty barrier", "acc: thread 당 register accumulator, out_frag: 다음 store 를 기다리는 register 조각", "load(k, s): tile k 를 stage s 로 옮기는 asynchronous copy (cp.async 또는 TMA)"]}
          steps={[
            { code: "for s in 0..S-1:  load(s, s)", note: "Prologue. 계산 없이 S−1 개 tile 의 load 를 먼저 띄워 pipeline 을 채웁니다. 이 시간이 T_fill 입니다." },
            { code: "for k in 0..T:  wait(full[k % S])", note: "Tile k 의 도착을 기다립니다. Pipeline 이 차 있으면 이미 도착해 있어 거의 멈추지 않습니다." },
            { code: "  if k + S - 1 < T:  wait(empty[(k+S-1) % S]);  load(k+S-1, (k+S-1) % S)", note: "Tile k 를 계산하기 전에 S−1 개 뒤의 tile 을 요청합니다. Load 가 계산과 같은 시간에 진행되는 지점입니다." },
            { code: "  frag = ldmatrix(smem[k % S]);  acc = mma(frag, acc)", note: "Shared memory 에서 fragment 를 올려 계산합니다. wgmma 면 ldmatrix 없이 descriptor 로 읽습니다." },
            { code: "  arrive(empty[k % S])", note: "다 읽은 stage 를 producer 에게 돌려줍니다. 이 도착이 늦으면 load 가 멈춥니다." },
            { code: "  if tile k 가 출력 경계이면:  out_frag = epilogue(acc);  store_async(out_frag);  acc = 0", note: "Bias·activation 을 register 에서 적용하고 store 를 비동기로 냅니다. Store 가 다음 tile 의 계산과 겹칩니다." },
          ]}
          repeatUntil="k 가 T 에 닿으면 남은 store 의 완료를 기다리고 끝냅니다. 정상 상태에서는 load(k+S−1), compute(k), store(k−1) 세 가지가 서로 다른 tile 에 대해 같은 시간에 진행됩니다."
          output="출력 tile 전체. 총 시간은 T_fill + T × max(load, compute, store) 에 가까워지고, 순서대로 했을 때의 T × (load + compute + store) 와의 차이가 overlap 의 이득입니다."
        />
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 CUDA 문서와 PTX ISA, H100 공개 사양입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Shared memory 를 staging 으로 써서 global 을 한 번만 읽고 순서를 재배열한다는 설명과
            asynchronous transfer 로 이동을 계산과 겹친다는 설명은 CUDA Best Practices Guide 에서
            가져왔습니다. ldmatrix 의 8×8 행렬과 .x4, prefetch 와 cp.async.bulk.prefetch.tensor 의
            L2 목적지는 PTX ISA 에서 읽었습니다.
          </p>
          <p>
            3.35 TB/s 와 989 TFLOP/s 는 NVIDIA 의 H100 제품 사양이고 shared memory 의 SM 당 128 B/clk 는 bank 32개 × 4 B 에서
            계산한 값입니다. 이 글의 0.32 µs·37 ns·48 µs·139 µs 는 그 사양으로 계산한 산수이며 어느 kernel 의 측정값도 아닙니다.
          </p>
          <p>
            GEMM + bias + GELU 의 160 MB 대 32 MB 는 dtype 과 shape 에서 곧바로 나오는 산수이고 fusion 이 실제로 그만큼의 시간을 돌려주는지는
            profiler 의 achieved traffic 으로 따로 확인해야 합니다.
          </p>
        </div>
        <div id="paper-cuda-best-practices-staging" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Best Practices Guide · Shared Memory in Matrix Multiplication · Asynchronous and Overlapping Transfers with Computation"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html"
          >
            Shared memory 가 global 에서 한 번 읽은 데이터를 여러 thread 가 재사용하게 하고 접근
            순서를 재배열한다는 설명, 그리고 asynchronous transfer 와 stream 으로 이동을 계산과
            겹친다는 설명의 출처입니다. 구체 수치는 문서가 아니라 이 글의 계산입니다.
          </CitationBlock>
        </div>
        <div id="paper-ptx-ldmatrix-prefetch" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · PTX ISA · ldmatrix · prefetch/prefetchu · cp.async.bulk.prefetch.tensor"
            citeKey={2}
            href="https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#warp-level-matrix-load-instruction-ldmatrix"
          >
            ldmatrix 가 8×8 b16 행렬을 .x1·.x2·.x4 로 warp 전체에 나눠 싣는다는 정의, prefetch 가
            register 목적지 없이 L1·L2 로 line 을 가져온다는 정의, sm_90 의 bulk prefetch 가 tensor
            map 의 box 를 L2 로 가져온다는 정의를 읽었습니다.
          </CitationBlock>
        </div>
        <div id="paper-cuda-tma-tensor-copy" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA Driver API · cuTensorMapEncodeTiled · l2Promotion"
            citeKey={3}
            href="https://docs.nvidia.com/cuda/cuda-driver-api/group__CUDA__TENSOR__MEMORY.html"
          >
            다차원 tensor copy 의 box 와 stride, 그리고 TMA 가 읽을 때 L2 로 64·128·256 B 단위로
            더 넓게 가져오게 하는 L2 promotion 옵션의 출처입니다.
          </CitationBlock>
        </div>
        <div id="paper-h100-spec" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · H100 Tensor Core GPU 제품 사양 · Hopper Tuning Guide"
            citeKey={4}
            href="https://www.nvidia.com/en-us/data-center/h100/"
          >
            HBM3 3.35 TB/s, FP16/BF16 dense 989 TFLOP/s (sparsity 1,979), L2 50 MB, SM 당 shared
            memory 228 KB 의 출처입니다. SM 수 132 와 1.7 GHz 는 SXM5 구성의 공개 값이며, 이 글은
            이 값들로 층별 시간을 계산했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          앞 글: <Link to="/gpu/warp-specialization-and-async-pipelines">Warp specialization 과 asynchronous pipeline</Link>,
          병목 판정은 <Link to="/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">roofline</Link>,
          fusion 범위는 <Link to="/gpu/cuda-kernel-fusion">kernel fusion</Link>.
        </p>
      </section>
    </div>
  );
}
