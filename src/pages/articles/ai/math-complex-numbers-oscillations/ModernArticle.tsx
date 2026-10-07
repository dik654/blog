import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { complexCodeRefs } from "./codeRefs";
import QuarterTurnViz from "./viz/QuarterTurnViz";
export default function ComplexNumbersArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 한 점을 돌리는 일을 두 숫자의 계산으로 바꾼다</h2>
<p className="text-lg leading-8">원점에서 오른쪽으로 3, 위로 4 떨어진 점이 있습니다. 이 점을 원점 주위로 반시계 방향으로 한 바퀴의 1/4만큼 돌리면 어디에 도착할까요? 답은 왼쪽으로 4, 위로 3인 점입니다. 처음과 나중의 두 숫자는 다르지만 원점까지의 길이는 모두 5입니다.</p>
<p>이 글에서는 이 점을 네 번 돌려 처음으로 되돌립니다. 어떤 숫자를 보관해야 하는지, 반복된 이동을 어떻게 계산하는지부터 확인합니다. 나중에는 같은 움직임을 짧은 수식으로 쓰고 실제 Python의 곱셈 코드가 두 숫자를 어떻게 다루는지 따라갑니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>(3,4)를 반시계로 1/4바퀴 돌리면 (−4,3)이 될까요?</li><li>돌린 뒤에도 원점까지의 길이는 5일까요?</li><li>네 번 뒤 (3,4)로 돌아왔다는 사실만으로 그동안 움직이지 않았다고 말할 수 있을까요?</li></ol>
<p>답은 <strong>예, 예, 아니요</strong>입니다. 회전은 현재 좌표와 길이를 남기지만 몇 바퀴를 누적했는지는 좌표만으로 복원하지 못합니다.</p>
<QuarterTurnViz />
<ContentBoundary article="math-complex-numbers-oscillations" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 현재 위치와 돌릴 양을 받아 새 위치를 만든다</h2>
<p>입력은 점의 가로·세로 위치와 이번에 돌릴 양입니다. 출력은 이동한 뒤의 가로·세로 위치입니다. 이 글에서는 두 축의 길이를 같은 단위로 재고 원점을 고정합니다. 점이 원점에서 멀어지거나 가까워지지 않는 이동을 먼저 다룹니다.</p>
<p>이번에는 돌릴 양도 고정합니다. 반시계 방향으로 한 바퀴의 1/4씩 움직입니다. 한 번의 출력에 같은 규칙을 다시 적용하면 두 번 이동한 위치가 됩니다. 매번 출발점으로 돌아가 계산하지 않아도 연속된 움직임을 만들 수 있습니다.</p>
<p>출력에는 지금 어디에 있는지가 남습니다. 지금까지 몇 바퀴 돌았는지는 따로 세어야 합니다. 네 번 움직여 처음 위치와 같아졌다고 해서 아무 이동도 없었다는 뜻은 아닙니다. 이 차이는 회전 센서나 반복 신호의 기록을 읽을 때도 필요합니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · (3,4)를 네 번 돌려 같은 점으로 돌아온다</h2>
<p>출발점을 (3,4)로 정합니다(가정). 이번 이동의 계산 규칙은 가로 자리에 세로의 부호를 바꾼 값을 놓고, 세로 자리에는 이전 가로를 놓는 것입니다. 따라서 (3,4)는 (−4,3)이 됩니다. 순서만 바꾸어 (4,3)으로 만들면 우리가 정한 회전과 다른 위치에 갑니다.</p>
<p>같은 규칙을 (−4,3)에 적용하면 (−3,−4)입니다. 세 번째는 (4,−3), 네 번째는 (3,4)가 됩니다. 두 번 이동하면 원점의 반대편이고 네 번 이동하면 출발점입니다. 이 네 번의 결과를 앞으로 수식과 코드에서도 그대로 사용합니다.</p>
<p>길이도 확인할 수 있습니다. 출발점의 길이는 3²+4²=25의 제곱근인 5입니다. 한 번 이동한 점도 (−4)²+3²=25이므로 길이가 5입니다. 일반적인 (a,b)에 같은 규칙을 적용하면 (−b)²+a²=b²+a²라서 길이를 바꾸지 않습니다.</p>
<p>이 계산에는 두 축의 같은 눈금이 필요합니다. 가로의 1은 미터인데 세로의 1은 밀리미터라면 화면에 적힌 두 숫자를 그대로 바꾸어서는 같은 길이의 회전이 되지 않습니다. 먼저 같은 길이 단위로 고쳐 적어야 합니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 같은 원 위의 점과 두 축의 그림자를 함께 본다</h2>
<p>아래 그림에서 색 점은 현재 위치입니다. 원점에서 색 점까지의 선은 길이 5를 유지합니다. 점에서 가로축과 세로축으로 내린 가는 선을 보면 이번 위치를 두 숫자로 읽을 수 있습니다. 두 축은 같은 배율로 그렸습니다.</p>
<p>가로 숫자만 남기면 출발점 (3,4)와 아래쪽의 (3,−4)를 구별하지 못합니다. 두 점은 오른쪽으로 같은 만큼 떨어졌지만 다음에 움직일 위치는 다릅니다. 세로 숫자까지 함께 남겨야 어느 방향에 있는지를 알 수 있습니다.</p>
<p>반대로 전체 그림을 매번 저장할 필요도 없습니다. 원점과 눈금의 약속이 같으면 두 숫자로 점을 되찾습니다. 이처럼 움직임에 필요한 정보는 남기고 계산하기 쉬운 형태로 적는 것이 뒤에서 쓸 표기의 역할입니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 반복할 수 있는 규칙에 방향과 크기를 함께 남긴다</h2>
<p>한 바퀴의 1/4 회전은 좌표의 순서와 부호만 바꾸면 됩니다. 하지만 더 작은 양을 돌리려면 새 가로와 세로가 모두 원래 두 좌표의 영향을 받습니다. 임의의 각도로 돌릴 수 있는 같은 형식의 계산이 필요합니다.</p>
<p>크기를 바꾸는 일도 함께 생각할 수 있습니다. 먼저 두 좌표를 두 배로 만든 뒤 돌리거나, 돌린 좌표를 두 배로 만들면 같은 결과입니다. 회전한 방향과 원점까지의 크기를 나누어 적으면 이런 여러 동작의 합성을 추적하기 쉽습니다.</p>
<p>같은 출발점으로 두 순서를 계산해 봅시다. 먼저 두 배로 늘리면 (6,8)이고 한 번 돌리면 (−8,6)입니다. 먼저 돌린 (−4,3)을 두 배로 늘려도 (−8,6)입니다. 두 좌표에 같은 배율을 곱했기에 순서를 바꿀 수 있었습니다. 가로만 두 배로 늘리면 먼저 늘린 뒤 돌린 값은 (−4,6), 먼저 돌린 뒤 늘린 값은 (−8,3)으로 달라집니다. 모든 크기 변경이 회전과 순서를 바꿔도 되는 것은 아닙니다.</p>
<p>단, 현재 방향과 누적 이동량은 계속 구분합니다. 같은 방향으로 한 바퀴 더 돌아도 현재 점은 같습니다. 좌표가 같은 두 기록을 합칠 때 이동 횟수가 필요한 문제라면 별도의 횟수 정보를 버리지 않아야 합니다.</p>
<p>되돌리는 규칙도 확인해 봅시다. 새 가로에는 이전 세로를 놓고 새 세로에는 이전 가로의 부호를 바꾼 값을 놓으면 됩니다. (−4,3)에 적용하면 (3,4)로 돌아옵니다. 반시계로 한 번 이동한 뒤 시계로 한 번 이동하면 두 동작이 취소됩니다. 방향의 부호를 정해 두어야 이 역동작을 일관되게 적을 수 있습니다.</p>
<p>원점까지의 길이뿐 아니라 점 사이 거리도 남습니다. 처음 두 위치 (3,4)와 (−4,3)의 차이는 (−7,−1)입니다. 두 점을 한 번씩 더 돌린 위치 (−4,3)과 (−3,−4)의 차이는 (1,−7)입니다. 두 차이의 제곱합은 모두 50이므로 거리는 같습니다. 한 점의 길이를 검사한 뒤 여러 점의 관계까지 확인한 셈입니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 이미 본 좌표와 회전에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["원의 크기와 관계없이 돌린 양을 재기","라디안(radian): 지나간 호의 길이를 반지름으로 나눈 값"],
["길이 1인 원 위의 가로·세로 좌표","코사인(cosine)과 사인(sine): cos θ, sin θ"],
["두 좌표를 한 수로 적고 회전 곱셈을 하기","복소수(complex number): (a,b)를 a+bi로 표시"],
["한 번의 반시계 1/4바퀴 회전을 곱셈으로 적기","허수 단위 i: i²=−1"],
["원점에서의 길이와 현재 방향","크기(magnitude)와 위상(phase): r과 θ"],
["회전 좌표를 지수 형태로 묶기","오일러 공식(Euler formula): e^{iθ}=cos θ+i sin θ"],
].map((row,i)=><tr className="border-t border-border" key={i}>{row.map((cell,j)=><td className="p-3 align-top" key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
<p>수학에서는 허수 단위를 i로 적고 Python 코드에서는 1j로 적습니다. 이름에 ‘허수’가 들어 있어도 두 좌표로 측정 상태를 나타낼 수 있습니다. 어떤 물리량을 두 좌표로 묶을지는 모델의 약속이며 단위와 의미부터 확인합니다.</p>
</section>
<section id="radians" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 지나간 호를 반지름으로 나누어 같은 회전량을 얻는다</h2>
<p>반지름 5인 사례에서 한 바퀴의 길이는 10π입니다. 1/4바퀴의 호 길이는 5π/2이고 반지름 5로 나누면 π/2입니다. 반지름을 바꾸어도 같은 비율로 돌았다면 이 값은 같습니다. 여기서는 반시계를 양수, 시계 방향을 음수로 정합니다.</p>
<ExplainedFormula question="원 크기가 달라도 같은 회전량을 어떻게 재나요?" idea="호 길이와 반지름의 단위를 맞춘 뒤 나누면 크기가 약분됩니다. 한 바퀴의 비율이 2π이므로 반 바퀴는 π, 1/4바퀴는 π/2입니다."
formula={String.raw`\begin{gathered}\theta=s/r\\2\pi\ \mathrm{rad}=360^\circ,\quad\pi\ \mathrm{rad}=180^\circ\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}\begin{gathered}\theta=s/r\\2\pi\ \mathrm{rad}=360^\circ,\quad\pi\ \mathrm{rad}=180^\circ\end{gathered}\\[8pt]\theta=\frac{\underbrace{5\pi/2}_{\text{지나간 호}}}{\underbrace{5}_{\text{반지름}}}=\pi/2\end{gathered}`}
operations={[{expression:"s/r",annotation:["같은 단위의 길이를 나누므로 원의 크기가 사라집니다.","반지름 2에서 호 길이 π이면 역시 π/2 rad, 즉 90°입니다."]}]}
terms={[{symbol:"s",name:"방향을 붙인 호 길이",description:"양의 방향으로 지나간 길이를 양수로 둡니다."},{symbol:"r",name:"반지름",description:"0보다 큰 원의 크기입니다."},{symbol:"θ",name:"라디안 각도",description:"누적 각도는 한 바퀴를 넘어갈 수 있습니다."}]}
assumptions={["두 길이는 같은 단위이며 r>0입니다.","도 단위의 숫자를 라디안 입력에 그대로 넣지 않습니다."]} interpretation="180°를 라디안 함수에 넣으려면 π로 바꿉니다. 숫자 180을 그대로 넣으면 180 rad라는 훨씬 큰 이동량입니다." />
<p>일정한 속도로 초당 3바퀴 도는 경우를 보겠습니다(가정). 초당 반복 횟수인 주파수 f는 3 Hz이고, 초당 각도 변화량인 각주파수 ω는 2πf=6π rad/s입니다. 0.5초 동안 늘어난 각도는 3π rad, 즉 1.5바퀴입니다. 이 값은 현재 방향만 나타내는 각도와 달리 누적 변화량입니다.</p>
</section>
<section id="unit-circle" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 길이를 1로 맞추면 두 좌표가 코사인과 사인이 된다</h2>
<p>사례의 (3,4)를 길이 5로 나누면 (3/5,4/5)입니다. 원점에서 이 점으로 향한 각도를 φ라고 쓰면 cos φ=3/5, sin φ=4/5입니다. 각도를 소수로 계산하지 않아도 두 좌표를 압니다. 한 번 회전한 단위 길이의 점은 (−4/5,3/5)입니다.</p>
<ExplainedFormula question="가로와 세로 좌표가 왜 항상 제곱합 1을 만드나요?" idea="반지름 1인 원의 좌표를 두 함수의 값으로 정했습니다. 원점까지의 제곱거리가 1이라는 조건을 그대로 씁니다."
formula={String.raw`u(\theta)=(\cos\theta,\sin\theta),\qquad\cos^2\theta+\sin^2\theta=1`}
annotatedFormula={String.raw`\begin{gathered}u(\theta)=(\cos\theta,\sin\theta),\qquad\cos^2\theta+\sin^2\theta=1\\[8pt](3/5)^2+(4/5)^2=9/25+16/25=1\end{gathered}`}
operations={[{expression:String.raw`5u(\phi)=(3,4)`,annotation:["방향을 담은 두 좌표에 원래 길이 5를 곱하면 사례의 점으로 돌아옵니다."]}]}
terms={[{symbol:"u(θ)",name:"단위원의 점",description:"길이 1이고 방향이 θ인 좌표 쌍입니다."},{symbol:"cos θ",name:"가로 좌표",description:"오른쪽이면 양수, 왼쪽이면 음수입니다."},{symbol:"sin θ",name:"세로 좌표",description:"위쪽이면 양수, 아래쪽이면 음수입니다."}]}
assumptions={["각도는 양의 가로축에서 반시계로 잰 라디안입니다.","직각삼각형 내부의 예각에만 한정하지 않고 원 전체와 여러 바퀴로 확장합니다."]} interpretation="길이 r인 회전은 r cos θ와 r sin θ로 적습니다. 가로 그림자 하나만으로 원의 위·아래를 항상 구분할 수는 없습니다." />
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">θ</th><th className="p-3">(cos θ, sin θ)</th><th className="p-3">제곱합</th></tr></thead><tbody>{[["0","(1,0)","1"],["π/2","(0,1)","1"],["π","(−1,0)","1"],["3π/2","(0,−1)","1"]].map((row,i)=><tr className="border-t border-border" key={i}>{row.map((cell,j)=><td className="p-3" key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
<p>음의 각도 −π/2는 (0,−1)이고 5π/2는 한 바퀴 더 돈 π/2와 같은 (0,1)입니다. 두 각도의 차이는 3π라서 같은 점이 아닙니다. 방향이 같은 각도끼리는 2π의 정수배만큼 차이 납니다. 몇 바퀴 돌았는지는 현재 점만으로 복원할 수 없습니다.</p>
</section>
<section id="complex-plane" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · i를 곱하면 두 좌표가 (−b,a)로 바뀐다</h2>
<p>좌표 (a,b)를 z=a+bi로 적습니다. 실수부는 a입니다. 허수부는 b입니다. 허수부 자체를 bi와 혼동하지 않습니다. i²=−1을 사용하면 i(a+bi)=ai−b=−b+ai이므로 앞에서 정한 회전 규칙이 그대로 나옵니다. (3+4i)i=−4+3i이며 네 번 곱하면 i⁴=1 때문에 처음 값입니다.</p>
<ExplainedFormula question="두 좌표를 묶어도 길이와 반사를 계산할 수 있나요?" idea="i의 제곱을 −1로 계산하면 켤레와의 곱에서 교차항이 지워져 두 좌표의 제곱합만 남습니다."
formula={String.raw`\begin{gathered}z=a+bi,\quad i^2=-1,\quad\bar z=a-bi\\|z|=\sqrt{a^2+b^2},\qquad z\bar z=|z|^2\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}\begin{gathered}z=a+bi,\quad i^2=-1,\quad\bar z=a-bi\\|z|=\sqrt{a^2+b^2},\qquad z\bar z=|z|^2\end{gathered}\\[8pt](3+4i)(3-4i)=9-16i^2=25,\qquad |3+4i|=5\end{gathered}`}
operations={[{expression:"a-bi",annotation:["세로 좌표의 부호를 바꾸므로 가로축에 대한 반사입니다.","3+4i의 켤레는 3−4i입니다. 모든 점에 같은 각도를 더하는 회전과는 다릅니다."]}]}
terms={[{symbol:"|z|",name:"크기",description:"두 좌표가 정하는 원점까지의 길이입니다."},{symbol:"z̄",name:"켤레",description:"허수부의 부호를 바꾼 복소수입니다."}]}
assumptions={["a,b는 실수이며 두 축의 단위를 맞춥니다.","0의 크기는 0이지만 방향을 유일하게 정할 수는 없습니다."]} interpretation="두 번의 1/4바퀴 회전은 −z이고 켤레는 z̄입니다. 사례에서는 각각 −3−4i와 3−4i로 다른 점입니다." />
<p>일반적인 곱은 (a+bi)(c+di)=(ac−bd)+(ad+bc)i입니다. 두 괄호를 전개하고 i² 항의 부호를 바꾸면 됩니다. 이번에는 c=0, d=1을 넣어 실수부 −4, 허수부 3을 얻었습니다. 13절의 실제 코드도 이 네 곱을 사용합니다.</p>
</section>
<section id="series" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 유한한 합을 늘려 함수 값에 가까이 간다</h2>
<p>회전을 지수 함수로 적기 전에 무한 합의 뜻을 확인합니다. 유한한 개수의 항을 더한 것을 부분합이라 부릅니다. 항을 더할수록 부분합이 어떤 값에 가까워질 때 그 극한을 급수의 값으로 삼습니다. 1+1+1+…의 M개 부분합은 M이므로 유한한 값에 가까워지지 않습니다.</p>
<p>다음 세 급수의 분모에는 팩토리얼이 있습니다. m!은 1부터 m까지 곱한 값이고 0!=1입니다. 분모가 커지는 속도 덕분에 이 급수들은 모든 유한한 복소수 입력에서 수렴합니다. 뒤에서 짝수 항과 홀수 항을 따로 모으려면 항의 절댓값을 더한 급수까지 수렴하는 절대수렴을 확인합니다.</p>
<ExplainedFormula question="지수 함수와 두 좌표 함수를 같은 항들로 비교할 수 있나요?" idea="입력의 거듭제곱을 팩토리얼로 나눈 항을 씁니다. 코사인은 짝수 거듭제곱, 사인은 홀수 거듭제곱만 가지고 부호가 번갈아 바뀝니다."
formula={String.raw`\begin{aligned}e^z&=\sum_{m=0}^{\infty}\frac{z^m}{m!}\\\cos\theta&=\sum_{m=0}^{\infty}\frac{(-1)^m\theta^{2m}}{(2m)!}\\\sin\theta&=\sum_{m=0}^{\infty}\frac{(-1)^m\theta^{2m+1}}{(2m+1)!}\end{aligned}`}
annotatedFormula={String.raw`\begin{gathered}\begin{aligned}e^z&=\sum_{m=0}^{\infty}\frac{z^m}{m!}\\\cos\theta&=\sum_{m=0}^{\infty}\frac{(-1)^m\theta^{2m}}{(2m)!}\\\sin\theta&=\sum_{m=0}^{\infty}\frac{(-1)^m\theta^{2m+1}}{(2m+1)!}\end{aligned}\\[8pt]\begin{aligned}e^z&=1+z+z^2/2!+\cdots\\\cos\theta&=1-\theta^2/2!+\cdots\\\sin\theta&=\theta-\theta^3/3!+\cdots\end{aligned}\end{gathered}`}
operations={[{expression:String.raw`\frac{|z|^{m+1}/(m+1)!}{|z|^m/m!}=\frac{|z|}{m+1}\to0`,annotation:["고정된 z≠0에서 다음 항의 절댓값 비율은 0으로 갑니다.","충분히 뒤에서는 비율이 1보다 작은 일정한 수 아래여서 남은 합이 등비급수로 제한됩니다. z=0은 곧바로 1입니다."]}]}
terms={[{symbol:"m!",name:"팩토리얼",description:"차수가 커질수록 분모의 곱이 길어집니다."},{symbol:"Σ",name:"부분합의 극한",description:"무한히 많은 항을 한 번에 계산하라는 뜻이 아닙니다."}]}
assumptions={["지수 급수의 절대수렴에서 짝수·홀수 부분급수도 수렴합니다.","삼각함수 식의 θ는 라디안입니다. 복소수 θ로도 급수는 수렴하지만 기하학적 평면 회전은 실수 θ로 다룹니다."]} interpretation="단순히 항이 작아진다는 말보다 남은 합을 제한하는 조건이 필요합니다. 이 급수에서는 팩토리얼이 그 조건을 제공합니다." />
<div id="paper-dlmf-series"><CitationBlock source="NIST DLMF · 4.2.19, 4.19.1–2" citeKey={1} href="https://dlmf.nist.gov/4.2.E19">지수 급수와 사인·코사인의 표준 급수를 확인했습니다. 이 글에서는 z=iπ/2를 넣고 짝수 항과 홀수 항을 모아 같은 1/4바퀴 회전으로 연결합니다.</CitationBlock><a className="text-sky-700 underline" href="https://dlmf.nist.gov/4.19">사인·코사인 급수 원문 4.19</a></div>
</section>
<section id="euler-formula" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 같은 급수의 짝수 항과 홀수 항이 회전 좌표가 된다</h2>
<p>지수 급수에 z=iθ를 넣습니다. i의 짝수 거듭제곱은 i²ᵐ=(−1)ᵐ이고 홀수 거듭제곱은 i²ᵐ⁺¹=i(−1)ᵐ입니다. 절대수렴하므로 두 종류의 항을 따로 모아도 합이 같습니다. 짝수 항은 코사인의 급수, 홀수 항은 i를 곱한 사인의 급수입니다. 이 순서로 오일러 공식을 얻습니다.</p>
<ExplainedFormula question="지수에 각도를 넣으면 왜 회전한 점이 나오나요?" idea="지수 급수의 실수 항과 허수 항이 단위원의 가로와 세로 좌표입니다. 두 좌표에 길이 r을 곱하면 원하는 반지름의 점이 됩니다."
formula={String.raw`e^{i\theta}=\cos\theta+i\sin\theta,\qquad re^{i\theta}=r\cos\theta+ir\sin\theta`}
annotatedFormula={String.raw`\begin{gathered}e^{i\theta}=\cos\theta+i\sin\theta,\qquad re^{i\theta}=r\cos\theta+ir\sin\theta\\[8pt]e^{i\pi/2}=0+i=i,\qquad(3+4i)e^{i\pi/2}=-4+3i\end{gathered}`}
operations={[{expression:String.raw`|e^{i\theta}|^2=\cos^2\theta+\sin^2\theta=1`,annotation:["실수 각도 θ일 때 회전 배율의 길이는 1입니다.","따라서 사례의 길이 5는 그대로 남습니다."]}]}
terms={[{symbol:"r",name:"크기 배율",description:"0 이상이며 사례에서는 5입니다."},{symbol:"θ",name:"위상",description:"0이 아닌 점의 방향이며 2π 차이까지 같은 방향입니다."}]}
assumptions={["평면 회전으로 해석할 때 θ는 실수 라디안입니다.","0에서는 어느 각도를 넣어도 r=0 때문에 같은 점이라 위상이 유일하지 않습니다."]} interpretation="180°는 π rad이므로 e^{iπ}=−1입니다. e^{i180}에 숫자 180을 그대로 넣으면 약 −0.59846−0.80115i이며 −1이 아닙니다." />
<p>NIST DLMF 4.2.24는 실수 x,y에 대해 exp(x+iy)를 exp(x)(cos y+i sin y)로 씁니다. 원문의 x=0, y=π/2를 넣으면 i입니다. 여기의 지수 실수부 x=0은 출발점의 가로 좌표 3과 다른 역할입니다. 얻은 i를 3+4i에 곱해야 이동한 점 −4+3i가 나옵니다.</p>
<div id="paper-dlmf-euler"><CitationBlock source="NIST DLMF · 4.2.24" citeKey={2} href="https://dlmf.nist.gov/4.2.E24">복소 지수의 실수부·허수부를 분리한 원문 식에 0+iπ/2를 대입했습니다. 원문 식의 입력과 회전시킬 점의 좌표를 구분합니다.</CitationBlock></div>
<ExplainedFormula question="두 회전을 곱하면 길이와 방향은 어떻게 합쳐지나요?" idea="각 좌표의 곱을 전개한 뒤 삼각함수의 덧셈식을 쓰면 크기는 곱해지고 각도는 더해집니다."
formula={String.raw`(r_1e^{i\theta_1})(r_2e^{i\theta_2})=r_1r_2e^{i(\theta_1+\theta_2)}`}
annotatedFormula={String.raw`\begin{gathered}(r_1e^{i\theta_1})(r_2e^{i\theta_2})=r_1r_2e^{i(\theta_1+\theta_2)}\\[8pt](2e^{i\pi/3})(3e^{-i\pi/6})=6e^{i\pi/6}=3\sqrt3+3i\end{gathered}`}
operations={[{expression:"r_1r_2",annotation:["크기 2와 3을 곱해 6입니다."]},{expression:String.raw`\theta_1+\theta_2`,annotation:["각도 π/3과 −π/6을 더해 π/6입니다. 2π의 정수배 차이는 같은 방향입니다."]}]}
terms={[{symbol:"r₁,r₂",name:"두 크기",description:"회전과 함께 적용할 길이 배율입니다."},{symbol:"θ₁,θ₂",name:"두 각도",description:"같은 양의 방향과 라디안 단위를 사용합니다."}]}
assumptions={["r₁,r₂는 0 이상이며 방향을 따로 읽을 때는 0이 아닌 값입니다."]} interpretation="사례에서는 3+4i=5e^{iφ}에 1e^{iπ/2}를 곱합니다. 길이 5는 유지되고 방향 φ에 π/2를 더합니다." />
<p>OpenStax의 ‘극형식 복소수의 곱’ 정리는 크기를 곱하고 각도를 더하는 이 규칙을 제시합니다. 같은 사례의 r₁=5, r₂=1과 각도 φ, π/2를 대입하면 결과는 5 exp(i(φ+π/2))입니다. 단위원의 좌표가 (3/5,4/5)에서 (−4/5,3/5)로 바뀌므로 다시 길이 5를 곱해 (−4,3)을 얻습니다.</p>
<div id="paper-openstax-polar"><CitationBlock source="OpenStax Precalculus 2e · 8.5 Products of Complex Numbers in Polar Form" citeKey={3} href="https://openstax.org/books/precalculus-2e/pages/8-5-polar-form-of-complex-numbers">원문의 크기·각도 곱셈 규칙을 이 글의 출발점과 한 번의 회전에 적용했습니다. 특정 언어의 저장 방식은 다음 코드 절에서 따로 확인합니다.</CitationBlock></div>
<ProgressiveDetail title="몇 항만 더하면 정확한 회전이 되나요?" preview="π/2를 대입한 4차·8차 부분합의 오차를 남은 항의 상한과 비교합니다.">
<p>t=π/2이고 Sₘ을 0차부터 M차까지 더한 지수 급수의 부분합으로 둡니다. M=4이면 약 0.019969+0.924832i로, 정확한 i까지의 거리는 약 0.077775입니다. M=8이면 약 0.0000247373+0.9998431014i이고 거리는 약 0.000158837입니다. 유한한 합의 길이는 정확히 1이라고 보장되지 않습니다.</p>
<p>첫 번째 생략 항의 절댓값은 tᴹ⁺¹/(M+1)!입니다. 그 뒤 항들의 비율은 t/(M+2) 이하이므로 M+2&gt;t이면 남은 합의 절댓값은 이 첫 항을 1−t/(M+2)로 나눈 값 이하입니다. M=4와 8에서 상한은 각각 약 0.107955와 0.000190340으로 실제 오차보다 큽니다. 길이 5인 출발점에 곱한 위치 오차는 이 상한의 5배 이하입니다.</p>
</ProgressiveDetail>
</section>
<section id="roots-of-unity" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 네 방향을 반복해서 곱하면 정해진 회전을 골라낼 수 있다</h2>
<p>한 바퀴를 N등분한 방향들을 1의 N제곱근이라고 합니다. N번 곱하면 1로 돌아오기 때문입니다. 여기서는 이후 합에서 회전을 되감기 위해 음의 각도 방향을 택합니다. N=4의 한 칸은 −i이고 거듭제곱은 1, −i, −1, i입니다. 출발점이 반시계로 도는 규칙 i와 되감는 규칙 −i의 방향을 구별합니다.</p>
<ExplainedFormula question="한 칸 회전을 반복한 N개 방향을 어떻게 적나요?" idea="각도 −2π/N을 n번 더해 n번째 방향을 얻습니다. N번 더하면 −2π여서 처음 방향입니다."
formula={String.raw`\omega_N=e^{-i2\pi/N},\qquad\omega_N^{kn}=e^{-i2\pi kn/N},\qquad\omega_N^N=1`}
annotatedFormula={String.raw`\begin{gathered}\omega_N=e^{-i2\pi/N},\qquad\omega_N^{kn}=e^{-i2\pi kn/N},\qquad\omega_N^N=1\\[8pt]\omega_4=-i,\qquad(\omega_4^0,\omega_4^1,\omega_4^2,\omega_4^3)=(1,-i,-1,i)\end{gathered}`}
operations={[{expression:String.raw`\omega_N^{k+N/2}=-\omega_N^k`,annotation:["N이 짝수이면 N/2칸 더 돈 방향은 반대 부호입니다.","N=4에서는 1과 −1, −i와 i가 짝입니다. FFT에서 같은 중간값을 더하고 빼는 재사용으로 이어집니다."]}]}
terms={[{symbol:"N",name:"한 바퀴의 칸 수",description:"양의 정수입니다. 본문 사례는 4입니다."},{symbol:"ωN",name:"시계 방향 한 칸",description:"푸리에 변환의 부호 약속을 여기서 고정합니다."},{symbol:"kn",name:"누적 칸 수",description:"k칸씩 n번 이동한 양입니다."}]}
assumptions={["k,n은 정수입니다. 반 바퀴 관계에는 짝수 N이 필요합니다.","다른 문서가 반대 부호를 쓰면 역변환까지 일관되게 바꿔야 합니다."]} interpretation="k에 N을 더하면 같은 방향들이 나옵니다. 네 표본만으로 k=0과 k=4의 회전을 구분할 수 없는 이유입니다." />
<p>서로 다른 정수 회전끼리 합이 지워지는 조건도 확인합니다. q를 ω_N의 k제곱으로 놓습니다. k가 N의 배수가 아니면 q≠1이면서 qᴺ=1입니다. 따라서 1+q+…+qᴺ⁻¹=(1−qᴺ)/(1−q)=0입니다. k가 N의 배수이면 모든 항이 1이어서 합은 N입니다. 서로 다른 두 정수 회전의 비교에는 두 번호의 차이를 k에 넣습니다.</p>
<p>아무 주파수나 서로 지워지는 것은 아닙니다. 네 표본에서 각도를 π/4씩 늘린 값들의 합은 1+i(1+√2)로 0이 아닙니다. 정수 칸에 맞지 않은 회전은 방금 쓴 qᴺ=1 조건을 만족하지 않습니다. 이 경계를 무시하면 짧은 신호의 성분을 읽을 때 잘못된 결론을 냅니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 실제 Python 코드는 두 실수의 네 곱을 계산한다</h2>
<p>코드 패널에는 CPython v3.9.6의 고정 revision db3ff76에 있는 전체 파일을 넣었습니다. Include/complexobject.h의 Py_complex는 double real과 double imag라는 두 필드를 가집니다. 사례의 3+4j는 이 계산용 구조에서 각각 3과 4입니다. Python 객체의 모든 내부 필드가 이 둘뿐이라는 뜻은 아닙니다.</p>
<CodeViewButton label="원본 두 좌표 구조 · complexobject.h" onClick={()=>sidebar.open("storage",complexCodeRefs.storage)} />
<p>Objects/complexobject.c의 complex_mul은 입력을 계산용 두 좌표로 바꾼 뒤 _Py_c_prod를 부릅니다. 이 함수의 54행은 a.real×b.real−a.imag×b.imag, 55행은 a.real×b.imag+a.imag×b.real을 계산합니다. a=(3,4), b=(0,1)을 넣으면 −4와 3이 나옵니다. 수학에서 전개한 ac−bd, ad+bc와 같은 순서입니다.</p>
<CodeViewButton label="원본 곱셈 호출 경로 · 485–493행" onClick={()=>sidebar.open("dispatch",complexCodeRefs.dispatch)} />
<CodeViewButton label="원본 네 곱과 합·차 · 50–56행" onClick={()=>sidebar.open("multiply",complexCodeRefs.multiply)} />
<p>아래 재현 예제는 이 글에서 작성해 macOS arm64의 Python 3.9.6으로 실제 실행했습니다. (3+4j)*1j는 −4+3j이고 네 번의 곱은 3+4j로 돌아옵니다. 이 사례의 작은 정수와 0, 1은 해당 저장 형식에서 정확히 표현되므로 이 계산에서는 눈에 보이는 오차가 없습니다.</p>
<CodeViewButton label="실행한 회전·급수·DFT 재현 예제" onClick={()=>sidebar.open("example",complexCodeRefs.example)} />
<p>반면 cmath.exp(1j*math.pi/2)는 이 실행 환경에서 약 6.12323×10⁻¹⁷+1j입니다. 이를 출발점에 곱한 값은 −4+3.0000000000000004j입니다. 수학적 i와 부동소수점 근삿값을 구별해야 합니다. _Py_c_prod 원문은 복소 곱셈을 보여 주며 cmath.exp가 지수를 근사하는 내부 알고리즘은 별도의 경로입니다.</p>
<p>Python의 cmath 문서는 위상을 라디안으로 읽고 phase의 반환 구간을 [−π,π]로 정합니다. 이번 환경의 phase(0j)는 0.0을 반환하지만 수학적으로 0의 방향이 유일하다는 뜻은 아닙니다. API가 정한 반환값과 모델에서 정의할 수 있는 방향을 구분합니다.</p>
<div id="paper-cpython-complex"><CitationBlock source="CPython v3.9.6 · Objects/complexobject.c, Include/complexobject.h" citeKey={4} href="https://github.com/python/cpython/blob/db3ff76da19004f266b62e98a81bdfd322861436/Objects/complexobject.c">원본 파일 전체와 라이선스·해시를 보관했습니다. 두 좌표의 저장, 곱셈 호출, 네 곱을 같은 (3,4) 사례로 대조했습니다.</CitationBlock><a className="text-sky-700 underline" href="https://docs.python.org/3.9/library/cmath.html">Python 3.9 계열의 cmath API 설명</a></div>
</section>
<section id="applications" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 같은 네 점에서 회전 성분을 더하고 배율을 확인한다</h2>
<p>네 점을 순서대로 zₙ=(3+4i)iⁿ, n=0,1,2,3으로 적습니다. 이산 푸리에 변환(DFT)은 각 정수 회전을 되감는 값을 곱해 더합니다. 여기서는 합을 N으로 나누지 않는 약속으로 Xₖ=Σₙ zₙ(−i)ᵏⁿ을 사용합니다. k는 네 회전 성분의 번호입니다.</p>
<p>k=1이면 iⁿ(−i)ⁿ=1이라서 네 항이 모두 3+4i로 돌아옵니다. 따라서 X₁=12+16i입니다. k=0,2,3에서는 앞 절의 네 방향 합이 지워져 0입니다. 같은 좌표 기록에서 어느 회전이 얼마나 있었는지를 골라낸 결과입니다.</p>
<p>계수 X₁의 크기는 20입니다. 출발점의 반지름 5와 바로 같지는 않습니다. 네 항을 더한 변환이므로 20을 N=4로 나누어야 이 복소 회전의 크기 5가 나옵니다. 계수의 크기를 언제나 원신호의 진폭이라고 부르면 변환의 배율을 놓칩니다.</p>
<p>가로만 기록한 실수 신호는 3, −4, −3, 4입니다. 같은 변환을 적용하면 X₁=6+8i와 X₃=6−8i라는 두 성분으로 나뉩니다. 각각의 크기는 10이고 이 경우 실수 코사인 신호의 진폭은 2×10/4=5입니다. 0번 성분이나 짝수 표본 수의 정중앙 성분은 이런 두 개의 서로 다른 짝이 없으므로 같은 2배 규칙을 그대로 쓰지 않습니다.</p>
<p>이 계산은 한 바퀴를 정확히 네 등분한 표본과 위의 변환 배율에 묶입니다. 관측 길이에 맞지 않는 회전이나 창 함수를 쓴 신호에는 추가 조건이 필요합니다. <Link className="text-sky-700 underline" to="/cs/ai/fft">FFT 글</Link>에서 변환 계산의 재사용과 신호 해석을 이어 볼 수 있습니다. 여기서는 같은 네 점을 수식과 실제 예제 코드 양쪽에서 계산했습니다.</p>
</section>
<section id="limits" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">15 · 방향, 누적 회전, 수치 근사와 계수 배율을 구분한다</h2>
<p>사례의 출발점 (3,4)는 i를 한 번 곱하면 (−4,3)으로 이동합니다. 두 좌표를 함께 바꾸면서 길이 5를 유지합니다. 오일러 공식은 같은 동작을 exp(iπ/2)로 쓰게 해 주고 실제 곱셈 코드는 두 실수의 네 곱으로 계산합니다.</p>
<p>현재 방향은 누적 회전 횟수를 보관하지 않습니다. 0은 방향을 정하지 못하고 유한한 급수나 부동소수점 계산은 정확한 수학 값과 다를 수 있습니다. 회전 성분을 합해 얻은 계수의 크기도 정규화와 실수·복소수 신호의 구분을 거쳐 원래 크기로 읽습니다.</p>
<ul className="list-disc space-y-3 pl-6"><li>같은 점에 i를 두 번 곱한 결과와 켤레를 취한 결과는 각각 무엇이며 왜 다른가요? (답: 9절)</li><li>급수의 항을 네 차수까지만 더한 값을 정확한 i처럼 사용하면 어떤 오차가 생기며, 짝수·홀수 항을 모으는 데 필요한 조건은 무엇인가요? (답: 10·11절)</li><li>네 점의 복소 DFT에서 크기 20인 계수와 가로 기록의 크기 10인 계수로부터 원래 크기 5를 각각 어떻게 구하나요? (답: 14절)</li></ul>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={complexCodeRefs} fileTrees={{cpython:{name:"cpython",type:"dir",children:[{name:"Objects/complexobject.c",type:"file",path:"cpython/Objects/complexobject.c",codeKey:"multiply"},{name:"Include/complexobject.h",type:"file",path:"cpython/Include/complexobject.h",codeKey:"storage"}]}}} projectMetas={{cpython:{id:"cpython",label:"CPython v3.9.6",badgeClass:"border-border"}}}/>
</article>;}
