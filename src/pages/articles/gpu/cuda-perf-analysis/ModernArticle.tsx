import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MetricBoundaryViz, PerfLoopViz } from "./viz/ModernPerfViz";

const PRACTICES =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const NSYS =
  "https://docs.nvidia.com/nsight-systems/2025.1/UserGuide/index.html";
const NCU =
  "https://docs.nvidia.com/nsight-compute/2025.1/NsightCompute/index.html";

export default function ModernCudaPerfAnalysisArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            CUDA measurement first
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            “GPU가 느리다”를 시간 경계와 병목 가설로 바꾼다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          성능 분석의 첫 질문은 어떤 최적화 기법을 쓸지가 아닙니다. 사용자가
          기다린 전체 시간, host가 일을 제출한 시간, GPU가 실제로 계산한 시간을
          먼저 분리해야 합니다. 그래야 3 μs짜리 launch 병목과 100 ms짜리 GEMM
          병목을 같은 문제로 다루지 않습니다.
        </p>
        <TermBreakdown
          title="먼저 시간 경계 세 개만 구분합니다"
          description="이 세 경계를 고정한 뒤에만 profiler counter와 최적화 후보를 연결합니다."
          items={[
            {
              term: "End-to-end latency",
              description:
                "입력 준비부터 사용 가능한 출력까지 사용자가 기다린 전체 critical path입니다.",
              example:
                "H2D copy, kernel, D2H copy와 필요한 synchronization을 포함합니다.",
              boundary:
                "Kernel 하나의 시간이 줄어도 전체 경로의 다른 구간이 지배하면 거의 변하지 않습니다.",
            },
            {
              term: "Launch submission",
              description:
                "CPU가 kernel과 인자를 GPU queue에 제출하고 control을 돌려받기까지의 구간입니다.",
              example:
                "비동기 launch는 GPU 계산이 끝나기 전에 반환할 수 있습니다.",
              boundary:
                "CPU timer로 launch call만 감싼 값은 kernel completion 시간이 아닙니다.",
            },
            {
              term: "Kernel elapsed time",
              description:
                "같은 CUDA stream에 기록한 start·stop event 사이에서 GPU가 보낸 시간입니다.",
              example:
                "Warm-up 뒤 동일 input과 shape를 반복해 median·p95를 보존합니다.",
              boundary:
                "Copy와 host 준비 시간이 제외될 수 있으므로 end-to-end와 따로 기록합니다.",
            },
          ]}
        />
        <PerfLoopViz />
        <ContentBoundary article="cuda-perf-analysis" />
      </section>

      <section id="measurement-protocol" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Measurement protocol
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Warm-up과 completion 지점을 먼저 고정한다
          </h2>
        </header>
        <p>
          첫 iteration에는 CUDA context 생성, module load, allocator와 cache
          cold state가 섞일 수 있습니다. 별도 warm-up 뒤 같은 stream에 start
          event, kernel, stop event를 순서대로 기록하고 stop event가 완료될
          때까지 기다립니다. End-to-end 실험은 입력 준비부터 소비 가능한
          출력까지 별도 wall-clock 경계로 잽니다.
        </p>
        <MetricBoundaryViz />
        <p>
          비교 receipt에는 GPU·driver·Toolkit·compiler flags, clock와 power
          mode, input shape·dtype, concurrent workload, warm-up·repeat 수를
          남깁니다. 평균 하나 대신 median과 p95 또는 원본 분포를 보존해야 간헐적
          queue·thermal 변화를 숨기지 않습니다.
        </p>
        <div id="paper-cuda-performance-guide">
          <CitationBlock
            type="code"
            citeKey={1}
            source="NVIDIA CUDA C++ Best Practices Guide 12.8.1"
            href={PRACTICES}
          >
            <p>
              <strong>문제:</strong> 비동기 CUDA 실행의 timing·bandwidth·scaling
              경계를 재현 가능하게 고정해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> APOD, CPU/GPU timer, effective
              bandwidth와 reference comparison 절차를 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> CUDA 12.8.1과 동일
              target·workload·precision·measurement region을 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> NVIDIA가 문서화한 performance
              measurement semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 예제의 speedup이나 bandwidth를 다른
              GPU·shape의 결과로 옮길 수 없습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="throughput-ledger" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · Budget and achieved ledger
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            전체 비중과 실제 사용량을 차례로 계산한다
          </h2>
        </header>
        <p>
          먼저 Amdahl&apos;s law로 고칠 구간의 end-to-end 비중을 봅니다. 그다음
          hot kernel 안에서 useful FLOPs와 실제 bytes를 같은 elapsed time으로
          나눠 achieved compute·bandwidth를 만듭니다. Peak spec은 상한이고
          achieved 값은 관측값입니다.
        </p>
        <ExplainedFormula
          question="전체 시간의 p만 r배 빨라질 때 전체 speedup은 왜 제한될까요?"
          idea={
            <>
              개선하지 못한 시간과 개선한 시간을 먼저 더해 새 전체 시간을
              만들고, baseline 시간 1을 그 값으로 나눕니다.
            </>
          }
          formula={String.raw`S=\frac{1}{(1-p)+p/r}`}
          annotatedFormula={String.raw`S=\frac{\overbrace{1}^{\text{baseline 전체 시간}}}{\underbrace{(1-p)}_{\text{그대로 남는 시간}}+\underbrace{p/r}_{\text{r배 빨라진 시간}}}`}
          operations={[
            {
              expression: String.raw`1-p`,
              annotation: ["최적화하지 못한 구간은", "시간이 그대로 남습니다"],
            },
            {
              expression: String.raw`p/r`,
              annotation: ["대상 구간 p를", "구간 speedup r로 줄입니다"],
            },
            {
              expression: String.raw`1/((1-p)+p/r)`,
              annotation: ["기존 전체 시간 1을", "새 전체 시간으로 나눕니다"],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "개선 대상 비율",
              description:
                "Baseline 전체 elapsed time에서 실제로 빨라지는 구간의 비율입니다.",
            },
            {
              symbol: "r",
              name: "구간 speedup",
              description:
                "선택한 구간만 baseline보다 몇 배 빨라지는지 나타냅니다.",
            },
            {
              symbol: "S",
              name: "전체 speedup",
              description:
                "Baseline end-to-end time을 candidate end-to-end time으로 나눈 값입니다.",
            },
          ]}
          assumptions={[
            "같은 workload 크기와 correctness를 비교합니다.",
            "최적화가 다른 구간의 overlap·contention을 바꾸지 않는 단순 분해입니다.",
          ]}
          interpretation="p=0.2, r=10이면 새 시간은 0.82이고 전체 speedup은 약 1.22×입니다. 100 ms 중 5 μs만 줄이면 전체 개선은 0.005%입니다."
        />
        <ExplainedFormula
          question="Kernel이 memory roof와 compute roof 중 어디에 먼저 닿을까요?"
          idea={
            <>
              Useful work를 실제 traffic으로 나눈 arithmetic intensity에 memory
              bandwidth를 곱한 상한과 compute ceiling 중 작은 쪽을 고릅니다.
            </>
          }
          formula={String.raw`\begin{aligned}I&=F/Q\\P&\le\min(P_{compute},I B_{memory})\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}I&=\underbrace{F}_{\text{useful FLOPs}}/\underbrace{Q}_{\text{실제 bytes}}\\[3pt]P&\le\min\!\left(\underbrace{P_{compute}}_{\text{계산 상한}},\underbrace{I B_{memory}}_{\text{traffic 상한}}\right)\end{aligned}`}
          operations={[
            {
              expression: String.raw`F/Q`,
              annotation: ["실제 byte 하나가", "몇 FLOPs를 운반하는지 계산"],
            },
            {
              expression: String.raw`I B_{memory}`,
              annotation: [
                "그 intensity에서 bandwidth가",
                "허용하는 FLOP/s 상한 계산",
              ],
            },
            {
              expression: String.raw`\min(P_{compute},I B_{memory})`,
              annotation: ["compute와 memory 중", "먼저 닿는 roof를 선택"],
            },
          ]}
          terms={[
            {
              symbol: "F",
              name: "Useful FLOPs",
              description: "명시한 counting convention의 유효 연산량입니다.",
            },
            {
              symbol: "Q",
              name: "Observed bytes",
              description:
                "같은 경계에서 profiler로 관찰하거나 정의한 traffic입니다.",
            },
            {
              symbol: "I",
              name: "Arithmetic intensity",
              description: "Memory byte 하나당 useful FLOPs입니다.",
            },
            {
              symbol: "P",
              name: "Achieved performance",
              description: "같은 elapsed time으로 계산한 FLOP/s입니다.",
            },
            {
              symbol: "P_{compute}",
              name: "Compute roof",
              description: "해당 precision·instruction path의 계산 상한입니다.",
            },
            {
              symbol: "B_{memory}",
              name: "Memory roof",
              description:
                "같은 memory level·clock 조건의 bandwidth 상한입니다.",
            },
          ]}
          assumptions={[
            "Precision·sparsity·instruction path가 같은 roof를 사용합니다.",
            "FLOPs, bytes와 elapsed time의 측정 경계가 같습니다.",
          ]}
          interpretation="Roofline은 첫 가설을 고르는 지도입니다. 점이 roof 아래라고 해서 uncoalesced access, dependency, 부족한 ready warp 중 무엇이 원인인지는 아직 결정되지 않습니다."
        />
      </section>

      <section id="profiling" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Hypothesis loop
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Timeline에서 좁히고 counter 하나로 가설을 반증한다
          </h2>
        </header>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>
            <strong>1. Timeline:</strong> Nsight Systems에서
            copy·launch·kernel·sync 중 critical path를 찾습니다.
          </li>
          <li>
            <strong>2. Bound:</strong> Amdahl과 achieved ledger로 고칠 가치와
            memory/compute 가설을 세웁니다.
          </li>
          <li>
            <strong>3. Counter:</strong> Nsight Compute에서 traffic, eligible
            warps, dependency·barrier stall처럼 가설을 가르는 최소 metric을
            봅니다.
          </li>
          <li>
            <strong>4. One change:</strong> Layout, tile, fusion boundary 중
            하나만 바꾸고 다시 잽니다.
          </li>
        </ol>
        <p>
          Counter 수집은 kernel replay와 overhead를 만들 수 있습니다. 따라서
          profiler가 없는 반복에서 최종 latency를 다시 측정하고, counter의 이동
          방향과 실제 elapsed 개선이 함께 나타나는지 확인합니다.
        </p>
        <div id="paper-nsight-systems">
          <CitationBlock
            type="code"
            citeKey={2}
            source="NVIDIA Nsight Systems 2025.1 User Guide"
            href={NSYS}
          >
            <p>
              <strong>문제:</strong> Host API·copy·GPU work·synchronization이
              얽힌 critical path를 찾아야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> System-wide timeline과 CUDA
              trace로 제출과 실행의 간격을 연결합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Nsight Systems 2025.1과 capture
              option·duration을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 release의 trace
              collection·analysis semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Timeline correlation만으로 kernel
              내부 stall 원인을 증명하지 않습니다.
            </p>
          </CitationBlock>
        </div>
        <div id="paper-nsight-compute">
          <CitationBlock
            type="code"
            citeKey={3}
            source="NVIDIA Nsight Compute 2025.1 User Guide"
            href={NCU}
          >
            <p>
              <strong>문제:</strong> 개별 kernel의 launch·memory·scheduler
              metric을 가설에 맞춰 수집해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Section·replay·comparison
              workflow를 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 지원 GPU·driver와 metric
              availability를 확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Nsight Compute 2025.1의 profiler
              semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Stall metric 하나가 원인을
              증명하거나 occupancy 최대화가 성능을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            빠른 숫자 하나가 아니라 재현 가능한 ablation receipt를 남긴다
          </h2>
        </header>
        <p>
          Candidate는 reference parity와 tolerance를 먼저 통과해야 합니다.
          그다음 같은 workload slices에서 end-to-end median·p95, kernel elapsed,
          achieved FLOP/s·GB/s와 예상 counter 방향을 paired 비교합니다. 한
          GPU·shape의 승리는 그 fixture에만 귀속하고 rollback 기준을 함께
          기록합니다.
        </p>
        <p>
          Register·spill을 더 깊게 읽으려면{" "}
          <a
            className="text-primary hover:underline"
            href="/gpu/cuda-register-pressure"
          >
            register pressure
          </a>
          , stage를 합치는 판단은{" "}
          <a
            className="text-primary hover:underline"
            href="/gpu/cuda-kernel-fusion"
          >
            kernel fusion과 Megakernel
          </a>
          , long-lived worker는{" "}
          <a
            className="text-primary hover:underline"
            href="/gpu/cuda-persistent-kernels"
          >
            persistent kernel
          </a>
          에서 이어집니다.
        </p>
      </section>
    </article>
  );
}
