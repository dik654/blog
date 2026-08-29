import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RegisterResidencyViz } from "../cuda-perf-analysis/viz/FusionResourceViz";
import OccupancyWaveViz from "./viz/OccupancyWaveViz";
import RegisterLiveRangeViz from "./viz/RegisterLiveRangeViz";

const PROGRAMMING =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const PRACTICES =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
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

      <section id="register-file" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Register file
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            SM register file은 64K개의 slot을 warp 단위 256개씩 나눠 준다
          </h2>
        </header>
        <p>
          Register file은 SM 하나가 가진 32-bit register 전체입니다. Compute
          capability 7.0 이후 SM은 65,536개, 즉 256 KB의 register slot을 갖고
          이를 resident한 모든 warp가 나눠 씁니다. Thread 하나가 받을 수 있는
          최대치는 255개이므로 한 thread가 register file 전체를 쓰는 일은 구조상
          없습니다.
        </p>
        <p>
          Register per thread는 compiler가 kernel마다 정하는 수이며{" "}
          <code>--ptxas-options=-v</code>가 보고합니다. 이 수는 source의 변수
          개수가 아니라 동시에 살아 있는 값의 최댓값에 loop counter나 주소 계산용
          임시값을 더한 결과입니다. 64개면 warp 하나가 32×64=2,048개를 요구하고
          65,536개 예산에서 32 warps가 들어갑니다.
        </p>
        <p>
          Hardware는 이 요구량을 thread 단위가 아니라 warp 단위로, 256개씩
          반올림해 배정합니다. 이것이 register allocation granularity입니다.
          Thread당 37개면 warp 요구량은 1,184개인데 실제 배정은 1,280개라
          warp마다 96개, 7.5%가 낭비됩니다. 96개라면 3,072개로 256의 배수이니
          반올림 손실은 없습니다.
        </p>
        <p>
          Warp 수는 다시 SM의 subpartition 4개에 나눠 담기므로 4의 배수로
          내립니다. 37개 예에서 65,536/1,280은 51.2지만 실제 상한은 48 warps이고,
          128-thread block(4 warps)은 12개가 들어가 75%, 320-thread block(10
          warps)은 4개만 들어가 63%가 됩니다. 같은 register 수에서도 block 크기가
          occupancy를 바꾸는 이유입니다.
        </p>
        <AlgorithmBlock
          title="Registers/thread에서 register-limited resident warp 상한 계산"
          input={[
            "R_thread: ptxas -v 가 보고한 thread당 register 수",
            "R_SM = 65536: SM register file, U = 256: warp 배정 단위",
            "W_hw = 64: SM당 최대 warp, B: block당 warp 수",
          ]}
          steps={[
            {
              code: "regs_per_warp = ceil(32 * R_thread / U) * U",
              note: "37 → 1,184 를 1,280 으로 반올림, 96 → 3,072 그대로",
            },
            {
              code: "warps_by_regs = floor(R_SM / regs_per_warp)",
              note: "1,280 → 51, 3,072 → 21",
            },
            {
              code: "warps_by_regs = floor(warps_by_regs / 4) * 4",
              note: "Subpartition 4개에 같은 수로 담기므로 51 → 48, 21 → 20",
            },
            {
              code: "blocks = floor(min(warps_by_regs, W_hw) / B)",
              note: "B=8(256 threads)이면 20 → 2 blocks",
            },
            {
              code: "theoretical_warps = blocks * B",
              note: "2 × 8 = 16 warps, 16/64 = 25%",
            },
          ]}
          output="Register 한도만 본 resident warp 상한. shared memory·thread·block 한도와 min 을 취해야 theoretical occupancy 가 된다"
        />
        <p>
          Compiler가 어떤 값을 어느 register에 놓는지, 즉 register allocation
          자체는{" "}
          <Link to="/gpu/cuda-compilation-and-isa-analysis#ptxas-optimizations">
            ptxas register allocation
          </Link>
          이 정본입니다. 이 글은 그 결과 숫자가 SM 예산과 만나 무엇을 만드는지만
          다룹니다.
        </p>
        <div id="paper-cuda-best-practices-occupancy">
          <CitationBlock
            type="code"
            citeKey={1}
            source="NVIDIA CUDA C++ Best Practices Guide 12.8.1 · Occupancy"
            href={PRACTICES}
          >
            <p>
              <strong>문제:</strong> Thread당 register 수가 resident warp 수로
              바뀌는 규칙을 알아야 launch configuration을 고를 수 있습니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> CC 7.0의 65,536 registers, 256
              단위 warp 반올림, 37 registers·128/320-thread block 예를
              제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Register 수·최대 thread·배정 단위는
              compute capability마다 다릅니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Occupancy 계산 규칙과 register
              pressure 완화 옵션입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 66%에서 100%로 occupancy를 올려도
              성능이 그만큼 오른다는 뜻이 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="live-range" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Live values</p>
          <h2 className="mt-2 text-2xl font-bold">
            각 kernel의 register 수보다 겹치는 lifetime을 먼저 본다
          </h2>
        </header>
        <p>
          Separate A, B, C는 kernel 경계에서 이전 temporaries의 lifetime이
          끝납니다. 하나로 합치면 A output을 HBM에 쓰지 않는 대신 C가 사용할
          때까지 붙잡을 수 있습니다. 여기에 B와 C의 index, accumulator,
          predicate가 겹치면 register pressure가 커집니다.
        </p>
        <p>
          그래서 <code>ptxas -v</code>가 보고한 registers와 local bytes, 그리고
          target SASS를 실제 candidate마다 확인합니다.
        </p>
        <p>
          Register reuse는 live range가 끝난 physical register를 다음 값이 곧바로
          이어받는 일입니다. Loop 안에서 임시값 8개가 차례로 만들어지고 바로
          소비되면 compiler는 register 2~3개를 돌려 쓰며, 요구량은 8이 아니라
          동시에 살아 있는 최댓값입니다. 값을 일찍 만들고 늦게 쓰는 source가
          reuse 기회를 없앱니다.
        </p>
        <p>
          Rematerialization은 값을 register에 붙잡거나 spill하는 대신 필요한
          자리에서 다시 계산하는 선택입니다. 주소 <code>base + i*stride</code>나
          상수 곱처럼 입력이 아직 register에 있고 명령 한두 개면 되는 값이
          후보입니다. 재계산은 ALU 몇 cycle이지만 spill은 store와 load 두 번의
          local memory 왕복이라 L1 hit여도 수십 cycle이 걸립니다.
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
            03 · Residency before spill
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
          Theoretical occupancy는 register, shared memory, thread 수, block 수
          네 한도가 각각 허용하는 warp 수 중 최솟값을 최대 64 warps로 나눈
          비율입니다. 가장 먼저 막히는 자원이 정하므로 resource-limited
          occupancy라고도 부릅니다.
        </p>
        <p>
          Thread당 96 registers면 register 한도가 20 warps라 31%이고,
          256-thread block이면 2 blocks 16 warps로 25%가 됩니다. 이 값은 launch
          전에 계산할 수 있고 Nsight Compute는{" "}
          <code>launch__occupancy_limit_registers</code>로 어느 자원이 먼저
          막혔는지 보여 줍니다.
        </p>
        <p>
          Achieved occupancy는 실행 중 profiler가 sampling한 active warp 수의
          평균을 같은 64로 나눈 값입니다. Nsight Compute의{" "}
          <code>sm__warps_active</code> 기반 metric이며, launch 전에 계산할 수
          있는 theoretical과 달리 kernel이 끝나야 알 수 있습니다. 두 값이 크게
          벌어지면 자원 한도가 아니라 일의 분배가 원인입니다.
        </p>
        <p>
          차이를 만드는 첫 원인은 tail effect입니다. 132개 SM에 block 2개씩 264
          slot이 있는데 grid가 300 blocks면 첫 wave는 가득 차지만 둘째 wave는 36
          blocks만 남아 그 구간에는 slot의 14%만 일합니다. 둘째 원인은 block
          안의 불균형으로, warp 8개 중 5개가 먼저 끝나도 마지막 warp가 끝날
          때까지 block slot이 반납되지 않습니다.
        </p>
        <OccupancyWaveViz />
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
          <p className="text-sm font-semibold text-primary">04 · Spill path</p>
          <h2 className="mt-2 text-2xl font-bold">
            Spill은 local address를 거쳐 cache와 device memory로 내려간다
          </h2>
        </header>
        <p>
          Spill된 값은 thread별 local address를 얻지만 physical backing은 device
          memory에 있습니다. 지원 architecture에서 cache hit를 얻을 수 있어도
          register access와 같은 비용이라고 볼 수 없습니다. Build report의 spill
          bytes만 보지 말고 local load/store instruction, L2·DRAM traffic와
          kernel elapsed를 함께 봅니다.
        </p>
        <p>
          Spill store는 register 값을 local memory로 내리는 <code>STL</code>
          이고, spill load는 그 값을 다시 register로 올리는 <code>LDL</code>
          입니다. Spill 하나가 loop 안에 있으면 iteration마다 이 두 instruction이
          붙습니다. Thread 2²⁰개가 1,000번 도는 loop에서 4-byte 값 하나를
          spill하면 store 4 GB와 load 4 GB가 생깁니다.
        </p>
        <p>
          이 8 GB가 L1에 머물면 DRAM traffic으로는 보이지 않지만 issue slot과
          L1 bandwidth를 쓰고, L1 miss가 나면 L2와 DRAM 왕복으로 나타나
          3 TB/s에서도 2.7 ms가 더 걸립니다. SASS에서 <code>LDL</code>·
          <code>STL</code> 개수를 세고 Nsight Compute의 local memory
          metric으로 실제 hit 위치를 확인합니다.
        </p>
        <div id="paper-cuda-register-memory">
          <CitationBlock
            type="code"
            citeKey={2}
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
            citeKey={3}
            source="NVIDIA Nsight Compute 2025.1 User Guide"
            href={NCU}
          >
            <p>
              <strong>문제:</strong> Resource usage와 scheduler·memory
              counters를 같은 kernel candidate에서 비교해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Launch statistics, occupancy,
              memory workload와 scheduler sections를 제공합니다.
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
            05 · Resource release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Register 수가 아니라 elapsed와 예상 counter 방향으로 채택한다
          </h2>
        </header>
        <p>
          Baseline과 candidate의 output parity를 먼저 확인합니다. 그 뒤
          registers/thread, local bytes, resident와 eligible warps, local과
          L2·DRAM traffic, kernel과 end-to-end median·p95를 같은 receipt에
          놓습니다.
        </p>
        <p>
          Spill이 줄었지만 elapsed가 늘거나, occupancy가 올랐지만 memory
          dependency가 그대로면 채택 근거가 아닙니다.
        </p>
        <p>
          Theoretical과 achieved를 함께 적으면 다음 조치가 갈립니다.
          Theoretical이 낮으면 register나 shared memory를 줄이는 문제이고,
          theoretical은 높은데 achieved가 낮으면 grid 크기나 block 안의 일
          분배를 고치는 문제입니다.
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
