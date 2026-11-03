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
          Data movement 최적화는 옮길 byte를 줄이고 남은 이동을 겹칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg font-semibold leading-8">
            한 문장으로 말하면, data movement 최적화는 같은 계산을 하면서
            옮기는 byte를 줄이고, 꼭 옮겨야 할 byte는 계산 뒤에 숨기는 일입니다.
          </p>
          <p className="leading-7">
            GPU kernel의 데이터는 global memory에서 shared memory로, 다시
            register로 내려와 계산되고 같은 길을 되돌아 올라갑니다. 이 글은
            같은 tile 하나를 끝까지 따라가며 byte 절감과 overlap이라는 두
            손잡이가 각각 어디에서 작동하는지 봅니다.
          </p>
          <p>
            층마다 공급 방식이 다르기 때문입니다. 이 글의 H100 SXM 예에서
            HBM3 상한은 3.35 TB/s입니다. Shared memory는 bank conflict가 없는
            이상 조건에서 SM당 clock마다 128 B를 공급할 수 있습니다. Register는
            제품 사양의 TB/s로 비교하는 별도 memory tier가 아니라 instruction의
            operand가 놓이는 곳이므로 같은 방식으로 대역폭을 나누지 않습니다.
          </p>
          <p>
            같은 tile을 세 층에서 따라가 봅니다. 128×32 fp16 tile은
            8 KiB입니다. Chip 전체 HBM 상한을 132개 SM에 똑같이 나눈 단순
            장부에서는 SM 하나의 몫이 약 25.4 GB/s라서 8 KiB에 약 0.32 µs가
            걸립니다. Shared memory의 128 B/clock과 1.7 GHz를 이상적으로
            계속 유지하면 같은 8 KiB는 약 37.6 ns입니다. 둘 다 측정값이 아니라
            어느 층부터 의심할지 정하는 상한 계산입니다.
          </p>
          <p>
            그래서 최적화의 순서가 정해집니다. 먼저 가장 느린 global 층의 byte 를 줄이고, 다음으로
            shared memory 의 명령 수를 줄이며, 마지막으로 남은 global 이동을 계산 뒤에 숨깁니다.
            어느 층이 병목인지 판정하는 arithmetic intensity 와 ridge point 는{" "}
            <Link to="/cs/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">roofline 글</Link> 이
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
          title="세 층 사이 이동의 단위와 비용 (128×32 fp16 tile, 8 KiB)"
          description="한 tile이 내려오는 길을 층마다 명령 수와 시간으로 셉니다. 시간은 H100 공개 사양에서 구한 이상적 상한입니다."
          items={[
            { term: "Global → shared", description: "Threadblock 전체가 한 번 옮기고 모든 warp가 다시 읽는 층입니다.", example: "cp.async 16 B를 128 thread가 내면 thread당 4번, TMA tensor copy면 box 하나를 한 번 발행합니다. 단순 SM 몫으로 약 0.32 µs입니다.", boundary: "3.35 TB/s는 chip 전체 상한이고 SM별로 고정 배분되지 않습니다. 실제 시간은 profiler로 확인합니다." },
            { term: "Shared → register", description: "Warp마다 자기 fragment만 올리는 층입니다.", example: "Warp의 64×32 조각 4 KiB는 ldmatrix.x4 8번입니다. Conflict-free 128 B/clock 상한이면 8 KiB에 약 37.6 ns입니다.", boundary: "Bank conflict가 나면 한 명령이 여러 wave로 나뉘어 상한에 도달하지 못합니다." },
            { term: "Register → register", description: "층을 내려가지 않고 같은 thread의 register 안에서 다음 연산으로 넘기는 경로입니다.", example: "wgmma의 accumulator에 bias와 GELU를 적용하고 한 번만 store합니다.", boundary: "Register 사용량이 커지면 occupancy가 줄고, compiler가 spill하면 local memory traffic이 생깁니다." },
          ]}
        />
        <GpuDataMovementOptimizationViz />
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
            반복마다 8 KiB 두 벌이 16 KiB 대신 32 KiB가 되는 차이입니다.
          </p>
          <p>
            둘째 이득은 접근 순서의 재배열입니다. Global 은 warp 의 32 lane 이 연속한 128 B 를 읽을
            때 transaction 이 가장 적고, 계산이 원하는 순서는 그와 다를 때가 많습니다. Staging 은
            global 을 연속 순서로 읽고 shared memory 에서 계산 순서로 다시 읽어 둘을 분리합니다.
            연속 접근의 정의는{" "}
            <Link to="/cs/gpu/cuda-shared-memory#coalescing">coalescing</Link> 에 있습니다.
          </p>
          <p>
            이동 자체는 register를 거치지 않는 asynchronous copy가 맡습니다. 8 KiB tile을{" "}
            <code>cp.async</code> 16 B로 옮기면 128 thread가 thread당 4번 내고, Hopper의 TMA는
            32×128 box 를 명령 하나로 옮깁니다. 두 명령의 발행·완료 방식은{" "}
            <Link to="/cs/gpu/warp-specialization-and-async-pipelines#async-copy">앞 글의 asynchronous copy</Link> 가
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
            Warp 하나가 맡는 A의 64×32 fp16 조각은 4 KiB입니다. <code>ld.shared.b32</code>로 lane
            마다 4 B씩 올리면 4 KiB / (32 × 4 B) = 32번이지만 <code>ldmatrix.x4</code>로는 8번입니다.
            Lane 하나가 결국 드는 값은 어느 쪽이든 64 halves, register 32개로 같습니다.
          </p>
          <p>
            Hopper의 <code>wgmma</code> 가운데 A와 B를 모두 shared memory에서
            읽는 SS variant는 이 fragment-load 층을 건너뜁니다. B는 shared
            descriptor에서 읽고, A는 variant에 따라 shared descriptor 또는
            register fragment를 사용합니다. Accumulator C·D는 register에 남습니다.
            Shared operand를 쓸 때는 배치가 descriptor의 swizzle과 맞아야 하며, 그 규칙은{" "}
            <Link to="/cs/gpu/cutlass-gemm-hierarchy-and-cute-layouts#swizzle">swizzled layout</Link> 이
            소유합니다.
          </p>
          <p>
            Bank conflict 는 이 층의 숨은 비용입니다. ldmatrix 가 읽는 8개 행이 같은 bank 에
            놓이면 명령 하나가 8 clock 에 걸쳐 실행되어 명령 수를 줄인 이득이 사라집니다. Bank
            의 정의는 <Link to="/cs/gpu/cuda-shared-memory#bank-conflict">shared memory bank conflict</Link> 에
            있습니다.
          </p>
        </div>
      </section>

      <section id="round-trip" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Global round trip을 없애면 traffic이 160 MiB에서 32 MiB로 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Global memory round trip 은 한 kernel 이 결과를 HBM 에 쓰고 다음 kernel 이 그것을 다시 읽는 왕복입니다. 중간 결과가 register 나
            shared memory 에 있는 동안 다음 연산을 이어 붙이면 이 왕복이 사라지며 이것을 memory traffic elimination 이라 부릅니다. 계산은 그대로이고
            byte 만 줄어듭니다.
          </p>
          <p>
            GEMM 뒤에 bias 와 GELU 가 오는 경우를 셉니다. M = N = K = 4096, bf16 이면 출력 C 는
            32 MiB입니다. 세 kernel로 나누면 GEMM이 C를 쓰고(32), bias
            kernel이 읽고 쓰고(64), GELU kernel이 읽고 쓰므로(64) 출력 쪽
            traffic은 160 MiB입니다.
          </p>
          <p>
            Epilogue에 bias와 GELU를 넣으면 accumulator가 register에 있는 동안
            두 연산이 적용되고 store는 한 번, 32 MiB입니다. HBM 3.35 TB/s
            상한으로 160 MiB는 약 50.1 µs, 32 MiB는 약 10.0 µs입니다.
            GEMM 자체의 137.44 GFLOP을 dense BF16 989 TFLOP/s 상한으로 나누면
            약 139.0 µs입니다. 이 수치는 GELU 계산·launch·cache 효과를 넣지 않은
            병목 방향용 장부입니다.
          </p>
          <p>
            중간값이 register 에서 다음 연산으로 바로 넘어가는 경로를 register-to-register dataflow 라 부릅니다. Fragment 하나에 bias 를 더하고
            GELU 를 계산해 같은 register 에 두는 것이며 Hopper 의 wgmma 는 accumulator 를 register 에 두므로 epilogue 가 그 위에서 바로
            돕니다.
          </p>
          <p>
            한계는 register 와 fusion 범위입니다. 이어 붙일 연산에 이웃 원소가 필요하면
            register 만으로는 안 되고 shared memory 를 거쳐야 하며, reduction 이 끼면 block 경계에서 다시 global 을 써야 합니다. 어디까지 붙일지의 판정은{" "}
            <Link to="/cs/gpu/cuda-kernel-fusion#small-fusion">kernel fusion 의 IO 경계</Link> 와{" "}
            <Link to="/cs/gpu/cuda-kernel-fusion#release-gate">fusion ROI 경계</Link> 가 소유합니다.
          </p>
        </div>
        <TermBreakdown
          title="GEMM + bias + GELU의 출력 traffic (M = N = K = 4096, bf16, C 32 MiB)"
          description="A·B 읽기는 두 경우에 공통이므로 출력 쪽 round trip만 셉니다. MiB와 TB/s의 단위를 먼저 맞춥니다."
          items={[
            { term: "세 kernel", description: "GEMM store, bias load·store, GELU load·store.", example: "32 + 64 + 64 = 160 MiB = 167.77 MB. 3.35 TB/s 상한으로 약 50.1 µs입니다.", boundary: "Kernel launch와 L2 hit, write allocation, 실제 achieved bandwidth는 이 산수에 없습니다." },
            { term: "Epilogue fusion", description: "Accumulator register에 bias·GELU를 적용하고 한 번 store.", example: "32 MiB = 33.55 MB라서 같은 상한으로 약 10.0 µs입니다.", boundary: "GELU 계산과 register pressure가 늘 수 있으므로 40.1 µs가 그대로 end-to-end 절감된다고 단정하지 않습니다." },
          ]}
        />
      </section>

      <section id="prefetching" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Prefetching 은 쓰기 전에 미리 요청해 지연을 앞당깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefetching은 데이터가 필요해지기 전에 요청을 내 실제 사용 시점의
            지연을 앞당기는 기법입니다. Byte를 줄이지는 않습니다. 이 글에서는
            도착을 barrier로 확인하는 shared-memory software pipeline과,
            도착을 보장하지 않는 program-issued L2 cache hint를 구분합니다.
          </p>
          <p>
            Shared-memory software prefetch의 GPU 형태는 다음 tile의 load를 현재 tile의 계산보다 먼저
            내는 것입니다. Tile 하나의 계산 C 동안 load L 을 숨기려면 ⌈L/C⌉ 개 tile 앞서 요청해야
            하며, 그 요청을 register 에 받는 것이 Ampere 의 fragment double buffering, shared
            memory 에 받는 것이{" "}
            <Link to="/cs/gpu/warp-specialization-and-async-pipelines#stage-pipeline">multi-stage pipeline</Link> 입니다.
          </p>
          <p>
            L2 cache prefetch는 목적지 register나 shared memory 없이 cache에
            올려 달라고 요청하는 best-effort hint입니다. PTX의{" "}
            <code>prefetch.global.L2</code>와 Hopper의{" "}
            <code>cp.async.bulk.prefetch.tensor</code>가 이 부류입니다. Tensor map의
            L2 promotion은 별도 기능으로, TMA가 읽을 때 64·128·256 B 단위의
            fetch size hint를 줍니다.
          </p>
          <p>
            이름 때문에 hardware가 접근 패턴을 보고 스스로 요청한다고 오해하면
            안 됩니다. 여기서 다루는 PTX prefetch는 program이 발행하고 cache가
            받아들이지 않을 수도 있는 명시적 hint입니다. GPU는 많은 warp의 요청을
            동시에 띄우는 방식으로도 지연을 숨기며, 그 원리는{" "}
            <Link to="/cs/gpu/sm-warp-scheduling-and-issue#latency-hiding">TLP·ILP·MLP</Link> 에 있습니다.
          </p>
          <p>
            Prefetch 거리가 너무 길면 가져온 데이터가 쓰이기 전에 cache에서
            밀려나고, 너무 짧으면 지연이 그대로 드러납니다. 50 MB L2를 132개
            SM으로 단순히 똑같이 나누면 약 379 KB/SM이지만, 이는 allocation
            보장이 아니라 압박을 가늠하는 예산입니다. Prefetch한 tile이 실제
            사용 시점까지 남는지는 profiler의 hit rate로 확인합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Shared-memory prefetch 거리와 L2 cache hint는 같은 값인가요?"
          preview="Shared memory로 받는 pipeline에서는 stage 수 S가 prefetch 거리 + 1입니다. L2 cache hint는 stage를 쓰지 않지만 도착과 잔류를 보장하지 않습니다."
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
            Tile 하나의 load가 1.2 µs, 계산이 0.8 µs라고 합시다. 순서대로
            하면 tile당 2.0 µs이고 100 tile에 200 µs입니다. 이상적인 2-stage
            pipeline은 첫 load 1.2 µs, 가운데 99구간 × 1.2 µs, 마지막 compute
            0.8 µs가 필요하므로 총 120.8 µs입니다. 정상 구간의 cadence는
            max(1.2, 0.8)=1.2 µs지만 시작과 끝은 숨길 수 없습니다.
          </p>
          <p>
            같은 식을 kernel 전체에 적용하면 roofline과 같은 상한 비교가 됩니다.
            앞 절의 GEMM은 출력 traffic 160 MiB가 약 50.1 µs, GEMM 계산이
            약 139.0 µs입니다. 두 항만 놓으면 겹쳤을 때 약 139.0 µs,
            순서대로일 때 약 189.1 µs입니다. Fusion으로 traffic을 32 MiB,
            약 10.0 µs로 줄여도 완전 overlap 상한은 여전히 계산 항이 지배합니다.
          </p>
          <p>
            Compute–communication overlap 이라는 이름은 같은 원리를 GPU 사이의 이동에 쓴 것입니다.
            NCCL 의 all-reduce 를 다음 layer 의 계산과 겹치는 것이 그 예이며, kernel 안의 tile
            load 를 계산과 겹치는 것과 식이 같습니다. Stream 수준에서 copy engine 과 kernel 을
            겹치는 규칙은 <Link to="/cs/gpu/cuda-sync-streams#streams">CUDA stream ordering</Link> 이
            소유합니다.
          </p>
          <p>
            Overlap 이 성립하려면 이동과 계산이 서로 다른 자원을 써야 합니다. TMA 와 tensor core, copy engine 과 SM 은 다른 자원이라 겹치지만 일반
            load 명령은 warp 의 issue slot 을 계산과 나눠 쓰므로 그만큼 덜 겹칩니다. 아래 Viz 는 세 층 사이를 tile 이 흐르며 겹침이 생기는 순서를 보여
            줍니다. 앞에서 본 Viz의 마지막 장면이 이 시작·정상 구간·마지막
            drain을 한 숫자로 합칩니다.
          </p>
        </div>
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
            { expression: String.raw`\frac{B}{\mathrm{BW}}`, annotation: ["옮길 byte를 같은 단위의 대역폭으로 나눠", "160 MiB = 167.77 MB, 3.35 TB/s에서 약 50.1 µs"] },
            { expression: String.raw`\frac{F}{P}`, annotation: ["FLOP을 peak으로 나눠", "137.44 GFLOP / 989 TFLOP/s ≈ 139.0 µs"] },
            { expression: String.raw`\max(\cdot,\cdot)`, annotation: ["겹치면 긴 쪽이 정상 구간을 지배해", "max(50.1, 139.0) = 139.0 µs, 합이면 189.1 µs"] },
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
            { code: "for s = 0; s < min(S−1, T); s++:  load(s, s)", note: "Prologue. 사용할 S개 slot 가운데 S−1개만 먼저 채웁니다. 마지막 빈 slot이 있어야 loop 첫 회에 다음 tile을 중복 없이 요청할 수 있습니다." },
            { code: "for k in 0..T:  wait(full[k % S])", note: "Tile k 의 도착을 기다립니다. Pipeline 이 차 있으면 이미 도착해 있어 거의 멈추지 않습니다." },
            { code: "  if k + S - 1 < T:  wait(empty[(k+S-1) % S]);  load(k+S-1, (k+S-1) % S)", note: "Tile k를 계산하기 전에 S−1개 뒤의 tile을 요청합니다. Prologue가 S−1개만 채웠으므로 k=0에서도 중복 적재가 없습니다." },
            { code: "  frag = ldmatrix(smem[k % S]);  acc = mma(frag, acc)", note: "Shared memory 에서 fragment 를 올려 계산합니다. wgmma 면 ldmatrix 없이 descriptor 로 읽습니다." },
            { code: "  arrive(empty[k % S])", note: "다 읽은 stage 를 producer 에게 돌려줍니다. 이 도착이 늦으면 load 가 멈춥니다." },
            { code: "  if tile k 가 출력 경계이면:  out_frag = epilogue(acc);  store_async(out_frag);  acc = 0", note: "Bias·activation 을 register 에서 적용하고 store 를 비동기로 냅니다. Store 가 다음 tile 의 계산과 겹칩니다." },
          ]}
          repeatUntil="k 가 T 에 닿으면 남은 store 의 완료를 기다리고 끝냅니다. 정상 상태에서는 load(k+S−1), compute(k), store(k−1) 세 가지가 서로 다른 tile 에 대해 같은 시간에 진행됩니다."
          output="출력 tile 전체. 이상적인 독립 자원에서는 총 시간이 load + compute + store + (T−1)×max(load, compute, store)에 가까워집니다. Store를 생략한 100-tile 예는 1.2 + 0.8 + 99×1.2 = 120.8 µs입니다. 순차 실행 T×(load+compute+store)와의 차이가 overlap 이득입니다."
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
            3.35 TB/s와 dense BF16 989 TFLOP/s는 H100 SXM 예의 제품
            상한이고, shared memory의 SM당 128 B/clock은 bank 32개 × 4 B의
            conflict-free 상한입니다. 이 글의 0.32 µs·37.6 ns·50.1 µs·139.0 µs는
            그 사양으로 계산한 산수이며 어느 kernel의 측정값도 아닙니다.
          </p>
          <p>
            GEMM + bias + GELU의 160 MiB 대 32 MiB는 dtype과 shape에서
            곧바로 나오는 산수이고, fusion이 실제로 그만큼의 시간을 돌려주는지는
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
            source="NVIDIA · PTX ISA · ldmatrix · wgmma.mma_async · prefetch · cp.async.bulk.prefetch.tensor"
            citeKey={2}
            href="https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#warp-level-matrix-load-instruction-ldmatrix"
          >
            ldmatrix가 8×8 b16 행렬을 .x1·.x2·.x4로 warp 전체에 나눠
            싣는다는 정의와, wgmma의 B shared descriptor·A shared/register
            variant·register accumulator 경계를 확인했습니다. Prefetch 명령은
            목적지 없이 L2에 올리는 best-effort hint라는 범위로만 사용했습니다.
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
            HBM3 3.35 TB/s, FP16/BF16 dense 989 TFLOP/s (sparsity 1,979),
            L2 50 MB, SM당 shared memory 228 KB의 출처입니다. SM 수 132와
            1.7 GHz는 SXM5 예의 공개 값이며, 이 글은 단위를 맞춘 뒤 층별
            이상 시간을 계산했습니다. 2026-11-02 원문을 다시 확인했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          앞 글: <Link to="/cs/gpu/warp-specialization-and-async-pipelines">Warp specialization 과 asynchronous pipeline</Link>,
          병목 판정은 <Link to="/cs/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">roofline</Link>,
          fusion 범위는 <Link to="/cs/gpu/cuda-kernel-fusion">kernel fusion</Link>.
        </p>
      </section>
    </div>
  );
}
