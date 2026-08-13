import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ThreadHierarchyViz from "./viz/ThreadHierarchyViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        수백만 번의 같은 계산을 GPU에 맡기려면 먼저 작업표를 만들어야 합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          CPU에서는 반복문이 다음 원소를 차례로 처리하지만, CUDA kernel은 많은
          logical thread가 각자 맡을 원소를 고릅니다. 이때{" "}
          <strong>grid → thread block → thread</strong>는 작업을 나누는 software
          hierarchy이고, <strong>SM(Streaming Multiprocessor) → warp</strong>는
          GPU가 그 작업을 실제로 실행하는 데 중요한 hardware 경계입니다. 둘을
          같은 것으로 외우면 block 수와 core 수를 1:1로 맞추거나 thread 하나가
          특정 core를 계속 점유한다고 잘못 이해하게 됩니다.
        </p>
        <p>
          핵심 아이디어는 data shape와 독립적인 작은 block을 충분히 만들어
          scheduler에 넘기는 것입니다. 한 block의 thread는 실행되는 동안 하나의
          SM에 머물며 shared memory와 block barrier를 공유하지만, 여러 block은
          순서 없이 어느 SM에든 배치될 수 있습니다. SM은 block 안 thread를 32개
          lane의 <strong>warp</strong>로 묶어 SIMT(Single Instruction, Multiple
          Threads) 방식으로 명령을 발행합니다. Branch가 갈리면 lane 일부를 잠시
          mask하므로 logical thread가 독립적이어도 실행 비용은 warp 단위로
          생깁니다.
        </p>
        <p>
          이 글은 C/C++ 배열의 0-based index와 row-major 저장만 바닥부터 다시
          설명합니다. Shared memory transaction은{" "}
          <Link to="/gpu/cuda-shared-memory">공유 메모리 글</Link>, block
          barrier와 stream ordering은{" "}
          <Link to="/gpu/cuda-sync-streams">동기화·스트림 글</Link>에서
          이어집니다.
        </p>
      </div>
      <ContentBoundary article="cuda-thread-hierarchy" />
      <ThreadHierarchyViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Software 계층과 hardware 실행을 분리해서 읽기
        </h3>
        <p>
          Kernel launch 하나가 grid 하나를 만들고, grid는 1D·2D·3D block 좌표를
          갖습니다. Block도 1D·2D·3D thread 좌표를 가질 수 있지만 전체 thread
          수와 각 차원 한도는 device 속성에 의존합니다. 흔히 쓰는 256
          threads/block은 보편 법칙이 아니라 warp 배수이면서 resource usage와
          occupancy를 조정하기 쉬운 출발점입니다. 실제 선택은{" "}
          <code>cudaGetDeviceProperties</code>와 profiler로 확인해야 합니다.
        </p>
        <p>
          Warp의 32 lanes가 같은 kernel instruction을 함께 처리하더라도 각
          lane은 서로 다른 register state와 address를 가집니다.{" "}
          <code>if (threadIdx.x % 2 == 0)</code>처럼 같은 warp에서 조건이 갈리면
          두 경로가 순차적으로 발행될 수 있어 utilization이 줄지만, 결과가 곧
          틀리는 것은 아닙니다. 반대로 warp가 항상 lockstep일 것이라고 가정해
          memory ordering이나 communication을 생략하면 architecture와 compiler에
          따라 정의되지 않은 동작이 될 수 있으므로 명시적 synchronization
          primitive를 사용해야 합니다.
        </p>
        <div id="paper-cuda-thread-model" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Programming Model"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html"
          >
            <p>
              공식 guide는 grid·block·thread의 programming hierarchy와 32-thread
              warp의 SIMT 실행을 구분합니다. 또한 compute capability 9.0부터의
              thread block cluster는 선택적 추가 계층이며, portable cluster
              size와 distributed shared memory 조건은 device별로 확인해야
              합니다. 이 글은 모든 CUDA GPU에 cluster가 있다는 뜻으로 일반화하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
