import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import DescentDynamicsViz from "./DescentDynamicsViz";

const MIT = "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/";
const BOYD = "https://web.stanford.edu/~boyd/cvxbook/";

export default function GradientDescentConvergenceArticle() {
  return <article className="space-y-16">
    <section id="overview" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">00 · 반복 규칙</p><h2 className="mt-2 text-2xl font-bold">Gradient descent는 현재 slope의 반대 방향과 step size로 다음 위치를 만드는 반복이다</h2></header>
      <p className="text-lg leading-8">
            Gradient는 현재 위치에서 가장 빠른 증가 방향을 알려 줍니다. 그 반대로 가면 아주 작은 범위에서는 objective가 줄지만 얼마나 멀리 가도 되는지는 별개의
            질문입니다. Algorithm은 direction·step·stopping rule을 함께 가져야 합니다.
          </p>
      <Term name="Gradient descent" shape="xₜ₊₁=xₜ−η∇f(xₜ)" meaning="현재 gradient의 반대 방향으로 반복 이동하는 first-order method입니다." example="f=x²/2, x₀=4, η=0.5이면 4→2→1입니다." boundary="Constraint·nondifferentiability·stochastic noise는 이 기본 update 밖의 추가 처리가 필요합니다." />
      <Term name="Learning rate" shape="η>0" meaning="Descent direction을 실제 이동 거리로 바꾸는 보폭입니다." example="같은 gradient에서도 η=0.5는 수축하고 η=3은 발산합니다." boundary="같은 숫자도 parameter scale과 optimizer state가 다르면 다른 update magnitude를 만듭니다." />
      <DescentDynamicsViz />
    </section>

    <section id="update" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 방향과 거리 조합</p><h2 className="mt-2 text-2xl font-bold">Negative gradient는 방향을 정하고 learning rate는 그 방향을 얼마나 믿을지 정한다</h2></header>
      <ExplainedFormula
        question="f(x)=x²/2에서 한 step update가 왜 (1−η)x가 될까요?"
        idea={<>Derivative가 x이므로 현재 위치에서 빼야 할 direction 크기도 x입니다. Learning rate η는 그 correction을 일부만 적용할지, 정확히 적용할지, 지나쳐 적용할지 정합니다.</>}
        formula={String.raw`x_{t+1}=x_t-\eta\nabla f(x_t)=(1-\eta)x_t`}
        annotatedFormula={String.raw`\begin{aligned}g_t&=\underbrace{\nabla f(x_t)}_{\text{현재 증가 방향}}=x_t\\[4pt]x_{t+1}&=\underbrace{x_t}_{\text{현재 위치}}-\underbrace{\eta g_t}_{\substack{\text{반대 방향으로}\text{적용할 correction}}}\\[4pt]&=\underbrace{(1-\eta)x_t}_{\text{한 step 수축 또는 확대}}\end{aligned}`}
        operations={[{ expression: String.raw`-\nabla f`, annotation: ["가장 빠른 증가 방향의", "부호를 바꿔 local descent direction 선택"] }, { expression: String.raw`\eta g_t`, annotation: ["방향 벡터에 보폭을 곱해", "실제 parameter 이동량 생성"] }, { expression: String.raw`(1-\eta)x_t`, annotation: ["현재 위치와 correction을 합쳐", "다음 iterate의 scale factor 확인"] }]}
        terms={[{ symbol: "g_t", name: "Current gradient", description: "현재 iterate에서 평가한 slope입니다." }, { symbol: String.raw`\eta`, name: "Learning rate", description: "Correction의 scalar 크기입니다." }]}
        assumptions={["Unconstrained differentiable scalar quadratic입니다.", "Negative gradient가 local descent라는 사실은 arbitrary large η의 감소를 보장하지 않습니다."]}
        interpretation="η가 0에 가까우면 천천히 움직이고, η=1이면 한 step에 0으로 가며, η가 2 이상이면 수축 조건을 잃습니다."
      />
    </section>

    <section id="step-size" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 수축 조건</p><h2 className="mt-2 text-2xl font-bold">Quadratic에서는 반복 배율의 절댓값이 1보다 작을 때만 거리가 줄어든다</h2></header>
      <ExplainedFormula
        question="η=0.5, 2, 3의 경로가 다른 이유를 반복 배율 하나로 어떻게 읽을까요?"
        idea={<>한 step 식을 t번 반복하면 초기 위치에 (1−η)를 t번 곱합니다. 절댓값이 1보다 작아야 크기가 줄고, 음수이면 좌우를 번갈아 오갑니다.</>}
        formula={String.raw`x_t=(1-\eta)^t x_0`}
        annotatedFormula={String.raw`\begin{aligned}x_t&=\underbrace{(1-\eta)^t}_{\substack{\text{같은 step 배율을}\\t\text{번 누적}}}\underbrace{x_0}_{\text{초기 위치}}\\[5pt]|1-\eta|&\underbrace{<1}_{\text{거리 수축 조건}}\end{aligned}`}
        operations={[{ expression: String.raw`(1-\eta)^t`, annotation: ["한 step의 scale factor를", "매 반복마다 곱해 전체 경로 계산"] }, { expression: String.raw`|1-\eta|<1`, annotation: ["부호가 바뀌는 경우까지 포함해", "distance magnitude가 줄어드는지 판정"] }]}
        terms={[{ symbol: "t", name: "Iteration count", description: "Update를 적용한 횟수입니다." }, { symbol: String.raw`|1-\eta|`, name: "Contraction factor", description: "이 quadratic에서 한 step 뒤 거리 비율입니다." }]}
        assumptions={["f(x)=x²/2인 1차원 quadratic의 exact recurrence입니다.", "다른 curvature에서는 안정 구간이 L에 따라 바뀝니다."]}
        interpretation="η=0.5는 factor 0.5, η=2는 −1, η=3은 −2이므로 각각 수축·진동·발산합니다."
      />
      <Term name="Descent lemma application" shape="η=1/L" meaning="L-smooth objective에서 curvature allowance를 이길 만큼 작은 표준 fixed step입니다." example="d=−∇f/L을 넣으면 objective가 gradient norm square만큼 줄어듭니다." boundary="1/L은 모든 문제의 최적 learning rate가 아니라 theorem을 읽기 위한 안전 기준입니다." />
    </section>

    <section id="convergence" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 전제에서 결론으로</p><h2 className="mt-2 text-2xl font-bold">Convergence guarantee는 algorithm 이름이 아니라 함수 구조·step·gradient 조건을 묶은 문장이다</h2></header>
      <Term name="Convergence guarantee" shape="gapₜ≤bound(t)" meaning="몇 step 뒤 optimum과의 차이가 얼마나 작아지는지 전제와 함께 제한합니다." example="μ-strong convex·L-smooth이면 gap이 geometric factor로 줄어듭니다." boundary="Upper bound가 실제 경로와 같거나 deep network global optimum을 보장한다는 뜻이 아닙니다." />
      <ExplainedFormula
        question="μ-strongly convex·L-smooth에서 η=1/L이면 objective gap이 왜 줄어들까요?"
        idea={<>Smoothness가 한 step 감소를 보장하고 strong convexity가 현재 gradient 크기를 objective gap과 연결합니다. 두 inequality를 이어 매 step contraction factor를 얻습니다.</>}
        formula={String.raw`\Delta_t\le\left(1-\frac\mu L\right)^t\Delta_0`}
        annotatedFormula={String.raw`\begin{aligned}\Delta_t&=\underbrace{f(x_t)-f(x^*)}_{\text{현재 objective gap}}\\[4pt]\Delta_t&\le\underbrace{\left(1-\frac\mu L\right)^t}_{\substack{\text{curvature 비율이 만든}\\\text{반복 contraction}}}\underbrace{\Delta_0}_{\text{초기 gap}}\end{aligned}`}
        operations={[{ expression: String.raw`\mu/L`, annotation: ["최소 curvature를 최대 curvature로 나눠", "한 step에 확보할 progress scale 계산"] }, { expression: String.raw`1-\mu/L`, annotation: ["현재 gap에서 progress fraction을 빼", "남을 수 있는 gap의 비율 계산"] }, { expression: String.raw`(1-\mu/L)^t`, annotation: ["같은 upper-bound factor를", "t번 곱해 반복 bound 생성"] }]}
        terms={[{ symbol: String.raw`\Delta_t`, name: "Objective gap", description: "현재 objective와 optimal value의 차이입니다." }, { symbol: "L", name: "Smoothness upper scale", description: "가장 급한 curvature 방향의 상한입니다." }, { symbol: String.raw`\mu`, name: "Strong-convexity lower scale", description: "가장 평평한 방향의 최소 curvature입니다." }]}
        assumptions={["전역 μ-strong convexity·L-smoothness, exact full gradient, η=1/L입니다.", "0<μ≤L이고 minimizer가 존재합니다."]}
        interpretation="L/μ가 클수록 contraction factor가 1에 가까워져 같은 fixed-step method의 bound가 느려집니다."
      />
    </section>

    <section id="stopping-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · 멈춤과 성공을 분리</p><h2 className="mt-2 text-2xl font-bold">Small gradient는 stationary signal이고 global optimum·generalization·release evidence는 별도다</h2></header>
      <Term name="Stationary point" shape="∇f(x)=0" meaning="First-order로 어느 coordinate 방향에도 즉시 내려갈 slope가 보이지 않는 점입니다." example="x²의 0은 minimum, −x²의 0은 maximum, x²−y²의 원점은 saddle입니다." boundary="Nonconvex 문제에서 stationary point는 global minimizer와 동의어가 아닙니다." />
      <Term name="Stopping signal" shape="gradient · update · budget" meaning="반복을 끝낼지 결정하기 위해 관측하는 계산 가능한 신호입니다." example="‖∇f‖≤εg, ‖Δx‖≤εx 또는 time budget 소진을 함께 기록합니다." boundary="Training stop과 model release는 다릅니다. Validation·safety·resource evidence가 따로 필요합니다." />
      <ExplainedFormula
        question="왜 gradient norm 하나만 보지 않고 update와 budget을 함께 기록할까요?"
        idea={<>Small gradient는 flat scale이나 saddle에서도 나올 수 있고, tiny learning rate는 gradient가 커도 update를 작게 만듭니다. 서로 다른 신호를 분리해야 멈춘 이유를 재현할 수 있습니다.</>}
        formula={String.raw`\lVert\nabla f(x_t)\rVert\le\varepsilon_g\quad\lor\quad\lVert x_{t+1}-x_t\rVert\le\varepsilon_x\quad\lor\quad t=T`}
        annotatedFormula={String.raw`\begin{aligned}\underbrace{\lVert\nabla f(x_t)\rVert\le\varepsilon_g}_{\text{first-order slope가 작음}}\quad&\lor\\\underbrace{\lVert x_{t+1}-x_t\rVert\le\varepsilon_x}_{\text{실제 update가 작음}}\quad&\lor\\\underbrace{t=T}_{\text{반복 budget 소진}}&\end{aligned}`}
        operations={[{ expression: String.raw`\lVert\nabla f\rVert`, annotation: ["coordinate slope를 norm으로 묶어", "first-order stationary proximity 측정"] }, { expression: String.raw`\lVert x_{t+1}-x_t\rVert`, annotation: ["실제 두 iterate를 빼고 norm을 취해", "optimizer가 움직인 크기 측정"] }, { expression: String.raw`\lor`, annotation: ["서로 다른 stop reason 중", "어느 조건이 발동했는지 receipt에 보존"] }]}
        terms={[{ symbol: String.raw`\varepsilon_g`, name: "Gradient tolerance", description: "Slope가 충분히 작다고 보는 threshold입니다." }, { symbol: String.raw`\varepsilon_x`, name: "Update tolerance", description: "실제 이동이 충분히 작다고 보는 threshold입니다." }, { symbol: "T", name: "Iteration budget", description: "허용한 최대 update 횟수입니다." }]}
        assumptions={["각 norm·threshold의 단위와 reduction을 고정합니다.", "OR로 멈췄다는 사실은 validation success나 global optimality를 증명하지 않습니다."]}
        interpretation="Stop receipt에는 어떤 조건이 언제 발동했는지 남기고, release gate에서는 validation·numerical stability·wall-clock·memory를 별도로 평가합니다."
      />
      <div id="paper-gradient-descent"><CitationBlock source="MIT 18.065 · Gradient Descent" citeKey={1} href={MIT}><Evidence problem="Quadratic objective에서 direction·step size·curvature가 반복 경로를 만드는 방식" contribution="Gradient descent와 zig-zag·convergence intuition을 level-set geometry로 설명" assumptions="강의의 differentiable quadratic과 stated step 조건" scope="First-order descent의 입문 계산·기하" notClaim="모든 neural-network training의 global convergence 보장이 아님" /></CitationBlock></div>
      <div id="paper-convergence-theory"><CitationBlock source="Boyd & Vandenberghe · Convex Optimization" citeKey={2} href={BOYD}><Evidence problem="Optimization theorem의 함수 구조·algorithm·step 전제를 분리하는 문제" contribution="Convex·smooth objective에서 descent method의 bound를 체계화" assumptions="각 theorem의 convexity·smoothness·feasibility 조건" scope="Convex first-order convergence analysis" notClaim="Small gradient가 nonconvex global optimum이나 deployment quality를 보장하지 않음" /></CitationBlock></div>
      <ContentBoundary article="math-gradient-descent-convergence" />
    </section>
  </article>;
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
