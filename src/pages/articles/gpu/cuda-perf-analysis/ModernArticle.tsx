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
          첫 iteration에는 CUDA context 생성, module load, allocator와 cache cold state가 섞이기도 합니다. 별도 warm-up 뒤 같은
          stream에 start event, kernel, stop event를 순서대로 기록하고 stop event가 완료될 때까지 기다립니다. End-to-end 실험은 입력 준비부터
          소비 가능한 출력까지 별도 wall-clock 경계로 잽니다.
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
        <div id="throughput-vs-peak" className="space-y-6 pt-4">
          <h3 className="text-xl font-bold">
            Profiler 의 throughput 퍼센트는 roofline 의 peak 를 분모로 둔 값입니다
          </h3>
          <p>
            Nsight Compute 가 보여 주는 DRAM throughput 90% 나 L2 throughput 40% 같은 숫자는 모두 같은 꼴입니다. 그 unit 이 실제로 낸
            속도를 그 unit 의 theoretical peak 로 나눈 비율입니다. Peak 는 roofline 의 지붕을 만드는 바로 그 값입니다. 달성률이 100% 에 가까운
            unit 이 kernel 을 붙잡고 있는 자원입니다.
          </p>
          <p>
            Theoretical peak 는 spec 의 clock 과 폭에서 계산한 상한입니다. Best Practices
            Guide 는 V100 의 memory clock 877 MHz, bus 4096 bit, DDR 의 2 를 곱해 898 GB/s
            를 얻는 계산을 보여 줍니다. Profiler 는 이 상한을 sustained rate 로 두고
            achieved 를 그 위에 얹습니다.
          </p>
          <p>
            둘 사이의 거리가 utilization gap 입니다. Peak 3.35 TB/s 인 HBM 에서 achieved 1.0 TB/s 면 throughput 은 30% 이고 gap
            은 70% 입니다. Gap 이 큰 unit 은 병목이 아닙니다. 모든 unit 의 gap 이 크면 kernel 은 어느 자원에도 닿지 못한 latency bound 입니다.
          </p>
          <p>
            Memory throughput 은 한 숫자가 아닙니다. Profiler 는 DRAM, L2, L1/TEX, shared memory 각각을 자기 peak 로 나눕니다.
            Compute 쪽은 FMA·ALU·Tensor 같은 pipe 마다 나눕니다. Speed Of Light 의 Memory 값은 그 가운데 가장 높은 하나이고 Compute 값도
            같은 방식이므로 breakdown 을 열어 어느 unit 인지 확인해야 합니다.
          </p>
          <p>
            같은 metric 에 두 분모가 있습니다. Active 기준은 그 unit 이 일한 clock 만 세고 elapsed 기준은 kernel 전체 clock 을 셉니다.
            Active 90% 에 elapsed 45% 면 unit 은 일할 때는 꽉 찼어도 kernel 의 절반 동안 놀았습니다. 이 차이는 tail 이나 launch 간격에서 옵니다.
          </p>
          <p>
            Cache hit rate 는 throughput 과 다른 종류의 숫자입니다. L1 과 L2 의 hit rate 는 요청된 sector 가운데 miss 하지 않은 비율입니다.
            Miss 한 sector 만 다음 계층으로 내려가 그 계층의 throughput 을 만듭니다. L2 hit rate 20% 라면 L2 에 온 byte 의 80% 가 DRAM
            까지 내려갑니다.
          </p>
          <TermBreakdown
            title="Throughput 계열 metric 과 각각의 peak"
            description="이름은 unit 을 말하고 분모는 그 unit 의 theoretical peak 입니다. 100% 에 가까운 unit 이 병목 후보입니다."
            items={[
              {
                term: "DRAM throughput",
                description: "HBM 을 지난 byte 를 시간과 peak bandwidth 로 나눈 비율입니다.",
                example: "H100 SXM5 peak 3.35 TB/s 에서 3.0 TB/s 면 90% 입니다.",
                boundary: "90% 이상이면 byte 를 줄이는 처방만 남고 warp 를 늘려도 빨라지지 않습니다.",
              },
              {
                term: "L2 throughput · L2 hit rate",
                description: "L2 가 처리한 sector 의 peak 대비 비율과, L2 요청 중 miss 하지 않은 비율입니다.",
                example: "L2 hit 20% 면 L2 에 온 byte 의 80% 가 DRAM 요청이 됩니다.",
                boundary: "Hit rate 가 높아도 L2 throughput 이 peak 에 닿으면 L2 자체가 병목입니다.",
              },
              {
                term: "L1/TEX hit rate · L1 throughput",
                description: "L1 에 요청된 sector 중 miss 하지 않은 비율과 L1 pipe 의 peak 대비 비율입니다.",
                example: "Uncoalesced 접근은 요청당 sector 를 늘려 hit 가 높아도 throughput 을 채웁니다.",
                boundary: "Shared memory 와 L1 이 용량을 나누므로 hit rate 는 carveout 설정에 따라 달라집니다.",
              },
              {
                term: "Shared memory throughput",
                description: "Shared memory bank 가 처리한 요청의 peak 대비 비율입니다.",
                example: "Bank conflict 로 한 warp 요청이 4 wavefront 로 나뉘면 같은 일에 4배의 throughput 을 씁니다.",
                boundary: "Wavefront 수가 늘어 100% 에 닿는 것은 유효 byte 가 늘어난 것이 아닙니다.",
              },
              {
                term: "Tensor Core throughput",
                description: "Tensor pipe 가 일한 clock 의 peak 대비 비율입니다.",
                example: "GEMM 에서 80% 면 compute-bound 에 가깝고 0% 면 Tensor 경로를 쓰지 않은 것입니다.",
                boundary: "Precision 마다 peak 가 다르므로 FP8 peak 로 FP16 kernel 을 나누면 안 됩니다.",
              },
            ]}
          />
          <div id="paper-nsight-compute-profiling-guide">
            <CitationBlock
              type="code"
              citeKey={4}
              source="NVIDIA Nsight Compute Profiling Guide · GPU Speed Of Light, Memory Workload Analysis, Metrics Reference"
              href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html"
            >
              <p>
                <strong>문제:</strong> Kernel 이 어느 unit 의 peak 에 얼마나 가까운지를 한
                눈에 보고 세부 unit 으로 내려가야 합니다.
              </p>
              <p>
                <strong>핵심 아이디어:</strong> Throughput metric 은 achieved / peak
                sustained rate 의 백분율이며 active·elapsed 두 분모를 두고, Speed Of Light
                은 sub-metric 의 최대값을 보여 줍니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Hit rate 는 sector 기준 hits / (hits + misses)
                이며 tag hit rate 와 다릅니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Profiling Guide 의 metric 정의이며 특정 kernel
                의 측정치가 아닙니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 어느 unit 이 90% 라는 사실만으로 그 unit 을
                줄이면 elapsed 가 준다고 단정할 수 없습니다.
              </p>
            </CitationBlock>
          </div>
        </div>
        <div id="counter-correlation" className="space-y-6 pt-4">
          <h3 className="text-xl font-bold">
            Counter 하나가 아니라 두 counter 의 상관이 병목 가설을 만듭니다
          </h3>
          <p>
            DRAM throughput 90% 는 혼자서는 memory-bound 라는 사실만 말합니다. 그 옆에 L2 hit rate 20% 를 놓으면 가설이 하나로 좁혀집니다. L2
            에 온 byte 의 80% 가 DRAM 까지 내려가고 있으니 같은 data 를 여러 block 이 다시 읽는데도 L2 에 남아 있지 않습니다. 처방은 재사용을 tile 안으로
            끌어오는 것입니다.
          </p>
          <p>
            같은 DRAM 90% 에 L2 hit rate 85% 면 이야기가 다릅니다. L2 는 잘 맞는데도 DRAM
            이 차 있다면 처음 읽는 byte 자체가 많은 것이므로 재사용이 아니라 요청량, 즉
            precision 을 낮추거나 읽는 범위를 줄이는 처방으로 갑니다.
          </p>
          <p>
            DRAM 20% 에 long scoreboard stall 이 지배적이면 세 번째 경우입니다. Memory 는
            비어 있는데 warp 가 memory 를 기다린다면 bandwidth 가 아니라 latency 를 숨기지
            못한 것이고, 처방은 warp 당 outstanding 요청을 늘리는 쪽입니다. Stall 을 읽는
            순서는{" "}
            <a
              className="text-primary hover:underline"
              href="/gpu/warp-stall-reasons-and-issue-utilization#reading-procedure"
            >
              warp stall reason 글
            </a>
            이 소유합니다.
          </p>
          <p>
            상관은 원인의 증명이 아닙니다. 두 counter 가 같은 방향으로 움직였다는 사실은 가설을 하나로 좁힐 뿐입니다. 그 가설이 맞는지는 변경 하나 뒤에 elapsed 와 두
            counter 가 예상한 방향으로 함께 움직이는지로만 확인됩니다.
          </p>
          <ExplainedFormula
            question="L2 hit rate 가 DRAM throughput 을 어떻게 결정하나요?"
            idea="L2 에서 miss 한 sector 만 DRAM 요청이 되므로 DRAM 이 옮긴 byte 는 L2 에 요청된 byte 에 miss 비율을 곱한 값이고, 그것을 elapsed 와 peak bandwidth 로 나누면 profiler 의 DRAM throughput 퍼센트가 됩니다."
            formula={String.raw`\begin{aligned}
Q_{\mathrm{DRAM}} &\approx (1-h_{L2})\,Q_{L2} \\
T_{\mathrm{DRAM}} &= \frac{Q_{\mathrm{DRAM}}}{t\,B_{\mathrm{peak}}}
\end{aligned}`}
            annotatedFormula={String.raw`\begin{aligned}
Q_{\mathrm{DRAM}} &\approx \underbrace{(1-h_{L2})}_{\text{L2 miss 비율}}\,\underbrace{Q_{L2}}_{\text{L2 에 요청된 byte}} \\
T_{\mathrm{DRAM}} &= \underbrace{\frac{Q_{\mathrm{DRAM}}}{t\,B_{\mathrm{peak}}}}_{\text{achieved 를 peak 로 나눈 비율}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`(1-h_{L2})\,Q_{L2}`,
                annotation: ["L2 요청 byte 에 miss 비율을 곱해", "DRAM 까지 내려간 byte 를 구함"],
              },
              {
                expression: String.raw`\frac{Q_{\mathrm{DRAM}}}{t\,B_{\mathrm{peak}}}`,
                annotation: ["그 byte 를 elapsed 와 peak bandwidth 로 나눠", "DRAM throughput 퍼센트를 얻음"],
              },
            ]}
            terms={[
              { symbol: String.raw`h_{L2}`, name: "L2 hit rate", description: "L2 에 요청된 sector 가운데 miss 하지 않은 비율입니다." },
              { symbol: String.raw`Q_{L2}`, name: "L2 요청 byte", description: "L1 에서 miss 해 L2 로 내려온 sector 의 총 byte 입니다." },
              { symbol: String.raw`Q_{\mathrm{DRAM}}`, name: "DRAM 이동 byte", description: "HBM 을 실제로 지난 byte 로 profiler 의 dram bytes 가 이 값입니다." },
              { symbol: String.raw`t`, name: "Kernel elapsed", description: "같은 측정 경계의 kernel 실행 시간입니다." },
              { symbol: String.raw`B_{\mathrm{peak}}`, name: "DRAM peak bandwidth", description: "Roofline 의 memory roof 를 만드는 theoretical peak 입니다." },
              { symbol: String.raw`T_{\mathrm{DRAM}}`, name: "DRAM throughput", description: "Nsight Compute 가 백분율로 보여 주는 값입니다." },
            ]}
            assumptions={[
              "L2 miss 가 모두 DRAM 요청이 되는 단순화이며 L2 write-back 과 compression 은 무시합니다.",
              "Elapsed 기준 분모를 씁니다. Active 기준이면 t 가 DRAM unit 이 일한 clock 으로 바뀝니다.",
            ]}
            interpretation="Q_L2 가 100 GB, h_L2 가 0.2, t 가 0.03 s, B_peak 가 3.35 TB/s 면 DRAM byte 는 80 GB 이고 throughput 은 약 80% 입니다. 재사용으로 h_L2 를 0.8 로 올리면 같은 Q_L2 에서 DRAM byte 는 20 GB 로 줄어 memory roof 에서 멀어집니다."
          />
        </div>
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
        <div id="profiler-roles" className="space-y-6">
          <h3 className="text-xl font-bold">
            Nsight Systems 는 어디가 느린지를, Nsight Compute 는 왜 느린지를 봅니다
          </h3>
          <p>
            GPU profiling 은 도구 하나로 끝나지 않습니다. Nsight Systems 는 CPU thread, CUDA API 호출, GPU 의 kernel 과 copy 를
            하나의 시간축에 놓는 system 수준 도구입니다. Nsight Compute 는 kernel 하나를 골라 그 안의 hardware counter 를 읽는 kernel 수준
            도구입니다. 앞의 것이 어디를 볼지 정하고 뒤의 것이 이유를 말합니다.
          </p>
          <p>
            Nsight Systems 의 CUDA trace 는 두 줄로 나뉩니다. API trace 는 host 가 부른 cudaLaunchKernel 이나 cudaMemcpy 같은
            호출의 시작과 반환을 적습니다. Workload trace 는 GPU 에서 실제로 돈 kernel 과 memory 작업을 stream 별 row 에 적습니다. 이 두 줄을 잇는
            것이 kernel timeline 입니다.
          </p>
          <p>
            Kernel timeline 에서 읽는 것은 간격입니다. Launch 호출이 반환된 시각과 kernel 이 실제로 시작한 시각의 차이는 queue 대기입니다. Kernel
            사이의 빈 구간은 host 가 다음 일을 늦게 제출했거나 synchronization 에 막힌 시간입니다. 3 μs 짜리 kernel 1000개 사이에 5 μs 씩 비어 있으면
            GPU 시간의 절반 이상이 kernel 밖에 있습니다.
          </p>
          <p>
            Nsight Compute 는 그 timeline 에서 고른 kernel 하나를 replay 하며 counter 를 모읍니다. Kernel 을 여러 번 다시 돌려 pass 마다
            다른 counter 를 읽으므로 그 아래의 elapsed 는 실제와 다릅니다. 대신 DRAM byte, cache hit, warp stall 처럼 timeline 에는 없는
            숫자를 줍니다.
          </p>
          <p>
            역할을 바꾸면 틀린 결론이 나옵니다. Timeline 의 상관만으로는 kernel 안의 stall 원인을 말할 수 없습니다. 거꾸로 kernel 하나의 counter 만으로는
            전체 시간의 어디가 비었는지 말할 수 없습니다. 그래서 순서는 언제나 Systems 로 좁힌 뒤 Compute 로 내려가는 것입니다. Nsight Systems 는
            timeline 의 kernel 에서 Nsight Compute 를 바로 띄우는 연결을 제공합니다.
          </p>
          <TermBreakdown
            title="두 도구가 보는 것과 보지 못하는 것"
            description="같은 kernel 을 두 도구가 다른 해상도로 봅니다. 질문이 '어디' 인지 '왜' 인지로 도구를 고릅니다."
            items={[
              {
                term: "Nsight Systems · timeline",
                description: "CPU thread, CUDA API, GPU kernel·copy 를 한 시간축에 놓은 system 수준 trace 입니다.",
                example: "Kernel 사이의 빈 구간, copy 와 kernel 의 겹침, sync 에 막힌 host thread 를 봅니다.",
                boundary: "Kernel 안의 stall 원인이나 cache hit 는 보이지 않습니다.",
              },
              {
                term: "Nsight Compute · kernel counter",
                description: "Kernel 하나를 replay 하며 hardware counter 와 warp sampling 을 모으는 kernel 수준 profiler 입니다.",
                example: "DRAM throughput, L2 hit rate, eligible warps, stall reason 을 봅니다.",
                boundary: "Replay 로 elapsed 가 바뀌며 전체 시간에서 이 kernel 의 비중은 말하지 못합니다.",
              },
              {
                term: "Kernel timeline",
                description: "API 호출의 반환 시각과 GPU 에서 kernel 이 실제로 돈 구간을 stream 별로 잇는 row 입니다.",
                example: "Launch 반환과 kernel 시작 사이의 간격이 queue 대기입니다.",
                boundary: "Timeline 의 상관은 원인의 증명이 아니므로 counter 로 반증해야 합니다.",
              },
            ]}
          />
        </div>
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
          Counter 수집은 kernel replay와 overhead를 만들 수 있습니다. 따라서 profiler가 없는 반복에서 최종 latency를 다시 측정합니다. Counter의
          이동 방향과 실제 elapsed 개선이 함께 나타나는지 확인합니다.
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
