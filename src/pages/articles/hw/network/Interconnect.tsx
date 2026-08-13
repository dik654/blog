import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InterconnectPathViz from "./viz/InterconnectPathViz";

export default function Interconnect() {
  return (
    <section id="interconnect" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PCIe·NVLink에서 NIC·fabric까지: device 밖 경로를 한 번에 봅니다
      </h2>
      <InterconnectPathViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="pcie-transaction-bandwidth-latency" className="scroll-mt-24">
          <p>
            GPU kernel이 끝나도 결과가 다른 GPU나 node로 가려면 interconnect를
            통과해야 합니다. PCIe는 CPU root complex, GPU와 NIC를 연결하는 범용
            transaction fabric이고, NVLink는 지원되는 GPU 사이에 더 높은
            대역폭과 peer access를 제공하는 device interconnect입니다. Node
            밖에서는 HCA와 Ethernet·InfiniBand fabric이 이어집니다. 각 구간의
            peak rate를 더하는 것이 아니라 실제 path에서 가장 좁고 가장 많이
            공유되는 구간을 찾아야 합니다.
          </p>
          <ExplainedFormula
            question="PCIe link의 raw transfer rate에서 한 방향 byte/s 상한을 어떻게 계산하는가?"
            idea={
              <p>
                Lane당 transfer rate에 lane 수를 곱하고 physical encoding
                efficiency를 적용한 뒤 bit를 byte로 바꿉니다. Packet header와
                flow control은 그 다음 단계의 payload 손실입니다.
              </p>
            }
            formula={
              "B_{\\mathrm{PCIe,raw}}=R_{\\mathrm{GT/s}}\\times L\\times\\eta_{\\mathrm{enc}}\\div 8"
            }
            terms={[
              {
                symbol: "R_{\\mathrm{GT/s}}",
                name: "lane transfer rate",
                description: "Lane 하나의 초당 giga-transfer 수입니다.",
              },
              {
                symbol: "L",
                name: "negotiated lane width",
                description: "실제로 link training된 x4·x8·x16 lane 수입니다.",
              },
              {
                symbol: "\\eta_{\\mathrm{enc}}",
                name: "encoding efficiency",
                description: "예를 들어 128b/130b라면 128/130입니다.",
              },
              {
                symbol: "B_{\\mathrm{PCIe,raw}}",
                name: "raw data-rate ceiling",
                description:
                  "한 방향의 byte/s 상한이며 application payload goodput은 아닙니다.",
              },
            ]}
            assumptions={[
              "표기한 generation의 transfer rate와 encoding을 사용하고 negotiated width를 실제 장치에서 확인합니다.",
              "TLP/DLLP header, flow control, switch contention, DMA setup와 direction change는 생략합니다.",
              "Duplex 양방향 합을 단방향 복사 bandwidth와 섞지 않습니다.",
            ]}
            interpretation="PCIe 5.0 x16은 32GT/s×16×128/130÷8≈63GB/s의 한 방향 raw 상한입니다. 실제 host↔device copy는 protocol overhead와 topology 때문에 더 낮고, 작은 transfer는 bandwidth보다 latency가 지배할 수 있습니다."
          />
        </div>
        <div id="pcie-topology-peer-path" className="scroll-mt-24">
          <h3>같은 x16이라도 topology가 다르면 peer path가 달라집니다</h3>
          <p>
            두 GPU가 같은 PCIe switch 아래 있으면 peer transaction이 그
            switch에서 전달될 수 있지만, 서로 다른 CPU root complex에 있으면
            host inter-socket link를 돌아야 하거나 peer access 자체가 제한될 수
            있습니다. ACS, IOMMU와 virtualization policy도 P2P routing에
            관여합니다. 먼저
            <code>nvidia-smi topo -m</code> 같은 inventory로 GPU·NIC·NUMA·switch
            관계를 기록하고, P2P capability와 copy bandwidth·latency를 pair별로
            측정합니다.
          </p>
        </div>
        <div id="nvlink-device-fabric-boundary" className="scroll-mt-24">
          <h3>
            NVLink는 PCIe를 없애는 이름이 아니라 지원 peer 사이의 별도
            경로입니다
          </h3>
          <p>
            NVLink의 link 수와 세대별 lane rate, NVSwitch 유무가 실제 GPU pair의
            aggregate path를 정합니다. 어떤 GPU라도 NVLink가 있거나 모든
            access가 자동으로 그 경로를 쓰는 것은 아닙니다. Runtime의 peer
            access, collective topology와 buffer placement가 맞아야 하며, node
            밖 NIC로 나갈 때는 다시 GPU–HCA PCIe·GPUDirect 경계를 통과합니다.
            CUDA stream dependency는{" "}
            <Link to="/gpu/cuda-sync-streams">동기화·스트림 글</Link>에서
            확인합니다.
          </p>
        </div>
        <div id="paper-pcie-base" className="scroll-mt-24">
          <CitationBlock
            source="PCI-SIG — PCI Express Base Specification"
            citeKey={3}
            href="https://pcisig.com/specifications"
          >
            PCI-SIG는 generation별 data rate, lane width와 protocol 계층을
            정의합니다. 사양상 signaling rate는 제품의 negotiated width,
            topology와 application payload 성능을 보장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-nvlink-fabric" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA NVLink and NVSwitch"
            citeKey={4}
            href="https://www.nvidia.com/en-us/data-center/nvlink/"
          >
            NVIDIA 공식 자료는 제품 세대별 NVLink·NVSwitch 연결 범위와 aggregate
            bandwidth를 제시합니다. 수치는 해당 GPU·system topology에만 귀속하며
            PCIe·network goodput과 같은 지표로 읽지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
