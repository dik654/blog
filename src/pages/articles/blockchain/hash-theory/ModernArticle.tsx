import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import HashJourneyViz from "./viz/HashJourneyViz";
import { codeRefs, fileTrees, projectMetas } from "./codeRefs";
const PIN="https://github.com/RustCrypto/hashes/tree/f6c786d72ed4d37a32dcd32daa2e7277dd4683e1";
export default function ModernArticle(){const sidebar=useCodeSidebar();return <div className="space-y-16 [overflow-wrap:anywhere]">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 세 글자 abc가 같은 요약값이 되는 과정을 따라갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">서로 다른 두 컴퓨터가 파일의 내용이 같은지 확인하려 합니다. 이번 파일에는 줄바꿈 없이 영문 소문자 abc 세 글자만 들어 있습니다. 둘 다 정해진 계산을 하면 ba7816bf…로 시작하는 32바이트를 얻습니다. 하나가 대문자 A를 쓰거나 줄바꿈을 붙이면 계산 대상부터 달라집니다.</p>
<p className="leading-8">이 짧은 결과를 비교하면 큰 파일 전체를 다시 주고받는 부담을 줄일 수 있습니다. 다만 같은 결과를 만드는 서로 다른 입력은 반드시 존재합니다. 우리가 원하는 것은 아무 충돌도 존재하지 않는 계산이 아니라, 목적에 맞는 다른 입력을 실제로 찾아내기 어려운 계산입니다.</p>
<p className="leading-8">이 글에서는 abc의 정확한 바이트에서 출발해 첫 계산 단계와 마지막 결과를 확인합니다. 같은 입력을 SHA-3에도 넣고, 중간 상태가 공개되어도 되는 이유와 인증에 그대로 쓰면 실패하는 경우까지 연결하겠습니다.</p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 입력 바이트와 계산 규칙이 결과를 정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이번 계산에는 비밀키가 없습니다. 누구나 같은 입력과 SHA-256이라는 같은 규칙으로 결과를 재현할 수 있습니다. 입력이 얼마나 긴지에 관계없이 이 방식의 출력은 32바이트입니다. 16진수로 화면에 쓰면 한 바이트당 두 글자여서 64글자가 됩니다.</p>
<p className="leading-8">결과만 보고 파일 전체를 되찾는 기능은 없습니다. 가능한 긴 파일의 수가 32바이트 결과의 수보다 많기 때문입니다. 또한 결과를 누구에게서 받았는지도 계산이 정해 주지 않습니다. 공격자가 파일과 비교할 결과를 함께 바꾸면 단순한 재계산은 둘의 일치만 확인합니다.</p>
<p className="leading-8">따라서 파일의 무결성을 확인하려면 비교 기준을 신뢰할 수 있게 얻어야 합니다. 서명이나 신뢰한 배포 경로가 그 역할을 맡을 수 있습니다. 암호화처럼 내용을 감추는 역할과도 구별합니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. abc는 61 62 63이라는 세 바이트입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">ASCII와 UTF-8에서 이번 세 글자는 각각 16진수 61, 62, 63입니다. 한 바이트는 8비트이므로 입력 길이는 3×8=24비트입니다. 여기서 61은 두 문자 “6”과 “1”을 보내라는 뜻이 아니라 한 바이트의 수치를 적은 것입니다.</p>
<p className="leading-8">먼저 파일을 끝냈다는 표시와 원래 길이를 붙입니다. SHA-256은 이번 세 바이트 뒤에 80을 붙이고 00을 52바이트 붙인 뒤, 길이 24를 8바이트 0000000000000018로 적습니다. 합계는 3+1+52+8=64바이트입니다.</p>
<p className="leading-8">첫 네 바이트 61 62 63 80을 큰 자리부터 읽으면 32비트 정수 61626380입니다. 마지막 네 바이트는 00000018입니다. 글자에서 정수로 옮겨 가는 이 순서가 뒤의 코드와 표준에서 계속 유지되어야 합니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 입력·채움·반복 계산·출력의 네 장면을 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">아래 그림은 같은 abc가 64바이트 묶음이 되고 여덟 개의 32비트 값에 섞인 뒤 32바이트 결과가 되는 흐름입니다. 내부 값도 그림의 결과도 16진수로 적었습니다. 중간 숫자가 공개되어 있다는 사실 자체는 비밀 유출이 아닙니다.</p>
</div><HashJourneyViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 정해진 크기의 계산을 반복하면 긴 입력도 처리할 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">컴퓨터가 전체 파일을 한꺼번에 메모리에 올릴 필요는 없습니다. 일정한 크기의 묶음을 읽고 현재 상태를 바꾼 뒤 다음 묶음으로 넘어갈 수 있습니다. 입력 순서와 총길이를 함께 유지하면 파일을 여러 번에 나누어 받아도 같은 최종 결과를 만들 수 있습니다.</p>
<p className="leading-8">그 구조만으로 안전한 계산이 되지는 않습니다. 예를 들어 이전 값 h와 다음 수 m으로 3h+m을 계산해 17로 나눈 나머지만 남긴다고 합시다. 시작값 5에 7을 넣으면 22의 나머지 5이고, 다음 2를 넣으면 17의 나머지 0입니다. 연결 구조는 설명하지만 출력이 17개뿐이라 충돌을 쉽게 찾습니다.</p>
<p className="leading-8">실제 설계는 훨씬 큰 상태와 여러 종류의 비트 연산을 반복합니다. 곧 볼 덧셈·회전·비선형 연산은 입력의 영향을 퍼뜨리는 구체적인 방법입니다. 복잡해 보이는 그림이나 출력의 무작위한 모습만으로 안전성을 증명할 수는 없습니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 앞에서 본 역할에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">입력을 일정 길이 결과로 바꾸는 공개 계산을 해시라고 하고 결과를 다이제스트라고 합니다. 입력을 나누는 한 묶음은 블록, 계산 도중 유지하는 값은 상태입니다. 끝 표시와 길이 등을 붙여 필요한 형식으로 만드는 과정이 패딩입니다.</p>
<p className="leading-8">이전 상태와 한 블록을 받아 새 상태로 만드는 계산은 압축 함수입니다. 이런 함수를 차례로 연결하는 구조를 Merkle–Damgård 방식이라고 부릅니다. SHA-256의 블록은 512비트이고 연결 상태는 256비트입니다. 이를 h₀=IV, hᵢ=C(hᵢ₋₁,mᵢ), H(M)=hₖ로 적습니다. mᵢ는 패딩을 마친 i번째 블록이고 k는 그 블록 수입니다. 여기서 압축은 원본을 복원하는 파일 압축이라는 뜻이 아닙니다.</p>
<p className="leading-8">SHA-3는 더 큰 내부 상태의 일부에 입력을 섞고 그 상태 전체를 바꿉니다. 직접 입출력하는 부분은 입력 영역(rate)입니다. 나머지는 보호 영역(capacity)입니다. 이 방식은 스펀지 구조이며 뒤에서 같은 abc를 넣어 비교합니다.</p>
</div></section>
<section id="padding" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 표준의 24비트를 실제 64바이트에 맞춥니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">FIPS 180-4의 5.1.1절은 abc 자체를 패딩 예로 사용합니다. 원래 길이 24 뒤에 1비트, 0비트 423개, 길이를 적은 64비트를 붙입니다. 앞의 80은 1비트와 0비트 일곱 개이므로 남은 416비트가 52개의 00 바이트와 정확히 대응합니다.</p>
<p className="leading-8">패딩 전 입력이 55바이트이면 끝 표시 1바이트와 길이 8바이트를 더해 64바이트 한 블록에 들어갑니다. 56바이트이면 이 공간이 부족해 두 블록이 필요합니다. 64바이트를 정확히 채운 입력도 패딩을 생략하지 않으므로 마지막에 한 블록이 더 생깁니다.</p>
<p className="leading-8">이번에 검산한 길이 55, 56, 63, 64, 65바이트의 패딩 후 블록 수는 각각 1, 2, 2, 2, 2입니다. 길이를 기록한다고 어떤 패딩된 메시지도 다른 것의 접두어가 될 수 없다는 뜻은 아닙니다. 그 잘못된 결론이 왜 위험한지 12절에서 같은 abc로 확인합니다.</p>
</div><CodeViewButton label="직접 실행한 패딩과 블록 검사" onClick={()=>sidebar.open("padding",codeRefs["padding"])}/><CitationBlock source="NIST FIPS 180-4 · 5.1.1절, 인쇄 13쪽" href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf" citeKey={1}>표준의 abc·24비트·423개 0과 실제 64바이트 배열을 대조했습니다.</CitationBlock></section>
<section id="round" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 첫 라운드에서 61626380이 상태를 바꾸는 모습을 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">64바이트를 네 바이트씩 읽으면 16개의 입력 단어가 됩니다. W₀은 61626380, W₁부터 W₁₄까지는 0, W₁₅는 00000018입니다. 다음 48개는 앞 단어의 회전·오른쪽 이동·XOR와 나머지 덧셈으로 만듭니다. 이 64개가 각 라운드에 하나씩 들어갑니다.</p>
<p className="leading-8">라운드를 시작할 때 a부터 h까지 여덟 상태값은 표준이 정한 초기값입니다. 첫 a는 6a09e667이고 첫 e는 510e527f입니다. 실제 계산에서 T₁은 54da50e8, T₂는 08909ae5가 되어 새 a는 5d6aebcd, 새 e는 fa2a4622입니다.</p>
<p className="leading-8">XOR는 두 비트가 다르면 1이 됩니다. 회전은 버린 끝 비트를 반대 끝으로 가져오며, 오른쪽 이동은 빈 자리에 0을 넣습니다. Ch는 e의 비트가 1이면 f를, 0이면 g를 택합니다. Maj는 같은 위치의 세 비트 가운데 둘 이상이 1일 때 1입니다. 그래서 단순한 정수 덧셈 반복과는 다릅니다.</p>
</div><ExplainedFormula question="첫 라운드에서 새 a와 e는 어떻게 정해질까요?" idea={<>여덟 상태값 중 일부를 회전·선택·다수결로 섞고 현재 입력 단어와 상수를 더합니다. 모든 덧셈은 2³²로 나눈 나머지를 남깁니다.</>} formula={String.raw`T_1=h+\Sigma_1(e)+\operatorname{Ch}(e,f,g)+K_t+W_t,\quad T_2=\Sigma_0(a)+\operatorname{Maj}(a,b,c)`} annotatedFormula={String.raw`\begin{aligned}T_1&=h+\Sigma_1(e)\\&\quad+\operatorname{Ch}(e,f,g)+K_t+W_t\\T_2&=\Sigma_0(a)+\operatorname{Maj}(a,b,c)\\a'&=T_1+T_2\pmod{2^{32}}\\e'&=d+T_1\pmod{2^{32}}\\a'&=\mathtt{5d6aebcd}\\e'&=\mathtt{fa2a4622}\end{aligned}`} operations={[{expression:String.raw`\operatorname{Ch}(e,f,g)`,annotation:["e의 비트가 1이면 f를, 0이면 g를 고릅니다.","같은 자리의 세 비트를 비선형으로 결합합니다."]},{expression:String.raw`a'=(T_1+T_2)\bmod 2^{32}`,annotation:["이번 입력과 기존 상태의 두 기여를 더합니다.","넘친 비트를 버려 32비트 상태로 유지합니다."]}]} terms={[{symbol:"W_t",name:"이번 입력 단어",description:"처음 16개는 블록을 읽고 다음 48개는 앞 단어들을 섞어 만듭니다."},{symbol:"K_t",name:"라운드 상수",description:"표준이 정한 64개의 상수 중 이번 순서의 값입니다."},{symbol:"\\Sigma",name:"회전 결과의 XOR",description:"비트를 끝에서 처음으로 돌려 여러 위치의 영향을 합칩니다."},{symbol:"\\operatorname{Ch},\\operatorname{Maj}",name:"선택과 다수결",description:"각 비트에서 e가 f 또는 g를 고르거나 a·b·c의 다수 비트를 선택합니다."}]} assumptions={["SHA-256의 초기 상태와 64개 상수를 사용합니다.","식의 덧셈은 모두 32비트 나머지 덧셈입니다.","표의 8자리 수는 16진수이며 실제 첫 단계 검산값입니다."]} interpretation="T1=54da50e8, T2=08909ae5이므로 새 a는 5d6aebcd입니다. 나머지 상태는 정해진 순서로 이동합니다."/><CodeViewButton label="원문의 64라운드와 wrapping_add" onClick={()=>sidebar.open("round",codeRefs["round"])}/></section>
<section id="source-compression" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 고정한 Rust 원문에서 같은 첫 블록을 실행합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">읽은 소스는 RustCrypto hashes의 commit f6c786d72ed4d37a32dcd32daa2e7277dd4683e1입니다. 그 시점의 sha2 패키지는 0.11.0입니다. sha256/soft/compact.rs는 상태를 여덟 u32 변수로 꺼내 64라운드를 돌고 마지막에 원래 상태를 다시 더합니다.</p>
<p className="leading-8">원문은 입력 단어 64개를 모두 저장하지 않고 16칸 배열을 돌려 씁니다. 16번째 이후 단어를 계산한 뒤 block[i % 16]을 덮어쓰지만 필요한 앞 단어를 읽는 순서는 보존됩니다. 별도로 만든 Python 검산은 64개 배열을 모두 보관하도록 작성해 같은 결과를 비교했습니다.</p>
<p className="leading-8">마지막 라운드의 a부터 h를 그대로 내보내는 것도 아닙니다. 원문 43–50행은 각 값을 라운드 시작 전 상태에 더합니다. 이렇게 얻은 여덟 32비트 값을 큰 자리부터 바이트로 쓰면 전체 결과는 <code>ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad</code>입니다.</p>
<p className="leading-8">보존한 compact 원문과 상수 파일은 수정하지 않고 별도 Rust 호출 예제에서 컴파일했습니다. rustc 1.93.0으로 abc와 일곱 경계 입력을 실행해 Python의 독립 라운드 계산 및 hashlib 결과와 맞췄습니다. 이 실행은 선택한 compact 함수의 실행이며 이 컴퓨터의 전체 라이브러리가 항상 이 경로를 선택한다는 주장은 아닙니다.</p>
</div><CodeViewButton label="원문의 16칸 순환 배열" onClick={()=>sidebar.open("schedule",codeRefs["schedule"])}/><CodeViewButton label="마지막 상태 더하기와 블록 반복" onClick={()=>sidebar.open("feedforward",codeRefs["feedforward"])}/><CodeViewButton label="실제로 컴파일한 별도 호출 예제" onClick={()=>sidebar.open("native",codeRefs["native"])}/></section>
<section id="streaming" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. a 다음 bc를 받아도 최종 길이는 24비트입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 abc를 한 번에 보내거나 a 다음 bc로 보내면 최종 입력 바이트열은 같습니다. 마지막까지 같은 상태를 유지하고 끝낼 때 한 번만 패딩하면 결과도 같습니다. 반대로 a를 끝내 얻은 해시와 bc를 끝내 얻은 해시를 이어 붙이면 별개의 두 계산 결과이며 abc의 해시가 아닙니다.</p>
<p className="leading-8">원문의 Sha256VarCore에는 여덟 상태값과 처리한 전체 블록 수 block_len이 있습니다. 아직 64바이트가 안 된 부분은 바깥 버퍼가 보관합니다. 마지막 단계의 bit_len은 8×(버퍼에 남은 바이트 수+64×처리한 블록 수)입니다. abc에서는 8×(3+64×0)=24입니다.</p>
<p className="leading-8">길이 64바이트를 이미 처리했다면 버퍼가 비어도 원래 길이는 512비트입니다. 따라서 버퍼 길이만 보고 0길이 메시지의 패딩을 붙이면 잘못된 결과가 됩니다. 원문은 총길이를 len64_padding_be에 넘겨 마지막 블록을 만들고 결과를 to_be_bytes로 출력합니다.</p>
<p className="leading-8">이 패키지의 상태 저장용 직렬화에는 little-endian 코드도 있습니다. 중간 상태를 저장하는 형식과 외부 다이제스트 형식이 다른 것입니다. to_le_bytes라는 한 줄만 찾아서 SHA-256의 결과 바이트 순서라고 설명해서는 안 됩니다.</p>
</div><CodeViewButton label="원문의 상태·전체 길이·최종 출력" onClick={()=>sidebar.open("stream",codeRefs["stream"])}/></section>
<section id="input-security" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 아무 충돌 찾기와 정해진 결과 맞히기는 다른 문제입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">공격 목표를 세 가지로 나누겠습니다. 정해진 출력에 맞는 입력을 찾는 것이 역상 공격입니다. abc가 먼저 정해진 뒤 같은 결과를 내는 다른 입력을 찾는 것은 제2역상 공격입니다. 입력 두 개를 자유롭게 골라 결과가 같게 만드는 것은 충돌 공격입니다.</p>
<p className="leading-8">출력이 공정하게 16가지 중 하나가 되는 이상적인 4비트 함수를 생각해 봅시다. 서로 다른 입력 다섯 개를 평가할 때 아무 두 출력의 충돌 확률은 1−(16×15×14×13×12)/16⁵=4097/8192로 약 50.01%입니다. 반면 미리 정한 출력 하나를 다섯 번 안에 맞힐 확률은 1−(15/16)⁵로 약 27.58%입니다.</p>
<p className="leading-8">충돌에서는 이전 출력 모두가 다음 출력의 비교 대상이 되어 쌍이 빠르게 늘어납니다. n비트의 이상적인 함수에서 고전적 일반 공격의 규모를 역상·제2역상 약 2ⁿ, 충돌 약 2⁽ⁿ⁄²⁾라고 적는 이유입니다. 이는 실제 알고리즘의 모든 구조 공격이나 아주 긴 메시지에 대한 특수 공격을 배제하는 보증이 아닙니다.</p>
<p className="leading-8">실제로 SHA-256의 첫 한 바이트만 비교해 보았습니다. trial:7과 trial:11은 모두 24로 시작했고 12개 후보 안에서 한 쌍이 나왔습니다. abc의 첫 바이트 ba를 고정하면 target:265에서 맞아 266개 후보를 확인했습니다. 이 횟수는 이번 입력열의 관측값이며 기대 횟수도 전체 256비트 충돌도 아닙니다.</p>
<p className="leading-8">256비트 결과를 64비트로 잘라 저장한다면 이상적인 충돌 규모는 약 2³²입니다. 가능한 비밀번호가 적으면 출력이 길어도 후보를 하나씩 대입할 수 있습니다. 양자 공격의 질의·메모리·회로 비용도 별도 모형을 요구하므로 이 고전적 식만으로 양자 안전성을 결론 내리지 않습니다.</p>
</div></section>
<section id="length-extension" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. H(key || abc)를 인증값으로 쓰면 뒤를 잇는 경로가 생깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이번에는 자기 컴퓨터 안의 작은 검증자를 가정합니다. 설명용 키는 key! 네 바이트이고 메시지는 abc입니다. 검증자가 SHA-256(key || 메시지)만 인증값으로 비교한다고 합시다. 공격자는 일반적으로 키를 모르더라도 그 길이를 맞히고 기존 32바이트 결과를 알면 다음 계산을 시도할 수 있습니다.</p>
<p className="leading-8">원래 키와 메시지의 길이는 7바이트입니다. 여기에 붙는 패딩은 57바이트라 처리한 길이가 64바이트가 됩니다. 기존 결과는 이 시점의 전체 연결 상태이므로 여덟 u32로 읽어 새 시작 상태로 사용할 수 있습니다. 뒤에 느낌표 !를 붙이고 총길이를 65바이트로 잡아 계산을 이어 갑니다.</p>
<p className="leading-8">검증자에게 보낼 새 메시지는 abc와 그 57바이트 패딩과 !를 합친 61바이트입니다. 검증자는 앞에 자기 키 4바이트를 붙여 65바이트를 해시합니다. 로컬 실행에서 이 결과가 기존 결과로부터 이어 계산한 값과 정확히 같았습니다. 단순히 abc! 네 바이트를 보낸 경우와는 다른 메시지입니다.</p>
<p className="leading-8">이 예에서 원래 패딩된 바이트열은 새 메시지를 패딩한 바이트열의 앞부분입니다. 따라서 SHA-256 패딩을 “어떤 두 입력도 접두어로 겹치지 않게 한다”고 설명하면 틀립니다. 길이 기록은 필요하지만 이 인증 방식의 길이 확장을 막지는 못합니다.</p>
<p className="leading-8">HMAC은 키를 넣는 안쪽과 바깥쪽 계산을 따로 구성합니다. 같은 로컬 입력에서 기존 HMAC을 SHA-256 상태처럼 연장한 값은 새 메시지의 HMAC과 달랐습니다. 이 한 실행이 HMAC의 보안 증명은 아니며, 실패 원인을 확인한 예입니다. 실사용 인증에는 검토된 HMAC이나 명시적인 키 기반 방식을 사용하고 키·태그 길이·재생 방지 조건을 별도로 정합니다.</p>
</div><CodeViewButton label="자기 컴퓨터에서 실행한 길이 확장과 HMAC 비교" onClick={()=>sidebar.open("extension",codeRefs["extension"])}/></section>
<section id="sponge" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. SHA-3에서는 같은 abc를 1600비트 상태에 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">SHA3-256의 상태는 1600비트, 즉 64비트 값 25개입니다. 처음에는 모두 0입니다. 그중 앞의 1088비트인 136바이트가 입출력 구간이고 나머지 512비트는 직접 입출력하지 않습니다. 이것이 rate 1088, capacity 512라는 뜻입니다. 전체 폭 t=r+c=1600이며 한 블록의 흡수는 S←P(S XOR (mᵢ || 0ᶜ))로 적습니다. 앞부분에만 입력을 더한 뒤 P가 전체 상태를 바꿉니다.</p>
<p className="leading-8">abc 세 바이트 뒤에 06을 넣고 마지막 입출력 바이트에 80을 XOR합니다. 이번 한 블록은 abc 3바이트, 06 한 바이트, 00 131바이트, 80 한 바이트로 136바이트입니다. 처음 여덟 바이트를 little-endian으로 읽은 첫 값은 0000000006636261이고 17번째 값은 8000000000000000입니다.</p>
<p className="leading-8">입력 블록은 상태의 앞부분에 XOR되고 상태 전체가 24라운드 순열을 거칩니다. 마지막에는 앞부분의 바이트를 읽어 32바이트를 얻습니다. 이번 결과는 <code>3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532</code>입니다. SHA-256과 입력과 출력 길이는 같지만 계산 규칙이 달라 결과가 다릅니다.</p>
<p className="leading-8">capacity가 비밀키라는 뜻은 아닙니다. 이번 입력을 아는 사람은 0에서 시작한 모든 상태를 직접 재현할 수 있습니다. 직접 내보내지 않는 상태 부분이 이상적 순열 모형에서의 보안 분석에 기여하는 것이며, 입력 내용의 비밀성을 보장하지 않습니다.</p>
</div></section>
<section id="permutation" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 25칸을 섞는 다섯 단계도 같은 입력으로 추적합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">25개의 64비트 값을 5×5 격자로 놓습니다. θ 단계는 세로 열의 XOR에서 옆 열의 영향을 만들어 각 칸에 더합니다. ρ는 각 칸의 비트를 정해진 만큼 회전하고 π는 칸의 위치를 옮깁니다. χ는 같은 줄의 이웃 칸을 NOT·AND·XOR로 결합합니다. 마지막 ι는 첫 칸에 이번 라운드의 상수를 XOR합니다.</p>
<p className="leading-8">abc의 첫 라운드에서 첫 칸은 처음 0000000006636261에서 θ 후 0000000006636260으로 바뀝니다. 이 칸의 회전량과 이동 위치는 0이라 ρ와 π 후에도 같고, χ 후 0000040006636260, ι 후 0000040006636261이 됩니다. 다른 24칸도 함께 계산했으므로 이 첫 칸의 변화만 반복해 전체를 계산할 수는 없습니다.</p>
<p className="leading-8">이 다섯 단계를 라운드 상수를 바꾸며 24번 반복합니다. 상태 전체에 대한 순열은 뒤집을 수 있어도, 최종 1600비트 가운데 256비트만 받은 사람이 나머지를 그냥 복원할 수 있는 것은 아닙니다. 일반 스펀지 정의가 모든 경우에 순열을 요구하는 것은 아니지만 SHA-3의 이 내부 변환은 순열입니다.</p>
<p className="leading-8">FIPS 202의 상태 배치와 다섯 단계에 따라 별도로 만든 Python 모형을 실제 실행했습니다. abc뿐 아니라 빈 입력과 135·136·137바이트 입력의 SHA3-256이 hashlib와 일치했습니다. 이 모형은 설명용 검산이며 RustCrypto의 keccak 의존 라이브러리를 실행한 결과와 구별합니다.</p>
</div><CodeViewButton label="직접 만든 24라운드 모형과 비교" onClick={()=>sidebar.open("keccak-model",codeRefs["keccak-model"])}/><CitationBlock source="NIST FIPS 202 · 3.2절, Algorithm 7·8·9, 6.1절" href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf" citeKey={2}>상태 배치·다섯 단계·흡수와 출력·SHA3-256의 suffix를 읽고 같은 바이트를 대입했습니다.</CitationBlock></section>
<section id="source-sponge" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 원문의 06과 마지막 80이 들어가는 위치를 맞춥니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 RustCrypto commit의 sha3 패키지는 0.12.0입니다. 원문에서 Sha3_256의 입력 영역(rate)은 U136입니다. 출력 길이는 U32이며, 패딩 상수는 06입니다. update는 absorb_u64_le로 입력을 흡수하고 finalize_into는 pad 뒤에 f1600을 한 번 적용한 다음 read_state를 부릅니다.</p>
<p className="leading-8">pad 원문에서 현재 위치가 3이면 word_offset=3/8=0, byte_offset=3%8=3입니다. 따라서 06을 첫 64비트 값의 24번째 비트부터 XOR합니다. 다음 줄은 state[136/8−1], 즉 state[16]의 최상위 비트를 XOR합니다. abc에서 계산한 두 값과 정확히 맞습니다.</p>
<p className="leading-8">현재 위치가 135이면 두 연산이 마지막 바이트를 함께 바꾸어 06 XOR 80=86이 됩니다. 입력이 이미 136바이트를 채웠다면 그 블록을 먼저 처리하고 새 패딩 블록이 필요합니다. 135와 136의 차이는 단순히 00 한 바이트를 덜 붙이는 정도가 아닙니다.</p>
<p className="leading-8">pad와 read_state 원문도 수정하지 않고 Rust에서 실행했습니다. 이 작은 호출 예제는 State1600과 위치만 제공하는 SpongeCursor 대체 형식을 명시적으로 두었습니다. 실제 cursor의 흡수나 keccak 의존성의 f1600은 연결하지 않았습니다. 따라서 여기의 네이티브 확인 범위는 패딩 위치와 little-endian 출력이며 전체 sha3 API 실행은 아닙니다.</p>
</div><CodeViewButton label="원문의 입력 흡수·마무리·변형 선언" onClick={()=>sidebar.open("sha3-profile",codeRefs["sha3-profile"])}/><CodeViewButton label="원문의 패딩 위치와 little-endian 출력" onClick={()=>sidebar.open("sha3-pad",codeRefs["sha3-pad"])}/></section>
<section id="variants" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. SHA3·Keccak·SHAKE는 이름이 비슷해도 바꿔 넣을 수 없습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">원문에는 같은 136바이트 rate와 32바이트 출력을 사용하는 Keccak256도 있습니다. 그러나 패딩 상수는 01입니다. 같은 abc를 직접 만든 순열 모형에 넣으면 Keccak-256은 <code>4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45</code>가 되어 SHA3-256과 다릅니다. 이름이나 결과 길이만 보고 서로 대체할 수 없습니다.</p>
<p className="leading-8">FIPS 202는 SHA3의 도메인 비트를 01, SHAKE의 도메인 비트를 1111로 적습니다. 바이트 구현에서는 이 비트 순서와 pad10*1의 첫 1이 결합해 각각 06과 1f가 됩니다. 표준의 비트 문자열 01을 그저 16진수 01 한 바이트로 복사하면 SHA3가 되지 않는 이유입니다.</p>
<p className="leading-8">SHAKE128은 rate 168바이트와 capacity 256비트를 쓰고 출력 길이를 요청할 수 있습니다. abc의 앞 32바이트는 5881092d…로 시작합니다. 같은 입력의 64바이트 결과에서 앞 32바이트를 읽으면 정확히 같습니다. 길이만 바꿔 두 번 호출한 값을 독립적인 두 키라고 가정할 수 없습니다.</p>
<p className="leading-8">더 긴 출력을 만들 때는 rate 부분을 다 읽은 뒤 상태를 다시 섞어 다음 부분을 읽습니다. 검산은 SHAKE128의 32바이트와 200바이트를 hashlib와 비교해 이 경계도 확인했습니다. 출력 길이와 용도 이름을 프로토콜이 정해야 하며, capacity를 그대로 모든 공격의 보안 비트 수라고 부르지도 않습니다.</p>
</div></section>
<section id="encoding" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 같은 abc라도 두 필드의 경계는 해시가 찾아주지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">필드 두 개가 “ab”와 “c”인 경우와 “a”와 “bc”인 경우를 그냥 이어 붙이면 모두 abc입니다. 서로 다른 바이트를 같은 해시로 만드는 공격 이전에, 입력을 만드는 단계에서 이미 구별을 잃었습니다.</p>
<p className="leading-8">설명용 형식을 필드 번호 한 바이트, 길이 한 바이트, 값 순서로 정하면 첫 경우는 01 02 61 62 02 01 63이고 둘째는 01 01 61 02 02 62 63입니다. 여기서는 각 길이를 0부터 255까지로 제한하고 그 범위를 벗어나면 거부해야 합니다. 실제 형식은 더 긴 길이와 중첩 자료의 규칙까지 명시합니다.</p>
<p className="leading-8">화면에서 같은 é처럼 보이는 텍스트도 UTF-8 c3a9와 65cc81로 다를 수 있습니다. 어떤 서비스는 NFC 정규화 후 해시하고 어떤 서명 규격은 받은 바이트를 그대로 보존합니다. 모든 의미가 같아 보이는 입력을 무조건 한 형식으로 바꿔야 하는 것이 아니라, 프로토콜이 동등하다고 정한 입력만 같은 바이트로 만들도록 합의해야 합니다.</p>
<p className="leading-8">정수의 크기·부호·바이트 순서, 필드 순서, 중복 키의 허용 여부와 용도 태그도 이 합의의 일부입니다. 이름이 같은 해시를 호출했다는 사실만으로 두 구현이 같은 메시지를 처리했다고 결론 내릴 수 없습니다.</p>
</div></section>
<section id="merkle-boundary" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 트리의 구조와 인증은 해시 바깥에서 정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 해시를 여러 기록에 적용해 트리를 만들 때는 잎과 중간 가지를 구별해야 합니다. 예를 들어 잎은 00과 기록을, 내부는 01과 왼쪽·오른쪽의 고정 길이 해시를 이어 계산하는 형식을 정할 수 있습니다. 이 태그는 비밀이 아니라 해석할 문맥입니다.</p>
<p className="leading-8">자식 순서와 트리 크기, 기록 수가 홀수일 때의 처리도 별도 규칙입니다. 안전한 해시 하나를 골랐다고 이런 규칙이 자동으로 생기지 않습니다. 받은 루트 자체를 신뢰할 수 있는지도 여전히 확인해야 합니다.</p>
<p className="leading-8">같은 영수증의 포함 경로와 서명까지는 <Link to="/cs/crypto/crypto-primitives#case">암호 도구 글</Link>에서, 경로의 비용과 트리 형식은 <Link to="/cs/crypto/merkle-tree">Merkle 트리 글</Link>에서 이어 볼 수 있습니다. 증명 회로 안에서 해시를 계산하는 비용과 Poseidon의 설계도 별도 문제입니다.</p>
</div></section>
<section id="verification" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. 맞춘 결과와 실행하지 않은 범위를 함께 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">보존한 실행은 세 층으로 나뉩니다. 원문 그대로의 SHA-256 compact 함수는 별도 Rust 호출 예제에서 실행했습니다. SHA-3의 pad와 read_state도 원문을 실행했지만 주변 형식은 작은 대체 형식입니다. 전체 SHA-3와 SHAKE 라운드는 따로 작성한 Python 모형으로 실행해 hashlib와 대조했습니다.</p>
<p className="leading-8">SHA-256은 빈 입력과 abc, a를 55·56·63·64·65·128번 반복한 입력을 확인했습니다. 네이티브 함수에 전체 블록을 한 번에 주거나 한 블록씩 주어도 같았습니다. Python의 스트리밍 입력, 두 필드의 모호함, 첫 바이트만 비교한 두 공격 목표, 로컬 길이 확장과 HMAC 차이도 기록했습니다.</p>
<p className="leading-8">이 결과는 모든 입력의 정확성이나 일정한 실행 시간, 하드웨어별 성능을 입증하지 않습니다. 전체 Cargo 패키지와 런타임 CPU 분기, 실제 sponge_cursor·keccak 의존성 경로는 이번 네이티브 실행에 포함하지 않았습니다. 사용하는 버전과 대상 장치에 따라 그 경로를 따로 확인해야 합니다.</p>
<p className="leading-8">FIPS 180-4와 FIPS 202는 모두 2015년 판을 사용했습니다. 2026년 10월 4일 확인한 NIST 페이지의 개정 계획은 새 규격이 이미 발행되었다는 뜻으로 읽지 않았습니다. 원문 commit과 파일 SHA, 호출 예제와 관측 결과를 함께 보존해 이후 버전과 구별했습니다.</p>
</div><CodeViewButton label="검산 전체와 실행 범위" onClick={()=>sidebar.open("checks",codeRefs["checks"])}/><CitationBlock source="RustCrypto hashes · f6c786d 고정 원문" href={PIN} citeKey={3}>sha2 0.11.0·sha3 0.12.0의 원문과 라이선스를 보존했습니다. 함수 일부의 네이티브 실행과 자체 모형 실행을 구별합니다.</CitationBlock></section>
<section id="limits" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 세 글자의 경로에서 다음 결과를 예측합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">abc를 61 62 63으로 읽고 SHA-256의 끝 표시와 24비트 길이를 붙인 뒤, 64라운드와 마지막 상태 더하기를 거쳐 32바이트 결과를 얻었습니다. SHA-3에서는 같은 세 바이트를 더 큰 상태의 앞부분에 넣고 다른 패딩과 순열을 거쳤습니다.</p>
<p className="leading-8">두 방식 모두 입력 의미나 송신자의 권한을 스스로 판단하지 않습니다. 정확한 바이트 형식, 비교할 결과의 출처, 공격자가 무엇을 고를 수 있는지와 실제로 비교하는 출력 길이가 보장의 범위를 정합니다. 내부 계산을 이해한 뒤 그 앞뒤의 조건까지 확인해야 합니다.</p>
</div><ReviewPrompts questions={["abc를 a와 bc로 나눠 보낼 때 언제 같은 결과가 되고 언제 달라질까요? (답: 10절)","SHA-256 결과와 원래 키 길이를 알면 H(key || abc) 인증값에 어떤 메시지를 이어 붙일 수 있을까요? (답: 12절)","SHA3-256의 입력이 135바이트에서 136바이트로 늘면 패딩 블록은 어떻게 달라질까요? (답: 15절)"]}/></section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></div>;}
