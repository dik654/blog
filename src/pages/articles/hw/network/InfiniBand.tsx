import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CollectiveFabricViz from "./viz/CollectiveFabricViz";

const components = [
  {
    part: "HCA",
    role: "host channel adapter와 RDMA queue·DMA",
    verify: "PCIe width·NUMA/GPU affinity·port width·firmware",
  },
  {
    part: "switch",
    role: "point-to-point link를 fabric path로 전달",
    verify: "radix·tier·routing·congestion·adaptive routing support",
  },
  {
    part: "subnet management",
    role: "fabric discovery, LID·route·partition 운영",
    verify: "active/standby·config backup·topology change 시간",
  },
  {
    part: "cable·module",
    role: "lane을 copper·optical media로 연결",
    verify: "data rate·width·reach·FEC·qualified part",
  },
] as const;

const choices = [
  {
    fabric: "socket Ethernet",
    strength: "범용 IP 운영과 software 호환성",
    cost: "host stack·copy와 congestion에서의 tail을 검증",
  },
  {
    fabric: "RoCE v2",
    strength: "routed Ethernet에서 RDMA semantics",
    cost: "queue·ECN/PFC·NIC congestion control의 공동 운영",
  },
  {
    fabric: "InfiniBand",
    strength: "RDMA 중심의 표준 switched fabric과 HPC ecosystem",
    cost: "별도 fabric 운영·subnet management·qualified hardware",
  },
] as const;

export default function InfiniBand() {
  return (
    <section id="infiniband" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        InfiniBand와 GPU collective fabric
      </h2>
      <div className="not-prose mb-8">
        <CollectiveFabricViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="collective-rank-semantics" className="scroll-mt-24">
          <p className="leading-7">
            InfiniBand는 GPU 전용이거나 단일 회사의 비공개 protocol이 아니라
            server·storage 연결을 위한 IBTA 표준 channel-based switched
            fabric이다. Reliable messaging와 RDMA semantics,
            HCA·switch·subnet management를 하나의 ecosystem으로 제공해 HPC와
            분산 학습에 널리 쓰인다. 다만 collective는 fabric 이름만으로
            빨라지지 않는다. 같은 count와 datatype으로 참여한 rank들의 위치,
            node 안 NVLink·PCIe 경로, node 밖 HCA와 fabric 경로, message size와
            algorithm이 함께 완료 시간을 만든다.
          </p>
        </div>

        <div
          data-viz="infiniband-component-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[0.7fr_1.15fr_1.5fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>구성 요소</span>
            <span>역할</span>
            <span>배치 전 검증</span>
          </div>
          <div className="divide-y divide-border/70">
            {components.map((row) => (
              <article
                key={row.part}
                className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.7fr_1.15fr_1.5fr] md:gap-3"
              >
                <strong>{row.part}</strong>
                <p className="min-w-0 break-words leading-6">{row.role}</p>
                <p className="min-w-0 break-words leading-6 text-muted-foreground">
                  {row.verify}
                </p>
              </article>
            ))}
          </div>
        </div>

        <h3 className="mt-8 mb-3 text-xl font-semibold">
          NDR·XDR 이름만으로 포트 bandwidth를 읽지 않는다
        </h3>
        <p className="leading-7">
          InfiniBand data rate 세대는 lane 속도를 포함한 규격 이름이고, 실제
          port는 1x·2x·4x 같은 link width와 encoding·FEC를 조합한다. 같은
          세대라도 adapter port, switch port와 cable breakout 방식에 따라
          aggregate와 endpoint rate가 달라질 수 있다. 따라서 IBTA 규격 세대,
          제품의 실제 width, 단방향·양방향 표기와 application payload goodput을
          구분해 기록한다.
        </p>

        <h3
          id="nccl-bandwidth-boundary"
          className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
        >
          노드 안과 밖의 topology를 함께 본다
        </h3>
        <p className="leading-7">
          GPU collective는 노드 안의 NVLink·PCIe와 노드 밖의 HCA·fabric을
          연속해서 사용한다. Rank가 어느 GPU에 있고 그 GPU에서 가장 가까운
          HCA가 무엇인지, collective algorithm이 ring·tree 등의 path를 어떻게
          만드는지가 성능에 영향을 준다. 단일 pair bandwidth 다음에는 실제 rank
          수와 message size로 all-reduce·all-gather·reduce-scatter를 측정하고,
          operation time·algorithm bandwidth·bus bandwidth를 함께 비교한다.
        </p>

        <ExplainedFormula
          question="NCCL all-reduce에서 algbw와 busbw는 왜 같은 숫자가 아닌가?"
          idea={
            <p>
              algbw는 input size를 완료 시간으로 나눈 사용자 관점의 속도입니다.
              nccl-tests의 busbw는 point-to-point transfer model에서 all-reduce가
              rank당 주고받아야 하는 양을 반영하려고 rank 수에 따른 보정 계수를
              곱한 비교 지표입니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            B_{\mathrm{alg}}&=\frac{S}{t} \\
            B_{\mathrm{bus}}&=B_{\mathrm{alg}}\frac{2(n-1)}{n}
          \end{aligned}`}
          terms={[
            { symbol: "S", name: "collective input size", description: "nccl-tests가 한 rank의 all-reduce 입력으로 보고하는 byte 수입니다." },
            { symbol: "t", name: "operation time", description: "해당 collective 한 번이 완료되는 평균 시간입니다." },
            { symbol: "n", name: "rank count", description: "같은 communicator의 collective에 참여한 총 rank 수입니다." },
            { symbol: "B_{\\mathrm{alg}}", name: "algorithm bandwidth", description: "같은 크기의 작업 완료 시간을 예측하기 쉬운 S/t입니다." },
            { symbol: "B_{\\mathrm{bus}}", name: "nccl-tests bus bandwidth", description: "Flat send/receive model의 hardware 사용률 비교를 위한 all-reduce 보정값입니다." },
          ]}
          assumptions={[
            "NCCL tests 문서의 point-to-point transfer accounting을 적용합니다.",
            "Reduction offload나 계층형 hardware algorithm에서는 busbw가 물리 link traffic과 일치하지 않을 수 있습니다.",
            "GB/s 단위, message size, rank 수, algorithm/protocol, topology를 함께 기록합니다.",
          ]}
          interpretation="16 ranks라면 보정 계수는 1.875입니다. Busbw는 application이 1초에 처리한 tensor byte가 아니며, 최신 offload algorithm에서는 실제 wire counter로 해석하면 안 됩니다."
        />

        <div
          data-viz="collective-fabric-choice-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[0.8fr_1.2fr_1.5fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>선택지</span>
            <span>강점</span>
            <span>운영 비용</span>
          </div>
          <div className="divide-y divide-border/70">
            {choices.map((row) => (
              <article
                key={row.fabric}
                className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.8fr_1.2fr_1.5fr] md:gap-3"
              >
                <strong>{row.fabric}</strong>
                <p className="min-w-0 break-words leading-6">{row.strength}</p>
                <p className="min-w-0 break-words leading-6 text-muted-foreground">
                  {row.cost}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="not-prose my-6 rounded-r-lg border-l border-emerald-500/60 bg-emerald-500/5 p-4">
          <p className="mb-1 font-semibold">선택 기준</p>
          <p className="text-sm leading-6">
            같은 모델·rank placement·message size에서 collective 완료 시간과 GPU
            utilization을 비교하고, 혼잡·link loss 후 회복과 팀이 운영할 수 있는
            telemetry까지 포함해 fabric을 결정한다.
          </p>
        </div>

        <div id="paper-infiniband-fabric" className="scroll-mt-24">
          <CitationBlock
            source="InfiniBand Trade Association — About InfiniBand"
            citeKey={8}
            href="https://www.infinibandta.org/about-infiniband/"
          >
            InfiniBand를 server·storage·communication 장비를 연결하는 표준
            switched fabric으로 정의하고 reliable messaging와 RDMA 역할을
            설명한다.
          </CitationBlock>
        </div>
        <CitationBlock
          source="IBTA — XDR Specification Announcement"
          citeKey={9}
          href="https://www.infinibandta.org/ibta-unveils-xdr-infiniband-specification-to-enable-the-next-generation-of-ai-and-scientific-computing/"
        >
          NDR의 물리 규격과 XDR의 lane·port rate가 규격 release에 따라 정의됨을
          보여 주어 세대명과 실제 port 구성을 구분해야 하는 근거를 제공한다.
        </CitationBlock>
        <div id="paper-nccl-tests-performance" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA nccl-tests — Performance reported by NCCL tests"
            citeKey={10}
            href="https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md"
          >
            Collective별 algbw와 busbw의 정의·보정 계수와, busbw가 flat
            point-to-point accounting에서 hardware 비교를 돕는 지표라는 경계를
            설명한다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
