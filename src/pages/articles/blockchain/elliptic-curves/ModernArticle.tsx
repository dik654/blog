import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ModernCurveViz from "./viz/ModernCurveViz";
import { codeRefs,fileTrees } from "./codeRefs";
const PIN="https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c";
export default function ModernEllipticCurves(){const sidebar=useCodeSidebar();return <article className="space-y-14 [overflow-wrap:anywhere]">
<section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 점 (5,1)을 일곱 번 더하면 어디에 도착할까요?</h2>
<p>17칸짜리 좌표 격자에서 특정 조건을 만족하는 점만 골라 놓았다고 합시다. 시작점은 (5,1)입니다. 이 점을 정해진 규칙으로 일곱 번 더하면 (0,6)에 도착합니다. 좌표를 각각 일곱 배 해서 얻은 점과는 다릅니다.</p>
<p>이번 글은 이 작은 계산을 손으로 한 뒤 실제 코드의 좌표와 입력 검사에 대입합니다. 곡선의 점, 그 점을 저장한 세 숫자, 네트워크로 받은 바이트가 각각 무엇인지 구분하는 것이 목표입니다. 마지막에는 같은 덧셈 구조가 BN254의 두 점 집합과 페어링으로 어떻게 이어지는지 살펴봅니다.</p>
<ContentBoundary article="elliptic-curves"/>
</section>
<section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 점과 횟수를 받아 같은 규칙의 점을 돌려줍니다</h2>
<p>입력은 사용할 곡선의 규칙, 시작점 P, 더할 횟수 k입니다. 출력 [k]P는 P를 k번 더한 점입니다. k=0이면 더하기를 시작하기 전의 특별한 값 O를 돌려줍니다. 이 값은 어떤 점에 더해도 그 점을 바꾸지 않습니다.</p>
<p>서명이나 키 교환에서 공개하는 점도 이런 계산으로 만들 수 있습니다. 큰 곡선에서 P와 [k]P를 보고 k를 찾는 일은 별도의 어려운 문제입니다. 여기의 17칸 예는 계산을 전부 확인하기 위한 모형이며 비밀을 보호할 크기가 아닙니다.</p>
</section>
<section id="concrete" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 17로 나눈 값에서 같은 조건을 만족하는 점을 고릅니다</h2>
<p>좌표는 0부터 16까지 쓰고 모든 계산 결과를 17로 나눈 나머지로 바꿉니다. 점의 조건을 y²=x³+2x+2로 정합니다(가정). P=(5,1)을 넣으면 왼쪽은 1, 오른쪽은 125+10+2=137입니다. 137을 17로 나눈 나머지도 1이므로 P는 조건을 만족합니다.</p>
<p>같은 규칙으로 두 배한 점은 2P=(6,3), 여기에 P를 더하면 3P=(10,6)입니다. 다시 두 배하면 6P=(16,13), P를 더하면 7P=(0,6)이 됩니다. 이 다섯 점이 모두 같은 조건을 만족하는지 직접 대입할 수 있습니다. x=0이라는 이유로 마지막 점을 O와 같다고 읽지는 않습니다.</p>
<p>이 곡선에는 보통 좌표를 가진 점 18개와 O가 있습니다. 아래 그림은 앞의 18개만 표시합니다. O는 격자의 어느 좌표에 숨겨 둔 점이 아니라 덧셈 규칙에 따로 포함한 항등원입니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 같은 시작점을 더하며 현재 점을 옮깁니다</h2>
<ModernCurveViz/>
<p>점 사이에 실수 좌표의 연속된 선을 그리지 않았습니다. 여기서 선의 기울기를 계산할 때도 보통 실수 나눗셈이 아니라 17로 나눈 값의 역원을 씁니다. 그림에서 가까워 보이는 점이 덧셈 결과라는 규칙은 없습니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 반복 덧셈을 묶으면 큰 횟수도 짧게 계산할 수 있습니다</h2>
<p>일곱 번을 하나씩 더하는 대신 1→2→3→6→7로 묶었습니다. 현재 횟수를 두 배하거나 1을 더하는 두 동작만 필요합니다. 더할 횟수의 이진수를 왼쪽부터 읽으면 큰 정수에도 같은 방식을 적용할 수 있습니다.</p>
<p>점 덧셈 한 번에 필요한 좌표 나눗셈도 비용입니다. 컴퓨터는 같은 점을 다른 숫자 묶음으로 저장해 이 나눗셈을 뒤로 미룰 수 있습니다. 그러나 저장 형태를 바꾸어도 앞의 7P=(0,6)이라는 결과는 같아야 합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 점의 집합과 덧셈 규칙에 이름을 붙입니다</h2>
<p>17처럼 소수 p로 나눈 수의 세계를 유한체 Fₚ라고 합니다. p가 3보다 클 때 y²=x³+ax+b의 점과 O를 함께 쓰는 표현이 짧은 Weierstrass 형태입니다. 타원곡선으로 쓰려면 4a³+27b²가 0이 아니어야 합니다. 이번에는 4·2³+27·2²=140이고 나머지가 4이므로 이 조건을 만족합니다.</p>
<p>점 덧셈에는 항등원과 역원이 있고, 더하는 순서와 묶는 순서를 바꾸어도 같은 결과가 나옵니다. 이런 구조를 아벨군이라고 합니다. P=(5,1)의 역원은 −P=(5,16)이며 둘을 더하면 O입니다. 곡선 방정식만 적어 놓았다고 이런 성질이 자동으로 따라오는 것은 아니며 특이점이 없는 조건과 덧셈 법칙이 함께 필요합니다.</p>
<p>P를 반복해서 더해 처음 O로 돌아오는 최소 양의 횟수가 P의 위수입니다. 이번 P는 위수 19이며 모든 점을 방문합니다. 좌표를 계산하는 나머지 17과 반복 횟수가 돌아오는 주기 19는 다른 수입니다. 이 차이는 실제 코드의 BaseField와 ScalarField에도 남습니다.</p>
</section>
<section id="g1-curve" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 같은 점과 서로 다른 점의 덧셈을 직접 계산합니다</h2>
<p>먼저 P=(5,1)을 두 배합니다. 기울기에 들어갈 분모는 2y=2이고, 2에 곱해 1이 되는 역원은 9입니다. 따라서 기울기는 (3·25+2)·9를 17로 나눈 13입니다. 새 x는 13²−2·5=159의 나머지 6, 새 y는 13·(5−6)−1=−14의 나머지 3입니다.</p>
<ExplainedFormula question="두 점을 더할 때 무엇을 나누나요?" idea="서로 다른 x이면 좌표 차이의 비율을, 같은 점이면 접선에 해당하는 비율을 유한체에서 계산합니다." formula={String.raw`\lambda=(y_2-y_1)/(x_2-x_1)`} annotatedFormula={String.raw`\begin{gathered}\lambda=(y_2-y_1)(x_2-x_1)^{-1}\\(x_1\ne x_2)\\\lambda=(3x_1^2+a)(2y_1)^{-1}\\(P=Q,\ y_1\ne0)\\x_3=\lambda^2-x_1-x_2\\y_3=\lambda(x_1-x_3)-y_1\\P+(6,3):\ \lambda=2\\(x_3,y_3)=(10,6)\end{gathered}`} operations={[{expression:String.raw`(x_2-x_1)^{-1}`,annotation:"0 아닌 좌표 차이의 역원을 곱해 유한체에서 나눕니다."},{expression:String.raw`13^2-2\cdot5\equiv6`,annotation:"두 배한 점의 x좌표를 같은 나머지 규칙으로 계산합니다."}]} terms={[{symbol:"p",name:"좌표 체의 소수",description:"좌표 계산의 소수이며 이번에는 17입니다."},{symbol:"a",name:"곡선 계수",description:"곡선의 x 계수이며 이번에는 2입니다."},{symbol:"λ",name:"기울기",description:"유한체에서 계산한 기울기입니다."},{symbol:"(x₁,y₁), (x₂,y₂)",name:"두 입력 좌표",description:"같은 곡선에 속한 두 입력 점의 좌표입니다."},{symbol:"(x₃,y₃)",name:"출력 좌표",description:"합으로 얻은 점의 좌표입니다."}]} interpretation="서로 다른 점 P=(5,1), Q=(6,3)에서는 λ=(3−1)/(6−5)=2입니다. 4−5−6≡10과 2(5−10)−1≡6을 차례로 계산합니다."/>
<p>분모가 0인 입력은 같은 식에 억지로 넣지 않습니다. Q=−P이면 합은 O입니다. P=Q이면서 y=0인 경우도 두 배가 O입니다. 한 입력이 O이면 다른 입력을 그대로 돌려줍니다. 같은 곡선에 속한 두 점이라는 전제 아래 이 경우들과 위 식이 전체 덧셈을 나눕니다.</p>
<p id="paper-sec1-elliptic-curve">SEC 1 v2.0 §2.2.1의 덧셈 규칙에 이번 두 점을 대입한 계산입니다. 작은 예에서 모든 점 쌍을 검사하는 것과 일반적인 결합법칙의 증명은 구분해야 합니다. 뒤의 실행은 전자를 확인하며 모든 곡선의 성질을 새로 증명하지는 않습니다.</p>
<CitationBlock citeKey={1} source="SEC 1 v2.0 · §2.2.1 · Standards for Efficient Cryptography Group" href="https://www.secg.org/sec1-v2.pdf">소수체 곡선의 덧셈과 예외 조건에 작은 점을 적용합니다. 이 예는 권장 암호 곡선이 아닙니다.</CitationBlock>
</section>
<section id="scalar" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 7의 세 비트를 실제 반복문에 넣습니다</h2>
<p>7의 이진수는 111입니다. 누적값을 O로 시작하고 비트마다 두 배한 뒤, 비트가 1이면 P를 더합니다. 첫 비트에서는 2O+P=P, 둘째에서는 2P+P=3P, 셋째에서는 2·3P+P=7P입니다. 비트를 모두 처리한 누적값은 차례로 (5,1), (10,6), (0,6)입니다.</p>
<p>고정한 ark-ec의 sw_double_and_add_affine은 바로 이 순서입니다. 세 번의 double_in_place 호출과 세 번의 조건부 더하기가 발생합니다. 처음 O를 두 배하는 호출도 포함한 횟수입니다. 첫 1을 따로 처리하는 구현의 호출 수와 섞지 않습니다.</p>
<CodeViewButton label="원본 비트 반복문 열기" onClick={()=>sidebar.open("scalar",codeRefs["scalar"])} />
<p>이 반복문에는 비트에 따른 분기가 있습니다. 공개된 횟수로 입력을 검사하는 계산과 비밀 키로 공개점을 만드는 계산은 위협 조건이 다릅니다. 윈도 방식은 여러 비트를 묶고 미리 계산한 점을 저장하지만, 비밀에 따라 표의 다른 주소를 읽으면 추가 정보가 새어 나갈 수 있습니다. 이 실행만으로 일정 시간 구현이라고 판정하지 않습니다.</p>
</section>
<section id="jacobian" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">9. (3,8,2)는 같은 (5,1)을 다른 방식으로 저장합니다</h2>
<p>좌표 두 개를 바로 저장한 형태를 affine 좌표라고 합니다. Jacobian 좌표는 세 수 (X,Y,Z)를 들고 다니며 Z가 0이 아니면 x=X/Z², y=Y/Z³로 읽습니다. 같은 점을 나타내는 세 수가 여러 개라는 점이 핵심입니다.</p>
<ExplainedFormula question="세 숫자가 정말 같은 점을 나타내나요?" idea="공통 축척을 곱해도 마지막에 나누면 같은 좌표가 되도록 X·Y·Z의 지수를 맞춥니다." formula={String.raw`(X,Y,Z)\sim(\mu^2X,\mu^3Y,\mu Z)`} annotatedFormula={String.raw`\begin{gathered}(x,y)=(XZ^{-2},YZ^{-3}),\ Z\ne0\\(X,Y,Z)\sim(\mu^2X,\mu^3Y,\mu Z)\\\mu\ne0\\(5,1,1)\sim(3,8,2)\\2^{-1}=9,\quad 9^2\equiv13,\quad9^3\equiv15\\x=3\cdot13\equiv5\\y=8\cdot15\equiv1\pmod{17}\end{gathered}`} operations={[{expression:String.raw`3\cdot13\equiv5`,annotation:"저장한 X에 Z의 역원 제곱을 곱해 x를 복원합니다."},{expression:String.raw`8\cdot15\equiv1`,annotation:"저장한 Y에는 역원 세제곱을 곱합니다."}]} terms={[{symbol:"X,Y,Z",name:"Jacobian 좌표",description:"점의 Jacobian 표현에 쓰는 세 필드 원소입니다."},{symbol:"μ",name:"축척",description:"0 아닌 축척이며 이번에는 2입니다."},{symbol:"∼",name:"같은 점의 표현",description:"세 수가 같다는 뜻이 아니라 같은 affine 점을 뜻합니다."}]} interpretation="X에는 2², Y에는 2³, Z에는 2를 곱했습니다. 20을 17로 줄이면 3이므로 (3,8,2)가 됩니다."/>
<p>원본 Affine 변환은 z의 역원 한 번을 구하고 제곱과 곱으로 두 좌표를 복원합니다. 반복 중 나눗셈을 뒤로 미루는 대신 곱셈과 저장 공간이 늘어납니다. 빠른 정도는 구현과 장치에 달렸고 이 글에서는 시간을 측정하지 않았습니다.</p>
<CodeViewButton label="같은 점을 복원하는 원문 열기" onClick={()=>sidebar.open("normalize",codeRefs["normalize"])} />
<p>Z=0은 이 구현에서 O를 나타내는 별도 규칙입니다. 위 나눗셈을 적용하지 않습니다. 두 점을 비교할 때도 원시 세 수가 같은지만 보면 안 됩니다. 서로 다른 세 수를 정규화하거나, 같은 점인지 판정하는 좌표 관계를 사용해야 합니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">10. 원본 두 배 함수의 중간값도 같은 2P로 돌아옵니다</h2>
<p>이번 예를 그대로 실행하려고 좌표 체를 F₁₇, 반복 횟수의 체를 F₁₉, a=b=2, 생성점을 (5,1)로 정의했습니다. 원문은 arkworks의 커밋 7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c입니다. ark-ec와 ark-ff는 0.5.0이며 같은 저장소의 ark-bn254는 0.5.0-alpha.0입니다. 수학 예의 매개변수는 이 글이 정의했고 덧셈 함수는 고정 원본입니다.</p>
<p>Projective의 double_in_place에서 a=0인 빠른 분기를 건너뛰고 일반 분기를 읽습니다. 입력은 (X,Y,Z)=(5,1,1)입니다. XX=X²=8, YY=Y²=1, YYYY=1, ZZ=Z²=1이 됩니다. 이어 S=2((X+YY)²−XX−YYYY)=3이고 M=3XX+aZZ²=9입니다.</p>
<p>원문 다음 줄에 넣으면 새 X=M²−2S=7, 새 Z=2YZ=2, 새 Y=M(S−X)−8YYYY=7입니다. 즉 원시 출력은 (7,7,2)입니다. 9절처럼 나누면 x=7·13≡6, y=7·15≡3이므로 손으로 계산한 2P=(6,3)과 같습니다.</p>
<CodeViewButton label="XX·S·M과 실제 대입 줄 열기" onClick={()=>sidebar.open("double",codeRefs["double"])} />
<p>BN254의 G1은 a=0이므로 이 일반 분기와 다른 두 배 공식을 선택할 수 있습니다. 또한 고정 G1 설정의 projective 곱에는 GLV 경로가 있습니다. 작은 예의 반복문이나 중간 세 수를 모든 곡선과 모든 호출 경로의 실제 실행 순서라고 일반화하지 않습니다.</p>
<CitationBlock citeKey={2} source="arkworks algebra · 고정 커밋 · 공식 구현" href={PIN}>소스 파일과 Cargo.lock을 함께 보존했습니다. 검증 프로그램은 일반 a≠0 두 배 분기의 실제 결과를 확인합니다.</CitationBlock>
</section>
<section id="validation" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">11. 좌표를 저장했다는 사실만으로 유효한 점이 되지는 않습니다</h2>
<p>같은 Rust 타입 안에도 검사하지 않은 값이 들어갈 수 있습니다. Affine::new는 곡선과 부분군을 확인하지만 new_unchecked는 그 검사를 생략합니다. 안전하게 받은 값이라는 근거 없이 후자를 썼다면 타입 이름만으로 유효성을 추정해서는 안 됩니다.</p>
<CodeViewButton label="검사하는 생성자와 생략하는 생성자 열기" onClick={()=>sidebar.open("construct",codeRefs["construct"])} />
<p>실제 BN254 G1에 (1,1)을 검사 없이 저장하면 1≠1³+3이므로 곡선 위가 아닙니다. 그런데 is_in_correct_subgroup_assuming_on_curve만 부르면 true가 나옵니다. G1의 cofactor가 1이라 ‘곡선 위라고 가정하면’ 추가 부분군 검사가 필요 없기 때문입니다. 앞의 가정을 확인하는 is_on_curve를 빠뜨린 호출은 전체 검사와 다릅니다.</p>
<CodeViewButton label="G1의 true 앞에 붙은 가정 열기" onClick={()=>sidebar.open("g1",codeRefs["g1"])} /><CodeViewButton label="두 조건을 함께 검사하는 check 열기" onClick={()=>sidebar.open("validate",codeRefs["validate"])} />
<p>check는 두 조건을 함께 확인해 (1,1)을 거부합니다. 반면 O는 유효한 군 원소이므로 이 검사에서 통과합니다. SEC 1의 공개키 검사는 O를 거부하지만 모든 군 연산 입력이 공개키는 아닙니다. 항등원을 허용할지는 해당 프로토콜의 역할까지 읽어 정해야 합니다.</p>
</section>
<section id="subgroup" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">12. 곡선 위여도 원하는 반복 주기에 속하지 않을 수 있습니다</h2>
<p>이 경계만 보기 위해 같은 F₁₇에서 다른 곡선 y²=x³+2x를 씁니다. 이 곡선은 O까지 20개 점을 가집니다. G=(9,4)를 더하면 (8,16), (8,1), (9,13), O로 돌아오므로 위수는 r=5입니다. 전체 점 수 20을 r로 나눈 h=4를 cofactor라고 합니다.</p>
<p>T=(0,0)도 이 두 번째 곡선 위에 있지만 두 번 더하면 O입니다. 그래서 [5]T=T≠O이고 위수 5 부분군에는 속하지 않습니다. 앞 절의 첫 곡선에는 (0,0)이 없었습니다. 방정식을 바꾼 별도 반례라는 점을 유지해야 합니다.</p>
<p>[4]T를 계산해 원하는 부분군으로 옮기는 cofactor clearing을 하면 이번에는 O가 됩니다. 원래 입력이 그 부분군에 속하는지 검사해 거부하는 것과 입력을 다른 점으로 바꾸는 것은 다른 동작입니다. O를 금지하는 응용이라면 변환 뒤에도 그 조건을 확인해야 합니다.</p>
<p>소수 r에 대해 [r]Q=O이고 Q≠O이면 Q의 위수는 r입니다. 다만 이 조건을 특정 부분군의 소속 검사로 쓰려면 곡선의 군 구조와 선택한 부분군의 관계도 정해야 합니다. 같은 식을 아무 곡선에 복사해서 이름 붙인 부분군을 식별했다고 말하지 않습니다.</p>
</section>
<section id="g1-g2-bn254" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">13. BN254의 두 입력은 좌표 체와 검사가 다릅니다</h2>
<p>BN254에서는 G1의 점 좌표를 큰 소수체 Fₚ에, G2의 점 좌표를 Fₚ²에 저장합니다. G1의 곡선은 y²=x³+3이고 생성점은 (1,2)입니다. G2는 u²=−1을 둔 체에서 y²=x³+3/(9+u)인 twist의 특정 부분군입니다. 이 표현은 큰 확장체 쪽 점을 더 작은 두 계수 좌표로 다루게 합니다.</p>
<p>좌표 소수 p는 21888242871839275222246405745257275088696311157297823662689037894645226208583입니다. 두 부분군의 소수 위수 r은 21888242871839275222246405745257275088548364400416034343698204186575808495617입니다. 둘 다 큰 수이지만 같지는 않습니다. 좌표 정규 범위와 스칼라 반복 주기를 서로 바꿔 검사하면 안 됩니다.</p>
<p>G2의 전체 twist에는 선택한 부분군 밖의 점도 있습니다. 실제 실행에서는 x=(1,0)으로부터 곡선 위의 y를 구한 뒤, 이 점이 부분군 검사를 통과하지 못하는 것을 확인했습니다. [r]Q도 O가 아닙니다. cofactor를 곱한 점은 검사에 통과했으며 이번에는 O가 아니었습니다.</p>
<CodeViewButton label="G2의 매개변수와 부분군 검사 열기" onClick={()=>sidebar.open("g2",codeRefs["g2"])} />
<p>고정 G2 코드는 직접 r배하는 대신 p제곱 사상으로 옮긴 점과 6X²배한 점을 비교합니다. 여기의 대문자 X는 BN 곡선 설정의 정수 매개변수이며 점의 x좌표가 아닙니다. 실행에서는 이 검사와 별도의 r배 검사가 같은 잘못된 점을 거부하는지 대조했습니다. 해당 최적화 판정의 일반 증명을 이 예의 성공만으로 대신하지는 않습니다.</p>
</section>
<section id="pairing" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">14. 두 점에 붙인 2와 3이 결과의 6제곱으로 연결됩니다</h2>
<p>페어링 e는 G1의 점과 G2의 점을 받아 Fₚ¹² 안의 위수 r인 곱셈군 Gₜ 원소를 만듭니다. 점을 출력하는 함수가 아닙니다. 각 입력의 배수를 결과의 지수로 옮기는 쌍선형 성질 때문에 두 입력 사이의 관계를 검사할 수 있습니다.</p>
<ExplainedFormula question="두 배와 세 배의 관계를 어떤 값으로 확인하나요?" idea="두 입력에서 각각 반복한 횟수를 결과의 지수로 모읍니다. 유효한 부분군 입력에 적용하는 관계입니다." formula={String.raw`e([a]P,[b]Q)=e(P,Q)^{ab}`} annotatedFormula={String.raw`\begin{gathered}e([a]P,[b]Q)=e(P,Q)^{ab}\\e([2]P,[3]Q)=e(P,Q)^6\\e([2]P,[3]Q)e([-6]P,Q)=1\end{gathered}`} operations={[{expression:String.raw`2\cdot3=6`,annotation:"양쪽 점의 반복 횟수를 결과 군의 지수에 곱해서 모읍니다."},{expression:String.raw`6+(-6)=0`,annotation:"두 결과를 곱하면 지수가 상쇄되어 곱셈 항등원이 됩니다."}]} terms={[{symbol:"P,Q",name:"각 부분군의 생성점",description:"이 절에서는 BN254 G1과 G2의 생성점입니다."},{symbol:"a,b",name:"반복 횟수",description:"각 점에 곱한 정수이며 사례에서는 2와 3입니다."},{symbol:"1",name:"결과 군의 항등원",description:"곱셈으로 표기한 결과 군의 항등원입니다."}]} interpretation="지수 6과 −6이 상쇄됩니다. 검증 프로그램은 최종 지수화를 포함한 라이브러리 pairing과 multi_pairing으로 두 관계를 실제 확인했습니다."/>
<p>arkworks의 PairingOutput은 결과 군을 덧셈 인터페이스로 감쌉니다. 따라서 위에서 곱셈 항등원 1이라고 쓴 값의 검사는 코드에서 is_zero로 나타납니다. 필드 원소 0을 페어링의 곱셈 항등원이라고 바꿔 읽지 않습니다.</p>
<CodeViewButton label="결과 군의 zero와 필드 one 연결 열기" onClick={()=>sidebar.open("pairing",codeRefs.pairing)} />
<p>이 계산은 입력한 점들의 대수 관계를 확인합니다. 사용자가 어떤 명제를 증명하려는지, 공개 입력이 그 명제에 올바르게 연결되었는지, 설정 자료와 권한이 적절한지까지 자동으로 보증하지 않습니다. <Link className="text-primary hover:underline" to="/cs/crypto/pairing">Miller 계산과 최종 지수화</Link>는 연결 글에서 더 자세히 다룹니다.</p>
</section>
<section id="encoding" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 같은 점도 전송 규칙에 따라 다른 바이트가 됩니다</h2>
<p>앞의 작은 P=(5,1)로 돌아옵니다. SEC 1의 압축 규칙을 이 설명용 곡선에 적용하면 x 한 바이트와 y의 홀짝 정보를 써서 03 05가 됩니다. 비압축은 접두 04 뒤에 x와 y를 놓은 04 05 01입니다. x=5에서 가능한 y는 1과 16이므로 홀짝이 어느 점인지 정합니다. 이 바이트 예가 안전한 암호 매개변수라는 뜻은 아닙니다.</p>
<p>반대로 03 16을 읽을 때 16을 십육진 바이트로 해석하면 정수 22입니다. 좌표가 p=17 이상이므로 정규 범위를 벗어납니다. 이를 자동으로 22 mod 17=5로 줄여 원래 바이트와 같은 입력으로 받아들일지는 임의로 결정할 수 없습니다. SEC 1의 이 변환에서는 범위를 벗어난 좌표를 거부합니다.</p>
<p>고정 arkworks는 좌표 필드의 직렬화와 자체 flag를 씁니다. 이름이 compressed라고 해서 SEC 1의 접두 바이트가 붙는다고 가정할 수 없습니다. 실제 잘못된 G2를 Ark 압축 형식 64바이트로 저장한 뒤 정상 deserialize_compressed는 부분군 때문에 거부했습니다. 검사 생략 API는 같은 점을 돌려주었습니다. 이것이 입력 검사의 유무를 드러내는 사례입니다.</p>
<CodeViewButton label="원본 직렬화와 Validate 분기 열기" onClick={()=>sidebar.open("encoding",codeRefs["encoding"])} />
<p>SEC 1의 변환 규칙과 공개키 검사는 서로 다른 절입니다. 점으로 해석할 수 있는 O와 공개키로 허용할 수 있는 O도 같은 질문이 아닙니다. 먼저 바이트 규칙을 확인하고 그 다음 사용 목적의 조건을 적용합니다.</p>
</section>
<section id="precompile" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">16. Ethereum의 짧은 입력은 함수마다 다르게 처리합니다</h2>
<p id="paper-eip196-g1">EIP-196의 G1 덧셈은 x·y를 각각 32바이트 큰 자리 우선으로 읽고 (0,0)을 O로 사용합니다. 두 점의 기본 입력은 128바이트지만 짧으면 오른쪽을 0으로 채우고 남는 바이트는 무시합니다. 따라서 (1,2)만 담은 64바이트 입력은 둘째 점 O를 더해 같은 (1,2)를 돌려줍니다. 빈 입력도 실패가 아니라 O의 덧셈이 됩니다.</p>
<p>좌표가 p 이상이거나 곡선에 맞지 않으면 거부합니다. 반면 scalar multiplication의 32바이트 정수는 r 미만이어야 한다는 조건이 없습니다. r+1을 유효한 G1 점에 곱해도 같은 점으로 돌아옵니다. 좌표의 범위 검사와 반복 횟수의 입력 범위를 섞지 않습니다.</p>
<p id="paper-eip197-bn254">EIP-197의 페어링은 192바이트씩 G1·G2 쌍을 읽습니다. 길이가 그 배수가 아니면 실패하며 빈 입력은 빈 곱이므로 1을 돌려줍니다. G2의 각 Fₚ² 좌표 a·u+b는 a, b 순서로 전송됩니다. Ark의 c0+c1·u 내부 배열을 그대로 복사하면 순서가 뒤집힐 수 있습니다. 출력은 Gₜ 전체 바이트가 아니라 관계 성립 여부를 나타내는 32바이트 값입니다.</p>
<p>이 글의 실행에는 EIP-196 덧셈 입력만 문자 그대로 옮긴 작은 파서 모형이 있습니다. 빈 입력, 64바이트, 초과 바이트, p와 같은 좌표를 확인했습니다. 실제 EVM 클라이언트나 EIP-197 입력 파서를 실행한 것은 아닙니다. 운영 환경의 포크와 비용 규칙까지 검증한 결과로 확대하지 않습니다.</p>
<CitationBlock citeKey={3} source="EIP-196 · G1 addition and multiplication · Ethereum EIPs" href="https://eips.ethereum.org/EIPS/eip-196">오른쪽 0 채움·초과 바이트 무시·좌표와 스칼라의 서로 다른 범위를 확인합니다.</CitationBlock>
<CitationBlock citeKey={4} source="EIP-197 · pairing check · Ethereum EIPs" href="https://eips.ethereum.org/EIPS/eip-197">192바이트 길이 조건, G2 부분군과 계수 순서, 빈 곱의 출력을 구분합니다.</CitationBlock>
</section>
<section id="verification" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">17. 실행한 범위와 아직 보장하지 않는 범위를 구분합니다</h2>
<p>잠금 파일을 사용한 실제 Rust 실행에서 작은 곡선의 19개 점, 361개 점 쌍의 합, 0부터 19까지 20개 스칼라를 별도의 정수 나머지 계산과 비교했습니다. (3,8,2)의 정규화와 원본 두 배 출력 (7,7,2)도 확인했습니다. 별도 Python 전수 계산은 이 작은 군의 6,859개 세 점 묶음에 대한 결합법칙까지 확인했습니다.</p>
<p>큰 곡선에서는 생성점 검사, 곡선 밖 G1, 부분군 밖 G2, cofactor 변환, 검사 유무에 따른 역직렬화 차이를 실행했습니다. 14절의 두 페어링 관계도 확인했습니다. 반면 모든 비정상 바이트를 전수 검사하거나 서로 독립된 페어링 구현을 대조하지는 않았습니다. 같은 라이브러리의 결과 두 개가 일치하는 것만으로 독립 검증이 되지는 않습니다.</p>
<CodeViewButton label="가정과 검사를 포함한 실행 프로그램 열기" onClick={()=>sidebar.open("experiment",codeRefs["experiment"])} />
<p>실제 배포를 평가할 때는 선택한 곡선과 입력 형식, 정확한 라이브러리 버전부터 고정해야 합니다. 그 계약에 맞는 잘못된 길이와 좌표, 항등원, 다른 부분군을 확인한 뒤 독립 구현이나 해당 환경의 검증 벡터와 비교합니다. 비밀 스칼라의 시간·메모리 접근, 예외 처리와 자원 한도는 이 글의 산술 검사가 대신해 주지 않습니다.</p>
</section>
<section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">18. 한 조건을 바꾼 뒤 같은 결론이 남는지 예상합니다</h2>
<ReviewPrompts questions={["(3,8,2)와 (5,1,1)은 서로 다른 점일까요? 원시 숫자 비교와 좌표 복원을 나누어 답해 보세요. (답: 10절)","두 번째 곡선의 T=(0,0)은 곡선 검사만 통과하면 충분할까요? [5]T 검사와 [4]T 변환 뒤에 남는 조건을 비교하세요. (답: 12절)","64바이트의 G1 점만 받은 호출은 무조건 길이 오류일까요? EIP-196 덧셈과 EIP-197 페어링의 규칙으로 각각 예상해 보세요. (답: 16절)"]}/>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ark:{id:"ark",label:"arkworks · 고정 원문",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},check:{id:"check",label:"본문의 실제 실행",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}}}/>
</article>}
