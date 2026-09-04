import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CutlassGemmHierarchyAndCuteLayoutsViz from "./cutlass-gemm-hierarchy-and-cute-layouts/viz/CutlassGemmHierarchyAndCuteLayoutsViz";

/**
 * CUTLASS GEMM 계층과 CuTe layout: tile·fragment·swizzle·copy atom
 *
 * Threadblock → warp → MMA tile 로 좁혀지는 GEMM 계층, mainloop 한 k-iteration 과 epilogue,
 * CuTe 의 layout 함수·algebra·thread-value partitioning·copy/MMA atom·swizzle 의 내부 mechanism 을 소유한다.
 * CUTLASS·CuTe·Triton 가운데 무엇을 고를지는 /gpu/cuda-kernel-fusion#kernel-stack 이,
 * collective·tile scheduler·Stream-K 는 /gpu/cutlass-collectives-and-tile-schedulers 가 소유한다.
 */
export default function CutlassGemmHierarchyAndCuteLayoutsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="tile-hierarchy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          GEMM 은 threadblock, warp, MMA tile 로 세 번 잘립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CUTLASS 가 만드는 GEMM kernel 은 출력 행렬 C 를 세 단계로 자릅니다. 한 threadblock 이
            맡는 threadblock tile, 그 안에서 한 warp 가 맡는 warp tile, 그리고 tensor core
            명령 한 번이 계산하는 MMA tile 입니다. 각 층은 자기 층의 memory 에서 아래 층의
            memory 로 데이터를 옮기는 책임을 집니다.
          </p>
          <p>
            이렇게 자르는 이유는 memory 계층마다 재사용 거리가 다르기 때문입니다.
            Threadblock tile 은 global memory 에서 shared memory 로 한 번 올린 A·B 조각을 여러
            warp 가 다시 읽게 하고, warp tile 은 shared memory 에서 register 로 올린 조각을
            여러 MMA 명령이 다시 쓰게 합니다. 이 재사용 예산의 산수는{" "}
            <Link to="/gpu/cuda-matrix-multiply#tiled">CUDA GEMM shared-tile 재사용</Link> 에 있습니다.
          </p>
          <p>
            숫자를 넣어 봅니다. Threadblock tile 이 128×128×32 이고 warp 4개(128 thread)가
            2×2 로 나누면 warp tile 은 64×64×32 입니다. Ampere 의 fp16 명령{" "}
            <code>mma.sync.m16n8k16</code> 은 16×8 출력을 K 16 만큼 진행하므로, warp 하나는
            M 방향 4개, N 방향 8개, K 방향 2번, 곧 64번의 MMA 명령으로 k-iteration 하나를 끝냅니다.
          </p>
          <p>
            Warp tile 64×64 의 fp32 accumulator 는 4096개이고 32 thread 가 나눠 들면 thread 당
            128개 register 입니다. 여기에 A·B fragment 와 주소 계산이 더해지므로 64×64 는
            register 예산이 허락하는 warp tile 의 윗선에 가깝습니다. 이보다 키우면{" "}
            <Link to="/gpu/cuda-register-pressure#spill-path">spill</Link> 이 나고, 줄이면
            shared memory 읽기가 MMA 당 늘어납니다.
          </p>
          <p>
            MMA tile 은 명령 한 번의 모양이자 thread 가 register 에 쥐는 조각의 모양입니다.{" "}
            <code>m16n8k16</code> 에서 A 는 16×16 halves 256개를 32 thread 가 8개씩, B 는 16×8
            을 4개씩, C 는 16×8 fp32 를 4개씩 나눠 듭니다. 이 조각을 fragment 라 부르고, 어느
            lane 이 어느 원소를 드는지는 명령이 고정합니다.
          </p>
          <p>
            Lane 번호를 4로 나눈 몫이 행, 나머지가 열 쌍을 정합니다. C fragment 에서 lane 5 는 몫 1, 나머지 1 이므로 행 1 의 열 2·3 과 행 9 의 열
            2·3 을 듭니다. 이 규칙이 아래 CuTe 절의 thread-value layout 으로 그대로 적히며 이 글의 Viz 는 tile 이 좁혀져 lane 하나의 fragment
            가 드러날 때까지를 보여 줍니다.
          </p>
        </div>
        <CutlassGemmHierarchyAndCuteLayoutsViz />
        <TermBreakdown
          title="세 tile 층이 각각 소유하는 memory 이동"
          description="층마다 위 memory 에서 아래 memory 로 조각을 옮기고, 그 조각을 아래 층이 여러 번 재사용합니다."
          items={[
            { term: "Threadblock tile", description: "한 threadblock 이 맡는 C 의 M×N 조각과 K 방향 진행 폭(bK). A·B 조각을 global 에서 shared memory 로 올립니다.", example: "128×128×32: A 128×32 와 B 32×128 halves, 합쳐 16 KB 를 한 k-iteration 마다 올립니다.", boundary: "Shared memory 용량과 pipeline stage 수가 bK 와 tile 크기를 제한합니다." },
            { term: "Warp tile", description: "Threadblock tile 을 warp 수로 나눈 조각. Shared memory 에서 register fragment 로 올립니다.", example: "64×64×32: 4 warp 가 2×2 로 나눠 각 warp 가 accumulator 4096개를 register 에 둡니다.", boundary: "Thread 당 register 255개 상한이 warp tile 의 윗선을 정합니다." },
            { term: "MMA tile", description: "Tensor core 명령 한 번의 M×N×K 모양. Register fragment 를 입력으로 받습니다.", example: "m16n8k16: warp tile 64×64×32 를 덮는 데 4×8×2 = 64 번 필요합니다.", boundary: "명령 모양은 architecture 와 dtype 마다 다르며 Hopper 의 wgmma 는 warp 4개가 한 명령을 냅니다." },
          ]}
        />
        <ContentBoundary article="cutlass-gemm-hierarchy-and-cute-layouts" />
      </section>

      <section id="mainloop-epilogue" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Mainloop 은 K 를 bK 씩 돌고 epilogue 가 accumulator 를 C 로 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GEMM kernel 의 몸통은 두 구간입니다. Mainloop 은 K 를 bK 폭으로 잘라 k-iteration 마다 A·B 조각을 올리고 MMA 로 accumulator 에
            더하는 반복입니다. Epilogue 는 반복이 끝난 뒤 register 의 accumulator 에 alpha·beta 와 bias·activation 을 적용해 C 로
            내보내는 한 번의 구간입니다. K 4096 을 bK 32 로 돌면 mainloop 은 128번 돕니다.
          </p>
          <p>
            한 k-iteration 은 memory 층을 한 칸씩 내려갑니다. 먼저 threadblock 의 128 thread 가
            copy atom 으로 global 의 A·B 조각 16 KB 를 shared memory 로 옮깁니다. Thread 당
            128 B, 곧 16 B 짜리 vector copy 8번입니다.
          </p>
          <p>
            그 다음 각 warp 가 <code>ldmatrix</code> 로 shared memory 의 조각을 register
            fragment 로 올리고, MMA atom 을 64번 불러 accumulator 에 누적합니다.
          </p>
          <p>
            이 순서를 그대로 두면 global 읽기가 끝날 때까지 MMA 가 놉니다. 그래서 CUTLASS 는
            shared memory 를 여러 stage 로 잡고 다음 k-iteration 의 copy 를 미리 발행합니다.
            Stage 수가 shared memory 를 얼마나 먹고 어디까지 겹칠 수 있는지는{" "}
            <Link to="/gpu/cutlass-collectives-and-tile-schedulers#pipeline-stages">다음 글의 pipeline stage</Link> 가 다룹니다.
          </p>
          <p>
            Epilogue 가 별도 구간인 이유는 accumulator 가 fragment 모양으로 흩어져 있기
            때문입니다. Lane 5 가 행 1 의 열 2·3 을 들고 있으니 그대로 global 에 쓰면 warp
            하나의 store 가 여러 행에 흩어집니다. CUTLASS 2.x 의 epilogue 는 fragment 를 shared
            memory 에 한 번 내려놓고 행 단위로 다시 읽어 coalesced store 를 만듭니다.
          </p>
          <p>
            Epilogue visitor 는 이 구간에 붙는 연산을 tree 로 조립하는 방식입니다. Bias 를
            읽는 node, ReLU 를 계산하는 node, 결과를 저장하는 node 가 fragment 하나를 차례로
            방문하므로 새 fusion 마다 epilogue 를 다시 쓰지 않습니다. ASPLOS 2024 의 EVT 논문이
            이 tree 를 compiler 가 자동 생성하는 데까지 확장했습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="CUTLASS GEMM mainloop 의 한 k-iteration (Ampere, fp16, 128×128×32 tile)"
          input={["gA, gB: 이 threadblock 이 맡은 A 128×K, B K×128 조각의 global tensor", "sA, sB: shared memory 의 128×32, 32×128 tile (stage 수만큼)", "tiled_copy_g2s: cp.async 16 B copy atom 을 128 thread 에 배치한 TiledCopy", "tiled_copy_s2r: ldmatrix copy atom 을 warp 의 32 lane 에 배치한 TiledCopy", "tiled_mma: mma.m16n8k16 atom 을 2×2 warp 로 배치한 TiledMMA", "acc: thread 당 fp32 128개 register fragment, 0 으로 초기화"]}
          steps={[
            { code: "copy(tiled_copy_g2s, tAgA(_,_,k_tile), tAsA(_,_,stage))", note: "Thread 마다 16 B 씩 8번, threadblock 전체로 A 8 KB 를 shared memory 로 발행합니다. cp.async 라 명령은 바로 돌아옵니다." },
            { code: "copy(tiled_copy_g2s, tBgB(_,_,k_tile), tBsB(_,_,stage));  cp_async_fence()", note: "B 8 KB 도 같은 방식입니다. fence 가 이 stage 의 copy 묶음 경계를 표시합니다." },
            { code: "cp_async_wait<STAGES-2>();  __syncthreads()", note: "가장 오래된 stage 의 도착만 기다리고 나머지는 계속 날아오게 둡니다. Barrier 뒤에야 다른 thread 가 쓴 조각이 보입니다." },
            { code: "for k_block in 0..1:  copy(tiled_copy_s2r, tCsA(_,_,k_block), tCrA(_,_,k_block))", note: "bK 32 는 명령 K 16 의 두 배이므로 두 번 돕니다. ldmatrix 가 8×8 조각을 fragment 규칙대로 32 lane 에 나눠 줍니다." },
            { code: "  copy(tiled_copy_s2r, tCsB(_,_,k_block), tCrB(_,_,k_block))", note: "B fragment 도 같은 규칙으로 올립니다. Swizzle 된 shared layout 이 여기서 bank conflict 를 막습니다." },
            { code: "  gemm(tiled_mma, tCrA(_,_,k_block), tCrB(_,_,k_block), acc)", note: "Warp 당 M 4 × N 8 = 32 번의 m16n8k16 를 발행합니다. acc 의 (V,M,N) 모양은 MMA atom 의 C layout 이 정합니다." },
            { code: "__syncthreads();  stage = (stage+1) % STAGES;  다음 k_tile 의 copy 발행", note: "방금 다 읽은 stage 를 비워야 그 자리에 다음 조각을 받을 수 있습니다." },
          ]}
          repeatUntil="k_tile 이 K/bK = 128 에 닿을 때까지 반복하고, 끝나면 epilogue 가 acc 에 alpha·beta·visitor 연산을 적용해 C 로 씁니다."
          output="이 threadblock 의 C 128×128 조각. Register 의 accumulator 가 epilogue 를 거쳐 global memory 에 저장됩니다."
        />
      </section>

      <section id="cute-layout" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CuTe layout 은 좌표를 stride 와 내적해 offset 으로 바꾸는 함수입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            위 계층의 모든 조각은 결국 memory 의 어느 위치를 누가 읽느냐의 문제입니다. CuTe 는 이 문제를 layout 하나로 적습니다. Layout 은 shape 와
            stride 의 쌍입니다. 좌표를 받아 각 축의 좌표에 그 축의 stride 를 곱해 더한 offset 을 돌려주는 함수입니다. Tensor 는 이 layout 에 데이터
            pointer 를 붙인 것입니다.
          </p>
          <p>
            <code>(4,8):(1,4)</code> 는 4×8 행렬을 열 우선으로 놓은 layout 입니다. 좌표
            (2,3) 은 2·1 + 3·4 = 14 로 갑니다. 같은 모양을 행 우선으로 놓은{" "}
            <code>(4,8):(8,1)</code> 에서는 (2,3) 이 2·8 + 3·1 = 19 입니다. 열 우선과 행 우선의
            차이는 어느 축의 stride 가 1 이냐뿐이며, 같은 coordinate mapping 규칙이 둘 다를
            덮습니다.
          </p>
          <p>
            Shape 는 겹쳐 쓸 수 있습니다. <code>(2,(2,2)):(4,(2,1))</code> 처럼 한 축을 다시
            두 축으로 나누면 좌표 (1,(0,1)) 은 4 + 0 + 1 = 5 로 가고, 이 layout 은 2×2×2 구조를
            2×4 로도 8 짜리 1차원으로도 읽을 수 있습니다. 한 축을 여러 mode 로 나누는 이 성질이
            tile 과 thread 를 좌표 안에 적는 바탕입니다.
          </p>
          <p>
            좌표 대신 정수 하나를 넣으면 CuTe 는 그 정수를 shape 순서대로 풀어 좌표로 바꾼 뒤
            offset 을 계산합니다. <code>(4,8):(8,1)</code> 에 14 를 넣으면 좌표 (2,3) 이 되어 19 가
            나옵니다. 정수 → 좌표 → offset 의 두 단계가 있어서 layout 은 정수 함수로도
            다룰 수 있고, 다음 절의 합성이 그 위에서 정의됩니다.
          </p>
        </div>
        <ExplainedFormula
          question="CuTe layout 은 좌표를 어떤 규칙으로 memory offset 으로 바꾸나요?"
          idea="Shape 가 좌표의 범위를, stride 가 각 축을 한 칸 움직일 때 offset 이 얼마나 뛰는지를 정합니다. Offset 은 좌표와 stride 의 내적이며, 합성은 안쪽 layout 의 offset 을 바깥 layout 의 좌표로 다시 넣는 것입니다."
          formula={String.raw`\begin{aligned}
L &= S{:}D = (s_0,\dots,s_{n-1}){:}(d_0,\dots,d_{n-1}) \\
L(c_0,\dots,c_{n-1}) &= \sum_{i=0}^{n-1} c_i\, d_i,\qquad 0\le c_i < s_i \\
(A\circ B)(c) &= A\big(B(c)\big)
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
L &= \underbrace{S}_{\text{shape: 각 축의 크기}}{:}\underbrace{D}_{\text{stride: 축당 offset 보폭}} \\
L(c) &= \underbrace{\sum_{i} c_i\, d_i}_{\text{좌표와 stride 의 내적}},\qquad \underbrace{0\le c_i < s_i}_{\text{좌표는 shape 안}} \\
(A\circ B)(c) &= \underbrace{A\big(B(c)\big)}_{\text{B 의 offset 을 A 의 좌표로}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{i} c_i\, d_i`, annotation: ["축마다 좌표에 stride 를 곱해 더해", "(2,3) 을 (4,8):(1,4) 에 넣으면 2·1+3·4 = 14"] },
            { expression: String.raw`0\le c_i < s_i`, annotation: ["Shape 가 좌표의 정의역을 정해", "정수 하나가 들어오면 shape 순서로 풀어 좌표로 만듭니다"] },
            { expression: String.raw`A\big(B(c)\big)`, annotation: ["B 가 낸 정수를 A 의 좌표로 다시 풀어 offset 을 내", "결과도 shape·stride 를 가진 layout 입니다"] },
          ]}
          terms={[
            { symbol: "S", name: "Shape", description: "각 축의 크기입니다. 축은 다시 괄호로 묶어 여러 mode 로 나눌 수 있습니다." },
            { symbol: "D", name: "Stride", description: "각 축에서 좌표가 1 늘 때 offset 이 몇 원소 뛰는지입니다. Stride 1 인 축이 memory 에서 연속입니다." },
            { symbol: String.raw`c_i`, name: "Coordinate", description: "축 i 의 좌표입니다. 정수 하나로 주면 열 우선 순서로 풀립니다." },
            { symbol: String.raw`A\circ B`, name: "Composition", description: "B 가 고른 위치를 다시 A 로 읽는 합성 layout 입니다." },
          ]}
          assumptions={["Stride 는 정수이며 0 이 될 수 있습니다(broadcast). 이 경우 서로 다른 좌표가 같은 offset 을 가리킵니다.", "합성은 B 의 치역이 A 의 정의역 안에 들어오는 shape 로 나눠떨어질 때 정의되며, CuTe 는 이 조건을 compile time 에 검사합니다."]}
          interpretation="Layout 은 index 계산을 값이 아니라 함수로 들고 다니는 장치입니다. 함수이므로 합성과 tiling 을 적용해 tile 안의 thread 안의 값 위치까지 한 식에 적을 수 있지만, layout 자체는 어떤 memory 가 빠른지 말하지 않습니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            합성은 tile 을 자르는 도구입니다. <code>20:2</code> 라는 1차원 layout 에{" "}
            <code>(5,4):(4,1)</code> 을 합성하면 <code>(5,4):(8,2)</code> 가 됩니다. 20개의 원소를
            5×4 행 우선으로 다시 읽되 원래 stride 2 를 그대로 물려받은 결과입니다. 합성의
            결과도 layout 이므로 다시 합성할 수 있습니다.
          </p>
          <p>
            Tiling 은 합성의 특수한 경우입니다. Layout 을 tiler 로 나누면(logical divide) 각
            축이 tile 안의 좌표와 tile 번호의 두 mode 로 갈라집니다.
          </p>
          <p>
            예를 들어 열 우선 <code>(128,128):(1,128)</code> 을 <code>(16,8)</code> tile 로 나누면{" "}
            <code>((16,8),(8,16)):((1,128),(16,1024))</code> 가 됩니다. 앞 mode 가 16×8 tile 안의
            좌표, 뒤 mode 가 8×16 개의 tile 번호이며 stride 만 보면 원래 memory 를 한 번도
            옮기지 않았습니다.
          </p>
          <p>
            Layout 이 이 형태를 가지면 tensor 의 slicing 이 곧 분배가 됩니다. 뒤 mode 에 tile
            번호 (2,3) 을 고정하면 앞 mode 만 남은 16×8 조각이 나오고, 그 조각의 pointer 는
            2·16 + 3·1024 만큼 옮겨져 있습니다. <code>local_tile</code> 이 threadblock 에 tile 을
            나눠 주는 연산이 정확히 이것입니다.
          </p>
        </div>
      </section>

      <section id="tv-partition" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Thread·value layout 이 atom 을 펼쳐 thread 몫을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tile 을 잘랐으면 그 안의 원소를 thread 에 나눠야 합니다. CuTe 는 이 분배를 thread layout 과 value layout 두 개로 적습니다. Value
            layout 은 thread 하나가 한 번에 드는 원소의 모양입니다. Thread layout 은 그 단위를 어느 thread 가 tile 의 어느 위치에서 맡는지입니다. 둘을
            곱하면 (thread, value) 쌍에서 tile 좌표로 가는 TV layout 이 됩니다.
          </p>
          <p>
            Global 에서 shared memory 로 128×32 halves tile 을 옮기는 예를 봅니다. Vector copy
            한 번이 16 B, 곧 K 방향으로 연속한 8 halves 이므로 value layout 은{" "}
            <code>(1,8)</code> 입니다. Thread 128개를 M 방향 32, K 방향 4 로 놓는 thread layout{" "}
            <code>(32,4)</code> 와 곱하면 한 번의 copy 가 32×32 조각을 덮고, 128×32 tile 은 M 방향으로
            4번이면 끝납니다.
          </p>
          <p>
            Partitioning 은 이 TV layout 으로 tensor 를 잘라 thread 하나의 몫만 남기는
            연산입니다. <code>partition_S</code> 에 thread 번호를 주면 그 thread 가 옮길
            원소를 (value 8, M 방향 4, K 방향 1) 모양의 tensor 로 돌려줍니다. 이 tensor 의
            layout 은 원래 global tensor 의 stride 를 그대로 물려받았으므로, copy 는 그 32개
            원소를 16 B 씩 4번 읽으면 됩니다.
          </p>
          <p>
            같은 절차가 MMA 에도 적용됩니다. MMA atom 의 C layout 은 (32 thread, 4 value) 를
            16×8 좌표로 보내는 TV layout 이고, 이것을 warp 2×2 로 펼친 TiledMMA 가{" "}
            <code>partition_C</code> 로 accumulator tensor 를 thread 몫으로 자릅니다.
          </p>
          <p>
            결과가 (4, 4, 8) 모양인 이유는 value 4개에 M 방향 tile 4개, N 방향 tile 8개가 곱해졌기 때문이며 그 128개가 앞 절의 accumulator
            register 128개입니다.
          </p>
          <p>
            Copy atom 과 MMA atom 은 이 TV layout 을 hardware 명령에 묶어 둔 단위입니다. Copy atom 은 명령 하나가 옮기는 원소를
            source·destination 양쪽의 TV layout 으로 적고 MMA atom 은 명령 하나의 A·B·C 각각을 TV layout 으로 적습니다.
          </p>
          <p>
            Atom 을 thread layout 으로 펼친 것이 TiledCopy·TiledMMA 이고, 이 둘이 mainloop 의{" "}
            <code>copy</code> 와 <code>gemm</code> 호출에 들어갑니다.
          </p>
          <p>
            <code>m16n8k16</code> atom 의 A layout 은 CuTe 소스에{" "}
            <code>((4,8),(2,2,2)):((32,1),(16,8,128))</code> 로 적혀 있습니다. Thread mode (4,8) 은
            lane 을 나머지 4 와 몫 8 로 풀고, 열 우선 16×16 에서 stride 32 는 열 2칸, stride 1 은
            행 1칸입니다.
          </p>
          <p>
            Value mode 의 stride 16·8·128 은 열 1칸, 행 8칸, 열 8칸이며 이것이 첫 절에서 말로 적은 lane 규칙과 같은 내용입니다.
          </p>
        </div>
        <TermBreakdown
          title="Partitioning 에 쓰이는 네 layout 의 역할"
          description="네 layout 은 모두 같은 shape·stride 함수이지만 정의역이 다릅니다."
          items={[
            { term: "Value layout", description: "Thread 하나가 명령 한 번에 드는 원소의 모양입니다.", example: "16 B vector copy 는 halves (1,8), m16n8k16 의 A fragment 는 (2,2,2) 로 8개.", boundary: "명령이 정하는 값이라 사용자가 마음대로 바꾸지 못합니다." },
            { term: "Thread layout", description: "Value 단위를 어느 thread 가 tile 의 어느 자리에서 맡는지입니다.", example: "(32,4): M 방향 32 thread, K 방향 4 thread 로 128 thread 를 놓습니다.", boundary: "Thread 수가 tile 원소 수를 나누지 못하면 predication 이 필요합니다." },
            { term: "TV layout", description: "(thread, value) 쌍을 tile 좌표로 보내는 합성 layout 입니다.", example: "(32,4) 와 (1,8) 을 raked product 하면 32×32 tile 을 덮는 TV layout 이 됩니다.", boundary: "TV layout 의 역함수를 취해야 tile 좌표에서 thread 를 찾을 수 있습니다." },
            { term: "Atom", description: "명령 하나의 TV layout 과 명령 호출을 묶은 단위입니다.", example: "Copy atom: cp.async 16 B, ldmatrix. MMA atom: mma.m16n8k16, Hopper wgmma.", boundary: "Atom 은 명령 하나의 모양만 알고 tile 전체는 TiledCopy·TiledMMA 가 압니다." },
          ]}
        />
      </section>

      <section id="swizzle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Swizzle 은 행 번호로 chunk 번호를 XOR 해 bank conflict 를 없앱니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Shared memory 의 tile 을 있는 그대로 놓으면 fragment 를 올리는 순간 bank conflict 가
            납니다. Swizzled layout 은 원소의 논리 좌표는 두고 물리 offset 의 일부 bit 를 다른
            bit 와 XOR 해, 같은 순간에 읽히는 행들이 서로 다른 bank 에 떨어지게 하는 layout
            입니다. CuTe 는 이것을 layout 뒤에 합성하는 <code>Swizzle&lt;B,M,S&gt;</code> 함수로 적습니다.
          </p>
          <p>
            문제를 숫자로 봅니다. K-major fp16 tile 의 한 행이 64 halves, 곧 128 B 라고 합시다.
            Shared memory 는 4 B bank 32개가 128 B 마다 돌아오므로 모든 행의 시작이 bank 0 입니다.
            Bank 의 정의는 <Link to="/gpu/cuda-shared-memory#bank-conflict">shared memory bank conflict</Link> 에 있습니다.
          </p>
          <p>
            <code>ldmatrix</code> 는 8개 행에서 16 B 씩 읽는데, 8행이 모두 같은 4개 bank 를
            건드리니 8-way conflict 가 나고 명령 하나가 8번에 걸쳐 실행됩니다.
          </p>
          <p>
            <code>Swizzle&lt;3,3,3&gt;</code> 은 offset 의 bit 3·4·5 (16 B chunk 번호, 0..7)를 bit
            6·7·8 (행 번호의 아래 3 bit)과 XOR 합니다. 행 r 의 chunk c 는 물리적으로 chunk{" "}
            c ⊕ (r mod 8) 에 놓입니다. 8개 행이 같은 논리 chunk c 를 읽으면 물리 chunk 는{" "}
            c⊕0 부터 c⊕7 까지 여덟 개가 모두 다르므로 bank 가 겹치지 않습니다.
          </p>
          <p>
            이 함수는 자기 자신이 역함수입니다. 쓸 때와 읽을 때 같은 XOR 을 적용하면 같은
            물리 위치에 닿으므로, global 에서 shared memory 로 올리는 copy 와 shared memory 에서
            register 로 올리는 <code>ldmatrix</code> 가 같은 swizzled layout 을 공유하면 됩니다.
            읽는 쪽이 8행 × 16 B 를 요구한다는 사실이 M = 3(16 B 단위)과 B = 3(8행)을 정합니다.
          </p>
          <p>
            행이 32 halves(64 B)인 tile 은 두 행이 128 B 를 나눠 쓰므로 conflict 가 4-way 로
            줄고 XOR 할 bit 도 2개면 됩니다. CuTe 의 <code>Swizzle&lt;2,3,3&gt;</code> 이 그 경우이며,
            첫 절의 128×128×32 tile 은 이 쪽입니다.
          </p>
          <p>
            하지만 swizzle 은 conflict 를 없앨 뿐 bank 대역폭 자체를 늘리지는 않습니다. TMA 가
            올리는 Hopper tile 은 descriptor 에 같은 swizzle 모드를 적어야 합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Swizzle 이 layout 함수와 합성된다는 것은 정확히 무슨 뜻인가요?"
          preview="Swizzle 은 정수 offset 을 정수 offset 으로 보내는 bijection 이고, CuTe 는 이것을 shape·stride layout 의 바깥에 합성해 하나의 layout 으로 다룹니다. 좌표 계산은 그대로이고 마지막 정수만 바뀝니다."
        >
          <p>
            CuTe 소스의 <code>Swizzle&lt;B,M,S&gt;::apply</code> 는{" "}
            <code>offset ^ ((offset &amp; yyy_mask) &gt;&gt; S)</code> 한 줄입니다. M 은 건드리지
            않는 하위 bit 수, B 는 XOR 에 참여하는 bit 수, S 는 두 bit 묶음 사이의 거리입니다.
            Halves 기준 offset 에서 M = 3 은 8 halves = 16 B 를 한 chunk 로 묶는다는 뜻입니다.
          </p>
          <p>
            <code>composition(Swizzle&lt;3,3,3&gt;{"{}"}, Layout&lt;Shape&lt;_8,_64&gt;, Stride&lt;_64,_1&gt;&gt;{"{}"})</code>
            이 CUTLASS 의 fp16 K-major shared memory layout atom 입니다.
          </p>
          <p>
            8×64 atom 을 <code>tile_to_shape</code> 로 128×64 tile 전체에 반복하면 각 8행 묶음
            안에서 같은 XOR 규칙이 적용됩니다. 이 atom 이 다음 글의 CollectiveMma 에{" "}
            <code>SmemLayoutAtomA</code> 로 들어갑니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          계층과 layout 규칙은 CUTLASS 문서와 CuTe 소스에서 읽었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Threadblock·warp·instruction 의 세 층과 shared memory·register 의 double buffering 은 CUTLASS 의
            efficient GEMM 문서가 설명하는 구조입니다. 이 글의 128×128×32 와 64×64 warp tile 은 그 구조에 Ampere fp16 명령 모양을 넣어 계산한
            산수이며 특정 GPU 에서 이 구성이 가장 빠르다는 뜻은 아닙니다.
          </p>
          <p>
            Layout 함수의 정의와 합성·divide 의 예는 CuTe 의 layout 과 layout algebra 문서에서,
            MMA atom 의 A·B·C layout 은 <code>mma_traits_sm80.hpp</code> 에서 가져왔습니다.{" "}
            <code>m16n8k16</code> 의 lane 규칙은 PTX ISA 의 fragment 절이 원 출처이며 CuTe layout 은
            그것을 shape·stride 로 옮겨 적은 것입니다.
          </p>
          <p>
            Epilogue visitor tree 의 fusion 결과는 EVT 논문의 저자 자기보고입니다. 이 글은
            visitor 가 fragment 를 방문하는 구조만 가져오고 논문의 속도 수치는 옮기지 않습니다.
          </p>
        </div>
        <div id="paper-cutlass-efficient-gemm" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUTLASS · Efficient GEMM in CUDA (media/docs/cpp/efficient_gemm.md)"
            citeKey={1}
            href="https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md"
          >
            Threadblock·warp·instruction 세 층의 tile 구조, shared memory tile 과 register
            fragment 의 double buffering, epilogue 가 shared memory 를 거쳐 coalesced store 를
            만드는 이유를 설명합니다. 구체 tile 수치는 문서가 아니라 이 글의 계산입니다.
          </CitationBlock>
        </div>
        <div id="paper-cute-layout-docs" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUTLASS · CuTe Layouts · Layout Algebra · Tensors (media/docs/cpp/cute/01~03)"
            citeKey={2}
            href="https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/02_layout_algebra.md"
          >
            Layout 을 shape·stride 쌍의 함수로 정의하고 coalesce·composition·complement·
            logical divide·product 를 예와 함께 적습니다. <code>20:2 ∘ (5,4):(4,1) = (5,4):(8,2)</code>,{" "}
            <code>local_tile</code>·<code>local_partition</code> 이 tiling 의 slicing 이라는 설명이 이 문서에 있습니다.
          </CitationBlock>
        </div>
        <div id="source-cute-mma-traits" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA/cutlass · include/cute/atom/mma_traits_sm80.hpp · include/cute/swizzle.hpp"
            citeKey={3}
            href="https://github.com/NVIDIA/cutlass/blob/main/include/cute/atom/mma_traits_sm80.hpp"
            type="code"
          >
            <code>SM80_16x8x16_F32F16F16F32_TN</code> 의 ALayout·BLayout·CLayout 과{" "}
            <code>Swizzle&lt;B,M,S&gt;::apply</code> 의 XOR 식을 이 소스에서 읽었습니다. Lane 규칙의
            원 출처는 PTX ISA 의 mma.m16n8k16 fragment 절입니다.
          </CitationBlock>
        </div>
        <div id="paper-evt" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Chen et al. · EVT: Accelerating Deep Learning Training with Epilogue Visitor Tree (ASPLOS 2024)"
            citeKey={4}
            href="https://dl.acm.org/doi/10.1145/3620666.3651369"
          >
            GEMM epilogue 에 elementwise·reduction·broadcast 연산을 tree 로 조립하는 epilogue
            visitor 를 compiler 가 자동 생성하도록 확장했습니다. 성능 수치는 논문의 model·GPU
            조건에서의 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/cutlass-collectives-and-tile-schedulers">CUTLASS collective, tile scheduler, Stream-K, cluster</Link>,
          그리고 이 층을 언제 고를지는 <Link to="/gpu/cuda-kernel-fusion#kernel-stack">CUTLASS·CuTe·Triton 선택 층</Link>.
        </p>
      </section>
    </div>
  );
}
