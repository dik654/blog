import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import { codeRefs, fileTrees } from "./codeRefs";

export default function ModernFieldArithmetic(){const sidebar=useCodeSidebar();return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 같은 답을 계산하되 저장하는 숫자를 바꿉니다</h2>
<p>
            7과 5를 곱한 뒤 17로 나눈 나머지는 1입니다. 컴퓨터에서도 이 답을 얻어야 하지만 계산 중에 반드시 7과 5를 그대로 저장할 필요는 없습니다. 값을 다른 숫자로 바꿔 두면
            반복 곱셈을 더 편한 명령으로 처리할 수 있습니다.
          </p>
<p>
            입력으로 받은 7과 5가 내부에서 3과 7로 바뀌고 곱셈 뒤 15를 거쳐 다시 답 1로 돌아오는 과정을 따라갑니다. 그런 다음 실제 ark-ff 코드에서 표현과 입력 검사,
            곱셈과 실패 처리가 어디에 있는지 확인합니다.
          </p><ContentBoundary article="field-arithmetic" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 숫자를 받아 계산하고 약속한 바이트로 내보냅니다</h2>
<p>입력에는 두 숫자뿐 아니라 어느 수로 나머지를 정할지도 필요합니다. 이번 계산에서는 17을 사용하고 결과는 0부터 16 사이로 정합니다. 밖에서 들어온 바이트를 숫자로 해석한 다음 허용 범위를 검사합니다.</p>
<p>계산 중에는 내부 표현을 유지합니다. 결과를 밖으로 보낼 때 원래 의미의 숫자로 되돌리고 약속한 바이트 순서로 씁니다. 수학적으로 같은 값이라도 내부 저장 숫자와 외부 바이트를 그대로 바꾸어 쓰면 다른 답을 전달할 수 있습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 7×5의 답을 내부 숫자 15로 보관합니다</h2>
<p>작은 학습 사례로 p=17과 R=32를 정합니다(가정). 숫자 a를 저장할 때 a×32를 17로 나눈 나머지를 씁니다. 그러면 7은 224의 나머지 3으로, 5는 160의 나머지 7로 저장됩니다.</p>
<p>저장한 3과 7을 곱하면 21입니다. 여기에 뒤에서 설명할 변환을 적용하면 15가 됩니다. 같은 저장 규칙에서 숫자 1은 1×32 mod17=15이므로 답 1을 내부 형식으로 보관한 것입니다.</p>
<p>외부에 보낼 때는 저장 규칙을 되돌려 1을 얻습니다. 이제부터 일반 숫자 7·5·1과 내부 숫자 3·7·15를 구분해 적겠습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 입력과 출력에서 바꾸고 계산 중에는 같은 형식을 씁니다</h2>
<FlowRail title="같은 7×5 mod17 계산의 전체 경로" steps={[{actor:"입력",movement:"7과 5를 검사하고 각각 R을 곱한 표현으로 바꿉니다.",receives:"내부 3·7"},{actor:"곱셈",movement:"3×7=21에 R의 역원을 한 번 적용합니다.",receives:"내부 15"},{actor:"출력",movement:"남은 R 배율을 되돌려 일반 숫자로 읽습니다.",receives:"답 1"}]} />
</section>
<section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 두 번 붙은 배율을 한 번 지워야 표현이 유지됩니다</h2>
<p>두 입력을 각각 R배 해 두었으므로 저장 숫자끼리 곱하면 원래 곱에 R²이 붙습니다. 곱셈 뒤에는 R을 한 번 지워야 결과도 다른 값과 똑같이 R배 된 형식으로 남습니다. 이 단계를 빼면 다음 곱셈이 다른 의미의 숫자를 받습니다.</p>
<p>
            큰 소수로 나눈 나머지를 매번 직접 구하는 작업은 여러 기계 명령이 필요할 수 있습니다. R을 2의 거듭제곱으로 잡으면 R로 나눈 나머지는 낮은 비트를 고르고 정확히
            나누어떨어지는 R 나눗셈은 비트를 옮겨 처리할 수 있습니다. 어떤 배수를 더하면 정확히 나누어떨어지는지가 핵심입니다.
          </p>
<p>처음과 끝의 변환도 비용이 듭니다. 같은 소수 아래에서 곱셈을 여러 번 이어 할 때 그 비용을 나눠 부담합니다. 실제 속도는 숫자 크기와 구현, CPU 명령에 따라 확인해야 합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 저장 표현과 계산 규칙에 이름을 붙입니다</h2>
<p>소수 p로 나눈 나머지의 계산 공간은 유한체 Fp입니다. 0≤a&lt;p로 고른 보통 숫자를 정규 대표값, aR mod p로 바꿔 저장한 숫자를 Montgomery 표현이라고 부릅니다. 같은 체의 값을 다른 숫자로 적는 방법입니다.</p>
<p>
            REDC는 입력 T에서 TR⁻¹ mod p를 구하는 변환입니다. 곱셈 중에 쓰면 두 입력의 배율 R²을 R 하나로 줄이고 출력 경계에서 쓰면 남은 R도 지웁니다. 역원은 곱했을
            때 나머지가 1이 되는 값입니다.
          </p>
<p>큰 정수를 기계가 다루는 여러 자리로 나눴을 때 각 자리를 limb라고 부릅니다. 바이트를 값으로 바꾸는 일은 역직렬화, 값을 바이트로 쓰는 일은 직렬화입니다. 이 둘의 형식과 계산 중의 저장 형식은 각각 정해야 합니다.</p>
</section>
<section id="representation" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 여러 자리 정수와 바이트 순서를 따로 읽습니다</h2>
<ExplainedFormula question="64비트 두 자리에 [5,1]이 있으면 어떤 정수인가요?" idea="첫 자리는 그대로, 다음 자리는 2⁶⁴배 해서 더합니다. 각 자리의 위치가 값에 주는 배율을 복원합니다." formula={String.raw`x=\sum_{i=0}^{L-1}\ell_i2^{64i}`} annotatedFormula={String.raw`\begin{gathered}[\ell_0,\ell_1]=[5,1]\\x=5+1\cdot2^{64}\\=18446744073709551621\end{gathered}`} operations={[{expression:String.raw`\ell_i2^{64i}`,annotation:["i번째 limb를 그 자리의 크기만큼 옮깁니다.","각 limb는 0부터 2⁶⁴−1 사이입니다."]}]} terms={[{symbol:"L",name:"limb 개수",description:"소수와 구현에 맞춰 정합니다. 모든 체가 네 자리를 쓰는 것은 아닙니다."},{symbol:"ℓᵢ",name:"i번째 자리",description:"여기서는 낮은 자리부터 배열에 저장합니다."}]} assumptions={["64비트 limb를 낮은 자리부터 저장하는 표현입니다.","복원한 정수가 일반 값인지 Montgomery 저장값인지 별도로 표시합니다."]} interpretation="같은 배열이라도 그 안에 aR mod p를 담았다면 바로 외부 정수 a가 되지 않습니다. 먼저 계산용 배율을 되돌려야 합니다." />
<p>바이트 순서도 별도 약속입니다. 두 바이트 [0x05,0x01]은 little-endian으로 읽으면 5+256=261이고 big-endian으로 읽으면 5×256+1=1281입니다. 내부 limb가 낮은 자리부터 있다는 사실만으로 외부 통신 형식까지 정해지지 않습니다.</p>
<p>정규 입력만 받는 F₁₇ 디코더는 17을 거부해야 합니다. 17을 0으로 줄여 받으면 0과 17이라는 서로 다른 입력이 같은 값이 됩니다. 어떤 생성자는 의도적으로 나머지를 계산하므로 두 기능을 구분해 사용합니다.</p>
</section>
<section id="montgomery-form" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">8. 내부 숫자 3은 일반 숫자 7을 뜻합니다</h2>
<ExplainedFormula question="내부 곱셈의 결과가 왜 abR의 표현으로 남나요?" idea="입력마다 붙인 R을 세어 보면 곱에서는 R²입니다. REDC가 역원 하나를 곱해 R 하나만 남깁니다." formula={String.raw`\begin{gathered}\widetilde a=aR\bmod p\\\operatorname{REDC}(\widetilde a\widetilde b)=abR\bmod p\end{gathered}`} annotatedFormula={String.raw`\begin{gathered}\widetilde7=3,\quad\widetilde5=7\\\operatorname{REDC}(3\cdot7)=15\\15=\underbrace{1\cdot32\bmod17}_{\text{답 1의 내부 표현}}\end{gathered}`} operations={[{expression:String.raw`(aR)(bR)R^{-1}=abR`,annotation:["이 등식은 같은 p로 나눈 나머지에서 읽습니다.","곱셈 결과가 다른 내부 값과 같은 형식으로 돌아옵니다."]}]} terms={[{symbol:"R",name:"계산에 편한 기준",description:"학습 사례는 32입니다. p보다 크고 p와 서로소여야 합니다."},{symbol:"R⁻¹",name:"R의 역원",description:"32×8 mod17=1이므로 사례에서는 8입니다."},{symbol:"ã",name:"내부 저장값",description:"a와 의미는 같지만 보관하는 숫자는 다를 수 있습니다."}]} assumptions={["p는 홀수 소수, R은 p보다 큰 2의 거듭제곱입니다.","같은 곱셈에 들어오는 두 값이 모두 같은 Montgomery 표현입니다."]} interpretation="내부의 ONE도 일반 정수 1과 다를 수 있습니다. 이 사례에서는 R mod17=15가 내부의 곱셈 단위원입니다." />
<p>
            한 입력만 일반 숫자로 넣으면 틀립니다. 7의 내부값 3 대신 일반값 7을 넣고 5의 내부값 7과 곱하면 REDC(49)=1입니다. 이 1을 정상적인 내부 결과로 읽어 출력
            변환하면 8이 나옵니다. 원래 답 1과 다르므로 타입이나 생성 경계가 이런 혼용을 막아야 합니다.
          </p>
</section>
<section id="redc" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">9. 17의 배수를 더해 낮은 다섯 비트를 0으로 만듭니다</h2>
<p>p′는 pp′≡−1 mod R을 만족하도록 미리 정합니다. p=17과 R=32에서는 p′=15입니다. 17×15=255가 32로 나눈 나머지 31, 즉 −1이기 때문입니다.</p>
<ExplainedFormula question="T=21을 어떻게 32로 정확히 나눌 수 있나요?" idea="낮은 비트를 없애 줄 p의 배수를 고릅니다. p의 배수를 더하므로 mod p의 의미는 유지되고, R로 나누면 역원 배율이 적용됩니다." formula={String.raw`\begin{gathered}m=(Tp')\bmod R\\u=(T+mp)/R\\\operatorname{REDC}(T)=\begin{cases}u-p&u\ge p\\u&u<p\end{cases}\end{gathered}`} annotatedFormula={String.raw`\begin{gathered}m=21\cdot15\bmod32=27\\T+mp=21+27\cdot17=480\\u=480/32=15\end{gathered}`} operations={[{expression:String.raw`T+mp\equiv T-T=0\pmod R`,annotation:["m의 선택 때문에 R로 정확히 나누어떨어집니다."]},{expression:String.raw`uR\equiv T\pmod p`,annotation:["더한 mp는 p의 배수입니다.","R의 역원을 곱하면 u≡TR⁻¹ mod p입니다."]}]} terms={[{symbol:"p′",name:"낮은 자리 취소 상수",description:"p의 음의 역원을 R로 줄인 값입니다."},{symbol:"m",name:"더할 p의 배수",description:"0≤m<R로 고릅니다."},{symbol:"u",name:"정확한 나눗셈 결과",description:"최종 범위보다 클 수 있어 p를 한 번 뺍니다."}]} assumptions={["0≤T<pR이며 gcd(p,R)=1입니다.","T+mp의 상위 비트가 잘리지 않게 계산합니다."]} interpretation="T<pR과 m<R에서 0≤T+mp<2pR이므로 0≤u<2p입니다. 따라서 p를 많아야 한 번 빼면 0≤결과<p가 됩니다. 범위 증명이 한 번의 보정을 정당화합니다." />
<p>두 내부 입력이 각각 p보다 작으면 T&lt;p²&lt;pR이므로 이 조건을 만족합니다. 범위를 무시해 T=1088=2×17×32를 넣으면 m=0, u=34이고 한 번 빼도 17이 남습니다. 이 값은 정규 범위 밖이므로 같은 보정 규칙을 임의의 입력에 쓸 수 없습니다.</p>
</section>
<section id="trace" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">10. 원 논문의 변환으로 같은 요청을 끝까지 계산합니다</h2>
<AlgorithmBlock title="p=17, R=32에서 7과 5를 넣고 1을 꺼내기" input={["일반 숫자 7과 5, p′=15, R² mod17=4"]} steps={[{code:"enter(7): REDC(7*4)=REDC(28); m=4; (28+4*17)/32=3",note:"입력에 R²을 곱한 뒤 REDC로 R 하나를 지워 내부 7R을 만듭니다."},{code:"enter(5): REDC(20); m=12; (20+12*17)/32=7",note:"두 번째 입력도 같은 형식으로 바꿉니다."},{code:"multiply: REDC(3*7); m=27; (21+27*17)/32=15",note:"앞 절에서 계산한 동일한 곱셈입니다."},{code:"leave(15): m=15*15 mod32=1; (15+17)/32=1",note:"출력 경계에서 남은 R을 지워 일반 답 1을 얻습니다."}]} output="1. 직접 계산한 7×5 mod17과 같습니다." />
<p>
            Montgomery의 1985년 원문 519쪽은 같은 변환을 REDC라고 적고 소수를 포함한 법을 N, 취소 상수를 N′라고 씁니다. N=17과 N′=15를 넣으면 위의
            T=21, m=27, t=15입니다. 원문은 N이 꼭 소수일 필요는 없지만 이 글의 유한체에서는 소수를 사용합니다.
          </p>
<p>
            원문 520쪽은 입력 변환에 REDC((x mod N)(R² mod N))을 사용하고 출력에는 REDC를 한 번 적용합니다. 위의 3·7·15·1은 이 원문 경로에 같은 수를
            넣은 결과입니다. 입력·상수는 처음에 바꾸고 반복 계산 사이에는 내부 형식을 유지한다는 이유도 여기서 이어집니다.
          </p>
<div id="paper-montgomery"><CitationBlock source="Montgomery (1985) · pp. 519–520, Algorithm REDC" citeKey={1} href="https://doi.org/10.1090/S0025-5718-1985-0777282-X">원 논문의 입력 범위와 한 번의 보정 증명, R²을 이용한 진입과 출력을 같은 작은 사례에 적용했습니다.</CitationBlock></div>
</section>
<section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">11. 실제 64비트 코드에도 7과 5를 넣습니다</h2>
<p>이번 실험은 p=17의 MontConfig를 직접 구현하고 연산 함수를 덮어쓰지 않아 아래 기본 Rust 경로를 사용합니다. 보통 사용하는 derive(MontConfig)는 별도의 연산 코드를 생성할 수 있으므로 같은 숫자 결과만으로 실행 경로까지 같다고 판단하지 않습니다.</p>
<CodeViewButton label="실제 실행한 실험 구성 · 기본 메서드 선택" onClick={()=>sidebar.open("experiment",codeRefs.experiment)} />
<p>이제 ark-ff 0.5.0의 v0.5.0 태그가 가리키는 commit 7ad88c46…을 고정합니다. 원문의 MontConfig는 MODULUS와 R·R2·INV를 제공하며 from_bigint가 입력을 검사합니다. 전체 원문을 코드 패널에서 읽을 수 있습니다.</p>
<p>
            실제 구현은 64비트 limb를 씁니다. p=17을 한 limb로 구성하면 계산 기준 R은 2⁶⁴이고 라이브러리의 R 상수에는 그 나머지 1을 보관합니다. R2도 1입니다.
            학습용 R=32와 달리 이 작은 소수에서는 내부 숫자가 일반 숫자와 우연히 같아집니다. 저장 규칙은 그대로 적용됩니다.
          </p>
<CodeViewButton label="원본 상수 정의 · 15–27행" onClick={()=>sidebar.open("constants",codeRefs.constants)} /><CodeViewButton label="원본 from_bigint · 357–369행" onClick={()=>sidebar.open("from-bigint",codeRefs["from-bigint"])} />
<p>
            from_bigint에 7을 넣으면 범위 검사 후 R2와 곱합니다. R2=1이라 내부값은 7이고 5도 내부값 5가 됩니다. 반대로 입력 17은 p 이상이라 None을
            돌려줍니다. 여기의 new_unchecked는 이미 검증된 내부 표현을 만들기 위한 통로이지 외부 입력 검사 함수가 아닙니다.
          </p>
<p>
            곱셈의 한 limb 경로에서 r[0]=7×5=35입니다. 원문 INV는 1085102592571150095이고 k=r[0].wrapping_mul(INV)는 낮은 64비트만
            남겨 1085102592571150093이 됩니다. 그러면 35+17k=2⁶⁴이므로 낮은 자리는 0, 위로 올라간 자리는 1입니다.
          </p>
<p>원문의 r[N−1]=carry1+carry2에 남는 값이 1이며 마지막 보정 뒤에도 1입니다. into_bigint에서 다시 변환하면 (1+17×INV)/2⁶⁴=1을 얻습니다. 교육용 표의 중간 숫자와 실제 64비트 코드의 중간 숫자는 달라도 같은 일반 답을 냅니다.</p>
<CodeViewButton label="원본 곱셈의 반복문 · 185–208행" onClick={()=>sidebar.open("multiply",codeRefs.multiply)} /><CodeViewButton label="원본 into_bigint · 373–389행" onClick={()=>sidebar.open("into-bigint",codeRefs["into-bigint"])} />
<p>이 고정 코드를 Rust에서 실제로 빌드해 p=17인 체를 만들고 같은 요청을 실행했습니다. 일반 입력 7·5의 내부값 7·5, 내부 곱 1, 출력 1과 상수를 확인했습니다. 작은 체의 모든 289개 입력쌍의 곱과 합도 독립 정수 나머지와 일치했습니다. 이는 특정 대상의 성능이나 상수 시간 실행을 검증한 결과가 아닙니다.</p>
<div id="paper-ark-ff-050"><CitationBlock source="arkworks-rs/algebra · v0.5.0, commit 7ad88c46…" citeKey={2} href="https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src">원문 파일과 태그를 확인하고 해당 revision을 실제 실험의 의존성으로 고정했습니다. N=1의 Rust 경로와 일반 API를 검토했습니다.</CitationBlock></div>
</section>
<section id="api" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 나눗셈 실패와 입력 거부는 실제 API마다 확인합니다</h2>
<p>F₁₇에서 5의 역원은 7이므로 1÷5=7입니다. 그러나 0에는 역원이 없습니다. 원본 inverse는 0에서 None을 반환합니다. 이 결과를 먼저 확인하면 호출자가 실패를 처리할 수 있습니다.</p>
<p>같은 라이브러리의 / 연산자는 inverse 결과에 unwrap을 사용합니다. 따라서 분모 0을 넣으면 Option을 돌려주는 대신 panic합니다. 편리한 연산자와 실패를 직접 다루는 함수가 같다고 가정하면 안 됩니다. 입력에 0이 올 수 있는 경로에서는 역원 결과를 먼저 처리합니다.</p>
<CodeViewButton label="원본 inverse의 0 처리 · 296–354행" onClick={()=>sidebar.open("inverse",codeRefs.inverse)} /><CodeViewButton label="원본 / 연산자의 unwrap · 719–730행" onClick={()=>sidebar.open("division",codeRefs.division)} />
<p>정규 역직렬화는 F₁₇의 바이트 17을 거부하지만 from_le_bytes_mod_order는 같은 17을 0으로 줄입니다. 두 동작 모두 용도가 있으므로 이름과 호출 위치를 확인해야 합니다. 모듈러 환원 함수로 입력 검사를 대신하면 잘못된 통신 형식을 받아들일 수 있습니다.</p>
<p>이 원본의 역직렬화는 reader에서 필요한 수만 읽습니다. 실제로 [5,99]를 넣으면 값 5를 읽고 99는 reader에 남았습니다. 메시지 전체가 정확히 한 값이어야 한다면 호출자가 남은 바이트가 없는지 검사해야 합니다. 원소 디코더가 전체 메시지 길이까지 검증한다고 가정하지 않습니다.</p>
<CodeViewButton label="원본 canonical 역직렬화 · 605–644행" onClick={()=>sidebar.open("decode",codeRefs.decode)} /><CodeViewButton label="원본 mod_order 생성자 · 59–103행" onClick={()=>sidebar.open("reduce",codeRefs.reduce)} />
</section>
<section id="fp-fr" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 좌표와 반복 횟수는 다른 나머지 규칙을 씁니다</h2>
<p>타원곡선 점의 좌표는 기저체의 수입니다. 점을 몇 번 더할지 정하는 스칼라는 선택한 부분군의 위수로 계산합니다. 두 소수를 각각 p와 r로 쓰면 좌표는 Fp, 스칼라는 Fr에 속합니다. 라이브러리의 Fq라는 이름이 기저체를 가리키기도 하므로 문자보다 실제 modulus와 역할을 읽습니다.</p>
<p>EIP-197의 alt_bn128은 좌표 식 y²=x³+3을 Fp에서 계산합니다. 생성점 (1,2)은 2²=1³+3=4라 이 식을 만족합니다. 원문의 소수 p와 군 위수 q는 다음과 같이 다르며, 원문 q가 이 글에서 r로 부른 값입니다.</p>
<dl className="space-y-4 rounded-xl border p-4 text-sm"><div><dt className="font-semibold">좌표의 p</dt><dd className="mt-2 break-all font-mono">21888242871839275222246405745257275088696311157297823662689037894645226208583</dd></div><div><dt className="font-semibold">스칼라의 r — EIP의 q</dt><dd className="mt-2 break-all font-mono">21888242871839275222246405745257275088548364400416034343698204186575808495617</dd></div></dl>
<p>크기와 바이트 수가 같아도 타입은 구분해야 합니다. 다만 바이트 자체가 어느 체에서 왔는지 항상 말해 주지는 않습니다. 작은 정수 5는 두 소수보다 작아 양쪽에서 유효합니다. 실제 실험에서도 F₁₇의 5를 직렬화한 [5]를 F₁₉ 디코더가 정상적으로 5로 읽었습니다.</p>
<p>
            따라서 다른 체의 입력을 반드시 거부하려면 프로토콜의 필드 위치나 명시적인 종류 표식으로 어떤 타입인지 정해야 합니다. 타입이 지정된 코드 안에서는 암묵적인 변환을 막고 외부
            바이트에서는 기대하는 타입과 인코딩을 확인합니다. 단순 범위 검사만으로 출처 타입을 판별할 수는 없습니다.
          </p>
<p>EIP-197은 좌표 한 개를 32바이트 big-endian으로 적고 p 이상은 거부합니다. 반면 이 ark-ff 직렬화 경로는 limb를 little-endian 바이트로 옮깁니다. 같은 숫자라는 이유로 라이브러리의 출력 바이트를 EIP 입력으로 바로 보내면 안 됩니다. 점이 곡선이나 요구한 부분군에 속하는지 확인하는 절차도 체 원소 검사와 별개입니다.</p>
<CodeViewButton label="원본 바이트 순서 · 148–166행" onClick={()=>sidebar.open("endian",codeRefs.endian)} />
<div id="paper-eip-197-field"><CitationBlock source="EIP-197 · Definition of the groups, Encoding" citeKey={3} href="https://eips.ethereum.org/EIPS/eip-197">좌표의 법과 군 위수, 32바이트 big-endian 규칙을 실제 값의 역할에 대응했습니다. 이 글은 pairing 연산 전체를 실행한 검증이 아닙니다.</CitationBlock></div>
</section>
<section id="carry" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 넘친 자리와 구현의 분기를 함께 확인합니다</h2>
<p>정규 값 두 개의 합은 2p보다 작으므로 p를 한 번 빼면 됩니다. 하지만 합의 넘친 비트를 먼저 버리면 이 논리가 깨집니다. p=17에서 16+16=32의 답은 15입니다. 5비트 저장 공간에서 넘친 1을 버려 0으로 만든 뒤 비교하면 잘못된 0을 돌려줍니다.</p>
<p>실제 코드도 add_with_carry의 결과와 modulus에 남는 비트가 있는지를 구분합니다. 뺄셈의 빌림과 곱셈 중간값의 상위 자리 역시 버릴 수 없습니다. REDC의 수학적 범위 증명과 실제 저장 공간의 범위 증명을 모두 지켜야 합니다.</p>
<p>여러 limb의 곱셈은 곱을 더하는 작업과 낮은 자리를 지우는 작업을 반복해서 엮을 수 있습니다. 원문은 이를 CIOS라고 설명합니다. 이 기본 경로의 N개 64비트 자리에서는 바깥 반복문이 N번 돌며, 본문의 한 limb 사례는 한 번입니다. 네 limb나 32비트 구현의 반복 수를 모든 체에 공통인 숫자로 읽지 않습니다.</p>
<p>원문의 INV는 한 자리 기준인 2⁶⁴의 음의 역원입니다. N이 여러 개일 때 전체 R=2⁶⁴ᴺ에 대한 p′와 같은 큰 정수라고 생각하면 안 됩니다. 구현은 각 단계에서 하위 한 자리를 취소하고 올림을 다음 자리로 넘깁니다.</p>
<p>어떤 분기를 쓰는지는 소수의 상위 비트, limb 수와 빌드 옵션에 따라 달라집니다. 특히 원문의 역원에는 값에 따른 while과 분기가 있습니다. 수학적으로 정답인 것과 비밀 입력에 대해 상수 시간인 것은 별도 조건입니다. 이 글의 실행은 입력·출력 대조이며 부채널 검증이 아닙니다.</p>
</section>
<section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 같은 값을 되찾는 검사와 잘못된 입력 검사를 나눕니다</h2>
<p>
            작은 체에서는 모든 입력쌍을 독립 정수 계산과 비교할 수 있습니다. 일반값→내부값→일반값이 원래 입력을 되찾는지 보고 곱셈은 직접 a×b mod p와 비교합니다. 내부 표현이
            잘못됐어도 구현끼리 같은 실수를 하면 대수 법칙만 확인하는 검사에서는 놓칠 수 있습니다.
          </p>
<p>별도로 0과 p−1, 거부해야 할 p를 넣고 올림과 빌림이 생기는 값을 검사합니다. 0의 역원, 남은 메시지 바이트, 다른 체에서도 유효한 5의 사례는 서로 다른 실패 조건입니다. 이들을 하나의 성공·실패 결과로 묶지 않습니다.</p>
<p>
            실험에서는 원본 commit과 Cargo.lock, Rust 버전을 기록했습니다. 학습용 R=32의 모든 289개 곱과 REDC의 허용 입력 범위를 정수로 대조하고 실제
            ark-ff의 한 limb 경로도 실행했습니다. 특정 곡선의 큰 체 전체, 어셈블리 분기나 모든 CPU에서의 결과를 검증했다는 뜻은 아닙니다.
          </p>
<p>성능을 비교할 때는 같은 체와 표현, 같은 작업을 고정합니다. 곱셈만의 시간과 입력 변환·직렬화를 포함한 시간을 각각 확인합니다. 유한체의 수학은 <Link to="/cs/crypto/finite-field">유한체</Link>, 그 값들을 여러 위치에서 계산하는 일은 <Link to="/cs/crypto/fft">NTT</Link>로 이어집니다.</p>
<ReviewPrompts questions={["p=17, R=32에서 내부값 15를 그대로 일반 결과로 내보내면 왜 틀리며 어느 계산을 거쳐야 하나요? (답: 8·10절)","REDC 입력 범위를 무시해 T=1088을 넣으면 한 번의 보정이 왜 부족한가요? (답: 9절)","다른 체에서 만들어진 바이트 5를 범위 검사만으로 거부할 수 있나요? 타입과 외부 형식은 어디에서 정하나요? (답: 12·13절)"]} />
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{check:{id:"check",label:"본문 검증 프로그램",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"},ark:{id:"ark",label:"ark-ff 0.5.0 · 7ad88c46",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"}}} />
</article>;}
