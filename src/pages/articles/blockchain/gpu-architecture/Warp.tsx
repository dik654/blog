import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import WarpScheduleViz from "./viz/WarpScheduleViz";

export default function Warp() {
  return (
    <section id="warp" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Warp scheduling과 occupancy: 기다림을 숨길 만큼만 resident로 둡니다
      </h2>
      <WarpScheduleViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="gpu-latency-hiding-occupancy" className="scroll-mt-24">
          <p>
            Warp 하나가 memory dependency에 막히면 scheduler는 같은 SM에
            resident인 다른 ready warp를 고릅니다. 이{" "}
            <strong>latency hiding</strong>은 stall 자체를 없애는 것이 아니라,
            기다리는 시간에 다른 instruction을 issue해 execution unit이 쉬는
            시간을 줄이는 방식입니다. 따라서 independent warp가 충분하지 않거나
            모든 warp가 같은 memory bottleneck에 걸리면 occupancy 숫자가 높아도
            처리량은 오르지 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 SM에 동시에 resident할 수 있는 block 수는 무엇이 제한하는가?"
          idea={
            <p>
              Thread와 register, shared-memory, architecture block limit가 각각 허용하는 block 수를 계산하면 가장 작은 값이 실제 상한이
              됩니다.
            </p>
          }
          formula={
            "\\begin{aligned} B_{\\mathrm{res}}&=\\min(B_{\\max},B_T,B_R,B_S)\\\\ B_T&=\\left\\lfloor\\frac{T_{SM}}{T_B}\\right\\rfloor\\quad B_R=\\left\\lfloor\\frac{R_{SM}}{R_TT_B}\\right\\rfloor\\\\ B_S&=\\left\\lfloor\\frac{S_{SM}}{S_B}\\right\\rfloor \\end{aligned}"
          }
          annotatedFormula={String.raw`\begin{aligned} B_{\mathrm{res}}&=\underbrace{\min(B_{\max},B_T,B_R,B_S)}_{\text{경계 후보 선택}}\\ B_T&=\underbrace{\left\lfloor\frac{T_{SM}}{T_B}\right\rfloor\quad B_R=\left\lfloor\frac{R_{SM}}{R_TT_B}\right\rfloor}_{\text{기준량당 비율}}\\ B_S&=\underbrace{\left\lfloor\frac{S_{SM}}{S_B}\right\rfloor}_{\text{기준량당 비율}} \end{aligned}`}
          operations={[
            { expression: String.raw`\min(B_{\max},B_T,B_R,B_S)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Thread·register·shared-memory·architecture","block limit가 각각 허용하는 block 수를","계산하고, 가장 작은 값이 실제 상한이 됩니다."] },
            { expression: String.raw`\left\lfloor\frac{T_{SM}}{T_B}\right\rfloor\quad B_R=\left\lfloor\frac{R_{SM}}{R_TT_B}\right\rfloor`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Thread·register·shared-memory·architecture","block limit가 각각 허용하는 block 수를","계산하고, 가장 작은 값이 실제 상한이 됩니다."] },
            { expression: String.raw`\left\lfloor\frac{S_{SM}}{S_B}\right\rfloor`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Thread·register·shared-memory·architecture","block limit가 각각 허용하는 block 수를","계산하고, 가장 작은 값이 실제 상한이 됩니다."] },
          ]}
          terms={[
            {
              symbol: "B_{\\max}",
              name: "architecture block limit",
              description:
                "SM당 허용되는 resident block 수의 hardware 상한입니다.",
            },
            {
              symbol: "T_{SM},T_B",
              name: "thread budgets",
              description:
                "SM의 resident thread 한도와 block당 thread 수입니다.",
            },
            {
              symbol: "R_{SM},R_T",
              name: "register budgets",
              description:
                "SM의 register 수와 compiler가 보고한 thread당 register 수입니다.",
            },
            {
              symbol: "S_{SM},S_B",
              name: "shared-memory budgets",
              description:
                "SM의 가용 shared memory와 block당 정적·동적 사용량입니다.",
            },
          ]}
          assumptions={[
            "실제 allocation granularity와 architecture별 partition·warp limit는 단순식에서 생략했습니다.",
            "Compiler 옵션과 launch configuration이 정해진 동일 kernel을 비교합니다.",
            "Resident block 상한은 latency hiding의 기회일 뿐 성능 보장이 아닙니다.",
          ]}
          interpretation="예를 들어 thread 기준 8 blocks, register 기준 3 blocks, shared-memory 기준 5 blocks라면 resident 상한은 3 blocks입니다. Register를 더 줄여 4 blocks가 되어도 spill traffic이 늘면 실행 시간은 오히려 나빠질 수 있습니다."
        />
        <p>
          같은 warp 안 branch가 갈리면 active mask로 경로를 나누어 실행할 수 있어 lane utilization이 줄어듭니다. 하지만 divergence가 곧 틀린
          결과를 뜻하지 않으며 짧은 branch를 억지로 없애 instruction을 늘리는 것도 항상 이득은 아닙니다. Profiler에서 eligible warps와 stall
          reason, branch efficiency, kernel time을 함께 봅니다.
        </p>
        <div id="paper-cuda-occupancy" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA Programming Guide — Hardware Multithreading"
            citeKey={3}
            href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading"
          >
            공식 guide는 block resource가 active block·warp 수를 제한하고 warp
            scheduler가 ready instruction을 선택하는 구조를 설명합니다.
            Occupancy 최대화가 곧 kernel time 최소화라는 결론은 제공하지
            않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
