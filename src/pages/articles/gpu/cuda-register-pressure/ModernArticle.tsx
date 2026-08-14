import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RegisterResidencyViz } from "../cuda-perf-analysis/viz/FusionResourceViz";
import RegisterLiveRangeViz from "./viz/RegisterLiveRangeViz";

const PROGRAMMING =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const NCU =
  "https://docs.nvidia.com/nsight-compute/2025.1/NsightCompute/index.html";

export default function ModernCudaRegisterPressureArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Register → residency → spill
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Register pressure는 “변수가 많다”가 아니라 값을 동시에 붙잡는 시간의
            문제다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          GPU thread는 자주 쓰는 scalar·pointer·partial result를 on-chip
          register에 둡니다. Compiler는 값이 만들어진 순간부터 마지막 사용까지의
          live range를 보고 physical register를 배정합니다. 따라서 source 변수
          개수나 kernel 세 개의 register 수를 단순히 더하는 계산만으로 fused
          kernel의 압력을 알 수 없습니다.
        </p>
        <TermBreakdown
          title="저장 위치를 가까운 순서대로 하나씩 구분합니다"
          description="Register와 CUDA local memory의 이름을 CPU의 register·stack 직관으로 바로 옮기지 않습니다."
          items={[
            {
              term: "Thread register",
              description:
                "한 thread의 현재 계산값을 보관하는 SM의 on-chip 32-bit slot입니다.",
              example:
                "double 값 하나는 표현만으로 최소 두 개의 32-bit slots를 요구합니다.",
              boundary:
                "255 근처 한도는 여러 architecture의 thread당 배정 한도이지 kernel 전체 register 수가 아닙니다.",
            },
            {
              term: "Live range",
              description:
                "값을 만든 시점부터 마지막으로 읽는 시점까지 반드시 보존해야 하는 코드 구간입니다.",
              example:
                "A의 output을 C까지 살리면서 B temporaries가 생기면 두 구간이 겹칩니다.",
              boundary:
                "Compiler 최적화와 target cubin에 따라 source 수준 예상과 달라질 수 있습니다.",
            },
            {
              term: "Local memory spill",
              description:
                "배정할 register가 부족할 때 일부 thread-local 값을 local address space로 내리는 경로입니다.",
              example:
                "SASS의 local load/store와 profiler traffic으로 실제 spill을 확인합니다.",
              boundary:
                "이름과 달리 CPU stack처럼 항상 가까운 storage가 아니며 device memory에 놓이고 cache를 거칠 수 있습니다.",
            },
          ]}
        />
        <RegisterLiveRangeViz />
        <ContentBoundary article="cuda-register-pressure" />
      </section>

      <section id="live-range" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · Live values</p>
          <h2 className="mt-2 text-2xl font-bold">
            각 kernel의 register 수보다 겹치는 lifetime을 먼저 본다
          </h2>
        </header>
        <p>
          Separate A·B·C는 kernel 경계에서 이전 temporaries의 lifetime이
          끝납니다. 하나로 합치면 A output을 HBM에 쓰지 않는 대신 C가 사용할
          때까지 붙잡을 수 있습니다. 여기에 B와 C의
          index·accumulator·predicate가 겹치면 register pressure가 커집니다.
          그래서 <code>ptxas -v</code>의 registers·local bytes와 target SASS를
          실제 candidate마다 확인합니다.
        </p>
        <p>
          <code>__launch_bounds__</code>나 compiler register cap으로 숫자를
          억지로 낮추면 resident blocks가 늘 수 있지만
          spill·recompute·instruction count가 함께 늘 수 있습니다. “register
          수가 낮다” 자체는 목표가 아닙니다.
        </p>
      </section>

      <section id="residency" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · Residency before spill
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Spill 전에 resident warp 수가 먼저 줄 수 있다
          </h2>
        </header>
        <RegisterResidencyViz />
        <ExplainedFormula
          question="Thread당 register가 늘면 register-only resident warp 상한은 왜 줄어들까요?"
          idea={
            <>
              Warp 하나의 32 threads가 동시에 점유할 register를 먼저 만들고, SM
              register file에 그 묶음이 몇 개 들어가는지 계산한 뒤 hardware
              한도와 비교합니다.
            </>
          }
          formula={String.raw`\begin{aligned}D_w&=32R_{thread}\\W_{reg}&=\lfloor R_{SM}/D_w\rfloor\\W&\le\min(W_{hw},W_{reg})\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}D_w&=\underbrace{32}_{\text{warp threads}}\underbrace{R_{thread}}_{\text{thread당 reg}}\\[3pt]W_{reg}&=\lfloor\underbrace{R_{SM}}_{\text{SM reg 예산}}/\underbrace{D_w}_{\text{warp당 요구량}}\rfloor\\[3pt]W&\le\min\!\left(\underbrace{W_{hw}}_{\text{hardware 한도}},\underbrace{W_{reg}}_{\text{register 한도}}\right)\end{aligned}`}
          operations={[
            {
              expression: String.raw`32R_{thread}`,
              annotation: ["warp의 32 threads가", "동시에 점유할 slots를 합산"],
            },
            {
              expression: String.raw`R_{SM}/D_w`,
              annotation: [
                "SM register file에",
                "warp 묶음이 몇 개 들어가는지 계산",
              ],
            },
            {
              expression: String.raw`\min(W_{hw},W_{reg})`,
              annotation: [
                "hardware와 register 제약 중",
                "먼저 막히는 상한을 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R_{thread}",
              name: "Registers per thread",
              description:
                "Compiler가 thread 하나에 배정한 32-bit register slots입니다.",
            },
            {
              symbol: "D_w",
              name: "Registers per warp",
              description:
                "Warp 32 threads가 resident하기 위해 요구하는 register 수입니다.",
            },
            {
              symbol: "R_{SM}",
              name: "SM register file",
              description: "SM 전체의 32-bit register slot 예산입니다.",
            },
            {
              symbol: "W_{reg}",
              name: "Register-limited warps",
              description: "Register만 고려한 resident warp 상한입니다.",
            },
            {
              symbol: "W_{hw}",
              name: "Hardware warp limit",
              description:
                "Architecture가 허용하는 resident warp 수 상한입니다.",
            },
          ]}
          assumptions={[
            "작은 예는 SM당 65,536 registers와 최대 64 warps를 사용합니다.",
            "실제 allocation granularity, block 크기, shared memory와 block limit은 생략합니다.",
          ]}
          interpretation="64 registers/thread면 32 warps, 128이면 16 warps가 register-only 상한입니다. 두 경우 모두 spill 0일 수 있지만 latency를 숨길 ready warp 기회는 달라집니다."
        />
        <p>
          Occupancy는 최대 active warps 대비 resident warps 비율입니다. 높은
          occupancy가 자동으로 빠른 것은 아닙니다. Resident warp가 많아도 모두
          같은 dependency를 기다리면 eligible warp가 부족할 수 있고,
          reuse·instruction-level parallelism이 충분하면 낮은 occupancy가 더
          빠를 수도 있습니다.
        </p>
      </section>

      <section id="spill-path" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Spill path</p>
          <h2 className="mt-2 text-2xl font-bold">
            Register → local address → cache → device memory 경로를 확인한다
          </h2>
        </header>
        <p>
          Spill된 값은 thread별 local address를 얻지만 physical backing은 device
          memory에 있습니다. 지원 architecture에서 cache hit를 얻을 수 있어도
          register access와 같은 비용이라고 볼 수 없습니다. Build report의 spill
          bytes만 보지 말고 local load/store instruction, L2·DRAM traffic와
          kernel elapsed를 함께 봅니다.
        </p>
        <div id="paper-cuda-register-memory">
          <CitationBlock
            type="code"
            citeKey={1}
            source="NVIDIA CUDA C++ Programming Guide 12.8.1 · registers and local memory"
            href={PROGRAMMING}
          >
            <p>
              <strong>문제:</strong> Thread register allocation, SM residency와
              local-memory storage 경계를 구분해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Register file·local address
              space·compiler inspection의 공식 CUDA semantics를 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> CUDA 12.8.1과 실제 target compute
              capability·compiler output을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> CUDA register와 local memory의
              allocation·storage semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 255/256을 kernel 전체 또는 모든
              GPU의 동일 register 한도로 일반화하지 않습니다.
            </p>
          </CitationBlock>
        </div>
        <div id="paper-nsight-compute-registers">
          <CitationBlock
            type="code"
            citeKey={2}
            source="NVIDIA Nsight Compute 2025.1 User Guide"
            href={NCU}
          >
            <p>
              <strong>문제:</strong> Resource usage와 scheduler·memory
              counters를 같은 kernel candidate에서 비교해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Launch statistics, memory
              workload와 scheduler sections를 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 지원 GPU·driver·metric availability와
              replay 설정을 기록합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 profiler release의 metric
              collection semantics입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Occupancy나 spill counter 하나만으로
              end-to-end 성능 원인을 확정하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Resource release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Register 수가 아니라 elapsed와 예상 counter 방향으로 채택한다
          </h2>
        </header>
        <p>
          Baseline과 candidate의 output parity를 확인하고 registers/thread,
          local bytes, resident blocks·warps, eligible warps, local/L2/DRAM
          traffic과 kernel·end-to-end median·p95를 같은 receipt에 놓습니다.
          Spill이 줄었지만 elapsed가 늘거나, occupancy가 올랐지만 memory
          dependency가 그대로면 채택 근거가 아닙니다.
        </p>
        <p>
          이 자원 경계가 실제 fusion 판단에 어떻게 들어가는지는
          <a
            className="ml-1 text-primary hover:underline"
            href="/gpu/cuda-kernel-fusion"
          >
            kernel fusion과 Megakernel
          </a>
          에서 조합합니다.
        </p>
      </section>
    </article>
  );
}
