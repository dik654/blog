import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ChainRateViz from "./viz/ChainRateViz";
import SecantTangentViz from "./viz/SecantTangentViz";

const MIT_DIFFERENTIATION = "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/";
const MATRIX_CALCULUS = "https://arxiv.org/abs/1802.01528";

export default function DerivativeChainRuleArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">00 · 두 점에서 시작</p>
          <h2 className="mt-2 text-2xl font-bold">Derivative는 입력 한 단위당 출력 변화가 한 점 근처에서 얼마나 되는지 묻는다</h2>
        </header>
        <p className="text-lg leading-8">
          자동차가 2초 동안 6m 움직였다면 평균 속도는 초당 3m입니다. 곡선의 한 점에서도
          같은 비율을 알고 싶지만, 점 하나만으로는 변화량을 만들 수 없습니다. 그래서 먼저
          가까운 두 점을 잡고 출력 변화÷입력 변화를 계산한 뒤, 두 점 사이의 간격을 줄입니다.
        </p>
        <Term name="Difference quotient" idea="두 입력 사이의 평균 변화율입니다." shape="출력 변화 ÷ 입력 변화" example="f(x)=x², x=3이면 간격 h에서 quotient는 6+h입니다." boundary="h=0을 직접 넣으면 0/0이므로 아직 derivative가 아닙니다." />
        <Term name="Limit" idea="입력이 어떤 값과 같을 때가 아니라 계속 가까워질 때 출력이 모이는 값을 봅니다." shape="h→0" example="6+h는 h=1, 0.1, 0.01일 때 7, 6.1, 6.01로 6에 가까워집니다." boundary="왼쪽과 오른쪽 접근이 다른 값으로 가면 양쪽 limit은 없습니다." />
        <Term name="Derivative" idea="Difference quotient의 간격을 0에 가깝게 보낸 local rate입니다." shape="f′(x)" example="f(x)=x²이면 f′(3)=6입니다." boundary="큰 이동의 exact 변화량이나 전 구간의 평균 기울기와 같지 않습니다." />
        <SecantTangentViz />
      </section>

      <section id="derivative" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 왜 빼고, 나누고, limit을 취하는가</p>
          <h2 className="mt-2 text-2xl font-bold">각 연산은 변화량을 만들고 기준량당 rate로 정규화한 뒤 local하게 만든다</h2>
        </header>
        <ExplainedFormula
          question="f(x)=x²의 한 점 x에서 local slope를 어떻게 만들까요?"
          idea={<>먼저 두 함수값을 빼 출력 변화만 남깁니다. 그 값을 입력 간격 h로 나누어 입력 1단위당 rate로 바꾸고, 마지막으로 h를 0에 가깝게 보내 한 점의 rate를 얻습니다.</>}
          formula={String.raw`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}`}
          annotatedFormula={String.raw`\begin{aligned}q_h(x)&=\frac{\overbrace{f(x+h)-f(x)}^{\text{출력 변화만 분리}}}{\underbrace{h}_{\text{입력 변화 기준}}}\\[4pt]f'(x)&=\underbrace{\lim_{h\to0}q_h(x)}_{\substack{\text{두 점의 간격을 줄여}\text{한 점의 local rate로}}}\end{aligned}`}
          operations={[
            { expression: String.raw`f(x+h)-f(x)`, annotation: ["두 output을 빼", "입력 이동이 만든 변화만 분리"] },
            { expression: String.raw`\frac{\Delta f}{h}`, annotation: ["출력 변화를 입력 변화로 나눠", "입력 1단위당 rate로 정규화"] },
            { expression: String.raw`\lim_{h\to0}`, annotation: ["두 점 간격을 줄여", "한 점 주변의 rate로 이동"] },
          ]}
          terms={[
            { symbol: "x", name: "기준 입력", description: "Local rate를 알고 싶은 위치입니다." },
            { symbol: "h", name: "입력 간격", description: "0은 아니지만 0에 가까워지는 두 입력의 차이입니다." },
            { symbol: String.raw`q_h(x)`, name: "Difference quotient", description: "간격 h에서 측정한 평균 변화율입니다." },
            { symbol: String.raw`f'(x)`, name: "Derivative", description: "h→0에서 남는 local rate입니다." },
          ]}
          assumptions={["해당 점의 양쪽 difference quotient가 같은 유한값으로 가까워집니다.", "입력과 출력 단위가 있으면 derivative의 단위는 output unit/input unit입니다."]}
          interpretation="빼기는 변화량을 만들고, 나눗셈은 기준량당 rate로 만들며, limit은 두 점 측정을 한 점의 local statement로 바꿉니다."
        />
      </section>

      <section id="local-linearity" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · derivative로 무엇을 예측하는가</p>
          <h2 className="mt-2 text-2xl font-bold">Local linear approximation은 작은 구간의 곡선을 접선으로 읽는다</h2>
        </header>
        <p>
          Derivative가 6이라는 말은 입력을 아주 조금 늘릴 때 출력 변화가 입력 변화의 약
          6배라는 뜻입니다. 이 local statement를 현재 함수값에 더하면 가까운 지점의 값을
          직선 계산으로 예측할 수 있습니다.
        </p>
        <ExplainedFormula
          question="x=3 근처의 x² 값을 접선으로 얼마나 잘 예측할까요?"
          idea={<>현재 값 9를 출발점으로 두고, local slope 6에 실제 입력 이동 Δx를 곱한 변화 예측을 더합니다.</>}
          formula={String.raw`\begin{aligned}\Delta f&\approx f'(x)\Delta x\\f(x+\Delta x)&\approx f(x)+\Delta f\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\Delta f&\approx\underbrace{f'(x)\Delta x}_{\substack{\text{local rate}\times\text{실제 입력 이동}}}\\[4pt]f(x+\Delta x)&\approx\underbrace{f(x)}_{\text{현재 기준값}}+\underbrace{\Delta f}_{\text{예측 변화}}\end{aligned}`}
          operations={[
            { expression: String.raw`f'(x)\Delta x`, annotation: ["입력 1단위당 rate에", "실제 이동량을 곱해 출력 변화 예측"] },
            { expression: String.raw`f(x)+\Delta f`, annotation: ["현재 output에", "예측한 작은 변화를 더함"] },
          ]}
          terms={[
            { symbol: String.raw`\Delta x`, name: "작은 입력 이동", description: "접선 근사가 유효하다고 보는 local step입니다." },
            { symbol: String.raw`f'(x)\Delta x`, name: "1차 변화 예측", description: "곡률 이상의 항을 생략한 output 변화입니다." },
            { symbol: String.raw`\approx`, name: "근사", description: "Exact equality가 아니라 local first-order prediction입니다." },
          ]}
          assumptions={["f가 x 근처에서 미분 가능하고 Δx가 충분히 작습니다.", "곡률이 크거나 Δx가 커지면 생략한 higher-order error가 커집니다."]}
          interpretation="f(x)=x², x=3, Δx=0.1이면 9.6을 예측하고 실제 9.61과 0.01 차이가 납니다."
        />
      </section>

      <section id="chain-rule" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 연결된 변화</p>
          <h2 className="mt-2 text-2xl font-bold">Chain rule은 같은 작은 변화가 연속 구간에서 받은 배율을 곱한다</h2>
        </header>
        <p>
          x가 u를 3배 빠르게 바꾸고, u가 y를 현재 지점에서 14배 빠르게 바꾼다면 x의
          작은 변화는 첫 구간에서 3배, 다음 구간에서 다시 14배 확대됩니다. 그래서 전체
          배율은 3+14가 아니라 3×14입니다.
        </p>
        <ChainRateViz />
        <ExplainedFormula
          question="y=(3x+1)²의 x=2에서 왜 local derivative를 곱할까요?"
          idea={<>Δx가 먼저 Δu≈(du/dx)Δx가 되고, 그 Δu가 다시 Δy≈(dy/du)Δu가 됩니다. 같은 변화가 두 배율을 연속 통과하므로 배율을 곱합니다.</>}
          formula={String.raw`\begin{aligned}u&=3x+1,\quad y=u^2\\\frac{dy}{dx}&=\frac{dy}{du}\frac{du}{dx}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}a&=\underbrace{\frac{dy}{du}}_{u\to y\text{ 배율}}\\[4pt]b&=\underbrace{\frac{du}{dx}}_{x\to u\text{ 배율}}\\[4pt]\frac{dy}{dx}&=\underbrace{a\cdot b}_{\substack{\text{같은 변화가 두 구간을 지나}\text{연속 배율을 곱함}}}\end{aligned}`}
          operations={[
            { expression: String.raw`\frac{du}{dx}`, annotation: ["x의 작은 이동을", "중간값 u의 이동으로 확대"] },
            { expression: String.raw`\frac{dy}{du}`, annotation: ["중간값의 이동을", "최종 y의 이동으로 다시 확대"] },
            { expression: String.raw`\frac{dy}{du}\cdot\frac{du}{dx}`, annotation: ["같은 변화가 연속 구간을 지나므로", "두 local 배율을 곱해 전체 배율 계산"] },
          ]}
          terms={[
            { symbol: "u", name: "중간값", description: "안쪽 함수의 output이자 바깥 함수의 input입니다." },
            { symbol: String.raw`du/dx`, name: "Inner derivative", description: "x 변화가 u에 전달되는 배율입니다." },
            { symbol: String.raw`dy/du`, name: "Outer derivative", description: "u 변화가 y에 전달되는 배율입니다." },
          ]}
          assumptions={["Inner function은 x에서, outer function은 u에서 미분 가능합니다.", "계산 graph가 갈라졌다 합쳐지면 서로 다른 경로의 contribution은 곱한 뒤 합산합니다."]}
          interpretation="x=2에서 u=7, du/dx=3, dy/du=14이므로 dy/dx=42입니다."
        />
      </section>

      <section id="nonsmooth" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 표준 derivative가 없는 경계</p>
          <h2 className="mt-2 text-2xl font-bold">Subgradient 집합과 implementation convention은 유일한 derivative가 아니다</h2>
        </header>
        <p>
          ReLU는 0의 왼쪽 slope가 0이고 오른쪽 slope가 1이어서 표준 derivative가
          없습니다. Convex analysis에서는 그 모서리를 아래에서 받칠 수 있는 slope의
          집합 [0,1]을 subdifferential로 둡니다. Autodiff가 그중 0을 선택하는 것은 실행
          규칙이지, 수학적으로 유일한 derivative를 발견했다는 뜻이 아닙니다.
        </p>
        <ExplainedFormula
          question="ReLU의 0에서 학습 코드는 어떤 값을 사용하고 무엇을 주장하면 안 될까요?"
          idea={<>왼쪽과 오른쪽의 서로 다른 slope를 먼저 보존하고, convex subgradient 집합과 framework가 선택한 대표값을 구분합니다.</>}
          formula={String.raw`\begin{aligned}\partial\operatorname{ReLU}(0)&=[0,1]\\\text{autodiff choice}&=0\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}f'_{-}(0)&=\underbrace{0}_{\text{왼쪽 local slope}}\\[4pt]f'_{+}(0)&=\underbrace{1}_{\text{오른쪽 local slope}}\\[4pt]\partial\operatorname{ReLU}(0)&=\underbrace{[0,1]}_{\text{가능한 convex slope 집합}}\\[4pt]\operatorname{backward}(0)&=\underbrace{0}_{\text{implementation 대표값}}\end{aligned}`}
          operations={[
            { expression: String.raw`f'_{-}(0)\ne f'_{+}(0)`, annotation: ["좌우 limit이 다르므로", "표준 derivative가 없다고 판정"] },
            { expression: String.raw`\partial\operatorname{ReLU}(0)=[0,1]`, annotation: ["모서리를 지지하는", "가능한 convex slope를 집합으로 보존"] },
            { expression: String.raw`[0,1]\to0`, annotation: ["framework가 backward를 실행하려고", "집합에서 convention 하나를 선택"] },
          ]}
          terms={[
            { symbol: String.raw`f'_{-},f'_{+}`, name: "좌·우 derivative", description: "각 방향에서 0으로 접근한 slope입니다." },
            { symbol: String.raw`\partial f(0)`, name: "Subdifferential", description: "Convex subgradient의 가능한 집합입니다." },
            { symbol: "0", name: "Implementation choice", description: "많은 framework가 exact zero에서 사용하는 backward convention입니다." },
          ]}
          assumptions={["[0,1] 해석은 convex ReLU에 대한 convex-analysis subgradient입니다.", "비convex nonsmooth function이나 전체 optimizer 수렴에 같은 결론을 자동 적용하지 않습니다."]}
          interpretation="표준 derivative 없음, 가능한 convex slope 집합, 실제 코드의 대표값 선택은 서로 다른 세 statement입니다."
        />
        <p>
          입력 좌표가 여러 개일 때의 local rate는
          <a className="ml-1 font-semibold text-primary underline" href="/ai/math-gradients-jacobians">gradient와 Jacobian</a> 글에서 이어집니다.
        </p>
        <div id="paper-differentiation"><CitationBlock source="MIT OpenCourseWare 18.01SC · Differentiation" citeKey={1} href={MIT_DIFFERENTIATION}><Evidence problem="평균 변화율에서 derivative와 chain rule까지 계산하는 문제" contribution="Difference quotient·limit·local linearization·chain rule를 lecture와 problem set으로 연결" assumptions="단변수 함수의 해당 미분 가능성 조건" scope="18.01SC differentiation 단원의 정의·예제·문제" notClaim="모든 nonsmooth optimization이나 neural-network convergence를 보장하지 않음" /></CitationBlock></div>
        <div id="paper-matrix-calculus"><CitationBlock source="The Matrix Calculus You Need For Deep Learning" citeKey={2} href={MATRIX_CALCULUS}><Evidence problem="Deep learning 독자가 scalar·vector chain rule 표기를 일관되게 읽기 어려운 문제" contribution="Derivative, chain rule, matrix calculus convention을 tutorial 형태로 정리" assumptions="명시된 numerator-layout convention과 differentiability" scope="Deep learning에 필요한 calculus 표기와 worked derivation" notClaim="새 theorem이나 특정 framework backward의 완전한 specification이 아님" /></CitationBlock></div>
        <ContentBoundary article="math-functions-derivatives-gradients" />
      </section>
    </article>
  );
}

function Term({ name, idea, shape, example, boundary }: { name: string; idea: string; shape: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{idea}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
