import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";

const transposeCode = `__global__ void transpose(const float* in, float* out, int w, int h) {
  __shared__ float tile[32][33]; // +1 avoids column bank conflict
  int x = blockIdx.x * 32 + threadIdx.x;
  int y = blockIdx.y * 32 + threadIdx.y;

  if (x < w && y < h) tile[threadIdx.y][threadIdx.x] = in[y * w + x];
  __syncthreads();

  int ox = blockIdx.y * 32 + threadIdx.x;
  int oy = blockIdx.x * 32 + threadIdx.y;
  if (ox < h && oy < w) out[oy * h + ox] = tile[threadIdx.x][threadIdx.y];
}`;

export default function Coalescing() {
  return (
    <section id="coalescing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Coalescing은 useful byte를 적은 global transaction으로 가져오는
        문제입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Warp의 한 load instruction에는 최대 32개의 address가 생깁니다. Memory
          coalescer는 이 address가 걸친 32-byte segment를 모아 필요한
          transaction을 발행합니다. “연속이면 한 번”이라고 외우면 32 float가 128
          B이므로 최소 네 개의 32 B transaction이 필요하다는 사실을 놓칩니다.
          중요한 것은 requested byte 중 실제로 사용한 byte의 비율입니다.
        </p>
      </div>
      <ExplainedFormula
        question="Warp load가 옮긴 byte 중 kernel이 실제로 사용한 비율은 얼마일까요?"
        idea={
          <>
            Active lane이 요구한 useful byte를 그 address들을 덮기 위해 발행된
            32 B segment 수로 나눕니다.
          </>
        }
        formula={String.raw`\eta_{\mathrm{global}}=\frac{B_{\mathrm{useful}}}{32\ \mathrm{B}\times T}`}
        annotatedFormula={String.raw`\eta_{\mathrm{global}}=\underbrace{\frac{B_{\mathrm{useful}}}{32\ \mathrm{B}\times T}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{B_{\mathrm{useful}}}{32\ \mathrm{B}\times T}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Active lane이 요구한 useful byte를 그","address들을 덮기 위해 발행된 32 B segment","수로 나눕니다."] },
        ]}
        terms={[
          {
            symbol: "B_useful",
            name: "requested useful bytes",
            description:
              "Active lanes가 결과 계산에 실제 사용하는 byte 합입니다.",
          },
          {
            symbol: "T",
            name: "32-byte transaction count",
            description:
              "Warp instruction의 address set을 충족하는 global memory transaction 수입니다.",
          },
          {
            symbol: "η_global",
            name: "load efficiency model",
            description: "0과 1 사이의 단순화한 byte utilization입니다.",
          },
        ]}
        assumptions={[
          "Current guide의 32-byte transaction 관점으로 설명하며 cache hit·ECC·replay·architecture-specific path는 단순화합니다.",
          "Address alignment와 active lane mask가 T를 바꿉니다.",
          "높은 효율이 곧 compute throughput 향상을 보장하지는 않습니다.",
        ]}
        interpretation="Aligned float 32개면 useful 128 B, T=4라서 η=1입니다. 각 lane이 서로 다른 32 B segment의 float 하나만 읽으면 T=32이고 η=128/1024=12.5%입니다."
      />
      <CodePanel
        title="Shared-memory transpose로 global read와 write를 모두 연속화"
        code={transposeCode}
        annotations={[
          { lines: [1, 3], color: "sky", note: "Padded shared tile" },
          {
            lines: [6, 7],
            color: "emerald",
            note: "Row 방향 coalesced load 후 barrier",
          },
          {
            lines: [9, 11],
            color: "amber",
            note: "좌표를 바꿔 coalesced store",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Transpose tile은 global access 순서를 바꾸기 위해 shared memory를
          사용한 예입니다. Load를 마치기 전에 다른 thread가 tile을 읽으면 race가
          되므로 barrier가 필요하고, <code>tile[32][33]</code> padding은 전치된
          column read의 bank conflict를 줄입니다. Edge block에서는 out-of-range
          lane이 있어도 모든 thread가 barrier에 도달해야 하므로 barrier 자체를
          조건문 안에 넣지 않습니다.
        </p>
        <p>
          Profiler에서는 단순한 kernel time뿐 아니라 requested/actual sectors,
          DRAM throughput, shared bank conflict, barrier stall을 함께 봅니다. L2
          cache가 대부분을 흡수하거나 계산이 더 오래 걸리는 kernel에서는
          coalescing 개선이 end-to-end latency에 거의 나타나지 않을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
