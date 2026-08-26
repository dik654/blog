import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  CfdGpuMappingViz,
  FiniteVolumePipelineViz,
} from "./viz/CfdPipelineViz";

const NASA_NAVIER_STOKES =
  "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/navier-strokes-equation/";
const OPENFOAM_GUIDES = "https://openfoam.org/guides/";
const NASA_LAVA = "https://www.nas.nasa.gov/LAVA/introduction/";

export default function ModernCfdFiniteVolumeGpuArticle() {
  return (
    <article className="space-y-14">
      <section id="conservation" className="space-y-6">
        <span id="overview" className="block scroll-mt-20" aria-hidden="true" />
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            CFD starts from a balance sheet
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            CFD는 그림을 만드는 일이 아니라 보존 법칙을 격자 위에서 닫는 일이다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Computational Fluid Dynamics는 질량·운동량·에너지 보존식을 컴퓨터가
          풀 수 있는 유한한 상태와 연산으로 바꿉니다. 여기서는 압축성 유동의
          보존형 Navier–Stokes를 기준으로, finite volume discretization이 face
          flux를 어떻게 만들고 그 local stencil이 GPU memory traffic으로 어떻게
          이어지는지 봅니다.
        </p>
        <p>
          물리 model과 실행 최적화는 다른 층입니다. Flux 식이나 turbulence
          closure를 바꾸는 일은 계산 결과의 의미를 바꾸지만, 같은 face flux를
          더 coalesced하게 읽는 일은 같은 이산식을 더 효율적으로 실행하는
          후보입니다. 둘 모두 검증 없이 교환할 수 없습니다.
        </p>
        <ExplainedFormula
          question="Control volume 안 보존량은 무엇 때문에 변할까요?"
          idea={
            <>
              내부에 저장된 양의 시간 변화와 경계를 통과하는 순 flux를 더하면
              volume 내부 source와 같아야 합니다.
            </>
          }
          formula={String.raw`\frac{d}{dt}\int_{\Omega}U\,dV+\oint_{\partial\Omega}\mathbf F(U,\nabla U)\cdot\mathbf n\,dA=\int_{\Omega}S\,dV`}
          annotatedFormula={String.raw`\underbrace{\frac{d}{dt}\int_{\Omega}U\,dV}_{\text{cell 안 저장량 변화}}+\underbrace{\oint_{\partial\Omega}\mathbf F\cdot\mathbf n\,dA}_{\text{경계의 순 flux}}=\underbrace{\int_{\Omega}S\,dV}_{\text{volume source}}`}
          operations={[
            {
              expression: String.raw`\int_{\Omega}U\,dV`,
              annotation: ["Control volume 안", "질량·운동량·에너지를 적분"],
            },
            {
              expression: String.raw`\oint_{\partial\Omega}\mathbf F\cdot\mathbf n\,dA`,
              annotation: ["모든 face에서", "바깥 방향 flux를 합산"],
            },
          ]}
          terms={[
            {
              symbol: "U",
              name: "Conserved state",
              description: "예를 들어 밀도 ρ, 운동량 ρu, 총에너지 ρE입니다.",
            },
            {
              symbol: "F",
              name: "Physical flux",
              description: "Convective와 viscous/diffusive transport를 포함합니다.",
            },
            {
              symbol: "n",
              name: "Outward normal",
              description: "Control-volume face의 바깥 방향 단위 normal입니다.",
            },
            {
              symbol: "S",
              name: "Volume source",
              description: "Body force·reaction처럼 volume 내부에 작용하는 항입니다.",
            },
          ]}
          assumptions={[
            "Continuum model과 control volume 경계가 정의돼 있습니다.",
            "해당 보존 변수와 constitutive relation이 선택한 flow regime에 맞습니다.",
          ]}
          interpretation="닫힌 domain에서 source가 없고 boundary flux가 0이면 domain 전체 보존량은 변하지 않습니다. Discrete solver도 내부 face flux를 양쪽 cell에 반대 부호로 써야 이 cancellation을 보존합니다."
        />
        <div id="paper-nasa-navier-stokes">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="NASA Glenn · Navier–Stokes Equation"
            href={NASA_NAVIER_STOKES}
          >
            <p>
              <strong>근거 범위:</strong> Navier–Stokes가 mass, momentum,
              energy conservation equations로 구성되고 CFD가 이를 수치적으로
              근사한다는 물리적 출발점입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 한 turbulence model·discretization·
              solver가 모든 flow regime에 타당하다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
        <ContentBoundary article="cfd-finite-volume-gpu" />
      </section>

      <section id="finite-volume" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Finite volume
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Cell마다 같은 face flux를 반대 부호로 기록한다
          </h2>
        </header>
        <p>
          Finite volume method는 각 cell에서 보존식을 적분하고 Gauss theorem으로
          divergence를 face flux 합으로 바꿉니다. Face 하나를 공유하는 owner와
          neighbour cell은 같은 numerical flux를 각각 +와 −로 사용합니다. 이
          pairwise cancellation이 cell-local update와 domain-global conservation을
          연결합니다.
        </p>
        <FiniteVolumePipelineViz />
        <ExplainedFormula
          question="Cell i의 다음 conserved state는 어떻게 계산할까요?"
          idea={
            <>
              이전 저장량에 각 face의 numerical flux와 source가 만든 Δt 동안의
              변화를 더합니다.
            </>
          }
          formula={String.raw`U_i^{n+1}=U_i^n-\frac{\Delta t}{V_i}\sum_{f\in\partial i}\widehat F_f A_f+\Delta t\,S_i`}
          annotatedFormula={String.raw`U_i^{n+1}=\underbrace{U_i^n}_{\text{이전 cell state}}-\underbrace{\frac{\Delta t}{V_i}\sum_f\widehat F_fA_f}_{\text{face flux의 순 변화}}+\underbrace{\Delta tS_i}_{\text{source 변화}}`}
          operations={[
            {
              expression: String.raw`\sum_f\widehat F_fA_f`,
              annotation: ["Cell 경계 face마다", "방향을 포함한 numerical flux를 합산"],
            },
            {
              expression: String.raw`\frac{\Delta t}{V_i}\sum_f\widehat F_fA_f`,
              annotation: ["Flux 합을", "cell volume과 time step으로 state 변화량화"],
            },
          ]}
          terms={[
            {
              symbol: "V_i",
              name: "Cell volume",
              description: "Cell i가 나타내는 control-volume 크기입니다.",
            },
            {
              symbol: "A_f",
              name: "Face area",
              description: "Face flux를 통과량으로 바꾸는 면적입니다.",
            },
            {
              symbol: String.raw`\widehat F_f`,
              name: "Numerical face flux",
              description: "Face 양쪽 reconstructed states에서 계산한 이산 flux입니다.",
            },
            {
              symbol: String.raw`\Delta t`,
              name: "Time step",
              description: "이번 update가 전진하는 물리 시간입니다.",
            },
          ]}
          assumptions={[
            "표시는 explicit Euler 예이며 실제 solver는 multi-stage·implicit update를 사용할 수 있습니다.",
            "내부 face numerical flux는 두 cell에서 같은 값과 반대 방향으로 사용합니다.",
          ]}
          interpretation="Internal face contribution이 두 cell에서 상쇄되므로 global 변화는 physical boundary flux와 source만 남습니다. Face를 두 번 독립 계산해 값이 달라지면 conservation drift가 생길 수 있습니다."
        />
        <div id="paper-openfoam-fvm">
          <CitationBlock
            type="code"
            citeKey={2}
            source="OpenFOAM Foundation · Technical Guides"
            href={OPENFOAM_GUIDES}
          >
            <p>
              <strong>근거 범위:</strong> Finite-volume 기반 CFD와 OpenFOAM의
              equation·model·discretization guidance를 확인하는 공식 진입점입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 특정 fvSchemes 설정이 모든 mesh와
              flow에서 안정적·정확하다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="time-step" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · CFL budget</p>
          <h2 className="mt-2 text-2xl font-bold">
            GPU가 빨라도 explicit time step의 물리 거리 제한은 사라지지 않는다
          </h2>
        </header>
        <p>
          Explicit scheme에서 한 update가 참조하는 stencil보다 정보가 더 멀리
          이동하면 numerical domain of dependence가 physical propagation을 따라가지
          못할 수 있습니다. 단순한 1D 압축성 예에서는 local velocity와 sound speed의
          합을 cell length와 비교해 Courant number를 만듭니다.
        </p>
        <ExplainedFormula
          question="Target CFL에서 허용할 global time step은 어떻게 고를까요?"
          idea={
            <>
              각 cell의 가장 빠른 characteristic speed가 한 step 동안 cell 길이의
              몇 배를 이동하는지 계산하고, 모든 cell 중 가장 작은 허용값을 고릅니다.
            </>
          }
          formula={String.raw`C_i=\frac{(|u_i|+c_i)\Delta t}{\Delta x_i},\qquad \Delta t\le C_{target}\min_i\frac{\Delta x_i}{|u_i|+c_i}`}
          annotatedFormula={String.raw`C_i=\underbrace{(|u_i|+c_i)}_{\text{최대 local 파동 속도}}\underbrace{\frac{\Delta t}{\Delta x_i}}_{\text{step당 cell 길이 비}},\quad\Delta t\le\underbrace{C_{target}\min_i\frac{\Delta x_i}{|u_i|+c_i}}_{\text{global explicit step}}`}
          operations={[
            {
              expression: String.raw`\frac{\Delta x_i}{|u_i|+c_i}`,
              annotation: ["Cell 길이를", "local characteristic speed로 나눠 travel time 계산"],
            },
            {
              expression: String.raw`\min_i`,
              annotation: ["모든 cells 중", "가장 제한적인 허용 step을 선택"],
            },
          ]}
          terms={[
            {
              symbol: "u_i",
              name: "Flow velocity",
              description: "Cell i의 단순화한 유동 속도입니다.",
            },
            {
              symbol: "c_i",
              name: "Sound speed",
              description: "압축성 유동의 local acoustic propagation speed입니다.",
            },
            {
              symbol: String.raw`\Delta x_i`,
              name: "Cell length scale",
              description: "Propagation 방향의 유효 격자 길이입니다.",
            },
            {
              symbol: "C_{target}",
              name: "Target Courant number",
              description: "Scheme·dimension·mesh에 맞춰 검증한 운영 상한입니다.",
            },
          ]}
          assumptions={[
            "단순한 1D compressible explicit update의 설명식이며 실제 spectral radius와 geometry는 더 복잡할 수 있습니다.",
            "Ctarget은 scheme·boundary·mesh quality에 귀속하며 보편 상수가 아닙니다.",
          ]}
          interpretation="가장 작은 cell 또는 가장 빠른 local wave가 global step을 제한합니다. Kernel throughput을 두 배로 만들어도 같은 physical duration을 풀기 위한 step 수는 CFL 조건 때문에 그대로일 수 있습니다."
        />
      </section>

      <section id="gpu-mapping" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · GPU mapping
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Cell loop는 병렬이지만 face gather와 global coupling이 병목을 정한다
          </h2>
        </header>
        <p>
          Structured mesh의 regular stencil은 이웃 offset이 예측 가능하지만,
          unstructured mesh는 face owner/neighbour connectivity를 따라 indirect gather를
          수행합니다. Cell-centered fields를 Structure of Arrays로 연속 배치해도
          face 순서와 neighbour index가 흩어져 있으면 transaction과 cache reuse가
          나빠질 수 있습니다.
        </p>
        <CfdGpuMappingViz />
        <p>
          Flux와 residual을 fuse하면 face state의 HBM round trip을 줄일 수 있지만
          reconstruction temporary·register·shared-memory lifetime이 늘어날 수
          있습니다. 따라서
          <a className="mx-1 text-primary hover:underline" href="/gpu/cuda-kernel-fusion">
            fusion boundary
          </a>
          와
          <a className="mx-1 text-primary hover:underline" href="/gpu/cuda-register-pressure">
            register pressure
          </a>
          를 재사용합니다. Multi-GPU에서는 halo exchange와 interior cells 계산을
          overlap할 수 있지만 partition boundary와 global reductions는 별도
          communication critical path입니다.
        </p>
        <div id="paper-nasa-lava">
          <CitationBlock
            type="code"
            citeKey={3}
            source="NASA Ames · LAVA CFD framework"
            href={NASA_LAVA}
          >
            <p>
              <strong>근거 범위:</strong> Finite difference·finite volume을 포함한
              실제 NASA CFD/multiphysics solver family와 preprocessing·grid·solver
              scope입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 이 글의 GPU mapping이 LAVA의 exact
              implementation 또는 benchmark 결과를 재현한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="verification" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Verification before speed
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            잔차가 줄었다, 정답이다, 현실과 맞다는 서로 다른 주장이다
          </h2>
        </header>
        <p>
          <strong>Code verification</strong>은 구현이 선택한 이산식을 올바르게
          계산하는지 보고, <strong>solution verification</strong>은 mesh·time-step
          refinement와 discretization uncertainty를 봅니다. <strong>Validation</strong>
          은 별도 실험 data와 비교해 선택한 물리 model이 target reality를 설명하는지
          묻습니다. Residual convergence 하나로 세 주장을 합치지 않습니다.
        </p>
        <ul className="space-y-3 pl-5 text-sm leading-7">
          <li>
            <strong>Conservation:</strong> Internal face contribution이 owner와
            neighbour에서 bitwise 또는 tolerance 안에서 반대인지 검사합니다.
          </li>
          <li>
            <strong>Order:</strong> Analytic/manufactured solution에서 h, h/2, h/4
            error가 기대한 convergence order로 줄어드는지 봅니다.
          </li>
          <li>
            <strong>CPU/GPU parity:</strong> 같은 mesh·scheme·iteration boundary에서
            conserved totals와 field norms를 비교하고 reduction order tolerance를
            명시합니다.
          </li>
          <li>
            <strong>Performance:</strong> Cell updates/s만이 아니라 physical-time
            solution까지의 wall time, HBM traffic, halo·reduction time과 memory를
            기록합니다.
          </li>
        </ul>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> 고정한 equation,
          mesh, boundary condition, precision과 solver tolerance에서 conservation,
          analytic/manufactured case, refinement order, experiment validation을 먼저
          통과합니다. 그 뒤 CPU/GPU field parity와 동일 residual 기준의
          time-to-solution, HBM·communication breakdown을 비교하며 실패 시 이전
          discretization 또는 kernel boundary로 rollback합니다.
        </aside>
      </section>
    </article>
  );
}
