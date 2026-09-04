import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import CurvatureShapeViz from "./CurvatureShapeViz";

const BOYD = "https://web.stanford.edu/~boyd/cvxbook/";
const MIT = "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/";

export default function OptimizationGeometryArticle() {
  return <article className="space-y-16">
    <section id="overview" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">00 · 함수의 지형</p><h2 className="mt-2 text-2xl font-bold">Convexity와 smoothness는 optimizer가 아니라 objective에 붙는 구조 조건이다</h2></header>
      <p className="text-lg leading-8">
            Objective와 feasible set을 정했다고 바로 빠른 algorithm이 나오는 것은 아닙니다. 이제 함수의 두 점 사이가 어떻게 굽는지, slope가 얼마나 빨리
            바뀌는지, 바닥 주변이 얼마나 평평한지를 묻습니다. 이 조건들이 뒤 글의 convergence theorem에 들어갈 전제가 됩니다.
          </p>
      <Term name="Convex function" shape="graph ≤ every chord" meaning="두 graph point 사이에서 함수가 그 둘을 잇는 직선보다 위로 솟지 않습니다." example="x²은 convex이고 −x²은 concave입니다." boundary="그릇처럼 보이는 한 그림이 아니라 모든 두 점과 혼합 비율에서 확인합니다." />
      <CurvatureShapeViz />
    </section>

    <section id="convexity" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 두 점을 섞기</p><h2 className="mt-2 text-2xl font-bold">Convexity inequality는 입력을 섞은 결과와 함수값을 섞은 chord를 비교한다</h2></header>
      <ExplainedFormula
        question="왜 x²의 두 점 사이에서 곡선이 chord 아래에 있을까요?"
        idea={<>입력 x와 y를 비율 λ로 섞은 뒤 함수에 넣은 값과, 두 함수값을 같은 비율로 섞은 값을 비교합니다. 둘의 차이가 square이므로 음수가 될 수 없습니다.</>}
        formula={String.raw`f(\lambda x+(1-\lambda)y)\le\lambda f(x)+(1-\lambda)f(y)`}
        annotatedFormula={String.raw`\begin{aligned}z&=\underbrace{\lambda x+(1-\lambda)y}_{\text{입력을 같은 비율로 혼합}}\\[4pt]f(z)&\le\underbrace{\lambda f(x)+(1-\lambda)f(y)}_{\text{두 함수값을 잇는 chord}}\\[4pt]\text{gap}&=\underbrace{\lambda(1-\lambda)(x-y)^2}_{\text{항상 0 이상인 square gap}}\end{aligned}`}
        operations={[{ expression: String.raw`\lambda x+(1-\lambda)y`, annotation: ["두 입력 사이 위치를", "하나의 mixing weight로 선택"] }, { expression: String.raw`\lambda f(x)+(1-\lambda)f(y)`, annotation: ["두 graph point를", "직선 높이로 보간"] }, { expression: String.raw`\lambda(1-\lambda)(x-y)^2`, annotation: ["chord와 제곱 함수 graph의 차이를", "음수가 될 수 없는 square로 검산"] }]}
        terms={[{ symbol: String.raw`\lambda`, name: "Mixing weight", description: "0과 1 사이에서 두 점의 비율을 정합니다." }, { symbol: "z", name: "Mixed input", description: "두 입력을 잇는 선분 위의 점입니다." }]}
        assumptions={["Domain 자체가 convex set이고 λ∈[0,1]입니다.", "Inequality는 모든 domain의 x,y에 대해 성립해야 합니다."]}
        interpretation="Convex differentiable 함수의 stationary point는 global minimizer지만, 아직 algorithm의 속도까지 말한 것은 아닙니다."
      />
    </section>

    <section id="smoothness" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · slope 변화 상한</p><h2 className="mt-2 text-2xl font-bold">L-smoothness는 조금 움직였을 때 gradient가 얼마나 급하게 바뀔 수 있는지 제한한다</h2></header>
      <Term name="L-smoothness" shape="‖∇f(x)−∇f(y)‖≤L‖x−y‖" meaning="두 위치의 gradient 차이가 이동 거리의 L배보다 커지지 않는 조건입니다." example="f(x)=ax²/2이면 gradient는 ax입니다. 따라서 두 점의 gradient 차이 |ax−ay|를 거리 |x−y|로 나누면 a가 남아 L=a입니다." boundary="Smoothness와 convexity는 별개이며 nonconvex 함수도 smooth할 수 있습니다." />
      <Term name="Descent lemma" shape="linear prediction + curvature allowance" meaning="현재 tangent가 예측한 변화에 L이 허용하는 quadratic 오차를 더해 다음 함수값의 상한을 만듭니다." example="d가 작을수록 curvature allowance는 ‖d‖²로 더 빨리 작아집니다." boundary="관심 domain의 L-smoothness가 없으면 이 상한을 사용할 수 없습니다." />
      <ExplainedFormula
        question="왜 local linear prediction에 L‖d‖²/2를 더할까요?"
        idea={<>현재 gradient가 만든 1차 예측만 쓰면 이동 중 slope 변화가 빠집니다. Smoothness 상한 L로 그 누락분을 거리 제곱 allowance로 덮습니다.</>}
        formula={String.raw`f(x+d)\le f(x)+\nabla f(x)^\top d+\frac L2\lVert d\rVert^2`}
        annotatedFormula={String.raw`\begin{aligned}f(x+d)&\le\underbrace{f(x)}_{\text{현재 기준값}}+\underbrace{\nabla f(x)^\top d}_{\substack{\text{현재 slope}\times\text{이동}}}\\[4pt]&\quad+\underbrace{\frac L2\lVert d\rVert^2}_{\substack{\text{이동 중 slope 변화의}\text{최대 허용 오차}}}\end{aligned}`}
        operations={[{ expression: String.raw`\nabla f(x)^\top d`, annotation: ["coordinate별 local slope에", "실제 이동을 곱해 1차 변화를 합산"] }, { expression: String.raw`L\lVert d\rVert^2/2`, annotation: ["gradient 변화 속도 L로", "직선 근사의 누락 오차를 위에서 제한"] }]}
        terms={[{ symbol: "d", name: "Input move", description: "x에서 다음 위치까지의 작은 이동입니다." }, { symbol: "L", name: "Smoothness constant", description: "Gradient 변화 속도의 상한입니다." }]}
        assumptions={["관심 domain에서 gradient가 L-Lipschitz입니다.", "Euclidean norm과 differentiable objective를 사용합니다."]}
        interpretation="이 식은 다음 점의 exact value가 아니라 local linear model이 틀릴 수 있는 최대 범위를 줍니다."
      />
      <p className="leading-7 text-muted-foreground">이차 여유의 <strong className="text-foreground">1/2</strong>은 임의로 붙인 상수가 아닙니다. x에서 x+d까지 갈수록 gradient 오차의 허용 폭이 0에서 L‖d‖까지 선형으로 커지고, 그 삼각형 넓이를 적분하면 L‖d‖²/2가 됩니다. 반대로 f(x)=|x|처럼 원점에서 slope가 갑자기 뛰는 함수에는 이 smooth-gradient 논리를 그대로 쓸 수 없습니다.</p>
    </section>

    <section id="curvature-range" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 위·아래 굽음</p><h2 className="mt-2 text-2xl font-bold">Strong convexity는 너무 평평한 바닥을 막고 condition number는 curvature 불균형을 요약한다</h2></header>
      <Term name="Strong convexity" shape="curvature ≥ μ" meaning="Convexity에 최소 quadratic 굽음 μ를 더해 minimizer에서 멀어질 때 objective가 충분히 증가하게 합니다." example="f(x)=μx²/2는 μ-strongly convex입니다." boundary="일반 deep-network loss는 전역 strong convexity를 만족하지 않습니다." />
      <Term name="Condition number" shape="κ=L/μ" meaning="가장 급한 curvature와 가장 평평한 curvature의 비율입니다." example="L=100, μ=1이면 κ=100인 좁고 긴 골짜기입니다." boundary="Parameter scaling과 선택 geometry가 바뀌면 κ도 달라집니다." />
      <ExplainedFormula
        question="왜 L을 μ로 나눈 비율이 gradient method의 난도를 나타낼까요?"
        idea={<>Step은 가장 급한 방향의 상한 L 때문에 작아지고, 가장 평평한 방향의 회복력 μ 때문에 progress가 느려집니다. 두 scale의 비가 클수록 한 보폭으로 두 방향을 맞추기 어렵습니다.</>}
        formula={String.raw`\kappa=\frac L\mu`}
        annotatedFormula={String.raw`\kappa=\frac{\overbrace{L}^{\text{가장 급한 slope 변화}}}{\underbrace{\mu}_{\text{가장 약한 회복 curvature}}}`}
        operations={[{ expression: String.raw`L/\mu`, annotation: ["가장 큰 curvature scale을", "가장 작은 scale로 나눠 불균형을 정규화"] }]}
        terms={[{ symbol: String.raw`\kappa`, name: "Condition number", description: "Curvature 불균형을 나타내는 dimensionless ratio입니다." }, { symbol: String.raw`\mu`, name: "Strong-convexity constant", description: "최소 curvature lower bound입니다." }]}
        assumptions={["0<μ≤L인 strongly convex·smooth objective입니다.", "이 ratio만으로 모든 optimizer의 wall-clock을 예측하지 않습니다."]}
        interpretation="κ가 1에 가까우면 방향별 굽음이 균일하고, κ가 크면 fixed scalar step의 진전이 느려질 수 있습니다."
      />
      <p>이 구조를 실제 반복과 bound에 넣는 과정은 <a className="font-semibold text-primary underline" href="/ai/math-gradient-descent-convergence">gradient descent와 convergence</a> 글에서 이어집니다.</p>
      <div id="paper-convex-geometry"><CitationBlock source="Boyd & Vandenberghe · Convex Optimization" citeKey={1} href={BOYD}><Evidence problem="Convex set·function·optimality·algorithm 보장을 하나의 조건 체계로 읽는 문제" contribution="Chord inequality, smoothness·strong-convexity와 convergence 전제를 체계화" assumptions="각 theorem이 선언한 domain·differentiability·curvature 조건" scope="Convex analysis와 optimization theory" notClaim="Deep-network loss 전체가 convex하거나 strongly convex라는 주장이 아님" /></CitationBlock></div>
      <div id="paper-quadratic-geometry"><CitationBlock source="MIT 18.065 · Gradient Descent" citeKey={2} href={MIT}><Evidence problem="Quadratic의 서로 다른 curvature 방향이 descent path를 어떻게 바꾸는지 보는 문제" contribution="Contour와 gradient path를 통해 conditioning을 시각적으로 연결" assumptions="강의의 quadratic·linear algebra 조건" scope="Gradient descent의 quadratic geometry" notClaim="모든 nonconvex training의 실제 convergence rate를 보장하지 않음" /></CitationBlock></div>
      <ContentBoundary article="math-optimization-convexity" />
    </section>
  </article>;
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
