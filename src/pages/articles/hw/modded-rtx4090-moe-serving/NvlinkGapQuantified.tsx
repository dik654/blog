import { CitationBlock } from "@/components/ui/citation-block";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import NvlinkGapQuantifiedViz from "./viz/NvlinkGapQuantifiedViz";

const SPECS = [
  ["RTX 4090", "PCIe Gen4 x16", "31.5GB/s 편도 · 63GB/s 양방향 합", "CUDA P2P 미지원. 실제 GPU↔GPU 경로는 호스트 staging 가능"],
  ["RTX 3090", "2-way NVLink bridge", "56.25GB/s/방향 · 112.5GB/s 합", "지정된 카드 한 쌍만 연결"],
  ["HGX/DGX A100", "NVLink + NVSwitch", "600GB/s/GPU 양방향", "8-way fabric의 GPU-to-GPU 명목 사양"],
  ["DGX H100", "NVLink + NVSwitch", "900GB/s/GPU 양방향", "8-way fabric의 GPU-to-GPU 명목 사양"],
] as const;

export default function NvlinkGapQuantified() {
  return (
    <section id="nvlink-gap-quantified" data-calculation-explained className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4090에서는 PCIe 사양과 실제 GPU 간 경로를 구분해야 한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="4090-has-no-pins" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">NVLink도 CUDA P2P도 없다</h3>
        <p className="leading-7">
          RTX 4090 PCB에는 두 카드를 잇는 NVLink 커넥터가 없다. 더 중요한 점은 NVIDIA 엔지니어링 답변상 RTX 4090은
          CUDA peer-to-peer도 지원하지 않는다는 사실이다. 그러므로 “같은 root complex에 꽂으면 GPU끼리 PCIe로 직접
          복사한다”고 가정할 수 없다. NCCL은 CUDA가 P2P 가능하다고 보고할 때만 그 transport를 선호하며, 불가능하면
          호스트 메모리를 거치는 경로를 쓸 수 있다.
        </p>

        <h3 id="pcie-only-ceiling" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">31.5GB/s는 슬롯의 한 방향 raw ceiling이다</h3>
        <p className="leading-7">
          PCIe Gen4의 16GT/s, x16 lane, 128b/130b encoding을 넣으면
          <code>16 × 16 × 128/130 ÷ 8 ≈ 31.5GB/s</code>가 나온다. 계산 순서는 lane 전체의 초당 전송량
          <code>256GT/s</code>를 만든 뒤 encoding 효율을 곱하고 bit를 byte로 바꾸는 것이다. 반대 방향도 동시에 같은
          raw rate를 낼 수 있어 양방향 합은 약 63GB/s다.
        </p>
        <p className="leading-7">
          하지만 dispatch 한 번의 payload를 옮기는 시간에 63GB/s를 분모로 쓰면 안 된다. 한 방향 전송의 상한은
          31.5GB/s이고, protocol overhead와 호스트 staging이 추가되면 실제 goodput은 더 낮다. 먼저
          <code>nvidia-smi topo -p2p p</code>로 pair 상태를 확인하고 NVIDIA가 권하는 <code>nvbandwidth</code>로
          device-to-device 경로를 측정한다.
        </p>

        <h3 id="3090-nvlink-baseline" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">3090은 지정된 한 쌍에 NVLink 경로가 있었다</h3>
        <p className="leading-7">
          RTX 3090의 NVLink bridge는 공식적으로 방향당 56.25GB/s, 양방향 합 112.5GB/s다. PCIe 양방향 합 63GB/s와
          숫자만 비교하면 약 1.8배지만, 이것은 같은 의미의 명목 aggregate끼리 나눈 비율이다. Application collective가
          1.8배 빨라진다는 보장은 아니며 3-way·4-way fabric으로 확장되는 구조도 아니다.
        </p>

        <h3 id="datacenter-nvswitch-baseline" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">A100·H100 수치는 시스템 fabric 사양이다</h3>
        <p className="leading-7">
          HGX/DGX A100은 GPU당 600GB/s, DGX H100은 GPU당 900GB/s GPU-to-GPU 양방향 대역폭을 공개한다.
          4090의 63GB/s 양방향 raw 합과 나누면 각각 약 9.5배와 14.3배다.
        </p>
        <p className="leading-7">
          이 비율은 인터페이스 규모를 보여 줄 뿐이다. 모든 GPU 쌍이 각자 600·900GB/s를 독점하거나 애플리케이션 p99가
          같은 배수만큼 개선된다는 뜻은 아니다. NVSwitch의 장점은 fabric 안에서 균일한 고대역폭 경로를 제공하는 데 있다.
          실제 collective goodput은 message size, contention, 알고리즘과 topology를 포함해 측정한다.
        </p>
      </div>

      <div className="not-prose my-6">
        <ResponsiveVizTable
          columns={["GPU/시스템", "링크", "명목 수치", "읽을 때의 경계"]}
          rows={SPECS.map((row) => [...row])}
          desktopMinWidthClassName="min-w-[600px]"
        />
      </div>

      <div className="not-prose"><NvlinkGapQuantifiedViz /></div>

      <CitationBlock source="NVIDIA Developer Forums · Engineering response" citeKey={3} href="https://forums.developer.nvidia.com/t/standard-nvidia-cuda-tests-fail-with-dual-rtx-4090-linux-box/233202/16">
        NVIDIA 엔지니어링 피드백은 RTX 4090에서 peer-to-peer를 지원하지 않으며 드라이버가 해당 구성을 P2P 가능으로 보고하지 않도록 수정한다고 명시한다.
      </CitationBlock>
      <CitationBlock source="NVIDIA NCCL 2.32.3 · GPU troubleshooting" citeKey={4} href="https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html">
        NCCL은 CUDA가 직접 접근 가능하다고 보고할 때 P2P transport를 사용한다. 문서는 nvidia-smi topo -p2p로 상태를 확인하고 nvbandwidth로 pair별 실제 대역폭을 재라고 권한다.
      </CitationBlock>
      <CitationBlock source="NVIDIA · GA102, HGX A100, DGX H100 공식 문서" citeKey={5} href="https://www.nvidia.com/content/PDF/nvidia-ampere-ga-102-gpu-architecture-whitepaper-v2.1.pdf">
        RTX 3090 NVLink 112.5GB/s, A100 600GB/s, H100 900GB/s는 각각 NVIDIA 공식 문서의 명목 GPU-to-GPU 양방향 수치다. 서로 다른 시스템의 application goodput이나 latency를 직접 보증하지 않는다.
      </CitationBlock>
    </section>
  );
}
