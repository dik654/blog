import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ProbabilityTreeViz from "./ProbabilityTreeViz";
const L1="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/ff296575da32c406c2e56131e1e38997_MIT6_041SCF13_L01.pdf";
const L2="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/a1462fa23de9d08c0dfd233a57278fed_MIT6_041SCF13_L02.pdf";
const L3="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/a2015627268f4846eb3b1368623ce46f_MIT6_041SCF13_L03.pdf";

export default function ProbabilityExperimentsArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 같은 두 번의 던짐에도 질문에 따라 남길 기록이 다르다</h2>
<p className="text-lg leading-8">동전을 두 번 던지고 순서대로 적습니다. 앞면이 정확히 한 번 나왔는지 묻는다면 ‘앞·뒤’와 ‘뒤·앞’이 답에 들어갑니다. 첫 결과가 앞면이었다는 정보까지 받으면 둘 중 ‘앞·뒤’만 남습니다. 계산을 시작하기 전에 어떤 기록을 묻고 어떤 정보를 이미 아는지 나눠야 합니다.</p>
<p>이 글은 네 가지 기록을 한 번 펼친 뒤 같은 목록에서 질문을 바꾸어 봅니다. 남은 기록을 어떻게 세고 어느 전체로 나누는지 확인한 다음 그 과정을 수식에 옮깁니다. 마지막에는 각각 앞뒤가 반반이라는 사실만으로 두 던짐의 관계까지 알 수 있는지 살펴봅니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>공정하고 독립인 두 번의 던짐에서 앞면이 정확히 한 번 나올 확률은 1/2일까요?</li><li>첫 결과가 앞면이라고 알게 된 뒤에도 그 조건부확률은 1/2일까요?</li><li>적어도 한 번 앞면이라고 알게 되면 같은 확률이 2/3로 바뀔까요?</li></ol>
<p>답은 <strong>예, 예, 예</strong>입니다. 같은 네 기록에서도 어떤 정보를 조건으로 받았는지에 따라 남는 전체와 그 안의 비중이 달라집니다.</p>
<ProbabilityTreeViz />
<ContentBoundary article="math-probability-expectation-variance" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 절차를 정하고 경우를 나눈 뒤 질문에 맞게 모은다</h2>
<p>계산에 필요한 입력은 네 가지입니다. 무엇을 한 번 실행할지, 어떤 기록들을 구별할지, 각 기록에 얼마의 비중을 줄지, 어떤 기록을 답으로 셀지입니다. 이미 알려진 정보가 있다면 비교할 전체를 줄이는 조건도 넣습니다. 출력은 그 조건 안에서 원하는 기록이 차지하는 비율입니다.</p>
<p>실제로 던져서 얻은 기록과 아직 던지기 전 가능한 기록의 목록은 다릅니다. 이번에 ‘앞·뒤’가 나왔다고 해서 ‘뒤·앞’이라는 가능성이 목록에서 사라지는 것은 아닙니다. 목록은 정한 절차에서 나올 수 있는 답들을 담고, 실제 실행은 그중 하나를 남깁니다.</p>
<p>기록 규칙도 먼저 정해야 합니다. 순서까지 적으면 ‘앞·뒤’와 ‘뒤·앞’을 구별하지만 앞면의 개수만 적으면 둘 다 1입니다. 뒤에서 첫 결과가 무엇이었는지 물으려면 개수만 남긴 기록으로는 부족합니다. 물으려는 질문을 구별할 수 있을 만큼 기록해야 합니다.</p>
<p>
            이제 하나의 목록을 만들고 그 안에서만 계산하겠습니다. 다른 실험의 비율을 중간에 가져오거나 질문에 맞는 기록을 두 번 세지 않으면 더 복잡한 문제에서도 어느 단계가 잘못됐는지
            찾을 수 있습니다.
          </p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 네 기록에 같은 비중을 주고 두 질문을 겹친다</h2>
<p>각 던짐에서 앞뒤의 기회는 반반이고 첫 결과를 알아도 두 번째의 기회는 바뀌지 않는다고 정합니다(가정). 두 번 던질 때 가능한 순서 기록은 ‘앞·앞’, ‘앞·뒤’, ‘뒤·앞’, ‘뒤·뒤’입니다. 각 기록에는 전체의 1/4을 배정합니다.</p>
<p>정확히 한 번 앞면인 기록은 ‘앞·뒤’와 ‘뒤·앞’ 두 개입니다. 서로 다른 기록의 비중을 합하면 1/4+1/4=1/2입니다. 여기서는 네 기록의 비중이 같기 때문에 두 개를 네 개로 나누어도 같은 답을 얻습니다.</p>
<p>첫 결과가 앞면이었다는 정보를 받으면 비교할 목록은 ‘앞·앞’과 ‘앞·뒤’로 줄어듭니다. 이 두 기록이 원래 차지하던 비중의 합은 1/2입니다. 그 안에서 정확히 한 번 앞면인 것은 ‘앞·뒤’이고 원래 비중은 1/4입니다. 새 비율은 (1/4)/(1/2)=1/2입니다.</p>
<p>이번에는 알려 준 내용이 ‘적어도 한 번 앞면이 나왔다’라고 합시다(가정). 이때 제외할 수 있는 것은 ‘뒤·뒤’뿐입니다. 세 기록이 남고 그중 두 기록에서 정확히 한 번 앞면이므로 비율은 2/3입니다. 같은 던짐을 물어도 받은 정보가 다르면 비교할 전체가 달라집니다.</p>
<p>첫 정보에서는 답이 원래의 1/2와 같았고 두 번째 정보에서는 2/3로 바뀌었습니다. 정보를 받으면 반드시 원하는 비율이 변한다고 생각할 필요는 없습니다. 어느 기록이 남았고 그 안에서 관심 있는 기록이 얼마나 차지하는지 계산하면 됩니다.</p>
<p>
            네 기록에 같은 비중을 주었다고 실제 네 번의 실행에서 각 기록이 한 번씩 꼭 나오는 것은 아닙니다. 네 번 모두 같은 기록이 나올 수도 있습니다. 지금의 1/4은 가능성에
            배정한 비중이며 몇 번 던져 관찰한 횟수의 비율과 구별합니다.
          </p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 지운 기록과 새 전체 안의 비중을 함께 본다</h2>
<p>그림의 네 칸은 같은 순서 기록입니다. 굵게 표시한 칸은 정확히 한 번 앞면인 기록이고 흐려진 칸은 받은 정보와 맞지 않아 제외한 기록입니다. 기록 자체를 바꾸지 않고 어느 칸을 비교에 넣는지만 바꿉니다.</p>
<p>조건을 넣은 장면에서는 남은 칸의 비중을 다시 합해 1이 되게 표시합니다. 처음의 1/4을 그대로 읽으면 원래 전체에서의 몫과 새 전체 안에서의 몫을 섞게 됩니다. 두 칸을 남겼다면 각 1/2, 세 칸을 남겼다면 각 1/3입니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 경우의 목록만으로는 비율을 정할 수 없다</h2>
<p>같은 네 기록에 서로 다른 비중을 줄 수도 있습니다. 앞면 쪽이 더 자주 나오도록 정한 절차라면 ‘앞·앞’과 ‘뒤·뒤’를 똑같이 취급할 이유가 없습니다. 가능한 경우를 빠짐없이 적는 일과 그 경우가 얼마나 자주 나올지 정하는 일은 별개의 단계입니다.</p>
<p>비중이 다르면 남은 칸의 개수만 세어 나누는 방법이 틀릴 수 있습니다. 정확히 한 번 앞면인 두 칸을 찾았더라도 두 칸의 비중을 실제로 더해야 합니다. 받은 정보로 범위를 줄일 때도 남은 전체의 비중으로 나눕니다.</p>
<p>원하는 기록들이 겹치는지도 확인해야 합니다. ‘첫 결과가 앞면’인 두 칸과 ‘둘째 결과가 앞면’인 두 칸을 그냥 합하면 ‘앞·앞’을 두 번 셉니다. 둘 중 하나라도 앞면인 비율을 구하려면 한 번 더 센 칸을 빼야 합니다. 서로 다른 질문의 답을 모을 때 생기는 문제입니다.</p>
<p>조건을 넣는 일은 동전을 다시 던지는 일이 아닙니다. 이미 실행된 절차에 대한 정보를 받아 비교 범위를 바꿉니다. 첫 결과를 강제로 앞면으로 만드는 실험과 단순히 첫 결과가 앞면이었다고 듣는 상황은 일반적으로 같은 문제라고 단정할 수 없습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 절차·기록·질문·비중에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">지금까지 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["두 번 던지고 순서를 적는 절차","실험(experiment)"],
["가능한 기록의 전체와 그중 하나","표본공간(sample space) Ω와 결과(outcome) ω"],
["현재 질문에 답이 되는 기록의 묶음","사건(event) A, B"],
["사건마다 얼마의 비중을 줄지 정하는 규칙","확률법칙(probability law) P; 이산 분포의 점확률"],
["두 질문에 동시에 해당하는 기록","교집합(intersection) A∩B"],
["둘 중 하나 이상에 해당하는 기록","합집합(union) A∪B"],
["B라는 정보 안에서 A가 차지하는 비율","조건부확률(conditional probability) P(A|B)"],
["한 사건을 알아도 다른 사건의 비율이 바뀌지 않는 관계","독립(independence)"],
["같은 실행에서 동시에 참일 수 없는 관계","상호배타(mutually exclusive)"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((s,j)=><td key={j} className="p-3 align-top">{s}</td>)}</tr>)}</tbody></table></div>
<p>앞면은 H, 뒷면은 T로 줄여 쓰겠습니다. HT는 첫 던짐이 앞면이고 두 번째가 뒷면이라는 기록 하나입니다. 사건 A=&#123;HT,TH&#125;는 그중 하나가 아니라 두 기록을 모은 집합입니다. 이산 사례에서는 각 기록의 확률을 더해 사건의 확률을 구합니다.</p>
</section>
<section id="outcomes" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 같은 네 기록에서 확률의 합과 중복을 검사한다</h2>
<p>표본공간은 Ω=&#123;HH,HT,TH,TT&#125;입니다. 비중이 모두 음수가 아니며 합은 4×1/4=1입니다. 정확히 한 번 앞면인 사건 A의 확률은 P(A)=P(HT)+P(TH)=1/2입니다. 아무 기록도 포함하지 않는 공집합 ∅도 사건이며 확률은 0입니다.</p>
<p>첫 앞면 사건 U=&#123;HH,HT&#125;와 둘째 앞면 사건 V=&#123;HH,TH&#125;는 HH에서 겹칩니다. 합집합의 확률은 P(U∪V)=P(U)+P(V)−P(U∩V)=1/2+1/2−1/4=3/4입니다. 교집합을 한 번 빼는 것은 HH를 두 번 더했기 때문입니다.</p>
<p>이제 각 던짐의 앞면 확률을 0.7로 바꾸고 두 던짐은 서로 독립이라고 정합니다(가정). 네 기록은 HH 0.49, HT 0.21, TH 0.21, TT 0.09이며 합은 1입니다. 정확히 한 번 앞면일 확률은 0.42입니다. 같은 두 칸이라는 이유로 1/2라고 계산하면 틀립니다.</p>
<p>첫 던짐의 앞면 확률만 0.7이라고 알려 주면 이 표를 완성할 수 없습니다. 두 번째의 확률과 두 결과의 관계도 필요합니다. 같은 동전이라는 말 역시 구체적인 시행 조건을 대신하지 못하므로 여기서는 두 가정을 명시했습니다.</p>
</section>
<section id="conditional-probability" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 새 전체의 비중으로 나누면 남은 합이 다시 1이 된다</h2>
<p>다시 처음의 공정하고 독립인 던짐으로 돌아갑니다. A는 정확히 한 번 앞면, B는 첫 결과가 앞면입니다. A∩B는 HT 하나이고 P(A∩B)=1/4입니다. B 전체는 HH와 HT라서 P(B)=1/2입니다. 앞서 말로 계산한 같은 비율을 이제 기호로 적습니다.</p>
<ExplainedFormula question="왜 원래 전체의 1/4을 새 전체의 1/2로 나누나요?" idea="조건 B 밖의 기록을 제외한 뒤 남은 전체를 1로 맞춥니다. 관심 있는 기록에도 같은 배율을 적용합니다."
formula={String.raw`P(A\mid B)=\frac{P(A\cap B)}{P(B)},\qquad P(B)>0`}
annotatedFormula={String.raw`\begin{gathered}P(A\mid B)=\frac{\overbrace{P(A\cap B)}^{\text{B 안의 관심 비중}}}{\underbrace{P(B)}_{\text{남은 전체 비중}}},\quad P(B)>0\\A=\{HT,TH\},\quad B=\{HH,HT\}\\P(A\mid B)=\frac{1/4}{1/2}=\frac12\end{gathered}`}
operations={[{expression:String.raw`P(A\cap C)/P(C)=(1/2)/(3/4)=2/3`,annotation:["C={HH,HT,TH}라는 다른 정보이면 관심 기록 두 개의 비중을 남은 세 개의 비중으로 나눕니다."]}]}
terms={[{symbol:"A∩B",name:"동시에 맞는 기록",description:"이 사례에서는 HT 한 개입니다."},{symbol:"P(B)",name:"새 비교 전체",description:"0보다 커야 이 비율을 계산할 수 있습니다."}]}
assumptions={["A와 B는 같은 확률법칙을 사용하는 사건입니다.","P(B)=0이면 이 나눗셈으로 조건부확률을 정의하지 않습니다."]} interpretation="A와 B가 겹치는 칸만 찾는 것으로는 부족합니다. 그 비중을 B 전체의 비중으로 나누어야 합니다." />
<p>P(B)=0인 경우 임의로 답을 0이나 1로 정하지 않습니다. 분자도 0이어도 0/0은 유일한 비율을 정하지 못합니다. 연속값에 대한 조건을 다루는 다른 정의가 있지만 지금의 사건 비율식을 그대로 사용하는 것은 아닙니다.</p>
</section>
<section id="chain-rule" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 조건부 비율에 이전 전체를 곱해 한 경로를 복원한다</h2>
<p>앞의 나눗셈을 거꾸로 읽으면 P(A∩B)=P(B)P(A|B)입니다. 같은 HT 경로에서는 첫 H의 확률 1/2에 그 뒤 T의 조건부확률 1/2를 곱해 1/4을 복원합니다. 곱한다는 사실 자체가 독립을 뜻하지는 않습니다. 두 번째 비율에 이전 정보를 남겼기 때문입니다.</p>
<ExplainedFormula question="긴 기록도 같은 복원을 반복할 수 있나요?" idea="먼저 나온 기록의 확률에 그 기록을 이미 봤을 때 다음 결과가 나올 비율을 곱합니다. 조건의 범위도 한 단계씩 늘어납니다."
formula={String.raw`P(y_1,y_2,y_3)=P(y_1)P(y_2\mid y_1)P(y_3\mid y_1,y_2)`}
annotatedFormula={String.raw`\begin{gathered}P(y_1,y_2,y_3)=\underbrace{P(y_1)}_{\text{첫 기록}}\underbrace{P(y_2\mid y_1)}_{\text{첫 기록 뒤 비율}}\\{}\cdot\underbrace{P(y_3\mid y_1,y_2)}_{\text{두 기록 뒤 비율}}\\P(HT)=P(H_1)P(T_2\mid H_1)=\frac12\cdot\frac12=\frac14\end{gathered}`}
operations={[{expression:String.raw`P(A\cap B)=P(B)P(A\mid B)`,annotation:["조건부확률 식 양쪽에 P(B)를 곱해 두 사건의 결합확률을 되찾습니다."]}]}
terms={[{symbol:"yᵢ",name:"순서가 있는 결과",description:"i번째 기록이나 token입니다."},{symbol:"연쇄법칙",name:"chain rule",description:"앞의 기록을 조건으로 둔 비율을 차례로 곱하는 항등식입니다."}]}
assumptions={["사용하는 각 조건부확률의 이전 기록 확률이 양수입니다.","조건부 비율을 단순한 주변 확률로 바꾸려면 해당 독립 조건이 추가로 필요합니다."]} interpretation="언어 모델도 앞 token을 조건으로 다음 token의 확률을 곱합니다. 항등식이 맞는 것과 모델이 각 비율을 정확히 추정하는 것은 별개입니다." />
<p>빨강 2개와 파랑 1개 중 두 개를 되돌려 놓지 않고 뽑는 경우를 보겠습니다(가정). 첫 빨강은 2/3이지만 그 뒤에는 빨강 1개와 파랑 1개라서 다음 빨강은 1/2입니다. 두 번 빨강일 확률은 (2/3)(1/2)=1/3입니다. 조건을 지우고 (2/3)²=4/9로 바꾸면 앞 추출이 바꾼 구성을 놓칩니다.</p>
</section>
<section id="source-formulas" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 원문에서 조건과 곱의 범위를 같은 기록에 적용한다</h2>
<p>MIT 6.041SC 강의 1의 PDF 2쪽은 사건에 확률을 배정하고, 전체의 확률을 1로 두며, 서로 겹치지 않는 사건의 확률을 더하는 규칙을 제시합니다. 같은 쪽의 경우의 수 비율은 모든 결과가 같은 확률이라는 조건 아래 나옵니다. 우리 네 기록에는 그 조건을 정했지만 0.7 사례에는 정하지 않았습니다.</p>
<div id="paper-probability-model"><CitationBlock source="MIT 6.041SC, Lecture 1 · PDF 2쪽 Probability axioms / Discrete uniform law" citeKey={1} href={`${L1}#page=2`}>원문의 P(Ω)=1과 서로 겹치지 않는 A, B에 대한 P(A∪B)=P(A)+P(B)를 사용합니다. A=&#123;HT&#125;, B=&#123;TH&#125;를 넣으면 1/4+1/4=1/2입니다. 네 기록을 단순히 셀 수 있는 조건도 이 원문의 동일 확률 가정과 대조했습니다.</CitationBlock></div>
<p>강의 2의 PDF 1쪽 왼쪽 아래는 P(A|B)=P(A∩B)/P(B)와 함께 P(B)≠0을 명시합니다. 우리 A=&#123;HT,TH&#125;, B=&#123;HH,HT&#125;를 넣으면 분자는 1/4, 분모는 1/2입니다. PDF에서 0이 아님을 뜻하는 기호까지 확인해야 하며 그 조건을 뒤집으면 정의가 성립하지 않습니다.</p>
<p>같은 PDF 2쪽 오른쪽 위의 원문 식은 P(A∩B∩C)=P(A)P(B|A)P(C|A∩B)입니다. 원문의 사건 글자를 유지한 채 A를 첫 H, B를 둘째 T로 읽고 C를 확실한 사건 Ω로 두면 마지막 비율은 1입니다. 따라서 같은 HT의 확률은 (1/2)(1/2)×1=1/4로 복원됩니다.</p>
<div id="paper-conditional-chain"><CitationBlock source="MIT 6.041SC, Lecture 2 · PDF 1쪽 조건부 정의, 2쪽 Multiplication rule" citeKey={2} href={`${L2}#page=1`}>분모가 양수인 조건과 각 곱의 앞 기록 범위를 사용했습니다. 위 적용에서 C=Ω는 원문의 세 사건 식에 같은 두 던짐 사례를 넣기 위한 선택입니다. 원문에 없는 세 번째 던짐을 실제로 관측했다고 주장하지 않습니다.</CitationBlock></div>
</section>
<section id="independence-boundary" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 서로 정보를 주지 않는 것과 함께 일어날 수 없는 것은 다르다</h2>
<p>처음의 두 던짐에서 U는 첫 H, V는 둘째 H입니다. 두 사건의 확률은 각각 1/2이고 교집합 HH는 1/4입니다. P(U∩V)=P(U)P(V)이므로 두 사건은 독립입니다. P(U)&gt;0인 이 사례에서는 P(V|U)=P(V)라는 같은 뜻의 식으로도 확인할 수 있습니다.</p>
<p>같은 첫 던짐의 H와 T는 함께 일어날 수 없습니다. 각각 확률은 1/2이지만 교집합은 비어 확률이 0입니다. 한쪽이 일어났다고 알면 다른 쪽은 일어나지 않았음을 알게 됩니다. 이 관계가 상호배타입니다.</p>
<ExplainedFormula question="확률이 양수인 두 배타적 사건이 독립일 수 없는 이유는 무엇인가요?" idea="동시에 가능한 기록이 없다는 조건과 독립이라면 필요한 확률의 곱을 비교합니다."
formula={String.raw`A\cap B=\varnothing,\quad P(A)>0,\ P(B)>0\quad\Longrightarrow\quad 0=P(A\cap B)\ne P(A)P(B)>0`}
annotatedFormula={String.raw`\begin{gathered}A\cap B=\varnothing,\quad P(A)>0,\ P(B)>0\\\underbrace{P(A\cap B)}_{\text{동시 기록 없음}}=0\ne\underbrace{P(A)P(B)}_{\text{독립이면 같아야 하는 값}}>0\\\text{첫 H와 첫 T:}\quad 0\ne\frac12\cdot\frac12=\frac14\end{gathered}`}
operations={[{expression:String.raw`P(A\cap B)=P(A)P(B)`,annotation:["이 곱의 등식이 독립의 정의입니다. 조건부확률로 나누지 않아 확률 0인 사건에도 적용됩니다."]}]}
terms={[{symbol:"∅",name:"공집합",description:"동시에 해당하는 기록이 하나도 없습니다."}]}
assumptions={["배타적 사건이 독립일 수 없다는 결론에는 두 확률이 모두 양수라는 조건이 필요합니다.","한 사건의 확률이 0이면 교집합 확률도 0이므로 곱의 등식이 성립할 수 있습니다."]} interpretation="독립은 결합확률의 관계이고 배타성은 기록 집합의 겹침 관계입니다. 같은 의미의 두 이름으로 바꿔 쓰지 않습니다." />
<p>각 던짐이 반반이라는 사실만으로도 부족합니다. HH, HT, TH, TT에 각각 3/8, 1/8, 1/8, 3/8을 주어 봅시다(가정). 첫 H와 둘째 H의 확률은 여전히 각각 1/2이지만 HH는 3/8로 곱 1/4과 다릅니다. 첫 H를 알면 둘째 H의 비율은 3/4로 올라갑니다.</p>
</section>
<section id="conditional-independence" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 같은 네 기록에서 조건을 붙이면 독립도 달라질 수 있다</h2>
<p>다시 네 기록의 확률이 각각 1/4인 원래 모형입니다. 첫 H인 U와 둘째 H인 V는 독립입니다. 여기에 ‘두 결과가 같았다’는 사건 D=&#123;HH,TT&#125;를 조건으로 붙이면 남는 기록은 두 개입니다. 그 안에서 첫 H를 알면 둘째 H도 반드시 참입니다.</p>
<p>D만 알았을 때 P(V|D)=1/2인데 U까지 알면 P(V|U∩D)=1입니다. 원래 독립이던 관계를 새 조건 안에서도 독립이라고 이어 쓰면 틀립니다. 어느 정보를 이미 알고 있는지까지 포함해 관계를 말해야 합니다.</p>
<ProgressiveDetail title="두 사건씩 독립이면 세 사건도 함께 독립일까요?" preview="같은 U·V·D는 어느 두 사건씩 검사해도 독립이지만 세 사건을 함께 보면 독립이 아닙니다.">
<p>U, V, D의 확률은 각각 1/2입니다. U∩V, U∩D, V∩D는 모두 HH 하나라서 확률이 1/4입니다. 따라서 세 쌍 모두 각 확률의 곱과 같습니다. 하지만 U∩V∩D도 HH라서 1/4이고 세 확률의 곱은 1/8입니다.</p>
<p>모든 쌍의 독립만 확인한 상태를 쌍별 독립이라고 합니다. 여러 사건의 독립은 관련된 부분 모음들의 교집합에서도 곱의 등식이 성립해야 합니다. 두 개씩의 검사만으로 모든 결합관계를 확인했다고 결론 내리지 않습니다.</p>
</ProgressiveDetail>
<CitationBlock source="MIT 6.041SC, Lecture 3 · PDF 1쪽 독립 정의와 2쪽 Pairwise independence" citeKey={3} href={`${L3}#page=2`}>2쪽 왼쪽 아래의 원문은 첫 H, 둘째 H, 두 결과가 같음이라는 세 사건을 같은 네 기록에 정의합니다. 위에서는 그 칸을 직접 세어 세 쌍은 1/4, 세 사건의 교집합도 1/4임을 계산했습니다. 원문의 세 사건 전체 독립 조건과 맞지 않는 지점은 1/8과의 차이입니다.</CitationBlock>
</section>
<section id="limits" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 정한 모형의 답과 현실에서 확인한 비율을 나눈다</h2>
<p>공정함과 독립은 이번 계산의 가정입니다. 현실의 던짐이나 데이터가 같은 조건인지 확인하려면 수집 방법과 관측을 봐야 합니다. 작은 표의 합이 1이라는 검사는 내부적으로 일관된 확률법칙인지 확인할 뿐, 그 법칙이 현실을 잘 설명한다는 증명은 아닙니다.</p>
<p>이 글의 네 경우는 유한하므로 사건의 확률을 각 기록의 점확률 합으로 계산했습니다. 일반적인 연속 모형에서는 개별 점의 확률이 모두 0이어도 구간의 확률은 양수일 수 있습니다. [0,1]에 고르게 배정한 모형에서 정확히 0.5인 사건의 확률은 0이고 [0.4,0.6]에 속할 확률은 0.2입니다. 확률 0을 언제나 빈 사건과 같은 뜻으로 읽지는 않습니다.</p>
<p>순서 기록을 앞면 수처럼 숫자로 바꾸는 과정과 그 숫자의 평균은 <a className="text-primary underline" href="/cs/ai/math-random-variables-expectation">확률변수와 기댓값</a>에서 이어집니다. 일부 실행을 보고 전체 비율과 흔들림을 추정하는 문제는 <a className="text-primary underline" href="/cs/ai/math-variance-sampling">분산과 표본 추정</a>에서 다룹니다.</p>
</section>
<section id="review" data-teach-level="8" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 정보를 바꾸기 전에 남을 기록을 고른다</h2>
<p>공정한 두 독립 던짐에서 ‘첫 결과가 앞면’ 대신 ‘적어도 한 번 앞면’이라고 들었습니다. 정확히 한 번 앞면일 확률의 분모와 답은 어떻게 바뀌나요? (답: 8절)</p>
<p>각 던짐의 앞면 확률은 1/2인데 HH의 확률은 3/8입니다. 두 던짐을 독립이라고 할 수 있나요? 첫 H를 알면 둘째 H의 확률은 얼마인가요? (답: 11절)</p>
<p>원래 독립인 두 던짐에 ‘두 결과가 같음’이라는 조건을 붙였습니다. 첫 H를 알면 둘째 H의 확률은 그대로 1/2일까요? 두 사건씩의 독립만으로 세 사건 전체 독립을 보장할 수도 있을까요? (답: 12절)</p>
</section>
</article>;}
