import FactorStructureViz from "@/components/articles/factor-structure-viz";
import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { logarithmCodeRefs } from "./codeRefs";
import HalvingCountViz from "./viz/HalvingCountViz";
const LOG_DEFINITION="https://openstax.org/books/college-algebra-2e/pages/6-3-logarithmic-functions";
const LOG_RULES="https://openstax.org/books/college-algebra-2e/pages/6-5-logarithmic-properties";
const PYTHON_MATH="https://docs.python.org/3.9/library/math.html";
export default function ExponentsLogarithmsArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1 · 절반으로 줄인 양과 줄인 횟수를 함께 기록한다</h2>
<p className="text-lg leading-8">동전을 세 번 던져 모두 앞면이 나올 가능성을 생각해 봅시다. 매번 앞면일 가능성은 1/2이고 앞의 어떤 결과를 알아도 다음 앞면의 가능성이 바뀌지 않는다고 가정합니다. 처음에는 1, 한 번 확인하면 1/2, 두 번이면 1/4, 세 번이면 1/8이 됩니다. 확률은 곱해서 작아지고 절반으로 줄인 횟수는 하나씩 늘어납니다.</p>
<p>같은 상황을 양으로 기록할 수도 있고 변화의 횟수로 기록할 수도 있습니다. 이 두 기록을 서로 바꾸는 계산을 익히면 긴 확률의 곱을 덧셈으로 다룰 수 있습니다. 먼저 세 번의 작은 사례를 끝까지 계산한 뒤 2000번으로 늘렸을 때 컴퓨터에 무엇이 남는지 확인하겠습니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>서로 독립인 공정한 동전을 세 번 던져 모두 앞면일 확률은 1/8일까요?</li><li>2를 기준으로 1/8을 만들 지수는 −3일까요?</li><li>한 번 던진 결과를 세 칸에 복사해도 세 칸 모두 앞면일 확률은 1/8일까요?</li></ol>
<p>답은 <strong>예, 예, 아니요</strong>입니다. 거듭제곱과 로그의 계산보다 먼저 같은 배율을 새로 곱할 조건이 실제로 세 번 생기는지 확인해야 합니다.</p>
<HalvingCountViz />
<ContentBoundary article="math-exponents-logarithms" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2 · 한 번마다 같은 배율을 받고 남은 양을 돌려준다</h2>
<p>시작값은 1, 매번 곱할 값은 1/2, 적용할 횟수는 3입니다. 여기서 1/2은 측정값이 아니라 설명을 위해 정한 공정한 동전의 확률입니다(가정). 실제 자료에서 앞면이 나오는 횟수가 반드시 전체의 절반이라는 뜻은 아닙니다. 한 번의 시행이 낼 수 있는 두 결과에 같은 가능성을 준 모형입니다.</p>
<div className="grid gap-5 md:grid-cols-3"><div className="border-t border-border pt-3"><h3 className="font-semibold">입력</h3><p className="mt-2">시작값 1, 배율 1/2, 세 번의 적용을 줍니다.</p></div><div className="border-t border-border pt-3"><h3 className="font-semibold">계산</h3><p className="mt-2">남은 값에 1/2을 곱하면서 적용 횟수도 하나씩 셉니다.</p></div><div className="border-t border-border pt-3"><h3 className="font-semibold">출력</h3><p className="mt-2">남은 값 1/8과 절반으로 줄인 횟수 3을 얻습니다.</p></div></div>
<p>거꾸로 남은 값 1/8을 받은 뒤 절반으로 몇 번 줄였는지 물을 수도 있습니다. 1→1/2→1/4→1/8을 되짚으면 답은 3입니다. 시작값과 배율이 정해져 있어야 이 횟수를 되찾을 수 있습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3 · 세 결과를 확인하는 두 기록은 같은 상황을 나타낸다</h2>
<p>세 번의 결과를 앞과 뒤로 적으면 가능한 순서는 여덟 가지입니다. 앞앞앞, 앞앞뒤, 앞뒤앞, 앞뒤뒤, 뒤앞앞, 뒤앞뒤, 뒤뒤앞, 뒤뒤뒤입니다. 앞의 가정에서는 각 순서의 가능성이 같습니다. 모두 앞면이라는 조건을 만족하는 순서는 하나이므로 전체 가능성은 1/8입니다.</p>
<p>곱셈으로 계산해도 같습니다. 첫 앞면에 1/2, 그 결과를 알고 나서도 다음 앞면에 1/2, 앞앞을 알고 나서도 마지막 앞면에 1/2을 곱합니다. 결과는 1/8=0.125입니다. 모든 결과가 동시에 일어나는 가능성과 개별 결과 하나의 가능성을 구분해야 합니다.</p>
<p>한 번 줄인 부분과 두 번 줄인 부분을 따로 계산해 보겠습니다. 남은 양은 1/2과 1/4이고 둘을 곱하면 1/8입니다. 횟수로 기록하면 1+2=3입니다. 앞부분과 뒷부분을 이어 붙일 때 양의 곱이 횟수의 합으로 바뀌었습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4 · 위 막대는 절반씩 줄고 아래 눈금은 한 칸씩 늘어난다</h2>
<p>위쪽은 남은 양을 같은 길이의 기준으로 그린 막대입니다. 아래쪽은 절반으로 줄인 횟수입니다. 두 눈금은 같은 수를 뜻하지 않습니다. 막대가 1/8인 장면에서 아래 값은 3이며 한쪽 기록을 다른 쪽으로 바꾸어 읽습니다.</p>
<p>아래 눈금이 한 칸 늘 때마다 위 막대는 같은 길이만큼 줄지 않습니다. 1에서 1/2로 줄어든 차이는 1/2이고 1/4에서 1/8로 줄어든 차이는 1/8입니다. 같게 유지되는 것은 남은 양의 비율과 아래쪽의 한 칸 간격입니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5 · 아주 작은 양도 변화의 횟수로 비교할 수 있다</h2>
<p>절반으로 2000번 줄이면 분모는 2를 2000번 곱한 수입니다. 이런 양을 작은 소수로 직접 쓰는 대신 절반으로 줄인 횟수 2000을 보관할 수 있습니다. 2001번 줄인 양이 그보다 다시 절반이라는 사실도 두 횟수의 차이 1에서 읽을 수 있습니다.</p>
<p>이 방법이 원래 양을 크게 바꾸어 만드는 것은 아닙니다. 같은 양의 다른 기록입니다. 계산 장치가 아주 작은 소수를 구별하지 못하더라도 횟수 쪽의 기록은 아직 구별할 수 있습니다. 다만 마지막에 원래 작은 소수로 되돌려 저장하면 같은 표현 범위에 다시 막힐 수 있습니다.</p>
<p>정확히 절반의 거듭 반복이 아닌 값도 있습니다. 1/3은 한 번 줄인 1/2과 두 번 줄인 1/4 사이에 있습니다. 이를 표현하려면 횟수를 정수에만 묶지 않고 1과 2 사이의 수로 넓혀야 합니다. 실제 확률은 이런 중간 값도 많이 사용합니다.</p>
<p>앞면 가능성 1/2이라는 숫자만 보고 무조건 세 번 곱하면 안 됩니다. 한 번 던진 결과를 세 칸에 그대로 복사한다면 각 칸의 앞면 가능성은 1/2이지만 세 칸 모두 앞면일 가능성도 1/2입니다. 두 번째와 세 번째 칸에서 새로운 선택이 없기 때문입니다. 계산 규칙과 그 규칙에 넣을 값의 조건을 함께 확인해야 합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6 · 배율, 적용 정도, 거꾸로 묻는 계산에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">이름</th><th className="p-3">같은 사례</th></tr></thead><tbody>{[["같은 배율을 거듭 적용하는 계산","거듭제곱(exponentiation)","(1/2)³=1/8"],["반복할 배율과 적용 정도","밑(base)과 지수(exponent)","밑 1/2, 지수 3"],["결과에서 필요한 지수를 되묻는 계산","로그(logarithm)","1/2을 세 번 곱하면 1/8"]].map((row,i)=><tr key={i} className="border-t border-border">{row.map((cell,j)=><td key={j} className="p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
<p>이름을 붙여도 양과 횟수의 구분은 그대로입니다. 밑을 2로 정하면 1/8을 만들 지수는 −3이고 밑을 1/2로 정하면 3입니다. 로그를 읽을 때는 결과 숫자와 함께 밑을 확인합니다.</p>
</section>
<section id="exponents" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7 · 같은 밑의 곱은 적용한 지수를 더한다</h2>
<p>2³은 2×2×2=8입니다. 2를 두 번 더 곱하면 8×4=32이고 전체 다섯 번이므로 2⁵입니다. 양의 정수에서 세던 반복을 이어 붙이는 이 관계를 0과 음수, 더 나아가 실수 지수까지 확장합니다.</p>
<ExplainedFormula question="같은 배율을 m번 적용한 뒤 n번 더 적용하면 어떻게 적을까요?" idea="같은 밑의 반복을 이어 붙이면 총 적용 횟수는 m+n입니다. 이 구조를 유지하며 지수의 범위를 넓힙니다." formula={String.raw`a^m a^n=a^{m+n}`} annotatedFormula={String.raw`\begin{gathered}a^m a^n=a^{m+n}\\[8pt](1/2)^1(1/2)^2=(1/2)^{\underbrace{1+2}_{\text{이어 붙인 횟수}}}=1/8\end{gathered}`} operations={[{expression:String.raw`2^3\cdot2^2=8\cdot4=32=2^5`,annotation:["같은 밑 2의 다섯 번 곱셈을 두 구간으로 나누었습니다."]},{expression:String.raw`3^2\cdot3^3=9\cdot27=243`,annotation:["밑이 모두 3이면 지수 2와 3을 더할 수 있습니다."]}]} terms={[{symbol:"a",name:"밑",description:"여기서는 양수인 공통 배율입니다."},{symbol:"m, n",name:"지수",description:"처음에는 반복 횟수로 읽고 이후 실수까지 확장합니다."},{symbol:"m+n",name:"합친 지수",description:"같은 배율의 두 구간을 이어 붙인 정도입니다."}]} assumptions={["양의 밑 a를 사용합니다. 같은 밑끼리의 곱이어야 합니다.","실수 지수는 정수 횟수만으로 정의하지 않습니다. 양의 밑에서 유리수 지수를 거쳐 연속적으로 확장할 수 있습니다."]} interpretation="3²×2³은 9×8=72입니다. 밑이 다르므로 3⁵=243이나 2⁵=32로 바꿀 수 없습니다." />
<p>a⁰=1로 두어야 aᵐa⁰=aᵐ을 유지합니다. 음수 지수는 반대 배율을 적용합니다. 2⁻³=1/2³=1/8이며 (1/2)³과 같습니다. 반대로 (1/2)⁻³=8입니다. 음수 지수가 결과를 음수로 만든다는 뜻은 아닙니다.</p>
<p>분수 지수도 같은 규칙을 유지합니다. 2^(1/2)를 두 번 곱하면 2¹=2여야 하므로 양의 값 √2입니다. 1/3에 대응하는 지수처럼 정수가 아닌 값을 다루려면 이런 확장이 필요합니다. 이 글의 실수 지수와 로그는 양의 밑을 전제로 합니다.</p>
<FactorStructureViz
  eyebrow="지수를 눈으로 세기"
  title="2를 다섯 번 곱한다는 말이 2⁵입니다"
  description="앞의 세 묶음이 2³=8을 만들고, 같은 밑 2를 두 번 더 붙이면 지수의 반복 횟수도 3+2=5가 됩니다."
  factors={[
    {label:"첫째 2",value:"2",detail:"곱할 수 한 번",marks:2},
    {label:"둘째 2",value:"2",detail:"곱할 수 두 번",marks:2},
    {label:"셋째 2",value:"2",detail:"여기까지 2³=8",marks:2,accent:true},
    {label:"넷째·다섯째",value:"2 × 2",detail:"같은 밑을 두 번 더 붙임",marks:4},
  ]}
  equation="(2 × 2 × 2) × (2 × 2) = 2³ × 2² = 2⁵"
  result="32"
  note="양의 정수 지수에서는 지수가 곱셈의 반복 횟수입니다. 0·음수·실수 지수는 이 관계를 보존하도록 뒤 절에서 확장합니다."
/>
</section>
<section id="logarithms" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">8 · 결과 1/8에서 필요한 지수 −3을 되찾는다</h2>
<p>밑 2를 기준으로 1/8을 만들려면 세 번 곱하는 방향과 반대로 가야 합니다. 2⁻³=1/8이므로 log₂(1/8)=−3입니다. 처음 사용한 밑 1/2에서는 (1/2)³=1/8이라 밑 1/2에서 로그값은 3입니다. 같은 양에 서로 다른 기준을 사용했습니다.</p>
<ExplainedFormula question="밑 a로 결과 x를 만들기 위해 필요한 지수는 무엇일까요?" idea="로그가 돌려준 값을 지수에 넣으면 원래 양 x가 돌아와야 합니다. 두 식은 같은 관계를 반대 방향으로 읽습니다." formula={String.raw`y=\log_a x\quad\Longleftrightarrow\quad a^y=x`} annotatedFormula={String.raw`\begin{gathered}y=\log_a x\quad\Longleftrightarrow\quad a^y=x\\[8pt]\underbrace{\log_2(1/8)=-3}_{\text{결과에서 지수로}}\quad\Longleftrightarrow\quad\underbrace{2^{-3}=1/8}_{\text{지수에서 결과로}}\end{gathered}`} operations={[{expression:String.raw`2^5=32\ \Longleftrightarrow\ \log_2 32=5`,annotation:["커지는 쪽에서도 같은 역관계를 확인합니다."]},{expression:String.raw`2^0=1\ \Longleftrightarrow\ \log_2 1=0`,annotation:["배율을 적용하지 않은 기준값은 1입니다."]}]} terms={[{symbol:"x",name:"로그 입력",description:"되묻고 싶은 원래 양이며 0보다 커야 합니다."},{symbol:"a",name:"기준 밑",description:"양수이며 1이 아닌 값입니다."},{symbol:"y",name:"로그 출력",description:"a를 어느 정도 거듭제곱하면 x가 되는지 나타내는 실수입니다."}]} assumptions={["실수 범위에서 x>0, a>0, a≠1입니다.","0과 음수 입력에는 이 실수 로그가 정의되지 않습니다."]} interpretation="log₂8=3, log₂0.25=−2, log₁₀0.01=−2입니다. 음수인 로그값과 음수인 로그 입력을 구별합니다." />
<p>밑 1은 어떤 실수 지수를 넣어도 1이라 결과에서 지수를 하나로 되찾을 수 없습니다. 밑 −2는 모든 실수 지수에 대해 실수 결과를 주는 이 정의를 만족하지 않습니다. log₂0과 log₂(−4)도 실수 값이 없습니다. x가 0으로 다가갈 때의 극한과 x=0에서 함수값이 있다는 주장은 다릅니다.</p>
</section>
<section id="log-identities" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">9 · 곱을 합으로 옮겨 같은 세 번을 추적한다</h2>
<p>u=aᵐ, v=aⁿ이면 uv=aᵐ⁺ⁿ입니다. 로그는 필요한 지수를 돌려주므로 logₐ(uv)=m+n=logₐu+logₐv입니다. 나누면 지수가 m−n이 되어 로그의 차로 바뀝니다. 결과 숫자를 외우기보다 같은 밑의 거듭제곱을 먼저 연결하면 규칙의 이유가 보입니다.</p>
<ExplainedFormula question="원래 양을 곱하고 나누는 계산은 로그에서 어떻게 바뀔까요?" idea="양수들을 같은 밑의 거듭제곱으로 적습니다. 곱은 지수의 합, 나눗셈은 지수의 차가 됩니다." formula={String.raw`\log_a(uv)=\log_a u+\log_a v,\qquad\log_a\!\left(\frac uv\right)=\log_a u-\log_a v`} annotatedFormula={String.raw`\begin{gathered}\log_a(uv)=\log_a u+\log_a v,\qquad\log_a\!\left(\frac uv\right)=\log_a u-\log_a v\\[8pt]\log_2((1/2)(1/4))=\underbrace{-1}_{\log_2(1/2)}+\underbrace{-2}_{\log_2(1/4)}=-3\end{gathered}`} operations={[{expression:String.raw`\log_2(8\cdot4)=\log_2 32=3+2=5`,annotation:["서로 다른 두 양수에서도 같은 규칙이 적용됩니다."]},{expression:String.raw`\log_2(8/4)=\log_2 2=3-2=1`,annotation:["나눗셈은 로그값의 뺄셈으로 바뀝니다."]}]} terms={[{symbol:"u, v",name:"양수인 두 입력",description:"각각의 로그를 만들 수 있어야 합니다."},{symbol:String.raw`\log_a u`,name:"같은 기준의 지수",description:"입력 u를 a의 거듭제곱으로 나타낸 값입니다."},{symbol:"+, −",name:"변환 뒤의 연산",description:"원래의 곱과 나눗셈에 각각 대응합니다."}]} assumptions={["u>0, v>0, a>0, a≠1이며 모든 로그가 같은 밑을 사용합니다.","로그의 입력이 합인 경우에는 이 곱셈 규칙을 적용하지 않습니다."]} interpretation="세 동전 사례의 log₂ 확률은 −1−1−1=−3입니다. 원래 확률은 2⁻³=1/8로 되돌아옵니다." />
<p>u=v=1을 넣으면 log₂(u+v)=log₂2=1이지만 log₂u+log₂v=0입니다. 따라서 합의 로그를 로그의 합으로 바꾸는 주장은 틀립니다. 음수 두 개에도 주의해야 합니다. ln((−2)(−8))은 ln16으로 정의되지만 ln(−2)+ln(−8)은 실수 식으로 만들 수 없습니다. 곱이 양수라는 사실만으로 각각의 입력 조건이 충족되지는 않습니다.</p>
<p>세 동전의 주변 확률을 곱한 데에는 독립이라는 전제가 있었습니다. 독립이 아니어도 앞 결과를 조건으로 삼은 확률의 곱은 사용할 수 있습니다. 모든 앞면의 가능성은 P(첫 앞면)×P(둘째 앞면|첫 앞면)×P(셋째 앞면|앞앞)입니다. 모형이 준 이런 조건부 확률의 로그를 더하면 결합 확률의 로그를 얻습니다.</p>
</section>
<section id="log-bases" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">10 · 밑 2와 자연로그는 같은 양을 다른 단위로 쓴다</h2>
<p>자연상수 e≈2.71828을 밑으로 쓰는 로그는 ln이라고 적습니다. x=bʸ에 밑 a의 로그를 취하면 logₐx=y·logₐb입니다. b≠1이라 분모가 0이 아니므로 나누어 y를 구할 수 있습니다.</p>
<ExplainedFormula question="계산기가 주는 자연로그로 밑 2의 값을 어떻게 구할까요?" idea="같은 양의 로그를 기준 배율 하나의 로그로 나눕니다. 이번 1/8은 자연로그에서 −3ln2이므로 ln2로 나누면 −3입니다." formula={String.raw`\log_b x=\frac{\log_a x}{\log_a b}`} annotatedFormula={String.raw`\begin{gathered}\log_b x=\frac{\log_a x}{\log_a b}\\[8pt]\log_2(1/8)=\frac{\underbrace{\ln(1/8)}_{-3\ln2}}{\underbrace{\ln2}_{\text{기준 배율의 값}}}=-3\end{gathered}`} operations={[{expression:String.raw`\log_2 8=\ln8/\ln2=3`,annotation:["같은 변환을 8에도 대입합니다."]},{expression:String.raw`-\ln(1/8)=3\ln2\approx2.079442`,annotation:["음의 로그로 측정한 비용은 자연로그 단위에서 이 값입니다."]}]} terms={[{symbol:"a, b",name:"두 기준 밑",description:"양수이며 1이 아닌 두 값입니다."},{symbol:String.raw`\log_a b`,name:"단위 변환의 분모",description:"기준 배율 b를 밑 a에서 읽은 고정된 수입니다."},{symbol:"x",name:"원래 양",description:"단위를 바꾸어도 x 자체는 변하지 않습니다."}]} assumptions={["x>0, a>0, b>0이며 a와 b는 모두 1이 아닙니다.","값의 순서를 보존하는 양의 변환인지 보려면 분모의 부호도 확인합니다."]} interpretation="밑 2와 e는 모두 1보다 커서 변환 계수 1/ln2가 양수입니다. 그러나 밑 1/2로 바꾸면 ln(1/2)가 음수라 값의 부호와 순서가 뒤집힙니다." />
<p>한 사건의 음의 로그를 밑 2로 재면 단위는 bit, 자연로그로 재면 nat입니다. 확률 1/8의 비용은 3 bit 또는 3ln2≈2.079442 nat입니다. 두 단위 사이의 양의 상수배는 단독 목적함수의 최솟값을 만드는 위치를 보존합니다. 함수값의 크기는 달라집니다.</p>
<p>미분값도 같은 상수배가 되므로 같은 학습률을 사용한 한 번의 이동은 달라질 수 있습니다. 다른 비용과 더할 때 한 항의 밑만 바꾸면 전체의 공통 상수배가 아닙니다. 그 항이 차지하는 상대 비중이 바뀌어 최적 위치도 달라질 수 있습니다.</p>
<ProgressiveDetail title="한 비용만 단위를 바꾸면 최적 위치가 달라지는 예" preview="한 사건의 음의 로그 비용에 θ²를 더합니다. 첫 항만 1/ln2배 하면 두 항의 균형이 바뀝니다."><div className="space-y-5"><p>설명용 모형에서 q(θ)=exp(−(θ−1)²)로 두면 q는 0보다 크고 1 이하입니다(가정). 자연로그 비용 −lnq=(θ−1)²에 추가 비용 θ²를 더하면 미분은 2(θ−1)+2θ이고 최소 위치는 θ=1/2입니다.</p><p>첫 항만 밑 2로 바꾸면 (θ−1)²/ln2+θ²입니다. 미분을 0으로 놓으면 θ=1/(1+ln2)≈0.590616입니다. 두 식 모두 양의 이차항을 가지므로 이 위치가 각각 유일한 최소입니다. 전체 식을 같은 양의 상수로 곱한 경우와 구별해야 합니다.</p></div>

</ProgressiveDetail>
</section>
<section id="applications" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">11 · 낮게 예측한 실제 사건에는 큰 비용을 준다</h2>
<p>실제로 일어난 사건에 모형이 준 확률을 q라고 합시다. 비용 −log₂q는 q=1이면 0, q=1/2이면 1, q=1/8이면 3입니다. 덜 일어날 것이라고 본 사건이 실제로 일어났을수록 더 큰 값을 받습니다. 한 사건의 이런 정보량을 놀람도(surprisal)라고 합니다.</p>
<p>참분포로 이 비용을 평균내면 교차 엔트로피(cross-entropy)가 됩니다. 관측한 자료의 결합 확률은 우도(likelihood)로 읽고 그 로그를 더해 모형을 비교할 수 있습니다. 자료를 곱으로 묶는 독립 또는 조건부 확률의 의미는 그대로 유지해야 합니다. <Link to="/cs/ai/cross-entropy">교차 엔트로피 글</Link>에서는 분포와 평균, 학습 목표를 더 자세히 다룹니다.</p>
<p>밑이 1보다 클 때 q가 양수 쪽에서 0으로 다가가면 −log q는 제한 없이 커집니다. q=0에 유한한 실수 로그가 생기는 것은 아닙니다. 실제로 일어난 사건에 확률 0을 주었을 때 무한한 비용으로 다루는 확장과 라이브러리가 어떤 오류를 내는지는 구분합니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">12 · 교재의 역관계와 CPython의 실제 나눗셈에 대입한다</h2>
<p>OpenStax College Algebra 2e §6.3은 log_b(x)=y와 bʸ=x의 관계를 정의하고 실제 예제 2에서 2³=8을 log₂8=3으로 바꿉니다. 같은 정의에 이 글의 x=1/8, b=2를 넣으면 y=−3입니다. 연습문제 27도 log₂x=−3을 주므로 되돌린 x는 같은 1/8입니다.</p>
<p>§6.5의 실제 유도는 M=bᵐ, N=bⁿ을 넣어 곱의 로그를 m+n으로 바꿉니다. 여기에 M=1/2, N=1/4, b=2를 넣으면 m=−1, n=−2, 합은 −3입니다. 같은 절의 밑 변환식에 b=2와 자연로그를 넣으면 ln(1/8)/ln2로도 같은 값을 얻습니다.</p>
<div id="paper-log-foundation"><CitationBlock source="OpenStax College Algebra 2e · §§6.3, 6.5" citeKey={1} href={LOG_DEFINITION}>실제 예제와 연습문제의 역관계를 읽고 같은 1/8을 대입했습니다. <a href={LOG_RULES} target="_blank" rel="noreferrer">§6.5의 곱·밑 변환 유도</a>에는 각 입력이 양수라는 조건을 함께 적용합니다. 로그의 성질만으로 정보이론의 모든 정리가 증명되는 것은 아닙니다.</CitationBlock></div>
<p>CPython v3.9.6의 고정 commit db3ff76da19004f266b62e98a81bdfd322861436에서 Modules/mathmodule.c의 math_log_impl을 봅시다. 2348행이 x의 자연로그를 num으로 받고 2352행이 base의 자연로그를 den으로 받습니다. 2358행은 두 값을 나눕니다.</p>
<CodeViewButton label="CPython 원문의 밑 변환 분기" onClick={()=>sidebar.open("log-base",logarithmCodeRefs["log-base"])} />
<p>x=0.125, base=2이면 num≈−2.07944154, den≈0.69314718이고 나눈 값은 −3입니다. base를 주지 않으면 원문은 num을 바로 반환합니다. 이 파일의 m_log는 양의 유한 실수를 시스템의 log 함수에 넘깁니다. 로그를 여러 번의 나눗셈으로 세어 얻는 구현은 아니며 실제 근사 알고리즘은 그 시스템 함수에서 확인해야 합니다.</p>
<CodeViewButton label="같은 파일에서 실수 입력의 오류를 처리하는 원문" onClick={()=>sidebar.open("log-zero",logarithmCodeRefs["log-zero"])} />
<p>m_log는 입력 0에서 오류 상태와 −∞를 만들지만 바깥 래퍼는 이를 그대로 Python 값으로 반환하지 않습니다. can_overflow=0인 로그 경로는 유한 입력에서 무한 결과가 나오면 ValueError를 냅니다. math.log(0.0)는 수치 −∞를 돌려준다는 설명과 다릅니다.</p>
<CitationBlock source="Python 3.9 문서 · math.log와 log2" citeKey={2} href={PYTHON_MATH}>밑을 주는 호출의 나눗셈 규칙을 고정된 v3.9.6 C 원문과 대조했습니다. 별도 log2는 보통 log(x,2)보다 정확하다고 문서가 설명하며 두 함수가 내부에서 같은 경로를 쓴다고 가정하지 않습니다.</CitationBlock>
</section>
<section id="numerical" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">13 · 2000번의 곱은 0이 되지만 로그의 합은 남는다</h2>
<p>아래 예제는 이 글에서 작성한 Python 코드입니다. 로컬 CPython 3.9.6에서 실행했고 float의 밑은 2, 유효 숫자는 이진수 53자리였습니다. 이 환경의 작은 양수를 표현하는 방식과 결과를 기록한 것이며 모든 언어와 장비의 마지막 자리가 같다는 주장은 아닙니다.</p>
<CodeViewButton label="직접 실행한 확률과 로그 비교 예제" onClick={()=>sidebar.open("experiment",logarithmCodeRefs["experiment"])} />
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">실행한 식</th><th className="p-3">기록한 결과</th></tr></thead><tbody>{[["0.5 ** 3","0.125"],["math.log(0.125, 2)","−3.0"],["0.5 ** 2000","0.0"],["2000 * math.log(0.5)","약 −1386.294361"],["2001 * math.log(0.5)","약 −1386.987508"],["math.exp(2000 * math.log(0.5))","0.0"]].map((row,i)=><tr key={i} className="border-t border-border">{row.map((cell,j)=><td key={j} className="p-3 align-top font-mono text-xs">{cell}</td>)}</tr>)}</tbody></table></div>
<p>수학적으로 2⁻²⁰⁰⁰은 양수입니다. 이 환경에서 가장 작은 양수 float는 2⁻¹⁰⁷⁴인데 그보다 훨씬 작아 직접 계산하면 0으로 반올림됩니다. 이를 언더플로(underflow)라고 합니다. sys.float_info.min은 가장 작은 정규 양수 2⁻¹⁰²²이며 모든 양수 중 최솟값은 아닙니다. 더 작은 비정규 값까지 포함한 최솟값은 math.ulp(0.0)으로 확인했습니다.</p>
<p>반면 2000·ln(0.5)=−2000·ln2는 이 범위에서 충분히 표현할 수 있습니다. 2001번의 로그값과도 구별됩니다. 이미 0이 된 곱에 나중에 math.log를 적용하면 ValueError가 나므로 먼저 로그로 바꾸어 더해야 합니다. 이 기록을 exp로 원래 확률에 되돌리면 다시 0이 되는 것도 표에서 확인했습니다.</p>
<p>원래 확률의 합을 구할 때는 로그값을 그냥 더할 수 없습니다. 두 로그값이 s₁, s₂라면 합의 로그는 ln(exp(s₁)+exp(s₂))입니다. 지수 계산이 너무 작거나 커질 수 있으므로 실제로는 크기 보정도 필요합니다. 이 log-sum-exp와 <Link to="/cs/ai/softmax">softmax의 최댓값 빼기</Link>는 곱을 로그의 합으로 옮기는 규칙과 구분합니다.</p>
<p>로그를 쓴다고 모든 반올림이 없어지는 것도 아닙니다. 같은 실행에서 1+10⁻²⁰은 1로 반올림되어 math.log(1+10⁻²⁰)이 0이었습니다. 반면 작은 증분을 직접 받는 math.log1p(10⁻²⁰)는 약 10⁻²⁰을 반환했습니다. 1을 더하는 단계에서 잃은 값을 나중의 로그가 되찾을 수는 없습니다.</p>
<CitationBlock source="Python 3.9 · sys.float_info와 math.ulp, log1p" citeKey={3} href="https://docs.python.org/3.9/library/sys.html#sys.float_info">정규 최솟값과 비정규 값을 포함한 최솟값을 문서에서 구별했습니다. 본문 표는 별도로 보존한 Python 3.9.6 실행 예제의 결과입니다.</CitationBlock>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">14 · 연산을 바꾸기 전에 입력 조건과 비교 대상을 확인한다</h2>
<p>로그는 양수의 곱을 같은 밑의 로그 합으로 바꿉니다. 확률을 곱할 근거를 만들어 주지는 않습니다. 밑을 바꾸는 식에서도 부호를 확인해야 하고 단독 비용의 양의 상수배와 여러 비용 중 한 항의 변경을 구별해야 합니다.</p>
<p>여기서는 실수 로그와 작은 확률의 계산을 다뤘습니다. 음수와 복소 로그, 정보이론의 공리와 압축 정리, 장비별 수치 라이브러리의 근사 알고리즘까지 이 네 식에서 바로 따라오는 것은 아닙니다. 각 대상의 정의와 추가 조건을 따로 읽어야 합니다.</p>
<ol className="list-decimal space-y-3 pl-6"><li>한 번 던진 동전 결과를 세 칸에 복사했다면 각 칸의 앞면 확률 1/2을 곱해 모두 앞면일 확률을 1/8이라고 해도 될까요? (답: 5절)</li><li>밑을 2에서 1/2로 바꿀 때도 로그값은 항상 양의 상수배가 될까요? (답: 10절)</li><li>0이 된 0.5**2000에 나중에 로그를 취하면 원래 확률의 크기를 되찾을 수 있을까요? (답: 13절)</li></ol>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={logarithmCodeRefs} fileTrees={{cpython:{name:"cpython",type:"dir",children:[{name:"Modules/mathmodule.c",type:"file",path:"cpython/Modules/mathmodule.c",codeKey:"log-base"}]},lesson:{name:"lesson",type:"dir",children:[{name:"examples/compare_log.py",type:"file",path:"lesson/examples/compare_log.py",codeKey:"experiment"}]}}} projectMetas={{cpython:{id:"cpython",label:"CPython v3.9.6",badgeClass:"border-border"},lesson:{id:"lesson",label:"이 글의 실행 예제",badgeClass:"border-border"}}}/>
</article>;}
