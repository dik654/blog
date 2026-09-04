import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import PersistentQueueViz from "./viz/PersistentQueueViz";

const PERSISTENT_THREADS = "https://doi.org/10.1109/InPar.2012.6339596";
const PROGRAMMING =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const CUTLASS_EFFICIENT_GEMM =
  "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md";

export default function ModernCudaPersistentKernelArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Long-lived GPU workers
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Persistent kernel은 launch를 없애는 대신 queue와 종료의 책임을
            가져온다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          일반 실행은 host가 kernel을 launch하고 grid가 일을 끝내면 종료합니다. Persistent kernel은 일부 worker blocks를 GPU에 계속
          resident하게 둡니다. 이들이 host나 device producer가 게시한 task를 queue에서 꺼내 반복 처리합니다. Kernel의 수명과 각 task의 수명이
          여기서 분리됩니다.
        </p>
        <p>
          이 모델의 원래 이름이 Persistent Threads 입니다. Gupta, Stuart, Owens
          의 2012년 정의는 두 조건으로 이루어집니다. 첫째, kernel 은 GPU 에
          동시에 올라갈 수 있는 만큼만 block 을 띄웁니다(maximal launch).
          둘째, 각 thread 는 한 번 일하고 끝나는 대신 work queue 에서 다음
          일을 꺼내는 loop 를 돕니다.
        </p>
        <p>
          하드웨어 block scheduler 가 아니라 software 가 block 을 SM 에 배치합니다.
        </p>
        <p>
          그 논문은 이 모델이 쓸모 있는 경우를 넷으로 나눕니다. Host 를 거치지
          않는 CPU–GPU 동기화, 일의 크기가 고르지 않을 때의 load balancing,
          producer 가 만든 결과를 같은 SM 의 consumer 가 바로 쓰는 locality,
          그리고 kernel 안에서의 global synchronization 입니다. 이 글의 queue 는
          그중 둘째와 첫째를 다루고, 넷째는{" "}
          <Link
            className="text-primary hover:underline"
            to="/gpu/megakernel-design-tradeoffs#task-loop"
          >
            megakernel 글
          </Link>
          이 이어받습니다.
        </p>
        <p>
          같은 논문은 손해도 함께 적습니다. Work item 이 작아 atomic 으로 queue 를 읽는 횟수가 계산보다 자주 일어나면 atomic 압력이 커져 일반 launch 보다
          느려집니다. 실험도 2009년의 GTX 295 에 묶여 있습니다. 어느 쪽이 이기는지는 work item 하나의 시간과 queue 한 번의 비용의 비율로 정해지며, 그 셈은 아래
          work assignment 절이 합니다.
        </p>
        <TermBreakdown
          title="먼저 queue에서 이동하는 세 가지를 구분합니다"
          description="Task payload, 소유권 ticket, 완료 관측을 한 덩어리로 쓰면 중복 실행과 조기 종료를 설명할 수 없습니다."
          items={[
            {
              term: "Task descriptor",
              description:
                "Worker가 실행할 operation, input/output 위치와 sequence를 가리키는 bounded record입니다.",
              example:
                "Tensor pointer, shape, operation kind와 completion slot을 담을 수 있습니다.",
              boundary:
                "Pointer가 유효한 lifetime과 producer가 쓴 data visibility를 별도 동기화해야 합니다.",
            },
            {
              term: "Queue ticket",
              description:
                "어느 worker가 어떤 slot의 task를 가져갔는지 정하는 원자적 소유권입니다.",
              example:
                "Atomic head 증가로 한 task를 두 workers가 동시에 소비하지 않게 합니다.",
              boundary:
                "Ticket 획득이 task 성공이나 result publication을 뜻하지는 않습니다.",
            },
            {
              term: "Completion sequence",
              description:
                "어느 task까지 결과가 publish되어 consumer가 안전하게 읽을 수 있는지 나타내는 관측 경계입니다.",
              example:
                "Worker가 output을 쓴 뒤 release semantics로 completion slot을 갱신합니다.",
              boundary:
                "Dequeue order와 completion order가 항상 같다고 가정하면 variable-duration tasks에서 막힐 수 있습니다.",
            },
          ]}
        />
        <PersistentQueueViz />
        <ContentBoundary article="cuda-persistent-kernels" />
      </section>

      <section id="worker-residency" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Worker residency
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            상주 blocks가 GPU 전체를 독점하지 않게 예산을 고정한다
          </h2>
        </header>
        <p>
          Persistent blocks는 queue가 비어도 resident resource를 그대로 붙잡습니다. Block당 registers·shared memory와 worker
          block 수를 함께 제한해 다른 kernels, communication work와 runtime progress에 공간을 남겨야 합니다. 모든 SM을 점유하면 낮은 queue
          latency를 얻는 대신 다른 stream과 collective를 굶길 수 있습니다.
        </p>
        <ExplainedFormula
          question="Persistent worker blocks의 상한은 왜 여러 자원 중 최소값일까요?"
          idea={
            <>
              SM마다 배치 가능한 block 수를 register·shared-memory·hardware
              limit에서 각각 구하고, 가장 먼저 소진되는 자원의 상한을 SM 수와
              곱합니다.
            </>
          }
          formula={String.raw`\begin{aligned}b_R&=\lfloor R_{SM}/R_b\rfloor\\b_S&=\lfloor S_{SM}/S_b\rfloor\\b_{SM}&=\min(B_{hw},b_R,b_S)\\B_p&\le N_{SM}b_{SM}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}b_R&=\lfloor\underbrace{R_{SM}/R_b}_{\text{register로 가능한 blocks}}\rfloor\\[3pt]b_S&=\lfloor\underbrace{S_{SM}/S_b}_{\text{shared로 가능한 blocks}}\rfloor\\[3pt]b_{SM}&=\min\!\left(\underbrace{B_{hw}}_{\text{hardware}},\underbrace{b_R}_{\text{register}},\underbrace{b_S}_{\text{shared}}\right)\\[3pt]B_p&\le\underbrace{N_{SM}}_{\text{사용할 SM}}\underbrace{b_{SM}}_{\text{SM당 workers}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`R_{SM}/R_b`,
              annotation: [
                "SM register 예산에",
                "worker block이 몇 개 들어가는지 계산",
              ],
            },
            {
              expression: String.raw`S_{SM}/S_b`,
              annotation: [
                "SM shared 예산에",
                "worker block이 몇 개 들어가는지 계산",
              ],
            },
            {
              expression: String.raw`N_{SM}\min(\cdots)`,
              annotation: [
                "각 resource 상한 중 최소를 골라",
                "사용할 SM 수에 걸쳐 배치",
              ],
            },
          ]}
          terms={[
            {
              symbol: "B_p",
              name: "Persistent blocks",
              description: "동시에 상주시킬 worker block 수입니다.",
            },
            {
              symbol: "b_R,b_S,b_{SM}",
              name: "Per-SM block limits",
              description:
                "Register, shared memory와 최종 minimum이 허용하는 SM당 worker block 상한입니다.",
            },
            {
              symbol: "N_{SM}",
              name: "Reserved SM count",
              description: "Persistent workload가 사용할 SM 수입니다.",
            },
            {
              symbol: "B_{hw}",
              name: "Hardware blocks per SM",
              description: "Architecture의 SM당 active block 상한입니다.",
            },
            {
              symbol: "R_{SM},R_b",
              name: "Register budgets",
              description:
                "SM 전체와 worker block 하나의 register 요구량입니다.",
            },
            {
              symbol: "S_{SM},S_b",
              name: "Shared-memory budgets",
              description:
                "SM 전체와 worker block 하나의 shared-memory 요구량입니다.",
            },
          ]}
          assumptions={[
            "Allocation granularity와 cluster·cooperative launch 조건은 별도 target receipt에서 확인합니다.",
            "최대 resident blocks를 모두 사용하는 것이 최적이라는 뜻이 아닙니다.",
          ]}
          interpretation="이 식은 배치 가능한 상한입니다. 실제 worker 수는 queue latency와 다른 GPU work의 progress를 함께 측정해 더 작게 선택할 수 있습니다."
        />
      </section>

      <section id="queue-progress" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · Queue progress
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            처리율보다 먼저 bounded queue와 backpressure를 설계한다
          </h2>
        </header>
        <p>
          Producer가 무한히 게시하고 worker가 따라가지 못하면 queue와 input
          buffers가 계속 증가합니다. Queue는 capacity를 고정하고 full일 때
          block, reject, fallback 중 하나를 선택해야 합니다. Variable-duration
          tasks라면 head-of-line blocking과 fairness도 workload contract에
          포함합니다.
        </p>
        <ExplainedFormula
          question="Queue가 장시간 계속 쌓이지 않으려면 어떤 처리율 관계가 필요할까요?"
          idea={
            <>
              Worker 하나의 평균 service rate에 실제로 일하는 worker 수를 곱해
              총 처리 capacity를 만들고 arrival rate보다 커야 한다는 안정 조건을
              확인합니다.
            </>
          }
          formula={String.raw`\lambda<C_{active}\mu`}
          annotatedFormula={String.raw`\underbrace{\lambda}_{\text{task 도착률}}<\underbrace{C_{active}}_{\text{실제 active workers}}\times\underbrace{\mu}_{\text{worker당 처리율}}`}
          operations={[
            {
              expression: String.raw`C_{active}\mu`,
              annotation: [
                "active worker 수와",
                "각 worker 처리율을 곱해 총 capacity 계산",
              ],
            },
            {
              expression: String.raw`\lambda<C_{active}\mu`,
              annotation: [
                "평균 도착률이",
                "평균 처리 capacity보다 낮은지 확인",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\lambda`,
              name: "Arrival rate",
              description: "Queue에 들어오는 평균 tasks per second입니다.",
            },
            {
              symbol: "C_{active}",
              name: "Active workers",
              description: "실제로 task를 처리하는 resident workers 수입니다.",
            },
            {
              symbol: String.raw`\mu`,
              name: "Per-worker service rate",
              description: "Worker 하나의 평균 tasks per second입니다.",
            },
          ]}
          assumptions={[
            "평균 조건은 burst·tail latency·task-size 분포를 보장하지 않습니다.",
            "Worker contention으로 μ가 worker 수에 따라 변할 수 있으므로 실측합니다.",
          ]}
          interpretation="λ가 capacity에 가까우면 작은 burst에도 queueing tail이 커집니다. Release gate에서는 평균뿐 아니라 queue depth p95·max와 reject/fallback 수를 기록합니다."
        />
      </section>

      <section id="work-assignment" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02b · Work assignment
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Static 배분은 마지막 wave 에서, dynamic 배분은 atomic 에서 비용을 냅니다
          </h2>
        </header>
        <p>
          Queue 에 있는 일을 worker 에 나누는 방법은 둘뿐입니다. 어느 block 이 어느 tile 을 맡을지 launch 전에 정해 두면 static work
          assignment 입니다. Block 이 tile 을 끝낼 때마다 공용 counter 를 atomic 으로 올려 다음 tile 번호를 받으면 dynamic work
          assignment 입니다.
        </p>
        <p>
          둘 다 host 가 아니라 device 의 block 이 다음 일을 고르므로
          device-side scheduling 입니다.
        </p>
        <p>
          Static 은 CUTLASS 의 persistent tile scheduler 가 쓰는 방식입니다.
          Grid 를 SM 수 g 로 고정하고 block b 가 tile b, b+g, b+2g 를 차례로
          맡습니다. Queue 를 읽는 비용이 덧셈 하나라 0 에 가깝지만, tile 수가
          g 의 배수가 아니면 마지막 wave 가 비고 tile 시간이 고르지 않으면
          누군가는 늦게 끝납니다. 그 loop 는{" "}
          <Link
            className="text-primary hover:underline"
            to="/gpu/cutlass-collectives-and-tile-schedulers#tile-scheduler"
          >
            persistent tile scheduler
          </Link>{" "}
          글이 소유합니다.
        </p>
        <p>
          숫자로 보면 SM 132개에 tile 1,000개를 static 으로 나누면 1,000/132
          = 7.58 이라 block 76개는 tile 8개, 56개는 7개를 맡습니다. 모든 tile 이
          같은 시간 t 라면 kernel 은 8t 에 끝나고 이상값 7.58t 대비 5.5% 가
          마지막 wave 의 불균형입니다. Tile 시간이 t 와 2t 사이에서 흔들리면
          가장 늦은 block 은 12t 근처까지 밀려 불균형이 30% 를 넘습니다.
        </p>
        <p>
          Dynamic 은 그 불균형을 atomic 하나로 바꿉니다. Block 은 tile 을 끝낼 때마다 atomicAdd(&next, 1) 로 다음 번호를 받습니다. 빨리 끝난
          block 이 더 많이 맡으므로 마지막에는 모든 block 이 한 tile 안쪽 차이로 끝납니다. 비용은 tile 1,000개에 atomic 1,000번입니다. 같은 주소를 향한
          atomic 은 L2 에서 직렬화되므로 block 132개가 동시에 부딪히면 그 줄의 길이만큼 기다립니다.
        </p>
        <p>
          그 비용의 크기는 이렇게 셉니다. Global atomic 한 번의 왕복을 가정값 1 µs 로 두면 tile 하나에 1 µs 가 붙습니다. Tile 시간이 50 µs 면 2%
          입니다. Tile 이 5 µs 면 같은 1 µs 가 20% 가 되어 static 의 5.5% 보다 나쁩니다. Gupta 등이 관찰한 atomic 압력의 slowdown 이 이
          경우이며, 처방은 tile 을 키우거나 atomic 한 번에 tile 여러 개(chunk)를 받는 것입니다.
        </p>
        <p>
          Work stealing 은 contention 을 queue 하나에서 여러 queue 로 나눕니다. Block 마다(또는 SM 마다) 자기 queue 를 두고 평소에는 자기
          queue 에서만 꺼냅니다. 자기 queue 가 비면 다른 block 의 queue 꼬리에서 훔쳐 옵니다. 평상시 atomic 은 자기 queue 에만 가서 contention 이
          없고 훔치는 atomic 은 kernel 끝 무렵에만 몰립니다.
        </p>
        <p>
          훔치기의 비용은 victim 을 고르는 일과 victim queue 의 head·tail 을 두 쪽이 동시에 만지는 race 입니다. Tail 은 주인이, head 는 도둑이
          만지게 하고 마지막 한 항목에서만 compare-and-swap 으로 겨루게 하면 대부분의 꺼내기가 atomic 없이 끝납니다. Queue 가 132개면 한 queue 당
          contention 은 평균 1/132 로 줄지만 빈 queue 를 도는 도둑의 polling 은 남습니다.
        </p>
        <p>
          Load balancing 은 이 셋을 고르는 기준입니다. 측정값은 가장 늦게 끝난 block 의 시간을 block 평균 시간으로 나눈 비율입니다. 1 에 가까울수록 고릅니다.
          Tile 시간이 고르고 수가 많으면 static, 고르지 않고 크면 dynamic counter, 고르지 않고 작으면 work stealing 이 그 비율을 가장 낮추며, 이
          판단은 tile 시간의 분포를 먼저 재야 할 수 있습니다.
        </p>
        <AlgorithmBlock
          title="Device-side work assignment: static·dynamic·stealing 의 한 loop"
          input={[
            "T: tile(work item) 수, g: resident block 수(= grid), b: 이 block 의 번호",
            "next: global atomic counter (dynamic), queue[b]: block 별 deque (stealing)",
            "run(tile): tile 하나의 계산 (시간이 고르지 않을 수 있음)",
          ]}
          steps={[
            { code: "static:   for (tile = b; tile < T; tile += g) run(tile)", note: "Queue 읽기가 덧셈 하나라 비용 0. 마지막 wave 의 빈 자리와 tile 시간 편차가 그대로 kernel 끝 시각이 됩니다." },
            { code: "dynamic:  while ((tile = atomicAdd(&next, 1)) < T) run(tile)", note: "빨리 끝난 block 이 더 많이 맡아 불균형이 tile 하나 안쪽으로 줍니다. Tile 당 atomic 왕복 한 번이 비용입니다." },
            { code: "dynamic (chunk): while ((base = atomicAdd(&next, k)) < T) for (i < k) run(base+i)", note: "Atomic 한 번에 tile k 개를 받아 atomic 비용을 1/k 로 줄이되 불균형은 최대 k tile 로 늘어납니다." },
            { code: "stealing: while ((tile = pop_tail(queue[b])) != EMPTY) run(tile)", note: "자기 queue 는 주인만 tail 을 만지므로 대부분 atomic 없이 꺼냅니다." },
            { code: "stealing: victim = pick(); tile = steal_head(queue[victim]); if (tile != EMPTY) run(tile) else retry/exit", note: "훔치기는 victim queue 의 head 에서 CAS 로 겨루며, 모든 queue 가 비었음을 확인해야 종료합니다." },
          ]}
          repeatUntil="자기 몫(static)·counter(dynamic)·모든 queue(stealing)가 빌 때까지 반복합니다."
          output="모든 tile 이 정확히 한 번 실행되고, 가장 늦은 block 의 종료 시각이 load balance 의 측정값이 됩니다"
        />
        <div id="paper-cutlass-persistent-scheduler">
          <CitationBlock
            type="code"
            citeKey={3}
            source="NVIDIA CUTLASS · Efficient GEMM in CUDA (media/docs/cpp/efficient_gemm.md) · Persistent kernels, Tile Scheduler"
            href={CUTLASS_EFFICIENT_GEMM}
          >
            <p>
              <strong>문제:</strong> Output tile 마다 thread block 을 새로
              띄우면 block launch 와 kernel prologue 비용이 tile 수만큼
              반복됩니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> SM 수만큼의 persistent thread
              block 을 띄우고 Tile Scheduler 가 cluster 모양과 SM 수를 보고
              output tile 을 block 에 static 으로 배분하며, ping-pong 변형은
              consumer warp group 둘이 다른 tile 을 맡아 epilogue 와 mainloop
              을 겹칩니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Tile 시간이 고른 dense GEMM 이며
              KernelHardwareInfo 로 SM 수를 알고 있습니다.
            </p>
            <p>
              <strong>근거 범위:</strong> CUTLASS 3.x 의 공식 설계 문서이며
              static 배분의 정본 구현입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Tile 시간이 고르지 않은 irregular
              workload 에서 같은 static 배분이 load balance 를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="shutdown" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Shutdown and failure
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Sentinel 하나가 아니라 입력 닫기→drain→전 worker 종료를 증명한다
          </h2>
        </header>
        <p>
          종료는 새 publish를 막고 이미 ticket을 가진 in-flight tasks를 완료하거나 명시적으로 취소하고, queue가 비었음을 확인한 뒤 모든 workers가
          exit하는 순서입니다. Sentinel 하나를 worker 하나만 소비하면 나머지가 polling을 계속할 수 있습니다. Device-side error와 host
          cancellation도 completion state로 전달해야 silent hang을 피합니다.
        </p>
        <div id="paper-persistent-threads">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="A Study of Persistent Threads Style GPU Programming for GPGPU Workloads"
            href={PERSISTENT_THREADS}
          >
            <p>
              <strong>문제:</strong> 반복 launch와 long-lived GPU workers의
              workload별 trade-off를 비교해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Persistent Threads style과 work
              distribution use cases를 분류합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 2012년 GPU·runtime과 평가 workload에
              실험 결과를 귀속합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Persistent worker execution model의
              역사적 primary evidence입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 현대 GPU·LLM에서 동일 speedup이나
              resource partition을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Persistent release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Launch 절감과 새 progress 위험을 함께 검증한다
          </h2>
        </header>
        <p>
          Baseline multi-launch와 persistent candidate를 같은 task stream에서
          비교합니다. Output parity, task ordering·duplicate·loss, end-to-end
          median·p95는 정답이 바뀌지 않았는지와 실제로 빨라졌는지를 함께 봅니다.
        </p>
        <p>
          Queue depth, worker utilization, 다른 streams의 progress와 clean
          shutdown도 모두 통과해야 합니다. Queue overflow·device error·host
          cancel fixture에서 bounded fallback과 rollback도 확인합니다.
        </p>
        <div id="paper-cuda-cooperative-progress">
          <CitationBlock
            type="code"
            citeKey={2}
            source="NVIDIA CUDA C++ Programming Guide 12.8.1"
            href={PROGRAMMING}
          >
            <p>
              <strong>문제:</strong> Grid·block residency, synchronization과
              memory visibility의 CUDA 경계를 지켜야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Execution hierarchy·atomics·memory
              ordering·cooperative groups semantics를 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> CUDA 12.8.1과 target compute
              capability·launch mode를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Persistent protocol을 구현할 때
              사용하는 CUDA primitive semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 특정 queue algorithm의
              liveness·fairness나 speedup을 자동으로 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
        <p>
          Stage를 한 kernel 안에서 합치는 문제와 비교하려면
          <a
            className="ml-1 text-primary hover:underline"
            href="/gpu/cuda-kernel-fusion"
          >
            kernel fusion과 Megakernel
          </a>
          을 먼저 읽습니다.
        </p>
      </section>
    </article>
  );
}
