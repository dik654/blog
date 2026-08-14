import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import PersistentQueueViz from "./viz/PersistentQueueViz";

const PERSISTENT_THREADS = "https://doi.org/10.1109/InPar.2012.6339596";
const PROGRAMMING =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";

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
          일반 실행은 host가 kernel을 launch하고 grid가 일을 끝내면 종료합니다.
          Persistent kernel은 일부 worker blocks를 GPU에 계속 resident하게 두고,
          host나 device producer가 게시한 task를 queue에서 꺼내 반복 처리합니다.
          Kernel의 수명과 각 task의 수명이 분리되는 실행 모델입니다.
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
          Persistent blocks는 queue가 비어도 resident resource를 보유할 수
          있습니다. Block당 registers·shared memory와 worker block 수를 함께
          제한해 다른 kernels, communication work와 runtime progress에 공간을
          남겨야 합니다. 모든 SM을 점유하면 낮은 queue latency를 얻는 대신 다른
          stream과 collective를 굶길 수 있습니다.
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
          종료는 새 publish를 막고, 이미 ticket을 가진 in-flight tasks를
          완료하거나 명시적으로 취소하고, queue가 비었음을 확인한 뒤 모든
          workers가 exit하는 순서입니다. Sentinel 하나를 worker 하나만 소비하면
          나머지가 polling을 계속할 수 있습니다. Device-side error와 host
          cancellation도 completion state로 전달해야 silent hang을 피할 수
          있습니다.
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
          median·p95, queue depth, worker utilization, 다른 streams의 progress와
          clean shutdown을 모두 통과해야 합니다. Queue overflow·device
          error·host cancel fixture에서 bounded fallback과 rollback도
          확인합니다.
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
