import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import OptimizationProblemViz from "./OptimizationProblemViz";

const BOYD = "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=141";
const MIT = "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/";

export default function OptimizationObjectivesArticle() {
  return <article className="space-y-16">
    <section id="overview" data-teach-level="S" className="space-y-6">
      <h2 className="text-2xl font-bold">1 · 가장 낮은 점수를 찾아도 쓸 수 없는 답일 수 있다</h2>
      <p className="text-lg leading-8">모델을 학습하거나 배치 크기를 고를 때는 여러 선택을 숫자로 비교합니다. 그런데 가장 낮은 오차를 낸 모델이 장치의 메모리에 들어가지 않으면 그 선택을 사용할 수 없습니다. 무엇을 바꿀지, 어떤 숫자를 낮출지, 반드시 지켜야 할 규칙이 무엇인지를 먼저 정해야 합니다.</p>
      <p>이번 글에서는 숫자 하나를 고르는 작은 문제로 이 세 가지를 분리합니다. 점수를 가장 낮게 만드는 위치를 찾은 뒤 같은 점수 규칙에 허용 범위를 추가해 보겠습니다. 탐색 방법을 고르는 일은 문제의 뜻을 확정한 다음입니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="space-y-6">
      <h2 className="text-2xl font-bold">2 · 선택을 받아 허용 여부와 점수를 돌려준다</h2>
      <p>조절 가능한 설정값 하나를 고릅니다. 3에서 얼마나 떨어졌는지를 제곱하고 2를 더해 점수를 매깁니다(가정). 3을 고르면 점수 2, 2를 고르면 점수 3입니다. 여기서는 작은 점수를 더 좋은 선택으로 정했습니다.</p>
      <p>이와 별개로 설정값은 0 이상 2 이하여야 한다는 규칙을 둡니다(가정). 그러면 3은 점수가 좋아도 사용할 수 없습니다. 장치는 선택 하나에 대해 “허용됨 또는 허용되지 않음”과 “점수 얼마”를 따로 돌려줍니다.</p>
      <p>이 글의 설정값은 연속적인 실수입니다. 정수만 고를 수 있는 장비 대수와는 조건이 다릅니다. 점수를 계산하는 식은 고정하고 설정값과 허용 범위만 바꾸겠습니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="space-y-6">
      <h2 className="text-2xl font-bold">3 · 점수 2인 선택을 제외하면 점수 3인 선택이 남는다</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[440px] text-sm"><thead><tr><th className="p-3 text-left">고른 값</th><th className="p-3 text-left">점수 계산</th><th className="p-3 text-left">0 이상 2 이하인가?</th></tr></thead><tbody>{[['0','(0−3)²+2=11','예'],['1','(1−3)²+2=6','예'],['2','(2−3)²+2=3','예'],['3','(3−3)²+2=2','아니오']].map(row=><tr key={row[0]} className="border-t border-border">{row.map(cell=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div>
      <p>허용 범위가 없으면 3을 고릅니다. 제곱한 값은 음수가 될 수 없고 3에서만 0이므로 모든 실수를 비교해도 점수 2보다 작아질 수 없습니다. 표의 네 값만 보고 결론을 낸 것은 아닙니다.</p>
      <p>허용 범위가 0부터 2까지이면 3과의 거리가 가장 작은 값은 2입니다. 구간 안의 다른 모든 값은 3에서 적어도 1만큼 떨어져 있으므로 점수가 적어도 3입니다. 따라서 사용할 선택은 2이고 그 선택의 점수는 3입니다.</p>
      <p>두 숫자를 따로 남겨야 합니다. “답은 3”이라고만 쓰면 설정값 3을 골랐다는 뜻인지 최종 점수가 3이라는 뜻인지 알 수 없습니다. 다음 구조에서는 고른 값과 측정한 점수를 서로 다른 칸에 놓습니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="space-y-6">
      <h2 className="text-2xl font-bold">4 · 허용된 선택끼리 비교한 뒤 위치와 점수를 기록한다</h2>
      <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3" aria-label="선택과 허용 여부 및 점수 비교의 흐름"><p><strong>선택</strong><br />바꿀 설정값을 정한다</p><p><strong>허용 여부와 평가</strong><br />규칙을 확인하고 점수를 계산한다</p><p><strong>결과</strong><br />고른 값 2, 그 점수 3</p></div>
      <p>규칙을 통과한 값들을 비교하는 것이 문제의 뜻입니다. 실제 계산 프로그램이 반드시 모든 값을 나열하거나 이 순서로 실행한다는 뜻은 아닙니다. 이 예는 식의 모양을 이용해 허용 구간 전체를 한 번에 판단했습니다.</p>
      <p>점수와 규칙을 분리해 두면 어느 쪽을 바꿨는지도 알 수 있습니다. 범위를 0부터 4까지로 넓히면 점수 식은 그대로여도 선택 3을 사용할 수 있게 됩니다. 반대로 범위를 그대로 두고 점수 식을 바꾸면 허용되는 값은 같아도 그 안의 순위가 달라질 수 있습니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="space-y-6">
      <h2 className="text-2xl font-bold">5 · 비교 기준과 필수 규칙은 서로 다른 질문에 답한다</h2>
      <p>점수는 “둘 다 쓸 수 있다면 어느 쪽이 나은가?”에 답합니다. 허용 규칙은 “애초에 이 선택을 써도 되는가?”에 답합니다. 규칙을 어긴 선택에 낮은 점수가 나왔다는 이유로 예외를 주면 처음에 정한 문제가 달라집니다.</p>
      <p>예를 들어 메모리를 48GiB 이하로 제한하고 오차를 최소화한다고 정할 수 있습니다(가정). 오차가 0.1이라도 메모리 52GiB가 필요하면 허용되지 않습니다. 메모리 46GiB에서 오차 0.2를 내는 선택은 비교 후보로 남습니다. 같은 숫자 48GiB를 낮출 점수로 삼으려면 메모리 사용량 자체를 비교하겠다는 다른 문제를 정해야 합니다.</p>
      <p>관측값과 바꾸는 선택도 나눕니다. 앞 식의 3과 2는 평가 규칙을 정의한 고정값입니다. 지금 바꿀 수 있는 것은 입력값 하나입니다. 고정값까지 움직여 점수를 낮추면 처음의 선택 문제를 푼 것이 아닙니다.</p>
      <p>이처럼 “무엇을 고르는가, 어떻게 비교하는가, 어디까지 허용하는가”를 적어 두어야 계산 결과를 해석할 수 있습니다. 이제 앞에서 사용한 역할에 수학의 이름을 붙이겠습니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="space-y-6">
      <h2 className="text-2xl font-bold">6 · 선택·평가·허용 범위에 이름을 붙인다</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr><th className="p-3 text-left">이미 한 일</th><th className="p-3 text-left">이름과 표기</th><th className="p-3 text-left">이 예의 내용</th></tr></thead><tbody>{[['바꾸어 고른다','결정 변수(decision variable), x','실수인 설정값'],['좋고 나쁨을 숫자로 비교한다','목적함수(objective), f(x)','(x−3)²+2'],['반드시 지킬 규칙을 정한다','제약(constraint)','0≤x≤2'],['규칙을 모두 만족하는 선택을 모은다','가능 집합(feasible set), C','닫힌 구간 [0,2]'],['점수가 가장 낮은 위치를 고른다','최소점(minimizer), x*','제약이 없으면 3, 있으면 2'],['가장 낮은 점수를 기록한다','최솟값(minimum value), f*','제약이 없으면 2, 있으면 3']].map(row=><tr key={row[0]} className="border-t border-border">{row.map(cell=><td key={cell} className="min-w-[180px] p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
      <p>최적화(optimization)는 주어진 가능 집합 안에서 목적함수가 가장 작은 선택을 찾는 문제입니다. 큰 점수가 좋은 문제는 점수에 −1을 곱해 최소화 문제로 쓸 수도 있습니다. 이 글은 작은 값이 좋은 경우만 추적합니다.</p>
      <p>argmin은 최소점을 모은 집합이고 min은 최솟값입니다. 최소점이 하나인 이 예에서는 흔히 x*=argmin이라고 줄여 적습니다. 최소점이 여러 개일 때는 x*∈argmin으로 그중 하나를 골랐음을 나타냅니다.</p>
    </section>
    <section id="feasible-set" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">7 · 제약을 벌점으로 바꾸면 허용되지 않은 값이 다시 후보가 된다</h2>
      <p>C=[0,2]는 두 조건 x≥0과 x≤2를 동시에 만족하는 집합입니다. 48GiB 제한도 같은 역할입니다. 목적함수가 낮더라도 규칙을 어기면 제외하는 조건을 강제 제약(hard constraint)이라고 부릅니다.</p>
      <p>상한 위반을 허용하되 점수에 벌점을 더하는 방식도 있습니다. 원래 f(x)에 max(0,x−2)²를 더한다고 해 보겠습니다(가정). x=2에서는 총점 3이고 x=2.5에서는 원래 점수 2.25에 벌점 0.25를 더해 총점 2.5입니다. 위반한 2.5가 오히려 유리합니다.</p>
      <p>x&gt;2에서 이 새 점수는 2(x−2.5)²+2.5로 정리됩니다. 따라서 새 문제의 최소점은 2.5입니다. x≤2에서는 벌점이 0이고 원래 점수가 적어도 3이므로 더 좋은 후보도 없습니다. 이 계산은 유한한 벌점 하나가 강제 제약과 같은 결과를 보장하지 않는 반례입니다.</p>
      <p>반대로 x≥3과 x≤2를 동시에 요구하면 가능한 실수가 없어 C가 공집합입니다. 이때 이동 간격이나 탐색 횟수를 바꿔도 답은 생기지 않습니다. 서로 충돌하는 규칙을 먼저 수정해야 합니다. 실제 메모리 제한처럼 반드시 지켜야 하는 조건은 최종 선택에서도 별도로 확인합니다.</p>
      <p>허용 여부를 확정했으므로 원래 f와 C=[0,2]로 돌아가 위치와 점수를 계산하겠습니다.</p>
    </section>
    <section id="minimizer" data-teach-level="4" className="space-y-6">
      <h2 className="text-2xl font-bold">8 · 같은 함수를 두 범위에서 풀면 위치와 점수가 함께 바뀐다</h2>
      <p>먼저 모든 실수를 허용합니다. (x−3)²의 가장 작은 값은 0이고 x=3에서 달성됩니다. 여기에 고정된 2를 더했으므로 최소점은 3, 최솟값은 2입니다.</p>
      <ExplainedFormula
        question="f(x)=(x−3)²+2의 정답 위치와 가장 작은 점수는 왜 따로 적을까요?"
        idea={<>제곱 penalty가 0이 되는 입력을 먼저 고르고, 그 입력을 objective에 다시 넣어 점수를 계산합니다. 선택과 평가를 같은 기호로 쓰지 않습니다.</>}
        formula={String.raw`\begin{aligned}x^*&=\operatorname*{arg\,min}_{x\in\mathbb R}f(x)=3\\f^*&=\min_{x\in\mathbb R}f(x)=f(3)=2\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}x^*&=\underbrace{\operatorname*{arg\,min}_{x}f(x)}_{\text{가장 낮은 위치 선택}}=3\\[5pt]f^*&=\underbrace{f(x^*)}_{\text{선택을 다시 평가}}=2\end{aligned}`}
        operations={[{ expression: String.raw`\operatorname*{arg\,min}_x`, annotation: ["함수값들을 비교해", "가장 낮게 만드는 입력 위치를 선택"] }, { expression: String.raw`f(x^*)`, annotation: ["선택된 위치를 objective에 넣어", "minimum value를 별도로 계산"] }]}
        terms={[{ symbol: "x^*", name: "Minimizer", description: "가장 작은 objective를 만드는 입력 위치입니다." }, { symbol: "f^*", name: "Minimum value", description: "그 위치에서 측정한 가장 작은 scalar 점수입니다." }]}
        assumptions={["Domain은 모든 실수이고 minimizer가 존재합니다.", "여러 minimizer가 있으면 argmin은 집합이 될 수 있습니다."]}
        interpretation="이 예의 답은 위치 3과 값 2입니다. Model checkpoint와 그 checkpoint의 validation loss를 구분하는 것과 같은 원리입니다."
      />
      <p>이제 [0,2]에서만 비교합니다. 모든 허용된 x에 대해 3−x≥1이므로 f(x)≥3입니다. x=2가 실제로 그 값 3을 만들기 때문에 최솟값의 하한과 달성 위치를 둘 다 확인했습니다.</p>
      <ExplainedFormula
        question="왜 x=3이 아니라 x=2가 constrained minimizer일까요?"
        idea={<>먼저 objective가 원하는 위치 3을 찾습니다. 그 위치가 허용 구간 밖이면 [0,2] 안에서 3과 가장 가까운 경계 2를 선택하고 그 점수를 계산합니다.</>}
        formula={String.raw`\begin{aligned}x_C^*&=\operatorname*{arg\,min}_{0\le x\le2}(x-3)^2+2=2\\f(x_C^*)&=3\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}x_C^*&=\underbrace{\min(\max(3,0),2)}_{\substack{\text{원래 정답 3을}\\\text{허용 구간으로 제한}}}=2\\[5pt]f(x_C^*)&=\underbrace{(2-3)^2}_{\text{경계까지 남은 penalty}}+2=3\end{aligned}`}
        operations={[{ expression: String.raw`\max(3,0)`, annotation: ["lower bound 0보다", "작은 선택을 제거"] }, { expression: String.raw`\min(3,2)`, annotation: ["upper bound 2를 넘는", "원래 정답을 경계로 제한"] }, { expression: String.raw`f(2)`, annotation: ["허용된 최종 위치를", "objective로 다시 평가"] }]}
        terms={[{ symbol: "C", name: "Feasible set", description: "이 예에서는 [0,2]입니다." }, { symbol: String.raw`x_C^*`, name: "Constrained minimizer", description: "C 안에서 선택한 최적 위치입니다." }]}
        assumptions={["1차원 closed interval과 convex quadratic 예시입니다.", "일반 constraint에서는 단순 clipping이 정확한 projection이 아닐 수 있습니다."]}
        interpretation="Objective가 같아도 feasible set이 바뀌면 정답 위치와 minimum value가 함께 바뀝니다."
      />
      <OptimizationProblemViz />
      <p>이 예에서 구간 끝으로 잘라 내는 계산이 통하는 이유는 f가 3과의 거리의 제곱이기 때문입니다. 임의의 문제에서 제약 없는 답을 각 좌표별로 자르면 된다는 규칙은 아닙니다. 두 값에 각각 0≤x≤1, 0≤y≤1과 함께 x+y≤1을 요구하면 (1,1)은 좌표별 범위 안이지만 합 규칙을 어깁니다(가정).</p>
      <p>최소점이 여러 개일 수도 있습니다. 다른 함수 q(x)=(x²−1)²에서는 −1과 1이 모두 점수 0을 만듭니다(가정). argmin q={'{−1,1}'}이고 min q=0입니다. 최소점의 집합과 점수 하나를 구별하는 이유입니다.</p>
      <p>이제 이 선택·평가·제약을 실제 교재의 표준 형태에 옮겨 같은 답을 다시 확인하겠습니다.</p>
    </section>
    <section id="source" data-teach-level="5-6" className="space-y-6">
      <h2 className="text-2xl font-bold">9 · 실제 교재의 식에 같은 점수와 두 제약을 대입한다</h2>
      <p><a className="font-semibold text-primary underline" href={BOYD}>Boyd·Vandenberghe의 Convex Optimization §4.1.1, 인쇄 127쪽 식 (4.1)</a>은 목적함수 f₀를 최소화하되 부등식 fᵢ≤0과 등식 hᵢ=0을 만족하는 문제를 적습니다. 아래 표준 형태는 교재의 실제 식입니다. 아직 어떤 탐색 알고리즘을 사용할지는 정하지 않았습니다.</p>
      <ExplainedFormula question="앞의 [0,2] 문제를 교재의 표준 형태로 쓰면 무엇이 들어갈까요?"
        idea={<>점수는 f₀에 넣고 제약의 오른쪽을 0으로 맞춥니다. 이 예는 부등식 두 개이며 등식은 없습니다.</>}
        formula={String.raw`\begin{aligned}\operatorname{minimize}\quad &f_0(x)\\\operatorname{subject\ to}\quad &f_i(x)\le0,\quad i=1,\ldots,m\\&h_i(x)=0,\quad i=1,\ldots,p\end{aligned}`}
        annotatedFormula={String.raw`\begin{gathered}\begin{aligned}\operatorname{minimize}\quad &f_0(x)\\\operatorname{subject\ to}\quad &f_i(x)\le0,\quad i=1,\ldots,m\\&h_i(x)=0,\quad i=1,\ldots,p\end{aligned}\\[8pt]\begin{aligned}f_0(x)&=\underbrace{(x-3)^2+2}_{\text{비교할 점수}}\\f_1(x)&=\underbrace{-x}_{x\ge0}\le0\\f_2(x)&=\underbrace{x-2}_{x\le2}\le0\end{aligned}\end{gathered}`}
        operations={[{expression:'f_0(2)=3',annotation:['허용된 선택 2를','목적함수로 평가']},{expression:String.raw`f_1(2)=-2,\quad f_2(2)=0`,annotation:['두 값이 모두 0 이하이므로','두 제약을 모두 만족']},{expression:'f_2(3)=1>0',annotation:['선택 3은 점수가 2라도','상한 제약을 어김']}]}
        terms={[{symbol:'m=2',name:'부등식 수',description:'하한과 상한을 각각 하나의 함수로 적습니다.'},{symbol:'p=0',name:'등식 수',description:'이 예에는 등식 제약이 없습니다.'}]}
        assumptions={['원문의 일반적인 문제 표현을 이 글의 가정 사례에 적용했습니다.','함수의 정의역은 모두 실수이며 제약을 만족하는 집합은 [0,2]입니다.']}
        interpretation="x=2는 제약 둘을 만족하고 점수 3을 만듭니다. 허용 구간의 다른 값은 점수 3보다 작아질 수 없으므로 원문이 정의한 최적점입니다." />
      <p>같은 127쪽에서 원문은 최적값 p*를 가능한 점수들의 inf로 정의합니다. inf는 그 값에 실제로 도달하는 선택이 없어도 정의하는 가장 큰 하한입니다. 이 예는 x=2에서 값 3을 달성하므로 p*=min f=3입니다. 원문 128쪽의 최적점 정의는 “허용된 x*이고 f₀(x*)=p*”라는 두 조건을 함께 요구합니다.</p>
      <p>§4.1.2의 Example 4.2는 구간 조건 lᵢ≤xᵢ≤uᵢ를 lᵢ−xᵢ≤0, xᵢ−uᵢ≤0으로 바꿉니다. 앞에서 l=0, u=2를 넣어 얻은 −x≤0, x−2≤0과 정확히 같은 변환입니다. 원문의 기호를 외우기보다 각 식이 허용 여부와 점수 중 무엇을 계산하는지 확인합니다.</p>
      <div id="paper-optimization-model"><CitationBlock source="Boyd & Vandenberghe · Convex Optimization" citeKey={1} href={BOYD}><Evidence problem="Objective·constraint·optimality를 하나의 수학 문제로 명시하는 방법" contribution="Decision variable, feasible set, optimal value를 분리하는 표준 형태" assumptions="책에서 선언한 convex-analysis 조건과 각 theorem의 domain" scope="Optimization problem formulation과 convex optimality" notClaim="모든 비convex 문제를 clipping이나 closed form으로 풀 수 있다는 보장이 아님" /></CitationBlock></div>
      <div id="paper-quadratic-objective"><CitationBlock source="MIT 18.065 · Gradient Descent" citeKey={2} href={MIT}><Evidence problem="Quadratic objective의 minimum과 반복 경로를 기하로 이해하는 문제" contribution="Level set·gradient·minimum을 작은 행렬 예와 연결" assumptions="강의가 둔 differentiable quadratic 조건" scope="Quadratic optimization의 입문 기하" notClaim="제약 solver나 deep-network global optimum의 일반 보장이 아님" /></CitationBlock></div>
      <p>이제 어떤 경우에 최소점을 답으로 낼 수 없는지 살펴보겠습니다.</p>
    </section>
    <section id="boundaries" data-teach-level="7" className="space-y-6">
      <h2 className="text-2xl font-bold">10 · 최솟값의 존재와 실제 목표까지 따로 확인한다</h2>
      <p>같은 f에서 가능 집합을 [0,2)로 바꾸면 2는 제외됩니다(가정). x=1.9의 점수는 3.21, x=1.99에서는 3.0201입니다. 2에 가까이 가면 점수도 3에 가까워지지만 허용된 어떤 x도 3을 만들지 못합니다. 하한은 3이어도 최소점과 최솟값은 존재하지 않습니다. 교재가 일반적인 최적값을 min 대신 inf로 쓰는 이유입니다.</p>
      <p>주변에서 가장 낮은 위치와 전체에서 가장 낮은 위치도 다릅니다. 전자를 국소 최소점(local minimizer), 후자를 전역 최소점(global minimizer)이라고 합니다. 가능 집합이 주어졌다면 두 비교 모두 허용된 점들 사이에서 합니다. 앞의 [0,2] 문제는 구간 전체를 비교했으므로 2가 전역 최소점입니다.</p>
      <p>다른 예로 r(x)=min((x+1)²+1,(x−2)²)을 생각해 보겠습니다(가정). −1 근처에서는 첫 식이 더 작아 −1의 점수 1이 주변 최솟값입니다. 하지만 x=2에서 둘째 식은 0이므로 더 좋은 선택이 있습니다. 한 위치 주변에서 개선이 안 된다는 사실만으로 전체 최적을 보장할 수 없습니다.</p>
      <p>목적함수가 원하는 제품 가치를 얼마나 잘 나타내는지도 별도 문제입니다. 답변 길이만 최소화하면 모든 질문에 빈 문자열을 내는 모델이 점수 0을 얻을 수 있습니다(가정). 실제로는 답변의 유용성이 사라집니다. 길이 감소와 함께 정답률을 평가하고 필요한 품질 조건을 명시해야 합니다. 수학적으로 점수를 잘 낮춘 결과가 목표를 잘 표현한 문제에서 나온 것인지는 따로 검증합니다.</p>
      <p>다음 글에서는 <a className="font-semibold text-primary underline" href="/cs/ai/math-optimization-convexity">볼록성과 매끄러움</a>이 주변과 전체의 관계를 어떻게 제한하는지 살핍니다. 이어 <a className="font-semibold text-primary underline" href="/cs/ai/math-gradient-descent-convergence">경사하강법의 반복</a>으로 실제 위치를 이동합니다.</p>
      <ol className="list-decimal space-y-3 pl-6"><li>f(x)=(x−3)²+2를 모든 실수와 [0,2]에서 각각 최소화하면 고른 위치와 점수는 어떻게 달라질까요? (답: 8절)</li><li>x≤2를 없애고 max(0,x−2)²를 점수에 더하면 왜 x=2.5가 선택될까요? (답: 7절)</li><li>같은 f의 가능 집합이 [0,2)라면 하한 3과 최솟값은 어떤 점에서 다를까요? (답: 10절)</li></ol>
      <ContentBoundary article="math-optimization-objectives" />
    </section>
  </article>;
}

function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
