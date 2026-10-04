import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import { codeRefs, fileTrees } from "./codeRefs";

export default function ModernArticle(){const sidebar=useCodeSidebar();return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 세 숫자로 안 되는 계산에 새 원소를 붙입니다</h2>
<p>0·1·2로 계산하고 결과를 3으로 나눈 나머지만 남긴다고 합시다. 이 세 값의 제곱은 각각 0·1·1입니다. 제곱해서 2가 되는 값은 없습니다. 그런데 그런 값이 있다고 정하고 계산을 계속하려면 어떻게 해야 할까요?</p>
<p>그 새 값을 u라고 쓰고 u²=2라는 규칙을 붙입니다. 이제 1+u와 2+u를 곱해 1을 만드는 과정을 따라갑니다. 규칙만 아무렇게나 추가하면 나눗셈이 깨질 수 있으므로 어떤 규칙을 고를지 증명하고 실제 코드에도 같은 값을 넣습니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 숫자 두 칸을 받아 같은 두 칸으로 계산합니다</h2>
<p>한 값을 a+bu로 적고 두 칸 [a,b]에 저장합니다. 각 칸에는 0·1·2 중 하나가 들어갑니다. 계산기는 두 값과 u²=2라는 규칙을 받아 덧셈이나 곱셈을 한 뒤 다시 두 칸으로 돌려줍니다.</p>
<p>나누려면 상대 값과 곱해서 1이 되는 값을 먼저 찾습니다. 0에는 그런 값이 없어 실패해야 합니다. 나머지 여덟 값에는 모두 그 값이 존재하는지가 이번 구성의 핵심 조건입니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 1+u와 2+u를 곱하면 1이 남습니다</h2>
<p>설명용으로 계수는 3의 나머지, 새 규칙은 u²=2로 정합니다(가정). 분배법칙으로 (1+u)(2+u)를 전개하면 2+u+2u+u²입니다. u가 붙은 두 항은 3u라서 0이고 u² 대신 2를 넣으면 4가 됩니다. 4의 나머지는 1입니다.</p>
<p>따라서 [1,1]과 [2,1]을 곱한 출력은 [1,0]입니다. 1+u로 나누는 것은 2+u를 곱하는 것으로 바꿀 수 있습니다. 실제 라이브러리에서도 이 두 칸과 결과가 그대로 나오는지 확인하겠습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 항을 펼치고 새 규칙으로 두 칸에 돌려놓습니다</h2>
<FlowRail title="같은 두 입력의 곱셈 경로" steps={[{actor:"입력",movement:"[1,1]과 [2,1]을 1+u, 2+u로 읽습니다.",receives:"두 값"},{actor:"전개",movement:"네 작은 곱을 더해 2+3u+u²를 얻습니다.",receives:"세 차수"},{actor:"규칙 적용",movement:"u²를 2로 바꾸고 계수를 3으로 줄입니다.",receives:"1+0u"},{actor:"출력",movement:"정해 둔 계수 순서로 다시 적습니다.",receives:"[1,0]"}]} />
<p>가능한 입력은 [0,0]부터 [2,2]까지 아홉 쌍입니다. 이 두 칸을 십진수 두 자리처럼 읽지 않습니다. [1,1]은 11이 아니라 1+u라는 계산 대상입니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 원소 수를 늘려도 0 아닌 값으로 나눌 수 있어야 합니다</h2>
<p>제곱해서 2가 되는 값이 원래 세 숫자 안에는 없었습니다. 새 원소를 붙이면 이전 공간에서 풀 수 없었던 식의 해를 다룰 수 있습니다. 암호의 다항식 계산이나 페어링에서도 필요한 계산 공간을 이렇게 넓힙니다.</p>
<p>하지만 u²=1을 택하면 (u−1)(u+1)=0이 됩니다. 두 칸 표현에서 u−1과 u+1은 각각 [2,1]과 [1,1]이므로 둘 다 0이 아닙니다. 앞의 값으로 나누어도 된다면 다른 값이 0이라는 모순이 생깁니다. 새 규칙을 고를 때 나눗셈이 유지되는 이유가 필요합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 원래 체와 확장체, 기약 다항식을 구분합니다</h2>
<p>0 아닌 모든 원소로 나눌 수 있고 보통의 덧셈·곱셈 법칙을 만족하는 공간을 체라고 합니다. 3의 나머지 계산은 F₃이고 아홉 원소로 넓힌 공간은 F₉입니다. F₃는 a+0u로 그 안에 들어갑니다. 이 관계를 체의 확장이라고 부릅니다.</p>
<p>u²=2는 u²+1=0과 같습니다. 따라서 u는 X²+1의 근입니다. 계수가 F₃에 있는 더 낮은 양의 차수 다항식들의 곱으로 나눌 수 없을 때 X²+1을 기약이라고 합니다. 어떤 원소가 만족하는 가장 낮은 차수의, 최고차항 계수가 1인 식은 최소다항식입니다.</p>
<p>1과 u처럼 모든 값을 유일하게 조합하는 기준을 기저라고 합니다. 여기서는 a와 b 두 계수가 필요하므로 F₃ 위 차원이 2입니다. 이 차원을 확장 차수라고 부릅니다. 원소 수 9와 차수 2를 구분해야 합니다.</p>
</section>
<section id="quotient" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 높은 차수는 다항식으로 나눈 나머지에 모읍니다</h2>
<p>u²를 만날 때마다 2로 바꾸면 u³=2u, u⁴=1처럼 모든 거듭제곱을 1과 u로 줄일 수 있습니다. 이를 다항식으로 표현하면 X²+1로 나눈 나머지를 보관하는 방식입니다. 이 계산 공간을 F₃[X]/(X²+1)이라고 적습니다.</p>
<ExplainedFormula question="두 칸끼리 곱한 결과를 어떤 두 칸에 담나요?" idea="먼저 네 항을 곱하고 u²가 붙은 항을 상수항으로 옮깁니다. 마지막으로 각 계수를 3으로 나눈 나머지를 취합니다."
formula={String.raw`\begin{gathered}(a+bu)(c+du)\\=(ac+2bd)+(ad+bc)u\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}(a+bu)(c+du)\\=(ac+2bd)+(ad+bc)u\\(1+u)(2+u)\\=(2+2)+(1+2)u=1+0u\end{gathered}`}
operations={[{expression:"bd\\,u^2=2bd",annotation:["높은 차수 항이 규칙에 따라 상수항으로 들어옵니다."]},{expression:"ad+bc",annotation:["u가 한 번 붙은 두 항을 모읍니다.","계수는 F₃에서 계산합니다."]}]}
terms={[{symbol:"a,b",name:"첫 입력의 두 계수",description:"a+bu를 나타내며 각 값은 0·1·2 중 하나입니다."},{symbol:"c,d",name:"둘째 입력의 두 계수",description:"같은 기저와 같은 u² 규칙을 써야 합니다."}]}
assumptions={["u²=2이며 계수 계산은 mod 3입니다.","표현을 바꾸어도 곱셈 결과의 의미가 같아야 합니다."]}
interpretation="일반적인 이차 확장 u²=β에서는 상수항이 ac+βbd입니다. β를 바꾸면 두 칸의 곱셈 규칙도 달라집니다." />
<p>더 일반적으로 기약 다항식 m의 차수가 d라면 나눗셈의 나머지는 d차보다 낮습니다. 계수는 1,u,…,u의 d−1제곱에 붙는 d개면 충분합니다. Fₚ 계수를 쓰면 각 칸에 p가지 선택이 있어 원소는 pᵈ개입니다.</p>
</section>
<section id="minimal-polynomial" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 최소다항식의 차수가 필요한 계수 수를 정합니다</h2>
<p>X²+1에 0·1·2를 넣으면 각각 1·2·2입니다. 근이 없습니다. 2차식이 더 작은 양의 차수 식으로 나뉘려면 1차 인수가 있어야 하므로 이 경우에는 기약입니다. 3차식에도 같은 판단이 가능하지만 4차부터는 근이 없다는 사실만으로 충분하지 않습니다.</p>
<p>예를 들어 (X²+1)²은 F₃에 근이 없지만 두 2차식의 곱입니다. 이 식으로 나눈 공간에서는 X²+1 자체는 0이 아니면서 제곱은 0입니다. 근 검사만으로 모든 차수의 구성을 통과시키면 나눗셈 조건을 놓칩니다.</p>
<ExplainedFormula question="왜 기저가 1,u 두 개이며 더 짧게 줄일 수 없나요?" idea="나눗셈으로 모든 식을 두 계수로 줄입니다. 두 표현이 같다면 그 차이가 더 낮은 차수의 소멸식이 되어 최소성에 모순됩니다."
formula={String.raw`\begin{gathered}[F(u):F]=\deg m_u=d\\F(u)\cong F[X]/(m_u)\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}[F(u):F]=\deg m_u=d\\F(u)\cong F[X]/(m_u)\\m_u=X^2+1,\quad d=2\\F_9=\{a+bu:a,b\in F_3\}\\\#F_9=3^2=9\end{gathered}`}
operations={[{expression:"g=qm_u+r,\\quad\\deg r<d",annotation:["임의의 식을 최소다항식으로 나누면 차수 d 미만의 나머지만 남습니다."]},{expression:"r(u)=0,\\quad\\deg r<d",annotation:["0 아닌 r이 존재하면 최소다항식보다 낮은 소멸식이 생깁니다.","따라서 낮은 차수 표현은 유일합니다."]}]}
terms={[{symbol:"mᵤ",name:"최소다항식",description:"u를 넣어 0이 되는 0 아닌 식 중 가장 낮은 차수이며 최고차항 계수는 1로 정합니다."},{symbol:"[F(u):F]",name:"확장 차수",description:"원래 체의 계수로 새 체의 값을 표현할 때 필요한 기저의 개수입니다."}]}
assumptions={["u는 F 위에서 대수적입니다. 유한체 확장에서는 이 조건을 만족합니다.","mᵤ는 F의 계수를 사용하는 다항식입니다. 기준 체를 바꾸면 최소다항식도 달라질 수 있습니다."]}
interpretation="최소다항식이 두 더 작은 식의 곱이라면 u를 넣었을 때 둘 중 하나가 0이어야 합니다. 그러면 최소 차수와 모순이므로 최소다항식은 기약입니다." />
<p>기약 m으로 만든 공간에서 0 아닌 낮은 차수 r은 m과 서로소입니다. 다항식 확장 유클리드 계산으로 sr+tm=1을 얻으면 m의 나머지에서 sr=1입니다. 이것이 모든 0 아닌 값에 역원이 생기는 이유이며, 단순히 두 칸을 만들었다는 사실보다 강한 조건입니다.</p>
</section>
<section id="inverse" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">9. 같은 1+u의 역원을 원문의 절차로 구합니다</h2>
<p>Handbook of Applied Cryptography의 정리 2.198과 2.224는 기약 다항식으로 나눈 공간이 체가 되는 조건을 제시합니다. 원문 알고리즘 2.226은 sg+tm=1인 s를 구해 g의 역원으로 돌려줍니다. 우리의 g=X+1과 m=X²+1을 그대로 넣어 보겠습니다.</p>
<AlgorithmBlock title="같은 입력 1+u의 역원 계산" input={["계수는 F₃, g=X+1, m=X²+1"]} steps={[{code:"m=(X+2)g+2",note:"다항식 나눗셈의 나머지는 2입니다."},{code:"2*m-2*(X+2)*g=1",note:"계수 2를 곱해 나머지를 1로 만듭니다."},{code:"s=X+2, t=2",note:"F₃에서는 −2=1이므로 sg+tm=1입니다."},{code:"g(u)^(-1)=s(u)=2+u",note:"m의 나머지에서 t·m이 사라집니다."}]} output="처음에 곱해서 1을 확인했던 같은 2+u입니다." />
<p>이차식에서는 짝을 곱하는 방법도 있습니다. (a+bu)(a−bu)=a²−2b²는 원래 F₃의 숫자입니다. 이 값을 N이라고 두면 역원은 N의 역원을 a−bu에 곱한 값입니다. 1+u에서는 N=1−2=2이고 2의 역원도 2라서 2(1−u)=2+u입니다.</p>
<p>N을 노름, a−bu를 켤레라고 부릅니다. 켤레만 취한 1−u=1+2u는 이 사례의 역원이 아닙니다. 둘을 곱하면 N=2가 남으므로 그 배율까지 나누어야 합니다.</p>
<div id="paper-finite-fields"><CitationBlock source="Handbook of Applied Cryptography · §§2.5–2.6" citeKey={1} href="https://cacr.uwaterloo.ca/hac/about/chap2.pdf">정리 2.198·2.207·2.211·2.224와 알고리즘 2.226의 조건을 읽었습니다. 몫으로 만드는 체, 차수의 곱, 부분체 조건과 역원 절차를 본문의 작은 사례에 적용합니다.</CitationBlock></div>
</section>
<section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">10. 실제 Rust 코드에도 같은 두 칸을 넣습니다</h2>
<p>
            ark-ff 0.5.0의 commit 7ad88c46…을 고정하고 이 글의 실험에서 F₃와 u²=2인 설정을 직접 만들었습니다. 기본 소수는 3, NONRESIDUE는 2이며
            나중에 설명할 Frobenius 계수는 [1,2]입니다. 큰 암호용 체에 이미 배포된 설정이라고 소개하는 것이 아닙니다.
          </p>
<CodeViewButton label="실제 실행한 F₉ 구성과 검산 프로그램" onClick={()=>sidebar.open("experiment",codeRefs.experiment)} />
<CodeViewButton label="원본 Fp2Config의 설정 조건 · 5–16행" onClick={()=>sidebar.open("config",codeRefs.config)} />
<p>원문 QuadExtField는 두 값을 c0와 c1에 담습니다. F₉::new(1,1)은 이 글의 1+u이고 F₉::new(2,1)은 2+u입니다. 원문의 new는 전달한 두 계수를 넣는 생성자입니다. 설정 다항식의 기약성을 생성할 때마다 증명하는 함수가 아닙니다.</p>
<CodeViewButton label="원본 두 계수와 생성자 · 90–123행" onClick={()=>sidebar.open("layout",codeRefs.layout)} />
<p>곱셈 원문 652행은 소수체 위 전체 확장 차수가 2인지 확인합니다. 이번 구성은 2이므로 두 번의 sum_of_products를 사용합니다. 원문에 Karatsuba라고 적힌 다른 분기가 보인다고 이번 실행도 그 분기라고 판단하면 안 됩니다.</p>
<p>먼저 c1_input에 [1,1]을 남기고 첫 입력의 c1에 2를 곱해 2로 바꿉니다. 첫 번째 합은 [1,2]와 [2,1]의 대응 곱을 더한 2+2=1 mod3입니다. 두 번째 합은 저장한 [1,1]과 [1,2]에서 1+2=0입니다. 결과는 처음의 [1,0]과 같습니다.</p>
<CodeViewButton label="원본 실제 곱셈 분기 · 649–675행" onClick={()=>sidebar.open("multiply",codeRefs.multiply)} />
<p>역원 원문은 c1²=1을 구한 다음 c0²−2c1²=2를 만듭니다. 그 역원 2를 두 계수에 적용해 c0=2, c1=−2=1을 얻습니다. 따라서 inverse가 돌려준 [2,1]도 앞의 손계산과 같습니다. 0에는 None을 반환합니다.</p>
<CodeViewButton label="원본 역원 · 325–341행" onClick={()=>sidebar.open("inverse",codeRefs.inverse)} />
<p>이 구성으로 실제 Rust 프로그램을 실행해 아홉 원소 사이의 81개 곱을 독립 정수식과 대조했고 0 아닌 여덟 값의 역원을 확인했습니다. 1+u의 직렬화 결과는 [1,1]이었습니다. 이 바이트의 의미에는 두 계수의 순서와 체 설정이 함께 필요합니다.</p>
<div id="paper-ark-extension"><CitationBlock source="ark-ff 0.5.0 · 7ad88c46 · quadratic_extension.rs" citeKey={2} href="https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/quadratic_extension.rs">고정 원문의 두 계수, 실제 차수 2 곱셈 분기와 역원을 읽고 자체 F₉ 설정에서 실행했습니다. 원문 파일과 자체 검증 프로그램은 코드 패널에서 구분합니다.</CitationBlock></div>
</section>
<section id="frobenius" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 세제곱은 둘째 계수의 부호를 바꿉니다</h2>
<p>F₃에서는 (a+bu)³의 중간 전개 계수 3이 0입니다. a³=a, b³=b이고 u³=2u이므로 결과는 a+2bu입니다. 같은 입력 1+u는 1+2u로 바뀌고 한 번 더 세제곱하면 1+u로 돌아옵니다.</p>
<ExplainedFormula question="세제곱 두 번이 왜 원래 값으로 돌아오나요?" idea="각 계수는 F₃에서 그대로이고 u의 계수에 2가 붙습니다. 두 번 적용하면 배율 2²=1 mod3이 됩니다."
formula={String.raw`\begin{gathered}\varphi(a+bu)=(a+bu)^3=a+2bu\\\varphi^2(a+bu)=a+4bu=a+bu\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}\varphi(a+bu)=a+2bu\\\varphi^2(a+bu)=a+bu\\1+u\ \longmapsto\ 1+2u\\1+2u\ \longmapsto\ 1+u\end{gathered}`}
operations={[{expression:"(a+b)^p=a^p+b^p",annotation:["특성 p에서 중간 이항계수가 p의 배수라 사라집니다."]},{expression:"x^{p^k}=x",annotation:["Fₚᵏ의 0 아닌 원소는 크기 pᵏ−1의 곱셈군에 속합니다.","0에서도 같은 식이 성립합니다."]}]}
terms={[{symbol:"φ",name:"Frobenius",description:"특성 p인 체에서 p제곱을 취하는 사상입니다."},{symbol:"k",name:"Fₚ 위 확장 차수",description:"F₉에서는 p=3, k=2입니다."}]}
assumptions={["유한체에서 계산합니다. 이 구성은 u²=2입니다.","개별 원소가 돌아오는 최소 횟수는 k를 나누며 반드시 k와 같은 것은 아닙니다."]}
interpretation="F₃의 0·1·2는 한 번 만에 그대로입니다. 따라서 모든 원소가 정확히 두 번 뒤에만 돌아온다고 말하면 틀립니다." />
<p>이 사상은 덧셈과 곱셈을 보존합니다. 또 xᵖ=yᵖ이면 (x−y)ᵖ=0이라 x=y입니다. 유한 집합에서 일대일이므로 전체를 다시 채우는 순열이며 체의 연산까지 보존하는 자기동형입니다.</p>
<p>원문 frobenius_map_in_place는 두 계수에 바탕 체의 사상을 적용한 뒤 c1에 미리 정한 계수를 곱합니다. Fp2 설정은 횟수를 2로 나눈 나머지로 [1,2] 중 하나를 선택합니다. 이 표는 이번 u²=2의 계산에서 유도한 값입니다.</p>
<CodeViewButton label="원본 Frobenius 호출 · 353–357행" onClick={()=>sidebar.open("frobenius",codeRefs.frobenius)} />
<CodeViewButton label="원본 표의 선택 · 88–95행" onClick={()=>sidebar.open("frob-table",codeRefs["frob-table"])} />
<p>실제 실행에서는 아홉 원소 모두에 대해 표를 쓴 계산과 pow(3)을 비교하고 두 번 적용한 원복을 확인했습니다. 같은 u²=2인데 표만 [1,1]로 바꾸면 1+u를 그대로 돌려주어 실제 세제곱 1+2u와 다릅니다. 이 잘못된 설정도 실험으로 재현했습니다.</p>
</section>
<section id="tower" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 두 계수 위에 다시 두 계수를 두면 네 계수가 됩니다</h2>
<p>이번 F₉에서 제곱으로 나오는 값은 0·1·2·u·2u입니다. 1+u는 제곱이 아니므로 F₉ 위의 Y²−(1+u)는 기약 2차식입니다. w²=1+u라는 새 규칙을 추가하면 F₉ 위 차수 2인 체를 만들 수 있습니다.</p>
<p>새 값은 A+Bw이고 A와 B는 각각 a₀+a₁u, b₀+b₁u입니다. 풀어 쓰면 a₀+a₁u+b₀w+b₁uw입니다. 원래 F₃의 계수가 네 개이므로 원소 수는 3⁴=81이고 전체 확장 차수는 2×2=4입니다.</p>
<ExplainedFormula question="여러 층의 확장 차수는 왜 더하지 않고 곱하나요?" idea="윗층 기저의 계수 하나하나를 아랫층 기저로 다시 펼칩니다. 가능한 기저 조합의 개수가 두 기저 길이의 곱입니다."
formula={String.raw`\begin{gathered}K\subset L\subset M\\\left[M:K\right]=[M:L][L:K]\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}K\subset L\subset M\\\left[M:K\right]=[M:L][L:K]\\L=F_3(u),\quad M=L(w)\\\text{기저 }1,u,w,uw\\\left[M:F_3\right]=2\cdot2=4\end{gathered}`}
operations={[{expression:"e_if_j",annotation:["eᵢ는 L의 K 위 기저이고 fⱼ는 M의 L 위 기저입니다.","모든 계수를 펼치면 이 곱들이 M을 생성합니다."]}]}
terms={[{symbol:"[L:K]",name:"아랫층 차수",description:"K 계수로 L 원소를 적는 기저 길이입니다."},{symbol:"[M:L]",name:"윗층 차수",description:"L 계수로 M 원소를 적는 기저 길이입니다."}]}
assumptions={["두 단계 모두 실제 유한 차수의 체 확장입니다.","새 다항식은 현재 바탕 체에서 기약이어야 합니다."]} interpretation="기저 곱의 선형 결합이 0이면 먼저 fⱼ의 독립성으로 L 계수들이 0이고, 이어 eᵢ의 독립성으로 K 계수들이 모두 0입니다. 따라서 생성뿐 아니라 독립성도 성립합니다." />
<p>같은 이유로 2차 위에 기약 3차 확장을 쌓으면 차수는 6이고 여기에 2차를 더 쌓으면 12입니다. Fp²→Fp⁶→Fp¹²라는 표기는 이 계수 수를 알려 줍니다. 어느 기약식과 계수 순서를 쓰는지, 각 연산 비용이 얼마인지는 <Link className="text-primary hover:underline" to="/cs/crypto/extension-fields">실제 확장체 구현</Link>에서 따로 맞춰야 합니다.</p>
</section>
<section id="basis" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 같은 체라도 두 칸의 의미는 달라질 수 있습니다</h2>
<p>v=1+u를 새 기저 원소로 택해 봅시다. u=v−1이므로 a+bu=(a−b)+bv입니다. 같은 1+u는 1,u 기저에서는 [1,1]이고 1,v 기저에서는 [0,1]입니다. [1,1]을 그대로 새 기저에서 읽으면 1+v=2+u가 되어 다른 값입니다.</p>
<p>v²=2u이고 v²+v+2=0이므로 v의 최소다항식은 X²+X+2입니다. v는 F₃ 안에 없으므로 최소 차수는 1이 아니며 2입니다. 두 구성이 모두 아홉 원소를 가진다는 사실은 바이트를 그대로 주고받아도 된다는 약속이 아닙니다.</p>
<p>또 체를 생성하는 원소와 0 아닌 원소를 거듭제곱으로 모두 만드는 원소는 다릅니다. u만 붙이면 F₉ 전체를 표현할 수 있지만 u⁴=1이고 u²=2라서 곱셈 위수는 4입니다. 반면 v²=2u, v⁴=2, v⁸=1이므로 v의 위수는 8입니다. 곱셈군 전체의 생성원을 원시원소라고 부릅니다.</p>
<p>기저나 규칙이 바뀌면 곱셈뿐 아니라 Frobenius 표, 계수 순서와 바이트 형식도 바꿔야 합니다. 같은 원소 수는 계산 구조를 옮기는 동형이 존재한다는 뜻이며 주어진 바이트 해석이 자동으로 같다는 뜻은 아닙니다.</p>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 타입 이름만으로 올바른 체 구성이 보장되지는 않습니다</h2>
<p>추가 실험에서는 Fp2Config의 NONRESIDUE를 1로 잘못 정했습니다. 이 설정은 u²=1을 만들므로 [1,1]과 [1,2]가 둘 다 0이 아닌데 곱은 0입니다. [1,1]의 inverse도 None이 나왔습니다. 원문 타입을 사용한다는 사실만으로 기약성 조건이 검사되었다고 볼 수 없습니다.</p>
<p>올바른 체에서도 0의 역원은 없습니다. 반면 잘못 구성한 공간에서는 0 아닌 값의 역원도 없을 수 있습니다. 이 두 실패의 이유를 구분해야 설정 오류를 정상적인 입력 실패로 덮지 않습니다.</p>
<p>Frobenius를 두 번 적용해 원래 값으로 돌아온다는 검사만으로 표가 맞다고 할 수도 없습니다. 잘못된 [1,1] 표는 매번 값을 그대로 두므로 원복 검사는 통과합니다. 직접 세제곱과 대조해야 앞 절의 오류를 잡습니다.</p>
</section>
<section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 규칙·표현·실행 결과를 같은 사례로 확인합니다</h2>
<p>새 확장체를 사용할 때는 바탕 소수와 기약 다항식, 기저 순서와 각 상수를 함께 기록합니다. 다항식이 기약인 이유를 확인하고 곱셈과 역원, 직접 거듭제곱과 빠른 Frobenius를 대조합니다. 직렬화는 같은 수학적 값이 같은 바이트로 왕복하는지 확인합니다.</p>
<p>이 글의 실제 실행 범위는 고정한 ark-ff와 직접 작성한 작은 F₉ 설정입니다. 81개 곱, 여덟 역원, 아홉 Frobenius 및 잘못된 두 설정을 검증했습니다. F₈₁의 기저와 최소다항식·차수 유도는 별도 정수 계산으로 확인했습니다. 이 결과가 큰 곡선의 페어링, 실행 시간이나 부채널 안전성까지 검증하지는 않습니다.</p>
<ReviewPrompts questions={["u²=1로 바꾸면 왜 0 아닌 값의 역원이 없어지며 실제 실험은 무엇을 반환했나요? (답: 5·14절)","Frobenius를 두 번 적용해 원복되었는데도 표가 틀릴 수 있나요? 어떤 계산과 비교해야 하나요? (답: 11·14절)","1+u를 기저 1,v에서 표현할 때 왜 [1,1]이 아니라 [0,1]이 되나요? (답: 13절)"]} />
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ark:{id:"ark",label:"ark-ff 0.5.0 · 7ad88c46",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},check:{id:"check",label:"본문의 실제 F₉ 검증",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}}} />
</article>;}
