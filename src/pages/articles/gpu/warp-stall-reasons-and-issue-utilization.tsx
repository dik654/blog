import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import WarpStallReasonsAndIssueUtilizationViz from "./warp-stall-reasons-and-issue-utilization/viz/WarpStallReasonsAndIssueUtilizationViz";

const NCU = "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html";
const PRACTICES = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";

/**
 * Warp stall reason 읽기: scoreboard, barrier, not selected, issue slot
 *
 * Nsight Compute 가 warp 상태를 sampling 으로 세는 방식과, 그 표본을 stall 원인별로
 * 읽어 issue slot 이 왜 비는지를 판정하는 절차를 소유한다. Scoreboard 가 ready·stalled 를
 * 판정하는 mechanism 자체는 /gpu/sm-warp-scheduling-and-issue 가, timing 과 병목 가설
 * loop 의 전체 순서는 /gpu/cuda-perf-analysis 가, roofline 의 peak·achieved 경계는
 * /gpu/gpu-memory-hierarchy-and-roofline 이 소유한다.
 */
export default function WarpStallReasonsAndIssueUtilizationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="sampling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Profiler 는 counter 로 세고 sampling 으로 warp 의 상태를 뽑습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Kernel 이 느린 이유를 profiler 가 알려 주는 방식은 두 가지뿐입니다. 하나는 SM 안의 hardware performance counter 가 issue 된
            instruction 수나 DRAM 을 지난 byte 수를 사건마다 세는 것입니다. 다른 하나는 일정 clock 마다 warp 하나를 무작위로 골라 그 순간의 상태를 적어 두는
            sampling 입니다.
          </p>
          <p>
            Counter 는 정확하지만 이유를 말하지 못합니다. Issue 된 instruction 이 1000 clock 에 400개였다는 사실은 알려 줘도 나머지 600 clock 에
            warp 들이 무엇을 기다렸는지는 counter 에 없습니다. 그 이유를 채우는 것이 warp state sampling 입니다.
          </p>
          <p>
            Nsight Compute 의 sampler 는 SM 마다 고정 간격으로 active warp 하나를 골라 program counter 와 scheduler 가 본 그 warp
            의 상태를 기록합니다. 간격은 작은 GPU 에서 32 clock, SM 이 많은 chip 에서는 2048 clock 까지 늘어납니다. 결과는 시간축 없이 instruction
            주소별 표본 수로만 남습니다.
          </p>
          <p>
            어떤 warp 의 표본 100개 가운데 60개가 memory 를 기다리는 상태였다면 그 warp 는 시간의 약 60% 를 그 상태로 보낸 것입니다. 표본은 이렇게 통계입니다.
            이 비율을 원인별로 나눈 이름표가 다음 절의 stall reason 입니다. 표본 수가 적은 짧은 kernel 에서는 이 비율이 흔들립니다.
          </p>
          <p>
            Counter 도 한 번에 다 읽히지 않습니다. 하드웨어 counter 의 수가 한정돼 있어
            Nsight Compute 는 같은 kernel 을 여러 번 replay 하며 metric 을 나눠 모으고,
            그래서 profiler 아래의 elapsed 는 실제 실행과 다릅니다. 측정 경계를 고정하는
            절차는 <Link to="/gpu/cuda-perf-analysis#measurement-protocol">CUDA 성능 분석</Link>
            이 다룹니다.
          </p>
        </div>
        <ContentBoundary article="warp-stall-reasons-and-issue-utilization" />
      </section>

      <section id="stall-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stall reason 은 warp 가 issue 하지 못한 이유를 원인별로 나눈 이름표입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Scheduler 가 어느 clock 에 warp 하나를 보면 그 warp 는 issue 됐거나(selected), 준비됐지만 다른 warp 에 밀렸거나(not
            selected), 무언가를 기다리는 중입니다. 기다림의 종류를 stall reason 이라고 부릅니다. Nsight Compute 는 기다리는 대상이 무엇인지로 스무 가지
            가까이 나눕니다.
          </p>
          <p>
            자주 보는 것은 여섯 가지입니다. Long scoreboard 는 global·local·texture memory 의 결과를 기다리는 상태이고 short scoreboard
            는 shared memory 나 특수 함수 unit 의 결과를 기다리는 상태입니다. 같은 block 의 다른 warp 가 barrier 에 오기를 기다리면 barrier
            입니다.
          </p>
          <p>
            산술 instruction 의 고정 latency 를 기다리면 wait 입니다. 쓰려는 실행 pipe 가 이미 차 있으면 math pipe throttle, memory
            instruction 을 넣는 queue 가 차 있으면 MIO 또는 LG throttle 입니다. 나머지는 instruction fetch, branch 해석, memory
            barrier 같은 드문 경우입니다.
          </p>
          <p>
            수치로 읽어 보겠습니다. 어떤 warp 의 표본 100개가 long scoreboard 60, short scoreboard 15, barrier 10, not selected
            10, selected 5 로 나뉘었다고 합시다. 이 warp 는 100 clock 중 5 clock 만 issue 했으므로 issue 하나마다 평균 20 clock 을 보냈고
            그 20 clock 의 절반 이상이 global memory 를 기다린 시간입니다.
          </p>
          <p>
            같은 subpartition 에 이런 warp 가 8개 있으면 scheduler 가 매 clock 하나를 고를 수 있는 clock 은 대략 8 × 5% = 40% 입니다.
            나머지 60% 의 clock 에는 고를 warp 가 없어 issue slot 이 빕니다. 진단은 global memory latency 에 묶인 kernel 입니다.
          </p>
          <p>
            이 절의 원인 이름은 scheduler 의 판정을 이름 붙인 것이지 원인의 증명이 아닙니다. 표본이 어느 instruction 에 몰렸는지를 source view 에서 함께
            봐야 어떤 load 가 기다림을 만들었는지 알 수 있습니다. 그 읽기 절차는 마지막 절의 pseudocode 로 정리합니다.
          </p>
        </div>
        <WarpStallReasonsAndIssueUtilizationViz />
        <TermBreakdown
          title="Nsight Compute 의 stall reason 과 처방의 방향"
          description="Profiling Guide 의 Warp Stall Reasons 표에서 자주 보는 항목만 골랐습니다. 이름은 기다리는 대상을 말하고 처방은 그 대상을 줄이는 쪽입니다."
          items={[
            { term: "Long scoreboard", description: "L1TEX 경로(global·local·surface·texture) 의 결과를 기다립니다.", example: "L2 miss 뒤 HBM 왕복 수백 clock 동안 이 상태로 잡힙니다.", boundary: "Access pattern 과 cache hit 를 고치는 문제이며 warp 수만 늘려서는 한계가 있습니다." },
            { term: "Short scoreboard", description: "MIO 경로(shared memory·MUFU·dynamic branch) 의 결과를 기다립니다.", example: "Bank conflict 로 shared load 가 여러 차례로 나뉘면 표본이 늘어납니다.", boundary: "수십 clock 단위라 ready warp 가 몇 개만 있어도 대부분 숨겨집니다." },
            { term: "Barrier", description: "같은 block 의 형제 warp 가 CTA barrier 에 도착하기를 기다립니다.", example: "Warp 하나만 긴 branch 를 돌면 나머지 7개가 barrier 에서 멈춥니다.", boundary: "Block 을 작게 나누면 줄지만 shared memory 가 새 occupancy 한도가 될 수 있습니다." },
            { term: "Not selected", description: "준비됐지만 같은 clock 에 다른 eligible warp 가 선택됐습니다.", example: "표본의 30% 가 not selected 면 매 clock 후보가 평균 둘 이상입니다.", boundary: "이 비율이 높으면 warp 가 부족한 것이 아니라 충분한 것입니다." },
            { term: "Wait", description: "산술 instruction 의 고정 latency 를 기다립니다.", example: "FFMA 결과를 바로 쓰는 chain 에서 약 4 clock 씩 쌓입니다.", boundary: "이미 잘 최적화된 kernel 에서만 상위 원인으로 올라옵니다." },
            { term: "Math pipe throttle", description: "다음 instruction 을 보낼 실행 pipe 가 이미 차 있습니다.", example: "모든 warp 가 FP64 pipe 만 쓰면 pipe 폭이 상한이 됩니다.", boundary: "Warp 를 늘려도 issue 가 늘지 않고 instruction mix 를 바꿔야 합니다." },
          ]}
        />
      </section>

      <section id="scoreboard-barrier" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Long scoreboard 는 memory 를, barrier 는 형제 warp 를 기다립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Long 과 short 의 차이는 경로에서 옵니다. 기다림의 길이로 갈리는 것이 아닙니다. Nsight Compute 는 L1TEX unit 을 거치는
            global·local·surface·texture 접근을 long scoreboard 로, MIO queue 를 거치는 shared memory·특수 함수·dynamic
            branch 를 short scoreboard 로 나눕니다. 이름의 long·short 는 두 경로의 전형적인 latency 를 딴 것입니다.
          </p>
          <p>
            Scoreboard 자체는 하나입니다. Issue 된 load 의 결과 register 에 미완료 표시를
            남기고 결과가 오면 지우는 장부이며, 그 판정 방식은{" "}
            <Link to="/gpu/sm-warp-scheduling-and-issue#issue-scoreboard">SM 내부 글</Link>
            이 소유합니다. 이 글은 그 장부가 어느 경로에서 얼마나 오래 표시를 남겼는지를
            읽습니다.
          </p>
          <p>
            처방이 갈립니다. Long scoreboard 가 높으면 어떤 load 가 기다림을 만드는지 찾아
            coalescing 으로 sector 수를 줄이거나 자주 쓰는 data 를 shared memory 로 옮깁니다.
            Short scoreboard 가 높으면 shared memory 의{" "}
            <Link to="/gpu/cuda-shared-memory#bank-conflict">bank conflict</Link> 를 먼저
            의심하고 load 를 더 넓고 적게 만듭니다.
          </p>
          <p>
            Barrier stall 은 기다리는 대상이 memory 가 아니라 같은 block 의 다른 warp 입니다.
            <code>__syncthreads()</code> 에 먼저 도착한 warp 는 형제 warp 가 모두 올 때까지
            issue 할 instruction 이 없고, 그 시간이 전부 barrier 표본으로 잡힙니다.
          </p>
          <p>
            숫자로 보면 block 256 thread 는 warp 8개입니다. 그중 하나가 barrier 앞에서 100 clock 짜리 예외 경로를 돌면 나머지 7개는 그 100
            clock 을 barrier 에서 보내고 warp 8개의 표본 800개 가운데 700개가 barrier 로 찍힙니다. 문서는 이 경우를 barrier 앞의 갈라진 경로로
            진단합니다.
          </p>
          <p>
            처방은 barrier 앞의 일을 warp 마다 고르게 나누는 것이고 block 이 512 thread 이상이면 더 작은 block 으로 쪼개는 것입니다. 쪼개면 한
            barrier 를 기다리는 warp 수가 줄어 eligible warp 가 늘어납니다. 다만 block 마다 shared memory 를 따로 잡으므로 shared memory
            가 새 occupancy 한도가 될 수 있습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Long scoreboard 가 높은데 DRAM throughput 도 높으면 무엇이 병목인가요?"
          preview="Bandwidth 입니다. Latency 가 아니라 traffic 이 상한에 닿은 것이므로 warp 를 늘려도 stall 은 줄지 않고, byte 를 줄이는 처방만 남습니다."
        >
          <p>
            Long scoreboard 는 결과를 기다렸다는 사실만 말합니다. 기다린 이유가 요청이
            적어 latency 를 숨기지 못한 것인지, 요청이 너무 많아 DRAM 이 포화한 것인지는
            Memory Workload Analysis 의 DRAM throughput 이 가릅니다.
          </p>
          <p>
            DRAM throughput 이 peak 의 80% 이상이면 latency 가 아니라 bandwidth 에 묶인
            kernel 이고, 처방은 재사용을 늘려 HBM 을 지나는 byte 를 줄이는 것입니다. 20%
            아래인데 long scoreboard 가 높으면 outstanding 요청이 부족한 것이므로 warp 당
            독립 load 를 늘리는 MLP 처방이 맞습니다. 두 지표를 함께 읽는 예는{" "}
            <Link to="/gpu/cuda-perf-analysis#counter-correlation">counter 상관</Link> 에
            있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="eligible-issue-slot" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Eligible warp 가 매 clock 하나 이상이어야 issue slot 이 채워집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Stall reason 을 읽기 전에 볼 숫자가 있습니다. Scheduler Statistics 의 eligible warps per scheduler 는 매 clock
            scheduler 가 고를 수 있었던 warp 수의 평균이고 issue slot utilization 은 active clock 가운데 실제로 instruction 을 낸
            clock 의 비율입니다. 문서는 scheduler 가 매 clock issue 하고 있다면 stall 을 보지 말라고 씁니다.
          </p>
          <p>
            Scheduler 하나는 clock 당 warp 하나만 issue 합니다. 그래서 eligible 이 3개인 clock 도 1개인 clock 도 issue 는 한 번이고
            eligible 이 0개인 clock 만 slot 을 비웁니다. Issue slot utilization 은 eligible 이 하나 이상인 clock 의 비율과 같습니다.
          </p>
          <p>
            평균 eligible 이 0.8 이라면 slot 이 채워진 clock 은 아무리 많아도 80% 입니다. Eligible 이 1을 넘는 clock 이 하나라도 있으면 그만큼 다른
            clock 이 0이어야 평균이 맞으므로 실제 utilization 은 80% 보다 낮습니다. Eligible 이 2와 0으로만 번갈아 나타나면 40% 까지 떨어집니다.
          </p>
          <p>
            Not selected 는 이 셈의 반대편입니다. Eligible 이 2 이상인 clock 마다 선택되지
            못한 warp 가 하나 이상 생기므로, not selected 표본이 많다는 것은 후보가 남아돌던
            clock 이 많았다는 뜻입니다. 문서는 이때 warp 가 충분하니 active warp 를 줄여
            cache locality 를 얻는 쪽을 고려하라고 씁니다.
          </p>
          <p>
            앞 절의 예로 돌아가면 warp 하나가 100 clock 에 5번 issue 했으므로 매 clock slot 을 채우려면 warp 20개가 필요한데 subpartition 의
            상한은 16개입니다. Occupancy 를 끝까지 올려도 utilization 은 80% 를 넘지 못합니다. 처방은 warp 수가 아니라 issue 하나당 20 clock 을
            만드는 long scoreboard 를 줄이는 것입니다.
          </p>
          <p>
            Ready warp 수를 latency 로부터 계산하는 Little's law 셈은{" "}
            <Link to="/gpu/sm-warp-scheduling-and-issue#latency-hiding">TLP·ILP·MLP</Link> 가
            소유하고, 이 글은 그 셈의 결과가 profiler 에 어떤 숫자로 나타나는지만 읽습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Issue slot utilization 은 eligible warp 수와 어떻게 묶이나요?"
          idea="Scheduler 는 clock 당 한 번만 issue 하므로 slot 이 채워진 clock 의 비율은 eligible 이 하나 이상인 clock 의 비율이고, 평균 eligible 수는 그 비율의 상한이 됩니다."
          formula={String.raw`\begin{aligned}
U_{\mathrm{issue}} &= \frac{C_{\mathrm{issued}}}{C_{\mathrm{active}}} = \Pr[E \ge 1] \\
\Pr[E \ge 1] &\le \min(1,\ \bar{E})
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
U_{\mathrm{issue}} &= \underbrace{\frac{C_{\mathrm{issued}}}{C_{\mathrm{active}}}}_{\text{issue 한 clock 의 비율}} = \underbrace{\Pr[E \ge 1]}_{\text{eligible 이 하나 이상인 clock}} \\
\Pr[E \ge 1] &\le \underbrace{\min(1,\ \bar{E})}_{\text{평균 eligible 수가 상한}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\frac{C_{\mathrm{issued}}}{C_{\mathrm{active}}}`, annotation: ["Instruction 을 낸 clock 수를", "scheduler 가 살아 있던 clock 수로 나눠 utilization 을 구함"] },
            { expression: String.raw`\Pr[E \ge 1]`, annotation: ["Clock 당 issue 가 한 번뿐이므로", "eligible 이 1 이상인 clock 의 비율과 같아짐"] },
            { expression: String.raw`\min(1,\ \bar{E})`, annotation: ["Eligible 수의 평균을 구해", "E≥1 인 clock 비율의 상한으로 둠 (Markov 부등식)"] },
          ]}
          terms={[
            { symbol: String.raw`C_{\mathrm{issued}}`, name: "Issue 한 clock 수", description: "Scheduler 가 instruction 을 하나 이상 낸 clock 의 수입니다." },
            { symbol: String.raw`C_{\mathrm{active}}`, name: "Active clock 수", description: "Scheduler 에 resident warp 가 하나라도 있던 clock 의 수입니다." },
            { symbol: String.raw`E`, name: "Clock 당 eligible warp 수", description: "그 clock 에 scoreboard·barrier·pipe 모두가 허락한 warp 의 수입니다." },
            { symbol: String.raw`\bar{E}`, name: "평균 eligible warp 수", description: "Nsight Compute 의 Eligible Warps Per Scheduler 가 이 값입니다." },
          ]}
          assumptions={["Scheduler 가 eligible warp 가 있으면 반드시 issue 한다고 봅니다. Dispatch stall 이 있으면 등호가 부등호가 됩니다.", "Clock 당 issue 를 1 로 둔 셈이며 dual issue 는 고려하지 않습니다.", "Eligible 수의 분포가 시간에 따라 바뀌면 평균만으로는 utilization 을 정하지 못하고 상한만 줍니다."]}
          interpretation="평균 eligible 0.8 이면 utilization 은 80% 이하이고, eligible 이 몰려 있을수록 더 낮습니다. 반대로 not selected 가 많은 kernel 은 E 가 자주 2 이상이라는 뜻이라 warp 를 더 넣어도 utilization 이 오르지 않습니다."
        />
      </section>

      <section id="sm-utilization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SM utilization 은 SM 이 비었는지를, issue active 는 놀았는지를 말합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 "이용률" 이라는 말이 세 층위에서 쓰입니다. SM utilization 은 kernel 이 도는 동안 SM 에 warp 가 하나라도 있던 clock 의 비율입니다.
            Issue active 는 그 active clock 가운데 scheduler 가 instruction 을 낸 비율이고 SM throughput 은 issue 된
            instruction 이 실행 pipe 의 peak 를 얼마나 채웠는지입니다.
          </p>
          <p>
            세 숫자는 곱으로 이어집니다. SM 이 elapsed 의 50% 만 active 였고 그 안에서 issue
            active 가 80% 였다면 elapsed 기준 issue 비율은 40% 입니다. Nsight Compute 의
            throughput metric 이 active 기준과 elapsed 기준을 따로 두는 이유가 이것입니다.
          </p>
          <p>
            SM utilization 이 낮은 원인은 stall 이 아닙니다. H100 의 SM 132개에 block 66개짜리 grid 를 띄우면 절반의 SM 은 처음부터 끝까지 비어
            있습니다. Block 수가 SM 수의 배수가 아니면 마지막 wave 에서 일부 SM 만 일하는 tail 이 생깁니다. 이때 issue active 는 높아도 chip 은 놀고
            있습니다.
          </p>
          <p>
            반대로 SM utilization 이 98% 인데 issue active 가 40% 면 SM 은 꽉 찼지만 scheduler 가 매 clock 의 60% 를 비운 것입니다.
            이때 비로소 stall reason 을 읽을 차례입니다. Chip 이 비었는지, SM 이 놀았는지, pipe 가 느렸는지는 서로 다른 처방으로 갑니다.
          </p>
          <p>
            Issue active 가 높고 SM throughput 도 높으면 kernel 은 compute-bound 이고 그 판정은 roofline 의 pipe utilization
            이 소유합니다. Issue active 가 높은데 throughput 이 낮으면 issue 된 instruction 이 유효한 일을 적게 한 것입니다. Divergence 로
            lane 이 꺼졌거나 instruction 수 자체가 많은 경우입니다.
          </p>
        </div>
        <TermBreakdown
          title="세 층위의 이용률과 각각이 낮을 때의 원인"
          description="Nsight Compute 의 GPU Speed Of Light·Scheduler Statistics·Compute Workload Analysis 가 각각 한 층위를 보여 줍니다."
          items={[
            { term: "SM utilization (active / elapsed)", description: "SM 에 resident warp 가 하나라도 있던 clock 의 비율입니다.", example: "SM 132개에 block 66개면 50% 를 넘지 못합니다.", boundary: "Grid 크기·wave·launch 간격의 문제이며 stall 과 무관합니다." },
            { term: "Issue active (issued / active)", description: "Active clock 가운데 scheduler 가 instruction 을 낸 clock 의 비율입니다.", example: "1000 active clock 에 400번 issue 면 40% 이고 60% 는 eligible 이 없던 clock 입니다.", boundary: "이 값이 낮을 때만 stall reason 이 처방으로 이어집니다." },
            { term: "SM throughput (pipe % of peak)", description: "Issue 된 instruction 이 가장 바쁜 실행 pipe 의 peak 를 채운 비율입니다.", example: "FMA pipe 90% 면 compute-bound, Tensor 0% 면 pipe 선택의 문제입니다.", boundary: "정의와 roofline 판정은 GPU memory hierarchy 글이 소유합니다." },
          ]}
        />
      </section>

      <section id="reading-procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stall 표본은 이용률을 먼저 본 뒤에만 처방으로 이어집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Nsight Compute 결과는 위에서 아래로 읽습니다. Chip 이 비었는지, SM 의 scheduler 가 매 clock issue 했는지, eligible 이
            남아돌았는지를 차례로 확인한 뒤에야 가장 큰 stall reason 이 처방으로 이어집니다. 그 처방은 표본이 몰린 instruction 하나를 바꾸는 것으로 끝납니다.
          </p>
          <p>
            Issue active 가 95% 인 kernel 에서 long scoreboard 60% 를 보고 memory 를 고치면 scheduler 는 이미 매 clock 일하고
            있었으므로 elapsed 는 줄지 않습니다. Tail 로 SM 절반이 놀던 kernel 에서 stall 을 고쳐도 chip 의 절반은 여전히 비어 있습니다. 순서를 바꾸면
            이렇게 틀린 처방이 나옵니다.
          </p>
          <p>
            변경은 한 번에 하나이며, 다시 잰 뒤에는 stall 비율과 issue active 와 elapsed 가
            같은 방향으로 움직였는지 함께 봅니다. Stall 비율이 줄었는데 elapsed 가 그대로면
            그 stall 은 병목이 아니었던 것이고, 이 판정 loop 의 전체 순서는{" "}
            <Link to="/gpu/cuda-perf-analysis#profiling">병목 가설 loop</Link> 가 소유합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Nsight Compute 결과를 stall 에서 처방까지 읽는 절차"
          input={["SpeedOfLight: SM active / elapsed, SM throughput, memory throughput", "SchedulerStats: eligible warps per scheduler, issue active, no eligible 비율", "WarpStateStats·Source counters: stall reason 별 표본과 instruction 주소", "Launch·Occupancy: grid 의 block 수, resident warp 수, 한도가 된 resource"]}
          steps={[
            { code: "if SM_active / elapsed < 0.8: 원인 = grid 크기·tail·launch 간격; stall 을 읽지 않고 종료", note: "SM 이 비어 있으면 stall 은 병목이 아닙니다. Block 수와 wave 를 먼저 고칩니다." },
            { code: "if issue_active ≥ 0.9: 원인 = instruction 수 또는 pipe 폭; roofline 의 pipe utilization 으로 이동", note: "Scheduler 가 매 clock issue 했다면 문서대로 stall reason 을 보지 않습니다." },
            { code: "if not_selected 표본 비율 이 높음: warp 는 충분; active warp 를 줄여 locality 를 얻는 쪽을 검토", note: "Eligible 이 2 이상인 clock 이 많았다는 뜻이며 occupancy 를 올리는 처방은 제외합니다." },
            { code: "reason = 표본이 가장 많은 stall reason;  pc = 그 표본이 몰린 instruction", note: "표본은 instruction 주소별로 남으므로 어떤 load·barrier 가 기다림을 만들었는지 지목할 수 있습니다." },
            { code: "long_scoreboard → DRAM throughput 확인: 높으면 byte 절감, 낮으면 coalescing·MLP·shared memory", note: "같은 표본이라도 bandwidth 포화와 latency 미은닉은 처방이 반대입니다." },
            { code: "short_scoreboard → bank conflict·MUFU;  barrier → barrier 앞 일 균등화·block 축소;  wait → ILP·unroll;  pipe throttle → instruction mix", note: "각 처방은 기다리는 대상을 줄이는 쪽이며 barrier 축소는 shared memory 한도를 다시 확인합니다." },
            { code: "변경 하나 적용 → profiler 없이 elapsed 재측정 → stall 비율·issue active·elapsed 의 방향을 함께 기록", note: "Stall 비율만 줄고 elapsed 가 그대로면 그 stall 은 병목이 아니었습니다." },
          ]}
          repeatUntil="Issue active 가 목표에 닿거나 남은 stall 이 kernel 의 dependency 로 설명될 때까지 반복합니다."
          output="병목 가설 하나, 바꿀 instruction 하나, 그리고 다시 잴 때 기대하는 counter 의 방향"
        />
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stall reason 의 정의와 sampling 방식은 Nsight Compute 문서의 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sampler 가 SM 마다 고정 간격으로 active warp 하나를 골라 program counter 와
            scheduler 상태를 적는다는 서술, 32 에서 2048 clock 이라는 간격, 표본에 시간축이
            없다는 한계는 모두 Nsight Compute Profiling Guide 의 Warp Sampling 절에서
            가져왔습니다.
          </p>
          <p>
            Long scoreboard 가 L1TEX 경로를, short scoreboard 가 MIO 경로를, barrier 가 CTA
            barrier 의 형제 warp 를 기다린다는 정의와 각 항목의 처방 문장, not selected 가
            높으면 warp 가 충분하다는 해석, scheduler 가 매 clock issue 하면 stall 을 보지
            말라는 지침은 같은 문서의 Warp Stall Reasons 표와 section 설명의 것입니다.
          </p>
          <p>
            표본 100개의 분포, eligible 0.8, block 66개 같은 숫자는 문서 수치가 아니라 이
            글이 셈을 보이려고 둔 가정값입니다. Subpartition 당 warp 상한 16개와 H100 의 SM
            132개는 <Link to="/gpu/sm-warp-scheduling-and-issue#sm-structure">SM 내부 글</Link>
            의 근거를 그대로 씁니다.
          </p>
          <p>
            Profiling 을 hotspot 찾기의 첫 단계로 두고 effective bandwidth 를 측정 지표로
            삼으라는 우선순위는 CUDA C++ Best Practices Guide 의 것입니다. 이 글은 그
            지침 위에서 profiler 가 낸 숫자를 어떤 순서로 읽는지만 더합니다.
          </p>
        </div>
        <div id="paper-nsight-compute-warp-sampling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · Nsight Compute Profiling Guide · Warp Sampling, Warp Stall Reasons, Scheduler Statistics, Warp State Statistics"
            citeKey={1}
            href={NCU}
            type="code"
          >
            SM 마다 고정 간격으로 active warp 하나의 PC 와 scheduler 상태를 뽑는 sampling
            방식, active·eligible·issued warp 의 정의와 eligible 이 없는 clock 에 issue slot
            이 비는 서술, long·short scoreboard·barrier·not selected·wait·math pipe throttle
            같은 stall reason 의 정의와 처방 문장이 이 문서에 있습니다. Sampling 비율은
            상태의 통계이지 원인의 증명이 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-cuda-best-practices-profiling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Best Practices Guide 12.8.1 · Profile, Understanding Scaling, Effective Bandwidth"
            citeKey={2}
            href={PRACTICES}
            type="code"
          >
            Hotspot 을 찾기 위해 먼저 profiling 하라는 high priority 지침, Amdahl 로 강한
            scaling 의 상한을 보는 절차, effective bandwidth 를 성능 지표로 쓰라는 권고가
            여기에 있습니다. 예제의 V100 bandwidth 같은 수치는 그 GPU 에 묶이며 이 글의
            가정값과 무관합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/cuda-register-pressure#residency">register 가 residency 를 줄이는 경로</Link>,
          그리고 <Link to="/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">roofline 의 compute·memory bound 판정</Link>.
        </p>
      </section>
    </div>
  );
}
