import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import MeanErrorBoundViz from "./MeanErrorBoundViz";
import SamplingNoiseViz from "./SamplingNoiseViz";
const L19="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/d569abb143b22f469a09ff218cb3383c_MIT6_041SCF13_L19.pdf";
const RM="https://www.columbia.edu/~ww2040/8100F16/RM51.pdf";
export default function VarianceSamplingArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 평균은 같은데 이번에 얻을 값은 얼마나 다를까</h2>
<p className="text-lg leading-8">매번 2점을 받는 규칙과 1점이나 3점도 받을 수 있는 규칙은 평균이 같을 수 있습니다. 평균 하나만 보고 다음 점수가 얼마나 흔들릴지 알 수는 없습니다. 몇 번 뽑은 값으로 전체 평균을 짐작할 때도 그 흔들림이 얼마나 남는지 알아야 합니다.</p>
<p>이 글은 네 장의 기록에서 얻은 점수를 계속 사용합니다. 먼저 한 번의 값이 가운데에서 얼마나 떨어지는지 잽니다. 그다음 두 번 뽑은 평균의 흔들림과 세 관측값으로 전체의 퍼짐을 추정하는 계산을 구별합니다. 끝에서는 일부 자료만 보고 학습 방향을 정할 때 같은 계산이 무엇을 보장하는지 확인합니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>점수 3·2·2·1의 평균은 2이고 분산은 1/2일까요?</li><li>독립으로 두 번 뽑은 평균의 분산은 1/4로 줄어들까요?</li><li>한 번 뽑은 값을 두 칸에 복사해 평균내도 분산이 1/4로 줄어들까요?</li></ol>
<p>답은 <strong>예, 예, 아니요</strong>입니다. 평균의 칸 수보다 각 값이 새로 얻은 독립 정보인지가 흔들림 감소를 결정합니다.</p>
<SamplingNoiseViz />
<ContentBoundary article="math-variance-sampling" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 뽑는 규칙과 모으는 규칙이 결과의 흔들림을 정한다</h2>
<p>입력은 가능한 네 기록과 각 기록의 점수, 그리고 기록을 뽑는 방법입니다. 한 장을 뽑아 점수를 적고 되돌려 놓은 뒤 다시 뽑습니다. 뽑은 점수를 더해 횟수로 나누면 이번 묶음의 평균이 나옵니다. 같은 절차를 새로 시작하면 다른 묶음과 다른 평균이 나올 수 있습니다.</p>
<p>서로 다른 질문이 세 개 있습니다. 원래 점수는 얼마나 퍼져 있는가, 몇 번 뽑아 만든 평균은 얼마나 흔들리는가, 이미 얻은 몇 점만으로 원래 퍼짐을 어떻게 추정하는가입니다. 모두 가운데에서 떨어진 거리를 쓰지만 비교 대상과 나눌 수가 다릅니다.</p>
<p>뽑은 기록을 되돌려 놓는 이유도 계산의 일부입니다. 매번 네 기록의 선택 기회를 같게 유지하려는 것입니다. 되돌리지 않으면 남은 기록이 달라집니다. 한 번 뽑은 기록을 여러 칸에 복사한다면 칸 수가 늘어도 새 선택이 생기지는 않습니다.</p>
<p>따라서 평균을 내는 코드 한 줄만 확인해서는 충분하지 않습니다. 그 코드에 들어온 여러 값이 어떻게 만들어졌는지 먼저 정해야 합니다. 지금은 매번 네 기록에서 같은 기회로 다시 고르고 앞선 선택이 다음 선택에 영향을 주지 않는 방법을 고정합니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 점수가 다른 네 장을 같은 기회로 뽑는다</h2>
<p>앞뒤 기회가 반반인 동전을 서로 영향 없이 두 번 던진 기록을 생각합시다(가정). ‘앞·앞’, ‘앞·뒤’, ‘뒤·앞’, ‘뒤·뒤’의 비중은 각각 1/4입니다. 시작할 때 1점을 주고 앞면마다 1점을 더하면 네 기록의 점수는 차례로 3, 2, 2, 1입니다.</p>
<p>이 네 기록을 각각 한 장에 적고 같은 기회로 뽑는다고 보아도 같은 계산입니다. 점수 2인 카드는 두 장이며 서로 다른 기록입니다. 네 점수의 평균은 (3+2+2+1)/4=2점입니다. 가운데 2에서 뺀 차이는 1, 0, 0, −1점입니다.</p>
<p>이 차이를 그냥 더하면 양쪽이 지워져 0입니다. 떨어진 정도를 남기려고 각 차이를 제곱하면 1, 0, 0, 1이 됩니다. 다시 같은 비중으로 평균하면 (1+0+0+1)/4=1/2입니다. 모든 점수가 2라면 이 계산은 0이므로 두 규칙을 구별할 수 있습니다.</p>
<p>이제 한 장씩 되돌려 놓으며 두 번 뽑습니다. 첫째가 1점이고 둘째가 3점이면 이번 평균은 2점입니다. 둘 다 1점이면 1점이고 둘 다 3점이면 3점입니다. 두 번을 모았다고 매번 정확히 2가 되는 것은 아닙니다.</p>
<p>가능한 기록 쌍은 4×4=16개이고 비중은 각각 1/16입니다. 평균이 1, 1.5, 2, 2.5, 3인 쌍의 수는 차례로 1, 4, 6, 4, 1개입니다. 가운데 2에 모이는 쌍이 가장 많지만 양끝도 여전히 가능합니다.</p>
<p>쌍의 수를 직접 확인해 보겠습니다. 평균 1은 두 번 모두 1점인 기록을 뽑아야 하므로 한 쌍뿐입니다. 평균 1.5는 1점과 2점을 순서대로 뽑거나 반대로 뽑습니다. 점수 2인 기록이 두 장이므로 각 순서에 두 쌍, 합해서 네 쌍입니다.</p>
<p>평균 2는 두 종류의 경로로 나옵니다. 3점과 1점을 뽑는 두 순서가 있고, 2점인 두 기록 중 하나씩 고르는 네 순서가 있습니다. 합하면 여섯 쌍입니다. 평균 2.5와 3도 반대쪽에서 같은 방법으로 네 쌍과 한 쌍을 얻습니다.</p>
<p>첫 선택과 둘째 선택의 기록을 구별하는 이유가 드러납니다. 1점을 먼저 뽑고 3점을 뽑은 쌍과 그 반대 순서의 쌍은 평균은 같아도 가능한 기록으로는 둘입니다. 평균 숫자만 적어 다섯 종류라고 센 뒤 각각 1/5씩 주면 원래 뽑는 기회가 달라집니다.</p>
<p>다른 묶음에서는 세 번 뽑아 1, 2, 3점을 관측했다고 합시다(가정). 이 세 값의 평균도 2입니다. 가운데에서의 제곱 거리를 합하면 1+0+1=2입니다. 이 합을 3으로 나눈 2/3과 2로 나눈 1은 서로 다른 질문에 답하므로 뒤에서 각각 어디에 쓰는지 따져 보겠습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 한 장의 값과 두 장의 평균을 같은 중심에 놓는다</h2>
<p>그림의 첫 장면은 네 기록의 점수를 그대로 놓습니다. 다음은 가운데 2에서 떨어진 거리를 제곱하는 장면입니다. 세 번째는 두 장의 모든 쌍을 평균별로 모으며, 마지막에는 한 번 고른 점수를 두 칸에 복사했을 때를 비교합니다.</p>
<p>두 장의 평균이 가운데로 더 모이는 까닭은 첫 점수가 한쪽으로 치우쳐도 둘째 점수가 반대쪽에서 나올 수 있기 때문입니다. 예를 들어 1과 3은 함께 평균 2를 만듭니다. 한 장을 두 번 복사하면 1과 1, 또는 3과 3이 되어 그런 상쇄 기회가 생기지 않습니다.</p>
<p>그림은 평균이 반드시 가까워지는 한 번의 경로를 보이는 것이 아닙니다. 가능한 묶음 전체를 같은 비중으로 모은 모양입니다. 이번 두 점이 우연히 모두 1이었다면 평균도 1이라는 사실은 그대로 남습니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 중심에서 잰 거리와 반복 방법을 따로 적는다</h2>
<p>가운데 2를 기준으로 해야 같은 질문을 계속할 수 있습니다. 이번에 1과 1을 얻었다고 기준을 1로 옮기면 그 두 값의 내부 차이는 0이 됩니다. 그렇다고 원래 네 장의 점수가 모두 같아진 것은 아닙니다. 관측한 묶음의 가운데와 원래 규칙의 가운데를 구별해야 합니다.</p>
<p>제곱은 차이의 부호를 없애고 큰 차이에 더 큰 값을 줍니다. 이 때문에 거리의 단위도 점에서 점의 제곱으로 바뀝니다. 원래 점수와 같은 크기 단위로 읽으려면 마지막에 제곱근을 취해야 합니다. 숫자 1/2와 그 제곱근을 같은 양으로 비교하지 않습니다.</p>
<p>묶음 크기를 적는 것은 새로 얻은 정보의 양을 확인하기 위해서입니다. 두 번 따로 뽑은 경우와 한 번 뽑아 복사한 경우는 모두 두 칸을 채웁니다. 그러나 가능한 쌍과 그 비중이 다르므로 평균의 흔들림도 다릅니다. 칸 수만 세어 오차가 줄었다고 말하면 이 차이를 놓칩니다.</p>
<p>세 관측값으로 원래 퍼짐을 추정한다는 상황도 분명히 합시다. 독자에게는 네 장을 모두 보여 주었지만, 추정하는 사람에게는 뽑힌 1·2·3만 주었다고 생각합니다. 그러면 그 사람은 관측한 세 점수의 가운데를 원래 가운데 대신 사용해야 합니다. 우리는 네 장의 정답을 알고 있으므로 이 추정 방법의 성질을 나중에 비교할 수 있습니다.</p>
<p>이 사람에게 다른 세 관측값을 주면 추정한 가운데와 퍼짐도 달라집니다. 한 번 얻은 값이 정답에 얼마나 가까운지와 같은 방법을 계속 사용했을 때 어느 방향으로 기우는지는 별도로 물어야 합니다. 이번 값 하나가 더 가까웠다는 사실만으로 모든 가능한 관측에 더 좋은 계산이라고 정할 수는 없습니다.</p>
<p>평균의 오차를 묻는 방식도 고정하겠습니다. 두 점의 평균이 2에서 0.5점 이상 떨어졌는지 보려면, 평균 1.5와 2.5는 경계에 포함됩니다. 가운데 2인 여섯 쌍만 제외되고 나머지 열 쌍이 해당합니다. 허용 폭을 바꾸거나 경계를 빼면 세는 쌍도 달라집니다.</p>
<p>이제 무엇을 재는지 구별할 준비가 됐습니다. 원래 점수의 퍼짐, 뽑은 평균의 흔들림, 원래 퍼짐을 추정하는 값에 이름을 붙인 뒤 같은 네 장으로 각각 계산하겠습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 세 종류의 퍼짐 계산에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">지금까지 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["한 기록의 점수와 원래 평균","확률변수 Z, 기댓값 μ=E[Z]"],
["원래 평균에서 제곱 거리의 평균","분산(variance) σ²=Var(Z)"],
["분산을 원래 점수 단위로 읽는 크기","표준편차(standard deviation) σ"],
["B번 뽑은 값으로 만든 평균","표본평균(sample mean) Z̄_B"],
["관측한 값으로 원래 분산을 추정하는 계산","표본분산 추정량(sample variance estimator) s²"],
["반복해서 구한 추정량의 기댓값이 목표와 같은 성질","불편성(unbiasedness)"],
["같은 규칙으로 서로 영향 없이 새 값을 뽑는 조건","독립이고 같은 분포, i.i.d."],
["평균이 목표에서 크게 벗어날 확률이 줄어드는 정리","큰 수의 법칙(law of large numbers)"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((v,j)=><td key={j} className="p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>
<p>이 글의 모집단은 같은 기회로 고르는 네 기록의 점수 규칙입니다. 실제 모집단은 매우 크거나 무한할 수도 있습니다. 네 장은 분모와 반복 조건을 손으로 확인하기 위한 작은 모형입니다.</p>
</section>
<section id="variance" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 원래 점수의 분산 1/2와 표준편차를 계산한다</h2>
<p>같은 Z의 평균은 2점이고 네 편차는 1, 0, 0, −1점입니다. 제곱 거리의 평균은 1/2점²입니다. 같은 분포를 다른 표로 쓰면 점수 1·2·3의 확률은 1/4·1/2·1/4이며, 이 비중으로 제곱 거리를 평균해도 같습니다.</p>
<ExplainedFormula question="한 번의 점수가 평균에서 얼마나 퍼지는지 어떻게 재나요?" idea="평균을 뺀 뒤 제곱하여 양쪽 차이가 상쇄되지 않게 하고 원래 확률로 평균합니다. 제곱근을 취하면 원래 단위로 돌아옵니다." formula={String.raw`\operatorname{Var}(Z)=\mathbb E[(Z-\mu)^2],\quad\sigma=\sqrt{\operatorname{Var}(Z)}`}
annotatedFormula={String.raw`\begin{gathered}\mu=\mathbb E[Z],\quad \operatorname{Var}(Z)=\mathbb E[\underbrace{(Z-\mu)^2}_{\text{평균에서의 제곱 거리}}]\\\operatorname{Var}(Z)=\frac{1+0+0+1}{4}=\frac12\ \text{점}^2\\\sigma=\sqrt{\operatorname{Var}(Z)}=\sqrt{1/2}\approx0.7071\ \text{점}\end{gathered}`}
operations={[{expression:String.raw`(1-2)^2=(3-2)^2=1`,annotation:["평균의 양쪽에서 같은 거리인 두 값은 같은 기여를 합니다."]}]}
terms={[{symbol:"μ",name:"모집단 평균",description:"이번에 관측한 평균이 아니라 원래 분포의 평균 2입니다."},{symbol:"σ²",name:"모집단 분산",description:"표준편차 σ의 제곱이며 점수 단위의 제곱입니다."}]}
assumptions={["유한한 분산을 말할 때는 E[Z²]가 유한해야 합니다.","점수에 사용한 확률과 평균을 같은 분포에서 가져옵니다."]} interpretation="표준편차 0.7071점은 모든 관측값이 평균에서 그 거리만큼 떨어진다는 뜻이 아닙니다." />
<p>원래 앞면 수를 X라고 하면 Z=X+1입니다. X의 평균 1을 빼거나 Z의 평균 2를 빼거나 편차는 같습니다. 따라서 Var(X)=Var(Z)=1/2이며, 앞면 수의 표준편차는 약 0.7071개입니다. 모든 값에 같은 수를 더해 중심을 옮겨도 퍼짐은 바뀌지 않습니다.</p>
</section>
<section id="sample-estimation" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 관측한 세 값의 분모 3과 2는 다른 질문이다</h2>
<p>관측한 세 점수의 표본평균은 (1+2+3)/3=2입니다. 그 평균에서의 제곱 거리 합은 2입니다. 이 세 값 자체를 같은 비중으로 기술하려면 3으로 나눠 2/3을 얻습니다. 관측값을 더 받기 전까지 이 세 값의 퍼짐은 정확히 그 값입니다.</p>
<p>원래 분산을 모른 채 이 세 관측값으로 추정하려는 질문은 다릅니다. 같은 표본으로 평균도 구했기 때문에 그 평균에서의 거리는 작아지는 쪽으로 기웁니다. 독립이고 같은 분포에서 뽑은 n개에는 합을 n−1로 나누는 추정량을 사용하면 반복 평균에서 이 치우침을 없앨 수 있습니다.</p>
<ExplainedFormula question="세 관측값으로 평균과 분산 추정량을 어떻게 구하나요?" idea="먼저 같은 관측값으로 평균을 구합니다. 그 평균에서 제곱 거리를 모은 뒤, 관측값 자체를 기술할지 원래 분산을 반복 평균에서 맞추는 추정값을 구할지에 따라 분모를 정합니다." formula={String.raw`\bar Z_n=\frac1n\sum_{i=1}^n Z_i,\qquad s^2=\frac1{n-1}\sum_{i=1}^n(Z_i-\bar Z_n)^2`}
annotatedFormula={String.raw`\begin{gathered}\bar Z_n=\frac1n\sum_{i=1}^n Z_i,\quad s^2=\frac{\sum_i(Z_i-\bar Z_n)^2}{\underbrace{n-1}_{\text{불편 추정의 분모}}}\\\bar z_3=\frac{1+2+3}{3}=2\\\text{세 값의 분산}=\frac23,\quad s^2=\frac2{3-1}=1\end{gathered}`}
operations={[{expression:String.raw`(1-2)^2+(2-2)^2+(3-2)^2=2`,annotation:["두 계산은 같은 분자를 사용하며 목표가 달라 분모를 다르게 고릅니다."]}]}
terms={[{symbol:"n",name:"관측 수",description:"여기서는 3이며 n−1 추정량에는 n>1이 필요합니다."},{symbol:"s²",name:"표본분산 추정량",description:"다시 뽑으면 값이 바뀌는 계산 규칙입니다."}]}
assumptions={["n−1의 불편성은 i.i.d. 표본과 유한한 모집단 분산을 전제합니다.","관측값 자체의 기술적 분산을 구하는 질문에는 분모 n도 맞습니다."]} interpretation="이번 원래 분산은 1/2입니다. 추정값 1이 2/3보다 이번 한 번에 더 가깝지는 않습니다. 불편성은 모든 표본에서 오차가 더 작다는 뜻이 아닙니다." />
</section>
<section id="sample-correction" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 평균을 먼저 맞추면 제곱 거리 하나 분량을 덜 센다</h2>
<p>왜 정확히 n−1일까요? 각 Zᵢ−μ를 (Zᵢ−Z̄ₙ)+(Z̄ₙ−μ)로 나누어 제곱합니다. 합을 내면 가운데 섞인 항에는 Σ(Zᵢ−Z̄ₙ)=0이 곱해져 사라집니다. 표본의 가운데를 옮겨 맞춘 만큼, 원래 평균에서 잰 거리보다 n(Z̄ₙ−μ)²가 작아집니다.</p>
<ExplainedFormula question="n−1이라는 교정값을 기댓값으로 유도할 수 있나요?" idea="모집단 평균에서의 거리 합과 표본평균에서의 거리 합을 먼저 비교합니다. i.i.d. 평균의 분산 σ²/n을 대입하면 덜 센 양의 기댓값이 σ² 하나입니다." formula={String.raw`\sum_i(Z_i-\bar Z_n)^2=\sum_i(Z_i-\mu)^2-n(\bar Z_n-\mu)^2`}
annotatedFormula={String.raw`\begin{gathered}\sum_i(Z_i-\bar Z_n)^2=\sum_i(Z_i-\mu)^2-n(\bar Z_n-\mu)^2\\\mathbb E\!\left[\sum_i(Z_i-\bar Z_n)^2\right]=n\sigma^2-n\frac{\sigma^2}{n}=(n-1)\sigma^2\\n=3:\quad \mathbb E[\text{거리 합}]=2\cdot\frac12=1\end{gathered}`}
operations={[{expression:String.raw`\mathbb E[s^2]=(n-1)\sigma^2/(n-1)=\sigma^2`,annotation:["반복해서 뽑은 추정값들의 확률 가중 평균이 목표 분산과 같습니다."]}]}
terms={[{symbol:"Σ(Zᵢ−Z̄ₙ)",name:"편차의 합",description:"같은 값들의 평균을 빼므로 언제나 0입니다."}]}
assumptions={["n>1, 독립이고 같은 분포, 유한한 σ²입니다.","E[Z̄ₙ]=μ이며 Var(Z̄ₙ)=σ²/n이라는 평균의 계산은 다음 절에서 유도합니다."]} interpretation="분모 n으로 나눈 추정량의 기댓값은 (n−1)σ²/n입니다. 이것이 작다는 말은 원래 σ²를 추정할 때의 편향을 뜻합니다." />
<p>같은 네 기록에서 세 번 뽑는 모든 순서 4³=64개를 직접 평균해도 확인됩니다. 분모 3의 값들을 평균하면 1/3이고, 분모 2의 값들을 평균하면 1/2입니다. 앞에서 관측한 1·2·3 한 묶음의 추정값 1과 이 반복 평균 1/2를 구별해야 합니다.</p>
</section>
<section id="mean-noise" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 평균의 분산은 왜 B가 아니라 B²로 나누나</h2>
<p>같은 네 장에서 독립으로 B번 뽑은 Z₁부터 Z_B를 평균합니다. 평균의 기댓값은 선형성에 따라 여전히 2입니다. 흔들림은 먼저 합의 분산을 구한 뒤, 1/B를 곱한 효과를 제곱하여 계산합니다. 거리를 1/B로 줄이면 제곱 거리는 1/B²가 됩니다.</p>
<ExplainedFormula question="두 번 뽑은 평균의 흔들림은 얼마이고 B번이면 어떻게 되나요?" idea="평균에서의 편차를 제곱해 펼칩니다. 서로 독립인 두 편차의 곱은 기댓값이 0이라 섞인 항이 사라지고 B개의 분산만 남습니다." formula={String.raw`\operatorname{Var}(\bar Z_B)=\frac{1}{B^2}\sum_{i=1}^B\operatorname{Var}(Z_i)=\frac{\sigma^2}{B}`}
annotatedFormula={String.raw`\begin{gathered}\bar Z_B=\frac1B\sum_i Z_i,\qquad \mathbb E[\bar Z_B]=\mu\\\operatorname{Var}(\bar Z_B)=\underbrace{\frac1{B^2}}_{\text{거리 배수의 제곱}}\underbrace{B\sigma^2}_{\text{독립 편차들의 합}}=\frac{\sigma^2}{B}\\B=2:\ \frac{1/2}{2}=\frac14,\quad B=16:\ \frac{1/2}{16}=\frac1{32}\end{gathered}`}
operations={[{expression:String.raw`\mathbb E[(Z_i-\mu)(Z_j-\mu)]=\mathbb E[Z_i-\mu]\mathbb E[Z_j-\mu]=0\quad(i\ne j)`,annotation:["독립성으로 곱의 평균을 분리하며 각 편차의 평균은 0입니다."]}]}
terms={[{symbol:"B",name:"묶음 크기",description:"따로 뽑아 평균한 점수의 개수입니다."}]}
assumptions={["독립이고 같은 유한 분산 σ²를 가진 값들을 같은 비중으로 평균합니다.","독립은 충분조건입니다. 섞인 편차의 곱 평균이 0인 더 넓은 경우에도 같은 분산 합이 가능합니다."]} interpretation="B=1에서 16으로 늘리면 평균의 분산은 1/16배, 표준편차는 1/4배가 됩니다. 원래 한 점수의 분산 자체를 바꾼 것은 아닙니다." />
<p>두 장 평균의 16개 쌍으로도 직접 계산할 수 있습니다. 각 평균값의 중심에서의 거리를 제곱한 뒤 그 값이 나오는 쌍의 수를 곱합니다. 마지막에 전체 16개로 나누면 됩니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["평균값","쌍의 수","제곱 거리","수 × 제곱 거리"].map(x=><th key={x} className="p-3">{x}</th>)}</tr></thead><tbody>{[["1","1","1","1"],["1.5","4","1/4","1"],["2","6","0","0"],["2.5","4","1/4","1"],["3","1","1","1"]].map(r=><tr key={r[0]} className="border-t border-border">{r.map((x,i)=><td key={i} className="p-3">{x}</td>)}</tr>)}</tbody></table></div>
<p>마지막 열의 합은 4이므로 분산은 4/16=1/4입니다. 독립 분산의 합을 사용한 일반식과 같은 결과입니다.</p>
</section>
<section id="law-of-large-numbers" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 오차가 클 확률의 상한과 실제 확률을 구별한다</h2>
<p>평균이 2에서 0.5점 이상 벗어날 확률을 물어봅시다. 두 장 평균에서는 1·1.5·2.5·3이 해당하므로 그 비중은 (1+4+4+1)/16=5/8입니다. 분산 1/4만 알고도 이 확률에 상한을 줄 수 있지만 반드시 정확한 확률을 얻는 것은 아닙니다.</p>
<p>오차가 ε 이상인 경우에는 오차 제곱도 ε² 이상입니다. 따라서 전체 제곱 오차의 평균은 그 사건의 확률에 ε²를 곱한 값보다 작을 수 없습니다. 양변을 ε²로 나누는 것이 체비쇼프 부등식(Chebyshev inequality)의 생각입니다.</p>
<ExplainedFormula question="분산만으로 평균의 큰 오차 확률을 얼마나 제한할 수 있나요?" idea="큰 오차 사건이 제곱 오차 평균에 기여하는 최소량을 셉니다. i.i.d. 평균의 분산 σ²/B를 넣으면 고정된 허용 오차 밖의 확률 상한이 B와 함께 줄어듭니다." formula={String.raw`P(|\bar Z_B-\mu|\ge\varepsilon)\le\frac{\operatorname{Var}(\bar Z_B)}{\varepsilon^2}=\frac{\sigma^2}{B\varepsilon^2}`}
annotatedFormula={String.raw`\begin{gathered}P(|\bar Z_B-\mu|\ge\varepsilon)\le\frac{\sigma^2}{B\varepsilon^2}\\\sigma^2=\frac12,\quad\varepsilon=\frac12:\quad \text{상한}=\frac2B\\B=2:\ 5/8\le1,\qquad B=16:\ P(\text{오차}\ge1/2)\le1/8\end{gathered}`}
operations={[{expression:String.raw`\mathbb E[(\bar Z_B-\mu)^2]\ge\varepsilon^2 P(|\bar Z_B-\mu|\ge\varepsilon)`,annotation:["큰 오차인 경우의 기여만 남기면 전체 평균보다 작거나 같습니다."]}]}
terms={[{symbol:"ε",name:"허용 오차",description:"B와 함께 바꾸지 않는 양수입니다. 여기서는 0.5점입니다."}]}
assumptions={["공통 평균 μ와 유한 분산 σ²를 가진 i.i.d. 값입니다.","확률 상한이 1보다 크면 항상 참인 상한 1로 줄일 수 있습니다."]} interpretation="B가 커질 때 모든 고정 ε>0에 대해 이 상한이 0으로 갑니다. 이것이 유한 분산 조건에서 큰 수의 법칙을 증명하는 경로이며 유한 B의 오차 0을 약속하지 않습니다." />
<MeanErrorBoundViz />
<ProgressiveDetail title="16번 평균의 정확한 오차 확률은 상한 1/8과 얼마나 다른가요?" preview="같은 동전 모형에서는 약 0.0070입니다. 체비쇼프의 0.125는 분산만으로 얻은 보수적인 상한입니다.">
<p>16개의 Z에는 동전 던짐 32회가 들어 있습니다. 전체 앞면 수를 H라 하면 Z̄₁₆=1+H/16입니다. 2에서 1/2 이상 벗어나는 조건은 H≤8 또는 H≥24입니다. 32회 공정·독립 던짐에서 각 기록의 비중은 2⁻³²이므로 해당 기록의 수를 세면 됩니다.</p>
<p>정확한 확률은 2×Σₖ₌₀⁸ C(32,k)/2³²=15033173/2147483648≈0.00700037입니다. 이 계산은 전체 분포를 사용합니다. 1/8이라는 상한은 평균과 분산만 사용하므로 같은 숫자를 줄 필요가 없습니다.</p>
</ProgressiveDetail>
</section>
<section id="gradient-estimator" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 같은 네 값을 일부 자료의 학습 방향으로 읽는다</h2>
<p>이제 같은 숫자 3·2·2·1을 네 자료의 aᵢ로 둡니다. 조절할 숫자 θ를 조금 늘릴 때 자료 i의 손실이 얼마나 변하는지 나타내는 기울기를 사용합니다. ℓᵢ(θ)=(θ+aᵢ)²/2로 정하면 기울기는 θ+aᵢ입니다. 이 학습 사례의 숫자와 손실에는 별도 물리 단위를 부여하지 않습니다(가정).</p>
<p>전체 목표 L은 네 손실의 같은 비중 평균입니다. 모든 기울기를 같은 θ에서 계산하면 전체 기울기는 θ+2입니다. 특히 θ=0에서는 네 기울기가 방금 점수와 같은 3·2·2·1이 됩니다. 이 값을 일부만 뽑아 평균하는 것이 미니배치(mini-batch)의 확률적 기울기 추정량입니다.</p>
<ExplainedFormula question="일부 자료의 기울기를 평균해도 전체 목표를 추정하나요?" idea="각 자료가 같은 확률로 선택되면 한 기울기의 기댓값이 전체 기울기의 평균입니다. 묶음에 대해 기댓값의 선형성을 적용합니다." formula={String.raw`g_B=\frac1B\sum_{j=1}^B\nabla\ell_{I_j}(\theta),\qquad \mathbb E[g_B\mid\theta]=\frac1N\sum_{i=1}^N\nabla\ell_i(\theta)=\nabla L(\theta)`}
annotatedFormula={String.raw`\begin{gathered}L(\theta)=\frac1N\sum_i\ell_i(\theta),\quad g_B=\frac1B\sum_j\nabla\ell_{I_j}(\theta)\\\mathbb E[g_B\mid\theta]=\frac1N\sum_i\nabla\ell_i(\theta)=\nabla L(\theta)\\N=4,\ \nabla\ell_i=\theta+a_i:\quad \mathbb E[g_B\mid\theta]=\theta+2\end{gathered}`}
operations={[{expression:String.raw`\mathbb E[\nabla\ell_{I_j}(\theta)\mid\theta]=\sum_{i=1}^N\frac1N\nabla\ell_i(\theta)`,annotation:["각 자리에서 뽑는 자료의 비중이 목표의 1/N과 맞습니다."]}]}
terms={[{symbol:"Iⱼ",name:"선택한 자료 번호",description:"묶음의 j번째 자리에서 고른 원래 자료의 번호입니다."},{symbol:"∇",name:"기울기",description:"여러 조절값이면 변화율을 모은 벡터이며 작은 사례는 조절값 하나입니다."}]}
assumptions={["θ를 고정한 조건에서 각 Iⱼ가 자료 전체에 균등하며 손실 가중치도 1/N입니다.","미분 가능한 유한 자료 합이므로 합과 미분을 교환합니다. 불편성 자체에 자리 간 독립은 필요하지 않습니다."]} interpretation="θ=0에서 독립 표집한 g_B의 분산은 1/(2B)입니다. 중심이 맞는 것과 한 번의 업데이트가 손실을 줄이는 것은 다른 주장입니다." />
<p>즉시 실행 순서도 간단합니다. θ를 고정하고 자료 번호를 뽑은 뒤 그 위치에서 각 기울기를 계산해 평균합니다. 그 평균을 학습률에 곱해 θ에서 뺍니다. 다음 업데이트의 기울기는 바뀐 θ에서 다시 구해야 하며 서로 다른 θ의 값을 같은 미니배치라고 섞지 않습니다.</p>
<AlgorithmBlock title="같은 θ에서 균등 미니배치를 뽑아 한 번 갱신하기" input={["자료 값 a=[3,2,2,1], 현재 θ, 양수 학습률 η, 묶음 크기 B"]} steps={[{code:"I₁,…,I_B ← {1,2,3,4}에서 균등하게 독립 복원 추출",note:"각 자리에 네 자료의 기회 1/4을 줍니다."},{code:"각 j에서 gⱼ ← θ + a[Iⱼ]",note:"모든 기울기를 같은 현재 θ에서 계산합니다."},{code:"g ← (g₁+…+g_B)/B"},{code:"θ_new ← θ − ηg",note:"이 절차는 설명용 의사코드입니다. 한 번의 손실 감소를 보장하지 않습니다."}]} output="새 θ_new와 이번에 뽑은 자료 번호·기울기 기록" />

</section>
<section id="paper-variance-sampling" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">13 · MIT 원문의 평균과 확률 상한에 같은 값을 넣는다</h2>
<p>MIT 6.041SC 강의 19의 PDF 2쪽 왼쪽 위는 i.i.d. X₁,…,Xₙ, 유한한 평균 μ와 분산 σ²를 전제로 Mₙ=(X₁+…+Xₙ)/n을 둡니다. 여기의 Xᵢ는 강의의 일반 관측값 이름이므로 우리 점수 Zᵢ에 대응합니다. 앞면 수 X와 같은 글자라고 같은 대상을 뜻하는 것은 아닙니다.</p>
<ExplainedFormula question="원문이 쓰는 n·Mₙ에 우리 두 장 평균을 넣으면 무엇이 되나요?" idea="원문 기호를 유지한 채 관측값의 대응만 정합니다. n=2, μ=2, σ²=1/2와 허용 오차 1/2를 넣습니다." formula={String.raw`P(|M_n-\mu|\ge\epsilon)\le\frac{\operatorname{Var}(M_n)}{\epsilon^2}=\frac{\sigma^2}{n\epsilon^2}`}
annotatedFormula={String.raw`\begin{gathered}\text{원문: }P(|M_n-\mu|\ge\epsilon)\le\frac{\operatorname{Var}(M_n)}{\epsilon^2}=\frac{\sigma^2}{n\epsilon^2}\\n=2:\quad \frac{1/2}{2(1/2)^2}=1\\n=16:\quad \frac{1/2}{16(1/2)^2}=\frac18\end{gathered}`}
operations={[{expression:String.raw`P(|M_2-2|\ge1/2)=5/8\le1`,annotation:["원문 상한은 같은 16개 쌍을 직접 센 확률과 모순되지 않습니다."]}]}
terms={[{symbol:"Mₙ",name:"원문의 표본평균",description:"본문의 Z̄_B이며 n=B로 대응합니다."}]}
assumptions={["원문의 유한 분산과 i.i.d. 조건을 유지합니다.","강의의 다른 여론조사 사례와 우리 동전 점수 사례를 같은 측정값으로 섞지 않습니다."]} interpretation="원문은 n→∞일 때의 확률 수렴으로 이어집니다. 16번이면 반드시 허용 오차 안에 든다는 결론은 이 식에서 나오지 않습니다." />
<CitationBlock source="MIT 6.041SC Lecture 19 · PDF 1쪽 Chebyshev / 2쪽 Convergence of the sample mean" citeKey={1} href={`${L19}#page=2`}>실제 2쪽의 Mₙ과 마지막 부등식에 같은 분산 1/2를 대입했습니다. 1쪽의 제곱 오차 하한 아이디어는 11절에서 직접 전개했습니다. 표본평균의 분산 항등식과 확률의 상한을 구별합니다.</CitationBlock>
</section>
<section id="library-normalization" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 실제 라이브러리의 분모를 같은 세 값에 적용한다</h2>
<p>NumPy 2.0의 공식 numpy.var 문서는 기본 인자를 ddof=0으로 표시하고 분모가 N−ddof라고 설명합니다. 같은 [1,2,3]을 넣는다고 손으로 적용하면 N=3과 제곱 거리 합 2에서 2/(3−0)=2/3입니다. ddof=1을 지정하면 1입니다.</p>
<p>PyTorch 2.14의 공식 torch.var는 기본값을 correction=1로 표시합니다. 유효한 관측 수 3인 이 사례에서는 2/(3−1)=1입니다. 이 API의 인자 이름은 ddof가 아니며, 2.0 이전에는 unbiased라는 불리언 인자를 썼다는 변경 설명도 있습니다.</p>
<p>여기서는 두 문서의 분모 규칙에 숫자를 직접 적용했습니다. NumPy·PyTorch를 실행해 얻은 출력이나 처리 성능을 보고하는 것이 아닙니다. 실수·복소수, 축, 자료형과 수치 정밀도까지 포함한 모든 API 동작을 같은 예로 검증한 것도 아닙니다.</p>
<CitationBlock source="NumPy 2.0 · numpy.var, Parameters / Notes" citeKey={2} href="https://numpy.org/doc/2.0/reference/generated/numpy.var.html">기본 ddof=0과 N−ddof 분모를 [1,2,3]에 적용했습니다. 분모 N의 결과를 관측값 자체의 분산으로 사용하는 질문과 미지의 모집단 분산을 추정하는 질문을 구별합니다.</CitationBlock>
<CitationBlock source="PyTorch 2.14 · torch.var, Parameters" citeKey={3} href="https://docs.pytorch.org/docs/2.14/generated/torch.var.html">기본 correction=1과 이전 unbiased 인자에서의 변경을 확인했습니다. N=3에서 1이라는 값은 이 기본 분모 규칙의 직접 계산입니다.</CitationBlock>
</section>
<section id="paper-robbins-monro" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">15 · Robbins–Monro의 한 번 갱신과 수렴 정리를 분리한다</h2>
<p>Robbins와 Monro의 1951년 논문은 기대 응답 M(x)가 목표 α와 같아지는 위치를 찾습니다. 종이 401쪽 식 (7)은 관측 응답 yₙ을 받은 뒤 xₙ₊₁−xₙ=aₙ(α−yₙ)로 위치를 바꿉니다. 현재 응답이 목표보다 크고 aₙ이 양수면 왼쪽으로 이동합니다.</p>
<ExplainedFormula question="같은 네 자료 중 작은 기울기 하나를 원문 갱신식에 넣으면 어디로 가나요?" idea="우리 조절값을 원문의 xₙ에, 뽑은 기울기를 yₙ에 대응시키고 목표 응답 α를 0으로 둡니다. 원문 기호 θ는 목표 위치이므로 우리 조절값 θ와 구별합니다." formula={String.raw`x_{n+1}-x_n=a_n(\alpha-y_n)`}
annotatedFormula={String.raw`\begin{gathered}\text{원문 (7): }x_{n+1}-x_n=a_n(\alpha-y_n)\\x_n=-1.5,\ a_n=0.1,\ \alpha=0,\ y_n=-0.5\\x_{n+1}=-1.5+0.1(0-(-0.5))=-1.45\end{gathered}`}
operations={[{expression:String.raw`y_n=x_n+1=-0.5`,annotation:["같은 네 aᵢ 중 1을 뽑아 현재 위치 −1.5에서 기울기를 구했습니다."]}]}
terms={[{symbol:"aₙ",name:"원문의 양수 보폭",description:"본문의 자료 값 aᵢ와 다른 기호입니다. 여기서는 학습률 0.1에 대응합니다."},{symbol:"α",name:"목표 응답",description:"기울기 0인 위치를 찾으려고 0으로 둡니다."}]}
assumptions={["설명용 한 번의 대수적 갱신에 원문 식을 적용합니다.","이 선형 기울기는 모든 실수 위치에서 전역 유계가 아니므로 원문 정리의 직접 사례라고 주장하지 않습니다."]} interpretation="평균 기울기는 0.5여도 이번에 뽑은 기울기는 −0.5입니다. 원문 한 번의 갱신식을 실행했다는 사실만으로 이번 손실 감소나 장기 수렴이 따라오지 않습니다." />
<p>원문 406쪽 식 (50)은 같은 위치에서 여러 응답을 모은 산술평균 ȳₙ으로 갱신합니다. 이 식에 같은 위치 −1.5에서 aᵢ=1과 3을 고른 두 기울기 −0.5와 1.5를 넣으면 평균 0.5이고 새 위치는 −1.55입니다. 한 응답을 쓰거나 평균 응답을 쓰는 차이를 같은 숫자로 볼 수 있습니다.</p>
<ProgressiveDetail title="왜 원문의 수렴 정리를 이 작은 학습 예에 바로 적용하지 않나요?" preview="1951년 정리에는 응답의 전역 유계와 평균 응답·보폭의 조건이 있습니다. 우리 선형 기울기는 그 전역 유계를 충족하지 않습니다.">
<p>401쪽 식 (4)는 모든 x에서 P(|Y(x)|≤C)=1인 공통 유계 C를 둡니다. 405쪽 정리 2는 이 조건에 더해 논문이 정의한 type 1/n 보폭과 404쪽의 조건 (33)–(35)를 요구합니다. 평균 응답 M의 비감소성, 목표 위치에서 M(θ)=α, 그 위치에서의 양의 미분계수가 포함됩니다.</p>
<p>우리 Y(x)=x+aᵢ는 x가 모든 실수를 돌면 공통 C로 묶이지 않습니다. 보폭 0.1 한 번을 대입한 것 역시 그 보폭 수열 조건을 증명한 일이 아닙니다. 현대 확률적 최적화의 더 넓은 수렴 정리를 적용하려면 그 정리의 매끄러움·오차·보폭 조건을 별도로 확인해야 합니다.</p>
</ProgressiveDetail>
<CitationBlock source="Robbins & Monro (1951), A Stochastic Approximation Method · 종이 401쪽 (7), 405쪽 정리 2, 406쪽 (50)" citeKey={4} href={`${RM}#page=3`}>원문 스캔의 PDF 3·7·8쪽을 확인했습니다. 같은 네 자료의 기울기를 식 (7)·(50)에 대입하되, 한 번의 갱신 계산과 논문의 수렴 정리 적용을 분리합니다.</CitationBlock>
</section>
<section id="boundaries" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">16 · 복사와 비복원 추출에서는 1/B가 어떻게 바뀌나</h2>
<p>같은 한 번의 점수 Z를 B칸 모두에 복사하면 평균도 Z입니다. 평균의 기댓값은 여전히 2지만 분산은 1/2로 남습니다. 의존성이 있다는 이유만으로 평균의 중심이 반드시 틀어지는 것은 아닙니다. 이 경우에 사라진 것은 새 선택을 평균하며 얻던 흔들림 감소입니다.</p>
<p>두 편차가 함께 움직이는 정도를 공분산(covariance)이라 합니다. 제곱을 펼칠 때 이 섞인 항을 남겨 두면 일반적인 평균 분산을 얻습니다. 독립이면 해당 항이 0이고, 모두 같은 복사본이면 각 두 편차의 곱 평균도 원래 분산입니다.</p>
<ExplainedFormula question="독립이 아닐 때 평균의 분산에서 어떤 항이 남나요?" idea="편차 합의 제곱을 끝까지 전개합니다. 각 편차의 제곱뿐 아니라 서로 다른 편차를 곱한 항도 셉니다." formula={String.raw`\operatorname{Var}(\bar Z_B)=\frac1{B^2}\left(\sum_i\operatorname{Var}(Z_i)+2\sum_{i<j}\operatorname{Cov}(Z_i,Z_j)\right)`}
annotatedFormula={String.raw`\begin{gathered}\operatorname{Var}(\bar Z_B)=\frac{\sum_i\operatorname{Var}(Z_i)+2\sum_{i<j}\operatorname{Cov}(Z_i,Z_j)}{B^2}\\\operatorname{Cov}(Z_i,Z_j)=\mathbb E[(Z_i-\mathbb E Z_i)(Z_j-\mathbb E Z_j)]\\\text{모두 복사}:\quad\frac{B\sigma^2+B(B-1)\sigma^2}{B^2}=\sigma^2\end{gathered}`}
operations={[{expression:String.raw`B=2:\quad (1/2+1/2+2\cdot1/2)/4=1/2`,annotation:["두 자리라도 한 값을 복사하면 분산이 1/4로 줄지 않습니다."]}]}
terms={[{symbol:"Cov",name:"공분산",description:"서로 다른 두 값의 중심에서의 편차를 곱해 평균한 양입니다."}]}
assumptions={["유한한 두 번째 모멘트와 같은 비중의 평균입니다.","평균의 불편성과 공분산이 0이라는 조건은 구별합니다."]} interpretation="한 자료 번호 J를 모든 미니배치 자리에 복사해도 전체 기울기에 대해 불편할 수 있지만 분산은 한 자료의 값 그대로입니다." />
<p>반대로 네 장에서 되돌리지 않고 두 장을 고르면 다른 계산입니다. 가능한 카드 쌍 여섯 개의 평균은 2.5, 2.5, 2, 2, 1.5, 1.5입니다. 각각 비중 1/6으로 중심 2에서의 제곱 거리를 평균하면 1/6입니다. 독립으로 되돌려 뽑은 1/4보다 더 작습니다.</p>
<ProgressiveDetail title="유한한 모집단에서 되돌리지 않는 추출의 교정은 무엇인가요?" preview="모집단 분산의 분모를 N으로 정의하면, 평균 분산 σ²/B에 (N−B)/(N−1)을 곱합니다.">
<p>N&gt;1, 1≤B≤N인 N개의 고정 값에서 B개를 균등하게 비복원 추출하고 σ²를 N분모 모집단 분산으로 둡니다. 서로 다른 추출 자리의 공분산은 −σ²/(N−1)입니다. 이를 위 식에 넣으면 Var(Z̄_B)=(σ²/B)(N−B)/(N−1)입니다.</p>
<p>공분산의 부호는 고정된 전체 편차 합이 0인 데서 나옵니다. 다른 두 원소의 편차 곱을 모두 더하면 전체 편차 합의 제곱에서 제곱 편차 합을 뺀 −Nσ²입니다. N(N−1)개의 순서쌍으로 나누면 −σ²/(N−1)입니다.</p>
<p>같은 네 장에서 N=4, B=2이면 (1/2)/2×2/3=1/6입니다. B=N이면 전체를 다 보므로 평균의 분산은 0입니다. 이 식의 σ²를 N−1분모의 값으로 바꿔 놓고 같은 교정을 곱하면 분모가 어긋납니다.</p>
</ProgressiveDetail>
</section>
<section id="sampling-weights" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">17 · 뽑는 비중이 틀어지거나 한 걸음이 반대로 갈 수 있다</h2>
<p>같은 aᵢ=3·2·2·1에서 θ=0을 고정합시다. 첫 자료를 1/2, 나머지 세 자료를 각각 1/6 확률로 뽑으면 원래 기울기를 그대로 평균한 기댓값은 3/2+(2+2+1)/6=7/3입니다(가정). 목표인 균등 평균 2와 달라집니다. 각 자료가 받는 기대 기여의 비중을 목표의 1/4과 비교해야 합니다.</p>
<p>중요도 보정(importance correction)은 자료 i의 기울기에 목표 비중 1/4을 실제 선택 확률 qᵢ로 나눈 값을 곱합니다. 그러면 선택 확률 qᵢ와 곱해졌을 때 기대 기여의 비중이 다시 1/4이 됩니다. 어떤 자료를 전혀 뽑지 않으면서 그 자료의 기여를 이 나눗셈으로 복원할 수는 없습니다.</p>
<ExplainedFormula question="다르게 뽑되 같은 전체 목표를 유지하려면 무엇을 곱하나요?" idea="실제로 뽑힐 비중과 보정 배수의 곱이 목표의 1/N이 되게 합니다. 이 보정은 중심을 맞추지만 작은 선택 확률의 큰 배수는 흔들림을 키울 수도 있습니다." formula={String.raw`\tilde g_I=\frac{\nabla\ell_I(\theta)}{Nq_I},\qquad\mathbb E_q[\tilde g_I]=\frac1N\sum_i\nabla\ell_i(\theta)`}
annotatedFormula={String.raw`\begin{gathered}\tilde g_I=\frac{\nabla\ell_I(\theta)}{Nq_I},\quad\mathbb E_q[\tilde g_I]=\sum_iq_i\frac{\nabla\ell_i(\theta)}{Nq_i}=\nabla L(\theta)\\\theta=0,\ q=(1/2,1/6,1/6,1/6):\\\tilde g=(1.5,3,3,1.5),\quad \mathbb E_q[\tilde g]=2\end{gathered}`}
operations={[{expression:String.raw`(1/2)1.5+(1/6)3+(1/6)3+(1/6)1.5=2`,annotation:["보정된 값도 실제 q의 비중으로 평균해야 목표 2가 나옵니다."]}]}
terms={[{symbol:"qᵢ",name:"선택 확률",description:"자료 i를 실제로 뽑는 확률입니다."}]}
assumptions={["목표에 기여하는 모든 자료의 선택 확률이 양수이며 정확한 qᵢ를 사용합니다.","목표 손실은 자료 N개의 균등 평균이고 θ를 고정합니다."]} interpretation="다른 목표 가중치를 원한다면 먼저 그 목표부터 적어야 합니다. 모든 sampler 차이를 무조건 오류라고 부르지 않습니다." />
<p>균등하게 뽑아 중심이 맞아도 이번 한 걸음의 손실은 커질 수 있습니다. θ=−1.5에서 전체 기울기는 0.5지만 aᵢ=1을 뽑으면 기울기는 −0.5입니다. 학습률 0.1로 빼면 θ는 −1.45가 됩니다. 바로 15절에서 원문 식에 넣은 같은 갱신입니다.</p>
<p>전체 손실은 L(θ)=((θ+2)²+1/2)/2입니다. 바꾸기 전은 3/8=0.375이고 바꾼 뒤는 321/800=0.40125입니다. 손실이 늘었습니다. 이 반례는 불편성이 매번의 감소를 보장하지 않음을 보이며, 올바른 조건에서의 장기 수렴까지 부정하는 것은 아닙니다.</p>
</section>
<section id="limits" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">18 · 어떤 평균을 추정할지 정한 뒤 조건을 확인한다</h2>
<p>관측값 자체의 퍼짐을 기술하려면 그 값과 비중을 정확히 정하면 됩니다. 미지의 모집단 분산을 n−1로 추정하려면 표집 조건과 유한 분산을 확인합니다. 평균의 오차 확률을 제한하려면 어떤 반복 방식으로 얻은 평균인지까지 알아야 합니다.</p>
<p>분산이 무한하면 여기의 유한한 체비쇼프 상한을 쓸 수 없습니다. 그렇다고 모든 큰 수의 법칙이 실패하는 것은 아닙니다. i.i.d.이고 절댓값의 기댓값이 유한하면 평균의 수렴을 보이는 더 넓은 정리가 있습니다. 분산을 쓰는 이 증명의 적용 불가와 평균 자체의 수렴 불가를 구별해야 합니다.</p>
<p>학습에서는 같은 θ의 전체 목표, 실제 표집 비중, 보정 배수와 학습률을 함께 확인합니다. 분산을 줄이려고 묶음을 키우면 계산과 저장 비용도 늘 수 있습니다. 실제 업데이트와 수렴 조건은 <a className="text-primary underline" href="/cs/ai/math-gradient-descent-convergence">경사하강 글</a>에서, 상태를 누적하는 방법은 <a className="text-primary underline" href="/cs/ai/optimizers">옵티마이저 글</a>에서 이어집니다.</p>
</section>
<section id="review" data-teach-level="8" className="space-y-6">
<h2 className="text-2xl font-bold">19 · 뽑는 방법을 바꾸고 결과를 예측해 본다</h2>
<p>같은 세 관측 1·2·3에서 2/3과 1 중 어느 것이 맞는지 답하기 전에 어떤 질문을 정해야 할까요? 왜 1이 이번 모집단 분산 1/2에 더 가깝지 않아도 불편 추정량일까요? (답: 9절)</p>
<p>한 번 뽑은 점수를 16칸에 복사하면 평균의 분산도 1/16로 줄어들까요? 같은 중심과 작은 흔들림을 구별해 설명해 보세요. (답: 16절)</p>
<p>전체 기울기의 불편 추정량을 써도 θ=−1.5에서 한 번의 손실이 커질 수 있는 이유는 무엇일까요? (답: 17절)</p>
</section>
</article>}
