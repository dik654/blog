import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";
import CpuGpuCompareViz from "./viz/CpuGpuCompareViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GPU를 이해하는 가장 짧은 길은 명령 하나의 이동 경로를 따라가는 것입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          GPU 사양표에는 core·SM·warp·HBM·FLOPS가 한꺼번에 등장하지만, 이 이름을
          따로 외우면 왜 빠르거나 느린지 설명하기 어렵습니다. 먼저 CPU가
          buffer와 kernel launch를 준비하고, runtime이 grid를 만들며, hardware가
          block을 SM에 배치하고, warp가 instruction을 issue해
          register·cache·HBM을 읽는 <strong>하나의 고정 trace</strong>를
          붙잡아야 합니다.
        </p>
        <p>
          이 글의 핵심 아이디어는 GPU를 “core가 많은 CPU”가 아니라, 많은 독립
          thread state를 chip에 resident로 두고 기다리는 warp 대신 다른 warp를
          실행해 throughput을 높이는 processor로 읽는 것입니다.
          Grid·block·thread 좌표와 index 계산은{" "}
          <Link to="/gpu/cuda-thread-hierarchy">CUDA thread hierarchy 글</Link>
          이 정본이고, 여기서는 그 작업표가 실제 hardware와 memory traffic으로
          어떻게 내려가는지만 설명합니다.
        </p>
      </div>
      <ContentBoundary article="gpu-architecture" />
      <ContextViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="host-device-execution-trace" className="scroll-mt-24">
          Programming model과 hardware는 1:1 대응표가 아닙니다
        </h3>
        <p>
          Kernel launch가 만드는 grid와 block은 software가 표현한 작업
          단위입니다. 반면 SM(Streaming Multiprocessor), warp scheduler와
          execution unit은 그 작업을 실행하는 hardware입니다. Block은 실행되는
          동안 한 SM에 머물지만, 어느 SM에 언제 배치될지는 보장되지 않으며
          thread 하나가 CUDA core 하나를 계속 소유하지도 않습니다. SM은 block의
          thread를 32-lane warp로 묶어 ready instruction을 issue합니다.
        </p>
        <p>
          CPU는 보통 복잡한 분기와 한 thread의 지연을 줄이기 위해 큰 cache,
          branch prediction과 out-of-order 실행에 많은 transistor를 씁니다.
          GPU는 제어 자원을 상대적으로 줄이고 더 많은 arithmetic lane과 resident
          thread state를 둡니다. 그래서 동일한 계산을 충분히 많은 data에 적용할
          때 강하지만, 작업이 작거나 분기가 크게 갈리고 memory parallelism이
          부족하면 launch와 data movement 비용을 상쇄하지 못합니다.
        </p>
      </div>
      <CpuGpuCompareViz />
      <div
        id="paper-cuda-execution-model"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <CitationBlock
          source="NVIDIA CUDA Programming Guide — Programming Model"
          citeKey={1}
          href="https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html"
        >
          공식 guide는 thread block을 SM에 배치하는 경계와 32-thread warp의 SIMT
          실행을 설명합니다. 이는 모든 GPU 세대의 SM 내부 unit 수나 issue 폭이
          같다는 주장이 아니므로 target compute capability의 device property와
          profiler를 함께 확인해야 합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
