import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ChainRateViz from "./viz/ChainRateViz";
import SecantTangentViz from "./viz/SecantTangentViz";

const MIT_DIFFERENTIATION = "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/";
const MATRIX_CALCULUS = "https://arxiv.org/abs/1802.01528";
const OPENSTAX_DERIVATIVE = "https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative";
const OPENSTAX_CHAIN = "https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule";
const PYTORCH_AUTOGRAD = "https://docs.pytorch.org/docs/2.8/notes/autograd.html#gradients-for-non-differentiable-functions";

export default function DerivativeChainRuleArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" data-teach-level="S" className="space-y-6">
        <h2 className="text-2xl font-bold">1 · 값을 조금 바꾸면 결과는 얼마나 달라질까</h2>
        <p className="text-lg leading-8">
            계산 결과를 바꾸려면 어떤 입력을 얼마나 움직여야 할까요. 모델의 숫자를 고치는 학습도 이 질문에서 시작합니다. 지금 값 주변에서 입력의 작은 변화가 출력에 몇 배로 전달되는지
            알면 결과를 다시 전부 계산하기 전에 움직일 방향과 크기를 예상할 수 있습니다.
          </p>
        <p>
            앞 글에서 두 계산을 연결했다면 이번에는 그 연결을 지나가는 작은 변화를 따라갑니다. 한 점 주변의 전달 비율과 실제로 멀리 움직였을 때의 변화는 구별합니다. 그 차이를 알면
            미분값이 있다는 사실을 정확한 미래 예측으로 과장하지 않을 수 있습니다.
          </p>
        <p>출발점은 가까운 두 입력의 결과를 비교하는 것입니다. 먼저 계산을 밖에서 관찰하겠습니다.</p>
        <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
        <ol className="list-decimal space-y-2 pl-6"><li>f(x)=x²의 x=3에서 간격을 줄인 변화율은 6으로 모일까요?</li><li>3에서 0.1만큼 움직일 때 직선 예측은 9.6이고 실제 값은 9.61일까요?</li><li>x=3의 미분값 6만 알면 아무리 멀리 움직여도 실제 값을 정확히 예측할 수 있을까요?</li></ol>
        <p>답은 <strong>예, 예, 아니요</strong>입니다. 미분은 한 점 주변의 1차 변화율이며, 유한한 이동에는 곡률에서 생기는 오차가 남습니다.</p>
        <SecantTangentViz />
        <ContentBoundary article="math-functions-derivatives-gradients" />
      </section>
      <section id="black-box" data-teach-level="B" className="space-y-6">
        <h2 className="text-2xl font-bold">2 · 입력 차이와 결과 차이를 함께 본다</h2>
        <p>숫자를 하나 받아 제곱해서 돌려주는 장치를 생각해 봅시다. 3을 넣으면 9, 3.1을 넣으면 9.61이 나옵니다. 시작값을 0.1 늘렸더니 결과는 0.61 늘었습니다. 이 두 입력을 확인 지점으로 선택합니다(가정).</p>
        <p>결과의 차이 0.61만으로는 민감도를 비교하기 어렵습니다. 입력을 0.1 움직였는지 1 움직였는지에 따라 의미가 달라지기 때문입니다. 결과 차이를 입력 차이로 나누면 0.61/0.1=6.1이라는 같은 기준의 비율을 얻습니다.</p>
        <p>이 비율은 3에서 3.1까지 움직인 구간을 요약합니다. 정확히 3 근처의 비율을 알려면 움직이는 폭을 더 줄여야 합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="space-y-6">
        <h2 className="text-2xl font-bold">3 · 간격을 줄이면 7, 6.1, 6.01이 6으로 모인다</h2>
        <p>기준값 3은 고정하고 옆 값을 4, 3.1, 3.01로 옮겨 보겠습니다(가정). 제곱한 결과는 16, 9.61, 9.0601입니다. 기준 결과 9를 빼고 각각의 입력 간격 1, 0.1, 0.01로 나누면 7, 6.1, 6.01이 됩니다.</p>
        <p>왼쪽에서도 확인할 수 있습니다. 옆 값을 2.9, 2.99로 잡으면 같은 계산으로 5.9, 5.99를 얻습니다(가정). 양쪽에서 간격을 줄일수록 비율이 6에 가까워집니다. 단지 오른쪽에서 가까워진다는 사실만으로 양쪽의 행동이 같다고 단정하지 않습니다.</p>
        <p>계산이 두 단계이면 변화도 두 단계를 거칩니다. 앞 글의 2→7→49를 다시 쓰고 시작값만 2.01로 늘리면 2.01→7.03→49.4209입니다(가정). 처음 변화 0.01이 중간에서 0.03으로 바뀌고 마지막에 0.4209가 됩니다. 한 단계에서 구한 비율이 연결 뒤에는 어떻게 달라지는지도 이 숫자로 확인하겠습니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="space-y-6">
        <h2 className="text-2xl font-bold">4 · 두 결과를 비교한 뒤 간격을 줄인다</h2>
        <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3" aria-label="변화율을 구하는 흐름">
          <p><strong>얼마나 달라졌나?</strong><br />9.61−9=0.61</p>
          <p><strong>얼마나 움직였나?</strong><br />3.1−3=0.1</p>
          <p><strong>같은 기준으로 바꾸면?</strong><br />0.61/0.1=6.1</p>
        </div>
        <p>
            같은 절차를 더 작은 간격에도 적용합니다. 가까운 두 점의 비교는 그대로 두고 점 사이의 거리만 줄입니다. 간격을 처음부터 0으로 두면 차이도 0이 되어 0/0을 계산하게
            됩니다.
          </p>
        <p>계산 순서는 정해졌습니다. 빼기와 나누기, 간격 줄이기가 왜 모두 필요한지 정리하겠습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="space-y-6">
        <h2 className="text-2xl font-bold">5 · 값 자체와 변화에 대한 비율은 다른 정보다</h2>
        <p>9와 9.61에서 9를 빼는 이유는 현재 크기를 지우고 이동이 만든 변화만 남기기 위해서입니다. 이어 0.1로 나누는 이유는 다른 이동 폭과 같은 기준으로 비교하기 위해서입니다. 이 상태의 6.1은 아직 짧은 구간 전체의 평균입니다.</p>
        <p>간격을 줄이는 단계는 그 평균을 한 점 주변의 성질로 바꿉니다. 자동차가 2초 동안 6m 움직였다는 관찰은 평균 3m/s를 뜻합니다(가정). 그 사이 매 순간 3m/s였다고 말하려면 더 많은 정보가 필요합니다. 제곱 계산에서도 구간 평균 6.1과 한 점 주변의 6을 구별하는 이유가 같습니다.</p>
        <p>기준값을 고정하는 것도 필요합니다. 기준점과 옆 점을 매번 함께 바꾸면 서로 다른 위치에서 얻은 비율을 비교하게 됩니다. 지금 알고 싶은 것은 특정 위치의 민감도이므로 기준값 3은 그대로 두고 옆 값만 움직였습니다. 같은 규칙이라도 출발 위치가 바뀌면 전달 비율은 달라질 수 있습니다.</p>
        <p>두 단계 계산에서도 현재 위치를 잊으면 안 됩니다. 처음 넣은 값은 2이지만 제곱하는 단계가 받는 값은 7입니다. 작은 변화를 얼마나 확대하는지 계산할 때도 각 단계가 실제로 받은 위치를 써야 합니다. 중간값을 기록하는 일이 계산 결과뿐 아니라 변화 예측에도 필요한 이유입니다.</p>
        <p>움직인 폭까지 알아야 비율을 해석할 수 있다는 점이 잡혔습니다. 다음 이름들은 이 세 연산과 그 결과를 가리킵니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="space-y-6">
        <h2 className="text-2xl font-bold">6 · 작은 변화의 비율을 미분계수라고 부른다</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[660px] text-sm"><thead><tr><th className="p-3 text-left">이미 한 일</th><th className="p-3 text-left">이름과 표기</th><th className="p-3 text-left">뜻</th></tr></thead><tbody>
          {[['입력 차이로 출력 차이를 나눈다', '차분몫(difference quotient)', '두 점 사이의 평균 변화율'], ['간격을 줄일 때 모이는 값을 본다', '극한(limit), h→0', 'h가 0에 가까워질 때의 행동'], ['양쪽 비율이 같은 값에 모인다', '미분계수(derivative), f′(x)', '한 점 주변의 변화율'], ['변화율로 가까운 결과를 예상한다', '국소 선형 근사', '현재 값에 1차 변화 예측을 더함'], ['연결된 전달 비율을 곱한다', '연쇄법칙(chain rule)', '같은 변화가 연속 단계를 거친 결과']].map(row => <tr key={row[0]} className="border-t border-border">{row.map(cell => <td key={cell} className="min-w-[190px] p-3 align-top">{cell}</td>)}</tr>)}
        </tbody></table></div>
        <p>
            입력은 x로 적겠습니다. 입력 간격은 h이고, 제곱 함수는 f(x)=x²입니다. f′(3)=6은 x=3에서의 미분계수이고 각 x에 미분계수를 대응시킨 f′(x)=2x는 도함수입니다.
          </p>
        <p>이 표기를 쓰면 앞에서 여러 번 한 빼기와 나누기를 하나의 식으로 정리할 수 있습니다.</p>
      </section>
      <section id="derivative" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">7 · 같은 제곱 계산을 끝까지 정리하면 6+h가 남는다</h2>
        <p>
            x=3에서 f(3+h)−f(3)=(3+h)²−9=6h+h²입니다. h≠0일 때 h로 나누면 6+h가 됩니다. h=1, 0.1, 0.01이면 앞에서 얻은 7, 6.1,
            6.01이고 h=−0.1, −0.01이면 5.9, 5.99입니다. 양쪽 극한이 같은 6이므로 f′(3)=6입니다.
          </p>
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
        <p>
            극한은 그 점의 함수값과 다릅니다. 예를 들어 (x²−1)/(x−1)은 x=1에서 정의되지 않지만 x≠1인 주변에서는 (x−1)(x+1)/(x−1)=x+1로 정리됩니다.
            x=0.99와 1.01에서 각각 1.99와 2.01이므로 극한은 2입니다(가정). 약분한 식으로 원래 함수의 빠진 점을 자동으로 채웠다고 해석하지 않습니다.
          </p>
        <p>
            물리량을 미분하면 단위도 나눕니다. 위치가 m이고 시간이 s라면 변화율 단위는 m/s입니다. 1s 동안 3m 이동했다면 구간 평균은 3m/s이고 순간 변화율은 그 구간을 해당
            시각 주변으로 줄여 얻습니다(가정).
          </p>
        <p>한 점의 비율을 구했습니다. 이제 그 6을 이용해 가까운 결과를 예측하고 오차를 재겠습니다.</p>
      </section>
      <section id="local-linearity" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">8 · 9.6이라는 예측과 실제 9.61 사이에는 오차가 남는다</h2>
        <p>3에서 0.1만큼 움직이면 변화 예측은 6×0.1=0.6입니다. 현재 값 9에 더하면 9.6이지만 실제 제곱값은 9.61입니다. 입력을 제곱해 전개할 때 빠뜨린 항은 (0.1)²=0.01입니다.</p>
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
        <p>간격을 0.01로 줄이면 예측은 9.06, 실제는 9.0601이라 오차도 0.0001로 줄어듭니다. 반대로 간격을 1로 늘리면 예측 15와 실제 16의 차이가 1입니다. 이 제곱 함수에서는 생략한 항이 정확히 (Δx)²여서 차이를 직접 계산할 수 있습니다. 모든 함수의 오차가 같은 제곱식이라는 뜻은 아닙니다.</p>
        <p>한 단계의 작은 변화는 예측할 수 있습니다. 같은 생각을 2→7→49의 두 단계에 적용하겠습니다.</p>
      </section>
      <section id="chain-rule" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">9 · 변화가 두 단계를 지나면 배율을 곱한다</h2>
        <p>u=3x+1, y=u²에서 x=2이면 u=7, y=49입니다. 첫 단계는 입력 변화에 정확히 3을 곱합니다. 둘째 단계는 u=7 주변에서 제곱하므로 미분계수가 2×7=14입니다. 전체 배율은 14×3=42입니다.</p>
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
        <p>앞서 정한 Δx=0.01을 넣으면 Δu=0.03, Δy≈14×0.03=0.42입니다. 실제 변화는 49.4209−49=0.4209이므로 차이는 0.0009입니다. 이 차이는 둘째 단계에서 생략한 (0.03)²입니다. 3+14를 더한 17은 같은 변화가 연속해서 확대되는 과정을 나타내지 못합니다.</p>
        <ChainRateViz />
        <AlgorithmBlock title="한 경로의 변화율 계산 (의사코드)" input={['x=2, u=3x+1, y=u², 작은 변화 Δx=0.01']} steps={[{code:'u ← 3x+1 = 7; y ← u² = 49',note:'먼저 각 미분을 평가할 현재 위치를 구합니다.'},{code:'b ← du/dx = 3; a ← dy/du = 2u = 14',note:'바깥 미분은 원래 입력 2가 아니라 중간값 7에서 계산합니다.'},{code:'전체 미분 ← a×b = 42',note:'같은 변화가 두 구간을 차례로 지납니다.'},{code:'예측 변화 ← 42×0.01 = 0.42'}]} output="미분계수 42, 변화 예측 0.42; 실제 변화 0.4209" />
        <p>왜 곱해지는지는 비율로도 확인할 수 있습니다. 중간 변화 Δu가 0이 아니면 Δy/Δx=(Δy/Δu)(Δu/Δx)입니다. 두 함수가 해당 점에서 미분 가능할 때 각 비율의 극한을 취하면 배율의 곱이 남습니다. Δu=0이 되는 입력까지 다루는 증명에서는 0으로 나누지 않도록 아래처럼 근사의 오차를 따로 둡니다.</p>
        <ProgressiveDetail title="중간 변화가 0이어도 연쇄법칙이 성립하는 이유" preview="각 단계의 오차가 입력 변화보다 빠르게 줄어든다는 미분 가능성의 조건을 쓰면 0으로 나눌 필요가 없습니다.">
          <p>
            h=Δx, k=Δu라 하고 두 미분계수를 b와 a로 둡니다. 미분 가능하다는 것은 k=bh+h·ε(h), Δy=ak+k·δ(k)로 쓸 수 있고 h→0에서 ε(h)→0,
            k→0에서 δ(k)→0이라는 뜻입니다. ε와 δ는 각 단계에서 남은 오차를 입력 변화로 나눈 값이며 정확히 0인 입력에서는 0으로 연장해도 식은 같습니다.
          </p>
          <p>둘째 식에 첫째 식을 넣고 h≠0으로 나누면 Δy/h=a[b+ε(h)]+[b+ε(h)]δ(k)입니다. h가 줄면 k도 줄고 두 오차 항이 사라져 ab가 남습니다. 중간 변화 k가 0이어도 k로 나누지 않았으므로 같은 결론입니다.</p>
        </ProgressiveDetail>
        <p>
            분기했다 합쳐지는 계산은 경로별 기여를 더합니다. 같은 입력을 u=3x+1과 v=x²에 보내 y=u+v로 합치면 x=2에서 경로 배율은 3과 4입니다(가정). 같은 Δx가
            양쪽에 들어가므로 Δy≈3Δx+4Δx=7Δx입니다. 한 경로 안에서는 곱하고 여러 경로가 합쳐질 때는 더합니다.
          </p>
        <p>미분 가능성 조건을 빼면 이 계산은 성립하지 않습니다. u=x, y=|u|를 x=0에서 보면 바깥 함수의 좌우 기울기가 −1과 1이어서 곱할 미분값이 없습니다. 다음 원문에서도 두 미분을 어느 위치에서 평가하는지 확인하겠습니다.</p>
      </section>
      <section id="source" data-teach-level="5-6" className="space-y-6">
        <h2 className="text-2xl font-bold">10 · 원문 식의 기준점과 중간값에 각각 3과 7을 넣는다</h2>
        <p><a href={OPENSTAX_DERIVATIVE} className="font-semibold text-primary underline">OpenStax Calculus Volume 1 §3.1 식 (3.2)</a>의 원문 표기는 <code>Q=[f(a+h)−f(a)]/h</code>입니다. 이 식의 a는 기준점입니다. 같은 제곱 사례의 a=3, h=0.1을 넣으면 Q=(9.61−9)/0.1=6.1입니다. 식 (3.4)는 이 차분몫의 h→0 극한이고, 바로 뒤 Example 3.2도 f(x)=x²의 x=3에서 6을 구합니다.</p>
        <p><a href={OPENSTAX_CHAIN} className="font-semibold text-primary underline">같은 교재 §3.6 식 (3.17)</a>은 원문에서 <code>h′(x)=f′(g(x))g′(x)</code>입니다. 여기의 h는 합성 함수의 이름으로, 앞 절의 입력 간격 h와 역할이 다릅니다. g(x)=3x+1, f(u)=u²와 x=2를 넣으면 f′(g(2))=f′(7)=14, g′(2)=3이어서 h′(2)=42입니다. 원문 조건도 안쪽 g는 2에서, 바깥 f는 7에서 미분 가능하다는 것입니다.</p>
        <p><a href="https://explained.ai/matrix-calculus/#sec:1.4.5.1" className="font-semibold text-primary underline">Parr·Howard의 The Matrix Calculus You Need For Deep Learning, Single-variable chain rule 절</a>도 중간값을 분리해 각 미분을 곱하는 절차를 설명합니다. 이 사례에서는 중간값 7을 구한 뒤 배율 14와 3을 합칩니다. 이 튜토리얼의 역할은 표기와 계산 경로를 연결하는 것이며, 특정 학습 프로그램의 실행 결과를 보장하지 않습니다.</p>
        <div id="paper-differentiation"><CitationBlock source="MIT OpenCourseWare 18.01SC · Differentiation" citeKey={1} href={MIT_DIFFERENTIATION}><Evidence problem="평균 변화율에서 derivative와 chain rule까지 계산하는 문제" contribution="Difference quotient·limit·local linearization·chain rule를 lecture와 problem set으로 연결" assumptions="단변수 함수의 해당 미분 가능성 조건" scope="18.01SC differentiation 단원의 정의·예제·문제" notClaim="모든 nonsmooth optimization이나 neural-network convergence를 보장하지 않음" /></CitationBlock></div>
        <div id="paper-matrix-calculus"><CitationBlock source="The Matrix Calculus You Need For Deep Learning" citeKey={2} href={MATRIX_CALCULUS}><Evidence problem="Deep learning 독자가 scalar·vector chain rule 표기를 일관되게 읽기 어려운 문제" contribution="Derivative, chain rule, matrix calculus convention을 tutorial 형태로 정리" assumptions="명시된 numerator-layout convention과 differentiability" scope="Deep learning에 필요한 calculus 표기와 worked derivation" notClaim="새 theorem이나 특정 framework backward의 완전한 specification이 아님" /></CitationBlock></div>

        <p>미분 가능한 지점에서는 같은 답이 나옵니다. 다음 경계에서는 양쪽 비율이 서로 달라 한 값으로 모이지 않습니다.</p>
      </section>
      <section id="nonsmooth" data-teach-level="7" className="space-y-6">
        <h2 className="text-2xl font-bold">11 · 모서리에서 코드가 고른 값은 유일한 미분값이 아니다</h2>
        <p>음수는 0으로 바꾸고 양수는 그대로 두는 ReLU를 0에서 살펴봅니다. 왼쪽에서 움직일 때 출력 변화는 0이지만 오른쪽에서는 입력과 같은 만큼 변합니다. 좌우 기울기가 0과 1로 달라 표준 미분계수가 없습니다.</p>
        <p>
            이 모서리 아래에 놓이는 직선을 생각하면 가능한 기울기는 0부터 1까지입니다. 기울기 s인 직선 sx가 음수 쪽에서도 0 아래에 있으려면 s≥0이고 양수 쪽에서 x 아래에
            있으려면 s≤1이어야 합니다. 함수를 아래에서 받치는 이런 기울기를 부분기울기(subgradient), 가능한 집합을 부분미분집합(subdifferential)이라고 부릅니다.
          </p>
        <ProgressiveDetail title="표준 미분, 가능한 기울기 집합, 구현 선택을 식으로 비교하면" preview="ReLU의 0에는 표준 미분이 없고 가능한 볼록 부분기울기는 [0,1]입니다. PyTorch 문서의 선택 규칙은 그중 0을 사용합니다.">
        <ExplainedFormula
          question="ReLU의 0에서 학습 코드는 어떤 값을 사용하고 무엇을 주장하면 안 될까요?"
          idea={<>왼쪽과 오른쪽의 서로 다른 slope를 먼저 보존하고, convex subgradient 집합과 framework가 선택한 대표값을 구분합니다.</>}
          formula={String.raw`\begin{aligned}\partial\operatorname{ReLU}(0)&=[0,1]\\\text{PyTorch choice}&=0\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}f'_{-}(0)&=\underbrace{0}_{\text{왼쪽 local slope}}\\[4pt]f'_{+}(0)&=\underbrace{1}_{\text{오른쪽 local slope}}\\[4pt]\partial\operatorname{ReLU}(0)&=\underbrace{[0,1]}_{\text{가능한 convex slope 집합}}\\[4pt]\operatorname{backward}(0)&=\underbrace{0}_{\text{implementation 대표값}}\end{aligned}`}
          operations={[
            { expression: String.raw`f'_{-}(0)\ne f'_{+}(0)`, annotation: ["좌우 limit이 다르므로", "표준 derivative가 없다고 판정"] },
            { expression: String.raw`\partial\operatorname{ReLU}(0)=[0,1]`, annotation: ["모서리를 지지하는", "가능한 convex slope를 집합으로 보존"] },
            { expression: String.raw`[0,1]\to0`, annotation: ["PyTorch가 backward를 실행하려고", "집합에서 convention 하나를 선택"] },
          ]}
          terms={[
            { symbol: String.raw`f'_{-},f'_{+}`, name: "좌·우 derivative", description: "각 방향에서 0으로 접근한 slope입니다." },
            { symbol: String.raw`\partial f(0)`, name: "Subdifferential", description: "Convex subgradient의 가능한 집합입니다." },
            { symbol: "0", name: "Implementation choice", description: "이 글에서는 PyTorch 2.8 문서의 최소 크기 선택 규칙을 적용합니다." },
          ]}
          assumptions={["[0,1] 해석은 convex ReLU에 대한 convex-analysis subgradient입니다.", "비convex nonsmooth function이나 전체 optimizer 수렴에 같은 결론을 자동 적용하지 않습니다."]}
          interpretation="표준 derivative 없음, 가능한 convex slope 집합, 실제 코드의 대표값 선택은 서로 다른 세 statement입니다."
        />
        </ProgressiveDetail>
        <p><a href={PYTORCH_AUTOGRAD} className="font-semibold text-primary underline">PyTorch 2.8 Autograd mechanics의 비미분 가능 함수 규칙 2</a>는 볼록 함수에서 크기가 가장 작은 부분기울기를 사용한다고 명시합니다. ReLU의 0에 이를 적용하면 [0,1] 중 크기가 가장 작은 0을 고릅니다. 이 문서 규칙을 적용한 결과이며, 모든 프로그램이 같은 경계값을 선택한다는 주장은 아닙니다.</p>
        <p>|x|의 0도 왼쪽 기울기 −1과 오른쪽 기울기 1이 다릅니다. u=x, y=|u|로 연결하더라도 바깥 미분이 없으므로 표준 연쇄법칙의 두 미분을 곱해 답을 정할 수 없습니다. 비볼록 함수나 전체 학습의 수렴에 볼록 부분기울기의 결론을 그대로 넓히지도 않습니다.</p>
        <p>여러 좌표의 작은 변화를 동시에 다루는 방법은 <a className="font-semibold text-primary underline" href="/cs/ai/math-gradients-jacobians">기울기와 야코비안</a>에서 이어집니다. 각 좌표의 변화율을 묶어도 현재 점에서의 정보라는 한계는 유지됩니다.</p>
        <ol className="list-decimal space-y-3 pl-6">
          <li>제곱 함수의 x=3에서 입력 간격을 0.1에서 1로 키우면 직선 예측의 오차는 어떻게 달라지나요? (답: 8절)</li>
          <li>2→7→49의 두 계산에서 바깥 미분을 2에서 구하면 왜 전체 배율 42를 얻지 못하나요? (답: 9절)</li>
          <li>ReLU의 0에서 프로그램이 0을 반환하면 좌우 미분도 같아졌다고 말할 수 있나요? (답: 11절)</li>
        </ol>
      </section>
    </article>
  );
}

function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
