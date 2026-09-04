import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";

const multiGpuCode = `int count{};
cudaGetDeviceCount(&count);

for (int dev = 0; dev < count; ++dev) {
  cudaSetDevice(dev);                 // thread-local current device
  cudaStreamCreate(&streams[dev]);    // stream belongs to this device
  cudaMalloc(&buffers[dev], bytes);   // allocation belongs to this device
}

int can01{};
cudaDeviceCanAccessPeer(&can01, 0, 1);
if (can01) {
  cudaSetDevice(0);
  cudaDeviceEnablePeerAccess(1, 0);
  cudaMemcpyPeerAsync(buffers[1], 1, buffers[0], 0, bytes, streams[0]);
}`;

export default function MultiGpu() {
  return (
    <section id="multi-gpu" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Multi-GPU에서는 stream·event·allocation이 어느 device에 속하는지부터
        추적합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>cudaSetDevice</code>는 host thread의 current device를 바꾸며,
          이후 allocation·stream·event·kernel launch는 그 device context에
          연결됩니다. Device를 바꾼 뒤 예전 stream을 실수로 넘기면
          invalid-resource error나 예상하지 못한 ordering을 만날 수 있습니다.
          Resource handle 옆에 device ID를 보관하고 API wrapper에서 일치 여부를
          검사하는 편이 안전합니다.
        </p>
        <p>
          Peer-to-peer(P2P) access는 두 GPU가 같은 node에 있다는 사실만으로
          보장되지 않습니다. <code>cudaDeviceCanAccessPeer</code>로 방향별
          capability를 확인하고, PCIe/NVLink topology·IOMMU·MIG·driver 조건을
          기록해야 합니다. P2P가 가능해도 bandwidth와 latency는 path마다 다르며,
          여러 GPU가 같은 link를 공유하면 contention이 생깁니다. Collective
          communication이 목적이라면 수동 peer copy와 NCCL의 topology-aware
          algorithm을 같은 것으로 보지 않습니다.
        </p>
      </div>
      <CodePanel
        title="Device ownership과 P2P capability 확인"
        code={multiGpuCode}
        annotations={[
          { lines: [1, 2], color: "sky", note: "Available devices query" },
          {
            lines: [4, 8],
            color: "emerald",
            note: "Resource ownership by current device",
          },
          {
            lines: [10, 15],
            color: "amber",
            note: "방향별 peer capability와 copy",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Scale-out 판단은 GPU 개수보다 partition ratio, peer bytes,
          synchronization frequency를 먼저 봅니다. 각 GPU가 10 ms 계산하고
          iteration마다 12 ms peer exchange를 기다리면 두 GPU를 써도 전체
          throughput이 두 배가 될 수 없습니다. Single-GPU reference와 같은
          input/result tolerance를 유지한 채 compute time·copy time·idle
          time·link counters를 device별 timeline으로 비교합니다.
        </p>
        <div id="paper-cuda-multi-gpu" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Programming Systems with Multiple GPUs"
            citeKey={2}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html"
          >
            <p>
              공식 guide는 allocation·launch·stream·event가 current device와 연결된다는 ownership 규칙과 peer access 절차를
              설명합니다. Event와 stream이 다른 devices에 속할 때 일부 API가 실패하며 topology별 peer capability와 성능은
              query·measurement가 필요합니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
