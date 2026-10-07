import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { odeCodeRefs } from "./codeRefs";
import DecayStepsViz from "./viz/DecayStepsViz";
export default function DifferentialEquationsArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 지금 줄어드는 속도로 잠시 뒤의 양을 계산한다</h2>
<p className="text-lg leading-8">어떤 양이 1만큼 남아 있습니다. 지금은 초당 1만큼 줄어들지만 남은 양이 작아지면 줄어드는 속도도 느려집니다. 1초 뒤에 얼마나 남을까요? 처음 속도로 1초 내내 줄었다고 계산하면 0이 됩니다. 중간에 느려지는 것을 반영하려면 현재 속도를 여러 번 다시 읽어야 합니다.</p>
<p>이 글에서는 같은 1초를 두 번 또는 네 번으로 나누어 계산합니다. 나눈 간격과 속도를 읽는 위치가 답을 어떻게 바꾸는지 확인한 뒤 실제 계산 라이브러리에서 같은 숫자가 움직이는 순서를 따라갑니다. 끝에서는 매 순간 작은 흔들림이 더해지는 경우까지 범위를 넓힙니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>x′=−x, x(0)=1을 간격 0.5의 Euler 방법으로 두 번 움직이면 끝값이 0.25일까요?</li><li>간격을 0.25로 줄이면 네 번 뒤 값이 0.31640625가 되어 정확한 e⁻¹에 더 가까워질까요?</li><li>간격을 계속 줄였을 때 계산값이 모이면, 변화 규칙 자체도 현실에 맞다고 증명될까요?</li></ol>
<p>답은 <strong>예, 예, 아니요</strong>입니다. 간격을 줄이면 주어진 식을 더 잘 따라갈 수 있지만, 그 식이 현실을 빠짐없이 나타내는지는 별도 검증이 필요합니다.</p>
<DecayStepsViz />
<ContentBoundary article="math-differential-equations-numerical-solvers"/>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 현재 양과 시간을 받아 조금 뒤의 양을 돌려준다</h2>
<p>입력에는 시작 시각, 그때의 양, 지금 줄어드는 속도를 알려 주는 규칙이 필요합니다. 언제까지 계산할지도 정합니다. 출력은 요청한 시각들에서의 양입니다. 이 글의 규칙은 현재 남은 양의 숫자에 마이너스를 붙인 값을 초당 변화량으로 돌려줍니다.</p>
<p>
            계산을 맡는 부분은 이 규칙을 반복해서 호출합니다. 현재 양에서 속도를 읽고 짧은 시간을 곱해 얼마나 달라질지 구한 뒤 그 차이를 현재 양에 더합니다. 새로 얻은 양은 다음
            계산의 출발점이 됩니다. 속도를 정하는 규칙과 그 규칙을 따라가는 계산 방법은 따로 바꿀 수 있습니다.
          </p>
<p>현재 속도를 안다고 해서 미래의 전체 경로가 숫자 목록으로 준비된 것은 아닙니다. 남은 양이 달라질 때마다 속도도 달라집니다. 속도를 한 번 읽고 얼마 동안 그대로 사용할지 정하는 일이 결과에 영향을 줍니다. 시간을 몇 조각으로 나눌지는 계산의 선택입니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 1에서 시작해 0.5, 다시 0.25로 간다</h2>
<p>시작 시각은 0초, 남은 양은 1이고 1초 뒤까지 계산한다고 합시다(가정). 초당 변화량은 현재 양의 음수입니다. 첫 0.5초 동안 출발점의 속도 −1을 그대로 사용하면 변화량은 −1×0.5=−0.5입니다. 새로 남은 양은 1−0.5=0.5입니다.</p>
<p>이제 남은 양이 0.5이므로 초당 변화량도 −0.5로 바뀝니다. 다음 0.5초 동안의 변화량은 −0.25이고 새 양은 0.25입니다. 같은 시간을 두 번 지났어도 매번 같은 양을 빼지 않습니다. 두 번째에는 이미 줄어든 양에서 속도를 다시 읽기 때문입니다.</p>
<p>1초를 네 번으로 나누면 어떨까요? 이번에는 현재 양의 0.25만큼을 빼므로 매번 이전 값의 0.75가 남습니다. 계산한 양은 1, 0.75, 0.5625, 0.421875, 0.31640625 순서입니다. 같은 규칙과 같은 시작값인데 시간 간격을 바꾸자 끝값이 달라졌습니다.</p>
<p>이 차이를 확인하려고 이 사례에서는 연속된 변화의 정확한 기준값도 함께 사용합니다. 0.5초에는 약 0.6065, 1초에는 약 0.3679입니다. 뒤에서 이 값을 만드는 식을 유도합니다. 먼저 두 번 계산한 0.25보다 네 번 계산한 약 0.3164가 기준 끝값에 가까워진다는 사실을 봅시다.</p>
<p>수치를 적을 때는 정확한 유한소수와 표시를 줄인 근삿값을 구분합니다. 이 사례의 0.25와 0.31640625는 정한 계산 규칙의 정확한 결과입니다. 약 0.3679는 연속된 변화의 값을 소수 넷째 자리까지 표시한 것입니다. 화면의 자릿수만 비교해 계산이 정확하다고 판단하지 않습니다.</p>
<p>출발량만 2로 바꾸어 같은 계산을 해 봅시다(가정). 첫 0.5초에는 속도 −2를 사용해 1이 남고 다음에는 속도 −1을 사용해 0.5가 남습니다. 출발량과 두 중간 결과가 모두 두 배입니다. 현재 양에 비례하는 규칙을 사용했기 때문입니다. 시간 간격을 바꾼 앞의 비교와 출발량을 바꾼 이 비교는 서로 다른 실험입니다.</p>
<p>감소한 양을 거꾸로 더해 출발량이 맞는지도 검사할 수 있습니다. 처음 사례의 두 감소량은 0.5와 0.25입니다. 이 둘에 마지막으로 남은 0.25를 더하면 처음의 1이 됩니다. 이런 확인은 각 단계의 덧셈을 검산하지만, 그 계산 경로가 연속된 기준과 일치한다는 증명은 아닙니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 곡선을 짧은 선분으로 따라가는 모습을 본다</h2>
<p>그림의 가로축은 시간이고 세로축은 남은 양입니다. 회색 점선은 계속 달라지는 속도를 반영한 경로입니다. 색 점은 실제로 계산한 시점이며 점 사이의 직선은 그때 사용한 한 번의 이동을 보여 줍니다. 모든 장면의 축과 눈금은 같습니다.</p>
<p>첫 직선은 출발점에서 읽은 빠른 감소 속도를 끝까지 유지합니다. 실제 경로는 이동하는 동안 감소가 느려져 위쪽으로 휘므로 직선의 끝이 아래로 처집니다. 더 짧게 이동하면 그동안 속도가 바뀐 양을 덜 놓칩니다.</p>
<p>마지막 장면은 출발점에서 한 번 읽은 속도에 더해 예상 끝점에서도 속도를 읽습니다. 두 값을 평균하면 같은 간격으로도 기준 경로에 가까워질 수 있습니다. 짧게 여러 번 움직이는 방법과 한 번 움직일 때 더 많이 확인하는 방법이 서로 다른 선택임을 보여 줍니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 원래 규칙을 고치는 일과 계산 간격을 고치는 일을 나눈다</h2>
<p>이 사례에서는 연속된 변화의 답을 식으로 알 수 있습니다. 하지만 여러 양이 서로 영향을 주거나 속도를 큰 신경망이 알려 주면 전체 경로를 한 번에 적는 식을 구하기 어려울 수 있습니다. 지금의 변화율을 계산할 수 있다면 짧은 이동을 반복해 미래를 근사할 수 있습니다.</p>
<p>속도를 읽는 횟수를 늘리면 보통 계산량도 늘어납니다. 같은 1초에 두 번 읽던 것을 네 번 읽으면 호출 횟수가 두 배가 됩니다. 한 번의 호출이 비싼 신경망 계산이라면 이 차이가 실행 시간에 영향을 줍니다. 다만 호출 횟수가 같아도 한 번의 크기나 실행 장치가 다르면 걸리는 시간은 달라집니다.</p>
<p>현실의 감소 규칙을 잘못 정했다면 간격을 줄여도 그 잘못은 남습니다. 실제로는 외부에서 양이 보충되는데 식에서 이를 빼먹었다면 더 정밀한 계산은 잘못 정한 규칙을 더 충실히 따라갑니다. 규칙이 현실을 얼마나 잘 설명하는지와 주어진 규칙을 얼마나 잘 계산하는지는 각각 확인해야 합니다.</p>
<p>중간 결과를 언제 저장할지도 계산 간격과 구분합니다. 내부에서는 0.5초씩 두 번 움직이고 화면에는 시작과 끝만 보여 줄 수 있습니다. 반대로 계산하지 않은 중간 시각의 값을 주변 값에서 추정해 보여 줄 수도 있습니다. 결과 목록에 숫자가 많다는 사실만으로 내부 계산을 많이 했다고 단정할 수 없습니다.</p>
<p>계산 범위를 2초로 늘리되 속도를 출발점에서 한 번만 읽으면 더 큰 문제가 드러납니다(가정). 양 1에서 초당 −1을 2초 동안 유지하면 1−2=−1입니다. 원래 양이 줄수록 감소가 느려지는 규칙인데 계산은 0을 지나 음수까지 갑니다. 중간의 변화를 놓친 결과입니다. 작은 간격에서 답이 조금 달랐던 현상이 큰 간격에서는 경로의 성격까지 바꿀 수 있습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 지금 본 규칙과 계산 방법에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["현재 양이 얼마나 빨리 달라지는지 정하기","미분방정식: dx/dt=f(t,x)"],
["시작 시각의 값까지 주어 경로 구하기","초기값 문제(initial-value problem): x(0)=x₀"],
["각 시각·상태의 변화율과 이를 따라간 경로","벡터장(vector field) f와 궤적(trajectory) x(t)"],
["한 번 움직일 시간과 여러 번 움직이는 계산기","간격(step size) h와 수치해법(numerical solver)"],
["출발점의 속도만 사용해 이동하기","명시적 오일러 방법(explicit Euler method)"],
["출발점과 예상 끝점의 속도를 평균하기","호인 방법(Heun method), 2단계 Runge–Kutta 방법"],
["시간만 따라 미지의 함수가 바뀌는 식","상미분방정식(ordinary differential equation, ODE)"],
["변화율 함수를 호출한 횟수","NFE(number of function evaluations)"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((x,j)=><td key={j} className="p-3 align-top">{x}</td>)}</tr>)}</tbody></table></div>
<p>여기서 ‘명시적’이라는 말은 이미 아는 현재 값으로 다음 값을 직접 구한다는 뜻입니다. 뒤에서 부를 확률 미분방정식은 별도의 무작위 변화까지 포함합니다. 먼저 현재의 ODE 사례를 수식과 코드에서 끝까지 따라갑니다.</p>
</section>
<section id="initial-value" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 변화율의 단위와 시작값을 정하면 기준 경로를 구할 수 있다</h2>
<p>감소 규칙을 f(t,x)=−λx로 적습니다. 시간 t를 초로 재면 양의 감소 계수 λ의 단위는 초의 역수입니다. λx의 단위가 양/초가 되어야 dx/dt와 맞습니다. hλ나 λt에는 단위가 없어야 하며 이를 그대로 지수 함수의 입력에 넣습니다.</p>
<ExplainedFormula question="현재 양에 비례해 줄어드는 경로는 무엇인가요?" idea="지수 함수의 미분이 자기 자신에 지수의 변화율을 곱한 값이라는 성질을 사용합니다. 시작 시각에도 값을 대입해 확인합니다."
formula={String.raw`\frac{dx}{dt}=-\lambda x,\quad x(0)=x_0\quad\Longrightarrow\quad x(t)=x_0e^{-\lambda t}`}
annotatedFormula={String.raw`\begin{gathered}x'=-\lambda x,\quad x(0)=x_0,\quad x(t)=\underbrace{x_0e^{-\lambda t}}_{\text{기준 경로}}\\\frac{d}{dt}(x_0e^{-\lambda t})=-\lambda x_0e^{-\lambda t}=-\lambda x(t)\end{gathered}`}
operations={[{expression:String.raw`x(1)=1\cdot e^{-1}\approx0.36787944`,annotation:["같은 사례에서는 λ=1 s⁻¹, x₀=1입니다. 0.5초에는 e^(−0.5)≈0.60653066입니다."]}]}
terms={[{symbol:"λ",name:"감소 계수",description:"현재 양에 곱해 초당 변화율의 크기를 구합니다."},{symbol:"x₀",name:"시작값",description:"t=0에서 주어진 양입니다."},{symbol:"x(t)",name:"연속된 경로",description:"각 시각의 값을 주는 함수입니다."}]}
assumptions={["λ>0은 상수이고 시간 단위를 맞춥니다.","유한한 시각에서 양의 시작값은 정확한 경로상 양수입니다."]} interpretation="λ=2 s⁻¹, x₀=3이면 x(t)=3e^(−2t)이며 0.5초 뒤 3/e≈1.103638입니다." />
<p>λ=2 s⁻¹과 h=0.1 s의 곱은 0.2입니다. λ만 보고 한 단계가 얼마나 크게 움직이는지 판단할 수는 없습니다. 같은 속도 규칙에서 간격이 달라지면 한 단계의 상대 변화량도 달라집니다.</p>
<p>벡터장은 지금 어디에 있든 변화율을 알려 주는 규칙입니다. 궤적은 특정 시작값에서 이 규칙을 따라간 결과입니다. λ=2인 같은 벡터장에서도 시작값이 1이면 e^(−2t), 시작값이 3이면 3e^(−2t)라는 서로 다른 궤적입니다.</p>
<p>일반적인 초기값 문제가 언제나 하나의 경로를 결정하는 것은 아닙니다. f가 시간에 연속이고 상태에 대해 국소적으로 Lipschitz이면 시작점 근처의 해가 유일하다는 표준 조건을 사용할 수 있습니다. 이는 가까운 상태 사이의 변화율 차이가 일정 배수 안에 제한된다는 조건입니다. 이 글의 선형 규칙은 이를 만족합니다.</p>
<ProgressiveDetail title="시작값을 같게 주어도 여러 해가 가능한 반례" preview="현재의 선형 감소에서는 문제가 없지만 일반 규칙으로 넓힐 때는 존재·유일성의 조건이 필요합니다.">
<p>x′=2√|x|, x(0)=0을 생각해 봅시다. 임의의 a≥0에 대해 t≤a에서는 0, t&gt;a에서는 (t−a)²인 함수가 t≥0에서 식을 만족합니다. 붙이는 시각에도 양쪽 미분값은 0입니다. 출발점 근처에서 변화율의 차이를 상태 차이의 일정 배수로 묶을 수 없어 앞의 유일성 조건이 깨집니다.</p>
<p>유일한 해가 있어도 원하는 시간까지 존재하는지 확인해야 합니다. x′=x², x(0)=1의 해 1/(1−t)는 t=1에 가까워지면 커집니다. 간격을 잘게 나눈다는 이유만으로 이 해를 유한한 값으로 1초 너머까지 이어 갈 수는 없습니다.</p>
</ProgressiveDetail>
</section>
<section id="euler-method" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 현재 변화율에 간격을 곱하고 현재 값에 더한다</h2>
<p>현재 시각을 tₙ, 그 시각에 계산한 값을 xₙ이라고 적습니다. 연속 경로의 정확한 값 x(tₙ)과 구별하기 위해 아래 첨자를 사용합니다. 한 단계에서는 시각을 h만큼 늘리고 상태에는 hf(tₙ,xₙ)을 더합니다.</p>
<ExplainedFormula question="첫 단계의 계산이 모든 단계에서 어떻게 반복되나요?" idea="현재 변화율을 한 간격 동안 유지한다고 근사합니다. 변화율의 단위에 시간을 곱하면 현재 상태에 더할 수 있는 양이 됩니다."
formula={String.raw`t_{n+1}=t_n+h,\qquad x_{n+1}=x_n+h f(t_n,x_n)`}
annotatedFormula={String.raw`\begin{gathered}t_{n+1}=t_n+h,\qquad x_{n+1}=x_n+\underbrace{h f(t_n,x_n)}_{\text{현재 속도로 구한 변화량}}\\x_1=1+0.5(-1)=0.5,\qquad x_2=0.5+0.5(-0.5)=0.25\end{gathered}`}
operations={[{expression:String.raw`x_n=x_0(1-h\lambda)^n`,annotation:["감소 규칙에서는 xₙ₊₁=(1−hλ)xₙ입니다. 같은 배율을 n번 곱하면 이 식을 얻습니다."]}]}
terms={[{symbol:"h",name:"한 단계의 시간",description:"여기서는 0.5초로 고정합니다."},{symbol:"f(tₙ,xₙ)",name:"현재 변화율",description:"현재 시각과 계산한 상태에서 평가합니다."},{symbol:"hf(tₙ,xₙ)",name:"변화량",description:"새 상태 자체가 아니라 현재 상태에 더할 값입니다."}]}
assumptions={["현재 사례는 h>0으로 앞으로 움직입니다.","부동소수점 반올림을 제외한 수학적 반복을 먼저 계산합니다."]} interpretation="h=.25에서는 두 단계 뒤 x₂=.5625이며 같은 t=.5의 기준값 .60653066과 차이가 약 .044031입니다." />
<div id="paper-fnc-euler"><CitationBlock source="Driscoll·Braun, Fundamentals of Numerical Computation v1.0 · Euler's method" citeKey={1} href="https://fncbook.github.io/v1.0/ivp/euler.html">원문 식 (168)의 다음 값에 현재 값과 h×변화율을 더하는 규칙을 사용합니다. 원문의 함수 인자는 시각과 상태이며 여기에 f(t,x)=−x, h=0.5, x₀=1을 넣으면 위의 0.5와 0.25가 나옵니다.</CitationBlock></div>
</section>
<section id="error" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 한 번 놓친 굽음과 여러 번 누적된 오차를 구별한다</h2>
<p>정확한 출발점에서 한 번만 이동해 봅시다. 이 사례의 첫 단계 오차는 e^(−h)−(1−h)입니다. 지수 함수를 전개하면 h²/2−h³/6+…이므로 h가 작아질 때 주된 항은 h²에 비례합니다. 출발점에서 접선으로 움직이며 놓친 곡선의 굽음입니다.</p>
<ExplainedFormula question="한 단계의 오차가 h²인데 왜 전체 오차는 보통 h에 비례하나요?" idea="같은 최종 시간까지 가려면 대략 1/h번 이동합니다. 앞의 오차가 다음 계산에 전해지는 크기까지 제한해야 전체 오차의 상한을 얻습니다."
formula={String.raw`\delta_n=x(t_n+h)-x(t_n)-h f(t_n,x(t_n))=\tfrac12h^2x''(t_n)+O(h^3)`}
annotatedFormula={String.raw`\begin{gathered}\delta_n=x(t_n+h)-x(t_n)-h f(t_n,x(t_n))\\\delta_n=\underbrace{\tfrac12h^2x''(t_n)}_{\text{접선이 놓친 주된 굽음}}+O(h^3)\\E_{n+1}\le(1+hL)E_n+Ch^2\\E_n\le\frac{Ch}{L}\bigl(e^{Lt_n}-1\bigr)\end{gathered}`}
operations={[{expression:String.raw`h^2\times(T/h)\sim h`,annotation:["단계 수를 곱하는 계산은 차수의 직관입니다. 실제 증명은 오차의 전파 계수 1+hL을 함께 누적합니다."]}]}
terms={[{symbol:"δₙ",name:"한 단계 결손",description:"정확한 값에서 출발한 한 번의 오차입니다."},{symbol:"Eₙ",name:"전체 오차 크기",description:"계산값과 같은 시각의 정확한 값 사이 차이입니다."},{symbol:"L",name:"변화율의 상태 민감도 상한",description:"오차가 다음 단계로 전달될 때 늘어나는 정도를 제한합니다."}]}
assumptions={["고정된 유한 시간 구간에서 필요한 미분과 한 단계 결손의 상한이 존재합니다.","h>0, L>0이며 시작값의 오차는 0입니다. 반올림과 모델 오차는 별도입니다."]} interpretation="매끄러운 문제의 충분히 작은 간격에서는 Euler의 전체 오차가 보통 O(h)입니다. 간격을 절반으로 하면 오차가 약 절반이 되며 정확히 절반이라는 등식은 아닙니다." />
<p>같은 t=1에서 h=0.2이면 계산값은 0.8⁵=0.32768, 오차는 약 0.040199입니다. h=0.1이면 0.9¹⁰≈0.348678, 오차는 약 0.019201입니다. 단계는 5번에서 10번으로 늘고 오차 비율은 약 0.478입니다. 한 번의 비교만으로 모든 문제의 수렴 차수를 입증한 것은 아닙니다.</p>
<p>원문을 읽을 때 오차의 정의도 확인해야 합니다. 위 FNC 식 (171)은 한 단계 결손을 h로 나눈 값을 국소 절단 오차라고 정의합니다. 따라서 원문의 Euler 국소 절단 오차는 O(h)이고, 여기서 나누기 전 결손 δₙ은 O(h²)입니다. 같은 계산을 서로 다른 단위로 부른 것이므로 차수만 떼어 비교하면 모순처럼 보입니다.</p>
<ProgressiveDetail title="전체 오차 상한을 얻는 짧은 유도" preview="상태의 오차가 다음 단계에 얼마나 전달되는지 먼저 제한한 뒤 등비합을 더합니다.">
<p>정확한 경로와 수치 반복을 빼고 |f(t,u)−f(t,v)|≤L|u−v|를 적용하면 Eₙ₊₁≤(1+hL)Eₙ+Ch²입니다. E₀=0에서 반복하면 Ch²에 1, (1+hL), …, (1+hL)ⁿ⁻¹을 곱한 합이 나옵니다.</p>
<p>등비합을 계산하면 Eₙ≤(Ch/L)((1+hL)ⁿ−1)입니다. 1+hL≤e^(hL), nh=tₙ를 쓰면 표시한 상한이 됩니다. L=0인 경우에는 나누는 식 대신 Eₙ≤nCh²=Ctₙh를 사용합니다. FNC의 정리 6.2는 이를 일반 차수 p의 한 단계 방법으로 설명합니다.</p>
</ProgressiveDetail>
</section>
<section id="stability" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 줄어드는 원래 문제를 계산이 키우지 않도록 간격을 제한한다</h2>
<p>감소 규칙에 Euler를 적용하면 한 단계 배율이 1−hλ입니다. 원래 경로는 양의 λ에서 줄어들지만 이 배율의 절댓값이 1보다 크면 계산값의 크기는 커집니다. 원래 현상의 증가가 아니라 간격 선택 때문에 생긴 증가입니다.</p>
<ExplainedFormula question="양의 감소 계수에서 계산값의 크기가 0으로 가려면 어떤 간격이 필요한가요?" idea="같은 배율을 반복해서 곱하므로 그 절댓값이 1보다 작아야 비영 시작값이 감쇠합니다."
formula={String.raw`|1-h\lambda|<1\quad\Longleftrightarrow\quad0<h\lambda<2`}
annotatedFormula={String.raw`-1<1-h\lambda<1\quad\Longleftrightarrow\quad0<h\lambda<2`}
operations={[{expression:"1−hλ",annotation:["1은 현재 값을 그대로 남기는 항이고 hλ는 한 단계에서 빼는 비율입니다.","0<hλ<1이면 부호를 지키며 줄고, 1<hλ<2이면 부호가 번갈아 바뀌며 크기가 줄어듭니다."]}]}
terms={[{symbol:"1−hλ",name:"한 단계 증폭 계수",description:"값이 양수인지와 크기가 줄어드는지를 함께 결정합니다."}]}
assumptions={["h>0, λ>0인 선형 감소 문제의 Euler 반복입니다.","비영 시작값의 점근 감쇠 조건입니다. 0에서 시작하면 모든 단계가 0입니다."]} interpretation="hλ=1에서는 한 번 만에 계산값이 0입니다. 수치적으로 감쇠하지만 유한 시간의 정확한 양의 해를 잘 맞춘다는 뜻은 아닙니다." />
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["λ=10일 때 h","한 단계 배율","x₀=1의 계산 경로"].map(x=><th key={x} className="p-3">{x}</th>)}</tr></thead><tbody>{[["0.1","0","1 → 0 → 0"],["0.2","−1","1 → −1 → 1"],["0.25","−1.5","1 → −1.5 → 2.25"],["0.3","−2","1 → −2 → 4"]].map((r,i)=><tr key={i} className="border-t border-border">{r.map((x,j)=><td key={j} className="p-3">{x}</td>)}</tr>)}</tbody></table></div>
<p>hλ=2에서는 크기가 일정하게 진동하고 0으로 줄지 않습니다. hλ&gt;2에서는 크기가 커집니다. 안정성은 특정 오차나 상태가 반복에서 과도하게 커지는지 묻고 정확도는 원하는 경로와 얼마나 가까운지 묻습니다. 둘을 같은 점수로 취급하지 않습니다.</p>
</section>
<section id="heun-runge-kutta" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 예상 끝점의 기울기도 읽어 첫 결과를 고친다</h2>
<p>같은 첫 단계에서 출발 기울기는 −1입니다. Euler로 예상한 끝점은 0.5이고 그곳의 기울기는 −0.5입니다. 두 기울기의 평균 −0.75로 0.5초 움직이면 변화량은 −0.375이고 새 값은 0.625입니다. 기준값 약 0.6065에 첫 Euler 값 0.5보다 가깝습니다.</p>
<ExplainedFormula question="두 번 읽은 변화율을 어떻게 한 단계로 합치나요?" idea="첫 변화율로 예상 끝점을 만든 뒤 그 위치의 변화율을 다시 구합니다. 두 값을 평균해 원래 출발점에서 최종 이동량을 계산합니다."
formula={String.raw`\begin{aligned}k_1&=f(t_n,x_n),&\widetilde x&=x_n+hk_1\\k_2&=f(t_n+h,\widetilde x),&x_{n+1}&=x_n+\tfrac h2(k_1+k_2)\end{aligned}`}
annotatedFormula={String.raw`\begin{aligned}k_1&=f(t_n,x_n),&\widetilde x&=x_n+hk_1\\k_2&=f(t_n+h,\widetilde x),&x_{n+1}&=x_n+\underbrace{\tfrac h2(k_1+k_2)}_{\text{두 속도의 평균으로 이동}}\\k_1&=-1,&\widetilde x&=0.5,\quad k_2=-0.5\\x_1&=1+\tfrac{0.5}{2}(-1-0.5)=0.625\end{aligned}`}
operations={[{expression:"x₂=0.625×0.625=0.390625",annotation:["같은 감소 문제에서는 단계마다 배율이 같습니다. t=1의 기준값 약 .367879보다 약 .022746 큽니다."]}]}
terms={[{symbol:"k₁",name:"출발 기울기",description:"현재 시각·상태에서 구한 변화율입니다."},{symbol:"x̃",name:"예상 끝점",description:"첫 기울기만 사용해 임시로 이동한 상태입니다."},{symbol:"k₂",name:"끝점 기울기",description:"예상 끝점에서 새로 구한 변화율입니다."}]}
assumptions={["필요한 매끄러움과 오차 전파 조건 아래 전체 오차가 O(h²)인 2차 방법입니다.","한 단계에 두 번의 변화율 평가가 필요하며 추가 보간 등의 호출은 별도입니다."]} interpretation="같은 h=.5에서 Euler의 한 번 평가와 Heun의 두 번 평가를 비교합니다. 같은 단계 수가 같은 계산 비용이라는 뜻은 아닙니다." />
<p>높은 차수가 모든 안정성 문제를 없애지는 않습니다. a=hλ라 두면 Heun의 감소 문제 배율은 1−a+a²/2입니다. 이는 ((a−1)²+1)/2로 항상 양수이며 1보다 작으려면 a(a−2)&lt;0이어야 합니다. 따라서 양의 a에서 엄격히 감쇠하는 구간은 Euler와 같은 0&lt;a&lt;2입니다.</p>
<p>h=0.25로 줄이면 Heun의 단계 배율은 0.78125이고 네 단계 뒤 약 0.372529입니다. h=0.5의 0.390625보다 기준값에 가깝지만 이 개선은 지금의 매끄러운 선형 사례에서 확인한 결과입니다. 급격한 변화나 불연속, 반올림이 지배하는 상황에서는 간격·방법·조건을 다시 검사해야 합니다.</p>
</section>
<section id="source" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 실제 코드의 반환값이 새 상태인지 변화량인지 읽는다</h2>
<p>torchdiffeq 저장소의 commit 657943acefa826ef04c025ebeb1ff5e9d60dc268을 고정했습니다. 이 원문의 버전 문자열은 0.2.5입니다. 출시 태그 전체가 같다고 가정하지 않습니다. 전체 파일과 MIT 라이선스·해시를 보관했으며 아래에서는 실제 코드에 같은 숫자를 대입해 추적합니다. 라이브러리 실행 결과와는 구분합니다.</p>
<p>먼저 odeint.py의 방법 표에서 euler는 Euler, heun2는 Heun2 클래스로 연결됩니다. 호출 함수는 func(t,y) 순서로 시각과 상태를 받습니다. 같은 사례의 함수는 두 번째 인자에 마이너스를 붙여 돌려줍니다. 시작값 y0는 1이고 step_size를 0.5로 지정한 경우를 읽습니다.</p>
<CodeViewButton label="원본 방법 선택과 solver 호출" onClick={()=>sidebar.open("entry",odeCodeRefs.entry)}/>
<p>fixed_grid.py의 Euler._step_func는 f0=func(t0,y0)를 계산한 뒤 dt*f0와 f0를 반환합니다. 첫 호출에서 이 두 값은 −0.5와 −1입니다. 반환된 −0.5를 새 상태라고 읽으면 부호부터 틀립니다. solvers.py의 반복문이 y1=y0+dy를 수행해야 새 상태 0.5가 됩니다.</p>
<CodeViewButton label="원본 Euler 변화량 반환" onClick={()=>sidebar.open("euler",odeCodeRefs.euler)}/>
<CodeViewButton label="원본 반복문과 상태 덧셈" onClick={()=>sidebar.open("integrate",odeCodeRefs.integrate)}/>
<p>반복문 끝에서 y0=y1로 저장한 뒤 다음 단계로 갑니다. 따라서 다음 함수 입력은 0.5이고 f0=−0.5, dy=−0.25, y1=0.25 순서가 됩니다. 수식의 아래 첨자 n을 코드가 별도 상태 변수와 반복문의 시각 쌍으로 구현한 것입니다.</p>
<p>Heun2는 처음 구한 f0를 rk2_step_func에 넘깁니다. 계수표의 두 번째 줄은 예상 끝점에 한 간격을 적용하고 마지막 줄의 두 0.5는 기울기를 반씩 더하게 합니다. 실제 함수 안에서는 k1=−1을 재사용하고 예상 상태 0.5에서 k2=−0.5를 구합니다. 반환 변화량은 −0.375이며 같은 반복문이 더해 0.625를 만듭니다.</p>
<CodeViewButton label="원본 Heun2 계수표" onClick={()=>sidebar.open("heun",odeCodeRefs.heun)}/>
<CodeViewButton label="원본 두 기울기 계산" onClick={()=>sidebar.open("rk2",odeCodeRefs.rk2)}/>
<p>출력 시각 목록과 내부 간격도 코드를 보고 구분할 수 있습니다. t=[0,0.25,1]을 요청하고 step_size=0.5를 쓰면 내부 격자는 0,0.5,1입니다. 기본 선형 보간으로 반환하는 0.25초의 값은 1과 0.5의 중간인 0.75입니다. 이 값은 정확한 e^(−0.25)≈0.778801도 아니고 내부에서 0.25초 간격으로 끝까지 계산했다는 증거도 아닙니다.</p>
<p>step_size를 지정하지 않은 이 고정 간격 클래스는 요청한 t 자체를 계산 격자로 사용합니다. 같은 t=[0,0.25,1]이면 첫 간격 0.25 뒤에 간격 0.75로 이동하여 끝값은 0.75×0.25=0.1875입니다. 출력 시각을 더 적는 행동이 이 설정에서는 실제 결과를 바꿀 수 있습니다.</p>
<p>기본 선형 보간은 변화율을 추가로 읽지 않지만 cubic 분기는 끝점 변화율 f1을 호출합니다. 이 호출은 요청 시각을 처리하는 반복문 안에 있습니다. 따라서 NFE를 정확히 셀 때는 방법의 기본 단계 수에 보간, 초기 간격 선택, 거절된 시도 등의 호출도 포함해야 합니다.</p>
<div id="paper-torchdiffeq"><CitationBlock source="torchdiffeq · commit 657943a의 fixed_grid.py, solvers.py, rk_common.py" citeKey={2} href="https://github.com/rtqichen/torchdiffeq/blob/657943acefa826ef04c025ebeb1ff5e9d60dc268/torchdiffeq/_impl/fixed_grid.py">같은 감소 사례에서 변화율, 반환 변화량, 새 상태가 어디서 만들어지는지 전체 원문으로 대조했습니다. 본문의 수동 추적과 특정 장치에서의 실제 라이브러리 실행 결과는 구분합니다.</CitationBlock></div>
</section>
<section id="adaptive" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 간격을 자동으로 바꿀 때도 무엇을 허용했는지 확인한다</h2>
<p>가변 간격 방법은 한 번의 시도에서 얻은 오차 추정이 허용 범위를 넘으면 그 시도를 거절하고 더 작은 간격으로 다시 계산할 수 있습니다. 충분히 작으면 다음 간격을 키울 수 있습니다. 이 판단에 쓰는 상대 허용오차 rtol과 절대 허용오차 atol은 역할이 다릅니다. 값이 0에 가까운 성분에도 atol이 기준을 남깁니다.</p>
<p>고정한 원문의 misc.py는 성분마다 atol+rtol×max(|y0|,|y1|)를 구하고 오차 추정을 이것으로 나눈 뒤 지정한 norm을 계산합니다. 한 성분에서 y0=1, y1=0.5, atol=0.001, rtol=0.01이면 기준은 0.011입니다(가정). 오차 추정 0.022는 비율 2, 추정 0.0055는 비율 0.5입니다.</p>
<CodeViewButton label="원본 허용오차 기준과 다음 간격 배율" onClick={()=>sidebar.open("ratio",odeCodeRefs.ratio)}/>
<p>rk_common.py의 기본 판정은 이 비율이 1 이하인지입니다. 다만 max_step과 min_step의 별도 분기가 판정을 덮어씁니다. 특히 설정한 최소 간격에 닿으면 수락을 강제할 수 있습니다. 다음 간격에는 안전 계수와 변화 배율의 상하한도 적용합니다. 따라서 비율이 2라고 해서 항상 정확히 절반 간격이 되는 것은 아닙니다.</p>
<CodeViewButton label="원본 수락·거절과 최소 간격 예외" onClick={()=>sidebar.open("adaptive",odeCodeRefs.adaptive)}/>
<p>앞에서 쓴 고정 간격 Euler 클래스는 생성자에서 rtol을 꺼내 버립니다. 일반적인 고정 격자 적분에서는 rtol만 더 작게 써도 간격이 줄지 않습니다. 이벤트 탐색은 또 다른 경로입니다. 허용오차를 바꾼 실험이라면 어떤 방법과 옵션이 그 값을 실제로 사용하는지부터 확인합니다.</p>
<p>허용오차를 엄격히 하면 같은 문제에서 거절된 시도와 NFE가 늘어날 수 있습니다. 이는 추정한 국소 오차를 제어하는 절차이며 최종 상태의 실제 오차, 현실 모델의 오차, 특정 시간 안에 끝난다는 보장을 한꺼번에 주지 않습니다. 여러 성분을 하나의 norm으로 모은다면 그 norm이 어떤 차이를 크게 보는지도 기록합니다.</p>
</section>
<section id="ode-sde-boundary" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 무작위 흔들림은 시간의 제곱근 크기로 더한다</h2>
<p>이번에는 같은 감소 규칙에 작은 무작위 흔들림을 더합니다. 평균적으로 이동시키는 항은 표류항(drift)입니다. 흔들림이 누적되는 과정은 브라운 운동(Brownian motion) W입니다. 이들을 함께 쓴 확률 미분방정식(stochastic differential equation, SDE)은 같은 시작값에서도 여러 표본 경로를 만들 수 있습니다.</p>
<p>길이 h인 시간 구간의 Brownian 증가량은 평균 0, 분산 h입니다. 서로 겹치지 않는 구간의 증가량은 독립입니다. 따라서 평균 0, 분산 1인 표준 정규 난수 ε에 √h를 곱해 증가량을 만들 수 있습니다. h=0.04이면 표준편차는 0.2입니다.</p>
<ExplainedFormula question="감소와 무작위 변화를 한 단계에 어떻게 함께 넣나요?" idea="현재 상태의 평균 변화에는 h를 곱하고 무작위 증가량에는 √h를 곱합니다. 두 항은 시간에 대한 크기 변화가 다릅니다."
formula={String.raw`dx=f(t,x)\,dt+g(t,x)\,dW,\qquad x_{n+1}=x_n+h f(t_n,x_n)+g(t_n,x_n)\sqrt h\,\varepsilon_n`}
annotatedFormula={String.raw`\begin{gathered}dx=f(t,x)\,dt+g(t,x)\,dW\\x_{n+1}=x_n+\underbrace{h f(t_n,x_n)}_{\text{평균 변화}}+\underbrace{g(t_n,x_n)\sqrt h\,\varepsilon_n}_{\text{무작위 변화}}\\x_{n+1}=1+0.25(-1)+0.2\sqrt{0.25}\,\varepsilon_n\\=0.75+0.1\varepsilon_n\end{gathered}`}
operations={[{expression:String.raw`\operatorname{Var}[g\sqrt h\,\varepsilon\mid x_n]=g^2h`,annotation:["현재 상태를 고정한 한 단계에서 잡음의 분산에는 g²도 곱해야 합니다.","g=2, h=.01이면 평균 0, 분산 .04, 표준편차 .2입니다. 모든 SDE 잡음 분산이 h인 것은 아닙니다."]}]}
terms={[{symbol:"g(t,x)",name:"흔들림의 계수",description:"스칼라 상태에서는 단위가 상태/√시간입니다."},{symbol:"εₙ",name:"표준 정규 난수",description:"각 단계에 독립이며 평균 0, 분산 1입니다."},{symbol:"Euler–Maruyama",name:"현재 값에서 두 항을 평가하는 방법",description:"여기서는 Itô 적분으로 해석한 SDE를 근사합니다."}]}
assumptions={["1차원 Brownian motion과 Itô SDE를 다룹니다.","다차원 독립 Brownian 증가량에서는 조건부 잡음 공분산이 hGGᵀ입니다."]} interpretation="현재 xₙ=1, h=.25, g=.2인 가정 사례의 다음 값은 평균 .75, 표준편차 .1입니다. 이는 한 단계 근사의 조건부 분포입니다." />
<div id="paper-higham-em"><CitationBlock source="Desmond J. Higham (2001), SIAM Review · §2, 식 (4.3)" citeKey={3} href="https://epubs.siam.org/doi/10.1137/S0036144500378302">원문은 겹치지 않는 Brownian 증가량의 독립성과 Euler–Maruyama의 현재 값 평가를 사용합니다. 식 (4.3)에 이 글의 f(x)=−x, g(x)=0.2, h=0.25를 넣으면 위의 0.75+0.1ε가 됩니다. 논문의 별도 실험 결과를 이 가정 사례의 측정값으로 쓰지 않습니다.</CitationBlock></div>
<p>이 표기는 W를 시간으로 보통 미분한다는 뜻이 아닙니다. Brownian 경로는 확률 1로 어느 시각에서도 보통 의미로 미분되지 않으므로 적분의 정의가 필요합니다. 이 글은 왼쪽 끝 상태에서 평가하는 Itô 해석을 사용합니다. 다른 적분 해석이나 일반 SDE에 ODE의 Heun 공식을 그대로 붙여 같은 2차 정확도를 주장하지 않습니다.</p>
<p>정규 난수는 아주 작은 확률로 큰 음수도 낼 수 있습니다. 따라서 이 흔들림을 더한 상태가 항상 양수라고 보장할 수는 없습니다. 양이 음수가 되면 안 되는 현실의 문제에 적용하려면 확률 모델과 수치 방법이 그 제약을 지키는지 별도로 검토해야 합니다.</p>
</section>
<section id="noise-variance" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">15 · 잡음의 합과 최종 상태의 분산은 다를 수 있다</h2>
<p>전체 시간 T를 길이 h의 n개 구간으로 나누어 T=nh라고 합시다. 독립적인 표준 정규 난수에 √h를 곱한 증가량들을 더하면 분산은 nh=T입니다. 잘못해서 h를 곱하면 각 분산은 h²이고 전체는 nh²=Th입니다. 간격을 줄일수록 원래 남아야 할 흔들림이 사라집니다.</p>
<p>T=1을 네 번으로 나누면 h=0.25입니다. 올바른 증가량의 전체 분산은 4×0.25=1이지만 hε를 더하면 4×0.25²=0.25입니다. 열여섯 번으로 나누면 잘못된 전체 분산은 0.0625로 더 작아집니다. 이는 Brownian 증가량 자체의 합에 대한 계산입니다.</p>
<p>감소까지 있는 상태의 분산은 이 합과 다릅니다. 같은 h=0.25, g=0.2의 수치 반복은 xₙ₊₁=0.75xₙ+0.1εₙ입니다. εₙ은 과거와 독립이므로 상태 분산 vₙ은 vₙ₊₁=0.75²vₙ+0.01을 따릅니다. 확정된 시작값에서 v₀=0이면 v₁=0.01, v₂=0.015625입니다.</p>
<p>두 번 들어온 원시 잡음의 분산을 그냥 더한 0.02보다 작습니다. 첫 잡음의 영향이 다음 단계의 감소를 거치며 0.75배로 줄었기 때문입니다. 연속 SDE의 정확한 분산과 이 수치 반복의 분산도 따로 비교해야 합니다.</p>
<p>경로의 오차를 비교할 때는 같은 Brownian 경로의 증가량을 묶어 굵은 간격과 가는 간격에 사용해야 합니다. 서로 다른 난수를 뽑은 두 결과의 차이에는 수치 오차뿐 아니라 원래의 무작위 차이도 들어갑니다. 평균이나 분포를 비교하는 실험과 같은 경로를 얼마나 잘 따라가는지 비교하는 실험의 기준을 나눕니다.</p>
</section>
<section id="applications" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">16 · 신경망의 변화율과 이를 따라가는 계산 비용을 따로 잰다</h2>
<p>신경망이 f(t,x)를 출력해도 오늘의 구분은 그대로입니다. 신경망은 현재 상태에서 어느 방향으로 얼마나 움직일지 제안하고 solver는 시각과 상태를 갱신합니다. 학습한 변화율의 오류는 모델 오차, 그 변화율을 유한 간격으로 따라가며 생긴 차이는 수치 오차입니다.</p>
<p>방법을 비교할 때는 최종 시각과 입력·시작값을 맞추고 간격 또는 허용오차, 수락·거절 횟수, NFE, 실제 실행 시간과 메모리를 함께 기록합니다. 정확한 해를 모르면 더 엄격한 별도 기준 계산과의 차이를 보되 그 기준도 근사임을 밝힙니다. 같은 NFE라도 모델 크기와 배치·장치가 다르면 시간이 달라집니다.</p>
<p>가령 Euler의 간격을 절반으로 줄여 호출을 두 배로 늘리는 선택과 Heun으로 바꾸어 한 단계에 두 번 호출하는 선택이 있습니다. 같은 비용에 어느 쪽이 좋은지는 문제의 매끄러움, 안정성 제약, 요구한 오차와 구현에 따라 달라집니다. 특정 사례의 작은 오차를 모든 생성 모델의 품질 향상으로 바로 확대하지 않습니다.</p>
<p>Diffusion이나 flow에서는 시간의 진행 방향, 학습한 출력이 변화율인지 잡음인지, ODE인지 SDE인지부터 확인합니다. 이 글의 감소 사례에서 확인한 계산 규칙만으로 각 모델의 변환식을 생략할 수는 없습니다. 다음 글에서 그 모델의 식과 실제 sampler를 연결합니다.</p>
<p><Link className="text-sky-700 underline" to="/cs/ai/diffusion-continuous-time">연속시간 diffusion·score·flow의 적용 읽기</Link></p>
</section>
<section id="predict" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">17 · 설정을 바꾸기 전에 결과를 예측한다</h2>
<p>λ=10, h=0.2인 Euler 계산이 1, −1, 1을 반복합니다. 원래 현상이 진동한다고 해석해도 될까요? 같은 문제에서 h=0.1이면 0이 되는 것이 정확하다는 뜻일까요? (답: 10절)</p>
<p>고정 간격 Euler에 step_size=0.5를 둔 채 rtol만 더 엄격히 했습니다. 단계 수가 자동으로 늘어날까요? 출력 시각 0.25를 목록에 넣은 것만으로 그 간격에서 실제로 계산했다고 볼 수 있을까요? (답: 12·13절)</p>
<p>Brownian 증가량을 hε로 만들고 h를 계속 줄이면 전체 시간 1의 분산은 어떻게 될까요? 올바른 √hε를 사용했더라도 감소하는 상태의 두 단계 분산을 원시 잡음의 합 0.02라고 적어도 될까요? (답: 15절)</p>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={odeCodeRefs} fileTrees={{torchdiffeq:{name:"torchdiffeq",type:"dir",children:[{name:"_impl/fixed_grid.py",type:"file",path:"torchdiffeq/_impl/fixed_grid.py",codeKey:"euler"},{name:"_impl/solvers.py",type:"file",path:"torchdiffeq/_impl/solvers.py",codeKey:"integrate"},{name:"_impl/rk_common.py",type:"file",path:"torchdiffeq/_impl/rk_common.py",codeKey:"rk2"},{name:"_impl/misc.py",type:"file",path:"torchdiffeq/_impl/misc.py",codeKey:"ratio"},{name:"_impl/odeint.py",type:"file",path:"torchdiffeq/_impl/odeint.py",codeKey:"entry"}]}}} projectMetas={{torchdiffeq:{id:"torchdiffeq",label:"torchdiffeq · 657943a",badgeClass:"border-border"}}}/>
</article>;}
