import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import OptimizationProblemViz from "./OptimizationProblemViz";

const BOYD = "https://web.stanford.edu/~boyd/cvxbook/";
const MIT = "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/";

export default function OptimizationObjectivesArticle() {
  return <article className="space-y-16">
    <section id="overview" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">00 · 선택 문제부터</p><h2 className="mt-2 text-2xl font-bold">Optimization은 숫자를 낮추는 기술이 아니라 선택·점수·허용 범위를 함께 정하는 문제다</h2></header>
      <p className="text-lg leading-8">학습률이나 gradient를 고르기 전에 먼저 무엇을 선택할 수 있고, 그 선택을 어떤 숫자로 비교하며, 어떤 조건을 지켜야 하는지 정해야 합니다. 이 세 가지가 비어 있으면 “최적화했다”는 말의 정답 자체가 없습니다.</p>
      <Term name="Decision variable" shape="x" meaning="우리가 값을 바꾸어 선택하는 대상입니다." example="가격 하나, model parameter vector, 배치 일정이 x가 될 수 있습니다." boundary="관측 data나 고정 상수를 decision variable과 섞지 않습니다." />
      <Term name="Objective" shape="f(x)" meaning="선택 x가 얼마나 좋은지 비교할 scalar 점수입니다." example="f(x)=(x−3)²+2는 x가 3에서 멀수록 큰 penalty를 줍니다." boundary="측정하기 쉬운 proxy objective가 실제 제품 가치 전체와 같지는 않습니다." />
    </section>

    <section id="feasible-set" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 움직여도 되는 곳</p><h2 className="mt-2 text-2xl font-bold">Feasible set은 constraint를 모두 만족하는 제출 가능한 선택의 모음이다</h2></header>
      <Term name="Constraint" shape="g(x)≤0 · h(x)=0" meaning="선택이 반드시 지켜야 하는 부등식·등식 규칙입니다." example="메모리 48GiB 이하, 확률의 합 1, x∈[0,2]가 constraint입니다." boundary="Constraint를 penalty로 바꿨다면 위반 불가능 조건과 soft cost를 구분해야 합니다." />
      <Term name="Feasible set" shape="C={x: constraints hold}" meaning="모든 constraint를 동시에 만족하는 x만 남긴 집합입니다." example="0≤x≤2이면 C=[0,2]입니다." boundary="C가 비어 있으면 minimizer를 찾기 전에 문제 정의부터 고쳐야 합니다." />
      <OptimizationProblemViz />
    </section>

    <section id="minimizer" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 위치와 점수 분리</p><h2 className="mt-2 text-2xl font-bold">Argmin은 가장 낮은 위치이고 min은 그 위치에서의 함수값이다</h2></header>
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
      <Term name="Minimizer" shape="x*∈argminₓ∈C f(x)" meaning="Feasible set 안에서 objective가 가장 작은 입력 위치입니다." example="C=[0,2]이면 x*=2입니다." boundary="Local minimizer와 global minimizer는 비교하는 주변 범위가 다릅니다." />
    </section>

    <section id="boundaries" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 같은 함수, 다른 문제</p><h2 className="mt-2 text-2xl font-bold">Constraint를 적용하면 unconstrained 정답을 feasible set 안으로 다시 판단한다</h2></header>
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
      <p>다음 글에서 <a className="font-semibold text-primary underline" href="/ai/math-optimization-convexity">convexity와 smoothness</a>가 문제의 지형을 어떻게 제한하는지 보고, 그다음 <a className="font-semibold text-primary underline" href="/ai/math-gradient-descent-convergence">gradient descent 반복</a>을 적용합니다.</p>
      <div id="paper-optimization-model"><CitationBlock source="Boyd & Vandenberghe · Convex Optimization" citeKey={1} href={BOYD}><Evidence problem="Objective·constraint·optimality를 하나의 수학 문제로 명시하는 방법" contribution="Decision variable, feasible set, optimal value를 분리하는 표준 형태" assumptions="책에서 선언한 convex-analysis 조건과 각 theorem의 domain" scope="Optimization problem formulation과 convex optimality" notClaim="모든 비convex 문제를 clipping이나 closed form으로 풀 수 있다는 보장이 아님" /></CitationBlock></div>
      <div id="paper-quadratic-objective"><CitationBlock source="MIT 18.065 · Gradient Descent" citeKey={2} href={MIT}><Evidence problem="Quadratic objective의 minimum과 반복 경로를 기하로 이해하는 문제" contribution="Level set·gradient·minimum을 작은 행렬 예와 연결" assumptions="강의가 둔 differentiable quadratic 조건" scope="Quadratic optimization의 입문 기하" notClaim="제약 solver나 deep-network global optimum의 일반 보장이 아님" /></CitationBlock></div>
      <ContentBoundary article="math-optimization-objectives" />
    </section>
  </article>;
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
