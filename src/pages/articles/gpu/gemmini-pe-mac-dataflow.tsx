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
 * PE 한 칸: MAC 을 이중 레지스터로 감싸 데이터플로우를 전환합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 실제 소스: UC Berkeley Gemmini (github.com/ucb-bar/gemmini) src/main/scala/gemmini/PE.scala
 */
export default function GemminiPeMacDataflowArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PE 한 칸은 시스톨릭 배열 전체가 반복하는 재사용의 최소 단위입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Gemmini 의 systolic array(시스톨릭 배열)는 특별한 회로가 아니라 PE(processing element, 처리 요소) 한 칸을
            격자 모양으로 수백 번 복제한 것입니다. PE 한 칸이 곱셈+누산(MAC)을 한 사이클에 처리하고 그 결과를 이웃
            PE 로 흘려보내는 규칙만 알면, 16×16 이든 32×32 든 같은 규칙이 반복될 뿐입니다.
          </p>
          <p>
            이 반복이 중요한 이유는 roofline 에서 이미 본 arithmetic intensity(연산 강도, 메모리에서 읽은 1바이트당
            연산 횟수) 때문입니다. 이 비율이 낮으면 memory-bound, 높으면 compute-bound 로 갈립니다. PE 한 칸의
            dataflow — weight 를 고정할지 partial sum(누적 중인 출력)을 고정할지 — 가 바로 이 재사용 횟수를 정하는
            스위치입니다.
          </p>
          <p>
            이 글은 실제 Gemmini 저장소의 PE.scala 파일 하나만 놓고, MacUnit 이라는 원자 연산부터
            Weight-/Output-Stationary 전환, 그리고 그 전환을 끊기지 않게 만드는 이중 레지스터까지 따라갑니다.
          </p>
        </div>
        <GemminiPeMacDataflowViz />
        <ContentBoundary article="gemmini-pe-mac-dataflow" />
      </section>

      <section id="mac-unit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">MacUnit 은 곱셈과 누산을 한 사이클에 묶은 원자 연산입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            PE 안에서 실제로 값을 계산하는 부분은 MacUnit 이라는 별도 module 하나뿐입니다.{" "}
            <code>io.out_d := io.in_c.mac(io.in_a, io.in_b)</code> — in_c(누적 중인 값)에 in_a(activation)와
            in_b(weight)의 곱을 더한 값을 반환합니다. PE 전체 로직이 복잡해 보여도 실제 연산은 이 한 줄뿐입니다.
          </p>
          <p>
            MacUnit 을 별도로 뗀 이유는 dataflow 전환 때문입니다. Weight-Stationary 와 Output-Stationary 는 mac_unit
            에 넣는 입력의 배선만 다르고 연산 자체는 같습니다. 회로 합성 도구가 이를 눈치채지 못하면 곱셈기를 두 벌
            만들어 칩 면적을 낭비할 수 있어, Gemmini 는 module 하나로 재사용을 강제합니다.
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
            MacUnit 혼자서는 곱셈기 하나에 불과합니다. 그 앞뒤로 어떤 값을 넣고 뺄지 정하는 것이 PE 본체의 dataflow
            로직이고, 다음 절에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="dataflow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Weight-Stationary 는 weight 를, Output-Stationary 는 partial sum 을 PE 에 고정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            PEControl.dataflow 한 비트가 이 PE 가 무엇을 고정할지 정합니다. Weight-Stationary(WS)는 weight 를 PE
            레지스터에 붙박아 두고 activation 만 흘려보내며, Output-Stationary(OS)는 반대로 partial sum 을 붙박아
            두고 weight 와 activation 을 함께 흘려보냅니다.
          </p>
          <p>
            WS 분기에서는 mac_unit.io.in_b(고정 weight 로 씀)에 레지스터 값을, mac_unit.io.in_c(누적 대상)에 옆에서
            들어온 activation 을 넣습니다. 결과는 out_b 로 즉시 다음 PE 에 넘어가고 이 PE 안에는 남지 않습니다 —
            weight 하나가 activation 이 흐르는 사이클 수만큼 반복해서 곱해지는 재사용이 여기서 일어납니다.
          </p>
          <p>
            OS 분기는 정반대로, mac_unit.io.in_c(누적 대상)에 레지스터 값을 넣고 weight 는 in_b 로 흘려보내기만
            합니다. 값이 이 PE 안에서 계속 쌓이다가 propagate 신호가 켜졌을 때만 out_c 로 빠져나갑니다.
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
              description: "weight 를 PE 에 고정하고 activation 이 흐르는 동안 매 사이클 재사용합니다.",
              example: "K 사이클 동안 activation 이 흐르면 같은 weight 로 K 번 MAC 을 수행합니다.",
              boundary: "다른 출력 채널로 넘어갈 때마다 weight 를 새로 로드해야 합니다.",
            },
            {
              term: "Output-Stationary",
              description: "partial sum 을 PE 에 고정하고 weight·activation 이 함께 흘러 그 위에 누적됩니다.",
              example: "reduction 차원 전체를 더할 때까지 값이 이 PE 를 벗어나지 않습니다.",
              boundary: "누적이 끝나기 전에는 out_c 로 아무 것도 나가지 않아 첫 결과까지의 지연이 더 깁니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="Weight-Stationary PE 한 칸은 weight 를 한 번 읽고 몇 번 재사용합니까"
          idea="weight 가 K 사이클 동안 레지스터에 고정된 채 매 사이클 새 activation 과 곱해지므로, 메모리 접근 1회 대비 연산 K 회의 비율이 그 PE 만의 국소 arithmetic intensity 입니다."
          formula={String.raw`I_{PE} = \frac{2K}{w}`}
          annotatedFormula={String.raw`I_{PE} = \frac{\underbrace{2K}_{\text{곱셈+누산}\;K\text{회}}}{\underbrace{w}_{\text{weight 1개, 최초 1회만 읽음}}}`}
          operations={[
            { expression: "2K", annotation: ["곱셈 K 번 + 누산 K 번 = 2K FLOP", "매 사이클 새 activation 과 mac"] },
            { expression: "w", annotation: ["weight 1개를 최초 1회만 읽음", "이후 K 사이클 동안 레지스터에서 재사용"] },
          ]}
          terms={[
            { symbol: "K", name: "공유 차원 길이", description: "이 PE 를 통과하는 activation 스트림의 사이클 수(행렬의 reduction 차원)" },
            { symbol: "w", name: "weight 원소 바이트 수", description: "int8 이면 1, bf16 이면 2" },
          ]}
          assumptions={["이 weight 가 K 사이클 내내 flip 없이 고정돼 있다고 가정합니다(같은 행렬곱 안)"]}
          interpretation="K 가 커질수록(긴 행렬을 한 weight 로 통과시킬수록) I_PE 가 선형으로 오르고, 이는 roofline 에서 오른쪽(compute-bound)으로 이동한다는 뜻입니다. 다만 이건 PE 한 칸의 국소 재사용이고, 칩 전체가 DDR·HBM 에서 실제로 읽는 트래픽은 Mesh 전체와 Scratchpad 정책까지 봐야 합니다."
        />
      </section>

      <section id="double-buffer" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">c1·c2 이중 레지스터가 지금 나가는 값과 다음에 쌓일 값을 동시에 붙잡습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            PE 는 레지스터를 하나가 아니라 c1, c2 두 개 둡니다. 한쪽이 propagate(밖으로 내보내는 중)이면 다른 쪽은
            compute(계속 누적 중)입니다. 매 사이클 이 역할이 뒤집힐 수 있는데, 뒤집히는 순간을 회로가 놓치지 않아야
            파이프라인이 끊기지 않습니다.
          </p>
          <p>
            last_s 는 한 사이클 전의 propagate 값을 저장해 두고, flip 은 그 값이 지금 값과 다른지를 봅니다. flip 이
            참인 사이클, 즉 역할이 막 뒤집힌 그 순간에만 shift(반올림 자리수)를 적용하고 나머지 사이클에는 0 을
            씁니다 — 매 사이클 shift 를 적용하면 같은 값을 여러 번 깎는 실수가 생기기 때문입니다.
          </p>
        </div>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton
            label="이중 버퍼링과 flip"
            onClick={() => sidebar.open("double-buffer", codeRefs["double-buffer"])}
          />
        </div>
        <AlgorithmBlock
          title="한 사이클 동안 flip 을 판정하는 절차"
          input={["propagate 신호(prop)", "이 신호가 유효한지(valid)"]}
          steps={[
            { code: "last_s := RegEnable(prop, valid)", note: "valid 인 사이클에만 이전 prop 값을 저장합니다" },
            { code: "flip := (last_s =/= prop)", note: "저장된 값과 지금 값이 다르면 역할이 막 뒤집힌 첫 사이클입니다" },
            { code: "shift_offset := Mux(flip, shift, 0.U)", note: "뒤집힌 사이클에만 반올림을 적용하고 그 외는 0을 씁니다" },
          ]}
          output="정확히 한 번만 반올림이 적용된 out_c 값"
        />
      </section>

      <section id="build" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PE 하나를 직접 poke·peek 해 보면 두 dataflow 전환이 눈에 보입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Gemmini 저장소에는 Mesh 전체를 검증하는 MeshWithDelaysUnitTest 는 있지만, PE 한 칸만 떼어 테스트하는
            파일은 없습니다. 이 글이 다룬 WS·OS 전환을 직접 눈으로 확인하려면 그 자리를 스스로 채우는 것이 가장 빠른
            실습입니다. 아래는 그 실습을 포함해 Chipyard 환경에서 Gemmini 를 처음 받아 시뮬레이션까지 돌리는
            절차입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Chipyard 로 Gemmini 를 받아 PE·SoC 시뮬레이션까지"
          input={["Scala 2.13 + sbt", "RISC-V 툴체인(Chipyard build-setup.sh 가 함께 설치)"]}
          steps={[
            { code: "git clone https://github.com/ucb-bar/chipyard && cd chipyard && ./build-setup.sh", note: "Chipyard 가 generators/gemmini 서브모듈로 Gemmini 소스를 받아옵니다" },
            { code: "cd generators/gemmini && sbt test", note: "저장소에 이미 있는 MeshWithDelaysUnitTest 같은 PeekPokeTester 기반 단위 테스트가 먼저 통과하는지 확인합니다" },
            { code: "직접 PETester.scala 를 작성해 PE 하나에 in_a·in_b·in_d 를 poke 하고 dataflow 를 OS→WS 로 바꿔 out_c 를 peek", note: "저장소에 없는 부분이라 이 글이 다룬 두 dataflow 전환을 직접 검증하는 첫 실습입니다" },
            { code: "cd ../../sims/verilator && make CONFIG=GemminiRocketConfig", note: "PE 154줄이 16×16 Mesh 로 엮인 전체 SoC 를 사이클 단위로 시뮬레이션할 Verilog 를 생성합니다" },
          ]}
          output="PE 하나의 동작을 확인한 파형(.vcd)과, 그 PE 256개가 실제 RISC-V SoC 안에서 도는 cycle-accurate 시뮬레이터"
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PE 혼자서는 곱셈기 하나일 뿐, 격자로 엮여야 행렬곱이 됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글이 다룬 것은 PE 한 칸의 내부뿐입니다. 실제 Gemmini 는 이 PE 를 격자로 늘어놓고, activation 은
            왼쪽에서 오른쪽으로, weight·partial sum 은 위에서 아래로 흘려보내는 배선(Mesh.scala)까지 갖춰야 비로소
            행렬곱을 계산합니다.
          </p>
          <p>
            앞서 구한 I_PE = 2K/w 는 PE 하나의 국소적인 재사용일 뿐입니다. 칩 전체가 DDR·HBM 에서 실제로 읽는 바이트
            수는 Scratchpad(온칩 SRAM)가 weight 를 얼마나 오래 들고 있는지에 따라 또 달라지며, 그 병목의 읽는
            방법은{" "}
            <Link to="/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">
              GPU roofline 과 ridge point
            </Link>{" "}
            글에서 다룬 것과 같은 계산입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Gemmini 기본 설정에서 PE 몇 개가 격자를 이루는가"
          preview="기본 GemminiRocketConfig 는 16×16 = 256개 PE 를 씁니다."
        >
          <p>
            Configs.scala 의 defaultConfig 는 meshRows=16, meshColumns=16, tileRows=tileColumns=1 로 둬 Tile 하나가
            PE 정확히 1개가 됩니다. 다른 프로파일(chipConfig)은 32×32 까지도 쓰고, dataflow 기본값은
            Dataflow.BOTH — 이 글에서 본 두 분기를 명령어 단위로 실행 중에 골라 쓸 수 있다는 뜻입니다.
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
          RISC-V Rocket/BOOM 코어에 RoCC 로 붙는 systolic array 가속기를 설계 공간 전체에서 생성하고, 고성능 CPU
          대비 최대 세 자릿수(orders-of-magnitude) 배 speedup 을 여러 DNN benchmark 에서 보였다고 저자들이
          보고합니다. 이 배수는 저자 자기보고이며 이 글은 그 성능 주장을 검증하지 않고, PE.scala 라는 실제 소스
          하나의 회로 구조만 다룹니다.
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
