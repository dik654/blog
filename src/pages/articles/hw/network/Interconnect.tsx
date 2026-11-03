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
      <div className="mb-7 rounded-2xl border border-primary/25 bg-primary/5 p-5">
        <p className="text-xs font-black tracking-[0.15em] text-primary">한 문장 답</p>
        <p className="mt-2 text-lg font-bold leading-8">
          GPU interconnect 성능은 가장 큰 제품 사양이 아니라, 지금 옮길 buffer가 실제로 지나는 경로에서 가장 좁고 많이 공유되는 구간이 결정합니다.
        </p>
      </div>
      <InterconnectPathViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="one-buffer-trace" className="scroll-mt-24">
          <h3>먼저 1 GiB를 원격 GPU까지 보내 보겠습니다</h3>
          <p>
            출발 GPU와 같은 host에 있는 HCA까지는 PCIe 경로를 탑니다. 그다음 HCA가 packet을 만들어 400 Gb/s network로 보내고, 상대 HCA가 받은 data를 remote GPU memory에 놓습니다. GPUDirect RDMA 조건이 맞지 않으면 host memory를 거치는 별도 copy가 끼어들 수 있습니다.
          </p>
          <p>
            이 예의 PCIe 5.0 x16 raw 상한은 한 방향 약 63.0 GB/s이고, 400 Gb/s network는 bit를 byte로 바꾸면 50 GB/s입니다. 따라서 큰 buffer를 이어서 흘릴 때 첫 번째 raw 병목은 network입니다. 63과 50을 더해 113 GB/s라고 계산하지 않습니다.
          </p>
          <div className="not-prose my-6 grid gap-3 sm:grid-cols-3" aria-label="1 GiB 원격 전송의 계산 순서">
            <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs font-black text-primary">1 · 단위 통일</p><p className="mt-2 text-sm font-bold">1 GiB = 1.0737 GB</p><p className="mt-1 text-xs leading-5 text-muted-foreground">2진 byte 수를 network의 10진 GB/s와 맞춥니다.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs font-black text-primary">2 · 좁은 구간</p><p className="mt-2 text-sm font-bold">400 Gb/s ÷ 8 = 50 GB/s</p><p className="mt-1 text-xs leading-5 text-muted-foreground">63.0 GB/s PCIe보다 작은 raw 상한입니다.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs font-black text-primary">3 · 이상적 하한</p><p className="mt-2 text-sm font-bold">1.0737 ÷ 50 ≈ 21.5 ms</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Header·queue·retry를 넣기 전이라 실제 시간은 더 깁니다.</p></div>
          </div>
          <p>
            이 21.5 ms는 예측값이 아니라 <strong>그보다 빨라질 수 없는 이상적 하한</strong>입니다. 긴 streaming transfer는 여러 구간이 pipeline처럼 동시에 일하므로 보통 가장 좁은 구간이 속도를 정합니다. 반대로 host staging처럼 전체 buffer를 끝까지 복사한 뒤 다음 copy를 시작하면 두 copy의 시간이 따로 더해집니다.
          </p>
        </div>
        <div id="pcie-transaction-bandwidth-latency" className="scroll-mt-24">
          <h3>PCIe 숫자는 먼저 한 방향 raw 상한으로 바꿉니다</h3>
          <p>
            PCIe는 GPU, NIC와 CPU root complex를 잇는 범용 transaction fabric입니다. GPU kernel이 끝났더라도 결과가 다른 device로 가려면 이 경로의 lane·switch·root를 통과해야 합니다.
          </p>
          <p>
            사양의 GT/s는 초당 byte가 아닙니다. Lane 수와 encoding 효율을 적용해 한 방향 raw byte/s로 바꾼 다음, 실제 payload 완료량은 별도로 측정합니다.
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
            annotatedFormula={String.raw`\begin{aligned}
              R_{\mathrm{lanes}}&=\underbrace{R_{\mathrm{GT/s}}\times L}_{\text{모든 lane으로 확장}}\\[4pt]
              R_{\mathrm{bits}}&=\underbrace{R_{\mathrm{lanes}}\times\eta_{\mathrm{enc}}}_{\text{encoding overhead 제거}}\\[4pt]
              B_{\mathrm{PCIe,raw}}&=\underbrace{R_{\mathrm{bits}}\div 8}_{\text{bit를 byte로 변환}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`R_{\mathrm{GT/s}}\times L`, annotation: ["lane 하나의 transfer rate에", "실제 negotiated lane 수를 곱해 link 전체로 확장"] },
              { expression: String.raw`R_{\mathrm{lanes}}\times\eta_{\mathrm{enc}}`, annotation: ["encoding에 쓰이는 bit를 제외해", "payload 이전 단계의 유효 bit rate 계산"] },
              { expression: String.raw`R_{\mathrm{bits}}\div 8`, annotation: ["8 bit를 1 byte로 묶어", "복사 지표와 비교할 byte/s로 변환"] },
            ]}
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
            두 GPU가 같은 PCIe switch 아래 있으면 peer transaction이 그 switch에서 전달될 수 있습니다. 서로 다른 CPU root complex에 있으면 host bridge나 inter-socket 경계를 더 지나며, platform에 따라 peer access가 제한될 수도 있습니다.
          </p>
          <p>
            <code>nvidia-smi topo -m</code>에서 PIX는 한 PCIe switch, PXB는 여러 switch, PHB는 PCIe host bridge, SYS는 NUMA node 사이의 CPU interconnect까지 지나는 경로입니다. 이 표기는 거리표이지 bandwidth 측정값은 아닙니다.
          </p>
          <p>
            ACS, IOMMU와 virtualization policy도 P2P routing에 관여합니다. 먼저 GPU·NIC·NUMA·switch 관계를 기록하고, <code>nvidia-smi topo -p2p p</code>와 <code>-p2p n</code>으로 PCIe·NVLink peer capability를 나눠 확인합니다. 마지막으로 같은 pair의 copy bandwidth와 latency를 message size별로 잽니다.
          </p>
        </div>
        <div id="nvlink-device-fabric-boundary" className="scroll-mt-24">
          <h3>
            NVLink는 PCIe를 없애는 이름이 아니라 지원 peer 사이의 별도
            경로입니다
          </h3>
          <p>
            NVLink의 link 수, 세대와 NVSwitch 유무가 지원 GPU의 scale-up domain을 정합니다. NVIDIA가 공개하는 GPU당 aggregate bandwidth를 한 GPU pair의 편도 copy goodput이나 application 처리량으로 읽으면 안 됩니다.
          </p>
          <p>
            어떤 GPU라도 NVLink가 있거나 모든 access가 자동으로 그 경로를 쓰는 것도 아닙니다. Runtime peer access, collective topology와 buffer placement가 맞아야 합니다. Scale-up domain 밖의 NIC로 나가면 다시 GPU–HCA PCIe·GPUDirect 경계와 network fabric을 통과합니다. CUDA stream dependency는{" "}
            <Link to="/cs/gpu/cuda-sync-streams">동기화·스트림 글</Link>에서
            확인합니다.
          </p>
        </div>
        <div id="interconnect-measurement-order" className="scroll-mt-24">
          <h3>측정은 연결표 → 허용 여부 → 실제 전송 순서로 진행합니다</h3>
          <ol>
            <li><strong>Inventory:</strong> BDF, negotiated speed·width, GPU–GPU·GPU–NIC topology와 NUMA affinity를 저장합니다.</li>
            <li><strong>Capability:</strong> 이 pair가 PCIe P2P, NVLink P2P, GPUDirect RDMA를 지원하고 현재 정책이 허용하는지 확인합니다.</li>
            <li><strong>Transfer:</strong> 작은 message의 latency와 큰 message의 bandwidth를 pair별로 측정합니다. Idle baseline과 동시 traffic 조건을 나눕니다.</li>
            <li><strong>Application:</strong> 실제 rank 배치에서 collective p95·p99와 link counter를 같은 시간축에 놓습니다. 가장 느린 pair가 전체 barrier를 늦추는지 확인합니다.</li>
          </ol>
          <p>
            즉 <code>NV18</code>이나 <code>PIX</code>가 보인다는 사실은 시작점입니다. NVIDIA DCGM 문서도 topology가 관계를 설명할 뿐 application 성능, 모든 link의 현재 active 상태, bandwidth를 증명하지 않는다고 경계를 둡니다.
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
        <div id="paper-nvidia-topology" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA System Management Interface — Topology"
            citeKey={5}
            href="https://docs.nvidia.com/deploy/nvidia-smi/index.html#topology"
          >
            NVIDIA 공식 문서는 PIX·PXB·PHB·SYS·NV#의 경로 의미와 GPU·NIC·CPU affinity 조회 범위를 정의합니다. 이 inventory 표기를 active bandwidth 측정으로 확대하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-dcgm-pcie" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA DCGM — PCIe GPU Bandwidth Plugin"
            citeKey={6}
            href="https://docs.nvidia.com/datacenter/dcgm/latest/reference/diagnostics/plugins/pcie.html"
          >
            NVIDIA DCGM의 PCIe 진단은 link downtraining, 낮은 bandwidth, 높은 latency, recovery와 data corruption을 서로 다른 subtest로 확인합니다. 경쟁 transfer가 결과를 흐리지 않도록 idle GPU에서 실행해야 합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
