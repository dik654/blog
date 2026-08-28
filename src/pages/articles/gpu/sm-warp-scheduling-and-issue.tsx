import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SmWarpSchedulingAndIssueViz from "./sm-warp-scheduling-and-issue/viz/SmWarpSchedulingAndIssueViz";

const GUIDE = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const NSIGHT = "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html";
const HOPPER = "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/";

/**
 * SM 내부: subpartition 이 warp 를 고르고 scoreboard 가 issue 를 막습니다
 *
 * SM 안에서 warp 하나의 instruction 이 어떤 단위에서, 어떤 조건으로, 어떤 순서로
 * issue 되는지를 소유한다. Grid·block·thread 의 논리 계층은 /gpu/cuda-thread-hierarchy,
 * occupancy 의 resource 한도 계산은 /gpu/gpu-architecture, register 가 residency 를
 * 줄이는 경로는 /gpu/cuda-register-pressure 가 소유한다.
 */
export default function SmWarpSchedulingAndIssueArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="sm-structure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SM 은 warp 를 issue 하는 subpartition 4개로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GPU 가 한 clock 에 실제로 실행하는 단위는 thread 도 block 도 아니고 warp 의
            instruction 하나입니다. 그 instruction 을 고르는 하드웨어가 SM(Streaming
            Multiprocessor) 안의 subpartition 이고, subpartition 마다 warp scheduler 하나가
            매 clock 자기 warp 들 가운데 하나를 골라 instruction 하나를 내보냅니다.
          </p>
          <p>
            CUDA programming model 은 프로그래머에게 grid, block, thread 와 kernel 함수만
            보여 줍니다. 그 계층이 어떤 SM 에 놓이고 어떤 순서로 실행되는지는 모델이 약속하지
            않고 하드웨어가 정합니다. Block 은 SM 하나에 통째로 놓이고, block 의 thread 는
            32개씩 warp 로 묶이며, 각 warp 는 SM 안의 subpartition 하나에 배정됩니다.
          </p>
          <p>
            SM 하나는 subpartition 4개로 나뉩니다. Subpartition 마다 warp scheduler 하나,
            dispatch unit, register file 의 한 조각, 그리고 FP32·INT32·Tensor Core 같은
            실행 pipe 가 있습니다. Nsight Compute 문서는 이 단위를 SMSP 라고 부르고 SM 의
            일차 처리 요소로 정의합니다.
          </p>
          <p>
            숫자로 보면 이렇습니다. Scheduler 하나가 clock 당 warp instruction 하나를
            issue 하므로 SM 하나는 clock 당 최대 4개, thread 기준으로는 128 thread
            instruction 을 냅니다. H100 SXM5 의 SM 132개를 곱하면 chip 전체의 issue 상한은
            clock 당 warp instruction 528개입니다.
          </p>
          <p>
            이 상한은 subpartition 마다 ready 인 warp 가 매 clock 하나 이상 있을 때만
            채워집니다. Warp 가 왜 ready 가 아닌지, 그 판정을 누가 하는지가 다음 절의
            scoreboard 이고, ready warp 를 충분히 확보하는 방법이 그다음 절의 latency
            hiding 입니다. Warp 32 lane 의 SIMT 실행 자체는{" "}
            <Link to="/gpu/cuda-thread-hierarchy#overview">CUDA 스레드 계층</Link> 이 다룹니다.
          </p>
        </div>
        <SmWarpSchedulingAndIssueViz />
        <ContentBoundary article="sm-warp-scheduling-and-issue" />
      </section>

      <section id="issue-scoreboard" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Scoreboard 가 지운 warp 만 scheduler 의 issue 후보가 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Scheduler 는 매 clock 자기 subpartition 에 resident 한 warp(active warp) 들을
            보고, 그 가운데 다음 instruction 의 입력이 모두 준비된 warp(eligible warp, 이 글의
            ready warp) 중 하나를 골라 instruction 하나를 issue 합니다. 준비되지 않은 warp 는
            stalled warp 로 남고 그 clock 에는 후보에서 빠집니다.
          </p>
          <p>
            준비 여부를 판정하는 장치가 scoreboard 입니다. Warp 가 instruction 을 issue 하면
            그 결과 register 에 아직 값이 오지 않았다는 표시가 남고, 결과가 도착하면 표시가
            지워집니다. 다음 instruction 이 그 register 를 읽으려면 표시가 지워질 때까지
            기다려야 하므로, scoreboard 는 register 의존을 시간으로 바꾸는 장부입니다.
          </p>
          <p>
            Nsight Compute 는 이 기다림을 원인별로 셉니다. Global·local memory 의 결과를
            기다리면 long scoreboard, shared memory 같은 짧은 경로를 기다리면 short
            scoreboard, 산술 instruction 의 고정 latency 를 기다리면 wait 입니다. 준비는
            됐지만 다른 warp 가 선택돼 밀린 상태는 not selected 로 따로 셉니다.
          </p>
          <p>
            Issue 와 dispatch 는 다른 단계입니다. Issue 는 scheduler 가 후보 가운데 warp 를
            골라 instruction 을 내보내는 결정이고, dispatch 는 그 instruction 을 FMA·ALU·
            LSU 같은 실제 pipe 로 보내는 단계입니다. Pipe 가 이미 차 있으면 issue 된
            instruction 도 기다리며, 이 상태를 문서는 math pipe throttle 로 구분합니다.
          </p>
          <p>
            Subpartition 하나에 warp 4개가 있고 매 clock 그중 하나만 준비돼 있어도 scheduler
            는 clock 마다 issue 를 이어 갈 수 있습니다. 어느 clock 에 준비된 warp 가 하나도
            없으면 그 clock 의 issue slot 은 비고, 이것이 다음 절의 pipeline bubble 입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Warp scheduler 의 한 clock"
          input={["active: 이 subpartition 에 resident 한 warp 집합(최대 16개)", "scoreboard[w]: warp w 가 기다리는 미완료 결과의 표시", "pipe 상태: FMA·ALU·LSU·Tensor 각 pipe 의 빈 자리"]}
          steps={[
            { code: "eligible = { w ∈ active : scoreboard[w] 가 다음 instruction 의 입력 register 를 막지 않음 }", note: "Scoreboard 표시가 남은 warp 는 stalled 로 분류돼 이번 clock 후보에서 빠집니다." },
            { code: "if eligible == ∅: issue slot 을 비움 (pipeline bubble); return", note: "Nsight Compute 의 No Eligible 비율이 이 분기를 셉니다." },
            { code: "w* = select(eligible)  // 정책은 문서화되지 않은 hardware 우선순위", note: "선택되지 않은 나머지 eligible warp 는 not selected 로 기록됩니다." },
            { code: "issue(w*.next_instruction);  scoreboard[w*] += 결과 register 표시", note: "결과가 pipe 를 지나 register 에 쓰일 때까지 표시가 남습니다." },
            { code: "dispatch(instruction → pipe);  pipe 가 차 있으면 대기 (pipe throttle)", note: "Issue 가 됐다고 즉시 실행되지 않습니다. Pipe 폭이 두 번째 상한입니다." },
            { code: "결과 도착 시 scoreboard[w] 의 해당 표시를 지움 → w 는 다시 eligible 후보", note: "이 clearing 이 dependency latency 만큼 늦게 일어납니다." },
          ]}
          repeatUntil="Subpartition 에 resident warp 가 남아 있는 동안 매 clock 반복합니다."
          output="이번 clock 에 issue 된 warp instruction 하나 또는 빈 issue slot"
        />
      </section>

      <section id="latency-hiding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Dependency latency 는 ready warp 와 ILP 로만 숨겨집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 warp 안에서 앞 instruction 의 결과를 다음 instruction 이 바로 쓰면 그 사이의
            시간은 어떤 최적화로도 없어지지 않습니다. 이 시간이 instruction dependency
            latency 이고, 결과를 이어받는 instruction 의 줄이 dependency chain 입니다.
            Scheduler 가 할 수 있는 일은 그 시간 동안 다른 warp 의 instruction 을 issue 하는
            것뿐입니다.
          </p>
          <p>
            CUDA C++ Programming Guide 는 compute capability 7.x 에서 대부분의 산술
            instruction 의 latency 를 약 4 clock 으로 적고, scheduler 4개짜리 SM 이 이를
            숨기려면 active warp 16개가 필요하다고 씁니다.
          </p>
          <p>
            Scheduler 하나로 나누면 warp 4개입니다. Warp 하나가 issue 한 뒤 4 clock 을
            기다리는 동안 나머지 3개가 한 clock 씩 채우면 issue slot 이 비지 않습니다.
          </p>
          <p>
            이 셈은 Little's law 입니다. Issue 속도 1 instruction/clock 에 latency 4 clock
            이면 언제나 instruction 4개가 결과를 기다리는 중이어야 합니다. 그 4개를 warp
            4개가 하나씩 들고 있는 것이 thread-level parallelism(TLP) 이고, warp 2개가 서로
            독립인 instruction 을 2개씩 들고 있는 것이 instruction-level parallelism(ILP)
            입니다.
          </p>
          <p>
            Memory 는 같은 식에 큰 latency 를 넣는 경우입니다. Global load 의 latency 를
            가정값 500 clock 으로 두면 기다리는 load 가 언제나 500개 있어야 하는데,
            subpartition 의 warp 상한은 16개입니다. Warp 마다 독립 load 를 32개 가까이
            띄워야 하고, 이렇게 한 warp 가 여러 memory 요청을 동시에 띄우는 정도가
            memory-level parallelism(MLP) 입니다.
          </p>
          <p>
            준비된 warp 가 하나도 없는 clock 이 pipeline bubble 입니다. 이 글의 bubble 은
            SM 의 issue pipeline 에 생기는 빈 slot 을 뜻하며, 분산 추론에서 pipeline
            parallel stage 가 노는 bubble 과는 다른 층위의 말입니다. Nsight Compute 는 이
            비율을 No Eligible 로 보여 주고, 1000 clock 에 600번 issue 했다면 slot 의 40%
            가 bubble 입니다.
          </p>
          <p>
            Ready warp 를 늘리는 한도는 register 와 shared memory 입니다. Thread 당
            register 가 늘면 resident warp 가 줄어 TLP 로 숨길 수 있는 latency 가 줄고,
            그 계산은 <Link to="/gpu/gpu-architecture#gpu-latency-hiding-occupancy">occupancy resource bound</Link> 와{" "}
            <Link to="/gpu/cuda-register-pressure#residency">register residency</Link> 가
            다룹니다.
          </p>
        </div>
        <ExplainedFormula
          question="Latency L 을 숨기려면 scheduler 하나에 ready warp 가 몇 개 있어야 하나요?"
          idea="Issue slot 이 비지 않으려면 latency 동안 기다리는 instruction 수가 issue 속도 × latency 만큼 항상 유지돼야 하고, 그 수를 warp 하나가 독립적으로 들 수 있는 instruction 수로 나누면 필요한 warp 수가 됩니다."
          formula={String.raw`\begin{aligned}
I_{\mathrm{flight}} &= L_{\mathrm{dep}} \cdot r_{\mathrm{issue}} \\
W_{\mathrm{ready}} &\ge \left\lceil \frac{I_{\mathrm{flight}}}{\mathrm{ILP}_w} \right\rceil
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
I_{\mathrm{flight}} &= \underbrace{L_{\mathrm{dep}}}_{\text{결과까지 clock 수}} \cdot \underbrace{r_{\mathrm{issue}}}_{\text{clock 당 issue 수}} \\
W_{\mathrm{ready}} &\ge \underbrace{\left\lceil \frac{I_{\mathrm{flight}}}{\mathrm{ILP}_w} \right\rceil}_{\text{warp 하나가 독립적으로 드는 수로 나눔}}
\end{aligned}`}
          operations={[
            { expression: String.raw`L_{\mathrm{dep}} \cdot r_{\mathrm{issue}}`, annotation: ["Latency 와 issue 속도를 곱해", "항상 결과를 기다리고 있어야 하는 instruction 수를 구함"] },
            { expression: String.raw`\left\lceil \frac{I_{\mathrm{flight}}}{\mathrm{ILP}_w} \right\rceil`, annotation: ["그 수를 warp 하나의 독립 instruction 수로 나누고 올림해", "필요한 ready warp 수를 얻음"] },
          ]}
          terms={[
            { symbol: String.raw`L_{\mathrm{dep}}`, name: "Instruction dependency latency", description: "Issue 부터 결과 register 가 쓰여 scoreboard 표시가 지워질 때까지의 clock 수입니다. 산술은 약 4, global load 는 수백입니다." },
            { symbol: String.raw`r_{\mathrm{issue}}`, name: "Issue 속도", description: "Scheduler 하나가 clock 당 내보내는 warp instruction 수로 최대 1 입니다." },
            { symbol: String.raw`\mathrm{ILP}_w`, name: "Warp 당 독립 instruction 수", description: "한 warp 가 앞 결과를 기다리지 않고 연달아 issue 할 수 있는 instruction 수입니다. Memory 요청이면 MLP 입니다." },
            { symbol: String.raw`W_{\mathrm{ready}}`, name: "필요한 ready warp 수", description: "매 clock 후보가 비지 않게 하려면 subpartition 에 있어야 하는 준비된 warp 수입니다." },
          ]}
          assumptions={["Issue 속도가 pipe 폭에 막히지 않는 경우입니다. Pipe throttle 이 있으면 r 이 1 보다 작아집니다.", "Latency 를 상수로 둔 근사입니다. Cache hit 여부에 따라 memory latency 는 수십에서 수백 clock 으로 흔들립니다.", "Little's law 는 장기 평균에 대한 식이므로 kernel 시작과 끝의 fill·drain 구간은 따로 봅니다."]}
          interpretation="L=4, r=1 이면 instruction 4개가 항상 기다려야 하고 ILP 1 인 warp 는 4개, ILP 2 인 warp 는 2개면 됩니다. L=500 이면 warp 16개로는 warp 당 독립 요청 32개가 필요하므로 TLP 만으로는 부족하고 MLP 를 같이 늘려야 합니다."
        />
      </section>

      <section id="divergence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Divergence 는 lane 을 끄고 reconvergence 까지 경로를 직렬화합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Warp 의 32 lane 이 같은 조건문에서 다른 쪽으로 갈라지면 scheduler 는 두 경로를
            차례로 issue 합니다. 각 경로를 도는 동안 그 경로에 속하지 않는 lane 은 active
            mask 로 꺼지고, 두 경로가 다시 만나는 지점이 reconvergence point 입니다. 이 갈라짐이
            warp divergence 이고 비용은 issue slot 을 두 배로 쓰는 것입니다.
          </p>
          <p>
            비용은 lane 의 비율이 아니라 경로 길이의 합으로 정해집니다. Lane 16개가 10
            instruction 짜리 A 로, 16개가 10 instruction 짜리 B 로 가면 issue slot 은 20개이고
            lane 이용률은 (16×10+16×10)/(32×20)=50% 입니다.
          </p>
          <p>
            Lane 하나만 30 instruction 짜리 경로로 빠지고 31개가 10 instruction 경로면
            slot 은 40개, 이용률은 (30+310)/(32×40)≈27% 입니다.
          </p>
          <p>
            Lane 하나의 예외 처리가 warp 전체를 세 배 느리게 만드는 이유가 이것입니다.
            Divergence 는 instruction 이 늘어나는 것이지 scheduler 가 멈추는 것이 아니므로,
            scoreboard 로 인한 stall 과 profiler 에서 다른 항목으로 나타납니다. Divergence 는
            issued instruction 대비 active thread 비율로 읽습니다.
          </p>
          <p>
            Volta 이후의 independent thread scheduling 은 lane 마다 program counter 와 call
            stack 을 두어 갈라진 경로들을 하드웨어가 번갈아 issue 할 수 있게 했습니다. 갈라진
            경로가 서로를 기다리는 lock 도 교착 없이 돌지만, 한 clock 에 issue 되는 것은 여전히
            한 경로의 lane 들뿐이므로 처리량 비용은 그대로입니다.
          </p>
          <p>
            같은 warp 의 lane 이 같은 방향으로 가도록 data 를 배치하면 divergence 는
            사라집니다. Lane 별 조건이 thread index 의 32 배수 경계와 맞으면 warp 단위로만
            갈라지므로 두 경로가 한 warp 안에 겹치지 않습니다. 이 배치는 memory coalescing 과
            같은 원리이며 <Link to="/gpu/cuda-shared-memory#coalescing">Coalescing</Link> 에서
            이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="Nsight Compute 가 구분하는 warp 의 상태"
          description="같은 subpartition 의 warp 가 한 clock 에 어느 상태였는지를 profiler 가 sampling 으로 셉니다. 원인이 다르면 처방도 다릅니다."
          items={[
            { term: "Selected", description: "이 clock 에 scheduler 가 이 warp 를 골라 instruction 을 issue 했습니다.", example: "1000 clock 중 600번이면 issue slot 이용률 60% 입니다.", boundary: "Issue 됐어도 pipe 가 차 있으면 실행은 뒤로 밀립니다." },
            { term: "Not selected", description: "준비는 됐지만 같은 clock 에 다른 eligible warp 가 선택됐습니다.", example: "Eligible 이 평균 3개면 두 개는 매 clock not selected 입니다.", boundary: "이 비율이 높으면 warp 가 부족한 것이 아니라 충분한 것입니다." },
            { term: "Long scoreboard", description: "Global·local·texture memory 의 결과를 기다립니다.", example: "L2 miss 뒤 HBM 왕복 수백 clock 동안 이 상태입니다.", boundary: "Coalescing 이나 MLP 로 줄이며 warp 수만 늘려서는 한계가 있습니다." },
            { term: "Short scoreboard", description: "Shared memory 같은 짧은 on-chip 경로의 결과를 기다립니다.", example: "Bank conflict 로 shared load 가 여러 차례로 나뉘면 길어집니다.", boundary: "수십 clock 단위라 TLP 로 대부분 숨겨집니다." },
            { term: "Wait", description: "산술 instruction 의 고정 latency 를 기다립니다.", example: "FFMA 결과를 바로 쓰는 chain 에서 약 4 clock 씩 쌓입니다.", boundary: "Ready warp 4개 또는 ILP 로 숨겨지는 종류입니다." },
            { term: "Math pipe throttle", description: "Issue 할 pipe 가 이미 차 있어 기다립니다.", example: "모든 warp 가 FP64 pipe 만 쓰면 pipe 폭이 상한이 됩니다.", boundary: "이때는 warp 를 늘려도 issue 가 늘지 않습니다." },
          ]}
        />
        <ProgressiveDetail
          title="Independent thread scheduling 이 divergence 비용을 없애지는 못하나요?"
          preview="없애지 못합니다. Lane 별 PC 로 갈라진 경로를 번갈아 issue 할 수 있게 됐을 뿐 한 clock 의 issue 는 여전히 한 경로의 lane 들이고, 대신 갈라진 경로 사이의 교착이 사라지고 reconvergence 를 컴파일러가 보장하지 않게 됐습니다."
        >
          <p>
            Volta 이전에는 warp 하나가 program counter 하나를 공유했으므로 갈라진 경로 중
            한쪽이 다른 쪽이 잡은 lock 을 기다리면 영원히 진행하지 못했습니다. Compute
            capability 7.0 부터는 lane 마다 PC 와 stack 을 두어 scheduler 가 두 경로를
            번갈아 issue 할 수 있고, 그 결과 갈라진 경로 안의 spin lock 도 돌아갑니다.
          </p>
          <p>
            대신 두 경로가 언제 다시 합쳐지는지를 하드웨어가 보장하지 않습니다. 갈라진 뒤
            warp 전체가 참여해야 하는 shuffle 이나 vote 를 쓰려면 <code>__syncwarp()</code>
            로 reconvergence 를 명시해야 하고, mask 를 받는 <code>*_sync</code> 계열
            intrinsic 이 그래서 생겼습니다. 문서의 SIMT Architecture 절이 이 변화를 적고
            있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Programming Guide 와 Nsight Compute 가 이 그림의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Warp 32 thread, 경로 직렬화, hardware multithreading 의 on-chip context, 산술
            latency 약 4 clock 과 warp 16개라는 수치는 모두 NVIDIA CUDA C++ Programming
            Guide 12.8.1 의 문장입니다.
          </p>
          <p>
            Scoreboard 라는 이름과 stall 원인의 분류, SM 을 subpartition 4개로 나누는
            서술은 Nsight Compute Profiling Guide 에서 가져왔습니다.
          </p>
          <p>
            SM 132개, subpartition 당 scheduler 하나라는 H100 SXM5 의 구성은 NVIDIA 의
            Hopper architecture 소개 글의 SM diagram 을 읽은 것입니다. Scheduler 가 eligible
            warp 가운데 어느 것을 고르는지의 우선순위 정책은 어느 문서에도 공개돼 있지 않아
            이 글도 select 로만 적었습니다.
          </p>
          <p>
            Global load latency 500 clock 은 문서 수치가 아니라 이 글이 계산 예를 위해 둔
            가정값입니다. 실제 값은 cache hit 여부와 세대에 따라 수십에서 수백 clock 사이에서
            움직이므로, 자기 kernel 의 수치는 Nsight Compute 의 warp state sampling 으로
            직접 읽어야 합니다.
          </p>
        </div>
        <div id="paper-cuda-simt-multithreading" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Programming Guide 12.8.1 · SIMT Architecture, Hardware Multithreading, Multiprocessor Level"
            citeKey={1}
            href={GUIDE}
            type="code"
          >
            Warp 32 thread 의 SIMT 실행, divergence 시 경로 직렬화, Volta 의 independent
            thread scheduling, warp 의 execution context 가 on-chip 에 유지되어 scheduler 가
            ready warp 를 골라 issue 한다는 서술, 그리고 CC 7.x 산술 latency 약 4 clock 과
            scheduler 4개 SM 의 warp 16개 요건이 여기에 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-nsight-compute-scheduler" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · Nsight Compute Profiling Guide · Scheduler Statistics, Warp State Statistics"
            citeKey={2}
            href={NSIGHT}
            type="code"
          >
            SM 을 subpartition(SMSP) 4개로 나누고 각 subpartition 의 scheduler 가 매 cycle
            active warp 가운데 eligible warp 를 골라 issue 한다는 정의, 그리고 long
            scoreboard·short scoreboard·wait·not selected·math pipe throttle 같은 stall
            원인의 분류가 이 문서의 것입니다.
          </CitationBlock>
        </div>
        <div id="paper-hopper-sm-diagram" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA Developer Blog · NVIDIA Hopper Architecture In-Depth"
            citeKey={3}
            href={HOPPER}
          >
            H100 SXM5 의 SM 132개와 SM 당 처리 block 4개라는 구성, SM 당 Tensor Core 4개의
            배치를 SM diagram 에서 읽었습니다. Peak 수치는 SKU·clock 조건에 묶인 NVIDIA
            자기보고이며 이 글은 issue 상한 계산에 SM 수만 씁니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/gpu-memory-hierarchy-and-roofline">GPU memory hierarchy 와 roofline</Link>,
          그리고 <Link to="/gpu/cuda-register-pressure#residency">register 가 residency 를 줄이는 경로</Link>.
        </p>
      </section>
    </div>
  );
}
