import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { projectionCodeRefs } from "./codeRefs";
import RepeatedCoordinatesViz from "./viz/RepeatedCoordinatesViz";
const JL="https://cseweb.ucsd.edu/~dasgupta/papers/jl.pdf";
const ID="https://arxiv.org/pdf/2104.08894";
export default function HighDimensionalGeometryArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 숫자 칸을 줄여도 점 사이의 차이를 남길 수 있을까</h2>
<p className="text-lg leading-8">한 물체의 상태를 네 숫자로 저장한다고 합시다. 그런데 네 칸에 항상 같은 값이 들어갑니다. (1,1,1,1)과 (2,2,2,2)를 구분하려고 네 칸을 모두 저장할 필요가 있을까요? 한 숫자만 남겨도 원래 상태를 되찾을 수 있습니다. 다만 두 상태가 얼마나 떨어져 있는지까지 보존하려면 남기는 숫자의 배율도 맞춰야 합니다.</p>
<p>
            이미지나 AI가 만든 표현은 수백에서 수십만 칸을 사용할 수 있습니다. 칸이 많다는 사실만으로 서로 다른 정보가 그만큼 많다고 할 수는 없습니다. 이 글에서는 네 칸이 함께
            변하는 작은 사례에서 출발해 어떤 정보를 줄일 수 있는지와 줄인 결과를 무엇으로 검증할지 살펴봅니다.
          </p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>(t,t,t,t)의 네 칸을 더해 2로 나누면 한 칸 값은 2t일까요?</li><li>이 변환은 (0,0,0,0)부터 (3,3,3,3)까지 네 점의 여섯 거리를 모두 보존할까요?</li><li>첫째 좌표 t만 남겨도 원래 거리와 같은 크기가 유지될까요?</li></ol>
<p>답은 <strong>예, 예, 아니요</strong>입니다. 반복 좌표의 실제 자유도는 하나지만, 거리까지 보존하려면 √4=2의 배율을 함께 남겨야 합니다.</p>
<RepeatedCoordinatesViz />
<ContentBoundary article="math-high-dimensional-geometry" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 점들을 받아 더 적은 칸으로 쓰고 거리를 비교한다</h2>
<p>입력은 같은 단위로 잰 네 칸짜리 점들의 목록입니다. 모든 점에 같은 변환 규칙을 적용해 한 칸짜리 목록을 만듭니다. 먼저 지켜야 할 것은 점의 순서와 서로 다른 점 사이의 거리입니다. 한 점씩 따로 배율을 정하면 점들 사이의 관계를 비교하기 어려워집니다.</p>
<p>
            출력에서 원래 네 칸을 복원하는 질문도 따로 있습니다. 거리를 보존하는 것과 원래 좌표를 되찾는 것은 서로 다른 요구입니다. 우선 같은 두 점을 골라 변환 전후 거리를 직접
            비교하고 복원 규칙이 있는지도 이어서 확인하겠습니다.
          </p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 네 칸에 반복된 값을 합하고 2로 나눈다</h2>
<p>점 네 개를 (0,0,0,0), (1,1,1,1), (2,2,2,2), (3,3,3,3)으로 정합니다(가정). 각 점의 네 칸을 더한 뒤 2로 나누면 새 숫자는 순서대로 0, 2, 4, 6입니다. 계산 규칙은 모든 점에서 같습니다.</p>
<p>첫째와 둘째 점은 각 칸에서 1만큼 다릅니다. 차이를 제곱해 더하면 1+1+1+1=4이고 제곱근은 2입니다. 줄인 뒤에도 0과 2의 거리는 2입니다. 첫째와 넷째 점은 제곱합 9+9+9+9=36에서 거리 6을 얻고, 줄인 뒤에도 0과 6의 거리는 6입니다.</p>
<p>네 점에는 서로 다른 쌍이 여섯 개 있습니다. 첫째 점에서 나머지 세 점까지는 2, 4, 6입니다. 둘째 점에서 셋째와 넷째까지는 2와 4이고 셋째와 넷째 사이는 2입니다. 줄인 뒤 여섯 거리를 다시 재도 같은 값이 나옵니다. 한 쌍의 우연한 일치에 그치지 않습니다.</p>
<p>새 숫자를 2로 나누어 네 칸에 복사하면 원래 점도 되찾습니다. 예를 들어 4는 (2,2,2,2)로 돌아갑니다. 이 복원은 입력의 네 칸이 항상 같다는 약속을 이용합니다. 네 칸이 제각각인 입력에도 같은 방법이 통한다고 확대해서는 안 됩니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 같은 네 점을 줄이는 좋은 규칙과 나쁜 규칙을 비교한다</h2>
<p>아래의 윗줄은 네 칸 입력에서 잰 거리를 한 눈금 위에 펼친 것입니다. 네 칸 공간 전체를 평면에 그린 그림은 아닙니다. 이 네 점은 한 방향으로 나란히 놓이므로 한 줄에서도 그 사이 거리를 정확히 나타낼 수 있습니다.</p>
<p>합을 2로 나누는 장면에서는 아랫줄의 점 사이 간격이 그대로입니다. 첫 칸만 남기는 장면에서는 0, 1, 2, 3이 되어 간격이 절반으로 줄어듭니다. 첫 칸에서 둘째 칸을 빼면 모두 0이 되어 서로 다른 점이 겹칩니다. 출력이 한 칸이라는 사실은 같아도 무엇을 남기는지에 따라 결과가 달라집니다.</p>
</section>
<section id="problem" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 줄일 수 있는 양보다 남겨야 할 관계를 먼저 정한다</h2>
<p>네 칸 사례에서 값을 하나만 저장하면 되지만 아무 값이나 남겨서는 안 됩니다. 검색에서 비슷한 점을 찾으려면 점 사이의 비교가 남아야 합니다. 입력 자체를 다시 만들려면 되돌리는 규칙까지 필요합니다. 어느 요구를 확인했는지 구분해야 작은 결과를 보고 성공 여부를 판단할 수 있습니다.</p>
<p>새로 (1,1,1,2)를 넣으면 합을 2로 나눈 결과는 2.5입니다. 이를 되돌린 (1.25,1.25,1.25,1.25)는 원래 입력과 다릅니다. 이 값은 처음 정한 입력 약속 밖에 있습니다. 앞의 네 점에서 완벽했던 변환도 새 입력의 종류가 바뀌면 다시 검사해야 합니다.</p>
<p>또 저장 칸을 천 개로 늘리되 같은 값을 복사한다고 합시다. 값 0과 1의 거리에는 √1000, 값 0과 3의 거리에는 3√1000이 나옵니다. 먼 거리와 가까운 거리의 비는 여전히 3입니다. 칸 수가 커졌다는 이유만으로 모든 거리가 비슷해지는 것은 아닙니다.</p>
<p>이제 두 문제를 차례로 보겠습니다. 먼저 각 칸이 제각각 무작위로 변할 때 거리의 상대적인 차이가 왜 줄어드는지 계산합니다. 다음으로 이미 정한 점들의 거리를 작은 오차 안에서 보존할 수 있는 일반적인 방법을 봅니다. 마지막에는 데이터가 실제로 변하는 방향의 수와 학습 모델의 좁은 통로가 어떤 관계인지 구분하겠습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 칸 수, 실제 자유도, 줄이는 규칙에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">지금까지 본 것</th><th className="p-3">이름</th><th className="p-3">이번 사례</th></tr></thead><tbody>{[
["점을 적는 좌표의 수","주변 차원(ambient dimension)","D=4"],
["두 점의 차이를 제곱해 더한 뒤 제곱근을 취한 길이","유클리드 거리(Euclidean distance)","첫째와 둘째 점 사이 2"],
["같은 계산으로 적은 좌표에 옮기기","선형 사영(linear projection)","네 좌표의 합을 2로 나누기"],
["거리 같은 양의 상대적인 요동이 작아지는 현상","집중(concentration)","좌표들의 분포 조건을 따로 확인"],
["유한한 점 집합의 거리를 작은 오차로 보존하는 정리","Johnson–Lindenstrauss 정리(JL)","점 수 n, 제곱거리 오차 ε를 고정"],
["데이터가 놓인 연속적인 모양이 국소적으로 변하는 자유도","내재 차원(intrinsic dimension)","네 칸에 같은 실수 t를 넣는 직선은 1"],
].map((row,i)=><tr key={i} className="border-t border-border">{row.map((cell,j)=><td className="p-3 align-top" key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
<p>주변 차원은 D, 줄인 뒤의 좌표 수는 k로 적겠습니다. 관측한 점의 개수 n은 둘과 다릅니다. 우리의 사례에서는 D=4, n=4, k=1입니다. 내재 차원 1은 네 표본을 포함하는 연속 직선의 성질을 말합니다. 유한한 표본만 보고 그 배후 모양을 유일하게 결정할 수는 없습니다.</p>
</section>
<section id="distance" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 같은 직선에서는 모든 거리가 2배의 차이로 계산된다</h2>
<ExplainedFormula question="p(t)=(t,t,t,t)와 p(s)=(s,s,s,s)의 거리는 얼마인가요?" idea="네 좌표의 차이가 모두 t−s입니다. 제곱을 더하면 부호가 상쇄되지 않고, 제곱근을 취하면 좌표의 원래 단위로 돌아옵니다."
formula={String.raw`\operatorname{dist}(x,y)=\lVert x-y\rVert_2=\sqrt{\sum_{i=1}^{D}(x_i-y_i)^2}`}
annotatedFormula={String.raw`\begin{gathered}\operatorname{dist}(x,y)=\lVert x-y\rVert_2=\sqrt{\sum_{i=1}^{D}(x_i-y_i)^2}\\[8pt]\lVert p(t)-p(s)\rVert_2=\sqrt{\underbrace{4(t-s)^2}_{\text{같은 차이 네 개}}}=2|t-s|\end{gathered}`}
operations={[{expression:String.raw`f(p(t))=(t+t+t+t)/2=2t`,annotation:["출력에서도 |2t−2s|=2|t−s|입니다.","여섯 쌍뿐 아니라 이 직선의 모든 점 쌍에서 같습니다."]}]}
terms={[{symbol:"D",name:"입력 좌표 수",description:"일반 식의 합에 들어가는 항의 수입니다."},{symbol:"t−s",name:"직선 위의 매개값 차이",description:"네 좌표가 같은 차이를 공유합니다."},{symbol:"dist",name:"두 점 사이 거리",description:"좌표 수 D와 이름을 구별해 적습니다."}]}
assumptions={["비교할 좌표의 단위를 맞췄습니다. 단위가 다른 측정값을 그대로 섞으면 거리의 의미가 달라집니다.","거리를 정의하는 데 좌표의 독립성은 필요 없습니다. 독립성은 다음 절의 확률 계산에 쓰입니다."]} interpretation="일반적인 실수 x,y의 거리 식과 특별한 직선 p(t)의 계산을 구별합니다. 이 직선에서 z=2t를 받은 뒤 (z/2,z/2,z/2,z/2)로 복원할 수 있습니다." />
<p>첫 칸만 고르면 출력 t의 거리는 |t−s|이므로 순서는 유지되지만 절대 길이는 절반입니다. 첫째와 둘째 좌표의 차이를 √2로 나누는 다른 사영은 항상 0입니다. 이 사영의 방향도 길이 1이지만 데이터가 변하는 방향과 직각이어서 정보를 잃습니다. 출력 크기나 방향의 길이만 확인해서는 부족합니다.</p>
</section>
<section id="concentration" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 독립적인 무작위 좌표에서는 제곱거리의 상대 요동이 줄어든다</h2>
<p>이 절에서는 입력을 바꿉니다. 두 점의 모든 좌표를 서로 독립적으로 뽑고 각 좌표가 확률 1/2로 0 또는 1이라고 정합니다(가정). 한 좌표의 두 값은 확률 1/2로 다르므로 차이의 제곱도 확률 1/2로 1, 나머지는 0입니다. 이 0·1 항들을 더한 H가 두 점의 제곱거리입니다.</p>
<p>H의 평균은 D/2이고 분산은 D/4입니다. 독립인 항의 분산이 더해지기 때문입니다. 표준편차는 √D/2이므로 평균으로 나눈 상대 표준편차는 정확히 1/√D입니다. 여기서 말한 정확한 비율은 거리 √H가 아니라 제곱거리 H에 관한 것입니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">좌표 수 D</th><th className="p-3">H의 평균</th><th className="p-3">H의 표준편차</th><th className="p-3">상대 표준편차</th></tr></thead><tbody>{[["4","2","1","50%"],["1000","500","약 15.811","약 3.162%"]].map((row,i)=><tr key={i} className="border-t border-border">{row.map((cell,j)=><td key={j} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div>
<p>H가 평균의 (1±η) 안에 있으면 거리 √H는 √(D/2)에 대해 √(1±η) 범위에 있습니다. 따라서 제곱거리의 집중은 거리의 집중으로 이어집니다. 하지만 평균의 제곱근을 거리의 평균이라고 동일시하거나 상대 표준편차의 상수가 그대로라고 주장하지는 않습니다.</p>
<p>앞의 복사된 좌표에서는 항들이 독립이 아닙니다. 하나가 변하면 모두 같이 변하므로 이 분산 덧셈을 적용할 수 없습니다. 또한 한 쌍의 집중 결과만으로 많은 점 중 가장 가까운 것과 가장 먼 것까지 같아진다고 결론 내릴 수 없습니다. 점 개수가 차원과 함께 얼마나 빨리 늘어나는지도 필요합니다.</p>
<p>거리 차이가 작아지면 잡음과 반올림에 순위가 민감할 수 있습니다. 그래도 좌표 수만으로 이웃 검색이 무의미하다고 판단하지 않습니다. 실제 분포와 거리의 정의, 찾아야 하는 대상의 의미를 함께 평가해야 합니다.</p>
</section>
<section id="jl-lemma" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 일반적인 거리 보존의 충분조건과 사례의 최소 크기를 구별한다</h2>
<p>JL 정리는 이미 고정한 유클리드 공간의 n개 점을 다룹니다. 점들이 무작위이거나 낮은 내재 차원을 가져야 한다는 조건은 없습니다. 0&lt;ε&lt;1을 정하면 모든 점 쌍의 제곱거리를 (1±ε) 배 안에 두는 선형 변환이 존재합니다. 아래 식은 Dasgupta–Gupta의 정리 2.1에 나온 충분조건입니다.</p>
<ExplainedFormula question="점 n개의 제곱거리를 모두 보존하는 변환의 존재를 어떻게 보장하나요?" idea="점 쌍마다 길이가 크게 틀어질 가능성을 줄인 뒤 모든 쌍의 실패 가능성을 합칩니다. 원래 좌표 수와 무관한 충분 크기를 얻지만 실제 필요한 최소 크기를 구한 것은 아닙니다."
formula={String.raw`k\ge\frac{4\ln n}{\varepsilon^2/2-\varepsilon^3/3}\quad\Longrightarrow\quad\exists f:\ (1-\varepsilon)\lVert u-v\rVert^2\le\lVert f(u)-f(v)\rVert^2\le(1+\varepsilon)\lVert u-v\rVert^2`}
annotatedFormula={String.raw`\begin{gathered}k\ge\underbrace{\frac{4\ln n}{\varepsilon^2/2-\varepsilon^3/3}}_{\text{존재를 보이는 충분 크기}}\\\underbrace{(1-\varepsilon)\lVert u-v\rVert^2\le\lVert f(u)-f(v)\rVert^2\le(1+\varepsilon)\lVert u-v\rVert^2}_{\text{고정한 모든 점 쌍의 제곱거리}}\end{gathered}`}
operations={[{expression:String.raw`\begin{gathered}n=4,\quad\varepsilon=0.2\\k\ge319.914\ldots\end{gathered}`,annotation:["정수로 올림하면 320입니다.","우리 직선은 k=1로도 모든 거리를 정확히 보존했습니다."]}]}
terms={[{symbol:"n",name:"고정한 점의 개수",description:"사례에서는 네 개이며 서로 다른 쌍은 여섯 개입니다."},{symbol:"ε",name:"제곱거리의 허용 오차",description:"일반 길이에는 √(1−ε)부터 √(1+ε)까지의 배율이 대응합니다."},{symbol:"k",name:"출력 좌표 수",description:"충분조건을 엄밀히 만족하는 정수는 계산값을 올림해 정합니다."}]}
assumptions={["n≥2인 유한 점 집합과 0<ε<1을 고정합니다.","이 식은 적합한 변환의 존재에 관한 것입니다. 뽑는 모든 무작위 변환의 성공을 뜻하지 않습니다.","D≤k이면 좌표를 그대로 두고 필요하면 0을 덧붙여도 됩니다. 항상 차원이 줄어드는 것은 아닙니다."]} interpretation="n=4의 보수적인 충분 크기 320은 D=4보다 큽니다. 데이터의 한 방향을 아는 우리는 k=1로 줄일 수 있습니다. 충분조건보다 작다는 이유만으로 특정 변환이 실패한다고 판단할 수 없습니다." />
<p>예를 들어 ε=0.2이고 원래 거리가 2라면 제곱거리는 4입니다. 허용 구간은 제곱거리 3.2부터 4.8, 일반 거리로 약 1.789부터 2.191입니다. 우리의 변환은 거리 2를 내므로 통과합니다. 단순히 첫 칸만 남겨 얻은 거리 1은 실패합니다.</p>
<p>n을 고정하고 ε가 작을 때 분모의 주된 항은 ε²/2입니다. ε를 절반으로 줄이면 필요한 크기는 대략 네 배가 됩니다. 정확히 네 배는 아닙니다. 0.1에서 0.05로 바꾸면 올림 전 값의 비는 약 3.862입니다. n에 대한 로그 관계도 ε를 고정한 비교입니다.</p>
</section>
<section id="probability" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 존재 증명과 한 번 뽑아 성공할 확률을 나눈다</h2>
<p>원 논문 62쪽은 D&gt;k일 때 무작위 k차원 부분공간으로 직교 사영한 뒤 √(D/k)를 곱합니다. 각 쌍의 실패 확률은 2/n² 이하이고, n(n−1)/2쌍을 합치면 전체 실패 확률은 1−1/n 이하입니다. 따라서 한 번의 성공 확률에 얻은 하한은 1/n입니다. 성공 하한을 1−1/n이라고 뒤집어 읽으면 안 됩니다.</p>
<p>우리의 네 점에서 이 합 계산은 여섯 쌍에 2/16을 곱해 실패 상한 3/4, 성공 하한 1/4를 줍니다. 이는 증명의 상한을 대입한 결과이며 실제 성공 빈도를 측정한 값이 아닙니다. 앞의 k=320은 D보다 크므로 그 사례 자체에는 좌표를 유지하는 간단한 해가 있습니다.</p>
<p>한 번의 실패 확률을 δ 이하로 제한하려면 별도의 확률 목표를 넣을 수 있습니다. c=ε²/2−ε³/3이라 쓰면 같은 꼬리 확률 계산에서 쌍별 실패는 2exp(−kc/2) 이하입니다. 합집합 부등식으로 전체 실패는 n(n−1)exp(−kc/2) 이하이므로 k≥2ln(n(n−1)/δ)/c이면 충분합니다. 여기서는 0&lt;δ&lt;1입니다.</p>
<p>더 간단한 충분조건 k≥6ln(n)/c를 쓰면 전체 실패 상한이 (n−1)/n²로, 1/n보다 작아집니다. 이때는 성공 확률 1−1/n 이상을 보장할 수 있습니다. 같은 확률 문장을 쓰려면 앞의 4를 6으로 바꾼 강한 조건을 구분해야 합니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">점 수, ε=0.1</th><th className="p-3">4ln(n)/c 올림</th><th className="p-3">6ln(n)/c 올림</th></tr></thead><tbody>{[["1000","5921","8882"],["1,000,000","11,842","17,763"]].map((row,i)=><tr key={i} className="border-t border-border">{row.map((cell,j)=><td className="p-3" key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
<p>이 확률은 고정한 점 집합에 대해 변환을 무작위로 뽑는 실험의 확률입니다. 학습 데이터의 정확도나 아직 정하지 않은 모든 미래 입력에 대한 보장으로 옮겨 읽지 않습니다. 같은 점들을 보며 잘되는 변환을 고른 경우에도 검증에 사용하지 않은 입력에서 무엇을 주장할지 다시 정해야 합니다.</p>
<div id="paper-jl-lemma"><CitationBlock source="Dasgupta & Gupta · 정리 2.1, 증명 pp. 61–62" citeKey={1} href={JL}>원문의 존재 조건과 실패 확률 합에 같은 n=4를 대입했습니다. 원 논문의 부분공간 사영과 다음 절의 독립 정규분포 행렬 구현을 구분합니다.</CitationBlock></div>
</section>
<section id="source" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 실제 코드에서 행렬 배율과 자동 크기 선택을 읽는다</h2>
<p>scikit-learn 1.7.2의 random_projection.py를 commit 25dee604…로 고정했습니다. _gaussian_random_matrix는 k×D개 성분을 평균 0, 표준편차 1/√k인 정규분포에서 독립적으로 만듭니다. 분산은 1/k입니다. 평균만 0인 임의의 행렬이면 된다는 뜻은 아닙니다.</p>
<CodeViewButton label="실제 원문 · 행렬 생성 201–206행" onClick={()=>sidebar.open("gaussian",projectionCodeRefs.gaussian)} />
<p>고정한 차이 벡터 v에서 출력 한 칸의 평균 제곱은 ∥v∥²/k입니다. 독립 성분의 교차항 평균은 0이고 각 성분의 분산이 1/k이기 때문입니다. 출력 k칸의 제곱을 더하면 기대 제곱길이가 ∥v∥²로 돌아옵니다. 길이 자체의 기대값이 반드시 원래 길이와 같아지는 것은 아닙니다.</p>
<ProgressiveDetail title="정규분포 행렬에서도 같은 꼬리 확률이 나오는 이유" preview="고정한 한 쌍의 차이를 정규화하면 독립 표준정규 값들의 제곱합으로 바뀝니다.">
<p>v≠0을 고정하고 Zᵢ=√k(Rv)ᵢ/∥v∥로 두면 Zᵢ는 독립 표준정규 값입니다. 따라서 ∥Rv∥²/∥v∥²=(Z₁²+…+Zₖ²)/k입니다. 표준정규의 제곱은 E[exp(sZ²)]=(1−2s)⁻¹ᐟ²를 만족합니다(s&lt;1/2). 정규밀도의 지수에서 −z²/2+sz²를 묶고 적분하면 얻습니다.</p>
<p>위쪽 꼬리에는 s=ε/[2(1+ε)]를 넣어 exp(−k[ε−ln(1+ε)]/2)를 얻습니다. ln(1+ε)≤ε−ε²/2+ε³/3을 쓰면 exp(−kc/2) 이하입니다. 아래쪽 꼬리는 exp(−k[−ε−ln(1−ε)]/2)≤exp(−kε²/4)입니다. 둘을 합하면 앞 절의 2exp(−kc/2) 상한을 쓸 수 있습니다. v=0인 쌍은 처음부터 오차가 없습니다.</p>
</ProgressiveDetail>
<p>실제 transform은 점들을 행으로 모은 X에 components_.T를 오른쪽에서 곱합니다. 우리의 네 점을 4×4 표로 넣고 설명용 행렬 [1/2,1/2,1/2,1/2]를 사용하면 출력은 4×1의 [0,2,4,6]입니다. 이 행렬은 직접 고른 사례이며 무작위 생성기가 반드시 이 값을 뽑는다는 주장은 아닙니다.</p>
<CodeViewButton label="실제 원문 · 행 방향 입력의 곱 604–612행" onClick={()=>sidebar.open("transform",projectionCodeRefs.transform)} />
<p>자동 크기를 고르는 함수는 4ln(n)/c를 계산한 뒤 astype(np.int64)로 양수 소수부를 버립니다. 따라서 n=4, ε=0.2에서 수식 값 약 319.914를 319로 만듭니다. 앞 절에서 부등식을 엄밀히 만족시키려고 올림한 320과 다릅니다. 백만 점과 ε=0.1에서도 이 원문의 반환값은 11,841이며 올림값 11,842와 구분합니다.</p>
<p>이어 fit의 자동 모드는 선택한 319가 입력 좌표 수 4보다 크다는 이유로 ValueError를 냅니다. 실제 데이터가 압축 불가능하다는 판정이 아닙니다. 점의 구조를 사용하지 않는 자동 규칙의 결과이며 우리는 같은 네 점을 이미 한 칸으로 줄였습니다. 이 글은 원문 분기와 독립 산술을 대조했으며 이 라이브러리를 설치해 실행한 결과로 제시하지 않습니다.</p>
<CodeViewButton label="실제 원문 · 정수 변환과 자동 모드의 거부" onClick={()=>sidebar.open("auto",projectionCodeRefs.auto)} />
<CitationBlock source="scikit-learn 1.7.2 · random_projection.py" citeKey={2} href="https://github.com/scikit-learn/scikit-learn/blob/25dee604bae18205b01548348388baf7a1cdfe0e/sklearn/random_projection.py">전체 소스와 라이선스를 보존했습니다. 같은 네 점을 실제 행렬 곱과 크기 검사에 대입했으며 직접 고른 행렬, 확률 보장, 자동 선택의 정수 처리를 구별했습니다.</CitationBlock>
</section>
<section id="intrinsic-dimension" data-calculation-explained data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 실제로 변하는 자유도와 추정한 숫자의 범위를 구별한다</h2>
<p>p(t)=(t,t,t,t)에서 t를 모든 실수로 움직이면 네 좌표 안의 직선입니다. 자유롭게 바꾸는 값이 하나라 내재 차원은 1입니다. 이 직선을 잰 표본 행렬에서 평균을 빼고 rank를 구해도 1입니다. 평균을 빼는 이유는 위치의 이동과 변하는 방향을 구분하기 위해서입니다.</p>
<p>비선형 모양에서는 선형 rank와 내재 차원이 다를 수 있습니다. 원 (cosθ,sinθ)은 각도 하나로 국소적으로 움직이므로 내재 차원이 1입니다. 하지만 원 위의 점들은 평면의 두 방향을 펼치므로 충분히 여러 방향의 표본을 모은 행렬의 rank는 2입니다. 원 전체를 하나의 직선 방향으로만 표현할 수는 없습니다.</p>
<p>Pope 등의 ICLR 2021 논문 표 1은 ImageNet의 한 image는 세로 224칸 × 가로 224칸 × 칸마다 색 channel 3개 = 150,528개 색상 좌표를 사용합니다. Pope 등의 ICLR 2021 논문 표 1은 이런 자료에서 내재 차원을 추정합니다. 이웃 수를 3, 5, 10, 20으로 바꿀 때 결과는 각각 26, 38, 43, 43입니다. 여기서 이웃 수는 JL의 출력 차원 k와 다른 설정입니다. MNIST의 추정값 7, 11, 12, 13도 같은 표에 있습니다.</p>
<p>추정기는 가까운 이웃까지의 거리 비를 사용합니다. 논문 식 (2)는 각 점의 이웃 거리 로그 비를 평균한 뒤 역수를 취합니다. 주변의 밀도가 거의 일정하다는 가정과 매끄러운 자료 생성 조건 등이 필요하며 이웃 수가 바뀌면 편향과 변동도 달라집니다. 이 숫자는 자료와 추정법에 묶인 실험 결과입니다.</p>
<p>이 연구는 별도로 생성 모델이 만든 자료에서 추정법을 점검한 뒤 실제 이미지 자료에도 적용했습니다. ImageNet의 26–43을 생성 모델 실험에만 해당하는 값으로 읽는 것도 틀립니다. 반대로 이 추정치를 모든 이미지의 확정된 자유도나 정확한 복원에 충분한 좌표 수로 읽을 수도 없습니다.</p>
<div id="paper-intrinsic-dimension"><CitationBlock source="Pope et al. · ICLR 2021, §3 식 (2), 표 1" citeKey={3} href={ID}>실제 표의 이웃 수와 추정치를 함께 읽습니다. 이미지 자료의 결과와 추정 도구를 점검한 별도 생성 자료 실험을 구분하며 최적 압축 폭으로 바꾸어 주장하지 않습니다.</CitationBlock></div>
<p>JL은 유한한 점 사이의 거리 보존에 충분한 크기를 n·ε·확률 목표로 구합니다. 내재 차원은 데이터가 놓인 모양의 성질입니다. 낮은 내재 차원이 JL의 전제나 증명의 이유가 아닙니다. 우리 직선은 그 구조를 알면 일반적인 충분조건보다 훨씬 작은 표현을 고를 수 있다는 사례입니다.</p>
</section>
<section id="latent-representation" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 좁은 통로를 만들었다고 중요한 정보가 저절로 남지는 않는다</h2>
<p>모델 안에서 입력을 변환해 얻는 표현을 잠재 표현(latent representation)이라고 부릅니다. 반드시 원래 입력보다 차원이 낮거나 각 좌표의 의미를 사람이 읽을 수 있는 것은 아닙니다. 중간 좌표 수를 제한하는 병목(bottleneck)은 구조적 제약입니다. 낮은 rank의 두 행렬로 표현하는 방법은 낮은 계수 표현(low-rank representation)입니다.</p>
<p>우리 사례에서는 z=2t를 중간의 한 칸으로 쓰고 z를 2로 나누어 네 칸에 복사하는 규칙으로 정확히 되돌릴 수 있습니다. 반면 같은 한 칸을 첫째와 둘째 좌표의 차이로 정하면 모두 0이라 복원에 실패합니다. 좋은 표현이 존재하는 것과 학습 과정이 그 표현을 찾는 것은 다른 주장입니다.</p>
<p>MNIST 입력 784칸을 중간 32칸으로 줄이는 모델을 생각할 수 있습니다(설계 가정). 32가 논문의 MNIST 추정치 7–13보다 크다는 수치 비교만으로 복원 품질이 보장되지는 않습니다. ImageNet의 추정치 26–43과 비교하면 32는 그 범위 안에 있으며 모든 추정값보다 크지도 않습니다. 서로 다른 자료의 수치를 같은 압축 보장으로 묶지 않습니다.</p>
<ProgressiveDetail title="자유도 1인 원도 연속적인 한 칸으로 완전히 펼 수는 없다" preview="국소적인 자유도와 전체 모양을 손실 없이 표현하는 좌표 수는 다를 수 있습니다.">
<p>원의 가로 좌표만 남기면 (0,1)과 (0,−1)이 모두 0이 됩니다. 더 일반적으로 원 전체에서 실수 한 칸으로 가는 연속 함수가 모든 점을 구별한다고 가정해 봅시다. 원은 닫히고 유한한 모양이므로 그 함수에는 최솟값과 최댓값이 있습니다. 두 값을 만드는 점 사이에는 원을 따라 가는 서로 다른 두 호가 있습니다.</p>
<p>연속성 때문에 각 호는 최솟값과 최댓값 사이의 모든 값을 지나야 합니다. 그 사이의 한 값을 고르면 두 호의 서로 다른 점에서 같은 출력이 생겨 가정과 모순입니다. 각도 하나로 적는 방법도 전체 원에서는 어디선가 끊기는 경계를 둡니다. 내재 차원 1이라는 사실만으로 전역적인 연속 무손실 표현 한 칸이 보장되지는 않습니다.</p>
<p>연속적인 데이터 모양보다 좁은 공간에 매끄럽고 정확하게 부호화·복원한다면 합성 함수의 미분이 모든 접선 방향을 보존해야 합니다. 중간 폭이 r이면 그 미분의 rank도 r 이하이므로 더 많은 독립 방향을 모두 보존할 수 없습니다. 다만 관측된 유한 표본에 서로 다른 번호를 붙여 한 실수로 외우는 일은 가능합니다. 유한 목록의 암기와 연속적인 새 입력의 복원을 같은 문제로 취급하지 않습니다.</p>
</ProgressiveDetail>
<p><Link to="/cs/ai/math-matrices-svd#low-rank">SVD의 낮은 계수 근사</Link>는 rank≤r인 표를 두 행렬의 곱으로 적는 한 방법입니다. m×n 숫자를 r(m+n)개로 줄이려면 r(m+n)&lt;mn이어야 실제 저장 이득이 있습니다. 1000×1000에서 r=10이면 백만 개가 2만 개로 줄지만 2×2에서 r=1이면 4개가 여전히 4개입니다. 버린 방향의 작은 복원 오차가 분류에 필요한 차이까지 작다는 뜻도 아닙니다.</p>
</section>
<section id="applications" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 거리를 보존했는지와 과제를 해결했는지를 따로 확인한다</h2>
<p>검색에서는 보존할 거리와 점 집합을 먼저 정하고 실제 쌍의 거리 비, 이웃 순서와 검색 성능을 확인합니다. JL 사영은 원래 거리의 의미를 고쳐 주지 않습니다. 원래 좌표가 과제에 필요한 유사성을 담지 못한다면 그 거리를 정확히 남겨도 좋은 검색이 보장되지 않습니다.</p>
<p>복원 모델에서는 학습에 쓰지 않은 입력의 오차와 실패 사례를 중간 폭별로 비교합니다. 분류가 목적이면 분류 성능도 따로 봅니다. 입력 분포와 좌표의 단위, 무작위 행렬의 배율, 허용 오차와 확률 목표를 기록해야 다른 설정과 비교할 수 있습니다.</p>
<p>네 칸 직선의 여섯 거리가 보존된 것은 직접 계산한 사실입니다. 독립적인 이진 좌표의 상대 표준편차는 분포 가정에서 유도한 사실입니다. JL은 일반적인 충분조건이며 이미지의 내재 차원은 조건이 있는 추정치입니다. 이 근거들의 범위를 나누어 읽으면 차원이 크거나 작다는 말만으로 성능을 단정하지 않게 됩니다.</p>
<ul className="list-disc space-y-3 pl-6"><li>같은 값을 천 칸에 복사하면 거리가 집중된다고 말할 수 있나요? 독립 이진 좌표의 계산과 무엇이 다른가요? (답: 5·7·8절)</li><li>네 점에서 일반 충분 크기가 320인데 실제 한 칸 표현이 성공하면 JL 정리가 틀린 것인가요? 자동 모드는 왜 입력을 거부하나요? (답: 9·11절)</li><li>ImageNet의 추정 내재 차원 26–43만 보고 폭 32의 모델이 완벽히 복원한다고 결론 낼 수 있나요? (답: 12·13절)</li></ul>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={projectionCodeRefs} fileTrees={{"scikit-learn":{name:"scikit-learn",type:"dir",children:[{name:"sklearn/random_projection.py",type:"file",path:"scikit-learn/sklearn/random_projection.py",codeKey:"gaussian"}]}}} projectMetas={{"scikit-learn":{id:"scikit-learn",label:"scikit-learn 1.7.2",badgeClass:"border-border"}}} />
</article>;}
