import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProbabilityTreeViz from "./ProbabilityTreeViz";

const MIT = "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/";

export default function ProbabilityExperimentsArticle() {
  return <article className="space-y-16">
    <section id="overview" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">00 · 아직 결과를 모르는 절차</p><h2 className="mt-2 text-2xl font-bold">Probability model은 실험·가능한 경우·실제 관측을 먼저 분리한다</h2></header>
      <p className="text-lg leading-8">
            확률 계산은 무엇을 한 번 실행하는지, 어떤 결과들을 구별할지, 각 결과에 얼마의 mass를 배정할지를 먼저 고정해야 시작됩니다. 막연한 불확실성의 숫자가 아닙니다.
          </p>
      <Term name="Experiment" shape="repeatable procedure" meaning="실행 전에는 어느 결과가 나올지 정해지지 않은 반복 가능한 절차입니다." example="동전을 두 번 던지고 순서를 기록합니다." boundary="실험의 기록 규칙이 달라지면 sample space도 달라집니다." />
      <Term name="Sample space" shape="Ω = all possible outcomes" meaning="실험에서 가능한 outcome 전체를 모은 집합입니다." example="Ω={HH,HT,TH,TT}입니다." boundary="앞면 수만 기록하면 {0,1,2}라는 다른 sample space가 됩니다." />
      <Term name="Outcome" shape="ω∈Ω" meaning="실험 한 번에서 실제로 관측된 결과 하나입니다." example="이번 실행에서 HT가 나왔다면 HT가 outcome입니다." boundary="Outcome 하나와 여러 outcome을 묶은 event를 섞지 않습니다." />
    </section>

    <section id="outcomes" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · mass와 질문</p><h2 className="mt-2 text-2xl font-bold">Distribution은 mass를 배정하고 event는 질문에 맞는 outcome을 묶는다</h2></header>
      <Term name="Probability distribution" shape="p(ω)≥0 · Σp(ω)=1" meaning="각 outcome에 0 이상의 mass를 배정하고 전체 합을 1로 만드는 규칙입니다." example="공정하고 독립인 두 toss의 네 outcome은 각각 1/4입니다." boundary="공정성과 독립은 계산 결과가 아니라 model assumption입니다." />
      <Term name="Event" shape="A⊆Ω" meaning="현재 질문에 해당하는 outcome을 묶은 부분집합입니다." example="앞면이 정확히 한 번인 event는 A={HT,TH}입니다." boundary="겹치는 event의 probability를 더할 때 intersection을 두 번 세지 않습니다." />
      <ProbabilityTreeViz />
    </section>

    <section id="conditional-probability" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 새 정보 뒤의 비율</p><h2 className="mt-2 text-2xl font-bold">Conditional probability는 조건 밖의 가지를 버리고 남은 mass를 다시 정규화한다</h2></header>
      <Term name="Conditional probability" shape="P(A|B)" meaning="B가 일어났다는 정보를 받은 뒤 B 안에서 A가 차지하는 비율입니다." example="B={HH,HT}에서 A={HT,TH}가 차지하는 것은 HT 하나이므로 1/2입니다." boundary="P(B)=0이면 나눌 mass가 없어 이 비율 정의를 쓸 수 없습니다." />
      <ExplainedFormula question="왜 P(A∩B)를 P(B)로 나눌까요?" idea={<>조건 B가 참이면 전체 비교 기준은 Ω가 아니라 B입니다. 분자는 B 안에서도 A인 mass만 남기고, 분모는 B 전체 mass로 scale을 다시 1에 맞춥니다.</>} formula={String.raw`P(A\mid B)=\frac{P(A\cap B)}{P(B)}`} annotatedFormula={String.raw`\begin{aligned}
\overbrace{P(A\cap B)}^{\text{B 안의 A mass}}&=\text{남긴 target mass}\\
\underbrace{P(B)}_{\text{새 전체의 mass}}&=\text{새 scale}\\
P(A\mid B)&=\frac{P(A\cap B)}{P(B)}
\end{aligned}`} operations={[{ expression: String.raw`A\cap B`, annotation: ["A와 B를 동시에 만족하는", "surviving outcome만 선택"] }, { expression: String.raw`P(A\cap B)/P(B)`, annotation: ["남은 A mass를 B 전체로 나눠", "조건 뒤의 합을 다시 1로 정규화"] }]} terms={[{ symbol: "A", name: "Target event", description: "조건 뒤에도 probability를 묻는 event입니다." }, { symbol: "B", name: "Condition event", description: "이미 일어났다고 아는 event입니다." }]} assumptions={["P(B)>0입니다.", "A와 B는 같은 sample space의 event입니다."]} interpretation="A={HT,TH}, B={HH,HT}이면 분자는 1/4, 분모는 1/2이므로 conditional probability는 1/2입니다." />
    </section>

    <section id="chain-rule" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 긴 결과를 한 단계씩</p><h2 className="mt-2 text-2xl font-bold">Chain rule은 joint probability를 지금까지 본 prefix와 다음 결과의 곱으로 분해한다</h2></header>
      <Term name="Probability chain rule" shape="joint = first × next|past × …" meaning="여러 결과가 함께 나타날 probability를 순서가 있는 conditional probability의 곱으로 정확히 바꿉니다." example="세 token은 P(y₁)P(y₂|y₁)P(y₃|y₁,y₂)로 분해합니다." boundary="Chain rule 자체는 independence를 가정하지 않습니다." />
      <ExplainedFormula question="왜 긴 sequence probability를 conditional term의 곱으로 바꿀까요?" idea={<>조건부확률 정의를 뒤에서부터 풀면 joint mass를 prefix mass와 다음 결과의 조건부 비율로 나눌 수 있습니다. 같은 분해를 반복하면 token별 곱이 됩니다.</>} formula={String.raw`P(y_1,y_2,y_3)=P(y_1)P(y_2\mid y_1)P(y_3\mid y_1,y_2)`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{P(y_1)}_{\text{첫 mass}}&=\text{출발}\\
\underbrace{P(y_2\mid y_1)}_{\text{prefix 뒤 비율}}&=\text{둘째 연결}\\
\underbrace{P(y_3\mid y_1,y_2)}_{\text{긴 prefix 뒤 비율}}&=\text{셋째 연결}\\
P(y_1,y_2,y_3)&=P(y_1)P(y_2\mid y_1)\\
&\quad P(y_3\mid y_1,y_2)
\end{aligned}`} operations={[{ expression: String.raw`P(y_1)P(y_2\mid y_1)`, annotation: ["첫 결과 mass에 둘째 conditional 비율을 곱해", "두 결과의 joint mass 복원"] }, { expression: String.raw`\cdot P(y_3\mid y_1,y_2)`, annotation: ["복원한 prefix joint에 다음 비율을 곱해", "세 결과 joint까지 확장"] }]} terms={[{ symbol: "y_i", name: "Ordered outcome", description: "Sequence의 i번째 결과입니다." }]} assumptions={["각 conditional probability의 conditioning event가 정의됩니다.", "곱의 순서는 바꿀 수 있지만 조건에 포함되는 prefix도 함께 바뀝니다."]} interpretation="Autoregressive model은 이 항등식을 사용하지만, 각 conditional probability를 잘 추정한다는 것은 별도의 modeling 문제입니다." />
    </section>

    <section id="independence-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · 자주 섞는 두 관계</p><h2 className="mt-2 text-2xl font-bold">Independent는 서로 정보를 주지 않는다는 뜻이고 mutually exclusive는 동시에 일어나지 못한다는 뜻이다</h2></header>
      <Term name="Independence" shape="P(A∩B)=P(A)P(B)" meaning="B를 알아도 A의 probability가 바뀌지 않는 관계입니다." example="서로 독립인 두 coin toss의 첫 결과와 둘째 결과입니다." boundary="Data가 다르다는 인상만으로 independence를 선언하지 않습니다." />
      <Term name="Mutually exclusive" shape="A∩B=∅" meaning="두 event가 같은 실행에서 동시에 참일 수 없는 관계입니다." example="한 toss에서 H와 T는 mutually exclusive입니다." boundary="둘 다 positive probability라면 mutually exclusive event는 independent일 수 없습니다." />
      <ExplainedFormula question="왜 positive-mass mutually exclusive event는 independent가 아닐까요?" idea={<>상호배타이면 intersection mass는 0입니다. 하지만 두 event가 각각 positive mass를 가지면 독립일 때 요구되는 product는 0보다 커서 두 값이 같을 수 없습니다.</>} formula={String.raw`0=P(A\cap B)\ne P(A)P(B)>0`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{P(A\cap B)}_{\text{동시 outcome 없음}}&=0\\
\underbrace{P(A)P(B)}_{\text{독립이 요구하는 product}}&>0\\
P(A\cap B)&\ne P(A)P(B)
\end{aligned}`} operations={[{ expression: String.raw`A\cap B=\varnothing`, annotation: ["공통 outcome을 제거해", "joint probability를 0으로 만듦"] }, { expression: String.raw`P(A)P(B)`, annotation: ["독립이라면 같아야 할 product를 계산해", "상호배타 조건과 모순인지 비교"] }]} terms={[{ symbol: String.raw`\cap`, name: "Intersection", description: "두 event가 동시에 참인 outcome 집합입니다." }]} assumptions={["P(A)>0이고 P(B)>0입니다.", "두 event가 같은 experiment에 정의됩니다."]} interpretation="Disjoint와 independent는 모두 event 사이 관계지만, positive-mass event에서는 정반대의 joint behavior를 말합니다." />
      <p>Outcome을 숫자로 바꾸는 다음 단계는 <a className="font-semibold text-primary underline" href="/ai/math-random-variables-expectation">random variable과 expectation</a>에서 이어집니다.</p>
      <div id="paper-probability-model"><CitationBlock source="MIT 6.041SC · Probability models" citeKey={1} href={`${MIT}#probability-model`}><Evidence problem="무작위 실험·sample space·event·probability law를 구분하는 문제" contribution="경우와 mass를 먼저 고정하는 discrete probability model을 체계화" assumptions="Course가 선언한 discrete model과 probability axioms" scope="입문 probability model·event calculation" notClaim="현실 자료가 자동으로 independent하거나 equally likely하다는 주장이 아님" /></CitationBlock></div>
      <div id="paper-conditional-chain"><CitationBlock source="MIT 6.041SC · Conditioning and independence" citeKey={2} href={`${MIT}#conditioning`}><Evidence problem="새 정보 뒤 probability와 여러 단계 joint probability를 계산하는 문제" contribution="Conditioning·multiplication rule·independence를 분리해 설명" assumptions="Conditioning event의 positive probability와 stated model" scope="Conditional probability·chain rule·independence" notClaim="Conditional association가 causality를 증명한다는 주장이 아님" /></CitationBlock></div>
      <ContentBoundary article="math-probability-expectation-variance" />
    </section>
  </article>;
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
