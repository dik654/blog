import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ModernFrobeniusViz from "./viz/ModernFrobeniusViz";
import { codeRefs, fileTrees } from "./codeRefs";

export default function ModernFrobeniusArticle(){const sidebar=useCodeSidebar();return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 세 번 곱할 일을 둘째 숫자 하나의 변경으로 바꿉니다</h2>
<p>숫자는 0·1·2의 나머지로 계산하고 u²=2라고 정합시다. 같은 값 1+u의 세제곱을 구하려면 보통 제곱한 뒤 한 번 더 곱합니다. 그런데 이 계산에서는 1은 그대로 두고 u의 계수 1만 2로 바꾸면 답 1+2u를 얻습니다.</p>
<p>왜 이런 간단한 규칙이 가능한지 같은 입력으로 확인하겠습니다. 그다음 같은 값을 다른 두 숫자로 표현하면 규칙도 어떻게 바뀌어야 하는지 봅니다. 마지막에는 실제 코드와 페어링의 큰 지수 계산에 이 원리를 적용합니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 같은 두 칸의 값을 받아 세제곱한 두 칸을 돌려줍니다</h2>
<p>a+bu를 두 칸 [a,b]로 저장합니다. 이번 계산기의 입력은 [1,1]이고 원하는 출력은 같은 기저로 표현한 세제곱입니다. 계수의 나머지 기준 3과 u²=2라는 규칙은 계산 내내 같습니다.</p>
<p>빠른 방법을 쓰더라도 출력의 수학적 의미는 직접 세제곱과 같아야 합니다. 두 번 실행하면 원래 값으로 돌아온다는 성질도 확인할 수 있지만, 그 검사만 통과했다고 올바른 세제곱이라고 결론 내릴 수는 없습니다.</p>
</section>
<section id="concrete" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 1+u를 직접 곱해 1+2u를 얻습니다</h2>
<p>설명용 입력은 x=1+u, 규칙은 u²=2, 계수는 3의 나머지입니다(가정). 제곱하면 (1+u)²=1+2u+u²=2u입니다. 여기서 1+2=0이 되었습니다. 여기에 1+u를 한 번 더 곱하면 2u+2u²=2u+4=1+2u입니다.</p>
<p>다른 길로는 처음부터 (1+u)³=1+3u+3u²+u³라고 펼칠 수 있습니다. 가운데 두 계수 3이 0이 되고 u³=2u이므로 같은 답입니다. 이 소거가 입력 1+u에만 우연히 일어나는지부터 확인해야 빠른 규칙으로 바꿀 수 있습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 같은 입력을 어떤 기저의 두 숫자로 읽는지 표시합니다</h2>
<ModernFrobeniusViz />
<p>처음 두 장면의 [1,2]는 1+2u입니다. 세 번째 장면의 [2,2]도 기저가 달라 같은 값을 뜻합니다. 마지막 장면처럼 기저만 바꾸고 표는 복사하면 같은 두 칸 모양으로 틀린 답을 만들 수 있습니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 큰 지수를 반복 계산하는 대신 기저의 변화를 재사용합니다</h2>
<p>지수가 3인 사례는 손으로 쉽게 계산했습니다. 하지만 암호용 바탕 소수 p는 수십 자리이고 p제곱을 일반 거듭제곱으로 계산하면 많은 제곱과 곱셈을 반복합니다. 기저 하나하나가 p제곱에서 어디로 가는지 미리 알고 있으면 매번 큰 지수를 풀 필요가 없습니다.</p>
<p>대신 표는 특정 소수와 기저에 대한 표입니다. 같은 크기의 배열이나 같은 타입 이름만 보고 다른 기저의 표를 붙일 수는 없습니다. 계산을 줄이려면 무엇을 미리 계산했고 어떤 조건에서 재사용하는지 함께 기록해야 합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. p제곱 사상과 특성, 기저에 이름을 붙입니다</h2>
<p>1을 p번 더하면 0이 되는 체의 성질을 특성 p라고 부릅니다. 지금은 특성이 3입니다. p제곱을 취하는 함수 φ(x)=xᵖ를 Frobenius 사상이라고 합니다. 여기서 φ는 이름을 짧게 적는 그리스 문자입니다.</p>
<p>1과 u처럼 값을 유일한 계수들로 표현하는 기준은 기저입니다. 바탕 체 F₃의 계수 두 개가 필요하므로 현재 공간은 F₃ 위 차수 2인 F₉입니다. 계수는 아홉 원소 중 어떤 값을 뜻하는지 알려 주지만 기저를 빼고 숫자 두 개만 전달하면 의미가 정해지지 않습니다.</p>
<p>덧셈과 곱셈을 보존하면서 모든 원소를 일대일로 다시 배치하는 함수를 체의 자기동형이라고 합니다. Frobenius가 유한체에서 이 성질을 가진다는 것을 증명하면 입력마다 다시 긴 전개를 하지 않고 같은 변환 규칙을 사용할 수 있습니다.</p>
</section>
<section id="coeff-rearrange" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 가운데 이항계수가 사라져 합을 항별로 세제곱합니다</h2>
<ExplainedFormula question="1+u에서 본 소거가 다른 두 값의 합에서도 성립하나요?" idea="특성이 소수 p이면 가운데 이항계수는 모두 p의 배수입니다. 그 계수들이 0이 되어 양 끝의 두 항만 남습니다."
formula={String.raw`\varphi(a+b)=a^p+b^p,\quad\varphi(ab)=a^pb^p`}
annotatedFormula={String.raw`\begin{gathered}\varphi(x)=x^p\\\varphi(a+b)=a^p+b^p\\\varphi(ab)=a^pb^p\\(1+u)^3=1+u^3=1+2u\end{gathered}`}
operations={[{expression:String.raw`\binom pi=\frac{p!}{i!(p-i)!}`,annotation:["0<i<p에서 분모에는 p의 인수가 없고 분자에는 p가 있습니다.","따라서 이 정수는 p로 나누어떨어집니다."]},{expression:String.raw`(ab)^p=a^pb^p`,annotation:["체의 곱셈은 순서를 바꿀 수 있어 두 값의 p제곱을 모을 수 있습니다."]}]}
terms={[{symbol:"p",name:"체의 특성인 소수",description:"계수에 p의 배수가 붙으면 0이 됩니다."},{symbol:"a,b",name:"같은 체의 두 원소",description:"바탕 체의 숫자에 한정하지 않고 확장체 원소도 포함합니다."}]}
assumptions={["소수 특성인 체에서 같은 연산을 사용합니다.","구현의 저장 방식이 달라도 해석한 수학적 값은 같은 식을 만족해야 합니다."]} interpretation="φ는 0과 1도 보존합니다. 덧셈·곱셈 보존은 변환의 수학적 성질이며 특정 메모리 순서나 표가 맞는다는 증거는 아닙니다." />
<p>또 xᵖ=yᵖ라면 (x−y)ᵖ=0입니다. 체에서는 0 아닌 값의 거듭제곱이 0일 수 없으므로 x=y입니다. 따라서 이 사상은 일대일입니다. 원소가 유한하므로 일대일 함수는 전체를 다시 채우며 자기동형이 됩니다.</p>
<p>합성수 6의 나머지에서 같은 말을 기계적으로 적용하면 안 됩니다. (1+1)⁶의 나머지는 4인데 1⁶+1⁶의 나머지는 2입니다. 앞 증명에서 어떤 수를 특성인 소수 p로 두었는지가 실제 조건입니다.</p>
</section>
<section id="cycle" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 두 번 돌아오는 이유와 먼저 고정되는 값을 구분합니다</h2>
<p>F₃의 a와 b는 세제곱해도 그대로입니다. u³=2u이므로 φ(a+bu)=a+2bu입니다. 다시 적용하면 a+4bu=a+bu입니다. 같은 x는 1+u→1+2u→1+u의 순서로 돌아옵니다.</p>
<ExplainedFormula question="확장 차수 k와 원복 횟수는 어떤 관계인가요?" idea="0 아닌 원소는 크기 pᵏ−1의 곱셈군에 들어 있으므로 pᵏ−1제곱이 1입니다. 0도 따로 확인하면 모든 값의 pᵏ제곱이 자기 자신입니다."
formula={String.raw`\varphi^j(x)=x^{p^j},\quad\varphi^k(x)=x`}
annotatedFormula={String.raw`\begin{gathered}x\in F_{p^k},\quad\varphi^j(x)=x^{p^j}\\\varphi^k(x)=x^{p^k}=x\\1+u\longmapsto1+2u\longmapsto1+u\end{gathered}`}
operations={[{expression:String.raw`x^{p^k-1}=1\quad(x\ne0)`,annotation:["0 아닌 원소의 곱셈군 크기를 사용합니다."]},{expression:String.raw`0^{p^k}=0`,annotation:["군에 없는 0도 같은 원복 식을 만족합니다."]}]}
terms={[{symbol:"k",name:"바탕 소수체 위 차수",description:"F₉에서는 p=3이고 k=2입니다."},{symbol:"j",name:"반복 횟수",description:"φ 두 번은 x의 p²제곱입니다. x의 2p제곱과 다릅니다."}]}
assumptions={["x와 표가 같은 유한체에 속합니다.","원소 하나의 최소 원복 주기는 k를 나누며 k보다 작을 수 있습니다."]} interpretation="F₃의 0·1·2는 이미 한 번에 고정됩니다. 마찬가지로 Fₚ¹²의 모든 원소가 정확히 열두 번 뒤에만 돌아온다는 뜻은 아닙니다." />
<p>원복 검사만으로 올바른 φ를 고를 수는 없습니다. 모든 값을 그대로 두는 항등 함수도 두 번 뒤에 돌아오고 덧셈·곱셈을 보존합니다. 그런데 x=1+u의 진짜 세제곱은 x와 다릅니다. 직접 p제곱과 비교하는 검사가 따로 필요합니다.</p>
</section>
<section id="basis" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">9. 기저를 바꾸면 첫째 계수도 움직일 수 있습니다</h2>
<p>옛 기저 1,u에서는 φ가 [a,b]를 [a,2b]로 보냅니다. 이를 열벡터에 곱하는 행렬로 적으면 첫 행은 [1,0], 둘째 행은 [0,2]입니다. 첫째 계수는 그대로이고 둘째 계수만 두 배입니다.</p>
<p>이제 v=1+u를 새 기저 원소로 택합니다. u=v−1이므로 a+bu=(a−b)+bv입니다. 같은 x=1+u는 새 기저에서 [0,1]입니다. φ(v)=1+2u=2+2v이므로 새 좌표 [a,b]에 대한 변환은 [a+2b,2b]가 됩니다.</p>
<ExplainedFormula question="같은 세제곱의 새 행렬은 왜 대각선이 아닌가요?" idea="새 기저 원소 v의 세제곱에는 1과 v가 모두 들어갑니다. v의 입력 계수가 두 출력 계수에 기여합니다."
formula={String.raw`M_u=\begin{pmatrix}1&0\\0&2\end{pmatrix},\quad M_v=\begin{pmatrix}1&2\\0&2\end{pmatrix}`}
annotatedFormula={String.raw`\begin{gathered}M_u=\begin{pmatrix}1&0\\0&2\end{pmatrix},\quad M_v=\begin{pmatrix}1&2\\0&2\end{pmatrix}\\M_u\binom{1}{1}=\binom{1}{2}\\M_v\binom{0}{1}=\binom{2}{2}\end{gathered}`}
operations={[{expression:String.raw`a+bu=(a-b)+bv`,annotation:["같은 값을 새 기저의 좌표로 바꿉니다."]},{expression:String.raw`\varphi(a+bv)=(a+2b)+2bv`,annotation:["새 좌표에서는 둘째 입력이 첫째 출력에도 들어갑니다."]}]}
terms={[{symbol:"Mᵤ,Mᵥ",name:"같은 함수의 두 행렬",description:"입력과 출력이 각각 어느 기저의 좌표인지 함께 정합니다."}]}
assumptions={["모든 행렬과 좌표의 계산은 mod 3입니다.","새 기저는 1,v이며 v=1+u입니다."]} interpretation="새 출력 [2,2]는 2+2v=1+2u라서 옛 출력 [1,2]와 같은 원소입니다. 행렬 숫자가 달라도 수학적 함수는 같습니다." />
<p>옛 대각선 표를 새 기저에 그대로 복사하면 [0,1]을 [0,2]로 보냅니다. 그 값은 2v=2+2u여서 틀립니다. 하지만 이 잘못된 표도 두 번 적용하면 원복됩니다. 표와 계수 순서를 함께 바꾸어야 하며 주기 하나만 검사해서는 부족합니다.</p>
<p>일반적으로 Fₚ 계수 cᵢ와 기저 eᵢ로 x를 적으면 φ(x)=∑cᵢeᵢᵖ입니다. 각 eᵢᵖ를 같은 기저로 다시 나타낸 값이 행렬의 해당 열입니다. 옛 좌표를 새 좌표로 바꾸는 행렬을 S라 하면 새 표는 S M S⁻¹로 바뀝니다. 숫자 배열을 바꾸지 않고 이름만 바꾸는 작업이 아닙니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">10. 실제 코드도 아래 계수를 먼저 처리하고 배율을 곱합니다</h2>
<p>arkworks algebra의 commit 7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c를 사용합니다. ark-ff는 0.5.0입니다. 이 글의 검증 프로그램은 p=3, u²=2, Frobenius 계수 [1,2]인 작은 설정을 직접 만듭니다. 암호에 배포된 큰 체의 설정과 구분합니다.</p>
<CodeViewButton label="자체 F₉ 설정과 실제 검증 프로그램" onClick={()=>sidebar.open("experiment",codeRefs.experiment)} />
<p>원문의 quadratic_extension.rs는 c0와 c1 각각에 아래 체의 Frobenius를 먼저 적용합니다. 이번 아래 체 F₃의 함수는 값을 바꾸지 않습니다. 이어 Fp2의 표에서 power를 2로 나눈 나머지로 배율을 골라 c1에 곱합니다.</p>
<CodeViewButton label="원본 두 계수의 Frobenius · 353–357행" onClick={()=>sidebar.open("quad",codeRefs.quad)} />
<CodeViewButton label="원본 소수체의 항등 처리 · 318–322행" onClick={()=>sidebar.open("prime",codeRefs.prime)} />
<CodeViewButton label="원본 표와 power mod 2 · 88–95행" onClick={()=>sidebar.open("fp2",codeRefs.fp2)} />
<p>power=1에서 표의 배율은 2입니다. 같은 [1,1]은 [1,2]가 됩니다. power=2에서 배율은 1이므로 입력은 그대로입니다. 실제 Rust에서 아홉 값 모두의 표 결과를 직접 pow(3)과 비교했고 81쌍에서 덧셈·곱셈 보존을 확인했습니다.</p>
<p>새 기저의 표도 아홉 값 전부에서 확인했습니다. 새 좌표를 옛 좌표로 바꾸어 실제 세제곱한 뒤 다시 새 좌표로 옮긴 결과와 행렬 [a+2b,2b]가 같았습니다. 이것은 새 최소다항식을 Fp2Config에 그대로 넣었다는 주장이 아닙니다. 기존 u 기저에서 계산한 값을 좌표 변환으로 대조한 것입니다.</p>
<p>위층의 c0는 언제나 고정된다는 설명도 주의해야 합니다. Fq6의 c0는 Fq2 원소이므로 c0 자체에도 Frobenius를 적용합니다. Fq12의 c0는 Fq6 원소입니다. 소수체의 개별 계수는 고정되지만 그 여러 계수를 묶은 값까지 고정된 것은 아닙니다.</p>
<CodeViewButton label="원본 세 아래 계수의 사상 · 326–332행" onClick={()=>sidebar.open("cubic",codeRefs.cubic)} />
<CodeViewButton label="원본 Fq12의 표 선택 · 40–59행" onClick={()=>sidebar.open("fp12",codeRefs.fp12)} />
<div id="paper-arkworks-frobenius-source"><CitationBlock source="arkworks algebra · 7ad88c46 · Frobenius의 층별 호출" citeKey={1} href="https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/quadratic_extension.rs">고정 원문의 아래 계수 호출과 표의 선택에 작은 사례를 넣어 실제 실행했습니다. Fq12의 degree 12와 power mod 12는 별도 모델 파일에서 확인합니다. 구체 상수는 같은 commit의 곡선 설정과 함께 사용합니다.</CitationBlock></div>
</section>
<section id="why-free" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 줄어든 것은 일반 거듭제곱이며 남은 일도 있습니다</h2>
<p>원문의 일반 pow는 결과를 1로 시작하고 지수의 첫 1비트부터 읽습니다. 비트마다 한 번 제곱하고 그 비트가 1이면 입력을 곱합니다. 지수 3은 이진수 11이므로 코드에 적힌 순서로는 제곱 두 번과 곱 두 번입니다. 처음 1을 처리하는 단순한 연산도 이 장부에 포함됩니다.</p>
<CodeViewButton label="원본 일반 거듭제곱 반복 · 319–330행" onClick={()=>sidebar.open("pow",codeRefs.pow)} />
<p>큰 BN254의 바탕 소수 p는 254비트이고 1비트가 111개입니다. 같은 반복문은 코드 수준에서 제곱 254회와 곱 111회를 호출합니다. 이는 기계어 명령 수나 실측 시간 비율이 아닙니다. 컴파일러와 아래층의 제곱·곱셈 구현 비용은 별도로 봐야 합니다.</p>
<p>반면 작은 F₉의 표 변환은 첫 계수를 두고 둘째 계수의 부호를 바꾸는 계산입니다. 큰 탑에서는 아래층 Frobenius와 미리 구한 상수의 곱, 표 접근이 남습니다. 바탕 체의 곱이 얼마나 비싼지와 메모리 배치에 따라 실제 이득은 달라집니다. 이 글은 속도를 측정하지 않았습니다.</p>
</section>
<section id="unitary" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 같은 값에서 노름 1인 값을 만들면 켤레가 역원이 됩니다</h2>
<p>처음 x=1+u의 켤레는 φ(x)=1+2u이지만 역원은 2+u입니다. 둘은 다릅니다. 이제 y=φ(x)/x를 만들어 봅시다. 이는 x³/x=x²=2u이고 y의 켤레는 u입니다. (2u)u=2u²=1이므로 이 단계에서는 켤레가 역원과 같습니다.</p>
<p>이 차이는 노름에 있습니다. x의 노름 x·φ(x)는 2였고 y의 노름 y·φ(y)는 1입니다. 노름이 1인 원소를 unitary라고 부릅니다. 켤레만 취해서 나눗셈을 대신하는 최적화는 그 조건을 확인한 값에 적용해야 합니다.</p>
<ExplainedFormula question="큰 이차 위층에서도 같은 방식으로 노름 1을 만들 수 있나요?" idea="0 아닌 x의 켤레를 x로 나누면 두 값의 노름 배율이 상쇄됩니다."
formula={String.raw`y=x^{p^d-1},\quad y^{p^d+1}=1`}
annotatedFormula={String.raw`\begin{gathered}x\in F_{p^{2d}}^*,\quad y=\varphi^d(x)/x\\y^{p^d+1}=x^{p^{2d}-1}=1\\p=3,\ d=1:\quad y=2u\\y\varphi(y)=(2u)u=1\end{gathered}`}
operations={[{expression:String.raw`(p^d-1)(p^d+1)=p^{2d}-1`,annotation:["두 지수 인수가 전체 곱셈군의 크기를 만듭니다."]},{expression:String.raw`\varphi^d(y)=y^{-1}`,annotation:["노름이 1이면 켤레와 곱해 1이 되어 역원으로 쓸 수 있습니다."]}]}
terms={[{symbol:"d",name:"이차 위층 아래의 차수",description:"작은 F₉에서는 d=1이고 Fₚ¹²에서는 d=6입니다."}]}
assumptions={["x는 0이 아닙니다. 나눗셈과 곱셈군의 지수 식에 필요한 조건입니다.","φᵈ는 이 이차 확장의 켤레입니다."]} interpretation="같은 작은 x에서 y=2u를 만든 계산이 큰 final exponent의 첫 단계를 설명합니다. 처음 x부터 켤레가 역원이라고 전제하지 않습니다." />
</section>
<section id="in-final-exp" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 마지막 큰 지수를 두 쉬운 인수와 남은 인수로 나눕니다</h2>
<p>페어링에서는 0 아닌 Miller 결과를 (pᵏ−1)/r제곱해 목표 부분군의 값을 얻습니다. k는 embedding degree이고 r은 목표 부분군 위수입니다. Scott 등의 논문 3절은 이 고정 지수를 Frobenius로 처리하기 좋은 인수와 남은 인수로 나눕니다.</p>
<ExplainedFormula question="차수 12의 지수에서 어느 부분을 Frobenius로 처리하나요?" idea="차의 제곱과 다항식 인수분해로 p¹²−1을 세 인수로 나눕니다. r이 마지막 인수를 나누는 구성을 사용합니다."
formula={String.raw`\frac{p^{12}-1}{r}=(p^6-1)(p^2+1)\frac{p^4-p^2+1}{r}`}
annotatedFormula={String.raw`\begin{gathered}p^{12}-1=(p^6-1)(p^6+1)\\p^6+1=(p^2+1)(p^4-p^2+1)\\E=(p^6-1)(p^2+1)H\\H=(p^4-p^2+1)/r\end{gathered}`}
operations={[{expression:String.raw`a=\varphi^6(x)\,x^{-1}`,annotation:["첫 인수 p⁶−1을 켤레와 한 번의 역원으로 처리합니다."]},{expression:String.raw`b=\varphi^2(a)\,a`,annotation:["둘째 인수 p²+1을 p²제곱과 곱으로 처리합니다."]},{expression:String.raw`b^H`,annotation:["남은 hard part는 따로 거듭제곱해야 합니다."]}]}
terms={[{symbol:"E",name:"전체 마지막 지수",description:"(p¹²−1)/r입니다. 값의 크기를 기준량으로 나누는 비율 해석이 아니라 정수 지수의 분해입니다."},{symbol:"H",name:"남은 지수",description:"r이 p⁴−p²+1을 나누므로 정수입니다."}]}
assumptions={["대상은 차수 12이며 r이 해당 cyclotomic 인수를 나누는 구성입니다.","입력은 0이 아니며 기저와 Frobenius 표가 맞습니다."]} interpretation="Frobenius는 p의 거듭제곱 부분을 빠르게 처리합니다. 남은 H와 전체 페어링 계산을 없애지는 않습니다." />
<p>첫 인수를 처리한 a는 앞 절의 y처럼 노름 1입니다. 이후 거듭제곱과 곱으로 만든 값에도 그 성질이 유지되어 역원을 켤레로 바꿀 수 있습니다. 제곱 최적화에도 부분군 조건을 사용하므로 임의의 Fq12 값에 전용 함수를 무조건 적용하면 안 됩니다.</p>
<div id="paper-final-exponentiation"><CitationBlock source="Scott et al. · On the final exponentiation · §§3,5" citeKey={2} href="https://eprint.iacr.org/2008/490">원문 3절의 세 인수와 노름 1 조건, 5절의 BN 매개변수와 지수 계수를 읽었습니다. 작은 x의 노름 변환과 다음 절의 실제 BN254 지수에 적용합니다. 논문의 특정 연산 장부나 당시 속도 개선율을 현재 기기의 측정값으로 사용하지 않습니다.</CitationBlock></div>
</section>
<section id="large-case" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 큰 BN254에서도 같은 절차를 직접 지수와 대조합니다</h2>
<p>큰 체의 별도 검증 입력은 M=1+A, A=(1+u)v²w로 정했습니다(가정). 이때의 규칙은 u²=−1, v³=9+u, w²=v입니다. 작은 F₉의 나머지 기준과 혼동하지 않습니다. 앞의 <Link className="text-primary hover:underline" to="/cs/crypto/extension-fields">확장체 구현 글</Link>과 같은 실제 BN254 구성을 사용합니다.</p>
<p>동일 commit의 ark-bn254 버전은 별도 curves workspace의 0.5.0-alpha.0이며 ark-ff는 0.5.0입니다. 실제 실행에서 φ⁶(M)=1−A를 확인했고 이것이 처음 M의 역원과는 다름을 확인했습니다. a=φ⁶(M)/M을 만든 뒤에는 a·φ⁶(a)=1이었습니다.</p>
<p>이어 b=φ²(a)a를 계산하고 M을 직접 (p⁶−1)(p²+1)제곱한 결과와 비교했습니다. 둘은 같았습니다. b를 H제곱한 결과도 M의 전체 지수 E제곱과 같았고 r제곱하면 1이 되었습니다. 이 실험은 확장체 원소의 지수 계산이며 Miller loop나 페어링 함수를 실행한 것은 아닙니다.</p>
<CodeViewButton label="실제 BN254의 12개 배율 표" onClick={()=>sidebar.open("table12",codeRefs.table12)} />
<p>같은 M에 대해서는 j=0부터 11까지 표의 계산을 직접 pʲ제곱과 비교했습니다. power=13의 결과가 power=1과 같은지도 확인했습니다. 원복만 보는 검사에 실제 지수 대조를 추가한 것입니다.</p>
<p>논문 5절의 BN 식에도 실제 매개변수 z=4965661367192848881을 넣었습니다. p=36z⁴+36z³+24z²+6z+1, r=36z⁴+36z³+18z²+6z+1이며 이 값들이 코드의 p·r과 일치했습니다. 남은 H는 761비트 정수입니다.</p>
<AlgorithmBlock title="논문의 남은 지수를 p의 다항식으로 대조하기" input={["같은 BN254의 p, r과 노름 1인 b"]} steps={[{code:"λ3=1; λ2=6z²+1",note:"높은 두 p 거듭제곱의 계수입니다."},{code:"λ1=−36z³−18z²−12z+1",note:"음수 계수는 역원의 거듭제곱을 요구합니다."},{code:"λ0=−36z³−30z²−18z−2",note:"p가 붙지 않는 항의 계수입니다."},{code:"H=λ3*p³+λ2*p²+λ1*p+λ0",note:"정수 계산으로 정확히 같은 지수인지 확인했습니다."},{code:"b^H=φ³(b)*φ²(b)^λ2*φ(b)^λ1*b^λ0",note:"실제 큰 체에서도 양쪽을 일반 거듭제곱으로 계산해 일치시켰습니다."}]} output="논문의 지수 분해가 이 매개변수에서 같은 결과를 만듭니다. 논문의 짧은 addition chain을 구현하거나 시간을 측정한 실험은 아닙니다." />
<p>음수 거듭제곱은 0 아닌 값의 역원이 있어야 정의됩니다. 이 단계의 b는 노름 1이라 역원을 켤레로 바꿀 수 있지만 검증 프로그램은 일반 inverse로도 결과를 대조했습니다. 매개변수의 부호나 곡선 계열이 바뀌면 같은 계수식을 그대로 쓰지 않습니다.</p>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 체가 아닌 예의 실패 원인도 나누어 봅니다</h2>
<p>F₅에서 u²+1=(u−2)(u+2)이므로 이 다항식으로 나눈 공간은 체가 아닙니다. 두 0 아닌 인수의 곱이 0입니다. 다만 이 사실만으로 5제곱 사상이 일대일이 아니라고 결론 내리면 틀립니다. 이 예에서는 u⁵=u이고 각 계수도 5제곱해 고정되어 전체 사상이 항등입니다.</p>
<p>실제로 일대일이 깨지는 예는 F₃에서 ε²=0을 추가한 공간입니다. ε는 [0,1]인 0 아닌 값인데 ε³=0입니다. 0과 ε가 같은 출력 0으로 가므로 단사성이 없습니다. 앞의 유한체 증명에서 0 아닌 값의 거듭제곱이 0일 수 없다는 조건이 여기서 깨집니다.</p>
<p>두 예는 별도의 작은 나머지 다항식 계산으로 확인했습니다. F₅의 25개 값에서는 5제곱이 모두 자기 자신이었고 ε의 세제곱은 0이었습니다. 라이브러리의 올바른 체 타입을 사용한다는 주장과 이 체가 아닌 반례를 섞지 않습니다.</p>
</section>
<section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">16. 빠른 표는 같은 값의 직접 계산을 통과해야 합니다</h2>
<p>표를 옮길 때는 소수와 기약식, 기저의 순서 및 원문 버전을 함께 맞춥니다. 각 기저를 직접 p제곱한 값으로 표의 열을 확인하고 여러 power에서 주기와 직접 지수 계산을 대조합니다. 덧셈·곱셈 보존도 유용하지만 항등 함수처럼 그 검사까지 통과하는 잘못된 후보가 있음을 기억해야 합니다.</p>
<p>이 글에서 실제 실행한 것은 작은 F₉의 아홉 입력과 81쌍의 연산, 기저 변환, 큰 BN254의 지수 분해입니다. 전체 페어링의 입력 검사와 결과는 추가 검증 대상입니다. 정확성을 맞춘 뒤 같은 기기에서 상수 곱과 표 접근, 전체 final exponent의 시간을 측정해야 실제 성능을 말할 수 있습니다.</p>
<ReviewPrompts questions={["기저를 1,v로 바꾸고 옛 대각선 표를 쓰면 같은 x의 출력은 어떻게 틀리나요? 두 번 원복되면 충분한가요? (답: 8·9절)","처음 x에서는 켤레가 역원이 아닌데 y=φ(x)/x에서는 왜 역원이 되나요? (답: 12절)","F₅의 가약 몫과 ε²=0인 공간 중 어느 예에서 Frobenius의 단사성이 깨지나요? (답: 15절)"]} />
<ContentBoundary article="frobenius-optimization" />
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ark:{id:"ark",label:"arkworks · 7ad88c46 원문",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},check:{id:"check",label:"본문의 실제 지수 검증",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}}} />
</article>;}
