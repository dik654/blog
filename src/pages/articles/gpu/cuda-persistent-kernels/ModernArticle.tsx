import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  PersistentLifecycleViz,
  QueueBackpressureViz,
  ResidencyBudgetViz,
  ShutdownReleaseViz,
  WorkAssignmentViz,
} from "./viz/PersistentQueueViz";

const PERSISTENT_THREADS = "https://doi.org/10.1109/InPar.2012.6339596";
const PROGRAMMING =
  "https://docs.nvidia.com/cuda/archive/13.4.2/cuda-programming-guide/index.html";
const CUTLASS_GROUPED =
  "https://docs.nvidia.com/cutlass/4.8.0/media/docs/cpp/grouped_scheduler.html";
const CCCL_MEMORY =
  "https://nvidia.github.io/cccl/unstable/libcudacxx/extended_api/memory_model.html";

export default function ModernCudaPersistentKernelArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" data-teach-level="S" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Long-lived GPU workers
          </p>
          <h2 className="break-keep text-balance text-3xl font-bold tracking-tight">
            Persistent kernel은 worker를 한 번만 띄우고 queue를 직접 책임집니다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          한 문장으로 말하면, persistent kernel은 작은 task마다 kernel을 다시
          시작하지 않고 이미 떠 있는 worker block이 queue에서 다음 task를 받아
          처리하는 방식입니다.
        </p>
        <p>
          그러면 자연스럽게 다음 질문이 생깁니다. Worker를 계속 띄워 두면 몇
          block까지 허용해야 하고, queue가 밀릴 때는 어떻게 막으며, 한 task를 두
          worker가 가져가지 않게 하고, 마지막에는 누가 모두 끝났다고 증명할까요?
          Launch를 아낀 만큼 이 네 계약이 새로 생깁니다.
        </p>
        <p>
          이 글은 하나의 설명용 fixture를 끝까지 따라갑니다. 4-SM 가상 장치에
          persistent worker block 4개를 띄우고, 16-slot queue로 task를 받습니다.
          평균 도착은 초당 300개, worker 하나의 평균 처리는 초당 100개입니다.
          불규칙 배분은 실행시간이 [8, 1, 1, 1, 8, 1, 1, 1]ms인 task 8개로
          비교합니다. 이 숫자는 실제 GPU 측정치가 아니라 계산과 판단 순서를 잇는
          고정 사례입니다.
        </p>
        <PersistentLifecycleViz />
        <div data-teach-level="B">
          <TermBreakdown
            title="이름을 붙이기 전에 서로 다른 상태 세 개를 구분합니다"
            description="Task 내용, 가져갈 권리, 결과를 읽어도 된다는 신호를 하나로 뭉치면 중복 실행과 조기 종료를 설명할 수 없습니다."
            items={[
              {
                term: "Task descriptor",
                description:
                  "무슨 연산을 어느 입력과 출력에 수행할지 가리키는 bounded record입니다.",
                example:
                  "Operation kind, tensor pointer, shape와 completion slot을 담습니다.",
                boundary:
                  "Descriptor가 보인다는 사실만으로 pointer lifetime과 payload visibility가 자동 보장되지는 않습니다.",
              },
              {
                term: "Queue ticket",
                description:
                  "어느 worker가 어느 task를 가져가는지 정하는 원자적 소유권입니다.",
                example:
                  "Atomic head 증가로 같은 slot을 두 worker가 실행하지 못하게 합니다.",
                boundary:
                  "Ticket 획득은 task 성공이나 output publication을 뜻하지 않습니다.",
              },
              {
                term: "Completion state",
                description:
                  "결과가 준비됐거나 취소·실패했다는 사실을 consumer에게 공개하는 상태입니다.",
                example:
                  "Worker가 output을 쓴 뒤 release store로 task별 completion을 갱신합니다.",
                boundary:
                  "실행시간이 다르면 dequeue 순서와 completion 순서는 달라질 수 있습니다.",
              },
            ]}
          />
        </div>
        <p>
          2012년 논문은 이 실행형을 Persistent Threads라고 부르고, resident할 수
          있는 정도의 grid와 반복 work-distribution loop를 핵심으로 설명했습니다.
          현대 CUDA에서도 응용 프로그램은 grid 크기와 작업 배분을 정할 뿐입니다.
          실제 block→SM 배치, 순서와 특정 mapping은 하드웨어 scheduler가 정하며
          프로그램이 통제하거나 정확성 근거로 삼을 수 없습니다.
        </p>
        <ContentBoundary article="cuda-persistent-kernels" />
      </section>

      <section id="worker-residency" data-teach-level="0" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Worker residency
          </p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
            먼저 “몇 개를 띄울 수 있는가”와 “몇 개를 띄울 것인가”를 나눕니다
          </h2>
        </header>
        <p>
          Persistent block은 queue가 비어도 registers와 shared memory를 붙잡을 수
          있습니다. 그래서 per-SM 자원 상한을 계산한 뒤, 다른 kernel·통신과
          latency headroom을 위해 실제 grid는 그보다 작게 선택할 수 있습니다.
        </p>
        <ResidencyBudgetViz />
        <ExplainedFormula
          question="Persistent worker block의 resident 상한은 어떻게 계산할까요?"
          idea={<>Register·shared memory·hardware block 한도에서 각각 SM당 상한을 구한 뒤, 가장 작은 값만 실제로 동시에 들어갈 수 있습니다.</>}
          formula={"B_{\\max}=N_{SM}\\min\\!\\left(B_{hw},\\left\\lfloor\\frac{R_{SM}}{R_b}\\right\\rfloor,\\left\\lfloor\\frac{S_{SM}}{S_b}\\right\\rfloor\\right)"}
          annotatedFormula={"B_{\\max}=\\underbrace{N_{SM}}_{\\text{설명용 4 SM}}\\min\\!\\left(\\underbrace{16}_{\\text{hardware}},\\underbrace{\\lfloor65536/8192\\rfloor}_{\\text{register}=8},\\underbrace{\\lfloor64/16\\rfloor}_{\\text{shared}=4}\\right)=\\underbrace{16}_{\\text{resident 상한}}"}
          operations={[
            { expression: "65536/8192=8", annotation: ["SM register 수를", "block당 register 수로 나눕니다"] },
            { expression: "64/16=4", annotation: ["SM shared-memory KiB를", "block당 KiB로 나눕니다"] },
            { expression: "4\\min(16,8,4)=16", annotation: ["세 상한의 최솟값 4를", "설명용 SM 수 4와 곱합니다"] },
          ]}
          terms={[
            { symbol: "B_{max}", name: "Resident upper bound", description: "동시에 resident할 수 있는 block 수의 계산 상한입니다." },
            { symbol: "N_{SM}", name: "SM count in fixture", description: "이 설명용 장치에서 고려하는 SM 수 4입니다." },
            { symbol: "R_{SM},R_b", name: "Register budgets", description: "SM 전체 register와 block 하나가 요구하는 register 수입니다." },
            { symbol: "S_{SM},S_b", name: "Shared-memory budgets", description: "SM 전체와 block 하나의 shared-memory 요구량입니다." },
            { symbol: "B_{hw}", name: "Hardware block limit", description: "Architecture가 허용하는 SM당 active block 상한입니다." },
          ]}
          assumptions={[
            "65,536 registers, 64KiB shared memory, hardware 상한 16은 계산을 위한 가상 값입니다.",
            "실제 occupancy는 allocation granularity, threads·warps, cluster와 target compute capability까지 occupancy API로 확인합니다.",
            "상한 16이 최적값이라는 뜻이 아니며 이 사례는 공존 여지를 위해 grid 4를 선택합니다.",
          ]}
          interpretation="계산 결과는 resident 가능한 최대 16 blocks입니다. 그러나 release 후보는 4 blocks로 시작해 queue tail과 다른 stream progress를 함께 재야 합니다."
        />
        <div id="paper-cuda-occupancy">
          <CitationBlock type="code" citeKey={2} source="NVIDIA CUDA Programming Guide 13.4.2 · Kernel Launch and Occupancy" href={PROGRAMMING}>
            <p><strong>문제:</strong> Grid를 launch한 뒤 block이 어떤 SM에서 언제 실행되는지와 resident resource 한계를 구분해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> Scheduler가 block을 SM에 배치하며, 응용 프로그램은 특정 block→SM mapping이나 scheduling order를 통제·조회할 수 없다고 명시합니다.</p>
            <p><strong>중요 가정:</strong> CUDA 13.4.2와 고정 target compute capability·launch configuration을 사용합니다.</p>
            <p><strong>근거 범위:</strong> Block scheduling과 occupancy의 공식 semantics입니다.</p>
            <p><strong>일반화 금지:</strong> 계산한 maximum resident blocks가 최적 persistent grid라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="queue-progress" data-teach-level="1" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Queue progress</p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
            평균 처리율을 맞춘 뒤에도 burst를 담을 경계가 필요합니다
          </h2>
        </header>
        <p>
          Producer가 worker보다 오래 빠르면 input buffer와 queue는 끝없이
          늘어납니다. Queue capacity를 고정하고 full일 때 producer를 기다리게 할지,
          요청을 거절할지, 일반 launch로 넘길지 먼저 정해야 합니다.
        </p>
        <QueueBackpressureViz />
        <ExplainedFormula
          question="이 fixture의 평균 queue가 장시간 계속 자라지 않을 조건은 무엇일까요?"
          idea={<>Worker 하나의 평균 service rate에 active worker 수를 곱해 총 capacity를 만들고 arrival rate와 비교합니다.</>}
          formula={"\\rho=\\frac{\\lambda}{C_{active}\\mu}<1"}
          annotatedFormula={"\\rho=\\frac{\\underbrace{300}_{\\text{도착 tasks/s}}}{\\underbrace{4}_{\\text{workers}}\\times\\underbrace{100}_{\\text{worker당 tasks/s}}}=\\underbrace{0.75}_{\\text{평균 utilization}}<1"}
          operations={[
            { expression: "4\\times100=400", annotation: ["active workers와", "worker당 처리율을 곱합니다"] },
            { expression: "300/400=0.75", annotation: ["평균 도착률을", "평균 처리 capacity로 나눕니다"] },
          ]}
          terms={[
            { symbol: "\\lambda", name: "Arrival rate", description: "Queue에 들어오는 평균 task 수, 이 사례에서는 초당 300개입니다." },
            { symbol: "C_{active}", name: "Active workers", description: "실제로 task를 처리하는 workers 4개입니다." },
            { symbol: "\\mu", name: "Per-worker service rate", description: "Worker 하나의 평균 처리율, 이 사례에서는 초당 100개입니다." },
            { symbol: "\\rho", name: "Utilization fixture", description: "단순 평균 capacity 대비 도착률 75%입니다." },
          ]}
          assumptions={[
            "Worker service rate가 독립적으로 100/s를 유지한다는 단순화입니다.",
            "Atomic contention, task-size 분포와 co-run interference가 μ를 바꿀 수 있습니다.",
            "ρ<1은 평균 안정 조건일 뿐 burst·p95 wait와 overflow가 없다는 보장이 아닙니다.",
          ]}
          interpretation="평균 headroom은 100 tasks/s입니다. 하지만 16-slot queue에 12개가 있을 때 6개가 오면 2개가 넘치므로 backpressure 정책은 여전히 필요합니다."
        />
      </section>

      <section id="work-assignment" data-teach-level="2" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Work assignment</p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
            미리 나누면 불균형을 내고, 그때그때 받으면 ticket 비용을 냅니다
          </h2>
        </header>
        <p>
          이제 queue의 task를 workers에게 나눕니다. Static strided 방식은 worker
          <code className="mx-1">b</code>가 <code>b, b+g, b+2g</code>를 맡아
          queue atomic이 거의 없지만 긴 task가 한 worker에 겹칠 수 있습니다.
          Dynamic 방식은 일이 끝난 worker가 atomic ticket으로 다음 task를 받아
          균형을 개선하지만 task마다 scheduling 비용을 냅니다.
        </p>
        <WorkAssignmentViz />
        <ExplainedFormula
          question="Static 배분의 불균형과 ticket 비용을 같은 단위로 어떻게 비교할까요?"
          idea={<>먼저 worker별 busy time에서 makespan과 평균을 구하고, 별도로 ticket 한 번의 시간 비율을 짧은 task와 긴 task 각각에 나눕니다.</>}
          formula={"L_{static}=\\frac{16}{(16+2+2+2)/4}=2.91,\\qquad h_{short}=\\frac{0.05}{1}=5\\%"}
          annotatedFormula={"L_{static}=\\frac{\\underbrace{16\\text{ ms}}_{\\text{마지막 worker}}}{\\underbrace{5.5\\text{ ms}}_{\\text{worker 평균}}}=2.91,\\qquad h_{short}=\\frac{\\underbrace{0.05\\text{ ms}}_{\\text{ticket 가정}}}{\\underbrace{1\\text{ ms}}_{\\text{짧은 task}}}=5\\%"}
          operations={[
            { expression: "(16+2+2+2)/4=5.5", annotation: ["네 worker의 busy time을 더해", "worker 수 4로 나눕니다"] },
            { expression: "16/5.5=2.91", annotation: ["마지막 worker 시간을", "평균 busy time으로 나눕니다"] },
            { expression: "0.05/1=0.05", annotation: ["가정한 ticket 0.05ms를", "짧은 task 1ms로 나눕니다"] },
          ]}
          terms={[
            { symbol: "L_{static}", name: "Load-balance ratio", description: "가장 늦은 worker 시간÷worker 평균 busy time입니다. 1에 가까울수록 균형적입니다." },
            { symbol: "h_{short}", name: "Short-task ticket share", description: "1ms task에서 0.05ms ticket이 차지하는 설명용 비율입니다." },
          ]}
          assumptions={[
            "[8,1,1,1,8,1,1,1]ms와 ticket 0.05ms는 설명용 가정입니다.",
            "Dynamic makespan 9ms는 scheduling만 추적한 값이며 atomic serialization은 포함하지 않습니다.",
            "Aggregate ticket work 8×0.05=0.4ms를 makespan에 그대로 더할 수는 없습니다. Worker 간 overlap과 contention을 실측해야 합니다.",
          ]}
          interpretation="이 fixture에서는 static 16ms보다 dynamic scheduling 9ms가 유리해 보입니다. 그러나 task가 모두 1ms이고 ticket이 5%라면 chunk나 static이 다시 유리할 수 있습니다."
        />
        <p>
          Chunked dynamic은 atomic 한 번에 <code>k</code>개를 가져가 ticket 수를
          대략 1/<code>k</code>로 줄이는 대신 최대 <code>k</code> tasks만큼
          불균형을 다시 만듭니다. Per-worker deque와 work stealing은 평상시
          contention을 나누지만 victim 선택, 빈 queue polling과 “모두 비었다”는
          종료 판정이 추가됩니다.
        </p>
        <AlgorithmBlock
          title="같은 8-task fixture를 네 배분 loop로 읽는 의사코드"
          input={[
            "T=8, g=4, durations=[8,1,1,1,8,1,1,1]ms",
            "next: dynamic global ticket, queue[b]: stealing용 worker별 deque",
            "run(tile): 해당 task를 정확히 한 번 실행하고 completion을 남김",
          ]}
          steps={[
            { code: "static: for (tile=b; tile<T; tile+=g) run(tile)", note: "W0가 T0·T4를 맡아 16ms, 나머지는 2ms가 됩니다." },
            { code: "dynamic: while ((tile=atomicAdd(&next,1))<T) run(tile)", note: "먼저 빈 worker가 다음 task를 받아 이 fixture의 scheduling makespan은 9ms입니다." },
            { code: "chunk: base=atomicAdd(&next,k); for (i=0; i<k; ++i) run(base+i)", note: "Ticket 수는 줄지만 마지막 chunk가 한 worker에 남을 수 있습니다." },
            { code: "steal: tile=pop_tail(queue[b]); if EMPTY, tile=steal_head(victim)", note: "자기 queue는 싸지만 훔치기와 종료 합의가 새 비용입니다." },
            { code: "publish_completion(tile, status, release)", note: "어떤 배분이든 task별 성공·실패·취소를 결과 뒤에 공개해야 합니다." },
          ]}
          repeatUntil="자기 static 몫, global counter 또는 모든 worker queue가 빌 때까지 반복합니다."
          output="각 task가 정확히 한 번 terminal state를 갖고, makespan·ticket cost·p95가 기록됩니다"
        />
        <div id="paper-cutlass-persistent-scheduler">
          <CitationBlock type="code" citeKey={3} source="NVIDIA CUTLASS 4.8 · Grouped Kernel Schedulers" href={CUTLASS_GROUPED}>
            <p><strong>문제:</strong> 여러 GEMM problem의 output tiles를 전체 tile 수보다 적은 persistent threadblocks에 배분해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> 각 block의 tile index를 blockIdx.x에서 시작해 gridDim.x만큼 증가시키는 round-robin scheduler loop를 문서화합니다.</p>
            <p><strong>중요 가정:</strong> CUTLASS 4.8 grouped-kernel 구조와 해당 problem visitor를 사용합니다.</p>
            <p><strong>근거 범위:</strong> Static strided persistent assignment의 실제 공식 구현 패턴입니다.</p>
            <p><strong>일반화 금지:</strong> 불규칙 task에서 같은 배분이 낮은 p95나 최적 load balance를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="shutdown" data-teach-level="3" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · Publication and shutdown</p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
            결과를 먼저 쓰고 신호를 공개한 뒤, 네 worker 모두의 종료를 증명합니다
          </h2>
        </header>
        <p>
          Atomic ticket만 있다고 descriptor와 output이 올바른 순서로 보이는 것은
          아닙니다. Producer는 payload를 먼저 쓴 뒤 ready·tail을 release로
          공개하고, worker는 같은 scope의 acquire로 관측해야 합니다. Worker도
          output을 쓴 뒤 completion을 release로 공개합니다.
        </p>
        <p>
          GPU blocks끼리 공유하는 queue라면 device scope가 후보입니다. CPU가 같은
          atomic object를 직접 읽고 쓴다면 system scope뿐 아니라 unified·mapped
          memory와 device capability 조건까지 맞아야 합니다. 그렇지 않으면 CUDA
          stream/event·copy 같은 API 경계로 host 관측을 설계해야 합니다.
        </p>
        <ShutdownReleaseViz />
        <AlgorithmBlock
          title="Sentinel 하나 대신 상태 전이로 닫는 persistent loop"
          input={[
            "closed=false, bounded queue, in_flight=0, exits=0",
            "task별 terminal state: success | failed | cancelled",
            "ready·completion atomics는 producer와 consumer를 포함하는 scope를 사용",
          ]}
          steps={[
            { code: "producer: write_descriptor(slot); ready.store(true, release)", note: "Payload를 쓴 뒤에만 task가 준비됐다고 공개합니다." },
            { code: "worker: if (ready.load(acquire)) claim_ticket(); ++in_flight", note: "Acquire 뒤 descriptor를 읽고 unique ticket으로 소유권을 얻습니다." },
            { code: "worker: run(); write_output(); completion.store(status, release)", note: "결과를 쓴 뒤 terminal state를 공개합니다." },
            { code: "shutdown: closed.store(true, release); stop_new_publish()", note: "Sentinel 하나가 아니라 모든 worker가 볼 수 있는 입력 상태를 닫습니다." },
            { code: "worker: if (closed && queue_empty && in_flight==0) { ++exits; return; }", note: "Queue와 진행 중 task가 모두 비고 네 worker가 빠져나왔음을 관측합니다." },
          ]}
          repeatUntil="closed=true, queue=0, in_flight=0, exits=4가 모두 성립할 때까지 drain합니다."
          output="Task마다 terminal state가 남고 host가 kernel completion 또는 오류를 유한 시간 안에 관측합니다"
        />
        <div id="paper-cuda-memory-model">
          <CitationBlock type="code" citeKey={4} source="NVIDIA CCCL libcu++ · CUDA C++ Memory Model" href={CCCL_MEMORY}>
            <p><strong>문제:</strong> 서로 다른 block이나 CPU·GPU 사이에서 payload와 flag의 가시성을 올바른 scope로 연결해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> system·device·cluster·block thread scope와 release/acquire message-passing semantics를 정의합니다.</p>
            <p><strong>중요 가정:</strong> Atomic object가 선택한 scope와 memory 종류의 지원 조건을 만족합니다.</p>
            <p><strong>근거 범위:</strong> Queue ready·completion publication에 필요한 memory-order 계약입니다.</p>
            <p><strong>일반화 금지:</strong> 올바른 memory order가 queue의 fairness·bounded waiting·성능을 자동 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-persistent-threads">
          <CitationBlock type="paper" citeKey={1} source="A Study of Persistent Threads Style GPU Programming for GPGPU Workloads" href={PERSISTENT_THREADS}>
            <p><strong>문제:</strong> 반복 launch와 long-lived GPU workers의 workload별 trade-off를 비교합니다.</p>
            <p><strong>핵심 아이디어:</strong> Resident grid와 work-distribution loop를 갖는 Persistent Threads style, 그리고 synchronization·load balancing·locality use cases를 분류합니다.</p>
            <p><strong>중요 가정:</strong> 2009년대 GPU와 논문의 microbenchmark에 결과를 귀속합니다.</p>
            <p><strong>근거 범위:</strong> Persistent execution model의 역사적 primary evidence입니다.</p>
            <p><strong>일반화 금지:</strong> 현대 GPU·실서비스 task에서 같은 speedup이나 atomic 비용을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" data-teach-level="4" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">05 · Persistent release gate</p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
            정답·꼬리·공존·종료를 함께 통과해야 채택합니다
          </h2>
        </header>
        <p>
          Baseline multi-launch와 persistent candidate에 동일한 task 순서와 결과
          검사를 적용합니다. 먼저 output parity, loss·duplicate 0건, task별
          terminal state를 확인합니다. 그다음 end-to-end median·p95, queue wait
          p95·max, overflow·fallback 수를 비교합니다.
        </p>
        <p>
          Persistent grid와 동시에 작은 probe kernel이나 collective를 실행해 다른
          stream의 progress가 유지되는지도 봅니다. 정상 close, queue full, device
          error, host cancel을 각각 넣어 유한 시간 안에 exits=4 또는 명시적 오류로
          끝나는지 확인합니다. 하나라도 hang이면 즉시 일반 launch로 rollback합니다.
        </p>
        <p>
          결론적으로 persistent kernel이 좋은 때는 작은 task가 반복되어 launch와
          prologue 비중이 크고, bounded queue와 안정적인 work supply를 만들 수 있을
          때입니다.
        </p>
        <p>
          Task 하나가 이미 길거나 arrival이 드물고, ticket·polling과 resident 자원
          비용이 launch 절감보다 크면 일반 kernel이나 CUDA Graph가 더 단순한
          선택입니다. Stage를 한 kernel 안에 합치는 문제는{" "}
          <Link className="text-primary hover:underline" to="/cs/gpu/cuda-kernel-fusion">
            kernel fusion과 Megakernel
          </Link>
          이 이어받습니다.
        </p>
      </section>
    </article>
  );
}
