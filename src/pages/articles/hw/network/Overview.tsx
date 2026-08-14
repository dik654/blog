import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContentBoundary from "@/components/articles/content-boundary";
import NetworkLearningFlowViz from "./viz/NetworkLearningFlowViz";

const axes = [
  {
    label: "트래픽 모양",
    detail:
      "message 크기·동시 flow·fan-in/out·burst·collective와 read/write 방향",
    color: "text-indigo-500",
  },
  {
    label: "종단 지표",
    detail:
      "link rate가 아니라 goodput·flow completion·p99 latency·CPU/GPU wait",
    color: "text-cyan-500",
  },
  {
    label: "fabric 구조",
    detail: "NIC·PCIe·leaf·spine의 path 수, oversubscription과 장애 영역",
    color: "text-amber-500",
  },
  {
    label: "운영성",
    detail: "FEC·CRC·drop·ECN·PFC·retransmit·queue·route 변화의 관찰과 복구",
    color: "text-emerald-500",
  },
];

const workflow = [
  [
    "1",
    "트래픽 행렬 기록",
    "누가 누구에게 언제 얼마나 보내는지 workload 단계별로 측정",
  ],
  [
    "2",
    "병목 예산 계산",
    "NIC·PCIe·uplink·spine의 양방향 usable bandwidth와 동시성을 비교",
  ],
  [
    "3",
    "전송 계층 선택",
    "socket Ethernet, RoCE 또는 InfiniBand를 software·운영 요구와 함께 결정",
  ],
  [
    "4",
    "혼잡·장애 시험",
    "incast, background traffic, link loss와 route convergence에서 tail을 검증",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        서버 네트워크는 workload에서 시작한다
      </h2>
      <NetworkLearningFlowViz mode="fundamentals" />
      <ContentBoundary article="hw-network" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="workload-contract" className="scroll-mt-24">
          <p className="leading-7">
            서버 네트워크는 케이블 속도를 고르는 문제처럼 보이지만, 실제로는
            <strong> 어떤 endpoint가 누구에게 얼마를 언제 보내는지</strong>를
            정하는 문제다. 같은 100 Gb/s 링크라도 큰 checkpoint 하나를 옮기는
            흐름과 수백 rank가 barrier에 맞춰 all-to-all을 수행하는 흐름은
            queue와 tail latency가 전혀 다르게 나타난다. 먼저
            source·destination·message size·동시 flow·burst를 기록한 traffic
            matrix를 만들고, 그다음에 링크와 fabric이 이를 감당하는지 계산해야
            한다.
          </p>
        </div>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {axes.map((axis) => (
            <div
              key={axis.label}
              className="rounded-lg border border-border/60 p-4"
            >
              <p className={`text-xs font-semibold mb-2 ${axis.color}`}>
                {axis.label}
              </p>
              <p className="text-sm leading-6">{axis.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          링크 구매 전 네 단계
        </h3>
        <div className="not-prose my-6 space-y-3">
          {workflow.map(([number, title, body]) => (
            <div
              key={number}
              className="flex gap-4 rounded-lg border border-border/60 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-500">
                {number}
              </span>
              <div>
                <p className="font-semibold mb-1">{title}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div id="goodput-boundary" className="scroll-mt-24">
          <ExplainedFormula
            question="800 Gb/s라고 적힌 포트에서 애플리케이션이 실제로 옮긴 데이터 속도는 어떻게 구분하는가?"
            idea={
              <p>
                포트의 line rate는 wire가 전달하는 bit의 속도이고, goodput은
                작업이 끝날 때까지 실제 payload byte를 옮긴 속도입니다. Bit를
                byte로 바꾸고 protocol·FEC·header·idle·queue 시간을 제외해야 두
                값을 같은 단위로 비교할 수 있습니다.
              </p>
            }
            formula={String.raw`G_{\mathrm{payload}}=\frac{Q_{\mathrm{payload}}}{T_{\mathrm{completion}}}\le \frac{R_{\mathrm{line}}}{8}`}
            annotatedFormula={String.raw`\begin{aligned}
              G_{\mathrm{payload}}
              &=\underbrace{\frac{Q_{\mathrm{payload}}}{T_{\mathrm{completion}}}}_{\text{유효 byte / 완료 시간}}\\[4pt]
              &\le\underbrace{\frac{R_{\mathrm{line}}}{8}}_{\text{bit/s를 byte/s로}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`\frac{Q_{\mathrm{payload}}}{T_{\mathrm{completion}}}`, annotation: ["protocol byte가 아니라 완료한 payload만", "wall-clock 시간으로 나눠 goodput 계산"] },
              { expression: String.raw`\frac{R_{\mathrm{line}}}{8}`, annotation: ["광고된 bit/s를 8로 나눠", "비교 가능한 byte/s 상한으로 변환"] },
              { expression: String.raw`G_{\mathrm{payload}}\le R_{\mathrm{line}}/8`, annotation: ["실제 완료 속도를 물리 상한과 비교해", "overhead·queue가 만든 간극을 확인"] },
            ]}
            terms={[
              {
                symbol: "Q_{\\mathrm{payload}}",
                name: "완료한 payload",
                description:
                  "Header와 retransmission을 제외하고 애플리케이션이 전달하려던 유효 byte 수입니다.",
              },
              {
                symbol: "T_{\\mathrm{completion}}",
                name: "완료 시간",
                description:
                  "마지막 유효 byte가 목적지에 도착할 때까지의 wall-clock 시간입니다.",
              },
              {
                symbol: "G_{\\mathrm{payload}}",
                name: "goodput",
                description:
                  "애플리케이션 관점의 유효 전송률이며 보통 GB/s로 기록합니다.",
              },
              {
                symbol: "R_{\\mathrm{line}}",
                name: "line rate",
                description: "Port가 물리·MAC 계층에서 광고하는 bit/s입니다.",
              },
            ]}
            assumptions={[
              "Decimal GB/s와 Gb/s를 비교하며 1 byte=8 bit를 사용합니다.",
              "Payload와 측정 시작·종료 경계를 모든 실험에서 동일하게 정의합니다.",
              "단방향·양방향, 한 flow·aggregate 값을 서로 다른 열에 기록합니다.",
            ]}
            interpretation="Line rate는 상한이지 완료 성능이 아닙니다. 800 Gb/s는 단위만 바꾸면 100 GB/s이지만, 실제 goodput은 protocol overhead와 queue·copy·contention 때문에 더 낮습니다."
          />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          서로 다른 트래픽을 한 숫자로 섞지 않는다
        </h3>
        <p className="leading-7">
          관리·block gossip처럼 작고 지연에 민감한 flow, storage sync와
          backup처럼 큰 bulk flow, GPU collective처럼 여러 rank가 barrier에서
          만나는 east-west flow는 목표와 실패 영향이 다르다. 그래서
          VLAN·VRF·queue·별도 fabric 가운데 필요한 격리 수준을 정하고 각 class의
          SLO와 capacity를 따로 계산한다. Blockchain, storage, AI라는 제품
          이름만으로 고정 link rate를 배정하면 실제 burst와 fan-in을 놓치기
          쉽다.
        </p>

        <div className="not-prose my-6 border-l border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">좋은 첫 측정</p>
          <p className="text-sm leading-6">
            application phase와 함께 host별 tx/rx bytes, flow 수, message size,
            p50/p99 completion time, CPU·GPU wait와 switch queue/drop counter를
            같은 시간축에 저장함
          </p>
        </div>
        <p>
          이 글은 GPU memory에서 PCIe·NVLink를 거쳐 HCA와 switched fabric으로
          나가는 경로를 먼저 보고, 그 뒤 Ethernet·RDMA·InfiniBand의 계약을
          확장합니다. CUDA block·stream은 각 정본 글에서 재사용하며 여기서는
          interconnect topology와 end-to-end 측정만 소유합니다.
        </p>

        <div id="paper-ethernet-8023" className="scroll-mt-24">
          <CitationBlock
            source="IEEE 802.3 Ethernet Working Group"
            citeKey={1}
            href="https://www.ieee802.org/3/index.html"
          >
            Ethernet이 하나의 속도·media가 아니라 여러 PHY와 지속적으로 확장되는
            표준군임을 보여 주며, 현재 진행 중인 rate별 표준 상태도 제공한다.
          </CitationBlock>
        </div>
        <div id="paper-infiniband-fabric" className="scroll-mt-24">
          <CitationBlock
            source="InfiniBand Trade Association — Architecture Specification"
            citeKey={2}
            href="https://www.infinibandta.org/ibta-specification/"
          >
            InfiniBand와 RoCE를 server·storage 연결과 high-performance
            message·I/O를 위한 표준 architecture로 정의한다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
