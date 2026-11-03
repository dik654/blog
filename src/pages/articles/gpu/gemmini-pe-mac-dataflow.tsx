import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./gemmini-pe-mac-dataflow/codeRefs";
import { gemminiPeMacDataflowTree } from "./gemmini-pe-mac-dataflow/fileTree";
import GemminiPeMacDataflowViz from "./gemmini-pe-mac-dataflow/viz/GemminiPeMacDataflowViz";

/**
 * PE 한 칸: 같은 MAC 배선을 OS와 WS가 공유합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 실제 소스: UC Berkeley Gemmini commit 8c3f992 · src/main/scala/gemmini/PE.scala
 */
export default function GemminiPeMacDataflowArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">OS는 출력 하나를 붙잡고, WS는 weight 하나를 붙잡습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Gemmini PE 한 칸의 핵심은 계산기가 두 개라는 데 있지 않습니다. 같은 MacUnit 하나를 두고,
            Output-Stationary(OS)는 완성할 출력의 부분합을 레지스터에 붙잡으며 Weight-Stationary(WS)는 weight를
            붙잡습니다. 무엇을 붙잡느냐가 데이터 이동과 재사용 축을 바꿉니다.
          </p>
          <p>
            숫자 하나부터 보겠습니다. <code>C₀₀ = D₀₀ + A₀₀B₀₀ + A₀₁B₁₀</code>이고 값이
            <code>11 + 2×5 + 3×7 = 42</code>라면, OS는 11을 PE 안에서 21, 42로 키웁니다. 반면 WS는
            B₀₀=5 같은 weight를 고정하고 서로 다른 출력 행의 activation과 들어온 partial sum을 통과시킵니다.
          </p>
          <p>
            그러면 왜 두 방식이 같은 MacUnit을 공유할 수 있을까요? c1·c2는 왜 두 벌이고, <code>propagate</code>가
            바뀌는 순간에만 <code>shift</code>를 적용할까요? 아래에서 고정 commit의 <code>PE.scala</code> 배선을
            숫자 42 하나와 함께 따라가며 답합니다.
          </p>
        </div>
        <GemminiPeMacDataflowViz />
        <ContentBoundary article="gemmini-pe-mac-dataflow" />
      </section>

      <section id="mac-unit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">MacUnit은 세 값을 받아 한 번의 곱셈-누산을 표현합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 항 <code>11 + 2×5 = 21</code>을 포트에 넣어 보겠습니다. <code>in_c=11</code>은 들어온 누적값,
            <code>in_a=2</code>와 <code>in_b=5</code>는 곱할 두 값입니다. 소스의
            <code>io.out_d := io.in_c.mac(io.in_a, io.in_b)</code>가 이 세 값을 21로 바꿉니다.
          </p>
          <p>
            이 한 줄은 조합 논리를 기술합니다. 따라서 “모든 Gemmini 설정에서 반드시 한 클록에 끝난다”는 뜻은
            아닙니다. 실제 clock timing과 pipeline register는 Tile·Mesh 구성까지 함께 봐야 합니다. 이 글에서
            MacUnit을 원자 연산이라고 부르는 이유는 시간 보장이 아니라 OS와 WS가 같은 계산 회로를 공유하기 때문입니다.
          </p>
          <p>
            소스 주석도 합성 도구가 두 dataflow의 MAC을 따로 만들 수 있어 별도 module 하나로 재사용을 강제한다고
            설명합니다. OS와 WS에서 달라지는 것은 식이 아니라 <code>in_b</code>와 <code>in_c</code>에 무엇을 연결하는지입니다.
          </p>
        </div>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton
            label="MacUnit · 원자 연산"
            onClick={() => sidebar.open("mac-unit", codeRefs["mac-unit"])}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이제 같은 포트 이름도 dataflow에 따라 의미가 달라지는 지점을 보겠습니다. 특히 WS의
            <code>mac_unit.io.in_c := b</code>에서 <code>b</code>는 activation이 아니라 위에서 흘러온 partial sum입니다.
          </p>
        </div>
      </section>

      <section id="dataflow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">OS는 reduction 항을 모으고, WS는 여러 출력 행에 weight를 재사용합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>PEControl.dataflow</code> 한 비트가 두 배선 중 하나를 고릅니다. OS에서는 A와 B가 흐르고 D가
            c1 또는 c2에 먼저 들어갑니다. 같은 출력 C₀₀에 속하는 reduction 항이 도착할 때마다
            <code>11→21→42</code>로 누적되므로 partial sum이 PE 안에 머뭅니다.
          </p>
          <p>
            WS에서는 c1·c2의 값을 <code>mac_unit.io.in_b</code>에 연결해 weight로 씁니다. A는 늘 그렇듯
            <code>in_a</code>로 들어갑니다. 중요한 차이는 <code>mac_unit.io.in_c := b</code>입니다. 여기의 b는 위에서
            들어온 partial sum이며, MAC 결과는 <code>out_b</code>로 다음 PE에 전달되어 다른 weight 항을 계속 더합니다.
          </p>
          <p>
            따라서 WS에서 고정 weight B₀₀=5는 A의 여러 출력 행에 재사용됩니다. 행 0의 a=2와 partial sum 11을
            받아 21을 만들고, 뒤이어 행 1의 a=4와 partial sum 13을 받아 33을 만듭니다. 반면 OS의 고정 partial sum은
            같은 출력의 reduction 길이만큼 재사용됩니다. 두 방식은 재사용 축이 다릅니다.
          </p>
        </div>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton
            label="Weight-Stationary 분기"
            onClick={() => sidebar.open("weight-stationary", codeRefs["weight-stationary"])}
          />
          <CodeViewButton
            label="Output-Stationary 분기"
            onClick={() => sidebar.open("output-stationary", codeRefs["output-stationary"])}
          />
        </div>
        <TermBreakdown
          title="같은 회로, 반대 배선"
          items={[
            {
              term: "Weight-Stationary",
              description: "weight를 PE에 고정하고 서로 다른 출력 행의 activation·partial sum이 지날 때 재사용합니다.",
              example: "B₀₀=5를 고정하면 output row 0의 a=2와 row 1의 a=4가 차례로 같은 5를 사용합니다.",
              boundary: "한 PE의 out_b는 최종 출력이 아니라 다음 PE가 이어서 누적할 partial sum일 수 있습니다.",
            },
            {
              term: "Output-Stationary",
              description: "출력 하나의 partial sum을 PE에 고정하고 A·B 항을 그 위에 누적합니다.",
              example: "C₀₀는 D₀₀=11에서 시작해 2×5를 더한 21, 다시 3×7을 더한 42가 됩니다.",
              boundary: "propagate 선택 전에도 다른 c 레지스터의 값은 out_c에 보일 수 있으므로, 단순히 '출력이 전혀 없다'고 말하면 안 됩니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="WS에서 weight 하나의 읽기 비용은 MAC 한 번당 얼마로 줄어듭니까"
          idea="같은 weight를 M개 출력 행에서 재사용하면 최초 w바이트 읽기를 M번의 MAC이 나눠 부담합니다. 따라서 MAC당 weight traffic은 w/M이고, weight 읽기만 분모로 잡은 비율은 2M/w FLOP/B입니다."
          formula={String.raw`T_{w/\mathrm{MAC}} = \frac{w}{M},\qquad R_w = \frac{2M}{w}`}
          annotatedFormula={String.raw`\underbrace{T_{w/\mathrm{MAC}}}_{\text{MAC당 weight bytes}} = \frac{\underbrace{w}_{\text{weight 1개 bytes}}}{\underbrace{M}_{\text{재사용한 output rows}}},\quad \underbrace{R_w}_{\text{weight-only FLOP/B}} = \frac{\underbrace{2M}_{\text{MAC }M\text{회}}}{\underbrace{w}_{\text{최초 weight read}}}`}
          operations={[
            { expression: "w/M", annotation: ["int8 weight이면 w=1B", "M=64개 출력 행이 나눠 부담하면 1/64B per MAC"] },
            { expression: "2M/w", annotation: ["MAC 한 번을 곱셈+덧셈 2 FLOP로 셈", "M=64, w=1이면 weight-only ratio는 128 FLOP/B"] },
          ]}
          terms={[
            { symbol: "M", name: "weight 재사용 출력 행 수", description: "같은 B[k,j]를 사용하는 서로 다른 output rows의 수" },
            { symbol: "w", name: "weight 원소 바이트 수", description: "int8 이면 1, bf16 이면 2" },
            { symbol: "R_w", name: "weight-only 비율", description: "activation·partial sum·scratchpad traffic을 제외하고 weight 읽기만 분모로 잡은 비교용 값" },
          ]}
          assumptions={["같은 weight가 M개 output rows 동안 교체되지 않고, MAC을 곱셈+덧셈 2 FLOP로 세며, 최초 weight read만 분모에 넣습니다"]}
          interpretation="M=64, int8이면 MAC당 weight 부담은 1/64B이고 R_w=128 FLOP/B입니다. 하지만 이것을 PE 전체 arithmetic intensity라고 부르면 안 됩니다. activation·partial sum 이동, scratchpad refill, DMA traffic이 빠져 있기 때문입니다."
        />
      </section>

      <section id="double-buffer" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">c1·c2는 출력 중인 값과 다음에 계산할 값을 겹쳐 보관합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OS에서 <code>prop=0</code>이면 c1이 compute하고 c2가 out_c 쪽에 놓입니다. <code>prop=1</code>이면
            c2가 compute하고 c1이 out_c 쪽에 놓입니다. 이 선택은 매 사이클 반드시 뒤집히는 것이 아닙니다.
            한 출력 구간 동안 유지되다가 다음 구간으로 넘어갈 때 바뀔 수 있습니다.
          </p>
          <p>
            <code>last_s</code>는 직전 유효 사이클의 prop을 저장하고, <code>flip</code>은 지금 prop과 달라졌는지 봅니다.
            flip인 첫 유효 사이클에만 <code>shift_offset=shift</code>가 됩니다. 소스는 이 값을 out_c에 right shift로
            적용하므로, 이를 근거 없이 “반올림”이라고 부르지 않고 출력 경계의 scaling shift라고 부르는 편이 정확합니다.
          </p>
        </div>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton
            label="이중 버퍼링과 flip"
            onClick={() => sidebar.open("double-buffer", codeRefs["double-buffer"])}
          />
        </div>
        <AlgorithmBlock
          title="prop 선택이 바뀐 첫 유효 사이클을 찾는 절차"
          input={["propagate 신호(prop)", "이 신호가 유효한지(valid)"]}
          steps={[
            { code: "last_s := RegEnable(prop, valid)", note: "valid 인 사이클에만 이전 prop 값을 저장합니다" },
            { code: "flip := (last_s =/= prop)", note: "저장된 선택과 지금 선택이 다르면 출력·계산 레지스터가 교대하는 경계입니다" },
            { code: "shift_offset := Mux(flip, shift, 0.U)", note: "경계의 out_c에만 right shift를 적용하고 같은 구간의 나머지 사이클에는 0을 씁니다" },
          ]}
          output="구간 경계에서 한 번만 scaling shift가 적용된 out_c 값"
        />
      </section>

      <section id="build" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공식 경로는 소프트웨어 빌드와 cycle-accurate simulator를 분리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 README의 현재 quick start는 Chipyard를 설치한 뒤 Gemmini software를 빌드하고, 별도로 Verilator
            simulator를 만드는 순서입니다. PE 한 칸의 custom harness는 가능한 추가 실습이지만 공식 quick start에
            포함된 명령처럼 섞어 쓰면 안 됩니다.
          </p>
        </div>
        <AlgorithmBlock
          title="공식 README 기준으로 Gemmini binary와 simulator를 준비하는 절차"
          input={["Chipyard dependency를 설치한 Linux 환경", "Gemmini pinned commit과 호환되는 Chipyard checkout"]}
          steps={[
            { code: "git clone https://github.com/ucb-bar/chipyard.git && cd chipyard && ./build-setup.sh && source env.sh", note: "Chipyard와 toolchain 환경을 준비합니다. 실제 재현 문서에서는 사용한 commit을 함께 고정합니다" },
            { code: "cd generators/gemmini && make -C software/libgemmini install", note: "Gemmini instruction을 이해하는 Spike extension을 설치합니다" },
            { code: "cd software/gemmini-rocc-tests && ./build.sh", note: "공식 bare-metal·Linux·proxy-kernel test binaries를 build 디렉터리에 만듭니다" },
            { code: "cd ../../../../sims/verilator && make debug CONFIG=GemminiRocketConfig", note: "파형을 남길 수 있는 cycle-accurate simulator와 generated Verilog를 만듭니다" },
            { code: "make CONFIG=GemminiRocketConfig run-binary BINARY=../../generators/gemmini/software/gemmini-rocc-tests/build/bareMetalC/template-baremetal", note: "작은 공식 binary를 simulator에서 실행한 뒤 PE-level custom harness는 별도 실험으로 추가합니다" },
          ]}
          output="공식 test binary와 GemminiRocketConfig cycle-accurate simulator"
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PE 혼자서는 곱셈기 하나일 뿐, 격자로 엮여야 행렬곱이 됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글이 다룬 것은 PE 한 칸의 내부뿐입니다. 실제 Gemmini 는 이 PE 를 격자로 늘어놓고 activation 은
            왼쪽에서 오른쪽으로, weight·partial sum 은 위에서 아래로 흘려보내는 배선(Mesh.scala)까지 갖춰야 비로소
            행렬곱을 계산합니다.
          </p>
          <p>
            앞서 구한 <code>R_w=2M/w</code>는 weight 읽기만 분모로 잡은 재사용 비율입니다. 칩 전체가 DDR·HBM에서
            실제로 읽는 바이트 수는 activation·partial sum과 Scratchpad(온칩 SRAM) refill까지 포함해야 합니다. 그 병목을 읽는
            방법은{" "}
            <Link to="/cs/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">
              GPU roofline 과 ridge point
            </Link>{" "}
            글에서 다룬 것과 같은 계산입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="고정 commit의 기본 설정에서 PE 몇 개가 격자를 이루는가"
          preview="commit 8c3f992의 defaultConfig는 16×16 = 256개 PE를 씁니다."
        >
          <p>
            <code>Configs.scala</code>의 defaultConfig는 meshRows=16, meshColumns=16,
            tileRows=tileColumns=1입니다. 따라서 Tile 하나에 PE 한 칸, 전체에는 256칸이 있습니다. dataflow 기본값은
            <code>Dataflow.BOTH</code>라 OS와 WS를 runtime 명령 설정으로 고를 수 있습니다. 이는 고정 commit의 기본값이지
            모든 Gemmini 생성물의 고정 규격은 아닙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="paper-gemmini" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">근거: Gemmini 는 DAC 2021 에서 발표된 UC Berkeley 의 오픈소스 생성기입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            DNN 가속기를 논문 아이디어 수준이 아니라 전체 SoC 안에서 평가하려면 프로그래밍 스택·메모리 시스템·공유
            자원까지 포함한 full-stack 통합이 필요합니다. Gemmini 는 이 통합을 Chipyard 생태계 위에서 자동으로
            만들어 주는 parameterizable generator 로 제안됐습니다.
          </p>
        </div>
        <CitationBlock
          source="Genc, Kim, Amid 외 · Gemmini: Enabling Systematic Deep-Learning Architecture Evaluation via Full-Stack Integration (DAC 2021)"
          citeKey={1}
          href="https://arxiv.org/abs/1911.09925"
        >
          RISC-V Rocket/BOOM 코어에 RoCC 로 붙는 systolic array 가속기를 설계 공간 전체에서 생성하고 고성능 CPU
          대비 최대 세 자릿수(orders-of-magnitude) 배 speedup 을 여러 DNN benchmark 에서 보였다고 저자들이
          보고합니다. 이 배수는 저자 자기보고이며 이 글은 그 성능 주장을 검증하지 않고 PE.scala 라는 실제 소스
          하나의 회로 구조만 다룹니다.
        </CitationBlock>
        <CitationBlock
          source="UC Berkeley Gemmini · PE.scala and README · commit 8c3f992"
          citeKey={2}
          href="https://github.com/ucb-bar/gemmini/blob/8c3f9923a44a2fe2c7930587be297d6d4f8c09ca/src/main/scala/gemmini/PE.scala"
        >
          본문의 포트 배선, c1·c2, prop·flip·shift는 이 commit의 PE.scala에 고정했습니다. Quick start와 OS·WS의
          A/B/D 흐름은 같은 commit의 README를 대조했습니다. 2026년 공개 issue에 mixed-precision OS 경로 논의가
          남아 있으므로 이 글의 수치 예는 기본 정수형 경로의 배선 설명으로 한정합니다.
        </CitationBlock>
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ gemmini: gemminiPeMacDataflowTree }}
        projectMetas={{
          gemmini: {
            id: "gemmini",
            label: "UC Berkeley Gemmini · Chisel",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </div>
  );
}
