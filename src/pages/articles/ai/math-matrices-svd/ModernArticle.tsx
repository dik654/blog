import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { matrixCodeRefs } from "./codeRefs";
import MatrixDirectionsViz from "./viz/MatrixDirectionsViz";
const SVD_DOC="https://docs.pytorch.org/docs/2.8/generated/torch.linalg.svd.html";
const MIT_SVD="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/d273f75ee2552a5c3c35ccab37e5edce_MIT18_06SCF11_Ses3.5sum.pdf";
const MIT_LOW="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/";
export default function MatricesSvdArticle(){const sidebar=useCodeSidebar(); return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 두 숫자를 섞는 계산에서 어떤 차이가 살아남을까</h2>
<p className="text-lg leading-8">두 측정값이 4와 2라고 합시다. 첫 출력은 첫 값을 두 번, 둘째 값을 한 번 더해 10으로 만듭니다. 둘째 출력은 첫 값을 한 번, 둘째 값을 두 번 더해 8로 만듭니다. 두 출력에는 두 입력이 모두 들어 있지만 각각의 기여는 다릅니다. 숫자 네 개로 정한 이 규칙을 큰 표에도 적용할 수 있습니다.</p>
<p>AI의 한 층은 이런 계산으로 여러 입력을 섞습니다. 큰 표를 저장하거나 계산하기 어려우면 일부 변화를 생략해 더 작게 표현하기도 합니다. 그때는 계산 결과가 얼마나 달라지는지 확인해야 합니다. 이 글에서는 (4,2)가 (10,8)이 되는 규칙을 계속 따라가며 무엇을 줄일 수 있고 무엇을 잃는지 살펴봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 입력의 순서와 두 출력 규칙을 먼저 고정한다</h2>
<p>입력의 첫 칸과 둘째 칸은 같은 단위로 잰 서로 다른 값이라고 정합니다. 단순한 계산을 위한 가정이며 실제 모델의 측정 자료는 아닙니다. 값을 바꿔 넣으면 같은 답이 나오지 않습니다. (2,4)를 넣으면 첫 출력 8, 둘째 출력 10이 되어 앞의 결과와 순서가 바뀝니다.</p>
<div className="grid gap-5 md:grid-cols-3"><div className="border-t border-border pt-3"><h3 className="font-semibold">받는 값</h3><p className="mt-2">첫 칸 4, 둘째 칸 2. 순서를 보존합니다.</p></div><div className="border-t border-border pt-3"><h3 className="font-semibold">고정한 규칙</h3><p className="mt-2">첫 출력은 2×첫 칸+둘째 칸. 둘째 출력은 첫 칸+2×둘째 칸입니다.</p></div><div className="border-t border-border pt-3"><h3 className="font-semibold">나오는 값</h3><p className="mt-2">첫 칸 10, 둘째 칸 8. 입력과 마찬가지로 두 칸입니다.</p></div></div>
<p>이 규칙에는 입력과 무관하게 더하는 상수가 없습니다. 따라서 (0,0)을 넣으면 (0,0)이 나옵니다. 두 입력을 모두 두 배로 만들면 출력도 두 배가 됩니다. 이런 조건이 뒤에서 계산을 여러 부분으로 나누어도 같은 답을 얻는 근거가 됩니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 함께 움직이는 부분과 서로 다른 부분을 나눈다</h2>
<p>두 입력의 평균은 3입니다. 원래 (4,2)는 둘 다 3인 (3,3)에 (1,−1)을 더한 값입니다. 앞부분은 두 칸이 같이 움직이고 뒷부분은 한 칸이 늘어난 만큼 다른 칸이 줄어듭니다. 두 부분을 더하면 정확히 원래 입력이므로 이 단계에서는 정보를 버리지 않았습니다.</p>
<p>먼저 (3,3)에 같은 규칙을 적용하면 (9,9)가 됩니다. 두 칸 모두 3배입니다. 다음으로 (1,−1)에 적용하면 첫 칸은 2−1=1, 둘째 칸은 1−2=−1입니다. 이 부분은 그대로 남습니다. 두 결과를 더하면 (9,9)+(1,−1)=(10,8)로 직접 계산한 출력과 같습니다.</p>
<p>입력 두 칸의 평균은 3에서 출력의 평균 9로 커졌습니다. 두 칸 사이의 차이는 2로 유지됩니다. 따라서 이 규칙은 모든 변화를 같은 배율로 키우는 계산이 아닙니다. 두 값이 함께 늘어나는 변화에는 3배, 서로 벌어지는 변화에는 1배로 반응합니다.</p>
<p>이제 뒤의 (1,−1)을 생략하면 출력은 (9,9)입니다. 원래 출력과 비교해 첫 칸은 1 작고 둘째 칸은 1 큽니다. 평균 9는 남았지만 두 칸의 차이 2는 사라졌습니다. 두 출력의 합만 필요했다면 둘 다 18이라 변화가 없지만 어느 칸이 더 큰지 묻는다면 중요한 정보가 없어집니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 나누고 늘리고 합치는 경로를 한 그림으로 본다</h2>
<p>아래 그림의 가로와 세로는 두 칸의 값입니다. 원점에서 같은 만큼 오른쪽과 위로 가는 이동이 함께 변하는 부분입니다. 거기서 오른쪽 1, 아래쪽 1만큼 움직이면 두 칸의 차이가 생깁니다. 두 축의 한 칸을 같은 길이로 그려 이동의 길이도 비교할 수 있습니다.</p>
<MatrixDirectionsViz />
<p>분리 화면의 마지막 점은 (4,2)입니다. 가운데 단계를 바꾸면 함께 가는 부분만 (3,3)에서 (9,9)로 늘고 남은 이동은 여전히 (1,−1)입니다. 두 이동을 잇는 순서는 계산을 보기 위한 배치입니다. 마지막 점이 (10,8)인지 확인하면 전체 규칙과 같은 결과인지 검산할 수 있습니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 큰 표를 줄이려면 어떤 변화가 사라지는지 알아야 한다</h2>
<p>입력과 출력이 각각 천 칸이면 각 출력이 각 입력을 얼마나 반영할지 정하는 숫자가 백만 개 필요합니다. 여러 칸이 비슷한 방식으로 움직인다면 공유하는 몇 가지 변화만 계산해 저장량을 줄일 여지가 생깁니다. 다만 실제로 그런 반복이 있는지 먼저 확인해야 합니다.</p>
<p>앞 사례에서는 두 칸이 함께 변하는 부분 하나만 남겼습니다. 이 선택은 출력의 평균을 보존하지만 차이를 지웁니다. 입력이 (1,−1)과 (−1,1)인 두 경우를 구별해야 한다면 둘 다 (0,0)이 되어 실패합니다. 작은 변화라는 이유만으로 쓸모없는 변화라고 판단할 수 없습니다.</p>
<p>모든 부분을 보존하면 출력을 거꾸로 읽어 입력도 찾을 수 있습니다. (10,8)의 평균 9를 3으로 나누면 입력의 평균 3입니다. 두 출력의 차이 2는 그대로 전달됐으므로 그 절반인 1을 평균에 더하고 빼면 입력 (4,2)가 돌아옵니다. 두 변화의 배율이 모두 0이 아니기 때문에 가능한 계산입니다.</p>
<p>함께 변하는 부분만 남겼을 때는 이 복원이 불가능합니다. 입력 (4,2), (3,3), (2,4)는 모두 평균이 3이라 같은 출력 (9,9)가 됩니다. 출력의 평균에서 입력의 평균은 찾을 수 있지만 어떤 쌍을 넣었는지는 알 수 없습니다. 줄인 결과가 비슷해 보인다는 사실과 원래 정보를 되찾을 수 있다는 사실은 다릅니다.</p>
<p>버린 부분의 영향은 입력에 따라서도 달라집니다. (4,4)를 넣으면 두 값의 차이가 없어 생략 전후 출력이 모두 (12,12)입니다. (4,−4)를 넣으면 원래 출력 (4,−4)가 생략 뒤 (0,0)이 됩니다. 한 입력에서 오차가 0이었다고 모든 입력이 보존된다고 결론 내릴 수 없습니다.</p>
<p>무엇을 최적화하는지도 정해야 합니다. 원래 표의 모든 칸을 비슷하게 복원하는 목표와 특정 사람의 분류를 맞히는 목표는 서로 다른 값을 비교합니다. 먼저 표 자체의 차이를 줄이는 규칙을 배우고 그 규칙이 보장하는 범위를 정한 뒤 실제 과제에 적용하겠습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 방금 계산한 자리에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">지금까지 본 것</th><th className="p-3">이름</th><th className="p-3">확인할 질문</th></tr></thead><tbody>{[
["입력별 기여를 출력마다 적은 숫자 표","행렬(matrix)","어느 행이 어느 출력인가?"],
["입력을 더하고 배율을 바꾸어도 같은 방식으로 바뀌는 규칙","선형 변환(linear map)","0을 넣으면 0인가?"],
["출력이 독립적으로 움직일 수 있는 방향의 수","계수(rank)","표의 크기와 실제 자유도가 같은가?"],
["서로 직각이며 길이가 1인 기준 방향","정규직교 기저(orthonormal basis)","방향의 길이와 겹침을 따로 확인했는가?"],
["입력의 기준을 고르고 방향별로 늘린 뒤 출력으로 합치는 분해","특잇값 분해(SVD)","어느 방향이 몇 배로 전달되는가?"],
["일부 방향만 남겨 원래 표를 대신하는 계산","낮은 계수 근사(low-rank approximation)","버린 방향에서 무엇을 잃는가?"],
].map((row,i)=><tr key={i} className="border-t border-border">{row.map((cell,j)=><td key={j} className="p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
<p>뒤에서는 rank를 영문 그대로도 씁니다. 계수라는 한국어가 개별 숫자의 계수와 혼동될 수 있기 때문입니다. 표의 칸 개수, 독립 방향 수, 방향별 배율은 서로 다른 수입니다.</p>
</section>
<section id="matrix-map" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 한 행은 출력 한 칸의 계산을 맡는다</h2>
<p>같은 규칙을 A=[[2,1],[1,2]], 입력을 x=(4,2)로 적습니다. 첫 행 [2,1]과 입력의 대응 숫자를 곱해 더하면 10, 둘째 행 [1,2]로 계산하면 8입니다. 행렬은 입력의 좌표 수만큼 열을 가지며 출력의 좌표 수만큼 행을 가집니다. m×n 행렬은 n칸을 받아 m칸을 냅니다.</p>
<p>다른 규칙과 비교해 보겠습니다. 둘째 행만 [−1,3]으로 바꾼 D=[[2,1],[−1,3]]은 같은 입력에서 둘째 출력이 2가 됩니다. 다음 식은 이 비교용 D이며 앞에서 계속 쓴 A와 구분합니다.</p>
<ExplainedFormula question="둘째 행을 바꾸면 같은 입력의 어느 출력이 달라질까요?" idea="각 행이 출력 한 칸을 맡으므로 첫 행이 같으면 첫 출력 10은 유지됩니다. 바꾼 둘째 행으로 계산한 값만 2가 됩니다."
formula={String.raw`D=\begin{bmatrix}2&1\\-1&3\end{bmatrix},\quad x=\begin{bmatrix}4\\2\end{bmatrix}\quad\Longrightarrow\quad Dx=\begin{bmatrix}2\cdot4+1\cdot2\\-1\cdot4+3\cdot2\end{bmatrix}=\begin{bmatrix}10\\2\end{bmatrix}`}
annotatedFormula={String.raw`Dx=\begin{bmatrix}\underbrace{8+2}_{\text{첫 행의 기여}}\\\underbrace{-4+6}_{\text{둘째 행의 기여}}\end{bmatrix}=\begin{bmatrix}10\\2\end{bmatrix}`}
operations={[{expression:String.raw`(2,1)\cdot(4,2)=10`,annotation:["첫 출력은 첫 행과 입력의 내적입니다."]},{expression:String.raw`(-1,3)\cdot(4,2)=2`,annotation:["둘째 행이 달라졌으므로 둘째 출력만 바뀝니다."]}]}
terms={[{symbol:"D",name:"비교용 행렬",description:"두 입력을 두 출력으로 보내는 2×2 표입니다."},{symbol:"x",name:"입력 열벡터",description:"위에서 아래로 첫 칸 4, 둘째 칸 2를 적습니다."},{symbol:"Dx",name:"출력 열벡터",description:"행마다 얻은 결과 10과 2를 같은 순서로 모읍니다."}]}
assumptions={["실수 좌표와 열벡터를 사용하며 입력 순서를 고정합니다.","D는 원래 A의 둘째 행을 바꾼 비교 사례입니다. 이후 SVD 계산은 원래 A로 돌아갑니다."]} interpretation="표의 크기만 맞는다고 축의 의미까지 맞지는 않습니다. 두 열이 나타내는 입력 항목과 두 행이 나타내는 출력 항목을 함께 보존해야 합니다." />
<p>D의 첫 열은 e₁=(1,0)을 넣은 (2,−1), 둘째 열은 e₂=(0,1)을 넣은 (1,3)입니다. 따라서 2e₁+3e₂=(2,3)을 넣으면 2(2,−1)+3(1,3)=(7,7)입니다. 직접 행별로 계산해도 (7,7)입니다. 일반적으로 D(αx+βz)=αDx+βDz가 성립합니다.</p>
<p>상수 b를 더한 T(x)=Dx+b는 b≠0일 때 T(0)=b입니다. 원점을 보존하는 선형 변환과 구분해 아핀 변환(affine map)이라고 부릅니다. 행과 열을 바꾸는 전치(transpose)는 Dᵀ의 (i,j)칸에 D의 (j,i)칸을 놓는 계산입니다. m×n 표를 n×m으로 바꾸지만 일반적으로 역변환을 만들어 주지는 않습니다.</p>
</section>
<section id="multiplication" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 두 규칙의 곱은 오른쪽부터 적용한다</h2>
<p>원래 A로 돌아와 입력의 둘째 칸만 두 배로 만드는 B=diag(1,2)를 먼저 적용합시다. x=(4,2)는 B를 거쳐 (4,4), A를 거쳐 (12,12)가 됩니다. 순서를 바꾸면 먼저 Ax=(10,8), 다음 B가 (10,16)을 만듭니다. 따라서 AB와 BA는 같지 않습니다.</p>
<ExplainedFormula question="왜 두 표의 가운데 크기가 맞아야 곱할 수 있을까요?" idea="B가 만든 중간 좌표를 A가 빠짐없이 읽습니다. AB의 한 칸은 A의 한 행과 B의 한 열이 중간 좌표를 통해 연결한 기여의 합입니다."
formula={String.raw`A\in\mathbb R^{p\times m},\ B\in\mathbb R^{m\times n}\quad\Longrightarrow\quad(AB)_{ij}=\sum_{r=1}^{m}A_{ir}B_{rj},\quad AB\in\mathbb R^{p\times n}`}
annotatedFormula={String.raw`\underbrace{A}_{p\times m}\underbrace{B}_{m\times n}=\underbrace{AB}_{p\times n},\qquad(AB)_{ij}=\sum_{r=1}^{m}\underbrace{A_{ir}B_{rj}}_{\text{중간 칸 r을 거친 기여}}`}
operations={[{expression:String.raw`AB=\begin{bmatrix}2&2\\1&4\end{bmatrix}`,annotation:["B가 둘째 입력을 두 배로 만들어 A의 둘째 열 기여가 두 배가 됩니다."]},{expression:String.raw`BA=\begin{bmatrix}2&1\\2&4\end{bmatrix}`,annotation:["A의 출력을 B가 바꾸므로 이번에는 둘째 행이 두 배가 됩니다."]}]}
terms={[{symbol:"r",name:"중간 좌표",description:"B의 출력이면서 A의 입력인 같은 칸을 가리킵니다."},{symbol:"AB",name:"합성한 행렬",description:"입력에는 B가 먼저, A가 다음으로 작용합니다."},{symbol:"p×n",name:"최종 크기",description:"n칸 입력을 p칸 출력으로 보내는 표입니다."}]}
assumptions={["공유하는 가운데 차원이 같아야 합니다.","각 축의 자료 의미도 같아야 실제 계산을 연결할 수 있습니다."]} interpretation="A가 3×2이고 B가 2×4라면 AB는 3×4입니다. BA는 가운데 4와 3이 달라 정의되지 않습니다. 정사각 행렬의 작은 사례와 일반 크기를 모두 확인합니다." />
<p>정확한 실수 연산에서는 (PQ)R=P(QR)이지만 계산량은 다를 수 있습니다. P가 10×100, Q가 100×5, R이 5×50이면 왼쪽 묶음은 5000+2500=7500번, 오른쪽 묶음은 25000+50000=75000번의 곱셈을 씁니다. 일반적인 밀집 곱의 곱셈 수를 센 것이며 실행 시간 측정은 아닙니다. 유한 정밀도에서는 묶음 순서에 따라 반올림 결과도 달라질 수 있습니다.</p>
</section>
<section id="rank-basis" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 표가 커도 출력이 움직이는 방향은 하나일 수 있다</h2>
<p>원래 A의 두 열 (2,1)과 (1,2)는 서로 배수가 아닙니다. 입력을 바꾸면 출력을 평면의 두 방향으로 움직일 수 있어 rank는 2입니다. 반면 아래 R에서는 둘째 열이 첫 열의 두 배입니다.</p>
<ExplainedFormula question="두 열을 저장했는데 왜 독립 방향은 하나일까요?" idea="모든 출력이 첫 열 (1,2)의 배수입니다. 입력 두 칸은 그 배율을 바꿀 수 있지만 새로운 출력 방향을 만들지는 못합니다."
formula={String.raw`R=\begin{bmatrix}1&2\\2&4\end{bmatrix}=\begin{bmatrix}1\\2\end{bmatrix}\begin{bmatrix}1&2\end{bmatrix},\qquad\operatorname{rank}(R)=1`}
annotatedFormula={String.raw`R\begin{bmatrix}a\\b\end{bmatrix}=\underbrace{(a+2b)}_{\text{바꿀 수 있는 배율}}\underbrace{\begin{bmatrix}1\\2\end{bmatrix}}_{\text{고정된 한 방향}}`}
operations={[{expression:String.raw`R(4,2)^\top=8(1,2)^\top`,annotation:["배율은 4+2×2=8이고 출력은 (8,16)입니다."]},{expression:String.raw`R(2,-1)^\top=(0,0)^\top`,annotation:["서로 상쇄하는 입력 변화는 출력에 나타나지 않습니다."]}]}
terms={[{symbol:"rank(R)",name:"독립 방향 수",description:"열들이 펼치는 공간의 차원이며 행들이 펼치는 공간의 차원과 같습니다."},{symbol:String.raw`uv^\top`,name:"외적 형태",description:"열벡터와 행벡터를 곱해 한 방향의 표를 만듭니다. 벡터의 교차곱과는 다른 연산입니다."}]}
assumptions={["정확한 실수 계산에서 열 사이의 의존 관계를 판단합니다.","표의 크기 2×2와 실제 출력 방향 수 1을 구분합니다."]} interpretation="입력 (2,−1)은 0이 아니지만 출력이 0입니다. 입력의 서로 다른 두 상태가 같은 출력으로 갈 수 있으므로 전체 입력을 되찾는 역변환은 없습니다." />
<p>방향의 양을 분리해서 재려면 서로 직각이고 길이가 1인 기준이 편합니다. e₁=(1,0), e₂=(0,1)은 각각 길이 1, 내적 0입니다. (3,4)와 내적을 구하면 기준별 계수는 3과 4입니다. 직교는 내적 0이라는 조건이며 정규직교는 각 길이 1이라는 조건까지 포함합니다.</p>
<p>실수의 수학적 rank와 수치 판정도 구분합니다. diag(1,10⁻⁸)은 둘째 값이 0이 아니므로 정확한 rank가 2입니다. 특잇값을 절대 기준 10⁻⁷보다 클 때만 세겠다고 정하면 수치 rank는 1입니다(가정). 실제 라이브러리의 기본 기준을 뜻하지 않습니다. 기준은 자료의 단위와 측정 정밀도, 사용할 과제에 맞춰야 하며 작은 값 자체가 잡음이라는 증거는 아닙니다.</p>
</section>
<section id="svd" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 같은 입력을 기준 변경, 배율 적용, 출력 합성으로 추적한다</h2>
<p>3절의 두 방향을 길이 1로 만들면 q₁=(1,1)/√2와 q₂=(1,−1)/√2입니다. 각각 길이 제곱은 1/2+1/2=1이고 서로 내적은 1/2−1/2=0입니다. 이 두 열을 모은 Q를 쓰면 원래 A에서는 U=V=Q, 방향별 배율은 3과 1입니다.</p>
<ExplainedFormula question="같은 (4,2)가 SVD의 세 단계를 지나면 어떤 값이 되나요?" idea="입력을 두 기준 방향으로 잰 뒤 첫 성분만 3배로 늘립니다. 두 출력 방향으로 합치면 직접 계산한 (10,8)이 돌아옵니다."
formula={String.raw`A=U\Sigma V^\top,\qquad Ax=U\bigl(\Sigma(V^\top x)\bigr),\qquad\sigma_1\ge\sigma_2\ge\cdots\ge0`}
annotatedFormula={String.raw`\begin{bmatrix}4\\2\end{bmatrix}\xrightarrow{V^\top}\underbrace{\begin{bmatrix}3\sqrt2\\\sqrt2\end{bmatrix}}_{\text{두 기준으로 잰 값}}\xrightarrow{\Sigma}\underbrace{\begin{bmatrix}9\sqrt2\\\sqrt2\end{bmatrix}}_{\text{각각 3배와 1배}}\xrightarrow{U}\begin{bmatrix}10\\8\end{bmatrix}`}
operations={[{expression:String.raw`Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}`,annotation:["두 열은 직각이며 길이가 1입니다."]},{expression:String.raw`(4+2)/\sqrt2=3\sqrt2`,annotation:["함께 움직이는 방향의 계수를 잽니다."]},{expression:String.raw`(4-2)/\sqrt2=\sqrt2`,annotation:["서로 벌어지는 방향의 계수를 잽니다."]}]}
terms={[{symbol:"V",name:"입력의 특이벡터",description:"입력 공간에서 성분을 잴 정규직교 방향들을 열로 모읍니다."},{symbol:String.raw`\Sigma`,name:"특잇값의 대각 행렬",description:"각 방향의 배율을 큰 순서로 놓습니다. 값은 음수가 아닙니다."},{symbol:"U",name:"출력의 특이벡터",description:"배율을 적용한 성분을 출력 공간에서 합칠 방향들입니다."}]}
assumptions={["유한 차원 실수 행렬을 사용합니다. 복소수에서는 전치 대신 켤레전치를 씁니다.","U와 V가 같은 것은 이번 대칭 양의 정부호 예제의 성질이며 일반 SVD의 조건은 아닙니다."]} interpretation="Σ의 작용은 성분별 배율 적용입니다. 대각 행렬 전체를 만들어 밀집 행렬 곱을 할 필요는 없습니다. 길이와 각도를 보존하는 단계와 길이를 바꾸는 단계를 분리했습니다." />
<p>정사각 정규직교 행렬은 QᵀQ=QQᵀ=I여서 Qᵀ가 역행렬입니다. 하지만 그 작용을 언제나 회전이라고 부를 수는 없습니다. 이번 Q의 행렬식은 −1이라 반사를 포함합니다. 여기서는 회전과 반사를 모두 포함하는 길이 보존 변환으로 이해하면 됩니다.</p>
<p>한 쌍 uᵢ, vᵢ의 부호를 함께 뒤집어도 (−uᵢ)(−vᵢ)ᵀ=uᵢvᵢᵀ입니다. 같은 특잇값이 반복되는 부분에서는 입력과 출력의 기준들을 같은 직교변환으로 바꿔도 합친 행렬이 유지됩니다. 개별 열의 부호나 좌표를 유일한 의미로 해석할 수는 없습니다. 예를 들어 diag(5,2)는 처음부터 좌표축이 기준이고 배율은 5와 2입니다.</p>
</section>
<section id="svd-shapes" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">11 · reduced는 모양을 줄이며 0인 특잇값도 남을 수 있다</h2>
<p>PyTorch 2.8의 torch.linalg.svd는 U, S, Vh를 반환합니다. 실수에서 Vh는 Vᵀ입니다. S는 특잇값을 담은 길이 q=min(m,n)의 목록이며 대각 행렬 자체가 아닙니다. 기본 full_matrices=True와 False는 U와 Vh의 크기를 다르게 정합니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">3×2 입력의 설정</th><th className="p-3">U</th><th className="p-3">S</th><th className="p-3">Vh</th></tr></thead><tbody>{[["full_matrices=True","3×3","길이 2","2×2"],["full_matrices=False","3×2","길이 2","2×2"]].map((row,i)=><tr className="border-t border-border" key={i}>{row.map((cell,j)=><td className="p-3" key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
<p>A의 아래에 [0,0] 행을 붙인 3×2 입력은 S=(3,1)입니다. full 결과를 곱하려면 S를 3×2 대각 표로 채우거나 U의 앞 두 열을 써야 합니다. reduced 결과에서는 U·diag(S)·Vh의 가운데 크기가 그대로 맞습니다.</p>
<p>입력을 [[1,0],[0,0],[0,0]]으로 바꾸면 rank는 1이지만 reduced의 S는 여전히 길이 2인 (1,0)입니다. 모양에 따른 q=2와 실제 rank=1은 다릅니다. 0인 방향까지 없앤 rank 크기의 표현은 별도의 선택입니다. reduced라는 이름만 보고 0인 특잇값이 모두 제거됐다고 읽으면 안 됩니다.</p>
<p>3×2 reduced U는 UᵀU=I₂를 만족하지만 UUᵀ가 I₃일 수는 없습니다. 앞의 A에 0행을 붙인 사례에서는 UUᵀ=diag(1,1,0)입니다. 출력 공간의 세 번째 방향을 지우는 투영입니다. 정사각 행렬에서 쓰던 양쪽 역행렬 설명을 직사각 U에 그대로 옮기지 않습니다.</p>
<CitationBlock source="PyTorch 2.8 · torch.linalg.svd의 반환 크기와 경고" citeKey={1} href={SVD_DOC}>공식 문서의 q=min(m,n), U·S·Vh 규칙에 두 3×2 입력을 대입했습니다. 문서식과 크기를 확인한 계산이며 PyTorch를 실행한 결과표는 아닙니다.</CitationBlock>
</section>
<section id="low-rank" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 큰 방향 하나를 남기면 (9,9)가 되고 차이가 사라진다</h2>
<p>원래 A에서 배율 3인 첫 방향만 남기면 A₁=3q₁q₁ᵀ=[[1.5,1.5],[1.5,1.5]]입니다. x=(4,2)에 적용하면 (9,9)입니다. 생략한 부분 A−A₁은 [[0.5,−0.5],[−0.5,0.5]]이고 같은 입력에서 (1,−1)을 만듭니다.</p>
<p>표 전체의 차이를 한 수로 재는 프로베니우스 노름(Frobenius norm)은 모든 칸의 제곱을 더한 뒤 제곱근을 취합니다. 이번 차이는 √(4×0.5²)=1입니다. 다른 차이 표 E=[[1,2],[0,2]]라면 √(1+4+0+4)=3입니다. 모든 칸을 같은 비중으로 세므로 중요한 행이나 희귀 집단의 가치를 자동으로 반영하지 않습니다.</p>
<ExplainedFormula question="방향을 k개까지 남길 때 표의 제곱 오차를 가장 작게 만드는 선택은 무엇일까요?" idea="큰 특잇값부터 남긴 근사는 버린 값들의 제곱합을 오차로 갖습니다. 같은 rank 제한을 가진 모든 행렬과 비교해도 이보다 작아질 수 없다는 것이 Eckart–Young 정리입니다."
formula={String.raw`A_k=\sum_{i=1}^{k}\sigma_i u_i v_i^\top,\qquad\min_{\operatorname{rank}(B)\le k}\lVert A-B\rVert_F^2=\lVert A-A_k\rVert_F^2=\sum_{i>k}\sigma_i^2`}
annotatedFormula={String.raw`\underbrace{A_1=3q_1q_1^\top}_{\text{큰 방향 하나 보존}},\qquad\underbrace{\lVert A-A_1\rVert_F^2=1^2}_{\text{버린 배율의 제곱}}`}
operations={[{expression:String.raw`0.5^2+(-0.5)^2+(-0.5)^2+0.5^2=1`,annotation:["이번 차이 표의 네 칸을 직접 제곱해 더합니다."]},{expression:String.raw`0.4^2+0.1^2=0.17`,annotation:["특잇값 8, 3, 0.4, 0.1에서 두 방향을 남긴 다른 사례의 제곱 오차입니다."]}]}
terms={[{symbol:"Aₖ",name:"상위 방향 근사",description:"큰 순서의 k개 성분을 남깁니다. 0이 포함되면 rank는 k보다 작을 수 있습니다."},{symbol:String.raw`\lVert\cdot\rVert_F`,name:"프로베니우스 노름",description:"모든 칸의 제곱합에 제곱근을 취합니다."},{symbol:String.raw`\sum_{i>k}\sigma_i^2`,name:"생략한 제곱합",description:"남기지 않은 서로 직교하는 성분들의 오차가 더해집니다."}]}
assumptions={["전체 실수 행렬을 알고 정확한 SVD를 사용합니다.","추가 제약이 없는 rank≤k 행렬들을 같은 노름으로 비교합니다. 0≤k≤min(m,n)입니다.","희소성·음이 아닌 값·분류 성능 같은 다른 목표의 최적성을 보장하지 않습니다."]} interpretation="배율 8과 3을 남기면 제곱 오차는 0.17입니다. 8과 0.4만 남기면 3²+0.1²=9.01입니다. 이런 비교는 직관을 주며 모든 다른 rank 제한 후보에 대한 증명은 아래에서 확인합니다." />
<p>가장 크게 왜곡되는 단위 입력을 기준으로 재는 스펙트럴 노름(spectral norm)의 최적 오차는 다음 특잇값 σₖ₊₁입니다. 8, 3, 0.4, 0.1에서 두 방향을 남기면 0.4입니다. 프로베니우스 오차는 √0.17로 다릅니다. 이번 A의 rank 1 근사에서는 두 표 노름의 오차가 모두 1이지만 x=(4,2)의 출력 오차 길이는 √2입니다. 표의 오차와 특정 입력의 출력 오차를 구별합니다.</p>
<ProgressiveDetail title="다른 방향을 고른 모든 후보에도 성립하는 이유" preview="후보가 보존하는 공간을 먼저 고정하면 남은 수직 성분은 없앨 수 없습니다. 그 성분의 합으로 제곱 오차의 하한을 얻습니다."><div className="space-y-6">
<p>rank가 k 이하인 임의의 후보 B를 잡고 그 열 공간으로의 직교투영을 P라고 합시다. B의 모든 열은 그 공간에 있으므로 (I−P)B=0입니다. 따라서 A−B의 수직 성분은 (I−P)A이며 ‖A−B‖F²≥‖(I−P)A‖F²입니다. 후보의 공간 밖에 남은 차이는 그 공간 안의 숫자를 바꾸어도 없어지지 않습니다.</p>
<p>A=Σᵢσᵢuᵢvᵢᵀ에서 vᵢ들이 정규직교하므로 오른쪽은 Σᵢσᵢ²(1−‖Puᵢ‖²)입니다. pᵢ=‖Puᵢ‖²는 0과 1 사이이고 Σᵢpᵢ≤k입니다. U를 전체 정규직교 기저로 늘리면 투영의 차원만큼 합쳐진다는 사실에서 이 부등식을 얻습니다. 확장한 방향의 특잇값은 0으로 둘 수 있습니다.</p>
<p>σᵢ²가 큰 순서일 때 Σᵢσᵢ²pᵢ의 최댓값은 앞 k개에 pᵢ=1을 두는 값입니다. 작은 가중치 쪽의 양을 아직 덜 찬 큰 가중치 쪽으로 옮기면 합이 줄지 않기 때문입니다. 그러므로 어떤 B도 버린 특잇값의 제곱합보다 오차를 낮출 수 없습니다. Aₖ는 이 하한을 달성합니다.</p>
<p>스펙트럴 노름은 길이 1인 입력이 만드는 출력 길이의 최댓값입니다. k가 전체 작은 차원보다 작을 때 v₁부터 vₖ₊₁이 펼치는 공간에는 B가 0으로 보내는 단위벡터 z가 있습니다. 이 공간의 차원은 k+1인데 B의 rank는 k 이하이기 때문입니다. 따라서 ‖(A−B)z‖=‖Az‖≥σₖ₊₁입니다. Aₖ의 차이는 가장 큰 남은 배율이 정확히 σₖ₊₁이므로 이 하한도 달성합니다. 모든 방향을 남기면 두 오차는 0입니다.</p>
</div></ProgressiveDetail>
<p>Aₖ를 BC로 저장할 때 B=UₖΣₖ는 m×k, C=Vₖᵀ는 k×n입니다. Σₖ를 B에 흡수하면 저장할 숫자는 k(m+n)개입니다. 천×천에서 k=10이면 백만 개가 2만 개로 줄어 50배 차이입니다(가정). 이번 2×2에서 k=1이면 원래 4개와 근사의 4개가 같아 저장 이득은 없습니다. k(m+n)&lt;mn인지 확인해야 합니다.</p>
</section>
<section id="source-paper" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">13 · MIT 원문 문제의 같은 행렬에 계산을 대입한다</h2>
<p>MIT 18.065의 Lecture 7 자료는 상위 성분의 합으로 Aₖ를 정의하고 표의 노름으로 오차를 비교합니다. 실제 문제 2의 마지막 행렬이 [[2,1],[1,2]]입니다. 이 글의 A는 이 문제와 같은 표입니다. 원문에서 요구하는 rank 1 근사는 3q₁q₁ᵀ이고 값은 네 칸 모두 1.5입니다.</p>
<p>원문의 표 전체 오차에 적용하면 버린 특잇값 1의 제곱인 1입니다. 여기에 이 글에서 정한 입력 (4,2)를 더해 계산하면 원래 (10,8), 근사 (9,9)가 됩니다. 행렬은 원문 문제에서 가져왔고 이 입력 추적은 이해를 위해 붙인 가정 사례입니다. 원문 문제의 답과 특정 입력의 영향을 구분했습니다.</p>
<div id="paper-eckart-young"><CitationBlock source="MIT 18.065 · Lecture 7, Eckart–Young와 문제 2" citeKey={2} href={MIT_LOW}>큰 특잇값을 남기는 식과 실제 2×2 문제에 같은 수치를 대입했습니다. 비교 대상은 같은 rank 제한의 행렬이며 정해진 표 노름의 오차입니다.</CitationBlock></div>
<p>MIT 18.06SC의 Lecture 29 요약 1쪽은 Avᵢ=σᵢuᵢ를 사용합니다. 이번 첫 방향은 A(1,1)/√2=3(1,1)/√2, 둘째 방향은 A(1,−1)/√2=(1,−1)/√2입니다. 2쪽의 AᵀA에서는 같은 방향의 배율이 제곱되어 9와 1이 됩니다. 원문의 특잇값과 그 제곱인 고유값을 같은 숫자로 구분할 수 있습니다.</p>
<div id="paper-svd-lecture"><CitationBlock source="MIT 18.06SC · Lecture 29 요약, 1–2쪽" citeKey={3} href={MIT_SVD}>실제 관계 Avᵢ=σᵢuᵢ와 AᵀA를 확인했습니다. 모든 실수 행렬에서 U=V라는 주장은 하지 않으며 이번 대칭 행렬의 같은 두 방향을 대입했습니다.</CitationBlock></div>
</section>
<section id="source-code" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">14 · PyTorch의 실제 분기는 입력 모양과 bias를 확인한다</h2>
<p>PyTorch v2.8.0의 고정 revision ba56102387ef21a3b04b357e5b183d48f0afefc7에서 aten/src/ATen/native/Linear.cpp를 봅시다. 68행부터의 linear는 입력 차원, 특수 처리 경로, bias 유무를 검사합니다. 모든 입력에서 한 종류의 행렬·벡터 곱을 바로 호출하는 구조가 아닙니다.</p>
<CodeViewButton label="실제 Linear.cpp의 분기와 행렬 곱 보기" onClick={()=>sidebar.open("linear-branch",matrixCodeRefs["linear-branch"])} />
<p>특수 처리를 쓰지 않는 일반 밀집 입력을 가정하고 input=[[4,2]], weight=[[2,1],[1,2]], bias=[0,0]을 넣습니다. 입력이 2차원이고 bias가 존재하므로 89–92행의 addmm 분기를 선택합니다. 실제 인자는 bias, input, weight.t()입니다. 계산은 input·weightᵀ+bias이며 결과는 [[10,8]]입니다. bias를 [1,−1]로 바꾸면 [[11,7]]입니다(가정).</p>
<p>본문은 열벡터 Ax를 썼지만 코드는 자료를 행으로 모으고 저장한 가중치를 전치합니다. 이번 A는 대칭이라 전치해도 숫자가 같아 보입니다. 7절의 D를 weight에 넣으면 input·Dᵀ=[[10,2]]이며 input·D는 [[6,10]]이라 다릅니다. 숫자가 같은 작은 사례에서도 저장 방향을 확인해야 하는 이유입니다.</p>
<CodeViewButton label="마지막 입력 축을 남기고 펼치는 실제 보조 함수" onClick={()=>sidebar.open("linear-flatten",matrixCodeRefs["linear-flatten"])} />
<p>52–64행의 보조 함수는 마지막 축을 남기고 앞의 축을 펼쳐 계산한 뒤 다시 묶습니다. 연속된 3차원 입력과 bias가 이 경로를 쓸 때 입력 모양 (2,3,2)는 (6,2)로 펼쳐집니다. 가중치가 (2,2)이면 계산 뒤 (2,3,2)로 돌아갑니다. 마지막 2는 입력 좌표 수이며 앞의 2×3은 자료 여섯 개입니다.</p>
<p>앞 조건에 해당하지 않는 경로에는 107행의 matmul과 그 뒤 bias 덧셈이 있습니다. 별도 처리 경로도 있으므로 이 파일만으로 실제 장비에서 선택할 연산 커널이나 시간을 단정할 수 없습니다. 여기의 값은 원문 분기와 행렬식을 대조한 수동 계산이며 PyTorch 실행 측정이 아닙니다. 원문 전체, revision, SHA256, 라이선스는 이 글의 코드와 함께 보존했습니다.</p>
</section>
<section id="applications" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">15 · 표를 잘 복원해도 분류에 필요한 차이를 지울 수 있다</h2>
<p>같은 A에서 입력이 (1,−1)인지 (−1,1)인지로 두 종류를 구별한다고 합시다. 원래 출력도 각각 (1,−1), (−1,1)이라 구별됩니다. 최적인 rank 1 근사 A₁은 둘 다 (0,0)으로 보냅니다. 두 종류가 같은 비율로 나타나고 다른 정보가 없다면 압축한 출력만 보고 둘을 맞히는 정확도는 최대 1/2입니다(가정).</p>
<p>가중치 표의 압축을 선택할 때는 저장량과 표 오차에 더해 실제 과제의 오차도 확인해야 합니다. 작은 특잇값에 희귀 사례의 구별 정보가 있을 수 있습니다. 반복되거나 0에 가까운 특잇값은 개별 특이벡터를 불안정하게 만들 수 있으며 PyTorch 문서도 특이벡터를 통한 미분의 조건을 경고합니다. 분해 결과가 있다는 사실만으로 학습 과정이 안정적이라는 보장은 없습니다.</p>
<p><Link to="/cs/ai/distributional-semantics#dimensionality">분포 의미론</Link>은 단어와 문맥을 행·열로 놓고 관측 표를 줄입니다. <Link to="/cs/ai/word2vec#training">Word2Vec</Link>의 행렬 분해 해석은 학습 목표와 음성 표본 추출의 조건을 함께 읽어야 합니다. <Link to="/cs/ai/neural-network#forward">신경망</Link>에서는 학습된 표가 입력 특징을 섞습니다. 같은 곱셈이어도 표의 축과 목적이 다릅니다.</p>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">16 · 크기, 독립 방향, 사용 목적을 각각 확인한다</h2>
<p>행렬의 모양은 주고받는 좌표 수를 정하고 rank는 실제 출력의 독립 방향 수를 정합니다. SVD는 그 방향과 배율을 분리합니다. 상위 방향을 남기는 근사는 정해진 표 오차를 최소화하지만 저장량이 항상 줄거나 과제의 성능이 보존되는 것은 아닙니다.</p>
<p>실제 구현에서는 입력 축, 반환된 Vh의 방향, full과 reduced의 크기, 수치 판정 기준을 확인합니다. 여기서는 정확한 행렬 관계와 고정된 코드 경로를 다뤘습니다. 분해 알고리즘의 반복 계산, 장비별 실행 시간, 학습된 의미의 타당성은 각각 별도의 검증이 필요합니다.</p>
<ol className="list-decimal space-y-3 pl-6"><li>rank가 1인 3×2 행렬을 reduced SVD에 넣으면 S의 길이가 반드시 1이 될까요? (답: 11절)</li><li>A의 큰 방향만 남겼을 때 표의 프로베니우스 오차 1과 입력 (4,2)의 출력 오차 길이 √2가 다른 이유는 무엇일까요? (답: 12절)</li><li>표 복원에 최적인 rank 1 근사가 두 종류를 구별하는 정보를 완전히 없앨 수 있을까요? (답: 15절)</li></ol>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={matrixCodeRefs} fileTrees={{pytorch:{name:"pytorch",type:"dir",children:[{name:"aten/src/ATen/native/Linear.cpp",type:"file",path:"pytorch/aten/src/ATen/native/Linear.cpp",codeKey:"linear-branch"}]}}} projectMetas={{pytorch:{id:"pytorch",label:"PyTorch v2.8.0",badgeClass:"border-border"}}}/>
</article>;}
