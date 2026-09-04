import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RdmaPathViz from "./viz/RdmaPathViz";

const paths = [
  {
    axis: "control path",
    socket: "socket·buffer·connection을 OS와 runtime이 관리",
    rdma: "memory 등록, queue pair와 completion queue 설정",
  },
  {
    axis: "data movement",
    socket: "kernel network stack과 host buffer copy가 포함될 수 있음",
    rdma: "등록된 memory 사이를 NIC DMA engine이 전송",
  },
  {
    axis: "completion",
    socket: "syscall·event loop·runtime callback",
    rdma: "completion queue polling 또는 event",
  },
  {
    axis: "failure handling",
    socket: "TCP retransmit·congestion control·connection semantics",
    rdma: "transport·provider별 retry, timeout과 queue recovery",
  },
];

const tests = [
  [
    "micro",
    "message size·queue depth별 one-way/RTT와 uni/bi-direction goodput",
  ],
  [
    "contention",
    "many-to-one incast, all-to-all, mixed message와 background bulk flow",
  ],
  [
    "telemetry",
    "NIC·switch의 drop·ECN·CNP·PFC·retransmit·buffer·pause duration",
  ],
  [
    "recovery",
    "link flap·route change·process restart·queue error 뒤 재연결 시간",
  ],
];

export default function RDMA() {
  return (
    <section id="rdma" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        RDMA와 RoCE v2의 실제 데이터 경로
      </h2>
      <div className="not-prose mb-8">
        <RdmaPathViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="rdma-control-data-path" className="scroll-mt-24">
          <p className="leading-7">
          RDMA(Remote Direct Memory Access)는 애플리케이션이 등록한 memory와 NIC queue를 사용해 data movement를 DMA로 처리하는 전송
          모델이다. 큰 payload의 copy와 kernel data path 부담을 줄일 수 있지만 CPU가 사라지는 것은 아니다. memory pinning·등록, work
          request 제출, completion 처리, 연결과 오류 복구에는 host software와 CPU가 계속 관여한다. 핵심은 control path를 없애는 것이 아니라
          반복되는 payload movement를 등록된 memory와 NIC queue 사이의 비동기 경로로 옮기는 데 있다.
        </p>
        </div>

        <div data-viz="rdma-path-comparison-ledger" className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[0.75fr_1.25fr_1.25fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>경로</span><span>일반 socket 전송</span><span>RDMA 전송</span>
          </div>
          <div className="divide-y divide-border/70">
            {paths.map((row) => (
              <article key={row.axis} className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.75fr_1.25fr_1.25fr] md:gap-3">
                <strong>{row.axis}</strong>
                <p className="min-w-0 break-words leading-6">{row.socket}</p>
                <p className="min-w-0 break-words leading-6 text-muted-foreground">{row.rdma}</p>
              </article>
            ))}
          </div>
        </div>

        <h3
          id="rdma-memory-registration"
          className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
        >
          Memory registration은 성능 옵션이면서 접근 권한이다
        </h3>
        <p className="leading-7">
          RDMA NIC는 process의 임의 virtual address를 곧바로 읽지 못한다. 애플리케이션은 사용할 memory range와 local/remote read·write
          권한을 등록하고 NIC가 해석할 address mapping과 lkey·rkey를 얻는다. 이 등록은 page pinning과 device mapping 비용이 있으므로 매
          message마다 반복하지 않고 buffer lifetime에 맞춰 cache한다. 해제된 buffer의 key를 계속 노출하지 않도록 lifetime과 revoke 순서를 함께
          관리해야 한다.
        </p>

        <h3 id="roce-gid-routing" className="scroll-mt-24 text-xl font-semibold mt-8 mb-3">
          RoCE v2는 Ethernet 위의 RDMA transport
        </h3>
        <p className="leading-7">
          RoCE v1은 link layer 범위이고 RoCE v2는 UDP/IP encapsulation으로 routed fabric을 통과할 수 있다. IP address를
          netdev에 붙이면 driver는 그 주소와 RoCE version에 대응하는 GID table entry를 만들며 connected QP는 INIT→RTR 전환 시 source
          GID index와 remote address vector를 사용한다. 한 HCA에 여러 subnet이 있으면 실제 peer로 갈 수 있는 netdev·address·RoCE
          type을 함께 골라야 한다. “아무 GID나 하나”로는 안 된다.
        </p>
        <ExplainedFormula
          question="여러 local IP 가운데 remote peer와 같은 IPv4 subnet에 있는 주소는 어떻게 판정하는가?"
          idea={
            <p>
              Prefix length p로 만든 bit mask를 local·remote IPv4 주소에 각각
              적용한 network prefix가 같으면 같은 subnet입니다. GID가 IPv4-mapped
              IPv6 형식이라면 먼저 마지막 32bit의 IPv4 값을 복원합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            &\operatorname{sameSubnet}_p(a,b) \\
            &\qquad\iff (a\land M_p)=(b\land M_p)
          \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
            s_a&=\underbrace{a\land M_p}_{\text{local host bit 제거}}\\[4pt]
            s_b&=\underbrace{b\land M_p}_{\text{remote host bit 제거}}\\[4pt]
            \mathrm{same}_p&=\underbrace{\mathbf 1[s_a=s_b]}_{\text{prefix 같으면 1}}
          \end{aligned}`}
          operations={[
            { expression: String.raw`a\land M_p`, annotation: ["local IPv4의 host bit를 0으로 만들고", "prefix identity만 추출"] },
            { expression: String.raw`b\land M_p`, annotation: ["remote IPv4에도 동일한 mask를 적용해", "같은 길이의 prefix를 추출"] },
            { expression: String.raw`a_{\mathrm{net}}=b_{\mathrm{net}}`, annotation: ["추출한 prefix를 비교해", "direct subnet의 local GID 후보인지 판정"] },
          ]}
          terms={[
            { symbol: "a,b", name: "endpoint IPv4 addresses", description: "비교할 local GID의 IPv4 값과 remote peer GID의 IPv4 값입니다." },
            { symbol: "p", name: "prefix length", description: "/30처럼 network prefix로 사용할 상위 bit 수입니다." },
            { symbol: "M_p", name: "subnet mask", description: "상위 p bit가 1이고 나머지가 0인 32bit mask입니다." },
            { symbol: "s_a,s_b", name: "masked network prefixes", description: "Local·remote 주소에서 host bit를 지운 뒤 남은 network prefix입니다." },
            { symbol: "\\mathrm{same}_p", name: "same-subnet indicator", description: "두 prefix가 같으면 1, 다르면 0인 후보 판정값입니다." },
            { symbol: "\\land", name: "bitwise AND", description: "Host bit를 지우고 network prefix만 남기는 bit 연산입니다." },
          ]}
          assumptions={[
            "두 주소를 같은 byte order의 32bit IPv4 값으로 변환했습니다.",
            "Route나 gateway가 없는 direct link에서는 같은 subnet인 local address를 선택합니다.",
            "같은 prefix에 여러 interface가 있으면 subnet 일치만으로 cable identity를 유일하게 정할 수 없습니다.",
          ]}
          interpretation="Subnet 일치는 필요한 조건이지만 항상 충분하지 않습니다. 같은 /16 안에 여러 /30 cable이 있다면 /16 비교는 엉뚱한 local GID도 통과시키므로 실제 link prefix를 사용해야 합니다."
        />
        <p className="leading-7">
          이것이 평범한 Ethernet 설정에서 자동으로 낮은 tail latency를
          보장한다는 뜻은 아니다.
          NIC와 switch가 지원하는 lossless·semi-lossless·lossy mode를 확인하고
          ECN threshold, sender congestion control, traffic class와 buffer를
          end-to-end로 맞춰야 한다. PFC를 쓰는 경우 pause propagation과
          head-of-line blocking도 관찰한다.
        </p>

        <h3 id="gpudirect-topology" className="scroll-mt-24 text-xl font-semibold mt-8 mb-3">
          GPUDirect RDMA도 topology가 조건이다
        </h3>
        <p className="leading-7">
          GPUDirect RDMA는 NIC와 GPU memory 사이에 직접 DMA path를 제공해 CPU bounce buffer를 줄인다. 하지만 GPU와 NIC의 PCIe root
          complex, IOMMU·ACS, BAR와 driver 지원이 경로 성능을 좌우하므로 GPU별 NIC affinity를 확인하고 host-staged path와 실제
          collective 결과를 비교해야 한다.
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tests.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold mb-1">{title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div id="paper-roce-gid" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA Networking — RDMA over Converged Ethernet"
            citeKey={5}
            href="https://docs.nvidia.com/networking/display/mlnxenv23102131201lts/RDMA+over+Converged+Ethernet+(RoCE)"
          >
            RoCE v1·v2의 packet 계층, IP address에서 GID table이 만들어지는 방식,
            connected QP가 source GID index를 사용하는 경계를 설명한다.
          </CitationBlock>
        </div>
        <CitationBlock
          source="NVIDIA Onyx — RoCE Modes"
          citeKey={6}
          href="https://docs.nvidia.com/networking/display/nvidiaonyxusermanualv3104006/roce%2Bcommands"
        >
          RoCE fabric이 lossless·semi-lossless·lossy mode로 구성될 수 있고
          mode마다 PFC와 ECN 동작이 달라짐을 명시한다.
        </CitationBlock>
        <div id="paper-gpudirect-rdma" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA — GPUDirect RDMA"
            citeKey={7}
            href="https://docs.nvidia.com/cuda/gpudirect-rdma/"
          >
            GPU와 NIC 같은 peer device 사이의 direct PCIe data path, memory
            pinning과 root-complex 등 platform 제약을 설명한다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
