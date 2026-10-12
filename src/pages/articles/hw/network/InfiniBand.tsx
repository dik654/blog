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
            InfiniBand는 server·storage 연결을 위한 IBTA 표준 channel-based switched fabric이다. GPU 전용도, 단일 회사의 비공개
            protocol도 아니다. Reliable messaging와 RDMA semantics, HCA·switch·subnet management를 하나의 ecosystem으로
            제공해 HPC와 분산 학습에 널리 쓰인다. 다만 collective는 fabric 이름만으로 빨라지지 않는다. 같은 count와 datatype으로 참여한 rank들의 위치,
            node 안 NVLink·PCIe 경로, node 밖 HCA와 fabric 경로, message size와 algorithm이 함께 완료 시간을 만든다.
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
          InfiniBand data rate 세대는 lane 속도를 포함한 규격 이름이고 실제 port는 1x·2x·4x 같은 link width와 encoding·FEC를 조합한다.
          같은 세대라도 adapter port, switch port와 cable breakout 방식에 따라 aggregate와 endpoint rate가 달라질 수 있다. IBTA 규격
          세대, 제품의 실제 width, 단방향·양방향 표기와 application payload goodput은 구분해 기록한다.
        </p>

        <h3
          id="nccl-bandwidth-boundary"
          className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
        >
          노드 안과 밖의 topology를 함께 본다
        </h3>
        <p className="leading-7">
          GPU collective는 노드 안의 NVLink·PCIe와 노드 밖의 HCA·fabric을 연속해서 사용한다. Rank가 어느 GPU에 있고 그 GPU에서 가장 가까운 HCA가
          무엇인지, collective algorithm이 ring·tree 등의 path를 어떻게 만드는지가 성능에 영향을 준다. 단일 pair bandwidth 다음에는 실제 rank
          수와 message size로 all-reduce·all-gather·reduce-scatter를 측정하고 operation time·algorithm bandwidth·bus
          bandwidth를 함께 비교한다.
        </p>

        <ExplainedFormula
          question="NCCL all-reduce에서 algbw와 busbw는 왜 같은 숫자가 아닌가?"
          idea={
            <p>
              algbw는 input size를 완료 시간으로 나눈 사용자 관점의 속도입니다.
              nccl-tests의 busbw는 point-to-point transfer model에서
              all-reduce가 rank당 주고받아야 하는 양을 반영하려고 rank 수에 따른
              보정 계수를 곱한 비교 지표입니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            B_{\mathrm{alg}}&=\frac{S}{t} \\
            B_{\mathrm{bus}}&=B_{\mathrm{alg}}\frac{2(n-1)}{n}
          \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
            B_{\mathrm{alg}}&=\underbrace{\frac{S}{t}}_{\text{작업 byte / 완료 시간}}\\[4pt]
            f_{\mathrm{AR}}&=\underbrace{\frac{2(n-1)}{n}}_{\text{all-reduce 이동 보정}}\\[4pt]
            B_{\mathrm{bus}}&=\underbrace{B_{\mathrm{alg}}\times f_{\mathrm{AR}}}_{\text{비교용 busbw로 환산}}
          \end{aligned}`}
          operations={[
            { expression: String.raw`S/t`, annotation: ["rank 한 개의 input size를", "collective wall time으로 나눠 작업 완료 속도 계산"] },
            { expression: String.raw`2(n-1)/n`, annotation: ["reduce와 distribute 두 방향을 반영하고", "자기 자신을 제외한 rank 비율로 보정"] },
            { expression: String.raw`B_{\mathrm{alg}}\times f_{\mathrm{AR}}`, annotation: ["operation 중심 속도에 all-reduce 계수를 곱해", "nccl-tests의 비교용 busbw 생성"] },
          ]}
          terms={[
            {
              symbol: "S",
              name: "collective input size",
              description:
                "nccl-tests가 한 rank의 all-reduce 입력으로 보고하는 byte 수입니다.",
            },
            {
              symbol: "t",
              name: "operation time",
              description: "해당 collective 한 번이 완료되는 평균 시간입니다.",
            },
            {
              symbol: "n",
              name: "rank count",
              description:
                "같은 communicator의 collective에 참여한 총 rank 수입니다.",
            },
            {
              symbol: "B_{\\mathrm{alg}}",
              name: "algorithm bandwidth",
              description:
                "같은 크기의 작업 완료 시간을 예측하기 쉬운 S/t입니다.",
            },
            {
              symbol: "B_{\\mathrm{bus}}",
              name: "nccl-tests bus bandwidth",
              description:
                "Flat send/receive model의 hardware 사용률 비교를 위한 all-reduce 보정값입니다.",
            },
          ]}
          assumptions={[
            "NCCL tests 문서의 point-to-point transfer accounting을 적용합니다.",
            "Reduction offload나 계층형 hardware algorithm에서는 busbw가 물리 link traffic과 일치하지 않을 수 있습니다.",
            "GB/s 단위, message size, rank 수, algorithm/protocol, topology를 함께 기록합니다.",
          ]}
          interpretation="16 ranks라면 보정 계수는 1.875이므로 algbw가 400GB/s일 때 busbw는 750GB/s입니다. Busbw는 application이 1초에 처리한 tensor byte가 아니며, 최신 offload algorithm에서는 실제 wire counter로 해석하면 안 됩니다."
        />

        <h3
          id="nvls-in-switch-reduction"
          className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
        >
          Switch가 더하기를 맡으면 busbw가 link 속도를 넘는다
        </h3>
        <p className="leading-7">
          위 보정 계수 2(n−1)/n은 GPU들이 조각을 서로 보내고 받아 직접 더한다는 가정에서 나온다. nccl-tests 문서도 이 식이 ring이든 tree든
          point-to-point(send/receive)로 움직이는 algorithm에서만 성립한다고 적는다.
        </p>
        <p className="leading-7">
          그렇다면 GPU 사이의 switch가 더하기를 대신할 때 GPU 한 대가 link에 실제로 싣는 byte는 얼마나 줄까? 그때 nccl-tests의 busbw는 어떻게 읽어야
          할까?
        </p>
        <p className="leading-7">
          (가정) 한 node의 GPU 8개가 각자 1GB gradient를 all-reduce한다. Ring에서는 각 GPU가 reduce-scatter 단계에서 자기 몫을 뺀 7/8GB를 보내고, all-gather 단계에서 다시 7/8GB를 보낸다. 그래서 GPU 한 대가 보내는 양은 1.75GB이고, 받는 양도 1.75GB다.
        </p>
        <p className="leading-7">
          이번에는 GPU 8개를 잇는 switch 안에 덧셈 회로가 있다고 하자. 각 GPU는 1GB를 여덟으로 나눈 조각 하나의 합계를 맡아 switch에 요청한다. Switch는 8개 GPU에서 그 조각을 한 번씩 읽어 더하고, 요청한 GPU에 돌려준다. 그 GPU가 합계를 한 번 올려 보내면 switch가 8개로 복제해 모든 GPU에 쓴다.
        </p>
        <div className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <p className="border-b bg-muted/30 px-4 py-3 text-sm font-semibold">
            GPU 8개 · GPU당 1GB all-reduce에서 GPU 한 대가 link에 싣는 byte
          </p>
          <ol className="divide-y divide-border/70 text-sm">
            <li className="grid min-w-0 gap-1 px-4 py-3">
              <strong>1. 작업 경계</strong>
              <span className="min-w-0 break-words leading-6">입력 1GB, 출력 1GB(8개 합계)를 모든 GPU가 가진다. 아래 숫자는 GPU 한 대의 송신 byte다.</span>
            </li>
            <li className="grid min-w-0 gap-1 px-4 py-3">
              <strong>2. Ring 송신 = 2 × 7/8 × 1GB = 1.75GB</strong>
              <span className="min-w-0 break-words leading-6">7/8은 자기 조각을 뺀 나머지 비율, 2는 reduce-scatter와 all-gather 두 단계다. 수신도 1.75GB다.</span>
            </li>
            <li className="grid min-w-0 gap-1 px-4 py-3">
              <strong>3. 합산용 송신 = 8 × 1/8GB = 1GB</strong>
              <span className="min-w-0 break-words leading-6">조각 8개의 합계를 하나씩 만들 때마다 switch가 내 1GB 가운데 그 조각에 해당하는 1/8GB를 읽어 간다. 그래서 내 1GB가 정확히 한 번 올라간다.</span>
            </li>
            <li className="grid min-w-0 gap-1 px-4 py-3">
              <strong>4. 방송용 송신 = 1/8GB → 합계 1.125GB</strong>
              <span className="min-w-0 break-words leading-6">내가 맡은 조각의 합계를 한 번 올려 보내면 switch가 복제한다. 수신도 1/8GB(내 합계) + 1GB(전체 결과) = 1.125GB다.</span>
            </li>
            <li className="grid min-w-0 gap-1 px-4 py-3">
              <strong>5. 1.75 ÷ 1.125 ≈ 1.56배</strong>
              <span className="min-w-0 break-words leading-6">GPU 수 n이 커지면 ring은 2(n−1)/n → 2, switch 방식은 1 + 1/n → 1이라 차이가 2배에 가까워진다.</span>
            </li>
            <li className="grid min-w-0 gap-1 px-4 py-3">
              <strong>6. busbw ≈ 1.56 × link 속도</strong>
              <span className="min-w-0 break-words leading-6">Link 한 방향 속도를 L이라 하면 완료 시간은 약 1.125GB ÷ L, algbw는 약 0.89L이다. nccl-tests는 여기에 1.75를 곱하므로 busbw가 L보다 크게 나온다. 측정 오류가 아니라 보정식의 전제가 깨진 결과다.</span>
            </li>
          </ol>
          <p className="border-t px-4 py-3 text-xs leading-5 text-muted-foreground">
            3~6행은 아래 multimem 동작에서 이 글이 직접 센 이상적인 link byte다. 사용자 buffer를 NCCL에 등록하지 않으면 staging buffer 복사가 더해지고,
            protocol header와 동기화 비용은 넣지 않았다.
          </p>
        </div>

        <p className="leading-7">
          덧셈 회로를 가진 이 switch 기능이 NVLink SHARP이고, NCCL은 이를 NVLS라는 algorithm 이름으로 부른다. NVIDIA는 Hopper와 함께 나온 3세대 NVSwitch(NVLink4)에 SHARP controller와 계산용 SRAM, 그리고 Hopper에서 가져온 ALU를 넣었다. ALU는 더하기, 최솟값과 최댓값, 논리 연산을 맡는다. 다루는 data는 정수와 FP16, BF16, FP32, FP64다.
        </p>
        <p className="leading-7">
          NVIDIA 기술 블로그는 기존 all-reduce가 GPU interface마다 read/write 4N번을 쓰지만 NVLS는 2N+2번이라 “approximately halving”이라고 설명한다. 이 블로그의 operation은 byte 단위로 정의되지 않았으므로, 위 원장처럼 직접 센 byte와 섞지 않는다. 이후 Blackwell과 Vera Rubin 세대의 NVLink 5·6 Switch(NVL72 포함)에도 SHARP 엔진이 들어 있다.
        </p>
        <p className="leading-7">
          GPU 쪽에서는 CUDA multicast object가 이 동작을 연다. Driver가 <code>cuMulticastCreate</code>로 object를 만들고, <code>cuMulticastAddDevice</code>로 GPU 8개를 한 team에 넣는다. 이어서 <code>cuMulticastBindMem</code>으로 GPU마다 실제 memory를 붙인다. 그래서 GPU N개 team에는 같은 주소를 가리키는 replica가 N개 생긴다.
        </p>
        <p className="leading-7">
          Kernel이 이 multicast 주소에 <code>multimem.ld_reduce</code>를 실행하면 모든 replica에서 읽어 지정한 연산으로 줄인 값 하나가 register로 돌아온다. <code>multimem.st</code>는 값 하나를 모든 replica에 쓴다. 두 명령은 PTX ISA 8.1에서 들어왔고 sm_90 이상에서만 동작한다. NCCL의 reduce kernel은 이 명령을 직접 쓴다.
        </p>
        <pre className="not-prose my-4 whitespace-pre-wrap break-all rounded-lg border border-border/70 bg-muted/30 p-4 text-xs leading-5">
          <code>{`// NVIDIA/nccl v2.32.3-1 src/device/reduce_kernel.h (발췌)
asm volatile("multimem.ld_reduce.relaxed.sys.global.add" PtxAcc_for_##ptx_ty "." #ptx_ty " %0, [%1];"`}</code>
        </pre>
        <p className="leading-7">
          처음 예에 대입해 보자. 3번 GPU는 자기가 맡은 세 번째 조각의 multicast 주소에 이 명령을 실행한다. Switch는 8개 replica에서 같은 조각을 읽어 더한 값을 3번 GPU로 돌려준다. 3번 GPU가 그 합계를 <code>multimem.st</code>로 쓰면 8개 GPU 모두에 세 번째 조각의 결과가 놓인다.
        </p>
        <p className="leading-7">
          8개 GPU가 각자 한 조각씩 이 일을 하면 원장의 1.125GB가 된다. NCCL의 all-reduce kernel은 warp에 scatter, reduce, broadcast, gather 역할을 나눠 주고 이 흐름을 channel마다 돌린다.
        </p>
        <p className="leading-7">
          NCCL은 2.17.1에서 node 안 all-reduce에 NVLS를 처음 넣었다. 2.18.1에서는 node 밖으로 넓혀 두 algorithm을 추가했다. NVLS는 InfiniBand switch의 SHARP와 묶었고, NVLSTree는 node 사이를 tree로 잇는다.
        </p>
        <p className="leading-7">
          현재 source(v2.32.3)에서 NVLS는 all-reduce, all-gather, reduce-scatter를 지원하고 NVLSTree는 all-reduce만 지원한다. 둘 다 Simple protocol에서만 쓴다. NCCL의 비용 모델도 NVLS all-reduce의 node 안 bandwidth에 2를 곱해 이 이득을 반영한다.
        </p>
        <p className="leading-7">
          남는 비용도 있다. NVLS는 channel마다 별도 buffer를 잡으므로 GPU memory를 더 쓴다. 같은 GPU에 rank 여러 개를 올리면 쓸 수 없다. 기본값 <code>NCCL_NVLS_ENABLE=2</code>에서는 알리지 않고 꺼지고, 1로 강제하면 communicator 초기화가 실패한다.
        </p>
        <p className="leading-7">
          2.27과 2.28은 일부 rank에서만 NVLS 자원 할당이 실패해도 조용히 다른 transport로 넘어가다 hang이 날 수 있었다. 그래서 2.29에서 1과 같은 동작으로 되돌렸다. Node 여러 대를 NVLink로 묶는 시스템은 모든 node에 IMEX domain이 구성돼 있어야 하고, 3세대 NVSwitch 시스템에서는 Fabric Manager가 GPU 사이 memory fabric을 구성한다.
        </p>
        <p className="leading-7">
          그래서 선택 기준은 이렇다. 같은 rank placement에서 message size를 훑으며 <code>NCCL_ALGO=Ring</code>과 <code>NCCL_ALGO=NVLS</code>의 operation time을 비교하고 더 짧은 쪽을 고른다. busbw를 link 사용률로 나누지 않는다. NVLS 측정에서 busbw가 NVLink 속도를 넘으면 offload가 일한 흔적으로 읽고, 실제 link 부하는 switch와 NIC counter로 따로 확인한다.
        </p>

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
            같은 모델·rank placement·message size에서 collective 완료 시간과 GPU utilization을 비교하고 혼잡·link loss 후 회복과 팀이
            운영할 수 있는 telemetry까지 포함해 fabric을 결정한다.
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
        <div id="paper-nvlink-sharp" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA Technical Blog — Upgrading Multi-GPU Interconnectivity with the Third-Generation NVIDIA NVSwitch (2022-08-23)"
            citeKey={11}
            href="https://developer.nvidia.com/blog/upgrading-multi-gpu-interconnectivity-with-the-third-generation-nvidia-nvswitch/"
          >
            “SHARP arithmetic logic units (ALUs) highly leveraged from those in the NVIDIA Hopper Architecture”, “These ALUs support a wide variety of
            operators, such as logical, min/max, and add”, “This results in a total of 2 N +2 operations, or approximately halving the number of
            read/write operations needed to perform the all-reduce calculation.” 2026-10-12 원문 확인.
          </CitationBlock>
        </div>
        <CitationBlock
          source="NVIDIA NCCL User Guide — Environment Variables (NCCL_NVLS_ENABLE, NCCL_ALGO)"
          citeKey={12}
          href="https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html"
        >
          “NVLink SHARP is available in third-generation NVSwitch systems (NVLink4) with Hopper and later GPU architectures, allowing collectives such
          as ncclAllReduce to be offloaded to the NVSwitch domain.” 기본값 2, 2.27·2.28의 fallback이 일부 rank만 실패할 때 hang을 낼 수 있어 2.29에서
          되돌렸다는 문장, 같은 GPU의 다중 rank에서는 NVLS가 꺼진다는 문장. 2026-10-12 원문 확인.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA NCCL Release Notes 2.17.1 · 2.18.1"
          citeKey={13}
          href="https://docs.nvidia.com/deeplearning/nccl/release-notes/rel_2-18-1.html"
        >
          2.17.1: “Add support for NVLink SHARP Reduction / Broadcast to accelerate intra-node allreduce operations.” 2.18.1: “Add inter-node algorithms
          for NVLink SHARP: NVLink SHARP + IB SHARP (NVLS), NVLink SHARP + Tree (NVLSTREE).” 2026-10-12 원문 확인.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA PTX ISA — multimem.ld_reduce, multimem.st, multimem.red"
          citeKey={14}
          href="https://docs.nvidia.com/cuda/parallel-thread-execution/index.html"
        >
          “Instruction multimem.st performs a store operation of the input operand b to all the memory locations pointed to by the multimem address
          a.” ld_reduce는 모든 위치에서 읽어 .op로 줄인 결과를 register d에 돌려준다. “Introduced in PTX ISA version 8.1.” “Requires sm_90 or higher.”
          CUDA Programming Guide 4.17.4는 GPU N개 multicast team에 replica가 N개 생긴다고 적는다. 2026-10-12 원문 확인.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA/nccl v2.32.3-1 — src/tuning/nvls.cc, src/device/reduce_kernel.h"
          citeKey={15}
          href="https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/tuning/nvls.cc"
        >
          “// NVLS is supported for AR, AG, and RS.” “// NVLSTree is only supported for AR.” Simple 이외 protocol 비활성화, all-reduce의 intraBw *= 2.0f,
          reduce_kernel.h의 multimem.ld_reduce 인라인 PTX. 2026-10-12 원문 확인.
        </CitationBlock>
      </div>
    </section>
  );
}
