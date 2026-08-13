import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import AsyncPipelineViz from "./viz/AsyncPipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CUDA 동기화는 모든 작업을 멈추는 기능이 아니라 필요한 순서만 표현하는
        도구입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Kernel launch와 asynchronous copy는 host가 API에서 돌아온 뒤에도
          device에서 진행될 수 있습니다. 이 비동기성 덕분에 CPU 준비,
          host↔device copy, kernel을 겹칠 수 있지만, consumer가 producer보다
          먼저 값을 읽으면 race condition이 생깁니다. 따라서 먼저{" "}
          <strong>누가 어떤 memory를 만들고 누가 언제 읽는지</strong>{" "}
          dependency를 적고, 그 dependency를 보장하는 가장 좁은 scope의
          primitive를 선택해야 합니다.
        </p>
        <p>
          Kernel 안에서는 warp·block·cluster 같은 execution group의 barrier와
          memory ordering이 중요하고, host가 제출한 작업 사이에서는{" "}
          <strong>stream</strong>의 in-order queue와 <strong>event</strong>의
          cross-stream edge가 중요합니다. <code>cudaDeviceSynchronize()</code>는
          device 전체의 host-visible completion을 기다리는 넓은 도구이므로
          correctness를 쉽게 만들지만 독립 작업까지 막을 수 있습니다.
        </p>
        <p>
          Thread block과 shared memory가 낯설다면{" "}
          <Link to="/gpu/cuda-thread-hierarchy">thread hierarchy</Link>와{" "}
          <Link to="/gpu/cuda-shared-memory">shared memory</Link>를 먼저 읽어도
          좋습니다. 이 글은 block barrier의 scope, stream ordering, event
          timing, multi-GPU context를 하나의 dependency graph로 연결합니다.
        </p>
      </div>
      <ContentBoundary article="cuda-sync-streams" />
      <AsyncPipelineViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Barrier와 memory visibility를 같은 범위에서 읽기
        </h3>
        <p>
          <code>__syncthreads()</code>는 block의 모든 participating thread가
          도달해야 하는 barrier이며, 그 지점 전의 shared/global memory access를
          block thread에게 보이게 하는 ordering 역할도 합니다. 일부 thread만
          barrier를 실행하는 divergent branch는 나머지가 영원히 기다리거나
          정의되지 않은 결과를 만들 수 있습니다. <code>__syncwarp(mask)</code>는
          warp subset에 더 좁은 scope를 제공하지만 mask의 모든 participating
          lane이 같은 protocol을 따라야 합니다.
        </p>
        <p>
          Barrier는 atomicity를 대신하지 않습니다. 여러 thread가 같은 counter에
          동시에 read–modify–write한다면 barrier를 앞뒤에 둬도 중간 update가
          손실될 수 있으므로 atomic operation이나 단일 writer reduction이
          필요합니다. 또한 kernel launch 사이 같은 stream ordering은 앞 kernel
          완료 뒤 다음 kernel이 시작되는 dependency를 표현하지만, 서로 다른
          streams는 event 등으로 edge를 추가하지 않으면 독립으로 간주됩니다.
        </p>
        <div id="paper-cuda-async" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Asynchronous Execution"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html"
          >
            <p>
              공식 guide는 asynchronous API가 concurrency를 표현할 뿐 실제
              overlap은 compute capability와 available hardware resources에
              의존한다고 구분합니다. Stream·event·device synchronization과
              default-stream semantics도 설정에 따라 달라질 수 있으므로, 이 글은
              stream 수만 늘리면 작업이 반드시 동시에 실행된다고 주장하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
