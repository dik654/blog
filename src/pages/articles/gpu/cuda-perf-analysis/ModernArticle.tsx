import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  BottleneckLedgerViz,
  MetricBoundaryViz,
  PerfLoopViz,
  PerfReleaseViz,
  ProfilerDecisionViz,
} from "./viz/ModernPerfViz";

const PRACTICES =
  "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html";
const NSYS =
  "https://docs.nvidia.com/nsight-systems/UserGuide/index.html";
const NCU =
  "https://docs.nvidia.com/nsight-compute/NsightCompute/index.html";
const TRIAGE =
  "https://docs.nvidia.com/nsight-compute/ComputeTriage/index.html";

export default function ModernCudaPerfAnalysisArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" data-teach-level="S" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            CUDA measurement first
          </p>
          <h2 className="break-keep text-balance text-3xl font-bold tracking-tight">
            GPU 성능 분석은 느린 숫자를 찾는 일이 아니라, 한 원인 가설을 검증하는 일입니다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          한 문장으로 말하면, CUDA 성능 분석은 사용자가 기다린 시간을 쪼개 가장
          큰 구간을 고르고, 그 구간을 붙잡은 자원에 관한 가설 하나만 바꾼 뒤 같은
          경계에서 다시 재는 과정입니다.
        </p>
        <p>
          이 글은 설명용 요청 하나를 끝까지 사용합니다. Baseline은 100ms이고,
          그중 kernel이 60ms입니다. Kernel은 120GFLOPs의 유효 일을 하며 L2에
          200GB를 요청합니다. L2 hit가 20%라고 단순화하면 HBM으로 내려가는 양은
          160GB입니다. 이 숫자가 실제 장비의 측정값은 아니며, 계산과 판단 순서를
          한 줄로 잇기 위한 고정 fixture입니다.
        </p>
        <PerfLoopViz />
        <div data-teach-level="B">
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
        </div>
        <ContentBoundary article="cuda-perf-analysis" />
      </section>

      <section id="measurement-protocol" data-teach-level="0" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Measurement protocol
          </p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
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
            source="NVIDIA CUDA C++ Best Practices Guide 13.4"
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
              <strong>중요 가정:</strong> CUDA 13.4와 동일
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

      <section id="throughput-ledger" data-teach-level="1" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · Budget and achieved ledger
          </p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
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
          interpretation="고정 fixture에서는 p=0.6, r=2이므로 새 시간은 0.4+0.6/2=0.7입니다. Kernel은 60ms에서 30ms로 절반이 되지만 전체 요청은 100ms에서 70ms가 되어 speedup은 약 1.43×입니다."
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
          interpretation="120GFLOPs와 160GB라면 intensity는 0.75 FLOP/B입니다. Memory peak가 3TB/s일 때 memory roof는 2.25TFLOP/s이고, 60ms에 120GFLOPs를 처리한 achieved 값은 2TFLOP/s입니다. Memory roof 근처라는 가설은 생기지만 원인은 아직 확정되지 않습니다."
        />
        <BottleneckLedgerViz />
        <div id="throughput-vs-peak" data-teach-level="2" className="space-y-6 pt-4">
          <h3 className="break-keep text-balance text-xl font-bold">
            Profiler의 throughput 퍼센트는 unit마다 자기 peak를 분모로 둡니다
          </h3>
          <p>
            Nsight Compute의 DRAM throughput 89%는 HBM이 낸 2.67TB/s를 그
            조건의 peak 3TB/s로 나눈 값입니다. L2, L1/TEX, shared memory와
            compute pipeline도 각각 자기 peak를 분모로 사용합니다.
          </p>
          <p>
            이 퍼센트가 높으면 해당 unit이 현재 처리량의 유력한 제한입니다. 하지만
            100%에서 뺀 차이가 크다고 해서 그 unit과 무관하다는 뜻은 아닙니다.
            Compute와 memory가 모두 낮으면 dependency, 부족한 eligible warp, 작은
            grid처럼 latency를 숨기지 못한 경우를 먼저 의심합니다.
          </p>
          <p>
            Speed Of Light의 Memory와 Compute 값은 여러 하위 metric 가운데 가장
            높은 값을 대표합니다. 따라서 top-line 값만 보고 처방하지 말고 breakdown을
            열어 실제로 높은 unit을 확인해야 합니다.
          </p>
          <p>
            같은 metric에도 active와 elapsed 두 기준이 있습니다. Active는 unit이
            실제로 일한 cycle만 세고, elapsed는 kernel 전체 cycle을 셉니다. Active
            90%, elapsed 45%라면 그 unit은 일할 때는 바빴지만 전체 시간의 상당
            구간에는 일을 받지 못했다는 뜻입니다.
          </p>
          <p>
            Cache hit rate는 throughput과 다른 질문에 답합니다. Hit rate는 요청한
            sector 중 현재 cache에서 끝난 비율입니다. Miss한 sector만 다음 계층으로
            내려가므로, 고정 fixture의 L2 hit 20%는 L2 요청량의 80%가 HBM 쪽으로
            내려간다는 첫 근사를 만듭니다.
          </p>
          <TermBreakdown
            title="Throughput 계열 metric 과 각각의 peak"
            description="이름은 unit 을 말하고 분모는 그 unit 의 theoretical peak 입니다. 100% 에 가까운 unit 이 병목 후보입니다."
            items={[
              {
                term: "DRAM throughput",
                description: "HBM 을 지난 byte 를 시간과 peak bandwidth 로 나눈 비율입니다.",
                example: "설명용 peak 3TB/s에서 2.67TB/s면 약 89%입니다.",
                boundary: "높은 값은 유력한 제한이지만 원인이 요청량·재사용·coalescing 중 무엇인지는 breakdown이 더 필요합니다.",
              },
              {
                term: "L2 throughput · L2 hit rate",
                description: "L2 가 처리한 sector 의 peak 대비 비율과, L2 요청 중 miss 하지 않은 비율입니다.",
                example: "L2 hit 20%면 단순 근사에서 L2 요청 byte의 80%가 DRAM 요청이 됩니다.",
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
                example: "GEMM에서 Tensor pipeline이 80%라면 해당 compute path가 유력한 제한입니다.",
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
          <h3 className="break-keep text-balance text-xl font-bold">
            Counter 하나가 아니라 서로 다른 질문의 counter를 함께 읽습니다
          </h3>
          <p>
            DRAM throughput 89%만 보면 HBM이 바쁘다는 사실까지만 압니다. 여기에
            L2 hit 20%를 함께 놓으면 L2 요청의 많은 부분이 HBM으로 내려간다는
            재사용 부족 가설을 세울 수 있습니다. 그래서 첫 후보는 재사용을 tile
            안으로 옮기는 것입니다.
          </p>
          <p>
            반대로 DRAM은 똑같이 높지만 L2 hit가 85%라면 같은 처방을 바로 고를 수
            없습니다. L2에서 대부분 끝나는데도 HBM이 바쁘다면 처음 가져오는 데이터
            자체가 많거나 write traffic이 큰지 확인해야 합니다.
          </p>
          <p>
            DRAM이 20%인데 long scoreboard가 두드러지면 bandwidth가 아니라 memory
            latency를 숨기지 못한 경우일 수 있습니다. 이때는 eligible warp와 독립적인
            outstanding request를 확인합니다. Stall을 읽는 자세한 순서는{" "}
            <a
              className="text-primary hover:underline"
              href="/cs/gpu/warp-stall-reasons-and-issue-utilization#reading-procedure"
            >
              warp stall reason 글
            </a>
            이 소유합니다.
          </p>
          <p>
            이 상관은 원인의 증명이 아닙니다. 변경 하나를 적용한 뒤 elapsed와 관련
            counter가 예상한 방향으로 함께 움직일 때만 가설을 유지합니다.
          </p>
          <ExplainedFormula
            question="L2 hit rate를 DRAM throughput 가설에 어떻게 연결할까요?"
            idea="L2에서 miss한 sector만 다음 계층으로 내려간다고 단순화합니다. L2 요청 byte에 miss 비율을 곱해 DRAM byte를 근사하고, 같은 elapsed와 peak bandwidth로 나눕니다."
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
                annotation: ["L2 요청 byte에 miss 비율을 곱해", "DRAM까지 내려간 byte를 근사"],
              },
              {
                expression: String.raw`\frac{Q_{\mathrm{DRAM}}}{t\,B_{\mathrm{peak}}}`,
                annotation: ["그 byte를 elapsed와 peak bandwidth로 나눠", "DRAM throughput 퍼센트를 얻음"],
              },
            ]}
            terms={[
              { symbol: String.raw`h_{L2}`, name: "L2 hit rate", description: "L2에 요청된 sector 가운데 miss하지 않은 비율입니다." },
              { symbol: String.raw`Q_{L2}`, name: "L2 요청 byte", description: "L1에서 L2로 내려온 sector 요청의 총 byte입니다." },
              { symbol: String.raw`Q_{\mathrm{DRAM}}`, name: "DRAM 이동 byte", description: "이 단순식에서 HBM까지 내려간 것으로 보는 byte입니다." },
              { symbol: String.raw`t`, name: "Kernel elapsed", description: "같은 측정 경계의 kernel 실행 시간입니다." },
              { symbol: String.raw`B_{\mathrm{peak}}`, name: "DRAM peak bandwidth", description: "Roofline 의 memory roof 를 만드는 theoretical peak 입니다." },
              { symbol: String.raw`T_{\mathrm{DRAM}}`, name: "DRAM throughput", description: "Nsight Compute 가 백분율로 보여 주는 값입니다." },
            ]}
            assumptions={[
              "L2 miss가 모두 DRAM 요청이 되는 단순화이며 write-back, compression, peer·system traffic은 무시합니다.",
              "Elapsed 기준 분모를 씁니다. Active 기준은 unit이 일한 cycle만 사용하므로 같은 값이 아닙니다.",
            ]}
            interpretation="고정 fixture에서 Q_L2=200GB, h_L2=0.2이면 Q_DRAM≈160GB입니다. t=0.06s, B_peak=3TB/s로 나누면 약 89%입니다. Hit가 0.8로 오르고 Q_L2가 같다고 가정하면 Q_DRAM 근사는 40GB로 줄지만, 실제 bytes와 elapsed는 반드시 다시 측정합니다."
          />
        </div>
      </section>

      <section id="profiling" data-teach-level="3" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Hypothesis loop
          </p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
            Timeline으로 대상을 고르고, decision tree로 원인을 좁힌다
          </h2>
        </header>
        <ProfilerDecisionViz />
        <div id="profiler-roles" className="space-y-6">
          <h3 className="break-keep text-balance text-xl font-bold">
            Nsight Systems는 어디를 볼지, Nsight Compute는 그 안에서 무엇을 의심할지 정합니다
          </h3>
          <p>
            Nsight Systems는 CPU thread, CUDA API 호출, GPU kernel과 copy를 한
            시간축에 놓습니다. 고정 fixture에서는 전체 100ms에서 kernel 60ms가
            가장 큰 구간이라는 사실을 여기서 찾습니다.
          </p>
          <p>
            CUDA API trace는 host가 부른 호출의 시작과 반환을 기록합니다. CUDA
            workload trace는 GPU에서 실행된 kernel과 memory operation을 stream별로
            기록합니다. 두 row를 연결해야 25μs launch 반환과 60ms GPU 실행을 같은
            시간으로 오해하지 않습니다.
          </p>
          <p>
            Nsight Compute는 이렇게 고른 kernel이나 range의 hardware metric을
            수집합니다. 여러 metric을 모으기 위해 replay, cache control, clock control,
            serialization이 개입할 수 있으므로 profiler 안의 duration을 release latency로
            그대로 쓰지 않습니다.
          </p>
          <p>
            2026년 Compute Triage Guide도 kernel 우선순위가 불명확하면 Systems를
            먼저 쓰고, metric 신뢰성, grid 포화 여부, latency·throughput 분류,
            dominant pipeline이나 memory mechanism, source line 순으로 내려가라고
            안내합니다. 하나의 top-line 퍼센트에서 곧장 코드 변경으로 뛰지 않는
            이유입니다.
          </p>
          <TermBreakdown
            title="두 도구가 보는 것과 보지 못하는 것"
            description="같은 kernel을 두 도구가 다른 해상도로 봅니다. 질문이 '어디'인지 '왜'인지로 도구를 고릅니다."
            items={[
              {
                term: "Nsight Systems · timeline",
                description: "CPU thread, CUDA API, GPU kernel·copy를 한 시간축에 놓은 system 수준 trace입니다.",
                example: "Kernel 사이의 빈 구간, copy와 kernel의 겹침, sync에 막힌 host thread를 봅니다.",
                boundary: "Kernel 안의 stall 원인이나 cache hit는 보이지 않습니다.",
              },
              {
                term: "Nsight Compute · kernel counter",
                description: "Kernel이나 range를 replay하며 hardware counter와 warp sampling을 모으는 profiler입니다.",
                example: "DRAM throughput, L2 hit rate, eligible warps, stall reason을 봅니다.",
                boundary: "Replay로 실행 조건이 달라질 수 있고 전체 시간에서 이 kernel의 비중은 말하지 못합니다.",
              },
              {
                term: "Kernel timeline",
                description: "API 호출 반환과 GPU에서 실제로 돈 구간을 stream별로 연결해 보는 timeline입니다.",
                example: "Launch 반환과 kernel 시작 사이의 간격이 queue 대기입니다.",
                boundary: "Timeline의 상관은 원인의 증명이 아니므로 counter와 변경 실험으로 반증해야 합니다.",
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
            source="NVIDIA Nsight Systems 2026.5.1 User Guide"
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
              <strong>중요 가정:</strong> Nsight Systems 2026.5.1과 capture
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
            source="NVIDIA Nsight Compute 2026.3.1 User Guide"
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
              <strong>근거 범위:</strong> Nsight Compute 2026.3.1의 profiler
              semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Stall metric 하나가 원인을
              증명하거나 occupancy 최대화가 성능을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
        <div id="paper-nsight-compute-triage">
          <CitationBlock
            type="code"
            citeKey={5}
            source="NVIDIA Nsight Compute 2026.3 Compute Triage Guide"
            href={TRIAGE}
          >
            <p>
              <strong>문제:</strong> 많은 metric 중 어디서 시작하고 어느 branch로
              내려갈지 일관된 순서가 필요합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Metric 신뢰성, workload 포화,
              latency·throughput, 지배 pipeline·memory mechanism, source line을
              위에서 아래로 좁힙니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Capture 조건을 고정하고 대표 workload와
              optimized build를 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 2026.3에 추가된 공식 triage workflow와
              실무용 threshold의 범위입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 60%·80% 같은 threshold를 모든 GPU와
              algorithm의 물리 법칙으로 취급하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" data-teach-level="4" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Release gate
          </p>
          <h2 className="mt-2 break-keep text-balance text-2xl font-bold">
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
        <PerfReleaseViz />
        <p>
          Register·spill을 더 깊게 읽으려면{" "}
          <a
            className="text-primary hover:underline"
            href="/cs/gpu/cuda-register-pressure"
          >
            register pressure
          </a>
          , stage를 합치는 판단은{" "}
          <a
            className="text-primary hover:underline"
            href="/cs/gpu/cuda-kernel-fusion"
          >
            kernel fusion과 Megakernel
          </a>
          , long-lived worker는{" "}
          <a
            className="text-primary hover:underline"
            href="/cs/gpu/cuda-persistent-kernels"
          >
            persistent kernel
          </a>
          에서 이어집니다.
        </p>
      </section>
    </article>
  );
}
