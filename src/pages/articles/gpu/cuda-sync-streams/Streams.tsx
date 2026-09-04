import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";

const pipelineCode = `cudaStream_t streams[2];
cudaStreamCreateWithFlags(&streams[0], cudaStreamNonBlocking);
cudaStreamCreateWithFlags(&streams[1], cudaStreamNonBlocking);

// h_in/h_out은 cudaMallocHost로 만든 pinned buffers라고 가정한다.
for (int chunk = 0; chunk < chunks; ++chunk) {
  int s = chunk % 2;
  size_t offset = chunk * chunkElems;
  cudaMemcpyAsync(d_in[s], h_in + offset, bytes,
                  cudaMemcpyHostToDevice, streams[s]);
  process<<<grid, block, 0, streams[s]>>>(d_in[s], d_out[s], chunkElems);
  cudaMemcpyAsync(h_out + offset, d_out[s], bytes,
                  cudaMemcpyDeviceToHost, streams[s]);
}
cudaStreamSynchronize(streams[0]);
cudaStreamSynchronize(streams[1]);`;

export default function Streams() {
  return (
    <section id="streams" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Stream은 같은 queue 안의 순서를 보장하고, 다른 queue 사이 독립성을
        표현합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 stream에 enqueue한 H2D copy → kernel → D2H copy는 제출 순서대로 실행됩니다. 서로 다른 streams의 작업은 dependency가 없다고
          표현되며 hardware copy engine·compute engine·memory bandwidth·kernel resource가 허용할 때 overlap할 수 있습니다.
          Default stream은 legacy와 per-thread mode, blocking/non-blocking stream 조합에 따라 interaction이 달라질 수 있으므로
          build option과 creation flag를 기록해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Copy와 compute를 pipeline했을 때 chunk당 steady-state 하한은 무엇일까요?"
        idea={
          <>
            서로 완전히 겹칠 수 있다면 세 단계의 합이 아니라 가장 오래 걸리는
            stage가 다음 chunk의 간격을 제한합니다. 처음 채우고 마지막 비우는
            latency는 별도로 남습니다.
          </>
        }
        formula={String.raw`T_{\mathrm{steady}}\ge\max(T_{\mathrm{H2D}},T_{\mathrm{kernel}},T_{\mathrm{D2H}})`}
        annotatedFormula={String.raw`T_{\mathrm{steady}}\ge\underbrace{\max(T_{\mathrm{H2D}},T_{\mathrm{kernel}},T_{\mathrm{D2H}})}_{\text{경계 후보 선택}}`}
        operations={[
          { expression: String.raw`\max(T_{\mathrm{H2D}},T_{\mathrm{kernel}},T_{\mathrm{D2H}})`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","서로 완전히 겹칠 수 있다면 세 단계의 합이 아니라 가장 오래","걸리는 stage가 다음 chunk의 간격을 제한합니다."] },
        ]}
        terms={[
          {
            symbol: "T_H2D",
            name: "host-to-device time",
            description: "한 chunk를 device로 보내는 시간입니다.",
          },
          {
            symbol: "T_kernel",
            name: "compute time",
            description: "한 chunk kernel 실행 시간입니다.",
          },
          {
            symbol: "T_D2H",
            name: "device-to-host time",
            description: "한 chunk 결과를 host로 돌려보내는 시간입니다.",
          },
          {
            symbol: "T_steady",
            name: "steady-state interval",
            description:
              "Pipeline이 찬 뒤 chunk 결과가 나오는 최소 간격입니다.",
          },
        ]}
        assumptions={[
          "독립 copy/compute engine과 충분한 resource가 있고 chunk 사이 data dependency가 없습니다.",
          "Host buffer는 pinned memory이며 async copy 조건을 충족합니다.",
          "PCIe/NVLink bandwidth contention·launch overhead·pipeline fill/drain은 이 하한에 추가됩니다.",
        ]}
        interpretation="H2D=2 ms, kernel=5 ms, D2H=2 ms면 순차 합은 9 ms지만 이상적인 steady state는 chunk당 5 ms 아래로 갈 수 없습니다. 실제로 7 ms라면 overlap gap을 timeline에서 찾습니다."
      />
      <CodePanel
        title="두 stream으로 chunk pipeline 구성"
        code={pipelineCode}
        annotations={[
          { lines: [1, 3], color: "sky", note: "Non-blocking streams" },
          {
            lines: [5, 13],
            color: "emerald",
            note: "각 stream 안의 copy→kernel→copy 순서",
          },
          {
            lines: [15, 16],
            color: "amber",
            note: "필요한 streams만 completion 대기",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Pinned memory와 chunk size의 trade-off
        </h3>
        <p>
          Page-locked host memory는 DMA를 안정적으로 수행하게 해 async
          transfer와 overlap에 필요하지만 OS가 paging할 수 없는 자원을
          차지합니다. 전체 dataset을 무조건 pin하지 말고 재사용할 bounded
          staging buffers를 만듭니다. Chunk가 너무 작으면 launch·API overhead가
          지배하고, 너무 크면 pipeline을 채우는 시간이 길고 overlap 기회가
          줄어듭니다. Nsight Systems timeline에서 copy engine과 kernel lane이
          실제로 겹치는지, pageable fallback·implicit
          synchronization·same-buffer reuse가 gap을 만드는지 확인합니다.
        </p>
      </div>
    </section>
  );
}
