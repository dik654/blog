import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import PoseidonJourneyViz from "./viz/PoseidonJourneyViz";
import { codeRefs, fileTrees, projectMetas } from "./codeRefs";
const PIN="https://github.com/HorizenLabs/poseidon2/tree/055bde3f4782731ba5f5ce5888a440a94327eaf3";
export default function ModernArticle(){const sidebar=useCodeSidebar();return <div className="space-y-16 [overflow-wrap:anywhere]">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 두 수를 섞은 결과가 맞다는 것을 확인하려 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            어떤 계산에 두 수 3과 4가 들어갑니다. 계산한 사람은 정해진 규칙으로 두 수를 섞어 결과를 공개하고 그 결과가 맞다는 증명도 만들려 합니다. 검증자는 원래 두 수를 직접
            받지 않고 증명을 확인합니다. 이때 섞는 계산이 너무 복잡하면 증명을 만드는 비용도 커집니다.
          </p>
<p className="leading-8">Poseidon은 이런 상황에서 쓰려고 만든 해시 계열입니다. 증명에 자주 쓰이는 나머지 덧셈과 곱셈으로 내부 계산을 표현합니다. 해시 자체가 원래 값을 완벽히 감추거나 영지식 증명을 만들어 주지는 않습니다. 두 수의 후보가 적으면 결과를 하나씩 계산해 추측할 수 있고, 증명 방식과 입력을 묶는 규칙은 따로 필요합니다.</p>
<p className="leading-8">먼저 17로 나눈 나머지만 사용하는 작은 계산에서 같은 3과 4를 끝까지 따라갑니다. 그다음 실제 소스의 큰 수 계산에도 3과 4를 넣어 출력과 코드의 순서를 맞춥니다. 작은 예는 내부 동작을 보기 위한 것이며 실제 안전한 설정이 아닙니다.</p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 섞는 규칙과 결과를 읽는 규칙을 함께 정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            상자 안에는 여러 수를 담은 칸이 있습니다. 이번 작은 상자는 두 칸에 3과 4를 넣고 상수를 더한 뒤 다섯제곱하고 두 칸을 서로 더해 섞습니다. 전체 두 칸을 출력하면 입력을
            되돌릴 수 있도록 설계합니다.
          </p>
<p className="leading-8">실제 해시로 사용할 때는 더 큰 내부 상태에서 일부만 읽거나 여러 입력 묶음을 반복해서 넣습니다. 내부 전체를 되돌릴 수 있다는 성질과 최종 해시에서 입력을 찾기 어렵다는 성질은 서로 다른 단계의 요구입니다.</p>
<p className="leading-8">계산 규칙이 공개되어 있으므로 같은 입력과 같은 설정을 쓴 사람은 같은 결과를 얻어야 합니다. Poseidon이라는 이름만 같고 상수나 입력 순서가 다르면 그 약속은 성립하지 않습니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 17로 나눈 나머지에서 3과 4를 추적합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            지금은 0부터 16까지의 수만 남깁니다. 18은 17을 한 번 빼서 1이 되고 −1은 17을 더해 16이 됩니다. 덧셈과 곱셈 뒤마다 이렇게 계산하는 세계를 F₁₇이라는
            유한체라고 부릅니다. 17이 소수라서 0이 아닌 수로 나누는 연산도 정의할 수 있습니다.
          </p>
<p className="leading-8">시작 상태는 (3,4)입니다. 각 칸에 상수 1과 2를 더하면 (4,6)입니다. 두 수를 각각 다섯제곱하면 4⁵=4, 6⁵=7이 됩니다. 마지막에 첫 칸은 두 수의 합, 둘째 칸은 첫 수와 둘째 수 두 배의 합으로 바꿔 (11,1)을 얻습니다.</p>
<p className="leading-8">앞으로 나오는 순열·라운드·S-box·행렬이라는 말은 이 경로의 각 역할에 붙이는 이름입니다. 숫자를 먼저 계산한 다음 이름과 실제 코드를 연결하겠습니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 같은 두 칸이 바뀌는 네 장면을 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">그림은 입력, 상수 덧셈, 다섯제곱, 두 칸 혼합의 순서입니다. 모든 수는 17로 나눈 나머지입니다. 마지막 (11,1)을 다시 시작점으로 생각하면 이런 변환을 여러 번 반복하는 모습도 그릴 수 있습니다.</p>
<p className="leading-8">실제 설정은 각 반복에서 사용할 상수와 전체 반복 횟수를 정합니다. 이 그림의 상수 (1,2)를 임의로 반복하는 계산을 실제 Poseidon이라고 부를 수는 없습니다.</p>
</div><PoseidonJourneyViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 곱셈 세 번으로 다섯제곱을 확인할 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">증명 회로는 계산의 중간값이 조건을 만족하는지 검사하는 식들의 모음입니다. 어떤 값 a의 다섯제곱을 검사하려면 u=a×a, v=u×u, y=v×a라는 세 식을 둘 수 있습니다. 이렇게 하면 큰 정수 지수를 한 번에 처리하지 않고 곱셈 세 번으로 연결합니다.</p>
<p className="leading-8">첫 칸 a=4에서는 u=16, v=1, y=4입니다. 둘째 칸 a=6에서는 u=2, v=4, y=7입니다. 이 세 중간값까지 제출한 사람이 거짓 계산을 쓰면 해당 곱셈 식에서 어긋납니다.</p>
<p className="leading-8">
            일반적인 소수체 곱셈 제약에서 비트 회전·XOR를 여러 비트 조건으로 풀어내는 비용을 줄이려는 것이 Poseidon의 출발점입니다. 다만 어떤 증명 시스템은 다섯제곱을 한 특수
            연산으로 묶을 수 있고 이진 연산을 더 직접 다룰 수도 있습니다. 같은 해시라도 증명 방식에 따라 비용이 달라집니다.
          </p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 상태·라운드·S-box·선형 혼합의 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">두 칸을 함께 부르는 말이 상태이고 칸 수를 폭 t라고 씁니다. 상수 덧셈부터 마지막 혼합까지 한 묶음을 라운드라고 합니다. 수 하나에 다섯제곱 같은 비선형 변환을 적용하는 부분은 S-box입니다. 비선형이라는 말은 덧셈과 상수배만으로 같은 변환을 만들 수 없다는 뜻입니다.</p>
<p className="leading-8">마지막 혼합은 첫 수와 둘째 수를 일정한 비율로 더합니다. 이 비율을 표로 적은 것이 행렬입니다. 이번 표는 첫 줄 (1,1), 둘째 줄 (1,2)입니다. 따라서 입력 (a,b)를 (a+b,a+2b)로 바꿉니다.</p>
<p className="leading-8">모든 칸에 S-box를 적용하는 라운드는 full round, 정해진 한 칸에만 적용하는 라운드는 partial round라고 부릅니다. 양끝에 full round를 두고 가운데에 partial round를 두는 설계가 HADES입니다. 한 칸만 비선형으로 바꾸더라도 그 뒤의 혼합은 상태 전체에 적용됩니다.</p>
</div></section>
<section id="round" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 한 라운드의 숫자와 일반식을 나란히 맞춥니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">첫 칸의 다섯제곱은 4²=16, 4⁴=256≡1, 4⁵=4입니다. 둘째 칸은 6²=36≡2, 6⁴=4, 6⁵=24≡7입니다. 이제 첫 줄의 4+7은 11이고 둘째 줄의 4+2×7은 18≡1입니다.</p>
<p className="leading-8">이 과정을 식으로 쓰면 x′=M S₅(x+c)입니다. 오른쪽부터 읽어 x에 c를 더하고 S₅를 적용한 다음 M으로 섞습니다. 행렬 곱셈과 다섯제곱의 순서를 바꾸어도 된다는 뜻은 아닙니다.</p>
</div><ExplainedFormula question="같은 3과 4가 왜 11과 1이 될까요?" idea={<>상수 덧셈, 각 칸의 다섯제곱, 두 줄의 합을 순서대로 계산합니다. 연산마다 17로 나눈 나머지를 남깁니다.</>} formula={String.raw`x'=M S_5(x+c)\pmod {17}`} annotatedFormula={String.raw`\begin{gathered}x'=M S_5(x+c)\pmod {17}\\(3,4)+(1,2)=(4,6)\\S_5(4,6)=(4,7)\\M=\begin{pmatrix}1&1\\1&2\end{pmatrix}\\M\binom{4}{7}=\binom{11}{18}\equiv\binom{11}{1}\end{gathered}`} operations={[{expression:String.raw`4^2=16,\ 4^4=1,\ 4^5=4`,annotation:["첫 칸은 제곱, 다시 제곱, 원래 값 곱셈으로 계산합니다."]},{expression:String.raw`6^2=2,\ 6^4=4,\ 6^5=7`,annotation:["둘째 칸도 같은 순서이며 모든 값은 mod 17입니다."]}]} terms={[{symbol:"x",name:"현재 상태",description:"이번에 들어온 두 수 (3,4)입니다."},{symbol:"c",name:"라운드 상수",description:"두 칸에 더할 고정값 (1,2)입니다."},{symbol:"S_5",name:"다섯제곱",description:"선택된 칸을 다섯제곱하는 비선형 연산입니다."},{symbol:"M",name:"두 칸 혼합",description:"두 줄의 계수대로 곱하고 더하는 행렬입니다."}]} assumptions={["p=17, t=2인 설명용 한 라운드입니다.","두 칸 모두 S-box를 적용하며 실제 배포의 상수와는 다릅니다."]} interpretation="순서를 바꾸거나 상수·행렬 하나를 바꾸면 일반적으로 다른 함수가 됩니다. 이 결과 자체가 암호학적 안전성의 근거는 아닙니다."/></section>
<section id="partial" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 한 칸만 다섯제곱하면 같은 입력도 10과 16이 됩니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 입력 (3,4)에 같은 상수 (1,2)를 더한 (4,6)에서 다시 시작합니다. 이번에는 첫 칸만 다섯제곱하므로 S-box를 거친 상태는 여전히 (4,6)입니다. 두 칸을 섞으면 (4+6,4+2×6)=(10,16)입니다.</p>
<p className="leading-8">full round는 두 칸의 다섯제곱에 곱셈 제약 여섯 개를 쓰고 이 partial round는 세 개를 씁니다. 둘째 칸을 다섯제곱하지 않는 것이지 둘째 칸을 출력까지 무시하는 것은 아닙니다.</p>
<p className="leading-8">여러 partial round를 full round 하나로 줄여 S-box 개수만 맞추는 변경도 안전성을 보존하지 않습니다. 연속된 비선형 합성의 차수와 확산 경로가 달라집니다. 실제 반복 수는 공격 분석을 바탕으로 정한 설정을 따라야 합니다.</p>
</div><CitationBlock source="Grassi 외 · USENIX Security 2021, 인쇄 523쪽" href="https://www.usenix.org/system/files/sec21-grassi.pdf" citeKey={1}>Figure 2의 양끝 full·중간 partial 순서와 2.2절의 같은 S-box 비용으로 라운드를 바꿀 때 생기는 보안 차이를 읽었습니다.</CitationBlock></section>
<section id="inverse" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 되돌리는 지수 13과 행렬의 역을 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">0이 아닌 F₁₇의 수는 곱셈으로 순환하는 16개 원소입니다. 이를 생성원 g의 거듭제곱 gᵏ로 쓰면 다섯제곱은 지수 k를 5k로 바꿉니다. mod 16에서 5의 역원이 있으므로 원래 k를 유일하게 찾을 수 있습니다. 일반적으로 지수 α와 p−1의 최대공약수가 1일 때 이 복원이 가능합니다.</p>
<p className="leading-8">이번 역지수는 13입니다. 5×13=65≡1 mod 16이므로 비영 원소는 다섯제곱 뒤 열세제곱하면 돌아옵니다. 0도 두 번의 거듭제곱 뒤 0입니다. 반면 제곱에서는 1과 −1=16이 모두 1이 되어 두 입력을 구별할 수 없습니다.</p>
<p className="leading-8">혼합의 역은 첫 줄 (2,−1), 둘째 줄 (−1,1)입니다. 결과 (11,1)에 적용하면 (21,−10)≡(4,7)이고, 각 칸을 열세제곱하면 (4,6)입니다. 마지막으로 상수 (1,2)를 빼면 처음의 (3,4)입니다. 가능한 289개 입력 전체에서 이 복원을 확인했습니다.</p>
</div><ExplainedFormula question="다섯제곱의 결과에서 원래 수를 복원할 수 있을까요?" idea={<>0이 아닌 수의 곱셈 주기는 16입니다. 지수 5를 곱한 효과를 되돌리는 지수 13을 찾으면 됩니다.</>} formula={String.raw`\gcd(\alpha,p-1)=1,\quad\alpha\beta\equiv1\pmod{p-1}`} annotatedFormula={String.raw`\begin{gathered}\gcd(\alpha,p-1)=1\\\alpha\beta\equiv1\pmod{p-1}\\p=17,\ \alpha=5,\ \beta=13\\5\cdot13=65=1+4\cdot16\\(x^5)^{13}=x\end{gathered}`} operations={[{expression:String.raw`x^{65}=x(x^{16})^4=x`,annotation:["0이 아닌 수에서 x¹⁶=1을 사용합니다. 0도 별도로 0에 돌아옵니다."]}]} terms={[{symbol:"p",name:"소수",description:"이번 나머지 계산의 기준 17입니다."},{symbol:"\\alpha",name:"앞으로 가는 지수",description:"이번 S-box의 지수 5입니다."},{symbol:"\\beta",name:"돌아오는 지수",description:"p−1을 기준으로 α의 역원인 13입니다."}]} assumptions={["p는 소수이고 α는 양의 정수입니다.","이 조건은 power map의 일대일 대응 조건이며 전체 해시의 안전성 조건은 아닙니다."]} interpretation="지수 2는 16과 서로소가 아니어서 1과 16이 모두 제곱 후 1이 됩니다. 0의 처리도 정의에 포함해야 합니다."/><CodeViewButton label="289개 입력과 역변환을 검산한 코드" onClick={()=>sidebar.open("toy",codeRefs["toy"])}/></section>
<section id="diffusion" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 행렬식 1만으로 충분히 섞인다고 결론 내리지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">입력의 첫 칸만 1만큼 다르면 이번 혼합 뒤에는 두 칸 모두 1만큼 달라집니다. 반면 항등행렬은 첫 칸을 첫 칸으로 그대로 옮겨 차이가 퍼지지 않습니다. 두 행렬 모두 행렬식이 0이 아니어서 되돌릴 수 있지만 섞는 성질은 다릅니다.</p>
<p className="leading-8">차이가 난 칸 수를 세는 분기 수가 t+1에 도달한 행렬을 MDS라고 부릅니다. 이번 두 칸에서는 최댓값 3입니다. 한 칸 차이는 두 칸으로 퍼지고, 두 칸 차이는 가역성 때문에 적어도 한 칸에 남으므로 합이 항상 3 이상입니다. (1,0)의 예가 정확히 3이어서 최솟값도 3입니다.</p>
<p className="leading-8">일반적인 MDS 판정은 모든 정사각 부분행렬이 가역인지 보는 것과 같습니다. 이번 2×2 표에서는 네 개의 원소와 전체 행렬식 1이 모두 0이 아닙니다. 전체 행렬식 하나만 확인하는 검사보다 강한 조건입니다.</p>
<p className="leading-8">그래도 안전한 반복 설계가 자동으로 얻어지지는 않습니다. 일부 차이들의 집합이 여러 라운드에 걸쳐 비선형 칸을 피하는 경로가 생길 수 있습니다. 2021년 원문도 MDS 행렬에 추가적인 부분공간 경로 검사를 요구합니다. 작은 예의 분기 수를 실제 모든 공격에 대한 안전성으로 확대할 수 없습니다.</p>
</div><ExplainedFormula question="가역인 행렬은 모두 같은 정도로 잘 섞을까요?" idea={<>입력 차이의 0이 아닌 칸 수와 출력 차이의 0이 아닌 칸 수를 더해 가장 작은 경우를 봅니다.</>} formula={String.raw`B(M)=\min_{v\ne0}\{\operatorname{wt}(v)+\operatorname{wt}(Mv)\}`} annotatedFormula={String.raw`\begin{gathered}B(M)=\min_{v\ne0}\bigl(\operatorname{wt}(v)+\operatorname{wt}(Mv)\bigr)\\M=\begin{pmatrix}1&1\\1&2\end{pmatrix}:B(M)=3\\I=\begin{pmatrix}1&0\\0&1\end{pmatrix}:B(I)=2\end{gathered}`} operations={[{expression:String.raw`\begin{gathered}M(1,0)^T=(1,1)^T\\1+2=3\end{gathered}`,annotation:["한 칸의 차이가 두 출력 칸에 퍼집니다."]},{expression:String.raw`\begin{gathered}M(1,-1)^T=(0,-1)^T\\2+1=3\end{gathered}`,annotation:["서로 상쇄되는 차이도 합계가 3 아래로 내려가지 않습니다."]}]} terms={[{symbol:"v",name:"입력 차이",description:"0벡터를 제외한 두 입력 사이의 차이입니다."},{symbol:"\\operatorname{wt}",name:"0이 아닌 칸 수",description:"값의 크기가 아니라 차이가 존재하는 칸을 셉니다."},{symbol:"B",name:"분기 수",description:"모든 비영 차이 중 입력·출력 칸 수 합의 최솟값입니다."}]} assumptions={["이번 행렬과 연산은 F₁₇의 두 칸입니다.","MDS 조건은 t칸에서 분기 수 t+1이며 다중 라운드 보안과는 별도입니다."]} interpretation="항등행렬은 행렬식 1로 가역이지만 한 칸 차이를 한 칸에만 남겨 분기 수가 2입니다."/><CitationBlock source="Grassi 외 · USENIX Security 2021, 인쇄 524쪽" href="https://www.usenix.org/system/files/sec21-grassi.pdf" citeKey={1}>각주 7의 분기 수·소행렬 조건과 Avoiding Insecure Matrices의 추가 검사를 본문 및 페이지 이미지에서 대조했습니다.</CitationBlock></section>
<section id="projection" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 전체 상태의 역과 한 칸짜리 해시의 역은 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">전체 두 칸은 17×17=289가지입니다. 방금 확인한 라운드는 이 289가지 상태를 중복 없이 다른 289가지 상태로 옮기는 순열입니다. 출력 두 칸을 모두 알면 역변환으로 입력을 찾을 수 있습니다.</p>
<p className="leading-8">이제 첫 출력 칸만 읽는다고 해 봅시다. 첫 칸이 11인 출력은 둘째 칸에 0부터 16까지 들어갈 수 있어 17가지입니다. 각 전체 출력마다 원래 입력이 하나씩 있으므로 첫 칸 11을 만드는 입력도 정확히 17개입니다. 계산해 보아도 모든 첫 칸 값에 입력이 17개씩 대응합니다.</p>
<p className="leading-8">실제 해시는 큰 내부 상태와 충분한 라운드, 어떤 칸을 읽을지 정한 규칙을 사용해 원하는 공격을 어렵게 만듭니다. 입력 후보가 적거나 너무 적은 칸·비트를 비교하면 그 보장은 줄어듭니다. 이 작은 전수 계산은 순열과 해시의 차이를 보여 주며 안전한 해시를 제공하지 않습니다.</p>
</div></section>
<section id="profile" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 실제 코드에 넣을 같은 3과 4의 설정을 고정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이제 HorizenLabs/poseidon2의 commit 055bde3f4782731ba5f5ce5888a440a94327eaf3을 읽습니다. 해당 저장소의 plain_implementations 패키지 이름은 zkhash이고 버전은 0.2.0입니다. 원래 Poseidon과 Poseidon2를 모두 담고 있어 같은 입력으로 비교할 수 있습니다.</p>
<p className="leading-8">선택한 모듈 이름은 bn256이지만 실제 나머지 기준은 BN254의 스칼라체 소수 <code>21888242871839275222246405745257275088548364400416034343698204186575808495617</code>입니다. 곡선 점의 좌표를 계산할 때 쓰는 다른 소수와 혼동하면 안 됩니다. 코드의 타입 이름만 보지 않고 modulus 선언을 확인했습니다.</p>
<p className="leading-8">이번 상태는 세 칸 [3,4,0]입니다. 두 구현의 설정은 폭 3, 지수 5, full round 8개, partial round 56개입니다. 하지만 각 구현의 상수와 혼합 방식은 다릅니다. 2021년 원논문의 표 1에 있는 폭 3 예는 partial round 57개이므로 그 표의 비용을 이 소스에 그대로 옮기지 않습니다.</p>
</div><CodeViewButton label="원문의 실제 소수와 타입" onClick={()=>sidebar.open("field",codeRefs["field"])}/><CodeViewButton label="원래 Poseidon의 상수와 3·5·8·56 설정" onClick={()=>sidebar.open("profile",codeRefs["profile"])}/><CodeViewButton label="Poseidon2의 별도 상수와 설정" onClick={()=>sidebar.open("profile2",codeRefs["profile2"])}/></section>
<section id="source" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 최적화 전 원문에서 같은 상태의 64라운드를 따라갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">poseidon.rs의 permutation_not_opt는 입력 길이가 세 칸인지 검사한 뒤 상태를 복사합니다. 앞 네 번은 add_rc → sbox → matmul입니다. 가운데 56번은 add_rc 뒤 current_state[0]만 다섯제곱하고 전체 행렬을 곱합니다. 끝 네 번은 다시 모든 칸을 다섯제곱합니다.</p>
<p className="leading-8">sbox_p의 지수 5 분기는 입력을 제곱하고, 그 값을 다시 제곱한 다음 원래 입력을 곱합니다. 작은 예의 u·v·y와 같은 순서입니다. 실제로는 큰 소수로 나눈 나머지를 ark-ff의 체 타입이 계산합니다.</p>
<p className="leading-8">보존한 원문을 Rust 1.93.0과 ark-ff 0.4.2로 호출한 [3,4,0]의 첫 출력 칸은 <code>06754456dfbc91b8461e1cac192d8737e6dbbec4bd337a789b73c79f4dc605ec</code>입니다. 이는 정수를 64자리 16진수로 표시한 것이며 이 글이 네트워크 바이트 순서를 새로 정했다는 뜻은 아닙니다.</p>
<p className="leading-8">별도로 작성한 Python 계산은 같은 상수 파일을 읽어 64라운드의 상수 덧셈 직후·거듭제곱 직후·혼합 직후 상태를 모두 남깁니다. 최종 세 칸 전체가 네이티브 실행과 같았습니다. 공개 코드 창에서 한 라운드의 순서와 전체 호출 예제를 대조할 수 있습니다.</p>
</div><CodeViewButton label="원문의 앞 4·중간 56·끝 4라운드" onClick={()=>sidebar.open("plain",codeRefs["plain"])}/><CodeViewButton label="원문의 제곱·제곱·곱셈" onClick={()=>sidebar.open("power",codeRefs["power"])}/><CodeViewButton label="실제로 실행한 선택 모듈 호출 예제" onClick={()=>sidebar.open("native",codeRefs["native"])}/></section>
<section id="optimized" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 계산을 옮겨도 결과는 같아야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 파일의 permutation은 중간 구간을 최적화합니다. 앞의 네 full round 뒤에 변환한 상수와 별도 행렬을 먼저 적용하고, partial round에서는 첫 칸의 S-box와 일부 상수 덧셈·cheap_matmul을 사용합니다. 최적화 전 코드의 각 줄과 일대일로 같은 중간 상태를 가진다고 보면 안 됩니다.</p>
<p className="leading-8">cheap_matmul은 첫 칸을 여러 칸의 합으로 만들고 나머지 칸은 원래 값에 첫 칸의 상수배를 더합니다. 이 구조와 변환한 상수를 함께 써야 합니다. 상수만 원래 것으로 돌리거나 행렬만 바꾸는 혼합은 동일한 함수를 보존하지 않습니다.</p>
<p className="leading-8">실제로 [3,4,0], [0,1,2], 모두 0, 모두 1, 모두 p−1의 다섯 입력에서 최적화 전후 세 칸이 전부 같았습니다. 이 결과는 다섯 사례의 대조이며 모든 입력의 동치 증명이나 실행 시간 측정은 아닙니다.</p>
</div><CodeViewButton label="변환한 상수와 역순 cheap_matmul 호출" onClick={()=>sidebar.open("optimized",codeRefs["optimized"])}/></section>
<section id="poseidon2" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. Poseidon2는 시작부터 같은 3과 4를 다르게 섞습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">Poseidon2의 permutation은 첫 라운드 상수를 더하기 전에 외부 혼합을 한 번 적용합니다. 세 칸 [3,4,0]의 합은 7이고 각 칸에 이 합을 더하므로 시작 상태가 [10,11,7]로 바뀝니다. 원래 Poseidon에 없던 단계입니다.</p>
<p className="leading-8">이 설정의 full round에서는 외부 혼합을 쓰고 partial round에서는 내부 혼합을 씁니다. 세 칸을 a,b,c라고 할 때 외부 혼합은 합 s=a+b+c를 각 칸에 더합니다. 내부 혼합은 (a+s,b+s,2c+s)여서 마지막 칸의 비율이 다릅니다. partial round의 상수도 첫 칸에만 더합니다.</p>
<p className="leading-8">같은 [3,4,0]을 넣은 Poseidon2의 첫 출력 칸은 <code>0f2021db8d04204e74cec23e5bd3fe4562e2cac46ab33fe7310325c5b0d0b1eb</code>입니다. 원래 Poseidon의 출력과 다르므로 이름 뒤에 2가 붙은 구현을 기존 루트 계산에 그대로 교체할 수 없습니다.</p>
<p className="leading-8">이 선형 계산의 변경은 실제 CPU 연산과 증명 형식에 따라 다른 비용 차이를 만듭니다. 이번에는 결과와 경로를 확인했으며 속도 향상률이나 증명 크기를 측정하지 않았습니다.</p>
</div><CodeViewButton label="원문의 초기 혼합과 full·partial 경로" onClick={()=>sidebar.open("poseidon2",codeRefs["poseidon2"])}/><CodeViewButton label="세 칸에서 외부·내부 행렬을 계산하는 원문" onClick={()=>sidebar.open("mix2",codeRefs["mix2"])}/></section>
<section id="constraints" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 같은 설정의 240을 전체 증명 비용과 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">일반적인 이차 곱셈 제약으로 다섯제곱 하나를 세 식으로 표현한다고 합시다. 폭 3에서 full round 8개는 S-box 8×3=24개이고 partial round 56개는 56개입니다. 합계 80개에 제약 세 개씩 쓰므로 비선형 곱셈 제약은 240개입니다.</p>
<p className="leading-8">비교를 위해 같은 64라운드를 모두 full round로 바꾸었다고 가정하면 64×3×3=576개입니다. 이는 비용을 설명하는 가상 비교이며 그렇게 고친 설정의 보안을 인정한 것이 아닙니다. 원논문의 partial round 57개 예에서는 같은 계산이 3×(8×3+57)=243이 됩니다.</p>
<p className="leading-8">상수 덧셈과 상수배는 R1CS의 선형 결합에 들어갈 수 있어서 이 비선형 곱셈 수에 더하지 않았습니다. 그렇다고 CPU의 덧셈·메모리 접근·증명 작성 시간이 0이라는 뜻은 아닙니다. 특수 gate, lookup, 여러 연산을 묶는 최적화와 입력 검사 비용도 별도로 고려해야 합니다.</p>
<p className="leading-8">R1CS는 두 선형 결합의 곱이 다른 선형 결합과 같다는 식으로 제약을 쓰는 형식입니다. 이번 240은 그 형식으로 직접 전개한 비선형 부분의 계산값입니다. 실제 회로를 컴파일하거나 증명을 생성해 측정한 숫자는 아닙니다.</p>
</div></section>
<section id="constraint-failure" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 마지막 곱셈 조건 하나를 빼면 잘못된 결과가 통과합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">첫 칸 4의 다섯제곱을 다시 봅시다. 올바른 중간값은 u=16, v=1, y=4입니다. 만약 회로에 u=a×a와 v=u×u만 쓰고 마지막 y=v×a 조건을 빼면 y는 앞의 계산과 연결되지 않습니다.</p>
<p className="leading-8">이 잘못된 회로에서는 y=5라고 제출해도 앞의 두 식을 만족합니다. 둘째 칸의 올바른 결과 7과 섞으면 (5+7,5+2×7)=(12,2)가 됩니다. 원래 출력 (11,1)과 다르지만 빠진 조건을 검사하지 않으면 거부할 근거가 없습니다.</p>
<p className="leading-8">이 사례는 Poseidon을 해독한 공격이 아닙니다. 구현한 증명 관계가 의도한 계산과 달라진 것입니다. 네이티브 해시의 알려진 출력만 맞추는 검사에 더해 실제 회로에서 중간값·입력 범위·공개 출력의 연결을 확인해야 합니다.</p>
</div></section>
<section id="encoding" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 숫자 두 개의 압축과 임의 바이트 해시를 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">원문의 compress는 왼쪽과 오른쪽 두 체 원소 뒤에 0을 붙여 [left,right,0]을 만들고 순열 결과의 첫 칸을 읽습니다. 실제 [3,4] 호출도 앞서 계산한 [3,4,0]의 첫 칸과 일치했습니다. 이 함수 자체가 임의 길이 문자열의 패딩이나 스펀지를 구현한 것은 아닙니다.</p>
<p className="leading-8">바이트에서 체 원소를 만들 때는 길이·바이트 순서·유효 범위를 정해야 합니다. 작은 F₁₇에서 정수 20을 나머지로 바꾸면 3과 구별하지 못합니다. 0부터 16까지만 허용하는 정규 인코딩이라면 20을 거부해야 합니다. 어느 규칙을 선택했는지 입력을 만드는 쪽과 검사하는 쪽이 같아야 합니다.</p>
<p className="leading-8">원문의 from_hex는 from_be_bytes_mod_order로 큰 자리부터 읽고 소수로 나눈 나머지를 취합니다. 여기서는 고정 상수를 읽는 도구입니다. 이 함수를 그대로 외부 메시지의 정규 인코딩 검사라고 부를 수 없습니다. 이번 검산은 읽은 상수들이 모두 소수보다 작은지도 별도로 확인했습니다.</p>
<p className="leading-8">스펀지로 쓰려면 직접 입력을 넣고 읽는 rate와 나머지 capacity, 마지막 입력의 패딩, 용도 태그와 출력 규칙을 더 정합니다. capacity는 비밀키가 아니며 알려진 입력의 전체 상태는 누구나 계산할 수 있습니다. 같은 숫자 쌍을 잎과 내부 노드 등 다른 용도에 쓸 때의 구별도 프로토콜이 정해야 합니다. 일반 구조는 <Link to="/cs/crypto/hash-theory#sponge">같은 abc를 넣은 스펀지 설명</Link>과 이어집니다.</p>
</div><CodeViewButton label="두 원소 뒤에 0을 붙이고 첫 칸을 읽는 원문" onClick={()=>sidebar.open("compress",codeRefs["compress"])}/><CodeViewButton label="고정 상수를 나머지로 바꾸는 from_hex" onClick={()=>sidebar.open("decode",codeRefs["decode"])}/></section>
<section id="security" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. 최신 공격은 목표와 설정을 먼저 읽습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">새 공격을 읽을 때는 공격자가 자유롭게 고를 수 있는 입력과 목표 출력, 체의 크기, 라운드 수, 혼합 행렬과 사용 방식을 함께 확인합니다. 라운드를 줄인 문제의 해를 찾는 성과와 실제 설정의 보안 목표를 낮추는 분석은 구별해야 합니다.</p>
<p className="leading-8">2023/537의 저자 초록은 높은 보안 목표에서 원래 분석이 어긋나는 사례를 보고합니다. 384비트 수준부터 문제가 시작되고 1024비트를 목표로 한 한 사례의 추정 공격 비용은 731.77비트라고 설명합니다. 따라서 이 논문을 단순히 축소 라운드 공격이라고만 요약하면 중요한 조건을 놓칩니다. 이 수치를 이번 소스의 설정이나 실제 서비스 전체에 그대로 적용할 수도 없습니다.</p>
<p className="leading-8">2025년 ToSC 연구는 부분공간 경로를 이용하는 대수적 분석을 다시 검토하며 실제 설정에 따라 필요한 라운드를 과소평가하거나 과대평가할 수 있음을 설명합니다. 또한 입력 일부와 출력 일부를 고정하는 문제와 압축 모드의 역상 문제를 구별합니다. 저자 초록은 제시한 공격에 대한 전체 안전성을 유지한다고 설명하며 모든 미래 공격에 대한 증명을 주장하지 않습니다.</p>
<p className="leading-8">2025년 10월의 2025/1916 연구는 라운드를 줄인 순열과 입력·출력에 제약을 둔 문제를 대상으로 합니다. 근을 찾아내는 계산을 개선하면서 변환 과정의 메모리 접근 비용도 분석합니다. 이를 임의 서비스에서 쓰는 전체 해시의 충돌을 찾았다는 결론으로 바꾸어 읽을 수 없습니다.</p>
<p className="leading-8">2026년 2월의 2026/306 연구는 Poseidon2와 Poseidon2b의 특정 혼합 행렬 구조와 작동 모드를 함께 분석합니다. 저자는 압축·스펀지의 역상 찾기가 대응하는 입력·출력 제약 문제보다 쉬운 사례를 제시하고, 알려진 대수적 충돌 공격의 비용도 낮춥니다. 그러나 분석상 여유 때문에 이 개선이 곧 목표 보안 수준 미달을 뜻하지는 않는다고 명시합니다. 이 글에서는 두 연구의 공식 초록까지 확인했고 PDF 전문이나 공격 코드를 직접 실행하지 않았습니다.</p>
</div><CitationBlock source="Ashur·Buschman·Mahzoun · ePrint 2023/537, 2023-11-21판 초록" href="https://eprint.iacr.org/2023/537" citeKey={3}>높은 보안 목표의 원래 분석 수정이라는 범위를 확인했습니다. 후속 PDF 전문은 접근 오류로 열지 못했습니다.</CitationBlock><CitationBlock source="Grassi·Koschatko·Rechberger · ToSC 2025(2), 34–86쪽의 공식 초록" href="https://research.tue.nl/nl/publications/poseidon-and-neptune-gr%C3%B6bner-basis-cryptanalysis-exploiting-subsp/" citeKey={4}>DOI 10.46586/tosc.v2025.i2.34-86의 발표 정보와 작동 모드에 관한 초록을 대조했습니다. PDF 전문은 미열람입니다.</CitationBlock><CitationBlock source="Zhao·Sanso·Vitto·Ding · ePrint 2025/1916 공식 초록" href="https://eprint.iacr.org/2025/1916" citeKey={5}>라운드를 줄인 순열과 입력·출력 제약 문제라는 범위 및 메모리 비용 분석의 존재를 확인했습니다. PDF 전문과 공격 실행은 미검증입니다.</CitationBlock><CitationBlock source="Merz·Rodríguez García · ePrint 2026/306 공식 초록" href="https://eprint.iacr.org/2026/306" citeKey={7}>특정 행렬·압축·스펀지 모드의 공격 개선과 목표 보안 미달을 구분하는 저자의 설명을 확인했습니다. PDF 전문과 공격 실행은 미검증입니다.</CitationBlock></section>
<section id="binary" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 2026년에는 증명 방식과 해시를 함께 바꾸는 설계도 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">선택지는 소수체 해시로 바꾸거나 기존 비트 해시를 유지하는 두 가지로만 나뉘지 않습니다. 2026년 CIC에 발표된 Poseidon(2)b는 이진 확장체에서 동작하는 별도 설계를 다룹니다. 0과 1을 계수로 하는 다항식의 세계에 맞춰 해시와 Binius 같은 증명 시스템을 함께 고려합니다.</p>
<p className="leading-8">이진 확장체에서는 덧셈·곱셈과 가능한 대수적 공격의 성질이 소수체와 다릅니다. 소수체의 설정을 옮겨 적는 것만으로 안전한 이진 버전을 얻는다고 볼 수 없습니다. 공식 초록도 해당 체에서 추가로 생기는 공격 경로를 재검토한다고 설명합니다.</p>
<p className="leading-8">확인한 ePrint 2025/1893의 최신 표시는 2026년 2월 6일입니다. 저자는 출판본과 비교해 128비트 Binius 구현 문제를 수정했다고 별도로 적었습니다. 따라서 논문 제목뿐 아니라 어느 판과 어느 구현을 비교했는지 남겨야 합니다. 이 글에서는 해당 초록과 수정 안내를 읽었고 그 구현이나 성능 수치를 직접 재현하지 않았습니다.</p>
</div><CitationBlock source="Poseidon(2)b · CIC 2026 및 2026-02-06 수정 ePrint" href="https://eprint.iacr.org/2025/1893" citeKey={6}>출판 DOI 10.62056/a66ce0zn4와 이진 확장체 설계, 출판본 이후 구현 수정 안내를 확인했습니다.</CitationBlock></section>
<section id="verification" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">21. 원문 실행·작은 전수 검사·증명 실행의 범위를 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">실제 실행은 보존한 Rust 원문 중 선택한 모듈을 별도 호출 예제에 연결했습니다. Cargo.lock으로 의존성을 고정하고 --locked 실행을 다시 수행해 같은 결과를 얻었습니다. 원래 zkhash 패키지 전체나 모든 feature·체·시험 모듈을 실행한 것은 아닙니다.</p>
<p className="leading-8">다섯 입력의 Poseidon 최적화 전후 일치, Poseidon2의 결과, 원문에 적힌 [0,1,2]의 알려진 출력과 압축 호출을 확인했습니다. 자체 Python 모형은 두 방식의 라운드를 직접 계산해 네이티브 결과의 세 칸 전체와 대조했습니다. 작은 F₁₇에서는 289개 입력의 순열·역변환과 출력 첫 칸의 역상 수, 분기 수와 잘못된 제약 예를 전수 또는 직접 계산했습니다.</p>
<p className="leading-8">이 검산에는 실제 영지식 증명 생성과 검증, 회로 컴파일, 상수 시간 분석이나 성능 측정이 포함되지 않습니다. 배포 판단에서는 사용할 회로와 바이트 형식·용도 태그를 고정한 뒤 잘못된 상수와 범위 밖 입력, 네이티브와 회로의 불일치를 거부하는지 확인해야 합니다.</p>
<p className="leading-8">원문 파일과 라이선스, 파일 해시, 호출 코드와 관측 결과를 함께 보존했습니다. 보안 연구의 확인 날짜는 2026년 10월 4일이며, 읽은 원논문 본문과 후속 연구의 공식 초록 범위를 구분했습니다.</p>
</div><CodeViewButton label="독립 계산과 관측 결과를 비교하는 코드" onClick={()=>sidebar.open("checks",codeRefs["checks"])}/><CitationBlock source="HorizenLabs · poseidon2 055bde3 고정 원문" href={PIN} citeKey={2}>원래 Poseidon과 Poseidon2의 선택 모듈, 상수, 실제 실행 결과를 함께 보존했습니다.</CitationBlock></section>
<section id="limits" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">22. 같은 두 수에서 바뀔 결과를 예측합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">작은 3과 4는 상수 덧셈과 다섯제곱, 두 칸 혼합을 거쳐 11과 1이 되었습니다. 한 칸만 다섯제곱하면 10과 16이 되었고, 전체 출력은 되돌릴 수 있어도 한 칸만 읽으면 여러 입력이 겹쳤습니다.</p>
<p className="leading-8">실제 소스에서는 같은 숫자를 큰 체의 세 칸 [3,4,0]에 넣었습니다. 원래 Poseidon의 최적화 전후는 같았고 Poseidon2는 다른 결과였습니다. 계산에 붙는 이름보다 같은 입력·상수·순서·출력 규칙을 확인해야 하는 이유입니다.</p>
</div><ReviewPrompts questions={["같은 (3,4)에서 둘째 칸의 다섯제곱을 생략하면 출력은 어떻게 달라질까요? (답: 8절)","다섯제곱의 마지막 곱셈 제약을 빼면 왜 (12,2)가 통과할 수 있을까요? (답: 17절)","20을 F₁₇의 원소로 받을 때 단순 나머지 변환과 정규 입력 검사는 어떻게 다를까요? (답: 18절)"]}/></section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></div>;}
