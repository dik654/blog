import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import WarpSpecializationAndAsyncPipelinesViz from "./warp-specialization-and-async-pipelines/viz/WarpSpecializationAndAsyncPipelinesViz";

/**
 * Warp specialization 과 asynchronous pipeline: TMA, wgmma, stage ring
 *
 * 한 threadblock 의 warp 를 producer 와 consumer 로 나누고, producer 가 cp.async·TMA 로
 * shared memory stage 를 채우는 동안 consumer warpgroup 이 wgmma 를 내며, 둘 사이를 mbarrier 의
 * full·empty 쌍이 잇는 multi-stage pipeline 의 mechanism 을 소유한다.
 * Stage 수를 shared memory 예산에서 정하는 산수는 /gpu/cutlass-collectives-and-tile-schedulers#pipeline-stages 가,
 * Hopper 의 TMA·cluster 개요는 /gpu/gpu-arch-hopper#tma 가 소유한다.
 */
export default function WarpSpecializationAndAsyncPipelinesArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="warp-specialization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Warp specialization 은 warp 를 producer 와 consumer 로 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Warp specialization 은 한 threadblock 안의 warp 에 서로 다른 역할을 주는 kernel 구조입니다. Producer warp 는 global
            memory 에서 shared memory 로 tile 을 옮기는 일만 하고 consumer warp 는 shared memory 의 tile 로 계산만 합니다. 두 역할은
            같은 kernel 코드 안에서 warp 번호로 갈라집니다.
          </p>
          <p>
            나누는 이유는 한 warp 가 load 와 계산을 번갈아 하면 둘 중 하나가 늘 기다리기 때문입니다. Load 를 낸 warp 가 그 결과로 계산하려면 데이터가 도착할 때까지
            멈추고 그 사이 tensor core 는 놉니다. 역할을 나누면 producer 는 다음 tile 을 계속 요청하고 consumer 는 이미 도착한 tile 을 계속
            계산합니다.
          </p>
          <p>
            Hopper 의 CUTLASS 3.x GEMM 은 threadblock 을 384 thread, 곧 warpgroup 3개로 잡습니다. Warpgroup 0 이
            producer, 1 과 2 가 consumer 입니다. Producer 128 thread 가운데 실제로 TMA 명령을 내는 것은 thread 하나뿐이고 나머지는
            register 를 반납하고 대기합니다.
          </p>
          <p>
            Register 반납이 이 구조를 완성합니다. SM 의 register 는 65,536개이고 384 thread 가
            균등하게 나누면 thread 당 170개입니다. <code>setmaxnreg</code> 로 producer 를 thread 당
            40개로 줄이고 consumer 를 232개로 늘리면 40×128 + 232×256 = 64,512개로 예산 안에 들어
            consumer 가 큰 accumulator 를 register 에 둘 수 있습니다.
          </p>
          <p>
            이 글은 producer 가 쓰는 두 가지 asynchronous copy, consumer 가 내는 warpgroup MMA,
            둘 사이의 stage ring 과 mbarrier 손잡이, 그리고 이 모든 것이 하나의 software
            pipelining 이라는 점을 차례로 봅니다. 앞 글{" "}
            <Link to="/gpu/gpu-arch-hopper#tma">Hopper 의 TMA producer–consumer 개요</Link> 가
            그림 한 장으로 말한 것을 명령 단위로 내려갑니다.
          </p>
        </div>
        <TermBreakdown
          title="Producer 와 consumer 가 각각 소유하는 일"
          description="같은 kernel 코드 안에서 warpgroup 번호로 갈라지며, 둘은 shared memory stage 와 mbarrier 로만 만납니다."
          items={[
            { term: "Producer warp", description: "Global memory 의 A·B tile 을 shared memory 의 빈 stage 로 옮기는 요청을 냅니다. 계산은 하지 않습니다.", example: "CUTLASS sm90 kernel 의 warpgroup 0. 그 중 thread 하나가 TMA 명령 2개로 32 KB stage 하나를 채웁니다.", boundary: "빈 stage 가 없으면 empty barrier 에서 멈춥니다. 앞서 낼 수 있는 tile 수는 stage 수가 정합니다." },
            { term: "Consumer warp", description: "도착한 stage 를 읽어 tensor core 명령을 내고 accumulator 를 register 에 쌓습니다.", example: "Warpgroup 1·2 가 각각 64×128 accumulator 를 thread 당 fp32 64개로 듭니다.", boundary: "Full barrier 가 뒤집히기 전에는 읽지 못하며, 다 읽은 뒤 empty barrier 에 도착해야 producer 가 그 자리를 다시 씁니다." },
            { term: "Specialized warp pipeline", description: "Producer 가 S−1 개 tile 을 앞서 요청하고 consumer 가 뒤따르는 구조 전체입니다.", example: "Stage 4 면 producer 는 consumer 보다 최대 3 tile 앞서 갑니다.", boundary: "K 방향 tile 수가 stage 수보다 적으면 앞설 것이 없어 이득이 사라집니다." },
          ]}
        />
        <ContentBoundary article="warp-specialization-and-async-pipelines" />
      </section>

      <section id="async-copy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          cp.async 와 TMA 는 register 를 거치지 않고 shared memory 를 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Asynchronous copy 는 명령을 낸 thread 가 데이터 도착을 기다리지 않고 다음 명령으로 넘어가는 memory 이동입니다. 보통의 load 는 global 값을
            register 에 받은 뒤 다시 shared memory 에 store 해야 하므로 thread 가 두 번 개입하고 register 도 씁니다. Asynchronous
            copy 는 global 에서 shared memory 로 바로 갑니다. 완료는 별도 장치가 알립니다.
          </p>
          <p>
            Ampere 부터 있는 <code>cp.async</code> 는 thread 하나가 4·8·16 B 를 옮기는 명령입니다.
            명령들을 <code>cp.async.commit_group</code> 으로 묶고 <code>cp.async.wait_group N</code> 으로
            가장 오래된 묶음까지의 완료를 기다립니다. 128 thread 가 16 B 씩 내면 한 번에 2 KB
            이므로 32 KB stage 하나에 thread 당 16번, 합쳐 2,048번의 명령과 그만큼의 주소 계산이
            듭니다.
          </p>
          <p>
            Hopper 의 TMA(Tensor Memory Accelerator)는 이 주소 계산을 hardware 로 옮깁니다.
            Host 가 <code>cuTensorMapEncodeTiled</code> 로 128 B 짜리 tensor map 을 만들어 두면
            device 의 thread 하나가 <code>cp.async.bulk.tensor</code> 한 명령으로 그 map 이 가리키는
            tensor 의 box 하나를 통째로 옮깁니다.
          </p>
          <p>
            Tensor map 이 곧 TMA descriptor 로, 원소 형식, 1~5 차원의 크기와 stride, 한 번에 옮길 box 의 각 차원 크기(차원당 256 이하),
            swizzle 방식, 경계 밖 채움값을 담습니다. 128×64 bf16 box 는 16 KB 이므로 A·B 한 stage 32 KB 가 명령 2개입니다. cp.async 의
            2,048번과 비교하면 producer 가 낼 명령이 천 분의 일로 줄어 warp 하나로 충분해집니다.
          </p>
          <p>
            TMA 는 async proxy 라는 별도 경로로 memory 에 접근합니다. 일반 thread 의 store 와
            TMA 의 read 는 같은 shared memory 를 보더라도 순서가 보장되지 않으므로, thread 가 쓴
            값을 TMA 가 읽게 하려면 <code>fence.proxy.async</code> 를 사이에 둡니다. 완료는 mbarrier
            의 transaction byte 로 알리며 그 손잡이는 아래 절에서 봅니다.
          </p>
          <p>
            Swizzle 은 descriptor 에 적은 것과 shared memory 를 읽는 쪽이 같아야 합니다. TMA 가
            128 B swizzle 로 놓은 tile 을 wgmma 의 matrix descriptor 도 같은 모드로 읽어야 하며, 이
            XOR 규칙은 <Link to="/gpu/cutlass-gemm-hierarchy-and-cute-layouts#swizzle">swizzled layout</Link> 에
            있습니다.
          </p>
        </div>
        <TermBreakdown
          title="두 asynchronous copy 의 발행 단위와 완료 통지"
          items={[
            { term: "cp.async", description: "Thread 당 4·8·16 B 를 global 에서 shared memory 로 register 없이 옮기는 Ampere 이후 명령입니다.", example: "32 KB stage: 128 thread × 16 B × 16번. 완료는 commit_group·wait_group 으로 thread 자신이 셉니다.", boundary: "주소는 thread 가 계산하므로 명령 수와 주소 계산이 tile 크기에 비례합니다." },
            { term: "TMA (cp.async.bulk.tensor)", description: "Thread 하나가 tensor map 의 box 하나를 통째로 옮기는 Hopper 명령입니다.", example: "128×64 bf16 box 16 KB 가 명령 하나. 완료는 mbarrier 의 expect_tx 와 complete_tx 로 byte 수를 셉니다.", boundary: "Tensor map 은 host 에서 만들며 box 차원당 256 원소, 주소·stride 16 B 정렬이 필요합니다." },
            { term: "TMA descriptor (tensor map)", description: "Tensor 의 형식·차원·stride·box·swizzle·경계 채움을 담은 128 B 객체입니다.", example: "4096×4096 bf16 행렬에 box (64,128), swizzle 128B 를 적은 map 하나로 mainloop 전체의 A tile 을 옮깁니다.", boundary: "Kernel 인자(__grid_constant__)나 constant memory 로 넘기며 global 에 두면 fence 가 더 필요합니다." },
          ]}
        />
      </section>

      <section id="warpgroup-wgmma" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Warpgroup 4개 warp 가 wgmma 한 명령을 shared memory 에서 냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Warpgroup 은 warp 번호가 4 의 배수에서 시작하는 연속한 warp 4개, 곧 128 thread 의
            묶음입니다. Hopper 의 tensor core 명령 <code>wgmma.mma_async</code> 는 이 128 thread 가
            함께 발행하며, Ampere 의 <code>mma.sync</code> 가 warp 하나로 16×8 을 계산하던 것을
            64×N 으로 키웁니다. N 은 8 부터 256 까지 8 단위입니다.
          </p>
          <p>
            wgmma 의 다른 점은 A·B 를 register fragment 가 아니라 shared memory 에서 직접 읽는
            것입니다. 명령은 matrix descriptor 로 shared memory 의 위치와 swizzle 을 받고, 결과
            accumulator 만 register 에 둡니다. 그래서 consumer 는 stage 가 도착하면{" "}
            <code>ldmatrix</code> 없이 바로 명령을 낼 수 있습니다.
          </p>
          <p>
            숫자를 넣어 봅니다. Threadblock tile 128×128×64 를 consumer warpgroup 2개가 64×128 씩
            나누면, K 16 짜리 <code>wgmma.m64n128k16</code> 을 stage 하나에 4번 냅니다. 64×128 fp32
            accumulator 8,192개는 128 thread 가 64개씩 듭니다. 앞 절의 232 register 예산 안에서
            tile 을 128×256 으로 키우면 accumulator 만 128개가 됩니다.
          </p>
          <p>
            이름의 async 는 명령이 발행 직후 돌아온다는 뜻입니다. <code>wgmma.fence</code> 로
            register 와 shared memory 의 앞선 접근을 정리하고, 여러 wgmma 를{" "}
            <code>wgmma.commit_group</code> 으로 묶은 뒤 <code>wgmma.wait_group N</code> 으로 N 개
            묶음만 남기고 완료를 기다립니다. CUTLASS 는 묶음 하나를 남겨 두어 다음 stage 의 wgmma
            발행이 이전 stage 의 계산과 겹치게 합니다.
          </p>
          <p>
            Fragment 규칙이 register 에서 사라진 것은 아닙니다. Accumulator 는 여전히 thread 마다
            정해진 자리에 흩어지며, 그 규칙은{" "}
            <Link to="/gpu/cutlass-gemm-hierarchy-and-cute-layouts#tile-hierarchy">tensor core MMA 명령의 fragment</Link> 와
            같은 방식으로 PTX ISA 가 고정합니다.
          </p>
        </div>
      </section>

      <section id="stage-pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stage 수는 load 지연을 compute 시간으로 나눈 몫에 1 을 더한 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multi-stage pipeline 은 shared memory 를 같은 크기의 stage S 개로 나누고 ring 처럼 돌려 쓰는 구조입니다. Producer 는 stage
            0, 1, 2 를 차례로 채우고 S−1 을 지나면 다시 0 으로 돌아오며 consumer 는 그 뒤를 같은 순서로 따라갑니다. Stage 2개가 double buffering,
            3개가 triple buffering 이고, S 개로 일반화한 것이 이 pipeline 입니다.
          </p>
          <p>
            Tile 하나의 load 가 L 만큼 걸리고 계산이 C 만큼 걸리면 consumer 가 한 tile 을 계산하는 동안 producer 는 L/C 개 tile 의 load 를
            날려 두어야 다음 tile 이 제때 도착합니다. 그 tile 들과 지금 계산 중인 tile 을 합쳐 S 는 ⌈L/C⌉ + 1 이상이어야 합니다. Stage 수를 정하는 산수는
            이게 전부입니다.
          </p>
          <p>
            128×128×64 bf16 tile 의 계산은 2×128×128×64 ≈ 2.1 MFLOP 이고, H100 의 dense bf16 989 TFLOP/s 를 SM 132개로
            나눈 SM 당 7.5 TFLOP/s 로는 약 0.3 µs 입니다. Load 지연을 HBM 왕복과 전송을 합쳐 1.2 µs 로 잡으면 S ≥ ⌈4⌉ + 1 = 5 이고 stage
            당 32 KB 이므로 160 KB 입니다. 이 값은 계산으로 낸 산수입니다. 측정한 값이 아닙니다.
          </p>
          <p>
            Shared memory 가 상한입니다. H100 은 threadblock 당 227 KB 까지 허용하므로 32 KB
            stage 는 7개가 최대이며, epilogue 와 barrier 몫을 빼면 그보다 적습니다. 예산에서
            stage 수를 거꾸로 구하는 <code>StageCountAutoCarveout</code> 의 산수는{" "}
            <Link to="/gpu/cutlass-collectives-and-tile-schedulers#pipeline-stages">pipeline stage 수와 shared memory 예산</Link> 에
            있습니다.
          </p>
          <p>
            Stage 를 늘려도 이득이 멈추는 지점이 있습니다. L 이 C 보다 작아지면 S = 2 로 충분하고 K 방향 tile 수가 S 보다 적으면 ring 이 한 바퀴도 돌지
            못합니다. 아래 Viz 는 stage 4 ring 이 채워지고 소비되는 한 바퀴를 보여 줍니다.
          </p>
        </div>
        <WarpSpecializationAndAsyncPipelinesViz />
        <ExplainedFormula
          question="Load 지연을 완전히 숨기려면 shared memory stage 가 몇 개 필요한가요?"
          idea="Consumer 가 tile 하나를 계산하는 C 동안 producer 가 미리 날려 둔 load 가 L 을 채워야 합니다. L/C 개의 tile 이 날아가는 중이어야 하고, 계산 중인 tile 하나의 자리가 더 필요합니다."
          formula={String.raw`\begin{aligned}
S &\ge \left\lceil \frac{L}{C} \right\rceil + 1 \\
\text{smem} &= S \cdot (B_A + B_B)
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
S &\ge \underbrace{\left\lceil \frac{L}{C} \right\rceil}_{\text{계산 한 번 동안 날아가야 할 tile 수}} + \underbrace{1}_{\text{지금 계산 중인 stage}} \\
\text{smem} &= \underbrace{S}_{\text{stage 수}} \cdot \underbrace{(B_A + B_B)}_{\text{stage 한 벌의 bytes}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\left\lceil L / C \right\rceil`, annotation: ["Load 지연을 계산 시간으로 나눠 올림", "L 1.2 µs, C 0.3 µs 면 4"] },
            { expression: String.raw`+\,1`, annotation: ["Consumer 가 읽는 중인 stage 는 producer 가 덮어쓸 수 없어", "그 자리를 하나 더 셉니다"] },
            { expression: String.raw`S \cdot (B_A + B_B)`, annotation: ["Stage 마다 A·B tile 한 벌씩", "5 × 32 KB = 160 KB"] },
          ]}
          terms={[
            { symbol: "L", name: "Load latency", description: "TMA 또는 cp.async 를 낸 뒤 stage 가 다 채워질 때까지의 시간입니다. HBM 왕복 지연과 전송 시간을 합칩니다." },
            { symbol: "C", name: "Compute time", description: "Consumer 가 stage 하나로 wgmma 를 모두 끝내는 시간입니다." },
            { symbol: "S", name: "Stage count", description: "Shared memory ring 의 칸 수입니다. 2 면 double buffering, 3 이면 triple buffering 입니다." },
            { symbol: String.raw`B_A, B_B`, name: "Tile bytes", description: "Stage 하나에 들어가는 A·B tile 의 bytes 입니다. 128×64 bf16 이면 각 16 KB 입니다." },
          ]}
          assumptions={["L 과 C 가 tile 마다 일정하고 producer 가 빈 stage 를 얻는 즉시 load 를 낸다고 가정합니다.", "HBM 대역폭이 포화되면 L 이 길어져 S 를 늘려도 숨겨지지 않습니다. 이때는 memory-bound 이며 stage 가 아니라 traffic 을 줄여야 합니다."]}
          interpretation="식은 지연을 숨기는 데 필요한 최소 stage 를 주지만, S 를 그 이상 키워도 처리량은 오르지 않고 shared memory 만 먹습니다. 예산 안에서 ⌈L/C⌉+1 근처를 고르고 나머지는 tile 크기나 occupancy 에 씁니다."
        />
      </section>

      <section id="mbarrier-handshake" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          mbarrier 의 full 과 empty 쌍이 producer 와 consumer 를 잇습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Ring 의 각 stage 에는 mbarrier 두 개가 붙습니다. Full barrier 는 데이터가 다 도착했음을 consumer 에게 알리고 empty barrier 는
            consumer 가 다 읽었음을 producer 에게 알립니다. mbarrier 는 shared memory 에 놓인 64 bit 객체로, 도착 횟수와 기다리는 byte 수를
            세다가 둘 다 채워지면 phase 가 뒤집힙니다.
          </p>
          <p>
            TMA 와 짝을 이루는 것이 transaction byte 입니다. Producer thread 는 full barrier 에{" "}
            <code>expect_tx 32768</code> 로 도착하며 32 KB 가 올 것이라고 적고, TMA hardware 는 copy 를
            끝낼 때마다 옮긴 byte 만큼 <code>complete_tx</code> 로 차감합니다.
          </p>
          <p>
            도착 수와 byte 가 모두 0 이 되는 순간 phase 가 바뀌고, <code>try_wait.parity</code> 로
            그 phase 를 기다리던 consumer 가 풀립니다.
          </p>
          <p>
            Phase 는 ring 이 한 바퀴 돌 때마다 0 과 1 을 오갑니다. Consumer 가 stage 2 를 두 번째 방문했을 때 첫 번째 방문의 완료를 보고 착각하지 않으려면
            어느 phase 를 기다리는지 함께 들고 다녀야 합니다. CUTLASS 의 pipeline state 가 stage index 와 phase bit 를 이 목적으로 묶습니다.
          </p>
          <p>
            같은 손잡이가 cp.async 에도 있습니다. <code>cp.async.mbarrier.arrive</code> 는 그 thread 의
            앞선 cp.async 가 모두 끝났을 때 barrier 에 도착하게 하므로, 128 thread 가 각자 낸 copy 를
            barrier 하나가 모읍니다. Block 전체를 세우는 <code>__syncthreads</code> 와 달리 mbarrier 는
            참여하는 warp 만 세우며, 그 범위의 정의는{" "}
            <Link to="/gpu/cuda-sync-streams#overview">synchronization scope</Link> 에 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Warp-specialized mainloop 의 producer·consumer 루프 (stage S, k-tile T 개)"
          input={["full[0..S), empty[0..S): stage 마다 mbarrier 한 쌍. full 은 도착 1 + transaction byte, empty 는 consumer warp 수만큼의 도착으로 초기화", "tmap_A, tmap_B: host 가 만든 TMA descriptor", "smem_A[S], smem_B[S]: stage 당 16 KB 씩 두 ring", "write = (stage 0, phase 0), read = (stage 0, phase 0): producer·consumer 의 pipeline state"]}
          steps={[
            { code: "producer (thread 0 of warpgroup 0):  setmaxnreg.dec 40", note: "계산하지 않는 warpgroup 은 register 를 pool 에 돌려주고 consumer 가 가져갑니다." },
            { code: "  for k in 0..T:  wait(empty[write.stage], write.phase ^ 1)", note: "첫 바퀴는 empty 가 초기 상태라 바로 통과하고, 둘째 바퀴부터는 consumer 가 그 stage 를 놓아줄 때까지 멈춥니다." },
            { code: "    arrive.expect_tx(full[write.stage], 32768)", note: "이 stage 에 32 KB 가 올 것이라고 barrier 에 적습니다. 도착 하나와 byte 수가 함께 세어집니다." },
            { code: "    cp.async.bulk.tensor.2d smem_A[write.stage] ← tmap_A[k], full[write.stage]", note: "명령 하나가 128×64 box 16 KB 를 옮기고 끝나면 complete_tx 로 barrier 의 byte 를 차감합니다." },
            { code: "    cp.async.bulk.tensor.2d smem_B[write.stage] ← tmap_B[k], full[write.stage];  write++", note: "B 도 같습니다. write 가 S−1 을 넘으면 stage 0 으로 돌아오며 phase 가 뒤집힙니다." },
            { code: "consumer (warpgroup 1·2):  setmaxnreg.inc 232", note: "Producer 가 반납한 register 로 64×128 accumulator 와 여유분을 확보합니다." },
            { code: "  for k in 0..T:  wait(full[read.stage], read.phase)", note: "도착 1 과 32 KB 가 모두 채워져 phase 가 뒤집힐 때까지 기다립니다." },
            { code: "    wgmma.fence;  4 × wgmma.m64n128k16 (smem_A[read.stage], smem_B[read.stage]) → acc;  wgmma.commit_group", note: "Shared memory 를 descriptor 로 직접 읽으며 발행 직후 돌아옵니다." },
            { code: "    wgmma.wait_group 1;  arrive(empty[prev.stage]);  read++", note: "직전 stage 의 wgmma 가 끝난 것이 확인되면 그 stage 를 producer 에게 돌려줍니다. 방금 낸 묶음은 다음 반복과 겹칩니다." },
          ]}
          repeatUntil="k 가 T 에 닿으면 producer 는 마지막 stage 들이 소비될 때까지 empty 를 기다린 뒤 끝내고(producer_tail), consumer 는 wait_group 0 으로 남은 wgmma 를 모두 끝낸 뒤 epilogue 로 갑니다."
          output="Consumer warpgroup 마다 64×128 fp32 accumulator. Global 읽기 지연은 S−1 개 stage 뒤로 숨어 consumer 는 full barrier 에서 거의 멈추지 않습니다."
        />
      </section>

      <section id="software-pipelining" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Software pipelining 은 지연을 한 번만 내고 tile 수로 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            지금까지의 구조를 한 단어로 부르면 software pipelining 입니다. 반복문의 i 번째 load 와 i−1 번째 계산을 같은 반복에 놓아 서로 다른 반복의 일이
            동시에 진행되게 하는 compiler 기법이며 GPU kernel 에서는 stage ring 과 barrier 로 손으로 씁니다. Load 를 register 로 받아 두는
            Ampere 방식과 shared memory 로 받는 Hopper 방식이 같은 원리입니다.
          </p>
          <p>
            효과는 latency amortization 으로 읽힙니다. Tile T 개를 순서대로 처리하면 시간은 T×(L + C) 이지만 pipeline 이 차면 첫 tile 의 L 만
            드러나고 나머지는 max(L, C) 씩 갑니다. T = 64, L = 1.2 µs, C = 0.3 µs 면 96 µs 가 1.2 + 64×1.2 ≈ 78 µs 로 줄어듭니다.
            여기서 남은 병목은 L 이므로 HBM traffic 을 줄이는 쪽으로 넘어가야 합니다.
          </p>
          <p>
            같은 원리를 consumer 끼리 적용한 것이 CUTLASS 의 ping-pong schedule 입니다. Consumer warpgroup 두 개가 서로 다른 output
            tile 을 맡고 한쪽이 mainloop 의 wgmma 를 내는 동안 다른 쪽이 epilogue 를 하도록 ordered barrier 로 차례를 강제합니다. Tensor
            core 와 epilogue 의 memory store 가 다른 자원이므로 둘이 겹칩니다.
          </p>
          <p>
            FlashAttention-3 는 이 ping-pong 을 attention 에 옮겼습니다. Warpgroup 1 의 GEMM 이 먼저 잡히도록 named barrier 로
            순서를 정하면 그 사이 warpgroup 2 는 softmax 의 exp 를 계산합니다.
          </p>
          <p>
            Tensor core 와 multi-function unit 이 다른 pipe 이므로 둘이 겹칩니다. 저자들은 H100 FP16 forward 에서 740 TFLOP/s, 곧
            peak 989 의 75% 를 자기보고했습니다.
          </p>
          <p>
            한계도 같은 자리에 있습니다. Pipelining 은 서로 다른 자원의 일을 겹칠 뿐 한 자원의
            총량을 줄이지 않으므로, HBM 이 이미 포화인 kernel 에서는 stage 를 늘려도 max(L, C) 의
            L 이 그대로 남습니다. 그 다음 단계인 traffic 자체를 줄이는 방법은{" "}
            <Link to="/gpu/gpu-data-movement-optimization">data movement 최적화</Link> 로 이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="같은 원리의 세 이름"
          description="모두 서로 다른 반복 또는 서로 다른 warp 의 일을 한 시점에 겹치는 장치이며, 겹치는 대상이 다릅니다."
          items={[
            { term: "Software pipelining", description: "반복 i 의 load 와 반복 i−1 의 계산을 같은 시점에 놓는 loop 변환입니다.", example: "Ampere GEMM: 다음 k-tile 의 cp.async 를 낸 뒤 현재 k-tile 의 mma.sync 를 냅니다.", boundary: "Load 와 계산이 같은 warp 에 있으면 warp 가 wait 에서 멈추는 순간 둘 다 멈춥니다." },
            { term: "Latency amortization", description: "L 을 tile 마다 내지 않고 pipeline 을 채우는 첫 한 번만 내는 효과입니다.", example: "T 64: 64×(1.2+0.3) = 96 µs → 1.2 + 64×1.2 ≈ 78 µs.", boundary: "T 가 S 보다 작으면 채우는 비용이 전체와 비슷해 amortize 되지 않습니다." },
            { term: "Warp specialization", description: "Load 를 내는 warp 와 계산하는 warp 를 나눠 한쪽의 wait 가 다른 쪽을 멈추지 않게 하는 구조입니다.", example: "Hopper GEMM: warpgroup 0 이 TMA, 1·2 가 wgmma. Ping-pong 은 1·2 의 mainloop 과 epilogue 까지 엇갈립니다.", boundary: "역할을 나누면 producer 가 쓰지 않는 register 를 반납해야 consumer 예산이 나옵니다." },
          ]}
        />
        <ProgressiveDetail
          title="Ampere 의 cp.async 방식과 Hopper 의 TMA 방식은 무엇이 같고 무엇이 다른가요?"
          preview="둘 다 S 개 stage ring 위의 software pipelining 이지만, Ampere 는 모든 thread 가 producer 이자 consumer 이고 완료를 wait_group 으로 세며, Hopper 는 warp 를 나누고 완료를 mbarrier 의 byte 로 셉니다."
        >
          <p>
            Ampere 의 CUTLASS 2.x mainloop 은 128 thread 전원이 cp.async 를 내고, 같은 thread 들이{" "}
            <code>cp_async_wait&lt;S−2&gt;</code> 와 <code>__syncthreads</code> 뒤에 ldmatrix 와 mma.sync 를
            냅니다. 지연은 stage 로 숨지만 wait 에 걸린 warp 는 계산도 멈추므로, 다른 threadblock
            의 warp 가 SM 에 함께 있어야 빈 issue slot 을 채웁니다.
          </p>
          <p>
            Hopper 의 3.x mainloop 은 producer 하나가 TMA 를 내고 consumer 가 wgmma 를 내므로 wait 가 한쪽에만 걸립니다. Threadblock
            하나가 SM 을 독점해도 pipeline 이 돌기 때문에 shared memory 를 stage 에 더 쓸 수 있고 그 대신 mbarrier 초기화와 phase 관리가 코드에
            드러납니다.
          </p>
          <p>
            두 방식의 코드 경로는 <code>sm80_mma_multistage.hpp</code> 와{" "}
            <code>sm90_mma_tma_gmma_ss_warpspecialized.hpp</code> 에 있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 PTX ISA 와 CUDA 문서, CUTLASS 소스와 FlashAttention-3 입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            cp.async 의 크기, cp.async.bulk.tensor 의 차원과 단일 thread 발행, warpgroup 의 정의와
            wgmma 의 모양, mbarrier 의 expect_tx·phase, setmaxnreg 의 24~256 범위는 PTX ISA 에서
            읽었습니다. Tensor map 의 128 B 크기와 box 차원당 256 상한, 16 B 정렬은 CUDA driver API
            와 programming guide 의 TMA 절에서 가져왔습니다.
          </p>
          <p>
            Producer·consumer warpgroup 의 역할 배정, 40·232 register 값, ping-pong 의 ordered
            barrier 는 CUTLASS main branch 소스에서 읽은 것이며 2026년 8월 기준입니다. 이 글의
            0.3 µs·1.2 µs·5 stage 는 그 구조에 H100 공개 사양을 넣어 계산한 산수이지 측정이
            아닙니다.
          </p>
          <p>
            FlashAttention-3 의 740 TFLOP/s 는 논문의 저자 자기보고입니다. 이 글은 producer·consumer
            와 ping-pong 의 구조만 가져오고 속도 수치를 다른 kernel 로 일반화하지 않습니다.
          </p>
        </div>
        <div id="paper-ptx-isa-async" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · PTX ISA · cp.async, cp.async.bulk.tensor, wgmma.mma_async, mbarrier, setmaxnreg"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/parallel-thread-execution/index.html"
          >
            cp.async 의 cp-size 4·8·16, cp.async.bulk 계열의 async proxy 와 mbarrier complete_tx
            완료, warpgroup 이 연속한 warp 4개라는 정의, wgmma.m64nNk16 의 N 8~256, setmaxnreg
            의 24~256 범위와 warpgroup 단위 실행 조건을 이 문서에서 읽었습니다.
          </CitationBlock>
        </div>
        <div id="paper-cuda-tma-guide" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Programming Guide · Asynchronous Data Copies using TMA · cuTensorMapEncodeTiled (Driver API)"
            citeKey={2}
            href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html"
          >
            Thread 하나가 bulk copy 를 내고 expect_tx 로 byte 수를 적는 절차, fence.proxy.async 가
            필요한 이유, 1차원 bulk copy 의 16 B 배수 조건, tensor map 을 만드는 driver API 와 그
            rank 1~5·box 256·128 B 객체 조건이 여기 있습니다.
          </CitationBlock>
        </div>
        <div id="source-cutlass-warpspecialized" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA/cutlass · pingpong·warpspecialized mainloop · pipeline.md"
            citeKey={3}
            href="https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/kernel/sm90_gemm_tma_warpspecialized_pingpong.hpp"
            type="code"
          >
            384 thread 를 producer 1·consumer 2 warpgroup 으로 나누는 WarpGroupRole, 40·232 (heavy
            pressure 시 24·240) register 값, OrderedSequenceBarrier 로 엇갈리는 ping-pong, mainloop 의
            producer_acquire → TMA → consumer_wait → wgmma → consumer_release 경로를 읽었습니다.
          </CitationBlock>
        </div>
        <div id="paper-flashattention-3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao · FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision (arXiv 2407.08608, 2024)"
            citeKey={4}
            href="https://arxiv.org/abs/2407.08608"
          >
            Producer warpgroup 이 TMA 를, consumer warpgroup 이 wgmma 를 맡는 warp specialization 과
            두 consumer 의 GEMM·softmax 를 엇갈리는 ping-pong 을 attention 에 적용했습니다. H100 FP16
            740 TFLOP/s 는 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/gpu-data-movement-optimization">Data movement 최적화: global→shared→register 경로와 overlap</Link>,
          그리고 stage 수를 예산에서 정하는 <Link to="/gpu/cutlass-collectives-and-tile-schedulers#pipeline-stages">CUTLASS pipeline stage</Link>.
        </p>
      </section>
    </div>
  );
}
