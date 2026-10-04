import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation-block";
import VectorMeasurementViz from "./viz/VectorMeasurementViz";
const OPENSTAX="https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product";
const NORMALIZE="https://docs.pytorch.org/docs/2.8/generated/torch.nn.functional.normalize.html";
const COSINE="https://docs.pytorch.org/docs/2.8/generated/torch.nn.functional.cosine_similarity.html";
const CORNELL="https://www.cs.cornell.edu/courses/cs4780/2023sp/lectures/lecturenote03.html";
export default function VectorsInnerProductsArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 여러 숫자로 적은 이동에서 길이와 방향을 따로 읽는다</h2>
<p className="text-lg leading-8">오른쪽으로 3, 위로 4만큼 떨어진 점을 생각해 봅시다. 도착점을 기록하려면 두 숫자가 필요하지만 출발점에서 곧장 가는 거리는 5라는 한 숫자로 충분합니다. 가로 방향으로 얼마나 갔는지만 묻는다면 답은 3입니다. 같은 이동도 무엇을 물었는지에 따라 다른 숫자로 요약됩니다.</p>
<p>AI도 한 대상을 여러 숫자로 나타낸 뒤 크기나 방향을 비교합니다. 다만 숫자를 줄이는 계산마다 남기는 정보와 버리는 정보가 다릅니다. 여기서는 한 이동을 계속 따라가며 전체 길이, 다른 방향과의 관계, 한 방향에 남는 부분을 차례로 계산합니다. 뒤에서는 같은 계산이 교재의 식과 실제 함수의 분모에 어떻게 들어가는지 확인합니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 좌표 두 개를 넣고 질문에 맞는 값을 받는다</h2>
<p>입력은 같은 단위로 잰 가로·세로 이동량입니다. 순서를 가로부터 적겠다고 정하면 (3,4)는 오른쪽 3, 위쪽 4입니다(가정). 먼저 이 순서를 고정해야 합니다. (4,3)도 같은 두 숫자를 담고 있지만 도착하는 곳은 다릅니다.</p>
<div className="grid gap-5 md:grid-cols-3"><div className="border-t border-border pt-3"><h3 className="font-bold">입력</h3><p className="mt-2">이동 (3,4)와 비교할 가로 방향을 줍니다.</p></div><div className="border-t border-border pt-3"><h3 className="font-bold">계산</h3><p className="mt-2">전체 거리를 재거나 가로 방향에 해당하는 부분을 고릅니다.</p></div><div className="border-t border-primary pt-3"><h3 className="font-bold">출력</h3><p className="mt-2">전체 길이는 5, 가로로 남는 이동은 (3,0)입니다.</p></div></div>
<p>5와 (3,0)은 서로 바꿔 쓸 수 없습니다. 5만으로는 어느 쪽으로 움직였는지 알 수 없고 (3,0)만으로는 위로 간 양을 알 수 없습니다. 계산에 앞서 출력이 답해야 할 질문부터 정해야 하는 이유입니다.</p>
</section>
<section id="case" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 3²+4²로 길이 5를 구하고 가로 이동 3을 떼어 낸다</h2>
<p>가로 3과 세로 4는 서로 직각입니다. 두 이동을 한 직선으로 이으면 그 길이의 제곱은 3²+4²=25이고 길이는 √25=5입니다. 가로와 세로를 차례로 걸은 거리 3+4=7과 출발점에서 곧장 간 거리 5는 다른 경로를 잰 값입니다.</p>
<p>전체 이동을 가로 부분과 나머지로 나누면 (3,4)=(3,0)+(0,4)입니다. 두 부분을 더하면 원래 이동이 복원됩니다. 가로 부분만 보관하면 세로의 4는 사라지므로 이 계산은 원래 정보를 모두 보존하지 않습니다.</p>
<p>방향을 반대로 돌린 (−3,−4)도 길이는 5입니다. 길이를 구할 때 제곱한 덕분에 음수 이동을 더할 수 있지만 어느 쪽으로 갔는지는 최종 답에서 사라집니다. 반대로 모든 이동량을 두 배로 하면 (6,8)이 되고 길이도 10으로 늘어납니다. 방향을 돌리는 변화와 크기만 늘리는 변화를 구별해 두겠습니다.</p>
</section>
<section id="picture" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 한 화살표에서 전체 길이와 가로 부분을 함께 본다</h2>
<VectorMeasurementViz/>
<p>그림의 두 축은 한 칸의 길이가 같습니다. 그래서 3과 4로 만든 직각삼각형의 빗변을 길이 5로 읽을 수 있습니다. 두 축을 서로 다른 비율로 늘려 그리면 숫자는 같아도 화면에서 보이는 각도와 길이는 달라집니다.</p>
<p>가로 기준을 (1,0) 대신 (2,0)으로 적어도 기준선 자체는 바뀌지 않습니다. 그러므로 같은 (3,4)에서 떼어 낸 가로 부분은 여전히 (3,0)이어야 합니다. 나중에 등장할 나눗셈은 이렇게 기준 화살표의 길이에 따라 결과가 달라지는 일을 막아 줍니다.</p>
</section>
<section id="need" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 크기를 비교할지 방향을 비교할지 먼저 정한다</h2>
<p>물건 두 개를 여러 숫자로 나타냈다고 합시다. 모든 숫자가 두 배가 된 대상은 더 큰 양을 뜻할 수도 있고 같은 특성을 더 강하게 나타낸 것일 수도 있습니다. 단순히 곱해서 더한 값이 커졌다는 이유만으로 두 대상의 의미가 더 비슷해졌다고 결론 낼 수는 없습니다.</p>
<p>비교하려는 것이 방향이라면 전체 크기의 영향을 나누어 없애야 합니다. 반대로 크기 자체가 필요한 정보라면 그 나눗셈이 정보를 지울 수 있습니다. 같은 숫자 묶음이라도 학습에 사용한 기준과 각 숫자의 의미를 알아야 비교 결과를 해석할 수 있습니다.</p>
<p>좌표의 단위도 중요합니다. 가로·세로를 모두 미터로 잰 경우와 키·몸무게·나이를 묶은 경우는 다릅니다. 센티미터와 킬로그램을 제곱해 더한 숫자를 곧바로 물리적 길이라고 부를 수는 없습니다. 단위를 바꾸거나 각 항목을 어느 비율로 비교할지 정하는 일이 계산식보다 먼저입니다.</p>
</section>
<section id="vectors" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 숫자 하나는 스칼라, 순서 있는 좌표 묶음은 벡터다</h2>
<p>온도 20이나 학습률 0.01처럼 숫자 하나로 나타내는 양을 <strong>스칼라(scalar)</strong>라고 합니다. 여러 좌표를 정해진 순서로 묶어 함께 계산하는 대상을 <strong>벡터(vector)</strong>라고 합니다. 좌표의 수가 <strong>차원(dimension)</strong>입니다. (키, 몸무게, 나이)는 3차원이고 768개의 수로 표현한 문서도 768차원 벡터입니다. 숫자가 많아져도 순서와 의미를 보존해야 한다는 조건은 같습니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">앞에서 한 계산</th><th className="p-2">이름</th><th className="p-2">결과</th></tr></thead><tbody>{[["전체 길이를 잽니다.","노름(norm)","길이 5"],["대응 좌표를 곱해 더합니다.","내적(dot product)","숫자 하나"],["기준선에 평행한 부분만 남깁니다.","투영(projection)","이동 (3,0)"]].map((row,index)=><tr key={index} className="border-t border-border">{row.map((cell,column)=><td key={column} className="p-2">{cell}</td>)}</tr>)}</tbody></table></div>
<ExplainedFormula
        question="벡터를 더하거나 스칼라 배율로 늘리면 각 좌표는 어떻게 바뀔까요?"
        idea={<>같은 위치의 좌표끼리 더합니다. 양수인 스칼라 배율을 모든 좌표에 곱하면 방향을 유지하면서 크기를 바꿀 수 있습니다.</>}
        formula={String.raw`x=(3,4),\quad y=(-1,2)\qquad\Longrightarrow\qquad x+y=(2,6),\quad 2x=(6,8)`}
        annotatedFormula={String.raw`x+y=(\underbrace{3+(-1)}_{2},\underbrace{4+2}_{6}),\quad2x=(6,8)`}
        operations={[{ expression: String.raw`3+(-1)=2,\quad4+2=6`, annotation: ["가로끼리, 세로끼리 더해 (2,6)을 얻습니다."] },{ expression: String.raw`2(3,4)=(6,8)`, annotation: ["각 좌표에 같은 배율 2를 곱합니다."] }]}
        terms={[
          { symbol: "x,y", name: "2차원 벡터", description: "각각 두 개의 대응하는 좌표를 가진 대상입니다." },
          { symbol: "2", name: "스칼라", description: "방향은 유지하면서 벡터의 모든 성분과 길이를 두 배로 만듭니다." },
          { symbol: "x+y", name: "벡터의 덧셈", description: "첫 좌표끼리, 둘째 좌표끼리 더한 새 벡터입니다." },
        ]}
        assumptions={["두 벡터의 차원과 각 좌표의 의미가 같아야 합니다.", "좌표의 단위가 다르면 크기 보정이나 단위 변환 없이 크기를 비교하지 않습니다."]}
        interpretation="벡터 연산은 좌표별 계산이지만 결과는 다시 방향과 크기를 가진 하나의 대상입니다. 차원이 같다는 사실만으로 두 표현의 의미까지 같아지는 것은 아닙니다."
      />
</section>
<section id="norm" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 노름은 전체 크기를, 차이의 노름은 두 점 사이 거리를 잰다</h2>
<p>앞에서 쓴 √(3²+4²)를 좌표가 더 많은 경우로 확장한 것이 유클리드 노름, 또는 L2 노름입니다. 아래첨자 2는 제곱합의 제곱근을 쓴다는 표시입니다. 다른 종류의 노름도 있으므로 여기서 길이라고 할 때는 이 규칙을 사용하겠습니다.</p>
<ExplainedFormula
        question="벡터 x=(3,4)의 원점으로부터 길이는 얼마일까요?"
        idea={<>서로 직각인 좌표의 이동량을 제곱해 더한 뒤 제곱근을 취합니다. 제곱은 음수 좌표도 양수로 바꾸고 제곱근은 길이의 단위를 되찾습니다.</>}
        formula={String.raw`\lVert x\rVert_2=\sqrt{\sum_{j=1}^{d}x_j^2}\qquad\Longrightarrow\qquad \lVert(3,4)\rVert_2=\sqrt{3^2+4^2}=5`}
        annotatedFormula={String.raw`\lVert(3,4)\rVert_2=\sqrt{\underbrace{9+16}_{25}}=5`}
        operations={[{ expression: String.raw`3^2+4^2=25`, annotation: ["두 직각 방향의 제곱 기여를 더합니다."] },{ expression: String.raw`\sqrt{25}=5`, annotation: ["제곱된 길이를 원래 길이로 바꿉니다."] }]}
        terms={[
          { symbol: "x_j", name: "j번째 좌표", description: "벡터를 이루는 한 방향의 부호 있는 값입니다." },
          { symbol: "d", name: "차원", description: "벡터에 들어 있는 좌표 수입니다." },
          { symbol: String.raw`\lVert x\rVert_2`, name: "L2 노름", description: "원점에서 x까지의 음수가 아닌 유클리드 길이입니다." },
        ]}
        assumptions={["좌표축이 서로 직교하고 같은 배율로 측정된 유클리드 공간을 사용합니다.", "노름에는 L1·L∞ 등 여러 종류가 있으므로 아래첨자 2를 생략했을 때 문맥을 확인합니다."]}
        interpretation="노름은 벡터의 전체 크기를 한 값으로 줄이지만 방향 정보는 없앱니다. (3,4)와 (−3,−4)는 방향은 반대여도 L2 노름은 모두 5입니다."
      />
<p>두 점 p=(1,2), q=(4,6) 사이의 거리는 먼저 차이 q−p=(3,4)를 구해 계산합니다. 따라서 거리는 ‖q−p‖=5입니다. 반대 순서 p−q=(−3,−4)를 써도 거리는 같습니다. 입력의 노름이 R 이하라는 조건은 모든 입력이 원점에서 거리 R 안에 있다는 뜻입니다.</p>
</section>
<section id="dot-product" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 내적에는 두 벡터의 길이와 방향이 함께 들어간다</h2>
<p>u=(3,4)와 v=(4,−3)을 비교해 봅시다. 첫 좌표의 곱은 12, 둘째 좌표의 곱은 −12입니다. 이를 더하면 0입니다. 이렇게 같은 위치의 좌표를 곱해 모두 더하는 계산이 내적입니다.</p>
<ExplainedFormula
        question="u=(3,4)와 v=(4,−3)은 왜 내적이 0일까요?"
        idea={<>같은 좌표끼리의 기여를 더하면 첫 축의 +12와 둘째 축의 −12가 정확히 상쇄됩니다. 두 벡터가 직각이라 서로의 방향 성분이 0이라는 뜻입니다.</>}
        formula={String.raw`u\cdot v=\sum_{j=1}^{d}u_jv_j=3\times4+4\times(-3)=0=\lVert u\rVert\lVert v\rVert\cos 90^\circ`}
        annotatedFormula={String.raw`u\cdot v=\underbrace{12}_{\text{첫 축}}+\underbrace{(-12)}_{\text{둘째 축}}=0`}
        operations={[{ expression: String.raw`3\cdot4=12`, annotation: ["첫 축에서 양수 12가 기여합니다."] },{ expression: String.raw`4\cdot(-3)=-12`, annotation: ["둘째 축에서 음수 12가 기여해 합은 0입니다."] }]}
        terms={[
          { symbol: "u_jv_j", name: "좌표별 기여", description: "같은 축에서 두 벡터가 같은 부호면 양수, 반대 부호면 음수입니다." },
          { symbol: String.raw`u\cdot v`, name: "내적", description: "모든 좌표 기여를 합친 스칼라입니다." },
          { symbol: String.raw`\cos\theta`, name: "방향의 일치", description: "두 길이의 영향을 제거했을 때 남는 −1부터 1 사이의 방향 관계입니다." },
        ]}
        assumptions={["두 벡터가 같은 차원과 좌표계를 사용합니다.", "각도 식은 유클리드 내적 공간에서 0이 아닌 벡터에 사용합니다."]}
        interpretation="내적 0은 이 좌표계에서 두 방향이 서로 직각이라는 뜻입니다. 두 벡터 중 하나가 0 벡터인 경우에는 각도를 정의할 수 없으므로 '90도'라고 해석하지 않습니다."
      />
<p>길이의 영향을 제거한 값이 <strong>코사인 유사도(cosine similarity)</strong>입니다. 두 벡터가 모두 0이 아닐 때 내적을 두 노름의 곱으로 나눕니다. a=(2,0), b=(5,0), c=(−3,0)이라면 a·b=10, a·c=−6이고 길이는 각각 2, 5, 3입니다. 따라서 코사인 값은 10/(2×5)=1과 −6/(2×3)=−1입니다.</p>
<p>길이가 100인 벡터와 길이가 1인 같은 방향 벡터의 내적은 100입니다. 길이를 더 늘리면 내적도 커지지만 방향의 일치는 이미 최대입니다. 내적이 크다는 사실을 곧바로 의미가 더 비슷하다는 말로 바꾸면 안 됩니다. 학습된 표현에서 노름 자체가 정보를 담는다면 길이를 나누는 과정도 신중히 선택해야 합니다.</p>
</section>
<section id="projection" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 기준 길이를 보정해야 같은 방향에 같은 투영이 나온다</h2>
<p>u=(3,4)에서 가로 부분을 떼어 냅시다. 기준 v=(1,0)과 내적을 구하면 3입니다. 이를 v에 곱하면 (3,0)이 되고 남은 u−(3,0)=(0,4)는 가로 기준과 내적이 0입니다. 이처럼 기준과 평행한 부분을 남기는 계산이 투영입니다.</p>
<ExplainedFormula
        question="u=(3,4)를 x축 방향 v=(1,0)에 투영하면 무엇이 남을까요?"
        idea={<>u가 v 방향으로 가진 양을 내적으로 재고 길이가 1이 아닌 v에도 쓸 수 있도록 v·v로 나눕니다. 그 배율을 v에 곱하면 기준 방향과 평행한 벡터가 됩니다.</>}
        formula={String.raw`\operatorname{proj}_{v}(u)=\frac{u\cdot v}{v\cdot v}v\qquad\Longrightarrow\qquad \operatorname{proj}_{(1,0)}(3,4)=\frac{3}{1}(1,0)=(3,0)`}
        annotatedFormula={String.raw`\operatorname{proj}_v(u)=\frac{\underbrace{u\cdot v}_{\text{대응 좌표의 곱합}}}{\underbrace{v\cdot v}_{\text{기준 길이의 제곱}}}v`}
        operations={[{ expression: String.raw`(u-cv)\cdot v=0`, annotation: ["남은 성분이 기준에 수직이어야 합니다."] },{ expression: String.raw`c=(u\cdot v)/(v\cdot v)`, annotation: ["이를 풀면 기준에 곱할 배율이 나옵니다."] }]}
        terms={[
          { symbol: String.raw`u\cdot v`, name: "부호 있는 방향의 겹침", description: "u가 v 방향을 얼마나 포함하는지 길이와 방향을 함께 측정합니다." },
          { symbol: String.raw`v\cdot v`, name: "기준 길이의 제곱", description: "v의 배율을 두 번 세지 않도록 나누는 크기 보정 항입니다." },
          { symbol: String.raw`\operatorname{proj}_v(u)`, name: "평행 성분", description: "u에서 v와 평행한 성분만 남긴 벡터입니다." },
        ]}
        assumptions={["기준 벡터 v는 0 벡터가 아니어야 합니다.", "수직 성분은 u−projᵥ(u)로 남으며 투영 하나가 원래 벡터 전체를 보존하지는 않습니다.", ]}
        interpretation="u=(3,4)는 x축으로 3, x축에 수직인 방향으로 4를 가집니다. 남은 (0,4)와 가로 기준 (1,0)의 내적은 0입니다. 두 성분을 더하면 원래 (3,4)로 돌아옵니다."
      />
<p>기준을 v=(2,0)으로 바꾸면 내적은 6, 분모는 4입니다. 계수 1.5에 (2,0)을 곱하므로 결과는 여전히 (3,0)입니다. 분모 없이 내적 6에 기준을 바로 곱했다면 (12,0)이 됩니다. 기준의 크기를 두 번 반영한 결과라 기준 길이의 제곱으로 나누어야 합니다.</p>
<p>이 식을 직접 얻으려면 투영을 cv라고 놓습니다. 남은 u−cv가 v와 직각이려면 (u−cv)·v=0이어야 하므로 c=(u·v)/(v·v)입니다. 투영의 길이는 |u·v|/‖v‖이며 부호 있는 방향 성분 (u·v)/‖v‖와는 구별합니다.</p>
</section>
<section id="cauchy-schwarz" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 한 방향의 성분은 전체 길이를 넘지 못한다</h2>
<p>길이 5인 (3,4)의 가로 부분 길이는 3입니다. 기준을 다른 방향으로 돌려도 그림자의 길이가 전체 길이 5보다 길어질 수는 없습니다. 이 관계를 두 벡터의 내적으로 적은 것이 <strong>코시–슈바르츠 부등식(Cauchy–Schwarz inequality)</strong>입니다.</p>
<ExplainedFormula
        question="두 벡터의 내적은 얼마나 커질 수 있을까요?"
        idea={<>u를 v와 평행한 투영과 수직 성분으로 나눕니다. 평행 성분의 길이는 u 전체 길이를 넘을 수 없으므로 내적의 절댓값도 두 전체 길이의 곱을 넘을 수 없습니다.</>}
        formula={String.raw`\underbrace{|u\cdot v|}_{\text{방향이 겹치는 양}}\le \underbrace{\lVert u\rVert_2\lVert v\rVert_2}_{\text{두 전체 길이의 곱}}`}
        annotatedFormula={String.raw`\underbrace{|u\cdot v|}_{\text{실제 내적의 크기}}\le\underbrace{\lVert u\rVert\lVert v\rVert}_{\text{두 길이로 정한 상한}}`}
        operations={[{ expression: String.raw`|u\cdot v|/\lVert v\rVert\le\lVert u\rVert`, annotation: ["기준이 0이 아니면 투영 길이는 전체 길이를 넘지 못합니다."] },{ expression: String.raw`|u\cdot v|\le\lVert u\rVert\lVert v\rVert`, annotation: ["양변에 양수인 기준 길이를 곱합니다."] }]}
        terms={[
          { symbol: String.raw`|u\cdot v|`, name: "내적의 절댓값", description: "방향이 같거나 반대인 경우를 모두 절댓값으로 비교합니다." },
          { symbol: String.raw`\lVert u\rVert_2\lVert v\rVert_2`, name: "길이의 곱", description: "두 벡터가 가진 전체 길이로 만들 수 있는 최대 내적입니다." },
          { symbol: String.raw`\le`, name: "상한", description: "왼쪽 값이 오른쪽을 초과할 수 없다는 보장이지, 항상 같다는 뜻은 아닙니다." },
        ]}
        assumptions={["실수 좌표와 유클리드 내적·L2 노름을 사용합니다.", "등호는 u와 v 중 하나가 0이거나 두 벡터가 같은 직선 위에 있을 때 성립합니다."]}
        interpretation="u=(3,4), v=(6,8)이면 |u·v|=50이고 길이의 곱도 5×10=50이라 등호입니다. v=(4,−3)이면 길이의 곱은 25지만 내적은 0입니다. 오른쪽은 가능한 최댓값이지 실제 유사도 자체가 아닙니다."
        title="상한이 나오는 이유"
      />
<p>증명에서는 먼저 v=0을 분리합니다. 이 경우 양변이 0이라 결론이 성립합니다. v≠0이면 투영 p와 수직인 나머지 r로 u=p+r를 씁니다. p·r=0이므로 ‖u‖²=‖p‖²+‖r‖²≥‖p‖²입니다. 여기서 ‖p‖=|u·v|/‖v‖를 대입하면 위 부등식이 나옵니다. 좌표 수가 늘어도 이 계산은 같습니다.</p>
<p>v≠0에서 등호가 되려면 나머지 r가 0이어야 합니다. 즉 u가 v의 배수여야 합니다. 반대 방향인 v=(−6,−8)도 내적의 절댓값은 50이므로 등호입니다. 반면 서로 직각인 두 벡터는 길이가 0이 아니어도 내적이 0입니다. 0벡터는 등호 조건에는 들어가지만 각도를 정의하는 사례에는 넣지 않습니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 실제 교재의 투영식과 PyTorch의 분모에 같은 숫자를 넣는다</h2>
<p><a href={OPENSTAX} target="_blank" rel="noreferrer">OpenStax Calculus Volume 3 §2.3</a>의 식 (2.3)은 대응하는 좌표의 곱합, 식 (2.4)는 두 길이와 각도의 관계를 보여 줍니다. 실제 식 (2.6)은 projᵤv=(u·v/‖u‖²)u입니다. 원문에서는 u가 기준이고 v가 대상이라 이 글의 문자 역할과 반대입니다.</p>
<p>원문의 기준 u에 (2,0), 대상 v에 (3,4)를 넣어 봅시다. 분자는 6, 분모는 4이므로 (6/4)(2,0)=(3,0)입니다. 9절과 문자는 달라도 같은 계산입니다. 원문의 식 (2.7)은 (u·v)/‖u‖라는 부호 있는 성분이므로 그 절댓값을 취해야 투영의 길이가 됩니다.</p>
<p>실제 라이브러리에서는 아주 작은 분모를 다루는 규칙까지 확인해야 합니다. <a href={NORMALIZE} target="_blank" rel="noreferrer">PyTorch 2.8의 normalize</a>는 기본 p=2일 때 v/max(‖v‖, eps)를 사용하며 기본 eps는 10⁻¹²입니다. 분모에 eps를 더하는 식이 아닙니다. 노름이 eps보다 작으면 분모를 eps로 올립니다.</p>
<p>v=(3×10⁻¹⁴, 4×10⁻¹⁴)는 길이가 5×10⁻¹⁴입니다. 기본 eps로 문서의 식을 계산하면 결과는 (0.03,0.04)이고 길이는 0.05입니다(가정). 함수 이름이 normalize여도 이 작은 입력에서는 길이 1이 되지 않습니다. v=(3,4)라면 분모가 5여서 (0.6,0.8), 길이 1이 됩니다.</p>
<p><a href={COSINE} target="_blank" rel="noreferrer">같은 버전의 cosine_similarity</a>는 두 노름 각각을 eps 이상으로 제한한 뒤 곱합니다. 기본 eps는 10⁻⁸입니다. x₁=(3×10⁻¹⁰,4×10⁻¹⁰), x₂=(1,0)을 넣으면 분자는 3×10⁻¹⁰, 분모는 10⁻⁸×1이라 값은 0.03입니다(가정). 두 벡터의 기하학적 코사인 0.6과 다릅니다. 이 수치는 문서의 식을 대입한 계산이며 라이브러리를 실행해 얻은 측정값은 아닙니다.</p>
<p>0벡터를 넣으면 이 문서식의 출력은 0입니다. 계산 결과가 존재한다는 사실이 0벡터에 방향을 만들어 주지는 않습니다. 투영의 기준이 0일 때도 이 수치 처리 규칙을 가져와 수학적 방향이 정의된 것처럼 해석하지 않습니다.</p>
<CitationBlock source="OpenStax · Calculus Volume 3 §2.3, 식 (2.3)–(2.7)" citeKey={1} href={OPENSTAX}><p>좌표별 내적, 각도, 투영을 연결하는 실제 원문입니다. 기준·대상 문자의 역할을 맞춘 뒤 같은 (3,4)를 대입했습니다.</p></CitationBlock>
<CitationBlock source="PyTorch 2.8 · normalize / cosine_similarity" citeKey={2} href={NORMALIZE}><p>두 함수의 분모 제한과 서로 다른 기본 eps를 버전별 문서로 확인했습니다. 작은 입력의 결과는 순수한 길이 1 변환이나 기하학적 코사인과 달라질 수 있습니다.</p></CitationBlock>
</section>
<section id="applications" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 내적의 전진량과 전체 길이를 묶으면 학습 횟수도 제한할 수 있다</h2>
<p>같은 계산은 <Link to="/cs/ai/perceptron#convergence">퍼셉트론</Link>의 분류 점수 w·x, <Link to="/cs/ai/neural-network#forward">신경망</Link>의 가중합, <Link to="/cs/ai/attention-theory#self-attention">어텐션</Link>의 질문·키 비교에 쓰입니다. 가중합은 내적에 편향을 더하고 어텐션은 점수의 크기를 차원의 제곱근으로 보정합니다. 계산이 같아도 학습 목적과 출력의 의미는 각 모델에서 확인해야 합니다.</p>
<p>내적과 노름은 계산 횟수의 증명에도 함께 쓰입니다. 퍼셉트론이 틀린 분류를 고칠 때 올바른 방향으로는 충분히 전진하면서 전체 길이는 제한된 속도로만 늘어난다고 합시다. 방향 성분이 전체 길이를 넘지 못하므로 이런 수정이 무한히 계속될 수는 없습니다.</p>
<p>구체적으로 입력 길이의 상한 R=5, 정답 경계에서 확보한 최소 여유 γ=1이라면 아래 전제에서 수정 횟수는 25 이하입니다(가정). 실제 횟수가 반드시 25라는 뜻은 아닙니다. 0에서 시작하는 초기값, 분리 가능한 데이터, 양수인 여유, 길이 상한을 모두 확인해야 합니다.</p>
<ProgressiveDetail title="퍼셉트론 수정 횟수의 전체 증명" preview="내적은 수정마다 γ 이상 전진하고 길이 제곱은 R² 이하로 늘어납니다. 두 관계를 묶어 M≤(R/γ)²를 얻습니다.">
<div className="space-y-6">
<p>정답 표시는 y∈{'{−1,+1}'}이고 w₀=0에서 시작합니다. y(w·x)≤0인 경우에만 w←w+yx로 수정하며 M은 그 수정 횟수입니다. 길이 1인 정답 방향 w*가 있어 모든 입력에서 y(w*·x)≥γ&gt;0이라고 가정합니다. 이 최소 여유를 마진이라고 합니다. 모든 입력의 길이는 R 이하입니다.</p>
<p>한 번 수정하면 (w+yx)·w*=w·w*+y(x·w*)≥w·w*+γ입니다. 0에서 시작했으므로 M번 뒤에는 wₘ·w*≥Mγ입니다. 이것이 정답 방향으로의 누적 전진량입니다.</p>
<p>같은 수정에서 ‖w+yx‖²=‖w‖²+2y(w·x)+‖x‖²≤‖w‖²+R²입니다. 수정 조건 때문에 가운데 항이 양수가 아니며 y²=1을 썼습니다. 따라서 ‖wₘ‖²≤MR², 즉 ‖wₘ‖≤R√M입니다.</p>
<ExplainedFormula
        question="퍼셉트론의 수정이 주어진 전제에서 무한히 계속될 수 없는 이유는 무엇일까요?"
        idea={<>각 수정은 정답 경계의 방향으로 적어도 γ만큼 전진합니다. 전체 가중치 길이는 입력 길이 R의 제한 때문에 R√M 이하입니다. 방향 성분이 전체 길이를 넘지 못한다는 부등식으로 M의 상한을 얻습니다.</>}
        formula={String.raw`\begin{aligned}
          w_M\cdot w^* &\ge M\gamma\\
          w_M\cdot w^* &\le \lVert w_M\rVert_2\lVert w^*\rVert_2=\lVert w_M\rVert_2\\
          \lVert w_M\rVert_2 &\le R\sqrt{M}\\
          M\gamma &\le R\sqrt{M}\quad\Longrightarrow\quad M\le\left(\frac{R}{\gamma}\right)^2
        \end{aligned}`}
        annotatedFormula={String.raw`\underbrace{M\gamma}_{\text{전진의 하한}}\le\underbrace{\lVert w_M\rVert}_{\text{전체 길이}}\le\underbrace{R\sqrt M}_{\text{길이의 상한}}`}
        operations={[{ expression: String.raw`M\gamma\le R\sqrt M`, annotation: ["방향 성분의 하한과 전체 길이의 상한을 묶습니다."] },{ expression: String.raw`M\le (R/\gamma)^2`, annotation: ["M이 양수이면 √M으로 나누고 제곱합니다. M=0이면 이미 성립합니다."] }]}
        terms={[
          { symbol: String.raw`M`, name: "수정 횟수", description: "조건을 만족해 가중치를 바꾼 누적 횟수입니다." },
          { symbol: String.raw`\gamma`, name: "마진", description: "길이 1인 정답 방향에서 모든 입력이 확보한 최소 양수 여유입니다." },
          { symbol: String.raw`R`, name: "입력 길이 상한", description: "모든 입력 벡터 길이의 공통 상한입니다." },
          { symbol: String.raw`w_M`, name: "M번 뒤의 가중치", description: "0에서 시작해 M번의 수정을 합친 현재 가중치입니다." },
        ]}
        assumptions={["w₀=0, y=±1이며 y(w·x)≤0인 경우에만 w←w+yx로 수정합니다.",
          "학습 데이터는 고정된 정답 경계 w*로 분리되고 ||w*||₂=1이며 y(w*·x)≥γ>0입니다.",
          "모든 입력은 ||x||₂≤R입니다. 편향이 있다면 상수 좌표를 붙인 벡터 전체에 같은 길이 상한을 적용합니다.",
          "주어진 수정 규칙과 재방문 가능한 고정 데이터 순서를 가정합니다.",
        ]}
        interpretation="예를 들어 R=5, γ=1이면 이 보장은 수정이 최대 25번이라고 말합니다. 실제 횟수는 더 작을 수 있습니다. 내적은 정답 방향의 누적 전진을 재고 노름은 전체 가중치의 크기를 잽니다. 코시–슈바르츠는 방향 성분이 전체 길이를 넘지 못하게 연결합니다."
        title="방향 전진과 전체 길이를 한 부등식으로 묶기"
      />
<p><a href={CORNELL} target="_blank" rel="noreferrer">Cornell CS 4/5780, 2023년 봄 강의의 Perceptron Convergence</a>는 실제로 초기값 0과 두 성장식을 사용합니다. 원문은 입력 길이를 1 이하로 맞춰 M≤1/γ²를 얻습니다. 여기의 R=5 입력을 모두 5로 나누면 마진도 1/5이므로 원문 식은 1/(1/5)²=25를 줍니다. 0에서 시작하는 가중치도 같은 비율로 변하므로 분류 부호와 수정 순서는 유지됩니다.</p>
</div>
</ProgressiveDetail>
<p>XOR처럼 하나의 직선 경계로 분리할 수 없거나 γ=0이면 이 유한 상한을 얻지 못합니다. 입력 길이가 제한되지 않으면 한 번의 수정이 길이를 크게 늘릴 수 있습니다. 서로 모순되는 정답 표시도 같은 방향으로 전진한다는 가정을 깨뜨립니다. 실제 실행 순서와 데이터 재방문은 연결한 퍼셉트론 글에서 이어집니다.</p>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 크기와 방향, 의미는 다르다</h2>
<p>길이 5는 방향을 알려 주지 않고 내적 0은 0벡터의 각도를 알려 주지 않습니다. 투영은 남은 수직 성분을 버리고 코사인 비교는 전체 크기를 제거합니다. 어떤 정보를 남기려는지와 계산의 전제를 함께 확인해야 합니다.</p>
<p>여기서는 벡터 하나와 두 벡터의 관계를 다뤘습니다. 여러 방향으로 동시에 바꾸는 계산은 행렬로 확장됩니다. <a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noreferrer">MIT 18.06 선형대수</a>에서 투영과 최소제곱으로 이어지는 흐름도 볼 수 있습니다.</p>
<ol className="list-decimal space-y-3 pl-6"><li>(3,4)의 가로 기준을 (1,0)에서 (2,0)으로 바꿔도 투영이 (3,0)인 이유는 무엇일까요? (답: 9절)</li><li>길이가 모두 5인 두 벡터의 내적이 0이라면 코시–슈바르츠의 상한 25와 모순일까요? (답: 10절)</li><li>PyTorch 2.8 normalize에 (3×10⁻¹⁴,4×10⁻¹⁴)를 넣는 문서식 계산에서 길이가 1이 되지 않는 이유는 무엇일까요? (답: 11절)</li></ol>

</section>
</article>}
