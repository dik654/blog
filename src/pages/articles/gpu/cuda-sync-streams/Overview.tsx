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
          Barrier는 atomicity를 대신하지 않습니다. 여러 thread가 같은 counter에 동시에 read–modify–write한다면 barrier를 앞뒤에 둬도 중간
          update가 손실될 수 있으므로 atomic operation이나 단일 writer reduction이 필요합니다. 또한 kernel launch 사이 같은 stream
          ordering은 앞 kernel 완료 뒤 다음 kernel이 시작되는 dependency를 표현하지만 서로 다른 streams는 event 등으로 edge를 추가하지 않으면
          독립으로 간주됩니다.
        </p>
        <div id="paper-cuda-async" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Asynchronous Execution"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html"
          >
            <p>
              공식 guide는 asynchronous API가 concurrency를 표현할 뿐 실제 overlap은 compute capability와 available
              hardware resources에 의존한다고 구분합니다. Stream·event·device synchronization과 default-stream semantics도
              설정에 따라 달라질 수 있으므로 이 글은 stream 수만 늘리면 작업이 반드시 동시에 실행된다고 주장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div id="warp-sync" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Warp shuffle·vote로 block보다 좁게 동기화하기
        </h3>
        <p>
          같은 block 안에서도 32개 thread로 이뤄진 warp 내부에서만 값을
          맞추고 싶다면 <code>__syncthreads()</code> 전체를 쓸 필요가
          없습니다. <code>__shfl_sync</code>·<code>__ballot_sync</code>·
          <code>__any_sync</code> 같은 warp shuffle·vote 명령은 mask로 지정한
          participating lane끼리 register 값을 직접 교환하거나 조건을
          집계합니다.
        </p>
        <p>
          <code>__syncwarp(mask)</code>는 이 명령들 앞뒤에서 mask에 포함된
          lane이 서로 같은 지점에 도달했다는 것만 보장하며, mask 밖 lane이나
          block의 다른 warp는 관여하지 않습니다. Volta 이후 independent
          thread scheduling에서 예전 warp-synchronous 가정에 기대는 코드는
          이 명시적 동기화 없이는 재확인이 필요합니다.
        </p>
        <div id="paper-cuda-warp-sync" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Advanced Kernel Programming"
            citeKey={3}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html"
          >
            <p>
              공식 guide는 Volta 이전 GPU를 겨냥해 작성된 warp-synchronous
              코드를 재검토하고 <code>__syncwarp()</code>로 명시적으로
              동기화하라고 권고합니다. Independent thread scheduling
              이후에는 같은 warp의 thread들이 항상 lock-step으로 실행된다고
              가정할 수 없기 때문입니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div id="named-async-barrier" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          한 block 안에 barrier를 여러 개 두거나 도착과 대기를 분리하기
        </h3>
        <p>
          <a
            href="https://docs.nvidia.com/cuda/parallel-thread-execution/index.html"
            target="_blank"
            rel="noreferrer"
          >
            PTX
          </a>
          의 <code>bar.sync</code> 명령은 barrier resource id(0~15)를 받아,
          한 thread block 안에 서로 독립된 여러 개의 barrier를 동시에 둘 수
          있습니다. 이를 <strong>named barrier</strong>라고 부르며, 서로
          다른 warp 그룹이 서로 다른 barrier에서 각자 대기하는 producer·
          consumer 구조에 씁니다.
        </p>
        <p>
          <code>cuda::barrier</code>는 여기서 한 걸음 더 나아가 도착
          (arrive)과 대기(wait)를 분리한 <strong>asynchronous barrier</strong>
          입니다. Thread가 <code>bar.arrive()</code>로 참여만 등록하고 다른
          작업을 계속하다가 나중에 <code>bar.wait(token)</code>으로 그
          phase의 완료를 확인할 수 있어, block 전체를 동시에 멈추는{" "}
          <code>__syncthreads()</code>보다 세밀한 겹침이 가능합니다.
        </p>
        <div id="paper-cuda-async-barrier" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Asynchronous Barriers"
            citeKey={4}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-barriers.html"
          >
            <p>
              공식 guide는 asynchronous barrier가{" "}
              <code>__syncthreads()</code>·<code>__syncwarp()</code>보다
              세밀한 non-blocking 조정을 제공하지만, block 전체나 warp
              전체를 동기화하는 것이 목적이라면 성능을 위해 여전히{" "}
              <code>__syncthreads()</code>·<code>__syncwarp()</code>를
              권장한다고 밝힙니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div id="memory-fence" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Barrier보다 가벼운 memory fence
        </h3>
        <p>
          Barrier는 도착을 기다리는 rendezvous이지만{" "}
          <code>__threadfence_block()</code>·<code>__threadfence()</code>·
          <code>__threadfence_system()</code>은 다른 thread를 기다리지 않고
          자신이 쓴 값이 보이는 순서만 정합니다. Block·device·host+다른
          device로 visibility 범위만 넓어질 뿐, 누가 언제 그 값을 읽었는지는
          보장하지 않습니다.
        </p>
        <p>
          따라서 fence 뒤에 다른 thread가 실제로 그 값을 읽었는지는 fence가 정하지 않으며 "언제 읽어도 되는가"는 여전히 barrier나 별도 flag 변수로 신호를 보내야
          합니다. Barrier보다 가볍지만 rendezvous를 대신하지는 않습니다.
        </p>
        <div id="paper-cuda-memory-fence" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA C++ Programming Guide — Memory Fence Functions"
            citeKey={5}
            href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/#memory-fence-functions"
          >
            <p>
              공식 guide는 memory fence 함수들이 thread 사이 memory access의
              ordering만 보장하며 barrier처럼 서로의 도착을 기다리게 하지
              않는다고 구분합니다. 범위(block·device·system)에 따라{" "}
              <code>__threadfence_block</code>·<code>__threadfence</code>·
              <code>__threadfence_system</code> 세 함수를 나눠 제공합니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div id="sync-overhead-divergence" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Barrier가 공짜가 아닌 이유: overhead와 divergence
        </h3>
        <p>
          Barrier는 공짜가 아닙니다. 가장 늦게 도착하는 thread(또는 warp) 까지 나머지가 기다리므로 load imbalance가 있으면 그 대기 시간이
          synchronization overhead로 그대로 드러납니다. 불필요하게 barrier를 자주 두거나 넓은 scope를 쓰면 독립적으로 진행할 수 있었던 작업까지 함께
          멈춥니다.
        </p>
        <p>
          더 심각한 문제는 barrier divergence입니다. 조건문 안에{" "}
          <code>__syncthreads()</code>나 <code>__syncwarp(mask)</code>를 두고
          일부 thread·lane만 그 경로를 타면, 나머지는 barrier에 영원히
          도착하지 않아 kernel이 멈추거나 정의되지 않은 동작이 됩니다.
          Barrier는 반드시 같은 scope의 participant 전원이 실행하는 코드
          경로에 둬야 합니다.
        </p>
      </div>
    </section>
  );
}
