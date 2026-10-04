import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import CurvatureShapeViz from "./CurvatureShapeViz";

const BOYD = "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf";
const MIT = "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/";

export default function OptimizationGeometryArticle() {
  return <article className="space-y-16">
    <section id="overview" data-teach-level="S" className="space-y-6">
      <h2 className="text-2xl font-bold">1 · 지금의 기울기만 보고 얼마나 멀리 움직여도 될까</h2>
      <p className="text-lg leading-8">낮출 점수와 허용 범위를 정했어도 다음 위치를 고르는 문제는 남습니다. 현재 위치의 변화율을 알면 작은 이동의 결과를 예측할 수 있습니다. 하지만 이동하는 동안 그 비율이 급하게 바뀌면 처음의 예측만으로는 얼마나 좋아질지 알기 어렵습니다.</p>
      <p>이번에는 입력을 제곱한 점수 하나를 고정합니다. 두 점 사이를 직선으로 이었을 때 실제 점수가 어디에 있는지, 한 위치의 비율로 예측한 값이 얼마나 틀리는지를 직접 계산하겠습니다. 이 두 비교가 다음 글에서 이동 간격을 정하는 근거가 됩니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="space-y-6">
      <h2 className="text-2xl font-bold">2 · 같은 점수 계산에서 위치와 변화율을 함께 읽는다</h2>
      <p>어떤 실수든 넣을 수 있고 그 수를 제곱해 점수로 돌려주는 규칙을 둡니다(가정). 입력 0의 점수는 0, 입력 1은 1, 입력 2는 4입니다. 이 글에서는 작은 점수가 좋은 선택이고 입력의 허용 범위는 모든 실수입니다.</p>
      <p>앞의 미분 글에서 제곱 함수의 변화율은 입력의 두 배였습니다. 따라서 입력 1에서는 2, 입력 1.1에서는 2.2입니다. 같은 계산 규칙이어도 지금 위치가 달라지면 다음 이동을 예측하는 비율이 달라집니다.</p>
      <p>점수를 바꾸는 방법과 점수 함수의 성질은 구별합니다. 이 글에서 확인할 것은 함수 자체의 관계입니다. 어떤 반복 계산법이 이 관계를 이용할지는 뒤에서 정합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="space-y-6">
      <h2 className="text-2xl font-bold">3 · 두 끝의 평균 2보다 중간의 실제 점수 1이 낮다</h2>
      <p>입력 0과 2의 중간은 1입니다. 두 끝의 점수 0과 4를 반씩 섞으면 높이 2가 되지만 중간 입력 1의 실제 점수는 1입니다. 두 점을 이은 직선보다 곡선이 1만큼 아래에 있습니다.</p>
      <p>다른 비교도 해 보겠습니다. 입력 1에서 0.1만큼 움직일 때 현재 변화율 2만 쓰면 새 점수는 1+2×0.1=1.2로 예상됩니다. 실제 점수는 1.1²=1.21입니다. 움직이는 동안 변화율이 2에서 2.2로 커졌기 때문에 0.01의 차이가 남습니다.</p>
      <p>간격을 0.01로 줄이면 예상 점수 1.02와 실제 점수 1.0201 사이의 차이는 0.0001입니다. 입력 간격을 10분의 1로 줄이자 오차는 100분의 1이 됐습니다. 제곱 함수에서는 이 오차가 정확히 이동 간격의 제곱입니다.</p>
      <p>앞의 첫 비교는 멀리 떨어진 두 점 사이의 모양을 다룹니다. 둘째 비교는 한 점의 비율로 다음 값을 예측할 때 남는 오차를 다룹니다. 두 비교를 서로 바꾸어 쓰지 않고 각각 어떤 보장을 주는지 보겠습니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="space-y-6">
      <h2 className="text-2xl font-bold">4 · 곡선의 위치와 예측 오차를 두 번 비교한다</h2>
      <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3" aria-label="함수의 모양과 변화율 오차 비교"><p><strong>두 점 사이</strong><br />끝의 평균 2와 실제 점수 1</p><p><strong>한 점에서 이동</strong><br />예측 1.2와 실제 점수 1.21</p><p><strong>차이의 크기</strong><br />변화율 증가 0.2, 남은 오차 0.01</p></div>
      <p>곧 확인할 그림에서도 같은 제곱 곡선을 유지합니다. 두 끝을 잇는 선은 그 사이의 높이를 비교하는 데 쓰고 한 점에서 기울기를 맞춘 선은 그 점 주변의 변화를 예측하는 데 씁니다. 두 선의 역할과 위치가 다릅니다.</p>
      <p>두 점을 고르는 방식도 중요합니다. 0과 2의 중간을 확인했다는 사실 하나로 모든 입력을 판단할 수는 없습니다. 곡선 전체의 성질이라고 부르려면 임의의 두 입력과 그 사이의 모든 비율에 대해 같은 관계가 성립해야 합니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="space-y-6">
      <h2 className="text-2xl font-bold">5 · 함수 전체의 조건이 있어야 한 위치의 정보를 넓혀 쓸 수 있다</h2>
      <p>현재 변화율이 0이면 작은 이동의 1차 예측은 변하지 않습니다. 그렇다고 그 점이 가장 낮은 위치라는 결론은 아직 나오지 않습니다. 입력의 제곱에 −1을 곱한 점수도 0에서 변화율은 0이지만 주변으로 움직이면 점수가 더 낮아집니다(가정).</p>
      <p>두 점 사이의 곡선이 어떻게 놓이는지를 제한하면 이런 경우를 구별할 수 있습니다. 한 점의 직선 예측이 다른 모든 점보다 아래에 놓인다면 그 기울기가 0인 위치보다 낮은 점은 존재할 수 없습니다. 7절에서 이 관계를 식으로 확인합니다.</p>
      <p>반면 다음 한 번의 이동에서 점수가 얼마나 달라질지 제한하려면 변화율이 얼마나 빨리 바뀌는지도 알아야 합니다. 앞 예에서 입력 거리 0.1에 변화율이 0.2만큼 바뀐 비율은 2입니다. 어떤 두 위치를 골라도 이 비율을 넘지 않는 상한이 있으면 예측에 빠진 양을 제한할 수 있습니다.</p>
      <p>이 예의 오차 0.01은 정확한 값입니다. 일반적인 함수에서는 오차가 반드시 그 값과 같아야 할 필요는 없습니다. 실제 오차가 넘지 못하는 경계를 알아도 다음 선택의 점수가 얼마나 커질 수 있는지 판단할 수 있습니다.</p>
      <p>상한과 하한을 함께 보는 이유도 있습니다. 한 방향에서는 점수가 급하게 바뀌고 다른 방향에서는 거의 바뀌지 않으면 하나의 이동 간격으로 둘을 맞추기 어렵습니다. 먼저 한 입력의 같은 사례에서 위아래 관계를 확인한 뒤 두 입력의 차이로 확장하겠습니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="space-y-6">
      <h2 className="text-2xl font-bold">6 · 볼록성은 모양을, 매끄러움은 기울기 변화의 상한을 정한다</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[630px] text-sm"><thead><tr><th className="p-3 text-left">비교한 관계</th><th className="p-3 text-left">이름</th><th className="p-3 text-left">표기와 역할</th></tr></thead><tbody>{[['두 점 사이에서 곡선이 이은 선보다 높지 않다','볼록성(convexity)','모든 입력과 섞는 비율에서 확인'],['기울기 변화가 이동 거리의 일정 배수를 넘지 않는다','L-매끄러움(L-smoothness)','L은 변화 비율의 상한'],['기울기로 예측한 값에 최대 오차를 더한다','하강 보조정리(descent lemma)','다음 함수값의 위쪽 경계'],['직선 예측보다 적어도 일정한 제곱량만큼 높다','강한 볼록성(strong convexity)','μ>0은 최소 굽음의 하한'],['위쪽과 아래쪽 변화 규모를 비교한다','조건수(condition number)','κ=L/μ']].map(row=><tr key={row[0]} className="border-t border-border">{row.map(cell=><td key={cell} className="min-w-[185px] p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
      <p>앞의 함수를 f(x)=x²라고 적겠습니다. 두 점을 잇는 직선 부분은 현(chord), 한 점에서 기울기를 맞춘 선은 접선입니다. 여러 입력에서는 기울기를 모은 벡터와 유클리드 거리를 사용합니다.</p>
      <p>L과 μ는 같은 함수에 붙이는 서로 다른 조건입니다. 숫자만 보고 역할을 바꾸지 않도록 f=x²에서 각각을 계산하겠습니다.</p>
    </section>
    <section id="convexity" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">7 · 제곱 함수의 현과 곡선 사이 차이는 항상 0 이상이다</h2>
      <p>두 입력 x, y를 비율 λ와 1−λ로 섞어 z를 만듭니다. x=0, y=2, λ=1/2이면 z=1이고 현의 높이는 2입니다. 실제 f(z)=1과의 차이는 1입니다. 이 숫자를 임의의 입력에서도 성립하는 식으로 넓혀 보겠습니다.</p>
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
      <p>제곱을 전개하면 현에서 곡선을 뺀 값은 λx²+(1−λ)y²−[λx+(1−λ)y]²=λ(1−λ)(x−y)²입니다. 0≤λ≤1이므로 세 인수가 모두 0 이상입니다. 따라서 임의의 두 점과 모든 섞는 비율에서 볼록성 부등식이 성립합니다.</p>
      <p>입력의 정의역도 볼록한 집합이어야 합니다. 두 입력을 고르면 그 사이의 모든 입력 역시 허용되어야 한다는 뜻입니다. 여기서는 모든 실수이므로 이 조건을 만족합니다. 두 점의 계산값만 확인하고 정의역의 구멍을 무시할 수는 없습니다.</p>
      <p>미분 가능한 볼록 함수에서는 f(y)≥f(x)+∇f(x)ᵀ(y−x)가 모든 두 점에서 성립합니다. 한 점의 접선 예측이 전체 함수의 아래쪽 경계입니다. 따라서 ∇f(x)=0이면 모든 y에 대해 f(y)≥f(x)이고 그 x는 전역 최소점입니다. 제약 없는 f=x²의 x=0이 이 경우입니다.</p>
      <p>이 결론은 “기울기가 0인 점이 있다면 최적이다”라는 조건부 결론입니다. 최소점이 반드시 존재한다거나 어떤 반복법이 빠르게 찾는다는 결론은 아닙니다. 앞 글의 구간 경계 최적점처럼 제약이 있으면 기울기가 0이 아닌 곳도 답이 될 수 있습니다.</p>
    </section>
    <section id="smoothness" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">8 · 기울기 변화 상한 2로 예측 오차 d²를 덮는다</h2>
      <p>f=x²의 기울기는 2x입니다. 두 위치의 기울기 차이는 |2x−2y|=2|x−y|이므로 가장 작은 상한은 L=2입니다. 더 큰 L도 상한이지만 더 느슨한 보장입니다. 일반식 f(x)=ax²/2에서는 가장 작은 L=|a|이고 a≥0일 때 L=a입니다.</p>
      <p>기존 연습문제의 f=3x²/2라면 기울기는 3x이고 L=3입니다. 한편 f=−x²도 기울기 차이의 크기는 2|x−y|이므로 L=2입니다. 이 함수는 볼록하지 않습니다. 매끄러움은 기울기 변화의 크기를 제한하며 곡선이 어느 방향으로 굽는지는 별도 조건입니다.</p>
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
      <p>같은 x=1, d=0.1에 L=2를 넣으면 상한은 1+2×0.1+(2/2)×0.1²=1.21입니다. 실제 값도 1.21이라 이 예에서는 등호입니다. d=0.01이면 오차 상한은 0.0001로 앞의 계산과 일치합니다.</p>
      <p>1/2은 임의의 여유 계수가 아닙니다. 출발점에서는 기울기 차이가 0이고 이동 경로의 끝에서는 최대 L‖d‖입니다. 거리에 따라 커지는 이 차이를 누적하면 밑변 ‖d‖, 높이 L‖d‖인 삼각형 넓이 L‖d‖²/2가 됩니다.</p>
      <ProgressiveDetail title="경로를 적분해 오차의 1/2을 유도하면" preview="전체 이동의 비율 t를 0부터 1까지 늘립니다. 출발 기울기와의 차이는 Lt‖d‖를 넘지 않으므로 그 기여를 적분합니다.">
        <p>여러 입력에서는 기울기 차이와 이동의 내적을 <a className="font-semibold text-primary underline" href="/cs/ai/math-vectors-inner-products#cauchy-schwarz">Cauchy–Schwarz 부등식</a>으로 제한합니다. 두 벡터의 내적 크기는 각각의 길이를 곱한 값보다 클 수 없다는 관계입니다.</p>
        <ExplainedFormula question="여러 입력에서도 삼각형 넓이와 같은 1/2이 나오는 이유는 무엇인가요?"
          idea={<>경로 x+td를 따라 실제 변화율을 적분합니다. 출발점의 기울기 기여를 빼면 이동 중 바뀐 부분만 남습니다. 그 내적을 거리와 기울기 변화 상한으로 제한합니다.</>}
          formula={String.raw`\begin{aligned}f(x+d)-f(x)-\nabla f(x)^\top d&=\int_0^1[\nabla f(x+td)-\nabla f(x)]^\top d\,dt\\&\le\int_0^1Lt\lVert d\rVert^2dt=\frac L2\lVert d\rVert^2\end{aligned}`}
          annotatedFormula={String.raw`\int_0^1\underbrace{\lVert\nabla f(x+td)-\nabla f(x)\rVert}_{\le Lt\lVert d\rVert}\underbrace{\lVert d\rVert}_{\text{전체 이동 길이}}dt\le L\lVert d\rVert^2\underbrace{\int_0^1t\,dt}_{1/2}`}
          operations={[{expression:String.raw`\nabla f(x+td)-\nabla f(x)`,annotation:['현재 경로 위치와 출발점의','기울기 차이를 분리']},{expression:String.raw`Lt\lVert d\rVert`,annotation:['두 위치의 거리 t‖d‖에','변화 상한 L을 곱함']},{expression:String.raw`\int_0^1t\,dt=1/2`,annotation:['경로 전체의 오차 상한을 누적해','제곱 이동의 계수를 얻음']}]}
          terms={[{symbol:'t',name:'경로의 진행 비율',description:'0은 출발점, 1은 도착점입니다.'},{symbol:'d',name:'입력 이동 벡터',description:'경로를 미분하면 전체 이동 d가 곱해집니다.'}]}
          assumptions={['경로 전체가 L-매끄러움이 성립하는 정의역 안에 있습니다.','기울기 내적을 Cauchy–Schwarz 부등식으로 제한하며 유클리드 노름을 씁니다.']}
          interpretation="볼록성을 사용하지 않고 기울기 변화의 상한만 사용한 유도입니다. L이 적용되는 경로 밖으로 이동하면 이 보장을 쓸 수 없습니다." />
      </ProgressiveDetail>
      <p>이 상한에 d=−∇f/L을 대입하면 선형 항은 −‖∇f‖²/L, 오차 여유는 ‖∇f‖²/(2L)이므로 합은 −‖∇f‖²/(2L)입니다. L&gt;0이고 이동 경로가 조건을 만족하면 다음 값은 이만큼 이상 줄어듭니다. f=x²의 x=1에서는 d=−1이라 한 번에 0으로 가고 점수도 1에서 0이 됩니다.</p>
      <CurvatureShapeViz />
      <p>매끄러움과 볼록성은 서로 대신할 수 없습니다. |x|는 볼록하지만 원점에서 기울기가 정의되지 않습니다. sin x는 기울기 cos x가 거리 한 단위에 최대 1만큼 변하므로 L=1이지만 전체 실수에서 볼록하지 않습니다. cos x의 변화율인 −sin x의 크기가 1 이하라는 사실로 이 상한을 확인할 수 있습니다.</p>
    </section>
    <section id="curvature-range" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">9 · 아래 굽음 1과 위 굽음 100이면 한 보폭으로 맞추기 어렵다</h2>
      <p>강한 볼록성은 접선 예측에 μ‖d‖²/2를 더한 값도 함수 아래에 놓인다는 조건입니다. μ&gt;0이므로 접선에서 멀어질 때 최소한 이 제곱량만큼 높아져야 합니다. f=x²는 f(x+d)=f(x)+2xd+d²이므로 가장 큰 μ=2입니다. 이 예는 L=μ=2입니다.</p>
      <p>두 입력의 가정 예 q(x,y)=(x²+100y²)/2를 보겠습니다. 기울기는 (x,100y)입니다. x 방향의 변화 규모는 1이고 y 방향은 100이므로 가장 촘촘한 하한 μ=1과 상한 L=100을 얻습니다. 한쪽이 더 급한 골짜기를 같은 좌표 단위로 비교한 결과입니다.</p>
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
      <p>위 함수에서 간격 1/L=0.01로 기울기 반대 방향으로 움직이면 (1,1)은 (0.99,0)이 됩니다. 급한 y 방향은 한 번에 0이 되지만 x 방향은 0.01만 줄었습니다. 반대로 간격 1을 쓰면 (1,1)→(0,−99)라 y 방향으로 크게 벗어납니다. 같은 간격이 두 방향에 다르게 작용합니다.</p>
      <p>L=12, μ=3이면 κ=4입니다. κ는 초 단위 실행 시간이 아니라 선택한 좌표와 거리 기준에서의 변화 규모 비율입니다. 느슨한 L이나 μ를 쓰면 κ도 실제 굽음 비율보다 큰 상한일 수 있습니다. 어느 상수를 사용했는지도 함께 적습니다.</p>
      <p>좌표를 z=10y로 바꾸면 같은 q는 (x²+z²)/2가 되어 새 좌표의 μ=L=1입니다. 함수가 나타내는 원래 문제는 같아도 두 좌표의 한 단위가 의미하는 이동은 달라졌습니다. κ는 좌표 변환과 무관한 고정 속성이나 모든 계산법의 성능 점수가 아닙니다.</p>
    </section>
    <section id="source" data-teach-level="5-6" className="space-y-6">
      <h2 className="text-2xl font-bold">10 · 실제 교재의 θ·m·M을 같은 사례의 비율과 경계에 맞춘다</h2>
      <p><a className="font-semibold text-primary underline" href={`${BOYD}#page=81`}>Boyd·Vandenberghe §3.1.1, 인쇄 67쪽 식 (3.1)</a>은 f(θx+(1−θ)y)≤θf(x)+(1−θ)f(y)입니다. 원문의 θ가 이 글의 λ입니다. x=0, y=2, θ=1/2를 넣으면 왼쪽 1≤오른쪽 2가 됩니다. 이는 같은 제곱 함수의 첫 비교입니다.</p>
      <p><a className="font-semibold text-primary underline" href={`${BOYD}#page=83`}>인쇄 69쪽 식 (3.2)</a>는 f(y)≥f(x)+∇f(x)ᵀ(y−x)입니다. f=x², x=1, y=1.1을 대입하면 1.21≥1.2입니다. 첫 식의 현은 곡선 위에 놓이고 둘째 식의 접선은 아래에 놓입니다. 서로 다른 선이라는 점을 숫자로 확인할 수 있습니다.</p>
      <ExplainedFormula question="원문의 위아래 이차 경계에 같은 이동 0.1을 넣으면 무엇이 나오나요?"
        idea={<>§9.1.2 식 (9.8)과 (9.13)은 원문의 m과 M으로 접선 위의 최소·최대 여유를 적습니다. 이 글의 μ와 L에 각각 대응합니다.</>}
        formula={String.raw`\begin{aligned}f(y)&\ge f(x)+\nabla f(x)^\top(y-x)+\frac m2\lVert y-x\rVert_2^2\\f(y)&\le f(x)+\nabla f(x)^\top(y-x)+\frac M2\lVert y-x\rVert_2^2\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\underbrace{1+2(0.1)}_{\text{접선 예측 }1.2}+\underbrace{\frac22(0.1)^2}_{\text{아래 여유 }0.01}&\le f(1.1)\\f(1.1)&\le\underbrace{1+2(0.1)}_{\text{접선 예측 }1.2}+\underbrace{\frac22(0.1)^2}_{\text{위 여유 }0.01}\end{aligned}`}
        operations={[{expression:String.raw`m=2,\ M=2`,annotation:['제곱 함수의 아래·위 굽음을','원문의 기호에 대입']},{expression:'y-x=0.1',annotation:['앞에서 사용한 같은 이동을','두 경계식에 넣음']},{expression:String.raw`1.21\le f(1.1)\le1.21`,annotation:['아래와 위 경계가 만나','실제 값 1.21을 고정']}]}
        terms={[{symbol:'m',name:'원문의 하한',description:'이 글의 강한 볼록성 상수 μ에 해당합니다.'},{symbol:'M',name:'원문의 상한',description:'이 글의 L에 대응하는 굽음 상한입니다.'}]}
        assumptions={['원문 §9.1.2는 관심 집합 S에서 두 번 미분 가능하며 굽음의 아래·위 행렬 경계를 둡니다.','여기서는 f=x²라 모든 실수에서 두 경계가 성립합니다. 일반적인 L-매끄러움의 유도보다 원문이 사용하는 가정이 더 강합니다.']}
        interpretation="원문 식 (9.8)은 인쇄 459쪽, 식 (9.13)은 461쪽입니다. 같은 페이지의 비율 M/m에 2/2를 넣으면 κ=1이며 두 입력 q의 100/1을 넣으면 κ=100입니다." />
      <p>원문의 461쪽 식 (9.15) 아래 설명은 M/m을 굽음 행렬 조건수의 상한으로 다룹니다. 반드시 가장 촘촘한 경계를 골랐다고 가정하지 않습니다. 앞의 두 제곱 예에서는 실제 최대·최소 굽음을 골랐으므로 그 비율과 일치합니다.</p>
      <div id="paper-convex-geometry"><CitationBlock source="Boyd & Vandenberghe · Convex Optimization" citeKey={1} href={BOYD}><Evidence problem="Convex set·function·optimality·algorithm 보장을 하나의 조건 체계로 읽는 문제" contribution="Chord inequality, smoothness·strong-convexity와 convergence 전제를 체계화" assumptions="각 theorem이 선언한 domain·differentiability·curvature 조건" scope="Convex analysis와 optimization theory" notClaim="Deep-network loss 전체가 convex하거나 strongly convex라는 주장이 아님" /></CitationBlock></div>
      <div id="paper-quadratic-geometry"><CitationBlock source="MIT 18.065 · Gradient Descent" citeKey={2} href={MIT}><Evidence problem="Quadratic의 서로 다른 curvature 방향이 descent path를 어떻게 바꾸는지 보는 문제" contribution="Contour와 gradient path를 통해 conditioning을 시각적으로 연결" assumptions="강의의 quadratic·linear algebra 조건" scope="Gradient descent의 quadratic geometry" notClaim="모든 nonconvex training의 실제 convergence rate를 보장하지 않음" /></CitationBlock></div>
      <p>원문 식이 적용되는 범위를 확인했으므로 학습 문제에 이 보장을 옮길 때의 경계를 정리하겠습니다.</p>
    </section>
    <section id="boundaries" data-teach-level="7" className="space-y-6">
      <h2 className="text-2xl font-bold">11 · 매끈한 그림만으로 전체 학습의 보장을 얻을 수는 없다</h2>
      <p>미분 가능하다는 사실만으로 전체 실수에서 유한한 L이 존재하지는 않습니다. f=x⁴의 기울기 4x³은 멀리 갈수록 더 급하게 변합니다. 다만 |x|≤R인 구간에서는 두 번째 미분 12x²≤12R²로 상한을 얻습니다. 적용 영역을 정한 뒤 그 안의 이동만 보장해야 합니다.</p>
      <p>x⁴는 엄격하게 볼록하지만 원점 근처의 굽음이 0으로 줄어들어 전체 실수에서 양수 μ의 강한 볼록성은 없습니다. 접선 아래에 놓이지 않는다는 조건과 일정한 제곱량만큼 반드시 위에 있어야 한다는 조건은 다릅니다.</p>
      <p>신경망 손실에는 같은 함수를 표현하는 서로 다른 가중치, 여러 골짜기, 안장점이 있을 수 있습니다. 예를 들어 두 가중치의 곱으로 출력하는 모형은 (a,b)와 (ca,b/c)가 같은 출력을 만듭니다(c≠0, 가정). 같은 최소값을 내는 가중치가 여럿이면 전체 공간의 강한 볼록성을 주장할 수 없습니다.</p>
      <p>앞의 보장은 함수의 조건을 먼저 확인한 뒤 쓰는 기준입니다. 현재 위치에서 오차가 작게 보였다는 이유로 손실 전체에 같은 L이나 μ를 적용하지 않습니다. 이어지는 <a className="font-semibold text-primary underline" href="/cs/ai/math-gradient-descent-convergence">경사하강법과 수렴</a>에서 이 조건들이 보폭과 반복 횟수의 식에 어떻게 들어가는지 살펴봅니다.</p>
      <ol className="list-decimal space-y-3 pl-6"><li>f=x²에서 0과 2를 반씩 섞으면 곡선과 현의 높이는 각각 얼마이며, 일반적인 차이는 왜 음수가 될 수 없을까요? (답: 7절)</li><li>x=1에서 d=0.1만큼 움직일 때 L=2의 오차 여유는 얼마이며, d=−∇f/L을 택하면 어디로 갈까요? (답: 8절)</li><li>q=(x²+100y²)/2에서 κ=100은 무엇을 뜻하며 z=10y로 좌표를 바꾸면 왜 달라질까요? (답: 9절)</li></ol>
      <ContentBoundary article="math-optimization-convexity" />
    </section>
  </article>;
}

function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
