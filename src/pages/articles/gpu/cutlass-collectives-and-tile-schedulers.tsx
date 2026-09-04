import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CutlassCollectivesAndTileSchedulersViz from "./cutlass-collectives-and-tile-schedulers/viz/CutlassCollectivesAndTileSchedulersViz";

/**
 * CUTLASS collective·tile scheduler·Stream-K·cluster
 *
 * CollectiveMma·CollectiveEpilogue 의 계약, pipeline stage 수와 shared memory 예산,
 * tile scheduler 와 persistent loop, wave quantization 과 Stream-K, cluster launch 와 TMA multicast,
 * CUTLASS profiler 기반 autotuning 을 소유한다. Tile 계층과 CuTe layout 은
 * /gpu/cutlass-gemm-hierarchy-and-cute-layouts 가, cluster·DSM 의 hardware 정의는 /gpu/gpu-arch-hopper 가,
 * persistent worker 의 queue·residency 계약은 /gpu/cuda-persistent-kernels 가 소유한다.
 */
export default function CutlassCollectivesAndTileSchedulersArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="collectives" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Collective 는 threadblock 하나가 tile 하나를 처리하는 계약입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CUTLASS 3.x 의 GEMM kernel 은 collective mainloop 과 collective epilogue 두 부품을 tile scheduler 가 이어 붙인
            것입니다. Collective 는 threadblock(또는 cluster) 하나가 output tile 하나를 맡을 때 무엇을 받아 무엇을 돌려주는지의 계약입니다. 그
            tile 을 어느 threadblock 이 언제 맡는지는 collective 밖의 scheduler 가 정합니다.
          </p>
          <p>
            <Link to="/gpu/cutlass-gemm-hierarchy-and-cute-layouts#mainloop-epilogue">앞 글의 mainloop</Link> 이
            한 k-iteration 의 copy → ldmatrix → mma 순서였다면, <code>CollectiveMma</code> 는
            그 반복 전체를 template 인자로 고정한 class 입니다. Tile 모양, cluster 모양, stage 수,
            A·B 의 shared memory layout atom 과 copy atom, TiledMMA 가 인자이고 accumulator 의 type
            은 TiledMMA 의 C type 에서 따라옵니다.
          </p>
          <p>
            인자 가운데 가장 앞에 오는 <code>DispatchPolicy</code> 가 mainloop 의 종류를 고릅니다.{" "}
            <code>MainloopSm90TmaGmmaWarpSpecialized&lt;Stages, ClusterShape, Schedule&gt;</code> 는
            TMA 로 tile 을 올리고 wgmma 로 계산하며 producer warp 와 consumer warp 를 나눈 Hopper
            mainloop 입니다.
          </p>
          <p>
            같은 이름의 policy 안에서도 stage 수와 cluster 모양이 바뀌면 다른 kernel 이 됩니다.
          </p>
          <p>
            Warp specialization 은 threadblock 의 warp 를 역할로 나눕니다. Producer warp 하나가 TMA
            descriptor 로 다음 stage 의 A·B 조각을 발행하고, consumer warp group 이 도착한 stage 를
            wgmma 로 소비합니다. 둘 사이는 stage 마다 하나씩 있는 barrier 의 phase 로 이어지며,
            그 hardware 구조는 <Link to="/gpu/gpu-arch-hopper#tma">Hopper TMA pipeline</Link> 에 있습니다.
          </p>
          <p>
            <code>CollectiveEpilogue</code> 는 mainloop 이 넘긴 accumulator 를 받아 C 를 읽고 D 를
            쓰는 계약입니다. Hopper 의 TMA warp-specialized epilogue 는 accumulator 를 shared memory
            에 내려놓고 TMA store 로 내보내며, visitor tree 가 그 사이에 bias·activation 을 끼웁니다.
          </p>
          <p>
            Mainloop 과 epilogue 는 accumulator tensor 의 모양으로만 만나므로 서로 독립적으로
            바꿀 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="CollectiveMma 의 template 인자가 정하는 것"
          description="인자 하나가 바뀌면 shared memory 사용량과 kernel schedule 이 함께 바뀝니다."
          items={[
            { term: "DispatchPolicy", description: "Mainloop 의 종류와 그 안의 stage 수·cluster 모양·kernel schedule 입니다.", example: "MainloopSm90TmaGmmaWarpSpecialized<4, Shape<_2,_1,_1>, KernelTmaWarpSpecializedCooperative>", boundary: "Policy 마다 지원하는 architecture 와 schedule 이 정해져 있어 임의 조합은 컴파일되지 않습니다." },
            { term: "TileShape", description: "Collective 하나가 맡는 M×N×K tile 입니다.", example: "Shape<_128,_128,_64>: bf16 이면 stage 당 A 16 KB + B 16 KB.", boundary: "TiledMMA 의 명령 모양과 warp 수로 나눠떨어져야 합니다." },
            { term: "SmemLayoutAtom · CopyAtom", description: "Shared memory tile 의 swizzled layout atom 과 global→smem, smem→register copy atom 입니다.", example: "Swizzle<3,3,3> 8×64 atom 과 SM90_TMA_LOAD, wgmma 는 smem 을 descriptor 로 직접 읽습니다.", boundary: "TMA 를 쓰면 descriptor 의 swizzle 모드가 layout atom 과 일치해야 합니다." },
            { term: "CollectiveBuilder", description: "Architecture·dtype·layout·tile·cluster·StageCount·schedule 을 받아 위 인자를 대신 채우는 helper 입니다.", example: "StageCountAuto 와 KernelScheduleAuto 를 주면 builder 가 shared memory 예산에서 stage 수를 계산합니다.", boundary: "Auto 는 예산 계산이지 성능 탐색이 아니며, 어떤 tile 이 빠른지는 profiler 가 답합니다." },
          ]}
        />
        <ContentBoundary article="cutlass-collectives-and-tile-schedulers" />
      </section>

      <section id="pipeline-stages" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stage 수는 shared memory 예산을 tile 한 벌의 크기로 나눈 몫입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pipeline depth, 곧 stage 수는 shared memory 에 동시에 들어 있는 A·B tile 의 벌 수입니다.
            Stage 가 1이면 copy 가 끝나야 계산이 시작되고, stage 가 S 이면 producer 가 S−1 벌을
            앞서 발행해 둘 수 있어 global 읽기 지연이 계산 뒤로 숨습니다. 이 지연 숨김의 원리는{" "}
            <Link to="/gpu/gpu-architecture#gpu-latency-hiding-occupancy">latency hiding 과 occupancy</Link> 에 있습니다.
          </p>
          <p>
            비용은 shared memory 입니다. 128×128×64 bf16 tile 은 A 가 128×64×2 B = 16 KB, B 도
            16 KB 라 stage 한 벌이 32 KB 입니다. Stage 3 은 96 KB, stage 4 는 128 KB 를 씁니다.
            H100 은 threadblock 당 최대 227 KB 를 허용하므로 epilogue 가 쓸 몫을 빼면 여섯 벌
            안팎이 상한입니다.
          </p>
          <p>
            <code>StageCountAutoCarveout</code> 이 이 계산을 그대로 합니다. 전체 용량에서
            epilogue·tensor map·scheduler 가 쓸 carveout 을 뺀 뒤, A·B tile bytes 를 정렬 단위로
            올리고 stage 마다 붙는 barrier bytes 를 더한 값으로 나눕니다. 결과가 stage 수이고,
            사용자가 <code>StageCount&lt;N&gt;</code> 을 주면 그 값을 그대로 씁니다.
          </p>
          <p>
            Stage 를 더 두는 것이 늘 이득은 아닙니다. Shared memory 를 많이 쓰면 SM 에 함께 머무는 threadblock 수가 줄어 다른 방식의 지연 숨김이
            사라집니다. K 가 짧아 k-iteration 이 stage 수보다 적으면 앞서 발행할 것 자체가 없습니다. 128×256×64 처럼 B 가 32 KB 인 tile 은
            stage 4 에 192 KB 를 써서 SM 당 threadblock 하나만 남습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Stage 수와 shared memory 사용량은 어떤 관계인가요?"
          idea="Stage 한 벌은 A tile 과 B tile 의 bytes 에 barrier 몫을 더한 크기이고, 자동 계산은 carveout 을 뺀 용량을 그 크기로 나눈 몫을 stage 수로 씁니다."
          formula={String.raw`\begin{aligned}
B_A &= bM\cdot bK\cdot e_A,\qquad B_B = bN\cdot bK\cdot e_B \\
B_{stage} &= \mathrm{align}(B_A + B_B) + B_{bar} \\
S &= \Bigl\lfloor \frac{C_{smem} - C_{carve}}{B_{stage}} \Bigr\rfloor
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
B_A &= \underbrace{bM\cdot bK\cdot e_A}_{\text{A tile bytes}} \\
B_B &= \underbrace{bN\cdot bK\cdot e_B}_{\text{B tile bytes}} \\
B_{stage} &= \mathrm{align}(B_A + B_B) + \underbrace{B_{bar}}_{\text{stage 당 barrier}} \\
S &= \Bigl\lfloor \frac{\underbrace{C_{smem} - C_{carve}}_{\text{epilogue 등을 뺀 용량}}}{B_{stage}} \Bigr\rfloor
\end{aligned}`}
          operations={[
            { expression: String.raw`bM\cdot bK\cdot e_A`, annotation: ["Tile 모양과 원소 크기를 곱해 A tile bytes 를 내고", "B 도 같은 식: 128×64×2 + 128×64×2 = 32 KB"] },
            { expression: String.raw`\mathrm{align}(B_A + B_B) + B_{bar}`, annotation: ["정렬 단위로 올리고 barrier bytes 를 더해", "stage 한 벌의 실제 크기를 만듭니다"] },
            { expression: String.raw`\left\lfloor (C_{smem} - C_{carve}) / B_{stage} \right\rfloor`, annotation: ["Carveout 을 뺀 용량을 한 벌 크기로 나눠", "내림한 몫이 stage 수"] },
          ]}
          terms={[
            { symbol: String.raw`bM, bN, bK`, name: "Tile shape", description: "Collective 의 M·N·K tile 크기입니다." },
            { symbol: String.raw`e_A, e_B`, name: "원소 크기", description: "A·B 원소의 bytes 입니다. bf16 은 2." },
            { symbol: String.raw`B_{bar}`, name: "Barrier bytes", description: "Stage 마다 producer·consumer 가 phase 를 주고받는 mbarrier 의 크기입니다." },
            { symbol: String.raw`C_{smem}, C_{carve}`, name: "용량과 carveout", description: "Threadblock 당 shared memory 상한(H100 227 KB)과 epilogue·tensor map·scheduler 가 미리 가져가는 몫입니다." },
          ]}
          assumptions={["sm90_gmma_builder 의 compute_stage_count_or_override 를 옮긴 것이며 architecture 마다 carveout 과 정렬 단위가 다릅니다.", "Stage 수가 k-iteration 수보다 크면 초과분은 채워지지 않으므로 짧은 K 에서는 식의 결과가 상한일 뿐입니다."]}
          interpretation="Stage 수는 tile 이 클수록 줄어들고, 같은 stage 수라도 tile 이 크면 SM 에 머무는 threadblock 이 줄어듭니다. 식은 들어가는 벌 수를 말할 뿐 몇 벌이 가장 빠른지는 말하지 않습니다."
        />
      </section>

      <section id="tile-scheduler" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Persistent scheduler 는 grid 를 SM 수로 고정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tile scheduler 는 output tile 의 격자를 어느 threadblock 이 어떤 순서로 맡을지 정하는 부품입니다. 가장 단순한 scheduler 는 tile
            수만큼 threadblock 을 띄우고 blockIdx 를 tile 좌표로 바꿉니다. M=N=4096 을 128×128 tile 로 자르면 32×32 = 1024 개의
            threadblock 이 뜨고 hardware 가 SM 이 빌 때마다 다음 threadblock 을 올립니다.
          </p>
          <p>
            Persistent tile scheduler 는 grid 를 SM 수(cluster 를 쓰면 동시에 올릴 수 있는 cluster 수)로 고정합니다. 각 threadblock
            은 자기 tile 을 끝낸 뒤 grid 크기만큼 건너뛴 다음 tile 을 맡는 loop 를 돕니다. H100 의 SM 132개에 1024 tile 이면 threadblock
            하나가 7개 또는 8개를 차례로 처리합니다.
          </p>
          <p>
            Long-lived worker 의 일반 계약은{" "}
            <Link to="/gpu/cuda-persistent-kernels#overview">persistent kernel</Link> 이 다룹니다.
          </p>
          <p>
            Persistent 가 필요한 이유는 launch 비용이 아니라 겹침입니다. 한 threadblock 이 다음 tile 의 mainloop 을 시작하는 동안 앞 tile 의
            epilogue 를 마무리할 수 있고 ping-pong schedule 은 consumer warp group 둘에 다른 tile 을 주어 한쪽의 epilogue 를 다른 쪽의
            MMA 뒤에 숨깁니다. Threadblock 이 tile 마다 새로 뜨면 이 겹침이 없습니다.
          </p>
          <p>
            Linear tile 번호를 (m, n) 좌표로 푸는 순서도 scheduler 의 일입니다. Raster order 가 N 방향이면 같은 A 행 조각을 쓰는 tile 이 연달아
            배정되고 swizzle 크기 k 는 tile 번호를 k개씩 묶어 2차원 덩어리로 돌게 해 같은 시간에 L2 에 있는 A·B 조각의 재사용을 높입니다. 이 swizzle 은 앞
            글의 shared memory swizzle 과 이름만 같은 다른 것입니다.
          </p>
          <p>
            Wave quantization 은 이 배정 방식이 남기는 낭비입니다. 1024 tile 을 132 SM 에 한 번에 하나씩 올리면 7번의 꽉 찬 wave 뒤에 100 tile
            짜리 여덟째 wave 가 남고 그 wave 동안 SM 32개가 놉니다. 전체 slot 8×132 = 1056 가운데 1024 만 일하니 3% 낭비입니다.
          </p>
          <p>
            낭비는 tile 수가 SM 수의 배수에서 조금 넘칠 때 커집니다. M=N=2560 이면 tile 이 400개라 세 wave 396 뒤에 4개가 남아 네 번째 wave 를 통째로
            씁니다. 528 slot 에 400 이 일하니 24% 가 비고 tile 4개를 위해 wave 하나만큼 시간이 늘어납니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Persistent tile scheduler 의 kernel loop (CUTLASS sm90 StaticPersistentTileScheduler)"
          input={["problem_shape (M, N, K, L) 과 TileShape·ClusterShape", "grid = min(tiles, 동시에 올릴 수 있는 cluster 수 × cluster 크기)", "raster_order (AlongM | AlongN), log_swizzle_size", "blockIdx (cluster 단위로 정렬된 linear block index)"]}
          steps={[
            { code: "tiles = ceil(M/bM) × ceil(N/bN) × L;  idx = linear block index", note: "Output tile 격자의 총 개수입니다. 1024 tile 에 grid 132 면 threadblock 0 은 idx 0 에서 시작합니다." },
            { code: "while idx < tiles:", note: "is_valid() 가 false 가 될 때까지 threadblock 이 살아 있습니다." },
            { code: "  (m, n, l) = decode(idx, cluster_shape, raster_order, swizzle)", note: "Cluster 안의 rank 를 먼저 떼고, swizzle 크기만큼 묶은 2차원 덩어리 안에서 raster 방향으로 좌표를 풉니다." },
            { code: "  acc = mainloop(gA(m, _, l), gB(n, _, l), k_tiles)", note: "CollectiveMma 가 K 전체를 stage pipeline 으로 돌아 accumulator 를 만듭니다." },
            { code: "  epilogue(acc, gC(m, n, l), gD(m, n, l))", note: "CollectiveEpilogue 가 visitor 연산을 적용해 D 를 씁니다. Ping-pong schedule 은 이 구간을 다른 warp group 의 mainloop 과 겹칩니다." },
            { code: "  idx += grid", note: "current_work_linear_idx_ += total_grid_size_. Threadblock 0 은 0, 132, 264, … 를 맡습니다." },
          ]}
          repeatUntil="idx 가 tiles 를 넘으면 threadblock 이 종료합니다. 마지막 wave 에서 tile 이 모자라면 일부 threadblock 이 먼저 끝나 그 SM 이 빕니다."
          output="모든 output tile 의 D. Threadblock 수는 tile 수가 아니라 SM 수로 고정됩니다."
        />
      </section>

      <section id="stream-k" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stream-K 는 tile 이 아니라 k-iteration 을 SM 에 균등하게 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Stream-K 는 wave quantization 을 없애는 분해입니다. Output tile 을 세는 대신 모든 tile 의 k-iteration 을 하나로 늘어놓고 그
            총량을 SM 수로 나눠 각 threadblock 에 연속한 구간을 줍니다. 구간이 tile 경계를 넘으면 한 threadblock 이 어떤 tile 은 통째로, 어떤 tile
            은 일부 K 만 계산합니다.
          </p>
          <p>
            숫자로 봅니다. 1024 tile 에 bK 64 로 K 4096 을 돌면 tile 당 64 k-iteration, 전체
            65,536 iteration 입니다. 132 로 나누면 496 또는 497 이니 threadblock 하나가 7.76 tile
            분량을 맡고 모두가 거의 같은 시각에 끝납니다. 앞 절의 8 wave 가 7.76 wave 시간으로
            줄어 3% 가 회수됩니다. 2560 의 경우는 4 wave 가 3.03 wave 로 줄어 24% 가 회수됩니다.
          </p>
          <p>
            하지만 비용이 있습니다. 한 tile 의 K 를 두 threadblock 이 나눠 계산하면 둘의
            accumulator 를 더해야 합니다.
          </p>
          <p>
            CUTLASS 의 sm90 Stream-K scheduler 에서는 tile 의 마지막 k 구간을 맡지 않은 unit 이 accumulator 를 global workspace
            에 쓰고 barrier 를 k-iteration 수만큼 올립니다. 마지막 구간을 맡은 unit 은 그 barrier 를 기다렸다가 partial 을 읽어 더한 뒤
            epilogue 를 한 번만 실행합니다.
          </p>
          <p>
            잘리는 tile 수를 줄이기 위해 CUTLASS 는 Stream-K 를 마지막 wave 에만 적용하는 hybrid 를 씁니다. 1024 tile 이면 7 wave 924
            tile 은 데이터 병렬로 그대로 돌고 남은 100 tile 의 6,400 iteration 만 132 threadblock 에 48 또는 49 씩 나눕니다. 잘리는 tile
            은 이 100개 안에서만 생기고 workspace 도 그만큼만 필요합니다.
          </p>
          <p>
            Split-K 와의 차이는 나누는 단위입니다.{" "}
            <Link to="/ai/sionic-glm-b300#kernel">Split-K</Link> 는 모든 tile 의 K 를 같은 수로 잘라
            threadblock 수를 늘리므로 tile 수가 적을 때의 처방이고, 잘린 조각 수만큼 reduction 이
            늘어납니다. Stream-K 는 threadblock 수를 SM 수로 고정하고 경계에 걸친 tile 만 자르므로
            reduction 이 잘린 tile 수에 비례합니다.
          </p>
        </div>
        <CutlassCollectivesAndTileSchedulersViz />
        <ExplainedFormula
          question="Stream-K 는 wave quantization 의 낭비를 어떻게 계산하고 없애나요?"
          idea="데이터 병렬은 tile 을 wave 로 올려 마지막 wave 의 빈 slot 이 낭비가 되고, Stream-K 는 tile 수 곱하기 k-iteration 수를 grid 로 나눠 모든 threadblock 이 같은 양의 iteration 을 받게 합니다."
          formula={String.raw`\begin{aligned}
T &= \lceil M/bM \rceil \, \lceil N/bN \rceil \\
\eta_{DP} &= \frac{T}{\lceil T/g \rceil\, g} \\
I &= T \cdot \lceil K/bK \rceil,\qquad I_{cta} = \lceil I/g \rceil \\
\eta_{SK} &= \frac{I}{I_{cta}\, g}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
T &= \underbrace{\lceil M/bM \rceil \, \lceil N/bN \rceil}_{\text{output tile 수}} \\
\eta_{DP} &= \frac{T}{\underbrace{\lceil T/g \rceil\, g}_{\text{wave 수}\times\text{SM 수 = slot}}} \\
I &= \underbrace{T \cdot \lceil K/bK \rceil}_{\text{전체 k-iteration}} \\
I_{cta} &= \underbrace{\lceil I/g \rceil}_{\text{threadblock 당 몫}},\qquad \eta_{SK} = \frac{I}{I_{cta}\, g}
\end{aligned}`}
          operations={[
            { expression: String.raw`\lceil T/g \rceil\, g`, annotation: ["Tile 수를 SM 수로 올림해 wave 수를 세고 다시 SM 수를 곱해", "실제로 소비되는 slot 수를 만듭니다: 1024 → 8×132 = 1056"] },
            { expression: String.raw`T / (\lceil T/g \rceil\, g)`, annotation: ["일한 slot 을 전체 slot 으로 나눠", "데이터 병렬의 효율 1024/1056 = 97%, 400/528 = 76%"] },
            { expression: String.raw`\lceil I/g \rceil`, annotation: ["전체 iteration 을 SM 수로 나눠", "threadblock 하나의 몫 65,536/132 → 497"] },
            { expression: String.raw`I / (I_{cta}\, g)`, annotation: ["몫의 올림으로 생기는 낭비만 남아", "497×132 = 65,604 slot 에 65,536 이 일하니 99.9%"] },
          ]}
          terms={[
            { symbol: "T", name: "Output tile 수", description: "M·N 을 tile 크기로 올림 나눗셈한 곱입니다." },
            { symbol: "g", name: "Grid 크기", description: "동시에 도는 threadblock 수이며 persistent 에서는 SM 수(또는 cluster 수 × cluster 크기)입니다." },
            { symbol: "I", name: "전체 k-iteration", description: "Tile 마다 K/bK 번의 mainloop 반복이 있으므로 T 에 그 수를 곱한 값입니다." },
            { symbol: String.raw`\eta`, name: "Quantization 효율", description: "일한 slot 을 배정된 slot 으로 나눈 비율이며 1 에서 뺀 값이 낭비입니다." },
          ]}
          assumptions={["Tile 마다 계산 시간이 같고 SM 마다 threadblock 하나가 돈다고 봅니다. Occupancy 가 2 이상이면 g 가 그만큼 커집니다.", "Stream-K 의 효율에는 잘린 tile 의 partial store·load 와 barrier 대기 비용이 빠져 있습니다. 논문은 이 비용을 tile 수에 비례하는 상수로 다룹니다."]}
          interpretation="낭비는 T 가 g 의 배수를 조금 넘길 때 최대가 되고 T 가 g 보다 훨씬 크면 저절로 작아집니다. Stream-K 의 이득은 그래서 작은 문제나 tile 수가 어중간한 문제에서 크고, 큰 정사각 GEMM 에서는 몇 % 입니다."
        />
      </section>

      <section id="cluster-multicast" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cluster 로 띄우면 이웃 threadblock 이 같은 tile 을 한 번만 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Cluster launch 는 threadblock 여러 개를 같은 GPC 에 함께 올리도록 launch 시점에
            지정하는 것입니다. Kernel 에 <code>__cluster_dims__</code> 를 붙이거나{" "}
            <code>cudaLaunchKernelEx</code> 의 cluster dimension attribute 로 지정하며, 이식 가능한
            상한은 8 이고 H100 은 옵션으로 16 까지 허용합니다. Cluster 의 hardware 정의는{" "}
            <Link to="/gpu/gpu-arch-hopper#cluster">Hopper cluster 와 DSM</Link> 에 있습니다.
          </p>
          <p>
            CUTLASS 가 cluster 를 쓰는 첫 이유는 TMA multicast 입니다. ClusterShape 2×1 이면 M 방향으로 이웃한 두 threadblock 에 같은
            B tile 이 필요합니다. 각자가 B 의 절반씩만 global 에서 읽어 multicast 로 두 threadblock 의 shared memory 에 동시에 쓰면 B 의
            L2 읽기 traffic 이 절반이 됩니다. A 는 두 threadblock 이 다르므로 각자 읽습니다.
          </p>
          <p>
            둘째 이유는 distributed shared memory 입니다. Cluster 안의 threadblock 은{" "}
            <code>cluster.map_shared_rank</code> 로 이웃의 shared memory 주소를 얻어 직접 읽고 쓸 수
            있습니다.
          </p>
          <p>
            Stream-K 의 partial 교환이나 epilogue 의 reduction 이 global workspace 대신 이웃의 shared memory 를 쓸 수 있지만
            cluster 밖의 threadblock 과는 여전히 global 을 거칩니다.
          </p>
          <p>
            Cluster 는 scheduler 의 단위도 바꿉니다. Persistent grid 는 SM 수가 아니라 동시에 올릴 수 있는 cluster 수 곱하기 cluster 크기로
            잡히고 tile 번호는 cluster 안의 rank 를 먼저 뗀 뒤 풀립니다.
          </p>
          <p>
            132 SM 에 2×1 cluster 를 쓰면 GPC 경계 때문에 66 cluster 가 늘 다 뜨지는 않으며,
            CUTLASS 는 <code>cudaOccupancyMaxActiveClusters</code> 로 실제 수를 묻습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Cluster 크기를 키우면 무엇이 좋아지고 무엇이 나빠지나요?"
          preview="Multicast 로 줄어드는 traffic 은 cluster 크기에 비례하지만, cluster 가 클수록 같은 GPC 에 빈 SM 이 그만큼 함께 있어야 올라가므로 scheduling 이 굳고 마지막 wave 의 낭비가 cluster 단위로 커집니다."
        >
          <p>
            2×1 은 B 를, 1×2 는 A 를, 2×2 는 둘 다 절반으로 줄입니다. 그러나 2×2 cluster 는 SM 4개가 한 GPC 안에서 동시에 비어야 뜨고 tile 격자가
            cluster 모양으로 나눠떨어지지 않으면 가장자리 cluster 의 일부 threadblock 이 빈 tile 을 받습니다. CUTLASS 의 profiler 가
            cluster 모양을 tile 모양과 함께 탐색하는 이유입니다.
          </p>
          <p>
            Cluster 안의 동기화는 <code>cluster.sync()</code> 로 하며, 한 threadblock 이 이웃의
            shared memory 를 읽는 동안 이웃이 먼저 종료하면 안 되므로 kernel 끝에서 한 번 더
            동기화합니다. Hopper 문서는 DSM 접근도 32 B 단위로 정렬된 coalesced 패턴을 권합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="autotuning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CUTLASS autotuning 은 profiler 로 후보를 실측하는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            지금까지의 인자는 모두 성능을 바꿉니다. Tile 모양, stage 수, cluster 모양, kernel
            schedule, raster order 와 swizzle 크기, 그리고 Stream-K 여부까지가 한 GEMM 의 후보
            공간이고, CUTLASS 는 이 공간을 runtime 에 스스로 탐색하지 않습니다. 대신{" "}
            <code>cutlass_profiler</code> 가 후보 kernel 을 모두 instantiate 해 주어진 shape 에서 실측합니다.
          </p>
          <p>
            Profiler 는 <code>--operation=Gemm --m=4096 --n=4096 --k=4096</code> 처럼 문제를 받고,{" "}
            <code>--kernels</code> 의 wildcard 로 후보를 고른 뒤 각 kernel 을 여러 번 띄워 GFLOP/s 를
            CSV 로 남깁니다.
          </p>
          <p>
            Tile 과 cluster 는 <code>--cta_m --cta_n --cta_k</code> 와{" "}
            <code>--cluster_m --cluster_n</code>, stage 는 <code>--stages</code>, raster 와 swizzle 은{" "}
            <code>--raster_order --swizzle_size</code> 로 걸러 냅니다.
          </p>
          <p>
            어떤 kernel 이 후보에 있는지는 빌드 시점에 정해집니다. CMake 의{" "}
            <code>CUTLASS_LIBRARY_KERNELS</code> 가 instantiate 할 kernel 이름 패턴을 받고, 결과
            table 에서 가장 빠른 것의 이름이 곧 사용자가 코드에 고정할 template 인자입니다.
            이 실측은 그 GPU, 그 compiler, 그 shape 에 묶인 값이며 다른 shape 로 옮기면 다시 재야 합니다.
          </p>
          <p>
            Triton 의 <Link to="/gpu/triton-kernel-programming-and-compiler#launch-and-autotune">autotune</Link> 이
            runtime 에 key 마다 config 를 벤치마크해 기억하는 것과 대비됩니다. CUTLASS 는 탐색을
            빌드·프로파일 단계로 밀어 runtime 에는 고정된 kernel 하나만 남기므로, shape 가 다양한
            서비스는 shape 구간마다 kernel 을 고르는 dispatch 표를 사용자가 따로 유지해야 합니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stream-K 논문과 CUTLASS 소스, Hopper 문서가 이 글의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Stream-K 의 분해와 wave quantization 의 정의는 Osama 등의 논문(PPoPP 2023)에서
            가져왔습니다. 논문의 A100 108 SM 실험에서 cuBLAS 대비 최대 6.74×, 평균 1.13×(fp16→fp32)
            는 저자 자기보고이며 32,824 개 shape 에 걸친 값입니다. 이 글의 132 SM 계산은 같은 식에
            H100 의 SM 수를 넣은 산수입니다.
          </p>
          <p>
            Collective 의 template 인자와 dispatch policy 이름은 CUTLASS 3.x GEMM API 문서에서
            가져왔습니다.
          </p>
          <p>
            Persistent loop 의 <code>idx += grid</code> 와 Stream-K 의 partial store·barrier·final
            unit 처리는 <code>static_tile_scheduler.hpp</code> 와{" "}
            <code>sm90_tile_scheduler_stream_k.hpp</code> 에서, stage 수 계산은{" "}
            <code>sm90_gmma_builder.inl</code> 에서 2026년 8월 기준으로 읽었습니다.
          </p>
          <p>
            Cluster 크기 상한 8·16, threadblock 당 shared memory 227 KB, TMA multicast 는 NVIDIA Hopper tuning guide
            의 값입니다. Profiler flag 는 CUTLASS profiler 문서의 것이며 실측 없이 어떤 구성이 빠르다고 말한 곳은 이 글에 없습니다.
          </p>
        </div>
        <div id="paper-stream-k" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Osama, Merrill, Cecka, Garland, Owens · Stream-K: Work-centric Parallel Decomposition for Dense Matrix-Matrix Multiplication on the GPU (PPoPP 2023)"
            citeKey={1}
            href="https://arxiv.org/abs/2301.03598"
          >
            전체 MAC-loop iteration 을 SM 수의 grid 에 균등 분배해 wave quantization 을 없애고,
            tile 경계를 넘는 구간의 partial 을 global workspace 와 flag 로 합치는 분해를
            제안했습니다. 4 SM·9 tile 예의 75% 효율과 A100 실험 수치는 논문의 것입니다.
          </CitationBlock>
        </div>
        <div id="paper-cutlass-gemm-api" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUTLASS · GEMM API 3.x (media/docs/cpp/gemm_api_3x.md)"
            citeKey={2}
            href="https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/gemm_api_3x.md"
          >
            Device·kernel·collective·tiled MMA/copy·atom 의 다섯 층, CollectiveMma 의 template
            인자와 DispatchPolicy, KernelTmaWarpSpecialized 계열 schedule, CollectiveBuilder 의
            StageCountAuto·KernelScheduleAuto 를 이 문서에서 확인했습니다.
          </CitationBlock>
        </div>
        <div id="source-cutlass-tile-scheduler" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA/cutlass · static_tile_scheduler.hpp, sm90_tile_scheduler_stream_k.hpp, sm90_gmma_builder.inl (gemm/kernel, collective/builders)"
            citeKey={3}
            href="https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/kernel/sm90_tile_scheduler_stream_k.hpp"
            type="code"
          >
            <code>current_work_linear_idx_ += total_grid_size_</code> 의 persistent 증가, Stream-K
            unit 의 partial store 와 barrier 증가, final split 만 epilogue 를 도는 분기, 그리고{" "}
            <code>compute_stage_count_or_override</code> 의 (capacity − carveout) / stage_bytes 를
            이 소스에서 읽었습니다.
          </CitationBlock>
        </div>
        <div id="paper-hopper-tuning-guide" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · Hopper Tuning Guide · CUTLASS Profiler documentation"
            citeKey={4}
            href="https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html"
          >
            Cluster 크기 8(이식)·16(H100 옵션), SM 당 228 KB 와 threadblock 당 227 KB 의 shared
            memory, TMA 의 cluster 내 multicast 와 DSM 접근 권고를 가져왔습니다. Profiler 의
            flag 는 CUTLASS 의 profiler.md 에서 확인했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          앞 글: <Link to="/gpu/cutlass-gemm-hierarchy-and-cute-layouts">CUTLASS GEMM 계층과 CuTe layout</Link>,
          그리고 이 층을 언제 고를지는 <Link to="/gpu/cuda-kernel-fusion#kernel-stack">CUTLASS·CuTe·Triton 선택 층</Link>.
        </p>
      </section>
    </div>
  );
}
