import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";

export default function ModernFiniteField(){return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 작은 값 안에서 나눗셈까지 되돌릴 수 있을까요?</h2>
  <p>계산 결과를 0부터 6까지 일곱 값으로만 저장한다고 합시다. 6에 3을 나눈 결과를 구할 때도 이 범위 안의 값 하나가 나와야 합니다. 더하고 곱한 뒤 값을 줄이는 것뿐 아니라 곱하기를 되돌리는 규칙이 필요합니다.</p>
  <p>7로 나눈 나머지를 사용하면 3에 5를 곱한 15가 1과 같아집니다. 따라서 3으로 나누는 일을 5를 곱하는 일로 바꿀 수 있습니다. 이 작은 요청에서 시작해 다항식의 계산, 무작위 검사, 더 큰 계산 공간으로 이어가겠습니다.</p><ContentBoundary article="finite-field-theory" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 값 두 개와 연산을 받고 같은 범위의 값을 돌려줍니다</h2>
  <p>계산기는 값 두 개와 더하기·곱하기·나누기 같은 연산을 받습니다. 결과를 계산한 뒤 7로 나눈 나머지로 바꾸어 반환합니다. 나누기에서는 두 번째 값에 곱해 1이 되는 수를 먼저 찾아야 합니다.</p>
  <p>입력 값의 범위와 나누는 값이 0인지도 확인합니다. 0에 무엇을 곱해도 1은 되지 않으므로 0으로 나누는 요청은 이 계산 공간에서도 허용되지 않습니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 같은 3으로 6도 나누고 2도 나눠 봅니다</h2>
  <p>0부터 6을 사용하는 작은 사례를 정합니다(가정). 5+6=11의 나머지는 4, 4×5=20의 나머지는 6입니다. 결과가 커져도 7의 배수를 빼서 같은 범위로 돌려놓습니다.</p>
  <p>3×5=15의 나머지가 1이므로 6÷3은 6×5=30의 나머지 2입니다. 같은 방법으로 2÷3은 2×5=10의 나머지 3입니다. 실수의 2/3과 다른 답입니다. 결과 3에 원래 나누던 3을 곱하면 9의 나머지 2가 되어 입력으로 돌아옵니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 나눗셈은 되돌리는 곱셈과 범위 정리로 진행됩니다</h2>
  <FlowRail title="6÷3 요청 한 번의 계산" steps={[{actor:"요청",movement:"값 6을 3으로 나누며 기준은 7로 고정합니다.",receives:"6, 3, 기준 7"},{actor:"되돌리는 값",movement:"3에 곱해 1이 되는 값을 찾습니다.",receives:"3×5의 나머지가 1이므로 5"},{actor:"곱하고 정리",movement:"6×5=30에서 7의 배수를 뺍니다.",receives:"결과 2, 다시 3을 곱하면 6"}]} />
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 기준을 8로 바꾸면 같은 되돌리기가 막힙니다</h2>
  <p>8로 나눈 나머지를 사용하면 2×4=8이 0이 됩니다. 두 값 모두 0이 아닌데 곱은 0입니다. 2에 어떤 정수를 곱해도 짝수이므로 8로 나눈 나머지 1을 만들지 못합니다.</p>
  <p>2×1과 2×5의 나머지는 둘 다 2입니다. 곱셈이 서로 다른 입력을 같은 결과로 보내므로 결과를 보고 입력을 하나로 되찾을 수 없습니다. 값의 개수를 유한하게 제한했다는 사실만으로 모든 나눗셈이 가능해지지는 않습니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 곱해 1이 되는 값이 역원입니다</h2>
  <p>정해진 기준으로 나눈 나머지를 사용하는 표기를 mod라고 합니다. 3×5≡1 (mod 7)에서 5는 3의 곱셈 역원이며 3⁻¹로 씁니다. 이때 나눗셈은 정수의 몫을 버리는 연산이 아니라 역원을 곱하는 연산입니다.</p>
  <p>하나의 연산이 집합 안에서 닫혀 있고 결합법칙·항등원·역원을 가지면 군이라고 합니다. 여기서 쓰는 가환환은 교환 가능한 덧셈군과 결합·교환 가능한 곱셈, 분배법칙과 곱셈 항등원 1을 함께 가집니다. 체는 여기에 0≠1이고 모든 0 아닌 값의 곱셈 역원이 존재하는 조건을 더합니다.</p>
  <p>원소가 유한 개이면 유한체입니다. 7로 나눈 나머지의 체를 F₇이라 씁니다. 정수에서는 1/3이 정수가 아니므로 정수 전체는 체가 아닙니다. F₇에서는 덧셈을 되돌리는 값도 같은 집합에 있으며 예를 들어 3+4는 0입니다.</p>
 </section>
 <section id="prime-field" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 소수 기준이면 0 아닌 값마다 역원이 생깁니다</h2>
  <p>p가 소수이고 a가 1부터 p−1 사이라면 a와 p의 최대공약수는 1입니다. 정수의 확장 유클리드 계산은 ax+py=1인 x·y를 찾습니다. p로 나누면 py는 사라져 ax≡1이므로 x의 나머지가 역원입니다.</p>
  <ExplainedFormula question="F₇에서 3의 역원을 거듭제곱으로도 구할 수 있나요?" idea="소수 p에서 0 아닌 a는 a^(p−1)=1을 만족합니다. a 하나를 떼면 나머지 a^(p−2)가 a를 되돌리는 곱셈 상대입니다." formula={String.raw`a^{-1}=a^{p-2},\qquad b/a=b\,a^{-1}\quad\text{in }\mathbb F_p`} annotatedFormula={String.raw`\begin{aligned}3^{-1}&=\underbrace{3^{7-2}}_{\text{3을 곱하면 3의 6제곱}}\\&=243\bmod7=5\\6/3&=\underbrace{6\cdot5}_{\text{역원을 곱함}}\bmod7=2\end{aligned}`} operations={[{expression:String.raw`a\cdot a^{p-2}=a^{p-1}=1`,annotation:["곱이 1이 되어 원래 곱셈을 되돌립니다.","p는 소수이며 a는 0이 아니어야 합니다."]},{expression:String.raw`b\,a^{-1}`,annotation:["나눌 값 b에 역원을 곱합니다.","결과에 a를 다시 곱하면 b로 돌아갑니다."]}]} terms={[{symbol:"p",name:"소수 기준",description:"사례의 원소 수는 7입니다."},{symbol:"a",name:"나누는 값",description:"사례는 3이며 0은 제외합니다."},{symbol:"b",name:"나눌 값",description:"사례는 6이고 다른 요청에서는 2입니다."},{symbol:"a⁻¹",name:"곱셈 역원",description:"a와 곱해 1이 되는 같은 체의 값입니다."}]} assumptions={["같은 소수체 안의 연산입니다. 정수 나눗셈이나 실수 비율과 구분합니다.","a=0이나 합성수 기준에 이 지수식을 그대로 적용하지 않습니다."]} interpretation="3⁵ mod7=5이며 3×5 mod7=1로 별도 확인합니다. a=0에는 역원이 없고 mod8의 2도 역원이 없습니다." />
 </section>
 <section id="trace" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 입력부터 되곱하기까지 같은 요청을 검산합니다</h2>
  <p>6÷3 요청에서 나누는 값 3이 0이 아님을 확인합니다. 역원 5를 구해 곱 6×5=30을 계산하고 나머지 2를 반환합니다. 되곱하기 2×3=6이 입력과 같습니다. 2÷3 요청에서도 같은 역원 5를 사용해 결과 3을 얻고 3×3 mod7=2로 확인합니다.</p>
  <p>역원은 하나뿐입니다. ax=1이고 ay=1이면 x=x(ay)=(xa)y=y이기 때문입니다. 그래서 같은 체의 같은 0 아닌 값으로 나누는 연산은 모호하지 않습니다. mod8에서 2를 곱한 경우처럼 여러 원본이 합쳐지는 문제가 체 안에서는 생기지 않습니다.</p>
 </section>
 <section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">9. HAC 원문의 역원 절차에 3과 7을 넣습니다</h2>
  <p>Handbook of Applied Cryptography의 Algorithm 2.142는 ax+ny=gcd(a,n)을 구한 뒤 최대공약수가 1이면 x를 역원으로 사용합니다. 사례의 a=3,n=7에 이 절차를 적용하면 1=7−2×3이므로 x=−2,y=1입니다.</p>
  <AlgorithmBlock title="HAC Algorithm 2.142의 같은 역원 요청" input={["a=3, n=7, 나눌 값 b=6"]} steps={[{code:"7 = 2*3 + 1; 3 = 3*1 + 0",note:"확장 유클리드 계산의 나눗셈 순서입니다. 마지막 0 아닌 나머지는 1입니다."},{code:"1 = 3*(-2) + 7*1",note:"원문의 ax+ny=d에 x=−2,y=1,d=1이 대응합니다."},{code:"inverse = (-2) mod7 = 5",note:"최대공약수가 1이므로 역원이 있습니다. 반환 값을 0~6으로 정리합니다."},{code:"result = 6*5 mod7 = 2",note:"같은 역원으로 처음 요청한 나눗셈을 마칩니다."}]} output="역원 5, 나눗셈 결과 2. 원문의 거절 분기에 a2,n8을 넣으면 gcd2이므로 역원 없음." />
  <p>원문이 부르는 Algorithm 2.107은 큰 정수부터 받으므로 7·3을 넣어 7의 계수 1과 3의 계수−2를 구하면 됩니다. 여기서는 수학 절차를 정확한 정수로 재현했습니다. 특정 암호 라이브러리의 실행 시간이나 비밀에 따른 분기까지 시험한 결과는 아닙니다.</p>
  <div id="paper-hac-field"><CitationBlock source="HAC §2.4.4, Algorithm 2.142; §2.6" citeKey={1} href="https://cacr.uwaterloo.ca/hac/about/chap2.pdf">원문의 역원 절차에 같은 3·7을 대응했습니다. §2.6의 유한체 구조와 기약 다항식 표현은 뒤의 더 큰 계산 공간을 설명하는 근거입니다.</CitationBlock></div>
 </section>
 <section id="multiplicative-order" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 같은 값을 반복해서 곱하면 1로 돌아옵니다</h2>
  <p>F₇에서 3을 반복해 곱하면 3·2·6·4·5·1 순서로 돌아옵니다. 처음 1이 되는 거듭제곱은 여섯 번째입니다. 이 길이를 원소의 위수라고 하며 여섯 개의 0 아닌 값을 모두 방문하는 3을 생성원이라고 합니다.</p>
  <p>반면 2의 거듭제곱은 2·4·1만 방문합니다. 위수 3은 전체 크기 6을 나눕니다. 반복 주기가 만드는 작은 묶음으로 전체 곱셈군을 겹치지 않게 나눌 수 있기 때문에 일반적으로도 원소의 위수는 군의 크기를 나눕니다. 유한체의 0 아닌 원소 전체는 한 생성원의 거듭제곱으로 표현되는 순환군입니다.</p>
  <ExplainedFormula question="p−1번 곱해서 1이라는 확인만으로 생성원인가요?" idea="짧은 반복 주기에 갇히지 않았는지 검사해야 합니다. p−1의 서로 다른 소인수 q마다 (p−1)/q제곱이 1이 아닌지 확인합니다." formula={String.raw`g\text{ generates }\mathbb F_p^*\iff\forall q\text{ prime},\ q\mid(p-1):g^{(p-1)/q}\ne1`} annotatedFormula={String.raw`\begin{aligned}p-1&=6=2\cdot3\\3^{6/2}&=\underbrace{3^3\bmod7}_{\text{주기 3으로 끝나는가}}=6\ne1\\3^{6/3}&=\underbrace{3^2\bmod7}_{\text{주기 2로 끝나는가}}=2\ne1\end{aligned}`} operations={[{expression:String.raw`(p-1)/q`,annotation:["전체 주기의 소인수 하나를 빼 짧은 주기를 검사합니다.","모든 서로 다른 소인수에 대해 확인합니다."]}]} terms={[{symbol:"g",name:"생성원 후보",description:"0 아닌 값이며 사례는 3입니다."},{symbol:"q",name:"전체 크기의 소인수",description:"6의 서로 다른 소인수는 2·3입니다."},{symbol:"p−1",name:"0 아닌 원소 수",description:"F₇에서는 6이며 생성원은 이 위수를 가집니다."}]} assumptions={["소수 p와 p−1의 소인수들을 알고 있습니다.","g^(p−1)=1만으로 생성원이라 판정하지 않습니다."]} interpretation="진짜 위수가 p−1의 더 작은 약수라면 빠진 소인수 q 하나에 대해 위수가 (p−1)/q도 나눕니다. 그러면 검사값이 1이 되므로 이 검사들이 모든 짧은 주기를 배제합니다." />
  <p>F₁₇에서는 3⁸=16이어서 3의 위수는 16입니다. 4의 거듭제곱은 4·16·13·1로 위수 4입니다. 정확한 크기 n의 반복 주기가 필요하면 n이 p−1을 나눌 때 생성원 g에서 g^((p−1)/n)을 구합니다. 이 n차 단위근은 <Link to="/cs/crypto/fft">NTT의 평가 위치</Link>에 쓰입니다.</p>
 </section>
 <section id="polynomial" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 계산 규칙을 계수로 적거나 여러 위치의 값으로 적습니다</h2>
  <p>F₇의 f(x)=1+2x는 계수[1,2]로 저장할 수 있습니다. 위치 0·1에서의 값[1,3]으로도 적을 수 있습니다. 단 1차 이하라는 조건이 있어야 두 기록으로 같은 규칙을 하나로 정합니다. 위치와 차수 조건을 버리면 값 목록만으로 규칙을 복원할 수 없습니다.</p>
  <p>같은 위치에서 f와 g를 평가했다면 f(x)g(x)는 두 평가값을 곱하면 됩니다. 그러나 곱한 규칙의 차수는 커집니다. f를 제곱하면 1+4x+4x²입니다. 위치 0·1의 값은[1,2]이며 이 두 값은 다른 1차식 1+x와도 같습니다. 2차 곱의 계수를 복원하려면 적어도 서로 다른 세 점이 필요합니다.</p>
  <p>0 아닌 A·B에서는 최고차항의 계수 곱이 0이 아니므로 곱의 차수는 두 차수의 합입니다. B가 0 아닌 다항식이면 A=QB+R, R의 차수는 B보다 작은 형태로 나눌 수 있습니다. 최고차항을 차례로 없애는 과정에서 그 계수의 역원이 필요합니다. 서로 다른 두 몫이 있다면 차이를 곱한 항의 차수가 나머지 차이보다 높아져 모순이므로 몫과 나머지도 유일합니다.</p>
  <p>예를 들어 x²−1을 x−1로 나누면 몫 x+1, 나머지 0입니다. 같은 체의 다항식 계산이 <Link to="/cs/crypto/lagrange">보간</Link>과 이후 다항식 검사의 바탕이 됩니다.</p>
 </section>
 <section id="root-bound" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 다른 두 규칙이 우연히 같은 위치는 차수가 제한합니다</h2>
  <p>F₇에서 R(x)=x²−1은 x=1과 6에서 0입니다. 다른 다섯 위치에서는 0이 아닙니다. R(r)=0인 r을 근이라고 합니다. 근 r마다 x−r이 인수로 필요하므로 0 아닌 d차 다항식에는 서로 다른 근이 d개를 넘을 수 없습니다.</p>
  <ExplainedFormula question="왜 2차인 x²−1은 일곱 위치 모두에서 0일 수 없나요?" idea="각 근의 일차 인수를 하나씩 떼면 차수가 하나씩 줄어듭니다. 차수보다 많은 서로 다른 인수의 곱이 0 아닌 다항식을 나눌 수는 없습니다." formula={String.raw`R\ne0,\ \deg R=d\quad\Longrightarrow\quad\#\{r:R(r)=0\}\le d`} annotatedFormula={String.raw`\begin{gathered}R(x)=\underbrace{(x-1)(x+1)}_{\text{두 일차 인수}}\\\{r\in\mathbb F_7:R(r)=0\}\\=\underbrace{\{1,6\}}_{\text{서로 다른 두 근}}\end{gathered}`} operations={[{expression:String.raw`x-r\mid R(x)`,annotation:["r에서 0이면 x−r로 나누었을 때 상수 나머지가 0입니다.","다른 근에서는 이미 뗀 인수가 0이 아니므로 다음 인수를 뗄 수 있습니다."]}]} terms={[{symbol:"R",name:"0 아닌 다항식",description:"모든 계수가 0인 식은 제외합니다."},{symbol:"d",name:"차수",description:"사례의 가장 높은 지수는 2입니다."},{symbol:"r",name:"근",description:"식에 넣었을 때 0이 되는 체의 값입니다."}]} assumptions={["같은 체의 다항식이며 R은 영다항식이 아닙니다.","근은 중복 횟수와 구분해 서로 다른 값의 개수를 셉니다."]} interpretation="영다항식은 모든 위치에서 0이므로 전제에서 제외합니다. x⁷−x도 F₇의 모든 위치에서 0이지만 0 아닌 7차식입니다. 차수가 체의 크기만큼 크면 일곱 근이 있다는 사실과 모순되지 않습니다." />
 </section>
 <section id="schwartz-zippel" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 거짓 규칙이 무작위 검사를 통과할 확률을 셉니다</h2>
  <p>두 규칙이 같다는 주장을 확인할 때 차이 R을 만듭니다. R=x²−1이라는 거짓 주장이라면 F₇에서 고른 한 위치가 1이나 6일 때만 0으로 보입니다. 일곱 위치를 같은 확률로 고르면 거짓 통과 확률은 2/7입니다. R을 먼저 고정하고 위치를 나중에 골라야 합니다.</p>
  <ExplainedFormula question="변수가 여러 개여도 차수로 거짓 통과를 제한할 수 있나요?" idea="한 변수에 관한 최고차항의 계수가 우연히 0이 되는 경우와, 그렇지 않아 남은 일변수 식에 근 개수 제한을 쓰는 경우를 나눕니다." formula={String.raw`R\not\equiv0,\ \deg R\le d,\ r\xleftarrow{\$}S^m\quad\Longrightarrow\quad\Pr[R(r)=0]\le\min(1,d/|S|)`} annotatedFormula={String.raw`\begin{gathered}\Pr[R(r)=0]\le\underbrace{d/|S|}_{\text{차수/후보 수}}\\R=x^2-1,\ S=\mathbb F_7\\\Pr=\underbrace{2/7}_{\text{일곱 중 두 근}}\end{gathered}`} operations={[{expression:String.raw`(d-k)/|S|+k/|S|=d/|S|`,annotation:["최고차항 계수가 사라질 확률과 남은 식의 근 확률을 합칩니다.","앞의 계수에는 변수 수에 대한 귀납을 사용합니다."]}]} terms={[{symbol:"d",name:"총차수",description:"여러 변수에서는 각 항의 지수 합 중 가장 큰 값입니다."},{symbol:"S",name:"선택할 값의 집합",description:"각 좌표를 같은 집합에서 독립·균등하게 선택합니다."},{symbol:"m",name:"변수 수",description:"R=x²−1은 1, R=xy는 2입니다."}]} assumptions={["0 아닌 R을 무작위 위치를 알기 전에 고정합니다.","모든 좌표를 독립적이고 균등하게 선택합니다. d/|S|≥1이면 유용한 작은 오류 보장이 아닙니다."]} interpretation="R(x,y)=xy를 F₇²에서 검사하면 x=0인 7쌍과 y=0인 7쌍에서 겹치는(0,0)을 빼 13/49가 통과합니다. 총차수 2의 상한 2/7=14/49보다 작습니다." />
  <p>
            귀납을 조금 더 보면 R을 마지막 변수의 k차식으로 쓰고 그 최고차항 계수를 A라고 합니다. A의 총차수는 d−k 이하입니다. 먼저 고른 좌표에서 A가 0일 확률은
            (d−k)/|S| 이하이고 A가 0이 아니면 남은 변수에서 근이 많아야 k개입니다. 두 경우의 상한을 합치면 d/|S|입니다.
          </p>
  <p>이 논리는 Schwartz 원문 Lemma 1과 Corollary 1의 근 개수와 표본 크기 비교에 대응합니다. 원문의 Q를 x²−1, 선택 집합 I를 F₇로 놓으면 차수 2에 일곱 후보를 대입한 2/7이 됩니다. 여러 변수의 최고차항 계수를 따로 보는 원문의 귀납도 위의 A로 이어집니다.</p>
  <p>다른 예로 차수 3, 선택 집합 크기 101이면 한 번의 상한은 3/101입니다. 같은 고정 R을 독립적으로 세 번 검사하면 상한은 27/1030301입니다. 같은 위치를 반복하면 독립 검사가 아닙니다. 위치 r을 먼저 본 뒤 R(x)=x−r을 고르면 언제나 통과하므로 사전 고정도 필수입니다. 거짓 식이 통과할 확률과 통과한 식이 거짓일 조건부 확률도 같지 않습니다.</p>
  <div id="paper-schwartz-zippel"><CitationBlock source="Schwartz (1980) · Polynomial Identity Verification, Lemma 1·Corollary 1" citeKey={2} href="https://doi.org/10.1145/322217.322225">원문의 다항식 고정과 근 개수 논리를 작은 F₇ 사례에 적용했습니다. 이 수학적 상한은 암호 프로토콜의 약속이 값을 고정하는지, 도전값을 어떻게 생성하는지까지 보장하지 않습니다.</CitationBlock></div>
 </section>
 <section id="extension-field" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 더 큰 체는 정수 기준만 키워서 만들지 않습니다</h2>
  <p>아홉 값의 체를 원한다고 정수를 mod9로 계산하면 3×3=0이 되어 체가 아닙니다. 대신 F₃의 값 두 개를 a+bu처럼 묶고 u²+1=0이라는 새 관계를 둡니다. u²=2로 줄이므로 언제나 a+bu 형태로 돌아오며 a·b의 조합은 3²=9개입니다.</p>
  <ExplainedFormula question="새 원소 1+u도 되돌리는 곱셈 상대가 있나요?" idea="곱을 전개한 뒤 u²를 2로 바꾸고 계수는 3으로 나눈 나머지를 취합니다. 최고차수 항을 지우는 관계가 새 체의 연산을 정합니다." formula={String.raw`\mathbb F_{p^k}\cong\mathbb F_p[u]/(m(u)),\quad a=\sum_{i=0}^{k-1}a_i u^i`} annotatedFormula={String.raw`\begin{gathered}(1+u)(2+u)\\=\underbrace{2+3u+u^2}_{\text{먼저 다항식으로 곱함}}\\=\underbrace{2+0+2}_{\text{계수 mod3, u의 제곱은2}}=1\end{gathered}`} operations={[{expression:String.raw`u^2=-1=2\quad\text{in }\mathbb F_3`,annotation:["새 관계 u²+1=0으로 높은 차수 항을 줄입니다.","계수의 나머지 계산과 다항식의 나머지 계산을 구분합니다."]}]} terms={[{symbol:"m(u)",name:"새 관계를 정하는 다항식",description:"사례는 F₃ 위의 u²+1입니다."},{symbol:"aᵢ",name:"기저체의 계수",description:"사례의 각 계수는 0·1·2 중 하나입니다."},{symbol:"k",name:"표현에 필요한 계수 수",description:"사례는 2이며 원소 수는 3²입니다."}]} assumptions={["m은 기저체에서 더 낮은 차수의 비상수식 곱으로 분해되지 않는 기약 다항식이어야 합니다.","곱한 뒤 계수와 다항식을 각각 정해진 기준으로 줄입니다."]} interpretation="1+u와 2+u의 곱이 1이므로 서로 역원입니다. HAC Fact 2.224와 Algorithm 2.226의 관계에도 (u+2)(u+1)+2(u²+1)=1 mod3을 대입할 수 있습니다." />
  <p>왜 이 관계는 괜찮을까요? F₃의 0·1·2를 u²+1에 넣으면 1·2·2여서 근이 없습니다. 2차식이 분해된다면 일차 인수가 있어 근도 생기므로 이 식은 기약입니다. 차수가 2보다 낮은 0 아닌 g와 기약 m의 최대공약수는 1이고 다항식의 확장 유클리드 계산은 sg+tm=1을 만듭니다. m으로 줄이면 sg=1이라 모든 0 아닌 값에 역원이 있습니다.</p>
  <p>같은 u²+1을 F₅에서 쓰면 2²+1=0입니다. (u−2)(u+2)=u²+1이므로 두 0 아닌 값의 곱이 0이 됩니다. 기저체가 바뀌면 같은 관계식을 그대로 가져오지 않습니다.</p>
  <p>유한체의 원소 수는 항상 소수의 거듭제곱 pᵏ입니다. 1을 반복해 더해 0으로 처음 돌아오는 횟수는 소수여야 합니다. 합성수라면 더 작은 두 0 아닌 값의 곱이 0이 되기 때문입니다. 이 소수체 위에서 각 원소를 k개의 좌표로 표현하면 조합 수가 pᵏ입니다. 같은 크기의 유한체는 연산을 보존하는 대응으로 연결되지만 실제 기저와 바이트 표현, 곱셈 비용은 다를 수 있습니다.</p>
 </section>
 <section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 나눗셈의 정확성과 암호 사용 조건을 함께 확인합니다</h2>
  <p>구현에서는 기준 소수, 값의 표현, 0 처리, 음수의 나머지, 곱셈 중간값의 넘침을 정합니다. 확장체라면 기약 다항식과 계수 순서도 일치해야 합니다. 유한체 수식이 맞더라도 실행 시간이나 메모리 접근에서 비밀이 새는지는 별도 검사입니다.</p>
  <p>작은 체는 계산을 설명하기 위한 것입니다. 본문은 역원과 거듭제곱, 다항식의 모든 작은 평가값, F₃ 확장체의 곱을 정수로 검산했습니다. 실제 서명 시스템이나 증명 라이브러리를 배포하고 보안·성능을 시험한 결과는 아닙니다.</p>
  <div id="paper-fips-finite-field"><CitationBlock source="NIST FIPS 186-5 · 서명 규격의 적용 범위" citeKey={3} href="https://csrc.nist.gov/pubs/fips/186-5/final">실제 서명은 승인된 알고리즘과 매개변수 규칙을 따릅니다. FIPS 186-5 Appendix D는 여러 타원곡선 세부 사항을 SP 800-186으로 옮겼고 이진체 곡선은 deprecated 상태라고 명시합니다. 여기서 만든 작은 체나 임의의 확장체가 승인된 서명 설정이라는 뜻은 아닙니다.</CitationBlock></div>
  <ReviewPrompts questions={["mod8에서 2의 역원을 찾을 수 없는 이유를 서로 다른 입력 1·5의 곱셈 결과로 설명할 수 있나요? (답: 5절)","x²−1을 F₇에서 한 번 검사할 때와 xy를 F₇²에서 검사할 때 실제 거짓 통과 확률은 각각 얼마인가요? (답: 13절)","F₃에서는 되는 u²+1 관계가 F₅에서 실패하는 이유는 무엇인가요? (답: 14절)"]}/>
 </section>
 </article>;}
