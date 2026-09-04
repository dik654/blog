import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function MultiGpuVramStrategies() {
  return (
    <section id="multi-gpu-vram-strategies" className="scroll-mt-20 space-y-7">
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>Known floor를 넘으면 2-way 분배·offloading·unified memory로 나눕니다</h2>
        <p className="leading-8">
          Known floor가 device 하나의 usable capacity를 넘으면 세 갈래로 대응합니다. Weight를 두 GPU에 나누는 2-way 구성, 일부를 CPU host memory로 내리는 offloading, 애초에 GPU와 host가 큰 주소 공간을 공유하는 unified/large memory입니다.
        </p>

        <h3 id="two-way-gpu-configuration" className="scroll-mt-20">
          2-way 구성은 weight 지분을 줄이되 통신을 더합니다
        </h3>
        <p className="leading-8">
          BF16 51.75GiB는 48GiB 카드 한 장에 못 들어가지만, tensor parallel degree 2로 나누면 장당 weight 지분은 약 25.9GiB로 줄어 여유가 생깁니다. 이 분할 방법 자체는{" "}
          <Link to="/ai/tensor-and-pipeline-parallel-inference#tensor-parallel">tensor parallel linear sharding 글</Link>에서 다룹니다.
        </p>
        <p className="leading-8">
          다만 장당 지분이 여유롭다고 통신이 사라지지는 않습니다. Layer마다 attention 뒤와 MLP 뒤로 all-reduce가 두 번 더해집니다. 이 통신 비용은 TP
          degree를 올려도 layer 수만큼 남는 고정 비율입니다.
        </p>

        <h3 id="cpu-gpu-offloading" className="scroll-mt-20">
          CPU/GPU offloading은 일부 weight를 host에 두고 옮깁니다
        </h3>
        <p className="leading-8">
          CPU/GPU offloading은 일부 layer의 weight를 host RAM에 두고 필요할 때만 PCIe로 옮기는 방법입니다. 48GiB 카드에서 44GiB만 안전하게
          쓴다면 51.75GiB 중 약 15%인 약 7.75GiB를 host에 내려야 나머지가 들어갑니다.
        </p>
        <p className="leading-8">
          다만 host에 내린 layer는 decode마다 그 바이트를 PCIe로 다시 옮겨야 하므로 대역폭이 부족하면 offload 비율만큼 step 시간이 늘어날 수 있습니다.
        </p>

        <h3 id="unified-large-memory" className="scroll-mt-20">
          Unified/large memory는 residency 문제 자체를 피합니다
        </h3>
        <p className="leading-8">
          Unified/large memory capacity는 GPU와 host가 애초에 하나의 큰 주소 공간을 공유하는 아키텍처입니다. 수백 GiB급 usable capacity가
          있으면 이 글의 BF16 known floor 전체를 파티션 없이 담을 수 있습니다.
        </p>
        <p className="leading-8">
          다만 이런 아키텍처는 discrete GPU HBM보다 대역폭이 낮은 경우가 많습니다. capacity 문제를 없애는 대신 bandwidth 여유를 다시 확인하는 단계가 남습니다.
        </p>
      </div>

      <TermBreakdown
        title="Known floor 초과 시 세 대응을 비교합니다"
        items={[
          {
            term: "2-way GPU 구성",
            description: "Weight를 두 GPU에 나눠 담는 tensor parallel 배분입니다.",
            example: "BF16 51.75GiB가 장당 약 25.9GiB로 줄어듭니다.",
            boundary: "Layer마다 두 번의 all-reduce 통신 비용이 degree와 무관하게 남습니다.",
          },
          {
            term: "CPU/GPU offloading",
            description: "일부 weight를 host RAM에 두고 필요할 때 PCIe로 옮깁니다.",
            example: "48GiB 카드라면 약 7.75GiB(15%)만 내려도 나머지가 들어갑니다.",
            boundary: "Offload된 만큼 decode마다 PCIe 전송이 추가돼 step 시간이 늘 수 있습니다.",
          },
          {
            term: "Unified/large memory",
            description: "GPU와 host가 하나의 큰 주소 공간을 공유하는 아키텍처입니다.",
            example: "수백 GiB급 capacity면 BF16 known floor 전체가 파티션 없이 들어갑니다.",
            boundary: "Discrete GPU보다 낮은 대역폭이 흔해 별도로 확인해야 합니다.",
          },
        ]}
      />
    </section>
  );
}
