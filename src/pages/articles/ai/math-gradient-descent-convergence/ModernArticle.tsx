import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import DescentDynamicsViz from "./DescentDynamicsViz";

const MIT = "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/";
const BOYD = "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf";

export default function GradientDescentConvergenceArticle() {
  return <article className="space-y-16">
    <section id="overview" data-teach-level="S" className="space-y-6">
      <h2 className="text-2xl font-bold">1 · 낮아지는 방향을 알아도 멀리 가면 점수가 커질 수 있다</h2>
      <p className="text-lg leading-8">현재 위치에서 점수가 어느 쪽으로 커지는지 알면 그 반대로 조금 움직여 볼 수 있습니다. 다만 방향을 맞췄다는 사실만으로 다음 점수의 감소까지 보장되지는 않습니다. 이동 거리가 너무 크면 가장 낮은 위치를 지나쳐 반대편의 더 높은 곳에 도착할 수 있습니다.</p>
      <p>이번 글은 현재 위치에서 다음 위치를 계산하는 규칙 하나를 반복합니다. 시작값과 점수 함수를 그대로 두고 이동에 곱하는 수만 바꾸어 보겠습니다. 그 차이가 경로를 어떻게 바꾸는지 본 뒤 어느 조건에서 반복의 결과를 보장할 수 있는지 확인합니다.</p>
      <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
      <ol className="list-decimal space-y-2 pl-6"><li>f(x)=x²/2, x₀=4, η=0.5이면 세 번 뒤 위치가 0.5일까요?</li><li>같은 시작점에서 η=2를 쓰면 위치가 0으로 수렴할까요?</li><li>기울기의 반대 방향을 골랐다는 사실만으로 임의의 η에서도 점수가 줄까요?</li></ol>
      <p>답은 <strong>예, 아니요, 아니요</strong>입니다. 한 단계 방향과 실제 이동 거리를 함께 봐야 하며, 이 사례의 수렴 여부는 배율 |1−η|로 판정합니다.</p>
      <DescentDynamicsViz />
      <ContentBoundary article="math-gradient-descent-convergence" />
    </section>
    <section id="black-box" data-teach-level="B" className="space-y-6">
      <h2 className="text-2xl font-bold">2 · 현재 위치와 기울기로 다음 위치를 만든다</h2>
      <p>점수를 입력의 제곱의 절반으로 정합니다(가정). 앞 글의 제곱 함수에 1/2을 곱한 새 예이며 현재 입력의 기울기가 입력값 자체가 됩니다. 입력 4에서는 점수 8, 기울기 4입니다. 가장 낮은 점수는 입력 0의 0입니다.</p>
      <p>계산 장치는 현재 위치를 받아 기울기를 구하고 그 기울기에 지정한 수를 곱해 현재 위치에서 뺍니다. 곱하는 수를 0.5로 정하면 첫 이동은 4의 절반인 2를 빼는 것이므로 다음 위치는 2입니다. 점수는 8에서 2로 줄어듭니다.</p>
      <p>다음에는 새 위치 2에서 기울기를 다시 계산합니다. 처음의 기울기 4를 계속 쓰지 않습니다. 같은 규칙을 반복하면서 위치, 기울기, 점수가 매번 함께 바뀝니다.</p>
      <p>만약 처음의 기울기 4를 계속 사용하면 매번 2를 빼 4→2→0→−2로 갑니다. 가장 낮은 위치를 찾은 뒤에도 계속 지나칩니다. 현재 위치를 갱신하는 일과 그 위치의 기울기를 다시 평가하는 일이 한 묶음이어야 하는 이유입니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="space-y-6">
      <h2 className="text-2xl font-bold">3 · 절반씩 빼면 4→2→1→0.5로 움직인다</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[470px] text-sm"><thead><tr><th className="p-3 text-left">현재 위치</th><th className="p-3 text-left">뺄 양</th><th className="p-3 text-left">다음 위치</th><th className="p-3 text-left">다음 점수</th></tr></thead><tbody>{[['4','0.5×4=2','2','2'],['2','0.5×2=1','1','0.5'],['1','0.5×1=0.5','0.5','0.125']].map(row=><tr key={row[0]} className="border-t border-border">{row.map((cell,i)=><td key={i} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div>
      <p>이동에 곱하는 수를 2로 바꾸면 같은 시작값 4에서 8을 빼므로 −4가 됩니다. 그곳의 기울기는 −4라 다음에는 −8을 빼고 다시 4로 옵니다. 위치는 바뀌지만 0까지의 거리 4와 점수 8은 그대로입니다.</p>
      <p>이번에는 3을 곱해 보겠습니다. 4에서 12를 빼 −8, 거기서 −24를 빼 16, 다시 48을 빼 −32가 됩니다. 0까지의 거리는 4→8→16→32로 커지고 점수도 8→32→128→512로 커집니다.</p>
      <p>셋 다 현재 기울기의 반대로 움직였습니다. 다른 것은 곱한 수 0.5, 2, 3뿐입니다. 내려가는 방향을 골랐다는 말과 실제 다음 값이 낮아졌다는 말은 이렇게 다른 결과를 가질 수 있습니다.</p>
      <p>비교할 때는 같은 시작점에서 똑같이 세 번 이동했습니다. 한 경로에만 더 많은 계산 기회를 주거나 점수 함수를 바꾸지 않았습니다. 따라서 여기서 거리와 점수의 차이를 만든 원인은 이동에 곱한 수로 좁힐 수 있습니다. 다른 함수와 비교할 때도 이런 조건을 함께 맞춰야 합니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="space-y-6">
      <h2 className="text-2xl font-bold">4 · 평가하고 이동한 뒤 새 위치에서 다시 시작한다</h2>
      <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3" aria-label="위치와 기울기를 다시 계산하는 반복"><p><strong>현재 위치 평가</strong><br />위치 4, 기울기 4</p><p><strong>이동량 계산</strong><br />0.5×4를 빼 위치 2</p><p><strong>다음 반복</strong><br />위치 2에서 기울기 2를 다시 계산</p></div>
      <p>새 위치의 점수도 확인하면 움직인 결과를 알 수 있습니다. 다만 여기서는 점수가 낮아질 때까지 이동 계수를 찾아 바꾸는 절차를 넣지 않았습니다. 선택한 같은 수를 매번 곱하는 규칙입니다. 나중에 실제 교재의 보폭 선택 방식과 비교하겠습니다.</p>
      <p>매번 멈출 조건도 확인합니다. 반복 횟수를 다 썼는지, 기울기가 충분히 작은지, 실제 이동이 작은지는 서로 다른 정보입니다. 어느 이유로 멈췄는지를 남겨야 결과가 좋은지 다시 판단할 수 있습니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="space-y-6">
      <h2 className="text-2xl font-bold">5 · 방향·이동 계수·종료 조건을 함께 정해야 한다</h2>
      <p>현재 기울기는 가까운 범위의 정보를 줍니다. 앞 글에서 살펴본 기울기 변화의 상한이 있으면 어느 정도의 이동까지 예측 오차를 통제할 수 있습니다. 그 상한과 무관하게 큰 수를 곱하면 위의 −8이나 16처럼 예상한 감소를 얻지 못할 수 있습니다.</p>
      <p>작게 움직였다는 사실도 성공을 뜻하지 않습니다. 기울기 4에 0.000001을 곱하면 이동은 0.000004뿐입니다(가정). 가장 낮은 위치 0에서 여전히 거의 4만큼 떨어져 있어도 “이동이 작다”는 종료 규칙을 만족할 수 있습니다.</p>
      <p>점수를 몇 배로 표현했는지도 영향을 줍니다. 같은 함수를 100배 한 점수는 가장 낮은 위치가 같지만 기울기도 100배입니다(가정). 같은 이동 계수를 쓰면 실제로 빼는 양이 100배가 됩니다. 위치의 단위와 점수의 크기를 정하지 않고 계수만 비교할 수 없습니다.</p>
      <p>함수의 조건을 먼저 고정하고 이동 규칙을 적용한 뒤 실제 값과 종료 이유를 읽는 순서가 필요합니다. 앞의 숫자 경로를 그대로 둔 채 이 반복에 쓰는 이름을 정리하겠습니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="space-y-6">
      <h2 className="text-2xl font-bold">6 · 경사하강법의 보폭과 수렴의 뜻을 구별한다</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[610px] text-sm"><thead><tr><th className="p-3 text-left">이미 한 일</th><th className="p-3 text-left">이름과 표기</th><th className="p-3 text-left">이 예의 역할</th></tr></thead><tbody>{[['기울기 반대로 반복 이동한다','경사하강법(gradient descent)','현재 위치를 다시 평가해 이동'],['기울기에 곱할 수를 정한다','학습률 또는 보폭(learning rate), η','0.5, 2, 3이 서로 다른 경로를 만듦'],['반복 뒤 오차가 어떻게 줄지 제한한다','수렴 보장(convergence guarantee)','함수 조건과 이동 규칙을 함께 명시'],['기울기가 0인 곳을 찾는다','정지점(stationary point)','가장 낮은 위치인지는 별도 조건'],['반복을 끝낼 이유를 정한다','종료 신호(stopping signal)','기울기·이동량·횟수 중 확인한 조건']].map(row=><tr key={row[0]} className="border-t border-border">{row.map(cell=><td key={cell} className="min-w-[180px] p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
      <p>현재 위치를 xₜ, 다음 위치를 xₜ₊₁, 점수를 f(x)=x²/2라고 씁니다. t는 반복 횟수이고 η는 기울기에 곱하는 양수입니다. 이 글에서 보폭이라고 부르는 η 자체는 이동 거리와 다릅니다. 실제 거리는 η‖∇f(xₜ)‖입니다.</p>
      <p>원래 사례의 세 이동을 한 식으로 정리한 뒤 다른 보폭도 같은 식으로 계산하겠습니다.</p>
    </section>
    <section id="update" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">7 · 현재 위치에서 기울기의 η배를 빼면 (1−η)x가 된다</h2>
      <p>f=x²/2의 기울기는 x이므로 xₜ−η∇f(xₜ)=xₜ−ηxₜ입니다. 현재 위치를 공통으로 묶으면 (1−η)xₜ가 남습니다. 이것이 이 제곱 예의 반복 배율입니다.</p>
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
      <AlgorithmBlock title="세 번 이동하는 계산 순서 (의사코드)" input={['f(x)=x²/2, x=4, η=0.5']} steps={[{code:'g ← 현재 x에서 계산한 기울기',note:'처음은 4, 다음은 2, 그다음은 1입니다.'},{code:'다음 x ← x − ηg',note:'2, 1, 0.5를 차례로 얻습니다.'},{code:'현재 x ← 다음 x',note:'새 위치를 다음 반복의 출발점으로 씁니다.'}]} output="세 번 뒤 x=0.5, f(x)=0.125" />
      <p>여러 입력에서도 원리는 같습니다. −∇f 쪽의 작은 이동 d=−η∇f는 직선 예측을 −η‖∇f‖²만큼 바꿉니다. 기울기가 0이 아니고 η&gt;0이면 음수입니다. 유한한 이동의 실제 감소를 보장하려면 여기에 곡률로 인한 오차까지 고려해야 합니다.</p>
    </section>
    <section id="step-size" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">8 · 배율의 크기가 1보다 작으면 0까지의 거리가 줄어든다</h2>
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
      <p>x₀=4처럼 0이 아닌 곳에서 시작하면 |1−η|&lt;1, 즉 0&lt;η&lt;2에서 0으로 수렴합니다. η=0은 위치를 그대로 두고 η=2는 같은 거리를 왕복합니다. η&gt;2는 부호를 바꾸며 거리를 키웁니다. 처음부터 x₀=0이라면 기울기도 0이라 이 모든 고정 η에서 그대로 0입니다.</p>
      <div className="overflow-x-auto"><table className="w-full min-w-[490px] text-sm"><thead><tr><th className="p-3 text-left">η</th><th className="p-3 text-left">배율 1−η</th><th className="p-3 text-left">위치 x₀→x₁→x₂→x₃</th></tr></thead><tbody>{[['0.5','0.5','4→2→1→0.5'],['1','0','4→0→0→0'],['1.5','−0.5','4→−2→1→−0.5'],['2','−1','4→−4→4→−4'],['3','−2','4→−8→16→−32']].map(row=><tr key={row[0]} className="border-t border-border">{row.map((cell,column)=><td key={column} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div>
      <p>좌우를 번갈아 간다는 사실만으로 실패라고 판단하지 않습니다. η=1.5는 부호를 바꾸면서도 거리가 절반씩 줄어듭니다. 이 함수의 점수는 위치의 제곱에 비례하므로 거리 배율이 0.5이면 점수 배율은 0.25입니다. η=0.5의 점수 8→2→0.5→0.125도 같은 관계입니다.</p>
      <p>앞 글의 하강 보조정리에 d=−η∇f를 넣으면 다음 값은 f(x)−η(1−Lη/2)‖∇f(x)‖² 이하입니다. 0&lt;η&lt;2/L이고 경로 전체에 같은 L을 적용할 수 있으면 기울기가 0이 아닌 곳에서 감소를 보장합니다. η=1/L은 그 감소량을 ‖∇f‖²/(2L)로 정리하기 쉬운 선택입니다.</p>
      <p>우리 f의 L=1에서는 1/L=1이라 한 번에 0으로 갑니다. 이 한 함수의 정확한 답을 모든 손실의 최적 보폭으로 일반화하지 않습니다. f=ax²/2, a&gt;0이면 반복 배율은 1−ηa이고 안정 범위도 0&lt;η&lt;2/a로 바뀝니다.</p>
    </section>
    <section id="convergence" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">9 · 한 번의 감소와 현재 오차를 연결하면 반복 뒤의 경계가 나온다</h2>
      <p>현재 함수값과 최솟값의 차이를 Δₜ=f(xₜ)−f(x*)라고 하겠습니다. 전역에서 μ-강하게 볼록하고 L-매끄러우며 정확한 기울기와 η=1/L을 사용한다고 가정합니다. 최소점이 존재하고 0&lt;μ≤L이며 입력 공간은 제약 없는 유클리드 공간입니다.</p>
      <p>매끄러움은 다음 값이 적어도 ‖∇f‖²/(2L)만큼 줄어든다고 보장합니다. 강한 볼록성은 ‖∇f‖²≥2μΔₜ를 줍니다. 둘을 이어 넣으면 다음 오차는 Δₜ−(μ/L)Δₜ=(1−μ/L)Δₜ 이하입니다. 이 관계를 매번 반복하면 아래 경계가 됩니다.</p>
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
      <ProgressiveDetail title="강한 볼록성이 기울기와 오차를 잇는 이유" preview="함수 아래에 놓인 이차식을 다른 위치 y에 대해 최소화하면 현재 값에서 빼도 되는 오차 상한이 나옵니다.">
        <p>강한 볼록성은 모든 y에 대해 f(y)≥f(x)+gᵀ(y−x)+(μ/2)‖y−x‖²를 줍니다. 여기서 g=∇f(x)입니다. 오른쪽을 y에 대해 최소화하면 y=x−g/μ에서 f(x)−‖g‖²/(2μ)가 됩니다. 따라서 최솟값 f(x*)도 이 하한 이상이고 Δ≤‖g‖²/(2μ)입니다.</p>
        <p>양변에 2μ를 곱하면 ‖g‖²≥2μΔ입니다. 입력에 별도 제약이 없는 경우의 유도이며 μ가 양수여야 나눌 수 있습니다. 기울기가 작을수록 오차도 작다는 연결을 이 전제가 제공합니다.</p>
      </ProgressiveDetail>
      <p>μ=2, L=8이면 한 번의 오차 비율 상한은 3/4이고 네 번 뒤에는 Δ₄≤(3/4)⁴Δ₀=(81/256)Δ₀입니다(가정). 81/256은 약 0.3164입니다. 이는 매번 오차가 정확히 3/4로 변한다는 주장이 아닙니다.</p>
      <p>실제 차이를 보기 위해 q(x,y)=x²+4y²의 (1,0)에서 η=1/8로 시작합니다(가정). 이 함수는 μ=2, L=8입니다. x는 매번 3/4배가 되고 y는 0이므로 네 번 뒤 점수는 (3/4)⁸=6561/65536, 약 0.1001입니다. 초기 오차 1의 상한 81/256보다 작습니다.</p>
      <p>원래 f=x²/2는 μ=L=1이라 η=1이면 한 번 뒤 오차가 0입니다. η=0.5의 4→2→1 경로에는 η=1/L이라는 방금 정한 정리의 전제가 맞지 않습니다. 그 경로는 8절의 정확한 반복식으로 별도 계산합니다.</p>
    </section>
    <section id="source" data-teach-level="5-6" className="space-y-6">
      <h2 className="text-2xl font-bold">10 · 실제 교재의 한 번 감소 식에 시작값 4를 대입한다</h2>
      <p><a className="font-semibold text-primary underline" href={MIT}>MIT 18.065 Lecture 22의 공식 요약</a>은 새 위치를 X=x−s(∂F/∂x)로 씁니다. 원문의 s를 이 글의 η에 맞추고 F=x²/2, x=4, s=0.5를 넣으면 X=4−0.5×4=2입니다. 같은 식을 새 x=2에서 다시 계산하면 X=1입니다.</p>
      <p><a className="font-semibold text-primary underline" href={`${BOYD}#page=480`}>Boyd·Vandenberghe 인쇄 466쪽 식 (9.17)</a>은 기울기 반대 방향의 보폭 t에 따른 함수값을 제한합니다. 여기서 원문의 t는 보폭이고 이 글의 반복 횟수 t와 다릅니다. 이 식에 대입할 때만 원문 t를 η로 읽겠습니다.</p>
      <ExplainedFormula question="원문 식 (9.17)은 4에서 보폭 0.5로 이동한 점수를 어디까지 제한하나요?"
        idea={<>원문 M은 기울기 변화의 상한에 해당합니다. 이동의 선형 감소와 제곱 오차 여유를 같은 기울기 크기로 계산합니다.</>}
        formula={String.raw`\widetilde f(t)\le f(x)-t\lVert\nabla f(x)\rVert_2^2+\frac{Mt^2}{2}\lVert\nabla f(x)\rVert_2^2`}
        annotatedFormula={String.raw`\begin{gathered}\widetilde f(t)\le f(x)-t\lVert\nabla f(x)\rVert_2^2+\frac{Mt^2}{2}\lVert\nabla f(x)\rVert_2^2\\[8pt]\widetilde f(0.5)\le\underbrace{8}_{f(4)}-\underbrace{0.5\times16}_{t\lVert\nabla f\rVert^2}+\underbrace{\frac{1\times0.5^2}{2}\times16}_{\text{오차 여유 }2}=2\end{gathered}`}
        operations={[{expression:String.raw`\lVert\nabla f(4)\rVert^2=4^2=16`,annotation:['같은 시작점의 기울기를 제곱해','두 변화 항에 공통으로 사용']},{expression:'8-8+2=2',annotation:['선형 감소와 오차 여유를 더해','다음 점수의 상한을 계산']}]}
        terms={[{symbol:'t',name:'원문의 보폭',description:'이 대입에서는 0.5이며 반복 횟수가 아닙니다.'},{symbol:'M=1',name:'원문의 굽음 상한',description:'f=x²/2의 L=1과 같습니다.'},{symbol:String.raw`\widetilde f(t)`,name:'보폭에 따른 점수',description:'원문은 f(x−t∇f(x))를 이 기호로 줄여 씁니다.'}]}
        assumptions={['원문은 관심 집합에서 두 번 미분 가능한 강한 볼록 함수의 굽음 상한을 사용합니다.','제곱 함수 사례는 모든 실수에서 해당 조건을 만족합니다.']}
        interpretation="실제 새 위치 2의 점수 f(2)=2와 상한이 같습니다. 보폭 3을 넣으면 상한 8−48+72=32가 되어 감소를 보장하지 않는 이유도 같은 식에서 확인됩니다." />
      <p>같은 466쪽의 Algorithm 9.3은 보폭을 정확한 선 탐색 또는 되돌림 탐색으로 고릅니다. 고정 η=0.5를 매번 사용하는 우리 규칙과 이 단계가 다릅니다. 이 제곱 함수에서 정확한 선 탐색은 4에서 0까지 가는 보폭 1을 택합니다.</p>
      <p>467쪽 식 (9.18)의 기하급수 오차 경계도 그 문맥에서는 정확한 선 탐색을 분석한 결과입니다. 우리 9절의 고정 η=1/L 경계는 8절의 감소식과 강한 볼록성을 직접 이어 유도했습니다. 같은 모양의 경계라도 보폭을 고르는 전제를 함께 읽어야 합니다.</p>
      <div id="paper-gradient-descent"><CitationBlock source="MIT 18.065 · Gradient Descent" citeKey={1} href={MIT}><Evidence problem="Quadratic objective에서 direction·step size·curvature가 반복 경로를 만드는 방식" contribution="Gradient descent와 zig-zag·convergence intuition을 level-set geometry로 설명" assumptions="강의의 differentiable quadratic과 stated step 조건" scope="First-order descent의 입문 계산·기하" notClaim="모든 neural-network training의 global convergence 보장이 아님" /></CitationBlock></div>
      <div id="paper-convergence-theory"><CitationBlock source="Boyd & Vandenberghe · Convex Optimization" citeKey={2} href={BOYD}><Evidence problem="Optimization theorem의 함수 구조·algorithm·step 전제를 분리하는 문제" contribution="Convex·smooth objective에서 descent method의 bound를 체계화" assumptions="각 theorem의 convexity·smoothness·feasibility 조건" scope="Convex first-order convergence analysis" notClaim="Small gradient가 nonconvex global optimum이나 deployment quality를 보장하지 않음" /></CitationBlock></div>
      <p>한 번의 실제 이동과 원문 경계를 맞췄습니다. 마지막으로 계산이 멈춘 이유와 최적점의 의미를 구별하겠습니다.</p>
    </section>
    <section id="stopping-boundary" data-teach-level="7" className="space-y-6">
      <h2 className="text-2xl font-bold">11 · 작은 기울기와 작은 이동은 서로 다른 종료 이유다</h2>
      <p>x², −x², x²−y²는 모두 원점에서 기울기가 0입니다. 그러나 첫 함수에서는 주변보다 낮고 둘째에서는 높습니다. 셋째는 x 방향으로 가면 커지고 y 방향으로 가면 작아지는 안장점입니다. 볼록성 등의 전제가 없으면 정지점이라는 사실만으로 전역 최소점이라고 할 수 없습니다.</p>
      <p>앞의 x=4, η=0.000001에서는 이동량이 0.000004지만 기울기 크기는 4입니다. 이동 허용오차를 0.00001로 정하면 작게 움직였다는 조건으로 멈추지만 기울기가 작다는 조건을 만족한 것은 아닙니다(가정). η와 실제 발동한 종료 조건을 함께 기록합니다.</p>
      <p>기울기 크기, 실제 이동량, 최대 반복 횟수 중 하나라도 정한 기준을 만족하면 끝내는 규칙을 사용할 수 있습니다. 이는 가능한 종료 정책 하나입니다. 세 조건이 같은 뜻이라는 말은 아니므로 실제로 어느 조건이 성립했는지 함께 확인합니다.</p>
      <ProgressiveDetail title="세 종료 조건을 하나의 식으로 적으면" preview="기울기 크기의 허용오차, 이동량의 허용오차, 최대 반복 횟수를 서로 다른 기준으로 두고 OR로 연결합니다. 각 기준의 단위를 먼저 고정합니다.">
      <ExplainedFormula
        question="왜 gradient norm 하나만 보지 않고 update와 budget을 함께 기록할까요?"
        idea={<>Small gradient는 flat scale이나 saddle에서도 나올 수 있고, tiny learning rate는 gradient가 커도 update를 작게 만듭니다. 서로 다른 신호를 분리해야 멈춘 이유를 재현할 수 있습니다.</>}
        formula={String.raw`\lVert\nabla f(x_t)\rVert\le\varepsilon_g\quad\lor\quad\lVert x_{t+1}-x_t\rVert\le\varepsilon_x\quad\lor\quad t=T`}
        annotatedFormula={String.raw`\begin{aligned}\underbrace{\lVert\nabla f(x_t)\rVert\le\varepsilon_g}_{\text{first-order slope가 작음}}\quad&\lor\\\underbrace{\lVert x_{t+1}-x_t\rVert\le\varepsilon_x}_{\text{실제 update가 작음}}\quad&\lor\\\underbrace{t=T}_{\text{반복 budget 소진}}&\end{aligned}`}
        operations={[{ expression: String.raw`\lVert\nabla f\rVert`, annotation: ["coordinate slope를 norm으로 묶어", "first-order stationary proximity 측정"] }, { expression: String.raw`\lVert x_{t+1}-x_t\rVert`, annotation: ["실제 두 iterate를 빼고 norm을 취해", "optimizer가 움직인 크기 측정"] }, { expression: String.raw`\lor`, annotation: ["서로 다른 stop reason 중", "어느 조건이 발동했는지 기록"] }]}
        terms={[{ symbol: String.raw`\varepsilon_g`, name: "Gradient tolerance", description: "Slope가 충분히 작다고 보는 threshold입니다." }, { symbol: String.raw`\varepsilon_x`, name: "Update tolerance", description: "실제 이동이 충분히 작다고 보는 threshold입니다." }, { symbol: "T", name: "Iteration budget", description: "허용한 최대 update 횟수입니다." }]}
        assumptions={["각 norm·threshold의 단위와 reduction을 고정합니다.", "OR로 멈췄다는 사실은 validation success나 global optimality를 증명하지 않습니다."]}
        interpretation="어떤 조건으로 언제 멈췄는지 기록합니다. 새 데이터의 품질, 계산의 안정성, 소요 시간과 메모리는 사용 여부를 결정할 때 따로 평가합니다."
      />
      </ProgressiveDetail>
      <p>예를 들어 f=x²/2, x₀=4, η=0.5에서 기울기 허용오차 0.6을 두면 세 번 이동한 x=0.5에서 멈출 수 있습니다. 이때 점수 오차는 0.125입니다(가정). 반복 한도를 2로 먼저 두었다면 x=1과 점수 0.5에서 끝났을 것입니다. 종료 이유가 다르면 남은 오차도 다릅니다.</p>
      <p>제약이 있으면 단순한 이동이 허용 범위 밖으로 나갈 수 있고 미분 불가능한 곳에서는 사용할 기울기 규칙을 정해야 합니다. 일부 데이터의 기울기만 사용하는 학습, 계산 오차, 누적 상태를 쓰는 다른 최적화 방법에도 여기의 정확한 반복식을 그대로 붙이지 않습니다.</p>
      <p>학습을 멈춘 뒤에는 보지 않은 데이터의 품질과 필요한 안전 조건을 별도로 평가합니다. 선택한 모델의 버전과 설정을 남기고 실제 장치의 시간·메모리 제약을 확인한 뒤 문제가 생기면 돌아갈 모델도 정합니다. 수학적 반복의 종료만으로 이런 사용 조건이 충족되지는 않습니다.</p>
      <ol className="list-decimal space-y-3 pl-6"><li>같은 x₀=4에서 η=1.5와 η=2는 모두 좌우를 오가는데 왜 하나는 0으로 가고 하나는 그렇지 않을까요? (답: 8절)</li><li>μ=2, L=8, η=1/L일 때 네 번 뒤 오차 비율의 상한은 얼마이며 실제 값과 항상 같을까요? (답: 9절)</li><li>기울기 크기 4에 η=0.000001을 썼다면 작은 이동만 보고 최적점 근처라고 말할 수 있을까요? (답: 11절)</li></ol>
    </section>
  </article>;
}

function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
