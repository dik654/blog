import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";
import MemoryAccessViz from "./viz/MemoryAccessViz";

const tileCode = `__global__ void reuseTile(const float* input, float* output, int n) {
  extern __shared__ float tile[];
  int lane = threadIdx.x;
  int i = blockIdx.x * blockDim.x + lane;

  tile[lane] = (i < n) ? input[i] : 0.0f; // stage once
  __syncthreads();                         // publish to the block

  if (i < n) {
    float left = (lane > 0) ? tile[lane - 1] : 0.0f;
    output[i] = left + tile[lane];         // reuse on-chip data
  }
}`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Shared memory는 “빠른 배열”이 아니라 block이 함께 관리하는
        scratchpad입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          GPU kernel이 느릴 때 global memory 값을 shared memory로 복사하는
          것만으로는 해결되지 않습니다. 추가 copy와 barrier 비용을 냈다면, 같은
          block의 thread가 그 값을 여러 번 재사용하거나 global address를 더
          효율적인 순서로 바꾸어야 합니다. Shared memory는 SM에 있는
          programmer-managed on-chip storage이며, allocation의 lifetime과
          visibility는 기본적으로 thread block에 묶입니다.
        </p>
        <p>
          이 글은 두 병목을 분리합니다. <strong>Coalescing</strong>은 한 warp의
          global addresses를 몇 개의 memory transaction으로 처리하는지 묻고,{" "}
          <strong>bank conflict</strong>는 shared-memory request가 같은 bank의
          서로 다른 주소에 몰려 몇 번으로 직렬화되는지 묻습니다. 둘은 같은 “연속
          접근” 문구로 설명되곤 하지만 hardware 위치와 고치는 방법이 다릅니다.
        </p>
        <p>
          Grid·block·warp·index가 낯설다면{" "}
          <Link to="/gpu/cuda-thread-hierarchy">CUDA thread hierarchy</Link>의
          1D 예제를 먼저 읽으면 됩니다. 이 글에서는 각 lane의 byte address가
          global segment와 shared bank로 어떻게 바뀌는지부터 계산합니다.
        </p>
      </div>
      <ContentBoundary article="cuda-shared-memory" />
      <MemoryAccessViz />
      <ExplainedFormula
        question="Shared-memory tile이 global-memory traffic을 얼마나 줄일 가능성이 있을까요?"
        idea={
          <>
            한 번 stage한 값이 R번 사용된다면 원래 R번 global load하던 byte를 한
            번의 global load와 R번의 on-chip access로 바꿉니다. 다만 tile
            overhead도 분모에 포함해야 합니다.
          </>
        }
        formula={String.raw`\text{global bytes per use}\approx\frac{B_{\mathrm{load}}+B_{\mathrm{store}}}{R}`}
        terms={[
          {
            symbol: "B_load",
            name: "tile load bytes",
            description:
              "Block이 global memory에서 tile로 가져온 총 byte입니다.",
          },
          {
            symbol: "B_store",
            name: "result store bytes",
            description: "최종 output을 global memory에 쓰는 총 byte입니다.",
          },
          {
            symbol: "R",
            name: "reuse count",
            description:
              "Stage한 값이 useful computation에서 재사용되는 횟수입니다.",
          },
        ]}
        assumptions={[
          "Cache hit와 transaction over-fetch를 단순화한 traffic model입니다.",
          "Shared-memory allocation과 barrier가 occupancy·latency에 주는 비용은 별도로 측정합니다.",
          "R=1이면 staging 자체가 global traffic을 줄이지 못할 수 있습니다.",
        ]}
        interpretation="128 B tile을 8번 재사용하고 128 B 결과를 쓰면 use당 약 32 B입니다. 하지만 edge에서 절반만 쓰거나 bank conflict가 생기면 이 단순 이득은 줄어듭니다."
      />
      <CodePanel
        title="Load → block barrier → reuse"
        code={tileCode}
        annotations={[
          {
            lines: [1, 4],
            color: "sky",
            note: "Block-local shared allocation",
          },
          {
            lines: [6, 7],
            color: "emerald",
            note: "Stage 후 visibility barrier",
          },
          {
            lines: [9, 12],
            color: "amber",
            note: "다른 thread가 load한 값 재사용",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Shared memory capacity는 device와 kernel configuration에 따라
          달라지며, static allocation과 launch의 dynamic shared bytes를 합쳐
          block당 자원으로 계산합니다. 한 block이 너무 많이 쓰면 한 SM에 동시에
          머무는 block 수가 줄어 memory latency를 숨기기 어려울 수 있습니다.
          “Global보다 몇 배 빠르다”는 고정 latency 숫자 대신, target GPU에서
          shared throughput·bank conflicts·occupancy·kernel time을 함께 측정해야
          합니다.
        </p>
        <div id="paper-cuda-memory" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Writing SIMT Kernels, Memory Performance"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html#memory-performance"
          >
            <p>
              공식 guide는 global access를 32-byte transaction 관점에서
              설명하고, shared memory를 32 banks의 동시 접근 구조로 설명합니다.
              Matrix transpose 예제는 shared memory가 global read/write를
              coalescing하고 block thread 사이 data를 교환하는 두 역할을 보여
              줍니다. 이 예제가 임의 kernel에서 자동 speedup을 보장하는 것은
              아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
