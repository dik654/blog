import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RandomVariableMapViz from "./RandomVariableMapViz";

const MIT = "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/";

export default function RandomVariablesExpectationArticle() {
  return <article className="space-y-16">
    <section id="overview" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">00 · 질문에 필요한 숫자</p><h2 className="mt-2 text-2xl font-bold">Random variable은 outcome을 버리는 것이 아니라 계산할 좌표 하나를 선택한다</h2></header>
      <p className="text-lg leading-8">Coin toss의 순서 전체가 필요할 때도 있고 앞면 개수만 필요할 때도 있습니다. Random variable은 같은 sample space를 질문에 맞는 숫자로 다시 표현합니다.</p>
      <Term name="Random variable" shape="X: Ω→ℝ" meaning="각 outcome에 실수값 하나를 배정하는 deterministic function입니다." example="X(HH)=2, X(HT)=X(TH)=1, X(TT)=0입니다." boundary="Outcome 자체와 X가 만든 숫자를 같은 것으로 부르지 않습니다." />
      <RandomVariableMapViz />
    </section>

    <section id="mapping" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 함수 형태</p><h2 className="mt-2 text-2xl font-bold">같은 experiment에도 서로 다른 random variable을 정의할 수 있다</h2></header>
      <ExplainedFormula question="왜 random variable을 Ω에서 ℝ로 가는 함수라고 쓸까요?" idea={<>입력은 실험 결과이고 출력은 계산 가능한 숫자입니다. 같은 outcome을 reward·count·loss처럼 서로 다른 질문의 숫자로 보낼 수 있습니다.</>} formula={String.raw`X:\Omega\to\mathbb{R},\qquad \omega\mapsto X(\omega)`} annotatedFormula={String.raw`\underbrace{\omega\in\Omega}_{\text{관측 outcome}}\quad\xmapsto{\;X\;}\quad\underbrace{X(\omega)\in\mathbb R}_{\text{질문에 필요한 숫자}}`} operations={[{ expression: String.raw`X(\omega)`, annotation: ["Outcome을 function X에 넣어", "계산 가능한 scalar representation 생성"] }]} terms={[{ symbol: String.raw`\omega`, name: "Outcome", description: "Sample space의 실제 결과 하나입니다." }, { symbol: "X", name: "Random variable", description: "Outcome을 숫자로 보내는 함수입니다." }]} assumptions={["X는 Ω의 모든 outcome에 값을 정의합니다.", "출력값이 같아도 원래 outcome은 다를 수 있습니다."]} interpretation="HT와 TH는 서로 다른 outcome이지만 앞면 개수 X에서는 둘 다 1로 합쳐집니다." />
    </section>

    <section id="distribution" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 값별 mass 모으기</p><h2 className="mt-2 text-2xl font-bold">Random variable의 distribution은 같은 숫자로 간 outcome mass를 합친다</h2></header>
      <Term name="Induced distribution" shape="P(X=x)=Σ P(ω)" meaning="X가 같은 값 x로 보내는 모든 outcome의 probability를 더한 분포입니다." example="X=1은 HT와 TH가 합쳐져 probability 1/2입니다." boundary="X 값만 보고 원래 outcome의 순서 정보를 복구할 수는 없습니다." />
      <ExplainedFormula question="왜 P(X=1)에 HT와 TH의 probability를 더할까요?" idea={<>Event <code>&#123;X=1&#125;</code>은 X가 1이 되는 outcome 전체입니다. 서로 겹치지 않는 두 outcome의 mass를 합쳐 값 1의 probability를 만듭니다.</>} formula={String.raw`P(X=1)=P(HT)+P(TH)=\frac12`} annotatedFormula={String.raw`\begin{aligned}
P(X=1)&=\underbrace{P(HT)}_{\text{첫 mass}}+\underbrace{P(TH)}_{\text{둘째 mass}}\\
&=\frac14+\frac14=\frac12
\end{aligned}`} operations={[{ expression: String.raw`P(HT)+P(TH)`, annotation: ["X 값이 같은 disjoint outcome을 모아", "값 1의 induced mass 계산"] }]} terms={[{ symbol: String.raw`P(X=x)`, name: "Value mass", description: "Random variable이 값 x를 가질 probability입니다." }]} assumptions={["HT와 TH는 서로 다른 disjoint outcome입니다.", "각 outcome probability는 같은 experiment model에서 옵니다."]} interpretation="Random variable은 sample space를 숫자별 bin으로 나누고, distribution은 각 bin에 들어온 mass를 기록합니다." />
    </section>

    <section id="expectation" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · probability-weighted center</p><h2 className="mt-2 text-2xl font-bold">Expectation은 가능한 값에 그 값이 나타날 probability를 곱해 더한 무게중심이다</h2></header>
      <Term name="Expectation" shape="E[X]=Σx·P(X=x)" meaning="Random variable의 각 값이 자기 probability만큼 힘을 주는 distribution center입니다." example="0·1/4+1·1/2+2·1/4=1입니다." boundary="다음 관측값, mode, 반드시 가능한 값과 같은 뜻이 아닙니다." />
      <ExplainedFormula question="왜 값마다 probability를 곱한 뒤 모두 더할까요?" idea={<>자주 나오는 값은 center를 더 세게 끌어야 합니다. 각 값에 mass를 곱하면 그 기여량이 되고, 가능한 값 전체의 기여를 합치면 무게중심이 됩니다.</>} formula={String.raw`\mathbb E[X]=\sum_x x\,P(X=x)`} annotatedFormula={String.raw`\mathbb E[X]=\sum_x\underbrace{x}_{\text{가능한 값}}\underbrace{P(X=x)}_{\text{그 값의 mass}}`} operations={[{ expression: String.raw`xP(X=x)`, annotation: ["값에 나타날 비율을 곱해", "그 값의 weighted contribution 계산"] }, { expression: String.raw`\sum_x`, annotation: ["모든 가능한 값의 contribution을 더해", "distribution center 생성"] }]} terms={[{ symbol: String.raw`\mathbb E[X]`, name: "Expectation", description: "X distribution의 probability-weighted center입니다." }]} assumptions={["Discrete X이고 절댓값 expectation이 유한합니다.", "Distribution의 probability mass 합은 1입니다."]} interpretation="Expectation 1은 매번 앞면이 하나 나온다는 예측이 아니라, 반복한 앞면 수의 장기 평균 중심입니다." />
    </section>

    <section id="transform-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · 무엇을 밖으로 꺼낼 수 있나</p><h2 className="mt-2 text-2xl font-bold">Expectation은 합과 scalar 곱에는 linear하지만 nonlinear transform과는 교환되지 않는다</h2></header>
      <Term name="Linearity of expectation" shape="E[aX+bY]=aE[X]+bE[Y]" meaning="값별 합을 먼저 하든 각 expectation을 먼저 하든 weighted sum 결과가 같습니다." example="X와 Y가 dependent여도 합의 expectation에는 linearity가 성립합니다." boundary="Variance의 합이나 product의 expectation에는 추가 dependence 조건이 필요합니다." />
      <ExplainedFormula question="왜 expectation을 합의 각 항으로 나눌 수 있을까요?" idea={<>각 outcome에서 aX+bY를 계산하고 probability로 가중한 합을 분배하면 X contribution과 Y contribution이 분리됩니다. 이 대수에는 independence가 필요하지 않습니다.</>} formula={String.raw`\mathbb E[aX+bY]=a\mathbb E[X]+b\mathbb E[Y]`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{aX+bY}_{\text{outcome별 조합}}&=\text{먼저 값을 합침}\\
\mathbb E[aX+bY]&=\underbrace{a\mathbb E[X]}_{\text{X 기여}}+\underbrace{b\mathbb E[Y]}_{\text{Y 기여}}
\end{aligned}`} operations={[{ expression: String.raw`aX+bY`, annotation: ["각 outcome에서 두 값을 linear하게 조합하고", "공통 probability weight로 평균"] }, { expression: String.raw`a\mathbb E[X]+b\mathbb E[Y]`, annotation: ["합과 scalar를 weighted sum 밖으로 분배해", "각 random variable의 center로 계산"] }]} terms={[{ symbol: "a,b", name: "Fixed scalars", description: "Outcome에 따라 변하지 않는 상수입니다." }]} assumptions={["관련 expectation이 유한합니다.", "X와 Y의 independence는 필요하지 않습니다."]} interpretation="Mini-batch 평균 gradient의 expectation을 example별 expectation으로 나누는 근거가 이 선형성입니다." />
      <ExplainedFormula question="왜 nonlinear square는 expectation 밖으로 옮길 수 없을까요?" idea={<>Square는 값을 크게 벌리는 nonlinear transform입니다. 값을 먼저 제곱해 평균한 결과와 center 하나를 제곱한 결과는 spread가 있을 때 달라집니다.</>} formula={String.raw`\mathbb E[X^2]\ne (\mathbb E[X])^2`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{\mathbb E[X^2]}_{\text{각 값을 먼저 square}}&=\text{spread 보존}\\
\underbrace{(\mathbb E[X])^2}_{\text{center를 먼저 square}}&=\text{spread 제거}\\
\mathbb E[X^2]&\ne(\mathbb E[X])^2
\end{aligned}`} operations={[{ expression: String.raw`X^2`, annotation: ["각 outcome value를 먼저 변환해", "큰 magnitude의 기여를 확대"] }, { expression: String.raw`(\mathbb E[X])^2`, annotation: ["분포를 center 하나로 먼저 압축해", "spread 정보를 버린 뒤 square"] }]} terms={[{ symbol: String.raw`X^2`, name: "Squared random variable", description: "Outcome ω에서 X(ω)를 제곱한 새 random variable입니다." }]} assumptions={["두 expectation이 유한합니다.", "X가 거의 surely constant이면 두 값이 같을 수 있습니다."]} interpretation="앞면 수 예에서는 E[X^2]=3/2이고 (E[X])^2=1이며, 그 차이가 다음 글의 variance입니다." />
      <p>Center 주변의 흔들림과 finite sample 추정은 <a className="font-semibold text-primary underline" href="/ai/math-variance-sampling">variance·sample mean·mini-batch</a> 글에서 이어집니다.</p>
      <div id="paper-random-variable"><CitationBlock source="MIT 6.041SC · Discrete random variables" citeKey={1} href={`${MIT}#random-variables`}><Evidence problem="Outcome 집합을 계산 가능한 값과 induced distribution으로 바꾸는 문제" contribution="Random variable을 function으로 정의하고 value mass를 합치는 절차를 설명" assumptions="Discrete sample space와 stated probability law" scope="Discrete random variable·PMF" notClaim="Random variable의 값이 outcome 원문 정보를 모두 보존한다는 주장이 아님" /></CitationBlock></div>
      <div id="paper-expectation"><CitationBlock source="MIT 6.041SC · Expectation" citeKey={2} href={`${MIT}#expectation`}><Evidence problem="Distribution을 center 하나로 요약하고 합의 expectation을 계산하는 문제" contribution="Probability-weighted sum과 linearity of expectation을 체계화" assumptions="해당 expectation의 존재와 stated distribution" scope="Discrete expectation·linearity" notClaim="Expectation이 다음 sample이나 가장 흔한 값을 예측한다는 주장이 아님" /></CitationBlock></div>
      <ContentBoundary article="math-random-variables-expectation" />
    </section>
  </article>;
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
