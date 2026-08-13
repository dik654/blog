import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";

const imageCode = `__global__ void brighten(float* image, int width, int height) {
  int col = blockIdx.x * blockDim.x + threadIdx.x;
  int row = blockIdx.y * blockDim.y + threadIdx.y;
  if (row < height && col < width) {
    size_t offset = static_cast<size_t>(row) * width + col;
    image[offset] = fminf(image[offset] + 0.1f, 1.0f);
  }
}

dim3 block(32, 8); // 256 threads; x축 인접 lane이 인접 pixel을 읽는다.
dim3 grid((width + block.x - 1) / block.x,
          (height + block.y - 1) / block.y);
brighten<<<grid, block>>>(d_image, width, height);`;

export default function Indexing2D() {
  return (
    <section id="indexing-2d" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        2D 좌표와 memory address는 서로 다른 단계입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Image에서는 x축을 column, y축을 row에 대응시키면 좌표 계산이
          직관적입니다. 하지만 C/C++의 flat row-major allocation에는 행 경계
          표시가 없으므로, <code>(row, col)</code>을 마지막에 linear offset으로
          바꿔야 합니다. 이 두 단계를 섞으면 width·height를 뒤집거나 rectangular
          image에서만 드러나는 bug가 생깁니다.
        </p>
      </div>
      <ExplainedFormula
        question="(row, col) 위치를 row-major 1D allocation의 몇 번째 원소로 바꿀까요?"
        idea={
          <>
            완전히 지나온 row가 row개이고 각 row에 width개 원소가 있으므로 row ×
            width만큼 건너간 뒤 현재 col을 더합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\mathrm{col}&=b_xB_x+t_x,\\
\mathrm{row}&=b_yB_y+t_y,\\
\mathrm{offset}&=\mathrm{row}\times W+\mathrm{col}.
\end{aligned}`}
        terms={[
          {
            symbol: "b_x,b_y",
            name: "block coordinates",
            description: "blockIdx.x와 blockIdx.y입니다.",
          },
          {
            symbol: "B_x,B_y",
            name: "block dimensions",
            description: "blockDim.x와 blockDim.y입니다.",
          },
          {
            symbol: "t_x,t_y",
            name: "thread coordinates",
            description: "threadIdx.x와 threadIdx.y입니다.",
          },
          {
            symbol: "W",
            name: "row width",
            description:
              "한 row에 저장된 element 수입니다. Byte pitch가 있으면 단순 W 대신 pitch를 반영해야 합니다.",
          },
        ]}
        assumptions={[
          "Allocation이 contiguous row-major이고 element마다 같은 byte 크기를 가집니다.",
          "row < H와 col < W를 확인한 뒤 접근합니다.",
          "cudaMallocPitch 같은 pitched allocation이나 multi-channel interleaving에는 그 layout의 stride를 사용해야 합니다.",
        ]}
        interpretation="W=5, row=2, col=3이면 offset=13입니다. W와 H를 바꾸면 5×3처럼 직사각형 data에서 다른 주소를 가리킵니다."
      />
      <CodePanel
        title="2D image mapping"
        code={imageCode}
        annotations={[
          { lines: [1, 4], color: "sky", note: "독립적인 row·column boundary" },
          { lines: [5, 7], color: "emerald", note: "Row-major linearization" },
          {
            lines: [10, 13],
            color: "amber",
            note: "x축을 warp-friendly하게 배치",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          정답 index와 빠른 index는 다릅니다
        </h3>
        <p>
          16×16과 32×8은 모두 256-thread block이고 같은 image를 올바르게 덮을 수
          있지만 memory transaction과 neighborhood reuse는 달라질 수 있습니다.
          Row-major image에서 <code>threadIdx.x</code>가 인접 column을 가리키면
          같은 warp lane의 주소가 가까워져 coalescing에 유리합니다. 반면
          stencil처럼 halo를 shared memory에 담는 kernel은 x·y tile 모양과 edge
          overhead도 함께 봐야 합니다. 먼저 rectangular·non-multiple shape로
          correctness를 검증한 뒤 Nsight Compute에서 global transaction
          efficiency와 occupancy를 비교합니다.
        </p>
      </div>
    </section>
  );
}
