import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import RandomVariableMapViz from "./RandomVariableMapViz";
const L5="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/e49cdbaf3129125869700c46aa661fa1_MIT6_041SCF13_L05.pdf";
const L7="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/c0a406b218730ddb16326d695a895c57_MIT6_041SCF13_L07.pdf";
export default function RandomVariablesExpectationArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 두 번의 기록을 앞면 개수 하나로 바꾸면 무엇이 남을까</h2>
<p className="text-lg leading-8">동전을 두 번 던져 ‘앞·뒤’를 적었습니다. 앞면이 몇 번인지 묻는다면 답은 1입니다. ‘뒤·앞’에도 답은 1입니다. 숫자로 바꾸면 두 기록을 함께 계산할 수 있지만 어느 순서였는지는 그 숫자만으로 알 수 없습니다.</p>
<p>
            이 글에서는 같은 네 기록을 앞면 개수로 바꾸고 같은 숫자로 간 기록의 비중을 모읍니다. 그 비중을 반영해 평균을 구한 뒤 앞면 한 번에 2점을 더하는 점수 규칙에도
            적용합니다. 끝에서는 먼저 제곱하는 계산과 먼저 평균을 구하는 계산이 왜 다른지 확인합니다.
          </p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 기록·숫자 규칙·비중을 함께 넣어야 평균이 나온다</h2>
<p>입력에는 가능한 기록의 목록과 각 기록의 비중, 그리고 기록을 숫자로 바꾸는 규칙이 필요합니다. 같은 숫자로 간 기록의 비중을 합하면 숫자별 비중표가 나옵니다. 각 숫자에 그 비중을 곱해 더하면 질문에 맞는 평균 하나를 얻습니다.</p>
<p>기록이 아직 나오지 않았어도 바꾸는 규칙은 미리 정할 수 있습니다. ‘앞·뒤’에는 언제나 1을 주고 ‘앞·앞’에는 언제나 2를 줍니다. 던질 때마다 규칙 자체를 새로 뽑는 것이 아닙니다. 무엇이 나올지 모르는 것은 기록이며, 기록이 주어진 뒤의 계산은 고정되어 있습니다.</p>
<p>숫자별 비중표와 숫자 하나인 평균도 구별해야 합니다. 표는 0번·1번·2번이 각각 얼마나 가능한지 남깁니다. 평균 하나로 줄이면 그 전체 모양을 되찾을 수 없습니다. 어떤 정보를 남겨야 할지는 다음에 무엇을 물을지에 달려 있습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 네 기록을 세 숫자로 모으고 비중을 따라 더한다</h2>
<p>앞뒤 기회가 반반이고 두 던짐이 서로 영향을 주지 않는다고 정합니다(가정). ‘앞·앞’, ‘앞·뒤’, ‘뒤·앞’, ‘뒤·뒤’의 비중은 각각 1/4입니다. 앞면 개수로 바꾸면 차례로 2, 1, 1, 0입니다.</p>
<p>숫자 1에는 두 기록이 들어옵니다. 그래서 그 비중은 1/4+1/4=1/2입니다. 숫자 0과 2에는 각각 한 기록이 들어와 비중이 1/4씩입니다. 합친 뒤에도 전체 비중은 1/4+1/2+1/4=1입니다.</p>
<p>평균을 구할 때는 0에 1/4, 1에 1/2, 2에 1/4을 곱해 더합니다. 기여는 차례로 0, 1/2, 1/2이며 합은 1입니다. 숫자 2는 비중이 작아도 값이 두 배라서 숫자 1과 같은 1/2만큼 기여합니다.</p>
<p>평균 1은 네 번 실행하면 반드시 앞면 총합이 4라는 약속이 아닙니다. 실제 네 번의 기록이 모두 ‘뒤·뒤’일 수도 있습니다. 지금 계산한 값은 정해 둔 가능성의 비중을 사용한 평균이며 실제 몇 번 실행해서 얻은 평균과 구별합니다.</p>
<p>같은 기록으로 점수도 정해 봅시다. 시작할 때 3점을 주고 앞면 한 번마다 2점을 더합니다(가정). 네 기록의 점수는 7, 5, 5, 3이고 비중은 여전히 각각 1/4입니다. 점수의 평균은 (7+5+5+3)/4=5점입니다.</p>
<p>앞면 개수의 평균 1에 2를 곱하고 시작 점수 3을 더해도 5점입니다. 두 방법이 맞아떨어지는 이유는 모든 기록에 같은 배수와 같은 더하기를 적용했기 때문입니다. 뒤에서 그 계산을 펼쳐 어느 규칙까지 순서를 바꿀 수 있는지 보겠습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 같은 숫자로 모여도 비중은 사라지지 않는다</h2>
<p>
            그림에서 먼저 네 기록과 그 비중을 봅니다. 다음 장면은 각 기록을 앞면 개수로 옮기고 그다음은 같은 숫자로 간 비중을 모읍니다. 마지막에는 각 값이 평균에 얼마나 기여하는지
            확인합니다.
          </p>
<RandomVariableMapViz />
<p>‘앞·뒤’와 ‘뒤·앞’이 하나의 숫자로 합쳐져도 두 비중은 모두 남습니다. 같은 숫자가 되었다는 이유로 둘 중 하나의 1/4을 지우면 전체 비중이 1보다 작아집니다. 값을 합치는 일과 비중을 잃는 일을 혼동하지 않아야 합니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 필요한 질문을 보존하는 만큼만 기록을 줄인다</h2>
<p>앞면 개수만으로 점수를 계산할 수 있으므로 모든 순서를 들고 계산할 필요는 없습니다. 같은 값을 만드는 기록을 모으면 표가 짧아집니다. 다만 첫 던짐이 무엇이었는지 다시 물으면 숫자 1만으로는 답할 수 없습니다.</p>
<p>그 질문까지 필요하면 첫 결과가 앞면일 때 1, 뒷면일 때 0이라는 다른 숫자를 함께 보관할 수 있습니다. 한 기록을 반드시 숫자 하나로만 바꾸어야 하는 것은 아닙니다. 어떤 숫자를 만들고 어떤 정보를 지울지 선택하는 단계입니다.</p>
<p>가능한 숫자들의 이름만 나열해서는 평균을 정할 수 없습니다. 앞면 개수가 0·1·2라는 목록이 같아도 각 기록에 배정한 비중이 달라지면 평균이 달라집니다. 숫자로 바꾸는 규칙과 비중을 정하는 규칙을 함께 확인해야 합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 숫자로 바꾸는 규칙과 그 평균에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">지금까지 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["가능한 순서 기록 전체와 그중 하나","표본공간 Ω와 결과 ω"],
["각 기록을 정한 숫자로 바꾸는 함수","확률변수(random variable) X"],
["그 함수를 한 기록에 적용한 숫자","실현값 x=X(ω)"],
["같은 숫자로 간 비중을 모은 표","X의 분포, 이산 값의 확률질량함수(PMF) pₓ(x)"],
["각 값에 비중을 곱해 더한 평균","기댓값(expectation) E[X]"],
["그 표에서 가장 큰 확률을 가진 값","최빈값(mode)"],
["기댓값이 합과 고정 배수를 보존하는 성질","기댓값의 선형성(linearity)"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((v,j)=><td key={j} className="p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>
<p>앞면은 H, 뒷면은 T로 적겠습니다. X는 앞면 개수로 바꾸는 함수 전체이고 X(HT)=1은 그 함수에 특정 기록을 넣은 결과입니다. X와 숫자 1은 같은 종류의 대상이 아닙니다.</p>
</section>
<section id="mapping" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 같은 입력에는 같은 숫자를 주는 함수를 고정한다</h2>
<p>네 기록의 앞면 수는 X(HH)=2, X(HT)=1, X(TH)=1, X(TT)=0입니다. HT를 다시 넣으면 다시 1입니다. ‘확률변수’라는 이름은 이 함수가 입력을 받을 때마다 임의로 값을 바꾼다는 뜻이 아닙니다. 입력이 될 결과의 불확실성이 X의 값으로 옮겨옵니다.</p>
<ExplainedFormula question="같은 기록을 앞면 수와 뒷면 수로 각각 바꾸면 어떻게 되나요?" idea="기록을 입력으로 받는 규칙을 두 개 정의할 수 있습니다. 숫자만 남긴 뒤 원래 순서를 되찾을 수 있는지는 별도 문제입니다."
formula={String.raw`X:\Omega\to\mathbb R,\qquad \omega\mapsto X(\omega)`}
annotatedFormula={String.raw`\begin{gathered}X:\underbrace{\Omega}_{\text{가능한 기록}}\to\underbrace{\mathbb R}_{\text{숫자}},\quad\omega\mapsto X(\omega)\\X(HT)=1,\quad X(TH)=1\\Y(\omega)=2-X(\omega),\quad Y(HH)=0\end{gathered}`}
operations={[{expression:String.raw`X(HT)=X(TH)=1`,annotation:["서로 다른 두 입력이 같은 출력으로 가므로 출력 1만으로 원래 순서를 복원할 수 없습니다."]}]}
terms={[{symbol:"Y",name:"뒷면 수",description:"같은 두 던짐에서 X와 합해 항상 2입니다."}]}
assumptions={["이 글의 Ω는 유한하며 각 결과에 숫자 하나를 배정합니다.","일반 확률공간에서는 숫자의 범위에 대응하는 사건의 확률을 정의할 수 있도록 측정 가능성을 요구합니다."]} interpretation="같은 Ω 위에 X와 Y를 함께 두면 두 숫자가 어느 기록에서 함께 나왔는지도 남길 수 있습니다." />
<p>원래 기록을 따로 보관해 두었다면 정보가 물리적으로 사라진 것은 아닙니다. X의 값만 받은 사람이 순서를 구별할 수 없다는 뜻입니다. 함수의 출력이 입력 정보를 모두 보존하는지에 관한 경계입니다.</p>
</section>
<section id="distribution" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 숫자의 확률은 그 숫자로 가는 기록의 확률을 모은다</h2>
<p>사건 &#123;X=1&#125;은 함수 이름이나 숫자 하나가 아니라 X가 1이 되는 기록들의 집합입니다. 여기서는 HT와 TH입니다. 두 기록은 동시에 하나의 실행 결과일 수 없으므로 그 확률을 더합니다.</p>
<ExplainedFormula question="기록별 확률에서 값별 확률로 옮길 때 무엇을 합하나요?" idea="먼저 원하는 숫자로 가는 입력만 고릅니다. 그 입력들에 원래 배정된 비중을 더하면 값의 확률이 됩니다."
formula={String.raw`p_X(x)=P(X=x)=\sum_{\omega:X(\omega)=x}P(\{\omega\})`}
annotatedFormula={String.raw`\begin{gathered}p_X(x)=P(X=x)=\sum_{\underbrace{\omega:X(\omega)=x}_{\text{같은 값으로 가는 기록}}}\underbrace{P(\{\omega\})}_{\text{원래 비중}}\\p_X(1)=P(\{HT\})+P(\{TH\})=\frac14+\frac14=\frac12\end{gathered}`}
operations={[{expression:String.raw`p_X(0)+p_X(1)+p_X(2)=1/4+1/2+1/4=1`,annotation:["어느 기록도 잃거나 중복하지 않아 값별 확률의 합도 1입니다."]}]}
terms={[{symbol:"pₓ(x)",name:"값의 확률",description:"X가 숫자 x인 사건의 확률입니다."}]}
assumptions={["점확률을 합하는 마지막 식은 이산 표본공간에 적용합니다.","연속 모형에서는 개별 점의 확률을 모두 더하는 이 식으로 대신하지 않습니다."]} interpretation="값 1의 확률이 더 큰 이유는 숫자 1 자체의 성질이 아니라 그 값으로 들어오는 원래 기록들의 비중입니다." />
<p>비중표는 X를 정한 뒤 원래 확률법칙에서 따라 나옵니다. X가 0·1·2를 만들었다는 이유만으로 각각에 1/3을 새로 배정하지 않습니다. 이 사례에서는 1이 되는 두 기록의 비중을 합쳐 1/2로 유지해야 합니다.</p>
</section>
<section id="expectation" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 같은 네 행으로 계산해도 같은 세 값으로 계산해도 평균은 1이다</h2>
<p>원래 네 행을 사용하면 기댓값은 2×1/4+1×1/4+1×1/4+0×1/4=1입니다. 같은 값을 미리 합친 표를 사용하면 0×1/4+1×1/2+2×1/4=1입니다. 같은 숫자에 곱할 비중을 먼저 합했을 뿐입니다.</p>
<ExplainedFormula question="평균을 구할 때 원래 기록과 값별 표 중 어느 것을 사용해야 하나요?" idea="유한한 합의 순서를 바꾸어 같은 값의 기여를 묶습니다. 두 경로는 같은 가중합이므로 결과가 같습니다."
formula={String.raw`\mathbb E[X]=\sum_\omega X(\omega)P(\{\omega\})=\sum_x x\,p_X(x)`}
annotatedFormula={String.raw`\begin{gathered}\mathbb E[X]=\sum_\omega X(\omega)P(\{\omega\})\\=\sum_x\underbrace{x}_{\text{값}}\underbrace{p_X(x)}_{\text{그 값의 비중}}\\=0\cdot\frac14+1\cdot\frac12+2\cdot\frac14=1\end{gathered}`}
operations={[{expression:String.raw`1\cdot\frac14+1\cdot\frac14=1\cdot(\frac14+\frac14)`,annotation:["HT와 TH의 기여를 같은 값 1과 합친 비중 1/2로 묶습니다."]}]}
terms={[{symbol:"E[X]",name:"기댓값",description:"이 사례의 단위는 앞면 개수이며 확률 자체가 아닙니다."}]}
assumptions={["유한 표본공간의 합입니다. 일반 이산 변수의 유한 기댓값에는 절댓값의 가중합이 유한해야 합니다.","확률의 합은 1이며 각 확률은 단위가 없는 비중입니다."]} interpretation="X가 개수이면 기댓값도 개수, 점수이면 기댓값도 점수입니다. 값의 단위를 확률의 단위로 바꾸지 않습니다." />
<p>처음 사례에서는 기댓값 1과 최빈값 1이 우연히 같습니다. 각 던짐의 앞면 확률을 0.7로 바꾸고 두 던짐이 독립이라고 정하면 다릅니다(가정). X의 0·1·2 확률은 0.09·0.42·0.49이고 기댓값은 0.42+2×0.49=1.4입니다. 가장 큰 확률을 가진 최빈값은 2입니다.</p>
<p>이때 1.4는 한 번의 실행에서 나올 수 있는 앞면 개수도 아닙니다. 더 작은 예로 첫 결과가 H이면 1, T이면 0을 주는 변수 U를 보세요. 공정한 던짐에서 E[U]=1/2지만 한 실행의 U는 0이나 1입니다. 기댓값은 다음 값을 맞히는 예언으로 정의하지 않습니다.</p>
</section>
<section id="source-formulas" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 원문의 같은 값 모으기와 함수의 평균 식에 직접 넣는다</h2>
<p>MIT 6.041SC 강의 5의 PDF 1쪽 오른쪽 아래는 같은 x로 가는 결과를 모으고 그 확률을 더하라는 절차를 제시합니다. 왼쪽에는 pₓ(x)=P(&#123;ω∈Ω : X(ω)=x&#125;)가 있습니다. x=1을 넣으면 HT와 TH를 고르고 두 1/4을 합하는 바로 그 계산입니다.</p>
<div id="paper-random-variable"><CitationBlock source="MIT 6.041SC Lecture 5 · PDF 1쪽 Random variables / How to compute a PMF" citeKey={1} href={`${L5}#page=1`}>원문의 함수 정의와 값의 역상 사건을 사용합니다. 강의 그림은 두 사면체 주사위의 최솟값이며, 본문은 그 절차를 두 동전의 앞면 수에 직접 적용한 가정 사례입니다. 두 그림의 실험을 같은 것으로 주장하지 않습니다.</CitationBlock></div>
<p>같은 PDF 2쪽 오른쪽 위에는 E[X]=Σₓxpₓ(x)가 있습니다. x=0,1,2와 비중 1/4,1/2,1/4을 넣으면 1입니다. 왼쪽 아래의 E[g(X)]=Σₓg(x)pₓ(x)는 X를 다시 바꾼 값의 평균을 원래 X의 표로 구하는 식입니다.</p>
<p>같은 점수 규칙 g(x)=2x+3을 이 원문 식에 넣으면 3×1/4+5×1/2+7×1/4=5점입니다. 새로운 점수의 비중표를 따로 만들지 않아도 각 원래 값이 어느 점수로 가는지 적용하면 됩니다. g(x)=x²를 넣으면 0×1/4+1×1/2+4×1/4=3/2입니다.</p>
<div id="paper-expectation"><CitationBlock source="MIT 6.041SC Lecture 5 · PDF 2쪽 Expectation / Properties of expectations" citeKey={2} href={`${L5}#page=2`}>같은 pₓ에 g(x)=2x+3과 g(x)=x²를 각각 넣었습니다. 원문의 주의문은 일반적으로 평균과 함수 적용의 순서를 바꿀 수 없다는 뜻입니다. 모든 비선형 함수와 모든 분포에서 두 값이 반드시 다르다고 확대하지 않습니다.</CitationBlock></div>
</section>
<section id="transform-boundary" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 서로 묶인 두 숫자도 합의 기댓값은 나누어 계산한다</h2>
<p>앞면 수 X와 뒷면 수 Y=2−X를 함께 보겠습니다. X가 2이면 Y는 반드시 0이므로 둘은 독립이 아닙니다. 그래도 E[X]=E[Y]=1이며 E[2X+3Y]=5입니다. 실제 네 행의 2X+3Y는 4,5,5,6이고 각각 비중 1/4로 평균하면 5가 나옵니다.</p>
<ExplainedFormula question="독립이 아닌데도 합과 고정 배수를 밖으로 꺼낼 수 있는 이유는 무엇인가요?" idea="같은 기록의 비중을 곱한 합에서 분배법칙을 사용합니다. 결합확률을 두 확률의 곱으로 바꾸는 단계가 없습니다."
formula={String.raw`\mathbb E[aX+bY]=a\mathbb E[X]+b\mathbb E[Y]`}
annotatedFormula={String.raw`\begin{gathered}\mathbb E[aX+bY]=\sum_\omega\bigl(aX(\omega)+bY(\omega)\bigr)P(\{\omega\})\\=a\underbrace{\sum_\omega X(\omega)P(\{\omega\})}_{\mathbb E[X]}+b\underbrace{\sum_\omega Y(\omega)P(\{\omega\})}_{\mathbb E[Y]}\\\mathbb E[2X+3Y]=2\cdot1+3\cdot1=5\end{gathered}`}
operations={[{expression:String.raw`\mathbb E[2X+3]=2\mathbb E[X]+3=5`,annotation:["상수 3은 어느 기록에서도 같고 전체 비중의 합은 1이므로 평균도 3입니다."]}]}
terms={[{symbol:"a,b",name:"고정된 배수",description:"결과에 따라 바뀌지 않는 상수입니다."}]}
assumptions={["관련 변수의 절댓값 기댓값이 유한합니다.","X와 Y의 독립은 필요하지 않습니다. 결과에 따라 바뀌는 계수를 그대로 밖으로 꺼내지는 않습니다."]} interpretation="유한한 표에서는 각 행의 덧셈을 두 열의 합으로 분배하는 대수입니다. 일반 경우에도 적분 가능성이라는 조건 아래 같은 선형성을 사용합니다." />
<p>MIT 강의 7의 PDF 1쪽 오른쪽 아래는 E[g(X,Y)]=ΣₓΣᵧg(x,y)pₓ,ᵧ(x,y)와 합의 기댓값을 함께 적습니다. 우리 값의 쌍은 (2,0), (1,1), (0,2)이며 비중은 1/4,1/2,1/4입니다. g(x,y)=2x+3y를 넣으면 4×1/4+5×1/2+6×1/4=5입니다.</p>
<CitationBlock source="MIT 6.041SC Lecture 7 · PDF 1쪽 Expectations" citeKey={3} href={`${L7}#page=1`}>원문의 두 변수 가중합에 같은 X와 Y의 쌍을 넣었습니다. 원문은 E[XY]=E[X]E[Y] 앞에 독립 조건을 별도로 붙입니다. 합의 식에 필요하지 않던 조건을 곱의 식까지 지워서는 안 됩니다.</CitationBlock>
<p>AI의 여러 예제에서 나온 변화량을 평균할 때도 합의 기댓값을 각 항의 기댓값으로 나누는 데 이 성질을 씁니다. 다만 그 평균이 원하는 모집단의 평균을 추정하는지는 예제를 고르는 방법에 달려 있습니다. 선형성만으로 표본의 편향이나 흔들림까지 없어지지는 않습니다.</p>
</section>
<section id="product-boundary" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 곱에서는 같은 행의 짝이 결과에 남는다</h2>
<p>같은 X와 Y를 이번에는 곱합니다. 네 행의 XY는 0,1,1,0이므로 E[XY]=1/2입니다. 각 기댓값을 먼저 곱하면 E[X]E[Y]=1입니다. X가 큰 행에서는 Y가 작다는 관계를 지우면 같은 답을 얻지 못합니다.</p>
<p>X와 Y가 독립이고 각각 절댓값 기댓값이 유한하면 곱의 기댓값을 나눌 수 있습니다. 하지만 E[XY]=E[X]E[Y]라는 등식 하나를 확인했다고 독립을 역으로 결론 내리지는 않습니다. 독립은 모든 값의 조합에 대한 확률 관계입니다.</p>
<p>같은 네 기록에서 V=(X−1)²를 만들면 값은 1,0,0,1입니다. E[V]=1/2이고 E[XV]=1/2라서 E[X]E[V]와 같습니다. 그러나 X=1이라고 알면 V는 반드시 0이므로 X와 V는 독립이 아닙니다. 곱의 평균 하나가 맞는 것만으로는 전체 관계를 알 수 없습니다.</p>
<p>결과에 따라 바뀌는 계수를 상수처럼 밖으로 꺼내는 문제도 같은 경계에 있습니다. Y를 X의 계수로 삼으면 계산할 대상은 XY입니다. ‘평균의 선형성’이라는 이름만 보고 E[XY]를 E[X]E[Y]로 바꾸면 위의 1/2과 1의 차이를 놓칩니다.</p>
</section>
<section id="square-boundary" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 먼저 제곱한 평균에는 원래 값의 흔들림이 남는다</h2>
<p>X²는 네 기록에서 4,1,1,0입니다. 기댓값은 3/2입니다. 반면 X의 기댓값 1을 먼저 제곱하면 1입니다. 둘의 차이 1/2은 원래 평균에서 얼마나 떨어졌는지 제곱해 평균한 값과 같습니다.</p>
<ExplainedFormula question="제곱과 기댓값의 순서를 바꾸면 언제 차이가 생기나요?" idea="평균에서의 편차를 제곱하면 음수가 될 수 없습니다. 그 평균이 두 계산의 차이를 나타내며 값의 흔들림이 없으면 차이도 0입니다."
formula={String.raw`\mathbb E[X^2]-(\mathbb E[X])^2=\mathbb E[(X-\mathbb E[X])^2]\ge0`}
annotatedFormula={String.raw`\begin{gathered}\mathbb E[X^2]-(\mathbb E[X])^2=\underbrace{\mathbb E[(X-\mathbb E[X])^2]}_{\text{평균에서의 제곱 거리}}\ge0\\\mathbb E[X^2]=\frac32,\quad (\mathbb E[X])^2=1\\\frac14(2-1)^2+\frac12(1-1)^2+\frac14(0-1)^2=\frac12\end{gathered}`}
operations={[{expression:String.raw`\mathbb E[X^2-2\mu X+\mu^2]=\mathbb E[X^2]-2\mu^2+\mu^2`,annotation:["μ=E[X]를 상수로 두고 제곱을 펼친 뒤 선형성을 사용합니다."]}]}
terms={[{symbol:"μ",name:"평균",description:"기록에 따라 변하는 X와 달리 이 분포에서 정해진 숫자입니다."},{symbol:"분산",name:"평균에서의 제곱 거리",description:"다음 글에서 표본 추정과 연결할 양입니다."}]}
assumptions={["E[X²]가 유한합니다.","등호는 X가 확률 1로 같은 상수일 때 성립합니다. 모든 경우에 두 계산이 다르다고 쓰지 않습니다."]} interpretation="앞면 수가 항상 1인 별도 모형에서는 두 값이 모두 1입니다. 비선형 변환을 일반적으로 교환할 수 없다는 말과 언제나 부등하다는 말은 다릅니다." />
</section>
<section id="limits" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 평균의 존재와 반복의 조건까지 확인한다</h2>
<p>이번 네 기록의 값은 모두 유한하고 개수도 유한하므로 기댓값을 계산하는 데 문제가 없습니다. 무한히 많은 값을 허용할 때는 값마다 확률이 작아진다는 사실만으로 충분하지 않습니다. 값과 확률을 곱한 기여가 끝없이 쌓일 수 있습니다.</p>
<ProgressiveDetail title="매번 유한한 숫자가 나와도 평균은 무한하거나 정의되지 않을 수 있다" preview="작아지는 확률과 커지는 값의 곱을 실제로 계산해 유한 기댓값의 조건을 확인합니다.">
<p>k=1,2,…에서 값 Z=2ᵏ에 확률 2⁻ᵏ를 준다고 합시다(가정). 확률의 합은 1/2+1/4+…=1입니다. 하지만 각 값의 평균 기여는 2ᵏ×2⁻ᵏ=1입니다. 기여를 모두 더하면 +∞이므로 유한한 평균은 없습니다.</p>
<p>이번에는 +2ᵏ와 −2ᵏ에 각각 확률 2⁻⁽ᵏ⁺¹⁾를 줍니다(가정). 전체 확률은 여전히 1이지만 양의 기여 합과 음의 크기 합이 각각 무한합니다. 양음 한 쌍씩 지워 0이라고 하는 대칭 절단값은 기댓값을 정의하지 못합니다. +∞와 −∞를 임의로 상쇄하지 않습니다.</p>
<p>이 때문에 유한한 기댓값과 그 선형성을 사용할 때 E[|X|]&lt;∞라는 조건을 둡니다. 음이 아닌 변수에는 +∞인 기댓값을 허용할 수 있지만 이를 보통의 유한 숫자처럼 빼거나 상쇄하지 않습니다.</p>
</ProgressiveDetail>
<p>기댓값을 반복 평균으로 해석할 때도 반복 방식이 필요합니다. 같은 분포에서 독립적으로 반복하고 절댓값 기댓값이 유한한 경우에는 평균이 기댓값으로 수렴한다는 정리를 사용할 수 있습니다. 이것은 특정 횟수에서 정확히 같아진다는 보장이 아닙니다.</p>
<p>반대로 첫 동전 기록을 한 번만 뽑고 그 앞면 수 X를 모든 실행 칸에 복사하면 어떨까요(가정)? 각 칸만 따로 보면 원래와 같은 분포지만 몇 개를 평균해도 X 그대로입니다. 처음 X=0이나 X=2였다면 계속 0이나 2여서 기댓값 1에 가까워지지 않습니다. 같은 주변분포라는 조건만으로는 부족합니다.</p>
<p>기댓값 주위의 흔들림과 유한한 자료의 평균은 <a className="text-primary underline" href="/cs/ai/math-variance-sampling">분산·표본평균</a>에서 이어갑니다. 이 글의 원문은 분포의 평균을 정의하며, 현실에서 어떤 자료를 뽑아 평균할지는 별도로 확인해야 합니다.</p>
<ContentBoundary article="math-random-variables-expectation" />
</section>
<section id="review" data-teach-level="8" className="space-y-6">
<h2 className="text-2xl font-bold">15 · 숫자로 줄이거나 계산 순서를 바꾸기 전에 예측한다</h2>
<p>두 던짐의 앞면 수가 1이라는 값만 받았습니다. 원래 기록의 순서를 되찾을 수 있나요? 같은 숫자의 비중을 모을 때 어느 두 기록을 합쳐야 하나요? (답: 7·8절)</p>
<p>각 던짐의 앞면 확률이 0.7이고 서로 독립입니다. 앞면 수의 기댓값은 최빈값과 같을까요? 한 번의 실행에서 그 기댓값 자체가 나올 수 있을까요? (답: 9절)</p>
<p>같은 앞면 수 X와 뒷면 수 Y=2−X의 합에서는 평균을 나누어 계산했습니다. 곱 XY와 제곱 X²에도 같은 순서 교환을 적용할 수 있나요? 어떤 숫자가 그 차이를 드러내나요? (답: 11·12·13절)</p>
</section>
</article>;}
